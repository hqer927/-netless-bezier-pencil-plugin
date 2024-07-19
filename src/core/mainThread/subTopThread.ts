import { IServiceWorkItem, ILocalWorkItem, IActiveToolsDataType, IWorkerMessage, IMainMessage } from "../types"
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { BaseShapeTool, BaseShapeOptions, getShapeInstance } from "../tools";
import { MainThreadEngineImpl, ISubThreadInitOption } from "./base";
import { VNodeManager } from "../vNodeManager";
import { transformToNormalData } from "../../collector/utils";
import { Storage_Splitter } from "../../collector/const";
import { Layer } from "spritejs";
import { DefaultAppliancePluginOptions } from "../../plugin/const";

export interface SubTopThread {
    readonly vNodes:VNodeManager;
    readonly thread: MainThreadEngineImpl;
    serviceWorkShapes: Map<string, IServiceWorkItem>;
    localWorkShapes: Map<string, ILocalWorkItem>;
    canUseTopLayer(toolsType:EToolsKey):boolean;
    destroy():void;
    clearAll():void;
    setToolsOpt(opt: IActiveToolsDataType):void;
    getToolsOpt():IActiveToolsDataType|undefined;
    createWorkShapeNode(opt: IActiveToolsDataType & {workId:string}):BaseShapeTool|undefined;
    setWorkOptions(workId:string, opt:BaseShapeOptions):void;
    consumeDrawAll(data:IWorkerMessage):void;
    consumeDraw(data: IWorkerMessage): void;
    getLocalWorkShape(workId:string): ILocalWorkItem|undefined;
    createLocalWork(data:IWorkerMessage):void;
}
export class SubTopThreadImpl implements SubTopThread {
    readonly vNodes:VNodeManager;
    readonly thread: MainThreadEngineImpl;
    serviceWorkShapes: Map<string, IServiceWorkItem> = new Map();
    localWorkShapes: Map<string, ILocalWorkItem> = new Map();
    private tmpOpt?: IActiveToolsDataType;
    private animationId?: number | undefined;
    private syncUnitTime:number = DefaultAppliancePluginOptions.syncOpt.interval;
    constructor(opt:ISubThreadInitOption){
        this.vNodes = opt.vNodes;
        this.thread = opt.thread;
    }
    createLocalWork(data:IWorkerMessage){
        const {workId, opt, toolsType} = data;
        if (workId && opt) {
            const workeStr = workId.toString();
            if (!this.getToolsOpt() && toolsType) {
                this.setToolsOpt({
                    toolsType,
                    toolsOpt: opt,
                })
            }
            this.setWorkOptions(workeStr, opt)
        }
    }
    getLocalWorkShape(workId:string){
        return this.localWorkShapes.get(workId);
    }
    createLocalWorkShape(workId: string, opt?: BaseShapeOptions){
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
    canUseTopLayer(toolsType:EToolsKey){
        return toolsType === EToolsKey.LaserPen;
    }
    destroy(){
        this.clearAll();
    }
    clearAll(): void {
        if (this.thread.topLayer.children.length) {
            (this.thread.topLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.thread.serviceLayer.removeAllChildren();
        }
        this.serviceWorkShapes.clear();
        this.localWorkShapes.clear();
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
                localWorkShapeNode.result = result;
                localWorkShapeNode.workState = EvevtWorkState.Doing;
                workIdStr && this.localWorkShapes.set(workIdStr, localWorkShapeNode);
            }
        }
        this.runAnimation();   
    }
    setToolsOpt(opt: IActiveToolsDataType) {
        this.tmpOpt = opt;
        if (opt.toolsOpt?.syncUnitTime) {
            this.syncUnitTime = opt.toolsOpt.syncUnitTime;
        }
    }
    getToolsOpt() {
        return this.tmpOpt;
    }
    createWorkShapeNode(opt: IActiveToolsDataType & { workId: string }) {
        const {toolsType} = opt;
        if (toolsType === EToolsKey.LaserPen) {
            return getShapeInstance({...opt, vNodes:this.vNodes, fullLayer:this.thread.topLayer, drawLayer:this.thread.topLayer});
        }
    }
    private setNodeKey(workId:string, workShape: IServiceWorkItem , tools:EToolsKey, opt: BaseShapeOptions) { 
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
                workItem = this.setNodeKey( key, workItem, toolsType, opt);
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
        const syncUnitTime =  workShape.node?.syncUnitTime || this.syncUnitTime;
        const step = Math.floor((workShape.animationWorkData || []).slice(workShape.animationIndex).length * 32 / pointUnit / syncUnitTime) * pointUnit;
        return Math.min((workShape.animationIndex || 0) + (step || pointUnit), (workShape.animationWorkData||[]).length);
    }
    private animationDraw() {
        this.animationId = undefined;
        let isNext:boolean = false;
        const cursorPoints: Map<string,{
            op:number[],
            workState:EvevtWorkState
        }>= new Map();
        const sp: IMainMessage[] = [];
        for (const [key,workShape] of this.serviceWorkShapes.entries()) {
            switch (workShape.toolsType) {
                case EToolsKey.LaserPen: {
                    const pointUnit = 2 * 4;
                    const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                    const lastPointIndex = Math.max(0, (workShape.animationIndex || 0));
                    const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                    if ((workShape.animationIndex || 0) < nextAnimationIndex) {
                        workShape.node?.consumeService({
                            op: data,
                            isFullWork: false
                        });
                        workShape.animationIndex = nextAnimationIndex;
                        if (data.length) {
                            cursorPoints.set(key, {
                                workState: lastPointIndex === 0 ? EvevtWorkState.Start : nextAnimationIndex === workShape.animationWorkData?.length ? EvevtWorkState.Done : EvevtWorkState.Doing,
                                op: data.slice(-2),
                            })
                        }
                    }
                    if (workShape.isDel) {
                        workShape.node?.clearTmpPoints();
                        this.serviceWorkShapes.delete(key);
                        break;
                    }
                    if (workShape.ops && workShape.animationIndex === workShape.animationWorkData?.length && !workShape.isDel) {
                        const hasNode = this.thread.topLayer.getElementsByName(key.toString())[0];
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
            const {result, toolsType, isDel, workState } = workShape;
            switch (toolsType) {
                case EToolsKey.LaserPen: {
                    if (isDel) {
                        workShape.node.clearTmpPoints();
                        this.localWorkShapes.delete(key);
                        sp.push({
                            removeIds: [key.toString()],
                            type: EPostMessageType.RemoveNode
                        })
                        break;
                    }
                    if (result) {
                        (result.op || result.ops) && sp.push(result);
                        workShape.result = undefined;
                    }
                    const hasNode = this.thread.topLayer.getElementsByName(key.toString())[0];
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
                    viewId: this.thread.viewId
                })
            })
        }
        if (sp.length) {
            this.thread.post({ sp });
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
    }
    setWorkOptions(workId:string, opt:BaseShapeOptions){
        let node = this.localWorkShapes.get(workId)?.node;
        if (!node && this.tmpOpt) {
            const {toolsType} = this.tmpOpt;
            this.tmpOpt.toolsOpt = opt;
            node = this.createWorkShapeNode({workId, toolsType, toolsOpt: opt});
            if (node) {
                this.localWorkShapes.set(workId, {
                    node,
                    toolsType,
                    workState: EvevtWorkState.Start
                });
            }
            this.setToolsOpt(this.tmpOpt);
        }
        if (!opt?.syncUnitTime) {
            opt.syncUnitTime = this.syncUnitTime;
        }
        node && node.setWorkOptions(opt);
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
            localWorkShapeNode.result = result;
            localWorkShapeNode.workState = EvevtWorkState.Done;
            workIdStr && this.localWorkShapes.set(workIdStr, localWorkShapeNode);
        }
        this.runAnimation();
    }
}