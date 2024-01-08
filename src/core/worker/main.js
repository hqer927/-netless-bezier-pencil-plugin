import { MainEngine } from "../base";
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import SWorker from './worker.ts?worker&inline';
import SubWorker from './workerSub.ts?worker&inline';
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import cloneDeep from "lodash/cloneDeep";
import { MethodBuilderMain } from "../msgEvent";
export class MainEngineForWorker extends MainEngine {
    constructor(displayer, collector, options, InternalMsgEmitter) {
        super(displayer, collector);
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "InternalMsgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        Object.defineProperty(this, "workerLockId", {
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
        Object.defineProperty(this, "maxDrawCount", {
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
        Object.defineProperty(this, "maxLayerIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "methodBuilder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.bgCanvas = displayer.canvasBgRef;
        this.floatCanvas = displayer.canvasFloatRef;
        if (this.bgCanvas && this.floatCanvas) {
            this.pluginOptions = options;
            MainEngineForWorker.maxLastSyncTime = options?.syncOpt?.interval || MainEngineForWorker.maxLastSyncTime;
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
            this.InternalMsgEmitter = InternalMsgEmitter;
            this.internalMsgEmitterListener();
            this.on();
        }
    }
    internalMsgEmitterListener() {
        if (this.InternalMsgEmitter && this.collector) {
            this.methodBuilder = new MethodBuilderMain([
                EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode,
                EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode,
                EmitEventType.ZIndexActive, EmitEventType.ZIndexNode, EmitEventType.RotateNode
            ]).registerForMainEngine(this.InternalMsgEmitter, InternalMsgEmitterType.MainEngine, this, this.collector);
        }
        this.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        this.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
        this.InternalMsgEmitter?.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
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
        this.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        this.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
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
    createOptimizationWorker() {
        this.subWorker = new SubWorker();
        this.subWorker.onmessage = (e) => {
            if (e.data) {
                const { render, drawCount, sp } = e.data;
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render) {
                    this.render(render);
                    return;
                }
                if (drawCount) {
                    if (drawCount > this.maxDrawCount) {
                        this.maxDrawCount = drawCount;
                    }
                    if (render) {
                        if (drawCount > this.wokerDrawCount) {
                            render.isUnClose = true;
                            this.reRenders.push(render);
                        }
                        this.render(render);
                    }
                }
            }
        };
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
    render(data) {
        const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas } = data;
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
                    this.displayer.floatBarCanvasRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, 0, 0, w, h);
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
    initSyncData(callBack) {
        const store = this.collector?.storage;
        if (store) {
            for (const key of Object.keys(store).filter(f => this.collector.getLocalId(f) !== 'selector')) {
                callBack && callBack(key, store[key]);
                const msgType = store[key]?.type;
                if (msgType && key) {
                    const data = cloneDeep(store[key]);
                    data.workId = key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    data.useAnimation = false;
                    // console.log('data', data)
                    this.taskBatchData.set(`${data.dataType},${data.msgType},${data.workId}`, data);
                    if (data.opt?.zIndex) {
                        this.maxLayerIndex = Math.max(this.maxLayerIndex, data.opt.zIndex);
                    }
                }
            }
            this.runAnimation();
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
        if (msgType === EPostMessageType.Select && this.collector.isOwn(key)) {
            return;
        }
        if (msgType && workId) {
            const data = msg;
            data.workId = this.collector.isOwn(key) ? this.collector.getLocalId(key) : workId;
            data.msgType = msgType;
            data.dataType = EDataType.Service;
            if (data.selectIds) {
                data.selectIds = data.selectIds.map(id => {
                    return this.collector.isOwn(id) ? this.collector.getLocalId(id) : id;
                });
            }
            if (relevantId === key) {
                setTimeout(() => {
                    // console.log('onServiceDerive1', data)
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
    }
    onLocalEventEnd(point) {
        const workState = this.currentLocalWorkData.workState;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
            const _point = this.transformToScenePoint(point);
            this.pushPoint(_point);
            this.setCurrentLocalWorkData({ workId: this.currentLocalWorkData.workId, workState: EvevtWorkState.Done });
            if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                this.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], 2);
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
        if (workState === EvevtWorkState.Doing) {
            const _point = this.transformToScenePoint(point);
            this.pushPoint(_point);
        }
    }
    onLocalEventStart(point) {
        const { workState } = this.currentLocalWorkData;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        const workId = this.currentToolsData.toolsType === EToolsKey.Selector ? "selector" : Date.now();
        const opt = cloneDeep(this.currentToolsData.toolsOpt);
        if (this.currentToolsData.toolsType === EToolsKey.Pencil) {
            this.maxLayerIndex = this.maxLayerIndex + 10;
            opt.zIndex = this.maxLayerIndex;
        }
        this.setCurrentLocalWorkData({
            workId,
            workState: EvevtWorkState.Start,
        }, EPostMessageType.CreateWork);
        const _point = this.transformToScenePoint(point);
        this.pushPoint(_point);
        this.maxDrawCount = 0;
        this.wokerDrawCount = 0;
        this.reRenders.length = 0;
        this.consume();
        if (this.currentToolsData.toolsType === EToolsKey.Pencil || this.currentToolsData.toolsType === EToolsKey.LaserPen) {
            this.collector?.dispatch({
                type: EPostMessageType.CreateWork,
                workId,
                toolsType: this.currentToolsData.toolsType,
                opt: this.currentToolsData.toolsOpt
            });
        }
        else if (this.currentToolsData.toolsType === EToolsKey.Selector) {
            this.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], -1);
        }
    }
    consume() {
        this.animationId = undefined;
        const workState = this.currentLocalWorkData.workState;
        if (!this.workerLockId) {
            if (this.localPointsBatchData.length) {
                const isRunSubWork = this.currentToolsData.toolsType === EToolsKey.Pencil || this.currentToolsData.toolsType === EToolsKey.LaserPen;
                if (isRunSubWork) {
                    if ((this.maxDrawCount && this.maxDrawCount !== this.cacheDrawCount) || !this.maxDrawCount) {
                        this.cacheDrawCount = this.maxDrawCount;
                        this.taskBatchData.set(this.currentLocalWorkData.workId, {
                            op: this.localPointsBatchData,
                            workState,
                            workId: this.currentLocalWorkData.workId,
                            dataType: EDataType.Local,
                            msgType: EPostMessageType.DrawWork,
                            drawCount: this.maxDrawCount,
                            isRunSubWork
                        });
                    }
                }
                else {
                    this.taskBatchData.set(this.currentLocalWorkData.workId, {
                        op: this.localPointsBatchData,
                        workState,
                        workId: this.currentLocalWorkData.workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        drawCount: this.maxDrawCount,
                        isRunSubWork
                    });
                }
            }
            if (this.taskBatchData.size) {
                this.post(this.taskBatchData);
                this.taskBatchData.clear();
                this.localPointsBatchData.length = 0;
            }
        }
        if (workState === EvevtWorkState.Doing ||
            workState === EvevtWorkState.Start ||
            this.taskBatchData.size ||
            this.localPointsBatchData.length) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    clearAll(justLocal = false) {
        this.taskBatchData.set('ClearAll', {
            dataType: EDataType.Local,
            msgType: EPostMessageType.Clear,
        });
        this.runAnimation();
        setTimeout(() => {
            if (this.bgCanvas && this.floatCanvas) {
                const ctx = this.bgCanvas.getContext('2d');
                ctx?.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
                const floatCtx = this.floatCanvas.getContext('2d');
                floatCtx?.clearRect(0, 0, this.floatCanvas.width, this.floatCanvas.height);
                this.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], false);
            }
        }, 100);
        if (!justLocal) {
            this.collector?.dispatch({
                type: EPostMessageType.Clear
            });
        }
        this.maxLayerIndex = 0;
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
    post(msg) {
        this.msgEmitter.postMessage(msg);
        const subMsg = new Map();
        for (const [key, value] of msg.entries()) {
            if (key === 'Init' || key === 'ClearAll' || key === 'UpdateScene' || key === 'UpdateCamera') {
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
                // console.log('render1', render )
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render) {
                    this.render(render);
                    return;
                }
                if (drawCount) {
                    this.wokerDrawCount = drawCount;
                    if (drawCount > this.maxDrawCount) {
                        this.maxDrawCount = drawCount;
                    }
                    if (render) {
                        this.render(render);
                        if (drawCount < this.maxDrawCount) {
                            this.reRenders.forEach(r => {
                                r.isUnClose = false;
                                this.render(r);
                            });
                            this.reRenders.length = 0;
                        }
                    }
                }
            }
        };
    }
    collectorSyncData(sp) {
        for (const data of sp) {
            const { type, op, workId, index, removeIds, ops, selectIds, opt, padding, selectRect, updateNodeOpt, nodeColor, willSyncService, toolsType } = data;
            switch (type) {
                case EPostMessageType.DrawWork:
                    if (op?.length && workId && typeof index === 'number') {
                        requestIdleCallback(() => {
                            this.collector?.dispatch({
                                type,
                                op,
                                workId,
                                index
                            });
                        }, { timeout: MainEngineForWorker.maxLastSyncTime });
                    }
                    break;
                case EPostMessageType.FullWork:
                    if (ops) {
                        requestIdleCallback(() => {
                            this.collector?.dispatch({ type, ops, workId, updateNodeOpt, opt, toolsType });
                        }, { timeout: MainEngineForWorker.maxLastSyncTime });
                    }
                    break;
                case EPostMessageType.UpdateNode:
                    if (updateNodeOpt || opt || ops) {
                        //console.log('data2', data)
                        requestIdleCallback(() => {
                            this.collector?.dispatch({ type, updateNodeOpt, workId, opt, ops });
                        }, { timeout: MainEngineForWorker.maxLastSyncTime });
                    }
                    break;
                case EPostMessageType.RemoveNode:
                    if (op || removeIds?.length) {
                        requestIdleCallback(() => {
                            this.collector?.dispatch({ type, removeIds });
                        }, { timeout: MainEngineForWorker.maxLastSyncTime });
                    }
                    break;
                case EPostMessageType.Select:
                    const value = selectIds?.length ? { ...selectRect, selectIds } : undefined;
                    if (value && opt?.color) {
                        value.color = opt.color;
                    }
                    if (value && opt?.opacity) {
                        value.opacity = opt.opacity;
                    }
                    if (value && padding) {
                        value.padding = padding;
                    }
                    if (value && nodeColor) {
                        value.nodeColor = nodeColor;
                    }
                    this.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], !!value, value);
                    if (willSyncService) {
                        requestIdleCallback(() => {
                            this.collector?.dispatch({ type, selectIds, opt });
                        }, { timeout: MainEngineForWorker.maxLastSyncTime });
                    }
                    break;
                default:
                    break;
            }
        }
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
        const { workState, workId } = currentLocalWorkData;
        if (workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (msgType !== EPostMessageType.None) {
            const toolsType = this.currentToolsData.toolsType;
            this.taskBatchData.set(`${msgType},${workId}`, {
                msgType,
                workId,
                toolsType: toolsType,
                opt: { ...this.currentToolsData.toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime },
                dataType: EDataType.Local,
                isRunSubWork: toolsType === EToolsKey.Pencil || toolsType === EToolsKey.LaserPen
            });
            this.runAnimation();
        }
    }
    setCurrentToolsData(currentToolsData) {
        super.setCurrentToolsData(currentToolsData);
        const toolsType = currentToolsData.toolsType;
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
