import { Rect, Group } from "spritejs";
import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { computRect, getRectFromPoints, isSameArray, isSealedGroup } from "../utils";
import { Point2d } from "../utils/primitives/Point2d";
import { Storage_Selector_key } from "../../collector/const";
import { getShapeTools } from ".";
import isNumber from "lodash/isNumber";
export class SelectorShape extends BaseShapeTool {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Selector
        });
        Object.defineProperty(this, "tmpPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "workOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "selectIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "selectorColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "strokeColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fillColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "oldSelectRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canRotate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "canTextEdit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "scaleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EScaleType.all
        });
        Object.defineProperty(this, "textOpt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.workOptions = props.toolsOpt;
    }
    computSelector() {
        const interRect = getRectFromPoints(this.tmpPoints);
        const { rectRange, nodeRange } = this.vNodes.getRectIntersectRange(interRect);
        return {
            selectIds: [...nodeRange.keys()],
            intersectRect: rectRange,
            subNodeMap: nodeRange
        };
    }
    updateTempPoints(globalPoints) {
        const length = this.tmpPoints.length;
        const gl = globalPoints.length;
        if (gl > 1) {
            const nPoint = new Point2d(globalPoints[gl - 2] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0], globalPoints[gl - 1] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[1]);
            if (length === 2) {
                this.tmpPoints.splice(1, 1, nPoint);
            }
            else {
                this.tmpPoints.push(nPoint);
            }
        }
    }
    drawSelector(data) {
        const { drawRect, subNodeMap, selectorId, layer } = data;
        const group = new Group({
            pos: [drawRect.x, drawRect.y],
            anchor: [0, 0],
            size: [drawRect.w, drawRect.h],
            id: selectorId,
            name: SelectorShape.selectorId,
            zIndex: 1000
        });
        const childrenNode = [];
        const rectNode = new Rect({
            normalize: true,
            pos: [drawRect.w / 2, drawRect.h / 2],
            lineWidth: 1,
            strokeColor: this.workOptions.strokeColor,
            width: drawRect.w - 2,
            height: drawRect.h - 2,
            name: SelectorShape.selectorBorderId
        });
        childrenNode.push(rectNode);
        subNodeMap.forEach((item, key) => {
            const rectPos = [
                item.rect.x + item.rect.w / 2 - drawRect.x,
                item.rect.y + item.rect.h / 2 - drawRect.y,
            ];
            const subNode = new Rect({
                normalize: true,
                pos: rectPos,
                lineWidth: 1,
                strokeColor: subNodeMap.size > 1 ? this.workOptions.strokeColor : undefined,
                width: item.rect.w,
                height: item.rect.h,
                id: `selector-${key}`,
                name: `selector-${key}`
            });
            childrenNode.push(subNode);
        });
        childrenNode && group.append(...childrenNode);
        (layer?.parent).appendChild(group);
    }
    draw(selectorId, layer, data) {
        const { intersectRect, subNodeMap } = data;
        layer.parent?.getElementById(selectorId)?.remove();
        if (intersectRect) {
            this.drawSelector({
                drawRect: intersectRect,
                subNodeMap,
                selectorId,
                layer
            });
        }
    }
    getSelecteorInfo(subNodeMap) {
        for (const item of subNodeMap.values()) {
            const { opt, canRotate, scaleType, toolsType } = item;
            this.selectorColor = this.workOptions.strokeColor;
            this.strokeColor = opt.strokeColor;
            if (opt.fillColor) {
                this.fillColor = opt.fillColor;
            }
            if (opt.textOpt) {
                this.textOpt = opt.textOpt;
            }
            if (toolsType === EToolsKey.Text) {
                this.textOpt = opt;
            }
            if (subNodeMap.size === 1) {
                if (this.textOpt) {
                    this.canTextEdit = true;
                }
                this.canRotate = canRotate;
                this.scaleType = scaleType;
            }
            else if (scaleType === EScaleType.none) {
                this.scaleType = scaleType;
            }
        }
    }
    consume(props) {
        const { op, workState } = props.data;
        let oldRect = this.oldSelectRect;
        if (workState === EvevtWorkState.Start) {
            oldRect = this.backToFullLayer();
        }
        if (!op?.length || !this.vNodes.curNodeMap.size) {
            return { type: EPostMessageType.None };
        }
        this.updateTempPoints(op);
        const result = this.computSelector();
        if (this.selectIds && isSameArray(this.selectIds, result.selectIds)) {
            return { type: EPostMessageType.None };
        }
        this.selectIds = result.selectIds;
        const rect = result.intersectRect;
        this.draw(SelectorShape.selectorId, this.drawLayer || this.fullLayer, result);
        this.getSelecteorInfo(result.subNodeMap);
        this.oldSelectRect = rect;
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect: computRect(rect, oldRect),
            selectIds: result.selectIds,
            opt: this.workOptions,
            selectRect: rect,
            selectorColor: this.selectorColor,
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            textOpt: this.textOpt,
            canTextEdit: this.canTextEdit,
            canRotate: this.canRotate,
            scaleType: this.scaleType,
            willSyncService: true
        };
    }
    consumeAll() {
        if (this.selectIds?.length) {
            this.sealToDrawLayer(this.selectIds);
        }
        if (this.oldSelectRect) {
            return {
                type: EPostMessageType.Select,
                dataType: EDataType.Local,
                rect: this.oldSelectRect,
                selectIds: this.selectIds,
                opt: this.workOptions,
                selectRect: this.oldSelectRect,
                strokeColor: this.strokeColor,
                fillColor: this.fillColor,
                textOpt: this.textOpt,
                canTextEdit: this.canTextEdit,
                canRotate: this.canRotate,
                scaleType: this.scaleType,
                willSyncService: false
            };
        }
        return {
            type: EPostMessageType.None
        };
    }
    consumeService() {
        return;
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
    }
    clearSelectData() {
        this.selectIds = undefined;
        this.oldSelectRect = undefined;
    }
    backToFullLayer(backToFullIds) {
        let rect;
        const cloneNodes = [];
        const removeNodes = [];
        // console.log('this.fullLayer-1', this.fullLayer.children.length, this.drawLayer?.children.length, backToFullIds)
        for (const c of this.drawLayer?.children || []) {
            if (backToFullIds?.length && !backToFullIds.includes(c.id)) {
                continue;
            }
            if (c.id !== SelectorShape.selectorId) {
                const cloneP = c.cloneNode(true);
                if (isSealedGroup(c)) {
                    cloneP.seal();
                }
                if (!this.fullLayer.getElementsByName(c.name).length) {
                    cloneNodes.push(cloneP);
                }
                removeNodes.push(c);
                const r = this.vNodes.get(c.name)?.rect;
                if (r) {
                    rect = computRect(rect, r);
                }
            }
        }
        removeNodes.forEach(r => r.remove());
        cloneNodes.length && this.fullLayer.append(...cloneNodes);
        // console.log('this.fullLayer', this.fullLayer.children.length, this.drawLayer?.children.length)
        return rect;
    }
    sealToDrawLayer(sealToDrawIds) {
        const cloneNodes = [];
        const removeNodes = [];
        // console.log('this.drawLayer-1', this.drawLayer?.children.length, sealToDrawIds, this.fullLayer.children.length)
        sealToDrawIds.forEach(name => {
            this.fullLayer.getElementsByName(name.toString()).forEach(c => {
                // console.log('this.drawLayer-2', c.tagName)
                const cloneP = c.cloneNode(true);
                if (isSealedGroup(c)) {
                    cloneP.seal();
                }
                if (!this.drawLayer?.getElementsByName(c.name).length) {
                    cloneNodes.push(cloneP);
                }
                removeNodes.push(c);
            });
        });
        removeNodes.forEach(r => r.remove());
        cloneNodes && this.drawLayer?.append(...cloneNodes);
        // console.log('this.drawLayer', this.drawLayer?.children.length, this.drawLayer?.children.length)
    }
    getSelectorRect(layer, selectorId) {
        let rect;
        const selector = layer.parent?.getElementById(selectorId);
        // const box = selector?.getElementById(SelectorShape.selectorBorderId);
        const r = selector?.getBoundingClientRect();
        if (r) {
            rect = computRect(rect, {
                x: Math.floor(r.x),
                y: Math.floor(r.y),
                w: Math.round(r.width),
                h: Math.round(r.height),
            });
        }
        return rect;
    }
    isCanFillColor(toolsType) {
        if (toolsType === EToolsKey.Ellipse || toolsType === EToolsKey.Triangle ||
            toolsType === EToolsKey.Rectangle || toolsType === EToolsKey.Polygon ||
            toolsType === EToolsKey.Star || toolsType === EToolsKey.SpeechBalloon) {
            return true;
        }
        return false;
    }
    updateSelector(param) {
        const { updateSelectorOpt, selectIds, vNodes, willSerializeData, worker } = param;
        const layer = this.drawLayer;
        if (!layer) {
            return;
        }
        let intersectRect;
        const subNodeMap = new Map();
        const { box, workState, angle, translate } = updateSelectorOpt;
        let _translate = [0, 0];
        let scale = [1, 1];
        let targetRectCenter = [0, 0];
        let targetNodes;
        if (box || translate || isNumber(angle)) {
            if (workState === EvevtWorkState.Start) {
                vNodes.setTarget();
                return {
                    type: EPostMessageType.Select,
                    dataType: EDataType.Local,
                    selectRect: this.oldSelectRect,
                    rect: this.oldSelectRect
                };
            }
            targetNodes = vNodes.getLastTarget();
            if (targetNodes && box) {
                let targetRect;
                selectIds?.forEach((name) => {
                    const targetNode = targetNodes?.get(name);
                    targetRect = computRect(targetRect, targetNode?.rect);
                });
                if (targetRect) {
                    scale = [box.w / targetRect.w, box.h / targetRect.h];
                    _translate = [(box.x + box.w / 2) - (targetRect.x + targetRect.w / 2), (box.y + box.h / 2) - (targetRect.y + targetRect.h / 2)];
                    targetRectCenter = [targetRect.x + targetRect.w / 2, targetRect.y + targetRect.h / 2];
                }
            }
        }
        selectIds?.forEach((name) => {
            const info = vNodes.get(name);
            if (info) {
                const { toolsType } = info;
                let node = (layer?.getElementsByName(name))[0];
                if (node) {
                    const itemOpt = { ...updateSelectorOpt };
                    let targetNode;
                    if (toolsType) {
                        if (targetNodes) {
                            targetNode = targetNodes.get(name);
                            if (targetNode && box) {
                                itemOpt.boxScale = scale;
                                const subCenter = [(targetNode.rect.x + targetNode.rect.w / 2), (targetNode.rect.y + targetNode.rect.h / 2)];
                                const oldDistance = [subCenter[0] - targetRectCenter[0], subCenter[1] - targetRectCenter[1]];
                                itemOpt.boxTranslate = [oldDistance[0] * (scale[0] - 1) + _translate[0], oldDistance[1] * (scale[1] - 1) + _translate[1]];
                            }
                        }
                        const shape = getShapeTools(toolsType);
                        shape?.updateNodeOpt({
                            node,
                            opt: itemOpt,
                            vNodes,
                            willSerializeData,
                            targetNode,
                        });
                        if (info && worker && ((willSerializeData && (itemOpt.angle || itemOpt.translate)) ||
                            (itemOpt.box && itemOpt.workState !== EvevtWorkState.Start))) {
                            const workShape = worker.createWorkShapeNode({
                                toolsType,
                                toolsOpt: info.opt
                            });
                            workShape?.setWorkId(name);
                            const r = workShape?.consumeService({
                                op: info.op,
                                isFullWork: false,
                                replaceId: name,
                                isClearAll: false
                            });
                            if (r) {
                                info.rect = r;
                                vNodes.setInfo(name, info);
                            }
                            node = (layer?.getElementsByName(name))[0];
                        }
                        if (info) {
                            subNodeMap.set(name, info);
                            intersectRect = computRect(intersectRect, info.rect);
                        }
                    }
                }
            }
        }, this);
        if (targetNodes && workState === EvevtWorkState.Done) {
            vNodes.deleteLastTarget();
        }
        this.draw(SelectorShape.selectorId, layer, {
            selectIds: selectIds || [],
            subNodeMap,
            intersectRect
        });
        const rect = computRect(this.oldSelectRect, intersectRect);
        this.oldSelectRect = intersectRect;
        // console.log('intersectRect', intersectRect)
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            selectRect: intersectRect,
            rect
        };
    }
    blurSelector() {
        const rect = this.backToFullLayer();
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect,
            selectIds: [],
            willSyncService: true,
        };
    }
    getRightServiceId(serviceWorkId) {
        return serviceWorkId.replace("++", '-');
    }
    selectServiceNode(workId, workItem) {
        const { selectIds } = workItem;
        const rightWorkId = this.getRightServiceId(workId);
        const oldRect = this.getSelectorRect(this.fullLayer, rightWorkId);
        let intersectRect;
        const subNodeMap = new Map();
        selectIds?.forEach(name => {
            const c = this.vNodes.get(name);
            const f = this.fullLayer.getElementsByName(name)[0];
            if (c && f) {
                intersectRect = computRect(intersectRect, c.rect);
                subNodeMap.set(name, c);
            }
        });
        this.draw(rightWorkId, this.fullLayer, {
            intersectRect,
            selectIds: selectIds || [],
            subNodeMap
        });
        return computRect(intersectRect, oldRect);
    }
    reRenderSelector() {
        let intersectRect;
        const subNodeMap = new Map();
        this.selectIds?.forEach((name) => {
            const nodeMap = this.vNodes.get(name);
            intersectRect = computRect(intersectRect, nodeMap?.rect);
        }, this);
        this.draw(SelectorShape.selectorId, this.drawLayer || this.fullLayer, {
            intersectRect,
            subNodeMap,
            selectIds: this.selectIds || []
        });
        this.getSelecteorInfo(subNodeMap);
        this.oldSelectRect = intersectRect;
        return intersectRect;
    }
    updateSelectIds(nextSelectIds) {
        let bgRect;
        const backToFullIds = this.selectIds?.filter(id => !nextSelectIds.includes(id));
        const sealToDrawIds = nextSelectIds.filter(id => !this.selectIds?.includes(id));
        if (backToFullIds?.length) {
            bgRect = this.backToFullLayer(backToFullIds);
        }
        if (sealToDrawIds.length) {
            this.sealToDrawLayer(sealToDrawIds);
            for (const id of sealToDrawIds) {
                const r = this.vNodes.get(id)?.rect;
                if (r) {
                    bgRect = computRect(bgRect, r);
                }
            }
        }
        this.selectIds = nextSelectIds;
        const selectRect = this.reRenderSelector();
        return {
            bgRect,
            selectRect
        };
    }
}
Object.defineProperty(SelectorShape, "selectorId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Storage_Selector_key
});
Object.defineProperty(SelectorShape, "selectorBorderId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'selector-border'
});
