import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IRectType, IWorkerMessage, IqueryTask, IworkId } from "../../types";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
import cloneDeep from "lodash/cloneDeep";
import { TextEditorInfo, TextOptions } from "../../../component/textEditor";
import type { Direction } from "re-resizable/lib/resizer";

export type ScaleNodeEmtData = {
    workIds: IworkId[];
    workState: EvevtWorkState;
    box: IRectType;
    viewId: string;
    dir?: Direction;
    reverseY?:boolean;
    reverseX?:boolean;
}
export class ScaleNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: ScaleNodeEmtData;
    readonly emitEventType: EmitEventType = EmitEventType.ScaleNode;
    private targetBox:Map<string,IRectType> = new Map;
    private targetText:Map<string,TextEditorInfo> = new Map;
    private cacheTextInfo:Map<string,Partial<TextOptions>> = new Map;
    private async setTextStyle(key: string, opt:TextOptions, viewId:string){
        const textInfo = await this.control.textEditorManager.updateTextControllerWithEffectAsync({
            workId: key,
            opt,
            viewId,
            canSync: false,
            canWorker: false,
        })
        return {key, textInfo}
    }
    async collect(data: ScaleNodeEmtData, isSync?:boolean): Promise<void> {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, box, workState, viewId, dir, reverseY, reverseX} = data;
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
                if (curStore.selectIds) {
                    const updateNodeOpt = curStore.updateNodeOpt || {}
                    updateNodeOpt.dir = dir;
                    updateNodeOpt.box = box
                    updateNodeOpt.workState = workState;
                    updateNodeOpt.reverseY = reverseY;
                    updateNodeOpt.reverseX = reverseX;
                    if (workState === EvevtWorkState.Start && box) {
                        this.cacheTextInfo.clear();
                        for (const name of curStore.selectIds) {
                            const isLocalId = this.serviceColloctor?.isLocalId(name);
                            const  storeKey = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                            let textKey:string = storeKey;
                            if (!isLocalId && this.serviceColloctor?.isOwn(storeKey)) {
                                textKey = this.serviceColloctor.getLocalId(storeKey);
                            }
                            const textEditor =  this.control.textEditorManager.get(textKey)
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
                            const scale:[number,number] = [box.w / cache.w, box.h / cache.h];
                            const promises:Promise<{key:string, textInfo:TextEditorInfo}>[] = [];
                            for (const [textKey,editor] of this.targetText.entries()) {
                                const {opt} = editor;
                                const newFontSize = Math.floor(opt.fontSize * scale[0]);
                                const cacheTextInfo = this.cacheTextInfo.get(textKey);
                                const isUpdate = (!cacheTextInfo && opt.fontSize !== newFontSize) || (cacheTextInfo && cacheTextInfo.fontSize !== newFontSize) || false;
                                const textEditor = this.control.textEditorManager.get(textKey)?.opt;
                                if (isUpdate && textEditor && opt.boxSize && opt.boxPoint) {
                                    const p = this.setTextStyle(textKey, {...textEditor, fontSize:newFontSize}, viewId)
                                    promises.push(p);
                                }
                            }
                            const textInfos = await Promise.all(promises);
                            for (const info of textInfos) {
                                if (info) {
                                    const {key , textInfo} = info;
                                    this.cacheTextInfo.set(key, {
                                        fontSize: textInfo.opt.fontSize,
                                        boxSize: textInfo.opt.boxSize,
                                        boxPoint: textInfo.opt.boxPoint
                                    })
                                }
                            }
                            updateNodeOpt.textInfos = this.cacheTextInfo
                        }
                    }
                    const taskData: IWorkerMessage = {
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
                        this.targetBox.delete(localWorkId);
                        this.targetText.clear();
                    }
                    // console.log('ScaleNode---3', box)
                    localMsgs.push([taskData, {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        emitEventType: this.emitEventType
                    }])
                    continue;
                }
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