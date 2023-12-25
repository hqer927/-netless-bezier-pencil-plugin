import { EmitEventType, InternalMsgEmitterType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
export class DeleteNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.DeleteNode
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds } = data;
        const store = this.serviceColloctor.storage;
        const keys = [...workIds];
        const localMsgs = [];
        const serviceMsgs = [];
        const removeIds = [];
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = store[key];
            let localWorkId = curKeyStr;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            if (curStore && localWorkId === SelectorShape.selectorId) {
                removeIds.push(key);
                this.emitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], false);
                if (curStore.selectIds) {
                    removeIds.push(...curStore.selectIds);
                    localMsgs.push({
                        msgType: EPostMessageType.RemoveNode,
                        workId: localWorkId,
                        dataType: EDataType.Local,
                        emitEventType: EmitEventType.DeleteNode,
                    });
                }
                continue;
            }
            if (curStore) {
                removeIds.push(key);
            }
            localMsgs.push({
                msgType: EPostMessageType.RemoveNode,
                emitEventType: EmitEventType.DeleteNode,
                workId: curKey,
                dataType: EDataType.Local,
                willSyncService: false,
                willRefresh: true
            });
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (removeIds.length) {
            serviceMsgs.push({
                type: EPostMessageType.RemoveNode,
                removeIds,
            });
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}
