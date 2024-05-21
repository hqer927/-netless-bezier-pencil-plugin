/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { EPostMessageType, EToolsKey } from "../core/enum";
import { BaseCollector } from "./base";
import { plainObjectKeys } from "./utils";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import { requestAsyncCallBack } from "../core/utils";
import { Storage_Selector_key, Storage_Splitter } from "./const";
import { autorun } from "../plugin/external";
/**
 * 服务端事件/状态同步收集器
 */
export class Collector extends BaseCollector {
    constructor(plugin, syncInterval) {
        super(plugin);
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "serviceStorage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "stateDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "asyncClockState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Collector.syncInterval = (syncInterval || Collector.syncInterval) * 0.5;
        this.namespace = Collector.namespace;
        this.serviceStorage = this.getNamespaceData();
        this.storage = cloneDeep(this.serviceStorage);
    }
    getViewIdBySecenPath(scenePath) {
        const storage = this.getNamespaceData();
        for (const [viewId, viewData] of Object.entries(storage)) {
            for (const key of Object.keys(viewData)) {
                if (key === scenePath) {
                    return viewId;
                }
            }
        }
    }
    getScenePathData(scenePath) {
        const storage = this.getNamespaceData();
        for (const viewData of Object.values(storage)) {
            for (const key of Object.keys(viewData)) {
                if (key === scenePath) {
                    return cloneDeep(viewData[key]);
                }
            }
        }
    }
    getStorageData(viewId, scenePath) {
        const storage = this.getNamespaceData();
        return storage[viewId] && cloneDeep(storage[viewId][scenePath]) || undefined;
    }
    hasSelector(viewId, scenePath) {
        const sceneData = this.storage && this.storage[viewId] && this.storage[viewId][scenePath];
        return !!(sceneData && Object.keys(sceneData).find(key => this.isOwn(key) && this.getLocalId(key) === Storage_Selector_key));
    }
    addStorageStateListener(callBack) {
        this.stateDisposer = autorun(async () => {
            const newStorage = this.getNamespaceData();
            const diff = this.diffFun(this.serviceStorage, newStorage);
            // console.log('addStorageStateListener', cloneDeep(newStorage), cloneDeep(this.serviceStorage), diff)
            this.serviceStorage = newStorage;
            for (const [key, value] of Object.entries(diff)) {
                if (value && value.newValue === undefined) {
                    const { viewId, scenePath } = value;
                    if (viewId && scenePath && this.storage[viewId]) {
                        delete this.storage[viewId][scenePath][key];
                    }
                }
                else if (value && value.newValue) {
                    const { viewId, scenePath } = value;
                    if (!this.storage[viewId]) {
                        this.storage[viewId] = {};
                    }
                    if (!this.storage[viewId][scenePath]) {
                        this.storage[viewId][scenePath] = {};
                    }
                    this.storage[viewId][scenePath][key] = cloneDeep(value.newValue);
                }
            }
            if (Object.keys(diff).length > 0) {
                callBack(diff);
            }
        });
    }
    removeStorageStateListener() {
        if (this.stateDisposer) {
            this.stateDisposer();
        }
    }
    diffFun(_old, _new) {
        const oldKeys = plainObjectKeys(_old);
        const newKeys = plainObjectKeys(_new);
        const diff = {};
        for (const key of oldKeys) {
            if (isEqual(_old[key], _new[key])) {
                continue;
            }
            const _diff = this.diffFunByscenePath(_old[key] || {}, _new[key] || {}, key);
            Object.assign(diff, _diff);
        }
        for (const key of newKeys) {
            if (!oldKeys.includes(key)) {
                const _diff = this.diffFunByscenePath(_old[key] || {}, _new[key] || {}, key);
                Object.assign(diff, _diff);
            }
        }
        return diff;
    }
    diffFunByscenePath(_old, _new, viewId) {
        const oldKeys = plainObjectKeys(_old);
        const newKeys = plainObjectKeys(_new);
        const diff = {};
        for (const key of oldKeys) {
            if (isEqual(_old[key], _new[key])) {
                continue;
            }
            const _diff = this.diffFunByKeys(_old[key] || {}, _new[key] || {}, key, viewId);
            Object.assign(diff, _diff);
        }
        for (const key of newKeys) {
            if (!oldKeys.includes(key)) {
                const _diff = this.diffFunByKeys(_old[key] || {}, _new[key] || {}, key, viewId);
                Object.assign(diff, _diff);
            }
        }
        return diff;
    }
    diffFunByKeys(_old, _new, scenePath, viewId) {
        const oldKeys = plainObjectKeys(_old);
        const newKeys = plainObjectKeys(_new);
        const diff = {};
        for (const key of oldKeys) {
            if (newKeys.includes(key)) {
                if (isEqual(_old[key], _new[key])) {
                    continue;
                }
                diff[key] = {
                    oldValue: _old[key],
                    newValue: _new[key],
                    viewId,
                    scenePath
                };
                continue;
            }
            diff[key] = {
                oldValue: _old[key],
                newValue: undefined,
                viewId,
                scenePath
            };
        }
        for (const key of newKeys) {
            if (!oldKeys.includes(key)) {
                diff[key] = {
                    oldValue: undefined,
                    newValue: _new[key],
                    viewId,
                    scenePath
                };
            }
        }
        return diff;
    }
    transformKey(workId) {
        return this.uid + Storage_Splitter + workId;
    }
    isOwn(key) {
        return key.split(Storage_Splitter)[0] === this.uid;
    }
    dispatch(action) {
        // console.log('dispatch', action)
        const { type, workId, ops, index, opt, toolsType, removeIds, updateNodeOpt, op, selectIds, isSync, scenePath, viewId } = action;
        if (!viewId) {
            return;
        }
        switch (type) {
            case EPostMessageType.Clear:
                const state = {};
                if (scenePath && this.storage[viewId] && this.storage[viewId][scenePath]) {
                    delete this.storage[viewId][scenePath];
                    this.setState(state, { isSync, viewId, scenePath });
                }
                else if (this.storage[viewId]) {
                    delete this.storage[viewId];
                    this.setState(state, { isSync, viewId, scenePath: '' });
                }
                break;
            case EPostMessageType.CreateWork:
                if (scenePath && workId && toolsType && opt) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    this.updateValue(key.toString(), {
                        type: EPostMessageType.CreateWork,
                        workId,
                        toolsType,
                        opt
                    }, { isSync, viewId, scenePath });
                }
                break;
            case EPostMessageType.DrawWork:
                if (scenePath && workId && typeof index === 'number' && op?.length) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[viewId] && this.storage[viewId][scenePath] && this.storage[viewId][scenePath][key] || undefined;
                    const _op = index ? (old?.op || []).slice(0, index).concat(op) : (op || old?.op);
                    if (old && _op) {
                        this.updateValue(key.toString(), {
                            ...old,
                            type: EPostMessageType.DrawWork,
                            op: _op,
                            index
                        }, { isSync, viewId, scenePath });
                    }
                }
                break;
            case EPostMessageType.FullWork:
                if (scenePath && workId) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[viewId] && this.storage[viewId][scenePath] && this.storage[viewId][scenePath][key] || undefined;
                    const _updateNodeOpt = updateNodeOpt || old?.updateNodeOpt;
                    const _toolsType = toolsType || old?.toolsType;
                    const _opt = opt || old?.opt;
                    const _ops = ops || old?.ops;
                    if (_toolsType && _opt) {
                        this.updateValue(key.toString(), {
                            type: EPostMessageType.FullWork,
                            updateNodeOpt: _updateNodeOpt,
                            workId: key,
                            toolsType: _toolsType,
                            opt: _opt,
                            ops: _ops
                        }, { isSync, viewId, scenePath });
                    }
                }
                break;
            case EPostMessageType.RemoveNode:
                if (scenePath && removeIds?.length) {
                    const _removeIds = removeIds.map(id => {
                        if (this.isLocalId(id + '')) {
                            return this.transformKey(id);
                        }
                        return id;
                    });
                    if (this.storage[viewId] && this.storage[viewId][scenePath]) {
                        Object.keys(this.storage[viewId][scenePath]).map(key => {
                            if (_removeIds?.includes(key)) {
                                this.updateValue(key, undefined, { isSync, viewId, scenePath });
                            }
                        });
                    }
                }
                break;
            case EPostMessageType.UpdateNode:
                if (scenePath && workId && (updateNodeOpt || ops || opt)) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[viewId] && this.storage[viewId][scenePath] && this.storage[viewId][scenePath][key] || undefined;
                    if (old) {
                        old.updateNodeOpt = updateNodeOpt;
                        if (ops || op) {
                            old.ops = ops;
                            old.op = op;
                        }
                        if (opt) {
                            old.opt = opt;
                        }
                        old.type = EPostMessageType.FullWork;
                        this.updateValue(key.toString(), old, { isSync, viewId, scenePath });
                    }
                }
                break;
            case EPostMessageType.Select:
                if (!scenePath) {
                    return;
                }
                let _selectIds;
                if (selectIds?.length) {
                    _selectIds = selectIds.map(id => {
                        if (this.isLocalId(id + '')) {
                            return this.transformKey(id);
                        }
                        return id;
                    });
                }
                const key = this.transformKey(Storage_Selector_key);
                const old = this.storage[viewId] && this.storage[viewId][scenePath] && this.storage[viewId][scenePath][key] || undefined;
                const _opt = opt || old?.opt;
                _selectIds && this.checkOtherSelector(key, _selectIds, { isSync, viewId, scenePath });
                this.updateValue(key, _selectIds && {
                    type: EPostMessageType.Select,
                    toolsType: EToolsKey.Selector,
                    opt: _opt,
                    selectIds: _selectIds
                }, { isSync, viewId, scenePath });
                break;
            default:
                break;
        }
    }
    checkOtherSelector(key, selectIds, options) {
        const { viewId, scenePath } = options;
        for (const k of Object.keys(this.storage[viewId][scenePath])) {
            if (k !== key && this.getLocalId(k) === Storage_Selector_key) {
                const value = this.storage[viewId][scenePath][k];
                if (value && value.selectIds) {
                    const ids = value.selectIds.filter(id => !selectIds.includes(id));
                    if (ids.length > 0) {
                        value.selectIds = ids;
                    }
                    // console.log('checkOtherSelector', k, key,  ids, this.serviceStorage[k]?.selectIds)
                    this.updateValue(k, ids.length && value || undefined, options);
                }
            }
        }
    }
    setState(state, options) {
        const { viewId, scenePath } = options;
        const keys = plainObjectKeys(state);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = state[key];
            if (typeof value !== 'undefined') {
                if (!this.storage[viewId]) {
                    this.storage[viewId] = {};
                }
                if (!this.storage[viewId][scenePath]) {
                    this.storage[viewId][scenePath] = {};
                }
                this.storage[viewId][scenePath][key] = value;
            }
            else {
                delete this.storage[viewId][scenePath][key];
            }
        }
        this.runSyncService(options);
    }
    updateValue(key, value, options) {
        const { viewId, scenePath } = options;
        if (value === undefined) {
            delete this.storage[viewId][scenePath][key];
        }
        else {
            if (!this.storage[viewId]) {
                this.storage[viewId] = {};
            }
            if (!this.storage[viewId][scenePath]) {
                this.storage[viewId][scenePath] = {};
            }
            // console.log('updateValue', cloneDeep(value), this.serviceStorage[viewId] && this.serviceStorage[viewId][scenePath] && this.serviceStorage[viewId][scenePath][key] && cloneDeep(this.serviceStorage[viewId][scenePath][key]))
            this.storage[viewId][scenePath][key] = value;
        }
        this.runSyncService(options);
    }
    runSyncService(options) {
        if (!this.asyncClockState) {
            this.asyncClockState = true;
            setTimeout(() => {
                if (options.isSync) {
                    this.asyncClockState = false;
                    this.syncSerivice(options.isAfterUpdate);
                }
                else {
                    requestAsyncCallBack(() => {
                        this.asyncClockState = false;
                        this.syncSerivice(options.isAfterUpdate);
                    }, Collector.syncInterval);
                }
            }, options?.isSync ? 0 : Collector.syncInterval);
        }
    }
    syncSerivice(isAfterUpdate = false) {
        const oldViewIds = plainObjectKeys(this.serviceStorage);
        const newViewIds = plainObjectKeys(this.storage);
        const willSyncViewMap = new Map();
        for (const viewId of oldViewIds) {
            if (!newViewIds.includes(viewId)) {
                willSyncViewMap.set(viewId, undefined);
                continue;
            }
            if (isEqual(this.serviceStorage[viewId], this.storage[viewId])) {
                continue;
            }
            this.syncViewData(viewId, isAfterUpdate);
        }
        for (const viewId of newViewIds) {
            if (!oldViewIds.includes(viewId)) {
                willSyncViewMap.set(viewId, this.storage[viewId]);
            }
        }
        if (willSyncViewMap.size > 5) {
            this.syncStorageView(this.storage, isAfterUpdate);
        }
        else {
            for (const [viewId, value] of willSyncViewMap.entries()) {
                this.syncUpdataView(viewId, value, isAfterUpdate);
            }
        }
    }
    syncViewData(viewId, isAfterUpdate = false) {
        const oldScenePaths = plainObjectKeys(this.serviceStorage[viewId]);
        const newScenePaths = plainObjectKeys(this.storage[viewId]);
        const willSyncMap = new Map();
        for (const scenePath of oldScenePaths) {
            if (!newScenePaths.includes(scenePath)) {
                willSyncMap.set(scenePath, undefined);
                continue;
            }
            if (isEqual(this.serviceStorage[viewId][scenePath], this.storage[viewId][scenePath])) {
                continue;
            }
            this.syncScenePathData(viewId, scenePath, isAfterUpdate);
        }
        for (const scenePath of newScenePaths) {
            if (!oldScenePaths.includes(scenePath)) {
                // console.log('syncViewData---1', this.storage[viewId][scenePath])
                willSyncMap.set(scenePath, this.storage[viewId][scenePath]);
            }
        }
        if (willSyncMap.size > 5) {
            this.syncStorageScenePath(viewId, this.storage[viewId], isAfterUpdate);
        }
        else {
            for (const [scenePath, value] of willSyncMap.entries()) {
                this.syncUpdataScenePath(viewId, scenePath, value, isAfterUpdate);
            }
        }
    }
    syncScenePathData(viewId, scenePath, isAfterUpdate = false) {
        const oldKeys = plainObjectKeys(this.serviceStorage[viewId][scenePath]);
        const newKeys = plainObjectKeys(this.storage[viewId][scenePath]);
        const willSyncMap = new Map();
        for (const key of oldKeys) {
            if (!newKeys.includes(key)) {
                willSyncMap.set(key, undefined);
                continue;
            }
            if (isEqual(this.serviceStorage[viewId][scenePath][key], this.storage[viewId][scenePath][key])) {
                continue;
            }
            willSyncMap.set(key, this.storage[viewId][scenePath][key]);
        }
        for (const key of newKeys) {
            if (!oldKeys.includes(key)) {
                willSyncMap.set(key, this.storage[viewId][scenePath][key]);
            }
        }
        if (willSyncMap.size > 5) {
            this.syncStorageKey(viewId, scenePath, this.storage[viewId][scenePath], isAfterUpdate);
        }
        else {
            for (const [key, value] of willSyncMap.entries()) {
                this.syncUpdataKey(viewId, scenePath, key, value, isAfterUpdate);
            }
        }
    }
    syncUpdataView(viewId, value, isAfterUpdate = false) {
        const length = Object.keys(this.serviceStorage).length;
        if (!length) {
            this.syncStorageView(this.storage, isAfterUpdate);
        }
        else {
            if (!isAfterUpdate) {
                if (value === undefined) {
                    delete this.serviceStorage[viewId];
                }
                else {
                    this.serviceStorage[viewId] = cloneDeep(value);
                }
            }
            this.plugin?.updateAttributes([this.namespace, viewId], value);
        }
    }
    syncStorageView(state, isAfterUpdate = false) {
        if (!isAfterUpdate) {
            if (state) {
                this.serviceStorage = cloneDeep(state);
            }
        }
        this.plugin?.updateAttributes([this.namespace], state);
    }
    syncUpdataScenePath(viewId, scenePath, value, isAfterUpdate = false) {
        const length = Object.keys(this.serviceStorage[viewId]).length;
        if (!length) {
            this.syncStorageScenePath(viewId, this.storage[viewId], isAfterUpdate);
        }
        else {
            if (!isAfterUpdate) {
                if (value === undefined) {
                    delete this.serviceStorage[viewId][scenePath];
                }
                else {
                    this.serviceStorage[viewId][scenePath] = value;
                }
            }
            this.plugin?.updateAttributes([this.namespace, viewId, scenePath], value);
        }
    }
    syncStorageScenePath(viewId, state, isAfterUpdate = false) {
        if (!isAfterUpdate) {
            if (state) {
                this.serviceStorage[viewId] = state;
            }
        }
        this.plugin?.updateAttributes([this.namespace, viewId], state);
    }
    syncUpdataKey(viewId, scenePath, key, value, isAfterUpdate = false) {
        const length = Object.keys(this.serviceStorage[viewId][scenePath]).length;
        if (!length) {
            this.syncStorageKey(viewId, scenePath, this.storage[viewId][scenePath], isAfterUpdate);
        }
        else {
            if (!isAfterUpdate) {
                if (value === undefined) {
                    delete this.serviceStorage[viewId][scenePath][key];
                }
                else {
                    this.serviceStorage[viewId][scenePath][key] = value;
                }
            }
            this.plugin?.updateAttributes([this.namespace, viewId, scenePath, key], value);
        }
    }
    syncStorageKey(viewId, scenePath, state, isAfterUpdate = false) {
        if (!isAfterUpdate) {
            this.serviceStorage[viewId][scenePath] = state;
        }
        this.plugin?.updateAttributes([this.namespace, viewId, scenePath], state);
    }
    keyTransformWorkId(key) {
        const list = key.split(Storage_Splitter);
        return list.length === 2 ? list[1] : key;
    }
    destroy() {
        this.removeStorageStateListener();
        this.serviceStorage = {};
        this.storage = {};
    }
}
Object.defineProperty(Collector, "namespace", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'PluginState'
});
Object.defineProperty(Collector, "syncInterval", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 500
});
