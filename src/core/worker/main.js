/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { Storage_Selector_key } from "../../collector";
import { MainEngine } from "../base";
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import SWorker from './worker.ts?worker&inline';
import SubWorker from './workerSub.ts?worker&inline';
import { BezierPencilDisplayer, BezierPencilManager } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import cloneDeep from "lodash/cloneDeep";
import { MethodBuilderMain } from "../msgEvent";
import { requestAsyncCallBack } from "../utils";
import { UndoRedoMethod } from "../../undo";
export class MainEngineForWorker extends MainEngine {
    constructor(collector, cursor, options) {
        super(BezierPencilDisplayer.instance, collector);
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        // private browserName:string;
        Object.defineProperty(this, "threadEngine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pluginOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "layerOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "msgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "offscreenCanvasOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // 坐标系原点
        Object.defineProperty(this, "originalPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [0, 0]
        });
        Object.defineProperty(this, "cameraOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "localPointsBatchData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "taskBatchData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "currentToolsData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentLocalWorkData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animationId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "subWorker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "subWorkerDrawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "wokerDrawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "maxDrawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "cacheDrawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "reRenders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "bgCanvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "floatCanvas", {
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
        Object.defineProperty(this, "zIndexNodeMethod", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "localEventTimerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "undoTickerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "snapshotMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "boundingRectMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "cursor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cachePoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clearAllResolve", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.cursor = cursor;
        this.bgCanvas = BezierPencilDisplayer.instance.canvasBgRef;
        this.floatCanvas = BezierPencilDisplayer.instance.canvasFloatRef;
        if (this.bgCanvas && this.floatCanvas) {
            this.pluginOptions = options;
            MainEngineForWorker.maxLastSyncTime = (options?.syncOpt?.interval || MainEngineForWorker.maxLastSyncTime) * 0.5;
            this.msgEmitter = new SWorker();
            const screenCanvasOpt = {
                ...MainEngineForWorker.defaultScreenCanvasOpt,
                ...this.pluginOptions?.canvasOpt,
                width: this.bgCanvas.offsetWidth,
                height: this.bgCanvas.offsetHeight,
            };
            this.offscreenCanvasOpt = screenCanvasOpt;
            this.layerOpt = MainEngineForWorker.defauleLayerOpt;
            this.setLayerOpt(this.layerOpt);
            this.setCurrentLocalWorkData({
                workId: undefined,
                workState: EvevtWorkState.Pending
            });
            this.internalMsgEmitterListener();
            this.on();
        }
        BezierPencilManager.InternalMsgEmitter.on([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], this.sendCursorEvent.bind(this));
    }
    sendCursorEvent(p) {
        if (this.currentLocalWorkData.workState === EvevtWorkState.Freeze || this.currentLocalWorkData.workState === EvevtWorkState.Unwritable) {
            return;
        }
        let point = [undefined, undefined];
        if (this.currentToolsData && (this.currentToolsData.toolsType === EToolsKey.LaserPen || this.currentToolsData.toolsType === EToolsKey.Pencil)) {
            if (this.currentLocalWorkData.workState !== EvevtWorkState.Start && this.currentLocalWorkData.workState !== EvevtWorkState.Doing) {
                point = p;
            }
        }
        // console.log('sendCursorEvent', point, this.cachePoint)
        if (!this.cachePoint || this.cachePoint[0] !== point[0] || this.cachePoint[1] !== point[1]) {
            this.cursor.sendEvent(point);
            this.cachePoint = point;
        }
    }
    internalMsgEmitterListener() {
        if (this.collector) {
            this.methodBuilder = new MethodBuilderMain([
                EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode,
                EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode,
                EmitEventType.ZIndexActive, EmitEventType.ZIndexNode, EmitEventType.RotateNode
            ]).registerForMainEngine(InternalMsgEmitterType.MainEngine, this, this.collector);
            this.zIndexNodeMethod = this.methodBuilder?.getBuilder(EmitEventType.ZIndexNode);
        }
        BezierPencilManager.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        BezierPencilManager.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
        BezierPencilManager.InternalMsgEmitter?.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
    }
    showFloatBar(show) {
        if (show) {
            window.addEventListener('beforeunload', this.removeSelectorFromStore.bind(this));
        }
        else {
            window.removeEventListener('beforeunload', this.removeSelectorFromStore.bind(this));
        }
    }
    removeSelectorFromStore() {
        this.collector.dispatch({
            type: EPostMessageType.Select,
            selectIds: undefined
        });
    }
    internalMsgEmitterRemoveListener() {
        this.methodBuilder?.destroy();
        BezierPencilManager.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        BezierPencilManager.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
    }
    createSceneLintener(width, height, dpr) {
        this.offscreenCanvasOpt = {
            ...this.offscreenCanvasOpt,
            width,
            height
        };
        this.dpr = dpr;
        this.originalPoint = [width / 2, height / 2];
        this.cameraOpt = {
            centerX: 0,
            centerY: 0,
            scale: 1,
            width: width,
            height: height,
        };
        this.createThreadEngine();
        this.createOptimizationWorker();
    }
    originalEventLintener(workState, point) {
        switch (workState) {
            case EvevtWorkState.Start:
                this.onLocalEventStart(point);
                break;
            case EvevtWorkState.Doing:
                this.onLocalEventDoing(point);
                break;
            case EvevtWorkState.Done:
                this.onLocalEventEnd(point);
                break;
            default:
                break;
        }
    }
    destroySubWorker() {
        if (this.subWorker) {
            this.subWorker.terminate();
            this.subWorker = undefined;
        }
    }
    createThreadEngine() {
        this.taskBatchData.set('Init', {
            msgType: EPostMessageType.Init,
            dataType: EDataType.Local,
            offscreenCanvasOpt: this.offscreenCanvasOpt,
            layerOpt: this.layerOpt,
            dpr: this.dpr,
            isRunSubWork: true,
        });
        this.runAnimation();
    }
    render(datas) {
        for (const data of datas) {
            const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas, offset } = data;
            // console.log('render', data)
            if (rect) {
                const w = rect.w * this.dpr;
                const h = rect.h * this.dpr;
                const x = rect.x * this.dpr;
                const y = rect.y * this.dpr;
                if (isClear) {
                    if (clearCanvas === ECanvasShowType.Selector) {
                        this.displayer.floatBarCanvasRef.current?.getContext('2d')?.clearRect(0, 0, w, h);
                    }
                    else {
                        const removeCtx = clearCanvas === ECanvasShowType.Float ? this.floatCanvas?.getContext('2d') : this.bgCanvas?.getContext('2d');
                        removeCtx?.clearRect(x, y, w, h);
                    }
                }
                if (drawCanvas && imageBitmap) {
                    if (drawCanvas === ECanvasShowType.Selector) {
                        const cx = (offset?.x || 0) * this.dpr;
                        const cy = (offset?.y || 0) * this.dpr;
                        this.displayer.floatBarCanvasRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, cx, cy, w, h);
                    }
                    else {
                        const ctx = drawCanvas === ECanvasShowType.Float ? this.floatCanvas?.getContext('2d') : this.bgCanvas?.getContext('2d');
                        ctx?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                    }
                }
                if (isUnClose) {
                    return;
                }
                imageBitmap?.close();
            }
        }
    }
    runAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    setLayerOpt(layerOpt) {
        this.layerOpt = layerOpt;
    }
    updateCanvas(opt) {
        const { width, height } = opt;
        if (this.bgCanvas && this.floatCanvas) {
            this.bgCanvas.width = width * this.dpr;
            this.bgCanvas.height = height * this.dpr;
            this.floatCanvas.width = width * this.dpr;
            this.floatCanvas.height = height * this.dpr;
        }
        this.originalPoint = [width * 0.5, height * 0.5];
        // console.log('this.originalPoint', this.originalPoint)
        this.offscreenCanvasOpt.width = width;
        this.offscreenCanvasOpt.height = height;
    }
    pushPoint(point) {
        this.localPointsBatchData.push(point[0], point[1]);
    }
    transformToScenePoint(p) {
        const point = p;
        const { scale, centerX, centerY } = this.cameraOpt;
        if (this.originalPoint) {
            point[0] = (p[0] - this.originalPoint[0]) / scale + centerX;
            point[1] = (p[1] - this.originalPoint[1]) / scale + centerY;
        }
        return point;
    }
    transformToOriginPoint(p) {
        const point = p;
        const { scale, centerX, centerY } = this.cameraOpt;
        if (this.originalPoint) {
            point[0] = (p[0] - centerX) * scale + this.originalPoint[0];
            point[1] = (p[1] - centerY) * scale + this.originalPoint[1];
        }
        return point;
    }
    getCameraOpt() {
        return this.cameraOpt;
    }
    getDpr() {
        return this.dpr;
    }
    initSyncData(callBack) {
        const store = this.collector?.storage;
        if (store) {
            let minZIndex;
            let maxZIndex;
            for (const key of Object.keys(store)) {
                callBack && callBack(key, store[key]);
                const msgType = store[key]?.type;
                if (msgType && key) {
                    const data = cloneDeep(store[key]);
                    data.workId = key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    data.useAnimation = false;
                    this.taskBatchData.set(`${data.dataType},${data.msgType},${data.workId}`, data);
                    if (data.opt?.zIndex) {
                        maxZIndex = Math.max(maxZIndex || 0, data.opt.zIndex);
                        minZIndex = Math.min(minZIndex || Infinity, data.opt.zIndex);
                    }
                }
            }
            this.runAnimation();
            if (this.zIndexNodeMethod) {
                if (maxZIndex)
                    this.zIndexNodeMethod.maxZIndex = maxZIndex;
                if (minZIndex)
                    this.zIndexNodeMethod.minZIndex = minZIndex;
            }
        }
    }
    getRelevantWork(diff) {
        let relevantId;
        for (const [key, value] of Object.entries(diff)) {
            if (value) {
                const { newValue, oldValue } = value;
                if (!newValue && oldValue) {
                    const isRelevant = Object.keys(diff).some(k => {
                        if (k !== key && k.indexOf(`${key}_s_`) > -1) {
                            relevantId = key;
                            return true;
                        }
                        return false;
                    });
                    if (isRelevant) {
                        break;
                    }
                }
            }
        }
        return relevantId;
    }
    onServiceDerive(key, data, relevantId) {
        const { newValue, oldValue } = data;
        const msg = cloneDeep(newValue) || {};
        const workId = key;
        let msgType = msg.type;
        if (!newValue && oldValue) {
            msgType = EPostMessageType.RemoveNode;
            if (oldValue.toolsType === EToolsKey.LaserPen) {
                return;
            }
        }
        if (msgType && workId) {
            const data = msg;
            data.workId = this.collector.isOwn(workId) ? this.collector.getLocalId(workId) : workId;
            data.msgType = msgType;
            data.dataType = EDataType.Service;
            if (data.selectIds) {
                data.selectIds = data.selectIds.map(id => {
                    return this.collector.isOwn(id) ? this.collector.getLocalId(id) : id;
                });
            }
            if (relevantId === key) {
                // console.log('onServiceDerive1', data)
                setTimeout(() => {
                    this.taskBatchData.set(`${data.dataType},${data.msgType},${data.workId}`, data);
                    this.runAnimation();
                }, 16);
            }
            else {
                // console.log('onServiceDerive', data)
                this.taskBatchData.set(`${data.dataType},${data.msgType},${data.workId}`, data);
            }
        }
        this.runAnimation();
        if (this.zIndexNodeMethod) {
            let minZIndex;
            let maxZIndex;
            if (data.newValue && data.newValue.opt?.zIndex) {
                maxZIndex = Math.max(maxZIndex || 0, data.newValue.opt.zIndex);
                minZIndex = Math.min(minZIndex || Infinity, data.newValue.opt.zIndex);
            }
            if (maxZIndex)
                this.zIndexNodeMethod.maxZIndex = maxZIndex;
            if (minZIndex)
                this.zIndexNodeMethod.minZIndex = minZIndex;
        }
    }
    onLocalEventEnd(point) {
        const workState = this.currentLocalWorkData.workState;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
            const _point = this.transformToScenePoint(point);
            this.pushPoint(_point);
            this.localEventTimerId = setTimeout(() => {
                this.localEventTimerId = undefined;
                this.setCurrentLocalWorkData({ workId: this.currentLocalWorkData.workId, workState: EvevtWorkState.Done });
                this.runAnimation();
            }, 0);
            if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                BezierPencilManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], 2);
            }
        }
    }
    onLocalEventDoing(point) {
        let workState = this.currentLocalWorkData.workState;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (workState === EvevtWorkState.Start) {
            workState = EvevtWorkState.Doing;
            this.setCurrentLocalWorkData({ workId: this.currentLocalWorkData.workId, workState });
        }
        if (workState === EvevtWorkState.Doing || this.localEventTimerId) {
            const _point = this.transformToScenePoint(point);
            this.pushPoint(_point);
            if (!this.localEventTimerId) {
                this.runAnimation();
            }
        }
    }
    onLocalEventStart(point) {
        const { workState } = this.currentLocalWorkData;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        const workId = this.currentToolsData.toolsType === EToolsKey.Selector ? Storage_Selector_key : Date.now();
        const opt = cloneDeep(this.currentToolsData.toolsOpt);
        if (this.currentToolsData.toolsType === EToolsKey.Pencil && this.zIndexNodeMethod) {
            this.zIndexNodeMethod.addMaxLayer();
            opt.zIndex = this.zIndexNodeMethod.maxZIndex;
            // console.log('zIndex---000', opt.zIndex)
        }
        this.setCurrentLocalWorkData({
            workId,
            workState: EvevtWorkState.Start,
            toolsOpt: opt
        }, EPostMessageType.CreateWork);
        const _point = this.transformToScenePoint(point);
        this.pushPoint(_point);
        this.maxDrawCount = 0;
        this.cacheDrawCount = 0;
        this.wokerDrawCount = 0;
        this.subWorkerDrawCount = 0;
        this.reRenders.length = 0;
        if (this.currentToolsData.toolsType === EToolsKey.Pencil ||
            this.currentToolsData.toolsType === EToolsKey.Eraser ||
            this.currentToolsData.toolsType === EToolsKey.Selector) {
            if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                this.undoTickerId = Date.now();
            }
            else {
                this.undoTickerId = workId;
            }
            UndoRedoMethod.emitter.emit("undoTickerStart", this.undoTickerId);
        }
        if (this.currentToolsData.toolsType === EToolsKey.Pencil || this.currentToolsData.toolsType === EToolsKey.LaserPen) {
            this.collector?.dispatch({
                type: EPostMessageType.CreateWork,
                workId,
                toolsType: this.currentToolsData.toolsType,
                opt: this.currentToolsData.toolsOpt
            });
            if (this.collector.hasSelector()) {
                this.taskBatchData.set(Storage_Selector_key, {
                    workId: Storage_Selector_key,
                    selectIds: [],
                    msgType: EPostMessageType.Select,
                    dataType: EDataType.Service,
                });
            }
        }
        else if (this.currentToolsData.toolsType === EToolsKey.Selector) {
            BezierPencilManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], -1);
        }
        this.consume();
    }
    consume() {
        this.animationId = undefined;
        const workState = this.currentLocalWorkData.workState;
        let isAble = false;
        if (!this.localEventTimerId) {
            if (this.localPointsBatchData.length) {
                const isRunSubWork = this.currentToolsData.toolsType === EToolsKey.Pencil || this.currentToolsData.toolsType === EToolsKey.LaserPen;
                if (this.wokerDrawCount !== Infinity && this.wokerDrawCount <= this.subWorkerDrawCount && this.cacheDrawCount < this.maxDrawCount) {
                    isAble = true;
                }
                if (!this.maxDrawCount) {
                    isAble = true;
                }
                if (isAble) {
                    this.taskBatchData.set(this.currentLocalWorkData.workId, {
                        op: this.localPointsBatchData.map(n => n),
                        workState,
                        workId: this.currentLocalWorkData.workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        isRunSubWork,
                        undoTickerId: workState === EvevtWorkState.Done && this.undoTickerId || undefined
                    });
                    this.localPointsBatchData.length = 0;
                    this.cacheDrawCount = this.maxDrawCount;
                }
            }
            if (this.taskBatchData.size) {
                // console.log('consume', [...this.taskBatchData.values()])
                this.post(this.taskBatchData);
                this.taskBatchData.clear();
                if (this.undoTickerId && workState === EvevtWorkState.Done) {
                    this.undoTickerId = undefined;
                }
            }
        }
        if (this.taskBatchData.size ||
            this.localPointsBatchData.length) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    post(msg) {
        this.msgEmitter.postMessage(msg);
        const subMsg = new Map();
        for (const [key, value] of msg.entries()) {
            if (key === 'Init' || key === 'ClearAll' || key === 'UpdateCamera') {
                subMsg.set(key, value);
            }
            else if (value.isRunSubWork) {
                subMsg.set(key, value);
            }
        }
        subMsg.size && this.subWorker?.postMessage(subMsg);
    }
    on() {
        this.msgEmitter.onmessage = (e) => {
            if (e.data) {
                const { render, sp, drawCount } = e.data;
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render) {
                    this.render(render);
                    return;
                }
                if (drawCount) {
                    this.wokerDrawCount = drawCount;
                    if (this.wokerDrawCount < Infinity) {
                        this.maxDrawCount = Math.max(this.maxDrawCount, this.wokerDrawCount);
                    }
                    else {
                        this.maxDrawCount = 0;
                    }
                    if (render?.length) {
                        this.render(render);
                        if (this.wokerDrawCount < this.subWorkerDrawCount) {
                            this.reRenders.forEach(r => {
                                r.isUnClose = false;
                            });
                            // console.log('reRenders', this.reRenders.length)
                            this.render(this.reRenders);
                            this.reRenders.length = 0;
                        }
                    }
                }
            }
        };
    }
    createOptimizationWorker() {
        this.subWorker = new SubWorker();
        this.subWorker.onmessage = (e) => {
            if (e.data) {
                const { render, drawCount, sp } = e.data;
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render?.length) {
                    this.render(render);
                    return;
                }
                if (drawCount) {
                    this.subWorkerDrawCount = drawCount;
                    if (this.wokerDrawCount < Infinity) {
                        this.maxDrawCount = Math.max(this.maxDrawCount, this.subWorkerDrawCount);
                    }
                    if (render?.length) {
                        if (this.subWorkerDrawCount > this.wokerDrawCount) {
                            render.forEach(r => r.isUnClose = true);
                            this.reRenders.push(...render);
                        }
                        if (this.wokerDrawCount < Infinity) {
                            this.render(render);
                        }
                    }
                }
            }
        };
    }
    collectorSyncData(sp) {
        let isHasOther = false;
        for (const data of sp) {
            const { type, selectIds, opt, padding, selectRect, nodeColor, nodeOpactiy, willSyncService, isSync, undoTickerId, imageBitmap, scenePath, canvasHeight, canvasWidth, rect, op } = data;
            switch (type) {
                case EPostMessageType.Select:
                    const value = selectIds?.length ? { ...selectRect, selectIds, canvasHeight, canvasWidth } : undefined;
                    if (value && opt?.color) {
                        value.color = opt.color;
                    }
                    if (value && padding) {
                        value.padding = padding;
                    }
                    if (value && nodeColor) {
                        value.nodeColor = nodeColor;
                    }
                    if (value && opt?.opacity) {
                        value.opacity = opt.opacity;
                    }
                    if (value && nodeOpactiy) {
                        value.opacity = nodeOpactiy;
                    }
                    BezierPencilManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], !!value, value);
                    if (willSyncService) {
                        this.collector?.dispatch({ type, selectIds, opt, isSync });
                        if (undoTickerId) {
                            UndoRedoMethod.emitter.emit("undoTickerEnd", undoTickerId);
                        }
                    }
                    break;
                case EPostMessageType.Snapshot:
                    if (imageBitmap && scenePath) {
                        const resolve = this.snapshotMap.get(scenePath);
                        if (resolve) {
                            resolve(imageBitmap);
                        }
                    }
                    break;
                case EPostMessageType.BoundingBox:
                    if (rect && scenePath) {
                        const resolve = this.boundingRectMap.get(scenePath);
                        if (resolve) {
                            resolve(rect);
                        }
                    }
                    break;
                case EPostMessageType.Cursor:
                    if (op) {
                        this.cursor.collectServiceCursor({ ...data });
                    }
                    break;
                case EPostMessageType.Clear:
                    BezierPencilManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], false);
                    this.clearAllResolve && this.clearAllResolve(true);
                    break;
                default:
                    isHasOther = true;
                    break;
            }
        }
        if (isHasOther) {
            requestAsyncCallBack(() => {
                this.collectorAsyncData(sp);
            }, MainEngineForWorker.maxLastSyncTime);
        }
    }
    collectorAsyncData(sp) {
        for (const data of sp) {
            const { type, op, workId, index, removeIds, ops, opt, updateNodeOpt, toolsType, isSync, undoTickerId } = data;
            switch (type) {
                case EPostMessageType.DrawWork:
                    if (op?.length && workId && typeof index === 'number') {
                        this.collector?.dispatch({
                            type,
                            op,
                            workId,
                            index,
                            isSync
                        });
                    }
                    break;
                case EPostMessageType.FullWork:
                    if (ops) {
                        this.collector?.dispatch({ type, ops, workId, updateNodeOpt, opt, toolsType, isSync });
                    }
                    break;
                case EPostMessageType.UpdateNode:
                    if (updateNodeOpt || opt || ops) {
                        this.collector?.dispatch({ type, updateNodeOpt, workId, opt, ops, isSync });
                    }
                    break;
                case EPostMessageType.RemoveNode:
                    if (op || removeIds?.length) {
                        this.collector?.dispatch({ type, removeIds, isSync });
                    }
                    break;
                default:
                    break;
            }
            if (undoTickerId) {
                UndoRedoMethod.emitter.emit("undoTickerEnd", undoTickerId);
            }
        }
    }
    async clearAll(justLocal = false) {
        this.taskBatchData.set('ClearAll', {
            dataType: EDataType.Local,
            msgType: EPostMessageType.Clear,
        });
        this.runAnimation();
        if (!justLocal) {
            const undoTickerId = Date.now();
            UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
            this.collector?.dispatch({
                type: EPostMessageType.Clear
            });
            UndoRedoMethod.emitter.emit("undoTickerEnd", undoTickerId);
        }
        if (this.zIndexNodeMethod) {
            this.zIndexNodeMethod.maxZIndex = 0;
            this.zIndexNodeMethod.minZIndex = 0;
        }
        this.localPointsBatchData.length = 0;
        await new Promise((resolve) => {
            this.clearAllResolve = resolve;
        }).then(() => {
            this.clearAllResolve = undefined;
        });
    }
    unabled() {
        this.setCurrentLocalWorkData({ workState: EvevtWorkState.Freeze, workId: undefined });
    }
    abled() {
        this.setCurrentLocalWorkData({ workState: EvevtWorkState.Pending, workId: undefined });
    }
    destroy() {
        this.msgEmitter?.terminate();
        this.destroySubWorker();
        this.internalMsgEmitterRemoveListener();
    }
    updateNode(workId, updateNodeOpt) {
        this.taskBatchData.set(`${EPostMessageType.UpdateNode},${workId}`, {
            msgType: EPostMessageType.UpdateNode,
            workId,
            updateNodeOpt,
            dataType: EDataType.Local
        });
        this.runAnimation();
    }
    setCurrentLocalWorkData(currentLocalWorkData, msgType = EPostMessageType.None) {
        super.setCurrentLocalWorkData(currentLocalWorkData);
        const { workState, workId, toolsOpt } = currentLocalWorkData;
        if (workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (msgType !== EPostMessageType.None) {
            const toolsType = this.currentToolsData.toolsType;
            this.taskBatchData.set(`${msgType},${workId}`, {
                msgType,
                workId,
                toolsType: toolsType,
                opt: { ...this.currentToolsData.toolsOpt, ...toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime },
                dataType: EDataType.Local,
                isRunSubWork: toolsType === EToolsKey.Pencil || toolsType === EToolsKey.LaserPen
            });
            this.runAnimation();
        }
    }
    setCurrentToolsData(currentToolsData) {
        super.setCurrentToolsData(currentToolsData);
        const toolsType = currentToolsData.toolsType;
        if (this.collector.hasSelector()) {
            const undoTickerId = Date.now();
            UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
            this.taskBatchData.set(Storage_Selector_key, {
                workId: Storage_Selector_key,
                msgType: EPostMessageType.RemoveNode,
                dataType: EDataType.Local,
                undoTickerId
            });
        }
        this.taskBatchData.set(`UpdateTools`, {
            msgType: EPostMessageType.UpdateTools,
            dataType: EDataType.Local,
            toolsType,
            opt: { ...currentToolsData.toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime },
            isRunSubWork: toolsType === EToolsKey.Pencil || toolsType === EToolsKey.LaserPen
        });
        this.runAnimation();
    }
    setCameraOpt(cameraOpt) {
        super.setCameraOpt(cameraOpt);
        // console.log('cameraOpt', cameraOpt.width, cameraOpt.height)
        const { width, height } = cameraOpt;
        if (width !== this.offscreenCanvasOpt.width || height !== this.offscreenCanvasOpt.height) {
            if (this.bgCanvas) {
                this.bgCanvas.style.width = `${width}px`;
                this.bgCanvas.style.height = `${height}px`;
            }
            if (this.floatCanvas) {
                this.floatCanvas.style.width = `${width}px`;
                this.floatCanvas.style.height = `${height}px`;
            }
            this.updateCanvas({ width, height });
        }
        this.taskBatchData.set(`UpdateCamera`, {
            msgType: EPostMessageType.UpdateCamera,
            dataType: EDataType.Local,
            cameraOpt,
            isRunSubWork: true
        });
        this.runAnimation();
    }
    getSnapshot(scenePath, width, height, camera) {
        const cur = this.snapshotMap?.get(scenePath);
        if (!cur) {
            const scenes = this.collector.getNamespaceData(scenePath);
            Object.keys(scenes).forEach(key => {
                if (this.collector.getLocalId(key) === Storage_Selector_key) {
                    delete scenes[key];
                }
            });
            if (Object.keys(scenes).length) {
                const w = width || this.cameraOpt.width;
                const h = height || this.cameraOpt.height;
                const data = {
                    msgType: EPostMessageType.Snapshot,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    w,
                    h,
                    cameraOpt: camera && {
                        ...camera,
                        width: w,
                        height: h,
                    } || this.cameraOpt,
                    isRunSubWork: true
                };
                this.taskBatchData.set(`${data.scenePath}`, data);
                this.runAnimation();
                return new Promise((resolve) => {
                    this.snapshotMap.set(scenePath, resolve);
                }).then((imageBitmap) => {
                    this.snapshotMap.delete(scenePath);
                    return imageBitmap;
                });
            }
        }
    }
    getBoundingRect(scenePath) {
        const cur = this.boundingRectMap?.get(scenePath);
        if (!cur) {
            const scenes = this.collector.getNamespaceData(scenePath);
            Object.keys(scenes).forEach(key => {
                if (this.collector.getLocalId(key) === Storage_Selector_key) {
                    delete scenes[key];
                }
            });
            if (Object.keys(scenes).length) {
                const data = {
                    msgType: EPostMessageType.BoundingBox,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    cameraOpt: this.cameraOpt,
                    isRunSubWork: true
                };
                this.taskBatchData.set(`${data.scenePath}`, data);
                this.runAnimation();
                return new Promise((resolve) => {
                    this.boundingRectMap.set(scenePath, resolve);
                }).then((rect) => {
                    this.boundingRectMap.delete(scenePath);
                    return rect;
                });
            }
        }
    }
}
Object.defineProperty(MainEngineForWorker, "defaultScreenCanvasOpt", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        autoRender: false,
        contextType: ECanvasContextType.Canvas2d,
        // bufferSize: 5000
    }
});
Object.defineProperty(MainEngineForWorker, "defauleLayerOpt", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        offscreen: true,
        handleEvent: false,
        depth: false,
    }
});
Object.defineProperty(MainEngineForWorker, "maxLastSyncTime", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 500
});
