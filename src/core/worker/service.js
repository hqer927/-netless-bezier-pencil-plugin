import { SubServiceWork } from "../base";
import { ECanvasShowType, EToolsKey } from "../enum";
import { PencilShape, SelectorShape } from "../tools";
import { computRect } from "../utils";
import { transformToNormalData } from "../../collector/utils";
import { LaserPenShape } from "../tools/laserPen";
export class SubServiceWorkForWorker extends SubServiceWork {
    constructor(curNodeMap, layer, drawLayer, postFun) {
        super(curNodeMap, layer, drawLayer);
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
        // private showRunSelectorEffect:boolean = false;
        Object.defineProperty(this, "selectorWorkShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "_post", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "willRunEffectSelectorIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set
        });
        Object.defineProperty(this, "runEffectId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "noAnimationRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._post = postFun;
    }
    activeWorkShape(data) {
        const { workId, opt, toolsType, type, updateNodeOpt, ops, op, useAnimation, noRender } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        if (!this.workShapes?.has(key)) {
            let workItem = {
                toolsType,
                animationWorkData: op || [],
                animationIndex: 0,
                type,
                updateNodeOpt,
                ops,
                useAnimation: typeof useAnimation !== 'undefined' ? useAnimation : typeof updateNodeOpt?.useAnimation !== 'undefined' ? updateNodeOpt?.useAnimation : true,
                oldRect: this.getNodeRect(key),
                noRender,
            };
            if (toolsType && opt) {
                workItem = this.setNodeKey(workItem, toolsType, opt);
            }
            this.workShapes?.set(key, workItem);
            // return workItem;
        }
        const workShape = this.workShapes?.get(key);
        if (type) {
            workShape.type = type;
        }
        if (ops) {
            workShape.animationWorkData = transformToNormalData(ops);
            workShape.ops = ops;
        }
        if (updateNodeOpt) {
            workShape.updateNodeOpt = updateNodeOpt;
        }
        if (op) {
            workShape.animationWorkData = op;
        }
        if (noRender) {
            workShape.noRender = noRender;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        if (workShape.toolsType !== toolsType && toolsType && opt) {
            this.setNodeKey(workShape, toolsType, opt);
        }
        // this.workShapes.set(key,workShape);
    }
    activeSelectorShape(data) {
        const { workId, opt, toolsType, type, selectIds } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        if (!this.selectorWorkShapes?.has(key)) {
            let workItem = {
                toolsType,
                selectIds,
                type,
                opt,
            };
            if (toolsType && opt) {
                workItem = this.setNodeKey(workItem, toolsType, opt);
            }
            this.selectorWorkShapes?.set(key, workItem);
        }
        const workShape = this.selectorWorkShapes?.get(key);
        if (type) {
            workShape.type = type;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        workShape.selectIds = selectIds || [];
    }
    setNodeKey(workShape, tools, opt) {
        workShape.toolsType = tools;
        switch (tools) {
            case EToolsKey.Pencil:
                workShape.node = new PencilShape(opt, this.fullLayer, this.drawLayer);
                break;
            case EToolsKey.LaserPen:
                workShape.node = new LaserPenShape(opt, this.drawLayer);
                break;
            case EToolsKey.Selector:
                workShape.node = new SelectorShape(opt, this.fullLayer);
                break;
            default:
                workShape.node = undefined;
                break;
        }
        return workShape;
    }
    computNextAnimationIndex(workShape, pointUnit) {
        // const pointUnit = workShape.toolsType === EToolsKey.Pencil ? 3 : 2;
        const step = Math.floor((workShape.animationWorkData || []).slice(workShape.animationIndex).length * 32 / pointUnit / (workShape.node?.syncUnitTime || 1000)) * pointUnit;
        return Math.min((workShape.animationIndex || 0) + (step || pointUnit), (workShape.animationWorkData || []).length);
    }
    animationDraw() {
        this.animationId = undefined;
        let rect;
        let clearRect;
        let isNext = false;
        let isFullWork = false;
        let noAnimationRect;
        this.workShapes.forEach((workShape, key) => {
            if (!workShape.useAnimation) {
                if (workShape.toolsType === EToolsKey.Pencil && workShape.ops) {
                    let rect1 = workShape.node?.consumeService({
                        op: workShape.animationWorkData || [],
                        isFullWork: true,
                        replaceId: key
                    });
                    rect1 = computRect(workShape.oldRect, rect1);
                    // console.log('consumeService', rect1)
                    rect1 = computRect(rect1, workShape.node?.updataOptService(workShape.updateNodeOpt));
                    // console.log('consumeService1', rect1)
                    if (!workShape.noRender) {
                        noAnimationRect = computRect(noAnimationRect, rect1);
                    }
                    // console.log('consumeService2', noAnimationRect);
                    this.selectorWorkShapes.forEach((s, selectorId) => {
                        if (s.selectIds?.includes(key)) {
                            this.willRunEffectSelectorIds.add(selectorId);
                            this.noAnimationRect = computRect(this.noAnimationRect, noAnimationRect);
                            noAnimationRect = undefined;
                            this.runEffect();
                        }
                    });
                    this.updataNodeMap(key, workShape.ops, workShape.node?.getWorkOptions());
                    this.workShapes.delete(key);
                }
            }
            else {
                const pointUnit = workShape.toolsType === EToolsKey.Pencil ? 3 : 2;
                const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                const lastPointIndex = Math.max(0, (workShape.animationIndex || 0) - pointUnit);
                const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                let rect1;
                if ((workShape.animationIndex || 0) < nextAnimationIndex) {
                    rect1 = workShape.node?.consumeService({
                        op: data,
                        isFullWork: false,
                        replaceId: workShape.node.getWorkId()?.toString()
                    });
                    if (workShape.toolsType === EToolsKey.LaserPen) {
                        clearRect = computRect(clearRect, rect1);
                        if (workShape.timer) {
                            clearTimeout(workShape.timer);
                            workShape.timer = undefined;
                        }
                    }
                    else {
                        if (!workShape.noRender) {
                            rect = computRect(rect, rect1);
                            workShape.totalRect = computRect(workShape.totalRect, rect1);
                        }
                    }
                    isNext = true;
                    workShape.animationIndex = nextAnimationIndex;
                }
                else if (!workShape.isDel) {
                    if (workShape.toolsType === EToolsKey.Pencil && workShape.ops) {
                        rect1 = workShape.node?.consumeService({
                            op: workShape.animationWorkData || [],
                            isFullWork: true,
                            replaceId: workShape.node.getWorkId()?.toString(),
                        });
                        workShape.isDel = true;
                        isFullWork = true;
                        if (!workShape.noRender) {
                            clearRect = computRect(clearRect, rect1);
                            workShape.totalRect = clearRect;
                        }
                    }
                    if (workShape.toolsType === EToolsKey.LaserPen) {
                        if (!workShape.timer) {
                            workShape.timer = setTimeout(() => {
                                workShape.timer = undefined;
                                workShape.isDel = true;
                                this.runAnimation();
                            }, (workShape.node?.getWorkOptions()).duration * 1000 + 100);
                        }
                        isFullWork = false;
                        rect1 = workShape.node?.consumeService({
                            op: [],
                            isFullWork: false
                        });
                        clearRect = computRect(clearRect, rect1);
                    }
                    isNext = true;
                }
                else if (workShape.isDel) {
                    if (workShape.toolsType === EToolsKey.LaserPen) {
                        rect1 = workShape.node?.consumeService({
                            op: [],
                            isFullWork: false
                        });
                        if (!workShape.noRender) {
                            clearRect = computRect(clearRect, rect1);
                        }
                    }
                    this.updataNodeMap(key, workShape.ops, workShape.node?.getWorkOptions());
                    this.workShapes.delete(key);
                }
            }
        });
        if (isNext) {
            // this.animationId = requestAnimationFrame(this.animationDraw.bind(this))
            this.runAnimation();
        }
        if (rect) {
            // console.log('animationDraw1', rect)
            this._post({ render: {
                    rect,
                    drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                    isClear: isFullWork,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork
                } });
        }
        if (clearRect) {
            Promise.resolve().then(() => {
                // console.log('animationDraw2', clearRect)
                this._post({ render: {
                        rect: clearRect,
                        drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Float,
                        isFullWork
                    } });
            });
        }
        if (noAnimationRect) {
            Promise.resolve().then(() => {
                // console.log('animationDraw3', noAnimationRect)
                this._post({ render: {
                        rect: noAnimationRect,
                        drawCanvas: ECanvasShowType.Bg,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true
                    } });
            });
        }
    }
    runEffect() {
        if (!this.runEffectId) {
            this.runEffectId = setTimeout(this.effectRunSelector.bind(this), 0);
        }
    }
    runAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
    }
    consumeDraw(data) {
        this.activeWorkShape(data);
        this.runAnimation();
    }
    consumeFull(data) {
        this.activeWorkShape(data);
        this.runAnimation();
    }
    clearAllWorkShapesCache() {
        this.workShapes.forEach((workShape, key) => {
            if (workShape.toolsType === EToolsKey.LaserPen) {
                setTimeout(() => {
                    this.workShapes.delete(key);
                }, 2000);
            }
            else {
                this.workShapes.delete(key);
            }
        });
    }
    runSelectWork(data) {
        this.activeSelectorShape(data);
        const { workId } = data;
        const workIdStr = workId?.toString();
        if (workIdStr) {
            this.willRunEffectSelectorIds.add(workIdStr);
        }
        this.runEffect();
    }
    removeSelectWork(data) {
        const { workId } = data;
        const workIdStr = workId?.toString();
        if (workIdStr) {
            this.activeSelectorShape(data);
            this.willRunEffectSelectorIds.add(workIdStr);
        }
        this.runEffect();
    }
    effectRunSelector() {
        this.runEffectId = undefined;
        let rect = this.noAnimationRect;
        this.willRunEffectSelectorIds.forEach(id => {
            const workShape = this.selectorWorkShapes.get(id);
            const r = workShape && workShape.selectIds && workShape.node?.selectServiceNode(id, workShape, this.curNodeMap);
            rect = computRect(rect, r);
            if (!workShape?.selectIds?.length) {
                this.selectorWorkShapes.delete(id);
            }
        });
        if (rect) {
            this._post({ render: {
                    rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true
                } });
        }
        this.willRunEffectSelectorIds.clear();
        this.noAnimationRect = undefined;
    }
    removeWork(data) {
        const { workId } = data;
        const key = workId?.toString();
        if (key) {
            const workShape = this.workShapes.get(key);
            if (workShape) {
                this.workShapes.delete(key);
                this.removeNode(key, data, workShape?.totalRect, false);
                return;
            }
            this.removeNode(key, data);
        }
    }
    removeNode(key, data, oldRect, isFullWork = true) {
        const nodes = this.fullLayer.getElementsByName(key).concat(this.drawLayer?.getElementsByName(key));
        if (key.indexOf(SelectorShape.selectorId) > -1) {
            this.removeSelectWork(data);
            // nodes = (this.fullLayer.parent as Layer).getElementsByName(SelectorShape.selectorId).concat((this.drawLayer?.parent as Layer)?.getElementsByName(SelectorShape.selectorId));
        }
        const removeNode = [];
        let rect = oldRect;
        nodes.forEach(node => {
            const r = node.getBoundingClientRect();
            rect = computRect(rect, {
                x: Math.floor(r.x - 10),
                y: Math.floor(r.y - 10),
                w: Math.floor(r.width + 20),
                h: Math.floor(r.height + 20),
            });
            removeNode.push(node);
        });
        if (removeNode.length) {
            removeNode.forEach(r => r.remove());
        }
        if (rect) {
            this._post({
                render: {
                    rect,
                    isClear: true,
                    isFullWork,
                    clearCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float,
                    drawCanvas: isFullWork ? ECanvasShowType.Bg : ECanvasShowType.Float
                }
            });
            this.curNodeMap.delete(key);
        }
    }
    getNodeRect(workId) {
        let rect;
        this.fullLayer.getElementsByName(workId).forEach(c => {
            const r = c.getBoundingClientRect();
            const x = Math.floor(r.left - PencilShape.PencilBorderPadding);
            const y = Math.floor(r.top - PencilShape.PencilBorderPadding);
            const w = Math.ceil(r.width + PencilShape.PencilBorderPadding * 2);
            const h = Math.ceil(r.height + PencilShape.PencilBorderPadding * 2);
            rect = computRect(rect, { x, y, w, h });
        });
        // console.log('rect', worldPosition, rect)
        return rect;
    }
    runReverseSelectWork(selectIds) {
        selectIds.forEach(id => {
            this.selectorWorkShapes.forEach((workShapes, key) => {
                if (workShapes.selectIds?.length) {
                    const i = workShapes.selectIds.indexOf(id);
                    if (i > -1) {
                        workShapes.selectIds.splice(i, 1);
                        this.willRunEffectSelectorIds.add(key);
                    }
                }
            });
        });
        if (this.willRunEffectSelectorIds.size) {
            this.runEffect();
        }
    }
}
