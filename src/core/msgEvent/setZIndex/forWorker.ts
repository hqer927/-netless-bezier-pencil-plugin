import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";

export class ZIndexNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    consumeForLocalWorker(data: IWorkerMessage): void {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willRefresh, willSerializeData} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData})
        } else if (workId && updateNodeOpt) {
            this.localWork?.updateNode({workId, updateNodeOpt, willRefresh, willSyncService})
        }
    }
}