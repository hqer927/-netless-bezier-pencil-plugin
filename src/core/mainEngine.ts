/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import EventEmitter2 from "eventemitter2";
import { BaseCollectorReducerAction, DiffOneData, ISerializableStorageData, Storage_Selector_key, Storage_ViewId_ALL } from "../collector";
import { BaseApplianceManager } from "../plugin/baseApplianceManager";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, IMainMessage, IMainMessageRenderData, IRectType, IUpdateNodeOpt, IWorkerMessage, IqueryTask, IworkId, ViewWorkerOptions } from "./types";
import { BaseSubWorkModuleProps, EmitEventType, InternalMsgEmitterType } from "../plugin/types";
import type { ImageInformation } from "../plugin/types";
import { MethodBuilderMain, ZIndexNodeMethod } from "./msgEvent";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "./enum";
import { ShowFloatBarMsgValue } from "../displayer/types";
import { isIntersectForPoint, requestAsyncCallBack } from "./utils";
import { ETextEditorType, TextOptions } from "../component/textEditor/types";
import { BaseShapeOptions, ImageOptions } from "./tools";
import {isNumber, isBoolean, cloneDeep} from "lodash";
import type { MainThreadManager } from "./mainThread";
import { DefaultAppliancePluginOptions } from "../plugin/const";
export abstract class MasterController {
    /** 异步同步时间间隔 */
    maxLastSyncTime = DefaultAppliancePluginOptions.syncOpt.interval;
    /** 插件管理器 */
    readonly abstract control: BaseApplianceManager;
    readonly abstract internalMsgEmitter: EventEmitter2;
    /** worker线程管理器 */
    // protected abstract threadEngine?: WorkerManager;
    /** 本地原始点数据批任务数据池 */
    protected abstract localPointsBatchData: Map<IworkId, {
        state: EvevtWorkState, 
        points: number[],
        isFullWork: boolean,
        viewId: string,
    }>;
    /** 事件任务处理批量池 */
    abstract taskBatchData: Set<IWorkerMessage>;
    /** 主线程和工作线程通信机 */
    protected abstract fullWorker: Worker;
    /** 子线程和工作线程通信机 */
    protected abstract subWorker: Worker;
    /** 当前选中的工具配置数据 */
    abstract currentToolsData?: IActiveToolsDataType;
    /** 当前工作任务数据 */
    protected abstract currentLocalWorkData: IActiveWorkDataType;

    /** 设置当前选中的工具配置数据 */
    setCurrentToolsData(currentToolsData: IActiveToolsDataType) {
        this.currentToolsData = currentToolsData;
    }
    getCurrentToolsData() {
        return this.currentToolsData;
    }
    /** 设置当前绘制任务数据 */
    protected setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType) {
        this.currentLocalWorkData = currentLocalWorkData;
    }
    /** 获取当前激活的工作任务id */
    protected getWorkId():IworkId | undefined {
       return this.currentLocalWorkData.workId;
    }
    /** 获取当前work的工作状态 */
    getWorkState():EvevtWorkState {
        return this.currentLocalWorkData.workState;
    }
    /** 用于接收服务端同步的数据 */
    abstract onServiceDerive(key: string, data:DiffOneData<BaseCollectorReducerAction | undefined>):void;
    /** 消费批处理池数据 */
    abstract consume():void;
    /** 运行异步动画逻辑 */
    abstract runAnimation():void;
    /** 禁止写入 */
    abstract unWritable():void;
    /** 可以使用 */
    abstract abled():void;
    /** 当前状态是否可以写入 */
    abstract isAbled():boolean;
    /** 销毁 */
    abstract destroy():void;
    /** 服务端拉取数据初始化 */
    abstract pullServiceData(viewId:string, scenePath:string, options:{
        isAsync?:boolean;
        useAnimation?:boolean;
    }):void;
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: Set<IWorkerMessage>):void;
    /** 主线程和工作线程通信,接收 */
    abstract on():void;
    /** 更新已有node配置 */
    abstract updateNode(workId:IworkId, updateNodeOpt:IUpdateNodeOpt, viewId:string, scenePath:string):void;
    /** 清空指定的view场景路径下的所有数据 */
    abstract clearViewScenePath(viewId:string, justLocal?:boolean): Promise<void>;
    /** 更新指定view场景路径下的相机参数 */
    abstract updateCamera(viewId:string, cameraOpt:ICameraOpt):void;
    /**  创建一个新的viewWorker */
    abstract createViewWorker(viewId:string, options:ViewWorkerOptions): void;
    /** 本地发送cursor事件 */
    abstract sendCursorEvent(point:[number|undefined, number|undefined], viewId:string): void;
    /** 获取某个场景路径下的包围盒 */
    abstract getBoundingRect(scenePath:string):Promise<IRectType>|undefined;
    abstract getSnapshot(scenePath: string, width?: number, height?: number, camera?:Pick<ICameraOpt,"centerX" | "centerY" | "scale">): Promise<ImageBitmap> | undefined;
    /** 根据查询条件查询事件任务处理批量池中任务 */
    abstract queryTaskBatchData(query:IqueryTask): IWorkerMessage[];
    abstract insertImage(imageInfo: ImageInformation):void;
    abstract lockImage(uuid: string, locked: boolean): void;
    abstract completeImageUpload(uuid: string, src: string): void;
    abstract getImagesInformation(scenePath: string): ImageInformation[];
    /** 移除正在绘制的流程 */
    abstract removeDrawingWork(viewId:string):void;
    /** 修正绘制异常任务 */
    abstract checkDrawingWork(viewId:string):void;
}
export class MasterControlForWorker extends MasterController{
    isActive:boolean = false;
    currentToolsData?: IActiveToolsDataType;
    protected currentLocalWorkData: IActiveWorkDataType;
    control: BaseApplianceManager;
    internalMsgEmitter: EventEmitter2;
    taskBatchData: Set<IWorkerMessage> = new Set();
    protected fullWorker!: Worker;
    protected subWorker!: Worker;
    private fullWorkerUrl: string;
    private subWorkerUrl: string;
    methodBuilder?: MethodBuilderMain;
    private zIndexNodeMethod?: ZIndexNodeMethod;
    /** master\fullwoker\subworker 三者高频绘制时队列化参数 */
    private subWorkerDrawCount: number = 0;
    private wokerDrawCount: number = 0;
    private maxDrawCount: number = 0;
    private reRenders: Array<IMainMessageRenderData> = [];
    private localWorkViewId?:string;
    protected localPointsBatchData: Map<IworkId, {
        state: EvevtWorkState, 
        points: number[],
        /** 完整的绘制 */
        isFullWork: boolean,
        viewId: string,
        opt?: BaseShapeOptions;
    }> = new Map();
    /** end */
    /** 是否任务队列化参数 */
    private tasksqueue:Map<string,IWorkerMessage> = new Map();
    private useTasksqueue: boolean = false;
    private useTasksClockId?: number;
    private mainTasksqueueCount?: number;
    private workerTasksqueueCount?: number;
    /** end */
    private snapshotMap:Map<string, (value: ImageBitmap) => void> = new Map();
    private boundingRectMap:Map<string, (value: IRectType) => void> = new Map();
    private clearAllResolveMap:Map<string, {
        timer?: number;
        resolve?: (viewId:string) =>void;
    }> = new Map();
    private delayWorkStateToDoneResolve?: (bol:boolean) => void;
    private animationId: number|undefined;
    private tmpImageConfigMap:Map<string, ImageInformation> = new Map();
    private mainThread?: MainThreadManager;
    private willSelectorWorkId?: string;
    private isLockSentEventCursor:boolean = false;
    constructor(props:BaseSubWorkModuleProps){
        super();
        const {control, internalMsgEmitter} = props;
        this.control = control;
        this.maxLastSyncTime = this.control.pluginOptions?.syncOpt?.interval || this.maxLastSyncTime;
        this.fullWorkerUrl = this.control.pluginOptions.cdn.fullWorkerUrl;
        this.subWorkerUrl = this.control.pluginOptions.cdn.subWorkerUrl;
        this.internalMsgEmitter = internalMsgEmitter;
        this.currentLocalWorkData = {workState:EvevtWorkState.Pending};
    }
    destroy(): void {
        this.methodBuilder?.destroy()
        this.unWritable();
        this.taskBatchData.clear();
        this.tasksqueue.clear();
        this.tmpImageConfigMap.clear();
        this.localPointsBatchData.clear();
        this.fullWorker.terminate();
        this.subWorker.terminate();
        this.isActive = false;
        this.clearAllResolveMap.clear();
        this.snapshotMap.clear();
        this.boundingRectMap.clear();
        this.fullWorker.terminate();
        this.subWorker.terminate();
    }
    private get viewContainerManager() {
        return this.control.viewContainerManager;
    }
    private get collector() {
        return this.control.collector;
    }
    private get isRunSubWork(): boolean {
        const toolsType = this.currentToolsData?.toolsType;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.LaserPen || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon
        ) {
            return true;
        }
        return false
    }
    private get isCanDrawWork(): boolean {
        const toolsType = this.currentToolsData?.toolsType;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.LaserPen || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon ||
            toolsType === EToolsKey.Triangle || 
            toolsType ===EToolsKey.Rhombus
        ) {
            return true;
        }
        return false
    }
    private get isUseZIndex(): boolean {
        const toolsType = this.currentToolsData?.toolsType;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon || 
            toolsType === EToolsKey.Text || 
            toolsType === EToolsKey.Image
        ) {
            return true;
        }
        return false
    }
    private get isCanRecordUndoRedo(): boolean {
        const toolsType = this.currentToolsData?.toolsType;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.Eraser || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon || 
            toolsType === EToolsKey.Text || 
            toolsType === EToolsKey.Image
        ) {
            return true;
        }
        return false
    }
    private get isCanSentCursor(): boolean {
        const toolsType = this.currentToolsData?.toolsType;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.Text || 
            toolsType === EToolsKey.LaserPen || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon ||
            toolsType === EToolsKey.Triangle || 
            toolsType ===EToolsKey.Rhombus
        ) {
            return true;
        }
        return false
    }
    private get isCanStartEventConsum():boolean {
        const toolsType = this.currentToolsData?.toolsType;
        if (
            toolsType === EToolsKey.Selector || 
            toolsType === EToolsKey.Eraser
        ) {
            return true;
        }
        return false
    }
    async init(){
        await this.on();
        this.internalMsgEmitterListener();
        this.isActive = true;
    }
    async on() {
        if (!this.control.hasOffscreenCanvas()) {
            console.info('no OffscreenCanvas')
            const {MainThreadManagerImpl} = await import("./mainThread");
            this.mainThread = new MainThreadManagerImpl(this);
            return;
        }
        if (!this.fullWorkerUrl || !this.subWorkerUrl) {
            console.error('no worker url config')
            return;
        }
        this.fullWorker = new Worker(this.fullWorkerUrl, {type: 'classic'});
        this.subWorker = new Worker(this.subWorkerUrl, {type: 'classic'});
        this.fullWorker.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, sp, drawCount, workerTasksqueueCount} = e.data;
                if (this.isBusy && workerTasksqueueCount) {
                    this.setWorkerTasksqueueCount(workerTasksqueueCount);
                }
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render?.length) {
                    this.viewContainerManager.render(render);
                    return;
                }
                if ( drawCount ) {
                    this.wokerDrawCount = drawCount;
                    if (this.wokerDrawCount < Infinity) {
                        this.maxDrawCount = Math.max(this.maxDrawCount, this.wokerDrawCount);
                    } else {
                        this.maxDrawCount = 0;
                        this.clearReRenders();
                    }
                    if (render?.length) {
                        this.viewContainerManager.render(render);
                        if (this.wokerDrawCount <= this.subWorkerDrawCount && this.reRenders.length) {
                            // console.log('fullWorker-render', this.reRenders.length)
                            this.viewContainerManager.render(this.reRenders.map(r=>({...r,isUnClose:false})));
                            this.reRenders.length = 0;
                        }
                    }
                }
            }
        }
        this.subWorker.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, drawCount, sp} = e.data;
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render?.length) {
                    this.viewContainerManager.render(render);
                    return;
                }
                if ( drawCount ) {
                    this.subWorkerDrawCount = drawCount;
                    if (this.wokerDrawCount < Infinity) {
                        this.maxDrawCount = Math.max(this.maxDrawCount, this.subWorkerDrawCount);
                    }
                    if (render?.length) {
                        if (this.subWorkerDrawCount > this.wokerDrawCount) {
                            render.forEach(r=>{
                                if (r.imageBitmap) {
                                    r.isUnClose = true;
                                    this.reRenders.push(r);
                                }
                            })
                        } else if (this.reRenders.length) {
                            this.clearReRenders();
                        }
                        if (this.wokerDrawCount < Infinity) {
                            this.viewContainerManager.render(render);
                        }
                    }
                }
            }
        }
    }
    private clearReRenders(){
        if (this.reRenders.length) {
            this.reRenders.forEach(reRender => {
                if (reRender.imageBitmap) {
                    reRender.imageBitmap?.close();
                }
            });
            this.reRenders.length = 0
        }
    }
    get isBusy():boolean {
        return this.getTasksqueueState() === EvevtWorkState.Doing;
    }
    getLockSentEventCursor(){
        return this.isLockSentEventCursor;
    }
    setLockSentEventCursor(bol:boolean){
        this.isLockSentEventCursor = bol;
    }
    getTasksqueueState(){
        return this.useTasksqueue && EvevtWorkState.Doing || EvevtWorkState.Done;
    }
    setMaxDrawCount(num:number){
        this.maxDrawCount = num;
    }
    setWorkerTasksqueueCount(num:number){
        const workerTasksqueueCount = Math.max(this.workerTasksqueueCount || 0, num)
        this.workerTasksqueueCount = workerTasksqueueCount;
    }
    collectorSyncData(sp: IMainMessage[]){
        let isHasOther = false;
        for (const data of sp) {
            const { type, selectIds, opt, selectRect, strokeColor, fillColor, willSyncService, isSync, 
                imageBitmap, canvasHeight, canvasWidth, rect, op, canTextEdit, points,
                selectorColor, canRotate, scaleType, textOpt, toolsType, workId, viewId, dataType, 
                canLock, isLocked, shapeOpt, toolsTypes } = data;
            if (!viewId) {
                return ;
            }
            const scenePath = data.scenePath || this.viewContainerManager.getCurScenePath(viewId);
            switch (type) {
                case EPostMessageType.Select: {
                    const value:Partial<ShowFloatBarMsgValue> | undefined = selectIds?.length ? {...selectRect, selectIds, canvasHeight, canvasWidth, points} : undefined;
                    if (value && opt?.strokeColor) {
                        value.selectorColor = opt.strokeColor;
                    }
                    if (value && selectorColor) {
                        value.selectorColor = selectorColor;
                    }
                    if(value && strokeColor){
                        value.strokeColor = strokeColor;
                    }
                    if (value && opt?.fillColor) {
                        value.fillColor = opt.fillColor;
                    }
                    if (value && fillColor) {
                        value.fillColor = fillColor;
                    }
                    if (value && isBoolean(canRotate)) {
                        value.canRotate = canRotate;
                    }
                    if (value && scaleType) {
                        value.scaleType = scaleType;
                    }
                    if (value && canTextEdit) {
                        value.canTextEdit = canTextEdit;
                    }
                    if (value && textOpt) {
                        value.textOpt = textOpt;
                    }
                    if (value && isBoolean(canLock)) {
                        value.canLock = canLock;
                    }
                    if (value && isBoolean(isLocked)) {
                        value.isLocked = isLocked;
                    }
                    if (value && shapeOpt) {
                        value.shapeOpt = shapeOpt;
                    }
                    if (value && toolsTypes) {
                        value.toolsTypes = toolsTypes;
                    }
                    viewId && this.viewContainerManager.showFloatBar(viewId, !!value, value);
                    if (willSyncService) {
                        this.collector?.dispatch({type, selectIds, opt, isSync, viewId, scenePath });
                    }
                    break; 
                }
                case EPostMessageType.Snapshot:
                    if (imageBitmap && scenePath) {
                        const resolve = this.snapshotMap.get(scenePath);
                        if (resolve) {
                            resolve(imageBitmap as ImageBitmap);
                        }
                    }
                    break;
                case EPostMessageType.BoundingBox:
                    if (rect && scenePath) {
                        const resolve = this.boundingRectMap.get(scenePath);
                        if (resolve) {
                            resolve(rect as IRectType);
                        }
                    }
                    break;
                case EPostMessageType.Cursor:
                    if (op) {
                        this.control.cursor.collectServiceCursor({...data});
                    }
                    break;
                case EPostMessageType.Clear:
                    if (viewId) {
                        this.viewContainerManager.showFloatBar(viewId, false);
                        const resolve = this.clearAllResolveMap.get(viewId)?.resolve;
                        resolve && resolve(viewId);
                    }
                    break;
                case EPostMessageType.TextUpdate:
                    if (toolsType === EToolsKey.Text && workId && viewId) {
                        const point = this.viewContainerManager.transformToOriginPoint((opt as TextOptions)?.boxPoint || [0,0], viewId)
                        const boxSize =  (opt as TextOptions)?.boxSize || [0,0];
                        const cameraOpt = this.viewContainerManager.getView(viewId)?.cameraOpt;
                        if (!opt) {
                            this.control.textEditorManager.delete(workId as string, willSyncService || false, false)
                        } else {
                            this.control.textEditorManager.updateTextForWorker({
                                x: point[0],
                                y: point[1],
                                w: boxSize[0],
                                h: boxSize[1],
                                scale: cameraOpt?.scale || 1,
                                workId: workId as string,
                                opt: opt as TextOptions,
                                dataType,
                                viewId,
                                canSync: willSyncService || false,
                                canWorker: false
                            })
                        }
                    }
                    break;
                case EPostMessageType.GetTextActive:
                    if (toolsType === EToolsKey.Text && workId && viewId) {
                        this.control.textEditorManager.updateTextForWorker({
                            workId: workId as string,
                            isActive: true,
                            viewId,
                            dataType: EDataType.Local,
                            canWorker: false,
                            canSync: true,
                        }, Date.now())
                    }
                    break;
                default:
                    isHasOther = true;
                    break;
            }
        }
        if (isHasOther) {
            requestAsyncCallBack(()=>{
                this.collectorAsyncData(sp);          
            }, this.maxLastSyncTime)
        }
    }
    private collectorAsyncData(sp: IMainMessage[]){
        for (const data of sp) {
            const {type, op, workId, index, removeIds, ops, opt, updateNodeOpt, toolsType, isSync, viewId, isLockSentEventCursor} = data;
            if (!viewId) {
                console.error('collectorAsyncData', data)
                return ;
            }
            const scenePath = data.scenePath || this.viewContainerManager.getCurScenePath(viewId);
            switch (type) {
                case EPostMessageType.DrawWork: {
                    this.collector?.dispatch({
                        type,
                        op,
                        opt, 
                        toolsType, 
                        workId,
                        index,
                        isSync,
                        viewId,
                        scenePath,
                        updateNodeOpt
                    })
                    break
                } 
                case EPostMessageType.FullWork:{
                    this.collector?.dispatch({
                        type, 
                        ops, 
                        workId, 
                        updateNodeOpt, 
                        opt, 
                        toolsType, 
                        isSync, 
                        viewId,
                        scenePath
                    });
                    if (this.willSelectorWorkId && workId && workId.toString() === this.willSelectorWorkId) {
                        this.control.runEffectWork(()=>{
                            this.setShapeSelectorByWorkId(this.willSelectorWorkId as string, viewId);
                            this.willSelectorWorkId = undefined;
                        });
                    }
                    if (isLockSentEventCursor) {
                        requestAsyncCallBack(()=>{
                            this.setLockSentEventCursor(false);
                        }, this.maxLastSyncTime);
                    }
                    break;
                }
                case EPostMessageType.UpdateNode:{
                    this.collector?.dispatch({type, updateNodeOpt, workId, opt, ops, op, isSync, viewId, scenePath})
                    break;
                }
                case EPostMessageType.RemoveNode:{
                    removeIds && this.control.textEditorManager.deleteBatch(removeIds, false, false);
                    this.collector?.dispatch({type, removeIds, isSync, viewId, scenePath});
                    if (this.willSelectorWorkId && removeIds?.includes(this.willSelectorWorkId)) {
                        this.willSelectorWorkId = undefined;
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }
    private async onLocalEventEnd(point: [number, number], viewId: string): Promise<void> {
        const view = this.viewContainerManager.getView(viewId);
        if (!view) {
            return;
        }
        const {focusScenePath, cameraOpt} = view;
        const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, viewId);
        const willConsumeWorkIds:IworkId[] = [];
        for (const workId of this.localPointsBatchData.keys()) {
            if (this.currentToolsData?.toolsType === EToolsKey.Text) {
                const oldPoints = this.getLocalPointInfo(workId);
                const localState = oldPoints?.state;
                if (localState && localState === EvevtWorkState.Start) {
                    const opt = this.currentLocalWorkData.toolsOpt as TextOptions;
                    opt.workState = EvevtWorkState.Doing;
                    opt.boxPoint = _point;
                    opt.boxSize = [opt.fontSize, opt.fontSize];
                    this.control.textEditorManager.checkEmptyTextBlur();
                    this.control.textEditorManager.createTextForMasterController({
                        workId: Date.now().toString(),
                        x: point[0],
                        y: point[1],
                        scale: cameraOpt?.scale || 1,
                        opt,
                        type: ETextEditorType.Text,
                        isActive: true,
                        viewId,
                        scenePath: focusScenePath
                    }, Date.now());
                }
                this.deleteLocalPoint(workId);
                continue;
            } else {
                this.pushLocalPoint(workId, _point, EvevtWorkState.Done, viewId);
                willConsumeWorkIds.push(workId);
            }
        }
        if (willConsumeWorkIds.length) {
            try {
                const r = await new Promise<boolean>((resolve)=>{
                    setTimeout(async ()=>{
                        willConsumeWorkIds.forEach(workId=>{
                            this.setLocalPointIsFullWork(workId)
                        })
                        this.delayWorkStateToDoneResolve = resolve;
                        this.consume();
                    }, 0) as unknown as number;
                })
                if (r) {
                    if (willConsumeWorkIds[0]) {
                        const workId = willConsumeWorkIds[0];
                        willConsumeWorkIds.forEach(workId=>{
                            this.deleteLocalPoint(workId)
                        })
                        this.willSelectorWorkId = workId.toString();
                    }
                }
            } catch (error) {
                console.log('error', error);
            }
            this.delayWorkStateToDoneResolve = undefined;
            willConsumeWorkIds.length = 0;
        }
    }
    private onLocalEventDoing(point: [number, number], viewId: string): void {
        if (this.currentToolsData?.toolsType === EToolsKey.Text) {
            return ;
        }
        if ( this.currentLocalWorkData.workState === EvevtWorkState.Start) {
            this.setCurrentLocalWorkData({...this.currentLocalWorkData, workState: EvevtWorkState.Doing})
        }
        let willConsume = false;
        for (const [workId, {state}] of this.localPointsBatchData.entries()) {
            if (this.isAbled() && state !== EvevtWorkState.Pending) {
                const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, viewId);
                this.pushLocalPoint(workId, _point, state === EvevtWorkState.Start ? EvevtWorkState.Doing : state, viewId);
                willConsume = true;
            }
        }
        if (willConsume) {
            this.runAnimation();
            return;
        }
        if (!this.useTasksqueue){
            this.hoverCursor(point, viewId);
        }
    }
    private onLocalEventStart(point: [number, number], viewId:string): void {
        if (this.viewContainerManager.focuedViewId !== viewId) {
            this.viewContainerManager.setFocuedViewId(viewId);
        }
        if (this.isCanDrawWork && this.control.room && !this.control.room.disableDeviceInputs){
            this.control.room.disableDeviceInputs = true;
        }
        const workId = this.currentToolsData?.toolsType === EToolsKey.Selector ? Storage_Selector_key : Date.now();
        const opt = this.setZIndex(viewId);
        this.setCurrentLocalWorkData({
            workState: EvevtWorkState.Start,
            toolsOpt: opt,
            viewId,
        });
        const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, viewId);
        this.pushLocalPoint(workId, _point, EvevtWorkState.Start, viewId, opt);
        if (this.currentToolsData?.toolsType === EToolsKey.Text) {
            return ;
        }
        this.control.textEditorManager.checkEmptyTextBlur();
        if (this.isCanRecordUndoRedo) {
            this.internalMsgEmitter.emit('addUndoTicker', workId, viewId);
        }
        if (workId && opt && this.currentToolsData?.toolsType && this.isCanStartEventConsum) {
            // 这里包含了一些特殊的工具类型，比如橡皮擦，选框等
            this.prepareOnceWork({workId, toolsOpt:opt, viewId}, this.currentToolsData?.toolsType);
        }
        this.maxDrawCount = 0;
        this.wokerDrawCount = 0;
        this.subWorkerDrawCount = 0;
        this.reRenders.length = 0;
        if (this.isCanDrawWork) {
            const scenePath = this.viewContainerManager.getCurScenePath(viewId);
            if (scenePath && this.collector?.hasSelector(viewId,scenePath)) {
                this.blurSelector(viewId, scenePath);
            }
        }
        this.consume();
    }
    private setLocalPointIsFullWork(workId:IworkId){
        const data = this.getLocalPointInfo(workId);
        if (data) {
            data.isFullWork = true;
            this.localPointsBatchData.set(workId, data);
        }
    }
    private pushLocalPoint(workId:IworkId, point: [number, number], workState:EvevtWorkState,  viewId:string, opt?:BaseShapeOptions): void {
        let data = this.getLocalPointInfo(workId);
        if (workState === EvevtWorkState.Start) {
            data = {
                state: EvevtWorkState.Start,
                points: point,
                opt: opt || this.currentLocalWorkData.toolsOpt,
                isFullWork: false,
                viewId,
            };
        } else if (data) {
            data.state = workState;
            data.points.push(point[0],point[1]);   
        }
        data && this.localPointsBatchData.set(workId, data);
    }
    private deleteLocalPoint(workId:IworkId): void {
        this.localPointsBatchData.delete(workId);
    }
    private getLocalPointInfo(workId:IworkId){
        return this.localPointsBatchData.get(workId);
    }
    getLocalPointsInfo(){
        return this.localPointsBatchData;
    }
    private correctStorage(store: ISerializableStorageData, viewId:string, scenePath:string) {
        const updateMap: Map<string,BaseCollectorReducerAction> = new Map();
        const willCorrectArr:Array<[string,number]> = [];
        Object.keys(store).forEach(s=>{
            const zIndex = store[s]?.opt?.zIndex;
            if (isNumber(zIndex)) {
                willCorrectArr.push([s,zIndex]);
            }
        })
        const correctedArr = willCorrectArr.length && this.zIndexNodeMethod?.correct(willCorrectArr) || [];
        if (this.zIndexNodeMethod && correctedArr.length) {
            this.zIndexNodeMethod.setMinZIndex(correctedArr[0][1] || 0, viewId);
            this.zIndexNodeMethod.setMaxZIndex(correctedArr[correctedArr.length - 1][1] || 0, viewId);
        }
        for (const [key,number] of correctedArr) {
            if (!store[key]) {
                continue;
            }
            const item = store[key] as BaseCollectorReducerAction;
            if (!item.opt) {
                continue;
            }
            if (!isNumber(item.opt.zIndex)) {
                continue;
            }
            if (item.opt.zIndex !== number) {
                item['opt']['zIndex'] = number;
                updateMap.set(key, item);
            }
        }
        if (updateMap.size) {
            updateMap.forEach((value,key)=>{
                this.collector?.updateValue(key, value, {
                    viewId,
                    scenePath,
                    isSync:true,
                })
                store[key] = value;
            })
        }
        return store;
    }
    async originalEventLintener(workState: EvevtWorkState, point:[number,number], viewId:string):Promise<void> {
        if (!this.isAbled()) {
            return ;
        }
        switch (workState) {
            case EvevtWorkState.Start:
                this.setLocalWorkViewId(viewId);
                viewId && this.onLocalEventStart(point, viewId);
                break;
            case EvevtWorkState.Doing:
                if (viewId && viewId === this.getLocalWorkViewId()) {
                    this.onLocalEventDoing(point, viewId);
                }
                break;
            case EvevtWorkState.Done:
                if (viewId && viewId === this.getLocalWorkViewId()) {
                    await this.onLocalEventEnd(point, viewId);
                }
                break;
            default:
                break;
        }
    }
    getLocalWorkViewId(){
        return this.localWorkViewId
    }
    setLocalWorkViewId(viewId?:string){
        this.localWorkViewId = viewId
    }
    setCurrentToolsData(currentToolsData: IActiveToolsDataType) {
        const toolsType = currentToolsData.toolsType;
        const isChangeToolsType = this.currentToolsData?.toolsType !== currentToolsData.toolsType;
        // if (!this.isActive && isChangeToolsType) {
        //     // why?
        //     setTimeout(()=>{
        //         this.setCurrentToolsData(currentToolsData);
        //     },50)
        //     return;
        // }
        super.setCurrentToolsData(currentToolsData);
        if(isChangeToolsType) {
            const views = this.viewContainerManager?.getAllViews();
            for (const view of views) {
                if (view) {
                    const {id, focusScenePath} = view;
                    if (isChangeToolsType && id && focusScenePath ) {
                        if (this.collector?.hasSelector(id, focusScenePath)) {
                            this.blurSelector(id,focusScenePath)
                        }
                        this.control.textEditorManager.checkEmptyTextBlur();
                    }
                }
            }
            this.taskBatchData.add({
                msgType: EPostMessageType.UpdateTools,
                dataType: EDataType.Local,
                toolsType,
                opt: {...currentToolsData.toolsOpt, syncUnitTime: this.maxLastSyncTime },
                isRunSubWork: this.isRunSubWork,
                viewId: Storage_ViewId_ALL
            })
            this.runAnimation();
        }
    }
    private prepareOnceWork(currentLocalWorkData: Required<Pick<IActiveWorkDataType,'toolsOpt' | 'viewId' | 'workId'>>, toolsType:EToolsKey){
        const {workId, toolsOpt, viewId} = currentLocalWorkData;
        this.queryTaskBatchData({
            msgType: EPostMessageType.CreateWork,
            dataType: EDataType.Local,
            viewId,
            toolsType
        }).forEach(task=>{
            this.taskBatchData.delete(task);
        })
        this.taskBatchData.add({
            msgType: EPostMessageType.CreateWork,
            workId,
            toolsType,
            opt: {...toolsOpt, syncUnitTime: this.maxLastSyncTime},
            dataType: EDataType.Local,
            isRunSubWork: this.isRunSubWork,
            viewId
        })
        this.runAnimation();
    }
    createViewWorker(viewId: string, options: ViewWorkerOptions):void {
        const {offscreenCanvasOpt, layerOpt, dpr, cameraOpt} = options
        this.taskBatchData.add({
            msgType: EPostMessageType.Init,
            dataType: EDataType.Local,
            viewId,
            offscreenCanvasOpt,
            layerOpt,
            dpr,
            cameraOpt,
            isRunSubWork: true,
            isSafari: navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1
        });
        if (this.isBusy) {
            this.destroyTaskQueue();
        }
        this.consume();
    }
    destroyViewWorker(viewId: string, isLocal:boolean= false):void {
        if (this.getLocalWorkViewId() === viewId) {
            this.setLocalWorkViewId(undefined);
        }
        if (this.zIndexNodeMethod) {
            this.zIndexNodeMethod.clearZIndex(viewId);
        }
        this.taskBatchData.add({
            msgType: EPostMessageType.Destroy,
            dataType: EDataType.Local,
            viewId,
            isRunSubWork: true,
        });
        this.consume();
        if (!isLocal) {
            this.collector?.dispatch({
                type: EPostMessageType.Clear,
                viewId
            })
        }
    }
    onServiceDerive(key: string, data: DiffOneData<BaseCollectorReducerAction | undefined>): void {
        const {newValue, oldValue, viewId, scenePath} = data;
        const msg:BaseCollectorReducerAction = cloneDeep(newValue) || {};
        const workId:IworkId = key;
        let msgType = msg.type;
        if (!newValue && oldValue) {
            msgType = EPostMessageType.RemoveNode;
            if (oldValue.toolsType === EToolsKey.LaserPen){
                return;
            }
        }
        const focusScenePath = this.viewContainerManager.getView(viewId)?.focusScenePath
        if (focusScenePath && focusScenePath !== scenePath) {
            return;
        }
        if (msgType && workId) {
            const d: IWorkerMessage & Pick<IWorkerMessage, 'workId'> = msg as IWorkerMessage;
            d.workId = this.collector?.isOwn(workId) ? this.collector?.getLocalId(workId) : workId;
            d.msgType = msgType;
            if (d.toolsType === EToolsKey.LaserPen) {
                d.isRunSubWork = true;
            }
            d.dataType = EDataType.Service;
            d.viewId = viewId;
            d.scenePath = scenePath;
            if (d.selectIds) {
                d.selectIds = d.selectIds.map(id=>{
                    return this.collector?.isOwn(id) ? this.collector?.getLocalId(id) : id;
                })
            }
            if ((d && d.toolsType === EToolsKey.Text) || oldValue?.toolsType === EToolsKey.Text) {
                this.control.textEditorManager.onServiceDerive(d);
                return;
            }
            // console.log('onServiceDerive', d)
            this.taskBatchData.add(d);
        }
        this.runAnimation();
        const zIndex = data.newValue && data.newValue.opt?.zIndex;
        if (this.zIndexNodeMethod && isNumber(zIndex)) {
            const minZIndex:number|undefined = this.zIndexNodeMethod.getMinZIndex(viewId);
            const maxZIndex:number|undefined = this.zIndexNodeMethod.getMaxZIndex(viewId);
            if (maxZIndex < zIndex) this.zIndexNodeMethod.setMaxZIndex(zIndex, viewId); 
            if (minZIndex > zIndex) this.zIndexNodeMethod.setMinZIndex(zIndex, viewId);
        }
    }
    pullServiceData(viewId: string, scenePath: string, options:{
        isAsync?:boolean;
        useAnimation?:boolean;
    } = {
        isAsync: false,
        useAnimation: false
    }): void {
        let store = this.collector?.getStorageData(viewId, scenePath);
        const {isAsync, useAnimation} = options;
        if (store) {
            store = this.correctStorage(store, viewId, scenePath);
            const keys = Object.keys(store);
            for (const key of keys) {
                const msgType = store[key]?.type
                if (msgType && key) {
                    const data:IWorkerMessage & Pick<IWorkerMessage, 'workId'> = store[key] as IWorkerMessage;
                    data.workId = this.collector?.isOwn(key) ? this.collector?.getLocalId(key) : key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    data.viewId = viewId;
                    data.scenePath = scenePath;
                    data.useAnimation = !!useAnimation;
                    if (data.selectIds) {
                        data.selectIds = data.selectIds.map(id=>{
                            return this.collector?.isOwn(id) ? this.collector?.getLocalId(id) : id;
                        })
                    }
                    if (data.toolsType === EToolsKey.Text) {
                        this.control.textEditorManager.onServiceDerive(data)
                        continue;
                    }
                    this.taskBatchData.add(data);
                }
                this.internalMsgEmitter.emit("excludeIds", keys, viewId);
            }
            if (isAsync) {
                this.consume();
            } else {
                this.runAnimation();
            }
        }
    }
    runAnimation(){
        if (!this.animationId && !this.isBusy){
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    consume(): void {
        this.animationId = undefined;
        const {viewId} = this.currentLocalWorkData;
        // 如果是使用任务队列,则优先使用
        if (this.tasksqueue.size) {
            const taskBatchData = this.consumeQueue();
            const willClear = !!taskBatchData.size;
            // 服务端同步数据需要和队列任务一起消费
            if(this.taskBatchData.size){
                for (const task of this.taskBatchData.values()) {
                    if (task.dataType === EDataType.Service) {
                        taskBatchData.add(task);
                        this.taskBatchData.delete(task);
                    }
                }
            }
            if (taskBatchData.size) {
                this.post(taskBatchData);
                if (willClear) {
                    this.tasksqueue.clear();
                }
            } else if ( this.tasksqueue.size ) {
                this.animationId = requestAnimationFrame(this.consume.bind(this));
            }
            return;
        }
        if (this.isAbled() && this.localPointsBatchData.size && viewId) {
            for (const [workId, { state, isFullWork, points, opt}] of this.localPointsBatchData.entries()) {
                if (state === EvevtWorkState.Done && !isFullWork) {
                    continue;
                }
                if (state === EvevtWorkState.Start && !this.isCanStartEventConsum) {
                    continue;
                }
                const op = points.map(p=>p);
                if (op.length) {
                    if (this.delayWorkStateToDoneResolve && state === EvevtWorkState.Done) {
                        this.delayWorkStateToDoneResolve(true);
                        this.setLockSentEventCursor(true);
                    }
                    this.taskBatchData.add({
                        op,
                        workState: state,
                        workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        isRunSubWork: this.isRunSubWork,
                        toolsType: this.currentToolsData?.toolsType,
                        viewId,
                        scenePath: viewId && this.viewContainerManager.getCurScenePath(viewId),
                        opt,
                        isLockSentEventCursor: this.getLockSentEventCursor(),
                        syncUnitTime: this.maxLastSyncTime
                    })
                    points.length = 0;
                }
            }
        }
        if (this.taskBatchData.size) {
            this.post(this.taskBatchData);
            this.taskBatchData.clear();
        }
        if ( this.taskBatchData.size ) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    unWritable(){
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Unwritable, workId:undefined});
    }
    abled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Pending, workId:undefined});
    }
    isAbled(): boolean {
        return this.currentLocalWorkData.workState !== EvevtWorkState.Unwritable;
    }
    post(msg: Set<IWorkerMessage>): void {
        const cls = [...msg].filter(m=>m.msgType !== EPostMessageType.CursorHover)
        if (cls.length) {
            console.log('post', cls.map(c=>c.msgType),cls)
        }
        if(!this.control.hasOffscreenCanvas()){
            if (!this.mainThread){
                let unPostMsg:IWorkerMessage[] = [];
                unPostMsg = cloneDeep([...msg]);
                setTimeout(()=>{
                    for (const value of unPostMsg) {
                        this.taskBatchData.add(value);
                    }
                },0)
                return;
            }
            this.mainThread.consume(msg)
            return;
        }
        this.fullWorker.postMessage(msg);
        const subMsg = new Set<IWorkerMessage>();
        for (const value of msg.values()) {
            const key = value.msgType;
            if (
                key === EPostMessageType.Init || 
                key === EPostMessageType.Clear || 
                key === EPostMessageType.Destroy || 
                key === EPostMessageType.UpdateCamera ||
                value.isRunSubWork
            ) {
                subMsg.add(value);
            }
        }
        subMsg.size && this.subWorker.postMessage(subMsg);
    }
    updateNode(workId:IworkId, updateNodeOpt:IUpdateNodeOpt, viewId:string, scenePath:string) {
        this.taskBatchData.add({
            msgType: EPostMessageType.UpdateNode,
            workId,
            updateNodeOpt,
            viewId,
            scenePath,
            dataType: EDataType.Local
        })
        this.runAnimation();
    }
    destroyTaskQueue(){
        this.useTasksqueue = false;
        if (this.useTasksClockId){
            clearTimeout(this.useTasksClockId)
            this.useTasksClockId = undefined;
        }
        this.mainTasksqueueCount = undefined;
        this.workerTasksqueueCount = undefined;
    }
    updateCamera(viewId: string, cameraOpt: ICameraOpt): void {
        if (!this.useTasksqueue) {
            this.methodBuilder?.pause();
            this.blurCursor(viewId);
            this.checkDrawingWork(viewId);
            this.useTasksqueue = true;
            this.mainTasksqueueCount = 1;
            this.workerTasksqueueCount = 1;
        }
        if (this.useTasksqueue) {
            this.tasksqueue.set(viewId,{
                msgType: EPostMessageType.UpdateCamera,
                dataType: EDataType.Local,
                cameraOpt: {
                    ...cameraOpt,
                    width: cameraOpt.width,
                    height: cameraOpt.height
                },
                scenePath: this.viewContainerManager.getCurScenePath(viewId),
                isRunSubWork: true,
                viewId
            });
            this.consume();
            // this.control.textEditorManager.onCameraChange(cameraOpt, viewId);
            if (this.useTasksClockId) {
                clearTimeout(this.useTasksClockId);
            }
            this.updateCameraDone()
        }
    }
    private updateCameraDone(){
        this.useTasksClockId = setTimeout(() => {
            this.useTasksClockId = undefined;
            if (this.mainTasksqueueCount === this.workerTasksqueueCount) {
                if (this.tasksqueue.size) {
                    this.consume()
                }
                this.useTasksqueue = false;
                this.mainTasksqueueCount = undefined;
                this.workerTasksqueueCount = undefined;
                this.methodBuilder?.recover();
                this.runAnimation();
            } else {
                this.updateCameraDone();
            }
        }, this.maxLastSyncTime) as unknown as number;
    }
    private consumeQueue(): Set<IWorkerMessage> {
        const taskBatchData: Set<IWorkerMessage> = new Set();
        let isAddTasks = !this.isBusy;
        if(this.isBusy && this.mainTasksqueueCount && this.workerTasksqueueCount && this.mainTasksqueueCount <= this.workerTasksqueueCount){
            isAddTasks = true;
        }
        if(isAddTasks){
            if (this.mainTasksqueueCount && this.workerTasksqueueCount) {
                this.mainTasksqueueCount++;
            }
            taskBatchData.add({
                msgType: EPostMessageType.TasksQueue,
                dataType: EDataType.Local,
                isRunSubWork: true,
                mainTasksqueueCount: this.mainTasksqueueCount,
                tasksqueue: this.tasksqueue,
                viewId: ''
            })
            for (const [viewId, value] of this.tasksqueue.entries()) {
                if (value.cameraOpt) {
                    this.control.textEditorManager.onCameraChange(value.cameraOpt, viewId);
                }
            }
        } 
        return taskBatchData
    }
    async clearViewScenePath(viewId: string, justLocal?: boolean | undefined): Promise<void> {
        this.control.textEditorManager.clear(viewId, justLocal);
        this.queryTaskBatchData({
            msgType: EPostMessageType.Clear,
            dataType: EDataType.Local,
            viewId
        }).forEach(task=>{
            this.taskBatchData.delete(task);
        })
        this.taskBatchData.add({
            dataType: EDataType.Local,
            msgType: EPostMessageType.Clear,
            viewId,
        });
        this.runAnimation();
        if (!justLocal) {
            const scenePath = this.viewContainerManager.getCurScenePath(viewId);
            this.collector?.dispatch({
                type: EPostMessageType.Clear,
                viewId,
                scenePath
            })
        }
        if (this.zIndexNodeMethod) {
            this.zIndexNodeMethod.clearZIndex(viewId);
        }
        this.localPointsBatchData.clear();
        await new Promise<string>((resolve)=>{
            const resolveInfo = this.clearAllResolveMap.get(viewId) || {
                resolve: undefined,
                timer: undefined
            };
            if (resolveInfo.timer) {
                clearTimeout(resolveInfo.timer);
            }
            resolveInfo.resolve = resolve;
            resolveInfo.timer = setTimeout(() => {
                const resolveInfo = this.clearAllResolveMap.get(viewId)
                if (resolveInfo?.resolve) {
                    resolveInfo.resolve(viewId);
                }
            }, this.maxLastSyncTime) as unknown as number;
            this.clearAllResolveMap.set(viewId, resolveInfo);
        }).then((viewId)=>{
            this.clearAllResolveMap.delete(viewId);
        })
    }
    private internalMsgEmitterListener () {
        this.methodBuilder = new MethodBuilderMain([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode, 
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode, 
            EmitEventType.ZIndexNode, EmitEventType.RotateNode,
            EmitEventType.SetFontStyle, EmitEventType.SetPoint, EmitEventType.SetLock,
            EmitEventType.SetShapeOpt
        ]).registerForMainEngine(InternalMsgEmitterType.MainEngine, this.control);
        this.zIndexNodeMethod = this.methodBuilder?.getBuilder(EmitEventType.ZIndexNode) as ZIndexNodeMethod;
    }
    private setZIndex(viewId:string){
        const opt:BaseShapeOptions | undefined = this.currentToolsData && cloneDeep(this.currentToolsData.toolsOpt);
        if(opt && this.zIndexNodeMethod && this.isUseZIndex ){
            this.zIndexNodeMethod.addMaxLayer(viewId);
            opt.zIndex = this.zIndexNodeMethod.getMaxZIndex(viewId);
        }
        return opt;
    }
    checkDrawingWork(vId:string){
        let isCanDrawWork:boolean = false;
        const removeIds:string[] = [];
        for (const [workId, {state, viewId, points, opt}] of this.localPointsBatchData.entries()) {
            if (vId === viewId && state === EvevtWorkState.Start || state === EvevtWorkState.Doing) {
                if (state === EvevtWorkState.Doing && this.isCanDrawWork) {
                    // 三帧之内认为是无效的绘制
                    if (Number(workId) && Number(workId) + 60 > Date.now()) {
                        removeIds.push(workId.toString()); 
                        this.taskBatchData.add({
                            msgType: EPostMessageType.RemoveNode,
                            workId,
                            viewId,
                            dataType: EDataType.Local,
                            isRunSubWork: true
                        })
                    }
                    const op = points.map(p=>p);
                    this.taskBatchData.add({
                        op,
                        workState: EvevtWorkState.Done,
                        workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        isRunSubWork: this.isRunSubWork,
                        toolsType: this.currentToolsData?.toolsType,
                        viewId,
                        opt,
                        scenePath: viewId && this.viewContainerManager.getCurScenePath(viewId)
                    })
                    isCanDrawWork = true;
                }
                this.deleteLocalPoint(workId);
            }
        }
        if(isCanDrawWork || removeIds.length){
            this.consume();
            if (removeIds.length) {
                const scenePath = this.viewContainerManager.getView(vId)?.focusScenePath;
                this.collector?.dispatch({
                    type: EPostMessageType.RemoveNode,
                    removeIds, 
                    viewId: vId, 
                    scenePath
                });
            }
        }
    }
    removeDrawingWork(vId:string){
        const removeIds:string[] = [];
        for (const [workId, {state, viewId}] of this.localPointsBatchData.entries()) {
            if (vId === viewId && state === EvevtWorkState.Start || state === EvevtWorkState.Doing) {
                this.deleteLocalPoint(workId);
                if (state === EvevtWorkState.Doing && this.isCanDrawWork) {
                    removeIds.push(workId.toString());
                    this.taskBatchData.add({
                        msgType: EPostMessageType.RemoveNode,
                        workId,
                        viewId,
                        dataType: EDataType.Local,
                        isRunSubWork: true
                    })
                }
            }
        }
        if (removeIds.length) {
            this.consume();
            const scenePath = this.viewContainerManager.getView(vId)?.focusScenePath;
            this.collector?.dispatch({
                type: EPostMessageType.RemoveNode,
                removeIds, 
                viewId: vId, 
                scenePath
            });
        }
    }
    hoverCursor(point: [number, number], viewId: string){
        if (this.currentToolsData?.toolsType === EToolsKey.Selector) {
            const view = this.viewContainerManager.getView(viewId);
            if (view && view.displayer && view.displayer.vDom) {
                const floatBarData = view.displayer.vDom.state.floatBarData;
                if (floatBarData) {
                    const {x,y,w,h} = floatBarData;
                    if (isIntersectForPoint(point, { x, y, w, h })) {
                        return;
                    }
                }
            }
            const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, viewId);
            const data:IWorkerMessage = {
                msgType: EPostMessageType.CursorHover,
                dataType: EDataType.Local,
                point:_point,
                toolsType: this.currentToolsData.toolsType,
                opt: this.currentToolsData.toolsOpt,
                isRunSubWork: false,
                viewId
            }
            this.queryTaskBatchData({
                msgType: EPostMessageType.CursorHover,
                dataType: EDataType.Local,
                toolsType: this.currentToolsData.toolsType,
                viewId
            }).forEach(task=>{
                this.taskBatchData.delete(task);
            })
            this.taskBatchData.add(data);
            this.runAnimation();
        }
    }
    blurCursor(viewId:string){
        if (this.currentToolsData?.toolsType !== EToolsKey.Selector) {
            return;
        }
        const data:IWorkerMessage = {
            msgType: EPostMessageType.CursorBlur,
            dataType: EDataType.Local,
            isRunSubWork: false,
            viewId
        }
        this.queryTaskBatchData({
            msgType: EPostMessageType.CursorHover,
            dataType: EDataType.Local,
            viewId
        }).forEach(task=>{
            this.taskBatchData.delete(task);
        })
        this.taskBatchData.add(data);
        this.consume();
    }
    sendCursorEvent(p:[number|undefined,number|undefined], viewId:string) {
        if (!this.currentLocalWorkData) {
            return;
        }
        if (this.currentLocalWorkData.workState === EvevtWorkState.Unwritable ) {
            return;
        }
        if (!this.currentToolsData || !this.isCanSentCursor) {
            return;
        }
        let point:[number|undefined,number|undefined] = [undefined,undefined];
        if ( this.currentToolsData && (this.isCanDrawWork || this.currentToolsData.toolsType === EToolsKey.Text) ) {
            if (!this.localPointsBatchData.size && !this.getLockSentEventCursor()) {
                point = p;
                this.control.cursor.sendEvent(point,viewId); 
            }
        }
        
    }
    getBoundingRect(scenePath: string):Promise<IRectType>|undefined{
        const cur = this.boundingRectMap?.get(scenePath);
        if (!cur) {
            const scenes = this.collector?.getScenePathData(scenePath);
            if (!scenes) {
                return;
            }
            Object.keys(scenes).forEach(key=>{
                if(this.collector?.getLocalId(key) === Storage_Selector_key){
                    delete scenes[key];
                }
            })
            if (Object.keys(scenes).length && this.viewContainerManager.mainView && this.viewContainerManager.mainView.cameraOpt) {
                const data:IWorkerMessage = {
                    msgType: EPostMessageType.BoundingBox,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    cameraOpt: {...this.viewContainerManager.mainView.cameraOpt},
                    isRunSubWork: true,
                    viewId: this.viewContainerManager.mainView.id
                }
                this.taskBatchData.add(data);
                this.runAnimation();
                return new Promise<IRectType>((resolve)=>{
                    this.boundingRectMap.set(scenePath, resolve);
                }).then((rect)=>{
                    this.boundingRectMap.delete(scenePath);
                    return rect;
                })
            }            
        }          
    } 
    getSnapshot(scenePath: string, width?: number, height?: number, camera?:Pick<ICameraOpt,"centerX" | "centerY" | "scale">) {
        const cur = this.snapshotMap?.get(scenePath);
        if (!cur) {
            const viewId = this.collector?.getViewIdBySecenPath(scenePath);
            if (!viewId) {
                return;
            }
            const scenes = this.collector?.getStorageData(viewId, scenePath);
            if (!scenes){
                return;
            }
            Object.keys(scenes).forEach(key=>{
                if(this.collector?.getLocalId(key) === Storage_Selector_key){
                    delete scenes[key];
                }
            })
            if (Object.keys(scenes).length) {
                const view = this.viewContainerManager.mainView;
                if (!view) {
                    return;
                }
                const w = width || view.cameraOpt?.width;
                const h =  height || view.cameraOpt?.height;
                const data:IWorkerMessage = {
                    msgType: EPostMessageType.Snapshot,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    w,
                    h,
                    cameraOpt: camera && {
                        ...camera,
                        width: w,
                        height: h,
                    } as ICameraOpt || view.cameraOpt,
                    isRunSubWork: true,
                    viewId: view.id,
                    // maxZIndex: this.zIndexNodeMethod?.getMaxZIndex(viewId)
                }
                this.taskBatchData.add(data);
                this.runAnimation();
                return new Promise<ImageBitmap>((resolve)=>{
                    this.snapshotMap.set(scenePath, resolve);
                }).then((imageBitmap)=>{
                    this.snapshotMap.delete(scenePath);
                    return imageBitmap;
                })
            }            
        }
    } 
    queryTaskBatchData(query: IqueryTask): IWorkerMessage[] {
        const result:IWorkerMessage[] = [];
        if (query) {
            for (const task of this.taskBatchData.values()) {
                let isOk:boolean = true;
                for (const [key,value] of Object.entries(query)) {
                    if (task[key] !== value) {
                        isOk = false;
                        break;
                    }
                }
                if(isOk){
                    result.push(task);
                }
            }
        }
        return result;
    }
    insertImage(imageInfo: ImageInformation): void {
        const mainView = this.viewContainerManager.mainView;
        const viewId = mainView?.id;
        const focusScenePath = mainView?.focusScenePath;
        if (viewId && focusScenePath) {
            const {src,uuid} = imageInfo;
            if (uuid && !src) {
                this.tmpImageConfigMap.set(uuid, imageInfo);
                return;
            }
            const undoTickerId = Date.now();
            BaseApplianceManager.InternalMsgEmitter.emit('addUndoTicker', undoTickerId, viewId);
            const opt = {...imageInfo} as ImageOptions;
            if (this.zIndexNodeMethod) {
                this.zIndexNodeMethod.addMaxLayer(viewId);
                opt.zIndex = this.zIndexNodeMethod.getMaxZIndex(viewId);
            }
            this.taskBatchData.add({
                msgType: EPostMessageType.FullWork,
                dataType: EDataType.Local,
                toolsType: EToolsKey.Image,
                workId: imageInfo.uuid,
                opt,
                viewId,
                willRefresh: true,
                willSyncService: true
            });
            this.runAnimation();
        }
    }
    lockImage(uuid: string, locked: boolean): void {
        const mainView = this.viewContainerManager.mainView;
        const viewId = mainView?.id;
        const focusScenePath = mainView?.focusScenePath;
        if (viewId && focusScenePath && this.collector) {
            const storage = this.collector.getStorageData(viewId, focusScenePath);
            if (!storage) {
                return;
            }
            for (const [key,value] of Object.entries(storage)) {
                if (value && value.toolsType === EToolsKey.Image && (value.opt as ImageOptions).uuid === uuid) {
                    const undoTickerId = Date.now();
                    BaseApplianceManager.InternalMsgEmitter.emit('addUndoTicker', undoTickerId, viewId);
                    const workId = this.collector?.isOwn(key) ? this.collector?.getLocalId(key) : key;
                    const opt = {...value.opt, locked} as ImageOptions;
                    this.taskBatchData.add({
                        msgType: EPostMessageType.FullWork,
                        dataType: EDataType.Local,
                        toolsType: EToolsKey.Image,
                        workId,
                        opt,
                        viewId,
                        willRefresh: true,
                        willSyncService: true
                    });
                    this.runAnimation();
                    return;
                }
            }
        }
    }
    completeImageUpload(uuid: string, src: string): void {
        const mainView = this.viewContainerManager.mainView;
        const viewId = mainView?.id;
        const focusScenePath = mainView?.focusScenePath;
        if (viewId && focusScenePath) {
            const imageInfo = this.tmpImageConfigMap.get(uuid);
            if (imageInfo) {
                imageInfo.src = src;
                this.insertImage(imageInfo);
                this.tmpImageConfigMap.delete(uuid);
            }
            return;
        }
    }
    getImagesInformation(scenePath: string): ImageInformation[] {
        const result:ImageInformation[] = [];
        if (this.collector){
            const storage = this.collector.getScenePathData(scenePath);
            if (!storage) {
                return result;
            }
            for (const value of Object.values(storage)) {
                if(value && value.toolsType === EToolsKey.Image){
                    const opt = value.opt as ImageOptions;
                    result.push({
                        uuid: opt.uuid,
                        centerX: opt.centerX,
                        centerY: opt.centerY,
                        width: opt.width,
                        height: opt.height,
                        locked: opt.locked,
                        uniformScale: opt.uniformScale,
                        crossOrigin: opt.crossOrigin
                    });
                }
            }
        }
        return result;
    }
    setShapeSelectorByWorkId(workId:string,viewId:string){
        this.taskBatchData.add({
            workId: Storage_Selector_key,
            selectIds: [workId],
            msgType: EPostMessageType.Select,
            dataType: EDataType.Local,
            viewId,
            willSyncService: true
        })
        this.runAnimation();
    }
    blurSelector(viewId: string, scenePath:string) {
        this.taskBatchData.add({
            workId: Storage_Selector_key,
            selectIds: [],
            msgType: EPostMessageType.Select,
            dataType: EDataType.Service,
            viewId,
            scenePath
        })
        this.runAnimation();
    }
    consoleWorkerInfo(){
        this.taskBatchData.add({
            msgType: EPostMessageType.Console,
            dataType: EDataType.Local,
            isRunSubWork: true,
            viewId:''
        })
        this.consume();
    }
}