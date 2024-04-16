import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";

export type TranslateNodeEmtData = {
    workIds: IworkId[],
    position: {x:number,y:number},
    workState: EvevtWorkState,
    viewId: string
}
export class TranslateNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.TranslateNode;
    private undoTickerId?:number;
    private oldRect: {
        height: number;
        width: number;
        x: number;
        y: number;
    } | undefined;
    private cachePosition: {x:number,y:number} | undefined;
    collect(data: TranslateNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, position, workState, viewId} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: IWorkerMessage[] = [];
        const bgRect = view.displayer.canvasBgRef.current?.getBoundingClientRect();
        const floatBarRect = view.displayer?.floatBarCanvasRef.current?.getBoundingClientRect();
        let willRefreshSelector = false;
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        }
        if (bgRect && floatBarRect && this.oldRect) {
            if (this.oldRect.x < bgRect.x && floatBarRect.x > this.oldRect.x) {
                willRefreshSelector = true;
            } else 
            if (this.oldRect.y < bgRect.y && floatBarRect.y > this.oldRect.y) {
                willRefreshSelector = true;
            } else 
            if (this.oldRect.x + this.oldRect.width > bgRect.x + bgRect.width && floatBarRect.x < this.oldRect.x) {
                willRefreshSelector = true;
            } else 
            if (this.oldRect.y + this.oldRect.height > bgRect.y + bgRect.height && floatBarRect.y < this.oldRect.y) {
                willRefreshSelector = true;
            }
        }
        if(floatBarRect){
            this.oldRect = floatBarRect;
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
                    if (workState === EvevtWorkState.Start) {
                        this.cachePosition = position;
                    }
                    if (this.cachePosition) {
                        const updateNodeOpt = curStore.updateNodeOpt || {}
                        updateNodeOpt.translate = [position.x - this.cachePosition.x, position.y - this.cachePosition.y];
                        updateNodeOpt.workState = workState;
                        const taskData: IWorkerMessage = {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willRefreshSelector,
                            willSyncService: true,
                            textUpdateForWoker: false,
                            viewId,
                        };
                        if (workState === EvevtWorkState.Done) {
                            taskData.willRefreshSelector = true;
                            taskData.textUpdateForWoker = true;
                            taskData.willSerializeData = true;
                            taskData.undoTickerId = this.undoTickerId;
                            this.cachePosition = undefined;
                        }
                        localMsgs.push(taskData)
                    }
                }
                continue;
            }
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}