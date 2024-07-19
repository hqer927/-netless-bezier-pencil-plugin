import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IMainMessage, IMainMessageRenderData, IRectType, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";

export class RotateNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.RotateNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, emitEventType} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, 
                willSyncService, willSerializeData, emitEventType, isSync:true, scene: this.scene, callback:this.updateSelectorCallback}) 
        }
    }
    private updateSelectorCallback(props:IUpdateSelectorCallbackPropsType){
        const {param, postData, workShapeNode, res, newServiceStore} = props;
        const {updateSelectorOpt, willSyncService, willSerializeData, isSync} = param;
        const workState = updateSelectorOpt.workState;
        const render: IMainMessageRenderData[] =   postData.render || [];
        const sp: IMainMessage[] =  postData.sp || [];
        const selectRect:IRectType|undefined = res?.selectRect;
        if (willSyncService) {
            if (willSerializeData) {
                if (workState === EvevtWorkState.Done) {
                    sp.push({
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect,
                        willSyncService: true,
                        isSync,
                        points: workShapeNode.getChildrenPoints(),
                        textOpt: workShapeNode.textOpt,
                        selectorColor: workShapeNode.selectorColor,
                        strokeColor: workShapeNode.strokeColor,
                        fillColor: workShapeNode.fillColor,
                        canTextEdit: workShapeNode.canTextEdit,
                        canRotate: workShapeNode.canRotate,
                        scaleType: workShapeNode.scaleType,
                        opt: workShapeNode.getWorkOptions() || undefined,
                        canLock: workShapeNode.canLock,
                        isLocked: workShapeNode.isLocked,
                        toolsTypes: workShapeNode.toolsTypes,
                        shapeOpt: workShapeNode.shapeOpt
                    })
                }
            }
            for (const [workId, info] of newServiceStore.entries()) {
                sp.push(
                    {
                        ...info,
                        workId,
                        type: EPostMessageType.UpdateNode,
                        updateNodeOpt: {
                            useAnimation: false
                        },
                        isSync
                    }
                )
            }
        }
        return {
            render,
            sp
        }
    }
}