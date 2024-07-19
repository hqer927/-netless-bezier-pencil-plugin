import EventEmitter2 from "eventemitter2";
import { BaseCollectorReducerAction, DiffOneData } from "../collector";
import { BaseApplianceManager } from "../plugin/baseApplianceManager";
import { IActiveToolsDataType, IActiveWorkDataType, ICameraOpt, IMainMessage, IRectType, IUpdateNodeOpt, IWorkerMessage, IqueryTask, IworkId, ViewWorkerOptions } from "./types";
import { BaseSubWorkModuleProps } from "../plugin/types";
import type { ImageInformation } from "../plugin/types";
import { MethodBuilderMain } from "./msgEvent";
import { EvevtWorkState } from "./enum";
import { BaseShapeOptions } from "./tools";
export declare abstract class MasterController {
    /** 异步同步时间间隔 */
    maxLastSyncTime: number;
    /** 插件管理器 */
    readonly abstract control: BaseApplianceManager;
    readonly abstract internalMsgEmitter: EventEmitter2;
    /** worker线程管理器 */
    /** 本地原始点数据批任务数据池 */
    protected abstract localPointsBatchData: Map<IworkId, {
        state: EvevtWorkState;
        points: number[];
        isFullWork: boolean;
        viewId: string;
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
    setCurrentToolsData(currentToolsData: IActiveToolsDataType): void;
    getCurrentToolsData(): IActiveToolsDataType | undefined;
    /** 设置当前绘制任务数据 */
    protected setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType): void;
    /** 获取当前激活的工作任务id */
    protected getWorkId(): IworkId | undefined;
    /** 获取当前work的工作状态 */
    getWorkState(): EvevtWorkState;
    /** 用于接收服务端同步的数据 */
    abstract onServiceDerive(key: string, data: DiffOneData<BaseCollectorReducerAction | undefined>): void;
    /** 消费批处理池数据 */
    abstract consume(): void;
    /** 运行异步动画逻辑 */
    abstract runAnimation(): void;
    /** 禁止写入 */
    abstract unWritable(): void;
    /** 可以使用 */
    abstract abled(): void;
    /** 当前状态是否可以写入 */
    abstract isAbled(): boolean;
    /** 销毁 */
    abstract destroy(): void;
    /** 服务端拉取数据初始化 */
    abstract pullServiceData(viewId: string, scenePath: string, options: {
        isAsync?: boolean;
        useAnimation?: boolean;
    }): void;
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
    /** 移除正在绘制的流程 */
    abstract removeDrawingWork(viewId: string): void;
    /** 修正绘制异常任务 */
    abstract checkDrawingWork(viewId: string): void;
}
export declare class MasterControlForWorker extends MasterController {
    isActive: boolean;
    currentToolsData?: IActiveToolsDataType;
    protected currentLocalWorkData: IActiveWorkDataType;
    control: BaseApplianceManager;
    internalMsgEmitter: EventEmitter2;
    taskBatchData: Set<IWorkerMessage>;
    protected fullWorker: Worker;
    protected subWorker: Worker;
    private fullWorkerUrl;
    private subWorkerUrl;
    methodBuilder?: MethodBuilderMain;
    private zIndexNodeMethod?;
    /** master\fullwoker\subworker 三者高频绘制时队列化参数 */
    private subWorkerDrawCount;
    private wokerDrawCount;
    private maxDrawCount;
    private reRenders;
    private localWorkViewId?;
    protected localPointsBatchData: Map<IworkId, {
        state: EvevtWorkState;
        points: number[];
        /** 完整的绘制 */
        isFullWork: boolean;
        viewId: string;
        opt?: BaseShapeOptions;
    }>;
    /** end */
    /** 是否任务队列化参数 */
    private tasksqueue;
    private useTasksqueue;
    private useTasksClockId?;
    private mainTasksqueueCount?;
    private workerTasksqueueCount?;
    /** end */
    private snapshotMap;
    private boundingRectMap;
    private clearAllResolveMap;
    private delayWorkStateToDoneResolve?;
    private animationId;
    private tmpImageConfigMap;
    private mainThread?;
    private willSelectorWorkId?;
    private isLockSentEventCursor;
    constructor(props: BaseSubWorkModuleProps);
    destroy(): void;
    private get viewContainerManager();
    private get collector();
    private get isRunSubWork();
    private get isCanDrawWork();
    private get isUseZIndex();
    private get isCanRecordUndoRedo();
    private get isCanSentCursor();
    private get isCanStartEventConsum();
    init(): Promise<void>;
    on(): Promise<void>;
    private clearReRenders;
    get isBusy(): boolean;
    getLockSentEventCursor(): boolean;
    setLockSentEventCursor(bol: boolean): void;
    getTasksqueueState(): EvevtWorkState.Doing | EvevtWorkState.Done;
    setMaxDrawCount(num: number): void;
    setWorkerTasksqueueCount(num: number): void;
    collectorSyncData(sp: IMainMessage[]): void;
    private collectorAsyncData;
    private onLocalEventEnd;
    private onLocalEventDoing;
    private onLocalEventStart;
    private setLocalPointIsFullWork;
    private pushLocalPoint;
    private deleteLocalPoint;
    private getLocalPointInfo;
    getLocalPointsInfo(): Map<IworkId, {
        state: EvevtWorkState;
        points: number[];
        /** 完整的绘制 */
        isFullWork: boolean;
        viewId: string;
        opt?: BaseShapeOptions | undefined;
    }>;
    private correctStorage;
    originalEventLintener(workState: EvevtWorkState, point: [number, number], viewId: string): Promise<void>;
    getLocalWorkViewId(): string | undefined;
    setLocalWorkViewId(viewId?: string): void;
    setCurrentToolsData(currentToolsData: IActiveToolsDataType): void;
    private prepareOnceWork;
    createViewWorker(viewId: string, options: ViewWorkerOptions): void;
    destroyViewWorker(viewId: string, isLocal?: boolean): void;
    onServiceDerive(key: string, data: DiffOneData<BaseCollectorReducerAction | undefined>): void;
    pullServiceData(viewId: string, scenePath: string, options?: {
        isAsync?: boolean;
        useAnimation?: boolean;
    }): void;
    runAnimation(): void;
    consume(): void;
    unWritable(): void;
    abled(): void;
    isAbled(): boolean;
    post(msg: Set<IWorkerMessage>): void;
    updateNode(workId: IworkId, updateNodeOpt: IUpdateNodeOpt, viewId: string, scenePath: string): void;
    destroyTaskQueue(): void;
    updateCamera(viewId: string, cameraOpt: ICameraOpt): void;
    private updateCameraDone;
    private consumeQueue;
    clearViewScenePath(viewId: string, justLocal?: boolean | undefined): Promise<void>;
    private internalMsgEmitterListener;
    private setZIndex;
    checkDrawingWork(vId: string): void;
    removeDrawingWork(vId: string): void;
    hoverCursor(point: [number, number], viewId: string): void;
    blurCursor(viewId: string): void;
    sendCursorEvent(p: [number | undefined, number | undefined], viewId: string): void;
    getBoundingRect(scenePath: string): Promise<IRectType> | undefined;
    getSnapshot(scenePath: string, width?: number, height?: number, camera?: Pick<ICameraOpt, "centerX" | "centerY" | "scale">): Promise<ImageBitmap> | undefined;
    queryTaskBatchData(query: IqueryTask): IWorkerMessage[];
    insertImage(imageInfo: ImageInformation): void;
    lockImage(uuid: string, locked: boolean): void;
    completeImageUpload(uuid: string, src: string): void;
    getImagesInformation(scenePath: string): ImageInformation[];
    setShapeSelectorByWorkId(workId: string, viewId: string): void;
    blurSelector(viewId: string, scenePath: string): void;
    consoleWorkerInfo(): void;
}
