import { ECanvasShowType, EPostMessageType, EToolsKey } from "./enum";
import { EraserShape, PencilShape, SelectorShape } from "./tools";
import { Group, Scene } from "spritejs";
import { LaserPenShape } from "./tools/laserPen";
import { getNodeRect } from "./utils";
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
    constructor() {
        Object.defineProperty(this, "curNodeMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    updateScene(offscreenCanvasOpt) {
        this.scene.attr({ ...offscreenCanvasOpt });
        const { width, height } = offscreenCanvasOpt;
        this.scene.container.width = width;
        this.scene.container.height = height;
        this.scene.width = width;
        this.scene.height = height;
        this.updateLayer({ width, height });
    }
    updateLayer(layerOpt) {
        const { width, height } = layerOpt;
        if (this.fullLayer) {
            this.fullLayer.parent.setAttribute('width', width);
            this.fullLayer.parent.setAttribute('height', height);
            this.fullLayer.setAttribute('size', [width, height]);
            this.fullLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        }
        if (this.drawLayer) {
            this.drawLayer.parent.setAttribute('width', width);
            this.drawLayer.parent.setAttribute('height', height);
            this.drawLayer.setAttribute('size', [width, height]);
            this.drawLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        }
        if (this.snapshotFullLayer) {
            this.snapshotFullLayer.parent.setAttribute('width', width);
            this.snapshotFullLayer.parent.setAttribute('height', height);
            this.snapshotFullLayer.setAttribute('size', [width, height]);
            this.snapshotFullLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        }
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
    createLayer(scene, opt) {
        const { width, height } = opt;
        const sy = "offscreen" + Date.now();
        const layer = scene.layer(sy, opt);
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
    constructor(curNodeMap, fullLayer, drawLayer) {
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
        Object.defineProperty(this, "curNodeMap", {
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
        Object.defineProperty(this, "effectWorkId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.curNodeMap = curNodeMap;
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
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            if (this.tmpOpt?.toolsType === EToolsKey.Selector) {
                this.blurSelector();
            }
            if (this.tmpOpt?.toolsType) {
                // console.log('firsthis.tmpOpt?.toolsTypet', this.tmpOpt?.toolsType, opt.toolsType)
                this.clearAllWorkShapesCache();
            }
        }
        this.tmpOpt = opt;
        this.tmpWorkShapeNode = this.createWorkShapeNode(opt);
    }
    clearWorkShapeNodeCache(workId) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
    }
    clearAllWorkShapesCache() {
        this.workShapes.forEach(w => w.clearTmpPoints());
        this.workShapes.clear();
    }
    runEffectWork(callBack) {
        if (this.effectWorkId) {
            clearTimeout(this.effectWorkId);
            this.effectWorkId = undefined;
        }
        this.effectWorkId = setTimeout(() => {
            this.effectWorkId = undefined;
            this.computNodeMap();
            this.rerRenderSelector();
            callBack && callBack();
        }, 50);
    }
    computNodeMap() {
        const willRemoveIds = new Set(this.curNodeMap.keys());
        this.fullLayer.children.forEach(c => {
            if (c.name !== SelectorShape.selectorId) {
                const rect = getNodeRect(c.name, this.fullLayer);
                if (rect) {
                    const value = this.curNodeMap.get(c.name);
                    if (value) {
                        value.rect = rect;
                        willRemoveIds.delete(c.name);
                    }
                    else {
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                        });
                    }
                }
            }
        });
        this.drawLayer?.children?.forEach(c => {
            if (c.name !== SelectorShape.selectorId) {
                const rect = getNodeRect(c.name, this.drawLayer);
                if (rect) {
                    const value = this.curNodeMap.get(c.name);
                    if (value) {
                        value.rect = rect;
                        willRemoveIds.delete(c.name);
                    }
                    else {
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                        });
                    }
                }
            }
        });
        if (willRemoveIds.size) {
            for (const key of willRemoveIds.keys()) {
                this.curNodeMap.delete(key);
            }
        }
        // console.log('computNodeMap', this.curNodeMap)
    }
    updataNodeMap(param) {
        const { key, ops, opt, toolsType } = param;
        let rect = getNodeRect(key, this.fullLayer);
        const value = this.curNodeMap.get(key) || {
            name: key,
            rect
        };
        if (ops) {
            value.ops = ops;
        }
        if (opt) {
            value.opt = opt;
        }
        if (rect) {
            value.rect = rect;
        }
        if (toolsType) {
            value.toolsType = toolsType;
        }
        if (this.drawLayer) {
            rect = getNodeRect(key, this.drawLayer);
            if (rect && this.drawLayer) {
                value.rect = rect;
            }
        }
        if (!value.rect) {
            this.curNodeMap.delete(key);
        }
        else {
            this.curNodeMap.set(key, value);
        }
        // console.log('updataNodeMap-local', key, this.curNodeMap)
    }
    rerRenderSelector() {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        if (!workShapeNode?.selectIds?.length)
            return;
        if (this.drawLayer) {
            const newRect = workShapeNode.getSelector(this.curNodeMap);
            if (newRect) {
                // console.log('rerRenderSelector', newRect)
                this._post({
                    render: [
                        {
                            rect: newRect,
                            isClear: true,
                            isFullWork: false,
                            clearCanvas: ECanvasShowType.Selector,
                            drawCanvas: ECanvasShowType.Selector,
                        }
                    ],
                    sp: [{
                            type: EPostMessageType.Select,
                            selectIds: workShapeNode.selectIds,
                            selectRect: newRect,
                            willSyncService: false
                        }]
                });
            }
        }
    }
}
export class SubServiceWork {
    constructor(curNodeMap, fullLayer, drawLayer) {
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
        Object.defineProperty(this, "curNodeMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.curNodeMap = curNodeMap;
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    updataNodeMap(key, ops, opt) {
        let rect = getNodeRect(key, this.fullLayer);
        const value = this.curNodeMap.get(key) || {
            name: key,
            rect,
        };
        if (ops) {
            value.ops = ops;
        }
        if (opt) {
            value.opt = opt;
        }
        if (rect) {
            value.rect = rect;
        }
        if (this.drawLayer) {
            rect = getNodeRect(key, this.drawLayer);
            if (rect && this.drawLayer) {
                value.rect = rect;
            }
        }
        if (!value.rect) {
            this.curNodeMap.delete(key);
        }
        else {
            this.curNodeMap.set(key, value);
        }
        // console.log('updataNodeMap-service', this.curNodeMap)
    }
}
