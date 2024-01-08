/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
import cloneDeep from "lodash/cloneDeep";
export const Storage_Splitter = '++';
export class BaseCollector {
    setNamespace(namespace) {
        this.namespace = namespace;
        this.serviceStorage = toJS(this.plugin.attributes[namespace]) || {};
        this.storage = cloneDeep(this.serviceStorage);
    }
    isLocalId(key) {
        return key.split(Storage_Splitter).length === 1;
    }
    getLocalId(key) {
        return key.split(Storage_Splitter)[1];
    }
}
