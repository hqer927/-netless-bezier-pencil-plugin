import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";

export class SetColorNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.SetColorNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType, undoTickerId} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            if (undoTickerId) {
                setTimeout(()=>{
                    this.localWork?._post({
                        sp:[{
                            type: EPostMessageType.None,
                            undoTickerId,
                        }]
                    })
                },0)
            }
            return true;
        }        
    }
    consumeForLocalWorker(data: IWorkerMessage): void {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willRefresh, willSerializeData, textUpdateForWoker} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, textUpdateForWoker})
        } else if (workId && updateNodeOpt) {
            this.localWork?.updateNode({workId, updateNodeOpt, willRefresh, willSyncService})
        }
    }
}