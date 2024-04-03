import { Group, Layer, Scene } from "spritejs";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IOffscreenCanvasOptionType, IServiceWorkItem, IWorkerMessage, IworkId } from "../types";
import { VNodeManager } from "./vNodeManager";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { ShapeStateInfo, getShapeInstance } from "../tools/utils";
import { BaseShapeOptions, BaseShapeTool } from "../tools/base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { LocalWorkForSubWorker } from "./subWorkerLocal";

export interface IWorkerInitOption {
    dpr: number,
    offscreenCanvasOpt:  IOffscreenCanvasOptionType, 
    layerOpt: ILayerOptionType
}
export interface ISubWorkerInitOption {
    viewId: string;
    vNodes: VNodeManager;
    fullLayer: Group;
    drawLayer?: Group;
    post: (msg: IBatchMainMessage) => Promise<void>;
}
export abstract class WorkThreadEngineBase {
    readonly viewId: string;
    readonly fullLayer: Group;
    readonly vNodes:VNodeManager;
    readonly dpr:number;
    readonly abstract drawLayer?: Group;
    readonly abstract snapshotFullLayer?: Group;
    protected opt:IWorkerInitOption
    // protected scenePath?: string; 
    protected cameraOpt?: ICameraOpt;
    protected scene: Scene;
    protected abstract localWork: LocalWorkForFullWorker | LocalWorkForSubWorker;
    protected abstract serviceWork?: ServiceWorkForFullWorker;
    protected abstract _post:(msg:IBatchMainMessage, transfer?: Transferable[])=>void;
    constructor(viewId:string, opt: IWorkerInitOption) {
        this.viewId = viewId;
        this.opt = opt;
        this.dpr = opt.dpr;
        this.scene = this.createScene(opt.offscreenCanvasOpt);
        this.fullLayer = this.createLayer('fullLayer',this.scene, {...opt.layerOpt, bufferSize: this.viewId === 'mainView' ? 6000 : 3000});
        this.vNodes = new VNodeManager(viewId, this.scene);
    }
    on(msg: IWorkerMessage) {
        const {msgType, toolsType, opt, workId, workState, dataType} = msg;
        switch (msgType) {
            case EPostMessageType.Destroy:
                this.destroy();
                break;
            case EPostMessageType.Clear:
                this.clearAll();
                break;
            case EPostMessageType.UpdateTools:
                if(toolsType && opt){
                    const param = {
                        toolsType,
                        toolsOpt: opt
                    }
                    this.localWork.setToolsOpt(param);
                }
                break;
            case EPostMessageType.CreateWork:
                if (workId && opt) {
                    if (!this.localWork.getTmpWorkShapeNode() && toolsType) {
                        this.setToolsOpt({
                            toolsType,
                            toolsOpt: opt,
                        })
                    }
                    this.setWorkOpt({
                        workId,
                        toolsOpt: opt
                    })
                }
                break;
            case EPostMessageType.DrawWork:
                if(workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                    this.consumeDrawAll(dataType, msg);
                } else {
                    this.consumeDraw(dataType, msg);
                }
                break;
        }
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
    protected updateLayer(layerOpt:ILayerOptionType) {
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
            desynchronized: true,
            ...opt
        });
    }
    protected createLayer(name:string, scene:Scene, opt: ILayerOptionType) {
        const {width, height} = opt;
        const sy = `offscreen-${name}`;
        const layer = scene.layer(sy, opt);
        const group = new Group({
            anchor:[0.5, 0.5],
            pos:[width * 0.5, height * 0.5],
            size:[width, height],
            name:'viewport',
            id: name,
        })
        layer.append(group);
        return group;
    }
    protected clearAll() {
        if (this.fullLayer) {
            (this.fullLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.fullLayer.removeAllChildren();
        }
        if (this.drawLayer) {
            (this.drawLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove()
                }
            });
            this.drawLayer.removeAllChildren();
        }
        this.localWork.clearAllWorkShapesCache();
        this.serviceWork?.clearAllWorkShapesCache();
    }
    protected setToolsOpt(opt: IActiveToolsDataType) {
        this.localWork.setToolsOpt(opt);
    }
    protected setWorkOpt(opt:Partial<IActiveWorkDataType>): void {
        const { workId, toolsOpt } = opt;
        if (workId && toolsOpt) {
            this.localWork.setWorkOptions(workId,toolsOpt);
        }
    }
    protected destroy(){
        this.vNodes.clear();
        this.scene.remove();
        this.fullLayer.remove();
        this.localWork.destroy();
        this.serviceWork?.destroy();
    }
    abstract setCameraOpt(cameraOpt:ICameraOpt):void;
    abstract getOffscreen(isFullWork:boolean): OffscreenCanvas;
    abstract post(msg: IBatchMainMessage):Promise<void>;
    abstract consumeDraw(type: EDataType, data:IWorkerMessage):void;
    abstract consumeDrawAll(type: EDataType, data:IWorkerMessage):void;
}
export abstract class LocalWork{
    readonly viewId: string;
    readonly vNodes:VNodeManager;
    fullLayer: Group;
    drawLayer?: Group;
    readonly _post: (msg: IBatchMainMessage) => Promise<void>;
    protected tmpWorkShapeNode?: BaseShapeTool;
    protected tmpOpt?: IActiveToolsDataType;
    workShapes: Map<IworkId, BaseShapeTool> = new Map();
    workShapeState: Map<IworkId, ShapeStateInfo> = new Map();
    protected effectWorkId?: number;
    protected drawCount:number = 0;
    constructor(opt:ISubWorkerInitOption){
        this.viewId = opt.viewId;
        this.vNodes = opt.vNodes;
        this.fullLayer = opt.fullLayer;
        this.drawLayer = opt.drawLayer;
        this._post = opt.post;
    }
    destroy(){
        this.workShapeState.clear();
        this.workShapes.clear();
    }
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
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>){
        const {workId, opt, toolsType} = data;
        if (workId && opt && toolsType) {
            const curWorkShapes = (workId && this.workShapes.get(workId)) || this.createWorkShapeNode({
                toolsOpt:opt,
                toolsType
            })
            if (!curWorkShapes) {
                return;
            }
            curWorkShapes.setWorkId(workId);
            this.workShapes.set(workId, curWorkShapes);
            return curWorkShapes
        }
    }
    abstract consumeDraw(data:IWorkerMessage, serviceWork?:ServiceWork): IMainMessage | undefined;
    abstract consumeDrawAll(data:IWorkerMessage, serviceWork?:ServiceWork): IMainMessage | undefined;
}
export interface ServiceWork{
    readonly viewId: string;
    readonly vNodes:VNodeManager;
    readonly fullLayer: Group;
    readonly drawLayer: Group;
    readonly post: (msg: IBatchMainMessage) => Promise<void>;
    selectorWorkShapes: Map<string, IServiceWorkItem>
    clearAllWorkShapesCache():void;
    runSelectWork(data: IWorkerMessage): void;
    consumeDraw(data:IWorkerMessage): void;
    setNodeKey(workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions):IServiceWorkItem;
    runReverseSelectWork(selectIds: string[]):void;
    removeWork(data:IWorkerMessage):void;
    removeSelectWork(data:IWorkerMessage):void;
    runSelectWork(data: IWorkerMessage):void;
    consumeFull(data: IWorkerMessage):void;
    consumeDraw(data: IWorkerMessage):void;
    destroy():void;
}