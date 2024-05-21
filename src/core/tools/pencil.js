/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Path } from "spritejs";
import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { Vec2d } from "../utils/primitives/Vec2d";
import { getSvgPathFromPoints } from "../utils/getSvgPathFromPoints";
import { transformToSerializableData } from "../../collector/utils";
import { computRect, getRectFromPoints, isSealedGroup } from "../utils";
import { EStrokeType } from "../../plugin/types";
export class PencilShape extends BaseShapeTool {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "canRotate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "scaleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EScaleType.all
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Pencil
        });
        Object.defineProperty(this, "syncTimestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "syncIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "tmpPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "MAX_REPEAR", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 10
        });
        /** 合并原始点的灵敏度 */
        Object.defineProperty(this, "uniThickness", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "centerPos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [0, 0]
        });
        this.workOptions = props.toolsOpt;
        this.uniThickness = this.MAX_REPEAR / this.workOptions.thickness / 10;
        this.syncTimestamp = 0;
    }
    /** 批量合并消费本地数据,返回绘制结果 */
    combineConsume() {
        const workId = this.workId?.toString();
        // console.log('post-combineConsume', workId)
        const tasks = this.transformDataAll(true);
        const attrs = {
            name: workId,
        };
        let rect;
        const layer = this.drawLayer || this.fullLayer;
        if (tasks.length) {
            rect = this.draw({ attrs, tasks, replaceId: workId, layer, isClearAll: true });
        }
        return {
            rect,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local
        };
    }
    setWorkOptions(workOptions) {
        super.setWorkOptions(workOptions);
        this.syncTimestamp = Date.now();
    }
    consume(props) {
        const { data, isFullWork, isClearAll, isSubWorker } = props;
        if (data.op?.length === 0) {
            return { type: EPostMessageType.None };
        }
        const { workId } = data;
        const { tasks, effects, consumeIndex } = this.transformData(data, false);
        this.syncIndex = Math.min(this.syncIndex, consumeIndex, Math.max(0, this.tmpPoints.length - 2));
        const attrs = {
            name: workId?.toString()
        };
        let rect;
        let isSync = false;
        const index = this.syncIndex;
        if (this.syncTimestamp === 0) {
            this.syncTimestamp = Date.now();
        }
        //console.log('tmpPoints', effects, this.tmpPoints.map(p=>({p:p.toArray(),t:p.t})))
        if (tasks.length) {
            if (tasks[0].taskId - this.syncTimestamp > this.syncUnitTime) {
                isSync = true;
                this.syncTimestamp = tasks[0].taskId;
                this.syncIndex = this.tmpPoints.length;
            }
            if (isSubWorker) {
                const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
                rect = this.draw({ attrs, tasks, effects, layer, isClearAll });
            }
        }
        if (isSubWorker) {
            if (consumeIndex > 10) {
                this.tmpPoints.splice(0, consumeIndex - 10);
            }
            return {
                rect,
                type: EPostMessageType.DrawWork,
                dataType: EDataType.Local,
            };
        }
        const op = [];
        this.tmpPoints.slice(index).forEach(p => {
            op.push(p.x, p.y, this.computRadius(p.z, this.workOptions.thickness));
        });
        // !isSubWorker && console.log('collectorAsyncData---0---0', this.tmpPoints.length, index, isSync, consumeIndex)
        return {
            rect,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId: isSync ? workId : undefined,
            op: isSync ? op : undefined,
            index: isSync ? index * 3 : undefined
        };
    }
    consumeAll(props) {
        if (props.data) {
            const { op, workState } = props.data;
            if (op?.length && workState === EvevtWorkState.Done) {
                if (this.workOptions.strokeType === EStrokeType.Stroke) {
                    this.updateTempPointsWithPressureWhenDone(op);
                }
            }
        }
        const workId = this.workId?.toString();
        if (!workId) {
            return { type: EPostMessageType.None };
        }
        const tasks = this.transformDataAll(true);
        const attrs = {
            name: workId,
        };
        let rect;
        const layer = this.fullLayer;
        if (tasks.length) {
            rect = this.draw({ attrs, tasks, replaceId: workId, layer, isClearAll: false });
        }
        const nop = [];
        this.tmpPoints.map(p => {
            nop.push(p.x, p.y, this.computRadius(p.z, this.workOptions.thickness));
        });
        this.syncTimestamp = 0;
        delete this.workOptions.syncUnitTime;
        const ops = transformToSerializableData(nop);
        this.vNodes.setInfo(workId, {
            rect,
            op: nop,
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
        });
        return {
            rect,
            type: EPostMessageType.FullWork,
            dataType: EDataType.Local,
            workId,
            ops,
            updateNodeOpt: {
                pos: this.centerPos,
                useAnimation: true
            },
            opt: this.workOptions,
            undoTickerId: props.data?.undoTickerId
        };
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
        this.syncIndex = 0;
    }
    consumeService(params) {
        const { op, isFullWork, replaceId, isClearAll, isTemp } = params;
        this.tmpPoints.length = 0;
        for (let i = 0; i < op.length; i += 3) {
            const point = new Point2d(op[i], op[i + 1], op[i + 2]);
            if (this.tmpPoints.length > 0) {
                const lastTmpPoint = this.tmpPoints[this.tmpPoints.length - 1];
                const vector = Vec2d.Sub(point, lastTmpPoint).uni();
                point.setv(vector);
            }
            this.tmpPoints.push(point);
        }
        const tasks = this.transformDataAll(false);
        const name = this.workId?.toString();
        const attrs = {
            name,
        };
        let rect;
        if (name && tasks.length) {
            const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
            rect = this.draw({ attrs, tasks, replaceId, layer, isClearAll });
            isFullWork && !isTemp && this.vNodes.setInfo(name, {
                rect,
                op,
                opt: this.workOptions,
                toolsType: this.toolsType,
                scaleType: this.scaleType,
                canRotate: this.canRotate,
                centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
            });
        }
        return rect;
    }
    transformDataAll(shoulAddThickness = true) {
        return this.getTaskPoints(this.tmpPoints, shoulAddThickness && this.workOptions.thickness || undefined);
    }
    draw(data) {
        const { attrs, tasks, replaceId, effects, layer, isClearAll } = data;
        const { strokeColor, strokeType, thickness, zIndex, scale, rotate, translate } = this.workOptions;
        if (isClearAll) {
            layer.removeAllChildren();
        }
        if (replaceId) {
            this.fullLayer.getElementsByName(replaceId + '').map(o => o.remove());
            this.drawLayer?.getElementsByName(replaceId + '').map(o => o.remove());
        }
        // console.log('post-0', replaceId, this.fullLayer.getElementsByName(replaceId+'').length)
        if (effects?.size) {
            effects.forEach(id => {
                layer.getElementById(id + '')?.remove();
            });
            effects.clear();
        }
        let r;
        const pathAttrs = [];
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        for (let i = 0; i < tasks.length; i++) {
            const { pos, points, taskId } = tasks[i];
            attrs.id = taskId.toString();
            const { ps, rect } = this.computDrawPoints(points);
            let d;
            const isDot = points.length === 1;
            if (strokeType === EStrokeType.Stroke || isDot) {
                d = getSvgPathFromPoints(ps, true);
            }
            else {
                d = getSvgPathFromPoints(ps, false);
            }
            // console.log('getRectFromLayer-pencil', rect)
            const attr = {
                pos,
                d,
                fillColor: strokeType === EStrokeType.Stroke || isDot ? strokeColor : undefined,
                lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
                strokeColor: strokeColor,
                lineCap: strokeType === EStrokeType.Stroke || isDot ? undefined : 'round',
                lineWidth: strokeType === EStrokeType.Stroke || isDot ? 0 : thickness,
            };
            r = computRect(r, {
                x: Math.floor((rect.x + pos[0]) * worldScaling[0] + worldPosition[0] - BaseShapeTool.SafeBorderPadding),
                y: Math.floor((rect.y + pos[1]) * worldScaling[1] + worldPosition[1] - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(rect.w * worldScaling[0] + 2 * BaseShapeTool.SafeBorderPadding),
                h: Math.floor(rect.h * worldScaling[1] + 2 * BaseShapeTool.SafeBorderPadding)
            });
            // console.log('getRectFromLayer-pencil', r)
            // todo 渲染材质
            // const {vertex, fragment} = this.workOptions;
            // if (vertex && fragment) {
            //     const program = layer.renderer.createProgram({vertex, fragment});
            //     const {width, height} = layer.getResolution();
            //     node.setUniforms({
            //     u_time: 0,
            //     u_resolution: [width, height],
            //     });
            //     node.setProgram(program);
            // }
            pathAttrs.push(attr);
        }
        // let node:Group|Path|undefined;
        if (scale) {
            attrs.scale = scale;
        }
        if (rotate) {
            attrs.rotate = rotate;
        }
        if (translate) {
            attrs.translate = translate;
        }
        const group = new Group();
        if (r) {
            this.centerPos = BaseShapeTool.getCenterPos(r, layer);
            group.attr({
                ...attrs,
                normalize: true,
                id: attrs.name,
                anchor: [0.5, 0.5],
                bgcolor: strokeType === EStrokeType.Stroke ? strokeColor : undefined,
                pos: this.centerPos,
                size: [(r.w - 2 * BaseShapeTool.SafeBorderPadding) / worldScaling[0], (r.h - 2 * BaseShapeTool.SafeBorderPadding) / worldScaling[1]],
                zIndex,
            });
            const children = pathAttrs.map((attr) => {
                attr.pos = [attr.pos[0] - this.centerPos[0], attr.pos[1] - this.centerPos[1]];
                return new Path(attr);
            });
            group.append(...children);
            if (strokeType === EStrokeType.Stroke) {
                group.seal();
            }
            layer.append(group);
        }
        if (scale || rotate || translate) {
            const r = group?.getBoundingClientRect();
            if (r) {
                return {
                    x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                    y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                    w: Math.floor(r.width + BaseShapeTool.SafeBorderPadding * 2),
                    h: Math.floor(r.height + BaseShapeTool.SafeBorderPadding * 2)
                };
            }
        }
        return r;
    }
    computDrawPoints(points) {
        const strokeType = this.workOptions.strokeType;
        if (strokeType === EStrokeType.Stroke || points.length === 1) {
            return this.computStroke(points);
        }
        return this.computNomal(points);
    }
    computNomal(points) {
        let maxRadius = this.workOptions.thickness;
        const ps = points.map(p => {
            maxRadius = Math.max(maxRadius, p.radius);
            return p.point;
        });
        return { ps, rect: getRectFromPoints(ps, maxRadius) };
    }
    computStroke(points) {
        const length = points.length;
        if (length === 1) {
            return this.computDotStroke(points[0]);
        }
        return this.computLineStroke(points);
    }
    computLineStroke(strokes) {
        const leftPts = [];
        const rightPts = [];
        for (let index = 0; index < strokes.length; index++) {
            const { point, radius } = strokes[index];
            let vector = point.v;
            if (index === 0 && strokes.length > 1) {
                vector = strokes[index + 1].point.v;
            }
            const offset = Vec2d.Per(vector).mul(radius);
            leftPts.push(Point2d.Sub(point, offset));
            rightPts.push(Point2d.Add(point, offset));
        }
        const lastPoint = strokes[strokes.length - 1];
        const endCap = Point2d.GetSemicircleStroke(lastPoint.point, leftPts[leftPts.length - 1], -1, 8);
        const startCap = Point2d.GetSemicircleStroke(strokes[0].point, rightPts[0], -1, 8);
        const ps = leftPts.concat(endCap, rightPts.reverse(), startCap);
        return { ps, rect: getRectFromPoints(ps) };
    }
    computDotStroke(newPoint) {
        const { point, radius } = newPoint;
        const rect = { x: point.x - radius, y: point.y - radius, w: radius * 2, h: radius * 2 };
        return { ps: Point2d.GetDotStroke(point, radius, 8), rect };
    }
    transformData(data, isFullWork) {
        const { op, workState } = data;
        let consumeIndex = this.tmpPoints.length - 1;
        let tasks = [];
        if (op?.length && workState) {
            const { strokeType, thickness } = this.workOptions;
            const effects = new Set();
            consumeIndex = strokeType === EStrokeType.Stroke ? this.updateTempPointsWithPressure(op, thickness, effects) : this.updateTempPoints(op, thickness, effects);
            const points = isFullWork ? this.tmpPoints : this.tmpPoints.slice(consumeIndex);
            tasks = this.getTaskPoints(points, thickness);
            return { tasks, effects, consumeIndex };
        }
        return { tasks, consumeIndex };
    }
    /** 压力渐变公式 */
    computRadius(z, thickness) {
        return z * 0.03 * thickness + thickness * 0.5;
    }
    getMinZ(thickness, minRadius) {
        const minR = minRadius || Math.max(1, Math.floor(thickness * 0.3));
        return (minR - thickness * 0.5) * 100 / thickness / 3;
    }
    getTaskPoints(newPoints, thickness) {
        const tasks = [];
        if (newPoints.length === 0) {
            return [];
        }
        let i = 0;
        let sx = newPoints[0].x;
        let sy = newPoints[0].y;
        let pos = [sx, sy];
        let points = [];
        let taskId = newPoints[0].t;
        while (i < newPoints.length) {
            const cur = newPoints[i];
            const x = cur.x - sx;
            const y = cur.y - sy;
            const z = cur.z;
            const radius = thickness ? this.computRadius(z, thickness) : z;
            points.push({
                point: new Point2d(x, y, z, newPoints[i].v),
                radius
            });
            if (i > 0 && i < newPoints.length - 1) {
                const angle = newPoints[i].getAngleByPoints(newPoints[i - 1], newPoints[i + 1]);
                if (angle < 90 || angle > 270) {
                    const lastPoint = points.pop()?.point.clone();
                    if (lastPoint) {
                        tasks.push({
                            taskId,
                            pos,
                            points: [...points, {
                                    point: lastPoint,
                                    radius
                                }]
                        });
                    }
                    sx = newPoints[i].x;
                    sy = newPoints[i].y;
                    pos = [sx, sy];
                    const x = cur.x - sx;
                    const y = cur.y - sy;
                    points = [{
                            point: new Point2d(x, y, z),
                            radius
                        }];
                    taskId = Date.now();
                }
            }
            i++;
        }
        tasks.push({
            taskId,
            pos,
            points
        });
        //console.log('aaaa11', newPoints, tasks)
        return tasks;
    }
    updateTempPointsWithPressure(globalPoints, thickness, effects) {
        const taskId = Date.now();
        const oldLength = this.tmpPoints.length;
        let willChangeMinIndex = oldLength;
        for (let index = 0; index < globalPoints.length; index += 2) {
            willChangeMinIndex = Math.min(willChangeMinIndex, oldLength);
            const length = this.tmpPoints.length;
            const nextPoint = new Point2d(globalPoints[index], globalPoints[index + 1]);
            if (length === 0) {
                this.tmpPoints.push(nextPoint);
                continue;
            }
            const lastIndex = length - 1;
            const lastTemPoint = this.tmpPoints[lastIndex];
            const vector = Vec2d.Sub(nextPoint, lastTemPoint).uni();
            // 合并附近点,不需要nextPoint
            if (nextPoint.isNear(lastTemPoint, thickness)) {
                if (lastTemPoint.z < this.MAX_REPEAR) {
                    lastTemPoint.setz(Math.min(lastTemPoint.z + 1, this.MAX_REPEAR));
                    willChangeMinIndex = Math.min(willChangeMinIndex, lastIndex);
                    if (length > 1) {
                        let i = length - 1;
                        while (i > 0) {
                            const distance = this.tmpPoints[i].distance(this.tmpPoints[i - 1]);
                            const preZ = Math.max(this.tmpPoints[i].z - this.uniThickness * distance, 0);
                            if (this.tmpPoints[i - 1].z >= preZ) {
                                i == 0;
                                break;
                            }
                            this.tmpPoints[i - 1].setz(preZ);
                            willChangeMinIndex = Math.min(willChangeMinIndex, i - 1);
                            i--;
                        }
                    }
                }
                else {
                    willChangeMinIndex = Infinity;
                }
                continue;
            }
            nextPoint.setv(vector);
            const distance = nextPoint.distance(lastTemPoint);
            const z = Math.max(lastTemPoint.z - this.uniThickness * distance, 0);
            // 向量一致的点，在z可线性变化下移除
            if (length > 1 && Vec2d.Equals(vector, lastTemPoint.v, 0.02) && (z > 0 || lastTemPoint.z <= 0)) {
                if (effects && lastTemPoint.t) {
                    effects.add(lastTemPoint.t);
                }
                this.tmpPoints.pop();
                willChangeMinIndex = Math.min(lastIndex, willChangeMinIndex);
            }
            nextPoint.setz(z);
            this.tmpPoints.push(nextPoint);
        }
        // 无效的点，原始点未有变化
        if (willChangeMinIndex === Infinity) {
            return this.tmpPoints.length;
        }
        let consumeIndex = oldLength;
        // 增量无副作用，那最后一个点做为消费下标
        if (willChangeMinIndex === oldLength) {
            consumeIndex = Math.max(consumeIndex - 1, 0);
            //console.log('consumeInde1x', consumeIndex, this.tmpPoints[consumeIndex])
            const t = this.tmpPoints[consumeIndex].t;
            if (t) {
                effects?.add(t);
            }
        }
        // 需要找到最近的taskId的下标作为消费下标
        else {
            let i = oldLength - 1;
            consumeIndex = willChangeMinIndex;
            while (i >= 0) {
                //console.log('consumeIndex', i, this.tmpPoints[i])
                const t = this.tmpPoints[i].t;
                if (t) {
                    effects?.add(t);
                    if (i <= willChangeMinIndex) {
                        consumeIndex = i;
                        i = -1;
                        break;
                    }
                }
                i--;
            }
        }
        this.tmpPoints[consumeIndex].setT(taskId);
        //console.log('tmpPoints', consumeIndex, this.tmpPoints.map(t=>(t.toArray())))
        return consumeIndex;
    }
    updateTempPoints(globalPoints, thickness, effects) {
        const taskId = Date.now();
        const oldLength = this.tmpPoints.length;
        let willChangeMinIndex = oldLength;
        for (let index = 0; index < globalPoints.length; index += 2) {
            const length = this.tmpPoints.length;
            const nextPoint = new Point2d(globalPoints[index], globalPoints[index + 1]);
            if (length === 0) {
                this.tmpPoints.push(nextPoint);
                continue;
            }
            const lastIndex = length - 1;
            const lastTemPoint = this.tmpPoints[lastIndex];
            const vector = Vec2d.Sub(nextPoint, lastTemPoint).uni();
            // 向量一致的点，在z可线性变化下移除
            if (nextPoint.isNear(lastTemPoint, thickness / 2)) {
                willChangeMinIndex = Math.min(lastIndex, willChangeMinIndex);
                continue;
            }
            if (Vec2d.Equals(vector, lastTemPoint.v, 0.02)) {
                if (effects && lastTemPoint.t) {
                    effects.add(lastTemPoint.t);
                }
                this.tmpPoints.pop();
                willChangeMinIndex = Math.min(lastIndex, willChangeMinIndex);
            }
            nextPoint.setv(vector);
            this.tmpPoints.push(nextPoint);
        }
        let consumeIndex = oldLength;
        // 增量无副作用，那最后一个点做为消费下标
        if (willChangeMinIndex === oldLength) {
            consumeIndex = Math.max(consumeIndex - 1, 0);
            //console.log('consumeInde1x', consumeIndex, this.tmpPoints[consumeIndex])
            const t = this.tmpPoints[consumeIndex].t;
            if (t) {
                effects?.add(t);
            }
        }
        // 需要找到最近的taskId的下标作为消费下标
        else {
            let i = Math.min(oldLength - 1, willChangeMinIndex);
            consumeIndex = willChangeMinIndex;
            //console.log('consumeIndex', oldLength, willChangeMinIndex, this.tmpPoints.length)
            while (i >= 0) {
                const t = this.tmpPoints[i]?.t;
                //console.log('consumeIndex1', i, this.tmpPoints[i], t)
                if (t) {
                    effects?.add(t);
                    if (i <= willChangeMinIndex) {
                        consumeIndex = i;
                        i = -1;
                        break;
                    }
                }
                i--;
            }
        }
        this.tmpPoints[consumeIndex].setT(taskId);
        return consumeIndex;
    }
    updateTempPointsWithPressureWhenDone(globalPoints) {
        const { thickness } = this.workOptions;
        const gl = globalPoints.length;
        const minZ = this.getMinZ(thickness);
        for (let index = 0; index < gl; index += 2) {
            const length = this.tmpPoints.length;
            const nextPoint = new Point2d(globalPoints[index], globalPoints[index + 1]);
            if (length === 0) {
                this.tmpPoints.push(nextPoint);
                continue;
            }
            const lastIndex = length - 1;
            const lastTemPoint = this.tmpPoints[lastIndex];
            const vector = Vec2d.Sub(nextPoint, lastTemPoint).uni();
            const distance = nextPoint.distance(lastTemPoint);
            if (length > 1 && lastTemPoint.z === minZ) {
                break;
            }
            if (nextPoint.isNear(lastTemPoint, thickness / 2)) {
                if (gl < 3 && lastTemPoint.z < this.MAX_REPEAR) {
                    lastTemPoint.setz(Math.min(lastTemPoint.z + 1, this.MAX_REPEAR));
                    if (length > 1) {
                        let i = length - 1;
                        while (i > 0) {
                            const distance = this.tmpPoints[i].distance(this.tmpPoints[i - 1]);
                            const preZ = Math.max(this.tmpPoints[i].z - this.uniThickness * distance, -thickness / 4);
                            if (this.tmpPoints[i - 1].z >= preZ) {
                                i == 0;
                                break;
                            }
                            this.tmpPoints[i - 1].setz(preZ);
                            i--;
                        }
                    }
                }
                continue;
            }
            nextPoint.setv(vector);
            const z = Math.max(lastTemPoint.z - this.uniThickness * distance, minZ);
            // 向量一致的点，在z可线性变化下移除
            if (length > 1 && Vec2d.Equals(vector, lastTemPoint.v, 0.02) && lastTemPoint.z <= 0) {
                this.tmpPoints.pop();
            }
            nextPoint.setz(z);
            this.tmpPoints.push(nextPoint);
        }
    }
    static updateNodeOpt(param) {
        const { node, opt, vNodes } = param;
        const { strokeColor } = opt;
        const nodeOpt = vNodes.get(node.name);
        if (strokeColor) {
            if (node.tagName === 'GROUP') {
                if (isSealedGroup(node)) {
                    node.setAttribute('bgcolor', strokeColor);
                }
                else {
                    node.children.forEach(f => {
                        f.setAttribute('strokeColor', strokeColor);
                        if (f.getAttribute('fillColor')) {
                            f.setAttribute('fillColor', strokeColor);
                        }
                    });
                }
            }
            else {
                node.setAttribute('strokeColor', strokeColor);
                node.setAttribute('fillColor', strokeColor);
            }
            if (nodeOpt?.opt?.strokeColor) {
                nodeOpt.opt.strokeColor = strokeColor;
            }
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        return BaseShapeTool.updateNodeOpt(param);
    }
    static getRectFromLayer(layer, name) {
        const node = layer.getElementsByName(name)[0];
        if (node) {
            const r = node.getBoundingClientRect();
            return {
                x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(r.width + BaseShapeTool.SafeBorderPadding * 2),
                h: Math.floor(r.height + BaseShapeTool.SafeBorderPadding * 2)
            };
        }
        return undefined;
    }
}
