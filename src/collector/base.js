/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
import cloneDeep from "lodash/cloneDeep";
import { Storage_Splitter } from "./const";
export class BaseCollector {
    setNamespace(namespace) {
        this.namespace = namespace;
        this.serviceStorage = this.getNamespaceData(namespace);
        this.storage = cloneDeep(this.serviceStorage);
    }
    getNamespaceData(namespace) {
        return toJS(this.plugin?.attributes[namespace]) || {};
    }
    isLocalId(key) {
        return key.split(Storage_Splitter).length === 1;
    }
    getLocalId(key) {
        return key.split(Storage_Splitter)[1];
    }
}
