import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
export class SetShapeOptMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.SetShapeOpt
        });
    }
    consume(data) {
        const { msgType, dataType, emitEventType, undoTickerId } = data;
        if (msgType !== EPostMessageType.UpdateNode)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data).finally(() => {
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
            });
            return true;
        }
    }
    async consumeForLocalWorker(data) {
        const { workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData } = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({ updateSelectorOpt: updateNodeOpt, willRefreshSelector,
                willSyncService, willSerializeData, callback: this.updateSelectorCallback });
        }
    }
    updateSelectorCallback(props) {
        const { param, postData, newServiceStore } = props;
        const { willSyncService, isSync } = param;
        const render = postData.render || [];
        const sp = postData.sp || [];
        if (willSyncService && sp) {
            for (const [workId, info] of newServiceStore.entries()) {
                sp.push({
                    ...info,
                    workId,
                    type: EPostMessageType.UpdateNode,
                    updateNodeOpt: {
                        useAnimation: false
                    },
                    isSync
                });
            }
        }
        // console.log('updateSelector---0---0--SetFont', render, sp)
        return {
            render,
            sp
        };
    }
}
