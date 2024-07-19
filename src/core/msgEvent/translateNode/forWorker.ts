import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IMainMessage, IMainMessageRenderData, IRectType, IUpdateSelectorCallbackPropsType, IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
import { SelectorShape } from "../../tools";

export class TranslateNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.TranslateNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const {workId, updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, textUpdateForWoker, emitEventType} = data;
        if (workId === SelectorShape.selectorId && updateNodeOpt) {
            if (updateNodeOpt.workState === EvevtWorkState.Done && updateNodeOpt?.translate && (updateNodeOpt.translate[0] || updateNodeOpt.translate[1]) || updateNodeOpt.workState !== EvevtWorkState.Done) {
                await this.localWork?.updateSelector({updateSelectorOpt: updateNodeOpt, willRefreshSelector, willSyncService, willSerializeData, 
                    isSync:true, textUpdateForWoker, emitEventType, scene: this.scene, callback:this.updateSelectorCallback})    
            } else if (updateNodeOpt.workState === EvevtWorkState.Done) {
                this.localWork?.vNodes.deleteLastTarget();
            }
        }
    }
    private updateSelectorCallback(props:IUpdateSelectorCallbackPropsType){
        const {param, postData, newServiceStore, workShapeNode, res} = props;
        const {willSyncService, isSync, updateSelectorOpt, textUpdateForWoker} = param;
        const workState = updateSelectorOpt.workState;
        const render: IMainMessageRenderData[] = postData.render || [];
        const sp: IMainMessage[] = postData.sp || [];
        if (workState === EvevtWorkState.Start) {
            return {
                sp:[],
                render:[]
            }
        }
        const selectRect:IRectType|undefined = res?.selectRect;
        if (willSyncService) {
            // if (workState === EvevtWorkState.Doing) {

            // }
            sp.push({
                type: EPostMessageType.Select,
                selectIds: workShapeNode.selectIds,
                selectRect,
                willSyncService: true,
                isSync: true,
                points: workState === EvevtWorkState.Done && workShapeNode.getChildrenPoints() || undefined,
                textOpt: workShapeNode.textOpt
            })
            for (const [workId, info] of newServiceStore.entries()) {
                if (textUpdateForWoker && info.toolsType === EToolsKey.Text) {
                    sp.push({
                        ...info,
                        workId,
                        type: EPostMessageType.TextUpdate,
                        dataType: EDataType.Local,
                        willSyncService:true
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
                            isSync
                        }
                    )
                } 
            }
        }
        return {
            render,
            sp
        }
    }
}