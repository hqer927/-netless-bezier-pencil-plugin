/* eslint-disable @typescript-eslint/no-explicit-any */
import { Path } from "spritejs";
import { BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey } from "../enum";
// import { Vec2d } from "../utils/primitives/Vec2d";
import { getSvgPathFromPoints } from "../utils/getSvgPathFromPoints";
// import { computRect, getRectFromPoints } from "../utils";
import { EStrokeType } from "../../plugin/types";
import { Point2d } from "../utils/primitives/Point2d";
import { computRect, getRectFromPoints } from "../utils";
export class LaserPenShape extends BaseShapeTool {
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
        Object.defineProperty(this, "syncIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.LaserPen
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
        Object.defineProperty(this, "consumeIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
    }
    combineConsume() { }
    setWorkOptions(workOptions) {
        super.setWorkOptions(workOptions);
        this.syncTimestamp = Date.now();
    }
    consume(props) {
        const { data, isFullWork } = props;
        const { workId, op } = data;
        if (op?.length === 0) {
            return { type: EPostMessageType.None };
        }
        this.updateTempPoints(op || []);
        if (this.consumeIndex > this.tmpPoints.length - 4) {
            return { type: EPostMessageType.None };
        }
        const { color, thickness, strokeType, opacity } = this.workOptions;
        const rect = getRectFromPoints(this.tmpPoints, thickness);
        let isSync = false;
        const index = this.syncIndex;
        const points = this.tmpPoints.slice(this.consumeIndex);
        this.consumeIndex = this.tmpPoints.length - 1;
        if (this.syncTimestamp === 0) {
            this.syncTimestamp = Date.now();
        }
        const attrs = {
            name: workId?.toString(),
            className: 'LaserPen',
            // fillColor: isDot ? color : undefined,
            opacity: opacity || 1,
            lineDash: strokeType === EStrokeType.Dotted ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted ? [thickness, thickness * 2] : undefined,
            strokeColor: color,
            lineCap: 'round',
            lineWidth: thickness,
            anchor: [0.5, 0.5],
        };
        //console.log('attrs',attrs, strokeType)
        const tasks = this.getTaskPoints(points);
        if (tasks.length) {
            const now = Date.now();
            if (now - this.syncTimestamp > this.syncUnitTime) {
                isSync = true;
                this.syncTimestamp = now;
                this.syncIndex = this.tmpPoints.length;
            }
            !isFullWork && this.draw({ attrs, tasks, isDot: false });
        }
        const nop = [];
        this.tmpPoints.slice(index).forEach(p => {
            nop.push(p.x, p.y);
        });
        return {
            rect: {
                x: rect.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
                y: rect.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
                w: rect.w * this.fullLayer.worldScaling[0],
                h: rect.h * this.fullLayer.worldScaling[1],
            },
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId: isSync ? workId : undefined,
            op: isSync ? nop : undefined,
            index: isSync ? index * 2 : undefined
        };
    }
    consumeAll() {
        const workId = this.workId?.toString();
        let rect;
        if (this.tmpPoints.length - 1 > this.consumeIndex) {
            let points = this.tmpPoints.slice(this.consumeIndex);
            const isDot = points.length === 1;
            const { color, thickness, strokeType, opacity } = this.workOptions;
            if (isDot) {
                const dotData = this.computDotStroke({
                    point: points[0],
                    radius: thickness / 2
                });
                points = dotData.ps;
                rect = dotData.rect;
            }
            else {
                rect = getRectFromPoints(this.tmpPoints, thickness);
            }
            const attrs = {
                name: workId?.toString(),
                className: 'LaserPen',
                fillColor: isDot ? color : undefined,
                opacity: opacity || 1,
                lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
                strokeColor: color,
                lineCap: isDot ? undefined : 'round',
                lineWidth: isDot ? 0 : thickness,
                anchor: [0.5, 0.5],
            };
            const tasks = this.getTaskPoints(points);
            if (tasks.length) {
                this.draw({ attrs, tasks, isDot });
            }
        }
        const nop = [];
        this.tmpPoints.slice(this.syncIndex).forEach(p => {
            nop.push(p.x, p.y);
        });
        return {
            rect: rect && {
                x: rect.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
                y: rect.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
                w: rect.w * this.fullLayer.worldScaling[0],
                h: rect.h * this.fullLayer.worldScaling[1],
            },
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId: workId,
            op: nop,
            index: this.syncIndex * 2
        };
    }
    clearTmpPoints() {
        //console.log('animationDraw7')
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
        this.syncIndex = 0;
    }
    consumeService(props) {
        const { op } = props;
        const { color, thickness, strokeType, opacity } = this.workOptions;
        if (!op.length) {
            const r = getRectFromPoints(this.tmpPoints, thickness);
            return {
                x: r.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
                y: r.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
                w: r.w * this.fullLayer.worldScaling[0],
                h: r.h * this.fullLayer.worldScaling[1],
            };
        }
        const lastPointIndex = Math.max(0, this.tmpPoints.length - 1);
        this.updateTempPoints(op || []);
        let rect;
        let points = this.tmpPoints.slice(lastPointIndex);
        const isDot = points.length === 1;
        if (isDot) {
            const dotData = this.computDotStroke({
                point: points[0],
                radius: thickness / 2
            });
            points = dotData.ps;
            rect = dotData.rect;
        }
        else {
            rect = getRectFromPoints(this.tmpPoints, thickness);
        }
        const attrs = {
            name: this.workId?.toString(),
            className: 'LaserPen',
            fillColor: isDot ? color : undefined,
            opacity: opacity || 1,
            lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
            strokeColor: color,
            lineCap: isDot ? undefined : 'round',
            lineWidth: isDot ? 0 : thickness,
            anchor: [0.5, 0.5],
        };
        const tasks = this.getTaskPoints(points);
        if (tasks.length) {
            this.draw({ attrs, tasks, isDot });
        }
        return {
            x: rect.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
            y: rect.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
            w: rect.w * this.fullLayer.worldScaling[0],
            h: rect.h * this.fullLayer.worldScaling[1],
        };
    }
    computDotStroke(newPoint) {
        const { point, radius } = newPoint;
        const rect = { x: point.x - radius, y: point.y - radius, w: radius * 2, h: radius * 2 };
        return { ps: Point2d.GetDotStroke(point, radius, 8), rect };
    }
    updateTempPoints(globalPoints) {
        const length = this.tmpPoints.length;
        for (let index = 0; index < globalPoints.length; index += 2) {
            if (length) {
                const lastTemPoint = this.tmpPoints.slice(-1)[0];
                if (lastTemPoint && lastTemPoint.x === globalPoints[index] && lastTemPoint.y === globalPoints[index + 1]) {
                    this.tmpPoints.pop();
                }
            }
            this.tmpPoints.push(new Point2d(globalPoints[index], globalPoints[index + 1]));
        }
    }
    async draw(data) {
        const { attrs, tasks, isDot } = data;
        const layer = this.fullLayer;
        const { duration } = this.workOptions;
        const node = new Path();
        for (let i = 0; i < tasks.length; i++) {
            const { pos, points } = tasks[i];
            let d;
            if (isDot) {
                d = getSvgPathFromPoints(points, true);
            }
            else {
                d = getSvgPathFromPoints(points, false);
            }
            node.attr({
                ...attrs,
                pos,
                d,
            });
            const { vertex, fragment } = this.workOptions;
            if (vertex && fragment) {
                const program = layer.renderer.createProgram({ vertex, fragment });
                const { width, height } = layer.getResolution();
                node.setUniforms({
                    u_time: 0,
                    u_resolution: [width, height],
                });
                node.setProgram(program);
            }
            layer.appendChild(node);
            await node.transition(duration).attr({
                scale: isDot ? [0.1, 0.1] : [1, 1],
                lineWidth: isDot ? 0 : 1
            });
            node.remove();
        }
    }
    getTaskPoints(newPoints) {
        const tasks = [];
        if (newPoints.length === 0) {
            return [];
        }
        let i = 0;
        let sx = newPoints[0].x;
        let sy = newPoints[0].y;
        let pos = [sx, sy];
        let points = [];
        while (i < newPoints.length) {
            const cur = newPoints[i];
            const x = cur.x - sx;
            const y = cur.y - sy;
            points.push(new Point2d(x, y));
            if (i > 0 && i < newPoints.length - 1) {
                const angle = newPoints[i].getAngleByPoints(newPoints[i - 1], newPoints[i + 1]);
                //console.log('angle', angle, newPoints[i].XY, newPoints[i-1].XY, newPoints[i+1])
                if (angle < 90 || angle > 270) {
                    const lastPoint = points.pop()?.clone();
                    if (lastPoint) {
                        tasks.push({
                            pos,
                            points: [...points, lastPoint]
                        });
                    }
                    sx = newPoints[i].x;
                    sy = newPoints[i].y;
                    pos = [sx, sy];
                    const x = cur.x - sx;
                    const y = cur.y - sy;
                    points = [new Point2d(x, y)];
                }
            }
            i++;
        }
        tasks.push({
            pos,
            points
        });
        return tasks;
    }
    removeLocal() { }
    removeService(key) {
        let rect;
        const removeNode = [];
        this.fullLayer.getElementsByName(key).forEach(c => {
            if (c.name === key) {
                const b = c.getBoundingClientRect();
                rect = computRect(rect, {
                    x: b.x,
                    y: b.y,
                    w: b.width,
                    h: b.height
                });
                removeNode.push(c);
            }
        });
        if (removeNode.length) {
            removeNode.forEach(r => r.remove());
        }
        return rect;
    }
}
