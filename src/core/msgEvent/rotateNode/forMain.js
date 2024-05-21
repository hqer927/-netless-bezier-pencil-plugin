import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
export class RotateNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.RotateNode
        });
        Object.defineProperty(this, "undoTickerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cacheOriginRotate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, angle, workState, viewId } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs = [];
        // const serviceMsgs: BaseCollectorReducerAction[] = [];
        const selectIds = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        }
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
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
                if (curStore.selectIds?.length === 1) {
                    const id = curStore.selectIds[0];
                    selectIds.push(id);
                    if (workState === EvevtWorkState.Start) {
                        const isLocalId = this.serviceColloctor?.isLocalId(id);
                        const key = isLocalId && this.serviceColloctor?.transformKey(id) || id;
                        const curSubStore = store[viewId][scenePath][key];
                        this.cacheOriginRotate = curSubStore?.opt?.rotate || 0;
                    }
                    const updateNodeOpt = curStore.updateNodeOpt || {};
                    updateNodeOpt.angle = (angle + this.cacheOriginRotate) % 360;
                    updateNodeOpt.workState = workState;
                    const taskData = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: false,
                        willSyncService: true,
                        viewId
                    };
                    if (workState === EvevtWorkState.Done) {
                        taskData.willRefreshSelector = true;
                        taskData.willSerializeData = true;
                        taskData.undoTickerId = this.undoTickerId;
                        this.cacheOriginRotate = 0;
                    }
                    localMsgs.push([taskData, {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            emitEventType: this.emitEventType
                        }]);
                }
                continue;
            }
        }
        if (workState === EvevtWorkState.Start) {
            this.mainEngine.unWritable();
        }
        else if (workState === EvevtWorkState.Done) {
            this.mainEngine.abled();
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}
