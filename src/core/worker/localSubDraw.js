import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey } from "../enum";
import { computRect } from "../utils";
export class SubLocalDrawWorkForWorker extends SubLocalWork {
    constructor(layer, postFun) {
        super(layer);
        Object.defineProperty(this, "_post", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "combineDrawTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "drawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "animationWorkRects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "animationId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "closeAnimationTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        this._post = postFun;
    }
    blurSelector() { }
    runLaserPenAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(() => {
                let rect;
                const sp = [];
                this.animationWorkRects?.forEach((value, key, map) => {
                    rect = computRect(rect, value.res.rect);
                    if (value.res.workId) {
                        sp.push(value.res);
                    }
                    if (value.canDel) {
                        map.delete(key);
                    }
                });
                this.animationId = undefined;
                if (this.animationWorkRects?.size) {
                    this.runLaserPenAnimation();
                }
                this._post({
                    render: {
                        rect,
                        drawCanvas: ECanvasShowType.Float,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Float,
                        isFullWork: false,
                    },
                    sp: sp.length ? sp : undefined
                });
            });
        }
    }
    drawPencil(res) {
        this._post({
            drawCount: this.drawCount,
            render: {
                rect: res?.rect,
                drawCanvas: ECanvasShowType.Float,
                isClear: false,
                isFullWork: false,
            },
            sp: res?.op && [res]
        });
    }
    consumeDraw(data) {
        const { op, workId } = data;
        if (op?.length && workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            const result = workShapeNode.consume({ data, isFullWork: false });
            if (toolsType === EToolsKey.LaserPen) {
                if (result?.rect) {
                    this.animationWorkRects?.set(workId, {
                        res: result,
                        canDel: false
                    });
                }
                this.runLaserPenAnimation();
                return;
            }
            if (result) {
                this.drawCount++;
                this.drawPencil(result);
            }
        }
    }
    consumeDrawAll(data) {
        const { workId } = data;
        if (workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen && this.animationId) {
                const result = workShapeNode.consumeAll({ data });
                if (result?.op) {
                    this._post({
                        sp: [result]
                    });
                }
                this.closeAnimationTime = workShapeNode.getWorkOptions()?.duration || this.closeAnimationTime;
                setTimeout(() => {
                    this.fullLayer.getElementsByName(workId.toString()).map(p => p.remove());
                    this.clearWorkShapeNodeCache(workId);
                    const rectData = this.animationWorkRects?.get(workId);
                    if (rectData) {
                        rectData.canDel = true;
                    }
                    this._post({
                        sp: [{
                                removeIds: [workId.toString()],
                                type: EPostMessageType.RemoveNode,
                            }]
                    });
                }, this.closeAnimationTime * 2000 + 500);
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
                this.drawCount = 0;
                this.fullLayer.removeAllChildren();
                this.clearWorkShapeNodeCache(workId);
            }
        }
        return;
    }
}
