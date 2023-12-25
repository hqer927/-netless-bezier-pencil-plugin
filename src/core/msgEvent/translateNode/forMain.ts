import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IUpdateNodeOpt, IWorkerMessage, IworkId } from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { SelectorShape } from "../../tools";

export type TranslateNodeEmtData = {
    workIds: IworkId[],
    position: {x:number,y:number},
    workState: EvevtWorkState
}
export class TranslateNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.TranslateNode;
    collect(data: TranslateNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, position, workState} = data;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: IWorkerMessage[] = [];
        const serviceMsgs: BaseCollectorReducerAction[] = [];
        const selectIds: string[] = [];
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString()
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId && this.serviceColloctor.transformKey(curKey) || curKeyStr;
            const curStore = cloneDeep(store[key]);
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            if (curStore && localWorkId === SelectorShape.selectorId) {
                if (curStore.selectIds) {
                    selectIds.push(...curStore.selectIds);
                    // keys.push(...curStore.selectIds); 
                    if (workState !== EvevtWorkState.Start) {
                        const updateNodeOpt = curStore.updateNodeOpt || {}
                        updateNodeOpt.pos = this.mainEngine.transformToScenePoint([position.x,position.y]);
                        updateNodeOpt.workState = workState;
                        const taskData: IWorkerMessage = {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willRefreshSelector: false,
                            willSyncService: true
                        };
                        if (workState === EvevtWorkState.Done) {
                            const subStore: Map<string, {
                                ops?: string;
                                updateNodeOpt?: IUpdateNodeOpt;
                            }> = new Map();
                            selectIds.forEach((name)=>{
                                const isLocalId = this.serviceColloctor?.isLocalId(name);
                                let key = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                                const curStore = store[key];
                                if (!isLocalId && this.serviceColloctor?.isOwn(key)) {
                                    key = this.serviceColloctor.getLocalId(key);
                                }
                                curStore?.ops && subStore.set(key, {
                                    ops: curStore.ops,
                                    updateNodeOpt: curStore.updateNodeOpt,
                                })
                            })
                            taskData.selectStore = subStore;
                            taskData.willSerializeData = true;
                        }
                        localMsgs.push(taskData)
                    }
                }
                continue;
            }
            if (curStore) {
                const opt = curStore.opt;
                const updateNodeOpt = curStore.updateNodeOpt || {};
                // let pos = updateNodeOpt.pos || 0;
                if (opt) {
                    updateNodeOpt.pos = this.mainEngine.transformToScenePoint([position.x,position.y]);
                    serviceMsgs.push({
                        ...curStore,
                        type: EPostMessageType.UpdateNode,
                        updateNodeOpt
                    });
                    if (!selectIds.includes(curKeyStr)) {
                        let localWorkId:string | undefined = curKeyStr;
                        if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                            localWorkId = this.serviceColloctor.getLocalId(localWorkId);
                        }
                        localMsgs.push({
                            workId: localWorkId,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willSyncService: false,
                            willRefresh: true
                        })
                    }
                }
            }
        }
        if (localMsgs.length) {
            // console.log('localMsgs', localMsgs[0].updateNodeOpt)
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            //console.log('serviceMsgs', serviceMsgs)
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}