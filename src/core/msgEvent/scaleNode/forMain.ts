import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { UndoRedoMethod } from "../../../undo";
import { Storage_Selector_key } from "../../../collector";

export type ScaleNodeEmtData = {
    workIds: IworkId[],
    workState: EvevtWorkState
    box: {
        x: number,
        y: number,
        w: number,
        h: number
    }
}
export class ScaleNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.ScaleNode;
    private undoTickerId?:number;
    collect(data: ScaleNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, box, workState} = data;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: IWorkerMessage[] = [];
        const selectIds: string[] = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        }
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
            if (curStore && localWorkId === Storage_Selector_key) {
                if (curStore.selectIds) {
                    selectIds.push(...curStore.selectIds);
                    const updateNodeOpt = curStore.updateNodeOpt || {}
                    updateNodeOpt.box = box
                    updateNodeOpt.workState = workState;
                    const taskData: IWorkerMessage = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: true,
                        willSyncService: true,
                        textUpdateForWoker: true,
                    };
                    if (workState === EvevtWorkState.Done) {
                        taskData.willSerializeData = true;
                        taskData.undoTickerId = this.undoTickerId;
                    }
                    localMsgs.push(taskData)
                    continue;
                }
            }
            // if (curStore) {
            //     const opt = curStore.opt;
            //     const updateNodeOpt = curStore.updateNodeOpt || {};
            //     // let pos = updateNodeOpt.pos || 0;
            //     if (opt) {
            //         updateNodeOpt.size = size;
            //         serviceMsgs.push({
            //             ...curStore,
            //             type: EPostMessageType.UpdateNode,
            //             updateNodeOpt
            //         });
            //         if (!selectIds.includes(curKeyStr)) {
            //             let localWorkId:string | undefined = curKeyStr;
            //             if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
            //                 localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            //             }
            //             localMsgs.push({
            //                 workId: localWorkId,
            //                 msgType: EPostMessageType.UpdateNode,
            //                 dataType: EDataType.Local,
            //                 updateNodeOpt,
            //                 emitEventType: this.emitEventType,
            //                 willSyncService: false,
            //                 willRefresh: true
            //             })
            //         }
            //     }
            // }
        }
        if (localMsgs.length) {
            // console.log('ScaleNode1', localMsgs[0].updateNodeOpt?.workState)
            this.collectForLocalWorker(localMsgs);
        }
    }
}