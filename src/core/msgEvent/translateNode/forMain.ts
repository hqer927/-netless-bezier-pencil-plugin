import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IqueryTask, IworkId } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";

export type TranslateNodeEmtData = {
    workIds: IworkId[],
    position: {x:number,y:number},
    workState: EvevtWorkState,
    viewId: string
}
export class TranslateNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: TranslateNodeEmtData;
    readonly emitEventType: EmitEventType = EmitEventType.TranslateNode;
    private undoTickerId?:number;
    private cachePosition: [number,number]| undefined;
    collect(data: TranslateNodeEmtData, isSync?:boolean): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, position, workState, viewId} = data;
        this.lastEmtData = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: [IWorkerMessage,IqueryTask][] = [];
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.mainEngine.internalMsgEmitter.emit('addUndoTicker', undoTickerId, viewId);
        }
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) continue;
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
                    const point = this.control.viewContainerManager.transformToScenePoint([position.x, position.y], viewId)
                    if (workState === EvevtWorkState.Start) {
                        this.cachePosition = point;
                    }
                    if (this.cachePosition) {
                        const updateNodeOpt = curStore.updateNodeOpt || {}
                        updateNodeOpt.translate = [point[0] - this.cachePosition[0], point[1] - this.cachePosition[1]];
                        updateNodeOpt.workState = workState;
                        const taskData: IWorkerMessage = {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willSyncService: true,
                            textUpdateForWoker: true,
                            viewId
                        };
                        if (workState === EvevtWorkState.Done) {
                            taskData.textUpdateForWoker = true;
                            taskData.willSerializeData = true;
                            taskData.undoTickerId = this.undoTickerId;
                            this.cachePosition = undefined;
                        }
                        localMsgs.push([taskData,{
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode, 
                            emitEventType: this.emitEventType
                        }])
                    }
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