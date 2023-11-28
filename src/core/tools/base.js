export class BaseShapeTool {
    constructor(fullLayer, drawLayer) {
        Object.defineProperty(this, "syncUnitTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "drawLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fullLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    setWorkId(id) {
        this.workId = id;
    }
    getWorkId() {
        return this.workId;
    }
    getWorkOptions() {
        return this.workOptions;
    }
    setWorkOptions(workOptions) {
        this.workOptions = workOptions;
        this.syncUnitTime = workOptions.syncUnitTime || this.syncUnitTime;
    }
}
