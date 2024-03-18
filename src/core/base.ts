/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collector } from "../collector";
import { BaseCollectorReducerAction, DiffOne } from "../collector/types";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey } from "./enum";
import { BaseShapeOptions, BaseShapeTool, EraserOptions, EraserShape, PencilOptions, PencilShape, SelectorOptions, SelectorShape, ShapeStateInfo } from "./tools";
import { BaseNodeMapItem, IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IMainMessageRenderData, IOffscreenCanvasOptionType, IServiceWorkItem, IUpdateNodeOpt, IWorkerMessage, IworkId } from "./types";
import { Group, Layer, Scene } from "spritejs";
import { LaserPenOptions, LaserPenShape } from "./tools/laserPen";
import { BezierPencilDisplayer } from "../plugin";
import { getNodeRect } from "./utils";
import { SubServiceWorkForWorker } from "./worker/service";
import { BezierPencilDisplayer as BezierPencilMultiDisplayer } from "../plugin/multi/bezierPencilMultiDisplayer";

export abstract class MainEngine {
    /** 设备像素比 */
    protected abstract dpr: number;
    /** 数据收集器 */
    protected collector: Collector;
    /** view容器 */
    public displayer: BezierPencilDisplayer | BezierPencilMultiDisplayer;
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

    protected constructor(displayer: BezierPencilDisplayer | BezierPencilMultiDisplayer, collector: Collector) {
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
export abstract class WorkThreadEngine {
    /** 设备像素比 */
    protected abstract dpr: number;
    protected abstract scene: Scene;
    protected abstract drawLayer: Group;
    protected abstract fullLayer: Group;
    protected abstract snapshotFullLayer: Group;
    protected abstract cameraOpt?: Pick<ICameraOpt, 'centerX'|'centerY'|'scale'>;
    curNodeMap: Map<string, BaseNodeMapItem> = new Map();
    abstract getOffscreen(isFullWork:boolean):OffscreenCanvas;
    abstract setToolsOpt(opt: IActiveToolsDataType):void;
    abstract setWorkOpt(opt:IActiveWorkDataType):void;
    protected updateScene(offscreenCanvasOpt:IOffscreenCanvasOptionType) {
        this.scene.attr({...offscreenCanvasOpt});
        const { width, height } = offscreenCanvasOpt;
        (this.scene.container as unknown as OffscreenCanvas).width = width;
        (this.scene.container as unknown as OffscreenCanvas).height = height;
        this.scene.width = width;
        this.scene.height = height;
        this.updateLayer({width, height});
    }
    protected updateLayer(layerOpt:Required<Pick<ILayerOptionType, 'width' | 'height'>>) {
        const { width, height } = layerOpt;
        if (this.fullLayer) {
            (this.fullLayer.parent as Layer).setAttribute('width', width);
            (this.fullLayer.parent as Layer).setAttribute('height', height);
            this.fullLayer.setAttribute('size',[width, height]);
            this.fullLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
        if (this.drawLayer) {
            (this.drawLayer.parent as Layer).setAttribute('width', width);
            (this.drawLayer.parent as Layer).setAttribute('height', height);
            this.drawLayer.setAttribute('size',[width, height]);
            this.drawLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
        if (this.snapshotFullLayer) {
            (this.snapshotFullLayer.parent as Layer).setAttribute('width', width);
            (this.snapshotFullLayer.parent as Layer).setAttribute('height', height);
            this.snapshotFullLayer.setAttribute('size',[width, height]);
            this.snapshotFullLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
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
    protected createLayer(scene:Scene, opt:Required<Pick<ILayerOptionType, 'width' | 'height'>> & Omit<ILayerOptionType, 'width' | 'height'>) {
        const {width, height} = opt;
        const sy = "offscreen"+ Date.now();
        const layer = scene.layer(sy, opt);
        const group = new Group({
            anchor:[0.5, 0.5],
            pos:[width * 0.5, height * 0.5],
            size:[width, height],
            name:'viewport'
        })
        layer.append(group);
        return group;
    }
    protected getNodes(workId: number | string){
        return this.fullLayer.getElementsByName(workId + '').concat(this.drawLayer.getElementsByName(workId + ''))
    }
    /** 主线程和工作线程通信,推送 */
    abstract post(msg: IBatchMainMessage):void;
    /** 主线程和工作线程通信,接收 */
    protected abstract on(callBack:(e:IterableIterator<IWorkerMessage>, isFullRender?:boolean)=>void):void;
    protected abstract consumeDraw(type: EDataType, data:IWorkerMessage):void;
    protected abstract consumeDrawAll(type: EDataType, data:IWorkerMessage):void;
}
export abstract class SubLocalWork {
    fullLayer: Group;
    drawLayer?: Group;
    curNodeMap: Map<string, BaseNodeMapItem>;
    protected tmpWorkShapeNode?: BaseShapeTool;
    protected tmpOpt?: IActiveToolsDataType;
    protected abstract workShapes: Map<IworkId, BaseShapeTool>;
    workShapeState: Map<IworkId, ShapeStateInfo> = new Map();
    protected effectWorkId?: number;
    constructor(curNodeMap: Map<string, BaseNodeMapItem>, fullLayer: Group, drawLayer?: Group){
        this.curNodeMap = curNodeMap;
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    abstract _post:(msg: IBatchMainMessage) => Promise<void>;
    abstract consumeDraw(data:IWorkerMessage, serviceWork:SubServiceWorkForWorker): IMainMessage | undefined;
    abstract consumeDrawAll(data:IWorkerMessage, serviceWork:SubServiceWorkForWorker): IMainMessage | undefined;
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
    createWorkShapeNode(opt: IActiveToolsDataType) {
        let tmpWorkShapeNode:BaseShapeTool|undefined;
        switch (opt.toolsType) {
            case EToolsKey.Pencil:
                tmpWorkShapeNode = new PencilShape((opt.toolsOpt as PencilOptions), this.fullLayer, this.drawLayer) as BaseShapeTool;
                break;
            case EToolsKey.LaserPen:
                tmpWorkShapeNode = new LaserPenShape((opt.toolsOpt as LaserPenOptions), this.fullLayer) as BaseShapeTool;
                break;
            case EToolsKey.Eraser:
                tmpWorkShapeNode = new EraserShape((opt.toolsOpt as EraserOptions), this.fullLayer) as BaseShapeTool;
                break;
            case EToolsKey.Selector:
                tmpWorkShapeNode = new SelectorShape((opt.toolsOpt as SelectorOptions), this.fullLayer, this.drawLayer) as BaseShapeTool;
                break;
            default:
                tmpWorkShapeNode = undefined;
                break;
        }
        return tmpWorkShapeNode
    }
    setToolsOpt(opt: IActiveToolsDataType) {
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            if (this.tmpOpt?.toolsType) {
                this.clearAllWorkShapesCache();
            }
        }
        this.tmpOpt = opt;
        this.tmpWorkShapeNode = this.createWorkShapeNode(opt);
    }
    abstract blurSelector(): void;
    clearWorkShapeNodeCache(workId:IworkId) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
        this.workShapeState.delete(workId);
    }
    clearAllWorkShapesCache(){
        this.workShapes.forEach(w=>w.clearTmpPoints());
        this.workShapes.clear();
        this.workShapeState.clear();
    }
    runEffectWork(callBack?:()=>void){
        if (this.effectWorkId) {
            clearTimeout(this.effectWorkId);
            this.effectWorkId = undefined
        }
        this.effectWorkId = setTimeout(()=>{
            this.effectWorkId = undefined;
            this.computNodeMap();
            this.rerRenderSelector();
            callBack && callBack();
        }, 50) as unknown as number;
    }
    computNodeMap() {
        const willRemoveIds = new Set<string>(this.curNodeMap.keys());
        this.fullLayer.children.forEach(c => {
            if (c.name !== SelectorShape.selectorId) {
                const rect = getNodeRect(c.name, this.fullLayer);
                if (rect) {
                    const value = this.curNodeMap.get(c.name);
                    if (value) {
                        value.rect = rect;
                        willRemoveIds.delete(c.name);
                    } else {
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                        })
                    }
                }
            }
        })
        this.drawLayer?.children?.forEach(c => {
            if (c.name !== SelectorShape.selectorId) {
                const rect = getNodeRect(c.name, this.drawLayer);
                if (rect) {
                    const value = this.curNodeMap.get(c.name);
                    if (value) {
                        value.rect = rect;
                        willRemoveIds.delete(c.name);
                    } else {
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                        })
                    }
                }
            }
        })
        if (willRemoveIds.size) {
           for (const key of willRemoveIds.keys()) {
                this.curNodeMap.delete(key);
           }
        }
        // console.log('computNodeMap', this.curNodeMap)
    }
    updataNodeMap(param:{key:string, ops?:string, opt?:BaseShapeOptions, toolsType?:EToolsKey}){
        const {key,ops,opt, toolsType} = param;
        let rect = getNodeRect(key, this.fullLayer);
        const value = this.curNodeMap.get(key) || {
            name: key,
            rect
        } as BaseNodeMapItem;
        if (ops) {
            value.ops = ops;
        }
        if (opt) {
            value.opt = opt;
        }
        if (rect) {
            value.rect = rect;
        }
        if (toolsType) {
            value.toolsType = toolsType;
        }
        if (this.drawLayer) {
            rect = getNodeRect(key, this.drawLayer);
            if (rect && this.drawLayer) {
                value.rect = rect;
            }
        }
        if (!value.rect) {
            this.curNodeMap.delete(key);
        } else {
            this.curNodeMap.set(key, value);
        }
        // console.log('updataNodeMap-local', key, this.curNodeMap)
    }
    rerRenderSelector(){
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode?.selectIds?.length) return;
        if (this.drawLayer) {
            const newRect = workShapeNode.getSelector(this.curNodeMap);
            if (newRect) {
                // console.log('rerRenderSelector', newRect)
                this._post({
                    render: [
                        {
                            rect: newRect,
                            isClear:true,
                            isFullWork:false,
                            clearCanvas:ECanvasShowType.Selector,
                            drawCanvas:ECanvasShowType.Selector,
                        }
                    ],
                    sp:[{
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect: newRect,
                        willSyncService: false
                    }]
                });
            }
        }
    }
}
export abstract class SubServiceWork {
    protected abstract workShapes: Map<string, IServiceWorkItem>;
    protected abstract animationId?:number;
    drawLayer: Group;
    fullLayer: Group;
    curNodeMap: Map<string, BaseNodeMapItem>;
    constructor(curNodeMap: Map<string, BaseNodeMapItem>, fullLayer: Group, drawLayer: Group){
        this.curNodeMap = curNodeMap;
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    abstract consumeDraw(data:IWorkerMessage): void;
    abstract consumeFull(data:IWorkerMessage): void;
    abstract runSelectWork(data:IWorkerMessage): void;
    updataNodeMap(key:string, ops?:string, opt?:BaseShapeOptions){
        let rect = getNodeRect(key, this.fullLayer);
        const value = this.curNodeMap.get(key) || {
            name: key,
            rect,
        } as BaseNodeMapItem;
        if (ops) {
            value.ops = ops;
        }
        if (opt) {
            value.opt = opt;
        }
        if (rect) {
            value.rect = rect;
        }
        if (this.drawLayer) {
            rect = getNodeRect(key, this.drawLayer);
            if (rect && this.drawLayer) {
                value.rect = rect;
            }
        }
        if (!value.rect) {
            this.curNodeMap.delete(key);
        } else {
            this.curNodeMap.set(key, value);
        }
        // console.log('updataNodeMap-service', this.curNodeMap)
    }
}