import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IMainMessage, IMainMessageRenderData, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
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
        const render: IMainMessageRenderData[] = postData.render || [];
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
        // console.log('updateSelector---0---0--ZIndexNode', render, sp)
        return {
            render,
            sp
        }
    }
}