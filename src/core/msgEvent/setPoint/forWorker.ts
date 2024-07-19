import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IMainMessage, IMainMessageRenderData, IRectType, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";

export class SetPointMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.SetPoint;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, textUpdateForWoker} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, 
                emitEventType: this.emitEventType, willSerializeData, 
                isSync:true, textUpdateForWoker, callback:this.updateSelectorCallback})
        }
    }
    private updateSelectorCallback(props:IUpdateSelectorCallbackPropsType){
        const {param, postData, newServiceStore, workShapeNode, res} = props;
        const {willSyncService, isSync} = param;
        const render: IMainMessageRenderData[] = postData.render || [];
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
                type: EPostMessageType.Select,
                selectIds: workShapeNode.selectIds,
                selectRect,
                willSyncService,
                isSync,
                points: workShapeNode.getChildrenPoints()
            })
        }
        return {
            render,
            sp
        }
    }
}