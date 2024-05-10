import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";
// import { transformToSerializableData } from "../../../collector/utils";
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
        const { workId, updateNodeOpt, willSyncService, willSerializeData } = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({ updateSelectorOpt: updateNodeOpt,
                willSyncService, willSerializeData, isSync: true, scene: this.scene, callback: this.updateSelectorCallback.bind(this) });
        }
    }
    updateSelectorCallback(props) {
        const { param, postData, workShapeNode, res, newServiceStore } = props;
        const { updateSelectorOpt, willSyncService, willSerializeData } = param;
        const workState = updateSelectorOpt.workState;
        const render = postData.render || [];
        const sp = postData.sp || [];
        const selectRect = res?.selectRect;
        const renderRect = res?.renderRect;
        if (workState === EvevtWorkState.Start) {
            return {
                sp: [],
                render: []
            };
        }
        if (this.localWork) {
            render.push({
                isClearAll: true,
                isFullWork: false,
                clearCanvas: ECanvasShowType.Selector,
                viewId: this.localWork.viewId,
            });
            const reRenderSelectorDate = {
                rect: renderRect,
                isFullWork: false,
                drawCanvas: ECanvasShowType.Selector,
                viewId: this.localWork.viewId,
            };
            render.push(reRenderSelectorDate);
        }
        if (willSyncService) {
            if (workState === EvevtWorkState.Doing) {
                sp.push({
                    type: EPostMessageType.Select,
                    selectIds: workShapeNode.selectIds,
                    selectRect,
                    willSyncService: true,
                    isSync: true,
                    points: workShapeNode.getChildrenPoints(),
                    textOpt: workShapeNode.textOpt
                });
            }
            if (willSerializeData) {
                if (workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: false,
                        isSync: true,
                        points: workShapeNode.getChildrenPoints(),
                        textOpt: workShapeNode.textOpt
                    });
                }
            }
            for (const [workId, info] of newServiceStore.entries()) {
                if (info.toolsType === EToolsKey.Text) {
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
                        isSync: true
                    });
                }
            }
        }
        // console.log('updateSelector---0---0--ScaleNode', render, sp)
        return {
            render,
            sp
        };
    }
}
