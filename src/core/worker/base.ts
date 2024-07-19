import { Group, Layer, Scene } from "spritejs";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IMainMessageRenderData, IOffscreenCanvasOptionType, IRectType, IWorkerMessage } from "../types";
import { VNodeManager } from "../vNodeManager";
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import { getShapeInstance } from "../tools/utils";
import { BaseShapeOptions, BaseShapeTool } from "../tools/base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
import { EWorkThreadType, WorkThreadEngineForFullWorker, WorkThreadEngineForSubWorker } from "./workerManager";
import { computRect } from "../utils";
import isNumber from "lodash/isNumber";
import isEqual from "lodash/isEqual";
import { EmitEventType } from "../../plugin/types";
import { DefaultAppliancePluginOptions } from "../../plugin/const";
import { Main_View_Id } from "../const";

export interface IWorkerInitOption {
    dpr: number,
    offscreenCanvasOpt:  IOffscreenCanvasOptionType, 
    layerOpt: ILayerOptionType,
}
export interface ISubWorkerInitOption {
    thread: WorkThreadEngineForFullWorker | WorkThreadEngineForSubWorker;
    viewId: string;
    vNodes: VNodeManager;
    fullLayer: Group;
    topLayer?: Group;
    drawLayer?: Group;
    // post: (msg: IBatchMainMessage) => void;
}
export abstract class WorkThreadEngineBase {
    readonly viewId: string;
    readonly fullLayer: Group;
    readonly vNodes:VNodeManager;
    readonly dpr:number;
    readonly contextType?:ECanvasContextType;
    abstract readonly type: EWorkThreadType;
    protected opt:IWorkerInitOption
    protected cameraOpt?: ICameraOpt;
    protected scene: Scene;
    abstract localWork: LocalWorkForFullWorker | LocalWorkForSubWorker;
    abstract serviceWork?: ServiceWorkForFullWorker;
    protected isSafari: boolean = false;
    protected abstract _post:(msg:IBatchMainMessage)=>void;
    combinePostMsg: Set<IBatchMainMessage>=new Set();
    protected workerTaskId?: number | undefined;
    protected protectedTask?: {
        isProtected: boolean,
        workName: EmitEventType,
        workState: EvevtWorkState
    };
    protected delayPostDoneResolve?: (bol:boolean) => void;
    constructor(viewId:string, opt: IWorkerInitOption, workerType:EWorkThreadType) {
        this.viewId = viewId;
        this.opt = opt;
        this.dpr = opt.dpr;
        this.contextType = this.getSupportContextType(workerType);
        if(!this.contextType){
            throw new Error("Sorry, your browser doesn't support canvas context type 2d or webgl");
        }
        this.scene = this.createScene(opt.offscreenCanvasOpt);
        const fullBufferSize = DefaultAppliancePluginOptions.bufferSize.full;
        const subBufferSize = DefaultAppliancePluginOptions.bufferSize.sub;
        this.fullLayer = this.createLayer('fullLayer', this.scene, {...opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? fullBufferSize : subBufferSize});
        this.vNodes = new VNodeManager(viewId, this.scene);
    }
    setIsSafari(isSafari:boolean){
        this.isSafari = isSafari;
    }
    async on(msg: IWorkerMessage) {
        const {msgType, toolsType, opt} = msg;
        switch (msgType) {
            case EPostMessageType.UpdateCamera:
                await this.updateCamera(msg);
                break;
            case EPostMessageType.Destroy:
                this.destroy();
                break;
            case EPostMessageType.Clear:
                await this.clearAll();
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
        }
    }
    protected createLocalWork(data:IWorkerMessage){
        const {workId, opt, toolsType} = data;
        if (workId && opt) {
            if (!this.localWork.getToolsOpt() && toolsType) {
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
    }
    private getSupportContextType(workerType:EWorkThreadType): ECanvasContextType|undefined {
        const canvas = new OffscreenCanvas(100,100);
        const list = 
            workerType === EWorkThreadType.Full && this.viewId === Main_View_Id ? 
            [ECanvasContextType.Webgl2, ECanvasContextType.Webgl, ECanvasContextType.Canvas2d] :
            [ECanvasContextType.Canvas2d];
        for (const key of list) {
            const context = canvas.getContext(key);
            if (context) {
                return key;
            }
        }
        return undefined;
    }
    protected createScene(opt:IOffscreenCanvasOptionType) {
        const { width, height } = opt;
        const container = new OffscreenCanvas(width,height);
        if (opt.contextType) {
            delete opt.contextType;
        }
        const scene = new Scene({
            container,
            displayRatio: this.dpr, 
            depth: false,
            desynchronized: true,
            failIfMajorPerformanceCaveat: true,
            ...opt,
            contextType:this.contextType,
            id: this.viewId
        });
        scene.setAttribute('id', this.viewId);
        return scene;
    }
    protected createLayer(name:string, scene:Scene, opt: ILayerOptionType) {
        const {width, height} = opt;
        const sy = `offscreen-${name}`;
        const layer = scene.layer(sy, opt);
        const group = new Group({
            anchor:[0.5, 0.5],
            pos: [width * 0.5, height * 0.5],
            size: [width, height],
            name:'viewport',
            id: name,
        })
        layer.append(group);
        return group;
    }
    protected async clearAll() {
        if (this.fullLayer) {
            (this.fullLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.fullLayer.removeAllChildren();
        }
        this.localWork.destroy();
        this.serviceWork?.destroy();
    }
    protected setToolsOpt(opt: IActiveToolsDataType) {
        this.localWork.setToolsOpt(opt);
    }
    protected setWorkOpt(opt:Partial<IActiveWorkDataType>): void {
        const { workId, toolsOpt } = opt;
        if (workId && toolsOpt) {
            this.localWork.setWorkOptions(workId.toString(),toolsOpt);
        }
    }
    protected destroy(){
        this.vNodes.clear();
        this.fullLayer.remove();
        this.scene.remove();
        this.localWork.destroy();
        this.serviceWork?.destroy();
    }
    async post(msg: IBatchMainMessage): Promise<void> {
        this.combinePostMsg.add(msg);
        await this.runBatchPostData();
    }
    private async runBatchPostData(){
        if (!this.workerTaskId) {
            this.workerTaskId = requestAnimationFrame(this.combinePost.bind(this));
        }
        if ( this.type === EWorkThreadType.Full &&  !this.delayPostDoneResolve) {
            const done = await new Promise<boolean>((resolve)=>{
                this.delayPostDoneResolve = resolve;
                // console.log('post-pending', this.workerTaskId, cloneDeep(this.combinePostMsg))
            })
            if(done) {
                // console.log('post-done', this.workerTaskId)
                this.delayPostDoneResolve = undefined;
            }
        }
    }
    protected combinePostData(): IBatchMainMessage{
        this.workerTaskId = undefined;
        const render: Array<IMainMessageRenderData> = [];
        const sp: Array<IMainMessage> = [];
        let drawCount: number | undefined = undefined;
        const workIds:Set<string> = new Set();
        for (const value of this.combinePostMsg.values()) {
            if (value.render?.length) {
                for (const newRenderData of value.render) {
                    let hasSame = false;
                    if (newRenderData.workId) {
                        workIds.add(newRenderData.workId);
                    }
                    if (newRenderData.isClearAll) {
                        newRenderData.rect = this.getSceneRect();
                        newRenderData.isClear = true;
                        delete newRenderData.isClearAll;
                    }
                    if (newRenderData.drawCanvas) {
                        const renderLayer = this.getLayer(newRenderData.drawCanvas);
                        if (!renderLayer || !(renderLayer.parent instanceof Layer)) {
                            continue;
                        }
                        (renderLayer.parent as Layer).render();                        
                        if (newRenderData.isDrawAll) {
                            const rect = this.getSceneRect();
                            // 缩小绘制范围,捞取视口内的节点的boundingbox.
                            // const {rectRange} = this.vNodes.getRectIntersectRange(rect, false, false);
                            // newRenderData.rect = rectRange;
                            newRenderData.rect = rect;
                            delete newRenderData.isDrawAll;
                        }
                    }
                    for (const combineRenderData of render) {
                        if (newRenderData.viewId === combineRenderData.viewId) {
                            if (newRenderData.isClear && combineRenderData.clearCanvas && combineRenderData.isClear && combineRenderData.clearCanvas === newRenderData.clearCanvas) {
                                combineRenderData.rect = computRect(combineRenderData.rect, newRenderData.rect);
                                hasSame = true;
                            }
                            if (combineRenderData.drawCanvas && combineRenderData.drawCanvas === newRenderData.drawCanvas) {
                                combineRenderData.rect = computRect(combineRenderData.rect, newRenderData.rect);
                                hasSame = true;
                            }
                            continue;
                        }
                    }
                    if (!hasSame) {
                        if (newRenderData.isClear && !newRenderData.drawCanvas) {
                            render.unshift(newRenderData);
                        } else {
                            render.push(newRenderData);
                        }
                    }
                    
                }
            }
            if (value.sp?.length) {
                for (const newSpData of value.sp) {
                    let isSame = false
                    for (const spData of sp) {
                        if (isEqual(newSpData, spData)) {
                            isSame = true;
                            break;
                        }
                    }
                    if(!isSame) {
                        sp.push(newSpData);
                    }
                } 
            }
            if (isNumber(value.drawCount)) {
                drawCount = value.drawCount;
            }
        }
        this.combinePostMsg.clear();

        return {
            render,
            sp,
            drawCount,
            workIds
        }
    }
    protected safariFixRect(rect:IRectType):IRectType|undefined{
        if (rect.w + rect.x <=0 || rect.h + rect.y <=0 ) {
            return undefined;
        }
        if (rect.w <= 0 || rect.h <= 0) {
            return undefined
        }
        const sceneW = this.scene.width;
        const sceneH = this.scene.height;
        const newRect = {
            x: Math.floor(Math.max(0, rect.x)),
            y: Math.floor(Math.max(0, rect.y)),
            w: Math.floor(Math.min(sceneW, rect.w)),
            h: Math.floor(Math.min(sceneH, rect.h))
        }
        if (newRect.x + newRect.w > sceneW) {
            newRect.w = Math.floor(sceneW - newRect.x);
        }
        if (newRect.y + newRect.h > sceneH) {
            newRect.h = Math.floor(sceneH - newRect.y);
        }
        return newRect;
    }
    protected getSceneRect():IRectType {
        const {width, height} = this.scene;
        return {
            x: 0,
            y: 0,
            w: Math.floor(width),
            h: Math.floor(height)
        }
    }
    abstract combinePost():Promise<void>;
    protected abstract getLayer(workLayer: ECanvasShowType): Group | undefined;
    abstract setCameraOpt(cameraOpt:ICameraOpt):void;
    abstract consumeDraw(type: EDataType, data:IWorkerMessage):Promise<void>;
    abstract consumeDrawAll(type: EDataType, data:IWorkerMessage):Promise<void>;
    abstract updateCamera(msg:IWorkerMessage):Promise<void>;
}
export abstract class LocalWork{
    readonly viewId: string;
    readonly vNodes:VNodeManager;
    readonly thread: WorkThreadEngineForFullWorker | WorkThreadEngineForSubWorker;
    fullLayer: Group;
    drawLayer?: Group;
    readonly _post: (msg: IBatchMainMessage) => Promise<void>;
    protected tmpOpt?: IActiveToolsDataType;
    workShapes: Map<string, BaseShapeTool> = new Map();
    protected drawCount:number = 0;
    protected syncUnitTime: number = DefaultAppliancePluginOptions.syncOpt.interval;
    constructor(opt:ISubWorkerInitOption){
        this.thread = opt.thread;
        this.viewId = opt.viewId;
        this.vNodes = opt.vNodes;
        this.fullLayer = opt.fullLayer;
        this.drawLayer = opt.drawLayer;
        this._post = this.thread.post.bind(opt.thread);
    }
    destroy(){
        this.workShapes.clear();
    }
    getWorkShapes(){
        return this.workShapes;
    }
    getWorkShape(workId:string){
        return this.workShapes.get(workId);
    }
    createWorkShape(workId: string, opt?: BaseShapeOptions){
        if (workId && this.tmpOpt) {
            const _opt = {
                toolsType: this.tmpOpt.toolsType,
                toolsOpt: opt || this.tmpOpt.toolsOpt
            }; 
            const workShapeNode = this.createWorkShapeNode({..._opt, workId});
            if (workShapeNode) {
                this.workShapes.set(workId, workShapeNode);
            }
        }
    }
    setWorkOptions(workId:string, opt:BaseShapeOptions){
        const node = this.getWorkShape(workId);
        if (!node) {
            this.createWorkShape(workId, opt)
        }
        node?.setWorkOptions(opt);
    }
    createWorkShapeNode(opt: IActiveToolsDataType & {workId:string}) {
        return getShapeInstance({...opt, vNodes:this.vNodes, fullLayer:this.fullLayer, drawLayer:this.drawLayer}, this.thread?.serviceWork);
    }
    setToolsOpt(opt: IActiveToolsDataType) {
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            if (this.tmpOpt?.toolsType) {
                this.clearAllWorkShapesCache();
            }
        }
        this.tmpOpt = opt;
        if (opt.toolsOpt?.syncUnitTime) {
            this.syncUnitTime = opt.toolsOpt.syncUnitTime;
        }
    }
    getToolsOpt(){
        return this.tmpOpt;
    }
    clearWorkShapeNodeCache(workId:string) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
    }
    clearAllWorkShapesCache(){
        this.workShapes.forEach(w=>w.clearTmpPoints());
        this.workShapes.clear();
    }
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>){
        const {workId, opt, toolsType} = data;
        if (workId && opt && toolsType) {
            const workIdStr = workId.toString();
            let curWorkShapes: BaseShapeTool | undefined;
            if (workId && this.workShapes.has(workIdStr)) {
                curWorkShapes = this.workShapes.get(workIdStr);
                curWorkShapes?.setWorkOptions(opt);
            } else {
                curWorkShapes = this.createWorkShapeNode({
                    toolsOpt: opt,
                    toolsType,
                    workId:workIdStr
                })
            }
            if (!curWorkShapes) {
                return;
            }
            this.workShapes.set(workIdStr, curWorkShapes);
            return curWorkShapes
        }
    }
}
