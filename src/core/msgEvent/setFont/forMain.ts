/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType } from "../../../plugin/types";
import type { MemberState, _MemberState } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IUpdateNodeOpt, IworkId } from "../../types";
import { EToolsKey } from "../../enum";
import { ETextEditorType, FontStyleType, FontWeightType, TextEditorInfo, TextOptions } from "../../../component/textEditor";
import { BaseCollectorReducerAction, Storage_Selector_key } from "../../../collector";
import { getTextEditorType } from "../../../component/textEditor/utils";
import {cloneDeep, isBoolean} from "lodash";

export type SetFontEmtData = {
    workIds: IworkId[];
    bold?: FontWeightType;
    underline?: boolean;
    lineThrough?: boolean;
    italic?: FontStyleType;
    fontSize?: number;
    viewId: string;
}
export class SetFontStyleMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType = EmitEventType.SetFontStyle;
    private timerId?:number;
    private async setTextStyle(key: string, curStore:BaseCollectorReducerAction, 
        updateNodeOpt: IUpdateNodeOpt, viewId:string){
        const {bold, underline, lineThrough, italic, fontSize}= updateNodeOpt;
        if (curStore.toolsType) {
            const type = getTextEditorType(curStore.toolsType); 
            if (type === ETextEditorType.Text) {
                if (curStore.opt) {
                    if (bold) {
                        (curStore.opt as TextOptions).bold = bold;
                    }
                    if (isBoolean(underline)) {
                        (curStore.opt as TextOptions).underline = underline;
                    }
                    if (isBoolean(lineThrough)) {
                        (curStore.opt as TextOptions).lineThrough = lineThrough;
                    }
                    if (italic) {
                        (curStore.opt as TextOptions).italic = italic;
                    }
                    if (fontSize) {
                        (curStore.opt as TextOptions).fontSize = fontSize;
                    }
                }
                const textInfo = await this.control.textEditorManager.updateTextControllerWithEffectAsync({
                    workId: key,
                    opt: curStore.opt as TextOptions,
                    viewId,
                    canSync: false,
                    canWorker: false,
                    // waitWorker: true,
                })
                return {key, textInfo}
            }
            if (type === ETextEditorType.Shape) {
                // TODO
            }
        }
    }
    async collect(data: SetFontEmtData) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, bold, italic, lineThrough, underline, viewId, fontSize} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const memberState:Partial<MemberState> = {};
        const undoTickerId  = Date.now();
        this.mainEngine.internalMsgEmitter.emit('addUndoTicker', undoTickerId, viewId);
        const promises:Promise< {key:string,textInfo: TextEditorInfo} | undefined>[] = []
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
                if (bold) {
                    updateNodeOpt.bold = bold;
                    memberState.bold = bold === 'bold';
                }
                if (italic) {
                    updateNodeOpt.italic = italic;
                    memberState.italic = italic === 'italic';
                }
                if (isBoolean(lineThrough)) {
                    updateNodeOpt.lineThrough = lineThrough;
                    memberState.lineThrough = lineThrough;
                }
                if (isBoolean(underline)) {
                    updateNodeOpt.underline = underline;
                    memberState.underline = underline;
                }
                if (fontSize) {
                    updateNodeOpt.fontSize = fontSize;
                    memberState.textSize = fontSize;
                }
                if (curStore.toolsType === EToolsKey.Text && curStore.opt) {
                    const p = this.setTextStyle(localWorkId, cloneDeep(curStore), updateNodeOpt, viewId)
                    promises.push(p);
                    continue;
                }
                if (curStore && localWorkId === Storage_Selector_key && curStore.selectIds?.length) {
                    for (const name of curStore.selectIds) {
                        const isLocalId = this.serviceColloctor?.isLocalId(name);
                        let key = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                        const subStore = store[viewId][scenePath][key] || undefined;
                        if (!isLocalId && this.serviceColloctor?.isOwn(key)) {
                            key = this.serviceColloctor.getLocalId(key);
                        }
                        if (subStore && subStore.toolsType === EToolsKey.Text && curStore.opt) {
                            const p = this.setTextStyle(key, cloneDeep(subStore), updateNodeOpt, viewId);
                            promises.push(p);
                            continue;
                        }
                    }
                }
            }
        }
        const textInfos = await Promise.all(promises);
        for (const info of textInfos) {
            if (info) {
                const {key , textInfo} = info;
                if (textInfo) {
                    textInfo.canSync = true;
                    textInfo.canWorker = true;
                    this.control.textEditorManager.updateForViewEdited(key, textInfo);
                }
            }
        }
        if (Object.keys(memberState).length) {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = undefined;
            }
            this.timerId = setTimeout(()=>{
                this.timerId = undefined;
                this.control.room?.setMemberState(memberState as _MemberState);
            }, 0) as unknown as number;
        }
    
    }
}