import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IqueryTask, IworkId } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";

export type RotateNodeEmtData = {
    workIds: IworkId[],
    angle: number,
    workState: EvevtWorkState,
    viewId: string
}
export class RotateNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: RotateNodeEmtData;
    readonly emitEventType: EmitEventType = EmitEventType.RotateNode;
    private cacheOriginRotate:number = 0;
    collect(data: RotateNodeEmtData, isSync?:boolean): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, angle, workState, viewId} = data;
        this.lastEmtData = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: [IWorkerMessage,IqueryTask][] = [];
        // const serviceMsgs: BaseCollectorReducerAction[] = [];
        const selectIds: string[] = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.mainEngine.internalMsgEmitter.emit('addUndoTicker', undoTickerId, viewId);
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
                if (curStore.selectIds?.length === 1) {
                    const id = curStore.selectIds[0];
                    selectIds.push(id);
                    if (workState === EvevtWorkState.Start) {
                        const isLocalId = this.serviceColloctor?.isLocalId(id);
                        const key = isLocalId && this.serviceColloctor?.transformKey(id) || id;
                        const curSubStore = store[viewId][scenePath][key];
                        this.cacheOriginRotate = curSubStore?.opt?.rotate || 0
                    }
                    const updateNodeOpt = curStore.updateNodeOpt || {}
                    updateNodeOpt.angle = (angle + this.cacheOriginRotate) % 360;
                    updateNodeOpt.workState = workState;
                    const taskData: IWorkerMessage = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: false,
                        willSyncService: true,
                        viewId
                    };
                    if (workState === EvevtWorkState.Done) {
                        taskData.willRefreshSelector = true;
                        taskData.willSerializeData = true;
                        this.cacheOriginRotate = 0;
                    }
                    localMsgs.push([taskData,{
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        emitEventType: this.emitEventType
                    }])
                }
                continue;
            }
        }
        if (workState === EvevtWorkState.Start){
            this.mainEngine.unWritable();
        } else if (workState === EvevtWorkState.Done) {
            this.mainEngine.abled();
            this.lastEmtData = undefined;
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs, isSync);
        }
    }
}