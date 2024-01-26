import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
import { UndoRedoMethod } from "../../../undo";
export class SetColorNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.SetColorNode
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, color, opacity } = data;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs = [];
        const serviceMsgs = [];
        const selectIds = [];
        const undoTickerId = Date.now();
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
                // const selector = store[SelectorShape.selectorId];
                if (curStore.selectIds) {
                    selectIds.push(...curStore.selectIds);
                    // keys.push(...selector.selectIds);
                    const updateNodeOpt = curStore.updateNodeOpt || {};
                    updateNodeOpt.color = color;
                    if (opacity) {
                        updateNodeOpt.opacity = opacity;
                    }
                    const taskData = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: true,
                        willSyncService: true
                    };
                    const subStore = new Map();
                    selectIds.forEach((name) => {
                        const isLocalId = this.serviceColloctor?.isLocalId(name);
                        let key = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                        const curStore = store[key];
                        if (!isLocalId && this.serviceColloctor?.isOwn(key)) {
                            key = this.serviceColloctor.getLocalId(key);
                        }
                        curStore?.opt && subStore.set(key, {
                            updateNodeOpt: curStore.updateNodeOpt,
                            opt: curStore.opt,
                        });
                    });
                    taskData.selectStore = subStore;
                    taskData.willSerializeData = true;
                    taskData.undoTickerId = undoTickerId;
                    localMsgs.push(taskData);
                }
                continue;
            }
            if (curStore) {
                const opt = curStore.opt;
                const updateNodeOpt = curStore.updateNodeOpt || {};
                if (opt) {
                    updateNodeOpt.color = color;
                    updateNodeOpt.opacity = opacity;
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
        UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}
