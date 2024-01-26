import { MainEngineForWorker } from "../worker/main";
import { requestAsyncCallBack } from "../utils";
import { UndoRedoMethod } from "../../undo";
import { BezierPencilDisplayer } from "../../plugin";
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
        BezierPencilDisplayer.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    registerForMainEngine(emtType, main, serviceColloctor) {
        this.emtType = emtType;
        this.mainEngine = main;
        this.serviceColloctor = serviceColloctor;
        BezierPencilDisplayer.InternalMsgEmitter?.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && BezierPencilDisplayer.InternalMsgEmitter?.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data) {
        data.forEach(d => {
            this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}`, d);
        });
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
