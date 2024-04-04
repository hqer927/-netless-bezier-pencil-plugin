import { toJS } from "white-web-sdk";
import { Storage_Selector_key, Storage_Splitter } from "./const";
export class BaseCollector {
    constructor(plugin) {
        Object.defineProperty(this, "plugin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "uid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.plugin = plugin;
        this.uid = plugin.displayer.uid;
    }
    getNamespaceData() {
        return (toJS(this.plugin?.attributes[this.namespace]) || {});
    }
    getUidFromKey(key) {
        return key.split(Storage_Splitter).length === 2 && key.split(Storage_Splitter)[0] || this.uid;
    }
    isLocalId(key) {
        return key.split(Storage_Splitter).length === 1;
    }
    getLocalId(key) {
        return key.split(Storage_Splitter)[1];
    }
    isSelector(key) {
        return this.getLocalId(key) === Storage_Selector_key;
    }
}
