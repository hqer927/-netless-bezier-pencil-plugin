import { requestAsyncCallBack } from "../utils";
import { BaseTeachingAidsManager } from "../../plugin/baseTeachingAidsManager";
export class BaseMsgMethod {
    constructor() {
        Object.defineProperty(this, "emtType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "control", {
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
    }
    static dispatch(emtType, emitEventType, value) {
        BaseTeachingAidsManager.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    get serviceColloctor() {
        return this.control.collector;
    }
    registerForMainEngine(emtType, control) {
        this.emtType = emtType;
        this.control = control;
        this.mainEngine = control.worker;
        this.mainEngine.internalMsgEmitter.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && this.mainEngine && this.mainEngine.internalMsgEmitter.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data) {
        for (const d of data) {
            this.mainEngine?.taskBatchData.add(d);
        }
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions) {
        requestAsyncCallBack(() => {
            actions.forEach(action => {
                this.serviceColloctor?.dispatch(action);
                const { viewId, undoTickerId } = action;
                if (undoTickerId && viewId) {
                    this.mainEngine?.internalMsgEmitter?.emit('undoTickerEnd', undoTickerId, viewId);
                }
            });
        }, this.mainEngine.maxLastSyncTime);
    }
}
