import { SubServiceWork } from "../base";
import { ECanvasShowType, EToolsKey } from "../enum";
import { PencilShape } from "../tools";
import { computRect } from "../utils";
import { transformToNormalData } from "../../collector/utils";
import { LaserPenShape } from "../tools/laserPen";
export class SubServiceWorkForWorker extends SubServiceWork {
    constructor(layer, drawLayer, postFun) {
        super(layer, drawLayer);
        Object.defineProperty(this, "workShapes", {
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
        Object.defineProperty(this, "_post", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._post = postFun;
    }
    activeWorkShape(data) {
        const { workId, opt, toolstype, type, updateNodeOpt, ops, op } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        if (!this.workShapes?.has(key)) {
            let workItem = {
                toolstype,
                animationWorkData: op || [],
                animationIndex: 0,
                type,
                updateNodeOpt,
                ops
            };
            if (toolstype && opt) {
                workItem = this.setNodeKey(workItem, toolstype, opt);
            }
            this.workShapes?.set(key, workItem);
            // return workItem;
        }
        const workShape = this.workShapes?.get(key);
        if (type) {
            workShape.type = type;
        }
        if (updateNodeOpt) {
            workShape.updateNodeOpt = updateNodeOpt;
        }
        if (ops) {
            workShape.ops = ops;
            workShape.animationWorkData = transformToNormalData(ops);
        }
        if (op) {
            // console.log('op1', op)
            workShape.animationWorkData = op;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        if (workShape.toolstype !== toolstype && toolstype && opt) {
            this.setNodeKey(workShape, toolstype, opt);
        }
        // this.workShapes.set(key,workShape);
    }
    setNodeKey(workShape, tools, opt) {
        workShape.toolstype = tools;
        switch (tools) {
            case EToolsKey.Pencil:
                workShape.node = new PencilShape(opt, this.fullLayer, this.drawLayer);
                break;
            case EToolsKey.LaserPen:
                workShape.node = new LaserPenShape(opt, this.drawLayer);
                break;
            default:
                workShape.node = undefined;
                break;
        }
        return workShape;
    }
    computNextAnimationIndex(workShape, pointUnit) {
        // const pointUnit = workShape.toolstype === EToolsKey.Pencil ? 3 : 2;
        const step = Math.floor(workShape.animationWorkData.slice(workShape.animationIndex).length * 16 / pointUnit / (workShape.node?.syncUnitTime || 1000)) * pointUnit;
        return Math.min(workShape.animationIndex + (step || pointUnit), workShape.animationWorkData.length);
    }
    animationDraw() {
        let rect;
        let clearRect;
        let isNext = false;
        let isFullWork = false;
        // console.log('animationDraw0', this.workShapes.size, isNext, !!rect)
        this.workShapes.forEach((workShape, key) => {
            const pointUnit = workShape.toolstype === EToolsKey.Pencil ? 3 : 2;
            const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
            const lastPointIndex = Math.max(0, workShape.animationIndex - pointUnit);
            const data = workShape.animationWorkData.slice(lastPointIndex, nextAnimationIndex);
            // if (workShape.ops && workShape.animationWorkData.length === nextAnimationIndex){
            //     workShape.animationIndex = nextAnimationIndex;
            // }
            let rect1;
            if (workShape.animationIndex < nextAnimationIndex) {
                rect1 = workShape.node?.consumeService(data, false);
                if (workShape.toolstype === EToolsKey.LaserPen) {
                    // console.log('animationDraw1', lastPointIndex, nextAnimationIndex, rect)
                    clearRect = computRect(clearRect, rect1);
                    if (workShape.timer) {
                        clearTimeout(workShape.timer);
                        workShape.timer = undefined;
                    }
                }
                else {
                    rect = computRect(rect, rect1);
                }
                isNext = true;
                workShape.animationIndex = nextAnimationIndex;
            }
            else if (!workShape.isDel) {
                if (workShape.toolstype === EToolsKey.Pencil && workShape.ops) {
                    rect1 = workShape.node?.consumeService(workShape.animationWorkData, true);
                    clearRect = computRect(clearRect, rect1);
                    workShape.isDel = true;
                    isFullWork = true;
                }
                if (workShape.toolstype === EToolsKey.LaserPen) {
                    if (!workShape.timer) {
                        workShape.timer = setTimeout(() => {
                            workShape.timer = undefined;
                            workShape.isDel = true;
                            console.log('animationDraw4');
                        }, (workShape.node?.getWorkOptions()).duration * 1000 + 100);
                    }
                    rect1 = workShape.node?.consumeService([], false);
                    clearRect = computRect(clearRect, rect1);
                    isFullWork = false;
                    // console.log('animationDraw2', lastPointIndex, nextAnimationIndex, clearRect)
                }
                isNext = true;
            }
            else if (workShape.isDel) {
                this.workShapes.delete(key);
            }
        });
        if (isNext) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
        if (rect) {
            // console.log('animationDraw2', isFullWork, rect)
            this._post({ render: {
                    rect,
                    drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                    isClear: isFullWork,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork
                } });
        }
        if (clearRect) {
            // console.log('animationDraw3', isFullWork, clearRect)
            Promise.resolve().then(() => {
                this._post({ render: {
                        rect: clearRect,
                        drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Float,
                        isFullWork
                    } });
            });
        }
    }
    consumeDraw(data) {
        this.activeWorkShape(data);
        // console.log('workShapes1', data, this.workShapes)
        Promise.resolve().then(() => {
            this.animationDraw();
        });
    }
    consumeFull(data) {
        this.activeWorkShape(data);
        // console.log('workShapes2', data, this.workShapes)
        Promise.resolve().then(() => {
            this.animationDraw();
        });
    }
    clearAllWorkShapesCache() {
        this.workShapes.clear();
    }
}
