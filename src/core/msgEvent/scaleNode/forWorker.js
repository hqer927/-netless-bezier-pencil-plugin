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
        const { msgType, dataType, emitEventType, undoTickerId } = data;
        if (msgType !== EPostMessageType.UpdateNode)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            if (undoTickerId) {
                setTimeout(() => {
                    this.localWork?._post({
                        sp: [{
                                type: EPostMessageType.None,
                                undoTickerId,
                            }]
                    });
                }, 0);
            }
            return true;
        }
    }
    consumeForLocalWorker(data) {
        const { workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, textUpdateForWoker } = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            this.localWork?.updateSelector({ updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, emitEventType: this.emitEventType, willSerializeData, isSync: true, textUpdateForWoker });
        }
    }
}
