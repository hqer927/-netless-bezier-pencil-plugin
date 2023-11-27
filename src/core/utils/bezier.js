/* eslint-disable @typescript-eslint/ban-types */
import { Vec2d } from "./primitives/Vec2d";
/**
 * @desc 贝塞尔曲线算法，包含了3阶贝塞尔
 */
export class Bezier {
    static bezier(num, points) {
        const _points = [];
        for (let i = 0; i < points.length; i += 4) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2];
            const p4 = points[i + 3];
            if (p1 && p2 && p3 && p4) {
                _points.push(...Bezier.getBezierPoints(num, p1, p2, p3, p4));
            }
            else if (p1 && p2 && p3) {
                _points.push(...Bezier.getBezierPoints(num, p1, p2, p3));
            }
            else if (p1 && p2) {
                _points.push(...Bezier.getBezierPoints(num, p1, p2));
            }
            else if (p1) {
                _points.push(p1);
            }
        }
        return _points;
    }
    /**
     * @desc 获取点，这里可以设置点的个数
     * @param {number} num 点个数
     * @param {Vec2d} p1 点坐标
     * @param {Vec2d} p2 点坐标
     * @param {Vec2d} p3 点坐标
     * @param {Vec2d} p4 点坐标
     * 如果参数是 num, p1, p2 为一阶贝塞尔
     * 如果参数是 num, p1, c1, p2 为二阶贝塞尔
     * 如果参数是 num, p1, c1, c2, p2 为三阶贝塞尔
     */
    static getBezierPoints(num = 10, p1, p2, p3, p4) {
        let func = null;
        const points = [];
        if (!p3 && !p4) {
            func = Bezier.oneBezier;
        }
        else if (p3 && !p4) {
            func = Bezier.twoBezier;
        }
        else if (p3 && p4) {
            func = Bezier.threeBezier;
        }
        for (let i = 0; i < num; i++) {
            if (func) {
                points.push(func(i / num, p1, p2, p3, p4));
            }
        }
        if (p4) {
            points.push(p4);
        }
        else if (p3) {
            points.push(p3);
        }
        return points;
    }
    /**
     * @desc 一阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Vec2d} p1 起点坐标
     * @param {Vec2d} p2 终点坐标
     */
    static oneBezier(t, p1, p2) {
        const x = p1.x + (p2.x - p1.x) * t;
        const y = p1.y + (p2.y - p1.y) * t;
        return new Vec2d(x, y);
    }
    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    static twoBezier(t, p1, cp, p2) {
        const x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.x;
        return new Vec2d(x, y);
    }
    /**
     * @desc 三阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} cp2 控制点2
     */
    static threeBezier(t, p1, cp1, cp2, p2) {
        const x = p1.x * (1 - t) * (1 - t) * (1 - t) +
            3 * cp1.x * t * (1 - t) * (1 - t) +
            3 * cp2.x * t * t * (1 - t) +
            p2.x * t * t * t;
        const y = p1.y * (1 - t) * (1 - t) * (1 - t) +
            3 * cp1.y * t * (1 - t) * (1 - t) +
            3 * cp2.y * t * t * (1 - t) +
            p2.y * t * t * t;
        return new Vec2d(x, y);
    }
}
