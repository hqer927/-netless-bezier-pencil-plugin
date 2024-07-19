import { IActiveToolsDataType, IWorkerMessage, IMainMessage, IUpdateSelectorPropsType, IBatchMainMessage } from "../types";
import type { BaseShapeTool, BaseShapeOptions, SelectorShape, ImageShape, ShapeToolsClass, PencilShape } from "../tools";
import { getShapeInstance } from "../tools";
import { MainThreadEngineImpl, ISubThreadInitOption } from "./base";
import { VNodeManager } from "../vNodeManager";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { Layer, Scene } from "spritejs";
import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { SubServiceThread } from "./subServiceThread";
import { Cursor_Hover_Id } from "../const";
import { Storage_Selector_key } from "../../collector/const";
import { TextOptions } from "../../component/textEditor/types";
import { isIntersectForPoint } from "../utils";
import throttle from "lodash/throttle";
import { TextShape } from "../tools/text";
import { DefaultAppliancePluginOptions } from "../../plugin/const";
import { cloneDeep, xor } from "lodash";

export interface SubLocalThread {
    readonly vNodes:VNodeManager;
    readonly thread: MainThreadEngineImpl;
    workShapes: Map<string, BaseShapeTool>;
    effectSelectNodeData: Set<IWorkerMessage>;
    destroy():void;
    clearAll():void;
    clearWorkShapeNodeCache(workId:string):void;
    setToolsOpt(opt: IActiveToolsDataType):void;
    getToolsOpt():IActiveToolsDataType|undefined;
    createWorkShapeNode(opt: IActiveToolsDataType & {workId:string}):void;
    setWorkOptions(workId:string, opt:BaseShapeOptions):void;
    consumeDrawAll(data: IWorkerMessage, serviceWork:SubServiceThread):void
    consumeDraw(data: IWorkerMessage, serviceWork:SubServiceThread): void;
    colloctEffectSelectWork(data:IWorkerMessage):Promise<IWorkerMessage | undefined>;
    hasSelector():boolean;
    getSelector():SelectorShape | undefined;
    reRenderSelector(willSyncService?:boolean):void;
    blurSelector(data?:IWorkerMessage): Promise<void>;
    getWorkShape(workId:string): BaseShapeTool | undefined;
    getWorkShapes():Map<string, BaseShapeTool>;
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>):ShapeToolsClass | undefined;
    consumeFull(data: IWorkerMessage, scene?: Scene): Promise<void>;
    removeWork(data:IWorkerMessage):void;
    removeSelector(data:IWorkerMessage):Promise<void>;
    updateFullSelectWork(data:IWorkerMessage):void;
    cursorHover(msg:IWorkerMessage):void;
    checkTextActive(data:IWorkerMessage):Promise<void>;
    removeNode(key:string):void;
    updateSelector(params: IUpdateSelectorPropsType & {
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
    }): Promise<IMainMessage | undefined>
    workShapesDone(scenePath:string, serviceWork:SubServiceThread):void;
    createLocalWork(data:IWorkerMessage):void;
}
export class SubLocalThreadImpl implements SubLocalThread {
    readonly vNodes:VNodeManager;
    readonly thread: MainThreadEngineImpl;
    workShapes: Map<string, BaseShapeTool> = new Map();
    effectSelectNodeData: Set<IWorkerMessage> = new Set();
    private batchEraserRemoveNodes: Set<string> = new Set();
    private batchEraserWorks: Set<string> = new Set();
    private tmpOpt?: IActiveToolsDataType;
    private syncUnitTime:number = DefaultAppliancePluginOptions.syncOpt.interval;
    private drawCount:number = 0;
    private drawWorkActiveId?: string;
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
    workShapesDone(scenePath: string, serviceWork: SubServiceThread): void {
        for (const key of this.workShapes.keys()) {
            this.consumeDrawAll({
                workId: key,
                scenePath,
                viewId: this.thread.viewId,
                msgType: EPostMessageType.DrawWork,
                dataType: EDataType.Local
            }, serviceWork)
        }
    }
    async updateSelector(params: IUpdateSelectorPropsType & { 
            callback?: ((props: { 
                res?: IMainMessage | undefined; 
                param: IUpdateSelectorPropsType; 
                postData: Pick<IBatchMainMessage, "sp">; 
                workShapeNode: SelectorShape; 
                newServiceStore: Map<string, { opt: BaseShapeOptions; toolsType: EToolsKey; ops?: string | undefined; }>; 
            }) => void) | undefined; 
        }): Promise<IMainMessage | undefined> {
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
        if (!workShapeNode?.selectIds?.length) return;
        const {callback, ...param} = params;
        const {updateSelectorOpt, willSerializeData, scene} = param;
        const res = await workShapeNode?.updateSelector({
            updateSelectorOpt, 
            selectIds: cloneDeep(workShapeNode.selectIds),
            vNodes: this.vNodes,
            willSerializeData,
            worker: this,
            scene,
            isMainThread:true
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
            console.log('removeIds', removeIds)
        }
        const sp:IMainMessage[] = [];
        const _postData = callback && callback({
            res,
            workShapeNode,
            param,
            postData:{ sp },
            newServiceStore
        }) || { sp };
        if (removeIds) {
            _postData.sp.push({
                type: EPostMessageType.RemoveNode,
                removeIds,
                viewId: this.thread.viewId
            })
        }
        if (_postData.sp.length) {
            this.thread.post(_postData);
        }
    }
    destroy(){
        this.clearAll();
    }
    clearAll(): void {
        if (this.thread.localLayer.children.length) {
            (this.thread.topLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.thread.localLayer.removeAllChildren();
        }
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
        if (workShapeNode) {
            const sp:IMainMessage[] = [];
            sp.push({
                type: EPostMessageType.Select,
                dataType: EDataType.Local,
                selectIds: [],
                willSyncService: false,
            });
            this.thread.post({ sp });
        }
        this.workShapes.clear();
        this.effectSelectNodeData.clear();
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
    }
    async checkTextActive(data: IWorkerMessage): Promise<void> {
        const {op, viewId, dataType}= data;
        if (op?.length) {
            let activeId:string|undefined;
            for (const value of this.vNodes.curNodeMap.values()) {
                const {rect, name, toolsType, opt} =value;
                const x = op[0] * this.thread.fullLayer.worldScaling[0] + this.thread.fullLayer.worldPosition[0];
                const y = op[1] * this.thread.fullLayer.worldScaling[1] + this.thread.fullLayer.worldPosition[1];
                if(toolsType === EToolsKey.Text && isIntersectForPoint([x,y],rect) && (opt as TextOptions).workState === EvevtWorkState.Done) {
                    activeId = name;
                    break;
                }
            }
            if (activeId) {
                await this.blurSelector({    
                    viewId,
                    msgType: EPostMessageType.Select,
                    dataType,
                    isSync: true
                });
                this.thread.post({
                    sp:[{
                        type:EPostMessageType.GetTextActive,
                        toolsType: EToolsKey.Text,
                        workId: activeId
                    }]
                })
            }
        }
    }
    cursorHover(msg: IWorkerMessage): void {
        const {opt,toolsType, point} = msg;
        const workShape = this.setFullWork({
            workId: Cursor_Hover_Id,
            toolsType,
            opt
        });
        if (workShape && point) {
            (workShape as SelectorShape).cursorHover(point);
        }
    }
    updateFullSelectWork(data: IWorkerMessage): void {
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
        const {selectIds} = data;
        if (!selectIds?.length) {
            this.blurSelector(data);
            return;
        }
        if (!workShapeNode) {
            const curWorkShapes = this.setFullWork(data);
            if (!curWorkShapes && data.workId && this.tmpOpt && this.tmpOpt?.toolsType === EToolsKey.Selector) {
                this.setWorkOptions(data.workId.toString(), data.opt || this.tmpOpt.toolsOpt)
            }
            if (curWorkShapes) {
                this.updateFullSelectWork(data);
            }
            return;
        }
        if (workShapeNode && selectIds?.length) {
            const {selectRect} = workShapeNode.updateSelectIds(selectIds);
            const sp = [{
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
            }];
            this.thread.post({sp})
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
    async removeSelector(data: IWorkerMessage): Promise<void> {
        const {willSyncService} = data;
        const sp:IMainMessage[] = [];
        const removeIds:string[] = [];
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
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
            this.removeNode(key);
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
        if (sp.length) {
            this.thread.post({ sp });
        }
    }
    removeWork(data: IWorkerMessage): void {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            this.removeNode(key);
        }
    }
    removeNode(key:string){
        const nodeMapItem = this.vNodes.get(key);
        if (nodeMapItem) {
            this.thread.fullLayer?.getElementsByName(key).forEach(node=>{
                node.remove();
            });
            this.vNodes.delete(key);
        }
        const hasWorkShape = this.workShapes.has(key);
        if (hasWorkShape) {
            this.thread.localLayer.getElementsByName(key).forEach(node=>{
                node.remove();
            });
            this.clearWorkShapeNodeCache(key);
        }
    }
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>){
        const {workId, opt, toolsType} = data;
        if (workId && opt && toolsType) {
            const workIdStr = workId.toString();
            let curWorkShapes: BaseShapeTool | undefined;
            if (workId && this.workShapes.has(workIdStr)) {
                curWorkShapes = this.workShapes.get(workIdStr);
                curWorkShapes?.setWorkOptions(opt);
            } else {
                curWorkShapes = this.createWorkShapeNode({
                    toolsOpt: opt,
                    toolsType,
                    workId: workIdStr
                })
            }
            if (!curWorkShapes) {
                return;
            }
            this.workShapes.set(workIdStr, curWorkShapes);
            return curWorkShapes
        }
    }
    async consumeFull(data: IWorkerMessage, scene?:Scene){
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            const replaceId = data.workId?.toString();
            if (workShape.toolsType === EToolsKey.Image && scene) {
                await (workShape as ImageShape).consumeServiceAsync({
                    scene,
                    isFullWork: true,
                    replaceId,
                    isMainThread: true
                });
            } else if (workShape.toolsType === EToolsKey.Text) {
                await (workShape as TextShape).consumeServiceAsync({
                    isFullWork: true,
                    replaceId
                });
            } else {
                workShape.consumeService({
                    op, 
                    isFullWork: true,
                    replaceId,
                });
            }
            data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            const sp:IMainMessage[] = [];
            data.workId && this.workShapes.delete(data.workId.toString())
            if (data.willSyncService) {
                sp.push({
                    opt: data.opt,
                    toolsType: data.toolsType,
                    type: EPostMessageType.FullWork,
                    workId: data.workId,
                    ops: data.ops,
                    updateNodeOpt: data.updateNodeOpt,
                    viewId:this.thread.viewId
                })
            }
            if(sp.length){
                this.thread.post({sp})
            }
        }
    }
    async colloctEffectSelectWork(data:IWorkerMessage):Promise<IWorkerMessage | undefined>{
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
        const {workId, msgType} = data;
        if (workShapeNode && workId && workShapeNode.selectIds && workShapeNode.selectIds.includes(workId.toString())) {
            if (msgType === EPostMessageType.RemoveNode) {
                workShapeNode.selectIds = workShapeNode.selectIds.filter(id => id !== workId.toString());
            } else {
                this.effectSelectNodeData.add(data)
            }
            await new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(true);
                },0)
            })
            await this.runEffectSelectWork(true).then(()=>{
                this.effectSelectNodeData?.clear();
            }); 
            return undefined;
        }
        return data;
    }
    private async runEffectSelectWork(willSyncService?:boolean){
        for (const data of this.effectSelectNodeData.values()) {
            const workShape = this.setFullWork(data);
            if (workShape) {
                const replaceId = data.workId?.toString();
                if (workShape.toolsType === EToolsKey.Image) {
                    await (workShape as ImageShape).consumeServiceAsync({
                        scene: this.thread.localLayer?.parent?.parent as Scene,
                        isFullWork: true,
                        replaceId,
                        isMainThread: true,
                    });
                } else if (workShape.toolsType === EToolsKey.Text) {
                    await (workShape as TextShape).consumeServiceAsync({
                        isFullWork: true,
                        replaceId
                    });
                } else {
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
        this.reRenderSelector(willSyncService);
    }
    hasSelector(){
        return this.workShapes.has(Storage_Selector_key);
    }
    getSelector(){
        return this.workShapes.get(Storage_Selector_key) as SelectorShape;
    }
    reRenderSelector(willSyncService:boolean = false){
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
        if (!workShapeNode) return ;
        if (workShapeNode && !workShapeNode.selectIds?.length) {
            return this.blurSelector();
        }
        const newRect = workShapeNode.reRenderSelector();
        if (newRect) {
            this.thread.post({
                sp:[{
                    type: EPostMessageType.Select,
                    selectIds: workShapeNode.selectIds,
                    selectRect: newRect,
                    willSyncService,
                    viewId: this.thread.viewId,
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
    async blurSelector(data?:IWorkerMessage): Promise<void> {
        const workShapeNode = this.workShapes.get(Storage_Selector_key) as SelectorShape;
        const res = workShapeNode?.blurSelector();
        this.clearWorkShapeNodeCache(Storage_Selector_key);
        (this.thread.fullLayer?.parent as Layer).children.forEach(c=>{
            if (c.name === Storage_Selector_key) {
                c.remove();
            }
        });
        if (res) {
            const sp:IMainMessage[] = [];
            sp.push({
                ...res,
                isSync: data?.isSync
            });
            this.thread.post({ sp });
        }
    }
    clearWorkShapeNodeCache(workId:string) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
    }
    private drawEraser(result:IMainMessage) {
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
        this.thread.post({ sp });
        this.batchEraserCombine();
    }
    private updateBatchEraserCombineNode(inFullLayerIds:Set<string>,removeIds:Set<string>) {
        for (const key of removeIds.keys()) {
            this.thread.fullLayer.getElementsByName(key).forEach(node => {
                node.remove();
            });
        }
        inFullLayerIds.forEach(key=>{
            const info = this.vNodes.get(key);
            if (info && info.toolsType === EToolsKey.Pencil) {
                const node = this.thread.fullLayer.getElementsByName(key)[0];
                if (!node) {
                    const workShape = this.setFullWork({...info, workId: key}) as PencilShape;
                    workShape && workShape.consumeService({
                        op: info.op, 
                        isFullWork: true
                    });
                }
            }
        })
    }
    private batchEraserCombine = throttle(() => {
        this.updateBatchEraserCombineNode(this.batchEraserWorks, this.batchEraserRemoveNodes);
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
    }, 100, {'leading':false})
    getWorkShape(workId:string){
        return this.workShapes.get(workId);
    }
    getWorkShapes(){
        return this.workShapes;
    }
    consumeDraw(data: IWorkerMessage, serviceWork:SubServiceThread): void {
        const {op, workId, scenePath} = data;
        if (op?.length && workId) {
            const workStr = workId.toString();
            const workShapeNode = this.workShapes.get(workStr);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            // 如果将要绘制的工具已经不是当前工具，先完结当前工具的绘制
            if (this.drawWorkActiveId && this.drawWorkActiveId !== workStr) {
                this.consumeDrawAll({
                    workId: this.drawWorkActiveId,
                    scenePath,
                    viewId: this.thread.viewId,
                    msgType: EPostMessageType.DrawWork,
                    dataType: EDataType.Local
                }, serviceWork)
                this.drawWorkActiveId = undefined;
            }
            if (!this.drawWorkActiveId && workStr !== Storage_Selector_key) {
                this.drawWorkActiveId = workStr;
            }
            switch (toolsType) {
                case EToolsKey.Selector:{
                        const result = workShapeNode.consume({
                            data, 
                            isFullWork: true
                        });
                        if (result.type === EPostMessageType.Select) {
                            result.selectIds && serviceWork.runReverseSelectWork(result.selectIds)
                            this.thread.post({sp:[result]});
                        }
                    }
                    break;
                case EToolsKey.Eraser: {
                        const result = workShapeNode.consume({
                            data, 
                            isFullWork: true
                        });
                        if (result?.rect) {
                            this.drawEraser(result);
                        }
                    }
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                case EToolsKey.Pencil: {
                        const result = workShapeNode.consume({
                            data, 
                            isFullWork: false,
                            isMainThread: true,
                        });
                        if (result) {
                            this.drawCount++;
                            this.thread.post({
                                drawCount: this.drawCount,
                                sp: result.op && [{...result, scenePath}] || undefined
                            });
                        }
                    }           
                    break;
                default:
                    break;
            }
        }
    }
    consumeDrawAll(data: IWorkerMessage, serviceWork:SubServiceThread):void {
        const {workId, scenePath} = data;
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
                    if (r.type === EPostMessageType.Select) {
                        r.selectIds && serviceWork.runReverseSelectWork(r.selectIds)
                        this.thread.post({sp:[{...r, scenePath}]});
                    }
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
                case EToolsKey.Pencil:
                    if (r) {
                        this.drawCount = 0;
                        this.thread.post({
                            drawCount: this.drawCount,
                            sp: [r]
                        });
                    }
                    this.clearWorkShapeNodeCache(workIdStr);
                    break;
                default:
                    break;
            }
        }  
    }
    getToolsOpt() {
        return this.tmpOpt;
    }
    setToolsOpt(opt: IActiveToolsDataType){
        this.tmpOpt = opt;
        if (opt.toolsOpt?.syncUnitTime) {
            this.syncUnitTime = opt.toolsOpt.syncUnitTime;
        }
    }
    setWorkOptions(workId:string, opt:BaseShapeOptions){
        let node = this.workShapes.get(workId);
        if (!node && this.tmpOpt) {
            const {toolsType} = this.tmpOpt;
            this.tmpOpt.toolsOpt = opt;
            node = this.createWorkShapeNode({workId, toolsType, toolsOpt: opt});
            if (node) {
                this.workShapes.set(workId, node);
            }
            this.setToolsOpt(this.tmpOpt);
        }
        if (!opt.syncUnitTime) {
            opt.syncUnitTime = this.syncUnitTime;
        }
        node?.setWorkOptions(opt);
    }
    createWorkShapeNode(opt: IActiveToolsDataType & {workId:string}) {
        return getShapeInstance({...opt, vNodes:this.vNodes, fullLayer:this.thread.fullLayer, drawLayer:this.thread.localLayer}, this.thread.serviceWork);
    }
}