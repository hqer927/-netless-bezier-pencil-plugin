import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";
export class RotateNodeMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.RotateNode
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
        const { workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, emitEventType } = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({ updateSelectorOpt: updateNodeOpt, willRefreshSelector,
                willSyncService, willSerializeData, emitEventType, isSync: true, scene: this.scene, callback: this.updateSelectorCallback });
        }
    }
    updateSelectorCallback(props) {
        const { param, postData, workShapeNode, res, newServiceStore } = props;
        const { updateSelectorOpt, willSyncService, willSerializeData, isSync } = param;
        const workState = updateSelectorOpt.workState;
        const render = postData.render || [];
        const sp = postData.sp || [];
        const selectRect = res?.selectRect;
        if (willSyncService) {
            if (willSerializeData) {
                if (workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: true,
                        isSync,
                        points: workShapeNode.getChildrenPoints()
                    });
                }
            }
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
        // console.log('updateSelector---0---0--RotateNode', render, sp)
        return {
            render,
            sp
        };
    }
}
