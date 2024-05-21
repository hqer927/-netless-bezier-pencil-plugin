/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType, MemberState } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IUpdateNodeOpt, IWorkerMessage, IqueryTask, IworkId } from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
import { colorRGBA2Array, isTransparent } from "../../../collector/utils/color";
import { TextOptions } from "../../../component/textEditor";
import { BaseCollectorReducerAction } from "../../../collector";

export type SetColorNodeEmtData = {
    workIds: IworkId[],
    strokeColor?: string,
    fillColor?: string,
    fontColor?: string,
    fontBgColor?: string,
    workState?: EvevtWorkState;
    viewId: string;
}
export class SetColorNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.SetColorNode;
    private setTextColor(key: string, curStore:BaseCollectorReducerAction, updateNodeOpt: IUpdateNodeOpt, viewId:string){
        const {fontColor, fontBgColor}= updateNodeOpt;
        if (curStore.opt) {
            if (fontColor) {
                curStore.opt.fontColor = fontColor;
            }
            if (fontBgColor) {
                curStore.opt.fontColor = fontBgColor;
            }
            this.control.textEditorManager.updateTextForMasterController({
                workId: key,
                opt: curStore.opt as TextOptions,
                viewId,
                canSync: true,
                canWorker: true
            })
        }
    }
    collect(data: SetColorNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, strokeColor, fillColor, fontColor, fontBgColor, viewId} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs: [IWorkerMessage,IqueryTask][] = [];
        const memberState:Partial<MemberState> = {};
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
                const updateNodeOpt = curStore.updateNodeOpt || {}
                if (fontColor || fontBgColor) {
                    if (fontColor) {
                        updateNodeOpt.fontColor = fontColor;
                        const [r,g,b,a] = colorRGBA2Array(fontColor); 
                        memberState.textColor = [r,g,b];
                        memberState.textOpacity = a;
                    }
                    if (fontBgColor) {
                        updateNodeOpt.fontBgColor = fontBgColor;
                        const [r,g,b,a] = colorRGBA2Array(fontBgColor); 
                        memberState.textBgColor = [r,g,b];
                        memberState.textBgOpacity = a;
                    }
                    if (curStore.toolsType === EToolsKey.Text && curStore.opt) {
                        this.setTextColor(localWorkId, cloneDeep(curStore), updateNodeOpt, viewId)
                        continue;
                    }
                }
                if (strokeColor) {
                    updateNodeOpt.strokeColor = strokeColor;
                    const [r,g,b,a] = colorRGBA2Array(strokeColor); 
                    memberState.strokeColor = [r,g,b];
                    memberState.strokeOpacity = a;
                }
                if (fillColor) {
                    updateNodeOpt.fillColor = isTransparent(fillColor) ? 'transparent' : fillColor;
                    if (isTransparent(fillColor)) {
                        memberState.fillColor = undefined;
                        memberState.fillOpacity = undefined;
                    } else {
                        const [r,g,b,a] = colorRGBA2Array(fillColor); 
                        memberState.fillColor = [r,g,b];
                        memberState.fillOpacity = a;
                    }
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
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (Object.keys(memberState).length) {
            setTimeout(()=>{
                this.control.room?.setMemberState(memberState);
            },0)
        }
    }

}