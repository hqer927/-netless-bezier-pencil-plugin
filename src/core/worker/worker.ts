
import { WorkThreadEngine } from "../base";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IOffscreenCanvasOptionType, IRectType, IWorkerMessage } from "../types";
import { ECanvasShowType, EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import { SubLocalWorkForWorker } from "./local";
import { SubServiceWorkForWorker } from "./service";
import { Scene, Layer, Group } from "spritejs";
import { MethodBuilderWorker } from "../msgEvent/forWorker";
import { EmitEventType } from "../../plugin/types";

export class WorkThreadEngineByWorker extends WorkThreadEngine {
    protected cameraOpt?: Required<Pick<ICameraOpt, "scale" | "centerX" | "centerY">> | undefined;
    static _self: Worker = self as unknown as Worker;
    protected dpr!: number;
    protected scene!: Scene;
    protected drawLayer!: Group;
    protected fullLayer!: Group;
    protected localWork!: SubLocalWorkForWorker;
    protected serviceWork!: SubServiceWorkForWorker;
    private methodBuilder?: MethodBuilderWorker;
    constructor() {
        super();
        this.register();
    }
    private init(dpr: number,offscreenCanvasOpt: IOffscreenCanvasOptionType,layerOpt: ILayerOptionType) {
        this.dpr = dpr;
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer({...layerOpt, width:offscreenCanvasOpt.width, height:offscreenCanvasOpt.height})
        this.fullLayer = this.createLayer({...layerOpt, width:offscreenCanvasOpt.width, height:offscreenCanvasOpt.height, bufferSize: 5000})
        this.localWork = new SubLocalWorkForWorker(this.curNodeMap, this.fullLayer, this.drawLayer, this.post.bind(this));
        this.serviceWork = new SubServiceWorkForWorker(this.curNodeMap, this.fullLayer, this.drawLayer, this.post.bind(this));
        this.methodBuilder = new MethodBuilderWorker([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode, 
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode, 
            EmitEventType.ZIndexActive, EmitEventType.ZIndexNode
        ]).registerForWorker(this.localWork,this.serviceWork);
    }
    getOffscreen(isFullWork:boolean): OffscreenCanvas {
        const layer = (isFullWork? this.fullLayer.parent : this.drawLayer.parent) as Layer;
        return layer.canvas as OffscreenCanvas;
    }
    private register(){
        this.on((msg:IterableIterator<IWorkerMessage>) => {
            for (const data of msg) {
                const { workState, dataType, msgType, workId, toolsType, opt } = data;
                if(this.methodBuilder?.consumeForWorker(data)) {
                    continue;
                }
                switch (msgType) {
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
                    case EPostMessageType.Select:
                        if (dataType === EDataType.Service) {
                            this.localWork.runReverseSelectWork(data);
                            this.serviceWork.runSelectWork(data);
                        }
                        break;
                    case EPostMessageType.UpdateNode:
                        this.updateNode(data);
                        break;
                    case EPostMessageType.FullWork:
                        this.consumeFull(dataType, data)
                        break;
                    case EPostMessageType.DrawWork:
                        if(workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                            this.consumeDrawAll(dataType, data);
                        } else {
                            this.consumeDraw(dataType, data);
                        }
                        break;
                    case EPostMessageType.RemoveNode:
                        this.removeNode(data);
                        break;
                }
            }
        });
    }
    private updateNode(data: IWorkerMessage): undefined {
        const {dataType} = data;
        if (dataType === EDataType.Service) {
            this.serviceWork.consumeFull(data);
        }
    }
    // protected updateScene(offscreenCanvasOpt:IOffscreenCanvasOptionType) {
    //     super.updateScene(offscreenCanvasOpt);
    //     this.localWork.runEffectWork();
    // }
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
        const removeNodes:Group[] = [];
        this.localWork.clearAllWorkShapesCache();
        this.serviceWork.clearAllWorkShapesCache();
        (this.fullLayer.parent as Layer).children.forEach(c => {
            if (c.name !== 'viewport') {
                removeNodes.push(c);
            }
        });
        (this.drawLayer.parent as Layer).children.forEach(c => {
            if (c.name !== 'viewport') {
                removeNodes.push(c);
            }
        });
        removeNodes.forEach(c => {
            c.remove();
        });
        this.fullLayer.removeAllChildren();
        this.drawLayer.removeAllChildren();
        this.localWork.runEffectWork();
    }
    private setCameraOpt(cameraOpt:ICameraOpt) {
        this.cameraOpt = cameraOpt;
        const {scale,centerX,centerY, width, height} = cameraOpt;
        if (width !== this.scene.width || height!== this.scene.height) {
            this.updateScene({width, height});
        }
        this.fullLayer.setAttribute('scale', [scale, scale]);
        this.fullLayer.setAttribute('translate', [-centerX,-centerY]);
        this.drawLayer.setAttribute('scale', [scale, scale]);
        this.drawLayer.setAttribute('translate', [-centerX,-centerY]);
        this.localWork.runEffectWork(()=>{
            if (this.serviceWork.selectorWorkShapes.size) {
                for (const [key,value] of this.serviceWork.selectorWorkShapes.entries()) {
                    this.serviceWork.runSelectWork({
                        workId: key,
                        selectIds: value.selectIds,
                        msgType: EPostMessageType.Select,
                        dataType: EDataType.Service
                    })
                }
            }
        });
    }
    private getRectImageBitmap(rect:IRectType, isFullWork:boolean): Promise<ImageBitmap>  {
        const x = rect.x * this.dpr;
        const y = rect.y * this.dpr;
        const w = rect.w * this.dpr;
        const h = rect.h * this.dpr;
        return createImageBitmap(this.getOffscreen(isFullWork), x, y, w, h, {
            resizeQuality: 'low'
        })
    }
    post(msg: IBatchMainMessage): void {
        const renderData = msg.render;
        if (renderData) {
            // console.log('post1', renderData.rect);
            ((renderData.isFullWork ? this.fullLayer : this.drawLayer)?.parent as Layer).render();
            if (renderData.rect) {
                if (renderData.drawCanvas) {
                    this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork).then(imageBitmap=>{
                        renderData.imageBitmap = imageBitmap;
                        msg.render = renderData;
                        WorkThreadEngineByWorker._self.postMessage(msg,[imageBitmap]);
                        imageBitmap.close();
                    })
                    return ;
                }
            }
        }
        WorkThreadEngineByWorker._self.postMessage(msg);
    }
    on(callBack: (msg: IterableIterator<IWorkerMessage>) => void): void {
        onmessage = (e: MessageEvent<Map<unknown,IWorkerMessage>>)=>{
            if (e.data) {
                // 优先级 init=》draw=》fullWork=》serviceWork=》updateScene=》updateCamera=》clearAll
                const initJob = e.data.get('Init');
                if (initJob) {
                    const {dpr, offscreenCanvasOpt, layerOpt} = initJob;
                    if (offscreenCanvasOpt && layerOpt && dpr) {
                        this.init(dpr, offscreenCanvasOpt, layerOpt);
                    }
                }
                callBack(e.data.values());
                const hasClearAll = e.data.has('ClearAll');
                const updateCameraJob  = e.data.get('UpdateCamera');
                const isFullRender: boolean = !!(hasClearAll || updateCameraJob);
                if (updateCameraJob) {
                    const {cameraOpt} = updateCameraJob;
                    cameraOpt && this.setCameraOpt(cameraOpt);
                }
                if (!hasClearAll && isFullRender) {
                    this.post({
                        render: {
                            rect: {
                                x: 0,
                                y: 0,
                                w: this.scene.width,
                                h: this.scene.height,
                            },
                            drawCanvas: ECanvasShowType.Bg,
                            clearCanvas: ECanvasShowType.Bg,
                            isClear: true,
                            isFullWork: true
                        }
                    })
                   
                }
                if (hasClearAll) {
                    this.clearAll();
                }
            }
        }
    }
    consumeDraw(type: EDataType, data: IWorkerMessage): undefined {
        if (type === EDataType.Local) {
            this.localWork.consumeDraw(data, this.serviceWork);
        } 
        if (type === EDataType.Service) {
            this.serviceWork.consumeDraw(data);
        }
    }
    consumeDrawAll(type: EDataType, data: IWorkerMessage) {
        if (type === EDataType.Local) {
            this.localWork.consumeDrawAll(data, this.serviceWork);
        }
    }
    consumeFull(type: EDataType, data: IWorkerMessage) {
        if (type === EDataType.Service) {
            this.serviceWork.consumeFull(data);
        }
        if (type === EDataType.Local) {
            this.localWork.consumeFull(data);
        }
    }
    removeNode(data:IWorkerMessage){
        const {dataType} = data;
        if (dataType === EDataType.Service) {
            this.serviceWork.removeWork(data);
        }
        if (dataType === EDataType.Local) {
            this.localWork.removeWork(data);
        }
    }
}
export const worker = new WorkThreadEngineByWorker();