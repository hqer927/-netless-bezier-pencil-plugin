import { WorkThreadEngine } from "../base";
import { ECanvasShowType, EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import { SubLocalDrawWorkForWorker } from "./localSubDraw";
export class SubWorkThreadEngineByWorker extends WorkThreadEngine {
    constructor() {
        super();
        Object.defineProperty(this, "cameraOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lockId", {
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
        this.scene = this.createScene(offscreenCanvasOpt);
        this.drawLayer = this.createLayer({ ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height });
        this.localWork = new SubLocalDrawWorkForWorker(this.drawLayer, this.post.bind(this));
    }
    getOffscreen() {
        return this.drawLayer.parent?.canvas;
    }
    register() {
        this.on((msg) => {
            for (const data of msg) {
                const { workState, dataType, msgType, workId, toolsType, opt } = data;
                switch (msgType) {
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
    updateScene(offscreenCanvasOpt) {
        super.updateScene(offscreenCanvasOpt);
        // this.drawLayer.setAttribute('width', offscreenCanvasOpt.width);
        // this.drawLayer.setAttribute('height', offscreenCanvasOpt.height);
        // const viewport = {
        //     x: 0 / this.scale - this.translate[0],
        //     y: 0 / this.scale - this.translate[1],
        //     w: offscreenCanvasOpt.width,
        //     h: offscreenCanvasOpt.height,
        // }
        // const res: IMainMessage = {
        //     type: EPostMessageType.UpdateScene,
        //     rect: viewport
        // };
        // return res;
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
    setCameraOpt(cameraOpt) {
        this.cameraOpt = cameraOpt;
        const { scale, centerX, centerY } = cameraOpt;
        this.drawLayer.setAttribute('scale', [scale, scale]);
        this.drawLayer.setAttribute('translate', [-centerX, -centerY]);
    }
    getRectImageBitmap(rect) {
        const x = rect.x * this.dpr;
        const y = rect.y * this.dpr;
        const w = rect.w * this.dpr;
        const h = rect.h * this.dpr;
        // if (this.cameraOpt) {
        //     const {scale,centerX,centerY} = this.cameraOpt;
        //     w = w * scale;
        //     h = h * scale;
        //     x = ((rect.x - centerX) * scale + this.scene.width/2) * this.dpr;
        //     y = ((rect.y - centerY) * scale + this.scene.height/2) * this.dpr;  
        // }
        return createImageBitmap(this.getOffscreen(), x, y, w, h, {
            resizeQuality: 'low'
        });
    }
    post(msg) {
        if (this.lockId) {
            msg.lockId = this.lockId;
            this.lockId = undefined;
        }
        const renderData = msg.render;
        if (renderData) {
            this.drawLayer.parent.render();
            if (renderData.rect) {
                this.getRectImageBitmap(renderData.rect).then(imageBitmap => {
                    renderData.imageBitmap = imageBitmap;
                    msg.render = renderData;
                    SubWorkThreadEngineByWorker._self.postMessage(msg, [imageBitmap]);
                    imageBitmap.close();
                });
                return;
            }
        }
        SubWorkThreadEngineByWorker._self.postMessage(msg);
    }
    on(callBack) {
        onmessage = (e) => {
            if (e.data) {
                // 优先级 init=》draw=》fullWork=》serviceWork=》updateScene=》updateCamera=》clearAll
                const initJob = e.data.get('Init');
                if (initJob) {
                    const { dpr, offscreenCanvasOpt, layerOpt } = initJob;
                    if (offscreenCanvasOpt && layerOpt && dpr) {
                        this.init(dpr, offscreenCanvasOpt, layerOpt);
                    }
                }
                callBack(e.data.values());
                const hasClearAll = e.data.has('ClearAll');
                const updateSceneJob = e.data.get('UpdateScene');
                const updateCameraJob = e.data.get('UpdateCamera');
                const isFullRender = !!(hasClearAll || updateSceneJob || updateCameraJob);
                if (updateSceneJob) {
                    const { offscreenCanvasOpt } = updateSceneJob;
                    offscreenCanvasOpt && this.updateScene(offscreenCanvasOpt);
                }
                if (updateCameraJob) {
                    const { cameraOpt } = updateCameraJob;
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
                    });
                }
                if (hasClearAll) {
                    this.clearAll();
                }
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
    consumeFull() {
        return;
    }
}
Object.defineProperty(SubWorkThreadEngineByWorker, "_self", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: self
});
export const worker = new SubWorkThreadEngineByWorker();
