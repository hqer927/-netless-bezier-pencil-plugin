/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType } from "../../../plugin/types";
import type { SpeechBalloonPlacement } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IqueryTask, IworkId } from "../../types";
import { EDataType, EPostMessageType, EToolsKey } from "../../enum";
import { Storage_Selector_key } from "../../../collector";

export type SetShapeEmtData = {
    workIds: IworkId[];
    viewId: string;
    toolsType: EToolsKey;
    vertices?: number;
    innerVerticeStep?: number;
    innerRatio?: number;
    placement?: SpeechBalloonPlacement;
}
export class SetShapeOptMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.SetShapeOpt;
    collect(data: SetShapeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, viewId, ...newUpdateNodeOpt} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs: [IWorkerMessage,IqueryTask][] = [];
        // const undoTickerId = Date.now();
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString()
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr) as boolean;
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            const curStore = store[viewId][scenePath][key] || undefined;
            if (curStore) {
                const updateNodeOpt = {
                    ...curStore.updateNodeOpt,
                    ...newUpdateNodeOpt,
                    willRefresh:true
                };
                if (curStore && localWorkId === Storage_Selector_key) {
                    const taskData: IWorkerMessage = {
                        workId: localWorkId,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefresh: true,
                        willRefreshSelector: true,
                        willSyncService: true,
                        viewId,
                        // undoTickerId
                    };
                    localMsgs.push([taskData,{
                        workId: localWorkId,
                        msgType: EPostMessageType.UpdateNode,
                        emitEventType: this.emitEventType
                    }]);
                }
            }
        }
        if (localMsgs.length) {
            // this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
            this.collectForLocalWorker(localMsgs);
        }
    }

}