import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType, EToolsKey } from "../../enum";
// import { BaseCollectorReducerAction } from "../../../collector/types";
import { UndoRedoMethod } from "../../../undo";
// import { TeachingAidsManager } from "../../../plugin";
// import { Storage_Selector_key } from "../../../collector";

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
        // const serviceMsgs: BaseCollectorReducerAction[] = [];
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
            if (curStore) {
                let localWorkId:string | undefined = curKeyStr ;
                if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                    localWorkId = this.serviceColloctor.getLocalId(localWorkId);
                }
                if (curStore.toolsType === EToolsKey.Text) {
                    this.mainEngine.textEditorManager.delete(localWorkId);
                    continue;
                }
                removeIds.push(localWorkId);
            }
        }
        localMsgs.push({
            msgType: EPostMessageType.RemoveNode,
            emitEventType: EmitEventType.DeleteNode,
            removeIds,
            dataType: EDataType.Local,
            willSyncService: true,
            willRefresh: true,
            undoTickerId,
        });
        UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}