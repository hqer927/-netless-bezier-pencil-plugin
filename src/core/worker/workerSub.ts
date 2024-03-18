
import { WorkThreadEngine } from "../threadEngine";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessageRenderData, IOffscreenCanvasOptionType, IRectType, IWorkerMessage } from "../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import type  { Scene, Group, Layer } from "spritejs";
import { SubLocalDrawWorkForWorker } from "./localSubDraw";
import cloneDeep from "lodash/cloneDeep";
import { computRect } from "../utils";


export class SubWorkThreadEngineByWorker extends WorkThreadEngine {
    protected cameraOpt?: Pick<ICameraOpt, "scale" | "centerX" | "centerY"> | undefined;
    static _self: Worker = self as unknown as Worker;
    protected dpr!: number;
    protected scene!: Scene;
    protected drawLayer!: Group;
    protected fullLayer!: Group;
    protected snapshotFullLayer!: Group;
    protected localWork!: SubLocalDrawWorkForWorker;
    constructor() {
        super();
        this.register();
    }
    private init(dpr: number,offscreenCanvasOpt: IOffscreenCanvasOptionType,layerOpt: ILayerOptionType) {
        this.dpr = dpr;
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer(this.scene, {...layerOpt, width:offscreenCanvasOpt.width, height:offscreenCanvasOpt.height})
        this.snapshotFullLayer = this.createLayer(this.scene, {...layerOpt, width:offscreenCanvasOpt.width, height:offscreenCanvasOpt.height, bufferSize: 5000})
        this.vNodes.init(this.drawLayer);
        this.localWork = new SubLocalDrawWorkForWorker(this.vNodes, this.drawLayer, this.post.bind(this));
    }
    getOffscreen(isSnapshot:boolean): OffscreenCanvas {
        return ((isSnapshot && this.snapshotFullLayer || this.drawLayer).parent as Layer)?.canvas as OffscreenCanvas;
    }
    private register(){
        this.on((msg:IterableIterator<IWorkerMessage>) => {
            for (const data of msg) {
                const { workState, dataType, msgType, workId, toolsType, opt } = data;
                switch (msgType) {
                    case EPostMessageType.Snapshot:
                        this.getSnapshot(data)
                        break;
                    case EPostMessageType.BoundingBox:
                        this.getBoundingRect(data)
                        break;
                    case EPostMessageType.UpdateTools:
                        if (toolsType && opt) {
                            this.setToolsOpt({
                                toolsType,
                                toolsOpt: opt
                            })
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
                            this.consumeDrawAll(dataType, data);
                        } else {
                            this.consumeDraw(dataType, data);
                        }
                        break;
                }
            }
        });
    }
    setToolsOpt(opt: IActiveToolsDataType) {
        this.localWork.setToolsOpt(opt);
    }
    setWorkOpt(opt:Partial<IActiveWorkDataType>): void {
        const { workId, toolsOpt } = opt;
        if (workId && toolsOpt) {
            this.localWork.setWorkOptions(workId,toolsOpt);
        }
    }
    private clearAll() {
        this.drawLayer.removeAllChildren();
        this.localWork.clearAllWorkShapesCache();
    }
    private setCameraOpt(cameraOpt:ICameraOpt, layer:Group) {
        this.cameraOpt = cameraOpt;
        const {scale,centerX,centerY, width, height} = cameraOpt;
        if (width !== this.scene.width || height!== this.scene.height) {
            this.updateScene({width, height});
        }
        layer.setAttribute('scale', [scale, scale]);
        layer.setAttribute('translate', [-centerX,-centerY]);
    }
    private getRectImageBitmap(rect:IRectType, isSnapshot:boolean = false, options?:ImageBitmapOptions): Promise<ImageBitmap>{
        const x = rect.x * this.dpr;
        const y = rect.y * this.dpr;
        const w = rect.w * this.dpr;
        const h = rect.h * this.dpr;
        return createImageBitmap(this.getOffscreen(isSnapshot), x, y, w,  h, options)
    }
    private safariFixRect(rect:IRectType):IRectType|undefined{
        if (rect.w + rect.x <=0 ||rect.h + rect.y <=0 ) {
            return undefined;
        }
        if (rect.w + rect.x > this.scene.width) {
            rect.w = this.scene.width - Math.max(rect.x,0);
        }
        if (rect.h + rect.y > this.scene.width) {
            rect.h = this.scene.height - Math.max(rect.y,0);
        }
        if (rect.w <= 0 || rect.h <= 0) {
            return undefined
        }
        if (rect.x < 0) {
            rect.x = 0;
        }
        if (rect.y < 0) {
            rect.y = 0;
        }
        return rect
    }
    async post(msg: IBatchMainMessage): Promise<void> {
        const render = msg.render;
        const newRender:IMainMessageRenderData[] = [];
        if (render?.length) {
            for (const renderData of render) {
                if (renderData.drawCanvas) {
                    (this.drawLayer.parent as Layer).render();
                }
                if (renderData.rect) {
                    renderData.rect = this.safariFixRect(cloneDeep(renderData.rect));
                    if (!renderData.rect) {
                        continue;
                    }
                    if (renderData.drawCanvas) {
                        const imageBitmap = await this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork);
                        renderData.imageBitmap = imageBitmap;
                    }
                    newRender.push(renderData);
                } 
            }
            msg.render = newRender;
        }
        if (msg.sp?.length || msg.drawCount || newRender?.length) {
            console.log('post1', msg.drawCount, msg?.render && msg?.render[0] && msg?.render[0].rect);
            SubWorkThreadEngineByWorker._self.postMessage(msg);
            if (newRender.length) {
                for (const renderData of newRender) {
                    if (renderData.imageBitmap) {
                        renderData.imageBitmap.close();
                    }
                }
            }
        }
    }
    on(callBack: (msg: IterableIterator<IWorkerMessage>) => void): void {
        onmessage = (e: MessageEvent<Map<unknown,IWorkerMessage>>)=>{
            // console.log('onmessage1', cloneDeep(e.data))
            if (e.data) {
                // 优先级 init=》draw=》fullWork=》serviceWork=》updateCamera=》clearAll
                const initJob = e.data.get('Init');
                if (initJob) {
                    const {dpr, offscreenCanvasOpt, layerOpt} = initJob;
                    if (offscreenCanvasOpt && layerOpt && dpr) {
                        this.init(dpr, offscreenCanvasOpt, layerOpt);
                    }
                }
                const hasClearAll = e.data.has('ClearAll');
                const updateCameraJob  = e.data.get('UpdateCamera');
                if (updateCameraJob) {
                    const {cameraOpt} = updateCameraJob;
                    cameraOpt && this.setCameraOpt(cameraOpt, this.drawLayer);
                }
                if (hasClearAll) {
                    this.clearAll();
                }
                callBack(e.data.values());
            }
        }
    }
    consumeDraw(type: EDataType, data: IWorkerMessage): undefined {
        if (type === EDataType.Local) {
            this.localWork.consumeDraw(data);
        }
    }
    consumeDrawAll(_type: EDataType, data:IWorkerMessage): undefined {
        this.localWork.consumeDrawAll(data);
        return;
    }
    private async getSnapshot(data:IWorkerMessage){
        const {scenePath, scenes, cameraOpt, w, h} = data;
        if (scenePath && scenes && cameraOpt) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = this.drawLayer;
            let rect:IRectType|undefined;
            for (const [key,value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const r = this.localWork.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service
                            });
                            rect = computRect(rect,r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            this.localWork.fullLayer = this.drawLayer;
            this.localWork.drawLayer = undefined;
            let options:ImageBitmapOptions|undefined;
            if (w && h) {
                options = {
                    resizeWidth: w,
                    resizeHeight: h,
                }
            }
            (this.snapshotFullLayer.parent as Layer).render();
            const imageBitmap = await this.getRectImageBitmap({ x: 0, y: 0, w: this.scene.width, h: this.scene.height }, true, options)
            if(imageBitmap){
                SubWorkThreadEngineByWorker._self.postMessage({
                    sp:[{
                        type: EPostMessageType.Snapshot,
                        scenePath,
                        imageBitmap,
                    }]
                },[imageBitmap]);
                imageBitmap.close();
                this.snapshotFullLayer.removeAllChildren();
                this.setCameraOpt(curCameraOpt as ICameraOpt, this.drawLayer);
            }
        }
    }
    private getBoundingRect(data:IWorkerMessage){
        const {scenePath, scenes, cameraOpt} = data;
        if (scenePath && scenes && cameraOpt) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = this.drawLayer;
            let rect:IRectType|undefined;
            for (const [key,value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const r = this.localWork.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service
                            });
                            rect = computRect(rect,r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            if(rect){
                SubWorkThreadEngineByWorker._self.postMessage({
                    sp:[{
                        type: EPostMessageType.BoundingBox,
                        scenePath,
                        rect,
                    }]
                });
            }
            this.localWork.fullLayer = this.drawLayer;
            this.localWork.drawLayer = undefined;
            this.snapshotFullLayer.removeAllChildren();
            this.setCameraOpt(curCameraOpt as ICameraOpt, this.drawLayer);
        }
    }
}
export const worker = new SubWorkThreadEngineByWorker();