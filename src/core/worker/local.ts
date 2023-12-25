// import isEqual from "lodash/isEqual";
import { Path, Node, Group } from "spritejs";
import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { BaseShapeOptions, BaseShapeTool, SelectorShape } from "../tools";
import { IWorkerMessage, IMainMessage, IBatchMainMessage, IworkId, IUpdateNodeOpt, IRectType } from "../types";
import { computRect, rotatePoints, scalePoints } from "../utils";
import { EmitEventType } from "../../plugin/types";

export class SubLocalWorkForWorker extends SubLocalWork {
    _post: (msg: IBatchMainMessage) => void;
    workShapes: Map<IworkId, BaseShapeTool> = new Map();
    private combineUnitTime: number = 600
    private combineTimerId?: number;
    private drawCount:number = 0;
    constructor(layer: Group, drawLayer: Group, postFun: (msg: IBatchMainMessage)=>void) {
        super(layer, drawLayer);
        this._post = postFun;
    }
    private drawPencilCombine(workId:IworkId) {
        const result = this.workShapes.get(workId)?.combineConsume();
        if (result) {
            const combineDrawResult: IBatchMainMessage = {
                render: {
                    rect:result?.rect,
                    isClear: true,
                    drawCanvas: ECanvasShowType.Float,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                }
            };
            Promise.resolve(combineDrawResult).then((msg) => {
                msg.drawCount = this.drawCount;
                this._post(msg)
            });
        }
    }
    private drawSelector(res:IMainMessage, isDrawing?:boolean) {
        //console.log('drawSelector', res, isDrawing)
        if (res.selectIds?.length && !isDrawing) {
            this._post({
                render: res.rect && {
                    rect: res.selectRect,
                    drawCanvas: ECanvasShowType.Selector,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Selector,
                    isFullWork: false,
                },
                sp: [ res ]
            });
            this._post({
                render: res.rect && {
                    rect: res.selectRect || res.rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                },
                sp: [ res ]
            });
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                }
            });
        }
        if (isDrawing) {
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Float,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                },
                sp: [ res ]
            });
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                }
            });
        }
    }
    private drawEraser(res:IMainMessage) {
        Promise.resolve(res).then((result) => {
            //console.log('Promise', result)
            this._post({
                render: {
                    rect: result.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                },
                sp: [ result ]
            });
        });
    }
    private drawPencil(res:IMainMessage) {
        this._post({
            drawCount: this.drawCount,
            sp: res?.op && [res]
        });
    }
    private drawPencilFull(res:IMainMessage, isClearBg:boolean) {
        if (isClearBg) {
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                }
            });
        }
        this._post({
            render: res.rect && {
                rect: res.rect,
                drawCanvas: ECanvasShowType.Bg,
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: true,
            },
            sp: [ res ]
        });
    }
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined {
        const {op, workId} = data;
        if (op?.length && workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            const result = workShapeNode.consume({
                data, 
                isFullWork:true, 
                nodeMaps:this.curNodeMap
            });
            if (toolsType === EToolsKey.Selector) {
                if (result.type === EPostMessageType.Select) {
                    this.drawSelector(result, true);
                }
                return ;
            }
            if (toolsType === EToolsKey.Eraser) {
                if (result?.rect) {
                    this.drawEraser(result);
                }
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
                if(!this.combineTimerId) {
                    this.combineTimerId = setTimeout(() => {
                        this.combineTimerId = undefined;
                        this.drawPencilCombine(workId);
                    }, this.combineUnitTime) as unknown as number;
                }
                if (result) {
                    this.drawCount++;
                    this.drawPencil(result);
                }
            }
        }
    }
    consumeDrawAll(data: IWorkerMessage): IMainMessage | undefined {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
        }
        const {workId} = data;
        if (workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            this.drawCount = 0;
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            //console.log('consumeDrawAll', data)
            const r = workShapeNode.consumeAll({
                data, 
                nodeMaps:this.curNodeMap
            });
            if (toolsType === EToolsKey.Selector) {
                this.drawSelector(r, false);
                if (!(workShapeNode as SelectorShape).selectIds?.length) {
                    this.clearWorkShapeNodeCache(workId);
                } else {
                    workShapeNode.clearTmpPoints();
                }
                return ;
            }
            if (toolsType === EToolsKey.Eraser) {
                if (r?.rect) {
                    this.drawEraser(r);
                }
                workShapeNode.clearTmpPoints();
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
                if (r?.rect) {
                    const opacity = workShapeNode.getWorkOptions().opacity || 1 ;
                    this.drawPencilFull(r, opacity < 1);
                }
                this.clearWorkShapeNodeCache(workId);
            }
        }
        
    }
    updateSelector(param:{
        updateSelectorOpt: IUpdateNodeOpt;
        willRefreshSelector?: boolean;
        willSyncService?: boolean;
        willSerializeData?:boolean;
        selectStore?:Map<string,{
            ops?:string;
            opt?: BaseShapeOptions;
            updateNodeOpt?:IUpdateNodeOpt;
            toolsType?: EToolsKey;
        }>;
        emitEventType?: EmitEventType;
    }): IMainMessage | undefined {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode.selectIds?.length) return;
        const {updateSelectorOpt, willRefreshSelector, willSyncService, willSerializeData, emitEventType, selectStore} = param;
        const workState = updateSelectorOpt.workState;
        let rect: IRectType|undefined;
        const isDelay = (emitEventType === EmitEventType.RotateNode || emitEventType === EmitEventType.ScaleNode) && workState === EvevtWorkState.Done && willSerializeData;
        if (willRefreshSelector && workShapeNode) {
            rect = workShapeNode.oldRect;
        }
        const res = workShapeNode?.updateSelector({
            updateSelectorOpt, 
            selectIds: workShapeNode.selectIds,
        });
        let render = res && willRefreshSelector && {
            rect: emitEventType === EmitEventType.ScaleNode  && workState !== EvevtWorkState.Done ? computRect(rect, res.rect) : res.rect,
            isClear: true,
            isFullWork: false,
            clearCanvas: emitEventType === EmitEventType.ScaleNode ? ECanvasShowType.Float : ECanvasShowType.Selector,
            drawCanvas: emitEventType === EmitEventType.ScaleNode && workState !== EvevtWorkState.Done ? ECanvasShowType.Float : ECanvasShowType.Selector,
        } || undefined;
        // console.log('updateSelector', render, res?.rect)
        if (res && willRefreshSelector && willSerializeData && render && !isDelay) {
            // console.log('updateSelector1', render, res?.rect)
            this._post({ render });
            // this.computNodeMap();
            render = undefined
        }
        const newServiceStore:Map<string,{
            ops?:string;
            opt?: BaseShapeOptions;
            updateNodeOpt?:IUpdateNodeOpt;
            toolsType?: EToolsKey;
        }> = new Map();
        if (willSerializeData) {
            if (res?.updateNodeOpts && selectStore) {
               for (const [key, info] of selectStore.entries()) {
                    const {ops, opt, updateNodeOpt, toolsType} = info;
                    let newPos:string|undefined;
                    const newOpt:BaseShapeOptions| undefined = opt;
                    const newUpdateNodeOpt = {...updateNodeOpt, ...res.updateNodeOpts.get(key)};
                    let nop:number[] = [];
                    if (newOpt && newUpdateNodeOpt.color) {
                        newOpt.color = newUpdateNodeOpt.color;
                        delete newUpdateNodeOpt.color;
                    } 
                    if (newOpt && newUpdateNodeOpt.zIndex) {
                        newOpt.zIndex = newUpdateNodeOpt.zIndex;
                        delete newUpdateNodeOpt.zIndex;
                    }
                    if (newOpt && newUpdateNodeOpt.opacity) {
                        newOpt.opacity = newUpdateNodeOpt.opacity;
                        delete newUpdateNodeOpt.opacity;
                    }
                    if (ops && newUpdateNodeOpt?.pos && newUpdateNodeOpt?.originPos) {
                        // const op = (transformToNormalData(ops) as number[]);
                        const translate = [newUpdateNodeOpt.pos[0] - newUpdateNodeOpt.originPos[0], newUpdateNodeOpt.pos[1] - newUpdateNodeOpt.originPos[1]];
                        const op = (transformToNormalData(ops) as number[]).map((n,index)=>{
                            const i = index % 3
                            if ( i === 0) {
                                return n + translate[0];
                            } 
                            if( i === 1) {
                                return n + translate[1];
                            }
                            return n
                        })
                        if (newUpdateNodeOpt.scale) {
                            // console.log('op', op.map(o=>o), newUpdateNodeOpt.originPos);
                            scalePoints(op, newUpdateNodeOpt.pos, newUpdateNodeOpt.scale);
                            // console.log('op1', op.map(o=>o));
                            nop = op;
                        }
                        newPos = transformToSerializableData(op);
                        this.drawLayer?.getElementsByName(key).forEach(c=> newUpdateNodeOpt.pos && c.setAttribute('className', `${newUpdateNodeOpt.pos[0]}, ${newUpdateNodeOpt.pos[1]}`));
                        delete newUpdateNodeOpt.scale;
                        delete newUpdateNodeOpt.originPos;
                        // console.log('newUpdateNodeOpt', newUpdateNodeOpt)
                        // this.drawLayer?.getElementsByName(key).forEach(c=>c.remove());
                    }
                    if (ops && newUpdateNodeOpt.angle && newUpdateNodeOpt.originPos) {
                        const op = (transformToNormalData(ops) as number[]);
                        rotatePoints(op, newUpdateNodeOpt.originPos, newUpdateNodeOpt.angle);
                        nop = op;
                        newPos = transformToSerializableData(op);
                        delete newUpdateNodeOpt.angle;
                        delete newUpdateNodeOpt.originPos;
                        // this.drawLayer?.getElementsByName(key).forEach(c=>c.remove());
                    }
                    if (toolsType && ops && opt && nop.length) {
                        const workShape = this.createWorkShapeNode({
                            toolsType,
                            toolsOpt: opt
                        })
                        workShape?.setWorkId(key);
                        workShape?.consumeService({
                            op:nop,
                            isFullWork:false,
                            replaceId:key,
                            isClearAll:false
                        })
                    }
                    newServiceStore.set(key, {
                        ops: newPos,
                        updateNodeOpt: newUpdateNodeOpt,
                        opt: newOpt,
                        toolsType
                    })
                    // console.log('newServiceStore', newServiceStore)
               }
            } 
        }
        if (res && res.updateNodeOpts?.size) {
            delete updateSelectorOpt.workState;
            const sp = [];
            if (willSyncService) {
                if (willSerializeData) {
                    if (emitEventType === EmitEventType.RotateNode && workState === EvevtWorkState.Done) {
                        sp.push({
                            type: EPostMessageType.Select,
                            selectIds: workShapeNode.selectIds,
                            selectRect: res.rect,
                        })
                    }
                    for (const [workId, info] of newServiceStore.entries()) {
                        sp.push(
                            {
                                ...info,
                                workId,
                                type: EPostMessageType.UpdateNode,
                            }
                        )
                    }
                } else {
                    for (const [workId, updateNodeOpt] of res.updateNodeOpts.entries()) {
                        sp.push(
                            {
                                workId,
                                type: EPostMessageType.UpdateNode,
                                updateNodeOpt
                            }
                        )
                    }
                }
            }
            if (willSyncService) {
                this._post({
                    render: !isDelay && render || undefined,
                    sp: (willSyncService && sp) || undefined
                })
            }
            if (isDelay && render) {
                setTimeout(()=>{
                    this._post({
                        render,
                    })
                    if (workState === EvevtWorkState.Done) {
                        this.computNodeMap();
                    }
                }, 20)
            }
            if (!isDelay && workState === EvevtWorkState.Done) {
                this.computNodeMap();
            }
            // this._post({ render:{
            //     rect: res?.rect,
            //     isClear: true,
            //     isFullWork: true,
            //     clearCanvas: ECanvasShowType.Bg,
            //     drawCanvas: ECanvasShowType.Bg
            // } })
            // const rect1 = {
            //     x:0,
            //     y:0,
            //     w: this.fullLayer?.parent?.getAttribute('width'),
            //     h: this.fullLayer?.parent?.getAttribute('height')
            // };
            // console.log('rect1', rect1);
            // this._post({ render:{
            //     rect:rect1,
            //     isClear: true,
            //     isFullWork: false,
            //     clearCanvas: ECanvasShowType.Float,
            //     drawCanvas: ECanvasShowType.Float
            // } })
        }

    }
    blurSelector(): void {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (workShapeNode) {
            const res = workShapeNode?.blurSelector();
            this.clearWorkShapeNodeCache(SelectorShape.selectorId);
            this._post({
                render: res?.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                },
                sp: [ res ]
            });
        }
    }
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType' | 'updateNodeOpt'>){
        const {workId, opt, toolsType} = data;
        if (workId && opt && toolsType) {
            const curWorkShapes = (workId && this.workShapes.get(workId)) || this.createWorkShapeNode({
                toolsOpt:opt,
                toolsType
            })
            if (!curWorkShapes) {
                return;
            }
            curWorkShapes.setWorkId(workId);
            this.workShapes.set(workId, curWorkShapes);
            return curWorkShapes
        }
    }
    consumeFull(data: IWorkerMessage){
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            let rect = workShape.consumeService({
                op, 
                isFullWork: true,
                replaceId: workShape.getWorkId()?.toString()
            });
            rect = computRect(rect, data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt));
            if (rect && data.willRefresh) {
                this._post({
                    render: {
                        rect,
                        drawCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                    },
                    sp: ( data.willSyncService && [{
                        opt:data.opt,
                        toolsType: data.toolsType,
                        type: EPostMessageType.FullWork,
                        workId: data.workId,
                        ops: data.ops,
                        updateNodeOpt: data.updateNodeOpt
                    }]) || undefined
                });
            }
            data.workId && this.workShapes.delete(data.workId)
        }
    }
    updateNode(param:{
        workId:IworkId;
        updateNodeOpt: IUpdateNodeOpt;
        willRefresh?:boolean;
        willSyncService?:boolean;
    }) {
        const {workId, updateNodeOpt, willRefresh, willSyncService} = param;
        if (workId) {
            const workIdStr = workId.toString();
            let rect: IRectType|undefined;
            const itemOpt: IUpdateNodeOpt = {};
            this.fullLayer.getElementsByName(workIdStr).forEach(p => {
                if (willRefresh) {
                    const r = (p as Path).getBoundingClientRect();
                    rect = computRect(rect, {
                        x: Math.floor(r.x - 10),
                        y: Math.floor(r.y - 10),
                        w: Math.floor(r.width + 20),
                        h: Math.floor(r.height + 20)
                    });
                }
                if (updateNodeOpt.pos) {
                    itemOpt.pos = updateNodeOpt.pos;
                    p.setAttribute('pos',updateNodeOpt.pos)
                }
                if (updateNodeOpt.zIndexDistance || updateNodeOpt.zIndex) {
                    if (updateNodeOpt.zIndexDistance) {
                        const ZIndex = p.getAttribute('zIndex');
                        itemOpt.zIndex = ZIndex + updateNodeOpt.zIndex;
                    } else {
                        itemOpt.zIndex = updateNodeOpt.zIndex
                    }
                    p.setAttribute('zIndex',itemOpt.zIndex)
                }
                if (updateNodeOpt.color) {
                    itemOpt.color = updateNodeOpt.color;
                    p.setAttribute('strokeColor',itemOpt.color)
                    if (p.getAttribute('fillColor')) {
                        p.setAttribute('strokeColor',itemOpt.color)
                    }
                }
                if (willRefresh) {
                    const r1 = (p as Path).getBoundingClientRect();
                    rect = computRect(rect, {
                        x: Math.floor(r1.x - 10),
                        y: Math.floor(r1.y - 10),
                        w: Math.floor(r1.width + 20),
                        h: Math.floor(r1.height + 20)
                    });  
                }
            })
            if (rect || willSyncService) {
                this._post({
                    render: rect && {
                        rect,
                        drawCanvas: ECanvasShowType.Bg,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                    },
                    sp: ( willSyncService && [{
                            type: EPostMessageType.UpdateNode,
                            workId,
                            updateNodeOpt: itemOpt
                        }] ) || undefined
                });
            }
        }
    }
    removeWork(data:IWorkerMessage) {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            this.workShapes.has(key) && this.clearWorkShapeNodeCache(key);
            let rect:IRectType|undefined;
            const removeNode:Node[]=[]
            const nodeItem = this.curNodeMap.get(key);
            const node = nodeItem && nodeItem?.layer.getElementById(key);
            if (nodeItem && node) {
                rect = computRect(rect, nodeItem.rect);
                removeNode.push(node);
            }
            if (!node) {
                this.fullLayer.getElementsByName(key).concat(this.drawLayer?.getElementsByName(key) || []).forEach(node=>{
                    const r = (node as Path).getBoundingClientRect();
                    rect = computRect(rect, {
                        x: r.x,
                        y: r.y,
                        w: r.width,
                        h: r.height
                    });
                    removeNode.push(node);
                })
            }
            if(removeNode.length) {
                removeNode.forEach(r=>r.remove());
            }
            if (rect) {
                this._post({
                    render:{
                        rect,
                        isClear: true,
                        isFullWork: true,
                        clearCanvas: ECanvasShowType.Bg,
                        drawCanvas: ECanvasShowType.Bg
                    }
                })
            }
        }
    }
}