import { EToolsKey, ECanvasShowType, EPostMessageType } from "..";
import { transformToNormalData } from "../../collector/utils";
import { computRect } from "../utils";
import { LocalWork } from "./base";
export class LocalWorkForSubWorker extends LocalWork {
    constructor(opt) {
        super(opt);
        Object.defineProperty(this, "animationWorkRects", {
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
            value: 1100
        });
        Object.defineProperty(this, "runLaserPenStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    runFullWork(data) {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            const rect = workShape.consumeService({
                op,
                isFullWork: true,
                replaceId: workShape.getWorkId()?.toString()
            });
            const rect1 = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            data.workId && this.workShapes.delete(data.workId);
            return rect1 || rect;
        }
    }
    runSelectWork(data) {
        const workShape = this.setFullWork(data);
        if (workShape && data.selectIds?.length && data.workId) {
            workShape.selectServiceNode(data.workId.toString(), { selectIds: data.selectIds });
        }
    }
    consumeDraw(data) {
        const { op, workId } = data;
        if (op?.length && workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            const result = workShapeNode.consume({ data, isFullWork: false, isClearAll: true, isSubWorker: true });
            switch (toolsType) {
                case EToolsKey.LaserPen:
                    if (result?.rect) {
                        this.animationWorkRects?.set(workId, {
                            res: result,
                            canDel: false,
                            isRect: true,
                        });
                    }
                    this.runLaserPenAnimation();
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                    if (result) {
                        this.drawCount++;
                        this.drawArrow(result);
                    }
                    break;
                case EToolsKey.Pencil:
                    if (result) {
                        this.drawCount++;
                        this.drawPencil(result);
                    }
                    break;
                default:
                    break;
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
            switch (toolsType) {
                case EToolsKey.LaserPen:
                    if (this.animationId) {
                        const result = workShapeNode.consumeAll({ data });
                        if (result?.op) {
                            if (result?.rect) {
                                this.animationWorkRects?.set(workId, {
                                    res: result,
                                    canDel: false,
                                    isRect: true,
                                });
                                this.runLaserPenAnimation();
                            }
                            this._post({
                                sp: [result]
                            });
                        }
                        const duration = workShapeNode.getWorkOptions()?.duration;
                        this.closeAnimationTime = duration ? duration * 1000 + 100 : this.closeAnimationTime;
                        setTimeout(() => {
                            this.fullLayer.getElementsByName(workId.toString()).map(p => p.remove());
                            this.clearWorkShapeNodeCache(workId);
                            const rectData = this.animationWorkRects?.get(workId);
                            if (rectData) {
                                rectData.canDel = true;
                            }
                            setTimeout(() => {
                                this._post({
                                    sp: [{
                                            removeIds: [workId.toString()],
                                            type: EPostMessageType.RemoveNode,
                                        }]
                                });
                            }, workShapeNode.getWorkOptions().syncUnitTime || this.closeAnimationTime);
                        }, this.closeAnimationTime);
                    }
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Pencil:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                    this.drawCount = 0;
                    this.fullLayer.removeAllChildren();
                    this.clearWorkShapeNodeCache(workId);
                    break;
                default:
                    break;
            }
        }
        return;
    }
    runLaserPenAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(() => {
                this.animationId = undefined;
                this.runLaserPenStep++;
                if (this.runLaserPenStep > 1) {
                    this.runLaserPenStep = 0;
                    this.runLaserPenAnimation();
                    return;
                }
                let rect;
                const sp = [];
                this.animationWorkRects?.forEach((value, key, map) => {
                    if (value.isRect) {
                        rect = computRect(rect, value.res.rect);
                    }
                    if (value.res.workId) {
                        sp.push(value.res);
                    }
                    const hasRect = this.fullLayer.getElementsByName(key.toString()).length;
                    if (hasRect) {
                        value.isRect = true;
                    }
                    else {
                        value.isRect = false;
                    }
                    if (value.canDel) {
                        map.delete(key);
                    }
                });
                if (this.animationWorkRects?.size) {
                    this.runLaserPenAnimation();
                }
                if (rect) {
                    this._post({
                        render: [{
                                rect,
                                drawCanvas: ECanvasShowType.Float,
                                isClear: true,
                                clearCanvas: ECanvasShowType.Float,
                                isFullWork: false,
                                viewId: this.viewId
                            }],
                        sp
                    });
                }
            });
        }
    }
    drawPencil(res) {
        this._post({
            drawCount: this.drawCount,
            render: [{
                    rect: res?.rect,
                    drawCanvas: ECanvasShowType.Float,
                    isClear: false,
                    isFullWork: false,
                    viewId: this.viewId
                }],
            sp: res?.op && [res]
        });
    }
    drawArrow(res) {
        this._post({
            drawCount: this.drawCount,
            render: [{
                    rect: res?.rect,
                    drawCanvas: ECanvasShowType.Float,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                    viewId: this.viewId
                }]
        });
    }
}
