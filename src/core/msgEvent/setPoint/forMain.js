import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
export class SetPointMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.SetPoint
        });
        Object.defineProperty(this, "undoTickerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workId, pointMap, workState, viewId } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const store = this.serviceColloctor?.storage;
        const localMsgs = [];
        // const selectIds: string[] = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        }
        const curKey = workId;
        if (!curKey) {
            return;
        }
        const curKeyStr = curKey.toString();
        const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
        const key = isLocalId && this.serviceColloctor.transformKey(curKey) || curKeyStr;
        let localWorkId = curKeyStr;
        if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
            localWorkId = this.serviceColloctor.getLocalId(localWorkId);
        }
        const curStore = store[viewId][scenePath][key];
        if (curStore && localWorkId === Storage_Selector_key) {
            if (curStore.selectIds) {
                // selectIds.push(...curStore.selectIds);
                const updateNodeOpt = curStore.updateNodeOpt || {};
                updateNodeOpt.pointMap = pointMap;
                updateNodeOpt.workState = workState;
                const taskData = {
                    workId: curKey,
                    msgType: EPostMessageType.UpdateNode,
                    dataType: EDataType.Local,
                    updateNodeOpt,
                    emitEventType: this.emitEventType,
                    willRefreshSelector: true,
                    willSyncService: true,
                    viewId
                };
                if (workState === EvevtWorkState.Done) {
                    taskData.undoTickerId = this.undoTickerId;
                }
                localMsgs.push(taskData);
            }
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}
