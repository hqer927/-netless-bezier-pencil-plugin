import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey } from "../enum";
import { computRect } from "../utils";
import { transformToNormalData } from "../../collector/utils";
export class SubLocalDrawWorkForWorker extends SubLocalWork {
    constructor(curNodeMap, layer, postFun) {
        super(curNodeMap, layer);
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
            value: 1100
        });
        Object.defineProperty(this, "runLaserPenStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this._post = postFun;
    }
    blurSelector() { }
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
                }],
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
            const result = workShapeNode.consume({ data, isFullWork: false, isClearAll: true, isSubWorker: true });
            if (toolsType === EToolsKey.LaserPen) {
                if (result?.rect) {
                    this.animationWorkRects?.set(workId, {
                        res: result,
                        canDel: false,
                        isRect: true,
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
    setFullWork(data) {
        const { workId, opt, toolsType } = data;
        if (workId && opt && toolsType) {
            const curWorkShapes = (workId && this.workShapes.get(workId)) || this.createWorkShapeNode({
                toolsOpt: opt,
                toolsType
            });
            if (!curWorkShapes) {
                return;
            }
            curWorkShapes.setWorkId(workId);
            this.workShapes.set(workId, curWorkShapes);
            return curWorkShapes;
        }
    }
    runFullWork(data) {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            workShape.consumeService({
                op,
                isFullWork: true,
                replaceId: workShape.getWorkId()?.toString()
            });
            data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            if (data.workId) {
                this.updataNodeMap({
                    key: data.workId?.toString(),
                    ops: data.ops,
                    opt: data.opt,
                    toolsType: data.toolsType,
                });
            }
            data.workId && this.workShapes.delete(data.workId);
        }
    }
    runSelectWork(data) {
        const workShape = this.setFullWork(data);
        if (workShape && data.selectIds?.length && data.workId) {
            workShape.selectServiceNode(data.workId.toString(), { selectIds: data.selectIds }, this.curNodeMap);
        }
    }
}
