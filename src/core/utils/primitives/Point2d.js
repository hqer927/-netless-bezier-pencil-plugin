import { Vec2d } from "./Vec2d";
/** @public */
export class Point2d extends Vec2d {
    constructor(x = 0, y = 0, z = 0, v = { x: 0, y: 0 }, t = 0, a = 0) {
        super(x, y, z);
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
        Object.defineProperty(this, "z", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: z
        });
        Object.defineProperty(this, "v", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: v
        });
        Object.defineProperty(this, "t", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: t
        });
        Object.defineProperty(this, "a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: a
        });
    }
    get timestamp() {
        return this.t;
    }
    get pressure() {
        return this.z;
    }
    get angleNum() {
        return this.a;
    }
    get XY() {
        return [this.x, this.y];
    }
    setA(a) {
        this.a = a;
    }
    setT(t) {
        this.t = t;
    }
    setv(v) {
        this.v = { x: v.x, y: v.y };
        return this;
    }
    set(x = this.x, y = this.y, z = this.z, v = this.v, t = this.t, a = this.a) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.v = v;
        this.t = t;
        this.a = a;
        return this;
    }
    clone() {
        const { x, y, z, v, t, a } = this;
        const _v = { x: v.x, y: v.y };
        return new Point2d(x, y, z, _v, t, a);
    }
    distance(p) {
        return Point2d.GetDistance(this, p);
    }
    isNear(p, tolerance) {
        return Point2d.IsNear(this, p, tolerance);
    }
    getAngleByPoints(pre, next) {
        return Point2d.GetAngleByPoints(pre, this, next);
    }
    static Sub(A, B) {
        return new Point2d(A.x - B.x, A.y - B.y);
    }
    static Add(A, B) {
        return new Point2d(A.x + B.x, A.y + B.y);
    }
    static GetDistance(p0, p1) {
        return Point2d.Len(p0.clone().sub(p1));
    }
    static GetAngleByPoints(pre, cur, next) {
        const xa = cur.x - pre.x;
        const xb = next.x - cur.x;
        const ya = cur.y - pre.y;
        const yb = next.y - cur.y;
        let angle = 0;
        const _a = Math.sqrt(xa * xa + ya * ya);
        const _b = Math.sqrt(xb * xb + yb * yb);
        if (_a && _b) {
            const p = xa * xb + ya * yb;
            angle = Math.acos(p / (_a * _b));
            angle = angle / Math.PI * 180;
            //direction 大于0 逆时针, 小于0 顺时针, 等于0 平行
            let direction = xa * yb - ya * xb;
            direction = direction > 0 ? 1 : -1;
            angle = 180 + direction * angle;
        }
        return angle;
    }
    static IsNear(p0, p1, tolerance) {
        return Point2d.Len(p0.clone().sub(p1)) < tolerance;
    }
    static RotWith(A, C, r, decimal = 2) {
        const x = A.x - C.x;
        const y = A.y - C.y;
        const s = Math.sin(r);
        const c = Math.cos(r);
        const step = Math.pow(10, decimal);
        const X = Math.floor((C.x + (x * c - y * s)) * step) / step;
        const Y = Math.floor((C.y + (x * s + y * c)) * step) / step;
        return new Point2d(X, Y);
    }
    /**
     * 根据圆心和半径，获取圆上的等份点
     * @param o 圆心
     * @param radius 半径
     * @param average 均分数
     * @returns
     */
    static GetDotStroke(o, radius, average = 16) {
        const _v = new Vec2d(1, 1);
        const FIXED_PI = Math.PI + 0.001;
        const start = Point2d.Add(o, Point2d.Sub(o, _v).uni().per().mul(-radius));
        const dotPts = [];
        for (let step = 1 / average, t = step; t <= 1; t += step) {
            dotPts.push(Point2d.RotWith(start, o, FIXED_PI * 2 * t));
        }
        return dotPts;
    }
    /**
     * 根据圆心和园上的起始点，获取半圆上的等份点
     * @param o 圆心
     * @param p 圆弧起始点
     * @param radian 1，逆时针180度 -1，顺时针
     * @param average 均分数
     * @returns
     */
    static GetSemicircleStroke(o, p, radian = -1, average = 8) {
        const PI = radian * (Math.PI + 0.001);
        const dotPts = [];
        for (let step = 1 / average, t = step; t <= 1; t += step) {
            dotPts.push(Point2d.RotWith(p, o, PI * t));
        }
        return dotPts;
    }
}
