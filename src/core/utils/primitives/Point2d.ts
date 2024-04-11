import { Vec2d, Vec2dSimple, VecLike } from "./Vec2d"

/**
 * A serializable model for 2D vectors.
 *
 * @public */
export interface Point2dModel extends Vec2dSimple {
    /** 压力值 */
    z: number
    /** 基于上一点的向量 */
	v?: VecLike
    /** 时间戳 */
    t?: number
    /** 当前点基于前后两个点的夹角度数(0-360) */
	a?: number
}

/** @public */
export type PointLike = Point2d | Point2dModel

/** @public */
export class Point2d extends Vec2d {
	constructor(public x = 0, public y = 0, public z = 0, public v = {x:0, y:0}, public t = 0, public a = 0) {
        super(x, y, z);
    }
	get timestamp(): number{
		return this.t;
	}
	get pressure() {
		return this.z
	}
    get angleNum(){
        return this.a;
    }
	get XY():[number,number] {
		return [this.x, this.y];
	}
	setA(a:number) {
		this.a = a;
	}
	setT(t:number) {
		this.t = t;
	}
	setv(v: Vec2dSimple) {
		this.v = {x:v.x, y:v.y};
		return this;
	}
	set(x = this.x, y = this.y, z = this.z, v = this.v, t = this.t, a = this.a) {
		this.x = x
		this.y = y
		this.z = z
        this.v = v
        this.t = t
        this.a = a
		return this
	}
	clone(): Point2d {
		const { x, y, z, v, t, a} = this
		const _v = {x:v.x, y:v.y};
		return new Point2d(x, y, z, _v, t,a)
	}
    distance(p: Point2d): number {
        return Point2d.GetDistance(this, p);
    }
    isNear(p: Point2d, tolerance:number): boolean {
        return Point2d.IsNear(this,p, tolerance);
    }
    getAngleByPoints(pre:Point2d, next:Point2d){
        return Point2d.GetAngleByPoints(pre,this,next);
    }
    static Sub(A: PointLike, B: VecLike): Point2d {
		return new Point2d(A.x - B.x, A.y - B.y)
	}
    static Add(A: PointLike, B: VecLike): Point2d {
		return new Point2d(A.x + B.x, A.y + B.y)
	}
    static GetDistance(p0:Point2d, p1:Point2d):number {
        return Point2d.Len(p0.clone().sub(p1));
    }
    static GetAngleByPoints(pre:Point2d, cur:Point2d, next:Point2d):number {
        const xa = cur.x - pre.x
        const xb = next.x - cur.x
        const ya = cur.y - pre.y
        const yb = next.y - cur.y
        let angle = 0
        const _a = Math.sqrt(xa * xa + ya * ya)
        const _b = Math.sqrt(xb * xb + yb * yb)
        if(_a && _b){
          const p = xa * xb + ya * yb
          angle = Math.acos(p / (_a * _b))
          angle = angle / Math.PI * 180
          //direction 大于0 逆时针, 小于0 顺时针, 等于0 平行
          let direction = xa * yb - ya * xb
          direction = direction > 0 ? 1 : -1
          angle = 180 + direction * angle
        }
        return angle
    }
    static IsNear(p0:Point2d, p1:Point2d, tolerance:number):boolean{
        return Point2d.Len(p0.clone().sub(p1)) < tolerance;
    }
    static RotWith(A: Point2d | Vec2d, C: Point2d | Vec2d, r: number, decimal:number = 2 ): Point2d {
		const x = A.x - C.x
		const y = A.y - C.y
		const s = Math.sin(r)
		const c = Math.cos(r)
        const step =  Math.pow(10, decimal);
        const X = Math.floor((C.x + (x * c - y * s)) * step) / step;
        const Y = Math.floor((C.y + (x * s + y * c)) * step) / step;
		return new Point2d(X, Y)
	}
    /**
     * 根据圆心和半径，获取圆上的等份点
     * @param o 圆心
     * @param radius 半径 
     * @param average 均分数
     * @returns 
     */
    static GetDotStroke(o:Point2d, radius:number, average:number = 16):Point2d[] {
        const _v = new Vec2d(1,1);
        const FIXED_PI = Math.PI + 0.001;
        const start = Point2d.Add(o, Point2d.Sub(o,_v).uni().per().mul(-radius));
        const dotPts: Point2d[] = []
        for (let step = 1 / average, t = step; t <= 1; t += step) {
          dotPts.push(Point2d.RotWith(start, o, FIXED_PI * 2 * t))
        }
        return dotPts;
    }
    /**
     * 根据圆心和圆上的起始点，获取半圆上的等份点
     * @param o 圆心 
     * @param p 圆弧起始点
     * @param radian 1，逆时针180度 -1，顺时针 
     * @param average 均分数
     * @returns 
     */
    static GetSemicircleStroke(o:Point2d, p:Point2d, radian:number = -1, average:number = 8):Point2d[] {
        const PI = radian * (Math.PI + 0.001);
        const dotPts: Point2d[] = []
        for (let step = 1 / average, t = step; t <= 1; t += step) {
            dotPts.push(Point2d.RotWith(p, o, PI * t))
          }
        return dotPts;
    }
}