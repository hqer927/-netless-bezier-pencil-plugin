import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForMainThread } from "../baseForMainThread";
import { IMainMessage, IRectType, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";

export class SetLockMethodForMainThread extends BaseMsgMethodForMainThread {
    readonly emitEventType: EmitEventType = EmitEventType.SetLock;
    async consume(data: IWorkerMessage): Promise<boolean | undefined> {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data)
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, 
                willSyncService, willSerializeData, callback:this.updateSelectorCallback})
        }
    }
    private updateSelectorCallback(props:IUpdateSelectorCallbackPropsType){
        const {param, postData, newServiceStore, workShapeNode, res} = props;
        const {willSyncService, isSync, updateSelectorOpt} = param;
        const sp: IMainMessage[] = postData.sp || [];
        const selectRect:IRectType|undefined = res?.selectRect;
        if (willSyncService && sp) {
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
            sp.push({
                isLocked: updateSelectorOpt.isLocked,
                selectorColor: workShapeNode.selectorColor,
                scaleType: workShapeNode.scaleType,
                canRotate: workShapeNode.canRotate,
                type: EPostMessageType.Select,
                selectIds: workShapeNode.selectIds,
                selectRect,
                willSyncService,
                isSync,
            })
        }
        return {
            sp
        }
    }
}