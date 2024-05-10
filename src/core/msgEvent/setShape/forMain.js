/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
export class SetShapeOptMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.SetShapeOpt
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, viewId, ...newUpdateNodeOpt } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs = [];
        // const undoTickerId = Date.now();
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            let localWorkId = curKeyStr;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            const curStore = store[viewId][scenePath][key] || undefined;
            if (curStore) {
                const updateNodeOpt = {
                    ...curStore.updateNodeOpt,
                    ...newUpdateNodeOpt,
                    willRefresh: true
                };
                if (curStore && localWorkId === Storage_Selector_key) {
                    const taskData = {
                        workId: localWorkId,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefresh: true,
                        willRefreshSelector: true,
                        willSyncService: true,
                        viewId,
                        // undoTickerId
                    };
                    localMsgs.push([taskData, {
                            workId: localWorkId,
                            msgType: EPostMessageType.UpdateNode,
                            emitEventType: this.emitEventType
                        }]);
                }
            }
        }
        if (localMsgs.length) {
            // this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
            this.collectForLocalWorker(localMsgs);
        }
    }
}
