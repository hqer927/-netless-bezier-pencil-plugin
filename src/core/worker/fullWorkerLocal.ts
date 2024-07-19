import throttle from "lodash/throttle";
import { ECanvasShowType, EPostMessageType, IWorkerMessage, IMainMessage, IRectType, EToolsKey, IBatchMainMessage, IMainMessageRenderData, EvevtWorkState, IUpdateSelectorPropsType, Cursor_Hover_Id, EDataType } from "..";
import { BaseShapeOptions, BaseShapeTool, EraserShape, ImageShape, PencilShape, SelectorShape } from "../tools";
import { ISubWorkerInitOption, LocalWork } from "./base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { Layer, Path, Scene } from "spritejs";
import { computRect, getSafetyRect, isIntersectForPoint } from "../utils";
import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { TextOptions } from "../../component/textEditor";
import { TextShape } from "../tools/text";
import { DefaultAppliancePluginOptions } from "../../plugin/const";
import cloneDeep from "lodash/cloneDeep";
import xor from "lodash/xor";
import { Storage_Selector_key } from "../../collector/const";

export class LocalWorkForFullWorker extends LocalWork {
    private combineUnitTime: number = DefaultAppliancePluginOptions.syncOpt.interval;
    private combineTimerId?: number;
    private combineDrawResolve?: (value: boolean) => void;
    private combineDrawActiveId?: string;
    protected drawWorkActiveId?: string;
    private effectSelectNodeData: Set<IWorkerMessage> = new Set();
    private batchEraserWorks: Set<string> = new Set();
    private batchEraserRemoveNodes: Set<string> = new Set();
    constructor(opt: ISubWorkerInitOption){
        super(opt);
    }
    async consumeDraw(data: IWorkerMessage, serviceWork:ServiceWorkForFullWorker) {
        const {op, workId, scenePath} = data;
        if (op?.length && workId) {
            const workStr = workId.toString();
            const workShapeNode = this.getWorkShape(workStr);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            // 如果将要合并绘制的工具已经不是当前工具，先清除当前工具的绘制
            if (this.combineDrawActiveId && this.combineDrawActiveId !== workStr) {
                if (this.combineTimerId) {
                    clearTimeout(this.combineTimerId);
                    this.combineTimerId = undefined;
                    this.combineDrawResolve && this.combineDrawResolve(false);
                    this.combineDrawActiveId = undefined;
                }
                await this.consumeDrawAll({
                    workId: this.combineDrawActiveId,
                    scenePath,
                    viewId: this.viewId,
                    msgType: EPostMessageType.DrawWork,
                    dataType: EDataType.Local
                }, serviceWork)
            }
            // 如果将要绘制的工具已经不是当前工具，先完结当前工具的绘制
            if (this.drawWorkActiveId && this.drawWorkActiveId !== workStr) {
                await this.consumeDrawAll({
                    workId: this.drawWorkActiveId,
                    scenePath,
                    viewId: this.viewId,
                    msgType: EPostMessageType.DrawWork,
                    dataType: EDataType.Local
                }, serviceWork)
                this.drawWorkActiveId = undefined;
            }
            if (!this.drawWorkActiveId && workStr !== Storage_Selector_key) {
                this.drawWorkActiveId = workStr;
            }
            const result = workShapeNode.consume({
                data, 
                isFullWork:true
            });
            switch (toolsType) {
                case EToolsKey.Selector:
                    if (result.type === EPostMessageType.Select) {
                        result.selectIds && serviceWork.runReverseSelectWork(result.selectIds)
                        await this.drawSelector(result);
                    }
                    break;
                case EToolsKey.Eraser:
                    if (result?.rect) {
                        await this.drawEraser(result);
                    }
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:                
                    if (result) {
                        this.drawCount++;
                        await this.drawPencil(result);
                    }
                    break;
                case EToolsKey.Pencil:
                    if(!this.combineTimerId) {
                        const ms = Math.floor(this.syncUnitTime || this.combineUnitTime);
                        new Promise((resolve) => {
                            this.combineDrawActiveId = workStr;
                            this.combineDrawResolve = resolve;
                            this.combineTimerId = setTimeout(() => {
                                this.combineTimerId = undefined;
                                this.combineDrawResolve && this.combineDrawResolve(true);
                            }, ms) as unknown as number;
                        }).then((bol)=>{
                            bol && this.drawPencilCombine(workStr);
                            this.combineDrawResolve = undefined;
                        })
                    }
                    if (result) {
                        this.drawCount++;
                        await this.drawPencil(result);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    async consumeDrawAll(data: IWorkerMessage, serviceWork:ServiceWorkForFullWorker) {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
            this.combineDrawResolve && this.combineDrawResolve(false);
            this.combineDrawActiveId = undefined;
        }
        const {workId, scenePath, isLockSentEventCursor} = data;
        if (workId) {
            const workIdStr = workId.toString();
            if (this.drawWorkActiveId === workIdStr) {
                this.drawWorkActiveId = undefined;
            }
            const workShapeNode = this.workShapes.get(workIdStr);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            const hoverShapeNode = this.workShapes.get(Cursor_Hover_Id) as SelectorShape | undefined;
            const hoverId = hoverShapeNode?.selectIds?.[0];
            const r = workShapeNode.consumeAll({ data });
            switch (toolsType) {
                case EToolsKey.Selector:
                    if (r.selectIds && hoverId && r.selectIds?.includes(hoverId)) {
                        hoverShapeNode.cursorBlur();
                    }
                    r.selectIds && serviceWork.runReverseSelectWork(r.selectIds)
                    await this.drawSelector({...r, scenePath});
                    if (!(workShapeNode as SelectorShape).selectIds?.length) {
                        this.clearWorkShapeNodeCache(workIdStr);
                    } else {
                        workShapeNode.clearTmpPoints();
                    }
                    break;
                case EToolsKey.Eraser:
                    if (r?.rect) {
                        this.drawEraser({...r, scenePath});
                    }
                    workShapeNode.clearTmpPoints();
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                    await this.drawPencilFull({...r, scenePath, isLockSentEventCursor});
                    this.drawCount = 0;
                    this.clearWorkShapeNodeCache(workIdStr);
                    break;
                case EToolsKey.Pencil:
                    if (r?.rect) {
                        await this.drawPencilFull({...r, scenePath, isLockSentEventCursor});
                        this.drawCount = 0;
                    }
                    this.clearWorkShapeNodeCache(workIdStr);
                    break;
                default:
                    break;
            }
        }  
    }
    async workShapesDone(scenePath:string, serviceWork:ServiceWorkForFullWorker){
        for (const key of this.workShapes.keys()) {
            await this.consumeDrawAll({
                workId: key,
                scenePath,
                viewId: this.viewId,
                msgType: EPostMessageType.DrawWork,
                dataType: EDataType.Local
            }, serviceWork)
        }
    }
    async consumeFull(data: IWorkerMessage, scene?:Scene){
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops) || data.op;
        if (workShape) {
            const replaceId = data.workId?.toString();
            if (!replaceId) {
                return;
            }
            const oldRect = this.vNodes.get(replaceId)?.rect;
            let rect:IRectType|undefined;
            let updataOptRect:IRectType|undefined;
            if (workShape.toolsType === EToolsKey.Image && scene) {
                rect = await (workShape as ImageShape).consumeServiceAsync({
                    scene,
                    isFullWork: true,
                    replaceId,
                });
                updataOptRect = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            } else if (workShape.toolsType === EToolsKey.Text) {
                rect = await (workShape as TextShape).consumeServiceAsync({
                    isFullWork: true,
                    replaceId,
                });
            } else {
                rect = workShape.consumeService({
                    op, 
                    isFullWork: true,
                    replaceId,
                });
                updataOptRect = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            }
            rect = computRect(rect, updataOptRect);
            const render: IMainMessageRenderData[] = [];
            const sp:IMainMessage[] = [];
            data.workId && this.workShapes.delete(data.workId.toString())
            if (rect && data.willRefresh) {
                if (oldRect) {
                    render.push({
                        rect: getSafetyRect(oldRect),
                        isClear:true,
                        clearCanvas: ECanvasShowType.Bg,
                        viewId:this.viewId
                    })
                }
                render.push({
                    rect: getSafetyRect(rect),
                    drawCanvas: ECanvasShowType.Bg,
                    viewId:this.viewId
                });
            }
            if (data.willSyncService) {
                sp.push({
                    opt: data.opt,
                    toolsType: data.toolsType,
                    type: EPostMessageType.FullWork,
                    workId: data.workId,
                    ops: data.ops,
                    updateNodeOpt: data.updateNodeOpt,
                    viewId:this.viewId
                })
            }
            if(render.length || sp.length){
                const _postData = {render,sp};
                await this._post(_postData)
            }
        }
    }
    private commandDeleteText(workId: string){
        const curNode = this.vNodes.get(workId);
        if (curNode && curNode.toolsType === EToolsKey.Text) {
            return {
                type: EPostMessageType.TextUpdate,
                toolsType: EToolsKey.Text,
                workId,
                dataType: EDataType.Local
            }    
        }
    }
    async removeSelector(data:IWorkerMessage){
        const {willSyncService} = data;
        const sp:IMainMessage[] = [];
        const render:IMainMessageRenderData[] = [];
        const removeIds:string[] = [];
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode) {
            return;
        }
        const selectIds = workShapeNode.selectIds && [...workShapeNode.selectIds] || [];
        for (const key of selectIds) {
            const info = this.vNodes.get(key);
            if (info) {
                const ms = this.commandDeleteText(key);
                ms && sp.push(ms)
            }
            const r = this._removeWork(key);
            if (r.length) {
                render.push(...r)
            }
            removeIds.push(key);
        }
        if (removeIds.length) {
            sp.push({
                type: EPostMessageType.RemoveNode,
                removeIds
            })
        }
        sp.push({
            type: EPostMessageType.Select,
            selectIds:[],
            willSyncService
        });
        await this.blurSelector();
        if (render.length || sp.length) {
            await this._post({
                render,
                sp
            })
        }
    }
    async removeWork(data:IWorkerMessage) {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            const render = this._removeWork(key);
            if (render.length) {
                await this._post({
                    render
                })
            }
        }
    }
    private removeNode(key:string){
        const nodeMapItem = this.vNodes.get(key);
        // console.log('removeNode', key, this.vNodes.curNodeMap.size, nodeMapItem, this.getWorkShape(key), this.workShapes.get(key),this.workShapes.get(key.toString()), this.getWorkShapes().keys(), this.fullLayer?.getElementsByName(key))
        if (nodeMapItem) {
            this.fullLayer?.getElementsByName(key).forEach(node=>{
                node.remove();
            });
            this.vNodes.delete(key);
        }
        const drawRect = this.drawLayer && BaseShapeTool.getRectFromLayer(this.drawLayer, key);
        if (drawRect) {
            const node = this.drawLayer?.getElementsByName(key)[0];
            this.drawLayer?.removeChild(node)
        }
        if (this.getWorkShape(key)) {
            this.clearWorkShapeNodeCache(key);
        }
        return {fullRect:nodeMapItem?.rect, drawRect};
    }
    private _removeWork(workId:string){
        const {fullRect, drawRect} = this.removeNode(workId);
        const render: IMainMessageRenderData[] = [];
        if (fullRect) {
            render.push({
                rect: getSafetyRect(fullRect),
                clearCanvas: ECanvasShowType.Bg,
                isClear: true,
                viewId: this.viewId
            },
            {
                rect: getSafetyRect(fullRect),
                drawCanvas: ECanvasShowType.Bg,
                viewId: this.viewId
            })
        }
        if (drawRect) {
            render.push({
                rect: getSafetyRect(drawRect),
                clearCanvas: ECanvasShowType.Float,
                isClear: true,
                viewId: this.viewId
            },
            {
                rect: getSafetyRect(drawRect),
                drawCanvas: ECanvasShowType.Float,
                viewId: this.viewId
            })
        }
        return render;
    }

    async checkTextActive(data:IWorkerMessage):Promise<void>{
        const {op, viewId, dataType}= data;
        if (op?.length) {
            let activeId:string|undefined;
            let workShape:TextShape|undefined;
            const x = op[0] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0];
            const y = op[1] * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1];
            for (const value of this.vNodes.curNodeMap.values()) {
                const {rect, name, toolsType, opt} =value;
                if(toolsType === EToolsKey.Text && (opt as TextOptions).workState === EvevtWorkState.Done && isIntersectForPoint([x,y],rect)) {
                    activeId = name;
                    workShape = this.setFullWork({workId:name, toolsType, opt}) as TextShape;
                    break;
                }
            }
            if (activeId) {
                if (workShape) {
                    await (workShape as TextShape).consumeServiceAsync({
                        isFullWork: true,
                        replaceId: workShape.getWorkId(),
                        isDrawLabel: false
                    });
                }
                await this.blurSelector({    
                    viewId,
                    msgType: EPostMessageType.Select,
                    dataType,
                    isSync: true
                });
                await this._post({
                    sp:[{
                        type:EPostMessageType.GetTextActive,
                        toolsType: EToolsKey.Text,
                        workId: activeId
                    }]
                })
            }
        }
        
    }
    async colloctEffectSelectWork(data:IWorkerMessage):Promise<IWorkerMessage | undefined>{
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const {workId,msgType} = data;
        if (workShapeNode && workId && workShapeNode.selectIds && workShapeNode.selectIds.includes(workId.toString())) {
            if (msgType === EPostMessageType.RemoveNode) {
                workShapeNode.selectIds = workShapeNode.selectIds.filter(id => id !== workId.toString());
            } else {
                this.effectSelectNodeData.add(data)
            }
            // await new Promise((resolve)=>{
            //     setTimeout(()=>{
            //         resolve(true);
            //     },0)
            // })
            await this.runEffectSelectWork(true).then(()=>{
                this.effectSelectNodeData?.clear();
            }); 
            return undefined;
        }
        return data;
    }
    async updateSelector(params: IUpdateSelectorPropsType & {
        callback?:(props:{
            res?:IMainMessage,
            param: IUpdateSelectorPropsType, 
            postData: Pick<IBatchMainMessage,'sp'|'render'>,
            workShapeNode: SelectorShape,
            newServiceStore:Map<string,{
                opt: BaseShapeOptions;
                toolsType: EToolsKey;
                ops?: string;
            }>
        })=>void;
    }): Promise<IMainMessage | undefined> {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode?.selectIds?.length) return;
        const {callback, ...param} = params;
        const {updateSelectorOpt, willSerializeData, scene} = param;
        const res = await workShapeNode?.updateSelector({
            updateSelectorOpt, 
            selectIds: cloneDeep(workShapeNode.selectIds),
            vNodes: this.vNodes,
            willSerializeData,
            worker: this,
            scene
        });
        const newServiceStore:Map<string,{
            opt: BaseShapeOptions;
            toolsType: EToolsKey;
            ops?: string;
        }> = new Map();
        let removeIds:string[]|undefined;
        if (res?.selectIds) {
            removeIds = xor(workShapeNode.selectIds, res.selectIds);
            res.selectIds.forEach(id=>{
                const info = this.vNodes.get(id);
                if(info){
                    const {toolsType, op, opt} = info;
                    newServiceStore.set(id, {
                        opt,
                        toolsType,
                        ops: op?.length && transformToSerializableData(op) || undefined
                    });
                }
            })
            workShapeNode.selectIds = res.selectIds;
            // console.log('removeIds', removeIds)
        }
        const render: IMainMessageRenderData[] = [];
        const sp:IMainMessage[] = [];
        if (res?.rect) {
            render.push({
                rect: getSafetyRect(res.rect),
                clearCanvas: ECanvasShowType.Bg,
                isClear: true,
                viewId: this.viewId
            },
            {
                rect: getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Bg,
                viewId: this.viewId
            })
        }
        const _postData = callback && callback({
            res,
            workShapeNode,
            param,
            postData:{ render, sp },
            newServiceStore
        }) || { render, sp };
        if (removeIds) {
            _postData.sp.push({
                type: EPostMessageType.RemoveNode,
                removeIds,
                viewId: this.viewId
            })
        }
        if (_postData.render.length || _postData.sp.length) {
            await this._post(_postData);
        }
    }
    async blurSelector(data?:IWorkerMessage): Promise<void> {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const res = workShapeNode?.blurSelector();
        this.clearWorkShapeNodeCache(SelectorShape.selectorId);
        (this.fullLayer?.parent as Layer).children.forEach(c=>{
            if (c.name === SelectorShape.selectorId) {
                c.remove();
            }
        });
        if (res) {
            const sp:IMainMessage[] = [];
            sp.push({
                ...res,
                isSync: data?.isSync
            });
            await this._post({
                render: res?.rect && [{
                    rect: getSafetyRect(res.rect),
                    clearCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    viewId: this.viewId
                },
                {
                    rect: getSafetyRect(res.rect),
                    drawCanvas: ECanvasShowType.Bg,
                    viewId: this.viewId
                }],
                sp
            });
        }
    }
    hasSelector(){
        return this.workShapes.has(SelectorShape.selectorId)
    }
    getSelector(){
        return this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
    }
    async reRenderSelector(willSyncService:boolean = false){
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode) return ;
        if (workShapeNode && !workShapeNode.selectIds?.length) {
            await this.blurSelector();
            return;
        }
        const oldSelectRect = workShapeNode.oldSelectRect;
        const newRect = workShapeNode.reRenderSelector();
        if (newRect) {
            const rect = computRect(oldSelectRect, newRect) || newRect;
            await this._post({
                render: [
                    {
                        rect: getSafetyRect(rect),
                        clearCanvas: ECanvasShowType.Bg,
                        isClear: true,
                        viewId: this.viewId
                    },
                    {
                        rect: getSafetyRect(rect),
                        drawCanvas: ECanvasShowType.Bg,
                        viewId: this.viewId
                    }
                ],
                sp:[{
                    type: EPostMessageType.Select,
                    selectIds: workShapeNode.selectIds,
                    selectRect: newRect,
                    willSyncService,
                    viewId: this.viewId,
                    points: workShapeNode.getChildrenPoints(),
                    textOpt: workShapeNode.textOpt,
                    selectorColor: workShapeNode.selectorColor,
                    strokeColor: workShapeNode.strokeColor,
                    fillColor: workShapeNode.fillColor,
                    canTextEdit: workShapeNode.canTextEdit,
                    canRotate: workShapeNode.canRotate,
                    scaleType: workShapeNode.scaleType,
                    opt: workShapeNode.getWorkOptions() || undefined,
                    canLock: workShapeNode.canLock,
                    isLocked: workShapeNode.isLocked,
                    toolsTypes: workShapeNode.toolsTypes,
                    shapeOpt: workShapeNode.shapeOpt
                }]
            });
        }
    }
    async updateFullSelectWork(data:IWorkerMessage){
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const {selectIds} = data;
        if (!selectIds?.length) {
            await this.blurSelector(data);
            return;
        }
        if (!workShapeNode) {
            const curWorkShapes = this.setFullWork(data);
            if (!curWorkShapes && data.workId && this.tmpOpt?.toolsType === EToolsKey.Selector) {
                this.createWorkShape(data.workId.toString());
            }
            await this.updateFullSelectWork(data);
            return;
        }
        if (workShapeNode && selectIds?.length) {
            const {bgRect, selectRect} = workShapeNode.updateSelectIds(selectIds);
            const _postData:IBatchMainMessage = {
                render:[],
                sp:[]
            }
            if (bgRect) {
                _postData.render?.push({
                    rect: getSafetyRect(bgRect),
                    clearCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    viewId: this.viewId
                },
                {
                    rect: getSafetyRect(bgRect),
                    drawCanvas: ECanvasShowType.Bg,
                    viewId: this.viewId
                })
            }
            _postData.sp?.push({
                ...data,
                selectorColor: data.opt?.strokeColor || workShapeNode.selectorColor,
                strokeColor: data.opt?.strokeColor || workShapeNode.strokeColor,
                fillColor: data.opt?.fillColor || workShapeNode.fillColor,
                textOpt: data.opt?.textOpt || workShapeNode.textOpt,
                canTextEdit: workShapeNode.canTextEdit,
                canRotate: workShapeNode.canRotate,
                scaleType: workShapeNode.scaleType,
                type: EPostMessageType.Select,
                selectRect: selectRect,
                points: workShapeNode.getChildrenPoints(),
                willSyncService: data?.willSyncService || false,
                opt: data?.willSyncService && workShapeNode.getWorkOptions() || undefined,
                canLock: workShapeNode.canLock,
                isLocked: workShapeNode.isLocked,
                toolsTypes: workShapeNode.toolsTypes,
                shapeOpt: workShapeNode.shapeOpt
            })
            await this._post(_postData);
        }
    }
    destroy(): void {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
            this.combineDrawResolve && this.combineDrawResolve(false);
        }
        super.destroy();
        this.effectSelectNodeData.clear();
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
    }
    private async drawPencilCombine(workId:string) {
        const result = (this.workShapes.get(workId) as PencilShape)?.combineConsume();
        if (result) {
            const combineDrawResult: IBatchMainMessage = {
                render: [],
                drawCount: this.drawCount
            };
            if (result?.rect) {
                const rect = getSafetyRect(result.rect);
                combineDrawResult.render?.push({
                    rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    viewId: this.viewId
                })
                combineDrawResult.render?.push({
                    rect,
                    drawCanvas: ECanvasShowType.Float,
                    viewId: this.viewId
                })
            }
            await this._post(combineDrawResult)
        }
    }
    private async drawSelector(res:IMainMessage) {
        const _postData:IBatchMainMessage = {
            render:[],
            sp:[res]
        };
        res.rect && _postData.render?.push(
            {
                rect: getSafetyRect(res.rect),
                clearCanvas: ECanvasShowType.Bg,
                isClear: true,
                viewId: this.viewId
            },
            {
                rect: getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Bg,
                viewId: this.viewId
            }
        )
        await this._post(_postData);
    }
    private async drawEraser(result:IMainMessage) {
        const sp:IMainMessage[] = [];
        if (result.newWorkDatas?.size) {
            for (const d of result.newWorkDatas.values()) {
                const workId = d.workId.toString();
                this.batchEraserWorks.add(workId);
                sp.push({
                    type: EPostMessageType.FullWork,
                    workId,
                    ops: transformToSerializableData(d.op),
                    opt: d.opt,
                    toolsType: d.toolsType,
                    updateNodeOpt: {
                        useAnimation:false
                    }
                })
            }
            delete result.newWorkDatas;
        }
        result.removeIds?.forEach((id) => {
            this.batchEraserRemoveNodes.add(id);
        })
        sp.push(result);
        await this._post({ sp });
        this.batchEraserCombine();
    }
    private batchEraserCombine = throttle(() => {
        const render = this.updateBatchEraserCombineNode(this.batchEraserWorks, this.batchEraserRemoveNodes);
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
        if (render.length) {
            this._post({
                render
            })
        }
    }, 100, {'leading':false})
    private async drawPencil(res:IMainMessage) {
        await this._post({
            drawCount: this.drawCount,
            sp: res?.op && [res]
        });
    }
    private async drawPencilFull(res:IMainMessage) {
        const _postData:IBatchMainMessage = {
            drawCount: Infinity,
            render: [],
            sp: [ res ]
        }
        _postData.render?.push({
            isClearAll: true,
            clearCanvas: ECanvasShowType.Float,
            viewId: this.viewId
        },
        {
            rect: res.rect,
            isClear: true,
            clearCanvas: ECanvasShowType.Bg,
            viewId: this.viewId
        },
        {
            rect: res.rect,
            drawCanvas: ECanvasShowType.Bg,
            viewId: this.viewId
        })
        await this._post(_postData);
    }
    private updateBatchEraserCombineNode(inFullLayerIds:Set<string>,removeIds:Set<string>) {
        const render: IMainMessageRenderData[] = [];
        let fullLayerRect:IRectType|undefined;
        for (const key of removeIds.keys()) {
            this.fullLayer.getElementsByName(key).forEach(node => {
                const r = (node as Path).getBoundingClientRect()
                fullLayerRect = computRect(fullLayerRect, {
                    x: r.x - EraserShape.SafeBorderPadding,
                    y: r.y - EraserShape.SafeBorderPadding,
                    w: r.width + EraserShape.SafeBorderPadding * 2,
                    h: r.height + EraserShape.SafeBorderPadding * 2,
                });
                node.remove();
            });
        }
        inFullLayerIds.forEach(key=>{
            const info = this.vNodes.get(key);
            if (info) {
                const node = this.fullLayer.getElementsByName(key)[0];
                if (!node) {
                    const workShape = this.setFullWork({...info, workId: key});
                    // todo check image consumeService
                    const r = workShape && workShape.consumeService({
                        op: info.op, 
                        isFullWork: true,
                    });
                    if (r) {
                        info.rect = r;
                        fullLayerRect = computRect(fullLayerRect,r);
                    }
                } else {
                    fullLayerRect = computRect(fullLayerRect, info.rect);
                }
            }
        })
        if(fullLayerRect){
            render.push({
                rect:fullLayerRect,
                isClear: true,
                clearCanvas:ECanvasShowType.Bg,
                viewId:this.viewId
            },
            {
                rect:fullLayerRect,
                drawCanvas:ECanvasShowType.Bg,
                viewId:this.viewId
            })
        }
        return render;
    }
    private async runEffectSelectWork(willSyncService?:boolean){
        for (const data of this.effectSelectNodeData.values()) {
            const workShape = this.setFullWork(data);
            if (workShape) {
                const replaceId = workShape.getWorkId()?.toString();
                if (workShape.toolsType === EToolsKey.Image) {
                    await (workShape as ImageShape).consumeServiceAsync({
                        scene: this.drawLayer?.parent?.parent as Scene,
                        isFullWork: true,
                        replaceId
                    });
                } else if (workShape.toolsType === EToolsKey.Text) {
                    await (workShape as TextShape).consumeServiceAsync({
                        isFullWork: true,
                        replaceId
                    });
                } else  {
                    const op = data.ops && transformToNormalData(data.ops);
                    workShape.consumeService({
                        op, 
                        isFullWork: true,
                        replaceId
                    });
                    data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
                }
                data.workId && this.workShapes.delete(data.workId.toString())
            }
        }
        await this.reRenderSelector(willSyncService);
    }
    async cursorHover(msg:IWorkerMessage){
        const {opt,toolsType, point} = msg;
        const workShape = this.setFullWork({
            workId: Cursor_Hover_Id,
            toolsType,
            opt
        });
        if (workShape && point) {
            const res = (workShape as SelectorShape).cursorHover(point);
            const _postData:IBatchMainMessage = {
                render:[]
            };
            if (res && res.type === EPostMessageType.CursorHover && res.rect) {
                _postData.render?.push(
                    {
                        rect: getSafetyRect(res.rect),
                        clearCanvas: ECanvasShowType.Bg,
                        isClear: true,
                        viewId: this.viewId
                    },
                    {
                        rect: getSafetyRect(res.rect),
                        drawCanvas: ECanvasShowType.Bg,
                        viewId: this.viewId
                    }
                )
                await this._post(_postData);
            }
        }
    }
    async cursorBlur(){
        const cursorHover = this.getWorkShape(Cursor_Hover_Id) as SelectorShape;
        let rect:IRectType|undefined;
        if (cursorHover && cursorHover.selectIds?.length) {
            rect = cursorHover.oldSelectRect;
            cursorHover.cursorBlur();
            this.clearWorkShapeNodeCache(Cursor_Hover_Id);
            if (rect) {
                await this._post({
                    render: [
                        {
                            rect: getSafetyRect(rect),
                            clearCanvas: ECanvasShowType.Bg,
                            isClear: true,
                            viewId: this.viewId
                        },
                        {
                            rect: getSafetyRect(rect),
                            drawCanvas: ECanvasShowType.Bg,
                            viewId: this.viewId
                        }
                    ]
                })
            }
        }
        (this.fullLayer.parent as Layer).children.forEach(c => {
            if (c.name === 'Cursor_Hover_Id') {
                c.remove()
            }
        });
    }
}