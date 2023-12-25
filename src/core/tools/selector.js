import { Path, Rect, Group } from "spritejs";
import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { computRect, getRectFromPoints, isIntersect, isSameArray } from "../utils";
import { Point2d } from "../utils/primitives/Point2d";
import { colorRGBA2Hex } from "../../collector/utils/color";
export class SelectorShape extends BaseShapeTool {
    updataOptService() {
        return;
    }
    constructor(workOptions, fullLayer, drawLayer) {
        super(fullLayer, drawLayer);
        Object.defineProperty(this, "tmpPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Selector
        });
        Object.defineProperty(this, "workOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "syncTimestamp", {
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
        Object.defineProperty(this, "selectIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "oldRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nodeColor", {
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
        Object.defineProperty(this, "worldPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worldScaling", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
        this.worldPosition = this.fullLayer.worldPosition;
        this.worldScaling = this.fullLayer.worldScaling;
    }
    computNodeMap(nodeMaps) {
        this.curNodeMap.clear();
        nodeMaps.forEach(v => {
            const c = v.layer.getElementsByName(v.name)[0];
            if (c) {
                const color = c instanceof Path ? c.getAttribute('strokeColor') : c.getAttribute('bgcolor');
                const gPos = c.worldPosition;
                this.curNodeMap.set(v.name, {
                    name: v.name,
                    rect: v.rect,
                    color: colorRGBA2Hex(color)[0],
                    pos: gPos,
                    rotate: c.getAttribute('rotate') || 0,
                    scale: c.getAttribute('scale') || [1, 1],
                });
            }
        });
        this.fullLayer.children.forEach(c => {
            if (c.name !== SelectorShape.selectorId) {
                const d = this.curNodeMap.get(c.name);
                if (!d) {
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
                        const color = c instanceof Path ? c.getAttribute('strokeColor') : c.getAttribute('bgcolor');
                        this.curNodeMap.set(c.name, {
                            name: c.name,
                            rect,
                            color: colorRGBA2Hex(color)[0],
                            pos: c.getAttribute('pos'),
                            rotate: c.getAttribute('rotate') || 0,
                            scale: c.getAttribute('scale') || [1, 1]
                        });
                        nodeMaps.set(c.name, {
                            rect,
                            name: c.name,
                            layer: c.parent
                        });
                    }
                }
            }
        });
    }
    computSelector() {
        let intersectRect;
        const selectIds = [];
        const subRects = new Map();
        const nodeColors = new Set();
        const subPos = new Map();
        if (this.tmpPoints.length && this.curNodeMap.size) {
            const interRect = getRectFromPoints(this.tmpPoints);
            this.curNodeMap.forEach((item, key) => {
                const localR = {
                    x: item.rect.x,
                    y: item.rect.y,
                    w: item.rect.w,
                    h: item.rect.h
                };
                const localInterRect = {
                    x: interRect.x,
                    y: interRect.y,
                    w: interRect.w,
                    h: interRect.h
                };
                if (isIntersect(localInterRect, localR)) {
                    selectIds.push(key);
                    intersectRect = computRect(intersectRect, localR);
                    subRects.set(key, localR);
                    nodeColors.add(item.color);
                    subPos.set(key, [...item.pos, item.rotate]);
                }
            });
        }
        return {
            selectIds,
            intersectRect,
            subRects,
            nodeColors,
            subPos
        };
    }
    updateTempPoints(globalPoints) {
        const length = this.tmpPoints.length;
        const gl = globalPoints.length;
        if (gl > 1) {
            const nPoint = new Point2d(globalPoints[gl - 2] * this.worldScaling[0] + this.worldPosition[0], globalPoints[gl - 1] * this.worldScaling[0] + this.worldPosition[1]);
            if (length === 2) {
                this.tmpPoints.splice(1, 1, nPoint);
            }
            else {
                this.tmpPoints.push(nPoint);
            }
        }
    }
    draw(data) {
        const { intersectRect, subRects, subPos } = data;
        this.drawLayer?.parent?.getElementById(SelectorShape.selectorId)?.remove();
        if (intersectRect) {
            this.drawLayer && this.drawSelector({
                drawRect: intersectRect,
                subRects,
                subPos,
                selectorId: SelectorShape.selectorId,
                layer: this.drawLayer
            });
        }
        //console.log('draw', this.fullLayer.children)
    }
    consume(props) {
        const { op, workState } = props.data;
        if (workState === EvevtWorkState.Start) {
            this.oldRect = this.backToFullLayer();
            props.nodeMaps && this.computNodeMap(props.nodeMaps);
        }
        if (!op?.length || !this.curNodeMap.size) {
            return { type: EPostMessageType.None };
        }
        this.updateTempPoints(op);
        const result = this.computSelector();
        if (this.selectIds && isSameArray(this.selectIds, result.selectIds)) {
            return { type: EPostMessageType.None };
        }
        this.selectIds = result.selectIds;
        const oldRect = this.drawLayer && this.getSelectorRect(this.drawLayer, SelectorShape.selectorId, true);
        const rect = result.intersectRect && {
            x: result.intersectRect.x - SelectorShape.SelectBorderPadding,
            y: result.intersectRect.y - SelectorShape.SelectBorderPadding,
            w: result.intersectRect.w + SelectorShape.SelectBorderPadding * 2,
            h: result.intersectRect.h + SelectorShape.SelectBorderPadding * 2
        } || undefined;
        this.oldRect = computRect(oldRect, rect);
        this.draw(result);
        this.nodeColor = result.nodeColors.size === 1 ? result.nodeColors.values().next().value : undefined;
        this.oldSelectRect = rect;
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect: this.oldRect,
            selectIds: result.selectIds,
            opt: this.workOptions,
            padding: SelectorShape.SelectBorderPadding,
            selectRect: rect,
            nodeColor: this.nodeColor,
            willSyncService: true,
        };
    }
    consumeAll() {
        if (this.selectIds?.length) {
            this.sealToDrawLayer();
        }
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect: this.oldRect,
            selectIds: this.selectIds,
            opt: this.workOptions,
            padding: SelectorShape.SelectBorderPadding,
            selectRect: this.oldSelectRect,
            nodeColor: this.nodeColor,
            willSyncService: false,
        };
    }
    consumeService() {
    }
    combineConsume() {
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
        // this.curNodeMap.clear();
    }
    clearSelectData() {
        this.selectIds = undefined;
        this.oldRect = undefined;
        this.oldSelectRect = undefined;
    }
    backToFullLayer() {
        let rect;
        const cloneNodes = [];
        const removeNodes = [];
        this.drawLayer?.children.forEach(c => {
            if (c.id !== SelectorShape.selectorId) {
                const cloneP = c.cloneNode(true);
                if (cloneP.tagName === 'GROUP') {
                    cloneP.seal();
                }
                cloneNodes.push(cloneP);
                removeNodes.push(c);
                const r = c?.getBoundingClientRect();
                rect = computRect(rect, {
                    x: Math.floor(r.x),
                    y: Math.floor(r.y),
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                });
            }
        });
        removeNodes.forEach(r => r.remove());
        cloneNodes.length && this.fullLayer.append(...cloneNodes);
        if (rect) {
            rect.x -= SelectorShape.SelectBorderPadding;
            rect.y -= SelectorShape.SelectBorderPadding;
            rect.w += SelectorShape.SelectBorderPadding * 2;
            rect.h += SelectorShape.SelectBorderPadding * 2;
        }
        //console.log('backToFullLayer', rect, this.drawLayer?.children.map(c=>c.name), this.fullLayer.children.map(c=>c.name))
        return rect;
    }
    sealToDrawLayer() {
        const cloneNodes = [];
        const removeNodes = [];
        this.selectIds?.forEach(name => {
            this.fullLayer.getElementsByName(name.toString()).forEach(c => {
                const cloneP = c.cloneNode(true);
                if (cloneP.tagName === 'GROUP') {
                    cloneP.seal();
                }
                cloneNodes.push(cloneP);
                removeNodes.push(c);
            });
        });
        removeNodes.forEach(r => r.remove());
        cloneNodes && this.drawLayer?.append(...cloneNodes);
        //console.log('sealToDrawLayer1', this.oldRect, this.fullLayer.children.map(c=>c.name), this.drawLayer?.children.map(c=>c.name))
    }
    updateSelectorSize(g, w, h) {
        const selectGlobalPos = new Map();
        const gPos = g.getAttribute('pos');
        const size = g.className.split(',');
        const width = w - SelectorShape.SelectBorderPadding * 2;
        const height = h - SelectorShape.SelectBorderPadding * 2;
        const scale = size.length === 2 && [width / Number(size[0]), height / Number(size[1])] || [1, 1];
        // console.log('g', scale, gPos)
        g.setAttribute('size', [width, height]);
        g.children.forEach(c => {
            if (c.id === SelectorShape.selectorBorderId) {
                c.setAttribute('pos', [width / 2, height / 2]);
                c.setAttribute('width', width);
                c.setAttribute('height', height);
            }
            else if (scale) {
                const arr = c.className.split(',');
                const newPos = [Number(arr[0]) * scale[0], Number(arr[1]) * scale[1]];
                // const oldPos:[number,number]= c.getAttribute('pos');
                const oldWidth = c.getAttribute('width');
                const oldHeight = c.getAttribute('height');
                const newWidth = Number(arr[2]) * scale[0];
                const newHeight = Number(arr[3]) * scale[1];
                c.setAttribute('pos', newPos);
                c.setAttribute('width', newWidth);
                c.setAttribute('height', newHeight);
                const name = c.id.split('selector-')[1];
                if (name) {
                    const newPathPos = [newPos[0] + gPos[0], newPos[1] + gPos[1]];
                    const newScale = [
                        newWidth / oldWidth,
                        newHeight / oldHeight
                    ];
                    selectGlobalPos.set(name, [
                        newPathPos[0],
                        newPathPos[1],
                        newScale[0],
                        newScale[1]
                    ]);
                    // console.log('selectGlobalPos',newPos, gPos, newScale, selectGlobalPos)
                }
            }
        });
        return selectGlobalPos;
    }
    updateSelectorRect(g, rect) {
        const { w, h, x, y } = rect;
        const width = w - SelectorShape.SelectBorderPadding * 2;
        const height = h - SelectorShape.SelectBorderPadding * 2;
        const X = x + SelectorShape.SelectBorderPadding;
        const Y = y + SelectorShape.SelectBorderPadding;
        g.setAttribute('size', [w, h]);
        g.setAttribute('pos', [X, Y]);
        g.setAttribute('className', `${rect.w},${rect.h}`);
        g.children.forEach(c => {
            // 目前只能一个元素做旋转
            c.setAttribute('pos', [width / 2, height / 2]);
            c.setAttribute('width', width);
            c.setAttribute('height', height);
            if (c.id === SelectorShape.selectorBorderId) {
                c.setAttribute('className', `${rect.w / 2},${rect.h / 2},${rect.w},${rect.h}`);
            }
            else {
                const arr = c.className.split(',');
                const oldRotate = arr && Number(arr[4]) || 0;
                c.setAttribute('className', `${width / 2},${height / 2},${rect.w},${rect.h},${oldRotate}`);
            }
        });
    }
    getSelectorRect(layer, selectorId, hasPadding) {
        let rect;
        const selector = layer.parent?.getElementsByName(selectorId)[0];
        const box = selector?.getElementById(SelectorShape.selectorBorderId);
        const r = box?.getBoundingClientRect();
        if (r) {
            rect = computRect(rect, {
                x: Math.floor(r.x),
                y: Math.floor(r.y),
                w: Math.round(r.width),
                h: Math.round(r.height),
            });
        }
        //console.log('getSelectorRect', rect)
        if (rect && hasPadding)
            return {
                x: rect.x - SelectorShape.SelectBorderPadding,
                y: rect.y - SelectorShape.SelectBorderPadding,
                w: rect.w + SelectorShape.SelectBorderPadding * 2,
                h: rect.h + SelectorShape.SelectBorderPadding * 2
            };
        return rect;
    }
    updateSelector(param) {
        const { updateSelectorOpt, selectIds } = param;
        let rect;
        const updateNodeOpts = new Map();
        // let scale: [number, number] | undefined;
        let selectGlobalPos;
        const g = this.drawLayer?.parent?.getElementById(SelectorShape.selectorId);
        if (g) {
            let translate;
            if (updateSelectorOpt.pos) {
                const globalPoints = [
                    updateSelectorOpt.pos[0] * this.worldScaling[0] + this.worldPosition[0],
                    updateSelectorOpt.pos[1] * this.worldScaling[1] + this.worldPosition[1]
                ];
                const gPos = g.getAttribute('pos');
                translate = [globalPoints[0] - gPos[0], globalPoints[1] - gPos[1]];
                g.setAttribute('pos', globalPoints);
            }
            if (updateSelectorOpt.selectorColor) {
                g.getElementById(SelectorShape.selectorBorderId)?.setAttribute('strokeColor', updateSelectorOpt.selectorColor);
            }
            if (updateSelectorOpt.size) {
                selectGlobalPos = this.updateSelectorSize(g, updateSelectorOpt.size.width, updateSelectorOpt.size.height);
            }
            if (updateSelectorOpt.angle) {
                selectIds?.forEach((name) => {
                    this.drawLayer?.getElementsByName(name).forEach((c) => {
                        if (c) {
                            const itemOpt = {
                                useAnimation: false
                            };
                            if (updateSelectorOpt.angle) {
                                itemOpt.angle = updateSelectorOpt.angle;
                                itemOpt.originPos = c.className.split(',').map(c => Number(c));
                                c.setAttribute('rotate', itemOpt.angle);
                            }
                            updateNodeOpts.set(c.name, itemOpt);
                            const r = c?.getBoundingClientRect();
                            rect = computRect(rect, {
                                x: Math.floor(r.x),
                                y: Math.floor(r.y),
                                w: Math.round(r.width),
                                h: Math.round(r.height),
                            });
                        }
                    });
                }, this);
            }
            else {
                selectIds?.forEach((name) => {
                    this.drawLayer?.getElementsByName(name).forEach((c) => {
                        if (c) {
                            const itemOpt = {
                                useAnimation: false
                            };
                            if (updateSelectorOpt.pos && translate) {
                                const cPos = c.getAttribute('pos');
                                itemOpt.pos = [translate[0] / this.worldScaling[0] + cPos[0], translate[1] / this.worldScaling[0] + cPos[1]];
                                itemOpt.originPos = c.className.split(',').map(c => Number(c));
                                // console.log('translate', translate, cPos, itemOpt.pos, itemOpt.originPos )
                                c.setAttribute('pos', itemOpt.pos);
                            }
                            if (updateSelectorOpt.zIndexDistance || updateSelectorOpt.zIndex) {
                                if (updateSelectorOpt.zIndexDistance) {
                                    const ZIndex = c.getAttribute('zIndex');
                                    itemOpt.zIndex = ZIndex + updateSelectorOpt.zIndexDistance;
                                }
                                else {
                                    itemOpt.zIndex = updateSelectorOpt.zIndex;
                                }
                                c.setAttribute('zIndex', itemOpt.zIndex);
                            }
                            if (updateSelectorOpt.color) {
                                itemOpt.color = updateSelectorOpt.color;
                                c.setAttribute('strokeColor', itemOpt.color);
                                if (c.getAttribute('fillColor')) {
                                    c.setAttribute('fillColor', itemOpt.color);
                                }
                            }
                            if (updateSelectorOpt.opacity) {
                                itemOpt.opacity = updateSelectorOpt.opacity;
                                c.setAttribute('opacity', itemOpt.opacity);
                            }
                            const select = selectGlobalPos?.get(c.name);
                            if (select) {
                                const oldScale = c.getAttribute('scale');
                                // console.log('oldScale', oldScale)
                                const scale = [
                                    select[2] * oldScale[0],
                                    select[3] * oldScale[1]
                                ];
                                itemOpt.originPos = c.className.split(',').map(c => Number(c));
                                itemOpt.pos = [(select[0] - this.worldPosition[0]) / this.worldScaling[0], (select[1] - this.worldPosition[1]) / this.worldScaling[1]];
                                // console.log('select', select, itemOpt.pos)
                                itemOpt.scale = scale;
                                c.setAttribute('pos', itemOpt.pos);
                                c.setAttribute('scale', itemOpt.scale);
                            }
                            updateNodeOpts.set(c.name, itemOpt);
                        }
                    });
                }, this);
                const box = g.getElementById(SelectorShape.selectorBorderId);
                const r = box?.getBoundingClientRect();
                if (r) {
                    rect = computRect(rect, {
                        x: Math.floor(r.x),
                        y: Math.floor(r.y),
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                    });
                }
                // console.log('box', r, rect)
            }
        }
        if (rect) {
            rect.x -= SelectorShape.SelectBorderPadding;
            rect.y -= SelectorShape.SelectBorderPadding;
            rect.w += SelectorShape.SelectBorderPadding * 2;
            rect.h += SelectorShape.SelectBorderPadding * 2;
            if (updateSelectorOpt.angle) {
                this.updateSelectorRect(g, rect);
            }
            this.oldRect = computRect(this.oldRect, rect);
            this.oldSelectRect = rect;
            // console.log('updateSelector', rect)
            return {
                type: EPostMessageType.UpdateNode,
                dataType: EDataType.Local,
                rect: rect,
                updateNodeOpts,
            };
        }
        return;
    }
    blurSelector() {
        const rect = this.backToFullLayer();
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect,
            selectIds: [],
        };
    }
    getRightServiceId(serviceWorkId) {
        return serviceWorkId.replace("++++", '-');
    }
    drawSelector(data) {
        const { drawRect, subRects, subPos, selectorId, layer } = data;
        // console.log('draw', drawRect, subRects)
        const group = new Group({
            pos: [drawRect.x, drawRect.y],
            anchor: [0, 0],
            size: [drawRect.w, drawRect.h],
            className: `${drawRect.w},${drawRect.h}`,
            id: selectorId,
            name: SelectorShape.selectorId,
            zIndex: 1000
        });
        const childrenNode = [];
        const rectNode = new Rect({
            normalize: true,
            pos: [drawRect.w / 2, drawRect.h / 2],
            lineWidth: 1,
            strokeColor: this.workOptions.color,
            width: drawRect.w,
            height: drawRect.h,
            className: `${drawRect.w / 2},${drawRect.h / 2},${drawRect.w},${drawRect.h}`,
            id: SelectorShape.selectorBorderId
        });
        childrenNode.push(rectNode);
        subRects.forEach((item, key) => {
            const pathPos = subPos?.get(key);
            if (pathPos) {
                // console.log('subRects', pathPos, drawRect)
                const rectPos = [pathPos[0] - drawRect.x, pathPos[1] - drawRect.y];
                const className = `${rectPos[0]},${rectPos[1]},${item.w},${item.h},${pathPos[2]}`;
                const subNode = new Rect({
                    normalize: true,
                    pos: rectPos,
                    lineWidth: 1,
                    strokeColor: subRects.size > 1 ? this.workOptions.color : undefined,
                    width: item.w,
                    height: item.h,
                    className,
                    id: `selector-${key}`,
                    name: `selector-${key}`
                });
                childrenNode.push(subNode);
            }
        });
        childrenNode && group.append(...childrenNode);
        // layer.appendChild(group);
        (layer?.parent).appendChild(group);
        // console.log('layer?.parent', layer?.parent)
    }
    selectServiceNode(workId, workItem) {
        const { selectIds } = workItem;
        const rightWorkId = this.getRightServiceId(workId);
        const oldRect = this.getSelectorRect(this.fullLayer, rightWorkId, true);
        this.fullLayer.parent.getElementById(rightWorkId)?.remove();
        //console.log('oldRect', oldRect)
        let rect;
        const subRects = new Map();
        const subPos = new Map();
        selectIds?.forEach(name => {
            this.fullLayer.getElementsByName(name).forEach(f => {
                const b = f?.getBoundingClientRect();
                if (b) {
                    const r = {
                        x: Math.floor(b.x),
                        y: Math.floor(b.y),
                        w: Math.round(b.width),
                        h: Math.round(b.height),
                    };
                    rect = computRect(rect, r);
                    subRects.set(name, r);
                    const gPos = f.worldPosition;
                    const rotate = f.getAttribute('rotate') || 0;
                    subPos.set(name, [...gPos, rotate]);
                }
            });
        });
        //console.log('rect', rect, subRects)
        if (rect) {
            this.fullLayer && this.drawSelector({
                drawRect: rect,
                subRects,
                subPos,
                selectorId: rightWorkId,
                layer: this.fullLayer
            });
            // this.draw({
            //     intersectRect: rect,
            //     subRects,
            //     subPos
            // });
        }
        rect = computRect(rect, oldRect);
        if (rect) {
            rect.x -= SelectorShape.SelectBorderPadding;
            rect.y -= SelectorShape.SelectBorderPadding;
            rect.w += SelectorShape.SelectBorderPadding * 2;
            rect.h += SelectorShape.SelectBorderPadding * 2;
        }
        return rect;
    }
    removeService() {
        throw new Error("Method not implemented.");
    }
    getSelector(nodeMaps) {
        let rect;
        const subRects = new Map();
        // const nodeColors:Set<string> = new Set();
        const subPos = new Map();
        this.selectIds?.forEach((name) => {
            const nodeMap = nodeMaps.get(name);
            const node = this.drawLayer?.getElementsByName(name)[0];
            if (nodeMap && node) {
                // const color = node instanceof Path ? node.getAttribute('strokeColor') : node.getAttribute('bgcolor');
                // const lPos = node.getAttribute('pos');
                const gPos = node.worldPosition;
                const rotate = node.getAttribute('rotate') || 0;
                rect = computRect(rect, nodeMap.rect);
                subRects.set(name, nodeMap.rect);
                // nodeColors.add(color);
                subPos.set(name, [...gPos, rotate]);
            }
        }, this);
        this.oldRect = computRect(rect, this.oldRect);
        // console.log('subRects111', nodeMaps, subRects, subPos)
        this.draw({
            intersectRect: rect,
            subRects,
            subPos
        });
        this.oldSelectRect = rect;
        return rect;
    }
}
Object.defineProperty(SelectorShape, "selectorId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'selector'
});
Object.defineProperty(SelectorShape, "selectorBorderId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'selector-border'
});
Object.defineProperty(SelectorShape, "SelectBorderPadding", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 2
});
