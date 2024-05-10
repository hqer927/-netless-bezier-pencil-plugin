/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import EventEmitter2 from "eventemitter2";
import { BaseCollectorReducerAction, DiffOne, Storage_Selector_key, Storage_ViewId_ALL } from "../collector";
import { BaseTeachingAidsManager } from "../plugin/baseTeachingAidsManager";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, IMainMessage, IMainMessageRenderData, IRectType, IUpdateNodeOpt, IWorkerMessage, IqueryTask, IworkId, ViewWorkerOptions } from "./types";
import { BaseSubWorkModuleProps, EmitEventType, InternalMsgEmitterType } from "../plugin/types";
import FullWorker from './worker/fullWorker.ts?worker&inline';
import SubWorker from './worker/subWorker.ts?worker&inline';
import { MethodBuilderMain, ZIndexNodeMethod } from "./msgEvent";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "./enum";
import { ShowFloatBarMsgValue } from "../displayer/types";
import { requestAsyncCallBack } from "./utils";
import { ETextEditorType, TextOptions } from "../component/textEditor/types";
import cloneDeep from "lodash/cloneDeep";
import { BaseShapeOptions, ImageOptions } from "./tools";
import { ImageInformation } from "white-web-sdk";
import isBoolean from "lodash/isBoolean";

export abstract class MasterController {
    /** 异步同步时间间隔 */
    maxLastSyncTime = 500;
    /** 插件管理器 */
    readonly abstract control: BaseTeachingAidsManager;
    readonly abstract internalMsgEmitter: EventEmitter2;
    /** worker线程管理器 */
    // protected abstract threadEngine?: WorkerManager;
    /** 本地原始点数据批任务数据池 */
    protected abstract localPointsBatchData: number[];
    /** 事件任务处理批量池 */
    abstract taskBatchData: Set<IWorkerMessage>;
    /** 设备像素比 */
    protected abstract dpr: number;
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
    /** 设置当前绘制任务数据 */
    protected setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType) {
        this.currentLocalWorkData = currentLocalWorkData;
    }
    /** 获取当前激活的工作任务id */
    protected getWorkId():IworkId | undefined {
       return this.currentLocalWorkData.workId;
    }
    /** 用于接收服务端同步的数据 */
    abstract onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>):void;
    /** 消费批处理池数据 */
    abstract consume():void;
    /** 运行异步动画逻辑 */
    abstract runAnimation():void;
    /** 禁止使用 */
    abstract unabled():void;
    /** 可以使用 */
    abstract abled():void;
    /** 销毁 */
    abstract destroy():void;
    /** 服务端拉取数据初始化 */
    abstract pullServiceData(viewId:string, scenePath:string):void;
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
}
export class MasterControlForWorker extends MasterController{
    isActive:boolean = false;
    currentToolsData?: IActiveToolsDataType;
    protected currentLocalWorkData: IActiveWorkDataType;
    control: BaseTeachingAidsManager;
    internalMsgEmitter: EventEmitter2;
    // protected threadEngine?: WorkerManager | undefined;
    protected localPointsBatchData: number[] = [];
    taskBatchData: Set<IWorkerMessage> = new Set();
    protected dpr: number = 1;
    protected fullWorker!: Worker;
    protected subWorker!: Worker;
    methodBuilder?: MethodBuilderMain;
    private zIndexNodeMethod?: ZIndexNodeMethod;
    /** master\fullwoker\subworker 三者高频绘制时队列化参数 */
    private subWorkerDrawCount: number = 0;
    private wokerDrawCount: number = 0;
    private maxDrawCount: number = 0;
    private cacheDrawCount: number = 0;
    private reRenders: Array<IMainMessageRenderData> = [];
    /** end */
    /** 是否任务队列化参数 */
    private tasksqueue:Map<string,IWorkerMessage> = new Map();
    private useTasksqueue: boolean = false;
    private useTasksClockId?: number;
    private mianTasksqueueCount?: number;
    private workerTasksqueueCount?: number;
    /** end */
    private snapshotMap:Map<string, (value: ImageBitmap) => void> = new Map();
    private boundingRectMap:Map<string, (value: IRectType) => void> = new Map();
    private clearAllResolve?: (viewId:string) => void;
    private localEventTimerId?: number;
    private undoTickerId?: number;
    private animationId: number|undefined;
    constructor(props:BaseSubWorkModuleProps){
        super();
        const {control, internalMsgEmitter} = props;
        this.control = control;
        this.maxLastSyncTime = (this.control.pluginOptions?.syncOpt?.interval || this.maxLastSyncTime ) * 0.5;
        this.internalMsgEmitter = internalMsgEmitter;
        this.currentLocalWorkData = {workState:EvevtWorkState.Pending};
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
    init(){
        this.on();
        this.internalMsgEmitterListener();
        this.isActive = true;
    }
    on(): void {
        this.fullWorker = new FullWorker();
        this.subWorker = new SubWorker();
        this.fullWorker.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, sp, drawCount, workerTasksqueueCount} = e.data;
                if (workerTasksqueueCount) {
                    this.workerTasksqueueCount = workerTasksqueueCount;
                }
                // console.log('selector - render', render, sp, workerTasksqueueCount)
                // if (render?.length) {
                //     console.log('selector - fullWorker - render', render.map((r)=>(r.isFullWork?({r:r.rect, w: r.imageBitmap?.width, h: r.imageBitmap?.height, node:r}):null)))
                // }
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
                    }
                    if (render?.length) {
                        this.viewContainerManager.render(render);
                        if (this.wokerDrawCount < this.subWorkerDrawCount) {
                            this.reRenders.forEach(r=>{
                                r.isUnClose = false;
                            })
                            this.viewContainerManager.render(this.reRenders);
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
                            render.forEach(r=>r.isUnClose=true)
                            this.reRenders.push(...render)
                        }
                        if (this.wokerDrawCount < Infinity) {
                            this.viewContainerManager.render(render);
                        }
                    }
                }
            }
        }
    }
    private collectorSyncData(sp: IMainMessage[]){
        let isHasOther = false;
        for (const data of sp) {
            const { type, selectIds, opt, selectRect, strokeColor, fillColor, willSyncService, isSync, 
                undoTickerId, imageBitmap, canvasHeight, canvasWidth, rect, op, canTextEdit, points,
                selectorColor, canRotate, scaleType, textOpt, toolsType, workId, viewId, scenePath, dataType, 
                canLock, isLocked, shapeOpt, toolsTypes } = data;
                if (!viewId) {
                    console.error('collectorSyncData', data)
                    return ;
                }
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
                        // console.log('shapeOpt', shapeOpt)
                    }
                    if (value && toolsTypes) {
                        value.toolsTypes = toolsTypes;
                    }
                    viewId && this.viewContainerManager.showFloatBar(viewId, !!value, value);
                    if (willSyncService) {
                        const scenePath = this.viewContainerManager.getCurScenePath(viewId);
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
                    viewId && this.viewContainerManager.showFloatBar(viewId, false);
                    viewId && this.clearAllResolve && this.clearAllResolve(viewId);
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
            if (!isHasOther && undoTickerId) {
                this.internalMsgEmitter.emit('undoTickerEnd', undoTickerId, viewId);
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
            const {type, op, workId, index, removeIds, ops, opt, updateNodeOpt, toolsType, isSync, undoTickerId, viewId} = data;
            if (!viewId) {
                console.error('collectorAsyncData', data)
                return ;
            }
            switch (type) {
                case EPostMessageType.DrawWork: {
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    this.collector?.dispatch({
                        type,
                        op,
                        workId,
                        index,
                        isSync,
                        viewId,
                        scenePath
                    })
                    break
                } 
                case EPostMessageType.FullWork:{
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
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
                    break;
                }
                case EPostMessageType.UpdateNode:{
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    this.collector?.dispatch({type, updateNodeOpt, workId, opt, ops, op, isSync, viewId, scenePath})
                    break;
                }
                case EPostMessageType.RemoveNode:{
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    removeIds && this.control.textEditorManager.deleteBatch(removeIds, false, false);
                    this.collector?.dispatch({type, removeIds, isSync, viewId, scenePath});
                    break;
                }
                default:
                    break;
            }
            if (undoTickerId) {
                this.internalMsgEmitter.emit('undoTickerEnd', undoTickerId, viewId);
            }
        }
    }
    setCurrentToolsData(currentToolsData: IActiveToolsDataType) {
        const toolsType = currentToolsData.toolsType;
        const isChangeToolsType = this.currentToolsData?.toolsType !== currentToolsData.toolsType;
        super.setCurrentToolsData(currentToolsData);
        const views = this.viewContainerManager?.getAllViews();
        if(isChangeToolsType) {
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
    setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType, msgType: EPostMessageType = EPostMessageType.None) {
        super.setCurrentLocalWorkData(currentLocalWorkData);
        const {workState, workId, toolsOpt} = currentLocalWorkData
        if(workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (msgType !== EPostMessageType.None && this.viewContainerManager.focuedView) {
            const {id} = this.viewContainerManager.focuedView;
            if (id) {
                const toolsType = this.currentToolsData?.toolsType;
                this.taskBatchData.add({
                    msgType,
                    workId,
                    toolsType: toolsType,
                    opt: {...this.currentToolsData?.toolsOpt, ...toolsOpt, syncUnitTime: this.maxLastSyncTime},
                    dataType: EDataType.Local,
                    isRunSubWork: this.isRunSubWork,
                    viewId: id
                })
                this.runAnimation();
            }
        }
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
        this.runAnimation();
    }
    destroyViewWorker(viewId: string, isLocal:boolean= false):void {
        this.taskBatchData.add({
            msgType: EPostMessageType.Destroy,
            dataType: EDataType.Local,
            viewId,
            isRunSubWork: true,
        });
        this.runAnimation();
        if (!isLocal) {
            this.collector?.dispatch({
                type: EPostMessageType.Clear,
                viewId
            })
        }
    }
    onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>): void {
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
        if (msgType && workId) {
            const d: IWorkerMessage & Pick<IWorkerMessage, 'workId'> = msg as IWorkerMessage;
            d.workId = this.collector?.isOwn(workId) ? this.collector?.getLocalId(workId) : workId;
            d.msgType = msgType;
            d.dataType = EDataType.Service;
            d.viewId = viewId;
            d.scenePath = scenePath;
            if (d.selectIds) {
                d.selectIds = d.selectIds.map(id=>{
                    return this.collector?.isOwn(id) ? this.collector?.getLocalId(id) : id;
                })
            }
            if ((d && d.toolsType === EToolsKey.Text) || oldValue?.toolsType === EToolsKey.Text) {
                console.log('onServiceDerive', d, workId, this.collector?.uid)
                this.control.textEditorManager.onServiceDerive(d);
                return;
            }
            this.taskBatchData.add(d);
        }
        this.runAnimation();
        if (this.zIndexNodeMethod) {
            let minZIndex:number|undefined;
            let maxZIndex:number|undefined;
            if (data.newValue && data.newValue.opt?.zIndex) {
                maxZIndex =  Math.max(maxZIndex || 0, data.newValue.opt.zIndex);
                minZIndex = Math.min(minZIndex || Infinity, data.newValue.opt.zIndex);
            }
            if (maxZIndex) this.zIndexNodeMethod.maxZIndex = maxZIndex;
            if (minZIndex) this.zIndexNodeMethod.minZIndex = minZIndex;
        }
    }
    pullServiceData(viewId: string, scenePath: string): void {
        const store = this.collector?.storage[viewId] && this.collector?.storage[viewId][scenePath] || undefined;
        // console.log('pullServiceData',viewId,  scenePath, store)
        if (store) {
            let minZIndex:number|undefined;
            let maxZIndex:number|undefined;
            const keys = Object.keys(store);
            for (const key of keys) {
                const msgType = store[key]?.type
                if (msgType && key) {
                    const data:IWorkerMessage & Pick<IWorkerMessage, 'workId'> = cloneDeep(store[key]) as IWorkerMessage;
                    data.workId = this.collector?.isOwn(key) ? this.collector?.getLocalId(key) : key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    data.viewId = viewId;
                    data.scenePath = scenePath;
                    data.useAnimation = false;
                    if (data.selectIds) {
                        data.selectIds = data.selectIds.map(id=>{
                            return this.collector?.isOwn(id) ? this.collector?.getLocalId(id) : id;
                        })
                    }
                    if (data.toolsType === EToolsKey.Text) {
                        console.log('onServiceDerive---00', data, viewId, this.collector?.uid)
                        this.control.textEditorManager.onServiceDerive(data)
                        continue;
                    }
                    this.taskBatchData.add(data);
                    if (data.opt?.zIndex) {
                        maxZIndex = Math.max(maxZIndex || 0, data.opt.zIndex);
                        minZIndex = Math.min(minZIndex || Infinity, data.opt.zIndex);
                    }
                }
                this.internalMsgEmitter.emit("excludeIds", keys, viewId);
            }
            this.runAnimation();
            if (this.zIndexNodeMethod) {
                if (maxZIndex) this.zIndexNodeMethod.maxZIndex = maxZIndex;
                if (minZIndex) this.zIndexNodeMethod.minZIndex = minZIndex;
            }
        }
    }
    runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    consume(): void {
        this.animationId = undefined;
        const workState = this.currentLocalWorkData.workState;
        let isAble = false;
        if (!this.localEventTimerId) {
            if (workState !== EvevtWorkState.Pending && this.localPointsBatchData.length) {
                if (this.wokerDrawCount !== Infinity && this.wokerDrawCount <= this.subWorkerDrawCount && this.cacheDrawCount < this.maxDrawCount) {
                    isAble = true;
                }
                if (!this.maxDrawCount) {
                    isAble = true;
                }
                if (isAble && this.viewContainerManager.focuedViewId) {
                    this.taskBatchData.add({
                        op: this.localPointsBatchData.map(n=>n),
                        workState,
                        workId: this.currentLocalWorkData.workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        isRunSubWork: this.isRunSubWork,
                        undoTickerId: workState === EvevtWorkState.Done && this.undoTickerId || undefined,
                        viewId: this.viewContainerManager.focuedViewId,
                        scenePath: this.viewContainerManager.focuedViewId && this.viewContainerManager.getCurScenePath(this.viewContainerManager.focuedViewId)
                    })
                    this.localPointsBatchData.length = 0;
                    this.cacheDrawCount = this.maxDrawCount;
                }
            }
            if (this.taskBatchData.size) {
                this.post(this.taskBatchData);
                for (const value of this.taskBatchData.values()) {
                    if (value.msgType === EPostMessageType.TasksQueue) {
                        this.tasksqueue.clear();
                        // console.log('selector - consume', [...this.tasksqueue.values()])
                        break;
                    }
                }
                // console.log('consume-selector -1', [...this.taskBatchData.values()])
                this.taskBatchData.clear();
                if (this.undoTickerId && workState === EvevtWorkState.Done) {
                    this.undoTickerId = undefined;
                }
            }
        }
        if (this.tasksqueue.size) {
            this.consumeQueue();
        }
        if (this.tasksqueue.size ||
            this.taskBatchData.size ||
            this.localPointsBatchData.length ) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    unabled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Freeze, workId:undefined});
    }
    abled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Pending, workId:undefined});
    }
    post(msg: Set<IWorkerMessage>): void {
        // console.log('post-msg1',cloneDeep(msg))
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
        // console.log('post-sub', cloneDeep(subMsg))
        subMsg.size && this.subWorker.postMessage(subMsg);
    }
    destroy(): void {
        this.unabled();
        this.taskBatchData.clear();
        this.localPointsBatchData.length = 0;
        this.fullWorker.terminate();
        this.subWorker.terminate();
        this.isActive = false;
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
    updateCamera(viewId: string, cameraOpt: ICameraOpt): void {
        if (!this.useTasksqueue) {
            this.useTasksqueue = true;
            this.mianTasksqueueCount = 1;
            this.workerTasksqueueCount = 1;
        }
        if (this.useTasksqueue) {
            // console.log('updateCamera', first)
            this.tasksqueue.set(viewId,{
                msgType: EPostMessageType.UpdateCamera,
                dataType: EDataType.Local,
                cameraOpt,
                isRunSubWork: true,
                viewId
            });
            this.control.textEditorManager.onCameraChange(cameraOpt, viewId)
            this.runAnimation();
            if (this.useTasksClockId) {
                clearTimeout(this.useTasksClockId);
            }
            this.useTasksClockId = setTimeout(() => {
                this.useTasksClockId = undefined;
                this.tasksqueue.clear();
                this.useTasksqueue = false;
                this.mianTasksqueueCount = undefined;
                this.workerTasksqueueCount = undefined;
            }, this.maxLastSyncTime) as unknown as number;
        }
    }
    private consumeQueue(): void {
        if (this.mianTasksqueueCount && this.workerTasksqueueCount) {
            if(this.mianTasksqueueCount === this.workerTasksqueueCount){
                this.mianTasksqueueCount++;
                // console.log('updateCamera', viewId, cameraOpt)
                this.taskBatchData.add({
                    msgType: EPostMessageType.TasksQueue,
                    dataType: EDataType.Local,
                    isRunSubWork: true,
                    mainTasksqueueCount: this.mianTasksqueueCount,
                    tasksqueue: this.tasksqueue,
                    viewId:''
                })
            }   
        }
    }
    async clearViewScenePath(viewId: string, justLocal?: boolean | undefined): Promise<void> {
        this.control.textEditorManager.clear(viewId, justLocal);
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
            this.zIndexNodeMethod.maxZIndex = 0;
            this.zIndexNodeMethod.minZIndex = 0;
        }
        this.localPointsBatchData.length = 0;
        await new Promise<string>((resolve)=>{
            this.clearAllResolve = resolve;
        }).then(()=>{
            this.clearAllResolve = undefined;
        })
    }
    private internalMsgEmitterListener () {
        this.methodBuilder = new MethodBuilderMain([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode, 
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode, 
            EmitEventType.ZIndexActive, EmitEventType.ZIndexNode, EmitEventType.RotateNode,
            EmitEventType.SetFontStyle, EmitEventType.SetPoint, EmitEventType.SetLock,
            EmitEventType.SetShapeOpt
        ]).registerForMainEngine(InternalMsgEmitterType.MainEngine, this.control);
        this.zIndexNodeMethod = this.methodBuilder?.getBuilder(EmitEventType.ZIndexNode) as ZIndexNodeMethod;
    }
    originalEventLintener(workState: EvevtWorkState, point:[number,number],viewId:string) {
        // console.log('consume-selector---originalEventLintener', workState)
        switch (workState) {
            case EvevtWorkState.Start:
                this.onLocalEventStart(point, viewId);
                break;
            case EvevtWorkState.Doing:
                if (viewId === this.viewContainerManager.focuedViewId) {
                    this.onLocalEventDoing(point);
                }
                break;
            case EvevtWorkState.Done:
                if (viewId === this.viewContainerManager.focuedViewId) {
                    this.onLocalEventEnd(point);
                }
                break;
            default:
                break;
        }
    }
    private setZIndex(){
        const opt:BaseShapeOptions | undefined = this.currentToolsData && cloneDeep(this.currentToolsData.toolsOpt);
        if(opt && this.zIndexNodeMethod && this.isUseZIndex ){
            this.zIndexNodeMethod.addMaxLayer();
            opt.zIndex = this.zIndexNodeMethod.maxZIndex;
        }
        return opt;
    }
    private onLocalEventEnd(point: [number, number]): void {
        const workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        if (this.viewContainerManager.focuedView) {
            const {id,focusScenePath, cameraOpt} = this.viewContainerManager.focuedView;
            if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
                const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, id);
                this.pushPoint(_point);
                this.localEventTimerId = setTimeout(()=>{
                    this.localEventTimerId = undefined;
                    this.setCurrentLocalWorkData({...this.currentLocalWorkData, workState: EvevtWorkState.Done});
                    this.runAnimation();
                }, 0) as unknown as number;
                if (this.currentToolsData?.toolsType === EToolsKey.Selector) {
                    this.viewContainerManager.activeFloatBar(id);
                }
            } else if (this.currentToolsData?.toolsType === EToolsKey.Text) {
                const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point,id);
                if (this.localPointsBatchData[0] === _point[0] && this.localPointsBatchData[1] === _point[1]) {
                    const opt = this.currentToolsData.toolsOpt as TextOptions;
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
                        viewId: id,
                        scenePath: focusScenePath
                    }, Date.now());
                }
                this.localPointsBatchData.length = 0;
            }
        }
    }
    private onLocalEventDoing(point: [number, number]): void {
        let workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        const viewId = this.viewContainerManager.focuedViewId;
        if (!viewId) {
            return ;
        }
        if (workState === EvevtWorkState.Start) {
            workState = EvevtWorkState.Doing;
            this.setCurrentLocalWorkData({...this.currentLocalWorkData, workState})
        }
        if (workState === EvevtWorkState.Doing || this.localEventTimerId) {
            const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, viewId);
            this.pushPoint(_point);
            if (!this.localEventTimerId) {
                this.runAnimation();
            }
        } else if (this.currentToolsData?.toolsType === EToolsKey.Selector) {
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
    private onLocalEventStart(point: [number, number], viewId:string): void {
        const {workState} = this.currentLocalWorkData;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        if (!viewId) {
            return ;
        }
        if (this.viewContainerManager.focuedViewId !== viewId) {
            this.viewContainerManager.setFocuedViewId(viewId);
        }
        // console.log('onLocalEventStart ---1', point, viewId, this.viewContainerManager.focuedView?.cameraOpt)
        const _point:[number,number] = this.viewContainerManager.transformToScenePoint(point, viewId);
        // console.log('onLocalEventStart ---3', point, _point, viewId)
        this.pushPoint(_point);
        if (this.currentToolsData?.toolsType === EToolsKey.Text) {
            return ;
        }
        this.control.textEditorManager.checkEmptyTextBlur();
        const workId = this.currentToolsData?.toolsType === EToolsKey.Selector? Storage_Selector_key : Date.now();
        const opt = this.setZIndex();
        this.setCurrentLocalWorkData({
            workId,
            workState: EvevtWorkState.Start,
            toolsOpt: opt
        }, EPostMessageType.CreateWork)
        this.maxDrawCount = 0;
        this.cacheDrawCount = 0;
        this.wokerDrawCount = 0;
        this.subWorkerDrawCount = 0;
        this.reRenders.length = 0;
        if ( this.isCanRecordUndoRedo ) {
            this.undoTickerId = workId as number;
            this.internalMsgEmitter.emit('undoTickerStart', this.undoTickerId, viewId);
        }
        if (this.isCanDrawWork) {
            const scenePath = this.viewContainerManager.getCurScenePath(viewId);
            this.collector?.dispatch({
                type: EPostMessageType.CreateWork,
                workId,
                toolsType: this.currentToolsData?.toolsType,
                opt: this.currentToolsData?.toolsOpt,
                viewId,
                scenePath
            })
            scenePath && this.blurSelector(viewId,scenePath);
        } else if (this.currentToolsData?.toolsType === EToolsKey.Selector) {
            this.viewContainerManager.unActiveFloatBar(viewId);
        }
        this.consume();
    }
    private pushPoint(point: [number, number]): void {
        this.localPointsBatchData.push(point[0],point[1]);
    }
    sendCursorEvent(p:[number|undefined,number|undefined], viewId:string) {
        if (!this.currentLocalWorkData) {
            return;
        }
        if (this.currentLocalWorkData.workState === EvevtWorkState.Freeze || this.currentLocalWorkData.workState === EvevtWorkState.Unwritable ) {
            return;
        }
        if (!this.currentToolsData || !this.isCanSentCursor) {
            return;
        }
        let point:[number|undefined,number|undefined] = [undefined,undefined];
        if ( this.currentToolsData && (this.isCanDrawWork || this.currentToolsData.toolsType === EToolsKey.Text)) {
            if (this.currentLocalWorkData.workState !== EvevtWorkState.Start && this.currentLocalWorkData.workState !== EvevtWorkState.Doing ) {
                point = p;
                // console.log('sendCursorEvent', point)
                this.control.cursor.sendEvent(point,viewId); 
            }
        }
        
    }
    blurSelector(viewId: string, scenePath:string, undoTickerId?: number) {
        if (this.collector?.hasSelector(viewId, scenePath)) {
            this.taskBatchData.add({
                workId: Storage_Selector_key,
                selectIds: [],
                msgType: EPostMessageType.Select,
                dataType: EDataType.Service,
                viewId,
                scenePath,
                undoTickerId
            })
            this.runAnimation();
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
                const view = this.viewContainerManager.getView(viewId) || this.viewContainerManager.focuedView;
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
                    viewId,
                    maxZIndex: this.zIndexNodeMethod?.maxZIndex
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
            this.undoTickerId = Date.now();
            BaseTeachingAidsManager.InternalMsgEmitter.emit('undoTickerStart', this.undoTickerId, viewId);
            const opt = {...imageInfo} as ImageOptions;
            if(this.zIndexNodeMethod && this.isUseZIndex ){
                this.zIndexNodeMethod.addMaxLayer();
                opt.zIndex = this.zIndexNodeMethod.maxZIndex;
            }
            this.taskBatchData.add({
                msgType: EPostMessageType.FullWork,
                dataType: EDataType.Local,
                toolsType: EToolsKey.Image,
                workId: imageInfo.uuid,
                opt,
                viewId,
                undoTickerId: imageInfo.src && this.undoTickerId || undefined,
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
                    BaseTeachingAidsManager.InternalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
                    const workId = this.collector?.isOwn(key) ? this.collector?.getLocalId(key) : key;
                    const opt = {...value.opt, locked} as ImageOptions;
                    this.taskBatchData.add({
                        msgType: EPostMessageType.FullWork,
                        dataType: EDataType.Local,
                        toolsType: EToolsKey.Image,
                        workId,
                        opt,
                        viewId,
                        undoTickerId,
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
        if (viewId && focusScenePath && this.collector){
            const storage = this.collector.getStorageData(viewId, focusScenePath);
            if (!storage) {
                return;
            }
            for (const [key,value] of Object.entries(storage)) {
                if (value && value.toolsType === EToolsKey.Image && (value.opt as ImageOptions).uuid === uuid) {
                    const workId = this.collector?.isOwn(key) ? this.collector?.getLocalId(key) : key;
                    const opt = {...value.opt, src} as ImageOptions;
                    this.taskBatchData.add({
                        msgType: EPostMessageType.FullWork,
                        dataType: EDataType.Local,
                        toolsType: EToolsKey.Image,
                        workId,
                        opt,
                        viewId,
                        undoTickerId: this.undoTickerId,
                        willRefresh: true,
                        willSyncService: true
                    });
                    this.runAnimation();
                    break;
                }
            }
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
}