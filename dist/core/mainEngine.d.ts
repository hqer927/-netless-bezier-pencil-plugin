import EventEmitter2 from "eventemitter2";
import { BaseCollectorReducerAction, DiffOne } from "../collector";
import { BaseTeachingAidsManager } from "../plugin/baseTeachingAidsManager";
import { IActiveToolsDataType, IActiveWorkDataType, ICameraOpt, IRectType, IUpdateNodeOpt, IWorkerMessage, IqueryTask, IworkId, ViewWorkerOptions } from "./types";
import { BaseSubWorkModuleProps } from "../plugin/types";
import type { ImageInformation } from "../plugin/types";
import { MethodBuilderMain } from "./msgEvent";
import { EPostMessageType, EvevtWorkState } from "./enum";
export declare abstract class MasterController {
    /** 异步同步时间间隔 */
    maxLastSyncTime: number;
    /** 插件管理器 */
    readonly abstract control: BaseTeachingAidsManager;
    readonly abstract internalMsgEmitter: EventEmitter2;
    /** worker线程管理器 */
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
    setCurrentToolsData(currentToolsData: IActiveToolsDataType): void;
    /** 设置当前绘制任务数据 */
    protected setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType): void;
    /** 获取当前激活的工作任务id */
    protected getWorkId(): IworkId | undefined;
    /** 获取当前work的工作状态 */
    getWorkState(): EvevtWorkState;
    /** 用于接收服务端同步的数据 */
    abstract onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>): void;
    /** 消费批处理池数据 */
    abstract consume(): void;
    /** 运行异步动画逻辑 */
    abstract runAnimation(): void;
    /** 禁止使用 */
    abstract unabled(): void;
    /** 禁止写入 */
    abstract unWritable(): void;
    /** 可以使用 */
    abstract abled(): void;
    /** 销毁 */
    abstract destroy(): void;
    /** 服务端拉取数据初始化 */
    abstract pullServiceData(viewId: string, scenePath: string): void;
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: Set<IWorkerMessage>): void;
    /** 主线程和工作线程通信,接收 */
    abstract on(): void;
    /** 更新已有node配置 */
    abstract updateNode(workId: IworkId, updateNodeOpt: IUpdateNodeOpt, viewId: string, scenePath: string): void;
    /** 清空指定的view场景路径下的所有数据 */
    abstract clearViewScenePath(viewId: string, justLocal?: boolean): Promise<void>;
    /** 更新指定view场景路径下的相机参数 */
    abstract updateCamera(viewId: string, cameraOpt: ICameraOpt): void;
    /**  创建一个新的viewWorker */
    abstract createViewWorker(viewId: string, options: ViewWorkerOptions): void;
    /** 本地发送cursor事件 */
    abstract sendCursorEvent(point: [number | undefined, number | undefined], viewId: string): void;
    /** 获取某个场景路径下的包围盒 */
    abstract getBoundingRect(scenePath: string): Promise<IRectType> | undefined;
    abstract getSnapshot(scenePath: string, width?: number, height?: number, camera?: Pick<ICameraOpt, "centerX" | "centerY" | "scale">): Promise<ImageBitmap> | undefined;
    /** 根据查询条件查询事件任务处理批量池中任务 */
    abstract queryTaskBatchData(query: IqueryTask): IWorkerMessage[];
    abstract insertImage(imageInfo: ImageInformation): void;
    abstract lockImage(uuid: string, locked: boolean): void;
    abstract completeImageUpload(uuid: string, src: string): void;
    abstract getImagesInformation(scenePath: string): ImageInformation[];
}
export declare class MasterControlForWorker extends MasterController {
    isActive: boolean;
    currentToolsData?: IActiveToolsDataType;
    protected currentLocalWorkData: IActiveWorkDataType;
    control: BaseTeachingAidsManager;
    internalMsgEmitter: EventEmitter2;
    protected localPointsBatchData: number[];
    taskBatchData: Set<IWorkerMessage>;
    protected dpr: number;
    protected fullWorker: Worker;
    protected subWorker: Worker;
    methodBuilder?: MethodBuilderMain;
    private zIndexNodeMethod?;
    /** master\fullwoker\subworker 三者高频绘制时队列化参数 */
    private subWorkerDrawCount;
    private wokerDrawCount;
    private maxDrawCount;
    private cacheDrawCount;
    private reRenders;
    /** end */
    /** 是否任务队列化参数 */
    private tasksqueue;
    private useTasksqueue;
    private useTasksClockId?;
    private mianTasksqueueCount?;
    private workerTasksqueueCount?;
    /** end */
    private snapshotMap;
    private boundingRectMap;
    private clearAllResolve?;
    private localEventTimerId?;
    private undoTickerId?;
    private animationId;
    constructor(props: BaseSubWorkModuleProps);
    private get viewContainerManager();
    private get collector();
    private get isRunSubWork();
    private get isCanDrawWork();
    private get isUseZIndex();
    private get isCanRecordUndoRedo();
    private get isCanSentCursor();
    init(): void;
    on(): void;
    private collectorSyncData;
    private collectorAsyncData;
    setCurrentToolsData(currentToolsData: IActiveToolsDataType): void;
    setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType, msgType?: EPostMessageType): void;
    createViewWorker(viewId: string, options: ViewWorkerOptions): void;
    destroyViewWorker(viewId: string, isLocal?: boolean): void;
    onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>): void;
    pullServiceData(viewId: string, scenePath: string): void;
    runAnimation(): void;
    consume(): void;
    unWritable(): void;
    unabled(): void;
    abled(): void;
    post(msg: Set<IWorkerMessage>): void;
    destroy(): void;
    updateNode(workId: IworkId, updateNodeOpt: IUpdateNodeOpt, viewId: string, scenePath: string): void;
    updateCamera(viewId: string, cameraOpt: ICameraOpt): void;
    private consumeQueue;
    clearViewScenePath(viewId: string, justLocal?: boolean | undefined): Promise<void>;
    private internalMsgEmitterListener;
    originalEventLintener(workState: EvevtWorkState, point: [number, number], viewId: string): void;
    private setZIndex;
    clearLocalPointsBatchData(): void;
    private onLocalEventEnd;
    private onLocalEventDoing;
    private onLocalEventStart;
    private pushPoint;
    sendCursorEvent(p: [number | undefined, number | undefined], viewId: string): void;
    getBoundingRect(scenePath: string): Promise<IRectType> | undefined;
    getSnapshot(scenePath: string, width?: number, height?: number, camera?: Pick<ICameraOpt, "centerX" | "centerY" | "scale">): Promise<ImageBitmap> | undefined;
    queryTaskBatchData(query: IqueryTask): IWorkerMessage[];
    insertImage(imageInfo: ImageInformation): void;
    lockImage(uuid: string, locked: boolean): void;
    completeImageUpload(uuid: string, src: string): void;
    getImagesInformation(scenePath: string): ImageInformation[];
    setShapeSelectorByWorkId(workId: string, viewId: string, undoTickerId?: number): void;
    blurSelector(viewId: string, scenePath: string, undoTickerId?: number): void;
}
