import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";

export type ScaleNodeEmtData = {
    workIds: IworkId[],
    workState: EvevtWorkState
    box: {
        x: number,
        y: number,
        w: number,
        h: number
    },
    viewId: string
}
export class ScaleNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.ScaleNode;
    private undoTickerId?:number;
    collect(data: ScaleNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, box, workState, viewId} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: IWorkerMessage[] = [];
        const selectIds: string[] = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        }
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString()
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr) as boolean;
            const key = isLocalId && this.serviceColloctor.transformKey(curKey) || curKeyStr;
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            const curStore = store[viewId][scenePath][key];
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
                        viewId
                    };
                    if (workState === EvevtWorkState.Done) {
                        taskData.willSerializeData = true;
                        taskData.undoTickerId = this.undoTickerId;
                    }
                    localMsgs.push(taskData)
                    continue;
                }
            }
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}