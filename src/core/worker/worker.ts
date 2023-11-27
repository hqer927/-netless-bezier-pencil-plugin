
import { WorkThreadEngine } from "../base";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ILayerOptionType, IMainMessage, IMainMessageRenderData, IOffscreenCanvasOptionType, IRectType, IUpdateNodeOpt, IWorkerMessage, IworkId } from "../types";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { SubLocalWorkForWorker } from "./local";
import { computRect } from "../utils";
import { SubServiceWorkForWorker } from "./service";
import { Scene, Layer } from "spritejs";


export class WorkThreadEngineByWorker extends WorkThreadEngine {
    static _self: Worker = self as unknown as Worker;
    // private lockId?: number;
    protected dpr!: number;
    protected scene!: Scene;
    protected drawLayer!: Layer;
    protected fullLayer!: Layer;
    protected localWork!: SubLocalWorkForWorker;
    protected serviceWork!: SubServiceWorkForWorker;
    constructor() {
        super();
        this.register();
    }
    private init(dpr: number,offscreenCanvasOpt: IOffscreenCanvasOptionType,layerOpt: ILayerOptionType) {
        this.dpr = dpr;
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer(layerOpt)
        this.fullLayer = this.createLayer(layerOpt)
        this.localWork = new SubLocalWorkForWorker(this.fullLayer, this.drawLayer, this.post.bind(this));
        this.serviceWork = new SubServiceWorkForWorker(this.fullLayer, this.drawLayer, this.post.bind(this));
    }
    getOffscreen(isFullWork:boolean): OffscreenCanvas {
        return ( isFullWork ? this.fullLayer : this.drawLayer).canvas as OffscreenCanvas;
    }
    private register(){
        this.on((msg:IWorkerMessage[]) => {
            const sp: IMainMessage[] = [];
            const renderData: IMainMessageRenderData = {};
            let drawCount:number | undefined;
            for (const data of msg) {
                const { workState, updateNodeOpt, dataType, msgType, workId, translate, scale, offscreenCanvasOpt, toolsType, layerOpt, dpr, opt } = data;
                if (msgType === EPostMessageType.Init && offscreenCanvasOpt && layerOpt && dpr) {
                    this.init(dpr, offscreenCanvasOpt, layerOpt);
                    continue;
                }
                /* 处理缩放和拖拽 */
                if (msgType === EPostMessageType.Transform && translate && scale) {
                    const res = this.setTransform(translate, scale);
                    if (res) {
                        const rect1 = res.rect;
                        if (rect1) {
                            renderData.rect = computRect(renderData.rect, rect1);
                            renderData.isClear = true;
                            renderData.isFullWork = true;
                        }
                        sp.push(res);
                    }
                    continue;
                }
                // 更新Offscreen配置
                if (msgType === EPostMessageType.UpdateScene && offscreenCanvasOpt) {
                    const res = this.updateScene(offscreenCanvasOpt)
                    // todo 需要细化个人和主房间的宽高比
                    if (res) {
                        const rect1 = res.rect;
                        if (rect1) {
                            renderData.rect = computRect(renderData.rect, rect1);
                            renderData.isClear = true;
                            renderData.isFullWork = true;
                        }
                        sp.push(res);
                    }
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
                // 移除
                if (msgType === EPostMessageType.RemoveNode && workId && dataType) {
                    if (toolsType === EToolsKey.LaserPen) {
                        continue;
                    }
                    const res = this.remove(workId, dataType);
                    if (res) {
                        const rect1 = res.rect;
                        if (rect1) {
                            renderData.rect = computRect(renderData.rect, rect1);
                            renderData.isClear = true;
                            renderData.isFullWork = true;
                        }
                        if (dataType === EDataType.Local) {
                            sp.push(res);
                        }
                    }
                    continue;
                }
                // 更新已有node配置
                if (msgType === EPostMessageType.UpdateNode && workId && toolsType && updateNodeOpt) {
                    const res = this.updateNode(workId, updateNodeOpt);
                    if (res) {
                        const rect1 = res.rect;
                        if (rect1) {
                            renderData.rect = computRect(renderData.rect, rect1);
                            renderData.isClear = true;
                            renderData.isFullWork = true;
                        }
                        sp.push(res);
                    }
                    continue;
                }
                /** 完整绘制落盘数据 */
                if (msgType === EPostMessageType.FullWork && dataType) {
                    // console.log('workShapes0---1', data)
                    this.consumeFull(dataType, data)
                    continue;
                }
                // 绘制（高频）
                if(msgType === EPostMessageType.DrawWork && dataType) {
                    if (dataType === EDataType.Service || ( dataType === EDataType.Local && (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing))) {
                        const res = this.consumeDraw(dataType, data);
                        // console.log('consumeDraw', res)
                        if (res?.drawCount) {
                            drawCount = res.drawCount;
                        }
                        if (res?.op) {
                            sp.push(res);
                        }
                    }
                    if(workState === EvevtWorkState.Done && workId) {
                        // console.log('consumeDrawAll', data.op)
                        const res = this.consumeDrawAll(dataType, data);
                        if (res) {
                            const rect1 = res.rect;
                            if (rect1) {
                                renderData.rect = computRect(renderData.rect, rect1);
                                renderData.drawCanvas = ECanvasShowType.Bg;
                                renderData.isClear = true;
                                renderData.clearCanvas = ECanvasShowType.Float;
                                renderData.isFullWork = true;
                            }
                            sp.push(res);
                        }
                    }
                    continue;
                }
            }
            const postMsg:IBatchMainMessage = {};
            if (sp.length) {
                postMsg.sp = sp;
            }
            if (renderData.rect || renderData.isClear || renderData.isFullWork) {
                postMsg.render = renderData;
            }
            if (drawCount) {
                postMsg.drawCount = drawCount;
            }
            if(Object.keys(postMsg).length){
                // console.log('postMsg', postMsg)
                this.post(postMsg);
            }
        });
    }
    private remove(workId:IworkId, dataType:EDataType) {
        const nodes = this.getNodes(workId) as spritejs.Path[];
        if (nodes.length) {
            let rect:IRectType|undefined;
            for (const node of nodes) {
                const r = node.getBoundingClientRect();
                rect = computRect(rect, {
                    x: Math.floor(r.x - 10),
                    y: Math.floor(r.y - 10),
                    w: Math.floor(r.width + 20),
                    h: Math.floor(r.height + 20)
                  });
                node.remove();
            }
            return {
                rect,
                type: dataType === EDataType.Local ? EPostMessageType.RemoveNode : EPostMessageType.None
            }
        }
        return;
    }
    private updateNode(workId: IworkId, updateNodeOpt:IUpdateNodeOpt): IMainMessage | undefined {
        const nodes = this.getNodes(workId) as spritejs.Path[];
        if (nodes.length) {
            let rect:IRectType|undefined;
            nodes.forEach(n=>{
                const r = n.getBoundingClientRect();
                n.attr(updateNodeOpt);
                rect = computRect(rect, {
                  x: Math.floor(r.x - 10),
                  y: Math.floor(r.y - 10),
                  w: Math.floor(r.width + 20),
                  h: Math.floor(r.height + 20)
                });
            })
            return {
                rect,
                type: EPostMessageType.UpdateNode
            }
        }
        return undefined;
    }
    protected updateScene(offscreenCanvasOpt:IOffscreenCanvasOptionType) {
        super.updateScene(offscreenCanvasOpt);
        this.fullLayer.setAttribute('width', offscreenCanvasOpt.width);
        this.fullLayer.setAttribute('height', offscreenCanvasOpt.height);
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
        this.fullLayer.removeAllChildren();
        this.drawLayer.removeAllChildren();
        this.localWork.clearAllWorkShapesCache();
        this.serviceWork.clearAllWorkShapesCache();
    }
    private setTransform(translate:[number,number], scale:number) {
        this.setTranslate(translate);
        this.setScale(scale);
        this.fullLayer?.setAttribute('scale', [scale, scale]);
        this.fullLayer.setAttribute('translate', this.translate);
        this.drawLayer?.setAttribute('scale', [scale, scale]);
        this.drawLayer.setAttribute('translate', this.translate);
        const viewport = {
            x: 0 / scale - this.translate[0],
            y: 0 / scale - this.translate[1],
            w: this.fullLayer.width,
            h: this.fullLayer.height,
        }
        const res: IMainMessage = {
            type: EPostMessageType.Transform,
            rect: viewport,
        };
        return res;
    }
    private getRectImageBitmap(rect:IRectType, isFullWork:boolean): Promise<ImageBitmap> {
        const {x, y, w, h} = rect;
        const _scale = this.scale < 1 ? this.scale : 1 + Math.abs(this.scale - 1 );
        const width = this.scale < 1 ?  w / this.scale : w * _scale;
        const height = this.scale < 1 ?  h / this.scale :h * _scale;
        const _x = (x + this.translate[0]) * this.scale;
        const _y = (y + this.translate[1]) * this.scale;
        return createImageBitmap(this.getOffscreen(isFullWork), _x * this.dpr, _y * this.dpr, width * this.dpr,  height * this.dpr, {
            resizeQuality: 'low'
        })
    }
    post(msg: IBatchMainMessage): void {
        const renderData = msg.render;
        if (renderData) {
            // console.log('renderData', renderData);
            (renderData.isFullWork ? this.fullLayer : this.drawLayer).render();
            if (renderData.rect) {
                this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork).then(imageBitmap=>{
                    renderData.imageBitmap = imageBitmap;
                    msg.render = renderData;
                    // console.log('imageBitmap', imageBitmap.width, imageBitmap.height, msg);
                    WorkThreadEngineByWorker._self.postMessage(msg,[imageBitmap]);
                    imageBitmap.close();
                })
                return ;
            }
        }
        WorkThreadEngineByWorker._self.postMessage(msg);
    }
    on(callBack: (msg: IWorkerMessage[]) => void): void {
        onmessage = (e: MessageEvent<IWorkerMessage[]>)=>{
            callBack(e.data)
        }
    }
    consumeDraw(type: EDataType, data: IWorkerMessage): IMainMessage | undefined {
        if (type === EDataType.Local) {
            return this.localWork.consumeDraw(data);
        } 
        if (type === EDataType.Service) {
            this.serviceWork.consumeDraw(data);
        }
    }
    consumeDrawAll(type: EDataType, data: IWorkerMessage): IMainMessage | undefined {
        if (type === EDataType.Local) {
            return this.localWork.consumeDrawAll(data);
        }
    }
    consumeFull(type: EDataType, data: IWorkerMessage) {
        if (type === EDataType.Service) {
            this.serviceWork.consumeFull(data);
        }
    }
}
export const worker = new WorkThreadEngineByWorker();