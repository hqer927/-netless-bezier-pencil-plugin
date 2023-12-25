import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";
export class ScaleNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.ScaleNode
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, size, workState } = data;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs = [];
        const serviceMsgs = [];
        const selectIds = [];
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = cloneDeep(store[key]);
            let localWorkId = curKeyStr;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            if (curStore && localWorkId === SelectorShape.selectorId) {
                if (curStore.selectIds) {
                    selectIds.push(...curStore.selectIds);
                    // keys.push(...selector.selectIds);
                    if (workState !== EvevtWorkState.Start) {
                        const updateNodeOpt = curStore.updateNodeOpt || {};
                        updateNodeOpt.size = size;
                        updateNodeOpt.workState = workState;
                        const taskData = {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willRefreshSelector: true,
                            willSyncService: true
                        };
                        if (workState === EvevtWorkState.Done) {
                            const subStore = new Map();
                            selectIds.forEach((name) => {
                                const isLocalId = this.serviceColloctor?.isLocalId(name);
                                let key = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                                const curStore = store[key];
                                if (!isLocalId && this.serviceColloctor?.isOwn(key)) {
                                    key = this.serviceColloctor.getLocalId(key);
                                }
                                curStore?.ops && subStore.set(key, {
                                    ops: curStore.ops,
                                    updateNodeOpt: curStore.updateNodeOpt,
                                    opt: curStore.opt,
                                    toolsType: curStore.toolsType,
                                });
                            });
                            taskData.selectStore = subStore;
                            taskData.willSerializeData = true;
                        }
                        localMsgs.push(taskData);
                    }
                }
                continue;
            }
            if (curStore) {
                const opt = curStore.opt;
                const updateNodeOpt = curStore.updateNodeOpt || {};
                // let pos = updateNodeOpt.pos || 0;
                if (opt) {
                    updateNodeOpt.size = size;
                    serviceMsgs.push({
                        ...curStore,
                        type: EPostMessageType.UpdateNode,
                        updateNodeOpt
                    });
                    if (!selectIds.includes(curKeyStr)) {
                        let localWorkId = curKeyStr;
                        if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                            localWorkId = this.serviceColloctor.getLocalId(localWorkId);
                        }
                        localMsgs.push({
                            workId: localWorkId,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willSyncService: false,
                            willRefresh: true
                        });
                    }
                }
            }
        }
        if (localMsgs.length) {
            //console.log('localMsgs', localMsgs)
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            //console.log('serviceMsgs', serviceMsgs)
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}
