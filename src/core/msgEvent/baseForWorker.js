export class BaseMsgMethodForWorker {
    constructor() {
        Object.defineProperty(this, "localWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "serviceWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    registerForWorker(localWork, serviceWork) {
        this.localWork = localWork;
        this.serviceWork = serviceWork;
        return this;
    }
}
