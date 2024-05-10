import { Group, Scene } from "spritejs";
import { VNodeManager } from "./vNodeManager";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { getShapeInstance } from "../tools/utils";
import { Cursor_Hover_Id } from "..";
export class WorkThreadEngineBase {
    constructor(viewId, opt) {
        Object.defineProperty(this, "viewId", {
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
        Object.defineProperty(this, "vNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "opt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // protected scenePath?: string; 
        Object.defineProperty(this, "cameraOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isSafari", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.viewId = viewId;
        this.opt = opt;
        this.dpr = opt.dpr;
        this.scene = this.createScene(opt.offscreenCanvasOpt);
        this.fullLayer = this.createLayer('fullLayer', this.scene, { ...opt.layerOpt, bufferSize: this.viewId === 'mainView' ? 6000 : 3000 });
        this.vNodes = new VNodeManager(viewId, this.scene);
    }
    setIsSafari(isSafari) {
        this.isSafari = isSafari;
    }
    on(msg) {
        const { msgType, toolsType, opt, workId, workState, dataType } = msg;
        switch (msgType) {
            case EPostMessageType.Destroy:
                this.destroy();
                break;
            case EPostMessageType.Clear:
                this.clearAll();
                break;
            case EPostMessageType.UpdateTools:
                if (toolsType && opt) {
                    const param = {
                        toolsType,
                        toolsOpt: opt
                    };
                    this.localWork.setToolsOpt(param);
                }
                break;
            case EPostMessageType.CreateWork:
                if (workId && opt) {
                    if (!this.localWork.getTmpWorkShapeNode() && toolsType) {
                        this.setToolsOpt({
                            toolsType,
                            toolsOpt: opt,
                        });
                    }
                    this.setWorkOpt({
                        workId,
                        toolsOpt: opt
                    });
                }
                break;
            case EPostMessageType.DrawWork:
                if (workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                    this.consumeDrawAll(dataType, msg);
                }
                else {
                    this.consumeDraw(dataType, msg);
                }
                break;
        }
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
            ...opt
        });
    }
    createLayer(name, scene, opt) {
        const { width, height } = opt;
        const sy = `offscreen-${name}`;
        const layer = scene.layer(sy, opt);
        const group = new Group({
            anchor: [0.5, 0.5],
            pos: [width * 0.5, height * 0.5],
            size: [width, height],
            name: 'viewport',
            id: name,
        });
        layer.append(group);
        return group;
    }
    clearAll() {
        if (this.fullLayer) {
            this.fullLayer.parent.children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.fullLayer.removeAllChildren();
        }
        if (this.drawLayer) {
            this.drawLayer.parent.children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.drawLayer.removeAllChildren();
        }
        this.localWork.clearAllWorkShapesCache();
        this.serviceWork?.clearAllWorkShapesCache();
    }
    setToolsOpt(opt) {
        this.localWork.setToolsOpt(opt);
    }
    setWorkOpt(opt) {
        const { workId, toolsOpt } = opt;
        if (workId && toolsOpt) {
            this.localWork.setWorkOptions(workId, toolsOpt);
        }
    }
    destroy() {
        this.vNodes.clear();
        this.scene.remove();
        this.fullLayer.remove();
        this.localWork.destroy();
        this.serviceWork?.destroy();
    }
}
export class LocalWork {
    constructor(opt) {
        Object.defineProperty(this, "viewId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "thread", {
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
        Object.defineProperty(this, "drawLayer", {
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
        Object.defineProperty(this, "workShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "workShapeState", {
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
        Object.defineProperty(this, "drawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.thread = opt.thread;
        this.viewId = opt.viewId;
        this.vNodes = opt.vNodes;
        this.fullLayer = opt.fullLayer;
        this.drawLayer = opt.drawLayer;
        this._post = opt.post;
    }
    destroy() {
        this.workShapeState.clear();
        this.workShapes.clear();
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
        const { toolsType, workId } = opt;
        if (toolsType === EToolsKey.Selector && workId === Cursor_Hover_Id) {
            return getShapeInstance({ ...opt, vNodes: this.vNodes, fullLayer: this.fullLayer, drawLayer: this.fullLayer });
        }
        return getShapeInstance({ ...opt, vNodes: this.vNodes, fullLayer: this.fullLayer, drawLayer: this.drawLayer }, this.thread?.serviceWork);
    }
    setToolsOpt(opt) {
        if (this.tmpOpt?.toolsType !== opt.toolsType) {
            if (this.tmpOpt?.toolsType) {
                this.clearAllWorkShapesCache();
            }
        }
        this.tmpOpt = opt;
        this.tmpWorkShapeNode = this.createWorkShapeNode(opt);
    }
    clearWorkShapeNodeCache(workId) {
        this.getWorkShape(workId)?.clearTmpPoints();
        this.workShapes.delete(workId);
        this.workShapeState.delete(workId);
    }
    clearAllWorkShapesCache() {
        this.workShapes.forEach(w => w.clearTmpPoints());
        this.workShapes.clear();
        this.workShapeState.clear();
    }
    setFullWork(data) {
        const { workId, opt, toolsType } = data;
        if (workId && opt && toolsType) {
            const curWorkShapes = (workId && this.workShapes.get(workId)) || this.createWorkShapeNode({
                toolsOpt: opt,
                toolsType,
                workId
            });
            if (!curWorkShapes) {
                return;
            }
            curWorkShapes.setWorkId(workId);
            this.workShapes.set(workId, curWorkShapes);
            return curWorkShapes;
        }
    }
}
