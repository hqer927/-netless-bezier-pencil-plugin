import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IqueryTask, IworkId } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";

export type SetPointEmtData = {
    workId: IworkId,
    workState: EvevtWorkState
    pointMap: Map<string,[number,number][]>;
    viewId: string
}
export class SetPointMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType = EmitEventType.SetPoint;
    private undoTickerId?:number;
    collect(data: SetPointEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workId, pointMap, workState, viewId} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const store = this.serviceColloctor?.storage;
        const localMsgs: [IWorkerMessage,IqueryTask][] = [];
        // const selectIds: string[] = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.mainEngine.internalMsgEmitter.emit('addUndoTicker', undoTickerId, viewId);
        }
        const curKey = workId;
        if (!curKey) {
            return;
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
                // selectIds.push(...curStore.selectIds);
                const updateNodeOpt = curStore.updateNodeOpt || {}
                updateNodeOpt.pointMap = pointMap;
                updateNodeOpt.workState = workState;
                const taskData: IWorkerMessage = {
                    workId: curKey,
                    msgType: EPostMessageType.UpdateNode,
                    dataType: EDataType.Local,
                    updateNodeOpt,
                    emitEventType: this.emitEventType,
                    willRefreshSelector: true,
                    willSyncService: true,
                    viewId
                };
                if (workState === EvevtWorkState.Done) {
                    taskData.undoTickerId = this.undoTickerId;
                }
                localMsgs.push([taskData,{
                    workId: curKey,
                    msgType: EPostMessageType.UpdateNode,
                    emitEventType: this.emitEventType
                }])
            }
        }
        if (workState === EvevtWorkState.Start){
            this.mainEngine.unWritable();
        } else if (workState === EvevtWorkState.Done) {
            this.mainEngine.abled();
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}