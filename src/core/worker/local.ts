import type  { Path, Node, Group, Layer } from "spritejs";
import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { SubLocalWork, VNodeManager } from "../threadEngine";
import { ECanvasShowType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { BaseShapeOptions, BaseShapeTool, EraserShape, PencilShape, SelectorShape, ShapeStateInfo } from "../tools";
import { IWorkerMessage, IMainMessage, IBatchMainMessage, IworkId, IUpdateNodeOpt, IRectType, IMainMessageRenderData } from "../types";
import { computRect, isIntersectForPoint, isSealedGroup } from "../utils";
import { EmitEventType } from "../../plugin/types";
import { SubServiceWorkForWorker } from "./service";
import throttle from "lodash/throttle";
import { TextShape } from "../tools/text";

export class SubLocalWorkForWorker extends SubLocalWork {
    _post: (msg: IBatchMainMessage) => Promise<void>;
    workShapes: Map<IworkId, BaseShapeTool> = new Map();
    private combineUnitTime: number = 600
    private combineTimerId?: number;
    private drawCount:number = 0;
    private effectSelectNodeData:Set<IWorkerMessage> = new Set();
    private batchEraserWorks:Set<string> = new Set();
    private batchEraserRemoveNodes:Set<string> = new Set();
    constructor(vNodes: VNodeManager, layer: Group, drawLayer: Group, postFun: (msg: IBatchMainMessage)=>Promise<void>) {
        super(vNodes, layer, drawLayer);
        this._post = postFun;
    }
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
            })
            // console.log('drawPencilCombine', cloneDeep(combineDrawResult))
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
                },
                {
                    rect: res.rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                },
                {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
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
            },
            {
                rect: res.rect,
                drawCanvas: ECanvasShowType.Bg,
                isClear: true,
                clearCanvas: ECanvasShowType.Bg,
                isFullWork: true,
            });
        }
        // console.log('_postData', _postData)
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
            }],
            sp: [ res ]
        }
        _postData.render?.push({
            isClearAll: true,
            clearCanvas: ECanvasShowType.Float,
            isFullWork: false
        })
        this._post(_postData);
    }
    consumeDraw(data: IWorkerMessage, serviceWork:SubServiceWorkForWorker): IMainMessage | undefined {
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
    consumeDrawAll(data: IWorkerMessage, serviceWork:SubServiceWorkForWorker): IMainMessage | undefined {
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
        const res = workShapeNode?.updateSelector({
            updateSelectorOpt, 
            selectIds: workShapeNode.selectIds,
            vNodes: this.vNodes,
            willSerializeData,
            worker: this,
        });
        const selectRect:IRectType|undefined = res?.selectRect;
        const newServiceStore:Map<string,{
            // op?: number[];
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
        const render: {
            rect?: IRectType;
            isClear?: boolean;
            isClearAll?: boolean;
            isFullWork?: boolean;
            clearCanvas?: ECanvasShowType;
            drawCanvas?: ECanvasShowType;
        }[] = [];
        const sp:IMainMessage[] = [];
        if(willRefreshSelector){
            render.push({
                isClearAll: true,
                isFullWork: false,
                clearCanvas: ECanvasShowType.Selector,
            })
            render.push({
                rect: selectRect, 
                isFullWork: false,
                drawCanvas: ECanvasShowType.Selector,
            })
        }
        if (willSyncService) {
            if (willSerializeData) {
                if (emitEventType === EmitEventType.RotateNode && workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: true,
                        isSync
                    })
                }
                if (emitEventType === EmitEventType.ScaleNode && workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: false,
                        isSync
                    })
                }
            } 
            else {
                if (emitEventType === EmitEventType.ScaleNode && workState === EvevtWorkState.Start) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        canvasWidth: (this.fullLayer.parent as Layer).width,
                        canvasHeight: (this.fullLayer.parent as Layer).height,
                        willSyncService: false
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
            console.log('updateSelector', render, sp)
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
                }],
                sp
            });
        }
    }
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>){
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
                    })
                }
                render.push({
                    rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
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
                        undoTickerId: data.undoTickerId
                    }]) || undefined
                }
                this._post(_postData)
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
        // console.log('updateNode', workId, updateNodeOpt, willRefresh, willSyncService)
        if(!workId){
            return ;
        }
        const nodeInfo = this.vNodes.get(workId.toString());
        if (!nodeInfo) {
            return;
        }
        const {toolsType, opt, } = nodeInfo;
        const workShape = this.setFullWork({
            workId,
            toolsType,
            opt
        }) as TextShape;
        workShape.updataOptService(updateNodeOpt);
        const sp:IMainMessage[] = [];
        const render:IMainMessageRenderData[] = [];
        if (willRefresh) {
            if (nodeInfo.toolsType === EToolsKey.Text) {
                sp.push({
                    type: EPostMessageType.TextUpdate,
                    workId,
                    toolsType: EToolsKey.Text,
                    opt: nodeInfo.opt
                })
            }
            if (willSyncService) {
                sp.push({
                    type: EPostMessageType.UpdateNode,
                    workId,
                    toolsType: EToolsKey.Text,
                    opt: nodeInfo.opt
                })
            }
        }
        if (sp.length || render.length) {
            this._post({render,sp})
        }
        // todo other shape
    }
    removeNode(key:string){
        this.workShapes.has(key) && this.clearWorkShapeNodeCache(key);
        let rect:IRectType|undefined;
        const removeNode:Node[]=[]
        const nodeMapItem = this.vNodes.get(key);
        if (nodeMapItem) {
            this.fullLayer.getElementsByName(key).concat(this.drawLayer?.getElementsByName(key) || []).forEach(node=>{
                removeNode.push(node);
            })
            if(removeNode.length) {
                removeNode.forEach(r=>r.remove());
            }
            rect = computRect(rect, nodeMapItem.rect);
            this.vNodes.delete(key);
        }
        return rect;
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
                        drawCanvas: ECanvasShowType.Bg
                    }]
                })
            }
        }
    }
    runReverseSelectWork(data:IWorkerMessage):void{
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        const {selectIds} = data;
        const backIds:string[] = [];
        if (workShapeNode && selectIds && workShapeNode.selectIds) {
            for (const id of selectIds) {
                const i = workShapeNode.selectIds.findIndex(_id=>_id === id);
                if (i>-1) {
                    workShapeNode.selectIds.splice(i,1);
                    backIds.push(id);
                }
            }
            if (backIds.length) {
                const cloneNodes:Array<Path | Group> = [];
                if (workShapeNode.selectIds.length !== 0) {
                    this.reRenderSelector()
                }
                let rect:IRectType|undefined;
                backIds.forEach(id=>{
                    const node = this.drawLayer?.getElementsByName(id)[0]
                    if (node) {
                        const cloneP = node.cloneNode(true) as (Path | Group);
                        if(isSealedGroup(node)){
                            (cloneP as Group).seal();
                        }
                        cloneNodes.push(cloneP);
                        node.remove();
                        const n = this.vNodes.get(id);
                        if (n) {
                            rect = computRect(rect,n.rect);
                        }
                    }
                });
                cloneNodes.length && this.fullLayer.append(...cloneNodes);
                if (rect) {
                    this._post({
                        render: [{
                            rect,
                            isClear:true,
                            isFullWork:true,
                            clearCanvas:ECanvasShowType.Bg,
                            drawCanvas:ECanvasShowType.Bg,
                        }],
                        sp: workShapeNode.selectIds.length === 0 && [{
                            type: EPostMessageType.Select,
                            selectIds: [],
                            willSyncService: false
                        }] || undefined
                    });
                }
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
                })
            }
            _postData.render?.push({
                rect: bgRect || selectRect,
                isClear:true,
                isFullWork:false,
                clearCanvas:ECanvasShowType.Selector,
                drawCanvas:ECanvasShowType.Selector,
            })
            _postData.sp?.push({
                ...data,
                selectorColor: data.opt?.strokeColor,
                strokeColor: data.opt?.strokeColor,
                fillColor: data.opt?.fillColor,
                type: EPostMessageType.Select,
                selectRect: bgRect || selectRect,
                willSyncService: false
            })
            this._post(_postData);
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
            })
        }
        return render;
    }
}