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
        Object.defineProperty(this, "proxyMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
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
                const isLocalId = this.collector?.isLocalId(workId);
                const key = isLocalId ? this.collector?.transformKey(workId) : workId;
                const { viewId, scenePath } = info;
                const curStore = this.collector?.storage[viewId] && this.collector.storage[viewId][scenePath] && this.collector.storage[viewId][scenePath][key] || undefined;
                // console.log('interceptors - set', info, workId)
                if (!curStore) {
                    if (info.type === ETextEditorType.Text) {
                        if (info.canSync) {
                            this.collector?.dispatch({
                                type: info.opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                workId,
                                toolsType: EToolsKey.Text,
                                opt: info.opt,
                                isSync: true,
                                viewId,
                                scenePath
                            });
                        }
                        if (info.canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: info.opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                dataType: info.dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt: info?.opt,
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
                        if (info.canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: EPostMessageType.UpdateNode,
                                dataType: info.dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt: info.opt,
                                viewId,
                                scenePath
                            });
                            this.control.worker?.runAnimation();
                        }
                        if (info.canSync) {
                            requestAsyncCallBack(() => {
                                this.collector?.dispatch({
                                    type: EPostMessageType.UpdateNode,
                                    workId,
                                    toolsType: EToolsKey.Text,
                                    opt: info.opt,
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
                const isLocalId = this.collector?.isLocalId(workId);
                const key = isLocalId ? this.collector?.transformKey(workId) : workId;
                const info = this.editors.get(workId);
                const { viewId, scenePath, canSync, canWorker } = info;
                const curStore = this.collector?.storage[viewId][scenePath][key];
                if (curStore) {
                    if (curStore.toolsType === EToolsKey.Text) {
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
                    }
                    else {
                        // todo shape
                    }
                }
            },
            clear() {
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
            if (text) {
                this.unActive();
            }
            else {
                this.delete(this.activeId, true, true);
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
                    // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, viewId);
                }
            }
        }
    }
    onServiceDerive(data) {
        const { workId, opt, msgType, viewId, scenePath } = data;
        if (!workId || !viewId || !scenePath) {
            return;
        }
        const workIdStr = workId.toString();
        if (msgType === EPostMessageType.RemoveNode) {
            this.delete(workIdStr, false, true);
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
            dataType: EDataType.Service,
            scale: view?.cameraOpt?.scale || 1,
            viewId,
            scenePath
        };
        this.editors.set(workIdStr, info);
        this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, viewId);
    }
    updateForLocalEditor(activeId, info) {
        this.editors.set(activeId, info);
    }
    active(workId) {
        const info = this.editors.get(workId);
        if (info && info.viewId) {
            info.isActive = true;
            info.opt.workState = EvevtWorkState.Start;
            this.activeId = workId;
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
            // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
        }
    }
    unActive() {
        const info = this.activeId && this.editors.get(this.activeId);
        if (info && info.viewId) {
            info.opt.workState = EvevtWorkState.Done;
            // this.activeIdCache = this.activeId;
            this.activeId = undefined;
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
            // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
        }
    }
    createTextForMasterController(params) {
        const { workId, isActive, ...info } = params;
        if (isActive) {
            this.checkEmptyTextBlur();
            this.activeId = workId;
        }
        // info.opt.workState = EvevtWorkState.Start;
        info.dataType = EDataType.Local;
        info.canWorker = true;
        info.canSync = true;
        this.editors.set(workId, info);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
    }
    updateTextForMasterController(params) {
        // console.log('updateTextForMasterController', params)
        const { workId, isDel, ...info } = params;
        if (isDel) {
            if (this.activeId === workId) {
                this.activeId = undefined;
            }
            this.editors.delete(workId);
        }
        else {
            const _info = this.editors.get(workId) || {};
            info.dataType = EDataType.Local;
            info.canWorker = true;
            info.canSync = true;
            this.editors.set(workId, { ..._info, ...info });
        }
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
    }
    updateTextForWorker(params) {
        // console.log('updateTextForWorker', params)
        const { workId, isDel, isActive, ...info } = params;
        if (isDel) {
            if (this.activeId === workId) {
                this.activeId = undefined;
            }
            this.editors.delete(workId);
        }
        else if (isActive) {
            const _info = this.editors.get(workId);
            if (_info) {
                info.dataType = undefined;
                info.canWorker = false;
                info.canSync = false;
                this.active(workId);
            }
        }
        else {
            const _info = this.editors.get(workId) || {};
            info.dataType = undefined;
            info.canWorker = false;
            info.canSync = true;
            //console.log('updateTextForWorker', {..._info, ...info})
            this.editors.set(workId, { ..._info, ...info });
        }
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
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
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, viewId);
    }
    clear(viewId, justLocal) {
        this.editors.forEach((editor, key) => {
            if (editor.viewId === viewId) {
                if (justLocal) {
                    // console.log('clear-justLocal', viewId)
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
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, Storage_ViewId_ALL);
    }
}
