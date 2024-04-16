/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, EToolsKey } from "../../enum";
import { ETextEditorType } from "../../../component/textEditor";
import { getTextEditorType } from "../../../component/textEditor/utils";
import isBoolean from "lodash/isBoolean";
export class SetFontStyleMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.SetFontStyle
        });
    }
    setTextStyle(key, curStore, updateNodeOpt, viewId) {
        const { bold, underline, lineThrough, italic, fontSize } = updateNodeOpt;
        if (curStore.toolsType) {
            const type = getTextEditorType(curStore.toolsType);
            if (type === ETextEditorType.Text) {
                if (curStore.opt) {
                    if (bold) {
                        curStore.opt.bold = bold;
                    }
                    if (isBoolean(underline)) {
                        curStore.opt.underline = underline;
                    }
                    if (isBoolean(lineThrough)) {
                        curStore.opt.lineThrough = lineThrough;
                    }
                    if (italic) {
                        curStore.opt.italic = italic;
                    }
                    if (fontSize) {
                        curStore.opt.fontSize = fontSize;
                    }
                }
                this.control.textEditorManager.updateTextForMasterController({
                    workId: key,
                    opt: curStore.opt,
                    viewId
                });
            }
            if (type === ETextEditorType.Shape) {
                // TODO
            }
        }
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, bold, italic, lineThrough, underline, viewId, fontSize } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs = [];
        const undoTickerId = Date.now();
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            let localWorkId = curKeyStr;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            const curStore = store[viewId][scenePath][key] || undefined;
            if (curStore) {
                const updateNodeOpt = curStore.updateNodeOpt || {};
                if (bold) {
                    updateNodeOpt.bold = bold;
                }
                if (italic) {
                    updateNodeOpt.italic = italic;
                }
                if (isBoolean(lineThrough)) {
                    updateNodeOpt.lineThrough = lineThrough;
                }
                if (isBoolean(underline)) {
                    updateNodeOpt.underline = underline;
                }
                if (fontSize) {
                    updateNodeOpt.fontSize = fontSize;
                }
                if (curStore.toolsType === EToolsKey.Text && curStore.opt) {
                    this.setTextStyle(localWorkId, cloneDeep(curStore), updateNodeOpt, viewId);
                    continue;
                }
                const taskData = {
                    workId: localWorkId,
                    msgType: EPostMessageType.UpdateNode,
                    dataType: EDataType.Local,
                    updateNodeOpt,
                    emitEventType: this.emitEventType,
                    willRefresh: true,
                    willRefreshSelector: true,
                    willSyncService: true,
                    textUpdateForWoker: true,
                    undoTickerId,
                    viewId
                };
                localMsgs.push(taskData);
            }
        }
        this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}
