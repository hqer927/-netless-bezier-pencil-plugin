import { Group } from "spritejs";
import { BaseShapeOptions, getShapeInstance } from "../tools";
import { ISubWorkerInitOption } from "./base";
import { VNodeManager } from "../vNodeManager";
import { Storage_Splitter } from "../../collector/const";
import { computRect } from "../utils";
import { transformToNormalData } from "../../collector/utils";
import { IActiveToolsDataType, IBatchMainMessage, ILocalWorkItem, IMainMessage, IMainMessageRenderData, IServiceWorkItem, IWorkerMessage } from "../types";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { WorkThreadEngineForSubWorker } from "./workerManager";
import { DefaultAppliancePluginOptions } from "../../plugin/const";

export interface TopLayerWork{
    readonly viewId: string;
    readonly vNodes:VNodeManager;
    readonly topLayer: Group;
    readonly post: (msg: IBatchMainMessage) => Promise<void>;
    consumeDraw(data: IWorkerMessage):void;
    consumeDrawAll(data: IWorkerMessage):void;
    destroy():void;
}

export class TopLayerWorkForSubWorker implements TopLayerWork {
    viewId: string;
    vNodes: VNodeManager;
    topLayer: Group;
    readonly thread: WorkThreadEngineForSubWorker;
    post: (msg: IBatchMainMessage) => Promise<void>;
    serviceWorkShapes: Map<string, IServiceWorkItem> = new Map();
    localWorkShapes: Map<string, ILocalWorkItem> = new Map();
    protected tmpOpt?: IActiveToolsDataType;
    private syncUnitTime:number = DefaultAppliancePluginOptions.syncOpt.interval;
    protected animationId?: number | undefined;
    constructor(opt:ISubWorkerInitOption){
        this.viewId = opt.viewId;
        this.vNodes = opt.vNodes;
        this.topLayer = opt.topLayer as Group;
        this.thread = opt.thread as WorkThreadEngineForSubWorker;
        this.post = opt.thread.post.bind(opt.thread);
    }
    canUseTopLayer(toolsType:EToolsKey){
        return toolsType === EToolsKey.LaserPen;
    }
    getWorkShape(workId:string){
        return this.localWorkShapes.get(workId);
    }
    createWorkShape(workId: string, opt?: BaseShapeOptions){
        if (workId && this.tmpOpt) {
            const _opt = {
                toolsType: this.tmpOpt.toolsType,
                toolsOpt: opt || this.tmpOpt.toolsOpt
            }; 
            const workShapeNode = this.createWorkShapeNode({..._opt, workId});
            if (workShapeNode) {
                this.localWorkShapes.set(workId, {
                    node: workShapeNode,
                    toolsType: workShapeNode.toolsType,
                    workState: EvevtWorkState.Start
                });
            }
            return workShapeNode;
        }
    }
    setWorkOptions(workId:string, opt:BaseShapeOptions){
        const node = this.localWorkShapes.get(workId)?.node;
        if (!node) {
            this.createWorkShape(workId, opt)
        }
        node?.setWorkOptions(opt);
    }
    createWorkShapeNode(opt: IActiveToolsDataType & {workId:string}) {
        const {toolsType} = opt;
        if (toolsType === EToolsKey.LaserPen) {
            return getShapeInstance({...opt, vNodes:this.vNodes, fullLayer:this.topLayer, drawLayer:this.topLayer});
        }
    }
    clearAllWorkShapesCache(){
        this.localWorkShapes.forEach(w=>w.node?.clearTmpPoints());
        this.localWorkShapes.clear();
    }
    setToolsOpt(opt: IActiveToolsDataType) {
        this.tmpOpt = opt;
        if (opt.toolsOpt?.syncUnitTime) {
            this.syncUnitTime = opt.toolsOpt.syncUnitTime;
        }
    }
    getToolsOpt(){
        return this.tmpOpt;
    }
    consumeDraw(data: IWorkerMessage): void {
        const {workId, dataType} = data;
        if (dataType === EDataType.Service) {
            this.activeServiceWorkShape(data);
        } else {
            const workIdStr = workId?.toString();
            const localWorkShapeNode = workIdStr && this.localWorkShapes.get(workIdStr);
            if (!localWorkShapeNode) {
                return;
            }
            const result = localWorkShapeNode.node.consume({data, isFullWork: false, isSubWorker:true});
            if (result.rect) {
                localWorkShapeNode.totalRect = computRect(result.rect, localWorkShapeNode.totalRect);
                localWorkShapeNode.result = result;
                localWorkShapeNode.workState = EvevtWorkState.Doing;
                workIdStr && this.localWorkShapes.set(workIdStr, localWorkShapeNode);
            }
        }
        this.runAnimation();        
    }
    consumeDrawAll(data: IWorkerMessage): void {
        const {workId, dataType} = data;
        if (dataType === EDataType.Service) {
            this.activeServiceWorkShape(data);
        } else {
            const workIdStr = workId?.toString();
            const localWorkShapeNode = workIdStr && this.localWorkShapes.get(workIdStr);
            if (!localWorkShapeNode) {
                return;
            }
            const result = localWorkShapeNode.node.consumeAll({ data });
            localWorkShapeNode.totalRect = computRect(result.rect, localWorkShapeNode.totalRect);
            localWorkShapeNode.result = result;
            localWorkShapeNode.workState = EvevtWorkState.Done;
            workIdStr && this.localWorkShapes.set(workIdStr, localWorkShapeNode);
        }
        this.runAnimation();
    }
    destroy(): void {
        this.serviceWorkShapes.clear();
        this.localWorkShapes.clear();
    }
    private setNodeKey(workId:string, workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions) { 
        workShape.toolsType = tools;
        workShape.node = this.createWorkShapeNode({workId, toolsType: tools, toolsOpt: opt});
        return workShape;
    }
    private activeServiceWorkShape(data: IWorkerMessage){
        const {workId, opt, toolsType, type, updateNodeOpt, ops, op } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        const oldRect = this.vNodes.get(key)?.rect;
        if (!this.serviceWorkShapes?.has(key)) {
            let workItem = {
                toolsType,
                animationWorkData: op || [],
                animationIndex:0,
                type,
                updateNodeOpt,
                ops,
                oldRect
            } as IServiceWorkItem;
            if (toolsType && opt) {
                workItem = this.setNodeKey(key, workItem, toolsType, opt);
            }
            this.serviceWorkShapes.set(key, workItem);
        }
        const workShape = this.serviceWorkShapes.get(key) as IServiceWorkItem;
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
        if (oldRect) {
            workShape.oldRect = oldRect;
        }
        if (toolsType && opt) {
            if (workShape.toolsType !== toolsType && toolsType && opt) {
                this.setNodeKey(key, workShape, toolsType, opt)
            }
            if(workShape.node){
                workShape.node.setWorkOptions(opt);                
            }
        }
    }
    private computNextAnimationIndex(workShape:IServiceWorkItem, pointUnit:number){
        const step = Math.floor((workShape.animationWorkData || []).slice(workShape.animationIndex).length * 32 / pointUnit / this.syncUnitTime) * pointUnit;
        return Math.min((workShape.animationIndex || 0) + (step || pointUnit), (workShape.animationWorkData||[]).length);
    }
    private async animationDraw() {
        this.animationId = undefined;
        let isNext:boolean = false;
        const cursorPoints: Map<string,{
            op:number[],
            workState:EvevtWorkState
        }>= new Map();

        const topLayerRenders: IMainMessageRenderData[] = [];
        const topLayerClearRenders: IMainMessageRenderData[] = [];
        const sp: IMainMessage[] = [];
        for (const [key,workShape] of this.serviceWorkShapes.entries()) {
            switch (workShape.toolsType) {
                case EToolsKey.LaserPen: {
                    const pointUnit = 8;
                    const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                    const lastPointIndex = Math.max(0, (workShape.animationIndex || 0));
                    const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                    if ((workShape.animationIndex || 0) < nextAnimationIndex) {
                        const rect = workShape.node?.consumeService({
                            op: data,
                            isFullWork: false
                        });
                        workShape.totalRect = computRect(workShape.totalRect, rect);
                        workShape.animationIndex = nextAnimationIndex;
                        if (data.length) {
                            cursorPoints.set(key, {
                                workState: lastPointIndex === 0 ? EvevtWorkState.Start : nextAnimationIndex === workShape.animationWorkData?.length ? EvevtWorkState.Done : EvevtWorkState.Doing,
                                op: data.slice(-2),
                            })
                        }
                    }
                    topLayerClearRenders.push({
                        isClear: true,
                        rect: workShape.totalRect,
                        clearCanvas: ECanvasShowType.TopFloat,
                        viewId: this.viewId
                    });
                    topLayerRenders.push({
                        rect: workShape.totalRect,
                        drawCanvas: ECanvasShowType.TopFloat,
                        viewId: this.viewId
                    });
                    if (workShape.isDel) {
                        workShape.node?.clearTmpPoints();
                        this.serviceWorkShapes.delete(key);
                        break;
                    }
                    if (workShape.ops && workShape.animationIndex === workShape.animationWorkData?.length && !workShape.isDel) {
                        const hasNode = this.topLayer.getElementsByName(key.toString())[0];
                        if (!hasNode) {
                            workShape.isDel = true;
                            this.serviceWorkShapes.set(key,workShape);
                        }
                    }
                    isNext = true;
                    break;
                }
                default:
                    break;
            }
        }
        for (const [key,workShape] of this.localWorkShapes.entries()) {
            const {result, toolsType, totalRect, isDel, workState } = workShape;
            switch (toolsType) {
                case EToolsKey.LaserPen: {
                    if (totalRect) {
                        topLayerClearRenders.push({
                            isClear:true,
                            rect: totalRect,
                            clearCanvas: ECanvasShowType.TopFloat,
                            viewId:this.viewId
                        });
                        topLayerRenders.push({
                            rect: totalRect,
                            drawCanvas: ECanvasShowType.TopFloat,
                            viewId:this.viewId
                        });
                    }
                    if (isDel) {
                        workShape.node.clearTmpPoints();
                        this.localWorkShapes.delete(key);
                        sp.push({
                            removeIds: [key.toString()],
                            viewId: this.viewId,
                            type: EPostMessageType.RemoveNode
                        })
                        break;
                    }
                    if (result) {
                        (result.op || result.ops) && sp.push(result);
                        workShape.result = undefined;
                    }
                    const hasNode = this.topLayer.getElementsByName(key.toString())[0];
                    if (!hasNode && workState === EvevtWorkState.Done) {
                        workShape.isDel = true;
                        this.localWorkShapes.set(key,workShape);
                    }
                    isNext = true;
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
            cursorPoints.forEach((v,k)=>{
                sp.push({
                    type: EPostMessageType.Cursor,
                    uid: k.split(Storage_Splitter)[0],
                    op: v.op,
                    workState: v.workState,
                    viewId: this.viewId
                })
            })
        }
        if (topLayerRenders.length || topLayerClearRenders.length || sp.length) {
            this.post({
                render:[
                    ...topLayerClearRenders,
                    ...topLayerRenders
                ],
                sp
            });
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
    }
}