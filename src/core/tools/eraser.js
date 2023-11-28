import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey } from "../enum";
import { computRect } from "../utils";
export class EraserShape extends BaseShapeTool {
    constructor(workOptions, fullLayer) {
        super(fullLayer);
        Object.defineProperty(this, "syncTimestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Eraser
        });
        Object.defineProperty(this, "tmpPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "workOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
    }
    combineConsume() {
        return undefined;
    }
    consumeService() {
        return undefined;
    }
    setWorkOptions(setWorkOptions) {
        super.setWorkOptions(setWorkOptions);
        this.syncTimestamp = Date.now();
    }
    consume(data) {
        const { op } = data;
        if (!op || op.length === 0) {
            return { type: EPostMessageType.None };
        }
        const { rect, removeIds } = this.remove(op);
        if (rect && removeIds.length) {
            return {
                type: EPostMessageType.RemoveNode,
                dataType: EDataType.Local,
                rect,
                removeIds
            };
        }
        return {
            type: EPostMessageType.None
        };
    }
    remove(op) {
        const { isLine } = this.workOptions;
        let rect;
        const removeIds = [];
        for (let i = 0; i < op.length; i += 2) {
            const x = op[i];
            const y = op[i + 1];
            this.fullLayer.children.forEach(n => {
                if (n.isPointCollision(x, y)) {
                    this.fullLayer.getElementsByName(n.name).forEach(f => {
                        const r = f?.getBoundingClientRect();
                        if (r) {
                            rect = computRect(rect, {
                                x: r.x - 10,
                                y: r.y - 10,
                                w: r.width + 20,
                                h: r.height + 20,
                            });
                        }
                        f.remove();
                    });
                    if (isLine) {
                        removeIds.push(n.name);
                        this.removeIds.push(n.name);
                    }
                    else {
                        // todo 需要切割分段
                    }
                }
            });
        }
        return { rect, removeIds };
    }
    consumeAll(data) {
        return this.consume(data);
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
    }
}
