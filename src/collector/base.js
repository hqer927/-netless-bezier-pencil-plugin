/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
import cloneDeep from "lodash/cloneDeep";
import { Storage_Selector_key, Storage_Splitter } from "./const";
export class BaseCollector {
    setNamespace(namespace) {
        this.namespace = namespace;
        this.serviceStorage = this.getNamespaceData(namespace);
        this.storage = cloneDeep(this.serviceStorage);
    }
    getNamespaceData(namespace) {
        return toJS(this.plugin?.attributes[namespace || this.namespace]) || {};
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
    hasSelector() {
        return !!(this.storage && Object.keys(this.storage).find(key => this.isOwn(key) && this.getLocalId(key) === Storage_Selector_key));
    }
    isSelector(key) {
        return this.getLocalId(key) === Storage_Selector_key;
    }
}
