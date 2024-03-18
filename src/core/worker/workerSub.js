import { WorkThreadEngine } from "../base";
import { EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import { SubLocalDrawWorkForWorker } from "./localSubDraw";
import cloneDeep from "lodash/cloneDeep";
import { computRect } from "../utils";
export class SubWorkThreadEngineByWorker extends WorkThreadEngine {
    constructor() {
        super();
        Object.defineProperty(this, "cameraOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        Object.defineProperty(this, "snapshotFullLayer", {
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
        this.register();
    }
    init(dpr, offscreenCanvasOpt, layerOpt) {
        this.dpr = dpr;
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer(this.scene, { ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height });
        this.snapshotFullLayer = this.createLayer(this.scene, { ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height, bufferSize: 5000 });
        this.localWork = new SubLocalDrawWorkForWorker(this.curNodeMap, this.drawLayer, this.post.bind(this));
    }
    getOffscreen(isSnapshot) {
        return (isSnapshot && this.snapshotFullLayer || this.drawLayer).parent?.canvas;
    }
    register() {
        this.on((msg) => {
            for (const data of msg) {
                const { workState, dataType, msgType, workId, toolsType, opt } = data;
                switch (msgType) {
                    case EPostMessageType.Snapshot:
                        this.getSnapshot(data);
                        break;
                    case EPostMessageType.BoundingBox:
                        this.getBoundingRect(data);
                        break;
                    case EPostMessageType.UpdateTools:
                        if (toolsType && opt) {
                            this.setToolsOpt({
                                toolsType,
                                toolsOpt: opt
                            });
                        }
                        break;
                    case EPostMessageType.CreateWork:
                        if (workId && opt) {
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
                        }
                        break;
                    case EPostMessageType.DrawWork:
                        if (workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                            this.consumeDrawAll(dataType, data);
                        }
                        else {
                            this.consumeDraw(dataType, data);
                        }
                        break;
                }
            }
        });
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
        this.drawLayer.removeAllChildren();
        this.localWork.clearAllWorkShapesCache();
    }
    setCameraOpt(cameraOpt, layer) {
        this.cameraOpt = cameraOpt;
        const { scale, centerX, centerY, width, height } = cameraOpt;
        if (width !== this.scene.width || height !== this.scene.height) {
            this.updateScene({ width, height });
        }
        layer.setAttribute('scale', [scale, scale]);
        layer.setAttribute('translate', [-centerX, -centerY]);
    }
    getRectImageBitmap(rect, isSnapshot = false, options) {
        const x = rect.x * this.dpr;
        const y = rect.y * this.dpr;
        const w = rect.w * this.dpr;
        const h = rect.h * this.dpr;
        return createImageBitmap(this.getOffscreen(isSnapshot), x, y, w, h, options);
    }
    safariFixRect(rect) {
        if (rect.w + rect.x <= 0 || rect.h + rect.y <= 0) {
            return undefined;
        }
        if (rect.w + rect.x > this.scene.width) {
            rect.w = this.scene.width - Math.max(rect.x, 0);
        }
        if (rect.h + rect.y > this.scene.width) {
            rect.h = this.scene.height - Math.max(rect.y, 0);
        }
        if (rect.w <= 0 || rect.h <= 0) {
            return undefined;
        }
        if (rect.x < 0) {
            rect.x = 0;
        }
        if (rect.y < 0) {
            rect.y = 0;
        }
        return rect;
    }
    async post(msg) {
        const render = msg.render;
        const newRender = [];
        if (render?.length) {
            for (const renderData of render) {
                if (renderData.drawCanvas) {
                    this.drawLayer.parent.render();
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
            // console.log('post1', msg);
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
    on(callBack) {
        onmessage = (e) => {
            if (e.data) {
                // 优先级 init=》draw=》fullWork=》serviceWork=》updateCamera=》clearAll
                const initJob = e.data.get('Init');
                if (initJob) {
                    const { dpr, offscreenCanvasOpt, layerOpt } = initJob;
                    if (offscreenCanvasOpt && layerOpt && dpr) {
                        this.init(dpr, offscreenCanvasOpt, layerOpt);
                    }
                }
                const hasClearAll = e.data.has('ClearAll');
                const updateCameraJob = e.data.get('UpdateCamera');
                if (updateCameraJob) {
                    const { cameraOpt } = updateCameraJob;
                    cameraOpt && this.setCameraOpt(cameraOpt, this.drawLayer);
                }
                if (hasClearAll) {
                    this.clearAll();
                }
                callBack(e.data.values());
            }
        };
    }
    consumeDraw(type, data) {
        if (type === EDataType.Local) {
            this.localWork.consumeDraw(data);
        }
    }
    consumeDrawAll(_type, data) {
        this.localWork.consumeDrawAll(data);
        return;
    }
    async getSnapshot(data) {
        const { scenePath, scenes, cameraOpt, w, h } = data;
        if (scenePath && scenes && cameraOpt) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = this.drawLayer;
            for (const [key, value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork:
                            this.localWork.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
            this.localWork.fullLayer = this.drawLayer;
            this.localWork.drawLayer = undefined;
            let options;
            if (w && h) {
                options = {
                    resizeWidth: w,
                    resizeHeight: h,
                };
            }
            this.snapshotFullLayer.parent.render();
            const imageBitmap = await this.getRectImageBitmap({ x: 0, y: 0, w: this.scene.width, h: this.scene.height }, true, options);
            if (imageBitmap) {
                SubWorkThreadEngineByWorker._self.postMessage({
                    sp: [{
                            type: EPostMessageType.Snapshot,
                            scenePath,
                            imageBitmap,
                        }]
                }, [imageBitmap]);
                imageBitmap.close();
                this.snapshotFullLayer.removeAllChildren();
                this.setCameraOpt(curCameraOpt, this.drawLayer);
            }
        }
    }
    getBoundingRect(data) {
        const { scenePath, scenes, cameraOpt } = data;
        if (scenePath && scenes && cameraOpt) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = this.drawLayer;
            let rect;
            for (const [key, value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork:
                            this.localWork.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
            this.localWork.computNodeMap();
            this.curNodeMap.forEach((r, key) => {
                if (r.rect) {
                    rect = computRect(rect, {
                        x: Math.floor((r.rect.x - this.snapshotFullLayer.worldPosition[0]) / this.snapshotFullLayer.worldScaling[0]),
                        y: Math.floor((r.rect.y - this.snapshotFullLayer.worldPosition[1]) / this.snapshotFullLayer.worldScaling[1]),
                        w: Math.floor(r.rect.w / this.snapshotFullLayer.worldScaling[0]),
                        h: Math.floor(r.rect.h / this.snapshotFullLayer.worldScaling[1]),
                    });
                    this.curNodeMap.delete(key);
                }
            });
            if (rect) {
                SubWorkThreadEngineByWorker._self.postMessage({
                    sp: [{
                            type: EPostMessageType.BoundingBox,
                            scenePath,
                            rect,
                        }]
                });
            }
            this.localWork.fullLayer = this.drawLayer;
            this.localWork.drawLayer = undefined;
            this.snapshotFullLayer.removeAllChildren();
            this.setCameraOpt(curCameraOpt, this.drawLayer);
        }
    }
}
Object.defineProperty(SubWorkThreadEngineByWorker, "_self", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: self
});
export const worker = new SubWorkThreadEngineByWorker();
