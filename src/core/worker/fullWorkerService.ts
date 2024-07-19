import { Group, Scene } from "spritejs";
import { ISubWorkerInitOption } from "./base";
import { VNodeManager } from "../vNodeManager";
import { IBatchMainMessage, IRectType, IServiceWorkItem, IWorkerMessage } from "../types";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { computRect, getSafetyRect } from "../utils";
import { ArrowShape, BaseShapeOptions, ImageShape, SelectorShape, getShapeInstance } from "../tools";
import { Storage_Splitter } from "../../collector/const";
import { transformToNormalData } from "../../collector/utils";
import { TextShape } from "../tools/text";
import { WorkThreadEngineForFullWorker } from "./workerManager";
import { DefaultAppliancePluginOptions } from "../../plugin/const";

export interface ServiceWork{
    readonly viewId: string;
    readonly vNodes:VNodeManager;
    readonly fullLayer: Group;
    readonly drawLayer: Group;
    readonly post: (msg: IBatchMainMessage) => void;
    selectorWorkShapes: Map<string, IServiceWorkItem>;
    runSelectWork(data: IWorkerMessage): void;
    consumeDraw(data:IWorkerMessage): void;
    setNodeKey(workId:string, workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions):IServiceWorkItem;
    runReverseSelectWork(selectIds: string[]):void;
    removeWork(data:IWorkerMessage):Promise<void>;
    removeSelectWork(data:IWorkerMessage):void;
    runSelectWork(data: IWorkerMessage):void;
    consumeFull(data: IWorkerMessage):void;
    consumeDraw(data: IWorkerMessage):void;
    destroy():void;
}

export class ServiceWorkForFullWorker implements ServiceWork {
    viewId: string;
    vNodes: VNodeManager;
    fullLayer: Group;
    drawLayer: Group;
    workShapes: Map<string, IServiceWorkItem> = new Map();
    selectorWorkShapes: Map<string, IServiceWorkItem> = new Map();
    thread: WorkThreadEngineForFullWorker;
    protected animationId?: number | undefined;
    private willRunEffectSelectorIds: Set<string> = new Set;
    private runEffectId?: number | undefined;
    private noAnimationRect:IRectType|undefined;
    private syncUnitTime: number = DefaultAppliancePluginOptions.syncOpt.interval;
    post: (msg: IBatchMainMessage) => Promise<void>;
    constructor(opt:ISubWorkerInitOption){
        this.viewId = opt.viewId;
        this.vNodes = opt.vNodes;
        this.fullLayer = opt.fullLayer;
        this.drawLayer = opt.drawLayer as Group;
        this.thread = opt.thread as WorkThreadEngineForFullWorker;
        this.post = opt.thread.post.bind(opt.thread);
    }
    destroy(): void {
        this.workShapes.clear();
        this.selectorWorkShapes.clear();
        this.willRunEffectSelectorIds.clear();
    }
    async consumeDraw(data:IWorkerMessage){
        this.activeWorkShape(data);
        this.runAnimation();
    }
    consumeFull(data: IWorkerMessage): void {
        this.activeWorkShape(data);
        this.runAnimation();
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
    setNodeKey(workId:string, workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions) { 
        workShape.toolsType = tools;
        workShape.node = getShapeInstance({
            workId,
            toolsType: tools,
            toolsOpt: opt,
            vNodes: this.vNodes,
            fullLayer: this.fullLayer,
            drawLayer: this.drawLayer,
        }, this);
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
    async removeWork(data:IWorkerMessage) {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            const workShape = this.workShapes.get(key);
            if (workShape) {
                this.workShapes.delete(key);
                await this.removeNode(key, data, workShape?.totalRect, false);
                return;
            }
            await this.removeNode(key, data);
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
    private async removeNode(key: string, data:IWorkerMessage, oldRect?: IRectType, isFullWork:boolean=true){
        if (key.indexOf(SelectorShape.selectorId) > -1) {
            this.removeSelectWork(data);
        }
        let rect:IRectType|undefined = oldRect;
        const rect1 = this.vNodes.get(key)?.rect;
        if (rect1) {
            rect = computRect(rect1, rect);
        }
        this.fullLayer.getElementsByName(key).forEach(c=>{
            c.remove();
        })
        this.drawLayer.getElementsByName(key).forEach(c=>{
            c.remove();
        })
        this.vNodes.delete(key);
        if (rect) {
            await this.post({
                render:[
                    {
                        rect: getSafetyRect(rect),
                        isClear:true,
                        clearCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.ServiceFloat,
                        workerType: isFullWork ? undefined : EDataType.Service,
                        viewId: this.viewId
                    },
                    {
                        rect: getSafetyRect(rect),
                        drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.ServiceFloat,
                        workerType: isFullWork ? undefined : EDataType.Service,
                        viewId: this.viewId
                    }
                ]
            })
        }
    }
    private activeWorkShape(data: IWorkerMessage){
        const {workId, opt, toolsType, type, updateNodeOpt, ops, op, useAnimation } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        const oldRect = this.vNodes.get(key)?.rect;
        if (!this.workShapes?.has(key)) {
            let workItem = {
                toolsType,
                animationWorkData: op || [],
                animationIndex:0,
                type,
                updateNodeOpt,
                ops,
                useAnimation: typeof useAnimation !== 'undefined' ? useAnimation : 
                    typeof updateNodeOpt?.useAnimation !== 'undefined' ? updateNodeOpt?.useAnimation : true,
                oldRect,
                isDiff:false
            } as IServiceWorkItem;
            if (toolsType && opt) {
                workItem = this.setNodeKey(key, workItem, toolsType, opt);
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
            workShape.isDiff = this.hasDiffData(workShape.animationWorkData || [], op, workShape.toolsType);
            workShape.animationWorkData = op;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        if (oldRect) {
            workShape.oldRect = oldRect;
        }
        if (toolsType && opt) {
            if (opt.syncUnitTime) {
                this.syncUnitTime = opt.syncUnitTime;
            }
            if (workShape.toolsType !== toolsType && toolsType && opt) {
                this.setNodeKey(key, workShape, toolsType, opt)
            }
            if(workShape.node){
                workShape.node.setWorkOptions(opt);                
            }
        }
    }
    private hasDiffData(oldOp: number[], newOp:number[], toolsType:EToolsKey) {
        const oldLength = oldOp.length;
        if (newOp.length < oldLength) {
            return true;
        }
        switch (toolsType) {
            case EToolsKey.Pencil: {
                for (let i = 0; i < oldLength; i+=3) {
                    if (newOp[i] !== oldOp[i] || newOp[i+1] !== oldOp[i+1]) {
                        return true;
                    }
                }
                break;
            }   
            case EToolsKey.LaserPen:{
                for (let i = 0; i < oldLength; i+=2) {
                    if (newOp[i] !== oldOp[i] || newOp[i+1] !== oldOp[i+1]) {
                        return true;
                    }
                }
                break;
            }
        }
        return false;
    }
    private async animationDraw() {
        this.animationId = undefined;
        let isNext:boolean = false;
        const _postData:IBatchMainMessage = {
            render:[],
        }
        const cursorPoints: Map<string,{
            op:number[],
            workState:EvevtWorkState
        }>= new Map();

        for (const [key,workShape] of this.workShapes.entries()) {
            switch (workShape.toolsType) {
                case EToolsKey.Image:
                {
                        const oldRect =  workShape.oldRect;
                        if (oldRect) {
                            _postData.render?.push({
                                rect: oldRect,
                                isClear: true,
                                clearCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            })
                            _postData.render?.push({
                                rect: oldRect,
                                drawCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            })
                        }
                        const rect = await (workShape.node as ImageShape)?.consumeServiceAsync({
                            isFullWork:true,
                            scene: (this.fullLayer.parent?.parent) as Scene
                        });
                        this.selectorWorkShapes.forEach((s,selectorId)=>{
                            if (s.selectIds?.includes(key)) {
                                this.willRunEffectSelectorIds.add(selectorId);
                                this.noAnimationRect = computRect(this.noAnimationRect, oldRect);
                                this.noAnimationRect = computRect(this.noAnimationRect, rect);
                                this.runEffect();
                            }
                        })
                        this.workShapes.delete(key);
                        _postData.render?.push({
                            rect,
                            drawCanvas: ECanvasShowType.Bg,
                            viewId: this.viewId
                        })
                    break;
                }
                case EToolsKey.Text: {
                    if (workShape.node) {
                        const oldRect =  workShape.oldRect;
                        if (oldRect) {
                            _postData.render?.push({
                                rect: oldRect,
                                isClear: true,
                                clearCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            })
                            _postData.render?.push({
                                rect: oldRect,
                                drawCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            })
                        }
                        const rect = await (workShape.node as TextShape).consumeServiceAsync({
                            isFullWork:true,
                            replaceId: key
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
                        _postData.render?.push({
                            rect,
                            drawCanvas: ECanvasShowType.Bg,
                            viewId: this.viewId
                        })
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
                        const oldRect =  workShape.oldRect;
                        const tmpRect = (workShape.node as ArrowShape).oldRect;
                        if (oldRect) {
                            _postData.render?.push({
                                rect: oldRect,
                                isClear: true,
                                clearCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            })
                            _postData.render?.push({
                                rect: oldRect,
                                drawCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            })
                        }
                        if (tmpRect) {
                            _postData.render?.push({
                                rect: tmpRect,
                                isClear: true,
                                clearCanvas: ECanvasShowType.ServiceFloat,
                                viewId:this.viewId
                            })
                        }
                        const rect = workShape.node?.consumeService({
                            op: workShape.animationWorkData, 
                            isFullWork
                        });
                        cursorPoints.set(key, {
                            workState: !oldRect? EvevtWorkState.Start : workShape.ops ? EvevtWorkState.Done : EvevtWorkState.Doing,
                            op: workShape.animationWorkData.filter((_v, i) => {
                                if (i % 3 !== 2) {
                                    return true;
                                }
                            }).slice(-2),
                        })
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
                            _postData.render?.push({
                                rect,
                                drawCanvas: ECanvasShowType.Bg,
                                viewId:this.viewId
                            })
                        } else {
                            _postData.render?.push({
                                rect,
                                drawCanvas: ECanvasShowType.ServiceFloat,
                                workerType: isFullWork ? undefined : EDataType.Service,
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
                        _postData.render?.push({
                            isClear: true,
                            rect: computRect(workShape.oldRect, rect),
                            clearCanvas: ECanvasShowType.Bg,
                            viewId:this.viewId
                        });
                        _postData.render?.push({
                            rect: computRect(workShape.oldRect, rect),
                            drawCanvas: ECanvasShowType.Bg,
                            viewId:this.viewId
                        });
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
                        if (workShape.isDel) {
                            workShape.node?.clearTmpPoints();
                            this.workShapes.delete(key);
                            break;
                        }
                        const pointUnit = 3;
                        const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                        const lastPointIndex = !workShape.isDiff ? Math.max(0, (workShape.animationIndex || 0) - pointUnit) : 0;
                        const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                        const workId = workShape.node?.getWorkId()?.toString();
                        if ((workShape.animationIndex || 0) < nextAnimationIndex || workShape.isDiff) {
                            const rect = workShape.node?.consumeService({
                                op: data,
                                isFullWork: false,
                            });
                            _postData.render?.push({
                                rect,
                                drawCanvas: ECanvasShowType.ServiceFloat,
                                viewId: this.viewId
                            });
                            workShape.animationIndex = nextAnimationIndex;
                            if (workShape.isDiff) {
                                workShape.isDiff = false;
                            }
                            if (data.length) {
                                const cursorOp = data.filter((_v, i) => {
                                    if (i % pointUnit !== pointUnit - 1) {
                                        return true;
                                    }
                                }).slice(-2);
                                cursorPoints.set(key, {
                                    workState: lastPointIndex === 0 ? EvevtWorkState.Start : nextAnimationIndex === workShape.animationWorkData?.length ? EvevtWorkState.Done : EvevtWorkState.Doing,
                                    op: cursorOp,
                                });
                            }
                        } else if (workShape.ops) {
                            const rect = workShape.node?.consumeService({
                                op: workShape.animationWorkData || [],
                                isFullWork: true,
                                replaceId: workId
                            });
                            workShape.isDel = true;
                            _postData.render?.push({
                                isClear: true,
                                rect,
                                clearCanvas: ECanvasShowType.ServiceFloat,
                                viewId:this.viewId
                            },{
                                rect,
                                drawCanvas: ECanvasShowType.ServiceFloat,
                                viewId:this.viewId
                            },{
                                isClear: true,
                                rect,
                                clearCanvas:ECanvasShowType.Bg,
                                viewId:this.viewId
                            },{
                                rect,
                                drawCanvas:ECanvasShowType.Bg,
                                viewId:this.viewId
                            });
                            cursorPoints.set(key, {
                                workState: EvevtWorkState.Done,
                                op: data.filter((_v, i) => {
                                    if (i % pointUnit !== pointUnit - 1) {
                                        return true;
                                    }
                                }).slice(-2),
                            })
                        }
                        isNext = true;
                        break;
                    }
                    break;
                }
                default:
                    break;
            }
        }
        if (isNext) {
            this.runAnimation();
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
            await this.post(_postData);
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
    }
    private computNextAnimationIndex(workShape:IServiceWorkItem, pointUnit:number){
        const step = Math.floor((workShape.animationWorkData || []).slice(workShape.animationIndex).length * 32 / pointUnit / this.syncUnitTime) * pointUnit;
        return Math.min((workShape.animationIndex || 0) + (step || pointUnit), (workShape.animationWorkData||[]).length);
    }
    private runEffect(){
        if (!this.runEffectId) {
            this.runEffectId = setTimeout(this.effectRunSelector.bind(this),0) as unknown as number;
        }
    }
    private async effectRunSelector() {
        this.runEffectId = undefined;
        let rect: IRectType | undefined = this.noAnimationRect;
        this.willRunEffectSelectorIds.forEach(id => {
            const workShape = this.selectorWorkShapes.get(id);
            const r = workShape && workShape.selectIds && ( workShape.node as SelectorShape)?.selectServiceNode(id, workShape,true);
            rect = computRect(rect, r);
            if (!workShape?.selectIds?.length) {
                this.selectorWorkShapes.delete(id);
            }
        })
        if (rect) {
            await this.post({render: [
                {
                    rect: getSafetyRect(rect),
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    viewId:this.viewId
                },
                {
                    rect: getSafetyRect(rect),
                    drawCanvas: ECanvasShowType.Bg,
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
                workItem = this.setNodeKey(key, workItem, toolsType, opt);
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

