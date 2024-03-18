import { BaseCollectorReducerAction, Collector, DiffOne } from "../collector";
import { TeachingAidsDisplayer } from "../plugin";
import { WorkThreadEngine } from "./threadEngine";
import { IActiveToolsDataType, IActiveWorkDataType, ICameraOpt, ILayerOptionType, IMainMessageRenderData, IOffscreenCanvasOptionType, IUpdateNodeOpt, IWorkerMessage, IworkId } from "./types";

export abstract class MainEngine {
    /** 设备像素比 */
    protected abstract dpr: number;
    /** 数据收集器 */
    protected collector: Collector;
    /** view容器 */
    public displayer: TeachingAidsDisplayer;
    /** 主线程还是工作线程 */
    // protected threadType: EThreadType;
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
    public dustbin: Set<unknown> = new Set();

    protected constructor(displayer: TeachingAidsDisplayer, collector: Collector) {
        this.displayer = displayer;
        this.collector = collector;
    }
    /** 设置当前选中的工具配置数据 */
    protected setCurrentToolsData(currentToolsData: IActiveToolsDataType) {
        this.currentToolsData = currentToolsData;
    }
    /** 设置当前绘制任务数据 */
    protected setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType) {
        this.currentLocalWorkData = currentLocalWorkData;
    }
    /** 设置相机参数 */
    protected setCameraOpt(cameraOpt: ICameraOpt) {
        this.cameraOpt = cameraOpt;
    }
    /** 获取当前绘制任务id */
    protected getWorkId():IworkId | undefined {
       return this.currentLocalWorkData.workId;
    }
    /** 用于接收服务端同步的数据 */
    abstract onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>, relevantId?:string):void;
    /** 消费批处理池数据 */
    abstract consume():void;
    /** 禁止使用 */
    abstract unabled():void;
    /** 可以使用 */
    abstract abled():void;
    /** 销毁 */
    abstract destroy():void;
    /** 服务端同步数据初始化 */
    abstract initSyncData(callBack:(key:string,value:BaseCollectorReducerAction | undefined) => void):void;
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: Map<unknown, IWorkerMessage>):void;
    /** 主线程和工作线程通信,接收 */
    abstract on(callBack:(e:IMainMessageRenderData)=>void):void;
    /** 更新已有node配置 */
    abstract updateNode(workId:IworkId, updateNodeOpt:IUpdateNodeOpt):void;
}