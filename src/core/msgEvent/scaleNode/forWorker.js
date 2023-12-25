import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
export class ScaleNodeMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.ScaleNode
        });
    }
    consume(data) {
        const { msgType, dataType, emitEventType } = data;
        if (msgType !== EPostMessageType.UpdateNode)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }
    }
    consumeForLocalWorker(data) {
        const { workId, updateNodeOpt, willRefreshSelector, willSyncService, willRefresh, selectStore, willSerializeData } = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            this.localWork?.updateSelector({ updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, emitEventType: this.emitEventType, selectStore, willSerializeData });
        }
        else if (workId && updateNodeOpt) {
            this.localWork?.updateNode({ workId, updateNodeOpt, willRefresh, willSyncService });
        }
    }
}
