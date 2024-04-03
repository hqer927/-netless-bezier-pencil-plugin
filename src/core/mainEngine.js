import { Storage_Selector_key, Storage_ViewId_ALL } from "../collector";
import { EmitEventType, InternalMsgEmitterType } from "../plugin/types";
import FullWorker from './worker/fullWorker.ts?worker&inline';
import SubWorker from './worker/subWorker.ts?worker&inline';
import { MethodBuilderMain } from "./msgEvent";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "./enum";
import { requestAsyncCallBack } from "./utils";
import { ETextEditorType } from "../component/textEditor/types";
import cloneDeep from "lodash/cloneDeep";
export class MasterController {
    constructor() {
        /** 异步同步时间间隔 */
        Object.defineProperty(this, "maxLastSyncTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 500
        });
    }
    /** 设置当前选中的工具配置数据 */
    setCurrentToolsData(currentToolsData) {
        this.currentToolsData = currentToolsData;
    }
    /** 设置当前绘制任务数据 */
    setCurrentLocalWorkData(currentLocalWorkData) {
        this.currentLocalWorkData = currentLocalWorkData;
    }
    /** 获取当前激活的工作任务id */
    getWorkId() {
        return this.currentLocalWorkData.workId;
    }
}
export class MasterControlForWorker extends MasterController {
    constructor(props) {
        super();
        Object.defineProperty(this, "isActive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
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
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "internalMsgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viewContainerManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // protected threadEngine?: WorkerManager | undefined;
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
            value: new Set()
        });
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "fullWorker", {
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
        /** master\fullwoker\subworker 三者高频绘制时队列化参数 */
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
        /** end */
        /** 是否任务队列化参数 */
        Object.defineProperty(this, "tasksqueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "useTasksqueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "useTasksClockId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mianTasksqueueCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workerTasksqueueCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** end */
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
        Object.defineProperty(this, "clearAllResolve", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collector", {
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
        Object.defineProperty(this, "animationId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { control, internalMsgEmitter } = props;
        this.control = control;
        this.collector = this.control.collector;
        this.maxLastSyncTime = (this.control.pluginOptions?.syncOpt?.interval || this.maxLastSyncTime) * 0.5;
        this.internalMsgEmitter = internalMsgEmitter;
        this.currentLocalWorkData = { workState: EvevtWorkState.Pending };
    }
    init() {
        this.viewContainerManager = this.control.viewContainerManager;
        this.on();
        this.internalMsgEmitterListener();
        this.isActive = true;
    }
    get isRunSubWork() {
        const { toolsType } = this.currentToolsData;
        if (toolsType === EToolsKey.Pencil ||
            toolsType === EToolsKey.LaserPen ||
            toolsType === EToolsKey.Arrow ||
            toolsType === EToolsKey.Straight ||
            toolsType === EToolsKey.Ellipse ||
            toolsType === EToolsKey.Rectangle ||
            toolsType === EToolsKey.Star ||
            toolsType === EToolsKey.Polygon ||
            toolsType === EToolsKey.SpeechBalloon) {
            return true;
        }
        return false;
    }
    get isCanDrawWork() {
        const { toolsType } = this.currentToolsData;
        if (toolsType === EToolsKey.Pencil ||
            toolsType === EToolsKey.LaserPen ||
            toolsType === EToolsKey.Arrow ||
            toolsType === EToolsKey.Straight ||
            toolsType === EToolsKey.Ellipse ||
            toolsType === EToolsKey.Rectangle ||
            toolsType === EToolsKey.Star ||
            toolsType === EToolsKey.Polygon ||
            toolsType === EToolsKey.SpeechBalloon) {
            return true;
        }
        return false;
    }
    get isUseZIndex() {
        const { toolsType } = this.currentToolsData;
        if (toolsType === EToolsKey.Pencil ||
            toolsType === EToolsKey.Arrow ||
            toolsType === EToolsKey.Straight ||
            toolsType === EToolsKey.Ellipse ||
            toolsType === EToolsKey.Rectangle ||
            toolsType === EToolsKey.Star ||
            toolsType === EToolsKey.Polygon ||
            toolsType === EToolsKey.SpeechBalloon ||
            toolsType === EToolsKey.Text) {
            return true;
        }
        return false;
    }
    get isCanRecordUndoRedo() {
        const { toolsType } = this.currentToolsData;
        if (toolsType === EToolsKey.Pencil ||
            toolsType === EToolsKey.Selector ||
            toolsType === EToolsKey.Eraser ||
            toolsType === EToolsKey.Arrow ||
            toolsType === EToolsKey.Straight ||
            toolsType === EToolsKey.Ellipse ||
            toolsType === EToolsKey.Rectangle ||
            toolsType === EToolsKey.Star ||
            toolsType === EToolsKey.Polygon ||
            toolsType === EToolsKey.SpeechBalloon) {
            return true;
        }
        return false;
    }
    on() {
        this.fullWorker = new FullWorker();
        this.subWorker = new SubWorker();
        this.fullWorker.onmessage = (e) => {
            if (e.data) {
                const { render, sp, drawCount, workerTasksqueueCount } = e.data;
                if (workerTasksqueueCount) {
                    this.workerTasksqueueCount = workerTasksqueueCount;
                }
                // console.log('selector - render', render, sp, workerTasksqueueCount)
                // if (render?.length) {
                //     console.log('selector - fullWorker - render', render)
                // }
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render?.length) {
                    this.viewContainerManager.render(render);
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
                        this.viewContainerManager.render(render);
                        if (this.wokerDrawCount < this.subWorkerDrawCount) {
                            this.reRenders.forEach(r => {
                                r.isUnClose = false;
                            });
                            this.viewContainerManager.render(this.reRenders);
                            this.reRenders.length = 0;
                        }
                    }
                }
            }
        };
        this.subWorker.onmessage = (e) => {
            if (e.data) {
                const { render, drawCount, sp } = e.data;
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (render?.length) {
                    // console.log('selector - subWorker - render', render)
                }
                if (!drawCount && render?.length) {
                    this.viewContainerManager.render(render);
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
                            this.viewContainerManager.render(render);
                        }
                    }
                }
            }
        };
    }
    collectorSyncData(sp) {
        let isHasOther = false;
        for (const data of sp) {
            const { type, selectIds, opt, selectRect, strokeColor, fillColor, willSyncService, isSync, undoTickerId, imageBitmap, canvasHeight, canvasWidth, rect, op, canTextEdit, selectorColor, canRotate, scaleType, textOpt, toolsType, workId, viewId, scenePath } = data;
            if (!viewId) {
                console.error('collectorSyncData', data);
                return;
            }
            switch (type) {
                case EPostMessageType.Select: {
                    const value = selectIds?.length ? { ...selectRect, selectIds, canvasHeight, canvasWidth } : undefined;
                    if (value && opt?.strokeColor) {
                        value.selectorColor = opt.strokeColor;
                    }
                    if (value && selectorColor) {
                        value.selectorColor = selectorColor;
                    }
                    if (value && strokeColor) {
                        value.strokeColor = strokeColor;
                    }
                    if (value && opt?.fillColor) {
                        value.fillColor = opt.fillColor;
                    }
                    if (value && fillColor) {
                        value.fillColor = fillColor;
                    }
                    if (value && canRotate) {
                        value.canRotate = canRotate;
                    }
                    if (value && scaleType) {
                        value.scaleType = scaleType;
                    }
                    if (value && canTextEdit) {
                        value.canTextEdit = canTextEdit;
                    }
                    if (value && textOpt) {
                        value.textOpt = textOpt;
                    }
                    viewId && this.viewContainerManager.showFloatBar(viewId, !!value, value);
                    if (willSyncService) {
                        const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                        this.collector.dispatch({ type, selectIds, opt, isSync, viewId, scenePath });
                    }
                    break;
                }
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
                        this.control.cursor.collectServiceCursor({ ...data });
                    }
                    break;
                case EPostMessageType.Clear:
                    viewId && this.viewContainerManager.showFloatBar(viewId, false);
                    viewId && this.clearAllResolve && this.clearAllResolve(viewId);
                    break;
                case EPostMessageType.TextUpdate:
                    if (toolsType === EToolsKey.Text && workId && viewId) {
                        const point = this.viewContainerManager.transformToOriginPoint(opt?.boxPoint || [0, 0], viewId);
                        const boxSize = opt?.boxSize || [0, 0];
                        const cameraOpt = this.viewContainerManager.getView(viewId)?.cameraOpt;
                        this.control.textEditorManager.updateTextForWorker({
                            x: point[0],
                            y: point[1],
                            w: boxSize[0],
                            h: boxSize[1],
                            scale: cameraOpt?.scale || 1,
                            workId: workId,
                            opt: opt,
                            isDel: !opt,
                            viewId,
                        });
                    }
                    break;
                case EPostMessageType.GetTextActive:
                    if (toolsType === EToolsKey.Text && workId && viewId) {
                        this.control.textEditorManager.updateTextForWorker({
                            workId: workId,
                            isActive: true,
                            viewId,
                        });
                    }
                    break;
                default:
                    isHasOther = true;
                    break;
            }
            if (!isHasOther && undoTickerId) {
                this.internalMsgEmitter.emit('undoTickerEnd', undoTickerId, viewId);
            }
        }
        if (isHasOther) {
            requestAsyncCallBack(() => {
                this.collectorAsyncData(sp);
            }, this.maxLastSyncTime);
        }
    }
    collectorAsyncData(sp) {
        for (const data of sp) {
            const { type, op, workId, index, removeIds, ops, opt, updateNodeOpt, toolsType, isSync, undoTickerId, viewId } = data;
            if (!viewId) {
                console.error('collectorAsyncData', data);
                return;
            }
            switch (type) {
                case EPostMessageType.DrawWork: {
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    this.collector.dispatch({
                        type,
                        op,
                        workId,
                        index,
                        isSync,
                        viewId,
                        scenePath
                    });
                    break;
                }
                case EPostMessageType.FullWork: {
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    this.collector.dispatch({
                        type,
                        ops,
                        workId,
                        updateNodeOpt,
                        opt,
                        toolsType,
                        isSync,
                        viewId,
                        scenePath
                    });
                    break;
                }
                case EPostMessageType.UpdateNode: {
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    this.collector.dispatch({ type, updateNodeOpt, workId, opt, ops, op, isSync, viewId, scenePath });
                    break;
                }
                case EPostMessageType.RemoveNode: {
                    const scenePath = this.viewContainerManager.getCurScenePath(viewId);
                    this.collector.dispatch({ type, removeIds, isSync, viewId, scenePath });
                    break;
                }
                default:
                    break;
            }
            if (undoTickerId) {
                this.internalMsgEmitter.emit('undoTickerEnd', undoTickerId, viewId);
            }
        }
    }
    setCurrentToolsData(currentToolsData) {
        const toolsType = currentToolsData.toolsType;
        const isChangeToolsType = this.currentToolsData?.toolsType !== currentToolsData.toolsType;
        super.setCurrentToolsData(currentToolsData);
        const views = this.viewContainerManager?.getAllViews();
        if (views?.length) {
            this.taskBatchData.add({
                msgType: EPostMessageType.UpdateTools,
                dataType: EDataType.Local,
                toolsType,
                opt: { ...currentToolsData.toolsOpt, syncUnitTime: this.maxLastSyncTime },
                isRunSubWork: this.isRunSubWork,
                viewId: Storage_ViewId_ALL
            });
            if (this.viewContainerManager?.focuedView) {
                const { id, focusScenePath } = this.viewContainerManager.focuedView;
                if (isChangeToolsType && id && focusScenePath) {
                    if (this.collector.hasSelector(id, focusScenePath)) {
                        this.blurSelector(id, focusScenePath);
                    }
                    if (this.control.textEditorManager.activeId) {
                        this.control.textEditorManager.checkEmptyTextBlur();
                    }
                }
            }
            this.runAnimation();
        }
    }
    setCurrentLocalWorkData(currentLocalWorkData, msgType = EPostMessageType.None) {
        super.setCurrentLocalWorkData(currentLocalWorkData);
        const { workState, workId, toolsOpt } = currentLocalWorkData;
        if (workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (msgType !== EPostMessageType.None && this.viewContainerManager.focuedView) {
            const { id } = this.viewContainerManager.focuedView;
            if (id) {
                const toolsType = this.currentToolsData.toolsType;
                this.taskBatchData.add({
                    msgType,
                    workId,
                    toolsType: toolsType,
                    opt: { ...this.currentToolsData.toolsOpt, ...toolsOpt, syncUnitTime: this.maxLastSyncTime },
                    dataType: EDataType.Local,
                    isRunSubWork: this.isRunSubWork,
                    viewId: id
                });
                this.runAnimation();
            }
        }
    }
    createViewWorker(viewId, options) {
        const { offscreenCanvasOpt, layerOpt, dpr, cameraOpt } = options;
        this.taskBatchData.add({
            msgType: EPostMessageType.Init,
            dataType: EDataType.Local,
            viewId,
            offscreenCanvasOpt,
            layerOpt,
            dpr,
            cameraOpt,
            isRunSubWork: true,
        });
        this.runAnimation();
    }
    destroyViewWorker(viewId) {
        this.taskBatchData.add({
            msgType: EPostMessageType.Destroy,
            dataType: EDataType.Local,
            viewId,
            isRunSubWork: true,
        });
        this.runAnimation();
        this.collector.dispatch({
            type: EPostMessageType.Clear,
            viewId
        });
        // this.destroyView(viewId);
    }
    onServiceDerive(key, data) {
        const { newValue, oldValue, viewId, scenePath } = data;
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
            const d = msg;
            d.workId = this.collector.isOwn(workId) ? this.collector.getLocalId(workId) : workId;
            d.msgType = msgType;
            d.dataType = EDataType.Service;
            d.viewId = viewId;
            d.scenePath = scenePath;
            if (d.selectIds) {
                d.selectIds = d.selectIds.map(id => {
                    return this.collector.isOwn(id) ? this.collector.getLocalId(id) : id;
                });
            }
            if ((d && d.toolsType === EToolsKey.Text) || oldValue?.toolsType === EToolsKey.Text) {
                this.control.textEditorManager.onServiceDerive(d);
                return;
            }
            console.log('onServiceDerive', d);
            this.taskBatchData.add(d);
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
    pullServiceData(viewId, scenePath) {
        const store = this.collector.storage[viewId] && this.collector.storage[viewId][scenePath] || undefined;
        if (store) {
            let minZIndex;
            let maxZIndex;
            const keys = Object.keys(store);
            for (const key of keys) {
                const msgType = store[key]?.type;
                if (msgType && key) {
                    const data = cloneDeep(store[key]);
                    data.workId = this.collector.isOwn(key) ? this.collector.getLocalId(key) : key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    data.viewId = viewId;
                    data.scenePath = scenePath;
                    data.useAnimation = false;
                    if (data.selectIds) {
                        data.selectIds = data.selectIds.map(id => {
                            return this.collector.isOwn(id) ? this.collector.getLocalId(id) : id;
                        });
                    }
                    if (data.toolsType === EToolsKey.Text) {
                        this.control.textEditorManager.onServiceDerive(data);
                        continue;
                    }
                    this.taskBatchData.add(data);
                    if (data.opt?.zIndex) {
                        maxZIndex = Math.max(maxZIndex || 0, data.opt.zIndex);
                        minZIndex = Math.min(minZIndex || Infinity, data.opt.zIndex);
                    }
                }
                this.internalMsgEmitter.emit("excludeIds", keys);
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
    runAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    consume() {
        this.animationId = undefined;
        const workState = this.currentLocalWorkData.workState;
        let isAble = false;
        if (!this.localEventTimerId) {
            if (workState !== EvevtWorkState.Pending && this.localPointsBatchData.length) {
                if (this.wokerDrawCount !== Infinity && this.wokerDrawCount <= this.subWorkerDrawCount && this.cacheDrawCount < this.maxDrawCount) {
                    isAble = true;
                }
                if (!this.maxDrawCount) {
                    isAble = true;
                }
                if (isAble && this.viewContainerManager.focuedViewId) {
                    this.taskBatchData.add({
                        op: this.localPointsBatchData.map(n => n),
                        workState,
                        workId: this.currentLocalWorkData.workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        isRunSubWork: this.isRunSubWork,
                        undoTickerId: workState === EvevtWorkState.Done && this.undoTickerId || undefined,
                        viewId: this.viewContainerManager.focuedViewId,
                        scenePath: this.viewContainerManager.focuedViewId && this.viewContainerManager.getCurScenePath(this.viewContainerManager.focuedViewId)
                    });
                    this.localPointsBatchData.length = 0;
                    this.cacheDrawCount = this.maxDrawCount;
                }
            }
            if (this.taskBatchData.size) {
                this.post(this.taskBatchData);
                for (const value of this.taskBatchData.values()) {
                    if (value.msgType === EPostMessageType.TasksQueue) {
                        this.tasksqueue.clear();
                        // console.log('selector - consume', [...this.tasksqueue.values()])
                        break;
                    }
                }
                // console.log('selector - consume -1', [...this.taskBatchData.values()])
                this.taskBatchData.clear();
                if (this.undoTickerId && workState === EvevtWorkState.Done) {
                    this.undoTickerId = undefined;
                }
            }
        }
        if (this.tasksqueue.size) {
            this.consumeQueue();
        }
        if (this.tasksqueue.size ||
            this.taskBatchData.size ||
            this.localPointsBatchData.length) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    unabled() {
        this.setCurrentLocalWorkData({ workState: EvevtWorkState.Freeze, workId: undefined });
    }
    abled() {
        this.setCurrentLocalWorkData({ workState: EvevtWorkState.Pending, workId: undefined });
    }
    post(msg) {
        // console.log('post-msg1',cloneDeep(msg))
        this.fullWorker.postMessage(msg);
        const subMsg = new Set();
        for (const value of msg.values()) {
            const key = value.msgType;
            if (key === EPostMessageType.Init ||
                key === EPostMessageType.Clear ||
                key === EPostMessageType.Destroy ||
                key === EPostMessageType.UpdateCamera ||
                value.isRunSubWork) {
                subMsg.add(value);
            }
        }
        // console.log('post-sub', cloneDeep(subMsg))
        subMsg.size && this.subWorker.postMessage(subMsg);
    }
    destroy() {
        throw new Error("Method not implemented.");
    }
    updateNode(workId, updateNodeOpt, viewId, scenePath) {
        this.taskBatchData.add({
            msgType: EPostMessageType.UpdateNode,
            workId,
            updateNodeOpt,
            viewId,
            scenePath,
            dataType: EDataType.Local
        });
        this.runAnimation();
    }
    updateCamera(viewId, cameraOpt) {
        if (!this.useTasksqueue) {
            this.useTasksqueue = true;
            this.mianTasksqueueCount = 1;
            this.workerTasksqueueCount = 1;
        }
        if (this.useTasksqueue) {
            // console.log('updateCamera', first)
            this.tasksqueue.set(viewId, {
                msgType: EPostMessageType.UpdateCamera,
                dataType: EDataType.Local,
                cameraOpt,
                isRunSubWork: true,
                viewId
            });
            this.control.textEditorManager.onCameraChange(cameraOpt, viewId);
            this.runAnimation();
            if (this.useTasksClockId) {
                clearTimeout(this.useTasksClockId);
            }
            this.useTasksClockId = setTimeout(() => {
                this.useTasksClockId = undefined;
                this.tasksqueue.clear();
                this.useTasksqueue = false;
                this.mianTasksqueueCount = undefined;
                this.workerTasksqueueCount = undefined;
            }, this.maxLastSyncTime);
        }
    }
    consumeQueue() {
        if (this.mianTasksqueueCount && this.workerTasksqueueCount) {
            if (this.mianTasksqueueCount === this.workerTasksqueueCount) {
                this.mianTasksqueueCount++;
                // console.log('updateCamera', viewId, cameraOpt)
                this.taskBatchData.add({
                    msgType: EPostMessageType.TasksQueue,
                    dataType: EDataType.Local,
                    isRunSubWork: true,
                    mainTasksqueueCount: this.mianTasksqueueCount,
                    tasksqueue: this.tasksqueue,
                    viewId: ''
                });
            }
        }
    }
    async clearViewScenePath(viewId, justLocal) {
        this.control.textEditorManager.clear(viewId, justLocal);
        this.taskBatchData.add({
            dataType: EDataType.Local,
            msgType: EPostMessageType.Clear,
            viewId,
        });
        this.runAnimation();
        if (!justLocal) {
            const scenePath = this.viewContainerManager.getCurScenePath(viewId);
            this.collector.dispatch({
                type: EPostMessageType.Clear,
                viewId,
                scenePath
            });
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
    internalMsgEmitterListener() {
        if (this.collector) {
            this.methodBuilder = new MethodBuilderMain([
                EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode,
                EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode,
                EmitEventType.ZIndexActive, EmitEventType.ZIndexNode, EmitEventType.RotateNode
            ]).registerForMainEngine(InternalMsgEmitterType.MainEngine, this.control);
            this.zIndexNodeMethod = this.methodBuilder?.getBuilder(EmitEventType.ZIndexNode);
        }
        // this.internalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        // this.internalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
        // this.internalMsgEmitter?.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
    }
    originalEventLintener(workState, point, viewId) {
        switch (workState) {
            case EvevtWorkState.Start:
                this.onLocalEventStart(point, viewId);
                break;
            case EvevtWorkState.Doing:
                if (viewId === this.viewContainerManager.focuedViewId) {
                    this.onLocalEventDoing(point);
                }
                break;
            case EvevtWorkState.Done:
                if (viewId === this.viewContainerManager.focuedViewId) {
                    this.onLocalEventEnd(point);
                }
                break;
            default:
                break;
        }
    }
    setZIndex() {
        const opt = cloneDeep(this.currentToolsData.toolsOpt);
        if (this.zIndexNodeMethod && this.isUseZIndex) {
            this.zIndexNodeMethod.addMaxLayer();
            opt.zIndex = this.zIndexNodeMethod.maxZIndex;
        }
        return opt;
    }
    onLocalEventEnd(point) {
        const workState = this.currentLocalWorkData.workState;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (this.viewContainerManager.focuedView) {
            const { id, focusScenePath, cameraOpt } = this.viewContainerManager.focuedView;
            if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
                const _point = this.viewContainerManager.transformToScenePoint(point, id);
                this.pushPoint(_point);
                this.localEventTimerId = setTimeout(() => {
                    this.localEventTimerId = undefined;
                    this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, workState: EvevtWorkState.Done });
                    this.runAnimation();
                }, 0);
                if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                    this.viewContainerManager.activeFloatBar(id);
                }
            }
            else if (this.currentToolsData.toolsType === EToolsKey.Text) {
                const _point = this.viewContainerManager.transformToScenePoint(point, id);
                if (this.localPointsBatchData[0] === _point[0] && this.localPointsBatchData[1] === _point[1]) {
                    const opt = this.currentToolsData.toolsOpt;
                    opt.workState = EvevtWorkState.Doing;
                    opt.boxPoint = _point;
                    opt.boxSize = [opt.fontSize, opt.fontSize];
                    this.control.textEditorManager.createTextForMasterController({
                        workId: Date.now().toString(),
                        x: point[0],
                        y: point[1],
                        scale: cameraOpt?.scale || 1,
                        opt,
                        type: ETextEditorType.Text,
                        isActive: true,
                        viewId: id,
                        scenePath: focusScenePath
                    });
                }
                this.localPointsBatchData.length = 0;
            }
        }
    }
    onLocalEventDoing(point) {
        let workState = this.currentLocalWorkData.workState;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        const viewId = this.viewContainerManager.focuedViewId;
        if (!viewId) {
            return;
        }
        if (workState === EvevtWorkState.Start) {
            workState = EvevtWorkState.Doing;
            this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, workState });
        }
        if (workState === EvevtWorkState.Doing || this.localEventTimerId) {
            const _point = this.viewContainerManager.transformToScenePoint(point, viewId);
            this.pushPoint(_point);
            if (!this.localEventTimerId) {
                this.runAnimation();
            }
        }
    }
    onLocalEventStart(point, viewId) {
        const { workState } = this.currentLocalWorkData;
        if (workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (!viewId) {
            return;
        }
        if (this.viewContainerManager.focuedViewId !== viewId) {
            this.viewContainerManager.setFocuedViewId(viewId);
        }
        // console.log('onLocalEventStart ---1', point, viewId, this.viewContainerManager.focuedView?.cameraOpt)
        const _point = this.viewContainerManager.transformToScenePoint(point, viewId);
        // console.log('onLocalEventStart ---3', point, _point, viewId)
        this.pushPoint(_point);
        if (this.currentToolsData.toolsType === EToolsKey.Text) {
            return;
        }
        this.control.textEditorManager.checkEmptyTextBlur();
        const workId = this.currentToolsData.toolsType === EToolsKey.Selector ? Storage_Selector_key : Date.now();
        const opt = this.setZIndex();
        this.setCurrentLocalWorkData({
            workId,
            workState: EvevtWorkState.Start,
            toolsOpt: opt
        }, EPostMessageType.CreateWork);
        this.maxDrawCount = 0;
        this.cacheDrawCount = 0;
        this.wokerDrawCount = 0;
        this.subWorkerDrawCount = 0;
        this.reRenders.length = 0;
        if (this.isCanRecordUndoRedo) {
            if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                this.undoTickerId = Date.now();
            }
            else {
                this.undoTickerId = workId;
            }
            this.internalMsgEmitter.emit('undoTickerStart', this.undoTickerId, viewId);
        }
        if (this.isCanDrawWork) {
            const scenePath = this.viewContainerManager.getCurScenePath(viewId);
            this.collector?.dispatch({
                type: EPostMessageType.CreateWork,
                workId,
                toolsType: this.currentToolsData.toolsType,
                opt: this.currentToolsData.toolsOpt,
                viewId,
                scenePath
            });
            scenePath && this.blurSelector(viewId, scenePath);
        }
        else if (this.currentToolsData.toolsType === EToolsKey.Selector) {
            this.viewContainerManager.unActiveFloatBar(viewId);
            // TeachingAidsManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], -1);
        }
        this.consume();
    }
    pushPoint(point) {
        this.localPointsBatchData.push(point[0], point[1]);
    }
    sendCursorEvent(p, viewId) {
        if (this.currentLocalWorkData.workState === EvevtWorkState.Freeze || this.currentLocalWorkData.workState === EvevtWorkState.Unwritable) {
            return;
        }
        let point = [undefined, undefined];
        if (this.currentToolsData && (this.isCanDrawWork || this.currentToolsData.toolsType === EToolsKey.Text)) {
            if (this.currentLocalWorkData.workState !== EvevtWorkState.Start && this.currentLocalWorkData.workState !== EvevtWorkState.Doing) {
                point = p;
            }
        }
        // console.log('sendCursorEvent', point)
        this.control.cursor.sendEvent(point, viewId);
    }
    blurSelector(viewId, scenePath, undoTickerId) {
        if (this.collector.hasSelector(viewId, scenePath)) {
            this.taskBatchData.add({
                workId: Storage_Selector_key,
                selectIds: [],
                msgType: EPostMessageType.Select,
                dataType: EDataType.Service,
                viewId,
                scenePath,
                undoTickerId
            });
            this.runAnimation();
        }
    }
    getBoundingRect(scenePath) {
        const cur = this.boundingRectMap?.get(scenePath);
        if (!cur) {
            const scenes = this.collector.getScenePathData(scenePath);
            if (!scenes) {
                return;
            }
            Object.keys(scenes).forEach(key => {
                if (this.collector.getLocalId(key) === Storage_Selector_key) {
                    delete scenes[key];
                }
            });
            if (Object.keys(scenes).length && this.viewContainerManager.mainView) {
                const data = {
                    msgType: EPostMessageType.BoundingBox,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    cameraOpt: this.viewContainerManager.mainView.cameraOpt,
                    isRunSubWork: true,
                    viewId: this.viewContainerManager.mainView.id
                };
                this.taskBatchData.add(data);
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
    getSnapshot(scenePath, width, height, camera) {
        const cur = this.snapshotMap?.get(scenePath);
        if (!cur) {
            const viewId = this.collector.getViewIdBySecenPath(scenePath);
            if (!viewId) {
                return;
            }
            const scenes = this.collector.getStorageData(viewId, scenePath);
            if (!scenes) {
                return;
            }
            Object.keys(scenes).forEach(key => {
                if (this.collector.getLocalId(key) === Storage_Selector_key) {
                    delete scenes[key];
                }
            });
            if (Object.keys(scenes).length) {
                const view = this.viewContainerManager.getView(viewId) || this.viewContainerManager.focuedView;
                if (!view) {
                    return;
                }
                const w = width || view.cameraOpt?.width;
                const h = height || view.cameraOpt?.height;
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
                    } || view.cameraOpt,
                    isRunSubWork: true,
                    viewId
                };
                this.taskBatchData.add(data);
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
}
