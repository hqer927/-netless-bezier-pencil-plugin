import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IUpdateNodeOpt, IWorkerMessage, IworkId } from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { BaseShapeOptions, SelectorShape } from "../../tools";

export type ZIndexNodeEmtData = {
    workIds: IworkId[],
    num: number
}
export class ZIndexNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexNode;
    collect(data: ZIndexNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, num} = data;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
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
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = cloneDeep(store[key]);
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            if (curStore && localWorkId === SelectorShape.selectorId) {
                if (curStore.selectIds) {
                    selectIds.push(...curStore.selectIds);
                    // keys.push(...selector.selectIds);
                    const updateNodeOpt = curStore.updateNodeOpt||{}
                    updateNodeOpt.zIndexDistance = num;
                    const taskData: IWorkerMessage = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: true,
                        willSyncService: true
                    };
                    const subStore: Map<string, {
                        opt: BaseShapeOptions;
                        updateNodeOpt?: IUpdateNodeOpt;
                    }> = new Map();
                    selectIds.forEach((name)=>{
                        const isLocalId = this.serviceColloctor?.isLocalId(name);
                        let key = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                        const curStore = store[key];
                        if (!isLocalId && this.serviceColloctor?.isOwn(key)) {
                            key = this.serviceColloctor.getLocalId(key);
                        }
                        curStore?.opt && subStore.set(key, {
                            updateNodeOpt: curStore.updateNodeOpt,
                            opt: curStore.opt,
                        })
                    })
                    taskData.selectStore = subStore;
                    taskData.willSerializeData = true;
                    localMsgs.push(taskData)
                }
                continue;
            }
            if (curStore) {
                const opt = curStore.opt;
                const updateNodeOpt = curStore.updateNodeOpt || {};
                let zIndex = updateNodeOpt.zIndex || opt?.zIndex || 0;
                if (opt) {
                    zIndex = zIndex + num;
                    updateNodeOpt.zIndex = zIndex;
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
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}