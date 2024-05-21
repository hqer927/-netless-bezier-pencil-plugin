import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType, EvevtWorkState } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
export class TranslateNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.TranslateNode
        });
        Object.defineProperty(this, "undoTickerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "oldRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cachePosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, position, workState, viewId } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs = [];
        const bgRect = view.displayer.canvasBgRef.current?.getBoundingClientRect();
        const floatBarRect = view.displayer?.floatBarCanvasRef.current?.getBoundingClientRect();
        let willRefreshSelector = false;
        // const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
        const undoTickerId = workState === EvevtWorkState.Start && Date.now() || undefined;
        if (undoTickerId) {
            this.undoTickerId = undoTickerId;
            // console.log('undoTickerStart--000', workState)
            this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        }
        if (bgRect && floatBarRect && this.oldRect) {
            if (this.oldRect.x < bgRect.x && floatBarRect.x > this.oldRect.x) {
                willRefreshSelector = true;
            }
            else if (this.oldRect.y < bgRect.y && floatBarRect.y > this.oldRect.y) {
                willRefreshSelector = true;
            }
            else if (this.oldRect.x + this.oldRect.width > bgRect.x + bgRect.width && floatBarRect.x < this.oldRect.x) {
                willRefreshSelector = true;
            }
            else if (this.oldRect.y + this.oldRect.height > bgRect.y + bgRect.height && floatBarRect.y < this.oldRect.y) {
                willRefreshSelector = true;
            }
        }
        if (floatBarRect) {
            this.oldRect = floatBarRect;
        }
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey)
                continue;
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
                    if (workState === EvevtWorkState.Start) {
                        this.cachePosition = position;
                    }
                    if (this.cachePosition) {
                        const updateNodeOpt = curStore.updateNodeOpt || {};
                        updateNodeOpt.translate = [position.x - this.cachePosition.x, position.y - this.cachePosition.y];
                        updateNodeOpt.workState = workState;
                        const taskData = {
                            workId: curKey,
                            msgType: EPostMessageType.UpdateNode,
                            dataType: EDataType.Local,
                            updateNodeOpt,
                            emitEventType: this.emitEventType,
                            willRefreshSelector,
                            willSyncService: true,
                            textUpdateForWoker: false,
                            viewId
                        };
                        if (workState === EvevtWorkState.Done) {
                            taskData.willRefreshSelector = true;
                            taskData.textUpdateForWoker = true;
                            taskData.willSerializeData = true;
                            taskData.undoTickerId = this.undoTickerId;
                            this.cachePosition = undefined;
                        }
                        localMsgs.push([taskData, {
                                workId: curKey,
                                msgType: EPostMessageType.UpdateNode,
                                emitEventType: this.emitEventType
                            }]);
                    }
                }
                continue;
            }
        }
        if (workState === EvevtWorkState.Start) {
            this.mainEngine.unWritable();
        }
        else if (workState === EvevtWorkState.Done) {
            this.mainEngine.abled();
        }
        if (localMsgs.length) {
            // console.log('TranslateNode', localMsgs)
            this.collectForLocalWorker(localMsgs);
        }
    }
}
