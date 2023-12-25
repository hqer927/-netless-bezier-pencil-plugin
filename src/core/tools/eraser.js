import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { computRect } from "../utils";
export class EraserShape extends BaseShapeTool {
    updataOptService() {
        return;
    }
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
        Object.defineProperty(this, "worldPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worldScaling", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
        this.worldPosition = this.fullLayer.worldPosition;
        this.worldScaling = this.fullLayer.worldScaling;
    }
    combineConsume() {
        return undefined;
    }
    consumeService() {
        return undefined;
    }
    computNodeMap(nodeMaps) {
        this.fullLayer.children.forEach(c => {
            const d = nodeMaps.get(c.name);
            if (!d) {
                let rect;
                this.fullLayer.getElementsByName(c.name).forEach(f => {
                    const r = f?.getBoundingClientRect();
                    if (r) {
                        rect = computRect(rect, {
                            x: Math.floor(r.x),
                            y: Math.floor(r.y),
                            w: Math.round(r.width),
                            h: Math.round(r.height),
                        });
                    }
                });
                if (rect) {
                    nodeMaps.set(c.name, {
                        rect,
                        name: c.name,
                        layer: c.parent
                    });
                }
            }
        });
    }
    setWorkOptions(setWorkOptions) {
        super.setWorkOptions(setWorkOptions);
        this.syncTimestamp = Date.now();
    }
    consume(props) {
        const { op, workState } = props.data;
        if (!op || op.length === 0) {
            return { type: EPostMessageType.None };
        }
        if (props.nodeMaps && workState === EvevtWorkState.Start) {
            props.nodeMaps && this.computNodeMap(props.nodeMaps);
        }
        if (props.nodeMaps) {
            const { rect, removeIds } = this.remove(op, props.nodeMaps);
            if (rect && removeIds.length) {
                return {
                    type: EPostMessageType.RemoveNode,
                    dataType: EDataType.Local,
                    rect,
                    removeIds
                };
            }
        }
        return {
            type: EPostMessageType.None
        };
    }
    remove(op, nodeMaps) {
        const { isLine } = this.workOptions;
        let rect;
        const removeIds = [];
        for (let i = 0; i < op.length; i += 2) {
            const x = op[i] * this.worldScaling[0] + this.worldPosition[0];
            const y = op[i + 1] * this.worldScaling[1] + this.worldPosition[1];
            nodeMaps.forEach((node) => {
                const n = node.layer.getElementById(node.name);
                if (n?.isPointCollision(x, y)) {
                    rect = computRect(rect, node.rect);
                    n.remove();
                    if (isLine) {
                        removeIds.push(n.name);
                        this.removeIds.push(n.name);
                    }
                    else {
                        // todo 需要切割分段
                        // (n as Path).getPathLength();
                    }
                }
            });
        }
        return { rect, removeIds };
    }
    consumeAll(props) {
        return this.consume(props);
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
    }
}
