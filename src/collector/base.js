/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
export class BaseCollector {
    setNamespace(namespace) {
        this.namespace = namespace;
        this.storage = toJS(this.plugin.attributes[namespace]) || {};
    }
    isLocalId(key) {
        return key.split('++++').length === 1;
    }
    getLocalId(key) {
        return key.split('++++')[1];
    }
}
