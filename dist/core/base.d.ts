import { BaseCollector } from "../collector";
import { BaseCollectorReducerAction, DiffOne } from "../collector/types";
import { EDataType } from "./enum";
import { BaseShapeOptions, BaseShapeTool } from "./tools";
import { BaseNodeMapItem, IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IMainMessageRenderData, IOffscreenCanvasOptionType, IServiceWorkItem, IUpdateNodeOpt, IWorkerMessage, IworkId } from "./types";
import { Group, Scene } from "spritejs";
import { BezierPencilDisplayer } from "../plugin";
export declare abstract class MainEngine {
    /** 设备像素比 */
    protected abstract dpr: number;
    /** 数据收集器 */
    protected collector: BaseCollector;
    /** view容器 */
    protected displayer: BezierPencilDisplayer;
    /** 主线程还是工作线程 */
    /** 主线程和工作线程通信机 */
    protected abstract msgEmitter: Worker;
    /** 离屏canvas配置数据 */
    protected abstract offscreenCanvasOpt: IOffscreenCanvasOptionType;
    protected abstract layerOpt: ILayerOptionType;
    /** 相机角度数据 */
    protected abstract cameraOpt: ICameraOpt;
    /** 工作线程引擎, 可以在主线程上也可以是worker线程上 */
    protected abstract threadEngine?: WorkThreadEngine;
    /** 本地原始点数据批任务数据池 */
    protected abstract localPointsBatchData: number[];
    /** 事件任务处理批量池 */
    protected abstract taskBatchData: Map<unknown, IWorkerMessage>;
    /** 当前选中的工具配置数据 */
    protected abstract currentToolsData: IActiveToolsDataType;
    /** 当前工作任务数据 */
    protected abstract currentLocalWorkData: IActiveWorkDataType;
    /** 临时手动gc数据池 */
    dustbin: Set<unknown>;
    protected constructor(displayer: BezierPencilDisplayer, collector: BaseCollector);
    /** 设置当前选中的工具配置数据 */
    protected setCurrentToolsData(currentToolsData: IActiveToolsDataType): void;
    /** 设置当前绘制任务数据 */
    protected setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType): void;
    /** 设置相机参数 */
    protected setCameraOpt(cameraOpt: ICameraOpt): void;
    /** 获取当前绘制任务id */
    protected getWorkId(): IworkId | undefined;
    /** 用于接收服务端同步的数据 */
    abstract onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>): void;
    /** 消费批处理池数据 */
    abstract consume(): void;
    /** 禁止使用 */
    abstract unabled(): void;
    /** 可以使用 */
    abstract abled(): void;
    /** 销毁 */
    abstract destroy(): void;
    /** 服务端同步数据初始化 */
    abstract initSyncData(callBack: (key: string, value: BaseCollectorReducerAction | undefined) => void): void;
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: Map<unknown, IWorkerMessage>): void;
    /** 主线程和工作线程通信,接收 */
    abstract on(callBack: (e: IMainMessageRenderData) => void): void;
    /** 更新已有node配置 */
    abstract updateNode(workId: IworkId, updateNodeOpt: IUpdateNodeOpt): void;
}
export declare abstract class WorkThreadEngine {
    /** 设备像素比 */
    protected abstract dpr: number;
    protected abstract scene: Scene;
    protected abstract drawLayer: Group;
    protected abstract fullLayer: Group;
    protected abstract cameraOpt?: Pick<ICameraOpt, 'centerX' | 'centerY' | 'scale'>;
    abstract getOffscreen(isFullWork: boolean): OffscreenCanvas;
    abstract setToolsOpt(opt: IActiveToolsDataType): void;
    abstract setWorkOpt(opt: IActiveWorkDataType): void;
    protected updateScene(offscreenCanvasOpt: IOffscreenCanvasOptionType): void;
    protected updateLayer(layerOpt: Required<Pick<ILayerOptionType, 'width' | 'height'>>): void;
    protected createScene(opt: IOffscreenCanvasOptionType): Scene;
    protected createLayer(opt: Required<Pick<ILayerOptionType, 'width' | 'height'>> & Omit<ILayerOptionType, 'width' | 'height'>): Group;
    protected getNodes(workId: number | string): import("spritejs").Node[];
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: IBatchMainMessage): void;
    /** 主线程和工作线程通信,接收 */
    protected abstract on(callBack: (e: IterableIterator<IWorkerMessage>, isFullRender?: boolean) => void): void;
    protected abstract consumeDraw(type: EDataType, data: IWorkerMessage): void;
    protected abstract consumeDrawAll(type: EDataType, data: IWorkerMessage): void;
    protected abstract consumeFull(type: EDataType, data: IWorkerMessage): void;
}
export declare abstract class SubLocalWork {
    fullLayer: Group;
    drawLayer?: Group;
    protected tmpWorkShapeNode?: BaseShapeTool;
    protected tmpOpt?: IActiveToolsDataType;
    protected abstract workShapes: Map<IworkId, BaseShapeTool>;
    curNodeMap: Map<string, BaseNodeMapItem>;
    protected effectWorkId?: number;
    constructor(fullLayer: Group, drawLayer?: Group);
    abstract _post: (msg: IBatchMainMessage) => void;
    abstract consumeDraw(data: IWorkerMessage): IMainMessage | undefined;
    abstract consumeDrawAll(data: IWorkerMessage): IMainMessage | undefined;
    getWorkShape(workId: IworkId): BaseShapeTool | undefined;
    getTmpWorkShapeNode(): BaseShapeTool | undefined;
    setTmpWorkId(workId: IworkId | undefined): void;
    setTmpWorkOptions(opt: BaseShapeOptions): void;
    setWorkOptions(workId: IworkId, opt: BaseShapeOptions): void;
    createWorkShapeNode(opt: IActiveToolsDataType): BaseShapeTool | undefined;
    setToolsOpt(opt: IActiveToolsDataType): void;
    abstract blurSelector(): void;
    clearWorkShapeNodeCache(workId: IworkId): void;
    clearAllWorkShapesCache(): void;
    runEffectWork(): void;
    computNodeMap(): void;
    rerRenderSelector(): void;
}
export declare abstract class SubServiceWork {
    protected abstract workShapes: Map<string, IServiceWorkItem>;
    protected abstract animationId?: number;
    drawLayer: Group;
    fullLayer: Group;
    constructor(fullLayer: Group, drawLayer: Group);
    abstract consumeDraw(data: IWorkerMessage): void;
    abstract consumeFull(data: IWorkerMessage): void;
    abstract runSelectWork(data: IWorkerMessage): void;
}
