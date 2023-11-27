import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey } from "../enum";
export class SubLocalWorkForWorker extends SubLocalWork {
    constructor(layer, drawLayer, postFun) {
        super(layer, drawLayer);
        Object.defineProperty(this, "workShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "combineUnitTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 600
        });
        Object.defineProperty(this, "combineTimerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_post", {
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
        this._post = postFun;
    }
    drawPencilCombine(workId) {
        const result = this.workShapes.get(workId)?.combineConsume();
        if (result) {
            const combineDrawResult = {
                render: {
                    rect: result?.rect,
                    isClear: true,
                    drawCanvas: ECanvasShowType.Float,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                }
            };
            Promise.resolve(combineDrawResult).then((msg) => {
                msg.drawCount = this.drawCount;
                this._post(msg);
            });
        }
    }
    drawEraser(res) {
        Promise.resolve(res).then((result) => {
            // console.log('Promise', result)
            this._post({
                render: {
                    rect: result.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                },
                sp: [result]
            });
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
            const result = workShapeNode.consume(data, true);
            if (toolsType === EToolsKey.Eraser) {
                if (result?.rect) {
                    this.drawEraser(result);
                }
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
                if (!this.combineTimerId) {
                    this.combineTimerId = setTimeout(() => {
                        this.combineTimerId = undefined;
                        this.drawPencilCombine(workId);
                    }, this.combineUnitTime);
                }
                if (result) {
                    this.drawCount++;
                    result.drawCount = this.drawCount;
                }
            }
            return result;
        }
    }
    consumeDrawAll(data) {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
        }
        const { workId } = data;
        if (workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            this.drawCount = 0;
            const toolsType = workShapeNode.toolsType;
            const r = workShapeNode.consumeAll(data);
            if (toolsType === EToolsKey.Eraser) {
                if (r?.rect) {
                    this.drawEraser(r);
                }
                return;
            }
            this.clearWorkShapeNodeCache(workId);
            if (toolsType === EToolsKey.LaserPen) {
                setTimeout(() => {
                    this._post({
                        sp: [{
                                removeIds: [workId.toString()],
                                type: EPostMessageType.RemoveNode,
                            }]
                    });
                }, this.combineUnitTime);
            }
            return r;
        }
    }
}
