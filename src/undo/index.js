/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import { Storage_Selector_key } from "../collector";
import { cloneDeep, debounce, isEqual } from "lodash";
export var EUndoType;
(function (EUndoType) {
    EUndoType[EUndoType["sdk"] = 1] = "sdk";
    EUndoType[EUndoType["plugin"] = 2] = "plugin";
    EUndoType[EUndoType["both"] = 3] = "both";
})(EUndoType || (EUndoType = {}));
export var EUndoDataType;
(function (EUndoDataType) {
    EUndoDataType[EUndoDataType["Draw"] = 1] = "Draw";
    EUndoDataType[EUndoDataType["Delete"] = 2] = "Delete";
    EUndoDataType[EUndoDataType["Update"] = 3] = "Update";
})(EUndoDataType || (EUndoDataType = {}));
export class UndoRedoMethod {
    constructor(props) {
        Object.defineProperty(this, "emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventEmitter2()
        });
        Object.defineProperty(this, "undoStack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "redoStack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worker", {
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
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "room", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isTicking", {
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
        Object.defineProperty(this, "viewId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scenePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tickStartStorerCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "excludeIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "undoTickerEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: debounce((id, viewId, scenePath) => {
                if (id === this.undoTickerId && scenePath === this.scenePath && viewId === this.viewId && this.tickStartStorerCache) {
                    const storage = this.collector.storage[viewId] && this.collector.storage[viewId][scenePath] || {};
                    const diff = this.diffFun(this.tickStartStorerCache, new Map(Object.entries(storage)));
                    // console.log('undoTickerEnd', id, viewId, storage, diff)
                    if (diff.size) {
                        this.undoStack.push({
                            id,
                            type: EUndoType.plugin,
                            data: diff,
                            scenePath
                        });
                        if (this.undoStack.length > UndoRedoMethod.MaxStackLength) {
                            this.undoStack.shift();
                        }
                        this.emitter.emit('onCanUndoStepsUpdate', this.undoStack.length);
                    }
                    if (this.redoStack.length) {
                        this.redoStack.length = 0;
                        this.emitter.emit('onCanRedoStepsUpdate', this.redoStack.length);
                    }
                }
                this.isTicking = false;
                this.scenePath = undefined;
                this.tickStartStorerCache = undefined;
                this.undoTickerId = undefined;
                this.excludeIds.clear();
            }, UndoRedoMethod.waitTime)
        });
        const { control, internalMsgEmitter, viewId } = props;
        this.control = control;
        this.emitter = internalMsgEmitter;
        this.undoStack = [];
        this.redoStack = [];
        this.room = control.room;
        this.worker = control.worker;
        this.collector = control.collector;
        this.isTicking = false;
        this.viewId = viewId;
    }
    addExcludeIds(ids) {
        if (this.isTicking) {
            for (const id of ids) {
                this.excludeIds.add(id);
            }
        }
    }
    undoTickerStart(id, scenePath) {
        this.isTicking = true;
        this.excludeIds.clear();
        this.undoTickerId = id;
        this.scenePath = scenePath;
        const storage = this.collector.storage[this.viewId] && this.collector.storage[this.viewId][scenePath] || {};
        this.tickStartStorerCache = new Map(Object.entries(cloneDeep(storage)));
    }
    undo(scenePath) {
        let i = this.undoStack.length - 1;
        while (i >= 0) {
            const data = this.undoStack[i];
            if (data.scenePath === scenePath) {
                const data = this.undoStack[i];
                if (data) {
                    this.redoStack.push(data);
                    if (data.type === EUndoType.plugin && data.data) {
                        this.refreshPlugin(data);
                    }
                }
                this.undoStack.splice(i, 1);
                break;
            }
            i--;
        }
        const undoLength = this.undoStack.filter(s => s.scenePath === scenePath).length;
        const redoLength = this.redoStack.filter(s => s.scenePath === scenePath).length;
        this.emitter.emit("onCanUndoStepsUpdate", undoLength);
        this.emitter.emit("onCanRedoStepsUpdate", redoLength);
        return undoLength;
    }
    redo(scenePath) {
        let i = this.redoStack.length - 1;
        while (i > 0) {
            const data = this.redoStack[i];
            if (data.scenePath === scenePath) {
                const data = this.redoStack[i];
                if (data) {
                    this.undoStack.push(data);
                    if (data.type === EUndoType.plugin && data.data) {
                        this.refreshPlugin(data, true);
                    }
                }
                this.redoStack.splice(i, 1);
                break;
            }
            i--;
        }
        const undoLength = this.undoStack.filter(s => s.scenePath === scenePath).length;
        const redoLength = this.redoStack.filter(s => s.scenePath === scenePath).length;
        this.emitter.emit("onCanUndoStepsUpdate", undoLength);
        this.emitter.emit("onCanRedoStepsUpdate", redoLength);
        return redoLength;
    }
    clear() {
        this.clearUndo();
        this.clearRedo();
    }
    clearUndo() {
        this.undoStack.length = 0;
        this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length);
    }
    clearRedo() {
        this.redoStack.length = 0;
        this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length);
    }
    canUndo() {
        if (this.undoStack.length) {
            return true;
        }
        return false;
    }
    canRedo() {
        if (this.redoStack.length) {
            return true;
        }
        return false;
    }
    diffFun(_old, _new) {
        const diff = new Set();
        const oldKeys = _old.keys();
        const newKeys = _new.keys();
        for (const key of oldKeys) {
            if (this.excludeIds.has(key)) {
                continue;
            }
            const _oldV = _old.get(key);
            const _newV = _new.get(key);
            if (_oldV && _newV) {
                if (isEqual(_newV, _oldV)) {
                    continue;
                }
                diff.add({
                    dataType: EUndoDataType.Update,
                    key,
                    data: [_oldV, _newV],
                });
                continue;
            }
            _oldV && diff.add({
                dataType: EUndoDataType.Delete,
                key,
                data: _oldV,
            });
        }
        for (const key of newKeys) {
            const _newV = _new.get(key);
            if (_newV && !_old.has(key)) {
                diff.add({
                    dataType: EUndoDataType.Draw,
                    key,
                    data: _newV,
                });
            }
        }
        return diff;
    }
    isDrawEffectiveScene(value, keys) {
        const { key } = value;
        if (keys.includes(key)) {
            return false;
        }
        return true;
    }
    isDeleteEffectiveScene(value, keys, scenePath) {
        const { key } = value;
        if (!keys.includes(key)) {
            return false;
        }
        const otherSelectorData = keys.filter(k => this.collector.getLocalId(k) === Storage_Selector_key && !this.collector.isOwn(k)).map(key => this.collector.storage[this.viewId][scenePath][key]);
        for (const data of otherSelectorData) {
            if (data?.selectIds?.includes(key)) {
                return false;
            }
        }
        return true;
    }
    isOldEffectiveScene(value, keys, scenePath) {
        const { key } = value;
        if (!keys.includes(key)) {
            return false;
        }
        const otherSelectorData = keys.filter(k => this.collector.getLocalId(k) === Storage_Selector_key && !this.collector.isOwn(k)).map(key => this.collector.storage[this.viewId][scenePath][key]);
        for (const data of otherSelectorData) {
            if (data?.selectIds?.includes(key)) {
                return false;
            }
        }
        return true;
    }
    isNewEffectiveScene(value, keys) {
        const { key } = value;
        if (!keys.includes(key)) {
            return false;
        }
        return true;
    }
    refreshPlugin(item, isRedo = false) {
        let isOk;
        const { scenePath } = item;
        const targetData = item.data;
        if (!targetData) {
            return;
        }
        for (const value of targetData.values()) {
            const { dataType, data, key } = value;
            const keys = Object.keys(this.collector.storage[this.viewId][scenePath]);
            switch (dataType) {
                case EUndoDataType.Draw:
                    isOk = isRedo ? this.isDrawEffectiveScene(value, keys) : this.isDeleteEffectiveScene(value, keys, scenePath);
                    if (isOk) {
                        if (isRedo && !Array.isArray(data)) {
                            if (data.updateNodeOpt?.useAnimation) {
                                data.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector.getLocalId(key) === Storage_Selector_key && this.collector.isOwn(value.key)) {
                                const selectIds = data.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k => this.collector.getLocalId(k) === Storage_Selector_key && !this.collector.isOwn(k)).map(key => this.collector.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (data?.selectIds?.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }
                                        }
                                    }
                                    if (isfalt) {
                                        data.selectIds = selectIds.filter(id => !!id);
                                    }
                                }
                            }
                            // console.log('refreshPlugin--1', value.data)
                            this.collector.updateValue(value.key, data, { isAfterUpdate: true, viewId: this.viewId, scenePath });
                        }
                        else if (!isRedo && !Array.isArray(value.data)) {
                            // console.log('refreshPlugin--2', undefined)
                            this.collector.updateValue(value.key, undefined, { isAfterUpdate: true, viewId: this.viewId, scenePath });
                        }
                    }
                    break;
                case EUndoDataType.Delete:
                    isOk = isRedo ? this.isDeleteEffectiveScene(value, keys, scenePath) : this.isDrawEffectiveScene(value, keys);
                    if (isOk) {
                        if (isRedo && !Array.isArray(data)) {
                            // console.log('refreshPlugin--6', undefined)
                            this.collector.updateValue(key, undefined, { isAfterUpdate: true, viewId: this.viewId, scenePath });
                        }
                        else if (!isRedo && !Array.isArray(data)) {
                            if (data.updateNodeOpt?.useAnimation) {
                                data.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector.getLocalId(value.key) === Storage_Selector_key && this.collector.isOwn(value.key)) {
                                const selectIds = data.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k => this.collector.getLocalId(k) === Storage_Selector_key && !this.collector.isOwn(k)).map(key => this.collector.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (data?.selectIds?.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }
                                        }
                                    }
                                    if (isfalt) {
                                        data.selectIds = selectIds.filter(id => !!id);
                                    }
                                }
                            }
                            // console.log('refreshPlugin--5', value.data)
                            this.collector.updateValue(value.key, value.data, { isAfterUpdate: true, viewId: this.viewId, scenePath });
                        }
                    }
                    break;
                case EUndoDataType.Update:
                    isOk = isRedo ? this.isNewEffectiveScene(value, keys) : this.isOldEffectiveScene(value, keys, scenePath);
                    if (isOk) {
                        if (isRedo && Array.isArray(data) && data.length === 2) {
                            const newData = data[1];
                            if (newData.updateNodeOpt?.useAnimation) {
                                newData.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector.getLocalId(value.key) === Storage_Selector_key && this.collector.isOwn(value.key)) {
                                const selectIds = newData.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k => this.collector.getLocalId(k) === Storage_Selector_key && !this.collector.isOwn(k)).map(key => this.collector.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const _data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (_data?.selectIds && _data.selectIds?.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }
                                        }
                                    }
                                    if (isfalt) {
                                        newData.selectIds = selectIds.filter(id => !!id);
                                    }
                                }
                            }
                            // console.log('refreshPlugin--4', newData)
                            this.collector.updateValue(key, newData, { isAfterUpdate: true, viewId: this.viewId, scenePath });
                        }
                        else if (!isRedo && Array.isArray(data) && data.length === 2) {
                            const oldData = data[0];
                            if (oldData.updateNodeOpt?.useAnimation) {
                                oldData.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector.getLocalId(value.key) === Storage_Selector_key && this.collector.isOwn(value.key)) {
                                const selectIds = oldData.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k => this.collector.getLocalId(k) === Storage_Selector_key && !this.collector.isOwn(k)).map(key => this.collector.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const _data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (_data?.selectIds && _data.selectIds.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }
                                        }
                                    }
                                    if (isfalt) {
                                        oldData.selectIds = selectIds.filter(id => !!id);
                                    }
                                }
                            }
                            // console.log('refreshPlugin--3', oldData)
                            this.collector.updateValue(value.key, oldData, { isAfterUpdate: true, viewId: this.viewId, scenePath });
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
Object.defineProperty(UndoRedoMethod, "MaxStackLength", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 20
});
Object.defineProperty(UndoRedoMethod, "waitTime", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 100
});
