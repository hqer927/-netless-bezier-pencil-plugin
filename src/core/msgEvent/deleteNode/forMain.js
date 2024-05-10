import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType, EToolsKey } from "../../enum";
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
        const { workIds, viewId } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const store = this.serviceColloctor.storage;
        const keys = [...workIds];
        const localMsgs = [];
        const removeIds = [];
        const undoTickerId = Date.now();
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = store[viewId][scenePath][key];
            if (curStore) {
                let localWorkId = curKeyStr;
                if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                    localWorkId = this.serviceColloctor.getLocalId(localWorkId);
                }
                if (curStore.toolsType === EToolsKey.Text) {
                    this.control.textEditorManager.delete(localWorkId, true, true);
                    continue;
                }
                removeIds.push(localWorkId);
            }
        }
        if (removeIds.length) {
            localMsgs.push([{
                    msgType: EPostMessageType.RemoveNode,
                    emitEventType: EmitEventType.DeleteNode,
                    removeIds,
                    dataType: EDataType.Local,
                    willSyncService: true,
                    willRefresh: true,
                    undoTickerId,
                    viewId
                }, undefined]);
            this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
            this.collectForLocalWorker(localMsgs);
        }
    }
}
