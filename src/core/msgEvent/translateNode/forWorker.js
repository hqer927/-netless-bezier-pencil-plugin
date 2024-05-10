import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";
export class TranslateNodeMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.TranslateNode
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
        const { workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, textUpdateForWoker, emitEventType } = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            if (updateNodeOpt.workState === EvevtWorkState.Done && updateNodeOpt?.translate && (updateNodeOpt.translate[0] || updateNodeOpt.translate[1]) || updateNodeOpt.workState !== EvevtWorkState.Done) {
                await this.localWork?.updateSelector({ updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData,
                    isSync: true, textUpdateForWoker, emitEventType, scene: this.scene, callback: this.updateSelectorCallback });
            }
            else if (updateNodeOpt.workState === EvevtWorkState.Done) {
                this.localWork?.vNodes.deleteLastTarget();
            }
        }
    }
    updateSelectorCallback(props) {
        const { param, postData, newServiceStore, workShapeNode, res } = props;
        const { willSyncService, isSync, updateSelectorOpt, willSerializeData, textUpdateForWoker } = param;
        const workState = updateSelectorOpt.workState;
        const render = postData.render || [];
        const sp = postData.sp || [];
        if (workState === EvevtWorkState.Start) {
            return {
                sp: [],
                render: []
            };
        }
        const selectRect = res?.selectRect;
        if (willSyncService) {
            if (willSerializeData) {
                const points = workShapeNode.getChildrenPoints();
                if (points) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: false,
                        isSync,
                        points
                    });
                }
            }
            for (const [workId, info] of newServiceStore.entries()) {
                if (textUpdateForWoker && info.toolsType === EToolsKey.Text) {
                    console.log('TranslateNode', info);
                    sp.push({
                        ...info,
                        workId,
                        type: EPostMessageType.TextUpdate,
                        dataType: EDataType.Local,
                        willSyncService: true
                    });
                }
                else {
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
        }
        // console.log('updateSelector---0---0--TranslateNode', render, sp)
        return {
            render,
            sp
        };
    }
}
