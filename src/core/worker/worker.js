import { WorkThreadEngine } from "../base";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { SubLocalWorkForWorker } from "./local";
import { SubServiceWorkForWorker } from "./service";
import { MethodBuilderWorker } from "../msgEvent/forWorker";
import { EmitEventType } from "../../plugin/types";
import { SelectorShape } from "../tools";
import cloneDeep from "lodash/cloneDeep";
import { computRect, isIntersect } from "../utils";
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
        this.drawLayer = this.createLayer(this.scene, { ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height });
        this.fullLayer = this.createLayer(this.scene, { ...layerOpt, width: offscreenCanvasOpt.width, height: offscreenCanvasOpt.height, bufferSize: 5000 });
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
                            // this.localWork.runReverseSelectWork(data);
                            if (workId === SelectorShape.selectorId) {
                                this.localWork.updateFullSelectWork(data);
                            }
                            else {
                                this.serviceWork.runSelectWork(data);
                            }
                        }
                        break;
                    case EPostMessageType.UpdateNode:
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
        this.localWork?.clearAllWorkShapesCache();
        this.serviceWork?.clearAllWorkShapesCache();
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
        this.localWork.workShapes.forEach((w, k) => {
            if (w.toolsType === EToolsKey.Pencil) {
                this.localWork.workShapeState.set(k, { willClear: true });
            }
        });
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
        return createImageBitmap(this.getOffscreen(isFullWork), x, y, w, h);
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
            rect.w = rect.w + rect.x;
            rect.x = 0;
        }
        if (rect.y < 0) {
            rect.h = rect.h + rect.y;
            rect.y = 0;
        }
        return rect;
    }
    getSceneRect() {
        const { width, height } = this.scene;
        return {
            x: 0,
            y: 0,
            w: width,
            h: height
        };
    }
    checkRightRectBoundingBox(rect) {
        let _rect = rect;
        this.localWork.curNodeMap.forEach(v => {
            if (isIntersect(_rect, v.rect)) {
                _rect = computRect(_rect, v.rect);
            }
        });
        return _rect;
    }
    async post(msg) {
        const render = msg.render;
        const newRender = [];
        if (render?.length) {
            for (const renderData of render) {
                if (renderData.isClearAll) {
                    renderData.rect = this.getSceneRect();
                    renderData.isClear = true;
                    delete renderData.isClearAll;
                }
                if (renderData.isDrawAll) {
                    renderData.rect = this.getSceneRect();
                    delete renderData.isDrawAll;
                }
                if (renderData.drawCanvas) {
                    const renderLayer = renderData.isFullWork ? this.fullLayer : this.drawLayer;
                    renderLayer.parent.render();
                }
                if (renderData.rect) {
                    if (renderData.clearCanvas === renderData.drawCanvas && renderData.drawCanvas === ECanvasShowType.Bg) {
                        renderData.rect = this.checkRightRectBoundingBox(renderData.rect);
                    }
                    const oldRect = renderData.rect;
                    renderData.rect = this.safariFixRect(cloneDeep(renderData.rect));
                    if (!renderData.rect) {
                        continue;
                    }
                    if (renderData.drawCanvas === ECanvasShowType.Selector && renderData.clearCanvas === ECanvasShowType.Selector) {
                        const sp = msg.sp?.find(f => f.type === EPostMessageType.Select);
                        if (sp) {
                            sp.rect = renderData.rect;
                        }
                        renderData.offset = {
                            x: renderData.rect.x - oldRect.x,
                            y: renderData.rect.y - oldRect.y,
                        };
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
        const rsp = msg.sp?.filter(s => (s.type !== EPostMessageType.None || Object.keys(s).filter(f => f === 'type').length));
        if (rsp?.length) {
            msg.sp = rsp;
        }
        if (msg.drawCount || rsp?.length || newRender?.length) {
            // console.log('post', this.fullLayer.children.map(c=>c.name), 
            //     (this.fullLayer.parent as Layer)?.children?.map(c=>c.name), 
            //     this.drawLayer?.children.map(c=>c.name),
            //     (this.drawLayer?.parent as Layer)?.children?.map(c=>c.name), 
            // )
            // console.log('post', msg);
            WorkThreadEngineByWorker._self.postMessage(msg);
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
                const render = [];
                if (updateCameraJob) {
                    const { cameraOpt } = updateCameraJob;
                    cameraOpt && this.setCameraOpt(cameraOpt);
                    render.push({
                        isClearAll: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true
                    }, {
                        isClearAll: true,
                        clearCanvas: ECanvasShowType.Float,
                        isFullWork: false
                    });
                    if (this.fullLayer.children.length) {
                        render.push({
                            isDrawAll: true,
                            drawCanvas: ECanvasShowType.Bg,
                            isClear: false,
                            isFullWork: true
                        });
                    }
                }
                if (!hasClearAll && render.length) {
                    this.post({ render });
                }
                else if (hasClearAll) {
                    this.clearAll();
                    this.post({
                        render: [{
                                isClearAll: true,
                                clearCanvas: ECanvasShowType.Bg,
                                isFullWork: true
                            }, {
                                isClearAll: true,
                                clearCanvas: ECanvasShowType.Float,
                                isFullWork: false
                            }],
                        sp: [{
                                type: EPostMessageType.Clear
                            }]
                    });
                }
                callBack(e.data.values());
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
        if (type === EDataType.Local) {
            this.localWork.consumeFull(data);
        }
        const noLocalEffectData = this.localWork.colloctEffectSelectWork(data);
        if (noLocalEffectData && type === EDataType.Service) {
            this.serviceWork.consumeFull(noLocalEffectData);
        }
    }
    removeNode(data) {
        const { dataType, workId } = data;
        if (workId === SelectorShape.selectorId) {
            this.localWork.blurSelector(data);
        }
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
