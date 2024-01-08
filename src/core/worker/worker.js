import { WorkThreadEngine } from "../base";
import { ECanvasShowType, EDataType, EPostMessageType, EvevtWorkState } from "../enum";
import { SubLocalWorkForWorker } from "./local";
import { SubServiceWorkForWorker } from "./service";
import { MethodBuilderWorker } from "../msgEvent/forWorker";
import { EmitEventType } from "../../plugin/types";
export class WorkThreadEngineByWorker extends WorkThreadEngine {
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
        Object.defineProperty(this, "methodBuilder", {
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
        this.drawLayer = this.createLayer({ ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height });
        this.fullLayer = this.createLayer({ ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height, bufferSize: 5000 });
        this.localWork = new SubLocalWorkForWorker(this.curNodeMap, this.fullLayer, this.drawLayer, this.post.bind(this));
        this.serviceWork = new SubServiceWorkForWorker(this.curNodeMap, this.fullLayer, this.drawLayer, this.post.bind(this));
        this.methodBuilder = new MethodBuilderWorker([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode,
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode,
            EmitEventType.ZIndexActive, EmitEventType.ZIndexNode
        ]).registerForWorker(this.localWork, this.serviceWork);
    }
    getOffscreen(isFullWork) {
        const layer = (isFullWork ? this.fullLayer.parent : this.drawLayer.parent);
        return layer.canvas;
    }
    register() {
        this.on((msg) => {
            for (const data of msg) {
                const { workState, dataType, msgType, workId, toolsType, opt } = data;
                if (this.methodBuilder?.consumeForWorker(data)) {
                    continue;
                }
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
                        this.consumeFull(dataType, data);
                        break;
                    case EPostMessageType.DrawWork:
                        if (workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                            this.consumeDrawAll(dataType, data);
                        }
                        else {
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
    updateNode(data) {
        const { dataType } = data;
        if (dataType === EDataType.Service) {
            this.serviceWork.consumeFull(data);
        }
    }
    // protected updateScene(offscreenCanvasOpt:IOffscreenCanvasOptionType) {
    //     super.updateScene(offscreenCanvasOpt);
    //     this.localWork.runEffectWork();
    // }
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
        const removeNodes = [];
        this.localWork.clearAllWorkShapesCache();
        this.serviceWork.clearAllWorkShapesCache();
        this.fullLayer.parent.children.forEach(c => {
            if (c.name !== 'viewport') {
                removeNodes.push(c);
            }
        });
        this.drawLayer.parent.children.forEach(c => {
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
    setCameraOpt(cameraOpt) {
        this.cameraOpt = cameraOpt;
        const { scale, centerX, centerY, width, height } = cameraOpt;
        if (width !== this.scene.width || height !== this.scene.height) {
            this.updateScene({ width, height });
        }
        this.fullLayer.setAttribute('scale', [scale, scale]);
        this.fullLayer.setAttribute('translate', [-centerX, -centerY]);
        this.drawLayer.setAttribute('scale', [scale, scale]);
        this.drawLayer.setAttribute('translate', [-centerX, -centerY]);
        this.localWork.runEffectWork(() => {
            if (this.serviceWork.selectorWorkShapes.size) {
                for (const [key, value] of this.serviceWork.selectorWorkShapes.entries()) {
                    this.serviceWork.runSelectWork({
                        workId: key,
                        selectIds: value.selectIds,
                        msgType: EPostMessageType.Select,
                        dataType: EDataType.Service
                    });
                }
            }
        });
    }
    getRectImageBitmap(rect, isFullWork) {
        const x = rect.x * this.dpr;
        const y = rect.y * this.dpr;
        const w = rect.w * this.dpr;
        const h = rect.h * this.dpr;
        return createImageBitmap(this.getOffscreen(isFullWork), x, y, w, h, {
            resizeQuality: 'low'
        });
    }
    post(msg) {
        const renderData = msg.render;
        if (renderData) {
            // console.log('post1', renderData.rect);
            ((renderData.isFullWork ? this.fullLayer : this.drawLayer)?.parent).render();
            if (renderData.rect) {
                if (renderData.drawCanvas) {
                    this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork).then(imageBitmap => {
                        renderData.imageBitmap = imageBitmap;
                        msg.render = renderData;
                        WorkThreadEngineByWorker._self.postMessage(msg, [imageBitmap]);
                        imageBitmap.close();
                    });
                    return;
                }
            }
        }
        WorkThreadEngineByWorker._self.postMessage(msg);
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
                const updateCameraJob = e.data.get('UpdateCamera');
                const isFullRender = !!(hasClearAll || updateCameraJob);
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
            this.localWork.consumeDraw(data, this.serviceWork);
        }
        if (type === EDataType.Service) {
            this.serviceWork.consumeDraw(data);
        }
    }
    consumeDrawAll(type, data) {
        if (type === EDataType.Local) {
            this.localWork.consumeDrawAll(data, this.serviceWork);
        }
    }
    consumeFull(type, data) {
        if (type === EDataType.Service) {
            this.serviceWork.consumeFull(data);
        }
        if (type === EDataType.Local) {
            this.localWork.consumeFull(data);
        }
    }
    removeNode(data) {
        const { dataType } = data;
        if (dataType === EDataType.Service) {
            this.serviceWork.removeWork(data);
        }
        if (dataType === EDataType.Local) {
            this.localWork.removeWork(data);
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
