import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
import cloneDeep from "lodash/cloneDeep";
export class ScaleNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.ScaleNode
        });
        Object.defineProperty(this, "undoTickerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "targetBox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
        Object.defineProperty(this, "targetText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
        Object.defineProperty(this, "cacheTextInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
    }
    async collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, box, workState, viewId, dir } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs = [];
        // const selectIds: string[] = [];
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
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId && this.serviceColloctor.transformKey(curKey) || curKeyStr;
            let localWorkId = curKeyStr;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            const curStore = store[viewId][scenePath][key];
            if (curStore && localWorkId === Storage_Selector_key) {
                if (curStore.selectIds) {
                    const updateNodeOpt = curStore.updateNodeOpt || {};
                    updateNodeOpt.dir = dir;
                    updateNodeOpt.box = box;
                    updateNodeOpt.workState = workState;
                    if (workState === EvevtWorkState.Start && box) {
                        for (const name of curStore.selectIds) {
                            const isLocalId = this.serviceColloctor?.isLocalId(name);
                            const storeKey = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                            let textKey = storeKey;
                            if (!isLocalId && this.serviceColloctor?.isOwn(storeKey)) {
                                textKey = this.serviceColloctor.getLocalId(storeKey);
                            }
                            const textEditor = this.control.textEditorManager.get(textKey);
                            // console.log('showFloatBar--1', textKey, textEditor?.opt.fontColor)
                            if (textEditor && workState === EvevtWorkState.Start) {
                                this.targetText.set(textKey, cloneDeep(textEditor));
                            }
                        }
                        if (this.targetText.size) {
                            this.targetBox.set(localWorkId, box);
                        }
                    }
                    if (this.targetText.size && workState !== EvevtWorkState.Start) {
                        const cache = this.targetBox.get(localWorkId);
                        if (cache) {
                            const scale = [box.w / cache.w, box.h / cache.h];
                            for (const [textKey, editor] of this.targetText.entries()) {
                                const { opt } = editor;
                                const newFontSize = Math.floor(opt.fontSize * scale[0]);
                                const cacheTextInfo = this.cacheTextInfo.get(textKey);
                                const isUpdate = (!cacheTextInfo && opt.fontSize !== newFontSize) || (cacheTextInfo && cacheTextInfo.fontSize !== newFontSize) || false;
                                // const isLocalId = this.serviceColloctor.isLocalId(textKey) as boolean;
                                // const storeName = isLocalId && this.serviceColloctor.transformKey(textKey) || textKey;
                                // let textName: string = storeName;
                                // if (!isLocalId && this.serviceColloctor?.isOwn(storeName)) {
                                //     textName = this.serviceColloctor.getLocalId(storeName);
                                // }
                                const textEditor = this.control.textEditorManager.get(textKey)?.opt;
                                // console.log('showFloatBar--2',textKey, newFontSize, textEditor, isLocalId, this.control.textEditorManager.editors)
                                if (isUpdate && textEditor && opt.boxSize && opt.boxPoint) {
                                    // console.log('showFloatBar--3', textKey, newFontSize)
                                    const newInfo = await this.control.textEditorManager.updateTextControllerWithEffectAsync({
                                        workId: textKey,
                                        opt: { ...textEditor, fontSize: newFontSize },
                                        viewId,
                                        canSync: false,
                                        canWorker: false,
                                    });
                                    newInfo && this.cacheTextInfo.set(textKey, {
                                        fontSize: newInfo.opt.fontSize,
                                        boxSize: newInfo.opt.boxSize,
                                        boxPoint: newInfo.opt.boxPoint
                                    });
                                }
                            }
                            updateNodeOpt.textInfos = this.cacheTextInfo;
                        }
                    }
                    const taskData = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: true,
                        willSyncService: true,
                        viewId,
                    };
                    if (workState === EvevtWorkState.Done) {
                        taskData.willSerializeData = true;
                        taskData.undoTickerId = this.undoTickerId;
                        this.targetBox.delete(localWorkId);
                        this.targetText.clear();
                    }
                    localMsgs.push([taskData, {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            emitEventType: this.emitEventType
                        }]);
                    continue;
                }
            }
        }
        if (workState === EvevtWorkState.Start) {
            this.mainEngine.unWritable();
        }
        else if (workState === EvevtWorkState.Done) {
            this.mainEngine.abled();
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
    }
}
