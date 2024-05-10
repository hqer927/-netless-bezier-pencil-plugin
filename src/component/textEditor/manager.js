/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ETextEditorType } from "./types";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../core";
import { requestAsyncCallBack } from "../../core/utils";
import { ProxyMap } from "../../core/utils/proxy";
export class TextEditorManagerImpl {
    constructor(props) {
        Object.defineProperty(this, "internalMsgEmitter", {
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
        Object.defineProperty(this, "editors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "activeId", {
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
        Object.defineProperty(this, "proxyMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "taskqueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        const { control, internalMsgEmitter } = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const _editors = new Map();
        this.proxyMap = new ProxyMap();
        const _this = this;
        const _set = ProxyMap.interceptors.set;
        ProxyMap.interceptors.set = function (key, value) {
            _this.interceptors.set(key, value);
            return _set.call(this, key, value);
        };
        const _delete = ProxyMap.interceptors.delete;
        ProxyMap.interceptors.delete = function (key, dataType) {
            _this.interceptors.delete(key, dataType);
            return _delete.call(this, key);
        };
        this.editors = this.proxyMap.createProxy(_editors);
        // this.internalMsgEmitter.on([InternalMsgEmitterType.TextEditor, EmitEventType.SetEditorData],this.bindEventEditor.bind(this));
    }
    get collector() {
        return this.control.collector;
    }
    filterEditor(viewId) {
        const filterMap = new Map();
        this.editors.forEach((editor, key) => {
            if (editor.viewId === viewId) {
                filterMap.set(key, editor);
            }
        });
        return filterMap;
    }
    get interceptors() {
        return {
            set: (workId, info) => {
                if (!this.collector) {
                    return true;
                }
                const { viewId, scenePath, canSync, canWorker, type, opt, dataType } = info;
                if (!canWorker && !canSync) {
                    return true;
                }
                const isLocalId = this.collector?.isLocalId(workId);
                const key = isLocalId ? this.collector?.transformKey(workId) : workId;
                const curStore = this.collector?.storage[viewId] && this.collector.storage[viewId][scenePath] && this.collector.storage[viewId][scenePath][key] || undefined;
                // console.log('active---2---0---1', workId, opt.uid, opt.workState, canSync, canWorker)
                if (!curStore) {
                    if (type === ETextEditorType.Text) {
                        if (canSync) {
                            // console.log('active---2---1',workId, opt.workState)
                            this.collector?.dispatch({
                                type: opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                workId,
                                toolsType: EToolsKey.Text,
                                opt,
                                isSync: true,
                                viewId,
                                scenePath
                            });
                        }
                        if (canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                dataType: dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt,
                                viewId,
                                scenePath
                            });
                            this.control.worker?.runAnimation();
                        }
                    }
                    else {
                        // todo shape
                    }
                }
                else {
                    if (curStore.toolsType === EToolsKey.Text) {
                        if (canWorker) {
                            this.control.worker.queryTaskBatchData({
                                workId,
                                msgType: EPostMessageType.UpdateNode
                            }).forEach(task => {
                                this.control.worker?.taskBatchData.delete(task);
                            });
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: EPostMessageType.UpdateNode,
                                dataType: dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt,
                                viewId,
                                scenePath,
                                // willSyncService: canSync
                            });
                            this.control.worker?.runAnimation();
                        }
                        if (canSync) {
                            requestAsyncCallBack(() => {
                                this.collector?.dispatch({
                                    type: EPostMessageType.UpdateNode,
                                    workId,
                                    toolsType: EToolsKey.Text,
                                    opt,
                                    viewId,
                                    scenePath
                                });
                            }, this.control.worker.maxLastSyncTime);
                        }
                    }
                    else {
                        // todo shape
                    }
                }
            },
            delete: (workId) => {
                if (!this.collector) {
                    return true;
                }
                const info = this.editors.get(workId);
                if (!info) {
                    return true;
                }
                const { viewId, scenePath, canSync, canWorker } = info;
                if (!canWorker && !canSync) {
                    return true;
                }
                // const isLocalId = this.collector?.isLocalId(workId);
                // const key = isLocalId ? this.collector?.transformKey(workId) : workId;
                // const curStore = this.collector?.storage[viewId] && this.collector?.storage[viewId][scenePath] && this.collector?.storage[viewId][scenePath][key] || undefined;
                // if (curStore) {
                // if (curStore.toolsType === EToolsKey.Text) {
                if (canWorker) {
                    this.control.worker?.taskBatchData.add({
                        workId,
                        toolsType: EToolsKey.Text,
                        msgType: EPostMessageType.RemoveNode,
                        dataType: EDataType.Local,
                        viewId,
                        scenePath
                    });
                    this.control.worker?.runAnimation();
                }
                if (canSync) {
                    requestAsyncCallBack(() => {
                        this.collector?.dispatch({
                            type: EPostMessageType.RemoveNode,
                            removeIds: [workId],
                            toolsType: EToolsKey.Text,
                            viewId,
                            scenePath
                        });
                    }, this.control.worker.maxLastSyncTime);
                }
                // } else {
                //     // todo shape
                // }
                // }
            },
            clear() {
                return true;
            }
        };
    }
    computeTextActive(point, viewId) {
        const op = this.control.viewContainerManager?.transformToScenePoint(point, viewId);
        const scenePath = this.control.viewContainerManager?.getCurScenePath(viewId);
        if (viewId && scenePath) {
            this.control.worker?.taskBatchData.add({
                msgType: EPostMessageType.GetTextActive,
                dataType: EDataType.Local,
                op,
                viewId,
                scenePath
            });
            this.control.worker?.runAnimation();
        }
    }
    checkEmptyTextBlur() {
        if (this.activeId) {
            const info = this.editors.get(this.activeId);
            const text = info?.opt.text && info?.opt.text.replace(/\s*,/g, '');
            const viewId = info?.viewId;
            if (text) {
                this.unActive();
            }
            else {
                this.delete(this.activeId, true, true);
            }
            // console.log('undoTicker-checkEmptyTextBlur', this.undoTickerId, viewId)
            if (this.undoTickerId && viewId) {
                this.internalMsgEmitter.emit('undoTickerEnd', this.undoTickerId, viewId, true);
                this.undoTickerId = undefined;
            }
        }
    }
    onCameraChange(cameraOpt, viewId) {
        for (const [key, value] of this.editors.entries()) {
            if (value.viewId === viewId) {
                const { boxPoint, boxSize } = value.opt;
                const globalPoint = boxPoint && this.control.viewContainerManager?.transformToOriginPoint(boxPoint, value.viewId);
                const scenePath = this.control.viewContainerManager?.getCurScenePath(viewId);
                if (scenePath && viewId) {
                    const info = {
                        x: globalPoint && globalPoint[0] || 0,
                        y: globalPoint && globalPoint[1] || 0,
                        w: boxSize && boxSize[0] || 0,
                        h: boxSize && boxSize[1] || 0,
                        opt: value.opt,
                        scale: cameraOpt.scale,
                        type: ETextEditorType.Text,
                        viewId,
                        scenePath,
                        canWorker: false,
                        canSync: false
                    };
                    this.editors.set(key, info);
                    this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
                }
            }
        }
    }
    onServiceDerive(data) {
        const { workId, opt, msgType, viewId, scenePath, dataType } = data;
        if (!workId || !viewId || !scenePath) {
            return;
        }
        const workIdStr = workId.toString();
        if (msgType === EPostMessageType.RemoveNode) {
            console.log('onServiceDerive-d', workIdStr);
            this.delete(workIdStr, true, true);
            return;
        }
        const { boxPoint, boxSize } = opt;
        const globalPoint = boxPoint && this.control.viewContainerManager?.transformToOriginPoint(boxPoint, viewId);
        const view = this.control.viewContainerManager.getView(viewId);
        const info = {
            x: globalPoint && globalPoint[0] || 0,
            y: globalPoint && globalPoint[1] || 0,
            w: boxSize && boxSize[0] || 0,
            h: boxSize && boxSize[1] || 0,
            opt: opt,
            type: ETextEditorType.Text,
            canWorker: true,
            canSync: false,
            dataType,
            // dataType: this.collector?.isLocalId(workIdStr) ? EDataType.Local : EDataType.Service,
            scale: view?.cameraOpt?.scale || 1,
            viewId,
            scenePath
        };
        this.editors.set(workIdStr, info);
        if (dataType === EDataType.Service && opt.workState === EvevtWorkState.Done && this.activeId === workIdStr) {
            this.activeId = undefined;
        }
        console.log('onServiceDerive---1', workIdStr, info.opt.text, info.opt.uid, this.activeId, dataType);
        this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
    }
    updateForViewEdited(activeId, info) {
        this.editors.set(activeId, info);
        const resolve = this.taskqueue.get(activeId)?.resolve;
        if (resolve) {
            resolve(info);
        }
    }
    active(workId) {
        const info = this.editors.get(workId);
        if (info && info.viewId) {
            info.opt.workState = EvevtWorkState.Start;
            info.opt.uid = this.collector?.uid;
            this.activeId = workId;
            info.canWorker = true;
            info.canSync = true;
            console.log('onServiceDerive---0', info.opt.uid);
            this.editors.set(workId, info);
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        }
    }
    unActive() {
        const info = this.activeId && this.editors.get(this.activeId);
        if (info && info.viewId && this.activeId) {
            info.opt.workState = EvevtWorkState.Done;
            info.opt.uid = undefined;
            // info.isActive = false;
            info.canWorker = true;
            info.canSync = true;
            // console.log('active---2', this.activeId, info.opt.workState)
            this.editors.set(this.activeId, info);
            this.activeId = undefined;
            // console.log('active---3', this.activeId)
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        }
    }
    createTextForMasterController(params, undoTickerId) {
        const { workId, isActive, ...info } = params;
        info.opt.zIndex = this.getMaxZIndex() + 1;
        info.opt.uid = this.collector?.uid;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.internalMsgEmitter.emit('undoTickerStart', this.undoTickerId, info.viewId);
        }
        if (isActive) {
            // console.log('active---2', workId)
            this.activeId = workId;
        }
        info.dataType = EDataType.Local;
        info.canWorker = true;
        info.canSync = true;
        this.editors.set(workId, info);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
    }
    updateTextForMasterController(params, undoTickerId) {
        const { workId, ...info } = params;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.internalMsgEmitter.emit('undoTickerStart', this.undoTickerId, info.viewId);
        }
        const _info = this.editors.get(workId) || {};
        if (info.opt) {
            info.opt.uid = this.collector?.uid;
        }
        info.dataType = EDataType.Local;
        this.editors.set(workId, { ..._info, ...info });
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
    }
    async updateTextControllerWithEffectAsync(params, undoTickerId) {
        const { workId, ...info } = params;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.internalMsgEmitter.emit('undoTickerStart', this.undoTickerId, info.viewId);
        }
        const _info = this.editors.get(workId) || {};
        if (info.opt) {
            info.opt.uid = this.collector?.uid;
        }
        info.dataType = EDataType.Local;
        this.editors.set(workId, { ..._info, ...info });
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        if (this.taskqueue.has(workId)) {
            return;
        }
        const clocker = setTimeout(() => {
            const resolve = this.taskqueue.get(workId)?.resolve;
            if (resolve) {
                resolve(undefined);
            }
        }, 20);
        const info_1 = await new Promise((resolve) => {
            this.taskqueue.set(workId, { resolve, clocker });
        });
        const task = this.taskqueue.get(workId);
        if (task) {
            task.clocker && clearTimeout(task.clocker);
            this.taskqueue.delete(workId);
        }
        this.taskqueue.delete(workId);
        return info_1;
    }
    updateTextForWorker(params, undoTickerId) {
        const { workId, isActive, ...info } = params;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.internalMsgEmitter.emit('undoTickerStart', this.undoTickerId, info.viewId);
        }
        const _info = this.editors.get(workId) || {};
        const data = { ..._info, ...info };
        if (isActive) {
            data.canWorker = false;
            data.canSync = false;
            this.editors.set(workId, data);
            this.active(workId);
            return;
        }
        this.editors.set(workId, data);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
    }
    get(workId) {
        return this.editors.get(workId);
    }
    delete(workId, canSync, canWorker) {
        const info = this.editors.get(workId);
        if (info) {
            const viewId = info.viewId;
            info.canSync = canSync;
            info.canWorker = canWorker;
            this.editors.delete(workId);
            if (this.activeId === workId) {
                this.activeId = undefined;
            }
            this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
        }
    }
    deleteBatch(workIds, canSync, canWorker) {
        const viewIds = new Set();
        for (const workId of workIds) {
            const info = this.editors.get(workId);
            if (info) {
                const viewId = info.viewId;
                info.canSync = canSync;
                info.canWorker = canWorker;
                this.editors.delete(workId);
                if (this.activeId === workId) {
                    // console.log('active---4', undefined)
                    this.activeId = undefined;
                }
                viewIds.add(viewId);
            }
        }
        for (const viewId of viewIds) {
            this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
        }
    }
    clear(viewId, justLocal) {
        this.editors.forEach((editor, key) => {
            if (editor.viewId === viewId) {
                if (justLocal) {
                    editor.canSync = false;
                }
                editor.canWorker = false;
                this.editors.delete(key);
            }
        });
        this.activeId = undefined;
        this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
    }
    destory() {
        this.editors.clear();
        this.activeId = undefined;
    }
    getMaxZIndex() {
        let max = 0;
        this.editors.forEach(editor => {
            if (editor.opt.zIndex && editor.opt.zIndex > max) {
                max = editor.opt.zIndex;
            }
        });
        return max;
    }
}
