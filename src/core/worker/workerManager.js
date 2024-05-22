import cloneDeep from "lodash/cloneDeep";
import { EmitEventType } from "../../plugin/types";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey } from "../enum";
import { MethodBuilderWorker } from "../msgEvent/forWorker";
import { SelectorShape } from "../tools";
import { isRenderNode, computRect, getSafetyRect } from "../utils";
import { WorkThreadEngineBase } from "./base";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
import { Storage_ViewId_ALL } from "../../collector/const";
import { Cursor_Hover_Id } from "../const";
export var EWorkThreadType;
(function (EWorkThreadType) {
    EWorkThreadType["Full"] = "full";
    EWorkThreadType["Sub"] = "sub";
})(EWorkThreadType || (EWorkThreadType = {}));
export class WorkerManager {
    constructor(worker, type) {
        Object.defineProperty(this, "_self", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workThreadMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this._self = worker;
        this.type = type;
        this.register();
    }
    init(value) {
        const { viewId, dpr, offscreenCanvasOpt, layerOpt, isSafari } = value;
        if (!dpr || !offscreenCanvasOpt || !layerOpt) {
            return;
        }
        let workThread;
        if (this.type === EWorkThreadType.Full) {
            workThread = new WorkThreadEngineForFullWorker(viewId, {
                dpr,
                offscreenCanvasOpt,
                layerOpt,
            }, this.post.bind(this));
        }
        if (this.type === EWorkThreadType.Sub) {
            workThread = new WorkThreadEngineForSubWorker(viewId, {
                dpr,
                offscreenCanvasOpt,
                layerOpt
            }, this.post.bind(this));
        }
        if (workThread && isSafari) {
            workThread.setIsSafari(isSafari);
        }
        if (workThread && value.cameraOpt) {
            workThread.setCameraOpt(value.cameraOpt);
        }
        workThread && this.workThreadMap.set(viewId, workThread);
    }
    register() {
        onmessage = (e) => {
            // console.log('onmessage- 1', this.type, e.data)
            const data = e.data;
            if (data) {
                for (const value of data.values()) {
                    const { msgType, viewId, tasksqueue, mainTasksqueueCount } = value;
                    if (msgType === EPostMessageType.Init) {
                        this.init(value);
                        continue;
                    }
                    if (msgType === EPostMessageType.TasksQueue && tasksqueue?.size && mainTasksqueueCount) {
                        this.workThreadMap.forEach((workThread, viewId) => {
                            const task = tasksqueue.get(viewId);
                            if (task) {
                                workThread.on(task);
                            }
                            this.post({ workerTasksqueueCount: mainTasksqueueCount });
                        });
                        continue;
                    }
                    if (viewId === Storage_ViewId_ALL) {
                        this.workThreadMap.forEach((workThread) => {
                            workThread.on(value);
                            if (msgType === EPostMessageType.Destroy) {
                                this.workThreadMap.delete(viewId);
                            }
                        });
                        continue;
                    }
                    const workThread = this.workThreadMap.get(viewId);
                    if (!workThread) {
                        continue;
                    }
                    workThread.on(value);
                    if (msgType === EPostMessageType.Destroy) {
                        this.workThreadMap.delete(viewId);
                    }
                }
            }
        };
    }
    post(msg, transfer) {
        // console.log('updateSelector---0---0--00--0', msg)
        if (transfer) {
            this._self.postMessage(msg, transfer);
        }
        else {
            this._self.postMessage(msg);
        }
    }
}
/** full worker */
export class WorkThreadEngineForFullWorker extends WorkThreadEngineBase {
    constructor(viewId, opt, _post) {
        super(viewId, opt);
        Object.defineProperty(this, "serviceDrawLayer", {
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
        Object.defineProperty(this, "snapshotFullLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "methodBuilder", {
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
        Object.defineProperty(this, "_post", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._post = _post;
        this.serviceDrawLayer = this.createLayer('serviceDrawLayer', this.scene, { ...opt.layerOpt, bufferSize: 1000 });
        this.drawLayer = this.createLayer('drawLayer', this.scene, { ...opt.layerOpt, bufferSize: 1000 });
        const subWorkOpt = {
            thread: this,
            viewId: this.viewId,
            vNodes: this.vNodes,
            fullLayer: this.fullLayer,
            drawLayer: this.drawLayer,
            post: this.post.bind(this)
        };
        this.localWork = new LocalWorkForFullWorker(subWorkOpt);
        this.serviceWork = new ServiceWorkForFullWorker({
            ...subWorkOpt,
            serviceDrawLayer: this.serviceDrawLayer
        });
        this.methodBuilder = new MethodBuilderWorker([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode,
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode,
            EmitEventType.ZIndexActive, EmitEventType.ZIndexNode, EmitEventType.SetFontStyle,
            EmitEventType.SetPoint, EmitEventType.SetLock, EmitEventType.SetShapeOpt
        ]).registerForWorker(this.localWork, this.serviceWork, this.scene);
        this.vNodes.init(this.fullLayer, this.drawLayer);
    }
    async post(msg, transfer) {
        const render = msg.render;
        const newRender = [];
        let transfers = transfer;
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
                    const renderLayer = this.getLayer(renderData.isFullWork, renderData.workerType);
                    // console.log('mainEngine---03---005', (renderLayer?.parent as Layer).children.map(c=>c.name));
                    (renderLayer?.parent).render();
                }
                if (renderData.rect) {
                    if (renderData.clearCanvas === renderData.drawCanvas && renderData.drawCanvas === ECanvasShowType.Bg) {
                        renderData.rect = this.checkRightRectBoundingBox(renderData.rect);
                    }
                    const oldRect = renderData.drawCanvas === ECanvasShowType.Selector && renderData.rect;
                    renderData.rect = this.safariFixRect(cloneDeep(renderData.rect));
                    if (!renderData.rect) {
                        continue;
                    }
                    if (renderData.drawCanvas === ECanvasShowType.Selector) {
                        const sp = msg.sp?.find(f => f.type === EPostMessageType.Select);
                        if (sp) {
                            sp.rect = renderData.rect;
                        }
                        if (oldRect) {
                            renderData.offset = {
                                x: renderData.rect.x - oldRect.x,
                                y: renderData.rect.y - oldRect.y,
                            };
                            // console.log('post---000', oldRect, renderData.rect, renderData.offset)
                        }
                        // const translate = renderData.translate || [0,0];
                        // if (renderData.offset.x && translate[0]) {
                        //     renderData.offset.x = renderData.offset.x + translate[0];
                        // }
                        // if (renderData.offset.y && translate[1]) {
                        //     renderData.offset.y = renderData.offset.y + translate[1];
                        // }
                        // console.log('onmessage - post - 4', cloneDeep(renderData))
                    }
                    if (renderData.drawCanvas) {
                        const imageBitmap = await this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork, renderData.workerType);
                        renderData.imageBitmap = imageBitmap;
                        if (!transfers) {
                            transfers = [];
                        }
                        transfers.push(imageBitmap);
                    }
                    newRender.push(renderData);
                }
            }
            msg.render = newRender;
        }
        const rsp = msg.sp?.filter(s => (s.type !== EPostMessageType.None || Object.keys(s).filter(f => f === 'type').length));
        if (rsp?.length) {
            msg.sp = rsp.map(p => ({ ...p, viewId: this.viewId }));
        }
        if (msg.drawCount || msg.workerTasksqueueCount || msg.sp?.length || newRender?.length) {
            // console.log('post', this.fullLayer.children.map(c=>({name:c.name,zIndex:c.getAttribute('zIndex')})), 
            // //     // (this.fullLayer.parent as Layer)?.children?.map(c=>c.name),
            // //     // (this.fullLayer.parent as Layer)?.children?.map(c=>c.id),
            // //     // this.drawLayer?.children.map(c=>c.name).length,
            // //     // (this.drawLayer?.parent as Layer)?.children?.map(c=>c.name).length, 
            // //     // (this.drawLayer?.parent as Layer)?.children?.map(c=>c.id), 
            // )     
            this._post(msg, transfers);
            if (transfers?.length) {
                for (const transfer of transfers) {
                    if (transfer instanceof ImageBitmap) {
                        transfer.close();
                    }
                }
            }
        }
    }
    on(msg) {
        if (this.methodBuilder.consumeForWorker(msg)) {
            return;
        }
        const { msgType, dataType, workId } = msg;
        switch (msgType) {
            case EPostMessageType.UpdateCamera:
                this.updateCamera(msg);
                break;
            case EPostMessageType.Select:
                if (dataType === EDataType.Service) {
                    if (workId === SelectorShape.selectorId) {
                        this.localWork.updateFullSelectWork(msg);
                    }
                    else {
                        this.serviceWork.runSelectWork(msg);
                    }
                }
                break;
            case EPostMessageType.UpdateNode:
            case EPostMessageType.FullWork:
                this.consumeFull(dataType, msg);
                break;
            case EPostMessageType.RemoveNode:
                this.removeNode(msg);
                break;
            case EPostMessageType.GetTextActive:
                this.checkTextActive(msg);
                break;
            case EPostMessageType.CursorHover:
                this.cursorHover(msg);
        }
        super.on(msg);
    }
    async removeNode(data) {
        const { dataType, workId } = data;
        if (workId === SelectorShape.selectorId) {
            this.localWork.blurSelector(data);
            return;
        }
        if (dataType === EDataType.Local) {
            this.localWork.removeWork(data);
            this.localWork.colloctEffectSelectWork(data);
        }
        if (dataType === EDataType.Service) {
            this.serviceWork.removeWork(data);
            this.localWork.colloctEffectSelectWork(data);
        }
    }
    checkTextActive(data) {
        const { dataType } = data;
        if (dataType === EDataType.Local) {
            this.localWork.checkTextActive(data);
        }
    }
    clearAll() {
        this.vNodes.clear();
        super.clearAll();
        if (this.serviceDrawLayer) {
            this.serviceDrawLayer.parent.children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.serviceDrawLayer.removeAllChildren();
        }
        this.post({
            render: [{
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId: this.viewId
                }, {
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                    viewId: this.viewId
                }, {
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.ServiceFloat,
                    isFullWork: false,
                    viewId: this.viewId
                }],
            sp: [{
                    type: EPostMessageType.Clear
                }]
        });
    }
    updateLayer(layerOpt) {
        const { width, height } = layerOpt;
        super.updateLayer(layerOpt);
        if (this.serviceDrawLayer) {
            this.serviceDrawLayer.parent.setAttribute('width', width);
            this.serviceDrawLayer.parent.setAttribute('height', height);
            this.serviceDrawLayer.setAttribute('size', [width, height]);
            this.serviceDrawLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        }
    }
    setCameraOpt(cameraOpt) {
        this.cameraOpt = cameraOpt;
        const { scale, centerX, centerY, width, height } = cameraOpt;
        if (width !== this.scene.width || height !== this.scene.height) {
            this.updateScene({ width, height });
        }
        if (this.fullLayer) {
            this.fullLayer.setAttribute('scale', [scale, scale]);
            this.fullLayer.setAttribute('translate', [-centerX, -centerY]);
        }
        if (this.drawLayer) {
            this.drawLayer.setAttribute('scale', [scale, scale]);
            this.drawLayer.setAttribute('translate', [-centerX, -centerY]);
        }
        if (this.serviceDrawLayer) {
            this.serviceDrawLayer.setAttribute('scale', [scale, scale]);
            this.serviceDrawLayer.setAttribute('translate', [-centerX, -centerY]);
        }
    }
    getLayer(isFullWork, workerType) {
        const layer = isFullWork ? this.fullLayer :
            workerType && workerType === EDataType.Service ? this.serviceDrawLayer : this.drawLayer;
        return layer;
    }
    getOffscreen(isFullWork, workerType) {
        const layerParent = this.getLayer(isFullWork, workerType).parent;
        return layerParent.canvas;
    }
    async consumeFull(type, data) {
        const noLocalEffectData = await this.localWork.colloctEffectSelectWork(data);
        if (noLocalEffectData && type === EDataType.Local) {
            await this.localWork.consumeFull(noLocalEffectData, this.scene);
        }
        if (noLocalEffectData && type === EDataType.Service) {
            this.serviceWork.consumeFull(noLocalEffectData);
        }
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
    updateCamera(msg) {
        // console.log('updateCamera', msg, this.viewId)
        const render = [];
        const { cameraOpt } = msg;
        if (cameraOpt) {
            this.setCameraOpt(cameraOpt);
            // 对进行中的任务进行标记处理
            this.localWork.workShapes.forEach((w, k) => {
                if (w.toolsType === EToolsKey.Pencil ||
                    w.toolsType === EToolsKey.Arrow ||
                    w.toolsType === EToolsKey.Straight ||
                    w.toolsType === EToolsKey.Ellipse ||
                    w.toolsType === EToolsKey.Rectangle ||
                    w.toolsType === EToolsKey.Star ||
                    w.toolsType === EToolsKey.Polygon ||
                    w.toolsType === EToolsKey.SpeechBalloon ||
                    w.toolsType === EToolsKey.Text) {
                    this.localWork.workShapeState.set(k, { willClear: true });
                }
            });
            if (this.vNodes.curNodeMap.size) {
                this.vNodes.updateNodesRect();
                this.localWork.reRenderSelector();
                if (this.serviceWork.selectorWorkShapes.size) {
                    for (const [key, value] of this.serviceWork.selectorWorkShapes.entries()) {
                        this.serviceWork.runSelectWork({
                            workId: key,
                            selectIds: value.selectIds,
                            msgType: EPostMessageType.Select,
                            dataType: EDataType.Service,
                            viewId: this.viewId
                        });
                    }
                }
                let rect;
                const cursorHover = this.localWork.getWorkShape(Cursor_Hover_Id);
                if (cursorHover && cursorHover.selectIds?.length) {
                    // console.log('cursorHover', cursorHover?.selectIds)
                    rect = cursorHover.oldSelectRect;
                    cursorHover.cursorBlur();
                    // console.log('cursorHover---rect', rect)
                }
                // 输出render结果
                if (this.vNodes.hasRenderNodes()) {
                    render.push({
                        isClearAll: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                        viewId: this.viewId
                    }, {
                        isClearAll: true,
                        clearCanvas: ECanvasShowType.Float,
                        isFullWork: false,
                        viewId: this.viewId
                    });
                    for (const node of this.vNodes.curNodeMap.values()) {
                        if (isRenderNode(node.toolsType)) {
                            rect = computRect(rect, node.rect);
                        }
                    }
                    if (rect) {
                        render.push({
                            rect: getSafetyRect(rect, 20),
                            drawCanvas: ECanvasShowType.Bg,
                            isClear: false,
                            isFullWork: true,
                            viewId: this.viewId
                        });
                    }
                }
                if (render.length) {
                    // console.log('cursorHover---post', render)
                    this.post({ render });
                }
            }
        }
    }
    getRectImageBitmap(rect, isFullWork, workerType) {
        const x = rect.x * this.dpr;
        const y = rect.y * this.dpr;
        const w = rect.w * this.dpr;
        const h = rect.h * this.dpr;
        return createImageBitmap(this.getOffscreen(isFullWork, workerType), x, y, w, h);
    }
    safariFixRect(rect) {
        if (rect.w + rect.x <= 0 || rect.h + rect.y <= 0) {
            return undefined;
        }
        if (rect.w <= 0 || rect.h <= 0) {
            return undefined;
        }
        const newRect = {
            x: 0,
            y: 0,
            w: Math.floor(this.scene.width),
            h: Math.floor(this.scene.height)
        };
        if (rect.x < 0) {
            if (rect.w + rect.x < this.scene.width) {
                newRect.w = rect.w + rect.x;
            }
        }
        else if (rect.w + rect.x > 0) {
            newRect.x = rect.x;
            newRect.w = Math.floor(this.scene.width - rect.x);
        }
        if (rect.y < 0) {
            if (rect.h + rect.y < this.scene.height) {
                newRect.h = rect.h + rect.y;
            }
        }
        else if (rect.h + rect.y > 0) {
            newRect.y = rect.y;
            newRect.h = Math.floor(this.scene.height - rect.y);
        }
        if (newRect.w <= 0 || newRect.h <= 0) {
            return undefined;
        }
        return newRect;
    }
    getSceneRect() {
        const { width, height } = this.scene;
        return {
            x: 0,
            y: 0,
            w: Math.floor(width),
            h: Math.floor(height)
        };
    }
    checkRightRectBoundingBox(rect) {
        return this.vNodes.combineIntersectRect(rect);
    }
    cursorHover(msg) {
        this.localWork.cursorHover(msg);
    }
}
/** sub worker */
export class WorkThreadEngineForSubWorker extends WorkThreadEngineBase {
    constructor(viewId, opt, _post) {
        super(viewId, opt);
        Object.defineProperty(this, "_post", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "drawLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "snapshotFullLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "serviceWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "localWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._post = _post;
        const subWorkOpt = {
            thread: this,
            viewId: this.viewId,
            vNodes: this.vNodes,
            fullLayer: this.fullLayer,
            drawLayer: this.drawLayer,
            post: this.post.bind(this)
        };
        this.localWork = new LocalWorkForSubWorker(subWorkOpt);
        this.vNodes.init(this.fullLayer, this.drawLayer);
    }
    async post(msg, transfer) {
        const render = msg.render;
        const newRender = [];
        let transfers = transfer;
        if (render?.length) {
            for (const renderData of render) {
                if (renderData.drawCanvas) {
                    this.fullLayer.parent.render();
                }
                if (renderData.rect) {
                    // if(this.isSafari){
                    renderData.rect = this.safariFixRect(cloneDeep(renderData.rect));
                    // }
                    if (!renderData.rect) {
                        continue;
                    }
                    if (renderData.drawCanvas) {
                        const imageBitmap = await this.getRectImageBitmap(renderData.rect, !!renderData.isFullWork);
                        renderData.imageBitmap = imageBitmap;
                        if (!transfers) {
                            transfers = [];
                        }
                        transfers.push(imageBitmap);
                    }
                    newRender.push(renderData);
                }
            }
            msg.render = newRender;
        }
        const rsp = msg.sp?.filter(s => (s.type !== EPostMessageType.None || Object.keys(s).filter(f => f === 'type').length));
        if (rsp?.length) {
            msg.sp = rsp.map(p => ({ ...p, viewId: this.viewId }));
        }
        if (msg.sp?.length || msg.drawCount || newRender?.length) {
            this._post(msg, transfers);
            if (transfers?.length) {
                for (const transfer of transfers) {
                    if (transfer instanceof ImageBitmap) {
                        transfer.close();
                    }
                }
            }
        }
    }
    on(msg) {
        const { msgType } = msg;
        switch (msgType) {
            case EPostMessageType.UpdateCamera:
                this.updateCamera(msg);
                break;
            case EPostMessageType.Snapshot:
                this.snapshotFullLayer = this.createLayer('snapshotFullLayer', this.scene, { ...this.opt.layerOpt, bufferSize: this.viewId === 'mainView' ? 6000 : 3000 });
                if (this.snapshotFullLayer) {
                    this.getSnapshot(msg).then(() => {
                        this.snapshotFullLayer = undefined;
                    });
                }
                break;
            case EPostMessageType.BoundingBox:
                this.snapshotFullLayer = this.createLayer('snapshotFullLayer', this.scene, { ...this.opt.layerOpt, bufferSize: this.viewId === 'mainView' ? 6000 : 3000 });
                if (this.snapshotFullLayer) {
                    this.getBoundingRect(msg).then(() => {
                        this.snapshotFullLayer = undefined;
                    });
                }
                break;
        }
        super.on(msg);
    }
    getOffscreen(isSnapshot) {
        return (isSnapshot && this.snapshotFullLayer || this.fullLayer).parent?.canvas;
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
        if (rect.w <= 0 || rect.h <= 0) {
            return undefined;
        }
        const newRect = {
            x: 0,
            y: 0,
            w: Math.floor(this.scene.width),
            h: Math.floor(this.scene.height)
        };
        if (rect.x < 0) {
            if (rect.w + rect.x < this.scene.width) {
                newRect.w = rect.w + rect.x;
            }
        }
        else if (rect.w + rect.x > 0) {
            newRect.x = rect.x;
            newRect.w = Math.floor(this.scene.width - rect.x);
        }
        if (rect.y < 0) {
            if (rect.h + rect.y < this.scene.height) {
                newRect.h = rect.h + rect.y;
            }
        }
        else if (rect.h + rect.y > 0) {
            newRect.y = rect.y;
            newRect.h = Math.floor(this.scene.height - rect.y);
        }
        if (newRect.w <= 0 || newRect.h <= 0) {
            return undefined;
        }
        return newRect;
    }
    updateCamera(msg) {
        const { cameraOpt } = msg;
        if (cameraOpt) {
            this.setCameraOpt(cameraOpt);
        }
    }
    setCameraOpt(cameraOpt, layer) {
        this.cameraOpt = cameraOpt;
        const { scale, centerX, centerY, width, height } = cameraOpt;
        if (width !== this.scene.width || height !== this.scene.height) {
            this.updateScene({ width, height });
        }
        if (layer) {
            layer.setAttribute('scale', [scale, scale]);
            layer.setAttribute('translate', [-centerX, -centerY]);
        }
        else {
            this.fullLayer.setAttribute('scale', [scale, scale]);
            this.fullLayer.setAttribute('translate', [-centerX, -centerY]);
        }
    }
    async getSnapshot(data) {
        const { scenePath, scenes, cameraOpt, w, h, maxZIndex } = data;
        if (scenePath && scenes && cameraOpt && this.snapshotFullLayer) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = this.fullLayer;
            let rect;
            const willRenderMap = new Map();
            for (const [key, value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const { toolsType, opt } = value;
                            if (toolsType === EToolsKey.Text && opt) {
                                opt.zIndex = opt.zIndex + (maxZIndex || 0);
                                if ((opt.lineThrough || opt.underline)) {
                                    willRenderMap.set(key, value);
                                }
                            }
                            const r = await this.localWork.runFullWork({
                                ...value,
                                opt,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service,
                                viewId: this.viewId
                            }, toolsType === EToolsKey.Text);
                            rect = computRect(rect, r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            this.localWork.fullLayer = this.fullLayer;
            this.localWork.drawLayer = undefined;
            let options;
            if (w && h) {
                options = {
                    resizeWidth: w,
                    resizeHeight: h,
                };
            }
            if (willRenderMap.size) {
                await new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
                this.willRenderSpecialLabel(willRenderMap);
            }
            await this.getSnapshotRender({ scenePath, curCameraOpt, options });
        }
    }
    willRenderSpecialLabel(willRenderMap) {
        for (const [key, value] of willRenderMap.entries()) {
            const labelGroup = this.snapshotFullLayer?.getElementsByName(key)[0];
            if (labelGroup && value.opt) {
                this.localWork.updateLabels(labelGroup, value);
            }
        }
    }
    async getSnapshotRender(data) {
        const { scenePath, curCameraOpt, options } = data;
        (this.snapshotFullLayer?.parent).render();
        const imageBitmap = await this.getRectImageBitmap({ x: 0, y: 0, w: this.scene.width, h: this.scene.height }, true, options);
        if (imageBitmap) {
            await this.post({
                sp: [{
                        type: EPostMessageType.Snapshot,
                        scenePath,
                        imageBitmap,
                    }]
            }, [imageBitmap]);
            imageBitmap.close();
            this.snapshotFullLayer?.removeAllChildren();
            this.setCameraOpt(curCameraOpt, this.fullLayer);
        }
    }
    async getBoundingRect(data) {
        const { scenePath, scenes, cameraOpt } = data;
        if (scenePath && scenes && cameraOpt && this.snapshotFullLayer) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = this.drawLayer;
            let rect;
            for (const [key, value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const r = await this.localWork.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service,
                                viewId: this.viewId
                            });
                            rect = computRect(rect, r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            if (rect) {
                await this.post({
                    sp: [{
                            type: EPostMessageType.BoundingBox,
                            scenePath,
                            rect
                        }]
                });
            }
            this.localWork.fullLayer = this.fullLayer;
            this.localWork.drawLayer = undefined;
            this.snapshotFullLayer.removeAllChildren();
            this.setCameraOpt(curCameraOpt, this.fullLayer);
        }
    }
}
