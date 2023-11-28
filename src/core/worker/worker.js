import { WorkThreadEngine } from "../base";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { SubLocalWorkForWorker } from "./local";
import { computRect } from "../utils";
import { SubServiceWorkForWorker } from "./service";
export class WorkThreadEngineByWorker extends WorkThreadEngine {
    constructor() {
        super();
        // private lockId?: number;
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "drawLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fullLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "localWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "serviceWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.register();
    }
    init(dpr, offscreenCanvasOpt, layerOpt) {
        this.dpr = dpr;
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer(layerOpt);
        this.fullLayer = this.createLayer(layerOpt);
        this.localWork = new SubLocalWorkForWorker(this.fullLayer, this.drawLayer, this.post.bind(this));
        this.serviceWork = new SubServiceWorkForWorker(this.fullLayer, this.drawLayer, this.post.bind(this));
    }
    getOffscreen(isFullWork) {
        return (isFullWork ? this.fullLayer : this.drawLayer).canvas;
    }
    register() {
        this.on((msg) => {
            const sp = [];
            const renderData = {};
            let drawCount;
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
                    const res = this.updateScene(offscreenCanvasOpt);
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
                    });
                    continue;
                }
                if (msgType === EPostMessageType.CreateWork && workId && opt) {
                    if (!this.localWork.getTmpWorkShapeNode() && toolsType) {
                        this.setToolsOpt({
                            toolsType,
                            toolsOpt: opt,
                        });
                    }
                    this.setWorkOpt({
                        workId,
                        toolsOpt: opt
                    });
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
                    this.consumeFull(dataType, data);
                    continue;
                }
                // 绘制（高频）
                if (msgType === EPostMessageType.DrawWork && dataType) {
                    if (dataType === EDataType.Service || (dataType === EDataType.Local && (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing))) {
                        const res = this.consumeDraw(dataType, data);
                        // console.log('consumeDraw', res)
                        if (res?.drawCount) {
                            drawCount = res.drawCount;
                        }
                        if (res?.op) {
                            sp.push(res);
                        }
                    }
                    if (workState === EvevtWorkState.Done && workId) {
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
            const postMsg = {};
            if (sp.length) {
                postMsg.sp = sp;
            }
            if (renderData.rect || renderData.isClear || renderData.isFullWork) {
                postMsg.render = renderData;
            }
            if (drawCount) {
                postMsg.drawCount = drawCount;
            }
            if (Object.keys(postMsg).length) {
                // console.log('postMsg', postMsg)
                this.post(postMsg);
            }
        });
    }
    remove(workId, dataType) {
        const nodes = this.getNodes(workId);
        if (nodes.length) {
            let rect;
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
            };
        }
        return;
    }
    updateNode(workId, updateNodeOpt) {
        const nodes = this.getNodes(workId);
        if (nodes.length) {
            let rect;
            nodes.forEach(n => {
                const r = n.getBoundingClientRect();
                n.attr(updateNodeOpt);
                rect = computRect(rect, {
                    x: Math.floor(r.x - 10),
                    y: Math.floor(r.y - 10),
                    w: Math.floor(r.width + 20),
                    h: Math.floor(r.height + 20)
                });
            });
            return {
                rect,
                type: EPostMessageType.UpdateNode
            };
        }
        return undefined;
    }
    updateScene(offscreenCanvasOpt) {
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
        };
        const res = {
            type: EPostMessageType.UpdateScene,
            rect: viewport
        };
        return res;
    }
    setToolsOpt(opt) {
        this.localWork.setToolsOpt(opt);
    }
    setWorkOpt(opt) {
        const { workId, toolsOpt } = opt;
        if (workId && toolsOpt) {
            this.localWork.setWorkOptions(workId, toolsOpt);
        }
    }
    clearAll() {
        this.fullLayer.removeAllChildren();
        this.drawLayer.removeAllChildren();
        this.localWork.clearAllWorkShapesCache();
        this.serviceWork.clearAllWorkShapesCache();
    }
    setTransform(translate, scale) {
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
        };
        const res = {
            type: EPostMessageType.Transform,
            rect: viewport,
        };
        return res;
    }
    getRectImageBitmap(rect, isFullWork) {
        const { x, y, w, h } = rect;
        const _scale = this.scale < 1 ? this.scale : 1 + Math.abs(this.scale - 1);
        const width = this.scale < 1 ? w / this.scale : w * _scale;
        const height = this.scale < 1 ? h / this.scale : h * _scale;
        const _x = (x + this.translate[0]) * this.scale;
        const _y = (y + this.translate[1]) * this.scale;
        return createImageBitmap(this.getOffscreen(isFullWork), _x * this.dpr, _y * this.dpr, width * this.dpr, height * this.dpr, {
            resizeQuality: 'low'
        });
    }
    post(msg) {
        const renderData = msg.render;
        if (renderData) {
            // console.log('renderData', renderData);
            (renderData.isFullWork ? this.fullLayer : this.drawLayer).render();
            if (renderData.rect) {
                this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork).then(imageBitmap => {
                    renderData.imageBitmap = imageBitmap;
                    msg.render = renderData;
                    // console.log('imageBitmap', imageBitmap.width, imageBitmap.height, msg);
                    WorkThreadEngineByWorker._self.postMessage(msg, [imageBitmap]);
                    imageBitmap.close();
                });
                return;
            }
        }
        WorkThreadEngineByWorker._self.postMessage(msg);
    }
    on(callBack) {
        onmessage = (e) => {
            callBack(e.data);
        };
    }
    consumeDraw(type, data) {
        if (type === EDataType.Local) {
            return this.localWork.consumeDraw(data);
        }
        if (type === EDataType.Service) {
            this.serviceWork.consumeDraw(data);
        }
    }
    consumeDrawAll(type, data) {
        if (type === EDataType.Local) {
            return this.localWork.consumeDrawAll(data);
        }
    }
    consumeFull(type, data) {
        if (type === EDataType.Service) {
            this.serviceWork.consumeFull(data);
        }
    }
}
Object.defineProperty(WorkThreadEngineByWorker, "_self", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: self
});
export const worker = new WorkThreadEngineByWorker();
