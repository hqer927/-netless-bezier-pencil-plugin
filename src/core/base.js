import { EToolsKey } from "./enum";
import { EraserShape, PencilShape } from "./tools";
import { Scene } from "spritejs";
import { LaserPenShape } from "./tools/laserPen";
export class MainEngine {
    constructor(bgCanvas, floatCanvas, collector) {
        /** 设备像素比 */
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        /** 数据收集器 */
        Object.defineProperty(this, "collector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** 用于展示绘制的画布 */
        Object.defineProperty(this, "displayCanvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** 用于顶层高频绘制的画布 */
        Object.defineProperty(this, "floatCanvas", {
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
        this.displayCanvas = bgCanvas;
        this.floatCanvas = floatCanvas;
        const ctx = this.displayCanvas.getContext('2d');
        if (ctx) {
            this.dpr = this.getRatioWithContext(ctx);
        }
        this.collector = collector;
    }
    getRatioWithContext(context) {
        const backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1.0;
        return Math.max(1.0, (window.devicePixelRatio || 1.0) / backingStoreRatio);
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
        // abstract localWork: SubLocalWork;
        // abstract serviceWork: SubServiceWork;
        Object.defineProperty(this, "translate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [0, 0]
        });
        Object.defineProperty(this, "scale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        /** 临时手动gc数据池 */
        Object.defineProperty(this, "dustbin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
    }
    updateScene(offscreenCanvasOpt) {
        this.scene.attr({ ...offscreenCanvasOpt, bufferSize: 10000 });
    }
    updateLayer(layerOpt) {
        this.fullLayer.attr({ ...layerOpt, bufferSize: 5000 });
        this.drawLayer.attr(layerOpt);
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
        const sy = "offscreen" + Date.now();
        return this.scene.layer(sy, opt);
    }
    setTranslate(translate) {
        this.translate = translate;
    }
    setScale(scale) {
        this.scale = scale;
    }
    getNodes(workId) {
        return this.fullLayer.getElementsByName(workId + '').concat(this.drawLayer.getElementsByName(workId + ''));
    }
}
export class SubLocalWork {
    constructor(fullLayer, drawLayer) {
        // protected batchUnitTime:number = 900;
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
    setToolsOpt(opt) {
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            this.clearAllWorkShapesCache();
        }
        this.tmpOpt = opt;
        switch (opt.toolsType) {
            case EToolsKey.Pencil:
                this.tmpWorkShapeNode = new PencilShape(opt.toolsOpt, this.fullLayer, this.drawLayer);
                break;
            case EToolsKey.LaserPen:
                this.tmpWorkShapeNode = new LaserPenShape(opt.toolsOpt, this.fullLayer);
                break;
            case EToolsKey.Eraser:
                this.tmpWorkShapeNode = new EraserShape(opt.toolsOpt, this.fullLayer);
                break;
            default:
                this.tmpWorkShapeNode = undefined;
                break;
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
