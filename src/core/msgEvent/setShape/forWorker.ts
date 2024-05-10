import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IMainMessage, IMainMessageRenderData, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";

export class SetShapeOptMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.SetShapeOpt;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType, undoTickerId} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data).finally(()=>{
                if (undoTickerId) {
                    setTimeout(()=>{
                        this.localWork?._post({
                            sp:[{
                                type: EPostMessageType.None,
                                undoTickerId,
                            }]
                        })
                    },0)
                }
            })
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
        // console.log('updateSelector---0---0--SetFont', render, sp)
        return {
            render,
            sp
        }
    }
}