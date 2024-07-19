import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForMainThread } from "../baseForMainThread";
import { IMainMessage, IRectType, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";

export class ScaleNodeMethodForMainThread extends BaseMsgMethodForMainThread {
    readonly emitEventType: EmitEventType = EmitEventType.ScaleNode;
    async consume(data: IWorkerMessage): Promise<boolean | undefined> {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            await this.consumeForLocalWorker(data)
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const {workId, updateNodeOpt, willSyncService, willSerializeData} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            await this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, 
                willSyncService, willSerializeData, isSync:true, scene: this.scene, callback:this.updateSelectorCallback.bind(this)}) 
        }
    }
    private updateSelectorCallback(props:IUpdateSelectorCallbackPropsType){
        const {param, postData, workShapeNode, res, newServiceStore} = props;
        const {updateSelectorOpt, willSyncService, willSerializeData} = param;
        const workState = updateSelectorOpt.workState;
        const sp: IMainMessage[] =  postData.sp || [];
        const selectRect:IRectType|undefined = res?.selectRect;
        if (workState === EvevtWorkState.Start) {
            return {
                sp:[],
                render:[]
            };
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
                })
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
                    })
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
                    })
                } else {
                    sp.push(
                        {
                            ...info,
                            workId,
                            type: EPostMessageType.UpdateNode,
                            updateNodeOpt: {
                                useAnimation: false
                            },
                            isSync:true
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