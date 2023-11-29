import { EToolsKey } from "../..";
import { BaseShapeTool } from "../base";
export class SelectorShape extends BaseShapeTool {
    constructor(workOptions, fullLayer, drawlayer) {
        super(fullLayer, drawlayer);
        Object.defineProperty(this, "tmpPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Selector
        });
        Object.defineProperty(this, "workOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "syncTimestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
    }
    consume(data, isFullWork) {
        throw new Error("Method not implemented.");
    }
    consumeAll(data) {
        throw new Error("Method not implemented.");
    }
    consumeService(data, isFullWork) {
        throw new Error("Method not implemented.");
    }
    combineConsume() {
        throw new Error("Method not implemented.");
    }
    clearTmpPoints() {
        throw new Error("Method not implemented.");
    }
}
