import { EventMessageType } from "../core/enum";
import { autorun } from "white-web-sdk";
import { BaseCollector } from "./base";
import { requestAsyncCallBack } from "../core/utils";
import { Storage_Splitter } from "./const";
import isEqual from "lodash/isEqual";
/**
 * 服务端事件/状态同步收集器
 */
export class EventCollector extends BaseCollector {
    constructor(plugin, syncInterval) {
        super();
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
        Object.defineProperty(this, "uid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plugin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stateDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "asyncClockTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        EventCollector.syncInterval = (syncInterval || EventCollector.syncInterval) * 0.5;
        this.plugin = plugin;
        this.uid = plugin.displayer.uid;
        this.setNamespace(EventCollector.namespace);
    }
    addStorageStateListener(callBack) {
        this.stateDisposer = autorun(async () => {
            const storage = this.getNamespaceData(this.namespace);
            const diffMap = this.getDiffMap(this.serviceStorage, storage);
            this.serviceStorage = storage;
            if (diffMap.size) {
                callBack(diffMap);
            }
        });
    }
    getDiffMap(_old, _new) {
        const diffMap = new Map();
        for (const [key, value] of Object.entries(_new)) {
            if (key === this.uid) {
                continue;
            }
            if (value && isEqual(_old[key], value)) {
                continue;
            }
            value && diffMap.set(key, value);
        }
        return diffMap;
    }
    removeStorageStateListener() {
        if (this.stateDisposer) {
            this.stateDisposer();
        }
    }
    transformKey(workId) {
        return this.uid + Storage_Splitter + workId;
    }
    isOwn(key) {
        return key === this.uid;
    }
    dispatch(action) {
        const { type, op, isSync } = action;
        switch (type) {
            case EventMessageType.Cursor:
                if (op) {
                    this.pushValue(this.uid, {
                        type: EventMessageType.Cursor,
                        op
                    }, { isSync });
                }
                break;
            default:
                break;
        }
    }
    pushValue(uid, value, options) {
        if (!this.storage[uid]) {
            this.storage[uid] = [];
        }
        this.storage[uid]?.push(value);
        this.runSyncService(options);
    }
    clearValue(uid) {
        this.storage[uid] = undefined;
        const length = Object.keys(this.serviceStorage).length;
        if (length) {
            this.plugin?.updateAttributes([this.namespace, uid], undefined);
        }
    }
    runSyncService(options) {
        if (!this.asyncClockTimer) {
            this.asyncClockTimer = setTimeout(() => {
                if (options?.isSync) {
                    this.asyncClockTimer = undefined;
                    this.syncSerivice();
                }
                else {
                    requestAsyncCallBack(() => {
                        this.asyncClockTimer = undefined;
                        this.syncSerivice();
                    }, EventCollector.syncInterval);
                }
            }, options?.isSync ? 0 : EventCollector.syncInterval);
        }
    }
    syncSerivice() {
        const length = Object.keys(this.serviceStorage).length;
        if (!length) {
            this.plugin?.updateAttributes(this.namespace, this.storage);
        }
        else {
            Object.keys(this.storage).forEach((uid) => {
                this.plugin?.updateAttributes([this.namespace, uid], this.storage[uid]);
            });
        }
        this.storage = {};
    }
    destroy() {
        this.removeStorageStateListener();
        this.plugin = undefined;
        this.storage = {};
        this.serviceStorage = {};
        this.namespace = '';
    }
}
Object.defineProperty(EventCollector, "syncInterval", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 500
});
Object.defineProperty(EventCollector, "namespace", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'PluginEvent'
});
