import { ECanvasShowType, EPostMessageType, EToolsKey } from "./enum";
import { EraserShape, PencilShape, SelectorShape } from "./tools";
import { Group, Scene } from "spritejs";
import { LaserPenShape } from "./tools/laserPen";
import { computRect } from "./utils";
export class MainEngine {
    constructor(displayer, collector) {
        /** 数据收集器 */
        Object.defineProperty(this, "collector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** view容器 */
        Object.defineProperty(this, "displayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** 临时手动gc数据池 */
        Object.defineProperty(this, "dustbin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        this.displayer = displayer;
        this.collector = collector;
    }
    /** 设置当前选中的工具配置数据 */
    setCurrentToolsData(currentToolsData) {
        this.currentToolsData = currentToolsData;
    }
    /** 设置当前绘制任务数据 */
    setCurrentLocalWorkData(currentLocalWorkData) {
        this.currentLocalWorkData = currentLocalWorkData;
    }
    /** 设置相机参数 */
    setCameraOpt(cameraOpt) {
        this.cameraOpt = cameraOpt;
    }
    /** 获取当前绘制任务id */
    getWorkId() {
        return this.currentLocalWorkData.workId;
    }
}
export class WorkThreadEngine {
    updateScene(offscreenCanvasOpt) {
        this.scene.attr({ ...offscreenCanvasOpt });
        const { width, height } = offscreenCanvasOpt;
        this.scene.container.width = width;
        this.scene.container.height = height;
        this.scene.width = width;
        this.scene.height = height;
        this.scene.forceUpdate();
        this.updateLayer({ width, height });
    }
    updateLayer(layerOpt) {
        const { width, height } = layerOpt;
        const centerPos = this.cameraOpt || { centerX: 0, centerY: 0 };
        this.fullLayer?.setAttribute('size', [width, height]);
        this.fullLayer?.setAttribute('pos', [width / 2 + centerPos.centerX, height / 2 + centerPos.centerY]);
        this.drawLayer?.setAttribute('size', [width, height]);
        this.drawLayer?.setAttribute('pos', [width / 2 + centerPos.centerX, height / 2 + centerPos.centerY]);
    }
    createScene(opt) {
        const { width, height } = opt;
        const container = new OffscreenCanvas(width, height);
        return new Scene({
            container,
            displayRatio: this.dpr,
            depth: false,
            desynchronized: true,
            ...opt,
        });
    }
    createLayer(opt) {
        const { width, height } = opt;
        const sy = "offscreen" + Date.now();
        const layer = this.scene.layer(sy, opt);
        const group = new Group({
            anchor: [0.5, 0.5],
            pos: [width * 0.5, height * 0.5],
            size: [width, height],
            name: 'viewport'
        });
        layer.append(group);
        return group;
    }
    getNodes(workId) {
        return this.fullLayer.getElementsByName(workId + '').concat(this.drawLayer.getElementsByName(workId + ''));
    }
}
export class SubLocalWork {
    constructor(fullLayer, drawLayer) {
        Object.defineProperty(this, "fullLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "drawLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tmpWorkShapeNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tmpOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "curNodeMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "effectWorkId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    getWorkShape(workId) {
        return this.workShapes.get(workId);
    }
    getTmpWorkShapeNode() {
        return this.tmpWorkShapeNode;
    }
    setTmpWorkId(workId) {
        if (workId && this.tmpWorkShapeNode) {
            this.tmpWorkShapeNode.setWorkId(workId);
            this.workShapes.set(workId, this.tmpWorkShapeNode);
            if (this.tmpOpt) {
                this.setToolsOpt(this.tmpOpt);
            }
            return;
        }
    }
    setTmpWorkOptions(opt) {
        this.tmpWorkShapeNode?.setWorkOptions(opt);
    }
    setWorkOptions(workId, opt) {
        const node = this.workShapes.get(workId);
        if (!node) {
            this.setTmpWorkId(workId);
        }
        this.workShapes.get(workId)?.setWorkOptions(opt);
    }
    createWorkShapeNode(opt) {
        let tmpWorkShapeNode;
        switch (opt.toolsType) {
            case EToolsKey.Pencil:
                tmpWorkShapeNode = new PencilShape(opt.toolsOpt, this.fullLayer, this.drawLayer);
                break;
            case EToolsKey.LaserPen:
                tmpWorkShapeNode = new LaserPenShape(opt.toolsOpt, this.fullLayer);
                break;
            case EToolsKey.Eraser:
                tmpWorkShapeNode = new EraserShape(opt.toolsOpt, this.fullLayer);
                break;
            case EToolsKey.Selector:
                tmpWorkShapeNode = new SelectorShape(opt.toolsOpt, this.fullLayer, this.drawLayer);
                break;
            default:
                tmpWorkShapeNode = undefined;
                break;
        }
        return tmpWorkShapeNode;
    }
    setToolsOpt(opt) {
        let canEffect = false;
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            if (this.tmpOpt?.toolsType === EToolsKey.Selector) {
                this.blurSelector();
            }
            this.clearAllWorkShapesCache();
            if (opt.toolsType === EToolsKey.Selector) {
                canEffect = true;
            }
        }
        this.tmpOpt = opt;
        this.tmpWorkShapeNode = this.createWorkShapeNode(opt);
        if (canEffect) {
            this.runEffectWork();
        }
    }
    clearWorkShapeNodeCache(workId) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
    }
    clearAllWorkShapesCache() {
        this.workShapes.forEach(w => w.clearTmpPoints());
        this.workShapes.clear();
    }
    runEffectWork() {
        if (!this.effectWorkId) {
            this.effectWorkId = setTimeout(() => {
                this.effectWorkId = undefined;
                this.computNodeMap();
                this.rerRenderSelector();
            }, 0);
        }
    }
    computNodeMap() {
        this.curNodeMap.clear();
        if (this.tmpOpt?.toolsType === EToolsKey.Selector || this.tmpOpt?.toolsType === EToolsKey.Eraser) {
            this.fullLayer.children.forEach(c => {
                if (c.name !== SelectorShape.selectorId) {
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
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                            layer: c.parent
                        });
                    }
                }
            });
            this.drawLayer?.children?.forEach(c => {
                if (c.name !== SelectorShape.selectorId) {
                    let rect;
                    this.drawLayer?.getElementsByName(c.name).forEach(f => {
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
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                            layer: c.parent
                        });
                    }
                }
            });
        }
        // console.log('computNodeMap', this.curNodeMap)
    }
    rerRenderSelector() {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        if (!workShapeNode?.selectIds?.length)
            return;
        if (this.drawLayer) {
            const newRect = workShapeNode.getSelector(this.curNodeMap);
            this._post({
                render: {
                    rect: newRect,
                    isClear: true,
                    isFullWork: false,
                    clearCanvas: ECanvasShowType.Selector,
                    drawCanvas: ECanvasShowType.Selector,
                },
                sp: [{
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        selectRect: newRect,
                    }]
            });
        }
    }
}
export class SubServiceWork {
    constructor(fullLayer, drawLayer) {
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
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
}
