import { MainEngineForWorker } from "../worker/main";
export class BaseMsgMethod {
    constructor() {
        Object.defineProperty(this, "emtType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "emitter", {
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
    static dispatch(emt, emtType, emitEventType, value) {
        emt?.emit([emtType, emitEventType], value);
    }
    registerForMainEngine(emt, emtType, main, serviceColloctor) {
        this.emitter = emt;
        this.emtType = emtType;
        this.mainEngine = main;
        this.serviceColloctor = serviceColloctor;
        this.emtType && this.emitter?.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && this.emitter?.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data) {
        data.forEach(d => {
            this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}`, d);
        });
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions) {
        requestIdleCallback(() => {
            actions.forEach(action => {
                this.serviceColloctor?.dispatch(action);
            });
        }, { timeout: MainEngineForWorker.maxLastSyncTime });
    }
}
