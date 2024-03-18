/* eslint-disable @typescript-eslint/no-explicit-any */
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey } from "./enum";
import { BaseShapeOptions, BaseShapeTool, SelectorShape, ShapeStateInfo, getShapeInstance, getShapeTools } from "./tools";
import { BaseNodeMapItem, IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IOffscreenCanvasOptionType, IRectType, IServiceWorkItem, IWorkerMessage, IworkId } from "./types";
import { Group, Layer, Scene } from "spritejs";
import { computRect, isIntersect, isRenderNode } from "./utils";
import { SubServiceWorkForWorker } from "./worker/service";
import throttle from "lodash/throttle";
import { cloneDeep } from "lodash";

export abstract class WorkThreadEngine {
    protected abstract dpr: number;
    protected abstract scene: Scene;
    protected abstract drawLayer: Group;
    protected abstract fullLayer: Group;
    protected abstract snapshotFullLayer: Group;
    protected abstract cameraOpt?: Pick<ICameraOpt, 'centerX'|'centerY'|'scale'>;
    vNodes:VNodeManager;
    abstract getOffscreen(isFullWork:boolean):OffscreenCanvas;
    abstract setToolsOpt(opt: IActiveToolsDataType):void;
    abstract setWorkOpt(opt:IActiveWorkDataType):void;
    constructor(){
        this.vNodes = new VNodeManager();
    }
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
    vNodes:VNodeManager;
    protected tmpWorkShapeNode?: BaseShapeTool;
    protected tmpOpt?: IActiveToolsDataType;
    protected abstract workShapes: Map<IworkId, BaseShapeTool>;
    workShapeState: Map<IworkId, ShapeStateInfo> = new Map();
    protected effectWorkId?: number;
    constructor(vNodes: VNodeManager, fullLayer: Group, drawLayer?: Group){
        this.vNodes = vNodes;
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
        return getShapeInstance({...opt, vNodes:this.vNodes, fullLayer:this.fullLayer,drawLayer:this.drawLayer});
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
        this.batchEffectWork(callBack);
    }
    private batchEffectWork = throttle((callBack?:()=>void)=>{
        if (this.vNodes.curNodeMap.size) {
            this.vNodes.updateNodesRect();
            this.reRenderSelector();
        }
        callBack && callBack();
    }, 100, {'leading':false})
    reRenderSelector(){
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode?.selectIds?.length) return;
        if (this.drawLayer) {
            const newRect = workShapeNode.reRenderSelector();
            if (newRect) {
                // console.log('reRenderSelector', newRect)
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
    vNodes:VNodeManager;
    constructor(vNodes: VNodeManager, fullLayer: Group, drawLayer: Group){
        this.vNodes = vNodes;
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    abstract consumeDraw(data:IWorkerMessage): void;
    abstract consumeFull(data:IWorkerMessage): void;
    abstract runSelectWork(data:IWorkerMessage): void;
    protected setNodeKey(workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions) { 
        workShape.toolsType = tools;
        workShape.node = getShapeInstance({
            toolsType: tools,
            toolsOpt: opt,
            vNodes: this.vNodes, 
            fullLayer: this.fullLayer, 
            drawLayer: this.drawLayer,
        });
        return workShape;
    }
}
export class VNodeManager {
    drawLayer?: Group;
    fullLayer?: Group;
    curNodeMap: Map<string, BaseNodeMapItem> = new Map();
    targetNodeMap: Map<string, BaseNodeMapItem>[] = [];
    init(fullLayer: Group, drawLayer?: Group){
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    get(name:string){
        return this.curNodeMap.get(name);
    }
    hasRenderNodes(){
        let res = false;
        for (const node of this.curNodeMap.values()) {
            if (isRenderNode(node.toolsType)) res = true;
        }
        return res
    }
    has(name:string) {
        this.curNodeMap.has(name);
    }
    setInfo(name:string, info: Partial<BaseNodeMapItem> ) {
        const value: Partial<BaseNodeMapItem> = this.curNodeMap.get(name) || {
            name,
            rect: info.rect
        };
        if (info.rect) {
            value.rect = cloneDeep(info.rect);
        }
        if (info.op) {
            value.op = cloneDeep(info.op);
        }
        if (info.canRotate) {
            value.canRotate = info.canRotate;
        }
        if (info.scaleType) {
            value.scaleType = info.scaleType;
        }
        if (info.opt) {
            value.opt = cloneDeep(info.opt);
        }
        if (info.toolsType) {
            value.toolsType = info.toolsType;
        }
        if (info.centerPos) {
            value.centerPos = cloneDeep(info.centerPos);
        }
        if (value.rect) {
            this.curNodeMap.set(name, value as BaseNodeMapItem)
        } else {
            this.curNodeMap.delete(name);
        }
        console.log('setInfo',value.rect)
    }
    delete(name:string){
        console.log('VNodeManager-del', this.curNodeMap.size)
        this.curNodeMap.delete(name);
    }
    clear(){
        this.curNodeMap.clear();
    }
    getRectIntersectRange(rect:IRectType):{
        rectRange: IRectType | undefined,
        nodeRange: Map<string, BaseNodeMapItem>
    }{
        let rectRange:IRectType | undefined;
        const nodeRange: Map<string, BaseNodeMapItem> = new Map();
        this.curNodeMap.forEach((v,key) => {
            if (isIntersect(rect, v.rect)) {
                rectRange = computRect(rectRange, v.rect) as IRectType;
                nodeRange.set(key, v);
            }
        })
        return {
            rectRange,
            nodeRange
        }
    }
    getNodeRectFormShape(name:string, value: BaseNodeMapItem){
        const shape = getShapeTools(value.toolsType);
        let rect = this.fullLayer && shape?.getRectFromLayer(this.fullLayer, name);
        if (!rect && this.drawLayer) {
            rect = shape?.getRectFromLayer(this.drawLayer, name);
        }
        return rect;
    }
    updateNodesRect() {
        this.curNodeMap.forEach((value, key)=> {
            const rect = this.getNodeRectFormShape(key, value);
            if (!rect) {
                this.curNodeMap.delete(key);
            } else {
                value.rect = rect;
                console.log('updateNodesRect1', cloneDeep(rect))
                this.curNodeMap.set(key, value);
            }
        })
        console.log('updateNodesRect', cloneDeep(this.curNodeMap))
    }
    combineIntersectRect(rect:IRectType):IRectType{
        let _rect:IRectType = rect;
        this.curNodeMap.forEach(v => {
            if (isIntersect(_rect, v.rect)) {
                _rect = computRect(_rect, v.rect) as IRectType;
            }
        })
        return _rect;
    }
    setTarget():number {
        this.targetNodeMap.push(cloneDeep(this.curNodeMap))
        return this.targetNodeMap.length - 1;
    }
    getLastTarget() {
        return this.targetNodeMap[this.targetNodeMap.length - 1];
    }
    deleteLastTarget(){
        this.targetNodeMap.length = this.targetNodeMap.length - 1;
    }
    getTarget(i:number) {
        return this.targetNodeMap[i];
    }
    deleteTarget(i:number){
        this.targetNodeMap.length = i;
    }

}