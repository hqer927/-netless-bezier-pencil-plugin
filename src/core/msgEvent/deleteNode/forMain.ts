import { EmitEventType, InternalMsgEmitterType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { SelectorShape } from "../../tools";
import { UndoRedoMethod } from "../../../undo";
import { BezierPencilDisplayer } from "../../../plugin";

export type DeleteNodeEmtData = {
    workIds: IworkId[]
}
export class DeleteNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.DeleteNode;
    collect(data: DeleteNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds } = data;
        const store = this.serviceColloctor.storage;
        const keys = [...workIds];
        const localMsgs: IWorkerMessage[] = [];
        const serviceMsgs: BaseCollectorReducerAction[] = [];
        const removeIds:string[] = [];
        const undoTickerId = Date.now();
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString()
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = store[key];
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            if (curStore && localWorkId === SelectorShape.selectorId) {
                removeIds.push(key);
                BezierPencilDisplayer.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], false);
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
        UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (removeIds.length) {
            serviceMsgs.push({
                type: EPostMessageType.RemoveNode,
                removeIds,
                undoTickerId
            })
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}