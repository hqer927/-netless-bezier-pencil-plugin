/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IUpdateNodeOpt, IWorkerMessage, IworkId } from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
import { UndoRedoMethod } from "../../../undo";
import { colorRGBA2Array } from "../../../collector/utils/color";
import { TextOptions } from "../../../component/textEditor";
import { BaseCollectorReducerAction } from "../../../collector";

export type SetColorNodeEmtData = {
    workIds: IworkId[],
    strokeColor?: string,
    fillColor?: string,
    fontColor?: string,
    fontBgColor?: string,
    workState?: EvevtWorkState
}
export class SetColorNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.SetColorNode;
    private setTextColor(key: string, curStore:BaseCollectorReducerAction, updateNodeOpt: IUpdateNodeOpt){
        const {fontColor, fontBgColor}= updateNodeOpt;
        if (curStore.opt) {
            if (fontColor) {
                curStore.opt.fontColor = fontColor;
            }
            if (fontBgColor) {
                curStore.opt.fontColor = fontBgColor;
            }
            this.mainEngine?.textEditorManager.updateTextForMain({
                workId: key,
                opt: curStore.opt as TextOptions
            })
        }
    }
    collect(data: SetColorNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, strokeColor, fillColor, fontColor, fontBgColor} = data;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs: IWorkerMessage[] = [];
        const undoTickerId = Date.now();
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
            if (curStore) {
                const updateNodeOpt = curStore.updateNodeOpt || {}
                if (fontColor || fontBgColor) {
                    if (fontColor) {
                        updateNodeOpt.fontColor = fontColor;
                        const [r,g,b,a] = colorRGBA2Array(fontColor); 
                        this.mainEngine.room?.setMemberState({textColor:[r,g,b], textOpacity:a} as any)
                    }
                    if (fontBgColor) {
                        updateNodeOpt.fontBgColor = fontBgColor;
                        const [r,g,b,a] = colorRGBA2Array(fontBgColor); 
                        this.mainEngine.room?.setMemberState({textBgColor:[r,g,b], textOpacity:a} as any)
                    }
                    if (curStore.toolsType === EToolsKey.Text && curStore.opt) {
                        this.setTextColor(localWorkId, curStore, updateNodeOpt)
                        continue;
                    }
                }
                if (strokeColor) {
                    updateNodeOpt.strokeColor = strokeColor;
                }
                if (fillColor) {
                    updateNodeOpt.fillColor = fillColor;
                }
                const taskData: IWorkerMessage = {
                    workId: localWorkId,
                    msgType: EPostMessageType.UpdateNode,
                    dataType: EDataType.Local,
                    updateNodeOpt,
                    emitEventType: this.emitEventType,
                    willRefresh: true,
                    willRefreshSelector: true,
                    willSyncService: true,
                    textUpdateForWoker: true,
                    undoTickerId
                };
                localMsgs.push(taskData);
            }
        }
        UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }

}