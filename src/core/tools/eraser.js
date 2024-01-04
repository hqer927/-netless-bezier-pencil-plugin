import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { computRect, isIntersect } from "../utils";
// import { EStrokeType } from "../../plugin/types";
import { transformToNormalData } from "../../collector/utils";
import { Vec2d } from "../utils/primitives/Vec2d";
import lineclip from "lineclip";
import { EStrokeType } from "../../plugin/types";
export class EraserShape extends BaseShapeTool {
    updataOptService() {
        return;
    }
    constructor(workOptions, fullLayer) {
        super(fullLayer);
        Object.defineProperty(this, "syncTimestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Eraser
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
        Object.defineProperty(this, "removeIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
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
        Object.defineProperty(this, "eraserRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eraserPolyline", {
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
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
        this.worldPosition = this.fullLayer.worldPosition;
        this.worldScaling = this.fullLayer.worldScaling;
    }
    computNodeMap(nodeMaps) {
        this.curNodeMap.clear();
        nodeMaps.forEach(v => {
            const c = this.fullLayer.getElementsByName(v.name)[0];
            const op = v.ops && transformToNormalData(v.ops);
            if (c && op.length) {
                const polyline = [];
                for (let i = 0; i < op.length; i += 3) {
                    const p = new Vec2d(op[i] * this.worldScaling[0] + this.worldPosition[0], op[i + 1] * this.worldScaling[1] + this.worldPosition[1], op[i + 2]);
                    polyline.push(p);
                }
                let opt = v.opt;
                if (!opt) {
                    let color = c.getAttribute('strokeColor');
                    const className = c.className.split(',');
                    const strokeType = Number(className[2]);
                    if (c.tagName === "GROUP") {
                        if (strokeType === EStrokeType.Stroke) {
                            color = c.getAttribute('bgcolor');
                        }
                        else {
                            color = c.children[0].getAttribute('strokeColor');
                        }
                    }
                    const opacity = c.getAttribute('opacity');
                    const scale = c.getAttribute('scale');
                    const zIndex = c.getAttribute('zIndex');
                    const rotate = c.getAttribute('rotate');
                    const syncUnitTime = this.workOptions.syncUnitTime;
                    opt = {
                        color,
                        opacity,
                        syncUnitTime,
                        zIndex,
                        scale,
                        rotate,
                        strokeType,
                    };
                }
                this.curNodeMap.set(v.name, {
                    name: v.name,
                    rect: v.rect,
                    polyline,
                    opt,
                    toolsType: v.toolsType || EToolsKey.Pencil
                });
            }
        });
    }
    updataNodeMap(key, value) {
        const op = value.op;
        const polyline = [];
        for (let i = 0; i < op.length; i += 3) {
            const p = new Vec2d(op[i] * this.worldScaling[0] + this.worldPosition[0], op[i + 1] * this.worldScaling[1] + this.worldPosition[1], op[i + 2]);
            polyline.push(p);
        }
        this.curNodeMap.set(key, {
            name: value.name,
            rect: value.rect,
            polyline,
            opt: value.opt,
            toolsType: value.toolsType || EToolsKey.Pencil
        });
    }
    combineConsume() {
        return undefined;
    }
    createEraserRect(point) {
        const x = point[0] * this.worldScaling[0] + this.worldPosition[0];
        const y = point[1] * this.worldScaling[1] + this.worldPosition[1];
        const { width, height } = EraserShape.eraserSizes[this.workOptions.thickness];
        this.eraserRect = {
            x: x - width * 0.5,
            y: y - height * 0.5,
            w: width,
            h: height,
        };
        this.eraserPolyline = [this.eraserRect.x, this.eraserRect.y, this.eraserRect.x + this.eraserRect.w, this.eraserRect.y + this.eraserRect.h];
    }
    consumeService() {
        return undefined;
    }
    setWorkOptions(setWorkOptions) {
        super.setWorkOptions(setWorkOptions);
        this.syncTimestamp = Date.now();
    }
    consume(props) {
        const { op, workState } = props.data;
        if (!op || op.length === 0) {
            return { type: EPostMessageType.None };
        }
        if (workState === EvevtWorkState.Start) {
            props.nodeMaps && this.computNodeMap(props.nodeMaps);
        }
        if (this.isSamePoint([op[0], op[1]], [this.tmpPoints[0], this.tmpPoints[1]])) {
            return { type: EPostMessageType.None };
        }
        if (props.nodeMaps) {
            this.tmpPoints = op;
            this.createEraserRect(op);
            const { rect, removeIds, newWorkDatas } = this.remove();
            if (rect && removeIds.length) {
                return {
                    type: EPostMessageType.RemoveNode,
                    dataType: EDataType.Local,
                    rect,
                    removeIds,
                    newWorkDatas
                };
            }
        }
        return {
            type: EPostMessageType.None
        };
    }
    cutPolyline(inters, polyline) {
        let result = [polyline];
        let i = 0;
        while (i < inters.length) {
            const cur = inters[i];
            if (cur.length < 2) {
                break;
            }
            result = cutOneLine(result, cur);
            i++;
        }
        return result;
        function cutOneLine(polylines, interOne) {
            const result = polylines;
            for (let i = 0; i < polylines.length; i++) {
                const line = polylines[i];
                const index = line.findIndex((l, i) => {
                    if (i < line.length - 1) {
                        return isSameLine([l, line[i + 1]], [interOne[0], interOne[1]]);
                    }
                    return false;
                });
                if (index === -1) {
                    continue;
                }
                if (index > -1) {
                    const r = [];
                    const firstLine = line.slice(0, index + 1);
                    if (!Vec2d.Equals(line[index], interOne[0])) {
                        firstLine.push(interOne[0].clone().setz(line[index].z));
                    }
                    if (firstLine.length > 1) {
                        r.push(firstLine);
                    }
                    if (index + interOne.length - 1 < line.length - 1) {
                        const lastIndex = index + interOne.length - 1;
                        const endLine = line.slice(lastIndex);
                        const lastPoint = interOne[interOne.length - 1];
                        if (!Vec2d.Equals(line[lastIndex], lastPoint)) {
                            endLine.unshift(lastPoint.clone().setz(line[lastIndex].z));
                        }
                        if (endLine.length > 1) {
                            r.push(endLine);
                        }
                    }
                    result.splice(i, 1, ...r);
                    return result;
                }
            }
            return result;
        }
        function isSameLine(line1, line2) {
            // console.log('isSameLine1', line1, line2)
            const Vec1 = Vec2d.Sub(line1[1], line1[0]);
            const Vec2 = Vec2d.Sub(line2[1], line2[0]);
            const Vec3 = Vec2d.Sub(line2[0], line1[0]);
            // console.log('isSameLine', Vec1, Vec2, Vec3)
            if (Math.abs(Vec2d.Cpr(Vec1, Vec2)) < 0.1 && Math.abs(Vec2d.Cpr(Vec1, Vec3)) < 0.1) {
                return true;
            }
            return false;
        }
    }
    isSamePoint(p1, p2) {
        return p1[0] === p2[0] && p1[1] === p2[1];
    }
    translateIntersect(intersect) {
        const res = [];
        for (let i = 0; i < intersect.length; i++) {
            const inter = intersect[i].filter((v, i, arr) => {
                if (i > 0 && this.isSamePoint(v, arr[i - 1])) {
                    return false;
                }
                return true;
            });
            const iArr = [];
            let j = 0;
            while (j < inter.length) {
                const cur = inter[j];
                const p = new Vec2d(cur[0], cur[1]);
                // let vec:Vec2d|undefined;
                // if (j === inter.length - 1) {
                //   vec = Vec2d.Sub(new Vec2d(cur[0],cur[1]), new Vec2d(inter[j-1][0],inter[j-1][1])).uni();
                // } else {
                //   vec = Vec2d.Sub(new Vec2d(inter[j+1][0],inter[j+1][1]), new Vec2d(cur[0],cur[1])).uni();
                // }
                // p.setv(vec);
                iArr.push(p);
                j++;
            }
            res.push(iArr);
        }
        return res;
    }
    remove() {
        const { isLine } = this.workOptions;
        let rect;
        const removeIds = [];
        const removeNodes = [];
        const newWorkDatas = [];
        this.curNodeMap.forEach((np, key) => {
            const node = this.fullLayer.getElementsByName(np.name)[0];
            if (node && np.rect && this.eraserRect && this.eraserPolyline && isIntersect(this.eraserRect, np.rect)) {
                if (np.polyline.length > 1) {
                    const intersect = lineclip.polyline(np.polyline.map(p => p.XY), this.eraserPolyline);
                    if (intersect.length) {
                        removeNodes.push(node);
                        removeIds.push(np.name);
                        this.removeIds.push(np.name);
                        if (!isLine) {
                            const intersectArr = this.translateIntersect(intersect);
                            const newLines = this.cutPolyline(intersectArr, np.polyline);
                            for (let i = 0; i < newLines.length; i++) {
                                const workId = `${key}_s_${i}`;
                                const op = [];
                                newLines[i].forEach(o => {
                                    op.push((o.x - this.worldPosition[0]) / this.worldScaling[0], (o.y - this.worldPosition[1]) / this.worldScaling[1], o.z);
                                });
                                newWorkDatas.push({
                                    workId,
                                    op,
                                    opt: np.opt,
                                    toolsType: np.toolsType
                                });
                            }
                        }
                    }
                }
                else {
                    removeNodes.push(node);
                    removeIds.push(np.name);
                    this.removeIds.push(np.name);
                }
                rect = computRect(rect, np.rect);
            }
        });
        removeNodes.forEach(r => r.remove());
        if (rect) {
            rect.x -= EraserShape.SafeBorderPadding;
            rect.y -= EraserShape.SafeBorderPadding;
            rect.w += EraserShape.SafeBorderPadding * 2;
            rect.h += EraserShape.SafeBorderPadding * 2;
        }
        return { rect, removeIds, newWorkDatas };
    }
    consumeAll(props) {
        return this.consume(props);
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
    }
}
Object.defineProperty(EraserShape, "SafeBorderPadding", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 10
});
Object.defineProperty(EraserShape, "eraserSizes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Object.freeze([
        Object.freeze({ width: 18, height: 26 }),
        Object.freeze({ width: 26, height: 34 }),
        Object.freeze({ width: 34, height: 50 }),
    ])
});
