import throttle from "lodash/throttle";
import { ECanvasShowType, EPostMessageType, IWorkerMessage, IMainMessage, IRectType, EToolsKey, IBatchMainMessage, IworkId, IMainMessageRenderData, EvevtWorkState, IUpdateNodeOpt } from "..";
import { BaseShapeOptions, EraserShape, PencilShape, SelectorShape, ShapeStateInfo } from "../tools";
import { ISubWorkerInitOption, LocalWork } from "./base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { Layer, Path } from "spritejs";
import { computRect, isIntersectForPoint } from "../utils";
import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { EmitEventType } from "../../plugin/types";
// import cloneDeep from "lodash/cloneDeep";

export class LocalWorkForFullWorker extends LocalWork {
    private combineUnitTime: number = 600
    private combineTimerId?: number;
    private effectSelectNodeData:Set<IWorkerMessage> = new Set();
    private batchEraserWorks:Set<string> = new Set();
    private batchEraserRemoveNodes:Set<string> = new Set();
    constructor(opt:ISubWorkerInitOption){
        super(opt);
    }
    consumeDraw(data: IWorkerMessage, serviceWork:ServiceWorkForFullWorker): IMainMessage | undefined {
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
                isFullWork:true
            });
            switch (toolsType) {
                case EToolsKey.Selector:
                    if (result.type === EPostMessageType.Select) {
                        result.selectIds && serviceWork.runReverseSelectWork(result.selectIds)
                        this.drawSelector(result, true);
                    }
                    break;
                case EToolsKey.Eraser:
                    if (result?.rect) {
                        this.drawEraser(result);
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
                        this.drawPencil(result);
                    }
                    break;
                case EToolsKey.Pencil:
                    if(!this.combineTimerId) {
                        this.combineTimerId = setTimeout(() => {
                            this.combineTimerId = undefined;
                            this.drawPencilCombine(workId);
                        }, Math.floor(workShapeNode.getWorkOptions().syncUnitTime || this.combineUnitTime / 2)) as unknown as number;
                    }
                    if (result) {
                        this.drawCount++;
                        this.drawPencil(result);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    consumeDrawAll(data: IWorkerMessage, serviceWork:ServiceWorkForFullWorker): IMainMessage | undefined {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
        }
        const {workId, undoTickerId} = data;
        if (workId) {
            if (undoTickerId) {
                setTimeout(()=>{
                    this._post({
                        sp:[{
                            type: EPostMessageType.None,
                            undoTickerId,
                        }]
                    })
                },0)
            }
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            const r = workShapeNode.consumeAll({ data });
            const workShapeState = this.workShapeState.get(workId);
            switch (toolsType) {
                case EToolsKey.Selector:
                    r.selectIds && serviceWork.runReverseSelectWork(r.selectIds)
                    this.drawSelector(r, false);
                    if (!(workShapeNode as SelectorShape).selectIds?.length) {
                        this.clearWorkShapeNodeCache(workId);
                    } else {
                        workShapeNode.clearTmpPoints();
                    }
                    break;
                case EToolsKey.Eraser:
                    if (r?.rect) {
                        this.drawEraser(r);
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
                    this.drawPencilFull(r, workShapeNode.getWorkOptions(), workShapeState);
                    this.drawCount = 0;
                    this.clearWorkShapeNodeCache(workId);
                    break;
                case EToolsKey.Pencil:
                    if (r?.rect) {
                        this.drawPencilFull(r, workShapeNode.getWorkOptions(), workShapeState);
                        this.drawCount = 0;
                    }
                    this.clearWorkShapeNodeCache(workId);
                    break;
                default:
                    break;
            }
        }  
    }
    consumeFull(data: IWorkerMessage){
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        const workIdStr = data.workId?.toString();
        if (!workIdStr) {
            return;
        }
        if (workShape) {
            const oldRect = this.vNodes.get(workIdStr)?.rect;
            let rect = workShape.consumeService({
                op, 
                isFullWork: true,
                replaceId: workIdStr,
            });
            const rect1 = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            rect = computRect(rect, rect1);
            if (rect && data.willRefresh) {
                const render:IMainMessageRenderData[] = [];
                if (oldRect) {
                    render.push({
                        rect,
                        isClear:true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                        viewId:this.viewId
                    })
                }
                render.push({
                    rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId:this.viewId
                });
                const _postData = {
                    render,
                    sp:( data.willSyncService && [{
                        opt:data.opt,
                        toolsType: data.toolsType,
                        type: EPostMessageType.FullWork,
                        workId: data.workId,
                        ops: data.ops,
                        updateNodeOpt: data.updateNodeOpt,
                        undoTickerId: data.undoTickerId,
                        viewId:this.viewId
                    }]) || undefined
                }
                this._post(_postData)
            }
            data.workId && this.workShapes.delete(data.workId)
        }
    }
    removeWork(data:IWorkerMessage) {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            const rect = this.removeNode(key);
            if (rect) {
                this._post({
                    render:[{
                        rect,
                        isClear: true,
                        isFullWork: true,
                        clearCanvas: ECanvasShowType.Bg,
                        drawCanvas: ECanvasShowType.Bg,
                        viewId:this.viewId
                    }]
                })
            }
        }
    }
    removeNode(key:string){
        this.workShapes.has(key) && this.clearWorkShapeNodeCache(key);
        let rect:IRectType|undefined;
        const nodeMapItem = this.vNodes.get(key);
        if (nodeMapItem) {
            this.fullLayer.getElementsByName(key).concat(this.drawLayer?.getElementsByName(key) || []).forEach(node=>{
                node.remove();
            })
            rect = computRect(rect, nodeMapItem.rect);
            this.vNodes.delete(key);
        }
        return rect;
    }
    checkTextActive(data:IWorkerMessage){
        const {op}= data;
        if (op?.length) {
            let activeId:string|undefined;
            for (const value of this.vNodes.curNodeMap.values()) {
                const {rect, name, toolsType} =value;
                const x = op[0] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0];
                const y = op[1] * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1];
                if(toolsType === EToolsKey.Text && isIntersectForPoint([x,y],rect)) {
                    activeId = name;
                    break;
                }
            }
            if (activeId) {
                const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
                if (workShapeNode && workShapeNode.selectIds?.includes(activeId)) {
                    this.blurSelector()
                }
                this._post({
                    sp:[{
                        type:EPostMessageType.GetTextActive,
                        toolsType: EToolsKey.Text,
                        workId: activeId
                    }]
                })
            }
        }
        
    }
    colloctEffectSelectWork(data:IWorkerMessage):IWorkerMessage | undefined{
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const {workId} = data;
        if (workShapeNode && workId && workShapeNode.selectIds && workShapeNode.selectIds.includes(workId.toString())) {
            this.effectSelectNodeData.add(data)
            setTimeout(()=>{
                this.runEffectSelectWork();
                this.effectSelectNodeData?.clear();
            },0)
            return undefined;
        }
        return data;
    }
    updateSelector(param:{
        updateSelectorOpt: IUpdateNodeOpt;
        willRefreshSelector?: boolean;
        willSyncService?: boolean;
        willSerializeData?:boolean;
        emitEventType?: EmitEventType;
        isSync?:boolean;
        textUpdateForWoker?:boolean;
    }): IMainMessage | undefined {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode?.selectIds?.length) return;
        const {updateSelectorOpt, willRefreshSelector, willSyncService, willSerializeData, emitEventType, isSync, textUpdateForWoker} = param;
        const workState = updateSelectorOpt.workState;
        // console.log('updateSelector', updateSelectorOpt, this.viewId)
        const res = workShapeNode?.updateSelector({
            updateSelectorOpt, 
            selectIds: workShapeNode.selectIds,
            vNodes: this.vNodes,
            willSerializeData,
            worker: this,
        });
        const selectRect:IRectType|undefined = res?.selectRect;
        const newServiceStore:Map<string,{
            opt: BaseShapeOptions;
            toolsType: EToolsKey;
            ops?: string;
        }> = new Map();
        workShapeNode.selectIds.forEach(id=>{
            const info = this.vNodes.get(id);
            if(info){
                const {toolsType, op, opt} = info;
                // console.log('newServiceStore', opt.translate, opt.scale, opt.rotate)
                newServiceStore.set(id, {
                    opt,
                    toolsType,
                    ops: op?.length && transformToSerializableData(op) || undefined
                });
            }
        })
        if (emitEventType === EmitEventType.TranslateNode && workState === EvevtWorkState.Start) {
            return;
        }
        const render: IMainMessageRenderData[] = [];
        const sp:IMainMessage[] = [];
        if(willRefreshSelector){
            render.push({
                isClearAll: true,
                isFullWork: false,
                clearCanvas: ECanvasShowType.Selector,
                viewId: this.viewId,
            })
            const reRenderSelectorDate:IMainMessageRenderData = {
                rect: selectRect, 
                isFullWork: false,
                drawCanvas: ECanvasShowType.Selector,
                viewId: this.viewId,
            }
            if (updateSelectorOpt.translate && emitEventType === EmitEventType.TranslateNode && workState === EvevtWorkState.Doing) {
                reRenderSelectorDate.translate = updateSelectorOpt.translate;
            }
            render.push(reRenderSelectorDate)
        }
        if (willSyncService) {
            if (willSerializeData) {
                if (emitEventType === EmitEventType.RotateNode && workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: true,
                        isSync,
                        points: workShapeNode.getChildrenPoints()
                    })
                }
                if (emitEventType === EmitEventType.ScaleNode && workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: false,
                        isSync,
                        points: workShapeNode.getChildrenPoints()
                    })
                }
                if (emitEventType === EmitEventType.TranslateNode && workState === EvevtWorkState.Done) {
                    const points = workShapeNode.getChildrenPoints();
                    if (points) {
                        sp.push({
                            type: EPostMessageType.Select,
                            selectIds: workShapeNode.selectIds,
                            selectRect,
                            willSyncService: false,
                            isSync,
                            points
                        })
                    }
                }
            } 
            else {
                if (updateSelectorOpt.fontSize) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: true,
                        isSync,
                        points: workShapeNode.getChildrenPoints()
                    })
                }
                if (updateSelectorOpt.pointMap) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: false,
                        isSync,
                        points: workShapeNode.getChildrenPoints()
                    })
                }
                if (emitEventType === EmitEventType.ScaleNode && workState === EvevtWorkState.Start) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        canvasWidth: (this.fullLayer.parent as Layer).width,
                        canvasHeight: (this.fullLayer.parent as Layer).height,
                        willSyncService: false,
                        points: workShapeNode.getChildrenPoints()
                    })
                }
            }
            for (const [workId, info] of newServiceStore.entries()) {
                if (textUpdateForWoker && info.toolsType === EToolsKey.Text) {
                    sp.push({
                        ...info,
                        workId,
                        type: EPostMessageType.TextUpdate,
                    })
                } else {
                    sp.push(
                        {
                            ...info,
                            workId,
                            type: EPostMessageType.UpdateNode,
                            updateNodeOpt: {
                                useAnimation: false
                            },
                            isSync
                        }
                    )
                }
            }
        }
        if (render.length || sp.length) {
            // console.log('updateSelector', render, sp, cloneDeep(this.vNodes.curNodeMap))
            this._post({ render, sp });
        }
    }
    blurSelector(data?:IWorkerMessage): void {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const res = workShapeNode?.blurSelector();
        this.clearWorkShapeNodeCache(SelectorShape.selectorId);
        (this.drawLayer?.parent as Layer).children.forEach(c=>{
            if (c.name === SelectorShape.selectorId) {
                c.remove();
            }
        });
        if (res) {
            const sp:IMainMessage[] = [res];
            if (data?.undoTickerId) {
                sp.push({
                    type: EPostMessageType.Select,
                    selectIds:[],
                    undoTickerId: data.undoTickerId
                })
            }
            this._post({
                render: res?.rect && [{
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId:this.viewId
                }],
                sp
            });
        }
    }
    runEffectWork(callBack?:()=>void){
        this.batchEffectWork(callBack);
    }
    reRenderSelector(){
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode?.selectIds?.length) return;
        if (this.drawLayer) {
            const newRect = workShapeNode.reRenderSelector();
            if (newRect) {
                this._post({
                    render: [
                        {
                            rect: newRect,
                            isClear:true,
                            isFullWork:false,
                            clearCanvas:ECanvasShowType.Selector,
                            drawCanvas:ECanvasShowType.Selector,
                            viewId: this.viewId
                        }
                    ],
                    sp:[{
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect: newRect,
                        willSyncService: false,
                        viewId: this.viewId,
                        points: workShapeNode.getChildrenPoints()
                    }]
                });
            }
        }
    }
    updateFullSelectWork(data:IWorkerMessage):void{
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const {selectIds} = data;
        if (!selectIds?.length) {
            this.blurSelector(data);
            return;
        }
        if (!workShapeNode) {
            this.setFullWork(data);
            this.updateFullSelectWork(data);
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
                    rect: bgRect,
                    isClear: true,
                    isFullWork: true,
                    clearCanvas: ECanvasShowType.Bg,
                    drawCanvas: ECanvasShowType.Bg,
                    viewId:this.viewId
                })
            }
            _postData.render?.push({
                rect: bgRect || selectRect,
                isClear:true,
                isFullWork:false,
                clearCanvas:ECanvasShowType.Selector,
                drawCanvas:ECanvasShowType.Selector,
                viewId:this.viewId
            })
            _postData.sp?.push({
                ...data,
                selectorColor: data.opt?.strokeColor,
                strokeColor: data.opt?.strokeColor,
                fillColor: data.opt?.fillColor,
                textOpt: data.opt?.textOpt,
                canTextEdit: workShapeNode.canTextEdit,
                canRotate: workShapeNode.canRotate,
                scaleType: workShapeNode.scaleType,
                type: EPostMessageType.Select,
                selectRect: bgRect || selectRect,
                willSyncService: false,
                points: workShapeNode.getChildrenPoints()
            })
            this._post(_postData);
        }
    }
    destroy(): void {
        super.destroy();
        this.effectSelectNodeData.clear();
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
    }
    private batchEffectWork = throttle((callBack?:()=>void)=>{
        if (this.vNodes.curNodeMap.size) {
            this.vNodes.updateNodesRect();
            this.reRenderSelector();
        }
        callBack && callBack();
    }, 100, {'leading':false})
    private drawPencilCombine(workId:IworkId) {
        const result = (this.workShapes.get(workId) as PencilShape)?.combineConsume();
        if (result) {
            const combineDrawResult: IBatchMainMessage = {
                render: [],
                drawCount: this.drawCount
            };
            combineDrawResult.render?.push({
                rect: result?.rect,
                isClear: true,
                drawCanvas: ECanvasShowType.Float,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId:this.viewId
            })
            this._post(combineDrawResult)
        }
    }
    private drawSelector(res:IMainMessage, isDrawing?:boolean) {
        const _postData:IBatchMainMessage = {
            render:[],
            sp:[res]
        };
        if (res.selectIds?.length && !isDrawing) {
            _postData.render?.push(
                {
                    rect: res.selectRect,
                    drawCanvas: ECanvasShowType.Selector,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Selector,
                    isFullWork: false,
                    viewId:this.viewId
                },
                {
                    rect: res.rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                    viewId:this.viewId
                },
                {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId:this.viewId
                }
            )
        }
        if (isDrawing) {
            _postData.render?.push({
                rect: res.rect,
                drawCanvas: ECanvasShowType.Float,
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId:this.viewId
            },
            {
                rect: res.rect,
                drawCanvas: ECanvasShowType.Bg,
                isClear: true,
                clearCanvas: ECanvasShowType.Bg,
                isFullWork: true,
                viewId:this.viewId
            });
        }
        // console.log('_postData', isDrawing, cloneDeep(_postData), this.fullLayer.children.length)
        this._post(_postData);
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
        this._post({ sp });
        this.batchEraserCombine();
    }
    private batchEraserCombine = throttle(() => {
        const render = this.updateBatchEraserCombineNode(this.batchEraserWorks, this.batchEraserRemoveNodes);
        // console.log('throttle', this.batchEraserWorks.keys(), this.batchEraserRemoveNodes.keys(), this.curNodeMap.keys());
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
        if (render.length) {
            // console.log('_post', this.fullLayer.children.map(c=>c.name))
            this._post({
                render
            })
        }
    }, 100, {'leading':false})

    private drawPencil(res:IMainMessage) {
        this._post({
            drawCount: this.drawCount,
            sp: res?.op && [res]
        });
    }
    private drawPencilFull(res:IMainMessage, opt:BaseShapeOptions, workShapeState?: ShapeStateInfo) {
        const _postData:IBatchMainMessage = {
            drawCount: Infinity,
            render: [{
                rect: res.rect,
                drawCanvas: ECanvasShowType.Bg,
                isClear: workShapeState?.willClear || opt?.isOpacity,
                clearCanvas: ECanvasShowType.Bg,
                isFullWork: true,
                viewId:this.viewId
            }],
            sp: [ res ]
        }
        _postData.render?.push({
            isClearAll: true,
            clearCanvas: ECanvasShowType.Float,
            isFullWork: false,
            viewId:this.viewId
        })
        this._post(_postData);
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
                    w: r.width + EraserShape.SafeBorderPadding,
                    h: r.height + EraserShape.SafeBorderPadding,
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
                isFullWork: true,
                clearCanvas:ECanvasShowType.Bg,
                drawCanvas:ECanvasShowType.Bg,
                viewId:this.viewId
            })
        }
        return render;
    }
    private runEffectSelectWork(){
        for (const data of this.effectSelectNodeData.values()) {
            const workShape = this.setFullWork(data);
            const op = data.ops && transformToNormalData(data.ops);
            if (workShape) {
                workShape.consumeService({
                    op, 
                    isFullWork: false,
                    replaceId: workShape.getWorkId()?.toString()
                });
                data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
                data.workId && this.workShapes.delete(data.workId)
            }
        }
        this.reRenderSelector();
    }
}