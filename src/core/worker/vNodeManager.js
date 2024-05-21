import { computRect, isIntersect, isRenderNode } from "../utils";
import cloneDeep from "lodash/cloneDeep";
import { getShapeTools } from "../tools/utils";
import { EToolsKey, EvevtWorkState } from "..";
export class VNodeManager {
    constructor(viewId, scene) {
        Object.defineProperty(this, "viewId", {
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
        Object.defineProperty(this, "scenePath", {
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
            value: new Map()
        });
        Object.defineProperty(this, "targetNodeMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.viewId = viewId;
        this.scene = scene;
    }
    init(fullLayer, drawLayer) {
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    get(name) {
        return this.curNodeMap.get(name);
    }
    hasRenderNodes() {
        let res = false;
        for (const node of this.curNodeMap.values()) {
            if (isRenderNode(node.toolsType))
                res = true;
        }
        return res;
    }
    has(name) {
        this.curNodeMap.has(name);
    }
    setInfo(name, info) {
        const value = this.curNodeMap.get(name) || {
            name,
            rect: info.rect
        };
        if (info.rect) {
            value.rect = cloneDeep(info.rect);
        }
        if (info.op) {
            value.op = cloneDeep(info.op);
        }
        if (info.canRotate) {
            value.canRotate = info.canRotate;
        }
        if (info.scaleType) {
            value.scaleType = info.scaleType;
        }
        if (info.opt) {
            value.opt = cloneDeep(info.opt);
        }
        if (info.toolsType) {
            value.toolsType = info.toolsType;
        }
        if (info.centerPos) {
            value.centerPos = cloneDeep(info.centerPos);
        }
        if (value.rect) {
            this.curNodeMap.set(name, value);
        }
        else {
            this.curNodeMap.delete(name);
        }
        // console.log('setInfo',name, value.opt?.workState,value.opt?.uid)
        // if(value.toolsType === EToolsKey.Text && (value.opt as TextOptions)?.workState === EvevtWorkState.Done){
        //     debugger;
        // }
    }
    delete(name) {
        this.curNodeMap.delete(name);
    }
    clear() {
        this.curNodeMap.clear();
        this.targetNodeMap.length = 0;
        true;
    }
    hasRectIntersectRange(rect, filterLock = true) {
        for (const v of this.curNodeMap.values()) {
            if (isIntersect(rect, v.rect)) {
                if (filterLock && v.toolsType === EToolsKey.Image && v.opt.locked) {
                    continue;
                }
                if (filterLock && v.toolsType === EToolsKey.Text && (v.opt.workState === EvevtWorkState.Doing || v.opt.workState === EvevtWorkState.Start)) {
                    continue;
                }
                return true;
            }
        }
        return false;
    }
    getRectIntersectRange(rect, filterLock = true) {
        let rectRange;
        const nodeRange = new Map();
        for (const [key, v] of this.curNodeMap.entries()) {
            if (isIntersect(rect, v.rect)) {
                if (filterLock && v.toolsType === EToolsKey.Image && v.opt.locked) {
                    continue;
                }
                if (filterLock && v.toolsType === EToolsKey.Text && (v.opt.workState === EvevtWorkState.Doing || v.opt.workState === EvevtWorkState.Start)) {
                    continue;
                }
                rectRange = computRect(rectRange, v.rect);
                nodeRange.set(key, v);
            }
        }
        return {
            rectRange,
            nodeRange
        };
    }
    getNodeRectFormShape(name, value) {
        const shape = getShapeTools(value.toolsType);
        let rect = this.fullLayer && shape?.getRectFromLayer(this.fullLayer, name);
        if (!rect && this.drawLayer) {
            rect = shape?.getRectFromLayer(this.drawLayer, name);
        }
        return rect;
    }
    updateNodesRect() {
        this.curNodeMap.forEach((value, key) => {
            const rect = this.getNodeRectFormShape(key, value);
            if (!rect) {
                this.curNodeMap.delete(key);
            }
            else {
                value.rect = rect;
                // console.log('updateNodesRect1', cloneDeep(rect))
                this.curNodeMap.set(key, value);
            }
        });
        // console.log('updateNodesRect', cloneDeep(this.curNodeMap))
    }
    combineIntersectRect(rect) {
        let _rect = rect;
        this.curNodeMap.forEach(v => {
            if (isIntersect(_rect, v.rect)) {
                _rect = computRect(_rect, v.rect);
            }
        });
        return _rect;
    }
    setTarget() {
        this.targetNodeMap.push(cloneDeep(this.curNodeMap));
        return this.targetNodeMap.length - 1;
    }
    getLastTarget() {
        return this.targetNodeMap[this.targetNodeMap.length - 1];
    }
    deleteLastTarget() {
        this.targetNodeMap.length = this.targetNodeMap.length - 1;
    }
    getTarget(i) {
        return this.targetNodeMap[i];
    }
    deleteTarget(i) {
        this.targetNodeMap.length = i;
    }
}
