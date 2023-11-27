
import { WorkThreadEngine } from "../base";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ILayerOptionType, IMainMessage, IMainMessageRenderData, IOffscreenCanvasOptionType, IRectType, IWorkerMessage } from "../types";
import { ECanvasShowType, EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import { computRect } from "../utils";
import { Scene, Layer } from "spritejs";
import { SubLocalDrawWorkForWorker } from "./localSubDraw";


export class SubWorkThreadEngineByWorker extends WorkThreadEngine {
    static _self: Worker = self as unknown as Worker;
    private lockId?: number;
    protected dpr!: number;
    protected scene!: Scene;
    protected drawLayer!: Layer;
    protected fullLayer!: Layer;
    protected localWork!: SubLocalDrawWorkForWorker;
    constructor() {
        super();
        this.register();
    }
    private init(dpr: number,offscreenCanvasOpt: IOffscreenCanvasOptionType,layerOpt: ILayerOptionType) {
        this.dpr = dpr;
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer(layerOpt);
        this.localWork = new SubLocalDrawWorkForWorker(this.drawLayer, this.post.bind(this));
    }
    getOffscreen(): OffscreenCanvas {
        return this.drawLayer.canvas as OffscreenCanvas;
    }
    private register(){
        this.on((msg:IWorkerMessage[]) => {
            const renderData: IMainMessageRenderData = {};
            let drawCount:number|undefined;
            for (const data of msg) {
                const { workState, dataType, msgType, workId, translate, scale, offscreenCanvasOpt, toolsType, layerOpt, dpr, opt } = data;
                if (msgType === EPostMessageType.Init && offscreenCanvasOpt && layerOpt && dpr) {
                    this.init(dpr, offscreenCanvasOpt, layerOpt);
                    continue;
                }
                /* 处理缩放和拖拽 */
                if (msgType === EPostMessageType.Transform && translate && scale) {
                    this.setTransform(translate, scale);
                    continue;
                }
                // 更新Offscreen配置
                if (msgType === EPostMessageType.UpdateScene && offscreenCanvasOpt) {
                    this.updateScene(offscreenCanvasOpt)
                    // todo 需要细化个人和主房间的宽高比
                    continue;
                }
                if (msgType === EPostMessageType.UpdateTools && toolsType && opt) {
                    this.setToolsOpt({
                        toolsType,
                        toolsOpt: opt
                    })
                    continue;
                }
                if (msgType === EPostMessageType.CreateWork && workId && opt) {
                    if (!this.localWork.getTmpWorkShapeNode() && toolsType) {
                        this.setToolsOpt({
                            toolsType,
                            toolsOpt: opt
                        })
                    }
                    this.setWorkOpt({
                        workId,
                        toolsOpt:opt
                    })
                    continue;
                }
                /* 清空 */
                if (msgType === EPostMessageType.Clear) {
                    this.clearAll();
                    continue;
                }
                // 绘制（高频）
                if(msgType === EPostMessageType.DrawWork && dataType === EDataType.Local) {
                    if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
                        const res = this.consumeDraw(dataType, data);
                        if (res) {
                            const rect1 = res.rect;
                            if (rect1) {
                                renderData.rect = computRect(renderData.rect, rect1);
                                renderData.drawCanvas = ECanvasShowType.Float;
                                renderData.isClear = false;
                                renderData.isFullWork = false;
                            }
                            if (res.drawCount) {
                                drawCount = res.drawCount;
                            }
                        }
                    }
                    if(workState === EvevtWorkState.Done) {
                        this.consumeDrawAll(dataType, data);
                    }
                    continue;
                }
            }
            const postMsg:IBatchMainMessage = {};
            if (renderData.rect) {
                postMsg.render = renderData;
            }
            if (drawCount) {
                postMsg.drawCount = drawCount;
            }
            if(Object.keys(postMsg).length){
                // console.log('postSubMsg', postMsg)
                this.post(postMsg);
            }
        });
    }
    protected updateScene(offscreenCanvasOpt:IOffscreenCanvasOptionType) {
        super.updateScene(offscreenCanvasOpt);
        this.drawLayer.setAttribute('width', offscreenCanvasOpt.width);
        this.drawLayer.setAttribute('height', offscreenCanvasOpt.height);
        const viewport = {
            x: 0 / this.scale - this.translate[0],
            y: 0 / this.scale - this.translate[1],
            w: offscreenCanvasOpt.width,
            h: offscreenCanvasOpt.height,
        }
        const res: IMainMessage = {
            type: EPostMessageType.UpdateScene,
            rect: viewport
        };
        return res;
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
        this.dustbin.clear();
    }
    private setTransform(translate:[number,number], scale:number) {
        this.setTranslate(translate);
        this.setScale(scale);
        this.drawLayer.setAttribute('scale', [scale, scale]);
        this.drawLayer.setAttribute('translate', this.translate);
        const viewport = {
            x: 0 / scale - this.translate[0],
            y: 0 / scale - this.translate[1],
            w: this.drawLayer.width,
            h: this.drawLayer.height,
        }
        const res: IMainMessage = {
            type: EPostMessageType.Transform,
            rect: viewport,
        };
        return res;
    }
    private getRectImageBitmap(rect:IRectType): Promise<ImageBitmap> {
        const {x, y, w, h} = rect;
        const _scale = this.scale < 1 ? this.scale : 1 + Math.abs(this.scale - 1 );
        const width = this.scale < 1 ?  w / this.scale : w * _scale;
        const height = this.scale < 1 ?  h / this.scale :h * _scale;
        const _x = (x + this.translate[0]) * this.scale;
        const _y = (y + this.translate[1]) * this.scale;
        return createImageBitmap(this.getOffscreen(), _x * this.dpr, _y * this.dpr, width * this.dpr,  height * this.dpr, {
            resizeQuality: 'low'
        })
    }
    post(msg: IBatchMainMessage): void {
        if (this.lockId) {
            msg.lockId = this.lockId;
            this.lockId = undefined;
        }
        const renderData = msg.render;
        if (renderData) {
            this.drawLayer.render();
            if (renderData.rect) {
                this.getRectImageBitmap(renderData.rect).then(imageBitmap=>{
                    renderData.imageBitmap = imageBitmap;
                    msg.render = renderData;
                    SubWorkThreadEngineByWorker._self.postMessage(msg,[imageBitmap]);
                    imageBitmap.close();
                })
                return ;
            }
        }
        SubWorkThreadEngineByWorker._self.postMessage(msg);
    }
    on(callBack: (msg: IWorkerMessage[]) => void): void {
        onmessage = (e: MessageEvent<IWorkerMessage[]>)=>{
            callBack(e.data)
        }
    }
    consumeDraw(type: EDataType, data: IWorkerMessage): IMainMessage | undefined {
        if (type === EDataType.Local) {
            const res =  this.localWork.consumeDraw(data);
            return res;
        }
    }
    consumeDrawAll(_type: EDataType, data:IWorkerMessage): undefined {
        this.localWork.consumeDrawAll(data);
        return;
    }
    consumeFull() {
        return;
    }
}
export const worker = new SubWorkThreadEngineByWorker();