/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
import cloneDeep from "lodash/cloneDeep";
import { Storage_Splitter } from "./const";
export class BaseCollector {
    setNamespace(namespace) {
        this.namespace = namespace;
        this.serviceStorage = toJS(this.plugin?.attributes[namespace]) || {};
        this.storage = cloneDeep(this.serviceStorage);
    }
    isLocalId(key) {
        return key.split(Storage_Splitter).length === 1;
    }
    getLocalId(key) {
        return key.split(Storage_Splitter)[1];
    }
}
