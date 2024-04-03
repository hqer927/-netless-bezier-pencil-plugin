import { Group, Node } from "spritejs";
import { ISubWorkerInitOption, ServiceWork } from "./base";
import { VNodeManager } from "./vNodeManager";
import { IBatchMainMessage, IMainMessageRenderData, IRectType, IServiceWorkItem, IWorkerMessage } from "../types";
import { ECanvasShowType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { computRect, getSafetyRect } from "../utils";
import { ArrowShape, BaseShapeOptions, LaserPenOptions, SelectorShape, ShapeNodes, getShapeInstance } from "../tools";
import { Storage_Splitter } from "../../collector/const";
import { transformToNormalData } from "../../collector/utils";

export class ServiceWorkForFullWorker implements ServiceWork {
    viewId: string;
    vNodes: VNodeManager;
    fullLayer: Group;
    drawLayer: Group;
    protected workShapes: Map<string, IServiceWorkItem> = new Map();
    protected animationId?: number | undefined;
    selectorWorkShapes: Map<string, IServiceWorkItem> = new Map();
    private willRunEffectSelectorIds: Set<string> = new Set;
    private runEffectId?: number | undefined;
    private noAnimationRect:IRectType|undefined;
    post: (msg: IBatchMainMessage, transfer?: Transferable[]) => Promise<void>;
    constructor(opt:ISubWorkerInitOption){
        this.viewId = opt.viewId;
        this.vNodes = opt.vNodes;
        this.fullLayer = opt.fullLayer;
        this.drawLayer = opt.drawLayer as Group;
        this.post = opt.post;
    }
    destroy(): void {
        this.workShapes.clear();
        this.selectorWorkShapes.clear();
        this.willRunEffectSelectorIds.clear();
    }
    consumeDraw(data:IWorkerMessage){
        this.activeWorkShape(data);
        this.runAnimation();
    }
    consumeFull(data: IWorkerMessage): void {
        this.activeWorkShape(data);
        this.runAnimation();
    }
    clearAllWorkShapesCache(){
        this.workShapes.forEach((workShape, key)=>{
            if (workShape.toolsType === EToolsKey.LaserPen) {
                setTimeout(()=>{
                    this.workShapes.delete(key);
                }, 2000)
            } else {
                this.workShapes.delete(key);
            }
        })
    }
    runSelectWork(data: IWorkerMessage){
        this.activeSelectorShape(data);
        const {workId} = data;
        const workIdStr = workId?.toString();
        if (workIdStr) {
            this.willRunEffectSelectorIds.add(workIdStr);
        }
        this.runEffect();
    }
    setNodeKey(workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions) { 
        workShape.toolsType = tools;
        workShape.node = getShapeInstance({
            toolsType: tools,
            toolsOpt: opt,
            vNodes: this.vNodes, 
            fullLayer: this.fullLayer, 
            drawLayer: this.drawLayer,
        });
        return workShape;
    }
    runReverseSelectWork(selectIds: string[]){
        selectIds.forEach(id=>{
            this.selectorWorkShapes.forEach((workShapes,key)=>{
                if (workShapes.selectIds?.length) {
                    const i = workShapes.selectIds.indexOf(id);
                    if ( i > -1) {
                        workShapes.selectIds.splice(i,1);
                        this.willRunEffectSelectorIds.add(key);
                    }
                }
            })
        })
        if (this.willRunEffectSelectorIds.size) {
            this.runEffect();
        }
    }
    removeWork(data:IWorkerMessage) {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            const workShape = this.workShapes.get(key);
            if (workShape) {
                this.workShapes.delete(key);
                this.removeNode(key, data, workShape?.totalRect, false);
                return;
            }
            this.removeNode(key, data);
        }
    }
    removeSelectWork(data:IWorkerMessage):void{
        const {workId} = data;
        const workIdStr = workId?.toString();
        if (workIdStr) {
            this.activeSelectorShape(data);
            this.willRunEffectSelectorIds.add(workIdStr);
        }
        this.runEffect();
    }
    private removeNode(key: string, data:IWorkerMessage, oldRect?: IRectType, isFullWork:boolean=true){
        const nodes = this.fullLayer.getElementsByName(key).concat(this.drawLayer.getElementsByName(key)) as ShapeNodes[];
        if (key.indexOf(SelectorShape.selectorId) > -1) {
            this.removeSelectWork(data);
        }
        const removeNode:Node[]=[]
        let rect:IRectType|undefined = oldRect;
        const rect1 = this.vNodes.get(key)?.rect;
        if (rect1) {
            rect = computRect(rect1, rect);
        }
        nodes.forEach(node=>{
            removeNode.push(node);
        })
        if(removeNode.length) {
            removeNode.forEach(r=>r.remove());
        }
        if (rect) {
            this.post({
                render:[
                    {
                        rect: getSafetyRect(rect),
                        isClear:true,
                        isFullWork,
                        clearCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                        drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                        viewId: this.viewId
                    }
                ]
            })
            this.vNodes.delete(key);
        }
    }
    private activeWorkShape(data: IWorkerMessage){
        const {workId, opt, toolsType, type, updateNodeOpt, ops, op, useAnimation } = data;
        if (!workId) {
            return;
        }
        // console.log('activeWorkShape', cloneDeep(data))
        const key = workId.toString();
        if (!this.workShapes?.has(key)) {
            let workItem = {
                toolsType,
                animationWorkData: op || [],
                animationIndex:0,
                type,
                updateNodeOpt,
                ops,
                useAnimation: typeof useAnimation !== 'undefined' ? useAnimation : typeof updateNodeOpt?.useAnimation !== 'undefined' ? updateNodeOpt?.useAnimation : true,
                oldRect: this.vNodes.get(key)?.rect
            } as IServiceWorkItem;
            if (toolsType && opt) {
                workItem = this.setNodeKey(workItem, toolsType, opt);
            }
            this.workShapes?.set(key, workItem);
        }
        const workShape = this.workShapes?.get(key) as IServiceWorkItem;
        if (type) {
            workShape.type = type;
        }
        if (ops) {
            workShape.animationWorkData = transformToNormalData(ops);
            workShape.ops = ops;
        }
        if (updateNodeOpt) {
            workShape.updateNodeOpt = updateNodeOpt;
        }
        if (op) {
            workShape.animationWorkData = op;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        if (workShape.toolsType !== toolsType && toolsType && opt) {
            this.setNodeKey(workShape, toolsType, opt)
        }
        // this.workShapes.set(key,workShape);
    }
    private animationDraw() {
        this.animationId = undefined;
        let isNext:boolean = false;
        const cursorPoints: Map<string,{
            op:number[],
            workState:EvevtWorkState
        }>= new Map();

        const bgRenders: IMainMessageRenderData[] = [];
        const floatRenders: IMainMessageRenderData[] = [];
        const bgClearRenders: IMainMessageRenderData[] = [];
        const floatClearRenders: IMainMessageRenderData[] = [];

        this.workShapes.forEach((workShape,key) => {
            switch (workShape.toolsType) {
                case EToolsKey.Text: {
                    if (workShape.node) {
                        const oldRect =  workShape.oldRect;
                        // if (oldRect) {
                        //     bgClearRenders.push({
                        //         rect: oldRect,
                        //         isClear: true,
                        //         clearCanvas: ECanvasShowType.Bg,
                        //     })
                        // }
                        const rect = workShape.node?.consumeService({
                            op: workShape.animationWorkData || [], 
                            isFullWork:true
                        });
                        this.selectorWorkShapes.forEach((s,selectorId)=>{
                            if (s.selectIds?.includes(key)) {
                                this.willRunEffectSelectorIds.add(selectorId);
                                this.noAnimationRect = computRect(this.noAnimationRect, oldRect);
                                this.noAnimationRect = computRect(this.noAnimationRect, rect);
                                this.runEffect();
                            }
                        })
                        workShape.node?.clearTmpPoints();
                        this.workShapes.delete(key);
                        // bgRenders.push({
                        //     rect,
                        //     drawCanvas: ECanvasShowType.Bg,
                        //     isFullWork: true
                        // })
                    }
                    break;
                }
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Rectangle:
                case EToolsKey.Ellipse:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                {
                    const isFullWork = !!workShape.ops;
                    if (workShape.animationWorkData?.length) {
                        // console.log('workShape', workShape)
                        const oldRect =  workShape.oldRect;
                        const tmpRect = (workShape.node as ArrowShape).oldRect;
                        // console.log('first----2', workShape, oldRect, workShape.oldRect)
                        if (oldRect) {
                            bgClearRenders.push({
                                rect: oldRect,
                                isClear: true,
                                clearCanvas: ECanvasShowType.Bg,
                                viewId:this.viewId
                            })
                        }
                        if (tmpRect) {
                            floatClearRenders.push({
                                rect: tmpRect,
                                isClear: true,
                                clearCanvas: ECanvasShowType.Float,
                                viewId:this.viewId
                            })
                        }
                        const rect = workShape.node?.consumeService({
                            op: workShape.animationWorkData, 
                            isFullWork
                        });
                        const cursorPs = {
                            workState: !oldRect? EvevtWorkState.Start : workShape.ops ? EvevtWorkState.Done : EvevtWorkState.Doing,
                            op: workShape.animationWorkData.filter((_v, i) => {
                                if (i % 3 !== 2) {
                                    return true;
                                }
                            }).slice(-2),
                        };
                        cursorPoints.set(key, cursorPs)
                        if (isFullWork) {
                            this.selectorWorkShapes.forEach((s,selectorId)=>{
                                if (s.selectIds?.includes(key)) {
                                    this.willRunEffectSelectorIds.add(selectorId);
                                    this.noAnimationRect = computRect(this.noAnimationRect, oldRect);
                                    this.noAnimationRect = computRect(this.noAnimationRect, tmpRect);
                                    this.noAnimationRect = computRect(this.noAnimationRect, rect);
                                    this.runEffect();
                                }
                            })
                            workShape.node?.clearTmpPoints();
                            this.workShapes.delete(key);
                            bgRenders.push({
                                rect,
                                drawCanvas: ECanvasShowType.Bg,
                                isFullWork,
                                viewId:this.viewId
                            })
                        } else {
                            floatRenders.push({
                                rect,
                                drawCanvas: ECanvasShowType.Float,
                                isFullWork,
                                viewId:this.viewId
                            })
                        }
                        workShape.animationWorkData.length = 0;
                    }
                    break;
                }
                case EToolsKey.Pencil: {
                    if (!workShape.useAnimation && workShape.ops) {
                        let rect = workShape.node?.consumeService({
                            op: workShape.animationWorkData||[], 
                            isFullWork: true,
                            replaceId: key
                        });
                        const rect1 = workShape.node?.updataOptService(workShape.updateNodeOpt);
                        rect = computRect(rect, rect1);
                        bgClearRenders.push({
                            rect: computRect(workShape.oldRect, rect),
                            clearCanvas: ECanvasShowType.Bg,
                            viewId:this.viewId
                        });
                        bgRenders.push({
                            rect: computRect(workShape.oldRect, rect),
                            drawCanvas: ECanvasShowType.Bg,
                            viewId:this.viewId
                        });
                        // console.log('consumeService2', noAnimationRect);
                        this.selectorWorkShapes.forEach((s,selectorId)=>{
                            if (s.selectIds?.includes(key)) {
                                this.willRunEffectSelectorIds.add(selectorId);
                                this.noAnimationRect = computRect(this.noAnimationRect, rect);
                                this.runEffect();
                            }
                        });
                        workShape.node?.clearTmpPoints();
                        this.workShapes.delete(key);
                    } 
                    else if(workShape.useAnimation){
                        const pointUnit = 3;
                        const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                        const lastPointIndex = Math.max(0, (workShape.animationIndex || 0) - pointUnit);
                        const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                        // let rect1: IRectType | undefined;
                        if (!workShape.isDel) {
                            if ((workShape.animationIndex || 0) < nextAnimationIndex) {
                                const rect = workShape.node?.consumeService({
                                    op: data,
                                    isFullWork: false,
                                    replaceId: workShape.node.getWorkId()?.toString()
                                });
                                floatRenders.push({
                                    rect,
                                    drawCanvas: ECanvasShowType.Float,
                                    viewId:this.viewId
                                });
                                workShape.animationIndex = nextAnimationIndex;
                            } else if (workShape.ops) {
                                const rect = workShape.node?.consumeService({
                                    op: workShape.animationWorkData || [],
                                    isFullWork: true,
                                    replaceId: workShape.node.getWorkId()?.toString(),
                                });
                                workShape.isDel = true;
                                // workShape.totalRect = computRect(workShape.totalRect, rect);
                                floatClearRenders.push({
                                    rect,
                                    clearCanvas: ECanvasShowType.Float,
                                    viewId:this.viewId
                                })
                                if (workShape.node?.getWorkOptions().isOpacity) {
                                    bgClearRenders.push({
                                        rect,
                                        clearCanvas:ECanvasShowType.Bg,
                                        viewId:this.viewId
                                    })
                                }
                                bgRenders.push({
                                    rect,
                                    drawCanvas:ECanvasShowType.Bg,
                                    viewId:this.viewId
                                })
                                this.vNodes.setInfo(key,{
                                    op: workShape.animationWorkData,
                                    opt: workShape.node?.getWorkOptions(),
                                    toolsType: workShape.toolsType,
                                    rect
                                })
                            }
                            isNext = true;
                        } else if (workShape.isDel) {
                            workShape.node?.clearTmpPoints();
                            this.workShapes.delete(key);
                        }
                        if (data.length) {
                            cursorPoints.set(key, {
                                workState: lastPointIndex === 0 ? EvevtWorkState.Start : nextAnimationIndex === workShape.animationWorkData?.length ? EvevtWorkState.Done : EvevtWorkState.Doing,
                                op: data.filter((_v, i) => {
                                    if (i % pointUnit !== pointUnit - 1) {
                                        return true;
                                    }
                                }).slice(-2),
                            });
                        }
                        break;
                    }
                    break;
                }
                case EToolsKey.LaserPen: {
                    const pointUnit = 2;
                    const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                    const lastPointIndex = Math.max(0, (workShape.animationIndex || 0) - pointUnit);
                    const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                    if (!workShape.isDel) {
                        if ((workShape.animationIndex || 0) < nextAnimationIndex) {
                            const rect = workShape.node?.consumeService({
                                op: data,
                                isFullWork: false,
                                replaceId: workShape.node.getWorkId()?.toString()
                            });
                            workShape.totalRect = computRect(workShape.totalRect, rect);
                            if (workShape.timer) {
                                clearTimeout(workShape.timer);
                                workShape.timer = undefined;
                            }
                            workShape.animationIndex = nextAnimationIndex;
                        } else {
                            if (!workShape.timer) {
                                workShape.timer = setTimeout(() => {
                                    workShape.timer = undefined;
                                    workShape.isDel = true;
                                    this.runAnimation();
                                }, (workShape.node?.getWorkOptions() as LaserPenOptions).duration * 1000 + 100) as unknown as number;
                            }
                            const rect = workShape.node?.consumeService({
                                op:[],
                                isFullWork: false
                            });
                            workShape.totalRect = computRect(workShape.totalRect, rect);
                        }
                        floatClearRenders.push({
                            rect: workShape.totalRect,
                            clearCanvas: ECanvasShowType.Float,
                            viewId:this.viewId
                        });
                        floatRenders.push({
                            rect: workShape.totalRect,
                            drawCanvas: ECanvasShowType.Float,
                            viewId:this.viewId
                        });
                        isNext = true;
                    }
                    else if (workShape.isDel) {
                        const rect = workShape.node?.consumeService({
                            op:[],
                            isFullWork: false
                        });
                        workShape.totalRect = computRect(workShape.totalRect, rect);
                        floatClearRenders.push({
                            rect: workShape.totalRect,
                            clearCanvas: ECanvasShowType.Float,
                            viewId:this.viewId
                        });
                        floatRenders.push({
                            rect: workShape.totalRect,
                            drawCanvas: ECanvasShowType.Float,
                            viewId:this.viewId
                        });
                        workShape.node?.clearTmpPoints();
                        this.workShapes.delete(key);
                    }
                    if (data.length) {
                        cursorPoints.set(key, {
                            workState: lastPointIndex === 0 ? EvevtWorkState.Start : nextAnimationIndex === workShape.animationWorkData?.length ? EvevtWorkState.Done : EvevtWorkState.Doing,
                            op: data.slice(-2),
                        })
                    }
                    break;
                }
                default:
                    break;
            }
        })
        if (isNext) {
            this.runAnimation();
        }
        const _postData:IBatchMainMessage = {
            render:[],
        }
        if (bgClearRenders.length) {
            const clearBg = bgClearRenders.reduce((pre,cur)=>{
                if (cur.rect && cur.clearCanvas === ECanvasShowType.Bg) {
                    pre.rect = computRect(pre.rect, cur.rect);
                }
                return pre
            },{
                isClear:true,
                clearCanvas: ECanvasShowType.Bg,
                viewId:this.viewId
            } as IMainMessageRenderData)
            if (clearBg.rect) {
                clearBg.rect = clearBg.rect && getSafetyRect(clearBg.rect);
                _postData.render?.push(clearBg);
            }
        }
        if (floatClearRenders.length) {
            const clearFloat = floatClearRenders.reduce((pre,cur)=>{
                if (cur.rect && cur.clearCanvas === ECanvasShowType.Float) {
                    pre.rect = computRect(pre.rect, cur.rect);
                }
                return pre
            },{
                isClear:true,
                clearCanvas: ECanvasShowType.Float,
                viewId:this.viewId
            } as IMainMessageRenderData)
            if (clearFloat.rect) {
                clearFloat.rect = clearFloat.rect && getSafetyRect(clearFloat.rect);
                _postData.render?.push(clearFloat);
            }
        }
        if (bgRenders.length) {
            const bgs = bgRenders.reduce((pre,cur)=>{
                if (cur.rect && cur.drawCanvas === ECanvasShowType.Bg) {
                    pre.rect = computRect(pre.rect, cur.rect);
                }
                return pre
            },{
                isFullWork:true,
                drawCanvas: ECanvasShowType.Bg,
                viewId:this.viewId
            } as IMainMessageRenderData)
            if (bgs.rect) {
                bgs.rect = bgs.rect && getSafetyRect(bgs.rect);
                _postData.render?.push(bgs);
            }
        }
        if (floatRenders.length) {
            const floats = floatRenders.reduce((pre,cur)=>{
                if (cur.rect && cur.drawCanvas === ECanvasShowType.Float) {
                    pre.rect = computRect(pre.rect, cur.rect);
                }
                return pre
            },{
                isFullWork: false,
                drawCanvas: ECanvasShowType.Float,
                viewId:this.viewId
            } as IMainMessageRenderData)
            if (floats.rect) {
                floats.rect = floats.rect && getSafetyRect(floats.rect);
                _postData.render?.push(floats);
            }
        }
        if (cursorPoints.size) {
            _postData.sp = [];
            cursorPoints.forEach((v,k)=>{
                _postData.sp?.push({
                    type: EPostMessageType.Cursor,
                    uid: k.split(Storage_Splitter)[0],
                    op: v.op,
                    workState: v.workState,
                    viewId: this.viewId
                })
            })
        }
        if (_postData.render?.length) {
            this.post(_postData);
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
    }
    private computNextAnimationIndex(workShape:IServiceWorkItem, pointUnit:number){
        // const pointUnit = workShape.toolsType === EToolsKey.Pencil ? 3 : 2;
        const step = Math.floor((workShape.animationWorkData || []).slice(workShape.animationIndex).length * 32 / pointUnit / (workShape.node?.syncUnitTime || 1000)) * pointUnit;
        return Math.min((workShape.animationIndex || 0) + (step || pointUnit), (workShape.animationWorkData||[]).length);
    }
    private runEffect(){
        if (!this.runEffectId) {
            this.runEffectId = setTimeout(this.effectRunSelector.bind(this),0) as unknown as number;
        }
    }
    private effectRunSelector() {
        this.runEffectId = undefined;
        let rect: IRectType | undefined = this.noAnimationRect;
        this.willRunEffectSelectorIds.forEach(id => {
            const workShape = this.selectorWorkShapes.get(id);
            const r = workShape && workShape.selectIds && ( workShape.node as SelectorShape)?.selectServiceNode(id, workShape);
            rect = computRect(rect, r);
            if (!workShape?.selectIds?.length) {
                this.selectorWorkShapes.delete(id);
            }
        })
        if (rect) {
            this.post({render: [
                {
                    rect: getSafetyRect(rect),
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId:this.viewId
                }
            ]})
        }
        this.willRunEffectSelectorIds.clear();
        this.noAnimationRect = undefined;
    }
    private activeSelectorShape(data: IWorkerMessage){
        const {workId, opt, toolsType, type, selectIds } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        if (!this.selectorWorkShapes?.has(key)) {
            let workItem = {
                toolsType,
                selectIds,
                type,
                opt,
            } as IServiceWorkItem;
            if (toolsType && opt) {
                workItem = this.setNodeKey(workItem, toolsType, opt);
            }
            this.selectorWorkShapes?.set(key, workItem);
        }
        const workShape = this.selectorWorkShapes?.get(key) as IServiceWorkItem;
        if (type) {
            workShape.type = type;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        workShape.selectIds = selectIds || [];
    }
}

