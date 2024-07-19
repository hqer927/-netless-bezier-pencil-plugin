import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForMainThread } from "../baseForMainThread";
import { IMainMessage, IRectType, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType, EToolsKey } from "../../enum";
import { SelectorShape } from "../../tools";

export class SetFontStyleMethodForMainThread extends BaseMsgMethodForMainThread {
    readonly emitEventType: EmitEventType = EmitEventType.SetFontStyle;
    async consume(data: IWorkerMessage): Promise<boolean | undefined> {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            await this.consumeForLocalWorker(data)
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, textUpdateForWoker} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, 
                willSyncService, willSerializeData, textUpdateForWoker, callback:this.updateSelectorCallback})
        } 
    }
    private updateSelectorCallback(props:IUpdateSelectorCallbackPropsType){
        const {param, postData, newServiceStore, workShapeNode, res} = props;
        const {willSyncService, isSync, updateSelectorOpt, textUpdateForWoker} = param;
        const sp: IMainMessage[] = postData.sp || [];
        const selectRect:IRectType|undefined = res?.selectRect;
        if (willSyncService && sp) {
            if (updateSelectorOpt.fontSize) {
                sp.push({
                    type: EPostMessageType.Select,
                    selectIds: workShapeNode.selectIds,
                    selectRect,
                    willSyncService,
                    isSync,
                    points: workShapeNode.getChildrenPoints()
                })
            }
            for (const [workId, info] of newServiceStore.entries()) {
                if (textUpdateForWoker && info.toolsType === EToolsKey.Text) {
                    sp.push({
                        ...info,
                        workId,
                        type: EPostMessageType.TextUpdate,
                        dataType: EDataType.Local,
                        willSyncService:true
                    })
                } else  {
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
        }
        return {
            sp
        }
    }
}