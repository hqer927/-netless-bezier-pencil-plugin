import { toJS as dt, autorun as bt, ApplianceNames as E, isRoom as ll, isPlayer as Qc, InvisiblePlugin as st } from "white-web-sdk";
import "spritejs";
import { decompress as ft, compress as Qt } from "lz-string";
import "lineclip";
import at from "eventemitter2";
import { cloneDeep as ne } from "lodash";
import Oc from "react-dom";
import h, { useContext as Gl, useState as A, useMemo as O, useEffect as bl, useRef as Ol, useCallback as Ot } from "react";
import ic from "react-draggable";
import { Resizable as Bt } from "re-resizable";
const Dt = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  easeInSine: (t) => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: (t) => Math.sin(t * Math.PI / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInExpo: (t) => t <= 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo: (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t) => t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
};
class S {
  constructor(l = 0, c = 0, e = 1) {
    Object.defineProperty(this, "x", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: l
    }), Object.defineProperty(this, "y", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: c
    }), Object.defineProperty(this, "z", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e
    });
  }
  get XY() {
    return [this.x, this.y];
  }
  setz(l) {
    return this.z = l, this;
  }
  setXY(l = this.x, c = this.y) {
    return this.x = l, this.y = c, this;
  }
  set(l = this.x, c = this.y, e = this.z) {
    return this.x = l, this.y = c, this.z = e, this;
  }
  setTo({ x: l = 0, y: c = 0, z: e = 1 }) {
    return this.x = l, this.y = c, this.z = e, this;
  }
  rot(l) {
    if (l === 0)
      return this;
    const { x: c, y: e } = this, d = Math.sin(l), b = Math.cos(l);
    return this.x = c * b - e * d, this.y = c * d + e * b, this;
  }
  rotWith(l, c) {
    if (c === 0)
      return this;
    const e = this.x - l.x, d = this.y - l.y, b = Math.sin(c), s = Math.cos(c);
    return this.x = l.x + (e * s - d * b), this.y = l.y + (e * b + d * s), this;
  }
  clone() {
    const { x: l, y: c, z: e } = this;
    return new S(l, c, e);
  }
  sub(l) {
    return this.x -= l.x, this.y -= l.y, this;
  }
  subXY(l, c) {
    return this.x -= l, this.y -= c, this;
  }
  subScalar(l) {
    return this.x -= l, this.y -= l, this;
  }
  add(l) {
    return this.x += l.x, this.y += l.y, this;
  }
  addXY(l, c) {
    return this.x += l, this.y += c, this;
  }
  addScalar(l) {
    return this.x += l, this.y += l, this;
  }
  clamp(l, c) {
    return this.x = Math.max(this.x, l), this.y = Math.max(this.y, l), c !== void 0 && (this.x = Math.min(this.x, c), this.y = Math.min(this.y, c)), this;
  }
  div(l) {
    return this.x /= l, this.y /= l, this;
  }
  divV(l) {
    return this.x /= l.x, this.y /= l.y, this;
  }
  mul(l) {
    return this.x *= l, this.y *= l, this;
  }
  mulV(l) {
    return this.x *= l.x, this.y *= l.y, this;
  }
  abs() {
    return this.x = Math.abs(this.x), this.y = Math.abs(this.y), this;
  }
  nudge(l, c) {
    const e = S.Tan(l, this);
    return this.add(e.mul(c));
  }
  neg() {
    return this.x *= -1, this.y *= -1, this;
  }
  cross(l) {
    return this.x = this.y * l.z - this.z * l.y, this.y = this.z * l.x - this.x * l.z, this;
  }
  dpr(l) {
    return S.Dpr(this, l);
  }
  cpr(l) {
    return S.Cpr(this, l);
  }
  len2() {
    return S.Len2(this);
  }
  len() {
    return S.Len(this);
  }
  pry(l) {
    return S.Pry(this, l);
  }
  per() {
    const { x: l, y: c } = this;
    return this.x = c, this.y = -l, this;
  }
  uni() {
    return S.Uni(this);
  }
  tan(l) {
    return S.Tan(this, l);
  }
  dist(l) {
    return S.Dist(this, l);
  }
  distanceToLineSegment(l, c) {
    return S.DistanceToLineSegment(l, c, this);
  }
  slope(l) {
    return S.Slope(this, l);
  }
  snapToGrid(l) {
    return this.x = Math.round(this.x / l) * l, this.y = Math.round(this.y / l) * l, this;
  }
  angle(l) {
    return S.Angle(this, l);
  }
  toAngle() {
    return S.ToAngle(this);
  }
  lrp(l, c) {
    return this.x = this.x + (l.x - this.x) * c, this.y = this.y + (l.y - this.y) * c, this;
  }
  equals(l, c) {
    return S.Equals(this, l, c);
  }
  equalsXY(l, c) {
    return S.EqualsXY(this, l, c);
  }
  norm() {
    const l = this.len();
    return this.x = l === 0 ? 0 : this.x / l, this.y = l === 0 ? 0 : this.y / l, this;
  }
  toFixed() {
    return S.ToFixed(this);
  }
  toString() {
    return S.ToString(S.ToFixed(this));
  }
  toJson() {
    return S.ToJson(this);
  }
  toArray() {
    return S.ToArray(this);
  }
  static Add(l, c) {
    return new S(l.x + c.x, l.y + c.y);
  }
  static AddXY(l, c, e) {
    return new S(l.x + c, l.y + e);
  }
  static Sub(l, c) {
    return new S(l.x - c.x, l.y - c.y);
  }
  static SubXY(l, c, e) {
    return new S(l.x - c, l.y - e);
  }
  static AddScalar(l, c) {
    return new S(l.x + c, l.y + c);
  }
  static SubScalar(l, c) {
    return new S(l.x - c, l.y - c);
  }
  static Div(l, c) {
    return new S(l.x / c, l.y / c);
  }
  static Mul(l, c) {
    return new S(l.x * c, l.y * c);
  }
  static DivV(l, c) {
    return new S(l.x / c.x, l.y / c.y);
  }
  static MulV(l, c) {
    return new S(l.x * c.x, l.y * c.y);
  }
  static Neg(l) {
    return new S(-l.x, -l.y);
  }
  static Per(l) {
    return new S(l.y, -l.x);
  }
  static Dist2(l, c) {
    return S.Sub(l, c).len2();
  }
  static Abs(l) {
    return new S(Math.abs(l.x), Math.abs(l.y));
  }
  static Dist(l, c) {
    return Math.hypot(l.y - c.y, l.x - c.x);
  }
  static Dpr(l, c) {
    return l.x * c.x + l.y * c.y;
  }
  static Cross(l, c) {
    return new S(
      l.y * c.z - l.z * c.y,
      l.z * c.x - l.x * c.z
      // A.z = A.x * V.y - A.y * V.x
    );
  }
  static Cpr(l, c) {
    return l.x * c.y - c.x * l.y;
  }
  static Len2(l) {
    return l.x * l.x + l.y * l.y;
  }
  static Len(l) {
    return Math.hypot(l.x, l.y);
  }
  static Pry(l, c) {
    return S.Dpr(l, c) / S.Len(c);
  }
  static Uni(l) {
    return S.Div(l, S.Len(l));
  }
  static Tan(l, c) {
    return S.Uni(S.Sub(l, c));
  }
  static Min(l, c) {
    return new S(Math.min(l.x, c.x), Math.min(l.y, c.y));
  }
  static Max(l, c) {
    return new S(Math.max(l.x, c.x), Math.max(l.y, c.y));
  }
  static From(l) {
    return new S().add(l);
  }
  static FromArray(l) {
    return new S(l[0], l[1]);
  }
  static Rot(l, c = 0) {
    const e = Math.sin(c), d = Math.cos(c);
    return new S(l.x * d - l.y * e, l.x * e + l.y * d);
  }
  static RotWith(l, c, e) {
    const d = l.x - c.x, b = l.y - c.y, s = Math.sin(e), a = Math.cos(e);
    return new S(c.x + (d * a - b * s), c.y + (d * s + b * a));
  }
  /**
   * Get the nearest point on a line with a known unit vector that passes through point A
   *
   * ```ts
   * Vec.nearestPointOnLineThroughPoint(A, u, Point)
   * ```
   *
   * @param A - Any point on the line
   * @param u - The unit vector for the line.
   * @param P - A point not on the line to test.
   */
  static NearestPointOnLineThroughPoint(l, c, e) {
    return S.Mul(c, S.Sub(e, l).pry(c)).add(l);
  }
  static NearestPointOnLineSegment(l, c, e, d = !0) {
    const b = S.Tan(c, l), s = S.Add(l, S.Mul(b, S.Sub(e, l).pry(b)));
    if (d) {
      if (s.x < Math.min(l.x, c.x))
        return S.Cast(l.x < c.x ? l : c);
      if (s.x > Math.max(l.x, c.x))
        return S.Cast(l.x > c.x ? l : c);
      if (s.y < Math.min(l.y, c.y))
        return S.Cast(l.y < c.y ? l : c);
      if (s.y > Math.max(l.y, c.y))
        return S.Cast(l.y > c.y ? l : c);
    }
    return s;
  }
  static DistanceToLineThroughPoint(l, c, e) {
    return S.Dist(e, S.NearestPointOnLineThroughPoint(l, c, e));
  }
  static DistanceToLineSegment(l, c, e, d = !0) {
    return S.Dist(e, S.NearestPointOnLineSegment(l, c, e, d));
  }
  static Snap(l, c = 1) {
    return new S(Math.round(l.x / c) * c, Math.round(l.y / c) * c);
  }
  static Cast(l) {
    return l instanceof S ? l : S.From(l);
  }
  static Slope(l, c) {
    return l.x === c.y ? NaN : (l.y - c.y) / (l.x - c.x);
  }
  static Angle(l, c) {
    return Math.atan2(c.y - l.y, c.x - l.x);
  }
  static Lrp(l, c, e) {
    return S.Sub(c, l).mul(e).add(l);
  }
  static Med(l, c) {
    return new S((l.x + c.x) / 2, (l.y + c.y) / 2);
  }
  static Equals(l, c, e = 1e-4) {
    return Math.abs(l.x - c.x) < e && Math.abs(l.y - c.y) < e;
  }
  static EqualsXY(l, c, e) {
    return l.x === c && l.y === e;
  }
  static EqualsXYZ(l, c, e = 1e-4) {
    return S.Equals(l, c, e) && Math.abs((l.z || 0) - (c.z || 0)) < e;
  }
  static Clockwise(l, c, e) {
    return (e.x - l.x) * (c.y - l.y) - (c.x - l.x) * (e.y - l.y) < 0;
  }
  static Rescale(l, c) {
    const e = S.Len(l);
    return new S(c * l.x / e, c * l.y / e);
  }
  static ScaleWithOrigin(l, c, e) {
    return S.Sub(l, e).mul(c).add(e);
  }
  static ScaleWOrigin(l, c, e) {
    return S.Sub(l, e).mulV(c).add(e);
  }
  static ToFixed(l, c = 2) {
    return new S(+l.x.toFixed(c), +l.y.toFixed(c), +l.z.toFixed(c));
  }
  static Nudge(l, c, e) {
    return S.Add(l, S.Tan(c, l).mul(e));
  }
  static ToString(l) {
    return `${l.x}, ${l.y}`;
  }
  static ToAngle(l) {
    let c = Math.atan2(l.y, l.x);
    return c < 0 && (c += Math.PI * 2), c;
  }
  static FromAngle(l, c = 1) {
    return new S(Math.cos(l) * c, Math.sin(l) * c);
  }
  static ToArray(l) {
    return [l.x, l.y, l.z];
  }
  static ToJson(l) {
    const { x: c, y: e, z: d } = l;
    return { x: c, y: e, z: d };
  }
  static Average(l) {
    const c = l.length, e = new S(0, 0);
    for (let d = 0; d < c; d++)
      e.add(l[d]);
    return e.div(c);
  }
  static Clamp(l, c, e) {
    return e === void 0 ? new S(Math.min(Math.max(l.x, c)), Math.min(Math.max(l.y, c))) : new S(Math.min(Math.max(l.x, c), e), Math.min(Math.max(l.y, c), e));
  }
  /**
   * Get an array of points (with simulated pressure) between two points.
   *
   * @param A - The first point.
   * @param B - The second point.
   * @param steps - The number of points to return.
   */
  static PointsBetween(l, c, e = 6) {
    const d = [];
    for (let b = 0; b < e; b++) {
      const s = Dt.easeInQuad(b / (e - 1)), a = S.Lrp(l, c, s);
      a.z = Math.min(1, 0.5 + Math.abs(0.5 - Et(s)) * 0.65), d.push(a);
    }
    return d;
  }
  static SnapToGrid(l, c = 8) {
    return new S(Math.round(l.x / c) * c, Math.round(l.y / c) * c);
  }
}
const Et = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
class dl extends S {
  constructor(l = 0, c = 0, e = 0, d = { x: 0, y: 0 }, b = 0, s = 0) {
    super(l, c, e), Object.defineProperty(this, "x", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: l
    }), Object.defineProperty(this, "y", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: c
    }), Object.defineProperty(this, "z", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e
    }), Object.defineProperty(this, "v", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: d
    }), Object.defineProperty(this, "t", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: b
    }), Object.defineProperty(this, "a", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s
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
  setA(l) {
    this.a = l;
  }
  setT(l) {
    this.t = l;
  }
  setv(l) {
    return this.v = { x: l.x, y: l.y }, this;
  }
  set(l = this.x, c = this.y, e = this.z, d = this.v, b = this.t, s = this.a) {
    return this.x = l, this.y = c, this.z = e, this.v = d, this.t = b, this.a = s, this;
  }
  clone() {
    const { x: l, y: c, z: e, v: d, t: b, a: s } = this, a = { x: d.x, y: d.y };
    return new dl(l, c, e, a, b, s);
  }
  distance(l) {
    return dl.GetDistance(this, l);
  }
  isNear(l, c) {
    return dl.IsNear(this, l, c);
  }
  getAngleByPoints(l, c) {
    return dl.GetAngleByPoints(l, this, c);
  }
  static Sub(l, c) {
    return new dl(l.x - c.x, l.y - c.y);
  }
  static Add(l, c) {
    return new dl(l.x + c.x, l.y + c.y);
  }
  static GetDistance(l, c) {
    return dl.Len(l.clone().sub(c));
  }
  static GetAngleByPoints(l, c, e) {
    const d = c.x - l.x, b = e.x - c.x, s = c.y - l.y, a = e.y - c.y;
    let i = 0;
    const n = Math.sqrt(d * d + s * s), Z = Math.sqrt(b * b + a * a);
    if (n && Z) {
      const o = d * b + s * a;
      i = Math.acos(o / (n * Z)), i = i / Math.PI * 180;
      let m = d * a - s * b;
      m = m > 0 ? 1 : -1, i = 180 + m * i;
    }
    return i;
  }
  static IsNear(l, c, e) {
    return dl.Len(l.clone().sub(c)) < e;
  }
  static RotWith(l, c, e, d = 2) {
    const b = l.x - c.x, s = l.y - c.y, a = Math.sin(e), i = Math.cos(e), n = Math.pow(10, d), Z = Math.floor((c.x + (b * i - s * a)) * n) / n, o = Math.floor((c.y + (b * a + s * i)) * n) / n;
    return new dl(Z, o);
  }
  /**
   * 根据圆心和半径，获取圆上的等份点
   * @param o 圆心
   * @param radius 半径
   * @param average 均分数
   * @returns
   */
  static GetDotStroke(l, c, e = 16) {
    const d = new S(1, 1), b = Math.PI + 1e-3, s = dl.Add(l, dl.Sub(l, d).uni().per().mul(-c)), a = [];
    for (let i = 1 / e, n = i; n <= 1; n += i)
      a.push(dl.RotWith(s, l, b * 2 * n));
    return a;
  }
  /**
   * 根据圆心和圆上的起始点，获取半圆上的等份点
   * @param o 圆心
   * @param p 圆弧起始点
   * @param radian 1，逆时针180度 -1，顺时针
   * @param average 均分数
   * @returns
   */
  static GetSemicircleStroke(l, c, e = -1, d = 8) {
    const b = e * (Math.PI + 1e-3), s = [];
    for (let a = 1 / d, i = a; i <= 1; i += a)
      s.push(dl.RotWith(c, l, b * i));
    return s;
  }
}
var oc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Bl(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var At = typeof oc == "object" && oc && oc.Object === Object && oc, it = At, qt = it, $t = typeof self == "object" && self && self.Object === Object && self, _t = qt || $t || Function("return this")(), zl = _t, ld = zl, cd = ld.Symbol, xc = cd, Ze = xc, nt = Object.prototype, ed = nt.hasOwnProperty, td = nt.toString, bc = Ze ? Ze.toStringTag : void 0;
function dd(t) {
  var l = ed.call(t, bc), c = t[bc];
  try {
    t[bc] = void 0;
    var e = !0;
  } catch {
  }
  var d = td.call(t);
  return e && (l ? t[bc] = c : delete t[bc]), d;
}
var bd = dd, sd = Object.prototype, ad = sd.toString;
function id(t) {
  return ad.call(t);
}
var nd = id, oe = xc, Zd = bd, od = nd, md = "[object Null]", Gd = "[object Undefined]", me = oe ? oe.toStringTag : void 0;
function ud(t) {
  return t == null ? t === void 0 ? Gd : md : me && me in Object(t) ? Zd(t) : od(t);
}
var Dl = ud;
function hd(t) {
  return t != null && typeof t == "object";
}
var gl = hd, pd = Dl, yd = gl, Wd = "[object Number]";
function Xd(t) {
  return typeof t == "number" || yd(t) && pd(t) == Wd;
}
var rd = Xd;
const yl = /* @__PURE__ */ Bl(rd);
function Vd() {
  this.__data__ = [], this.size = 0;
}
var Yd = Vd;
function Ld(t, l) {
  return t === l || t !== t && l !== l;
}
var Bc = Ld, xd = Bc;
function Rd(t, l) {
  for (var c = t.length; c--; )
    if (xd(t[c][0], l))
      return c;
  return -1;
}
var Rc = Rd, Nd = Rc, Md = Array.prototype, Td = Md.splice;
function Sd(t) {
  var l = this.__data__, c = Nd(l, t);
  if (c < 0)
    return !1;
  var e = l.length - 1;
  return c == e ? l.pop() : Td.call(l, c, 1), --this.size, !0;
}
var zd = Sd, Id = Rc;
function vd(t) {
  var l = this.__data__, c = Id(l, t);
  return c < 0 ? void 0 : l[c][1];
}
var Hd = vd, Jd = Rc;
function kd(t) {
  return Jd(this.__data__, t) > -1;
}
var Cd = kd, Kd = Rc;
function wd(t, l) {
  var c = this.__data__, e = Kd(c, t);
  return e < 0 ? (++this.size, c.push([t, l])) : c[e][1] = l, this;
}
var gd = wd, Fd = Yd, Ud = zd, jd = Hd, Pd = Cd, fd = gd;
function lc(t) {
  var l = -1, c = t == null ? 0 : t.length;
  for (this.clear(); ++l < c; ) {
    var e = t[l];
    this.set(e[0], e[1]);
  }
}
lc.prototype.clear = Fd;
lc.prototype.delete = Ud;
lc.prototype.get = jd;
lc.prototype.has = Pd;
lc.prototype.set = fd;
var Nc = lc, Qd = Nc;
function Od() {
  this.__data__ = new Qd(), this.size = 0;
}
var Bd = Od;
function Dd(t) {
  var l = this.__data__, c = l.delete(t);
  return this.size = l.size, c;
}
var Ed = Dd;
function Ad(t) {
  return this.__data__.get(t);
}
var qd = Ad;
function $d(t) {
  return this.__data__.has(t);
}
var _d = $d;
function lb(t) {
  var l = typeof t;
  return t != null && (l == "object" || l == "function");
}
var jl = lb, cb = Dl, eb = jl, tb = "[object AsyncFunction]", db = "[object Function]", bb = "[object GeneratorFunction]", sb = "[object Proxy]";
function ab(t) {
  if (!eb(t))
    return !1;
  var l = cb(t);
  return l == db || l == bb || l == tb || l == sb;
}
var Zt = ab, ib = zl, nb = ib["__core-js_shared__"], Zb = nb, Hc = Zb, Ge = function() {
  var t = /[^.]+$/.exec(Hc && Hc.keys && Hc.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function ob(t) {
  return !!Ge && Ge in t;
}
var mb = ob, Gb = Function.prototype, ub = Gb.toString;
function hb(t) {
  if (t != null) {
    try {
      return ub.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var ot = hb, pb = Zt, yb = mb, Wb = jl, Xb = ot, rb = /[\\^$.*+?()[\]{}|]/g, Vb = /^\[object .+?Constructor\]$/, Yb = Function.prototype, Lb = Object.prototype, xb = Yb.toString, Rb = Lb.hasOwnProperty, Nb = RegExp(
  "^" + xb.call(Rb).replace(rb, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Mb(t) {
  if (!Wb(t) || yb(t))
    return !1;
  var l = pb(t) ? Nb : Vb;
  return l.test(Xb(t));
}
var Tb = Mb;
function Sb(t, l) {
  return t == null ? void 0 : t[l];
}
var zb = Sb, Ib = Tb, vb = zb;
function Hb(t, l) {
  var c = vb(t, l);
  return Ib(c) ? c : void 0;
}
var El = Hb, Jb = El, kb = zl, Cb = Jb(kb, "Map"), Dc = Cb, Kb = El, wb = Kb(Object, "create"), Mc = wb, ue = Mc;
function gb() {
  this.__data__ = ue ? ue(null) : {}, this.size = 0;
}
var Fb = gb;
function Ub(t) {
  var l = this.has(t) && delete this.__data__[t];
  return this.size -= l ? 1 : 0, l;
}
var jb = Ub, Pb = Mc, fb = "__lodash_hash_undefined__", Qb = Object.prototype, Ob = Qb.hasOwnProperty;
function Bb(t) {
  var l = this.__data__;
  if (Pb) {
    var c = l[t];
    return c === fb ? void 0 : c;
  }
  return Ob.call(l, t) ? l[t] : void 0;
}
var Db = Bb, Eb = Mc, Ab = Object.prototype, qb = Ab.hasOwnProperty;
function $b(t) {
  var l = this.__data__;
  return Eb ? l[t] !== void 0 : qb.call(l, t);
}
var _b = $b, ls = Mc, cs = "__lodash_hash_undefined__";
function es(t, l) {
  var c = this.__data__;
  return this.size += this.has(t) ? 0 : 1, c[t] = ls && l === void 0 ? cs : l, this;
}
var ts = es, ds = Fb, bs = jb, ss = Db, as = _b, is = ts;
function cc(t) {
  var l = -1, c = t == null ? 0 : t.length;
  for (this.clear(); ++l < c; ) {
    var e = t[l];
    this.set(e[0], e[1]);
  }
}
cc.prototype.clear = ds;
cc.prototype.delete = bs;
cc.prototype.get = ss;
cc.prototype.has = as;
cc.prototype.set = is;
var ns = cc, he = ns, Zs = Nc, os = Dc;
function ms() {
  this.size = 0, this.__data__ = {
    hash: new he(),
    map: new (os || Zs)(),
    string: new he()
  };
}
var Gs = ms;
function us(t) {
  var l = typeof t;
  return l == "string" || l == "number" || l == "symbol" || l == "boolean" ? t !== "__proto__" : t === null;
}
var hs = us, ps = hs;
function ys(t, l) {
  var c = t.__data__;
  return ps(l) ? c[typeof l == "string" ? "string" : "hash"] : c.map;
}
var Tc = ys, Ws = Tc;
function Xs(t) {
  var l = Ws(this, t).delete(t);
  return this.size -= l ? 1 : 0, l;
}
var rs = Xs, Vs = Tc;
function Ys(t) {
  return Vs(this, t).get(t);
}
var Ls = Ys, xs = Tc;
function Rs(t) {
  return xs(this, t).has(t);
}
var Ns = Rs, Ms = Tc;
function Ts(t, l) {
  var c = Ms(this, t), e = c.size;
  return c.set(t, l), this.size += c.size == e ? 0 : 1, this;
}
var Ss = Ts, zs = Gs, Is = rs, vs = Ls, Hs = Ns, Js = Ss;
function ec(t) {
  var l = -1, c = t == null ? 0 : t.length;
  for (this.clear(); ++l < c; ) {
    var e = t[l];
    this.set(e[0], e[1]);
  }
}
ec.prototype.clear = zs;
ec.prototype.delete = Is;
ec.prototype.get = vs;
ec.prototype.has = Hs;
ec.prototype.set = Js;
var mt = ec, ks = Nc, Cs = Dc, Ks = mt, ws = 200;
function gs(t, l) {
  var c = this.__data__;
  if (c instanceof ks) {
    var e = c.__data__;
    if (!Cs || e.length < ws - 1)
      return e.push([t, l]), this.size = ++c.size, this;
    c = this.__data__ = new Ks(e);
  }
  return c.set(t, l), this.size = c.size, this;
}
var Fs = gs, Us = Nc, js = Bd, Ps = Ed, fs = qd, Qs = _d, Os = Fs;
function tc(t) {
  var l = this.__data__ = new Us(t);
  this.size = l.size;
}
tc.prototype.clear = js;
tc.prototype.delete = Ps;
tc.prototype.get = fs;
tc.prototype.has = Qs;
tc.prototype.set = Os;
var Gt = tc;
function Bs(t, l) {
  for (var c = -1, e = t == null ? 0 : t.length; ++c < e && l(t[c], c, t) !== !1; )
    ;
  return t;
}
var Ds = Bs, Es = El, As = function() {
  try {
    var t = Es(Object, "defineProperty");
    return t({}, "", {}), t;
  } catch {
  }
}(), qs = As, pe = qs;
function $s(t, l, c) {
  l == "__proto__" && pe ? pe(t, l, {
    configurable: !0,
    enumerable: !0,
    value: c,
    writable: !0
  }) : t[l] = c;
}
var ut = $s, _s = ut, la = Bc, ca = Object.prototype, ea = ca.hasOwnProperty;
function ta(t, l, c) {
  var e = t[l];
  (!(ea.call(t, l) && la(e, c)) || c === void 0 && !(l in t)) && _s(t, l, c);
}
var ht = ta, da = ht, ba = ut;
function sa(t, l, c, e) {
  var d = !c;
  c || (c = {});
  for (var b = -1, s = l.length; ++b < s; ) {
    var a = l[b], i = e ? e(c[a], t[a], a, c, t) : void 0;
    i === void 0 && (i = t[a]), d ? ba(c, a, i) : da(c, a, i);
  }
  return c;
}
var Sc = sa;
function aa(t, l) {
  for (var c = -1, e = Array(t); ++c < t; )
    e[c] = l(c);
  return e;
}
var ia = aa, na = Dl, Za = gl, oa = "[object Arguments]";
function ma(t) {
  return Za(t) && na(t) == oa;
}
var Ga = ma, ye = Ga, ua = gl, pt = Object.prototype, ha = pt.hasOwnProperty, pa = pt.propertyIsEnumerable, ya = ye(/* @__PURE__ */ function() {
  return arguments;
}()) ? ye : function(t) {
  return ua(t) && ha.call(t, "callee") && !pa.call(t, "callee");
}, Wa = ya, Xa = Array.isArray, zc = Xa, Wc = { exports: {} };
function ra() {
  return !1;
}
var Va = ra;
Wc.exports;
(function(t, l) {
  var c = zl, e = Va, d = l && !l.nodeType && l, b = d && !0 && t && !t.nodeType && t, s = b && b.exports === d, a = s ? c.Buffer : void 0, i = a ? a.isBuffer : void 0, n = i || e;
  t.exports = n;
})(Wc, Wc.exports);
var Ec = Wc.exports, Ya = 9007199254740991, La = /^(?:0|[1-9]\d*)$/;
function xa(t, l) {
  var c = typeof t;
  return l = l ?? Ya, !!l && (c == "number" || c != "symbol" && La.test(t)) && t > -1 && t % 1 == 0 && t < l;
}
var Ra = xa, Na = 9007199254740991;
function Ma(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= Na;
}
var yt = Ma, Ta = Dl, Sa = yt, za = gl, Ia = "[object Arguments]", va = "[object Array]", Ha = "[object Boolean]", Ja = "[object Date]", ka = "[object Error]", Ca = "[object Function]", Ka = "[object Map]", wa = "[object Number]", ga = "[object Object]", Fa = "[object RegExp]", Ua = "[object Set]", ja = "[object String]", Pa = "[object WeakMap]", fa = "[object ArrayBuffer]", Qa = "[object DataView]", Oa = "[object Float32Array]", Ba = "[object Float64Array]", Da = "[object Int8Array]", Ea = "[object Int16Array]", Aa = "[object Int32Array]", qa = "[object Uint8Array]", $a = "[object Uint8ClampedArray]", _a = "[object Uint16Array]", li = "[object Uint32Array]", el = {};
el[Oa] = el[Ba] = el[Da] = el[Ea] = el[Aa] = el[qa] = el[$a] = el[_a] = el[li] = !0;
el[Ia] = el[va] = el[fa] = el[Ha] = el[Qa] = el[Ja] = el[ka] = el[Ca] = el[Ka] = el[wa] = el[ga] = el[Fa] = el[Ua] = el[ja] = el[Pa] = !1;
function ci(t) {
  return za(t) && Sa(t.length) && !!el[Ta(t)];
}
var ei = ci;
function ti(t) {
  return function(l) {
    return t(l);
  };
}
var Ac = ti, Xc = { exports: {} };
Xc.exports;
(function(t, l) {
  var c = it, e = l && !l.nodeType && l, d = e && !0 && t && !t.nodeType && t, b = d && d.exports === e, s = b && c.process, a = function() {
    try {
      var i = d && d.require && d.require("util").types;
      return i || s && s.binding && s.binding("util");
    } catch {
    }
  }();
  t.exports = a;
})(Xc, Xc.exports);
var qc = Xc.exports, di = ei, bi = Ac, We = qc, Xe = We && We.isTypedArray, si = Xe ? bi(Xe) : di, Wt = si, ai = ia, ii = Wa, ni = zc, Zi = Ec, oi = Ra, mi = Wt, Gi = Object.prototype, ui = Gi.hasOwnProperty;
function hi(t, l) {
  var c = ni(t), e = !c && ii(t), d = !c && !e && Zi(t), b = !c && !e && !d && mi(t), s = c || e || d || b, a = s ? ai(t.length, String) : [], i = a.length;
  for (var n in t)
    (l || ui.call(t, n)) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (n == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    d && (n == "offset" || n == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    b && (n == "buffer" || n == "byteLength" || n == "byteOffset") || // Skip index properties.
    oi(n, i))) && a.push(n);
  return a;
}
var Xt = hi, pi = Object.prototype;
function yi(t) {
  var l = t && t.constructor, c = typeof l == "function" && l.prototype || pi;
  return t === c;
}
var $c = yi;
function Wi(t, l) {
  return function(c) {
    return t(l(c));
  };
}
var rt = Wi, Xi = rt, ri = Xi(Object.keys, Object), Vi = ri, Yi = $c, Li = Vi, xi = Object.prototype, Ri = xi.hasOwnProperty;
function Ni(t) {
  if (!Yi(t))
    return Li(t);
  var l = [];
  for (var c in Object(t))
    Ri.call(t, c) && c != "constructor" && l.push(c);
  return l;
}
var Mi = Ni, Ti = Zt, Si = yt;
function zi(t) {
  return t != null && Si(t.length) && !Ti(t);
}
var Vt = zi, Ii = Xt, vi = Mi, Hi = Vt;
function Ji(t) {
  return Hi(t) ? Ii(t) : vi(t);
}
var _c = Ji, ki = Sc, Ci = _c;
function Ki(t, l) {
  return t && ki(l, Ci(l), t);
}
var wi = Ki;
function gi(t) {
  var l = [];
  if (t != null)
    for (var c in Object(t))
      l.push(c);
  return l;
}
var Fi = gi, Ui = jl, ji = $c, Pi = Fi, fi = Object.prototype, Qi = fi.hasOwnProperty;
function Oi(t) {
  if (!Ui(t))
    return Pi(t);
  var l = ji(t), c = [];
  for (var e in t)
    e == "constructor" && (l || !Qi.call(t, e)) || c.push(e);
  return c;
}
var Bi = Oi, Di = Xt, Ei = Bi, Ai = Vt;
function qi(t) {
  return Ai(t) ? Di(t, !0) : Ei(t);
}
var le = qi, $i = Sc, _i = le;
function ln(t, l) {
  return t && $i(l, _i(l), t);
}
var cn = ln, rc = { exports: {} };
rc.exports;
(function(t, l) {
  var c = zl, e = l && !l.nodeType && l, d = e && !0 && t && !t.nodeType && t, b = d && d.exports === e, s = b ? c.Buffer : void 0, a = s ? s.allocUnsafe : void 0;
  function i(n, Z) {
    if (Z)
      return n.slice();
    var o = n.length, m = a ? a(o) : new n.constructor(o);
    return n.copy(m), m;
  }
  t.exports = i;
})(rc, rc.exports);
var en = rc.exports;
function tn(t, l) {
  var c = -1, e = t.length;
  for (l || (l = Array(e)); ++c < e; )
    l[c] = t[c];
  return l;
}
var dn = tn;
function bn(t, l) {
  for (var c = -1, e = t == null ? 0 : t.length, d = 0, b = []; ++c < e; ) {
    var s = t[c];
    l(s, c, t) && (b[d++] = s);
  }
  return b;
}
var sn = bn;
function an() {
  return [];
}
var Yt = an, nn = sn, Zn = Yt, on = Object.prototype, mn = on.propertyIsEnumerable, re = Object.getOwnPropertySymbols, Gn = re ? function(t) {
  return t == null ? [] : (t = Object(t), nn(re(t), function(l) {
    return mn.call(t, l);
  }));
} : Zn, ce = Gn, un = Sc, hn = ce;
function pn(t, l) {
  return un(t, hn(t), l);
}
var yn = pn;
function Wn(t, l) {
  for (var c = -1, e = l.length, d = t.length; ++c < e; )
    t[d + c] = l[c];
  return t;
}
var Lt = Wn, Xn = rt, rn = Xn(Object.getPrototypeOf, Object), xt = rn, Vn = Lt, Yn = xt, Ln = ce, xn = Yt, Rn = Object.getOwnPropertySymbols, Nn = Rn ? function(t) {
  for (var l = []; t; )
    Vn(l, Ln(t)), t = Yn(t);
  return l;
} : xn, Rt = Nn, Mn = Sc, Tn = Rt;
function Sn(t, l) {
  return Mn(t, Tn(t), l);
}
var zn = Sn, In = Lt, vn = zc;
function Hn(t, l, c) {
  var e = l(t);
  return vn(t) ? e : In(e, c(t));
}
var Nt = Hn, Jn = Nt, kn = ce, Cn = _c;
function Kn(t) {
  return Jn(t, Cn, kn);
}
var Mt = Kn, wn = Nt, gn = Rt, Fn = le;
function Un(t) {
  return wn(t, Fn, gn);
}
var jn = Un, Pn = El, fn = zl, Qn = Pn(fn, "DataView"), On = Qn, Bn = El, Dn = zl, En = Bn(Dn, "Promise"), An = En, qn = El, $n = zl, _n = qn($n, "Set"), lZ = _n, cZ = El, eZ = zl, tZ = cZ(eZ, "WeakMap"), dZ = tZ, wc = On, gc = Dc, Fc = An, Uc = lZ, jc = dZ, Tt = Dl, dc = ot, Ve = "[object Map]", bZ = "[object Object]", Ye = "[object Promise]", Le = "[object Set]", xe = "[object WeakMap]", Re = "[object DataView]", sZ = dc(wc), aZ = dc(gc), iZ = dc(Fc), nZ = dc(Uc), ZZ = dc(jc), Pl = Tt;
(wc && Pl(new wc(new ArrayBuffer(1))) != Re || gc && Pl(new gc()) != Ve || Fc && Pl(Fc.resolve()) != Ye || Uc && Pl(new Uc()) != Le || jc && Pl(new jc()) != xe) && (Pl = function(t) {
  var l = Tt(t), c = l == bZ ? t.constructor : void 0, e = c ? dc(c) : "";
  if (e)
    switch (e) {
      case sZ:
        return Re;
      case aZ:
        return Ve;
      case iZ:
        return Ye;
      case nZ:
        return Le;
      case ZZ:
        return xe;
    }
  return l;
});
var Ic = Pl, oZ = Object.prototype, mZ = oZ.hasOwnProperty;
function GZ(t) {
  var l = t.length, c = new t.constructor(l);
  return l && typeof t[0] == "string" && mZ.call(t, "index") && (c.index = t.index, c.input = t.input), c;
}
var uZ = GZ, hZ = zl, pZ = hZ.Uint8Array, St = pZ, Ne = St;
function yZ(t) {
  var l = new t.constructor(t.byteLength);
  return new Ne(l).set(new Ne(t)), l;
}
var ee = yZ, WZ = ee;
function XZ(t, l) {
  var c = l ? WZ(t.buffer) : t.buffer;
  return new t.constructor(c, t.byteOffset, t.byteLength);
}
var rZ = XZ, VZ = /\w*$/;
function YZ(t) {
  var l = new t.constructor(t.source, VZ.exec(t));
  return l.lastIndex = t.lastIndex, l;
}
var LZ = YZ, Me = xc, Te = Me ? Me.prototype : void 0, Se = Te ? Te.valueOf : void 0;
function xZ(t) {
  return Se ? Object(Se.call(t)) : {};
}
var RZ = xZ, NZ = ee;
function MZ(t, l) {
  var c = l ? NZ(t.buffer) : t.buffer;
  return new t.constructor(c, t.byteOffset, t.length);
}
var TZ = MZ, SZ = ee, zZ = rZ, IZ = LZ, vZ = RZ, HZ = TZ, JZ = "[object Boolean]", kZ = "[object Date]", CZ = "[object Map]", KZ = "[object Number]", wZ = "[object RegExp]", gZ = "[object Set]", FZ = "[object String]", UZ = "[object Symbol]", jZ = "[object ArrayBuffer]", PZ = "[object DataView]", fZ = "[object Float32Array]", QZ = "[object Float64Array]", OZ = "[object Int8Array]", BZ = "[object Int16Array]", DZ = "[object Int32Array]", EZ = "[object Uint8Array]", AZ = "[object Uint8ClampedArray]", qZ = "[object Uint16Array]", $Z = "[object Uint32Array]";
function _Z(t, l, c) {
  var e = t.constructor;
  switch (l) {
    case jZ:
      return SZ(t);
    case JZ:
    case kZ:
      return new e(+t);
    case PZ:
      return zZ(t, c);
    case fZ:
    case QZ:
    case OZ:
    case BZ:
    case DZ:
    case EZ:
    case AZ:
    case qZ:
    case $Z:
      return HZ(t, c);
    case CZ:
      return new e();
    case KZ:
    case FZ:
      return new e(t);
    case wZ:
      return IZ(t);
    case gZ:
      return new e();
    case UZ:
      return vZ(t);
  }
}
var lo = _Z, co = jl, ze = Object.create, eo = /* @__PURE__ */ function() {
  function t() {
  }
  return function(l) {
    if (!co(l))
      return {};
    if (ze)
      return ze(l);
    t.prototype = l;
    var c = new t();
    return t.prototype = void 0, c;
  };
}(), to = eo, bo = to, so = xt, ao = $c;
function io(t) {
  return typeof t.constructor == "function" && !ao(t) ? bo(so(t)) : {};
}
var no = io, Zo = Ic, oo = gl, mo = "[object Map]";
function Go(t) {
  return oo(t) && Zo(t) == mo;
}
var uo = Go, ho = uo, po = Ac, Ie = qc, ve = Ie && Ie.isMap, yo = ve ? po(ve) : ho, Wo = yo, Xo = Ic, ro = gl, Vo = "[object Set]";
function Yo(t) {
  return ro(t) && Xo(t) == Vo;
}
var Lo = Yo, xo = Lo, Ro = Ac, He = qc, Je = He && He.isSet, No = Je ? Ro(Je) : xo, Mo = No, To = Gt, So = Ds, zo = ht, Io = wi, vo = cn, Ho = en, Jo = dn, ko = yn, Co = zn, Ko = Mt, wo = jn, go = Ic, Fo = uZ, Uo = lo, jo = no, Po = zc, fo = Ec, Qo = Wo, Oo = jl, Bo = Mo, Do = _c, Eo = le, Ao = 1, qo = 2, $o = 4, zt = "[object Arguments]", _o = "[object Array]", lm = "[object Boolean]", cm = "[object Date]", em = "[object Error]", It = "[object Function]", tm = "[object GeneratorFunction]", dm = "[object Map]", bm = "[object Number]", vt = "[object Object]", sm = "[object RegExp]", am = "[object Set]", im = "[object String]", nm = "[object Symbol]", Zm = "[object WeakMap]", om = "[object ArrayBuffer]", mm = "[object DataView]", Gm = "[object Float32Array]", um = "[object Float64Array]", hm = "[object Int8Array]", pm = "[object Int16Array]", ym = "[object Int32Array]", Wm = "[object Uint8Array]", Xm = "[object Uint8ClampedArray]", rm = "[object Uint16Array]", Vm = "[object Uint32Array]", cl = {};
cl[zt] = cl[_o] = cl[om] = cl[mm] = cl[lm] = cl[cm] = cl[Gm] = cl[um] = cl[hm] = cl[pm] = cl[ym] = cl[dm] = cl[bm] = cl[vt] = cl[sm] = cl[am] = cl[im] = cl[nm] = cl[Wm] = cl[Xm] = cl[rm] = cl[Vm] = !0;
cl[em] = cl[It] = cl[Zm] = !1;
function pc(t, l, c, e, d, b) {
  var s, a = l & Ao, i = l & qo, n = l & $o;
  if (c && (s = d ? c(t, e, d, b) : c(t)), s !== void 0)
    return s;
  if (!Oo(t))
    return t;
  var Z = Po(t);
  if (Z) {
    if (s = Fo(t), !a)
      return Jo(t, s);
  } else {
    var o = go(t), m = o == It || o == tm;
    if (fo(t))
      return Ho(t, a);
    if (o == vt || o == zt || m && !d) {
      if (s = i || m ? {} : jo(t), !a)
        return i ? Co(t, vo(s, t)) : ko(t, Io(s, t));
    } else {
      if (!cl[o])
        return d ? t : {};
      s = Uo(t, o, a);
    }
  }
  b || (b = new To());
  var G = b.get(t);
  if (G)
    return G;
  b.set(t, s), Bo(t) ? t.forEach(function(r) {
    s.add(pc(r, l, c, r, t, b));
  }) : Qo(t) && t.forEach(function(r, u) {
    s.set(u, pc(r, l, c, u, t, b));
  });
  var p = n ? i ? wo : Ko : i ? Eo : Do, W = Z ? void 0 : p(t);
  return So(W || t, function(r, u) {
    W && (u = r, r = t[u]), zo(s, u, pc(r, l, c, u, t, b));
  }), s;
}
var Ht = pc, Ym = Ht, Lm = 1, xm = 4;
function Rm(t) {
  return Ym(t, Lm | xm);
}
var Nm = Rm;
const sl = /* @__PURE__ */ Bl(Nm);
var X;
(function(t) {
  t[t.Pencil = 1] = "Pencil", t[t.Eraser = 2] = "Eraser", t[t.Selector = 3] = "Selector", t[t.Clicker = 4] = "Clicker", t[t.Arrow = 5] = "Arrow", t[t.Hand = 6] = "Hand", t[t.LaserPen = 7] = "LaserPen", t[t.Text = 8] = "Text", t[t.Straight = 9] = "Straight", t[t.Rectangle = 10] = "Rectangle", t[t.Ellipse = 11] = "Ellipse", t[t.Star = 12] = "Star", t[t.Triangle = 13] = "Triangle", t[t.Rhombus = 14] = "Rhombus", t[t.Polygon = 15] = "Polygon", t[t.SpeechBalloon = 16] = "SpeechBalloon", t[t.Image = 17] = "Image";
})(X || (X = {}));
var Q;
(function(t) {
  t[t.Local = 1] = "Local", t[t.Service = 2] = "Service", t[t.Worker = 3] = "Worker";
})(Q || (Q = {}));
var x;
(function(t) {
  t[t.Pending = 0] = "Pending", t[t.Start = 1] = "Start", t[t.Doing = 2] = "Doing", t[t.Done = 3] = "Done", t[t.Freeze = 4] = "Freeze", t[t.Unwritable = 5] = "Unwritable";
})(x || (x = {}));
var M;
(function(t) {
  t[t.None = 0] = "None", t[t.Init = 1] = "Init", t[t.UpdateCamera = 2] = "UpdateCamera", t[t.UpdateTools = 3] = "UpdateTools", t[t.CreateWork = 4] = "CreateWork", t[t.DrawWork = 5] = "DrawWork", t[t.FullWork = 6] = "FullWork", t[t.UpdateNode = 7] = "UpdateNode", t[t.RemoveNode = 8] = "RemoveNode", t[t.Clear = 9] = "Clear", t[t.Select = 10] = "Select", t[t.Destroy = 11] = "Destroy", t[t.Snapshot = 12] = "Snapshot", t[t.BoundingBox = 13] = "BoundingBox", t[t.Cursor = 14] = "Cursor", t[t.TextUpdate = 15] = "TextUpdate", t[t.GetTextActive = 16] = "GetTextActive", t[t.TasksQueue = 17] = "TasksQueue", t[t.CursorHover = 18] = "CursorHover";
})(M || (M = {}));
var ac;
(function(t) {
  t.Webgl2 = "webgl2", t.Webgl = "webgl", t.Canvas2d = "2d";
})(ac || (ac = {}));
var Il;
(function(t) {
  t[t.Float = 1] = "Float", t[t.Bg = 2] = "Bg", t[t.Selector = 3] = "Selector", t[t.ServiceFloat = 4] = "ServiceFloat", t[t.None = 5] = "None";
})(Il || (Il = {}));
var Ql;
(function(t) {
  t[t.Cursor = 1] = "Cursor", t[t.TextCreate = 2] = "TextCreate";
})(Ql || (Ql = {}));
var fl;
(function(t) {
  t[t.Top = 1] = "Top", t[t.Bottom = 2] = "Bottom";
})(fl || (fl = {}));
var rl;
(function(t) {
  t[t.none = 1] = "none", t[t.all = 2] = "all", t[t.both = 3] = "both", t[t.proportional = 4] = "proportional";
})(rl || (rl = {}));
function Mm(t) {
  return JSON.parse(ft(t));
}
function Tm(t) {
  return Qt(JSON.stringify(t));
}
const Yl = Object.keys;
var Pc;
(function(t) {
  t[t.pedding = 0] = "pedding", t[t.mounted = 1] = "mounted", t[t.update = 2] = "update", t[t.unmounted = 3] = "unmounted";
})(Pc || (Pc = {}));
var Vc;
(function(t) {
  t.Normal = "Normal", t.Stroke = "Stroke", t.Dotted = "Dotted", t.LongDotted = "LongDotted";
})(Vc || (Vc = {}));
var Tl;
(function(t) {
  t.Triangle = "triangle", t.Rhombus = "rhombus", t.Pentagram = "pentagram", t.SpeechBalloon = "speechBalloon", t.Star = "star", t.Polygon = "polygon";
})(Tl || (Tl = {}));
var R;
(function(t) {
  t.None = "None", t.ShowFloatBar = "ShowFloatBar", t.ZIndexFloatBar = "ZIndexFloatBar", t.DeleteNode = "DeleteNode", t.CopyNode = "CopyNode", t.ZIndexActive = "ZIndexActive", t.ZIndexNode = "ZIndexNode", t.RotateNode = "RotateNode", t.SetColorNode = "SetColorNode", t.TranslateNode = "TranslateNode", t.ScaleNode = "ScaleNode", t.OriginalEvent = "OriginalEvent", t.CreateScene = "CreateScene", t.ActiveCursor = "ActiveCursor", t.MoveCursor = "MoveCursor", t.CommandEditor = "CommandEditor", t.SetEditorData = "SetEditorData", t.SetFontStyle = "SetFontStyle", t.SetPoint = "SetPoint", t.SetLock = "SetLock", t.SetShapeOpt = "SetShapeOpt";
})(R || (R = {}));
var F;
(function(t) {
  t.DisplayState = "DisplayState", t.FloatBar = "FloatBar", t.CanvasSelector = "CanvasSelector", t.MainEngine = "MainEngine", t.DisplayContainer = "DisplayContainer", t.Cursor = "Cursor", t.TextEditor = "TextEditor", t.BindMainView = "BindMainView", t.MountMainView = "MountMainView", t.MountAppView = "MountAppView";
})(F || (F = {}));
var ke;
(function(t) {
  t[t.MainView = 0] = "MainView", t[t.Plugin = 1] = "Plugin", t[t.Both = 2] = "Both";
})(ke || (ke = {}));
const vl = "++", z = "selector", Sm = "all";
var zm = "__lodash_hash_undefined__";
function Im(t) {
  return this.__data__.set(t, zm), this;
}
var vm = Im;
function Hm(t) {
  return this.__data__.has(t);
}
var Jm = Hm, km = mt, Cm = vm, Km = Jm;
function Yc(t) {
  var l = -1, c = t == null ? 0 : t.length;
  for (this.__data__ = new km(); ++l < c; )
    this.add(t[l]);
}
Yc.prototype.add = Yc.prototype.push = Cm;
Yc.prototype.has = Km;
var wm = Yc;
function gm(t, l) {
  for (var c = -1, e = t == null ? 0 : t.length; ++c < e; )
    if (l(t[c], c, t))
      return !0;
  return !1;
}
var Fm = gm;
function Um(t, l) {
  return t.has(l);
}
var jm = Um, Pm = wm, fm = Fm, Qm = jm, Om = 1, Bm = 2;
function Dm(t, l, c, e, d, b) {
  var s = c & Om, a = t.length, i = l.length;
  if (a != i && !(s && i > a))
    return !1;
  var n = b.get(t), Z = b.get(l);
  if (n && Z)
    return n == l && Z == t;
  var o = -1, m = !0, G = c & Bm ? new Pm() : void 0;
  for (b.set(t, l), b.set(l, t); ++o < a; ) {
    var p = t[o], W = l[o];
    if (e)
      var r = s ? e(W, p, o, l, t, b) : e(p, W, o, t, l, b);
    if (r !== void 0) {
      if (r)
        continue;
      m = !1;
      break;
    }
    if (G) {
      if (!fm(l, function(u, V) {
        if (!Qm(G, V) && (p === u || d(p, u, c, e, b)))
          return G.push(V);
      })) {
        m = !1;
        break;
      }
    } else if (!(p === W || d(p, W, c, e, b))) {
      m = !1;
      break;
    }
  }
  return b.delete(t), b.delete(l), m;
}
var Jt = Dm;
function Em(t) {
  var l = -1, c = Array(t.size);
  return t.forEach(function(e, d) {
    c[++l] = [d, e];
  }), c;
}
var Am = Em;
function qm(t) {
  var l = -1, c = Array(t.size);
  return t.forEach(function(e) {
    c[++l] = e;
  }), c;
}
var $m = qm, Ce = xc, Ke = St, _m = Bc, lG = Jt, cG = Am, eG = $m, tG = 1, dG = 2, bG = "[object Boolean]", sG = "[object Date]", aG = "[object Error]", iG = "[object Map]", nG = "[object Number]", ZG = "[object RegExp]", oG = "[object Set]", mG = "[object String]", GG = "[object Symbol]", uG = "[object ArrayBuffer]", hG = "[object DataView]", we = Ce ? Ce.prototype : void 0, Jc = we ? we.valueOf : void 0;
function pG(t, l, c, e, d, b, s) {
  switch (c) {
    case hG:
      if (t.byteLength != l.byteLength || t.byteOffset != l.byteOffset)
        return !1;
      t = t.buffer, l = l.buffer;
    case uG:
      return !(t.byteLength != l.byteLength || !b(new Ke(t), new Ke(l)));
    case bG:
    case sG:
    case nG:
      return _m(+t, +l);
    case aG:
      return t.name == l.name && t.message == l.message;
    case ZG:
    case mG:
      return t == l + "";
    case iG:
      var a = cG;
    case oG:
      var i = e & tG;
      if (a || (a = eG), t.size != l.size && !i)
        return !1;
      var n = s.get(t);
      if (n)
        return n == l;
      e |= dG, s.set(t, l);
      var Z = lG(a(t), a(l), e, d, b, s);
      return s.delete(t), Z;
    case GG:
      if (Jc)
        return Jc.call(t) == Jc.call(l);
  }
  return !1;
}
var yG = pG, ge = Mt, WG = 1, XG = Object.prototype, rG = XG.hasOwnProperty;
function VG(t, l, c, e, d, b) {
  var s = c & WG, a = ge(t), i = a.length, n = ge(l), Z = n.length;
  if (i != Z && !s)
    return !1;
  for (var o = i; o--; ) {
    var m = a[o];
    if (!(s ? m in l : rG.call(l, m)))
      return !1;
  }
  var G = b.get(t), p = b.get(l);
  if (G && p)
    return G == l && p == t;
  var W = !0;
  b.set(t, l), b.set(l, t);
  for (var r = s; ++o < i; ) {
    m = a[o];
    var u = t[m], V = l[m];
    if (e)
      var y = s ? e(V, u, m, l, t, b) : e(u, V, m, t, l, b);
    if (!(y === void 0 ? u === V || d(u, V, c, e, b) : y)) {
      W = !1;
      break;
    }
    r || (r = m == "constructor");
  }
  if (W && !r) {
    var L = t.constructor, Y = l.constructor;
    L != Y && "constructor" in t && "constructor" in l && !(typeof L == "function" && L instanceof L && typeof Y == "function" && Y instanceof Y) && (W = !1);
  }
  return b.delete(t), b.delete(l), W;
}
var YG = VG, kc = Gt, LG = Jt, xG = yG, RG = YG, Fe = Ic, Ue = zc, je = Ec, NG = Wt, MG = 1, Pe = "[object Arguments]", fe = "[object Array]", mc = "[object Object]", TG = Object.prototype, Qe = TG.hasOwnProperty;
function SG(t, l, c, e, d, b) {
  var s = Ue(t), a = Ue(l), i = s ? fe : Fe(t), n = a ? fe : Fe(l);
  i = i == Pe ? mc : i, n = n == Pe ? mc : n;
  var Z = i == mc, o = n == mc, m = i == n;
  if (m && je(t)) {
    if (!je(l))
      return !1;
    s = !0, Z = !1;
  }
  if (m && !Z)
    return b || (b = new kc()), s || NG(t) ? LG(t, l, c, e, d, b) : xG(t, l, i, c, e, d, b);
  if (!(c & MG)) {
    var G = Z && Qe.call(t, "__wrapped__"), p = o && Qe.call(l, "__wrapped__");
    if (G || p) {
      var W = G ? t.value() : t, r = p ? l.value() : l;
      return b || (b = new kc()), d(W, r, c, e, b);
    }
  }
  return m ? (b || (b = new kc()), RG(t, l, c, e, d, b)) : !1;
}
var zG = SG, IG = zG, Oe = gl;
function kt(t, l, c, e, d) {
  return t === l ? !0 : t == null || l == null || !Oe(t) && !Oe(l) ? t !== t && l !== l : IG(t, l, c, e, kt, d);
}
var vG = kt, HG = vG;
function JG(t, l) {
  return HG(t, l);
}
var kG = JG;
const ol = /* @__PURE__ */ Bl(kG);
var CG = Dl, KG = gl, wG = "[object Boolean]";
function gG(t) {
  return t === !0 || t === !1 || KG(t) && CG(t) == wG;
}
var FG = gG;
const Vl = /* @__PURE__ */ Bl(FG);
function Ct(t, l) {
  if (t && l) {
    const c = Math.min(t.originX, l.originX), e = Math.min(t.originY, l.originY), d = Math.max(t.originX + t.width, l.originX + l.width), b = Math.max(t.originY + t.height, l.originY + l.height), s = d - c, a = b - e;
    return { originX: c, originY: e, width: s, height: a };
  }
  return l || t;
}
const _l = (t, l) => new Promise(function(c) {
  window.requestIdleCallback ? requestIdleCallback(() => {
    c(1);
  }, { timeout: l }) : setTimeout(() => {
    c(2);
  }, l);
}).then(function() {
  t();
}, () => {
  t();
}), te = (t) => {
  const l = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
  return Math.max(1, (window.devicePixelRatio || 1) / l);
};
class Kt {
  constructor(l) {
    Object.defineProperty(this, "plugin", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "uid", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.plugin = l, this.uid = l.displayer.uid;
  }
  getNamespaceData() {
    var l;
    return dt((l = this.plugin) == null ? void 0 : l.attributes[this.namespace]) || {};
  }
  getUidFromKey(l) {
    return l.split(vl).length === 2 && l.split(vl)[0] || this.uid;
  }
  isLocalId(l) {
    return l.split(vl).length === 1;
  }
  getLocalId(l) {
    return l.split(vl)[1];
  }
  isSelector(l) {
    return this.getLocalId(l) === z;
  }
}
class Cl extends Kt {
  constructor(l, c) {
    super(l), Object.defineProperty(this, "namespace", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "serviceStorage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {}
    }), Object.defineProperty(this, "storage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {}
    }), Object.defineProperty(this, "stateDisposer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "asyncClockState", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Cl.syncInterval = (c || Cl.syncInterval) * 0.5, this.namespace = Cl.namespace, this.serviceStorage = this.getNamespaceData(), this.storage = sl(this.serviceStorage);
  }
  getViewIdBySecenPath(l) {
    const c = this.getNamespaceData();
    for (const [e, d] of Object.entries(c))
      for (const b of Object.keys(d))
        if (b === l)
          return e;
  }
  getScenePathData(l) {
    const c = this.getNamespaceData();
    for (const e of Object.values(c))
      for (const d of Object.keys(e))
        if (d === l)
          return sl(e[d]);
  }
  getStorageData(l, c) {
    const e = this.getNamespaceData();
    return e[l] && sl(e[l][c]) || void 0;
  }
  hasSelector(l, c) {
    const e = this.storage && this.storage[l] && this.storage[l][c];
    return !!(e && Object.keys(e).find((d) => this.isOwn(d) && this.getLocalId(d) === z));
  }
  addStorageStateListener(l) {
    this.stateDisposer = bt(async () => {
      const c = this.getNamespaceData(), e = this.diffFun(this.serviceStorage, c);
      this.serviceStorage = c;
      for (const [d, b] of Object.entries(e))
        if (b && b.newValue === void 0) {
          const { viewId: s, scenePath: a } = b;
          s && a && this.storage[s] && delete this.storage[s][a][d];
        } else if (b && b.newValue) {
          const { viewId: s, scenePath: a } = b;
          this.storage[s] || (this.storage[s] = {}), this.storage[s][a] || (this.storage[s][a] = {}), this.storage[s][a][d] = sl(b.newValue);
        }
      Object.keys(e).length > 0 && l(e);
    });
  }
  removeStorageStateListener() {
    this.stateDisposer && this.stateDisposer();
  }
  diffFun(l, c) {
    const e = Yl(l), d = Yl(c), b = {};
    for (const s of e) {
      if (ol(l[s], c[s]))
        continue;
      const a = this.diffFunByscenePath(l[s] || {}, c[s] || {}, s);
      Object.assign(b, a);
    }
    for (const s of d)
      if (!e.includes(s)) {
        const a = this.diffFunByscenePath(l[s] || {}, c[s] || {}, s);
        Object.assign(b, a);
      }
    return b;
  }
  diffFunByscenePath(l, c, e) {
    const d = Yl(l), b = Yl(c), s = {};
    for (const a of d) {
      if (ol(l[a], c[a]))
        continue;
      const i = this.diffFunByKeys(l[a] || {}, c[a] || {}, a, e);
      Object.assign(s, i);
    }
    for (const a of b)
      if (!d.includes(a)) {
        const i = this.diffFunByKeys(l[a] || {}, c[a] || {}, a, e);
        Object.assign(s, i);
      }
    return s;
  }
  diffFunByKeys(l, c, e, d) {
    const b = Yl(l), s = Yl(c), a = {};
    for (const i of b) {
      if (s.includes(i)) {
        if (ol(l[i], c[i]))
          continue;
        a[i] = {
          oldValue: l[i],
          newValue: c[i],
          viewId: d,
          scenePath: e
        };
        continue;
      }
      a[i] = {
        oldValue: l[i],
        newValue: void 0,
        viewId: d,
        scenePath: e
      };
    }
    for (const i of s)
      b.includes(i) || (a[i] = {
        oldValue: void 0,
        newValue: c[i],
        viewId: d,
        scenePath: e
      });
    return a;
  }
  transformKey(l) {
    return this.uid + vl + l;
  }
  isOwn(l) {
    return l.split(vl)[0] === this.uid;
  }
  dispatch(l) {
    const { type: c, workId: e, ops: d, index: b, opt: s, toolsType: a, removeIds: i, updateNodeOpt: n, op: Z, selectIds: o, isSync: m, scenePath: G, viewId: p } = l;
    if (p)
      switch (c) {
        case M.Clear:
          const W = {};
          G && this.storage[p] && this.storage[p][G] ? (delete this.storage[p][G], this.setState(W, { isSync: m, viewId: p, scenePath: G })) : this.storage[p] && (delete this.storage[p], this.setState(W, { isSync: m, viewId: p, scenePath: "" }));
          break;
        case M.CreateWork:
          if (G && e && a && s) {
            const L = this.isLocalId(e.toString()) ? this.transformKey(e) : e;
            this.updateValue(L.toString(), {
              type: M.CreateWork,
              workId: e,
              toolsType: a,
              opt: s
            }, { isSync: m, viewId: p, scenePath: G });
          }
          break;
        case M.DrawWork:
          if (G && e && typeof b == "number" && (Z != null && Z.length)) {
            const L = this.isLocalId(e.toString()) ? this.transformKey(e) : e, Y = this.storage[p] && this.storage[p][G] && this.storage[p][G][L] || void 0, N = b ? ((Y == null ? void 0 : Y.op) || []).slice(0, b).concat(Z) : Z || (Y == null ? void 0 : Y.op);
            Y && N && this.updateValue(L.toString(), {
              ...Y,
              type: M.DrawWork,
              op: N,
              index: b
            }, { isSync: m, viewId: p, scenePath: G });
          }
          break;
        case M.FullWork:
          if (G && e) {
            const L = this.isLocalId(e.toString()) ? this.transformKey(e) : e, Y = this.storage[p] && this.storage[p][G] && this.storage[p][G][L] || void 0, N = n || (Y == null ? void 0 : Y.updateNodeOpt), T = a || (Y == null ? void 0 : Y.toolsType), I = s || (Y == null ? void 0 : Y.opt), C = d || (Y == null ? void 0 : Y.ops);
            T && I && this.updateValue(L.toString(), {
              type: M.FullWork,
              updateNodeOpt: N,
              workId: L,
              toolsType: T,
              opt: I,
              ops: C
            }, { isSync: m, viewId: p, scenePath: G });
          }
          break;
        case M.RemoveNode:
          if (G && (i != null && i.length)) {
            const L = i.map((Y) => this.isLocalId(Y + "") ? this.transformKey(Y) : Y);
            this.storage[p] && this.storage[p][G] && Object.keys(this.storage[p][G]).map((Y) => {
              L != null && L.includes(Y) && this.updateValue(Y, void 0, { isSync: m, viewId: p, scenePath: G });
            });
          }
          break;
        case M.UpdateNode:
          if (G && e && (n || d || s)) {
            const L = this.isLocalId(e.toString()) ? this.transformKey(e) : e, Y = this.storage[p] && this.storage[p][G] && this.storage[p][G][L] || void 0;
            Y && (Y.updateNodeOpt = n, (d || Z) && (Y.ops = d, Y.op = Z), s && (Y.opt = s), Y.type = M.FullWork, this.updateValue(L.toString(), Y, { isSync: m, viewId: p, scenePath: G }));
          }
          break;
        case M.Select:
          if (!G)
            return;
          let r;
          o != null && o.length && (r = o.map((L) => this.isLocalId(L + "") ? this.transformKey(L) : L));
          const u = this.transformKey(z), V = this.storage[p] && this.storage[p][G] && this.storage[p][G][u] || void 0, y = s || (V == null ? void 0 : V.opt);
          r && this.checkOtherSelector(u, r, { isSync: m, viewId: p, scenePath: G }), this.updateValue(u, r && {
            type: M.Select,
            toolsType: X.Selector,
            opt: y,
            selectIds: r
          }, { isSync: m, viewId: p, scenePath: G });
          break;
      }
  }
  checkOtherSelector(l, c, e) {
    const { viewId: d, scenePath: b } = e;
    for (const s of Object.keys(this.storage[d][b]))
      if (s !== l && this.getLocalId(s) === z) {
        const a = this.storage[d][b][s];
        if (a && a.selectIds) {
          const i = a.selectIds.filter((n) => !c.includes(n));
          i.length > 0 && (a.selectIds = i), this.updateValue(s, i.length && a || void 0, e);
        }
      }
  }
  setState(l, c) {
    const { viewId: e, scenePath: d } = c, b = Yl(l);
    for (let s = 0; s < b.length; s++) {
      const a = b[s], i = l[a];
      typeof i < "u" ? (this.storage[e] || (this.storage[e] = {}), this.storage[e][d] || (this.storage[e][d] = {}), this.storage[e][d][a] = i) : delete this.storage[e][d][a];
    }
    this.runSyncService(c);
  }
  updateValue(l, c, e) {
    const { viewId: d, scenePath: b } = e;
    c === void 0 ? delete this.storage[d][b][l] : (this.storage[d] || (this.storage[d] = {}), this.storage[d][b] || (this.storage[d][b] = {}), this.storage[d][b][l] = c), this.runSyncService(e);
  }
  runSyncService(l) {
    this.asyncClockState || (this.asyncClockState = !0, setTimeout(() => {
      l.isSync ? (this.asyncClockState = !1, this.syncSerivice(l.isAfterUpdate)) : _l(() => {
        this.asyncClockState = !1, this.syncSerivice(l.isAfterUpdate);
      }, Cl.syncInterval);
    }, l != null && l.isSync ? 0 : Cl.syncInterval));
  }
  syncSerivice(l = !1) {
    const c = Yl(this.serviceStorage), e = Yl(this.storage), d = /* @__PURE__ */ new Map();
    for (const b of c) {
      if (!e.includes(b)) {
        d.set(b, void 0);
        continue;
      }
      ol(this.serviceStorage[b], this.storage[b]) || this.syncViewData(b, l);
    }
    for (const b of e)
      c.includes(b) || d.set(b, this.storage[b]);
    if (d.size > 5)
      this.syncStorageView(this.storage, l);
    else
      for (const [b, s] of d.entries())
        this.syncUpdataView(b, s, l);
  }
  syncViewData(l, c = !1) {
    const e = Yl(this.serviceStorage[l]), d = Yl(this.storage[l]), b = /* @__PURE__ */ new Map();
    for (const s of e) {
      if (!d.includes(s)) {
        b.set(s, void 0);
        continue;
      }
      ol(this.serviceStorage[l][s], this.storage[l][s]) || this.syncScenePathData(l, s, c);
    }
    for (const s of d)
      e.includes(s) || b.set(s, this.storage[l][s]);
    if (b.size > 5)
      this.syncStorageScenePath(l, this.storage[l], c);
    else
      for (const [s, a] of b.entries())
        this.syncUpdataScenePath(l, s, a, c);
  }
  syncScenePathData(l, c, e = !1) {
    const d = Yl(this.serviceStorage[l][c]), b = Yl(this.storage[l][c]), s = /* @__PURE__ */ new Map();
    for (const a of d) {
      if (!b.includes(a)) {
        s.set(a, void 0);
        continue;
      }
      ol(this.serviceStorage[l][c][a], this.storage[l][c][a]) || s.set(a, this.storage[l][c][a]);
    }
    for (const a of b)
      d.includes(a) || s.set(a, this.storage[l][c][a]);
    if (s.size > 5)
      this.syncStorageKey(l, c, this.storage[l][c], e);
    else
      for (const [a, i] of s.entries())
        this.syncUpdataKey(l, c, a, i, e);
  }
  syncUpdataView(l, c, e = !1) {
    var b;
    Object.keys(this.serviceStorage).length ? (e || (c === void 0 ? delete this.serviceStorage[l] : this.serviceStorage[l] = sl(c)), (b = this.plugin) == null || b.updateAttributes([this.namespace, l], c)) : this.syncStorageView(this.storage, e);
  }
  syncStorageView(l, c = !1) {
    var e;
    c || l && (this.serviceStorage = sl(l)), (e = this.plugin) == null || e.updateAttributes([this.namespace], l);
  }
  syncUpdataScenePath(l, c, e, d = !1) {
    var s;
    Object.keys(this.serviceStorage[l]).length ? (d || (e === void 0 ? delete this.serviceStorage[l][c] : this.serviceStorage[l][c] = e), (s = this.plugin) == null || s.updateAttributes([this.namespace, l, c], e)) : this.syncStorageScenePath(l, this.storage[l], d);
  }
  syncStorageScenePath(l, c, e = !1) {
    var d;
    e || c && (this.serviceStorage[l] = c), (d = this.plugin) == null || d.updateAttributes([this.namespace, l], c);
  }
  syncUpdataKey(l, c, e, d, b = !1) {
    var a;
    Object.keys(this.serviceStorage[l][c]).length ? (b || (d === void 0 ? delete this.serviceStorage[l][c][e] : this.serviceStorage[l][c][e] = d), (a = this.plugin) == null || a.updateAttributes([this.namespace, l, c, e], d)) : this.syncStorageKey(l, c, this.storage[l][c], b);
  }
  syncStorageKey(l, c, e, d = !1) {
    var b;
    d || (this.serviceStorage[l][c] = e), (b = this.plugin) == null || b.updateAttributes([this.namespace, l, c], e);
  }
  keyTransformWorkId(l) {
    const c = l.split(vl);
    return c.length === 2 ? c[1] : l;
  }
  destroy() {
    this.removeStorageStateListener(), this.serviceStorage = {}, this.storage = {};
  }
}
Object.defineProperty(Cl, "namespace", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "PluginState"
});
Object.defineProperty(Cl, "syncInterval", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 500
});
class UG {
  constructor() {
    Object.defineProperty(this, "roomMembers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
    }), Object.defineProperty(this, "onChangeHooks", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Set()
    });
  }
  setRoomMembers(l) {
    this.executChangeUidHook(this.roomMembers, l), this.roomMembers = l;
  }
  executChangeUidHook(l, c) {
    const e = {
      online: c.map((d) => {
        var b;
        return ((b = d.payload) == null ? void 0 : b.uid) || d.session;
      }),
      offline: l.map((d) => {
        var b;
        return ((b = d.payload) == null ? void 0 : b.uid) || d.session;
      })
    };
    this.onChangeHooks.forEach((d) => d(e));
  }
  getRoomMember(l) {
    return this.roomMembers.find((c) => {
      var e;
      return ((e = c.payload) == null ? void 0 : e.uid) === l;
    });
  }
  isOnLine(l) {
    return !this.getRoomMember(l);
  }
  onUidChangeHook(l) {
    this.onChangeHooks.add(l);
  }
  destroy() {
    this.onChangeHooks.clear();
  }
}
var Rl;
(function(t) {
  t[t.Text = 1] = "Text", t[t.Shape = 2] = "Shape";
})(Rl || (Rl = {}));
class Zl {
  createProxy(l) {
    const c = new Proxy(l, {
      get(e, d, b) {
        const s = Zl.interceptors.hasOwnProperty(d) ? Zl.interceptors : e;
        return Reflect.get(s, d, b);
      }
    });
    return Zl.proxyToRaw.set(c, l), c;
  }
}
Object.defineProperty(Zl, "proxyToRaw", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /* @__PURE__ */ new WeakMap()
});
Object.defineProperty(Zl, "interceptors", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    entries(...t) {
      return Zl.proxyToRaw.get(this).entries(...t);
    },
    forEach(...t) {
      return Zl.proxyToRaw.get(this).forEach(...t);
    },
    size() {
      return Zl.proxyToRaw.get(this).size;
    },
    get(t) {
      return Zl.proxyToRaw.get(this).get(t);
    },
    set(t, l) {
      return Zl.proxyToRaw.get(this).set(t, l);
    },
    delete(t, l) {
      return Zl.proxyToRaw.get(this).delete(t);
    },
    clear() {
      return Zl.proxyToRaw.get(this).clear();
    }
  }
});
class jG {
  constructor(l) {
    Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "editors", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "activeId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "proxyMap", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "taskqueue", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    });
    const { control: c, internalMsgEmitter: e } = l;
    this.control = c, this.internalMsgEmitter = e;
    const d = /* @__PURE__ */ new Map();
    this.proxyMap = new Zl();
    const b = this, s = Zl.interceptors.set;
    Zl.interceptors.set = function(i, n) {
      return b.interceptors.set(i, n), s.call(this, i, n);
    };
    const a = Zl.interceptors.delete;
    Zl.interceptors.delete = function(i, n) {
      return b.interceptors.delete(i, n), a.call(this, i);
    }, this.editors = this.proxyMap.createProxy(d);
  }
  get collector() {
    return this.control.collector;
  }
  filterEditor(l) {
    const c = /* @__PURE__ */ new Map();
    return this.editors.forEach((e, d) => {
      e.viewId === l && c.set(d, e);
    }), c;
  }
  get interceptors() {
    return {
      set: (l, c) => {
        var G, p, W, r, u, V, y, L;
        if (!this.collector)
          return !0;
        const { viewId: e, scenePath: d, canSync: b, canWorker: s, type: a, opt: i, dataType: n } = c;
        if (!s && !b)
          return !0;
        const o = ((G = this.collector) == null ? void 0 : G.isLocalId(l)) ? (p = this.collector) == null ? void 0 : p.transformKey(l) : l, m = ((W = this.collector) == null ? void 0 : W.storage[e]) && this.collector.storage[e][d] && this.collector.storage[e][d][o] || void 0;
        m ? m.toolsType === X.Text && (s && (this.control.worker.queryTaskBatchData({
          workId: l,
          msgType: M.UpdateNode
        }).forEach((Y) => {
          var N;
          (N = this.control.worker) == null || N.taskBatchData.delete(Y);
        }), (y = this.control.worker) == null || y.taskBatchData.add({
          workId: l,
          msgType: M.UpdateNode,
          dataType: n || Q.Local,
          toolsType: X.Text,
          opt: i,
          viewId: e,
          scenePath: d
          // willSyncService: canSync
        }), (L = this.control.worker) == null || L.runAnimation()), b && _l(() => {
          var Y;
          (Y = this.collector) == null || Y.dispatch({
            type: M.UpdateNode,
            workId: l,
            toolsType: X.Text,
            opt: i,
            viewId: e,
            scenePath: d
          });
        }, this.control.worker.maxLastSyncTime)) : a === Rl.Text && (b && ((r = this.collector) == null || r.dispatch({
          type: i.text && M.FullWork || M.CreateWork,
          workId: l,
          toolsType: X.Text,
          opt: i,
          isSync: !0,
          viewId: e,
          scenePath: d
        })), s && ((u = this.control.worker) == null || u.taskBatchData.add({
          workId: l,
          msgType: i.text && M.FullWork || M.CreateWork,
          dataType: n || Q.Local,
          toolsType: X.Text,
          opt: i,
          viewId: e,
          scenePath: d
        }), (V = this.control.worker) == null || V.runAnimation()));
      },
      delete: (l) => {
        var a, i;
        if (!this.collector)
          return !0;
        const c = this.editors.get(l);
        if (!c)
          return !0;
        const { viewId: e, scenePath: d, canSync: b, canWorker: s } = c;
        if (!s && !b)
          return !0;
        s && ((a = this.control.worker) == null || a.taskBatchData.add({
          workId: l,
          toolsType: X.Text,
          msgType: M.RemoveNode,
          dataType: Q.Local,
          viewId: e,
          scenePath: d
        }), (i = this.control.worker) == null || i.runAnimation()), b && _l(() => {
          var n;
          (n = this.collector) == null || n.dispatch({
            type: M.RemoveNode,
            removeIds: [l],
            toolsType: X.Text,
            viewId: e,
            scenePath: d
          });
        }, this.control.worker.maxLastSyncTime);
      },
      clear() {
        return !0;
      }
    };
  }
  computeTextActive(l, c) {
    var b, s, a, i;
    const e = (b = this.control.viewContainerManager) == null ? void 0 : b.transformToScenePoint(l, c), d = (s = this.control.viewContainerManager) == null ? void 0 : s.getCurScenePath(c);
    c && d && ((a = this.control.worker) == null || a.taskBatchData.add({
      msgType: M.GetTextActive,
      dataType: Q.Local,
      op: e,
      viewId: c,
      scenePath: d
    }), (i = this.control.worker) == null || i.runAnimation());
  }
  checkEmptyTextBlur() {
    if (this.activeId) {
      const l = this.editors.get(this.activeId), c = (l == null ? void 0 : l.opt.text) && (l == null ? void 0 : l.opt.text.replace(/\s*,/g, "")), e = l == null ? void 0 : l.viewId;
      c ? this.unActive() : this.delete(this.activeId, !0, !0), this.undoTickerId && e && (this.internalMsgEmitter.emit("undoTickerEnd", this.undoTickerId, e, !0), this.undoTickerId = void 0);
    }
  }
  onCameraChange(l, c) {
    var e, d;
    for (const [b, s] of this.editors.entries())
      if (s.viewId === c) {
        const { boxPoint: a, boxSize: i } = s.opt, n = a && ((e = this.control.viewContainerManager) == null ? void 0 : e.transformToOriginPoint(a, s.viewId)), Z = (d = this.control.viewContainerManager) == null ? void 0 : d.getCurScenePath(c);
        if (Z && c) {
          const o = {
            x: n && n[0] || 0,
            y: n && n[1] || 0,
            w: i && i[0] || 0,
            h: i && i[1] || 0,
            opt: s.opt,
            scale: l.scale,
            type: Rl.Text,
            viewId: c,
            scenePath: Z,
            canWorker: !1,
            canSync: !1
          };
          this.editors.set(b, o), this.control.viewContainerManager.setActiveTextEditor(c, this.activeId);
        }
      }
  }
  onServiceDerive(l) {
    var p, W;
    const { workId: c, opt: e, msgType: d, viewId: b, scenePath: s, dataType: a } = l;
    if (!c || !b || !s)
      return;
    const i = c.toString();
    if (d === M.RemoveNode) {
      console.log("onServiceDerive-d", i), this.delete(i, !0, !0);
      return;
    }
    const { boxPoint: n, boxSize: Z } = e, o = n && ((p = this.control.viewContainerManager) == null ? void 0 : p.transformToOriginPoint(n, b)), m = this.control.viewContainerManager.getView(b), G = {
      x: o && o[0] || 0,
      y: o && o[1] || 0,
      w: Z && Z[0] || 0,
      h: Z && Z[1] || 0,
      opt: e,
      type: Rl.Text,
      canWorker: !0,
      canSync: !1,
      dataType: a,
      // dataType: this.collector?.isLocalId(workIdStr) ? EDataType.Local : EDataType.Service,
      scale: ((W = m == null ? void 0 : m.cameraOpt) == null ? void 0 : W.scale) || 1,
      viewId: b,
      scenePath: s
    };
    this.editors.set(i, G), a === Q.Service && e.workState === x.Done && this.activeId === i && (this.activeId = void 0), console.log("onServiceDerive---1", i, G.opt.text, G.opt.uid, this.activeId, a), this.control.viewContainerManager.setActiveTextEditor(b, this.activeId);
  }
  updateForViewEdited(l, c) {
    var d;
    this.editors.set(l, c);
    const e = (d = this.taskqueue.get(l)) == null ? void 0 : d.resolve;
    e && e(c);
  }
  active(l) {
    var e;
    const c = this.editors.get(l);
    c && c.viewId && (c.opt.workState = x.Start, c.opt.uid = (e = this.collector) == null ? void 0 : e.uid, this.activeId = l, c.canWorker = !0, c.canSync = !0, console.log("onServiceDerive---0", c.opt.uid), this.editors.set(l, c), this.control.viewContainerManager.setActiveTextEditor(c.viewId, this.activeId));
  }
  unActive() {
    const l = this.activeId && this.editors.get(this.activeId);
    l && l.viewId && this.activeId && (l.opt.workState = x.Done, l.opt.uid = void 0, l.canWorker = !0, l.canSync = !0, this.editors.set(this.activeId, l), this.activeId = void 0, this.control.viewContainerManager.setActiveTextEditor(l.viewId, this.activeId));
  }
  createTextForMasterController(l, c) {
    var s;
    const { workId: e, isActive: d, ...b } = l;
    b.opt.zIndex = this.getMaxZIndex() + 1, b.opt.uid = (s = this.collector) == null ? void 0 : s.uid, c && (this.undoTickerId = c, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, b.viewId)), d && (this.activeId = e), b.dataType = Q.Local, b.canWorker = !0, b.canSync = !0, this.editors.set(e, b), this.control.viewContainerManager.setActiveTextEditor(b.viewId, this.activeId);
  }
  updateTextForMasterController(l, c) {
    var s;
    const { workId: e, ...d } = l;
    c && (this.undoTickerId = c, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, d.viewId));
    const b = this.editors.get(e) || {};
    d.opt && (d.opt.uid = (s = this.collector) == null ? void 0 : s.uid), d.dataType = Q.Local, this.editors.set(e, { ...b, ...d }), this.control.viewContainerManager.setActiveTextEditor(d.viewId, this.activeId);
  }
  async updateTextControllerWithEffectAsync(l, c) {
    var n;
    const { workId: e, ...d } = l;
    c && (this.undoTickerId = c, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, d.viewId));
    const b = this.editors.get(e) || {};
    if (d.opt && (d.opt.uid = (n = this.collector) == null ? void 0 : n.uid), d.dataType = Q.Local, this.editors.set(e, { ...b, ...d }), this.control.viewContainerManager.setActiveTextEditor(d.viewId, this.activeId), this.taskqueue.has(e))
      return;
    const s = setTimeout(() => {
      var o;
      const Z = (o = this.taskqueue.get(e)) == null ? void 0 : o.resolve;
      Z && Z(void 0);
    }, 20), a = await new Promise((Z) => {
      this.taskqueue.set(e, { resolve: Z, clocker: s });
    }), i = this.taskqueue.get(e);
    return i && (i.clocker && clearTimeout(i.clocker), this.taskqueue.delete(e)), this.taskqueue.delete(e), a;
  }
  updateTextForWorker(l, c) {
    const { workId: e, isActive: d, ...b } = l;
    c && (this.undoTickerId = c, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, b.viewId));
    const a = { ...this.editors.get(e) || {}, ...b };
    if (d) {
      a.canWorker = !1, a.canSync = !1, this.editors.set(e, a), this.active(e);
      return;
    }
    this.editors.set(e, a), this.control.viewContainerManager.setActiveTextEditor(b.viewId, this.activeId);
  }
  get(l) {
    return this.editors.get(l);
  }
  delete(l, c, e) {
    const d = this.editors.get(l);
    if (d) {
      const b = d.viewId;
      d.canSync = c, d.canWorker = e, this.editors.delete(l), this.activeId === l && (this.activeId = void 0), this.control.viewContainerManager.setActiveTextEditor(b, this.activeId);
    }
  }
  deleteBatch(l, c, e) {
    const d = /* @__PURE__ */ new Set();
    for (const b of l) {
      const s = this.editors.get(b);
      if (s) {
        const a = s.viewId;
        s.canSync = c, s.canWorker = e, this.editors.delete(b), this.activeId === b && (this.activeId = void 0), d.add(a);
      }
    }
    for (const b of d)
      this.control.viewContainerManager.setActiveTextEditor(b, this.activeId);
  }
  clear(l, c) {
    this.editors.forEach((e, d) => {
      e.viewId === l && (c && (e.canSync = !1), e.canWorker = !1, this.editors.delete(d));
    }), this.activeId = void 0, this.control.viewContainerManager.setActiveTextEditor(l, this.activeId);
  }
  destory() {
    this.editors.clear(), this.activeId = void 0;
  }
  getMaxZIndex() {
    let l = 0;
    return this.editors.forEach((c) => {
      c.opt.zIndex && c.opt.zIndex > l && (l = c.opt.zIndex);
    }), l;
  }
}
class Kl extends Kt {
  constructor(l, c) {
    super(l), Object.defineProperty(this, "serviceStorage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {}
    }), Object.defineProperty(this, "storage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {}
    }), Object.defineProperty(this, "stateDisposer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "asyncClockTimer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "namespace", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.namespace = Kl.namespace, Kl.syncInterval = (c || Kl.syncInterval) * 0.5, this.serviceStorage = this.getNamespaceData(), this.storage = sl(this.serviceStorage);
  }
  addStorageStateListener(l) {
    this.stateDisposer = bt(async () => {
      const c = this.getNamespaceData(), e = this.getDiffMap(this.serviceStorage, c);
      this.serviceStorage = c, e.size && l(e);
    });
  }
  getDiffMap(l, c) {
    const e = /* @__PURE__ */ new Map();
    for (const [d, b] of Object.entries(c))
      d !== this.uid && (b && ol(l[d], b) || b && e.set(d, b));
    return e;
  }
  removeStorageStateListener() {
    this.stateDisposer && this.stateDisposer();
  }
  transformKey(l) {
    return this.uid + vl + l;
  }
  isOwn(l) {
    return l === this.uid;
  }
  dispatch(l) {
    const { type: c, op: e, isSync: d, viewId: b } = l;
    switch (c) {
      case Ql.Cursor:
        e && this.pushValue(this.uid, {
          type: Ql.Cursor,
          op: e,
          viewId: b
        }, { isSync: d });
        break;
    }
  }
  pushValue(l, c, e) {
    var d;
    this.storage[l] || (this.storage[l] = []), (d = this.storage[l]) == null || d.push(c), this.runSyncService(e);
  }
  clearValue(l) {
    var e;
    this.storage[l] = void 0, Object.keys(this.serviceStorage).length && ((e = this.plugin) == null || e.updateAttributes([this.namespace, l], void 0));
  }
  runSyncService(l) {
    this.asyncClockTimer || (this.asyncClockTimer = setTimeout(() => {
      l != null && l.isSync ? (this.asyncClockTimer = void 0, this.syncSerivice()) : _l(() => {
        this.asyncClockTimer = void 0, this.syncSerivice();
      }, Kl.syncInterval);
    }, l != null && l.isSync ? 0 : Kl.syncInterval));
  }
  syncSerivice() {
    var c;
    Object.keys(this.serviceStorage).length ? Object.keys(this.storage).forEach((e) => {
      var d;
      (d = this.plugin) == null || d.updateAttributes([this.namespace, e], this.storage[e]);
    }) : (c = this.plugin) == null || c.updateAttributes(this.namespace, this.storage), this.storage = {};
  }
  destroy() {
    this.removeStorageStateListener(), this.storage = {}, this.serviceStorage = {};
  }
}
Object.defineProperty(Kl, "syncInterval", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 100
});
Object.defineProperty(Kl, "namespace", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "PluginEvent"
});
var Be;
(function(t) {
  t[t.Event = 0] = "Event", t[t.Storage = 1] = "Storage";
})(Be || (Be = {}));
class PG {
  constructor(l) {
    Object.defineProperty(this, "expirationTime", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 5e3
    }), Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "eventCollector", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "roomMember", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "animationId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "removeTimerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "asyncEndInfo", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "animationPointWorkers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "animationDrawWorkers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "cursorInfoMap", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    });
    const { control: c, internalMsgEmitter: e } = l;
    this.internalMsgEmitter = e, this.control = c, this.roomMember = c.roomMember;
  }
  activeCollector() {
    var l, c;
    this.control.plugin && (this.eventCollector = new Kl(this.control.plugin, Math.min(((c = (l = this.control.pluginOptions) == null ? void 0 : l.syncOpt) == null ? void 0 : c.interval) || 100, 100)), this.eventCollector.addStorageStateListener((e) => {
      e.forEach((d, b) => {
        var s;
        if (((s = this.eventCollector) == null ? void 0 : s.uid) !== b) {
          const a = /* @__PURE__ */ new Map();
          d == null || d.forEach((i) => {
            if (i && i.type === Ql.Cursor && i.op && i.viewId) {
              const n = [];
              for (let Z = 0; Z < i.op.length; Z += 2) {
                const o = i.op[Z], m = i.op[Z + 1];
                if (yl(o) && yl(m)) {
                  const G = this.control.viewContainerManager.transformToOriginPoint([o, m], i.viewId);
                  n.push(G[0], G[1]);
                } else
                  n.push(o, m);
              }
              a.set(i.viewId, n);
            }
          }), a.size && (this.activePointWorkShape(b, a), this.runAnimation());
        }
      });
    }));
  }
  onFocusViewChange() {
    const l = this.control.viewContainerManager.focuedViewId;
    for (const e of this.animationDrawWorkers.keys()) {
      const d = this.getUidAndviewId(e).uid, b = this.getUidAndviewId(e).viewId;
      b !== l && this.activeDrawWorkShape(d, [void 0, void 0], x.Done, b);
    }
    const c = /* @__PURE__ */ new Map();
    for (const e of this.animationPointWorkers.keys()) {
      const d = this.getUidAndviewId(e).uid, b = this.getUidAndviewId(e).viewId;
      if (b !== l) {
        const s = c.get(d) || /* @__PURE__ */ new Map();
        s.set(b, [void 0, void 0]), c.set(d, s);
      }
    }
    if (c.size)
      for (const [e, d] of c.entries())
        this.activePointWorkShape(e, d);
    this.runAnimation();
  }
  activePointWorkShape(l, c) {
    var d;
    if (this.roomMember.getRoomMember(l))
      for (const [b, s] of c.entries()) {
        const a = this.getKey(l, b);
        let i = !1;
        const n = this.control.viewContainerManager.getAllViews().map((o) => o == null ? void 0 : o.id);
        for (const o of n)
          if (o && o !== b) {
            const m = this.getKey(l, o), G = this.animationDrawWorkers.get(m);
            if ((G == null ? void 0 : G.workState) === x.Start || (G == null ? void 0 : G.workState) === x.Doing || !1) {
              i = !0;
              break;
            } else if (this.removeTimerId && (clearTimeout(this.removeTimerId), this.removeTimerId = void 0), G)
              this.activeDrawWorkShape(l, [void 0, void 0], x.Done, o), this.runAnimation();
            else {
              const W = this.animationPointWorkers.get(m);
              if (W)
                W.animationWorkData = [void 0, void 0], W.animationIndex = 0, W.freeze = !1;
              else {
                const r = {
                  animationIndex: 0,
                  animationWorkData: [void 0, void 0],
                  freeze: !1
                };
                this.animationPointWorkers.set(m, r);
              }
            }
          }
        const Z = this.animationPointWorkers.get(a);
        if (s) {
          if (!Z) {
            const o = {
              animationIndex: 0,
              animationWorkData: s,
              freeze: i
            };
            (d = this.animationPointWorkers) == null || d.set(a, o);
            return;
          }
          Z.animationWorkData = s, Z.animationIndex = 0, Z.freeze = i;
        }
      }
  }
  getKey(l, c) {
    return `${l}${vl}${c}`;
  }
  getUidAndviewId(l) {
    const [c, e] = l.split(vl);
    return { uid: c, viewId: e };
  }
  animationCursor() {
    this.animationId = void 0;
    const l = Date.now();
    this.animationPointWorkers.forEach((c, e) => {
      const { uid: d, viewId: b } = this.getUidAndviewId(e);
      if (c.freeze)
        return;
      const a = c.animationIndex, i = this.roomMember.getRoomMember(d);
      if (i) {
        c.animationWorkData.length - 1 > a && (c.animationIndex = a + 2);
        const n = c.animationWorkData[a], Z = c.animationWorkData[a + 1], o = this.cursorInfoMap.get(b) || /* @__PURE__ */ new Map();
        yl(n) && yl(Z) ? o.set(i.memberId, { x: n, y: Z, roomMember: i, timestamp: l }) : o.has(i.memberId) && o.delete(i.memberId), o.size ? this.cursorInfoMap.set(b, o) : this.cursorInfoMap.has(b) && (this.cursorInfoMap.delete(b), this.internalMsgEmitter.emit([F.Cursor, b], [])), c.animationWorkData.length - 1 <= c.animationIndex && this.animationPointWorkers.delete(e);
      }
    }), this.animationDrawWorkers.forEach((c, e) => {
      const { uid: d, viewId: b } = this.getUidAndviewId(e), s = c.animationIndex, a = this.roomMember.getRoomMember(d);
      if (a) {
        c.animationWorkData.length - 1 > s && (c.animationIndex = s + 2);
        const i = c.animationWorkData[s], n = c.animationWorkData[s + 1], Z = this.cursorInfoMap.get(b) || /* @__PURE__ */ new Map();
        yl(i) && yl(n) ? Z.set(a.memberId, { x: i, y: n, roomMember: a, timestamp: l }) : Z.has(a.memberId) && Z.delete(a.memberId), Z.size ? this.cursorInfoMap.set(b, Z) : this.cursorInfoMap.has(b) && (this.cursorInfoMap.delete(b), this.internalMsgEmitter.emit([F.Cursor, b], [])), c.animationWorkData.length - 1 <= c.animationIndex && this.animationDrawWorkers.delete(e);
      }
    });
    for (const [c, e] of this.cursorInfoMap)
      if (e) {
        const d = [], b = [];
        for (const [s, a] of e.entries()) {
          const { timestamp: i, ...n } = a;
          i + this.expirationTime < l ? b.push(s) : d.push(n);
        }
        if (b.length)
          for (const s of b)
            e.delete(s);
        e.size ? this.cursorInfoMap.set(c, e) : this.cursorInfoMap.delete(c), this.internalMsgEmitter.emit([F.Cursor, c], d);
      }
    (this.animationPointWorkers.size || this.animationDrawWorkers.size || this.cursorInfoMap.size) && this.runAnimation();
  }
  activeDrawWorkShape(l, c, e, d) {
    var i, n;
    if (!this.roomMember.getRoomMember(l))
      return;
    const s = this.getKey(l, d);
    if (e === x.Start) {
      const Z = this.animationPointWorkers.get(s);
      if (Z)
        Z.animationWorkData = [], Z.animationIndex = 0, Z.freeze = !0;
      else {
        const o = {
          animationIndex: 0,
          animationWorkData: [],
          freeze: !0
        };
        (i = this.animationDrawWorkers) == null || i.set(s, o);
      }
    } else if (e === x.Done) {
      const Z = this.animationPointWorkers.get(s);
      Z && (Z.freeze = !1);
    }
    const a = this.animationDrawWorkers.get(s);
    if (c) {
      if (!a) {
        const Z = {
          animationIndex: 0,
          animationWorkData: c,
          workState: e
        };
        (n = this.animationDrawWorkers) == null || n.set(s, Z);
        return;
      }
      a.animationWorkData = c, a.animationIndex = 0, a.workState = e;
    }
  }
  runAnimation() {
    this.animationId || (this.animationId = requestAnimationFrame(this.animationCursor.bind(this)));
  }
  sendEvent(l, c) {
    var e;
    (e = this.eventCollector) == null || e.dispatch({
      type: Ql.Cursor,
      op: yl(l[0]) && yl(l[1]) && this.control.viewContainerManager.transformToScenePoint(l, c) || [void 0, void 0],
      viewId: c
    });
  }
  collectServiceCursor(l) {
    const { op: c, uid: e, workState: d, viewId: b } = l;
    if (e && c && d && b) {
      const s = this.control.viewContainerManager.focuedViewId;
      if (d === x.Done) {
        if (b !== s) {
          this.activeDrawWorkShape(e, [void 0, void 0], d, b), this.runAnimation();
          return;
        }
        this.removeTimerId && (clearTimeout(this.removeTimerId), this.removeTimerId = void 0, this.asyncEndInfo && this.asyncEndInfo.viewId !== b && this.asyncEndInfo.uid === e && this.activeDrawWorkShape(e, [void 0, void 0], x.Done, this.asyncEndInfo.viewId)), this.asyncEndInfo = { uid: e, viewId: b }, this.removeTimerId = setTimeout(() => {
          this.removeTimerId = void 0, this.activeDrawWorkShape(e, [void 0, void 0], x.Done, b), this.runAnimation();
        }, this.expirationTime);
      }
      if (yl(c[0]) && yl(c[1])) {
        const a = this.control.viewContainerManager.transformToOriginPoint(c, b);
        this.activeDrawWorkShape(e, a, d, b);
      }
      this.runAnimation();
    }
  }
  unabled() {
    var l;
    (l = this.eventCollector) == null || l.dispatch({
      type: Ql.Cursor,
      op: [void 0, void 0],
      viewId: this.control.viewContainerManager.focuedViewId
    });
  }
  destroy() {
    var l;
    (l = this.eventCollector) == null || l.destroy();
  }
}
const wt = "c2VsZi5pbXBvcnRTY3JpcHRzKCJodHRwczovL3VucGtnLmNvbS9zcHJpdGVqc0AzL2Rpc3Qvc3ByaXRlanMuanMiKTsoZnVuY3Rpb24oeil7InVzZSBzdHJpY3QiO3ZhciBNZT10eXBlb2YgZ2xvYmFsVGhpczwidSI/Z2xvYmFsVGhpczp0eXBlb2Ygd2luZG93PCJ1Ij93aW5kb3c6dHlwZW9mIGdsb2JhbDwidSI/Z2xvYmFsOnR5cGVvZiBzZWxmPCJ1Ij9zZWxmOnt9O2Z1bmN0aW9uIG1lKG8pe3JldHVybiBvJiZvLl9fZXNNb2R1bGUmJk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCJkZWZhdWx0Iik/by5kZWZhdWx0Om99ZnVuY3Rpb24gZm8oKXt0aGlzLl9fZGF0YV9fPVtdLHRoaXMuc2l6ZT0wfXZhciBwbz1mbztmdW5jdGlvbiB5byhvLGUpe3JldHVybiBvPT09ZXx8byE9PW8mJmUhPT1lfXZhciBWZT15byx3bz1WZTtmdW5jdGlvbiBtbyhvLGUpe2Zvcih2YXIgdD1vLmxlbmd0aDt0LS07KWlmKHdvKG9bdF1bMF0sZSkpcmV0dXJuIHQ7cmV0dXJuLTF9dmFyIEFlPW1vLGdvPUFlLGJvPUFycmF5LnByb3RvdHlwZSx2bz1iby5zcGxpY2U7ZnVuY3Rpb24gU28obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PWdvKGUsbyk7aWYodDwwKXJldHVybiExO3ZhciByPWUubGVuZ3RoLTE7cmV0dXJuIHQ9PXI/ZS5wb3AoKTp2by5jYWxsKGUsdCwxKSwtLXRoaXMuc2l6ZSwhMH12YXIga289U28sUG89QWU7ZnVuY3Rpb24gVG8obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PVBvKGUsbyk7cmV0dXJuIHQ8MD92b2lkIDA6ZVt0XVsxXX12YXIgSW89VG8seG89QWU7ZnVuY3Rpb24gT28obyl7cmV0dXJuIHhvKHRoaXMuX19kYXRhX18sbyk+LTF9dmFyIExvPU9vLENvPUFlO2Z1bmN0aW9uIE5vKG8sZSl7dmFyIHQ9dGhpcy5fX2RhdGFfXyxyPUNvKHQsbyk7cmV0dXJuIHI8MD8oKyt0aGlzLnNpemUsdC5wdXNoKFtvLGVdKSk6dFtyXVsxXT1lLHRoaXN9dmFyIFdvPU5vLFJvPXBvLE1vPWtvLEFvPUlvLCRvPUxvLERvPVdvO2Z1bmN0aW9uIGdlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fWdlLnByb3RvdHlwZS5jbGVhcj1SbyxnZS5wcm90b3R5cGUuZGVsZXRlPU1vLGdlLnByb3RvdHlwZS5nZXQ9QW8sZ2UucHJvdG90eXBlLmhhcz0kbyxnZS5wcm90b3R5cGUuc2V0PURvO3ZhciAkZT1nZSxqbz0kZTtmdW5jdGlvbiBGbygpe3RoaXMuX19kYXRhX189bmV3IGpvLHRoaXMuc2l6ZT0wfXZhciBCbz1GbztmdW5jdGlvbiBfbyhvKXt2YXIgZT10aGlzLl9fZGF0YV9fLHQ9ZS5kZWxldGUobyk7cmV0dXJuIHRoaXMuc2l6ZT1lLnNpemUsdH12YXIgRW89X287ZnVuY3Rpb24gem8obyl7cmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KG8pfXZhciBVbz16bztmdW5jdGlvbiBHbyhvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMobyl9dmFyIFhvPUdvLEhvPXR5cGVvZiBNZT09Im9iamVjdCImJk1lJiZNZS5PYmplY3Q9PT1PYmplY3QmJk1lLFN0PUhvLFlvPVN0LHFvPXR5cGVvZiBzZWxmPT0ib2JqZWN0IiYmc2VsZiYmc2VsZi5PYmplY3Q9PT1PYmplY3QmJnNlbGYsWm89WW98fHFvfHxGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpLGllPVpvLFFvPWllLEpvPVFvLlN5bWJvbCxEZT1KbyxrdD1EZSxQdD1PYmplY3QucHJvdG90eXBlLEtvPVB0Lmhhc093blByb3BlcnR5LFZvPVB0LnRvU3RyaW5nLExlPWt0P2t0LnRvU3RyaW5nVGFnOnZvaWQgMDtmdW5jdGlvbiBlcyhvKXt2YXIgZT1Lby5jYWxsKG8sTGUpLHQ9b1tMZV07dHJ5e29bTGVdPXZvaWQgMDt2YXIgcj0hMH1jYXRjaHt9dmFyIGk9Vm8uY2FsbChvKTtyZXR1cm4gciYmKGU/b1tMZV09dDpkZWxldGUgb1tMZV0pLGl9dmFyIHRzPWVzLHJzPU9iamVjdC5wcm90b3R5cGUsb3M9cnMudG9TdHJpbmc7ZnVuY3Rpb24gc3Mobyl7cmV0dXJuIG9zLmNhbGwobyl9dmFyIGlzPXNzLFR0PURlLG5zPXRzLGFzPWlzLGxzPSJbb2JqZWN0IE51bGxdIixjcz0iW29iamVjdCBVbmRlZmluZWRdIixJdD1UdD9UdC50b1N0cmluZ1RhZzp2b2lkIDA7ZnVuY3Rpb24gdXMobyl7cmV0dXJuIG89PW51bGw/bz09PXZvaWQgMD9jczpsczpJdCYmSXQgaW4gT2JqZWN0KG8pP25zKG8pOmFzKG8pfXZhciBmZT11cztmdW5jdGlvbiBocyhvKXt2YXIgZT10eXBlb2YgbztyZXR1cm4gbyE9bnVsbCYmKGU9PSJvYmplY3QifHxlPT0iZnVuY3Rpb24iKX12YXIgdWU9aHMsZHM9ZmUsZnM9dWUscHM9IltvYmplY3QgQXN5bmNGdW5jdGlvbl0iLHlzPSJbb2JqZWN0IEZ1bmN0aW9uXSIsd3M9IltvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dIixtcz0iW29iamVjdCBQcm94eV0iO2Z1bmN0aW9uIGdzKG8pe2lmKCFmcyhvKSlyZXR1cm4hMTt2YXIgZT1kcyhvKTtyZXR1cm4gZT09eXN8fGU9PXdzfHxlPT1wc3x8ZT09bXN9dmFyIHh0PWdzLGJzPWllLHZzPWJzWyJfX2NvcmUtanNfc2hhcmVkX18iXSxTcz12cyxldD1TcyxPdD1mdW5jdGlvbigpe3ZhciBvPS9bXi5dKyQvLmV4ZWMoZXQmJmV0LmtleXMmJmV0LmtleXMuSUVfUFJPVE98fCIiKTtyZXR1cm4gbz8iU3ltYm9sKHNyYylfMS4iK286IiJ9KCk7ZnVuY3Rpb24ga3Mobyl7cmV0dXJuISFPdCYmT3QgaW4gb312YXIgUHM9a3MsVHM9RnVuY3Rpb24ucHJvdG90eXBlLElzPVRzLnRvU3RyaW5nO2Z1bmN0aW9uIHhzKG8pe2lmKG8hPW51bGwpe3RyeXtyZXR1cm4gSXMuY2FsbChvKX1jYXRjaHt9dHJ5e3JldHVybiBvKyIifWNhdGNoe319cmV0dXJuIiJ9dmFyIEx0PXhzLE9zPXh0LExzPVBzLENzPXVlLE5zPUx0LFdzPS9bXFxeJC4qKz8oKVtcXXt9fF0vZyxScz0vXlxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXF0kLyxNcz1GdW5jdGlvbi5wcm90b3R5cGUsQXM9T2JqZWN0LnByb3RvdHlwZSwkcz1Ncy50b1N0cmluZyxEcz1Bcy5oYXNPd25Qcm9wZXJ0eSxqcz1SZWdFeHAoIl4iKyRzLmNhbGwoRHMpLnJlcGxhY2UoV3MsIlxcJCYiKS5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcKCl8IGZvciAuKz8oPz1cXFxdKS9nLCIkMS4qPyIpKyIkIik7ZnVuY3Rpb24gRnMobyl7aWYoIUNzKG8pfHxMcyhvKSlyZXR1cm4hMTt2YXIgZT1PcyhvKT9qczpScztyZXR1cm4gZS50ZXN0KE5zKG8pKX12YXIgQnM9RnM7ZnVuY3Rpb24gX3MobyxlKXtyZXR1cm4gbz09bnVsbD92b2lkIDA6b1tlXX12YXIgRXM9X3MsenM9QnMsVXM9RXM7ZnVuY3Rpb24gR3MobyxlKXt2YXIgdD1VcyhvLGUpO3JldHVybiB6cyh0KT90OnZvaWQgMH12YXIgcGU9R3MsWHM9cGUsSHM9aWUsWXM9WHMoSHMsIk1hcCIpLHR0PVlzLHFzPXBlLFpzPXFzKE9iamVjdCwiY3JlYXRlIiksamU9WnMsQ3Q9amU7ZnVuY3Rpb24gUXMoKXt0aGlzLl9fZGF0YV9fPUN0P0N0KG51bGwpOnt9LHRoaXMuc2l6ZT0wfXZhciBKcz1RcztmdW5jdGlvbiBLcyhvKXt2YXIgZT10aGlzLmhhcyhvKSYmZGVsZXRlIHRoaXMuX19kYXRhX19bb107cmV0dXJuIHRoaXMuc2l6ZS09ZT8xOjAsZX12YXIgVnM9S3MsZWk9amUsdGk9Il9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18iLHJpPU9iamVjdC5wcm90b3R5cGUsb2k9cmkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gc2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztpZihlaSl7dmFyIHQ9ZVtvXTtyZXR1cm4gdD09PXRpP3ZvaWQgMDp0fXJldHVybiBvaS5jYWxsKGUsbyk/ZVtvXTp2b2lkIDB9dmFyIGlpPXNpLG5pPWplLGFpPU9iamVjdC5wcm90b3R5cGUsbGk9YWkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gY2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztyZXR1cm4gbmk/ZVtvXSE9PXZvaWQgMDpsaS5jYWxsKGUsbyl9dmFyIHVpPWNpLGhpPWplLGRpPSJfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fIjtmdW5jdGlvbiBmaShvLGUpe3ZhciB0PXRoaXMuX19kYXRhX187cmV0dXJuIHRoaXMuc2l6ZSs9dGhpcy5oYXMobyk/MDoxLHRbb109aGkmJmU9PT12b2lkIDA/ZGk6ZSx0aGlzfXZhciBwaT1maSx5aT1Kcyx3aT1WcyxtaT1paSxnaT11aSxiaT1waTtmdW5jdGlvbiBiZShvKXt2YXIgZT0tMSx0PW89PW51bGw/MDpvLmxlbmd0aDtmb3IodGhpcy5jbGVhcigpOysrZTx0Oyl7dmFyIHI9b1tlXTt0aGlzLnNldChyWzBdLHJbMV0pfX1iZS5wcm90b3R5cGUuY2xlYXI9eWksYmUucHJvdG90eXBlLmRlbGV0ZT13aSxiZS5wcm90b3R5cGUuZ2V0PW1pLGJlLnByb3RvdHlwZS5oYXM9Z2ksYmUucHJvdG90eXBlLnNldD1iaTt2YXIgdmk9YmUsTnQ9dmksU2k9JGUsa2k9dHQ7ZnVuY3Rpb24gUGkoKXt0aGlzLnNpemU9MCx0aGlzLl9fZGF0YV9fPXtoYXNoOm5ldyBOdCxtYXA6bmV3KGtpfHxTaSksc3RyaW5nOm5ldyBOdH19dmFyIFRpPVBpO2Z1bmN0aW9uIElpKG8pe3ZhciBlPXR5cGVvZiBvO3JldHVybiBlPT0ic3RyaW5nInx8ZT09Im51bWJlciJ8fGU9PSJzeW1ib2wifHxlPT0iYm9vbGVhbiI/byE9PSJfX3Byb3RvX18iOm89PT1udWxsfXZhciB4aT1JaSxPaT14aTtmdW5jdGlvbiBMaShvLGUpe3ZhciB0PW8uX19kYXRhX187cmV0dXJuIE9pKGUpP3RbdHlwZW9mIGU9PSJzdHJpbmciPyJzdHJpbmciOiJoYXNoIl06dC5tYXB9dmFyIEZlPUxpLENpPUZlO2Z1bmN0aW9uIE5pKG8pe3ZhciBlPUNpKHRoaXMsbykuZGVsZXRlKG8pO3JldHVybiB0aGlzLnNpemUtPWU/MTowLGV9dmFyIFdpPU5pLFJpPUZlO2Z1bmN0aW9uIE1pKG8pe3JldHVybiBSaSh0aGlzLG8pLmdldChvKX12YXIgQWk9TWksJGk9RmU7ZnVuY3Rpb24gRGkobyl7cmV0dXJuICRpKHRoaXMsbykuaGFzKG8pfXZhciBqaT1EaSxGaT1GZTtmdW5jdGlvbiBCaShvLGUpe3ZhciB0PUZpKHRoaXMsbykscj10LnNpemU7cmV0dXJuIHQuc2V0KG8sZSksdGhpcy5zaXplKz10LnNpemU9PXI/MDoxLHRoaXN9dmFyIF9pPUJpLEVpPVRpLHppPVdpLFVpPUFpLEdpPWppLFhpPV9pO2Z1bmN0aW9uIHZlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fXZlLnByb3RvdHlwZS5jbGVhcj1FaSx2ZS5wcm90b3R5cGUuZGVsZXRlPXppLHZlLnByb3RvdHlwZS5nZXQ9VWksdmUucHJvdG90eXBlLmhhcz1HaSx2ZS5wcm90b3R5cGUuc2V0PVhpO3ZhciBXdD12ZSxIaT0kZSxZaT10dCxxaT1XdCxaaT0yMDA7ZnVuY3Rpb24gUWkobyxlKXt2YXIgdD10aGlzLl9fZGF0YV9fO2lmKHQgaW5zdGFuY2VvZiBIaSl7dmFyIHI9dC5fX2RhdGFfXztpZighWWl8fHIubGVuZ3RoPFppLTEpcmV0dXJuIHIucHVzaChbbyxlXSksdGhpcy5zaXplPSsrdC5zaXplLHRoaXM7dD10aGlzLl9fZGF0YV9fPW5ldyBxaShyKX1yZXR1cm4gdC5zZXQobyxlKSx0aGlzLnNpemU9dC5zaXplLHRoaXN9dmFyIEppPVFpLEtpPSRlLFZpPUJvLGVuPUVvLHRuPVVvLHJuPVhvLG9uPUppO2Z1bmN0aW9uIFNlKG8pe3ZhciBlPXRoaXMuX19kYXRhX189bmV3IEtpKG8pO3RoaXMuc2l6ZT1lLnNpemV9U2UucHJvdG90eXBlLmNsZWFyPVZpLFNlLnByb3RvdHlwZS5kZWxldGU9ZW4sU2UucHJvdG90eXBlLmdldD10bixTZS5wcm90b3R5cGUuaGFzPXJuLFNlLnByb3RvdHlwZS5zZXQ9b247dmFyIFJ0PVNlO2Z1bmN0aW9uIHNuKG8sZSl7Zm9yKHZhciB0PS0xLHI9bz09bnVsbD8wOm8ubGVuZ3RoOysrdDxyJiZlKG9bdF0sdCxvKSE9PSExOyk7cmV0dXJuIG99dmFyIG5uPXNuLGFuPXBlLGxuPWZ1bmN0aW9uKCl7dHJ5e3ZhciBvPWFuKE9iamVjdCwiZGVmaW5lUHJvcGVydHkiKTtyZXR1cm4gbyh7fSwiIix7fSksb31jYXRjaHt9fSgpLGNuPWxuLE10PWNuO2Z1bmN0aW9uIHVuKG8sZSx0KXtlPT0iX19wcm90b19fIiYmTXQ/TXQobyxlLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx2YWx1ZTp0LHdyaXRhYmxlOiEwfSk6b1tlXT10fXZhciBBdD11bixobj1BdCxkbj1WZSxmbj1PYmplY3QucHJvdG90eXBlLHBuPWZuLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIHluKG8sZSx0KXt2YXIgcj1vW2VdOyghKHBuLmNhbGwobyxlKSYmZG4ocix0KSl8fHQ9PT12b2lkIDAmJiEoZSBpbiBvKSkmJmhuKG8sZSx0KX12YXIgJHQ9eW4sd249JHQsbW49QXQ7ZnVuY3Rpb24gZ24obyxlLHQscil7dmFyIGk9IXQ7dHx8KHQ9e30pO2Zvcih2YXIgcz0tMSxuPWUubGVuZ3RoOysrczxuOyl7dmFyIGE9ZVtzXSxsPXI/cih0W2FdLG9bYV0sYSx0LG8pOnZvaWQgMDtsPT09dm9pZCAwJiYobD1vW2FdKSxpP21uKHQsYSxsKTp3bih0LGEsbCl9cmV0dXJuIHR9dmFyIEJlPWduO2Z1bmN0aW9uIGJuKG8sZSl7Zm9yKHZhciB0PS0xLHI9QXJyYXkobyk7Kyt0PG87KXJbdF09ZSh0KTtyZXR1cm4gcn12YXIgdm49Ym47ZnVuY3Rpb24gU24obyl7cmV0dXJuIG8hPW51bGwmJnR5cGVvZiBvPT0ib2JqZWN0In12YXIgY2U9U24sa249ZmUsUG49Y2UsVG49IltvYmplY3QgQXJndW1lbnRzXSI7ZnVuY3Rpb24gSW4obyl7cmV0dXJuIFBuKG8pJiZrbihvKT09VG59dmFyIHhuPUluLER0PXhuLE9uPWNlLGp0PU9iamVjdC5wcm90b3R5cGUsTG49anQuaGFzT3duUHJvcGVydHksQ249anQucHJvcGVydHlJc0VudW1lcmFibGUsTm49RHQoZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzfSgpKT9EdDpmdW5jdGlvbihvKXtyZXR1cm4gT24obykmJkxuLmNhbGwobywiY2FsbGVlIikmJiFDbi5jYWxsKG8sImNhbGxlZSIpfSxXbj1ObixSbj1BcnJheS5pc0FycmF5LF9lPVJuLEVlPXtleHBvcnRzOnt9fTtmdW5jdGlvbiBNbigpe3JldHVybiExfXZhciBBbj1NbjtFZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9aWUscj1BbixpPWUmJiFlLm5vZGVUeXBlJiZlLHM9aSYmITAmJm8mJiFvLm5vZGVUeXBlJiZvLG49cyYmcy5leHBvcnRzPT09aSxhPW4/dC5CdWZmZXI6dm9pZCAwLGw9YT9hLmlzQnVmZmVyOnZvaWQgMCxjPWx8fHI7by5leHBvcnRzPWN9KEVlLEVlLmV4cG9ydHMpO3ZhciBydD1FZS5leHBvcnRzLCRuPTkwMDcxOTkyNTQ3NDA5OTEsRG49L14oPzowfFsxLTldXGQqKSQvO2Z1bmN0aW9uIGpuKG8sZSl7dmFyIHQ9dHlwZW9mIG87cmV0dXJuIGU9ZT8/JG4sISFlJiYodD09Im51bWJlciJ8fHQhPSJzeW1ib2wiJiZEbi50ZXN0KG8pKSYmbz4tMSYmbyUxPT0wJiZvPGV9dmFyIEZuPWpuLEJuPTkwMDcxOTkyNTQ3NDA5OTE7ZnVuY3Rpb24gX24obyl7cmV0dXJuIHR5cGVvZiBvPT0ibnVtYmVyIiYmbz4tMSYmbyUxPT0wJiZvPD1Cbn12YXIgRnQ9X24sRW49ZmUsem49RnQsVW49Y2UsR249IltvYmplY3QgQXJndW1lbnRzXSIsWG49IltvYmplY3QgQXJyYXldIixIbj0iW29iamVjdCBCb29sZWFuXSIsWW49IltvYmplY3QgRGF0ZV0iLHFuPSJbb2JqZWN0IEVycm9yXSIsWm49IltvYmplY3QgRnVuY3Rpb25dIixRbj0iW29iamVjdCBNYXBdIixKbj0iW29iamVjdCBOdW1iZXJdIixLbj0iW29iamVjdCBPYmplY3RdIixWbj0iW29iamVjdCBSZWdFeHBdIixlYT0iW29iamVjdCBTZXRdIix0YT0iW29iamVjdCBTdHJpbmddIixyYT0iW29iamVjdCBXZWFrTWFwXSIsb2E9IltvYmplY3QgQXJyYXlCdWZmZXJdIixzYT0iW29iamVjdCBEYXRhVmlld10iLGlhPSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG5hPSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLGFhPSJbb2JqZWN0IEludDhBcnJheV0iLGxhPSJbb2JqZWN0IEludDE2QXJyYXldIixjYT0iW29iamVjdCBJbnQzMkFycmF5XSIsdWE9IltvYmplY3QgVWludDhBcnJheV0iLGhhPSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsZGE9IltvYmplY3QgVWludDE2QXJyYXldIixmYT0iW29iamVjdCBVaW50MzJBcnJheV0iLFg9e307WFtpYV09WFtuYV09WFthYV09WFtsYV09WFtjYV09WFt1YV09WFtoYV09WFtkYV09WFtmYV09ITAsWFtHbl09WFtYbl09WFtvYV09WFtIbl09WFtzYV09WFtZbl09WFtxbl09WFtabl09WFtRbl09WFtKbl09WFtLbl09WFtWbl09WFtlYV09WFt0YV09WFtyYV09ITE7ZnVuY3Rpb24gcGEobyl7cmV0dXJuIFVuKG8pJiZ6bihvLmxlbmd0aCkmJiEhWFtFbihvKV19dmFyIHlhPXBhO2Z1bmN0aW9uIHdhKG8pe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbyhlKX19dmFyIG90PXdhLHplPXtleHBvcnRzOnt9fTt6ZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9U3Qscj1lJiYhZS5ub2RlVHlwZSYmZSxpPXImJiEwJiZvJiYhby5ub2RlVHlwZSYmbyxzPWkmJmkuZXhwb3J0cz09PXIsbj1zJiZ0LnByb2Nlc3MsYT1mdW5jdGlvbigpe3RyeXt2YXIgbD1pJiZpLnJlcXVpcmUmJmkucmVxdWlyZSgidXRpbCIpLnR5cGVzO3JldHVybiBsfHxuJiZuLmJpbmRpbmcmJm4uYmluZGluZygidXRpbCIpfWNhdGNoe319KCk7by5leHBvcnRzPWF9KHplLHplLmV4cG9ydHMpO3ZhciBzdD16ZS5leHBvcnRzLG1hPXlhLGdhPW90LEJ0PXN0LF90PUJ0JiZCdC5pc1R5cGVkQXJyYXksYmE9X3Q/Z2EoX3QpOm1hLEV0PWJhLHZhPXZuLFNhPVduLGthPV9lLFBhPXJ0LFRhPUZuLElhPUV0LHhhPU9iamVjdC5wcm90b3R5cGUsT2E9eGEuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gTGEobyxlKXt2YXIgdD1rYShvKSxyPSF0JiZTYShvKSxpPSF0JiYhciYmUGEobykscz0hdCYmIXImJiFpJiZJYShvKSxuPXR8fHJ8fGl8fHMsYT1uP3ZhKG8ubGVuZ3RoLFN0cmluZyk6W10sbD1hLmxlbmd0aDtmb3IodmFyIGMgaW4gbykoZXx8T2EuY2FsbChvLGMpKSYmIShuJiYoYz09Imxlbmd0aCJ8fGkmJihjPT0ib2Zmc2V0Inx8Yz09InBhcmVudCIpfHxzJiYoYz09ImJ1ZmZlciJ8fGM9PSJieXRlTGVuZ3RoInx8Yz09ImJ5dGVPZmZzZXQiKXx8VGEoYyxsKSkpJiZhLnB1c2goYyk7cmV0dXJuIGF9dmFyIHp0PUxhLENhPU9iamVjdC5wcm90b3R5cGU7ZnVuY3Rpb24gTmEobyl7dmFyIGU9byYmby5jb25zdHJ1Y3Rvcix0PXR5cGVvZiBlPT0iZnVuY3Rpb24iJiZlLnByb3RvdHlwZXx8Q2E7cmV0dXJuIG89PT10fXZhciBpdD1OYTtmdW5jdGlvbiBXYShvLGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbyhlKHQpKX19dmFyIFV0PVdhLFJhPVV0LE1hPVJhKE9iamVjdC5rZXlzLE9iamVjdCksQWE9TWEsJGE9aXQsRGE9QWEsamE9T2JqZWN0LnByb3RvdHlwZSxGYT1qYS5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBCYShvKXtpZighJGEobykpcmV0dXJuIERhKG8pO3ZhciBlPVtdO2Zvcih2YXIgdCBpbiBPYmplY3QobykpRmEuY2FsbChvLHQpJiZ0IT0iY29uc3RydWN0b3IiJiZlLnB1c2godCk7cmV0dXJuIGV9dmFyIF9hPUJhLEVhPXh0LHphPUZ0O2Z1bmN0aW9uIFVhKG8pe3JldHVybiBvIT1udWxsJiZ6YShvLmxlbmd0aCkmJiFFYShvKX12YXIgR3Q9VWEsR2E9enQsWGE9X2EsSGE9R3Q7ZnVuY3Rpb24gWWEobyl7cmV0dXJuIEhhKG8pP0dhKG8pOlhhKG8pfXZhciBudD1ZYSxxYT1CZSxaYT1udDtmdW5jdGlvbiBRYShvLGUpe3JldHVybiBvJiZxYShlLFphKGUpLG8pfXZhciBKYT1RYTtmdW5jdGlvbiBLYShvKXt2YXIgZT1bXTtpZihvIT1udWxsKWZvcih2YXIgdCBpbiBPYmplY3QobykpZS5wdXNoKHQpO3JldHVybiBlfXZhciBWYT1LYSxlbD11ZSx0bD1pdCxybD1WYSxvbD1PYmplY3QucHJvdG90eXBlLHNsPW9sLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIGlsKG8pe2lmKCFlbChvKSlyZXR1cm4gcmwobyk7dmFyIGU9dGwobyksdD1bXTtmb3IodmFyIHIgaW4gbylyPT0iY29uc3RydWN0b3IiJiYoZXx8IXNsLmNhbGwobyxyKSl8fHQucHVzaChyKTtyZXR1cm4gdH12YXIgbmw9aWwsYWw9enQsbGw9bmwsY2w9R3Q7ZnVuY3Rpb24gdWwobyl7cmV0dXJuIGNsKG8pP2FsKG8sITApOmxsKG8pfXZhciBhdD11bCxobD1CZSxkbD1hdDtmdW5jdGlvbiBmbChvLGUpe3JldHVybiBvJiZobChlLGRsKGUpLG8pfXZhciBwbD1mbCxVZT17ZXhwb3J0czp7fX07VWUuZXhwb3J0cyxmdW5jdGlvbihvLGUpe3ZhciB0PWllLHI9ZSYmIWUubm9kZVR5cGUmJmUsaT1yJiYhMCYmbyYmIW8ubm9kZVR5cGUmJm8scz1pJiZpLmV4cG9ydHM9PT1yLG49cz90LkJ1ZmZlcjp2b2lkIDAsYT1uP24uYWxsb2NVbnNhZmU6dm9pZCAwO2Z1bmN0aW9uIGwoYyx1KXtpZih1KXJldHVybiBjLnNsaWNlKCk7dmFyIGg9Yy5sZW5ndGgsZD1hP2EoaCk6bmV3IGMuY29uc3RydWN0b3IoaCk7cmV0dXJuIGMuY29weShkKSxkfW8uZXhwb3J0cz1sfShVZSxVZS5leHBvcnRzKTt2YXIgeWw9VWUuZXhwb3J0cztmdW5jdGlvbiB3bChvLGUpe3ZhciB0PS0xLHI9by5sZW5ndGg7Zm9yKGV8fChlPUFycmF5KHIpKTsrK3Q8cjspZVt0XT1vW3RdO3JldHVybiBlfXZhciBtbD13bDtmdW5jdGlvbiBnbChvLGUpe2Zvcih2YXIgdD0tMSxyPW89PW51bGw/MDpvLmxlbmd0aCxpPTAscz1bXTsrK3Q8cjspe3ZhciBuPW9bdF07ZShuLHQsbykmJihzW2krK109bil9cmV0dXJuIHN9dmFyIGJsPWdsO2Z1bmN0aW9uIHZsKCl7cmV0dXJuW119dmFyIFh0PXZsLFNsPWJsLGtsPVh0LFBsPU9iamVjdC5wcm90b3R5cGUsVGw9UGwucHJvcGVydHlJc0VudW1lcmFibGUsSHQ9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxJbD1IdD9mdW5jdGlvbihvKXtyZXR1cm4gbz09bnVsbD9bXToobz1PYmplY3QobyksU2woSHQobyksZnVuY3Rpb24oZSl7cmV0dXJuIFRsLmNhbGwobyxlKX0pKX06a2wsbHQ9SWwseGw9QmUsT2w9bHQ7ZnVuY3Rpb24gTGwobyxlKXtyZXR1cm4geGwobyxPbChvKSxlKX12YXIgQ2w9TGw7ZnVuY3Rpb24gTmwobyxlKXtmb3IodmFyIHQ9LTEscj1lLmxlbmd0aCxpPW8ubGVuZ3RoOysrdDxyOylvW2krdF09ZVt0XTtyZXR1cm4gb312YXIgWXQ9TmwsV2w9VXQsUmw9V2woT2JqZWN0LmdldFByb3RvdHlwZU9mLE9iamVjdCkscXQ9UmwsTWw9WXQsQWw9cXQsJGw9bHQsRGw9WHQsamw9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxGbD1qbD9mdW5jdGlvbihvKXtmb3IodmFyIGU9W107bzspTWwoZSwkbChvKSksbz1BbChvKTtyZXR1cm4gZX06RGwsWnQ9RmwsQmw9QmUsX2w9WnQ7ZnVuY3Rpb24gRWwobyxlKXtyZXR1cm4gQmwobyxfbChvKSxlKX12YXIgemw9RWwsVWw9WXQsR2w9X2U7ZnVuY3Rpb24gWGwobyxlLHQpe3ZhciByPWUobyk7cmV0dXJuIEdsKG8pP3I6VWwocix0KG8pKX12YXIgUXQ9WGwsSGw9UXQsWWw9bHQscWw9bnQ7ZnVuY3Rpb24gWmwobyl7cmV0dXJuIEhsKG8scWwsWWwpfXZhciBKdD1abCxRbD1RdCxKbD1adCxLbD1hdDtmdW5jdGlvbiBWbChvKXtyZXR1cm4gUWwobyxLbCxKbCl9dmFyIGVjPVZsLHRjPXBlLHJjPWllLG9jPXRjKHJjLCJEYXRhVmlldyIpLHNjPW9jLGljPXBlLG5jPWllLGFjPWljKG5jLCJQcm9taXNlIiksbGM9YWMsY2M9cGUsdWM9aWUsaGM9Y2ModWMsIlNldCIpLGRjPWhjLGZjPXBlLHBjPWllLHljPWZjKHBjLCJXZWFrTWFwIiksd2M9eWMsY3Q9c2MsdXQ9dHQsaHQ9bGMsZHQ9ZGMsZnQ9d2MsS3Q9ZmUsa2U9THQsVnQ9IltvYmplY3QgTWFwXSIsbWM9IltvYmplY3QgT2JqZWN0XSIsZXI9IltvYmplY3QgUHJvbWlzZV0iLHRyPSJbb2JqZWN0IFNldF0iLHJyPSJbb2JqZWN0IFdlYWtNYXBdIixvcj0iW29iamVjdCBEYXRhVmlld10iLGdjPWtlKGN0KSxiYz1rZSh1dCksdmM9a2UoaHQpLFNjPWtlKGR0KSxrYz1rZShmdCkseWU9S3Q7KGN0JiZ5ZShuZXcgY3QobmV3IEFycmF5QnVmZmVyKDEpKSkhPW9yfHx1dCYmeWUobmV3IHV0KSE9VnR8fGh0JiZ5ZShodC5yZXNvbHZlKCkpIT1lcnx8ZHQmJnllKG5ldyBkdCkhPXRyfHxmdCYmeWUobmV3IGZ0KSE9cnIpJiYoeWU9ZnVuY3Rpb24obyl7dmFyIGU9S3QobyksdD1lPT1tYz9vLmNvbnN0cnVjdG9yOnZvaWQgMCxyPXQ/a2UodCk6IiI7aWYocilzd2l0Y2gocil7Y2FzZSBnYzpyZXR1cm4gb3I7Y2FzZSBiYzpyZXR1cm4gVnQ7Y2FzZSB2YzpyZXR1cm4gZXI7Y2FzZSBTYzpyZXR1cm4gdHI7Y2FzZSBrYzpyZXR1cm4gcnJ9cmV0dXJuIGV9KTt2YXIgR2U9eWUsUGM9T2JqZWN0LnByb3RvdHlwZSxUYz1QYy5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBJYyhvKXt2YXIgZT1vLmxlbmd0aCx0PW5ldyBvLmNvbnN0cnVjdG9yKGUpO3JldHVybiBlJiZ0eXBlb2Ygb1swXT09InN0cmluZyImJlRjLmNhbGwobywiaW5kZXgiKSYmKHQuaW5kZXg9by5pbmRleCx0LmlucHV0PW8uaW5wdXQpLHR9dmFyIHhjPUljLE9jPWllLExjPU9jLlVpbnQ4QXJyYXksc3I9TGMsaXI9c3I7ZnVuY3Rpb24gQ2Mobyl7dmFyIGU9bmV3IG8uY29uc3RydWN0b3Ioby5ieXRlTGVuZ3RoKTtyZXR1cm4gbmV3IGlyKGUpLnNldChuZXcgaXIobykpLGV9dmFyIHB0PUNjLE5jPXB0O2Z1bmN0aW9uIFdjKG8sZSl7dmFyIHQ9ZT9OYyhvLmJ1ZmZlcik6by5idWZmZXI7cmV0dXJuIG5ldyBvLmNvbnN0cnVjdG9yKHQsby5ieXRlT2Zmc2V0LG8uYnl0ZUxlbmd0aCl9dmFyIFJjPVdjLE1jPS9cdyokLztmdW5jdGlvbiBBYyhvKXt2YXIgZT1uZXcgby5jb25zdHJ1Y3RvcihvLnNvdXJjZSxNYy5leGVjKG8pKTtyZXR1cm4gZS5sYXN0SW5kZXg9by5sYXN0SW5kZXgsZX12YXIgJGM9QWMsbnI9RGUsYXI9bnI/bnIucHJvdG90eXBlOnZvaWQgMCxscj1hcj9hci52YWx1ZU9mOnZvaWQgMDtmdW5jdGlvbiBEYyhvKXtyZXR1cm4gbHI/T2JqZWN0KGxyLmNhbGwobykpOnt9fXZhciBqYz1EYyxGYz1wdDtmdW5jdGlvbiBCYyhvLGUpe3ZhciB0PWU/RmMoby5idWZmZXIpOm8uYnVmZmVyO3JldHVybiBuZXcgby5jb25zdHJ1Y3Rvcih0LG8uYnl0ZU9mZnNldCxvLmxlbmd0aCl9dmFyIF9jPUJjLEVjPXB0LHpjPVJjLFVjPSRjLEdjPWpjLFhjPV9jLEhjPSJbb2JqZWN0IEJvb2xlYW5dIixZYz0iW29iamVjdCBEYXRlXSIscWM9IltvYmplY3QgTWFwXSIsWmM9IltvYmplY3QgTnVtYmVyXSIsUWM9IltvYmplY3QgUmVnRXhwXSIsSmM9IltvYmplY3QgU2V0XSIsS2M9IltvYmplY3QgU3RyaW5nXSIsVmM9IltvYmplY3QgU3ltYm9sXSIsZXU9IltvYmplY3QgQXJyYXlCdWZmZXJdIix0dT0iW29iamVjdCBEYXRhVmlld10iLHJ1PSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG91PSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLHN1PSJbb2JqZWN0IEludDhBcnJheV0iLGl1PSJbb2JqZWN0IEludDE2QXJyYXldIixudT0iW29iamVjdCBJbnQzMkFycmF5XSIsYXU9IltvYmplY3QgVWludDhBcnJheV0iLGx1PSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsY3U9IltvYmplY3QgVWludDE2QXJyYXldIix1dT0iW29iamVjdCBVaW50MzJBcnJheV0iO2Z1bmN0aW9uIGh1KG8sZSx0KXt2YXIgcj1vLmNvbnN0cnVjdG9yO3N3aXRjaChlKXtjYXNlIGV1OnJldHVybiBFYyhvKTtjYXNlIEhjOmNhc2UgWWM6cmV0dXJuIG5ldyByKCtvKTtjYXNlIHR1OnJldHVybiB6YyhvLHQpO2Nhc2UgcnU6Y2FzZSBvdTpjYXNlIHN1OmNhc2UgaXU6Y2FzZSBudTpjYXNlIGF1OmNhc2UgbHU6Y2FzZSBjdTpjYXNlIHV1OnJldHVybiBYYyhvLHQpO2Nhc2UgcWM6cmV0dXJuIG5ldyByO2Nhc2UgWmM6Y2FzZSBLYzpyZXR1cm4gbmV3IHIobyk7Y2FzZSBRYzpyZXR1cm4gVWMobyk7Y2FzZSBKYzpyZXR1cm4gbmV3IHI7Y2FzZSBWYzpyZXR1cm4gR2Mobyl9fXZhciBkdT1odSxmdT11ZSxjcj1PYmplY3QuY3JlYXRlLHB1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbygpe31yZXR1cm4gZnVuY3Rpb24oZSl7aWYoIWZ1KGUpKXJldHVybnt9O2lmKGNyKXJldHVybiBjcihlKTtvLnByb3RvdHlwZT1lO3ZhciB0PW5ldyBvO3JldHVybiBvLnByb3RvdHlwZT12b2lkIDAsdH19KCkseXU9cHUsd3U9eXUsbXU9cXQsZ3U9aXQ7ZnVuY3Rpb24gYnUobyl7cmV0dXJuIHR5cGVvZiBvLmNvbnN0cnVjdG9yPT0iZnVuY3Rpb24iJiYhZ3Uobyk/d3UobXUobykpOnt9fXZhciB2dT1idSxTdT1HZSxrdT1jZSxQdT0iW29iamVjdCBNYXBdIjtmdW5jdGlvbiBUdShvKXtyZXR1cm4ga3UobykmJlN1KG8pPT1QdX12YXIgSXU9VHUseHU9SXUsT3U9b3QsdXI9c3QsaHI9dXImJnVyLmlzTWFwLEx1PWhyP091KGhyKTp4dSxDdT1MdSxOdT1HZSxXdT1jZSxSdT0iW29iamVjdCBTZXRdIjtmdW5jdGlvbiBNdShvKXtyZXR1cm4gV3UobykmJk51KG8pPT1SdX12YXIgQXU9TXUsJHU9QXUsRHU9b3QsZHI9c3QsZnI9ZHImJmRyLmlzU2V0LGp1PWZyP0R1KGZyKTokdSxGdT1qdSxCdT1SdCxfdT1ubixFdT0kdCx6dT1KYSxVdT1wbCxHdT15bCxYdT1tbCxIdT1DbCxZdT16bCxxdT1KdCxadT1lYyxRdT1HZSxKdT14YyxLdT1kdSxWdT12dSxlaD1fZSx0aD1ydCxyaD1DdSxvaD11ZSxzaD1GdSxpaD1udCxuaD1hdCxhaD0xLGxoPTIsY2g9NCxwcj0iW29iamVjdCBBcmd1bWVudHNdIix1aD0iW29iamVjdCBBcnJheV0iLGhoPSJbb2JqZWN0IEJvb2xlYW5dIixkaD0iW29iamVjdCBEYXRlXSIsZmg9IltvYmplY3QgRXJyb3JdIix5cj0iW29iamVjdCBGdW5jdGlvbl0iLHBoPSJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSIseWg9IltvYmplY3QgTWFwXSIsd2g9IltvYmplY3QgTnVtYmVyXSIsd3I9IltvYmplY3QgT2JqZWN0XSIsbWg9IltvYmplY3QgUmVnRXhwXSIsZ2g9IltvYmplY3QgU2V0XSIsYmg9IltvYmplY3QgU3RyaW5nXSIsdmg9IltvYmplY3QgU3ltYm9sXSIsU2g9IltvYmplY3QgV2Vha01hcF0iLGtoPSJbb2JqZWN0IEFycmF5QnVmZmVyXSIsUGg9IltvYmplY3QgRGF0YVZpZXddIixUaD0iW29iamVjdCBGbG9hdDMyQXJyYXldIixJaD0iW29iamVjdCBGbG9hdDY0QXJyYXldIix4aD0iW29iamVjdCBJbnQ4QXJyYXldIixPaD0iW29iamVjdCBJbnQxNkFycmF5XSIsTGg9IltvYmplY3QgSW50MzJBcnJheV0iLENoPSJbb2JqZWN0IFVpbnQ4QXJyYXldIixOaD0iW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0iLFdoPSJbb2JqZWN0IFVpbnQxNkFycmF5XSIsUmg9IltvYmplY3QgVWludDMyQXJyYXldIixVPXt9O1VbcHJdPVVbdWhdPVVba2hdPVVbUGhdPVVbaGhdPVVbZGhdPVVbVGhdPVVbSWhdPVVbeGhdPVVbT2hdPVVbTGhdPVVbeWhdPVVbd2hdPVVbd3JdPVVbbWhdPVVbZ2hdPVVbYmhdPVVbdmhdPVVbQ2hdPVVbTmhdPVVbV2hdPVVbUmhdPSEwLFVbZmhdPVVbeXJdPVVbU2hdPSExO2Z1bmN0aW9uIFhlKG8sZSx0LHIsaSxzKXt2YXIgbixhPWUmYWgsbD1lJmxoLGM9ZSZjaDtpZih0JiYobj1pP3QobyxyLGkscyk6dChvKSksbiE9PXZvaWQgMClyZXR1cm4gbjtpZighb2gobykpcmV0dXJuIG87dmFyIHU9ZWgobyk7aWYodSl7aWYobj1KdShvKSwhYSlyZXR1cm4gWHUobyxuKX1lbHNle3ZhciBoPVF1KG8pLGQ9aD09eXJ8fGg9PXBoO2lmKHRoKG8pKXJldHVybiBHdShvLGEpO2lmKGg9PXdyfHxoPT1wcnx8ZCYmIWkpe2lmKG49bHx8ZD97fTpWdShvKSwhYSlyZXR1cm4gbD9ZdShvLFV1KG4sbykpOkh1KG8senUobixvKSl9ZWxzZXtpZighVVtoXSlyZXR1cm4gaT9vOnt9O249S3UobyxoLGEpfX1zfHwocz1uZXcgQnUpO3ZhciBmPXMuZ2V0KG8pO2lmKGYpcmV0dXJuIGY7cy5zZXQobyxuKSxzaChvKT9vLmZvckVhY2goZnVuY3Rpb24oZyl7bi5hZGQoWGUoZyxlLHQsZyxvLHMpKX0pOnJoKG8pJiZvLmZvckVhY2goZnVuY3Rpb24oZyxQKXtuLnNldChQLFhlKGcsZSx0LFAsbyxzKSl9KTt2YXIgdz1jP2w/WnU6cXU6bD9uaDppaCx5PXU/dm9pZCAwOncobyk7cmV0dXJuIF91KHl8fG8sZnVuY3Rpb24oZyxQKXt5JiYoUD1nLGc9b1tQXSksRXUobixQLFhlKGcsZSx0LFAsbyxzKSl9KSxufXZhciBNaD1YZSxBaD1NaCwkaD0xLERoPTQ7ZnVuY3Rpb24gamgobyl7cmV0dXJuIEFoKG8sJGh8RGgpfXZhciBGaD1qaCxyZT1tZShGaCksbXI7KGZ1bmN0aW9uKG8pe29bby5wZWRkaW5nPTBdPSJwZWRkaW5nIixvW28ubW91bnRlZD0xXT0ibW91bnRlZCIsb1tvLnVwZGF0ZT0yXT0idXBkYXRlIixvW28udW5tb3VudGVkPTNdPSJ1bm1vdW50ZWQifSkobXJ8fChtcj17fSkpO3ZhciBROyhmdW5jdGlvbihvKXtvLk5vcm1hbD0iTm9ybWFsIixvLlN0cm9rZT0iU3Ryb2tlIixvLkRvdHRlZD0iRG90dGVkIixvLkxvbmdEb3R0ZWQ9IkxvbmdEb3R0ZWQifSkoUXx8KFE9e30pKTt2YXIgZ3I7KGZ1bmN0aW9uKG8pe28uVHJpYW5nbGU9InRyaWFuZ2xlIixvLlJob21idXM9InJob21idXMiLG8uUGVudGFncmFtPSJwZW50YWdyYW0iLG8uU3BlZWNoQmFsbG9vbj0ic3BlZWNoQmFsbG9vbiIsby5TdGFyPSJzdGFyIixvLlBvbHlnb249InBvbHlnb24ifSkoZ3J8fChncj17fSkpO3ZhciBCOyhmdW5jdGlvbihvKXtvLk5vbmU9Ik5vbmUiLG8uU2hvd0Zsb2F0QmFyPSJTaG93RmxvYXRCYXIiLG8uWkluZGV4RmxvYXRCYXI9IlpJbmRleEZsb2F0QmFyIixvLkRlbGV0ZU5vZGU9IkRlbGV0ZU5vZGUiLG8uQ29weU5vZGU9IkNvcHlOb2RlIixvLlpJbmRleEFjdGl2ZT0iWkluZGV4QWN0aXZlIixvLlpJbmRleE5vZGU9IlpJbmRleE5vZGUiLG8uUm90YXRlTm9kZT0iUm90YXRlTm9kZSIsby5TZXRDb2xvck5vZGU9IlNldENvbG9yTm9kZSIsby5UcmFuc2xhdGVOb2RlPSJUcmFuc2xhdGVOb2RlIixvLlNjYWxlTm9kZT0iU2NhbGVOb2RlIixvLk9yaWdpbmFsRXZlbnQ9Ik9yaWdpbmFsRXZlbnQiLG8uQ3JlYXRlU2NlbmU9IkNyZWF0ZVNjZW5lIixvLkFjdGl2ZUN1cnNvcj0iQWN0aXZlQ3Vyc29yIixvLk1vdmVDdXJzb3I9Ik1vdmVDdXJzb3IiLG8uQ29tbWFuZEVkaXRvcj0iQ29tbWFuZEVkaXRvciIsby5TZXRFZGl0b3JEYXRhPSJTZXRFZGl0b3JEYXRhIixvLlNldEZvbnRTdHlsZT0iU2V0Rm9udFN0eWxlIixvLlNldFBvaW50PSJTZXRQb2ludCIsby5TZXRMb2NrPSJTZXRMb2NrIixvLlNldFNoYXBlT3B0PSJTZXRTaGFwZU9wdCJ9KShCfHwoQj17fSkpO3ZhciBicjsoZnVuY3Rpb24obyl7by5EaXNwbGF5U3RhdGU9IkRpc3BsYXlTdGF0ZSIsby5GbG9hdEJhcj0iRmxvYXRCYXIiLG8uQ2FudmFzU2VsZWN0b3I9IkNhbnZhc1NlbGVjdG9yIixvLk1haW5FbmdpbmU9Ik1haW5FbmdpbmUiLG8uRGlzcGxheUNvbnRhaW5lcj0iRGlzcGxheUNvbnRhaW5lciIsby5DdXJzb3I9IkN1cnNvciIsby5UZXh0RWRpdG9yPSJUZXh0RWRpdG9yIixvLkJpbmRNYWluVmlldz0iQmluZE1haW5WaWV3IixvLk1vdW50TWFpblZpZXc9Ik1vdW50TWFpblZpZXciLG8uTW91bnRBcHBWaWV3PSJNb3VudEFwcFZpZXcifSkoYnJ8fChicj17fSkpO3ZhciB2cjsoZnVuY3Rpb24obyl7b1tvLk1haW5WaWV3PTBdPSJNYWluVmlldyIsb1tvLlBsdWdpbj0xXT0iUGx1Z2luIixvW28uQm90aD0yXT0iQm90aCJ9KSh2cnx8KHZyPXt9KSk7dmFyIFM7KGZ1bmN0aW9uKG8pe29bby5QZW5jaWw9MV09IlBlbmNpbCIsb1tvLkVyYXNlcj0yXT0iRXJhc2VyIixvW28uU2VsZWN0b3I9M109IlNlbGVjdG9yIixvW28uQ2xpY2tlcj00XT0iQ2xpY2tlciIsb1tvLkFycm93PTVdPSJBcnJvdyIsb1tvLkhhbmQ9Nl09IkhhbmQiLG9bby5MYXNlclBlbj03XT0iTGFzZXJQZW4iLG9bby5UZXh0PThdPSJUZXh0IixvW28uU3RyYWlnaHQ9OV09IlN0cmFpZ2h0IixvW28uUmVjdGFuZ2xlPTEwXT0iUmVjdGFuZ2xlIixvW28uRWxsaXBzZT0xMV09IkVsbGlwc2UiLG9bby5TdGFyPTEyXT0iU3RhciIsb1tvLlRyaWFuZ2xlPTEzXT0iVHJpYW5nbGUiLG9bby5SaG9tYnVzPTE0XT0iUmhvbWJ1cyIsb1tvLlBvbHlnb249MTVdPSJQb2x5Z29uIixvW28uU3BlZWNoQmFsbG9vbj0xNl09IlNwZWVjaEJhbGxvb24iLG9bby5JbWFnZT0xN109IkltYWdlIn0pKFN8fChTPXt9KSk7dmFyIFc7KGZ1bmN0aW9uKG8pe29bby5Mb2NhbD0xXT0iTG9jYWwiLG9bby5TZXJ2aWNlPTJdPSJTZXJ2aWNlIixvW28uV29ya2VyPTNdPSJXb3JrZXIifSkoV3x8KFc9e30pKTt2YXIgRjsoZnVuY3Rpb24obyl7b1tvLlBlbmRpbmc9MF09IlBlbmRpbmciLG9bby5TdGFydD0xXT0iU3RhcnQiLG9bby5Eb2luZz0yXT0iRG9pbmciLG9bby5Eb25lPTNdPSJEb25lIixvW28uRnJlZXplPTRdPSJGcmVlemUiLG9bby5VbndyaXRhYmxlPTVdPSJVbndyaXRhYmxlIn0pKEZ8fChGPXt9KSk7dmFyIG07KGZ1bmN0aW9uKG8pe29bby5Ob25lPTBdPSJOb25lIixvW28uSW5pdD0xXT0iSW5pdCIsb1tvLlVwZGF0ZUNhbWVyYT0yXT0iVXBkYXRlQ2FtZXJhIixvW28uVXBkYXRlVG9vbHM9M109IlVwZGF0ZVRvb2xzIixvW28uQ3JlYXRlV29yaz00XT0iQ3JlYXRlV29yayIsb1tvLkRyYXdXb3JrPTVdPSJEcmF3V29yayIsb1tvLkZ1bGxXb3JrPTZdPSJGdWxsV29yayIsb1tvLlVwZGF0ZU5vZGU9N109IlVwZGF0ZU5vZGUiLG9bby5SZW1vdmVOb2RlPThdPSJSZW1vdmVOb2RlIixvW28uQ2xlYXI9OV09IkNsZWFyIixvW28uU2VsZWN0PTEwXT0iU2VsZWN0IixvW28uRGVzdHJveT0xMV09IkRlc3Ryb3kiLG9bby5TbmFwc2hvdD0xMl09IlNuYXBzaG90IixvW28uQm91bmRpbmdCb3g9MTNdPSJCb3VuZGluZ0JveCIsb1tvLkN1cnNvcj0xNF09IkN1cnNvciIsb1tvLlRleHRVcGRhdGU9MTVdPSJUZXh0VXBkYXRlIixvW28uR2V0VGV4dEFjdGl2ZT0xNl09IkdldFRleHRBY3RpdmUiLG9bby5UYXNrc1F1ZXVlPTE3XT0iVGFza3NRdWV1ZSIsb1tvLkN1cnNvckhvdmVyPTE4XT0iQ3Vyc29ySG92ZXIifSkobXx8KG09e30pKTt2YXIgU3I7KGZ1bmN0aW9uKG8pe28uV2ViZ2wyPSJ3ZWJnbDIiLG8uV2ViZ2w9IndlYmdsIixvLkNhbnZhczJkPSIyZCJ9KShTcnx8KFNyPXt9KSk7dmFyIE47KGZ1bmN0aW9uKG8pe29bby5GbG9hdD0xXT0iRmxvYXQiLG9bby5CZz0yXT0iQmciLG9bby5TZWxlY3Rvcj0zXT0iU2VsZWN0b3IiLG9bby5TZXJ2aWNlRmxvYXQ9NF09IlNlcnZpY2VGbG9hdCIsb1tvLk5vbmU9NV09Ik5vbmUifSkoTnx8KE49e30pKTt2YXIga3I7KGZ1bmN0aW9uKG8pe29bby5DdXJzb3I9MV09IkN1cnNvciIsb1tvLlRleHRDcmVhdGU9Ml09IlRleHRDcmVhdGUifSkoa3J8fChrcj17fSkpO3ZhciBQcjsoZnVuY3Rpb24obyl7b1tvLlRvcD0xXT0iVG9wIixvW28uQm90dG9tPTJdPSJCb3R0b20ifSkoUHJ8fChQcj17fSkpO3ZhciBxOyhmdW5jdGlvbihvKXtvW28ubm9uZT0xXT0ibm9uZSIsb1tvLmFsbD0yXT0iYWxsIixvW28uYm90aD0zXT0iYm90aCIsb1tvLnByb3BvcnRpb25hbD00XT0icHJvcG9ydGlvbmFsIn0pKHF8fChxPXt9KSk7Y2xhc3Mgb2V7Y29uc3RydWN0b3IoKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywibG9jYWxXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjZW5lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSl9cmVnaXN0ZXJGb3JXb3JrZXIoZSx0LHIpe3JldHVybiB0aGlzLmxvY2FsV29yaz1lLHRoaXMuc2VydmljZVdvcms9dCx0aGlzLnNjZW5lPXIsdGhpc319Y29uc3QgQmg9e2xpbmVhcjpvPT5vLGVhc2VJblF1YWQ6bz0+bypvLGVhc2VPdXRRdWFkOm89Pm8qKDItbyksZWFzZUluT3V0UXVhZDpvPT5vPC41PzIqbypvOi0xKyg0LTIqbykqbyxlYXNlSW5DdWJpYzpvPT5vKm8qbyxlYXNlT3V0Q3ViaWM6bz0+LS1vKm8qbysxLGVhc2VJbk91dEN1YmljOm89Pm88LjU/NCpvKm8qbzooby0xKSooMipvLTIpKigyKm8tMikrMSxlYXNlSW5RdWFydDpvPT5vKm8qbypvLGVhc2VPdXRRdWFydDpvPT4xLSAtLW8qbypvKm8sZWFzZUluT3V0UXVhcnQ6bz0+bzwuNT84Km8qbypvKm86MS04Ki0tbypvKm8qbyxlYXNlSW5RdWludDpvPT5vKm8qbypvKm8sZWFzZU91dFF1aW50Om89PjErLS1vKm8qbypvKm8sZWFzZUluT3V0UXVpbnQ6bz0+bzwuNT8xNipvKm8qbypvKm86MSsxNiotLW8qbypvKm8qbyxlYXNlSW5TaW5lOm89PjEtTWF0aC5jb3MobypNYXRoLlBJLzIpLGVhc2VPdXRTaW5lOm89Pk1hdGguc2luKG8qTWF0aC5QSS8yKSxlYXNlSW5PdXRTaW5lOm89Pi0oTWF0aC5jb3MoTWF0aC5QSSpvKS0xKS8yLGVhc2VJbkV4cG86bz0+bzw9MD8wOk1hdGgucG93KDIsMTAqby0xMCksZWFzZU91dEV4cG86bz0+bz49MT8xOjEtTWF0aC5wb3coMiwtMTAqbyksZWFzZUluT3V0RXhwbzpvPT5vPD0wPzA6bz49MT8xOm88LjU/TWF0aC5wb3coMiwyMCpvLTEwKS8yOigyLU1hdGgucG93KDIsLTIwKm8rMTApKS8yfTtjbGFzcyBwe2NvbnN0cnVjdG9yKGU9MCx0PTAscj0xKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOmV9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnJ9KX1nZXQgWFkoKXtyZXR1cm5bdGhpcy54LHRoaXMueV19c2V0eihlKXtyZXR1cm4gdGhpcy56PWUsdGhpc31zZXRYWShlPXRoaXMueCx0PXRoaXMueSl7cmV0dXJuIHRoaXMueD1lLHRoaXMueT10LHRoaXN9c2V0KGU9dGhpcy54LHQ9dGhpcy55LHI9dGhpcy56KXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpcy56PXIsdGhpc31zZXRUbyh7eDplPTAseTp0PTAsejpyPTF9KXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpcy56PXIsdGhpc31yb3QoZSl7aWYoZT09PTApcmV0dXJuIHRoaXM7Y29uc3R7eDp0LHk6cn09dGhpcyxpPU1hdGguc2luKGUpLHM9TWF0aC5jb3MoZSk7cmV0dXJuIHRoaXMueD10KnMtcippLHRoaXMueT10KmkrcipzLHRoaXN9cm90V2l0aChlLHQpe2lmKHQ9PT0wKXJldHVybiB0aGlzO2NvbnN0IHI9dGhpcy54LWUueCxpPXRoaXMueS1lLnkscz1NYXRoLnNpbih0KSxuPU1hdGguY29zKHQpO3JldHVybiB0aGlzLng9ZS54KyhyKm4taSpzKSx0aGlzLnk9ZS55KyhyKnMraSpuKSx0aGlzfWNsb25lKCl7Y29uc3R7eDplLHk6dCx6OnJ9PXRoaXM7cmV0dXJuIG5ldyBwKGUsdCxyKX1zdWIoZSl7cmV0dXJuIHRoaXMueC09ZS54LHRoaXMueS09ZS55LHRoaXN9c3ViWFkoZSx0KXtyZXR1cm4gdGhpcy54LT1lLHRoaXMueS09dCx0aGlzfXN1YlNjYWxhcihlKXtyZXR1cm4gdGhpcy54LT1lLHRoaXMueS09ZSx0aGlzfWFkZChlKXtyZXR1cm4gdGhpcy54Kz1lLngsdGhpcy55Kz1lLnksdGhpc31hZGRYWShlLHQpe3JldHVybiB0aGlzLngrPWUsdGhpcy55Kz10LHRoaXN9YWRkU2NhbGFyKGUpe3JldHVybiB0aGlzLngrPWUsdGhpcy55Kz1lLHRoaXN9Y2xhbXAoZSx0KXtyZXR1cm4gdGhpcy54PU1hdGgubWF4KHRoaXMueCxlKSx0aGlzLnk9TWF0aC5tYXgodGhpcy55LGUpLHQhPT12b2lkIDAmJih0aGlzLng9TWF0aC5taW4odGhpcy54LHQpLHRoaXMueT1NYXRoLm1pbih0aGlzLnksdCkpLHRoaXN9ZGl2KGUpe3JldHVybiB0aGlzLngvPWUsdGhpcy55Lz1lLHRoaXN9ZGl2VihlKXtyZXR1cm4gdGhpcy54Lz1lLngsdGhpcy55Lz1lLnksdGhpc31tdWwoZSl7cmV0dXJuIHRoaXMueCo9ZSx0aGlzLnkqPWUsdGhpc31tdWxWKGUpe3JldHVybiB0aGlzLngqPWUueCx0aGlzLnkqPWUueSx0aGlzfWFicygpe3JldHVybiB0aGlzLng9TWF0aC5hYnModGhpcy54KSx0aGlzLnk9TWF0aC5hYnModGhpcy55KSx0aGlzfW51ZGdlKGUsdCl7Y29uc3Qgcj1wLlRhbihlLHRoaXMpO3JldHVybiB0aGlzLmFkZChyLm11bCh0KSl9bmVnKCl7cmV0dXJuIHRoaXMueCo9LTEsdGhpcy55Kj0tMSx0aGlzfWNyb3NzKGUpe3JldHVybiB0aGlzLng9dGhpcy55KmUuei10aGlzLnoqZS55LHRoaXMueT10aGlzLnoqZS54LXRoaXMueCplLnosdGhpc31kcHIoZSl7cmV0dXJuIHAuRHByKHRoaXMsZSl9Y3ByKGUpe3JldHVybiBwLkNwcih0aGlzLGUpfWxlbjIoKXtyZXR1cm4gcC5MZW4yKHRoaXMpfWxlbigpe3JldHVybiBwLkxlbih0aGlzKX1wcnkoZSl7cmV0dXJuIHAuUHJ5KHRoaXMsZSl9cGVyKCl7Y29uc3R7eDplLHk6dH09dGhpcztyZXR1cm4gdGhpcy54PXQsdGhpcy55PS1lLHRoaXN9dW5pKCl7cmV0dXJuIHAuVW5pKHRoaXMpfXRhbihlKXtyZXR1cm4gcC5UYW4odGhpcyxlKX1kaXN0KGUpe3JldHVybiBwLkRpc3QodGhpcyxlKX1kaXN0YW5jZVRvTGluZVNlZ21lbnQoZSx0KXtyZXR1cm4gcC5EaXN0YW5jZVRvTGluZVNlZ21lbnQoZSx0LHRoaXMpfXNsb3BlKGUpe3JldHVybiBwLlNsb3BlKHRoaXMsZSl9c25hcFRvR3JpZChlKXtyZXR1cm4gdGhpcy54PU1hdGgucm91bmQodGhpcy54L2UpKmUsdGhpcy55PU1hdGgucm91bmQodGhpcy55L2UpKmUsdGhpc31hbmdsZShlKXtyZXR1cm4gcC5BbmdsZSh0aGlzLGUpfXRvQW5nbGUoKXtyZXR1cm4gcC5Ub0FuZ2xlKHRoaXMpfWxycChlLHQpe3JldHVybiB0aGlzLng9dGhpcy54KyhlLngtdGhpcy54KSp0LHRoaXMueT10aGlzLnkrKGUueS10aGlzLnkpKnQsdGhpc31lcXVhbHMoZSx0KXtyZXR1cm4gcC5FcXVhbHModGhpcyxlLHQpfWVxdWFsc1hZKGUsdCl7cmV0dXJuIHAuRXF1YWxzWFkodGhpcyxlLHQpfW5vcm0oKXtjb25zdCBlPXRoaXMubGVuKCk7cmV0dXJuIHRoaXMueD1lPT09MD8wOnRoaXMueC9lLHRoaXMueT1lPT09MD8wOnRoaXMueS9lLHRoaXN9dG9GaXhlZCgpe3JldHVybiBwLlRvRml4ZWQodGhpcyl9dG9TdHJpbmcoKXtyZXR1cm4gcC5Ub1N0cmluZyhwLlRvRml4ZWQodGhpcykpfXRvSnNvbigpe3JldHVybiBwLlRvSnNvbih0aGlzKX10b0FycmF5KCl7cmV0dXJuIHAuVG9BcnJheSh0aGlzKX1zdGF0aWMgQWRkKGUsdCl7cmV0dXJuIG5ldyBwKGUueCt0LngsZS55K3QueSl9c3RhdGljIEFkZFhZKGUsdCxyKXtyZXR1cm4gbmV3IHAoZS54K3QsZS55K3IpfXN0YXRpYyBTdWIoZSx0KXtyZXR1cm4gbmV3IHAoZS54LXQueCxlLnktdC55KX1zdGF0aWMgU3ViWFkoZSx0LHIpe3JldHVybiBuZXcgcChlLngtdCxlLnktcil9c3RhdGljIEFkZFNjYWxhcihlLHQpe3JldHVybiBuZXcgcChlLngrdCxlLnkrdCl9c3RhdGljIFN1YlNjYWxhcihlLHQpe3JldHVybiBuZXcgcChlLngtdCxlLnktdCl9c3RhdGljIERpdihlLHQpe3JldHVybiBuZXcgcChlLngvdCxlLnkvdCl9c3RhdGljIE11bChlLHQpe3JldHVybiBuZXcgcChlLngqdCxlLnkqdCl9c3RhdGljIERpdlYoZSx0KXtyZXR1cm4gbmV3IHAoZS54L3QueCxlLnkvdC55KX1zdGF0aWMgTXVsVihlLHQpe3JldHVybiBuZXcgcChlLngqdC54LGUueSp0LnkpfXN0YXRpYyBOZWcoZSl7cmV0dXJuIG5ldyBwKC1lLngsLWUueSl9c3RhdGljIFBlcihlKXtyZXR1cm4gbmV3IHAoZS55LC1lLngpfXN0YXRpYyBEaXN0MihlLHQpe3JldHVybiBwLlN1YihlLHQpLmxlbjIoKX1zdGF0aWMgQWJzKGUpe3JldHVybiBuZXcgcChNYXRoLmFicyhlLngpLE1hdGguYWJzKGUueSkpfXN0YXRpYyBEaXN0KGUsdCl7cmV0dXJuIE1hdGguaHlwb3QoZS55LXQueSxlLngtdC54KX1zdGF0aWMgRHByKGUsdCl7cmV0dXJuIGUueCp0LngrZS55KnQueX1zdGF0aWMgQ3Jvc3MoZSx0KXtyZXR1cm4gbmV3IHAoZS55KnQuei1lLnoqdC55LGUueip0LngtZS54KnQueil9c3RhdGljIENwcihlLHQpe3JldHVybiBlLngqdC55LXQueCplLnl9c3RhdGljIExlbjIoZSl7cmV0dXJuIGUueCplLngrZS55KmUueX1zdGF0aWMgTGVuKGUpe3JldHVybiBNYXRoLmh5cG90KGUueCxlLnkpfXN0YXRpYyBQcnkoZSx0KXtyZXR1cm4gcC5EcHIoZSx0KS9wLkxlbih0KX1zdGF0aWMgVW5pKGUpe3JldHVybiBwLkRpdihlLHAuTGVuKGUpKX1zdGF0aWMgVGFuKGUsdCl7cmV0dXJuIHAuVW5pKHAuU3ViKGUsdCkpfXN0YXRpYyBNaW4oZSx0KXtyZXR1cm4gbmV3IHAoTWF0aC5taW4oZS54LHQueCksTWF0aC5taW4oZS55LHQueSkpfXN0YXRpYyBNYXgoZSx0KXtyZXR1cm4gbmV3IHAoTWF0aC5tYXgoZS54LHQueCksTWF0aC5tYXgoZS55LHQueSkpfXN0YXRpYyBGcm9tKGUpe3JldHVybiBuZXcgcCgpLmFkZChlKX1zdGF0aWMgRnJvbUFycmF5KGUpe3JldHVybiBuZXcgcChlWzBdLGVbMV0pfXN0YXRpYyBSb3QoZSx0PTApe2NvbnN0IHI9TWF0aC5zaW4odCksaT1NYXRoLmNvcyh0KTtyZXR1cm4gbmV3IHAoZS54KmktZS55KnIsZS54KnIrZS55KmkpfXN0YXRpYyBSb3RXaXRoKGUsdCxyKXtjb25zdCBpPWUueC10Lngscz1lLnktdC55LG49TWF0aC5zaW4ociksYT1NYXRoLmNvcyhyKTtyZXR1cm4gbmV3IHAodC54KyhpKmEtcypuKSx0LnkrKGkqbitzKmEpKX1zdGF0aWMgTmVhcmVzdFBvaW50T25MaW5lVGhyb3VnaFBvaW50KGUsdCxyKXtyZXR1cm4gcC5NdWwodCxwLlN1YihyLGUpLnByeSh0KSkuYWRkKGUpfXN0YXRpYyBOZWFyZXN0UG9pbnRPbkxpbmVTZWdtZW50KGUsdCxyLGk9ITApe2NvbnN0IHM9cC5UYW4odCxlKSxuPXAuQWRkKGUscC5NdWwocyxwLlN1YihyLGUpLnByeShzKSkpO2lmKGkpe2lmKG4ueDxNYXRoLm1pbihlLngsdC54KSlyZXR1cm4gcC5DYXN0KGUueDx0Lng/ZTp0KTtpZihuLng+TWF0aC5tYXgoZS54LHQueCkpcmV0dXJuIHAuQ2FzdChlLng+dC54P2U6dCk7aWYobi55PE1hdGgubWluKGUueSx0LnkpKXJldHVybiBwLkNhc3QoZS55PHQueT9lOnQpO2lmKG4ueT5NYXRoLm1heChlLnksdC55KSlyZXR1cm4gcC5DYXN0KGUueT50Lnk/ZTp0KX1yZXR1cm4gbn1zdGF0aWMgRGlzdGFuY2VUb0xpbmVUaHJvdWdoUG9pbnQoZSx0LHIpe3JldHVybiBwLkRpc3QocixwLk5lYXJlc3RQb2ludE9uTGluZVRocm91Z2hQb2ludChlLHQscikpfXN0YXRpYyBEaXN0YW5jZVRvTGluZVNlZ21lbnQoZSx0LHIsaT0hMCl7cmV0dXJuIHAuRGlzdChyLHAuTmVhcmVzdFBvaW50T25MaW5lU2VnbWVudChlLHQscixpKSl9c3RhdGljIFNuYXAoZSx0PTEpe3JldHVybiBuZXcgcChNYXRoLnJvdW5kKGUueC90KSp0LE1hdGgucm91bmQoZS55L3QpKnQpfXN0YXRpYyBDYXN0KGUpe3JldHVybiBlIGluc3RhbmNlb2YgcD9lOnAuRnJvbShlKX1zdGF0aWMgU2xvcGUoZSx0KXtyZXR1cm4gZS54PT09dC55P05hTjooZS55LXQueSkvKGUueC10LngpfXN0YXRpYyBBbmdsZShlLHQpe3JldHVybiBNYXRoLmF0YW4yKHQueS1lLnksdC54LWUueCl9c3RhdGljIExycChlLHQscil7cmV0dXJuIHAuU3ViKHQsZSkubXVsKHIpLmFkZChlKX1zdGF0aWMgTWVkKGUsdCl7cmV0dXJuIG5ldyBwKChlLngrdC54KS8yLChlLnkrdC55KS8yKX1zdGF0aWMgRXF1YWxzKGUsdCxyPTFlLTQpe3JldHVybiBNYXRoLmFicyhlLngtdC54KTxyJiZNYXRoLmFicyhlLnktdC55KTxyfXN0YXRpYyBFcXVhbHNYWShlLHQscil7cmV0dXJuIGUueD09PXQmJmUueT09PXJ9c3RhdGljIEVxdWFsc1hZWihlLHQscj0xZS00KXtyZXR1cm4gcC5FcXVhbHMoZSx0LHIpJiZNYXRoLmFicygoZS56fHwwKS0odC56fHwwKSk8cn1zdGF0aWMgQ2xvY2t3aXNlKGUsdCxyKXtyZXR1cm4oci54LWUueCkqKHQueS1lLnkpLSh0LngtZS54KSooci55LWUueSk8MH1zdGF0aWMgUmVzY2FsZShlLHQpe2NvbnN0IHI9cC5MZW4oZSk7cmV0dXJuIG5ldyBwKHQqZS54L3IsdCplLnkvcil9c3RhdGljIFNjYWxlV2l0aE9yaWdpbihlLHQscil7cmV0dXJuIHAuU3ViKGUscikubXVsKHQpLmFkZChyKX1zdGF0aWMgU2NhbGVXT3JpZ2luKGUsdCxyKXtyZXR1cm4gcC5TdWIoZSxyKS5tdWxWKHQpLmFkZChyKX1zdGF0aWMgVG9GaXhlZChlLHQ9Mil7cmV0dXJuIG5ldyBwKCtlLngudG9GaXhlZCh0KSwrZS55LnRvRml4ZWQodCksK2Uuei50b0ZpeGVkKHQpKX1zdGF0aWMgTnVkZ2UoZSx0LHIpe3JldHVybiBwLkFkZChlLHAuVGFuKHQsZSkubXVsKHIpKX1zdGF0aWMgVG9TdHJpbmcoZSl7cmV0dXJuYCR7ZS54fSwgJHtlLnl9YH1zdGF0aWMgVG9BbmdsZShlKXtsZXQgdD1NYXRoLmF0YW4yKGUueSxlLngpO3JldHVybiB0PDAmJih0Kz1NYXRoLlBJKjIpLHR9c3RhdGljIEZyb21BbmdsZShlLHQ9MSl7cmV0dXJuIG5ldyBwKE1hdGguY29zKGUpKnQsTWF0aC5zaW4oZSkqdCl9c3RhdGljIFRvQXJyYXkoZSl7cmV0dXJuW2UueCxlLnksZS56XX1zdGF0aWMgVG9Kc29uKGUpe2NvbnN0e3g6dCx5OnIsejppfT1lO3JldHVybnt4OnQseTpyLHo6aX19c3RhdGljIEF2ZXJhZ2UoZSl7Y29uc3QgdD1lLmxlbmd0aCxyPW5ldyBwKDAsMCk7Zm9yKGxldCBpPTA7aTx0O2krKylyLmFkZChlW2ldKTtyZXR1cm4gci5kaXYodCl9c3RhdGljIENsYW1wKGUsdCxyKXtyZXR1cm4gcj09PXZvaWQgMD9uZXcgcChNYXRoLm1pbihNYXRoLm1heChlLngsdCkpLE1hdGgubWluKE1hdGgubWF4KGUueSx0KSkpOm5ldyBwKE1hdGgubWluKE1hdGgubWF4KGUueCx0KSxyKSxNYXRoLm1pbihNYXRoLm1heChlLnksdCkscikpfXN0YXRpYyBQb2ludHNCZXR3ZWVuKGUsdCxyPTYpe2NvbnN0IGk9W107Zm9yKGxldCBzPTA7czxyO3MrKyl7Y29uc3Qgbj1CaC5lYXNlSW5RdWFkKHMvKHItMSkpLGE9cC5McnAoZSx0LG4pO2Euej1NYXRoLm1pbigxLC41K01hdGguYWJzKC41LV9oKG4pKSouNjUpLGkucHVzaChhKX1yZXR1cm4gaX1zdGF0aWMgU25hcFRvR3JpZChlLHQ9OCl7cmV0dXJuIG5ldyBwKE1hdGgucm91bmQoZS54L3QpKnQsTWF0aC5yb3VuZChlLnkvdCkqdCl9fWNvbnN0IF9oPW89Pm88LjU/MipvKm86LTErKDQtMipvKSpvO2NsYXNzIFIgZXh0ZW5kcyBwe2NvbnN0cnVjdG9yKGU9MCx0PTAscj0wLGk9e3g6MCx5OjB9LHM9MCxuPTApe3N1cGVyKGUsdCxyKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOmV9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOml9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnN9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm59KX1nZXQgdGltZXN0YW1wKCl7cmV0dXJuIHRoaXMudH1nZXQgcHJlc3N1cmUoKXtyZXR1cm4gdGhpcy56fWdldCBhbmdsZU51bSgpe3JldHVybiB0aGlzLmF9Z2V0IFhZKCl7cmV0dXJuW3RoaXMueCx0aGlzLnldfXNldEEoZSl7dGhpcy5hPWV9c2V0VChlKXt0aGlzLnQ9ZX1zZXR2KGUpe3JldHVybiB0aGlzLnY9e3g6ZS54LHk6ZS55fSx0aGlzfXNldChlPXRoaXMueCx0PXRoaXMueSxyPXRoaXMueixpPXRoaXMudixzPXRoaXMudCxuPXRoaXMuYSl7cmV0dXJuIHRoaXMueD1lLHRoaXMueT10LHRoaXMuej1yLHRoaXMudj1pLHRoaXMudD1zLHRoaXMuYT1uLHRoaXN9Y2xvbmUoKXtjb25zdHt4OmUseTp0LHo6cix2OmksdDpzLGE6bn09dGhpcyxhPXt4OmkueCx5OmkueX07cmV0dXJuIG5ldyBSKGUsdCxyLGEscyxuKX1kaXN0YW5jZShlKXtyZXR1cm4gUi5HZXREaXN0YW5jZSh0aGlzLGUpfWlzTmVhcihlLHQpe3JldHVybiBSLklzTmVhcih0aGlzLGUsdCl9Z2V0QW5nbGVCeVBvaW50cyhlLHQpe3JldHVybiBSLkdldEFuZ2xlQnlQb2ludHMoZSx0aGlzLHQpfXN0YXRpYyBTdWIoZSx0KXtyZXR1cm4gbmV3IFIoZS54LXQueCxlLnktdC55KX1zdGF0aWMgQWRkKGUsdCl7cmV0dXJuIG5ldyBSKGUueCt0LngsZS55K3QueSl9c3RhdGljIEdldERpc3RhbmNlKGUsdCl7cmV0dXJuIFIuTGVuKGUuY2xvbmUoKS5zdWIodCkpfXN0YXRpYyBHZXRBbmdsZUJ5UG9pbnRzKGUsdCxyKXtjb25zdCBpPXQueC1lLngscz1yLngtdC54LG49dC55LWUueSxhPXIueS10Lnk7bGV0IGw9MDtjb25zdCBjPU1hdGguc3FydChpKmkrbipuKSx1PU1hdGguc3FydChzKnMrYSphKTtpZihjJiZ1KXtjb25zdCBoPWkqcytuKmE7bD1NYXRoLmFjb3MoaC8oYyp1KSksbD1sL01hdGguUEkqMTgwO2xldCBkPWkqYS1uKnM7ZD1kPjA/MTotMSxsPTE4MCtkKmx9cmV0dXJuIGx9c3RhdGljIElzTmVhcihlLHQscil7cmV0dXJuIFIuTGVuKGUuY2xvbmUoKS5zdWIodCkpPHJ9c3RhdGljIFJvdFdpdGgoZSx0LHIsaT0yKXtjb25zdCBzPWUueC10Lngsbj1lLnktdC55LGE9TWF0aC5zaW4ociksbD1NYXRoLmNvcyhyKSxjPU1hdGgucG93KDEwLGkpLHU9TWF0aC5mbG9vcigodC54KyhzKmwtbiphKSkqYykvYyxoPU1hdGguZmxvb3IoKHQueSsocyphK24qbCkpKmMpL2M7cmV0dXJuIG5ldyBSKHUsaCl9c3RhdGljIEdldERvdFN0cm9rZShlLHQscj0xNil7Y29uc3QgaT1uZXcgcCgxLDEpLHM9TWF0aC5QSSsuMDAxLG49Ui5BZGQoZSxSLlN1YihlLGkpLnVuaSgpLnBlcigpLm11bCgtdCkpLGE9W107Zm9yKGxldCBsPTEvcixjPWw7Yzw9MTtjKz1sKWEucHVzaChSLlJvdFdpdGgobixlLHMqMipjKSk7cmV0dXJuIGF9c3RhdGljIEdldFNlbWljaXJjbGVTdHJva2UoZSx0LHI9LTEsaT04KXtjb25zdCBzPXIqKE1hdGguUEkrLjAwMSksbj1bXTtmb3IobGV0IGE9MS9pLGw9YTtsPD0xO2wrPWEpbi5wdXNoKFIuUm90V2l0aCh0LGUscypsKSk7cmV0dXJuIG59fWZ1bmN0aW9uIEEobyxlKXtpZihvJiZlKXtjb25zdCB0PU1hdGgubWluKG8ueCxlLngpLHI9TWF0aC5taW4oby55LGUueSksaT1NYXRoLm1heChvLngrby53LGUueCtlLncpLHM9TWF0aC5tYXgoby55K28uaCxlLnkrZS5oKSxuPWktdCxhPXMtcjtyZXR1cm57eDp0LHk6cix3Om4saDphfX1yZXR1cm4gZXx8b31mdW5jdGlvbiBHKG8sZT0wKXtjb25zdCB0PXt4OjAseTowLHc6MCxoOjB9O2xldCByPTEvMCxpPTEvMCxzPS0xLzAsbj0tMS8wO3JldHVybiBvLmZvckVhY2goYT0+e2NvbnN0W2wsY109YS5YWTtyPU1hdGgubWluKHIsbC1lKSxpPU1hdGgubWluKGksYy1lKSxzPU1hdGgubWF4KHMsbCtlKSxuPU1hdGgubWF4KG4sYytlKX0pLHQueD1yLHQueT1pLHQudz1zLXIsdC5oPW4taSx0fWZ1bmN0aW9uIFBlKG8sZSl7cmV0dXJuIShvLngrby53PGUueHx8by54PmUueCtlLnd8fG8ueStvLmg8ZS55fHxvLnk+ZS55K2UuaCl9ZnVuY3Rpb24gRWgobyxlKXtyZXR1cm4gby5sZW5ndGg9PT1lLmxlbmd0aCYmby5zb3J0KCkudG9TdHJpbmcoKT09PWUuc29ydCgpLnRvU3RyaW5nKCl9ZnVuY3Rpb24gSyhvLGU9MTApe3JldHVybnt4Ok1hdGguZmxvb3Ioby54LWUpLHk6TWF0aC5mbG9vcihvLnktZSksdzpNYXRoLmZsb29yKG8udytlKjIpLGg6TWF0aC5mbG9vcihvLmgrZSoyKX19ZnVuY3Rpb24gQ2UobyxlKXtyZXR1cm57eDpvLngrZVswXSx5Om8ueStlWzFdLHc6by53LGg6by5ofX1mdW5jdGlvbiBUcihvLGUpe2NvbnN0IHQ9bmV3IHAoby54LG8ueSkscj1uZXcgcChvLngrby53LG8ueSksaT1uZXcgcChvLngrby53LG8ueStvLmgpLHM9bmV3IHAoby54LG8ueStvLmgpLG49bmV3IHAoby54K28udy8yLG8ueStvLmgvMiksYT1NYXRoLlBJKmUvMTgwLGw9cC5Sb3RXaXRoKHQsbixhKSxjPXAuUm90V2l0aChyLG4sYSksdT1wLlJvdFdpdGgoaSxuLGEpLGg9cC5Sb3RXaXRoKHMsbixhKTtyZXR1cm4gRyhbbCxjLHUsaF0pfWZ1bmN0aW9uIElyKG8sZSl7Y29uc3QgdD1uZXcgcChvLngsby55KSxyPW5ldyBwKG8ueCtvLncsby55KSxpPW5ldyBwKG8ueCtvLncsby55K28uaCkscz1uZXcgcChvLngsby55K28uaCksbj1uZXcgcChvLngrby53LzIsby55K28uaC8yKSxhPW5ldyBwKGVbMF0sZVsxXSksbD1wLlNjYWxlV09yaWdpbih0LGEsbiksYz1wLlNjYWxlV09yaWdpbihyLGEsbiksdT1wLlNjYWxlV09yaWdpbihpLGEsbiksaD1wLlNjYWxlV09yaWdpbihzLGEsbik7cmV0dXJuIEcoW2wsYyx1LGhdKX1mdW5jdGlvbiB6aChvLGUsdCl7Y29uc3Qgcj1uZXcgcChlWzBdLGVbMV0pO2ZvcihsZXQgaT0wO2k8by5sZW5ndGg7aSs9Myl7Y29uc3Qgcz1uZXcgcChvW2ldLG9baSsxXSksbj1NYXRoLlBJKnQvMTgwLGE9cC5Sb3RXaXRoKHMscixuKTtvW2ldPWEueCxvW2krMV09YS55fX1mdW5jdGlvbiBVaChvLGUsdCl7Y29uc3Qgcj1uZXcgcChlWzBdLGVbMV0pO2ZvcihsZXQgaT0wO2k8by5sZW5ndGg7aSs9Myl7Y29uc3Qgcz1uZXcgcChvW2ldLG9baSsxXSksbj1uZXcgcCh0WzBdLHRbMV0pO2lmKGk8by5sZW5ndGgtMyl7Y29uc3QgbD1uZXcgcChvW2krM10sb1tpKzRdKSxjPXAuVGFuKGwscykucGVyKCkubXVsKG9baSsyXSkubXVsVihuKS5sZW4oKTtvW2krMl09Y31lbHNlIGlmKGk9PT1vLmxlbmd0aC0zKXtjb25zdCBsPW5ldyBwKG9baS0zXSxvW2ktMl0pLGM9cC5UYW4ocyxsKS5wZXIoKS5tdWwob1tpKzJdKS5tdWxWKG4pLmxlbigpO29baSsyXT1jfWNvbnN0IGE9cC5TY2FsZVdPcmlnaW4ocyxuLHIpO29baV09YS54LG9baSsxXT1hLnl9fWZ1bmN0aW9uIEdoKG8sZSl7cmV0dXJuIG9bMF0+PWUueCYmb1swXTw9ZS54K2UudyYmb1sxXT49ZS55JiZvWzFdPD1lLnkrZS5ofWZ1bmN0aW9uIHhyKG8sZSl7Y29uc3QgdD1vPD1lPzE6by9lLHI9ZTw9bz8xOmUvbztyZXR1cm5bdCxyXX1jb25zdCBIZT1vPT57aWYoby50YWdOYW1lPT09IkdST1VQIil7Y29uc3QgZT1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG8pLmZpbmQodD0+dC50b1N0cmluZygpPT09IlN5bWJvbChzZWFsZWQpIik7aWYoZSYmb1tlXSlyZXR1cm4hMH1yZXR1cm4hMX0sT3I9bz0+byE9PVMuVGV4dDtmdW5jdGlvbiBUZShvKXtyZXR1cm5gJHtZZShvLngpfSwke1llKG8ueSl9IGB9ZnVuY3Rpb24gSWUobyxlKXtyZXR1cm5gJHtZZSgoby54K2UueCkvMil9LCR7WWUoKG8ueStlLnkpLzIpfSBgfWZ1bmN0aW9uIFllKG8pe3JldHVybitvLnRvRml4ZWQoNCl9dmFyIFhoPWZlLEhoPWNlLFloPSJbb2JqZWN0IE51bWJlcl0iO2Z1bmN0aW9uIHFoKG8pe3JldHVybiB0eXBlb2Ygbz09Im51bWJlciJ8fEhoKG8pJiZYaChvKT09WWh9dmFyIFpoPXFoLGhlPW1lKFpoKTtjbGFzcyB4e2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVW5pdFRpbWUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZToxZTN9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidk5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJmdWxsTGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSk7Y29uc3R7dk5vZGVzOnQsZnVsbExheWVyOnIsZHJhd0xheWVyOml9PWU7dGhpcy52Tm9kZXM9dCx0aGlzLmZ1bGxMYXllcj1yLHRoaXMuZHJhd0xheWVyPWl9c2V0V29ya0lkKGUpe3RoaXMud29ya0lkPWV9Z2V0V29ya0lkKCl7cmV0dXJuIHRoaXMud29ya0lkfWdldFdvcmtPcHRpb25zKCl7cmV0dXJuIHRoaXMud29ya09wdGlvbnN9c2V0V29ya09wdGlvbnMoZSl7dmFyIGk7dGhpcy53b3JrT3B0aW9ucz1lLHRoaXMuc3luY1VuaXRUaW1lPWUuc3luY1VuaXRUaW1lfHx0aGlzLnN5bmNVbml0VGltZTtjb25zdCB0PShpPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpLHI9dCYmdGhpcy52Tm9kZXMuZ2V0KHQpfHx2b2lkIDA7dCYmciYmKHIub3B0PWUsdGhpcy52Tm9kZXMuc2V0SW5mbyh0LHIpKX11cGRhdGFPcHRTZXJ2aWNlKGUpe3ZhciBpO2xldCB0O2NvbnN0IHI9KGk9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDppLnRvU3RyaW5nKCk7aWYociYmZSl7Y29uc3Qgcz10aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShyKXx8dGhpcy5kcmF3TGF5ZXImJnRoaXMuZHJhd0xheWVyLmdldEVsZW1lbnRzQnlOYW1lKHIpfHxbXTtpZihzLmxlbmd0aCE9PTEpcmV0dXJuO2NvbnN0IG49c1swXSx7cG9zOmEsekluZGV4Omwsc2NhbGU6YyxhbmdsZTp1LHRyYW5zbGF0ZTpofT1lLGQ9e307aGUobCkmJihkLnpJbmRleD1sKSxhJiYoZC5wb3M9W2FbMF0sYVsxXV0pLGMmJihkLnNjYWxlPWMpLHUmJihkLnJvdGF0ZT11KSxoJiYoZC50cmFuc2xhdGU9aCksbi5hdHRyKGQpO2NvbnN0IGY9bj09bnVsbD92b2lkIDA6bi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm4gZiYmKHQ9QSh0LHt4Ok1hdGguZmxvb3IoZi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihmLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGYud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoZi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX0pKSx0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6dCxjZW50ZXJQb3M6YX0pLHR9fXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aSx3aWxsU2VyaWFsaXplRGF0YTpzLHRhcmdldE5vZGU6bn09ZSx7ekluZGV4OmEsdHJhbnNsYXRlOmwsYW5nbGU6Yyxib3g6dSxib3hTY2FsZTpoLGJveFRyYW5zbGF0ZTpkLHBvaW50TWFwOmZ9PXI7bGV0IHc7Y29uc3QgeT1uJiZyZShuKXx8aS5nZXQodC5uYW1lKTtpZigheSlyZXR1cm47aGUoYSkmJih0LnNldEF0dHJpYnV0ZSgiekluZGV4IixhKSx5Lm9wdC56SW5kZXg9YSk7Y29uc3QgZz10LnBhcmVudDtpZihnKXtpZih1JiZkJiZoKXtjb25zdHtyZWN0OlB9PXksaz1bXTtmb3IobGV0IEQ9MDtEPHkub3AubGVuZ3RoO0QrPTMpay5wdXNoKG5ldyBSKHkub3BbRF0seS5vcFtEKzFdLHkub3BbRCsyXSkpO2NvbnN0IE89RyhrKSxJPVtPLncqZy53b3JsZFNjYWxpbmdbMF0sTy5oKmcud29ybGRTY2FsaW5nWzBdXSxiPVtQLnctSVswXSxQLmgtSVsxXV0sdj1bKFAudypoWzBdLWJbMF0pL0lbMF0sKFAuaCpoWzFdLWJbMV0pL0lbMV1dLEw9W2RbMF0vZy53b3JsZFNjYWxpbmdbMF0sZFsxXS9nLndvcmxkU2NhbGluZ1sxXV0sVD15Lm9wLm1hcCgoRCxIKT0+e2NvbnN0IFY9SCUzO3JldHVybiBWPT09MD9EK0xbMF06Vj09PTE/RCtMWzFdOkR9KSxNPVt5LmNlbnRlclBvc1swXStMWzBdLHkuY2VudGVyUG9zWzFdK0xbMV1dO1VoKFQsTSx2KTtjb25zdCAkPVtdO2ZvcihsZXQgRD0wO0Q8VC5sZW5ndGg7RCs9MykkLnB1c2gobmV3IFIoVFtEXSxUW0QrMV0sVFtEKzJdKSk7eS5vcD1ULHkuY2VudGVyUG9zPU19ZWxzZSBpZihsKXtjb25zdCBQPVtsWzBdL2cud29ybGRTY2FsaW5nWzBdLGxbMV0vZy53b3JsZFNjYWxpbmdbMV1dO3Quc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFApLHkub3B0LnRyYW5zbGF0ZT1QLG4mJih3PUNlKHkucmVjdCxsKSx5LnJlY3Q9dyl9ZWxzZSBoZShjKSYmKHQuc2V0QXR0cmlidXRlKCJyb3RhdGUiLGMpLHkub3B0LnJvdGF0ZT1jLG4mJih3PVRyKHkucmVjdCxjKSx5LnJlY3Q9dykpO2lmKGYpe2NvbnN0IFA9Zi5nZXQodC5uYW1lKTtpZihQKWZvcihsZXQgaz0wLE89MDtrPHkub3AubGVuZ3RoO2srPTMsTysrKXkub3Bba109UFtPXVswXSx5Lm9wW2srMV09UFtPXVsxXX1pZihzKXtpZihsKXtjb25zdCBQPVtsWzBdL2cud29ybGRTY2FsaW5nWzBdLGxbMV0vZy53b3JsZFNjYWxpbmdbMV1dLGs9eS5vcC5tYXAoKE8sSSk9Pntjb25zdCBiPUklMztyZXR1cm4gYj09PTA/TytQWzBdOmI9PT0xP08rUFsxXTpPfSk7eS5vcD1rLHkuY2VudGVyUG9zPVt5LmNlbnRlclBvc1swXStQWzBdLHkuY2VudGVyUG9zWzFdK1BbMV1dLHkhPW51bGwmJnkub3B0JiYoeS5vcHQudHJhbnNsYXRlPXZvaWQgMCl9ZWxzZSBpZihoZShjKSl7Y29uc3QgUD15Lm9wO3poKFAseS5jZW50ZXJQb3MsYykseS5vcD1QLHkhPW51bGwmJnkub3B0JiYoeS5vcHQucm90YXRlPXZvaWQgMCl9fXkmJmkuc2V0SW5mbyh0Lm5hbWUseSl9fXN0YXRpYyBnZXRDZW50ZXJQb3MoZSx0KXtjb25zdHt3b3JsZFBvc2l0aW9uOnIsd29ybGRTY2FsaW5nOml9PXQ7cmV0dXJuWyhlLngrZS53LzItclswXSkvaVswXSwoZS55K2UuaC8yLXJbMV0pL2lbMV1dfXN0YXRpYyBnZXRSZWN0RnJvbUxheWVyKGUsdCl7Y29uc3Qgcj1lLmdldEVsZW1lbnRzQnlOYW1lKHQpWzBdO2lmKHIpe2NvbnN0IGk9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGkueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoaS55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihpLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGkuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHgsIlNhZmVCb3JkZXJQYWRkaW5nIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MTB9KTtmdW5jdGlvbiB4ZShvLGU9ITApe2NvbnN0IHQ9by5sZW5ndGg7aWYodDwyKXJldHVybiIiO2xldCByPW9bMF0saT1vWzFdO2lmKHQ9PT0yKXJldHVybmBNJHtUZShyKX1MJHtUZShpKX1gO2xldCBzPSIiO2ZvcihsZXQgbj0yLGE9dC0xO248YTtuKyspcj1vW25dLGk9b1tuKzFdLHMrPUllKHIsaSk7cmV0dXJuIGU/YE0ke0llKG9bMF0sb1sxXSl9USR7VGUob1sxXSl9JHtJZShvWzFdLG9bMl0pfVQke3N9JHtJZShvW3QtMV0sb1swXSl9JHtJZShvWzBdLG9bMV0pfVpgOmBNJHtUZShvWzBdKX1RJHtUZShvWzFdKX0ke0llKG9bMV0sb1syXSl9JHtvLmxlbmd0aD4zPyJUIjoiIn0ke3N9TCR7VGUob1t0LTFdKX1gfXZhciB5dD17ZXhwb3J0czp7fX07eXQuZXhwb3J0cyxmdW5jdGlvbihvKXt2YXIgZT1mdW5jdGlvbigpe3ZhciB0PVN0cmluZy5mcm9tQ2hhckNvZGUscj0iQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0iLGk9IkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky0kIixzPXt9O2Z1bmN0aW9uIG4obCxjKXtpZighc1tsXSl7c1tsXT17fTtmb3IodmFyIHU9MDt1PGwubGVuZ3RoO3UrKylzW2xdW2wuY2hhckF0KHUpXT11fXJldHVybiBzW2xdW2NdfXZhciBhPXtjb21wcmVzc1RvQmFzZTY0OmZ1bmN0aW9uKGwpe2lmKGw9PW51bGwpcmV0dXJuIiI7dmFyIGM9YS5fY29tcHJlc3MobCw2LGZ1bmN0aW9uKHUpe3JldHVybiByLmNoYXJBdCh1KX0pO3N3aXRjaChjLmxlbmd0aCU0KXtkZWZhdWx0OmNhc2UgMDpyZXR1cm4gYztjYXNlIDE6cmV0dXJuIGMrIj09PSI7Y2FzZSAyOnJldHVybiBjKyI9PSI7Y2FzZSAzOnJldHVybiBjKyI9In19LGRlY29tcHJlc3NGcm9tQmFzZTY0OmZ1bmN0aW9uKGwpe3JldHVybiBsPT1udWxsPyIiOmw9PSIiP251bGw6YS5fZGVjb21wcmVzcyhsLmxlbmd0aCwzMixmdW5jdGlvbihjKXtyZXR1cm4gbihyLGwuY2hhckF0KGMpKX0pfSxjb21wcmVzc1RvVVRGMTY6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6YS5fY29tcHJlc3MobCwxNSxmdW5jdGlvbihjKXtyZXR1cm4gdChjKzMyKX0pKyIgIn0sZGVjb21wcmVzc0Zyb21VVEYxNjpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjpsPT0iIj9udWxsOmEuX2RlY29tcHJlc3MobC5sZW5ndGgsMTYzODQsZnVuY3Rpb24oYyl7cmV0dXJuIGwuY2hhckNvZGVBdChjKS0zMn0pfSxjb21wcmVzc1RvVWludDhBcnJheTpmdW5jdGlvbihsKXtmb3IodmFyIGM9YS5jb21wcmVzcyhsKSx1PW5ldyBVaW50OEFycmF5KGMubGVuZ3RoKjIpLGg9MCxkPWMubGVuZ3RoO2g8ZDtoKyspe3ZhciBmPWMuY2hhckNvZGVBdChoKTt1W2gqMl09Zj4+PjgsdVtoKjIrMV09ZiUyNTZ9cmV0dXJuIHV9LGRlY29tcHJlc3NGcm9tVWludDhBcnJheTpmdW5jdGlvbihsKXtpZihsPT1udWxsKXJldHVybiBhLmRlY29tcHJlc3MobCk7Zm9yKHZhciBjPW5ldyBBcnJheShsLmxlbmd0aC8yKSx1PTAsaD1jLmxlbmd0aDt1PGg7dSsrKWNbdV09bFt1KjJdKjI1NitsW3UqMisxXTt2YXIgZD1bXTtyZXR1cm4gYy5mb3JFYWNoKGZ1bmN0aW9uKGYpe2QucHVzaCh0KGYpKX0pLGEuZGVjb21wcmVzcyhkLmpvaW4oIiIpKX0sY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQ6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6YS5fY29tcHJlc3MobCw2LGZ1bmN0aW9uKGMpe3JldHVybiBpLmNoYXJBdChjKX0pfSxkZWNvbXByZXNzRnJvbUVuY29kZWRVUklDb21wb25lbnQ6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6bD09IiI/bnVsbDoobD1sLnJlcGxhY2UoLyAvZywiKyIpLGEuX2RlY29tcHJlc3MobC5sZW5ndGgsMzIsZnVuY3Rpb24oYyl7cmV0dXJuIG4oaSxsLmNoYXJBdChjKSl9KSl9LGNvbXByZXNzOmZ1bmN0aW9uKGwpe3JldHVybiBhLl9jb21wcmVzcyhsLDE2LGZ1bmN0aW9uKGMpe3JldHVybiB0KGMpfSl9LF9jb21wcmVzczpmdW5jdGlvbihsLGMsdSl7aWYobD09bnVsbClyZXR1cm4iIjt2YXIgaCxkLGY9e30sdz17fSx5PSIiLGc9IiIsUD0iIixrPTIsTz0zLEk9MixiPVtdLHY9MCxMPTAsVDtmb3IoVD0wO1Q8bC5sZW5ndGg7VCs9MSlpZih5PWwuY2hhckF0KFQpLE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChmLHkpfHwoZlt5XT1PKyssd1t5XT0hMCksZz1QK3ksT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGYsZykpUD1nO2Vsc2V7aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHcsUCkpe2lmKFAuY2hhckNvZGVBdCgwKTwyNTYpe2ZvcihoPTA7aDxJO2grKyl2PXY8PDEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrO2ZvcihkPVAuY2hhckNvZGVBdCgwKSxoPTA7aDw4O2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjF9ZWxzZXtmb3IoZD0xLGg9MDtoPEk7aCsrKXY9djw8MXxkLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPTA7Zm9yKGQ9UC5jaGFyQ29kZUF0KDApLGg9MDtoPDE2O2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjF9ay0tLGs9PTAmJihrPU1hdGgucG93KDIsSSksSSsrKSxkZWxldGUgd1tQXX1lbHNlIGZvcihkPWZbUF0saD0wO2g8STtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xO2stLSxrPT0wJiYoaz1NYXRoLnBvdygyLEkpLEkrKyksZltnXT1PKyssUD1TdHJpbmcoeSl9aWYoUCE9PSIiKXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodyxQKSl7aWYoUC5jaGFyQ29kZUF0KDApPDI1Nil7Zm9yKGg9MDtoPEk7aCsrKXY9djw8MSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKys7Zm9yKGQ9UC5jaGFyQ29kZUF0KDApLGg9MDtoPDg7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1lbHNle2ZvcihkPTEsaD0wO2g8STtoKyspdj12PDwxfGQsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9MDtmb3IoZD1QLmNoYXJDb2RlQXQoMCksaD0wO2g8MTY7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1rLS0saz09MCYmKGs9TWF0aC5wb3coMixJKSxJKyspLGRlbGV0ZSB3W1BdfWVsc2UgZm9yKGQ9ZltQXSxoPTA7aDxJO2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjE7ay0tLGs9PTAmJihrPU1hdGgucG93KDIsSSksSSsrKX1mb3IoZD0yLGg9MDtoPEk7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MTtmb3IoOzspaWYodj12PDwxLEw9PWMtMSl7Yi5wdXNoKHUodikpO2JyZWFrfWVsc2UgTCsrO3JldHVybiBiLmpvaW4oIiIpfSxkZWNvbXByZXNzOmZ1bmN0aW9uKGwpe3JldHVybiBsPT1udWxsPyIiOmw9PSIiP251bGw6YS5fZGVjb21wcmVzcyhsLmxlbmd0aCwzMjc2OCxmdW5jdGlvbihjKXtyZXR1cm4gbC5jaGFyQ29kZUF0KGMpfSl9LF9kZWNvbXByZXNzOmZ1bmN0aW9uKGwsYyx1KXt2YXIgaD1bXSxkPTQsZj00LHc9Myx5PSIiLGc9W10sUCxrLE8sSSxiLHYsTCxUPXt2YWw6dSgwKSxwb3NpdGlvbjpjLGluZGV4OjF9O2ZvcihQPTA7UDwzO1ArPTEpaFtQXT1QO2ZvcihPPTAsYj1NYXRoLnBvdygyLDIpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO3N3aXRjaChPKXtjYXNlIDA6Zm9yKE89MCxiPU1hdGgucG93KDIsOCksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7TD10KE8pO2JyZWFrO2Nhc2UgMTpmb3IoTz0wLGI9TWF0aC5wb3coMiwxNiksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7TD10KE8pO2JyZWFrO2Nhc2UgMjpyZXR1cm4iIn1mb3IoaFszXT1MLGs9TCxnLnB1c2goTCk7Oyl7aWYoVC5pbmRleD5sKXJldHVybiIiO2ZvcihPPTAsYj1NYXRoLnBvdygyLHcpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO3N3aXRjaChMPU8pe2Nhc2UgMDpmb3IoTz0wLGI9TWF0aC5wb3coMiw4KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtoW2YrK109dChPKSxMPWYtMSxkLS07YnJlYWs7Y2FzZSAxOmZvcihPPTAsYj1NYXRoLnBvdygyLDE2KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtoW2YrK109dChPKSxMPWYtMSxkLS07YnJlYWs7Y2FzZSAyOnJldHVybiBnLmpvaW4oIiIpfWlmKGQ9PTAmJihkPU1hdGgucG93KDIsdyksdysrKSxoW0xdKXk9aFtMXTtlbHNlIGlmKEw9PT1mKXk9aytrLmNoYXJBdCgwKTtlbHNlIHJldHVybiBudWxsO2cucHVzaCh5KSxoW2YrK109ayt5LmNoYXJBdCgwKSxkLS0saz15LGQ9PTAmJihkPU1hdGgucG93KDIsdyksdysrKX19fTtyZXR1cm4gYX0oKTtvIT1udWxsP28uZXhwb3J0cz1lOnR5cGVvZiBhbmd1bGFyPCJ1IiYmYW5ndWxhciE9bnVsbCYmYW5ndWxhci5tb2R1bGUoIkxaU3RyaW5nIixbXSkuZmFjdG9yeSgiTFpTdHJpbmciLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KX0oeXQpO3ZhciBMcj15dC5leHBvcnRzO2Z1bmN0aW9uIHFlKG8pe3JldHVybiBKU09OLnBhcnNlKExyLmRlY29tcHJlc3MobykpfWZ1bmN0aW9uIGxlKG8pe3JldHVybiBMci5jb21wcmVzcyhKU09OLnN0cmluZ2lmeShvKSl9Y2xhc3MgQ3IgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlBlbmNpbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNJbmRleCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiTUFYX1JFUEVBUiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInVuaVRoaWNrbmVzcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjZW50ZXJQb3MiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbMCwwXX0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnVuaVRoaWNrbmVzcz10aGlzLk1BWF9SRVBFQVIvdGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MvMTAsdGhpcy5zeW5jVGltZXN0YW1wPTB9Y29tYmluZUNvbnN1bWUoKXt2YXIgbjtjb25zdCBlPShuPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpLHQ9dGhpcy50cmFuc2Zvcm1EYXRhQWxsKCEwKSxyPXtuYW1lOmV9O2xldCBpO2NvbnN0IHM9dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO3JldHVybiB0Lmxlbmd0aCYmKGk9dGhpcy5kcmF3KHthdHRyczpyLHRhc2tzOnQscmVwbGFjZUlkOmUsbGF5ZXI6cyxpc0NsZWFyQWxsOiEwfSkpLHtyZWN0OmksdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWx9fXNldFdvcmtPcHRpb25zKGUpe3N1cGVyLnNldFdvcmtPcHRpb25zKGUpLHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpfWNvbnN1bWUoZSl7dmFyIHk7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc0NsZWFyQWxsOmksaXNTdWJXb3JrZXI6c309ZTtpZigoKHk9dC5vcCk9PW51bGw/dm9pZCAwOnkubGVuZ3RoKT09PTApcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHt3b3JrSWQ6bn09dCx7dGFza3M6YSxlZmZlY3RzOmwsY29uc3VtZUluZGV4OmN9PXRoaXMudHJhbnNmb3JtRGF0YSh0LCExKTt0aGlzLnN5bmNJbmRleD1NYXRoLm1pbih0aGlzLnN5bmNJbmRleCxjLE1hdGgubWF4KDAsdGhpcy50bXBQb2ludHMubGVuZ3RoLTIpKTtjb25zdCB1PXtuYW1lOm49PW51bGw/dm9pZCAwOm4udG9TdHJpbmcoKX07bGV0IGgsZD0hMTtjb25zdCBmPXRoaXMuc3luY0luZGV4O2lmKHRoaXMuc3luY1RpbWVzdGFtcD09PTAmJih0aGlzLnN5bmNUaW1lc3RhbXA9RGF0ZS5ub3coKSksYS5sZW5ndGgmJihhWzBdLnRhc2tJZC10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWUmJihkPSEwLHRoaXMuc3luY1RpbWVzdGFtcD1hWzBdLnRhc2tJZCx0aGlzLnN5bmNJbmRleD10aGlzLnRtcFBvaW50cy5sZW5ndGgpLHMpKXtjb25zdCBnPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO2g9dGhpcy5kcmF3KHthdHRyczp1LHRhc2tzOmEsZWZmZWN0czpsLGxheWVyOmcsaXNDbGVhckFsbDppfSl9aWYocylyZXR1cm4gYz4xMCYmdGhpcy50bXBQb2ludHMuc3BsaWNlKDAsYy0xMCkse3JlY3Q6aCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbH07Y29uc3Qgdz1bXTtyZXR1cm4gdGhpcy50bXBQb2ludHMuc2xpY2UoZikuZm9yRWFjaChnPT57dy5wdXNoKGcueCxnLnksdGhpcy5jb21wdXRSYWRpdXMoZy56LHRoaXMud29ya09wdGlvbnMudGhpY2tuZXNzKSl9KSx7cmVjdDpoLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpkP246dm9pZCAwLG9wOmQ/dzp2b2lkIDAsaW5kZXg6ZD9mKjM6dm9pZCAwfX1jb25zdW1lQWxsKGUpe3ZhciBjLHU7aWYoZS5kYXRhKXtjb25zdHtvcDpoLHdvcmtTdGF0ZTpkfT1lLmRhdGE7aCE9bnVsbCYmaC5sZW5ndGgmJmQ9PT1GLkRvbmUmJnRoaXMud29ya09wdGlvbnMuc3Ryb2tlVHlwZT09PVEuU3Ryb2tlJiZ0aGlzLnVwZGF0ZVRlbXBQb2ludHNXaXRoUHJlc3N1cmVXaGVuRG9uZShoKX1jb25zdCB0PShjPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6Yy50b1N0cmluZygpO2lmKCF0KXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3Qgcj10aGlzLnRyYW5zZm9ybURhdGFBbGwoITApLGk9e25hbWU6dH07bGV0IHM7Y29uc3Qgbj10aGlzLmZ1bGxMYXllcjtyLmxlbmd0aCYmKHM9dGhpcy5kcmF3KHthdHRyczppLHRhc2tzOnIscmVwbGFjZUlkOnQsbGF5ZXI6bixpc0NsZWFyQWxsOiExfSkpO2NvbnN0IGE9W107dGhpcy50bXBQb2ludHMubWFwKGg9PnthLnB1c2goaC54LGgueSx0aGlzLmNvbXB1dFJhZGl1cyhoLnosdGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MpKX0pLHRoaXMuc3luY1RpbWVzdGFtcD0wLGRlbGV0ZSB0aGlzLndvcmtPcHRpb25zLnN5bmNVbml0VGltZTtjb25zdCBsPWxlKGEpO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHQse3JlY3Q6cyxvcDphLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLG4pfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6dCxvcHM6bCx1cGRhdGVOb2RlT3B0Ontwb3M6dGhpcy5jZW50ZXJQb3MsdXNlQW5pbWF0aW9uOiEwfSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx1bmRvVGlja2VySWQ6KHU9ZS5kYXRhKT09bnVsbD92b2lkIDA6dS51bmRvVGlja2VySWR9fWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTAsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jSW5kZXg9MH1jb25zdW1lU2VydmljZShlKXt2YXIgaDtjb25zdHtvcDp0LGlzRnVsbFdvcms6cixyZXBsYWNlSWQ6aSxpc0NsZWFyQWxsOnMsaXNUZW1wOm59PWU7dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBkPTA7ZDx0Lmxlbmd0aDtkKz0zKXtjb25zdCBmPW5ldyBSKHRbZF0sdFtkKzFdLHRbZCsyXSk7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPjApe2NvbnN0IHc9dGhpcy50bXBQb2ludHNbdGhpcy50bXBQb2ludHMubGVuZ3RoLTFdLHk9cC5TdWIoZix3KS51bmkoKTtmLnNldHYoeSl9dGhpcy50bXBQb2ludHMucHVzaChmKX1jb25zdCBhPXRoaXMudHJhbnNmb3JtRGF0YUFsbCghMSksbD0oaD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmgudG9TdHJpbmcoKSxjPXtuYW1lOmx9O2xldCB1O2lmKGwmJmEubGVuZ3RoKXtjb25zdCBkPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO3U9dGhpcy5kcmF3KHthdHRyczpjLHRhc2tzOmEscmVwbGFjZUlkOmksbGF5ZXI6ZCxpc0NsZWFyQWxsOnN9KSxyJiYhbiYmdGhpcy52Tm9kZXMuc2V0SW5mbyhsLHtyZWN0OnUsb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6dSYmeC5nZXRDZW50ZXJQb3ModSxkKX0pfXJldHVybiB1fXRyYW5zZm9ybURhdGFBbGwoZT0hMCl7cmV0dXJuIHRoaXMuZ2V0VGFza1BvaW50cyh0aGlzLnRtcFBvaW50cyxlJiZ0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc3x8dm9pZCAwKX1kcmF3KGUpe3ZhciBJO2NvbnN0e2F0dHJzOnQsdGFza3M6cixyZXBsYWNlSWQ6aSxlZmZlY3RzOnMsbGF5ZXI6bixpc0NsZWFyQWxsOmF9PWUse3N0cm9rZUNvbG9yOmwsc3Ryb2tlVHlwZTpjLHRoaWNrbmVzczp1LHpJbmRleDpoLHNjYWxlOmQscm90YXRlOmYsdHJhbnNsYXRlOnd9PXRoaXMud29ya09wdGlvbnM7YSYmbi5yZW1vdmVBbGxDaGlsZHJlbigpLGkmJih0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShpKyIiKS5tYXAoYj0+Yi5yZW1vdmUoKSksKEk9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxJLmdldEVsZW1lbnRzQnlOYW1lKGkrIiIpLm1hcChiPT5iLnJlbW92ZSgpKSkscyE9bnVsbCYmcy5zaXplJiYocy5mb3JFYWNoKGI9Pnt2YXIgdjsodj1uLmdldEVsZW1lbnRCeUlkKGIrIiIpKT09bnVsbHx8di5yZW1vdmUoKX0pLHMuY2xlYXIoKSk7bGV0IHk7Y29uc3QgZz1bXSxQPW4ud29ybGRQb3NpdGlvbixrPW4ud29ybGRTY2FsaW5nO2ZvcihsZXQgYj0wO2I8ci5sZW5ndGg7YisrKXtjb25zdHtwb3M6dixwb2ludHM6TCx0YXNrSWQ6VH09cltiXTt0LmlkPVQudG9TdHJpbmcoKTtjb25zdHtwczpNLHJlY3Q6JH09dGhpcy5jb21wdXREcmF3UG9pbnRzKEwpO2xldCBEO2NvbnN0IEg9TC5sZW5ndGg9PT0xO2M9PT1RLlN0cm9rZXx8SD9EPXhlKE0sITApOkQ9eGUoTSwhMSk7Y29uc3QgVj17cG9zOnYsZDpELGZpbGxDb2xvcjpjPT09US5TdHJva2V8fEg/bDp2b2lkIDAsbGluZURhc2g6Yz09PVEuRG90dGVkJiYhSD9bMSx1KjJdOmM9PT1RLkxvbmdEb3R0ZWQmJiFIP1t1LHUqMl06dm9pZCAwLHN0cm9rZUNvbG9yOmwsbGluZUNhcDpjPT09US5TdHJva2V8fEg/dm9pZCAwOiJyb3VuZCIsbGluZVdpZHRoOmM9PT1RLlN0cm9rZXx8SD8wOnV9O3k9QSh5LHt4Ok1hdGguZmxvb3IoKCQueCt2WzBdKSprWzBdK1BbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKCgkLnkrdlsxXSkqa1sxXStQWzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcigkLncqa1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcigkLmgqa1sxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfSksZy5wdXNoKFYpfWQmJih0LnNjYWxlPWQpLGYmJih0LnJvdGF0ZT1mKSx3JiYodC50cmFuc2xhdGU9dyk7Y29uc3QgTz1uZXcgei5Hcm91cDtpZih5KXt0aGlzLmNlbnRlclBvcz14LmdldENlbnRlclBvcyh5LG4pLE8uYXR0cih7Li4udCxub3JtYWxpemU6ITAsaWQ6dC5uYW1lLGFuY2hvcjpbLjUsLjVdLGJnY29sb3I6Yz09PVEuU3Ryb2tlP2w6dm9pZCAwLHBvczp0aGlzLmNlbnRlclBvcyxzaXplOlsoeS53LTIqeC5TYWZlQm9yZGVyUGFkZGluZykva1swXSwoeS5oLTIqeC5TYWZlQm9yZGVyUGFkZGluZykva1sxXV0sekluZGV4Omh9KTtjb25zdCBiPWcubWFwKHY9Pih2LnBvcz1bdi5wb3NbMF0tdGhpcy5jZW50ZXJQb3NbMF0sdi5wb3NbMV0tdGhpcy5jZW50ZXJQb3NbMV1dLG5ldyB6LlBhdGgodikpKTtPLmFwcGVuZCguLi5iKSxjPT09US5TdHJva2UmJk8uc2VhbCgpLG4uYXBwZW5kKE8pfWlmKGR8fGZ8fHcpe2NvbnN0IGI9Tz09bnVsbD92b2lkIDA6Ty5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtpZihiKXJldHVybnt4Ok1hdGguZmxvb3IoYi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihiLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGIud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoYi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJuIHl9Y29tcHV0RHJhd1BvaW50cyhlKXtyZXR1cm4gdGhpcy53b3JrT3B0aW9ucy5zdHJva2VUeXBlPT09US5TdHJva2V8fGUubGVuZ3RoPT09MT90aGlzLmNvbXB1dFN0cm9rZShlKTp0aGlzLmNvbXB1dE5vbWFsKGUpfWNvbXB1dE5vbWFsKGUpe2xldCB0PXRoaXMud29ya09wdGlvbnMudGhpY2tuZXNzO2NvbnN0IHI9ZS5tYXAoaT0+KHQ9TWF0aC5tYXgodCxpLnJhZGl1cyksaS5wb2ludCkpO3JldHVybntwczpyLHJlY3Q6RyhyLHQpfX1jb21wdXRTdHJva2UoZSl7cmV0dXJuIGUubGVuZ3RoPT09MT90aGlzLmNvbXB1dERvdFN0cm9rZShlWzBdKTp0aGlzLmNvbXB1dExpbmVTdHJva2UoZSl9Y29tcHV0TGluZVN0cm9rZShlKXtjb25zdCB0PVtdLHI9W107Zm9yKGxldCBsPTA7bDxlLmxlbmd0aDtsKyspe2NvbnN0e3BvaW50OmMscmFkaXVzOnV9PWVbbF07bGV0IGg9Yy52O2w9PT0wJiZlLmxlbmd0aD4xJiYoaD1lW2wrMV0ucG9pbnQudik7Y29uc3QgZD1wLlBlcihoKS5tdWwodSk7dC5wdXNoKFIuU3ViKGMsZCkpLHIucHVzaChSLkFkZChjLGQpKX1jb25zdCBpPWVbZS5sZW5ndGgtMV0scz1SLkdldFNlbWljaXJjbGVTdHJva2UoaS5wb2ludCx0W3QubGVuZ3RoLTFdLC0xLDgpLG49Ui5HZXRTZW1pY2lyY2xlU3Ryb2tlKGVbMF0ucG9pbnQsclswXSwtMSw4KSxhPXQuY29uY2F0KHMsci5yZXZlcnNlKCksbik7cmV0dXJue3BzOmEscmVjdDpHKGEpfX1jb21wdXREb3RTdHJva2UoZSl7Y29uc3R7cG9pbnQ6dCxyYWRpdXM6cn09ZSxpPXt4OnQueC1yLHk6dC55LXIsdzpyKjIsaDpyKjJ9O3JldHVybntwczpSLkdldERvdFN0cm9rZSh0LHIsOCkscmVjdDppfX10cmFuc2Zvcm1EYXRhKGUsdCl7Y29uc3R7b3A6cix3b3JrU3RhdGU6aX09ZTtsZXQgcz10aGlzLnRtcFBvaW50cy5sZW5ndGgtMSxuPVtdO2lmKHIhPW51bGwmJnIubGVuZ3RoJiZpKXtjb25zdHtzdHJva2VUeXBlOmEsdGhpY2tuZXNzOmx9PXRoaXMud29ya09wdGlvbnMsYz1uZXcgU2V0O3M9YT09PVEuU3Ryb2tlP3RoaXMudXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZShyLGwsYyk6dGhpcy51cGRhdGVUZW1wUG9pbnRzKHIsbCxjKTtjb25zdCB1PXQ/dGhpcy50bXBQb2ludHM6dGhpcy50bXBQb2ludHMuc2xpY2Uocyk7cmV0dXJuIG49dGhpcy5nZXRUYXNrUG9pbnRzKHUsbCkse3Rhc2tzOm4sZWZmZWN0czpjLGNvbnN1bWVJbmRleDpzfX1yZXR1cm57dGFza3M6bixjb25zdW1lSW5kZXg6c319Y29tcHV0UmFkaXVzKGUsdCl7cmV0dXJuIGUqLjAzKnQrdCouNX1nZXRNaW5aKGUsdCl7cmV0dXJuKCh0fHxNYXRoLm1heCgxLE1hdGguZmxvb3IoZSouMykpKS1lKi41KSoxMDAvZS8zfWdldFRhc2tQb2ludHMoZSx0KXt2YXIgdTtjb25zdCByPVtdO2lmKGUubGVuZ3RoPT09MClyZXR1cm5bXTtsZXQgaT0wLHM9ZVswXS54LG49ZVswXS55LGE9W3Msbl0sbD1bXSxjPWVbMF0udDtmb3IoO2k8ZS5sZW5ndGg7KXtjb25zdCBoPWVbaV0sZD1oLngtcyxmPWgueS1uLHc9aC56LHk9dD90aGlzLmNvbXB1dFJhZGl1cyh3LHQpOnc7aWYobC5wdXNoKHtwb2ludDpuZXcgUihkLGYsdyxlW2ldLnYpLHJhZGl1czp5fSksaT4wJiZpPGUubGVuZ3RoLTEpe2NvbnN0IGc9ZVtpXS5nZXRBbmdsZUJ5UG9pbnRzKGVbaS0xXSxlW2krMV0pO2lmKGc8OTB8fGc+MjcwKXtjb25zdCBQPSh1PWwucG9wKCkpPT1udWxsP3ZvaWQgMDp1LnBvaW50LmNsb25lKCk7UCYmci5wdXNoKHt0YXNrSWQ6Yyxwb3M6YSxwb2ludHM6Wy4uLmwse3BvaW50OlAscmFkaXVzOnl9XX0pLHM9ZVtpXS54LG49ZVtpXS55LGE9W3Msbl07Y29uc3Qgaz1oLngtcyxPPWgueS1uO2w9W3twb2ludDpuZXcgUihrLE8sdykscmFkaXVzOnl9XSxjPURhdGUubm93KCl9fWkrK31yZXR1cm4gci5wdXNoKHt0YXNrSWQ6Yyxwb3M6YSxwb2ludHM6bH0pLHJ9dXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZShlLHQscil7Y29uc3QgaT1EYXRlLm5vdygpLHM9dGhpcy50bXBQb2ludHMubGVuZ3RoO2xldCBuPXM7Zm9yKGxldCBsPTA7bDxlLmxlbmd0aDtsKz0yKXtuPU1hdGgubWluKG4scyk7Y29uc3QgYz10aGlzLnRtcFBvaW50cy5sZW5ndGgsdT1uZXcgUihlW2xdLGVbbCsxXSk7aWYoYz09PTApe3RoaXMudG1wUG9pbnRzLnB1c2godSk7Y29udGludWV9Y29uc3QgaD1jLTEsZD10aGlzLnRtcFBvaW50c1toXSxmPXAuU3ViKHUsZCkudW5pKCk7aWYodS5pc05lYXIoZCx0KSl7aWYoZC56PHRoaXMuTUFYX1JFUEVBUil7aWYoZC5zZXR6KE1hdGgubWluKGQueisxLHRoaXMuTUFYX1JFUEVBUikpLG49TWF0aC5taW4obixoKSxjPjEpe2xldCBnPWMtMTtmb3IoO2c+MDspe2NvbnN0IFA9dGhpcy50bXBQb2ludHNbZ10uZGlzdGFuY2UodGhpcy50bXBQb2ludHNbZy0xXSksaz1NYXRoLm1heCh0aGlzLnRtcFBvaW50c1tnXS56LXRoaXMudW5pVGhpY2tuZXNzKlAsMCk7aWYodGhpcy50bXBQb2ludHNbZy0xXS56Pj1rKWJyZWFrO3RoaXMudG1wUG9pbnRzW2ctMV0uc2V0eihrKSxuPU1hdGgubWluKG4sZy0xKSxnLS19fX1lbHNlIG49MS8wO2NvbnRpbnVlfXUuc2V0dihmKTtjb25zdCB3PXUuZGlzdGFuY2UoZCkseT1NYXRoLm1heChkLnotdGhpcy51bmlUaGlja25lc3MqdywwKTtjPjEmJnAuRXF1YWxzKGYsZC52LC4wMikmJih5PjB8fGQuejw9MCkmJihyJiZkLnQmJnIuYWRkKGQudCksdGhpcy50bXBQb2ludHMucG9wKCksbj1NYXRoLm1pbihoLG4pKSx1LnNldHooeSksdGhpcy50bXBQb2ludHMucHVzaCh1KX1pZihuPT09MS8wKXJldHVybiB0aGlzLnRtcFBvaW50cy5sZW5ndGg7bGV0IGE9cztpZihuPT09cyl7YT1NYXRoLm1heChhLTEsMCk7Y29uc3QgbD10aGlzLnRtcFBvaW50c1thXS50O2wmJihyPT1udWxsfHxyLmFkZChsKSl9ZWxzZXtsZXQgbD1zLTE7Zm9yKGE9bjtsPj0wOyl7Y29uc3QgYz10aGlzLnRtcFBvaW50c1tsXS50O2lmKGMmJihyPT1udWxsfHxyLmFkZChjKSxsPD1uKSl7YT1sLGw9LTE7YnJlYWt9bC0tfX1yZXR1cm4gdGhpcy50bXBQb2ludHNbYV0uc2V0VChpKSxhfXVwZGF0ZVRlbXBQb2ludHMoZSx0LHIpe3ZhciBsO2NvbnN0IGk9RGF0ZS5ub3coKSxzPXRoaXMudG1wUG9pbnRzLmxlbmd0aDtsZXQgbj1zO2ZvcihsZXQgYz0wO2M8ZS5sZW5ndGg7Yys9Mil7Y29uc3QgdT10aGlzLnRtcFBvaW50cy5sZW5ndGgsaD1uZXcgUihlW2NdLGVbYysxXSk7aWYodT09PTApe3RoaXMudG1wUG9pbnRzLnB1c2goaCk7Y29udGludWV9Y29uc3QgZD11LTEsZj10aGlzLnRtcFBvaW50c1tkXSx3PXAuU3ViKGgsZikudW5pKCk7aWYoaC5pc05lYXIoZix0LzIpKXtuPU1hdGgubWluKGQsbik7Y29udGludWV9cC5FcXVhbHModyxmLnYsLjAyKSYmKHImJmYudCYmci5hZGQoZi50KSx0aGlzLnRtcFBvaW50cy5wb3AoKSxuPU1hdGgubWluKGQsbikpLGguc2V0dih3KSx0aGlzLnRtcFBvaW50cy5wdXNoKGgpfWxldCBhPXM7aWYobj09PXMpe2E9TWF0aC5tYXgoYS0xLDApO2NvbnN0IGM9dGhpcy50bXBQb2ludHNbYV0udDtjJiYocj09bnVsbHx8ci5hZGQoYykpfWVsc2V7bGV0IGM9TWF0aC5taW4ocy0xLG4pO2ZvcihhPW47Yz49MDspe2NvbnN0IHU9KGw9dGhpcy50bXBQb2ludHNbY10pPT1udWxsP3ZvaWQgMDpsLnQ7aWYodSYmKHI9PW51bGx8fHIuYWRkKHUpLGM8PW4pKXthPWMsYz0tMTticmVha31jLS19fXJldHVybiB0aGlzLnRtcFBvaW50c1thXS5zZXRUKGkpLGF9dXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZVdoZW5Eb25lKGUpe2NvbnN0e3RoaWNrbmVzczp0fT10aGlzLndvcmtPcHRpb25zLHI9ZS5sZW5ndGgsaT10aGlzLmdldE1pbloodCk7Zm9yKGxldCBzPTA7czxyO3MrPTIpe2NvbnN0IG49dGhpcy50bXBQb2ludHMubGVuZ3RoLGE9bmV3IFIoZVtzXSxlW3MrMV0pO2lmKG49PT0wKXt0aGlzLnRtcFBvaW50cy5wdXNoKGEpO2NvbnRpbnVlfWNvbnN0IGw9bi0xLGM9dGhpcy50bXBQb2ludHNbbF0sdT1wLlN1YihhLGMpLnVuaSgpLGg9YS5kaXN0YW5jZShjKTtpZihuPjEmJmMuej09PWkpYnJlYWs7aWYoYS5pc05lYXIoYyx0LzIpKXtpZihyPDMmJmMuejx0aGlzLk1BWF9SRVBFQVImJihjLnNldHooTWF0aC5taW4oYy56KzEsdGhpcy5NQVhfUkVQRUFSKSksbj4xKSl7bGV0IGY9bi0xO2Zvcig7Zj4wOyl7Y29uc3Qgdz10aGlzLnRtcFBvaW50c1tmXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1tmLTFdKSx5PU1hdGgubWF4KHRoaXMudG1wUG9pbnRzW2ZdLnotdGhpcy51bmlUaGlja25lc3MqdywtdC80KTtpZih0aGlzLnRtcFBvaW50c1tmLTFdLno+PXkpYnJlYWs7dGhpcy50bXBQb2ludHNbZi0xXS5zZXR6KHkpLGYtLX19Y29udGludWV9YS5zZXR2KHUpO2NvbnN0IGQ9TWF0aC5tYXgoYy56LXRoaXMudW5pVGhpY2tuZXNzKmgsaSk7bj4xJiZwLkVxdWFscyh1LGMudiwuMDIpJiZjLno8PTAmJnRoaXMudG1wUG9pbnRzLnBvcCgpLGEuc2V0eihkKSx0aGlzLnRtcFBvaW50cy5wdXNoKGEpfX1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXt2YXIgYTtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnN9PXIsbj1pLmdldCh0Lm5hbWUpO3JldHVybiBzJiYodC50YWdOYW1lPT09IkdST1VQIj9IZSh0KT90LnNldEF0dHJpYnV0ZSgiYmdjb2xvciIscyk6dC5jaGlsZHJlbi5mb3JFYWNoKGw9PntsLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLGwuZ2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiKSYmbC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIscyl9KToodC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSx0LnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixzKSksKGE9bj09bnVsbD92b2lkIDA6bi5vcHQpIT1udWxsJiZhLnN0cm9rZUNvbG9yJiYobi5vcHQuc3Ryb2tlQ29sb3I9cykpLG4mJmkuc2V0SW5mbyh0Lm5hbWUsbikseC51cGRhdGVOb2RlT3B0KGUpfXN0YXRpYyBnZXRSZWN0RnJvbUxheWVyKGUsdCl7Y29uc3Qgcj1lLmdldEVsZW1lbnRzQnlOYW1lKHQpWzBdO2lmKHIpe2NvbnN0IGk9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGkueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoaS55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihpLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGkuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fX19Y2xhc3MgTnIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkxhc2VyUGVufSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEubm9uZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNJbmRleCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY29uc3VtZUluZGV4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MH1jb21iaW5lQ29uc3VtZSgpe31zZXRXb3JrT3B0aW9ucyhlKXtzdXBlci5zZXRXb3JrT3B0aW9ucyhlKSx0aGlzLnN5bmNUaW1lc3RhbXA9RGF0ZS5ub3coKX1jb25zdW1lKGUpe2NvbnN0e2RhdGE6dCxpc1N1YldvcmtlcjpyfT1lLHt3b3JrSWQ6aSxvcDpzfT10O2lmKChzPT1udWxsP3ZvaWQgMDpzLmxlbmd0aCk9PT0wKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy51cGRhdGVUZW1wUG9pbnRzKHN8fFtdKSx0aGlzLmNvbnN1bWVJbmRleD50aGlzLnRtcFBvaW50cy5sZW5ndGgtNClyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e3N0cm9rZUNvbG9yOm4sdGhpY2tuZXNzOmEsc3Ryb2tlVHlwZTpsfT10aGlzLndvcmtPcHRpb25zLGM9Ryh0aGlzLnRtcFBvaW50cyxhKTtsZXQgdT0hMTtjb25zdCBoPXRoaXMuc3luY0luZGV4LGQ9dGhpcy50bXBQb2ludHMuc2xpY2UodGhpcy5jb25zdW1lSW5kZXgpO3RoaXMuY29uc3VtZUluZGV4PXRoaXMudG1wUG9pbnRzLmxlbmd0aC0xLHRoaXMuc3luY1RpbWVzdGFtcD09PTAmJih0aGlzLnN5bmNUaW1lc3RhbXA9RGF0ZS5ub3coKSk7Y29uc3QgZj17bmFtZTppPT1udWxsP3ZvaWQgMDppLnRvU3RyaW5nKCksb3BhY2l0eToxLGxpbmVEYXNoOmw9PT1RLkRvdHRlZD9bMSxhKjJdOmw9PT1RLkxvbmdEb3R0ZWQ/W2EsYSoyXTp2b2lkIDAsc3Ryb2tlQ29sb3I6bixsaW5lQ2FwOiJyb3VuZCIsbGluZVdpZHRoOmEsYW5jaG9yOlsuNSwuNV19LHc9dGhpcy5nZXRUYXNrUG9pbnRzKGQpO2lmKHcubGVuZ3RoKXtjb25zdCBnPURhdGUubm93KCk7Zy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWUmJih1PSEwLHRoaXMuc3luY1RpbWVzdGFtcD1nLHRoaXMuc3luY0luZGV4PXRoaXMudG1wUG9pbnRzLmxlbmd0aCksciYmdGhpcy5kcmF3KHthdHRyczpmLHRhc2tzOncsaXNEb3Q6ITEsbGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyfSl9Y29uc3QgeT1bXTtyZXR1cm4gdGhpcy50bXBQb2ludHMuc2xpY2UoaCkuZm9yRWFjaChnPT57eS5wdXNoKGcueCxnLnkpfSkse3JlY3Q6e3g6Yy54KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLHk6Yy55KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdLHc6Yy53KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSxoOmMuaCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV19LHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDp1P2k6dm9pZCAwLG9wOnU/eTp2b2lkIDAsaW5kZXg6dT9oKjI6dm9pZCAwfX1jb25zdW1lQWxsKCl7dmFyIGk7Y29uc3QgZT0oaT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmkudG9TdHJpbmcoKTtsZXQgdDtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGgtMT50aGlzLmNvbnN1bWVJbmRleCl7bGV0IHM9dGhpcy50bXBQb2ludHMuc2xpY2UodGhpcy5jb25zdW1lSW5kZXgpO2NvbnN0IG49cy5sZW5ndGg9PT0xLHtzdHJva2VDb2xvcjphLHRoaWNrbmVzczpsLHN0cm9rZVR5cGU6Y309dGhpcy53b3JrT3B0aW9ucztpZihuKXtjb25zdCBkPXRoaXMuY29tcHV0RG90U3Ryb2tlKHtwb2ludDpzWzBdLHJhZGl1czpsLzJ9KTtzPWQucHMsdD1kLnJlY3R9ZWxzZSB0PUcodGhpcy50bXBQb2ludHMsbCk7Y29uc3QgdT17bmFtZTplPT1udWxsP3ZvaWQgMDplLnRvU3RyaW5nKCksZmlsbENvbG9yOm4/YTp2b2lkIDAsb3BhY2l0eToxLGxpbmVEYXNoOmM9PT1RLkRvdHRlZCYmIW4/WzEsbCoyXTpjPT09US5Mb25nRG90dGVkJiYhbj9bbCxsKjJdOnZvaWQgMCxzdHJva2VDb2xvcjphLGxpbmVDYXA6bj92b2lkIDA6InJvdW5kIixsaW5lV2lkdGg6bj8wOmwsYW5jaG9yOlsuNSwuNV19LGg9dGhpcy5nZXRUYXNrUG9pbnRzKHMpO2gubGVuZ3RoJiZ0aGlzLmRyYXcoe2F0dHJzOnUsdGFza3M6aCxpc0RvdDpuLGxheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcn0pfWNvbnN0IHI9W107cmV0dXJuIHRoaXMudG1wUG9pbnRzLnNsaWNlKHRoaXMuc3luY0luZGV4KS5mb3JFYWNoKHM9PntyLnB1c2gocy54LHMueSl9KSx7cmVjdDp0JiZ7eDp0LngqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0seTp0LnkqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMV0sdzp0LncqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdLGg6dC5oKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXX0sdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOmUsb3A6cixpbmRleDp0aGlzLnN5bmNJbmRleCoyfX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wLHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY0luZGV4PTB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIHc7Y29uc3R7b3A6dCxyZXBsYWNlSWQ6cixpc0Z1bGxXb3JrOml9PWUse3N0cm9rZUNvbG9yOnMsdGhpY2tuZXNzOm4sc3Ryb2tlVHlwZTphfT10aGlzLndvcmtPcHRpb25zO2lmKCF0Lmxlbmd0aCl7Y29uc3QgeT1HKHRoaXMudG1wUG9pbnRzLG4pO3JldHVybnt4OnkueCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblswXSx5OnkueSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXSx3Onkudyp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0saDp5LmgqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdfX1jb25zdCBsPU1hdGgubWF4KDAsdGhpcy50bXBQb2ludHMubGVuZ3RoLTEpO3RoaXMudXBkYXRlVGVtcFBvaW50cyh0fHxbXSk7bGV0IGMsdT10aGlzLnRtcFBvaW50cy5zbGljZShsKTtjb25zdCBoPXUubGVuZ3RoPT09MTtpZihoKXtjb25zdCB5PXRoaXMuY29tcHV0RG90U3Ryb2tlKHtwb2ludDp1WzBdLHJhZGl1czpuLzJ9KTt1PXkucHMsYz15LnJlY3R9ZWxzZSBjPUcodGhpcy50bXBQb2ludHMsbik7Y29uc3QgZD17bmFtZToodz10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOncudG9TdHJpbmcoKSxmaWxsQ29sb3I6aD9zOnZvaWQgMCxvcGFjaXR5OjEsbGluZURhc2g6YT09PVEuRG90dGVkJiYhaD9bMSxuKjJdOmE9PT1RLkxvbmdEb3R0ZWQmJiFoP1tuLG4qMl06dm9pZCAwLHN0cm9rZUNvbG9yOnMsbGluZUNhcDpoP3ZvaWQgMDoicm91bmQiLGxpbmVXaWR0aDpoPzA6bixhbmNob3I6Wy41LC41XX0sZj10aGlzLmdldFRhc2tQb2ludHModSk7aWYoZi5sZW5ndGgpe2NvbnN0IHk9aT90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7dGhpcy5kcmF3KHthdHRyczpkLHRhc2tzOmYsaXNEb3Q6aCxyZXBsYWNlSWQ6cixsYXllcjp5fSl9cmV0dXJue3g6Yy54KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLHk6Yy55KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdLHc6Yy53KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSxoOmMuaCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV19fWNvbXB1dERvdFN0cm9rZShlKXtjb25zdHtwb2ludDp0LHJhZGl1czpyfT1lLGk9e3g6dC54LXIseTp0Lnktcix3OnIqMixoOnIqMn07cmV0dXJue3BzOlIuR2V0RG90U3Ryb2tlKHQsciw4KSxyZWN0Oml9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD10aGlzLnRtcFBvaW50cy5sZW5ndGg7Zm9yKGxldCByPTA7cjxlLmxlbmd0aDtyKz0yKXtpZih0KXtjb25zdCBpPXRoaXMudG1wUG9pbnRzLnNsaWNlKC0xKVswXTtpJiZpLng9PT1lW3JdJiZpLnk9PT1lW3IrMV0mJnRoaXMudG1wUG9pbnRzLnBvcCgpfXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIoZVtyXSxlW3IrMV0pKX19YXN5bmMgZHJhdyhlKXtjb25zdHthdHRyczp0LHRhc2tzOnIsaXNEb3Q6aSxsYXllcjpzfT1lLHtkdXJhdGlvbjpufT10aGlzLndvcmtPcHRpb25zO2Zvcihjb25zdCBhIG9mIHIpe2NvbnN0IGw9bmV3IHouUGF0aCx7cG9zOmMscG9pbnRzOnV9PWE7bGV0IGg7aT9oPXhlKHUsITApOmg9eGUodSwhMSksbC5hdHRyKHsuLi50LHBvczpjLGQ6aH0pO2NvbnN0e3ZlcnRleDpkLGZyYWdtZW50OmZ9PXRoaXMud29ya09wdGlvbnM7aWYoZCYmZil7Y29uc3Qgdz1zLnJlbmRlcmVyLmNyZWF0ZVByb2dyYW0oe3ZlcnRleDpkLGZyYWdtZW50OmZ9KSx7d2lkdGg6eSxoZWlnaHQ6Z309cy5nZXRSZXNvbHV0aW9uKCk7bC5zZXRVbmlmb3Jtcyh7dV90aW1lOjAsdV9yZXNvbHV0aW9uOlt5LGddfSksbC5zZXRQcm9ncmFtKHcpfXMuYXBwZW5kQ2hpbGQobCksbC50cmFuc2l0aW9uKG4pLmF0dHIoe3NjYWxlOmk/Wy4xLC4xXTpbMSwxXSxsaW5lV2lkdGg6aT8wOjF9KS50aGVuKCgpPT57bC5yZW1vdmUoKX0pfX1nZXRUYXNrUG9pbnRzKGUpe3ZhciBsO2NvbnN0IHQ9W107aWYoZS5sZW5ndGg9PT0wKXJldHVybltdO2xldCByPTAsaT1lWzBdLngscz1lWzBdLnksbj1baSxzXSxhPVtdO2Zvcig7cjxlLmxlbmd0aDspe2NvbnN0IGM9ZVtyXSx1PWMueC1pLGg9Yy55LXM7aWYoYS5wdXNoKG5ldyBSKHUsaCkpLHI+MCYmcjxlLmxlbmd0aC0xKXtjb25zdCBkPWVbcl0uZ2V0QW5nbGVCeVBvaW50cyhlW3ItMV0sZVtyKzFdKTtpZihkPDkwfHxkPjI3MCl7Y29uc3QgZj0obD1hLnBvcCgpKT09bnVsbD92b2lkIDA6bC5jbG9uZSgpO2YmJnQucHVzaCh7cG9zOm4scG9pbnRzOlsuLi5hLGZdfSksaT1lW3JdLngscz1lW3JdLnksbj1baSxzXTtjb25zdCB3PWMueC1pLHk9Yy55LXM7YT1bbmV3IFIodyx5KV19fXIrK31yZXR1cm4gdC5wdXNoKHtwb3M6bixwb2ludHM6YX0pLHR9cmVtb3ZlTG9jYWwoKXt9cmVtb3ZlU2VydmljZShlKXtsZXQgdDtjb25zdCByPVtdO3JldHVybiB0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShlKS5mb3JFYWNoKGk9PntpZihpLm5hbWU9PT1lKXtjb25zdCBzPWkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7dD1BKHQse3g6cy54LHk6cy55LHc6cy53aWR0aCxoOnMuaGVpZ2h0fSksci5wdXNoKGkpfX0pLHIubGVuZ3RoJiZyLmZvckVhY2goaT0+aS5yZW1vdmUoKSksdH19dmFyIFFoPVplO1plLnBvbHlsaW5lPVplLFplLnBvbHlnb249Smg7ZnVuY3Rpb24gWmUobyxlLHQpe3ZhciByPW8ubGVuZ3RoLGk9T2Uob1swXSxlKSxzPVtdLG4sYSxsLGMsdTtmb3IodHx8KHQ9W10pLG49MTtuPHI7bisrKXtmb3IoYT1vW24tMV0sbD1vW25dLGM9dT1PZShsLGUpOzspaWYoaXxjKXtpZihpJmMpYnJlYWs7aT8oYT13dChhLGwsaSxlKSxpPU9lKGEsZSkpOihsPXd0KGEsbCxjLGUpLGM9T2UobCxlKSl9ZWxzZXtzLnB1c2goYSksYyE9PXU/KHMucHVzaChsKSxuPHItMSYmKHQucHVzaChzKSxzPVtdKSk6bj09PXItMSYmcy5wdXNoKGwpO2JyZWFrfWk9dX1yZXR1cm4gcy5sZW5ndGgmJnQucHVzaChzKSx0fWZ1bmN0aW9uIEpoKG8sZSl7dmFyIHQscixpLHMsbixhLGw7Zm9yKHI9MTtyPD04O3IqPTIpe2Zvcih0PVtdLGk9b1tvLmxlbmd0aC0xXSxzPSEoT2UoaSxlKSZyKSxuPTA7bjxvLmxlbmd0aDtuKyspYT1vW25dLGw9IShPZShhLGUpJnIpLGwhPT1zJiZ0LnB1c2god3QoaSxhLHIsZSkpLGwmJnQucHVzaChhKSxpPWEscz1sO2lmKG89dCwhby5sZW5ndGgpYnJlYWt9cmV0dXJuIHR9ZnVuY3Rpb24gd3QobyxlLHQscil7cmV0dXJuIHQmOD9bb1swXSsoZVswXS1vWzBdKSooclszXS1vWzFdKS8oZVsxXS1vWzFdKSxyWzNdXTp0JjQ/W29bMF0rKGVbMF0tb1swXSkqKHJbMV0tb1sxXSkvKGVbMV0tb1sxXSksclsxXV06dCYyP1tyWzJdLG9bMV0rKGVbMV0tb1sxXSkqKHJbMl0tb1swXSkvKGVbMF0tb1swXSldOnQmMT9bclswXSxvWzFdKyhlWzFdLW9bMV0pKihyWzBdLW9bMF0pLyhlWzBdLW9bMF0pXTpudWxsfWZ1bmN0aW9uIE9lKG8sZSl7dmFyIHQ9MDtyZXR1cm4gb1swXTxlWzBdP3R8PTE6b1swXT5lWzJdJiYodHw9Miksb1sxXTxlWzFdP3R8PTQ6b1sxXT5lWzNdJiYodHw9OCksdH12YXIgS2g9bWUoUWgpO2NsYXNzIG5lIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlLHQpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLm5vbmV9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5FcmFzZXJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VydmljZVdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ybGRQb3NpdGlvbiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JsZFNjYWxpbmciLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZXJhc2VyUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlcmFzZXJQb2x5bGluZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMuc2VydmljZVdvcms9dCx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy53b3JsZFBvc2l0aW9uPXRoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb24sdGhpcy53b3JsZFNjYWxpbmc9dGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nfWNvbWJpbmVDb25zdW1lKCl7fWNvbnN1bWVTZXJ2aWNlKCl7fXNldFdvcmtPcHRpb25zKGUpe3N1cGVyLnNldFdvcmtPcHRpb25zKGUpfWNyZWF0ZUVyYXNlclJlY3QoZSl7Y29uc3QgdD1lWzBdKnRoaXMud29ybGRTY2FsaW5nWzBdK3RoaXMud29ybGRQb3NpdGlvblswXSxyPWVbMV0qdGhpcy53b3JsZFNjYWxpbmdbMV0rdGhpcy53b3JsZFBvc2l0aW9uWzFdLHt3aWR0aDppLGhlaWdodDpzfT1uZS5lcmFzZXJTaXplc1t0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc107dGhpcy5lcmFzZXJSZWN0PXt4OnQtaSouNSx5OnItcyouNSx3OmksaDpzfSx0aGlzLmVyYXNlclBvbHlsaW5lPVt0aGlzLmVyYXNlclJlY3QueCx0aGlzLmVyYXNlclJlY3QueSx0aGlzLmVyYXNlclJlY3QueCt0aGlzLmVyYXNlclJlY3Qudyx0aGlzLmVyYXNlclJlY3QueSt0aGlzLmVyYXNlclJlY3QuaF19Y29tcHV0UmVjdENlbnRlclBvaW50cygpe2NvbnN0IGU9dGhpcy50bXBQb2ludHMuc2xpY2UoLTIpO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTQpe2NvbnN0IHQ9bmV3IHAodGhpcy50bXBQb2ludHNbMF0sdGhpcy50bXBQb2ludHNbMV0pLHI9bmV3IHAodGhpcy50bXBQb2ludHNbMl0sdGhpcy50bXBQb2ludHNbM10pLGk9cC5TdWIocix0KS51bmkoKSxzPXAuRGlzdCh0LHIpLHt3aWR0aDpuLGhlaWdodDphfT1uZS5lcmFzZXJTaXplc1t0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc10sbD1NYXRoLm1pbihuLGEpLGM9TWF0aC5yb3VuZChzL2wpO2lmKGM+MSl7Y29uc3QgdT1bXTtmb3IobGV0IGg9MDtoPGM7aCsrKXtjb25zdCBkPXAuTXVsKGksaCpsKTt1LnB1c2godGhpcy50bXBQb2ludHNbMF0rZC54LHRoaXMudG1wUG9pbnRzWzFdK2QueSl9cmV0dXJuIHUuY29uY2F0KGUpfX1yZXR1cm4gZX1pc05lYXIoZSx0KXtjb25zdCByPW5ldyBwKGVbMF0sZVsxXSksaT1uZXcgcCh0WzBdLHRbMV0pLHt3aWR0aDpzLGhlaWdodDpufT1uZS5lcmFzZXJTaXplc1t0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc107cmV0dXJuIHAuRGlzdChyLGkpPE1hdGguaHlwb3QocyxuKSouNX1jdXRQb2x5bGluZShlLHQpe2xldCByPVt0XSxpPTA7Zm9yKDtpPGUubGVuZ3RoOyl7Y29uc3QgYT1lW2ldO2lmKGEubGVuZ3RoPDIpYnJlYWs7cj1zKHIsYSksaSsrfXJldHVybiByO2Z1bmN0aW9uIHMoYSxsKXtjb25zdCBjPWE7Zm9yKGxldCB1PTA7dTxhLmxlbmd0aDt1Kyspe2NvbnN0IGg9YVt1XSxkPWguZmluZEluZGV4KChmLHcpPT53PGgubGVuZ3RoLTE/bihbZixoW3crMV1dLFtsWzBdLGxbMV1dKTohMSk7aWYoZCE9PS0xJiZkPi0xKXtjb25zdCBmPVtdLHc9aC5zbGljZSgwLGQrMSk7aWYocC5FcXVhbHMoaFtkXSxsWzBdKXx8dy5wdXNoKGxbMF0uY2xvbmUoKS5zZXR6KGhbZF0ueikpLHcubGVuZ3RoPjEmJmYucHVzaCh3KSxkK2wubGVuZ3RoLTE8aC5sZW5ndGgtMSl7Y29uc3QgeT1kK2wubGVuZ3RoLTEsZz1oLnNsaWNlKHkpLFA9bFtsLmxlbmd0aC0xXTtwLkVxdWFscyhoW3ldLFApfHxnLnVuc2hpZnQoUC5jbG9uZSgpLnNldHooaFt5XS56KSksZy5sZW5ndGg+MSYmZi5wdXNoKGcpfXJldHVybiBjLnNwbGljZSh1LDEsLi4uZiksY319cmV0dXJuIGN9ZnVuY3Rpb24gbihhLGwpe2NvbnN0IGM9cC5TdWIoYVsxXSxhWzBdKSx1PXAuU3ViKGxbMV0sbFswXSksaD1wLlN1YihsWzBdLGFbMF0pO3JldHVybiBNYXRoLmFicyhwLkNwcihjLHUpKTwuMSYmTWF0aC5hYnMocC5DcHIoYyxoKSk8LjF9fWlzU2FtZVBvaW50KGUsdCl7cmV0dXJuIGVbMF09PT10WzBdJiZlWzFdPT09dFsxXX10cmFuc2xhdGVJbnRlcnNlY3QoZSl7Y29uc3QgdD1bXTtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrKyl7Y29uc3QgaT1lW3JdLmZpbHRlcigoYSxsLGMpPT4hKGw+MCYmdGhpcy5pc1NhbWVQb2ludChhLGNbbC0xXSkpKSxzPVtdO2xldCBuPTA7Zm9yKDtuPGkubGVuZ3RoOyl7Y29uc3QgYT1pW25dLGw9bmV3IHAoYVswXSxhWzFdKTtzLnB1c2gobCksbisrfXQucHVzaChzKX1yZXR1cm4gdH1pc0xpbmVFcmFzZXIoZSx0KXtyZXR1cm4hKGU9PT1TLlBlbmNpbCYmIXQpfXJlbW92ZShlKXtjb25zdHtjdXJOb2RlTWFwOnQscmVtb3ZlSWRzOnIsbmV3V29ya0RhdGFzOml9PWUse2lzTGluZTpzfT10aGlzLndvcmtPcHRpb25zO2xldCBuO2Zvcihjb25zdFthLGxdb2YgdC5lbnRyaWVzKCkpaWYobC5yZWN0JiZ0aGlzLmVyYXNlclJlY3QmJnRoaXMuZXJhc2VyUG9seWxpbmUmJlBlKHRoaXMuZXJhc2VyUmVjdCxsLnJlY3QpKXtjb25zdHtvcDpjLHRvb2xzVHlwZTp1fT1sLGg9dGhpcy5pc0xpbmVFcmFzZXIodSxzKSxkPVtdLGY9W107Zm9yKGxldCB5PTA7eTxjLmxlbmd0aDt5Kz0zKXtjb25zdCBnPW5ldyBwKGNbeV0qdGhpcy53b3JsZFNjYWxpbmdbMF0rdGhpcy53b3JsZFBvc2l0aW9uWzBdLGNbeSsxXSp0aGlzLndvcmxkU2NhbGluZ1sxXSt0aGlzLndvcmxkUG9zaXRpb25bMV0sY1t5KzJdKTtmLnB1c2goZyksZC5wdXNoKG5ldyBSKGcueCxnLnkpKX1jb25zdCB3PWQubGVuZ3RoJiZHKGQpfHxsLnJlY3Q7aWYoUGUodyx0aGlzLmVyYXNlclJlY3QpKXtpZihmLmxlbmd0aD4xKXtjb25zdCB5PUtoLnBvbHlsaW5lKGYubWFwKGc9PmcuWFkpLHRoaXMuZXJhc2VyUG9seWxpbmUpO2lmKHkubGVuZ3RoJiYoci5hZGQobC5uYW1lKSwhaCkpe2NvbnN0IGc9dGhpcy50cmFuc2xhdGVJbnRlcnNlY3QoeSksUD10aGlzLmN1dFBvbHlsaW5lKGcsZik7Zm9yKGxldCBrPTA7azxQLmxlbmd0aDtrKyspe2NvbnN0IE89YCR7YX1fc18ke2t9YCxJPVtdO1Bba10uZm9yRWFjaChiPT57SS5wdXNoKChiLngtdGhpcy53b3JsZFBvc2l0aW9uWzBdKS90aGlzLndvcmxkU2NhbGluZ1swXSwoYi55LXRoaXMud29ybGRQb3NpdGlvblsxXSkvdGhpcy53b3JsZFNjYWxpbmdbMV0sYi56KX0pLGwub3B0JiZsLnRvb2xzVHlwZSYmdGhpcy52Tm9kZXMmJih0aGlzLnZOb2Rlcy5zZXRJbmZvKE8se3JlY3Q6dyxvcDpJLG9wdDpsLm9wdCxjYW5Sb3RhdGU6bC5jYW5Sb3RhdGUsc2NhbGVUeXBlOmwuc2NhbGVUeXBlLHRvb2xzVHlwZTpsLnRvb2xzVHlwZX0pLGkuc2V0KE8se3dvcmtJZDpPLG9wOkksb3B0Omwub3B0LHRvb2xzVHlwZTpsLnRvb2xzVHlwZX0pKX19fWVsc2Ugci5hZGQobC5uYW1lKTtuPUEobix3KX19cmV0dXJuIHIuZm9yRWFjaChhPT57dmFyIGw7cmV0dXJuKGw9dGhpcy52Tm9kZXMpPT1udWxsP3ZvaWQgMDpsLmRlbGV0ZShhKX0pLG4mJihuLngtPXguU2FmZUJvcmRlclBhZGRpbmcsbi55LT14LlNhZmVCb3JkZXJQYWRkaW5nLG4udys9eC5TYWZlQm9yZGVyUGFkZGluZyoyLG4uaCs9eC5TYWZlQm9yZGVyUGFkZGluZyoyKSxufWNvbnN1bWUoZSl7Y29uc3R7b3A6dH09ZS5kYXRhO2lmKCF0fHx0Lmxlbmd0aD09PTApcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdCByPXRoaXMudG1wUG9pbnRzLmxlbmd0aDtpZihyPjEmJnRoaXMuaXNOZWFyKFt0WzBdLHRbMV1dLFt0aGlzLnRtcFBvaW50c1tyLTJdLHRoaXMudG1wUG9pbnRzW3ItMV1dKSlyZXR1cm57dHlwZTptLk5vbmV9O3I9PT00JiYodGhpcy50bXBQb2ludHMuc2hpZnQoKSx0aGlzLnRtcFBvaW50cy5zaGlmdCgpKSx0aGlzLnRtcFBvaW50cy5wdXNoKHRbMF0sdFsxXSk7Y29uc3QgaT10aGlzLmNvbXB1dFJlY3RDZW50ZXJQb2ludHMoKTtsZXQgcztjb25zdCBuPW5ldyBTZXQsYT1uZXcgTWFwO3RoaXMudk5vZGVzLnNldFRhcmdldCgpO2NvbnN0IGw9dGhpcy5nZXRVbkxvY2tOb2RlTWFwKHRoaXMudk5vZGVzLmdldExhc3RUYXJnZXQoKSk7Zm9yKGxldCBjPTA7YzxpLmxlbmd0aC0xO2MrPTIpe3RoaXMuY3JlYXRlRXJhc2VyUmVjdChpLnNsaWNlKGMsYysyKSk7Y29uc3QgdT10aGlzLnJlbW92ZSh7Y3VyTm9kZU1hcDpsLHJlbW92ZUlkczpuLG5ld1dvcmtEYXRhczphfSk7cz1BKHMsdSl9aWYodGhpcy52Tm9kZXMuZGVsZXRlTGFzdFRhcmdldCgpLHMmJm4uc2l6ZSl7Zm9yKGNvbnN0IGMgb2YgYS5rZXlzKCkpbi5oYXMoYykmJmEuZGVsZXRlKGMpO3JldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6cyxyZW1vdmVJZHM6Wy4uLm5dLG5ld1dvcmtEYXRhczphfX1yZXR1cm57dHlwZTptLk5vbmV9fWNvbnN1bWVBbGwoZSl7cmV0dXJuIHRoaXMuY29uc3VtZShlKX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfWdldFVuTG9ja05vZGVNYXAoZSl7dmFyIHQ7aWYodGhpcy5zZXJ2aWNlV29yayl7Y29uc3Qgcj1yZShlKSxpPXRoaXMuc2VydmljZVdvcmsuc2VsZWN0b3JXb3JrU2hhcGVzLHM9dGhpcy5zZXJ2aWNlV29yay53b3JrU2hhcGVzO2Zvcihjb25zdCBuIG9mIGkudmFsdWVzKCkpaWYoKHQ9bi5zZWxlY3RJZHMpIT1udWxsJiZ0Lmxlbmd0aClmb3IoY29uc3QgYSBvZiBuLnNlbGVjdElkcylyLmRlbGV0ZShhKTtmb3IoY29uc3QgbiBvZiBzLmtleXMoKSlyLmRlbGV0ZShuKTtyZXR1cm4gcn1yZXR1cm4gZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KG5lLCJlcmFzZXJTaXplcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOk9iamVjdC5mcmVlemUoW09iamVjdC5mcmVlemUoe3dpZHRoOjE4LGhlaWdodDoyNn0pLE9iamVjdC5mcmVlemUoe3dpZHRoOjI2LGhlaWdodDozNH0pLE9iamVjdC5mcmVlemUoe3dpZHRoOjM0LGhlaWdodDo1MH0pXSl9KTtjb25zdCBWaD0iKysiLGVkPSJzZWxlY3RvciIsdGQ9ImFsbCI7dmFyIHJkPSJfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fIjtmdW5jdGlvbiBvZChvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5zZXQobyxyZCksdGhpc312YXIgc2Q9b2Q7ZnVuY3Rpb24gaWQobyl7cmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKG8pfXZhciBuZD1pZCxhZD1XdCxsZD1zZCxjZD1uZDtmdW5jdGlvbiBRZShvKXt2YXIgZT0tMSx0PW89PW51bGw/MDpvLmxlbmd0aDtmb3IodGhpcy5fX2RhdGFfXz1uZXcgYWQ7KytlPHQ7KXRoaXMuYWRkKG9bZV0pfVFlLnByb3RvdHlwZS5hZGQ9UWUucHJvdG90eXBlLnB1c2g9bGQsUWUucHJvdG90eXBlLmhhcz1jZDt2YXIgdWQ9UWU7ZnVuY3Rpb24gaGQobyxlKXtmb3IodmFyIHQ9LTEscj1vPT1udWxsPzA6by5sZW5ndGg7Kyt0PHI7KWlmKGUob1t0XSx0LG8pKXJldHVybiEwO3JldHVybiExfXZhciBkZD1oZDtmdW5jdGlvbiBmZChvLGUpe3JldHVybiBvLmhhcyhlKX12YXIgcGQ9ZmQseWQ9dWQsd2Q9ZGQsbWQ9cGQsZ2Q9MSxiZD0yO2Z1bmN0aW9uIHZkKG8sZSx0LHIsaSxzKXt2YXIgbj10JmdkLGE9by5sZW5ndGgsbD1lLmxlbmd0aDtpZihhIT1sJiYhKG4mJmw+YSkpcmV0dXJuITE7dmFyIGM9cy5nZXQobyksdT1zLmdldChlKTtpZihjJiZ1KXJldHVybiBjPT1lJiZ1PT1vO3ZhciBoPS0xLGQ9ITAsZj10JmJkP25ldyB5ZDp2b2lkIDA7Zm9yKHMuc2V0KG8sZSkscy5zZXQoZSxvKTsrK2g8YTspe3ZhciB3PW9baF0seT1lW2hdO2lmKHIpdmFyIGc9bj9yKHksdyxoLGUsbyxzKTpyKHcseSxoLG8sZSxzKTtpZihnIT09dm9pZCAwKXtpZihnKWNvbnRpbnVlO2Q9ITE7YnJlYWt9aWYoZil7aWYoIXdkKGUsZnVuY3Rpb24oUCxrKXtpZighbWQoZixrKSYmKHc9PT1QfHxpKHcsUCx0LHIscykpKXJldHVybiBmLnB1c2goayl9KSl7ZD0hMTticmVha319ZWxzZSBpZighKHc9PT15fHxpKHcseSx0LHIscykpKXtkPSExO2JyZWFrfX1yZXR1cm4gcy5kZWxldGUobykscy5kZWxldGUoZSksZH12YXIgV3I9dmQ7ZnVuY3Rpb24gU2Qobyl7dmFyIGU9LTEsdD1BcnJheShvLnNpemUpO3JldHVybiBvLmZvckVhY2goZnVuY3Rpb24ocixpKXt0WysrZV09W2kscl19KSx0fXZhciBrZD1TZDtmdW5jdGlvbiBQZChvKXt2YXIgZT0tMSx0PUFycmF5KG8uc2l6ZSk7cmV0dXJuIG8uZm9yRWFjaChmdW5jdGlvbihyKXt0WysrZV09cn0pLHR9dmFyIFRkPVBkLFJyPURlLE1yPXNyLElkPVZlLHhkPVdyLE9kPWtkLExkPVRkLENkPTEsTmQ9MixXZD0iW29iamVjdCBCb29sZWFuXSIsUmQ9IltvYmplY3QgRGF0ZV0iLE1kPSJbb2JqZWN0IEVycm9yXSIsQWQ9IltvYmplY3QgTWFwXSIsJGQ9IltvYmplY3QgTnVtYmVyXSIsRGQ9IltvYmplY3QgUmVnRXhwXSIsamQ9IltvYmplY3QgU2V0XSIsRmQ9IltvYmplY3QgU3RyaW5nXSIsQmQ9IltvYmplY3QgU3ltYm9sXSIsX2Q9IltvYmplY3QgQXJyYXlCdWZmZXJdIixFZD0iW29iamVjdCBEYXRhVmlld10iLEFyPVJyP1JyLnByb3RvdHlwZTp2b2lkIDAsbXQ9QXI/QXIudmFsdWVPZjp2b2lkIDA7ZnVuY3Rpb24gemQobyxlLHQscixpLHMsbil7c3dpdGNoKHQpe2Nhc2UgRWQ6aWYoby5ieXRlTGVuZ3RoIT1lLmJ5dGVMZW5ndGh8fG8uYnl0ZU9mZnNldCE9ZS5ieXRlT2Zmc2V0KXJldHVybiExO289by5idWZmZXIsZT1lLmJ1ZmZlcjtjYXNlIF9kOnJldHVybiEoby5ieXRlTGVuZ3RoIT1lLmJ5dGVMZW5ndGh8fCFzKG5ldyBNcihvKSxuZXcgTXIoZSkpKTtjYXNlIFdkOmNhc2UgUmQ6Y2FzZSAkZDpyZXR1cm4gSWQoK28sK2UpO2Nhc2UgTWQ6cmV0dXJuIG8ubmFtZT09ZS5uYW1lJiZvLm1lc3NhZ2U9PWUubWVzc2FnZTtjYXNlIERkOmNhc2UgRmQ6cmV0dXJuIG89PWUrIiI7Y2FzZSBBZDp2YXIgYT1PZDtjYXNlIGpkOnZhciBsPXImQ2Q7aWYoYXx8KGE9TGQpLG8uc2l6ZSE9ZS5zaXplJiYhbClyZXR1cm4hMTt2YXIgYz1uLmdldChvKTtpZihjKXJldHVybiBjPT1lO3J8PU5kLG4uc2V0KG8sZSk7dmFyIHU9eGQoYShvKSxhKGUpLHIsaSxzLG4pO3JldHVybiBuLmRlbGV0ZShvKSx1O2Nhc2UgQmQ6aWYobXQpcmV0dXJuIG10LmNhbGwobyk9PW10LmNhbGwoZSl9cmV0dXJuITF9dmFyIFVkPXpkLCRyPUp0LEdkPTEsWGQ9T2JqZWN0LnByb3RvdHlwZSxIZD1YZC5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBZZChvLGUsdCxyLGkscyl7dmFyIG49dCZHZCxhPSRyKG8pLGw9YS5sZW5ndGgsYz0kcihlKSx1PWMubGVuZ3RoO2lmKGwhPXUmJiFuKXJldHVybiExO2Zvcih2YXIgaD1sO2gtLTspe3ZhciBkPWFbaF07aWYoIShuP2QgaW4gZTpIZC5jYWxsKGUsZCkpKXJldHVybiExfXZhciBmPXMuZ2V0KG8pLHc9cy5nZXQoZSk7aWYoZiYmdylyZXR1cm4gZj09ZSYmdz09bzt2YXIgeT0hMDtzLnNldChvLGUpLHMuc2V0KGUsbyk7Zm9yKHZhciBnPW47KytoPGw7KXtkPWFbaF07dmFyIFA9b1tkXSxrPWVbZF07aWYocil2YXIgTz1uP3IoayxQLGQsZSxvLHMpOnIoUCxrLGQsbyxlLHMpO2lmKCEoTz09PXZvaWQgMD9QPT09a3x8aShQLGssdCxyLHMpOk8pKXt5PSExO2JyZWFrfWd8fChnPWQ9PSJjb25zdHJ1Y3RvciIpfWlmKHkmJiFnKXt2YXIgST1vLmNvbnN0cnVjdG9yLGI9ZS5jb25zdHJ1Y3RvcjtJIT1iJiYiY29uc3RydWN0b3IiaW4gbyYmImNvbnN0cnVjdG9yImluIGUmJiEodHlwZW9mIEk9PSJmdW5jdGlvbiImJkkgaW5zdGFuY2VvZiBJJiZ0eXBlb2YgYj09ImZ1bmN0aW9uIiYmYiBpbnN0YW5jZW9mIGIpJiYoeT0hMSl9cmV0dXJuIHMuZGVsZXRlKG8pLHMuZGVsZXRlKGUpLHl9dmFyIHFkPVlkLGd0PVJ0LFpkPVdyLFFkPVVkLEpkPXFkLERyPUdlLGpyPV9lLEZyPXJ0LEtkPUV0LFZkPTEsQnI9IltvYmplY3QgQXJndW1lbnRzXSIsX3I9IltvYmplY3QgQXJyYXldIixKZT0iW29iamVjdCBPYmplY3RdIixlZj1PYmplY3QucHJvdG90eXBlLEVyPWVmLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIHRmKG8sZSx0LHIsaSxzKXt2YXIgbj1qcihvKSxhPWpyKGUpLGw9bj9fcjpEcihvKSxjPWE/X3I6RHIoZSk7bD1sPT1Ccj9KZTpsLGM9Yz09QnI/SmU6Yzt2YXIgdT1sPT1KZSxoPWM9PUplLGQ9bD09YztpZihkJiZGcihvKSl7aWYoIUZyKGUpKXJldHVybiExO249ITAsdT0hMX1pZihkJiYhdSlyZXR1cm4gc3x8KHM9bmV3IGd0KSxufHxLZChvKT9aZChvLGUsdCxyLGkscyk6UWQobyxlLGwsdCxyLGkscyk7aWYoISh0JlZkKSl7dmFyIGY9dSYmRXIuY2FsbChvLCJfX3dyYXBwZWRfXyIpLHc9aCYmRXIuY2FsbChlLCJfX3dyYXBwZWRfXyIpO2lmKGZ8fHcpe3ZhciB5PWY/by52YWx1ZSgpOm8sZz13P2UudmFsdWUoKTplO3JldHVybiBzfHwocz1uZXcgZ3QpLGkoeSxnLHQscixzKX19cmV0dXJuIGQ/KHN8fChzPW5ldyBndCksSmQobyxlLHQscixpLHMpKTohMX12YXIgcmY9dGYsb2Y9cmYsenI9Y2U7ZnVuY3Rpb24gVXIobyxlLHQscixpKXtyZXR1cm4gbz09PWU/ITA6bz09bnVsbHx8ZT09bnVsbHx8IXpyKG8pJiYhenIoZSk/byE9PW8mJmUhPT1lOm9mKG8sZSx0LHIsVXIsaSl9dmFyIHNmPVVyLG5mPXNmO2Z1bmN0aW9uIGFmKG8sZSl7cmV0dXJuIG5mKG8sZSl9dmFyIGxmPWFmLEdyPW1lKGxmKTtjbGFzcyBFIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5TZWxlY3Rvcn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZWxlY3RJZHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VsZWN0b3JDb2xvciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzdHJva2VDb2xvciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJmaWxsQ29sb3IiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkU2VsZWN0UmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5UZXh0RWRpdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhbkxvY2siLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNoYXBlT3B0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRleHRPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiaXNMb2NrZWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHR9Y29tcHV0U2VsZWN0b3IoZT0hMCl7Y29uc3QgdD1HKHRoaXMudG1wUG9pbnRzKTtpZih0Lnc9PT0wfHx0Lmg9PT0wKXJldHVybntzZWxlY3RJZHM6W10saW50ZXJzZWN0UmVjdDp2b2lkIDAsc3ViTm9kZU1hcDpuZXcgTWFwfTtjb25zdHtyZWN0UmFuZ2U6cixub2RlUmFuZ2U6aX09dGhpcy52Tm9kZXMuZ2V0UmVjdEludGVyc2VjdFJhbmdlKHQsZSk7cmV0dXJue3NlbGVjdElkczpbLi4uaS5rZXlzKCldLGludGVyc2VjdFJlY3Q6cixzdWJOb2RlTWFwOml9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD10aGlzLnRtcFBvaW50cy5sZW5ndGgscj1lLmxlbmd0aDtpZihyPjEpe2NvbnN0IGk9bmV3IFIoZVtyLTJdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLGVbci0xXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXSk7dD09PTI/dGhpcy50bXBQb2ludHMuc3BsaWNlKDEsMSxpKTp0aGlzLnRtcFBvaW50cy5wdXNoKGkpfX1kcmF3U2VsZWN0b3IoZSl7Y29uc3R7ZHJhd1JlY3Q6dCxzdWJOb2RlTWFwOnIsc2VsZWN0b3JJZDppLGxheWVyOnMsaXNTZXJ2aWNlOm59PWUsYT1uZXcgei5Hcm91cCh7cG9zOlt0LngsdC55XSxhbmNob3I6WzAsMF0sc2l6ZTpbdC53LHQuaF0saWQ6aSxuYW1lOmksekluZGV4OjFlM30pLGw9W107aWYobil7Y29uc3QgYz1uZXcgei5SZWN0KHtub3JtYWxpemU6ITAscG9zOlt0LncvMix0LmgvMl0sbGluZVdpZHRoOjEsc3Ryb2tlQ29sb3I6dGhpcy5zZWxlY3RvckNvbG9yfHx0aGlzLndvcmtPcHRpb25zLnN0cm9rZUNvbG9yLHdpZHRoOnQudyxoZWlnaHQ6dC5oLG5hbWU6RS5zZWxlY3RvckJvcmRlcklkfSk7bC5wdXNoKGMpfXIuZm9yRWFjaCgoYyx1KT0+e2NvbnN0IGg9W2MucmVjdC54K2MucmVjdC53LzItdC54LGMucmVjdC55K2MucmVjdC5oLzItdC55XSxkPW5ldyB6LlJlY3Qoe25vcm1hbGl6ZTohMCxwb3M6aCxsaW5lV2lkdGg6MSxzdHJva2VDb2xvcjpyLnNpemU+MT90aGlzLnNlbGVjdG9yQ29sb3J8fHRoaXMud29ya09wdGlvbnMuc3Ryb2tlQ29sb3I6dm9pZCAwLHdpZHRoOmMucmVjdC53LGhlaWdodDpjLnJlY3QuaCxpZDpgc2VsZWN0b3ItJHt1fWAsbmFtZTpgc2VsZWN0b3ItJHt1fWB9KTtsLnB1c2goZCl9KSxsJiZhLmFwcGVuZCguLi5sKSwocz09bnVsbD92b2lkIDA6cy5wYXJlbnQpLmFwcGVuZENoaWxkKGEpfWRyYXcoZSx0LHIsaT0hMSl7dmFyIGEsbDtjb25zdHtpbnRlcnNlY3RSZWN0OnMsc3ViTm9kZU1hcDpufT1yOyhsPShhPXQucGFyZW50KT09bnVsbD92b2lkIDA6YS5nZXRFbGVtZW50QnlJZChlKSk9PW51bGx8fGwucmVtb3ZlKCkscyYmdGhpcy5kcmF3U2VsZWN0b3Ioe2RyYXdSZWN0OnMsc3ViTm9kZU1hcDpuLHNlbGVjdG9ySWQ6ZSxsYXllcjp0LGlzU2VydmljZTppfSl9Z2V0U2VsZWN0ZW9ySW5mbyhlKXt0aGlzLnNjYWxlVHlwZT1xLmFsbCx0aGlzLmNhblJvdGF0ZT0hMSx0aGlzLnRleHRPcHQ9dm9pZCAwLHRoaXMuc3Ryb2tlQ29sb3I9dm9pZCAwLHRoaXMuZmlsbENvbG9yPXZvaWQgMCx0aGlzLmNhblRleHRFZGl0PSExLHRoaXMuY2FuTG9jaz0hMSx0aGlzLmlzTG9ja2VkPSExLHRoaXMudG9vbHNUeXBlcz12b2lkIDAsdGhpcy5zaGFwZU9wdD12b2lkIDA7Y29uc3QgdD1uZXcgU2V0O2xldCByO2Zvcihjb25zdCBpIG9mIGUudmFsdWVzKCkpe2NvbnN0e29wdDpzLGNhblJvdGF0ZTpuLHNjYWxlVHlwZTphLHRvb2xzVHlwZTpsfT1pO3RoaXMuc2VsZWN0b3JDb2xvcj10aGlzLndvcmtPcHRpb25zLnN0cm9rZUNvbG9yLHMuc3Ryb2tlQ29sb3ImJih0aGlzLnN0cm9rZUNvbG9yPXMuc3Ryb2tlQ29sb3IpLHMuZmlsbENvbG9yJiYodGhpcy5maWxsQ29sb3I9cy5maWxsQ29sb3IpLHMudGV4dE9wdCYmKHRoaXMudGV4dE9wdD1zLnRleHRPcHQpLGw9PT1TLlNwZWVjaEJhbGxvb24mJih0LmFkZChsKSx0aGlzLnNoYXBlT3B0fHwodGhpcy5zaGFwZU9wdD17fSksdGhpcy5zaGFwZU9wdC5wbGFjZW1lbnQ9cy5wbGFjZW1lbnQpLGw9PT1TLlBvbHlnb24mJih0LmFkZChsKSx0aGlzLnNoYXBlT3B0fHwodGhpcy5zaGFwZU9wdD17fSksdGhpcy5zaGFwZU9wdC52ZXJ0aWNlcz1zLnZlcnRpY2VzKSxsPT09Uy5TdGFyJiYodC5hZGQobCksdGhpcy5zaGFwZU9wdHx8KHRoaXMuc2hhcGVPcHQ9e30pLHRoaXMuc2hhcGVPcHQudmVydGljZXM9cy52ZXJ0aWNlcyx0aGlzLnNoYXBlT3B0LmlubmVyUmF0aW89cy5pbm5lclJhdGlvLHRoaXMuc2hhcGVPcHQuaW5uZXJWZXJ0aWNlU3RlcD1zLmlubmVyVmVydGljZVN0ZXApLGw9PT1TLlRleHQmJih0aGlzLnRleHRPcHQ9cyksZS5zaXplPT09MSYmKHRoaXMudGV4dE9wdCYmKHRoaXMuY2FuVGV4dEVkaXQ9ITApLHRoaXMuY2FuUm90YXRlPW4sdGhpcy5zY2FsZVR5cGU9YSksYT09PXEubm9uZSYmKHRoaXMuc2NhbGVUeXBlPWEpLGw9PT1TLkltYWdlJiYocj1pKX10LnNpemUmJih0aGlzLnRvb2xzVHlwZXM9Wy4uLnRdKSxyJiYoZS5zaXplPT09MT8odGhpcy5jYW5Mb2NrPSEwLHIub3B0LmxvY2tlZCYmKHRoaXMuaXNMb2NrZWQ9ITAsdGhpcy5zY2FsZVR5cGU9cS5ub25lLHRoaXMuY2FuUm90YXRlPSExLHRoaXMudGV4dE9wdD12b2lkIDAsdGhpcy5maWxsQ29sb3I9dm9pZCAwLHRoaXMuc2VsZWN0b3JDb2xvcj0icmdiKDE3NywxNzcsMTc3KSIsdGhpcy5zdHJva2VDb2xvcj12b2lkIDAsdGhpcy5jYW5UZXh0RWRpdD0hMSkpOmUuc2l6ZT4xJiYhci5vcHQubG9ja2VkJiYodGhpcy5jYW5Mb2NrPSExLHRoaXMuY2FuUm90YXRlPSExKSl9Z2V0Q2hpbGRyZW5Qb2ludHMoKXt2YXIgZTtpZih0aGlzLnNjYWxlVHlwZT09PXEuYm90aCYmdGhpcy5zZWxlY3RJZHMpe2NvbnN0IHQ9dGhpcy5zZWxlY3RJZHNbMF0scj0oZT10aGlzLnZOb2Rlcy5nZXQodCkpPT1udWxsP3ZvaWQgMDplLm9wO2lmKHIpe2NvbnN0IGk9W107Zm9yKGxldCBzPTA7czxyLmxlbmd0aDtzKz0zKWkucHVzaChbcltzXSxyW3MrMV1dKTtyZXR1cm4gaX19fWNvbnN1bWUoZSl7Y29uc3R7b3A6dCx3b3JrU3RhdGU6cn09ZS5kYXRhO2xldCBpPXRoaXMub2xkU2VsZWN0UmVjdDtpZihyPT09Ri5TdGFydCYmKGk9dGhpcy5iYWNrVG9GdWxsTGF5ZXIoKSksISh0IT1udWxsJiZ0Lmxlbmd0aCl8fCF0aGlzLnZOb2Rlcy5jdXJOb2RlTWFwLnNpemUpcmV0dXJue3R5cGU6bS5Ob25lfTt0aGlzLnVwZGF0ZVRlbXBQb2ludHModCk7Y29uc3Qgcz10aGlzLmNvbXB1dFNlbGVjdG9yKCk7aWYodGhpcy5zZWxlY3RJZHMmJkVoKHRoaXMuc2VsZWN0SWRzLHMuc2VsZWN0SWRzKSlyZXR1cm57dHlwZTptLk5vbmV9O3RoaXMuc2VsZWN0SWRzPXMuc2VsZWN0SWRzO2NvbnN0IG49cy5pbnRlcnNlY3RSZWN0O3RoaXMuZ2V0U2VsZWN0ZW9ySW5mbyhzLnN1Yk5vZGVNYXApLHRoaXMuZHJhdyhFLnNlbGVjdG9ySWQsdGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLHMpLHRoaXMub2xkU2VsZWN0UmVjdD1uO2NvbnN0IGE9dGhpcy5nZXRDaGlsZHJlblBvaW50cygpO3JldHVybnt0eXBlOm0uU2VsZWN0LGRhdGFUeXBlOlcuTG9jYWwscmVjdDpBKG4saSksc2VsZWN0SWRzOnMuc2VsZWN0SWRzLG9wdDp0aGlzLndvcmtPcHRpb25zLHNlbGVjdFJlY3Q6bixzZWxlY3RvckNvbG9yOnRoaXMuc2VsZWN0b3JDb2xvcixzdHJva2VDb2xvcjp0aGlzLnN0cm9rZUNvbG9yLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcix0ZXh0T3B0OnRoaXMudGV4dE9wdCxjYW5UZXh0RWRpdDp0aGlzLmNhblRleHRFZGl0LGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjYW5Mb2NrOnRoaXMuY2FuTG9jayxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsd2lsbFN5bmNTZXJ2aWNlOiEwLHBvaW50czphLGlzTG9ja2VkOnRoaXMuaXNMb2NrZWQsdG9vbHNUeXBlczp0aGlzLnRvb2xzVHlwZXMsc2hhcGVPcHQ6dGhpcy5zaGFwZU9wdH19Y29uc3VtZUFsbChlKXt2YXIgdCxyO2lmKCEoKHQ9dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZ0Lmxlbmd0aCkmJnRoaXMudG1wUG9pbnRzWzBdJiZ0aGlzLnNlbGVjdFNpbmdsZVRvb2wodGhpcy50bXBQb2ludHNbMF0uWFksRS5zZWxlY3RvcklkLCExLGU9PW51bGw/dm9pZCAwOmUuaG92ZXJJZCksKHI9dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZyLmxlbmd0aCYmdGhpcy5zZWFsVG9EcmF3TGF5ZXIodGhpcy5zZWxlY3RJZHMpLHRoaXMub2xkU2VsZWN0UmVjdCl7Y29uc3QgaT10aGlzLmdldENoaWxkcmVuUG9pbnRzKCk7cmV0dXJue3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OnRoaXMub2xkU2VsZWN0UmVjdCxzZWxlY3RJZHM6dGhpcy5zZWxlY3RJZHMsb3B0OnRoaXMud29ya09wdGlvbnMsc2VsZWN0b3JDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3Isc2VsZWN0UmVjdDp0aGlzLm9sZFNlbGVjdFJlY3Qsc3Ryb2tlQ29sb3I6dGhpcy5zdHJva2VDb2xvcixmaWxsQ29sb3I6dGhpcy5maWxsQ29sb3IsdGV4dE9wdDp0aGlzLnRleHRPcHQsY2FuVGV4dEVkaXQ6dGhpcy5jYW5UZXh0RWRpdCxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2FuTG9jazp0aGlzLmNhbkxvY2ssc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLHdpbGxTeW5jU2VydmljZTohMCxwb2ludHM6aSxpc0xvY2tlZDp0aGlzLmlzTG9ja2VkLHRvb2xzVHlwZXM6dGhpcy50b29sc1R5cGVzLHNoYXBlT3B0OnRoaXMuc2hhcGVPcHR9fXJldHVybnt0eXBlOm0uTm9uZX19Y29uc3VtZVNlcnZpY2UoKXt9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1jbGVhclNlbGVjdERhdGEoKXt0aGlzLnNlbGVjdElkcz12b2lkIDAsdGhpcy5vbGRTZWxlY3RSZWN0PXZvaWQgMH1zZWxlY3RTaW5nbGVUb29sKGUsdD1FLnNlbGVjdG9ySWQscj0hMSxpKXtpZihlLmxlbmd0aD09PTIpe2NvbnN0IHM9ZVswXSxuPWVbMV07bGV0IGE7Zm9yKGNvbnN0IGwgb2YgdGhpcy5mdWxsTGF5ZXIuY2hpbGRyZW4pe2NvbnN0IGM9ZW8oW2xdKTtsZXQgdT0hMTtpZigoaSYmaT09PWwubmFtZXx8ITEpJiZjLmZpbmQoZD0+ZC5pc1BvaW50Q29sbGlzaW9uKHMsbikpKXthPWw7YnJlYWt9Zm9yKGNvbnN0IGQgb2YgYylpZih1PWQuaXNQb2ludENvbGxpc2lvbihzLG4pLHUpe2lmKCFhKWE9bDtlbHNle2NvbnN0IGY9dGhpcy52Tm9kZXMuZ2V0KGwubmFtZSksdz10aGlzLnZOb2Rlcy5nZXQoYS5uYW1lKTtpZigoZj09bnVsbD92b2lkIDA6Zi50b29sc1R5cGUpIT09Uy5UZXh0JiYodz09bnVsbD92b2lkIDA6dy50b29sc1R5cGUpPT09Uy5UZXh0KWJyZWFrO2lmKChmPT1udWxsP3ZvaWQgMDpmLnRvb2xzVHlwZSk9PT1TLlRleHQmJih3PT1udWxsP3ZvaWQgMDp3LnRvb2xzVHlwZSkhPT1TLlRleHQpYT1sO2Vsc2V7Y29uc3QgeT0oZj09bnVsbD92b2lkIDA6Zi5vcHQuekluZGV4KXx8MCxnPSh3PT1udWxsP3ZvaWQgMDp3Lm9wdC56SW5kZXgpfHwwO051bWJlcih5KT49TnVtYmVyKGcpJiYoYT1sKX19YnJlYWt9fWlmKGEpe2NvbnN0IGw9YS5uYW1lLGM9dGhpcy52Tm9kZXMuZ2V0KGwpO2lmKGMpe2lmKCFHcih0aGlzLm9sZFNlbGVjdFJlY3QsYy5yZWN0KSl7Y29uc3QgdT1uZXcgTWFwKFtbbCxjXV0pO3RoaXMuZ2V0U2VsZWN0ZW9ySW5mbyh1KSx0aGlzLmRyYXcodCx0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIse2ludGVyc2VjdFJlY3Q6Yy5yZWN0LHN1Yk5vZGVNYXA6dSxzZWxlY3RJZHM6dGhpcy5zZWxlY3RJZHN8fFtdfSxyKX10aGlzLnNlbGVjdElkcz1bbF0sdGhpcy5vbGRTZWxlY3RSZWN0PWMucmVjdH19fX1iYWNrVG9GdWxsTGF5ZXIoZSl7dmFyIHMsbjtsZXQgdDtjb25zdCByPVtdLGk9W107Zm9yKGNvbnN0IGEgb2YoKHM9dGhpcy5kcmF3TGF5ZXIpPT1udWxsP3ZvaWQgMDpzLmNoaWxkcmVuKXx8W10paWYoIShlIT1udWxsJiZlLmxlbmd0aCYmIWUuaW5jbHVkZXMoYS5pZCkpJiZhLmlkIT09RS5zZWxlY3RvcklkKXtjb25zdCBsPWEuY2xvbmVOb2RlKCEwKTtIZShhKSYmbC5zZWFsKCksdGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoYS5uYW1lKS5sZW5ndGh8fHIucHVzaChsKSxpLnB1c2goYSk7Y29uc3QgYz0obj10aGlzLnZOb2Rlcy5nZXQoYS5uYW1lKSk9PW51bGw/dm9pZCAwOm4ucmVjdDtjJiYodD1BKHQsYykpfXJldHVybiBpLmZvckVhY2goYT0+YS5yZW1vdmUoKSksci5sZW5ndGgmJnRoaXMuZnVsbExheWVyLmFwcGVuZCguLi5yKSx0fXNlYWxUb0RyYXdMYXllcihlKXt2YXIgaTtjb25zdCB0PVtdLHI9W107ZS5mb3JFYWNoKHM9Pnt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShzLnRvU3RyaW5nKCkpLmZvckVhY2gobj0+e3ZhciBsO2NvbnN0IGE9bi5jbG9uZU5vZGUoITApO0hlKG4pJiZhLnNlYWwoKSwobD10aGlzLmRyYXdMYXllcikhPW51bGwmJmwuZ2V0RWxlbWVudHNCeU5hbWUobi5uYW1lKS5sZW5ndGh8fHQucHVzaChhKSxyLnB1c2gobil9KX0pLHIuZm9yRWFjaChzPT5zLnJlbW92ZSgpKSx0JiYoKGk9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxpLmFwcGVuZCguLi50KSl9Z2V0U2VsZWN0b3JSZWN0KGUsdCl7dmFyIG47bGV0IHI7Y29uc3QgaT0obj1lLnBhcmVudCk9PW51bGw/dm9pZCAwOm4uZ2V0RWxlbWVudEJ5SWQodCkscz1pPT1udWxsP3ZvaWQgMDppLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybiBzJiYocj1BKHIse3g6TWF0aC5mbG9vcihzLngpLHk6TWF0aC5mbG9vcihzLnkpLHc6TWF0aC5yb3VuZChzLndpZHRoKSxoOk1hdGgucm91bmQocy5oZWlnaHQpfSkpLHJ9aXNDYW5GaWxsQ29sb3IoZSl7cmV0dXJuIGU9PT1TLkVsbGlwc2V8fGU9PT1TLlRyaWFuZ2xlfHxlPT09Uy5SZWN0YW5nbGV8fGU9PT1TLlBvbHlnb258fGU9PT1TLlN0YXJ8fGU9PT1TLlNwZWVjaEJhbGxvb259YXN5bmMgdXBkYXRlU2VsZWN0b3IoZSl7Y29uc3R7dXBkYXRlU2VsZWN0b3JPcHQ6dCxzZWxlY3RJZHM6cix2Tm9kZXM6aSx3aWxsU2VyaWFsaXplRGF0YTpzLHdvcmtlcjpuLG9mZnNldDphLHNjZW5lOmx9PWUsYz10aGlzLmRyYXdMYXllcjtpZighYylyZXR1cm47bGV0IHU7Y29uc3QgaD1uZXcgTWFwLHtib3g6ZCx3b3JrU3RhdGU6ZixhbmdsZTp3LHRyYW5zbGF0ZTp5fT10O2xldCBnPVswLDBdLFA9WzEsMV0saz1bMCwwXSxPLEk7aWYoZHx8eXx8aGUodykpe2lmKGY9PT1GLlN0YXJ0KXJldHVybiBpLnNldFRhcmdldCgpLHt0eXBlOm0uU2VsZWN0LGRhdGFUeXBlOlcuTG9jYWwsc2VsZWN0UmVjdDp0aGlzLm9sZFNlbGVjdFJlY3QscmVjdDp0aGlzLm9sZFNlbGVjdFJlY3R9O2lmKE89aS5nZXRMYXN0VGFyZ2V0KCksTyYmZCl7bGV0IEw7cj09bnVsbHx8ci5mb3JFYWNoKFQ9Pntjb25zdCBNPU89PW51bGw/dm9pZCAwOk8uZ2V0KFQpO0w9QShMLE09PW51bGw/dm9pZCAwOk0ucmVjdCl9KSxMJiYoUD1bZC53L0wudyxkLmgvTC5oXSxnPVtkLngrZC53LzItKEwueCtMLncvMiksZC55K2QuaC8yLShMLnkrTC5oLzIpXSxrPVtMLngrTC53LzIsTC55K0wuaC8yXSksST1MfX1pZihyKWZvcihjb25zdCBMIG9mIHIpe2NvbnN0IFQ9aS5nZXQoTCk7aWYoVCl7Y29uc3R7dG9vbHNUeXBlOk19PVQ7bGV0ICQ9KGM9PW51bGw/dm9pZCAwOmMuZ2V0RWxlbWVudHNCeU5hbWUoTCkpWzBdO2lmKCQpe2NvbnN0IEQ9ey4uLnR9O2xldCBIO2lmKE0pe2lmKE8mJihIPU8uZ2V0KEwpLEgmJmQpKXtELmJveFNjYWxlPVA7Y29uc3QgZWU9W0gucmVjdC54K0gucmVjdC53LzIsSC5yZWN0LnkrSC5yZWN0LmgvMl0sc2U9W2VlWzBdLWtbMF0sZWVbMV0ta1sxXV07RC5ib3hUcmFuc2xhdGU9W3NlWzBdKihQWzBdLTEpK2dbMF0rKGEmJmFbMF18fDApLHNlWzFdKihQWzFdLTEpK2dbMV0rKGEmJmFbMV18fDApXX1jb25zdCBWPVZyKE0pO2lmKFY9PW51bGx8fFYudXBkYXRlTm9kZU9wdCh7bm9kZTokLG9wdDpELHZOb2RlczppLHdpbGxTZXJpYWxpemVEYXRhOnMsdGFyZ2V0Tm9kZTpIfSksVCYmbiYmKHMmJihELmFuZ2xlfHxELnRyYW5zbGF0ZSl8fEQuYm94JiZELndvcmtTdGF0ZSE9PUYuU3RhcnR8fEQucG9pbnRNYXAmJkQucG9pbnRNYXAuaGFzKEwpfHxNPT09Uy5UZXh0JiYoRC5mb250U2l6ZXx8RC50cmFuc2xhdGV8fEQudGV4dEluZm9zJiZELnRleHRJbmZvcy5nZXQoTCkpfHxNPT09Uy5JbWFnZSYmKEQuYW5nbGV8fEQudHJhbnNsYXRlfHxELmJveFNjYWxlKXx8TT09PUQudG9vbHNUeXBlJiZELndpbGxSZWZyZXNoKSl7Y29uc3QgZWU9bi5jcmVhdGVXb3JrU2hhcGVOb2RlKHt0b29sc1R5cGU6TSx0b29sc09wdDpULm9wdH0pO2VlPT1udWxsfHxlZS5zZXRXb3JrSWQoTCk7bGV0IHNlO009PT1TLkltYWdlJiZsP3NlPWF3YWl0IGVlLmNvbnN1bWVTZXJ2aWNlQXN5bmMoe2lzRnVsbFdvcms6ITEscmVwbGFjZUlkOkwsc2NlbmU6bH0pOnNlPWVlPT1udWxsP3ZvaWQgMDplZS5jb25zdW1lU2VydmljZSh7b3A6VC5vcCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDpMLGlzQ2xlYXJBbGw6ITF9KSxzZSYmKFQucmVjdD1zZSxpLnNldEluZm8oTCxUKSksJD0oYz09bnVsbD92b2lkIDA6Yy5nZXRFbGVtZW50c0J5TmFtZShMKSlbMF19VCYmKGguc2V0KEwsVCksdT1BKHUsVC5yZWN0KSl9fX19TyYmZj09PUYuRG9uZSYmaS5kZWxldGVMYXN0VGFyZ2V0KCk7Y29uc3QgYj11O2lmKEkmJnQuZGlyJiZiKXtsZXQgTD1bMCwwXTtzd2l0Y2godC5kaXIpe2Nhc2UidG9wTGVmdCI6Y2FzZSJsZWZ0Ijp7Y29uc3QgVD1bSS54K0kudyxJLnkrSS5oXTtMPVtUWzBdLShiLngrYi53KSxUWzFdLShiLnkrYi5oKV07YnJlYWt9Y2FzZSJib3R0b21MZWZ0IjpjYXNlImJvdHRvbSI6e2NvbnN0IFQ9W0kueCtJLncsSS55XTtMPVtUWzBdLShiLngrYi53KSxUWzFdLWIueV07YnJlYWt9Y2FzZSJ0b3BSaWdodCI6Y2FzZSJ0b3AiOntjb25zdCBUPVtJLngsSS55K0kuaF07TD1bVFswXS1iLngsVFsxXS0oYi55K2IuaCldO2JyZWFrfWNhc2UicmlnaHQiOmNhc2UiYm90dG9tUmlnaHQiOntjb25zdCBUPVtJLngsSS55XTtMPVtUWzBdLWIueCxUWzFdLWIueV07YnJlYWt9fWlmKExbMF18fExbMV0pcmV0dXJuIGIueD1iLngrTFswXSxiLnk9Yi55K0xbMV0sYXdhaXQgdGhpcy51cGRhdGVTZWxlY3Rvcih7Li4uZSxvZmZzZXQ6TH0pfXRoaXMuZ2V0U2VsZWN0ZW9ySW5mbyhoKSx0aGlzLmRyYXcoRS5zZWxlY3RvcklkLGMse3NlbGVjdElkczpyfHxbXSxzdWJOb2RlTWFwOmgsaW50ZXJzZWN0UmVjdDpifSk7Y29uc3Qgdj1BKHRoaXMub2xkU2VsZWN0UmVjdCx1KTtyZXR1cm4gdGhpcy5vbGRTZWxlY3RSZWN0PXUse3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxzZWxlY3RSZWN0OmIscmVuZGVyUmVjdDp1LHJlY3Q6QSh2LGIpfX1ibHVyU2VsZWN0b3IoKXtjb25zdCBlPXRoaXMuYmFja1RvRnVsbExheWVyKCk7cmV0dXJue3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OmUsc2VsZWN0SWRzOltdLHdpbGxTeW5jU2VydmljZTohMH19Z2V0UmlnaHRTZXJ2aWNlSWQoZSl7cmV0dXJuIGUucmVwbGFjZSgiKysiLCItIil9c2VsZWN0U2VydmljZU5vZGUoZSx0LHIpe2NvbnN0e3NlbGVjdElkczppfT10LHM9dGhpcy5nZXRSaWdodFNlcnZpY2VJZChlKSxuPXRoaXMuZ2V0U2VsZWN0b3JSZWN0KHRoaXMuZnVsbExheWVyLHMpO2xldCBhO2NvbnN0IGw9bmV3IE1hcDtyZXR1cm4gaT09bnVsbHx8aS5mb3JFYWNoKGM9Pntjb25zdCB1PXRoaXMudk5vZGVzLmdldChjKSxoPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGMpWzBdO3UmJmgmJihhPUEoYSx1LnJlY3QpLGwuc2V0KGMsdSkpfSksdGhpcy5nZXRTZWxlY3Rlb3JJbmZvKGwpLHRoaXMuZHJhdyhzLHRoaXMuZnVsbExheWVyLHtpbnRlcnNlY3RSZWN0OmEsc2VsZWN0SWRzOml8fFtdLHN1Yk5vZGVNYXA6bH0sciksQShhLG4pfXJlUmVuZGVyU2VsZWN0b3IoKXt2YXIgcjtsZXQgZTtjb25zdCB0PW5ldyBNYXA7cmV0dXJuKHI9dGhpcy5zZWxlY3RJZHMpPT1udWxsfHxyLmZvckVhY2goaT0+e2NvbnN0IHM9dGhpcy52Tm9kZXMuZ2V0KGkpO3MmJihlPUEoZSxzLnJlY3QpLHQuc2V0KGkscykpfSx0aGlzKSx0aGlzLmdldFNlbGVjdGVvckluZm8odCksdGhpcy5kcmF3KEUuc2VsZWN0b3JJZCx0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIse2ludGVyc2VjdFJlY3Q6ZSxzdWJOb2RlTWFwOnQsc2VsZWN0SWRzOnRoaXMuc2VsZWN0SWRzfHxbXX0pLHRoaXMub2xkU2VsZWN0UmVjdD1lLGV9dXBkYXRlU2VsZWN0SWRzKGUpe3ZhciBuLGE7bGV0IHQ7Y29uc3Qgcj0obj10aGlzLnNlbGVjdElkcyk9PW51bGw/dm9pZCAwOm4uZmlsdGVyKGw9PiFlLmluY2x1ZGVzKGwpKSxpPWUuZmlsdGVyKGw9Pnt2YXIgYztyZXR1cm4hKChjPXRoaXMuc2VsZWN0SWRzKSE9bnVsbCYmYy5pbmNsdWRlcyhsKSl9KTtpZihyIT1udWxsJiZyLmxlbmd0aCYmKHQ9dGhpcy5iYWNrVG9GdWxsTGF5ZXIocikpLGkubGVuZ3RoKXt0aGlzLnNlYWxUb0RyYXdMYXllcihpKTtmb3IoY29uc3QgbCBvZiBpKXtjb25zdCBjPShhPXRoaXMudk5vZGVzLmdldChsKSk9PW51bGw/dm9pZCAwOmEucmVjdDtjJiYodD1BKHQsYykpfX10aGlzLnNlbGVjdElkcz1lO2NvbnN0IHM9dGhpcy5yZVJlbmRlclNlbGVjdG9yKCk7cmV0dXJue2JnUmVjdDp0LHNlbGVjdFJlY3Q6c319Y3Vyc29ySG92ZXIoZSl7dmFyIHMsbjtjb25zdCB0PXRoaXMub2xkU2VsZWN0UmVjdDt0aGlzLnNlbGVjdElkcz1bXTtjb25zdCByPShzPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6cy50b1N0cmluZygpLGk9W2VbMF0qdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0sZVsxXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXV07aWYodGhpcy5zZWxlY3RTaW5nbGVUb29sKGksciwhMCksdGhpcy5vbGRTZWxlY3RSZWN0JiYhR3IodCx0aGlzLm9sZFNlbGVjdFJlY3QpKXJldHVybnt0eXBlOm0uQ3Vyc29ySG92ZXIsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OkEodCx0aGlzLm9sZFNlbGVjdFJlY3QpLHNlbGVjdG9yQ29sb3I6dGhpcy5zZWxlY3RvckNvbG9yLHdpbGxTeW5jU2VydmljZTohMX07aWYoKG49dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZuLmxlbmd0aHx8KHRoaXMub2xkU2VsZWN0UmVjdD12b2lkIDApLHQmJiF0aGlzLm9sZFNlbGVjdFJlY3QpcmV0dXJuIHRoaXMuY3Vyc29yQmx1cigpLHt0eXBlOm0uQ3Vyc29ySG92ZXIsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OnQsc2VsZWN0b3JDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3Isd2lsbFN5bmNTZXJ2aWNlOiExfX1jdXJzb3JCbHVyKCl7dmFyIHQscjt0aGlzLnNlbGVjdElkcz1bXTtjb25zdCBlPSh0PXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6dC50b1N0cmluZygpOygocj10aGlzLmZ1bGxMYXllcik9PW51bGw/dm9pZCAwOnIucGFyZW50KS5jaGlsZHJlbi5mb3JFYWNoKGk9PntpLm5hbWU9PT1lJiZpLnJlbW92ZSgpfSl9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShFLCJzZWxlY3RvcklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ZWR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoRSwic2VsZWN0b3JCb3JkZXJJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiJzZWxlY3Rvci1ib3JkZXIifSk7Y2xhc3MgWHIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmJvdGh9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5BcnJvd30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImFycm93VGlwV2lkdGgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLmFycm93VGlwV2lkdGg9dGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MqNCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnV9KSxkPUEoaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOml9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNlbnRlclBvczp4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIFA7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cn09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoaz0+ay5yZW1vdmUoKSksKFA9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxQLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChrPT5rLnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjppLHRoaWNrbmVzczpzLHpJbmRleDpuLHNjYWxlOmEscm90YXRlOmwsdHJhbnNsYXRlOmN9PXRoaXMud29ya09wdGlvbnMsdT1yLndvcmxkUG9zaXRpb24saD1yLndvcmxkU2NhbGluZyx7cG9pbnRzOmQscmVjdDpmfT10aGlzLmNvbXB1dERyYXdQb2ludHMocykseT17cG9zOltmLngrZi53LzIsZi55K2YuaC8yXSxuYW1lOnQsaWQ6dCxjbG9zZTohMCxwb2ludHM6ZCxmaWxsQ29sb3I6aSxzdHJva2VDb2xvcjppLGxpbmVXaWR0aDowLG5vcm1hbGl6ZTohMCx6SW5kZXg6bn07YSYmKHkuc2NhbGU9YSksbCYmKHkucm90YXRlPWwpLGMmJih5LnRyYW5zbGF0ZT1jKTtjb25zdCBnPW5ldyB6LlBvbHlsaW5lKHkpO2lmKHIuYXBwZW5kKGcpLGF8fGx8fGMpe2NvbnN0IGs9Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGsueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3Ioay55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihrLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGsuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybnt4Ok1hdGguZmxvb3IoZi54KmhbMF0rdVswXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoZi55KmhbMV0rdVsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoZi53KmhbMF0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKSxoOk1hdGguZmxvb3IoZi5oKmhbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKX19Y29tcHV0RHJhd1BvaW50cyhlKXtyZXR1cm4gdGhpcy50bXBQb2ludHNbMV0uZGlzdGFuY2UodGhpcy50bXBQb2ludHNbMF0pPnRoaXMuYXJyb3dUaXBXaWR0aD90aGlzLmNvbXB1dEZ1bGxBcnJvd1BvaW50cyhlKTp0aGlzLmNvbXB1dFRyaWFuZ2xlUG9pbnRzKCl9Y29tcHV0RnVsbEFycm93UG9pbnRzKGUpe2NvbnN0IHQ9cC5TdWIodGhpcy50bXBQb2ludHNbMV0sdGhpcy50bXBQb2ludHNbMF0pLnVuaSgpLHI9cC5QZXIodCkubXVsKGUvMiksaT1SLlN1Yih0aGlzLnRtcFBvaW50c1swXSxyKSxzPVIuQWRkKHRoaXMudG1wUG9pbnRzWzBdLHIpLG49cC5NdWwodCx0aGlzLmFycm93VGlwV2lkdGgpLGE9cC5TdWIodGhpcy50bXBQb2ludHNbMV0sbiksbD1SLlN1YihhLHIpLGM9Ui5BZGQoYSxyKSx1PXAuUGVyKHQpLm11bChlKjEuNSksaD1SLlN1YihhLHUpLGQ9Ui5BZGQoYSx1KSxmPVtpLGwsaCx0aGlzLnRtcFBvaW50c1sxXSxkLGMsc107cmV0dXJue3BvaW50czpmLm1hcCh3PT5SLlN1Yih3LHRoaXMudG1wUG9pbnRzWzBdKS5YWSkuZmxhdCgxKSxyZWN0OkcoZiksaXNUcmlhbmdsZTohMSxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fWNvbXB1dFRyaWFuZ2xlUG9pbnRzKCl7Y29uc3QgZT1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSx0aGlzLnRtcFBvaW50c1swXSkudW5pKCksdD10aGlzLnRtcFBvaW50c1sxXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1swXSkscj1wLlBlcihlKS5tdWwoTWF0aC5mbG9vcih0KjMvOCkpLGk9Ui5TdWIodGhpcy50bXBQb2ludHNbMF0scikscz1SLkFkZCh0aGlzLnRtcFBvaW50c1swXSxyKSxuPVtpLHRoaXMudG1wUG9pbnRzWzFdLHNdO3JldHVybntwb2ludHM6bi5tYXAoYT0+Ui5TdWIoYSx0aGlzLnRtcFBvaW50c1swXSkuWFkpLmZsYXQoMSkscmVjdDpHKG4pLGlzVHJpYW5nbGU6ITAscG9zOnRoaXMudG1wUG9pbnRzWzBdLlhZfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscykpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGw7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnIsaXNUZW1wOml9PWUscz0obD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcylyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBjPTA7Yzx0Lmxlbmd0aDtjKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtjXSx0W2MrMV0sdFtjKzJdKSk7Y29uc3Qgbj1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixhPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6bn0pO3JldHVybiB0aGlzLm9sZFJlY3Q9YSxyJiYhaSYmdGhpcy52Tm9kZXMuc2V0SW5mbyhzLHtyZWN0OmEsb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjZW50ZXJQb3M6eC5nZXRDZW50ZXJQb3MoYSxuKX0pLGF9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXt2YXIgYTtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnN9PXIsbj1pLmdldCh0Lm5hbWUpO3JldHVybiBzJiYodC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSx0LnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixzKSwoYT1uPT1udWxsP3ZvaWQgMDpuLm9wdCkhPW51bGwmJmEuc3Ryb2tlQ29sb3ImJihuLm9wdC5zdHJva2VDb2xvcj1zKSxuJiZpLnNldEluZm8odC5uYW1lLG4pKSx4LnVwZGF0ZU5vZGVPcHQoZSl9fWNsYXNzIEhyIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5hbGx9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5FbGxpcHNlfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnUsaXNEcmF3aW5nOiEwfSksZD1BKGgsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWgse3JlY3Q6ZCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgbDtjb25zdHtkYXRhOnR9PWUscj0obD10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMuZnVsbExheWVyLHM9dGhpcy5kcmF3KHt3b3JrSWQ6cixsYXllcjppLGlzRHJhd2luZzohMX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgSTtjb25zdHt3b3JrSWQ6dCxsYXllcjpyLGlzRHJhd2luZzppfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChiPT5iLnJlbW92ZSgpKSwoST10aGlzLmRyYXdMYXllcik9PW51bGx8fEkuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdGhpY2tuZXNzOmEsekluZGV4Omwsc2NhbGU6Yyxyb3RhdGU6dSx0cmFuc2xhdGU6aH09dGhpcy53b3JrT3B0aW9ucyxkPXIud29ybGRQb3NpdGlvbixmPXIud29ybGRTY2FsaW5nLHtyYWRpdXM6dyxyZWN0OnkscG9zOmd9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhhKSxQPXtwb3M6ZyxuYW1lOnQsaWQ6dCxyYWRpdXM6dyxsaW5lV2lkdGg6YSxmaWxsQ29sb3I6biE9PSJ0cmFuc3BhcmVudCImJm58fHZvaWQgMCxzdHJva2VDb2xvcjpzLG5vcm1hbGl6ZTohMCx6SW5kZXg6bH0saz17eDpNYXRoLmZsb29yKHkueCpmWzBdK2RbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKHkueSpmWzFdK2RbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKHkudypmWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKHkuaCpmWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9O2lmKGkpe2NvbnN0e25hbWU6YixpZDp2LHpJbmRleDpMLHN0cm9rZUNvbG9yOlR9PVAsTT14LmdldENlbnRlclBvcyhrLHIpLCQ9bmV3IHouR3JvdXAoe25hbWU6YixpZDp2LHpJbmRleDpMLHBvczpNLGFuY2hvcjpbLjUsLjVdLHNpemU6W2sudyxrLmhdfSksRD1uZXcgei5FbGxpcHNlKHsuLi5QLHBvczpbMCwwXX0pLEg9bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6VCxsaW5lV2lkdGg6MSxzY2FsZTpbMS9mWzBdLDEvZlsxXV19KTtyZXR1cm4gJC5hcHBlbmQoRCxIKSxyLmFwcGVuZCgkKSxrfWMmJihQLnNjYWxlPWMpLHUmJihQLnJvdGF0ZT11KSxoJiYoUC50cmFuc2xhdGU9aCk7Y29uc3QgTz1uZXcgei5FbGxpcHNlKFApO2lmKHIuYXBwZW5kKE8pLHV8fGN8fGgpe2NvbnN0IGI9Ty5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGIueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoYi55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihiLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGIuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBrfWNvbXB1dERyYXdQb2ludHMoZSl7Y29uc3QgdD1HKHRoaXMudG1wUG9pbnRzKSxyPUcodGhpcy50bXBQb2ludHMsZSksaT1bTWF0aC5mbG9vcih0LngrdC53LzIpLE1hdGguZmxvb3IodC55K3QuaC8yKV07cmV0dXJue3JlY3Q6cixwb3M6aSxyYWRpdXM6W01hdGguZmxvb3IodC53LzIpLE1hdGguZmxvb3IodC5oLzIpXX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PWUuc2xpY2UoLTIpLHI9bmV3IFIodFswXSx0WzFdKSxpPXRoaXMudG1wUG9pbnRzWzBdLHt0aGlja25lc3M6c309dGhpcy53b3JrT3B0aW9ucztpZihpLmlzTmVhcihyLHMpKXJldHVybiExO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTIpe2lmKHIuaXNOZWFyKHRoaXMudG1wUG9pbnRzWzFdLDEpKXJldHVybiExO3RoaXMudG1wUG9pbnRzWzFdPXJ9ZWxzZSB0aGlzLnRtcFBvaW50cy5wdXNoKHIpO3JldHVybiEwfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBsO2NvbnN0e29wOnQsaXNGdWxsV29yazpyLGlzVGVtcDppfT1lLHM9KGw9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJuO3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wO2ZvcihsZXQgYz0wO2M8dC5sZW5ndGg7Yys9Myl0aGlzLnRtcFBvaW50cy5wdXNoKG5ldyBSKHRbY10sdFtjKzFdLHRbYysyXSkpO2NvbnN0IG49cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsYT10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOm4saXNEcmF3aW5nOiExfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1hLHImJiFpJiZ0aGlzLnZOb2Rlcy5zZXRJbmZvKHMse3JlY3Q6YSxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNlbnRlclBvczp4LmdldENlbnRlclBvcyhhLG4pfSksYX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBjLHU7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpufT1yLGE9aS5nZXQodC5uYW1lKTtsZXQgbD10O3JldHVybiB0LnRhZ05hbWU9PT0iR1JPVVAiJiYobD10LmNoaWxkcmVuWzBdKSxzJiYobC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSwoYz1hPT1udWxsP3ZvaWQgMDphLm9wdCkhPW51bGwmJmMuc3Ryb2tlQ29sb3ImJihhLm9wdC5zdHJva2VDb2xvcj1zKSksbiYmKG49PT0idHJhbnNwYXJlbnQiP2wuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLCJyZ2JhKDAsMCwwLDApIik6bC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsbiksKHU9YT09bnVsbD92b2lkIDA6YS5vcHQpIT1udWxsJiZ1LmZpbGxDb2xvciYmKGEub3B0LmZpbGxDb2xvcj1uKSksYSYmaS5zZXRJbmZvKHQubmFtZSxhKSx4LnVwZGF0ZU5vZGVPcHQoZSl9fXZhciBjZj1mZSx1Zj1jZSxoZj0iW29iamVjdCBCb29sZWFuXSI7ZnVuY3Rpb24gZGYobyl7cmV0dXJuIG89PT0hMHx8bz09PSExfHx1ZihvKSYmY2Yobyk9PWhmfXZhciBmZj1kZix3ZT1tZShmZik7Y2xhc3MgWXIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlJlY3RhbmdsZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jVW5pdFRpbWU9NTB9dHJhbnNmb3JtRGF0YSgpe2NvbnN0IGU9Ryh0aGlzLnRtcFBvaW50cyk7cmV0dXJuW1tlLngsZS55LDBdLFtlLngrZS53LGUueSwwXSxbZS54K2UudyxlLnkrZS5oLDBdLFtlLngsZS55K2UuaCwwXV19Y29tcHV0RHJhd1BvaW50cyhlKXtjb25zdHt0aGlja25lc3M6dH09dGhpcy53b3JrT3B0aW9ucyxyPVtdO2Zvcihjb25zdCBuIG9mIGUpci5wdXNoKG5ldyBwKC4uLm4pKTtjb25zdCBpPUcocix0KSxzPVtpLngraS53LzIsaS55K2kuaC8yXTtyZXR1cm57cmVjdDppLHBvczpzLHBvaW50czpyLm1hcChuPT5uLlhZKS5mbGF0KDEpfX1jb25zdW1lKGUpe3ZhciB3O2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPSh3PXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6dy50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3QgdT10aGlzLnRyYW5zZm9ybURhdGEoKTtpZighaSl7Y29uc3QgeT1EYXRlLm5vdygpO3JldHVybiB5LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXkse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnUuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgaD1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixkPXRoaXMuZHJhdyh7cHM6dSx3b3JrSWQ6cyxsYXllcjpoLGlzRHJhd2luZzohMH0pLGY9QShkLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1kLHtyZWN0OmYsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGM7Y29uc3R7ZGF0YTp0fT1lLHI9KGM9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpjLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLnRyYW5zZm9ybURhdGEoKSxzPXRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHtwczppLHdvcmtJZDpyLGxheWVyOnMsaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PW47Y29uc3QgYT1pLmZsYXQoMSksbD1sZShhKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0Om4sb3A6YSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLHtyZWN0Om4sdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmwsb3B0OnRoaXMud29ya09wdGlvbnMsaXNTeW5jOiEwfX1kcmF3KGUpe3ZhciBUO2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3aW5nOmkscHM6cyxyZXBsYWNlSWQ6bn09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShufHx0KS5tYXAoTT0+TS5yZW1vdmUoKSksKFQ9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxULmdldEVsZW1lbnRzQnlOYW1lKG58fHQpLm1hcChNPT5NLnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjphLGZpbGxDb2xvcjpsLHRoaWNrbmVzczpjLHpJbmRleDp1LHNjYWxlOmgscm90YXRlOmQsdHJhbnNsYXRlOmYsdGV4dE9wdDp3fT10aGlzLndvcmtPcHRpb25zLHk9ci53b3JsZFBvc2l0aW9uLGc9ci53b3JsZFNjYWxpbmcse3BvaW50czpQLHJlY3Q6ayxwb3M6T309dGhpcy5jb21wdXREcmF3UG9pbnRzKHMpLEk9e2Nsb3NlOiEwLG5vcm1hbGl6ZTohMCxwb2ludHM6UCxsaW5lV2lkdGg6YyxmaWxsQ29sb3I6bCE9PSJ0cmFuc3BhcmVudCImJmx8fHZvaWQgMCxzdHJva2VDb2xvcjphLGxpbmVKb2luOiJyb3VuZCJ9LGI9e3g6TWF0aC5mbG9vcihrLngqZ1swXSt5WzBdLXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihrLnkqZ1sxXSt5WzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihrLncqZ1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcihrLmgqZ1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfSx2PW5ldyB6Lkdyb3VwKHtuYW1lOnQsaWQ6dCx6SW5kZXg6dSxwb3M6TyxhbmNob3I6Wy41LC41XSxzaXplOltrLncsay5oXSxzY2FsZTpoLHJvdGF0ZTpkLHRyYW5zbGF0ZTpmfSksTD1uZXcgei5Qb2x5bGluZSh7Li4uSSxwb3M6WzAsMF19KTtpZih2LmFwcGVuZENoaWxkKEwpLGkpe2NvbnN0IE09bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6YSxsaW5lV2lkdGg6MSxzY2FsZTpbMS9nWzBdLDEvZ1sxXV19KTt2LmFwcGVuZENoaWxkKE0pfWlmKHIuYXBwZW5kKHYpLGh8fGR8fGYpe2NvbnN0IE09di5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKE0ueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoTS55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihNLndpZHRoKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKE0uaGVpZ2h0KzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9fXJldHVybiBifXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYztjb25zdHtvcDp0LGlzRnVsbFdvcms6cixyZXBsYWNlSWQ6aX09ZSxzPShjPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6Yy50b1N0cmluZygpO2lmKCFzKXJldHVybjtjb25zdCBuPVtdO2ZvcihsZXQgdT0wO3U8dC5sZW5ndGg7dSs9MyluLnB1c2goW3RbdV0sdFt1KzFdLHRbdSsyXV0pO2NvbnN0IGE9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsbD10aGlzLmRyYXcoe3BzOm4sd29ya0lkOnMsbGF5ZXI6YSxpc0RyYXdpbmc6ITEscmVwbGFjZUlkOml9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWwsdGhpcy52Tm9kZXMuc2V0SW5mbyhzLHtyZWN0Omwsb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6bCYmeC5nZXRDZW50ZXJQb3MobCxhKX0pLGx9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXt2YXIgZyxQO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bixmb250Q29sb3I6YSxmb250QmdDb2xvcjpsLGJvbGQ6YyxpdGFsaWM6dSxsaW5lVGhyb3VnaDpoLHVuZGVybGluZTpkLGZvbnRTaXplOmZ9PXIsdz1pLmdldCh0Lm5hbWUpO2xldCB5PXQ7aWYodC50YWdOYW1lPT09IkdST1VQIiYmKHk9dC5jaGlsZHJlblswXSkscyYmKHkuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksKGc9dz09bnVsbD92b2lkIDA6dy5vcHQpIT1udWxsJiZnLnN0cm9rZUNvbG9yJiYody5vcHQuc3Ryb2tlQ29sb3I9cykpLG4mJihuPT09InRyYW5zcGFyZW50Ij95LnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIiwicmdiYSgwLDAsMCwwKSIpOnkuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLG4pLChQPXc9PW51bGw/dm9pZCAwOncub3B0KSE9bnVsbCYmUC5maWxsQ29sb3ImJih3Lm9wdC5maWxsQ29sb3I9bikpLHchPW51bGwmJncub3B0LnRleHRPcHQpe2NvbnN0IGs9dy5vcHQudGV4dE9wdDthJiZrLmZvbnRDb2xvciYmKGsuZm9udENvbG9yPWEpLGwmJmsuZm9udEJnQ29sb3ImJihrLmZvbnRCZ0NvbG9yPWwpLGMmJihrLmJvbGQ9YyksdSYmKGsuaXRhbGljPXUpLHdlKGgpJiYoay5saW5lVGhyb3VnaD1oKSx3ZShkKSYmKGsudW5kZXJsaW5lPWQpLGYmJihrLmZvbnRTaXplPWYpfXJldHVybiB3JiZpLnNldEluZm8odC5uYW1lLHcpLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgcXIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlN0YXJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dSxpc0RyYXdpbmc6ITB9KSxkPUEoaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOmksaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PXM7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5tYXAoYz0+Wy4uLmMuWFksMF0pLmZsYXQoMSksYT1sZShuKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0OnMsb3A6bixvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6cyYmeC5nZXRDZW50ZXJQb3MocyxpKX0pLHtyZWN0OnMsdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmEsaXNTeW5jOiEwLG9wdDp0aGlzLndvcmtPcHRpb25zfX1kcmF3KGUpe3ZhciBMO2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3aW5nOml9PWU7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKFQ9PlQucmVtb3ZlKCkpLChMPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8TC5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoVD0+VC5yZW1vdmUoKSk7Y29uc3R7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0aGlja25lc3M6YSx6SW5kZXg6bCx2ZXJ0aWNlczpjLGlubmVyVmVydGljZVN0ZXA6dSxpbm5lclJhdGlvOmgsc2NhbGU6ZCxyb3RhdGU6Zix0cmFuc2xhdGU6d309dGhpcy53b3JrT3B0aW9ucyx5PXIud29ybGRQb3NpdGlvbixnPXIud29ybGRTY2FsaW5nLHtyZWN0OlAscG9zOmsscG9pbnRzOk99PXRoaXMuY29tcHV0RHJhd1BvaW50cyhhLGMsdSxoKSxJPXtwb3M6ayxjbG9zZTohMCxuYW1lOnQsaWQ6dCxwb2ludHM6TyxsaW5lV2lkdGg6YSxmaWxsQ29sb3I6biE9PSJ0cmFuc3BhcmVudCImJm58fHZvaWQgMCxzdHJva2VDb2xvcjpzLGNsYXNzTmFtZTpgJHtrWzBdfSwke2tbMV19YCxub3JtYWxpemU6ITAsekluZGV4OmwsbGluZUpvaW46InJvdW5kIn0sYj17eDpNYXRoLmZsb29yKFAueCpnWzBdK3lbMF0teC5TYWZlQm9yZGVyUGFkZGluZypnWzBdKSx5Ok1hdGguZmxvb3IoUC55KmdbMV0reVsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKmdbMV0pLHc6TWF0aC5mbG9vcihQLncqZ1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqZ1swXSksaDpNYXRoLmZsb29yKFAuaCpnWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypnWzFdKX07aWYoaSl7Y29uc3R7bmFtZTpULGlkOk0sekluZGV4OiQsc3Ryb2tlQ29sb3I6RH09SSxIPVsoYi54K2Iudy8yLXlbMF0pL2dbMF0sKGIueStiLmgvMi15WzFdKS9nWzFdXSxWPW5ldyB6Lkdyb3VwKHtuYW1lOlQsaWQ6TSx6SW5kZXg6JCxwb3M6SCxhbmNob3I6Wy41LC41XSxzaXplOltiLncsYi5oXX0pLGVlPW5ldyB6LlBvbHlsaW5lKHsuLi5JLHBvczpbMCwwXX0pLHNlPW5ldyB6LlBhdGgoe2Q6Ik0tNCwwSDRNMCwtNFY0Iixub3JtYWxpemU6ITAscG9zOlswLDBdLHN0cm9rZUNvbG9yOkQsbGluZVdpZHRoOjEsc2NhbGU6WzEvZ1swXSwxL2dbMV1dfSk7cmV0dXJuIFYuYXBwZW5kKGVlLHNlKSxyLmFwcGVuZChWKSxifWQmJihJLnNjYWxlPWQpLGYmJihJLnJvdGF0ZT1mKSx3JiYoSS50cmFuc2xhdGU9dyk7Y29uc3Qgdj1uZXcgei5Qb2x5bGluZShJKTtpZihyLmFwcGVuZCh2KSxkfHxmfHx3KXtjb25zdCBUPXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcihULngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKFQueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoVC53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihULmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm4gYn1jb21wdXREcmF3UG9pbnRzKGUsdCxyLGkpe2NvbnN0IHM9Ryh0aGlzLnRtcFBvaW50cyksbj1bTWF0aC5mbG9vcihzLngrcy53LzIpLE1hdGguZmxvb3Iocy55K3MuaC8yKV0sYT14cihzLncscy5oKSxsPU1hdGguZmxvb3IoTWF0aC5taW4ocy53LHMuaCkvMiksYz1pKmwsdT1bXSxoPTIqTWF0aC5QSS90O2ZvcihsZXQgZj0wO2Y8dDtmKyspe2NvbnN0IHc9ZipoLS41Kk1hdGguUEk7bGV0IHksZztmJXI9PT0xPyh5PWMqYVswXSpNYXRoLmNvcyh3KSxnPWMqYVsxXSpNYXRoLnNpbih3KSk6KHk9bCphWzBdKk1hdGguY29zKHcpLGc9bCphWzFdKk1hdGguc2luKHcpLHUucHVzaCh5LGcpKSx1LnB1c2goeSxnKX1yZXR1cm57cmVjdDpHKHRoaXMudG1wUG9pbnRzLGUpLHBvczpuLHBvaW50czp1fX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscyl8fFIuU3ViKGkscikuWFkuaW5jbHVkZXMoMCkpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PW4sdGhpcy52Tm9kZXMuc2V0SW5mbyhpLHtyZWN0Om4sb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLG59Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdG9vbHNUeXBlOmEsdmVydGljZXM6bCxpbm5lclZlcnRpY2VTdGVwOmMsaW5uZXJSYXRpbzp1fT1yLGg9aS5nZXQodC5uYW1lKSxkPWg9PW51bGw/dm9pZCAwOmgub3B0O2xldCBmPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihmPXQuY2hpbGRyZW5bMF0pLHMmJihmLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLGQhPW51bGwmJmQuc3Ryb2tlQ29sb3ImJihkLnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/Zi5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpmLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSxkIT1udWxsJiZkLmZpbGxDb2xvciYmKGQuZmlsbENvbG9yPW4pKSxhPT09Uy5TdGFyJiYobCYmKGQudmVydGljZXM9bCksYyYmKGQuaW5uZXJWZXJ0aWNlU3RlcD1jKSx1JiYoZC5pbm5lclJhdGlvPXUpKSxoJiZpLnNldEluZm8odC5uYW1lLHsuLi5oLG9wdDpkfSkseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBaciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuUG9seWdvbn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jVW5pdFRpbWU9NTB9Y29uc3VtZShlKXt2YXIgZjtjb25zdHtkYXRhOnQsaXNGdWxsV29yazpyLGlzU3ViV29ya2VyOml9PWUscz0oZj10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmYudG9TdHJpbmcoKTtpZighcylyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e29wOm4sd29ya1N0YXRlOmF9PXQsbD1uPT1udWxsP3ZvaWQgMDpuLmxlbmd0aDtpZighbHx8bDwyKXJldHVybnt0eXBlOm0uTm9uZX07bGV0IGM7aWYoYT09PUYuU3RhcnQ/KHRoaXMudG1wUG9pbnRzPVtuZXcgUihuWzBdLG5bMV0pXSxjPSExKTpjPXRoaXMudXBkYXRlVGVtcFBvaW50cyhuKSwhYylyZXR1cm57dHlwZTptLk5vbmV9O2lmKCFpKXtjb25zdCB3PURhdGUubm93KCk7cmV0dXJuIHctdGhpcy5zeW5jVGltZXN0YW1wPnRoaXMuc3luY1VuaXRUaW1lPyh0aGlzLnN5bmNUaW1lc3RhbXA9dyx7dHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnMsb3A6dGhpcy50bXBQb2ludHMubWFwKHk9PlsuLi55LlhZLDBdKS5mbGF0KDEpLGlzU3luYzohMCxpbmRleDowfSk6e3R5cGU6bS5Ob25lfX1jb25zdCB1PXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGg9dGhpcy5kcmF3KHt3b3JrSWQ6cyxsYXllcjp1LGlzRHJhd2luZzohMH0pLGQ9QShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aSxpc0RyYXdpbmc6ITF9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIGI7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdpbmc6aX09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAodj0+di5yZW1vdmUoKSksKGI9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxiLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh2PT52LnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLHRoaWNrbmVzczphLHpJbmRleDpsLHZlcnRpY2VzOmMsc2NhbGU6dSxyb3RhdGU6aCx0cmFuc2xhdGU6ZH09dGhpcy53b3JrT3B0aW9ucyxmPXIud29ybGRQb3NpdGlvbix3PXIud29ybGRTY2FsaW5nLHtyZWN0OnkscG9zOmcscG9pbnRzOlB9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhhLGMpLGs9e3BvczpnLGNsb3NlOiEwLG5hbWU6dCxpZDp0LHBvaW50czpQLGxpbmVXaWR0aDphLGZpbGxDb2xvcjpuIT09InRyYW5zcGFyZW50IiYmbnx8dm9pZCAwLHN0cm9rZUNvbG9yOnMsbm9ybWFsaXplOiEwLHpJbmRleDpsLGxpbmVKb2luOiJyb3VuZCJ9LE89e3g6TWF0aC5mbG9vcih5Lngqd1swXStmWzBdLXguU2FmZUJvcmRlclBhZGRpbmcqd1swXSkseTpNYXRoLmZsb29yKHkueSp3WzFdK2ZbMV0teC5TYWZlQm9yZGVyUGFkZGluZyp3WzFdKSx3Ok1hdGguZmxvb3IoeS53KndbMF0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKndbMF0pLGg6TWF0aC5mbG9vcih5Lmgqd1sxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqd1sxXSl9O2lmKGkpe2NvbnN0e25hbWU6dixpZDpMLHpJbmRleDpULHN0cm9rZUNvbG9yOk19PWssJD1bKE8ueCtPLncvMi1mWzBdKS93WzBdLChPLnkrTy5oLzItZlsxXSkvd1sxXV0sRD1uZXcgei5Hcm91cCh7bmFtZTp2LGlkOkwsekluZGV4OlQscG9zOiQsYW5jaG9yOlsuNSwuNV0sc2l6ZTpbTy53LE8uaF19KSxIPW5ldyB6LlBvbHlsaW5lKHsuLi5rLHBvczpbMCwwXX0pLFY9bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6TSxsaW5lV2lkdGg6MSxzY2FsZTpbMS93WzBdLDEvd1sxXV19KTtyZXR1cm4gRC5hcHBlbmQoSCxWKSxyLmFwcGVuZChEKSxPfXUmJihrLnNjYWxlPXUpLGgmJihrLnJvdGF0ZT1oKSxkJiYoay50cmFuc2xhdGU9ZCk7Y29uc3QgST1uZXcgei5Qb2x5bGluZShrKTtpZihyLmFwcGVuZChJKSx1fHxofHxkKXtjb25zdCB2PUkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcih2LngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKHYueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3Iodi53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcih2LmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm4gT31jb21wdXREcmF3UG9pbnRzKGUsdCl7Y29uc3Qgcj1HKHRoaXMudG1wUG9pbnRzKSxpPVtNYXRoLmZsb29yKHIueCtyLncvMiksTWF0aC5mbG9vcihyLnkrci5oLzIpXSxzPXhyKHIudyxyLmgpLG49TWF0aC5mbG9vcihNYXRoLm1pbihyLncsci5oKS8yKSxhPVtdLGw9MipNYXRoLlBJL3Q7Zm9yKGxldCB1PTA7dTx0O3UrKyl7Y29uc3QgaD11KmwtLjUqTWF0aC5QSSxkPW4qc1swXSpNYXRoLmNvcyhoKSxmPW4qc1sxXSpNYXRoLnNpbihoKTthLnB1c2goZCxmKX1yZXR1cm57cmVjdDpHKHRoaXMudG1wUG9pbnRzLGUpLHBvczppLHBvaW50czphfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscyl8fFIuU3ViKGkscikuWFkuaW5jbHVkZXMoMCkpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PW4sdGhpcy52Tm9kZXMuc2V0SW5mbyhpLHtyZWN0Om4sb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLG59Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdG9vbHNUeXBlOmEsdmVydGljZXM6bH09cixjPWkuZ2V0KHQubmFtZSksdT1jPT1udWxsP3ZvaWQgMDpjLm9wdDtsZXQgaD10O3JldHVybiB0LnRhZ05hbWU9PT0iR1JPVVAiJiYoaD10LmNoaWxkcmVuWzBdKSxzJiYoaC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSx1IT1udWxsJiZ1LnN0cm9rZUNvbG9yJiYodS5zdHJva2VDb2xvcj1zKSksbiYmKG49PT0idHJhbnNwYXJlbnQiP2guc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLCJyZ2JhKDAsMCwwLDApIik6aC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsbiksdSE9bnVsbCYmdS5maWxsQ29sb3ImJih1LmZpbGxDb2xvcj1uKSksYT09PVMuUG9seWdvbiYmbCYmKHUudmVydGljZXM9bCksYyYmaS5zZXRJbmZvKHQubmFtZSx7Li4uYyxvcHQ6dX0pLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgYWV7c3RhdGljIGJlemllcihlLHQpe2NvbnN0IHI9W107Zm9yKGxldCBpPTA7aTx0Lmxlbmd0aDtpKz00KXtjb25zdCBzPXRbaV0sbj10W2krMV0sYT10W2krMl0sbD10W2krM107cyYmbiYmYSYmbD9yLnB1c2goLi4uYWUuZ2V0QmV6aWVyUG9pbnRzKGUscyxuLGEsbCkpOnMmJm4mJmE/ci5wdXNoKC4uLmFlLmdldEJlemllclBvaW50cyhlLHMsbixhKSk6cyYmbj9yLnB1c2goLi4uYWUuZ2V0QmV6aWVyUG9pbnRzKGUscyxuKSk6cyYmci5wdXNoKHMpfXJldHVybiByfXN0YXRpYyBnZXRCZXppZXJQb2ludHMoZT0xMCx0LHIsaSxzKXtsZXQgbj1udWxsO2NvbnN0IGE9W107IWkmJiFzP249YWUub25lQmV6aWVyOmkmJiFzP249YWUudHdvQmV6aWVyOmkmJnMmJihuPWFlLnRocmVlQmV6aWVyKTtmb3IobGV0IGw9MDtsPGU7bCsrKW4mJmEucHVzaChuKGwvZSx0LHIsaSxzKSk7cmV0dXJuIHM/YS5wdXNoKHMpOmkmJmEucHVzaChpKSxhfXN0YXRpYyBvbmVCZXppZXIoZSx0LHIpe2NvbnN0IGk9dC54KyhyLngtdC54KSplLHM9dC55KyhyLnktdC55KSplO3JldHVybiBuZXcgcChpLHMpfXN0YXRpYyB0d29CZXppZXIoZSx0LHIsaSl7Y29uc3Qgcz0oMS1lKSooMS1lKSp0LngrMiplKigxLWUpKnIueCtlKmUqaS54LG49KDEtZSkqKDEtZSkqdC55KzIqZSooMS1lKSpyLnkrZSplKmkueTtyZXR1cm4gbmV3IHAocyxuKX1zdGF0aWMgdGhyZWVCZXppZXIoZSx0LHIsaSxzKXtjb25zdCBuPXQueCooMS1lKSooMS1lKSooMS1lKSszKnIueCplKigxLWUpKigxLWUpKzMqaS54KmUqZSooMS1lKStzLngqZSplKmUsYT10LnkqKDEtZSkqKDEtZSkqKDEtZSkrMypyLnkqZSooMS1lKSooMS1lKSszKmkueSplKmUqKDEtZSkrcy55KmUqZSplO3JldHVybiBuZXcgcChuLGEpfX1jbGFzcyBRciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuU3BlZWNoQmFsbG9vbn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJyYXRpbyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOi44fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnUsaXNEcmF3aW5nOiEwfSksZD1BKGgsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWgse3JlY3Q6ZCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgbDtjb25zdHtkYXRhOnR9PWUscj0obD10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMuZnVsbExheWVyLHM9dGhpcy5kcmF3KHt3b3JrSWQ6cixsYXllcjppLGlzRHJhd2luZzohMX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgSTtjb25zdHt3b3JrSWQ6dCxsYXllcjpyfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChiPT5iLnJlbW92ZSgpKSwoST10aGlzLmRyYXdMYXllcik9PW51bGx8fEkuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmksZmlsbENvbG9yOnMsdGhpY2tuZXNzOm4sekluZGV4OmEscGxhY2VtZW50Omwsc2NhbGU6Yyxyb3RhdGU6dSx0cmFuc2xhdGU6aH09dGhpcy53b3JrT3B0aW9ucyxkPXIud29ybGRQb3NpdGlvbixmPXIud29ybGRTY2FsaW5nLHtyZWN0OncscG9zOnkscG9pbnRzOmd9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhuLGwpLFA9e3Bvczp5LG5hbWU6dCxpZDp0LHBvaW50czpnLm1hcChiPT5iLlhZKSxsaW5lV2lkdGg6bixmaWxsQ29sb3I6cyE9PSJ0cmFuc3BhcmVudCImJnN8fHZvaWQgMCxzdHJva2VDb2xvcjppLG5vcm1hbGl6ZTohMCxjbGFzc05hbWU6YCR7eVswXX0sJHt5WzFdfWAsekluZGV4OmEsbGluZUpvaW46InJvdW5kIixjbG9zZTohMH0saz17eDpNYXRoLmZsb29yKHcueCpmWzBdK2RbMF0teC5TYWZlQm9yZGVyUGFkZGluZypmWzBdKSx5Ok1hdGguZmxvb3Iody55KmZbMV0rZFsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKmZbMV0pLHc6TWF0aC5mbG9vcih3LncqZlswXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqZlswXSksaDpNYXRoLmZsb29yKHcuaCpmWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypmWzFdKX07YyYmKFAuc2NhbGU9YyksdSYmKFAucm90YXRlPXUpLGgmJihQLnRyYW5zbGF0ZT1oKTtjb25zdCBPPW5ldyB6LlBvbHlsaW5lKFApO2lmKHIuYXBwZW5kKE8pLGN8fHV8fGgpe2NvbnN0IGI9Ty5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGIueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoYi55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihiLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGIuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBrfXRyYW5zZm9ybUNvbnRyb2xQb2ludHMoZSl7Y29uc3QgdD1HKHRoaXMudG1wUG9pbnRzKTtzd2l0Y2goZSl7Y2FzZSJib3R0b20iOmNhc2UiYm90dG9tTGVmdCI6Y2FzZSJib3R0b21SaWdodCI6e2NvbnN0IHI9dC55K3QuaCp0aGlzLnJhdGlvO3JldHVybltuZXcgcCh0LngsdC55LDApLG5ldyBwKHQueCt0LncsdC55LDApLG5ldyBwKHQueCt0LncsciwwKSxuZXcgcCh0LngsciwwKV19Y2FzZSJ0b3AiOmNhc2UidG9wTGVmdCI6Y2FzZSJ0b3BSaWdodCI6e2NvbnN0IHI9dC55K3QuaCooMS10aGlzLnJhdGlvKTtyZXR1cm5bbmV3IHAodC54LHIsMCksbmV3IHAodC54K3QudyxyLDApLG5ldyBwKHQueCt0LncsdC55K3QuaCwwKSxuZXcgcCh0LngsdC55K3QuaCwwKV19Y2FzZSJsZWZ0IjpjYXNlImxlZnRCb3R0b20iOmNhc2UibGVmdFRvcCI6e2NvbnN0IHI9dC54K3QudyooMS10aGlzLnJhdGlvKTtyZXR1cm5bbmV3IHAocix0LnksMCksbmV3IHAodC54K3Qudyx0LnksMCksbmV3IHAodC54K3Qudyx0LnkrdC5oLDApLG5ldyBwKHIsdC55K3QuaCwwKV19Y2FzZSJyaWdodCI6Y2FzZSJyaWdodEJvdHRvbSI6Y2FzZSJyaWdodFRvcCI6e2NvbnN0IHI9dC54K3Qudyp0aGlzLnJhdGlvO3JldHVybltuZXcgcCh0LngsdC55LDApLG5ldyBwKHIsdC55LDApLG5ldyBwKHIsdC55K3QuaCwwKSxuZXcgcCh0LngsdC55K3QuaCwwKV19fX1jb21wdXREcmF3UG9pbnRzKGUsdCl7Y29uc3Qgcj1HKHRoaXMudG1wUG9pbnRzKSxpPXRoaXMudHJhbnNmb3JtQ29udHJvbFBvaW50cyh0KSxzPU1hdGguZmxvb3Ioci53Ki4xKSxuPU1hdGguZmxvb3Ioci5oKi4xKSxhPVtdLGw9cC5BZGQoaVswXSxuZXcgcCgwLG4sMCkpLGM9cC5BZGQoaVswXSxuZXcgcChzLDAsMCkpLHU9YWUuZ2V0QmV6aWVyUG9pbnRzKDEwLGwsaVswXSxjKSxoPXAuU3ViKGlbMV0sbmV3IHAocywwLDApKSxkPXAuQWRkKGlbMV0sbmV3IHAoMCxuLDApKSxmPWFlLmdldEJlemllclBvaW50cygxMCxoLGlbMV0sZCksdz1wLlN1YihpWzJdLG5ldyBwKDAsbiwwKSkseT1wLlN1YihpWzJdLG5ldyBwKHMsMCwwKSksZz1hZS5nZXRCZXppZXJQb2ludHMoMTAsdyxpWzJdLHkpLFA9cC5BZGQoaVszXSxuZXcgcChzLDAsMCkpLGs9cC5TdWIoaVszXSxuZXcgcCgwLG4sMCkpLE89YWUuZ2V0QmV6aWVyUG9pbnRzKDEwLFAsaVszXSxrKSxJPXMqKDEtdGhpcy5yYXRpbykqMTAsYj1uKigxLXRoaXMucmF0aW8pKjEwO3N3aXRjaCh0KXtjYXNlImJvdHRvbSI6e2NvbnN0IFQ9cC5TdWIoaVsyXSxuZXcgcChzKjUtSS8yLDAsMCkpLE09cC5TdWIoaVsyXSxuZXcgcChzKjUsLWIsMCkpLCQ9cC5TdWIoaVsyXSxuZXcgcChzKjUrSS8yLDAsMCkpO2EucHVzaChNLCQsLi4uTywuLi51LC4uLmYsLi4uZyxUKTticmVha31jYXNlImJvdHRvbVJpZ2h0Ijp7Y29uc3QgVD1wLlN1YihpWzJdLG5ldyBwKHMqMS4xLDAsMCkpLE09cC5TdWIoaVsyXSxuZXcgcChzKjEuMStJLzIsLWIsMCkpLCQ9cC5TdWIoaVsyXSxuZXcgcChzKjEuMStJLDAsMCkpO2EucHVzaChNLCQsLi4uTywuLi51LC4uLmYsLi4uZyxUKTticmVha31jYXNlImJvdHRvbUxlZnQiOntjb25zdCBUPXAuQWRkKGlbM10sbmV3IHAocyoxLjErSSwwLDApKSxNPXAuQWRkKGlbM10sbmV3IHAocyoxLjErSS8yLGIsMCkpLCQ9cC5BZGQoaVszXSxuZXcgcChzKjEuMSwwLDApKTthLnB1c2goTSwkLC4uLk8sLi4udSwuLi5mLC4uLmcsVCk7YnJlYWt9Y2FzZSJ0b3AiOntjb25zdCBUPXAuU3ViKGlbMV0sbmV3IHAocyo1LUkvMiwwLDApKSxNPXAuU3ViKGlbMV0sbmV3IHAocyo1LGIsMCkpLCQ9cC5TdWIoaVsxXSxuZXcgcChzKjUrSS8yLDAsMCkpO2EucHVzaChNLFQsLi4uZiwuLi5nLC4uLk8sLi4udSwkKTticmVha31jYXNlInRvcFJpZ2h0Ijp7Y29uc3QgVD1wLlN1YihpWzFdLG5ldyBwKHMqMS4xLDAsMCkpLE09cC5TdWIoaVsxXSxuZXcgcChzKjEuMStJLzIsYiwwKSksJD1wLlN1YihpWzFdLG5ldyBwKHMqMS4xK0ksMCwwKSk7YS5wdXNoKE0sVCwuLi5mLC4uLmcsLi4uTywuLi51LCQpO2JyZWFrfWNhc2UidG9wTGVmdCI6e2NvbnN0IFQ9cC5BZGQoaVswXSxuZXcgcChzKjEuMStJLDAsMCkpLE09cC5BZGQoaVswXSxuZXcgcChzKjEuMStJLzIsLWIsMCkpLCQ9cC5BZGQoaVswXSxuZXcgcChzKjEuMSwwLDApKTthLnB1c2goTSxULC4uLmYsLi4uZywuLi5PLC4uLnUsJCk7YnJlYWt9Y2FzZSJsZWZ0Ijp7Y29uc3QgVD1wLkFkZChpWzBdLG5ldyBwKDAsbio1LWIvMiwwKSksTT1wLkFkZChpWzBdLG5ldyBwKC1JLG4qNSwwKSksJD1wLkFkZChpWzBdLG5ldyBwKDAsbio1K2IvMiwwKSk7YS5wdXNoKE0sVCwuLi51LC4uLmYsLi4uZywuLi5PLCQpO2JyZWFrfWNhc2UibGVmdFRvcCI6e2NvbnN0IFQ9cC5BZGQoaVswXSxuZXcgcCgwLG4qMS4xLDApKSxNPXAuQWRkKGlbMF0sbmV3IHAoLUksbioxLjErYi8yLDApKSwkPXAuQWRkKGlbMF0sbmV3IHAoMCxuKjEuMStiLDApKTthLnB1c2goTSxULC4uLnUsLi4uZiwuLi5nLC4uLk8sJCk7YnJlYWt9Y2FzZSJsZWZ0Qm90dG9tIjp7Y29uc3QgVD1wLlN1YihpWzNdLG5ldyBwKDAsbioxLjErYiwwKSksTT1wLlN1YihpWzNdLG5ldyBwKEksbioxLjErYi8yLDApKSwkPXAuU3ViKGlbM10sbmV3IHAoMCxuKjEuMSwwKSk7YS5wdXNoKE0sVCwuLi51LC4uLmYsLi4uZywuLi5PLCQpO2JyZWFrfWNhc2UicmlnaHQiOntjb25zdCBUPXAuQWRkKGlbMV0sbmV3IHAoMCxuKjUtYi8yLDApKSxNPXAuQWRkKGlbMV0sbmV3IHAoSSxuKjUsMCkpLCQ9cC5BZGQoaVsxXSxuZXcgcCgwLG4qNStiLzIsMCkpO2EucHVzaChNLCQsLi4uZywuLi5PLC4uLnUsLi4uZixUKTticmVha31jYXNlInJpZ2h0VG9wIjp7Y29uc3QgVD1wLkFkZChpWzFdLG5ldyBwKDAsbioxLjEsMCkpLE09cC5BZGQoaVsxXSxuZXcgcChJLG4qMS4xK2IvMiwwKSksJD1wLkFkZChpWzFdLG5ldyBwKDAsbioxLjErYiwwKSk7YS5wdXNoKE0sJCwuLi5nLC4uLk8sLi4udSwuLi5mLFQpO2JyZWFrfWNhc2UicmlnaHRCb3R0b20iOntjb25zdCBUPXAuU3ViKGlbMl0sbmV3IHAoMCxuKjEuMStiLDApKSxNPXAuU3ViKGlbMl0sbmV3IHAoLUksbioxLjErYi8yLDApKSwkPXAuU3ViKGlbMl0sbmV3IHAoMCxuKjEuMSwwKSk7YS5wdXNoKE0sJCwuLi5nLC4uLk8sLi4udSwuLi5mLFQpO2JyZWFrfX1jb25zdCB2PUcodGhpcy50bXBQb2ludHMsZSksTD1bTWF0aC5mbG9vcih2Lngrdi53LzIpLE1hdGguZmxvb3Iodi55K3YuaC8yKV07cmV0dXJue3JlY3Q6dixwb3M6TCxwb2ludHM6YX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PWUuc2xpY2UoLTIpLHI9bmV3IFIodFswXSx0WzFdKSxpPXRoaXMudG1wUG9pbnRzWzBdLHt0aGlja25lc3M6c309dGhpcy53b3JrT3B0aW9ucztpZihpLmlzTmVhcihyLHMpfHxSLlN1YihpLHIpLlhZLmluY2x1ZGVzKDApKXJldHVybiExO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTIpe2lmKHIuaXNOZWFyKHRoaXMudG1wUG9pbnRzWzFdLDEpKXJldHVybiExO3RoaXMudG1wUG9pbnRzWzFdPXJ9ZWxzZSB0aGlzLnRtcFBvaW50cy5wdXNoKHIpO3JldHVybiEwfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBhO2NvbnN0e29wOnQsaXNGdWxsV29yazpyfT1lLGk9KGE9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDphLnRvU3RyaW5nKCk7aWYoIWkpcmV0dXJuO3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wO2ZvcihsZXQgbD0wO2w8dC5sZW5ndGg7bCs9Myl0aGlzLnRtcFBvaW50cy5wdXNoKG5ldyBSKHRbbF0sdFtsKzFdLHRbbCsyXSkpO2NvbnN0IHM9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsbj10aGlzLmRyYXcoe3dvcmtJZDppLGxheWVyOnMsaXNEcmF3aW5nOiExfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1uLHRoaXMudk5vZGVzLnNldEluZm8oaSx7cmVjdDpuLG9wOnQsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOm4mJnguZ2V0Q2VudGVyUG9zKG4scyl9KSxufWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLHRvb2xzVHlwZTphLHBsYWNlbWVudDpsfT1yLGM9aS5nZXQodC5uYW1lKSx1PWM9PW51bGw/dm9pZCAwOmMub3B0O2xldCBoPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihoPXQuY2hpbGRyZW5bMF0pLHMmJihoLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHUhPW51bGwmJnUuc3Ryb2tlQ29sb3ImJih1LnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/aC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpoLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSx1IT1udWxsJiZ1LmZpbGxDb2xvciYmKHUuZmlsbENvbG9yPW4pKSxhPT09Uy5TcGVlY2hCYWxsb29uJiZsJiYodS5wbGFjZW1lbnQ9bCksYyYmaS5zZXRJbmZvKHQubmFtZSx7Li4uYyxvcHQ6dX0pLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgSnIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkltYWdlfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zY2FsZVR5cGU9dGhpcy53b3JrT3B0aW9ucy51bmlmb3JtU2NhbGU/cS5wcm9wb3J0aW9uYWw6cS5hbGx9Y29uc3VtZSgpe3JldHVybnt0eXBlOm0uTm9uZX19Y29uc3VtZUFsbCgpe3JldHVybnt0eXBlOm0uTm9uZX19ZHJhdyhlKXt2YXIgaztjb25zdHtsYXllcjp0LHdvcmtJZDpyLHJlcGxhY2VJZDppLGltYWdlQml0bWFwOnN9PWUse2NlbnRlclg6bixjZW50ZXJZOmEsd2lkdGg6bCxoZWlnaHQ6YyxzY2FsZTp1LHJvdGF0ZTpoLHRyYW5zbGF0ZTpkLHpJbmRleDpmfT10aGlzLndvcmtPcHRpb25zO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGl8fHIpLm1hcChPPT5PLnJlbW92ZSgpKSwoaz10aGlzLmRyYXdMYXllcik9PW51bGx8fGsuZ2V0RWxlbWVudHNCeU5hbWUoaXx8cikubWFwKE89Pk8ucmVtb3ZlKCkpO2NvbnN0IHc9e2FuY2hvcjpbLjUsLjVdLHBvczpbbixhXSxuYW1lOnIsc2l6ZTpbbCxjXSx6SW5kZXg6Zn07aWYodSlpZih0aGlzLnNjYWxlVHlwZT09PXEucHJvcG9ydGlvbmFsKXtjb25zdCBPPU1hdGgubWluKHVbMF0sdVsxXSk7dy5zY2FsZT1bTyxPXX1lbHNlIHcuc2NhbGU9dTtkJiYody50cmFuc2xhdGU9ZCksaCYmKHcucm90YXRlPWgpO2NvbnN0IHk9bmV3IHouR3JvdXAodyksZz1uZXcgei5TcHJpdGUoe2FuY2hvcjpbLjUsLjVdLHBvczpbMCwwXSxzaXplOltsLGNdLHRleHR1cmU6cyxyb3RhdGU6MTgwfSk7eS5hcHBlbmQoZyksdC5hcHBlbmQoeSk7Y29uc3QgUD15LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2lmKFApcmV0dXJue3g6TWF0aC5mbG9vcihQLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKFAueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoUC53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihQLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1jb25zdW1lU2VydmljZSgpe31hc3luYyBjb25zdW1lU2VydmljZUFzeW5jKGUpe3ZhciBjLHU7Y29uc3R7aXNGdWxsV29yazp0LHJlcGxhY2VJZDpyLHNjZW5lOml9PWUse3NyYzpzLHV1aWQ6bn09dGhpcy53b3JrT3B0aW9ucyxhPSgoYz10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmMudG9TdHJpbmcoKSl8fG4sbD10P3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcjtpZihzKXtjb25zdCBoPWF3YWl0IGkucHJlbG9hZCh7aWQ6bixzcmM6dGhpcy53b3JrT3B0aW9ucy5zcmN9KSxkPXRoaXMuZHJhdyh7d29ya0lkOmEsbGF5ZXI6bCxyZXBsYWNlSWQ6cixpbWFnZUJpdG1hcDpoWzBdfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1hJiYoKHU9dGhpcy52Tm9kZXMuZ2V0KGEpKT09bnVsbD92b2lkIDA6dS5yZWN0KXx8dm9pZCAwLHRoaXMudk5vZGVzLnNldEluZm8oYSx7cmVjdDpkLG9wOltdLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpkJiZ4LmdldENlbnRlclBvcyhkLGwpfSksZH19Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOmksdGFyZ2V0Tm9kZTpzfT1lLHt0cmFuc2xhdGU6bixib3g6YSxib3hTY2FsZTpsLGJveFRyYW5zbGF0ZTpjLGFuZ2xlOnUsaXNMb2NrZWQ6aCx6SW5kZXg6ZH09cixmPXMmJnJlKHMpfHxpLmdldCh0Lm5hbWUpO2lmKCFmKXJldHVybjtjb25zdCB3PXQucGFyZW50O2lmKHcpe2lmKGhlKGQpJiYodC5zZXRBdHRyaWJ1dGUoInpJbmRleCIsZCksZi5vcHQuekluZGV4PWQpLHdlKGgpJiYoZi5vcHQubG9ja2VkPWgpLGEmJmMmJmwpe2NvbnN0e2NlbnRlclg6eSxjZW50ZXJZOmcsd2lkdGg6UCxoZWlnaHQ6ayx1bmlmb3JtU2NhbGU6T309Zi5vcHQ7aWYoTyl7Y29uc3Qgdj1NYXRoLm1pbihsWzBdLGxbMV0pO2Yub3B0LnNjYWxlPVt2LHZdfWVsc2UgZi5vcHQuc2NhbGU9bDtmLm9wdC53aWR0aD1NYXRoLmZsb29yKFAqbFswXSksZi5vcHQuaGVpZ2h0PU1hdGguZmxvb3IoaypsWzFdKTtjb25zdCBJPVtjWzBdL3cud29ybGRTY2FsaW5nWzBdLGNbMV0vdy53b3JsZFNjYWxpbmdbMV1dO2Yub3B0LmNlbnRlclg9eStJWzBdLGYub3B0LmNlbnRlclk9ZytJWzFdO2NvbnN0IGI9W2YuY2VudGVyUG9zWzBdK0lbMF0sZi5jZW50ZXJQb3NbMV0rSVsxXV07aWYoZi5jZW50ZXJQb3M9YixzKXtsZXQgdj1JcihmLnJlY3QsbCk7dj1DZSh2LEkpLGYucmVjdD12fX1lbHNlIGlmKG4pe2NvbnN0IHk9W25bMF0vdy53b3JsZFNjYWxpbmdbMF0sblsxXS93LndvcmxkU2NhbGluZ1sxXV07aWYoZi5vcHQuY2VudGVyWD1mLm9wdC5jZW50ZXJYK3lbMF0sZi5vcHQuY2VudGVyWT1mLm9wdC5jZW50ZXJZK3lbMV0sZi5jZW50ZXJQb3M9W2YuY2VudGVyUG9zWzBdK3lbMF0sZi5jZW50ZXJQb3NbMV0reVsxXV0scyl7Y29uc3QgZz1DZShmLnJlY3QseSk7Zi5yZWN0PWd9fWVsc2UgaWYoaGUodSkmJih0LnNldEF0dHJpYnV0ZSgicm90YXRlIix1KSxmLm9wdC5yb3RhdGU9dSxzKSl7Y29uc3QgeT1UcihmLnJlY3QsdSk7Zi5yZWN0PXl9cmV0dXJuIGYmJmkuc2V0SW5mbyh0Lm5hbWUsZiksZj09bnVsbD92b2lkIDA6Zi5yZWN0fX19Y2xhc3MgS3IgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmJvdGh9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5TdHJhaWdodH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN0cmFpZ2h0VGlwV2lkdGgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN0cmFpZ2h0VGlwV2lkdGg9dGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MvMix0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnV9KSxkPUEoaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOml9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIGs7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cn09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoTz0+Ty5yZW1vdmUoKSksKGs9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxrLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChPPT5PLnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjppLHRoaWNrbmVzczpzLHpJbmRleDpuLHNjYWxlOmEscm90YXRlOmwsdHJhbnNsYXRlOmN9PXRoaXMud29ya09wdGlvbnMsdT1yLndvcmxkUG9zaXRpb24saD1yLndvcmxkU2NhbGluZyx7ZCxyZWN0OmZ9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhzKSx3PVtmLngrZi53LzIsZi55K2YuaC8yXSx5PXtwb3M6dyxuYW1lOnQsaWQ6dCxkLGZpbGxDb2xvcjppLHN0cm9rZUNvbG9yOmksbGluZVdpZHRoOjAsY2xhc3NOYW1lOmAke3dbMF19LCR7d1sxXX1gLG5vcm1hbGl6ZTohMCx6SW5kZXg6bn07YSYmKHkuc2NhbGU9YSksbCYmKHkucm90YXRlPWwpLGMmJih5LnRyYW5zbGF0ZT1jKTtjb25zdCBnPW5ldyB6LlBhdGgoeSk7aWYoci5hcHBlbmQoZyksbHx8YXx8Yyl7Y29uc3QgTz1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoTy54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihPLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKE8ud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoTy5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJue3g6TWF0aC5mbG9vcihmLngqaFswXSt1WzBdLXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihmLnkqaFsxXSt1WzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihmLncqaFswXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcihmLmgqaFsxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfX1jb21wdXREcmF3UG9pbnRzKGUpe3JldHVybiB0aGlzLnRtcFBvaW50c1sxXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1swXSk+dGhpcy5zdHJhaWdodFRpcFdpZHRoP3RoaXMuY29tcHV0RnVsbFBvaW50cyhlKTp0aGlzLmNvbXB1dERvdFBvaW50cyhlKX1jb21wdXRGdWxsUG9pbnRzKGUpe2NvbnN0IHQ9cC5TdWIodGhpcy50bXBQb2ludHNbMV0sdGhpcy50bXBQb2ludHNbMF0pLnVuaSgpLHI9cC5QZXIodCkubXVsKGUvMiksaT1SLlN1Yih0aGlzLnRtcFBvaW50c1swXSxyKSxzPVIuQWRkKHRoaXMudG1wUG9pbnRzWzBdLHIpLG49Ui5TdWIodGhpcy50bXBQb2ludHNbMV0sciksYT1SLkFkZCh0aGlzLnRtcFBvaW50c1sxXSxyKSxsPVIuR2V0U2VtaWNpcmNsZVN0cm9rZSh0aGlzLnRtcFBvaW50c1sxXSxuLC0xLDgpLGM9Ui5HZXRTZW1pY2lyY2xlU3Ryb2tlKHRoaXMudG1wUG9pbnRzWzBdLHMsLTEsOCksdT1baSxuLC4uLmwsYSxzLC4uLmNdO3JldHVybntkOnhlKHUsITApLHJlY3Q6Ryh1KSxpc0RvdDohMSxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fWNvbXB1dERvdFBvaW50cyhlKXtjb25zdCB0PVIuR2V0RG90U3Ryb2tlKHRoaXMudG1wUG9pbnRzWzBdLGUvMiw4KTtyZXR1cm57ZDp4ZSh0LCEwKSxyZWN0OkcodCksaXNEb3Q6ITAscG9zOnRoaXMudG1wUG9pbnRzWzBdLlhZfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscykpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6c30pO3JldHVybiB0aGlzLm9sZFJlY3Q9bix0aGlzLnZOb2Rlcy5zZXRJbmZvKGkse3JlY3Q6bixvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSksbn1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBhO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6c309cixuPWkuZ2V0KHQubmFtZSk7cmV0dXJuIHMmJih0LnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHQuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLHMpLChhPW49PW51bGw/dm9pZCAwOm4ub3B0KSE9bnVsbCYmYS5zdHJva2VDb2xvciYmKG4ub3B0LnN0cm9rZUNvbG9yPXMpKSxuJiZpLnNldEluZm8odC5uYW1lLG4pLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgTmUgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlRleHR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdH1jb25zdW1lKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1jb25zdW1lQWxsKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1kcmF3KGUpe3ZhciB3O2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3TGFiZWw6aX09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoeT0+eS5yZW1vdmUoKSksKHc9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHx3LmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh5PT55LnJlbW92ZSgpKTtjb25zdHtib3hTaXplOnMsYm94UG9pbnQ6bix6SW5kZXg6YX09dGhpcy53b3JrT3B0aW9ucyxsPXIud29ybGRQb3NpdGlvbixjPXIud29ybGRTY2FsaW5nO2lmKCFufHwhcylyZXR1cm47Y29uc3QgdT1uZXcgei5Hcm91cCh7bmFtZTp0LGlkOnQscG9zOltuWzBdK3NbMF0vMixuWzFdK3NbMV0vMl0sYW5jaG9yOlsuNSwuNV0sc2l6ZTpzLHpJbmRleDphfSksaD17eDpuWzBdLHk6blsxXSx3OnNbMF0saDpzWzFdfSxkPW5ldyB6LlJlY3Qoe25vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc2l6ZTpzfSksZj1pJiZOZS5jcmVhdGVMYWJlbHModGhpcy53b3JrT3B0aW9ucyxyKXx8W107cmV0dXJuIHUuYXBwZW5kKC4uLmYsZCksci5hcHBlbmQodSkse3g6TWF0aC5mbG9vcihoLngqY1swXStsWzBdKSx5Ok1hdGguZmxvb3IoaC55KmNbMV0rbFsxXSksdzpNYXRoLmZsb29yKGgudypjWzBdKSxoOk1hdGguZmxvb3IoaC5oKmNbMV0pfX1jb25zdW1lU2VydmljZShlKXt2YXIgbCxjO2NvbnN0IHQ9KGw9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXQpcmV0dXJuO2NvbnN0e2lzRnVsbFdvcms6cixyZXBsYWNlSWQ6aSxpc0RyYXdMYWJlbDpzfT1lO3RoaXMub2xkUmVjdD1pJiYoKGM9dGhpcy52Tm9kZXMuZ2V0KGkpKT09bnVsbD92b2lkIDA6Yy5yZWN0KXx8dm9pZCAwO2NvbnN0IG49cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsYT10aGlzLmRyYXcoe3dvcmtJZDp0LGxheWVyOm4saXNEcmF3TGFiZWw6c30pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHQse3JlY3Q6YSxvcDpbXSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6YSYmeC5nZXRDZW50ZXJQb3MoYSxuKX0pLGF9dXBkYXRhT3B0U2VydmljZShlKXtpZighdGhpcy53b3JrSWQpcmV0dXJuO2NvbnN0IHQ9dGhpcy53b3JrSWQudG9TdHJpbmcoKSx7Zm9udENvbG9yOnIsZm9udEJnQ29sb3I6aSxib2xkOnMsaXRhbGljOm4sbGluZVRocm91Z2g6YSx1bmRlcmxpbmU6bCx6SW5kZXg6Y309ZSx1PXRoaXMudk5vZGVzLmdldCh0KTtpZighdSlyZXR1cm47ciYmKHUub3B0LmZvbnRDb2xvcj1yKSxpJiYodS5vcHQuZm9udEJnQ29sb3I9aSkscyYmKHUub3B0LmJvbGQ9cyksbiYmKHUub3B0Lml0YWxpYz1uKSx3ZShhKSYmKHUub3B0LmxpbmVUaHJvdWdoPWEpLHdlKGwpJiYodS5vcHQudW5kZXJsaW5lPWwpLGkmJih1Lm9wdC5mb250QmdDb2xvcj1pKSxoZShjKSYmKHUub3B0LnpJbmRleD1jKSx0aGlzLm9sZFJlY3Q9dS5yZWN0O2NvbnN0IGg9dGhpcy5kcmF3KHt3b3JrSWQ6dCxsYXllcjp0aGlzLmZ1bGxMYXllcixpc0RyYXdMYWJlbDohMX0pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHQse3JlY3Q6aCxvcDpbXSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6aCYmeC5nZXRDZW50ZXJQb3MoaCx0aGlzLmZ1bGxMYXllcil9KSxofWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIGdldEZvbnRXaWR0aChlKXtjb25zdHtjdHg6dCxvcHQ6cix0ZXh0Oml9PWUse2JvbGQ6cyxpdGFsaWM6bixmb250U2l6ZTphLGZvbnRGYW1pbHk6bH09cjtyZXR1cm4gdC5mb250PWAke3N9ICR7bn0gJHthfXB4ICR7bH1gLHQubWVhc3VyZVRleHQoaSkud2lkdGh9c3RhdGljIGNyZWF0ZUxhYmVscyhlLHQpe2NvbnN0IHI9W10saT1lLnRleHQuc3BsaXQoIiwiKSxzPWkubGVuZ3RoO2ZvcihsZXQgbj0wO248cztuKyspe2NvbnN0IGE9aVtuXSx7Zm9udFNpemU6bCxsaW5lSGVpZ2h0OmMsYm9sZDp1LHRleHRBbGlnbjpoLGl0YWxpYzpkLGJveFNpemU6Zixmb250RmFtaWx5OncsdmVydGljYWxBbGlnbjp5LGZvbnRDb2xvcjpnLHVuZGVybGluZTpQLGxpbmVUaHJvdWdoOmt9PWUsTz1jfHxsKjEuMixJPXQmJnQucGFyZW50LmNhbnZhcy5nZXRDb250ZXh0KCIyZCIpLGI9SSYmTmUuZ2V0Rm9udFdpZHRoKHt0ZXh0OmEsb3B0OmUsY3R4Okksd29ybGRTY2FsaW5nOnQud29ybGRTY2FsaW5nfSk7aWYoYil7Y29uc3Qgdj17YW5jaG9yOlswLC41XSx0ZXh0OmEsZm9udFNpemU6bCxsaW5lSGVpZ2h0Ok8sZm9udEZhbWlseTp3LGZvbnRXZWlnaHQ6dSxmaWxsQ29sb3I6Zyx0ZXh0QWxpZ246aCxmb250U3R5bGU6ZCxuYW1lOm4udG9TdHJpbmcoKSxjbGFzc05hbWU6ImxhYmVsIn0sTD1bMCwwXTtpZih5PT09Im1pZGRsZSIpe2NvbnN0IE09KHMtMSkvMjtMWzFdPShuLU0pKk99aD09PSJsZWZ0IiYmKExbMF09ZiYmLWZbMF0vMis1fHwwKSx2LnBvcz1MO2NvbnN0IFQ9bmV3IHouTGFiZWwodik7aWYoci5wdXNoKFQpLFApe2NvbnN0IE09e25vcm1hbGl6ZTohMSxwb3M6W3YucG9zWzBdLHYucG9zWzFdK2wvMl0sbGluZVdpZHRoOjIqdC53b3JsZFNjYWxpbmdbMF0scG9pbnRzOlswLDAsYiwwXSxzdHJva2VDb2xvcjpnLG5hbWU6YCR7bn1fdW5kZXJsaW5lYCxjbGFzc05hbWU6InVuZGVybGluZSJ9LCQ9bmV3IHouUG9seWxpbmUoTSk7ci5wdXNoKCQpfWlmKGspe2NvbnN0IE09e25vcm1hbGl6ZTohMSxwb3M6di5wb3MsbGluZVdpZHRoOjIqdC53b3JsZFNjYWxpbmdbMF0scG9pbnRzOlswLDAsYiwwXSxzdHJva2VDb2xvcjpnLG5hbWU6YCR7bn1fbGluZVRocm91Z2hgLGNsYXNzTmFtZToibGluZVRocm91Z2gifSwkPW5ldyB6LlBvbHlsaW5lKE0pO3IucHVzaCgkKX19fXJldHVybiByfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aSx0YXJnZXROb2RlOnN9PWUse2ZvbnRCZ0NvbG9yOm4sZm9udENvbG9yOmEsdHJhbnNsYXRlOmwsYm94OmMsYm94U2NhbGU6dSxib3hUcmFuc2xhdGU6aCxib2xkOmQsaXRhbGljOmYsbGluZVRocm91Z2g6dyx1bmRlcmxpbmU6eSxmb250U2l6ZTpnLHRleHRJbmZvczpQfT1yLGs9cyYmcmUocyl8fGkuZ2V0KHQubmFtZSk7aWYoIWspcmV0dXJuO2NvbnN0IE89dC5wYXJlbnQ7aWYoIU8pcmV0dXJuO2NvbnN0IEk9ay5vcHQ7aWYoYSYmSS5mb250Q29sb3ImJihJLmZvbnRDb2xvcj1hKSxuJiZJLmZvbnRCZ0NvbG9yJiYoSS5mb250QmdDb2xvcj1uKSxkJiYoSS5ib2xkPWQpLGYmJihJLml0YWxpYz1mKSx3ZSh3KSYmKEkubGluZVRocm91Z2g9dyksd2UoeSkmJihJLnVuZGVybGluZT15KSxnJiYoSS5mb250U2l6ZT1nKSxjJiZoJiZ1KXtjb25zdCBiPVA9PW51bGw/dm9pZCAwOlAuZ2V0KHQubmFtZSk7aWYoYil7Y29uc3R7Zm9udFNpemU6VCxib3hTaXplOk19PWI7SS5ib3hTaXplPU18fEkuYm94U2l6ZSxJLmZvbnRTaXplPVR8fEkuZm9udFNpemV9Y29uc3Qgdj1rLnJlY3QsTD1DZShJcih2LHUpLGgpO0kuYm94UG9pbnQ9TCYmWyhMLngtTy53b3JsZFBvc2l0aW9uWzBdKS9PLndvcmxkU2NhbGluZ1swXSwoTC55LU8ud29ybGRQb3NpdGlvblsxXSkvTy53b3JsZFNjYWxpbmdbMV1dfWVsc2UgaWYobCYmSS5ib3hQb2ludCl7Y29uc3QgYj1bbFswXS9PLndvcmxkU2NhbGluZ1swXSxsWzFdL08ud29ybGRTY2FsaW5nWzFdXTtJLmJveFBvaW50PVtJLmJveFBvaW50WzBdK2JbMF0sSS5ib3hQb2ludFsxXStiWzFdXSxrLmNlbnRlclBvcz1bay5jZW50ZXJQb3NbMF0rYlswXSxrLmNlbnRlclBvc1sxXStiWzFdXSxrLnJlY3Q9Q2Uoay5yZWN0LGIpfXJldHVybiBrJiZpLnNldEluZm8odC5uYW1lLGspLGs9PW51bGw/dm9pZCAwOmsucmVjdH1zdGF0aWMgZ2V0UmVjdEZyb21MYXllcihlLHQpe2NvbnN0IHI9ZS5nZXRFbGVtZW50c0J5TmFtZSh0KVswXTtpZihyKXtjb25zdCBpPXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcihpLngpLHk6TWF0aC5mbG9vcihpLnkpLHc6TWF0aC5mbG9vcihpLndpZHRoKSxoOk1hdGguZmxvb3IoaS5oZWlnaHQpfX19fWZ1bmN0aW9uIFZyKG8pe3N3aXRjaChvKXtjYXNlIFMuQXJyb3c6cmV0dXJuIFhyO2Nhc2UgUy5QZW5jaWw6cmV0dXJuIENyO2Nhc2UgUy5TdHJhaWdodDpyZXR1cm4gS3I7Y2FzZSBTLkVsbGlwc2U6cmV0dXJuIEhyO2Nhc2UgUy5Qb2x5Z29uOmNhc2UgUy5UcmlhbmdsZTpyZXR1cm4gWnI7Y2FzZSBTLlN0YXI6Y2FzZSBTLlJob21idXM6cmV0dXJuIHFyO2Nhc2UgUy5SZWN0YW5nbGU6cmV0dXJuIFlyO2Nhc2UgUy5TcGVlY2hCYWxsb29uOnJldHVybiBRcjtjYXNlIFMuVGV4dDpyZXR1cm4gTmU7Y2FzZSBTLkxhc2VyUGVuOnJldHVybiBOcjtjYXNlIFMuRXJhc2VyOnJldHVybiBuZTtjYXNlIFMuU2VsZWN0b3I6cmV0dXJuIEU7Y2FzZSBTLkltYWdlOnJldHVybiBKcn19ZnVuY3Rpb24gYnQobyxlKXtjb25zdHt0b29sc1R5cGU6dCwuLi5yfT1vO3N3aXRjaCh0KXtjYXNlIFMuQXJyb3c6cmV0dXJuIG5ldyBYcihyKTtjYXNlIFMuUGVuY2lsOnJldHVybiBuZXcgQ3Iocik7Y2FzZSBTLlN0cmFpZ2h0OnJldHVybiBuZXcgS3Iocik7Y2FzZSBTLkVsbGlwc2U6cmV0dXJuIG5ldyBIcihyKTtjYXNlIFMuUG9seWdvbjpjYXNlIFMuVHJpYW5nbGU6cmV0dXJuIG5ldyBacihyKTtjYXNlIFMuU3RhcjpjYXNlIFMuUmhvbWJ1czpyZXR1cm4gbmV3IHFyKHIpO2Nhc2UgUy5SZWN0YW5nbGU6cmV0dXJuIG5ldyBZcihyKTtjYXNlIFMuU3BlZWNoQmFsbG9vbjpyZXR1cm4gbmV3IFFyKHIpO2Nhc2UgUy5UZXh0OnJldHVybiBuZXcgTmUocik7Y2FzZSBTLkxhc2VyUGVuOnJldHVybiBuZXcgTnIocik7Y2FzZSBTLkVyYXNlcjpyZXR1cm4gbmV3IG5lKHIsZSk7Y2FzZSBTLlNlbGVjdG9yOnJldHVybiBuZXcgRShyKTtjYXNlIFMuSW1hZ2U6cmV0dXJuIG5ldyBKcihyKTtkZWZhdWx0OnJldHVybn19ZnVuY3Rpb24gZW8obyl7Y29uc3QgZT1bXSx0PVsiUEFUSCIsIlNQUklURSIsIlBPTFlMSU5FIiwiUkVDVCIsIkVMTElQU0UiXTtmb3IoY29uc3QgciBvZiBvKXtpZihyLnRhZ05hbWU9PT0iR1JPVVAiJiZyLmNoaWxkcmVuLmxlbmd0aClyZXR1cm4gZW8oci5jaGlsZHJlbik7ci50YWdOYW1lJiZ0LmluY2x1ZGVzKHIudGFnTmFtZSkmJmUucHVzaChyKX1yZXR1cm4gZX1jbGFzcyBwZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuWkluZGV4QWN0aXZlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOml9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLCEwfWNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYSxsLGMsdSxoO2NvbnN0e3dvcmtJZDp0LGlzQWN0aXZlWkluZGV4OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppfT1lO2lmKHQhPT1FLnNlbGVjdG9ySWQpcmV0dXJuO2NvbnN0IHM9KGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLndvcmtTaGFwZXMuZ2V0KEUuc2VsZWN0b3JJZCk7aWYoIXMpcmV0dXJuO2NvbnN0IG49cy5vbGRTZWxlY3RSZWN0O2lmKHImJm4mJnRoaXMubG9jYWxXb3JrKXtjb25zdCBkPW5ldyBTZXQ7aWYodGhpcy5sb2NhbFdvcmsudk5vZGVzLmN1ck5vZGVNYXAuZm9yRWFjaCgoZix3KT0+e1BlKG4sZi5yZWN0KSYmZC5hZGQodyl9KSxkLnNpemUpe2NvbnN0IGY9W107ZC5mb3JFYWNoKHc9Pnt2YXIgeTsoeT10aGlzLmxvY2FsV29yayk9PW51bGx8fHkuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHcpLmZvckVhY2goZz0+e3ZhciBrLE87Y29uc3QgUD1nLmNsb25lTm9kZSghMCk7SGUoZykmJlAuc2VhbCgpLChPPShrPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6ay5kcmF3TGF5ZXIpIT1udWxsJiZPLmdldEVsZW1lbnRzQnlOYW1lKHcpLmxlbmd0aHx8Zi5wdXNoKFApfSl9KSxmLmxlbmd0aCYmKChsPXRoaXMubG9jYWxXb3JrLmRyYXdMYXllcik9PW51bGx8fGwuYXBwZW5kKC4uLmYpKX19ZWxzZSh1PShjPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6Yy5kcmF3TGF5ZXIpPT1udWxsfHx1LmNoaWxkcmVuLmZpbHRlcihkPT57dmFyIGY7cmV0dXJuISgoZj1zLnNlbGVjdElkcykhPW51bGwmJmYuaW5jbHVkZXMoZC5uYW1lKSl9KS5mb3JFYWNoKGQ9PmQucmVtb3ZlKCkpO2kmJigoaD10aGlzLmxvY2FsV29yayk9PW51bGx8fGguX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6bixkcmF3Q2FudmFzOk4uU2VsZWN0b3IsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcixpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMubG9jYWxXb3JrLnZpZXdJZH1dLHNwOlt7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsb3B0OnMuZ2V0V29ya09wdGlvbnMoKSxzZWxlY3RSZWN0Om4sc3Ryb2tlQ29sb3I6cy5zdHJva2VDb2xvcixmaWxsQ29sb3I6cy5maWxsQ29sb3Isd2lsbFN5bmNTZXJ2aWNlOiExLGlzU3luYzohMH1dfSkpfX1jbGFzcyB5ZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuQ29weU5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5GdWxsV29yayYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIHI7Y29uc3R7d29ya0lkOnR9PWU7dCYmYXdhaXQoKHI9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpyLmNvbnN1bWVGdWxsKGUsdGhpcy5zY2VuZSkpfX1jbGFzcyB3ZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2V0Q29sb3JOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bix0ZXh0VXBkYXRlRm9yV29rZXI6YSxjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOml9PWUse3dpbGxTeW5jU2VydmljZTpzLGlzU3luYzpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT10LGw9ci5yZW5kZXJ8fFtdLGM9ci5zcHx8W107aWYocylmb3IoY29uc3RbdSxoXW9mIGkuZW50cmllcygpKWEmJmgudG9vbHNUeXBlPT09Uy5UZXh0P2MucHVzaCh7Li4uaCx3b3JrSWQ6dSx0eXBlOm0uVGV4dFVwZGF0ZSxkYXRhVHlwZTpXLkxvY2FsLHdpbGxTeW5jU2VydmljZTohMH0pOmMucHVzaCh7Li4uaCx3b3JrSWQ6dSx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpufSk7cmV0dXJue3JlbmRlcjpsLHNwOmN9fX1jbGFzcyBtZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuWkluZGV4Tm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGE7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpufT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChhPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6YS51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOml9PWUse3dpbGxTeW5jU2VydmljZTpzLGlzU3luYzpufT10LGE9ci5yZW5kZXJ8fFtdLGw9ci5zcHx8W107aWYocyYmbClmb3IoY29uc3RbYyx1XW9mIGkuZW50cmllcygpKWwucHVzaCh7Li4udSx3b3JrSWQ6Yyx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpufSk7cmV0dXJue3JlbmRlcjphLHNwOmx9fX1jbGFzcyBnZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuVHJhbnNsYXRlTm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKS5maW5hbGx5KCgpPT57cyYmc2V0VGltZW91dCgoKT0+e3ZhciBuOyhuPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8bi5fcG9zdCh7c3A6W3t0eXBlOm0uTm9uZSx1bmRvVGlja2VySWQ6c31dfSl9LDApfSksITB9YXN5bmMgY29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBjLHU7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphLGVtaXRFdmVudFR5cGU6bH09ZTt0PT09RS5zZWxlY3RvcklkJiZyJiYoci53b3JrU3RhdGU9PT1GLkRvbmUmJihyIT1udWxsJiZyLnRyYW5zbGF0ZSkmJihyLnRyYW5zbGF0ZVswXXx8ci50cmFuc2xhdGVbMV0pfHxyLndvcmtTdGF0ZSE9PUYuRG9uZT9hd2FpdCgoYz10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmMudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4saXNTeW5jOiEwLHRleHRVcGRhdGVGb3JXb2tlcjphLGVtaXRFdmVudFR5cGU6bCxzY2VuZTp0aGlzLnNjZW5lLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKTpyLndvcmtTdGF0ZT09PUYuRG9uZSYmKCh1PXRoaXMubG9jYWxXb3JrKT09bnVsbHx8dS52Tm9kZXMuZGVsZXRlTGFzdFRhcmdldCgpKSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOmksd29ya1NoYXBlTm9kZTpzLHJlczpufT1lLHt3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCx1cGRhdGVTZWxlY3Rvck9wdDpjLHdpbGxTZXJpYWxpemVEYXRhOnUsdGV4dFVwZGF0ZUZvcldva2VyOmh9PXQsZD1jLndvcmtTdGF0ZSxmPXIucmVuZGVyfHxbXSx3PXIuc3B8fFtdO2lmKGQ9PT1GLlN0YXJ0KXJldHVybntzcDpbXSxyZW5kZXI6W119O2NvbnN0IHk9bj09bnVsbD92b2lkIDA6bi5zZWxlY3RSZWN0O2lmKGEpe2lmKHUpe2NvbnN0IGc9cy5nZXRDaGlsZHJlblBvaW50cygpO2cmJncucHVzaCh7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsc2VsZWN0UmVjdDp5LHdpbGxTeW5jU2VydmljZTohMSxpc1N5bmM6bCxwb2ludHM6Z30pfWZvcihjb25zdFtnLFBdb2YgaS5lbnRyaWVzKCkpaCYmUC50b29sc1R5cGU9PT1TLlRleHQ/dy5wdXNoKHsuLi5QLHdvcmtJZDpnLHR5cGU6bS5UZXh0VXBkYXRlLGRhdGFUeXBlOlcuTG9jYWwsd2lsbFN5bmNTZXJ2aWNlOiEwfSk6dy5wdXNoKHsuLi5QLHdvcmtJZDpnLHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOmx9KX1yZXR1cm57cmVuZGVyOmYsc3A6d319fWNsYXNzIGJmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5EZWxldGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOml9PWU7aWYodD09PW0uUmVtb3ZlTm9kZSl7aWYocj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLCEwO2lmKHI9PT1XLlNlcnZpY2UmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvclNlcnZpY2VXb3JrZXIoZSksITB9fWNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXtpZighdGhpcy5sb2NhbFdvcmspcmV0dXJuO2NvbnN0e3JlbW92ZUlkczp0LHdpbGxSZWZyZXNoOnIsd2lsbFN5bmNTZXJ2aWNlOmksdmlld0lkOnN9PWU7aWYoISh0IT1udWxsJiZ0Lmxlbmd0aCkpcmV0dXJuO2xldCBuO2NvbnN0IGE9W10sbD1bXSxjPVtdO2Zvcihjb25zdCB1IG9mIHQpe2lmKHU9PT1FLnNlbGVjdG9ySWQpe2NvbnN0IGQ9dGhpcy5sb2NhbFdvcmsud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighZClyZXR1cm47Y29uc3QgZj1kLnNlbGVjdElkcyYmWy4uLmQuc2VsZWN0SWRzXXx8W107Zm9yKGNvbnN0IHkgb2YgZil7aWYodGhpcy5sb2NhbFdvcmsudk5vZGVzLmdldCh5KSl7Y29uc3QgUD10aGlzLmNvbW1hbmREZWxldGVUZXh0KHkpO1AmJmEucHVzaChQKX1uPUEobix0aGlzLmxvY2FsV29yay5yZW1vdmVOb2RlKHkpKSxjLnB1c2goeSl9Y29uc3Qgdz1kPT1udWxsP3ZvaWQgMDpkLnVwZGF0ZVNlbGVjdElkcyhbXSk7bj1BKG4sdy5iZ1JlY3QpLHRoaXMubG9jYWxXb3JrLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKEUuc2VsZWN0b3JJZCksdGhpcy5sb2NhbFdvcmsud29ya1NoYXBlcy5kZWxldGUoRS5zZWxlY3RvcklkKSxhLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOltdLHdpbGxTeW5jU2VydmljZTppfSk7Y29udGludWV9Y29uc3QgaD10aGlzLmNvbW1hbmREZWxldGVUZXh0KHUpO2gmJmEucHVzaChoKSxuPUEobix0aGlzLmxvY2FsV29yay5yZW1vdmVOb2RlKHUpKSxjLnB1c2godSl9aSYmYS5wdXNoKHt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6Yyx1bmRvVGlja2VySWQ6ZS51bmRvVGlja2VySWR9KSxuJiZyJiZsLnB1c2goe3JlY3Q6bixkcmF3Q2FudmFzOk4uQmcsY2xlYXJDYW52YXM6Ti5CZyxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsdmlld0lkOnN9KSwobC5sZW5ndGh8fGEubGVuZ3RoKSYmdGhpcy5sb2NhbFdvcmsuX3Bvc3Qoe3JlbmRlcjpsLHNwOmF9KX1jb25zdW1lRm9yU2VydmljZVdvcmtlcihlKXt0aGlzLnNlcnZpY2VXb3JrJiZ0aGlzLnNlcnZpY2VXb3JrLnJlbW92ZVNlbGVjdFdvcmsoZSl9Y29tbWFuZERlbGV0ZVRleHQoZSl7dmFyIHI7Y29uc3QgdD0ocj10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOnIudk5vZGVzLmdldChlKTtpZih0JiZ0LnRvb2xzVHlwZT09PVMuVGV4dClyZXR1cm57dHlwZTptLlRleHRVcGRhdGUsdG9vbHNUeXBlOlMuVGV4dCx3b3JrSWQ6ZSxkYXRhVHlwZTpXLkxvY2FsfX19Y2xhc3MgdmYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNjYWxlTm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKS5maW5hbGx5KCgpPT57cyYmc2V0VGltZW91dCgoKT0+e3ZhciBuOyhuPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8bi5fcG9zdCh7c3A6W3t0eXBlOm0uTm9uZSx1bmRvVGlja2VySWQ6c31dfSl9LDApfSksITB9YXN5bmMgY29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBuO2NvbnN0e3dvcmtJZDp0LHVwZGF0ZU5vZGVPcHQ6cix3aWxsU3luY1NlcnZpY2U6aSx3aWxsU2VyaWFsaXplRGF0YTpzfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChuPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bi51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsU3luY1NlcnZpY2U6aSx3aWxsU2VyaWFsaXplRGF0YTpzLGlzU3luYzohMCxzY2VuZTp0aGlzLnNjZW5lLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFjay5iaW5kKHRoaXMpfSkpfXVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2soZSl7Y29uc3R7cGFyYW06dCxwb3N0RGF0YTpyLHdvcmtTaGFwZU5vZGU6aSxyZXM6cyxuZXdTZXJ2aWNlU3RvcmU6bn09ZSx7dXBkYXRlU2VsZWN0b3JPcHQ6YSx3aWxsU3luY1NlcnZpY2U6bCx3aWxsU2VyaWFsaXplRGF0YTpjfT10LHU9YS53b3JrU3RhdGUsaD1yLnJlbmRlcnx8W10sZD1yLnNwfHxbXSxmPXM9PW51bGw/dm9pZCAwOnMuc2VsZWN0UmVjdCx3PXM9PW51bGw/dm9pZCAwOnMucmVuZGVyUmVjdDtpZih1PT09Ri5TdGFydClyZXR1cm57c3A6W10scmVuZGVyOltdfTtpZih0aGlzLmxvY2FsV29yayl7aC5wdXNoKHtpc0NsZWFyQWxsOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcix2aWV3SWQ6dGhpcy5sb2NhbFdvcmsudmlld0lkfSk7Y29uc3QgeT17cmVjdDp3LGlzRnVsbFdvcms6ITEsZHJhd0NhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLmxvY2FsV29yay52aWV3SWR9O2gucHVzaCh5KX1pZihsKXt1PT09Ri5Eb2luZyYmZC5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczppLnNlbGVjdElkcyxzZWxlY3RSZWN0OmYsd2lsbFN5bmNTZXJ2aWNlOiEwLGlzU3luYzohMCxwb2ludHM6aS5nZXRDaGlsZHJlblBvaW50cygpLHRleHRPcHQ6aS50ZXh0T3B0fSksYyYmdT09PUYuRG9uZSYmZC5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczppLnNlbGVjdElkcyxzZWxlY3RSZWN0OmYsd2lsbFN5bmNTZXJ2aWNlOiExLGlzU3luYzohMCxwb2ludHM6aS5nZXRDaGlsZHJlblBvaW50cygpLHRleHRPcHQ6aS50ZXh0T3B0fSk7Zm9yKGNvbnN0W3ksZ11vZiBuLmVudHJpZXMoKSlnLnRvb2xzVHlwZT09PVMuVGV4dD9kLnB1c2goey4uLmcsd29ya0lkOnksdHlwZTptLlRleHRVcGRhdGUsZGF0YVR5cGU6Vy5Mb2NhbCx3aWxsU3luY1NlcnZpY2U6ITB9KTpkLnB1c2goey4uLmcsd29ya0lkOnksdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6ITB9KX1yZXR1cm57cmVuZGVyOmgsc3A6ZH19fWNsYXNzIFNmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5Sb3RhdGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGVtaXRFdmVudFR5cGU6YX09ZTt0PT09RS5zZWxlY3RvcklkJiZyJiZhd2FpdCgobD10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmwudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sZW1pdEV2ZW50VHlwZTphLGlzU3luYzohMCxzY2VuZTp0aGlzLnNjZW5lLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cix3b3JrU2hhcGVOb2RlOmkscmVzOnMsbmV3U2VydmljZVN0b3JlOm59PWUse3VwZGF0ZVNlbGVjdG9yT3B0OmEsd2lsbFN5bmNTZXJ2aWNlOmwsd2lsbFNlcmlhbGl6ZURhdGE6Yyxpc1N5bmM6dX09dCxoPWEud29ya1N0YXRlLGQ9ci5yZW5kZXJ8fFtdLGY9ci5zcHx8W10sdz1zPT1udWxsP3ZvaWQgMDpzLnNlbGVjdFJlY3Q7aWYobCl7YyYmaD09PUYuRG9uZSYmZi5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczppLnNlbGVjdElkcyxzZWxlY3RSZWN0Oncsd2lsbFN5bmNTZXJ2aWNlOiEwLGlzU3luYzp1LHBvaW50czppLmdldENoaWxkcmVuUG9pbnRzKCl9KTtmb3IoY29uc3RbeSxnXW9mIG4uZW50cmllcygpKWYucHVzaCh7Li4uZyx3b3JrSWQ6eSx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzp1fSl9cmV0dXJue3JlbmRlcjpkLHNwOmZ9fX1jbGFzcyBrZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2V0Rm9udFN0eWxlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bix0ZXh0VXBkYXRlRm9yV29rZXI6YSxjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOmksd29ya1NoYXBlTm9kZTpzLHJlczpufT1lLHt3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCx1cGRhdGVTZWxlY3Rvck9wdDpjLHRleHRVcGRhdGVGb3JXb2tlcjp1fT10LGg9ci5yZW5kZXJ8fFtdLGQ9ci5zcHx8W10sZj1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSYmZCl7Yy5mb250U2l6ZSYmZC5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxzZWxlY3RSZWN0OmYsd2lsbFN5bmNTZXJ2aWNlOmEsaXNTeW5jOmwscG9pbnRzOnMuZ2V0Q2hpbGRyZW5Qb2ludHMoKX0pO2Zvcihjb25zdFt3LHldb2YgaS5lbnRyaWVzKCkpdSYmeS50b29sc1R5cGU9PT1TLlRleHQ/ZC5wdXNoKHsuLi55LHdvcmtJZDp3LHR5cGU6bS5UZXh0VXBkYXRlLGRhdGFUeXBlOlcuTG9jYWwsd2lsbFN5bmNTZXJ2aWNlOiEwfSk6ZC5wdXNoKHsuLi55LHdvcmtJZDp3LHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOmx9KX1yZXR1cm57cmVuZGVyOmgsc3A6ZH19fWNsYXNzIFBmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRQb2ludH0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKS5maW5hbGx5KCgpPT57cyYmc2V0VGltZW91dCgoKT0+e3ZhciBuOyhuPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8bi5fcG9zdCh7c3A6W3t0eXBlOm0uTm9uZSx1bmRvVGlja2VySWQ6c31dfSl9LDApfSksITB9YXN5bmMgY29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBsO2NvbnN0e3dvcmtJZDp0LHVwZGF0ZU5vZGVPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bix0ZXh0VXBkYXRlRm9yV29rZXI6YX09ZTt0PT09RS5zZWxlY3RvcklkJiZyJiZhd2FpdCgobD10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmwudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLGVtaXRFdmVudFR5cGU6dGhpcy5lbWl0RXZlbnRUeXBlLHdpbGxTZXJpYWxpemVEYXRhOm4saXNTeW5jOiEwLHRleHRVcGRhdGVGb3JXb2tlcjphLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsfT10LGM9ci5yZW5kZXJ8fFtdLHU9ci5zcHx8W10saD1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSYmdSl7Zm9yKGNvbnN0W2QsZl1vZiBpLmVudHJpZXMoKSl1LnB1c2goey4uLmYsd29ya0lkOmQsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pO3UucHVzaCh7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsc2VsZWN0UmVjdDpoLHdpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHBvaW50czpzLmdldENoaWxkcmVuUG9pbnRzKCl9KX1yZXR1cm57cmVuZGVyOmMsc3A6dX19fWNsYXNzIFRmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRMb2NrfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGE7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpufT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChhPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6YS51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOmksd29ya1NoYXBlTm9kZTpzLHJlczpufT1lLHt3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCx1cGRhdGVTZWxlY3Rvck9wdDpjfT10LHU9ci5yZW5kZXJ8fFtdLGg9ci5zcHx8W10sZD1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSYmaCl7Zm9yKGNvbnN0W2Ysd11vZiBpLmVudHJpZXMoKSloLnB1c2goey4uLncsd29ya0lkOmYsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pO2gucHVzaCh7aXNMb2NrZWQ6Yy5pc0xvY2tlZCxzZWxlY3RvckNvbG9yOnMuc2VsZWN0b3JDb2xvcixzY2FsZVR5cGU6cy5zY2FsZVR5cGUsY2FuUm90YXRlOnMuY2FuUm90YXRlLHR5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOnMuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6ZCx3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bH0pfXJldHVybntyZW5kZXI6dSxzcDpofX19Y2xhc3MgSWYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNldFNoYXBlT3B0fSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGE7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpufT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChhPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6YS51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOml9PWUse3dpbGxTeW5jU2VydmljZTpzLGlzU3luYzpufT10LGE9ci5yZW5kZXJ8fFtdLGw9ci5zcHx8W107aWYocyYmbClmb3IoY29uc3RbYyx1XW9mIGkuZW50cmllcygpKWwucHVzaCh7Li4udSx3b3JrSWQ6Yyx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpufSk7cmV0dXJue3JlbmRlcjphLHNwOmx9fX1jbGFzcyB4Zntjb25zdHJ1Y3RvcihlKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYnVpbGRlcnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgTWFwfSksdGhpcy5idWlsZGVycz1uZXcgTWFwKGUubWFwKHQ9Plt0LHRoaXMuYnVpbGQodCldKSl9YnVpbGQoZSl7c3dpdGNoKGUpe2Nhc2UgQi5UcmFuc2xhdGVOb2RlOnJldHVybiBuZXcgZ2Y7Y2FzZSBCLlpJbmRleE5vZGU6cmV0dXJuIG5ldyBtZjtjYXNlIEIuWkluZGV4QWN0aXZlOnJldHVybiBuZXcgcGY7Y2FzZSBCLkNvcHlOb2RlOnJldHVybiBuZXcgeWY7Y2FzZSBCLlNldENvbG9yTm9kZTpyZXR1cm4gbmV3IHdmO2Nhc2UgQi5EZWxldGVOb2RlOnJldHVybiBuZXcgYmY7Y2FzZSBCLlNjYWxlTm9kZTpyZXR1cm4gbmV3IHZmO2Nhc2UgQi5Sb3RhdGVOb2RlOnJldHVybiBuZXcgU2Y7Y2FzZSBCLlNldEZvbnRTdHlsZTpyZXR1cm4gbmV3IGtmO2Nhc2UgQi5TZXRQb2ludDpyZXR1cm4gbmV3IFBmO2Nhc2UgQi5TZXRMb2NrOnJldHVybiBuZXcgVGY7Y2FzZSBCLlNldFNoYXBlT3B0OnJldHVybiBuZXcgSWZ9fXJlZ2lzdGVyRm9yV29ya2VyKGUsdCxyKXtyZXR1cm4gdGhpcy5idWlsZGVycy5mb3JFYWNoKGk9PntpJiZpLnJlZ2lzdGVyRm9yV29ya2VyKGUsdCxyKX0pLHRoaXN9Y29uc3VtZUZvcldvcmtlcihlKXtmb3IoY29uc3QgdCBvZiB0aGlzLmJ1aWxkZXJzLnZhbHVlcygpKWlmKHQhPW51bGwmJnQuY29uc3VtZShlKSlyZXR1cm4hMDtyZXR1cm4hMX19Y29uc3QgS2U9ImN1cnNvcmhvdmVyIjtjbGFzcyBPZntjb25zdHJ1Y3RvcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmVQYXRoIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJmdWxsTGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY3VyTm9kZU1hcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidGFyZ2V0Tm9kZU1hcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksdGhpcy52aWV3SWQ9ZSx0aGlzLnNjZW5lPXR9aW5pdChlLHQpe3RoaXMuZnVsbExheWVyPWUsdGhpcy5kcmF3TGF5ZXI9dH1nZXQoZSl7cmV0dXJuIHRoaXMuY3VyTm9kZU1hcC5nZXQoZSl9aGFzUmVuZGVyTm9kZXMoKXtsZXQgZT0hMTtmb3IoY29uc3QgdCBvZiB0aGlzLmN1ck5vZGVNYXAudmFsdWVzKCkpT3IodC50b29sc1R5cGUpJiYoZT0hMCk7cmV0dXJuIGV9aGFzKGUpe3RoaXMuY3VyTm9kZU1hcC5oYXMoZSl9c2V0SW5mbyhlLHQpe2NvbnN0IHI9dGhpcy5jdXJOb2RlTWFwLmdldChlKXx8e25hbWU6ZSxyZWN0OnQucmVjdH07dC5yZWN0JiYoci5yZWN0PXJlKHQucmVjdCkpLHQub3AmJihyLm9wPXJlKHQub3ApKSx0LmNhblJvdGF0ZSYmKHIuY2FuUm90YXRlPXQuY2FuUm90YXRlKSx0LnNjYWxlVHlwZSYmKHIuc2NhbGVUeXBlPXQuc2NhbGVUeXBlKSx0Lm9wdCYmKHIub3B0PXJlKHQub3B0KSksdC50b29sc1R5cGUmJihyLnRvb2xzVHlwZT10LnRvb2xzVHlwZSksdC5jZW50ZXJQb3MmJihyLmNlbnRlclBvcz1yZSh0LmNlbnRlclBvcykpLHIucmVjdD90aGlzLmN1ck5vZGVNYXAuc2V0KGUscik6dGhpcy5jdXJOb2RlTWFwLmRlbGV0ZShlKX1kZWxldGUoZSl7dGhpcy5jdXJOb2RlTWFwLmRlbGV0ZShlKX1jbGVhcigpe3RoaXMuY3VyTm9kZU1hcC5jbGVhcigpLHRoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGg9MH1oYXNSZWN0SW50ZXJzZWN0UmFuZ2UoZSx0PSEwKXtmb3IoY29uc3QgciBvZiB0aGlzLmN1ck5vZGVNYXAudmFsdWVzKCkpaWYoUGUoZSxyLnJlY3QpKXtpZih0JiZyLnRvb2xzVHlwZT09PVMuSW1hZ2UmJnIub3B0LmxvY2tlZHx8dCYmci50b29sc1R5cGU9PT1TLlRleHQmJihyLm9wdC53b3JrU3RhdGU9PT1GLkRvaW5nfHxyLm9wdC53b3JrU3RhdGU9PT1GLlN0YXJ0KSljb250aW51ZTtyZXR1cm4hMH1yZXR1cm4hMX1nZXRSZWN0SW50ZXJzZWN0UmFuZ2UoZSx0PSEwKXtsZXQgcjtjb25zdCBpPW5ldyBNYXA7Zm9yKGNvbnN0W3Msbl1vZiB0aGlzLmN1ck5vZGVNYXAuZW50cmllcygpKWlmKFBlKGUsbi5yZWN0KSl7aWYodCYmbi50b29sc1R5cGU9PT1TLkltYWdlJiZuLm9wdC5sb2NrZWR8fHQmJm4udG9vbHNUeXBlPT09Uy5UZXh0JiYobi5vcHQud29ya1N0YXRlPT09Ri5Eb2luZ3x8bi5vcHQud29ya1N0YXRlPT09Ri5TdGFydCkpY29udGludWU7cj1BKHIsbi5yZWN0KSxpLnNldChzLG4pfXJldHVybntyZWN0UmFuZ2U6cixub2RlUmFuZ2U6aX19Z2V0Tm9kZVJlY3RGb3JtU2hhcGUoZSx0KXtjb25zdCByPVZyKHQudG9vbHNUeXBlKTtsZXQgaT10aGlzLmZ1bGxMYXllciYmKHI9PW51bGw/dm9pZCAwOnIuZ2V0UmVjdEZyb21MYXllcih0aGlzLmZ1bGxMYXllcixlKSk7cmV0dXJuIWkmJnRoaXMuZHJhd0xheWVyJiYoaT1yPT1udWxsP3ZvaWQgMDpyLmdldFJlY3RGcm9tTGF5ZXIodGhpcy5kcmF3TGF5ZXIsZSkpLGl9dXBkYXRlTm9kZXNSZWN0KCl7dGhpcy5jdXJOb2RlTWFwLmZvckVhY2goKGUsdCk9Pntjb25zdCByPXRoaXMuZ2V0Tm9kZVJlY3RGb3JtU2hhcGUodCxlKTtyPyhlLnJlY3Q9cix0aGlzLmN1ck5vZGVNYXAuc2V0KHQsZSkpOnRoaXMuY3VyTm9kZU1hcC5kZWxldGUodCl9KX1jb21iaW5lSW50ZXJzZWN0UmVjdChlKXtsZXQgdD1lO3JldHVybiB0aGlzLmN1ck5vZGVNYXAuZm9yRWFjaChyPT57UGUodCxyLnJlY3QpJiYodD1BKHQsci5yZWN0KSl9KSx0fXNldFRhcmdldCgpe3JldHVybiB0aGlzLnRhcmdldE5vZGVNYXAucHVzaChyZSh0aGlzLmN1ck5vZGVNYXApKSx0aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoLTF9Z2V0TGFzdFRhcmdldCgpe3JldHVybiB0aGlzLnRhcmdldE5vZGVNYXBbdGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aC0xXX1kZWxldGVMYXN0VGFyZ2V0KCl7dGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aD10aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoLTF9Z2V0VGFyZ2V0KGUpe3JldHVybiB0aGlzLnRhcmdldE5vZGVNYXBbZV19ZGVsZXRlVGFyZ2V0KGUpe3RoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGg9ZX19Y2xhc3MgdG97Y29uc3RydWN0b3IoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidmlld0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Tm9kZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHByIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW1lcmFPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiaXNTYWZhcmkiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLHRoaXMudmlld0lkPWUsdGhpcy5vcHQ9dCx0aGlzLmRwcj10LmRwcix0aGlzLnNjZW5lPXRoaXMuY3JlYXRlU2NlbmUodC5vZmZzY3JlZW5DYW52YXNPcHQpLHRoaXMuZnVsbExheWVyPXRoaXMuY3JlYXRlTGF5ZXIoImZ1bGxMYXllciIsdGhpcy5zY2VuZSx7Li4udC5sYXllck9wdCxidWZmZXJTaXplOnRoaXMudmlld0lkPT09Im1haW5WaWV3Ij82ZTM6M2UzfSksdGhpcy52Tm9kZXM9bmV3IE9mKGUsdGhpcy5zY2VuZSl9c2V0SXNTYWZhcmkoZSl7dGhpcy5pc1NhZmFyaT1lfW9uKGUpe2NvbnN0e21zZ1R5cGU6dCx0b29sc1R5cGU6cixvcHQ6aSx3b3JrSWQ6cyx3b3JrU3RhdGU6bixkYXRhVHlwZTphfT1lO3N3aXRjaCh0KXtjYXNlIG0uRGVzdHJveTp0aGlzLmRlc3Ryb3koKTticmVhaztjYXNlIG0uQ2xlYXI6dGhpcy5jbGVhckFsbCgpO2JyZWFrO2Nhc2UgbS5VcGRhdGVUb29sczppZihyJiZpKXtjb25zdCBsPXt0b29sc1R5cGU6cix0b29sc09wdDppfTt0aGlzLmxvY2FsV29yay5zZXRUb29sc09wdChsKX1icmVhaztjYXNlIG0uQ3JlYXRlV29yazpzJiZpJiYoIXRoaXMubG9jYWxXb3JrLmdldFRtcFdvcmtTaGFwZU5vZGUoKSYmciYmdGhpcy5zZXRUb29sc09wdCh7dG9vbHNUeXBlOnIsdG9vbHNPcHQ6aX0pLHRoaXMuc2V0V29ya09wdCh7d29ya0lkOnMsdG9vbHNPcHQ6aX0pKTticmVhaztjYXNlIG0uRHJhd1dvcms6bj09PUYuRG9uZSYmYT09PVcuTG9jYWw/dGhpcy5jb25zdW1lRHJhd0FsbChhLGUpOnRoaXMuY29uc3VtZURyYXcoYSxlKTticmVha319dXBkYXRlU2NlbmUoZSl7dGhpcy5zY2VuZS5hdHRyKHsuLi5lfSk7Y29uc3R7d2lkdGg6dCxoZWlnaHQ6cn09ZTt0aGlzLnNjZW5lLmNvbnRhaW5lci53aWR0aD10LHRoaXMuc2NlbmUuY29udGFpbmVyLmhlaWdodD1yLHRoaXMuc2NlbmUud2lkdGg9dCx0aGlzLnNjZW5lLmhlaWdodD1yLHRoaXMudXBkYXRlTGF5ZXIoe3dpZHRoOnQsaGVpZ2h0OnJ9KX11cGRhdGVMYXllcihlKXtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lO3RoaXMuZnVsbExheWVyJiYodGhpcy5mdWxsTGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgid2lkdGgiLHQpLHRoaXMuZnVsbExheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoImhlaWdodCIsciksdGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJzaXplIixbdCxyXSksdGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJwb3MiLFt0Ki41LHIqLjVdKSksdGhpcy5kcmF3TGF5ZXImJih0aGlzLmRyYXdMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5kcmF3TGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgiaGVpZ2h0IixyKSx0aGlzLmRyYXdMYXllci5zZXRBdHRyaWJ1dGUoInNpemUiLFt0LHJdKSx0aGlzLmRyYXdMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKSx0aGlzLnNuYXBzaG90RnVsbExheWVyJiYodGhpcy5zbmFwc2hvdEZ1bGxMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5zbmFwc2hvdEZ1bGxMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJoZWlnaHQiLHIpLHRoaXMuc25hcHNob3RGdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJzaXplIixbdCxyXSksdGhpcy5zbmFwc2hvdEZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKX1jcmVhdGVTY2VuZShlKXtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lLGk9bmV3IE9mZnNjcmVlbkNhbnZhcyh0LHIpO3JldHVybiBuZXcgei5TY2VuZSh7Y29udGFpbmVyOmksZGlzcGxheVJhdGlvOnRoaXMuZHByLGRlcHRoOiExLGRlc3luY2hyb25pemVkOiEwLC4uLmV9KX1jcmVhdGVMYXllcihlLHQscil7Y29uc3R7d2lkdGg6aSxoZWlnaHQ6c309cixuPWBvZmZzY3JlZW4tJHtlfWAsYT10LmxheWVyKG4sciksbD1uZXcgei5Hcm91cCh7YW5jaG9yOlsuNSwuNV0scG9zOltpKi41LHMqLjVdLHNpemU6W2ksc10sbmFtZToidmlld3BvcnQiLGlkOmV9KTtyZXR1cm4gYS5hcHBlbmQobCksbH1jbGVhckFsbCgpe3ZhciBlO3RoaXMuZnVsbExheWVyJiYodGhpcy5mdWxsTGF5ZXIucGFyZW50LmNoaWxkcmVuLmZvckVhY2godD0+e3QubmFtZSE9PSJ2aWV3cG9ydCImJnQucmVtb3ZlKCl9KSx0aGlzLmZ1bGxMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpKSx0aGlzLmRyYXdMYXllciYmKHRoaXMuZHJhd0xheWVyLnBhcmVudC5jaGlsZHJlbi5mb3JFYWNoKHQ9Pnt0Lm5hbWUhPT0idmlld3BvcnQiJiZ0LnJlbW92ZSgpfSksdGhpcy5kcmF3TGF5ZXIucmVtb3ZlQWxsQ2hpbGRyZW4oKSksdGhpcy5sb2NhbFdvcmsuY2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKSwoZT10aGlzLnNlcnZpY2VXb3JrKT09bnVsbHx8ZS5jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpfXNldFRvb2xzT3B0KGUpe3RoaXMubG9jYWxXb3JrLnNldFRvb2xzT3B0KGUpfXNldFdvcmtPcHQoZSl7Y29uc3R7d29ya0lkOnQsdG9vbHNPcHQ6cn09ZTt0JiZyJiZ0aGlzLmxvY2FsV29yay5zZXRXb3JrT3B0aW9ucyh0LHIpfWRlc3Ryb3koKXt2YXIgZTt0aGlzLnZOb2Rlcy5jbGVhcigpLHRoaXMuc2NlbmUucmVtb3ZlKCksdGhpcy5mdWxsTGF5ZXIucmVtb3ZlKCksdGhpcy5sb2NhbFdvcmsuZGVzdHJveSgpLChlPXRoaXMuc2VydmljZVdvcmspPT1udWxsfHxlLmRlc3Ryb3koKX19Y2xhc3Mgcm97Y29uc3RydWN0b3IoZSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZpZXdJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Tm9kZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidGhyZWFkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3Bvc3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wV29ya1NoYXBlTm9kZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlU3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgTWFwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVmZmVjdFdvcmtJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3Q291bnQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTowfSksdGhpcy50aHJlYWQ9ZS50aHJlYWQsdGhpcy52aWV3SWQ9ZS52aWV3SWQsdGhpcy52Tm9kZXM9ZS52Tm9kZXMsdGhpcy5mdWxsTGF5ZXI9ZS5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXI9ZS5kcmF3TGF5ZXIsdGhpcy5fcG9zdD1lLnBvc3R9ZGVzdHJveSgpe3RoaXMud29ya1NoYXBlU3RhdGUuY2xlYXIoKSx0aGlzLndvcmtTaGFwZXMuY2xlYXIoKX1nZXRXb3JrU2hhcGUoZSl7cmV0dXJuIHRoaXMud29ya1NoYXBlcy5nZXQoZSl9Z2V0VG1wV29ya1NoYXBlTm9kZSgpe3JldHVybiB0aGlzLnRtcFdvcmtTaGFwZU5vZGV9c2V0VG1wV29ya0lkKGUpe2lmKGUmJnRoaXMudG1wV29ya1NoYXBlTm9kZSl7dGhpcy50bXBXb3JrU2hhcGVOb2RlLnNldFdvcmtJZChlKSx0aGlzLndvcmtTaGFwZXMuc2V0KGUsdGhpcy50bXBXb3JrU2hhcGVOb2RlKSx0aGlzLnRtcE9wdCYmdGhpcy5zZXRUb29sc09wdCh0aGlzLnRtcE9wdCk7cmV0dXJufX1zZXRUbXBXb3JrT3B0aW9ucyhlKXt2YXIgdDsodD10aGlzLnRtcFdvcmtTaGFwZU5vZGUpPT1udWxsfHx0LnNldFdvcmtPcHRpb25zKGUpfXNldFdvcmtPcHRpb25zKGUsdCl7dmFyIGk7dGhpcy53b3JrU2hhcGVzLmdldChlKXx8dGhpcy5zZXRUbXBXb3JrSWQoZSksKGk9dGhpcy53b3JrU2hhcGVzLmdldChlKSk9PW51bGx8fGkuc2V0V29ya09wdGlvbnModCl9Y3JlYXRlV29ya1NoYXBlTm9kZShlKXt2YXIgaTtjb25zdHt0b29sc1R5cGU6dCx3b3JrSWQ6cn09ZTtyZXR1cm4gdD09PVMuU2VsZWN0b3ImJnI9PT1LZT9idCh7Li4uZSx2Tm9kZXM6dGhpcy52Tm9kZXMsZnVsbExheWVyOnRoaXMuZnVsbExheWVyLGRyYXdMYXllcjp0aGlzLmZ1bGxMYXllcn0pOmJ0KHsuLi5lLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfSwoaT10aGlzLnRocmVhZCk9PW51bGw/dm9pZCAwOmkuc2VydmljZVdvcmspfXNldFRvb2xzT3B0KGUpe3ZhciB0LHI7KCh0PXRoaXMudG1wT3B0KT09bnVsbD92b2lkIDA6dC50b29sc1R5cGUpIT09ZS50b29sc1R5cGUmJihyPXRoaXMudG1wT3B0KSE9bnVsbCYmci50b29sc1R5cGUmJnRoaXMuY2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKSx0aGlzLnRtcE9wdD1lLHRoaXMudG1wV29ya1NoYXBlTm9kZT10aGlzLmNyZWF0ZVdvcmtTaGFwZU5vZGUoZSl9Y2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUoZSl7dmFyIHQ7KHQ9dGhpcy5nZXRXb3JrU2hhcGUoZSkpPT1udWxsfHx0LmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShlKSx0aGlzLndvcmtTaGFwZVN0YXRlLmRlbGV0ZShlKX1jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpe3RoaXMud29ya1NoYXBlcy5mb3JFYWNoKGU9PmUuY2xlYXJUbXBQb2ludHMoKSksdGhpcy53b3JrU2hhcGVzLmNsZWFyKCksdGhpcy53b3JrU2hhcGVTdGF0ZS5jbGVhcigpfXNldEZ1bGxXb3JrKGUpe2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppfT1lO2lmKHQmJnImJmkpe2NvbnN0IHM9dCYmdGhpcy53b3JrU2hhcGVzLmdldCh0KXx8dGhpcy5jcmVhdGVXb3JrU2hhcGVOb2RlKHt0b29sc09wdDpyLHRvb2xzVHlwZTppLHdvcmtJZDp0fSk7cmV0dXJuIHM/KHMuc2V0V29ya0lkKHQpLHRoaXMud29ya1NoYXBlcy5zZXQodCxzKSxzKTp2b2lkIDB9fX12YXIgTGY9aWUsQ2Y9ZnVuY3Rpb24oKXtyZXR1cm4gTGYuRGF0ZS5ub3coKX0sTmY9Q2YsV2Y9L1xzLztmdW5jdGlvbiBSZihvKXtmb3IodmFyIGU9by5sZW5ndGg7ZS0tJiZXZi50ZXN0KG8uY2hhckF0KGUpKTspO3JldHVybiBlfXZhciBNZj1SZixBZj1NZiwkZj0vXlxzKy87ZnVuY3Rpb24gRGYobyl7cmV0dXJuIG8mJm8uc2xpY2UoMCxBZihvKSsxKS5yZXBsYWNlKCRmLCIiKX12YXIgamY9RGYsRmY9ZmUsQmY9Y2UsX2Y9IltvYmplY3QgU3ltYm9sXSI7ZnVuY3Rpb24gRWYobyl7cmV0dXJuIHR5cGVvZiBvPT0ic3ltYm9sInx8QmYobykmJkZmKG8pPT1fZn12YXIgemY9RWYsVWY9amYsb289dWUsR2Y9emYsc289TmFOLFhmPS9eWy0rXTB4WzAtOWEtZl0rJC9pLEhmPS9eMGJbMDFdKyQvaSxZZj0vXjBvWzAtN10rJC9pLHFmPXBhcnNlSW50O2Z1bmN0aW9uIFpmKG8pe2lmKHR5cGVvZiBvPT0ibnVtYmVyIilyZXR1cm4gbztpZihHZihvKSlyZXR1cm4gc287aWYob28obykpe3ZhciBlPXR5cGVvZiBvLnZhbHVlT2Y9PSJmdW5jdGlvbiI/by52YWx1ZU9mKCk6bztvPW9vKGUpP2UrIiI6ZX1pZih0eXBlb2YgbyE9InN0cmluZyIpcmV0dXJuIG89PT0wP286K287bz1VZihvKTt2YXIgdD1IZi50ZXN0KG8pO3JldHVybiB0fHxZZi50ZXN0KG8pP3FmKG8uc2xpY2UoMiksdD8yOjgpOlhmLnRlc3Qobyk/c286K299dmFyIFFmPVpmLEpmPXVlLHZ0PU5mLGlvPVFmLEtmPSJFeHBlY3RlZCBhIGZ1bmN0aW9uIixWZj1NYXRoLm1heCxlcD1NYXRoLm1pbjtmdW5jdGlvbiB0cChvLGUsdCl7dmFyIHIsaSxzLG4sYSxsLGM9MCx1PSExLGg9ITEsZD0hMDtpZih0eXBlb2YgbyE9ImZ1bmN0aW9uIil0aHJvdyBuZXcgVHlwZUVycm9yKEtmKTtlPWlvKGUpfHwwLEpmKHQpJiYodT0hIXQubGVhZGluZyxoPSJtYXhXYWl0ImluIHQscz1oP1ZmKGlvKHQubWF4V2FpdCl8fDAsZSk6cyxkPSJ0cmFpbGluZyJpbiB0PyEhdC50cmFpbGluZzpkKTtmdW5jdGlvbiBmKHYpe3ZhciBMPXIsVD1pO3JldHVybiByPWk9dm9pZCAwLGM9dixuPW8uYXBwbHkoVCxMKSxufWZ1bmN0aW9uIHcodil7cmV0dXJuIGM9dixhPXNldFRpbWVvdXQoUCxlKSx1P2Yodik6bn1mdW5jdGlvbiB5KHYpe3ZhciBMPXYtbCxUPXYtYyxNPWUtTDtyZXR1cm4gaD9lcChNLHMtVCk6TX1mdW5jdGlvbiBnKHYpe3ZhciBMPXYtbCxUPXYtYztyZXR1cm4gbD09PXZvaWQgMHx8TD49ZXx8TDwwfHxoJiZUPj1zfWZ1bmN0aW9uIFAoKXt2YXIgdj12dCgpO2lmKGcodikpcmV0dXJuIGsodik7YT1zZXRUaW1lb3V0KFAseSh2KSl9ZnVuY3Rpb24gayh2KXtyZXR1cm4gYT12b2lkIDAsZCYmcj9mKHYpOihyPWk9dm9pZCAwLG4pfWZ1bmN0aW9uIE8oKXthIT09dm9pZCAwJiZjbGVhclRpbWVvdXQoYSksYz0wLHI9bD1pPWE9dm9pZCAwfWZ1bmN0aW9uIEkoKXtyZXR1cm4gYT09PXZvaWQgMD9uOmsodnQoKSl9ZnVuY3Rpb24gYigpe3ZhciB2PXZ0KCksTD1nKHYpO2lmKHI9YXJndW1lbnRzLGk9dGhpcyxsPXYsTCl7aWYoYT09PXZvaWQgMClyZXR1cm4gdyhsKTtpZihoKXJldHVybiBjbGVhclRpbWVvdXQoYSksYT1zZXRUaW1lb3V0KFAsZSksZihsKX1yZXR1cm4gYT09PXZvaWQgMCYmKGE9c2V0VGltZW91dChQLGUpKSxufXJldHVybiBiLmNhbmNlbD1PLGIuZmx1c2g9SSxifXZhciBycD10cCxvcD1ycCxzcD11ZSxpcD0iRXhwZWN0ZWQgYSBmdW5jdGlvbiI7ZnVuY3Rpb24gbnAobyxlLHQpe3ZhciByPSEwLGk9ITA7aWYodHlwZW9mIG8hPSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcihpcCk7cmV0dXJuIHNwKHQpJiYocj0ibGVhZGluZyJpbiB0PyEhdC5sZWFkaW5nOnIsaT0idHJhaWxpbmciaW4gdD8hIXQudHJhaWxpbmc6aSksb3AobyxlLHtsZWFkaW5nOnIsbWF4V2FpdDplLHRyYWlsaW5nOml9KX12YXIgYXA9bnAsbHA9bWUoYXApO2NsYXNzIGNwIGV4dGVuZHMgcm97Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNvbWJpbmVVbml0VGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjYwMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb21iaW5lVGltZXJJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlZmZlY3RTZWxlY3ROb2RlRGF0YSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBTZXR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYmF0Y2hFcmFzZXJXb3JrcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBTZXR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYmF0Y2hFcmFzZXJSZW1vdmVOb2RlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBTZXR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYmF0Y2hFcmFzZXJDb21iaW5lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bHAoKCk9Pntjb25zdCB0PXRoaXMudXBkYXRlQmF0Y2hFcmFzZXJDb21iaW5lTm9kZSh0aGlzLmJhdGNoRXJhc2VyV29ya3MsdGhpcy5iYXRjaEVyYXNlclJlbW92ZU5vZGVzKTt0aGlzLmJhdGNoRXJhc2VyV29ya3MuY2xlYXIoKSx0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMuY2xlYXIoKSx0Lmxlbmd0aCYmdGhpcy5fcG9zdCh7cmVuZGVyOnR9KX0sMTAwLHtsZWFkaW5nOiExfSl9KX1jb25zdW1lRHJhdyhlLHQpe2NvbnN0e29wOnIsd29ya0lkOml9PWU7aWYociE9bnVsbCYmci5sZW5ndGgmJmkpe2NvbnN0IHM9dGhpcy53b3JrU2hhcGVzLmdldChpKTtpZighcylyZXR1cm47Y29uc3Qgbj1zLnRvb2xzVHlwZTtpZihuPT09Uy5MYXNlclBlbilyZXR1cm47Y29uc3QgYT1zLmNvbnN1bWUoe2RhdGE6ZSxpc0Z1bGxXb3JrOiEwfSk7c3dpdGNoKG4pe2Nhc2UgUy5TZWxlY3RvcjphLnR5cGU9PT1tLlNlbGVjdCYmKGEuc2VsZWN0SWRzJiZ0LnJ1blJldmVyc2VTZWxlY3RXb3JrKGEuc2VsZWN0SWRzKSx0aGlzLmRyYXdTZWxlY3RvcihhLCEwKSk7YnJlYWs7Y2FzZSBTLkVyYXNlcjphIT1udWxsJiZhLnJlY3QmJnRoaXMuZHJhd0VyYXNlcihhKTticmVhaztjYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5FbGxpcHNlOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246YSYmKHRoaXMuZHJhd0NvdW50KyssdGhpcy5kcmF3UGVuY2lsKGEpKTticmVhaztjYXNlIFMuUGVuY2lsOnRoaXMuY29tYmluZVRpbWVySWR8fCh0aGlzLmNvbWJpbmVUaW1lcklkPXNldFRpbWVvdXQoKCk9Pnt0aGlzLmNvbWJpbmVUaW1lcklkPXZvaWQgMCx0aGlzLmRyYXdQZW5jaWxDb21iaW5lKGkpfSxNYXRoLmZsb29yKHMuZ2V0V29ya09wdGlvbnMoKS5zeW5jVW5pdFRpbWV8fHRoaXMuY29tYmluZVVuaXRUaW1lLzIpKSksYSYmKHRoaXMuZHJhd0NvdW50KyssdGhpcy5kcmF3UGVuY2lsKGEpKTticmVha319fWNvbnN1bWVEcmF3QWxsKGUsdCl7dmFyIG4sYSxsO3RoaXMuY29tYmluZVRpbWVySWQmJihjbGVhclRpbWVvdXQodGhpcy5jb21iaW5lVGltZXJJZCksdGhpcy5jb21iaW5lVGltZXJJZD12b2lkIDApO2NvbnN0e3dvcmtJZDpyLHVuZG9UaWNrZXJJZDppLHNjZW5lUGF0aDpzfT1lO2lmKHIpe2kmJnNldFRpbWVvdXQoKCk9Pnt0aGlzLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDppfV19KX0sMCk7Y29uc3QgYz10aGlzLndvcmtTaGFwZXMuZ2V0KHIpO2lmKCFjKXJldHVybjtjb25zdCB1PWMudG9vbHNUeXBlO2lmKHU9PT1TLkxhc2VyUGVuKXJldHVybjtjb25zdCBoPXRoaXMud29ya1NoYXBlcy5nZXQoS2UpLGQ9KG49aD09bnVsbD92b2lkIDA6aC5zZWxlY3RJZHMpPT1udWxsP3ZvaWQgMDpuWzBdLGY9Yy5jb25zdW1lQWxsKHtkYXRhOmUsaG92ZXJJZDpkfSksdz10aGlzLndvcmtTaGFwZVN0YXRlLmdldChyKTtzd2l0Y2godSl7Y2FzZSBTLlNlbGVjdG9yOmYuc2VsZWN0SWRzJiZkJiYoKGE9Zi5zZWxlY3RJZHMpIT1udWxsJiZhLmluY2x1ZGVzKGQpKSYmaC5jdXJzb3JCbHVyKCksZi5zZWxlY3RJZHMmJnQucnVuUmV2ZXJzZVNlbGVjdFdvcmsoZi5zZWxlY3RJZHMpLHRoaXMuZHJhd1NlbGVjdG9yKHsuLi5mLHNjZW5lUGF0aDpzfSwhMSksKGw9Yy5zZWxlY3RJZHMpIT1udWxsJiZsLmxlbmd0aD9jLmNsZWFyVG1wUG9pbnRzKCk6dGhpcy5jbGVhcldvcmtTaGFwZU5vZGVDYWNoZShyKTticmVhaztjYXNlIFMuRXJhc2VyOmYhPW51bGwmJmYucmVjdCYmdGhpcy5kcmF3RXJhc2VyKHsuLi5mLHNjZW5lUGF0aDpzfSksYy5jbGVhclRtcFBvaW50cygpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjp0aGlzLmRyYXdQZW5jaWxGdWxsKHsuLi5mLHNjZW5lUGF0aDpzfSxjLmdldFdvcmtPcHRpb25zKCksdyksdGhpcy5kcmF3Q291bnQ9MCx0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKHIpO2JyZWFrO2Nhc2UgUy5QZW5jaWw6ZiE9bnVsbCYmZi5yZWN0JiYodGhpcy5kcmF3UGVuY2lsRnVsbCh7Li4uZixzY2VuZVBhdGg6c30sYy5nZXRXb3JrT3B0aW9ucygpLHcpLHRoaXMuZHJhd0NvdW50PTApLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUocik7YnJlYWt9fX1hc3luYyBjb25zdW1lRnVsbChlLHQpe3ZhciBuLGE7Y29uc3Qgcj10aGlzLnNldEZ1bGxXb3JrKGUpLGk9ZS5vcHMmJnFlKGUub3BzKSxzPShuPWUud29ya0lkKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpO2lmKHMmJnIpe2NvbnN0IGw9KGE9dGhpcy52Tm9kZXMuZ2V0KHMpKT09bnVsbD92b2lkIDA6YS5yZWN0O2xldCBjO3IudG9vbHNUeXBlPT09Uy5JbWFnZSYmdD9jPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7c2NlbmU6dCxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDpzfSk6Yz1yLmNvbnN1bWVTZXJ2aWNlKHtvcDppLGlzRnVsbFdvcms6ITAscmVwbGFjZUlkOnN9KTtjb25zdCB1PShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtjPUEoYyx1KTtjb25zdCBoPVtdLGQ9W107aWYoYyYmZS53aWxsUmVmcmVzaCYmKGwmJmgucHVzaCh7cmVjdDpjLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pLGgucHVzaCh7cmVjdDpjLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pKSxlLndpbGxTeW5jU2VydmljZSYmZC5wdXNoKHtvcHQ6ZS5vcHQsdG9vbHNUeXBlOmUudG9vbHNUeXBlLHR5cGU6bS5GdWxsV29yayx3b3JrSWQ6ZS53b3JrSWQsb3BzOmUub3BzLHVwZGF0ZU5vZGVPcHQ6ZS51cGRhdGVOb2RlT3B0LHVuZG9UaWNrZXJJZDplLnVuZG9UaWNrZXJJZCx2aWV3SWQ6dGhpcy52aWV3SWR9KSxoLmxlbmd0aHx8ZC5sZW5ndGgpe2NvbnN0IGY9e3JlbmRlcjpoLHNwOmR9O3RoaXMuX3Bvc3QoZil9ZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpfX1yZW1vdmVXb3JrKGUpe2NvbnN0e3dvcmtJZDp0fT1lLHI9dD09bnVsbD92b2lkIDA6dC50b1N0cmluZygpO2lmKHIpe2NvbnN0IGk9dGhpcy5yZW1vdmVOb2RlKHIpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfV19KX19cmVtb3ZlTm9kZShlKXt2YXIgaTt0aGlzLndvcmtTaGFwZXMuaGFzKGUpJiZ0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKGUpO2xldCB0O2NvbnN0IHI9dGhpcy52Tm9kZXMuZ2V0KGUpO3JldHVybiByJiYodGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoZSkuY29uY2F0KCgoaT10aGlzLmRyYXdMYXllcik9PW51bGw/dm9pZCAwOmkuZ2V0RWxlbWVudHNCeU5hbWUoZSkpfHxbXSkuZm9yRWFjaChzPT57cy5yZW1vdmUoKX0pLHQ9QSh0LHIucmVjdCksdGhpcy52Tm9kZXMuZGVsZXRlKGUpKSx0fWFzeW5jIGNoZWNrVGV4dEFjdGl2ZShlKXtjb25zdHtvcDp0LHZpZXdJZDpyLGRhdGFUeXBlOml9PWU7aWYodCE9bnVsbCYmdC5sZW5ndGgpe2xldCBzO2Zvcihjb25zdCBuIG9mIHRoaXMudk5vZGVzLmN1ck5vZGVNYXAudmFsdWVzKCkpe2NvbnN0e3JlY3Q6YSxuYW1lOmwsdG9vbHNUeXBlOmMsb3B0OnV9PW4saD10WzBdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLGQ9dFsxXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXTtpZihjPT09Uy5UZXh0JiZHaChbaCxkXSxhKSYmdS53b3JrU3RhdGU9PT1GLkRvbmUpe3M9bDticmVha319cyYmKGF3YWl0IHRoaXMuYmx1clNlbGVjdG9yKHt2aWV3SWQ6cixtc2dUeXBlOm0uU2VsZWN0LGRhdGFUeXBlOmksaXNTeW5jOiEwfSksYXdhaXQgdGhpcy5fcG9zdCh7c3A6W3t0eXBlOm0uR2V0VGV4dEFjdGl2ZSx0b29sc1R5cGU6Uy5UZXh0LHdvcmtJZDpzfV19KSl9fWFzeW5jIGNvbGxvY3RFZmZlY3RTZWxlY3RXb3JrKGUpe2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHt3b3JrSWQ6cixtc2dUeXBlOml9PWU7aWYodCYmciYmdC5zZWxlY3RJZHMmJnQuc2VsZWN0SWRzLmluY2x1ZGVzKHIudG9TdHJpbmcoKSkpe2k9PT1tLlJlbW92ZU5vZGU/dC5zZWxlY3RJZHM9dC5zZWxlY3RJZHMuZmlsdGVyKHM9PnMhPT1yLnRvU3RyaW5nKCkpOnRoaXMuZWZmZWN0U2VsZWN0Tm9kZURhdGEuYWRkKGUpLGF3YWl0IG5ldyBQcm9taXNlKHM9PntzZXRUaW1lb3V0KCgpPT57cyghMCl9LDApfSksYXdhaXQgdGhpcy5ydW5FZmZlY3RTZWxlY3RXb3JrKCEwKS50aGVuKCgpPT57dmFyIHM7KHM9dGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YSk9PW51bGx8fHMuY2xlYXIoKX0pO3JldHVybn1yZXR1cm4gZX1hc3luYyB1cGRhdGVTZWxlY3RvcihlKXt2YXIgUDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighKChQPXQ9PW51bGw/dm9pZCAwOnQuc2VsZWN0SWRzKSE9bnVsbCYmUC5sZW5ndGgpKXJldHVybjtjb25zdHtjYWxsYmFjazpyLC4uLml9PWUse3VwZGF0ZVNlbGVjdG9yT3B0OnMsd2lsbFJlZnJlc2hTZWxlY3RvcjpuLHdpbGxTZXJpYWxpemVEYXRhOmEsZW1pdEV2ZW50VHlwZTpsLHNjZW5lOmN9PWksdT1zLndvcmtTdGF0ZSxoPWF3YWl0KHQ9PW51bGw/dm9pZCAwOnQudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnMsc2VsZWN0SWRzOnQuc2VsZWN0SWRzLHZOb2Rlczp0aGlzLnZOb2Rlcyx3aWxsU2VyaWFsaXplRGF0YTphLHdvcmtlcjp0aGlzLHNjZW5lOmN9KSksZD1oPT1udWxsP3ZvaWQgMDpoLnNlbGVjdFJlY3QsZj1uZXcgTWFwO3Quc2VsZWN0SWRzLmZvckVhY2goaz0+e2NvbnN0IE89dGhpcy52Tm9kZXMuZ2V0KGspO2lmKE8pe2NvbnN0e3Rvb2xzVHlwZTpJLG9wOmIsb3B0OnZ9PU87Zi5zZXQoayx7b3B0OnYsdG9vbHNUeXBlOkksb3BzOihiPT1udWxsP3ZvaWQgMDpiLmxlbmd0aCkmJmxlKGIpfHx2b2lkIDB9KX19KTtjb25zdCB3PVtdLHk9W107aWYobil7dy5wdXNoKHtpc0NsZWFyQWxsOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcix2aWV3SWQ6dGhpcy52aWV3SWR9KTtjb25zdCBrPXtyZWN0OmQsaXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfTtzLnRyYW5zbGF0ZSYmbD09PUIuVHJhbnNsYXRlTm9kZSYmdT09PUYuRG9pbmcmJihrLnRyYW5zbGF0ZT1zLnRyYW5zbGF0ZSksdy5wdXNoKGspfWNvbnN0IGc9ciYmcih7cmVzOmgsd29ya1NoYXBlTm9kZTp0LHBhcmFtOmkscG9zdERhdGE6e3JlbmRlcjp3LHNwOnl9LG5ld1NlcnZpY2VTdG9yZTpmfSl8fHtyZW5kZXI6dyxzcDp5fTsoZy5yZW5kZXIubGVuZ3RofHxnLnNwLmxlbmd0aCkmJnRoaXMuX3Bvc3QoZyl9YXN5bmMgYmx1clNlbGVjdG9yKGUpe3ZhciBpO2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHI9dD09bnVsbD92b2lkIDA6dC5ibHVyU2VsZWN0b3IoKTtpZih0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKEUuc2VsZWN0b3JJZCksKChpPXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6aS5wYXJlbnQpLmNoaWxkcmVuLmZvckVhY2gocz0+e3MubmFtZT09PUUuc2VsZWN0b3JJZCYmcy5yZW1vdmUoKX0pLHIpe2NvbnN0IHM9W107cy5wdXNoKHsuLi5yLHVuZG9UaWNrZXJJZDplPT1udWxsP3ZvaWQgMDplLnVuZG9UaWNrZXJJZCxpc1N5bmM6ZT09bnVsbD92b2lkIDA6ZS5pc1N5bmN9KSxhd2FpdCB0aGlzLl9wb3N0KHtyZW5kZXI6KHI9PW51bGw/dm9pZCAwOnIucmVjdCkmJlt7cmVjdDpyLnJlY3QsZHJhd0NhbnZhczpOLkJnLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnN9KX19cmVSZW5kZXJTZWxlY3RvcihlPSExKXt2YXIgcjtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZih0KXtpZih0JiYhKChyPXQuc2VsZWN0SWRzKSE9bnVsbCYmci5sZW5ndGgpKXJldHVybiB0aGlzLmJsdXJTZWxlY3RvcigpO2lmKHRoaXMuZHJhd0xheWVyKXtjb25zdCBpPXQucmVSZW5kZXJTZWxlY3RvcigpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3RvcixkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfV0sc3A6W3t0eXBlOm0uU2VsZWN0LHNlbGVjdElkczp0LnNlbGVjdElkcyxzZWxlY3RSZWN0Omksd2lsbFN5bmNTZXJ2aWNlOmUsdmlld0lkOnRoaXMudmlld0lkLHBvaW50czp0LmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDp0LnRleHRPcHR9XX0pfX19dXBkYXRlRnVsbFNlbGVjdFdvcmsoZSl7dmFyIGkscyxuLGEsbCxjLHUsaDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKSx7c2VsZWN0SWRzOnJ9PWU7aWYoIShyIT1udWxsJiZyLmxlbmd0aCkpe3RoaXMuYmx1clNlbGVjdG9yKGUpO3JldHVybn1pZighdCl7IXRoaXMuc2V0RnVsbFdvcmsoZSkmJmUud29ya0lkJiYoKGk9dGhpcy50bXBXb3JrU2hhcGVOb2RlKT09bnVsbD92b2lkIDA6aS50b29sc1R5cGUpPT09Uy5TZWxlY3RvciYmdGhpcy5zZXRUbXBXb3JrSWQoZS53b3JrSWQpLHRoaXMudXBkYXRlRnVsbFNlbGVjdFdvcmsoZSk7cmV0dXJufWlmKHQmJihyIT1udWxsJiZyLmxlbmd0aCkpe2NvbnN0e2JnUmVjdDpkLHNlbGVjdFJlY3Q6Zn09dC51cGRhdGVTZWxlY3RJZHMociksdz17cmVuZGVyOltdLHNwOltdfTtkJiYoKHM9dy5yZW5kZXIpPT1udWxsfHxzLnB1c2goe3JlY3Q6SyhkKSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSkpLChuPXcucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmYsaXNDbGVhcjohMCxpc0Z1bGxXb3JrOiExLGNsZWFyQ2FudmFzOk4uU2VsZWN0b3IsZHJhd0NhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLnZpZXdJZH0pLChoPXcuc3ApPT1udWxsfHxoLnB1c2goey4uLmUsc2VsZWN0b3JDb2xvcjooKGE9ZS5vcHQpPT1udWxsP3ZvaWQgMDphLnN0cm9rZUNvbG9yKXx8dC5zZWxlY3RvckNvbG9yLHN0cm9rZUNvbG9yOigobD1lLm9wdCk9PW51bGw/dm9pZCAwOmwuc3Ryb2tlQ29sb3IpfHx0LnN0cm9rZUNvbG9yLGZpbGxDb2xvcjooKGM9ZS5vcHQpPT1udWxsP3ZvaWQgMDpjLmZpbGxDb2xvcil8fHQuZmlsbENvbG9yLHRleHRPcHQ6KCh1PWUub3B0KT09bnVsbD92b2lkIDA6dS50ZXh0T3B0KXx8dC50ZXh0T3B0LGNhblRleHRFZGl0OnQuY2FuVGV4dEVkaXQsY2FuUm90YXRlOnQuY2FuUm90YXRlLHNjYWxlVHlwZTp0LnNjYWxlVHlwZSx0eXBlOm0uU2VsZWN0LHNlbGVjdFJlY3Q6Zixwb2ludHM6dC5nZXRDaGlsZHJlblBvaW50cygpLHdpbGxTeW5jU2VydmljZTooZT09bnVsbD92b2lkIDA6ZS53aWxsU3luY1NlcnZpY2UpfHwhMSxvcHQ6KGU9PW51bGw/dm9pZCAwOmUud2lsbFN5bmNTZXJ2aWNlKSYmdC5nZXRXb3JrT3B0aW9ucygpfHx2b2lkIDAsY2FuTG9jazp0LmNhbkxvY2ssaXNMb2NrZWQ6dC5pc0xvY2tlZCx0b29sc1R5cGVzOnQudG9vbHNUeXBlcyxzaGFwZU9wdDp0LnNoYXBlT3B0fSksdGhpcy5fcG9zdCh3KX19ZGVzdHJveSgpe3N1cGVyLmRlc3Ryb3koKSx0aGlzLmVmZmVjdFNlbGVjdE5vZGVEYXRhLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlcldvcmtzLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlclJlbW92ZU5vZGVzLmNsZWFyKCl9ZHJhd1BlbmNpbENvbWJpbmUoZSl7dmFyIHIsaTtjb25zdCB0PShyPXRoaXMud29ya1NoYXBlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpyLmNvbWJpbmVDb25zdW1lKCk7aWYodCl7Y29uc3Qgcz17cmVuZGVyOltdLGRyYXdDb3VudDp0aGlzLmRyYXdDb3VudH07KGk9cy5yZW5kZXIpPT1udWxsfHxpLnB1c2goe3JlY3Q6KHQ9PW51bGw/dm9pZCAwOnQucmVjdCkmJksodC5yZWN0KSxpc0NsZWFyOiEwLGRyYXdDYW52YXM6Ti5GbG9hdCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSksdGhpcy5fcG9zdChzKX19ZHJhd1NlbGVjdG9yKGUsdCl7dmFyIGkscztjb25zdCByPXtyZW5kZXI6W10sc3A6W2VdfTtlLnR5cGU9PT1tLlNlbGVjdCYmIXQmJigoaT1yLnJlbmRlcik9PW51bGx8fGkucHVzaCh7cmVjdDplLnNlbGVjdFJlY3QsZHJhd0NhbnZhczpOLlNlbGVjdG9yLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcixpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0se3JlY3Q6ZS5yZWN0JiZLKGUucmVjdCksaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHQmJigocz1yLnJlbmRlcik9PW51bGx8fHMucHVzaCh7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uRmxvYXQsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHRoaXMuX3Bvc3Qocil9YXN5bmMgZHJhd0VyYXNlcihlKXt2YXIgcixpO2NvbnN0IHQ9W107aWYoKHI9ZS5uZXdXb3JrRGF0YXMpIT1udWxsJiZyLnNpemUpe2Zvcihjb25zdCBzIG9mIGUubmV3V29ya0RhdGFzLnZhbHVlcygpKXtjb25zdCBuPXMud29ya0lkLnRvU3RyaW5nKCk7dGhpcy5iYXRjaEVyYXNlcldvcmtzLmFkZChuKSx0LnB1c2goe3R5cGU6bS5GdWxsV29yayx3b3JrSWQ6bixvcHM6bGUocy5vcCksb3B0OnMub3B0LHRvb2xzVHlwZTpzLnRvb2xzVHlwZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9fSl9ZGVsZXRlIGUubmV3V29ya0RhdGFzfShpPWUucmVtb3ZlSWRzKT09bnVsbHx8aS5mb3JFYWNoKHM9Pnt0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMuYWRkKHMpfSksdC5wdXNoKGUpLHRoaXMuX3Bvc3Qoe3NwOnR9KSx0aGlzLmJhdGNoRXJhc2VyQ29tYmluZSgpfWRyYXdQZW5jaWwoZSl7dGhpcy5fcG9zdCh7ZHJhd0NvdW50OnRoaXMuZHJhd0NvdW50LHNwOihlPT1udWxsP3ZvaWQgMDplLm9wKSYmW2VdfSl9ZHJhd1BlbmNpbEZ1bGwoZSx0LHIpe3ZhciBuO2xldCBpPShyPT1udWxsP3ZvaWQgMDpyLndpbGxDbGVhcil8fCh0PT1udWxsP3ZvaWQgMDp0LmlzT3BhY2l0eSl8fCExOyFpJiZlLnJlY3QmJihpPXRoaXMudk5vZGVzLmhhc1JlY3RJbnRlcnNlY3RSYW5nZShlLnJlY3QpKTtjb25zdCBzPXtkcmF3Q291bnQ6MS8wLHJlbmRlcjpbe3JlY3Q6ZS5yZWN0LGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOmksY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOltlXX07KG49cy5yZW5kZXIpPT1udWxsfHxuLnB1c2goe2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMuX3Bvc3Qocyl9dXBkYXRlQmF0Y2hFcmFzZXJDb21iaW5lTm9kZShlLHQpe2NvbnN0IHI9W107bGV0IGk7Zm9yKGNvbnN0IHMgb2YgdC5rZXlzKCkpdGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUocykuZm9yRWFjaChuPT57Y29uc3QgYT1uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2k9QShpLHt4OmEueC1uZS5TYWZlQm9yZGVyUGFkZGluZyx5OmEueS1uZS5TYWZlQm9yZGVyUGFkZGluZyx3OmEud2lkdGgrbmUuU2FmZUJvcmRlclBhZGRpbmcqMixoOmEuaGVpZ2h0K25lLlNhZmVCb3JkZXJQYWRkaW5nKjJ9KSxuLnJlbW92ZSgpfSk7cmV0dXJuIGUuZm9yRWFjaChzPT57Y29uc3Qgbj10aGlzLnZOb2Rlcy5nZXQocyk7aWYobilpZih0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShzKVswXSlpPUEoaSxuLnJlY3QpO2Vsc2V7Y29uc3QgbD10aGlzLnNldEZ1bGxXb3JrKHsuLi5uLHdvcmtJZDpzfSksYz1sJiZsLmNvbnN1bWVTZXJ2aWNlKHtvcDpuLm9wLGlzRnVsbFdvcms6ITB9KTtjJiYobi5yZWN0PWMsaT1BKGksYykpfX0pLGkmJnIucHVzaCh7cmVjdDppLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMCxjbGVhckNhbnZhczpOLkJnLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSxyfWFzeW5jIHJ1bkVmZmVjdFNlbGVjdFdvcmsoZSl7dmFyIHQscixpLHM7Zm9yKGNvbnN0IG4gb2YgdGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YS52YWx1ZXMoKSl7Y29uc3QgYT10aGlzLnNldEZ1bGxXb3JrKG4pO2lmKGEpe2lmKGEudG9vbHNUeXBlPT09Uy5JbWFnZSlhd2FpdCBhLmNvbnN1bWVTZXJ2aWNlQXN5bmMoe3NjZW5lOihyPSh0PXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6dC5wYXJlbnQpPT1udWxsP3ZvaWQgMDpyLnBhcmVudCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaT1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpfSk7ZWxzZXtjb25zdCBsPW4ub3BzJiZxZShuLm9wcyk7YS5jb25zdW1lU2VydmljZSh7b3A6bCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDoocz1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6cy50b1N0cmluZygpfSl9biE9bnVsbCYmbi51cGRhdGVOb2RlT3B0JiZhLnVwZGF0YU9wdFNlcnZpY2Uobi51cGRhdGVOb2RlT3B0KSxuLndvcmtJZCYmdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShuLndvcmtJZCl9fXRoaXMucmVSZW5kZXJTZWxlY3RvcihlKX1jdXJzb3JIb3ZlcihlKXt2YXIgbjtjb25zdHtvcHQ6dCx0b29sc1R5cGU6cixwb2ludDppfT1lLHM9dGhpcy5zZXRGdWxsV29yayh7d29ya0lkOktlLHRvb2xzVHlwZTpyLG9wdDp0fSk7aWYocyYmaSl7Y29uc3QgYT1zLmN1cnNvckhvdmVyKGkpLGw9e3JlbmRlcjpbXX07YSYmYS50eXBlPT09bS5DdXJzb3JIb3ZlciYmKChuPWwucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmEucmVjdCYmSyhhLnJlY3QpLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLl9wb3N0KGwpKX19fWNsYXNzIHVwe2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidk5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VsZWN0b3JXb3JrU2hhcGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJhbmltYXRpb25JZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgU2V0fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInJ1bkVmZmVjdElkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm5vQW5pbWF0aW9uUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJwb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy52aWV3SWQ9ZS52aWV3SWQsdGhpcy52Tm9kZXM9ZS52Tm9kZXMsdGhpcy5mdWxsTGF5ZXI9ZS5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXI9ZS5zZXJ2aWNlRHJhd0xheWVyLHRoaXMucG9zdD1lLnBvc3R9ZGVzdHJveSgpe3RoaXMud29ya1NoYXBlcy5jbGVhcigpLHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmNsZWFyKCksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuY2xlYXIoKX1jb25zdW1lRHJhdyhlKXt0aGlzLmFjdGl2ZVdvcmtTaGFwZShlKSx0aGlzLnJ1bkFuaW1hdGlvbigpfWNvbnN1bWVGdWxsKGUpe3RoaXMuYWN0aXZlV29ya1NoYXBlKGUpLHRoaXMucnVuQW5pbWF0aW9uKCl9Y2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKXt0aGlzLndvcmtTaGFwZXMuZm9yRWFjaCgoZSx0KT0+e2UudG9vbHNUeXBlPT09Uy5MYXNlclBlbj9zZXRUaW1lb3V0KCgpPT57dGhpcy53b3JrU2hhcGVzLmRlbGV0ZSh0KX0sMmUzKTp0aGlzLndvcmtTaGFwZXMuZGVsZXRlKHQpfSl9cnVuU2VsZWN0V29yayhlKXt0aGlzLmFjdGl2ZVNlbGVjdG9yU2hhcGUoZSk7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKHIpLHRoaXMucnVuRWZmZWN0KCl9c2V0Tm9kZUtleShlLHQscil7cmV0dXJuIGUudG9vbHNUeXBlPXQsZS5ub2RlPWJ0KHt0b29sc1R5cGU6dCx0b29sc09wdDpyLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfSx0aGlzKSxlfXJ1blJldmVyc2VTZWxlY3RXb3JrKGUpe2UuZm9yRWFjaCh0PT57dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZm9yRWFjaCgocixpKT0+e3ZhciBzO2lmKChzPXIuc2VsZWN0SWRzKSE9bnVsbCYmcy5sZW5ndGgpe2NvbnN0IG49ci5zZWxlY3RJZHMuaW5kZXhPZih0KTtuPi0xJiYoci5zZWxlY3RJZHMuc3BsaWNlKG4sMSksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKGkpKX19KX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLnNpemUmJnRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlV29yayhlKXtjb25zdHt3b3JrSWQ6dH09ZSxyPXQ9PW51bGw/dm9pZCAwOnQudG9TdHJpbmcoKTtpZihyKXtjb25zdCBpPXRoaXMud29ya1NoYXBlcy5nZXQocik7aWYoaSl7dGhpcy53b3JrU2hhcGVzLmRlbGV0ZShyKSx0aGlzLnJlbW92ZU5vZGUocixlLGk9PW51bGw/dm9pZCAwOmkudG90YWxSZWN0LCExKTtyZXR1cm59dGhpcy5yZW1vdmVOb2RlKHIsZSl9fXJlbW92ZVNlbGVjdFdvcmsoZSl7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmKHRoaXMuYWN0aXZlU2VsZWN0b3JTaGFwZShlKSx0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQocikpLHRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlTm9kZShlLHQscixpPSEwKXt2YXIgYztjb25zdCBzPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGUpLmNvbmNhdCh0aGlzLmRyYXdMYXllci5nZXRFbGVtZW50c0J5TmFtZShlKSk7ZS5pbmRleE9mKEUuc2VsZWN0b3JJZCk+LTEmJnRoaXMucmVtb3ZlU2VsZWN0V29yayh0KTtjb25zdCBuPVtdO2xldCBhPXI7Y29uc3QgbD0oYz10aGlzLnZOb2Rlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpjLnJlY3Q7bCYmKGE9QShsLGEpKSxzLmZvckVhY2godT0+e24ucHVzaCh1KX0pLG4ubGVuZ3RoJiZuLmZvckVhY2godT0+dS5yZW1vdmUoKSksYSYmKHRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGEpLGlzQ2xlYXI6ITAsaXNGdWxsV29yazppLGNsZWFyQ2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCxkcmF3Q2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCx3b3JrZXJUeXBlOmk/dm9pZCAwOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMudk5vZGVzLmRlbGV0ZShlKSl9YWN0aXZlV29ya1NoYXBlKGUpe3ZhciBkLGYsdyx5O2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsb3A6bCx1c2VBbmltYXRpb246Y309ZTtpZighdClyZXR1cm47Y29uc3QgdT10LnRvU3RyaW5nKCk7aWYoISgoZD10aGlzLndvcmtTaGFwZXMpIT1udWxsJiZkLmhhcyh1KSkpe2xldCBnPXt0b29sc1R5cGU6aSxhbmltYXRpb25Xb3JrRGF0YTpsfHxbXSxhbmltYXRpb25JbmRleDowLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsdXNlQW5pbWF0aW9uOnR5cGVvZiBjPCJ1Ij9jOnR5cGVvZihuPT1udWxsP3ZvaWQgMDpuLnVzZUFuaW1hdGlvbik8InUiP249PW51bGw/dm9pZCAwOm4udXNlQW5pbWF0aW9uOiEwLG9sZFJlY3Q6KGY9dGhpcy52Tm9kZXMuZ2V0KHUpKT09bnVsbD92b2lkIDA6Zi5yZWN0LGlzRGlmZjohMX07aSYmciYmKGc9dGhpcy5zZXROb2RlS2V5KGcsaSxyKSksKHc9dGhpcy53b3JrU2hhcGVzKT09bnVsbHx8dy5zZXQodSxnKX1jb25zdCBoPSh5PXRoaXMud29ya1NoYXBlcyk9PW51bGw/dm9pZCAwOnkuZ2V0KHUpO3MmJihoLnR5cGU9cyksYSYmKGguYW5pbWF0aW9uV29ya0RhdGE9cWUoYSksaC5vcHM9YSksbiYmKGgudXBkYXRlTm9kZU9wdD1uKSxsJiYoaC5pc0RpZmY9dGhpcy5oYXNEaWZmRGF0YShoLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxsLGgudG9vbHNUeXBlKSxoLmFuaW1hdGlvbldvcmtEYXRhPWwpLGgubm9kZSYmaC5ub2RlLmdldFdvcmtJZCgpIT09dSYmaC5ub2RlLnNldFdvcmtJZCh1KSxpJiZyJiYoaC50b29sc1R5cGUhPT1pJiZpJiZyJiZ0aGlzLnNldE5vZGVLZXkoaCxpLHIpLGgubm9kZSYmaC5ub2RlLnNldFdvcmtPcHRpb25zKHIpKX1oYXNEaWZmRGF0YShlLHQscil7Y29uc3QgaT1lLmxlbmd0aDtpZih0Lmxlbmd0aDxpKXJldHVybiEwO3N3aXRjaChyKXtjYXNlIFMuUGVuY2lsOntmb3IobGV0IHM9MDtzPGk7cys9MylpZih0W3NdIT09ZVtzXXx8dFtzKzFdIT09ZVtzKzFdKXJldHVybiEwO2JyZWFrfWNhc2UgUy5MYXNlclBlbjp7Zm9yKGxldCBzPTA7czxpO3MrPTIpaWYodFtzXSE9PWVbc118fHRbcysxXSE9PWVbcysxXSlyZXR1cm4hMDticmVha319cmV0dXJuITF9YXN5bmMgYW5pbWF0aW9uRHJhdygpe3ZhciBsLGMsdSxoLGQsZix3LHksZyxQLGssTyxJLGIsdixMLFQsTSwkLEQsSCxWLGVlLHNlLG5vLGFvLGxvLGNvLHVvLGhvO3RoaXMuYW5pbWF0aW9uSWQ9dm9pZCAwO2xldCBlPSExO2NvbnN0IHQ9bmV3IE1hcCxyPVtdLGk9W10scz1bXSxuPVtdO2Zvcihjb25zdFtqLENdb2YgdGhpcy53b3JrU2hhcGVzLmVudHJpZXMoKSlzd2l0Y2goQy50b29sc1R5cGUpe2Nhc2UgUy5JbWFnZTp7Y29uc3QgXz1DLm9sZFJlY3Q7XyYmcy5wdXNoKHtyZWN0Ol8saXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2NvbnN0IFo9YXdhaXQoKGM9Qy5ub2RlKT09bnVsbD92b2lkIDA6Yy5jb25zdW1lU2VydmljZUFzeW5jKHtpc0Z1bGxXb3JrOiEwLHNjZW5lOihsPXRoaXMuZnVsbExheWVyLnBhcmVudCk9PW51bGw/dm9pZCAwOmwucGFyZW50fSkpO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PUEodGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopLHIucHVzaCh7cmVjdDpaLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2JyZWFrfWNhc2UgUy5UZXh0OntpZihDLm5vZGUpe2NvbnN0IF89Qy5vbGRSZWN0LFo9KHU9Qy5ub2RlKT09bnVsbD92b2lkIDA6dS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMH0pO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PUEodGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSwoaD1DLm5vZGUpPT1udWxsfHxoLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX1icmVha31jYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246e2NvbnN0IF89ISFDLm9wcztpZigoZD1DLmFuaW1hdGlvbldvcmtEYXRhKSE9bnVsbCYmZC5sZW5ndGgpe2NvbnN0IFo9Qy5vbGRSZWN0LHRlPUMubm9kZS5vbGRSZWN0O1omJnMucHVzaCh7cmVjdDpaLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0ZSYmbi5wdXNoKHtyZWN0OnRlLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSk7Y29uc3QgSj0oZj1DLm5vZGUpPT1udWxsP3ZvaWQgMDpmLmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhLGlzRnVsbFdvcms6X30pO3Quc2V0KGose3dvcmtTdGF0ZTpaP0Mub3BzP0YuRG9uZTpGLkRvaW5nOkYuU3RhcnQsb3A6Qy5hbmltYXRpb25Xb3JrRGF0YS5maWx0ZXIoKFksZGUpPT57aWYoZGUlMyE9PTIpcmV0dXJuITB9KS5zbGljZSgtMil9KSxfPyh0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKChZLGRlKT0+e3ZhciBSZTsoUmU9WS5zZWxlY3RJZHMpIT1udWxsJiZSZS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChkZSksdGhpcy5ub0FuaW1hdGlvblJlY3Q9QSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxaKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LHRlKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LEopLHRoaXMucnVuRWZmZWN0KCkpfSksKHc9Qy5ub2RlKT09bnVsbHx8dy5jbGVhclRtcFBvaW50cygpLHRoaXMud29ya1NoYXBlcy5kZWxldGUoaiksci5wdXNoKHtyZWN0OkosZHJhd0NhbnZhczpOLkJnLGlzRnVsbFdvcms6Xyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkMuYW5pbWF0aW9uV29ya0RhdGEuZmlsdGVyKChZLGRlKT0+e2lmKGRlJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpfSkpOmkucHVzaCh7cmVjdDpKLGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsd29ya2VyVHlwZTpfP3ZvaWQgMDpXLlNlcnZpY2UsaXNGdWxsV29yazpfLHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uV29ya0RhdGEubGVuZ3RoPTB9YnJlYWt9Y2FzZSBTLlBlbmNpbDp7aWYoIUMudXNlQW5pbWF0aW9uJiZDLm9wcyl7bGV0IF89KHk9Qy5ub2RlKT09bnVsbD92b2lkIDA6eS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMCxyZXBsYWNlSWQ6an0pO2NvbnN0IFo9KGc9Qy5ub2RlKT09bnVsbD92b2lkIDA6Zy51cGRhdGFPcHRTZXJ2aWNlKEMudXBkYXRlTm9kZU9wdCk7Xz1BKF8sWikscy5wdXNoKHtyZWN0OkEoQy5vbGRSZWN0LF8pLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0OkEoQy5vbGRSZWN0LF8pLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKCh0ZSxKKT0+e3ZhciBZOyhZPXRlLnNlbGVjdElkcykhPW51bGwmJlkuaW5jbHVkZXMoaikmJih0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQoSiksdGhpcy5ub0FuaW1hdGlvblJlY3Q9QSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxfKSx0aGlzLnJ1bkVmZmVjdCgpKX0pLChQPUMubm9kZSk9PW51bGx8fFAuY2xlYXJUbXBQb2ludHMoKSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopfWVsc2UgaWYoQy51c2VBbmltYXRpb24pe2NvbnN0IFo9dGhpcy5jb21wdXROZXh0QW5pbWF0aW9uSW5kZXgoQywzKSx0ZT1DLmlzRGlmZj8wOk1hdGgubWF4KDAsKEMuYW5pbWF0aW9uSW5kZXh8fDApLTMpLEo9KEMuYW5pbWF0aW9uV29ya0RhdGF8fFtdKS5zbGljZSh0ZSxaKTtpZihDLmlzRGVsKUMuaXNEZWwmJigoTT1DLm5vZGUpPT1udWxsfHxNLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKSk7ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wnx8Qy5pc0RpZmYpe2NvbnN0IFk9KE89Qy5ub2RlKT09bnVsbD92b2lkIDA6Ty5jb25zdW1lU2VydmljZSh7b3A6Sixpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaz1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDprLnRvU3RyaW5nKCl9KTtpZihpLnB1c2goe3JlY3Q6WSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uSW5kZXg9WixDLmlzRGlmZiYmKEMuaXNEaWZmPSExKSxKLmxlbmd0aCl7Y29uc3QgZGU9Si5maWx0ZXIoKFJlLHdwKT0+e2lmKHdwJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpO3Quc2V0KGose3dvcmtTdGF0ZTp0ZT09PTA/Ri5TdGFydDpaPT09KChJPUMuYW5pbWF0aW9uV29ya0RhdGEpPT1udWxsP3ZvaWQgMDpJLmxlbmd0aCk/Ri5Eb25lOkYuRG9pbmcsb3A6ZGV9KX19ZWxzZSBpZihDLm9wcyl7Y29uc3QgWT0odj1DLm5vZGUpPT1udWxsP3ZvaWQgMDp2LmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDooYj1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDpiLnRvU3RyaW5nKCl9KTtDLmlzRGVsPSEwLG4ucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLChMPUMubm9kZSkhPW51bGwmJkwuZ2V0V29ya09wdGlvbnMoKS5pc09wYWNpdHkmJnMucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0OlksZHJhd0NhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMudk5vZGVzLnNldEluZm8oaix7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YSxvcHQ6KFQ9Qy5ub2RlKT09bnVsbD92b2lkIDA6VC5nZXRXb3JrT3B0aW9ucygpLHRvb2xzVHlwZTpDLnRvb2xzVHlwZSxyZWN0Oll9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkouZmlsdGVyKChkZSxSZSk9PntpZihSZSUzIT09MilyZXR1cm4hMH0pLnNsaWNlKC0yKX0pfWU9ITB9YnJlYWt9YnJlYWt9Y2FzZSBTLkxhc2VyUGVuOntjb25zdCBaPXRoaXMuY29tcHV0TmV4dEFuaW1hdGlvbkluZGV4KEMsMiksdGU9TWF0aC5tYXgoMCwoQy5hbmltYXRpb25JbmRleHx8MCktMiksSj0oQy5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKHRlLFopO2lmKEMuaXNEZWwpe2lmKEMuaXNEZWwpe2NvbnN0IFk9KHNlPUMubm9kZSk9PW51bGw/dm9pZCAwOnNlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9QShDLnRvdGFsUmVjdCxZKSxuLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksKG5vPUMubm9kZSk9PW51bGx8fG5vLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX19ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wil7Y29uc3QgWT0oRD1DLm5vZGUpPT1udWxsP3ZvaWQgMDpELmNvbnN1bWVTZXJ2aWNlKHtvcDpKLGlzRnVsbFdvcms6ITEscmVwbGFjZUlkOigkPUMubm9kZS5nZXRXb3JrSWQoKSk9PW51bGw/dm9pZCAwOiQudG9TdHJpbmcoKX0pO0MudG90YWxSZWN0PUEoQy50b3RhbFJlY3QsWSksQy50aW1lciYmKGNsZWFyVGltZW91dChDLnRpbWVyKSxDLnRpbWVyPXZvaWQgMCksQy5hbmltYXRpb25JbmRleD1aLEoubGVuZ3RoJiZ0LnNldChqLHt3b3JrU3RhdGU6dGU9PT0wP0YuU3RhcnQ6Wj09PSgoSD1DLmFuaW1hdGlvbldvcmtEYXRhKT09bnVsbD92b2lkIDA6SC5sZW5ndGgpP0YuRG9uZTpGLkRvaW5nLG9wOkouc2xpY2UoLTIpfSl9ZWxzZXtDLnRpbWVyfHwoQy50aW1lcj1zZXRUaW1lb3V0KCgpPT57Qy50aW1lcj12b2lkIDAsQy5pc0RlbD0hMCx0aGlzLnJ1bkFuaW1hdGlvbigpfSwoKFY9Qy5ub2RlKT09bnVsbD92b2lkIDA6Vi5nZXRXb3JrT3B0aW9ucygpKS5kdXJhdGlvbioxZTMrMTAwKSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOltdfSkpO2NvbnN0IFk9KGVlPUMubm9kZSk9PW51bGw/dm9pZCAwOmVlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9QShDLnRvdGFsUmVjdCxZKX1uLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksZT0hMH1icmVha319ZSYmdGhpcy5ydW5BbmltYXRpb24oKTtjb25zdCBhPXtyZW5kZXI6W119O2lmKHMubGVuZ3RoKXtjb25zdCBqPXMucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmNsZWFyQ2FudmFzPT09Ti5CZyYmKEMucmVjdD1BKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwoYW89YS5yZW5kZXIpPT1udWxsfHxhby5wdXNoKGopKX1pZihuLmxlbmd0aCl7Y29uc3Qgaj1uLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5jbGVhckNhbnZhcz09PU4uU2VydmljZUZsb2F0JiYoQy5yZWN0PUEoQy5yZWN0LF8ucmVjdCkpLEMpLHtpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwobG89YS5yZW5kZXIpPT1udWxsfHxsby5wdXNoKGopKX1pZihyLmxlbmd0aCl7Y29uc3Qgaj1yLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5kcmF3Q2FudmFzPT09Ti5CZyYmKEMucmVjdD1BKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMCxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSk7ai5yZWN0JiYoai5yZWN0PWoucmVjdCYmSyhqLnJlY3QpLChjbz1hLnJlbmRlcik9PW51bGx8fGNvLnB1c2goaikpfWlmKGkubGVuZ3RoKXtjb25zdCBqPWkucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmRyYXdDYW52YXM9PT1OLlNlcnZpY2VGbG9hdCYmKEMucmVjdD1BKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwodW89YS5yZW5kZXIpPT1udWxsfHx1by5wdXNoKGopKX10LnNpemUmJihhLnNwPVtdLHQuZm9yRWFjaCgoaixDKT0+e3ZhciBfOyhfPWEuc3ApPT1udWxsfHxfLnB1c2goe3R5cGU6bS5DdXJzb3IsdWlkOkMuc3BsaXQoVmgpWzBdLG9wOmoub3Asd29ya1N0YXRlOmoud29ya1N0YXRlLHZpZXdJZDp0aGlzLnZpZXdJZH0pfSkpLChobz1hLnJlbmRlcikhPW51bGwmJmhvLmxlbmd0aCYmdGhpcy5wb3N0KGEpfXJ1bkFuaW1hdGlvbigpe3RoaXMuYW5pbWF0aW9uSWR8fCh0aGlzLmFuaW1hdGlvbklkPXJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkRyYXcuYmluZCh0aGlzKSkpfWNvbXB1dE5leHRBbmltYXRpb25JbmRleChlLHQpe3ZhciBpO2NvbnN0IHI9TWF0aC5mbG9vcigoZS5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKGUuYW5pbWF0aW9uSW5kZXgpLmxlbmd0aCozMi90LygoKGk9ZS5ub2RlKT09bnVsbD92b2lkIDA6aS5zeW5jVW5pdFRpbWUpfHwxZTMpKSp0O3JldHVybiBNYXRoLm1pbigoZS5hbmltYXRpb25JbmRleHx8MCkrKHJ8fHQpLChlLmFuaW1hdGlvbldvcmtEYXRhfHxbXSkubGVuZ3RoKX1ydW5FZmZlY3QoKXt0aGlzLnJ1bkVmZmVjdElkfHwodGhpcy5ydW5FZmZlY3RJZD1zZXRUaW1lb3V0KHRoaXMuZWZmZWN0UnVuU2VsZWN0b3IuYmluZCh0aGlzKSwwKSl9ZWZmZWN0UnVuU2VsZWN0b3IoKXt0aGlzLnJ1bkVmZmVjdElkPXZvaWQgMDtsZXQgZT10aGlzLm5vQW5pbWF0aW9uUmVjdDt0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5mb3JFYWNoKHQ9Pnt2YXIgcyxuO2NvbnN0IHI9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZ2V0KHQpLGk9ciYmci5zZWxlY3RJZHMmJigocz1yLm5vZGUpPT1udWxsP3ZvaWQgMDpzLnNlbGVjdFNlcnZpY2VOb2RlKHQsciwhMCkpO2U9QShlLGkpLChuPXI9PW51bGw/dm9pZCAwOnIuc2VsZWN0SWRzKSE9bnVsbCYmbi5sZW5ndGh8fHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmRlbGV0ZSh0KX0pLGUmJnRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGUpLGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmNsZWFyKCksdGhpcy5ub0FuaW1hdGlvblJlY3Q9dm9pZCAwfWFjdGl2ZVNlbGVjdG9yU2hhcGUoZSl7dmFyIGMsdSxoO2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyxzZWxlY3RJZHM6bn09ZTtpZighdClyZXR1cm47Y29uc3QgYT10LnRvU3RyaW5nKCk7aWYoISgoYz10aGlzLnNlbGVjdG9yV29ya1NoYXBlcykhPW51bGwmJmMuaGFzKGEpKSl7bGV0IGQ9e3Rvb2xzVHlwZTppLHNlbGVjdElkczpuLHR5cGU6cyxvcHQ6cn07aSYmciYmKGQ9dGhpcy5zZXROb2RlS2V5KGQsaSxyKSksKHU9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsfHx1LnNldChhLGQpfWNvbnN0IGw9KGg9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsP3ZvaWQgMDpoLmdldChhKTtzJiYobC50eXBlPXMpLGwubm9kZSYmbC5ub2RlLmdldFdvcmtJZCgpIT09YSYmbC5ub2RlLnNldFdvcmtJZChhKSxsLnNlbGVjdElkcz1ufHxbXX19Y2xhc3MgaHAgZXh0ZW5kcyByb3tjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYW5pbWF0aW9uV29ya1JlY3RzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb21iaW5lRHJhd1RpbWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImFuaW1hdGlvbklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNsb3NlQW5pbWF0aW9uVGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjExMDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywicnVuTGFzZXJQZW5TdGVwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pfWFzeW5jIHJ1bkZ1bGxXb3JrKGUsdCl7dmFyIHMsbjtjb25zdCByPXRoaXMuc2V0RnVsbFdvcmsoZSksaT1lLm9wcyYmcWUoZS5vcHMpO2lmKHIpe2xldCBhO3IudG9vbHNUeXBlPT09Uy5JbWFnZT9hPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7aXNGdWxsV29yazohMCxzY2VuZToocz10aGlzLmZ1bGxMYXllci5wYXJlbnQpPT1udWxsP3ZvaWQgMDpzLnBhcmVudH0pOmE9ci5jb25zdW1lU2VydmljZSh7b3A6aSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDoobj1yLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpLGlzRHJhd0xhYmVsOnR9KTtjb25zdCBsPShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtyZXR1cm4gZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpLGx8fGF9fXJ1blNlbGVjdFdvcmsoZSl7dmFyIHI7Y29uc3QgdD10aGlzLnNldEZ1bGxXb3JrKGUpO3QmJigocj1lLnNlbGVjdElkcykhPW51bGwmJnIubGVuZ3RoKSYmZS53b3JrSWQmJnQuc2VsZWN0U2VydmljZU5vZGUoZS53b3JrSWQudG9TdHJpbmcoKSx7c2VsZWN0SWRzOmUuc2VsZWN0SWRzfSwhMSl9Y29uc3VtZURyYXcoZSl7dmFyIGk7Y29uc3R7b3A6dCx3b3JrSWQ6cn09ZTtpZih0IT1udWxsJiZ0Lmxlbmd0aCYmcil7Y29uc3Qgcz10aGlzLndvcmtTaGFwZXMuZ2V0KHIpO2lmKCFzKXJldHVybjtjb25zdCBuPXMudG9vbHNUeXBlLGE9cy5jb25zdW1lKHtkYXRhOmUsaXNGdWxsV29yazohMSxpc0NsZWFyQWxsOiEwLGlzU3ViV29ya2VyOiEwfSk7c3dpdGNoKG4pe2Nhc2UgUy5MYXNlclBlbjphIT1udWxsJiZhLnJlY3QmJigoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuc2V0KHIse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSksdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbigpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdBcnJvdyhhKSk7YnJlYWs7Y2FzZSBTLlBlbmNpbDphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrfX19Y29uc3VtZURyYXdBbGwoZSl7dmFyIHIsaTtjb25zdHt3b3JrSWQ6dH09ZTtpZih0KXtjb25zdCBzPXRoaXMud29ya1NoYXBlcy5nZXQodCk7aWYoIXMpcmV0dXJuO3N3aXRjaChzLnRvb2xzVHlwZSl7Y2FzZSBTLkxhc2VyUGVuOmlmKHRoaXMuYW5pbWF0aW9uSWQpe2NvbnN0IGE9cy5jb25zdW1lQWxsKHtkYXRhOmV9KTthIT1udWxsJiZhLm9wJiZhIT1udWxsJiZhLnJlY3QmJigocj10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fHIuc2V0KHQse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSx0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKGEpKTtjb25zdCBsPShpPXMuZ2V0V29ya09wdGlvbnMoKSk9PW51bGw/dm9pZCAwOmkuZHVyYXRpb247dGhpcy5jbG9zZUFuaW1hdGlvblRpbWU9bD9sKjFlMysxMDA6dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUsc2V0VGltZW91dCgoKT0+e3ZhciB1O3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQudG9TdHJpbmcoKSkubWFwKGg9PmgucmVtb3ZlKCkpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7Y29uc3QgYz0odT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGw/dm9pZCAwOnUuZ2V0KHQpO2MmJihjLmNhbkRlbD0hMCksc2V0VGltZW91dCgoKT0+e3RoaXMuX3Bvc3Qoe3NwOlt7cmVtb3ZlSWRzOlt0LnRvU3RyaW5nKCldLHR5cGU6bS5SZW1vdmVOb2RlfV19KX0scy5nZXRXb3JrT3B0aW9ucygpLnN5bmNVbml0VGltZXx8dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUpfSx0aGlzLmNsb3NlQW5pbWF0aW9uVGltZSl9YnJlYWs7Y2FzZSBTLkFycm93OmNhc2UgUy5TdHJhaWdodDpjYXNlIFMuRWxsaXBzZTpjYXNlIFMuUGVuY2lsOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246dGhpcy5kcmF3Q291bnQ9MCx0aGlzLmZ1bGxMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7YnJlYWt9fX11cGRhdGVMYWJlbHMoZSx0KXtlLmNoaWxkcmVuLmZvckVhY2gocj0+e2lmKHIudGFnTmFtZT09PSJMQUJFTCIpe2NvbnN0IGk9ci5uYW1lLHt3aWR0aDpzfT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFtuXT1lLndvcmxkU2NhbGluZyx7dW5kZXJsaW5lOmEsbGluZVRocm91Z2g6bH09dC5vcHQ7YSYmZS5nZXRFbGVtZW50c0J5TmFtZShgJHtpfV91bmRlcmxpbmVgKVswXS5hdHRyKHtwb2ludHM6WzAsMCxzL24sMF19KSxsJiZlLmdldEVsZW1lbnRzQnlOYW1lKGAke2l9X2xpbmVUaHJvdWdoYClbMF0uYXR0cih7cG9pbnRzOlswLDAscy9uLDBdfSl9fSl9cnVuTGFzZXJQZW5BbmltYXRpb24oZSl7dGhpcy5hbmltYXRpb25JZHx8KHRoaXMuYW5pbWF0aW9uSWQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57dmFyIGkscztpZih0aGlzLmFuaW1hdGlvbklkPXZvaWQgMCx0aGlzLnJ1bkxhc2VyUGVuU3RlcCsrLHRoaXMucnVuTGFzZXJQZW5TdGVwPjEpe3RoaXMucnVuTGFzZXJQZW5TdGVwPTAsdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbihlKTtyZXR1cm59bGV0IHQ7Y29uc3Qgcj1bXTsoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuZm9yRWFjaCgobixhLGwpPT57bi5pc1JlY3QmJih0PUEodCxuLnJlcy5yZWN0KSksbi5yZXMud29ya0lkJiZyLnB1c2gobi5yZXMpLHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGEudG9TdHJpbmcoKSkubGVuZ3RoP24uaXNSZWN0PSEwOm4uaXNSZWN0PSExLG4uY2FuRGVsJiZsLmRlbGV0ZShhKX0pLChzPXRoaXMuYW5pbWF0aW9uV29ya1JlY3RzKSE9bnVsbCYmcy5zaXplJiZ0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKCksdCYmKGUmJnIucHVzaChlKSx0aGlzLl9wb3N0KHtyZW5kZXI6W3tyZWN0OksodCksZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnJ9KSl9KSl9ZHJhd1BlbmNpbChlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDplPT1udWxsP3ZvaWQgMDplLnJlY3QsZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITEsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XSxzcDooZT09bnVsbD92b2lkIDA6ZS5vcCkmJltlXX0pfWRyYXdBcnJvdyhlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDooZT09bnVsbD92b2lkIDA6ZS5yZWN0KSYmSyhlLnJlY3QpLGRyYXdDYW52YXM6Ti5GbG9hdCxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uRmxvYXQsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pfX12YXIgV2U7KGZ1bmN0aW9uKG8pe28uRnVsbD0iZnVsbCIsby5TdWI9InN1YiJ9KShXZXx8KFdlPXt9KSk7Y2xhc3MgZHB7Y29uc3RydWN0b3IoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3NlbGYiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrVGhyZWFkTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLHRoaXMuX3NlbGY9ZSx0aGlzLnR5cGU9dCx0aGlzLnJlZ2lzdGVyKCl9aW5pdChlKXtjb25zdHt2aWV3SWQ6dCxkcHI6cixvZmZzY3JlZW5DYW52YXNPcHQ6aSxsYXllck9wdDpzLGlzU2FmYXJpOm59PWU7aWYoIXJ8fCFpfHwhcylyZXR1cm47bGV0IGE7dGhpcy50eXBlPT09V2UuRnVsbCYmKGE9bmV3IGZwKHQse2RwcjpyLG9mZnNjcmVlbkNhbnZhc09wdDppLGxheWVyT3B0OnN9LHRoaXMucG9zdC5iaW5kKHRoaXMpKSksdGhpcy50eXBlPT09V2UuU3ViJiYoYT1uZXcgcHAodCx7ZHByOnIsb2Zmc2NyZWVuQ2FudmFzT3B0OmksbGF5ZXJPcHQ6c30sdGhpcy5wb3N0LmJpbmQodGhpcykpKSxhJiZuJiZhLnNldElzU2FmYXJpKG4pLGEmJmUuY2FtZXJhT3B0JiZhLnNldENhbWVyYU9wdChlLmNhbWVyYU9wdCksYSYmdGhpcy53b3JrVGhyZWFkTWFwLnNldCh0LGEpfXJlZ2lzdGVyKCl7b25tZXNzYWdlPWU9Pntjb25zdCB0PWUuZGF0YTtpZih0KWZvcihjb25zdCByIG9mIHQudmFsdWVzKCkpe2NvbnN0e21zZ1R5cGU6aSx2aWV3SWQ6cyx0YXNrc3F1ZXVlOm4sbWFpblRhc2tzcXVldWVDb3VudDphfT1yO2lmKGk9PT1tLkluaXQpe3RoaXMuaW5pdChyKTtjb250aW51ZX1pZihpPT09bS5UYXNrc1F1ZXVlJiYobiE9bnVsbCYmbi5zaXplKSYmYSl7dGhpcy53b3JrVGhyZWFkTWFwLmZvckVhY2goKGMsdSk9Pntjb25zdCBoPW4uZ2V0KHUpO2gmJmMub24oaCksdGhpcy5wb3N0KHt3b3JrZXJUYXNrc3F1ZXVlQ291bnQ6YX0pfSk7Y29udGludWV9aWYocz09PXRkKXt0aGlzLndvcmtUaHJlYWRNYXAuZm9yRWFjaChjPT57Yy5vbihyKSxpPT09bS5EZXN0cm95JiZ0aGlzLndvcmtUaHJlYWRNYXAuZGVsZXRlKHMpfSk7Y29udGludWV9Y29uc3QgbD10aGlzLndvcmtUaHJlYWRNYXAuZ2V0KHMpO2wmJihsLm9uKHIpLGk9PT1tLkRlc3Ryb3kmJnRoaXMud29ya1RocmVhZE1hcC5kZWxldGUocykpfX19cG9zdChlLHQpe3Q/dGhpcy5fc2VsZi5wb3N0TWVzc2FnZShlLHQpOnRoaXMuX3NlbGYucG9zdE1lc3NhZ2UoZSl9fWNsYXNzIGZwIGV4dGVuZHMgdG97Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VEcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNuYXBzaG90RnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm1ldGhvZEJ1aWxkZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywibG9jYWxXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIl9wb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy5fcG9zdD1yLHRoaXMuc2VydmljZURyYXdMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzZXJ2aWNlRHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSksdGhpcy5kcmF3TGF5ZXI9dGhpcy5jcmVhdGVMYXllcigiZHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSk7Y29uc3QgaT17dGhyZWFkOnRoaXMsdmlld0lkOnRoaXMudmlld0lkLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyLHBvc3Q6dGhpcy5wb3N0LmJpbmQodGhpcyl9O3RoaXMubG9jYWxXb3JrPW5ldyBjcChpKSx0aGlzLnNlcnZpY2VXb3JrPW5ldyB1cCh7Li4uaSxzZXJ2aWNlRHJhd0xheWVyOnRoaXMuc2VydmljZURyYXdMYXllcn0pLHRoaXMubWV0aG9kQnVpbGRlcj1uZXcgeGYoW0IuQ29weU5vZGUsQi5TZXRDb2xvck5vZGUsQi5EZWxldGVOb2RlLEIuUm90YXRlTm9kZSxCLlNjYWxlTm9kZSxCLlRyYW5zbGF0ZU5vZGUsQi5aSW5kZXhBY3RpdmUsQi5aSW5kZXhOb2RlLEIuU2V0Rm9udFN0eWxlLEIuU2V0UG9pbnQsQi5TZXRMb2NrLEIuU2V0U2hhcGVPcHRdKS5yZWdpc3RlckZvcldvcmtlcih0aGlzLmxvY2FsV29yayx0aGlzLnNlcnZpY2VXb3JrLHRoaXMuc2NlbmUpLHRoaXMudk5vZGVzLmluaXQodGhpcy5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXIpfWFzeW5jIHBvc3QoZSx0KXt2YXIgYSxsLGM7Y29uc3Qgcj1lLnJlbmRlcixpPVtdO2xldCBzPXQ7aWYociE9bnVsbCYmci5sZW5ndGgpe2Zvcihjb25zdCB1IG9mIHIpe2lmKHUuaXNDbGVhckFsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLHUuaXNDbGVhcj0hMCxkZWxldGUgdS5pc0NsZWFyQWxsKSx1LmlzRHJhd0FsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLGRlbGV0ZSB1LmlzRHJhd0FsbCksdS5kcmF3Q2FudmFzKXtjb25zdCBoPXRoaXMuZ2V0TGF5ZXIodS5pc0Z1bGxXb3JrLHUud29ya2VyVHlwZSk7KGg9PW51bGw/dm9pZCAwOmgucGFyZW50KS5yZW5kZXIoKX1pZih1LnJlY3Qpe3UuY2xlYXJDYW52YXM9PT11LmRyYXdDYW52YXMmJnUuZHJhd0NhbnZhcz09PU4uQmcmJih1LnJlY3Q9dGhpcy5jaGVja1JpZ2h0UmVjdEJvdW5kaW5nQm94KHUucmVjdCkpO2NvbnN0IGg9dS5kcmF3Q2FudmFzPT09Ti5TZWxlY3RvciYmdS5yZWN0O2lmKHUucmVjdD10aGlzLnNhZmFyaUZpeFJlY3QocmUodS5yZWN0KSksIXUucmVjdCljb250aW51ZTtpZih1LmRyYXdDYW52YXM9PT1OLlNlbGVjdG9yKXtjb25zdCBkPShhPWUuc3ApPT1udWxsP3ZvaWQgMDphLmZpbmQoZj0+Zi50eXBlPT09bS5TZWxlY3QpO2QmJihkLnJlY3Q9dS5yZWN0KSxoJiYodS5vZmZzZXQ9e3g6dS5yZWN0LngtaC54LHk6dS5yZWN0LnktaC55fSl9aWYodS5kcmF3Q2FudmFzKXtjb25zdCBkPWF3YWl0IHRoaXMuZ2V0UmVjdEltYWdlQml0bWFwKHUucmVjdCwhIXUuaXNGdWxsV29yayx1LndvcmtlclR5cGUpO3UuaW1hZ2VCaXRtYXA9ZCxzfHwocz1bXSkscy5wdXNoKGQpfWkucHVzaCh1KX19ZS5yZW5kZXI9aX1jb25zdCBuPShsPWUuc3ApPT1udWxsP3ZvaWQgMDpsLmZpbHRlcih1PT51LnR5cGUhPT1tLk5vbmV8fE9iamVjdC5rZXlzKHUpLmZpbHRlcihoPT5oPT09InR5cGUiKS5sZW5ndGgpO2lmKG4hPW51bGwmJm4ubGVuZ3RoJiYoZS5zcD1uLm1hcCh1PT4oey4uLnUsdmlld0lkOnRoaXMudmlld0lkfSkpKSwoZS5kcmF3Q291bnR8fGUud29ya2VyVGFza3NxdWV1ZUNvdW50fHwoYz1lLnNwKSE9bnVsbCYmYy5sZW5ndGh8fGkhPW51bGwmJmkubGVuZ3RoKSYmKHRoaXMuX3Bvc3QoZSxzKSxzIT1udWxsJiZzLmxlbmd0aCkpZm9yKGNvbnN0IHUgb2Ygcyl1IGluc3RhbmNlb2YgSW1hZ2VCaXRtYXAmJnUuY2xvc2UoKX1vbihlKXtpZih0aGlzLm1ldGhvZEJ1aWxkZXIuY29uc3VtZUZvcldvcmtlcihlKSlyZXR1cm47Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsd29ya0lkOml9PWU7c3dpdGNoKHQpe2Nhc2UgbS5VcGRhdGVDYW1lcmE6dGhpcy51cGRhdGVDYW1lcmEoZSk7YnJlYWs7Y2FzZSBtLlNlbGVjdDpyPT09Vy5TZXJ2aWNlJiYoaT09PUUuc2VsZWN0b3JJZD90aGlzLmxvY2FsV29yay51cGRhdGVGdWxsU2VsZWN0V29yayhlKTp0aGlzLnNlcnZpY2VXb3JrLnJ1blNlbGVjdFdvcmsoZSkpO2JyZWFrO2Nhc2UgbS5VcGRhdGVOb2RlOmNhc2UgbS5GdWxsV29yazp0aGlzLmNvbnN1bWVGdWxsKHIsZSk7YnJlYWs7Y2FzZSBtLlJlbW92ZU5vZGU6dGhpcy5yZW1vdmVOb2RlKGUpO2JyZWFrO2Nhc2UgbS5HZXRUZXh0QWN0aXZlOnRoaXMuY2hlY2tUZXh0QWN0aXZlKGUpO2JyZWFrO2Nhc2UgbS5DdXJzb3JIb3Zlcjp0aGlzLmN1cnNvckhvdmVyKGUpfXN1cGVyLm9uKGUpfWFzeW5jIHJlbW92ZU5vZGUoZSl7Y29uc3R7ZGF0YVR5cGU6dCx3b3JrSWQ6cn09ZTtpZihyPT09RS5zZWxlY3RvcklkKXt0aGlzLmxvY2FsV29yay5ibHVyU2VsZWN0b3IoZSk7cmV0dXJufXQ9PT1XLkxvY2FsJiYodGhpcy5sb2NhbFdvcmsucmVtb3ZlV29yayhlKSx0aGlzLmxvY2FsV29yay5jb2xsb2N0RWZmZWN0U2VsZWN0V29yayhlKSksdD09PVcuU2VydmljZSYmKHRoaXMuc2VydmljZVdvcmsucmVtb3ZlV29yayhlKSx0aGlzLmxvY2FsV29yay5jb2xsb2N0RWZmZWN0U2VsZWN0V29yayhlKSl9Y2hlY2tUZXh0QWN0aXZlKGUpe2NvbnN0e2RhdGFUeXBlOnR9PWU7dD09PVcuTG9jYWwmJnRoaXMubG9jYWxXb3JrLmNoZWNrVGV4dEFjdGl2ZShlKX1jbGVhckFsbCgpe3RoaXMudk5vZGVzLmNsZWFyKCksc3VwZXIuY2xlYXJBbGwoKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXImJih0aGlzLnNlcnZpY2VEcmF3TGF5ZXIucGFyZW50LmNoaWxkcmVuLmZvckVhY2goZT0+e2UubmFtZSE9PSJ2aWV3cG9ydCImJmUucmVtb3ZlKCl9KSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIucmVtb3ZlQWxsQ2hpbGRyZW4oKSksdGhpcy5wb3N0KHtyZW5kZXI6W3tpc0NsZWFyQWxsOiEwLGNsZWFyQ2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9LHtpc0NsZWFyQWxsOiEwLGNsZWFyQ2FudmFzOk4uRmxvYXQsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9LHtpc0NsZWFyQWxsOiEwLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfV0sc3A6W3t0eXBlOm0uQ2xlYXJ9XX0pfXVwZGF0ZUxheWVyKGUpe2NvbnN0e3dpZHRoOnQsaGVpZ2h0OnJ9PWU7c3VwZXIudXBkYXRlTGF5ZXIoZSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyJiYodGhpcy5zZXJ2aWNlRHJhd0xheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoIndpZHRoIix0KSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgiaGVpZ2h0IixyKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJzaXplIixbdCxyXSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnNldEF0dHJpYnV0ZSgicG9zIixbdCouNSxyKi41XSkpfXNldENhbWVyYU9wdChlKXt0aGlzLmNhbWVyYU9wdD1lO2NvbnN0e3NjYWxlOnQsY2VudGVyWDpyLGNlbnRlclk6aSx3aWR0aDpzLGhlaWdodDpufT1lOyhzIT09dGhpcy5zY2VuZS53aWR0aHx8biE9PXRoaXMuc2NlbmUuaGVpZ2h0KSYmdGhpcy51cGRhdGVTY2VuZSh7d2lkdGg6cyxoZWlnaHQ6bn0pLHRoaXMuZnVsbExheWVyJiYodGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJzY2FsZSIsW3QsdF0pLHRoaXMuZnVsbExheWVyLnNldEF0dHJpYnV0ZSgidHJhbnNsYXRlIixbLXIsLWldKSksdGhpcy5kcmF3TGF5ZXImJih0aGlzLmRyYXdMYXllci5zZXRBdHRyaWJ1dGUoInNjYWxlIixbdCx0XSksdGhpcy5kcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFstciwtaV0pKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXImJih0aGlzLnNlcnZpY2VEcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJzY2FsZSIsW3QsdF0pLHRoaXMuc2VydmljZURyYXdMYXllci5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1yLC1pXSkpfWdldExheWVyKGUsdCl7cmV0dXJuIGU/dGhpcy5mdWxsTGF5ZXI6dCYmdD09PVcuU2VydmljZT90aGlzLnNlcnZpY2VEcmF3TGF5ZXI6dGhpcy5kcmF3TGF5ZXJ9Z2V0T2Zmc2NyZWVuKGUsdCl7cmV0dXJuIHRoaXMuZ2V0TGF5ZXIoZSx0KS5wYXJlbnQuY2FudmFzfWFzeW5jIGNvbnN1bWVGdWxsKGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmxvY2FsV29yay5jb2xsb2N0RWZmZWN0U2VsZWN0V29yayh0KTtyJiZlPT09Vy5Mb2NhbCYmYXdhaXQgdGhpcy5sb2NhbFdvcmsuY29uc3VtZUZ1bGwocix0aGlzLnNjZW5lKSxyJiZlPT09Vy5TZXJ2aWNlJiZ0aGlzLnNlcnZpY2VXb3JrLmNvbnN1bWVGdWxsKHIpfWNvbnN1bWVEcmF3KGUsdCl7ZT09PVcuTG9jYWwmJnRoaXMubG9jYWxXb3JrLmNvbnN1bWVEcmF3KHQsdGhpcy5zZXJ2aWNlV29yayksZT09PVcuU2VydmljZSYmdGhpcy5zZXJ2aWNlV29yay5jb25zdW1lRHJhdyh0KX1jb25zdW1lRHJhd0FsbChlLHQpe2U9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jb25zdW1lRHJhd0FsbCh0LHRoaXMuc2VydmljZVdvcmspfXVwZGF0ZUNhbWVyYShlKXt2YXIgaTtjb25zdCB0PVtdLHtjYW1lcmFPcHQ6cn09ZTtpZihyJiYodGhpcy5zZXRDYW1lcmFPcHQociksdGhpcy5sb2NhbFdvcmsud29ya1NoYXBlcy5mb3JFYWNoKChzLG4pPT57KHMudG9vbHNUeXBlPT09Uy5QZW5jaWx8fHMudG9vbHNUeXBlPT09Uy5BcnJvd3x8cy50b29sc1R5cGU9PT1TLlN0cmFpZ2h0fHxzLnRvb2xzVHlwZT09PVMuRWxsaXBzZXx8cy50b29sc1R5cGU9PT1TLlJlY3RhbmdsZXx8cy50b29sc1R5cGU9PT1TLlN0YXJ8fHMudG9vbHNUeXBlPT09Uy5Qb2x5Z29ufHxzLnRvb2xzVHlwZT09PVMuU3BlZWNoQmFsbG9vbnx8cy50b29sc1R5cGU9PT1TLlRleHQpJiZ0aGlzLmxvY2FsV29yay53b3JrU2hhcGVTdGF0ZS5zZXQobix7d2lsbENsZWFyOiEwfSl9KSx0aGlzLnZOb2Rlcy5jdXJOb2RlTWFwLnNpemUpKXtpZih0aGlzLnZOb2Rlcy51cGRhdGVOb2Rlc1JlY3QoKSx0aGlzLmxvY2FsV29yay5yZVJlbmRlclNlbGVjdG9yKCksdGhpcy5zZXJ2aWNlV29yay5zZWxlY3RvcldvcmtTaGFwZXMuc2l6ZSlmb3IoY29uc3RbYSxsXW9mIHRoaXMuc2VydmljZVdvcmsuc2VsZWN0b3JXb3JrU2hhcGVzLmVudHJpZXMoKSl0aGlzLnNlcnZpY2VXb3JrLnJ1blNlbGVjdFdvcmsoe3dvcmtJZDphLHNlbGVjdElkczpsLnNlbGVjdElkcyxtc2dUeXBlOm0uU2VsZWN0LGRhdGFUeXBlOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9KTtsZXQgcztjb25zdCBuPXRoaXMubG9jYWxXb3JrLmdldFdvcmtTaGFwZShLZSk7aWYobiYmKChpPW4uc2VsZWN0SWRzKSE9bnVsbCYmaS5sZW5ndGgpJiYocz1uLm9sZFNlbGVjdFJlY3Qsbi5jdXJzb3JCbHVyKCkpLHRoaXMudk5vZGVzLmhhc1JlbmRlck5vZGVzKCkpe3QucHVzaCh7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSx7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSk7Zm9yKGNvbnN0IGEgb2YgdGhpcy52Tm9kZXMuY3VyTm9kZU1hcC52YWx1ZXMoKSlPcihhLnRvb2xzVHlwZSkmJihzPUEocyxhLnJlY3QpKTtzJiZ0LnB1c2goe3JlY3Q6SyhzLDIwKSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMSxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pfXQubGVuZ3RoJiZ0aGlzLnBvc3Qoe3JlbmRlcjp0fSl9fWdldFJlY3RJbWFnZUJpdG1hcChlLHQscil7Y29uc3QgaT1lLngqdGhpcy5kcHIscz1lLnkqdGhpcy5kcHIsbj1lLncqdGhpcy5kcHIsYT1lLmgqdGhpcy5kcHI7cmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKHRoaXMuZ2V0T2Zmc2NyZWVuKHQsciksaSxzLG4sYSl9c2FmYXJpRml4UmVjdChlKXtpZihlLncrZS54PD0wfHxlLmgrZS55PD0wfHxlLnc8PTB8fGUuaDw9MClyZXR1cm47Y29uc3QgdD17eDowLHk6MCx3Ok1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aCksaDpNYXRoLmZsb29yKHRoaXMuc2NlbmUuaGVpZ2h0KX07aWYoZS54PDA/ZS53K2UueDx0aGlzLnNjZW5lLndpZHRoJiYodC53PWUudytlLngpOmUudytlLng+MCYmKHQueD1lLngsdC53PU1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aC1lLngpKSxlLnk8MD9lLmgrZS55PHRoaXMuc2NlbmUuaGVpZ2h0JiYodC5oPWUuaCtlLnkpOmUuaCtlLnk+MCYmKHQueT1lLnksdC5oPU1hdGguZmxvb3IodGhpcy5zY2VuZS5oZWlnaHQtZS55KSksISh0Lnc8PTB8fHQuaDw9MCkpcmV0dXJuIHR9Z2V0U2NlbmVSZWN0KCl7Y29uc3R7d2lkdGg6ZSxoZWlnaHQ6dH09dGhpcy5zY2VuZTtyZXR1cm57eDowLHk6MCx3Ok1hdGguZmxvb3IoZSksaDpNYXRoLmZsb29yKHQpfX1jaGVja1JpZ2h0UmVjdEJvdW5kaW5nQm94KGUpe3JldHVybiB0aGlzLnZOb2Rlcy5jb21iaW5lSW50ZXJzZWN0UmVjdChlKX1jdXJzb3JIb3ZlcihlKXt0aGlzLmxvY2FsV29yay5jdXJzb3JIb3ZlcihlKX19Y2xhc3MgcHAgZXh0ZW5kcyB0b3tjb25zdHJ1Y3RvcihlLHQscil7c3VwZXIoZSx0KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3Bvc3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNuYXBzaG90RnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImxvY2FsV29yayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMuX3Bvc3Q9cjtjb25zdCBpPXt0aHJlYWQ6dGhpcyx2aWV3SWQ6dGhpcy52aWV3SWQsdk5vZGVzOnRoaXMudk5vZGVzLGZ1bGxMYXllcjp0aGlzLmZ1bGxMYXllcixkcmF3TGF5ZXI6dGhpcy5kcmF3TGF5ZXIscG9zdDp0aGlzLnBvc3QuYmluZCh0aGlzKX07dGhpcy5sb2NhbFdvcms9bmV3IGhwKGkpLHRoaXMudk5vZGVzLmluaXQodGhpcy5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXIpfWFzeW5jIHBvc3QoZSx0KXt2YXIgYSxsO2NvbnN0IHI9ZS5yZW5kZXIsaT1bXTtsZXQgcz10O2lmKHIhPW51bGwmJnIubGVuZ3RoKXtmb3IoY29uc3QgYyBvZiByKWlmKGMuZHJhd0NhbnZhcyYmdGhpcy5mdWxsTGF5ZXIucGFyZW50LnJlbmRlcigpLGMucmVjdCl7aWYoYy5yZWN0PXRoaXMuc2FmYXJpRml4UmVjdChyZShjLnJlY3QpKSwhYy5yZWN0KWNvbnRpbnVlO2lmKGMuZHJhd0NhbnZhcyl7Y29uc3QgdT1hd2FpdCB0aGlzLmdldFJlY3RJbWFnZUJpdG1hcChjLnJlY3QsISFjLmlzRnVsbFdvcmspO2MuaW1hZ2VCaXRtYXA9dSxzfHwocz1bXSkscy5wdXNoKHUpfWkucHVzaChjKX1lLnJlbmRlcj1pfWNvbnN0IG49KGE9ZS5zcCk9PW51bGw/dm9pZCAwOmEuZmlsdGVyKGM9PmMudHlwZSE9PW0uTm9uZXx8T2JqZWN0LmtleXMoYykuZmlsdGVyKHU9PnU9PT0idHlwZSIpLmxlbmd0aCk7aWYobiE9bnVsbCYmbi5sZW5ndGgmJihlLnNwPW4ubWFwKGM9Pih7Li4uYyx2aWV3SWQ6dGhpcy52aWV3SWR9KSkpLCgobD1lLnNwKSE9bnVsbCYmbC5sZW5ndGh8fGUuZHJhd0NvdW50fHxpIT1udWxsJiZpLmxlbmd0aCkmJih0aGlzLl9wb3N0KGUscykscyE9bnVsbCYmcy5sZW5ndGgpKWZvcihjb25zdCBjIG9mIHMpYyBpbnN0YW5jZW9mIEltYWdlQml0bWFwJiZjLmNsb3NlKCl9b24oZSl7Y29uc3R7bXNnVHlwZTp0fT1lO3N3aXRjaCh0KXtjYXNlIG0uVXBkYXRlQ2FtZXJhOnRoaXMudXBkYXRlQ2FtZXJhKGUpO2JyZWFrO2Nhc2UgbS5TbmFwc2hvdDp0aGlzLnNuYXBzaG90RnVsbExheWVyPXRoaXMuY3JlYXRlTGF5ZXIoInNuYXBzaG90RnVsbExheWVyIix0aGlzLnNjZW5lLHsuLi50aGlzLm9wdC5sYXllck9wdCxidWZmZXJTaXplOnRoaXMudmlld0lkPT09Im1haW5WaWV3Ij82ZTM6M2UzfSksdGhpcy5zbmFwc2hvdEZ1bGxMYXllciYmdGhpcy5nZXRTbmFwc2hvdChlKS50aGVuKCgpPT57dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj12b2lkIDB9KTticmVhaztjYXNlIG0uQm91bmRpbmdCb3g6dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzbmFwc2hvdEZ1bGxMYXllciIsdGhpcy5zY2VuZSx7Li4udGhpcy5vcHQubGF5ZXJPcHQsYnVmZmVyU2l6ZTp0aGlzLnZpZXdJZD09PSJtYWluVmlldyI/NmUzOjNlM30pLHRoaXMuc25hcHNob3RGdWxsTGF5ZXImJnRoaXMuZ2V0Qm91bmRpbmdSZWN0KGUpLnRoZW4oKCk9Pnt0aGlzLnNuYXBzaG90RnVsbExheWVyPXZvaWQgMH0pO2JyZWFrfXN1cGVyLm9uKGUpfWdldE9mZnNjcmVlbihlKXt2YXIgdDtyZXR1cm4odD0oZSYmdGhpcy5zbmFwc2hvdEZ1bGxMYXllcnx8dGhpcy5mdWxsTGF5ZXIpLnBhcmVudCk9PW51bGw/dm9pZCAwOnQuY2FudmFzfWNvbnN1bWVEcmF3KGUsdCl7ZT09PVcuTG9jYWwmJnRoaXMubG9jYWxXb3JrLmNvbnN1bWVEcmF3KHQpfWNvbnN1bWVEcmF3QWxsKGUsdCl7dGhpcy5sb2NhbFdvcmsuY29uc3VtZURyYXdBbGwodCl9Z2V0UmVjdEltYWdlQml0bWFwKGUsdD0hMSxyKXtjb25zdCBpPWUueCp0aGlzLmRwcixzPWUueSp0aGlzLmRwcixuPWUudyp0aGlzLmRwcixhPWUuaCp0aGlzLmRwcjtyZXR1cm4gY3JlYXRlSW1hZ2VCaXRtYXAodGhpcy5nZXRPZmZzY3JlZW4odCksaSxzLG4sYSxyKX1zYWZhcmlGaXhSZWN0KGUpe2lmKGUudytlLng8PTB8fGUuaCtlLnk8PTB8fGUudzw9MHx8ZS5oPD0wKXJldHVybjtjb25zdCB0PXt4OjAseTowLHc6TWF0aC5mbG9vcih0aGlzLnNjZW5lLndpZHRoKSxoOk1hdGguZmxvb3IodGhpcy5zY2VuZS5oZWlnaHQpfTtpZihlLng8MD9lLncrZS54PHRoaXMuc2NlbmUud2lkdGgmJih0Lnc9ZS53K2UueCk6ZS53K2UueD4wJiYodC54PWUueCx0Lnc9TWF0aC5mbG9vcih0aGlzLnNjZW5lLndpZHRoLWUueCkpLGUueTwwP2UuaCtlLnk8dGhpcy5zY2VuZS5oZWlnaHQmJih0Lmg9ZS5oK2UueSk6ZS5oK2UueT4wJiYodC55PWUueSx0Lmg9TWF0aC5mbG9vcih0aGlzLnNjZW5lLmhlaWdodC1lLnkpKSwhKHQudzw9MHx8dC5oPD0wKSlyZXR1cm4gdH11cGRhdGVDYW1lcmEoZSl7Y29uc3R7Y2FtZXJhT3B0OnR9PWU7dCYmdGhpcy5zZXRDYW1lcmFPcHQodCl9c2V0Q2FtZXJhT3B0KGUsdCl7dGhpcy5jYW1lcmFPcHQ9ZTtjb25zdHtzY2FsZTpyLGNlbnRlclg6aSxjZW50ZXJZOnMsd2lkdGg6bixoZWlnaHQ6YX09ZTsobiE9PXRoaXMuc2NlbmUud2lkdGh8fGEhPT10aGlzLnNjZW5lLmhlaWdodCkmJnRoaXMudXBkYXRlU2NlbmUoe3dpZHRoOm4saGVpZ2h0OmF9KSx0Pyh0LnNldEF0dHJpYnV0ZSgic2NhbGUiLFtyLHJdKSx0LnNldEF0dHJpYnV0ZSgidHJhbnNsYXRlIixbLWksLXNdKSk6KHRoaXMuZnVsbExheWVyLnNldEF0dHJpYnV0ZSgic2NhbGUiLFtyLHJdKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1pLC1zXSkpfWFzeW5jIGdldFNuYXBzaG90KGUpe2NvbnN0e3NjZW5lUGF0aDp0LHNjZW5lczpyLGNhbWVyYU9wdDppLHc6cyxoOm4sbWF4WkluZGV4OmF9PWU7aWYodCYmciYmaSYmdGhpcy5zbmFwc2hvdEZ1bGxMYXllcil7Y29uc3QgbD1yZSh0aGlzLmNhbWVyYU9wdCk7dGhpcy5zZXRDYW1lcmFPcHQoaSx0aGlzLnNuYXBzaG90RnVsbExheWVyKSx0aGlzLmxvY2FsV29yay5mdWxsTGF5ZXI9dGhpcy5zbmFwc2hvdEZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dGhpcy5mdWxsTGF5ZXI7bGV0IGM7Y29uc3QgdT1uZXcgTWFwO2Zvcihjb25zdFtkLGZdb2YgT2JqZWN0LmVudHJpZXMocikpaWYoZiE9bnVsbCYmZi50eXBlKXN3aXRjaChmPT1udWxsP3ZvaWQgMDpmLnR5cGUpe2Nhc2UgbS5VcGRhdGVOb2RlOmNhc2UgbS5GdWxsV29yazp7Y29uc3R7dG9vbHNUeXBlOncsb3B0Onl9PWY7dz09PVMuVGV4dCYmeSYmKHkuekluZGV4PXkuekluZGV4KyhhfHwwKSwoeS5saW5lVGhyb3VnaHx8eS51bmRlcmxpbmUpJiZ1LnNldChkLGYpKTtjb25zdCBnPWF3YWl0IHRoaXMubG9jYWxXb3JrLnJ1bkZ1bGxXb3JrKHsuLi5mLG9wdDp5LHdvcmtJZDpkLG1zZ1R5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLlNlcnZpY2Usdmlld0lkOnRoaXMudmlld0lkfSx3PT09Uy5UZXh0KTtjPUEoYyxnKTticmVha319dGhpcy5sb2NhbFdvcmsuZnVsbExheWVyPXRoaXMuZnVsbExheWVyLHRoaXMubG9jYWxXb3JrLmRyYXdMYXllcj12b2lkIDA7bGV0IGg7cyYmbiYmKGg9e3Jlc2l6ZVdpZHRoOnMscmVzaXplSGVpZ2h0Om59KSx1LnNpemUmJihhd2FpdCBuZXcgUHJvbWlzZShkPT57c2V0VGltZW91dChkLDUwMCl9KSx0aGlzLndpbGxSZW5kZXJTcGVjaWFsTGFiZWwodSkpLGF3YWl0IHRoaXMuZ2V0U25hcHNob3RSZW5kZXIoe3NjZW5lUGF0aDp0LGN1ckNhbWVyYU9wdDpsLG9wdGlvbnM6aH0pfX13aWxsUmVuZGVyU3BlY2lhbExhYmVsKGUpe3ZhciB0O2Zvcihjb25zdFtyLGldb2YgZS5lbnRyaWVzKCkpe2NvbnN0IHM9KHQ9dGhpcy5zbmFwc2hvdEZ1bGxMYXllcik9PW51bGw/dm9pZCAwOnQuZ2V0RWxlbWVudHNCeU5hbWUocilbMF07cyYmaS5vcHQmJnRoaXMubG9jYWxXb3JrLnVwZGF0ZUxhYmVscyhzLGkpfX1hc3luYyBnZXRTbmFwc2hvdFJlbmRlcihlKXt2YXIgbixhO2NvbnN0e3NjZW5lUGF0aDp0LGN1ckNhbWVyYU9wdDpyLG9wdGlvbnM6aX09ZTsoKG49dGhpcy5zbmFwc2hvdEZ1bGxMYXllcik9PW51bGw/dm9pZCAwOm4ucGFyZW50KS5yZW5kZXIoKTtjb25zdCBzPWF3YWl0IHRoaXMuZ2V0UmVjdEltYWdlQml0bWFwKHt4OjAseTowLHc6dGhpcy5zY2VuZS53aWR0aCxoOnRoaXMuc2NlbmUuaGVpZ2h0fSwhMCxpKTtzJiYoYXdhaXQgdGhpcy5wb3N0KHtzcDpbe3R5cGU6bS5TbmFwc2hvdCxzY2VuZVBhdGg6dCxpbWFnZUJpdG1hcDpzfV19LFtzXSkscy5jbG9zZSgpLChhPXRoaXMuc25hcHNob3RGdWxsTGF5ZXIpPT1udWxsfHxhLnJlbW92ZUFsbENoaWxkcmVuKCksdGhpcy5zZXRDYW1lcmFPcHQocix0aGlzLmZ1bGxMYXllcikpfWFzeW5jIGdldEJvdW5kaW5nUmVjdChlKXtjb25zdHtzY2VuZVBhdGg6dCxzY2VuZXM6cixjYW1lcmFPcHQ6aX09ZTtpZih0JiZyJiZpJiZ0aGlzLnNuYXBzaG90RnVsbExheWVyKXtjb25zdCBzPXJlKHRoaXMuY2FtZXJhT3B0KTt0aGlzLnNldENhbWVyYU9wdChpLHRoaXMuc25hcHNob3RGdWxsTGF5ZXIpLHRoaXMubG9jYWxXb3JrLmZ1bGxMYXllcj10aGlzLnNuYXBzaG90RnVsbExheWVyLHRoaXMubG9jYWxXb3JrLmRyYXdMYXllcj10aGlzLmRyYXdMYXllcjtsZXQgbjtmb3IoY29uc3RbYSxsXW9mIE9iamVjdC5lbnRyaWVzKHIpKWlmKGwhPW51bGwmJmwudHlwZSlzd2l0Y2gobD09bnVsbD92b2lkIDA6bC50eXBlKXtjYXNlIG0uVXBkYXRlTm9kZTpjYXNlIG0uRnVsbFdvcms6e2NvbnN0IGM9YXdhaXQgdGhpcy5sb2NhbFdvcmsucnVuRnVsbFdvcmsoey4uLmwsd29ya0lkOmEsbXNnVHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9KTtuPUEobixjKTticmVha319biYmYXdhaXQgdGhpcy5wb3N0KHtzcDpbe3R5cGU6bS5Cb3VuZGluZ0JveCxzY2VuZVBhdGg6dCxyZWN0Om59XX0pLHRoaXMubG9jYWxXb3JrLmZ1bGxMYXllcj10aGlzLmZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dm9pZCAwLHRoaXMuc25hcHNob3RGdWxsTGF5ZXIucmVtb3ZlQWxsQ2hpbGRyZW4oKSx0aGlzLnNldENhbWVyYU9wdChzLHRoaXMuZnVsbExheWVyKX19fWNvbnN0IHlwPXNlbGY7bmV3IGRwKHlwLFdlLkZ1bGwpfSkoc3ByaXRlanMpOwo=", fG = (t) => Uint8Array.from(atob(t), (l) => l.charCodeAt(0)), De = typeof window < "u" && window.Blob && new Blob([fG(wt)], { type: "text/javascript;charset=utf-8" });
function QG(t) {
  let l;
  try {
    if (l = De && (window.URL || window.webkitURL).createObjectURL(De), !l)
      throw "";
    const c = new Worker(l, {
      name: t == null ? void 0 : t.name
    });
    return c.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(l);
    }), c;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + wt,
      {
        name: t == null ? void 0 : t.name
      }
    );
  } finally {
    l && (window.URL || window.webkitURL).revokeObjectURL(l);
  }
}
const gt = "c2VsZi5pbXBvcnRTY3JpcHRzKCJodHRwczovL3VucGtnLmNvbS9zcHJpdGVqc0AzL2Rpc3Qvc3ByaXRlanMuanMiKTsoZnVuY3Rpb24oeil7InVzZSBzdHJpY3QiO3ZhciBNZT10eXBlb2YgZ2xvYmFsVGhpczwidSI/Z2xvYmFsVGhpczp0eXBlb2Ygd2luZG93PCJ1Ij93aW5kb3c6dHlwZW9mIGdsb2JhbDwidSI/Z2xvYmFsOnR5cGVvZiBzZWxmPCJ1Ij9zZWxmOnt9O2Z1bmN0aW9uIG1lKG8pe3JldHVybiBvJiZvLl9fZXNNb2R1bGUmJk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCJkZWZhdWx0Iik/by5kZWZhdWx0Om99ZnVuY3Rpb24gZm8oKXt0aGlzLl9fZGF0YV9fPVtdLHRoaXMuc2l6ZT0wfXZhciBwbz1mbztmdW5jdGlvbiB5byhvLGUpe3JldHVybiBvPT09ZXx8byE9PW8mJmUhPT1lfXZhciBWZT15byx3bz1WZTtmdW5jdGlvbiBtbyhvLGUpe2Zvcih2YXIgdD1vLmxlbmd0aDt0LS07KWlmKHdvKG9bdF1bMF0sZSkpcmV0dXJuIHQ7cmV0dXJuLTF9dmFyIEFlPW1vLGdvPUFlLGJvPUFycmF5LnByb3RvdHlwZSx2bz1iby5zcGxpY2U7ZnVuY3Rpb24gU28obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PWdvKGUsbyk7aWYodDwwKXJldHVybiExO3ZhciByPWUubGVuZ3RoLTE7cmV0dXJuIHQ9PXI/ZS5wb3AoKTp2by5jYWxsKGUsdCwxKSwtLXRoaXMuc2l6ZSwhMH12YXIga289U28sUG89QWU7ZnVuY3Rpb24gVG8obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PVBvKGUsbyk7cmV0dXJuIHQ8MD92b2lkIDA6ZVt0XVsxXX12YXIgSW89VG8seG89QWU7ZnVuY3Rpb24gT28obyl7cmV0dXJuIHhvKHRoaXMuX19kYXRhX18sbyk+LTF9dmFyIExvPU9vLENvPUFlO2Z1bmN0aW9uIE5vKG8sZSl7dmFyIHQ9dGhpcy5fX2RhdGFfXyxyPUNvKHQsbyk7cmV0dXJuIHI8MD8oKyt0aGlzLnNpemUsdC5wdXNoKFtvLGVdKSk6dFtyXVsxXT1lLHRoaXN9dmFyIFdvPU5vLFJvPXBvLE1vPWtvLEFvPUlvLCRvPUxvLERvPVdvO2Z1bmN0aW9uIGdlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fWdlLnByb3RvdHlwZS5jbGVhcj1SbyxnZS5wcm90b3R5cGUuZGVsZXRlPU1vLGdlLnByb3RvdHlwZS5nZXQ9QW8sZ2UucHJvdG90eXBlLmhhcz0kbyxnZS5wcm90b3R5cGUuc2V0PURvO3ZhciAkZT1nZSxqbz0kZTtmdW5jdGlvbiBGbygpe3RoaXMuX19kYXRhX189bmV3IGpvLHRoaXMuc2l6ZT0wfXZhciBCbz1GbztmdW5jdGlvbiBfbyhvKXt2YXIgZT10aGlzLl9fZGF0YV9fLHQ9ZS5kZWxldGUobyk7cmV0dXJuIHRoaXMuc2l6ZT1lLnNpemUsdH12YXIgRW89X287ZnVuY3Rpb24gem8obyl7cmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KG8pfXZhciBVbz16bztmdW5jdGlvbiBHbyhvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMobyl9dmFyIFhvPUdvLEhvPXR5cGVvZiBNZT09Im9iamVjdCImJk1lJiZNZS5PYmplY3Q9PT1PYmplY3QmJk1lLFN0PUhvLFlvPVN0LHFvPXR5cGVvZiBzZWxmPT0ib2JqZWN0IiYmc2VsZiYmc2VsZi5PYmplY3Q9PT1PYmplY3QmJnNlbGYsWm89WW98fHFvfHxGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpLGllPVpvLFFvPWllLEpvPVFvLlN5bWJvbCxEZT1KbyxrdD1EZSxQdD1PYmplY3QucHJvdG90eXBlLEtvPVB0Lmhhc093blByb3BlcnR5LFZvPVB0LnRvU3RyaW5nLExlPWt0P2t0LnRvU3RyaW5nVGFnOnZvaWQgMDtmdW5jdGlvbiBlcyhvKXt2YXIgZT1Lby5jYWxsKG8sTGUpLHQ9b1tMZV07dHJ5e29bTGVdPXZvaWQgMDt2YXIgcj0hMH1jYXRjaHt9dmFyIGk9Vm8uY2FsbChvKTtyZXR1cm4gciYmKGU/b1tMZV09dDpkZWxldGUgb1tMZV0pLGl9dmFyIHRzPWVzLHJzPU9iamVjdC5wcm90b3R5cGUsb3M9cnMudG9TdHJpbmc7ZnVuY3Rpb24gc3Mobyl7cmV0dXJuIG9zLmNhbGwobyl9dmFyIGlzPXNzLFR0PURlLG5zPXRzLGFzPWlzLGxzPSJbb2JqZWN0IE51bGxdIixjcz0iW29iamVjdCBVbmRlZmluZWRdIixJdD1UdD9UdC50b1N0cmluZ1RhZzp2b2lkIDA7ZnVuY3Rpb24gdXMobyl7cmV0dXJuIG89PW51bGw/bz09PXZvaWQgMD9jczpsczpJdCYmSXQgaW4gT2JqZWN0KG8pP25zKG8pOmFzKG8pfXZhciBmZT11cztmdW5jdGlvbiBocyhvKXt2YXIgZT10eXBlb2YgbztyZXR1cm4gbyE9bnVsbCYmKGU9PSJvYmplY3QifHxlPT0iZnVuY3Rpb24iKX12YXIgdWU9aHMsZHM9ZmUsZnM9dWUscHM9IltvYmplY3QgQXN5bmNGdW5jdGlvbl0iLHlzPSJbb2JqZWN0IEZ1bmN0aW9uXSIsd3M9IltvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dIixtcz0iW29iamVjdCBQcm94eV0iO2Z1bmN0aW9uIGdzKG8pe2lmKCFmcyhvKSlyZXR1cm4hMTt2YXIgZT1kcyhvKTtyZXR1cm4gZT09eXN8fGU9PXdzfHxlPT1wc3x8ZT09bXN9dmFyIHh0PWdzLGJzPWllLHZzPWJzWyJfX2NvcmUtanNfc2hhcmVkX18iXSxTcz12cyxldD1TcyxPdD1mdW5jdGlvbigpe3ZhciBvPS9bXi5dKyQvLmV4ZWMoZXQmJmV0LmtleXMmJmV0LmtleXMuSUVfUFJPVE98fCIiKTtyZXR1cm4gbz8iU3ltYm9sKHNyYylfMS4iK286IiJ9KCk7ZnVuY3Rpb24ga3Mobyl7cmV0dXJuISFPdCYmT3QgaW4gb312YXIgUHM9a3MsVHM9RnVuY3Rpb24ucHJvdG90eXBlLElzPVRzLnRvU3RyaW5nO2Z1bmN0aW9uIHhzKG8pe2lmKG8hPW51bGwpe3RyeXtyZXR1cm4gSXMuY2FsbChvKX1jYXRjaHt9dHJ5e3JldHVybiBvKyIifWNhdGNoe319cmV0dXJuIiJ9dmFyIEx0PXhzLE9zPXh0LExzPVBzLENzPXVlLE5zPUx0LFdzPS9bXFxeJC4qKz8oKVtcXXt9fF0vZyxScz0vXlxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXF0kLyxNcz1GdW5jdGlvbi5wcm90b3R5cGUsQXM9T2JqZWN0LnByb3RvdHlwZSwkcz1Ncy50b1N0cmluZyxEcz1Bcy5oYXNPd25Qcm9wZXJ0eSxqcz1SZWdFeHAoIl4iKyRzLmNhbGwoRHMpLnJlcGxhY2UoV3MsIlxcJCYiKS5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcKCl8IGZvciAuKz8oPz1cXFxdKS9nLCIkMS4qPyIpKyIkIik7ZnVuY3Rpb24gRnMobyl7aWYoIUNzKG8pfHxMcyhvKSlyZXR1cm4hMTt2YXIgZT1PcyhvKT9qczpScztyZXR1cm4gZS50ZXN0KE5zKG8pKX12YXIgQnM9RnM7ZnVuY3Rpb24gX3MobyxlKXtyZXR1cm4gbz09bnVsbD92b2lkIDA6b1tlXX12YXIgRXM9X3MsenM9QnMsVXM9RXM7ZnVuY3Rpb24gR3MobyxlKXt2YXIgdD1VcyhvLGUpO3JldHVybiB6cyh0KT90OnZvaWQgMH12YXIgcGU9R3MsWHM9cGUsSHM9aWUsWXM9WHMoSHMsIk1hcCIpLHR0PVlzLHFzPXBlLFpzPXFzKE9iamVjdCwiY3JlYXRlIiksamU9WnMsQ3Q9amU7ZnVuY3Rpb24gUXMoKXt0aGlzLl9fZGF0YV9fPUN0P0N0KG51bGwpOnt9LHRoaXMuc2l6ZT0wfXZhciBKcz1RcztmdW5jdGlvbiBLcyhvKXt2YXIgZT10aGlzLmhhcyhvKSYmZGVsZXRlIHRoaXMuX19kYXRhX19bb107cmV0dXJuIHRoaXMuc2l6ZS09ZT8xOjAsZX12YXIgVnM9S3MsZWk9amUsdGk9Il9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18iLHJpPU9iamVjdC5wcm90b3R5cGUsb2k9cmkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gc2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztpZihlaSl7dmFyIHQ9ZVtvXTtyZXR1cm4gdD09PXRpP3ZvaWQgMDp0fXJldHVybiBvaS5jYWxsKGUsbyk/ZVtvXTp2b2lkIDB9dmFyIGlpPXNpLG5pPWplLGFpPU9iamVjdC5wcm90b3R5cGUsbGk9YWkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gY2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztyZXR1cm4gbmk/ZVtvXSE9PXZvaWQgMDpsaS5jYWxsKGUsbyl9dmFyIHVpPWNpLGhpPWplLGRpPSJfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fIjtmdW5jdGlvbiBmaShvLGUpe3ZhciB0PXRoaXMuX19kYXRhX187cmV0dXJuIHRoaXMuc2l6ZSs9dGhpcy5oYXMobyk/MDoxLHRbb109aGkmJmU9PT12b2lkIDA/ZGk6ZSx0aGlzfXZhciBwaT1maSx5aT1Kcyx3aT1WcyxtaT1paSxnaT11aSxiaT1waTtmdW5jdGlvbiBiZShvKXt2YXIgZT0tMSx0PW89PW51bGw/MDpvLmxlbmd0aDtmb3IodGhpcy5jbGVhcigpOysrZTx0Oyl7dmFyIHI9b1tlXTt0aGlzLnNldChyWzBdLHJbMV0pfX1iZS5wcm90b3R5cGUuY2xlYXI9eWksYmUucHJvdG90eXBlLmRlbGV0ZT13aSxiZS5wcm90b3R5cGUuZ2V0PW1pLGJlLnByb3RvdHlwZS5oYXM9Z2ksYmUucHJvdG90eXBlLnNldD1iaTt2YXIgdmk9YmUsTnQ9dmksU2k9JGUsa2k9dHQ7ZnVuY3Rpb24gUGkoKXt0aGlzLnNpemU9MCx0aGlzLl9fZGF0YV9fPXtoYXNoOm5ldyBOdCxtYXA6bmV3KGtpfHxTaSksc3RyaW5nOm5ldyBOdH19dmFyIFRpPVBpO2Z1bmN0aW9uIElpKG8pe3ZhciBlPXR5cGVvZiBvO3JldHVybiBlPT0ic3RyaW5nInx8ZT09Im51bWJlciJ8fGU9PSJzeW1ib2wifHxlPT0iYm9vbGVhbiI/byE9PSJfX3Byb3RvX18iOm89PT1udWxsfXZhciB4aT1JaSxPaT14aTtmdW5jdGlvbiBMaShvLGUpe3ZhciB0PW8uX19kYXRhX187cmV0dXJuIE9pKGUpP3RbdHlwZW9mIGU9PSJzdHJpbmciPyJzdHJpbmciOiJoYXNoIl06dC5tYXB9dmFyIEZlPUxpLENpPUZlO2Z1bmN0aW9uIE5pKG8pe3ZhciBlPUNpKHRoaXMsbykuZGVsZXRlKG8pO3JldHVybiB0aGlzLnNpemUtPWU/MTowLGV9dmFyIFdpPU5pLFJpPUZlO2Z1bmN0aW9uIE1pKG8pe3JldHVybiBSaSh0aGlzLG8pLmdldChvKX12YXIgQWk9TWksJGk9RmU7ZnVuY3Rpb24gRGkobyl7cmV0dXJuICRpKHRoaXMsbykuaGFzKG8pfXZhciBqaT1EaSxGaT1GZTtmdW5jdGlvbiBCaShvLGUpe3ZhciB0PUZpKHRoaXMsbykscj10LnNpemU7cmV0dXJuIHQuc2V0KG8sZSksdGhpcy5zaXplKz10LnNpemU9PXI/MDoxLHRoaXN9dmFyIF9pPUJpLEVpPVRpLHppPVdpLFVpPUFpLEdpPWppLFhpPV9pO2Z1bmN0aW9uIHZlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fXZlLnByb3RvdHlwZS5jbGVhcj1FaSx2ZS5wcm90b3R5cGUuZGVsZXRlPXppLHZlLnByb3RvdHlwZS5nZXQ9VWksdmUucHJvdG90eXBlLmhhcz1HaSx2ZS5wcm90b3R5cGUuc2V0PVhpO3ZhciBXdD12ZSxIaT0kZSxZaT10dCxxaT1XdCxaaT0yMDA7ZnVuY3Rpb24gUWkobyxlKXt2YXIgdD10aGlzLl9fZGF0YV9fO2lmKHQgaW5zdGFuY2VvZiBIaSl7dmFyIHI9dC5fX2RhdGFfXztpZighWWl8fHIubGVuZ3RoPFppLTEpcmV0dXJuIHIucHVzaChbbyxlXSksdGhpcy5zaXplPSsrdC5zaXplLHRoaXM7dD10aGlzLl9fZGF0YV9fPW5ldyBxaShyKX1yZXR1cm4gdC5zZXQobyxlKSx0aGlzLnNpemU9dC5zaXplLHRoaXN9dmFyIEppPVFpLEtpPSRlLFZpPUJvLGVuPUVvLHRuPVVvLHJuPVhvLG9uPUppO2Z1bmN0aW9uIFNlKG8pe3ZhciBlPXRoaXMuX19kYXRhX189bmV3IEtpKG8pO3RoaXMuc2l6ZT1lLnNpemV9U2UucHJvdG90eXBlLmNsZWFyPVZpLFNlLnByb3RvdHlwZS5kZWxldGU9ZW4sU2UucHJvdG90eXBlLmdldD10bixTZS5wcm90b3R5cGUuaGFzPXJuLFNlLnByb3RvdHlwZS5zZXQ9b247dmFyIFJ0PVNlO2Z1bmN0aW9uIHNuKG8sZSl7Zm9yKHZhciB0PS0xLHI9bz09bnVsbD8wOm8ubGVuZ3RoOysrdDxyJiZlKG9bdF0sdCxvKSE9PSExOyk7cmV0dXJuIG99dmFyIG5uPXNuLGFuPXBlLGxuPWZ1bmN0aW9uKCl7dHJ5e3ZhciBvPWFuKE9iamVjdCwiZGVmaW5lUHJvcGVydHkiKTtyZXR1cm4gbyh7fSwiIix7fSksb31jYXRjaHt9fSgpLGNuPWxuLE10PWNuO2Z1bmN0aW9uIHVuKG8sZSx0KXtlPT0iX19wcm90b19fIiYmTXQ/TXQobyxlLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx2YWx1ZTp0LHdyaXRhYmxlOiEwfSk6b1tlXT10fXZhciBBdD11bixobj1BdCxkbj1WZSxmbj1PYmplY3QucHJvdG90eXBlLHBuPWZuLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIHluKG8sZSx0KXt2YXIgcj1vW2VdOyghKHBuLmNhbGwobyxlKSYmZG4ocix0KSl8fHQ9PT12b2lkIDAmJiEoZSBpbiBvKSkmJmhuKG8sZSx0KX12YXIgJHQ9eW4sd249JHQsbW49QXQ7ZnVuY3Rpb24gZ24obyxlLHQscil7dmFyIGk9IXQ7dHx8KHQ9e30pO2Zvcih2YXIgcz0tMSxuPWUubGVuZ3RoOysrczxuOyl7dmFyIGE9ZVtzXSxsPXI/cih0W2FdLG9bYV0sYSx0LG8pOnZvaWQgMDtsPT09dm9pZCAwJiYobD1vW2FdKSxpP21uKHQsYSxsKTp3bih0LGEsbCl9cmV0dXJuIHR9dmFyIEJlPWduO2Z1bmN0aW9uIGJuKG8sZSl7Zm9yKHZhciB0PS0xLHI9QXJyYXkobyk7Kyt0PG87KXJbdF09ZSh0KTtyZXR1cm4gcn12YXIgdm49Ym47ZnVuY3Rpb24gU24obyl7cmV0dXJuIG8hPW51bGwmJnR5cGVvZiBvPT0ib2JqZWN0In12YXIgY2U9U24sa249ZmUsUG49Y2UsVG49IltvYmplY3QgQXJndW1lbnRzXSI7ZnVuY3Rpb24gSW4obyl7cmV0dXJuIFBuKG8pJiZrbihvKT09VG59dmFyIHhuPUluLER0PXhuLE9uPWNlLGp0PU9iamVjdC5wcm90b3R5cGUsTG49anQuaGFzT3duUHJvcGVydHksQ249anQucHJvcGVydHlJc0VudW1lcmFibGUsTm49RHQoZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzfSgpKT9EdDpmdW5jdGlvbihvKXtyZXR1cm4gT24obykmJkxuLmNhbGwobywiY2FsbGVlIikmJiFDbi5jYWxsKG8sImNhbGxlZSIpfSxXbj1ObixSbj1BcnJheS5pc0FycmF5LF9lPVJuLEVlPXtleHBvcnRzOnt9fTtmdW5jdGlvbiBNbigpe3JldHVybiExfXZhciBBbj1NbjtFZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9aWUscj1BbixpPWUmJiFlLm5vZGVUeXBlJiZlLHM9aSYmITAmJm8mJiFvLm5vZGVUeXBlJiZvLG49cyYmcy5leHBvcnRzPT09aSxhPW4/dC5CdWZmZXI6dm9pZCAwLGw9YT9hLmlzQnVmZmVyOnZvaWQgMCxjPWx8fHI7by5leHBvcnRzPWN9KEVlLEVlLmV4cG9ydHMpO3ZhciBydD1FZS5leHBvcnRzLCRuPTkwMDcxOTkyNTQ3NDA5OTEsRG49L14oPzowfFsxLTldXGQqKSQvO2Z1bmN0aW9uIGpuKG8sZSl7dmFyIHQ9dHlwZW9mIG87cmV0dXJuIGU9ZT8/JG4sISFlJiYodD09Im51bWJlciJ8fHQhPSJzeW1ib2wiJiZEbi50ZXN0KG8pKSYmbz4tMSYmbyUxPT0wJiZvPGV9dmFyIEZuPWpuLEJuPTkwMDcxOTkyNTQ3NDA5OTE7ZnVuY3Rpb24gX24obyl7cmV0dXJuIHR5cGVvZiBvPT0ibnVtYmVyIiYmbz4tMSYmbyUxPT0wJiZvPD1Cbn12YXIgRnQ9X24sRW49ZmUsem49RnQsVW49Y2UsR249IltvYmplY3QgQXJndW1lbnRzXSIsWG49IltvYmplY3QgQXJyYXldIixIbj0iW29iamVjdCBCb29sZWFuXSIsWW49IltvYmplY3QgRGF0ZV0iLHFuPSJbb2JqZWN0IEVycm9yXSIsWm49IltvYmplY3QgRnVuY3Rpb25dIixRbj0iW29iamVjdCBNYXBdIixKbj0iW29iamVjdCBOdW1iZXJdIixLbj0iW29iamVjdCBPYmplY3RdIixWbj0iW29iamVjdCBSZWdFeHBdIixlYT0iW29iamVjdCBTZXRdIix0YT0iW29iamVjdCBTdHJpbmddIixyYT0iW29iamVjdCBXZWFrTWFwXSIsb2E9IltvYmplY3QgQXJyYXlCdWZmZXJdIixzYT0iW29iamVjdCBEYXRhVmlld10iLGlhPSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG5hPSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLGFhPSJbb2JqZWN0IEludDhBcnJheV0iLGxhPSJbb2JqZWN0IEludDE2QXJyYXldIixjYT0iW29iamVjdCBJbnQzMkFycmF5XSIsdWE9IltvYmplY3QgVWludDhBcnJheV0iLGhhPSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsZGE9IltvYmplY3QgVWludDE2QXJyYXldIixmYT0iW29iamVjdCBVaW50MzJBcnJheV0iLFg9e307WFtpYV09WFtuYV09WFthYV09WFtsYV09WFtjYV09WFt1YV09WFtoYV09WFtkYV09WFtmYV09ITAsWFtHbl09WFtYbl09WFtvYV09WFtIbl09WFtzYV09WFtZbl09WFtxbl09WFtabl09WFtRbl09WFtKbl09WFtLbl09WFtWbl09WFtlYV09WFt0YV09WFtyYV09ITE7ZnVuY3Rpb24gcGEobyl7cmV0dXJuIFVuKG8pJiZ6bihvLmxlbmd0aCkmJiEhWFtFbihvKV19dmFyIHlhPXBhO2Z1bmN0aW9uIHdhKG8pe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbyhlKX19dmFyIG90PXdhLHplPXtleHBvcnRzOnt9fTt6ZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9U3Qscj1lJiYhZS5ub2RlVHlwZSYmZSxpPXImJiEwJiZvJiYhby5ub2RlVHlwZSYmbyxzPWkmJmkuZXhwb3J0cz09PXIsbj1zJiZ0LnByb2Nlc3MsYT1mdW5jdGlvbigpe3RyeXt2YXIgbD1pJiZpLnJlcXVpcmUmJmkucmVxdWlyZSgidXRpbCIpLnR5cGVzO3JldHVybiBsfHxuJiZuLmJpbmRpbmcmJm4uYmluZGluZygidXRpbCIpfWNhdGNoe319KCk7by5leHBvcnRzPWF9KHplLHplLmV4cG9ydHMpO3ZhciBzdD16ZS5leHBvcnRzLG1hPXlhLGdhPW90LEJ0PXN0LF90PUJ0JiZCdC5pc1R5cGVkQXJyYXksYmE9X3Q/Z2EoX3QpOm1hLEV0PWJhLHZhPXZuLFNhPVduLGthPV9lLFBhPXJ0LFRhPUZuLElhPUV0LHhhPU9iamVjdC5wcm90b3R5cGUsT2E9eGEuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gTGEobyxlKXt2YXIgdD1rYShvKSxyPSF0JiZTYShvKSxpPSF0JiYhciYmUGEobykscz0hdCYmIXImJiFpJiZJYShvKSxuPXR8fHJ8fGl8fHMsYT1uP3ZhKG8ubGVuZ3RoLFN0cmluZyk6W10sbD1hLmxlbmd0aDtmb3IodmFyIGMgaW4gbykoZXx8T2EuY2FsbChvLGMpKSYmIShuJiYoYz09Imxlbmd0aCJ8fGkmJihjPT0ib2Zmc2V0Inx8Yz09InBhcmVudCIpfHxzJiYoYz09ImJ1ZmZlciJ8fGM9PSJieXRlTGVuZ3RoInx8Yz09ImJ5dGVPZmZzZXQiKXx8VGEoYyxsKSkpJiZhLnB1c2goYyk7cmV0dXJuIGF9dmFyIHp0PUxhLENhPU9iamVjdC5wcm90b3R5cGU7ZnVuY3Rpb24gTmEobyl7dmFyIGU9byYmby5jb25zdHJ1Y3Rvcix0PXR5cGVvZiBlPT0iZnVuY3Rpb24iJiZlLnByb3RvdHlwZXx8Q2E7cmV0dXJuIG89PT10fXZhciBpdD1OYTtmdW5jdGlvbiBXYShvLGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbyhlKHQpKX19dmFyIFV0PVdhLFJhPVV0LE1hPVJhKE9iamVjdC5rZXlzLE9iamVjdCksQWE9TWEsJGE9aXQsRGE9QWEsamE9T2JqZWN0LnByb3RvdHlwZSxGYT1qYS5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBCYShvKXtpZighJGEobykpcmV0dXJuIERhKG8pO3ZhciBlPVtdO2Zvcih2YXIgdCBpbiBPYmplY3QobykpRmEuY2FsbChvLHQpJiZ0IT0iY29uc3RydWN0b3IiJiZlLnB1c2godCk7cmV0dXJuIGV9dmFyIF9hPUJhLEVhPXh0LHphPUZ0O2Z1bmN0aW9uIFVhKG8pe3JldHVybiBvIT1udWxsJiZ6YShvLmxlbmd0aCkmJiFFYShvKX12YXIgR3Q9VWEsR2E9enQsWGE9X2EsSGE9R3Q7ZnVuY3Rpb24gWWEobyl7cmV0dXJuIEhhKG8pP0dhKG8pOlhhKG8pfXZhciBudD1ZYSxxYT1CZSxaYT1udDtmdW5jdGlvbiBRYShvLGUpe3JldHVybiBvJiZxYShlLFphKGUpLG8pfXZhciBKYT1RYTtmdW5jdGlvbiBLYShvKXt2YXIgZT1bXTtpZihvIT1udWxsKWZvcih2YXIgdCBpbiBPYmplY3QobykpZS5wdXNoKHQpO3JldHVybiBlfXZhciBWYT1LYSxlbD11ZSx0bD1pdCxybD1WYSxvbD1PYmplY3QucHJvdG90eXBlLHNsPW9sLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIGlsKG8pe2lmKCFlbChvKSlyZXR1cm4gcmwobyk7dmFyIGU9dGwobyksdD1bXTtmb3IodmFyIHIgaW4gbylyPT0iY29uc3RydWN0b3IiJiYoZXx8IXNsLmNhbGwobyxyKSl8fHQucHVzaChyKTtyZXR1cm4gdH12YXIgbmw9aWwsYWw9enQsbGw9bmwsY2w9R3Q7ZnVuY3Rpb24gdWwobyl7cmV0dXJuIGNsKG8pP2FsKG8sITApOmxsKG8pfXZhciBhdD11bCxobD1CZSxkbD1hdDtmdW5jdGlvbiBmbChvLGUpe3JldHVybiBvJiZobChlLGRsKGUpLG8pfXZhciBwbD1mbCxVZT17ZXhwb3J0czp7fX07VWUuZXhwb3J0cyxmdW5jdGlvbihvLGUpe3ZhciB0PWllLHI9ZSYmIWUubm9kZVR5cGUmJmUsaT1yJiYhMCYmbyYmIW8ubm9kZVR5cGUmJm8scz1pJiZpLmV4cG9ydHM9PT1yLG49cz90LkJ1ZmZlcjp2b2lkIDAsYT1uP24uYWxsb2NVbnNhZmU6dm9pZCAwO2Z1bmN0aW9uIGwoYyx1KXtpZih1KXJldHVybiBjLnNsaWNlKCk7dmFyIGg9Yy5sZW5ndGgsZD1hP2EoaCk6bmV3IGMuY29uc3RydWN0b3IoaCk7cmV0dXJuIGMuY29weShkKSxkfW8uZXhwb3J0cz1sfShVZSxVZS5leHBvcnRzKTt2YXIgeWw9VWUuZXhwb3J0cztmdW5jdGlvbiB3bChvLGUpe3ZhciB0PS0xLHI9by5sZW5ndGg7Zm9yKGV8fChlPUFycmF5KHIpKTsrK3Q8cjspZVt0XT1vW3RdO3JldHVybiBlfXZhciBtbD13bDtmdW5jdGlvbiBnbChvLGUpe2Zvcih2YXIgdD0tMSxyPW89PW51bGw/MDpvLmxlbmd0aCxpPTAscz1bXTsrK3Q8cjspe3ZhciBuPW9bdF07ZShuLHQsbykmJihzW2krK109bil9cmV0dXJuIHN9dmFyIGJsPWdsO2Z1bmN0aW9uIHZsKCl7cmV0dXJuW119dmFyIFh0PXZsLFNsPWJsLGtsPVh0LFBsPU9iamVjdC5wcm90b3R5cGUsVGw9UGwucHJvcGVydHlJc0VudW1lcmFibGUsSHQ9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxJbD1IdD9mdW5jdGlvbihvKXtyZXR1cm4gbz09bnVsbD9bXToobz1PYmplY3QobyksU2woSHQobyksZnVuY3Rpb24oZSl7cmV0dXJuIFRsLmNhbGwobyxlKX0pKX06a2wsbHQ9SWwseGw9QmUsT2w9bHQ7ZnVuY3Rpb24gTGwobyxlKXtyZXR1cm4geGwobyxPbChvKSxlKX12YXIgQ2w9TGw7ZnVuY3Rpb24gTmwobyxlKXtmb3IodmFyIHQ9LTEscj1lLmxlbmd0aCxpPW8ubGVuZ3RoOysrdDxyOylvW2krdF09ZVt0XTtyZXR1cm4gb312YXIgWXQ9TmwsV2w9VXQsUmw9V2woT2JqZWN0LmdldFByb3RvdHlwZU9mLE9iamVjdCkscXQ9UmwsTWw9WXQsQWw9cXQsJGw9bHQsRGw9WHQsamw9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxGbD1qbD9mdW5jdGlvbihvKXtmb3IodmFyIGU9W107bzspTWwoZSwkbChvKSksbz1BbChvKTtyZXR1cm4gZX06RGwsWnQ9RmwsQmw9QmUsX2w9WnQ7ZnVuY3Rpb24gRWwobyxlKXtyZXR1cm4gQmwobyxfbChvKSxlKX12YXIgemw9RWwsVWw9WXQsR2w9X2U7ZnVuY3Rpb24gWGwobyxlLHQpe3ZhciByPWUobyk7cmV0dXJuIEdsKG8pP3I6VWwocix0KG8pKX12YXIgUXQ9WGwsSGw9UXQsWWw9bHQscWw9bnQ7ZnVuY3Rpb24gWmwobyl7cmV0dXJuIEhsKG8scWwsWWwpfXZhciBKdD1abCxRbD1RdCxKbD1adCxLbD1hdDtmdW5jdGlvbiBWbChvKXtyZXR1cm4gUWwobyxLbCxKbCl9dmFyIGVjPVZsLHRjPXBlLHJjPWllLG9jPXRjKHJjLCJEYXRhVmlldyIpLHNjPW9jLGljPXBlLG5jPWllLGFjPWljKG5jLCJQcm9taXNlIiksbGM9YWMsY2M9cGUsdWM9aWUsaGM9Y2ModWMsIlNldCIpLGRjPWhjLGZjPXBlLHBjPWllLHljPWZjKHBjLCJXZWFrTWFwIiksd2M9eWMsY3Q9c2MsdXQ9dHQsaHQ9bGMsZHQ9ZGMsZnQ9d2MsS3Q9ZmUsa2U9THQsVnQ9IltvYmplY3QgTWFwXSIsbWM9IltvYmplY3QgT2JqZWN0XSIsZXI9IltvYmplY3QgUHJvbWlzZV0iLHRyPSJbb2JqZWN0IFNldF0iLHJyPSJbb2JqZWN0IFdlYWtNYXBdIixvcj0iW29iamVjdCBEYXRhVmlld10iLGdjPWtlKGN0KSxiYz1rZSh1dCksdmM9a2UoaHQpLFNjPWtlKGR0KSxrYz1rZShmdCkseWU9S3Q7KGN0JiZ5ZShuZXcgY3QobmV3IEFycmF5QnVmZmVyKDEpKSkhPW9yfHx1dCYmeWUobmV3IHV0KSE9VnR8fGh0JiZ5ZShodC5yZXNvbHZlKCkpIT1lcnx8ZHQmJnllKG5ldyBkdCkhPXRyfHxmdCYmeWUobmV3IGZ0KSE9cnIpJiYoeWU9ZnVuY3Rpb24obyl7dmFyIGU9S3QobyksdD1lPT1tYz9vLmNvbnN0cnVjdG9yOnZvaWQgMCxyPXQ/a2UodCk6IiI7aWYocilzd2l0Y2gocil7Y2FzZSBnYzpyZXR1cm4gb3I7Y2FzZSBiYzpyZXR1cm4gVnQ7Y2FzZSB2YzpyZXR1cm4gZXI7Y2FzZSBTYzpyZXR1cm4gdHI7Y2FzZSBrYzpyZXR1cm4gcnJ9cmV0dXJuIGV9KTt2YXIgR2U9eWUsUGM9T2JqZWN0LnByb3RvdHlwZSxUYz1QYy5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBJYyhvKXt2YXIgZT1vLmxlbmd0aCx0PW5ldyBvLmNvbnN0cnVjdG9yKGUpO3JldHVybiBlJiZ0eXBlb2Ygb1swXT09InN0cmluZyImJlRjLmNhbGwobywiaW5kZXgiKSYmKHQuaW5kZXg9by5pbmRleCx0LmlucHV0PW8uaW5wdXQpLHR9dmFyIHhjPUljLE9jPWllLExjPU9jLlVpbnQ4QXJyYXksc3I9TGMsaXI9c3I7ZnVuY3Rpb24gQ2Mobyl7dmFyIGU9bmV3IG8uY29uc3RydWN0b3Ioby5ieXRlTGVuZ3RoKTtyZXR1cm4gbmV3IGlyKGUpLnNldChuZXcgaXIobykpLGV9dmFyIHB0PUNjLE5jPXB0O2Z1bmN0aW9uIFdjKG8sZSl7dmFyIHQ9ZT9OYyhvLmJ1ZmZlcik6by5idWZmZXI7cmV0dXJuIG5ldyBvLmNvbnN0cnVjdG9yKHQsby5ieXRlT2Zmc2V0LG8uYnl0ZUxlbmd0aCl9dmFyIFJjPVdjLE1jPS9cdyokLztmdW5jdGlvbiBBYyhvKXt2YXIgZT1uZXcgby5jb25zdHJ1Y3RvcihvLnNvdXJjZSxNYy5leGVjKG8pKTtyZXR1cm4gZS5sYXN0SW5kZXg9by5sYXN0SW5kZXgsZX12YXIgJGM9QWMsbnI9RGUsYXI9bnI/bnIucHJvdG90eXBlOnZvaWQgMCxscj1hcj9hci52YWx1ZU9mOnZvaWQgMDtmdW5jdGlvbiBEYyhvKXtyZXR1cm4gbHI/T2JqZWN0KGxyLmNhbGwobykpOnt9fXZhciBqYz1EYyxGYz1wdDtmdW5jdGlvbiBCYyhvLGUpe3ZhciB0PWU/RmMoby5idWZmZXIpOm8uYnVmZmVyO3JldHVybiBuZXcgby5jb25zdHJ1Y3Rvcih0LG8uYnl0ZU9mZnNldCxvLmxlbmd0aCl9dmFyIF9jPUJjLEVjPXB0LHpjPVJjLFVjPSRjLEdjPWpjLFhjPV9jLEhjPSJbb2JqZWN0IEJvb2xlYW5dIixZYz0iW29iamVjdCBEYXRlXSIscWM9IltvYmplY3QgTWFwXSIsWmM9IltvYmplY3QgTnVtYmVyXSIsUWM9IltvYmplY3QgUmVnRXhwXSIsSmM9IltvYmplY3QgU2V0XSIsS2M9IltvYmplY3QgU3RyaW5nXSIsVmM9IltvYmplY3QgU3ltYm9sXSIsZXU9IltvYmplY3QgQXJyYXlCdWZmZXJdIix0dT0iW29iamVjdCBEYXRhVmlld10iLHJ1PSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG91PSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLHN1PSJbb2JqZWN0IEludDhBcnJheV0iLGl1PSJbb2JqZWN0IEludDE2QXJyYXldIixudT0iW29iamVjdCBJbnQzMkFycmF5XSIsYXU9IltvYmplY3QgVWludDhBcnJheV0iLGx1PSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsY3U9IltvYmplY3QgVWludDE2QXJyYXldIix1dT0iW29iamVjdCBVaW50MzJBcnJheV0iO2Z1bmN0aW9uIGh1KG8sZSx0KXt2YXIgcj1vLmNvbnN0cnVjdG9yO3N3aXRjaChlKXtjYXNlIGV1OnJldHVybiBFYyhvKTtjYXNlIEhjOmNhc2UgWWM6cmV0dXJuIG5ldyByKCtvKTtjYXNlIHR1OnJldHVybiB6YyhvLHQpO2Nhc2UgcnU6Y2FzZSBvdTpjYXNlIHN1OmNhc2UgaXU6Y2FzZSBudTpjYXNlIGF1OmNhc2UgbHU6Y2FzZSBjdTpjYXNlIHV1OnJldHVybiBYYyhvLHQpO2Nhc2UgcWM6cmV0dXJuIG5ldyByO2Nhc2UgWmM6Y2FzZSBLYzpyZXR1cm4gbmV3IHIobyk7Y2FzZSBRYzpyZXR1cm4gVWMobyk7Y2FzZSBKYzpyZXR1cm4gbmV3IHI7Y2FzZSBWYzpyZXR1cm4gR2Mobyl9fXZhciBkdT1odSxmdT11ZSxjcj1PYmplY3QuY3JlYXRlLHB1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbygpe31yZXR1cm4gZnVuY3Rpb24oZSl7aWYoIWZ1KGUpKXJldHVybnt9O2lmKGNyKXJldHVybiBjcihlKTtvLnByb3RvdHlwZT1lO3ZhciB0PW5ldyBvO3JldHVybiBvLnByb3RvdHlwZT12b2lkIDAsdH19KCkseXU9cHUsd3U9eXUsbXU9cXQsZ3U9aXQ7ZnVuY3Rpb24gYnUobyl7cmV0dXJuIHR5cGVvZiBvLmNvbnN0cnVjdG9yPT0iZnVuY3Rpb24iJiYhZ3Uobyk/d3UobXUobykpOnt9fXZhciB2dT1idSxTdT1HZSxrdT1jZSxQdT0iW29iamVjdCBNYXBdIjtmdW5jdGlvbiBUdShvKXtyZXR1cm4ga3UobykmJlN1KG8pPT1QdX12YXIgSXU9VHUseHU9SXUsT3U9b3QsdXI9c3QsaHI9dXImJnVyLmlzTWFwLEx1PWhyP091KGhyKTp4dSxDdT1MdSxOdT1HZSxXdT1jZSxSdT0iW29iamVjdCBTZXRdIjtmdW5jdGlvbiBNdShvKXtyZXR1cm4gV3UobykmJk51KG8pPT1SdX12YXIgQXU9TXUsJHU9QXUsRHU9b3QsZHI9c3QsZnI9ZHImJmRyLmlzU2V0LGp1PWZyP0R1KGZyKTokdSxGdT1qdSxCdT1SdCxfdT1ubixFdT0kdCx6dT1KYSxVdT1wbCxHdT15bCxYdT1tbCxIdT1DbCxZdT16bCxxdT1KdCxadT1lYyxRdT1HZSxKdT14YyxLdT1kdSxWdT12dSxlaD1fZSx0aD1ydCxyaD1DdSxvaD11ZSxzaD1GdSxpaD1udCxuaD1hdCxhaD0xLGxoPTIsY2g9NCxwcj0iW29iamVjdCBBcmd1bWVudHNdIix1aD0iW29iamVjdCBBcnJheV0iLGhoPSJbb2JqZWN0IEJvb2xlYW5dIixkaD0iW29iamVjdCBEYXRlXSIsZmg9IltvYmplY3QgRXJyb3JdIix5cj0iW29iamVjdCBGdW5jdGlvbl0iLHBoPSJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSIseWg9IltvYmplY3QgTWFwXSIsd2g9IltvYmplY3QgTnVtYmVyXSIsd3I9IltvYmplY3QgT2JqZWN0XSIsbWg9IltvYmplY3QgUmVnRXhwXSIsZ2g9IltvYmplY3QgU2V0XSIsYmg9IltvYmplY3QgU3RyaW5nXSIsdmg9IltvYmplY3QgU3ltYm9sXSIsU2g9IltvYmplY3QgV2Vha01hcF0iLGtoPSJbb2JqZWN0IEFycmF5QnVmZmVyXSIsUGg9IltvYmplY3QgRGF0YVZpZXddIixUaD0iW29iamVjdCBGbG9hdDMyQXJyYXldIixJaD0iW29iamVjdCBGbG9hdDY0QXJyYXldIix4aD0iW29iamVjdCBJbnQ4QXJyYXldIixPaD0iW29iamVjdCBJbnQxNkFycmF5XSIsTGg9IltvYmplY3QgSW50MzJBcnJheV0iLENoPSJbb2JqZWN0IFVpbnQ4QXJyYXldIixOaD0iW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0iLFdoPSJbb2JqZWN0IFVpbnQxNkFycmF5XSIsUmg9IltvYmplY3QgVWludDMyQXJyYXldIixVPXt9O1VbcHJdPVVbdWhdPVVba2hdPVVbUGhdPVVbaGhdPVVbZGhdPVVbVGhdPVVbSWhdPVVbeGhdPVVbT2hdPVVbTGhdPVVbeWhdPVVbd2hdPVVbd3JdPVVbbWhdPVVbZ2hdPVVbYmhdPVVbdmhdPVVbQ2hdPVVbTmhdPVVbV2hdPVVbUmhdPSEwLFVbZmhdPVVbeXJdPVVbU2hdPSExO2Z1bmN0aW9uIFhlKG8sZSx0LHIsaSxzKXt2YXIgbixhPWUmYWgsbD1lJmxoLGM9ZSZjaDtpZih0JiYobj1pP3QobyxyLGkscyk6dChvKSksbiE9PXZvaWQgMClyZXR1cm4gbjtpZighb2gobykpcmV0dXJuIG87dmFyIHU9ZWgobyk7aWYodSl7aWYobj1KdShvKSwhYSlyZXR1cm4gWHUobyxuKX1lbHNle3ZhciBoPVF1KG8pLGQ9aD09eXJ8fGg9PXBoO2lmKHRoKG8pKXJldHVybiBHdShvLGEpO2lmKGg9PXdyfHxoPT1wcnx8ZCYmIWkpe2lmKG49bHx8ZD97fTpWdShvKSwhYSlyZXR1cm4gbD9ZdShvLFV1KG4sbykpOkh1KG8senUobixvKSl9ZWxzZXtpZighVVtoXSlyZXR1cm4gaT9vOnt9O249S3UobyxoLGEpfX1zfHwocz1uZXcgQnUpO3ZhciBmPXMuZ2V0KG8pO2lmKGYpcmV0dXJuIGY7cy5zZXQobyxuKSxzaChvKT9vLmZvckVhY2goZnVuY3Rpb24oZyl7bi5hZGQoWGUoZyxlLHQsZyxvLHMpKX0pOnJoKG8pJiZvLmZvckVhY2goZnVuY3Rpb24oZyxQKXtuLnNldChQLFhlKGcsZSx0LFAsbyxzKSl9KTt2YXIgdz1jP2w/WnU6cXU6bD9uaDppaCx5PXU/dm9pZCAwOncobyk7cmV0dXJuIF91KHl8fG8sZnVuY3Rpb24oZyxQKXt5JiYoUD1nLGc9b1tQXSksRXUobixQLFhlKGcsZSx0LFAsbyxzKSl9KSxufXZhciBNaD1YZSxBaD1NaCwkaD0xLERoPTQ7ZnVuY3Rpb24gamgobyl7cmV0dXJuIEFoKG8sJGh8RGgpfXZhciBGaD1qaCxyZT1tZShGaCksbXI7KGZ1bmN0aW9uKG8pe29bby5wZWRkaW5nPTBdPSJwZWRkaW5nIixvW28ubW91bnRlZD0xXT0ibW91bnRlZCIsb1tvLnVwZGF0ZT0yXT0idXBkYXRlIixvW28udW5tb3VudGVkPTNdPSJ1bm1vdW50ZWQifSkobXJ8fChtcj17fSkpO3ZhciBROyhmdW5jdGlvbihvKXtvLk5vcm1hbD0iTm9ybWFsIixvLlN0cm9rZT0iU3Ryb2tlIixvLkRvdHRlZD0iRG90dGVkIixvLkxvbmdEb3R0ZWQ9IkxvbmdEb3R0ZWQifSkoUXx8KFE9e30pKTt2YXIgZ3I7KGZ1bmN0aW9uKG8pe28uVHJpYW5nbGU9InRyaWFuZ2xlIixvLlJob21idXM9InJob21idXMiLG8uUGVudGFncmFtPSJwZW50YWdyYW0iLG8uU3BlZWNoQmFsbG9vbj0ic3BlZWNoQmFsbG9vbiIsby5TdGFyPSJzdGFyIixvLlBvbHlnb249InBvbHlnb24ifSkoZ3J8fChncj17fSkpO3ZhciBCOyhmdW5jdGlvbihvKXtvLk5vbmU9Ik5vbmUiLG8uU2hvd0Zsb2F0QmFyPSJTaG93RmxvYXRCYXIiLG8uWkluZGV4RmxvYXRCYXI9IlpJbmRleEZsb2F0QmFyIixvLkRlbGV0ZU5vZGU9IkRlbGV0ZU5vZGUiLG8uQ29weU5vZGU9IkNvcHlOb2RlIixvLlpJbmRleEFjdGl2ZT0iWkluZGV4QWN0aXZlIixvLlpJbmRleE5vZGU9IlpJbmRleE5vZGUiLG8uUm90YXRlTm9kZT0iUm90YXRlTm9kZSIsby5TZXRDb2xvck5vZGU9IlNldENvbG9yTm9kZSIsby5UcmFuc2xhdGVOb2RlPSJUcmFuc2xhdGVOb2RlIixvLlNjYWxlTm9kZT0iU2NhbGVOb2RlIixvLk9yaWdpbmFsRXZlbnQ9Ik9yaWdpbmFsRXZlbnQiLG8uQ3JlYXRlU2NlbmU9IkNyZWF0ZVNjZW5lIixvLkFjdGl2ZUN1cnNvcj0iQWN0aXZlQ3Vyc29yIixvLk1vdmVDdXJzb3I9Ik1vdmVDdXJzb3IiLG8uQ29tbWFuZEVkaXRvcj0iQ29tbWFuZEVkaXRvciIsby5TZXRFZGl0b3JEYXRhPSJTZXRFZGl0b3JEYXRhIixvLlNldEZvbnRTdHlsZT0iU2V0Rm9udFN0eWxlIixvLlNldFBvaW50PSJTZXRQb2ludCIsby5TZXRMb2NrPSJTZXRMb2NrIixvLlNldFNoYXBlT3B0PSJTZXRTaGFwZU9wdCJ9KShCfHwoQj17fSkpO3ZhciBicjsoZnVuY3Rpb24obyl7by5EaXNwbGF5U3RhdGU9IkRpc3BsYXlTdGF0ZSIsby5GbG9hdEJhcj0iRmxvYXRCYXIiLG8uQ2FudmFzU2VsZWN0b3I9IkNhbnZhc1NlbGVjdG9yIixvLk1haW5FbmdpbmU9Ik1haW5FbmdpbmUiLG8uRGlzcGxheUNvbnRhaW5lcj0iRGlzcGxheUNvbnRhaW5lciIsby5DdXJzb3I9IkN1cnNvciIsby5UZXh0RWRpdG9yPSJUZXh0RWRpdG9yIixvLkJpbmRNYWluVmlldz0iQmluZE1haW5WaWV3IixvLk1vdW50TWFpblZpZXc9Ik1vdW50TWFpblZpZXciLG8uTW91bnRBcHBWaWV3PSJNb3VudEFwcFZpZXcifSkoYnJ8fChicj17fSkpO3ZhciB2cjsoZnVuY3Rpb24obyl7b1tvLk1haW5WaWV3PTBdPSJNYWluVmlldyIsb1tvLlBsdWdpbj0xXT0iUGx1Z2luIixvW28uQm90aD0yXT0iQm90aCJ9KSh2cnx8KHZyPXt9KSk7dmFyIFM7KGZ1bmN0aW9uKG8pe29bby5QZW5jaWw9MV09IlBlbmNpbCIsb1tvLkVyYXNlcj0yXT0iRXJhc2VyIixvW28uU2VsZWN0b3I9M109IlNlbGVjdG9yIixvW28uQ2xpY2tlcj00XT0iQ2xpY2tlciIsb1tvLkFycm93PTVdPSJBcnJvdyIsb1tvLkhhbmQ9Nl09IkhhbmQiLG9bby5MYXNlclBlbj03XT0iTGFzZXJQZW4iLG9bby5UZXh0PThdPSJUZXh0IixvW28uU3RyYWlnaHQ9OV09IlN0cmFpZ2h0IixvW28uUmVjdGFuZ2xlPTEwXT0iUmVjdGFuZ2xlIixvW28uRWxsaXBzZT0xMV09IkVsbGlwc2UiLG9bby5TdGFyPTEyXT0iU3RhciIsb1tvLlRyaWFuZ2xlPTEzXT0iVHJpYW5nbGUiLG9bby5SaG9tYnVzPTE0XT0iUmhvbWJ1cyIsb1tvLlBvbHlnb249MTVdPSJQb2x5Z29uIixvW28uU3BlZWNoQmFsbG9vbj0xNl09IlNwZWVjaEJhbGxvb24iLG9bby5JbWFnZT0xN109IkltYWdlIn0pKFN8fChTPXt9KSk7dmFyIFc7KGZ1bmN0aW9uKG8pe29bby5Mb2NhbD0xXT0iTG9jYWwiLG9bby5TZXJ2aWNlPTJdPSJTZXJ2aWNlIixvW28uV29ya2VyPTNdPSJXb3JrZXIifSkoV3x8KFc9e30pKTt2YXIgRjsoZnVuY3Rpb24obyl7b1tvLlBlbmRpbmc9MF09IlBlbmRpbmciLG9bby5TdGFydD0xXT0iU3RhcnQiLG9bby5Eb2luZz0yXT0iRG9pbmciLG9bby5Eb25lPTNdPSJEb25lIixvW28uRnJlZXplPTRdPSJGcmVlemUiLG9bby5VbndyaXRhYmxlPTVdPSJVbndyaXRhYmxlIn0pKEZ8fChGPXt9KSk7dmFyIG07KGZ1bmN0aW9uKG8pe29bby5Ob25lPTBdPSJOb25lIixvW28uSW5pdD0xXT0iSW5pdCIsb1tvLlVwZGF0ZUNhbWVyYT0yXT0iVXBkYXRlQ2FtZXJhIixvW28uVXBkYXRlVG9vbHM9M109IlVwZGF0ZVRvb2xzIixvW28uQ3JlYXRlV29yaz00XT0iQ3JlYXRlV29yayIsb1tvLkRyYXdXb3JrPTVdPSJEcmF3V29yayIsb1tvLkZ1bGxXb3JrPTZdPSJGdWxsV29yayIsb1tvLlVwZGF0ZU5vZGU9N109IlVwZGF0ZU5vZGUiLG9bby5SZW1vdmVOb2RlPThdPSJSZW1vdmVOb2RlIixvW28uQ2xlYXI9OV09IkNsZWFyIixvW28uU2VsZWN0PTEwXT0iU2VsZWN0IixvW28uRGVzdHJveT0xMV09IkRlc3Ryb3kiLG9bby5TbmFwc2hvdD0xMl09IlNuYXBzaG90IixvW28uQm91bmRpbmdCb3g9MTNdPSJCb3VuZGluZ0JveCIsb1tvLkN1cnNvcj0xNF09IkN1cnNvciIsb1tvLlRleHRVcGRhdGU9MTVdPSJUZXh0VXBkYXRlIixvW28uR2V0VGV4dEFjdGl2ZT0xNl09IkdldFRleHRBY3RpdmUiLG9bby5UYXNrc1F1ZXVlPTE3XT0iVGFza3NRdWV1ZSIsb1tvLkN1cnNvckhvdmVyPTE4XT0iQ3Vyc29ySG92ZXIifSkobXx8KG09e30pKTt2YXIgU3I7KGZ1bmN0aW9uKG8pe28uV2ViZ2wyPSJ3ZWJnbDIiLG8uV2ViZ2w9IndlYmdsIixvLkNhbnZhczJkPSIyZCJ9KShTcnx8KFNyPXt9KSk7dmFyIE47KGZ1bmN0aW9uKG8pe29bby5GbG9hdD0xXT0iRmxvYXQiLG9bby5CZz0yXT0iQmciLG9bby5TZWxlY3Rvcj0zXT0iU2VsZWN0b3IiLG9bby5TZXJ2aWNlRmxvYXQ9NF09IlNlcnZpY2VGbG9hdCIsb1tvLk5vbmU9NV09Ik5vbmUifSkoTnx8KE49e30pKTt2YXIga3I7KGZ1bmN0aW9uKG8pe29bby5DdXJzb3I9MV09IkN1cnNvciIsb1tvLlRleHRDcmVhdGU9Ml09IlRleHRDcmVhdGUifSkoa3J8fChrcj17fSkpO3ZhciBQcjsoZnVuY3Rpb24obyl7b1tvLlRvcD0xXT0iVG9wIixvW28uQm90dG9tPTJdPSJCb3R0b20ifSkoUHJ8fChQcj17fSkpO3ZhciBxOyhmdW5jdGlvbihvKXtvW28ubm9uZT0xXT0ibm9uZSIsb1tvLmFsbD0yXT0iYWxsIixvW28uYm90aD0zXT0iYm90aCIsb1tvLnByb3BvcnRpb25hbD00XT0icHJvcG9ydGlvbmFsIn0pKHF8fChxPXt9KSk7Y2xhc3Mgb2V7Y29uc3RydWN0b3IoKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywibG9jYWxXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjZW5lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSl9cmVnaXN0ZXJGb3JXb3JrZXIoZSx0LHIpe3JldHVybiB0aGlzLmxvY2FsV29yaz1lLHRoaXMuc2VydmljZVdvcms9dCx0aGlzLnNjZW5lPXIsdGhpc319Y29uc3QgQmg9e2xpbmVhcjpvPT5vLGVhc2VJblF1YWQ6bz0+bypvLGVhc2VPdXRRdWFkOm89Pm8qKDItbyksZWFzZUluT3V0UXVhZDpvPT5vPC41PzIqbypvOi0xKyg0LTIqbykqbyxlYXNlSW5DdWJpYzpvPT5vKm8qbyxlYXNlT3V0Q3ViaWM6bz0+LS1vKm8qbysxLGVhc2VJbk91dEN1YmljOm89Pm88LjU/NCpvKm8qbzooby0xKSooMipvLTIpKigyKm8tMikrMSxlYXNlSW5RdWFydDpvPT5vKm8qbypvLGVhc2VPdXRRdWFydDpvPT4xLSAtLW8qbypvKm8sZWFzZUluT3V0UXVhcnQ6bz0+bzwuNT84Km8qbypvKm86MS04Ki0tbypvKm8qbyxlYXNlSW5RdWludDpvPT5vKm8qbypvKm8sZWFzZU91dFF1aW50Om89PjErLS1vKm8qbypvKm8sZWFzZUluT3V0UXVpbnQ6bz0+bzwuNT8xNipvKm8qbypvKm86MSsxNiotLW8qbypvKm8qbyxlYXNlSW5TaW5lOm89PjEtTWF0aC5jb3MobypNYXRoLlBJLzIpLGVhc2VPdXRTaW5lOm89Pk1hdGguc2luKG8qTWF0aC5QSS8yKSxlYXNlSW5PdXRTaW5lOm89Pi0oTWF0aC5jb3MoTWF0aC5QSSpvKS0xKS8yLGVhc2VJbkV4cG86bz0+bzw9MD8wOk1hdGgucG93KDIsMTAqby0xMCksZWFzZU91dEV4cG86bz0+bz49MT8xOjEtTWF0aC5wb3coMiwtMTAqbyksZWFzZUluT3V0RXhwbzpvPT5vPD0wPzA6bz49MT8xOm88LjU/TWF0aC5wb3coMiwyMCpvLTEwKS8yOigyLU1hdGgucG93KDIsLTIwKm8rMTApKS8yfTtjbGFzcyBwe2NvbnN0cnVjdG9yKGU9MCx0PTAscj0xKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOmV9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnJ9KX1nZXQgWFkoKXtyZXR1cm5bdGhpcy54LHRoaXMueV19c2V0eihlKXtyZXR1cm4gdGhpcy56PWUsdGhpc31zZXRYWShlPXRoaXMueCx0PXRoaXMueSl7cmV0dXJuIHRoaXMueD1lLHRoaXMueT10LHRoaXN9c2V0KGU9dGhpcy54LHQ9dGhpcy55LHI9dGhpcy56KXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpcy56PXIsdGhpc31zZXRUbyh7eDplPTAseTp0PTAsejpyPTF9KXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpcy56PXIsdGhpc31yb3QoZSl7aWYoZT09PTApcmV0dXJuIHRoaXM7Y29uc3R7eDp0LHk6cn09dGhpcyxpPU1hdGguc2luKGUpLHM9TWF0aC5jb3MoZSk7cmV0dXJuIHRoaXMueD10KnMtcippLHRoaXMueT10KmkrcipzLHRoaXN9cm90V2l0aChlLHQpe2lmKHQ9PT0wKXJldHVybiB0aGlzO2NvbnN0IHI9dGhpcy54LWUueCxpPXRoaXMueS1lLnkscz1NYXRoLnNpbih0KSxuPU1hdGguY29zKHQpO3JldHVybiB0aGlzLng9ZS54KyhyKm4taSpzKSx0aGlzLnk9ZS55KyhyKnMraSpuKSx0aGlzfWNsb25lKCl7Y29uc3R7eDplLHk6dCx6OnJ9PXRoaXM7cmV0dXJuIG5ldyBwKGUsdCxyKX1zdWIoZSl7cmV0dXJuIHRoaXMueC09ZS54LHRoaXMueS09ZS55LHRoaXN9c3ViWFkoZSx0KXtyZXR1cm4gdGhpcy54LT1lLHRoaXMueS09dCx0aGlzfXN1YlNjYWxhcihlKXtyZXR1cm4gdGhpcy54LT1lLHRoaXMueS09ZSx0aGlzfWFkZChlKXtyZXR1cm4gdGhpcy54Kz1lLngsdGhpcy55Kz1lLnksdGhpc31hZGRYWShlLHQpe3JldHVybiB0aGlzLngrPWUsdGhpcy55Kz10LHRoaXN9YWRkU2NhbGFyKGUpe3JldHVybiB0aGlzLngrPWUsdGhpcy55Kz1lLHRoaXN9Y2xhbXAoZSx0KXtyZXR1cm4gdGhpcy54PU1hdGgubWF4KHRoaXMueCxlKSx0aGlzLnk9TWF0aC5tYXgodGhpcy55LGUpLHQhPT12b2lkIDAmJih0aGlzLng9TWF0aC5taW4odGhpcy54LHQpLHRoaXMueT1NYXRoLm1pbih0aGlzLnksdCkpLHRoaXN9ZGl2KGUpe3JldHVybiB0aGlzLngvPWUsdGhpcy55Lz1lLHRoaXN9ZGl2VihlKXtyZXR1cm4gdGhpcy54Lz1lLngsdGhpcy55Lz1lLnksdGhpc31tdWwoZSl7cmV0dXJuIHRoaXMueCo9ZSx0aGlzLnkqPWUsdGhpc31tdWxWKGUpe3JldHVybiB0aGlzLngqPWUueCx0aGlzLnkqPWUueSx0aGlzfWFicygpe3JldHVybiB0aGlzLng9TWF0aC5hYnModGhpcy54KSx0aGlzLnk9TWF0aC5hYnModGhpcy55KSx0aGlzfW51ZGdlKGUsdCl7Y29uc3Qgcj1wLlRhbihlLHRoaXMpO3JldHVybiB0aGlzLmFkZChyLm11bCh0KSl9bmVnKCl7cmV0dXJuIHRoaXMueCo9LTEsdGhpcy55Kj0tMSx0aGlzfWNyb3NzKGUpe3JldHVybiB0aGlzLng9dGhpcy55KmUuei10aGlzLnoqZS55LHRoaXMueT10aGlzLnoqZS54LXRoaXMueCplLnosdGhpc31kcHIoZSl7cmV0dXJuIHAuRHByKHRoaXMsZSl9Y3ByKGUpe3JldHVybiBwLkNwcih0aGlzLGUpfWxlbjIoKXtyZXR1cm4gcC5MZW4yKHRoaXMpfWxlbigpe3JldHVybiBwLkxlbih0aGlzKX1wcnkoZSl7cmV0dXJuIHAuUHJ5KHRoaXMsZSl9cGVyKCl7Y29uc3R7eDplLHk6dH09dGhpcztyZXR1cm4gdGhpcy54PXQsdGhpcy55PS1lLHRoaXN9dW5pKCl7cmV0dXJuIHAuVW5pKHRoaXMpfXRhbihlKXtyZXR1cm4gcC5UYW4odGhpcyxlKX1kaXN0KGUpe3JldHVybiBwLkRpc3QodGhpcyxlKX1kaXN0YW5jZVRvTGluZVNlZ21lbnQoZSx0KXtyZXR1cm4gcC5EaXN0YW5jZVRvTGluZVNlZ21lbnQoZSx0LHRoaXMpfXNsb3BlKGUpe3JldHVybiBwLlNsb3BlKHRoaXMsZSl9c25hcFRvR3JpZChlKXtyZXR1cm4gdGhpcy54PU1hdGgucm91bmQodGhpcy54L2UpKmUsdGhpcy55PU1hdGgucm91bmQodGhpcy55L2UpKmUsdGhpc31hbmdsZShlKXtyZXR1cm4gcC5BbmdsZSh0aGlzLGUpfXRvQW5nbGUoKXtyZXR1cm4gcC5Ub0FuZ2xlKHRoaXMpfWxycChlLHQpe3JldHVybiB0aGlzLng9dGhpcy54KyhlLngtdGhpcy54KSp0LHRoaXMueT10aGlzLnkrKGUueS10aGlzLnkpKnQsdGhpc31lcXVhbHMoZSx0KXtyZXR1cm4gcC5FcXVhbHModGhpcyxlLHQpfWVxdWFsc1hZKGUsdCl7cmV0dXJuIHAuRXF1YWxzWFkodGhpcyxlLHQpfW5vcm0oKXtjb25zdCBlPXRoaXMubGVuKCk7cmV0dXJuIHRoaXMueD1lPT09MD8wOnRoaXMueC9lLHRoaXMueT1lPT09MD8wOnRoaXMueS9lLHRoaXN9dG9GaXhlZCgpe3JldHVybiBwLlRvRml4ZWQodGhpcyl9dG9TdHJpbmcoKXtyZXR1cm4gcC5Ub1N0cmluZyhwLlRvRml4ZWQodGhpcykpfXRvSnNvbigpe3JldHVybiBwLlRvSnNvbih0aGlzKX10b0FycmF5KCl7cmV0dXJuIHAuVG9BcnJheSh0aGlzKX1zdGF0aWMgQWRkKGUsdCl7cmV0dXJuIG5ldyBwKGUueCt0LngsZS55K3QueSl9c3RhdGljIEFkZFhZKGUsdCxyKXtyZXR1cm4gbmV3IHAoZS54K3QsZS55K3IpfXN0YXRpYyBTdWIoZSx0KXtyZXR1cm4gbmV3IHAoZS54LXQueCxlLnktdC55KX1zdGF0aWMgU3ViWFkoZSx0LHIpe3JldHVybiBuZXcgcChlLngtdCxlLnktcil9c3RhdGljIEFkZFNjYWxhcihlLHQpe3JldHVybiBuZXcgcChlLngrdCxlLnkrdCl9c3RhdGljIFN1YlNjYWxhcihlLHQpe3JldHVybiBuZXcgcChlLngtdCxlLnktdCl9c3RhdGljIERpdihlLHQpe3JldHVybiBuZXcgcChlLngvdCxlLnkvdCl9c3RhdGljIE11bChlLHQpe3JldHVybiBuZXcgcChlLngqdCxlLnkqdCl9c3RhdGljIERpdlYoZSx0KXtyZXR1cm4gbmV3IHAoZS54L3QueCxlLnkvdC55KX1zdGF0aWMgTXVsVihlLHQpe3JldHVybiBuZXcgcChlLngqdC54LGUueSp0LnkpfXN0YXRpYyBOZWcoZSl7cmV0dXJuIG5ldyBwKC1lLngsLWUueSl9c3RhdGljIFBlcihlKXtyZXR1cm4gbmV3IHAoZS55LC1lLngpfXN0YXRpYyBEaXN0MihlLHQpe3JldHVybiBwLlN1YihlLHQpLmxlbjIoKX1zdGF0aWMgQWJzKGUpe3JldHVybiBuZXcgcChNYXRoLmFicyhlLngpLE1hdGguYWJzKGUueSkpfXN0YXRpYyBEaXN0KGUsdCl7cmV0dXJuIE1hdGguaHlwb3QoZS55LXQueSxlLngtdC54KX1zdGF0aWMgRHByKGUsdCl7cmV0dXJuIGUueCp0LngrZS55KnQueX1zdGF0aWMgQ3Jvc3MoZSx0KXtyZXR1cm4gbmV3IHAoZS55KnQuei1lLnoqdC55LGUueip0LngtZS54KnQueil9c3RhdGljIENwcihlLHQpe3JldHVybiBlLngqdC55LXQueCplLnl9c3RhdGljIExlbjIoZSl7cmV0dXJuIGUueCplLngrZS55KmUueX1zdGF0aWMgTGVuKGUpe3JldHVybiBNYXRoLmh5cG90KGUueCxlLnkpfXN0YXRpYyBQcnkoZSx0KXtyZXR1cm4gcC5EcHIoZSx0KS9wLkxlbih0KX1zdGF0aWMgVW5pKGUpe3JldHVybiBwLkRpdihlLHAuTGVuKGUpKX1zdGF0aWMgVGFuKGUsdCl7cmV0dXJuIHAuVW5pKHAuU3ViKGUsdCkpfXN0YXRpYyBNaW4oZSx0KXtyZXR1cm4gbmV3IHAoTWF0aC5taW4oZS54LHQueCksTWF0aC5taW4oZS55LHQueSkpfXN0YXRpYyBNYXgoZSx0KXtyZXR1cm4gbmV3IHAoTWF0aC5tYXgoZS54LHQueCksTWF0aC5tYXgoZS55LHQueSkpfXN0YXRpYyBGcm9tKGUpe3JldHVybiBuZXcgcCgpLmFkZChlKX1zdGF0aWMgRnJvbUFycmF5KGUpe3JldHVybiBuZXcgcChlWzBdLGVbMV0pfXN0YXRpYyBSb3QoZSx0PTApe2NvbnN0IHI9TWF0aC5zaW4odCksaT1NYXRoLmNvcyh0KTtyZXR1cm4gbmV3IHAoZS54KmktZS55KnIsZS54KnIrZS55KmkpfXN0YXRpYyBSb3RXaXRoKGUsdCxyKXtjb25zdCBpPWUueC10Lngscz1lLnktdC55LG49TWF0aC5zaW4ociksYT1NYXRoLmNvcyhyKTtyZXR1cm4gbmV3IHAodC54KyhpKmEtcypuKSx0LnkrKGkqbitzKmEpKX1zdGF0aWMgTmVhcmVzdFBvaW50T25MaW5lVGhyb3VnaFBvaW50KGUsdCxyKXtyZXR1cm4gcC5NdWwodCxwLlN1YihyLGUpLnByeSh0KSkuYWRkKGUpfXN0YXRpYyBOZWFyZXN0UG9pbnRPbkxpbmVTZWdtZW50KGUsdCxyLGk9ITApe2NvbnN0IHM9cC5UYW4odCxlKSxuPXAuQWRkKGUscC5NdWwocyxwLlN1YihyLGUpLnByeShzKSkpO2lmKGkpe2lmKG4ueDxNYXRoLm1pbihlLngsdC54KSlyZXR1cm4gcC5DYXN0KGUueDx0Lng/ZTp0KTtpZihuLng+TWF0aC5tYXgoZS54LHQueCkpcmV0dXJuIHAuQ2FzdChlLng+dC54P2U6dCk7aWYobi55PE1hdGgubWluKGUueSx0LnkpKXJldHVybiBwLkNhc3QoZS55PHQueT9lOnQpO2lmKG4ueT5NYXRoLm1heChlLnksdC55KSlyZXR1cm4gcC5DYXN0KGUueT50Lnk/ZTp0KX1yZXR1cm4gbn1zdGF0aWMgRGlzdGFuY2VUb0xpbmVUaHJvdWdoUG9pbnQoZSx0LHIpe3JldHVybiBwLkRpc3QocixwLk5lYXJlc3RQb2ludE9uTGluZVRocm91Z2hQb2ludChlLHQscikpfXN0YXRpYyBEaXN0YW5jZVRvTGluZVNlZ21lbnQoZSx0LHIsaT0hMCl7cmV0dXJuIHAuRGlzdChyLHAuTmVhcmVzdFBvaW50T25MaW5lU2VnbWVudChlLHQscixpKSl9c3RhdGljIFNuYXAoZSx0PTEpe3JldHVybiBuZXcgcChNYXRoLnJvdW5kKGUueC90KSp0LE1hdGgucm91bmQoZS55L3QpKnQpfXN0YXRpYyBDYXN0KGUpe3JldHVybiBlIGluc3RhbmNlb2YgcD9lOnAuRnJvbShlKX1zdGF0aWMgU2xvcGUoZSx0KXtyZXR1cm4gZS54PT09dC55P05hTjooZS55LXQueSkvKGUueC10LngpfXN0YXRpYyBBbmdsZShlLHQpe3JldHVybiBNYXRoLmF0YW4yKHQueS1lLnksdC54LWUueCl9c3RhdGljIExycChlLHQscil7cmV0dXJuIHAuU3ViKHQsZSkubXVsKHIpLmFkZChlKX1zdGF0aWMgTWVkKGUsdCl7cmV0dXJuIG5ldyBwKChlLngrdC54KS8yLChlLnkrdC55KS8yKX1zdGF0aWMgRXF1YWxzKGUsdCxyPTFlLTQpe3JldHVybiBNYXRoLmFicyhlLngtdC54KTxyJiZNYXRoLmFicyhlLnktdC55KTxyfXN0YXRpYyBFcXVhbHNYWShlLHQscil7cmV0dXJuIGUueD09PXQmJmUueT09PXJ9c3RhdGljIEVxdWFsc1hZWihlLHQscj0xZS00KXtyZXR1cm4gcC5FcXVhbHMoZSx0LHIpJiZNYXRoLmFicygoZS56fHwwKS0odC56fHwwKSk8cn1zdGF0aWMgQ2xvY2t3aXNlKGUsdCxyKXtyZXR1cm4oci54LWUueCkqKHQueS1lLnkpLSh0LngtZS54KSooci55LWUueSk8MH1zdGF0aWMgUmVzY2FsZShlLHQpe2NvbnN0IHI9cC5MZW4oZSk7cmV0dXJuIG5ldyBwKHQqZS54L3IsdCplLnkvcil9c3RhdGljIFNjYWxlV2l0aE9yaWdpbihlLHQscil7cmV0dXJuIHAuU3ViKGUscikubXVsKHQpLmFkZChyKX1zdGF0aWMgU2NhbGVXT3JpZ2luKGUsdCxyKXtyZXR1cm4gcC5TdWIoZSxyKS5tdWxWKHQpLmFkZChyKX1zdGF0aWMgVG9GaXhlZChlLHQ9Mil7cmV0dXJuIG5ldyBwKCtlLngudG9GaXhlZCh0KSwrZS55LnRvRml4ZWQodCksK2Uuei50b0ZpeGVkKHQpKX1zdGF0aWMgTnVkZ2UoZSx0LHIpe3JldHVybiBwLkFkZChlLHAuVGFuKHQsZSkubXVsKHIpKX1zdGF0aWMgVG9TdHJpbmcoZSl7cmV0dXJuYCR7ZS54fSwgJHtlLnl9YH1zdGF0aWMgVG9BbmdsZShlKXtsZXQgdD1NYXRoLmF0YW4yKGUueSxlLngpO3JldHVybiB0PDAmJih0Kz1NYXRoLlBJKjIpLHR9c3RhdGljIEZyb21BbmdsZShlLHQ9MSl7cmV0dXJuIG5ldyBwKE1hdGguY29zKGUpKnQsTWF0aC5zaW4oZSkqdCl9c3RhdGljIFRvQXJyYXkoZSl7cmV0dXJuW2UueCxlLnksZS56XX1zdGF0aWMgVG9Kc29uKGUpe2NvbnN0e3g6dCx5OnIsejppfT1lO3JldHVybnt4OnQseTpyLHo6aX19c3RhdGljIEF2ZXJhZ2UoZSl7Y29uc3QgdD1lLmxlbmd0aCxyPW5ldyBwKDAsMCk7Zm9yKGxldCBpPTA7aTx0O2krKylyLmFkZChlW2ldKTtyZXR1cm4gci5kaXYodCl9c3RhdGljIENsYW1wKGUsdCxyKXtyZXR1cm4gcj09PXZvaWQgMD9uZXcgcChNYXRoLm1pbihNYXRoLm1heChlLngsdCkpLE1hdGgubWluKE1hdGgubWF4KGUueSx0KSkpOm5ldyBwKE1hdGgubWluKE1hdGgubWF4KGUueCx0KSxyKSxNYXRoLm1pbihNYXRoLm1heChlLnksdCkscikpfXN0YXRpYyBQb2ludHNCZXR3ZWVuKGUsdCxyPTYpe2NvbnN0IGk9W107Zm9yKGxldCBzPTA7czxyO3MrKyl7Y29uc3Qgbj1CaC5lYXNlSW5RdWFkKHMvKHItMSkpLGE9cC5McnAoZSx0LG4pO2Euej1NYXRoLm1pbigxLC41K01hdGguYWJzKC41LV9oKG4pKSouNjUpLGkucHVzaChhKX1yZXR1cm4gaX1zdGF0aWMgU25hcFRvR3JpZChlLHQ9OCl7cmV0dXJuIG5ldyBwKE1hdGgucm91bmQoZS54L3QpKnQsTWF0aC5yb3VuZChlLnkvdCkqdCl9fWNvbnN0IF9oPW89Pm88LjU/MipvKm86LTErKDQtMipvKSpvO2NsYXNzIFIgZXh0ZW5kcyBwe2NvbnN0cnVjdG9yKGU9MCx0PTAscj0wLGk9e3g6MCx5OjB9LHM9MCxuPTApe3N1cGVyKGUsdCxyKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOmV9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywieiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOml9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnN9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm59KX1nZXQgdGltZXN0YW1wKCl7cmV0dXJuIHRoaXMudH1nZXQgcHJlc3N1cmUoKXtyZXR1cm4gdGhpcy56fWdldCBhbmdsZU51bSgpe3JldHVybiB0aGlzLmF9Z2V0IFhZKCl7cmV0dXJuW3RoaXMueCx0aGlzLnldfXNldEEoZSl7dGhpcy5hPWV9c2V0VChlKXt0aGlzLnQ9ZX1zZXR2KGUpe3JldHVybiB0aGlzLnY9e3g6ZS54LHk6ZS55fSx0aGlzfXNldChlPXRoaXMueCx0PXRoaXMueSxyPXRoaXMueixpPXRoaXMudixzPXRoaXMudCxuPXRoaXMuYSl7cmV0dXJuIHRoaXMueD1lLHRoaXMueT10LHRoaXMuej1yLHRoaXMudj1pLHRoaXMudD1zLHRoaXMuYT1uLHRoaXN9Y2xvbmUoKXtjb25zdHt4OmUseTp0LHo6cix2OmksdDpzLGE6bn09dGhpcyxhPXt4OmkueCx5OmkueX07cmV0dXJuIG5ldyBSKGUsdCxyLGEscyxuKX1kaXN0YW5jZShlKXtyZXR1cm4gUi5HZXREaXN0YW5jZSh0aGlzLGUpfWlzTmVhcihlLHQpe3JldHVybiBSLklzTmVhcih0aGlzLGUsdCl9Z2V0QW5nbGVCeVBvaW50cyhlLHQpe3JldHVybiBSLkdldEFuZ2xlQnlQb2ludHMoZSx0aGlzLHQpfXN0YXRpYyBTdWIoZSx0KXtyZXR1cm4gbmV3IFIoZS54LXQueCxlLnktdC55KX1zdGF0aWMgQWRkKGUsdCl7cmV0dXJuIG5ldyBSKGUueCt0LngsZS55K3QueSl9c3RhdGljIEdldERpc3RhbmNlKGUsdCl7cmV0dXJuIFIuTGVuKGUuY2xvbmUoKS5zdWIodCkpfXN0YXRpYyBHZXRBbmdsZUJ5UG9pbnRzKGUsdCxyKXtjb25zdCBpPXQueC1lLngscz1yLngtdC54LG49dC55LWUueSxhPXIueS10Lnk7bGV0IGw9MDtjb25zdCBjPU1hdGguc3FydChpKmkrbipuKSx1PU1hdGguc3FydChzKnMrYSphKTtpZihjJiZ1KXtjb25zdCBoPWkqcytuKmE7bD1NYXRoLmFjb3MoaC8oYyp1KSksbD1sL01hdGguUEkqMTgwO2xldCBkPWkqYS1uKnM7ZD1kPjA/MTotMSxsPTE4MCtkKmx9cmV0dXJuIGx9c3RhdGljIElzTmVhcihlLHQscil7cmV0dXJuIFIuTGVuKGUuY2xvbmUoKS5zdWIodCkpPHJ9c3RhdGljIFJvdFdpdGgoZSx0LHIsaT0yKXtjb25zdCBzPWUueC10Lngsbj1lLnktdC55LGE9TWF0aC5zaW4ociksbD1NYXRoLmNvcyhyKSxjPU1hdGgucG93KDEwLGkpLHU9TWF0aC5mbG9vcigodC54KyhzKmwtbiphKSkqYykvYyxoPU1hdGguZmxvb3IoKHQueSsocyphK24qbCkpKmMpL2M7cmV0dXJuIG5ldyBSKHUsaCl9c3RhdGljIEdldERvdFN0cm9rZShlLHQscj0xNil7Y29uc3QgaT1uZXcgcCgxLDEpLHM9TWF0aC5QSSsuMDAxLG49Ui5BZGQoZSxSLlN1YihlLGkpLnVuaSgpLnBlcigpLm11bCgtdCkpLGE9W107Zm9yKGxldCBsPTEvcixjPWw7Yzw9MTtjKz1sKWEucHVzaChSLlJvdFdpdGgobixlLHMqMipjKSk7cmV0dXJuIGF9c3RhdGljIEdldFNlbWljaXJjbGVTdHJva2UoZSx0LHI9LTEsaT04KXtjb25zdCBzPXIqKE1hdGguUEkrLjAwMSksbj1bXTtmb3IobGV0IGE9MS9pLGw9YTtsPD0xO2wrPWEpbi5wdXNoKFIuUm90V2l0aCh0LGUscypsKSk7cmV0dXJuIG59fWZ1bmN0aW9uIEEobyxlKXtpZihvJiZlKXtjb25zdCB0PU1hdGgubWluKG8ueCxlLngpLHI9TWF0aC5taW4oby55LGUueSksaT1NYXRoLm1heChvLngrby53LGUueCtlLncpLHM9TWF0aC5tYXgoby55K28uaCxlLnkrZS5oKSxuPWktdCxhPXMtcjtyZXR1cm57eDp0LHk6cix3Om4saDphfX1yZXR1cm4gZXx8b31mdW5jdGlvbiBHKG8sZT0wKXtjb25zdCB0PXt4OjAseTowLHc6MCxoOjB9O2xldCByPTEvMCxpPTEvMCxzPS0xLzAsbj0tMS8wO3JldHVybiBvLmZvckVhY2goYT0+e2NvbnN0W2wsY109YS5YWTtyPU1hdGgubWluKHIsbC1lKSxpPU1hdGgubWluKGksYy1lKSxzPU1hdGgubWF4KHMsbCtlKSxuPU1hdGgubWF4KG4sYytlKX0pLHQueD1yLHQueT1pLHQudz1zLXIsdC5oPW4taSx0fWZ1bmN0aW9uIFBlKG8sZSl7cmV0dXJuIShvLngrby53PGUueHx8by54PmUueCtlLnd8fG8ueStvLmg8ZS55fHxvLnk+ZS55K2UuaCl9ZnVuY3Rpb24gRWgobyxlKXtyZXR1cm4gby5sZW5ndGg9PT1lLmxlbmd0aCYmby5zb3J0KCkudG9TdHJpbmcoKT09PWUuc29ydCgpLnRvU3RyaW5nKCl9ZnVuY3Rpb24gSyhvLGU9MTApe3JldHVybnt4Ok1hdGguZmxvb3Ioby54LWUpLHk6TWF0aC5mbG9vcihvLnktZSksdzpNYXRoLmZsb29yKG8udytlKjIpLGg6TWF0aC5mbG9vcihvLmgrZSoyKX19ZnVuY3Rpb24gQ2UobyxlKXtyZXR1cm57eDpvLngrZVswXSx5Om8ueStlWzFdLHc6by53LGg6by5ofX1mdW5jdGlvbiBUcihvLGUpe2NvbnN0IHQ9bmV3IHAoby54LG8ueSkscj1uZXcgcChvLngrby53LG8ueSksaT1uZXcgcChvLngrby53LG8ueStvLmgpLHM9bmV3IHAoby54LG8ueStvLmgpLG49bmV3IHAoby54K28udy8yLG8ueStvLmgvMiksYT1NYXRoLlBJKmUvMTgwLGw9cC5Sb3RXaXRoKHQsbixhKSxjPXAuUm90V2l0aChyLG4sYSksdT1wLlJvdFdpdGgoaSxuLGEpLGg9cC5Sb3RXaXRoKHMsbixhKTtyZXR1cm4gRyhbbCxjLHUsaF0pfWZ1bmN0aW9uIElyKG8sZSl7Y29uc3QgdD1uZXcgcChvLngsby55KSxyPW5ldyBwKG8ueCtvLncsby55KSxpPW5ldyBwKG8ueCtvLncsby55K28uaCkscz1uZXcgcChvLngsby55K28uaCksbj1uZXcgcChvLngrby53LzIsby55K28uaC8yKSxhPW5ldyBwKGVbMF0sZVsxXSksbD1wLlNjYWxlV09yaWdpbih0LGEsbiksYz1wLlNjYWxlV09yaWdpbihyLGEsbiksdT1wLlNjYWxlV09yaWdpbihpLGEsbiksaD1wLlNjYWxlV09yaWdpbihzLGEsbik7cmV0dXJuIEcoW2wsYyx1LGhdKX1mdW5jdGlvbiB6aChvLGUsdCl7Y29uc3Qgcj1uZXcgcChlWzBdLGVbMV0pO2ZvcihsZXQgaT0wO2k8by5sZW5ndGg7aSs9Myl7Y29uc3Qgcz1uZXcgcChvW2ldLG9baSsxXSksbj1NYXRoLlBJKnQvMTgwLGE9cC5Sb3RXaXRoKHMscixuKTtvW2ldPWEueCxvW2krMV09YS55fX1mdW5jdGlvbiBVaChvLGUsdCl7Y29uc3Qgcj1uZXcgcChlWzBdLGVbMV0pO2ZvcihsZXQgaT0wO2k8by5sZW5ndGg7aSs9Myl7Y29uc3Qgcz1uZXcgcChvW2ldLG9baSsxXSksbj1uZXcgcCh0WzBdLHRbMV0pO2lmKGk8by5sZW5ndGgtMyl7Y29uc3QgbD1uZXcgcChvW2krM10sb1tpKzRdKSxjPXAuVGFuKGwscykucGVyKCkubXVsKG9baSsyXSkubXVsVihuKS5sZW4oKTtvW2krMl09Y31lbHNlIGlmKGk9PT1vLmxlbmd0aC0zKXtjb25zdCBsPW5ldyBwKG9baS0zXSxvW2ktMl0pLGM9cC5UYW4ocyxsKS5wZXIoKS5tdWwob1tpKzJdKS5tdWxWKG4pLmxlbigpO29baSsyXT1jfWNvbnN0IGE9cC5TY2FsZVdPcmlnaW4ocyxuLHIpO29baV09YS54LG9baSsxXT1hLnl9fWZ1bmN0aW9uIEdoKG8sZSl7cmV0dXJuIG9bMF0+PWUueCYmb1swXTw9ZS54K2UudyYmb1sxXT49ZS55JiZvWzFdPD1lLnkrZS5ofWZ1bmN0aW9uIHhyKG8sZSl7Y29uc3QgdD1vPD1lPzE6by9lLHI9ZTw9bz8xOmUvbztyZXR1cm5bdCxyXX1jb25zdCBIZT1vPT57aWYoby50YWdOYW1lPT09IkdST1VQIil7Y29uc3QgZT1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG8pLmZpbmQodD0+dC50b1N0cmluZygpPT09IlN5bWJvbChzZWFsZWQpIik7aWYoZSYmb1tlXSlyZXR1cm4hMH1yZXR1cm4hMX0sT3I9bz0+byE9PVMuVGV4dDtmdW5jdGlvbiBUZShvKXtyZXR1cm5gJHtZZShvLngpfSwke1llKG8ueSl9IGB9ZnVuY3Rpb24gSWUobyxlKXtyZXR1cm5gJHtZZSgoby54K2UueCkvMil9LCR7WWUoKG8ueStlLnkpLzIpfSBgfWZ1bmN0aW9uIFllKG8pe3JldHVybitvLnRvRml4ZWQoNCl9dmFyIFhoPWZlLEhoPWNlLFloPSJbb2JqZWN0IE51bWJlcl0iO2Z1bmN0aW9uIHFoKG8pe3JldHVybiB0eXBlb2Ygbz09Im51bWJlciJ8fEhoKG8pJiZYaChvKT09WWh9dmFyIFpoPXFoLGhlPW1lKFpoKTtjbGFzcyB4e2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVW5pdFRpbWUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZToxZTN9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidk5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJmdWxsTGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSk7Y29uc3R7dk5vZGVzOnQsZnVsbExheWVyOnIsZHJhd0xheWVyOml9PWU7dGhpcy52Tm9kZXM9dCx0aGlzLmZ1bGxMYXllcj1yLHRoaXMuZHJhd0xheWVyPWl9c2V0V29ya0lkKGUpe3RoaXMud29ya0lkPWV9Z2V0V29ya0lkKCl7cmV0dXJuIHRoaXMud29ya0lkfWdldFdvcmtPcHRpb25zKCl7cmV0dXJuIHRoaXMud29ya09wdGlvbnN9c2V0V29ya09wdGlvbnMoZSl7dmFyIGk7dGhpcy53b3JrT3B0aW9ucz1lLHRoaXMuc3luY1VuaXRUaW1lPWUuc3luY1VuaXRUaW1lfHx0aGlzLnN5bmNVbml0VGltZTtjb25zdCB0PShpPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpLHI9dCYmdGhpcy52Tm9kZXMuZ2V0KHQpfHx2b2lkIDA7dCYmciYmKHIub3B0PWUsdGhpcy52Tm9kZXMuc2V0SW5mbyh0LHIpKX11cGRhdGFPcHRTZXJ2aWNlKGUpe3ZhciBpO2xldCB0O2NvbnN0IHI9KGk9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDppLnRvU3RyaW5nKCk7aWYociYmZSl7Y29uc3Qgcz10aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShyKXx8dGhpcy5kcmF3TGF5ZXImJnRoaXMuZHJhd0xheWVyLmdldEVsZW1lbnRzQnlOYW1lKHIpfHxbXTtpZihzLmxlbmd0aCE9PTEpcmV0dXJuO2NvbnN0IG49c1swXSx7cG9zOmEsekluZGV4Omwsc2NhbGU6YyxhbmdsZTp1LHRyYW5zbGF0ZTpofT1lLGQ9e307aGUobCkmJihkLnpJbmRleD1sKSxhJiYoZC5wb3M9W2FbMF0sYVsxXV0pLGMmJihkLnNjYWxlPWMpLHUmJihkLnJvdGF0ZT11KSxoJiYoZC50cmFuc2xhdGU9aCksbi5hdHRyKGQpO2NvbnN0IGY9bj09bnVsbD92b2lkIDA6bi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm4gZiYmKHQ9QSh0LHt4Ok1hdGguZmxvb3IoZi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihmLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGYud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoZi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX0pKSx0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6dCxjZW50ZXJQb3M6YX0pLHR9fXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aSx3aWxsU2VyaWFsaXplRGF0YTpzLHRhcmdldE5vZGU6bn09ZSx7ekluZGV4OmEsdHJhbnNsYXRlOmwsYW5nbGU6Yyxib3g6dSxib3hTY2FsZTpoLGJveFRyYW5zbGF0ZTpkLHBvaW50TWFwOmZ9PXI7bGV0IHc7Y29uc3QgeT1uJiZyZShuKXx8aS5nZXQodC5uYW1lKTtpZigheSlyZXR1cm47aGUoYSkmJih0LnNldEF0dHJpYnV0ZSgiekluZGV4IixhKSx5Lm9wdC56SW5kZXg9YSk7Y29uc3QgZz10LnBhcmVudDtpZihnKXtpZih1JiZkJiZoKXtjb25zdHtyZWN0OlB9PXksaz1bXTtmb3IobGV0IEQ9MDtEPHkub3AubGVuZ3RoO0QrPTMpay5wdXNoKG5ldyBSKHkub3BbRF0seS5vcFtEKzFdLHkub3BbRCsyXSkpO2NvbnN0IE89RyhrKSxJPVtPLncqZy53b3JsZFNjYWxpbmdbMF0sTy5oKmcud29ybGRTY2FsaW5nWzBdXSxiPVtQLnctSVswXSxQLmgtSVsxXV0sdj1bKFAudypoWzBdLWJbMF0pL0lbMF0sKFAuaCpoWzFdLWJbMV0pL0lbMV1dLEw9W2RbMF0vZy53b3JsZFNjYWxpbmdbMF0sZFsxXS9nLndvcmxkU2NhbGluZ1sxXV0sVD15Lm9wLm1hcCgoRCxIKT0+e2NvbnN0IFY9SCUzO3JldHVybiBWPT09MD9EK0xbMF06Vj09PTE/RCtMWzFdOkR9KSxNPVt5LmNlbnRlclBvc1swXStMWzBdLHkuY2VudGVyUG9zWzFdK0xbMV1dO1VoKFQsTSx2KTtjb25zdCAkPVtdO2ZvcihsZXQgRD0wO0Q8VC5sZW5ndGg7RCs9MykkLnB1c2gobmV3IFIoVFtEXSxUW0QrMV0sVFtEKzJdKSk7eS5vcD1ULHkuY2VudGVyUG9zPU19ZWxzZSBpZihsKXtjb25zdCBQPVtsWzBdL2cud29ybGRTY2FsaW5nWzBdLGxbMV0vZy53b3JsZFNjYWxpbmdbMV1dO3Quc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFApLHkub3B0LnRyYW5zbGF0ZT1QLG4mJih3PUNlKHkucmVjdCxsKSx5LnJlY3Q9dyl9ZWxzZSBoZShjKSYmKHQuc2V0QXR0cmlidXRlKCJyb3RhdGUiLGMpLHkub3B0LnJvdGF0ZT1jLG4mJih3PVRyKHkucmVjdCxjKSx5LnJlY3Q9dykpO2lmKGYpe2NvbnN0IFA9Zi5nZXQodC5uYW1lKTtpZihQKWZvcihsZXQgaz0wLE89MDtrPHkub3AubGVuZ3RoO2srPTMsTysrKXkub3Bba109UFtPXVswXSx5Lm9wW2srMV09UFtPXVsxXX1pZihzKXtpZihsKXtjb25zdCBQPVtsWzBdL2cud29ybGRTY2FsaW5nWzBdLGxbMV0vZy53b3JsZFNjYWxpbmdbMV1dLGs9eS5vcC5tYXAoKE8sSSk9Pntjb25zdCBiPUklMztyZXR1cm4gYj09PTA/TytQWzBdOmI9PT0xP08rUFsxXTpPfSk7eS5vcD1rLHkuY2VudGVyUG9zPVt5LmNlbnRlclBvc1swXStQWzBdLHkuY2VudGVyUG9zWzFdK1BbMV1dLHkhPW51bGwmJnkub3B0JiYoeS5vcHQudHJhbnNsYXRlPXZvaWQgMCl9ZWxzZSBpZihoZShjKSl7Y29uc3QgUD15Lm9wO3poKFAseS5jZW50ZXJQb3MsYykseS5vcD1QLHkhPW51bGwmJnkub3B0JiYoeS5vcHQucm90YXRlPXZvaWQgMCl9fXkmJmkuc2V0SW5mbyh0Lm5hbWUseSl9fXN0YXRpYyBnZXRDZW50ZXJQb3MoZSx0KXtjb25zdHt3b3JsZFBvc2l0aW9uOnIsd29ybGRTY2FsaW5nOml9PXQ7cmV0dXJuWyhlLngrZS53LzItclswXSkvaVswXSwoZS55K2UuaC8yLXJbMV0pL2lbMV1dfXN0YXRpYyBnZXRSZWN0RnJvbUxheWVyKGUsdCl7Y29uc3Qgcj1lLmdldEVsZW1lbnRzQnlOYW1lKHQpWzBdO2lmKHIpe2NvbnN0IGk9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGkueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoaS55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihpLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGkuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHgsIlNhZmVCb3JkZXJQYWRkaW5nIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MTB9KTtmdW5jdGlvbiB4ZShvLGU9ITApe2NvbnN0IHQ9by5sZW5ndGg7aWYodDwyKXJldHVybiIiO2xldCByPW9bMF0saT1vWzFdO2lmKHQ9PT0yKXJldHVybmBNJHtUZShyKX1MJHtUZShpKX1gO2xldCBzPSIiO2ZvcihsZXQgbj0yLGE9dC0xO248YTtuKyspcj1vW25dLGk9b1tuKzFdLHMrPUllKHIsaSk7cmV0dXJuIGU/YE0ke0llKG9bMF0sb1sxXSl9USR7VGUob1sxXSl9JHtJZShvWzFdLG9bMl0pfVQke3N9JHtJZShvW3QtMV0sb1swXSl9JHtJZShvWzBdLG9bMV0pfVpgOmBNJHtUZShvWzBdKX1RJHtUZShvWzFdKX0ke0llKG9bMV0sb1syXSl9JHtvLmxlbmd0aD4zPyJUIjoiIn0ke3N9TCR7VGUob1t0LTFdKX1gfXZhciB5dD17ZXhwb3J0czp7fX07eXQuZXhwb3J0cyxmdW5jdGlvbihvKXt2YXIgZT1mdW5jdGlvbigpe3ZhciB0PVN0cmluZy5mcm9tQ2hhckNvZGUscj0iQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0iLGk9IkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky0kIixzPXt9O2Z1bmN0aW9uIG4obCxjKXtpZighc1tsXSl7c1tsXT17fTtmb3IodmFyIHU9MDt1PGwubGVuZ3RoO3UrKylzW2xdW2wuY2hhckF0KHUpXT11fXJldHVybiBzW2xdW2NdfXZhciBhPXtjb21wcmVzc1RvQmFzZTY0OmZ1bmN0aW9uKGwpe2lmKGw9PW51bGwpcmV0dXJuIiI7dmFyIGM9YS5fY29tcHJlc3MobCw2LGZ1bmN0aW9uKHUpe3JldHVybiByLmNoYXJBdCh1KX0pO3N3aXRjaChjLmxlbmd0aCU0KXtkZWZhdWx0OmNhc2UgMDpyZXR1cm4gYztjYXNlIDE6cmV0dXJuIGMrIj09PSI7Y2FzZSAyOnJldHVybiBjKyI9PSI7Y2FzZSAzOnJldHVybiBjKyI9In19LGRlY29tcHJlc3NGcm9tQmFzZTY0OmZ1bmN0aW9uKGwpe3JldHVybiBsPT1udWxsPyIiOmw9PSIiP251bGw6YS5fZGVjb21wcmVzcyhsLmxlbmd0aCwzMixmdW5jdGlvbihjKXtyZXR1cm4gbihyLGwuY2hhckF0KGMpKX0pfSxjb21wcmVzc1RvVVRGMTY6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6YS5fY29tcHJlc3MobCwxNSxmdW5jdGlvbihjKXtyZXR1cm4gdChjKzMyKX0pKyIgIn0sZGVjb21wcmVzc0Zyb21VVEYxNjpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjpsPT0iIj9udWxsOmEuX2RlY29tcHJlc3MobC5sZW5ndGgsMTYzODQsZnVuY3Rpb24oYyl7cmV0dXJuIGwuY2hhckNvZGVBdChjKS0zMn0pfSxjb21wcmVzc1RvVWludDhBcnJheTpmdW5jdGlvbihsKXtmb3IodmFyIGM9YS5jb21wcmVzcyhsKSx1PW5ldyBVaW50OEFycmF5KGMubGVuZ3RoKjIpLGg9MCxkPWMubGVuZ3RoO2g8ZDtoKyspe3ZhciBmPWMuY2hhckNvZGVBdChoKTt1W2gqMl09Zj4+PjgsdVtoKjIrMV09ZiUyNTZ9cmV0dXJuIHV9LGRlY29tcHJlc3NGcm9tVWludDhBcnJheTpmdW5jdGlvbihsKXtpZihsPT1udWxsKXJldHVybiBhLmRlY29tcHJlc3MobCk7Zm9yKHZhciBjPW5ldyBBcnJheShsLmxlbmd0aC8yKSx1PTAsaD1jLmxlbmd0aDt1PGg7dSsrKWNbdV09bFt1KjJdKjI1NitsW3UqMisxXTt2YXIgZD1bXTtyZXR1cm4gYy5mb3JFYWNoKGZ1bmN0aW9uKGYpe2QucHVzaCh0KGYpKX0pLGEuZGVjb21wcmVzcyhkLmpvaW4oIiIpKX0sY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQ6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6YS5fY29tcHJlc3MobCw2LGZ1bmN0aW9uKGMpe3JldHVybiBpLmNoYXJBdChjKX0pfSxkZWNvbXByZXNzRnJvbUVuY29kZWRVUklDb21wb25lbnQ6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6bD09IiI/bnVsbDoobD1sLnJlcGxhY2UoLyAvZywiKyIpLGEuX2RlY29tcHJlc3MobC5sZW5ndGgsMzIsZnVuY3Rpb24oYyl7cmV0dXJuIG4oaSxsLmNoYXJBdChjKSl9KSl9LGNvbXByZXNzOmZ1bmN0aW9uKGwpe3JldHVybiBhLl9jb21wcmVzcyhsLDE2LGZ1bmN0aW9uKGMpe3JldHVybiB0KGMpfSl9LF9jb21wcmVzczpmdW5jdGlvbihsLGMsdSl7aWYobD09bnVsbClyZXR1cm4iIjt2YXIgaCxkLGY9e30sdz17fSx5PSIiLGc9IiIsUD0iIixrPTIsTz0zLEk9MixiPVtdLHY9MCxMPTAsVDtmb3IoVD0wO1Q8bC5sZW5ndGg7VCs9MSlpZih5PWwuY2hhckF0KFQpLE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChmLHkpfHwoZlt5XT1PKyssd1t5XT0hMCksZz1QK3ksT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGYsZykpUD1nO2Vsc2V7aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHcsUCkpe2lmKFAuY2hhckNvZGVBdCgwKTwyNTYpe2ZvcihoPTA7aDxJO2grKyl2PXY8PDEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrO2ZvcihkPVAuY2hhckNvZGVBdCgwKSxoPTA7aDw4O2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjF9ZWxzZXtmb3IoZD0xLGg9MDtoPEk7aCsrKXY9djw8MXxkLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPTA7Zm9yKGQ9UC5jaGFyQ29kZUF0KDApLGg9MDtoPDE2O2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjF9ay0tLGs9PTAmJihrPU1hdGgucG93KDIsSSksSSsrKSxkZWxldGUgd1tQXX1lbHNlIGZvcihkPWZbUF0saD0wO2g8STtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xO2stLSxrPT0wJiYoaz1NYXRoLnBvdygyLEkpLEkrKyksZltnXT1PKyssUD1TdHJpbmcoeSl9aWYoUCE9PSIiKXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodyxQKSl7aWYoUC5jaGFyQ29kZUF0KDApPDI1Nil7Zm9yKGg9MDtoPEk7aCsrKXY9djw8MSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKys7Zm9yKGQ9UC5jaGFyQ29kZUF0KDApLGg9MDtoPDg7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1lbHNle2ZvcihkPTEsaD0wO2g8STtoKyspdj12PDwxfGQsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9MDtmb3IoZD1QLmNoYXJDb2RlQXQoMCksaD0wO2g8MTY7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1rLS0saz09MCYmKGs9TWF0aC5wb3coMixJKSxJKyspLGRlbGV0ZSB3W1BdfWVsc2UgZm9yKGQ9ZltQXSxoPTA7aDxJO2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjE7ay0tLGs9PTAmJihrPU1hdGgucG93KDIsSSksSSsrKX1mb3IoZD0yLGg9MDtoPEk7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MTtmb3IoOzspaWYodj12PDwxLEw9PWMtMSl7Yi5wdXNoKHUodikpO2JyZWFrfWVsc2UgTCsrO3JldHVybiBiLmpvaW4oIiIpfSxkZWNvbXByZXNzOmZ1bmN0aW9uKGwpe3JldHVybiBsPT1udWxsPyIiOmw9PSIiP251bGw6YS5fZGVjb21wcmVzcyhsLmxlbmd0aCwzMjc2OCxmdW5jdGlvbihjKXtyZXR1cm4gbC5jaGFyQ29kZUF0KGMpfSl9LF9kZWNvbXByZXNzOmZ1bmN0aW9uKGwsYyx1KXt2YXIgaD1bXSxkPTQsZj00LHc9Myx5PSIiLGc9W10sUCxrLE8sSSxiLHYsTCxUPXt2YWw6dSgwKSxwb3NpdGlvbjpjLGluZGV4OjF9O2ZvcihQPTA7UDwzO1ArPTEpaFtQXT1QO2ZvcihPPTAsYj1NYXRoLnBvdygyLDIpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO3N3aXRjaChPKXtjYXNlIDA6Zm9yKE89MCxiPU1hdGgucG93KDIsOCksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7TD10KE8pO2JyZWFrO2Nhc2UgMTpmb3IoTz0wLGI9TWF0aC5wb3coMiwxNiksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7TD10KE8pO2JyZWFrO2Nhc2UgMjpyZXR1cm4iIn1mb3IoaFszXT1MLGs9TCxnLnB1c2goTCk7Oyl7aWYoVC5pbmRleD5sKXJldHVybiIiO2ZvcihPPTAsYj1NYXRoLnBvdygyLHcpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO3N3aXRjaChMPU8pe2Nhc2UgMDpmb3IoTz0wLGI9TWF0aC5wb3coMiw4KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtoW2YrK109dChPKSxMPWYtMSxkLS07YnJlYWs7Y2FzZSAxOmZvcihPPTAsYj1NYXRoLnBvdygyLDE2KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtoW2YrK109dChPKSxMPWYtMSxkLS07YnJlYWs7Y2FzZSAyOnJldHVybiBnLmpvaW4oIiIpfWlmKGQ9PTAmJihkPU1hdGgucG93KDIsdyksdysrKSxoW0xdKXk9aFtMXTtlbHNlIGlmKEw9PT1mKXk9aytrLmNoYXJBdCgwKTtlbHNlIHJldHVybiBudWxsO2cucHVzaCh5KSxoW2YrK109ayt5LmNoYXJBdCgwKSxkLS0saz15LGQ9PTAmJihkPU1hdGgucG93KDIsdyksdysrKX19fTtyZXR1cm4gYX0oKTtvIT1udWxsP28uZXhwb3J0cz1lOnR5cGVvZiBhbmd1bGFyPCJ1IiYmYW5ndWxhciE9bnVsbCYmYW5ndWxhci5tb2R1bGUoIkxaU3RyaW5nIixbXSkuZmFjdG9yeSgiTFpTdHJpbmciLGZ1bmN0aW9uKCl7cmV0dXJuIGV9KX0oeXQpO3ZhciBMcj15dC5leHBvcnRzO2Z1bmN0aW9uIHFlKG8pe3JldHVybiBKU09OLnBhcnNlKExyLmRlY29tcHJlc3MobykpfWZ1bmN0aW9uIGxlKG8pe3JldHVybiBMci5jb21wcmVzcyhKU09OLnN0cmluZ2lmeShvKSl9Y2xhc3MgQ3IgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlBlbmNpbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNJbmRleCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiTUFYX1JFUEVBUiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInVuaVRoaWNrbmVzcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjZW50ZXJQb3MiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbMCwwXX0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnVuaVRoaWNrbmVzcz10aGlzLk1BWF9SRVBFQVIvdGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MvMTAsdGhpcy5zeW5jVGltZXN0YW1wPTB9Y29tYmluZUNvbnN1bWUoKXt2YXIgbjtjb25zdCBlPShuPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpLHQ9dGhpcy50cmFuc2Zvcm1EYXRhQWxsKCEwKSxyPXtuYW1lOmV9O2xldCBpO2NvbnN0IHM9dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO3JldHVybiB0Lmxlbmd0aCYmKGk9dGhpcy5kcmF3KHthdHRyczpyLHRhc2tzOnQscmVwbGFjZUlkOmUsbGF5ZXI6cyxpc0NsZWFyQWxsOiEwfSkpLHtyZWN0OmksdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWx9fXNldFdvcmtPcHRpb25zKGUpe3N1cGVyLnNldFdvcmtPcHRpb25zKGUpLHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpfWNvbnN1bWUoZSl7dmFyIHk7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc0NsZWFyQWxsOmksaXNTdWJXb3JrZXI6c309ZTtpZigoKHk9dC5vcCk9PW51bGw/dm9pZCAwOnkubGVuZ3RoKT09PTApcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHt3b3JrSWQ6bn09dCx7dGFza3M6YSxlZmZlY3RzOmwsY29uc3VtZUluZGV4OmN9PXRoaXMudHJhbnNmb3JtRGF0YSh0LCExKTt0aGlzLnN5bmNJbmRleD1NYXRoLm1pbih0aGlzLnN5bmNJbmRleCxjLE1hdGgubWF4KDAsdGhpcy50bXBQb2ludHMubGVuZ3RoLTIpKTtjb25zdCB1PXtuYW1lOm49PW51bGw/dm9pZCAwOm4udG9TdHJpbmcoKX07bGV0IGgsZD0hMTtjb25zdCBmPXRoaXMuc3luY0luZGV4O2lmKHRoaXMuc3luY1RpbWVzdGFtcD09PTAmJih0aGlzLnN5bmNUaW1lc3RhbXA9RGF0ZS5ub3coKSksYS5sZW5ndGgmJihhWzBdLnRhc2tJZC10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWUmJihkPSEwLHRoaXMuc3luY1RpbWVzdGFtcD1hWzBdLnRhc2tJZCx0aGlzLnN5bmNJbmRleD10aGlzLnRtcFBvaW50cy5sZW5ndGgpLHMpKXtjb25zdCBnPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO2g9dGhpcy5kcmF3KHthdHRyczp1LHRhc2tzOmEsZWZmZWN0czpsLGxheWVyOmcsaXNDbGVhckFsbDppfSl9aWYocylyZXR1cm4gYz4xMCYmdGhpcy50bXBQb2ludHMuc3BsaWNlKDAsYy0xMCkse3JlY3Q6aCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbH07Y29uc3Qgdz1bXTtyZXR1cm4gdGhpcy50bXBQb2ludHMuc2xpY2UoZikuZm9yRWFjaChnPT57dy5wdXNoKGcueCxnLnksdGhpcy5jb21wdXRSYWRpdXMoZy56LHRoaXMud29ya09wdGlvbnMudGhpY2tuZXNzKSl9KSx7cmVjdDpoLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpkP246dm9pZCAwLG9wOmQ/dzp2b2lkIDAsaW5kZXg6ZD9mKjM6dm9pZCAwfX1jb25zdW1lQWxsKGUpe3ZhciBjLHU7aWYoZS5kYXRhKXtjb25zdHtvcDpoLHdvcmtTdGF0ZTpkfT1lLmRhdGE7aCE9bnVsbCYmaC5sZW5ndGgmJmQ9PT1GLkRvbmUmJnRoaXMud29ya09wdGlvbnMuc3Ryb2tlVHlwZT09PVEuU3Ryb2tlJiZ0aGlzLnVwZGF0ZVRlbXBQb2ludHNXaXRoUHJlc3N1cmVXaGVuRG9uZShoKX1jb25zdCB0PShjPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6Yy50b1N0cmluZygpO2lmKCF0KXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3Qgcj10aGlzLnRyYW5zZm9ybURhdGFBbGwoITApLGk9e25hbWU6dH07bGV0IHM7Y29uc3Qgbj10aGlzLmZ1bGxMYXllcjtyLmxlbmd0aCYmKHM9dGhpcy5kcmF3KHthdHRyczppLHRhc2tzOnIscmVwbGFjZUlkOnQsbGF5ZXI6bixpc0NsZWFyQWxsOiExfSkpO2NvbnN0IGE9W107dGhpcy50bXBQb2ludHMubWFwKGg9PnthLnB1c2goaC54LGgueSx0aGlzLmNvbXB1dFJhZGl1cyhoLnosdGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MpKX0pLHRoaXMuc3luY1RpbWVzdGFtcD0wLGRlbGV0ZSB0aGlzLndvcmtPcHRpb25zLnN5bmNVbml0VGltZTtjb25zdCBsPWxlKGEpO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHQse3JlY3Q6cyxvcDphLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLG4pfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6dCxvcHM6bCx1cGRhdGVOb2RlT3B0Ontwb3M6dGhpcy5jZW50ZXJQb3MsdXNlQW5pbWF0aW9uOiEwfSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx1bmRvVGlja2VySWQ6KHU9ZS5kYXRhKT09bnVsbD92b2lkIDA6dS51bmRvVGlja2VySWR9fWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTAsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jSW5kZXg9MH1jb25zdW1lU2VydmljZShlKXt2YXIgaDtjb25zdHtvcDp0LGlzRnVsbFdvcms6cixyZXBsYWNlSWQ6aSxpc0NsZWFyQWxsOnMsaXNUZW1wOm59PWU7dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBkPTA7ZDx0Lmxlbmd0aDtkKz0zKXtjb25zdCBmPW5ldyBSKHRbZF0sdFtkKzFdLHRbZCsyXSk7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPjApe2NvbnN0IHc9dGhpcy50bXBQb2ludHNbdGhpcy50bXBQb2ludHMubGVuZ3RoLTFdLHk9cC5TdWIoZix3KS51bmkoKTtmLnNldHYoeSl9dGhpcy50bXBQb2ludHMucHVzaChmKX1jb25zdCBhPXRoaXMudHJhbnNmb3JtRGF0YUFsbCghMSksbD0oaD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmgudG9TdHJpbmcoKSxjPXtuYW1lOmx9O2xldCB1O2lmKGwmJmEubGVuZ3RoKXtjb25zdCBkPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO3U9dGhpcy5kcmF3KHthdHRyczpjLHRhc2tzOmEscmVwbGFjZUlkOmksbGF5ZXI6ZCxpc0NsZWFyQWxsOnN9KSxyJiYhbiYmdGhpcy52Tm9kZXMuc2V0SW5mbyhsLHtyZWN0OnUsb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6dSYmeC5nZXRDZW50ZXJQb3ModSxkKX0pfXJldHVybiB1fXRyYW5zZm9ybURhdGFBbGwoZT0hMCl7cmV0dXJuIHRoaXMuZ2V0VGFza1BvaW50cyh0aGlzLnRtcFBvaW50cyxlJiZ0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc3x8dm9pZCAwKX1kcmF3KGUpe3ZhciBJO2NvbnN0e2F0dHJzOnQsdGFza3M6cixyZXBsYWNlSWQ6aSxlZmZlY3RzOnMsbGF5ZXI6bixpc0NsZWFyQWxsOmF9PWUse3N0cm9rZUNvbG9yOmwsc3Ryb2tlVHlwZTpjLHRoaWNrbmVzczp1LHpJbmRleDpoLHNjYWxlOmQscm90YXRlOmYsdHJhbnNsYXRlOnd9PXRoaXMud29ya09wdGlvbnM7YSYmbi5yZW1vdmVBbGxDaGlsZHJlbigpLGkmJih0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShpKyIiKS5tYXAoYj0+Yi5yZW1vdmUoKSksKEk9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxJLmdldEVsZW1lbnRzQnlOYW1lKGkrIiIpLm1hcChiPT5iLnJlbW92ZSgpKSkscyE9bnVsbCYmcy5zaXplJiYocy5mb3JFYWNoKGI9Pnt2YXIgdjsodj1uLmdldEVsZW1lbnRCeUlkKGIrIiIpKT09bnVsbHx8di5yZW1vdmUoKX0pLHMuY2xlYXIoKSk7bGV0IHk7Y29uc3QgZz1bXSxQPW4ud29ybGRQb3NpdGlvbixrPW4ud29ybGRTY2FsaW5nO2ZvcihsZXQgYj0wO2I8ci5sZW5ndGg7YisrKXtjb25zdHtwb3M6dixwb2ludHM6TCx0YXNrSWQ6VH09cltiXTt0LmlkPVQudG9TdHJpbmcoKTtjb25zdHtwczpNLHJlY3Q6JH09dGhpcy5jb21wdXREcmF3UG9pbnRzKEwpO2xldCBEO2NvbnN0IEg9TC5sZW5ndGg9PT0xO2M9PT1RLlN0cm9rZXx8SD9EPXhlKE0sITApOkQ9eGUoTSwhMSk7Y29uc3QgVj17cG9zOnYsZDpELGZpbGxDb2xvcjpjPT09US5TdHJva2V8fEg/bDp2b2lkIDAsbGluZURhc2g6Yz09PVEuRG90dGVkJiYhSD9bMSx1KjJdOmM9PT1RLkxvbmdEb3R0ZWQmJiFIP1t1LHUqMl06dm9pZCAwLHN0cm9rZUNvbG9yOmwsbGluZUNhcDpjPT09US5TdHJva2V8fEg/dm9pZCAwOiJyb3VuZCIsbGluZVdpZHRoOmM9PT1RLlN0cm9rZXx8SD8wOnV9O3k9QSh5LHt4Ok1hdGguZmxvb3IoKCQueCt2WzBdKSprWzBdK1BbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKCgkLnkrdlsxXSkqa1sxXStQWzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcigkLncqa1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcigkLmgqa1sxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfSksZy5wdXNoKFYpfWQmJih0LnNjYWxlPWQpLGYmJih0LnJvdGF0ZT1mKSx3JiYodC50cmFuc2xhdGU9dyk7Y29uc3QgTz1uZXcgei5Hcm91cDtpZih5KXt0aGlzLmNlbnRlclBvcz14LmdldENlbnRlclBvcyh5LG4pLE8uYXR0cih7Li4udCxub3JtYWxpemU6ITAsaWQ6dC5uYW1lLGFuY2hvcjpbLjUsLjVdLGJnY29sb3I6Yz09PVEuU3Ryb2tlP2w6dm9pZCAwLHBvczp0aGlzLmNlbnRlclBvcyxzaXplOlsoeS53LTIqeC5TYWZlQm9yZGVyUGFkZGluZykva1swXSwoeS5oLTIqeC5TYWZlQm9yZGVyUGFkZGluZykva1sxXV0sekluZGV4Omh9KTtjb25zdCBiPWcubWFwKHY9Pih2LnBvcz1bdi5wb3NbMF0tdGhpcy5jZW50ZXJQb3NbMF0sdi5wb3NbMV0tdGhpcy5jZW50ZXJQb3NbMV1dLG5ldyB6LlBhdGgodikpKTtPLmFwcGVuZCguLi5iKSxjPT09US5TdHJva2UmJk8uc2VhbCgpLG4uYXBwZW5kKE8pfWlmKGR8fGZ8fHcpe2NvbnN0IGI9Tz09bnVsbD92b2lkIDA6Ty5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtpZihiKXJldHVybnt4Ok1hdGguZmxvb3IoYi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihiLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGIud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoYi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJuIHl9Y29tcHV0RHJhd1BvaW50cyhlKXtyZXR1cm4gdGhpcy53b3JrT3B0aW9ucy5zdHJva2VUeXBlPT09US5TdHJva2V8fGUubGVuZ3RoPT09MT90aGlzLmNvbXB1dFN0cm9rZShlKTp0aGlzLmNvbXB1dE5vbWFsKGUpfWNvbXB1dE5vbWFsKGUpe2xldCB0PXRoaXMud29ya09wdGlvbnMudGhpY2tuZXNzO2NvbnN0IHI9ZS5tYXAoaT0+KHQ9TWF0aC5tYXgodCxpLnJhZGl1cyksaS5wb2ludCkpO3JldHVybntwczpyLHJlY3Q6RyhyLHQpfX1jb21wdXRTdHJva2UoZSl7cmV0dXJuIGUubGVuZ3RoPT09MT90aGlzLmNvbXB1dERvdFN0cm9rZShlWzBdKTp0aGlzLmNvbXB1dExpbmVTdHJva2UoZSl9Y29tcHV0TGluZVN0cm9rZShlKXtjb25zdCB0PVtdLHI9W107Zm9yKGxldCBsPTA7bDxlLmxlbmd0aDtsKyspe2NvbnN0e3BvaW50OmMscmFkaXVzOnV9PWVbbF07bGV0IGg9Yy52O2w9PT0wJiZlLmxlbmd0aD4xJiYoaD1lW2wrMV0ucG9pbnQudik7Y29uc3QgZD1wLlBlcihoKS5tdWwodSk7dC5wdXNoKFIuU3ViKGMsZCkpLHIucHVzaChSLkFkZChjLGQpKX1jb25zdCBpPWVbZS5sZW5ndGgtMV0scz1SLkdldFNlbWljaXJjbGVTdHJva2UoaS5wb2ludCx0W3QubGVuZ3RoLTFdLC0xLDgpLG49Ui5HZXRTZW1pY2lyY2xlU3Ryb2tlKGVbMF0ucG9pbnQsclswXSwtMSw4KSxhPXQuY29uY2F0KHMsci5yZXZlcnNlKCksbik7cmV0dXJue3BzOmEscmVjdDpHKGEpfX1jb21wdXREb3RTdHJva2UoZSl7Y29uc3R7cG9pbnQ6dCxyYWRpdXM6cn09ZSxpPXt4OnQueC1yLHk6dC55LXIsdzpyKjIsaDpyKjJ9O3JldHVybntwczpSLkdldERvdFN0cm9rZSh0LHIsOCkscmVjdDppfX10cmFuc2Zvcm1EYXRhKGUsdCl7Y29uc3R7b3A6cix3b3JrU3RhdGU6aX09ZTtsZXQgcz10aGlzLnRtcFBvaW50cy5sZW5ndGgtMSxuPVtdO2lmKHIhPW51bGwmJnIubGVuZ3RoJiZpKXtjb25zdHtzdHJva2VUeXBlOmEsdGhpY2tuZXNzOmx9PXRoaXMud29ya09wdGlvbnMsYz1uZXcgU2V0O3M9YT09PVEuU3Ryb2tlP3RoaXMudXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZShyLGwsYyk6dGhpcy51cGRhdGVUZW1wUG9pbnRzKHIsbCxjKTtjb25zdCB1PXQ/dGhpcy50bXBQb2ludHM6dGhpcy50bXBQb2ludHMuc2xpY2Uocyk7cmV0dXJuIG49dGhpcy5nZXRUYXNrUG9pbnRzKHUsbCkse3Rhc2tzOm4sZWZmZWN0czpjLGNvbnN1bWVJbmRleDpzfX1yZXR1cm57dGFza3M6bixjb25zdW1lSW5kZXg6c319Y29tcHV0UmFkaXVzKGUsdCl7cmV0dXJuIGUqLjAzKnQrdCouNX1nZXRNaW5aKGUsdCl7cmV0dXJuKCh0fHxNYXRoLm1heCgxLE1hdGguZmxvb3IoZSouMykpKS1lKi41KSoxMDAvZS8zfWdldFRhc2tQb2ludHMoZSx0KXt2YXIgdTtjb25zdCByPVtdO2lmKGUubGVuZ3RoPT09MClyZXR1cm5bXTtsZXQgaT0wLHM9ZVswXS54LG49ZVswXS55LGE9W3Msbl0sbD1bXSxjPWVbMF0udDtmb3IoO2k8ZS5sZW5ndGg7KXtjb25zdCBoPWVbaV0sZD1oLngtcyxmPWgueS1uLHc9aC56LHk9dD90aGlzLmNvbXB1dFJhZGl1cyh3LHQpOnc7aWYobC5wdXNoKHtwb2ludDpuZXcgUihkLGYsdyxlW2ldLnYpLHJhZGl1czp5fSksaT4wJiZpPGUubGVuZ3RoLTEpe2NvbnN0IGc9ZVtpXS5nZXRBbmdsZUJ5UG9pbnRzKGVbaS0xXSxlW2krMV0pO2lmKGc8OTB8fGc+MjcwKXtjb25zdCBQPSh1PWwucG9wKCkpPT1udWxsP3ZvaWQgMDp1LnBvaW50LmNsb25lKCk7UCYmci5wdXNoKHt0YXNrSWQ6Yyxwb3M6YSxwb2ludHM6Wy4uLmwse3BvaW50OlAscmFkaXVzOnl9XX0pLHM9ZVtpXS54LG49ZVtpXS55LGE9W3Msbl07Y29uc3Qgaz1oLngtcyxPPWgueS1uO2w9W3twb2ludDpuZXcgUihrLE8sdykscmFkaXVzOnl9XSxjPURhdGUubm93KCl9fWkrK31yZXR1cm4gci5wdXNoKHt0YXNrSWQ6Yyxwb3M6YSxwb2ludHM6bH0pLHJ9dXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZShlLHQscil7Y29uc3QgaT1EYXRlLm5vdygpLHM9dGhpcy50bXBQb2ludHMubGVuZ3RoO2xldCBuPXM7Zm9yKGxldCBsPTA7bDxlLmxlbmd0aDtsKz0yKXtuPU1hdGgubWluKG4scyk7Y29uc3QgYz10aGlzLnRtcFBvaW50cy5sZW5ndGgsdT1uZXcgUihlW2xdLGVbbCsxXSk7aWYoYz09PTApe3RoaXMudG1wUG9pbnRzLnB1c2godSk7Y29udGludWV9Y29uc3QgaD1jLTEsZD10aGlzLnRtcFBvaW50c1toXSxmPXAuU3ViKHUsZCkudW5pKCk7aWYodS5pc05lYXIoZCx0KSl7aWYoZC56PHRoaXMuTUFYX1JFUEVBUil7aWYoZC5zZXR6KE1hdGgubWluKGQueisxLHRoaXMuTUFYX1JFUEVBUikpLG49TWF0aC5taW4obixoKSxjPjEpe2xldCBnPWMtMTtmb3IoO2c+MDspe2NvbnN0IFA9dGhpcy50bXBQb2ludHNbZ10uZGlzdGFuY2UodGhpcy50bXBQb2ludHNbZy0xXSksaz1NYXRoLm1heCh0aGlzLnRtcFBvaW50c1tnXS56LXRoaXMudW5pVGhpY2tuZXNzKlAsMCk7aWYodGhpcy50bXBQb2ludHNbZy0xXS56Pj1rKWJyZWFrO3RoaXMudG1wUG9pbnRzW2ctMV0uc2V0eihrKSxuPU1hdGgubWluKG4sZy0xKSxnLS19fX1lbHNlIG49MS8wO2NvbnRpbnVlfXUuc2V0dihmKTtjb25zdCB3PXUuZGlzdGFuY2UoZCkseT1NYXRoLm1heChkLnotdGhpcy51bmlUaGlja25lc3MqdywwKTtjPjEmJnAuRXF1YWxzKGYsZC52LC4wMikmJih5PjB8fGQuejw9MCkmJihyJiZkLnQmJnIuYWRkKGQudCksdGhpcy50bXBQb2ludHMucG9wKCksbj1NYXRoLm1pbihoLG4pKSx1LnNldHooeSksdGhpcy50bXBQb2ludHMucHVzaCh1KX1pZihuPT09MS8wKXJldHVybiB0aGlzLnRtcFBvaW50cy5sZW5ndGg7bGV0IGE9cztpZihuPT09cyl7YT1NYXRoLm1heChhLTEsMCk7Y29uc3QgbD10aGlzLnRtcFBvaW50c1thXS50O2wmJihyPT1udWxsfHxyLmFkZChsKSl9ZWxzZXtsZXQgbD1zLTE7Zm9yKGE9bjtsPj0wOyl7Y29uc3QgYz10aGlzLnRtcFBvaW50c1tsXS50O2lmKGMmJihyPT1udWxsfHxyLmFkZChjKSxsPD1uKSl7YT1sLGw9LTE7YnJlYWt9bC0tfX1yZXR1cm4gdGhpcy50bXBQb2ludHNbYV0uc2V0VChpKSxhfXVwZGF0ZVRlbXBQb2ludHMoZSx0LHIpe3ZhciBsO2NvbnN0IGk9RGF0ZS5ub3coKSxzPXRoaXMudG1wUG9pbnRzLmxlbmd0aDtsZXQgbj1zO2ZvcihsZXQgYz0wO2M8ZS5sZW5ndGg7Yys9Mil7Y29uc3QgdT10aGlzLnRtcFBvaW50cy5sZW5ndGgsaD1uZXcgUihlW2NdLGVbYysxXSk7aWYodT09PTApe3RoaXMudG1wUG9pbnRzLnB1c2goaCk7Y29udGludWV9Y29uc3QgZD11LTEsZj10aGlzLnRtcFBvaW50c1tkXSx3PXAuU3ViKGgsZikudW5pKCk7aWYoaC5pc05lYXIoZix0LzIpKXtuPU1hdGgubWluKGQsbik7Y29udGludWV9cC5FcXVhbHModyxmLnYsLjAyKSYmKHImJmYudCYmci5hZGQoZi50KSx0aGlzLnRtcFBvaW50cy5wb3AoKSxuPU1hdGgubWluKGQsbikpLGguc2V0dih3KSx0aGlzLnRtcFBvaW50cy5wdXNoKGgpfWxldCBhPXM7aWYobj09PXMpe2E9TWF0aC5tYXgoYS0xLDApO2NvbnN0IGM9dGhpcy50bXBQb2ludHNbYV0udDtjJiYocj09bnVsbHx8ci5hZGQoYykpfWVsc2V7bGV0IGM9TWF0aC5taW4ocy0xLG4pO2ZvcihhPW47Yz49MDspe2NvbnN0IHU9KGw9dGhpcy50bXBQb2ludHNbY10pPT1udWxsP3ZvaWQgMDpsLnQ7aWYodSYmKHI9PW51bGx8fHIuYWRkKHUpLGM8PW4pKXthPWMsYz0tMTticmVha31jLS19fXJldHVybiB0aGlzLnRtcFBvaW50c1thXS5zZXRUKGkpLGF9dXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZVdoZW5Eb25lKGUpe2NvbnN0e3RoaWNrbmVzczp0fT10aGlzLndvcmtPcHRpb25zLHI9ZS5sZW5ndGgsaT10aGlzLmdldE1pbloodCk7Zm9yKGxldCBzPTA7czxyO3MrPTIpe2NvbnN0IG49dGhpcy50bXBQb2ludHMubGVuZ3RoLGE9bmV3IFIoZVtzXSxlW3MrMV0pO2lmKG49PT0wKXt0aGlzLnRtcFBvaW50cy5wdXNoKGEpO2NvbnRpbnVlfWNvbnN0IGw9bi0xLGM9dGhpcy50bXBQb2ludHNbbF0sdT1wLlN1YihhLGMpLnVuaSgpLGg9YS5kaXN0YW5jZShjKTtpZihuPjEmJmMuej09PWkpYnJlYWs7aWYoYS5pc05lYXIoYyx0LzIpKXtpZihyPDMmJmMuejx0aGlzLk1BWF9SRVBFQVImJihjLnNldHooTWF0aC5taW4oYy56KzEsdGhpcy5NQVhfUkVQRUFSKSksbj4xKSl7bGV0IGY9bi0xO2Zvcig7Zj4wOyl7Y29uc3Qgdz10aGlzLnRtcFBvaW50c1tmXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1tmLTFdKSx5PU1hdGgubWF4KHRoaXMudG1wUG9pbnRzW2ZdLnotdGhpcy51bmlUaGlja25lc3MqdywtdC80KTtpZih0aGlzLnRtcFBvaW50c1tmLTFdLno+PXkpYnJlYWs7dGhpcy50bXBQb2ludHNbZi0xXS5zZXR6KHkpLGYtLX19Y29udGludWV9YS5zZXR2KHUpO2NvbnN0IGQ9TWF0aC5tYXgoYy56LXRoaXMudW5pVGhpY2tuZXNzKmgsaSk7bj4xJiZwLkVxdWFscyh1LGMudiwuMDIpJiZjLno8PTAmJnRoaXMudG1wUG9pbnRzLnBvcCgpLGEuc2V0eihkKSx0aGlzLnRtcFBvaW50cy5wdXNoKGEpfX1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXt2YXIgYTtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnN9PXIsbj1pLmdldCh0Lm5hbWUpO3JldHVybiBzJiYodC50YWdOYW1lPT09IkdST1VQIj9IZSh0KT90LnNldEF0dHJpYnV0ZSgiYmdjb2xvciIscyk6dC5jaGlsZHJlbi5mb3JFYWNoKGw9PntsLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLGwuZ2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiKSYmbC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIscyl9KToodC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSx0LnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixzKSksKGE9bj09bnVsbD92b2lkIDA6bi5vcHQpIT1udWxsJiZhLnN0cm9rZUNvbG9yJiYobi5vcHQuc3Ryb2tlQ29sb3I9cykpLG4mJmkuc2V0SW5mbyh0Lm5hbWUsbikseC51cGRhdGVOb2RlT3B0KGUpfXN0YXRpYyBnZXRSZWN0RnJvbUxheWVyKGUsdCl7Y29uc3Qgcj1lLmdldEVsZW1lbnRzQnlOYW1lKHQpWzBdO2lmKHIpe2NvbnN0IGk9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGkueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoaS55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihpLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGkuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fX19Y2xhc3MgTnIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkxhc2VyUGVufSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEubm9uZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNJbmRleCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY29uc3VtZUluZGV4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MH1jb21iaW5lQ29uc3VtZSgpe31zZXRXb3JrT3B0aW9ucyhlKXtzdXBlci5zZXRXb3JrT3B0aW9ucyhlKSx0aGlzLnN5bmNUaW1lc3RhbXA9RGF0ZS5ub3coKX1jb25zdW1lKGUpe2NvbnN0e2RhdGE6dCxpc1N1YldvcmtlcjpyfT1lLHt3b3JrSWQ6aSxvcDpzfT10O2lmKChzPT1udWxsP3ZvaWQgMDpzLmxlbmd0aCk9PT0wKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy51cGRhdGVUZW1wUG9pbnRzKHN8fFtdKSx0aGlzLmNvbnN1bWVJbmRleD50aGlzLnRtcFBvaW50cy5sZW5ndGgtNClyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e3N0cm9rZUNvbG9yOm4sdGhpY2tuZXNzOmEsc3Ryb2tlVHlwZTpsfT10aGlzLndvcmtPcHRpb25zLGM9Ryh0aGlzLnRtcFBvaW50cyxhKTtsZXQgdT0hMTtjb25zdCBoPXRoaXMuc3luY0luZGV4LGQ9dGhpcy50bXBQb2ludHMuc2xpY2UodGhpcy5jb25zdW1lSW5kZXgpO3RoaXMuY29uc3VtZUluZGV4PXRoaXMudG1wUG9pbnRzLmxlbmd0aC0xLHRoaXMuc3luY1RpbWVzdGFtcD09PTAmJih0aGlzLnN5bmNUaW1lc3RhbXA9RGF0ZS5ub3coKSk7Y29uc3QgZj17bmFtZTppPT1udWxsP3ZvaWQgMDppLnRvU3RyaW5nKCksb3BhY2l0eToxLGxpbmVEYXNoOmw9PT1RLkRvdHRlZD9bMSxhKjJdOmw9PT1RLkxvbmdEb3R0ZWQ/W2EsYSoyXTp2b2lkIDAsc3Ryb2tlQ29sb3I6bixsaW5lQ2FwOiJyb3VuZCIsbGluZVdpZHRoOmEsYW5jaG9yOlsuNSwuNV19LHc9dGhpcy5nZXRUYXNrUG9pbnRzKGQpO2lmKHcubGVuZ3RoKXtjb25zdCBnPURhdGUubm93KCk7Zy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWUmJih1PSEwLHRoaXMuc3luY1RpbWVzdGFtcD1nLHRoaXMuc3luY0luZGV4PXRoaXMudG1wUG9pbnRzLmxlbmd0aCksciYmdGhpcy5kcmF3KHthdHRyczpmLHRhc2tzOncsaXNEb3Q6ITEsbGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyfSl9Y29uc3QgeT1bXTtyZXR1cm4gdGhpcy50bXBQb2ludHMuc2xpY2UoaCkuZm9yRWFjaChnPT57eS5wdXNoKGcueCxnLnkpfSkse3JlY3Q6e3g6Yy54KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLHk6Yy55KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdLHc6Yy53KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSxoOmMuaCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV19LHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDp1P2k6dm9pZCAwLG9wOnU/eTp2b2lkIDAsaW5kZXg6dT9oKjI6dm9pZCAwfX1jb25zdW1lQWxsKCl7dmFyIGk7Y29uc3QgZT0oaT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmkudG9TdHJpbmcoKTtsZXQgdDtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGgtMT50aGlzLmNvbnN1bWVJbmRleCl7bGV0IHM9dGhpcy50bXBQb2ludHMuc2xpY2UodGhpcy5jb25zdW1lSW5kZXgpO2NvbnN0IG49cy5sZW5ndGg9PT0xLHtzdHJva2VDb2xvcjphLHRoaWNrbmVzczpsLHN0cm9rZVR5cGU6Y309dGhpcy53b3JrT3B0aW9ucztpZihuKXtjb25zdCBkPXRoaXMuY29tcHV0RG90U3Ryb2tlKHtwb2ludDpzWzBdLHJhZGl1czpsLzJ9KTtzPWQucHMsdD1kLnJlY3R9ZWxzZSB0PUcodGhpcy50bXBQb2ludHMsbCk7Y29uc3QgdT17bmFtZTplPT1udWxsP3ZvaWQgMDplLnRvU3RyaW5nKCksZmlsbENvbG9yOm4/YTp2b2lkIDAsb3BhY2l0eToxLGxpbmVEYXNoOmM9PT1RLkRvdHRlZCYmIW4/WzEsbCoyXTpjPT09US5Mb25nRG90dGVkJiYhbj9bbCxsKjJdOnZvaWQgMCxzdHJva2VDb2xvcjphLGxpbmVDYXA6bj92b2lkIDA6InJvdW5kIixsaW5lV2lkdGg6bj8wOmwsYW5jaG9yOlsuNSwuNV19LGg9dGhpcy5nZXRUYXNrUG9pbnRzKHMpO2gubGVuZ3RoJiZ0aGlzLmRyYXcoe2F0dHJzOnUsdGFza3M6aCxpc0RvdDpuLGxheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcn0pfWNvbnN0IHI9W107cmV0dXJuIHRoaXMudG1wUG9pbnRzLnNsaWNlKHRoaXMuc3luY0luZGV4KS5mb3JFYWNoKHM9PntyLnB1c2gocy54LHMueSl9KSx7cmVjdDp0JiZ7eDp0LngqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0seTp0LnkqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMV0sdzp0LncqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdLGg6dC5oKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXX0sdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOmUsb3A6cixpbmRleDp0aGlzLnN5bmNJbmRleCoyfX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wLHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY0luZGV4PTB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIHc7Y29uc3R7b3A6dCxyZXBsYWNlSWQ6cixpc0Z1bGxXb3JrOml9PWUse3N0cm9rZUNvbG9yOnMsdGhpY2tuZXNzOm4sc3Ryb2tlVHlwZTphfT10aGlzLndvcmtPcHRpb25zO2lmKCF0Lmxlbmd0aCl7Y29uc3QgeT1HKHRoaXMudG1wUG9pbnRzLG4pO3JldHVybnt4OnkueCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblswXSx5OnkueSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXSx3Onkudyp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0saDp5LmgqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdfX1jb25zdCBsPU1hdGgubWF4KDAsdGhpcy50bXBQb2ludHMubGVuZ3RoLTEpO3RoaXMudXBkYXRlVGVtcFBvaW50cyh0fHxbXSk7bGV0IGMsdT10aGlzLnRtcFBvaW50cy5zbGljZShsKTtjb25zdCBoPXUubGVuZ3RoPT09MTtpZihoKXtjb25zdCB5PXRoaXMuY29tcHV0RG90U3Ryb2tlKHtwb2ludDp1WzBdLHJhZGl1czpuLzJ9KTt1PXkucHMsYz15LnJlY3R9ZWxzZSBjPUcodGhpcy50bXBQb2ludHMsbik7Y29uc3QgZD17bmFtZToodz10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOncudG9TdHJpbmcoKSxmaWxsQ29sb3I6aD9zOnZvaWQgMCxvcGFjaXR5OjEsbGluZURhc2g6YT09PVEuRG90dGVkJiYhaD9bMSxuKjJdOmE9PT1RLkxvbmdEb3R0ZWQmJiFoP1tuLG4qMl06dm9pZCAwLHN0cm9rZUNvbG9yOnMsbGluZUNhcDpoP3ZvaWQgMDoicm91bmQiLGxpbmVXaWR0aDpoPzA6bixhbmNob3I6Wy41LC41XX0sZj10aGlzLmdldFRhc2tQb2ludHModSk7aWYoZi5sZW5ndGgpe2NvbnN0IHk9aT90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7dGhpcy5kcmF3KHthdHRyczpkLHRhc2tzOmYsaXNEb3Q6aCxyZXBsYWNlSWQ6cixsYXllcjp5fSl9cmV0dXJue3g6Yy54KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLHk6Yy55KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdLHc6Yy53KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSxoOmMuaCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV19fWNvbXB1dERvdFN0cm9rZShlKXtjb25zdHtwb2ludDp0LHJhZGl1czpyfT1lLGk9e3g6dC54LXIseTp0Lnktcix3OnIqMixoOnIqMn07cmV0dXJue3BzOlIuR2V0RG90U3Ryb2tlKHQsciw4KSxyZWN0Oml9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD10aGlzLnRtcFBvaW50cy5sZW5ndGg7Zm9yKGxldCByPTA7cjxlLmxlbmd0aDtyKz0yKXtpZih0KXtjb25zdCBpPXRoaXMudG1wUG9pbnRzLnNsaWNlKC0xKVswXTtpJiZpLng9PT1lW3JdJiZpLnk9PT1lW3IrMV0mJnRoaXMudG1wUG9pbnRzLnBvcCgpfXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIoZVtyXSxlW3IrMV0pKX19YXN5bmMgZHJhdyhlKXtjb25zdHthdHRyczp0LHRhc2tzOnIsaXNEb3Q6aSxsYXllcjpzfT1lLHtkdXJhdGlvbjpufT10aGlzLndvcmtPcHRpb25zO2Zvcihjb25zdCBhIG9mIHIpe2NvbnN0IGw9bmV3IHouUGF0aCx7cG9zOmMscG9pbnRzOnV9PWE7bGV0IGg7aT9oPXhlKHUsITApOmg9eGUodSwhMSksbC5hdHRyKHsuLi50LHBvczpjLGQ6aH0pO2NvbnN0e3ZlcnRleDpkLGZyYWdtZW50OmZ9PXRoaXMud29ya09wdGlvbnM7aWYoZCYmZil7Y29uc3Qgdz1zLnJlbmRlcmVyLmNyZWF0ZVByb2dyYW0oe3ZlcnRleDpkLGZyYWdtZW50OmZ9KSx7d2lkdGg6eSxoZWlnaHQ6Z309cy5nZXRSZXNvbHV0aW9uKCk7bC5zZXRVbmlmb3Jtcyh7dV90aW1lOjAsdV9yZXNvbHV0aW9uOlt5LGddfSksbC5zZXRQcm9ncmFtKHcpfXMuYXBwZW5kQ2hpbGQobCksbC50cmFuc2l0aW9uKG4pLmF0dHIoe3NjYWxlOmk/Wy4xLC4xXTpbMSwxXSxsaW5lV2lkdGg6aT8wOjF9KS50aGVuKCgpPT57bC5yZW1vdmUoKX0pfX1nZXRUYXNrUG9pbnRzKGUpe3ZhciBsO2NvbnN0IHQ9W107aWYoZS5sZW5ndGg9PT0wKXJldHVybltdO2xldCByPTAsaT1lWzBdLngscz1lWzBdLnksbj1baSxzXSxhPVtdO2Zvcig7cjxlLmxlbmd0aDspe2NvbnN0IGM9ZVtyXSx1PWMueC1pLGg9Yy55LXM7aWYoYS5wdXNoKG5ldyBSKHUsaCkpLHI+MCYmcjxlLmxlbmd0aC0xKXtjb25zdCBkPWVbcl0uZ2V0QW5nbGVCeVBvaW50cyhlW3ItMV0sZVtyKzFdKTtpZihkPDkwfHxkPjI3MCl7Y29uc3QgZj0obD1hLnBvcCgpKT09bnVsbD92b2lkIDA6bC5jbG9uZSgpO2YmJnQucHVzaCh7cG9zOm4scG9pbnRzOlsuLi5hLGZdfSksaT1lW3JdLngscz1lW3JdLnksbj1baSxzXTtjb25zdCB3PWMueC1pLHk9Yy55LXM7YT1bbmV3IFIodyx5KV19fXIrK31yZXR1cm4gdC5wdXNoKHtwb3M6bixwb2ludHM6YX0pLHR9cmVtb3ZlTG9jYWwoKXt9cmVtb3ZlU2VydmljZShlKXtsZXQgdDtjb25zdCByPVtdO3JldHVybiB0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShlKS5mb3JFYWNoKGk9PntpZihpLm5hbWU9PT1lKXtjb25zdCBzPWkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7dD1BKHQse3g6cy54LHk6cy55LHc6cy53aWR0aCxoOnMuaGVpZ2h0fSksci5wdXNoKGkpfX0pLHIubGVuZ3RoJiZyLmZvckVhY2goaT0+aS5yZW1vdmUoKSksdH19dmFyIFFoPVplO1plLnBvbHlsaW5lPVplLFplLnBvbHlnb249Smg7ZnVuY3Rpb24gWmUobyxlLHQpe3ZhciByPW8ubGVuZ3RoLGk9T2Uob1swXSxlKSxzPVtdLG4sYSxsLGMsdTtmb3IodHx8KHQ9W10pLG49MTtuPHI7bisrKXtmb3IoYT1vW24tMV0sbD1vW25dLGM9dT1PZShsLGUpOzspaWYoaXxjKXtpZihpJmMpYnJlYWs7aT8oYT13dChhLGwsaSxlKSxpPU9lKGEsZSkpOihsPXd0KGEsbCxjLGUpLGM9T2UobCxlKSl9ZWxzZXtzLnB1c2goYSksYyE9PXU/KHMucHVzaChsKSxuPHItMSYmKHQucHVzaChzKSxzPVtdKSk6bj09PXItMSYmcy5wdXNoKGwpO2JyZWFrfWk9dX1yZXR1cm4gcy5sZW5ndGgmJnQucHVzaChzKSx0fWZ1bmN0aW9uIEpoKG8sZSl7dmFyIHQscixpLHMsbixhLGw7Zm9yKHI9MTtyPD04O3IqPTIpe2Zvcih0PVtdLGk9b1tvLmxlbmd0aC0xXSxzPSEoT2UoaSxlKSZyKSxuPTA7bjxvLmxlbmd0aDtuKyspYT1vW25dLGw9IShPZShhLGUpJnIpLGwhPT1zJiZ0LnB1c2god3QoaSxhLHIsZSkpLGwmJnQucHVzaChhKSxpPWEscz1sO2lmKG89dCwhby5sZW5ndGgpYnJlYWt9cmV0dXJuIHR9ZnVuY3Rpb24gd3QobyxlLHQscil7cmV0dXJuIHQmOD9bb1swXSsoZVswXS1vWzBdKSooclszXS1vWzFdKS8oZVsxXS1vWzFdKSxyWzNdXTp0JjQ/W29bMF0rKGVbMF0tb1swXSkqKHJbMV0tb1sxXSkvKGVbMV0tb1sxXSksclsxXV06dCYyP1tyWzJdLG9bMV0rKGVbMV0tb1sxXSkqKHJbMl0tb1swXSkvKGVbMF0tb1swXSldOnQmMT9bclswXSxvWzFdKyhlWzFdLW9bMV0pKihyWzBdLW9bMF0pLyhlWzBdLW9bMF0pXTpudWxsfWZ1bmN0aW9uIE9lKG8sZSl7dmFyIHQ9MDtyZXR1cm4gb1swXTxlWzBdP3R8PTE6b1swXT5lWzJdJiYodHw9Miksb1sxXTxlWzFdP3R8PTQ6b1sxXT5lWzNdJiYodHw9OCksdH12YXIgS2g9bWUoUWgpO2NsYXNzIG5lIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlLHQpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLm5vbmV9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5FcmFzZXJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VydmljZVdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ybGRQb3NpdGlvbiIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JsZFNjYWxpbmciLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZXJhc2VyUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlcmFzZXJQb2x5bGluZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMuc2VydmljZVdvcms9dCx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy53b3JsZFBvc2l0aW9uPXRoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb24sdGhpcy53b3JsZFNjYWxpbmc9dGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nfWNvbWJpbmVDb25zdW1lKCl7fWNvbnN1bWVTZXJ2aWNlKCl7fXNldFdvcmtPcHRpb25zKGUpe3N1cGVyLnNldFdvcmtPcHRpb25zKGUpfWNyZWF0ZUVyYXNlclJlY3QoZSl7Y29uc3QgdD1lWzBdKnRoaXMud29ybGRTY2FsaW5nWzBdK3RoaXMud29ybGRQb3NpdGlvblswXSxyPWVbMV0qdGhpcy53b3JsZFNjYWxpbmdbMV0rdGhpcy53b3JsZFBvc2l0aW9uWzFdLHt3aWR0aDppLGhlaWdodDpzfT1uZS5lcmFzZXJTaXplc1t0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc107dGhpcy5lcmFzZXJSZWN0PXt4OnQtaSouNSx5OnItcyouNSx3OmksaDpzfSx0aGlzLmVyYXNlclBvbHlsaW5lPVt0aGlzLmVyYXNlclJlY3QueCx0aGlzLmVyYXNlclJlY3QueSx0aGlzLmVyYXNlclJlY3QueCt0aGlzLmVyYXNlclJlY3Qudyx0aGlzLmVyYXNlclJlY3QueSt0aGlzLmVyYXNlclJlY3QuaF19Y29tcHV0UmVjdENlbnRlclBvaW50cygpe2NvbnN0IGU9dGhpcy50bXBQb2ludHMuc2xpY2UoLTIpO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTQpe2NvbnN0IHQ9bmV3IHAodGhpcy50bXBQb2ludHNbMF0sdGhpcy50bXBQb2ludHNbMV0pLHI9bmV3IHAodGhpcy50bXBQb2ludHNbMl0sdGhpcy50bXBQb2ludHNbM10pLGk9cC5TdWIocix0KS51bmkoKSxzPXAuRGlzdCh0LHIpLHt3aWR0aDpuLGhlaWdodDphfT1uZS5lcmFzZXJTaXplc1t0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc10sbD1NYXRoLm1pbihuLGEpLGM9TWF0aC5yb3VuZChzL2wpO2lmKGM+MSl7Y29uc3QgdT1bXTtmb3IobGV0IGg9MDtoPGM7aCsrKXtjb25zdCBkPXAuTXVsKGksaCpsKTt1LnB1c2godGhpcy50bXBQb2ludHNbMF0rZC54LHRoaXMudG1wUG9pbnRzWzFdK2QueSl9cmV0dXJuIHUuY29uY2F0KGUpfX1yZXR1cm4gZX1pc05lYXIoZSx0KXtjb25zdCByPW5ldyBwKGVbMF0sZVsxXSksaT1uZXcgcCh0WzBdLHRbMV0pLHt3aWR0aDpzLGhlaWdodDpufT1uZS5lcmFzZXJTaXplc1t0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzc107cmV0dXJuIHAuRGlzdChyLGkpPE1hdGguaHlwb3QocyxuKSouNX1jdXRQb2x5bGluZShlLHQpe2xldCByPVt0XSxpPTA7Zm9yKDtpPGUubGVuZ3RoOyl7Y29uc3QgYT1lW2ldO2lmKGEubGVuZ3RoPDIpYnJlYWs7cj1zKHIsYSksaSsrfXJldHVybiByO2Z1bmN0aW9uIHMoYSxsKXtjb25zdCBjPWE7Zm9yKGxldCB1PTA7dTxhLmxlbmd0aDt1Kyspe2NvbnN0IGg9YVt1XSxkPWguZmluZEluZGV4KChmLHcpPT53PGgubGVuZ3RoLTE/bihbZixoW3crMV1dLFtsWzBdLGxbMV1dKTohMSk7aWYoZCE9PS0xJiZkPi0xKXtjb25zdCBmPVtdLHc9aC5zbGljZSgwLGQrMSk7aWYocC5FcXVhbHMoaFtkXSxsWzBdKXx8dy5wdXNoKGxbMF0uY2xvbmUoKS5zZXR6KGhbZF0ueikpLHcubGVuZ3RoPjEmJmYucHVzaCh3KSxkK2wubGVuZ3RoLTE8aC5sZW5ndGgtMSl7Y29uc3QgeT1kK2wubGVuZ3RoLTEsZz1oLnNsaWNlKHkpLFA9bFtsLmxlbmd0aC0xXTtwLkVxdWFscyhoW3ldLFApfHxnLnVuc2hpZnQoUC5jbG9uZSgpLnNldHooaFt5XS56KSksZy5sZW5ndGg+MSYmZi5wdXNoKGcpfXJldHVybiBjLnNwbGljZSh1LDEsLi4uZiksY319cmV0dXJuIGN9ZnVuY3Rpb24gbihhLGwpe2NvbnN0IGM9cC5TdWIoYVsxXSxhWzBdKSx1PXAuU3ViKGxbMV0sbFswXSksaD1wLlN1YihsWzBdLGFbMF0pO3JldHVybiBNYXRoLmFicyhwLkNwcihjLHUpKTwuMSYmTWF0aC5hYnMocC5DcHIoYyxoKSk8LjF9fWlzU2FtZVBvaW50KGUsdCl7cmV0dXJuIGVbMF09PT10WzBdJiZlWzFdPT09dFsxXX10cmFuc2xhdGVJbnRlcnNlY3QoZSl7Y29uc3QgdD1bXTtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrKyl7Y29uc3QgaT1lW3JdLmZpbHRlcigoYSxsLGMpPT4hKGw+MCYmdGhpcy5pc1NhbWVQb2ludChhLGNbbC0xXSkpKSxzPVtdO2xldCBuPTA7Zm9yKDtuPGkubGVuZ3RoOyl7Y29uc3QgYT1pW25dLGw9bmV3IHAoYVswXSxhWzFdKTtzLnB1c2gobCksbisrfXQucHVzaChzKX1yZXR1cm4gdH1pc0xpbmVFcmFzZXIoZSx0KXtyZXR1cm4hKGU9PT1TLlBlbmNpbCYmIXQpfXJlbW92ZShlKXtjb25zdHtjdXJOb2RlTWFwOnQscmVtb3ZlSWRzOnIsbmV3V29ya0RhdGFzOml9PWUse2lzTGluZTpzfT10aGlzLndvcmtPcHRpb25zO2xldCBuO2Zvcihjb25zdFthLGxdb2YgdC5lbnRyaWVzKCkpaWYobC5yZWN0JiZ0aGlzLmVyYXNlclJlY3QmJnRoaXMuZXJhc2VyUG9seWxpbmUmJlBlKHRoaXMuZXJhc2VyUmVjdCxsLnJlY3QpKXtjb25zdHtvcDpjLHRvb2xzVHlwZTp1fT1sLGg9dGhpcy5pc0xpbmVFcmFzZXIodSxzKSxkPVtdLGY9W107Zm9yKGxldCB5PTA7eTxjLmxlbmd0aDt5Kz0zKXtjb25zdCBnPW5ldyBwKGNbeV0qdGhpcy53b3JsZFNjYWxpbmdbMF0rdGhpcy53b3JsZFBvc2l0aW9uWzBdLGNbeSsxXSp0aGlzLndvcmxkU2NhbGluZ1sxXSt0aGlzLndvcmxkUG9zaXRpb25bMV0sY1t5KzJdKTtmLnB1c2goZyksZC5wdXNoKG5ldyBSKGcueCxnLnkpKX1jb25zdCB3PWQubGVuZ3RoJiZHKGQpfHxsLnJlY3Q7aWYoUGUodyx0aGlzLmVyYXNlclJlY3QpKXtpZihmLmxlbmd0aD4xKXtjb25zdCB5PUtoLnBvbHlsaW5lKGYubWFwKGc9PmcuWFkpLHRoaXMuZXJhc2VyUG9seWxpbmUpO2lmKHkubGVuZ3RoJiYoci5hZGQobC5uYW1lKSwhaCkpe2NvbnN0IGc9dGhpcy50cmFuc2xhdGVJbnRlcnNlY3QoeSksUD10aGlzLmN1dFBvbHlsaW5lKGcsZik7Zm9yKGxldCBrPTA7azxQLmxlbmd0aDtrKyspe2NvbnN0IE89YCR7YX1fc18ke2t9YCxJPVtdO1Bba10uZm9yRWFjaChiPT57SS5wdXNoKChiLngtdGhpcy53b3JsZFBvc2l0aW9uWzBdKS90aGlzLndvcmxkU2NhbGluZ1swXSwoYi55LXRoaXMud29ybGRQb3NpdGlvblsxXSkvdGhpcy53b3JsZFNjYWxpbmdbMV0sYi56KX0pLGwub3B0JiZsLnRvb2xzVHlwZSYmdGhpcy52Tm9kZXMmJih0aGlzLnZOb2Rlcy5zZXRJbmZvKE8se3JlY3Q6dyxvcDpJLG9wdDpsLm9wdCxjYW5Sb3RhdGU6bC5jYW5Sb3RhdGUsc2NhbGVUeXBlOmwuc2NhbGVUeXBlLHRvb2xzVHlwZTpsLnRvb2xzVHlwZX0pLGkuc2V0KE8se3dvcmtJZDpPLG9wOkksb3B0Omwub3B0LHRvb2xzVHlwZTpsLnRvb2xzVHlwZX0pKX19fWVsc2Ugci5hZGQobC5uYW1lKTtuPUEobix3KX19cmV0dXJuIHIuZm9yRWFjaChhPT57dmFyIGw7cmV0dXJuKGw9dGhpcy52Tm9kZXMpPT1udWxsP3ZvaWQgMDpsLmRlbGV0ZShhKX0pLG4mJihuLngtPXguU2FmZUJvcmRlclBhZGRpbmcsbi55LT14LlNhZmVCb3JkZXJQYWRkaW5nLG4udys9eC5TYWZlQm9yZGVyUGFkZGluZyoyLG4uaCs9eC5TYWZlQm9yZGVyUGFkZGluZyoyKSxufWNvbnN1bWUoZSl7Y29uc3R7b3A6dH09ZS5kYXRhO2lmKCF0fHx0Lmxlbmd0aD09PTApcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdCByPXRoaXMudG1wUG9pbnRzLmxlbmd0aDtpZihyPjEmJnRoaXMuaXNOZWFyKFt0WzBdLHRbMV1dLFt0aGlzLnRtcFBvaW50c1tyLTJdLHRoaXMudG1wUG9pbnRzW3ItMV1dKSlyZXR1cm57dHlwZTptLk5vbmV9O3I9PT00JiYodGhpcy50bXBQb2ludHMuc2hpZnQoKSx0aGlzLnRtcFBvaW50cy5zaGlmdCgpKSx0aGlzLnRtcFBvaW50cy5wdXNoKHRbMF0sdFsxXSk7Y29uc3QgaT10aGlzLmNvbXB1dFJlY3RDZW50ZXJQb2ludHMoKTtsZXQgcztjb25zdCBuPW5ldyBTZXQsYT1uZXcgTWFwO3RoaXMudk5vZGVzLnNldFRhcmdldCgpO2NvbnN0IGw9dGhpcy5nZXRVbkxvY2tOb2RlTWFwKHRoaXMudk5vZGVzLmdldExhc3RUYXJnZXQoKSk7Zm9yKGxldCBjPTA7YzxpLmxlbmd0aC0xO2MrPTIpe3RoaXMuY3JlYXRlRXJhc2VyUmVjdChpLnNsaWNlKGMsYysyKSk7Y29uc3QgdT10aGlzLnJlbW92ZSh7Y3VyTm9kZU1hcDpsLHJlbW92ZUlkczpuLG5ld1dvcmtEYXRhczphfSk7cz1BKHMsdSl9aWYodGhpcy52Tm9kZXMuZGVsZXRlTGFzdFRhcmdldCgpLHMmJm4uc2l6ZSl7Zm9yKGNvbnN0IGMgb2YgYS5rZXlzKCkpbi5oYXMoYykmJmEuZGVsZXRlKGMpO3JldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6cyxyZW1vdmVJZHM6Wy4uLm5dLG5ld1dvcmtEYXRhczphfX1yZXR1cm57dHlwZTptLk5vbmV9fWNvbnN1bWVBbGwoZSl7cmV0dXJuIHRoaXMuY29uc3VtZShlKX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfWdldFVuTG9ja05vZGVNYXAoZSl7dmFyIHQ7aWYodGhpcy5zZXJ2aWNlV29yayl7Y29uc3Qgcj1yZShlKSxpPXRoaXMuc2VydmljZVdvcmsuc2VsZWN0b3JXb3JrU2hhcGVzLHM9dGhpcy5zZXJ2aWNlV29yay53b3JrU2hhcGVzO2Zvcihjb25zdCBuIG9mIGkudmFsdWVzKCkpaWYoKHQ9bi5zZWxlY3RJZHMpIT1udWxsJiZ0Lmxlbmd0aClmb3IoY29uc3QgYSBvZiBuLnNlbGVjdElkcylyLmRlbGV0ZShhKTtmb3IoY29uc3QgbiBvZiBzLmtleXMoKSlyLmRlbGV0ZShuKTtyZXR1cm4gcn1yZXR1cm4gZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KG5lLCJlcmFzZXJTaXplcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOk9iamVjdC5mcmVlemUoW09iamVjdC5mcmVlemUoe3dpZHRoOjE4LGhlaWdodDoyNn0pLE9iamVjdC5mcmVlemUoe3dpZHRoOjI2LGhlaWdodDozNH0pLE9iamVjdC5mcmVlemUoe3dpZHRoOjM0LGhlaWdodDo1MH0pXSl9KTtjb25zdCBWaD0iKysiLGVkPSJzZWxlY3RvciIsdGQ9ImFsbCI7dmFyIHJkPSJfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fIjtmdW5jdGlvbiBvZChvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5zZXQobyxyZCksdGhpc312YXIgc2Q9b2Q7ZnVuY3Rpb24gaWQobyl7cmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKG8pfXZhciBuZD1pZCxhZD1XdCxsZD1zZCxjZD1uZDtmdW5jdGlvbiBRZShvKXt2YXIgZT0tMSx0PW89PW51bGw/MDpvLmxlbmd0aDtmb3IodGhpcy5fX2RhdGFfXz1uZXcgYWQ7KytlPHQ7KXRoaXMuYWRkKG9bZV0pfVFlLnByb3RvdHlwZS5hZGQ9UWUucHJvdG90eXBlLnB1c2g9bGQsUWUucHJvdG90eXBlLmhhcz1jZDt2YXIgdWQ9UWU7ZnVuY3Rpb24gaGQobyxlKXtmb3IodmFyIHQ9LTEscj1vPT1udWxsPzA6by5sZW5ndGg7Kyt0PHI7KWlmKGUob1t0XSx0LG8pKXJldHVybiEwO3JldHVybiExfXZhciBkZD1oZDtmdW5jdGlvbiBmZChvLGUpe3JldHVybiBvLmhhcyhlKX12YXIgcGQ9ZmQseWQ9dWQsd2Q9ZGQsbWQ9cGQsZ2Q9MSxiZD0yO2Z1bmN0aW9uIHZkKG8sZSx0LHIsaSxzKXt2YXIgbj10JmdkLGE9by5sZW5ndGgsbD1lLmxlbmd0aDtpZihhIT1sJiYhKG4mJmw+YSkpcmV0dXJuITE7dmFyIGM9cy5nZXQobyksdT1zLmdldChlKTtpZihjJiZ1KXJldHVybiBjPT1lJiZ1PT1vO3ZhciBoPS0xLGQ9ITAsZj10JmJkP25ldyB5ZDp2b2lkIDA7Zm9yKHMuc2V0KG8sZSkscy5zZXQoZSxvKTsrK2g8YTspe3ZhciB3PW9baF0seT1lW2hdO2lmKHIpdmFyIGc9bj9yKHksdyxoLGUsbyxzKTpyKHcseSxoLG8sZSxzKTtpZihnIT09dm9pZCAwKXtpZihnKWNvbnRpbnVlO2Q9ITE7YnJlYWt9aWYoZil7aWYoIXdkKGUsZnVuY3Rpb24oUCxrKXtpZighbWQoZixrKSYmKHc9PT1QfHxpKHcsUCx0LHIscykpKXJldHVybiBmLnB1c2goayl9KSl7ZD0hMTticmVha319ZWxzZSBpZighKHc9PT15fHxpKHcseSx0LHIscykpKXtkPSExO2JyZWFrfX1yZXR1cm4gcy5kZWxldGUobykscy5kZWxldGUoZSksZH12YXIgV3I9dmQ7ZnVuY3Rpb24gU2Qobyl7dmFyIGU9LTEsdD1BcnJheShvLnNpemUpO3JldHVybiBvLmZvckVhY2goZnVuY3Rpb24ocixpKXt0WysrZV09W2kscl19KSx0fXZhciBrZD1TZDtmdW5jdGlvbiBQZChvKXt2YXIgZT0tMSx0PUFycmF5KG8uc2l6ZSk7cmV0dXJuIG8uZm9yRWFjaChmdW5jdGlvbihyKXt0WysrZV09cn0pLHR9dmFyIFRkPVBkLFJyPURlLE1yPXNyLElkPVZlLHhkPVdyLE9kPWtkLExkPVRkLENkPTEsTmQ9MixXZD0iW29iamVjdCBCb29sZWFuXSIsUmQ9IltvYmplY3QgRGF0ZV0iLE1kPSJbb2JqZWN0IEVycm9yXSIsQWQ9IltvYmplY3QgTWFwXSIsJGQ9IltvYmplY3QgTnVtYmVyXSIsRGQ9IltvYmplY3QgUmVnRXhwXSIsamQ9IltvYmplY3QgU2V0XSIsRmQ9IltvYmplY3QgU3RyaW5nXSIsQmQ9IltvYmplY3QgU3ltYm9sXSIsX2Q9IltvYmplY3QgQXJyYXlCdWZmZXJdIixFZD0iW29iamVjdCBEYXRhVmlld10iLEFyPVJyP1JyLnByb3RvdHlwZTp2b2lkIDAsbXQ9QXI/QXIudmFsdWVPZjp2b2lkIDA7ZnVuY3Rpb24gemQobyxlLHQscixpLHMsbil7c3dpdGNoKHQpe2Nhc2UgRWQ6aWYoby5ieXRlTGVuZ3RoIT1lLmJ5dGVMZW5ndGh8fG8uYnl0ZU9mZnNldCE9ZS5ieXRlT2Zmc2V0KXJldHVybiExO289by5idWZmZXIsZT1lLmJ1ZmZlcjtjYXNlIF9kOnJldHVybiEoby5ieXRlTGVuZ3RoIT1lLmJ5dGVMZW5ndGh8fCFzKG5ldyBNcihvKSxuZXcgTXIoZSkpKTtjYXNlIFdkOmNhc2UgUmQ6Y2FzZSAkZDpyZXR1cm4gSWQoK28sK2UpO2Nhc2UgTWQ6cmV0dXJuIG8ubmFtZT09ZS5uYW1lJiZvLm1lc3NhZ2U9PWUubWVzc2FnZTtjYXNlIERkOmNhc2UgRmQ6cmV0dXJuIG89PWUrIiI7Y2FzZSBBZDp2YXIgYT1PZDtjYXNlIGpkOnZhciBsPXImQ2Q7aWYoYXx8KGE9TGQpLG8uc2l6ZSE9ZS5zaXplJiYhbClyZXR1cm4hMTt2YXIgYz1uLmdldChvKTtpZihjKXJldHVybiBjPT1lO3J8PU5kLG4uc2V0KG8sZSk7dmFyIHU9eGQoYShvKSxhKGUpLHIsaSxzLG4pO3JldHVybiBuLmRlbGV0ZShvKSx1O2Nhc2UgQmQ6aWYobXQpcmV0dXJuIG10LmNhbGwobyk9PW10LmNhbGwoZSl9cmV0dXJuITF9dmFyIFVkPXpkLCRyPUp0LEdkPTEsWGQ9T2JqZWN0LnByb3RvdHlwZSxIZD1YZC5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBZZChvLGUsdCxyLGkscyl7dmFyIG49dCZHZCxhPSRyKG8pLGw9YS5sZW5ndGgsYz0kcihlKSx1PWMubGVuZ3RoO2lmKGwhPXUmJiFuKXJldHVybiExO2Zvcih2YXIgaD1sO2gtLTspe3ZhciBkPWFbaF07aWYoIShuP2QgaW4gZTpIZC5jYWxsKGUsZCkpKXJldHVybiExfXZhciBmPXMuZ2V0KG8pLHc9cy5nZXQoZSk7aWYoZiYmdylyZXR1cm4gZj09ZSYmdz09bzt2YXIgeT0hMDtzLnNldChvLGUpLHMuc2V0KGUsbyk7Zm9yKHZhciBnPW47KytoPGw7KXtkPWFbaF07dmFyIFA9b1tkXSxrPWVbZF07aWYocil2YXIgTz1uP3IoayxQLGQsZSxvLHMpOnIoUCxrLGQsbyxlLHMpO2lmKCEoTz09PXZvaWQgMD9QPT09a3x8aShQLGssdCxyLHMpOk8pKXt5PSExO2JyZWFrfWd8fChnPWQ9PSJjb25zdHJ1Y3RvciIpfWlmKHkmJiFnKXt2YXIgST1vLmNvbnN0cnVjdG9yLGI9ZS5jb25zdHJ1Y3RvcjtJIT1iJiYiY29uc3RydWN0b3IiaW4gbyYmImNvbnN0cnVjdG9yImluIGUmJiEodHlwZW9mIEk9PSJmdW5jdGlvbiImJkkgaW5zdGFuY2VvZiBJJiZ0eXBlb2YgYj09ImZ1bmN0aW9uIiYmYiBpbnN0YW5jZW9mIGIpJiYoeT0hMSl9cmV0dXJuIHMuZGVsZXRlKG8pLHMuZGVsZXRlKGUpLHl9dmFyIHFkPVlkLGd0PVJ0LFpkPVdyLFFkPVVkLEpkPXFkLERyPUdlLGpyPV9lLEZyPXJ0LEtkPUV0LFZkPTEsQnI9IltvYmplY3QgQXJndW1lbnRzXSIsX3I9IltvYmplY3QgQXJyYXldIixKZT0iW29iamVjdCBPYmplY3RdIixlZj1PYmplY3QucHJvdG90eXBlLEVyPWVmLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIHRmKG8sZSx0LHIsaSxzKXt2YXIgbj1qcihvKSxhPWpyKGUpLGw9bj9fcjpEcihvKSxjPWE/X3I6RHIoZSk7bD1sPT1Ccj9KZTpsLGM9Yz09QnI/SmU6Yzt2YXIgdT1sPT1KZSxoPWM9PUplLGQ9bD09YztpZihkJiZGcihvKSl7aWYoIUZyKGUpKXJldHVybiExO249ITAsdT0hMX1pZihkJiYhdSlyZXR1cm4gc3x8KHM9bmV3IGd0KSxufHxLZChvKT9aZChvLGUsdCxyLGkscyk6UWQobyxlLGwsdCxyLGkscyk7aWYoISh0JlZkKSl7dmFyIGY9dSYmRXIuY2FsbChvLCJfX3dyYXBwZWRfXyIpLHc9aCYmRXIuY2FsbChlLCJfX3dyYXBwZWRfXyIpO2lmKGZ8fHcpe3ZhciB5PWY/by52YWx1ZSgpOm8sZz13P2UudmFsdWUoKTplO3JldHVybiBzfHwocz1uZXcgZ3QpLGkoeSxnLHQscixzKX19cmV0dXJuIGQ/KHN8fChzPW5ldyBndCksSmQobyxlLHQscixpLHMpKTohMX12YXIgcmY9dGYsb2Y9cmYsenI9Y2U7ZnVuY3Rpb24gVXIobyxlLHQscixpKXtyZXR1cm4gbz09PWU/ITA6bz09bnVsbHx8ZT09bnVsbHx8IXpyKG8pJiYhenIoZSk/byE9PW8mJmUhPT1lOm9mKG8sZSx0LHIsVXIsaSl9dmFyIHNmPVVyLG5mPXNmO2Z1bmN0aW9uIGFmKG8sZSl7cmV0dXJuIG5mKG8sZSl9dmFyIGxmPWFmLEdyPW1lKGxmKTtjbGFzcyBFIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5TZWxlY3Rvcn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZWxlY3RJZHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VsZWN0b3JDb2xvciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzdHJva2VDb2xvciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJmaWxsQ29sb3IiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkU2VsZWN0UmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5UZXh0RWRpdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhbkxvY2siLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNoYXBlT3B0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRleHRPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiaXNMb2NrZWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHR9Y29tcHV0U2VsZWN0b3IoZT0hMCl7Y29uc3QgdD1HKHRoaXMudG1wUG9pbnRzKTtpZih0Lnc9PT0wfHx0Lmg9PT0wKXJldHVybntzZWxlY3RJZHM6W10saW50ZXJzZWN0UmVjdDp2b2lkIDAsc3ViTm9kZU1hcDpuZXcgTWFwfTtjb25zdHtyZWN0UmFuZ2U6cixub2RlUmFuZ2U6aX09dGhpcy52Tm9kZXMuZ2V0UmVjdEludGVyc2VjdFJhbmdlKHQsZSk7cmV0dXJue3NlbGVjdElkczpbLi4uaS5rZXlzKCldLGludGVyc2VjdFJlY3Q6cixzdWJOb2RlTWFwOml9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD10aGlzLnRtcFBvaW50cy5sZW5ndGgscj1lLmxlbmd0aDtpZihyPjEpe2NvbnN0IGk9bmV3IFIoZVtyLTJdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLGVbci0xXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXSk7dD09PTI/dGhpcy50bXBQb2ludHMuc3BsaWNlKDEsMSxpKTp0aGlzLnRtcFBvaW50cy5wdXNoKGkpfX1kcmF3U2VsZWN0b3IoZSl7Y29uc3R7ZHJhd1JlY3Q6dCxzdWJOb2RlTWFwOnIsc2VsZWN0b3JJZDppLGxheWVyOnMsaXNTZXJ2aWNlOm59PWUsYT1uZXcgei5Hcm91cCh7cG9zOlt0LngsdC55XSxhbmNob3I6WzAsMF0sc2l6ZTpbdC53LHQuaF0saWQ6aSxuYW1lOmksekluZGV4OjFlM30pLGw9W107aWYobil7Y29uc3QgYz1uZXcgei5SZWN0KHtub3JtYWxpemU6ITAscG9zOlt0LncvMix0LmgvMl0sbGluZVdpZHRoOjEsc3Ryb2tlQ29sb3I6dGhpcy5zZWxlY3RvckNvbG9yfHx0aGlzLndvcmtPcHRpb25zLnN0cm9rZUNvbG9yLHdpZHRoOnQudyxoZWlnaHQ6dC5oLG5hbWU6RS5zZWxlY3RvckJvcmRlcklkfSk7bC5wdXNoKGMpfXIuZm9yRWFjaCgoYyx1KT0+e2NvbnN0IGg9W2MucmVjdC54K2MucmVjdC53LzItdC54LGMucmVjdC55K2MucmVjdC5oLzItdC55XSxkPW5ldyB6LlJlY3Qoe25vcm1hbGl6ZTohMCxwb3M6aCxsaW5lV2lkdGg6MSxzdHJva2VDb2xvcjpyLnNpemU+MT90aGlzLnNlbGVjdG9yQ29sb3J8fHRoaXMud29ya09wdGlvbnMuc3Ryb2tlQ29sb3I6dm9pZCAwLHdpZHRoOmMucmVjdC53LGhlaWdodDpjLnJlY3QuaCxpZDpgc2VsZWN0b3ItJHt1fWAsbmFtZTpgc2VsZWN0b3ItJHt1fWB9KTtsLnB1c2goZCl9KSxsJiZhLmFwcGVuZCguLi5sKSwocz09bnVsbD92b2lkIDA6cy5wYXJlbnQpLmFwcGVuZENoaWxkKGEpfWRyYXcoZSx0LHIsaT0hMSl7dmFyIGEsbDtjb25zdHtpbnRlcnNlY3RSZWN0OnMsc3ViTm9kZU1hcDpufT1yOyhsPShhPXQucGFyZW50KT09bnVsbD92b2lkIDA6YS5nZXRFbGVtZW50QnlJZChlKSk9PW51bGx8fGwucmVtb3ZlKCkscyYmdGhpcy5kcmF3U2VsZWN0b3Ioe2RyYXdSZWN0OnMsc3ViTm9kZU1hcDpuLHNlbGVjdG9ySWQ6ZSxsYXllcjp0LGlzU2VydmljZTppfSl9Z2V0U2VsZWN0ZW9ySW5mbyhlKXt0aGlzLnNjYWxlVHlwZT1xLmFsbCx0aGlzLmNhblJvdGF0ZT0hMSx0aGlzLnRleHRPcHQ9dm9pZCAwLHRoaXMuc3Ryb2tlQ29sb3I9dm9pZCAwLHRoaXMuZmlsbENvbG9yPXZvaWQgMCx0aGlzLmNhblRleHRFZGl0PSExLHRoaXMuY2FuTG9jaz0hMSx0aGlzLmlzTG9ja2VkPSExLHRoaXMudG9vbHNUeXBlcz12b2lkIDAsdGhpcy5zaGFwZU9wdD12b2lkIDA7Y29uc3QgdD1uZXcgU2V0O2xldCByO2Zvcihjb25zdCBpIG9mIGUudmFsdWVzKCkpe2NvbnN0e29wdDpzLGNhblJvdGF0ZTpuLHNjYWxlVHlwZTphLHRvb2xzVHlwZTpsfT1pO3RoaXMuc2VsZWN0b3JDb2xvcj10aGlzLndvcmtPcHRpb25zLnN0cm9rZUNvbG9yLHMuc3Ryb2tlQ29sb3ImJih0aGlzLnN0cm9rZUNvbG9yPXMuc3Ryb2tlQ29sb3IpLHMuZmlsbENvbG9yJiYodGhpcy5maWxsQ29sb3I9cy5maWxsQ29sb3IpLHMudGV4dE9wdCYmKHRoaXMudGV4dE9wdD1zLnRleHRPcHQpLGw9PT1TLlNwZWVjaEJhbGxvb24mJih0LmFkZChsKSx0aGlzLnNoYXBlT3B0fHwodGhpcy5zaGFwZU9wdD17fSksdGhpcy5zaGFwZU9wdC5wbGFjZW1lbnQ9cy5wbGFjZW1lbnQpLGw9PT1TLlBvbHlnb24mJih0LmFkZChsKSx0aGlzLnNoYXBlT3B0fHwodGhpcy5zaGFwZU9wdD17fSksdGhpcy5zaGFwZU9wdC52ZXJ0aWNlcz1zLnZlcnRpY2VzKSxsPT09Uy5TdGFyJiYodC5hZGQobCksdGhpcy5zaGFwZU9wdHx8KHRoaXMuc2hhcGVPcHQ9e30pLHRoaXMuc2hhcGVPcHQudmVydGljZXM9cy52ZXJ0aWNlcyx0aGlzLnNoYXBlT3B0LmlubmVyUmF0aW89cy5pbm5lclJhdGlvLHRoaXMuc2hhcGVPcHQuaW5uZXJWZXJ0aWNlU3RlcD1zLmlubmVyVmVydGljZVN0ZXApLGw9PT1TLlRleHQmJih0aGlzLnRleHRPcHQ9cyksZS5zaXplPT09MSYmKHRoaXMudGV4dE9wdCYmKHRoaXMuY2FuVGV4dEVkaXQ9ITApLHRoaXMuY2FuUm90YXRlPW4sdGhpcy5zY2FsZVR5cGU9YSksYT09PXEubm9uZSYmKHRoaXMuc2NhbGVUeXBlPWEpLGw9PT1TLkltYWdlJiYocj1pKX10LnNpemUmJih0aGlzLnRvb2xzVHlwZXM9Wy4uLnRdKSxyJiYoZS5zaXplPT09MT8odGhpcy5jYW5Mb2NrPSEwLHIub3B0LmxvY2tlZCYmKHRoaXMuaXNMb2NrZWQ9ITAsdGhpcy5zY2FsZVR5cGU9cS5ub25lLHRoaXMuY2FuUm90YXRlPSExLHRoaXMudGV4dE9wdD12b2lkIDAsdGhpcy5maWxsQ29sb3I9dm9pZCAwLHRoaXMuc2VsZWN0b3JDb2xvcj0icmdiKDE3NywxNzcsMTc3KSIsdGhpcy5zdHJva2VDb2xvcj12b2lkIDAsdGhpcy5jYW5UZXh0RWRpdD0hMSkpOmUuc2l6ZT4xJiYhci5vcHQubG9ja2VkJiYodGhpcy5jYW5Mb2NrPSExLHRoaXMuY2FuUm90YXRlPSExKSl9Z2V0Q2hpbGRyZW5Qb2ludHMoKXt2YXIgZTtpZih0aGlzLnNjYWxlVHlwZT09PXEuYm90aCYmdGhpcy5zZWxlY3RJZHMpe2NvbnN0IHQ9dGhpcy5zZWxlY3RJZHNbMF0scj0oZT10aGlzLnZOb2Rlcy5nZXQodCkpPT1udWxsP3ZvaWQgMDplLm9wO2lmKHIpe2NvbnN0IGk9W107Zm9yKGxldCBzPTA7czxyLmxlbmd0aDtzKz0zKWkucHVzaChbcltzXSxyW3MrMV1dKTtyZXR1cm4gaX19fWNvbnN1bWUoZSl7Y29uc3R7b3A6dCx3b3JrU3RhdGU6cn09ZS5kYXRhO2xldCBpPXRoaXMub2xkU2VsZWN0UmVjdDtpZihyPT09Ri5TdGFydCYmKGk9dGhpcy5iYWNrVG9GdWxsTGF5ZXIoKSksISh0IT1udWxsJiZ0Lmxlbmd0aCl8fCF0aGlzLnZOb2Rlcy5jdXJOb2RlTWFwLnNpemUpcmV0dXJue3R5cGU6bS5Ob25lfTt0aGlzLnVwZGF0ZVRlbXBQb2ludHModCk7Y29uc3Qgcz10aGlzLmNvbXB1dFNlbGVjdG9yKCk7aWYodGhpcy5zZWxlY3RJZHMmJkVoKHRoaXMuc2VsZWN0SWRzLHMuc2VsZWN0SWRzKSlyZXR1cm57dHlwZTptLk5vbmV9O3RoaXMuc2VsZWN0SWRzPXMuc2VsZWN0SWRzO2NvbnN0IG49cy5pbnRlcnNlY3RSZWN0O3RoaXMuZ2V0U2VsZWN0ZW9ySW5mbyhzLnN1Yk5vZGVNYXApLHRoaXMuZHJhdyhFLnNlbGVjdG9ySWQsdGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLHMpLHRoaXMub2xkU2VsZWN0UmVjdD1uO2NvbnN0IGE9dGhpcy5nZXRDaGlsZHJlblBvaW50cygpO3JldHVybnt0eXBlOm0uU2VsZWN0LGRhdGFUeXBlOlcuTG9jYWwscmVjdDpBKG4saSksc2VsZWN0SWRzOnMuc2VsZWN0SWRzLG9wdDp0aGlzLndvcmtPcHRpb25zLHNlbGVjdFJlY3Q6bixzZWxlY3RvckNvbG9yOnRoaXMuc2VsZWN0b3JDb2xvcixzdHJva2VDb2xvcjp0aGlzLnN0cm9rZUNvbG9yLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcix0ZXh0T3B0OnRoaXMudGV4dE9wdCxjYW5UZXh0RWRpdDp0aGlzLmNhblRleHRFZGl0LGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjYW5Mb2NrOnRoaXMuY2FuTG9jayxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsd2lsbFN5bmNTZXJ2aWNlOiEwLHBvaW50czphLGlzTG9ja2VkOnRoaXMuaXNMb2NrZWQsdG9vbHNUeXBlczp0aGlzLnRvb2xzVHlwZXMsc2hhcGVPcHQ6dGhpcy5zaGFwZU9wdH19Y29uc3VtZUFsbChlKXt2YXIgdCxyO2lmKCEoKHQ9dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZ0Lmxlbmd0aCkmJnRoaXMudG1wUG9pbnRzWzBdJiZ0aGlzLnNlbGVjdFNpbmdsZVRvb2wodGhpcy50bXBQb2ludHNbMF0uWFksRS5zZWxlY3RvcklkLCExLGU9PW51bGw/dm9pZCAwOmUuaG92ZXJJZCksKHI9dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZyLmxlbmd0aCYmdGhpcy5zZWFsVG9EcmF3TGF5ZXIodGhpcy5zZWxlY3RJZHMpLHRoaXMub2xkU2VsZWN0UmVjdCl7Y29uc3QgaT10aGlzLmdldENoaWxkcmVuUG9pbnRzKCk7cmV0dXJue3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OnRoaXMub2xkU2VsZWN0UmVjdCxzZWxlY3RJZHM6dGhpcy5zZWxlY3RJZHMsb3B0OnRoaXMud29ya09wdGlvbnMsc2VsZWN0b3JDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3Isc2VsZWN0UmVjdDp0aGlzLm9sZFNlbGVjdFJlY3Qsc3Ryb2tlQ29sb3I6dGhpcy5zdHJva2VDb2xvcixmaWxsQ29sb3I6dGhpcy5maWxsQ29sb3IsdGV4dE9wdDp0aGlzLnRleHRPcHQsY2FuVGV4dEVkaXQ6dGhpcy5jYW5UZXh0RWRpdCxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2FuTG9jazp0aGlzLmNhbkxvY2ssc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLHdpbGxTeW5jU2VydmljZTohMCxwb2ludHM6aSxpc0xvY2tlZDp0aGlzLmlzTG9ja2VkLHRvb2xzVHlwZXM6dGhpcy50b29sc1R5cGVzLHNoYXBlT3B0OnRoaXMuc2hhcGVPcHR9fXJldHVybnt0eXBlOm0uTm9uZX19Y29uc3VtZVNlcnZpY2UoKXt9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1jbGVhclNlbGVjdERhdGEoKXt0aGlzLnNlbGVjdElkcz12b2lkIDAsdGhpcy5vbGRTZWxlY3RSZWN0PXZvaWQgMH1zZWxlY3RTaW5nbGVUb29sKGUsdD1FLnNlbGVjdG9ySWQscj0hMSxpKXtpZihlLmxlbmd0aD09PTIpe2NvbnN0IHM9ZVswXSxuPWVbMV07bGV0IGE7Zm9yKGNvbnN0IGwgb2YgdGhpcy5mdWxsTGF5ZXIuY2hpbGRyZW4pe2NvbnN0IGM9ZW8oW2xdKTtsZXQgdT0hMTtpZigoaSYmaT09PWwubmFtZXx8ITEpJiZjLmZpbmQoZD0+ZC5pc1BvaW50Q29sbGlzaW9uKHMsbikpKXthPWw7YnJlYWt9Zm9yKGNvbnN0IGQgb2YgYylpZih1PWQuaXNQb2ludENvbGxpc2lvbihzLG4pLHUpe2lmKCFhKWE9bDtlbHNle2NvbnN0IGY9dGhpcy52Tm9kZXMuZ2V0KGwubmFtZSksdz10aGlzLnZOb2Rlcy5nZXQoYS5uYW1lKTtpZigoZj09bnVsbD92b2lkIDA6Zi50b29sc1R5cGUpIT09Uy5UZXh0JiYodz09bnVsbD92b2lkIDA6dy50b29sc1R5cGUpPT09Uy5UZXh0KWJyZWFrO2lmKChmPT1udWxsP3ZvaWQgMDpmLnRvb2xzVHlwZSk9PT1TLlRleHQmJih3PT1udWxsP3ZvaWQgMDp3LnRvb2xzVHlwZSkhPT1TLlRleHQpYT1sO2Vsc2V7Y29uc3QgeT0oZj09bnVsbD92b2lkIDA6Zi5vcHQuekluZGV4KXx8MCxnPSh3PT1udWxsP3ZvaWQgMDp3Lm9wdC56SW5kZXgpfHwwO051bWJlcih5KT49TnVtYmVyKGcpJiYoYT1sKX19YnJlYWt9fWlmKGEpe2NvbnN0IGw9YS5uYW1lLGM9dGhpcy52Tm9kZXMuZ2V0KGwpO2lmKGMpe2lmKCFHcih0aGlzLm9sZFNlbGVjdFJlY3QsYy5yZWN0KSl7Y29uc3QgdT1uZXcgTWFwKFtbbCxjXV0pO3RoaXMuZ2V0U2VsZWN0ZW9ySW5mbyh1KSx0aGlzLmRyYXcodCx0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIse2ludGVyc2VjdFJlY3Q6Yy5yZWN0LHN1Yk5vZGVNYXA6dSxzZWxlY3RJZHM6dGhpcy5zZWxlY3RJZHN8fFtdfSxyKX10aGlzLnNlbGVjdElkcz1bbF0sdGhpcy5vbGRTZWxlY3RSZWN0PWMucmVjdH19fX1iYWNrVG9GdWxsTGF5ZXIoZSl7dmFyIHMsbjtsZXQgdDtjb25zdCByPVtdLGk9W107Zm9yKGNvbnN0IGEgb2YoKHM9dGhpcy5kcmF3TGF5ZXIpPT1udWxsP3ZvaWQgMDpzLmNoaWxkcmVuKXx8W10paWYoIShlIT1udWxsJiZlLmxlbmd0aCYmIWUuaW5jbHVkZXMoYS5pZCkpJiZhLmlkIT09RS5zZWxlY3RvcklkKXtjb25zdCBsPWEuY2xvbmVOb2RlKCEwKTtIZShhKSYmbC5zZWFsKCksdGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoYS5uYW1lKS5sZW5ndGh8fHIucHVzaChsKSxpLnB1c2goYSk7Y29uc3QgYz0obj10aGlzLnZOb2Rlcy5nZXQoYS5uYW1lKSk9PW51bGw/dm9pZCAwOm4ucmVjdDtjJiYodD1BKHQsYykpfXJldHVybiBpLmZvckVhY2goYT0+YS5yZW1vdmUoKSksci5sZW5ndGgmJnRoaXMuZnVsbExheWVyLmFwcGVuZCguLi5yKSx0fXNlYWxUb0RyYXdMYXllcihlKXt2YXIgaTtjb25zdCB0PVtdLHI9W107ZS5mb3JFYWNoKHM9Pnt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShzLnRvU3RyaW5nKCkpLmZvckVhY2gobj0+e3ZhciBsO2NvbnN0IGE9bi5jbG9uZU5vZGUoITApO0hlKG4pJiZhLnNlYWwoKSwobD10aGlzLmRyYXdMYXllcikhPW51bGwmJmwuZ2V0RWxlbWVudHNCeU5hbWUobi5uYW1lKS5sZW5ndGh8fHQucHVzaChhKSxyLnB1c2gobil9KX0pLHIuZm9yRWFjaChzPT5zLnJlbW92ZSgpKSx0JiYoKGk9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxpLmFwcGVuZCguLi50KSl9Z2V0U2VsZWN0b3JSZWN0KGUsdCl7dmFyIG47bGV0IHI7Y29uc3QgaT0obj1lLnBhcmVudCk9PW51bGw/dm9pZCAwOm4uZ2V0RWxlbWVudEJ5SWQodCkscz1pPT1udWxsP3ZvaWQgMDppLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybiBzJiYocj1BKHIse3g6TWF0aC5mbG9vcihzLngpLHk6TWF0aC5mbG9vcihzLnkpLHc6TWF0aC5yb3VuZChzLndpZHRoKSxoOk1hdGgucm91bmQocy5oZWlnaHQpfSkpLHJ9aXNDYW5GaWxsQ29sb3IoZSl7cmV0dXJuIGU9PT1TLkVsbGlwc2V8fGU9PT1TLlRyaWFuZ2xlfHxlPT09Uy5SZWN0YW5nbGV8fGU9PT1TLlBvbHlnb258fGU9PT1TLlN0YXJ8fGU9PT1TLlNwZWVjaEJhbGxvb259YXN5bmMgdXBkYXRlU2VsZWN0b3IoZSl7Y29uc3R7dXBkYXRlU2VsZWN0b3JPcHQ6dCxzZWxlY3RJZHM6cix2Tm9kZXM6aSx3aWxsU2VyaWFsaXplRGF0YTpzLHdvcmtlcjpuLG9mZnNldDphLHNjZW5lOmx9PWUsYz10aGlzLmRyYXdMYXllcjtpZighYylyZXR1cm47bGV0IHU7Y29uc3QgaD1uZXcgTWFwLHtib3g6ZCx3b3JrU3RhdGU6ZixhbmdsZTp3LHRyYW5zbGF0ZTp5fT10O2xldCBnPVswLDBdLFA9WzEsMV0saz1bMCwwXSxPLEk7aWYoZHx8eXx8aGUodykpe2lmKGY9PT1GLlN0YXJ0KXJldHVybiBpLnNldFRhcmdldCgpLHt0eXBlOm0uU2VsZWN0LGRhdGFUeXBlOlcuTG9jYWwsc2VsZWN0UmVjdDp0aGlzLm9sZFNlbGVjdFJlY3QscmVjdDp0aGlzLm9sZFNlbGVjdFJlY3R9O2lmKE89aS5nZXRMYXN0VGFyZ2V0KCksTyYmZCl7bGV0IEw7cj09bnVsbHx8ci5mb3JFYWNoKFQ9Pntjb25zdCBNPU89PW51bGw/dm9pZCAwOk8uZ2V0KFQpO0w9QShMLE09PW51bGw/dm9pZCAwOk0ucmVjdCl9KSxMJiYoUD1bZC53L0wudyxkLmgvTC5oXSxnPVtkLngrZC53LzItKEwueCtMLncvMiksZC55K2QuaC8yLShMLnkrTC5oLzIpXSxrPVtMLngrTC53LzIsTC55K0wuaC8yXSksST1MfX1pZihyKWZvcihjb25zdCBMIG9mIHIpe2NvbnN0IFQ9aS5nZXQoTCk7aWYoVCl7Y29uc3R7dG9vbHNUeXBlOk19PVQ7bGV0ICQ9KGM9PW51bGw/dm9pZCAwOmMuZ2V0RWxlbWVudHNCeU5hbWUoTCkpWzBdO2lmKCQpe2NvbnN0IEQ9ey4uLnR9O2xldCBIO2lmKE0pe2lmKE8mJihIPU8uZ2V0KEwpLEgmJmQpKXtELmJveFNjYWxlPVA7Y29uc3QgZWU9W0gucmVjdC54K0gucmVjdC53LzIsSC5yZWN0LnkrSC5yZWN0LmgvMl0sc2U9W2VlWzBdLWtbMF0sZWVbMV0ta1sxXV07RC5ib3hUcmFuc2xhdGU9W3NlWzBdKihQWzBdLTEpK2dbMF0rKGEmJmFbMF18fDApLHNlWzFdKihQWzFdLTEpK2dbMV0rKGEmJmFbMV18fDApXX1jb25zdCBWPVZyKE0pO2lmKFY9PW51bGx8fFYudXBkYXRlTm9kZU9wdCh7bm9kZTokLG9wdDpELHZOb2RlczppLHdpbGxTZXJpYWxpemVEYXRhOnMsdGFyZ2V0Tm9kZTpIfSksVCYmbiYmKHMmJihELmFuZ2xlfHxELnRyYW5zbGF0ZSl8fEQuYm94JiZELndvcmtTdGF0ZSE9PUYuU3RhcnR8fEQucG9pbnRNYXAmJkQucG9pbnRNYXAuaGFzKEwpfHxNPT09Uy5UZXh0JiYoRC5mb250U2l6ZXx8RC50cmFuc2xhdGV8fEQudGV4dEluZm9zJiZELnRleHRJbmZvcy5nZXQoTCkpfHxNPT09Uy5JbWFnZSYmKEQuYW5nbGV8fEQudHJhbnNsYXRlfHxELmJveFNjYWxlKXx8TT09PUQudG9vbHNUeXBlJiZELndpbGxSZWZyZXNoKSl7Y29uc3QgZWU9bi5jcmVhdGVXb3JrU2hhcGVOb2RlKHt0b29sc1R5cGU6TSx0b29sc09wdDpULm9wdH0pO2VlPT1udWxsfHxlZS5zZXRXb3JrSWQoTCk7bGV0IHNlO009PT1TLkltYWdlJiZsP3NlPWF3YWl0IGVlLmNvbnN1bWVTZXJ2aWNlQXN5bmMoe2lzRnVsbFdvcms6ITEscmVwbGFjZUlkOkwsc2NlbmU6bH0pOnNlPWVlPT1udWxsP3ZvaWQgMDplZS5jb25zdW1lU2VydmljZSh7b3A6VC5vcCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDpMLGlzQ2xlYXJBbGw6ITF9KSxzZSYmKFQucmVjdD1zZSxpLnNldEluZm8oTCxUKSksJD0oYz09bnVsbD92b2lkIDA6Yy5nZXRFbGVtZW50c0J5TmFtZShMKSlbMF19VCYmKGguc2V0KEwsVCksdT1BKHUsVC5yZWN0KSl9fX19TyYmZj09PUYuRG9uZSYmaS5kZWxldGVMYXN0VGFyZ2V0KCk7Y29uc3QgYj11O2lmKEkmJnQuZGlyJiZiKXtsZXQgTD1bMCwwXTtzd2l0Y2godC5kaXIpe2Nhc2UidG9wTGVmdCI6Y2FzZSJsZWZ0Ijp7Y29uc3QgVD1bSS54K0kudyxJLnkrSS5oXTtMPVtUWzBdLShiLngrYi53KSxUWzFdLShiLnkrYi5oKV07YnJlYWt9Y2FzZSJib3R0b21MZWZ0IjpjYXNlImJvdHRvbSI6e2NvbnN0IFQ9W0kueCtJLncsSS55XTtMPVtUWzBdLShiLngrYi53KSxUWzFdLWIueV07YnJlYWt9Y2FzZSJ0b3BSaWdodCI6Y2FzZSJ0b3AiOntjb25zdCBUPVtJLngsSS55K0kuaF07TD1bVFswXS1iLngsVFsxXS0oYi55K2IuaCldO2JyZWFrfWNhc2UicmlnaHQiOmNhc2UiYm90dG9tUmlnaHQiOntjb25zdCBUPVtJLngsSS55XTtMPVtUWzBdLWIueCxUWzFdLWIueV07YnJlYWt9fWlmKExbMF18fExbMV0pcmV0dXJuIGIueD1iLngrTFswXSxiLnk9Yi55K0xbMV0sYXdhaXQgdGhpcy51cGRhdGVTZWxlY3Rvcih7Li4uZSxvZmZzZXQ6TH0pfXRoaXMuZ2V0U2VsZWN0ZW9ySW5mbyhoKSx0aGlzLmRyYXcoRS5zZWxlY3RvcklkLGMse3NlbGVjdElkczpyfHxbXSxzdWJOb2RlTWFwOmgsaW50ZXJzZWN0UmVjdDpifSk7Y29uc3Qgdj1BKHRoaXMub2xkU2VsZWN0UmVjdCx1KTtyZXR1cm4gdGhpcy5vbGRTZWxlY3RSZWN0PXUse3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxzZWxlY3RSZWN0OmIscmVuZGVyUmVjdDp1LHJlY3Q6QSh2LGIpfX1ibHVyU2VsZWN0b3IoKXtjb25zdCBlPXRoaXMuYmFja1RvRnVsbExheWVyKCk7cmV0dXJue3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OmUsc2VsZWN0SWRzOltdLHdpbGxTeW5jU2VydmljZTohMH19Z2V0UmlnaHRTZXJ2aWNlSWQoZSl7cmV0dXJuIGUucmVwbGFjZSgiKysiLCItIil9c2VsZWN0U2VydmljZU5vZGUoZSx0LHIpe2NvbnN0e3NlbGVjdElkczppfT10LHM9dGhpcy5nZXRSaWdodFNlcnZpY2VJZChlKSxuPXRoaXMuZ2V0U2VsZWN0b3JSZWN0KHRoaXMuZnVsbExheWVyLHMpO2xldCBhO2NvbnN0IGw9bmV3IE1hcDtyZXR1cm4gaT09bnVsbHx8aS5mb3JFYWNoKGM9Pntjb25zdCB1PXRoaXMudk5vZGVzLmdldChjKSxoPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGMpWzBdO3UmJmgmJihhPUEoYSx1LnJlY3QpLGwuc2V0KGMsdSkpfSksdGhpcy5nZXRTZWxlY3Rlb3JJbmZvKGwpLHRoaXMuZHJhdyhzLHRoaXMuZnVsbExheWVyLHtpbnRlcnNlY3RSZWN0OmEsc2VsZWN0SWRzOml8fFtdLHN1Yk5vZGVNYXA6bH0sciksQShhLG4pfXJlUmVuZGVyU2VsZWN0b3IoKXt2YXIgcjtsZXQgZTtjb25zdCB0PW5ldyBNYXA7cmV0dXJuKHI9dGhpcy5zZWxlY3RJZHMpPT1udWxsfHxyLmZvckVhY2goaT0+e2NvbnN0IHM9dGhpcy52Tm9kZXMuZ2V0KGkpO3MmJihlPUEoZSxzLnJlY3QpLHQuc2V0KGkscykpfSx0aGlzKSx0aGlzLmdldFNlbGVjdGVvckluZm8odCksdGhpcy5kcmF3KEUuc2VsZWN0b3JJZCx0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIse2ludGVyc2VjdFJlY3Q6ZSxzdWJOb2RlTWFwOnQsc2VsZWN0SWRzOnRoaXMuc2VsZWN0SWRzfHxbXX0pLHRoaXMub2xkU2VsZWN0UmVjdD1lLGV9dXBkYXRlU2VsZWN0SWRzKGUpe3ZhciBuLGE7bGV0IHQ7Y29uc3Qgcj0obj10aGlzLnNlbGVjdElkcyk9PW51bGw/dm9pZCAwOm4uZmlsdGVyKGw9PiFlLmluY2x1ZGVzKGwpKSxpPWUuZmlsdGVyKGw9Pnt2YXIgYztyZXR1cm4hKChjPXRoaXMuc2VsZWN0SWRzKSE9bnVsbCYmYy5pbmNsdWRlcyhsKSl9KTtpZihyIT1udWxsJiZyLmxlbmd0aCYmKHQ9dGhpcy5iYWNrVG9GdWxsTGF5ZXIocikpLGkubGVuZ3RoKXt0aGlzLnNlYWxUb0RyYXdMYXllcihpKTtmb3IoY29uc3QgbCBvZiBpKXtjb25zdCBjPShhPXRoaXMudk5vZGVzLmdldChsKSk9PW51bGw/dm9pZCAwOmEucmVjdDtjJiYodD1BKHQsYykpfX10aGlzLnNlbGVjdElkcz1lO2NvbnN0IHM9dGhpcy5yZVJlbmRlclNlbGVjdG9yKCk7cmV0dXJue2JnUmVjdDp0LHNlbGVjdFJlY3Q6c319Y3Vyc29ySG92ZXIoZSl7dmFyIHMsbjtjb25zdCB0PXRoaXMub2xkU2VsZWN0UmVjdDt0aGlzLnNlbGVjdElkcz1bXTtjb25zdCByPShzPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6cy50b1N0cmluZygpLGk9W2VbMF0qdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0sZVsxXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXV07aWYodGhpcy5zZWxlY3RTaW5nbGVUb29sKGksciwhMCksdGhpcy5vbGRTZWxlY3RSZWN0JiYhR3IodCx0aGlzLm9sZFNlbGVjdFJlY3QpKXJldHVybnt0eXBlOm0uQ3Vyc29ySG92ZXIsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OkEodCx0aGlzLm9sZFNlbGVjdFJlY3QpLHNlbGVjdG9yQ29sb3I6dGhpcy5zZWxlY3RvckNvbG9yLHdpbGxTeW5jU2VydmljZTohMX07aWYoKG49dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZuLmxlbmd0aHx8KHRoaXMub2xkU2VsZWN0UmVjdD12b2lkIDApLHQmJiF0aGlzLm9sZFNlbGVjdFJlY3QpcmV0dXJuIHRoaXMuY3Vyc29yQmx1cigpLHt0eXBlOm0uQ3Vyc29ySG92ZXIsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0OnQsc2VsZWN0b3JDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3Isd2lsbFN5bmNTZXJ2aWNlOiExfX1jdXJzb3JCbHVyKCl7dmFyIHQscjt0aGlzLnNlbGVjdElkcz1bXTtjb25zdCBlPSh0PXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6dC50b1N0cmluZygpOygocj10aGlzLmZ1bGxMYXllcik9PW51bGw/dm9pZCAwOnIucGFyZW50KS5jaGlsZHJlbi5mb3JFYWNoKGk9PntpLm5hbWU9PT1lJiZpLnJlbW92ZSgpfSl9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShFLCJzZWxlY3RvcklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ZWR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoRSwic2VsZWN0b3JCb3JkZXJJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiJzZWxlY3Rvci1ib3JkZXIifSk7Y2xhc3MgWHIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmJvdGh9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5BcnJvd30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImFycm93VGlwV2lkdGgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLmFycm93VGlwV2lkdGg9dGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MqNCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnV9KSxkPUEoaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOml9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNlbnRlclBvczp4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIFA7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cn09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoaz0+ay5yZW1vdmUoKSksKFA9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxQLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChrPT5rLnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjppLHRoaWNrbmVzczpzLHpJbmRleDpuLHNjYWxlOmEscm90YXRlOmwsdHJhbnNsYXRlOmN9PXRoaXMud29ya09wdGlvbnMsdT1yLndvcmxkUG9zaXRpb24saD1yLndvcmxkU2NhbGluZyx7cG9pbnRzOmQscmVjdDpmfT10aGlzLmNvbXB1dERyYXdQb2ludHMocykseT17cG9zOltmLngrZi53LzIsZi55K2YuaC8yXSxuYW1lOnQsaWQ6dCxjbG9zZTohMCxwb2ludHM6ZCxmaWxsQ29sb3I6aSxzdHJva2VDb2xvcjppLGxpbmVXaWR0aDowLG5vcm1hbGl6ZTohMCx6SW5kZXg6bn07YSYmKHkuc2NhbGU9YSksbCYmKHkucm90YXRlPWwpLGMmJih5LnRyYW5zbGF0ZT1jKTtjb25zdCBnPW5ldyB6LlBvbHlsaW5lKHkpO2lmKHIuYXBwZW5kKGcpLGF8fGx8fGMpe2NvbnN0IGs9Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGsueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3Ioay55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihrLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGsuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybnt4Ok1hdGguZmxvb3IoZi54KmhbMF0rdVswXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoZi55KmhbMV0rdVsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoZi53KmhbMF0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKSxoOk1hdGguZmxvb3IoZi5oKmhbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKX19Y29tcHV0RHJhd1BvaW50cyhlKXtyZXR1cm4gdGhpcy50bXBQb2ludHNbMV0uZGlzdGFuY2UodGhpcy50bXBQb2ludHNbMF0pPnRoaXMuYXJyb3dUaXBXaWR0aD90aGlzLmNvbXB1dEZ1bGxBcnJvd1BvaW50cyhlKTp0aGlzLmNvbXB1dFRyaWFuZ2xlUG9pbnRzKCl9Y29tcHV0RnVsbEFycm93UG9pbnRzKGUpe2NvbnN0IHQ9cC5TdWIodGhpcy50bXBQb2ludHNbMV0sdGhpcy50bXBQb2ludHNbMF0pLnVuaSgpLHI9cC5QZXIodCkubXVsKGUvMiksaT1SLlN1Yih0aGlzLnRtcFBvaW50c1swXSxyKSxzPVIuQWRkKHRoaXMudG1wUG9pbnRzWzBdLHIpLG49cC5NdWwodCx0aGlzLmFycm93VGlwV2lkdGgpLGE9cC5TdWIodGhpcy50bXBQb2ludHNbMV0sbiksbD1SLlN1YihhLHIpLGM9Ui5BZGQoYSxyKSx1PXAuUGVyKHQpLm11bChlKjEuNSksaD1SLlN1YihhLHUpLGQ9Ui5BZGQoYSx1KSxmPVtpLGwsaCx0aGlzLnRtcFBvaW50c1sxXSxkLGMsc107cmV0dXJue3BvaW50czpmLm1hcCh3PT5SLlN1Yih3LHRoaXMudG1wUG9pbnRzWzBdKS5YWSkuZmxhdCgxKSxyZWN0OkcoZiksaXNUcmlhbmdsZTohMSxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fWNvbXB1dFRyaWFuZ2xlUG9pbnRzKCl7Y29uc3QgZT1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSx0aGlzLnRtcFBvaW50c1swXSkudW5pKCksdD10aGlzLnRtcFBvaW50c1sxXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1swXSkscj1wLlBlcihlKS5tdWwoTWF0aC5mbG9vcih0KjMvOCkpLGk9Ui5TdWIodGhpcy50bXBQb2ludHNbMF0scikscz1SLkFkZCh0aGlzLnRtcFBvaW50c1swXSxyKSxuPVtpLHRoaXMudG1wUG9pbnRzWzFdLHNdO3JldHVybntwb2ludHM6bi5tYXAoYT0+Ui5TdWIoYSx0aGlzLnRtcFBvaW50c1swXSkuWFkpLmZsYXQoMSkscmVjdDpHKG4pLGlzVHJpYW5nbGU6ITAscG9zOnRoaXMudG1wUG9pbnRzWzBdLlhZfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscykpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGw7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnIsaXNUZW1wOml9PWUscz0obD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcylyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBjPTA7Yzx0Lmxlbmd0aDtjKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtjXSx0W2MrMV0sdFtjKzJdKSk7Y29uc3Qgbj1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixhPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6bn0pO3JldHVybiB0aGlzLm9sZFJlY3Q9YSxyJiYhaSYmdGhpcy52Tm9kZXMuc2V0SW5mbyhzLHtyZWN0OmEsb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjZW50ZXJQb3M6eC5nZXRDZW50ZXJQb3MoYSxuKX0pLGF9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXt2YXIgYTtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnN9PXIsbj1pLmdldCh0Lm5hbWUpO3JldHVybiBzJiYodC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSx0LnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixzKSwoYT1uPT1udWxsP3ZvaWQgMDpuLm9wdCkhPW51bGwmJmEuc3Ryb2tlQ29sb3ImJihuLm9wdC5zdHJva2VDb2xvcj1zKSxuJiZpLnNldEluZm8odC5uYW1lLG4pKSx4LnVwZGF0ZU5vZGVPcHQoZSl9fWNsYXNzIEhyIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5hbGx9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5FbGxpcHNlfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnUsaXNEcmF3aW5nOiEwfSksZD1BKGgsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWgse3JlY3Q6ZCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgbDtjb25zdHtkYXRhOnR9PWUscj0obD10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMuZnVsbExheWVyLHM9dGhpcy5kcmF3KHt3b3JrSWQ6cixsYXllcjppLGlzRHJhd2luZzohMX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgSTtjb25zdHt3b3JrSWQ6dCxsYXllcjpyLGlzRHJhd2luZzppfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChiPT5iLnJlbW92ZSgpKSwoST10aGlzLmRyYXdMYXllcik9PW51bGx8fEkuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdGhpY2tuZXNzOmEsekluZGV4Omwsc2NhbGU6Yyxyb3RhdGU6dSx0cmFuc2xhdGU6aH09dGhpcy53b3JrT3B0aW9ucyxkPXIud29ybGRQb3NpdGlvbixmPXIud29ybGRTY2FsaW5nLHtyYWRpdXM6dyxyZWN0OnkscG9zOmd9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhhKSxQPXtwb3M6ZyxuYW1lOnQsaWQ6dCxyYWRpdXM6dyxsaW5lV2lkdGg6YSxmaWxsQ29sb3I6biE9PSJ0cmFuc3BhcmVudCImJm58fHZvaWQgMCxzdHJva2VDb2xvcjpzLG5vcm1hbGl6ZTohMCx6SW5kZXg6bH0saz17eDpNYXRoLmZsb29yKHkueCpmWzBdK2RbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKHkueSpmWzFdK2RbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKHkudypmWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKHkuaCpmWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9O2lmKGkpe2NvbnN0e25hbWU6YixpZDp2LHpJbmRleDpMLHN0cm9rZUNvbG9yOlR9PVAsTT14LmdldENlbnRlclBvcyhrLHIpLCQ9bmV3IHouR3JvdXAoe25hbWU6YixpZDp2LHpJbmRleDpMLHBvczpNLGFuY2hvcjpbLjUsLjVdLHNpemU6W2sudyxrLmhdfSksRD1uZXcgei5FbGxpcHNlKHsuLi5QLHBvczpbMCwwXX0pLEg9bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6VCxsaW5lV2lkdGg6MSxzY2FsZTpbMS9mWzBdLDEvZlsxXV19KTtyZXR1cm4gJC5hcHBlbmQoRCxIKSxyLmFwcGVuZCgkKSxrfWMmJihQLnNjYWxlPWMpLHUmJihQLnJvdGF0ZT11KSxoJiYoUC50cmFuc2xhdGU9aCk7Y29uc3QgTz1uZXcgei5FbGxpcHNlKFApO2lmKHIuYXBwZW5kKE8pLHV8fGN8fGgpe2NvbnN0IGI9Ty5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGIueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoYi55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihiLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGIuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBrfWNvbXB1dERyYXdQb2ludHMoZSl7Y29uc3QgdD1HKHRoaXMudG1wUG9pbnRzKSxyPUcodGhpcy50bXBQb2ludHMsZSksaT1bTWF0aC5mbG9vcih0LngrdC53LzIpLE1hdGguZmxvb3IodC55K3QuaC8yKV07cmV0dXJue3JlY3Q6cixwb3M6aSxyYWRpdXM6W01hdGguZmxvb3IodC53LzIpLE1hdGguZmxvb3IodC5oLzIpXX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PWUuc2xpY2UoLTIpLHI9bmV3IFIodFswXSx0WzFdKSxpPXRoaXMudG1wUG9pbnRzWzBdLHt0aGlja25lc3M6c309dGhpcy53b3JrT3B0aW9ucztpZihpLmlzTmVhcihyLHMpKXJldHVybiExO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTIpe2lmKHIuaXNOZWFyKHRoaXMudG1wUG9pbnRzWzFdLDEpKXJldHVybiExO3RoaXMudG1wUG9pbnRzWzFdPXJ9ZWxzZSB0aGlzLnRtcFBvaW50cy5wdXNoKHIpO3JldHVybiEwfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBsO2NvbnN0e29wOnQsaXNGdWxsV29yazpyLGlzVGVtcDppfT1lLHM9KGw9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJuO3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wO2ZvcihsZXQgYz0wO2M8dC5sZW5ndGg7Yys9Myl0aGlzLnRtcFBvaW50cy5wdXNoKG5ldyBSKHRbY10sdFtjKzFdLHRbYysyXSkpO2NvbnN0IG49cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsYT10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOm4saXNEcmF3aW5nOiExfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1hLHImJiFpJiZ0aGlzLnZOb2Rlcy5zZXRJbmZvKHMse3JlY3Q6YSxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNlbnRlclBvczp4LmdldENlbnRlclBvcyhhLG4pfSksYX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBjLHU7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpufT1yLGE9aS5nZXQodC5uYW1lKTtsZXQgbD10O3JldHVybiB0LnRhZ05hbWU9PT0iR1JPVVAiJiYobD10LmNoaWxkcmVuWzBdKSxzJiYobC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSwoYz1hPT1udWxsP3ZvaWQgMDphLm9wdCkhPW51bGwmJmMuc3Ryb2tlQ29sb3ImJihhLm9wdC5zdHJva2VDb2xvcj1zKSksbiYmKG49PT0idHJhbnNwYXJlbnQiP2wuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLCJyZ2JhKDAsMCwwLDApIik6bC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsbiksKHU9YT09bnVsbD92b2lkIDA6YS5vcHQpIT1udWxsJiZ1LmZpbGxDb2xvciYmKGEub3B0LmZpbGxDb2xvcj1uKSksYSYmaS5zZXRJbmZvKHQubmFtZSxhKSx4LnVwZGF0ZU5vZGVPcHQoZSl9fXZhciBjZj1mZSx1Zj1jZSxoZj0iW29iamVjdCBCb29sZWFuXSI7ZnVuY3Rpb24gZGYobyl7cmV0dXJuIG89PT0hMHx8bz09PSExfHx1ZihvKSYmY2Yobyk9PWhmfXZhciBmZj1kZix3ZT1tZShmZik7Y2xhc3MgWXIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlJlY3RhbmdsZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jVW5pdFRpbWU9NTB9dHJhbnNmb3JtRGF0YSgpe2NvbnN0IGU9Ryh0aGlzLnRtcFBvaW50cyk7cmV0dXJuW1tlLngsZS55LDBdLFtlLngrZS53LGUueSwwXSxbZS54K2UudyxlLnkrZS5oLDBdLFtlLngsZS55K2UuaCwwXV19Y29tcHV0RHJhd1BvaW50cyhlKXtjb25zdHt0aGlja25lc3M6dH09dGhpcy53b3JrT3B0aW9ucyxyPVtdO2Zvcihjb25zdCBuIG9mIGUpci5wdXNoKG5ldyBwKC4uLm4pKTtjb25zdCBpPUcocix0KSxzPVtpLngraS53LzIsaS55K2kuaC8yXTtyZXR1cm57cmVjdDppLHBvczpzLHBvaW50czpyLm1hcChuPT5uLlhZKS5mbGF0KDEpfX1jb25zdW1lKGUpe3ZhciB3O2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPSh3PXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6dy50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3QgdT10aGlzLnRyYW5zZm9ybURhdGEoKTtpZighaSl7Y29uc3QgeT1EYXRlLm5vdygpO3JldHVybiB5LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXkse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnUuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgaD1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixkPXRoaXMuZHJhdyh7cHM6dSx3b3JrSWQ6cyxsYXllcjpoLGlzRHJhd2luZzohMH0pLGY9QShkLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1kLHtyZWN0OmYsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGM7Y29uc3R7ZGF0YTp0fT1lLHI9KGM9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpjLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLnRyYW5zZm9ybURhdGEoKSxzPXRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHtwczppLHdvcmtJZDpyLGxheWVyOnMsaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PW47Y29uc3QgYT1pLmZsYXQoMSksbD1sZShhKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0Om4sb3A6YSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLHtyZWN0Om4sdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmwsb3B0OnRoaXMud29ya09wdGlvbnMsaXNTeW5jOiEwfX1kcmF3KGUpe3ZhciBUO2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3aW5nOmkscHM6cyxyZXBsYWNlSWQ6bn09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShufHx0KS5tYXAoTT0+TS5yZW1vdmUoKSksKFQ9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxULmdldEVsZW1lbnRzQnlOYW1lKG58fHQpLm1hcChNPT5NLnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjphLGZpbGxDb2xvcjpsLHRoaWNrbmVzczpjLHpJbmRleDp1LHNjYWxlOmgscm90YXRlOmQsdHJhbnNsYXRlOmYsdGV4dE9wdDp3fT10aGlzLndvcmtPcHRpb25zLHk9ci53b3JsZFBvc2l0aW9uLGc9ci53b3JsZFNjYWxpbmcse3BvaW50czpQLHJlY3Q6ayxwb3M6T309dGhpcy5jb21wdXREcmF3UG9pbnRzKHMpLEk9e2Nsb3NlOiEwLG5vcm1hbGl6ZTohMCxwb2ludHM6UCxsaW5lV2lkdGg6YyxmaWxsQ29sb3I6bCE9PSJ0cmFuc3BhcmVudCImJmx8fHZvaWQgMCxzdHJva2VDb2xvcjphLGxpbmVKb2luOiJyb3VuZCJ9LGI9e3g6TWF0aC5mbG9vcihrLngqZ1swXSt5WzBdLXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihrLnkqZ1sxXSt5WzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihrLncqZ1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcihrLmgqZ1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfSx2PW5ldyB6Lkdyb3VwKHtuYW1lOnQsaWQ6dCx6SW5kZXg6dSxwb3M6TyxhbmNob3I6Wy41LC41XSxzaXplOltrLncsay5oXSxzY2FsZTpoLHJvdGF0ZTpkLHRyYW5zbGF0ZTpmfSksTD1uZXcgei5Qb2x5bGluZSh7Li4uSSxwb3M6WzAsMF19KTtpZih2LmFwcGVuZENoaWxkKEwpLGkpe2NvbnN0IE09bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6YSxsaW5lV2lkdGg6MSxzY2FsZTpbMS9nWzBdLDEvZ1sxXV19KTt2LmFwcGVuZENoaWxkKE0pfWlmKHIuYXBwZW5kKHYpLGh8fGR8fGYpe2NvbnN0IE09di5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKE0ueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoTS55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihNLndpZHRoKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKE0uaGVpZ2h0KzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9fXJldHVybiBifXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYztjb25zdHtvcDp0LGlzRnVsbFdvcms6cixyZXBsYWNlSWQ6aX09ZSxzPShjPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6Yy50b1N0cmluZygpO2lmKCFzKXJldHVybjtjb25zdCBuPVtdO2ZvcihsZXQgdT0wO3U8dC5sZW5ndGg7dSs9MyluLnB1c2goW3RbdV0sdFt1KzFdLHRbdSsyXV0pO2NvbnN0IGE9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsbD10aGlzLmRyYXcoe3BzOm4sd29ya0lkOnMsbGF5ZXI6YSxpc0RyYXdpbmc6ITEscmVwbGFjZUlkOml9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWwsdGhpcy52Tm9kZXMuc2V0SW5mbyhzLHtyZWN0Omwsb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6bCYmeC5nZXRDZW50ZXJQb3MobCxhKX0pLGx9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXt2YXIgZyxQO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bixmb250Q29sb3I6YSxmb250QmdDb2xvcjpsLGJvbGQ6YyxpdGFsaWM6dSxsaW5lVGhyb3VnaDpoLHVuZGVybGluZTpkLGZvbnRTaXplOmZ9PXIsdz1pLmdldCh0Lm5hbWUpO2xldCB5PXQ7aWYodC50YWdOYW1lPT09IkdST1VQIiYmKHk9dC5jaGlsZHJlblswXSkscyYmKHkuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksKGc9dz09bnVsbD92b2lkIDA6dy5vcHQpIT1udWxsJiZnLnN0cm9rZUNvbG9yJiYody5vcHQuc3Ryb2tlQ29sb3I9cykpLG4mJihuPT09InRyYW5zcGFyZW50Ij95LnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIiwicmdiYSgwLDAsMCwwKSIpOnkuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLG4pLChQPXc9PW51bGw/dm9pZCAwOncub3B0KSE9bnVsbCYmUC5maWxsQ29sb3ImJih3Lm9wdC5maWxsQ29sb3I9bikpLHchPW51bGwmJncub3B0LnRleHRPcHQpe2NvbnN0IGs9dy5vcHQudGV4dE9wdDthJiZrLmZvbnRDb2xvciYmKGsuZm9udENvbG9yPWEpLGwmJmsuZm9udEJnQ29sb3ImJihrLmZvbnRCZ0NvbG9yPWwpLGMmJihrLmJvbGQ9YyksdSYmKGsuaXRhbGljPXUpLHdlKGgpJiYoay5saW5lVGhyb3VnaD1oKSx3ZShkKSYmKGsudW5kZXJsaW5lPWQpLGYmJihrLmZvbnRTaXplPWYpfXJldHVybiB3JiZpLnNldEluZm8odC5uYW1lLHcpLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgcXIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlN0YXJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dSxpc0RyYXdpbmc6ITB9KSxkPUEoaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOmksaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PXM7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5tYXAoYz0+Wy4uLmMuWFksMF0pLmZsYXQoMSksYT1sZShuKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0OnMsb3A6bixvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6cyYmeC5nZXRDZW50ZXJQb3MocyxpKX0pLHtyZWN0OnMsdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmEsaXNTeW5jOiEwLG9wdDp0aGlzLndvcmtPcHRpb25zfX1kcmF3KGUpe3ZhciBMO2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3aW5nOml9PWU7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKFQ9PlQucmVtb3ZlKCkpLChMPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8TC5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoVD0+VC5yZW1vdmUoKSk7Y29uc3R7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0aGlja25lc3M6YSx6SW5kZXg6bCx2ZXJ0aWNlczpjLGlubmVyVmVydGljZVN0ZXA6dSxpbm5lclJhdGlvOmgsc2NhbGU6ZCxyb3RhdGU6Zix0cmFuc2xhdGU6d309dGhpcy53b3JrT3B0aW9ucyx5PXIud29ybGRQb3NpdGlvbixnPXIud29ybGRTY2FsaW5nLHtyZWN0OlAscG9zOmsscG9pbnRzOk99PXRoaXMuY29tcHV0RHJhd1BvaW50cyhhLGMsdSxoKSxJPXtwb3M6ayxjbG9zZTohMCxuYW1lOnQsaWQ6dCxwb2ludHM6TyxsaW5lV2lkdGg6YSxmaWxsQ29sb3I6biE9PSJ0cmFuc3BhcmVudCImJm58fHZvaWQgMCxzdHJva2VDb2xvcjpzLGNsYXNzTmFtZTpgJHtrWzBdfSwke2tbMV19YCxub3JtYWxpemU6ITAsekluZGV4OmwsbGluZUpvaW46InJvdW5kIn0sYj17eDpNYXRoLmZsb29yKFAueCpnWzBdK3lbMF0teC5TYWZlQm9yZGVyUGFkZGluZypnWzBdKSx5Ok1hdGguZmxvb3IoUC55KmdbMV0reVsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKmdbMV0pLHc6TWF0aC5mbG9vcihQLncqZ1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqZ1swXSksaDpNYXRoLmZsb29yKFAuaCpnWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypnWzFdKX07aWYoaSl7Y29uc3R7bmFtZTpULGlkOk0sekluZGV4OiQsc3Ryb2tlQ29sb3I6RH09SSxIPVsoYi54K2Iudy8yLXlbMF0pL2dbMF0sKGIueStiLmgvMi15WzFdKS9nWzFdXSxWPW5ldyB6Lkdyb3VwKHtuYW1lOlQsaWQ6TSx6SW5kZXg6JCxwb3M6SCxhbmNob3I6Wy41LC41XSxzaXplOltiLncsYi5oXX0pLGVlPW5ldyB6LlBvbHlsaW5lKHsuLi5JLHBvczpbMCwwXX0pLHNlPW5ldyB6LlBhdGgoe2Q6Ik0tNCwwSDRNMCwtNFY0Iixub3JtYWxpemU6ITAscG9zOlswLDBdLHN0cm9rZUNvbG9yOkQsbGluZVdpZHRoOjEsc2NhbGU6WzEvZ1swXSwxL2dbMV1dfSk7cmV0dXJuIFYuYXBwZW5kKGVlLHNlKSxyLmFwcGVuZChWKSxifWQmJihJLnNjYWxlPWQpLGYmJihJLnJvdGF0ZT1mKSx3JiYoSS50cmFuc2xhdGU9dyk7Y29uc3Qgdj1uZXcgei5Qb2x5bGluZShJKTtpZihyLmFwcGVuZCh2KSxkfHxmfHx3KXtjb25zdCBUPXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcihULngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKFQueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoVC53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihULmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm4gYn1jb21wdXREcmF3UG9pbnRzKGUsdCxyLGkpe2NvbnN0IHM9Ryh0aGlzLnRtcFBvaW50cyksbj1bTWF0aC5mbG9vcihzLngrcy53LzIpLE1hdGguZmxvb3Iocy55K3MuaC8yKV0sYT14cihzLncscy5oKSxsPU1hdGguZmxvb3IoTWF0aC5taW4ocy53LHMuaCkvMiksYz1pKmwsdT1bXSxoPTIqTWF0aC5QSS90O2ZvcihsZXQgZj0wO2Y8dDtmKyspe2NvbnN0IHc9ZipoLS41Kk1hdGguUEk7bGV0IHksZztmJXI9PT0xPyh5PWMqYVswXSpNYXRoLmNvcyh3KSxnPWMqYVsxXSpNYXRoLnNpbih3KSk6KHk9bCphWzBdKk1hdGguY29zKHcpLGc9bCphWzFdKk1hdGguc2luKHcpLHUucHVzaCh5LGcpKSx1LnB1c2goeSxnKX1yZXR1cm57cmVjdDpHKHRoaXMudG1wUG9pbnRzLGUpLHBvczpuLHBvaW50czp1fX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscyl8fFIuU3ViKGkscikuWFkuaW5jbHVkZXMoMCkpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PW4sdGhpcy52Tm9kZXMuc2V0SW5mbyhpLHtyZWN0Om4sb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLG59Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdG9vbHNUeXBlOmEsdmVydGljZXM6bCxpbm5lclZlcnRpY2VTdGVwOmMsaW5uZXJSYXRpbzp1fT1yLGg9aS5nZXQodC5uYW1lKSxkPWg9PW51bGw/dm9pZCAwOmgub3B0O2xldCBmPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihmPXQuY2hpbGRyZW5bMF0pLHMmJihmLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLGQhPW51bGwmJmQuc3Ryb2tlQ29sb3ImJihkLnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/Zi5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpmLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSxkIT1udWxsJiZkLmZpbGxDb2xvciYmKGQuZmlsbENvbG9yPW4pKSxhPT09Uy5TdGFyJiYobCYmKGQudmVydGljZXM9bCksYyYmKGQuaW5uZXJWZXJ0aWNlU3RlcD1jKSx1JiYoZC5pbm5lclJhdGlvPXUpKSxoJiZpLnNldEluZm8odC5uYW1lLHsuLi5oLG9wdDpkfSkseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBaciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuUG9seWdvbn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jVW5pdFRpbWU9NTB9Y29uc3VtZShlKXt2YXIgZjtjb25zdHtkYXRhOnQsaXNGdWxsV29yazpyLGlzU3ViV29ya2VyOml9PWUscz0oZj10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmYudG9TdHJpbmcoKTtpZighcylyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e29wOm4sd29ya1N0YXRlOmF9PXQsbD1uPT1udWxsP3ZvaWQgMDpuLmxlbmd0aDtpZighbHx8bDwyKXJldHVybnt0eXBlOm0uTm9uZX07bGV0IGM7aWYoYT09PUYuU3RhcnQ/KHRoaXMudG1wUG9pbnRzPVtuZXcgUihuWzBdLG5bMV0pXSxjPSExKTpjPXRoaXMudXBkYXRlVGVtcFBvaW50cyhuKSwhYylyZXR1cm57dHlwZTptLk5vbmV9O2lmKCFpKXtjb25zdCB3PURhdGUubm93KCk7cmV0dXJuIHctdGhpcy5zeW5jVGltZXN0YW1wPnRoaXMuc3luY1VuaXRUaW1lPyh0aGlzLnN5bmNUaW1lc3RhbXA9dyx7dHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnMsb3A6dGhpcy50bXBQb2ludHMubWFwKHk9PlsuLi55LlhZLDBdKS5mbGF0KDEpLGlzU3luYzohMCxpbmRleDowfSk6e3R5cGU6bS5Ob25lfX1jb25zdCB1PXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGg9dGhpcy5kcmF3KHt3b3JrSWQ6cyxsYXllcjp1LGlzRHJhd2luZzohMH0pLGQ9QShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aSxpc0RyYXdpbmc6ITF9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIGI7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdpbmc6aX09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAodj0+di5yZW1vdmUoKSksKGI9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxiLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh2PT52LnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLHRoaWNrbmVzczphLHpJbmRleDpsLHZlcnRpY2VzOmMsc2NhbGU6dSxyb3RhdGU6aCx0cmFuc2xhdGU6ZH09dGhpcy53b3JrT3B0aW9ucyxmPXIud29ybGRQb3NpdGlvbix3PXIud29ybGRTY2FsaW5nLHtyZWN0OnkscG9zOmcscG9pbnRzOlB9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhhLGMpLGs9e3BvczpnLGNsb3NlOiEwLG5hbWU6dCxpZDp0LHBvaW50czpQLGxpbmVXaWR0aDphLGZpbGxDb2xvcjpuIT09InRyYW5zcGFyZW50IiYmbnx8dm9pZCAwLHN0cm9rZUNvbG9yOnMsbm9ybWFsaXplOiEwLHpJbmRleDpsLGxpbmVKb2luOiJyb3VuZCJ9LE89e3g6TWF0aC5mbG9vcih5Lngqd1swXStmWzBdLXguU2FmZUJvcmRlclBhZGRpbmcqd1swXSkseTpNYXRoLmZsb29yKHkueSp3WzFdK2ZbMV0teC5TYWZlQm9yZGVyUGFkZGluZyp3WzFdKSx3Ok1hdGguZmxvb3IoeS53KndbMF0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKndbMF0pLGg6TWF0aC5mbG9vcih5Lmgqd1sxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqd1sxXSl9O2lmKGkpe2NvbnN0e25hbWU6dixpZDpMLHpJbmRleDpULHN0cm9rZUNvbG9yOk19PWssJD1bKE8ueCtPLncvMi1mWzBdKS93WzBdLChPLnkrTy5oLzItZlsxXSkvd1sxXV0sRD1uZXcgei5Hcm91cCh7bmFtZTp2LGlkOkwsekluZGV4OlQscG9zOiQsYW5jaG9yOlsuNSwuNV0sc2l6ZTpbTy53LE8uaF19KSxIPW5ldyB6LlBvbHlsaW5lKHsuLi5rLHBvczpbMCwwXX0pLFY9bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6TSxsaW5lV2lkdGg6MSxzY2FsZTpbMS93WzBdLDEvd1sxXV19KTtyZXR1cm4gRC5hcHBlbmQoSCxWKSxyLmFwcGVuZChEKSxPfXUmJihrLnNjYWxlPXUpLGgmJihrLnJvdGF0ZT1oKSxkJiYoay50cmFuc2xhdGU9ZCk7Y29uc3QgST1uZXcgei5Qb2x5bGluZShrKTtpZihyLmFwcGVuZChJKSx1fHxofHxkKXtjb25zdCB2PUkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcih2LngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKHYueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3Iodi53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcih2LmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm4gT31jb21wdXREcmF3UG9pbnRzKGUsdCl7Y29uc3Qgcj1HKHRoaXMudG1wUG9pbnRzKSxpPVtNYXRoLmZsb29yKHIueCtyLncvMiksTWF0aC5mbG9vcihyLnkrci5oLzIpXSxzPXhyKHIudyxyLmgpLG49TWF0aC5mbG9vcihNYXRoLm1pbihyLncsci5oKS8yKSxhPVtdLGw9MipNYXRoLlBJL3Q7Zm9yKGxldCB1PTA7dTx0O3UrKyl7Y29uc3QgaD11KmwtLjUqTWF0aC5QSSxkPW4qc1swXSpNYXRoLmNvcyhoKSxmPW4qc1sxXSpNYXRoLnNpbihoKTthLnB1c2goZCxmKX1yZXR1cm57cmVjdDpHKHRoaXMudG1wUG9pbnRzLGUpLHBvczppLHBvaW50czphfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscyl8fFIuU3ViKGkscikuWFkuaW5jbHVkZXMoMCkpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PW4sdGhpcy52Tm9kZXMuc2V0SW5mbyhpLHtyZWN0Om4sb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLG59Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdG9vbHNUeXBlOmEsdmVydGljZXM6bH09cixjPWkuZ2V0KHQubmFtZSksdT1jPT1udWxsP3ZvaWQgMDpjLm9wdDtsZXQgaD10O3JldHVybiB0LnRhZ05hbWU9PT0iR1JPVVAiJiYoaD10LmNoaWxkcmVuWzBdKSxzJiYoaC5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSx1IT1udWxsJiZ1LnN0cm9rZUNvbG9yJiYodS5zdHJva2VDb2xvcj1zKSksbiYmKG49PT0idHJhbnNwYXJlbnQiP2guc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLCJyZ2JhKDAsMCwwLDApIik6aC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsbiksdSE9bnVsbCYmdS5maWxsQ29sb3ImJih1LmZpbGxDb2xvcj1uKSksYT09PVMuUG9seWdvbiYmbCYmKHUudmVydGljZXM9bCksYyYmaS5zZXRJbmZvKHQubmFtZSx7Li4uYyxvcHQ6dX0pLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgYWV7c3RhdGljIGJlemllcihlLHQpe2NvbnN0IHI9W107Zm9yKGxldCBpPTA7aTx0Lmxlbmd0aDtpKz00KXtjb25zdCBzPXRbaV0sbj10W2krMV0sYT10W2krMl0sbD10W2krM107cyYmbiYmYSYmbD9yLnB1c2goLi4uYWUuZ2V0QmV6aWVyUG9pbnRzKGUscyxuLGEsbCkpOnMmJm4mJmE/ci5wdXNoKC4uLmFlLmdldEJlemllclBvaW50cyhlLHMsbixhKSk6cyYmbj9yLnB1c2goLi4uYWUuZ2V0QmV6aWVyUG9pbnRzKGUscyxuKSk6cyYmci5wdXNoKHMpfXJldHVybiByfXN0YXRpYyBnZXRCZXppZXJQb2ludHMoZT0xMCx0LHIsaSxzKXtsZXQgbj1udWxsO2NvbnN0IGE9W107IWkmJiFzP249YWUub25lQmV6aWVyOmkmJiFzP249YWUudHdvQmV6aWVyOmkmJnMmJihuPWFlLnRocmVlQmV6aWVyKTtmb3IobGV0IGw9MDtsPGU7bCsrKW4mJmEucHVzaChuKGwvZSx0LHIsaSxzKSk7cmV0dXJuIHM/YS5wdXNoKHMpOmkmJmEucHVzaChpKSxhfXN0YXRpYyBvbmVCZXppZXIoZSx0LHIpe2NvbnN0IGk9dC54KyhyLngtdC54KSplLHM9dC55KyhyLnktdC55KSplO3JldHVybiBuZXcgcChpLHMpfXN0YXRpYyB0d29CZXppZXIoZSx0LHIsaSl7Y29uc3Qgcz0oMS1lKSooMS1lKSp0LngrMiplKigxLWUpKnIueCtlKmUqaS54LG49KDEtZSkqKDEtZSkqdC55KzIqZSooMS1lKSpyLnkrZSplKmkueTtyZXR1cm4gbmV3IHAocyxuKX1zdGF0aWMgdGhyZWVCZXppZXIoZSx0LHIsaSxzKXtjb25zdCBuPXQueCooMS1lKSooMS1lKSooMS1lKSszKnIueCplKigxLWUpKigxLWUpKzMqaS54KmUqZSooMS1lKStzLngqZSplKmUsYT10LnkqKDEtZSkqKDEtZSkqKDEtZSkrMypyLnkqZSooMS1lKSooMS1lKSszKmkueSplKmUqKDEtZSkrcy55KmUqZSplO3JldHVybiBuZXcgcChuLGEpfX1jbGFzcyBRciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuU3BlZWNoQmFsbG9vbn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJyYXRpbyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOi44fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnUsaXNEcmF3aW5nOiEwfSksZD1BKGgsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWgse3JlY3Q6ZCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgbDtjb25zdHtkYXRhOnR9PWUscj0obD10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMuZnVsbExheWVyLHM9dGhpcy5kcmF3KHt3b3JrSWQ6cixsYXllcjppLGlzRHJhd2luZzohMX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgSTtjb25zdHt3b3JrSWQ6dCxsYXllcjpyfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChiPT5iLnJlbW92ZSgpKSwoST10aGlzLmRyYXdMYXllcik9PW51bGx8fEkuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmksZmlsbENvbG9yOnMsdGhpY2tuZXNzOm4sekluZGV4OmEscGxhY2VtZW50Omwsc2NhbGU6Yyxyb3RhdGU6dSx0cmFuc2xhdGU6aH09dGhpcy53b3JrT3B0aW9ucyxkPXIud29ybGRQb3NpdGlvbixmPXIud29ybGRTY2FsaW5nLHtyZWN0OncscG9zOnkscG9pbnRzOmd9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhuLGwpLFA9e3Bvczp5LG5hbWU6dCxpZDp0LHBvaW50czpnLm1hcChiPT5iLlhZKSxsaW5lV2lkdGg6bixmaWxsQ29sb3I6cyE9PSJ0cmFuc3BhcmVudCImJnN8fHZvaWQgMCxzdHJva2VDb2xvcjppLG5vcm1hbGl6ZTohMCxjbGFzc05hbWU6YCR7eVswXX0sJHt5WzFdfWAsekluZGV4OmEsbGluZUpvaW46InJvdW5kIixjbG9zZTohMH0saz17eDpNYXRoLmZsb29yKHcueCpmWzBdK2RbMF0teC5TYWZlQm9yZGVyUGFkZGluZypmWzBdKSx5Ok1hdGguZmxvb3Iody55KmZbMV0rZFsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKmZbMV0pLHc6TWF0aC5mbG9vcih3LncqZlswXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqZlswXSksaDpNYXRoLmZsb29yKHcuaCpmWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypmWzFdKX07YyYmKFAuc2NhbGU9YyksdSYmKFAucm90YXRlPXUpLGgmJihQLnRyYW5zbGF0ZT1oKTtjb25zdCBPPW5ldyB6LlBvbHlsaW5lKFApO2lmKHIuYXBwZW5kKE8pLGN8fHV8fGgpe2NvbnN0IGI9Ty5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGIueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoYi55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihiLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKGIuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBrfXRyYW5zZm9ybUNvbnRyb2xQb2ludHMoZSl7Y29uc3QgdD1HKHRoaXMudG1wUG9pbnRzKTtzd2l0Y2goZSl7Y2FzZSJib3R0b20iOmNhc2UiYm90dG9tTGVmdCI6Y2FzZSJib3R0b21SaWdodCI6e2NvbnN0IHI9dC55K3QuaCp0aGlzLnJhdGlvO3JldHVybltuZXcgcCh0LngsdC55LDApLG5ldyBwKHQueCt0LncsdC55LDApLG5ldyBwKHQueCt0LncsciwwKSxuZXcgcCh0LngsciwwKV19Y2FzZSJ0b3AiOmNhc2UidG9wTGVmdCI6Y2FzZSJ0b3BSaWdodCI6e2NvbnN0IHI9dC55K3QuaCooMS10aGlzLnJhdGlvKTtyZXR1cm5bbmV3IHAodC54LHIsMCksbmV3IHAodC54K3QudyxyLDApLG5ldyBwKHQueCt0LncsdC55K3QuaCwwKSxuZXcgcCh0LngsdC55K3QuaCwwKV19Y2FzZSJsZWZ0IjpjYXNlImxlZnRCb3R0b20iOmNhc2UibGVmdFRvcCI6e2NvbnN0IHI9dC54K3QudyooMS10aGlzLnJhdGlvKTtyZXR1cm5bbmV3IHAocix0LnksMCksbmV3IHAodC54K3Qudyx0LnksMCksbmV3IHAodC54K3Qudyx0LnkrdC5oLDApLG5ldyBwKHIsdC55K3QuaCwwKV19Y2FzZSJyaWdodCI6Y2FzZSJyaWdodEJvdHRvbSI6Y2FzZSJyaWdodFRvcCI6e2NvbnN0IHI9dC54K3Qudyp0aGlzLnJhdGlvO3JldHVybltuZXcgcCh0LngsdC55LDApLG5ldyBwKHIsdC55LDApLG5ldyBwKHIsdC55K3QuaCwwKSxuZXcgcCh0LngsdC55K3QuaCwwKV19fX1jb21wdXREcmF3UG9pbnRzKGUsdCl7Y29uc3Qgcj1HKHRoaXMudG1wUG9pbnRzKSxpPXRoaXMudHJhbnNmb3JtQ29udHJvbFBvaW50cyh0KSxzPU1hdGguZmxvb3Ioci53Ki4xKSxuPU1hdGguZmxvb3Ioci5oKi4xKSxhPVtdLGw9cC5BZGQoaVswXSxuZXcgcCgwLG4sMCkpLGM9cC5BZGQoaVswXSxuZXcgcChzLDAsMCkpLHU9YWUuZ2V0QmV6aWVyUG9pbnRzKDEwLGwsaVswXSxjKSxoPXAuU3ViKGlbMV0sbmV3IHAocywwLDApKSxkPXAuQWRkKGlbMV0sbmV3IHAoMCxuLDApKSxmPWFlLmdldEJlemllclBvaW50cygxMCxoLGlbMV0sZCksdz1wLlN1YihpWzJdLG5ldyBwKDAsbiwwKSkseT1wLlN1YihpWzJdLG5ldyBwKHMsMCwwKSksZz1hZS5nZXRCZXppZXJQb2ludHMoMTAsdyxpWzJdLHkpLFA9cC5BZGQoaVszXSxuZXcgcChzLDAsMCkpLGs9cC5TdWIoaVszXSxuZXcgcCgwLG4sMCkpLE89YWUuZ2V0QmV6aWVyUG9pbnRzKDEwLFAsaVszXSxrKSxJPXMqKDEtdGhpcy5yYXRpbykqMTAsYj1uKigxLXRoaXMucmF0aW8pKjEwO3N3aXRjaCh0KXtjYXNlImJvdHRvbSI6e2NvbnN0IFQ9cC5TdWIoaVsyXSxuZXcgcChzKjUtSS8yLDAsMCkpLE09cC5TdWIoaVsyXSxuZXcgcChzKjUsLWIsMCkpLCQ9cC5TdWIoaVsyXSxuZXcgcChzKjUrSS8yLDAsMCkpO2EucHVzaChNLCQsLi4uTywuLi51LC4uLmYsLi4uZyxUKTticmVha31jYXNlImJvdHRvbVJpZ2h0Ijp7Y29uc3QgVD1wLlN1YihpWzJdLG5ldyBwKHMqMS4xLDAsMCkpLE09cC5TdWIoaVsyXSxuZXcgcChzKjEuMStJLzIsLWIsMCkpLCQ9cC5TdWIoaVsyXSxuZXcgcChzKjEuMStJLDAsMCkpO2EucHVzaChNLCQsLi4uTywuLi51LC4uLmYsLi4uZyxUKTticmVha31jYXNlImJvdHRvbUxlZnQiOntjb25zdCBUPXAuQWRkKGlbM10sbmV3IHAocyoxLjErSSwwLDApKSxNPXAuQWRkKGlbM10sbmV3IHAocyoxLjErSS8yLGIsMCkpLCQ9cC5BZGQoaVszXSxuZXcgcChzKjEuMSwwLDApKTthLnB1c2goTSwkLC4uLk8sLi4udSwuLi5mLC4uLmcsVCk7YnJlYWt9Y2FzZSJ0b3AiOntjb25zdCBUPXAuU3ViKGlbMV0sbmV3IHAocyo1LUkvMiwwLDApKSxNPXAuU3ViKGlbMV0sbmV3IHAocyo1LGIsMCkpLCQ9cC5TdWIoaVsxXSxuZXcgcChzKjUrSS8yLDAsMCkpO2EucHVzaChNLFQsLi4uZiwuLi5nLC4uLk8sLi4udSwkKTticmVha31jYXNlInRvcFJpZ2h0Ijp7Y29uc3QgVD1wLlN1YihpWzFdLG5ldyBwKHMqMS4xLDAsMCkpLE09cC5TdWIoaVsxXSxuZXcgcChzKjEuMStJLzIsYiwwKSksJD1wLlN1YihpWzFdLG5ldyBwKHMqMS4xK0ksMCwwKSk7YS5wdXNoKE0sVCwuLi5mLC4uLmcsLi4uTywuLi51LCQpO2JyZWFrfWNhc2UidG9wTGVmdCI6e2NvbnN0IFQ9cC5BZGQoaVswXSxuZXcgcChzKjEuMStJLDAsMCkpLE09cC5BZGQoaVswXSxuZXcgcChzKjEuMStJLzIsLWIsMCkpLCQ9cC5BZGQoaVswXSxuZXcgcChzKjEuMSwwLDApKTthLnB1c2goTSxULC4uLmYsLi4uZywuLi5PLC4uLnUsJCk7YnJlYWt9Y2FzZSJsZWZ0Ijp7Y29uc3QgVD1wLkFkZChpWzBdLG5ldyBwKDAsbio1LWIvMiwwKSksTT1wLkFkZChpWzBdLG5ldyBwKC1JLG4qNSwwKSksJD1wLkFkZChpWzBdLG5ldyBwKDAsbio1K2IvMiwwKSk7YS5wdXNoKE0sVCwuLi51LC4uLmYsLi4uZywuLi5PLCQpO2JyZWFrfWNhc2UibGVmdFRvcCI6e2NvbnN0IFQ9cC5BZGQoaVswXSxuZXcgcCgwLG4qMS4xLDApKSxNPXAuQWRkKGlbMF0sbmV3IHAoLUksbioxLjErYi8yLDApKSwkPXAuQWRkKGlbMF0sbmV3IHAoMCxuKjEuMStiLDApKTthLnB1c2goTSxULC4uLnUsLi4uZiwuLi5nLC4uLk8sJCk7YnJlYWt9Y2FzZSJsZWZ0Qm90dG9tIjp7Y29uc3QgVD1wLlN1YihpWzNdLG5ldyBwKDAsbioxLjErYiwwKSksTT1wLlN1YihpWzNdLG5ldyBwKEksbioxLjErYi8yLDApKSwkPXAuU3ViKGlbM10sbmV3IHAoMCxuKjEuMSwwKSk7YS5wdXNoKE0sVCwuLi51LC4uLmYsLi4uZywuLi5PLCQpO2JyZWFrfWNhc2UicmlnaHQiOntjb25zdCBUPXAuQWRkKGlbMV0sbmV3IHAoMCxuKjUtYi8yLDApKSxNPXAuQWRkKGlbMV0sbmV3IHAoSSxuKjUsMCkpLCQ9cC5BZGQoaVsxXSxuZXcgcCgwLG4qNStiLzIsMCkpO2EucHVzaChNLCQsLi4uZywuLi5PLC4uLnUsLi4uZixUKTticmVha31jYXNlInJpZ2h0VG9wIjp7Y29uc3QgVD1wLkFkZChpWzFdLG5ldyBwKDAsbioxLjEsMCkpLE09cC5BZGQoaVsxXSxuZXcgcChJLG4qMS4xK2IvMiwwKSksJD1wLkFkZChpWzFdLG5ldyBwKDAsbioxLjErYiwwKSk7YS5wdXNoKE0sJCwuLi5nLC4uLk8sLi4udSwuLi5mLFQpO2JyZWFrfWNhc2UicmlnaHRCb3R0b20iOntjb25zdCBUPXAuU3ViKGlbMl0sbmV3IHAoMCxuKjEuMStiLDApKSxNPXAuU3ViKGlbMl0sbmV3IHAoLUksbioxLjErYi8yLDApKSwkPXAuU3ViKGlbMl0sbmV3IHAoMCxuKjEuMSwwKSk7YS5wdXNoKE0sJCwuLi5nLC4uLk8sLi4udSwuLi5mLFQpO2JyZWFrfX1jb25zdCB2PUcodGhpcy50bXBQb2ludHMsZSksTD1bTWF0aC5mbG9vcih2Lngrdi53LzIpLE1hdGguZmxvb3Iodi55K3YuaC8yKV07cmV0dXJue3JlY3Q6dixwb3M6TCxwb2ludHM6YX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PWUuc2xpY2UoLTIpLHI9bmV3IFIodFswXSx0WzFdKSxpPXRoaXMudG1wUG9pbnRzWzBdLHt0aGlja25lc3M6c309dGhpcy53b3JrT3B0aW9ucztpZihpLmlzTmVhcihyLHMpfHxSLlN1YihpLHIpLlhZLmluY2x1ZGVzKDApKXJldHVybiExO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTIpe2lmKHIuaXNOZWFyKHRoaXMudG1wUG9pbnRzWzFdLDEpKXJldHVybiExO3RoaXMudG1wUG9pbnRzWzFdPXJ9ZWxzZSB0aGlzLnRtcFBvaW50cy5wdXNoKHIpO3JldHVybiEwfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBhO2NvbnN0e29wOnQsaXNGdWxsV29yazpyfT1lLGk9KGE9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDphLnRvU3RyaW5nKCk7aWYoIWkpcmV0dXJuO3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wO2ZvcihsZXQgbD0wO2w8dC5sZW5ndGg7bCs9Myl0aGlzLnRtcFBvaW50cy5wdXNoKG5ldyBSKHRbbF0sdFtsKzFdLHRbbCsyXSkpO2NvbnN0IHM9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsbj10aGlzLmRyYXcoe3dvcmtJZDppLGxheWVyOnMsaXNEcmF3aW5nOiExfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1uLHRoaXMudk5vZGVzLnNldEluZm8oaSx7cmVjdDpuLG9wOnQsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOm4mJnguZ2V0Q2VudGVyUG9zKG4scyl9KSxufWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLHRvb2xzVHlwZTphLHBsYWNlbWVudDpsfT1yLGM9aS5nZXQodC5uYW1lKSx1PWM9PW51bGw/dm9pZCAwOmMub3B0O2xldCBoPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihoPXQuY2hpbGRyZW5bMF0pLHMmJihoLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHUhPW51bGwmJnUuc3Ryb2tlQ29sb3ImJih1LnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/aC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpoLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSx1IT1udWxsJiZ1LmZpbGxDb2xvciYmKHUuZmlsbENvbG9yPW4pKSxhPT09Uy5TcGVlY2hCYWxsb29uJiZsJiYodS5wbGFjZW1lbnQ9bCksYyYmaS5zZXRJbmZvKHQubmFtZSx7Li4uYyxvcHQ6dX0pLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgSnIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkltYWdlfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zY2FsZVR5cGU9dGhpcy53b3JrT3B0aW9ucy51bmlmb3JtU2NhbGU/cS5wcm9wb3J0aW9uYWw6cS5hbGx9Y29uc3VtZSgpe3JldHVybnt0eXBlOm0uTm9uZX19Y29uc3VtZUFsbCgpe3JldHVybnt0eXBlOm0uTm9uZX19ZHJhdyhlKXt2YXIgaztjb25zdHtsYXllcjp0LHdvcmtJZDpyLHJlcGxhY2VJZDppLGltYWdlQml0bWFwOnN9PWUse2NlbnRlclg6bixjZW50ZXJZOmEsd2lkdGg6bCxoZWlnaHQ6YyxzY2FsZTp1LHJvdGF0ZTpoLHRyYW5zbGF0ZTpkLHpJbmRleDpmfT10aGlzLndvcmtPcHRpb25zO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGl8fHIpLm1hcChPPT5PLnJlbW92ZSgpKSwoaz10aGlzLmRyYXdMYXllcik9PW51bGx8fGsuZ2V0RWxlbWVudHNCeU5hbWUoaXx8cikubWFwKE89Pk8ucmVtb3ZlKCkpO2NvbnN0IHc9e2FuY2hvcjpbLjUsLjVdLHBvczpbbixhXSxuYW1lOnIsc2l6ZTpbbCxjXSx6SW5kZXg6Zn07aWYodSlpZih0aGlzLnNjYWxlVHlwZT09PXEucHJvcG9ydGlvbmFsKXtjb25zdCBPPU1hdGgubWluKHVbMF0sdVsxXSk7dy5zY2FsZT1bTyxPXX1lbHNlIHcuc2NhbGU9dTtkJiYody50cmFuc2xhdGU9ZCksaCYmKHcucm90YXRlPWgpO2NvbnN0IHk9bmV3IHouR3JvdXAodyksZz1uZXcgei5TcHJpdGUoe2FuY2hvcjpbLjUsLjVdLHBvczpbMCwwXSxzaXplOltsLGNdLHRleHR1cmU6cyxyb3RhdGU6MTgwfSk7eS5hcHBlbmQoZyksdC5hcHBlbmQoeSk7Y29uc3QgUD15LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2lmKFApcmV0dXJue3g6TWF0aC5mbG9vcihQLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKFAueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoUC53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihQLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1jb25zdW1lU2VydmljZSgpe31hc3luYyBjb25zdW1lU2VydmljZUFzeW5jKGUpe3ZhciBjLHU7Y29uc3R7aXNGdWxsV29yazp0LHJlcGxhY2VJZDpyLHNjZW5lOml9PWUse3NyYzpzLHV1aWQ6bn09dGhpcy53b3JrT3B0aW9ucyxhPSgoYz10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmMudG9TdHJpbmcoKSl8fG4sbD10P3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcjtpZihzKXtjb25zdCBoPWF3YWl0IGkucHJlbG9hZCh7aWQ6bixzcmM6dGhpcy53b3JrT3B0aW9ucy5zcmN9KSxkPXRoaXMuZHJhdyh7d29ya0lkOmEsbGF5ZXI6bCxyZXBsYWNlSWQ6cixpbWFnZUJpdG1hcDpoWzBdfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1hJiYoKHU9dGhpcy52Tm9kZXMuZ2V0KGEpKT09bnVsbD92b2lkIDA6dS5yZWN0KXx8dm9pZCAwLHRoaXMudk5vZGVzLnNldEluZm8oYSx7cmVjdDpkLG9wOltdLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpkJiZ4LmdldENlbnRlclBvcyhkLGwpfSksZH19Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOmksdGFyZ2V0Tm9kZTpzfT1lLHt0cmFuc2xhdGU6bixib3g6YSxib3hTY2FsZTpsLGJveFRyYW5zbGF0ZTpjLGFuZ2xlOnUsaXNMb2NrZWQ6aCx6SW5kZXg6ZH09cixmPXMmJnJlKHMpfHxpLmdldCh0Lm5hbWUpO2lmKCFmKXJldHVybjtjb25zdCB3PXQucGFyZW50O2lmKHcpe2lmKGhlKGQpJiYodC5zZXRBdHRyaWJ1dGUoInpJbmRleCIsZCksZi5vcHQuekluZGV4PWQpLHdlKGgpJiYoZi5vcHQubG9ja2VkPWgpLGEmJmMmJmwpe2NvbnN0e2NlbnRlclg6eSxjZW50ZXJZOmcsd2lkdGg6UCxoZWlnaHQ6ayx1bmlmb3JtU2NhbGU6T309Zi5vcHQ7aWYoTyl7Y29uc3Qgdj1NYXRoLm1pbihsWzBdLGxbMV0pO2Yub3B0LnNjYWxlPVt2LHZdfWVsc2UgZi5vcHQuc2NhbGU9bDtmLm9wdC53aWR0aD1NYXRoLmZsb29yKFAqbFswXSksZi5vcHQuaGVpZ2h0PU1hdGguZmxvb3IoaypsWzFdKTtjb25zdCBJPVtjWzBdL3cud29ybGRTY2FsaW5nWzBdLGNbMV0vdy53b3JsZFNjYWxpbmdbMV1dO2Yub3B0LmNlbnRlclg9eStJWzBdLGYub3B0LmNlbnRlclk9ZytJWzFdO2NvbnN0IGI9W2YuY2VudGVyUG9zWzBdK0lbMF0sZi5jZW50ZXJQb3NbMV0rSVsxXV07aWYoZi5jZW50ZXJQb3M9YixzKXtsZXQgdj1JcihmLnJlY3QsbCk7dj1DZSh2LEkpLGYucmVjdD12fX1lbHNlIGlmKG4pe2NvbnN0IHk9W25bMF0vdy53b3JsZFNjYWxpbmdbMF0sblsxXS93LndvcmxkU2NhbGluZ1sxXV07aWYoZi5vcHQuY2VudGVyWD1mLm9wdC5jZW50ZXJYK3lbMF0sZi5vcHQuY2VudGVyWT1mLm9wdC5jZW50ZXJZK3lbMV0sZi5jZW50ZXJQb3M9W2YuY2VudGVyUG9zWzBdK3lbMF0sZi5jZW50ZXJQb3NbMV0reVsxXV0scyl7Y29uc3QgZz1DZShmLnJlY3QseSk7Zi5yZWN0PWd9fWVsc2UgaWYoaGUodSkmJih0LnNldEF0dHJpYnV0ZSgicm90YXRlIix1KSxmLm9wdC5yb3RhdGU9dSxzKSl7Y29uc3QgeT1UcihmLnJlY3QsdSk7Zi5yZWN0PXl9cmV0dXJuIGYmJmkuc2V0SW5mbyh0Lm5hbWUsZiksZj09bnVsbD92b2lkIDA6Zi5yZWN0fX19Y2xhc3MgS3IgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmJvdGh9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5TdHJhaWdodH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN0cmFpZ2h0VGlwV2lkdGgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN0cmFpZ2h0VGlwV2lkdGg9dGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MvMix0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnV9KSxkPUEoaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOml9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIGs7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cn09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoTz0+Ty5yZW1vdmUoKSksKGs9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxrLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChPPT5PLnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjppLHRoaWNrbmVzczpzLHpJbmRleDpuLHNjYWxlOmEscm90YXRlOmwsdHJhbnNsYXRlOmN9PXRoaXMud29ya09wdGlvbnMsdT1yLndvcmxkUG9zaXRpb24saD1yLndvcmxkU2NhbGluZyx7ZCxyZWN0OmZ9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhzKSx3PVtmLngrZi53LzIsZi55K2YuaC8yXSx5PXtwb3M6dyxuYW1lOnQsaWQ6dCxkLGZpbGxDb2xvcjppLHN0cm9rZUNvbG9yOmksbGluZVdpZHRoOjAsY2xhc3NOYW1lOmAke3dbMF19LCR7d1sxXX1gLG5vcm1hbGl6ZTohMCx6SW5kZXg6bn07YSYmKHkuc2NhbGU9YSksbCYmKHkucm90YXRlPWwpLGMmJih5LnRyYW5zbGF0ZT1jKTtjb25zdCBnPW5ldyB6LlBhdGgoeSk7aWYoci5hcHBlbmQoZyksbHx8YXx8Yyl7Y29uc3QgTz1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoTy54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihPLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKE8ud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoTy5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJue3g6TWF0aC5mbG9vcihmLngqaFswXSt1WzBdLXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihmLnkqaFsxXSt1WzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihmLncqaFswXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcihmLmgqaFsxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfX1jb21wdXREcmF3UG9pbnRzKGUpe3JldHVybiB0aGlzLnRtcFBvaW50c1sxXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1swXSk+dGhpcy5zdHJhaWdodFRpcFdpZHRoP3RoaXMuY29tcHV0RnVsbFBvaW50cyhlKTp0aGlzLmNvbXB1dERvdFBvaW50cyhlKX1jb21wdXRGdWxsUG9pbnRzKGUpe2NvbnN0IHQ9cC5TdWIodGhpcy50bXBQb2ludHNbMV0sdGhpcy50bXBQb2ludHNbMF0pLnVuaSgpLHI9cC5QZXIodCkubXVsKGUvMiksaT1SLlN1Yih0aGlzLnRtcFBvaW50c1swXSxyKSxzPVIuQWRkKHRoaXMudG1wUG9pbnRzWzBdLHIpLG49Ui5TdWIodGhpcy50bXBQb2ludHNbMV0sciksYT1SLkFkZCh0aGlzLnRtcFBvaW50c1sxXSxyKSxsPVIuR2V0U2VtaWNpcmNsZVN0cm9rZSh0aGlzLnRtcFBvaW50c1sxXSxuLC0xLDgpLGM9Ui5HZXRTZW1pY2lyY2xlU3Ryb2tlKHRoaXMudG1wUG9pbnRzWzBdLHMsLTEsOCksdT1baSxuLC4uLmwsYSxzLC4uLmNdO3JldHVybntkOnhlKHUsITApLHJlY3Q6Ryh1KSxpc0RvdDohMSxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fWNvbXB1dERvdFBvaW50cyhlKXtjb25zdCB0PVIuR2V0RG90U3Ryb2tlKHRoaXMudG1wUG9pbnRzWzBdLGUvMiw4KTtyZXR1cm57ZDp4ZSh0LCEwKSxyZWN0OkcodCksaXNEb3Q6ITAscG9zOnRoaXMudG1wUG9pbnRzWzBdLlhZfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscykpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6c30pO3JldHVybiB0aGlzLm9sZFJlY3Q9bix0aGlzLnZOb2Rlcy5zZXRJbmZvKGkse3JlY3Q6bixvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSksbn1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBhO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6c309cixuPWkuZ2V0KHQubmFtZSk7cmV0dXJuIHMmJih0LnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHQuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLHMpLChhPW49PW51bGw/dm9pZCAwOm4ub3B0KSE9bnVsbCYmYS5zdHJva2VDb2xvciYmKG4ub3B0LnN0cm9rZUNvbG9yPXMpKSxuJiZpLnNldEluZm8odC5uYW1lLG4pLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgTmUgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlRleHR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdH1jb25zdW1lKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1jb25zdW1lQWxsKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1kcmF3KGUpe3ZhciB3O2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3TGFiZWw6aX09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoeT0+eS5yZW1vdmUoKSksKHc9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHx3LmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh5PT55LnJlbW92ZSgpKTtjb25zdHtib3hTaXplOnMsYm94UG9pbnQ6bix6SW5kZXg6YX09dGhpcy53b3JrT3B0aW9ucyxsPXIud29ybGRQb3NpdGlvbixjPXIud29ybGRTY2FsaW5nO2lmKCFufHwhcylyZXR1cm47Y29uc3QgdT1uZXcgei5Hcm91cCh7bmFtZTp0LGlkOnQscG9zOltuWzBdK3NbMF0vMixuWzFdK3NbMV0vMl0sYW5jaG9yOlsuNSwuNV0sc2l6ZTpzLHpJbmRleDphfSksaD17eDpuWzBdLHk6blsxXSx3OnNbMF0saDpzWzFdfSxkPW5ldyB6LlJlY3Qoe25vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc2l6ZTpzfSksZj1pJiZOZS5jcmVhdGVMYWJlbHModGhpcy53b3JrT3B0aW9ucyxyKXx8W107cmV0dXJuIHUuYXBwZW5kKC4uLmYsZCksci5hcHBlbmQodSkse3g6TWF0aC5mbG9vcihoLngqY1swXStsWzBdKSx5Ok1hdGguZmxvb3IoaC55KmNbMV0rbFsxXSksdzpNYXRoLmZsb29yKGgudypjWzBdKSxoOk1hdGguZmxvb3IoaC5oKmNbMV0pfX1jb25zdW1lU2VydmljZShlKXt2YXIgbCxjO2NvbnN0IHQ9KGw9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXQpcmV0dXJuO2NvbnN0e2lzRnVsbFdvcms6cixyZXBsYWNlSWQ6aSxpc0RyYXdMYWJlbDpzfT1lO3RoaXMub2xkUmVjdD1pJiYoKGM9dGhpcy52Tm9kZXMuZ2V0KGkpKT09bnVsbD92b2lkIDA6Yy5yZWN0KXx8dm9pZCAwO2NvbnN0IG49cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsYT10aGlzLmRyYXcoe3dvcmtJZDp0LGxheWVyOm4saXNEcmF3TGFiZWw6c30pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHQse3JlY3Q6YSxvcDpbXSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6YSYmeC5nZXRDZW50ZXJQb3MoYSxuKX0pLGF9dXBkYXRhT3B0U2VydmljZShlKXtpZighdGhpcy53b3JrSWQpcmV0dXJuO2NvbnN0IHQ9dGhpcy53b3JrSWQudG9TdHJpbmcoKSx7Zm9udENvbG9yOnIsZm9udEJnQ29sb3I6aSxib2xkOnMsaXRhbGljOm4sbGluZVRocm91Z2g6YSx1bmRlcmxpbmU6bCx6SW5kZXg6Y309ZSx1PXRoaXMudk5vZGVzLmdldCh0KTtpZighdSlyZXR1cm47ciYmKHUub3B0LmZvbnRDb2xvcj1yKSxpJiYodS5vcHQuZm9udEJnQ29sb3I9aSkscyYmKHUub3B0LmJvbGQ9cyksbiYmKHUub3B0Lml0YWxpYz1uKSx3ZShhKSYmKHUub3B0LmxpbmVUaHJvdWdoPWEpLHdlKGwpJiYodS5vcHQudW5kZXJsaW5lPWwpLGkmJih1Lm9wdC5mb250QmdDb2xvcj1pKSxoZShjKSYmKHUub3B0LnpJbmRleD1jKSx0aGlzLm9sZFJlY3Q9dS5yZWN0O2NvbnN0IGg9dGhpcy5kcmF3KHt3b3JrSWQ6dCxsYXllcjp0aGlzLmZ1bGxMYXllcixpc0RyYXdMYWJlbDohMX0pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHQse3JlY3Q6aCxvcDpbXSxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6aCYmeC5nZXRDZW50ZXJQb3MoaCx0aGlzLmZ1bGxMYXllcil9KSxofWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIGdldEZvbnRXaWR0aChlKXtjb25zdHtjdHg6dCxvcHQ6cix0ZXh0Oml9PWUse2JvbGQ6cyxpdGFsaWM6bixmb250U2l6ZTphLGZvbnRGYW1pbHk6bH09cjtyZXR1cm4gdC5mb250PWAke3N9ICR7bn0gJHthfXB4ICR7bH1gLHQubWVhc3VyZVRleHQoaSkud2lkdGh9c3RhdGljIGNyZWF0ZUxhYmVscyhlLHQpe2NvbnN0IHI9W10saT1lLnRleHQuc3BsaXQoIiwiKSxzPWkubGVuZ3RoO2ZvcihsZXQgbj0wO248cztuKyspe2NvbnN0IGE9aVtuXSx7Zm9udFNpemU6bCxsaW5lSGVpZ2h0OmMsYm9sZDp1LHRleHRBbGlnbjpoLGl0YWxpYzpkLGJveFNpemU6Zixmb250RmFtaWx5OncsdmVydGljYWxBbGlnbjp5LGZvbnRDb2xvcjpnLHVuZGVybGluZTpQLGxpbmVUaHJvdWdoOmt9PWUsTz1jfHxsKjEuMixJPXQmJnQucGFyZW50LmNhbnZhcy5nZXRDb250ZXh0KCIyZCIpLGI9SSYmTmUuZ2V0Rm9udFdpZHRoKHt0ZXh0OmEsb3B0OmUsY3R4Okksd29ybGRTY2FsaW5nOnQud29ybGRTY2FsaW5nfSk7aWYoYil7Y29uc3Qgdj17YW5jaG9yOlswLC41XSx0ZXh0OmEsZm9udFNpemU6bCxsaW5lSGVpZ2h0Ok8sZm9udEZhbWlseTp3LGZvbnRXZWlnaHQ6dSxmaWxsQ29sb3I6Zyx0ZXh0QWxpZ246aCxmb250U3R5bGU6ZCxuYW1lOm4udG9TdHJpbmcoKSxjbGFzc05hbWU6ImxhYmVsIn0sTD1bMCwwXTtpZih5PT09Im1pZGRsZSIpe2NvbnN0IE09KHMtMSkvMjtMWzFdPShuLU0pKk99aD09PSJsZWZ0IiYmKExbMF09ZiYmLWZbMF0vMis1fHwwKSx2LnBvcz1MO2NvbnN0IFQ9bmV3IHouTGFiZWwodik7aWYoci5wdXNoKFQpLFApe2NvbnN0IE09e25vcm1hbGl6ZTohMSxwb3M6W3YucG9zWzBdLHYucG9zWzFdK2wvMl0sbGluZVdpZHRoOjIqdC53b3JsZFNjYWxpbmdbMF0scG9pbnRzOlswLDAsYiwwXSxzdHJva2VDb2xvcjpnLG5hbWU6YCR7bn1fdW5kZXJsaW5lYCxjbGFzc05hbWU6InVuZGVybGluZSJ9LCQ9bmV3IHouUG9seWxpbmUoTSk7ci5wdXNoKCQpfWlmKGspe2NvbnN0IE09e25vcm1hbGl6ZTohMSxwb3M6di5wb3MsbGluZVdpZHRoOjIqdC53b3JsZFNjYWxpbmdbMF0scG9pbnRzOlswLDAsYiwwXSxzdHJva2VDb2xvcjpnLG5hbWU6YCR7bn1fbGluZVRocm91Z2hgLGNsYXNzTmFtZToibGluZVRocm91Z2gifSwkPW5ldyB6LlBvbHlsaW5lKE0pO3IucHVzaCgkKX19fXJldHVybiByfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aSx0YXJnZXROb2RlOnN9PWUse2ZvbnRCZ0NvbG9yOm4sZm9udENvbG9yOmEsdHJhbnNsYXRlOmwsYm94OmMsYm94U2NhbGU6dSxib3hUcmFuc2xhdGU6aCxib2xkOmQsaXRhbGljOmYsbGluZVRocm91Z2g6dyx1bmRlcmxpbmU6eSxmb250U2l6ZTpnLHRleHRJbmZvczpQfT1yLGs9cyYmcmUocyl8fGkuZ2V0KHQubmFtZSk7aWYoIWspcmV0dXJuO2NvbnN0IE89dC5wYXJlbnQ7aWYoIU8pcmV0dXJuO2NvbnN0IEk9ay5vcHQ7aWYoYSYmSS5mb250Q29sb3ImJihJLmZvbnRDb2xvcj1hKSxuJiZJLmZvbnRCZ0NvbG9yJiYoSS5mb250QmdDb2xvcj1uKSxkJiYoSS5ib2xkPWQpLGYmJihJLml0YWxpYz1mKSx3ZSh3KSYmKEkubGluZVRocm91Z2g9dyksd2UoeSkmJihJLnVuZGVybGluZT15KSxnJiYoSS5mb250U2l6ZT1nKSxjJiZoJiZ1KXtjb25zdCBiPVA9PW51bGw/dm9pZCAwOlAuZ2V0KHQubmFtZSk7aWYoYil7Y29uc3R7Zm9udFNpemU6VCxib3hTaXplOk19PWI7SS5ib3hTaXplPU18fEkuYm94U2l6ZSxJLmZvbnRTaXplPVR8fEkuZm9udFNpemV9Y29uc3Qgdj1rLnJlY3QsTD1DZShJcih2LHUpLGgpO0kuYm94UG9pbnQ9TCYmWyhMLngtTy53b3JsZFBvc2l0aW9uWzBdKS9PLndvcmxkU2NhbGluZ1swXSwoTC55LU8ud29ybGRQb3NpdGlvblsxXSkvTy53b3JsZFNjYWxpbmdbMV1dfWVsc2UgaWYobCYmSS5ib3hQb2ludCl7Y29uc3QgYj1bbFswXS9PLndvcmxkU2NhbGluZ1swXSxsWzFdL08ud29ybGRTY2FsaW5nWzFdXTtJLmJveFBvaW50PVtJLmJveFBvaW50WzBdK2JbMF0sSS5ib3hQb2ludFsxXStiWzFdXSxrLmNlbnRlclBvcz1bay5jZW50ZXJQb3NbMF0rYlswXSxrLmNlbnRlclBvc1sxXStiWzFdXSxrLnJlY3Q9Q2Uoay5yZWN0LGIpfXJldHVybiBrJiZpLnNldEluZm8odC5uYW1lLGspLGs9PW51bGw/dm9pZCAwOmsucmVjdH1zdGF0aWMgZ2V0UmVjdEZyb21MYXllcihlLHQpe2NvbnN0IHI9ZS5nZXRFbGVtZW50c0J5TmFtZSh0KVswXTtpZihyKXtjb25zdCBpPXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcihpLngpLHk6TWF0aC5mbG9vcihpLnkpLHc6TWF0aC5mbG9vcihpLndpZHRoKSxoOk1hdGguZmxvb3IoaS5oZWlnaHQpfX19fWZ1bmN0aW9uIFZyKG8pe3N3aXRjaChvKXtjYXNlIFMuQXJyb3c6cmV0dXJuIFhyO2Nhc2UgUy5QZW5jaWw6cmV0dXJuIENyO2Nhc2UgUy5TdHJhaWdodDpyZXR1cm4gS3I7Y2FzZSBTLkVsbGlwc2U6cmV0dXJuIEhyO2Nhc2UgUy5Qb2x5Z29uOmNhc2UgUy5UcmlhbmdsZTpyZXR1cm4gWnI7Y2FzZSBTLlN0YXI6Y2FzZSBTLlJob21idXM6cmV0dXJuIHFyO2Nhc2UgUy5SZWN0YW5nbGU6cmV0dXJuIFlyO2Nhc2UgUy5TcGVlY2hCYWxsb29uOnJldHVybiBRcjtjYXNlIFMuVGV4dDpyZXR1cm4gTmU7Y2FzZSBTLkxhc2VyUGVuOnJldHVybiBOcjtjYXNlIFMuRXJhc2VyOnJldHVybiBuZTtjYXNlIFMuU2VsZWN0b3I6cmV0dXJuIEU7Y2FzZSBTLkltYWdlOnJldHVybiBKcn19ZnVuY3Rpb24gYnQobyxlKXtjb25zdHt0b29sc1R5cGU6dCwuLi5yfT1vO3N3aXRjaCh0KXtjYXNlIFMuQXJyb3c6cmV0dXJuIG5ldyBYcihyKTtjYXNlIFMuUGVuY2lsOnJldHVybiBuZXcgQ3Iocik7Y2FzZSBTLlN0cmFpZ2h0OnJldHVybiBuZXcgS3Iocik7Y2FzZSBTLkVsbGlwc2U6cmV0dXJuIG5ldyBIcihyKTtjYXNlIFMuUG9seWdvbjpjYXNlIFMuVHJpYW5nbGU6cmV0dXJuIG5ldyBacihyKTtjYXNlIFMuU3RhcjpjYXNlIFMuUmhvbWJ1czpyZXR1cm4gbmV3IHFyKHIpO2Nhc2UgUy5SZWN0YW5nbGU6cmV0dXJuIG5ldyBZcihyKTtjYXNlIFMuU3BlZWNoQmFsbG9vbjpyZXR1cm4gbmV3IFFyKHIpO2Nhc2UgUy5UZXh0OnJldHVybiBuZXcgTmUocik7Y2FzZSBTLkxhc2VyUGVuOnJldHVybiBuZXcgTnIocik7Y2FzZSBTLkVyYXNlcjpyZXR1cm4gbmV3IG5lKHIsZSk7Y2FzZSBTLlNlbGVjdG9yOnJldHVybiBuZXcgRShyKTtjYXNlIFMuSW1hZ2U6cmV0dXJuIG5ldyBKcihyKTtkZWZhdWx0OnJldHVybn19ZnVuY3Rpb24gZW8obyl7Y29uc3QgZT1bXSx0PVsiUEFUSCIsIlNQUklURSIsIlBPTFlMSU5FIiwiUkVDVCIsIkVMTElQU0UiXTtmb3IoY29uc3QgciBvZiBvKXtpZihyLnRhZ05hbWU9PT0iR1JPVVAiJiZyLmNoaWxkcmVuLmxlbmd0aClyZXR1cm4gZW8oci5jaGlsZHJlbik7ci50YWdOYW1lJiZ0LmluY2x1ZGVzKHIudGFnTmFtZSkmJmUucHVzaChyKX1yZXR1cm4gZX1jbGFzcyBwZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuWkluZGV4QWN0aXZlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOml9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLCEwfWNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYSxsLGMsdSxoO2NvbnN0e3dvcmtJZDp0LGlzQWN0aXZlWkluZGV4OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppfT1lO2lmKHQhPT1FLnNlbGVjdG9ySWQpcmV0dXJuO2NvbnN0IHM9KGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLndvcmtTaGFwZXMuZ2V0KEUuc2VsZWN0b3JJZCk7aWYoIXMpcmV0dXJuO2NvbnN0IG49cy5vbGRTZWxlY3RSZWN0O2lmKHImJm4mJnRoaXMubG9jYWxXb3JrKXtjb25zdCBkPW5ldyBTZXQ7aWYodGhpcy5sb2NhbFdvcmsudk5vZGVzLmN1ck5vZGVNYXAuZm9yRWFjaCgoZix3KT0+e1BlKG4sZi5yZWN0KSYmZC5hZGQodyl9KSxkLnNpemUpe2NvbnN0IGY9W107ZC5mb3JFYWNoKHc9Pnt2YXIgeTsoeT10aGlzLmxvY2FsV29yayk9PW51bGx8fHkuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHcpLmZvckVhY2goZz0+e3ZhciBrLE87Y29uc3QgUD1nLmNsb25lTm9kZSghMCk7SGUoZykmJlAuc2VhbCgpLChPPShrPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6ay5kcmF3TGF5ZXIpIT1udWxsJiZPLmdldEVsZW1lbnRzQnlOYW1lKHcpLmxlbmd0aHx8Zi5wdXNoKFApfSl9KSxmLmxlbmd0aCYmKChsPXRoaXMubG9jYWxXb3JrLmRyYXdMYXllcik9PW51bGx8fGwuYXBwZW5kKC4uLmYpKX19ZWxzZSh1PShjPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6Yy5kcmF3TGF5ZXIpPT1udWxsfHx1LmNoaWxkcmVuLmZpbHRlcihkPT57dmFyIGY7cmV0dXJuISgoZj1zLnNlbGVjdElkcykhPW51bGwmJmYuaW5jbHVkZXMoZC5uYW1lKSl9KS5mb3JFYWNoKGQ9PmQucmVtb3ZlKCkpO2kmJigoaD10aGlzLmxvY2FsV29yayk9PW51bGx8fGguX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6bixkcmF3Q2FudmFzOk4uU2VsZWN0b3IsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcixpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMubG9jYWxXb3JrLnZpZXdJZH1dLHNwOlt7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsb3B0OnMuZ2V0V29ya09wdGlvbnMoKSxzZWxlY3RSZWN0Om4sc3Ryb2tlQ29sb3I6cy5zdHJva2VDb2xvcixmaWxsQ29sb3I6cy5maWxsQ29sb3Isd2lsbFN5bmNTZXJ2aWNlOiExLGlzU3luYzohMH1dfSkpfX1jbGFzcyB5ZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuQ29weU5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5GdWxsV29yayYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIHI7Y29uc3R7d29ya0lkOnR9PWU7dCYmYXdhaXQoKHI9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpyLmNvbnN1bWVGdWxsKGUsdGhpcy5zY2VuZSkpfX1jbGFzcyB3ZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2V0Q29sb3JOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bix0ZXh0VXBkYXRlRm9yV29rZXI6YSxjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOml9PWUse3dpbGxTeW5jU2VydmljZTpzLGlzU3luYzpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT10LGw9ci5yZW5kZXJ8fFtdLGM9ci5zcHx8W107aWYocylmb3IoY29uc3RbdSxoXW9mIGkuZW50cmllcygpKWEmJmgudG9vbHNUeXBlPT09Uy5UZXh0P2MucHVzaCh7Li4uaCx3b3JrSWQ6dSx0eXBlOm0uVGV4dFVwZGF0ZSxkYXRhVHlwZTpXLkxvY2FsLHdpbGxTeW5jU2VydmljZTohMH0pOmMucHVzaCh7Li4uaCx3b3JrSWQ6dSx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpufSk7cmV0dXJue3JlbmRlcjpsLHNwOmN9fX1jbGFzcyBtZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuWkluZGV4Tm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGE7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpufT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChhPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6YS51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOml9PWUse3dpbGxTeW5jU2VydmljZTpzLGlzU3luYzpufT10LGE9ci5yZW5kZXJ8fFtdLGw9ci5zcHx8W107aWYocyYmbClmb3IoY29uc3RbYyx1XW9mIGkuZW50cmllcygpKWwucHVzaCh7Li4udSx3b3JrSWQ6Yyx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpufSk7cmV0dXJue3JlbmRlcjphLHNwOmx9fX1jbGFzcyBnZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuVHJhbnNsYXRlTm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKS5maW5hbGx5KCgpPT57cyYmc2V0VGltZW91dCgoKT0+e3ZhciBuOyhuPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8bi5fcG9zdCh7c3A6W3t0eXBlOm0uTm9uZSx1bmRvVGlja2VySWQ6c31dfSl9LDApfSksITB9YXN5bmMgY29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBjLHU7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphLGVtaXRFdmVudFR5cGU6bH09ZTt0PT09RS5zZWxlY3RvcklkJiZyJiYoci53b3JrU3RhdGU9PT1GLkRvbmUmJihyIT1udWxsJiZyLnRyYW5zbGF0ZSkmJihyLnRyYW5zbGF0ZVswXXx8ci50cmFuc2xhdGVbMV0pfHxyLndvcmtTdGF0ZSE9PUYuRG9uZT9hd2FpdCgoYz10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmMudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4saXNTeW5jOiEwLHRleHRVcGRhdGVGb3JXb2tlcjphLGVtaXRFdmVudFR5cGU6bCxzY2VuZTp0aGlzLnNjZW5lLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKTpyLndvcmtTdGF0ZT09PUYuRG9uZSYmKCh1PXRoaXMubG9jYWxXb3JrKT09bnVsbHx8dS52Tm9kZXMuZGVsZXRlTGFzdFRhcmdldCgpKSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOmksd29ya1NoYXBlTm9kZTpzLHJlczpufT1lLHt3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCx1cGRhdGVTZWxlY3Rvck9wdDpjLHdpbGxTZXJpYWxpemVEYXRhOnUsdGV4dFVwZGF0ZUZvcldva2VyOmh9PXQsZD1jLndvcmtTdGF0ZSxmPXIucmVuZGVyfHxbXSx3PXIuc3B8fFtdO2lmKGQ9PT1GLlN0YXJ0KXJldHVybntzcDpbXSxyZW5kZXI6W119O2NvbnN0IHk9bj09bnVsbD92b2lkIDA6bi5zZWxlY3RSZWN0O2lmKGEpe2lmKHUpe2NvbnN0IGc9cy5nZXRDaGlsZHJlblBvaW50cygpO2cmJncucHVzaCh7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsc2VsZWN0UmVjdDp5LHdpbGxTeW5jU2VydmljZTohMSxpc1N5bmM6bCxwb2ludHM6Z30pfWZvcihjb25zdFtnLFBdb2YgaS5lbnRyaWVzKCkpaCYmUC50b29sc1R5cGU9PT1TLlRleHQ/dy5wdXNoKHsuLi5QLHdvcmtJZDpnLHR5cGU6bS5UZXh0VXBkYXRlLGRhdGFUeXBlOlcuTG9jYWwsd2lsbFN5bmNTZXJ2aWNlOiEwfSk6dy5wdXNoKHsuLi5QLHdvcmtJZDpnLHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOmx9KX1yZXR1cm57cmVuZGVyOmYsc3A6d319fWNsYXNzIGJmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5EZWxldGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOml9PWU7aWYodD09PW0uUmVtb3ZlTm9kZSl7aWYocj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLCEwO2lmKHI9PT1XLlNlcnZpY2UmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvclNlcnZpY2VXb3JrZXIoZSksITB9fWNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXtpZighdGhpcy5sb2NhbFdvcmspcmV0dXJuO2NvbnN0e3JlbW92ZUlkczp0LHdpbGxSZWZyZXNoOnIsd2lsbFN5bmNTZXJ2aWNlOmksdmlld0lkOnN9PWU7aWYoISh0IT1udWxsJiZ0Lmxlbmd0aCkpcmV0dXJuO2xldCBuO2NvbnN0IGE9W10sbD1bXSxjPVtdO2Zvcihjb25zdCB1IG9mIHQpe2lmKHU9PT1FLnNlbGVjdG9ySWQpe2NvbnN0IGQ9dGhpcy5sb2NhbFdvcmsud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighZClyZXR1cm47Y29uc3QgZj1kLnNlbGVjdElkcyYmWy4uLmQuc2VsZWN0SWRzXXx8W107Zm9yKGNvbnN0IHkgb2YgZil7aWYodGhpcy5sb2NhbFdvcmsudk5vZGVzLmdldCh5KSl7Y29uc3QgUD10aGlzLmNvbW1hbmREZWxldGVUZXh0KHkpO1AmJmEucHVzaChQKX1uPUEobix0aGlzLmxvY2FsV29yay5yZW1vdmVOb2RlKHkpKSxjLnB1c2goeSl9Y29uc3Qgdz1kPT1udWxsP3ZvaWQgMDpkLnVwZGF0ZVNlbGVjdElkcyhbXSk7bj1BKG4sdy5iZ1JlY3QpLHRoaXMubG9jYWxXb3JrLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKEUuc2VsZWN0b3JJZCksdGhpcy5sb2NhbFdvcmsud29ya1NoYXBlcy5kZWxldGUoRS5zZWxlY3RvcklkKSxhLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOltdLHdpbGxTeW5jU2VydmljZTppfSk7Y29udGludWV9Y29uc3QgaD10aGlzLmNvbW1hbmREZWxldGVUZXh0KHUpO2gmJmEucHVzaChoKSxuPUEobix0aGlzLmxvY2FsV29yay5yZW1vdmVOb2RlKHUpKSxjLnB1c2godSl9aSYmYS5wdXNoKHt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6Yyx1bmRvVGlja2VySWQ6ZS51bmRvVGlja2VySWR9KSxuJiZyJiZsLnB1c2goe3JlY3Q6bixkcmF3Q2FudmFzOk4uQmcsY2xlYXJDYW52YXM6Ti5CZyxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsdmlld0lkOnN9KSwobC5sZW5ndGh8fGEubGVuZ3RoKSYmdGhpcy5sb2NhbFdvcmsuX3Bvc3Qoe3JlbmRlcjpsLHNwOmF9KX1jb25zdW1lRm9yU2VydmljZVdvcmtlcihlKXt0aGlzLnNlcnZpY2VXb3JrJiZ0aGlzLnNlcnZpY2VXb3JrLnJlbW92ZVNlbGVjdFdvcmsoZSl9Y29tbWFuZERlbGV0ZVRleHQoZSl7dmFyIHI7Y29uc3QgdD0ocj10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOnIudk5vZGVzLmdldChlKTtpZih0JiZ0LnRvb2xzVHlwZT09PVMuVGV4dClyZXR1cm57dHlwZTptLlRleHRVcGRhdGUsdG9vbHNUeXBlOlMuVGV4dCx3b3JrSWQ6ZSxkYXRhVHlwZTpXLkxvY2FsfX19Y2xhc3MgdmYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNjYWxlTm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKS5maW5hbGx5KCgpPT57cyYmc2V0VGltZW91dCgoKT0+e3ZhciBuOyhuPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8bi5fcG9zdCh7c3A6W3t0eXBlOm0uTm9uZSx1bmRvVGlja2VySWQ6c31dfSl9LDApfSksITB9YXN5bmMgY29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBuO2NvbnN0e3dvcmtJZDp0LHVwZGF0ZU5vZGVPcHQ6cix3aWxsU3luY1NlcnZpY2U6aSx3aWxsU2VyaWFsaXplRGF0YTpzfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChuPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bi51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsU3luY1NlcnZpY2U6aSx3aWxsU2VyaWFsaXplRGF0YTpzLGlzU3luYzohMCxzY2VuZTp0aGlzLnNjZW5lLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFjay5iaW5kKHRoaXMpfSkpfXVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2soZSl7Y29uc3R7cGFyYW06dCxwb3N0RGF0YTpyLHdvcmtTaGFwZU5vZGU6aSxyZXM6cyxuZXdTZXJ2aWNlU3RvcmU6bn09ZSx7dXBkYXRlU2VsZWN0b3JPcHQ6YSx3aWxsU3luY1NlcnZpY2U6bCx3aWxsU2VyaWFsaXplRGF0YTpjfT10LHU9YS53b3JrU3RhdGUsaD1yLnJlbmRlcnx8W10sZD1yLnNwfHxbXSxmPXM9PW51bGw/dm9pZCAwOnMuc2VsZWN0UmVjdCx3PXM9PW51bGw/dm9pZCAwOnMucmVuZGVyUmVjdDtpZih1PT09Ri5TdGFydClyZXR1cm57c3A6W10scmVuZGVyOltdfTtpZih0aGlzLmxvY2FsV29yayl7aC5wdXNoKHtpc0NsZWFyQWxsOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcix2aWV3SWQ6dGhpcy5sb2NhbFdvcmsudmlld0lkfSk7Y29uc3QgeT17cmVjdDp3LGlzRnVsbFdvcms6ITEsZHJhd0NhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLmxvY2FsV29yay52aWV3SWR9O2gucHVzaCh5KX1pZihsKXt1PT09Ri5Eb2luZyYmZC5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczppLnNlbGVjdElkcyxzZWxlY3RSZWN0OmYsd2lsbFN5bmNTZXJ2aWNlOiEwLGlzU3luYzohMCxwb2ludHM6aS5nZXRDaGlsZHJlblBvaW50cygpLHRleHRPcHQ6aS50ZXh0T3B0fSksYyYmdT09PUYuRG9uZSYmZC5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczppLnNlbGVjdElkcyxzZWxlY3RSZWN0OmYsd2lsbFN5bmNTZXJ2aWNlOiExLGlzU3luYzohMCxwb2ludHM6aS5nZXRDaGlsZHJlblBvaW50cygpLHRleHRPcHQ6aS50ZXh0T3B0fSk7Zm9yKGNvbnN0W3ksZ11vZiBuLmVudHJpZXMoKSlnLnRvb2xzVHlwZT09PVMuVGV4dD9kLnB1c2goey4uLmcsd29ya0lkOnksdHlwZTptLlRleHRVcGRhdGUsZGF0YVR5cGU6Vy5Mb2NhbCx3aWxsU3luY1NlcnZpY2U6ITB9KTpkLnB1c2goey4uLmcsd29ya0lkOnksdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6ITB9KX1yZXR1cm57cmVuZGVyOmgsc3A6ZH19fWNsYXNzIFNmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5Sb3RhdGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGVtaXRFdmVudFR5cGU6YX09ZTt0PT09RS5zZWxlY3RvcklkJiZyJiZhd2FpdCgobD10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmwudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sZW1pdEV2ZW50VHlwZTphLGlzU3luYzohMCxzY2VuZTp0aGlzLnNjZW5lLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cix3b3JrU2hhcGVOb2RlOmkscmVzOnMsbmV3U2VydmljZVN0b3JlOm59PWUse3VwZGF0ZVNlbGVjdG9yT3B0OmEsd2lsbFN5bmNTZXJ2aWNlOmwsd2lsbFNlcmlhbGl6ZURhdGE6Yyxpc1N5bmM6dX09dCxoPWEud29ya1N0YXRlLGQ9ci5yZW5kZXJ8fFtdLGY9ci5zcHx8W10sdz1zPT1udWxsP3ZvaWQgMDpzLnNlbGVjdFJlY3Q7aWYobCl7YyYmaD09PUYuRG9uZSYmZi5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczppLnNlbGVjdElkcyxzZWxlY3RSZWN0Oncsd2lsbFN5bmNTZXJ2aWNlOiEwLGlzU3luYzp1LHBvaW50czppLmdldENoaWxkcmVuUG9pbnRzKCl9KTtmb3IoY29uc3RbeSxnXW9mIG4uZW50cmllcygpKWYucHVzaCh7Li4uZyx3b3JrSWQ6eSx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzp1fSl9cmV0dXJue3JlbmRlcjpkLHNwOmZ9fX1jbGFzcyBrZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2V0Rm9udFN0eWxlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bix0ZXh0VXBkYXRlRm9yV29rZXI6YSxjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOmksd29ya1NoYXBlTm9kZTpzLHJlczpufT1lLHt3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCx1cGRhdGVTZWxlY3Rvck9wdDpjLHRleHRVcGRhdGVGb3JXb2tlcjp1fT10LGg9ci5yZW5kZXJ8fFtdLGQ9ci5zcHx8W10sZj1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSYmZCl7Yy5mb250U2l6ZSYmZC5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxzZWxlY3RSZWN0OmYsd2lsbFN5bmNTZXJ2aWNlOmEsaXNTeW5jOmwscG9pbnRzOnMuZ2V0Q2hpbGRyZW5Qb2ludHMoKX0pO2Zvcihjb25zdFt3LHldb2YgaS5lbnRyaWVzKCkpdSYmeS50b29sc1R5cGU9PT1TLlRleHQ/ZC5wdXNoKHsuLi55LHdvcmtJZDp3LHR5cGU6bS5UZXh0VXBkYXRlLGRhdGFUeXBlOlcuTG9jYWwsd2lsbFN5bmNTZXJ2aWNlOiEwfSk6ZC5wdXNoKHsuLi55LHdvcmtJZDp3LHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOmx9KX1yZXR1cm57cmVuZGVyOmgsc3A6ZH19fWNsYXNzIFBmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRQb2ludH0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLlVwZGF0ZU5vZGUmJnI9PT1XLkxvY2FsJiZpPT09dGhpcy5lbWl0RXZlbnRUeXBlKXJldHVybiB0aGlzLmNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKS5maW5hbGx5KCgpPT57cyYmc2V0VGltZW91dCgoKT0+e3ZhciBuOyhuPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8bi5fcG9zdCh7c3A6W3t0eXBlOm0uTm9uZSx1bmRvVGlja2VySWQ6c31dfSl9LDApfSksITB9YXN5bmMgY29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBsO2NvbnN0e3dvcmtJZDp0LHVwZGF0ZU5vZGVPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bix0ZXh0VXBkYXRlRm9yV29rZXI6YX09ZTt0PT09RS5zZWxlY3RvcklkJiZyJiZhd2FpdCgobD10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmwudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLGVtaXRFdmVudFR5cGU6dGhpcy5lbWl0RXZlbnRUeXBlLHdpbGxTZXJpYWxpemVEYXRhOm4saXNTeW5jOiEwLHRleHRVcGRhdGVGb3JXb2tlcjphLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsfT10LGM9ci5yZW5kZXJ8fFtdLHU9ci5zcHx8W10saD1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSYmdSl7Zm9yKGNvbnN0W2QsZl1vZiBpLmVudHJpZXMoKSl1LnB1c2goey4uLmYsd29ya0lkOmQsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pO3UucHVzaCh7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsc2VsZWN0UmVjdDpoLHdpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHBvaW50czpzLmdldENoaWxkcmVuUG9pbnRzKCl9KX1yZXR1cm57cmVuZGVyOmMsc3A6dX19fWNsYXNzIFRmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRMb2NrfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGE7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpufT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChhPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6YS51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOmksd29ya1NoYXBlTm9kZTpzLHJlczpufT1lLHt3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCx1cGRhdGVTZWxlY3Rvck9wdDpjfT10LHU9ci5yZW5kZXJ8fFtdLGg9ci5zcHx8W10sZD1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSYmaCl7Zm9yKGNvbnN0W2Ysd11vZiBpLmVudHJpZXMoKSloLnB1c2goey4uLncsd29ya0lkOmYsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pO2gucHVzaCh7aXNMb2NrZWQ6Yy5pc0xvY2tlZCxzZWxlY3RvckNvbG9yOnMuc2VsZWN0b3JDb2xvcixzY2FsZVR5cGU6cy5zY2FsZVR5cGUsY2FuUm90YXRlOnMuY2FuUm90YXRlLHR5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOnMuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6ZCx3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bH0pfXJldHVybntyZW5kZXI6dSxzcDpofX19Y2xhc3MgSWYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNldFNoYXBlT3B0fSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGE7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpufT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChhPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6YS51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixjYWxsYmFjazp0aGlzLnVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2t9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsbmV3U2VydmljZVN0b3JlOml9PWUse3dpbGxTeW5jU2VydmljZTpzLGlzU3luYzpufT10LGE9ci5yZW5kZXJ8fFtdLGw9ci5zcHx8W107aWYocyYmbClmb3IoY29uc3RbYyx1XW9mIGkuZW50cmllcygpKWwucHVzaCh7Li4udSx3b3JrSWQ6Yyx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpufSk7cmV0dXJue3JlbmRlcjphLHNwOmx9fX1jbGFzcyB4Zntjb25zdHJ1Y3RvcihlKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYnVpbGRlcnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgTWFwfSksdGhpcy5idWlsZGVycz1uZXcgTWFwKGUubWFwKHQ9Plt0LHRoaXMuYnVpbGQodCldKSl9YnVpbGQoZSl7c3dpdGNoKGUpe2Nhc2UgQi5UcmFuc2xhdGVOb2RlOnJldHVybiBuZXcgZ2Y7Y2FzZSBCLlpJbmRleE5vZGU6cmV0dXJuIG5ldyBtZjtjYXNlIEIuWkluZGV4QWN0aXZlOnJldHVybiBuZXcgcGY7Y2FzZSBCLkNvcHlOb2RlOnJldHVybiBuZXcgeWY7Y2FzZSBCLlNldENvbG9yTm9kZTpyZXR1cm4gbmV3IHdmO2Nhc2UgQi5EZWxldGVOb2RlOnJldHVybiBuZXcgYmY7Y2FzZSBCLlNjYWxlTm9kZTpyZXR1cm4gbmV3IHZmO2Nhc2UgQi5Sb3RhdGVOb2RlOnJldHVybiBuZXcgU2Y7Y2FzZSBCLlNldEZvbnRTdHlsZTpyZXR1cm4gbmV3IGtmO2Nhc2UgQi5TZXRQb2ludDpyZXR1cm4gbmV3IFBmO2Nhc2UgQi5TZXRMb2NrOnJldHVybiBuZXcgVGY7Y2FzZSBCLlNldFNoYXBlT3B0OnJldHVybiBuZXcgSWZ9fXJlZ2lzdGVyRm9yV29ya2VyKGUsdCxyKXtyZXR1cm4gdGhpcy5idWlsZGVycy5mb3JFYWNoKGk9PntpJiZpLnJlZ2lzdGVyRm9yV29ya2VyKGUsdCxyKX0pLHRoaXN9Y29uc3VtZUZvcldvcmtlcihlKXtmb3IoY29uc3QgdCBvZiB0aGlzLmJ1aWxkZXJzLnZhbHVlcygpKWlmKHQhPW51bGwmJnQuY29uc3VtZShlKSlyZXR1cm4hMDtyZXR1cm4hMX19Y29uc3QgS2U9ImN1cnNvcmhvdmVyIjtjbGFzcyBPZntjb25zdHJ1Y3RvcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmVQYXRoIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJmdWxsTGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY3VyTm9kZU1hcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidGFyZ2V0Tm9kZU1hcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksdGhpcy52aWV3SWQ9ZSx0aGlzLnNjZW5lPXR9aW5pdChlLHQpe3RoaXMuZnVsbExheWVyPWUsdGhpcy5kcmF3TGF5ZXI9dH1nZXQoZSl7cmV0dXJuIHRoaXMuY3VyTm9kZU1hcC5nZXQoZSl9aGFzUmVuZGVyTm9kZXMoKXtsZXQgZT0hMTtmb3IoY29uc3QgdCBvZiB0aGlzLmN1ck5vZGVNYXAudmFsdWVzKCkpT3IodC50b29sc1R5cGUpJiYoZT0hMCk7cmV0dXJuIGV9aGFzKGUpe3RoaXMuY3VyTm9kZU1hcC5oYXMoZSl9c2V0SW5mbyhlLHQpe2NvbnN0IHI9dGhpcy5jdXJOb2RlTWFwLmdldChlKXx8e25hbWU6ZSxyZWN0OnQucmVjdH07dC5yZWN0JiYoci5yZWN0PXJlKHQucmVjdCkpLHQub3AmJihyLm9wPXJlKHQub3ApKSx0LmNhblJvdGF0ZSYmKHIuY2FuUm90YXRlPXQuY2FuUm90YXRlKSx0LnNjYWxlVHlwZSYmKHIuc2NhbGVUeXBlPXQuc2NhbGVUeXBlKSx0Lm9wdCYmKHIub3B0PXJlKHQub3B0KSksdC50b29sc1R5cGUmJihyLnRvb2xzVHlwZT10LnRvb2xzVHlwZSksdC5jZW50ZXJQb3MmJihyLmNlbnRlclBvcz1yZSh0LmNlbnRlclBvcykpLHIucmVjdD90aGlzLmN1ck5vZGVNYXAuc2V0KGUscik6dGhpcy5jdXJOb2RlTWFwLmRlbGV0ZShlKX1kZWxldGUoZSl7dGhpcy5jdXJOb2RlTWFwLmRlbGV0ZShlKX1jbGVhcigpe3RoaXMuY3VyTm9kZU1hcC5jbGVhcigpLHRoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGg9MH1oYXNSZWN0SW50ZXJzZWN0UmFuZ2UoZSx0PSEwKXtmb3IoY29uc3QgciBvZiB0aGlzLmN1ck5vZGVNYXAudmFsdWVzKCkpaWYoUGUoZSxyLnJlY3QpKXtpZih0JiZyLnRvb2xzVHlwZT09PVMuSW1hZ2UmJnIub3B0LmxvY2tlZHx8dCYmci50b29sc1R5cGU9PT1TLlRleHQmJihyLm9wdC53b3JrU3RhdGU9PT1GLkRvaW5nfHxyLm9wdC53b3JrU3RhdGU9PT1GLlN0YXJ0KSljb250aW51ZTtyZXR1cm4hMH1yZXR1cm4hMX1nZXRSZWN0SW50ZXJzZWN0UmFuZ2UoZSx0PSEwKXtsZXQgcjtjb25zdCBpPW5ldyBNYXA7Zm9yKGNvbnN0W3Msbl1vZiB0aGlzLmN1ck5vZGVNYXAuZW50cmllcygpKWlmKFBlKGUsbi5yZWN0KSl7aWYodCYmbi50b29sc1R5cGU9PT1TLkltYWdlJiZuLm9wdC5sb2NrZWR8fHQmJm4udG9vbHNUeXBlPT09Uy5UZXh0JiYobi5vcHQud29ya1N0YXRlPT09Ri5Eb2luZ3x8bi5vcHQud29ya1N0YXRlPT09Ri5TdGFydCkpY29udGludWU7cj1BKHIsbi5yZWN0KSxpLnNldChzLG4pfXJldHVybntyZWN0UmFuZ2U6cixub2RlUmFuZ2U6aX19Z2V0Tm9kZVJlY3RGb3JtU2hhcGUoZSx0KXtjb25zdCByPVZyKHQudG9vbHNUeXBlKTtsZXQgaT10aGlzLmZ1bGxMYXllciYmKHI9PW51bGw/dm9pZCAwOnIuZ2V0UmVjdEZyb21MYXllcih0aGlzLmZ1bGxMYXllcixlKSk7cmV0dXJuIWkmJnRoaXMuZHJhd0xheWVyJiYoaT1yPT1udWxsP3ZvaWQgMDpyLmdldFJlY3RGcm9tTGF5ZXIodGhpcy5kcmF3TGF5ZXIsZSkpLGl9dXBkYXRlTm9kZXNSZWN0KCl7dGhpcy5jdXJOb2RlTWFwLmZvckVhY2goKGUsdCk9Pntjb25zdCByPXRoaXMuZ2V0Tm9kZVJlY3RGb3JtU2hhcGUodCxlKTtyPyhlLnJlY3Q9cix0aGlzLmN1ck5vZGVNYXAuc2V0KHQsZSkpOnRoaXMuY3VyTm9kZU1hcC5kZWxldGUodCl9KX1jb21iaW5lSW50ZXJzZWN0UmVjdChlKXtsZXQgdD1lO3JldHVybiB0aGlzLmN1ck5vZGVNYXAuZm9yRWFjaChyPT57UGUodCxyLnJlY3QpJiYodD1BKHQsci5yZWN0KSl9KSx0fXNldFRhcmdldCgpe3JldHVybiB0aGlzLnRhcmdldE5vZGVNYXAucHVzaChyZSh0aGlzLmN1ck5vZGVNYXApKSx0aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoLTF9Z2V0TGFzdFRhcmdldCgpe3JldHVybiB0aGlzLnRhcmdldE5vZGVNYXBbdGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aC0xXX1kZWxldGVMYXN0VGFyZ2V0KCl7dGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aD10aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoLTF9Z2V0VGFyZ2V0KGUpe3JldHVybiB0aGlzLnRhcmdldE5vZGVNYXBbZV19ZGVsZXRlVGFyZ2V0KGUpe3RoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGg9ZX19Y2xhc3MgdG97Y29uc3RydWN0b3IoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidmlld0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Tm9kZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHByIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW1lcmFPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiaXNTYWZhcmkiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLHRoaXMudmlld0lkPWUsdGhpcy5vcHQ9dCx0aGlzLmRwcj10LmRwcix0aGlzLnNjZW5lPXRoaXMuY3JlYXRlU2NlbmUodC5vZmZzY3JlZW5DYW52YXNPcHQpLHRoaXMuZnVsbExheWVyPXRoaXMuY3JlYXRlTGF5ZXIoImZ1bGxMYXllciIsdGhpcy5zY2VuZSx7Li4udC5sYXllck9wdCxidWZmZXJTaXplOnRoaXMudmlld0lkPT09Im1haW5WaWV3Ij82ZTM6M2UzfSksdGhpcy52Tm9kZXM9bmV3IE9mKGUsdGhpcy5zY2VuZSl9c2V0SXNTYWZhcmkoZSl7dGhpcy5pc1NhZmFyaT1lfW9uKGUpe2NvbnN0e21zZ1R5cGU6dCx0b29sc1R5cGU6cixvcHQ6aSx3b3JrSWQ6cyx3b3JrU3RhdGU6bixkYXRhVHlwZTphfT1lO3N3aXRjaCh0KXtjYXNlIG0uRGVzdHJveTp0aGlzLmRlc3Ryb3koKTticmVhaztjYXNlIG0uQ2xlYXI6dGhpcy5jbGVhckFsbCgpO2JyZWFrO2Nhc2UgbS5VcGRhdGVUb29sczppZihyJiZpKXtjb25zdCBsPXt0b29sc1R5cGU6cix0b29sc09wdDppfTt0aGlzLmxvY2FsV29yay5zZXRUb29sc09wdChsKX1icmVhaztjYXNlIG0uQ3JlYXRlV29yazpzJiZpJiYoIXRoaXMubG9jYWxXb3JrLmdldFRtcFdvcmtTaGFwZU5vZGUoKSYmciYmdGhpcy5zZXRUb29sc09wdCh7dG9vbHNUeXBlOnIsdG9vbHNPcHQ6aX0pLHRoaXMuc2V0V29ya09wdCh7d29ya0lkOnMsdG9vbHNPcHQ6aX0pKTticmVhaztjYXNlIG0uRHJhd1dvcms6bj09PUYuRG9uZSYmYT09PVcuTG9jYWw/dGhpcy5jb25zdW1lRHJhd0FsbChhLGUpOnRoaXMuY29uc3VtZURyYXcoYSxlKTticmVha319dXBkYXRlU2NlbmUoZSl7dGhpcy5zY2VuZS5hdHRyKHsuLi5lfSk7Y29uc3R7d2lkdGg6dCxoZWlnaHQ6cn09ZTt0aGlzLnNjZW5lLmNvbnRhaW5lci53aWR0aD10LHRoaXMuc2NlbmUuY29udGFpbmVyLmhlaWdodD1yLHRoaXMuc2NlbmUud2lkdGg9dCx0aGlzLnNjZW5lLmhlaWdodD1yLHRoaXMudXBkYXRlTGF5ZXIoe3dpZHRoOnQsaGVpZ2h0OnJ9KX11cGRhdGVMYXllcihlKXtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lO3RoaXMuZnVsbExheWVyJiYodGhpcy5mdWxsTGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgid2lkdGgiLHQpLHRoaXMuZnVsbExheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoImhlaWdodCIsciksdGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJzaXplIixbdCxyXSksdGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJwb3MiLFt0Ki41LHIqLjVdKSksdGhpcy5kcmF3TGF5ZXImJih0aGlzLmRyYXdMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5kcmF3TGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgiaGVpZ2h0IixyKSx0aGlzLmRyYXdMYXllci5zZXRBdHRyaWJ1dGUoInNpemUiLFt0LHJdKSx0aGlzLmRyYXdMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKSx0aGlzLnNuYXBzaG90RnVsbExheWVyJiYodGhpcy5zbmFwc2hvdEZ1bGxMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5zbmFwc2hvdEZ1bGxMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJoZWlnaHQiLHIpLHRoaXMuc25hcHNob3RGdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJzaXplIixbdCxyXSksdGhpcy5zbmFwc2hvdEZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKX1jcmVhdGVTY2VuZShlKXtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lLGk9bmV3IE9mZnNjcmVlbkNhbnZhcyh0LHIpO3JldHVybiBuZXcgei5TY2VuZSh7Y29udGFpbmVyOmksZGlzcGxheVJhdGlvOnRoaXMuZHByLGRlcHRoOiExLGRlc3luY2hyb25pemVkOiEwLC4uLmV9KX1jcmVhdGVMYXllcihlLHQscil7Y29uc3R7d2lkdGg6aSxoZWlnaHQ6c309cixuPWBvZmZzY3JlZW4tJHtlfWAsYT10LmxheWVyKG4sciksbD1uZXcgei5Hcm91cCh7YW5jaG9yOlsuNSwuNV0scG9zOltpKi41LHMqLjVdLHNpemU6W2ksc10sbmFtZToidmlld3BvcnQiLGlkOmV9KTtyZXR1cm4gYS5hcHBlbmQobCksbH1jbGVhckFsbCgpe3ZhciBlO3RoaXMuZnVsbExheWVyJiYodGhpcy5mdWxsTGF5ZXIucGFyZW50LmNoaWxkcmVuLmZvckVhY2godD0+e3QubmFtZSE9PSJ2aWV3cG9ydCImJnQucmVtb3ZlKCl9KSx0aGlzLmZ1bGxMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpKSx0aGlzLmRyYXdMYXllciYmKHRoaXMuZHJhd0xheWVyLnBhcmVudC5jaGlsZHJlbi5mb3JFYWNoKHQ9Pnt0Lm5hbWUhPT0idmlld3BvcnQiJiZ0LnJlbW92ZSgpfSksdGhpcy5kcmF3TGF5ZXIucmVtb3ZlQWxsQ2hpbGRyZW4oKSksdGhpcy5sb2NhbFdvcmsuY2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKSwoZT10aGlzLnNlcnZpY2VXb3JrKT09bnVsbHx8ZS5jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpfXNldFRvb2xzT3B0KGUpe3RoaXMubG9jYWxXb3JrLnNldFRvb2xzT3B0KGUpfXNldFdvcmtPcHQoZSl7Y29uc3R7d29ya0lkOnQsdG9vbHNPcHQ6cn09ZTt0JiZyJiZ0aGlzLmxvY2FsV29yay5zZXRXb3JrT3B0aW9ucyh0LHIpfWRlc3Ryb3koKXt2YXIgZTt0aGlzLnZOb2Rlcy5jbGVhcigpLHRoaXMuc2NlbmUucmVtb3ZlKCksdGhpcy5mdWxsTGF5ZXIucmVtb3ZlKCksdGhpcy5sb2NhbFdvcmsuZGVzdHJveSgpLChlPXRoaXMuc2VydmljZVdvcmspPT1udWxsfHxlLmRlc3Ryb3koKX19Y2xhc3Mgcm97Y29uc3RydWN0b3IoZSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZpZXdJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Tm9kZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidGhyZWFkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3Bvc3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wV29ya1NoYXBlTm9kZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlU3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgTWFwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVmZmVjdFdvcmtJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3Q291bnQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTowfSksdGhpcy50aHJlYWQ9ZS50aHJlYWQsdGhpcy52aWV3SWQ9ZS52aWV3SWQsdGhpcy52Tm9kZXM9ZS52Tm9kZXMsdGhpcy5mdWxsTGF5ZXI9ZS5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXI9ZS5kcmF3TGF5ZXIsdGhpcy5fcG9zdD1lLnBvc3R9ZGVzdHJveSgpe3RoaXMud29ya1NoYXBlU3RhdGUuY2xlYXIoKSx0aGlzLndvcmtTaGFwZXMuY2xlYXIoKX1nZXRXb3JrU2hhcGUoZSl7cmV0dXJuIHRoaXMud29ya1NoYXBlcy5nZXQoZSl9Z2V0VG1wV29ya1NoYXBlTm9kZSgpe3JldHVybiB0aGlzLnRtcFdvcmtTaGFwZU5vZGV9c2V0VG1wV29ya0lkKGUpe2lmKGUmJnRoaXMudG1wV29ya1NoYXBlTm9kZSl7dGhpcy50bXBXb3JrU2hhcGVOb2RlLnNldFdvcmtJZChlKSx0aGlzLndvcmtTaGFwZXMuc2V0KGUsdGhpcy50bXBXb3JrU2hhcGVOb2RlKSx0aGlzLnRtcE9wdCYmdGhpcy5zZXRUb29sc09wdCh0aGlzLnRtcE9wdCk7cmV0dXJufX1zZXRUbXBXb3JrT3B0aW9ucyhlKXt2YXIgdDsodD10aGlzLnRtcFdvcmtTaGFwZU5vZGUpPT1udWxsfHx0LnNldFdvcmtPcHRpb25zKGUpfXNldFdvcmtPcHRpb25zKGUsdCl7dmFyIGk7dGhpcy53b3JrU2hhcGVzLmdldChlKXx8dGhpcy5zZXRUbXBXb3JrSWQoZSksKGk9dGhpcy53b3JrU2hhcGVzLmdldChlKSk9PW51bGx8fGkuc2V0V29ya09wdGlvbnModCl9Y3JlYXRlV29ya1NoYXBlTm9kZShlKXt2YXIgaTtjb25zdHt0b29sc1R5cGU6dCx3b3JrSWQ6cn09ZTtyZXR1cm4gdD09PVMuU2VsZWN0b3ImJnI9PT1LZT9idCh7Li4uZSx2Tm9kZXM6dGhpcy52Tm9kZXMsZnVsbExheWVyOnRoaXMuZnVsbExheWVyLGRyYXdMYXllcjp0aGlzLmZ1bGxMYXllcn0pOmJ0KHsuLi5lLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfSwoaT10aGlzLnRocmVhZCk9PW51bGw/dm9pZCAwOmkuc2VydmljZVdvcmspfXNldFRvb2xzT3B0KGUpe3ZhciB0LHI7KCh0PXRoaXMudG1wT3B0KT09bnVsbD92b2lkIDA6dC50b29sc1R5cGUpIT09ZS50b29sc1R5cGUmJihyPXRoaXMudG1wT3B0KSE9bnVsbCYmci50b29sc1R5cGUmJnRoaXMuY2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKSx0aGlzLnRtcE9wdD1lLHRoaXMudG1wV29ya1NoYXBlTm9kZT10aGlzLmNyZWF0ZVdvcmtTaGFwZU5vZGUoZSl9Y2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUoZSl7dmFyIHQ7KHQ9dGhpcy5nZXRXb3JrU2hhcGUoZSkpPT1udWxsfHx0LmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShlKSx0aGlzLndvcmtTaGFwZVN0YXRlLmRlbGV0ZShlKX1jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpe3RoaXMud29ya1NoYXBlcy5mb3JFYWNoKGU9PmUuY2xlYXJUbXBQb2ludHMoKSksdGhpcy53b3JrU2hhcGVzLmNsZWFyKCksdGhpcy53b3JrU2hhcGVTdGF0ZS5jbGVhcigpfXNldEZ1bGxXb3JrKGUpe2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppfT1lO2lmKHQmJnImJmkpe2NvbnN0IHM9dCYmdGhpcy53b3JrU2hhcGVzLmdldCh0KXx8dGhpcy5jcmVhdGVXb3JrU2hhcGVOb2RlKHt0b29sc09wdDpyLHRvb2xzVHlwZTppLHdvcmtJZDp0fSk7cmV0dXJuIHM/KHMuc2V0V29ya0lkKHQpLHRoaXMud29ya1NoYXBlcy5zZXQodCxzKSxzKTp2b2lkIDB9fX12YXIgTGY9aWUsQ2Y9ZnVuY3Rpb24oKXtyZXR1cm4gTGYuRGF0ZS5ub3coKX0sTmY9Q2YsV2Y9L1xzLztmdW5jdGlvbiBSZihvKXtmb3IodmFyIGU9by5sZW5ndGg7ZS0tJiZXZi50ZXN0KG8uY2hhckF0KGUpKTspO3JldHVybiBlfXZhciBNZj1SZixBZj1NZiwkZj0vXlxzKy87ZnVuY3Rpb24gRGYobyl7cmV0dXJuIG8mJm8uc2xpY2UoMCxBZihvKSsxKS5yZXBsYWNlKCRmLCIiKX12YXIgamY9RGYsRmY9ZmUsQmY9Y2UsX2Y9IltvYmplY3QgU3ltYm9sXSI7ZnVuY3Rpb24gRWYobyl7cmV0dXJuIHR5cGVvZiBvPT0ic3ltYm9sInx8QmYobykmJkZmKG8pPT1fZn12YXIgemY9RWYsVWY9amYsb289dWUsR2Y9emYsc289TmFOLFhmPS9eWy0rXTB4WzAtOWEtZl0rJC9pLEhmPS9eMGJbMDFdKyQvaSxZZj0vXjBvWzAtN10rJC9pLHFmPXBhcnNlSW50O2Z1bmN0aW9uIFpmKG8pe2lmKHR5cGVvZiBvPT0ibnVtYmVyIilyZXR1cm4gbztpZihHZihvKSlyZXR1cm4gc287aWYob28obykpe3ZhciBlPXR5cGVvZiBvLnZhbHVlT2Y9PSJmdW5jdGlvbiI/by52YWx1ZU9mKCk6bztvPW9vKGUpP2UrIiI6ZX1pZih0eXBlb2YgbyE9InN0cmluZyIpcmV0dXJuIG89PT0wP286K287bz1VZihvKTt2YXIgdD1IZi50ZXN0KG8pO3JldHVybiB0fHxZZi50ZXN0KG8pP3FmKG8uc2xpY2UoMiksdD8yOjgpOlhmLnRlc3Qobyk/c286K299dmFyIFFmPVpmLEpmPXVlLHZ0PU5mLGlvPVFmLEtmPSJFeHBlY3RlZCBhIGZ1bmN0aW9uIixWZj1NYXRoLm1heCxlcD1NYXRoLm1pbjtmdW5jdGlvbiB0cChvLGUsdCl7dmFyIHIsaSxzLG4sYSxsLGM9MCx1PSExLGg9ITEsZD0hMDtpZih0eXBlb2YgbyE9ImZ1bmN0aW9uIil0aHJvdyBuZXcgVHlwZUVycm9yKEtmKTtlPWlvKGUpfHwwLEpmKHQpJiYodT0hIXQubGVhZGluZyxoPSJtYXhXYWl0ImluIHQscz1oP1ZmKGlvKHQubWF4V2FpdCl8fDAsZSk6cyxkPSJ0cmFpbGluZyJpbiB0PyEhdC50cmFpbGluZzpkKTtmdW5jdGlvbiBmKHYpe3ZhciBMPXIsVD1pO3JldHVybiByPWk9dm9pZCAwLGM9dixuPW8uYXBwbHkoVCxMKSxufWZ1bmN0aW9uIHcodil7cmV0dXJuIGM9dixhPXNldFRpbWVvdXQoUCxlKSx1P2Yodik6bn1mdW5jdGlvbiB5KHYpe3ZhciBMPXYtbCxUPXYtYyxNPWUtTDtyZXR1cm4gaD9lcChNLHMtVCk6TX1mdW5jdGlvbiBnKHYpe3ZhciBMPXYtbCxUPXYtYztyZXR1cm4gbD09PXZvaWQgMHx8TD49ZXx8TDwwfHxoJiZUPj1zfWZ1bmN0aW9uIFAoKXt2YXIgdj12dCgpO2lmKGcodikpcmV0dXJuIGsodik7YT1zZXRUaW1lb3V0KFAseSh2KSl9ZnVuY3Rpb24gayh2KXtyZXR1cm4gYT12b2lkIDAsZCYmcj9mKHYpOihyPWk9dm9pZCAwLG4pfWZ1bmN0aW9uIE8oKXthIT09dm9pZCAwJiZjbGVhclRpbWVvdXQoYSksYz0wLHI9bD1pPWE9dm9pZCAwfWZ1bmN0aW9uIEkoKXtyZXR1cm4gYT09PXZvaWQgMD9uOmsodnQoKSl9ZnVuY3Rpb24gYigpe3ZhciB2PXZ0KCksTD1nKHYpO2lmKHI9YXJndW1lbnRzLGk9dGhpcyxsPXYsTCl7aWYoYT09PXZvaWQgMClyZXR1cm4gdyhsKTtpZihoKXJldHVybiBjbGVhclRpbWVvdXQoYSksYT1zZXRUaW1lb3V0KFAsZSksZihsKX1yZXR1cm4gYT09PXZvaWQgMCYmKGE9c2V0VGltZW91dChQLGUpKSxufXJldHVybiBiLmNhbmNlbD1PLGIuZmx1c2g9SSxifXZhciBycD10cCxvcD1ycCxzcD11ZSxpcD0iRXhwZWN0ZWQgYSBmdW5jdGlvbiI7ZnVuY3Rpb24gbnAobyxlLHQpe3ZhciByPSEwLGk9ITA7aWYodHlwZW9mIG8hPSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcihpcCk7cmV0dXJuIHNwKHQpJiYocj0ibGVhZGluZyJpbiB0PyEhdC5sZWFkaW5nOnIsaT0idHJhaWxpbmciaW4gdD8hIXQudHJhaWxpbmc6aSksb3AobyxlLHtsZWFkaW5nOnIsbWF4V2FpdDplLHRyYWlsaW5nOml9KX12YXIgYXA9bnAsbHA9bWUoYXApO2NsYXNzIGNwIGV4dGVuZHMgcm97Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNvbWJpbmVVbml0VGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjYwMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb21iaW5lVGltZXJJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlZmZlY3RTZWxlY3ROb2RlRGF0YSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBTZXR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYmF0Y2hFcmFzZXJXb3JrcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBTZXR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYmF0Y2hFcmFzZXJSZW1vdmVOb2RlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBTZXR9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYmF0Y2hFcmFzZXJDb21iaW5lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bHAoKCk9Pntjb25zdCB0PXRoaXMudXBkYXRlQmF0Y2hFcmFzZXJDb21iaW5lTm9kZSh0aGlzLmJhdGNoRXJhc2VyV29ya3MsdGhpcy5iYXRjaEVyYXNlclJlbW92ZU5vZGVzKTt0aGlzLmJhdGNoRXJhc2VyV29ya3MuY2xlYXIoKSx0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMuY2xlYXIoKSx0Lmxlbmd0aCYmdGhpcy5fcG9zdCh7cmVuZGVyOnR9KX0sMTAwLHtsZWFkaW5nOiExfSl9KX1jb25zdW1lRHJhdyhlLHQpe2NvbnN0e29wOnIsd29ya0lkOml9PWU7aWYociE9bnVsbCYmci5sZW5ndGgmJmkpe2NvbnN0IHM9dGhpcy53b3JrU2hhcGVzLmdldChpKTtpZighcylyZXR1cm47Y29uc3Qgbj1zLnRvb2xzVHlwZTtpZihuPT09Uy5MYXNlclBlbilyZXR1cm47Y29uc3QgYT1zLmNvbnN1bWUoe2RhdGE6ZSxpc0Z1bGxXb3JrOiEwfSk7c3dpdGNoKG4pe2Nhc2UgUy5TZWxlY3RvcjphLnR5cGU9PT1tLlNlbGVjdCYmKGEuc2VsZWN0SWRzJiZ0LnJ1blJldmVyc2VTZWxlY3RXb3JrKGEuc2VsZWN0SWRzKSx0aGlzLmRyYXdTZWxlY3RvcihhLCEwKSk7YnJlYWs7Y2FzZSBTLkVyYXNlcjphIT1udWxsJiZhLnJlY3QmJnRoaXMuZHJhd0VyYXNlcihhKTticmVhaztjYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5FbGxpcHNlOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246YSYmKHRoaXMuZHJhd0NvdW50KyssdGhpcy5kcmF3UGVuY2lsKGEpKTticmVhaztjYXNlIFMuUGVuY2lsOnRoaXMuY29tYmluZVRpbWVySWR8fCh0aGlzLmNvbWJpbmVUaW1lcklkPXNldFRpbWVvdXQoKCk9Pnt0aGlzLmNvbWJpbmVUaW1lcklkPXZvaWQgMCx0aGlzLmRyYXdQZW5jaWxDb21iaW5lKGkpfSxNYXRoLmZsb29yKHMuZ2V0V29ya09wdGlvbnMoKS5zeW5jVW5pdFRpbWV8fHRoaXMuY29tYmluZVVuaXRUaW1lLzIpKSksYSYmKHRoaXMuZHJhd0NvdW50KyssdGhpcy5kcmF3UGVuY2lsKGEpKTticmVha319fWNvbnN1bWVEcmF3QWxsKGUsdCl7dmFyIG4sYSxsO3RoaXMuY29tYmluZVRpbWVySWQmJihjbGVhclRpbWVvdXQodGhpcy5jb21iaW5lVGltZXJJZCksdGhpcy5jb21iaW5lVGltZXJJZD12b2lkIDApO2NvbnN0e3dvcmtJZDpyLHVuZG9UaWNrZXJJZDppLHNjZW5lUGF0aDpzfT1lO2lmKHIpe2kmJnNldFRpbWVvdXQoKCk9Pnt0aGlzLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDppfV19KX0sMCk7Y29uc3QgYz10aGlzLndvcmtTaGFwZXMuZ2V0KHIpO2lmKCFjKXJldHVybjtjb25zdCB1PWMudG9vbHNUeXBlO2lmKHU9PT1TLkxhc2VyUGVuKXJldHVybjtjb25zdCBoPXRoaXMud29ya1NoYXBlcy5nZXQoS2UpLGQ9KG49aD09bnVsbD92b2lkIDA6aC5zZWxlY3RJZHMpPT1udWxsP3ZvaWQgMDpuWzBdLGY9Yy5jb25zdW1lQWxsKHtkYXRhOmUsaG92ZXJJZDpkfSksdz10aGlzLndvcmtTaGFwZVN0YXRlLmdldChyKTtzd2l0Y2godSl7Y2FzZSBTLlNlbGVjdG9yOmYuc2VsZWN0SWRzJiZkJiYoKGE9Zi5zZWxlY3RJZHMpIT1udWxsJiZhLmluY2x1ZGVzKGQpKSYmaC5jdXJzb3JCbHVyKCksZi5zZWxlY3RJZHMmJnQucnVuUmV2ZXJzZVNlbGVjdFdvcmsoZi5zZWxlY3RJZHMpLHRoaXMuZHJhd1NlbGVjdG9yKHsuLi5mLHNjZW5lUGF0aDpzfSwhMSksKGw9Yy5zZWxlY3RJZHMpIT1udWxsJiZsLmxlbmd0aD9jLmNsZWFyVG1wUG9pbnRzKCk6dGhpcy5jbGVhcldvcmtTaGFwZU5vZGVDYWNoZShyKTticmVhaztjYXNlIFMuRXJhc2VyOmYhPW51bGwmJmYucmVjdCYmdGhpcy5kcmF3RXJhc2VyKHsuLi5mLHNjZW5lUGF0aDpzfSksYy5jbGVhclRtcFBvaW50cygpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjp0aGlzLmRyYXdQZW5jaWxGdWxsKHsuLi5mLHNjZW5lUGF0aDpzfSxjLmdldFdvcmtPcHRpb25zKCksdyksdGhpcy5kcmF3Q291bnQ9MCx0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKHIpO2JyZWFrO2Nhc2UgUy5QZW5jaWw6ZiE9bnVsbCYmZi5yZWN0JiYodGhpcy5kcmF3UGVuY2lsRnVsbCh7Li4uZixzY2VuZVBhdGg6c30sYy5nZXRXb3JrT3B0aW9ucygpLHcpLHRoaXMuZHJhd0NvdW50PTApLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUocik7YnJlYWt9fX1hc3luYyBjb25zdW1lRnVsbChlLHQpe3ZhciBuLGE7Y29uc3Qgcj10aGlzLnNldEZ1bGxXb3JrKGUpLGk9ZS5vcHMmJnFlKGUub3BzKSxzPShuPWUud29ya0lkKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpO2lmKHMmJnIpe2NvbnN0IGw9KGE9dGhpcy52Tm9kZXMuZ2V0KHMpKT09bnVsbD92b2lkIDA6YS5yZWN0O2xldCBjO3IudG9vbHNUeXBlPT09Uy5JbWFnZSYmdD9jPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7c2NlbmU6dCxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDpzfSk6Yz1yLmNvbnN1bWVTZXJ2aWNlKHtvcDppLGlzRnVsbFdvcms6ITAscmVwbGFjZUlkOnN9KTtjb25zdCB1PShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtjPUEoYyx1KTtjb25zdCBoPVtdLGQ9W107aWYoYyYmZS53aWxsUmVmcmVzaCYmKGwmJmgucHVzaCh7cmVjdDpjLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pLGgucHVzaCh7cmVjdDpjLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pKSxlLndpbGxTeW5jU2VydmljZSYmZC5wdXNoKHtvcHQ6ZS5vcHQsdG9vbHNUeXBlOmUudG9vbHNUeXBlLHR5cGU6bS5GdWxsV29yayx3b3JrSWQ6ZS53b3JrSWQsb3BzOmUub3BzLHVwZGF0ZU5vZGVPcHQ6ZS51cGRhdGVOb2RlT3B0LHVuZG9UaWNrZXJJZDplLnVuZG9UaWNrZXJJZCx2aWV3SWQ6dGhpcy52aWV3SWR9KSxoLmxlbmd0aHx8ZC5sZW5ndGgpe2NvbnN0IGY9e3JlbmRlcjpoLHNwOmR9O3RoaXMuX3Bvc3QoZil9ZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpfX1yZW1vdmVXb3JrKGUpe2NvbnN0e3dvcmtJZDp0fT1lLHI9dD09bnVsbD92b2lkIDA6dC50b1N0cmluZygpO2lmKHIpe2NvbnN0IGk9dGhpcy5yZW1vdmVOb2RlKHIpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfV19KX19cmVtb3ZlTm9kZShlKXt2YXIgaTt0aGlzLndvcmtTaGFwZXMuaGFzKGUpJiZ0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKGUpO2xldCB0O2NvbnN0IHI9dGhpcy52Tm9kZXMuZ2V0KGUpO3JldHVybiByJiYodGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoZSkuY29uY2F0KCgoaT10aGlzLmRyYXdMYXllcik9PW51bGw/dm9pZCAwOmkuZ2V0RWxlbWVudHNCeU5hbWUoZSkpfHxbXSkuZm9yRWFjaChzPT57cy5yZW1vdmUoKX0pLHQ9QSh0LHIucmVjdCksdGhpcy52Tm9kZXMuZGVsZXRlKGUpKSx0fWFzeW5jIGNoZWNrVGV4dEFjdGl2ZShlKXtjb25zdHtvcDp0LHZpZXdJZDpyLGRhdGFUeXBlOml9PWU7aWYodCE9bnVsbCYmdC5sZW5ndGgpe2xldCBzO2Zvcihjb25zdCBuIG9mIHRoaXMudk5vZGVzLmN1ck5vZGVNYXAudmFsdWVzKCkpe2NvbnN0e3JlY3Q6YSxuYW1lOmwsdG9vbHNUeXBlOmMsb3B0OnV9PW4saD10WzBdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLGQ9dFsxXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXTtpZihjPT09Uy5UZXh0JiZHaChbaCxkXSxhKSYmdS53b3JrU3RhdGU9PT1GLkRvbmUpe3M9bDticmVha319cyYmKGF3YWl0IHRoaXMuYmx1clNlbGVjdG9yKHt2aWV3SWQ6cixtc2dUeXBlOm0uU2VsZWN0LGRhdGFUeXBlOmksaXNTeW5jOiEwfSksYXdhaXQgdGhpcy5fcG9zdCh7c3A6W3t0eXBlOm0uR2V0VGV4dEFjdGl2ZSx0b29sc1R5cGU6Uy5UZXh0LHdvcmtJZDpzfV19KSl9fWFzeW5jIGNvbGxvY3RFZmZlY3RTZWxlY3RXb3JrKGUpe2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHt3b3JrSWQ6cixtc2dUeXBlOml9PWU7aWYodCYmciYmdC5zZWxlY3RJZHMmJnQuc2VsZWN0SWRzLmluY2x1ZGVzKHIudG9TdHJpbmcoKSkpe2k9PT1tLlJlbW92ZU5vZGU/dC5zZWxlY3RJZHM9dC5zZWxlY3RJZHMuZmlsdGVyKHM9PnMhPT1yLnRvU3RyaW5nKCkpOnRoaXMuZWZmZWN0U2VsZWN0Tm9kZURhdGEuYWRkKGUpLGF3YWl0IG5ldyBQcm9taXNlKHM9PntzZXRUaW1lb3V0KCgpPT57cyghMCl9LDApfSksYXdhaXQgdGhpcy5ydW5FZmZlY3RTZWxlY3RXb3JrKCEwKS50aGVuKCgpPT57dmFyIHM7KHM9dGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YSk9PW51bGx8fHMuY2xlYXIoKX0pO3JldHVybn1yZXR1cm4gZX1hc3luYyB1cGRhdGVTZWxlY3RvcihlKXt2YXIgUDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighKChQPXQ9PW51bGw/dm9pZCAwOnQuc2VsZWN0SWRzKSE9bnVsbCYmUC5sZW5ndGgpKXJldHVybjtjb25zdHtjYWxsYmFjazpyLC4uLml9PWUse3VwZGF0ZVNlbGVjdG9yT3B0OnMsd2lsbFJlZnJlc2hTZWxlY3RvcjpuLHdpbGxTZXJpYWxpemVEYXRhOmEsZW1pdEV2ZW50VHlwZTpsLHNjZW5lOmN9PWksdT1zLndvcmtTdGF0ZSxoPWF3YWl0KHQ9PW51bGw/dm9pZCAwOnQudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnMsc2VsZWN0SWRzOnQuc2VsZWN0SWRzLHZOb2Rlczp0aGlzLnZOb2Rlcyx3aWxsU2VyaWFsaXplRGF0YTphLHdvcmtlcjp0aGlzLHNjZW5lOmN9KSksZD1oPT1udWxsP3ZvaWQgMDpoLnNlbGVjdFJlY3QsZj1uZXcgTWFwO3Quc2VsZWN0SWRzLmZvckVhY2goaz0+e2NvbnN0IE89dGhpcy52Tm9kZXMuZ2V0KGspO2lmKE8pe2NvbnN0e3Rvb2xzVHlwZTpJLG9wOmIsb3B0OnZ9PU87Zi5zZXQoayx7b3B0OnYsdG9vbHNUeXBlOkksb3BzOihiPT1udWxsP3ZvaWQgMDpiLmxlbmd0aCkmJmxlKGIpfHx2b2lkIDB9KX19KTtjb25zdCB3PVtdLHk9W107aWYobil7dy5wdXNoKHtpc0NsZWFyQWxsOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcix2aWV3SWQ6dGhpcy52aWV3SWR9KTtjb25zdCBrPXtyZWN0OmQsaXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfTtzLnRyYW5zbGF0ZSYmbD09PUIuVHJhbnNsYXRlTm9kZSYmdT09PUYuRG9pbmcmJihrLnRyYW5zbGF0ZT1zLnRyYW5zbGF0ZSksdy5wdXNoKGspfWNvbnN0IGc9ciYmcih7cmVzOmgsd29ya1NoYXBlTm9kZTp0LHBhcmFtOmkscG9zdERhdGE6e3JlbmRlcjp3LHNwOnl9LG5ld1NlcnZpY2VTdG9yZTpmfSl8fHtyZW5kZXI6dyxzcDp5fTsoZy5yZW5kZXIubGVuZ3RofHxnLnNwLmxlbmd0aCkmJnRoaXMuX3Bvc3QoZyl9YXN5bmMgYmx1clNlbGVjdG9yKGUpe3ZhciBpO2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHI9dD09bnVsbD92b2lkIDA6dC5ibHVyU2VsZWN0b3IoKTtpZih0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKEUuc2VsZWN0b3JJZCksKChpPXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6aS5wYXJlbnQpLmNoaWxkcmVuLmZvckVhY2gocz0+e3MubmFtZT09PUUuc2VsZWN0b3JJZCYmcy5yZW1vdmUoKX0pLHIpe2NvbnN0IHM9W107cy5wdXNoKHsuLi5yLHVuZG9UaWNrZXJJZDplPT1udWxsP3ZvaWQgMDplLnVuZG9UaWNrZXJJZCxpc1N5bmM6ZT09bnVsbD92b2lkIDA6ZS5pc1N5bmN9KSxhd2FpdCB0aGlzLl9wb3N0KHtyZW5kZXI6KHI9PW51bGw/dm9pZCAwOnIucmVjdCkmJlt7cmVjdDpyLnJlY3QsZHJhd0NhbnZhczpOLkJnLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnN9KX19cmVSZW5kZXJTZWxlY3RvcihlPSExKXt2YXIgcjtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZih0KXtpZih0JiYhKChyPXQuc2VsZWN0SWRzKSE9bnVsbCYmci5sZW5ndGgpKXJldHVybiB0aGlzLmJsdXJTZWxlY3RvcigpO2lmKHRoaXMuZHJhd0xheWVyKXtjb25zdCBpPXQucmVSZW5kZXJTZWxlY3RvcigpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3RvcixkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfV0sc3A6W3t0eXBlOm0uU2VsZWN0LHNlbGVjdElkczp0LnNlbGVjdElkcyxzZWxlY3RSZWN0Omksd2lsbFN5bmNTZXJ2aWNlOmUsdmlld0lkOnRoaXMudmlld0lkLHBvaW50czp0LmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDp0LnRleHRPcHR9XX0pfX19dXBkYXRlRnVsbFNlbGVjdFdvcmsoZSl7dmFyIGkscyxuLGEsbCxjLHUsaDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKSx7c2VsZWN0SWRzOnJ9PWU7aWYoIShyIT1udWxsJiZyLmxlbmd0aCkpe3RoaXMuYmx1clNlbGVjdG9yKGUpO3JldHVybn1pZighdCl7IXRoaXMuc2V0RnVsbFdvcmsoZSkmJmUud29ya0lkJiYoKGk9dGhpcy50bXBXb3JrU2hhcGVOb2RlKT09bnVsbD92b2lkIDA6aS50b29sc1R5cGUpPT09Uy5TZWxlY3RvciYmdGhpcy5zZXRUbXBXb3JrSWQoZS53b3JrSWQpLHRoaXMudXBkYXRlRnVsbFNlbGVjdFdvcmsoZSk7cmV0dXJufWlmKHQmJihyIT1udWxsJiZyLmxlbmd0aCkpe2NvbnN0e2JnUmVjdDpkLHNlbGVjdFJlY3Q6Zn09dC51cGRhdGVTZWxlY3RJZHMociksdz17cmVuZGVyOltdLHNwOltdfTtkJiYoKHM9dy5yZW5kZXIpPT1udWxsfHxzLnB1c2goe3JlY3Q6SyhkKSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSkpLChuPXcucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmYsaXNDbGVhcjohMCxpc0Z1bGxXb3JrOiExLGNsZWFyQ2FudmFzOk4uU2VsZWN0b3IsZHJhd0NhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLnZpZXdJZH0pLChoPXcuc3ApPT1udWxsfHxoLnB1c2goey4uLmUsc2VsZWN0b3JDb2xvcjooKGE9ZS5vcHQpPT1udWxsP3ZvaWQgMDphLnN0cm9rZUNvbG9yKXx8dC5zZWxlY3RvckNvbG9yLHN0cm9rZUNvbG9yOigobD1lLm9wdCk9PW51bGw/dm9pZCAwOmwuc3Ryb2tlQ29sb3IpfHx0LnN0cm9rZUNvbG9yLGZpbGxDb2xvcjooKGM9ZS5vcHQpPT1udWxsP3ZvaWQgMDpjLmZpbGxDb2xvcil8fHQuZmlsbENvbG9yLHRleHRPcHQ6KCh1PWUub3B0KT09bnVsbD92b2lkIDA6dS50ZXh0T3B0KXx8dC50ZXh0T3B0LGNhblRleHRFZGl0OnQuY2FuVGV4dEVkaXQsY2FuUm90YXRlOnQuY2FuUm90YXRlLHNjYWxlVHlwZTp0LnNjYWxlVHlwZSx0eXBlOm0uU2VsZWN0LHNlbGVjdFJlY3Q6Zixwb2ludHM6dC5nZXRDaGlsZHJlblBvaW50cygpLHdpbGxTeW5jU2VydmljZTooZT09bnVsbD92b2lkIDA6ZS53aWxsU3luY1NlcnZpY2UpfHwhMSxvcHQ6KGU9PW51bGw/dm9pZCAwOmUud2lsbFN5bmNTZXJ2aWNlKSYmdC5nZXRXb3JrT3B0aW9ucygpfHx2b2lkIDAsY2FuTG9jazp0LmNhbkxvY2ssaXNMb2NrZWQ6dC5pc0xvY2tlZCx0b29sc1R5cGVzOnQudG9vbHNUeXBlcyxzaGFwZU9wdDp0LnNoYXBlT3B0fSksdGhpcy5fcG9zdCh3KX19ZGVzdHJveSgpe3N1cGVyLmRlc3Ryb3koKSx0aGlzLmVmZmVjdFNlbGVjdE5vZGVEYXRhLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlcldvcmtzLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlclJlbW92ZU5vZGVzLmNsZWFyKCl9ZHJhd1BlbmNpbENvbWJpbmUoZSl7dmFyIHIsaTtjb25zdCB0PShyPXRoaXMud29ya1NoYXBlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpyLmNvbWJpbmVDb25zdW1lKCk7aWYodCl7Y29uc3Qgcz17cmVuZGVyOltdLGRyYXdDb3VudDp0aGlzLmRyYXdDb3VudH07KGk9cy5yZW5kZXIpPT1udWxsfHxpLnB1c2goe3JlY3Q6KHQ9PW51bGw/dm9pZCAwOnQucmVjdCkmJksodC5yZWN0KSxpc0NsZWFyOiEwLGRyYXdDYW52YXM6Ti5GbG9hdCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSksdGhpcy5fcG9zdChzKX19ZHJhd1NlbGVjdG9yKGUsdCl7dmFyIGkscztjb25zdCByPXtyZW5kZXI6W10sc3A6W2VdfTtlLnR5cGU9PT1tLlNlbGVjdCYmIXQmJigoaT1yLnJlbmRlcik9PW51bGx8fGkucHVzaCh7cmVjdDplLnNlbGVjdFJlY3QsZHJhd0NhbnZhczpOLlNlbGVjdG9yLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcixpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0se3JlY3Q6ZS5yZWN0JiZLKGUucmVjdCksaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHQmJigocz1yLnJlbmRlcik9PW51bGx8fHMucHVzaCh7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uRmxvYXQsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHRoaXMuX3Bvc3Qocil9YXN5bmMgZHJhd0VyYXNlcihlKXt2YXIgcixpO2NvbnN0IHQ9W107aWYoKHI9ZS5uZXdXb3JrRGF0YXMpIT1udWxsJiZyLnNpemUpe2Zvcihjb25zdCBzIG9mIGUubmV3V29ya0RhdGFzLnZhbHVlcygpKXtjb25zdCBuPXMud29ya0lkLnRvU3RyaW5nKCk7dGhpcy5iYXRjaEVyYXNlcldvcmtzLmFkZChuKSx0LnB1c2goe3R5cGU6bS5GdWxsV29yayx3b3JrSWQ6bixvcHM6bGUocy5vcCksb3B0OnMub3B0LHRvb2xzVHlwZTpzLnRvb2xzVHlwZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9fSl9ZGVsZXRlIGUubmV3V29ya0RhdGFzfShpPWUucmVtb3ZlSWRzKT09bnVsbHx8aS5mb3JFYWNoKHM9Pnt0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMuYWRkKHMpfSksdC5wdXNoKGUpLHRoaXMuX3Bvc3Qoe3NwOnR9KSx0aGlzLmJhdGNoRXJhc2VyQ29tYmluZSgpfWRyYXdQZW5jaWwoZSl7dGhpcy5fcG9zdCh7ZHJhd0NvdW50OnRoaXMuZHJhd0NvdW50LHNwOihlPT1udWxsP3ZvaWQgMDplLm9wKSYmW2VdfSl9ZHJhd1BlbmNpbEZ1bGwoZSx0LHIpe3ZhciBuO2xldCBpPShyPT1udWxsP3ZvaWQgMDpyLndpbGxDbGVhcil8fCh0PT1udWxsP3ZvaWQgMDp0LmlzT3BhY2l0eSl8fCExOyFpJiZlLnJlY3QmJihpPXRoaXMudk5vZGVzLmhhc1JlY3RJbnRlcnNlY3RSYW5nZShlLnJlY3QpKTtjb25zdCBzPXtkcmF3Q291bnQ6MS8wLHJlbmRlcjpbe3JlY3Q6ZS5yZWN0LGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOmksY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOltlXX07KG49cy5yZW5kZXIpPT1udWxsfHxuLnB1c2goe2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMuX3Bvc3Qocyl9dXBkYXRlQmF0Y2hFcmFzZXJDb21iaW5lTm9kZShlLHQpe2NvbnN0IHI9W107bGV0IGk7Zm9yKGNvbnN0IHMgb2YgdC5rZXlzKCkpdGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUocykuZm9yRWFjaChuPT57Y29uc3QgYT1uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2k9QShpLHt4OmEueC1uZS5TYWZlQm9yZGVyUGFkZGluZyx5OmEueS1uZS5TYWZlQm9yZGVyUGFkZGluZyx3OmEud2lkdGgrbmUuU2FmZUJvcmRlclBhZGRpbmcqMixoOmEuaGVpZ2h0K25lLlNhZmVCb3JkZXJQYWRkaW5nKjJ9KSxuLnJlbW92ZSgpfSk7cmV0dXJuIGUuZm9yRWFjaChzPT57Y29uc3Qgbj10aGlzLnZOb2Rlcy5nZXQocyk7aWYobilpZih0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShzKVswXSlpPUEoaSxuLnJlY3QpO2Vsc2V7Y29uc3QgbD10aGlzLnNldEZ1bGxXb3JrKHsuLi5uLHdvcmtJZDpzfSksYz1sJiZsLmNvbnN1bWVTZXJ2aWNlKHtvcDpuLm9wLGlzRnVsbFdvcms6ITB9KTtjJiYobi5yZWN0PWMsaT1BKGksYykpfX0pLGkmJnIucHVzaCh7cmVjdDppLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMCxjbGVhckNhbnZhczpOLkJnLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSxyfWFzeW5jIHJ1bkVmZmVjdFNlbGVjdFdvcmsoZSl7dmFyIHQscixpLHM7Zm9yKGNvbnN0IG4gb2YgdGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YS52YWx1ZXMoKSl7Y29uc3QgYT10aGlzLnNldEZ1bGxXb3JrKG4pO2lmKGEpe2lmKGEudG9vbHNUeXBlPT09Uy5JbWFnZSlhd2FpdCBhLmNvbnN1bWVTZXJ2aWNlQXN5bmMoe3NjZW5lOihyPSh0PXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6dC5wYXJlbnQpPT1udWxsP3ZvaWQgMDpyLnBhcmVudCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaT1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpfSk7ZWxzZXtjb25zdCBsPW4ub3BzJiZxZShuLm9wcyk7YS5jb25zdW1lU2VydmljZSh7b3A6bCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDoocz1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6cy50b1N0cmluZygpfSl9biE9bnVsbCYmbi51cGRhdGVOb2RlT3B0JiZhLnVwZGF0YU9wdFNlcnZpY2Uobi51cGRhdGVOb2RlT3B0KSxuLndvcmtJZCYmdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShuLndvcmtJZCl9fXRoaXMucmVSZW5kZXJTZWxlY3RvcihlKX1jdXJzb3JIb3ZlcihlKXt2YXIgbjtjb25zdHtvcHQ6dCx0b29sc1R5cGU6cixwb2ludDppfT1lLHM9dGhpcy5zZXRGdWxsV29yayh7d29ya0lkOktlLHRvb2xzVHlwZTpyLG9wdDp0fSk7aWYocyYmaSl7Y29uc3QgYT1zLmN1cnNvckhvdmVyKGkpLGw9e3JlbmRlcjpbXX07YSYmYS50eXBlPT09bS5DdXJzb3JIb3ZlciYmKChuPWwucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmEucmVjdCYmSyhhLnJlY3QpLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLl9wb3N0KGwpKX19fWNsYXNzIHVwe2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidk5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VsZWN0b3JXb3JrU2hhcGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJhbmltYXRpb25JZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgU2V0fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInJ1bkVmZmVjdElkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm5vQW5pbWF0aW9uUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJwb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy52aWV3SWQ9ZS52aWV3SWQsdGhpcy52Tm9kZXM9ZS52Tm9kZXMsdGhpcy5mdWxsTGF5ZXI9ZS5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXI9ZS5zZXJ2aWNlRHJhd0xheWVyLHRoaXMucG9zdD1lLnBvc3R9ZGVzdHJveSgpe3RoaXMud29ya1NoYXBlcy5jbGVhcigpLHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmNsZWFyKCksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuY2xlYXIoKX1jb25zdW1lRHJhdyhlKXt0aGlzLmFjdGl2ZVdvcmtTaGFwZShlKSx0aGlzLnJ1bkFuaW1hdGlvbigpfWNvbnN1bWVGdWxsKGUpe3RoaXMuYWN0aXZlV29ya1NoYXBlKGUpLHRoaXMucnVuQW5pbWF0aW9uKCl9Y2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKXt0aGlzLndvcmtTaGFwZXMuZm9yRWFjaCgoZSx0KT0+e2UudG9vbHNUeXBlPT09Uy5MYXNlclBlbj9zZXRUaW1lb3V0KCgpPT57dGhpcy53b3JrU2hhcGVzLmRlbGV0ZSh0KX0sMmUzKTp0aGlzLndvcmtTaGFwZXMuZGVsZXRlKHQpfSl9cnVuU2VsZWN0V29yayhlKXt0aGlzLmFjdGl2ZVNlbGVjdG9yU2hhcGUoZSk7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKHIpLHRoaXMucnVuRWZmZWN0KCl9c2V0Tm9kZUtleShlLHQscil7cmV0dXJuIGUudG9vbHNUeXBlPXQsZS5ub2RlPWJ0KHt0b29sc1R5cGU6dCx0b29sc09wdDpyLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfSx0aGlzKSxlfXJ1blJldmVyc2VTZWxlY3RXb3JrKGUpe2UuZm9yRWFjaCh0PT57dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZm9yRWFjaCgocixpKT0+e3ZhciBzO2lmKChzPXIuc2VsZWN0SWRzKSE9bnVsbCYmcy5sZW5ndGgpe2NvbnN0IG49ci5zZWxlY3RJZHMuaW5kZXhPZih0KTtuPi0xJiYoci5zZWxlY3RJZHMuc3BsaWNlKG4sMSksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKGkpKX19KX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLnNpemUmJnRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlV29yayhlKXtjb25zdHt3b3JrSWQ6dH09ZSxyPXQ9PW51bGw/dm9pZCAwOnQudG9TdHJpbmcoKTtpZihyKXtjb25zdCBpPXRoaXMud29ya1NoYXBlcy5nZXQocik7aWYoaSl7dGhpcy53b3JrU2hhcGVzLmRlbGV0ZShyKSx0aGlzLnJlbW92ZU5vZGUocixlLGk9PW51bGw/dm9pZCAwOmkudG90YWxSZWN0LCExKTtyZXR1cm59dGhpcy5yZW1vdmVOb2RlKHIsZSl9fXJlbW92ZVNlbGVjdFdvcmsoZSl7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmKHRoaXMuYWN0aXZlU2VsZWN0b3JTaGFwZShlKSx0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQocikpLHRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlTm9kZShlLHQscixpPSEwKXt2YXIgYztjb25zdCBzPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGUpLmNvbmNhdCh0aGlzLmRyYXdMYXllci5nZXRFbGVtZW50c0J5TmFtZShlKSk7ZS5pbmRleE9mKEUuc2VsZWN0b3JJZCk+LTEmJnRoaXMucmVtb3ZlU2VsZWN0V29yayh0KTtjb25zdCBuPVtdO2xldCBhPXI7Y29uc3QgbD0oYz10aGlzLnZOb2Rlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpjLnJlY3Q7bCYmKGE9QShsLGEpKSxzLmZvckVhY2godT0+e24ucHVzaCh1KX0pLG4ubGVuZ3RoJiZuLmZvckVhY2godT0+dS5yZW1vdmUoKSksYSYmKHRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGEpLGlzQ2xlYXI6ITAsaXNGdWxsV29yazppLGNsZWFyQ2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCxkcmF3Q2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCx3b3JrZXJUeXBlOmk/dm9pZCAwOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMudk5vZGVzLmRlbGV0ZShlKSl9YWN0aXZlV29ya1NoYXBlKGUpe3ZhciBkLGYsdyx5O2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsb3A6bCx1c2VBbmltYXRpb246Y309ZTtpZighdClyZXR1cm47Y29uc3QgdT10LnRvU3RyaW5nKCk7aWYoISgoZD10aGlzLndvcmtTaGFwZXMpIT1udWxsJiZkLmhhcyh1KSkpe2xldCBnPXt0b29sc1R5cGU6aSxhbmltYXRpb25Xb3JrRGF0YTpsfHxbXSxhbmltYXRpb25JbmRleDowLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsdXNlQW5pbWF0aW9uOnR5cGVvZiBjPCJ1Ij9jOnR5cGVvZihuPT1udWxsP3ZvaWQgMDpuLnVzZUFuaW1hdGlvbik8InUiP249PW51bGw/dm9pZCAwOm4udXNlQW5pbWF0aW9uOiEwLG9sZFJlY3Q6KGY9dGhpcy52Tm9kZXMuZ2V0KHUpKT09bnVsbD92b2lkIDA6Zi5yZWN0LGlzRGlmZjohMX07aSYmciYmKGc9dGhpcy5zZXROb2RlS2V5KGcsaSxyKSksKHc9dGhpcy53b3JrU2hhcGVzKT09bnVsbHx8dy5zZXQodSxnKX1jb25zdCBoPSh5PXRoaXMud29ya1NoYXBlcyk9PW51bGw/dm9pZCAwOnkuZ2V0KHUpO3MmJihoLnR5cGU9cyksYSYmKGguYW5pbWF0aW9uV29ya0RhdGE9cWUoYSksaC5vcHM9YSksbiYmKGgudXBkYXRlTm9kZU9wdD1uKSxsJiYoaC5pc0RpZmY9dGhpcy5oYXNEaWZmRGF0YShoLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxsLGgudG9vbHNUeXBlKSxoLmFuaW1hdGlvbldvcmtEYXRhPWwpLGgubm9kZSYmaC5ub2RlLmdldFdvcmtJZCgpIT09dSYmaC5ub2RlLnNldFdvcmtJZCh1KSxpJiZyJiYoaC50b29sc1R5cGUhPT1pJiZpJiZyJiZ0aGlzLnNldE5vZGVLZXkoaCxpLHIpLGgubm9kZSYmaC5ub2RlLnNldFdvcmtPcHRpb25zKHIpKX1oYXNEaWZmRGF0YShlLHQscil7Y29uc3QgaT1lLmxlbmd0aDtpZih0Lmxlbmd0aDxpKXJldHVybiEwO3N3aXRjaChyKXtjYXNlIFMuUGVuY2lsOntmb3IobGV0IHM9MDtzPGk7cys9MylpZih0W3NdIT09ZVtzXXx8dFtzKzFdIT09ZVtzKzFdKXJldHVybiEwO2JyZWFrfWNhc2UgUy5MYXNlclBlbjp7Zm9yKGxldCBzPTA7czxpO3MrPTIpaWYodFtzXSE9PWVbc118fHRbcysxXSE9PWVbcysxXSlyZXR1cm4hMDticmVha319cmV0dXJuITF9YXN5bmMgYW5pbWF0aW9uRHJhdygpe3ZhciBsLGMsdSxoLGQsZix3LHksZyxQLGssTyxJLGIsdixMLFQsTSwkLEQsSCxWLGVlLHNlLG5vLGFvLGxvLGNvLHVvLGhvO3RoaXMuYW5pbWF0aW9uSWQ9dm9pZCAwO2xldCBlPSExO2NvbnN0IHQ9bmV3IE1hcCxyPVtdLGk9W10scz1bXSxuPVtdO2Zvcihjb25zdFtqLENdb2YgdGhpcy53b3JrU2hhcGVzLmVudHJpZXMoKSlzd2l0Y2goQy50b29sc1R5cGUpe2Nhc2UgUy5JbWFnZTp7Y29uc3QgXz1DLm9sZFJlY3Q7XyYmcy5wdXNoKHtyZWN0Ol8saXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2NvbnN0IFo9YXdhaXQoKGM9Qy5ub2RlKT09bnVsbD92b2lkIDA6Yy5jb25zdW1lU2VydmljZUFzeW5jKHtpc0Z1bGxXb3JrOiEwLHNjZW5lOihsPXRoaXMuZnVsbExheWVyLnBhcmVudCk9PW51bGw/dm9pZCAwOmwucGFyZW50fSkpO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PUEodGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopLHIucHVzaCh7cmVjdDpaLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2JyZWFrfWNhc2UgUy5UZXh0OntpZihDLm5vZGUpe2NvbnN0IF89Qy5vbGRSZWN0LFo9KHU9Qy5ub2RlKT09bnVsbD92b2lkIDA6dS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMH0pO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PUEodGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSwoaD1DLm5vZGUpPT1udWxsfHxoLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX1icmVha31jYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246e2NvbnN0IF89ISFDLm9wcztpZigoZD1DLmFuaW1hdGlvbldvcmtEYXRhKSE9bnVsbCYmZC5sZW5ndGgpe2NvbnN0IFo9Qy5vbGRSZWN0LHRlPUMubm9kZS5vbGRSZWN0O1omJnMucHVzaCh7cmVjdDpaLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0ZSYmbi5wdXNoKHtyZWN0OnRlLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSk7Y29uc3QgSj0oZj1DLm5vZGUpPT1udWxsP3ZvaWQgMDpmLmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhLGlzRnVsbFdvcms6X30pO3Quc2V0KGose3dvcmtTdGF0ZTpaP0Mub3BzP0YuRG9uZTpGLkRvaW5nOkYuU3RhcnQsb3A6Qy5hbmltYXRpb25Xb3JrRGF0YS5maWx0ZXIoKFksZGUpPT57aWYoZGUlMyE9PTIpcmV0dXJuITB9KS5zbGljZSgtMil9KSxfPyh0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKChZLGRlKT0+e3ZhciBSZTsoUmU9WS5zZWxlY3RJZHMpIT1udWxsJiZSZS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChkZSksdGhpcy5ub0FuaW1hdGlvblJlY3Q9QSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxaKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LHRlKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1BKHRoaXMubm9BbmltYXRpb25SZWN0LEopLHRoaXMucnVuRWZmZWN0KCkpfSksKHc9Qy5ub2RlKT09bnVsbHx8dy5jbGVhclRtcFBvaW50cygpLHRoaXMud29ya1NoYXBlcy5kZWxldGUoaiksci5wdXNoKHtyZWN0OkosZHJhd0NhbnZhczpOLkJnLGlzRnVsbFdvcms6Xyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkMuYW5pbWF0aW9uV29ya0RhdGEuZmlsdGVyKChZLGRlKT0+e2lmKGRlJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpfSkpOmkucHVzaCh7cmVjdDpKLGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsd29ya2VyVHlwZTpfP3ZvaWQgMDpXLlNlcnZpY2UsaXNGdWxsV29yazpfLHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uV29ya0RhdGEubGVuZ3RoPTB9YnJlYWt9Y2FzZSBTLlBlbmNpbDp7aWYoIUMudXNlQW5pbWF0aW9uJiZDLm9wcyl7bGV0IF89KHk9Qy5ub2RlKT09bnVsbD92b2lkIDA6eS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMCxyZXBsYWNlSWQ6an0pO2NvbnN0IFo9KGc9Qy5ub2RlKT09bnVsbD92b2lkIDA6Zy51cGRhdGFPcHRTZXJ2aWNlKEMudXBkYXRlTm9kZU9wdCk7Xz1BKF8sWikscy5wdXNoKHtyZWN0OkEoQy5vbGRSZWN0LF8pLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0OkEoQy5vbGRSZWN0LF8pLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKCh0ZSxKKT0+e3ZhciBZOyhZPXRlLnNlbGVjdElkcykhPW51bGwmJlkuaW5jbHVkZXMoaikmJih0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQoSiksdGhpcy5ub0FuaW1hdGlvblJlY3Q9QSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxfKSx0aGlzLnJ1bkVmZmVjdCgpKX0pLChQPUMubm9kZSk9PW51bGx8fFAuY2xlYXJUbXBQb2ludHMoKSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopfWVsc2UgaWYoQy51c2VBbmltYXRpb24pe2NvbnN0IFo9dGhpcy5jb21wdXROZXh0QW5pbWF0aW9uSW5kZXgoQywzKSx0ZT1DLmlzRGlmZj8wOk1hdGgubWF4KDAsKEMuYW5pbWF0aW9uSW5kZXh8fDApLTMpLEo9KEMuYW5pbWF0aW9uV29ya0RhdGF8fFtdKS5zbGljZSh0ZSxaKTtpZihDLmlzRGVsKUMuaXNEZWwmJigoTT1DLm5vZGUpPT1udWxsfHxNLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKSk7ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wnx8Qy5pc0RpZmYpe2NvbnN0IFk9KE89Qy5ub2RlKT09bnVsbD92b2lkIDA6Ty5jb25zdW1lU2VydmljZSh7b3A6Sixpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaz1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDprLnRvU3RyaW5nKCl9KTtpZihpLnB1c2goe3JlY3Q6WSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uSW5kZXg9WixDLmlzRGlmZiYmKEMuaXNEaWZmPSExKSxKLmxlbmd0aCl7Y29uc3QgZGU9Si5maWx0ZXIoKFJlLHdwKT0+e2lmKHdwJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpO3Quc2V0KGose3dvcmtTdGF0ZTp0ZT09PTA/Ri5TdGFydDpaPT09KChJPUMuYW5pbWF0aW9uV29ya0RhdGEpPT1udWxsP3ZvaWQgMDpJLmxlbmd0aCk/Ri5Eb25lOkYuRG9pbmcsb3A6ZGV9KX19ZWxzZSBpZihDLm9wcyl7Y29uc3QgWT0odj1DLm5vZGUpPT1udWxsP3ZvaWQgMDp2LmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDooYj1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDpiLnRvU3RyaW5nKCl9KTtDLmlzRGVsPSEwLG4ucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLChMPUMubm9kZSkhPW51bGwmJkwuZ2V0V29ya09wdGlvbnMoKS5pc09wYWNpdHkmJnMucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0OlksZHJhd0NhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMudk5vZGVzLnNldEluZm8oaix7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YSxvcHQ6KFQ9Qy5ub2RlKT09bnVsbD92b2lkIDA6VC5nZXRXb3JrT3B0aW9ucygpLHRvb2xzVHlwZTpDLnRvb2xzVHlwZSxyZWN0Oll9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkouZmlsdGVyKChkZSxSZSk9PntpZihSZSUzIT09MilyZXR1cm4hMH0pLnNsaWNlKC0yKX0pfWU9ITB9YnJlYWt9YnJlYWt9Y2FzZSBTLkxhc2VyUGVuOntjb25zdCBaPXRoaXMuY29tcHV0TmV4dEFuaW1hdGlvbkluZGV4KEMsMiksdGU9TWF0aC5tYXgoMCwoQy5hbmltYXRpb25JbmRleHx8MCktMiksSj0oQy5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKHRlLFopO2lmKEMuaXNEZWwpe2lmKEMuaXNEZWwpe2NvbnN0IFk9KHNlPUMubm9kZSk9PW51bGw/dm9pZCAwOnNlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9QShDLnRvdGFsUmVjdCxZKSxuLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksKG5vPUMubm9kZSk9PW51bGx8fG5vLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX19ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wil7Y29uc3QgWT0oRD1DLm5vZGUpPT1udWxsP3ZvaWQgMDpELmNvbnN1bWVTZXJ2aWNlKHtvcDpKLGlzRnVsbFdvcms6ITEscmVwbGFjZUlkOigkPUMubm9kZS5nZXRXb3JrSWQoKSk9PW51bGw/dm9pZCAwOiQudG9TdHJpbmcoKX0pO0MudG90YWxSZWN0PUEoQy50b3RhbFJlY3QsWSksQy50aW1lciYmKGNsZWFyVGltZW91dChDLnRpbWVyKSxDLnRpbWVyPXZvaWQgMCksQy5hbmltYXRpb25JbmRleD1aLEoubGVuZ3RoJiZ0LnNldChqLHt3b3JrU3RhdGU6dGU9PT0wP0YuU3RhcnQ6Wj09PSgoSD1DLmFuaW1hdGlvbldvcmtEYXRhKT09bnVsbD92b2lkIDA6SC5sZW5ndGgpP0YuRG9uZTpGLkRvaW5nLG9wOkouc2xpY2UoLTIpfSl9ZWxzZXtDLnRpbWVyfHwoQy50aW1lcj1zZXRUaW1lb3V0KCgpPT57Qy50aW1lcj12b2lkIDAsQy5pc0RlbD0hMCx0aGlzLnJ1bkFuaW1hdGlvbigpfSwoKFY9Qy5ub2RlKT09bnVsbD92b2lkIDA6Vi5nZXRXb3JrT3B0aW9ucygpKS5kdXJhdGlvbioxZTMrMTAwKSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOltdfSkpO2NvbnN0IFk9KGVlPUMubm9kZSk9PW51bGw/dm9pZCAwOmVlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9QShDLnRvdGFsUmVjdCxZKX1uLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksZT0hMH1icmVha319ZSYmdGhpcy5ydW5BbmltYXRpb24oKTtjb25zdCBhPXtyZW5kZXI6W119O2lmKHMubGVuZ3RoKXtjb25zdCBqPXMucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmNsZWFyQ2FudmFzPT09Ti5CZyYmKEMucmVjdD1BKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwoYW89YS5yZW5kZXIpPT1udWxsfHxhby5wdXNoKGopKX1pZihuLmxlbmd0aCl7Y29uc3Qgaj1uLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5jbGVhckNhbnZhcz09PU4uU2VydmljZUZsb2F0JiYoQy5yZWN0PUEoQy5yZWN0LF8ucmVjdCkpLEMpLHtpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwobG89YS5yZW5kZXIpPT1udWxsfHxsby5wdXNoKGopKX1pZihyLmxlbmd0aCl7Y29uc3Qgaj1yLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5kcmF3Q2FudmFzPT09Ti5CZyYmKEMucmVjdD1BKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMCxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSk7ai5yZWN0JiYoai5yZWN0PWoucmVjdCYmSyhqLnJlY3QpLChjbz1hLnJlbmRlcik9PW51bGx8fGNvLnB1c2goaikpfWlmKGkubGVuZ3RoKXtjb25zdCBqPWkucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmRyYXdDYW52YXM9PT1OLlNlcnZpY2VGbG9hdCYmKEMucmVjdD1BKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwodW89YS5yZW5kZXIpPT1udWxsfHx1by5wdXNoKGopKX10LnNpemUmJihhLnNwPVtdLHQuZm9yRWFjaCgoaixDKT0+e3ZhciBfOyhfPWEuc3ApPT1udWxsfHxfLnB1c2goe3R5cGU6bS5DdXJzb3IsdWlkOkMuc3BsaXQoVmgpWzBdLG9wOmoub3Asd29ya1N0YXRlOmoud29ya1N0YXRlLHZpZXdJZDp0aGlzLnZpZXdJZH0pfSkpLChobz1hLnJlbmRlcikhPW51bGwmJmhvLmxlbmd0aCYmdGhpcy5wb3N0KGEpfXJ1bkFuaW1hdGlvbigpe3RoaXMuYW5pbWF0aW9uSWR8fCh0aGlzLmFuaW1hdGlvbklkPXJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkRyYXcuYmluZCh0aGlzKSkpfWNvbXB1dE5leHRBbmltYXRpb25JbmRleChlLHQpe3ZhciBpO2NvbnN0IHI9TWF0aC5mbG9vcigoZS5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKGUuYW5pbWF0aW9uSW5kZXgpLmxlbmd0aCozMi90LygoKGk9ZS5ub2RlKT09bnVsbD92b2lkIDA6aS5zeW5jVW5pdFRpbWUpfHwxZTMpKSp0O3JldHVybiBNYXRoLm1pbigoZS5hbmltYXRpb25JbmRleHx8MCkrKHJ8fHQpLChlLmFuaW1hdGlvbldvcmtEYXRhfHxbXSkubGVuZ3RoKX1ydW5FZmZlY3QoKXt0aGlzLnJ1bkVmZmVjdElkfHwodGhpcy5ydW5FZmZlY3RJZD1zZXRUaW1lb3V0KHRoaXMuZWZmZWN0UnVuU2VsZWN0b3IuYmluZCh0aGlzKSwwKSl9ZWZmZWN0UnVuU2VsZWN0b3IoKXt0aGlzLnJ1bkVmZmVjdElkPXZvaWQgMDtsZXQgZT10aGlzLm5vQW5pbWF0aW9uUmVjdDt0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5mb3JFYWNoKHQ9Pnt2YXIgcyxuO2NvbnN0IHI9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZ2V0KHQpLGk9ciYmci5zZWxlY3RJZHMmJigocz1yLm5vZGUpPT1udWxsP3ZvaWQgMDpzLnNlbGVjdFNlcnZpY2VOb2RlKHQsciwhMCkpO2U9QShlLGkpLChuPXI9PW51bGw/dm9pZCAwOnIuc2VsZWN0SWRzKSE9bnVsbCYmbi5sZW5ndGh8fHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmRlbGV0ZSh0KX0pLGUmJnRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGUpLGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmNsZWFyKCksdGhpcy5ub0FuaW1hdGlvblJlY3Q9dm9pZCAwfWFjdGl2ZVNlbGVjdG9yU2hhcGUoZSl7dmFyIGMsdSxoO2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyxzZWxlY3RJZHM6bn09ZTtpZighdClyZXR1cm47Y29uc3QgYT10LnRvU3RyaW5nKCk7aWYoISgoYz10aGlzLnNlbGVjdG9yV29ya1NoYXBlcykhPW51bGwmJmMuaGFzKGEpKSl7bGV0IGQ9e3Rvb2xzVHlwZTppLHNlbGVjdElkczpuLHR5cGU6cyxvcHQ6cn07aSYmciYmKGQ9dGhpcy5zZXROb2RlS2V5KGQsaSxyKSksKHU9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsfHx1LnNldChhLGQpfWNvbnN0IGw9KGg9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsP3ZvaWQgMDpoLmdldChhKTtzJiYobC50eXBlPXMpLGwubm9kZSYmbC5ub2RlLmdldFdvcmtJZCgpIT09YSYmbC5ub2RlLnNldFdvcmtJZChhKSxsLnNlbGVjdElkcz1ufHxbXX19Y2xhc3MgaHAgZXh0ZW5kcyByb3tjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYW5pbWF0aW9uV29ya1JlY3RzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb21iaW5lRHJhd1RpbWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImFuaW1hdGlvbklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNsb3NlQW5pbWF0aW9uVGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjExMDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywicnVuTGFzZXJQZW5TdGVwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pfWFzeW5jIHJ1bkZ1bGxXb3JrKGUsdCl7dmFyIHMsbjtjb25zdCByPXRoaXMuc2V0RnVsbFdvcmsoZSksaT1lLm9wcyYmcWUoZS5vcHMpO2lmKHIpe2xldCBhO3IudG9vbHNUeXBlPT09Uy5JbWFnZT9hPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7aXNGdWxsV29yazohMCxzY2VuZToocz10aGlzLmZ1bGxMYXllci5wYXJlbnQpPT1udWxsP3ZvaWQgMDpzLnBhcmVudH0pOmE9ci5jb25zdW1lU2VydmljZSh7b3A6aSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDoobj1yLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpLGlzRHJhd0xhYmVsOnR9KTtjb25zdCBsPShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtyZXR1cm4gZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpLGx8fGF9fXJ1blNlbGVjdFdvcmsoZSl7dmFyIHI7Y29uc3QgdD10aGlzLnNldEZ1bGxXb3JrKGUpO3QmJigocj1lLnNlbGVjdElkcykhPW51bGwmJnIubGVuZ3RoKSYmZS53b3JrSWQmJnQuc2VsZWN0U2VydmljZU5vZGUoZS53b3JrSWQudG9TdHJpbmcoKSx7c2VsZWN0SWRzOmUuc2VsZWN0SWRzfSwhMSl9Y29uc3VtZURyYXcoZSl7dmFyIGk7Y29uc3R7b3A6dCx3b3JrSWQ6cn09ZTtpZih0IT1udWxsJiZ0Lmxlbmd0aCYmcil7Y29uc3Qgcz10aGlzLndvcmtTaGFwZXMuZ2V0KHIpO2lmKCFzKXJldHVybjtjb25zdCBuPXMudG9vbHNUeXBlLGE9cy5jb25zdW1lKHtkYXRhOmUsaXNGdWxsV29yazohMSxpc0NsZWFyQWxsOiEwLGlzU3ViV29ya2VyOiEwfSk7c3dpdGNoKG4pe2Nhc2UgUy5MYXNlclBlbjphIT1udWxsJiZhLnJlY3QmJigoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuc2V0KHIse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSksdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbigpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdBcnJvdyhhKSk7YnJlYWs7Y2FzZSBTLlBlbmNpbDphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrfX19Y29uc3VtZURyYXdBbGwoZSl7dmFyIHIsaTtjb25zdHt3b3JrSWQ6dH09ZTtpZih0KXtjb25zdCBzPXRoaXMud29ya1NoYXBlcy5nZXQodCk7aWYoIXMpcmV0dXJuO3N3aXRjaChzLnRvb2xzVHlwZSl7Y2FzZSBTLkxhc2VyUGVuOmlmKHRoaXMuYW5pbWF0aW9uSWQpe2NvbnN0IGE9cy5jb25zdW1lQWxsKHtkYXRhOmV9KTthIT1udWxsJiZhLm9wJiZhIT1udWxsJiZhLnJlY3QmJigocj10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fHIuc2V0KHQse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSx0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKGEpKTtjb25zdCBsPShpPXMuZ2V0V29ya09wdGlvbnMoKSk9PW51bGw/dm9pZCAwOmkuZHVyYXRpb247dGhpcy5jbG9zZUFuaW1hdGlvblRpbWU9bD9sKjFlMysxMDA6dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUsc2V0VGltZW91dCgoKT0+e3ZhciB1O3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQudG9TdHJpbmcoKSkubWFwKGg9PmgucmVtb3ZlKCkpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7Y29uc3QgYz0odT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGw/dm9pZCAwOnUuZ2V0KHQpO2MmJihjLmNhbkRlbD0hMCksc2V0VGltZW91dCgoKT0+e3RoaXMuX3Bvc3Qoe3NwOlt7cmVtb3ZlSWRzOlt0LnRvU3RyaW5nKCldLHR5cGU6bS5SZW1vdmVOb2RlfV19KX0scy5nZXRXb3JrT3B0aW9ucygpLnN5bmNVbml0VGltZXx8dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUpfSx0aGlzLmNsb3NlQW5pbWF0aW9uVGltZSl9YnJlYWs7Y2FzZSBTLkFycm93OmNhc2UgUy5TdHJhaWdodDpjYXNlIFMuRWxsaXBzZTpjYXNlIFMuUGVuY2lsOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246dGhpcy5kcmF3Q291bnQ9MCx0aGlzLmZ1bGxMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7YnJlYWt9fX11cGRhdGVMYWJlbHMoZSx0KXtlLmNoaWxkcmVuLmZvckVhY2gocj0+e2lmKHIudGFnTmFtZT09PSJMQUJFTCIpe2NvbnN0IGk9ci5uYW1lLHt3aWR0aDpzfT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFtuXT1lLndvcmxkU2NhbGluZyx7dW5kZXJsaW5lOmEsbGluZVRocm91Z2g6bH09dC5vcHQ7YSYmZS5nZXRFbGVtZW50c0J5TmFtZShgJHtpfV91bmRlcmxpbmVgKVswXS5hdHRyKHtwb2ludHM6WzAsMCxzL24sMF19KSxsJiZlLmdldEVsZW1lbnRzQnlOYW1lKGAke2l9X2xpbmVUaHJvdWdoYClbMF0uYXR0cih7cG9pbnRzOlswLDAscy9uLDBdfSl9fSl9cnVuTGFzZXJQZW5BbmltYXRpb24oZSl7dGhpcy5hbmltYXRpb25JZHx8KHRoaXMuYW5pbWF0aW9uSWQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57dmFyIGkscztpZih0aGlzLmFuaW1hdGlvbklkPXZvaWQgMCx0aGlzLnJ1bkxhc2VyUGVuU3RlcCsrLHRoaXMucnVuTGFzZXJQZW5TdGVwPjEpe3RoaXMucnVuTGFzZXJQZW5TdGVwPTAsdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbihlKTtyZXR1cm59bGV0IHQ7Y29uc3Qgcj1bXTsoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuZm9yRWFjaCgobixhLGwpPT57bi5pc1JlY3QmJih0PUEodCxuLnJlcy5yZWN0KSksbi5yZXMud29ya0lkJiZyLnB1c2gobi5yZXMpLHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGEudG9TdHJpbmcoKSkubGVuZ3RoP24uaXNSZWN0PSEwOm4uaXNSZWN0PSExLG4uY2FuRGVsJiZsLmRlbGV0ZShhKX0pLChzPXRoaXMuYW5pbWF0aW9uV29ya1JlY3RzKSE9bnVsbCYmcy5zaXplJiZ0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKCksdCYmKGUmJnIucHVzaChlKSx0aGlzLl9wb3N0KHtyZW5kZXI6W3tyZWN0OksodCksZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnJ9KSl9KSl9ZHJhd1BlbmNpbChlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDplPT1udWxsP3ZvaWQgMDplLnJlY3QsZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITEsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XSxzcDooZT09bnVsbD92b2lkIDA6ZS5vcCkmJltlXX0pfWRyYXdBcnJvdyhlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDooZT09bnVsbD92b2lkIDA6ZS5yZWN0KSYmSyhlLnJlY3QpLGRyYXdDYW52YXM6Ti5GbG9hdCxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uRmxvYXQsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pfX12YXIgV2U7KGZ1bmN0aW9uKG8pe28uRnVsbD0iZnVsbCIsby5TdWI9InN1YiJ9KShXZXx8KFdlPXt9KSk7Y2xhc3MgZHB7Y29uc3RydWN0b3IoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3NlbGYiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrVGhyZWFkTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLHRoaXMuX3NlbGY9ZSx0aGlzLnR5cGU9dCx0aGlzLnJlZ2lzdGVyKCl9aW5pdChlKXtjb25zdHt2aWV3SWQ6dCxkcHI6cixvZmZzY3JlZW5DYW52YXNPcHQ6aSxsYXllck9wdDpzLGlzU2FmYXJpOm59PWU7aWYoIXJ8fCFpfHwhcylyZXR1cm47bGV0IGE7dGhpcy50eXBlPT09V2UuRnVsbCYmKGE9bmV3IGZwKHQse2RwcjpyLG9mZnNjcmVlbkNhbnZhc09wdDppLGxheWVyT3B0OnN9LHRoaXMucG9zdC5iaW5kKHRoaXMpKSksdGhpcy50eXBlPT09V2UuU3ViJiYoYT1uZXcgcHAodCx7ZHByOnIsb2Zmc2NyZWVuQ2FudmFzT3B0OmksbGF5ZXJPcHQ6c30sdGhpcy5wb3N0LmJpbmQodGhpcykpKSxhJiZuJiZhLnNldElzU2FmYXJpKG4pLGEmJmUuY2FtZXJhT3B0JiZhLnNldENhbWVyYU9wdChlLmNhbWVyYU9wdCksYSYmdGhpcy53b3JrVGhyZWFkTWFwLnNldCh0LGEpfXJlZ2lzdGVyKCl7b25tZXNzYWdlPWU9Pntjb25zdCB0PWUuZGF0YTtpZih0KWZvcihjb25zdCByIG9mIHQudmFsdWVzKCkpe2NvbnN0e21zZ1R5cGU6aSx2aWV3SWQ6cyx0YXNrc3F1ZXVlOm4sbWFpblRhc2tzcXVldWVDb3VudDphfT1yO2lmKGk9PT1tLkluaXQpe3RoaXMuaW5pdChyKTtjb250aW51ZX1pZihpPT09bS5UYXNrc1F1ZXVlJiYobiE9bnVsbCYmbi5zaXplKSYmYSl7dGhpcy53b3JrVGhyZWFkTWFwLmZvckVhY2goKGMsdSk9Pntjb25zdCBoPW4uZ2V0KHUpO2gmJmMub24oaCksdGhpcy5wb3N0KHt3b3JrZXJUYXNrc3F1ZXVlQ291bnQ6YX0pfSk7Y29udGludWV9aWYocz09PXRkKXt0aGlzLndvcmtUaHJlYWRNYXAuZm9yRWFjaChjPT57Yy5vbihyKSxpPT09bS5EZXN0cm95JiZ0aGlzLndvcmtUaHJlYWRNYXAuZGVsZXRlKHMpfSk7Y29udGludWV9Y29uc3QgbD10aGlzLndvcmtUaHJlYWRNYXAuZ2V0KHMpO2wmJihsLm9uKHIpLGk9PT1tLkRlc3Ryb3kmJnRoaXMud29ya1RocmVhZE1hcC5kZWxldGUocykpfX19cG9zdChlLHQpe3Q/dGhpcy5fc2VsZi5wb3N0TWVzc2FnZShlLHQpOnRoaXMuX3NlbGYucG9zdE1lc3NhZ2UoZSl9fWNsYXNzIGZwIGV4dGVuZHMgdG97Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VEcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNuYXBzaG90RnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm1ldGhvZEJ1aWxkZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywibG9jYWxXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIl9wb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy5fcG9zdD1yLHRoaXMuc2VydmljZURyYXdMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzZXJ2aWNlRHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSksdGhpcy5kcmF3TGF5ZXI9dGhpcy5jcmVhdGVMYXllcigiZHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSk7Y29uc3QgaT17dGhyZWFkOnRoaXMsdmlld0lkOnRoaXMudmlld0lkLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyLHBvc3Q6dGhpcy5wb3N0LmJpbmQodGhpcyl9O3RoaXMubG9jYWxXb3JrPW5ldyBjcChpKSx0aGlzLnNlcnZpY2VXb3JrPW5ldyB1cCh7Li4uaSxzZXJ2aWNlRHJhd0xheWVyOnRoaXMuc2VydmljZURyYXdMYXllcn0pLHRoaXMubWV0aG9kQnVpbGRlcj1uZXcgeGYoW0IuQ29weU5vZGUsQi5TZXRDb2xvck5vZGUsQi5EZWxldGVOb2RlLEIuUm90YXRlTm9kZSxCLlNjYWxlTm9kZSxCLlRyYW5zbGF0ZU5vZGUsQi5aSW5kZXhBY3RpdmUsQi5aSW5kZXhOb2RlLEIuU2V0Rm9udFN0eWxlLEIuU2V0UG9pbnQsQi5TZXRMb2NrLEIuU2V0U2hhcGVPcHRdKS5yZWdpc3RlckZvcldvcmtlcih0aGlzLmxvY2FsV29yayx0aGlzLnNlcnZpY2VXb3JrLHRoaXMuc2NlbmUpLHRoaXMudk5vZGVzLmluaXQodGhpcy5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXIpfWFzeW5jIHBvc3QoZSx0KXt2YXIgYSxsLGM7Y29uc3Qgcj1lLnJlbmRlcixpPVtdO2xldCBzPXQ7aWYociE9bnVsbCYmci5sZW5ndGgpe2Zvcihjb25zdCB1IG9mIHIpe2lmKHUuaXNDbGVhckFsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLHUuaXNDbGVhcj0hMCxkZWxldGUgdS5pc0NsZWFyQWxsKSx1LmlzRHJhd0FsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLGRlbGV0ZSB1LmlzRHJhd0FsbCksdS5kcmF3Q2FudmFzKXtjb25zdCBoPXRoaXMuZ2V0TGF5ZXIodS5pc0Z1bGxXb3JrLHUud29ya2VyVHlwZSk7KGg9PW51bGw/dm9pZCAwOmgucGFyZW50KS5yZW5kZXIoKX1pZih1LnJlY3Qpe3UuY2xlYXJDYW52YXM9PT11LmRyYXdDYW52YXMmJnUuZHJhd0NhbnZhcz09PU4uQmcmJih1LnJlY3Q9dGhpcy5jaGVja1JpZ2h0UmVjdEJvdW5kaW5nQm94KHUucmVjdCkpO2NvbnN0IGg9dS5kcmF3Q2FudmFzPT09Ti5TZWxlY3RvciYmdS5yZWN0O2lmKHUucmVjdD10aGlzLnNhZmFyaUZpeFJlY3QocmUodS5yZWN0KSksIXUucmVjdCljb250aW51ZTtpZih1LmRyYXdDYW52YXM9PT1OLlNlbGVjdG9yKXtjb25zdCBkPShhPWUuc3ApPT1udWxsP3ZvaWQgMDphLmZpbmQoZj0+Zi50eXBlPT09bS5TZWxlY3QpO2QmJihkLnJlY3Q9dS5yZWN0KSxoJiYodS5vZmZzZXQ9e3g6dS5yZWN0LngtaC54LHk6dS5yZWN0LnktaC55fSl9aWYodS5kcmF3Q2FudmFzKXtjb25zdCBkPWF3YWl0IHRoaXMuZ2V0UmVjdEltYWdlQml0bWFwKHUucmVjdCwhIXUuaXNGdWxsV29yayx1LndvcmtlclR5cGUpO3UuaW1hZ2VCaXRtYXA9ZCxzfHwocz1bXSkscy5wdXNoKGQpfWkucHVzaCh1KX19ZS5yZW5kZXI9aX1jb25zdCBuPShsPWUuc3ApPT1udWxsP3ZvaWQgMDpsLmZpbHRlcih1PT51LnR5cGUhPT1tLk5vbmV8fE9iamVjdC5rZXlzKHUpLmZpbHRlcihoPT5oPT09InR5cGUiKS5sZW5ndGgpO2lmKG4hPW51bGwmJm4ubGVuZ3RoJiYoZS5zcD1uLm1hcCh1PT4oey4uLnUsdmlld0lkOnRoaXMudmlld0lkfSkpKSwoZS5kcmF3Q291bnR8fGUud29ya2VyVGFza3NxdWV1ZUNvdW50fHwoYz1lLnNwKSE9bnVsbCYmYy5sZW5ndGh8fGkhPW51bGwmJmkubGVuZ3RoKSYmKHRoaXMuX3Bvc3QoZSxzKSxzIT1udWxsJiZzLmxlbmd0aCkpZm9yKGNvbnN0IHUgb2Ygcyl1IGluc3RhbmNlb2YgSW1hZ2VCaXRtYXAmJnUuY2xvc2UoKX1vbihlKXtpZih0aGlzLm1ldGhvZEJ1aWxkZXIuY29uc3VtZUZvcldvcmtlcihlKSlyZXR1cm47Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsd29ya0lkOml9PWU7c3dpdGNoKHQpe2Nhc2UgbS5VcGRhdGVDYW1lcmE6dGhpcy51cGRhdGVDYW1lcmEoZSk7YnJlYWs7Y2FzZSBtLlNlbGVjdDpyPT09Vy5TZXJ2aWNlJiYoaT09PUUuc2VsZWN0b3JJZD90aGlzLmxvY2FsV29yay51cGRhdGVGdWxsU2VsZWN0V29yayhlKTp0aGlzLnNlcnZpY2VXb3JrLnJ1blNlbGVjdFdvcmsoZSkpO2JyZWFrO2Nhc2UgbS5VcGRhdGVOb2RlOmNhc2UgbS5GdWxsV29yazp0aGlzLmNvbnN1bWVGdWxsKHIsZSk7YnJlYWs7Y2FzZSBtLlJlbW92ZU5vZGU6dGhpcy5yZW1vdmVOb2RlKGUpO2JyZWFrO2Nhc2UgbS5HZXRUZXh0QWN0aXZlOnRoaXMuY2hlY2tUZXh0QWN0aXZlKGUpO2JyZWFrO2Nhc2UgbS5DdXJzb3JIb3Zlcjp0aGlzLmN1cnNvckhvdmVyKGUpfXN1cGVyLm9uKGUpfWFzeW5jIHJlbW92ZU5vZGUoZSl7Y29uc3R7ZGF0YVR5cGU6dCx3b3JrSWQ6cn09ZTtpZihyPT09RS5zZWxlY3RvcklkKXt0aGlzLmxvY2FsV29yay5ibHVyU2VsZWN0b3IoZSk7cmV0dXJufXQ9PT1XLkxvY2FsJiYodGhpcy5sb2NhbFdvcmsucmVtb3ZlV29yayhlKSx0aGlzLmxvY2FsV29yay5jb2xsb2N0RWZmZWN0U2VsZWN0V29yayhlKSksdD09PVcuU2VydmljZSYmKHRoaXMuc2VydmljZVdvcmsucmVtb3ZlV29yayhlKSx0aGlzLmxvY2FsV29yay5jb2xsb2N0RWZmZWN0U2VsZWN0V29yayhlKSl9Y2hlY2tUZXh0QWN0aXZlKGUpe2NvbnN0e2RhdGFUeXBlOnR9PWU7dD09PVcuTG9jYWwmJnRoaXMubG9jYWxXb3JrLmNoZWNrVGV4dEFjdGl2ZShlKX1jbGVhckFsbCgpe3RoaXMudk5vZGVzLmNsZWFyKCksc3VwZXIuY2xlYXJBbGwoKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXImJih0aGlzLnNlcnZpY2VEcmF3TGF5ZXIucGFyZW50LmNoaWxkcmVuLmZvckVhY2goZT0+e2UubmFtZSE9PSJ2aWV3cG9ydCImJmUucmVtb3ZlKCl9KSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIucmVtb3ZlQWxsQ2hpbGRyZW4oKSksdGhpcy5wb3N0KHtyZW5kZXI6W3tpc0NsZWFyQWxsOiEwLGNsZWFyQ2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9LHtpc0NsZWFyQWxsOiEwLGNsZWFyQ2FudmFzOk4uRmxvYXQsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9LHtpc0NsZWFyQWxsOiEwLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfV0sc3A6W3t0eXBlOm0uQ2xlYXJ9XX0pfXVwZGF0ZUxheWVyKGUpe2NvbnN0e3dpZHRoOnQsaGVpZ2h0OnJ9PWU7c3VwZXIudXBkYXRlTGF5ZXIoZSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyJiYodGhpcy5zZXJ2aWNlRHJhd0xheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoIndpZHRoIix0KSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgiaGVpZ2h0IixyKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJzaXplIixbdCxyXSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnNldEF0dHJpYnV0ZSgicG9zIixbdCouNSxyKi41XSkpfXNldENhbWVyYU9wdChlKXt0aGlzLmNhbWVyYU9wdD1lO2NvbnN0e3NjYWxlOnQsY2VudGVyWDpyLGNlbnRlclk6aSx3aWR0aDpzLGhlaWdodDpufT1lOyhzIT09dGhpcy5zY2VuZS53aWR0aHx8biE9PXRoaXMuc2NlbmUuaGVpZ2h0KSYmdGhpcy51cGRhdGVTY2VuZSh7d2lkdGg6cyxoZWlnaHQ6bn0pLHRoaXMuZnVsbExheWVyJiYodGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJzY2FsZSIsW3QsdF0pLHRoaXMuZnVsbExheWVyLnNldEF0dHJpYnV0ZSgidHJhbnNsYXRlIixbLXIsLWldKSksdGhpcy5kcmF3TGF5ZXImJih0aGlzLmRyYXdMYXllci5zZXRBdHRyaWJ1dGUoInNjYWxlIixbdCx0XSksdGhpcy5kcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFstciwtaV0pKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXImJih0aGlzLnNlcnZpY2VEcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJzY2FsZSIsW3QsdF0pLHRoaXMuc2VydmljZURyYXdMYXllci5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1yLC1pXSkpfWdldExheWVyKGUsdCl7cmV0dXJuIGU/dGhpcy5mdWxsTGF5ZXI6dCYmdD09PVcuU2VydmljZT90aGlzLnNlcnZpY2VEcmF3TGF5ZXI6dGhpcy5kcmF3TGF5ZXJ9Z2V0T2Zmc2NyZWVuKGUsdCl7cmV0dXJuIHRoaXMuZ2V0TGF5ZXIoZSx0KS5wYXJlbnQuY2FudmFzfWFzeW5jIGNvbnN1bWVGdWxsKGUsdCl7Y29uc3Qgcj1hd2FpdCB0aGlzLmxvY2FsV29yay5jb2xsb2N0RWZmZWN0U2VsZWN0V29yayh0KTtyJiZlPT09Vy5Mb2NhbCYmYXdhaXQgdGhpcy5sb2NhbFdvcmsuY29uc3VtZUZ1bGwocix0aGlzLnNjZW5lKSxyJiZlPT09Vy5TZXJ2aWNlJiZ0aGlzLnNlcnZpY2VXb3JrLmNvbnN1bWVGdWxsKHIpfWNvbnN1bWVEcmF3KGUsdCl7ZT09PVcuTG9jYWwmJnRoaXMubG9jYWxXb3JrLmNvbnN1bWVEcmF3KHQsdGhpcy5zZXJ2aWNlV29yayksZT09PVcuU2VydmljZSYmdGhpcy5zZXJ2aWNlV29yay5jb25zdW1lRHJhdyh0KX1jb25zdW1lRHJhd0FsbChlLHQpe2U9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jb25zdW1lRHJhd0FsbCh0LHRoaXMuc2VydmljZVdvcmspfXVwZGF0ZUNhbWVyYShlKXt2YXIgaTtjb25zdCB0PVtdLHtjYW1lcmFPcHQ6cn09ZTtpZihyJiYodGhpcy5zZXRDYW1lcmFPcHQociksdGhpcy5sb2NhbFdvcmsud29ya1NoYXBlcy5mb3JFYWNoKChzLG4pPT57KHMudG9vbHNUeXBlPT09Uy5QZW5jaWx8fHMudG9vbHNUeXBlPT09Uy5BcnJvd3x8cy50b29sc1R5cGU9PT1TLlN0cmFpZ2h0fHxzLnRvb2xzVHlwZT09PVMuRWxsaXBzZXx8cy50b29sc1R5cGU9PT1TLlJlY3RhbmdsZXx8cy50b29sc1R5cGU9PT1TLlN0YXJ8fHMudG9vbHNUeXBlPT09Uy5Qb2x5Z29ufHxzLnRvb2xzVHlwZT09PVMuU3BlZWNoQmFsbG9vbnx8cy50b29sc1R5cGU9PT1TLlRleHQpJiZ0aGlzLmxvY2FsV29yay53b3JrU2hhcGVTdGF0ZS5zZXQobix7d2lsbENsZWFyOiEwfSl9KSx0aGlzLnZOb2Rlcy5jdXJOb2RlTWFwLnNpemUpKXtpZih0aGlzLnZOb2Rlcy51cGRhdGVOb2Rlc1JlY3QoKSx0aGlzLmxvY2FsV29yay5yZVJlbmRlclNlbGVjdG9yKCksdGhpcy5zZXJ2aWNlV29yay5zZWxlY3RvcldvcmtTaGFwZXMuc2l6ZSlmb3IoY29uc3RbYSxsXW9mIHRoaXMuc2VydmljZVdvcmsuc2VsZWN0b3JXb3JrU2hhcGVzLmVudHJpZXMoKSl0aGlzLnNlcnZpY2VXb3JrLnJ1blNlbGVjdFdvcmsoe3dvcmtJZDphLHNlbGVjdElkczpsLnNlbGVjdElkcyxtc2dUeXBlOm0uU2VsZWN0LGRhdGFUeXBlOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9KTtsZXQgcztjb25zdCBuPXRoaXMubG9jYWxXb3JrLmdldFdvcmtTaGFwZShLZSk7aWYobiYmKChpPW4uc2VsZWN0SWRzKSE9bnVsbCYmaS5sZW5ndGgpJiYocz1uLm9sZFNlbGVjdFJlY3Qsbi5jdXJzb3JCbHVyKCkpLHRoaXMudk5vZGVzLmhhc1JlbmRlck5vZGVzKCkpe3QucHVzaCh7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSx7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSk7Zm9yKGNvbnN0IGEgb2YgdGhpcy52Tm9kZXMuY3VyTm9kZU1hcC52YWx1ZXMoKSlPcihhLnRvb2xzVHlwZSkmJihzPUEocyxhLnJlY3QpKTtzJiZ0LnB1c2goe3JlY3Q6SyhzLDIwKSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMSxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pfXQubGVuZ3RoJiZ0aGlzLnBvc3Qoe3JlbmRlcjp0fSl9fWdldFJlY3RJbWFnZUJpdG1hcChlLHQscil7Y29uc3QgaT1lLngqdGhpcy5kcHIscz1lLnkqdGhpcy5kcHIsbj1lLncqdGhpcy5kcHIsYT1lLmgqdGhpcy5kcHI7cmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKHRoaXMuZ2V0T2Zmc2NyZWVuKHQsciksaSxzLG4sYSl9c2FmYXJpRml4UmVjdChlKXtpZihlLncrZS54PD0wfHxlLmgrZS55PD0wfHxlLnc8PTB8fGUuaDw9MClyZXR1cm47Y29uc3QgdD17eDowLHk6MCx3Ok1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aCksaDpNYXRoLmZsb29yKHRoaXMuc2NlbmUuaGVpZ2h0KX07aWYoZS54PDA/ZS53K2UueDx0aGlzLnNjZW5lLndpZHRoJiYodC53PWUudytlLngpOmUudytlLng+MCYmKHQueD1lLngsdC53PU1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aC1lLngpKSxlLnk8MD9lLmgrZS55PHRoaXMuc2NlbmUuaGVpZ2h0JiYodC5oPWUuaCtlLnkpOmUuaCtlLnk+MCYmKHQueT1lLnksdC5oPU1hdGguZmxvb3IodGhpcy5zY2VuZS5oZWlnaHQtZS55KSksISh0Lnc8PTB8fHQuaDw9MCkpcmV0dXJuIHR9Z2V0U2NlbmVSZWN0KCl7Y29uc3R7d2lkdGg6ZSxoZWlnaHQ6dH09dGhpcy5zY2VuZTtyZXR1cm57eDowLHk6MCx3Ok1hdGguZmxvb3IoZSksaDpNYXRoLmZsb29yKHQpfX1jaGVja1JpZ2h0UmVjdEJvdW5kaW5nQm94KGUpe3JldHVybiB0aGlzLnZOb2Rlcy5jb21iaW5lSW50ZXJzZWN0UmVjdChlKX1jdXJzb3JIb3ZlcihlKXt0aGlzLmxvY2FsV29yay5jdXJzb3JIb3ZlcihlKX19Y2xhc3MgcHAgZXh0ZW5kcyB0b3tjb25zdHJ1Y3RvcihlLHQscil7c3VwZXIoZSx0KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3Bvc3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNuYXBzaG90RnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImxvY2FsV29yayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMuX3Bvc3Q9cjtjb25zdCBpPXt0aHJlYWQ6dGhpcyx2aWV3SWQ6dGhpcy52aWV3SWQsdk5vZGVzOnRoaXMudk5vZGVzLGZ1bGxMYXllcjp0aGlzLmZ1bGxMYXllcixkcmF3TGF5ZXI6dGhpcy5kcmF3TGF5ZXIscG9zdDp0aGlzLnBvc3QuYmluZCh0aGlzKX07dGhpcy5sb2NhbFdvcms9bmV3IGhwKGkpLHRoaXMudk5vZGVzLmluaXQodGhpcy5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXIpfWFzeW5jIHBvc3QoZSx0KXt2YXIgYSxsO2NvbnN0IHI9ZS5yZW5kZXIsaT1bXTtsZXQgcz10O2lmKHIhPW51bGwmJnIubGVuZ3RoKXtmb3IoY29uc3QgYyBvZiByKWlmKGMuZHJhd0NhbnZhcyYmdGhpcy5mdWxsTGF5ZXIucGFyZW50LnJlbmRlcigpLGMucmVjdCl7aWYoYy5yZWN0PXRoaXMuc2FmYXJpRml4UmVjdChyZShjLnJlY3QpKSwhYy5yZWN0KWNvbnRpbnVlO2lmKGMuZHJhd0NhbnZhcyl7Y29uc3QgdT1hd2FpdCB0aGlzLmdldFJlY3RJbWFnZUJpdG1hcChjLnJlY3QsISFjLmlzRnVsbFdvcmspO2MuaW1hZ2VCaXRtYXA9dSxzfHwocz1bXSkscy5wdXNoKHUpfWkucHVzaChjKX1lLnJlbmRlcj1pfWNvbnN0IG49KGE9ZS5zcCk9PW51bGw/dm9pZCAwOmEuZmlsdGVyKGM9PmMudHlwZSE9PW0uTm9uZXx8T2JqZWN0LmtleXMoYykuZmlsdGVyKHU9PnU9PT0idHlwZSIpLmxlbmd0aCk7aWYobiE9bnVsbCYmbi5sZW5ndGgmJihlLnNwPW4ubWFwKGM9Pih7Li4uYyx2aWV3SWQ6dGhpcy52aWV3SWR9KSkpLCgobD1lLnNwKSE9bnVsbCYmbC5sZW5ndGh8fGUuZHJhd0NvdW50fHxpIT1udWxsJiZpLmxlbmd0aCkmJih0aGlzLl9wb3N0KGUscykscyE9bnVsbCYmcy5sZW5ndGgpKWZvcihjb25zdCBjIG9mIHMpYyBpbnN0YW5jZW9mIEltYWdlQml0bWFwJiZjLmNsb3NlKCl9b24oZSl7Y29uc3R7bXNnVHlwZTp0fT1lO3N3aXRjaCh0KXtjYXNlIG0uVXBkYXRlQ2FtZXJhOnRoaXMudXBkYXRlQ2FtZXJhKGUpO2JyZWFrO2Nhc2UgbS5TbmFwc2hvdDp0aGlzLnNuYXBzaG90RnVsbExheWVyPXRoaXMuY3JlYXRlTGF5ZXIoInNuYXBzaG90RnVsbExheWVyIix0aGlzLnNjZW5lLHsuLi50aGlzLm9wdC5sYXllck9wdCxidWZmZXJTaXplOnRoaXMudmlld0lkPT09Im1haW5WaWV3Ij82ZTM6M2UzfSksdGhpcy5zbmFwc2hvdEZ1bGxMYXllciYmdGhpcy5nZXRTbmFwc2hvdChlKS50aGVuKCgpPT57dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj12b2lkIDB9KTticmVhaztjYXNlIG0uQm91bmRpbmdCb3g6dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzbmFwc2hvdEZ1bGxMYXllciIsdGhpcy5zY2VuZSx7Li4udGhpcy5vcHQubGF5ZXJPcHQsYnVmZmVyU2l6ZTp0aGlzLnZpZXdJZD09PSJtYWluVmlldyI/NmUzOjNlM30pLHRoaXMuc25hcHNob3RGdWxsTGF5ZXImJnRoaXMuZ2V0Qm91bmRpbmdSZWN0KGUpLnRoZW4oKCk9Pnt0aGlzLnNuYXBzaG90RnVsbExheWVyPXZvaWQgMH0pO2JyZWFrfXN1cGVyLm9uKGUpfWdldE9mZnNjcmVlbihlKXt2YXIgdDtyZXR1cm4odD0oZSYmdGhpcy5zbmFwc2hvdEZ1bGxMYXllcnx8dGhpcy5mdWxsTGF5ZXIpLnBhcmVudCk9PW51bGw/dm9pZCAwOnQuY2FudmFzfWNvbnN1bWVEcmF3KGUsdCl7ZT09PVcuTG9jYWwmJnRoaXMubG9jYWxXb3JrLmNvbnN1bWVEcmF3KHQpfWNvbnN1bWVEcmF3QWxsKGUsdCl7dGhpcy5sb2NhbFdvcmsuY29uc3VtZURyYXdBbGwodCl9Z2V0UmVjdEltYWdlQml0bWFwKGUsdD0hMSxyKXtjb25zdCBpPWUueCp0aGlzLmRwcixzPWUueSp0aGlzLmRwcixuPWUudyp0aGlzLmRwcixhPWUuaCp0aGlzLmRwcjtyZXR1cm4gY3JlYXRlSW1hZ2VCaXRtYXAodGhpcy5nZXRPZmZzY3JlZW4odCksaSxzLG4sYSxyKX1zYWZhcmlGaXhSZWN0KGUpe2lmKGUudytlLng8PTB8fGUuaCtlLnk8PTB8fGUudzw9MHx8ZS5oPD0wKXJldHVybjtjb25zdCB0PXt4OjAseTowLHc6TWF0aC5mbG9vcih0aGlzLnNjZW5lLndpZHRoKSxoOk1hdGguZmxvb3IodGhpcy5zY2VuZS5oZWlnaHQpfTtpZihlLng8MD9lLncrZS54PHRoaXMuc2NlbmUud2lkdGgmJih0Lnc9ZS53K2UueCk6ZS53K2UueD4wJiYodC54PWUueCx0Lnc9TWF0aC5mbG9vcih0aGlzLnNjZW5lLndpZHRoLWUueCkpLGUueTwwP2UuaCtlLnk8dGhpcy5zY2VuZS5oZWlnaHQmJih0Lmg9ZS5oK2UueSk6ZS5oK2UueT4wJiYodC55PWUueSx0Lmg9TWF0aC5mbG9vcih0aGlzLnNjZW5lLmhlaWdodC1lLnkpKSwhKHQudzw9MHx8dC5oPD0wKSlyZXR1cm4gdH11cGRhdGVDYW1lcmEoZSl7Y29uc3R7Y2FtZXJhT3B0OnR9PWU7dCYmdGhpcy5zZXRDYW1lcmFPcHQodCl9c2V0Q2FtZXJhT3B0KGUsdCl7dGhpcy5jYW1lcmFPcHQ9ZTtjb25zdHtzY2FsZTpyLGNlbnRlclg6aSxjZW50ZXJZOnMsd2lkdGg6bixoZWlnaHQ6YX09ZTsobiE9PXRoaXMuc2NlbmUud2lkdGh8fGEhPT10aGlzLnNjZW5lLmhlaWdodCkmJnRoaXMudXBkYXRlU2NlbmUoe3dpZHRoOm4saGVpZ2h0OmF9KSx0Pyh0LnNldEF0dHJpYnV0ZSgic2NhbGUiLFtyLHJdKSx0LnNldEF0dHJpYnV0ZSgidHJhbnNsYXRlIixbLWksLXNdKSk6KHRoaXMuZnVsbExheWVyLnNldEF0dHJpYnV0ZSgic2NhbGUiLFtyLHJdKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1pLC1zXSkpfWFzeW5jIGdldFNuYXBzaG90KGUpe2NvbnN0e3NjZW5lUGF0aDp0LHNjZW5lczpyLGNhbWVyYU9wdDppLHc6cyxoOm4sbWF4WkluZGV4OmF9PWU7aWYodCYmciYmaSYmdGhpcy5zbmFwc2hvdEZ1bGxMYXllcil7Y29uc3QgbD1yZSh0aGlzLmNhbWVyYU9wdCk7dGhpcy5zZXRDYW1lcmFPcHQoaSx0aGlzLnNuYXBzaG90RnVsbExheWVyKSx0aGlzLmxvY2FsV29yay5mdWxsTGF5ZXI9dGhpcy5zbmFwc2hvdEZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dGhpcy5mdWxsTGF5ZXI7bGV0IGM7Y29uc3QgdT1uZXcgTWFwO2Zvcihjb25zdFtkLGZdb2YgT2JqZWN0LmVudHJpZXMocikpaWYoZiE9bnVsbCYmZi50eXBlKXN3aXRjaChmPT1udWxsP3ZvaWQgMDpmLnR5cGUpe2Nhc2UgbS5VcGRhdGVOb2RlOmNhc2UgbS5GdWxsV29yazp7Y29uc3R7dG9vbHNUeXBlOncsb3B0Onl9PWY7dz09PVMuVGV4dCYmeSYmKHkuekluZGV4PXkuekluZGV4KyhhfHwwKSwoeS5saW5lVGhyb3VnaHx8eS51bmRlcmxpbmUpJiZ1LnNldChkLGYpKTtjb25zdCBnPWF3YWl0IHRoaXMubG9jYWxXb3JrLnJ1bkZ1bGxXb3JrKHsuLi5mLG9wdDp5LHdvcmtJZDpkLG1zZ1R5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLlNlcnZpY2Usdmlld0lkOnRoaXMudmlld0lkfSx3PT09Uy5UZXh0KTtjPUEoYyxnKTticmVha319dGhpcy5sb2NhbFdvcmsuZnVsbExheWVyPXRoaXMuZnVsbExheWVyLHRoaXMubG9jYWxXb3JrLmRyYXdMYXllcj12b2lkIDA7bGV0IGg7cyYmbiYmKGg9e3Jlc2l6ZVdpZHRoOnMscmVzaXplSGVpZ2h0Om59KSx1LnNpemUmJihhd2FpdCBuZXcgUHJvbWlzZShkPT57c2V0VGltZW91dChkLDUwMCl9KSx0aGlzLndpbGxSZW5kZXJTcGVjaWFsTGFiZWwodSkpLGF3YWl0IHRoaXMuZ2V0U25hcHNob3RSZW5kZXIoe3NjZW5lUGF0aDp0LGN1ckNhbWVyYU9wdDpsLG9wdGlvbnM6aH0pfX13aWxsUmVuZGVyU3BlY2lhbExhYmVsKGUpe3ZhciB0O2Zvcihjb25zdFtyLGldb2YgZS5lbnRyaWVzKCkpe2NvbnN0IHM9KHQ9dGhpcy5zbmFwc2hvdEZ1bGxMYXllcik9PW51bGw/dm9pZCAwOnQuZ2V0RWxlbWVudHNCeU5hbWUocilbMF07cyYmaS5vcHQmJnRoaXMubG9jYWxXb3JrLnVwZGF0ZUxhYmVscyhzLGkpfX1hc3luYyBnZXRTbmFwc2hvdFJlbmRlcihlKXt2YXIgbixhO2NvbnN0e3NjZW5lUGF0aDp0LGN1ckNhbWVyYU9wdDpyLG9wdGlvbnM6aX09ZTsoKG49dGhpcy5zbmFwc2hvdEZ1bGxMYXllcik9PW51bGw/dm9pZCAwOm4ucGFyZW50KS5yZW5kZXIoKTtjb25zdCBzPWF3YWl0IHRoaXMuZ2V0UmVjdEltYWdlQml0bWFwKHt4OjAseTowLHc6dGhpcy5zY2VuZS53aWR0aCxoOnRoaXMuc2NlbmUuaGVpZ2h0fSwhMCxpKTtzJiYoYXdhaXQgdGhpcy5wb3N0KHtzcDpbe3R5cGU6bS5TbmFwc2hvdCxzY2VuZVBhdGg6dCxpbWFnZUJpdG1hcDpzfV19LFtzXSkscy5jbG9zZSgpLChhPXRoaXMuc25hcHNob3RGdWxsTGF5ZXIpPT1udWxsfHxhLnJlbW92ZUFsbENoaWxkcmVuKCksdGhpcy5zZXRDYW1lcmFPcHQocix0aGlzLmZ1bGxMYXllcikpfWFzeW5jIGdldEJvdW5kaW5nUmVjdChlKXtjb25zdHtzY2VuZVBhdGg6dCxzY2VuZXM6cixjYW1lcmFPcHQ6aX09ZTtpZih0JiZyJiZpJiZ0aGlzLnNuYXBzaG90RnVsbExheWVyKXtjb25zdCBzPXJlKHRoaXMuY2FtZXJhT3B0KTt0aGlzLnNldENhbWVyYU9wdChpLHRoaXMuc25hcHNob3RGdWxsTGF5ZXIpLHRoaXMubG9jYWxXb3JrLmZ1bGxMYXllcj10aGlzLnNuYXBzaG90RnVsbExheWVyLHRoaXMubG9jYWxXb3JrLmRyYXdMYXllcj10aGlzLmRyYXdMYXllcjtsZXQgbjtmb3IoY29uc3RbYSxsXW9mIE9iamVjdC5lbnRyaWVzKHIpKWlmKGwhPW51bGwmJmwudHlwZSlzd2l0Y2gobD09bnVsbD92b2lkIDA6bC50eXBlKXtjYXNlIG0uVXBkYXRlTm9kZTpjYXNlIG0uRnVsbFdvcms6e2NvbnN0IGM9YXdhaXQgdGhpcy5sb2NhbFdvcmsucnVuRnVsbFdvcmsoey4uLmwsd29ya0lkOmEsbXNnVHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9KTtuPUEobixjKTticmVha319biYmYXdhaXQgdGhpcy5wb3N0KHtzcDpbe3R5cGU6bS5Cb3VuZGluZ0JveCxzY2VuZVBhdGg6dCxyZWN0Om59XX0pLHRoaXMubG9jYWxXb3JrLmZ1bGxMYXllcj10aGlzLmZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dm9pZCAwLHRoaXMuc25hcHNob3RGdWxsTGF5ZXIucmVtb3ZlQWxsQ2hpbGRyZW4oKSx0aGlzLnNldENhbWVyYU9wdChzLHRoaXMuZnVsbExheWVyKX19fWNvbnN0IHlwPXNlbGY7bmV3IGRwKHlwLFdlLlN1Yil9KShzcHJpdGVqcyk7Cg==", OG = (t) => Uint8Array.from(atob(t), (l) => l.charCodeAt(0)), Ee = typeof window < "u" && window.Blob && new Blob([OG(gt)], { type: "text/javascript;charset=utf-8" });
function BG(t) {
  let l;
  try {
    if (l = Ee && (window.URL || window.webkitURL).createObjectURL(Ee), !l)
      throw "";
    const c = new Worker(l, {
      name: t == null ? void 0 : t.name
    });
    return c.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(l);
    }), c;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + gt,
      {
        name: t == null ? void 0 : t.name
      }
    );
  } finally {
    l && (window.URL || window.webkitURL).revokeObjectURL(l);
  }
}
class Ll {
  constructor() {
    Object.defineProperty(this, "emtType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "mainEngine", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
  }
  static dispatch(l, c, e) {
    var d;
    (d = Wl.InternalMsgEmitter) == null || d.emit([l, c], e);
  }
  get serviceColloctor() {
    return this.control.collector;
  }
  registerForMainEngine(l, c) {
    return this.emtType = l, this.control = c, this.mainEngine = c.worker, this.mainEngine.internalMsgEmitter.on([this.emtType, this.emitEventType], this.collect.bind(this)), this;
  }
  destroy() {
    this.emtType && this.mainEngine && this.mainEngine.internalMsgEmitter.off([this.emtType, this.emitEventType], this.collect.bind(this));
  }
  collectForLocalWorker(l) {
    var c, e, d;
    for (const [b, s] of l)
      (c = this.mainEngine) == null || c.queryTaskBatchData(s).forEach((a) => {
        var i;
        (i = this.mainEngine) == null || i.taskBatchData.delete(a);
      }), (e = this.mainEngine) == null || e.taskBatchData.add(b);
    (d = this.mainEngine) == null || d.runAnimation();
  }
  collectForServiceWorker(l) {
    _l(() => {
      l.forEach((c) => {
        var b, s, a;
        (b = this.serviceColloctor) == null || b.dispatch(c);
        const { viewId: e, undoTickerId: d } = c;
        d && e && ((a = (s = this.mainEngine) == null ? void 0 : s.internalMsgEmitter) == null || a.emit("undoTickerEnd", d, e));
      });
    }, this.mainEngine.maxLastSyncTime);
  }
}
class DG extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.ZIndexActive
    });
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workId: c, isActive: e, viewId: d } = l, b = this.control.viewContainerManager.getView(d);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [], i = [];
    c === z && a.push([{
      workId: c,
      msgType: M.UpdateNode,
      dataType: Q.Local,
      isActiveZIndex: e,
      emitEventType: this.emitEventType,
      willRefreshSelector: !0,
      willSyncService: !1,
      viewId: d,
      scenePath: s
    }, {
      workId: c,
      msgType: M.UpdateNode,
      emitEventType: this.emitEventType
    }]), a.length && this.collectForLocalWorker(a), i.length && this.collectForServiceWorker(i);
  }
}
class EG extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.CopyNode
    });
  }
  collect(l) {
    var s;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, viewId: e } = l, d = this.control.viewContainerManager.getView(e);
    if (!(d != null && d.displayer))
      return;
    const b = d.focusScenePath;
    for (const a of c) {
      const i = a.toString(), Z = this.serviceColloctor.isLocalId(i) ? this.serviceColloctor.transformKey(a) : i, o = (s = this.serviceColloctor.getStorageData(e, b)) == null ? void 0 : s[Z];
      if (o) {
        if (a === z) {
          const m = o && this.copySelector({
            viewId: e,
            store: o
          });
          m && this.pasteSelector({
            ...m,
            viewId: e,
            scenePath: b
          });
          break;
        }
        if (o.toolsType === X.Text && o.opt && o.opt.workState && o.opt.workState !== x.Done) {
          const m = o && this.copyText({
            viewId: e,
            store: o
          });
          m && this.pasteText({
            ...m,
            viewId: e,
            scenePath: b,
            key: Z,
            store: o
          });
          break;
        }
      }
    }
  }
  copyText(l) {
    const { viewId: c, store: e } = l, d = this.control.viewContainerManager.getView(c);
    if (!this.serviceColloctor || !d)
      return;
    const b = d == null ? void 0 : d.cameraOpt, s = b && [b.centerX, b.centerY], a = e.opt, i = a.boxPoint && a.boxSize && [a.boxPoint[0] + a.boxSize[0] / 2, a.boxPoint[1] + a.boxSize[1] / 2];
    return {
      bgCenter: s,
      textCenter: i
    };
  }
  pasteText(l) {
    var W, r;
    const { bgCenter: c, textCenter: e, store: d, key: b, viewId: s, scenePath: a } = l, i = this.control.viewContainerManager.getView(s);
    if (!this.serviceColloctor || !i)
      return;
    const n = Math.floor(Math.random() * 30 + 1), Z = Date.now(), o = ((W = i.cameraOpt) == null ? void 0 : W.scale) || 1, m = c && e && [c[0] - e[0] + n, c[1] - e[1] + n] || [n / o, n / o], p = (this.serviceColloctor.isLocalId(b) ? b : this.serviceColloctor.getLocalId(b.toString())) + "-" + Z;
    if (this.mainEngine.internalMsgEmitter.emit("undoTickerStart", Z, s), d.toolsType === X.Text && d.opt) {
      const u = d.opt;
      if (u && u.boxPoint && u.text) {
        u.workState = x.Done;
        const V = u.boxPoint;
        u.boxPoint = [V[0] + m[0], V[1] + m[1]], u.workState = x.Done;
        const y = this.control.viewContainerManager.transformToOriginPoint(u.boxPoint, s);
        this.control.textEditorManager.createTextForMasterController({
          workId: p,
          x: y[0],
          y: y[1],
          opt: u,
          scale: ((r = i.cameraOpt) == null ? void 0 : r.scale) || 1,
          type: Rl.Text,
          isActive: !1,
          viewId: s,
          scenePath: a
        }), this.collectForServiceWorker([{
          ...d,
          opt: u,
          type: M.FullWork,
          workId: p,
          viewId: s,
          scenePath: a,
          undoTickerId: Z
        }]);
      }
    }
  }
  copySelector(l) {
    var p, W, r, u, V, y, L, Y;
    const { viewId: c, store: e } = l, d = this.control.viewContainerManager.getView(c), b = e.selectIds;
    if (!this.serviceColloctor || !(b != null && b.length) || !d)
      return;
    const s = /* @__PURE__ */ new Map(), a = {
      offset: {
        x: 0,
        y: 0
      },
      cameraOpt: {
        centerX: ((p = d.cameraOpt) == null ? void 0 : p.centerX) || 0,
        centerY: ((W = d.cameraOpt) == null ? void 0 : W.centerY) || 0,
        scale: ((r = d.cameraOpt) == null ? void 0 : r.scale) || 1
      }
    }, i = (u = d.displayer.canvasBgRef.current) == null ? void 0 : u.getBoundingClientRect(), n = (y = (V = d.displayer) == null ? void 0 : V.floatBarCanvasRef.current) == null ? void 0 : y.getBoundingClientRect(), Z = i && [i.x + i.width / 2, i.y + i.height / 2], o = n && [n.x + n.width / 2, n.y + n.height / 2], m = Z && d.viewData && d.viewData.convertToPointInWorld({ x: Z[0], y: Z[1] }), G = o && d.viewData && d.viewData.convertToPointInWorld({ x: o[0], y: o[1] });
    m && G && (a.offset = {
      x: m.x - G.x,
      y: m.y - G.y
    });
    for (const N of b) {
      const T = (Y = (L = this.serviceColloctor) == null ? void 0 : L.getStorageData(d.id, d.focusScenePath)) == null ? void 0 : Y[N];
      T && s.set(N, T);
    }
    return {
      copyStores: s,
      copyCoordInfo: a
    };
  }
  pasteSelector(l) {
    var W;
    const { copyStores: c, copyCoordInfo: e, viewId: d, scenePath: b } = l, s = this.control.viewContainerManager.getView(d);
    if (!c.size || !this.serviceColloctor || !s)
      return;
    const { offset: a, cameraOpt: i } = e, { scale: n } = i, Z = Math.floor(Math.random() * 30 + 1), o = [a.x + Z, a.y + Z], m = Date.now(), G = [], p = [];
    this.mainEngine.internalMsgEmitter.emit("undoTickerStart", m, d);
    for (const [r, u] of c.entries()) {
      const y = (this.serviceColloctor.isLocalId(r) ? r : this.serviceColloctor.getLocalId(r.toString())) + "-" + m, L = { useAnimation: !1 };
      if (u.toolsType === X.Text && u.opt) {
        const Y = u.opt;
        if (Y && Y.boxPoint && Y.text) {
          Y.workState = x.Done;
          const N = Y.boxPoint;
          Y.boxPoint = [N[0] + o[0], N[1] + o[1]], Y.workState = x.Done;
          const T = this.control.viewContainerManager.transformToOriginPoint(Y.boxPoint, d);
          this.control.textEditorManager.createTextForMasterController({
            workId: y,
            x: T[0],
            y: T[1],
            opt: Y,
            scale: ((W = s.cameraOpt) == null ? void 0 : W.scale) || 1,
            type: Rl.Text,
            isActive: !1,
            viewId: d,
            scenePath: b
          });
        }
        p.push({
          ...u,
          opt: Y,
          type: M.FullWork,
          workId: y,
          viewId: d,
          scenePath: b,
          undoTickerId: m
        });
        continue;
      }
      if (u.toolsType === X.Image && (u.opt.uuid = y, u.opt.centerX = u.opt.centerX + o[0], u.opt.centerY = u.opt.centerY + o[1]), u.ops) {
        const Y = Mm(u.ops).map((T, I) => {
          const C = I % 3;
          return C === 0 ? T + o[0] : C === 1 ? T + o[1] : T;
        }), N = Tm(Y);
        u.ops = N;
      }
      p.push({
        ...u,
        updateNodeOpt: L,
        type: M.FullWork,
        workId: y,
        viewId: d,
        scenePath: b,
        undoTickerId: m
      }), G.push([{
        ...u,
        updateNodeOpt: L,
        workId: y,
        msgType: M.FullWork,
        dataType: Q.Local,
        emitEventType: R.CopyNode,
        willSyncService: !1,
        willRefresh: !0,
        viewId: d,
        undoTickerId: m
      }, { workId: y, msgType: M.FullWork, emitEventType: R.CopyNode }]);
    }
    G.length && this.collectForLocalWorker(G), p.length && this.collectForServiceWorker(p);
  }
}
function vc(t, l, c) {
  return "#" + ((t << 16) + (l << 8) + c).toString(16).padStart(6, "0");
}
function ul(t, l = 1) {
  return "rgba(" + parseInt("0x" + t.slice(1, 3)) + "," + parseInt("0x" + t.slice(3, 5)) + "," + parseInt("0x" + t.slice(5, 7)) + "," + l + ")";
}
function Gc(t, l, c, e = 1) {
  return `rgba(${t},${l},${c},${e})`;
}
function de(t) {
  const l = t.split(","), c = parseInt(l[0].split("(")[1]), e = parseInt(l[1]), d = parseInt(l[2]), b = Number(l[3].split(")")[0]);
  return [vc(c, e, d), b];
}
function uc(t) {
  const l = t.split(","), c = parseInt(l[0].split("(")[1]), e = parseInt(l[1]), d = parseInt(l[2]), b = Number(l[3].split(")")[0]);
  return [c, e, d, b];
}
function Ae(t) {
  return t === "transparent";
}
class AG extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.SetColorNode
    });
  }
  setTextColor(l, c, e, d) {
    const { fontColor: b, fontBgColor: s } = e;
    c.opt && (b && (c.opt.fontColor = b), s && (c.opt.fontColor = s), this.control.textEditorManager.updateTextForMasterController({
      workId: l,
      opt: c.opt,
      viewId: d,
      canSync: !0,
      canWorker: !0
    }));
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, strokeColor: e, fillColor: d, fontColor: b, fontBgColor: s, viewId: a } = l, i = this.control.viewContainerManager.getView(a);
    if (!(i != null && i.displayer))
      return;
    const n = i.focusScenePath, Z = [...c], o = this.serviceColloctor.storage, m = [], G = {};
    for (; Z.length; ) {
      const p = Z.pop();
      if (!p)
        continue;
      const W = p.toString(), r = this.serviceColloctor.isLocalId(W), u = r ? this.serviceColloctor.transformKey(p) : W;
      let V = W;
      !r && this.serviceColloctor.isOwn(V) && (V = this.serviceColloctor.getLocalId(V));
      const y = o[a][n][u] || void 0;
      if (y) {
        const L = y.updateNodeOpt || {};
        if (b || s) {
          if (b) {
            L.fontColor = b;
            const [N, T, I, C] = uc(b);
            G.textColor = [N, T, I], G.textOpacity = C;
          }
          if (s) {
            L.fontBgColor = s;
            const [N, T, I, C] = uc(s);
            G.textBgColor = [N, T, I], G.textBgOpacity = C;
          }
          if (y.toolsType === X.Text && y.opt) {
            this.setTextColor(V, sl(y), L, a);
            continue;
          }
        }
        if (e) {
          L.strokeColor = e;
          const [N, T, I, C] = uc(e);
          G.strokeColor = [N, T, I], G.strokeOpacity = C;
        }
        if (d)
          if (L.fillColor = Ae(d) ? "transparent" : d, Ae(d))
            G.fillColor = void 0, G.fillOpacity = void 0;
          else {
            const [N, T, I, C] = uc(d);
            G.fillColor = [N, T, I], G.fillOpacity = C;
          }
        const Y = {
          workId: V,
          msgType: M.UpdateNode,
          dataType: Q.Local,
          updateNodeOpt: L,
          emitEventType: this.emitEventType,
          willRefresh: !0,
          willRefreshSelector: !0,
          willSyncService: !0,
          textUpdateForWoker: !0,
          viewId: a
          // undoTickerId
        };
        m.push([Y, {
          workId: V,
          msgType: M.UpdateNode,
          emitEventType: this.emitEventType
        }]);
      }
    }
    m.length && this.collectForLocalWorker(m), Object.keys(G).length && setTimeout(() => {
      var p;
      (p = this.control.room) == null || p.setMemberState(G);
    }, 0);
  }
}
class qG extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.ZIndexNode
    }), Object.defineProperty(this, "min", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "max", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    });
  }
  get minZIndex() {
    return this.min;
  }
  get maxZIndex() {
    return this.max;
  }
  set maxZIndex(l) {
    this.max = l;
  }
  set minZIndex(l) {
    this.min = l;
  }
  addMaxLayer() {
    this.max = this.max + 1;
  }
  addMinLayer() {
    this.min = this.min - 1;
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, layer: e, viewId: d } = l, b = this.control.viewContainerManager.getView(d);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [...c], i = this.serviceColloctor.storage, n = [], Z = [];
    for (; a.length; ) {
      const m = a.pop();
      if (!m)
        continue;
      const G = m.toString(), p = this.serviceColloctor.isLocalId(G), W = p ? this.serviceColloctor.transformKey(m) : G;
      let r = G;
      !p && this.serviceColloctor.isOwn(r) && (r = this.serviceColloctor.getLocalId(r));
      const u = sl(i[d][s][W]);
      let V;
      if (u && r === z) {
        if (u.selectIds) {
          Z.push(...u.selectIds), Z.sort((N, T) => {
            var K, v, g, P;
            const I = ((v = (K = i[o(N, this.serviceColloctor)]) == null ? void 0 : K.opt) == null ? void 0 : v.zIndex) || 0, C = ((P = (g = i[o(N, this.serviceColloctor)]) == null ? void 0 : g.opt) == null ? void 0 : P.zIndex) || 0;
            return I > C ? 1 : N < T ? -1 : 0;
          });
          const y = u.updateNodeOpt || {};
          y.zIndexLayer = e;
          const L = {
            workId: m,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: y,
            emitEventType: this.emitEventType,
            willRefreshSelector: !0,
            willSyncService: !0,
            viewId: d
          }, Y = /* @__PURE__ */ new Map();
          e === fl.Top ? (this.addMaxLayer(), V = this.max) : (this.addMinLayer(), V = this.min), Z.forEach((N) => {
            var K, v, g;
            const T = (K = this.serviceColloctor) == null ? void 0 : K.isLocalId(N);
            let I = T && ((v = this.serviceColloctor) == null ? void 0 : v.transformKey(N)) || N;
            const C = i[d][s][I];
            !T && ((g = this.serviceColloctor) != null && g.isOwn(I)) && (I = this.serviceColloctor.getLocalId(I)), y.zIndex = V, C != null && C.opt && (C.opt.zIndex = V), C != null && C.opt && Y.set(I, {
              updateNodeOpt: C.updateNodeOpt,
              opt: C.opt
            });
          }), L.selectStore = Y, L.willSerializeData = !0, n.push([L, {
            workId: m,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
        continue;
      }
    }
    n.length && this.collectForLocalWorker(n);
    function o(m, G) {
      return G.isLocalId(m) && G.transformKey(m) || m;
    }
  }
}
class $G extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.TranslateNode
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "oldRect", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cachePosition", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
  }
  collect(l) {
    var W, r, u, V;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, position: e, workState: d, viewId: b } = l, s = this.control.viewContainerManager.getView(b);
    if (!(s != null && s.displayer))
      return;
    const a = s.focusScenePath, i = [...c], n = (W = this.serviceColloctor) == null ? void 0 : W.storage, Z = [], o = (r = s.displayer.canvasBgRef.current) == null ? void 0 : r.getBoundingClientRect(), m = (V = (u = s.displayer) == null ? void 0 : u.floatBarCanvasRef.current) == null ? void 0 : V.getBoundingClientRect();
    let G = !1;
    const p = d === x.Start && Date.now() || void 0;
    for (p && (this.undoTickerId = p, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", p, b)), o && m && this.oldRect && (this.oldRect.x < o.x && m.x > this.oldRect.x || this.oldRect.y < o.y && m.y > this.oldRect.y || this.oldRect.x + this.oldRect.width > o.x + o.width && m.x < this.oldRect.x || this.oldRect.y + this.oldRect.height > o.y + o.height && m.y < this.oldRect.y) && (G = !0), m && (this.oldRect = m); i.length; ) {
      const y = i.pop();
      if (!y)
        continue;
      const L = y.toString(), Y = this.serviceColloctor.isLocalId(L), N = Y && this.serviceColloctor.transformKey(y) || L;
      let T = L;
      !Y && this.serviceColloctor.isOwn(T) && (T = this.serviceColloctor.getLocalId(T));
      const I = n[b][a][N];
      if (I && T === z) {
        if (I.selectIds && (d === x.Start && (this.cachePosition = e), this.cachePosition)) {
          const C = I.updateNodeOpt || {};
          C.translate = [e.x - this.cachePosition.x, e.y - this.cachePosition.y], C.workState = d;
          const K = {
            workId: y,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: C,
            emitEventType: this.emitEventType,
            willRefreshSelector: G,
            willSyncService: !0,
            textUpdateForWoker: !1,
            viewId: b
          };
          d === x.Done && (K.willRefreshSelector = !0, K.textUpdateForWoker = !0, K.willSerializeData = !0, K.undoTickerId = this.undoTickerId, this.cachePosition = void 0), Z.push([K, {
            workId: y,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
        continue;
      }
    }
    d === x.Start ? this.mainEngine.unWritable() : d === x.Done && this.mainEngine.abled(), Z.length && this.collectForLocalWorker(Z);
  }
}
class _G extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.DeleteNode
    });
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, viewId: e } = l, d = this.control.viewContainerManager.getView(e);
    if (!(d != null && d.displayer))
      return;
    const b = d.focusScenePath, s = this.serviceColloctor.storage, a = [...c], i = [], n = [], Z = Date.now();
    for (; a.length; ) {
      const o = a.pop();
      if (!o)
        continue;
      const m = o.toString(), G = this.serviceColloctor.isLocalId(m), p = G ? this.serviceColloctor.transformKey(o) : m, W = s[e][b][p];
      if (W) {
        let r = m;
        if (!G && this.serviceColloctor.isOwn(r) && (r = this.serviceColloctor.getLocalId(r)), W.toolsType === X.Text) {
          this.control.textEditorManager.delete(r, !0, !0);
          continue;
        }
        n.push(r);
      }
    }
    n.length && (i.push([{
      msgType: M.RemoveNode,
      emitEventType: R.DeleteNode,
      removeIds: n,
      dataType: Q.Local,
      willSyncService: !0,
      willRefresh: !0,
      undoTickerId: Z,
      viewId: e
    }, void 0]), this.mainEngine.internalMsgEmitter.emit("undoTickerStart", Z, e), this.collectForLocalWorker(i));
  }
}
class lu extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.ScaleNode
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "targetBox", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "targetText", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "cacheTextInfo", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    });
  }
  async collect(l) {
    var G, p, W, r, u;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, box: e, workState: d, viewId: b, dir: s } = l, a = this.control.viewContainerManager.getView(b);
    if (!(a != null && a.displayer))
      return;
    const i = a.focusScenePath, n = [...c], Z = (G = this.serviceColloctor) == null ? void 0 : G.storage, o = [], m = d === x.Start && Date.now() || void 0;
    for (m && (this.undoTickerId = m, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", m, b)); n.length; ) {
      const V = n.pop();
      if (!V)
        continue;
      const y = V.toString(), L = this.serviceColloctor.isLocalId(y), Y = L && this.serviceColloctor.transformKey(V) || y;
      let N = y;
      !L && this.serviceColloctor.isOwn(N) && (N = this.serviceColloctor.getLocalId(N));
      const T = Z[b][i][Y];
      if (T && N === z && T.selectIds) {
        const I = T.updateNodeOpt || {};
        if (I.dir = s, I.box = e, I.workState = d, d === x.Start && e) {
          for (const K of T.selectIds) {
            const v = (p = this.serviceColloctor) == null ? void 0 : p.isLocalId(K), g = v && ((W = this.serviceColloctor) == null ? void 0 : W.transformKey(K)) || K;
            let P = g;
            !v && ((r = this.serviceColloctor) != null && r.isOwn(g)) && (P = this.serviceColloctor.getLocalId(g));
            const _ = this.control.textEditorManager.get(P);
            _ && d === x.Start && this.targetText.set(P, sl(_));
          }
          this.targetText.size && this.targetBox.set(N, e);
        }
        if (this.targetText.size && d !== x.Start) {
          const K = this.targetBox.get(N);
          if (K) {
            const v = [e.w / K.w, e.h / K.h];
            for (const [g, P] of this.targetText.entries()) {
              const { opt: _ } = P, $ = Math.floor(_.fontSize * v[0]), q = this.cacheTextInfo.get(g), D = !q && _.fontSize !== $ || q && q.fontSize !== $ || !1, B = (u = this.control.textEditorManager.get(g)) == null ? void 0 : u.opt;
              if (D && B && _.boxSize && _.boxPoint) {
                const k = await this.control.textEditorManager.updateTextControllerWithEffectAsync({
                  workId: g,
                  opt: { ...B, fontSize: $ },
                  viewId: b,
                  canSync: !1,
                  canWorker: !1
                });
                k && this.cacheTextInfo.set(g, {
                  fontSize: k.opt.fontSize,
                  boxSize: k.opt.boxSize,
                  boxPoint: k.opt.boxPoint
                });
              }
            }
            I.textInfos = this.cacheTextInfo;
          }
        }
        const C = {
          workId: V,
          msgType: M.UpdateNode,
          dataType: Q.Local,
          updateNodeOpt: I,
          emitEventType: this.emitEventType,
          willRefreshSelector: !0,
          willSyncService: !0,
          viewId: b
        };
        d === x.Done && (C.willSerializeData = !0, C.undoTickerId = this.undoTickerId, this.targetBox.delete(N), this.targetText.clear()), o.push([C, {
          workId: V,
          msgType: M.UpdateNode,
          emitEventType: this.emitEventType
        }]);
        continue;
      }
    }
    d === x.Start ? this.mainEngine.unWritable() : d === x.Done && this.mainEngine.abled(), o.length && this.collectForLocalWorker(o);
  }
}
class cu extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.RotateNode
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cacheOriginRotate", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    });
  }
  collect(l) {
    var m, G, p, W, r;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, angle: e, workState: d, viewId: b } = l, s = this.control.viewContainerManager.getView(b);
    if (!(s != null && s.displayer))
      return;
    const a = s.focusScenePath, i = [...c], n = (m = this.serviceColloctor) == null ? void 0 : m.storage, Z = [], o = d === x.Start && Date.now() || void 0;
    for (o && (this.undoTickerId = o, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", o, b)); i.length; ) {
      const u = i.pop();
      if (!u)
        continue;
      const V = u.toString(), y = this.serviceColloctor.isLocalId(V), L = y && this.serviceColloctor.transformKey(u) || V;
      let Y = V;
      !y && this.serviceColloctor.isOwn(Y) && (Y = this.serviceColloctor.getLocalId(Y));
      const N = n[b][a][L];
      if (N && Y === z) {
        if (((G = N.selectIds) == null ? void 0 : G.length) === 1) {
          const T = N.selectIds[0];
          if (d === x.Start) {
            const v = ((p = this.serviceColloctor) == null ? void 0 : p.isLocalId(T)) && ((W = this.serviceColloctor) == null ? void 0 : W.transformKey(T)) || T, g = n[b][a][v];
            this.cacheOriginRotate = ((r = g == null ? void 0 : g.opt) == null ? void 0 : r.rotate) || 0;
          }
          const I = N.updateNodeOpt || {};
          I.angle = (e + this.cacheOriginRotate) % 360, I.workState = d;
          const C = {
            workId: u,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: I,
            emitEventType: this.emitEventType,
            willRefreshSelector: !1,
            willSyncService: !0,
            viewId: b
          };
          d === x.Done && (C.willRefreshSelector = !0, C.willSerializeData = !0, C.undoTickerId = this.undoTickerId, this.cacheOriginRotate = 0), Z.push([C, {
            workId: u,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
        continue;
      }
    }
    d === x.Start ? this.mainEngine.unWritable() : d === x.Done && this.mainEngine.abled(), Z.length && this.collectForLocalWorker(Z);
  }
}
function eu(t) {
  switch (t) {
    case X.Text:
      return Rl.Text;
    case X.SpeechBalloon:
    case X.Star:
    case X.Ellipse:
    case X.Rectangle:
    case X.Triangle:
    case X.Rhombus:
    case X.Polygon:
      return Rl.Shape;
  }
}
class tu extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.SetFontStyle
    });
  }
  setTextStyle(l, c, e, d, b) {
    const { bold: s, underline: a, lineThrough: i, italic: n, fontSize: Z } = e;
    if (c.toolsType) {
      const o = eu(c.toolsType);
      o === Rl.Text && (c.opt && (s && (c.opt.bold = s), Vl(a) && (c.opt.underline = a), Vl(i) && (c.opt.lineThrough = i), n && (c.opt.italic = n), Z && (c.opt.fontSize = Z)), this.control.textEditorManager.updateTextForMasterController({
        workId: l,
        opt: c.opt,
        viewId: d,
        canSync: !0,
        canWorker: !0
      }, b)), Rl.Shape;
    }
  }
  collect(l) {
    var p, W, r, u;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, bold: e, italic: d, lineThrough: b, underline: s, viewId: a, fontSize: i } = l, n = this.control.viewContainerManager.getView(a);
    if (!(n != null && n.displayer))
      return;
    const Z = n.focusScenePath, o = [...c], m = this.serviceColloctor.storage, G = {};
    for (; o.length; ) {
      const V = o.pop();
      if (!V)
        continue;
      const y = V.toString(), L = this.serviceColloctor.isLocalId(y), Y = L ? this.serviceColloctor.transformKey(V) : y;
      let N = y;
      !L && this.serviceColloctor.isOwn(N) && (N = this.serviceColloctor.getLocalId(N));
      const T = m[a][Z][Y] || void 0;
      if (T) {
        const I = T.updateNodeOpt || {};
        if (e && (I.bold = e, G.bold = e === "bold"), d && (I.italic = d, G.italic = d === "italic"), Vl(b) && (I.lineThrough = b, G.lineThrough = b), Vl(s) && (I.underline = s, G.underline = s), i && (I.fontSize = i, G.textSize = i), T.toolsType === X.Text && T.opt) {
          this.setTextStyle(N, sl(T), I, a);
          continue;
        }
        if (T && N === z && ((p = T.selectIds) != null && p.length))
          for (const C of T.selectIds) {
            const K = (W = this.serviceColloctor) == null ? void 0 : W.isLocalId(C);
            let v = K && ((r = this.serviceColloctor) == null ? void 0 : r.transformKey(C)) || C;
            const g = m[a][Z][v] || void 0;
            if (!K && ((u = this.serviceColloctor) != null && u.isOwn(v)) && (v = this.serviceColloctor.getLocalId(v)), g && g.toolsType === X.Text && T.opt) {
              this.setTextStyle(v, sl(g), I, a);
              continue;
            }
          }
      }
    }
    Object.keys(G).length && setTimeout(() => {
      var V;
      (V = this.control.room) == null || V.setMemberState(G);
    }, 0);
  }
}
class du extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.SetPoint
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
  }
  collect(l) {
    var u;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workId: c, pointMap: e, workState: d, viewId: b } = l, s = this.control.viewContainerManager.getView(b);
    if (!(s != null && s.displayer))
      return;
    const a = s.focusScenePath, i = (u = this.serviceColloctor) == null ? void 0 : u.storage, n = [], Z = d === x.Start && Date.now() || void 0;
    Z && (this.undoTickerId = Z, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", Z, b));
    const o = c;
    if (!o)
      return;
    const m = o.toString(), G = this.serviceColloctor.isLocalId(m), p = G && this.serviceColloctor.transformKey(o) || m;
    let W = m;
    !G && this.serviceColloctor.isOwn(W) && (W = this.serviceColloctor.getLocalId(W));
    const r = i[b][a][p];
    if (r && W === z && r.selectIds) {
      const V = r.updateNodeOpt || {};
      V.pointMap = e, V.workState = d;
      const y = {
        workId: o,
        msgType: M.UpdateNode,
        dataType: Q.Local,
        updateNodeOpt: V,
        emitEventType: this.emitEventType,
        willRefreshSelector: !0,
        willSyncService: !0,
        viewId: b
      };
      d === x.Done && (y.undoTickerId = this.undoTickerId), n.push([y, {
        workId: o,
        msgType: M.UpdateNode,
        emitEventType: this.emitEventType
      }]);
    }
    d === x.Start ? this.mainEngine.unWritable() : d === x.Done && this.mainEngine.abled(), n.length && this.collectForLocalWorker(n);
  }
}
class bu extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.SetLock
    });
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, isLocked: e, viewId: d } = l, b = this.control.viewContainerManager.getView(d);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [...c], i = this.serviceColloctor.storage, n = [], Z = Date.now();
    for (; a.length; ) {
      const o = a.pop();
      if (!o)
        continue;
      const m = o.toString(), G = this.serviceColloctor.isLocalId(m), p = G ? this.serviceColloctor.transformKey(o) : m;
      let W = m;
      !G && this.serviceColloctor.isOwn(W) && (W = this.serviceColloctor.getLocalId(W));
      const r = i[d][s][p] || void 0;
      if (r) {
        const u = r.updateNodeOpt || {};
        u.isLocked = e;
        const V = {
          workId: W,
          msgType: M.UpdateNode,
          dataType: Q.Local,
          updateNodeOpt: u,
          emitEventType: this.emitEventType,
          willRefresh: !0,
          willRefreshSelector: !0,
          willSyncService: !0,
          viewId: d
        };
        n.push([V, {
          workId: W,
          msgType: M.UpdateNode,
          emitEventType: this.emitEventType
        }]);
      }
    }
    this.mainEngine.internalMsgEmitter.emit("undoTickerStart", Z, d), n.length && this.collectForLocalWorker(n);
  }
}
class su extends Ll {
  constructor() {
    super(...arguments), Object.defineProperty(this, "emitEventType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: R.SetShapeOpt
    });
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: c, viewId: e, ...d } = l, b = this.control.viewContainerManager.getView(e);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [...c], i = this.serviceColloctor.storage, n = [];
    for (; a.length; ) {
      const Z = a.pop();
      if (!Z)
        continue;
      const o = Z.toString(), m = this.serviceColloctor.isLocalId(o), G = m ? this.serviceColloctor.transformKey(Z) : o;
      let p = o;
      !m && this.serviceColloctor.isOwn(p) && (p = this.serviceColloctor.getLocalId(p));
      const W = i[e][s][G] || void 0;
      if (W) {
        const r = {
          ...W.updateNodeOpt,
          ...d,
          willRefresh: !0
        };
        if (W && p === z) {
          const u = {
            workId: p,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: r,
            emitEventType: this.emitEventType,
            willRefresh: !0,
            willRefreshSelector: !0,
            willSyncService: !0,
            viewId: e
            // undoTickerId
          };
          n.push([u, {
            workId: p,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
      }
    }
    n.length && this.collectForLocalWorker(n);
  }
}
class j {
  constructor(l) {
    Object.defineProperty(this, "builders", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), this.builders = new Map(l.map((c) => [c, this.build(c)]));
  }
  build(l) {
    switch (l) {
      case R.TranslateNode:
        return new $G();
      case R.ZIndexNode:
        return new qG();
      case R.ZIndexActive:
        return new DG();
      case R.CopyNode:
        return new EG();
      case R.SetColorNode:
        return new AG();
      case R.DeleteNode:
        return new _G();
      case R.ScaleNode:
        return new lu();
      case R.RotateNode:
        return new cu();
      case R.SetFontStyle:
        return new tu();
      case R.SetPoint:
        return new du();
      case R.SetLock:
        return new bu();
      case R.SetShapeOpt:
        return new su();
    }
  }
  getBuilder(l) {
    return this.builders.get(l);
  }
  registerForMainEngine(l, c) {
    return this.builders.forEach((e) => {
      e && e.registerForMainEngine(l, c);
    }), this;
  }
  destroy() {
    this.builders.forEach((l) => {
      l && l.destroy();
    });
  }
  static emitMethod(l, c, e) {
    Ll.dispatch(l, c, e);
  }
}
class au {
  constructor() {
    Object.defineProperty(this, "maxLastSyncTime", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 500
    });
  }
  /** 设置当前选中的工具配置数据 */
  setCurrentToolsData(l) {
    this.currentToolsData = l;
  }
  /** 设置当前绘制任务数据 */
  setCurrentLocalWorkData(l) {
    this.currentLocalWorkData = l;
  }
  /** 获取当前激活的工作任务id */
  getWorkId() {
    return this.currentLocalWorkData.workId;
  }
  /** 获取当前work的工作状态 */
  getWorkState() {
    return this.currentLocalWorkData.workState;
  }
}
class iu extends au {
  constructor(l) {
    var d, b;
    super(), Object.defineProperty(this, "isActive", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "currentToolsData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "currentLocalWorkData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "taskBatchData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Set()
    }), Object.defineProperty(this, "dpr", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1
    }), Object.defineProperty(this, "fullWorker", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "subWorker", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "methodBuilder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "zIndexNodeMethod", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "subWorkerDrawCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "wokerDrawCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "maxDrawCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "cacheDrawCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "reRenders", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
    }), Object.defineProperty(this, "localWorkViewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "localPointsBatchData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
    }), Object.defineProperty(this, "tasksqueue", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "useTasksqueue", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "useTasksClockId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "mianTasksqueueCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "workerTasksqueueCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "snapshotMap", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "boundingRectMap", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "clearAllResolve", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "delayWorkStateToDone", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "delayWorkStateToDoneResolve", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "animationId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
    const { control: c, internalMsgEmitter: e } = l;
    this.control = c, this.maxLastSyncTime = (((b = (d = this.control.pluginOptions) == null ? void 0 : d.syncOpt) == null ? void 0 : b.interval) || this.maxLastSyncTime) * 0.5, this.internalMsgEmitter = e, this.currentLocalWorkData = { workState: x.Pending };
  }
  get viewContainerManager() {
    return this.control.viewContainerManager;
  }
  get collector() {
    return this.control.collector;
  }
  get isRunSubWork() {
    var c;
    const l = (c = this.currentToolsData) == null ? void 0 : c.toolsType;
    return l === X.Pencil || l === X.LaserPen || l === X.Arrow || l === X.Straight || l === X.Ellipse || l === X.Rectangle || l === X.Star || l === X.Polygon || l === X.SpeechBalloon;
  }
  get isCanDrawWork() {
    var c;
    const l = (c = this.currentToolsData) == null ? void 0 : c.toolsType;
    return l === X.Pencil || l === X.LaserPen || l === X.Arrow || l === X.Straight || l === X.Ellipse || l === X.Rectangle || l === X.Star || l === X.Polygon || l === X.SpeechBalloon || l === X.Triangle || l === X.Rhombus;
  }
  get isUseZIndex() {
    var c;
    const l = (c = this.currentToolsData) == null ? void 0 : c.toolsType;
    return l === X.Pencil || l === X.Arrow || l === X.Straight || l === X.Ellipse || l === X.Rectangle || l === X.Star || l === X.Polygon || l === X.SpeechBalloon || l === X.Text || l === X.Image;
  }
  get isCanRecordUndoRedo() {
    var c;
    const l = (c = this.currentToolsData) == null ? void 0 : c.toolsType;
    return l === X.Pencil || l === X.Eraser || l === X.Arrow || l === X.Straight || l === X.Ellipse || l === X.Rectangle || l === X.Star || l === X.Polygon || l === X.SpeechBalloon || l === X.Text || l === X.Image;
  }
  get isCanSentCursor() {
    var c;
    const l = (c = this.currentToolsData) == null ? void 0 : c.toolsType;
    return l === X.Pencil || l === X.Text || l === X.LaserPen || l === X.Arrow || l === X.Straight || l === X.Ellipse || l === X.Rectangle || l === X.Star || l === X.Polygon || l === X.SpeechBalloon || l === X.Triangle || l === X.Rhombus;
  }
  init() {
    this.on(), this.internalMsgEmitterListener(), this.isActive = !0;
  }
  on() {
    this.fullWorker = new QG(), this.subWorker = new BG(), this.fullWorker.onmessage = (l) => {
      if (l.data) {
        const { render: c, sp: e, drawCount: d, workerTasksqueueCount: b } = l.data;
        if (b && (this.workerTasksqueueCount = b), e != null && e.length && this.collectorSyncData(e), !d && (c != null && c.length)) {
          this.viewContainerManager.render(c);
          return;
        }
        d && (this.wokerDrawCount = d, this.wokerDrawCount < 1 / 0 ? this.maxDrawCount = Math.max(this.maxDrawCount, this.wokerDrawCount) : this.maxDrawCount = 0, c != null && c.length && (this.viewContainerManager.render(c), this.wokerDrawCount < this.subWorkerDrawCount && (this.reRenders.forEach((s) => {
          s.isUnClose = !1;
        }), this.viewContainerManager.render(this.reRenders), this.reRenders.length = 0)));
      }
    }, this.subWorker.onmessage = (l) => {
      if (l.data) {
        const { render: c, drawCount: e, sp: d } = l.data;
        if (d != null && d.length && this.collectorSyncData(d), !e && (c != null && c.length)) {
          this.viewContainerManager.render(c);
          return;
        }
        e && (this.subWorkerDrawCount = e, this.wokerDrawCount < 1 / 0 && (this.maxDrawCount = Math.max(this.maxDrawCount, this.subWorkerDrawCount)), c != null && c.length && (this.subWorkerDrawCount > this.wokerDrawCount && (c.forEach((b) => b.isUnClose = !0), this.reRenders.push(...c)), this.wokerDrawCount < 1 / 0 && this.viewContainerManager.render(c)));
      }
    };
  }
  collectorSyncData(l) {
    var e, d;
    let c = !1;
    for (const b of l) {
      const { type: s, selectIds: a, opt: i, selectRect: n, strokeColor: Z, fillColor: o, willSyncService: m, isSync: G, undoTickerId: p, imageBitmap: W, canvasHeight: r, canvasWidth: u, rect: V, op: y, canTextEdit: L, points: Y, selectorColor: N, canRotate: T, scaleType: I, textOpt: C, toolsType: K, workId: v, viewId: g, dataType: P, canLock: _, isLocked: $, shapeOpt: q, toolsTypes: D } = b;
      if (!g) {
        console.error("collectorSyncData", b);
        return;
      }
      const B = b.scenePath || this.viewContainerManager.getCurScenePath(g);
      switch (s) {
        case M.Select: {
          const k = a != null && a.length ? { ...n, selectIds: a, canvasHeight: r, canvasWidth: u, points: Y } : void 0;
          k && (i != null && i.strokeColor) && (k.selectorColor = i.strokeColor), k && N && (k.selectorColor = N), k && Z && (k.strokeColor = Z), k && (i != null && i.fillColor) && (k.fillColor = i.fillColor), k && o && (k.fillColor = o), k && Vl(T) && (k.canRotate = T), k && I && (k.scaleType = I), k && L && (k.canTextEdit = L), k && C && (k.textOpt = C), k && Vl(_) && (k.canLock = _), k && Vl($) && (k.isLocked = $), k && q && (k.shapeOpt = q), k && D && (k.toolsTypes = D), g && this.viewContainerManager.showFloatBar(g, !!k, k), m && ((e = this.collector) == null || e.dispatch({ type: s, selectIds: a, opt: i, isSync: G, viewId: g, scenePath: B }));
          break;
        }
        case M.Snapshot:
          if (W && B) {
            const k = this.snapshotMap.get(B);
            k && k(W);
          }
          break;
        case M.BoundingBox:
          if (V && B) {
            const k = this.boundingRectMap.get(B);
            k && k(V);
          }
          break;
        case M.Cursor:
          y && this.control.cursor.collectServiceCursor({ ...b });
          break;
        case M.Clear:
          g && this.viewContainerManager.showFloatBar(g, !1), g && this.clearAllResolve && this.clearAllResolve(g);
          break;
        case M.TextUpdate:
          if (K === X.Text && v && g) {
            const k = this.viewContainerManager.transformToOriginPoint((i == null ? void 0 : i.boxPoint) || [0, 0], g), U = (i == null ? void 0 : i.boxSize) || [0, 0], H = (d = this.viewContainerManager.getView(g)) == null ? void 0 : d.cameraOpt;
            i ? this.control.textEditorManager.updateTextForWorker({
              x: k[0],
              y: k[1],
              w: U[0],
              h: U[1],
              scale: (H == null ? void 0 : H.scale) || 1,
              workId: v,
              opt: i,
              dataType: P,
              viewId: g,
              canSync: m || !1,
              canWorker: !1
            }) : this.control.textEditorManager.delete(v, m || !1, !1);
          }
          break;
        case M.GetTextActive:
          K === X.Text && v && g && this.control.textEditorManager.updateTextForWorker({
            workId: v,
            isActive: !0,
            viewId: g,
            dataType: Q.Local,
            canWorker: !1,
            canSync: !0
          }, Date.now());
          break;
        default:
          c = !0;
          break;
      }
      !c && p && this.internalMsgEmitter.emit("undoTickerEnd", p, g);
    }
    c && _l(() => {
      this.collectorAsyncData(l);
    }, this.maxLastSyncTime);
  }
  collectorAsyncData(l) {
    var c, e, d, b;
    for (const s of l) {
      const { type: a, op: i, workId: n, index: Z, removeIds: o, ops: m, opt: G, updateNodeOpt: p, toolsType: W, isSync: r, undoTickerId: u, viewId: V } = s;
      if (!V) {
        console.error("collectorAsyncData", s);
        return;
      }
      const y = s.scenePath || this.viewContainerManager.getCurScenePath(V);
      switch (a) {
        case M.DrawWork: {
          (c = this.collector) == null || c.dispatch({
            type: a,
            op: i,
            workId: n,
            index: Z,
            isSync: r,
            viewId: V,
            scenePath: y
          });
          break;
        }
        case M.FullWork: {
          (e = this.collector) == null || e.dispatch({
            type: a,
            ops: m,
            workId: n,
            updateNodeOpt: p,
            opt: G,
            toolsType: W,
            isSync: r,
            viewId: V,
            scenePath: y
          });
          break;
        }
        case M.UpdateNode: {
          (d = this.collector) == null || d.dispatch({ type: a, updateNodeOpt: p, workId: n, opt: G, ops: m, op: i, isSync: r, viewId: V, scenePath: y });
          break;
        }
        case M.RemoveNode: {
          o && this.control.textEditorManager.deleteBatch(o, !1, !1), (b = this.collector) == null || b.dispatch({ type: a, removeIds: o, isSync: r, viewId: V, scenePath: y });
          break;
        }
      }
      u && this.internalMsgEmitter.emit("undoTickerEnd", u, V);
    }
  }
  async onLocalEventEnd(l, c) {
    var a;
    const e = this.currentLocalWorkData.workState, d = this.viewContainerManager.getView(c);
    if (!d)
      return;
    const { focusScenePath: b, cameraOpt: s } = d;
    if (e === x.Start || e === x.Doing) {
      const i = this.viewContainerManager.transformToScenePoint(l, c);
      this.pushPoint(i), this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, workState: x.Done }), await new Promise((n) => {
        this.delayWorkStateToDone = setTimeout(() => {
          var o, m;
          this.delayWorkStateToDone = void 0, this.runAnimation();
          const Z = (o = this.currentLocalWorkData.workId) == null ? void 0 : o.toString();
          Z && b && this.control.runEffectWork(() => {
            var G;
            this.setShapeSelectorByWorkId(Z, c), ((G = this.currentToolsData) == null ? void 0 : G.toolsType) === X.Selector && this.viewContainerManager.activeFloatBar(c);
          }), this.delayWorkStateToDoneResolve = n, ((m = this.currentToolsData) == null ? void 0 : m.toolsType) === X.Selector && this.viewContainerManager.activeFloatBar(c);
        }, 0);
      }).then(() => {
        this.delayWorkStateToDoneResolve = void 0;
      });
    } else if (((a = this.currentToolsData) == null ? void 0 : a.toolsType) === X.Text) {
      const i = this.viewContainerManager.transformToScenePoint(l, c);
      if (this.localPointsBatchData[0] === i[0] && this.localPointsBatchData[1] === i[1]) {
        const n = this.currentToolsData.toolsOpt;
        n.workState = x.Doing, n.boxPoint = i, n.boxSize = [n.fontSize, n.fontSize], this.control.textEditorManager.checkEmptyTextBlur(), this.control.textEditorManager.createTextForMasterController({
          workId: Date.now().toString(),
          x: l[0],
          y: l[1],
          scale: (s == null ? void 0 : s.scale) || 1,
          opt: n,
          type: Rl.Text,
          isActive: !0,
          viewId: c,
          scenePath: b
        }, Date.now());
      }
      this.clearLocalPointsBatchData();
    }
  }
  onLocalEventDoing(l, c) {
    const e = this.currentLocalWorkData.workState;
    if (e === x.Start && this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, workState: x.Doing }), this.delayWorkStateToDone, e === x.Doing || this.delayWorkStateToDone) {
      const d = this.viewContainerManager.transformToScenePoint(l, c);
      this.pushPoint(d), this.delayWorkStateToDone, !this.delayWorkStateToDone && this.runAnimation();
      return;
    }
    this.hoverCursor(l, c);
  }
  onLocalEventStart(l, c) {
    var s, a, i, n, Z, o, m;
    this.viewContainerManager.focuedViewId !== c && this.viewContainerManager.setFocuedViewId(c), this.clearLocalPointsBatchData();
    const e = this.viewContainerManager.transformToScenePoint(l, c);
    if (this.pushPoint(e), ((s = this.currentToolsData) == null ? void 0 : s.toolsType) === X.Text)
      return;
    this.control.textEditorManager.checkEmptyTextBlur();
    const d = ((a = this.currentToolsData) == null ? void 0 : a.toolsType) === X.Selector ? z : Date.now(), b = this.setZIndex();
    if (this.setCurrentLocalWorkData({
      workId: d,
      workState: x.Start,
      toolsOpt: b,
      viewId: c,
      undoTickerId: this.isCanRecordUndoRedo && d || void 0
    }), this.isCanRecordUndoRedo && this.internalMsgEmitter.emit("undoTickerStart", d, c), this.maxDrawCount = 0, this.cacheDrawCount = 0, this.wokerDrawCount = 0, this.subWorkerDrawCount = 0, this.reRenders.length = 0, d && b && ((i = this.currentToolsData) != null && i.toolsType) && this.prepareOnceWork({ workId: d, toolsOpt: b, viewId: c }, (n = this.currentToolsData) == null ? void 0 : n.toolsType), this.isCanDrawWork) {
      const G = this.viewContainerManager.getCurScenePath(c);
      (o = this.collector) == null || o.dispatch({
        type: M.CreateWork,
        workId: d,
        toolsType: (Z = this.currentToolsData) == null ? void 0 : Z.toolsType,
        opt: b,
        viewId: c,
        scenePath: G
      }), G && this.blurSelector(c, G);
    } else
      ((m = this.currentToolsData) == null ? void 0 : m.toolsType) === X.Selector && this.viewContainerManager.unActiveFloatBar(c);
    this.consume();
  }
  pushPoint(l) {
    this.localPointsBatchData.push(l[0], l[1]);
  }
  async originalEventLintener(l, c, e) {
    if (this.isAbled())
      switch (l) {
        case x.Start:
          this.setLocalWorkViewId(e), e && this.onLocalEventStart(c, e);
          break;
        case x.Doing:
          e && e === this.getLocalWorkViewId() && this.onLocalEventDoing(c, e);
          break;
        case x.Done:
          e && e === this.getLocalWorkViewId() && await this.onLocalEventEnd(c, e);
          break;
      }
  }
  getLocalWorkViewId() {
    return this.localWorkViewId;
  }
  setLocalWorkViewId(l) {
    this.localWorkViewId = l;
  }
  setCurrentToolsData(l) {
    var b, s, a;
    const c = l.toolsType, e = ((b = this.currentToolsData) == null ? void 0 : b.toolsType) !== l.toolsType;
    super.setCurrentToolsData(l);
    const d = (s = this.viewContainerManager) == null ? void 0 : s.getAllViews();
    if (e) {
      for (const i of d)
        if (i) {
          const { id: n, focusScenePath: Z } = i;
          e && n && Z && ((a = this.collector) != null && a.hasSelector(n, Z) && this.blurSelector(n, Z), this.control.textEditorManager.checkEmptyTextBlur());
        }
      this.taskBatchData.add({
        msgType: M.UpdateTools,
        dataType: Q.Local,
        toolsType: c,
        opt: { ...l.toolsOpt, syncUnitTime: this.maxLastSyncTime },
        isRunSubWork: this.isRunSubWork,
        viewId: Sm
      }), this.runAnimation();
    }
  }
  setCurrentLocalWorkData(l) {
    super.setCurrentLocalWorkData(l);
    const { workId: c } = l;
    (!this.isAbled() || !c) && this.clearLocalPointsBatchData();
  }
  prepareOnceWork(l, c) {
    const { workId: e, toolsOpt: d, viewId: b } = l;
    this.taskBatchData.add({
      msgType: M.CreateWork,
      workId: e,
      toolsType: c,
      opt: { ...d, syncUnitTime: this.maxLastSyncTime },
      dataType: Q.Local,
      isRunSubWork: this.isRunSubWork,
      viewId: b
    }), this.runAnimation();
  }
  createViewWorker(l, c) {
    const { offscreenCanvasOpt: e, layerOpt: d, dpr: b, cameraOpt: s } = c;
    this.taskBatchData.add({
      msgType: M.Init,
      dataType: Q.Local,
      viewId: l,
      offscreenCanvasOpt: e,
      layerOpt: d,
      dpr: b,
      cameraOpt: s,
      isRunSubWork: !0,
      isSafari: navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1
    }), this.runAnimation();
  }
  destroyViewWorker(l, c = !1) {
    var e;
    this.taskBatchData.add({
      msgType: M.Destroy,
      dataType: Q.Local,
      viewId: l,
      isRunSubWork: !0
    }), this.runAnimation(), c || (e = this.collector) == null || e.dispatch({
      type: M.Clear,
      viewId: l
    });
  }
  onServiceDerive(l, c) {
    var o, m, G, p;
    const { newValue: e, oldValue: d, viewId: b, scenePath: s } = c, a = sl(e) || {}, i = l;
    let n = a.type;
    if (!e && d && (n = M.RemoveNode, d.toolsType === X.LaserPen))
      return;
    const Z = (o = this.viewContainerManager.getView(b)) == null ? void 0 : o.focusScenePath;
    if (!(Z && Z !== s)) {
      if (n && i) {
        const W = a;
        if (W.workId = (m = this.collector) != null && m.isOwn(i) ? (G = this.collector) == null ? void 0 : G.getLocalId(i) : i, W.msgType = n, W.dataType = Q.Service, W.viewId = b, W.scenePath = s, W.selectIds && (W.selectIds = W.selectIds.map((r) => {
          var u, V;
          return (u = this.collector) != null && u.isOwn(r) ? (V = this.collector) == null ? void 0 : V.getLocalId(r) : r;
        })), W && W.toolsType === X.Text || (d == null ? void 0 : d.toolsType) === X.Text) {
          this.control.textEditorManager.onServiceDerive(W);
          return;
        }
        this.taskBatchData.add(W);
      }
      if (this.runAnimation(), this.zIndexNodeMethod) {
        let W, r;
        c.newValue && ((p = c.newValue.opt) != null && p.zIndex) && (r = Math.max(r || 0, c.newValue.opt.zIndex), W = Math.min(W || 1 / 0, c.newValue.opt.zIndex)), r && (this.zIndexNodeMethod.maxZIndex = r), W && (this.zIndexNodeMethod.minZIndex = W);
      }
    }
  }
  pullServiceData(l, c) {
    var d, b, s, a, i, n;
    const e = ((d = this.collector) == null ? void 0 : d.storage[l]) && ((b = this.collector) == null ? void 0 : b.storage[l][c]) || void 0;
    if (e) {
      let Z, o;
      const m = Object.keys(e);
      for (const G of m) {
        const p = (s = e[G]) == null ? void 0 : s.type;
        if (p && G) {
          const W = sl(e[G]);
          if (W.workId = (a = this.collector) != null && a.isOwn(G) ? (i = this.collector) == null ? void 0 : i.getLocalId(G) : G, W.msgType = p, W.dataType = Q.Service, W.viewId = l, W.scenePath = c, W.useAnimation = !1, W.selectIds && (W.selectIds = W.selectIds.map((r) => {
            var u, V;
            return (u = this.collector) != null && u.isOwn(r) ? (V = this.collector) == null ? void 0 : V.getLocalId(r) : r;
          })), W.toolsType === X.Text) {
            this.control.textEditorManager.onServiceDerive(W);
            continue;
          }
          this.taskBatchData.add(W), (n = W.opt) != null && n.zIndex && (o = Math.max(o || 0, W.opt.zIndex), Z = Math.min(Z || 1 / 0, W.opt.zIndex));
        }
        this.internalMsgEmitter.emit("excludeIds", m, l);
      }
      this.runAnimation(), this.zIndexNodeMethod && (o && (this.zIndexNodeMethod.maxZIndex = o), Z && (this.zIndexNodeMethod.minZIndex = Z));
    }
  }
  runAnimation() {
    this.animationId || (this.animationId = requestAnimationFrame(this.consume.bind(this)));
  }
  consume() {
    this.animationId = void 0;
    const { workState: l, viewId: c, workId: e, undoTickerId: d } = this.currentLocalWorkData;
    if (!this.isAbled() && this.clearLocalPointsBatchData(), !this.delayWorkStateToDone) {
      if (l !== x.Pending && this.localPointsBatchData.length && c) {
        let b = !1;
        this.wokerDrawCount !== 1 / 0 && this.wokerDrawCount <= this.subWorkerDrawCount && this.cacheDrawCount < this.maxDrawCount && (b = !0), this.maxDrawCount || (b = !0), b && (this.taskBatchData.add({
          op: this.localPointsBatchData.map((s) => s),
          workState: l,
          workId: e,
          dataType: Q.Local,
          msgType: M.DrawWork,
          isRunSubWork: this.isRunSubWork,
          undoTickerId: l === x.Done && d || void 0,
          viewId: c,
          scenePath: c && this.viewContainerManager.getCurScenePath(c)
        }), this.delayWorkStateToDoneResolve && l === x.Done && this.delayWorkStateToDoneResolve(!0), this.clearLocalPointsBatchData(), this.cacheDrawCount = this.maxDrawCount);
      }
      if (this.taskBatchData.size) {
        this.post(this.taskBatchData);
        for (const b of this.taskBatchData.values())
          if (b.msgType === M.TasksQueue) {
            this.tasksqueue.clear();
            break;
          }
        this.taskBatchData.clear(), d && l === x.Done && this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, undoTickerId: void 0 });
      }
    }
    this.tasksqueue.size && this.consumeQueue(), (this.tasksqueue.size || this.taskBatchData.size || this.localPointsBatchData.length) && (this.animationId = requestAnimationFrame(this.consume.bind(this)));
  }
  unWritable() {
    this.setCurrentLocalWorkData({ workState: x.Unwritable, workId: void 0 });
  }
  abled() {
    this.setCurrentLocalWorkData({ workState: x.Pending, workId: void 0 });
  }
  isAbled() {
    return this.currentLocalWorkData.workState !== x.Unwritable;
  }
  post(l) {
    this.fullWorker.postMessage(l);
    const c = /* @__PURE__ */ new Set();
    for (const e of l.values()) {
      const d = e.msgType;
      (d === M.Init || d === M.Clear || d === M.Destroy || d === M.UpdateCamera || e.isRunSubWork) && c.add(e);
    }
    c.size && this.subWorker.postMessage(c);
  }
  destroy() {
    this.unWritable(), this.taskBatchData.clear(), this.clearLocalPointsBatchData(), this.fullWorker.terminate(), this.subWorker.terminate(), this.isActive = !1;
  }
  updateNode(l, c, e, d) {
    this.taskBatchData.add({
      msgType: M.UpdateNode,
      workId: l,
      updateNodeOpt: c,
      viewId: e,
      scenePath: d,
      dataType: Q.Local
    }), this.runAnimation();
  }
  updateCamera(l, c) {
    this.useTasksqueue || (this.useTasksqueue = !0, this.mianTasksqueueCount = 1, this.workerTasksqueueCount = 1), this.useTasksqueue && (this.tasksqueue.set(l, {
      msgType: M.UpdateCamera,
      dataType: Q.Local,
      cameraOpt: c,
      isRunSubWork: !0,
      viewId: l
    }), this.control.textEditorManager.onCameraChange(c, l), this.runAnimation(), this.useTasksClockId && clearTimeout(this.useTasksClockId), this.useTasksClockId = setTimeout(() => {
      this.useTasksClockId = void 0, this.tasksqueue.clear(), this.useTasksqueue = !1, this.mianTasksqueueCount = void 0, this.workerTasksqueueCount = void 0;
    }, this.maxLastSyncTime));
  }
  consumeQueue() {
    this.mianTasksqueueCount && this.workerTasksqueueCount && this.mianTasksqueueCount === this.workerTasksqueueCount && (this.mianTasksqueueCount++, this.taskBatchData.add({
      msgType: M.TasksQueue,
      dataType: Q.Local,
      isRunSubWork: !0,
      mainTasksqueueCount: this.mianTasksqueueCount,
      tasksqueue: this.tasksqueue,
      viewId: ""
    }));
  }
  async clearViewScenePath(l, c) {
    var e;
    if (this.control.textEditorManager.clear(l, c), this.taskBatchData.add({
      dataType: Q.Local,
      msgType: M.Clear,
      viewId: l
    }), this.runAnimation(), !c) {
      const d = this.viewContainerManager.getCurScenePath(l);
      (e = this.collector) == null || e.dispatch({
        type: M.Clear,
        viewId: l,
        scenePath: d
      });
    }
    this.zIndexNodeMethod && (this.zIndexNodeMethod.maxZIndex = 0, this.zIndexNodeMethod.minZIndex = 0), this.clearLocalPointsBatchData(), await new Promise((d) => {
      this.clearAllResolve = d;
    }).then(() => {
      this.clearAllResolve = void 0;
    });
  }
  internalMsgEmitterListener() {
    var l;
    this.methodBuilder = new j([
      R.CopyNode,
      R.SetColorNode,
      R.DeleteNode,
      R.RotateNode,
      R.ScaleNode,
      R.TranslateNode,
      R.ZIndexActive,
      R.ZIndexNode,
      R.RotateNode,
      R.SetFontStyle,
      R.SetPoint,
      R.SetLock,
      R.SetShapeOpt
    ]).registerForMainEngine(F.MainEngine, this.control), this.zIndexNodeMethod = (l = this.methodBuilder) == null ? void 0 : l.getBuilder(R.ZIndexNode);
  }
  setZIndex() {
    const l = this.currentToolsData && sl(this.currentToolsData.toolsOpt);
    return l && this.zIndexNodeMethod && this.isUseZIndex && (this.zIndexNodeMethod.addMaxLayer(), l.zIndex = this.zIndexNodeMethod.maxZIndex), l;
  }
  clearLocalPointsBatchData() {
    this.localPointsBatchData.length = 0;
  }
  hoverCursor(l, c) {
    var e;
    if (((e = this.currentToolsData) == null ? void 0 : e.toolsType) === X.Selector) {
      const d = this.viewContainerManager.transformToScenePoint(l, c), b = {
        msgType: M.CursorHover,
        dataType: Q.Local,
        point: d,
        toolsType: this.currentToolsData.toolsType,
        opt: this.currentToolsData.toolsOpt,
        isRunSubWork: !1,
        viewId: c
      };
      this.queryTaskBatchData({
        msgType: M.CursorHover,
        dataType: Q.Local,
        toolsType: this.currentToolsData.toolsType,
        viewId: c
      }).forEach((s) => {
        this.taskBatchData.delete(s);
      }), this.taskBatchData.add(b), this.runAnimation();
    }
  }
  sendCursorEvent(l, c) {
    if (!this.currentLocalWorkData || this.currentLocalWorkData.workState === x.Unwritable || !this.currentToolsData || !this.isCanSentCursor)
      return;
    let e = [void 0, void 0];
    this.currentToolsData && (this.isCanDrawWork || this.currentToolsData.toolsType === X.Text) && this.currentLocalWorkData.workState !== x.Start && this.currentLocalWorkData.workState !== x.Doing && (e = l, this.control.cursor.sendEvent(e, c));
  }
  getBoundingRect(l) {
    var e, d;
    if (!((e = this.boundingRectMap) == null ? void 0 : e.get(l))) {
      const b = (d = this.collector) == null ? void 0 : d.getScenePathData(l);
      if (!b)
        return;
      if (Object.keys(b).forEach((s) => {
        var a;
        ((a = this.collector) == null ? void 0 : a.getLocalId(s)) === z && delete b[s];
      }), Object.keys(b).length && this.viewContainerManager.mainView && this.viewContainerManager.mainView.cameraOpt) {
        const s = {
          msgType: M.BoundingBox,
          dataType: Q.Local,
          scenePath: l,
          scenes: b,
          cameraOpt: { ...this.viewContainerManager.mainView.cameraOpt },
          isRunSubWork: !0,
          viewId: this.viewContainerManager.mainView.id
        };
        return this.taskBatchData.add(s), this.runAnimation(), new Promise((a) => {
          this.boundingRectMap.set(l, a);
        }).then((a) => (this.boundingRectMap.delete(l), a));
      }
    }
  }
  getSnapshot(l, c, e, d) {
    var s, a, i, n, Z, o;
    if (!((s = this.snapshotMap) == null ? void 0 : s.get(l))) {
      const m = (a = this.collector) == null ? void 0 : a.getViewIdBySecenPath(l);
      if (!m)
        return;
      const G = (i = this.collector) == null ? void 0 : i.getStorageData(m, l);
      if (!G)
        return;
      if (Object.keys(G).forEach((p) => {
        var W;
        ((W = this.collector) == null ? void 0 : W.getLocalId(p)) === z && delete G[p];
      }), Object.keys(G).length) {
        const p = this.viewContainerManager.getView(m) || this.viewContainerManager.focuedView;
        if (!p)
          return;
        const W = c || ((n = p.cameraOpt) == null ? void 0 : n.width), r = e || ((Z = p.cameraOpt) == null ? void 0 : Z.height), u = {
          msgType: M.Snapshot,
          dataType: Q.Local,
          scenePath: l,
          scenes: G,
          w: W,
          h: r,
          cameraOpt: d && {
            ...d,
            width: W,
            height: r
          } || p.cameraOpt,
          isRunSubWork: !0,
          viewId: m,
          maxZIndex: (o = this.zIndexNodeMethod) == null ? void 0 : o.maxZIndex
        };
        return this.taskBatchData.add(u), this.runAnimation(), new Promise((V) => {
          this.snapshotMap.set(l, V);
        }).then((V) => (this.snapshotMap.delete(l), V));
      }
    }
  }
  queryTaskBatchData(l) {
    const c = [];
    if (l)
      for (const e of this.taskBatchData.values()) {
        let d = !0;
        for (const [b, s] of Object.entries(l))
          if (e[b] !== s) {
            d = !1;
            break;
          }
        d && c.push(e);
      }
    return c;
  }
  insertImage(l) {
    const c = this.viewContainerManager.mainView, e = c == null ? void 0 : c.id, d = c == null ? void 0 : c.focusScenePath;
    if (e && d) {
      this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, undoTickerId: Date.now() }), Wl.InternalMsgEmitter.emit("undoTickerStart", this.undoTickerId, e);
      const b = { ...l };
      this.zIndexNodeMethod && (this.zIndexNodeMethod.addMaxLayer(), b.zIndex = this.zIndexNodeMethod.maxZIndex), this.taskBatchData.add({
        msgType: M.FullWork,
        dataType: Q.Local,
        toolsType: X.Image,
        workId: l.uuid,
        opt: b,
        viewId: e,
        undoTickerId: l.src && this.undoTickerId || void 0,
        willRefresh: !0,
        willSyncService: !0
      }), this.runAnimation();
    }
  }
  lockImage(l, c) {
    var s, a;
    const e = this.viewContainerManager.mainView, d = e == null ? void 0 : e.id, b = e == null ? void 0 : e.focusScenePath;
    if (d && b && this.collector) {
      const i = this.collector.getStorageData(d, b);
      if (!i)
        return;
      for (const [n, Z] of Object.entries(i))
        if (Z && Z.toolsType === X.Image && Z.opt.uuid === l) {
          const o = Date.now();
          Wl.InternalMsgEmitter.emit("undoTickerStart", o, d);
          const m = (s = this.collector) != null && s.isOwn(n) ? (a = this.collector) == null ? void 0 : a.getLocalId(n) : n, G = { ...Z.opt, locked: c };
          this.taskBatchData.add({
            msgType: M.FullWork,
            dataType: Q.Local,
            toolsType: X.Image,
            workId: m,
            opt: G,
            viewId: d,
            undoTickerId: o,
            willRefresh: !0,
            willSyncService: !0
          }), this.runAnimation();
          return;
        }
    }
  }
  completeImageUpload(l, c) {
    var s, a;
    const e = this.viewContainerManager.mainView, d = e == null ? void 0 : e.id, b = e == null ? void 0 : e.focusScenePath;
    if (d && b && this.collector) {
      const i = this.collector.getStorageData(d, b);
      if (!i)
        return;
      for (const [n, Z] of Object.entries(i))
        if (Z && Z.toolsType === X.Image && Z.opt.uuid === l) {
          const o = (s = this.collector) != null && s.isOwn(n) ? (a = this.collector) == null ? void 0 : a.getLocalId(n) : n, m = { ...Z.opt, src: c };
          this.taskBatchData.add({
            msgType: M.FullWork,
            dataType: Q.Local,
            toolsType: X.Image,
            workId: o,
            opt: m,
            viewId: d,
            undoTickerId: this.undoTickerId,
            willRefresh: !0,
            willSyncService: !0
          }), this.runAnimation();
          break;
        }
    }
  }
  getImagesInformation(l) {
    const c = [];
    if (this.collector) {
      const e = this.collector.getScenePathData(l);
      if (!e)
        return c;
      for (const d of Object.values(e))
        if (d && d.toolsType === X.Image) {
          const b = d.opt;
          c.push({
            uuid: b.uuid,
            centerX: b.centerX,
            centerY: b.centerY,
            width: b.width,
            height: b.height,
            locked: b.locked,
            uniformScale: b.uniformScale,
            crossOrigin: b.crossOrigin
          });
        }
    }
    return c;
  }
  setShapeSelectorByWorkId(l, c, e) {
    this.taskBatchData.add({
      workId: z,
      selectIds: [l],
      msgType: M.Select,
      dataType: Q.Service,
      viewId: c,
      willSyncService: !0,
      undoTickerId: e
    }), this.runAnimation();
  }
  blurSelector(l, c, e) {
    this.taskBatchData.add({
      workId: z,
      selectIds: [],
      msgType: M.Select,
      dataType: Q.Service,
      viewId: l,
      scenePath: c,
      undoTickerId: e
    }), this.runAnimation();
  }
}
var nu = zl, Zu = function() {
  return nu.Date.now();
}, ou = Zu, mu = /\s/;
function Gu(t) {
  for (var l = t.length; l-- && mu.test(t.charAt(l)); )
    ;
  return l;
}
var uu = Gu, hu = uu, pu = /^\s+/;
function yu(t) {
  return t && t.slice(0, hu(t) + 1).replace(pu, "");
}
var Wu = yu, Xu = Dl, ru = gl, Vu = "[object Symbol]";
function Yu(t) {
  return typeof t == "symbol" || ru(t) && Xu(t) == Vu;
}
var Lu = Yu, xu = Wu, qe = jl, Ru = Lu, $e = NaN, Nu = /^[-+]0x[0-9a-f]+$/i, Mu = /^0b[01]+$/i, Tu = /^0o[0-7]+$/i, Su = parseInt;
function zu(t) {
  if (typeof t == "number")
    return t;
  if (Ru(t))
    return $e;
  if (qe(t)) {
    var l = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = qe(l) ? l + "" : l;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = xu(t);
  var c = Mu.test(t);
  return c || Tu.test(t) ? Su(t.slice(2), c ? 2 : 8) : Nu.test(t) ? $e : +t;
}
var Iu = zu, vu = jl, Cc = ou, _e = Iu, Hu = "Expected a function", Ju = Math.max, ku = Math.min;
function Cu(t, l, c) {
  var e, d, b, s, a, i, n = 0, Z = !1, o = !1, m = !0;
  if (typeof t != "function")
    throw new TypeError(Hu);
  l = _e(l) || 0, vu(c) && (Z = !!c.leading, o = "maxWait" in c, b = o ? Ju(_e(c.maxWait) || 0, l) : b, m = "trailing" in c ? !!c.trailing : m);
  function G(N) {
    var T = e, I = d;
    return e = d = void 0, n = N, s = t.apply(I, T), s;
  }
  function p(N) {
    return n = N, a = setTimeout(u, l), Z ? G(N) : s;
  }
  function W(N) {
    var T = N - i, I = N - n, C = l - T;
    return o ? ku(C, b - I) : C;
  }
  function r(N) {
    var T = N - i, I = N - n;
    return i === void 0 || T >= l || T < 0 || o && I >= b;
  }
  function u() {
    var N = Cc();
    if (r(N))
      return V(N);
    a = setTimeout(u, W(N));
  }
  function V(N) {
    return a = void 0, m && e ? G(N) : (e = d = void 0, s);
  }
  function y() {
    a !== void 0 && clearTimeout(a), n = 0, e = i = d = a = void 0;
  }
  function L() {
    return a === void 0 ? s : V(Cc());
  }
  function Y() {
    var N = Cc(), T = r(N);
    if (e = arguments, d = this, i = N, T) {
      if (a === void 0)
        return p(i);
      if (o)
        return clearTimeout(a), a = setTimeout(u, l), G(i);
    }
    return a === void 0 && (a = setTimeout(u, l)), s;
  }
  return Y.cancel = y, Y.flush = L, Y;
}
var Ft = Cu;
const lt = /* @__PURE__ */ Bl(Ft);
var Ku = Ft, wu = jl, gu = "Expected a function";
function Fu(t, l, c) {
  var e = !0, d = !0;
  if (typeof t != "function")
    throw new TypeError(gu);
  return wu(c) && (e = "leading" in c ? !!c.leading : e, d = "trailing" in c ? !!c.trailing : d), Ku(t, l, {
    leading: e,
    maxWait: l,
    trailing: d
  });
}
var Uu = Fu;
const al = /* @__PURE__ */ Bl(Uu);
var Lc;
(function(t) {
  t.Mac = "mac", t.Windows = "windows";
})(Lc || (Lc = {}));
class ju {
  constructor(l) {
    var d;
    Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "roomHotkeyCheckers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "tmpCopyStore", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "tmpCopyCoordInfo", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
    const { control: c, internalMsgEmitter: e } = l;
    this.control = c, this.internalMsgEmitter = e, this.roomHotkeyCheckers = ((d = this.control.room) == null ? void 0 : d.viewsParams.hotKeys.nodes) || [];
  }
  get isUseSelf() {
    var l;
    return ((l = this.control.room) == null ? void 0 : l.disableDeviceInputs) || !1;
  }
  get isSelector() {
    var l;
    return ((l = this.control.worker.currentToolsData) == null ? void 0 : l.toolsType) === X.Selector;
  }
  get collector() {
    return this.control.collector;
  }
  get mainEngine() {
    return this.control.worker;
  }
  get keyboardKind() {
    return /^Mac/i.test(navigator.platform) ? Lc.Mac : Lc.Windows;
  }
  getEventKey(l) {
    switch (l.type) {
      case "keydown":
        return "KeyDown";
    }
    return "KeyUp";
  }
  onActiveHotkey(l) {
    var d, b, s;
    console.log("onActiveHotkey---sdk", l);
    const c = this.control.viewContainerManager.focuedViewId, e = (d = this.control.viewContainerManager.focuedView) == null ? void 0 : d.focusScenePath;
    if (c && e)
      switch (l) {
        case "delete":
          this.isSelector && ((b = this.collector) != null && b.hasSelector(c, e)) && j.emitMethod(F.MainEngine, R.DeleteNode, { workIds: [z], viewId: c });
          break;
        case "copy":
          this.isSelector && ((s = this.collector) != null && s.hasSelector(c, e)) && this.copySelectorToTemp(c, e);
          break;
        case "paste":
          this.tmpCopyStore.size && this.pasteTempToFocusView(c, e);
          break;
      }
    (l === "changeToPencil" || l === "redo" || l === "undo") && this.onSelfActiveHotkey(l);
  }
  colloctHotkey(l) {
    if (this.isUseSelf) {
      const c = this.checkHotkey(l);
      c && this.onSelfActiveHotkey(c);
    }
  }
  onSelfActiveHotkey(l) {
    switch (console.log("onActiveHotkey---self", l), l) {
      case "changeToPencil":
        this.setMemberState({ currentApplianceName: E.pencil, useNewPencil: !0 });
        break;
      case "changeToArrow":
        this.setMemberState({ currentApplianceName: E.arrow });
        break;
      case "changeToClick":
        this.setMemberState({ currentApplianceName: E.clicker });
        break;
      case "changeToEllipse":
        this.setMemberState({ currentApplianceName: E.ellipse });
        break;
      case "changeToEraser":
        this.setMemberState({ currentApplianceName: E.eraser, isLine: !0 });
        break;
      case "changeToHand":
        this.setMemberState({ currentApplianceName: E.hand });
        break;
      case "changeToLaserPointer":
        this.setMemberState({ currentApplianceName: E.laserPointer });
        break;
      case "changeToSelector":
        this.setMemberState({ currentApplianceName: E.selector });
        break;
      case "changeToRectangle":
        this.setMemberState({ currentApplianceName: E.rectangle });
        break;
      case "changeToStraight":
        this.setMemberState({ currentApplianceName: E.straight });
        break;
      case "redo":
        this.control.room && !this.control.room.disableSerialization && this.control.viewContainerManager.redo();
        break;
      case "undo":
        this.control.room && !this.control.room.disableSerialization && this.control.viewContainerManager.undo();
        break;
      case "changeToText":
        this.setMemberState({ currentApplianceName: E.text });
        break;
    }
  }
  checkHotkey(l) {
    for (const c of this.roomHotkeyCheckers) {
      const { kind: e, checker: d } = c;
      if (d({
        nativeEvent: l,
        kind: this.getEventKey(l),
        key: l.key,
        altKey: l.altKey,
        ctrlKey: l.ctrlKey,
        shiftKey: l.shiftKey
      }, this.keyboardKind))
        return e;
    }
  }
  copySelectorToTemp(l, c) {
    var n, Z;
    const e = this.control.viewContainerManager.getView(l), d = (Z = (n = this.mainEngine) == null ? void 0 : n.methodBuilder) == null ? void 0 : Z.getBuilder(R.CopyNode);
    if (!e || !this.collector || !d)
      return;
    const b = this.collector.transformKey(z), s = this.collector.getStorageData(l, c);
    if (!s)
      return;
    const a = s[b], i = a && d.copySelector({
      viewId: l,
      store: a
    });
    i && (this.tmpCopyCoordInfo = i == null ? void 0 : i.copyCoordInfo, this.tmpCopyStore = i == null ? void 0 : i.copyStores);
  }
  pasteTempToFocusView(l, c) {
    var b, s;
    const e = this.control.viewContainerManager.getView(l), d = (s = (b = this.mainEngine) == null ? void 0 : b.methodBuilder) == null ? void 0 : s.getBuilder(R.CopyNode);
    if (!(!e || !this.tmpCopyCoordInfo || !this.tmpCopyStore.size || !this.collector || !d) && e.viewData && this.tmpCopyCoordInfo) {
      const a = ne(this.tmpCopyCoordInfo.offset), i = this.tmpCopyCoordInfo.cameraOpt, n = e.viewData.camera;
      a.x = a.x + n.centerX - i.centerX, a.y = a.y + n.centerY - i.centerY, d.pasteSelector({
        viewId: l,
        scenePath: c,
        copyStores: ne(this.tmpCopyStore),
        copyCoordInfo: {
          offset: a,
          cameraOpt: n
        }
      });
    }
  }
  setMemberState(l) {
    var c;
    (c = this.control.room) == null || c.setMemberState(l);
  }
}
class Wl {
  constructor(l) {
    Object.defineProperty(this, "plugin", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "room", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "play", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "collector", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "hasSwitchToSelectorEffect", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "effectResolve", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "hotkeyManager", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pluginOptions", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "roomMember", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cursor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "textEditorManager", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "worker", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "onSceneChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (s, a) => {
        var o;
        const i = this.viewContainerManager.getView(a);
        i != null && i.focusScenePath && (o = this.collector) != null && o.hasSelector(a, i.focusScenePath) && this.worker.blurSelector(a, i.focusScenePath), this.textEditorManager.checkEmptyTextBlur();
        const n = i == null ? void 0 : i.displayer;
        n && (n.setActive(!1), await n.stopEventHandler());
        const Z = s;
        Z && this.viewContainerManager.setViewScenePath(a, Z), n == null || n.setActive(!0);
      }
    }), Object.defineProperty(this, "onRoomMembersChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (s) => {
        this.roomMember.setRoomMembers(dt(s));
      }
    }), Object.defineProperty(this, "onMemberChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al((s) => {
        if (!this.room || !this.worker)
          return;
        const a = this.getToolsKey(s), i = this.getToolsOpt(a, s);
        this.worker.setCurrentToolsData(i), this.effectViewContainer(a), this.effectResolve && this.effectResolve(!0);
      }, 100, { leading: !1 })
    }), Object.defineProperty(this, "internalSceneChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (s, a) => {
        var i;
        (i = this.worker) == null || i.clearViewScenePath(s, !0).then(() => {
          var n;
          (n = this.worker) == null || n.pullServiceData(s, a);
        });
      }
    }), Object.defineProperty(this, "internalCameraChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (s, a) => {
        var i;
        (i = this.worker) == null || i.updateCamera(s, a);
      }
    });
    const { displayer: c, plugin: e, options: d } = l;
    this.plugin = e, this.room = ll(c) ? c : void 0, this.play = Qc(c) ? c : void 0, this.pluginOptions = d, this.roomMember = new UG();
    const b = {
      control: this,
      internalMsgEmitter: Wl.InternalMsgEmitter
    };
    this.cursor = new PG(b), this.textEditorManager = new jG(b), this.worker = new iu(b), this.hotkeyManager = new ju(b);
  }
  bindPlugin(l) {
    var c, e;
    this.plugin = l, this.collector && this.collector.removeStorageStateListener(), this.collector = new Cl(l, (e = (c = this.pluginOptions) == null ? void 0 : c.syncOpt) == null ? void 0 : e.interval), this.cursor.activeCollector(), this.activePlugin();
  }
  /** 销毁 */
  destroy() {
    var l, c, e, d, b;
    this.roomMember.destroy(), (l = this.collector) == null || l.destroy(), (c = this.worker) == null || c.destroy(), (e = this.viewContainerManager) == null || e.destroy(), (d = this.cursor) == null || d.destroy(), (b = this.textEditorManager) == null || b.destory();
  }
  /** 清空当前获焦路径下的所有内容 */
  cleanCurrentScene() {
    const l = Date.now(), c = this.worker.getLocalWorkViewId() || this.viewContainerManager.focuedViewId;
    c && (Wl.InternalMsgEmitter.emit("undoTickerStart", l, c), this.worker.clearViewScenePath(c).then(() => {
      Wl.InternalMsgEmitter.emit("undoTickerEnd", l, c);
    }));
  }
  /** 监听读写状态变更 */
  onWritableChange(l) {
    var c, e;
    l ? (e = this.worker) == null || e.abled() : (c = this.worker) == null || c.unWritable();
  }
  /** 获取当前工具key */
  getToolsKey(l) {
    const c = l.currentApplianceName;
    switch (this.hasSwitchToSelectorEffect = !1, c) {
      case E.text:
        return l.textCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), X.Text;
      case E.pencil:
        if (l.useNewPencil)
          return X.Pencil;
        if (l.useLaserPen)
          return X.LaserPen;
        break;
      case E.eraser:
      case E.pencilEraser:
        return X.Eraser;
      case E.selector:
        return X.Selector;
      case E.arrow:
        return l.arrowCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), X.Arrow;
      case E.straight:
        return l.straightCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), X.Straight;
      case E.ellipse:
        return l.ellipseCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), X.Ellipse;
      case E.rectangle:
        return l.rectangleCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), X.Rectangle;
      case E.shape:
        if (l.shapeCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), l.shapeType === Tl.Pentagram || l.shapeType === Tl.Star)
          return X.Star;
        if (l.shapeType === Tl.Polygon || l.shapeType === Tl.Triangle || l.shapeType === Tl.Rhombus)
          return X.Polygon;
        if (l.shapeType === Tl.SpeechBalloon)
          return X.SpeechBalloon;
        break;
    }
    return X.Clicker;
  }
  /** 获取当前工具默认配置 */
  getToolsOpt(l, c) {
    const e = c.currentApplianceName, d = {
      strokeColor: Gc(c.strokeColor[0], c.strokeColor[1], c.strokeColor[2], c.strokeOpacity || 1),
      thickness: c.strokeWidth,
      isOpacity: (c == null ? void 0 : c.strokeOpacity) && c.strokeOpacity < 1 || (c == null ? void 0 : c.fillOpacity) && c.fillOpacity < 1 || (c == null ? void 0 : c.textOpacity) && c.textOpacity < 1 || (c == null ? void 0 : c.textBgOpacity) && c.textBgOpacity < 1 || !1
    };
    switch (l) {
      case X.Text:
        d.fontFamily = window.getComputedStyle(document.documentElement).getPropertyValue("font-family"), d.fontSize = (c == null ? void 0 : c.textSizeOverride) || (c == null ? void 0 : c.textSize) || Number(window.getComputedStyle(document.body).fontSize), d.textAlign = (c == null ? void 0 : c.textAlign) || "left", d.verticalAlign = (c == null ? void 0 : c.verticalAlign) || "middle", d.fontColor = (c == null ? void 0 : c.textColor) && Gc(c.textColor[0], c.textColor[1], c.textColor[2], c.textOpacity || 1) || d.strokeColor || "rgba(0,0,0,1)", d.fontBgColor = Array.isArray(c == null ? void 0 : c.textBgColor) && Gc(c.textBgColor[0], c.textBgColor[1], c.textBgColor[2], c.textBgOpacity || 1) || "transparent", d.bold = (c == null ? void 0 : c.bold) && "bold" || void 0, d.italic = (c == null ? void 0 : c.italic) && "italic" || void 0, d.underline = (c == null ? void 0 : c.underline) || void 0, d.lineThrough = (c == null ? void 0 : c.lineThrough) || void 0, d.text = "", d.strokeColor = void 0;
        break;
      case X.Pencil:
        d.strokeType = (c == null ? void 0 : c.strokeType) || Vc.Normal;
        break;
      case X.Eraser:
        d.thickness = Math.min(3, Math.max(1, Math.floor(c.pencilEraserSize || 1))) - 1, d.isLine = e === E.eraser && !0;
        break;
      case X.LaserPen:
        d.duration = (c == null ? void 0 : c.duration) || 1, d.strokeType = (c == null ? void 0 : c.strokeType) || Vc.Normal;
        break;
      case X.Ellipse:
      case X.Rectangle:
      case X.Star:
      case X.Polygon:
      case X.SpeechBalloon:
        l === X.Star && (c.shapeType === Tl.Pentagram ? (d.vertices = 10, d.innerVerticeStep = 2, d.innerRatio = 0.4) : c != null && c.vertices && (c != null && c.innerVerticeStep) && (c != null && c.innerRatio) && (d.vertices = c.vertices, d.innerVerticeStep = c.innerVerticeStep, d.innerRatio = c.innerRatio)), l === X.Polygon && (c.shapeType === Tl.Triangle ? d.vertices = 3 : c.shapeType === Tl.Rhombus ? d.vertices = 4 : c.vertices && (d.vertices = c.vertices)), d.fillColor = (c == null ? void 0 : c.fillColor) && Gc(c.fillColor[0], c.fillColor[1], c.fillColor[2], c == null ? void 0 : c.fillOpacity) || "transparent", l === X.SpeechBalloon && (d.placement = c.placement || "bottomLeft");
        break;
    }
    return {
      toolsType: l,
      toolsOpt: d
    };
  }
  /** 激活当前view容器*/
  effectViewContainer(l) {
    var c, e, d, b, s;
    switch (l) {
      case X.Text:
      case X.Pencil:
      case X.LaserPen:
      case X.Arrow:
      case X.Straight:
      case X.Rectangle:
      case X.Ellipse:
      case X.Star:
      case X.Polygon:
      case X.SpeechBalloon:
      case X.Triangle:
      case X.Rhombus:
        this.room.disableDeviceInputs = !0, (c = this.worker) == null || c.abled();
        break;
      case X.Eraser:
      case X.Selector:
        this.room.disableDeviceInputs = !1, (e = this.cursor) == null || e.unabled(), (d = this.worker) == null || d.abled();
        break;
      default:
        this.room.disableDeviceInputs = !1, (b = this.worker) == null || b.unWritable(), (s = this.cursor) == null || s.unabled();
        break;
    }
    setTimeout(() => {
      this.viewContainerManager.getAllViews().forEach((i) => {
        i != null && i.displayer && i.displayer.bindToolsClass();
      });
    }, 0);
  }
  /** 异步获取指定路径下绘制内容的区域大小 */
  async getBoundingRect(l) {
    var e, d, b, s, a;
    const c = await ((e = this.worker) == null ? void 0 : e.getBoundingRect(l));
    if (c) {
      const i = ((b = (d = this.viewContainerManager.mainView) == null ? void 0 : d.viewData) == null ? void 0 : b.convertToPointInWorld({ x: c.x, y: c.y })) || { x: c.x, y: c.y }, n = ((a = (s = this.viewContainerManager.mainView) == null ? void 0 : s.viewData) == null ? void 0 : a.camera.scale) || 1;
      return {
        width: Math.floor(c.w / n) + 1,
        height: Math.floor(c.h / n) + 1,
        originX: i.x,
        originY: i.y
      };
    }
  }
  /** 异步获取指定路径下的的快照并绘制到指定的画布上 */
  async screenshotToCanvas(l, c, e, d, b) {
    const s = await this.worker.getSnapshot(c, e, d, b);
    s && (l.drawImage(s, 0, 0), s.close());
  }
  /** 异步获取指定路径下的缩略图 */
  async scenePreview(l, c) {
    var s, a, i, n;
    const e = (s = this.collector) == null ? void 0 : s.getViewIdBySecenPath(l);
    if (!e)
      return;
    const d = this.viewContainerManager.getView(e);
    if (!d || !((a = d.cameraOpt) != null && a.width) || !((i = d.cameraOpt) != null && i.height))
      return;
    const b = await ((n = this.worker) == null ? void 0 : n.getSnapshot(l));
    if (b && this.worker) {
      const Z = document.createElement("canvas"), o = Z.getContext("2d"), { width: m, height: G } = d.cameraOpt;
      Z.width = m, Z.height = G, o && (o.drawImage(b, 0, 0), c.src = Z.toDataURL(), c.onload = () => {
        Z.remove();
      }, c.onerror = () => {
        Z.remove(), c.remove();
      }), b.close();
    }
  }
  /** 切换到选择工具 */
  switchToSelector() {
    var l;
    (l = this.room) == null || l.setMemberState({ currentApplianceName: E.selector });
  }
  /** 开始执行副作用 */
  async runEffectWork(l) {
    if (this.hasSwitchToSelectorEffect) {
      const c = await new Promise((e) => {
        this.switchToSelector(), this.effectResolve = e;
      });
      this.effectResolve = void 0, c && l && l();
    }
  }
}
Object.defineProperty(Wl, "InternalMsgEmitter", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new at()
});
var Pu = Ht, fu = 4;
function Qu(t) {
  return Pu(t, fu);
}
var Ou = Qu;
const ct = /* @__PURE__ */ Bl(Ou);
var ql;
(function(t) {
  t[t.sdk = 1] = "sdk", t[t.plugin = 2] = "plugin", t[t.both = 3] = "both";
})(ql || (ql = {}));
var Fl;
(function(t) {
  t[t.Draw = 1] = "Draw", t[t.Delete = 2] = "Delete", t[t.Update = 3] = "Update";
})(Fl || (Fl = {}));
class wl {
  constructor(l) {
    Object.defineProperty(this, "emitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: new at()
    }), Object.defineProperty(this, "undoStack", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "redoStack", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "worker", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "room", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "isTicking", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "undoTickerId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "viewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "scenePath", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "tickStartStorerCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "excludeIds", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Set()
    }), Object.defineProperty(this, "undoTickerEnd", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: lt((b, s, a) => {
        var i, n;
        if (b === this.undoTickerId && a === this.scenePath && s === this.viewId && this.tickStartStorerCache) {
          const Z = ((i = this.collector) == null ? void 0 : i.storage[s]) && ((n = this.collector) == null ? void 0 : n.storage[s][a]) || {}, o = this.diffFun(this.tickStartStorerCache, new Map(Object.entries(Z)));
          o.size && (this.undoStack.push({
            id: b,
            type: ql.plugin,
            data: sl(o),
            scenePath: a
          }), this.undoStack.length > wl.MaxStackLength && this.undoStack.shift(), this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length)), this.redoStack.length && (this.redoStack.length = 0, this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length)), this.isTicking = !1, this.scenePath = void 0, this.tickStartStorerCache = void 0, this.undoTickerId = void 0, this.excludeIds.clear();
        }
      }, wl.waitTime)
    }), Object.defineProperty(this, "onChangeScene", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: lt(() => {
        const b = this.control.viewContainerManager.getCurScenePath(this.viewId);
        if (b) {
          const s = this.undoStack.filter((i) => i.scenePath === b).length, a = this.redoStack.filter((i) => i.scenePath === b).length;
          this.emitter.emit("onCanUndoStepsUpdate", s), this.emitter.emit("onCanRedoStepsUpdate", a);
        }
      }, wl.waitTime)
    });
    const { control: c, internalMsgEmitter: e, viewId: d } = l;
    this.control = c, this.emitter = e, this.undoStack = [], this.redoStack = [], this.room = c.room, this.worker = c.worker, this.isTicking = !1, this.viewId = d;
  }
  get collector() {
    return this.control.collector;
  }
  addExcludeIds(l) {
    if (this.isTicking)
      for (const c of l)
        this.excludeIds.add(c);
  }
  undoTickerStart(l, c) {
    var e, d;
    if (this.undoTickerId !== l || this.scenePath !== c) {
      this.isTicking = !0, this.excludeIds.clear(), this.undoTickerId = l, this.scenePath = c;
      const b = ((e = this.collector) == null ? void 0 : e.storage[this.viewId]) && ((d = this.collector) == null ? void 0 : d.storage[this.viewId][c]) || {};
      this.tickStartStorerCache = new Map(Object.entries(sl(b)));
    }
  }
  undoTickerEndSync(l, c, e, d) {
    var b, s;
    if (l === this.undoTickerId && e === this.scenePath && c === this.viewId && this.tickStartStorerCache) {
      const a = ((b = this.collector) == null ? void 0 : b.storage[c]) && ((s = this.collector) == null ? void 0 : s.storage[c][e]) || {}, i = this.diffFun(this.tickStartStorerCache, new Map(Object.entries(a)));
      i.size && (this.undoStack.push({
        id: l,
        type: ql.plugin,
        data: sl(i),
        scenePath: e,
        tickStartStorerCache: d && sl(this.tickStartStorerCache) || void 0
      }), this.undoStack.length > wl.MaxStackLength && this.undoStack.shift(), this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length)), this.redoStack.length && (this.redoStack.length = 0, this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length)), this.isTicking = !1, this.scenePath = void 0, this.tickStartStorerCache = void 0, this.undoTickerId = void 0, this.excludeIds.clear();
    }
  }
  undo(l) {
    this.undoTickerId && this.tickStartStorerCache && this.scenePath && this.undoTickerEndSync(this.undoTickerId, this.viewId, this.scenePath, !0);
    let c = this.undoStack.length - 1;
    for (; c >= 0; ) {
      if (this.undoStack[c].scenePath === l) {
        const s = this.undoStack[c];
        s && (this.redoStack.push(s), s.type === ql.plugin && s.data && this.refreshPlugin(s)), this.undoStack.splice(c, 1);
        break;
      }
      c--;
    }
    const e = this.undoStack.filter((b) => b.scenePath === l).length, d = this.redoStack.filter((b) => b.scenePath === l).length;
    return this.emitter.emit("onCanUndoStepsUpdate", e), this.emitter.emit("onCanRedoStepsUpdate", d), e;
  }
  redo(l) {
    let c = this.redoStack.length - 1;
    for (; c >= 0; ) {
      if (this.redoStack[c].scenePath === l) {
        const s = this.redoStack[c];
        s && (!this.undoTickerId && s.tickStartStorerCache ? (this.undoTickerId = s.id, this.tickStartStorerCache = s.tickStartStorerCache, this.scenePath = s.scenePath) : this.undoStack.push(s), s.type === ql.plugin && s.data && this.refreshPlugin(s, !0)), this.redoStack.splice(c, 1);
        break;
      }
      c--;
    }
    const e = this.undoStack.filter((b) => b.scenePath === l).length, d = this.redoStack.filter((b) => b.scenePath === l).length;
    return this.emitter.emit("onCanUndoStepsUpdate", e), this.emitter.emit("onCanRedoStepsUpdate", d), d;
  }
  clear() {
    this.clearUndo(), this.clearRedo();
  }
  clearUndo() {
    this.undoStack.length = 0, this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length);
  }
  clearRedo() {
    this.redoStack.length = 0, this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length);
  }
  canUndo() {
    return !!this.undoStack.length;
  }
  canRedo() {
    return !!this.redoStack.length;
  }
  onFocusView() {
    const l = this.control.viewContainerManager.getCurScenePath(this.viewId);
    if (l) {
      const c = this.undoStack.filter((d) => d.scenePath === l).length, e = this.redoStack.filter((d) => d.scenePath === l).length;
      this.emitter.emit("onCanUndoStepsUpdate", c), this.emitter.emit("onCanRedoStepsUpdate", e);
    }
  }
  diffFun(l, c) {
    const e = /* @__PURE__ */ new Set(), d = l.keys(), b = c.keys();
    for (const s of d) {
      if (this.excludeIds.has(s))
        continue;
      const a = l.get(s), i = c.get(s);
      if (a && i) {
        if (ol(i, a))
          continue;
        e.add({
          dataType: Fl.Update,
          key: s,
          data: [a, i]
        });
        continue;
      }
      a && e.add({
        dataType: Fl.Delete,
        key: s,
        data: a
      });
    }
    for (const s of b) {
      if (this.excludeIds.has(s))
        continue;
      const a = c.get(s);
      a && !l.has(s) && e.add({
        dataType: Fl.Draw,
        key: s,
        data: a
      });
    }
    return e;
  }
  isDrawEffectiveScene(l, c) {
    const { key: e } = l;
    return !c.includes(e);
  }
  isDeleteEffectiveScene(l, c, e) {
    var s;
    const { key: d } = l;
    if (!c.includes(d))
      return !1;
    const b = c.filter((a) => {
      var i, n;
      return ((i = this.collector) == null ? void 0 : i.getLocalId(a)) === z && !((n = this.collector) != null && n.isOwn(a));
    }).map((a) => {
      var i;
      return (i = this.collector) == null ? void 0 : i.storage[this.viewId][e][a];
    });
    for (const a of b)
      if ((s = a == null ? void 0 : a.selectIds) != null && s.includes(d))
        return !1;
    return !0;
  }
  isOldEffectiveScene(l, c, e) {
    var s;
    const { key: d } = l;
    if (!c.includes(d))
      return !1;
    const b = c.filter((a) => {
      var i, n;
      return ((i = this.collector) == null ? void 0 : i.getLocalId(a)) === z && !((n = this.collector) != null && n.isOwn(a));
    }).map((a) => {
      var i;
      return (i = this.collector) == null ? void 0 : i.storage[this.viewId][e][a];
    });
    for (const a of b)
      if ((s = a == null ? void 0 : a.selectIds) != null && s.includes(d))
        return !1;
    return !0;
  }
  isNewEffectiveScene(l, c) {
    const { key: e } = l;
    return !!c.includes(e);
  }
  refreshPlugin(l, c = !1) {
    var s, a, i, n, Z, o, m, G, p, W, r, u, V, y, L, Y, N, T, I, C, K;
    let e;
    const { scenePath: d } = l, b = l.data;
    if (!(!b || !this.collector))
      for (const v of b.values()) {
        const { dataType: g, data: P, key: _ } = v, $ = this.collector.storage[this.viewId] && this.collector.storage[this.viewId][d], q = $ && Object.keys($) || [];
        switch (g) {
          case Fl.Draw:
            if (e = c ? this.isDrawEffectiveScene(v, q) : this.isDeleteEffectiveScene(v, q, d), e)
              if (c && !Array.isArray(P)) {
                if ((s = P.updateNodeOpt) != null && s.useAnimation && (P.updateNodeOpt.useAnimation = !1), ((a = this.collector) == null ? void 0 : a.getLocalId(_)) === z && ((i = this.collector) != null && i.isOwn(v.key))) {
                  const D = P.selectIds;
                  if (D) {
                    const B = q.filter((U) => {
                      var H, f;
                      return ((H = this.collector) == null ? void 0 : H.getLocalId(U)) === z && !((f = this.collector) != null && f.isOwn(U));
                    }).map((U) => {
                      var H;
                      return (H = this.collector) == null ? void 0 : H.storage[this.viewId][d][U];
                    });
                    let k = !1;
                    for (const U of B)
                      for (let H = 0; H < D.length; H++)
                        (n = U == null ? void 0 : U.selectIds) != null && n.includes(D[H]) && (delete D[H], k = !0);
                    k && (P.selectIds = D.filter((U) => !!U));
                  }
                }
                (Z = this.collector) == null || Z.updateValue(v.key, P, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              } else
                !c && !Array.isArray(v.data) && ((o = this.collector) == null || o.updateValue(v.key, void 0, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 }));
            break;
          case Fl.Delete:
            if (e = c ? this.isDeleteEffectiveScene(v, q, d) : this.isDrawEffectiveScene(v, q), e) {
              if (c && !Array.isArray(P))
                (m = this.collector) == null || m.updateValue(_, void 0, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              else if (!c && !Array.isArray(P)) {
                if ((G = P.updateNodeOpt) != null && G.useAnimation && (P.updateNodeOpt.useAnimation = !1), ((p = this.collector) == null ? void 0 : p.getLocalId(v.key)) === z && ((W = this.collector) != null && W.isOwn(v.key))) {
                  const D = P.selectIds;
                  if (D) {
                    const B = q.filter((U) => {
                      var H, f;
                      return ((H = this.collector) == null ? void 0 : H.getLocalId(U)) === z && !((f = this.collector) != null && f.isOwn(U));
                    }).map((U) => {
                      var H;
                      return (H = this.collector) == null ? void 0 : H.storage[this.viewId][d][U];
                    });
                    let k = !1;
                    for (const U of B)
                      for (let H = 0; H < D.length; H++)
                        (r = U == null ? void 0 : U.selectIds) != null && r.includes(D[H]) && (delete D[H], k = !0);
                    k && (P.selectIds = D.filter((U) => !!U));
                  }
                }
                (u = this.collector) == null || u.updateValue(v.key, v.data, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              }
            }
            break;
          case Fl.Update:
            if (e = c ? this.isNewEffectiveScene(v, q) : this.isOldEffectiveScene(v, q, d), e) {
              if (c && Array.isArray(P) && P.length === 2) {
                const D = P[1];
                if ((V = D.updateNodeOpt) != null && V.useAnimation && (D.updateNodeOpt.useAnimation = !1), ((y = this.collector) == null ? void 0 : y.getLocalId(v.key)) === z && ((L = this.collector) != null && L.isOwn(v.key))) {
                  const B = D.selectIds;
                  if (B) {
                    const k = q.filter((H) => {
                      var f, il;
                      return ((f = this.collector) == null ? void 0 : f.getLocalId(H)) === z && !((il = this.collector) != null && il.isOwn(H));
                    }).map((H) => {
                      var f;
                      return (f = this.collector) == null ? void 0 : f.storage[this.viewId][d][H];
                    });
                    let U = !1;
                    for (const H of k)
                      for (let f = 0; f < B.length; f++)
                        H != null && H.selectIds && ((Y = H.selectIds) != null && Y.includes(B[f])) && (delete B[f], U = !0);
                    U && (D.selectIds = B.filter((H) => !!H));
                  }
                }
                (N = this.collector) == null || N.updateValue(_, D, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              } else if (!c && Array.isArray(P) && P.length === 2) {
                const D = P[0];
                if ((T = D.updateNodeOpt) != null && T.useAnimation && (D.updateNodeOpt.useAnimation = !1), ((I = this.collector) == null ? void 0 : I.getLocalId(v.key)) === z && ((C = this.collector) != null && C.isOwn(v.key))) {
                  const B = D.selectIds;
                  if (B) {
                    const k = q.filter((H) => {
                      var f, il;
                      return ((f = this.collector) == null ? void 0 : f.getLocalId(H)) === z && !((il = this.collector) != null && il.isOwn(H));
                    }).map((H) => {
                      var f;
                      return (f = this.collector) == null ? void 0 : f.storage[this.viewId][d][H];
                    });
                    let U = !1;
                    for (const H of k)
                      for (let f = 0; f < B.length; f++)
                        H != null && H.selectIds && H.selectIds.includes(B[f]) && (delete B[f], U = !0);
                    U && (D.selectIds = B.filter((H) => !!H));
                  }
                }
                (K = this.collector) == null || K.updateValue(v.key, D, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              }
            }
            break;
        }
      }
  }
}
Object.defineProperty(wl, "MaxStackLength", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 20
});
Object.defineProperty(wl, "waitTime", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 100
});
function Bu(t) {
  return t instanceof TouchEvent || t instanceof window.TouchEvent || (t == null ? void 0 : t.touches) && (t == null ? void 0 : t.touches.length) || (t == null ? void 0 : t.changedTouches) && (t == null ? void 0 : t.changedTouches.length);
}
function $l(t) {
  return Bu(t) && (t.touches && t.touches.length === 1 || t.changedTouches && t.changedTouches.length === 1);
}
function Ut(t) {
  return t.touches && t.touches.length ? {
    x: t.touches[0].pageX,
    y: t.touches[0].pageY
  } : t.changedTouches && t.changedTouches.length ? {
    x: t.changedTouches[0].pageX,
    y: t.changedTouches[0].pageY
  } : {
    x: t.pageX,
    y: t.pageY
  };
}
class nc {
  constructor(l) {
    Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "mainView", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "appViews", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    });
    const { control: c, internalMsgEmitter: e } = l;
    this.control = c, this.internalMsgEmitter = e, this.internalMsgEmitter.on("undoTickerStart", this.undoTickerStart.bind(this)), this.internalMsgEmitter.on("undoTickerEnd", this.undoTickerEnd.bind(this)), this.internalMsgEmitter.on("excludeIds", this.addExcludeIds.bind(this));
  }
  undoTickerStart(l, c) {
    const e = this.getView(c);
    e && e.displayer && e.focusScenePath && e.displayer.commiter.undoTickerStart(l, e.focusScenePath);
  }
  undoTickerEnd(l, c, e) {
    const d = this.getView(c);
    if (d && d.displayer && d.focusScenePath) {
      if (e) {
        d.displayer.commiter.undoTickerEndSync(l, c, d.focusScenePath);
        return;
      }
      d.displayer.commiter.undoTickerEnd(l, c, d.focusScenePath);
    }
  }
  addExcludeIds(l, c) {
    const e = this.getView(c);
    e && e.displayer && e.focusScenePath && e.displayer.commiter.addExcludeIds(l);
  }
  undo() {
    const l = this.focuedView;
    let c = 0;
    if (l) {
      const e = l.focusScenePath;
      c = l.displayer.commiter.undo(e) || 0;
    }
    return c;
  }
  redo() {
    const l = this.focuedView;
    let c = 0;
    if (l) {
      const e = l.focusScenePath;
      c = l.displayer.commiter.redo(e) || 0;
    }
    return c;
  }
  validator(l, c, e) {
    var s;
    const d = ct(l[c]), b = ct(e);
    if (c === "focusScenePath" && e && !ol(d, b) && (this.control.internalSceneChange(l.id, b), (s = this.focuedView) == null || s.displayer.commiter.onChangeScene()), c === "cameraOpt" && !ol(d, b)) {
      if (b.width !== (d == null ? void 0 : d.width) || b.height !== (d == null ? void 0 : d.height)) {
        const a = this.getView(c);
        a == null || a.displayer.updateSize();
      }
      this.control.internalCameraChange(l.id, b);
    }
  }
  destroyAppView(l, c = !1) {
    const e = this.appViews.get(l);
    e && (this.control.textEditorManager.clear(l, c), e.displayer.destroy(), this.appViews.delete(l));
  }
  createMianView(l) {
    this.mainView = new Proxy(l, {
      set: (c, e, d) => (this.control.worker.isActive && this.validator(c, e, d), c[e] = d, !0)
    });
  }
  createAppView(l) {
    const c = l.id, e = new Proxy(l, {
      set: (d, b, s) => (this.control.worker.isActive && this.validator(d, b, s), d[b] = s, !0)
    });
    this.appViews.set(c, e);
  }
  isAppView(l) {
    return l !== xl.viewId && this.appViews.has(l);
  }
  getView(l) {
    var c;
    return l === xl.viewId ? this.mainView : (c = this.appViews) == null ? void 0 : c.get(l);
  }
  getCurScenePath(l) {
    const c = this.getView(l);
    if (c)
      return c.focusScenePath;
  }
  getAllViews() {
    return [this.mainView, ...this.appViews.values()];
  }
  setViewScenePath(l, c) {
    var e;
    if (l === xl.viewId && this.mainView)
      this.mainView.focusScenePath = c;
    else {
      const d = l && ((e = this.appViews) == null ? void 0 : e.get(l)) || void 0;
      d && (d.focusScenePath = c);
    }
  }
  setViewData(l, c) {
    var e;
    if (l === xl.viewId && this.mainView)
      this.mainView.viewData = c;
    else {
      const d = l && ((e = this.appViews) == null ? void 0 : e.get(l)) || void 0;
      d && (d.viewData = c);
    }
  }
  setFocuedViewId(l) {
    var c;
    this.focuedViewId = l, l === xl.viewId ? this.focuedView = this.mainView : this.focuedView = l && ((c = this.appViews) == null ? void 0 : c.get(l)) || void 0, this.control.cursor.onFocusViewChange(), this.focuedView && this.focuedView.displayer.commiter.onFocusView();
  }
  setViewFocusScenePath(l, c) {
    var d;
    let e;
    l === xl.viewId ? e = this.mainView : e = (d = this.appViews) == null ? void 0 : d.get(l), e && (e.focusScenePath = c);
  }
  /** 销毁 */
  destroy() {
    var l;
    this.internalMsgEmitter.removeAllListeners("undoTickerStart"), this.internalMsgEmitter.removeAllListeners("undoTickerEnd"), this.internalMsgEmitter.removeAllListeners("excludeIds"), (l = this.mainView) == null || l.displayer.destroy(), this.appViews.forEach((c) => {
      this.destroyAppView(c.id, !0);
    });
  }
  setFocuedViewCameraOpt(l) {
    this.focuedView && (this.focuedView.cameraOpt = l);
  }
  /** view中心点坐标转换成页面原始坐标 */
  transformToOriginPoint(l, c) {
    const e = this.getView(c);
    if (e != null && e.viewData) {
      const d = e.viewData.convertToPointOnScreen(l[0], l[1]);
      return [d.x, d.y];
    }
    return l;
  }
  /** 页面坐标转换成view中心点坐标 */
  transformToScenePoint(l, c) {
    const e = this.getView(c);
    if (e != null && e.viewData) {
      const d = e.viewData.convertToPointInWorld({ x: l[0], y: l[1] });
      return [d.x, d.y];
    }
    return l;
  }
  /** 绘制view */
  render(l) {
    var c, e, d, b, s, a, i, n, Z, o, m, G, p, W, r, u, V;
    for (const y of l) {
      const { rect: L, imageBitmap: Y, isClear: N, isUnClose: T, drawCanvas: I, clearCanvas: C, offset: K, viewId: v } = y, g = (c = this.getView(v)) == null ? void 0 : c.displayer;
      if (g && L) {
        const { dpr: P, canvasBgRef: _, canvasFloatRef: $, floatBarCanvasRef: q, canvasServiceFloatRef: D } = g, B = L.w * P, k = L.h * P, U = L.x * P, H = L.y * P;
        if (N)
          switch (C) {
            case Il.Selector:
              (d = (e = q.current) == null ? void 0 : e.getContext("2d")) == null || d.clearRect(0, 0, B, k);
              break;
            case Il.ServiceFloat:
              (s = (b = D.current) == null ? void 0 : b.getContext("2d")) == null || s.clearRect(U, H, B, k);
              break;
            case Il.Float:
              (i = (a = $.current) == null ? void 0 : a.getContext("2d")) == null || i.clearRect(U, H, B, k);
              break;
            case Il.Bg:
              (Z = (n = _.current) == null ? void 0 : n.getContext("2d")) == null || Z.clearRect(U, H, B, k);
              break;
          }
        if (I && Y)
          switch (I) {
            case Il.Selector: {
              const f = ((K == null ? void 0 : K.x) || 0) * P, il = ((K == null ? void 0 : K.y) || 0) * P;
              (m = (o = q.current) == null ? void 0 : o.getContext("2d")) == null || m.drawImage(Y, 0, 0, B, k, f, il, B, k);
              break;
            }
            case Il.ServiceFloat: {
              (p = (G = D.current) == null ? void 0 : G.getContext("2d")) == null || p.drawImage(Y, 0, 0, B, k, U, H, B, k);
              break;
            }
            case Il.Float: {
              (r = (W = $.current) == null ? void 0 : W.getContext("2d")) == null || r.drawImage(Y, 0, 0, B, k, U, H, B, k);
              break;
            }
            case Il.Bg: {
              (V = (u = _.current) == null ? void 0 : u.getContext("2d")) == null || V.drawImage(Y, 0, 0, B, k, U, H, B, k);
              break;
            }
          }
        if (T)
          return;
        Y == null || Y.close();
      }
    }
  }
  /** 是否绘制浮动选框 */
  showFloatBar(l, c, e) {
    const d = this.getView(l), b = d == null ? void 0 : d.displayer.vDom;
    b && b.showFloatBar(c, e);
  }
  /** 激活浮动选框 */
  activeFloatBar(l) {
    var e;
    const c = (e = this.getView(l)) == null ? void 0 : e.displayer;
    c != null && c.vDom && c.vDom.setFloatZIndex(2);
  }
  /** 销毁浮动选框 */
  unActiveFloatBar(l) {
    const c = this.getView(l), e = c == null ? void 0 : c.displayer.vDom;
    e && e.setFloatZIndex(-1);
  }
  // /** 激活刷新指针 */
  // setActiveCursor(viewId:string, cursorInfo: { x?: number; y?: number, roomMember?: RoomMember}) {
  //     const view = this.getView(viewId);
  //     const vDom = view?.displayer.vDom;
  //     if (vDom) {
  //         console.log('setActiveCursor', cursorInfo.roomMember?.memberId)
  //         this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], cursorInfo);
  //     }
  // }
  /** 激活刷新文字编辑器 */
  setActiveTextEditor(l, c) {
    const e = this.getView(l), d = e == null ? void 0 : e.displayer.vDom;
    d && d.setActiveTextEditor(c);
  }
}
Object.defineProperty(nc, "defaultCameraOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    centerX: 0,
    centerY: 0,
    scale: 1
  }
});
Object.defineProperty(nc, "defaultScreenCanvasOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    autoRender: !1,
    contextType: ac.Canvas2d
  }
});
Object.defineProperty(nc, "defaultLayerOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    offscreen: !0,
    handleEvent: !1,
    depth: !1
  }
});
class Du {
  constructor(l, c, e) {
    Object.defineProperty(this, "viewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "commiter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cachePoint", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cacheCursorPoint", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "active", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !0
    }), Object.defineProperty(this, "mousedown", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && b.button === 0 && this.viewId) {
          this.reflashContainerOffset();
          const s = this.getPoint(b);
          this.cachePoint = s, s && this.control.worker.originalEventLintener(x.Start, s, this.viewId);
        }
      }
    }), Object.defineProperty(this, "mousemove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && this.viewId) {
          const s = this.getPoint(b);
          this.cachePoint = s, s && this.control.worker.originalEventLintener(x.Doing, s, this.viewId);
        }
      }
    }), Object.defineProperty(this, "mouseup", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && b.button === 0 && this.viewId) {
          const s = this.getPoint(b) || this.cachePoint;
          s && this.control.worker.originalEventLintener(x.Done, s, this.viewId), this.cachePoint = void 0;
        }
      }
    }), Object.defineProperty(this, "touchstart", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && $l(b) && this.viewId) {
          this.reflashContainerOffset();
          const s = this.getPoint(b);
          this.cachePoint = s, s && this.control.worker.originalEventLintener(x.Start, s, this.viewId);
        }
      }
    }), Object.defineProperty(this, "touchmove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active) {
          if (!$l(b)) {
            this.control.worker.unWritable(), this.control.worker.clearLocalPointsBatchData();
            return;
          }
          if (this.viewId) {
            const s = this.getPoint(b);
            this.cachePoint = s, s && this.control.worker.originalEventLintener(x.Doing, s, this.viewId);
          }
        }
      }
    }), Object.defineProperty(this, "touchend", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active) {
          if (!$l(b) || !this.control.worker.isAbled()) {
            this.control.worker.clearLocalPointsBatchData();
            return;
          }
          if (this.viewId) {
            const s = this.getPoint(b) || this.cachePoint;
            s && this.control.worker.originalEventLintener(x.Done, s, this.viewId), this.cachePoint = void 0;
          }
        }
      }
    }), Object.defineProperty(this, "cursorMouseMove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al((b) => {
        const s = this.getPoint(b);
        this.cacheCursorPoint && ol(s, this.cacheCursorPoint) || !this.viewId || (this.cacheCursorPoint = s, s && this.control.worker.sendCursorEvent(s, this.viewId));
      }, 30, { leading: !1 })
    }), Object.defineProperty(this, "cursorMouseLeave", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al(() => {
        this.viewId && (this.cacheCursorPoint = [void 0, void 0], this.control.worker.sendCursorEvent(this.cacheCursorPoint, this.viewId));
      }, 30, { leading: !1 })
    }), Object.defineProperty(this, "keydown", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        this.control.hotkeyManager.colloctHotkey(b);
      }
    }), this.viewId = l, this.control = c, this.internalMsgEmitter = e;
    const d = {
      control: this.control,
      internalMsgEmitter: this.internalMsgEmitter,
      viewId: this.viewId
    };
    this.commiter = new wl(d);
  }
  bindToolsClass() {
    var c, e;
    const l = (e = (c = this.control.worker) == null ? void 0 : c.currentToolsData) == null ? void 0 : e.toolsType;
    switch (l) {
      case X.Text:
      case X.Pencil:
      case X.LaserPen:
      case X.Arrow:
      case X.Straight:
      case X.Rectangle:
      case X.Ellipse:
      case X.Star:
      case X.Polygon:
      case X.SpeechBalloon:
        this.eventTragetElement && (this.eventTragetElement.className = `netless-whiteboard ${l === X.Text ? "cursor-text" : l === X.Pencil || l === X.LaserPen ? "cursor-pencil" : "cursor-arrow"}`);
        break;
    }
  }
  mountView() {
    this.setCanvassStyle(), this.control.viewContainerManager.mountView(this.viewId);
  }
  reflashContainerOffset() {
    this.eventTragetElement && (this.containerOffset = this.getContainerOffset(this.eventTragetElement, { x: 0, y: 0 }));
  }
  updateSize() {
    this.setCanvassStyle(), this.reflashContainerOffset();
  }
  setViewId(l) {
    this.viewId = l;
  }
  destroy() {
    this.eventTragetElement && this.removeDisplayerEvent(this.eventTragetElement), this.vDom = void 0, this.internalMsgEmitter.removeAllListeners([F.Cursor, this.viewId]);
  }
  getPoint(l) {
    const c = Ut(l);
    if (c && yl(c.x) && yl(c.y))
      return [c.x - this.containerOffset.x, c.y - this.containerOffset.y];
  }
  setActive(l) {
    this.active = l;
  }
  async stopEventHandler() {
    this.cachePoint && (await this.control.worker.originalEventLintener(x.Done, this.cachePoint, this.viewId), this.cachePoint = void 0);
  }
  getTranslate(l) {
    const e = (l.style.WebkitTransform || getComputedStyle(l, "").getPropertyValue("-webkit-transform") || l.style.transform || getComputedStyle(l, "").getPropertyValue("transform")).match(/-?[0-9]+\.?[0-9]*/g), d = e && parseInt(e[0]) || 0, b = e && parseInt(e[1]) || 0;
    return [d, b];
  }
  getContainerOffset(l, c) {
    var b;
    const e = this.getTranslate(l);
    let d = {
      x: c.x + l.offsetLeft + e[0],
      y: c.y + l.offsetTop + e[1]
    };
    return (b = l.offsetParent) != null && b.nodeName && l.offsetParent.nodeName !== "BODY" && (d = this.getContainerOffset(l.offsetParent, d)), d;
  }
  bindDisplayerEvent(l) {
    l.addEventListener("mousedown", this.mousedown, !1), l.addEventListener("touchstart", this.touchstart, !1), window.addEventListener("mouseleave", this.mouseup, !1), window.addEventListener("mousemove", this.mousemove, !1), window.addEventListener("mouseup", this.mouseup, !1), window.addEventListener("touchmove", this.touchmove, !1), window.addEventListener("touchend", this.touchend, !1), l.addEventListener("mousemove", this.cursorMouseMove, !1), l.addEventListener("mouseleave", this.cursorMouseLeave, !1), l.addEventListener("keydown", this.keydown, !0);
  }
  removeDisplayerEvent(l) {
    l.removeEventListener("mousedown", this.mousedown), l.removeEventListener("touchstart", this.touchstart), window.removeEventListener("mouseleave", this.mouseup), window.removeEventListener("mousemove", this.mousemove), window.removeEventListener("mouseup", this.mouseup), window.removeEventListener("touchmove", this.touchmove), window.removeEventListener("touchend", this.touchend), l.removeEventListener("mousemove", this.cursorMouseMove), l.removeEventListener("mouseleave", this.cursorMouseLeave), l.removeEventListener("keydown", this.keydown);
  }
}
class xl {
  constructor(l, c) {
    Object.defineProperty(this, "viewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "mainView"
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "internalMsgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "commiter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cachePoint", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cacheCursorPoint", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "active", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !0
    }), Object.defineProperty(this, "mousedown", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (this.active && d.button === 0) {
          this.reflashContainerOffset();
          const b = this.getPoint(d);
          this.cachePoint = b, b && this.control.worker.originalEventLintener(x.Start, b, this.viewId);
        }
      }
    }), Object.defineProperty(this, "mousemove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (!this.active)
          return;
        const b = this.getPoint(d);
        this.cachePoint = b, b && this.control.worker.originalEventLintener(x.Doing, b, this.viewId);
      }
    }), Object.defineProperty(this, "mouseup", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (this.active && d.button === 0) {
          const b = this.getPoint(d) || this.cachePoint;
          b && this.control.worker.originalEventLintener(x.Done, b, this.viewId), this.cachePoint = void 0;
        }
      }
    }), Object.defineProperty(this, "touchstart", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (!this.active || !$l(d))
          return;
        this.reflashContainerOffset();
        const b = this.getPoint(d);
        this.cachePoint = b, b && this.control.worker.originalEventLintener(x.Start, b, this.viewId);
      }
    }), Object.defineProperty(this, "touchmove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (!this.active)
          return;
        if (!$l(d)) {
          this.control.worker.clearLocalPointsBatchData(), this.control.worker.unWritable();
          return;
        }
        const b = this.getPoint(d);
        this.cachePoint = b, b && this.control.worker.originalEventLintener(x.Doing, b, this.viewId);
      }
    }), Object.defineProperty(this, "touchend", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (!this.active)
          return;
        if (!$l(d) || !this.control.worker.isAbled()) {
          this.control.worker.clearLocalPointsBatchData();
          return;
        }
        const b = this.getPoint(d) || this.cachePoint;
        b && this.control.worker.originalEventLintener(x.Done, b, this.viewId), this.cachePoint = void 0;
      }
    }), Object.defineProperty(this, "cursorMouseMove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al((d) => {
        const b = this.getPoint(d);
        this.cacheCursorPoint && ol(b, this.cacheCursorPoint) || (this.cacheCursorPoint = b, b && this.control.worker.sendCursorEvent(b, this.viewId));
      }, 30, { leading: !1 })
    }), Object.defineProperty(this, "cursorMouseLeave", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al(() => {
        this.cacheCursorPoint = [void 0, void 0], this.control.worker.sendCursorEvent(this.cacheCursorPoint, this.viewId);
      }, 30, { leading: !1 })
    }), Object.defineProperty(this, "keydown", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        this.control.hotkeyManager.colloctHotkey(d);
      }
    }), this.control = l, this.internalMsgEmitter = c;
    const e = {
      control: this.control,
      internalMsgEmitter: this.internalMsgEmitter,
      viewId: this.viewId
    };
    this.commiter = new wl(e);
  }
  bindToolsClass() {
    var c, e;
    const l = (e = (c = this.control.worker) == null ? void 0 : c.currentToolsData) == null ? void 0 : e.toolsType;
    switch (l) {
      case X.Text:
      case X.Pencil:
      case X.LaserPen:
      case X.Arrow:
      case X.Straight:
      case X.Rectangle:
      case X.Ellipse:
      case X.Star:
      case X.Polygon:
      case X.SpeechBalloon:
        this.eventTragetElement && (this.eventTragetElement.className = `netless-whiteboard ${l === X.Text ? "cursor-text" : l === X.Pencil || l === X.LaserPen ? "cursor-pencil" : "cursor-arrow"}`);
        break;
    }
  }
  mountView() {
    this.setCanvassStyle(), this.control.viewContainerManager.mountView(this.viewId);
  }
  updateSize() {
    this.setCanvassStyle();
  }
  reflashContainerOffset() {
    this.eventTragetElement && (this.containerOffset = this.getContainerOffset(this.eventTragetElement, { x: 0, y: 0 }));
  }
  destroy() {
    this.eventTragetElement && this.removeDisplayerEvent(this.eventTragetElement), this.vDom = void 0, this.internalMsgEmitter.removeAllListeners([F.Cursor, this.viewId]);
  }
  getPoint(l) {
    const c = Ut(l);
    if (c && yl(c.x) && yl(c.y))
      return [c.x - this.containerOffset.x, c.y - this.containerOffset.y];
  }
  setActive(l) {
    this.active = l;
  }
  async stopEventHandler() {
    this.cachePoint && (await this.control.worker.originalEventLintener(x.Done, this.cachePoint, this.viewId), this.cachePoint = void 0);
  }
  getTranslate(l) {
    const e = (l.style.WebkitTransform || getComputedStyle(l, "").getPropertyValue("-webkit-transform") || l.style.transform || getComputedStyle(l, "").getPropertyValue("transform")).match(/-?[0-9]+\.?[0-9]*/g), d = e && parseInt(e[0]) || 0, b = e && parseInt(e[1]) || 0;
    return [d, b];
  }
  getContainerOffset(l, c) {
    var b;
    const e = this.getTranslate(l);
    let d = {
      x: c.x + l.offsetLeft + e[0],
      y: c.y + l.offsetTop + e[1]
    };
    return (b = l.offsetParent) != null && b.nodeName && l.offsetParent.nodeName !== "BODY" && (d = this.getContainerOffset(l.offsetParent, d)), d;
  }
  bindDisplayerEvent(l) {
    l.addEventListener("mousedown", this.mousedown, !1), l.addEventListener("touchstart", this.touchstart, !1), window.addEventListener("mouseleave", this.mouseup, !1), window.addEventListener("mousemove", this.mousemove, !1), window.addEventListener("mouseup", this.mouseup, !1), window.addEventListener("touchmove", this.touchmove, !1), window.addEventListener("touchend", this.touchend, !1), l.addEventListener("mousemove", this.cursorMouseMove, !1), l.addEventListener("mouseleave", this.cursorMouseLeave, !1), l.addEventListener("keydown", this.keydown, !0);
  }
  removeDisplayerEvent(l) {
    l.removeEventListener("mousedown", this.mousedown), l.removeEventListener("touchstart", this.touchstart), window.removeEventListener("mouseleave", this.mouseup), window.removeEventListener("mousemove", this.mousemove), window.removeEventListener("mouseup", this.mouseup), window.removeEventListener("touchmove", this.touchmove), window.removeEventListener("touchend", this.touchend), l.removeEventListener("mousemove", this.cursorMouseMove), l.removeEventListener("mouseleave", this.cursorMouseLeave), l.removeEventListener("keydown", this.keydown);
  }
}
Object.defineProperty(xl, "viewId", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "mainView"
});
const Eu = "index-module__Container__nLsM3", Au = "index-module__CanvasBox__j2Xe-", qu = "index-module__FloatCanvas__d1YR7", $u = "index-module__FloatBar__cm-EL", _u = "index-module__RotateBtn__HSSkf", l0 = "index-module__ResizeBtn__yjvda", c0 = "index-module__CursorBox__2UHvI", e0 = "index-module__TextEditorContainer__Qm8KC", t0 = "index-module__ResizeTowBox__HOllX", d0 = "index-module__FloatBarBtn__FJrOG", Ml = {
  Container: Eu,
  CanvasBox: Au,
  FloatCanvas: qu,
  FloatBar: $u,
  RotateBtn: _u,
  ResizeBtn: l0,
  CursorBox: c0,
  TextEditorContainer: e0,
  ResizeTowBox: t0,
  FloatBarBtn: d0
}, b0 = {
  delete: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDZ2NmEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMlY2aDBtMS0yYTIgMiAwIDAgMSAyLTJoMmEyIDIgMCAwIDEgMiAyaDBNMyA0aDEwIiBzdHJva2U9IiM0NDRFNjAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
  duplicate: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjNDQ0RTYwIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMSAySDZhMSAxIDAgMCAwLTEgMXY4YTEgMSAwIDAgMCAxIDFoNmExIDEgMCAwIDAgMS0xVjRoMGwtMi0yeiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTExIDJ2MWExIDEgMCAwIDAgMSAxaDFsLTItMnoiLz48cGF0aCBkPSJNOSAxNEg0YTEgMSAwIDAgMS0xLTFWNWgwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9zdmc+",
  "layer-pressed": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTE2IDEwLTYgNCA2IDQgNi00em0tNiA4IDYgNCA2LTQiIHN0cm9rZT0iIzMzODFGRiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+",
  layer: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTE2IDEwLTYgNCA2IDQgNi00em0tNiA4IDYgNCA2LTQiIHN0cm9rZT0iIzQ0NEU2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+",
  rotate: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjNDQ0RTYwIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEzIDZhNiA2IDAgMSAxLTMuNzA5IDEuMjgzIi8+PHBhdGggZD0ibTEzIDYgMS40MTQgMi40NUwxMyA2bDIuNDUtMS40MTQiLz48L2c+PC9zdmc+",
  "rotation-button": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBvcGFjaXR5PSIuMDEiIGQ9Ik0wIDI0VjBoMjR2MjR6Ii8+PHBhdGggZD0iTTUuNzI0IDUuNzI0QTguODQ3IDguODQ3IDAgMCAxIDEyIDMuMTI1YzIuMjcxIDAgNC41NDMuODY2IDYuMjc2IDIuNmE4Ljg0NiA4Ljg0NiAwIDAgMSAyLjU5OCA2LjE0IDguODQ5IDguODQ5IDAgMCAxLTIuNTU5IDYuMzdsLTEuNS0uOTgzQTcuMTA1IDcuMTA1IDAgMCAwIDE5LjEyNSAxMmE3LjEwMyA3LjEwMyAwIDAgMC0yLjA4Ny01LjAzOEE3LjEwMyA3LjEwMyAwIDAgMCAxMiA0Ljg3NWE3LjEwMyA3LjEwMyAwIDAgMC01LjAzOCAyLjA4NyA3LjEwMSA3LjEwMSAwIDAgMC0yLjA4NiA0LjkyIDcuMTAzIDcuMTAzIDAgMCAwIDEuNzY2IDQuODE1bDEuOTQ1LTEuNTg0IDIuMzk0IDcuMTgyLTcuMjIyLTIuNDA4IDEuNzkxLTEuNzlBOC44NDYgOC44NDYgMCAwIDEgMy4xMjUgMTJjMC0yLjI3MS44NjYtNC41NDMgMi42LTYuMjc2eiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9Ii41IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+",
  rotation: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkZGIiBvcGFjaXR5PSIuMDEiIGQ9Ik0wIDI0VjBoMjR2MjR6Ii8+PHBhdGggZD0iTTUuNzI0IDUuNzI0QTguODQ3IDguODQ3IDAgMCAxIDEyIDMuMTI1YzIuMjcxIDAgNC41NDMuODY2IDYuMjc2IDIuNmE4Ljg0NiA4Ljg0NiAwIDAgMSAyLjU5OCA2LjE0IDguODQ5IDguODQ5IDAgMCAxLTIuNTU5IDYuMzdsLTEuNS0uOTgzQTcuMTA1IDcuMTA1IDAgMCAwIDE5LjEyNSAxMmE3LjEwMyA3LjEwMyAwIDAgMC0yLjA4Ny01LjAzOEE3LjEwMyA3LjEwMyAwIDAgMCAxMiA0Ljg3NWE3LjEwMyA3LjEwMyAwIDAgMC01LjAzOCAyLjA4NyA3LjEwMSA3LjEwMSAwIDAgMC0yLjA4NiA0LjkyIDcuMTAzIDcuMTAzIDAgMCAwIDEuNzY2IDQuODE1bDEuOTQ1LTEuNTg0IDIuMzk0IDcuMTgyLTcuMjIyLTIuNDA4IDEuNzkxLTEuNzlBOC44NDYgOC44NDYgMCAwIDEgMy4xMjUgMTJjMC0yLjI3MS44NjYtNC41NDMgMi42LTYuMjc2eiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9Ii41IiBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+",
  "font-colors-active": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQgMTEgNC05IDQgOU02IDdoNCIgc3Ryb2tlPSIjMzM4MUZGIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=",
  "font-colors": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQgMTEgNC05IDQgOU02IDdoNCIgc3Ryb2tlPSIjNDQ0RTYwIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=",
  "to-bottom": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDEwdjhtMCAwLTItMm0yIDIgMi0ybS00IDZoMTJtLTYtNGg2bS02LTRoNm0tNi00aDYiIHN0cm9rZT0iIzQ0NEU2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+",
  "to-top": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDIydi04bTAgMC0yIDJtMi0yIDIgMm0tNC02aDEybS02IDRoNm0tNiA0aDZtLTYgNGg2IiBzdHJva2U9IiM0NDRFNjAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
  "bold-active": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuNSAySDhhMi41IDIuNSAwIDAgMSAwIDVINS41aDBtLTEgMGg0YTMgMyAwIDAgMSAwIDZoLTQgMG0wIDFWMiIgc3Ryb2tlPSIjMzM4MUZGIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=",
  bold: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuNSAySDhhMi41IDIuNSAwIDAgMSAwIDVINS41aDBtLTEgMGg0YTMgMyAwIDAgMSAwIDZoLTQgMG0wIDFWMiIgc3Ryb2tlPSIjNDQ0RTYwIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=",
  "underline-active": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJ2NWE0IDQgMCAxIDEtOCAwVjJoME0zIDE0aDEwIiBzdHJva2U9IiMzMzgxRkYiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
  underline: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJ2NWE0IDQgMCAxIDEtOCAwVjJoME0zIDE0aDEwIiBzdHJva2U9IiM0NDRFNjAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
  "line-through-active": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgOGg4bS0xLTNhMyAzIDAgMCAwLTMtM2gtLjkzOEEyLjY0IDIuNjQgMCAwIDAgNC41IDRhMi41NyAyLjU3IDAgMCAwIDEuMzQ0IDIuOTIybDQuMzEyIDIuMTU2QTIuNTcgMi41NyAwIDAgMSAxMS41IDEyYTIuNjQgMi42NCAwIDAgMS0yLjU2MiAySDdhMyAzIDAgMCAxLTMtM2gwIiBzdHJva2U9IiMzMzgxRkYiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
  "line-through": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgOGg4bS0xLTNhMyAzIDAgMCAwLTMtM2gtLjkzOEEyLjY0IDIuNjQgMCAwIDAgNC41IDRhMi41NyAyLjU3IDAgMCAwIDEuMzQ0IDIuOTIybDQuMzEyIDIuMTU2QTIuNTcgMi41NyAwIDAgMSAxMS41IDEyYTIuNjQgMi42NCAwIDAgMS0yLjU2MiAySDdhMyAzIDAgMCAxLTMtM2gwIiBzdHJva2U9IiM0NDRFNjAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
  "italic-active": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcgMTQgOSAyTTUgMTRoNE03IDJoNCIgc3Ryb2tlPSIjMzM4MUZGIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=",
  italic: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcgMTQgOSAyTTUgMTRoNE03IDJoNCIgc3Ryb2tlPSIjNDQ0RTYwIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=",
  "unlock-new": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGw9IiMzMzgxRkYiIGN4PSIxNiIgY3k9IjE3IiByPSIxIi8+PHJlY3Qgc3Ryb2tlPSIjMzM4MUZGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHg9IjExIiB5PSIxNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjgiIHJ4PSIyIi8+PHBhdGggZD0iTTEzIDE0di0xYTMgMyAwIDAgMSA2IDB2MWgwbS0zIDN2MyIgc3Ryb2tlPSIjMzM4MUZGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L2c+PC9zdmc+",
  "lock-new": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGw9IiM0NDRFNjAiIGN4PSIxNiIgY3k9IjE3IiByPSIxIi8+PHJlY3Qgc3Ryb2tlPSIjNDQ0RTYwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHg9IjExIiB5PSIxNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjgiIHJ4PSIyIi8+PHBhdGggZD0iTTEzIDE0di0zYTMgMyAwIDAgMSA2IDB2MWgwbS0zIDV2MyIgc3Ryb2tlPSIjNDQ0RTYwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L2c+PC9zdmc+",
  shapes: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTY4Mi42NjY2NjcgMTAyNEM2ODIuNjY2NjY3IDEwMjQgNjgyLjY2NjY2NyAxMDI0IDY4Mi42NjY2NjcgMTAyNEwxNzAuNjY2NjY3IDEwMjRjLTE3LjA2NjY2NyAwLTI5Ljg2NjY2Ny04LjUzMzMzMy0zOC40LTIxLjMzMzMzMy04LjUzMzMzMy0xMi44LTguNTMzMzMzLTI5Ljg2NjY2NyAwLTQyLjY2NjY2N2wyNTYtMzg0YzE3LjA2NjY2Ny0yNS42IDU1LjQ2NjY2Ny0yNS42IDcyLjUzMzMzMyAwbDI1MS43MzMzMzMgMzc5LjczMzMzM2M4LjUzMzMzMyA4LjUzMzMzMyAxMi44IDE3LjA2NjY2NyAxMi44IDI5Ljg2NjY2N0M3MjUuMzMzMzMzIDEwMDYuOTMzMzMzIDcwOC4yNjY2NjcgMTAyNCA2ODIuNjY2NjY3IDEwMjR6TTI1MS43MzMzMzMgOTM4LjY2NjY2N2wzNTQuMTMzMzMzIDBMNDI2LjY2NjY2NyA2NzQuMTMzMzMzIDI1MS43MzMzMzMgOTM4LjY2NjY2N3oiIGZpbGw9IiM0NDRFNjAiPjwvcGF0aD48cGF0aCBkPSJNOTgxLjMzMzMzMyA3MjUuMzMzMzMzbC0zNDEuMzMzMzMzIDBjLTI1LjYgMC00Mi42NjY2NjctMTcuMDY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjdMNTk3LjMzMzMzMyAzNDEuMzMzMzMzYzAtMjUuNiAxNy4wNjY2NjctNDIuNjY2NjY3IDQyLjY2NjY2Ny00Mi42NjY2NjdsMzQxLjMzMzMzMyAwYzI1LjYgMCA0Mi42NjY2NjcgMTcuMDY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjdsMCAzNDEuMzMzMzMzQzEwMjQgNzA4LjI2NjY2NyAxMDA2LjkzMzMzMyA3MjUuMzMzMzMzIDk4MS4zMzMzMzMgNzI1LjMzMzMzM3pNNjgyLjY2NjY2NyA2NDBsMjU2IDBMOTM4LjY2NjY2NyAzODRsLTI1NiAwTDY4Mi42NjY2NjcgNjQweiIgZmlsbD0iIzQ0NEU2MCI+PC9wYXRoPjxwYXRoIGQ9Ik0yNzcuMzMzMzMzIDU1NC42NjY2NjdDMTIzLjczMzMzMyA1NTQuNjY2NjY3IDAgNDMwLjkzMzMzMyAwIDI3Ny4zMzMzMzNTMTIzLjczMzMzMyAwIDI3Ny4zMzMzMzMgMCA1NTQuNjY2NjY3IDEyMy43MzMzMzMgNTU0LjY2NjY2NyAyNzcuMzMzMzMzIDQzMC45MzMzMzMgNTU0LjY2NjY2NyAyNzcuMzMzMzMzIDU1NC42NjY2Njd6TTI3Ny4zMzMzMzMgODUuMzMzMzMzQzE3MC42NjY2NjcgODUuMzMzMzMzIDg1LjMzMzMzMyAxNzAuNjY2NjY3IDg1LjMzMzMzMyAyNzcuMzMzMzMzUzE3MC42NjY2NjcgNDY5LjMzMzMzMyAyNzcuMzMzMzMzIDQ2OS4zMzMzMzMgNDY5LjMzMzMzMyAzODQgNDY5LjMzMzMzMyAyNzcuMzMzMzMzIDM4NCA4NS4zMzMzMzMgMjc3LjMzMzMzMyA4NS4zMzMzMzN6IiBmaWxsPSIjNDQ0RTYwIj48L3BhdGg+PC9zdmc+",
  "shapes-active": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTY4Mi42NjY2NjcgMTAyNEM2ODIuNjY2NjY3IDEwMjQgNjgyLjY2NjY2NyAxMDI0IDY4Mi42NjY2NjcgMTAyNEwxNzAuNjY2NjY3IDEwMjRjLTE3LjA2NjY2NyAwLTI5Ljg2NjY2Ny04LjUzMzMzMy0zOC40LTIxLjMzMzMzMy04LjUzMzMzMy0xMi44LTguNTMzMzMzLTI5Ljg2NjY2NyAwLTQyLjY2NjY2N2wyNTYtMzg0YzE3LjA2NjY2Ny0yNS42IDU1LjQ2NjY2Ny0yNS42IDcyLjUzMzMzMyAwbDI1MS43MzMzMzMgMzc5LjczMzMzM2M4LjUzMzMzMyA4LjUzMzMzMyAxMi44IDE3LjA2NjY2NyAxMi44IDI5Ljg2NjY2N0M3MjUuMzMzMzMzIDEwMDYuOTMzMzMzIDcwOC4yNjY2NjcgMTAyNCA2ODIuNjY2NjY3IDEwMjR6TTI1MS43MzMzMzMgOTM4LjY2NjY2N2wzNTQuMTMzMzMzIDBMNDI2LjY2NjY2NyA2NzQuMTMzMzMzIDI1MS43MzMzMzMgOTM4LjY2NjY2N3oiIGZpbGw9IiMzMzgxRkYiPjwvcGF0aD48cGF0aCBkPSJNOTgxLjMzMzMzMyA3MjUuMzMzMzMzbC0zNDEuMzMzMzMzIDBjLTI1LjYgMC00Mi42NjY2NjctMTcuMDY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjdMNTk3LjMzMzMzMyAzNDEuMzMzMzMzYzAtMjUuNiAxNy4wNjY2NjctNDIuNjY2NjY3IDQyLjY2NjY2Ny00Mi42NjY2NjdsMzQxLjMzMzMzMyAwYzI1LjYgMCA0Mi42NjY2NjcgMTcuMDY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjdsMCAzNDEuMzMzMzMzQzEwMjQgNzA4LjI2NjY2NyAxMDA2LjkzMzMzMyA3MjUuMzMzMzMzIDk4MS4zMzMzMzMgNzI1LjMzMzMzM3pNNjgyLjY2NjY2NyA2NDBsMjU2IDBMOTM4LjY2NjY2NyAzODRsLTI1NiAwTDY4Mi42NjY2NjcgNjQweiIgZmlsbD0iIzMzODFGRiI+PC9wYXRoPjxwYXRoIGQ9Ik0yNzcuMzMzMzMzIDU1NC42NjY2NjdDMTIzLjczMzMzMyA1NTQuNjY2NjY3IDAgNDMwLjkzMzMzMyAwIDI3Ny4zMzMzMzNTMTIzLjczMzMzMyAwIDI3Ny4zMzMzMzMgMCA1NTQuNjY2NjY3IDEyMy43MzMzMzMgNTU0LjY2NjY2NyAyNzcuMzMzMzMzIDQzMC45MzMzMzMgNTU0LjY2NjY2NyAyNzcuMzMzMzMzIDU1NC42NjY2Njd6TTI3Ny4zMzMzMzMgODUuMzMzMzMzQzE3MC42NjY2NjcgODUuMzMzMzMzIDg1LjMzMzMzMyAxNzAuNjY2NjY3IDg1LjMzMzMzMyAyNzcuMzMzMzMzUzE3MC42NjY2NjcgNDY5LjMzMzMzMyAyNzcuMzMzMzMzIDQ2OS4zMzMzMzMgNDY5LjMzMzMzMyAzODQgNDY5LjMzMzMzMyAyNzcuMzMzMzMzIDM4NCA4NS4zMzMzMzMgMjc3LjMzMzMzMyA4NS4zMzMzMzN6IiBmaWxsPSIjMzM4MUZGIj48L3BhdGg+PC9zdmc+",
  "font-style-active": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTM2MC4yMzQ2NjcgMjEzLjMzMzMzM0w1NTQuNjY2NjY3IDc3Ni4yNzczMzNoLTc2LjU0NGwtNTQuNjEzMzM0LTE3Mi4wMzJIMjE0LjE4NjY2N2wtNTUuNDY2NjY3IDE3Mi4wMzJIODUuMzMzMzMzTDI3OS43NjUzMzMgMjEzLjMzMzMzM2g4MC40NjkzMzR6IG00MTAuMDI2NjY2IDE3My44MjRjOTAuMTEyIDAgMTI4LjM0MTMzMyA2MC43NTczMzMgMTI4LjM0MTMzNCAxNTIuMjM0NjY3djIyOC4wMTA2NjdoLTUxLjJsLTUuNDYxMzM0LTQ0LjM3MzMzNGgtMi4wNDhjLTM1LjQ5ODY2NyAyOS4zNTQ2NjctNzcuMTQxMzMzIDUzLjI0OC0xMjIuODggNTMuMjQ4LTYyLjEyMjY2NyAwLTEwOC41NDQtMzguMjI5MzMzLTEwOC41NDQtMTA1LjEzMDY2NiAwLTgwLjU1NDY2NyA3MC4zMTQ2NjctMTIwLjgzMiAyMjguMDEwNjY3LTEzOC41ODEzMzQgMC00Ny43ODY2NjctMTUuNzAxMzMzLTkzLjUyNTMzMy03Ni40NTg2NjctOTMuNTI1MzMzLTQzLjAwOCAwLTgxLjkyIDE5Ljc5NzMzMy0xMTEuMjc0NjY2IDM5LjU5NDY2N2wtMjQuNTc2LTQzLjAwOGMzNC4xMzMzMzMtMjEuODQ1MzMzIDg2LjY5ODY2Ny00OC40NjkzMzMgMTQ2LjA5MDY2Ni00OC40NjkzMzR6IG02Ni4yMTg2NjcgMTg2LjM2OGMtMTI0LjkyOCAxNS4wMTg2NjctMTY3LjI1MzMzMyA0NS43Mzg2NjctMTY3LjI1MzMzMyA5My41MjUzMzQgMCA0Mi4zMjUzMzMgMjguNjcyIDU5LjM5MiA2NS41MzYgNTkuMzkyIDM2LjE4MTMzMyAwIDY1LjUzNi0xNy4wNjY2NjcgMTAxLjcxNzMzMy00OS4xNTJ6TTMyMC4zODQgMjcwLjkzMzMzM2gtMy4xMTQ2NjdjLTE3Ljk2MjY2NyA2Ni4wNDgtMzYuNjkzMzMzIDEyNi43Mi01Ny4wMDI2NjYgMTkwLjQ2NGwtMjguMTYgODYuMDE2aDE3My4zOTczMzNsLTI3LjMwNjY2Ny04Ni4wMTZBNDkxMy40OTMzMzMgNDkxMy40OTMzMzMgMCAwIDEgMzIwLjM4NCAyNzAuOTMzMzMzeiIgZmlsbD0iIzMzODFGRiI+PC9wYXRoPjwvc3ZnPg==",
  "font-style": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTM2MC4yMzQ2NjcgMjEzLjMzMzMzM0w1NTQuNjY2NjY3IDc3Ni4yNzczMzNoLTc2LjU0NGwtNTQuNjEzMzM0LTE3Mi4wMzJIMjE0LjE4NjY2N2wtNTUuNDY2NjY3IDE3Mi4wMzJIODUuMzMzMzMzTDI3OS43NjUzMzMgMjEzLjMzMzMzM2g4MC40NjkzMzR6IG00MTAuMDI2NjY2IDE3My44MjRjOTAuMTEyIDAgMTI4LjM0MTMzMyA2MC43NTczMzMgMTI4LjM0MTMzNCAxNTIuMjM0NjY3djIyOC4wMTA2NjdoLTUxLjJsLTUuNDYxMzM0LTQ0LjM3MzMzNGgtMi4wNDhjLTM1LjQ5ODY2NyAyOS4zNTQ2NjctNzcuMTQxMzMzIDUzLjI0OC0xMjIuODggNTMuMjQ4LTYyLjEyMjY2NyAwLTEwOC41NDQtMzguMjI5MzMzLTEwOC41NDQtMTA1LjEzMDY2NiAwLTgwLjU1NDY2NyA3MC4zMTQ2NjctMTIwLjgzMiAyMjguMDEwNjY3LTEzOC41ODEzMzQgMC00Ny43ODY2NjctMTUuNzAxMzMzLTkzLjUyNTMzMy03Ni40NTg2NjctOTMuNTI1MzMzLTQzLjAwOCAwLTgxLjkyIDE5Ljc5NzMzMy0xMTEuMjc0NjY2IDM5LjU5NDY2N2wtMjQuNTc2LTQzLjAwOGMzNC4xMzMzMzMtMjEuODQ1MzMzIDg2LjY5ODY2Ny00OC40NjkzMzMgMTQ2LjA5MDY2Ni00OC40NjkzMzR6IG02Ni4yMTg2NjcgMTg2LjM2OGMtMTI0LjkyOCAxNS4wMTg2NjctMTY3LjI1MzMzMyA0NS43Mzg2NjctMTY3LjI1MzMzMyA5My41MjUzMzQgMCA0Mi4zMjUzMzMgMjguNjcyIDU5LjM5MiA2NS41MzYgNTkuMzkyIDM2LjE4MTMzMyAwIDY1LjUzNi0xNy4wNjY2NjcgMTAxLjcxNzMzMy00OS4xNTJ6TTMyMC4zODQgMjcwLjkzMzMzM2gtMy4xMTQ2NjdjLTE3Ljk2MjY2NyA2Ni4wNDgtMzYuNjkzMzMzIDEyNi43Mi01Ny4wMDI2NjYgMTkwLjQ2NGwtMjguMTYgODYuMDE2aDE3My4zOTczMzNsLTI3LjMwNjY2Ny04Ni4wMTZBNDkxMy40OTMzMzMgNDkxMy40OTMzMzMgMCAwIDEgMzIwLjM4NCAyNzAuOTMzMzMzeiIgZmlsbD0iIzQ0NEU2MCI+PC9wYXRoPjwvc3ZnPg==",
  polygon: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTkzMy4xMiA0OTAuNjY2NjY3bC0xOTItMzMyLjM3MzMzNGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwLTM3LjEyLTIxLjMzMzMzM2gtMzg0YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAtMzcuMTIgMjEuMzMzMzMzbC0xOTIgMzMyLjM3MzMzNGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDAgNDIuNjY2NjY2bDE5MiAzMzIuMzczMzM0YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAgMzcuMTIgMjEuMzMzMzMzaDM4NGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDM3LjEyLTIxLjMzMzMzM2wxOTItMzMyLjM3MzMzNGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDAtNDIuNjY2NjY2eiBtLTI1NiAzMTEuMDRIMzQ0Ljc0NjY2N0wxNzcuMDY2NjY3IDUxMmwxNjcuNjgtMjg5LjcwNjY2N2gzMzQuNTA2NjY2TDg0Ni45MzMzMzMgNTEyeiIgZmlsbD0iIzQ0NEU2MCI+PC9wYXRoPjwvc3ZnPg==",
  "polygon-active": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTkzMy4xMiA0OTAuNjY2NjY3bC0xOTItMzMyLjM3MzMzNGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwLTM3LjEyLTIxLjMzMzMzM2gtMzg0YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAtMzcuMTIgMjEuMzMzMzMzbC0xOTIgMzMyLjM3MzMzNGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDAgNDIuNjY2NjY2bDE5MiAzMzIuMzczMzM0YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAgMzcuMTIgMjEuMzMzMzMzaDM4NGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDM3LjEyLTIxLjMzMzMzM2wxOTItMzMyLjM3MzMzNGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDAtNDIuNjY2NjY2eiBtLTI1NiAzMTEuMDRIMzQ0Ljc0NjY2N0wxNzcuMDY2NjY3IDUxMmwxNjcuNjgtMjg5LjcwNjY2N2gzMzQuNTA2NjY2TDg0Ni45MzMzMzMgNTEyeiIgZmlsbD0iIzMzODFGRiI+PC9wYXRoPjwvc3ZnPg==",
  "polygon-vertex": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTA3NyAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTU0My40NzQ1MjYgNDIuMzA3MzY4YTExOS4zNzY4NDIgMTE5LjM3Njg0MiAwIDAgMSAxMTAuODA3NTc5IDE2My44NGwxOTAuNTcxNzkgMTM4LjYxNzI2NGExMTkuMzc2ODQyIDExOS4zNzY4NDIgMCAxIDEgODMuMzc1MTU4IDIxOC43MDQ4NDJsLTc0LjMyMDg0MiAyMjguODM3MDUyYTExOS4zMjI5NDcgMTE5LjMyMjk0NyAwIDAgMS02MS4yNzgzMTYgMjIxLjg4NDYzMmMtNDYuNzgwNjMyIDAtODcuMzA5NDc0LTI2Ljk0NzM2OC0xMDYuODczMjYzLTY2LjEyODg0MmgtMjg5LjQxNDczN2ExMTkuMzc2ODQyIDExOS4zNzY4NDIgMCAxIDEtMTc5LjczODk0OC0xNDcuODMzMjYzbC03Mi4yNzI4NDItMjIyLjY5MzA1My0zLjM5NTM2OCAwLjEwNzc4OUExMTkuMzc2ODQyIDExOS4zNzY4NDIgMCAwIDEgMjEuODI3MzY4IDQ2Ni43Mjg0MjFMMjEuNTU3ODk1IDQ1OC4yMTMwNTNhMTE5LjM3Njg0MiAxMTkuMzc2ODQyIDAgMCAxIDE4My44MzQ5NDctMTAwLjUxMzY4NWwyMjMuNTAxNDc0LTE2Mi4zODQ4NDJhMTE5LjQzMDczNyAxMTkuNDMwNzM3IDAgMCAxIDExNC41ODAyMS0xNTMuMDYxMDUyek0yODkuNDE0NzM3IDg0MC4wNTcyNjNhNTQuNzAzMTU4IDU0LjcwMzE1OCAwIDEgMCAwIDEwOS40MDYzMTYgNTQuNzAzMTU4IDU0LjcwMzE1OCAwIDAgMCAwLTEwOS40MDYzMTZ6IG01MDMuMTYxMjYzIDBhNTQuNzAzMTU4IDU0LjcwMzE1OCAwIDEgMCAwIDEwOS40MDYzMTYgNTQuNzAzMTU4IDU0LjcwMzE1OCAwIDAgMCAwLTEwOS40MDYzMTZ6TTQ2Mi42ODYzMTYgMjQ5LjU4NjUyNkwyNDguMTMxMzY4IDQwNS41NTc4OTVhMTE5LjMyMjk0NyAxMTkuMzIyOTQ3IDAgMCAxLTQyLjg0NjMxNSAxNTMuMjIyNzM3bDcwLjcwOTg5NCAyMTcuMzU3NDczYTExOS40MzA3MzcgMTE5LjQzMDczNyAwIDAgMSAxMzIuNDE5MzY5IDEwOC4yMjA2MzJINjczLjY4NDIxMWExMTkuNDMwNzM3IDExOS40MzA3MzcgMCAwIDEgMTE5LjE2MTI2My0xMDguOTc1MTU4bDcxLjE0MTA1Mi0yMTguOTc0MzE2YTExOS40MzA3MzcgMTE5LjQzMDczNyAwIDAgMS02Mi4wODY3MzctMTY0LjIxNzI2M2wtMTg2LjM2OC0xMzUuMjc1Nzg5Yy0xOS45OTQ5NDcgMTUuMDkwNTI2LTQ1LjAwMjEwNSAyNC4xNDQ4NDItNzIuMDU3MjYzIDI0LjE0NDg0MmExMTguOTQ1Njg0IDExOC45NDU2ODQgMCAwIDEtODAuNzg4MjEtMzEuNDc0NTI3eiBtLTMyMS43NTE1NzkgMTUzLjkyMzM2OWE1NC43MDMxNTggNTQuNzAzMTU4IDAgMSAwIDAgMTA5LjQwNjMxNiA1NC43MDMxNTggNTQuNzAzMTU4IDAgMCAwIDAtMTA5LjQwNjMxNnogbTc2Ny43MzA1MjYtMTIuNTU3NDc0YTU0LjcwMzE1OCA1NC43MDMxNTggMCAxIDAgMCAxMDkuNDA2MzE2IDU0LjcwMzE1OCA1NC43MDMxNTggMCAwIDAgMC0xMDkuNDA2MzE2eiBtLTM2NS4xOTA3MzctMjg0LjAyNTI2M2E1NC43MDMxNTggNTQuNzAzMTU4IDAgMSAwIDAgMTA5LjQ2MDIxIDU0LjcwMzE1OCA1NC43MDMxNTggMCAwIDAgMC0xMDkuNDA2MzE1eiIgZmlsbD0iIzQ0NEU2MCI+PC9wYXRoPjwvc3ZnPg==",
  star: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTkwOC4xIDM1My4xbC0yNTMuOS0zNi45TDU0MC43IDg2LjFjLTMuMS02LjMtOC4yLTExLjQtMTQuNS0xNC41LTE1LjgtNy44LTM1LTEuMy00Mi45IDE0LjVMMzY5LjggMzE2LjJsLTI1My45IDM2LjljLTcgMS0xMy40IDQuMy0xOC4zIDkuMy0xMi4zIDEyLjctMTIuMSAzMi45IDAuNiA0NS4zbDE4My43IDE3OS4xLTQzLjQgMjUyLjljLTEuMiA2LjktMC4xIDE0LjEgMy4yIDIwLjMgOC4yIDE1LjYgMjcuNiAyMS43IDQzLjIgMTMuNEw1MTIgNzU0bDIyNy4xIDExOS40YzYuMiAzLjMgMTMuNCA0LjQgMjAuMyAzLjIgMTcuNC0zIDI5LjEtMTkuNSAyNi4xLTM2LjlsLTQzLjQtMjUyLjkgMTgzLjctMTc5LjFjNS00LjkgOC4zLTExLjMgOS4zLTE4LjMgMi43LTE3LjUtOS41LTMzLjctMjctMzYuM3pNNjY0LjggNTYxLjZsMzYuMSAyMTAuM0w1MTIgNjcyLjcgMzIzLjEgNzcybDM2LjEtMjEwLjMtMTUyLjgtMTQ5TDQxNy42IDM4MiA1MTIgMTkwLjcgNjA2LjQgMzgybDIxMS4yIDMwLjctMTUyLjggMTQ4Ljl6IiBmaWxsPSIjNDQ0RTYwIj48L3BhdGg+PC9zdmc+",
  "star-active": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTkwOC4xIDM1My4xbC0yNTMuOS0zNi45TDU0MC43IDg2LjFjLTMuMS02LjMtOC4yLTExLjQtMTQuNS0xNC41LTE1LjgtNy44LTM1LTEuMy00Mi45IDE0LjVMMzY5LjggMzE2LjJsLTI1My45IDM2LjljLTcgMS0xMy40IDQuMy0xOC4zIDkuMy0xMi4zIDEyLjctMTIuMSAzMi45IDAuNiA0NS4zbDE4My43IDE3OS4xLTQzLjQgMjUyLjljLTEuMiA2LjktMC4xIDE0LjEgMy4yIDIwLjMgOC4yIDE1LjYgMjcuNiAyMS43IDQzLjIgMTMuNEw1MTIgNzU0bDIyNy4xIDExOS40YzYuMiAzLjMgMTMuNCA0LjQgMjAuMyAzLjIgMTcuNC0zIDI5LjEtMTkuNSAyNi4xLTM2LjlsLTQzLjQtMjUyLjkgMTgzLjctMTc5LjFjNS00LjkgOC4zLTExLjMgOS4zLTE4LjMgMi43LTE3LjUtOS41LTMzLjctMjctMzYuM3pNNjY0LjggNTYxLjZsMzYuMSAyMTAuM0w1MTIgNjcyLjcgMzIzLjEgNzcybDM2LjEtMjEwLjMtMTUyLjgtMTQ5TDQxNy42IDM4MiA1MTIgMTkwLjcgNjA2LjQgMzgybDIxMS4yIDMwLjctMTUyLjggMTQ4Ljl6IiBmaWxsPSIjMzM4MUZGIj48L3BhdGg+PC9zdmc+",
  "star-innerVertex": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTg1LjMzMzMzMyAwYTg1LjMzMzMzMyA4NS4zMzMzMzMgMCAwIDEgODEuNDA4IDU5LjczMzMzM2g0OC4yMTMzMzR2ODUuMzMzMzM0TDE3MC42NjY2NjcgMTQ0Ljk4MTMzM1Y4NTMuMzMzMzMzaDY5My4zMzMzMzNsLTI2LjQ1MzMzMy02My40ODggNzguNzYyNjY2LTMyLjc2OCAzMi44NTMzMzQgNzguNzYyNjY3LTQyLjI0IDE3LjQ5MzMzM0g5MzguNjY2NjY3YTg1LjMzMzMzMyA4NS4zMzMzMzMgMCAwIDEgODQuNzM2IDc1LjM0OTMzNEwxMDI0IDkzOC42NjY2NjdhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS0xNzAuNjY2NjY3IDBIMTcwLjY2NjY2N2E4NS4zMzMzMzMgODUuMzMzMzMzIDAgMSAxLTg1LjMzMzMzNC04NS4zMzMzMzRWMTcwLjY2NjY2N2E4NS4zMzMzMzMgODUuMzMzMzMzIDAgMSAxIDAtMTcwLjY2NjY2N3ogbTc2NS4zNTQ2NjcgNTk5LjQ2NjY2N2wzMi44NTMzMzMgNzguNzYyNjY2LTc4Ljg0OCAzMi44NTMzMzQtMzIuNzY4LTc4Ljc2MjY2NyA3OC43NjI2NjctMzIuODUzMzMzeiBtLTY1LjcwNjY2Ny0xNTcuNTI1MzM0bDMyLjg1MzMzNCA3OC43NjI2NjctNzguNzYyNjY3IDMyLjg1MzMzMy0zMi43NjgtNzguNzYyNjY2IDc4Ljc2MjY2Ny0zMi44NTMzMzR6TTcxOS4zNiAyODQuNDE2bDMyLjg1MzMzMyA3OC43NjI2NjctNzguNzYyNjY2IDMyLjg1MzMzMy0zMi44NTMzMzQtNzguNzYyNjY3IDc4Ljc2MjY2Ny0zMi44NTMzMzN6IG0tNjUuNjIxMzMzLTE1Ny41MjUzMzNsMzIuODUzMzMzIDc4Ljc2MjY2Ni03OC43NjI2NjcgMzIuODUzMzM0LTMyLjg1MzMzMy03OC43NjI2NjcgNzguNzYyNjY3LTMyLjg1MzMzM3pNMzg1LjcwNjY2NyA1OS43MzMzMzN2ODUuMzMzMzM0aC04NS4zMzMzMzR2LTg1LjMzMzMzNGg4NS4zMzMzMzR6IG0xNzAuNjY2NjY2IDB2ODUuMzMzMzM0aC04NS4zMzMzMzN2LTg1LjMzMzMzNGg4NS4zMzMzMzN6IiBmaWxsPSIjNDQ0RTYwIiA+PC9wYXRoPjwvc3ZnPg==",
  "star-innerRatio": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTU2OS4zNDQgNDQ5LjUzNmwxNDYuOTQ0IDI4LjY3MiAxLjAyNC00LjYwOHY0LjYwOGgxLjAyNGM5LjcyOCAwIDE2Ljg5Ni03LjY4IDIwLjQ4LTE0Ljg0OGwxLjAyNC0yLjA0OHYtMi41NmMwLTUuNjMyIDAtMTEuMjY0LTUuMTItMTYuMzg0LTMuMDcyLTMuMDcyLTcuMTY4LTcuMTY4LTEyLjgtNy42OGwtMTI0LjkyOC0yNC4wNjRMNTQxLjY5NiAyODYuNzJjLTIuMDQ4LTQuNjA4LTYuNjU2LTguMTkyLTExLjc3Ni05LjcyOC01LjEyLTEuNTM2LTEwLjc1Mi0xLjUzNi0xNS4zNiAxLjAyNGwtMS41MzYgMC41MTItMS4wMjQgMS4wMjRjLTguMTkyIDguMTkyLTEwLjc1MiAxOS40NTYtNi42NTYgMjcuMTM2bDY0IDE0Mi44NDh6IiBmaWxsPSIjMzM4MUZGIj48L3BhdGg+PHBhdGggZD0iTTkzMS4zMjggNDAzLjQ1NmMtMTAuMjQtMzUuMzI4LTM4LjQtNjEuNDQtNzEuNjgtNjYuNTZsLTE4NC44MzItMzUuODQtODIuNDMyLTE4Mi43ODRjLTEyLjgtMzMuMjgtNDYuMDgtNTYuMzItODAuMzg0LTU2LjMyLTMzLjc5MiAwLTY0LjUxMiAyMC40OC03OS44NzIgNTMuNzZMMzQ5LjE4NCAyOTkuMDA4bC0xODQuMzIgMzUuMzI4Yy0zMy43OTIgNS4xMi02MS45NTIgMzEuMjMyLTcyLjE5MiA2Ni41Ni05LjcyOCAzNC4zMDQtMS4wMjQgNzIuMTkyIDIzLjA0IDk4LjgxNmwxMzEuNTg0IDEzMy42MzItMzUuODQgMTk2LjYwOGMtNS42MzIgMzQuODE2IDguNzA0IDcxLjY4IDM1Ljg0IDk0LjIwOCAxMy44MjQgMTEuMjY0IDM0LjMwNCAxOC40MzIgNTIuMjI0IDE4LjQzMiAxNi44OTYgMCAyOS42OTYtMy4wNzIgNDEuNDcyLTEwLjI0bDE2OC45Ni05MS4xMzYgMTY2LjkxMiA5MS4xMzYgMS4wMjQgMC41MTJjMTYuODk2IDYuNjU2IDI5LjY5NiA5LjcyOCA0MC40NDggOS43MjggMTQuMzM2IDAgMjcuNjQ4LTQuMDk2IDQwLjQ0OC03LjY4IDQuNjA4LTEuNTM2IDkuNzI4LTMuMDcyIDE0Ljg0OC00LjA5NmwyLjU2LTAuNTEyIDIuMDQ4LTEuNTM2YzI1LjA4OC0yMy4wNCAzNy44ODgtNTguODggMzIuNzY4LTkzLjY5NmwtMzMuMjgtMTk2LjYwOCAxMzEuNTg0LTEzNi4xOTJjMjQuMDY0LTI3LjY0OCAzMi4yNTYtNjIuOTc2IDIyLjAxNi05OC44MTZ6TTI3Ni45OTIgODM2LjA5Nmw0MS45ODQtMjMxLjkzNi0xNTcuMTg0LTE1OS4yMzJjLTUuNjMyLTUuNjMyLTguMTkyLTE3LjQwOC02LjY1Ni0yOS4xODQgMy41ODQtMTAuMjQgMTAuMjQtMTYuMzg0IDE5LjQ1Ni0xNy45MmwyMTguMTEyLTQxLjk4NCA5Ni4yNTYtMjE1LjU1MmMzLjA3Mi03LjE2OCAxMi44LTE0LjMzNiAyMC40OC0xNC4zMzZzMTcuNDA4IDcuMTY4IDIwLjQ4IDE0Ljg0OGw5OC4zMDQgMjE1LjA0IDIxOC4xMTIgNDEuOTg0YzcuMTY4IDEuNTM2IDE1LjM2IDcuMTY4IDE2Ljg5NiAxNi4zODR2My4wNzJjMi4wNDggMTEuNzc2LTAuNTEyIDIyLjUyOC02LjY1NiAzMC43Mkw2OTkuOTA0IDYwOS4yOGwzOS45MzYgMjMxLjQyNGMxLjUzNiAxMC43NTItMi4wNDggMjAuNDgtMTAuMjQgMjcuMTM2bC0xLjAyNCAwLjUxMmMtMi41NiAyLjU2LTYuNjU2IDQuMDk2LTExLjI2NCA0LjA5Ni0yLjA0OCAwLTcuMTY4LTEuNTM2LTExLjI2NC0zLjU4NGwtMTk3LjEyLTEwOC4wMzItMTk5LjE2OCAxMDIuOTEyYy00LjA5NiAyLjA0OC05LjIxNiAzLjU4NC0xMS43NzYgMy41ODQtNC42MDggMC04LjcwNC0xLjUzNi0xMS4yNjQtNC4wOTZsLTEuMDI0LTAuNTEyYy02LjY1Ni02LjE0NC0xMC43NTItMTYuMzg0LTguNzA0LTI2LjYyNHoiIGZpbGw9IiM0NDRFNjAiPjwvcGF0aD48L3N2Zz4=",
  speechBallon: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTgzMiA4MzJINDQ4bC0xMjggMTkyLTEyOC0xOTJjLTEwNi4wNDggMC0xOTItODYuMDE2LTE5Mi0xOTJWMTkyYTE5MiAxOTIgMCAwIDEgMTkyLTE5Mmg2NDBjMTA1Ljk4NCAwIDE5MiA4NS45NTIgMTkyIDE5MnY0NDhjMCAxMDUuOTg0LTg2LjAxNiAxOTItMTkyIDE5MnogbTY0LTY0MGE2NCA2NCAwIDAgMC02NC02NEgxOTJDMTU2LjY3MiAxMjggMTI4IDE1Ni42NzIgMTI4IDE5MnY0NDhhNjQgNjQgMCAwIDAgNjQgNjRoNDIuNjg4TDMyMCA4MzJsODUuMzEyLTEyOEg4MzJjMzUuMzkyIDAgNjQtMjguNjA4IDY0LTY0VjE5MnoiIGZpbGw9IiM0NDRFNjAiPjwvcGF0aD48L3N2Zz4=",
  "speechBallon-active": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTgzMiA4MzJINDQ4bC0xMjggMTkyLTEyOC0xOTJjLTEwNi4wNDggMC0xOTItODYuMDE2LTE5Mi0xOTJWMTkyYTE5MiAxOTIgMCAwIDEgMTkyLTE5Mmg2NDBjMTA1Ljk4NCAwIDE5MiA4NS45NTIgMTkyIDE5MnY0NDhjMCAxMDUuOTg0LTg2LjAxNiAxOTItMTkyIDE5MnogbTY0LTY0MGE2NCA2NCAwIDAgMC02NC02NEgxOTJDMTU2LjY3MiAxMjggMTI4IDE1Ni42NzIgMTI4IDE5MnY0NDhhNjQgNjQgMCAwIDAgNjQgNjRoNDIuNjg4TDMyMCA4MzJsODUuMzEyLTEyOEg4MzJjMzUuMzkyIDAgNjQtMjguNjA4IDY0LTY0VjE5MnoiIGZpbGw9IiMzMzgxRkYiPjwvcGF0aD48L3N2Zz4=",
  "speechBallon-placement": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTU3NiAyMTMuMzMzMzMzbDIyLjYxMzMzMyAyMi42MTMzMzRhMzIgMzIgMCAwIDAgMC00NS4yMjY2NjdMNTc2IDIxMy4zMzMzMzN6IG0tNjIuNzItMTA3Ljk0NjY2NmEzMiAzMiAwIDEgMC00NS4yMjY2NjcgNDUuMjI2NjY2bDQ1LjIyNjY2Ny00NS4yMjY2NjZ6IG0tNDUuMjI2NjY3IDE3MC42NjY2NjZhMzIgMzIgMCAwIDAgNDUuMjI2NjY3IDQ1LjIyNjY2N2wtNDUuMjI2NjY3LTQ1LjIyNjY2N3pNNDQ4IDgxMC42NjY2NjdsLTIyLjYxMzMzMy0yMi42MTMzMzRhMzIgMzIgMCAwIDAgMCA0NS4yMjY2NjdsMjIuNjEzMzMzLTIyLjYxMzMzM3ogbTEwNy45NDY2NjctNjIuNzJhMzIgMzIgMCAxIDAtNDUuMjI2NjY3LTQ1LjIyNjY2N2w0NS4yMjY2NjcgNDUuMjI2NjY3eiBtLTQ1LjIyNjY2NyAxNzAuNjY2NjY2YTMyIDMyIDAgMSAwIDQ1LjIyNjY2Ny00NS4yMjY2NjZsLTQ1LjIyNjY2NyA0NS4yMjY2NjZ6TTgxMC42NjY2NjcgNTc2bC0yMi42MTMzMzQgMjIuNjEzMzMzYTMyIDMyIDAgMCAwIDQ1LjIyNjY2NyAwTDgxMC42NjY2NjcgNTc2eiBtMTA3Ljk0NjY2Ni02Mi43MmEzMiAzMiAwIDEgMC00NS4yMjY2NjYtNDUuMjI2NjY3bDQ1LjIyNjY2NiA0NS4yMjY2Njd6IG0tMTcwLjY2NjY2Ni00NS4yMjY2NjdhMzIgMzIgMCAxIDAtNDUuMjI2NjY3IDQ1LjIyNjY2N2w0NS4yMjY2NjctNDUuMjI2NjY3ek0yMTMuMzMzMzMzIDQ0OGwyMi42MTMzMzQtMjIuNjEzMzMzYTMyIDMyIDAgMCAwLTQ1LjIyNjY2NyAwbDIyLjYxMzMzMyAyMi42MTMzMzN6IG02Mi43MiAxMDcuOTQ2NjY3YTMyIDMyIDAgMCAwIDQ1LjIyNjY2Ny00NS4yMjY2NjdsLTQ1LjIyNjY2NyA0NS4yMjY2Njd6IG0tMTcwLjY2NjY2Ni00NS4yMjY2NjdhMzIgMzIgMCAxIDAgNDUuMjI2NjY2IDQ1LjIyNjY2N2wtNDUuMjI2NjY2LTQ1LjIyNjY2N3pNMzA5LjMzMzMzMyAyMTMuMzMzMzMzQTc0LjY2NjY2NyA3NC42NjY2NjcgMCAwIDEgMjM0LjY2NjY2NyAyODh2NjRBMTM4LjY2NjY2NyAxMzguNjY2NjY3IDAgMCAwIDM3My4zMzMzMzMgMjEzLjMzMzMzM2gtNjR6TTIzNC42NjY2NjcgMjg4QTc0LjY2NjY2NyA3NC42NjY2NjcgMCAwIDEgMTYwIDIxMy4zMzMzMzNoLTY0QTEzOC42NjY2NjcgMTM4LjY2NjY2NyAwIDAgMCAyMzQuNjY2NjY3IDM1MnYtNjR6TTE2MCAyMTMuMzMzMzMzYzAtNDEuMjE2IDMzLjQ1MDY2Ny03NC42NjY2NjcgNzQuNjY2NjY3LTc0LjY2NjY2NnYtNjRBMTM4LjY2NjY2NyAxMzguNjY2NjY3IDAgMCAwIDk2IDIxMy4zMzMzMzNoNjR6TTIzNC42NjY2NjcgMTM4LjY2NjY2N2M0MS4yMTYgMCA3NC42NjY2NjcgMzMuNDUwNjY3IDc0LjY2NjY2NiA3NC42NjY2NjZoNjRBMTM4LjY2NjY2NyAxMzguNjY2NjY3IDAgMCAwIDIzNC42NjY2NjcgNzQuNjY2NjY3djY0ek0zNDEuMzMzMzMzIDI0NS4zMzMzMzNoMjM0LjY2NjY2N3YtNjRIMzQxLjMzMzMzM3Y2NHogbTI1Ny4yOC01NC42MTMzMzNsLTg1LjMzMzMzMy04NS4zMzMzMzMtNDUuMjI2NjY3IDQ1LjIyNjY2NiA4NS4zMzMzMzQgODUuMzMzMzM0IDQ1LjIyNjY2Ni00NS4yMjY2Njd6IG0tNDUuMjI2NjY2IDBsLTg1LjMzMzMzNCA4NS4zMzMzMzMgNDUuMjI2NjY3IDQ1LjIyNjY2NyA4NS4zMzMzMzMtODUuMzMzMzMzLTQ1LjIyNjY2Ni00NS4yMjY2Njd6TTY1MC42NjY2NjcgODEwLjY2NjY2N2ExMzguNjY2NjY3IDEzOC42NjY2NjcgMCAwIDAgMTM4LjY2NjY2NiAxMzguNjY2NjY2di02NEE3NC42NjY2NjcgNzQuNjY2NjY3IDAgMCAxIDcxNC42NjY2NjcgODEwLjY2NjY2N2gtNjR6IG0xMzguNjY2NjY2IDEzOC42NjY2NjZBMTM4LjY2NjY2NyAxMzguNjY2NjY3IDAgMCAwIDkyOCA4MTAuNjY2NjY3aC02NGE3NC42NjY2NjcgNzQuNjY2NjY3IDAgMCAxLTc0LjY2NjY2NyA3NC42NjY2NjZ2NjR6TTkyOCA4MTAuNjY2NjY3YTEzOC42NjY2NjcgMTM4LjY2NjY2NyAwIDAgMC0xMzguNjY2NjY3LTEzOC42NjY2Njd2NjRjNDEuMjE2IDAgNzQuNjY2NjY3IDMzLjQ1MDY2NyA3NC42NjY2NjcgNzQuNjY2NjY3aDY0eiBtLTEzOC42NjY2NjctMTM4LjY2NjY2N0ExMzguNjY2NjY3IDEzOC42NjY2NjcgMCAwIDAgNjUwLjY2NjY2NyA4MTAuNjY2NjY3aDY0YzAtNDEuMjE2IDMzLjQ1MDY2Ny03NC42NjY2NjcgNzQuNjY2NjY2LTc0LjY2NjY2N3YtNjR6IG0tMTA2LjY2NjY2NiAxMDYuNjY2NjY3aC0yMzQuNjY2NjY3djY0SDY4Mi42NjY2Njd2LTY0eiBtLTIxMi4wNTMzMzQgNTQuNjEzMzMzbDg1LjMzMzMzNC04NS4zMzMzMzMtNDUuMjI2NjY3LTQ1LjIyNjY2Ny04NS4zMzMzMzMgODUuMzMzMzMzIDQ1LjIyNjY2NiA0NS4yMjY2Njd6IG0tNDUuMjI2NjY2IDBsODUuMzMzMzMzIDg1LjMzMzMzMyA0NS4yMjY2NjctNDUuMjI2NjY2LTg1LjMzMzMzNC04NS4zMzMzMzQtNDUuMjI2NjY2IDQ1LjIyNjY2N3pNNjcyIDIzNC42NjY2NjdBMTM4LjY2NjY2NyAxMzguNjY2NjY3IDAgMCAwIDgxMC42NjY2NjcgMzczLjMzMzMzM3YtNjRhNzQuNjY2NjY3IDc0LjY2NjY2NyAwIDAgMS03NC42NjY2NjctNzQuNjY2NjY2aC02NHpNODEwLjY2NjY2NyAzNzMuMzMzMzMzYTEzOC42NjY2NjcgMTM4LjY2NjY2NyAwIDAgMCAxMzguNjY2NjY2LTEzOC42NjY2NjZoLTY0QTc0LjY2NjY2NyA3NC42NjY2NjcgMCAwIDEgODEwLjY2NjY2NyAzMDkuMzMzMzMzdjY0eiBtMTM4LjY2NjY2Ni0xMzguNjY2NjY2QTEzOC42NjY2NjcgMTM4LjY2NjY2NyAwIDAgMCA4MTAuNjY2NjY3IDk2djY0YzQxLjIxNiAwIDc0LjY2NjY2NyAzMy40NTA2NjcgNzQuNjY2NjY2IDc0LjY2NjY2N2g2NHpNODEwLjY2NjY2NyA5NmExMzguNjY2NjY3IDEzOC42NjY2NjcgMCAwIDAtMTM4LjY2NjY2NyAxMzguNjY2NjY3aDY0YzAtNDEuMjE2IDMzLjQ1MDY2Ny03NC42NjY2NjcgNzQuNjY2NjY3LTc0LjY2NjY2N3YtNjR6TTc3OC42NjY2NjcgMzQxLjMzMzMzM3YyMzQuNjY2NjY3aDY0VjM0MS4zMzMzMzNoLTY0eiBtNTQuNjEzMzMzIDI1Ny4yOGw4NS4zMzMzMzMtODUuMzMzMzMzLTQ1LjIyNjY2Ni00NS4yMjY2NjctODUuMzMzMzM0IDg1LjMzMzMzNCA0NS4yMjY2NjcgNDUuMjI2NjY2eiBtMC00NS4yMjY2NjZsLTg1LjMzMzMzMy04NS4zMzMzMzQtNDUuMjI2NjY3IDQ1LjIyNjY2NyA4NS4zMzMzMzMgODUuMzMzMzMzIDQ1LjIyNjY2Ny00NS4yMjY2NjZ6TTEzOC42NjY2NjcgNzg5LjMzMzMzM2MwLTQxLjIxNiAzMy40NTA2NjctNzQuNjY2NjY3IDc0LjY2NjY2Ni03NC42NjY2NjZ2LTY0YTEzOC42NjY2NjcgMTM4LjY2NjY2NyAwIDAgMC0xMzguNjY2NjY2IDEzOC42NjY2NjZoNjR6TTIxMy4zMzMzMzMgNzE0LjY2NjY2N2M0MS4yMTYgMCA3NC42NjY2NjcgMzMuNDUwNjY3IDc0LjY2NjY2NyA3NC42NjY2NjZoNjRBMTM4LjY2NjY2NyAxMzguNjY2NjY3IDAgMCAwIDIxMy4zMzMzMzMgNjUwLjY2NjY2N3Y2NHogbTc0LjY2NjY2NyA3NC42NjY2NjZBNzQuNjY2NjY3IDc0LjY2NjY2NyAwIDAgMSAyMTMuMzMzMzMzIDg2NHY2NGExMzguNjY2NjY3IDEzOC42NjY2NjcgMCAwIDAgMTM4LjY2NjY2Ny0xMzguNjY2NjY3aC02NHpNMjEzLjMzMzMzMyA4NjRhNzQuNjY2NjY3IDc0LjY2NjY2NyAwIDAgMS03NC42NjY2NjYtNzQuNjY2NjY3aC02NEExMzguNjY2NjY3IDEzOC42NjY2NjcgMCAwIDAgMjEzLjMzMzMzMyA5Mjh2LTY0ek0yNDUuMzMzMzMzIDY4Mi42NjY2Njd2LTIzNC42NjY2NjdoLTY0VjY4Mi42NjY2NjdoNjR6IG0tNTQuNjEzMzMzLTIxMi4wNTMzMzRsODUuMzMzMzMzIDg1LjMzMzMzNCA0NS4yMjY2NjctNDUuMjI2NjY3LTg1LjMzMzMzMy04NS4zMzMzMzMtNDUuMjI2NjY3IDQ1LjIyNjY2NnogbTAtNDUuMjI2NjY2bC04NS4zMzMzMzMgODUuMzMzMzMzIDQ1LjIyNjY2NiA0NS4yMjY2NjcgODUuMzMzMzM0LTg1LjMzMzMzNC00NS4yMjY2NjctNDUuMjI2NjY2eiIgIGZpbGw9IiM0NDRFNjAiPjwvcGF0aD48L3N2Zz4="
};
function ml(t) {
  return b0[t];
}
const s0 = (t) => {
  const { workIds: l, maranger: c } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: (e) => {
      e.preventDefault(), e.stopPropagation(), j.emitMethod(F.MainEngine, R.DeleteNode, { workIds: l || [z], viewId: c.viewId });
    }, onTouchEnd: (e) => {
      e.stopPropagation(), j.emitMethod(F.MainEngine, R.DeleteNode, { workIds: l || [z], viewId: c.viewId });
    } },
    h.createElement("img", { alt: "icon", src: ml("delete") })
  );
}, a0 = (t) => {
  const { workIds: l, viewId: c } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: (e) => {
      e.preventDefault(), e.stopPropagation(), j.emitMethod(F.MainEngine, R.CopyNode, { workIds: l || [z], viewId: c });
    }, onTouchEnd: (e) => {
      e.stopPropagation(), j.emitMethod(F.MainEngine, R.CopyNode, { workIds: l || [z], viewId: c });
    } },
    h.createElement("img", { alt: "icon", src: ml("duplicate") })
  );
}, et = (t) => {
  const { icon: l, onClickHandler: c, onTouchEndHandler: e } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: c, onTouchEnd: e },
    h.createElement("img", { src: ml(l) })
  );
}, i0 = (t) => {
  const { open: l, setOpen: c, style: e } = t, { floatBarData: d, maranger: b } = Gl(nl), [s, a] = A([]), i = O(() => {
    if (e && e.bottom) {
      const m = {};
      return m.top = "inherit", m.bottom = 50, m;
    }
  }, [e]), n = O(() => l ? h.createElement(
    "div",
    { className: "image-layer-menu", style: i },
    h.createElement(et, { icon: "to-top", onClickHandler: (m) => {
      m.preventDefault(), m.stopPropagation(), j.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: fl.Top, viewId: b == null ? void 0 : b.viewId });
    }, onTouchEndHandler: (m) => {
      m.stopPropagation(), j.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: fl.Top, viewId: b == null ? void 0 : b.viewId });
    } }),
    h.createElement(et, { icon: "to-bottom", onClickHandler: (m) => {
      m.preventDefault(), m.stopPropagation(), j.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: fl.Bottom, viewId: b == null ? void 0 : b.viewId });
    }, onTouchEndHandler: (m) => {
      m.stopPropagation(), j.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: fl.Bottom, viewId: b == null ? void 0 : b.viewId });
    } })
  ) : null, [l, i]), Z = (m) => {
    m.preventDefault(), m.stopPropagation(), m.nativeEvent.stopImmediatePropagation();
    const G = !l;
    c(G), G && j.emitMethod(F.MainEngine, R.ZIndexActive, { workId: z, isActive: G, viewId: b == null ? void 0 : b.viewId });
  }, o = (m) => {
    m.stopPropagation(), m.nativeEvent.stopImmediatePropagation();
    const G = !l;
    c(G), j.emitMethod(F.MainEngine, R.ZIndexActive, { workId: z, isActive: G, viewId: b == null ? void 0 : b.viewId });
  };
  return bl(() => {
    ol(d == null ? void 0 : d.selectIds, s) || d != null && d.selectIds && !ol(d == null ? void 0 : d.selectIds, s) && (a(d == null ? void 0 : d.selectIds), c(!1));
  }, [l, d, s, c]), bl(() => () => {
    l && j.emitMethod(F.MainEngine, R.ZIndexActive, { workId: z, isActive: !1, viewId: b == null ? void 0 : b.viewId });
  }, [l]), h.createElement(
    "div",
    { className: `button normal-button ${l && "active"}`, onClick: Z, onTouchEnd: o },
    n,
    h.createElement("img", { alt: "icon", src: ml(l ? "layer-pressed" : "layer") })
  );
}, n0 = (t) => {
  const { activeColor: l, onClickHandler: c, onTouchEndHandler: e } = t;
  return h.createElement(
    "div",
    { className: `font-color-button ${l === "transparent" ? "active" : ""}`, onClick: c, onTouchEnd: e },
    h.createElement("div", { className: "circle none" })
  );
}, be = (t) => {
  const { color: l, activeColor: c, onClickHandler: e, onTouchEndHandler: d } = t;
  return h.createElement(
    "div",
    { className: `font-color-button ${l === c ? "active" : ""}`, onClick: e, onTouchEnd: d },
    h.createElement("div", { className: "circle", style: { backgroundColor: ul(l, 1) } })
  );
}, se = (t) => {
  const { opacity: l, activeColor: c, setCurOpacity: e } = t, [d, b] = A({ x: 108, y: 0 });
  if (bl(() => {
    b({ x: l * 100 + 8, y: 0 });
  }, []), !c)
    return null;
  const s = al((n, Z) => {
    n.preventDefault(), n.stopPropagation(), Z.x !== (d == null ? void 0 : d.x) && b({ x: Z.x, y: 0 });
    const o = Math.min(Math.max(Z.x - 8, 0), 100) / 100;
    l !== o && e(o, c, x.Doing);
  }, 100, { leading: !1 }), a = (n) => {
    n.preventDefault(), n.stopPropagation(), e(l, c, x.Start);
  }, i = al((n, Z) => {
    n.preventDefault(), n.stopPropagation(), Z.x !== (d == null ? void 0 : d.x) && b({ x: Z.x, y: 0 });
    const o = Math.min(Math.max(Z.x - 8, 0), 100) / 100;
    e(o, c, x.Done);
  }, 100, { leading: !1 });
  return h.createElement(
    "div",
    { className: "font-color-opacity", style: { marginLeft: "10px" }, onClick: (n) => {
      const Z = n.nativeEvent.offsetX, o = Math.min(Math.max(Z - 12, 0), 100) / 100;
      b({ x: o * 100 + 8, y: 0 }), e(o, c, x.Done);
    } },
    h.createElement("div", { className: "range-color", style: {
      background: `linear-gradient(to right, ${ul(c, 0)}, ${ul(c, 1)})`
    } }),
    h.createElement(
      "div",
      { className: "range-opacity" },
      h.createElement(
        ic,
        { bounds: "parent", axis: "x", position: d, onDrag: s, onStart: a, onStop: i },
        h.createElement("div", { className: "circle", style: {
          backgroundColor: ul(c, l)
        }, onClick: (n) => {
          n == null || n.preventDefault(), n == null || n.stopPropagation();
        } })
      )
    )
  );
}, Z0 = (t) => {
  const { open: l, setOpen: c, floatBarRef: e } = t, { floatBarData: d, floatBarColors: b, maranger: s, position: a, setFloatBarData: i } = Gl(nl), [n, Z] = A(), [o, m] = A(1);
  bl(() => {
    if (d != null && d.strokeColor) {
      const [u, V] = de(d.strokeColor);
      Z(u), m(V);
    }
  }, [d]);
  const G = O(() => {
    if (e != null && e.current && a && (s != null && s.height)) {
      if (e.current.offsetTop && e.current.offsetTop + a.y > 180) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      } else if (!e.current.offsetTop && (s == null ? void 0 : s.height) - e.current.offsetTop - a.y < 120) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      }
    }
  }, [e, a, s]), p = O(() => h.createElement(se, { key: "strokeColors", opacity: o, activeColor: n, setCurOpacity: (u, V, y) => {
    y === x.Start && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !0), y === x.Done && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !1), m(u);
    const L = ul(V, u);
    d != null && d.strokeColor && (d.strokeColor = L, i({ strokeColor: L })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], strokeColor: L, workState: y, viewId: s == null ? void 0 : s.viewId });
  } }), [o, n, s == null ? void 0 : s.control.room, s == null ? void 0 : s.viewId, d]), W = O(() => l ? h.createElement(
    "div",
    { className: "font-colors-menu", style: G, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    } },
    b.concat().map((u, V) => {
      const y = vc(...u);
      return h.createElement(be, { key: V, color: y, activeColor: n, onTouchEndHandler: (L) => {
        L.stopPropagation(), Z(y);
        const Y = ul(y, o);
        d != null && d.strokeColor && (d.strokeColor = Y, i({ strokeColor: Y })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], strokeColor: Y, viewId: s == null ? void 0 : s.viewId });
      }, onClickHandler: (L) => {
        L.preventDefault(), L.stopPropagation(), Z(y);
        const Y = ul(y, o);
        d != null && d.strokeColor && (d.strokeColor = Y, i({ strokeColor: Y })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], strokeColor: Y, viewId: s == null ? void 0 : s.viewId });
      } });
    }),
    p
  ) : null, [l, b, p, n, o, d, s == null ? void 0 : s.viewId, G]), r = O(() => n ? h.createElement(
    "div",
    { className: "color-bar-ring", style: { backgroundColor: ul(n, o) } },
    h.createElement("div", { className: "circle" })
  ) : null, [n, o]);
  return h.createElement(
    "div",
    { className: `button normal-button font-colors-icon ${l && "active"}`, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
    } },
    r,
    W
  );
}, o0 = (t) => {
  const { open: l, setOpen: c, floatBarRef: e } = t, { floatBarData: d, floatBarColors: b, maranger: s, position: a, setFloatBarData: i } = Gl(nl), [n, Z] = A(), [o, m] = A(1);
  bl(() => {
    if (d != null && d.fillColor) {
      const [u, V] = (d == null ? void 0 : d.fillColor) === "transparent" && ["transparent", 1] || de(d.fillColor);
      Z(u), m(V);
    }
  }, [d]);
  const G = O(() => {
    if (e != null && e.current && a && (s != null && s.height)) {
      if (e.current.offsetTop && e.current.offsetTop + a.y > 200) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      } else if (!e.current.offsetTop && (s == null ? void 0 : s.height) - e.current.offsetTop - a.y < 140) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      }
    }
  }, [e, a, s]), p = O(() => n && n !== "transparent" ? h.createElement(se, { key: "fillColors", opacity: o || 0, activeColor: n, setCurOpacity: (u, V, y) => {
    y === x.Start && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !0), y === x.Done && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !1), m(u);
    const L = ul(V, u);
    d != null && d.fillColor && (d.fillColor = L, i({ fillColor: L })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: n && ul(V, u), workState: y, viewId: s == null ? void 0 : s.viewId });
  } }) : null, [n, o, s == null ? void 0 : s.control.room, s == null ? void 0 : s.viewId, d]), W = O(() => l ? h.createElement(
    "div",
    { className: "font-colors-menu", style: G, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement(n0, { activeColor: n, onTouchEndHandler: (u) => {
      u.stopPropagation(), Z("transparent");
      const V = "transparent";
      d != null && d.fillColor && (d.fillColor = V, i({ fillColor: V })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: V, viewId: s == null ? void 0 : s.viewId });
    }, onClickHandler: (u) => {
      u.preventDefault(), u.stopPropagation(), Z("transparent");
      const V = "transparent";
      d != null && d.fillColor && (d.fillColor = V, i({ fillColor: V })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: V, viewId: s == null ? void 0 : s.viewId });
    } }),
    b.map((u, V) => {
      const y = vc(...u);
      return h.createElement(be, { key: V, color: y, activeColor: n, onTouchEndHandler: (L) => {
        L.stopPropagation(), Z(y);
        const Y = ul(y, o);
        d != null && d.fillColor && (d.fillColor = Y, i({ fillColor: Y })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: Y, viewId: s == null ? void 0 : s.viewId });
      }, onClickHandler: (L) => {
        L.preventDefault(), L.stopPropagation(), Z(y);
        const Y = ul(y, o);
        d != null && d.fillColor && (d.fillColor = Y, i({ fillColor: Y })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: Y, viewId: s == null ? void 0 : s.viewId });
      } });
    }),
    p
  ) : null, [l, n, b, p, d, s == null ? void 0 : s.viewId, o, G]), r = O(() => {
    const u = n && n !== "transparent" && ul(n, o) || "transparent";
    return h.createElement(
      "div",
      { className: "color-bar-fill" },
      h.createElement("div", { className: "circle", style: { backgroundColor: u } })
    );
  }, [n, o]);
  return h.createElement(
    "div",
    { className: `button normal-button font-colors-icon ${l && "active"}`, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
    } },
    r,
    W
  );
}, m0 = (t) => {
  const { open: l, setOpen: c, textOpt: e, workIds: d, floatBarRef: b } = t, { floatBarColors: s, maranger: a, position: i, setFloatBarData: n, floatBarData: Z } = Gl(nl), [o, m] = A(), [G, p] = A(1);
  bl(() => {
    if (e != null && e.fontColor) {
      const [y, L] = (e == null ? void 0 : e.fontColor) === "transparent" && ["transparent", 0] || de(e.fontColor);
      m(y), p(L);
    }
  }, [e == null ? void 0 : e.fontColor]);
  const W = O(() => {
    if (b != null && b.current && i && (a != null && a.height)) {
      if (b.current.offsetTop && b.current.offsetTop + i.y > 180) {
        const y = {};
        return y.top = "inherit", y.bottom = 50, y;
      } else if (!b.current.offsetTop && (a == null ? void 0 : a.height) - b.current.offsetTop - i.y < 120) {
        const y = {};
        return y.top = "inherit", y.bottom = 50, y;
      }
    }
  }, [b, i, a]), r = O(() => o && o !== "transparent" ? h.createElement(se, { key: "fontColors", opacity: G, activeColor: o, setCurOpacity: (y, L, Y) => {
    Y === x.Start && (a != null && a.control.room) && (a.control.room.disableDeviceInputs = !0), Y === x.Done && (a != null && a.control.room) && (a.control.room.disableDeviceInputs = !1), p(y);
    const N = ul(L, y);
    Z != null && Z.textOpt && (Z.textOpt.fontColor = N, n({ textOpt: Z.textOpt })), j.emitMethod(F.MainEngine, R.SetColorNode, {
      workIds: d || [z],
      fontColor: o && N,
      workState: Y,
      viewId: a == null ? void 0 : a.viewId
    });
  } }) : null, [o, G, a == null ? void 0 : a.control.room, a == null ? void 0 : a.viewId, Z == null ? void 0 : Z.textOpt, d]), u = O(() => l ? h.createElement(
    "div",
    { className: "font-colors-menu", style: W, onTouchEnd: (y) => {
      y.stopPropagation(), y.nativeEvent.stopImmediatePropagation();
    }, onClick: (y) => {
      y.preventDefault(), y.stopPropagation(), y.nativeEvent.stopImmediatePropagation();
    } },
    s.map((y, L) => {
      const Y = vc(...y);
      return h.createElement(be, { key: L, color: Y, activeColor: o, onTouchEndHandler: (N) => {
        N.stopPropagation(), m(Y);
        const T = ul(Y, G);
        Z != null && Z.textOpt && (Z.textOpt.fontColor = T, n({ textOpt: Z.textOpt })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: d || [z], fontColor: T, viewId: a == null ? void 0 : a.viewId });
      }, onClickHandler: (N) => {
        N.preventDefault(), N.stopPropagation(), m(Y);
        const T = ul(Y, G);
        Z != null && Z.textOpt && (Z.textOpt.fontColor = T, n({ textOpt: Z.textOpt })), j.emitMethod(F.MainEngine, R.SetColorNode, { workIds: d || [z], fontColor: T, viewId: a == null ? void 0 : a.viewId });
      } });
    }),
    r
  ) : null, [l, s, r, o, G, Z == null ? void 0 : Z.textOpt, d, a == null ? void 0 : a.viewId, W]), V = O(() => {
    const y = o && o !== "transparent" && ul(o, G) || "transparent";
    return h.createElement(
      "div",
      { className: "color-bar" },
      h.createElement("div", { className: "color-bar-color", style: { backgroundColor: y } })
    );
  }, [o, G]);
  return h.createElement(
    "div",
    { className: `button normal-button font-colors-icon ${l && "active"}`, onTouchEnd: (y) => {
      y.stopPropagation(), y.nativeEvent.stopImmediatePropagation(), c(!l);
    }, onClick: (y) => {
      y.preventDefault(), y.stopPropagation(), y.nativeEvent.stopImmediatePropagation(), c(!l);
    } },
    h.createElement("img", { alt: "icon", src: ml("font-colors") }),
    V,
    u
  );
}, G0 = (t) => {
  const { bold: l, setBold: c, workIds: e, viewId: d } = t, b = (s) => {
    const a = l === "bold" ? "normal" : "bold";
    s == null || s.preventDefault(), s == null || s.stopPropagation(), c(a), j.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: e, viewId: d, bold: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l === "bold" ? "bold-active" : "bold") })
  );
}, u0 = (t) => {
  const { underline: l, setUnderline: c, workIds: e, viewId: d } = t, b = (s) => {
    const a = !l;
    s == null || s.preventDefault(), s == null || s.stopPropagation(), c(a), j.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: e, viewId: d, underline: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l ? "underline-active" : "underline") })
  );
}, h0 = (t) => {
  const { lineThrough: l, setLineThrough: c, workIds: e, viewId: d } = t, b = (s) => {
    const a = !l;
    s == null || s.preventDefault(), s == null || s.stopPropagation(), c(a), j.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: e, viewId: d, lineThrough: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l ? "line-through-active" : "line-through") })
  );
}, p0 = (t) => {
  const { italic: l, setItalic: c, workIds: e, viewId: d } = t, b = (s) => {
    const a = l === "italic" ? "normal" : "italic";
    s == null || s.preventDefault(), s == null || s.stopPropagation(), c(a), j.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: e, viewId: d, italic: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l === "italic" ? "italic-active" : "italic") })
  );
}, y0 = (t) => {
  const { open: l, setOpen: c, textOpt: e, workIds: d, style: b } = t, { maranger: s } = Gl(nl), [a, i] = A("normal"), [n, Z] = A("normal"), [o, m] = A(!1), [G, p] = A(!1);
  bl(() => {
    e != null && e.bold && i(e.bold), Vl(e == null ? void 0 : e.underline) && m(e.underline || !1), Vl(e == null ? void 0 : e.lineThrough) && p(e.lineThrough || !1), e != null && e.italic && Z(e.italic);
  }, [e]);
  const W = O(() => {
    if (b && b.bottom) {
      const u = {};
      return u.top = "inherit", u.bottom = 50, u;
    }
  }, [b]), r = O(() => l ? h.createElement(
    "div",
    { className: "font-style-menu", style: W, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement(G0, { workIds: d || [z], bold: a, setBold: i, viewId: s == null ? void 0 : s.viewId }),
    h.createElement(u0, { workIds: d || [z], underline: o, setUnderline: m, viewId: s == null ? void 0 : s.viewId }),
    h.createElement(h0, { workIds: d || [z], lineThrough: G, setLineThrough: p, viewId: s == null ? void 0 : s.viewId }),
    h.createElement(p0, { workIds: d || [z], italic: n, setItalic: Z, viewId: s == null ? void 0 : s.viewId })
  ) : null, [l, d, a, s == null ? void 0 : s.viewId, o, G, n, W]);
  return h.createElement(
    "div",
    { className: `button normal-button ${l && "active"}`, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
    } },
    h.createElement("img", { alt: "icon", src: ml(l ? "font-style-active" : "font-style") }),
    r
  );
}, Xl = Object.freeze([
  12,
  14,
  18,
  24,
  36,
  48,
  64,
  80,
  144,
  288
]), Al = [
  "top",
  "topLeft",
  "topRight",
  "bottom",
  "bottomLeft",
  "bottomRight",
  "left",
  "leftTop",
  "leftBottom",
  "right",
  "rightTop",
  "rightBottom"
], W0 = (t) => {
  const { style: l, onClickHandler: c } = t;
  return h.createElement("div", { className: "font-size-menu", style: l, onTouchEnd: (e) => {
    e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
  }, onClick: (e) => {
    e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
  } }, Xl.map((e) => h.createElement("div", { className: "font-size-btn", key: e, onClick: () => {
    c(e);
  }, onTouchEnd: () => {
    c(e);
  } }, e)));
}, X0 = (t) => {
  const l = Ol(null), { open: c, setOpen: e, textOpt: d, workIds: b, floatBarRef: s } = t, { maranger: a, position: i } = Gl(nl), [n, Z] = A(0), [o, m] = A(), G = Xl.length - 1;
  bl(() => {
    d != null && d.fontSize && (Z(d.fontSize), l.current && (l.current.value = d.fontSize.toString()));
  }, [d == null ? void 0 : d.fontSize]);
  const p = O(() => {
    if (s != null && s.current && i && (a != null && a.height)) {
      if (s.current.offsetTop && s.current.offsetTop + i.y > 250) {
        const y = {};
        return y.top = "inherit", y.bottom = 35, y;
      } else if (!s.current.offsetTop && (a == null ? void 0 : a.height) - s.current.offsetTop - i.y < 180) {
        const y = {};
        return y.top = "inherit", y.bottom = 35, y;
      }
    }
  }, [s, i, a]);
  function W(y) {
    Z(y), y && y >= Xl[0] && y <= Xl[G] && j.emitMethod(F.MainEngine, R.SetFontStyle, {
      workIds: b || [z],
      fontSize: y,
      viewId: a == null ? void 0 : a.viewId
    });
  }
  const r = (y) => {
    var L;
    Z(y), e(!1), (L = l.current) == null || L.blur(), y && y >= Xl[0] && y <= Xl[G] && j.emitMethod(F.MainEngine, R.SetFontStyle, {
      workIds: b || [z],
      fontSize: y,
      viewId: a == null ? void 0 : a.viewId
    });
  }, u = O(() => c ? h.createElement(W0, { onClickHandler: r, style: p }) : null, [c, r, p]), V = (y) => {
    y > Xl[G] && (y = Xl[G]), y < Xl[0] && (y = Xl[0]), W(y);
  };
  return bl(() => () => {
    a != null && a.control.room && Vl(o) && (a.control.room.disableDeviceInputs = o);
  }, [a, o]), h.createElement(
    "div",
    { className: "button normal-button font-size-barBtn", style: { width: 50 }, onTouchEnd: (y) => {
      y.stopPropagation(), y.nativeEvent.stopImmediatePropagation();
    }, onClick: (y) => {
      y.preventDefault(), y.stopPropagation(), y.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement("input", { className: "font-size-input", ref: l, onTouchEnd: () => {
      l.current && l.current.focus();
    }, onClick: () => {
      e(!c), l.current && l.current.focus();
    }, onKeyDown: (y) => {
      if (y.key === "Backspace") {
        const L = window.getSelection(), Y = L == null ? void 0 : L.getRangeAt(0);
        if (Y != null && Y.collapsed)
          return y.preventDefault(), document.execCommand("delete", !1), !1;
      }
    }, onKeyUp: () => {
      if (l.current) {
        const y = l.current.value, L = parseInt(y);
        isNaN(L) ? l.current.value = "0" : l.current.value = L.toString();
      }
    }, onChange: (y) => {
      const L = y.target.value, Y = parseInt(L);
      Y && W(Y);
    }, onFocus: () => {
      a != null && a.control.room && !a.control.room.disableDeviceInputs && (m(a.control.room.disableDeviceInputs), a.control.room.disableDeviceInputs = !0);
    }, onBlur: () => {
      a != null && a.control.room && Vl(o) && (a.control.room.disableDeviceInputs = o);
    } }),
    h.createElement(
      "div",
      { className: "font-size-btns" },
      h.createElement("div", { className: "font-size-add", onClick: () => {
        V(n + Xl[0]);
      }, onTouchEnd: () => {
        V(n + Xl[0]);
      } }),
      h.createElement("div", { className: "font-size-cut", onClick: () => {
        V(n - Xl[0]);
      }, onTouchEnd: () => {
        V(n - Xl[0]);
      } })
    ),
    u
  );
}, r0 = (t) => {
  const { workIds: l, maranger: c, islocked: e } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: (d) => {
      d.preventDefault(), d.stopPropagation(), j.emitMethod(F.MainEngine, R.SetLock, { workIds: l || [z], isLocked: !e, viewId: c == null ? void 0 : c.viewId });
    }, onTouchEnd: (d) => {
      d.stopPropagation(), j.emitMethod(F.MainEngine, R.SetLock, { workIds: l || [z], isLocked: !e, viewId: c == null ? void 0 : c.viewId });
    } },
    h.createElement("img", { alt: "icon", src: ml(e ? "unlock-new" : "lock-new") })
  );
}, fc = (t) => {
  const { icon: l, min: c, max: e, step: d, value: b, onInputHandler: s } = t, [a, i] = A(0), n = Ol(null), Z = (o) => {
    o > e && (o = e), o < c && (o = c), i(o), s(o), n.current && (n.current.value = o.toString());
  };
  return bl(() => {
    b && (i(b), n.current && (n.current.value = b.toString()));
  }, [b]), h.createElement(
    "div",
    { className: "button input-button", onTouchEnd: (o) => {
      o.stopPropagation(), o.nativeEvent.stopImmediatePropagation();
    }, onClick: (o) => {
      o.preventDefault(), o.stopPropagation(), o.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement("img", { src: ml(l) }),
    h.createElement("input", { className: "input-number", type: "text", ref: n, onTouchEnd: () => {
      n.current && n.current.focus();
    }, onClick: () => {
      n.current && n.current.focus();
    }, onKeyDown: (o) => {
      if (o.key === "Backspace") {
        const m = window.getSelection(), G = m == null ? void 0 : m.getRangeAt(0);
        if (G != null && G.collapsed)
          return o.preventDefault(), document.execCommand("delete", !1), !1;
      }
    }, onKeyUp: () => {
      if (n.current) {
        const o = n.current.value, m = parseInt(o);
        isNaN(m) ? n.current.value = "0" : n.current.value = m.toString();
      }
    }, onChange: (o) => {
      const m = o.target.value, G = parseInt(m);
      G && G && G >= c && G <= e && Z(G);
    } }),
    h.createElement(
      "div",
      { className: "input-number-btns" },
      h.createElement("div", { className: "input-number-add", onClick: () => {
        Z(a + d);
      }, onTouchEnd: () => {
        Z(a + d);
      } }),
      h.createElement("div", { className: "input-number-cut", onClick: () => {
        Z(a - d);
      }, onTouchEnd: () => {
        Z(a - d);
      } })
    )
  );
}, V0 = (t) => {
  const { icon: l, min: c, max: e, step: d, value: b, onInputHandler: s } = t;
  return h.createElement(
    "div",
    { className: "button input-button" },
    h.createElement("img", { src: ml(l) }),
    h.createElement(Y0, { min: c, max: e, step: d, value: b, onInputHandler: s })
  );
}, Y0 = (t) => {
  const { value: l, min: c, max: e, onInputHandler: d } = t, [b, s] = A({ x: 0, y: 0 });
  bl(() => {
    s({ x: l * 100, y: 0 });
  }, []);
  const a = al((Z, o) => {
    Z.preventDefault(), Z.stopPropagation();
    let m = Math.floor(Math.max(o.x, c * 100));
    m = Math.floor(Math.min(m, e * 100)), o.x !== (b == null ? void 0 : b.x) && s({ x: m, y: 0 });
    const G = m / 100;
    console.log("first1--doing", o, o.x, m, G), l !== G && d(G);
  }, 100, { leading: !1 }), i = (Z) => {
    Z.preventDefault(), Z.stopPropagation();
  }, n = al((Z, o) => {
    Z.preventDefault(), Z.stopPropagation();
    let m = Math.floor(Math.max(o.x, c * 100));
    m = Math.floor(Math.min(m, e * 100)), o.x !== (b == null ? void 0 : b.x) && s({ x: m, y: 0 });
    const G = m / 100;
    console.log("first1--end", o, o.x, m, G), l !== G && d(G);
  }, 100, { leading: !1 });
  return console.log("position", b), h.createElement(
    "div",
    { className: "range-number-container", onClick: (Z) => {
      const o = Z.nativeEvent.offsetX - 6;
      let m = Math.floor(Math.max(o, c * 100));
      m = Math.floor(Math.min(m, e * 100)), s({ x: m, y: 0 });
      const G = m / 100;
      console.log("first1", Z.nativeEvent.offsetX, m, G), l !== G && d(G);
    } },
    h.createElement("div", { className: "range-number-color" }),
    h.createElement(
      "div",
      { className: "range-number" },
      h.createElement(
        ic,
        { bounds: "parent", axis: "x", position: b, onDrag: a, onStart: i, onStop: n },
        h.createElement("div", { className: "circle", onClick: i })
      )
    )
  );
}, L0 = (t) => {
  const { icon: l, value: c, onChangeHandler: e, style: d } = t, [b, s] = A(0), [a, i] = A(), n = Ol(null), Z = Ot((G) => {
    G >= Al.length && (G = 0), G < 0 && (G = Al.length - 1), s(G), e(Al[G]), i(!1), n.current && (n.current.value = Al[G]);
  }, [e]), o = O(() => {
    if (d && d.bottom) {
      const G = {};
      return G.top = "inherit", G.bottom = 50, G;
    }
  }, [d]);
  bl(() => {
    c && (s(Al.indexOf(c)), n.current && (n.current.value = c));
  }, [c]);
  const m = O(() => a ? h.createElement(x0, { options: Al, onClickHandler: Z, style: o }) : null, [a, Z, o]);
  return h.createElement(
    "div",
    { className: "button input-button" },
    h.createElement("img", { src: ml(l) }),
    h.createElement("input", { readOnly: !0, className: "input-number", type: "text", ref: n, onTouchEnd: () => {
      n.current && n.current.focus();
    }, onClick: () => {
      n.current && (n.current.focus(), i(!a));
    } }),
    h.createElement(
      "div",
      { className: "input-number-btns" },
      h.createElement("div", { className: "input-number-add", onClick: () => {
        Z(b + 1);
      }, onTouchEnd: () => {
        Z(b + 1);
      } }),
      h.createElement("div", { className: "input-number-cut", onClick: () => {
        Z(b - 1);
      }, onTouchEnd: () => {
        Z(b - 1);
      } })
    ),
    m
  );
}, x0 = (t) => {
  const { options: l, style: c, onClickHandler: e } = t;
  return h.createElement("div", { className: "select-option-menu", style: c, onTouchEnd: (d) => {
    d.stopPropagation(), d.nativeEvent.stopImmediatePropagation();
  }, onClick: (d) => {
    d.preventDefault(), d.stopPropagation(), d.nativeEvent.stopImmediatePropagation();
  } }, l.map((d, b) => h.createElement("div", { className: "select-option-btn", key: d, onClick: () => {
    e(b);
  }, onTouchEnd: () => {
    e(b);
  } }, d)));
}, R0 = (t) => {
  const { maranger: l, innerRatio: c, innerVerticeStep: e, vertices: d } = t, b = (i) => {
    console.log("onInputHandler", i), j.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: X.Star,
      viewId: l.viewId,
      vertices: i
    });
  }, s = (i) => {
    console.log("onInputHandler", i), j.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: X.Star,
      viewId: l.viewId,
      innerVerticeStep: i
    });
  }, a = (i) => {
    console.log("onInputHandler", i), j.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: X.Star,
      viewId: l.viewId,
      innerRatio: i
    });
  };
  return h.createElement(
    h.Fragment,
    null,
    h.createElement(fc, { value: d, icon: "polygon-vertex", min: 3, max: 100, step: 1, onInputHandler: b }),
    h.createElement(fc, { value: e, icon: "star-innerVertex", min: 1, max: 100, step: 1, onInputHandler: s }),
    h.createElement(V0, { value: c, icon: "star-innerRatio", min: 0.1, max: 1, step: 0.1, onInputHandler: a })
  );
}, N0 = (t) => {
  const { maranger: l, vertices: c } = t, e = (d) => {
    j.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: X.Polygon,
      viewId: l.viewId,
      vertices: d
    });
  };
  return h.createElement(fc, { value: c, icon: "polygon-vertex", min: 3, max: 100, step: 1, onInputHandler: e });
}, M0 = (t) => {
  const { maranger: l, placement: c } = t, e = (d) => {
    console.log("onChangeHandler-SpeechBalloonFormView", d), j.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: X.SpeechBalloon,
      viewId: l.viewId,
      placement: d
    });
  };
  return h.createElement(L0, { value: c, icon: "speechBallon-placement", onChangeHandler: e });
}, Kc = (t) => {
  const { icon: l, isActive: c, onClickHandler: e, onTouchEndHandler: d } = t;
  return h.createElement(
    "div",
    { className: `button tab-button ${c ? "active" : ""}`, onClick: e, onTouchEnd: d },
    h.createElement("img", { src: ml(l) })
  );
}, T0 = (t) => {
  const { toolsTypes: l, style: c, maranger: e, shapeOpt: d } = t, [b, s] = A();
  bl(() => {
    l.includes(X.Polygon) ? s(X.Polygon) : l.includes(X.Star) ? s(X.Star) : s(X.SpeechBalloon);
  }, [l]);
  const a = (o, m) => {
    m == null || m.preventDefault(), m == null || m.stopPropagation(), s(o);
  }, i = O(() => b === X.Polygon && e && d.vertices ? h.createElement(N0, { vertices: d.vertices, maranger: e }) : null, [e, b, d]), n = O(() => b === X.Star && e && d.vertices && d.innerVerticeStep && d.innerRatio ? h.createElement(R0, { maranger: e, vertices: d.vertices, innerVerticeStep: d.innerVerticeStep, innerRatio: d.innerRatio }) : null, [e, b, d]), Z = O(() => b === X.SpeechBalloon && e && d.placement ? h.createElement(M0, { maranger: e, placement: d.placement }) : null, [e, b, d]);
  return h.createElement(
    "div",
    { className: "shapeOpt-sub-menu", style: c, onClick: (o) => {
      o.stopPropagation(), o.nativeEvent.stopImmediatePropagation(), o == null || o.preventDefault();
    } },
    h.createElement(
      "div",
      { className: "shapeOpt-sub-menu-tabs" },
      l.includes(X.Polygon) && h.createElement(Kc, { isActive: b === X.Polygon, icon: b === X.Polygon ? "polygon-active" : "polygon", onClickHandler: a.bind(void 0, X.Polygon), onTouchEndHandler: a.bind(void 0, X.Polygon) }) || null,
      l.includes(X.Star) && h.createElement(Kc, { isActive: b === X.Star, icon: b === X.Star ? "star-active" : "star", onClickHandler: a.bind(void 0, X.Star), onTouchEndHandler: a.bind(void 0, X.Star) }) || null,
      l.includes(X.SpeechBalloon) && h.createElement(Kc, { isActive: b === X.SpeechBalloon, icon: b === X.SpeechBalloon ? "speechBallon-active" : "speechBallon", onClickHandler: a.bind(void 0, X.SpeechBalloon), onTouchEndHandler: a.bind(void 0, X.SpeechBalloon) }) || null
    ),
    h.createElement(
      "div",
      { className: "shapeOpt-sub-menu-content" },
      i,
      n,
      Z
    )
  );
}, S0 = (t) => {
  const { open: l, setOpen: c, floatBarRef: e, toolsTypes: d, shapeOpt: b } = t, { floatBarData: s, maranger: a, position: i } = Gl(nl), [n, Z] = A([]), [o, m] = A(), G = O(() => {
    if (e != null && e.current && i && (a != null && a.height)) {
      if (e.current.offsetTop && e.current.offsetTop + i.y > 200) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      } else if (!e.current.offsetTop && (a == null ? void 0 : a.height) - e.current.offsetTop - i.y < 140) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      }
    }
  }, [e, i, a]), p = O(() => l && d && a && b ? (a.control.room && !a.control.room.disableDeviceInputs && (m(a.control.room.disableDeviceInputs), a.control.room.disableDeviceInputs = !0), h.createElement(T0, { shapeOpt: b, style: G, toolsTypes: d, maranger: a })) : (a != null && a.control.room && Vl(o) && (a.control.room.disableDeviceInputs = o, console.log("showSubBtn---false---001", l)), null), [l, G, d, a, b]), W = (u) => {
    u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
  }, r = (u) => {
    u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), c(!l);
  };
  return bl(() => {
    ol(s == null ? void 0 : s.selectIds, n) || s != null && s.selectIds && !ol(s == null ? void 0 : s.selectIds, n) && (Z(s == null ? void 0 : s.selectIds), c(!1));
  }, [l, s, n, c]), bl(() => () => {
    l && a != null && a.control.room && Vl(o) && (a.control.room.disableDeviceInputs = o, console.log("showSubBtn---false---002", l));
  }, [l, a, o]), h.createElement(
    "div",
    { className: `button normal-button ${l && "active"}`, onClick: W, onTouchEnd: r },
    p,
    h.createElement("img", { alt: "icon", src: ml(l ? "shapes-active" : "shapes") })
  );
};
var tl;
(function(t) {
  t[t.none = 0] = "none", t[t.Layer = 1] = "Layer", t[t.StrokeColor = 2] = "StrokeColor", t[t.FillColor = 3] = "FillColor", t[t.TextColor = 4] = "TextColor", t[t.TextBgColor = 5] = "TextBgColor", t[t.FontStyle = 6] = "FontStyle", t[t.FontSize = 7] = "FontSize", t[t.ShapeOpt = 8] = "ShapeOpt";
})(tl || (tl = {}));
const jt = h.memo((t) => {
  const { textOpt: l, workIds: c, noLayer: e, position: d } = t, { floatBarData: b, maranger: s } = Gl(nl), [a, i] = h.useState(tl.none), n = Ol(null), Z = O(() => {
    var N, T, I;
    const y = {}, L = (b == null ? void 0 : b.w) || ((N = l == null ? void 0 : l.boxSize) == null ? void 0 : N[0]) || 0, Y = (b == null ? void 0 : b.h) || ((T = l == null ? void 0 : l.boxSize) == null ? void 0 : T[1]) || 0;
    if (d && L && Y && (s != null && s.width) && (s != null && s.height)) {
      if (d.y < 60 && (d.y + L < s.height - 60 ? y.bottom = -120 : d.y + Y < s.height ? y.bottom = -58 : d.y > 0 ? y.top = 62 : y.top = -d.y + 62), d.x < 0)
        y.left = -d.x + 3;
      else if (d.x + (((I = n.current) == null ? void 0 : I.offsetWidth) || L) > s.width) {
        const C = L + d.x - s.width;
        y.left = "initial", y.right = C;
      }
      return y;
    }
  }, [n, d, b == null ? void 0 : b.w, b == null ? void 0 : b.h, s == null ? void 0 : s.width, s == null ? void 0 : s.height, l == null ? void 0 : l.boxSize]), o = O(() => b != null && b.fillColor ? h.createElement(o0, { floatBarRef: n, open: a === tl.FillColor, setOpen: (y) => {
    i(y === !0 ? tl.FillColor : tl.none);
  } }) : null, [b == null ? void 0 : b.fillColor, a, n]), m = O(() => b != null && b.strokeColor ? h.createElement(Z0, { floatBarRef: n, open: a === tl.StrokeColor, setOpen: (y) => {
    i(y === !0 ? tl.StrokeColor : tl.none);
  } }) : null, [b == null ? void 0 : b.strokeColor, a, n]), G = O(() => l != null && l.fontColor && (s != null && s.viewId) ? h.createElement(m0, { floatBarRef: n, open: a === tl.TextColor, setOpen: (y) => {
    i(y === !0 ? tl.TextColor : tl.none);
  }, textOpt: l, workIds: c }) : null, [l, a, c, s, n]), p = O(() => l && (s != null && s.viewId) ? h.createElement(y0, { open: a === tl.FontStyle, setOpen: (y) => {
    i(y === !0 ? tl.FontStyle : tl.none);
  }, textOpt: l, workIds: c, style: Z }) : null, [l, a, c, s, Z]), W = O(() => l && (s != null && s.viewId) ? h.createElement(X0, { open: a === tl.FontSize, setOpen: (y) => {
    i(y === !0 ? tl.FontSize : tl.none);
  }, textOpt: l, workIds: c, floatBarRef: n }) : null, [l, a, c, s, n]), r = O(() => e ? null : h.createElement(i0, { open: a === tl.Layer, setOpen: (y) => {
    i(y === !0 ? tl.Layer : tl.none);
  }, floatBarRef: n }), [e, a, n]), u = O(() => b != null && b.canLock && s ? h.createElement(r0, { workIds: c, maranger: s, islocked: b.isLocked }) : null, [b, s, c]), V = O(() => s && (s != null && s.viewId) && Z && (b != null && b.shapeOpt) && (b != null && b.toolsTypes) ? h.createElement(S0, { open: a === tl.ShapeOpt, setOpen: (y) => {
    i(y === !0 ? tl.ShapeOpt : tl.none);
  }, floatBarRef: n, workIds: c, toolsTypes: b.toolsTypes, shapeOpt: b.shapeOpt }) : null, [b, s, a, Z, c, n]);
  return h.createElement(
    "div",
    { className: "bezier-pencil-plugin-floatbtns", style: Z, ref: n },
    s && h.createElement(s0, { workIds: c, maranger: s }),
    r,
    u,
    !!(s != null && s.viewId) && h.createElement(a0, { workIds: c, viewId: s.viewId }),
    V,
    W,
    p,
    G,
    m,
    o
  );
}), z0 = (t) => {
  const { data: l, isActive: c, manager: e, workId: d } = t, { opt: b, scale: s, translate: a, x: i, y: n } = l, Z = `scale(${s || 1}) ${a && "translate(" + a[0] + "px," + a[1] + "px)" || ""}`, { fontSize: o, fontFamily: m, underline: G, fontColor: p, lineThrough: W, textAlign: r, strokeColor: u, lineHeight: V, bold: y, italic: L, uid: Y } = b, N = o, T = V || N * 1.2, I = {
    fontSize: `${N}px`,
    lineHeight: `${T}px`,
    color: p,
    borderColor: u,
    minHeight: `${T}px`
  };
  m && (I.fontFamily = `${m}`), (W || G) && (I.textDecoration = `${W && "line-through" || ""}${G && " underline" || ""}`), y && (I.fontWeight = `${y}`), L && (I.fontStyle = `${L}`), r && (I.textAlign = `${r}`);
  let C = "";
  b != null && b.text && (C = b.text.split(",").reduce((g, P, _) => {
    const $ = P === "" ? "<br/>" : P;
    return _ === 0 ? $ : `${g}<div>${$}</div>`;
  }, ""));
  function K() {
    var v, g;
    console.log("onServiceDerive---handleClick", c, Y, (v = e.control.collector) == null ? void 0 : v.uid), c && (Y && Y === ((g = e.control.collector) == null ? void 0 : g.uid) || !Y) && e.control.textEditorManager.active(d);
  }
  return h.createElement(
    "div",
    { className: "editor-box", style: {
      left: `${i}px`,
      top: `${n}px`,
      transform: Z,
      transformOrigin: "left top",
      pointerEvents: "none"
    } },
    h.createElement("div", {
      className: `editor ${c ? "" : "readOnly"}`,
      // className={`editor ${(workState !== EvevtWorkState.Start && workState !== EvevtWorkState.Doing) ? 'readOnly' : ''}`}
      style: I,
      dangerouslySetInnerHTML: { __html: C },
      onClick: K
    })
  );
}, I0 = h.memo((t) => {
  const { data: l, position: c, workId: e, selectIds: d, updateOptInfo: b } = t, [s, a] = A([0, 0]), { opt: i, scale: n, translate: Z, x: o, y: m } = l, G = Ol(null);
  bl(() => {
    yl(o) && yl(m) && a([o - ((c == null ? void 0 : c.x) || 0), m - ((c == null ? void 0 : c.y) || 0)]);
  }, [o, m, d, e]), bl(() => {
    var P, _;
    if ((P = G.current) != null && P.offsetWidth && ((_ = G.current) != null && _.offsetHeight)) {
      const $ = i.boxSize;
      (($ == null ? void 0 : $[0]) !== G.current.offsetWidth || $[1] !== G.current.offsetHeight || !$) && (console.log("updateForViewEdited---1--0", e, $, [G.current.offsetWidth, G.current.offsetHeight]), b({
        activeTextId: e,
        update: {
          boxSize: [G.current.offsetWidth, G.current.offsetHeight],
          workState: x.Done
        },
        syncData: {
          canSync: !0,
          canWorker: !0
        }
      }));
    }
  }, [i.fontSize]);
  const p = `scale(${n || 1}) ${Z && "translate(" + Z[0] + "px," + Z[1] + "px)" || ""}`, { fontSize: W, fontFamily: r, underline: u, fontColor: V, lineThrough: y, textAlign: L, strokeColor: Y, lineHeight: N, bold: T, italic: I } = i, C = W, K = N || C * 1.2, v = {
    fontSize: `${C}px`,
    lineHeight: `${K}px`,
    color: V,
    borderColor: Y,
    minHeight: `${K}px`,
    pointerEvents: "none"
  };
  r && (v.fontFamily = `${r}`), (y || u) && (v.textDecoration = `${y && "line-through" || ""}${u && " underline" || ""}`), L && (v.textAlign = `${L}`), T && (v.fontWeight = `${T}`), I && (v.fontStyle = `${I}`);
  let g = "";
  return i != null && i.text && (g = i.text.split(",").reduce((_, $, q) => {
    const D = $ === "" ? "<br/>" : $;
    return q === 0 ? D : `${_}<div>${D}</div>`;
  }, "")), h.createElement(
    "div",
    { className: "editor-box", style: {
      left: `${s[0]}px`,
      top: `${s[1]}px`,
      transform: p,
      transformOrigin: "left top",
      zIndex: 1,
      pointerEvents: "none"
    } },
    h.createElement("div", { className: "editor readOnly", ref: G, style: v, dangerouslySetInnerHTML: { __html: g } })
  );
}), v0 = (t) => {
  const { data: l, workId: c, isSelect: e, handleKeyUp: d, handleFocus: b, updateOptInfo: s, showFloatBtns: a, manager: i } = t, [n, Z] = A(), { opt: o, scale: m, translate: G, x: p, y: W } = l, [r, u] = A(""), V = Ol(null);
  bl(() => {
    let U = "";
    o != null && o.text && (U = o.text.split(",").reduce((f, il, hl) => {
      const Nl = il === "" ? "<br/>" : il;
      return hl === 0 ? Nl : `${f}<div>${Nl}</div>`;
    }, "")), u(U), Promise.resolve().then(() => {
      V.current && V.current.click();
    });
  }, []), bl(() => {
    var U, H;
    (U = V.current) != null && U.offsetWidth && ((H = V.current) != null && H.offsetHeight) && s({
      activeTextId: c,
      update: {
        boxSize: [V.current.offsetWidth, V.current.offsetHeight],
        workState: x.Doing
      }
    });
  });
  const y = `scale(${m || 1}) ${G && "translate(" + G[0] + "px," + G[1] + "px)" || ""}`, { fontSize: L, fontFamily: Y, underline: N, fontColor: T, lineThrough: I, textAlign: C, strokeColor: K, lineHeight: v, bold: g, italic: P } = o, _ = L, $ = v || _ * 1.2, q = {
    transform: y,
    transformOrigin: "left top",
    fontSize: `${_}px`,
    lineHeight: `${$}px`,
    color: T,
    borderColor: K,
    minHeight: `${$}px`
  };
  Y && (q.fontFamily = `${Y}`), (I || N) && (q.textDecoration = `${I && "line-through" || ""} ${N && " underline" || ""}`), C && (q.textAlign = `${C}`), g && (q.fontWeight = `${g}`), P && (q.fontStyle = `${P}`);
  function D() {
    var U;
    if (V.current) {
      V.current.focus();
      const H = window == null ? void 0 : window.getSelection(), f = V.current.lastChild;
      if (H && f) {
        const il = document.createRange(), hl = ((U = f.textContent) == null ? void 0 : U.length) || 0;
        (f == null ? void 0 : f.nodeName) === "#text" ? il.setStart(f, hl) : il.setStart(f, hl && 1 || 0), il.collapse(!0), H.removeAllRanges(), H.addRange(il);
      }
    }
  }
  function B(U) {
    if (U.key === "Backspace") {
      const H = window.getSelection(), f = H == null ? void 0 : H.getRangeAt(0);
      if (f != null && f.collapsed)
        return U.preventDefault(), document.execCommand("delete", !1), !1;
    }
    return !1;
  }
  function k(U) {
    var H, f;
    if (U.preventDefault(), V.current) {
      let il = (U.clipboardData || window.clipboardData).getData("text");
      il = il.toUpperCase();
      const hl = window == null ? void 0 : window.getSelection();
      if (!(hl != null && hl.rangeCount))
        return;
      const Nl = il.split(/\n/);
      if (hl && Nl.length) {
        hl.deleteFromDocument();
        const Jl = document.createRange();
        let pl = V.current.lastChild;
        if (!pl) {
          const kl = document.createTextNode(Nl[0]);
          if (V.current.appendChild(kl), Nl.length === 1) {
            const Zc = ((H = kl.textContent) == null ? void 0 : H.length) || 0;
            Jl.setStart(kl, Zc), Jl.collapse(!0), hl.removeAllRanges(), hl.addRange(Jl);
            return;
          }
        }
        if ((pl == null ? void 0 : pl.nodeName) === "#text" && (pl.textContent = pl.textContent + Nl[0], Nl.length === 1)) {
          const kl = ((f = pl.textContent) == null ? void 0 : f.length) || 0;
          Jl.setStart(pl, kl), Jl.collapse(!0), hl.removeAllRanges(), hl.addRange(Jl);
          return;
        }
        (pl == null ? void 0 : pl.nodeName) === "DIV" && (pl.innerText = pl.innerText + Nl[0]);
        for (let kl = 1; kl < Nl.length; kl++) {
          const Zc = Nl[kl];
          if (Zc) {
            const ie = document.createElement("div");
            ie.innerText = Zc, V.current.appendChild(ie);
          }
        }
        pl = V.current.lastChild, pl && Jl.setStart(pl, 1), Jl.collapse(!0), hl.removeAllRanges(), hl.addRange(Jl);
      }
    }
  }
  return h.createElement(
    "div",
    { className: "editor-box", style: {
      left: `${p}px`,
      top: `${W}px`,
      zIndex: 2,
      pointerEvents: "none"
    }, onFocus: () => {
      i.control.room && !i.control.room.disableDeviceInputs && (Z(i.control.room.disableDeviceInputs), i.control.room.disableDeviceInputs = !0);
    }, onBlur: () => {
      i != null && i.control.room && Vl(n) && (i.control.room.disableDeviceInputs = n);
    }, onKeyDown: (U) => (U.stopPropagation(), !0), onMouseMove: (U) => (U.stopPropagation(), U.preventDefault(), !0) },
    !e && a && h.createElement(jt, { textOpt: o, workIds: [c], noLayer: !0, position: { x: p, y: W } }),
    h.createElement("div", { id: c, contentEditable: !0, className: "editor", ref: V, style: q, dangerouslySetInnerHTML: { __html: r }, onKeyDown: B, onKeyUp: d, onClick: D, onTouchEnd: D, onFocus: b, onPaste: k })
  );
};
class Pt extends h.Component {
  constructor(l) {
    super(l);
  }
  getInnerText(l) {
    const c = [];
    for (let e = 0; e < l.childNodes.length; e++) {
      const d = l.childNodes[e];
      if (d.nodeName === "#text" && e === 0) {
        const b = d.textContent.split(/\n/), s = b.pop();
        c.push(...b), s && c.push(s);
      } else if (d.nodeName === "DIV") {
        const b = d.innerText.split(/\n/);
        if (b.length === 2 && b[0] === "" && b[1] === "")
          c.push("");
        else {
          const s = b.shift();
          s && c.push(s);
          const a = b.pop();
          c.push(...b), a && c.push(a);
        }
      }
    }
    return c;
  }
  updateOptInfo(l) {
    var s, a;
    const { activeTextId: c, update: e, syncData: d } = l, b = c && sl(((s = this.props.manager.control.textEditorManager) == null ? void 0 : s.get(c)) || ((a = this.props.editors) == null ? void 0 : a.get(c)));
    b && b.opt && (b.opt = {
      ...b.opt,
      ...e
    }, d && (b.canSync = d.canSync, b.canWorker = d.canWorker), this.props.manager.control.textEditorManager.updateForViewEdited(c, b));
  }
  get editorUI() {
    var l;
    if ((l = this.props.editors) != null && l.size) {
      const c = [];
      return this.props.editors.forEach((e, d) => {
        if (this.props.selectIds.includes(d) && !(this.props.activeTextId == d)) {
          const s = h.createElement(I0, { key: d, data: e, workId: d, isSelect: !0, position: this.props.position, selectIds: this.props.selectIds, updateOptInfo: this.updateOptInfo.bind(this), manager: this.props.manager });
          c.push(s);
        }
      }), c;
    }
    return null;
  }
  render() {
    return h.createElement("div", { ref: this.props.textRef }, this.editorUI);
  }
}
class H0 extends Pt {
  constructor(l) {
    super(l);
  }
  handleKeyUp(l) {
    const c = this.getInnerText(l.nativeEvent.target), e = this.props.activeTextId;
    e && this.updateOptInfo({
      activeTextId: e,
      update: {
        text: c.toString(),
        boxSize: [l.nativeEvent.target.offsetWidth, l.nativeEvent.target.offsetHeight],
        workState: x.Doing
      },
      syncData: {
        canSync: !0,
        canWorker: !0
      }
    });
  }
  handleFocus(l) {
    const c = this.props.activeTextId;
    c && this.updateOptInfo({
      activeTextId: c,
      update: {
        boxSize: [l.nativeEvent.target.offsetWidth, l.nativeEvent.target.offsetHeight],
        workState: x.Doing
      },
      syncData: {
        canSync: !0,
        canWorker: !0
      }
    });
  }
  get editorUI() {
    var l;
    if ((l = this.props.editors) != null && l.size) {
      const c = [];
      return this.props.editors.forEach((e, d) => {
        if (!(this.props.selectIds.includes(d) && this.props.activeTextId !== d)) {
          const a = this.props.activeTextId == d ? h.createElement(v0, { key: d, data: e, workId: d, showFloatBtns: this.props.showFloatBtns || !1, handleFocus: this.handleFocus.bind(this), handleKeyUp: this.handleKeyUp.bind(this), updateOptInfo: this.updateOptInfo.bind(this), manager: this.props.manager }) : h.createElement(z0, { manager: this.props.manager, isActive: e.opt.workState === x.Doing || e.opt.workState === x.Start || !1, key: d, data: e, workId: d });
          c.push(a);
        }
      }), c;
    }
    return null;
  }
  render() {
    return h.createElement("div", { className: `${this.props.className}` }, this.editorUI);
  }
}
const J0 = () => {
  const { floatBarData: t } = Gl(nl);
  return h.createElement(
    "div",
    { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: t == null ? void 0 : t.selectorColor } },
    h.createElement("div", { className: "point LT nwse-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point LC ew-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point LB nesw-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point TC ns-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point RT nesw-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point RC ew-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point RB nwse-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point BC ns-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } })
  );
}, k0 = () => {
  const { floatBarData: t } = Gl(nl);
  return h.createElement("div", { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: t == null ? void 0 : t.selectorColor } });
}, C0 = () => {
  const { floatBarData: t } = Gl(nl);
  return h.createElement(
    "div",
    { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: t == null ? void 0 : t.selectorColor } },
    h.createElement("div", { className: "point LT nwse-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point LB nesw-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point RT nesw-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } }),
    h.createElement("div", { className: "point RB nwse-resize", style: { backgroundColor: t == null ? void 0 : t.selectorColor } })
  );
}, K0 = () => {
  const { floatBarData: t } = Gl(nl);
  return h.createElement(
    "div",
    { className: "bezier-pencil-plugin-hightlight-box", style: {
      borderColor: t == null ? void 0 : t.selectorColor
    } },
    h.createElement("img", { className: "lock", alt: "lock", src: "https://sdk.netless.link/resource/icons/lock.svg" })
  );
}, w0 = h.forwardRef((t, l) => {
  const { floatBarData: c, zIndex: e, position: d, angle: b, operationType: s, setPosition: a, setOperationType: i, maranger: n } = Gl(nl), { className: Z, editors: o, activeTextId: m } = t, G = Ol(null), [p, W] = A(x.Pending), [r, u] = A(), V = (K) => {
    K.preventDefault(), K.stopPropagation(), i(R.TranslateNode), W(x.Start), u(d), n != null && n.control.room && (n.control.room.disableDeviceInputs = !0), j.emitMethod(F.MainEngine, R.TranslateNode, { workIds: [z], position: d, workState: x.Start, viewId: n == null ? void 0 : n.viewId });
  }, y = al((K, v) => {
    K.preventDefault(), K.stopPropagation();
    const g = { x: v.x, y: v.y };
    a(g), i(R.None), W(x.Done), n != null && n.control.room && (n.control.room.disableDeviceInputs = !1), console.log("onDragEndHandler"), j.emitMethod(F.MainEngine, R.TranslateNode, { workIds: [z], position: g, workState: x.Done, viewId: n == null ? void 0 : n.viewId });
  }, 100, { leading: !1 }), L = al((K, v) => {
    K.preventDefault(), K.stopPropagation();
    const g = { x: v.x, y: v.y };
    (v.x !== (d == null ? void 0 : d.x) || v.y !== (d == null ? void 0 : d.y)) && (a(g), W(x.Doing), j.emitMethod(F.MainEngine, R.TranslateNode, { workIds: [z], position: g, workState: x.Doing, viewId: n == null ? void 0 : n.viewId }));
  }, 100, { leading: !1 }), Y = O(() => (c == null ? void 0 : c.scaleType) !== rl.all || s === R.RotateNode ? null : h.createElement(J0, null), [c, s]), N = O(() => (c == null ? void 0 : c.scaleType) !== rl.both || s === R.RotateNode ? null : h.createElement(k0, null), [c, s]), T = O(() => (c == null ? void 0 : c.scaleType) !== rl.proportional || s === R.RotateNode ? null : h.createElement(C0, null), [c, s]), I = O(() => (c == null ? void 0 : c.scaleType) === rl.none && (c != null && c.canLock) ? h.createElement(K0, null) : null, [c]), C = O(() => {
    const K = (c == null ? void 0 : c.selectIds) || [];
    return o && n && K ? h.createElement(Pt, { manager: n, textRef: G, selectIds: K, position: d, activeTextId: m, editors: o }) : null;
  }, [c == null ? void 0 : c.selectIds, o, n, m]);
  return h.createElement(
    ic,
    { disabled: !!(c != null && c.isLocked), position: d, onStart: V, onDrag: L, onStop: y, handle: "canvas" },
    h.createElement(
      "div",
      {
        className: `${Z}`,
        style: c ? {
          width: c.w,
          height: c.h,
          zIndex: e,
          pointerEvents: e < 2 || I ? "none" : "auto"
        } : void 0,
        // onMouseMove={(e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        // }}
        onClick: al((K) => {
          if (K.stopPropagation(), K.preventDefault(), n && (o != null && o.size) && G.current && ol(r, d)) {
            const v = n.getPoint(K.nativeEvent);
            v && n.control.textEditorManager.computeTextActive(v, n.viewId);
          }
          return !1;
        }, 100, { leading: !1 }),
        onTouchEndCapture: al((K) => {
          if (K.stopPropagation(), K.preventDefault(), n && (o != null && o.size) && G.current && p !== x.Doing) {
            const v = n.getPoint(K.nativeEvent);
            v && n.control.textEditorManager.computeTextActive(v, n.viewId);
          }
          return !1;
        }, 100, { leading: !1 })
      },
      h.createElement(
        "div",
        { className: "bezier-pencil-plugin-floatCanvas-box", style: {
          width: "100%",
          height: "100%",
          transform: `rotate(${b}deg)`
        } },
        h.createElement("canvas", { ref: l, className: "bezier-pencil-plugin-floatCanvas" })
      ),
      I,
      Y,
      N,
      T,
      C
    )
  );
}), g0 = h.memo(w0, (t, l) => ol(t, l) ? !0 : (console.log("FloatBar-----isEqual", !1), !1)), F0 = (t) => {
  const { floatBarData: l, position: c, operationType: e } = Gl(nl), { className: d } = t;
  return e === R.None ? h.createElement(
    "div",
    { className: `${d}`, style: l ? {
      left: c == null ? void 0 : c.x,
      top: c == null ? void 0 : c.y,
      width: l.w,
      height: l.h
    } : void 0 },
    h.createElement(jt, { textOpt: l == null ? void 0 : l.textOpt, position: c, noLayer: l == null ? void 0 : l.isLocked })
  ) : null;
}, U0 = (t) => {
  const { className: l } = t, { floatBarData: c, angle: e, setAngle: d, position: b, setOperationType: s, maranger: a } = Gl(nl), [i, n] = A(!1), [Z, o] = A(new dl()), [m, G] = A(new dl());
  bl(() => {
    if (c) {
      const u = Math.floor(c.w / 2), V = Math.floor(-c.h / 2);
      G(new dl(u, V)), o(new dl());
    }
  }, [c, b]);
  const p = (u, V) => {
    u.preventDefault(), u.stopPropagation(), n(!0);
    const y = Math.round(dl.GetAngleByPoints(Z, m, new dl(V.x, V.y))) || 0;
    d(y), s(R.RotateNode), a != null && a.control.room && (a.control.room.disableDeviceInputs = !0), j.emitMethod(F.MainEngine, R.RotateNode, { workIds: [z], angle: y, workState: x.Start, viewId: a == null ? void 0 : a.viewId });
  }, W = al((u, V) => {
    u.preventDefault(), u.stopPropagation(), n(!1);
    const y = Math.round(dl.GetAngleByPoints(Z, m, new dl(V.x, V.y))) || 0;
    d(y), s(R.None), a != null && a.control.room && (a.control.room.disableDeviceInputs = !1), j.emitMethod(F.MainEngine, R.RotateNode, { workIds: [z], angle: y, workState: x.Done, viewId: a == null ? void 0 : a.viewId });
  }, 100, { leading: !1 }), r = al((u, V) => {
    u.preventDefault(), u.stopPropagation(), n(!0);
    const y = Math.round(dl.GetAngleByPoints(Z, m, new dl(V.x, V.y))) || 0;
    d(y), s(R.RotateNode), j.emitMethod(F.MainEngine, R.RotateNode, { workIds: [z], angle: y, workState: x.Doing, viewId: a == null ? void 0 : a.viewId });
  }, 100, { leading: !1 });
  return h.createElement(
    ic,
    { handle: ".bezier-pencil-plugin-rotate-mouse-pointer", onStart: p, onDrag: r, onStop: W },
    h.createElement(
      "div",
      { className: `${l}`, style: b && c ? {
        left: b.x - 30,
        top: b.y + c.h + 20
      } : void 0 },
      !i && h.createElement(
        "div",
        { className: "bezier-pencil-plugin-rotate-btn", style: { backgroundColor: c == null ? void 0 : c.selectorColor } },
        h.createElement("img", { alt: "icon", src: ml("rotation-button") })
      ),
      h.createElement(
        "div",
        { className: `bezier-pencil-plugin-rotate-mouse-pointer ${i ? "active" : ""}` },
        h.createElement("img", { alt: "icon", src: ml("rotation") }),
        h.createElement(
          "div",
          { className: "angle-icon" },
          e,
          "°"
        )
      )
    )
  );
}, j0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAYISURBVHgB7ZpNSCtXFIBPEuvz+dMGpYUKD/sWFX+Qti6kK7Hqpm6e9q0rIoIUFUShPLV10VZx4+JZqa9v20LBhdq9fyBUCtKNPH8qYl2IOw3G38Rkek4y15y5uTOZJDOWggcOSSYzN/ebc+45554JwIM8iBCPyTEP+86T4vyMfsRN4b+nQTKIJp0vzuGvlpID7os8EQNEIBD4oKio6Bm9DwaDv/v9/n/076JgbtWUYPchwrW8qD7UnOvr6wFNkpubm+/wu7f0c7y6mrnlvQufxB0Iau7V1dX3BDA/P6/V1dVpzc3N2uLiIofK1c8VYHys/wRKBUN3/hGHqaysNOjc3FwMis6hc0FtLTHuvYLxCCZgci8uLn4wg5Gh6Fy8Jk+/NkcCAlAAuUkoW4g0B+d5tLS05O/r67O8eGxsDNra2uDy8nKsoKCAwCIQDxQa0yTxgrvCYXyTk5Ml+Orf2dlJeeHIyAigFSE/P38ELfUNqNdSkjgF5FF89jL1TU1NlQwODl5gZPujp6cHWltbUw7Koc7Pz8mkZpHPFeFrJuZeqLnoMoPoZqe0JjDP/IZgnyLUG/o8NDRkuo5Ua2pjY6MC4oFCFf1cA0oKzRSOp6enRfTaGh0d/QxBt+1CUVgnOTs7+xrHfQzGyOcKkK3QTJMnQffZ6e/v/xwttmsHqqmpKXbdycnJCxy7ABLh3FEgVZ6hZJhnFZoFFMF0d3c/w7v+dyookXBnZ2c/xvHfhriVcvXfdBRItsxjnOhYqjwjoAimq6vrCysoGofk+Ph4Esd/F/UdiFtJAGUd2DygTpp5dmBUUJ2dnc9VUALm8PDwJY7/BPU9VD8k3M4RC6kskxZMKigKIMLN9vf3p3H8DyWgfEhEOwOQD9IXOTz7EObbwsLC4YWFBRgeHrY9ECXYo6MjaGlpKWlsbPxkYGDgRW1tbSEWquVlZWXBzc3Nl1VVVa8hXiXc6ioqBqGaPDk7AACJTRZ3NS9lcUp86cJwoSQ7Pj4Op6enfxUXF3/V0NCQv7q6GsCvwrqGUG/01xAD4+VQTOxaSF43d5bBOisrGBJRCtXX17+/trb268rKSgASFgmz97KFkmo6OztWuVyPweiWGc4WRkhFRQVEIpHg8vJyQAIQVlLBROVxvBYQHsXnO8tk62ZcyN0wecLBwcEvYHSzEPscBqOLCRhLC4n9uqaA8UAWAcAKhtbQ3t7eTHl5+Y9gtAp3twhT056CDMQ7MRzIFTeTYKb1yYYVQFH9VdzsqNmYKpfTJBDX3Ixgdnd3XyHMT2AMALJlBBSPaMpNngrIsTyTCgaj288YDGakictrxizvKFNOjgSSBLS+vv6UYHDb7DgMVgsChjTEgCIKGG4ZU+EWkgNBzN1qamq+pAMTExPgFMzW1tZrhHkFyWE5KxgSszx0527RaDRmOSpRshEOU11dPQPG8CwHARHJlMnTSrwSRFIlfXt7m3V5ngJGuJtqzaQtZkFBVNJezN5ZAdmwjKo2k9tVtrcI3OXk4tPgcg7ChCDZ1URgMOu72Xa5VFHOkymQhWVU60YVmjN6wiC7k6p+S1syCACOwJBYFaexV+yhBekNPsMBO6KAEeE4BMaCU67RsoYhSbXgaT//ht709vZCaWmp6YkEbLFmVJWzas04+iBL7EKpm0J7duqu0B7+CTUpNJuyvb1NCfMj1CqI9wLKUOlOUMeG+gGFkHii4HizUF4z/KFUrPsJ8WbEIyx7nnZ0dDynME6BAuce09iFHo+GrnmGltltb2//E4wVAN82y7vOjKOZXSBhJdHNiT3TYWD8OY2PTUJkdd7MkJMnT5wZVQF2RFX6yBMUdzPMvvfqxz3sXHF+GNT9ANXit/10O1sgHkZvdQAOKvs9B5L7ARELGAAXLSTvM8QExTE+YbHe+HURhZp1aRyF4CJXClbbWwGketgkW9VsY+YaiBCVhfgE+XvxRwgZSM4jUVCDZFQ9pytmXR8hUTB2gnidx4XffVWydN0yQjwmx/jkAZJBrIBI5J7ZvQGZWUgVSuU/EqmOAzicKNMVu816DdRWUV1/7xAP8n+SfwF3Du3NF2sYhwAAAABJRU5ErkJggg==", P0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='40px'%20height='40px'%20viewBox='0%200%2040%2040'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3c!--%20Generator:%20Sketch%2060.1%20(88133)%20-%20https://sketch.com%20--%3e%3ctitle%3eshape-cursor%3c/title%3e%3cdesc%3eCreated%20with%20Sketch.%3c/desc%3e%3cdefs%3e%3cpath%20d='M20,21.5%20C20.2454599,21.5%2020.4496084,21.6768752%2020.4919443,21.9101244%20L20.5,22%20L20.5,27%20C20.5,27.2761424%2020.2761424,27.5%2020,27.5%20C19.7545401,27.5%2019.5503916,27.3231248%2019.5080557,27.0898756%20L19.5,27%20L19.5,22%20C19.5,21.7238576%2019.7238576,21.5%2020,21.5%20Z%20M27,19.5%20C27.2761424,19.5%2027.5,19.7238576%2027.5,20%20C27.5,20.2454599%2027.3231248,20.4496084%2027.0898756,20.4919443%20L27,20.5%20L22,20.5%20C21.7238576,20.5%2021.5,20.2761424%2021.5,20%20C21.5,19.7545401%2021.6768752,19.5503916%2021.9101244,19.5080557%20L22,19.5%20L27,19.5%20Z%20M18,19.5%20C18.2761424,19.5%2018.5,19.7238576%2018.5,20%20C18.5,20.2454599%2018.3231248,20.4496084%2018.0898756,20.4919443%20L18,20.5%20L13,20.5%20C12.7238576,20.5%2012.5,20.2761424%2012.5,20%20C12.5,19.7545401%2012.6768752,19.5503916%2012.9101244,19.5080557%20L13,19.5%20L18,19.5%20Z%20M20,12.5%20C20.2454599,12.5%2020.4496084,12.6768752%2020.4919443,12.9101244%20L20.5,13%20L20.5,18%20C20.5,18.2761424%2020.2761424,18.5%2020,18.5%20C19.7545401,18.5%2019.5503916,18.3231248%2019.5080557,18.0898756%20L19.5,18%20L19.5,13%20C19.5,12.7238576%2019.7238576,12.5%2020,12.5%20Z'%20id='path-1'%3e%3c/path%3e%3cfilter%20x='-64.6%25'%20y='-59.5%25'%20width='229.3%25'%20height='246.1%25'%20filterUnits='objectBoundingBox'%20id='filter-2'%3e%3cfeMorphology%20radius='1'%20operator='dilate'%20in='SourceAlpha'%20result='shadowSpreadOuter1'%3e%3c/feMorphology%3e%3cfeOffset%20dx='0'%20dy='2'%20in='shadowSpreadOuter1'%20result='shadowOffsetOuter1'%3e%3c/feOffset%3e%3cfeGaussianBlur%20stdDeviation='3'%20in='shadowOffsetOuter1'%20result='shadowBlurOuter1'%3e%3c/feGaussianBlur%3e%3cfeComposite%20in='shadowBlurOuter1'%20in2='SourceAlpha'%20operator='out'%20result='shadowBlurOuter1'%3e%3c/feComposite%3e%3cfeColorMatrix%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.16%200'%20type='matrix'%20in='shadowBlurOuter1'%3e%3c/feColorMatrix%3e%3c/filter%3e%3c/defs%3e%3cg%20id='页面-4'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cg%20id='Whiteboard-Guidelines'%20transform='translate(-344.000000,%20-751.000000)'%3e%3cg%20id='shape-cursor'%20transform='translate(344.000000,%20751.000000)'%3e%3crect%20id='矩形备份-44'%20fill='%23FFFFFF'%20opacity='0.01'%20x='0'%20y='0'%20width='40'%20height='40'%20rx='2'%3e%3c/rect%3e%3cg%20id='形状结合'%20fill-rule='nonzero'%3e%3cuse%20fill='black'%20fill-opacity='1'%20filter='url(%23filter-2)'%20xlink:href='%23path-1'%3e%3c/use%3e%3cpath%20stroke='%23FFFFFF'%20stroke-width='1'%20d='M20,21%20C20.4854103,21%2020.898085,21.3479993%2020.9899479,21.8654877%20L21,22%20L21,27%20C21,27.5522847%2020.5522847,28%2020,28%20C19.5145897,28%2019.101915,27.6520007%2019.0100521,27.1345123%20L19,27%20L19,22%20C19,21.4477153%2019.4477153,21%2020,21%20Z%20M27,19%20C27.5522847,19%2028,19.4477153%2028,20%20C28,20.4854103%2027.6520007,20.898085%2027.1345123,20.9899479%20L27,21%20L22,21%20C21.4477153,21%2021,20.5522847%2021,20%20C21,19.5145897%2021.3479993,19.101915%2021.8654877,19.0100521%20L22,19%20L27,19%20Z%20M18,19%20C18.5522847,19%2019,19.4477153%2019,20%20C19,20.4854103%2018.6520007,20.898085%2018.1345123,20.9899479%20L18,21%20L13,21%20C12.4477153,21%2012,20.5522847%2012,20%20C12,19.5145897%2012.3479993,19.101915%2012.8654877,19.0100521%20L13,19%20L18,19%20Z%20M20,12%20C20.4854103,12%2020.898085,12.3479993%2020.9899479,12.8654877%20L21,13%20L21,18%20C21,18.5522847%2020.5522847,19%2020,19%20C19.5145897,19%2019.101915,18.6520007%2019.0100521,18.1345123%20L19,18%20L19,13%20C19,12.4477153%2019.4477153,12%2020,12%20Z'%20fill='%23212324'%20fill-rule='evenodd'%3e%3c/path%3e%3c/g%3e%3crect%20id='矩形'%20fill='%23FFFFFF'%20x='18.5'%20y='17'%20width='3'%20height='6'%3e%3c/rect%3e%3crect%20id='矩形'%20fill='%23FFFFFF'%20x='17'%20y='18.5'%20width='6'%20height='3'%3e%3c/rect%3e%3cpath%20d='M20,21.5%20C20.2454599,21.5%2020.4496084,21.6768752%2020.4919443,21.9101244%20L20.5,22%20L20.5,27%20C20.5,27.2761424%2020.2761424,27.5%2020,27.5%20C19.7545401,27.5%2019.5503916,27.3231248%2019.5080557,27.0898756%20L19.5,27%20L19.5,22%20C19.5,21.7238576%2019.7238576,21.5%2020,21.5%20Z%20M27,19.5%20C27.2761424,19.5%2027.5,19.7238576%2027.5,20%20C27.5,20.2454599%2027.3231248,20.4496084%2027.0898756,20.4919443%20L27,20.5%20L22,20.5%20C21.7238576,20.5%2021.5,20.2761424%2021.5,20%20C21.5,19.7545401%2021.6768752,19.5503916%2021.9101244,19.5080557%20L22,19.5%20L27,19.5%20Z%20M18,19.5%20C18.2761424,19.5%2018.5,19.7238576%2018.5,20%20C18.5,20.2454599%2018.3231248,20.4496084%2018.0898756,20.4919443%20L18,20.5%20L13,20.5%20C12.7238576,20.5%2012.5,20.2761424%2012.5,20%20C12.5,19.7545401%2012.6768752,19.5503916%2012.9101244,19.5080557%20L13,19.5%20L18,19.5%20Z%20M20,12.5%20C20.2454599,12.5%2020.4496084,12.6768752%2020.4919443,12.9101244%20L20.5,13%20L20.5,18%20C20.5,18.2761424%2020.2761424,18.5%2020,18.5%20C19.7545401,18.5%2019.5503916,18.3231248%2019.5080557,18.0898756%20L19.5,18%20L19.5,13%20C19.5,12.7238576%2019.7238576,12.5%2020,12.5%20Z'%20id='形状结合'%20fill='%23212324'%20fill-rule='nonzero'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e", f0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='47px'%20height='40px'%20viewBox='0%200%2047%2040'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3c!--%20Generator:%20Sketch%2060.1%20(88133)%20-%20https://sketch.com%20--%3e%3ctitle%3etext-cursor%3c/title%3e%3cdesc%3eCreated%20with%20Sketch.%3c/desc%3e%3cdefs%3e%3cpath%20d='M16,26.5%20C15.7238576,26.5%2015.5,26.2761424%2015.5,26%20C15.5,25.7545401%2015.6768752,25.5503916%2015.9101244,25.5080557%20L16,25.5%20L19.5,25.5%20L19.5,14.5%20L16,14.5%20C15.7238576,14.5%2015.5,14.2761424%2015.5,14%20C15.5,13.7545401%2015.6768752,13.5503916%2015.9101244,13.5080557%20L16,13.5%20L24,13.5%20C24.2761424,13.5%2024.5,13.7238576%2024.5,14%20C24.5,14.2454599%2024.3231248,14.4496084%2024.0898756,14.4919443%20L24,14.5%20L20.5,14.5%20L20.5,25.5%20L24,25.5%20C24.2761424,25.5%2024.5,25.7238576%2024.5,26%20C24.5,26.2454599%2024.3231248,26.4496084%2024.0898756,26.4919443%20L24,26.5%20L16,26.5%20Z'%20id='path-1'%3e%3c/path%3e%3cfilter%20x='-284.0%25'%20y='-81.5%25'%20width='668.1%25'%20height='293.9%25'%20filterUnits='objectBoundingBox'%20id='filter-2'%3e%3cfeMorphology%20radius='1'%20operator='dilate'%20in='SourceAlpha'%20result='shadowSpreadOuter1'%3e%3c/feMorphology%3e%3cfeOffset%20dx='0'%20dy='2'%20in='shadowSpreadOuter1'%20result='shadowOffsetOuter1'%3e%3c/feOffset%3e%3cfeGaussianBlur%20stdDeviation='3'%20in='shadowOffsetOuter1'%20result='shadowBlurOuter1'%3e%3c/feGaussianBlur%3e%3cfeComposite%20in='shadowBlurOuter1'%20in2='SourceAlpha'%20operator='out'%20result='shadowBlurOuter1'%3e%3c/feComposite%3e%3cfeColorMatrix%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.16%200'%20type='matrix'%20in='shadowBlurOuter1'%3e%3c/feColorMatrix%3e%3c/filter%3e%3c/defs%3e%3cg%20id='页面-4'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cg%20id='Whiteboard-Guidelines'%20transform='translate(-388.000000,%20-672.000000)'%3e%3cg%20id='text-cursor'%20transform='translate(392.000000,%20672.000000)'%3e%3crect%20id='矩形备份-40'%20fill='%23FFFFFF'%20opacity='0.01'%20x='0'%20y='0'%20width='40'%20height='40'%20rx='2'%3e%3c/rect%3e%3cg%20id='形状结合'%20fill-rule='nonzero'%3e%3cuse%20fill='black'%20fill-opacity='1'%20filter='url(%23filter-2)'%20xlink:href='%23path-1'%3e%3c/use%3e%3cpath%20stroke='%23FFFFFF'%20stroke-width='1'%20d='M19,25%20L19,15%20L16,15%20C15.4477153,15%2015,14.5522847%2015,14%20C15,13.5145897%2015.3479993,13.101915%2015.8654877,13.0100521%20L16,13%20L24,13%20C24.5522847,13%2025,13.4477153%2025,14%20C25,14.4854103%2024.6520007,14.898085%2024.1345123,14.9899479%20L24,15%20L21,15%20L21,25%20L24,25%20C24.5522847,25%2025,25.4477153%2025,26%20C25,26.4854103%2024.6520007,26.898085%2024.1345123,26.9899479%20L24,27%20L16,27%20C15.4477153,27%2015,26.5522847%2015,26%20C15,25.5145897%2015.3479993,25.101915%2015.8654877,25.0100521%20L16,25%20L19,25%20Z'%20fill='%23212324'%20fill-rule='evenodd'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
class Q0 extends h.Component {
  constructor(l) {
    super(l), Object.defineProperty(this, "renderAvatar", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var d;
        const e = `rgb(${c.memberState.strokeColor[0]}, ${c.memberState.strokeColor[1]}, ${c.memberState.strokeColor[2]})`;
        if (this.detectAvatar(c)) {
          const b = this.detectCursorName(c);
          return h.createElement("img", { className: "cursor-selector-avatar", style: {
            width: b ? 19 : 28,
            height: b ? 19 : 28,
            position: b ? "initial" : "absolute",
            borderColor: b ? "white" : e,
            marginRight: b ? 4 : 0
          }, src: (d = c.payload) == null ? void 0 : d.avatar, alt: "avatar" });
        } else
          return null;
      }
    }), Object.defineProperty(this, "getOpacity", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        const e = this.getCursorName(c), d = this.detectAvatar(c);
        return e === void 0 && d === void 0 ? 0 : 1;
      }
    }), Object.defineProperty(this, "getCursorName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        if (c.payload && c.payload.cursorName)
          return c.payload.cursorName;
      }
    }), Object.defineProperty(this, "getThemeClass", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => c.payload && c.payload.theme ? "cursor-inner-mellow" : "cursor-inner"
    }), Object.defineProperty(this, "getCursorBackgroundColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        const e = this.detectCursorName(c);
        return c.payload && c.payload.cursorBackgroundColor ? c.payload.cursorBackgroundColor : e ? `rgb(${c.memberState.strokeColor[0]}, ${c.memberState.strokeColor[1]}, ${c.memberState.strokeColor[2]})` : void 0;
      }
    }), Object.defineProperty(this, "getCursorTextColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => c.payload && c.payload.cursorTextColor ? c.payload.cursorTextColor : "#FFFFFF"
    }), Object.defineProperty(this, "getCursorTagBackgroundColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => c.payload && c.payload.cursorTagBackgroundColor ? c.payload.cursorTagBackgroundColor : this.getCursorBackgroundColor(c)
    }), Object.defineProperty(this, "detectCursorName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => !!(c.payload && c.payload.cursorName)
    }), Object.defineProperty(this, "detectAvatar", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => !!(c.payload && c.payload.avatar)
    }), Object.defineProperty(this, "renderTag", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        if (c.payload && c.payload.cursorTagName)
          return h.createElement("span", { className: "cursor-tag-name", style: { backgroundColor: this.getCursorTagBackgroundColor(c) } }, c.payload.cursorTagName);
      }
    });
  }
  render() {
    const { roomMember: l } = this.props, c = this.getCursorName(l);
    switch (l.memberState.currentApplianceName) {
      case E.pencil:
        return h.createElement(
          "div",
          { className: "cursor-box" },
          h.createElement(
            "div",
            { className: "cursor-mid cursor-pencil-offset", style: { transform: "translate(-50%, -90%)", marginLeft: "10px" } },
            h.createElement(
              "div",
              { className: "cursor-name" },
              h.createElement(
                "div",
                { style: {
                  opacity: this.getOpacity(l),
                  backgroundColor: this.getCursorBackgroundColor(l),
                  color: this.getCursorTextColor(l)
                }, className: this.getThemeClass(l) },
                this.renderAvatar(l),
                c,
                this.renderTag(l)
              )
            ),
            h.createElement(
              "div",
              null,
              h.createElement("img", { className: "cursor-pencil-image", src: j0, alt: "pencilCursor" })
            )
          )
        );
      case E.text:
        return h.createElement(
          "div",
          { className: "cursor-box" },
          h.createElement(
            "div",
            { className: "cursor-mid cursor-pencil-offset", style: { transform: "translate(-50%, -65%)", marginLeft: "0px" } },
            h.createElement(
              "div",
              { className: "cursor-name" },
              h.createElement(
                "div",
                { style: {
                  opacity: this.getOpacity(l),
                  backgroundColor: this.getCursorBackgroundColor(l),
                  color: this.getCursorTextColor(l)
                }, className: this.getThemeClass(l) },
                this.renderAvatar(l),
                c,
                this.renderTag(l)
              )
            ),
            h.createElement(
              "div",
              null,
              h.createElement("img", { className: "cursor-arrow-image", src: f0, alt: "textCursor" })
            )
          )
        );
      case E.rectangle:
      case E.arrow:
      case E.straight:
      case E.shape:
      case E.ellipse:
        return h.createElement(
          "div",
          { className: "cursor-box" },
          h.createElement(
            "div",
            { className: "cursor-mid cursor-pencil-offset", style: { transform: "translate(-50%, -65%)", marginLeft: "0px" } },
            h.createElement(
              "div",
              { className: "cursor-name" },
              h.createElement(
                "div",
                { style: {
                  opacity: this.getOpacity(l),
                  backgroundColor: this.getCursorBackgroundColor(l),
                  color: this.getCursorTextColor(l)
                }, className: this.getThemeClass(l) },
                this.renderAvatar(l),
                c,
                this.renderTag(l)
              )
            ),
            h.createElement(
              "div",
              null,
              h.createElement("img", { className: "cursor-arrow-image", src: P0, alt: "shapeCursor" })
            )
          )
        );
      default:
        return null;
    }
  }
}
const O0 = (t) => {
  const { className: l, info: c } = t, { roomMember: e, ...d } = c || {};
  return h.createElement("div", { className: `${l}`, style: d ? {
    transform: `translate(${d.x}px, ${d.y}px)`
  } : { display: "none" } }, e && h.createElement(Q0, { roomMember: e }));
}, B0 = (t) => {
  const { className: l, manager: c } = t, [e, d] = A();
  bl(() => (c.internalMsgEmitter.on([F.Cursor, c.viewId], b), () => {
    c.internalMsgEmitter.off([F.Cursor, c.viewId], b);
  }), [c]);
  function b(a) {
    d(a);
  }
  return O(() => {
    if (e != null && e.length) {
      const a = e.map((i) => {
        var n;
        return i.roomMember ? h.createElement(O0, { key: (n = i.roomMember) == null ? void 0 : n.memberId, className: l, info: i }) : null;
      });
      return h.createElement(h.Fragment, null, a);
    }
    return null;
  }, [e]);
}, D0 = (t) => {
  const { className: l } = t, [c, e] = A({ x: 0, y: 0, h: 0, w: 0 }), { floatBarData: d, position: b, maranger: s } = Gl(nl);
  bl(() => {
    d && e({ x: d.x, y: d.y, w: d.w, h: d.h });
  }, []);
  const a = (Z) => {
    if (Z.preventDefault(), Z.stopPropagation(), d != null && d.w && (d != null && d.h)) {
      const o = {
        x: (b == null ? void 0 : b.x) || 0,
        y: (b == null ? void 0 : b.y) || 0,
        w: d.w,
        h: d.h
      };
      e(o), s != null && s.control.room && (s.control.room.disableDeviceInputs = !0), j.emitMethod(F.MainEngine, R.ScaleNode, { workIds: [z], box: o, workState: x.Start, viewId: s == null ? void 0 : s.viewId });
    }
  }, i = al((Z, o, m, G) => {
    Z.preventDefault(), Z.stopPropagation();
    const p = {
      x: c.x,
      y: c.y,
      w: c.w,
      h: c.h
    };
    switch (p.w += G.width, p.h += G.height, o) {
      case "bottomLeft":
      case "left":
        p.x -= G.width;
        break;
      case "topLeft":
        p.x -= G.width, p.y -= G.height;
        break;
      case "top":
      case "topRight":
        p.y -= G.height;
        break;
    }
    (G.width !== 0 || G.height !== 0) && j.emitMethod(F.MainEngine, R.ScaleNode, { workIds: [z], box: p, dir: o, workState: x.Doing, viewId: s == null ? void 0 : s.viewId });
  }, 100, { leading: !1 }), n = al((Z, o, m, G) => {
    Z.preventDefault(), Z.stopPropagation();
    const p = {
      x: c.x,
      y: c.y,
      w: c.w,
      h: c.h
    };
    switch (p.w += G.width, p.h += G.height, o) {
      case "bottomLeft":
      case "left":
        p.x -= G.width;
        break;
      case "topLeft":
        p.x -= G.width, p.y -= G.height;
        break;
      case "top":
      case "topRight":
        p.y -= G.height;
        break;
    }
    s != null && s.control.room && (s.control.room.disableDeviceInputs = !1), j.emitMethod(F.MainEngine, R.ScaleNode, { workIds: [z], box: p, dir: o, workState: x.Done, viewId: s == null ? void 0 : s.viewId });
  }, 100, { leading: !1 });
  return h.createElement(Bt, { className: `${l}`, boundsByDirection: !0, size: {
    width: (d == null ? void 0 : d.w) || 0,
    height: (d == null ? void 0 : d.h) || 0
  }, style: {
    position: "absolute",
    pointerEvents: "auto",
    left: b == null ? void 0 : b.x,
    top: b == null ? void 0 : b.y
  }, enable: {
    top: (d == null ? void 0 : d.scaleType) === rl.all && !0 || !1,
    right: (d == null ? void 0 : d.scaleType) === rl.all && !0 || !1,
    bottom: (d == null ? void 0 : d.scaleType) === rl.all && !0 || !1,
    left: (d == null ? void 0 : d.scaleType) === rl.all && !0 || !1,
    topRight: !0,
    bottomRight: !0,
    bottomLeft: !0,
    topLeft: !0
  }, lockAspectRatio: (d == null ? void 0 : d.scaleType) === rl.proportional, onResizeStart: a, onResize: i, onResizeStop: n });
}, tt = (t) => {
  const { id: l, pos: c, pointMap: e, type: d } = t, { setOperationType: b, maranger: s, floatBarData: a } = Gl(nl), [i, n] = A({ x: 0, y: 0 }), [Z, o] = A(x.Pending);
  bl(() => {
    (Z === x.Pending || Z === x.Done) && n(c);
  }, [c, Z]);
  const m = (W) => {
    W.preventDefault(), W.stopPropagation(), b(R.SetPoint), o(x.Start), s != null && s.control.room && (s.control.room.disableDeviceInputs = !0), j.emitMethod(F.MainEngine, R.SetPoint, { workId: z, pointMap: e, workState: x.Start, viewId: s == null ? void 0 : s.viewId });
  }, G = al((W, r) => {
    if (W.preventDefault(), W.stopPropagation(), b(R.SetPoint), o(x.Doing), r.x !== (i == null ? void 0 : i.x) || r.y !== (i == null ? void 0 : i.y)) {
      const u = e.get(l);
      u && d === "start" && (s != null && s.control.viewContainerManager) ? u[0] = s.control.viewContainerManager.transformToScenePoint([r.x, r.y], s.viewId) : u && d === "end" && (s != null && s.control.viewContainerManager) && (u[1] = s.control.viewContainerManager.transformToScenePoint([r.x, r.y], s.viewId)), j.emitMethod(F.MainEngine, R.SetPoint, { workId: z, pointMap: e, workState: x.Doing, viewId: s == null ? void 0 : s.viewId });
    }
  }, 50, { leading: !1 }), p = al((W, r) => {
    if (W.preventDefault(), W.stopPropagation(), b(R.None), o(x.Done), r.x !== (i == null ? void 0 : i.x) || r.y !== (i == null ? void 0 : i.y)) {
      n(r);
      const u = e.get(l);
      u && d === "start" && (s != null && s.control.viewContainerManager) ? u[0] = s.control.viewContainerManager.transformToScenePoint([r.x, r.y], s.viewId) : u && d === "end" && (s != null && s.control.viewContainerManager) && (u[1] = s.control.viewContainerManager.transformToScenePoint([r.x, r.y], s.viewId)), j.emitMethod(F.MainEngine, R.SetPoint, { workId: z, pointMap: e, workState: x.Done, viewId: s == null ? void 0 : s.viewId });
    }
  }, 100, { leading: !1 });
  return h.createElement(
    ic,
    { position: i, onStart: m, onDrag: G, onStop: p },
    h.createElement(
      "div",
      { className: "bezier-pencil-plugin-point-draggable-btn" },
      h.createElement("div", { className: "bezier-pencil-plugin-point-draggable-btn-inner", style: {
        borderColor: a == null ? void 0 : a.selectorColor
      } })
    )
  );
}, E0 = (t) => {
  const { className: l } = t, { floatBarData: c, maranger: e } = Gl(nl), [d, b] = A(), [s, a] = A(), [i, n] = A(/* @__PURE__ */ new Map());
  bl(() => {
    const m = [];
    if (e && (c != null && c.points)) {
      const G = e.viewId;
      if (e.control.viewContainerManager.getView(G))
        for (const W of c.points) {
          const r = e.control.viewContainerManager.transformToOriginPoint(W, G);
          m.push(r);
        }
      c != null && c.selectIds && c.selectIds.length === 1 && (i.set(c.selectIds[0], c.points), n(i));
    }
    m[0] && b({ x: m[0][0], y: m[0][1] }), m[1] && a({ x: m[1][0], y: m[1][1] });
  }, [e, c == null ? void 0 : c.points, c == null ? void 0 : c.selectIds, i]);
  const Z = O(() => d && (c != null && c.selectIds) ? h.createElement(tt, { pos: d, type: "start", id: c.selectIds[0], pointMap: i }) : null, [d, c == null ? void 0 : c.selectIds, i]), o = O(() => s && (c != null && c.selectIds) ? h.createElement(tt, { pos: s, type: "end", id: c.selectIds[0], pointMap: i }) : null, [s, c == null ? void 0 : c.selectIds, i]);
  return h.createElement(
    "div",
    { className: `${l}` },
    Z,
    o
  );
}, nl = h.createContext({
  maranger: void 0,
  floatBarColors: [],
  floatBarData: void 0,
  zIndex: -1,
  dpr: 1,
  position: void 0,
  angle: 0,
  operationType: R.None,
  scale: [1, 1],
  setPosition: () => {
  },
  setAngle: () => {
  },
  setOperationType: () => {
  },
  setFloatBarData: () => {
  }
});
class ae extends h.Component {
  constructor(l) {
    var c;
    super(l), Object.defineProperty(this, "setPosition", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        this.setState({ position: e });
      }
    }), Object.defineProperty(this, "setAngle", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        this.setState({ angle: e });
      }
    }), Object.defineProperty(this, "setOperationType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        this.setState({ operationType: e });
      }
    }), this.state = {
      floatBarData: void 0,
      showFloatBar: !1,
      zIndex: -1,
      dpr: 1,
      position: void 0,
      angle: 0,
      operationType: R.None,
      // cursorInfo: undefined,
      scale: [1, 1],
      editors: this.editors,
      activeTextId: (c = this.props.maranger.control.textEditorManager) == null ? void 0 : c.activeId
    };
  }
  get editors() {
    return sl(this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId));
  }
  componentDidMount() {
    this.props.maranger.vDom = this, this.props.maranger.mountView(), this.setState({ dpr: this.props.maranger.dpr });
  }
  componentWillUnmount() {
  }
  showFloatBar(l, c) {
    const e = l && c && { ...this.state.floatBarData, ...c } || void 0;
    this.setState({
      showFloatBar: l,
      floatBarData: e,
      position: e && { x: e.x, y: e.y },
      angle: 0
    }), e && this.props.refs.floatBarCanvasRef.current && (e.canvasHeight && e.canvasWidth ? (this.props.refs.floatBarCanvasRef.current.width = e.canvasWidth * this.state.dpr, this.props.refs.floatBarCanvasRef.current.height = e.canvasHeight * this.state.dpr, this.props.refs.floatBarCanvasRef.current.style.width = e.canvasWidth + "px", this.props.refs.floatBarCanvasRef.current.style.height = e.canvasHeight + "px") : (this.props.refs.floatBarCanvasRef.current.width = e.w * this.state.dpr, this.props.refs.floatBarCanvasRef.current.height = e.h * this.state.dpr, this.props.refs.floatBarCanvasRef.current.style.width = "100%", this.props.refs.floatBarCanvasRef.current.style.height = "100%"));
  }
  setActiveTextEditor(l) {
    this.setState({
      activeTextId: l,
      editors: this.editors
    });
  }
  // setActiveCursor(cursorInfo?: { x?: number; y?: number, roomMember?: RoomMember }) {
  //     // this.setState({cursorInfo});
  // }
  setFloatZIndex(l) {
    this.setState({ zIndex: l });
  }
  setFloatBarData(l) {
    this.state.floatBarData && this.setState({
      floatBarData: { ...this.state.floatBarData, ...l }
    });
  }
  render() {
    var c, e, d, b, s, a, i, n, Z, o, m, G, p;
    const l = !!((e = (c = this.props.maranger.control) == null ? void 0 : c.room) != null && e.floatBarOptions);
    return h.createElement(
      h.Fragment,
      null,
      h.createElement(
        "div",
        { className: Ml.Container, onMouseDown: (W) => {
          W.preventDefault(), W.stopPropagation();
        }, onTouchStart: (W) => {
          W.stopPropagation();
        }, onMouseMove: (W) => {
          this.props.maranger.cursorMouseMove(W);
        } },
        h.createElement(
          "div",
          { className: Ml.CanvasBox },
          h.createElement("canvas", { className: Ml.FloatCanvas, ref: this.props.refs.canvasServiceFloatRef }),
          h.createElement("canvas", { className: Ml.FloatCanvas, ref: this.props.refs.canvasFloatRef }),
          h.createElement("canvas", { ref: this.props.refs.canvasBgRef })
        ),
        h.createElement(
          nl.Provider,
          { value: {
            maranger: this.props.maranger,
            floatBarColors: l && ((s = (b = (d = this.props.maranger.control) == null ? void 0 : d.room) == null ? void 0 : b.floatBarOptions) == null ? void 0 : s.colors) || [],
            floatBarData: this.state.floatBarData,
            zIndex: this.state.zIndex,
            dpr: this.state.dpr,
            position: this.state.position,
            angle: this.state.angle,
            operationType: this.state.operationType,
            scale: this.state.scale,
            setPosition: this.setPosition.bind(this),
            setAngle: this.setAngle.bind(this),
            setOperationType: this.setOperationType.bind(this),
            setFloatBarData: this.setFloatBarData.bind(this)
          } },
          this.state.showFloatBar && h.createElement(g0, { className: Ml.FloatBar, ref: this.props.refs.floatBarCanvasRef, editors: this.state.editors, activeTextId: this.state.activeTextId }) || null,
          ((a = this.state.editors) == null ? void 0 : a.size) && h.createElement(H0, { className: Ml.TextEditorContainer, showFloatBtns: l, manager: this.props.maranger, selectIds: ((i = this.state.floatBarData) == null ? void 0 : i.selectIds) || [], editors: this.state.editors, activeTextId: this.state.activeTextId }) || null,
          ((n = this.state.floatBarData) == null ? void 0 : n.canRotate) && ((o = (Z = this.state.floatBarData) == null ? void 0 : Z.selectIds) == null ? void 0 : o.length) === 1 && (this.state.operationType === R.None || this.state.operationType === R.RotateNode) && h.createElement(U0, { className: Ml.RotateBtn }) || null,
          (((m = this.state.floatBarData) == null ? void 0 : m.scaleType) === rl.all || ((G = this.state.floatBarData) == null ? void 0 : G.scaleType) === rl.proportional) && this.state.showFloatBar && (this.state.operationType === R.None || this.state.operationType === R.ScaleNode) && h.createElement(D0, { className: Ml.ResizeBtn }) || null,
          ((p = this.state.floatBarData) == null ? void 0 : p.scaleType) === rl.both && this.state.showFloatBar && (this.state.operationType === R.None || this.state.operationType === R.SetPoint) && h.createElement(E0, { className: Ml.ResizeTowBox }) || null,
          this.state.showFloatBar && l && h.createElement(F0, { className: Ml.FloatBarBtn }) || null
        ),
        h.createElement(B0, { className: Ml.CursorBox, manager: this.props.maranger })
      )
    );
  }
}
class hc extends xl {
  constructor(l, c) {
    super(l, c), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1e3
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1e3
    }), Object.defineProperty(this, "dpr", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1
    }), Object.defineProperty(this, "vDom", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "eventTragetElement", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "canvasServiceFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "canvasFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "canvasBgRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "floatBarRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "floatBarCanvasRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "containerOffset", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: { x: 0, y: 0 }
    });
  }
  setCanvassStyle() {
    if (this.eventTragetElement) {
      const l = this.eventTragetElement.offsetWidth || this.width, c = this.eventTragetElement.offsetHeight || this.height;
      l && c && this.canvasBgRef.current && (this.dpr = te(this.canvasBgRef.current.getContext("2d")), this.width = l, this.height = c, this.canvasBgRef.current.style.width = `${l}px`, this.canvasBgRef.current.style.height = `${c}px`, this.canvasBgRef.current.width = l * this.dpr, this.canvasBgRef.current.height = c * this.dpr, this.canvasFloatRef.current && (this.canvasFloatRef.current.style.width = `${l}px`, this.canvasFloatRef.current.style.height = `${c}px`, this.canvasFloatRef.current.width = l * this.dpr, this.canvasFloatRef.current.height = c * this.dpr), this.canvasServiceFloatRef.current && (this.canvasServiceFloatRef.current.style.width = `${l}px`, this.canvasServiceFloatRef.current.style.height = `${c}px`, this.canvasServiceFloatRef.current.width = l * this.dpr, this.canvasServiceFloatRef.current.height = c * this.dpr));
    }
  }
  destroy() {
    if (super.destroy(), this.eventTragetElement) {
      const l = this.eventTragetElement.parentElement;
      if (l) {
        const c = l.querySelectorAll(".teaching-aids-plugin-main-view-displayer");
        for (const e of c)
          e.remove();
      }
    }
  }
  createMainViewDisplayer(l) {
    const c = document.createElement("div");
    return c.className = "teaching-aids-plugin-main-view-displayer", l.appendChild(c), this.eventTragetElement = l.children[0], this.containerOffset = this.getContainerOffset(this.eventTragetElement, this.containerOffset), this.bindToolsClass(), Oc.render(h.createElement(ae, { viewId: this.viewId, maranger: this, refs: {
      canvasServiceFloatRef: this.canvasServiceFloatRef,
      canvasFloatRef: this.canvasFloatRef,
      canvasBgRef: this.canvasBgRef,
      floatBarRef: this.floatBarRef,
      floatBarCanvasRef: this.floatBarCanvasRef
    } }), c), this.control.room && this.bindDisplayerEvent(this.eventTragetElement), this;
  }
}
class A0 extends Du {
  constructor(l, c, e) {
    super(l, c, e), Object.defineProperty(this, "dpr", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1
    }), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1e3
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1e3
    }), Object.defineProperty(this, "vDom", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "eventTragetElement", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "canvasServiceFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "canvasFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "canvasBgRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "floatBarRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "floatBarCanvasRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "containerOffset", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: { x: 0, y: 0 }
    });
  }
  setCanvassStyle() {
    if (this.eventTragetElement && this.canvasBgRef.current) {
      this.dpr = te(this.canvasBgRef.current.getContext("2d"));
      const l = this.eventTragetElement.offsetWidth || this.width, c = this.eventTragetElement.offsetHeight || this.height;
      l && c && (this.width = l, this.height = c, this.canvasBgRef.current.style.width = `${l}px`, this.canvasBgRef.current.style.height = `${c}px`, this.canvasBgRef.current.width = l * this.dpr, this.canvasBgRef.current.height = c * this.dpr, this.canvasFloatRef.current && (this.canvasFloatRef.current.style.width = `${l}px`, this.canvasFloatRef.current.style.height = `${c}px`, this.canvasFloatRef.current.width = l * this.dpr, this.canvasFloatRef.current.height = c * this.dpr), this.canvasServiceFloatRef.current && (this.canvasServiceFloatRef.current.style.width = `${l}px`, this.canvasServiceFloatRef.current.style.height = `${c}px`, this.canvasServiceFloatRef.current.width = l * this.dpr, this.canvasServiceFloatRef.current.height = c * this.dpr));
    }
  }
  createAppViewDisplayer(l, c) {
    const e = document.createElement("div");
    return e.className = "teaching-aids-plugin-app-view-displayer", c.appendChild(e), this.eventTragetElement = c.children[0], this.containerOffset = this.getContainerOffset(this.eventTragetElement, this.containerOffset), this.bindToolsClass(), Oc.render(h.createElement(ae, { viewId: l, maranger: this, refs: {
      canvasServiceFloatRef: this.canvasServiceFloatRef,
      canvasFloatRef: this.canvasFloatRef,
      canvasBgRef: this.canvasBgRef,
      floatBarRef: this.floatBarRef,
      floatBarCanvasRef: this.floatBarCanvasRef
    } }), e), this.control.room && this.bindDisplayerEvent(this.eventTragetElement), this;
  }
}
class Sl extends nc {
  constructor(l) {
    super(l), Object.defineProperty(this, "focuedViewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "focuedView", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "tmpFocusedViewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "checkScaleTimer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "onMainViewRelease", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        this.control.textEditorManager.clear(hc.viewId, !0), this.onMainViewMounted(c);
      }
    }), Object.defineProperty(this, "onMainViewMounted", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        const e = c.divElement;
        if (!e || !c.focusScenePath || !(c.focusScenePath || c.scenePath))
          return;
        if (this.mainView && this.mainView.displayer) {
          this.mainView.displayer.destroy();
          const G = e.getElementsByClassName("teaching-aids-plugin-main-view-displayer");
          for (const p of G)
            p.remove();
          (m = this.control.worker) == null || m.destroyViewWorker(this.mainView.id, !0), this.mainView = void 0;
        }
        const b = new hc(this.control, Wl.InternalMsgEmitter), s = c.size.width || b.width, a = c.size.height || b.height, n = {
          dpr: b.dpr,
          originalPoint: [s / 2, a / 2],
          offscreenCanvasOpt: {
            ...Sl.defaultScreenCanvasOpt,
            width: s,
            height: a
          },
          layerOpt: {
            ...Sl.defaultLayerOpt,
            width: s,
            height: a
          },
          cameraOpt: {
            ...Sl.defaultCameraOpt,
            width: s,
            height: a
          }
        }, { scale: Z, ...o } = c.camera;
        n.cameraOpt = {
          ...n.cameraOpt,
          ...o,
          scale: Z === 1 / 0 ? 1 : Z
        }, this.focuedViewId = hc.viewId, this.createMianView({
          id: hc.viewId,
          container: e,
          displayer: b,
          focusScenePath: c.focusScenePath,
          cameraOpt: n.cameraOpt,
          viewData: c
        }), this.focuedView = this.mainView, b.createMainViewDisplayer(e), c.callbacks.on("onSizeUpdated", this.onMainViewSizeUpdated), c.callbacks.on("onCameraUpdated", this.onMainViewCameraUpdated), c.callbacks.on("onActiveHotkey", this.onActiveHotkeyChange.bind(this));
      }
    }), Object.defineProperty(this, "onMainViewSizeUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async () => {
        Promise.resolve().then(() => {
          if (this.mainView && this.mainView.viewData) {
            const c = this.mainView.viewData.size, e = this.mainView.cameraOpt;
            e && (this.mainView.displayer.updateSize(), this.mainView.cameraOpt = { ...e, ...c });
          }
        });
      }
    }), Object.defineProperty(this, "onMainViewCameraUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async () => {
        Promise.resolve().then(() => {
          if (this.mainView && this.mainView.viewData) {
            const c = this.mainView.viewData.camera, e = this.mainView.cameraOpt;
            if (e) {
              const d = c.scale === 1 / 0 ? 1 : c.scale, b = c.centerX || 0, s = c.centerY || 0;
              this.mainView.cameraOpt = { ...e, scale: d, centerX: b, centerY: s }, this.checkScaleTimer && c.scale == 1 / 0 && (clearTimeout(this.checkScaleTimer), this.checkScaleTimer = void 0), !this.checkScaleTimer && c.scale === 1 / 0 && this.mainView.viewData && this.mainView.viewData.camera.scale === 1 / 0 && (this.checkScaleTimer = setTimeout(() => {
                var a, i;
                (i = (a = this.mainView) == null ? void 0 : a.viewData) == null || i.moveCamera({ scale: d, centerX: b, centerY: s, animationMode: "immediately" }), this.checkScaleTimer = void 0;
              }, 500));
            }
          }
        });
      }
    }), Object.defineProperty(this, "onAppViewMounted", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        const { appId: e, view: d } = c, b = d.divElement;
        if (!b || !d.focusScenePath)
          return;
        const s = this.appViews.get(e);
        if (s && s.displayer) {
          const G = b.getElementsByClassName("teaching-aids-plugin-app-view-displayer");
          for (const p of G)
            p.remove();
          this.destroyAppView(c.appId, !0), (m = this.control.worker) == null || m.destroyViewWorker(e, !0);
        }
        const a = new A0(e, this.control, Wl.InternalMsgEmitter), i = d.size.width || a.width, n = d.size.height || a.height, o = {
          dpr: a.dpr,
          originalPoint: [i / 2, n / 2],
          offscreenCanvasOpt: {
            ...Sl.defaultScreenCanvasOpt,
            width: i,
            height: n
          },
          layerOpt: {
            ...Sl.defaultLayerOpt,
            width: i,
            height: n
          },
          cameraOpt: {
            ...Sl.defaultCameraOpt,
            ...d.camera,
            width: i,
            height: n
          }
        };
        if (this.createAppView({
          id: e,
          container: b,
          displayer: a,
          cameraOpt: o.cameraOpt,
          focusScenePath: d.focusScenePath,
          viewData: d
        }), a.createAppViewDisplayer(e, b), d.callbacks.on("onSizeUpdated", this.onAppViewSizeUpdated.bind(this, e)), d.callbacks.on("onCameraUpdated", this.onAppViewCameraUpdated.bind(this, e)), d.callbacks.on("onActiveHotkey", this.onActiveHotkeyChange.bind(this)), this.tmpFocusedViewId === e) {
          const G = this.control.worker.getLocalWorkViewId();
          G && G !== e ? this.setFocuedViewId(G) : this.setFocuedViewId(e), this.tmpFocusedViewId = void 0;
        }
      }
    }), Object.defineProperty(this, "onAppViewSizeUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (c) => {
        Promise.resolve().then(() => {
          const e = this.appViews.get(c);
          if (e && e.viewData) {
            const d = e.viewData.size, b = e.cameraOpt;
            b && (e.displayer.updateSize(), e.cameraOpt = { ...b, ...d });
          }
        });
      }
    }), Object.defineProperty(this, "onAppViewCameraUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (c) => {
        Promise.resolve().then(() => {
          const e = this.appViews.get(c);
          if (e && e.viewData) {
            const d = e.viewData.camera, b = e.cameraOpt;
            if (b) {
              const s = d.scale === 1 / 0 ? 1 : d.scale, a = d.centerX || 0, i = d.centerY || 0;
              e.cameraOpt = { ...b, scale: s, centerX: a, centerY: i };
            }
          }
        });
      }
    }), this.control = l.control;
  }
  mountView(l) {
    var e, d;
    const c = this.getView(l);
    if (c) {
      const { width: b, height: s, dpr: a } = c.displayer, i = {
        dpr: a,
        originalPoint: [b / 2, s / 2],
        offscreenCanvasOpt: {
          ...Sl.defaultScreenCanvasOpt,
          width: b,
          height: s
        },
        layerOpt: {
          ...Sl.defaultLayerOpt,
          width: b,
          height: s
        },
        cameraOpt: {
          ...Sl.defaultCameraOpt,
          width: b,
          height: s
        }
      };
      if (c.viewData) {
        const { scale: n, ...Z } = c.viewData.camera;
        i.cameraOpt = {
          ...i.cameraOpt,
          ...Z,
          scale: n === 1 / 0 ? 1 : n
        };
      }
      l === ((e = this.mainView) == null ? void 0 : e.id) && this.control.activeWorker(), (d = this.control.worker) == null || d.createViewWorker(l, i), c.focusScenePath && this.control.collector && this.control.worker.pullServiceData(l, c.focusScenePath);
    }
  }
  listenerWindowManager(l) {
    l.emitter.on("focusedChange", (c) => {
      const e = c || xl.viewId;
      if (this.focuedViewId !== e)
        if (this.getView(e)) {
          const b = this.control.worker.getLocalWorkViewId();
          b && b !== e ? this.setFocuedViewId(b) : this.setFocuedViewId(e);
        } else
          this.tmpFocusedViewId = e;
    }), l.emitter.on("mainViewScenePathChange", (c) => {
      console.log("ContainerManager mainViewScenePathChange", c), this.control.onSceneChange(c, "mainView");
    }), l.emitter.on("onMainViewMounted", this.onMainViewMounted), l.emitter.on("onAppViewMounted", this.onAppViewMounted), l.emitter.on("onMainViewRebind", this.onMainViewRelease), l.emitter.on("onBoxClose", (c) => {
      this.appViews.get(c.appId) && (this.destroyAppView(c.appId), this.control.worker.destroyViewWorker(c.appId));
    }), l.emitter.on("onAppScenePathChange", (c) => {
      const { appId: e, view: d } = c;
      this.control.onSceneChange(d.focusScenePath, e);
    });
  }
  onActiveHotkeyChange(l) {
    this.control.hotkeyManager.onActiveHotkey(l);
  }
}
class yc extends Wl {
  constructor(l) {
    super(l), Object.defineProperty(this, "windowManager", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "viewContainerManager", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
    const c = {
      control: this,
      internalMsgEmitter: Wl.InternalMsgEmitter
    };
    this.viewContainerManager = new Sl(c);
  }
  init() {
  }
  destroy() {
    var l, c, e, d;
    this.roomMember.destroy(), (l = this.collector) == null || l.destroy(), (c = this.worker) == null || c.destroy(), (e = this.viewContainerManager) == null || e.destroy(), (d = this.cursor) == null || d.destroy();
  }
  activePlugin() {
    this.collector && (this.collector.addStorageStateListener((l) => {
      var c, e;
      if ((c = this.collector) != null && c.storage && Object.keys(this.collector.storage).length === 0) {
        (e = this.worker) == null || e.clearViewScenePath("mainView", !0);
        return;
      }
      if (l) {
        const d = /* @__PURE__ */ new Map();
        Object.keys(l).forEach((b) => {
          var a;
          const s = l[b];
          if (s) {
            const i = s.viewId, n = d.get(i) || /* @__PURE__ */ new Set();
            n.add(b), d.set(i, n), (a = this.worker) == null || a.onServiceDerive(b, s);
          }
        });
        for (const [b, s] of d.entries())
          Wl.InternalMsgEmitter.emit("excludeIds", [...s], b);
      }
    }), this.room && this.roomMember.onUidChangeHook((l) => {
      var c, e, d, b;
      if ((c = this.collector) != null && c.serviceStorage) {
        const s = [];
        this.viewContainerManager.getAllViews().forEach((a) => {
          var i;
          if (a && a.focusScenePath && ((i = this.collector) != null && i.serviceStorage[a.id]) && this.collector.serviceStorage[a.id][a.focusScenePath]) {
            const n = Object.keys(this.collector.serviceStorage[a.id][a.focusScenePath]).filter((Z) => {
              var o;
              return (o = this.collector) == null ? void 0 : o.isSelector(Z);
            }).map((Z) => ({ viewId: a.id, scenePath: a.focusScenePath, key: Z }));
            n.length && s.push(...n);
          }
        }), s.forEach(({ key: a, viewId: i, scenePath: n }) => {
          var o, m;
          const Z = (o = this.collector) == null ? void 0 : o.getUidFromKey(a);
          Z && !l.online.includes(Z) && ((m = this.collector) == null || m.updateValue(a, void 0, { isAfterUpdate: !0, viewId: i, scenePath: n }));
        });
      }
      (d = (e = this.cursor) == null ? void 0 : e.eventCollector) != null && d.serviceStorage && Object.keys((b = this.cursor) == null ? void 0 : b.eventCollector.serviceStorage).forEach((a) => {
        var i, n;
        l.online.includes(a) || (n = (i = this.cursor) == null ? void 0 : i.eventCollector) == null || n.clearValue(a);
      });
    }), this.worker.isActive && this.viewContainerManager.getAllViews().forEach((l) => {
      l && l.focusScenePath && this.worker.pullServiceData(l.id, l.focusScenePath);
    }));
  }
  activeWorker() {
    this.worker.init();
  }
  setWindowManager(l) {
    var c, e, d, b, s;
    this.windowManager = l, (e = (c = this.windowManager) == null ? void 0 : c.mainView) != null && e.divElement && this.viewContainerManager.onMainViewMounted(this.windowManager.mainView), (s = (b = (d = this.windowManager.appManager) == null ? void 0 : d.viewManager) == null ? void 0 : b.views) != null && s.size && this.windowManager.appManager.viewManager.views.forEach((a, i) => {
      this.viewContainerManager.onAppViewMounted({ appId: i, view: a });
    }), this.viewContainerManager.listenerWindowManager(this.windowManager);
  }
}
class w extends st {
  constructor() {
    super(...arguments), Object.defineProperty(this, "updateRoomWritable", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        var l;
        (l = w.currentManager) == null || l.onWritableChange(this.displayer.isWritable);
      }
    }), Object.defineProperty(this, "roomStateChangeListener", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (l) => {
        var c, e;
        ll(this.displayer) && !this.displayer.isWritable || (l.memberState && ((c = w.currentManager) == null || c.onMemberChange(l.memberState)), l != null && l.roomMembers && ((e = w.currentManager) == null || e.onRoomMembersChange(l.roomMembers)));
      }
    });
  }
  static async getInstance(l, c) {
    c != null && c.logger && (w.logger = c.logger), c != null && c.options && (w.options = c.options);
    const e = l.displayer;
    let d = e.getInvisiblePlugin(w.kind);
    e && d && w.createCurrentManager(l, w.options, d), !d && ll(e) && (d = await w.createTeachingMulitAidsPlugin(e, w.kind)), d && w.currentManager && (w.currentManager.bindPlugin(d), d.init(e));
    const b = e.callbacks.on, s = e.callbacks.off, a = e.callbacks.once, i = l.cleanCurrentScene, n = {
      plugin: w,
      displayer: e,
      windowManager: l,
      getBoundingRectAsync: async function(Z) {
        var G;
        w.logger.info("[TeachingMulitAidsPlugin plugin] getBoundingRect");
        const o = (this.windowManager && this.windowManager.mainView || this.displayer).getBoundingRect(Z), m = await ((G = w.currentManager) == null ? void 0 : G.getBoundingRect(Z));
        return !o.width || !o.height ? m : Ct(o, m);
      },
      screenshotToCanvasAsync: async function(Z, o, m, G, p, W) {
        var V;
        w.logger.info("[TeachingMulitAidsPlugin plugin] screenshotToCanvasAsync");
        const r = document.createElement("canvas"), u = r.getContext("2d");
        r.width = m * (W || 1), r.height = G * (W || 1), u && ((this.windowManager && this.windowManager.mainView || this.displayer).screenshotToCanvas(u, o, m, G, p, W), Z.drawImage(r, 0, 0, m * (W || 1), G * (W || 1), 0, 0, m, G), r.remove()), w.currentManager && await ((V = w.currentManager) == null ? void 0 : V.screenshotToCanvas(Z, o, m, G, p));
      },
      scenePreviewAsync: async function(Z, o, m, G, p) {
        w.logger.info("[TeachingMulitAidsPlugin plugin] scenePreview"), (this.windowManager && this.windowManager.mainView || this.displayer).scenePreview(Z, o, m, G, p);
        const W = document.createElement("img");
        W.style.position = "absolute", W.style.top = "0px", W.style.left = "0px", W.style.width = "100%", W.style.height = "100%", W.style.pointerEvents = "none", o.append(W), getComputedStyle(o).position || (o.style.position = "relative"), w.currentManager && await w.currentManager.scenePreview(Z, W);
      },
      callbacksOn: function(Z, o) {
        w.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${Z}`), (Z === "onCanUndoStepsUpdate" || Z === "onCanRedoStepsUpdate") && ll(this.displayer) && this.displayer.isWritable ? yc.InternalMsgEmitter.on(Z, o) : b.call(e.callbacks, Z, o);
      },
      callbacksOnce: function(Z, o) {
        w.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${Z}`), (Z === "onCanUndoStepsUpdate" || Z === "onCanRedoStepsUpdate") && ll(this.displayer) && this.displayer.isWritable ? yc.InternalMsgEmitter.on(Z, o) : a.call(e.callbacks, Z, o);
      },
      callbacksOff: function(Z, o) {
        w.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${Z}`), (Z === "onCanUndoStepsUpdate" || Z === "onCanRedoStepsUpdate") && ll(this.displayer) && this.displayer.isWritable ? yc.InternalMsgEmitter.off(Z, o) : s.call(e.callbacks, Z, o);
      },
      undo: function() {
        return w.logger.info("[TeachingMulitAidsPlugin plugin] undo"), w.currentManager && ll(this.displayer) && !this.displayer.disableSerialization ? w.currentManager.viewContainerManager.undo() : 0;
      },
      redo: function() {
        return w.logger.info("[TeachingMulitAidsPlugin plugin] redo"), w.currentManager && ll(this.displayer) && !this.displayer.disableSerialization ? w.currentManager.viewContainerManager.redo() : 0;
      },
      cleanCurrentScene: function(Z) {
        w.logger.info("[TeachingMulitAidsPlugin plugin] cleanCurrentScene"), w.currentManager && ll(this.displayer) && this.displayer.isWritable && (w.currentManager.cleanCurrentScene(), i.call(l, Z));
      },
      insertImage: function(Z) {
        w.logger.info("[TeachingMulitAidsPlugin plugin] insertImage"), w.currentManager && ll(this.displayer) && this.displayer.isWritable && w.currentManager.worker.insertImage(Z);
      },
      lockImage: function(Z, o) {
        w.logger.info("[TeachingMulitAidsPlugin plugin] lockImage"), w.currentManager && ll(this.displayer) && this.displayer.isWritable && w.currentManager.worker.lockImage(Z, o);
      },
      completeImageUpload: function(Z, o) {
        w.logger.info("[TeachingMulitAidsPlugin plugin] completeImageUpload"), w.currentManager && ll(this.displayer) && this.displayer.isWritable && w.currentManager.worker.completeImageUpload(Z, o);
      },
      getImagesInformation: function(Z) {
        return w.logger.info("[TeachingMulitAidsPlugin plugin] completeImageUpload"), w.currentManager && ll(this.displayer) && this.displayer.isWritable ? w.currentManager.worker.getImagesInformation(Z) : [];
      },
      callbacks: () => ({
        ...e.callbacks,
        on: n.callbacksOn.bind(n),
        once: n.callbacksOnce.bind(n),
        off: n.callbacksOff.bind(n)
      })
    };
    return {
      ...n,
      callbacks: n.callbacks(),
      injectMethodToObject: function(Z, o) {
        if (w.logger.info(`[TeachingMulitAidsPlugin plugin] bindMethodToObject ${o}`), typeof Z[o] == "function" || typeof Z[o] > "u") {
          Z[o] = n[o].bind(n);
          return;
        }
        o === "callbacks" && (Z.callbacks.on = n.callbacksOn.bind(n), Z.callbacks.off = n.callbacksOff.bind(n), Z.callbacks.once = n.callbacksOnce.bind(n));
      }
    };
  }
  static onCreate(l) {
    l && w.currentManager && (w.currentManager.bindPlugin(l), l.init(l.displayer));
  }
  static async createTeachingMulitAidsPlugin(l, c) {
    await l.createInvisiblePlugin(w, {});
    let e = l.getInvisiblePlugin(c);
    return e || (e = await w.createTeachingMulitAidsPlugin(l, c)), e;
  }
  // static onDestroy(plugin: TeachingMulitAidsPlugin) {}
  get isReplay() {
    return Qc(this.displayer);
  }
  get callbackName() {
    return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
  }
  init(l) {
    var c, e;
    if (ll(l)) {
      const d = l.state;
      (c = w.currentManager) == null || c.onMemberChange(d.memberState), (e = w.currentManager) == null || e.onRoomMembersChange(d.roomMembers);
    }
    this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener), this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
  }
  destroy() {
    var l;
    (l = w.currentManager) == null || l.destroy(), w.currentManager = void 0;
  }
}
Object.defineProperty(w, "kind", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "teaching-multi-aids-plugin"
});
Object.defineProperty(w, "logger", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    info: console.log,
    warn: console.warn,
    error: console.error
  }
});
Object.defineProperty(w, "options", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    syncOpt: {
      interval: 300
    },
    canvasOpt: {
      contextType: ac.Canvas2d
    }
  }
});
Object.defineProperty(w, "createCurrentManager", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (t, l, c) => {
    if (w.currentManager && w.currentManager.destroy(), l && t) {
      const e = {
        plugin: c,
        displayer: t.displayer,
        options: l
      }, d = new yc(e);
      w.logger.info("[TeachingMulitAidsPlugin plugin] refresh TeachingAidsMultiManager object"), d.setWindowManager(t), w.currentManager = d;
    }
  }
});
class q0 extends xl {
  constructor(l, c) {
    super(l, c), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1e3
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1e3
    }), Object.defineProperty(this, "dpr", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1
    }), Object.defineProperty(this, "vDom", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "viewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "mainView"
    }), Object.defineProperty(this, "eventTragetElement", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "canvasServiceFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "canvasFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "canvasBgRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "floatBarRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "floatBarCanvasRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: h.createRef()
    }), Object.defineProperty(this, "containerOffset", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: { x: 0, y: 0 }
    });
  }
  setCanvassStyle() {
    if (this.eventTragetElement) {
      const l = this.eventTragetElement.offsetWidth, c = this.eventTragetElement.offsetHeight;
      l && c && this.canvasBgRef.current && (this.dpr = te(this.canvasBgRef.current.getContext("2d")), this.width = l, this.height = c, this.canvasBgRef.current.style.width = `${l}px`, this.canvasBgRef.current.style.height = `${c}px`, this.canvasBgRef.current.width = l * this.dpr, this.canvasBgRef.current.height = c * this.dpr, this.canvasFloatRef.current && (this.canvasFloatRef.current.style.width = `${l}px`, this.canvasFloatRef.current.style.height = `${c}px`, this.canvasFloatRef.current.width = l * this.dpr, this.canvasFloatRef.current.height = c * this.dpr), this.canvasServiceFloatRef.current && (this.canvasServiceFloatRef.current.style.width = `${l}px`, this.canvasServiceFloatRef.current.style.height = `${c}px`, this.canvasServiceFloatRef.current.width = l * this.dpr, this.canvasServiceFloatRef.current.height = c * this.dpr));
    }
  }
  createMainViewDisplayer(l) {
    return this.vDom || (this.containerOffset = this.getContainerOffset(l, this.containerOffset), this.eventTragetElement = l.parentElement.children[0], l.innerHTML = "", Oc.render(h.createElement(ae, { viewId: this.viewId, maranger: this, refs: {
      canvasServiceFloatRef: this.canvasServiceFloatRef,
      canvasFloatRef: this.canvasFloatRef,
      canvasBgRef: this.canvasBgRef,
      floatBarRef: this.floatBarRef,
      floatBarCanvasRef: this.floatBarCanvasRef
    } }), l), this.control.room && this.bindDisplayerEvent(this.eventTragetElement)), this;
  }
}
class Ul extends nc {
  constructor(l) {
    super(l), Object.defineProperty(this, "focuedViewId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "control", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "focuedView", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.control = l.control;
  }
  bindMainView() {
    if (!this.control.divMainView)
      return;
    const l = new q0(this.control, Wl.InternalMsgEmitter);
    this.focuedViewId = xl.viewId;
    const { width: c, height: e, dpr: d } = l, b = {
      dpr: d,
      originalPoint: [c / 2, e / 2],
      offscreenCanvasOpt: {
        ...Ul.defaultScreenCanvasOpt,
        width: c,
        height: e
      },
      layerOpt: {
        ...Ul.defaultLayerOpt,
        width: c,
        height: e
      },
      cameraOpt: {
        ...Ul.defaultCameraOpt,
        width: c,
        height: e
      }
    }, s = this.control.room && this.control.room.mainView || this.control.play && this.control.play.mainView;
    if (s) {
      const { scale: a, ...i } = s.camera;
      b.cameraOpt = {
        ...b.cameraOpt,
        ...i,
        scale: a === 1 / 0 ? 1 : a
      }, this.createMianView({
        id: xl.viewId,
        displayer: l,
        focusScenePath: s.focusScenePath || s.scenePath,
        cameraOpt: b.cameraOpt,
        viewData: s
      }), this.focuedView = this.mainView, l.createMainViewDisplayer(this.control.divMainView);
    }
  }
  mountView(l) {
    var e;
    const c = this.getView(l);
    if (c) {
      const { width: d, height: b, dpr: s } = c.displayer, a = {
        dpr: s,
        originalPoint: [d / 2, b / 2],
        offscreenCanvasOpt: {
          ...Ul.defaultScreenCanvasOpt,
          width: d,
          height: b
        },
        layerOpt: {
          ...Ul.defaultLayerOpt,
          width: d,
          height: b
        },
        cameraOpt: {
          ...Ul.defaultCameraOpt,
          width: d,
          height: b
        }
      };
      if (c.viewData) {
        const { scale: i, ...n } = c.viewData.camera;
        a.cameraOpt = {
          ...a.cameraOpt,
          ...n,
          scale: i === 1 / 0 ? 1 : i
        };
      }
      this.control.worker.isActive || this.control.activeWorker(), (e = this.control.worker) == null || e.createViewWorker(l, a), c.focusScenePath && this.control.collector && this.control.worker.pullServiceData(l, c.focusScenePath);
    }
  }
}
class Hl extends Wl {
  constructor(l) {
    super(l), Object.defineProperty(this, "viewContainerManager", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "divMainView", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "onCameraChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al((e) => {
        this.viewContainerManager.setFocuedViewCameraOpt(e);
      }, 20, { leading: !1 })
    });
    const c = {
      control: this,
      internalMsgEmitter: Hl.InternalMsgEmitter
    };
    this.viewContainerManager = new Ul(c);
  }
  init() {
    Hl.InternalMsgEmitter.on(F.BindMainView, (l) => {
      this.divMainView = l, this.plugin && !this.viewContainerManager.mainView && this.viewContainerManager.bindMainView();
    });
  }
  activePlugin() {
    this.plugin && this.divMainView && !this.viewContainerManager.mainView && this.viewContainerManager.bindMainView(), this.collector && (this.collector.addStorageStateListener((l) => {
      var c, e;
      if ((c = this.collector) != null && c.storage && Object.keys(this.collector.storage).length === 0) {
        (e = this.worker) == null || e.clearViewScenePath("mainView", !0);
        return;
      }
      if (l) {
        const d = /* @__PURE__ */ new Map();
        Object.keys(l).forEach((b) => {
          var a;
          const s = l[b];
          if (s) {
            const i = s.viewId, n = d.get(i) || /* @__PURE__ */ new Set();
            n.add(b), d.set(i, n), (a = this.worker) == null || a.onServiceDerive(b, s);
          }
        });
        for (const [b, s] of d.entries())
          Hl.InternalMsgEmitter.emit("excludeIds", [...s], b);
      }
    }), this.room && (this.roomMember.onUidChangeHook((l) => {
      var c, e, d, b;
      if ((c = this.collector) != null && c.serviceStorage) {
        const s = [];
        this.viewContainerManager.getAllViews().forEach((a) => {
          var i, n, Z;
          if (a && a.focusScenePath && ((i = this.collector) != null && i.serviceStorage[a.id]) && ((n = this.collector) != null && n.serviceStorage[a.id][a.focusScenePath])) {
            const o = Object.keys((Z = this.collector) == null ? void 0 : Z.serviceStorage[a.id][a.focusScenePath]).filter((m) => {
              var G;
              return (G = this.collector) == null ? void 0 : G.isSelector(m);
            }).map((m) => ({ viewId: a.id, scenePath: a.focusScenePath, key: m }));
            o.length && s.push(...o);
          }
        }), s.forEach(({ key: a, viewId: i, scenePath: n }) => {
          var o, m;
          const Z = (o = this.collector) == null ? void 0 : o.getUidFromKey(a);
          Z && !l.online.includes(Z) && ((m = this.collector) == null || m.updateValue(a, void 0, { isAfterUpdate: !0, viewId: i, scenePath: n }));
        });
      }
      (d = (e = this.cursor) == null ? void 0 : e.eventCollector) != null && d.serviceStorage && Object.keys((b = this.cursor) == null ? void 0 : b.eventCollector.serviceStorage).forEach((a) => {
        var i, n;
        l.online.includes(a) || (n = (i = this.cursor) == null ? void 0 : i.eventCollector) == null || n.clearValue(a);
      });
    }), this.worker.isActive && this.viewContainerManager.getAllViews().forEach((l) => {
      l && l.focusScenePath && this.worker.pullServiceData(l.id, l.focusScenePath);
    })));
  }
  activeWorker() {
    this.worker.init();
  }
}
class J extends st {
  constructor() {
    super(...arguments), Object.defineProperty(this, "updateRoomWritable", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        var l;
        (l = J.currentManager) == null || l.onWritableChange(this.displayer.isWritable);
      }
    }), Object.defineProperty(this, "roomStateChangeListener", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (l) => {
        var c, e;
        J.currentManager instanceof Hl && (l.cameraState && J.currentManager.onCameraChange(l.cameraState), l.sceneState && J.currentManager.onSceneChange(l.sceneState.scenePath, "mainView")), !(ll(this.displayer) && !this.displayer.isWritable) && (l.memberState && ((c = J.currentManager) == null || c.onMemberChange(l.memberState)), l != null && l.roomMembers && ((e = J.currentManager) == null || e.onRoomMembersChange(l.roomMembers)));
      }
    });
  }
  static async getInstance(l, c) {
    c != null && c.logger && (J.logger = c.logger), c != null && c.options && (J.options = c.options), c != null && c.cursorAdapter && (J.cursorAdapter = c.cursorAdapter, J.effectInstance());
    let e = l.getInvisiblePlugin(J.kind);
    l && e && J.createCurrentManager(l, J.options, e), !e && ll(l) && (e = await J.createTeachingAidsPlugin(l, J.kind)), e && J.currentManager && (J.currentManager.bindPlugin(e), e.init(l));
    const d = l.callbacks.on, b = l.callbacks.off, s = l.callbacks.once, a = l.cleanCurrentScene, i = {
      plugin: e,
      displayer: l,
      getBoundingRectAsync: async function(n) {
        var m;
        J.logger.info("[TeachingAidsSinglePlugin plugin] getBoundingRect");
        const Z = this.displayer.getBoundingRect(n), o = await ((m = J.currentManager) == null ? void 0 : m.getBoundingRect(n));
        return !Z.width || !Z.height ? o : Ct(Z, o);
      },
      screenshotToCanvasAsync: async function(n, Z, o, m, G, p) {
        var u;
        J.logger.info("[TeachingAidsSinglePlugin plugin] screenshotToCanvasAsync");
        const W = document.createElement("canvas"), r = W.getContext("2d");
        W.width = o * (p || 1), W.height = m * (p || 1), r && (this.displayer.screenshotToCanvas(r, Z, o, m, G, p), n.drawImage(W, 0, 0, o * (p || 1), m * (p || 1), 0, 0, o, m), W.remove()), J.currentManager && await ((u = J.currentManager) == null ? void 0 : u.screenshotToCanvas(n, Z, o, m, G));
      },
      scenePreviewAsync: async function(n, Z, o, m, G) {
        J.logger.info("[TeachingAidsSinglePlugin plugin] scenePreview"), this.displayer.scenePreview(n, Z, o, m, G);
        const p = document.createElement("img");
        p.style.position = "absolute", p.style.top = "0px", p.style.left = "0px", p.style.width = "100%", p.style.height = "100%", p.style.pointerEvents = "none", Z.append(p), getComputedStyle(Z).position || (Z.style.position = "relative"), J.currentManager && await J.currentManager.scenePreview(n, p);
      },
      callbacksOn: function(n, Z) {
        J.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${n}`), (n === "onCanUndoStepsUpdate" || n === "onCanRedoStepsUpdate") && ll(this.displayer) && this.displayer.isWritable ? Hl.InternalMsgEmitter.on(n, Z) : d.call(l.callbacks, n, Z);
      },
      callbacksOnce: function(n, Z) {
        J.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${n}`), (n === "onCanUndoStepsUpdate" || n === "onCanRedoStepsUpdate") && ll(this.displayer) && this.displayer.isWritable ? Hl.InternalMsgEmitter.on(n, Z) : s.call(l.callbacks, n, Z);
      },
      callbacksOff: function(n, Z) {
        J.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${n}`), (n === "onCanUndoStepsUpdate" || n === "onCanRedoStepsUpdate") && ll(this.displayer) && this.displayer.isWritable ? Hl.InternalMsgEmitter.off(n, Z) : b.call(l.callbacks, n, Z);
      },
      undo: function() {
        return J.logger.info("[TeachingAidsSinglePlugin plugin] undo"), J.currentManager && ll(this.displayer) && !this.displayer.disableSerialization ? J.currentManager.viewContainerManager.undo() : 0;
      },
      redo: function() {
        return J.logger.info("[TeachingAidsSinglePlugin plugin] redo"), J.currentManager && ll(this.displayer) && !this.displayer.disableSerialization ? J.currentManager.viewContainerManager.redo() : 0;
      },
      cleanCurrentScene: function(n) {
        J.logger.info("[TeachingAidsSinglePlugin plugin] cleanCurrentScene"), J.currentManager && ll(this.displayer) && this.displayer.isWritable && (J.currentManager.cleanCurrentScene(), a.call(l, n));
      },
      insertImage: function(n) {
        J.logger.info("[TeachingAidsSinglePlugin plugin] insertImage"), J.currentManager && ll(this.displayer) && this.displayer.isWritable && J.currentManager.worker.insertImage(n);
      },
      lockImage: function(n, Z) {
        J.logger.info("[TeachingAidsSinglePlugin plugin] lockImage"), J.currentManager && ll(this.displayer) && this.displayer.isWritable && J.currentManager.worker.lockImage(n, Z);
      },
      completeImageUpload: function(n, Z) {
        J.logger.info("[TeachingAidsSinglePlugin plugin] completeImageUpload"), J.currentManager && ll(this.displayer) && this.displayer.isWritable && J.currentManager.worker.completeImageUpload(n, Z);
      },
      getImagesInformation: function(n) {
        return J.logger.info("[TeachingAidsSinglePlugin plugin] completeImageUpload"), J.currentManager && ll(this.displayer) && this.displayer.isWritable ? J.currentManager.worker.getImagesInformation(n) : [];
      },
      callbacks: () => ({
        ...l.callbacks,
        on: i.callbacksOn.bind(i),
        once: i.callbacksOnce.bind(i),
        off: i.callbacksOff.bind(i)
      })
    };
    return {
      ...i,
      callbacks: i.callbacks(),
      injectMethodToObject: function(n, Z) {
        if (J.logger.info(`[TeachingAidsSinglePlugin plugin] bindMethodToObject ${Z}`), typeof n[Z] == "function" || typeof n[Z] > "u") {
          n[Z] = i[Z].bind(i);
          return;
        }
        Z === "callbacks" && (n.callbacks.on = i.callbacksOn.bind(i), n.callbacks.off = i.callbacksOff.bind(i), n.callbacks.once = i.callbacksOnce.bind(i));
      }
    };
  }
  static onCreate(l) {
    l && J.currentManager && (J.currentManager.bindPlugin(l), l.init(l.displayer));
  }
  static async createTeachingAidsPlugin(l, c) {
    await l.createInvisiblePlugin(J, {});
    let e = l.getInvisiblePlugin(c);
    return e || (e = await J.createTeachingAidsPlugin(l, c)), e;
  }
  // static onDestroy(plugin: TeachingAidsPlugin) {}
  /**
   * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
   * @param displayer
   */
  static effectInstance() {
    if (J.cursorAdapter) {
      const l = J.cursorAdapter.onAddedCursor;
      J.cursorAdapter.onAddedCursor = function(c) {
        c.onCursorMemberChanged = (e) => {
          try {
            e.appliance === E.pencil || e.appliance === E.shape || e.appliance === E.text || e.appliance === E.arrow || e.appliance === E.straight || e.appliance === E.rectangle || e.appliance === E.ellipse ? c != null && c.divElement && (c.divElement.style.display = "none") : c != null && c.divElement && (c.divElement.style.display = "block");
          } catch {
          }
        }, l.call(J.cursorAdapter, c);
      };
    }
  }
  get isReplay() {
    return Qc(this.displayer);
  }
  get callbackName() {
    return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
  }
  init(l) {
    var c;
    if (ll(l)) {
      const e = l.state;
      e != null && e.memberState && ((c = J.currentManager) == null || c.onMemberChange(e.memberState));
    }
    this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener), this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
  }
  destroy() {
    var l;
    (l = J.currentManager) == null || l.destroy(), J.currentManager = void 0, J.cursorAdapter = void 0;
  }
}
Object.defineProperty(J, "kind", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "teaching-single-aids-plugin"
});
Object.defineProperty(J, "logger", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    info: console.log,
    warn: console.warn,
    error: console.error
  }
});
Object.defineProperty(J, "options", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    syncOpt: {
      interval: 300
    },
    canvasOpt: {
      contextType: ac.Canvas2d
    }
  }
});
Object.defineProperty(J, "createCurrentManager", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (t, l, c) => {
    J.currentManager && J.currentManager.destroy();
    const e = {
      plugin: c,
      displayer: t,
      options: l
    }, d = new Hl(e);
    d.init(), J.logger.info("[TeachingAidsPlugin plugin] refresh TeachingAidsSingleManager object"), J.currentManager = d;
  }
});
class sc extends h.Component {
  constructor() {
    super(...arguments), Object.defineProperty(this, "mainViewRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    });
  }
  componentDidMount() {
    sc.emiter || (sc.emiter = Hl.InternalMsgEmitter), sc.emiter.emit(F.BindMainView, this.mainViewRef);
  }
  componentWillUnmount() {
    sc.emiter.emit(F.DisplayState, Pc.unmounted);
  }
  render() {
    return h.createElement(
      h.Fragment,
      null,
      this.props.children,
      h.createElement("div", { className: "teaching-aids-plugin-main-view-displayer", ref: (l) => this.mainViewRef = l })
    );
  }
}
export {
  ac as ECanvasContextType,
  sc as TeachingAidsSigleWrapper,
  w as TeachingMulitAidsPlugin,
  J as TeachingSingleAidsPlugin
};
