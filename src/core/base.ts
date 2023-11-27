/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCollector } from "../collector";
import { BaseCollectorReducerAction, DiffOne } from "../collector/types";
import { EDataType, EToolsKey } from "./enum";
import { BaseShapeOptions, BaseShapeTool, EraserOptions, EraserShape, PencilOptions, PencilShape } from "./tools";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IMainMessageRenderData, IOffscreenCanvasOptionType, IServiceWorkItem, IUpdateNodeOpt, IWorkerMessage, IworkId } from "./types";
import { Scene } from "spritejs";
import { LaserPenOptions, LaserPenShape } from "./tools/laserPen";

export abstract class MainEngine {
    /** 设备像素比 */
    protected dpr: number = 1;
    /** 数据收集器 */
    protected collector: BaseCollector;
    /** 用于展示绘制的画布 */
    protected displayCanvas: HTMLCanvasElement;
    /** 用于顶层高频绘制的画布 */
    protected floatCanvas: HTMLCanvasElement;
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
    /** 相机偏移量 */
    protected abstract translate:[number, number];
    /** 本地原始点数据批任务数据池 */
    protected abstract localPointsBatchData: number[];
    /** 事件任务处理批量池 */
    protected abstract taskBatchData: (IWorkerMessage & Pick<IWorkerMessage, 'workId'>)[];
    /** 当前选中的工具配置数据 */
    protected abstract currentToolsData: IActiveToolsDataType;
    /** 当前工作任务数据 */
    protected abstract currentLocalWorkData: IActiveWorkDataType;
    /** 临时手动gc数据池 */
    public dustbin: Set<unknown> = new Set();

    protected constructor(bgCanvas: HTMLCanvasElement, floatCanvas: HTMLCanvasElement, collector:BaseCollector) {
        this.displayCanvas = bgCanvas;
        this.floatCanvas = floatCanvas;
        const ctx = this.displayCanvas.getContext('2d');
        if (ctx) {
            this.dpr = this.getRatioWithContext(ctx);
        }
        this.collector = collector;
    }
    private getRatioWithContext(context: CanvasRenderingContext2D): number {
        const backingStoreRatio = (context as any).webkitBackingStorePixelRatio ||
            (context as any).mozBackingStorePixelRatio ||
            (context as any).msBackingStorePixelRatio ||
            (context as any).oBackingStorePixelRatio ||
            (context as any).backingStorePixelRatio || 1.0;
        return Math.max(1.0, (window.devicePixelRatio || 1.0) / backingStoreRatio);
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
    abstract onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>):void;
    /** 接收本地绘制的数据结束钩子事件 */
    abstract onLocalEventEnd(point:[number,number]):void;
    /** 接收本地绘制的数据进行中钩子事件 */
    abstract onLocalEventDoing(point:[number,number]):void;
    /** 接收本地绘制的数据开始钩子事件 */
    abstract onLocalEventStart(point:[number,number]):void;
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
    abstract post(msg: IWorkerMessage[]):void;
    /** 主线程和工作线程通信,接收 */
    abstract on(callBack:(e:IMainMessageRenderData)=>void):void;
    /** 更新已有node配置 */
    abstract updateNode(workId:IworkId, updateNodeOpt:IUpdateNodeOpt):void;
}
export abstract class WorkThreadEngine {
    /** 设备像素比 */
    protected abstract dpr: number;
    protected abstract scene: spritejs.Scene;
    protected abstract drawLayer: spritejs.Layer;
    protected abstract fullLayer: spritejs.Layer;
    // abstract localWork: SubLocalWork;
    // abstract serviceWork: SubServiceWork;
    protected translate:[number,number] = [0, 0]; 
    protected scale: number = 1;
    /** 临时手动gc数据池 */
    public dustbin: Set<unknown> = new Set();
    abstract getOffscreen(isFullWork:boolean):OffscreenCanvas;
    abstract setToolsOpt(opt: IActiveToolsDataType):void;
    abstract setWorkOpt(opt:IActiveWorkDataType):void;
    protected updateScene(offscreenCanvasOpt:IOffscreenCanvasOptionType) {
        this.scene.attr({...offscreenCanvasOpt, bufferSize: 10000});
    }
    protected updateLayer(layerOpt:ILayerOptionType) {
        this.fullLayer.attr({...layerOpt, bufferSize: 5000});
        this.drawLayer.attr(layerOpt);
    }
    protected createScene(opt:IOffscreenCanvasOptionType) {
        const { width, height } = opt;
        const container = new OffscreenCanvas(width,height);
        return new Scene({
            container,
            displayRatio: this.dpr, 
            depth: false,
            desynchronized:true,
            ...opt,
        });
    }
    protected createLayer(opt:ILayerOptionType) {
        const sy = "offscreen"+ Date.now();
        return this.scene.layer(sy, opt);
    }
    protected setTranslate(translate:[number,number]) {
        this.translate = translate;
    }
    protected setScale(scale:number) {
        this.scale = scale;
    }
    protected getNodes(workId: number | string){
        return this.fullLayer.getElementsByName(workId + '').concat(this.drawLayer.getElementsByName(workId + ''))
    }
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: IBatchMainMessage):void;
    /** 主线程和工作线程通信,接收 */
    protected abstract on(callBack:(e:IWorkerMessage[])=>void):void;
    protected abstract consumeDraw(type: EDataType, data:IWorkerMessage):void;
    protected abstract consumeDrawAll(type: EDataType, data:IWorkerMessage):void;
    protected abstract consumeFull(type: EDataType, data:IWorkerMessage):void;
}
export abstract class SubLocalWork {
    // protected batchUnitTime:number = 900;
    protected fullLayer: spritejs.Layer;
    protected drawLayer?: spritejs.Layer;
    protected tmpWorkShapeNode?: BaseShapeTool;
    protected tmpOpt?: IActiveToolsDataType;
    protected abstract workShapes: Map<IworkId, BaseShapeTool>;
    constructor(fullLayer: spritejs.Layer, drawLayer?: spritejs.Layer){
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    abstract consumeDraw(data:IWorkerMessage): IMainMessage | undefined;
    abstract consumeDrawAll(data:IWorkerMessage): IMainMessage | undefined;
    getWorkShape(workId:IworkId){
        return this.workShapes.get(workId);
    }
    getTmpWorkShapeNode(){
        return this.tmpWorkShapeNode;
    }
    setTmpWorkId(workId: IworkId | undefined) {
        if (workId && this.tmpWorkShapeNode) {
            this.tmpWorkShapeNode.setWorkId(workId);
            this.workShapes.set(workId, this.tmpWorkShapeNode);
            if (this.tmpOpt) {
                this.setToolsOpt(this.tmpOpt);
            }
            return;
        }
    }
    setTmpWorkOptions(opt: BaseShapeOptions) {
        this.tmpWorkShapeNode?.setWorkOptions(opt)
    }
    setWorkOptions(workId:IworkId, opt:BaseShapeOptions){
        const node = this.workShapes.get(workId);
        if (!node) {
            this.setTmpWorkId(workId);
        }
        this.workShapes.get(workId)?.setWorkOptions(opt);
    }
    setToolsOpt(opt: IActiveToolsDataType) {
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            this.clearAllWorkShapesCache();
        }
        this.tmpOpt = opt;
        switch (opt.toolsType) {
            case EToolsKey.Pencil:
                this.tmpWorkShapeNode = new PencilShape((opt.toolsOpt as PencilOptions), this.fullLayer, this.drawLayer);
                break;
            case EToolsKey.LaserPen:
                this.tmpWorkShapeNode = new LaserPenShape((opt.toolsOpt as LaserPenOptions), this.fullLayer);
                break;
            case EToolsKey.Eraser:
                this.tmpWorkShapeNode = new EraserShape((opt.toolsOpt as EraserOptions), this.fullLayer);
                break;
            default:
                this.tmpWorkShapeNode = undefined;
                break;
        }
    }
    clearWorkShapeNodeCache(workId:IworkId) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
    }
    clearAllWorkShapesCache(){
        this.workShapes.forEach(w=>w.clearTmpPoints());
        this.workShapes.clear();
    }
}
export abstract class SubServiceWork {
    protected abstract workShapes: Map<string, IServiceWorkItem>;
    protected abstract animationId?:number;
    protected drawLayer: spritejs.Layer;
    protected fullLayer: spritejs.Layer;
    constructor(fullLayer: spritejs.Layer, drawLayer: spritejs.Layer){
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    abstract consumeDraw(data:IWorkerMessage): void;
    abstract consumeFull(data:IWorkerMessage): void;
}