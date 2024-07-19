import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForMainThread } from "../baseForMainThread";
import { IMainMessage, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";

export class ZIndexNodeMethodForMainThread extends BaseMsgMethodForMainThread {
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexNode;
    async consume(data: IWorkerMessage): Promise<boolean | undefined> {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
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
        const {param, postData, newServiceStore} = props;
        const {willSyncService, isSync} = param;
        const sp: IMainMessage[] = postData.sp || [];
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
        }
        return {
            sp
        }
    }
}