import { MainEngineForWorker } from "../worker/main";
import { requestAsyncCallBack } from "../utils";
import { UndoRedoMethod } from "../../undo";
import { BezierPencilManager } from "../../plugin";
export class BaseMsgMethod {
    constructor() {
        Object.defineProperty(this, "emtType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mainEngine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "serviceColloctor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    static dispatch(emtType, emitEventType, value) {
        BezierPencilManager.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    registerForMainEngine(emtType, main, serviceColloctor) {
        this.emtType = emtType;
        this.mainEngine = main;
        this.serviceColloctor = serviceColloctor;
        BezierPencilManager.InternalMsgEmitter?.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && BezierPencilManager.InternalMsgEmitter?.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data) {
        const keys = this.mainEngine?.taskBatchData && [...this.mainEngine.taskBatchData.keys()] || [];
        // console.log('collectForLocalWorker', data.map(d=>d.emitEventType))
        for (const d of data) {
            // 相同worker切换不同method，需要注意时序
            if (keys.findIndex(k => k.split('##')[0] === `${d.msgType},${d.workId}`)) {
                requestAnimationFrame(() => {
                    this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}##${d.emitEventType},`, d);
                    this.mainEngine?.runAnimation();
                });
            }
            else {
                this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}##${d.emitEventType},`, d);
            }
        }
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions) {
        requestAsyncCallBack(() => {
            actions.forEach(action => {
                this.serviceColloctor?.dispatch(action);
                if (action.undoTickerId) {
                    UndoRedoMethod.emitter.emit("undoTickerEnd", action.undoTickerId);
                }
            });
        }, MainEngineForWorker.maxLastSyncTime);
    }
}
