import { toJS as dt, autorun as bt, ApplianceNames as D, isRoom as _, isPlayer as Qe, InvisiblePlugin as st } from "white-web-sdk";
import "spritejs";
import { decompress as Pt, compress as Qt } from "lz-string";
import "lineclip";
import at from "eventemitter2";
import { cloneDeep as nc } from "lodash";
import Be from "react-dom";
import h, { useContext as Gl, useState as A, useMemo as B, useEffect as bl, useRef as Bl, useCallback as Bt } from "react";
import ie from "react-draggable";
import { Resizable as Ot } from "re-resizable";
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
  constructor(l = 0, e = 0, c = 1) {
    Object.defineProperty(this, "x", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: l
    }), Object.defineProperty(this, "y", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e
    }), Object.defineProperty(this, "z", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: c
    });
  }
  get XY() {
    return [this.x, this.y];
  }
  setz(l) {
    return this.z = l, this;
  }
  setXY(l = this.x, e = this.y) {
    return this.x = l, this.y = e, this;
  }
  set(l = this.x, e = this.y, c = this.z) {
    return this.x = l, this.y = e, this.z = c, this;
  }
  setTo({ x: l = 0, y: e = 0, z: c = 1 }) {
    return this.x = l, this.y = e, this.z = c, this;
  }
  rot(l) {
    if (l === 0)
      return this;
    const { x: e, y: c } = this, d = Math.sin(l), b = Math.cos(l);
    return this.x = e * b - c * d, this.y = e * d + c * b, this;
  }
  rotWith(l, e) {
    if (e === 0)
      return this;
    const c = this.x - l.x, d = this.y - l.y, b = Math.sin(e), s = Math.cos(e);
    return this.x = l.x + (c * s - d * b), this.y = l.y + (c * b + d * s), this;
  }
  clone() {
    const { x: l, y: e, z: c } = this;
    return new S(l, e, c);
  }
  sub(l) {
    return this.x -= l.x, this.y -= l.y, this;
  }
  subXY(l, e) {
    return this.x -= l, this.y -= e, this;
  }
  subScalar(l) {
    return this.x -= l, this.y -= l, this;
  }
  add(l) {
    return this.x += l.x, this.y += l.y, this;
  }
  addXY(l, e) {
    return this.x += l, this.y += e, this;
  }
  addScalar(l) {
    return this.x += l, this.y += l, this;
  }
  clamp(l, e) {
    return this.x = Math.max(this.x, l), this.y = Math.max(this.y, l), e !== void 0 && (this.x = Math.min(this.x, e), this.y = Math.min(this.y, e)), this;
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
  nudge(l, e) {
    const c = S.Tan(l, this);
    return this.add(c.mul(e));
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
    const { x: l, y: e } = this;
    return this.x = e, this.y = -l, this;
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
  distanceToLineSegment(l, e) {
    return S.DistanceToLineSegment(l, e, this);
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
  lrp(l, e) {
    return this.x = this.x + (l.x - this.x) * e, this.y = this.y + (l.y - this.y) * e, this;
  }
  equals(l, e) {
    return S.Equals(this, l, e);
  }
  equalsXY(l, e) {
    return S.EqualsXY(this, l, e);
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
  static Add(l, e) {
    return new S(l.x + e.x, l.y + e.y);
  }
  static AddXY(l, e, c) {
    return new S(l.x + e, l.y + c);
  }
  static Sub(l, e) {
    return new S(l.x - e.x, l.y - e.y);
  }
  static SubXY(l, e, c) {
    return new S(l.x - e, l.y - c);
  }
  static AddScalar(l, e) {
    return new S(l.x + e, l.y + e);
  }
  static SubScalar(l, e) {
    return new S(l.x - e, l.y - e);
  }
  static Div(l, e) {
    return new S(l.x / e, l.y / e);
  }
  static Mul(l, e) {
    return new S(l.x * e, l.y * e);
  }
  static DivV(l, e) {
    return new S(l.x / e.x, l.y / e.y);
  }
  static MulV(l, e) {
    return new S(l.x * e.x, l.y * e.y);
  }
  static Neg(l) {
    return new S(-l.x, -l.y);
  }
  static Per(l) {
    return new S(l.y, -l.x);
  }
  static Dist2(l, e) {
    return S.Sub(l, e).len2();
  }
  static Abs(l) {
    return new S(Math.abs(l.x), Math.abs(l.y));
  }
  static Dist(l, e) {
    return Math.hypot(l.y - e.y, l.x - e.x);
  }
  static Dpr(l, e) {
    return l.x * e.x + l.y * e.y;
  }
  static Cross(l, e) {
    return new S(
      l.y * e.z - l.z * e.y,
      l.z * e.x - l.x * e.z
      // A.z = A.x * V.y - A.y * V.x
    );
  }
  static Cpr(l, e) {
    return l.x * e.y - e.x * l.y;
  }
  static Len2(l) {
    return l.x * l.x + l.y * l.y;
  }
  static Len(l) {
    return Math.hypot(l.x, l.y);
  }
  static Pry(l, e) {
    return S.Dpr(l, e) / S.Len(e);
  }
  static Uni(l) {
    return S.Div(l, S.Len(l));
  }
  static Tan(l, e) {
    return S.Uni(S.Sub(l, e));
  }
  static Min(l, e) {
    return new S(Math.min(l.x, e.x), Math.min(l.y, e.y));
  }
  static Max(l, e) {
    return new S(Math.max(l.x, e.x), Math.max(l.y, e.y));
  }
  static From(l) {
    return new S().add(l);
  }
  static FromArray(l) {
    return new S(l[0], l[1]);
  }
  static Rot(l, e = 0) {
    const c = Math.sin(e), d = Math.cos(e);
    return new S(l.x * d - l.y * c, l.x * c + l.y * d);
  }
  static RotWith(l, e, c) {
    const d = l.x - e.x, b = l.y - e.y, s = Math.sin(c), a = Math.cos(c);
    return new S(e.x + (d * a - b * s), e.y + (d * s + b * a));
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
  static NearestPointOnLineThroughPoint(l, e, c) {
    return S.Mul(e, S.Sub(c, l).pry(e)).add(l);
  }
  static NearestPointOnLineSegment(l, e, c, d = !0) {
    const b = S.Tan(e, l), s = S.Add(l, S.Mul(b, S.Sub(c, l).pry(b)));
    if (d) {
      if (s.x < Math.min(l.x, e.x))
        return S.Cast(l.x < e.x ? l : e);
      if (s.x > Math.max(l.x, e.x))
        return S.Cast(l.x > e.x ? l : e);
      if (s.y < Math.min(l.y, e.y))
        return S.Cast(l.y < e.y ? l : e);
      if (s.y > Math.max(l.y, e.y))
        return S.Cast(l.y > e.y ? l : e);
    }
    return s;
  }
  static DistanceToLineThroughPoint(l, e, c) {
    return S.Dist(c, S.NearestPointOnLineThroughPoint(l, e, c));
  }
  static DistanceToLineSegment(l, e, c, d = !0) {
    return S.Dist(c, S.NearestPointOnLineSegment(l, e, c, d));
  }
  static Snap(l, e = 1) {
    return new S(Math.round(l.x / e) * e, Math.round(l.y / e) * e);
  }
  static Cast(l) {
    return l instanceof S ? l : S.From(l);
  }
  static Slope(l, e) {
    return l.x === e.y ? NaN : (l.y - e.y) / (l.x - e.x);
  }
  static Angle(l, e) {
    return Math.atan2(e.y - l.y, e.x - l.x);
  }
  static Lrp(l, e, c) {
    return S.Sub(e, l).mul(c).add(l);
  }
  static Med(l, e) {
    return new S((l.x + e.x) / 2, (l.y + e.y) / 2);
  }
  static Equals(l, e, c = 1e-4) {
    return Math.abs(l.x - e.x) < c && Math.abs(l.y - e.y) < c;
  }
  static EqualsXY(l, e, c) {
    return l.x === e && l.y === c;
  }
  static EqualsXYZ(l, e, c = 1e-4) {
    return S.Equals(l, e, c) && Math.abs((l.z || 0) - (e.z || 0)) < c;
  }
  static Clockwise(l, e, c) {
    return (c.x - l.x) * (e.y - l.y) - (e.x - l.x) * (c.y - l.y) < 0;
  }
  static Rescale(l, e) {
    const c = S.Len(l);
    return new S(e * l.x / c, e * l.y / c);
  }
  static ScaleWithOrigin(l, e, c) {
    return S.Sub(l, c).mul(e).add(c);
  }
  static ScaleWOrigin(l, e, c) {
    return S.Sub(l, c).mulV(e).add(c);
  }
  static ToFixed(l, e = 2) {
    return new S(+l.x.toFixed(e), +l.y.toFixed(e), +l.z.toFixed(e));
  }
  static Nudge(l, e, c) {
    return S.Add(l, S.Tan(e, l).mul(c));
  }
  static ToString(l) {
    return `${l.x}, ${l.y}`;
  }
  static ToAngle(l) {
    let e = Math.atan2(l.y, l.x);
    return e < 0 && (e += Math.PI * 2), e;
  }
  static FromAngle(l, e = 1) {
    return new S(Math.cos(l) * e, Math.sin(l) * e);
  }
  static ToArray(l) {
    return [l.x, l.y, l.z];
  }
  static ToJson(l) {
    const { x: e, y: c, z: d } = l;
    return { x: e, y: c, z: d };
  }
  static Average(l) {
    const e = l.length, c = new S(0, 0);
    for (let d = 0; d < e; d++)
      c.add(l[d]);
    return c.div(e);
  }
  static Clamp(l, e, c) {
    return c === void 0 ? new S(Math.min(Math.max(l.x, e)), Math.min(Math.max(l.y, e))) : new S(Math.min(Math.max(l.x, e), c), Math.min(Math.max(l.y, e), c));
  }
  /**
   * Get an array of points (with simulated pressure) between two points.
   *
   * @param A - The first point.
   * @param B - The second point.
   * @param steps - The number of points to return.
   */
  static PointsBetween(l, e, c = 6) {
    const d = [];
    for (let b = 0; b < c; b++) {
      const s = Dt.easeInQuad(b / (c - 1)), a = S.Lrp(l, e, s);
      a.z = Math.min(1, 0.5 + Math.abs(0.5 - Et(s)) * 0.65), d.push(a);
    }
    return d;
  }
  static SnapToGrid(l, e = 8) {
    return new S(Math.round(l.x / e) * e, Math.round(l.y / e) * e);
  }
}
const Et = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
class dl extends S {
  constructor(l = 0, e = 0, c = 0, d = { x: 0, y: 0 }, b = 0, s = 0) {
    super(l, e, c), Object.defineProperty(this, "x", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: l
    }), Object.defineProperty(this, "y", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e
    }), Object.defineProperty(this, "z", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: c
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
  set(l = this.x, e = this.y, c = this.z, d = this.v, b = this.t, s = this.a) {
    return this.x = l, this.y = e, this.z = c, this.v = d, this.t = b, this.a = s, this;
  }
  clone() {
    const { x: l, y: e, z: c, v: d, t: b, a: s } = this, a = { x: d.x, y: d.y };
    return new dl(l, e, c, a, b, s);
  }
  distance(l) {
    return dl.GetDistance(this, l);
  }
  isNear(l, e) {
    return dl.IsNear(this, l, e);
  }
  getAngleByPoints(l, e) {
    return dl.GetAngleByPoints(l, this, e);
  }
  static Sub(l, e) {
    return new dl(l.x - e.x, l.y - e.y);
  }
  static Add(l, e) {
    return new dl(l.x + e.x, l.y + e.y);
  }
  static GetDistance(l, e) {
    return dl.Len(l.clone().sub(e));
  }
  static GetAngleByPoints(l, e, c) {
    const d = e.x - l.x, b = c.x - e.x, s = e.y - l.y, a = c.y - e.y;
    let i = 0;
    const n = Math.sqrt(d * d + s * s), o = Math.sqrt(b * b + a * a);
    if (n && o) {
      const Z = d * b + s * a;
      i = Math.acos(Z / (n * o)), i = i / Math.PI * 180;
      let G = d * a - s * b;
      G = G > 0 ? 1 : -1, i = 180 + G * i;
    }
    return i;
  }
  static IsNear(l, e, c) {
    return dl.Len(l.clone().sub(e)) < c;
  }
  static RotWith(l, e, c, d = 2) {
    const b = l.x - e.x, s = l.y - e.y, a = Math.sin(c), i = Math.cos(c), n = Math.pow(10, d), o = Math.floor((e.x + (b * i - s * a)) * n) / n, Z = Math.floor((e.y + (b * a + s * i)) * n) / n;
    return new dl(o, Z);
  }
  /**
   * 根据圆心和半径，获取圆上的等份点
   * @param o 圆心
   * @param radius 半径
   * @param average 均分数
   * @returns
   */
  static GetDotStroke(l, e, c = 16) {
    const d = new S(1, 1), b = Math.PI + 1e-3, s = dl.Add(l, dl.Sub(l, d).uni().per().mul(-e)), a = [];
    for (let i = 1 / c, n = i; n <= 1; n += i)
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
  static GetSemicircleStroke(l, e, c = -1, d = 8) {
    const b = c * (Math.PI + 1e-3), s = [];
    for (let a = 1 / d, i = a; i <= 1; i += a)
      s.push(dl.RotWith(e, l, b * i));
    return s;
  }
}
var Ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ol(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var At = typeof Ze == "object" && Ze && Ze.Object === Object && Ze, it = At, qt = it, $t = typeof self == "object" && self && self.Object === Object && self, _t = qt || $t || Function("return this")(), zl = _t, ld = zl, ed = ld.Symbol, xe = ed, oc = xe, nt = Object.prototype, cd = nt.hasOwnProperty, td = nt.toString, be = oc ? oc.toStringTag : void 0;
function dd(t) {
  var l = cd.call(t, be), e = t[be];
  try {
    t[be] = void 0;
    var c = !0;
  } catch {
  }
  var d = td.call(t);
  return c && (l ? t[be] = e : delete t[be]), d;
}
var bd = dd, sd = Object.prototype, ad = sd.toString;
function id(t) {
  return ad.call(t);
}
var nd = id, Zc = xe, od = bd, Zd = nd, md = "[object Null]", Gd = "[object Undefined]", mc = Zc ? Zc.toStringTag : void 0;
function ud(t) {
  return t == null ? t === void 0 ? Gd : md : mc && mc in Object(t) ? od(t) : Zd(t);
}
var Dl = ud;
function hd(t) {
  return t != null && typeof t == "object";
}
var gl = hd, pd = Dl, Wd = gl, yd = "[object Number]";
function Xd(t) {
  return typeof t == "number" || Wd(t) && pd(t) == yd;
}
var rd = Xd;
const Wl = /* @__PURE__ */ Ol(rd);
function Vd() {
  this.__data__ = [], this.size = 0;
}
var Yd = Vd;
function Ld(t, l) {
  return t === l || t !== t && l !== l;
}
var Oe = Ld, xd = Oe;
function Rd(t, l) {
  for (var e = t.length; e--; )
    if (xd(t[e][0], l))
      return e;
  return -1;
}
var Re = Rd, Nd = Re, Md = Array.prototype, Td = Md.splice;
function Sd(t) {
  var l = this.__data__, e = Nd(l, t);
  if (e < 0)
    return !1;
  var c = l.length - 1;
  return e == c ? l.pop() : Td.call(l, e, 1), --this.size, !0;
}
var zd = Sd, Id = Re;
function vd(t) {
  var l = this.__data__, e = Id(l, t);
  return e < 0 ? void 0 : l[e][1];
}
var Hd = vd, kd = Re;
function Jd(t) {
  return kd(this.__data__, t) > -1;
}
var Cd = Jd, wd = Re;
function Ud(t, l) {
  var e = this.__data__, c = wd(e, t);
  return c < 0 ? (++this.size, e.push([t, l])) : e[c][1] = l, this;
}
var gd = Ud, Fd = Yd, Kd = zd, jd = Hd, fd = Cd, Pd = gd;
function le(t) {
  var l = -1, e = t == null ? 0 : t.length;
  for (this.clear(); ++l < e; ) {
    var c = t[l];
    this.set(c[0], c[1]);
  }
}
le.prototype.clear = Fd;
le.prototype.delete = Kd;
le.prototype.get = jd;
le.prototype.has = fd;
le.prototype.set = Pd;
var Ne = le, Qd = Ne;
function Bd() {
  this.__data__ = new Qd(), this.size = 0;
}
var Od = Bd;
function Dd(t) {
  var l = this.__data__, e = l.delete(t);
  return this.size = l.size, e;
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
var jl = lb, eb = Dl, cb = jl, tb = "[object AsyncFunction]", db = "[object Function]", bb = "[object GeneratorFunction]", sb = "[object Proxy]";
function ab(t) {
  if (!cb(t))
    return !1;
  var l = eb(t);
  return l == db || l == bb || l == tb || l == sb;
}
var ot = ab, ib = zl, nb = ib["__core-js_shared__"], ob = nb, He = ob, Gc = function() {
  var t = /[^.]+$/.exec(He && He.keys && He.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function Zb(t) {
  return !!Gc && Gc in t;
}
var mb = Zb, Gb = Function.prototype, ub = Gb.toString;
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
var Zt = hb, pb = ot, Wb = mb, yb = jl, Xb = Zt, rb = /[\\^$.*+?()[\]{}|]/g, Vb = /^\[object .+?Constructor\]$/, Yb = Function.prototype, Lb = Object.prototype, xb = Yb.toString, Rb = Lb.hasOwnProperty, Nb = RegExp(
  "^" + xb.call(Rb).replace(rb, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Mb(t) {
  if (!yb(t) || Wb(t))
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
  var e = vb(t, l);
  return Ib(e) ? e : void 0;
}
var El = Hb, kb = El, Jb = zl, Cb = kb(Jb, "Map"), De = Cb, wb = El, Ub = wb(Object, "create"), Me = Ub, uc = Me;
function gb() {
  this.__data__ = uc ? uc(null) : {}, this.size = 0;
}
var Fb = gb;
function Kb(t) {
  var l = this.has(t) && delete this.__data__[t];
  return this.size -= l ? 1 : 0, l;
}
var jb = Kb, fb = Me, Pb = "__lodash_hash_undefined__", Qb = Object.prototype, Bb = Qb.hasOwnProperty;
function Ob(t) {
  var l = this.__data__;
  if (fb) {
    var e = l[t];
    return e === Pb ? void 0 : e;
  }
  return Bb.call(l, t) ? l[t] : void 0;
}
var Db = Ob, Eb = Me, Ab = Object.prototype, qb = Ab.hasOwnProperty;
function $b(t) {
  var l = this.__data__;
  return Eb ? l[t] !== void 0 : qb.call(l, t);
}
var _b = $b, ls = Me, es = "__lodash_hash_undefined__";
function cs(t, l) {
  var e = this.__data__;
  return this.size += this.has(t) ? 0 : 1, e[t] = ls && l === void 0 ? es : l, this;
}
var ts = cs, ds = Fb, bs = jb, ss = Db, as = _b, is = ts;
function ee(t) {
  var l = -1, e = t == null ? 0 : t.length;
  for (this.clear(); ++l < e; ) {
    var c = t[l];
    this.set(c[0], c[1]);
  }
}
ee.prototype.clear = ds;
ee.prototype.delete = bs;
ee.prototype.get = ss;
ee.prototype.has = as;
ee.prototype.set = is;
var ns = ee, hc = ns, os = Ne, Zs = De;
function ms() {
  this.size = 0, this.__data__ = {
    hash: new hc(),
    map: new (Zs || os)(),
    string: new hc()
  };
}
var Gs = ms;
function us(t) {
  var l = typeof t;
  return l == "string" || l == "number" || l == "symbol" || l == "boolean" ? t !== "__proto__" : t === null;
}
var hs = us, ps = hs;
function Ws(t, l) {
  var e = t.__data__;
  return ps(l) ? e[typeof l == "string" ? "string" : "hash"] : e.map;
}
var Te = Ws, ys = Te;
function Xs(t) {
  var l = ys(this, t).delete(t);
  return this.size -= l ? 1 : 0, l;
}
var rs = Xs, Vs = Te;
function Ys(t) {
  return Vs(this, t).get(t);
}
var Ls = Ys, xs = Te;
function Rs(t) {
  return xs(this, t).has(t);
}
var Ns = Rs, Ms = Te;
function Ts(t, l) {
  var e = Ms(this, t), c = e.size;
  return e.set(t, l), this.size += e.size == c ? 0 : 1, this;
}
var Ss = Ts, zs = Gs, Is = rs, vs = Ls, Hs = Ns, ks = Ss;
function ce(t) {
  var l = -1, e = t == null ? 0 : t.length;
  for (this.clear(); ++l < e; ) {
    var c = t[l];
    this.set(c[0], c[1]);
  }
}
ce.prototype.clear = zs;
ce.prototype.delete = Is;
ce.prototype.get = vs;
ce.prototype.has = Hs;
ce.prototype.set = ks;
var mt = ce, Js = Ne, Cs = De, ws = mt, Us = 200;
function gs(t, l) {
  var e = this.__data__;
  if (e instanceof Js) {
    var c = e.__data__;
    if (!Cs || c.length < Us - 1)
      return c.push([t, l]), this.size = ++e.size, this;
    e = this.__data__ = new ws(c);
  }
  return e.set(t, l), this.size = e.size, this;
}
var Fs = gs, Ks = Ne, js = Od, fs = Ed, Ps = qd, Qs = _d, Bs = Fs;
function te(t) {
  var l = this.__data__ = new Ks(t);
  this.size = l.size;
}
te.prototype.clear = js;
te.prototype.delete = fs;
te.prototype.get = Ps;
te.prototype.has = Qs;
te.prototype.set = Bs;
var Gt = te;
function Os(t, l) {
  for (var e = -1, c = t == null ? 0 : t.length; ++e < c && l(t[e], e, t) !== !1; )
    ;
  return t;
}
var Ds = Os, Es = El, As = function() {
  try {
    var t = Es(Object, "defineProperty");
    return t({}, "", {}), t;
  } catch {
  }
}(), qs = As, pc = qs;
function $s(t, l, e) {
  l == "__proto__" && pc ? pc(t, l, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : t[l] = e;
}
var ut = $s, _s = ut, la = Oe, ea = Object.prototype, ca = ea.hasOwnProperty;
function ta(t, l, e) {
  var c = t[l];
  (!(ca.call(t, l) && la(c, e)) || e === void 0 && !(l in t)) && _s(t, l, e);
}
var ht = ta, da = ht, ba = ut;
function sa(t, l, e, c) {
  var d = !e;
  e || (e = {});
  for (var b = -1, s = l.length; ++b < s; ) {
    var a = l[b], i = c ? c(e[a], t[a], a, e, t) : void 0;
    i === void 0 && (i = t[a]), d ? ba(e, a, i) : da(e, a, i);
  }
  return e;
}
var Se = sa;
function aa(t, l) {
  for (var e = -1, c = Array(t); ++e < t; )
    c[e] = l(e);
  return c;
}
var ia = aa, na = Dl, oa = gl, Za = "[object Arguments]";
function ma(t) {
  return oa(t) && na(t) == Za;
}
var Ga = ma, Wc = Ga, ua = gl, pt = Object.prototype, ha = pt.hasOwnProperty, pa = pt.propertyIsEnumerable, Wa = Wc(/* @__PURE__ */ function() {
  return arguments;
}()) ? Wc : function(t) {
  return ua(t) && ha.call(t, "callee") && !pa.call(t, "callee");
}, ya = Wa, Xa = Array.isArray, ze = Xa, ye = { exports: {} };
function ra() {
  return !1;
}
var Va = ra;
ye.exports;
(function(t, l) {
  var e = zl, c = Va, d = l && !l.nodeType && l, b = d && !0 && t && !t.nodeType && t, s = b && b.exports === d, a = s ? e.Buffer : void 0, i = a ? a.isBuffer : void 0, n = i || c;
  t.exports = n;
})(ye, ye.exports);
var Ee = ye.exports, Ya = 9007199254740991, La = /^(?:0|[1-9]\d*)$/;
function xa(t, l) {
  var e = typeof t;
  return l = l ?? Ya, !!l && (e == "number" || e != "symbol" && La.test(t)) && t > -1 && t % 1 == 0 && t < l;
}
var Ra = xa, Na = 9007199254740991;
function Ma(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= Na;
}
var Wt = Ma, Ta = Dl, Sa = Wt, za = gl, Ia = "[object Arguments]", va = "[object Array]", Ha = "[object Boolean]", ka = "[object Date]", Ja = "[object Error]", Ca = "[object Function]", wa = "[object Map]", Ua = "[object Number]", ga = "[object Object]", Fa = "[object RegExp]", Ka = "[object Set]", ja = "[object String]", fa = "[object WeakMap]", Pa = "[object ArrayBuffer]", Qa = "[object DataView]", Ba = "[object Float32Array]", Oa = "[object Float64Array]", Da = "[object Int8Array]", Ea = "[object Int16Array]", Aa = "[object Int32Array]", qa = "[object Uint8Array]", $a = "[object Uint8ClampedArray]", _a = "[object Uint16Array]", li = "[object Uint32Array]", cl = {};
cl[Ba] = cl[Oa] = cl[Da] = cl[Ea] = cl[Aa] = cl[qa] = cl[$a] = cl[_a] = cl[li] = !0;
cl[Ia] = cl[va] = cl[Pa] = cl[Ha] = cl[Qa] = cl[ka] = cl[Ja] = cl[Ca] = cl[wa] = cl[Ua] = cl[ga] = cl[Fa] = cl[Ka] = cl[ja] = cl[fa] = !1;
function ei(t) {
  return za(t) && Sa(t.length) && !!cl[Ta(t)];
}
var ci = ei;
function ti(t) {
  return function(l) {
    return t(l);
  };
}
var Ae = ti, Xe = { exports: {} };
Xe.exports;
(function(t, l) {
  var e = it, c = l && !l.nodeType && l, d = c && !0 && t && !t.nodeType && t, b = d && d.exports === c, s = b && e.process, a = function() {
    try {
      var i = d && d.require && d.require("util").types;
      return i || s && s.binding && s.binding("util");
    } catch {
    }
  }();
  t.exports = a;
})(Xe, Xe.exports);
var qe = Xe.exports, di = ci, bi = Ae, yc = qe, Xc = yc && yc.isTypedArray, si = Xc ? bi(Xc) : di, yt = si, ai = ia, ii = ya, ni = ze, oi = Ee, Zi = Ra, mi = yt, Gi = Object.prototype, ui = Gi.hasOwnProperty;
function hi(t, l) {
  var e = ni(t), c = !e && ii(t), d = !e && !c && oi(t), b = !e && !c && !d && mi(t), s = e || c || d || b, a = s ? ai(t.length, String) : [], i = a.length;
  for (var n in t)
    (l || ui.call(t, n)) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (n == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    d && (n == "offset" || n == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    b && (n == "buffer" || n == "byteLength" || n == "byteOffset") || // Skip index properties.
    Zi(n, i))) && a.push(n);
  return a;
}
var Xt = hi, pi = Object.prototype;
function Wi(t) {
  var l = t && t.constructor, e = typeof l == "function" && l.prototype || pi;
  return t === e;
}
var $e = Wi;
function yi(t, l) {
  return function(e) {
    return t(l(e));
  };
}
var rt = yi, Xi = rt, ri = Xi(Object.keys, Object), Vi = ri, Yi = $e, Li = Vi, xi = Object.prototype, Ri = xi.hasOwnProperty;
function Ni(t) {
  if (!Yi(t))
    return Li(t);
  var l = [];
  for (var e in Object(t))
    Ri.call(t, e) && e != "constructor" && l.push(e);
  return l;
}
var Mi = Ni, Ti = ot, Si = Wt;
function zi(t) {
  return t != null && Si(t.length) && !Ti(t);
}
var Vt = zi, Ii = Xt, vi = Mi, Hi = Vt;
function ki(t) {
  return Hi(t) ? Ii(t) : vi(t);
}
var _e = ki, Ji = Se, Ci = _e;
function wi(t, l) {
  return t && Ji(l, Ci(l), t);
}
var Ui = wi;
function gi(t) {
  var l = [];
  if (t != null)
    for (var e in Object(t))
      l.push(e);
  return l;
}
var Fi = gi, Ki = jl, ji = $e, fi = Fi, Pi = Object.prototype, Qi = Pi.hasOwnProperty;
function Bi(t) {
  if (!Ki(t))
    return fi(t);
  var l = ji(t), e = [];
  for (var c in t)
    c == "constructor" && (l || !Qi.call(t, c)) || e.push(c);
  return e;
}
var Oi = Bi, Di = Xt, Ei = Oi, Ai = Vt;
function qi(t) {
  return Ai(t) ? Di(t, !0) : Ei(t);
}
var lc = qi, $i = Se, _i = lc;
function ln(t, l) {
  return t && $i(l, _i(l), t);
}
var en = ln, re = { exports: {} };
re.exports;
(function(t, l) {
  var e = zl, c = l && !l.nodeType && l, d = c && !0 && t && !t.nodeType && t, b = d && d.exports === c, s = b ? e.Buffer : void 0, a = s ? s.allocUnsafe : void 0;
  function i(n, o) {
    if (o)
      return n.slice();
    var Z = n.length, G = a ? a(Z) : new n.constructor(Z);
    return n.copy(G), G;
  }
  t.exports = i;
})(re, re.exports);
var cn = re.exports;
function tn(t, l) {
  var e = -1, c = t.length;
  for (l || (l = Array(c)); ++e < c; )
    l[e] = t[e];
  return l;
}
var dn = tn;
function bn(t, l) {
  for (var e = -1, c = t == null ? 0 : t.length, d = 0, b = []; ++e < c; ) {
    var s = t[e];
    l(s, e, t) && (b[d++] = s);
  }
  return b;
}
var sn = bn;
function an() {
  return [];
}
var Yt = an, nn = sn, on = Yt, Zn = Object.prototype, mn = Zn.propertyIsEnumerable, rc = Object.getOwnPropertySymbols, Gn = rc ? function(t) {
  return t == null ? [] : (t = Object(t), nn(rc(t), function(l) {
    return mn.call(t, l);
  }));
} : on, ec = Gn, un = Se, hn = ec;
function pn(t, l) {
  return un(t, hn(t), l);
}
var Wn = pn;
function yn(t, l) {
  for (var e = -1, c = l.length, d = t.length; ++e < c; )
    t[d + e] = l[e];
  return t;
}
var Lt = yn, Xn = rt, rn = Xn(Object.getPrototypeOf, Object), xt = rn, Vn = Lt, Yn = xt, Ln = ec, xn = Yt, Rn = Object.getOwnPropertySymbols, Nn = Rn ? function(t) {
  for (var l = []; t; )
    Vn(l, Ln(t)), t = Yn(t);
  return l;
} : xn, Rt = Nn, Mn = Se, Tn = Rt;
function Sn(t, l) {
  return Mn(t, Tn(t), l);
}
var zn = Sn, In = Lt, vn = ze;
function Hn(t, l, e) {
  var c = l(t);
  return vn(t) ? c : In(c, e(t));
}
var Nt = Hn, kn = Nt, Jn = ec, Cn = _e;
function wn(t) {
  return kn(t, Cn, Jn);
}
var Mt = wn, Un = Nt, gn = Rt, Fn = lc;
function Kn(t) {
  return Un(t, Fn, gn);
}
var jn = Kn, fn = El, Pn = zl, Qn = fn(Pn, "DataView"), Bn = Qn, On = El, Dn = zl, En = On(Dn, "Promise"), An = En, qn = El, $n = zl, _n = qn($n, "Set"), lo = _n, eo = El, co = zl, to = eo(co, "WeakMap"), bo = to, Ue = Bn, ge = De, Fe = An, Ke = lo, je = bo, Tt = Dl, de = Zt, Vc = "[object Map]", so = "[object Object]", Yc = "[object Promise]", Lc = "[object Set]", xc = "[object WeakMap]", Rc = "[object DataView]", ao = de(Ue), io = de(ge), no = de(Fe), oo = de(Ke), Zo = de(je), fl = Tt;
(Ue && fl(new Ue(new ArrayBuffer(1))) != Rc || ge && fl(new ge()) != Vc || Fe && fl(Fe.resolve()) != Yc || Ke && fl(new Ke()) != Lc || je && fl(new je()) != xc) && (fl = function(t) {
  var l = Tt(t), e = l == so ? t.constructor : void 0, c = e ? de(e) : "";
  if (c)
    switch (c) {
      case ao:
        return Rc;
      case io:
        return Vc;
      case no:
        return Yc;
      case oo:
        return Lc;
      case Zo:
        return xc;
    }
  return l;
});
var Ie = fl, mo = Object.prototype, Go = mo.hasOwnProperty;
function uo(t) {
  var l = t.length, e = new t.constructor(l);
  return l && typeof t[0] == "string" && Go.call(t, "index") && (e.index = t.index, e.input = t.input), e;
}
var ho = uo, po = zl, Wo = po.Uint8Array, St = Wo, Nc = St;
function yo(t) {
  var l = new t.constructor(t.byteLength);
  return new Nc(l).set(new Nc(t)), l;
}
var cc = yo, Xo = cc;
function ro(t, l) {
  var e = l ? Xo(t.buffer) : t.buffer;
  return new t.constructor(e, t.byteOffset, t.byteLength);
}
var Vo = ro, Yo = /\w*$/;
function Lo(t) {
  var l = new t.constructor(t.source, Yo.exec(t));
  return l.lastIndex = t.lastIndex, l;
}
var xo = Lo, Mc = xe, Tc = Mc ? Mc.prototype : void 0, Sc = Tc ? Tc.valueOf : void 0;
function Ro(t) {
  return Sc ? Object(Sc.call(t)) : {};
}
var No = Ro, Mo = cc;
function To(t, l) {
  var e = l ? Mo(t.buffer) : t.buffer;
  return new t.constructor(e, t.byteOffset, t.length);
}
var So = To, zo = cc, Io = Vo, vo = xo, Ho = No, ko = So, Jo = "[object Boolean]", Co = "[object Date]", wo = "[object Map]", Uo = "[object Number]", go = "[object RegExp]", Fo = "[object Set]", Ko = "[object String]", jo = "[object Symbol]", fo = "[object ArrayBuffer]", Po = "[object DataView]", Qo = "[object Float32Array]", Bo = "[object Float64Array]", Oo = "[object Int8Array]", Do = "[object Int16Array]", Eo = "[object Int32Array]", Ao = "[object Uint8Array]", qo = "[object Uint8ClampedArray]", $o = "[object Uint16Array]", _o = "[object Uint32Array]";
function lZ(t, l, e) {
  var c = t.constructor;
  switch (l) {
    case fo:
      return zo(t);
    case Jo:
    case Co:
      return new c(+t);
    case Po:
      return Io(t, e);
    case Qo:
    case Bo:
    case Oo:
    case Do:
    case Eo:
    case Ao:
    case qo:
    case $o:
    case _o:
      return ko(t, e);
    case wo:
      return new c();
    case Uo:
    case Ko:
      return new c(t);
    case go:
      return vo(t);
    case Fo:
      return new c();
    case jo:
      return Ho(t);
  }
}
var eZ = lZ, cZ = jl, zc = Object.create, tZ = /* @__PURE__ */ function() {
  function t() {
  }
  return function(l) {
    if (!cZ(l))
      return {};
    if (zc)
      return zc(l);
    t.prototype = l;
    var e = new t();
    return t.prototype = void 0, e;
  };
}(), dZ = tZ, bZ = dZ, sZ = xt, aZ = $e;
function iZ(t) {
  return typeof t.constructor == "function" && !aZ(t) ? bZ(sZ(t)) : {};
}
var nZ = iZ, oZ = Ie, ZZ = gl, mZ = "[object Map]";
function GZ(t) {
  return ZZ(t) && oZ(t) == mZ;
}
var uZ = GZ, hZ = uZ, pZ = Ae, Ic = qe, vc = Ic && Ic.isMap, WZ = vc ? pZ(vc) : hZ, yZ = WZ, XZ = Ie, rZ = gl, VZ = "[object Set]";
function YZ(t) {
  return rZ(t) && XZ(t) == VZ;
}
var LZ = YZ, xZ = LZ, RZ = Ae, Hc = qe, kc = Hc && Hc.isSet, NZ = kc ? RZ(kc) : xZ, MZ = NZ, TZ = Gt, SZ = Ds, zZ = ht, IZ = Ui, vZ = en, HZ = cn, kZ = dn, JZ = Wn, CZ = zn, wZ = Mt, UZ = jn, gZ = Ie, FZ = ho, KZ = eZ, jZ = nZ, fZ = ze, PZ = Ee, QZ = yZ, BZ = jl, OZ = MZ, DZ = _e, EZ = lc, AZ = 1, qZ = 2, $Z = 4, zt = "[object Arguments]", _Z = "[object Array]", lm = "[object Boolean]", em = "[object Date]", cm = "[object Error]", It = "[object Function]", tm = "[object GeneratorFunction]", dm = "[object Map]", bm = "[object Number]", vt = "[object Object]", sm = "[object RegExp]", am = "[object Set]", im = "[object String]", nm = "[object Symbol]", om = "[object WeakMap]", Zm = "[object ArrayBuffer]", mm = "[object DataView]", Gm = "[object Float32Array]", um = "[object Float64Array]", hm = "[object Int8Array]", pm = "[object Int16Array]", Wm = "[object Int32Array]", ym = "[object Uint8Array]", Xm = "[object Uint8ClampedArray]", rm = "[object Uint16Array]", Vm = "[object Uint32Array]", el = {};
el[zt] = el[_Z] = el[Zm] = el[mm] = el[lm] = el[em] = el[Gm] = el[um] = el[hm] = el[pm] = el[Wm] = el[dm] = el[bm] = el[vt] = el[sm] = el[am] = el[im] = el[nm] = el[ym] = el[Xm] = el[rm] = el[Vm] = !0;
el[cm] = el[It] = el[om] = !1;
function pe(t, l, e, c, d, b) {
  var s, a = l & AZ, i = l & qZ, n = l & $Z;
  if (e && (s = d ? e(t, c, d, b) : e(t)), s !== void 0)
    return s;
  if (!BZ(t))
    return t;
  var o = fZ(t);
  if (o) {
    if (s = FZ(t), !a)
      return kZ(t, s);
  } else {
    var Z = gZ(t), G = Z == It || Z == tm;
    if (PZ(t))
      return HZ(t, a);
    if (Z == vt || Z == zt || G && !d) {
      if (s = i || G ? {} : jZ(t), !a)
        return i ? CZ(t, vZ(s, t)) : JZ(t, IZ(s, t));
    } else {
      if (!el[Z])
        return d ? t : {};
      s = KZ(t, Z, a);
    }
  }
  b || (b = new TZ());
  var m = b.get(t);
  if (m)
    return m;
  b.set(t, s), OZ(t) ? t.forEach(function(V) {
    s.add(pe(V, l, e, V, t, b));
  }) : QZ(t) && t.forEach(function(V, u) {
    s.set(u, pe(V, l, e, u, t, b));
  });
  var p = n ? i ? UZ : wZ : i ? EZ : DZ, X = o ? void 0 : p(t);
  return SZ(X || t, function(V, u) {
    X && (u = V, V = t[u]), zZ(s, u, pe(V, l, e, u, t, b));
  }), s;
}
var Ht = pe, Ym = Ht, Lm = 1, xm = 4;
function Rm(t) {
  return Ym(t, Lm | xm);
}
var Nm = Rm;
const sl = /* @__PURE__ */ Ol(Nm);
var y;
(function(t) {
  t[t.Pencil = 1] = "Pencil", t[t.Eraser = 2] = "Eraser", t[t.Selector = 3] = "Selector", t[t.Clicker = 4] = "Clicker", t[t.Arrow = 5] = "Arrow", t[t.Hand = 6] = "Hand", t[t.LaserPen = 7] = "LaserPen", t[t.Text = 8] = "Text", t[t.Straight = 9] = "Straight", t[t.Rectangle = 10] = "Rectangle", t[t.Ellipse = 11] = "Ellipse", t[t.Star = 12] = "Star", t[t.Triangle = 13] = "Triangle", t[t.Rhombus = 14] = "Rhombus", t[t.Polygon = 15] = "Polygon", t[t.SpeechBalloon = 16] = "SpeechBalloon", t[t.Image = 17] = "Image";
})(y || (y = {}));
var Q;
(function(t) {
  t[t.Local = 1] = "Local", t[t.Service = 2] = "Service", t[t.Worker = 3] = "Worker";
})(Q || (Q = {}));
var L;
(function(t) {
  t[t.Pending = 0] = "Pending", t[t.Start = 1] = "Start", t[t.Doing = 2] = "Doing", t[t.Done = 3] = "Done", t[t.Freeze = 4] = "Freeze", t[t.Unwritable = 5] = "Unwritable";
})(L || (L = {}));
var M;
(function(t) {
  t[t.None = 0] = "None", t[t.Init = 1] = "Init", t[t.UpdateCamera = 2] = "UpdateCamera", t[t.UpdateTools = 3] = "UpdateTools", t[t.CreateWork = 4] = "CreateWork", t[t.DrawWork = 5] = "DrawWork", t[t.FullWork = 6] = "FullWork", t[t.UpdateNode = 7] = "UpdateNode", t[t.RemoveNode = 8] = "RemoveNode", t[t.Clear = 9] = "Clear", t[t.Select = 10] = "Select", t[t.Destroy = 11] = "Destroy", t[t.Snapshot = 12] = "Snapshot", t[t.BoundingBox = 13] = "BoundingBox", t[t.Cursor = 14] = "Cursor", t[t.TextUpdate = 15] = "TextUpdate", t[t.GetTextActive = 16] = "GetTextActive", t[t.TasksQueue = 17] = "TasksQueue", t[t.CursorHover = 18] = "CursorHover";
})(M || (M = {}));
var ae;
(function(t) {
  t.Webgl2 = "webgl2", t.Webgl = "webgl", t.Canvas2d = "2d";
})(ae || (ae = {}));
var Il;
(function(t) {
  t[t.Float = 1] = "Float", t[t.Bg = 2] = "Bg", t[t.Selector = 3] = "Selector", t[t.ServiceFloat = 4] = "ServiceFloat", t[t.None = 5] = "None";
})(Il || (Il = {}));
var Ql;
(function(t) {
  t[t.Cursor = 1] = "Cursor", t[t.TextCreate = 2] = "TextCreate";
})(Ql || (Ql = {}));
var Pl;
(function(t) {
  t[t.Top = 1] = "Top", t[t.Bottom = 2] = "Bottom";
})(Pl || (Pl = {}));
var rl;
(function(t) {
  t[t.none = 1] = "none", t[t.all = 2] = "all", t[t.both = 3] = "both", t[t.proportional = 4] = "proportional";
})(rl || (rl = {}));
function Mm(t) {
  return JSON.parse(Pt(t));
}
function Tm(t) {
  return Qt(JSON.stringify(t));
}
const Yl = Object.keys;
var fe;
(function(t) {
  t[t.pedding = 0] = "pedding", t[t.mounted = 1] = "mounted", t[t.update = 2] = "update", t[t.unmounted = 3] = "unmounted";
})(fe || (fe = {}));
var Ve;
(function(t) {
  t[t.Normal = 0] = "Normal", t[t.Stroke = 1] = "Stroke", t[t.Dotted = 2] = "Dotted", t[t.LongDotted = 3] = "LongDotted";
})(Ve || (Ve = {}));
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
var Jc;
(function(t) {
  t[t.MainView = 0] = "MainView", t[t.Plugin = 1] = "Plugin", t[t.Both = 2] = "Both";
})(Jc || (Jc = {}));
const vl = "++", z = "selector", Sm = "all";
var zm = "__lodash_hash_undefined__";
function Im(t) {
  return this.__data__.set(t, zm), this;
}
var vm = Im;
function Hm(t) {
  return this.__data__.has(t);
}
var km = Hm, Jm = mt, Cm = vm, wm = km;
function Ye(t) {
  var l = -1, e = t == null ? 0 : t.length;
  for (this.__data__ = new Jm(); ++l < e; )
    this.add(t[l]);
}
Ye.prototype.add = Ye.prototype.push = Cm;
Ye.prototype.has = wm;
var Um = Ye;
function gm(t, l) {
  for (var e = -1, c = t == null ? 0 : t.length; ++e < c; )
    if (l(t[e], e, t))
      return !0;
  return !1;
}
var Fm = gm;
function Km(t, l) {
  return t.has(l);
}
var jm = Km, fm = Um, Pm = Fm, Qm = jm, Bm = 1, Om = 2;
function Dm(t, l, e, c, d, b) {
  var s = e & Bm, a = t.length, i = l.length;
  if (a != i && !(s && i > a))
    return !1;
  var n = b.get(t), o = b.get(l);
  if (n && o)
    return n == l && o == t;
  var Z = -1, G = !0, m = e & Om ? new fm() : void 0;
  for (b.set(t, l), b.set(l, t); ++Z < a; ) {
    var p = t[Z], X = l[Z];
    if (c)
      var V = s ? c(X, p, Z, l, t, b) : c(p, X, Z, t, l, b);
    if (V !== void 0) {
      if (V)
        continue;
      G = !1;
      break;
    }
    if (m) {
      if (!Pm(l, function(u, r) {
        if (!Qm(m, r) && (p === u || d(p, u, e, c, b)))
          return m.push(r);
      })) {
        G = !1;
        break;
      }
    } else if (!(p === X || d(p, X, e, c, b))) {
      G = !1;
      break;
    }
  }
  return b.delete(t), b.delete(l), G;
}
var kt = Dm;
function Em(t) {
  var l = -1, e = Array(t.size);
  return t.forEach(function(c, d) {
    e[++l] = [d, c];
  }), e;
}
var Am = Em;
function qm(t) {
  var l = -1, e = Array(t.size);
  return t.forEach(function(c) {
    e[++l] = c;
  }), e;
}
var $m = qm, Cc = xe, wc = St, _m = Oe, lG = kt, eG = Am, cG = $m, tG = 1, dG = 2, bG = "[object Boolean]", sG = "[object Date]", aG = "[object Error]", iG = "[object Map]", nG = "[object Number]", oG = "[object RegExp]", ZG = "[object Set]", mG = "[object String]", GG = "[object Symbol]", uG = "[object ArrayBuffer]", hG = "[object DataView]", Uc = Cc ? Cc.prototype : void 0, ke = Uc ? Uc.valueOf : void 0;
function pG(t, l, e, c, d, b, s) {
  switch (e) {
    case hG:
      if (t.byteLength != l.byteLength || t.byteOffset != l.byteOffset)
        return !1;
      t = t.buffer, l = l.buffer;
    case uG:
      return !(t.byteLength != l.byteLength || !b(new wc(t), new wc(l)));
    case bG:
    case sG:
    case nG:
      return _m(+t, +l);
    case aG:
      return t.name == l.name && t.message == l.message;
    case oG:
    case mG:
      return t == l + "";
    case iG:
      var a = eG;
    case ZG:
      var i = c & tG;
      if (a || (a = cG), t.size != l.size && !i)
        return !1;
      var n = s.get(t);
      if (n)
        return n == l;
      c |= dG, s.set(t, l);
      var o = lG(a(t), a(l), c, d, b, s);
      return s.delete(t), o;
    case GG:
      if (ke)
        return ke.call(t) == ke.call(l);
  }
  return !1;
}
var WG = pG, gc = Mt, yG = 1, XG = Object.prototype, rG = XG.hasOwnProperty;
function VG(t, l, e, c, d, b) {
  var s = e & yG, a = gc(t), i = a.length, n = gc(l), o = n.length;
  if (i != o && !s)
    return !1;
  for (var Z = i; Z--; ) {
    var G = a[Z];
    if (!(s ? G in l : rG.call(l, G)))
      return !1;
  }
  var m = b.get(t), p = b.get(l);
  if (m && p)
    return m == l && p == t;
  var X = !0;
  b.set(t, l), b.set(l, t);
  for (var V = s; ++Z < i; ) {
    G = a[Z];
    var u = t[G], r = l[G];
    if (c)
      var W = s ? c(r, u, G, l, t, b) : c(u, r, G, t, l, b);
    if (!(W === void 0 ? u === r || d(u, r, e, c, b) : W)) {
      X = !1;
      break;
    }
    V || (V = G == "constructor");
  }
  if (X && !V) {
    var x = t.constructor, Y = l.constructor;
    x != Y && "constructor" in t && "constructor" in l && !(typeof x == "function" && x instanceof x && typeof Y == "function" && Y instanceof Y) && (X = !1);
  }
  return b.delete(t), b.delete(l), X;
}
var YG = VG, Je = Gt, LG = kt, xG = WG, RG = YG, Fc = Ie, Kc = ze, jc = Ee, NG = yt, MG = 1, fc = "[object Arguments]", Pc = "[object Array]", me = "[object Object]", TG = Object.prototype, Qc = TG.hasOwnProperty;
function SG(t, l, e, c, d, b) {
  var s = Kc(t), a = Kc(l), i = s ? Pc : Fc(t), n = a ? Pc : Fc(l);
  i = i == fc ? me : i, n = n == fc ? me : n;
  var o = i == me, Z = n == me, G = i == n;
  if (G && jc(t)) {
    if (!jc(l))
      return !1;
    s = !0, o = !1;
  }
  if (G && !o)
    return b || (b = new Je()), s || NG(t) ? LG(t, l, e, c, d, b) : xG(t, l, i, e, c, d, b);
  if (!(e & MG)) {
    var m = o && Qc.call(t, "__wrapped__"), p = Z && Qc.call(l, "__wrapped__");
    if (m || p) {
      var X = m ? t.value() : t, V = p ? l.value() : l;
      return b || (b = new Je()), d(X, V, e, c, b);
    }
  }
  return G ? (b || (b = new Je()), RG(t, l, e, c, d, b)) : !1;
}
var zG = SG, IG = zG, Bc = gl;
function Jt(t, l, e, c, d) {
  return t === l ? !0 : t == null || l == null || !Bc(t) && !Bc(l) ? t !== t && l !== l : IG(t, l, e, c, Jt, d);
}
var vG = Jt, HG = vG;
function kG(t, l) {
  return HG(t, l);
}
var JG = kG;
const Zl = /* @__PURE__ */ Ol(JG);
var CG = Dl, wG = gl, UG = "[object Boolean]";
function gG(t) {
  return t === !0 || t === !1 || wG(t) && CG(t) == UG;
}
var FG = gG;
const Vl = /* @__PURE__ */ Ol(FG);
function Ct(t, l) {
  if (t && l) {
    const e = Math.min(t.originX, l.originX), c = Math.min(t.originY, l.originY), d = Math.max(t.originX + t.width, l.originX + l.width), b = Math.max(t.originY + t.height, l.originY + l.height), s = d - e, a = b - c;
    return { originX: e, originY: c, width: s, height: a };
  }
  return l || t;
}
const _l = (t, l) => new Promise(function(e) {
  window.requestIdleCallback ? requestIdleCallback(() => {
    e(1);
  }, { timeout: l }) : setTimeout(() => {
    e(2);
  }, l);
}).then(function() {
  t();
}, () => {
  t();
}), tc = (t) => {
  const l = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
  return Math.max(1, (window.devicePixelRatio || 1) / l);
};
class wt {
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
class Cl extends wt {
  constructor(l, e) {
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
    }), Cl.syncInterval = (e || Cl.syncInterval) * 0.5, this.namespace = Cl.namespace, this.serviceStorage = this.getNamespaceData(), this.storage = sl(this.serviceStorage);
  }
  getViewIdBySecenPath(l) {
    const e = this.getNamespaceData();
    for (const [c, d] of Object.entries(e))
      for (const b of Object.keys(d))
        if (b === l)
          return c;
  }
  getScenePathData(l) {
    const e = this.getNamespaceData();
    for (const c of Object.values(e))
      for (const d of Object.keys(c))
        if (d === l)
          return sl(c[d]);
  }
  getStorageData(l, e) {
    const c = this.getNamespaceData();
    return c[l] && sl(c[l][e]) || void 0;
  }
  hasSelector(l, e) {
    const c = this.storage && this.storage[l] && this.storage[l][e];
    return !!(c && Object.keys(c).find((d) => this.isOwn(d) && this.getLocalId(d) === z));
  }
  addStorageStateListener(l) {
    this.stateDisposer = bt(async () => {
      const e = this.getNamespaceData(), c = this.diffFun(this.serviceStorage, e);
      this.serviceStorage = e;
      for (const [d, b] of Object.entries(c))
        if (b && b.newValue === void 0) {
          const { viewId: s, scenePath: a } = b;
          s && a && this.storage[s] && delete this.storage[s][a][d];
        } else if (b && b.newValue) {
          const { viewId: s, scenePath: a } = b;
          this.storage[s] || (this.storage[s] = {}), this.storage[s][a] || (this.storage[s][a] = {}), this.storage[s][a][d] = sl(b.newValue);
        }
      Object.keys(c).length > 0 && l(c);
    });
  }
  removeStorageStateListener() {
    this.stateDisposer && this.stateDisposer();
  }
  diffFun(l, e) {
    const c = Yl(l), d = Yl(e), b = {};
    for (const s of c) {
      if (Zl(l[s], e[s]))
        continue;
      const a = this.diffFunByscenePath(l[s] || {}, e[s] || {}, s);
      Object.assign(b, a);
    }
    for (const s of d)
      if (!c.includes(s)) {
        const a = this.diffFunByscenePath(l[s] || {}, e[s] || {}, s);
        Object.assign(b, a);
      }
    return b;
  }
  diffFunByscenePath(l, e, c) {
    const d = Yl(l), b = Yl(e), s = {};
    for (const a of d) {
      if (Zl(l[a], e[a]))
        continue;
      const i = this.diffFunByKeys(l[a] || {}, e[a] || {}, a, c);
      Object.assign(s, i);
    }
    for (const a of b)
      if (!d.includes(a)) {
        const i = this.diffFunByKeys(l[a] || {}, e[a] || {}, a, c);
        Object.assign(s, i);
      }
    return s;
  }
  diffFunByKeys(l, e, c, d) {
    const b = Yl(l), s = Yl(e), a = {};
    for (const i of b) {
      if (s.includes(i)) {
        if (Zl(l[i], e[i]))
          continue;
        a[i] = {
          oldValue: l[i],
          newValue: e[i],
          viewId: d,
          scenePath: c
        };
        continue;
      }
      a[i] = {
        oldValue: l[i],
        newValue: void 0,
        viewId: d,
        scenePath: c
      };
    }
    for (const i of s)
      b.includes(i) || (a[i] = {
        oldValue: void 0,
        newValue: e[i],
        viewId: d,
        scenePath: c
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
    const { type: e, workId: c, ops: d, index: b, opt: s, toolsType: a, removeIds: i, updateNodeOpt: n, op: o, selectIds: Z, isSync: G, scenePath: m, viewId: p } = l;
    if (p)
      switch (e) {
        case M.Clear:
          const X = {};
          m && this.storage[p] && this.storage[p][m] ? (delete this.storage[p][m], this.setState(X, { isSync: G, viewId: p, scenePath: m })) : this.storage[p] && (delete this.storage[p], this.setState(X, { isSync: G, viewId: p, scenePath: "" }));
          break;
        case M.CreateWork:
          if (m && c && a && s) {
            const x = this.isLocalId(c.toString()) ? this.transformKey(c) : c;
            this.updateValue(x.toString(), {
              type: M.CreateWork,
              workId: c,
              toolsType: a,
              opt: s
            }, { isSync: G, viewId: p, scenePath: m });
          }
          break;
        case M.DrawWork:
          if (m && c && typeof b == "number" && (o != null && o.length)) {
            const x = this.isLocalId(c.toString()) ? this.transformKey(c) : c, Y = this.storage[p] && this.storage[p][m] && this.storage[p][m][x] || void 0, N = b ? ((Y == null ? void 0 : Y.op) || []).slice(0, b).concat(o) : o || (Y == null ? void 0 : Y.op);
            Y && N && this.updateValue(x.toString(), {
              ...Y,
              type: M.DrawWork,
              op: N,
              index: b
            }, { isSync: G, viewId: p, scenePath: m });
          }
          break;
        case M.FullWork:
          if (m && c) {
            const x = this.isLocalId(c.toString()) ? this.transformKey(c) : c, Y = this.storage[p] && this.storage[p][m] && this.storage[p][m][x] || void 0, N = n || (Y == null ? void 0 : Y.updateNodeOpt), T = a || (Y == null ? void 0 : Y.toolsType), I = s || (Y == null ? void 0 : Y.opt), C = d || (Y == null ? void 0 : Y.ops);
            T && I && this.updateValue(x.toString(), {
              type: M.FullWork,
              updateNodeOpt: N,
              workId: x,
              toolsType: T,
              opt: I,
              ops: C
            }, { isSync: G, viewId: p, scenePath: m });
          }
          break;
        case M.RemoveNode:
          if (m && (i != null && i.length)) {
            const x = i.map((Y) => this.isLocalId(Y + "") ? this.transformKey(Y) : Y);
            this.storage[p] && this.storage[p][m] && Object.keys(this.storage[p][m]).map((Y) => {
              x != null && x.includes(Y) && this.updateValue(Y, void 0, { isSync: G, viewId: p, scenePath: m });
            });
          }
          break;
        case M.UpdateNode:
          if (m && c && (n || d || s)) {
            const x = this.isLocalId(c.toString()) ? this.transformKey(c) : c, Y = this.storage[p] && this.storage[p][m] && this.storage[p][m][x] || void 0;
            Y && (Y.updateNodeOpt = n, (d || o) && (Y.ops = d, Y.op = o), s && (Y.opt = s), Y.type = M.FullWork, this.updateValue(x.toString(), Y, { isSync: G, viewId: p, scenePath: m }));
          }
          break;
        case M.Select:
          if (!m)
            return;
          let V;
          Z != null && Z.length && (V = Z.map((x) => this.isLocalId(x + "") ? this.transformKey(x) : x));
          const u = this.transformKey(z), r = this.storage[p] && this.storage[p][m] && this.storage[p][m][u] || void 0, W = s || (r == null ? void 0 : r.opt);
          V && this.checkOtherSelector(u, V, { isSync: G, viewId: p, scenePath: m }), this.updateValue(u, V && {
            type: M.Select,
            toolsType: y.Selector,
            opt: W,
            selectIds: V
          }, { isSync: G, viewId: p, scenePath: m });
          break;
      }
  }
  checkOtherSelector(l, e, c) {
    const { viewId: d, scenePath: b } = c;
    for (const s of Object.keys(this.storage[d][b]))
      if (s !== l && this.getLocalId(s) === z) {
        const a = this.storage[d][b][s];
        if (a && a.selectIds) {
          const i = a.selectIds.filter((n) => !e.includes(n));
          i.length > 0 && (a.selectIds = i), this.updateValue(s, i.length && a || void 0, c);
        }
      }
  }
  setState(l, e) {
    const { viewId: c, scenePath: d } = e, b = Yl(l);
    for (let s = 0; s < b.length; s++) {
      const a = b[s], i = l[a];
      typeof i < "u" ? (this.storage[c] || (this.storage[c] = {}), this.storage[c][d] || (this.storage[c][d] = {}), this.storage[c][d][a] = i) : delete this.storage[c][d][a];
    }
    this.runSyncService(e);
  }
  updateValue(l, e, c) {
    const { viewId: d, scenePath: b } = c;
    e === void 0 ? delete this.storage[d][b][l] : (this.storage[d] || (this.storage[d] = {}), this.storage[d][b] || (this.storage[d][b] = {}), this.storage[d][b][l] = e), this.runSyncService(c);
  }
  runSyncService(l) {
    this.asyncClockState || (this.asyncClockState = !0, setTimeout(() => {
      l.isSync ? (this.asyncClockState = !1, this.syncSerivice(l.isAfterUpdate)) : _l(() => {
        this.asyncClockState = !1, this.syncSerivice(l.isAfterUpdate);
      }, Cl.syncInterval);
    }, l != null && l.isSync ? 0 : Cl.syncInterval));
  }
  syncSerivice(l = !1) {
    const e = Yl(this.serviceStorage), c = Yl(this.storage), d = /* @__PURE__ */ new Map();
    for (const b of e) {
      if (!c.includes(b)) {
        d.set(b, void 0);
        continue;
      }
      Zl(this.serviceStorage[b], this.storage[b]) || this.syncViewData(b, l);
    }
    for (const b of c)
      e.includes(b) || d.set(b, this.storage[b]);
    if (d.size > 5)
      this.syncStorageView(this.storage, l);
    else
      for (const [b, s] of d.entries())
        this.syncUpdataView(b, s, l);
  }
  syncViewData(l, e = !1) {
    const c = Yl(this.serviceStorage[l]), d = Yl(this.storage[l]), b = /* @__PURE__ */ new Map();
    for (const s of c) {
      if (!d.includes(s)) {
        b.set(s, void 0);
        continue;
      }
      Zl(this.serviceStorage[l][s], this.storage[l][s]) || this.syncScenePathData(l, s, e);
    }
    for (const s of d)
      c.includes(s) || b.set(s, this.storage[l][s]);
    if (b.size > 5)
      this.syncStorageScenePath(l, this.storage[l], e);
    else
      for (const [s, a] of b.entries())
        this.syncUpdataScenePath(l, s, a, e);
  }
  syncScenePathData(l, e, c = !1) {
    const d = Yl(this.serviceStorage[l][e]), b = Yl(this.storage[l][e]), s = /* @__PURE__ */ new Map();
    for (const a of d) {
      if (!b.includes(a)) {
        s.set(a, void 0);
        continue;
      }
      Zl(this.serviceStorage[l][e][a], this.storage[l][e][a]) || s.set(a, this.storage[l][e][a]);
    }
    for (const a of b)
      d.includes(a) || s.set(a, this.storage[l][e][a]);
    if (s.size > 5)
      this.syncStorageKey(l, e, this.storage[l][e], c);
    else
      for (const [a, i] of s.entries())
        this.syncUpdataKey(l, e, a, i, c);
  }
  syncUpdataView(l, e, c = !1) {
    var b;
    Object.keys(this.serviceStorage).length ? (c || (e === void 0 ? delete this.serviceStorage[l] : this.serviceStorage[l] = sl(e)), (b = this.plugin) == null || b.updateAttributes([this.namespace, l], e)) : this.syncStorageView(this.storage, c);
  }
  syncStorageView(l, e = !1) {
    var c;
    e || l && (this.serviceStorage = sl(l)), (c = this.plugin) == null || c.updateAttributes([this.namespace], l);
  }
  syncUpdataScenePath(l, e, c, d = !1) {
    var s;
    Object.keys(this.serviceStorage[l]).length ? (d || (c === void 0 ? delete this.serviceStorage[l][e] : this.serviceStorage[l][e] = c), (s = this.plugin) == null || s.updateAttributes([this.namespace, l, e], c)) : this.syncStorageScenePath(l, this.storage[l], d);
  }
  syncStorageScenePath(l, e, c = !1) {
    var d;
    c || e && (this.serviceStorage[l] = e), (d = this.plugin) == null || d.updateAttributes([this.namespace, l], e);
  }
  syncUpdataKey(l, e, c, d, b = !1) {
    var a;
    Object.keys(this.serviceStorage[l][e]).length ? (b || (d === void 0 ? delete this.serviceStorage[l][e][c] : this.serviceStorage[l][e][c] = d), (a = this.plugin) == null || a.updateAttributes([this.namespace, l, e, c], d)) : this.syncStorageKey(l, e, this.storage[l][e], b);
  }
  syncStorageKey(l, e, c, d = !1) {
    var b;
    d || (this.serviceStorage[l][e] = c), (b = this.plugin) == null || b.updateAttributes([this.namespace, l, e], c);
  }
  keyTransformWorkId(l) {
    const e = l.split(vl);
    return e.length === 2 ? e[1] : l;
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
class KG {
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
  executChangeUidHook(l, e) {
    const c = {
      online: e.map((d) => {
        var b;
        return ((b = d.payload) == null ? void 0 : b.uid) || d.session;
      }),
      offline: l.map((d) => {
        var b;
        return ((b = d.payload) == null ? void 0 : b.uid) || d.session;
      })
    };
    this.onChangeHooks.forEach((d) => d(c));
  }
  getRoomMember(l) {
    return this.roomMembers.find((e) => {
      var c;
      return ((c = e.payload) == null ? void 0 : c.uid) === l;
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
class ol {
  createProxy(l) {
    const e = new Proxy(l, {
      get(c, d, b) {
        const s = ol.interceptors.hasOwnProperty(d) ? ol.interceptors : c;
        return Reflect.get(s, d, b);
      }
    });
    return ol.proxyToRaw.set(e, l), e;
  }
}
Object.defineProperty(ol, "proxyToRaw", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /* @__PURE__ */ new WeakMap()
});
Object.defineProperty(ol, "interceptors", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    entries(...t) {
      return ol.proxyToRaw.get(this).entries(...t);
    },
    forEach(...t) {
      return ol.proxyToRaw.get(this).forEach(...t);
    },
    size() {
      return ol.proxyToRaw.get(this).size;
    },
    get(t) {
      return ol.proxyToRaw.get(this).get(t);
    },
    set(t, l) {
      return ol.proxyToRaw.get(this).set(t, l);
    },
    delete(t, l) {
      return ol.proxyToRaw.get(this).delete(t);
    },
    clear() {
      return ol.proxyToRaw.get(this).clear();
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
    const { control: e, internalMsgEmitter: c } = l;
    this.control = e, this.internalMsgEmitter = c;
    const d = /* @__PURE__ */ new Map();
    this.proxyMap = new ol();
    const b = this, s = ol.interceptors.set;
    ol.interceptors.set = function(i, n) {
      return b.interceptors.set(i, n), s.call(this, i, n);
    };
    const a = ol.interceptors.delete;
    ol.interceptors.delete = function(i, n) {
      return b.interceptors.delete(i, n), a.call(this, i);
    }, this.editors = this.proxyMap.createProxy(d);
  }
  get collector() {
    return this.control.collector;
  }
  filterEditor(l) {
    const e = /* @__PURE__ */ new Map();
    return this.editors.forEach((c, d) => {
      c.viewId === l && e.set(d, c);
    }), e;
  }
  get interceptors() {
    return {
      set: (l, e) => {
        var m, p, X, V, u, r, W, x;
        if (!this.collector)
          return !0;
        const { viewId: c, scenePath: d, canSync: b, canWorker: s, type: a, opt: i, dataType: n } = e;
        if (!s && !b)
          return !0;
        const Z = ((m = this.collector) == null ? void 0 : m.isLocalId(l)) ? (p = this.collector) == null ? void 0 : p.transformKey(l) : l, G = ((X = this.collector) == null ? void 0 : X.storage[c]) && this.collector.storage[c][d] && this.collector.storage[c][d][Z] || void 0;
        G ? G.toolsType === y.Text && (s && (this.control.worker.queryTaskBatchData({
          workId: l,
          msgType: M.UpdateNode
        }).forEach((Y) => {
          var N;
          (N = this.control.worker) == null || N.taskBatchData.delete(Y);
        }), (W = this.control.worker) == null || W.taskBatchData.add({
          workId: l,
          msgType: M.UpdateNode,
          dataType: n || Q.Local,
          toolsType: y.Text,
          opt: i,
          viewId: c,
          scenePath: d
          // willSyncService: canSync
        }), (x = this.control.worker) == null || x.runAnimation()), b && _l(() => {
          var Y;
          (Y = this.collector) == null || Y.dispatch({
            type: M.UpdateNode,
            workId: l,
            toolsType: y.Text,
            opt: i,
            viewId: c,
            scenePath: d
          });
        }, this.control.worker.maxLastSyncTime)) : a === Rl.Text && (b && ((V = this.collector) == null || V.dispatch({
          type: i.text && M.FullWork || M.CreateWork,
          workId: l,
          toolsType: y.Text,
          opt: i,
          isSync: !0,
          viewId: c,
          scenePath: d
        })), s && ((u = this.control.worker) == null || u.taskBatchData.add({
          workId: l,
          msgType: i.text && M.FullWork || M.CreateWork,
          dataType: n || Q.Local,
          toolsType: y.Text,
          opt: i,
          viewId: c,
          scenePath: d
        }), (r = this.control.worker) == null || r.runAnimation()));
      },
      delete: (l) => {
        var a, i;
        if (!this.collector)
          return !0;
        const e = this.editors.get(l);
        if (!e)
          return !0;
        const { viewId: c, scenePath: d, canSync: b, canWorker: s } = e;
        if (!s && !b)
          return !0;
        s && ((a = this.control.worker) == null || a.taskBatchData.add({
          workId: l,
          toolsType: y.Text,
          msgType: M.RemoveNode,
          dataType: Q.Local,
          viewId: c,
          scenePath: d
        }), (i = this.control.worker) == null || i.runAnimation()), b && _l(() => {
          var n;
          (n = this.collector) == null || n.dispatch({
            type: M.RemoveNode,
            removeIds: [l],
            toolsType: y.Text,
            viewId: c,
            scenePath: d
          });
        }, this.control.worker.maxLastSyncTime);
      },
      clear() {
        return !0;
      }
    };
  }
  computeTextActive(l, e) {
    var b, s, a, i;
    const c = (b = this.control.viewContainerManager) == null ? void 0 : b.transformToScenePoint(l, e), d = (s = this.control.viewContainerManager) == null ? void 0 : s.getCurScenePath(e);
    e && d && ((a = this.control.worker) == null || a.taskBatchData.add({
      msgType: M.GetTextActive,
      dataType: Q.Local,
      op: c,
      viewId: e,
      scenePath: d
    }), (i = this.control.worker) == null || i.runAnimation());
  }
  checkEmptyTextBlur() {
    if (this.activeId) {
      const l = this.editors.get(this.activeId), e = (l == null ? void 0 : l.opt.text) && (l == null ? void 0 : l.opt.text.replace(/\s*,/g, "")), c = l == null ? void 0 : l.viewId;
      e ? this.unActive() : this.delete(this.activeId, !0, !0), this.undoTickerId && c && (this.internalMsgEmitter.emit("undoTickerEnd", this.undoTickerId, c, !0), this.undoTickerId = void 0);
    }
  }
  onCameraChange(l, e) {
    var c, d;
    for (const [b, s] of this.editors.entries())
      if (s.viewId === e) {
        const { boxPoint: a, boxSize: i } = s.opt, n = a && ((c = this.control.viewContainerManager) == null ? void 0 : c.transformToOriginPoint(a, s.viewId)), o = (d = this.control.viewContainerManager) == null ? void 0 : d.getCurScenePath(e);
        if (o && e) {
          const Z = {
            x: n && n[0] || 0,
            y: n && n[1] || 0,
            w: i && i[0] || 0,
            h: i && i[1] || 0,
            opt: s.opt,
            scale: l.scale,
            type: Rl.Text,
            viewId: e,
            scenePath: o,
            canWorker: !1,
            canSync: !1
          };
          this.editors.set(b, Z), this.control.viewContainerManager.setActiveTextEditor(e, this.activeId);
        }
      }
  }
  onServiceDerive(l) {
    var p, X;
    const { workId: e, opt: c, msgType: d, viewId: b, scenePath: s, dataType: a } = l;
    if (!e || !b || !s)
      return;
    const i = e.toString();
    if (d === M.RemoveNode) {
      console.log("onServiceDerive-d", i), this.delete(i, !0, !0);
      return;
    }
    const { boxPoint: n, boxSize: o } = c, Z = n && ((p = this.control.viewContainerManager) == null ? void 0 : p.transformToOriginPoint(n, b)), G = this.control.viewContainerManager.getView(b), m = {
      x: Z && Z[0] || 0,
      y: Z && Z[1] || 0,
      w: o && o[0] || 0,
      h: o && o[1] || 0,
      opt: c,
      type: Rl.Text,
      canWorker: !0,
      canSync: !1,
      dataType: a,
      // dataType: this.collector?.isLocalId(workIdStr) ? EDataType.Local : EDataType.Service,
      scale: ((X = G == null ? void 0 : G.cameraOpt) == null ? void 0 : X.scale) || 1,
      viewId: b,
      scenePath: s
    };
    this.editors.set(i, m), a === Q.Service && c.workState === L.Done && this.activeId === i && (this.activeId = void 0), console.log("onServiceDerive---1", i, m.opt.text, m.opt.uid, this.activeId, a), this.control.viewContainerManager.setActiveTextEditor(b, this.activeId);
  }
  updateForViewEdited(l, e) {
    var d;
    this.editors.set(l, e);
    const c = (d = this.taskqueue.get(l)) == null ? void 0 : d.resolve;
    c && c(e);
  }
  active(l) {
    var c;
    const e = this.editors.get(l);
    e && e.viewId && (e.opt.workState = L.Start, e.opt.uid = (c = this.collector) == null ? void 0 : c.uid, this.activeId = l, e.canWorker = !0, e.canSync = !0, console.log("onServiceDerive---0", e.opt.uid), this.editors.set(l, e), this.control.viewContainerManager.setActiveTextEditor(e.viewId, this.activeId));
  }
  unActive() {
    const l = this.activeId && this.editors.get(this.activeId);
    l && l.viewId && this.activeId && (l.opt.workState = L.Done, l.opt.uid = void 0, l.canWorker = !0, l.canSync = !0, this.editors.set(this.activeId, l), this.activeId = void 0, this.control.viewContainerManager.setActiveTextEditor(l.viewId, this.activeId));
  }
  createTextForMasterController(l, e) {
    var s;
    const { workId: c, isActive: d, ...b } = l;
    b.opt.zIndex = this.getMaxZIndex() + 1, b.opt.uid = (s = this.collector) == null ? void 0 : s.uid, e && (this.undoTickerId = e, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, b.viewId)), d && (this.activeId = c), b.dataType = Q.Local, b.canWorker = !0, b.canSync = !0, this.editors.set(c, b), this.control.viewContainerManager.setActiveTextEditor(b.viewId, this.activeId);
  }
  updateTextForMasterController(l, e) {
    var s;
    const { workId: c, ...d } = l;
    e && (this.undoTickerId = e, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, d.viewId));
    const b = this.editors.get(c) || {};
    d.opt && (d.opt.uid = (s = this.collector) == null ? void 0 : s.uid), d.dataType = Q.Local, this.editors.set(c, { ...b, ...d }), this.control.viewContainerManager.setActiveTextEditor(d.viewId, this.activeId);
  }
  async updateTextControllerWithEffectAsync(l, e) {
    var n;
    const { workId: c, ...d } = l;
    e && (this.undoTickerId = e, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, d.viewId));
    const b = this.editors.get(c) || {};
    if (d.opt && (d.opt.uid = (n = this.collector) == null ? void 0 : n.uid), d.dataType = Q.Local, this.editors.set(c, { ...b, ...d }), this.control.viewContainerManager.setActiveTextEditor(d.viewId, this.activeId), this.taskqueue.has(c))
      return;
    const s = setTimeout(() => {
      var Z;
      const o = (Z = this.taskqueue.get(c)) == null ? void 0 : Z.resolve;
      o && o(void 0);
    }, 20), a = await new Promise((o) => {
      this.taskqueue.set(c, { resolve: o, clocker: s });
    }), i = this.taskqueue.get(c);
    return i && (i.clocker && clearTimeout(i.clocker), this.taskqueue.delete(c)), this.taskqueue.delete(c), a;
  }
  updateTextForWorker(l, e) {
    const { workId: c, isActive: d, ...b } = l;
    e && (this.undoTickerId = e, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, b.viewId));
    const a = { ...this.editors.get(c) || {}, ...b };
    if (d) {
      a.canWorker = !1, a.canSync = !1, this.editors.set(c, a), this.active(c);
      return;
    }
    this.editors.set(c, a), this.control.viewContainerManager.setActiveTextEditor(b.viewId, this.activeId);
  }
  get(l) {
    return this.editors.get(l);
  }
  delete(l, e, c) {
    const d = this.editors.get(l);
    if (d) {
      const b = d.viewId;
      d.canSync = e, d.canWorker = c, this.editors.delete(l), this.activeId === l && (this.activeId = void 0), this.control.viewContainerManager.setActiveTextEditor(b, this.activeId);
    }
  }
  deleteBatch(l, e, c) {
    const d = /* @__PURE__ */ new Set();
    for (const b of l) {
      const s = this.editors.get(b);
      if (s) {
        const a = s.viewId;
        s.canSync = e, s.canWorker = c, this.editors.delete(b), this.activeId === b && (this.activeId = void 0), d.add(a);
      }
    }
    for (const b of d)
      this.control.viewContainerManager.setActiveTextEditor(b, this.activeId);
  }
  clear(l, e) {
    this.editors.forEach((c, d) => {
      c.viewId === l && (e && (c.canSync = !1), c.canWorker = !1, this.editors.delete(d));
    }), this.activeId = void 0, this.control.viewContainerManager.setActiveTextEditor(l, this.activeId);
  }
  destory() {
    this.editors.clear(), this.activeId = void 0;
  }
  getMaxZIndex() {
    let l = 0;
    return this.editors.forEach((e) => {
      e.opt.zIndex && e.opt.zIndex > l && (l = e.opt.zIndex);
    }), l;
  }
}
class wl extends wt {
  constructor(l, e) {
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
    }), this.namespace = wl.namespace, wl.syncInterval = (e || wl.syncInterval) * 0.5, this.serviceStorage = this.getNamespaceData(), this.storage = sl(this.serviceStorage);
  }
  addStorageStateListener(l) {
    this.stateDisposer = bt(async () => {
      const e = this.getNamespaceData(), c = this.getDiffMap(this.serviceStorage, e);
      this.serviceStorage = e, c.size && l(c);
    });
  }
  getDiffMap(l, e) {
    const c = /* @__PURE__ */ new Map();
    for (const [d, b] of Object.entries(e))
      d !== this.uid && (b && Zl(l[d], b) || b && c.set(d, b));
    return c;
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
    const { type: e, op: c, isSync: d, viewId: b } = l;
    switch (e) {
      case Ql.Cursor:
        c && this.pushValue(this.uid, {
          type: Ql.Cursor,
          op: c,
          viewId: b
        }, { isSync: d });
        break;
    }
  }
  pushValue(l, e, c) {
    var d;
    this.storage[l] || (this.storage[l] = []), (d = this.storage[l]) == null || d.push(e), this.runSyncService(c);
  }
  clearValue(l) {
    var c;
    this.storage[l] = void 0, Object.keys(this.serviceStorage).length && ((c = this.plugin) == null || c.updateAttributes([this.namespace, l], void 0));
  }
  runSyncService(l) {
    this.asyncClockTimer || (this.asyncClockTimer = setTimeout(() => {
      l != null && l.isSync ? (this.asyncClockTimer = void 0, this.syncSerivice()) : _l(() => {
        this.asyncClockTimer = void 0, this.syncSerivice();
      }, wl.syncInterval);
    }, l != null && l.isSync ? 0 : wl.syncInterval));
  }
  syncSerivice() {
    var e;
    Object.keys(this.serviceStorage).length ? Object.keys(this.storage).forEach((c) => {
      var d;
      (d = this.plugin) == null || d.updateAttributes([this.namespace, c], this.storage[c]);
    }) : (e = this.plugin) == null || e.updateAttributes(this.namespace, this.storage), this.storage = {};
  }
  destroy() {
    this.removeStorageStateListener(), this.storage = {}, this.serviceStorage = {};
  }
}
Object.defineProperty(wl, "syncInterval", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 100
});
Object.defineProperty(wl, "namespace", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "PluginEvent"
});
var Oc;
(function(t) {
  t[t.Event = 0] = "Event", t[t.Storage = 1] = "Storage";
})(Oc || (Oc = {}));
class fG {
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
    const { control: e, internalMsgEmitter: c } = l;
    this.internalMsgEmitter = c, this.control = e, this.roomMember = e.roomMember;
  }
  activeCollector() {
    var l, e;
    this.control.plugin && (this.eventCollector = new wl(this.control.plugin, Math.min(((e = (l = this.control.pluginOptions) == null ? void 0 : l.syncOpt) == null ? void 0 : e.interval) || 100, 100)), this.eventCollector.addStorageStateListener((c) => {
      c.forEach((d, b) => {
        var s;
        if (((s = this.eventCollector) == null ? void 0 : s.uid) !== b) {
          const a = /* @__PURE__ */ new Map();
          d == null || d.forEach((i) => {
            if (i && i.type === Ql.Cursor && i.op && i.viewId) {
              const n = [];
              for (let o = 0; o < i.op.length; o += 2) {
                const Z = i.op[o], G = i.op[o + 1];
                if (Wl(Z) && Wl(G)) {
                  const m = this.control.viewContainerManager.transformToOriginPoint([Z, G], i.viewId);
                  n.push(m[0], m[1]);
                } else
                  n.push(Z, G);
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
    for (const c of this.animationDrawWorkers.keys()) {
      const d = this.getUidAndviewId(c).uid, b = this.getUidAndviewId(c).viewId;
      b !== l && this.activeDrawWorkShape(d, [void 0, void 0], L.Done, b);
    }
    const e = /* @__PURE__ */ new Map();
    for (const c of this.animationPointWorkers.keys()) {
      const d = this.getUidAndviewId(c).uid, b = this.getUidAndviewId(c).viewId;
      if (b !== l) {
        const s = e.get(d) || /* @__PURE__ */ new Map();
        s.set(b, [void 0, void 0]), e.set(d, s);
      }
    }
    if (e.size)
      for (const [c, d] of e.entries())
        this.activePointWorkShape(c, d);
    this.runAnimation();
  }
  activePointWorkShape(l, e) {
    var d;
    if (this.roomMember.getRoomMember(l))
      for (const [b, s] of e.entries()) {
        const a = this.getKey(l, b);
        let i = !1;
        const n = this.control.viewContainerManager.getAllViews().map((Z) => Z == null ? void 0 : Z.id);
        for (const Z of n)
          if (Z && Z !== b) {
            const G = this.getKey(l, Z), m = this.animationDrawWorkers.get(G);
            if ((m == null ? void 0 : m.workState) === L.Start || (m == null ? void 0 : m.workState) === L.Doing || !1) {
              i = !0;
              break;
            } else if (this.removeTimerId && (clearTimeout(this.removeTimerId), this.removeTimerId = void 0), m)
              this.activeDrawWorkShape(l, [void 0, void 0], L.Done, Z), this.runAnimation();
            else {
              const X = this.animationPointWorkers.get(G);
              if (X)
                X.animationWorkData = [void 0, void 0], X.animationIndex = 0, X.freeze = !1;
              else {
                const V = {
                  animationIndex: 0,
                  animationWorkData: [void 0, void 0],
                  freeze: !1
                };
                this.animationPointWorkers.set(G, V);
              }
            }
          }
        const o = this.animationPointWorkers.get(a);
        if (s) {
          if (!o) {
            const Z = {
              animationIndex: 0,
              animationWorkData: s,
              freeze: i
            };
            (d = this.animationPointWorkers) == null || d.set(a, Z);
            return;
          }
          o.animationWorkData = s, o.animationIndex = 0, o.freeze = i;
        }
      }
  }
  getKey(l, e) {
    return `${l}${vl}${e}`;
  }
  getUidAndviewId(l) {
    const [e, c] = l.split(vl);
    return { uid: e, viewId: c };
  }
  animationCursor() {
    this.animationId = void 0;
    const l = Date.now();
    this.animationPointWorkers.forEach((e, c) => {
      const { uid: d, viewId: b } = this.getUidAndviewId(c);
      if (e.freeze)
        return;
      const a = e.animationIndex, i = this.roomMember.getRoomMember(d);
      if (i) {
        e.animationWorkData.length - 1 > a && (e.animationIndex = a + 2);
        const n = e.animationWorkData[a], o = e.animationWorkData[a + 1], Z = this.cursorInfoMap.get(b) || /* @__PURE__ */ new Map();
        Wl(n) && Wl(o) ? Z.set(i.memberId, { x: n, y: o, roomMember: i, timestamp: l }) : Z.has(i.memberId) && Z.delete(i.memberId), Z.size ? this.cursorInfoMap.set(b, Z) : this.cursorInfoMap.has(b) && (this.cursorInfoMap.delete(b), this.internalMsgEmitter.emit([F.Cursor, b], [])), e.animationWorkData.length - 1 <= e.animationIndex && this.animationPointWorkers.delete(c);
      }
    }), this.animationDrawWorkers.forEach((e, c) => {
      const { uid: d, viewId: b } = this.getUidAndviewId(c), s = e.animationIndex, a = this.roomMember.getRoomMember(d);
      if (a) {
        e.animationWorkData.length - 1 > s && (e.animationIndex = s + 2);
        const i = e.animationWorkData[s], n = e.animationWorkData[s + 1], o = this.cursorInfoMap.get(b) || /* @__PURE__ */ new Map();
        Wl(i) && Wl(n) ? o.set(a.memberId, { x: i, y: n, roomMember: a, timestamp: l }) : o.has(a.memberId) && o.delete(a.memberId), o.size ? this.cursorInfoMap.set(b, o) : this.cursorInfoMap.has(b) && (this.cursorInfoMap.delete(b), this.internalMsgEmitter.emit([F.Cursor, b], [])), e.animationWorkData.length - 1 <= e.animationIndex && this.animationDrawWorkers.delete(c);
      }
    });
    for (const [e, c] of this.cursorInfoMap)
      if (c) {
        const d = [], b = [];
        for (const [s, a] of c.entries()) {
          const { timestamp: i, ...n } = a;
          i + this.expirationTime < l ? b.push(s) : d.push(n);
        }
        if (b.length)
          for (const s of b)
            c.delete(s);
        c.size ? this.cursorInfoMap.set(e, c) : this.cursorInfoMap.delete(e), this.internalMsgEmitter.emit([F.Cursor, e], d);
      }
    (this.animationPointWorkers.size || this.animationDrawWorkers.size || this.cursorInfoMap.size) && this.runAnimation();
  }
  activeDrawWorkShape(l, e, c, d) {
    var i, n;
    if (!this.roomMember.getRoomMember(l))
      return;
    const s = this.getKey(l, d);
    if (c === L.Start) {
      const o = this.animationPointWorkers.get(s);
      if (o)
        o.animationWorkData = [], o.animationIndex = 0, o.freeze = !0;
      else {
        const Z = {
          animationIndex: 0,
          animationWorkData: [],
          freeze: !0
        };
        (i = this.animationDrawWorkers) == null || i.set(s, Z);
      }
    } else if (c === L.Done) {
      const o = this.animationPointWorkers.get(s);
      o && (o.freeze = !1);
    }
    const a = this.animationDrawWorkers.get(s);
    if (e) {
      if (!a) {
        const o = {
          animationIndex: 0,
          animationWorkData: e,
          workState: c
        };
        (n = this.animationDrawWorkers) == null || n.set(s, o);
        return;
      }
      a.animationWorkData = e, a.animationIndex = 0, a.workState = c;
    }
  }
  runAnimation() {
    this.animationId || (this.animationId = requestAnimationFrame(this.animationCursor.bind(this)));
  }
  sendEvent(l, e) {
    var c;
    (c = this.eventCollector) == null || c.dispatch({
      type: Ql.Cursor,
      op: Wl(l[0]) && Wl(l[1]) && this.control.viewContainerManager.transformToScenePoint(l, e) || [void 0, void 0],
      viewId: e
    });
  }
  collectServiceCursor(l) {
    const { op: e, uid: c, workState: d, viewId: b } = l;
    if (c && e && d && b) {
      const s = this.control.viewContainerManager.focuedViewId;
      if (d === L.Done) {
        if (b !== s) {
          this.activeDrawWorkShape(c, [void 0, void 0], d, b), this.runAnimation();
          return;
        }
        this.removeTimerId && (clearTimeout(this.removeTimerId), this.removeTimerId = void 0, this.asyncEndInfo && this.asyncEndInfo.viewId !== b && this.asyncEndInfo.uid === c && this.activeDrawWorkShape(c, [void 0, void 0], L.Done, this.asyncEndInfo.viewId)), this.asyncEndInfo = { uid: c, viewId: b }, this.removeTimerId = setTimeout(() => {
          this.removeTimerId = void 0, this.activeDrawWorkShape(c, [void 0, void 0], L.Done, b), this.runAnimation();
        }, this.expirationTime);
      }
      if (Wl(e[0]) && Wl(e[1])) {
        const a = this.control.viewContainerManager.transformToOriginPoint(e, b);
        this.activeDrawWorkShape(c, a, d, b);
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
const Ut = "c2VsZi5pbXBvcnRTY3JpcHRzKCJodHRwczovL3VucGtnLmNvbS9zcHJpdGVqc0AzL2Rpc3Qvc3ByaXRlanMuanMiKTsoZnVuY3Rpb24oeil7InVzZSBzdHJpY3QiO3ZhciBBZT10eXBlb2YgZ2xvYmFsVGhpczwidSI/Z2xvYmFsVGhpczp0eXBlb2Ygd2luZG93PCJ1Ij93aW5kb3c6dHlwZW9mIGdsb2JhbDwidSI/Z2xvYmFsOnR5cGVvZiBzZWxmPCJ1Ij9zZWxmOnt9O2Z1bmN0aW9uIG1lKG8pe3JldHVybiBvJiZvLl9fZXNNb2R1bGUmJk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCJkZWZhdWx0Iik/by5kZWZhdWx0Om99ZnVuY3Rpb24gZm8oKXt0aGlzLl9fZGF0YV9fPVtdLHRoaXMuc2l6ZT0wfXZhciBwbz1mbztmdW5jdGlvbiB5byhvLGUpe3JldHVybiBvPT09ZXx8byE9PW8mJmUhPT1lfXZhciBWZT15byx3bz1WZTtmdW5jdGlvbiBtbyhvLGUpe2Zvcih2YXIgdD1vLmxlbmd0aDt0LS07KWlmKHdvKG9bdF1bMF0sZSkpcmV0dXJuIHQ7cmV0dXJuLTF9dmFyIE1lPW1vLGdvPU1lLGJvPUFycmF5LnByb3RvdHlwZSx2bz1iby5zcGxpY2U7ZnVuY3Rpb24gU28obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PWdvKGUsbyk7aWYodDwwKXJldHVybiExO3ZhciByPWUubGVuZ3RoLTE7cmV0dXJuIHQ9PXI/ZS5wb3AoKTp2by5jYWxsKGUsdCwxKSwtLXRoaXMuc2l6ZSwhMH12YXIga289U28sUG89TWU7ZnVuY3Rpb24gVG8obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PVBvKGUsbyk7cmV0dXJuIHQ8MD92b2lkIDA6ZVt0XVsxXX12YXIgSW89VG8seG89TWU7ZnVuY3Rpb24gT28obyl7cmV0dXJuIHhvKHRoaXMuX19kYXRhX18sbyk+LTF9dmFyIExvPU9vLENvPU1lO2Z1bmN0aW9uIE5vKG8sZSl7dmFyIHQ9dGhpcy5fX2RhdGFfXyxyPUNvKHQsbyk7cmV0dXJuIHI8MD8oKyt0aGlzLnNpemUsdC5wdXNoKFtvLGVdKSk6dFtyXVsxXT1lLHRoaXN9dmFyIFdvPU5vLFJvPXBvLEFvPWtvLE1vPUlvLCRvPUxvLERvPVdvO2Z1bmN0aW9uIGdlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fWdlLnByb3RvdHlwZS5jbGVhcj1SbyxnZS5wcm90b3R5cGUuZGVsZXRlPUFvLGdlLnByb3RvdHlwZS5nZXQ9TW8sZ2UucHJvdG90eXBlLmhhcz0kbyxnZS5wcm90b3R5cGUuc2V0PURvO3ZhciAkZT1nZSxqbz0kZTtmdW5jdGlvbiBGbygpe3RoaXMuX19kYXRhX189bmV3IGpvLHRoaXMuc2l6ZT0wfXZhciBCbz1GbztmdW5jdGlvbiBfbyhvKXt2YXIgZT10aGlzLl9fZGF0YV9fLHQ9ZS5kZWxldGUobyk7cmV0dXJuIHRoaXMuc2l6ZT1lLnNpemUsdH12YXIgRW89X287ZnVuY3Rpb24gem8obyl7cmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KG8pfXZhciBVbz16bztmdW5jdGlvbiBHbyhvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMobyl9dmFyIFhvPUdvLEhvPXR5cGVvZiBBZT09Im9iamVjdCImJkFlJiZBZS5PYmplY3Q9PT1PYmplY3QmJkFlLFN0PUhvLFlvPVN0LHFvPXR5cGVvZiBzZWxmPT0ib2JqZWN0IiYmc2VsZiYmc2VsZi5PYmplY3Q9PT1PYmplY3QmJnNlbGYsWm89WW98fHFvfHxGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpLGllPVpvLFFvPWllLEpvPVFvLlN5bWJvbCxEZT1KbyxrdD1EZSxQdD1PYmplY3QucHJvdG90eXBlLEtvPVB0Lmhhc093blByb3BlcnR5LFZvPVB0LnRvU3RyaW5nLExlPWt0P2t0LnRvU3RyaW5nVGFnOnZvaWQgMDtmdW5jdGlvbiBlcyhvKXt2YXIgZT1Lby5jYWxsKG8sTGUpLHQ9b1tMZV07dHJ5e29bTGVdPXZvaWQgMDt2YXIgcj0hMH1jYXRjaHt9dmFyIGk9Vm8uY2FsbChvKTtyZXR1cm4gciYmKGU/b1tMZV09dDpkZWxldGUgb1tMZV0pLGl9dmFyIHRzPWVzLHJzPU9iamVjdC5wcm90b3R5cGUsb3M9cnMudG9TdHJpbmc7ZnVuY3Rpb24gc3Mobyl7cmV0dXJuIG9zLmNhbGwobyl9dmFyIGlzPXNzLFR0PURlLG5zPXRzLGFzPWlzLGxzPSJbb2JqZWN0IE51bGxdIixjcz0iW29iamVjdCBVbmRlZmluZWRdIixJdD1UdD9UdC50b1N0cmluZ1RhZzp2b2lkIDA7ZnVuY3Rpb24gdXMobyl7cmV0dXJuIG89PW51bGw/bz09PXZvaWQgMD9jczpsczpJdCYmSXQgaW4gT2JqZWN0KG8pP25zKG8pOmFzKG8pfXZhciBmZT11cztmdW5jdGlvbiBocyhvKXt2YXIgZT10eXBlb2YgbztyZXR1cm4gbyE9bnVsbCYmKGU9PSJvYmplY3QifHxlPT0iZnVuY3Rpb24iKX12YXIgdWU9aHMsZHM9ZmUsZnM9dWUscHM9IltvYmplY3QgQXN5bmNGdW5jdGlvbl0iLHlzPSJbb2JqZWN0IEZ1bmN0aW9uXSIsd3M9IltvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dIixtcz0iW29iamVjdCBQcm94eV0iO2Z1bmN0aW9uIGdzKG8pe2lmKCFmcyhvKSlyZXR1cm4hMTt2YXIgZT1kcyhvKTtyZXR1cm4gZT09eXN8fGU9PXdzfHxlPT1wc3x8ZT09bXN9dmFyIHh0PWdzLGJzPWllLHZzPWJzWyJfX2NvcmUtanNfc2hhcmVkX18iXSxTcz12cyxldD1TcyxPdD1mdW5jdGlvbigpe3ZhciBvPS9bXi5dKyQvLmV4ZWMoZXQmJmV0LmtleXMmJmV0LmtleXMuSUVfUFJPVE98fCIiKTtyZXR1cm4gbz8iU3ltYm9sKHNyYylfMS4iK286IiJ9KCk7ZnVuY3Rpb24ga3Mobyl7cmV0dXJuISFPdCYmT3QgaW4gb312YXIgUHM9a3MsVHM9RnVuY3Rpb24ucHJvdG90eXBlLElzPVRzLnRvU3RyaW5nO2Z1bmN0aW9uIHhzKG8pe2lmKG8hPW51bGwpe3RyeXtyZXR1cm4gSXMuY2FsbChvKX1jYXRjaHt9dHJ5e3JldHVybiBvKyIifWNhdGNoe319cmV0dXJuIiJ9dmFyIEx0PXhzLE9zPXh0LExzPVBzLENzPXVlLE5zPUx0LFdzPS9bXFxeJC4qKz8oKVtcXXt9fF0vZyxScz0vXlxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXF0kLyxBcz1GdW5jdGlvbi5wcm90b3R5cGUsTXM9T2JqZWN0LnByb3RvdHlwZSwkcz1Bcy50b1N0cmluZyxEcz1Ncy5oYXNPd25Qcm9wZXJ0eSxqcz1SZWdFeHAoIl4iKyRzLmNhbGwoRHMpLnJlcGxhY2UoV3MsIlxcJCYiKS5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcKCl8IGZvciAuKz8oPz1cXFxdKS9nLCIkMS4qPyIpKyIkIik7ZnVuY3Rpb24gRnMobyl7aWYoIUNzKG8pfHxMcyhvKSlyZXR1cm4hMTt2YXIgZT1PcyhvKT9qczpScztyZXR1cm4gZS50ZXN0KE5zKG8pKX12YXIgQnM9RnM7ZnVuY3Rpb24gX3MobyxlKXtyZXR1cm4gbz09bnVsbD92b2lkIDA6b1tlXX12YXIgRXM9X3MsenM9QnMsVXM9RXM7ZnVuY3Rpb24gR3MobyxlKXt2YXIgdD1VcyhvLGUpO3JldHVybiB6cyh0KT90OnZvaWQgMH12YXIgcGU9R3MsWHM9cGUsSHM9aWUsWXM9WHMoSHMsIk1hcCIpLHR0PVlzLHFzPXBlLFpzPXFzKE9iamVjdCwiY3JlYXRlIiksamU9WnMsQ3Q9amU7ZnVuY3Rpb24gUXMoKXt0aGlzLl9fZGF0YV9fPUN0P0N0KG51bGwpOnt9LHRoaXMuc2l6ZT0wfXZhciBKcz1RcztmdW5jdGlvbiBLcyhvKXt2YXIgZT10aGlzLmhhcyhvKSYmZGVsZXRlIHRoaXMuX19kYXRhX19bb107cmV0dXJuIHRoaXMuc2l6ZS09ZT8xOjAsZX12YXIgVnM9S3MsZWk9amUsdGk9Il9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18iLHJpPU9iamVjdC5wcm90b3R5cGUsb2k9cmkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gc2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztpZihlaSl7dmFyIHQ9ZVtvXTtyZXR1cm4gdD09PXRpP3ZvaWQgMDp0fXJldHVybiBvaS5jYWxsKGUsbyk/ZVtvXTp2b2lkIDB9dmFyIGlpPXNpLG5pPWplLGFpPU9iamVjdC5wcm90b3R5cGUsbGk9YWkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gY2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztyZXR1cm4gbmk/ZVtvXSE9PXZvaWQgMDpsaS5jYWxsKGUsbyl9dmFyIHVpPWNpLGhpPWplLGRpPSJfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fIjtmdW5jdGlvbiBmaShvLGUpe3ZhciB0PXRoaXMuX19kYXRhX187cmV0dXJuIHRoaXMuc2l6ZSs9dGhpcy5oYXMobyk/MDoxLHRbb109aGkmJmU9PT12b2lkIDA/ZGk6ZSx0aGlzfXZhciBwaT1maSx5aT1Kcyx3aT1WcyxtaT1paSxnaT11aSxiaT1waTtmdW5jdGlvbiBiZShvKXt2YXIgZT0tMSx0PW89PW51bGw/MDpvLmxlbmd0aDtmb3IodGhpcy5jbGVhcigpOysrZTx0Oyl7dmFyIHI9b1tlXTt0aGlzLnNldChyWzBdLHJbMV0pfX1iZS5wcm90b3R5cGUuY2xlYXI9eWksYmUucHJvdG90eXBlLmRlbGV0ZT13aSxiZS5wcm90b3R5cGUuZ2V0PW1pLGJlLnByb3RvdHlwZS5oYXM9Z2ksYmUucHJvdG90eXBlLnNldD1iaTt2YXIgdmk9YmUsTnQ9dmksU2k9JGUsa2k9dHQ7ZnVuY3Rpb24gUGkoKXt0aGlzLnNpemU9MCx0aGlzLl9fZGF0YV9fPXtoYXNoOm5ldyBOdCxtYXA6bmV3KGtpfHxTaSksc3RyaW5nOm5ldyBOdH19dmFyIFRpPVBpO2Z1bmN0aW9uIElpKG8pe3ZhciBlPXR5cGVvZiBvO3JldHVybiBlPT0ic3RyaW5nInx8ZT09Im51bWJlciJ8fGU9PSJzeW1ib2wifHxlPT0iYm9vbGVhbiI/byE9PSJfX3Byb3RvX18iOm89PT1udWxsfXZhciB4aT1JaSxPaT14aTtmdW5jdGlvbiBMaShvLGUpe3ZhciB0PW8uX19kYXRhX187cmV0dXJuIE9pKGUpP3RbdHlwZW9mIGU9PSJzdHJpbmciPyJzdHJpbmciOiJoYXNoIl06dC5tYXB9dmFyIEZlPUxpLENpPUZlO2Z1bmN0aW9uIE5pKG8pe3ZhciBlPUNpKHRoaXMsbykuZGVsZXRlKG8pO3JldHVybiB0aGlzLnNpemUtPWU/MTowLGV9dmFyIFdpPU5pLFJpPUZlO2Z1bmN0aW9uIEFpKG8pe3JldHVybiBSaSh0aGlzLG8pLmdldChvKX12YXIgTWk9QWksJGk9RmU7ZnVuY3Rpb24gRGkobyl7cmV0dXJuICRpKHRoaXMsbykuaGFzKG8pfXZhciBqaT1EaSxGaT1GZTtmdW5jdGlvbiBCaShvLGUpe3ZhciB0PUZpKHRoaXMsbykscj10LnNpemU7cmV0dXJuIHQuc2V0KG8sZSksdGhpcy5zaXplKz10LnNpemU9PXI/MDoxLHRoaXN9dmFyIF9pPUJpLEVpPVRpLHppPVdpLFVpPU1pLEdpPWppLFhpPV9pO2Z1bmN0aW9uIHZlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fXZlLnByb3RvdHlwZS5jbGVhcj1FaSx2ZS5wcm90b3R5cGUuZGVsZXRlPXppLHZlLnByb3RvdHlwZS5nZXQ9VWksdmUucHJvdG90eXBlLmhhcz1HaSx2ZS5wcm90b3R5cGUuc2V0PVhpO3ZhciBXdD12ZSxIaT0kZSxZaT10dCxxaT1XdCxaaT0yMDA7ZnVuY3Rpb24gUWkobyxlKXt2YXIgdD10aGlzLl9fZGF0YV9fO2lmKHQgaW5zdGFuY2VvZiBIaSl7dmFyIHI9dC5fX2RhdGFfXztpZighWWl8fHIubGVuZ3RoPFppLTEpcmV0dXJuIHIucHVzaChbbyxlXSksdGhpcy5zaXplPSsrdC5zaXplLHRoaXM7dD10aGlzLl9fZGF0YV9fPW5ldyBxaShyKX1yZXR1cm4gdC5zZXQobyxlKSx0aGlzLnNpemU9dC5zaXplLHRoaXN9dmFyIEppPVFpLEtpPSRlLFZpPUJvLGVuPUVvLHRuPVVvLHJuPVhvLG9uPUppO2Z1bmN0aW9uIFNlKG8pe3ZhciBlPXRoaXMuX19kYXRhX189bmV3IEtpKG8pO3RoaXMuc2l6ZT1lLnNpemV9U2UucHJvdG90eXBlLmNsZWFyPVZpLFNlLnByb3RvdHlwZS5kZWxldGU9ZW4sU2UucHJvdG90eXBlLmdldD10bixTZS5wcm90b3R5cGUuaGFzPXJuLFNlLnByb3RvdHlwZS5zZXQ9b247dmFyIFJ0PVNlO2Z1bmN0aW9uIHNuKG8sZSl7Zm9yKHZhciB0PS0xLHI9bz09bnVsbD8wOm8ubGVuZ3RoOysrdDxyJiZlKG9bdF0sdCxvKSE9PSExOyk7cmV0dXJuIG99dmFyIG5uPXNuLGFuPXBlLGxuPWZ1bmN0aW9uKCl7dHJ5e3ZhciBvPWFuKE9iamVjdCwiZGVmaW5lUHJvcGVydHkiKTtyZXR1cm4gbyh7fSwiIix7fSksb31jYXRjaHt9fSgpLGNuPWxuLEF0PWNuO2Z1bmN0aW9uIHVuKG8sZSx0KXtlPT0iX19wcm90b19fIiYmQXQ/QXQobyxlLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx2YWx1ZTp0LHdyaXRhYmxlOiEwfSk6b1tlXT10fXZhciBNdD11bixobj1NdCxkbj1WZSxmbj1PYmplY3QucHJvdG90eXBlLHBuPWZuLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIHluKG8sZSx0KXt2YXIgcj1vW2VdOyghKHBuLmNhbGwobyxlKSYmZG4ocix0KSl8fHQ9PT12b2lkIDAmJiEoZSBpbiBvKSkmJmhuKG8sZSx0KX12YXIgJHQ9eW4sd249JHQsbW49TXQ7ZnVuY3Rpb24gZ24obyxlLHQscil7dmFyIGk9IXQ7dHx8KHQ9e30pO2Zvcih2YXIgcz0tMSxuPWUubGVuZ3RoOysrczxuOyl7dmFyIGE9ZVtzXSxsPXI/cih0W2FdLG9bYV0sYSx0LG8pOnZvaWQgMDtsPT09dm9pZCAwJiYobD1vW2FdKSxpP21uKHQsYSxsKTp3bih0LGEsbCl9cmV0dXJuIHR9dmFyIEJlPWduO2Z1bmN0aW9uIGJuKG8sZSl7Zm9yKHZhciB0PS0xLHI9QXJyYXkobyk7Kyt0PG87KXJbdF09ZSh0KTtyZXR1cm4gcn12YXIgdm49Ym47ZnVuY3Rpb24gU24obyl7cmV0dXJuIG8hPW51bGwmJnR5cGVvZiBvPT0ib2JqZWN0In12YXIgY2U9U24sa249ZmUsUG49Y2UsVG49IltvYmplY3QgQXJndW1lbnRzXSI7ZnVuY3Rpb24gSW4obyl7cmV0dXJuIFBuKG8pJiZrbihvKT09VG59dmFyIHhuPUluLER0PXhuLE9uPWNlLGp0PU9iamVjdC5wcm90b3R5cGUsTG49anQuaGFzT3duUHJvcGVydHksQ249anQucHJvcGVydHlJc0VudW1lcmFibGUsTm49RHQoZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzfSgpKT9EdDpmdW5jdGlvbihvKXtyZXR1cm4gT24obykmJkxuLmNhbGwobywiY2FsbGVlIikmJiFDbi5jYWxsKG8sImNhbGxlZSIpfSxXbj1ObixSbj1BcnJheS5pc0FycmF5LF9lPVJuLEVlPXtleHBvcnRzOnt9fTtmdW5jdGlvbiBBbigpe3JldHVybiExfXZhciBNbj1BbjtFZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9aWUscj1NbixpPWUmJiFlLm5vZGVUeXBlJiZlLHM9aSYmITAmJm8mJiFvLm5vZGVUeXBlJiZvLG49cyYmcy5leHBvcnRzPT09aSxhPW4/dC5CdWZmZXI6dm9pZCAwLGw9YT9hLmlzQnVmZmVyOnZvaWQgMCxjPWx8fHI7by5leHBvcnRzPWN9KEVlLEVlLmV4cG9ydHMpO3ZhciBydD1FZS5leHBvcnRzLCRuPTkwMDcxOTkyNTQ3NDA5OTEsRG49L14oPzowfFsxLTldXGQqKSQvO2Z1bmN0aW9uIGpuKG8sZSl7dmFyIHQ9dHlwZW9mIG87cmV0dXJuIGU9ZT8/JG4sISFlJiYodD09Im51bWJlciJ8fHQhPSJzeW1ib2wiJiZEbi50ZXN0KG8pKSYmbz4tMSYmbyUxPT0wJiZvPGV9dmFyIEZuPWpuLEJuPTkwMDcxOTkyNTQ3NDA5OTE7ZnVuY3Rpb24gX24obyl7cmV0dXJuIHR5cGVvZiBvPT0ibnVtYmVyIiYmbz4tMSYmbyUxPT0wJiZvPD1Cbn12YXIgRnQ9X24sRW49ZmUsem49RnQsVW49Y2UsR249IltvYmplY3QgQXJndW1lbnRzXSIsWG49IltvYmplY3QgQXJyYXldIixIbj0iW29iamVjdCBCb29sZWFuXSIsWW49IltvYmplY3QgRGF0ZV0iLHFuPSJbb2JqZWN0IEVycm9yXSIsWm49IltvYmplY3QgRnVuY3Rpb25dIixRbj0iW29iamVjdCBNYXBdIixKbj0iW29iamVjdCBOdW1iZXJdIixLbj0iW29iamVjdCBPYmplY3RdIixWbj0iW29iamVjdCBSZWdFeHBdIixlYT0iW29iamVjdCBTZXRdIix0YT0iW29iamVjdCBTdHJpbmddIixyYT0iW29iamVjdCBXZWFrTWFwXSIsb2E9IltvYmplY3QgQXJyYXlCdWZmZXJdIixzYT0iW29iamVjdCBEYXRhVmlld10iLGlhPSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG5hPSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLGFhPSJbb2JqZWN0IEludDhBcnJheV0iLGxhPSJbb2JqZWN0IEludDE2QXJyYXldIixjYT0iW29iamVjdCBJbnQzMkFycmF5XSIsdWE9IltvYmplY3QgVWludDhBcnJheV0iLGhhPSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsZGE9IltvYmplY3QgVWludDE2QXJyYXldIixmYT0iW29iamVjdCBVaW50MzJBcnJheV0iLFg9e307WFtpYV09WFtuYV09WFthYV09WFtsYV09WFtjYV09WFt1YV09WFtoYV09WFtkYV09WFtmYV09ITAsWFtHbl09WFtYbl09WFtvYV09WFtIbl09WFtzYV09WFtZbl09WFtxbl09WFtabl09WFtRbl09WFtKbl09WFtLbl09WFtWbl09WFtlYV09WFt0YV09WFtyYV09ITE7ZnVuY3Rpb24gcGEobyl7cmV0dXJuIFVuKG8pJiZ6bihvLmxlbmd0aCkmJiEhWFtFbihvKV19dmFyIHlhPXBhO2Z1bmN0aW9uIHdhKG8pe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbyhlKX19dmFyIG90PXdhLHplPXtleHBvcnRzOnt9fTt6ZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9U3Qscj1lJiYhZS5ub2RlVHlwZSYmZSxpPXImJiEwJiZvJiYhby5ub2RlVHlwZSYmbyxzPWkmJmkuZXhwb3J0cz09PXIsbj1zJiZ0LnByb2Nlc3MsYT1mdW5jdGlvbigpe3RyeXt2YXIgbD1pJiZpLnJlcXVpcmUmJmkucmVxdWlyZSgidXRpbCIpLnR5cGVzO3JldHVybiBsfHxuJiZuLmJpbmRpbmcmJm4uYmluZGluZygidXRpbCIpfWNhdGNoe319KCk7by5leHBvcnRzPWF9KHplLHplLmV4cG9ydHMpO3ZhciBzdD16ZS5leHBvcnRzLG1hPXlhLGdhPW90LEJ0PXN0LF90PUJ0JiZCdC5pc1R5cGVkQXJyYXksYmE9X3Q/Z2EoX3QpOm1hLEV0PWJhLHZhPXZuLFNhPVduLGthPV9lLFBhPXJ0LFRhPUZuLElhPUV0LHhhPU9iamVjdC5wcm90b3R5cGUsT2E9eGEuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gTGEobyxlKXt2YXIgdD1rYShvKSxyPSF0JiZTYShvKSxpPSF0JiYhciYmUGEobykscz0hdCYmIXImJiFpJiZJYShvKSxuPXR8fHJ8fGl8fHMsYT1uP3ZhKG8ubGVuZ3RoLFN0cmluZyk6W10sbD1hLmxlbmd0aDtmb3IodmFyIGMgaW4gbykoZXx8T2EuY2FsbChvLGMpKSYmIShuJiYoYz09Imxlbmd0aCJ8fGkmJihjPT0ib2Zmc2V0Inx8Yz09InBhcmVudCIpfHxzJiYoYz09ImJ1ZmZlciJ8fGM9PSJieXRlTGVuZ3RoInx8Yz09ImJ5dGVPZmZzZXQiKXx8VGEoYyxsKSkpJiZhLnB1c2goYyk7cmV0dXJuIGF9dmFyIHp0PUxhLENhPU9iamVjdC5wcm90b3R5cGU7ZnVuY3Rpb24gTmEobyl7dmFyIGU9byYmby5jb25zdHJ1Y3Rvcix0PXR5cGVvZiBlPT0iZnVuY3Rpb24iJiZlLnByb3RvdHlwZXx8Q2E7cmV0dXJuIG89PT10fXZhciBpdD1OYTtmdW5jdGlvbiBXYShvLGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbyhlKHQpKX19dmFyIFV0PVdhLFJhPVV0LEFhPVJhKE9iamVjdC5rZXlzLE9iamVjdCksTWE9QWEsJGE9aXQsRGE9TWEsamE9T2JqZWN0LnByb3RvdHlwZSxGYT1qYS5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBCYShvKXtpZighJGEobykpcmV0dXJuIERhKG8pO3ZhciBlPVtdO2Zvcih2YXIgdCBpbiBPYmplY3QobykpRmEuY2FsbChvLHQpJiZ0IT0iY29uc3RydWN0b3IiJiZlLnB1c2godCk7cmV0dXJuIGV9dmFyIF9hPUJhLEVhPXh0LHphPUZ0O2Z1bmN0aW9uIFVhKG8pe3JldHVybiBvIT1udWxsJiZ6YShvLmxlbmd0aCkmJiFFYShvKX12YXIgR3Q9VWEsR2E9enQsWGE9X2EsSGE9R3Q7ZnVuY3Rpb24gWWEobyl7cmV0dXJuIEhhKG8pP0dhKG8pOlhhKG8pfXZhciBudD1ZYSxxYT1CZSxaYT1udDtmdW5jdGlvbiBRYShvLGUpe3JldHVybiBvJiZxYShlLFphKGUpLG8pfXZhciBKYT1RYTtmdW5jdGlvbiBLYShvKXt2YXIgZT1bXTtpZihvIT1udWxsKWZvcih2YXIgdCBpbiBPYmplY3QobykpZS5wdXNoKHQpO3JldHVybiBlfXZhciBWYT1LYSxlbD11ZSx0bD1pdCxybD1WYSxvbD1PYmplY3QucHJvdG90eXBlLHNsPW9sLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIGlsKG8pe2lmKCFlbChvKSlyZXR1cm4gcmwobyk7dmFyIGU9dGwobyksdD1bXTtmb3IodmFyIHIgaW4gbylyPT0iY29uc3RydWN0b3IiJiYoZXx8IXNsLmNhbGwobyxyKSl8fHQucHVzaChyKTtyZXR1cm4gdH12YXIgbmw9aWwsYWw9enQsbGw9bmwsY2w9R3Q7ZnVuY3Rpb24gdWwobyl7cmV0dXJuIGNsKG8pP2FsKG8sITApOmxsKG8pfXZhciBhdD11bCxobD1CZSxkbD1hdDtmdW5jdGlvbiBmbChvLGUpe3JldHVybiBvJiZobChlLGRsKGUpLG8pfXZhciBwbD1mbCxVZT17ZXhwb3J0czp7fX07VWUuZXhwb3J0cyxmdW5jdGlvbihvLGUpe3ZhciB0PWllLHI9ZSYmIWUubm9kZVR5cGUmJmUsaT1yJiYhMCYmbyYmIW8ubm9kZVR5cGUmJm8scz1pJiZpLmV4cG9ydHM9PT1yLG49cz90LkJ1ZmZlcjp2b2lkIDAsYT1uP24uYWxsb2NVbnNhZmU6dm9pZCAwO2Z1bmN0aW9uIGwoYyx1KXtpZih1KXJldHVybiBjLnNsaWNlKCk7dmFyIGg9Yy5sZW5ndGgsZD1hP2EoaCk6bmV3IGMuY29uc3RydWN0b3IoaCk7cmV0dXJuIGMuY29weShkKSxkfW8uZXhwb3J0cz1sfShVZSxVZS5leHBvcnRzKTt2YXIgeWw9VWUuZXhwb3J0cztmdW5jdGlvbiB3bChvLGUpe3ZhciB0PS0xLHI9by5sZW5ndGg7Zm9yKGV8fChlPUFycmF5KHIpKTsrK3Q8cjspZVt0XT1vW3RdO3JldHVybiBlfXZhciBtbD13bDtmdW5jdGlvbiBnbChvLGUpe2Zvcih2YXIgdD0tMSxyPW89PW51bGw/MDpvLmxlbmd0aCxpPTAscz1bXTsrK3Q8cjspe3ZhciBuPW9bdF07ZShuLHQsbykmJihzW2krK109bil9cmV0dXJuIHN9dmFyIGJsPWdsO2Z1bmN0aW9uIHZsKCl7cmV0dXJuW119dmFyIFh0PXZsLFNsPWJsLGtsPVh0LFBsPU9iamVjdC5wcm90b3R5cGUsVGw9UGwucHJvcGVydHlJc0VudW1lcmFibGUsSHQ9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxJbD1IdD9mdW5jdGlvbihvKXtyZXR1cm4gbz09bnVsbD9bXToobz1PYmplY3QobyksU2woSHQobyksZnVuY3Rpb24oZSl7cmV0dXJuIFRsLmNhbGwobyxlKX0pKX06a2wsbHQ9SWwseGw9QmUsT2w9bHQ7ZnVuY3Rpb24gTGwobyxlKXtyZXR1cm4geGwobyxPbChvKSxlKX12YXIgQ2w9TGw7ZnVuY3Rpb24gTmwobyxlKXtmb3IodmFyIHQ9LTEscj1lLmxlbmd0aCxpPW8ubGVuZ3RoOysrdDxyOylvW2krdF09ZVt0XTtyZXR1cm4gb312YXIgWXQ9TmwsV2w9VXQsUmw9V2woT2JqZWN0LmdldFByb3RvdHlwZU9mLE9iamVjdCkscXQ9UmwsQWw9WXQsTWw9cXQsJGw9bHQsRGw9WHQsamw9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxGbD1qbD9mdW5jdGlvbihvKXtmb3IodmFyIGU9W107bzspQWwoZSwkbChvKSksbz1NbChvKTtyZXR1cm4gZX06RGwsWnQ9RmwsQmw9QmUsX2w9WnQ7ZnVuY3Rpb24gRWwobyxlKXtyZXR1cm4gQmwobyxfbChvKSxlKX12YXIgemw9RWwsVWw9WXQsR2w9X2U7ZnVuY3Rpb24gWGwobyxlLHQpe3ZhciByPWUobyk7cmV0dXJuIEdsKG8pP3I6VWwocix0KG8pKX12YXIgUXQ9WGwsSGw9UXQsWWw9bHQscWw9bnQ7ZnVuY3Rpb24gWmwobyl7cmV0dXJuIEhsKG8scWwsWWwpfXZhciBKdD1abCxRbD1RdCxKbD1adCxLbD1hdDtmdW5jdGlvbiBWbChvKXtyZXR1cm4gUWwobyxLbCxKbCl9dmFyIGVjPVZsLHRjPXBlLHJjPWllLG9jPXRjKHJjLCJEYXRhVmlldyIpLHNjPW9jLGljPXBlLG5jPWllLGFjPWljKG5jLCJQcm9taXNlIiksbGM9YWMsY2M9cGUsdWM9aWUsaGM9Y2ModWMsIlNldCIpLGRjPWhjLGZjPXBlLHBjPWllLHljPWZjKHBjLCJXZWFrTWFwIiksd2M9eWMsY3Q9c2MsdXQ9dHQsaHQ9bGMsZHQ9ZGMsZnQ9d2MsS3Q9ZmUsa2U9THQsVnQ9IltvYmplY3QgTWFwXSIsbWM9IltvYmplY3QgT2JqZWN0XSIsZXI9IltvYmplY3QgUHJvbWlzZV0iLHRyPSJbb2JqZWN0IFNldF0iLHJyPSJbb2JqZWN0IFdlYWtNYXBdIixvcj0iW29iamVjdCBEYXRhVmlld10iLGdjPWtlKGN0KSxiYz1rZSh1dCksdmM9a2UoaHQpLFNjPWtlKGR0KSxrYz1rZShmdCkseWU9S3Q7KGN0JiZ5ZShuZXcgY3QobmV3IEFycmF5QnVmZmVyKDEpKSkhPW9yfHx1dCYmeWUobmV3IHV0KSE9VnR8fGh0JiZ5ZShodC5yZXNvbHZlKCkpIT1lcnx8ZHQmJnllKG5ldyBkdCkhPXRyfHxmdCYmeWUobmV3IGZ0KSE9cnIpJiYoeWU9ZnVuY3Rpb24obyl7dmFyIGU9S3QobyksdD1lPT1tYz9vLmNvbnN0cnVjdG9yOnZvaWQgMCxyPXQ/a2UodCk6IiI7aWYocilzd2l0Y2gocil7Y2FzZSBnYzpyZXR1cm4gb3I7Y2FzZSBiYzpyZXR1cm4gVnQ7Y2FzZSB2YzpyZXR1cm4gZXI7Y2FzZSBTYzpyZXR1cm4gdHI7Y2FzZSBrYzpyZXR1cm4gcnJ9cmV0dXJuIGV9KTt2YXIgR2U9eWUsUGM9T2JqZWN0LnByb3RvdHlwZSxUYz1QYy5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBJYyhvKXt2YXIgZT1vLmxlbmd0aCx0PW5ldyBvLmNvbnN0cnVjdG9yKGUpO3JldHVybiBlJiZ0eXBlb2Ygb1swXT09InN0cmluZyImJlRjLmNhbGwobywiaW5kZXgiKSYmKHQuaW5kZXg9by5pbmRleCx0LmlucHV0PW8uaW5wdXQpLHR9dmFyIHhjPUljLE9jPWllLExjPU9jLlVpbnQ4QXJyYXksc3I9TGMsaXI9c3I7ZnVuY3Rpb24gQ2Mobyl7dmFyIGU9bmV3IG8uY29uc3RydWN0b3Ioby5ieXRlTGVuZ3RoKTtyZXR1cm4gbmV3IGlyKGUpLnNldChuZXcgaXIobykpLGV9dmFyIHB0PUNjLE5jPXB0O2Z1bmN0aW9uIFdjKG8sZSl7dmFyIHQ9ZT9OYyhvLmJ1ZmZlcik6by5idWZmZXI7cmV0dXJuIG5ldyBvLmNvbnN0cnVjdG9yKHQsby5ieXRlT2Zmc2V0LG8uYnl0ZUxlbmd0aCl9dmFyIFJjPVdjLEFjPS9cdyokLztmdW5jdGlvbiBNYyhvKXt2YXIgZT1uZXcgby5jb25zdHJ1Y3RvcihvLnNvdXJjZSxBYy5leGVjKG8pKTtyZXR1cm4gZS5sYXN0SW5kZXg9by5sYXN0SW5kZXgsZX12YXIgJGM9TWMsbnI9RGUsYXI9bnI/bnIucHJvdG90eXBlOnZvaWQgMCxscj1hcj9hci52YWx1ZU9mOnZvaWQgMDtmdW5jdGlvbiBEYyhvKXtyZXR1cm4gbHI/T2JqZWN0KGxyLmNhbGwobykpOnt9fXZhciBqYz1EYyxGYz1wdDtmdW5jdGlvbiBCYyhvLGUpe3ZhciB0PWU/RmMoby5idWZmZXIpOm8uYnVmZmVyO3JldHVybiBuZXcgby5jb25zdHJ1Y3Rvcih0LG8uYnl0ZU9mZnNldCxvLmxlbmd0aCl9dmFyIF9jPUJjLEVjPXB0LHpjPVJjLFVjPSRjLEdjPWpjLFhjPV9jLEhjPSJbb2JqZWN0IEJvb2xlYW5dIixZYz0iW29iamVjdCBEYXRlXSIscWM9IltvYmplY3QgTWFwXSIsWmM9IltvYmplY3QgTnVtYmVyXSIsUWM9IltvYmplY3QgUmVnRXhwXSIsSmM9IltvYmplY3QgU2V0XSIsS2M9IltvYmplY3QgU3RyaW5nXSIsVmM9IltvYmplY3QgU3ltYm9sXSIsZXU9IltvYmplY3QgQXJyYXlCdWZmZXJdIix0dT0iW29iamVjdCBEYXRhVmlld10iLHJ1PSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG91PSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLHN1PSJbb2JqZWN0IEludDhBcnJheV0iLGl1PSJbb2JqZWN0IEludDE2QXJyYXldIixudT0iW29iamVjdCBJbnQzMkFycmF5XSIsYXU9IltvYmplY3QgVWludDhBcnJheV0iLGx1PSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsY3U9IltvYmplY3QgVWludDE2QXJyYXldIix1dT0iW29iamVjdCBVaW50MzJBcnJheV0iO2Z1bmN0aW9uIGh1KG8sZSx0KXt2YXIgcj1vLmNvbnN0cnVjdG9yO3N3aXRjaChlKXtjYXNlIGV1OnJldHVybiBFYyhvKTtjYXNlIEhjOmNhc2UgWWM6cmV0dXJuIG5ldyByKCtvKTtjYXNlIHR1OnJldHVybiB6YyhvLHQpO2Nhc2UgcnU6Y2FzZSBvdTpjYXNlIHN1OmNhc2UgaXU6Y2FzZSBudTpjYXNlIGF1OmNhc2UgbHU6Y2FzZSBjdTpjYXNlIHV1OnJldHVybiBYYyhvLHQpO2Nhc2UgcWM6cmV0dXJuIG5ldyByO2Nhc2UgWmM6Y2FzZSBLYzpyZXR1cm4gbmV3IHIobyk7Y2FzZSBRYzpyZXR1cm4gVWMobyk7Y2FzZSBKYzpyZXR1cm4gbmV3IHI7Y2FzZSBWYzpyZXR1cm4gR2Mobyl9fXZhciBkdT1odSxmdT11ZSxjcj1PYmplY3QuY3JlYXRlLHB1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbygpe31yZXR1cm4gZnVuY3Rpb24oZSl7aWYoIWZ1KGUpKXJldHVybnt9O2lmKGNyKXJldHVybiBjcihlKTtvLnByb3RvdHlwZT1lO3ZhciB0PW5ldyBvO3JldHVybiBvLnByb3RvdHlwZT12b2lkIDAsdH19KCkseXU9cHUsd3U9eXUsbXU9cXQsZ3U9aXQ7ZnVuY3Rpb24gYnUobyl7cmV0dXJuIHR5cGVvZiBvLmNvbnN0cnVjdG9yPT0iZnVuY3Rpb24iJiYhZ3Uobyk/d3UobXUobykpOnt9fXZhciB2dT1idSxTdT1HZSxrdT1jZSxQdT0iW29iamVjdCBNYXBdIjtmdW5jdGlvbiBUdShvKXtyZXR1cm4ga3UobykmJlN1KG8pPT1QdX12YXIgSXU9VHUseHU9SXUsT3U9b3QsdXI9c3QsaHI9dXImJnVyLmlzTWFwLEx1PWhyP091KGhyKTp4dSxDdT1MdSxOdT1HZSxXdT1jZSxSdT0iW29iamVjdCBTZXRdIjtmdW5jdGlvbiBBdShvKXtyZXR1cm4gV3UobykmJk51KG8pPT1SdX12YXIgTXU9QXUsJHU9TXUsRHU9b3QsZHI9c3QsZnI9ZHImJmRyLmlzU2V0LGp1PWZyP0R1KGZyKTokdSxGdT1qdSxCdT1SdCxfdT1ubixFdT0kdCx6dT1KYSxVdT1wbCxHdT15bCxYdT1tbCxIdT1DbCxZdT16bCxxdT1KdCxadT1lYyxRdT1HZSxKdT14YyxLdT1kdSxWdT12dSxlaD1fZSx0aD1ydCxyaD1DdSxvaD11ZSxzaD1GdSxpaD1udCxuaD1hdCxhaD0xLGxoPTIsY2g9NCxwcj0iW29iamVjdCBBcmd1bWVudHNdIix1aD0iW29iamVjdCBBcnJheV0iLGhoPSJbb2JqZWN0IEJvb2xlYW5dIixkaD0iW29iamVjdCBEYXRlXSIsZmg9IltvYmplY3QgRXJyb3JdIix5cj0iW29iamVjdCBGdW5jdGlvbl0iLHBoPSJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSIseWg9IltvYmplY3QgTWFwXSIsd2g9IltvYmplY3QgTnVtYmVyXSIsd3I9IltvYmplY3QgT2JqZWN0XSIsbWg9IltvYmplY3QgUmVnRXhwXSIsZ2g9IltvYmplY3QgU2V0XSIsYmg9IltvYmplY3QgU3RyaW5nXSIsdmg9IltvYmplY3QgU3ltYm9sXSIsU2g9IltvYmplY3QgV2Vha01hcF0iLGtoPSJbb2JqZWN0IEFycmF5QnVmZmVyXSIsUGg9IltvYmplY3QgRGF0YVZpZXddIixUaD0iW29iamVjdCBGbG9hdDMyQXJyYXldIixJaD0iW29iamVjdCBGbG9hdDY0QXJyYXldIix4aD0iW29iamVjdCBJbnQ4QXJyYXldIixPaD0iW29iamVjdCBJbnQxNkFycmF5XSIsTGg9IltvYmplY3QgSW50MzJBcnJheV0iLENoPSJbb2JqZWN0IFVpbnQ4QXJyYXldIixOaD0iW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0iLFdoPSJbb2JqZWN0IFVpbnQxNkFycmF5XSIsUmg9IltvYmplY3QgVWludDMyQXJyYXldIixVPXt9O1VbcHJdPVVbdWhdPVVba2hdPVVbUGhdPVVbaGhdPVVbZGhdPVVbVGhdPVVbSWhdPVVbeGhdPVVbT2hdPVVbTGhdPVVbeWhdPVVbd2hdPVVbd3JdPVVbbWhdPVVbZ2hdPVVbYmhdPVVbdmhdPVVbQ2hdPVVbTmhdPVVbV2hdPVVbUmhdPSEwLFVbZmhdPVVbeXJdPVVbU2hdPSExO2Z1bmN0aW9uIFhlKG8sZSx0LHIsaSxzKXt2YXIgbixhPWUmYWgsbD1lJmxoLGM9ZSZjaDtpZih0JiYobj1pP3QobyxyLGkscyk6dChvKSksbiE9PXZvaWQgMClyZXR1cm4gbjtpZighb2gobykpcmV0dXJuIG87dmFyIHU9ZWgobyk7aWYodSl7aWYobj1KdShvKSwhYSlyZXR1cm4gWHUobyxuKX1lbHNle3ZhciBoPVF1KG8pLGQ9aD09eXJ8fGg9PXBoO2lmKHRoKG8pKXJldHVybiBHdShvLGEpO2lmKGg9PXdyfHxoPT1wcnx8ZCYmIWkpe2lmKG49bHx8ZD97fTpWdShvKSwhYSlyZXR1cm4gbD9ZdShvLFV1KG4sbykpOkh1KG8senUobixvKSl9ZWxzZXtpZighVVtoXSlyZXR1cm4gaT9vOnt9O249S3UobyxoLGEpfX1zfHwocz1uZXcgQnUpO3ZhciBmPXMuZ2V0KG8pO2lmKGYpcmV0dXJuIGY7cy5zZXQobyxuKSxzaChvKT9vLmZvckVhY2goZnVuY3Rpb24oZyl7bi5hZGQoWGUoZyxlLHQsZyxvLHMpKX0pOnJoKG8pJiZvLmZvckVhY2goZnVuY3Rpb24oZyxQKXtuLnNldChQLFhlKGcsZSx0LFAsbyxzKSl9KTt2YXIgdz1jP2w/WnU6cXU6bD9uaDppaCx5PXU/dm9pZCAwOncobyk7cmV0dXJuIF91KHl8fG8sZnVuY3Rpb24oZyxQKXt5JiYoUD1nLGc9b1tQXSksRXUobixQLFhlKGcsZSx0LFAsbyxzKSl9KSxufXZhciBBaD1YZSxNaD1BaCwkaD0xLERoPTQ7ZnVuY3Rpb24gamgobyl7cmV0dXJuIE1oKG8sJGh8RGgpfXZhciBGaD1qaCxyZT1tZShGaCksbXI7KGZ1bmN0aW9uKG8pe29bby5wZWRkaW5nPTBdPSJwZWRkaW5nIixvW28ubW91bnRlZD0xXT0ibW91bnRlZCIsb1tvLnVwZGF0ZT0yXT0idXBkYXRlIixvW28udW5tb3VudGVkPTNdPSJ1bm1vdW50ZWQifSkobXJ8fChtcj17fSkpO3ZhciBROyhmdW5jdGlvbihvKXtvW28uTm9ybWFsPTBdPSJOb3JtYWwiLG9bby5TdHJva2U9MV09IlN0cm9rZSIsb1tvLkRvdHRlZD0yXT0iRG90dGVkIixvW28uTG9uZ0RvdHRlZD0zXT0iTG9uZ0RvdHRlZCJ9KShRfHwoUT17fSkpO3ZhciBncjsoZnVuY3Rpb24obyl7by5UcmlhbmdsZT0idHJpYW5nbGUiLG8uUmhvbWJ1cz0icmhvbWJ1cyIsby5QZW50YWdyYW09InBlbnRhZ3JhbSIsby5TcGVlY2hCYWxsb29uPSJzcGVlY2hCYWxsb29uIixvLlN0YXI9InN0YXIiLG8uUG9seWdvbj0icG9seWdvbiJ9KShncnx8KGdyPXt9KSk7dmFyIEI7KGZ1bmN0aW9uKG8pe28uTm9uZT0iTm9uZSIsby5TaG93RmxvYXRCYXI9IlNob3dGbG9hdEJhciIsby5aSW5kZXhGbG9hdEJhcj0iWkluZGV4RmxvYXRCYXIiLG8uRGVsZXRlTm9kZT0iRGVsZXRlTm9kZSIsby5Db3B5Tm9kZT0iQ29weU5vZGUiLG8uWkluZGV4QWN0aXZlPSJaSW5kZXhBY3RpdmUiLG8uWkluZGV4Tm9kZT0iWkluZGV4Tm9kZSIsby5Sb3RhdGVOb2RlPSJSb3RhdGVOb2RlIixvLlNldENvbG9yTm9kZT0iU2V0Q29sb3JOb2RlIixvLlRyYW5zbGF0ZU5vZGU9IlRyYW5zbGF0ZU5vZGUiLG8uU2NhbGVOb2RlPSJTY2FsZU5vZGUiLG8uT3JpZ2luYWxFdmVudD0iT3JpZ2luYWxFdmVudCIsby5DcmVhdGVTY2VuZT0iQ3JlYXRlU2NlbmUiLG8uQWN0aXZlQ3Vyc29yPSJBY3RpdmVDdXJzb3IiLG8uTW92ZUN1cnNvcj0iTW92ZUN1cnNvciIsby5Db21tYW5kRWRpdG9yPSJDb21tYW5kRWRpdG9yIixvLlNldEVkaXRvckRhdGE9IlNldEVkaXRvckRhdGEiLG8uU2V0Rm9udFN0eWxlPSJTZXRGb250U3R5bGUiLG8uU2V0UG9pbnQ9IlNldFBvaW50IixvLlNldExvY2s9IlNldExvY2siLG8uU2V0U2hhcGVPcHQ9IlNldFNoYXBlT3B0In0pKEJ8fChCPXt9KSk7dmFyIGJyOyhmdW5jdGlvbihvKXtvLkRpc3BsYXlTdGF0ZT0iRGlzcGxheVN0YXRlIixvLkZsb2F0QmFyPSJGbG9hdEJhciIsby5DYW52YXNTZWxlY3Rvcj0iQ2FudmFzU2VsZWN0b3IiLG8uTWFpbkVuZ2luZT0iTWFpbkVuZ2luZSIsby5EaXNwbGF5Q29udGFpbmVyPSJEaXNwbGF5Q29udGFpbmVyIixvLkN1cnNvcj0iQ3Vyc29yIixvLlRleHRFZGl0b3I9IlRleHRFZGl0b3IiLG8uQmluZE1haW5WaWV3PSJCaW5kTWFpblZpZXciLG8uTW91bnRNYWluVmlldz0iTW91bnRNYWluVmlldyIsby5Nb3VudEFwcFZpZXc9Ik1vdW50QXBwVmlldyJ9KShicnx8KGJyPXt9KSk7dmFyIHZyOyhmdW5jdGlvbihvKXtvW28uTWFpblZpZXc9MF09Ik1haW5WaWV3IixvW28uUGx1Z2luPTFdPSJQbHVnaW4iLG9bby5Cb3RoPTJdPSJCb3RoIn0pKHZyfHwodnI9e30pKTt2YXIgUzsoZnVuY3Rpb24obyl7b1tvLlBlbmNpbD0xXT0iUGVuY2lsIixvW28uRXJhc2VyPTJdPSJFcmFzZXIiLG9bby5TZWxlY3Rvcj0zXT0iU2VsZWN0b3IiLG9bby5DbGlja2VyPTRdPSJDbGlja2VyIixvW28uQXJyb3c9NV09IkFycm93IixvW28uSGFuZD02XT0iSGFuZCIsb1tvLkxhc2VyUGVuPTddPSJMYXNlclBlbiIsb1tvLlRleHQ9OF09IlRleHQiLG9bby5TdHJhaWdodD05XT0iU3RyYWlnaHQiLG9bby5SZWN0YW5nbGU9MTBdPSJSZWN0YW5nbGUiLG9bby5FbGxpcHNlPTExXT0iRWxsaXBzZSIsb1tvLlN0YXI9MTJdPSJTdGFyIixvW28uVHJpYW5nbGU9MTNdPSJUcmlhbmdsZSIsb1tvLlJob21idXM9MTRdPSJSaG9tYnVzIixvW28uUG9seWdvbj0xNV09IlBvbHlnb24iLG9bby5TcGVlY2hCYWxsb29uPTE2XT0iU3BlZWNoQmFsbG9vbiIsb1tvLkltYWdlPTE3XT0iSW1hZ2UifSkoU3x8KFM9e30pKTt2YXIgVzsoZnVuY3Rpb24obyl7b1tvLkxvY2FsPTFdPSJMb2NhbCIsb1tvLlNlcnZpY2U9Ml09IlNlcnZpY2UiLG9bby5Xb3JrZXI9M109IldvcmtlciJ9KShXfHwoVz17fSkpO3ZhciBGOyhmdW5jdGlvbihvKXtvW28uUGVuZGluZz0wXT0iUGVuZGluZyIsb1tvLlN0YXJ0PTFdPSJTdGFydCIsb1tvLkRvaW5nPTJdPSJEb2luZyIsb1tvLkRvbmU9M109IkRvbmUiLG9bby5GcmVlemU9NF09IkZyZWV6ZSIsb1tvLlVud3JpdGFibGU9NV09IlVud3JpdGFibGUifSkoRnx8KEY9e30pKTt2YXIgbTsoZnVuY3Rpb24obyl7b1tvLk5vbmU9MF09Ik5vbmUiLG9bby5Jbml0PTFdPSJJbml0IixvW28uVXBkYXRlQ2FtZXJhPTJdPSJVcGRhdGVDYW1lcmEiLG9bby5VcGRhdGVUb29scz0zXT0iVXBkYXRlVG9vbHMiLG9bby5DcmVhdGVXb3JrPTRdPSJDcmVhdGVXb3JrIixvW28uRHJhd1dvcms9NV09IkRyYXdXb3JrIixvW28uRnVsbFdvcms9Nl09IkZ1bGxXb3JrIixvW28uVXBkYXRlTm9kZT03XT0iVXBkYXRlTm9kZSIsb1tvLlJlbW92ZU5vZGU9OF09IlJlbW92ZU5vZGUiLG9bby5DbGVhcj05XT0iQ2xlYXIiLG9bby5TZWxlY3Q9MTBdPSJTZWxlY3QiLG9bby5EZXN0cm95PTExXT0iRGVzdHJveSIsb1tvLlNuYXBzaG90PTEyXT0iU25hcHNob3QiLG9bby5Cb3VuZGluZ0JveD0xM109IkJvdW5kaW5nQm94IixvW28uQ3Vyc29yPTE0XT0iQ3Vyc29yIixvW28uVGV4dFVwZGF0ZT0xNV09IlRleHRVcGRhdGUiLG9bby5HZXRUZXh0QWN0aXZlPTE2XT0iR2V0VGV4dEFjdGl2ZSIsb1tvLlRhc2tzUXVldWU9MTddPSJUYXNrc1F1ZXVlIixvW28uQ3Vyc29ySG92ZXI9MThdPSJDdXJzb3JIb3ZlciJ9KShtfHwobT17fSkpO3ZhciBTcjsoZnVuY3Rpb24obyl7by5XZWJnbDI9IndlYmdsMiIsby5XZWJnbD0id2ViZ2wiLG8uQ2FudmFzMmQ9IjJkIn0pKFNyfHwoU3I9e30pKTt2YXIgTjsoZnVuY3Rpb24obyl7b1tvLkZsb2F0PTFdPSJGbG9hdCIsb1tvLkJnPTJdPSJCZyIsb1tvLlNlbGVjdG9yPTNdPSJTZWxlY3RvciIsb1tvLlNlcnZpY2VGbG9hdD00XT0iU2VydmljZUZsb2F0IixvW28uTm9uZT01XT0iTm9uZSJ9KShOfHwoTj17fSkpO3ZhciBrcjsoZnVuY3Rpb24obyl7b1tvLkN1cnNvcj0xXT0iQ3Vyc29yIixvW28uVGV4dENyZWF0ZT0yXT0iVGV4dENyZWF0ZSJ9KShrcnx8KGtyPXt9KSk7dmFyIFByOyhmdW5jdGlvbihvKXtvW28uVG9wPTFdPSJUb3AiLG9bby5Cb3R0b209Ml09IkJvdHRvbSJ9KShQcnx8KFByPXt9KSk7dmFyIHE7KGZ1bmN0aW9uKG8pe29bby5ub25lPTFdPSJub25lIixvW28uYWxsPTJdPSJhbGwiLG9bby5ib3RoPTNdPSJib3RoIixvW28ucHJvcG9ydGlvbmFsPTRdPSJwcm9wb3J0aW9uYWwifSkocXx8KHE9e30pKTtjbGFzcyBvZXtjb25zdHJ1Y3Rvcigpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJsb2NhbFdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VydmljZVdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KX1yZWdpc3RlckZvcldvcmtlcihlLHQscil7cmV0dXJuIHRoaXMubG9jYWxXb3JrPWUsdGhpcy5zZXJ2aWNlV29yaz10LHRoaXMuc2NlbmU9cix0aGlzfX1jb25zdCBCaD17bGluZWFyOm89Pm8sZWFzZUluUXVhZDpvPT5vKm8sZWFzZU91dFF1YWQ6bz0+byooMi1vKSxlYXNlSW5PdXRRdWFkOm89Pm88LjU/MipvKm86LTErKDQtMipvKSpvLGVhc2VJbkN1YmljOm89Pm8qbypvLGVhc2VPdXRDdWJpYzpvPT4tLW8qbypvKzEsZWFzZUluT3V0Q3ViaWM6bz0+bzwuNT80Km8qbypvOihvLTEpKigyKm8tMikqKDIqby0yKSsxLGVhc2VJblF1YXJ0Om89Pm8qbypvKm8sZWFzZU91dFF1YXJ0Om89PjEtIC0tbypvKm8qbyxlYXNlSW5PdXRRdWFydDpvPT5vPC41PzgqbypvKm8qbzoxLTgqLS1vKm8qbypvLGVhc2VJblF1aW50Om89Pm8qbypvKm8qbyxlYXNlT3V0UXVpbnQ6bz0+MSstLW8qbypvKm8qbyxlYXNlSW5PdXRRdWludDpvPT5vPC41PzE2Km8qbypvKm8qbzoxKzE2Ki0tbypvKm8qbypvLGVhc2VJblNpbmU6bz0+MS1NYXRoLmNvcyhvKk1hdGguUEkvMiksZWFzZU91dFNpbmU6bz0+TWF0aC5zaW4obypNYXRoLlBJLzIpLGVhc2VJbk91dFNpbmU6bz0+LShNYXRoLmNvcyhNYXRoLlBJKm8pLTEpLzIsZWFzZUluRXhwbzpvPT5vPD0wPzA6TWF0aC5wb3coMiwxMCpvLTEwKSxlYXNlT3V0RXhwbzpvPT5vPj0xPzE6MS1NYXRoLnBvdygyLC0xMCpvKSxlYXNlSW5PdXRFeHBvOm89Pm88PTA/MDpvPj0xPzE6bzwuNT9NYXRoLnBvdygyLDIwKm8tMTApLzI6KDItTWF0aC5wb3coMiwtMjAqbysxMCkpLzJ9O2NsYXNzIHB7Y29uc3RydWN0b3IoZT0wLHQ9MCxyPTEpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ5Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ6Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cn0pfWdldCBYWSgpe3JldHVyblt0aGlzLngsdGhpcy55XX1zZXR6KGUpe3JldHVybiB0aGlzLno9ZSx0aGlzfXNldFhZKGU9dGhpcy54LHQ9dGhpcy55KXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpc31zZXQoZT10aGlzLngsdD10aGlzLnkscj10aGlzLnope3JldHVybiB0aGlzLng9ZSx0aGlzLnk9dCx0aGlzLno9cix0aGlzfXNldFRvKHt4OmU9MCx5OnQ9MCx6OnI9MX0pe3JldHVybiB0aGlzLng9ZSx0aGlzLnk9dCx0aGlzLno9cix0aGlzfXJvdChlKXtpZihlPT09MClyZXR1cm4gdGhpcztjb25zdHt4OnQseTpyfT10aGlzLGk9TWF0aC5zaW4oZSkscz1NYXRoLmNvcyhlKTtyZXR1cm4gdGhpcy54PXQqcy1yKmksdGhpcy55PXQqaStyKnMsdGhpc31yb3RXaXRoKGUsdCl7aWYodD09PTApcmV0dXJuIHRoaXM7Y29uc3Qgcj10aGlzLngtZS54LGk9dGhpcy55LWUueSxzPU1hdGguc2luKHQpLG49TWF0aC5jb3ModCk7cmV0dXJuIHRoaXMueD1lLngrKHIqbi1pKnMpLHRoaXMueT1lLnkrKHIqcytpKm4pLHRoaXN9Y2xvbmUoKXtjb25zdHt4OmUseTp0LHo6cn09dGhpcztyZXR1cm4gbmV3IHAoZSx0LHIpfXN1YihlKXtyZXR1cm4gdGhpcy54LT1lLngsdGhpcy55LT1lLnksdGhpc31zdWJYWShlLHQpe3JldHVybiB0aGlzLngtPWUsdGhpcy55LT10LHRoaXN9c3ViU2NhbGFyKGUpe3JldHVybiB0aGlzLngtPWUsdGhpcy55LT1lLHRoaXN9YWRkKGUpe3JldHVybiB0aGlzLngrPWUueCx0aGlzLnkrPWUueSx0aGlzfWFkZFhZKGUsdCl7cmV0dXJuIHRoaXMueCs9ZSx0aGlzLnkrPXQsdGhpc31hZGRTY2FsYXIoZSl7cmV0dXJuIHRoaXMueCs9ZSx0aGlzLnkrPWUsdGhpc31jbGFtcChlLHQpe3JldHVybiB0aGlzLng9TWF0aC5tYXgodGhpcy54LGUpLHRoaXMueT1NYXRoLm1heCh0aGlzLnksZSksdCE9PXZvaWQgMCYmKHRoaXMueD1NYXRoLm1pbih0aGlzLngsdCksdGhpcy55PU1hdGgubWluKHRoaXMueSx0KSksdGhpc31kaXYoZSl7cmV0dXJuIHRoaXMueC89ZSx0aGlzLnkvPWUsdGhpc31kaXZWKGUpe3JldHVybiB0aGlzLngvPWUueCx0aGlzLnkvPWUueSx0aGlzfW11bChlKXtyZXR1cm4gdGhpcy54Kj1lLHRoaXMueSo9ZSx0aGlzfW11bFYoZSl7cmV0dXJuIHRoaXMueCo9ZS54LHRoaXMueSo9ZS55LHRoaXN9YWJzKCl7cmV0dXJuIHRoaXMueD1NYXRoLmFicyh0aGlzLngpLHRoaXMueT1NYXRoLmFicyh0aGlzLnkpLHRoaXN9bnVkZ2UoZSx0KXtjb25zdCByPXAuVGFuKGUsdGhpcyk7cmV0dXJuIHRoaXMuYWRkKHIubXVsKHQpKX1uZWcoKXtyZXR1cm4gdGhpcy54Kj0tMSx0aGlzLnkqPS0xLHRoaXN9Y3Jvc3MoZSl7cmV0dXJuIHRoaXMueD10aGlzLnkqZS56LXRoaXMueiplLnksdGhpcy55PXRoaXMueiplLngtdGhpcy54KmUueix0aGlzfWRwcihlKXtyZXR1cm4gcC5EcHIodGhpcyxlKX1jcHIoZSl7cmV0dXJuIHAuQ3ByKHRoaXMsZSl9bGVuMigpe3JldHVybiBwLkxlbjIodGhpcyl9bGVuKCl7cmV0dXJuIHAuTGVuKHRoaXMpfXByeShlKXtyZXR1cm4gcC5QcnkodGhpcyxlKX1wZXIoKXtjb25zdHt4OmUseTp0fT10aGlzO3JldHVybiB0aGlzLng9dCx0aGlzLnk9LWUsdGhpc311bmkoKXtyZXR1cm4gcC5VbmkodGhpcyl9dGFuKGUpe3JldHVybiBwLlRhbih0aGlzLGUpfWRpc3QoZSl7cmV0dXJuIHAuRGlzdCh0aGlzLGUpfWRpc3RhbmNlVG9MaW5lU2VnbWVudChlLHQpe3JldHVybiBwLkRpc3RhbmNlVG9MaW5lU2VnbWVudChlLHQsdGhpcyl9c2xvcGUoZSl7cmV0dXJuIHAuU2xvcGUodGhpcyxlKX1zbmFwVG9HcmlkKGUpe3JldHVybiB0aGlzLng9TWF0aC5yb3VuZCh0aGlzLngvZSkqZSx0aGlzLnk9TWF0aC5yb3VuZCh0aGlzLnkvZSkqZSx0aGlzfWFuZ2xlKGUpe3JldHVybiBwLkFuZ2xlKHRoaXMsZSl9dG9BbmdsZSgpe3JldHVybiBwLlRvQW5nbGUodGhpcyl9bHJwKGUsdCl7cmV0dXJuIHRoaXMueD10aGlzLngrKGUueC10aGlzLngpKnQsdGhpcy55PXRoaXMueSsoZS55LXRoaXMueSkqdCx0aGlzfWVxdWFscyhlLHQpe3JldHVybiBwLkVxdWFscyh0aGlzLGUsdCl9ZXF1YWxzWFkoZSx0KXtyZXR1cm4gcC5FcXVhbHNYWSh0aGlzLGUsdCl9bm9ybSgpe2NvbnN0IGU9dGhpcy5sZW4oKTtyZXR1cm4gdGhpcy54PWU9PT0wPzA6dGhpcy54L2UsdGhpcy55PWU9PT0wPzA6dGhpcy55L2UsdGhpc310b0ZpeGVkKCl7cmV0dXJuIHAuVG9GaXhlZCh0aGlzKX10b1N0cmluZygpe3JldHVybiBwLlRvU3RyaW5nKHAuVG9GaXhlZCh0aGlzKSl9dG9Kc29uKCl7cmV0dXJuIHAuVG9Kc29uKHRoaXMpfXRvQXJyYXkoKXtyZXR1cm4gcC5Ub0FycmF5KHRoaXMpfXN0YXRpYyBBZGQoZSx0KXtyZXR1cm4gbmV3IHAoZS54K3QueCxlLnkrdC55KX1zdGF0aWMgQWRkWFkoZSx0LHIpe3JldHVybiBuZXcgcChlLngrdCxlLnkrcil9c3RhdGljIFN1YihlLHQpe3JldHVybiBuZXcgcChlLngtdC54LGUueS10LnkpfXN0YXRpYyBTdWJYWShlLHQscil7cmV0dXJuIG5ldyBwKGUueC10LGUueS1yKX1zdGF0aWMgQWRkU2NhbGFyKGUsdCl7cmV0dXJuIG5ldyBwKGUueCt0LGUueSt0KX1zdGF0aWMgU3ViU2NhbGFyKGUsdCl7cmV0dXJuIG5ldyBwKGUueC10LGUueS10KX1zdGF0aWMgRGl2KGUsdCl7cmV0dXJuIG5ldyBwKGUueC90LGUueS90KX1zdGF0aWMgTXVsKGUsdCl7cmV0dXJuIG5ldyBwKGUueCp0LGUueSp0KX1zdGF0aWMgRGl2VihlLHQpe3JldHVybiBuZXcgcChlLngvdC54LGUueS90LnkpfXN0YXRpYyBNdWxWKGUsdCl7cmV0dXJuIG5ldyBwKGUueCp0LngsZS55KnQueSl9c3RhdGljIE5lZyhlKXtyZXR1cm4gbmV3IHAoLWUueCwtZS55KX1zdGF0aWMgUGVyKGUpe3JldHVybiBuZXcgcChlLnksLWUueCl9c3RhdGljIERpc3QyKGUsdCl7cmV0dXJuIHAuU3ViKGUsdCkubGVuMigpfXN0YXRpYyBBYnMoZSl7cmV0dXJuIG5ldyBwKE1hdGguYWJzKGUueCksTWF0aC5hYnMoZS55KSl9c3RhdGljIERpc3QoZSx0KXtyZXR1cm4gTWF0aC5oeXBvdChlLnktdC55LGUueC10LngpfXN0YXRpYyBEcHIoZSx0KXtyZXR1cm4gZS54KnQueCtlLnkqdC55fXN0YXRpYyBDcm9zcyhlLHQpe3JldHVybiBuZXcgcChlLnkqdC56LWUueip0LnksZS56KnQueC1lLngqdC56KX1zdGF0aWMgQ3ByKGUsdCl7cmV0dXJuIGUueCp0LnktdC54KmUueX1zdGF0aWMgTGVuMihlKXtyZXR1cm4gZS54KmUueCtlLnkqZS55fXN0YXRpYyBMZW4oZSl7cmV0dXJuIE1hdGguaHlwb3QoZS54LGUueSl9c3RhdGljIFByeShlLHQpe3JldHVybiBwLkRwcihlLHQpL3AuTGVuKHQpfXN0YXRpYyBVbmkoZSl7cmV0dXJuIHAuRGl2KGUscC5MZW4oZSkpfXN0YXRpYyBUYW4oZSx0KXtyZXR1cm4gcC5VbmkocC5TdWIoZSx0KSl9c3RhdGljIE1pbihlLHQpe3JldHVybiBuZXcgcChNYXRoLm1pbihlLngsdC54KSxNYXRoLm1pbihlLnksdC55KSl9c3RhdGljIE1heChlLHQpe3JldHVybiBuZXcgcChNYXRoLm1heChlLngsdC54KSxNYXRoLm1heChlLnksdC55KSl9c3RhdGljIEZyb20oZSl7cmV0dXJuIG5ldyBwKCkuYWRkKGUpfXN0YXRpYyBGcm9tQXJyYXkoZSl7cmV0dXJuIG5ldyBwKGVbMF0sZVsxXSl9c3RhdGljIFJvdChlLHQ9MCl7Y29uc3Qgcj1NYXRoLnNpbih0KSxpPU1hdGguY29zKHQpO3JldHVybiBuZXcgcChlLngqaS1lLnkqcixlLngqcitlLnkqaSl9c3RhdGljIFJvdFdpdGgoZSx0LHIpe2NvbnN0IGk9ZS54LXQueCxzPWUueS10Lnksbj1NYXRoLnNpbihyKSxhPU1hdGguY29zKHIpO3JldHVybiBuZXcgcCh0LngrKGkqYS1zKm4pLHQueSsoaSpuK3MqYSkpfXN0YXRpYyBOZWFyZXN0UG9pbnRPbkxpbmVUaHJvdWdoUG9pbnQoZSx0LHIpe3JldHVybiBwLk11bCh0LHAuU3ViKHIsZSkucHJ5KHQpKS5hZGQoZSl9c3RhdGljIE5lYXJlc3RQb2ludE9uTGluZVNlZ21lbnQoZSx0LHIsaT0hMCl7Y29uc3Qgcz1wLlRhbih0LGUpLG49cC5BZGQoZSxwLk11bChzLHAuU3ViKHIsZSkucHJ5KHMpKSk7aWYoaSl7aWYobi54PE1hdGgubWluKGUueCx0LngpKXJldHVybiBwLkNhc3QoZS54PHQueD9lOnQpO2lmKG4ueD5NYXRoLm1heChlLngsdC54KSlyZXR1cm4gcC5DYXN0KGUueD50Lng/ZTp0KTtpZihuLnk8TWF0aC5taW4oZS55LHQueSkpcmV0dXJuIHAuQ2FzdChlLnk8dC55P2U6dCk7aWYobi55Pk1hdGgubWF4KGUueSx0LnkpKXJldHVybiBwLkNhc3QoZS55PnQueT9lOnQpfXJldHVybiBufXN0YXRpYyBEaXN0YW5jZVRvTGluZVRocm91Z2hQb2ludChlLHQscil7cmV0dXJuIHAuRGlzdChyLHAuTmVhcmVzdFBvaW50T25MaW5lVGhyb3VnaFBvaW50KGUsdCxyKSl9c3RhdGljIERpc3RhbmNlVG9MaW5lU2VnbWVudChlLHQscixpPSEwKXtyZXR1cm4gcC5EaXN0KHIscC5OZWFyZXN0UG9pbnRPbkxpbmVTZWdtZW50KGUsdCxyLGkpKX1zdGF0aWMgU25hcChlLHQ9MSl7cmV0dXJuIG5ldyBwKE1hdGgucm91bmQoZS54L3QpKnQsTWF0aC5yb3VuZChlLnkvdCkqdCl9c3RhdGljIENhc3QoZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBwP2U6cC5Gcm9tKGUpfXN0YXRpYyBTbG9wZShlLHQpe3JldHVybiBlLng9PT10Lnk/TmFOOihlLnktdC55KS8oZS54LXQueCl9c3RhdGljIEFuZ2xlKGUsdCl7cmV0dXJuIE1hdGguYXRhbjIodC55LWUueSx0LngtZS54KX1zdGF0aWMgTHJwKGUsdCxyKXtyZXR1cm4gcC5TdWIodCxlKS5tdWwocikuYWRkKGUpfXN0YXRpYyBNZWQoZSx0KXtyZXR1cm4gbmV3IHAoKGUueCt0LngpLzIsKGUueSt0LnkpLzIpfXN0YXRpYyBFcXVhbHMoZSx0LHI9MWUtNCl7cmV0dXJuIE1hdGguYWJzKGUueC10LngpPHImJk1hdGguYWJzKGUueS10LnkpPHJ9c3RhdGljIEVxdWFsc1hZKGUsdCxyKXtyZXR1cm4gZS54PT09dCYmZS55PT09cn1zdGF0aWMgRXF1YWxzWFlaKGUsdCxyPTFlLTQpe3JldHVybiBwLkVxdWFscyhlLHQscikmJk1hdGguYWJzKChlLnp8fDApLSh0Lnp8fDApKTxyfXN0YXRpYyBDbG9ja3dpc2UoZSx0LHIpe3JldHVybihyLngtZS54KSoodC55LWUueSktKHQueC1lLngpKihyLnktZS55KTwwfXN0YXRpYyBSZXNjYWxlKGUsdCl7Y29uc3Qgcj1wLkxlbihlKTtyZXR1cm4gbmV3IHAodCplLngvcix0KmUueS9yKX1zdGF0aWMgU2NhbGVXaXRoT3JpZ2luKGUsdCxyKXtyZXR1cm4gcC5TdWIoZSxyKS5tdWwodCkuYWRkKHIpfXN0YXRpYyBTY2FsZVdPcmlnaW4oZSx0LHIpe3JldHVybiBwLlN1YihlLHIpLm11bFYodCkuYWRkKHIpfXN0YXRpYyBUb0ZpeGVkKGUsdD0yKXtyZXR1cm4gbmV3IHAoK2UueC50b0ZpeGVkKHQpLCtlLnkudG9GaXhlZCh0KSwrZS56LnRvRml4ZWQodCkpfXN0YXRpYyBOdWRnZShlLHQscil7cmV0dXJuIHAuQWRkKGUscC5UYW4odCxlKS5tdWwocikpfXN0YXRpYyBUb1N0cmluZyhlKXtyZXR1cm5gJHtlLnh9LCAke2UueX1gfXN0YXRpYyBUb0FuZ2xlKGUpe2xldCB0PU1hdGguYXRhbjIoZS55LGUueCk7cmV0dXJuIHQ8MCYmKHQrPU1hdGguUEkqMiksdH1zdGF0aWMgRnJvbUFuZ2xlKGUsdD0xKXtyZXR1cm4gbmV3IHAoTWF0aC5jb3MoZSkqdCxNYXRoLnNpbihlKSp0KX1zdGF0aWMgVG9BcnJheShlKXtyZXR1cm5bZS54LGUueSxlLnpdfXN0YXRpYyBUb0pzb24oZSl7Y29uc3R7eDp0LHk6cix6Oml9PWU7cmV0dXJue3g6dCx5OnIsejppfX1zdGF0aWMgQXZlcmFnZShlKXtjb25zdCB0PWUubGVuZ3RoLHI9bmV3IHAoMCwwKTtmb3IobGV0IGk9MDtpPHQ7aSsrKXIuYWRkKGVbaV0pO3JldHVybiByLmRpdih0KX1zdGF0aWMgQ2xhbXAoZSx0LHIpe3JldHVybiByPT09dm9pZCAwP25ldyBwKE1hdGgubWluKE1hdGgubWF4KGUueCx0KSksTWF0aC5taW4oTWF0aC5tYXgoZS55LHQpKSk6bmV3IHAoTWF0aC5taW4oTWF0aC5tYXgoZS54LHQpLHIpLE1hdGgubWluKE1hdGgubWF4KGUueSx0KSxyKSl9c3RhdGljIFBvaW50c0JldHdlZW4oZSx0LHI9Nil7Y29uc3QgaT1bXTtmb3IobGV0IHM9MDtzPHI7cysrKXtjb25zdCBuPUJoLmVhc2VJblF1YWQocy8oci0xKSksYT1wLkxycChlLHQsbik7YS56PU1hdGgubWluKDEsLjUrTWF0aC5hYnMoLjUtX2gobikpKi42NSksaS5wdXNoKGEpfXJldHVybiBpfXN0YXRpYyBTbmFwVG9HcmlkKGUsdD04KXtyZXR1cm4gbmV3IHAoTWF0aC5yb3VuZChlLngvdCkqdCxNYXRoLnJvdW5kKGUueS90KSp0KX19Y29uc3QgX2g9bz0+bzwuNT8yKm8qbzotMSsoNC0yKm8pKm87Y2xhc3MgUiBleHRlbmRzIHB7Y29uc3RydWN0b3IoZT0wLHQ9MCxyPTAsaT17eDowLHk6MH0scz0wLG49MCl7c3VwZXIoZSx0LHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ5Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ6Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6aX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6c30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJhIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bn0pfWdldCB0aW1lc3RhbXAoKXtyZXR1cm4gdGhpcy50fWdldCBwcmVzc3VyZSgpe3JldHVybiB0aGlzLnp9Z2V0IGFuZ2xlTnVtKCl7cmV0dXJuIHRoaXMuYX1nZXQgWFkoKXtyZXR1cm5bdGhpcy54LHRoaXMueV19c2V0QShlKXt0aGlzLmE9ZX1zZXRUKGUpe3RoaXMudD1lfXNldHYoZSl7cmV0dXJuIHRoaXMudj17eDplLngseTplLnl9LHRoaXN9c2V0KGU9dGhpcy54LHQ9dGhpcy55LHI9dGhpcy56LGk9dGhpcy52LHM9dGhpcy50LG49dGhpcy5hKXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpcy56PXIsdGhpcy52PWksdGhpcy50PXMsdGhpcy5hPW4sdGhpc31jbG9uZSgpe2NvbnN0e3g6ZSx5OnQsejpyLHY6aSx0OnMsYTpufT10aGlzLGE9e3g6aS54LHk6aS55fTtyZXR1cm4gbmV3IFIoZSx0LHIsYSxzLG4pfWRpc3RhbmNlKGUpe3JldHVybiBSLkdldERpc3RhbmNlKHRoaXMsZSl9aXNOZWFyKGUsdCl7cmV0dXJuIFIuSXNOZWFyKHRoaXMsZSx0KX1nZXRBbmdsZUJ5UG9pbnRzKGUsdCl7cmV0dXJuIFIuR2V0QW5nbGVCeVBvaW50cyhlLHRoaXMsdCl9c3RhdGljIFN1YihlLHQpe3JldHVybiBuZXcgUihlLngtdC54LGUueS10LnkpfXN0YXRpYyBBZGQoZSx0KXtyZXR1cm4gbmV3IFIoZS54K3QueCxlLnkrdC55KX1zdGF0aWMgR2V0RGlzdGFuY2UoZSx0KXtyZXR1cm4gUi5MZW4oZS5jbG9uZSgpLnN1Yih0KSl9c3RhdGljIEdldEFuZ2xlQnlQb2ludHMoZSx0LHIpe2NvbnN0IGk9dC54LWUueCxzPXIueC10Lngsbj10LnktZS55LGE9ci55LXQueTtsZXQgbD0wO2NvbnN0IGM9TWF0aC5zcXJ0KGkqaStuKm4pLHU9TWF0aC5zcXJ0KHMqcythKmEpO2lmKGMmJnUpe2NvbnN0IGg9aSpzK24qYTtsPU1hdGguYWNvcyhoLyhjKnUpKSxsPWwvTWF0aC5QSSoxODA7bGV0IGQ9aSphLW4qcztkPWQ+MD8xOi0xLGw9MTgwK2QqbH1yZXR1cm4gbH1zdGF0aWMgSXNOZWFyKGUsdCxyKXtyZXR1cm4gUi5MZW4oZS5jbG9uZSgpLnN1Yih0KSk8cn1zdGF0aWMgUm90V2l0aChlLHQscixpPTIpe2NvbnN0IHM9ZS54LXQueCxuPWUueS10LnksYT1NYXRoLnNpbihyKSxsPU1hdGguY29zKHIpLGM9TWF0aC5wb3coMTAsaSksdT1NYXRoLmZsb29yKCh0LngrKHMqbC1uKmEpKSpjKS9jLGg9TWF0aC5mbG9vcigodC55KyhzKmErbipsKSkqYykvYztyZXR1cm4gbmV3IFIodSxoKX1zdGF0aWMgR2V0RG90U3Ryb2tlKGUsdCxyPTE2KXtjb25zdCBpPW5ldyBwKDEsMSkscz1NYXRoLlBJKy4wMDEsbj1SLkFkZChlLFIuU3ViKGUsaSkudW5pKCkucGVyKCkubXVsKC10KSksYT1bXTtmb3IobGV0IGw9MS9yLGM9bDtjPD0xO2MrPWwpYS5wdXNoKFIuUm90V2l0aChuLGUscyoyKmMpKTtyZXR1cm4gYX1zdGF0aWMgR2V0U2VtaWNpcmNsZVN0cm9rZShlLHQscj0tMSxpPTgpe2NvbnN0IHM9ciooTWF0aC5QSSsuMDAxKSxuPVtdO2ZvcihsZXQgYT0xL2ksbD1hO2w8PTE7bCs9YSluLnB1c2goUi5Sb3RXaXRoKHQsZSxzKmwpKTtyZXR1cm4gbn19ZnVuY3Rpb24gTShvLGUpe2lmKG8mJmUpe2NvbnN0IHQ9TWF0aC5taW4oby54LGUueCkscj1NYXRoLm1pbihvLnksZS55KSxpPU1hdGgubWF4KG8ueCtvLncsZS54K2Uudykscz1NYXRoLm1heChvLnkrby5oLGUueStlLmgpLG49aS10LGE9cy1yO3JldHVybnt4OnQseTpyLHc6bixoOmF9fXJldHVybiBlfHxvfWZ1bmN0aW9uIEcobyxlPTApe2NvbnN0IHQ9e3g6MCx5OjAsdzowLGg6MH07bGV0IHI9MS8wLGk9MS8wLHM9LTEvMCxuPS0xLzA7cmV0dXJuIG8uZm9yRWFjaChhPT57Y29uc3RbbCxjXT1hLlhZO3I9TWF0aC5taW4ocixsLWUpLGk9TWF0aC5taW4oaSxjLWUpLHM9TWF0aC5tYXgocyxsK2UpLG49TWF0aC5tYXgobixjK2UpfSksdC54PXIsdC55PWksdC53PXMtcix0Lmg9bi1pLHR9ZnVuY3Rpb24gUGUobyxlKXtyZXR1cm4hKG8ueCtvLnc8ZS54fHxvLng+ZS54K2Uud3x8by55K28uaDxlLnl8fG8ueT5lLnkrZS5oKX1mdW5jdGlvbiBFaChvLGUpe3JldHVybiBvLmxlbmd0aD09PWUubGVuZ3RoJiZvLnNvcnQoKS50b1N0cmluZygpPT09ZS5zb3J0KCkudG9TdHJpbmcoKX1mdW5jdGlvbiBLKG8sZT0xMCl7cmV0dXJue3g6TWF0aC5mbG9vcihvLngtZSkseTpNYXRoLmZsb29yKG8ueS1lKSx3Ok1hdGguZmxvb3Ioby53K2UqMiksaDpNYXRoLmZsb29yKG8uaCtlKjIpfX1mdW5jdGlvbiBDZShvLGUpe3JldHVybnt4Om8ueCtlWzBdLHk6by55K2VbMV0sdzpvLncsaDpvLmh9fWZ1bmN0aW9uIFRyKG8sZSl7Y29uc3QgdD1uZXcgcChvLngsby55KSxyPW5ldyBwKG8ueCtvLncsby55KSxpPW5ldyBwKG8ueCtvLncsby55K28uaCkscz1uZXcgcChvLngsby55K28uaCksbj1uZXcgcChvLngrby53LzIsby55K28uaC8yKSxhPU1hdGguUEkqZS8xODAsbD1wLlJvdFdpdGgodCxuLGEpLGM9cC5Sb3RXaXRoKHIsbixhKSx1PXAuUm90V2l0aChpLG4sYSksaD1wLlJvdFdpdGgocyxuLGEpO3JldHVybiBHKFtsLGMsdSxoXSl9ZnVuY3Rpb24gSXIobyxlKXtjb25zdCB0PW5ldyBwKG8ueCxvLnkpLHI9bmV3IHAoby54K28udyxvLnkpLGk9bmV3IHAoby54K28udyxvLnkrby5oKSxzPW5ldyBwKG8ueCxvLnkrby5oKSxuPW5ldyBwKG8ueCtvLncvMixvLnkrby5oLzIpLGE9bmV3IHAoZVswXSxlWzFdKSxsPXAuU2NhbGVXT3JpZ2luKHQsYSxuKSxjPXAuU2NhbGVXT3JpZ2luKHIsYSxuKSx1PXAuU2NhbGVXT3JpZ2luKGksYSxuKSxoPXAuU2NhbGVXT3JpZ2luKHMsYSxuKTtyZXR1cm4gRyhbbCxjLHUsaF0pfWZ1bmN0aW9uIHpoKG8sZSx0KXtjb25zdCByPW5ldyBwKGVbMF0sZVsxXSk7Zm9yKGxldCBpPTA7aTxvLmxlbmd0aDtpKz0zKXtjb25zdCBzPW5ldyBwKG9baV0sb1tpKzFdKSxuPU1hdGguUEkqdC8xODAsYT1wLlJvdFdpdGgocyxyLG4pO29baV09YS54LG9baSsxXT1hLnl9fWZ1bmN0aW9uIFVoKG8sZSx0KXtjb25zdCByPW5ldyBwKGVbMF0sZVsxXSk7Zm9yKGxldCBpPTA7aTxvLmxlbmd0aDtpKz0zKXtjb25zdCBzPW5ldyBwKG9baV0sb1tpKzFdKSxuPW5ldyBwKHRbMF0sdFsxXSk7aWYoaTxvLmxlbmd0aC0zKXtjb25zdCBsPW5ldyBwKG9baSszXSxvW2krNF0pLGM9cC5UYW4obCxzKS5wZXIoKS5tdWwob1tpKzJdKS5tdWxWKG4pLmxlbigpO29baSsyXT1jfWVsc2UgaWYoaT09PW8ubGVuZ3RoLTMpe2NvbnN0IGw9bmV3IHAob1tpLTNdLG9baS0yXSksYz1wLlRhbihzLGwpLnBlcigpLm11bChvW2krMl0pLm11bFYobikubGVuKCk7b1tpKzJdPWN9Y29uc3QgYT1wLlNjYWxlV09yaWdpbihzLG4scik7b1tpXT1hLngsb1tpKzFdPWEueX19ZnVuY3Rpb24gR2gobyxlKXtyZXR1cm4gb1swXT49ZS54JiZvWzBdPD1lLngrZS53JiZvWzFdPj1lLnkmJm9bMV08PWUueStlLmh9ZnVuY3Rpb24geHIobyxlKXtjb25zdCB0PW88PWU/MTpvL2Uscj1lPD1vPzE6ZS9vO3JldHVyblt0LHJdfWNvbnN0IEhlPW89PntpZihvLnRhZ05hbWU9PT0iR1JPVVAiKXtjb25zdCBlPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobykuZmluZCh0PT50LnRvU3RyaW5nKCk9PT0iU3ltYm9sKHNlYWxlZCkiKTtpZihlJiZvW2VdKXJldHVybiEwfXJldHVybiExfSxPcj1vPT5vIT09Uy5UZXh0O2Z1bmN0aW9uIFRlKG8pe3JldHVybmAke1llKG8ueCl9LCR7WWUoby55KX0gYH1mdW5jdGlvbiBJZShvLGUpe3JldHVybmAke1llKChvLngrZS54KS8yKX0sJHtZZSgoby55K2UueSkvMil9IGB9ZnVuY3Rpb24gWWUobyl7cmV0dXJuK28udG9GaXhlZCg0KX12YXIgWGg9ZmUsSGg9Y2UsWWg9IltvYmplY3QgTnVtYmVyXSI7ZnVuY3Rpb24gcWgobyl7cmV0dXJuIHR5cGVvZiBvPT0ibnVtYmVyInx8SGgobykmJlhoKG8pPT1ZaH12YXIgWmg9cWgsaGU9bWUoWmgpO2NsYXNzIHh7Y29uc3RydWN0b3IoZSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNVbml0VGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjFlM30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Tm9kZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrSWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KTtjb25zdHt2Tm9kZXM6dCxmdWxsTGF5ZXI6cixkcmF3TGF5ZXI6aX09ZTt0aGlzLnZOb2Rlcz10LHRoaXMuZnVsbExheWVyPXIsdGhpcy5kcmF3TGF5ZXI9aX1zZXRXb3JrSWQoZSl7dGhpcy53b3JrSWQ9ZX1nZXRXb3JrSWQoKXtyZXR1cm4gdGhpcy53b3JrSWR9Z2V0V29ya09wdGlvbnMoKXtyZXR1cm4gdGhpcy53b3JrT3B0aW9uc31zZXRXb3JrT3B0aW9ucyhlKXt2YXIgaTt0aGlzLndvcmtPcHRpb25zPWUsdGhpcy5zeW5jVW5pdFRpbWU9ZS5zeW5jVW5pdFRpbWV8fHRoaXMuc3luY1VuaXRUaW1lO2NvbnN0IHQ9KGk9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDppLnRvU3RyaW5nKCkscj10JiZ0aGlzLnZOb2Rlcy5nZXQodCl8fHZvaWQgMDt0JiZyJiYoci5vcHQ9ZSx0aGlzLnZOb2Rlcy5zZXRJbmZvKHQscikpfXVwZGF0YU9wdFNlcnZpY2UoZSl7dmFyIGk7bGV0IHQ7Y29uc3Qgcj0oaT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmkudG9TdHJpbmcoKTtpZihyJiZlKXtjb25zdCBzPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHIpfHx0aGlzLmRyYXdMYXllciYmdGhpcy5kcmF3TGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUocil8fFtdO2lmKHMubGVuZ3RoIT09MSlyZXR1cm47Y29uc3Qgbj1zWzBdLHtwb3M6YSx6SW5kZXg6bCxzY2FsZTpjLGFuZ2xlOnUsdHJhbnNsYXRlOmh9PWUsZD17fTtoZShsKSYmKGQuekluZGV4PWwpLGEmJihkLnBvcz1bYVswXSxhWzFdXSksYyYmKGQuc2NhbGU9YyksdSYmKGQucm90YXRlPXUpLGgmJihkLnRyYW5zbGF0ZT1oKSxuLmF0dHIoZCk7Y29uc3QgZj1uPT1udWxsP3ZvaWQgMDpuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybiBmJiYodD1NKHQse3g6TWF0aC5mbG9vcihmLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGYueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoZi53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihmLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfSkpLHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDp0LGNlbnRlclBvczphfSksdH19c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppLHdpbGxTZXJpYWxpemVEYXRhOnMsdGFyZ2V0Tm9kZTpufT1lLHt6SW5kZXg6YSx0cmFuc2xhdGU6bCxhbmdsZTpjLGJveDp1LGJveFNjYWxlOmgsYm94VHJhbnNsYXRlOmQscG9pbnRNYXA6Zn09cjtsZXQgdztjb25zdCB5PW4mJnJlKG4pfHxpLmdldCh0Lm5hbWUpO2lmKCF5KXJldHVybjtoZShhKSYmKHQuc2V0QXR0cmlidXRlKCJ6SW5kZXgiLGEpLHkub3B0LnpJbmRleD1hKTtjb25zdCBnPXQucGFyZW50O2lmKGcpe2lmKHUmJmQmJmgpe2NvbnN0e3JlY3Q6UH09eSxrPVtdO2ZvcihsZXQgRD0wO0Q8eS5vcC5sZW5ndGg7RCs9MylrLnB1c2gobmV3IFIoeS5vcFtEXSx5Lm9wW0QrMV0seS5vcFtEKzJdKSk7Y29uc3QgTz1HKGspLEk9W08udypnLndvcmxkU2NhbGluZ1swXSxPLmgqZy53b3JsZFNjYWxpbmdbMF1dLGI9W1Audy1JWzBdLFAuaC1JWzFdXSx2PVsoUC53KmhbMF0tYlswXSkvSVswXSwoUC5oKmhbMV0tYlsxXSkvSVsxXV0sTD1bZFswXS9nLndvcmxkU2NhbGluZ1swXSxkWzFdL2cud29ybGRTY2FsaW5nWzFdXSxUPXkub3AubWFwKChELEgpPT57Y29uc3QgVj1IJTM7cmV0dXJuIFY9PT0wP0QrTFswXTpWPT09MT9EK0xbMV06RH0pLEE9W3kuY2VudGVyUG9zWzBdK0xbMF0seS5jZW50ZXJQb3NbMV0rTFsxXV07VWgoVCxBLHYpO2NvbnN0ICQ9W107Zm9yKGxldCBEPTA7RDxULmxlbmd0aDtEKz0zKSQucHVzaChuZXcgUihUW0RdLFRbRCsxXSxUW0QrMl0pKTt5Lm9wPVQseS5jZW50ZXJQb3M9QX1lbHNlIGlmKGwpe2NvbnN0IFA9W2xbMF0vZy53b3JsZFNjYWxpbmdbMF0sbFsxXS9nLndvcmxkU2NhbGluZ1sxXV07dC5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsUCkseS5vcHQudHJhbnNsYXRlPVAsbiYmKHc9Q2UoeS5yZWN0LGwpLHkucmVjdD13KX1lbHNlIGhlKGMpJiYodC5zZXRBdHRyaWJ1dGUoInJvdGF0ZSIsYykseS5vcHQucm90YXRlPWMsbiYmKHc9VHIoeS5yZWN0LGMpLHkucmVjdD13KSk7aWYoZil7Y29uc3QgUD1mLmdldCh0Lm5hbWUpO2lmKFApZm9yKGxldCBrPTAsTz0wO2s8eS5vcC5sZW5ndGg7ays9MyxPKyspeS5vcFtrXT1QW09dWzBdLHkub3BbaysxXT1QW09dWzFdfWlmKHMpe2lmKGwpe2NvbnN0IFA9W2xbMF0vZy53b3JsZFNjYWxpbmdbMF0sbFsxXS9nLndvcmxkU2NhbGluZ1sxXV0saz15Lm9wLm1hcCgoTyxJKT0+e2NvbnN0IGI9SSUzO3JldHVybiBiPT09MD9PK1BbMF06Yj09PTE/TytQWzFdOk99KTt5Lm9wPWsseS5jZW50ZXJQb3M9W3kuY2VudGVyUG9zWzBdK1BbMF0seS5jZW50ZXJQb3NbMV0rUFsxXV0seSE9bnVsbCYmeS5vcHQmJih5Lm9wdC50cmFuc2xhdGU9dm9pZCAwKX1lbHNlIGlmKGhlKGMpKXtjb25zdCBQPXkub3A7emgoUCx5LmNlbnRlclBvcyxjKSx5Lm9wPVAseSE9bnVsbCYmeS5vcHQmJih5Lm9wdC5yb3RhdGU9dm9pZCAwKX19eSYmaS5zZXRJbmZvKHQubmFtZSx5KX19c3RhdGljIGdldENlbnRlclBvcyhlLHQpe2NvbnN0e3dvcmxkUG9zaXRpb246cix3b3JsZFNjYWxpbmc6aX09dDtyZXR1cm5bKGUueCtlLncvMi1yWzBdKS9pWzBdLChlLnkrZS5oLzItclsxXSkvaVsxXV19c3RhdGljIGdldFJlY3RGcm9tTGF5ZXIoZSx0KXtjb25zdCByPWUuZ2V0RWxlbWVudHNCeU5hbWUodClbMF07aWYocil7Y29uc3QgaT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoaS54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihpLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGkud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoaS5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19fX1PYmplY3QuZGVmaW5lUHJvcGVydHkoeCwiU2FmZUJvcmRlclBhZGRpbmciLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZToxMH0pO2Z1bmN0aW9uIHhlKG8sZT0hMCl7Y29uc3QgdD1vLmxlbmd0aDtpZih0PDIpcmV0dXJuIiI7bGV0IHI9b1swXSxpPW9bMV07aWYodD09PTIpcmV0dXJuYE0ke1RlKHIpfUwke1RlKGkpfWA7bGV0IHM9IiI7Zm9yKGxldCBuPTIsYT10LTE7bjxhO24rKylyPW9bbl0saT1vW24rMV0scys9SWUocixpKTtyZXR1cm4gZT9gTSR7SWUob1swXSxvWzFdKX1RJHtUZShvWzFdKX0ke0llKG9bMV0sb1syXSl9VCR7c30ke0llKG9bdC0xXSxvWzBdKX0ke0llKG9bMF0sb1sxXSl9WmA6YE0ke1RlKG9bMF0pfVEke1RlKG9bMV0pfSR7SWUob1sxXSxvWzJdKX0ke28ubGVuZ3RoPjM/IlQiOiIifSR7c31MJHtUZShvW3QtMV0pfWB9dmFyIHl0PXtleHBvcnRzOnt9fTt5dC5leHBvcnRzLGZ1bmN0aW9uKG8pe3ZhciBlPWZ1bmN0aW9uKCl7dmFyIHQ9U3RyaW5nLmZyb21DaGFyQ29kZSxyPSJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSIsaT0iQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLSQiLHM9e307ZnVuY3Rpb24gbihsLGMpe2lmKCFzW2xdKXtzW2xdPXt9O2Zvcih2YXIgdT0wO3U8bC5sZW5ndGg7dSsrKXNbbF1bbC5jaGFyQXQodSldPXV9cmV0dXJuIHNbbF1bY119dmFyIGE9e2NvbXByZXNzVG9CYXNlNjQ6ZnVuY3Rpb24obCl7aWYobD09bnVsbClyZXR1cm4iIjt2YXIgYz1hLl9jb21wcmVzcyhsLDYsZnVuY3Rpb24odSl7cmV0dXJuIHIuY2hhckF0KHUpfSk7c3dpdGNoKGMubGVuZ3RoJTQpe2RlZmF1bHQ6Y2FzZSAwOnJldHVybiBjO2Nhc2UgMTpyZXR1cm4gYysiPT09IjtjYXNlIDI6cmV0dXJuIGMrIj09IjtjYXNlIDM6cmV0dXJuIGMrIj0ifX0sZGVjb21wcmVzc0Zyb21CYXNlNjQ6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6bD09IiI/bnVsbDphLl9kZWNvbXByZXNzKGwubGVuZ3RoLDMyLGZ1bmN0aW9uKGMpe3JldHVybiBuKHIsbC5jaGFyQXQoYykpfSl9LGNvbXByZXNzVG9VVEYxNjpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjphLl9jb21wcmVzcyhsLDE1LGZ1bmN0aW9uKGMpe3JldHVybiB0KGMrMzIpfSkrIiAifSxkZWNvbXByZXNzRnJvbVVURjE2OmZ1bmN0aW9uKGwpe3JldHVybiBsPT1udWxsPyIiOmw9PSIiP251bGw6YS5fZGVjb21wcmVzcyhsLmxlbmd0aCwxNjM4NCxmdW5jdGlvbihjKXtyZXR1cm4gbC5jaGFyQ29kZUF0KGMpLTMyfSl9LGNvbXByZXNzVG9VaW50OEFycmF5OmZ1bmN0aW9uKGwpe2Zvcih2YXIgYz1hLmNvbXByZXNzKGwpLHU9bmV3IFVpbnQ4QXJyYXkoYy5sZW5ndGgqMiksaD0wLGQ9Yy5sZW5ndGg7aDxkO2grKyl7dmFyIGY9Yy5jaGFyQ29kZUF0KGgpO3VbaCoyXT1mPj4+OCx1W2gqMisxXT1mJTI1Nn1yZXR1cm4gdX0sZGVjb21wcmVzc0Zyb21VaW50OEFycmF5OmZ1bmN0aW9uKGwpe2lmKGw9PW51bGwpcmV0dXJuIGEuZGVjb21wcmVzcyhsKTtmb3IodmFyIGM9bmV3IEFycmF5KGwubGVuZ3RoLzIpLHU9MCxoPWMubGVuZ3RoO3U8aDt1KyspY1t1XT1sW3UqMl0qMjU2K2xbdSoyKzFdO3ZhciBkPVtdO3JldHVybiBjLmZvckVhY2goZnVuY3Rpb24oZil7ZC5wdXNoKHQoZikpfSksYS5kZWNvbXByZXNzKGQuam9pbigiIikpfSxjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudDpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjphLl9jb21wcmVzcyhsLDYsZnVuY3Rpb24oYyl7cmV0dXJuIGkuY2hhckF0KGMpfSl9LGRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudDpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjpsPT0iIj9udWxsOihsPWwucmVwbGFjZSgvIC9nLCIrIiksYS5fZGVjb21wcmVzcyhsLmxlbmd0aCwzMixmdW5jdGlvbihjKXtyZXR1cm4gbihpLGwuY2hhckF0KGMpKX0pKX0sY29tcHJlc3M6ZnVuY3Rpb24obCl7cmV0dXJuIGEuX2NvbXByZXNzKGwsMTYsZnVuY3Rpb24oYyl7cmV0dXJuIHQoYyl9KX0sX2NvbXByZXNzOmZ1bmN0aW9uKGwsYyx1KXtpZihsPT1udWxsKXJldHVybiIiO3ZhciBoLGQsZj17fSx3PXt9LHk9IiIsZz0iIixQPSIiLGs9MixPPTMsST0yLGI9W10sdj0wLEw9MCxUO2ZvcihUPTA7VDxsLmxlbmd0aDtUKz0xKWlmKHk9bC5jaGFyQXQoVCksT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGYseSl8fChmW3ldPU8rKyx3W3ldPSEwKSxnPVAreSxPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZixnKSlQPWc7ZWxzZXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodyxQKSl7aWYoUC5jaGFyQ29kZUF0KDApPDI1Nil7Zm9yKGg9MDtoPEk7aCsrKXY9djw8MSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKys7Zm9yKGQ9UC5jaGFyQ29kZUF0KDApLGg9MDtoPDg7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1lbHNle2ZvcihkPTEsaD0wO2g8STtoKyspdj12PDwxfGQsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9MDtmb3IoZD1QLmNoYXJDb2RlQXQoMCksaD0wO2g8MTY7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1rLS0saz09MCYmKGs9TWF0aC5wb3coMixJKSxJKyspLGRlbGV0ZSB3W1BdfWVsc2UgZm9yKGQ9ZltQXSxoPTA7aDxJO2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjE7ay0tLGs9PTAmJihrPU1hdGgucG93KDIsSSksSSsrKSxmW2ddPU8rKyxQPVN0cmluZyh5KX1pZihQIT09IiIpe2lmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh3LFApKXtpZihQLmNoYXJDb2RlQXQoMCk8MjU2KXtmb3IoaD0wO2g8STtoKyspdj12PDwxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKztmb3IoZD1QLmNoYXJDb2RlQXQoMCksaD0wO2g8ODtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xfWVsc2V7Zm9yKGQ9MSxoPTA7aDxJO2grKyl2PXY8PDF8ZCxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD0wO2ZvcihkPVAuY2hhckNvZGVBdCgwKSxoPTA7aDwxNjtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xfWstLSxrPT0wJiYoaz1NYXRoLnBvdygyLEkpLEkrKyksZGVsZXRlIHdbUF19ZWxzZSBmb3IoZD1mW1BdLGg9MDtoPEk7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MTtrLS0saz09MCYmKGs9TWF0aC5wb3coMixJKSxJKyspfWZvcihkPTIsaD0wO2g8STtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xO2Zvcig7OylpZih2PXY8PDEsTD09Yy0xKXtiLnB1c2godSh2KSk7YnJlYWt9ZWxzZSBMKys7cmV0dXJuIGIuam9pbigiIil9LGRlY29tcHJlc3M6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6bD09IiI/bnVsbDphLl9kZWNvbXByZXNzKGwubGVuZ3RoLDMyNzY4LGZ1bmN0aW9uKGMpe3JldHVybiBsLmNoYXJDb2RlQXQoYyl9KX0sX2RlY29tcHJlc3M6ZnVuY3Rpb24obCxjLHUpe3ZhciBoPVtdLGQ9NCxmPTQsdz0zLHk9IiIsZz1bXSxQLGssTyxJLGIsdixMLFQ9e3ZhbDp1KDApLHBvc2l0aW9uOmMsaW5kZXg6MX07Zm9yKFA9MDtQPDM7UCs9MSloW1BdPVA7Zm9yKE89MCxiPU1hdGgucG93KDIsMiksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7c3dpdGNoKE8pe2Nhc2UgMDpmb3IoTz0wLGI9TWF0aC5wb3coMiw4KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtMPXQoTyk7YnJlYWs7Y2FzZSAxOmZvcihPPTAsYj1NYXRoLnBvdygyLDE2KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtMPXQoTyk7YnJlYWs7Y2FzZSAyOnJldHVybiIifWZvcihoWzNdPUwsaz1MLGcucHVzaChMKTs7KXtpZihULmluZGV4PmwpcmV0dXJuIiI7Zm9yKE89MCxiPU1hdGgucG93KDIsdyksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7c3dpdGNoKEw9Tyl7Y2FzZSAwOmZvcihPPTAsYj1NYXRoLnBvdygyLDgpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO2hbZisrXT10KE8pLEw9Zi0xLGQtLTticmVhaztjYXNlIDE6Zm9yKE89MCxiPU1hdGgucG93KDIsMTYpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO2hbZisrXT10KE8pLEw9Zi0xLGQtLTticmVhaztjYXNlIDI6cmV0dXJuIGcuam9pbigiIil9aWYoZD09MCYmKGQ9TWF0aC5wb3coMix3KSx3KyspLGhbTF0peT1oW0xdO2Vsc2UgaWYoTD09PWYpeT1rK2suY2hhckF0KDApO2Vsc2UgcmV0dXJuIG51bGw7Zy5wdXNoKHkpLGhbZisrXT1rK3kuY2hhckF0KDApLGQtLSxrPXksZD09MCYmKGQ9TWF0aC5wb3coMix3KSx3KyspfX19O3JldHVybiBhfSgpO28hPW51bGw/by5leHBvcnRzPWU6dHlwZW9mIGFuZ3VsYXI8InUiJiZhbmd1bGFyIT1udWxsJiZhbmd1bGFyLm1vZHVsZSgiTFpTdHJpbmciLFtdKS5mYWN0b3J5KCJMWlN0cmluZyIsZnVuY3Rpb24oKXtyZXR1cm4gZX0pfSh5dCk7dmFyIExyPXl0LmV4cG9ydHM7ZnVuY3Rpb24gcWUobyl7cmV0dXJuIEpTT04ucGFyc2UoTHIuZGVjb21wcmVzcyhvKSl9ZnVuY3Rpb24gbGUobyl7cmV0dXJuIExyLmNvbXByZXNzKEpTT04uc3RyaW5naWZ5KG8pKX1jbGFzcyBDciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuUGVuY2lsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY0luZGV4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJNQVhfUkVQRUFSIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MTB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidW5pVGhpY2tuZXNzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNlbnRlclBvcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlswLDBdfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMudW5pVGhpY2tuZXNzPXRoaXMuTUFYX1JFUEVBUi90aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcy8xMCx0aGlzLnN5bmNUaW1lc3RhbXA9MH1jb21iaW5lQ29uc3VtZSgpe3ZhciBuO2NvbnN0IGU9KG49dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpuLnRvU3RyaW5nKCksdD10aGlzLnRyYW5zZm9ybURhdGFBbGwoITApLHI9e25hbWU6ZX07bGV0IGk7Y29uc3Qgcz10aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7cmV0dXJuIHQubGVuZ3RoJiYoaT10aGlzLmRyYXcoe2F0dHJzOnIsdGFza3M6dCxyZXBsYWNlSWQ6ZSxsYXllcjpzLGlzQ2xlYXJBbGw6ITB9KSkse3JlY3Q6aSx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbH19c2V0V29ya09wdGlvbnMoZSl7c3VwZXIuc2V0V29ya09wdGlvbnMoZSksdGhpcy5zeW5jVGltZXN0YW1wPURhdGUubm93KCl9Y29uc3VtZShlKXt2YXIgeTtjb25zdHtkYXRhOnQsaXNGdWxsV29yazpyLGlzQ2xlYXJBbGw6aSxpc1N1YldvcmtlcjpzfT1lO2lmKCgoeT10Lm9wKT09bnVsbD92b2lkIDA6eS5sZW5ndGgpPT09MClyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e3dvcmtJZDpufT10LHt0YXNrczphLGVmZmVjdHM6bCxjb25zdW1lSW5kZXg6Y309dGhpcy50cmFuc2Zvcm1EYXRhKHQsITEpO3RoaXMuc3luY0luZGV4PU1hdGgubWluKHRoaXMuc3luY0luZGV4LGMsTWF0aC5tYXgoMCx0aGlzLnRtcFBvaW50cy5sZW5ndGgtMikpO2NvbnN0IHU9e25hbWU6bj09bnVsbD92b2lkIDA6bi50b1N0cmluZygpfTtsZXQgaCxkPSExO2NvbnN0IGY9dGhpcy5zeW5jSW5kZXg7aWYodGhpcy5zeW5jVGltZXN0YW1wPT09MCYmKHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpKSxhLmxlbmd0aCYmKGFbMF0udGFza0lkLXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZSYmKGQ9ITAsdGhpcy5zeW5jVGltZXN0YW1wPWFbMF0udGFza0lkLHRoaXMuc3luY0luZGV4PXRoaXMudG1wUG9pbnRzLmxlbmd0aCkscykpe2NvbnN0IGc9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7aD10aGlzLmRyYXcoe2F0dHJzOnUsdGFza3M6YSxlZmZlY3RzOmwsbGF5ZXI6Zyxpc0NsZWFyQWxsOml9KX1pZihzKXJldHVybiBjPjEwJiZ0aGlzLnRtcFBvaW50cy5zcGxpY2UoMCxjLTEwKSx7cmVjdDpoLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsfTtjb25zdCB3PVtdO3JldHVybiB0aGlzLnRtcFBvaW50cy5zbGljZShmKS5mb3JFYWNoKGc9Pnt3LnB1c2goZy54LGcueSx0aGlzLmNvbXB1dFJhZGl1cyhnLnosdGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MpKX0pLHtyZWN0OmgsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOmQ/bjp2b2lkIDAsb3A6ZD93OnZvaWQgMCxpbmRleDpkP2YqMzp2b2lkIDB9fWNvbnN1bWVBbGwoZSl7dmFyIGMsdTtpZihlLmRhdGEpe2NvbnN0e29wOmgsd29ya1N0YXRlOmR9PWUuZGF0YTtoIT1udWxsJiZoLmxlbmd0aCYmZD09PUYuRG9uZSYmdGhpcy53b3JrT3B0aW9ucy5zdHJva2VUeXBlPT09US5TdHJva2UmJnRoaXMudXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZVdoZW5Eb25lKGgpfWNvbnN0IHQ9KGM9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpjLnRvU3RyaW5nKCk7aWYoIXQpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdCByPXRoaXMudHJhbnNmb3JtRGF0YUFsbCghMCksaT17bmFtZTp0fTtsZXQgcztjb25zdCBuPXRoaXMuZnVsbExheWVyO3IubGVuZ3RoJiYocz10aGlzLmRyYXcoe2F0dHJzOmksdGFza3M6cixyZXBsYWNlSWQ6dCxsYXllcjpuLGlzQ2xlYXJBbGw6ITF9KSk7Y29uc3QgYT1bXTt0aGlzLnRtcFBvaW50cy5tYXAoaD0+e2EucHVzaChoLngsaC55LHRoaXMuY29tcHV0UmFkaXVzKGgueix0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcykpfSksdGhpcy5zeW5jVGltZXN0YW1wPTAsZGVsZXRlIHRoaXMud29ya09wdGlvbnMuc3luY1VuaXRUaW1lO2NvbnN0IGw9bGUoYSk7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8odCx7cmVjdDpzLG9wOmEsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsbil9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDp0LG9wczpsLHVwZGF0ZU5vZGVPcHQ6e3Bvczp0aGlzLmNlbnRlclBvcyx1c2VBbmltYXRpb246ITB9LG9wdDp0aGlzLndvcmtPcHRpb25zLHVuZG9UaWNrZXJJZDoodT1lLmRhdGEpPT1udWxsP3ZvaWQgMDp1LnVuZG9UaWNrZXJJZH19Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNJbmRleD0wfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBoO2NvbnN0e29wOnQsaXNGdWxsV29yazpyLHJlcGxhY2VJZDppLGlzQ2xlYXJBbGw6cyxpc1RlbXA6bn09ZTt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGQ9MDtkPHQubGVuZ3RoO2QrPTMpe2NvbnN0IGY9bmV3IFIodFtkXSx0W2QrMV0sdFtkKzJdKTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg+MCl7Y29uc3Qgdz10aGlzLnRtcFBvaW50c1t0aGlzLnRtcFBvaW50cy5sZW5ndGgtMV0seT1wLlN1YihmLHcpLnVuaSgpO2Yuc2V0dih5KX10aGlzLnRtcFBvaW50cy5wdXNoKGYpfWNvbnN0IGE9dGhpcy50cmFuc2Zvcm1EYXRhQWxsKCExKSxsPShoPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6aC50b1N0cmluZygpLGM9e25hbWU6bH07bGV0IHU7aWYobCYmYS5sZW5ndGgpe2NvbnN0IGQ9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7dT10aGlzLmRyYXcoe2F0dHJzOmMsdGFza3M6YSxyZXBsYWNlSWQ6aSxsYXllcjpkLGlzQ2xlYXJBbGw6c30pLHImJiFuJiZ0aGlzLnZOb2Rlcy5zZXRJbmZvKGwse3JlY3Q6dSxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczp1JiZ4LmdldENlbnRlclBvcyh1LGQpfSl9cmV0dXJuIHV9dHJhbnNmb3JtRGF0YUFsbChlPSEwKXtyZXR1cm4gdGhpcy5nZXRUYXNrUG9pbnRzKHRoaXMudG1wUG9pbnRzLGUmJnRoaXMud29ya09wdGlvbnMudGhpY2tuZXNzfHx2b2lkIDApfWRyYXcoZSl7dmFyIEk7Y29uc3R7YXR0cnM6dCx0YXNrczpyLHJlcGxhY2VJZDppLGVmZmVjdHM6cyxsYXllcjpuLGlzQ2xlYXJBbGw6YX09ZSx7c3Ryb2tlQ29sb3I6bCxzdHJva2VUeXBlOmMsdGhpY2tuZXNzOnUsekluZGV4Omgsc2NhbGU6ZCxyb3RhdGU6Zix0cmFuc2xhdGU6d309dGhpcy53b3JrT3B0aW9uczthJiZuLnJlbW92ZUFsbENoaWxkcmVuKCksaSYmKHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGkrIiIpLm1hcChiPT5iLnJlbW92ZSgpKSwoST10aGlzLmRyYXdMYXllcik9PW51bGx8fEkuZ2V0RWxlbWVudHNCeU5hbWUoaSsiIikubWFwKGI9PmIucmVtb3ZlKCkpKSxzIT1udWxsJiZzLnNpemUmJihzLmZvckVhY2goYj0+e3ZhciB2Oyh2PW4uZ2V0RWxlbWVudEJ5SWQoYisiIikpPT1udWxsfHx2LnJlbW92ZSgpfSkscy5jbGVhcigpKTtsZXQgeTtjb25zdCBnPVtdLFA9bi53b3JsZFBvc2l0aW9uLGs9bi53b3JsZFNjYWxpbmc7Zm9yKGxldCBiPTA7YjxyLmxlbmd0aDtiKyspe2NvbnN0e3Bvczp2LHBvaW50czpMLHRhc2tJZDpUfT1yW2JdO3QuaWQ9VC50b1N0cmluZygpO2NvbnN0e3BzOkEscmVjdDokfT10aGlzLmNvbXB1dERyYXdQb2ludHMoTCk7bGV0IEQ7Y29uc3QgSD1MLmxlbmd0aD09PTE7Yz09PVEuU3Ryb2tlfHxIP0Q9eGUoQSwhMCk6RD14ZShBLCExKTtjb25zdCBWPXtwb3M6dixkOkQsZmlsbENvbG9yOmM9PT1RLlN0cm9rZXx8SD9sOnZvaWQgMCxsaW5lRGFzaDpjPT09US5Eb3R0ZWQmJiFIP1sxLHUqMl06Yz09PVEuTG9uZ0RvdHRlZCYmIUg/W3UsdSoyXTp2b2lkIDAsc3Ryb2tlQ29sb3I6bCxsaW5lQ2FwOmM9PT1RLlN0cm9rZXx8SD92b2lkIDA6InJvdW5kIixsaW5lV2lkdGg6Yz09PVEuU3Ryb2tlfHxIPzA6dX07eT1NKHkse3g6TWF0aC5mbG9vcigoJC54K3ZbMF0pKmtbMF0rUFswXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoKCQueSt2WzFdKSprWzFdK1BbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKCQudyprWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKCQuaCprWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9KSxnLnB1c2goVil9ZCYmKHQuc2NhbGU9ZCksZiYmKHQucm90YXRlPWYpLHcmJih0LnRyYW5zbGF0ZT13KTtjb25zdCBPPW5ldyB6Lkdyb3VwO2lmKHkpe3RoaXMuY2VudGVyUG9zPXguZ2V0Q2VudGVyUG9zKHksbiksTy5hdHRyKHsuLi50LG5vcm1hbGl6ZTohMCxpZDp0Lm5hbWUsYW5jaG9yOlsuNSwuNV0sYmdjb2xvcjpjPT09US5TdHJva2U/bDp2b2lkIDAscG9zOnRoaXMuY2VudGVyUG9zLHNpemU6Wyh5LnctMip4LlNhZmVCb3JkZXJQYWRkaW5nKS9rWzBdLCh5LmgtMip4LlNhZmVCb3JkZXJQYWRkaW5nKS9rWzFdXSx6SW5kZXg6aH0pO2NvbnN0IGI9Zy5tYXAodj0+KHYucG9zPVt2LnBvc1swXS10aGlzLmNlbnRlclBvc1swXSx2LnBvc1sxXS10aGlzLmNlbnRlclBvc1sxXV0sbmV3IHouUGF0aCh2KSkpO08uYXBwZW5kKC4uLmIpLGM9PT1RLlN0cm9rZSYmTy5zZWFsKCksbi5hcHBlbmQoTyl9aWYoZHx8Znx8dyl7Y29uc3QgYj1PPT1udWxsP3ZvaWQgMDpPLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2lmKGIpcmV0dXJue3g6TWF0aC5mbG9vcihiLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGIueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoYi53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihiLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm4geX1jb21wdXREcmF3UG9pbnRzKGUpe3JldHVybiB0aGlzLndvcmtPcHRpb25zLnN0cm9rZVR5cGU9PT1RLlN0cm9rZXx8ZS5sZW5ndGg9PT0xP3RoaXMuY29tcHV0U3Ryb2tlKGUpOnRoaXMuY29tcHV0Tm9tYWwoZSl9Y29tcHV0Tm9tYWwoZSl7bGV0IHQ9dGhpcy53b3JrT3B0aW9ucy50aGlja25lc3M7Y29uc3Qgcj1lLm1hcChpPT4odD1NYXRoLm1heCh0LGkucmFkaXVzKSxpLnBvaW50KSk7cmV0dXJue3BzOnIscmVjdDpHKHIsdCl9fWNvbXB1dFN0cm9rZShlKXtyZXR1cm4gZS5sZW5ndGg9PT0xP3RoaXMuY29tcHV0RG90U3Ryb2tlKGVbMF0pOnRoaXMuY29tcHV0TGluZVN0cm9rZShlKX1jb21wdXRMaW5lU3Ryb2tlKGUpe2NvbnN0IHQ9W10scj1bXTtmb3IobGV0IGw9MDtsPGUubGVuZ3RoO2wrKyl7Y29uc3R7cG9pbnQ6YyxyYWRpdXM6dX09ZVtsXTtsZXQgaD1jLnY7bD09PTAmJmUubGVuZ3RoPjEmJihoPWVbbCsxXS5wb2ludC52KTtjb25zdCBkPXAuUGVyKGgpLm11bCh1KTt0LnB1c2goUi5TdWIoYyxkKSksci5wdXNoKFIuQWRkKGMsZCkpfWNvbnN0IGk9ZVtlLmxlbmd0aC0xXSxzPVIuR2V0U2VtaWNpcmNsZVN0cm9rZShpLnBvaW50LHRbdC5sZW5ndGgtMV0sLTEsOCksbj1SLkdldFNlbWljaXJjbGVTdHJva2UoZVswXS5wb2ludCxyWzBdLC0xLDgpLGE9dC5jb25jYXQocyxyLnJldmVyc2UoKSxuKTtyZXR1cm57cHM6YSxyZWN0OkcoYSl9fWNvbXB1dERvdFN0cm9rZShlKXtjb25zdHtwb2ludDp0LHJhZGl1czpyfT1lLGk9e3g6dC54LXIseTp0Lnktcix3OnIqMixoOnIqMn07cmV0dXJue3BzOlIuR2V0RG90U3Ryb2tlKHQsciw4KSxyZWN0Oml9fXRyYW5zZm9ybURhdGEoZSx0KXtjb25zdHtvcDpyLHdvcmtTdGF0ZTppfT1lO2xldCBzPXRoaXMudG1wUG9pbnRzLmxlbmd0aC0xLG49W107aWYociE9bnVsbCYmci5sZW5ndGgmJmkpe2NvbnN0e3N0cm9rZVR5cGU6YSx0aGlja25lc3M6bH09dGhpcy53b3JrT3B0aW9ucyxjPW5ldyBTZXQ7cz1hPT09US5TdHJva2U/dGhpcy51cGRhdGVUZW1wUG9pbnRzV2l0aFByZXNzdXJlKHIsbCxjKTp0aGlzLnVwZGF0ZVRlbXBQb2ludHMocixsLGMpO2NvbnN0IHU9dD90aGlzLnRtcFBvaW50czp0aGlzLnRtcFBvaW50cy5zbGljZShzKTtyZXR1cm4gbj10aGlzLmdldFRhc2tQb2ludHModSxsKSx7dGFza3M6bixlZmZlY3RzOmMsY29uc3VtZUluZGV4OnN9fXJldHVybnt0YXNrczpuLGNvbnN1bWVJbmRleDpzfX1jb21wdXRSYWRpdXMoZSx0KXtyZXR1cm4gZSouMDMqdCt0Ki41fWdldE1pblooZSx0KXtyZXR1cm4oKHR8fE1hdGgubWF4KDEsTWF0aC5mbG9vcihlKi4zKSkpLWUqLjUpKjEwMC9lLzN9Z2V0VGFza1BvaW50cyhlLHQpe3ZhciB1O2NvbnN0IHI9W107aWYoZS5sZW5ndGg9PT0wKXJldHVybltdO2xldCBpPTAscz1lWzBdLngsbj1lWzBdLnksYT1bcyxuXSxsPVtdLGM9ZVswXS50O2Zvcig7aTxlLmxlbmd0aDspe2NvbnN0IGg9ZVtpXSxkPWgueC1zLGY9aC55LW4sdz1oLnoseT10P3RoaXMuY29tcHV0UmFkaXVzKHcsdCk6dztpZihsLnB1c2goe3BvaW50Om5ldyBSKGQsZix3LGVbaV0udikscmFkaXVzOnl9KSxpPjAmJmk8ZS5sZW5ndGgtMSl7Y29uc3QgZz1lW2ldLmdldEFuZ2xlQnlQb2ludHMoZVtpLTFdLGVbaSsxXSk7aWYoZzw5MHx8Zz4yNzApe2NvbnN0IFA9KHU9bC5wb3AoKSk9PW51bGw/dm9pZCAwOnUucG9pbnQuY2xvbmUoKTtQJiZyLnB1c2goe3Rhc2tJZDpjLHBvczphLHBvaW50czpbLi4ubCx7cG9pbnQ6UCxyYWRpdXM6eX1dfSkscz1lW2ldLngsbj1lW2ldLnksYT1bcyxuXTtjb25zdCBrPWgueC1zLE89aC55LW47bD1be3BvaW50Om5ldyBSKGssTyx3KSxyYWRpdXM6eX1dLGM9RGF0ZS5ub3coKX19aSsrfXJldHVybiByLnB1c2goe3Rhc2tJZDpjLHBvczphLHBvaW50czpsfSkscn11cGRhdGVUZW1wUG9pbnRzV2l0aFByZXNzdXJlKGUsdCxyKXtjb25zdCBpPURhdGUubm93KCkscz10aGlzLnRtcFBvaW50cy5sZW5ndGg7bGV0IG49cztmb3IobGV0IGw9MDtsPGUubGVuZ3RoO2wrPTIpe249TWF0aC5taW4obixzKTtjb25zdCBjPXRoaXMudG1wUG9pbnRzLmxlbmd0aCx1PW5ldyBSKGVbbF0sZVtsKzFdKTtpZihjPT09MCl7dGhpcy50bXBQb2ludHMucHVzaCh1KTtjb250aW51ZX1jb25zdCBoPWMtMSxkPXRoaXMudG1wUG9pbnRzW2hdLGY9cC5TdWIodSxkKS51bmkoKTtpZih1LmlzTmVhcihkLHQpKXtpZihkLno8dGhpcy5NQVhfUkVQRUFSKXtpZihkLnNldHooTWF0aC5taW4oZC56KzEsdGhpcy5NQVhfUkVQRUFSKSksbj1NYXRoLm1pbihuLGgpLGM+MSl7bGV0IGc9Yy0xO2Zvcig7Zz4wOyl7Y29uc3QgUD10aGlzLnRtcFBvaW50c1tnXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1tnLTFdKSxrPU1hdGgubWF4KHRoaXMudG1wUG9pbnRzW2ddLnotdGhpcy51bmlUaGlja25lc3MqUCwwKTtpZih0aGlzLnRtcFBvaW50c1tnLTFdLno+PWspYnJlYWs7dGhpcy50bXBQb2ludHNbZy0xXS5zZXR6KGspLG49TWF0aC5taW4obixnLTEpLGctLX19fWVsc2Ugbj0xLzA7Y29udGludWV9dS5zZXR2KGYpO2NvbnN0IHc9dS5kaXN0YW5jZShkKSx5PU1hdGgubWF4KGQuei10aGlzLnVuaVRoaWNrbmVzcyp3LDApO2M+MSYmcC5FcXVhbHMoZixkLnYsLjAyKSYmKHk+MHx8ZC56PD0wKSYmKHImJmQudCYmci5hZGQoZC50KSx0aGlzLnRtcFBvaW50cy5wb3AoKSxuPU1hdGgubWluKGgsbikpLHUuc2V0eih5KSx0aGlzLnRtcFBvaW50cy5wdXNoKHUpfWlmKG49PT0xLzApcmV0dXJuIHRoaXMudG1wUG9pbnRzLmxlbmd0aDtsZXQgYT1zO2lmKG49PT1zKXthPU1hdGgubWF4KGEtMSwwKTtjb25zdCBsPXRoaXMudG1wUG9pbnRzW2FdLnQ7bCYmKHI9PW51bGx8fHIuYWRkKGwpKX1lbHNle2xldCBsPXMtMTtmb3IoYT1uO2w+PTA7KXtjb25zdCBjPXRoaXMudG1wUG9pbnRzW2xdLnQ7aWYoYyYmKHI9PW51bGx8fHIuYWRkKGMpLGw8PW4pKXthPWwsbD0tMTticmVha31sLS19fXJldHVybiB0aGlzLnRtcFBvaW50c1thXS5zZXRUKGkpLGF9dXBkYXRlVGVtcFBvaW50cyhlLHQscil7dmFyIGw7Y29uc3QgaT1EYXRlLm5vdygpLHM9dGhpcy50bXBQb2ludHMubGVuZ3RoO2xldCBuPXM7Zm9yKGxldCBjPTA7YzxlLmxlbmd0aDtjKz0yKXtjb25zdCB1PXRoaXMudG1wUG9pbnRzLmxlbmd0aCxoPW5ldyBSKGVbY10sZVtjKzFdKTtpZih1PT09MCl7dGhpcy50bXBQb2ludHMucHVzaChoKTtjb250aW51ZX1jb25zdCBkPXUtMSxmPXRoaXMudG1wUG9pbnRzW2RdLHc9cC5TdWIoaCxmKS51bmkoKTtpZihoLmlzTmVhcihmLHQvMikpe249TWF0aC5taW4oZCxuKTtjb250aW51ZX1wLkVxdWFscyh3LGYudiwuMDIpJiYociYmZi50JiZyLmFkZChmLnQpLHRoaXMudG1wUG9pbnRzLnBvcCgpLG49TWF0aC5taW4oZCxuKSksaC5zZXR2KHcpLHRoaXMudG1wUG9pbnRzLnB1c2goaCl9bGV0IGE9cztpZihuPT09cyl7YT1NYXRoLm1heChhLTEsMCk7Y29uc3QgYz10aGlzLnRtcFBvaW50c1thXS50O2MmJihyPT1udWxsfHxyLmFkZChjKSl9ZWxzZXtsZXQgYz1NYXRoLm1pbihzLTEsbik7Zm9yKGE9bjtjPj0wOyl7Y29uc3QgdT0obD10aGlzLnRtcFBvaW50c1tjXSk9PW51bGw/dm9pZCAwOmwudDtpZih1JiYocj09bnVsbHx8ci5hZGQodSksYzw9bikpe2E9YyxjPS0xO2JyZWFrfWMtLX19cmV0dXJuIHRoaXMudG1wUG9pbnRzW2FdLnNldFQoaSksYX11cGRhdGVUZW1wUG9pbnRzV2l0aFByZXNzdXJlV2hlbkRvbmUoZSl7Y29uc3R7dGhpY2tuZXNzOnR9PXRoaXMud29ya09wdGlvbnMscj1lLmxlbmd0aCxpPXRoaXMuZ2V0TWluWih0KTtmb3IobGV0IHM9MDtzPHI7cys9Mil7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5sZW5ndGgsYT1uZXcgUihlW3NdLGVbcysxXSk7aWYobj09PTApe3RoaXMudG1wUG9pbnRzLnB1c2goYSk7Y29udGludWV9Y29uc3QgbD1uLTEsYz10aGlzLnRtcFBvaW50c1tsXSx1PXAuU3ViKGEsYykudW5pKCksaD1hLmRpc3RhbmNlKGMpO2lmKG4+MSYmYy56PT09aSlicmVhaztpZihhLmlzTmVhcihjLHQvMikpe2lmKHI8MyYmYy56PHRoaXMuTUFYX1JFUEVBUiYmKGMuc2V0eihNYXRoLm1pbihjLnorMSx0aGlzLk1BWF9SRVBFQVIpKSxuPjEpKXtsZXQgZj1uLTE7Zm9yKDtmPjA7KXtjb25zdCB3PXRoaXMudG1wUG9pbnRzW2ZdLmRpc3RhbmNlKHRoaXMudG1wUG9pbnRzW2YtMV0pLHk9TWF0aC5tYXgodGhpcy50bXBQb2ludHNbZl0uei10aGlzLnVuaVRoaWNrbmVzcyp3LC10LzQpO2lmKHRoaXMudG1wUG9pbnRzW2YtMV0uej49eSlicmVhazt0aGlzLnRtcFBvaW50c1tmLTFdLnNldHooeSksZi0tfX1jb250aW51ZX1hLnNldHYodSk7Y29uc3QgZD1NYXRoLm1heChjLnotdGhpcy51bmlUaGlja25lc3MqaCxpKTtuPjEmJnAuRXF1YWxzKHUsYy52LC4wMikmJmMuejw9MCYmdGhpcy50bXBQb2ludHMucG9wKCksYS5zZXR6KGQpLHRoaXMudG1wUG9pbnRzLnB1c2goYSl9fXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBhO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6c309cixuPWkuZ2V0KHQubmFtZSk7cmV0dXJuIHMmJih0LnRhZ05hbWU9PT0iR1JPVVAiP0hlKHQpP3Quc2V0QXR0cmlidXRlKCJiZ2NvbG9yIixzKTp0LmNoaWxkcmVuLmZvckVhY2gobD0+e2wuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksbC5nZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIpJiZsLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixzKX0pOih0LnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHQuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLHMpKSwoYT1uPT1udWxsP3ZvaWQgMDpuLm9wdCkhPW51bGwmJmEuc3Ryb2tlQ29sb3ImJihuLm9wdC5zdHJva2VDb2xvcj1zKSksbiYmaS5zZXRJbmZvKHQubmFtZSxuKSx4LnVwZGF0ZU5vZGVPcHQoZSl9c3RhdGljIGdldFJlY3RGcm9tTGF5ZXIoZSx0KXtjb25zdCByPWUuZ2V0RWxlbWVudHNCeU5hbWUodClbMF07aWYocil7Y29uc3QgaT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoaS54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihpLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGkud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoaS5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19fX1jbGFzcyBOciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuTGFzZXJQZW59KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5ub25lfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY0luZGV4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb25zdW1lSW5kZXgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTowfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wfWNvbWJpbmVDb25zdW1lKCl7fXNldFdvcmtPcHRpb25zKGUpe3N1cGVyLnNldFdvcmtPcHRpb25zKGUpLHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpfWNvbnN1bWUoZSl7Y29uc3R7ZGF0YTp0LGlzU3ViV29ya2VyOnJ9PWUse3dvcmtJZDppLG9wOnN9PXQ7aWYoKHM9PW51bGw/dm9pZCAwOnMubGVuZ3RoKT09PTApcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnVwZGF0ZVRlbXBQb2ludHMoc3x8W10pLHRoaXMuY29uc3VtZUluZGV4PnRoaXMudG1wUG9pbnRzLmxlbmd0aC00KXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7c3Ryb2tlQ29sb3I6bix0aGlja25lc3M6YSxzdHJva2VUeXBlOmx9PXRoaXMud29ya09wdGlvbnMsYz1HKHRoaXMudG1wUG9pbnRzLGEpO2xldCB1PSExO2NvbnN0IGg9dGhpcy5zeW5jSW5kZXgsZD10aGlzLnRtcFBvaW50cy5zbGljZSh0aGlzLmNvbnN1bWVJbmRleCk7dGhpcy5jb25zdW1lSW5kZXg9dGhpcy50bXBQb2ludHMubGVuZ3RoLTEsdGhpcy5zeW5jVGltZXN0YW1wPT09MCYmKHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpKTtjb25zdCBmPXtuYW1lOmk9PW51bGw/dm9pZCAwOmkudG9TdHJpbmcoKSxvcGFjaXR5OjEsbGluZURhc2g6bD09PVEuRG90dGVkP1sxLGEqMl06bD09PVEuTG9uZ0RvdHRlZD9bYSxhKjJdOnZvaWQgMCxzdHJva2VDb2xvcjpuLGxpbmVDYXA6InJvdW5kIixsaW5lV2lkdGg6YSxhbmNob3I6Wy41LC41XX0sdz10aGlzLmdldFRhc2tQb2ludHMoZCk7aWYody5sZW5ndGgpe2NvbnN0IGc9RGF0ZS5ub3coKTtnLXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZSYmKHU9ITAsdGhpcy5zeW5jVGltZXN0YW1wPWcsdGhpcy5zeW5jSW5kZXg9dGhpcy50bXBQb2ludHMubGVuZ3RoKSxyJiZ0aGlzLmRyYXcoe2F0dHJzOmYsdGFza3M6dyxpc0RvdDohMSxsYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXJ9KX1jb25zdCB5PVtdO3JldHVybiB0aGlzLnRtcFBvaW50cy5zbGljZShoKS5mb3JFYWNoKGc9Pnt5LnB1c2goZy54LGcueSl9KSx7cmVjdDp7eDpjLngqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0seTpjLnkqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMV0sdzpjLncqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdLGg6Yy5oKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXX0sdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnU/aTp2b2lkIDAsb3A6dT95OnZvaWQgMCxpbmRleDp1P2gqMjp2b2lkIDB9fWNvbnN1bWVBbGwoKXt2YXIgaTtjb25zdCBlPShpPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpO2xldCB0O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aC0xPnRoaXMuY29uc3VtZUluZGV4KXtsZXQgcz10aGlzLnRtcFBvaW50cy5zbGljZSh0aGlzLmNvbnN1bWVJbmRleCk7Y29uc3Qgbj1zLmxlbmd0aD09PTEse3N0cm9rZUNvbG9yOmEsdGhpY2tuZXNzOmwsc3Ryb2tlVHlwZTpjfT10aGlzLndvcmtPcHRpb25zO2lmKG4pe2NvbnN0IGQ9dGhpcy5jb21wdXREb3RTdHJva2Uoe3BvaW50OnNbMF0scmFkaXVzOmwvMn0pO3M9ZC5wcyx0PWQucmVjdH1lbHNlIHQ9Ryh0aGlzLnRtcFBvaW50cyxsKTtjb25zdCB1PXtuYW1lOmU9PW51bGw/dm9pZCAwOmUudG9TdHJpbmcoKSxmaWxsQ29sb3I6bj9hOnZvaWQgMCxvcGFjaXR5OjEsbGluZURhc2g6Yz09PVEuRG90dGVkJiYhbj9bMSxsKjJdOmM9PT1RLkxvbmdEb3R0ZWQmJiFuP1tsLGwqMl06dm9pZCAwLHN0cm9rZUNvbG9yOmEsbGluZUNhcDpuP3ZvaWQgMDoicm91bmQiLGxpbmVXaWR0aDpuPzA6bCxhbmNob3I6Wy41LC41XX0saD10aGlzLmdldFRhc2tQb2ludHMocyk7aC5sZW5ndGgmJnRoaXMuZHJhdyh7YXR0cnM6dSx0YXNrczpoLGlzRG90Om4sbGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyfSl9Y29uc3Qgcj1bXTtyZXR1cm4gdGhpcy50bXBQb2ludHMuc2xpY2UodGhpcy5zeW5jSW5kZXgpLmZvckVhY2gocz0+e3IucHVzaChzLngscy55KX0pLHtyZWN0OnQmJnt4OnQueCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblswXSx5OnQueSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXSx3OnQudyp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0saDp0LmgqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdfSx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6ZSxvcDpyLGluZGV4OnRoaXMuc3luY0luZGV4KjJ9fWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTAsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jSW5kZXg9MH1jb25zdW1lU2VydmljZShlKXt2YXIgdztjb25zdHtvcDp0LHJlcGxhY2VJZDpyLGlzRnVsbFdvcms6aX09ZSx7c3Ryb2tlQ29sb3I6cyx0aGlja25lc3M6bixzdHJva2VUeXBlOmF9PXRoaXMud29ya09wdGlvbnM7aWYoIXQubGVuZ3RoKXtjb25zdCB5PUcodGhpcy50bXBQb2ludHMsbik7cmV0dXJue3g6eS54KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLHk6eS55KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdLHc6eS53KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSxoOnkuaCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV19fWNvbnN0IGw9TWF0aC5tYXgoMCx0aGlzLnRtcFBvaW50cy5sZW5ndGgtMSk7dGhpcy51cGRhdGVUZW1wUG9pbnRzKHR8fFtdKTtsZXQgYyx1PXRoaXMudG1wUG9pbnRzLnNsaWNlKGwpO2NvbnN0IGg9dS5sZW5ndGg9PT0xO2lmKGgpe2NvbnN0IHk9dGhpcy5jb21wdXREb3RTdHJva2Uoe3BvaW50OnVbMF0scmFkaXVzOm4vMn0pO3U9eS5wcyxjPXkucmVjdH1lbHNlIGM9Ryh0aGlzLnRtcFBvaW50cyxuKTtjb25zdCBkPXtuYW1lOih3PXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6dy50b1N0cmluZygpLGZpbGxDb2xvcjpoP3M6dm9pZCAwLG9wYWNpdHk6MSxsaW5lRGFzaDphPT09US5Eb3R0ZWQmJiFoP1sxLG4qMl06YT09PVEuTG9uZ0RvdHRlZCYmIWg/W24sbioyXTp2b2lkIDAsc3Ryb2tlQ29sb3I6cyxsaW5lQ2FwOmg/dm9pZCAwOiJyb3VuZCIsbGluZVdpZHRoOmg/MDpuLGFuY2hvcjpbLjUsLjVdfSxmPXRoaXMuZ2V0VGFza1BvaW50cyh1KTtpZihmLmxlbmd0aCl7Y29uc3QgeT1pP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcjt0aGlzLmRyYXcoe2F0dHJzOmQsdGFza3M6Zixpc0RvdDpoLHJlcGxhY2VJZDpyLGxheWVyOnl9KX1yZXR1cm57eDpjLngqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0seTpjLnkqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMV0sdzpjLncqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdLGg6Yy5oKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXX19Y29tcHV0RG90U3Ryb2tlKGUpe2NvbnN0e3BvaW50OnQscmFkaXVzOnJ9PWUsaT17eDp0Lngtcix5OnQueS1yLHc6cioyLGg6cioyfTtyZXR1cm57cHM6Ui5HZXREb3RTdHJva2UodCxyLDgpLHJlY3Q6aX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PXRoaXMudG1wUG9pbnRzLmxlbmd0aDtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrPTIpe2lmKHQpe2NvbnN0IGk9dGhpcy50bXBQb2ludHMuc2xpY2UoLTEpWzBdO2kmJmkueD09PWVbcl0mJmkueT09PWVbcisxXSYmdGhpcy50bXBQb2ludHMucG9wKCl9dGhpcy50bXBQb2ludHMucHVzaChuZXcgUihlW3JdLGVbcisxXSkpfX1hc3luYyBkcmF3KGUpe2NvbnN0e2F0dHJzOnQsdGFza3M6cixpc0RvdDppLGxheWVyOnN9PWUse2R1cmF0aW9uOm59PXRoaXMud29ya09wdGlvbnM7Zm9yKGNvbnN0IGEgb2Ygcil7Y29uc3QgbD1uZXcgei5QYXRoLHtwb3M6Yyxwb2ludHM6dX09YTtsZXQgaDtpP2g9eGUodSwhMCk6aD14ZSh1LCExKSxsLmF0dHIoey4uLnQscG9zOmMsZDpofSk7Y29uc3R7dmVydGV4OmQsZnJhZ21lbnQ6Zn09dGhpcy53b3JrT3B0aW9ucztpZihkJiZmKXtjb25zdCB3PXMucmVuZGVyZXIuY3JlYXRlUHJvZ3JhbSh7dmVydGV4OmQsZnJhZ21lbnQ6Zn0pLHt3aWR0aDp5LGhlaWdodDpnfT1zLmdldFJlc29sdXRpb24oKTtsLnNldFVuaWZvcm1zKHt1X3RpbWU6MCx1X3Jlc29sdXRpb246W3ksZ119KSxsLnNldFByb2dyYW0odyl9cy5hcHBlbmRDaGlsZChsKSxsLnRyYW5zaXRpb24obikuYXR0cih7c2NhbGU6aT9bLjEsLjFdOlsxLDFdLGxpbmVXaWR0aDppPzA6MX0pLnRoZW4oKCk9PntsLnJlbW92ZSgpfSl9fWdldFRhc2tQb2ludHMoZSl7dmFyIGw7Y29uc3QgdD1bXTtpZihlLmxlbmd0aD09PTApcmV0dXJuW107bGV0IHI9MCxpPWVbMF0ueCxzPWVbMF0ueSxuPVtpLHNdLGE9W107Zm9yKDtyPGUubGVuZ3RoOyl7Y29uc3QgYz1lW3JdLHU9Yy54LWksaD1jLnktcztpZihhLnB1c2gobmV3IFIodSxoKSkscj4wJiZyPGUubGVuZ3RoLTEpe2NvbnN0IGQ9ZVtyXS5nZXRBbmdsZUJ5UG9pbnRzKGVbci0xXSxlW3IrMV0pO2lmKGQ8OTB8fGQ+MjcwKXtjb25zdCBmPShsPWEucG9wKCkpPT1udWxsP3ZvaWQgMDpsLmNsb25lKCk7ZiYmdC5wdXNoKHtwb3M6bixwb2ludHM6Wy4uLmEsZl19KSxpPWVbcl0ueCxzPWVbcl0ueSxuPVtpLHNdO2NvbnN0IHc9Yy54LWkseT1jLnktczthPVtuZXcgUih3LHkpXX19cisrfXJldHVybiB0LnB1c2goe3BvczpuLHBvaW50czphfSksdH1yZW1vdmVMb2NhbCgpe31yZW1vdmVTZXJ2aWNlKGUpe2xldCB0O2NvbnN0IHI9W107cmV0dXJuIHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGUpLmZvckVhY2goaT0+e2lmKGkubmFtZT09PWUpe2NvbnN0IHM9aS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTt0PU0odCx7eDpzLngseTpzLnksdzpzLndpZHRoLGg6cy5oZWlnaHR9KSxyLnB1c2goaSl9fSksci5sZW5ndGgmJnIuZm9yRWFjaChpPT5pLnJlbW92ZSgpKSx0fX12YXIgUWg9WmU7WmUucG9seWxpbmU9WmUsWmUucG9seWdvbj1KaDtmdW5jdGlvbiBaZShvLGUsdCl7dmFyIHI9by5sZW5ndGgsaT1PZShvWzBdLGUpLHM9W10sbixhLGwsYyx1O2Zvcih0fHwodD1bXSksbj0xO248cjtuKyspe2ZvcihhPW9bbi0xXSxsPW9bbl0sYz11PU9lKGwsZSk7OylpZihpfGMpe2lmKGkmYylicmVhaztpPyhhPXd0KGEsbCxpLGUpLGk9T2UoYSxlKSk6KGw9d3QoYSxsLGMsZSksYz1PZShsLGUpKX1lbHNle3MucHVzaChhKSxjIT09dT8ocy5wdXNoKGwpLG48ci0xJiYodC5wdXNoKHMpLHM9W10pKTpuPT09ci0xJiZzLnB1c2gobCk7YnJlYWt9aT11fXJldHVybiBzLmxlbmd0aCYmdC5wdXNoKHMpLHR9ZnVuY3Rpb24gSmgobyxlKXt2YXIgdCxyLGkscyxuLGEsbDtmb3Iocj0xO3I8PTg7cio9Mil7Zm9yKHQ9W10saT1vW28ubGVuZ3RoLTFdLHM9IShPZShpLGUpJnIpLG49MDtuPG8ubGVuZ3RoO24rKylhPW9bbl0sbD0hKE9lKGEsZSkmciksbCE9PXMmJnQucHVzaCh3dChpLGEscixlKSksbCYmdC5wdXNoKGEpLGk9YSxzPWw7aWYobz10LCFvLmxlbmd0aClicmVha31yZXR1cm4gdH1mdW5jdGlvbiB3dChvLGUsdCxyKXtyZXR1cm4gdCY4P1tvWzBdKyhlWzBdLW9bMF0pKihyWzNdLW9bMV0pLyhlWzFdLW9bMV0pLHJbM11dOnQmND9bb1swXSsoZVswXS1vWzBdKSooclsxXS1vWzFdKS8oZVsxXS1vWzFdKSxyWzFdXTp0JjI/W3JbMl0sb1sxXSsoZVsxXS1vWzFdKSooclsyXS1vWzBdKS8oZVswXS1vWzBdKV06dCYxP1tyWzBdLG9bMV0rKGVbMV0tb1sxXSkqKHJbMF0tb1swXSkvKGVbMF0tb1swXSldOm51bGx9ZnVuY3Rpb24gT2UobyxlKXt2YXIgdD0wO3JldHVybiBvWzBdPGVbMF0/dHw9MTpvWzBdPmVbMl0mJih0fD0yKSxvWzFdPGVbMV0/dHw9NDpvWzFdPmVbM10mJih0fD04KSx0fXZhciBLaD1tZShRaCk7Y2xhc3MgbmUgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUsdCl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEubm9uZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkVyYXNlcn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZXJ2aWNlV29yayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JsZFBvc2l0aW9uIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmxkU2NhbGluZyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlcmFzZXJSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVyYXNlclBvbHlsaW5lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy5zZXJ2aWNlV29yaz10LHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLndvcmxkUG9zaXRpb249dGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvbix0aGlzLndvcmxkU2NhbGluZz10aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmd9Y29tYmluZUNvbnN1bWUoKXt9Y29uc3VtZVNlcnZpY2UoKXt9c2V0V29ya09wdGlvbnMoZSl7c3VwZXIuc2V0V29ya09wdGlvbnMoZSl9Y3JlYXRlRXJhc2VyUmVjdChlKXtjb25zdCB0PWVbMF0qdGhpcy53b3JsZFNjYWxpbmdbMF0rdGhpcy53b3JsZFBvc2l0aW9uWzBdLHI9ZVsxXSp0aGlzLndvcmxkU2NhbGluZ1sxXSt0aGlzLndvcmxkUG9zaXRpb25bMV0se3dpZHRoOmksaGVpZ2h0OnN9PW5lLmVyYXNlclNpemVzW3RoaXMud29ya09wdGlvbnMudGhpY2tuZXNzXTt0aGlzLmVyYXNlclJlY3Q9e3g6dC1pKi41LHk6ci1zKi41LHc6aSxoOnN9LHRoaXMuZXJhc2VyUG9seWxpbmU9W3RoaXMuZXJhc2VyUmVjdC54LHRoaXMuZXJhc2VyUmVjdC55LHRoaXMuZXJhc2VyUmVjdC54K3RoaXMuZXJhc2VyUmVjdC53LHRoaXMuZXJhc2VyUmVjdC55K3RoaXMuZXJhc2VyUmVjdC5oXX1jb21wdXRSZWN0Q2VudGVyUG9pbnRzKCl7Y29uc3QgZT10aGlzLnRtcFBvaW50cy5zbGljZSgtMik7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09NCl7Y29uc3QgdD1uZXcgcCh0aGlzLnRtcFBvaW50c1swXSx0aGlzLnRtcFBvaW50c1sxXSkscj1uZXcgcCh0aGlzLnRtcFBvaW50c1syXSx0aGlzLnRtcFBvaW50c1szXSksaT1wLlN1YihyLHQpLnVuaSgpLHM9cC5EaXN0KHQscikse3dpZHRoOm4saGVpZ2h0OmF9PW5lLmVyYXNlclNpemVzW3RoaXMud29ya09wdGlvbnMudGhpY2tuZXNzXSxsPU1hdGgubWluKG4sYSksYz1NYXRoLnJvdW5kKHMvbCk7aWYoYz4xKXtjb25zdCB1PVtdO2ZvcihsZXQgaD0wO2g8YztoKyspe2NvbnN0IGQ9cC5NdWwoaSxoKmwpO3UucHVzaCh0aGlzLnRtcFBvaW50c1swXStkLngsdGhpcy50bXBQb2ludHNbMV0rZC55KX1yZXR1cm4gdS5jb25jYXQoZSl9fXJldHVybiBlfWlzTmVhcihlLHQpe2NvbnN0IHI9bmV3IHAoZVswXSxlWzFdKSxpPW5ldyBwKHRbMF0sdFsxXSkse3dpZHRoOnMsaGVpZ2h0Om59PW5lLmVyYXNlclNpemVzW3RoaXMud29ya09wdGlvbnMudGhpY2tuZXNzXTtyZXR1cm4gcC5EaXN0KHIsaSk8TWF0aC5oeXBvdChzLG4pKi41fWN1dFBvbHlsaW5lKGUsdCl7bGV0IHI9W3RdLGk9MDtmb3IoO2k8ZS5sZW5ndGg7KXtjb25zdCBhPWVbaV07aWYoYS5sZW5ndGg8MilicmVhaztyPXMocixhKSxpKyt9cmV0dXJuIHI7ZnVuY3Rpb24gcyhhLGwpe2NvbnN0IGM9YTtmb3IobGV0IHU9MDt1PGEubGVuZ3RoO3UrKyl7Y29uc3QgaD1hW3VdLGQ9aC5maW5kSW5kZXgoKGYsdyk9Pnc8aC5sZW5ndGgtMT9uKFtmLGhbdysxXV0sW2xbMF0sbFsxXV0pOiExKTtpZihkIT09LTEmJmQ+LTEpe2NvbnN0IGY9W10sdz1oLnNsaWNlKDAsZCsxKTtpZihwLkVxdWFscyhoW2RdLGxbMF0pfHx3LnB1c2gobFswXS5jbG9uZSgpLnNldHooaFtkXS56KSksdy5sZW5ndGg+MSYmZi5wdXNoKHcpLGQrbC5sZW5ndGgtMTxoLmxlbmd0aC0xKXtjb25zdCB5PWQrbC5sZW5ndGgtMSxnPWguc2xpY2UoeSksUD1sW2wubGVuZ3RoLTFdO3AuRXF1YWxzKGhbeV0sUCl8fGcudW5zaGlmdChQLmNsb25lKCkuc2V0eihoW3ldLnopKSxnLmxlbmd0aD4xJiZmLnB1c2goZyl9cmV0dXJuIGMuc3BsaWNlKHUsMSwuLi5mKSxjfX1yZXR1cm4gY31mdW5jdGlvbiBuKGEsbCl7Y29uc3QgYz1wLlN1YihhWzFdLGFbMF0pLHU9cC5TdWIobFsxXSxsWzBdKSxoPXAuU3ViKGxbMF0sYVswXSk7cmV0dXJuIE1hdGguYWJzKHAuQ3ByKGMsdSkpPC4xJiZNYXRoLmFicyhwLkNwcihjLGgpKTwuMX19aXNTYW1lUG9pbnQoZSx0KXtyZXR1cm4gZVswXT09PXRbMF0mJmVbMV09PT10WzFdfXRyYW5zbGF0ZUludGVyc2VjdChlKXtjb25zdCB0PVtdO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXtjb25zdCBpPWVbcl0uZmlsdGVyKChhLGwsYyk9PiEobD4wJiZ0aGlzLmlzU2FtZVBvaW50KGEsY1tsLTFdKSkpLHM9W107bGV0IG49MDtmb3IoO248aS5sZW5ndGg7KXtjb25zdCBhPWlbbl0sbD1uZXcgcChhWzBdLGFbMV0pO3MucHVzaChsKSxuKyt9dC5wdXNoKHMpfXJldHVybiB0fWlzTGluZUVyYXNlcihlLHQpe3JldHVybiEoZT09PVMuUGVuY2lsJiYhdCl9cmVtb3ZlKGUpe2NvbnN0e2N1ck5vZGVNYXA6dCxyZW1vdmVJZHM6cixuZXdXb3JrRGF0YXM6aX09ZSx7aXNMaW5lOnN9PXRoaXMud29ya09wdGlvbnM7bGV0IG47Zm9yKGNvbnN0W2EsbF1vZiB0LmVudHJpZXMoKSlpZihsLnJlY3QmJnRoaXMuZXJhc2VyUmVjdCYmdGhpcy5lcmFzZXJQb2x5bGluZSYmUGUodGhpcy5lcmFzZXJSZWN0LGwucmVjdCkpe2NvbnN0e29wOmMsdG9vbHNUeXBlOnV9PWwsaD10aGlzLmlzTGluZUVyYXNlcih1LHMpLGQ9W10sZj1bXTtmb3IobGV0IHk9MDt5PGMubGVuZ3RoO3krPTMpe2NvbnN0IGc9bmV3IHAoY1t5XSp0aGlzLndvcmxkU2NhbGluZ1swXSt0aGlzLndvcmxkUG9zaXRpb25bMF0sY1t5KzFdKnRoaXMud29ybGRTY2FsaW5nWzFdK3RoaXMud29ybGRQb3NpdGlvblsxXSxjW3krMl0pO2YucHVzaChnKSxkLnB1c2gobmV3IFIoZy54LGcueSkpfWNvbnN0IHc9ZC5sZW5ndGgmJkcoZCl8fGwucmVjdDtpZihQZSh3LHRoaXMuZXJhc2VyUmVjdCkpe2lmKGYubGVuZ3RoPjEpe2NvbnN0IHk9S2gucG9seWxpbmUoZi5tYXAoZz0+Zy5YWSksdGhpcy5lcmFzZXJQb2x5bGluZSk7aWYoeS5sZW5ndGgmJihyLmFkZChsLm5hbWUpLCFoKSl7Y29uc3QgZz10aGlzLnRyYW5zbGF0ZUludGVyc2VjdCh5KSxQPXRoaXMuY3V0UG9seWxpbmUoZyxmKTtmb3IobGV0IGs9MDtrPFAubGVuZ3RoO2srKyl7Y29uc3QgTz1gJHthfV9zXyR7a31gLEk9W107UFtrXS5mb3JFYWNoKGI9PntJLnB1c2goKGIueC10aGlzLndvcmxkUG9zaXRpb25bMF0pL3RoaXMud29ybGRTY2FsaW5nWzBdLChiLnktdGhpcy53b3JsZFBvc2l0aW9uWzFdKS90aGlzLndvcmxkU2NhbGluZ1sxXSxiLnopfSksbC5vcHQmJmwudG9vbHNUeXBlJiZ0aGlzLnZOb2RlcyYmKHRoaXMudk5vZGVzLnNldEluZm8oTyx7cmVjdDp3LG9wOkksb3B0Omwub3B0LGNhblJvdGF0ZTpsLmNhblJvdGF0ZSxzY2FsZVR5cGU6bC5zY2FsZVR5cGUsdG9vbHNUeXBlOmwudG9vbHNUeXBlfSksaS5zZXQoTyx7d29ya0lkOk8sb3A6SSxvcHQ6bC5vcHQsdG9vbHNUeXBlOmwudG9vbHNUeXBlfSkpfX19ZWxzZSByLmFkZChsLm5hbWUpO249TShuLHcpfX1yZXR1cm4gci5mb3JFYWNoKGE9Pnt2YXIgbDtyZXR1cm4obD10aGlzLnZOb2Rlcyk9PW51bGw/dm9pZCAwOmwuZGVsZXRlKGEpfSksbiYmKG4ueC09eC5TYWZlQm9yZGVyUGFkZGluZyxuLnktPXguU2FmZUJvcmRlclBhZGRpbmcsbi53Kz14LlNhZmVCb3JkZXJQYWRkaW5nKjIsbi5oKz14LlNhZmVCb3JkZXJQYWRkaW5nKjIpLG59Y29uc3VtZShlKXtjb25zdHtvcDp0fT1lLmRhdGE7aWYoIXR8fHQubGVuZ3RoPT09MClyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0IHI9dGhpcy50bXBQb2ludHMubGVuZ3RoO2lmKHI+MSYmdGhpcy5pc05lYXIoW3RbMF0sdFsxXV0sW3RoaXMudG1wUG9pbnRzW3ItMl0sdGhpcy50bXBQb2ludHNbci0xXV0pKXJldHVybnt0eXBlOm0uTm9uZX07cj09PTQmJih0aGlzLnRtcFBvaW50cy5zaGlmdCgpLHRoaXMudG1wUG9pbnRzLnNoaWZ0KCkpLHRoaXMudG1wUG9pbnRzLnB1c2godFswXSx0WzFdKTtjb25zdCBpPXRoaXMuY29tcHV0UmVjdENlbnRlclBvaW50cygpO2xldCBzO2NvbnN0IG49bmV3IFNldCxhPW5ldyBNYXA7dGhpcy52Tm9kZXMuc2V0VGFyZ2V0KCk7Y29uc3QgbD10aGlzLmdldFVuTG9ja05vZGVNYXAodGhpcy52Tm9kZXMuZ2V0TGFzdFRhcmdldCgpKTtmb3IobGV0IGM9MDtjPGkubGVuZ3RoLTE7Yys9Mil7dGhpcy5jcmVhdGVFcmFzZXJSZWN0KGkuc2xpY2UoYyxjKzIpKTtjb25zdCB1PXRoaXMucmVtb3ZlKHtjdXJOb2RlTWFwOmwscmVtb3ZlSWRzOm4sbmV3V29ya0RhdGFzOmF9KTtzPU0ocyx1KX1pZih0aGlzLnZOb2Rlcy5kZWxldGVMYXN0VGFyZ2V0KCkscyYmbi5zaXplKXtmb3IoY29uc3QgYyBvZiBhLmtleXMoKSluLmhhcyhjKSYmYS5kZWxldGUoYyk7cmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLGRhdGFUeXBlOlcuTG9jYWwscmVjdDpzLHJlbW92ZUlkczpbLi4ubl0sbmV3V29ya0RhdGFzOmF9fXJldHVybnt0eXBlOm0uTm9uZX19Y29uc3VtZUFsbChlKXtyZXR1cm4gdGhpcy5jb25zdW1lKGUpfWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9Z2V0VW5Mb2NrTm9kZU1hcChlKXt2YXIgdDtpZih0aGlzLnNlcnZpY2VXb3JrKXtjb25zdCByPXJlKGUpLGk9dGhpcy5zZXJ2aWNlV29yay5zZWxlY3RvcldvcmtTaGFwZXMscz10aGlzLnNlcnZpY2VXb3JrLndvcmtTaGFwZXM7Zm9yKGNvbnN0IG4gb2YgaS52YWx1ZXMoKSlpZigodD1uLnNlbGVjdElkcykhPW51bGwmJnQubGVuZ3RoKWZvcihjb25zdCBhIG9mIG4uc2VsZWN0SWRzKXIuZGVsZXRlKGEpO2Zvcihjb25zdCBuIG9mIHMua2V5cygpKXIuZGVsZXRlKG4pO3JldHVybiByfXJldHVybiBlfX1PYmplY3QuZGVmaW5lUHJvcGVydHkobmUsImVyYXNlclNpemVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6T2JqZWN0LmZyZWV6ZShbT2JqZWN0LmZyZWV6ZSh7d2lkdGg6MTgsaGVpZ2h0OjI2fSksT2JqZWN0LmZyZWV6ZSh7d2lkdGg6MjYsaGVpZ2h0OjM0fSksT2JqZWN0LmZyZWV6ZSh7d2lkdGg6MzQsaGVpZ2h0OjUwfSldKX0pO2NvbnN0IFZoPSIrKyIsZWQ9InNlbGVjdG9yIix0ZD0iYWxsIjt2YXIgcmQ9Il9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18iO2Z1bmN0aW9uIG9kKG8pe3JldHVybiB0aGlzLl9fZGF0YV9fLnNldChvLHJkKSx0aGlzfXZhciBzZD1vZDtmdW5jdGlvbiBpZChvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMobyl9dmFyIG5kPWlkLGFkPVd0LGxkPXNkLGNkPW5kO2Z1bmN0aW9uIFFlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLl9fZGF0YV9fPW5ldyBhZDsrK2U8dDspdGhpcy5hZGQob1tlXSl9UWUucHJvdG90eXBlLmFkZD1RZS5wcm90b3R5cGUucHVzaD1sZCxRZS5wcm90b3R5cGUuaGFzPWNkO3ZhciB1ZD1RZTtmdW5jdGlvbiBoZChvLGUpe2Zvcih2YXIgdD0tMSxyPW89PW51bGw/MDpvLmxlbmd0aDsrK3Q8cjspaWYoZShvW3RdLHQsbykpcmV0dXJuITA7cmV0dXJuITF9dmFyIGRkPWhkO2Z1bmN0aW9uIGZkKG8sZSl7cmV0dXJuIG8uaGFzKGUpfXZhciBwZD1mZCx5ZD11ZCx3ZD1kZCxtZD1wZCxnZD0xLGJkPTI7ZnVuY3Rpb24gdmQobyxlLHQscixpLHMpe3ZhciBuPXQmZ2QsYT1vLmxlbmd0aCxsPWUubGVuZ3RoO2lmKGEhPWwmJiEobiYmbD5hKSlyZXR1cm4hMTt2YXIgYz1zLmdldChvKSx1PXMuZ2V0KGUpO2lmKGMmJnUpcmV0dXJuIGM9PWUmJnU9PW87dmFyIGg9LTEsZD0hMCxmPXQmYmQ/bmV3IHlkOnZvaWQgMDtmb3Iocy5zZXQobyxlKSxzLnNldChlLG8pOysraDxhOyl7dmFyIHc9b1toXSx5PWVbaF07aWYocil2YXIgZz1uP3IoeSx3LGgsZSxvLHMpOnIodyx5LGgsbyxlLHMpO2lmKGchPT12b2lkIDApe2lmKGcpY29udGludWU7ZD0hMTticmVha31pZihmKXtpZighd2QoZSxmdW5jdGlvbihQLGspe2lmKCFtZChmLGspJiYodz09PVB8fGkodyxQLHQscixzKSkpcmV0dXJuIGYucHVzaChrKX0pKXtkPSExO2JyZWFrfX1lbHNlIGlmKCEodz09PXl8fGkodyx5LHQscixzKSkpe2Q9ITE7YnJlYWt9fXJldHVybiBzLmRlbGV0ZShvKSxzLmRlbGV0ZShlKSxkfXZhciBXcj12ZDtmdW5jdGlvbiBTZChvKXt2YXIgZT0tMSx0PUFycmF5KG8uc2l6ZSk7cmV0dXJuIG8uZm9yRWFjaChmdW5jdGlvbihyLGkpe3RbKytlXT1baSxyXX0pLHR9dmFyIGtkPVNkO2Z1bmN0aW9uIFBkKG8pe3ZhciBlPS0xLHQ9QXJyYXkoby5zaXplKTtyZXR1cm4gby5mb3JFYWNoKGZ1bmN0aW9uKHIpe3RbKytlXT1yfSksdH12YXIgVGQ9UGQsUnI9RGUsQXI9c3IsSWQ9VmUseGQ9V3IsT2Q9a2QsTGQ9VGQsQ2Q9MSxOZD0yLFdkPSJbb2JqZWN0IEJvb2xlYW5dIixSZD0iW29iamVjdCBEYXRlXSIsQWQ9IltvYmplY3QgRXJyb3JdIixNZD0iW29iamVjdCBNYXBdIiwkZD0iW29iamVjdCBOdW1iZXJdIixEZD0iW29iamVjdCBSZWdFeHBdIixqZD0iW29iamVjdCBTZXRdIixGZD0iW29iamVjdCBTdHJpbmddIixCZD0iW29iamVjdCBTeW1ib2xdIixfZD0iW29iamVjdCBBcnJheUJ1ZmZlcl0iLEVkPSJbb2JqZWN0IERhdGFWaWV3XSIsTXI9UnI/UnIucHJvdG90eXBlOnZvaWQgMCxtdD1Ncj9Nci52YWx1ZU9mOnZvaWQgMDtmdW5jdGlvbiB6ZChvLGUsdCxyLGkscyxuKXtzd2l0Y2godCl7Y2FzZSBFZDppZihvLmJ5dGVMZW5ndGghPWUuYnl0ZUxlbmd0aHx8by5ieXRlT2Zmc2V0IT1lLmJ5dGVPZmZzZXQpcmV0dXJuITE7bz1vLmJ1ZmZlcixlPWUuYnVmZmVyO2Nhc2UgX2Q6cmV0dXJuIShvLmJ5dGVMZW5ndGghPWUuYnl0ZUxlbmd0aHx8IXMobmV3IEFyKG8pLG5ldyBBcihlKSkpO2Nhc2UgV2Q6Y2FzZSBSZDpjYXNlICRkOnJldHVybiBJZCgrbywrZSk7Y2FzZSBBZDpyZXR1cm4gby5uYW1lPT1lLm5hbWUmJm8ubWVzc2FnZT09ZS5tZXNzYWdlO2Nhc2UgRGQ6Y2FzZSBGZDpyZXR1cm4gbz09ZSsiIjtjYXNlIE1kOnZhciBhPU9kO2Nhc2UgamQ6dmFyIGw9ciZDZDtpZihhfHwoYT1MZCksby5zaXplIT1lLnNpemUmJiFsKXJldHVybiExO3ZhciBjPW4uZ2V0KG8pO2lmKGMpcmV0dXJuIGM9PWU7cnw9TmQsbi5zZXQobyxlKTt2YXIgdT14ZChhKG8pLGEoZSkscixpLHMsbik7cmV0dXJuIG4uZGVsZXRlKG8pLHU7Y2FzZSBCZDppZihtdClyZXR1cm4gbXQuY2FsbChvKT09bXQuY2FsbChlKX1yZXR1cm4hMX12YXIgVWQ9emQsJHI9SnQsR2Q9MSxYZD1PYmplY3QucHJvdG90eXBlLEhkPVhkLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIFlkKG8sZSx0LHIsaSxzKXt2YXIgbj10JkdkLGE9JHIobyksbD1hLmxlbmd0aCxjPSRyKGUpLHU9Yy5sZW5ndGg7aWYobCE9dSYmIW4pcmV0dXJuITE7Zm9yKHZhciBoPWw7aC0tOyl7dmFyIGQ9YVtoXTtpZighKG4/ZCBpbiBlOkhkLmNhbGwoZSxkKSkpcmV0dXJuITF9dmFyIGY9cy5nZXQobyksdz1zLmdldChlKTtpZihmJiZ3KXJldHVybiBmPT1lJiZ3PT1vO3ZhciB5PSEwO3Muc2V0KG8sZSkscy5zZXQoZSxvKTtmb3IodmFyIGc9bjsrK2g8bDspe2Q9YVtoXTt2YXIgUD1vW2RdLGs9ZVtkXTtpZihyKXZhciBPPW4/cihrLFAsZCxlLG8scyk6cihQLGssZCxvLGUscyk7aWYoIShPPT09dm9pZCAwP1A9PT1rfHxpKFAsayx0LHIscyk6Tykpe3k9ITE7YnJlYWt9Z3x8KGc9ZD09ImNvbnN0cnVjdG9yIil9aWYoeSYmIWcpe3ZhciBJPW8uY29uc3RydWN0b3IsYj1lLmNvbnN0cnVjdG9yO0khPWImJiJjb25zdHJ1Y3RvciJpbiBvJiYiY29uc3RydWN0b3IiaW4gZSYmISh0eXBlb2YgST09ImZ1bmN0aW9uIiYmSSBpbnN0YW5jZW9mIEkmJnR5cGVvZiBiPT0iZnVuY3Rpb24iJiZiIGluc3RhbmNlb2YgYikmJih5PSExKX1yZXR1cm4gcy5kZWxldGUobykscy5kZWxldGUoZSkseX12YXIgcWQ9WWQsZ3Q9UnQsWmQ9V3IsUWQ9VWQsSmQ9cWQsRHI9R2UsanI9X2UsRnI9cnQsS2Q9RXQsVmQ9MSxCcj0iW29iamVjdCBBcmd1bWVudHNdIixfcj0iW29iamVjdCBBcnJheV0iLEplPSJbb2JqZWN0IE9iamVjdF0iLGVmPU9iamVjdC5wcm90b3R5cGUsRXI9ZWYuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gdGYobyxlLHQscixpLHMpe3ZhciBuPWpyKG8pLGE9anIoZSksbD1uP19yOkRyKG8pLGM9YT9fcjpEcihlKTtsPWw9PUJyP0plOmwsYz1jPT1Ccj9KZTpjO3ZhciB1PWw9PUplLGg9Yz09SmUsZD1sPT1jO2lmKGQmJkZyKG8pKXtpZighRnIoZSkpcmV0dXJuITE7bj0hMCx1PSExfWlmKGQmJiF1KXJldHVybiBzfHwocz1uZXcgZ3QpLG58fEtkKG8pP1pkKG8sZSx0LHIsaSxzKTpRZChvLGUsbCx0LHIsaSxzKTtpZighKHQmVmQpKXt2YXIgZj11JiZFci5jYWxsKG8sIl9fd3JhcHBlZF9fIiksdz1oJiZFci5jYWxsKGUsIl9fd3JhcHBlZF9fIik7aWYoZnx8dyl7dmFyIHk9Zj9vLnZhbHVlKCk6byxnPXc/ZS52YWx1ZSgpOmU7cmV0dXJuIHN8fChzPW5ldyBndCksaSh5LGcsdCxyLHMpfX1yZXR1cm4gZD8oc3x8KHM9bmV3IGd0KSxKZChvLGUsdCxyLGkscykpOiExfXZhciByZj10ZixvZj1yZix6cj1jZTtmdW5jdGlvbiBVcihvLGUsdCxyLGkpe3JldHVybiBvPT09ZT8hMDpvPT1udWxsfHxlPT1udWxsfHwhenIobykmJiF6cihlKT9vIT09byYmZSE9PWU6b2YobyxlLHQscixVcixpKX12YXIgc2Y9VXIsbmY9c2Y7ZnVuY3Rpb24gYWYobyxlKXtyZXR1cm4gbmYobyxlKX12YXIgbGY9YWYsR3I9bWUobGYpO2NsYXNzIEUgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlNlbGVjdG9yfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlbGVjdElkcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZWxlY3RvckNvbG9yIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN0cm9rZUNvbG9yIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZpbGxDb2xvciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRTZWxlY3RSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblRleHRFZGl0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuTG9jayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2hhcGVPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidGV4dE9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJpc0xvY2tlZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdH1jb21wdXRTZWxlY3RvcihlPSEwKXtjb25zdCB0PUcodGhpcy50bXBQb2ludHMpO2lmKHQudz09PTB8fHQuaD09PTApcmV0dXJue3NlbGVjdElkczpbXSxpbnRlcnNlY3RSZWN0OnZvaWQgMCxzdWJOb2RlTWFwOm5ldyBNYXB9O2NvbnN0e3JlY3RSYW5nZTpyLG5vZGVSYW5nZTppfT10aGlzLnZOb2Rlcy5nZXRSZWN0SW50ZXJzZWN0UmFuZ2UodCxlKTtyZXR1cm57c2VsZWN0SWRzOlsuLi5pLmtleXMoKV0saW50ZXJzZWN0UmVjdDpyLHN1Yk5vZGVNYXA6aX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PXRoaXMudG1wUG9pbnRzLmxlbmd0aCxyPWUubGVuZ3RoO2lmKHI+MSl7Y29uc3QgaT1uZXcgUihlW3ItMl0qdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0sZVtyLTFdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdKTt0PT09Mj90aGlzLnRtcFBvaW50cy5zcGxpY2UoMSwxLGkpOnRoaXMudG1wUG9pbnRzLnB1c2goaSl9fWRyYXdTZWxlY3RvcihlKXtjb25zdHtkcmF3UmVjdDp0LHN1Yk5vZGVNYXA6cixzZWxlY3RvcklkOmksbGF5ZXI6cyxpc1NlcnZpY2U6bn09ZSxhPW5ldyB6Lkdyb3VwKHtwb3M6W3QueCx0LnldLGFuY2hvcjpbMCwwXSxzaXplOlt0LncsdC5oXSxpZDppLG5hbWU6aSx6SW5kZXg6MWUzfSksbD1bXTtpZihuKXtjb25zdCBjPW5ldyB6LlJlY3Qoe25vcm1hbGl6ZTohMCxwb3M6W3Qudy8yLHQuaC8yXSxsaW5lV2lkdGg6MSxzdHJva2VDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3J8fHRoaXMud29ya09wdGlvbnMuc3Ryb2tlQ29sb3Isd2lkdGg6dC53LGhlaWdodDp0LmgsbmFtZTpFLnNlbGVjdG9yQm9yZGVySWR9KTtsLnB1c2goYyl9ci5mb3JFYWNoKChjLHUpPT57Y29uc3QgaD1bYy5yZWN0LngrYy5yZWN0LncvMi10LngsYy5yZWN0LnkrYy5yZWN0LmgvMi10LnldLGQ9bmV3IHouUmVjdCh7bm9ybWFsaXplOiEwLHBvczpoLGxpbmVXaWR0aDoxLHN0cm9rZUNvbG9yOnIuc2l6ZT4xP3RoaXMuc2VsZWN0b3JDb2xvcnx8dGhpcy53b3JrT3B0aW9ucy5zdHJva2VDb2xvcjp2b2lkIDAsd2lkdGg6Yy5yZWN0LncsaGVpZ2h0OmMucmVjdC5oLGlkOmBzZWxlY3Rvci0ke3V9YCxuYW1lOmBzZWxlY3Rvci0ke3V9YH0pO2wucHVzaChkKX0pLGwmJmEuYXBwZW5kKC4uLmwpLChzPT1udWxsP3ZvaWQgMDpzLnBhcmVudCkuYXBwZW5kQ2hpbGQoYSl9ZHJhdyhlLHQscixpPSExKXt2YXIgYSxsO2NvbnN0e2ludGVyc2VjdFJlY3Q6cyxzdWJOb2RlTWFwOm59PXI7KGw9KGE9dC5wYXJlbnQpPT1udWxsP3ZvaWQgMDphLmdldEVsZW1lbnRCeUlkKGUpKT09bnVsbHx8bC5yZW1vdmUoKSxzJiZ0aGlzLmRyYXdTZWxlY3Rvcih7ZHJhd1JlY3Q6cyxzdWJOb2RlTWFwOm4sc2VsZWN0b3JJZDplLGxheWVyOnQsaXNTZXJ2aWNlOml9KX1nZXRTZWxlY3Rlb3JJbmZvKGUpe3RoaXMuc2NhbGVUeXBlPXEuYWxsLHRoaXMuY2FuUm90YXRlPSExLHRoaXMudGV4dE9wdD12b2lkIDAsdGhpcy5zdHJva2VDb2xvcj12b2lkIDAsdGhpcy5maWxsQ29sb3I9dm9pZCAwLHRoaXMuY2FuVGV4dEVkaXQ9ITEsdGhpcy5jYW5Mb2NrPSExLHRoaXMuaXNMb2NrZWQ9ITEsdGhpcy50b29sc1R5cGVzPXZvaWQgMCx0aGlzLnNoYXBlT3B0PXZvaWQgMDtjb25zdCB0PW5ldyBTZXQ7bGV0IHI7Zm9yKGNvbnN0IGkgb2YgZS52YWx1ZXMoKSl7Y29uc3R7b3B0OnMsY2FuUm90YXRlOm4sc2NhbGVUeXBlOmEsdG9vbHNUeXBlOmx9PWk7dGhpcy5zZWxlY3RvckNvbG9yPXRoaXMud29ya09wdGlvbnMuc3Ryb2tlQ29sb3Iscy5zdHJva2VDb2xvciYmKHRoaXMuc3Ryb2tlQ29sb3I9cy5zdHJva2VDb2xvcikscy5maWxsQ29sb3ImJih0aGlzLmZpbGxDb2xvcj1zLmZpbGxDb2xvcikscy50ZXh0T3B0JiYodGhpcy50ZXh0T3B0PXMudGV4dE9wdCksbD09PVMuU3BlZWNoQmFsbG9vbiYmKHQuYWRkKGwpLHRoaXMuc2hhcGVPcHR8fCh0aGlzLnNoYXBlT3B0PXt9KSx0aGlzLnNoYXBlT3B0LnBsYWNlbWVudD1zLnBsYWNlbWVudCksbD09PVMuUG9seWdvbiYmKHQuYWRkKGwpLHRoaXMuc2hhcGVPcHR8fCh0aGlzLnNoYXBlT3B0PXt9KSx0aGlzLnNoYXBlT3B0LnZlcnRpY2VzPXMudmVydGljZXMpLGw9PT1TLlN0YXImJih0LmFkZChsKSx0aGlzLnNoYXBlT3B0fHwodGhpcy5zaGFwZU9wdD17fSksdGhpcy5zaGFwZU9wdC52ZXJ0aWNlcz1zLnZlcnRpY2VzLHRoaXMuc2hhcGVPcHQuaW5uZXJSYXRpbz1zLmlubmVyUmF0aW8sdGhpcy5zaGFwZU9wdC5pbm5lclZlcnRpY2VTdGVwPXMuaW5uZXJWZXJ0aWNlU3RlcCksbD09PVMuVGV4dCYmKHRoaXMudGV4dE9wdD1zKSxlLnNpemU9PT0xJiYodGhpcy50ZXh0T3B0JiYodGhpcy5jYW5UZXh0RWRpdD0hMCksdGhpcy5jYW5Sb3RhdGU9bix0aGlzLnNjYWxlVHlwZT1hKSxhPT09cS5ub25lJiYodGhpcy5zY2FsZVR5cGU9YSksbD09PVMuSW1hZ2UmJihyPWkpfXQuc2l6ZSYmKHRoaXMudG9vbHNUeXBlcz1bLi4udF0pLHImJihlLnNpemU9PT0xPyh0aGlzLmNhbkxvY2s9ITAsci5vcHQubG9ja2VkJiYodGhpcy5pc0xvY2tlZD0hMCx0aGlzLnNjYWxlVHlwZT1xLm5vbmUsdGhpcy5jYW5Sb3RhdGU9ITEsdGhpcy50ZXh0T3B0PXZvaWQgMCx0aGlzLmZpbGxDb2xvcj12b2lkIDAsdGhpcy5zZWxlY3RvckNvbG9yPSJyZ2IoMTc3LDE3NywxNzcpIix0aGlzLnN0cm9rZUNvbG9yPXZvaWQgMCx0aGlzLmNhblRleHRFZGl0PSExKSk6ZS5zaXplPjEmJiFyLm9wdC5sb2NrZWQmJih0aGlzLmNhbkxvY2s9ITEsdGhpcy5jYW5Sb3RhdGU9ITEpKX1nZXRDaGlsZHJlblBvaW50cygpe3ZhciBlO2lmKHRoaXMuc2NhbGVUeXBlPT09cS5ib3RoJiZ0aGlzLnNlbGVjdElkcyl7Y29uc3QgdD10aGlzLnNlbGVjdElkc1swXSxyPShlPXRoaXMudk5vZGVzLmdldCh0KSk9PW51bGw/dm9pZCAwOmUub3A7aWYocil7Y29uc3QgaT1bXTtmb3IobGV0IHM9MDtzPHIubGVuZ3RoO3MrPTMpaS5wdXNoKFtyW3NdLHJbcysxXV0pO3JldHVybiBpfX19Y29uc3VtZShlKXtjb25zdHtvcDp0LHdvcmtTdGF0ZTpyfT1lLmRhdGE7bGV0IGk9dGhpcy5vbGRTZWxlY3RSZWN0O2lmKHI9PT1GLlN0YXJ0JiYoaT10aGlzLmJhY2tUb0Z1bGxMYXllcigpKSwhKHQhPW51bGwmJnQubGVuZ3RoKXx8IXRoaXMudk5vZGVzLmN1ck5vZGVNYXAuc2l6ZSlyZXR1cm57dHlwZTptLk5vbmV9O3RoaXMudXBkYXRlVGVtcFBvaW50cyh0KTtjb25zdCBzPXRoaXMuY29tcHV0U2VsZWN0b3IoKTtpZih0aGlzLnNlbGVjdElkcyYmRWgodGhpcy5zZWxlY3RJZHMscy5zZWxlY3RJZHMpKXJldHVybnt0eXBlOm0uTm9uZX07dGhpcy5zZWxlY3RJZHM9cy5zZWxlY3RJZHM7Y29uc3Qgbj1zLmludGVyc2VjdFJlY3Q7dGhpcy5nZXRTZWxlY3Rlb3JJbmZvKHMuc3ViTm9kZU1hcCksdGhpcy5kcmF3KEUuc2VsZWN0b3JJZCx0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIscyksdGhpcy5vbGRTZWxlY3RSZWN0PW47Y29uc3QgYT10aGlzLmdldENoaWxkcmVuUG9pbnRzKCk7cmV0dXJue3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0Ok0obixpKSxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsb3B0OnRoaXMud29ya09wdGlvbnMsc2VsZWN0UmVjdDpuLHNlbGVjdG9yQ29sb3I6dGhpcy5zZWxlY3RvckNvbG9yLHN0cm9rZUNvbG9yOnRoaXMuc3Ryb2tlQ29sb3IsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLHRleHRPcHQ6dGhpcy50ZXh0T3B0LGNhblRleHRFZGl0OnRoaXMuY2FuVGV4dEVkaXQsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNhbkxvY2s6dGhpcy5jYW5Mb2NrLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSx3aWxsU3luY1NlcnZpY2U6ITAscG9pbnRzOmEsaXNMb2NrZWQ6dGhpcy5pc0xvY2tlZCx0b29sc1R5cGVzOnRoaXMudG9vbHNUeXBlcyxzaGFwZU9wdDp0aGlzLnNoYXBlT3B0fX1jb25zdW1lQWxsKGUpe3ZhciB0LHI7aWYoISgodD10aGlzLnNlbGVjdElkcykhPW51bGwmJnQubGVuZ3RoKSYmdGhpcy50bXBQb2ludHNbMF0mJnRoaXMuc2VsZWN0U2luZ2xlVG9vbCh0aGlzLnRtcFBvaW50c1swXS5YWSxFLnNlbGVjdG9ySWQsITEsZT09bnVsbD92b2lkIDA6ZS5ob3ZlcklkKSwocj10aGlzLnNlbGVjdElkcykhPW51bGwmJnIubGVuZ3RoJiZ0aGlzLnNlYWxUb0RyYXdMYXllcih0aGlzLnNlbGVjdElkcyksdGhpcy5vbGRTZWxlY3RSZWN0KXtjb25zdCBpPXRoaXMuZ2V0Q2hpbGRyZW5Qb2ludHMoKTtyZXR1cm57dHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6dGhpcy5vbGRTZWxlY3RSZWN0LHNlbGVjdElkczp0aGlzLnNlbGVjdElkcyxvcHQ6dGhpcy53b3JrT3B0aW9ucyxzZWxlY3RvckNvbG9yOnRoaXMuc2VsZWN0b3JDb2xvcixzZWxlY3RSZWN0OnRoaXMub2xkU2VsZWN0UmVjdCxzdHJva2VDb2xvcjp0aGlzLnN0cm9rZUNvbG9yLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcix0ZXh0T3B0OnRoaXMudGV4dE9wdCxjYW5UZXh0RWRpdDp0aGlzLmNhblRleHRFZGl0LGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjYW5Mb2NrOnRoaXMuY2FuTG9jayxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsd2lsbFN5bmNTZXJ2aWNlOiEwLHBvaW50czppLGlzTG9ja2VkOnRoaXMuaXNMb2NrZWQsdG9vbHNUeXBlczp0aGlzLnRvb2xzVHlwZXMsc2hhcGVPcHQ6dGhpcy5zaGFwZU9wdH19cmV0dXJue3R5cGU6bS5Ob25lfX1jb25zdW1lU2VydmljZSgpe31jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfWNsZWFyU2VsZWN0RGF0YSgpe3RoaXMuc2VsZWN0SWRzPXZvaWQgMCx0aGlzLm9sZFNlbGVjdFJlY3Q9dm9pZCAwfXNlbGVjdFNpbmdsZVRvb2woZSx0PUUuc2VsZWN0b3JJZCxyPSExLGkpe2lmKGUubGVuZ3RoPT09Mil7Y29uc3Qgcz1lWzBdLG49ZVsxXTtsZXQgYTtmb3IoY29uc3QgbCBvZiB0aGlzLmZ1bGxMYXllci5jaGlsZHJlbil7Y29uc3QgYz1lbyhbbF0pO2xldCB1PSExO2lmKChpJiZpPT09bC5uYW1lfHwhMSkmJmMuZmluZChkPT5kLmlzUG9pbnRDb2xsaXNpb24ocyxuKSkpe2E9bDticmVha31mb3IoY29uc3QgZCBvZiBjKWlmKHU9ZC5pc1BvaW50Q29sbGlzaW9uKHMsbiksdSl7aWYoIWEpYT1sO2Vsc2V7Y29uc3QgZj10aGlzLnZOb2Rlcy5nZXQobC5uYW1lKSx3PXRoaXMudk5vZGVzLmdldChhLm5hbWUpO2lmKChmPT1udWxsP3ZvaWQgMDpmLnRvb2xzVHlwZSkhPT1TLlRleHQmJih3PT1udWxsP3ZvaWQgMDp3LnRvb2xzVHlwZSk9PT1TLlRleHQpYnJlYWs7aWYoKGY9PW51bGw/dm9pZCAwOmYudG9vbHNUeXBlKT09PVMuVGV4dCYmKHc9PW51bGw/dm9pZCAwOncudG9vbHNUeXBlKSE9PVMuVGV4dClhPWw7ZWxzZXtjb25zdCB5PShmPT1udWxsP3ZvaWQgMDpmLm9wdC56SW5kZXgpfHwwLGc9KHc9PW51bGw/dm9pZCAwOncub3B0LnpJbmRleCl8fDA7TnVtYmVyKHkpPj1OdW1iZXIoZykmJihhPWwpfX1icmVha319aWYoYSl7Y29uc3QgbD1hLm5hbWUsYz10aGlzLnZOb2Rlcy5nZXQobCk7aWYoYyl7aWYoIUdyKHRoaXMub2xkU2VsZWN0UmVjdCxjLnJlY3QpKXtjb25zdCB1PW5ldyBNYXAoW1tsLGNdXSk7dGhpcy5nZXRTZWxlY3Rlb3JJbmZvKHUpLHRoaXMuZHJhdyh0LHRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcix7aW50ZXJzZWN0UmVjdDpjLnJlY3Qsc3ViTm9kZU1hcDp1LHNlbGVjdElkczp0aGlzLnNlbGVjdElkc3x8W119LHIpfXRoaXMuc2VsZWN0SWRzPVtsXSx0aGlzLm9sZFNlbGVjdFJlY3Q9Yy5yZWN0fX19fWJhY2tUb0Z1bGxMYXllcihlKXt2YXIgcyxuO2xldCB0O2NvbnN0IHI9W10saT1bXTtmb3IoY29uc3QgYSBvZigocz10aGlzLmRyYXdMYXllcik9PW51bGw/dm9pZCAwOnMuY2hpbGRyZW4pfHxbXSlpZighKGUhPW51bGwmJmUubGVuZ3RoJiYhZS5pbmNsdWRlcyhhLmlkKSkmJmEuaWQhPT1FLnNlbGVjdG9ySWQpe2NvbnN0IGw9YS5jbG9uZU5vZGUoITApO0hlKGEpJiZsLnNlYWwoKSx0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShhLm5hbWUpLmxlbmd0aHx8ci5wdXNoKGwpLGkucHVzaChhKTtjb25zdCBjPShuPXRoaXMudk5vZGVzLmdldChhLm5hbWUpKT09bnVsbD92b2lkIDA6bi5yZWN0O2MmJih0PU0odCxjKSl9cmV0dXJuIGkuZm9yRWFjaChhPT5hLnJlbW92ZSgpKSxyLmxlbmd0aCYmdGhpcy5mdWxsTGF5ZXIuYXBwZW5kKC4uLnIpLHR9c2VhbFRvRHJhd0xheWVyKGUpe3ZhciBpO2NvbnN0IHQ9W10scj1bXTtlLmZvckVhY2gocz0+e3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHMudG9TdHJpbmcoKSkuZm9yRWFjaChuPT57dmFyIGw7Y29uc3QgYT1uLmNsb25lTm9kZSghMCk7SGUobikmJmEuc2VhbCgpLChsPXRoaXMuZHJhd0xheWVyKSE9bnVsbCYmbC5nZXRFbGVtZW50c0J5TmFtZShuLm5hbWUpLmxlbmd0aHx8dC5wdXNoKGEpLHIucHVzaChuKX0pfSksci5mb3JFYWNoKHM9PnMucmVtb3ZlKCkpLHQmJigoaT10aGlzLmRyYXdMYXllcik9PW51bGx8fGkuYXBwZW5kKC4uLnQpKX1nZXRTZWxlY3RvclJlY3QoZSx0KXt2YXIgbjtsZXQgcjtjb25zdCBpPShuPWUucGFyZW50KT09bnVsbD92b2lkIDA6bi5nZXRFbGVtZW50QnlJZCh0KSxzPWk9PW51bGw/dm9pZCAwOmkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuIHMmJihyPU0ocix7eDpNYXRoLmZsb29yKHMueCkseTpNYXRoLmZsb29yKHMueSksdzpNYXRoLnJvdW5kKHMud2lkdGgpLGg6TWF0aC5yb3VuZChzLmhlaWdodCl9KSkscn1pc0NhbkZpbGxDb2xvcihlKXtyZXR1cm4gZT09PVMuRWxsaXBzZXx8ZT09PVMuVHJpYW5nbGV8fGU9PT1TLlJlY3RhbmdsZXx8ZT09PVMuUG9seWdvbnx8ZT09PVMuU3Rhcnx8ZT09PVMuU3BlZWNoQmFsbG9vbn1hc3luYyB1cGRhdGVTZWxlY3RvcihlKXtjb25zdHt1cGRhdGVTZWxlY3Rvck9wdDp0LHNlbGVjdElkczpyLHZOb2RlczppLHdpbGxTZXJpYWxpemVEYXRhOnMsd29ya2VyOm4sb2Zmc2V0OmEsc2NlbmU6bH09ZSxjPXRoaXMuZHJhd0xheWVyO2lmKCFjKXJldHVybjtsZXQgdTtjb25zdCBoPW5ldyBNYXAse2JveDpkLHdvcmtTdGF0ZTpmLGFuZ2xlOncsdHJhbnNsYXRlOnl9PXQ7bGV0IGc9WzAsMF0sUD1bMSwxXSxrPVswLDBdLE8sSTtpZihkfHx5fHxoZSh3KSl7aWYoZj09PUYuU3RhcnQpcmV0dXJuIGkuc2V0VGFyZ2V0KCkse3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxzZWxlY3RSZWN0OnRoaXMub2xkU2VsZWN0UmVjdCxyZWN0OnRoaXMub2xkU2VsZWN0UmVjdH07aWYoTz1pLmdldExhc3RUYXJnZXQoKSxPJiZkKXtsZXQgTDtyPT1udWxsfHxyLmZvckVhY2goVD0+e2NvbnN0IEE9Tz09bnVsbD92b2lkIDA6Ty5nZXQoVCk7TD1NKEwsQT09bnVsbD92b2lkIDA6QS5yZWN0KX0pLEwmJihQPVtkLncvTC53LGQuaC9MLmhdLGc9W2QueCtkLncvMi0oTC54K0wudy8yKSxkLnkrZC5oLzItKEwueStMLmgvMildLGs9W0wueCtMLncvMixMLnkrTC5oLzJdKSxJPUx9fWlmKHIpZm9yKGNvbnN0IEwgb2Ygcil7Y29uc3QgVD1pLmdldChMKTtpZihUKXtjb25zdHt0b29sc1R5cGU6QX09VDtsZXQgJD0oYz09bnVsbD92b2lkIDA6Yy5nZXRFbGVtZW50c0J5TmFtZShMKSlbMF07aWYoJCl7Y29uc3QgRD17Li4udH07bGV0IEg7aWYoQSl7aWYoTyYmKEg9Ty5nZXQoTCksSCYmZCkpe0QuYm94U2NhbGU9UDtjb25zdCBlZT1bSC5yZWN0LngrSC5yZWN0LncvMixILnJlY3QueStILnJlY3QuaC8yXSxzZT1bZWVbMF0ta1swXSxlZVsxXS1rWzFdXTtELmJveFRyYW5zbGF0ZT1bc2VbMF0qKFBbMF0tMSkrZ1swXSsoYSYmYVswXXx8MCksc2VbMV0qKFBbMV0tMSkrZ1sxXSsoYSYmYVsxXXx8MCldfWNvbnN0IFY9VnIoQSk7aWYoVj09bnVsbHx8Vi51cGRhdGVOb2RlT3B0KHtub2RlOiQsb3B0OkQsdk5vZGVzOmksd2lsbFNlcmlhbGl6ZURhdGE6cyx0YXJnZXROb2RlOkh9KSxUJiZuJiYocyYmKEQuYW5nbGV8fEQudHJhbnNsYXRlKXx8RC5ib3gmJkQud29ya1N0YXRlIT09Ri5TdGFydHx8RC5wb2ludE1hcCYmRC5wb2ludE1hcC5oYXMoTCl8fEE9PT1TLlRleHQmJihELmZvbnRTaXplfHxELnRyYW5zbGF0ZXx8RC50ZXh0SW5mb3MmJkQudGV4dEluZm9zLmdldChMKSl8fEE9PT1TLkltYWdlJiYoRC5hbmdsZXx8RC50cmFuc2xhdGV8fEQuYm94U2NhbGUpfHxBPT09RC50b29sc1R5cGUmJkQud2lsbFJlZnJlc2gpKXtjb25zdCBlZT1uLmNyZWF0ZVdvcmtTaGFwZU5vZGUoe3Rvb2xzVHlwZTpBLHRvb2xzT3B0OlQub3B0fSk7ZWU9PW51bGx8fGVlLnNldFdvcmtJZChMKTtsZXQgc2U7QT09PVMuSW1hZ2UmJmw/c2U9YXdhaXQgZWUuY29uc3VtZVNlcnZpY2VBc3luYyh7aXNGdWxsV29yazohMSxyZXBsYWNlSWQ6TCxzY2VuZTpsfSk6c2U9ZWU9PW51bGw/dm9pZCAwOmVlLmNvbnN1bWVTZXJ2aWNlKHtvcDpULm9wLGlzRnVsbFdvcms6ITEscmVwbGFjZUlkOkwsaXNDbGVhckFsbDohMX0pLHNlJiYoVC5yZWN0PXNlLGkuc2V0SW5mbyhMLFQpKSwkPShjPT1udWxsP3ZvaWQgMDpjLmdldEVsZW1lbnRzQnlOYW1lKEwpKVswXX1UJiYoaC5zZXQoTCxUKSx1PU0odSxULnJlY3QpKX19fX1PJiZmPT09Ri5Eb25lJiZpLmRlbGV0ZUxhc3RUYXJnZXQoKTtjb25zdCBiPXU7aWYoSSYmdC5kaXImJmIpe2xldCBMPVswLDBdO3N3aXRjaCh0LmRpcil7Y2FzZSJ0b3BMZWZ0IjpjYXNlImxlZnQiOntjb25zdCBUPVtJLngrSS53LEkueStJLmhdO0w9W1RbMF0tKGIueCtiLncpLFRbMV0tKGIueStiLmgpXTticmVha31jYXNlImJvdHRvbUxlZnQiOmNhc2UiYm90dG9tIjp7Y29uc3QgVD1bSS54K0kudyxJLnldO0w9W1RbMF0tKGIueCtiLncpLFRbMV0tYi55XTticmVha31jYXNlInRvcFJpZ2h0IjpjYXNlInRvcCI6e2NvbnN0IFQ9W0kueCxJLnkrSS5oXTtMPVtUWzBdLWIueCxUWzFdLShiLnkrYi5oKV07YnJlYWt9Y2FzZSJyaWdodCI6Y2FzZSJib3R0b21SaWdodCI6e2NvbnN0IFQ9W0kueCxJLnldO0w9W1RbMF0tYi54LFRbMV0tYi55XTticmVha319aWYoTFswXXx8TFsxXSlyZXR1cm4gYi54PWIueCtMWzBdLGIueT1iLnkrTFsxXSxhd2FpdCB0aGlzLnVwZGF0ZVNlbGVjdG9yKHsuLi5lLG9mZnNldDpMfSl9dGhpcy5nZXRTZWxlY3Rlb3JJbmZvKGgpLHRoaXMuZHJhdyhFLnNlbGVjdG9ySWQsYyx7c2VsZWN0SWRzOnJ8fFtdLHN1Yk5vZGVNYXA6aCxpbnRlcnNlY3RSZWN0OmJ9KTtjb25zdCB2PU0odGhpcy5vbGRTZWxlY3RSZWN0LHUpO3JldHVybiB0aGlzLm9sZFNlbGVjdFJlY3Q9dSx7dHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLkxvY2FsLHNlbGVjdFJlY3Q6YixyZW5kZXJSZWN0OnUscmVjdDpNKHYsYil9fWJsdXJTZWxlY3Rvcigpe2NvbnN0IGU9dGhpcy5iYWNrVG9GdWxsTGF5ZXIoKTtyZXR1cm57dHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6ZSxzZWxlY3RJZHM6W10sd2lsbFN5bmNTZXJ2aWNlOiEwfX1nZXRSaWdodFNlcnZpY2VJZChlKXtyZXR1cm4gZS5yZXBsYWNlKCIrKyIsIi0iKX1zZWxlY3RTZXJ2aWNlTm9kZShlLHQscil7Y29uc3R7c2VsZWN0SWRzOml9PXQscz10aGlzLmdldFJpZ2h0U2VydmljZUlkKGUpLG49dGhpcy5nZXRTZWxlY3RvclJlY3QodGhpcy5mdWxsTGF5ZXIscyk7bGV0IGE7Y29uc3QgbD1uZXcgTWFwO3JldHVybiBpPT1udWxsfHxpLmZvckVhY2goYz0+e2NvbnN0IHU9dGhpcy52Tm9kZXMuZ2V0KGMpLGg9dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoYylbMF07dSYmaCYmKGE9TShhLHUucmVjdCksbC5zZXQoYyx1KSl9KSx0aGlzLmdldFNlbGVjdGVvckluZm8obCksdGhpcy5kcmF3KHMsdGhpcy5mdWxsTGF5ZXIse2ludGVyc2VjdFJlY3Q6YSxzZWxlY3RJZHM6aXx8W10sc3ViTm9kZU1hcDpsfSxyKSxNKGEsbil9cmVSZW5kZXJTZWxlY3Rvcigpe3ZhciByO2xldCBlO2NvbnN0IHQ9bmV3IE1hcDtyZXR1cm4ocj10aGlzLnNlbGVjdElkcyk9PW51bGx8fHIuZm9yRWFjaChpPT57Y29uc3Qgcz10aGlzLnZOb2Rlcy5nZXQoaSk7cyYmKGU9TShlLHMucmVjdCksdC5zZXQoaSxzKSl9LHRoaXMpLHRoaXMuZ2V0U2VsZWN0ZW9ySW5mbyh0KSx0aGlzLmRyYXcoRS5zZWxlY3RvcklkLHRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcix7aW50ZXJzZWN0UmVjdDplLHN1Yk5vZGVNYXA6dCxzZWxlY3RJZHM6dGhpcy5zZWxlY3RJZHN8fFtdfSksdGhpcy5vbGRTZWxlY3RSZWN0PWUsZX11cGRhdGVTZWxlY3RJZHMoZSl7dmFyIG4sYTtsZXQgdDtjb25zdCByPShuPXRoaXMuc2VsZWN0SWRzKT09bnVsbD92b2lkIDA6bi5maWx0ZXIobD0+IWUuaW5jbHVkZXMobCkpLGk9ZS5maWx0ZXIobD0+e3ZhciBjO3JldHVybiEoKGM9dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZjLmluY2x1ZGVzKGwpKX0pO2lmKHIhPW51bGwmJnIubGVuZ3RoJiYodD10aGlzLmJhY2tUb0Z1bGxMYXllcihyKSksaS5sZW5ndGgpe3RoaXMuc2VhbFRvRHJhd0xheWVyKGkpO2Zvcihjb25zdCBsIG9mIGkpe2NvbnN0IGM9KGE9dGhpcy52Tm9kZXMuZ2V0KGwpKT09bnVsbD92b2lkIDA6YS5yZWN0O2MmJih0PU0odCxjKSl9fXRoaXMuc2VsZWN0SWRzPWU7Y29uc3Qgcz10aGlzLnJlUmVuZGVyU2VsZWN0b3IoKTtyZXR1cm57YmdSZWN0OnQsc2VsZWN0UmVjdDpzfX1jdXJzb3JIb3ZlcihlKXt2YXIgcyxuO2NvbnN0IHQ9dGhpcy5vbGRTZWxlY3RSZWN0O3RoaXMuc2VsZWN0SWRzPVtdO2NvbnN0IHI9KHM9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpzLnRvU3RyaW5nKCksaT1bZVswXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblswXSxlWzFdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdXTtpZih0aGlzLnNlbGVjdFNpbmdsZVRvb2woaSxyLCEwKSx0aGlzLm9sZFNlbGVjdFJlY3QmJiFHcih0LHRoaXMub2xkU2VsZWN0UmVjdCkpcmV0dXJue3R5cGU6bS5DdXJzb3JIb3ZlcixkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6TSh0LHRoaXMub2xkU2VsZWN0UmVjdCksc2VsZWN0b3JDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3Isd2lsbFN5bmNTZXJ2aWNlOiExfTtpZigobj10aGlzLnNlbGVjdElkcykhPW51bGwmJm4ubGVuZ3RofHwodGhpcy5vbGRTZWxlY3RSZWN0PXZvaWQgMCksdCYmIXRoaXMub2xkU2VsZWN0UmVjdClyZXR1cm4gdGhpcy5jdXJzb3JCbHVyKCkse3R5cGU6bS5DdXJzb3JIb3ZlcixkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6dCxzZWxlY3RvckNvbG9yOnRoaXMuc2VsZWN0b3JDb2xvcix3aWxsU3luY1NlcnZpY2U6ITF9fWN1cnNvckJsdXIoKXt2YXIgdCxyO3RoaXMuc2VsZWN0SWRzPVtdO2NvbnN0IGU9KHQ9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7KChyPXRoaXMuZnVsbExheWVyKT09bnVsbD92b2lkIDA6ci5wYXJlbnQpLmNoaWxkcmVuLmZvckVhY2goaT0+e2kubmFtZT09PWUmJmkucmVtb3ZlKCl9KX19T2JqZWN0LmRlZmluZVByb3BlcnR5KEUsInNlbGVjdG9ySWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTplZH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFLCJzZWxlY3RvckJvcmRlcklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6InNlbGVjdG9yLWJvcmRlciJ9KTtjbGFzcyBYciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYm90aH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkFycm93fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYXJyb3dUaXBXaWR0aCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuYXJyb3dUaXBXaWR0aD10aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcyo0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dX0pLGQ9TShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2VudGVyUG9zOnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgUDtjb25zdHt3b3JrSWQ6dCxsYXllcjpyfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChrPT5rLnJlbW92ZSgpKSwoUD10aGlzLmRyYXdMYXllcik9PW51bGx8fFAuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGs9PmsucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmksdGhpY2tuZXNzOnMsekluZGV4Om4sc2NhbGU6YSxyb3RhdGU6bCx0cmFuc2xhdGU6Y309dGhpcy53b3JrT3B0aW9ucyx1PXIud29ybGRQb3NpdGlvbixoPXIud29ybGRTY2FsaW5nLHtwb2ludHM6ZCxyZWN0OmZ9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhzKSx5PXtwb3M6W2YueCtmLncvMixmLnkrZi5oLzJdLG5hbWU6dCxpZDp0LGNsb3NlOiEwLHBvaW50czpkLGZpbGxDb2xvcjppLHN0cm9rZUNvbG9yOmksbGluZVdpZHRoOjAsbm9ybWFsaXplOiEwLHpJbmRleDpufTthJiYoeS5zY2FsZT1hKSxsJiYoeS5yb3RhdGU9bCksYyYmKHkudHJhbnNsYXRlPWMpO2NvbnN0IGc9bmV3IHouUG9seWxpbmUoeSk7aWYoci5hcHBlbmQoZyksYXx8bHx8Yyl7Y29uc3Qgaz1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3Ioay54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihrLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGsud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3Ioay5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJue3g6TWF0aC5mbG9vcihmLngqaFswXSt1WzBdLXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihmLnkqaFsxXSt1WzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihmLncqaFswXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcihmLmgqaFsxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfX1jb21wdXREcmF3UG9pbnRzKGUpe3JldHVybiB0aGlzLnRtcFBvaW50c1sxXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1swXSk+dGhpcy5hcnJvd1RpcFdpZHRoP3RoaXMuY29tcHV0RnVsbEFycm93UG9pbnRzKGUpOnRoaXMuY29tcHV0VHJpYW5nbGVQb2ludHMoKX1jb21wdXRGdWxsQXJyb3dQb2ludHMoZSl7Y29uc3QgdD1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSx0aGlzLnRtcFBvaW50c1swXSkudW5pKCkscj1wLlBlcih0KS5tdWwoZS8yKSxpPVIuU3ViKHRoaXMudG1wUG9pbnRzWzBdLHIpLHM9Ui5BZGQodGhpcy50bXBQb2ludHNbMF0sciksbj1wLk11bCh0LHRoaXMuYXJyb3dUaXBXaWR0aCksYT1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSxuKSxsPVIuU3ViKGEsciksYz1SLkFkZChhLHIpLHU9cC5QZXIodCkubXVsKGUqMS41KSxoPVIuU3ViKGEsdSksZD1SLkFkZChhLHUpLGY9W2ksbCxoLHRoaXMudG1wUG9pbnRzWzFdLGQsYyxzXTtyZXR1cm57cG9pbnRzOmYubWFwKHc9PlIuU3ViKHcsdGhpcy50bXBQb2ludHNbMF0pLlhZKS5mbGF0KDEpLHJlY3Q6RyhmKSxpc1RyaWFuZ2xlOiExLHBvczp0aGlzLnRtcFBvaW50c1swXS5YWX19Y29tcHV0VHJpYW5nbGVQb2ludHMoKXtjb25zdCBlPXAuU3ViKHRoaXMudG1wUG9pbnRzWzFdLHRoaXMudG1wUG9pbnRzWzBdKS51bmkoKSx0PXRoaXMudG1wUG9pbnRzWzFdLmRpc3RhbmNlKHRoaXMudG1wUG9pbnRzWzBdKSxyPXAuUGVyKGUpLm11bChNYXRoLmZsb29yKHQqMy84KSksaT1SLlN1Yih0aGlzLnRtcFBvaW50c1swXSxyKSxzPVIuQWRkKHRoaXMudG1wUG9pbnRzWzBdLHIpLG49W2ksdGhpcy50bXBQb2ludHNbMV0sc107cmV0dXJue3BvaW50czpuLm1hcChhPT5SLlN1YihhLHRoaXMudG1wUG9pbnRzWzBdKS5YWSkuZmxhdCgxKSxyZWN0OkcobiksaXNUcmlhbmdsZTohMCxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgbDtjb25zdHtvcDp0LGlzRnVsbFdvcms6cixpc1RlbXA6aX09ZSxzPShsPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFzKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGM9MDtjPHQubGVuZ3RoO2MrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2NdLHRbYysxXSx0W2MrMl0pKTtjb25zdCBuPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGE9dGhpcy5kcmF3KHt3b3JrSWQ6cyxsYXllcjpufSk7cmV0dXJuIHRoaXMub2xkUmVjdD1hLHImJiFpJiZ0aGlzLnZOb2Rlcy5zZXRJbmZvKHMse3JlY3Q6YSxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNlbnRlclBvczp4LmdldENlbnRlclBvcyhhLG4pfSksYX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBhO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6c309cixuPWkuZ2V0KHQubmFtZSk7cmV0dXJuIHMmJih0LnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHQuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLHMpLChhPW49PW51bGw/dm9pZCAwOm4ub3B0KSE9bnVsbCYmYS5zdHJva2VDb2xvciYmKG4ub3B0LnN0cm9rZUNvbG9yPXMpLG4mJmkuc2V0SW5mbyh0Lm5hbWUsbikpLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgSHIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkVsbGlwc2V9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dSxpc0RyYXdpbmc6ITB9KSxkPU0oaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOmksaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PXM7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5tYXAoYz0+Wy4uLmMuWFksMF0pLmZsYXQoMSksYT1sZShuKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0OnMsb3A6bixvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjZW50ZXJQb3M6cyYmeC5nZXRDZW50ZXJQb3MocyxpKX0pLHtyZWN0OnMsdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmEsaXNTeW5jOiEwLG9wdDp0aGlzLndvcmtPcHRpb25zfX1kcmF3KGUpe3ZhciBJO2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3aW5nOml9PWU7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpLChJPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8SS5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoYj0+Yi5yZW1vdmUoKSk7Y29uc3R7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0aGlja25lc3M6YSx6SW5kZXg6bCxzY2FsZTpjLHJvdGF0ZTp1LHRyYW5zbGF0ZTpofT10aGlzLndvcmtPcHRpb25zLGQ9ci53b3JsZFBvc2l0aW9uLGY9ci53b3JsZFNjYWxpbmcse3JhZGl1czp3LHJlY3Q6eSxwb3M6Z309dGhpcy5jb21wdXREcmF3UG9pbnRzKGEpLFA9e3BvczpnLG5hbWU6dCxpZDp0LHJhZGl1czp3LGxpbmVXaWR0aDphLGZpbGxDb2xvcjpuIT09InRyYW5zcGFyZW50IiYmbnx8dm9pZCAwLHN0cm9rZUNvbG9yOnMsbm9ybWFsaXplOiEwLHpJbmRleDpsfSxrPXt4Ok1hdGguZmxvb3IoeS54KmZbMF0rZFswXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoeS55KmZbMV0rZFsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoeS53KmZbMF0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKSxoOk1hdGguZmxvb3IoeS5oKmZbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKX07aWYoaSl7Y29uc3R7bmFtZTpiLGlkOnYsekluZGV4Okwsc3Ryb2tlQ29sb3I6VH09UCxBPXguZ2V0Q2VudGVyUG9zKGssciksJD1uZXcgei5Hcm91cCh7bmFtZTpiLGlkOnYsekluZGV4OkwscG9zOkEsYW5jaG9yOlsuNSwuNV0sc2l6ZTpbay53LGsuaF19KSxEPW5ldyB6LkVsbGlwc2Uoey4uLlAscG9zOlswLDBdfSksSD1uZXcgei5QYXRoKHtkOiJNLTQsMEg0TTAsLTRWNCIsbm9ybWFsaXplOiEwLHBvczpbMCwwXSxzdHJva2VDb2xvcjpULGxpbmVXaWR0aDoxLHNjYWxlOlsxL2ZbMF0sMS9mWzFdXX0pO3JldHVybiAkLmFwcGVuZChELEgpLHIuYXBwZW5kKCQpLGt9YyYmKFAuc2NhbGU9YyksdSYmKFAucm90YXRlPXUpLGgmJihQLnRyYW5zbGF0ZT1oKTtjb25zdCBPPW5ldyB6LkVsbGlwc2UoUCk7aWYoci5hcHBlbmQoTyksdXx8Y3x8aCl7Y29uc3QgYj1PLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoYi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihiLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGIud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoYi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJuIGt9Y29tcHV0RHJhd1BvaW50cyhlKXtjb25zdCB0PUcodGhpcy50bXBQb2ludHMpLHI9Ryh0aGlzLnRtcFBvaW50cyxlKSxpPVtNYXRoLmZsb29yKHQueCt0LncvMiksTWF0aC5mbG9vcih0LnkrdC5oLzIpXTtyZXR1cm57cmVjdDpyLHBvczppLHJhZGl1czpbTWF0aC5mbG9vcih0LncvMiksTWF0aC5mbG9vcih0LmgvMildfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscykpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGw7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnIsaXNUZW1wOml9PWUscz0obD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcylyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBjPTA7Yzx0Lmxlbmd0aDtjKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtjXSx0W2MrMV0sdFtjKzJdKSk7Y29uc3Qgbj1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixhPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6bixpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWEsciYmIWkmJnRoaXMudk5vZGVzLnNldEluZm8ocyx7cmVjdDphLG9wOnQsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2VudGVyUG9zOnguZ2V0Q2VudGVyUG9zKGEsbil9KSxhfWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7dmFyIGMsdTtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm59PXIsYT1pLmdldCh0Lm5hbWUpO2xldCBsPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihsPXQuY2hpbGRyZW5bMF0pLHMmJihsLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLChjPWE9PW51bGw/dm9pZCAwOmEub3B0KSE9bnVsbCYmYy5zdHJva2VDb2xvciYmKGEub3B0LnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/bC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpsLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSwodT1hPT1udWxsP3ZvaWQgMDphLm9wdCkhPW51bGwmJnUuZmlsbENvbG9yJiYoYS5vcHQuZmlsbENvbG9yPW4pKSxhJiZpLnNldEluZm8odC5uYW1lLGEpLHgudXBkYXRlTm9kZU9wdChlKX19dmFyIGNmPWZlLHVmPWNlLGhmPSJbb2JqZWN0IEJvb2xlYW5dIjtmdW5jdGlvbiBkZihvKXtyZXR1cm4gbz09PSEwfHxvPT09ITF8fHVmKG8pJiZjZihvKT09aGZ9dmFyIGZmPWRmLHdlPW1lKGZmKTtjbGFzcyBZciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuUmVjdGFuZ2xlfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH10cmFuc2Zvcm1EYXRhKCl7Y29uc3QgZT1HKHRoaXMudG1wUG9pbnRzKTtyZXR1cm5bW2UueCxlLnksMF0sW2UueCtlLncsZS55LDBdLFtlLngrZS53LGUueStlLmgsMF0sW2UueCxlLnkrZS5oLDBdXX1jb21wdXREcmF3UG9pbnRzKGUpe2NvbnN0e3RoaWNrbmVzczp0fT10aGlzLndvcmtPcHRpb25zLHI9W107Zm9yKGNvbnN0IG4gb2YgZSlyLnB1c2gobmV3IHAoLi4ubikpO2NvbnN0IGk9RyhyLHQpLHM9W2kueCtpLncvMixpLnkraS5oLzJdO3JldHVybntyZWN0OmkscG9zOnMscG9pbnRzOnIubWFwKG49Pm4uWFkpLmZsYXQoMSl9fWNvbnN1bWUoZSl7dmFyIHc7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KHc9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDp3LnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdCB1PXRoaXMudHJhbnNmb3JtRGF0YSgpO2lmKCFpKXtjb25zdCB5PURhdGUubm93KCk7cmV0dXJuIHktdGhpcy5zeW5jVGltZXN0YW1wPnRoaXMuc3luY1VuaXRUaW1lPyh0aGlzLnN5bmNUaW1lc3RhbXA9eSx7dHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnMsb3A6dS5mbGF0KDEpLGlzU3luYzohMCxpbmRleDowfSk6e3R5cGU6bS5Ob25lfX1jb25zdCBoPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGQ9dGhpcy5kcmF3KHtwczp1LHdvcmtJZDpzLGxheWVyOmgsaXNEcmF3aW5nOiEwfSksZj1NKGQsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWQse3JlY3Q6Zix0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgYztjb25zdHtkYXRhOnR9PWUscj0oYz10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmMudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMudHJhbnNmb3JtRGF0YSgpLHM9dGhpcy5mdWxsTGF5ZXIsbj10aGlzLmRyYXcoe3BzOmksd29ya0lkOnIsbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTt0aGlzLm9sZFJlY3Q9bjtjb25zdCBhPWkuZmxhdCgxKSxsPWxlKGEpO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6bixvcDphLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSkse3JlY3Q6bix0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6bCxvcHQ6dGhpcy53b3JrT3B0aW9ucyxpc1N5bmM6ITB9fWRyYXcoZSl7dmFyIFQ7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdpbmc6aSxwczpzLHJlcGxhY2VJZDpufT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKG58fHQpLm1hcChBPT5BLnJlbW92ZSgpKSwoVD10aGlzLmRyYXdMYXllcik9PW51bGx8fFQuZ2V0RWxlbWVudHNCeU5hbWUobnx8dCkubWFwKEE9PkEucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmEsZmlsbENvbG9yOmwsdGhpY2tuZXNzOmMsekluZGV4OnUsc2NhbGU6aCxyb3RhdGU6ZCx0cmFuc2xhdGU6Zix0ZXh0T3B0Ond9PXRoaXMud29ya09wdGlvbnMseT1yLndvcmxkUG9zaXRpb24sZz1yLndvcmxkU2NhbGluZyx7cG9pbnRzOlAscmVjdDprLHBvczpPfT10aGlzLmNvbXB1dERyYXdQb2ludHMocyksST17Y2xvc2U6ITAsbm9ybWFsaXplOiEwLHBvaW50czpQLGxpbmVXaWR0aDpjLGZpbGxDb2xvcjpsIT09InRyYW5zcGFyZW50IiYmbHx8dm9pZCAwLHN0cm9rZUNvbG9yOmEsbGluZUpvaW46InJvdW5kIn0sYj17eDpNYXRoLmZsb29yKGsueCpnWzBdK3lbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGsueSpnWzFdK3lbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGsudypnWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKGsuaCpnWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9LHY9bmV3IHouR3JvdXAoe25hbWU6dCxpZDp0LHpJbmRleDp1LHBvczpPLGFuY2hvcjpbLjUsLjVdLHNpemU6W2sudyxrLmhdLHNjYWxlOmgscm90YXRlOmQsdHJhbnNsYXRlOmZ9KSxMPW5ldyB6LlBvbHlsaW5lKHsuLi5JLHBvczpbMCwwXX0pO2lmKHYuYXBwZW5kQ2hpbGQoTCksaSl7Y29uc3QgQT1uZXcgei5QYXRoKHtkOiJNLTQsMEg0TTAsLTRWNCIsbm9ybWFsaXplOiEwLHBvczpbMCwwXSxzdHJva2VDb2xvcjphLGxpbmVXaWR0aDoxLHNjYWxlOlsxL2dbMF0sMS9nWzFdXX0pO3YuYXBwZW5kQ2hpbGQoQSl9aWYoci5hcHBlbmQodiksaHx8ZHx8Zil7Y29uc3QgQT12LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoQS54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihBLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKEEud2lkdGgrMip4LlNhZmVCb3JkZXJQYWRkaW5nKSxoOk1hdGguZmxvb3IoQS5oZWlnaHQrMip4LlNhZmVCb3JkZXJQYWRkaW5nKX19cmV0dXJuIGJ9dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PWUuc2xpY2UoLTIpLHI9bmV3IFIodFswXSx0WzFdKSxpPXRoaXMudG1wUG9pbnRzWzBdLHt0aGlja25lc3M6c309dGhpcy53b3JrT3B0aW9ucztpZihpLmlzTmVhcihyLHMpKXJldHVybiExO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTIpe2lmKHIuaXNOZWFyKHRoaXMudG1wUG9pbnRzWzFdLDEpKXJldHVybiExO3RoaXMudG1wUG9pbnRzWzFdPXJ9ZWxzZSB0aGlzLnRtcFBvaW50cy5wdXNoKHIpO3JldHVybiEwfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBjO2NvbnN0e29wOnQsaXNGdWxsV29yazpyLHJlcGxhY2VJZDppfT1lLHM9KGM9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpjLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJuO2NvbnN0IG49W107Zm9yKGxldCB1PTA7dTx0Lmxlbmd0aDt1Kz0zKW4ucHVzaChbdFt1XSx0W3UrMV0sdFt1KzJdXSk7Y29uc3QgYT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixsPXRoaXMuZHJhdyh7cHM6bix3b3JrSWQ6cyxsYXllcjphLGlzRHJhd2luZzohMSxyZXBsYWNlSWQ6aX0pO3JldHVybiB0aGlzLm9sZFJlY3Q9bCx0aGlzLnZOb2Rlcy5zZXRJbmZvKHMse3JlY3Q6bCxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpsJiZ4LmdldENlbnRlclBvcyhsLGEpfSksbH1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBnLFA7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLGZvbnRDb2xvcjphLGZvbnRCZ0NvbG9yOmwsYm9sZDpjLGl0YWxpYzp1LGxpbmVUaHJvdWdoOmgsdW5kZXJsaW5lOmQsZm9udFNpemU6Zn09cix3PWkuZ2V0KHQubmFtZSk7bGV0IHk9dDtpZih0LnRhZ05hbWU9PT0iR1JPVVAiJiYoeT10LmNoaWxkcmVuWzBdKSxzJiYoeS5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSwoZz13PT1udWxsP3ZvaWQgMDp3Lm9wdCkhPW51bGwmJmcuc3Ryb2tlQ29sb3ImJih3Lm9wdC5zdHJva2VDb2xvcj1zKSksbiYmKG49PT0idHJhbnNwYXJlbnQiP3kuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLCJyZ2JhKDAsMCwwLDApIik6eS5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsbiksKFA9dz09bnVsbD92b2lkIDA6dy5vcHQpIT1udWxsJiZQLmZpbGxDb2xvciYmKHcub3B0LmZpbGxDb2xvcj1uKSksdyE9bnVsbCYmdy5vcHQudGV4dE9wdCl7Y29uc3Qgaz13Lm9wdC50ZXh0T3B0O2EmJmsuZm9udENvbG9yJiYoay5mb250Q29sb3I9YSksbCYmay5mb250QmdDb2xvciYmKGsuZm9udEJnQ29sb3I9bCksYyYmKGsuYm9sZD1jKSx1JiYoay5pdGFsaWM9dSksd2UoaCkmJihrLmxpbmVUaHJvdWdoPWgpLHdlKGQpJiYoay51bmRlcmxpbmU9ZCksZiYmKGsuZm9udFNpemU9Zil9cmV0dXJuIHcmJmkuc2V0SW5mbyh0Lm5hbWUsdykseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBxciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuU3Rhcn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jVW5pdFRpbWU9NTB9Y29uc3VtZShlKXt2YXIgZjtjb25zdHtkYXRhOnQsaXNGdWxsV29yazpyLGlzU3ViV29ya2VyOml9PWUscz0oZj10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmYudG9TdHJpbmcoKTtpZighcylyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e29wOm4sd29ya1N0YXRlOmF9PXQsbD1uPT1udWxsP3ZvaWQgMDpuLmxlbmd0aDtpZighbHx8bDwyKXJldHVybnt0eXBlOm0uTm9uZX07bGV0IGM7aWYoYT09PUYuU3RhcnQ/KHRoaXMudG1wUG9pbnRzPVtuZXcgUihuWzBdLG5bMV0pXSxjPSExKTpjPXRoaXMudXBkYXRlVGVtcFBvaW50cyhuKSwhYylyZXR1cm57dHlwZTptLk5vbmV9O2lmKCFpKXtjb25zdCB3PURhdGUubm93KCk7cmV0dXJuIHctdGhpcy5zeW5jVGltZXN0YW1wPnRoaXMuc3luY1VuaXRUaW1lPyh0aGlzLnN5bmNUaW1lc3RhbXA9dyx7dHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnMsb3A6dGhpcy50bXBQb2ludHMubWFwKHk9PlsuLi55LlhZLDBdKS5mbGF0KDEpLGlzU3luYzohMCxpbmRleDowfSk6e3R5cGU6bS5Ob25lfX1jb25zdCB1PXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGg9dGhpcy5kcmF3KHt3b3JrSWQ6cyxsYXllcjp1LGlzRHJhd2luZzohMH0pLGQ9TShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aSxpc0RyYXdpbmc6ITF9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIEw7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdpbmc6aX09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoVD0+VC5yZW1vdmUoKSksKEw9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxMLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChUPT5ULnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLHRoaWNrbmVzczphLHpJbmRleDpsLHZlcnRpY2VzOmMsaW5uZXJWZXJ0aWNlU3RlcDp1LGlubmVyUmF0aW86aCxzY2FsZTpkLHJvdGF0ZTpmLHRyYW5zbGF0ZTp3fT10aGlzLndvcmtPcHRpb25zLHk9ci53b3JsZFBvc2l0aW9uLGc9ci53b3JsZFNjYWxpbmcse3JlY3Q6UCxwb3M6ayxwb2ludHM6T309dGhpcy5jb21wdXREcmF3UG9pbnRzKGEsYyx1LGgpLEk9e3BvczprLGNsb3NlOiEwLG5hbWU6dCxpZDp0LHBvaW50czpPLGxpbmVXaWR0aDphLGZpbGxDb2xvcjpuIT09InRyYW5zcGFyZW50IiYmbnx8dm9pZCAwLHN0cm9rZUNvbG9yOnMsY2xhc3NOYW1lOmAke2tbMF19LCR7a1sxXX1gLG5vcm1hbGl6ZTohMCx6SW5kZXg6bCxsaW5lSm9pbjoicm91bmQifSxiPXt4Ok1hdGguZmxvb3IoUC54KmdbMF0reVswXS14LlNhZmVCb3JkZXJQYWRkaW5nKmdbMF0pLHk6TWF0aC5mbG9vcihQLnkqZ1sxXSt5WzFdLXguU2FmZUJvcmRlclBhZGRpbmcqZ1sxXSksdzpNYXRoLmZsb29yKFAudypnWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypnWzBdKSxoOk1hdGguZmxvb3IoUC5oKmdbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKmdbMV0pfTtpZihpKXtjb25zdHtuYW1lOlQsaWQ6QSx6SW5kZXg6JCxzdHJva2VDb2xvcjpEfT1JLEg9WyhiLngrYi53LzIteVswXSkvZ1swXSwoYi55K2IuaC8yLXlbMV0pL2dbMV1dLFY9bmV3IHouR3JvdXAoe25hbWU6VCxpZDpBLHpJbmRleDokLHBvczpILGFuY2hvcjpbLjUsLjVdLHNpemU6W2IudyxiLmhdfSksZWU9bmV3IHouUG9seWxpbmUoey4uLkkscG9zOlswLDBdfSksc2U9bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6RCxsaW5lV2lkdGg6MSxzY2FsZTpbMS9nWzBdLDEvZ1sxXV19KTtyZXR1cm4gVi5hcHBlbmQoZWUsc2UpLHIuYXBwZW5kKFYpLGJ9ZCYmKEkuc2NhbGU9ZCksZiYmKEkucm90YXRlPWYpLHcmJihJLnRyYW5zbGF0ZT13KTtjb25zdCB2PW5ldyB6LlBvbHlsaW5lKEkpO2lmKHIuYXBwZW5kKHYpLGR8fGZ8fHcpe2NvbnN0IFQ9di5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKFQueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoVC55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihULndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKFQuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBifWNvbXB1dERyYXdQb2ludHMoZSx0LHIsaSl7Y29uc3Qgcz1HKHRoaXMudG1wUG9pbnRzKSxuPVtNYXRoLmZsb29yKHMueCtzLncvMiksTWF0aC5mbG9vcihzLnkrcy5oLzIpXSxhPXhyKHMudyxzLmgpLGw9TWF0aC5mbG9vcihNYXRoLm1pbihzLncscy5oKS8yKSxjPWkqbCx1PVtdLGg9MipNYXRoLlBJL3Q7Zm9yKGxldCBmPTA7Zjx0O2YrKyl7Y29uc3Qgdz1mKmgtLjUqTWF0aC5QSTtsZXQgeSxnO2Ylcj09PTE/KHk9YyphWzBdKk1hdGguY29zKHcpLGc9YyphWzFdKk1hdGguc2luKHcpKTooeT1sKmFbMF0qTWF0aC5jb3ModyksZz1sKmFbMV0qTWF0aC5zaW4odyksdS5wdXNoKHksZykpLHUucHVzaCh5LGcpfXJldHVybntyZWN0OkcodGhpcy50bXBQb2ludHMsZSkscG9zOm4scG9pbnRzOnV9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKXx8Ui5TdWIoaSxyKS5YWS5pbmNsdWRlcygwKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYTtjb25zdHtvcDp0LGlzRnVsbFdvcms6cn09ZSxpPShhPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6YS50b1N0cmluZygpO2lmKCFpKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGw9MDtsPHQubGVuZ3RoO2wrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2xdLHRbbCsxXSx0W2wrMl0pKTtjb25zdCBzPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHt3b3JrSWQ6aSxsYXllcjpzLGlzRHJhd2luZzohMX0pO3JldHVybiB0aGlzLm9sZFJlY3Q9bix0aGlzLnZOb2Rlcy5zZXRJbmZvKGkse3JlY3Q6bixvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSksbn1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0b29sc1R5cGU6YSx2ZXJ0aWNlczpsLGlubmVyVmVydGljZVN0ZXA6Yyxpbm5lclJhdGlvOnV9PXIsaD1pLmdldCh0Lm5hbWUpLGQ9aD09bnVsbD92b2lkIDA6aC5vcHQ7bGV0IGY9dDtyZXR1cm4gdC50YWdOYW1lPT09IkdST1VQIiYmKGY9dC5jaGlsZHJlblswXSkscyYmKGYuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksZCE9bnVsbCYmZC5zdHJva2VDb2xvciYmKGQuc3Ryb2tlQ29sb3I9cykpLG4mJihuPT09InRyYW5zcGFyZW50Ij9mLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIiwicmdiYSgwLDAsMCwwKSIpOmYuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLG4pLGQhPW51bGwmJmQuZmlsbENvbG9yJiYoZC5maWxsQ29sb3I9bikpLGE9PT1TLlN0YXImJihsJiYoZC52ZXJ0aWNlcz1sKSxjJiYoZC5pbm5lclZlcnRpY2VTdGVwPWMpLHUmJihkLmlubmVyUmF0aW89dSkpLGgmJmkuc2V0SW5mbyh0Lm5hbWUsey4uLmgsb3B0OmR9KSx4LnVwZGF0ZU5vZGVPcHQoZSl9fWNsYXNzIFpyIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5hbGx9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5Qb2x5Z29ufSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnUsaXNEcmF3aW5nOiEwfSksZD1NKGgsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWgse3JlY3Q6ZCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgbDtjb25zdHtkYXRhOnR9PWUscj0obD10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMuZnVsbExheWVyLHM9dGhpcy5kcmF3KHt3b3JrSWQ6cixsYXllcjppLGlzRHJhd2luZzohMX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgYjtjb25zdHt3b3JrSWQ6dCxsYXllcjpyLGlzRHJhd2luZzppfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh2PT52LnJlbW92ZSgpKSwoYj10aGlzLmRyYXdMYXllcik9PW51bGx8fGIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKHY9PnYucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdGhpY2tuZXNzOmEsekluZGV4OmwsdmVydGljZXM6YyxzY2FsZTp1LHJvdGF0ZTpoLHRyYW5zbGF0ZTpkfT10aGlzLndvcmtPcHRpb25zLGY9ci53b3JsZFBvc2l0aW9uLHc9ci53b3JsZFNjYWxpbmcse3JlY3Q6eSxwb3M6Zyxwb2ludHM6UH09dGhpcy5jb21wdXREcmF3UG9pbnRzKGEsYyksaz17cG9zOmcsY2xvc2U6ITAsbmFtZTp0LGlkOnQscG9pbnRzOlAsbGluZVdpZHRoOmEsZmlsbENvbG9yOm4hPT0idHJhbnNwYXJlbnQiJiZufHx2b2lkIDAsc3Ryb2tlQ29sb3I6cyxub3JtYWxpemU6ITAsekluZGV4OmwsbGluZUpvaW46InJvdW5kIn0sTz17eDpNYXRoLmZsb29yKHkueCp3WzBdK2ZbMF0teC5TYWZlQm9yZGVyUGFkZGluZyp3WzBdKSx5Ok1hdGguZmxvb3IoeS55KndbMV0rZlsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKndbMV0pLHc6TWF0aC5mbG9vcih5Lncqd1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqd1swXSksaDpNYXRoLmZsb29yKHkuaCp3WzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyp3WzFdKX07aWYoaSl7Y29uc3R7bmFtZTp2LGlkOkwsekluZGV4OlQsc3Ryb2tlQ29sb3I6QX09aywkPVsoTy54K08udy8yLWZbMF0pL3dbMF0sKE8ueStPLmgvMi1mWzFdKS93WzFdXSxEPW5ldyB6Lkdyb3VwKHtuYW1lOnYsaWQ6TCx6SW5kZXg6VCxwb3M6JCxhbmNob3I6Wy41LC41XSxzaXplOltPLncsTy5oXX0pLEg9bmV3IHouUG9seWxpbmUoey4uLmsscG9zOlswLDBdfSksVj1uZXcgei5QYXRoKHtkOiJNLTQsMEg0TTAsLTRWNCIsbm9ybWFsaXplOiEwLHBvczpbMCwwXSxzdHJva2VDb2xvcjpBLGxpbmVXaWR0aDoxLHNjYWxlOlsxL3dbMF0sMS93WzFdXX0pO3JldHVybiBELmFwcGVuZChILFYpLHIuYXBwZW5kKEQpLE99dSYmKGsuc2NhbGU9dSksaCYmKGsucm90YXRlPWgpLGQmJihrLnRyYW5zbGF0ZT1kKTtjb25zdCBJPW5ldyB6LlBvbHlsaW5lKGspO2lmKHIuYXBwZW5kKEkpLHV8fGh8fGQpe2NvbnN0IHY9SS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKHYueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3Iodi55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcih2LndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKHYuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBPfWNvbXB1dERyYXdQb2ludHMoZSx0KXtjb25zdCByPUcodGhpcy50bXBQb2ludHMpLGk9W01hdGguZmxvb3Ioci54K3Iudy8yKSxNYXRoLmZsb29yKHIueStyLmgvMildLHM9eHIoci53LHIuaCksbj1NYXRoLmZsb29yKE1hdGgubWluKHIudyxyLmgpLzIpLGE9W10sbD0yKk1hdGguUEkvdDtmb3IobGV0IHU9MDt1PHQ7dSsrKXtjb25zdCBoPXUqbC0uNSpNYXRoLlBJLGQ9bipzWzBdKk1hdGguY29zKGgpLGY9bipzWzFdKk1hdGguc2luKGgpO2EucHVzaChkLGYpfXJldHVybntyZWN0OkcodGhpcy50bXBQb2ludHMsZSkscG9zOmkscG9pbnRzOmF9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKXx8Ui5TdWIoaSxyKS5YWS5pbmNsdWRlcygwKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYTtjb25zdHtvcDp0LGlzRnVsbFdvcms6cn09ZSxpPShhPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6YS50b1N0cmluZygpO2lmKCFpKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGw9MDtsPHQubGVuZ3RoO2wrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2xdLHRbbCsxXSx0W2wrMl0pKTtjb25zdCBzPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHt3b3JrSWQ6aSxsYXllcjpzLGlzRHJhd2luZzohMX0pO3JldHVybiB0aGlzLm9sZFJlY3Q9bix0aGlzLnZOb2Rlcy5zZXRJbmZvKGkse3JlY3Q6bixvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSksbn1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0b29sc1R5cGU6YSx2ZXJ0aWNlczpsfT1yLGM9aS5nZXQodC5uYW1lKSx1PWM9PW51bGw/dm9pZCAwOmMub3B0O2xldCBoPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihoPXQuY2hpbGRyZW5bMF0pLHMmJihoLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHUhPW51bGwmJnUuc3Ryb2tlQ29sb3ImJih1LnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/aC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpoLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSx1IT1udWxsJiZ1LmZpbGxDb2xvciYmKHUuZmlsbENvbG9yPW4pKSxhPT09Uy5Qb2x5Z29uJiZsJiYodS52ZXJ0aWNlcz1sKSxjJiZpLnNldEluZm8odC5uYW1lLHsuLi5jLG9wdDp1fSkseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBhZXtzdGF0aWMgYmV6aWVyKGUsdCl7Y29uc3Qgcj1bXTtmb3IobGV0IGk9MDtpPHQubGVuZ3RoO2krPTQpe2NvbnN0IHM9dFtpXSxuPXRbaSsxXSxhPXRbaSsyXSxsPXRbaSszXTtzJiZuJiZhJiZsP3IucHVzaCguLi5hZS5nZXRCZXppZXJQb2ludHMoZSxzLG4sYSxsKSk6cyYmbiYmYT9yLnB1c2goLi4uYWUuZ2V0QmV6aWVyUG9pbnRzKGUscyxuLGEpKTpzJiZuP3IucHVzaCguLi5hZS5nZXRCZXppZXJQb2ludHMoZSxzLG4pKTpzJiZyLnB1c2gocyl9cmV0dXJuIHJ9c3RhdGljIGdldEJlemllclBvaW50cyhlPTEwLHQscixpLHMpe2xldCBuPW51bGw7Y29uc3QgYT1bXTshaSYmIXM/bj1hZS5vbmVCZXppZXI6aSYmIXM/bj1hZS50d29CZXppZXI6aSYmcyYmKG49YWUudGhyZWVCZXppZXIpO2ZvcihsZXQgbD0wO2w8ZTtsKyspbiYmYS5wdXNoKG4obC9lLHQscixpLHMpKTtyZXR1cm4gcz9hLnB1c2gocyk6aSYmYS5wdXNoKGkpLGF9c3RhdGljIG9uZUJlemllcihlLHQscil7Y29uc3QgaT10LngrKHIueC10LngpKmUscz10LnkrKHIueS10LnkpKmU7cmV0dXJuIG5ldyBwKGkscyl9c3RhdGljIHR3b0JlemllcihlLHQscixpKXtjb25zdCBzPSgxLWUpKigxLWUpKnQueCsyKmUqKDEtZSkqci54K2UqZSppLngsbj0oMS1lKSooMS1lKSp0LnkrMiplKigxLWUpKnIueStlKmUqaS55O3JldHVybiBuZXcgcChzLG4pfXN0YXRpYyB0aHJlZUJlemllcihlLHQscixpLHMpe2NvbnN0IG49dC54KigxLWUpKigxLWUpKigxLWUpKzMqci54KmUqKDEtZSkqKDEtZSkrMyppLngqZSplKigxLWUpK3MueCplKmUqZSxhPXQueSooMS1lKSooMS1lKSooMS1lKSszKnIueSplKigxLWUpKigxLWUpKzMqaS55KmUqZSooMS1lKStzLnkqZSplKmU7cmV0dXJuIG5ldyBwKG4sYSl9fWNsYXNzIFFyIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5hbGx9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5TcGVlY2hCYWxsb29ufSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInJhdGlvIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Ljh9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dSxpc0RyYXdpbmc6ITB9KSxkPU0oaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOmksaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PXM7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5tYXAoYz0+Wy4uLmMuWFksMF0pLmZsYXQoMSksYT1sZShuKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0OnMsb3A6bixvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6cyYmeC5nZXRDZW50ZXJQb3MocyxpKX0pLHtyZWN0OnMsdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmEsaXNTeW5jOiEwLG9wdDp0aGlzLndvcmtPcHRpb25zfX1kcmF3KGUpe3ZhciBJO2NvbnN0e3dvcmtJZDp0LGxheWVyOnJ9PWU7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpLChJPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8SS5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoYj0+Yi5yZW1vdmUoKSk7Y29uc3R7c3Ryb2tlQ29sb3I6aSxmaWxsQ29sb3I6cyx0aGlja25lc3M6bix6SW5kZXg6YSxwbGFjZW1lbnQ6bCxzY2FsZTpjLHJvdGF0ZTp1LHRyYW5zbGF0ZTpofT10aGlzLndvcmtPcHRpb25zLGQ9ci53b3JsZFBvc2l0aW9uLGY9ci53b3JsZFNjYWxpbmcse3JlY3Q6dyxwb3M6eSxwb2ludHM6Z309dGhpcy5jb21wdXREcmF3UG9pbnRzKG4sbCksUD17cG9zOnksbmFtZTp0LGlkOnQscG9pbnRzOmcubWFwKGI9PmIuWFkpLGxpbmVXaWR0aDpuLGZpbGxDb2xvcjpzIT09InRyYW5zcGFyZW50IiYmc3x8dm9pZCAwLHN0cm9rZUNvbG9yOmksbm9ybWFsaXplOiEwLGNsYXNzTmFtZTpgJHt5WzBdfSwke3lbMV19YCx6SW5kZXg6YSxsaW5lSm9pbjoicm91bmQiLGNsb3NlOiEwfSxrPXt4Ok1hdGguZmxvb3Iody54KmZbMF0rZFswXS14LlNhZmVCb3JkZXJQYWRkaW5nKmZbMF0pLHk6TWF0aC5mbG9vcih3LnkqZlsxXStkWzFdLXguU2FmZUJvcmRlclBhZGRpbmcqZlsxXSksdzpNYXRoLmZsb29yKHcudypmWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypmWzBdKSxoOk1hdGguZmxvb3Iody5oKmZbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKmZbMV0pfTtjJiYoUC5zY2FsZT1jKSx1JiYoUC5yb3RhdGU9dSksaCYmKFAudHJhbnNsYXRlPWgpO2NvbnN0IE89bmV3IHouUG9seWxpbmUoUCk7aWYoci5hcHBlbmQoTyksY3x8dXx8aCl7Y29uc3QgYj1PLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoYi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihiLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGIud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoYi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJuIGt9dHJhbnNmb3JtQ29udHJvbFBvaW50cyhlKXtjb25zdCB0PUcodGhpcy50bXBQb2ludHMpO3N3aXRjaChlKXtjYXNlImJvdHRvbSI6Y2FzZSJib3R0b21MZWZ0IjpjYXNlImJvdHRvbVJpZ2h0Ijp7Y29uc3Qgcj10LnkrdC5oKnRoaXMucmF0aW87cmV0dXJuW25ldyBwKHQueCx0LnksMCksbmV3IHAodC54K3Qudyx0LnksMCksbmV3IHAodC54K3QudyxyLDApLG5ldyBwKHQueCxyLDApXX1jYXNlInRvcCI6Y2FzZSJ0b3BMZWZ0IjpjYXNlInRvcFJpZ2h0Ijp7Y29uc3Qgcj10LnkrdC5oKigxLXRoaXMucmF0aW8pO3JldHVybltuZXcgcCh0LngsciwwKSxuZXcgcCh0LngrdC53LHIsMCksbmV3IHAodC54K3Qudyx0LnkrdC5oLDApLG5ldyBwKHQueCx0LnkrdC5oLDApXX1jYXNlImxlZnQiOmNhc2UibGVmdEJvdHRvbSI6Y2FzZSJsZWZ0VG9wIjp7Y29uc3Qgcj10LngrdC53KigxLXRoaXMucmF0aW8pO3JldHVybltuZXcgcChyLHQueSwwKSxuZXcgcCh0LngrdC53LHQueSwwKSxuZXcgcCh0LngrdC53LHQueSt0LmgsMCksbmV3IHAocix0LnkrdC5oLDApXX1jYXNlInJpZ2h0IjpjYXNlInJpZ2h0Qm90dG9tIjpjYXNlInJpZ2h0VG9wIjp7Y29uc3Qgcj10LngrdC53KnRoaXMucmF0aW87cmV0dXJuW25ldyBwKHQueCx0LnksMCksbmV3IHAocix0LnksMCksbmV3IHAocix0LnkrdC5oLDApLG5ldyBwKHQueCx0LnkrdC5oLDApXX19fWNvbXB1dERyYXdQb2ludHMoZSx0KXtjb25zdCByPUcodGhpcy50bXBQb2ludHMpLGk9dGhpcy50cmFuc2Zvcm1Db250cm9sUG9pbnRzKHQpLHM9TWF0aC5mbG9vcihyLncqLjEpLG49TWF0aC5mbG9vcihyLmgqLjEpLGE9W10sbD1wLkFkZChpWzBdLG5ldyBwKDAsbiwwKSksYz1wLkFkZChpWzBdLG5ldyBwKHMsMCwwKSksdT1hZS5nZXRCZXppZXJQb2ludHMoMTAsbCxpWzBdLGMpLGg9cC5TdWIoaVsxXSxuZXcgcChzLDAsMCkpLGQ9cC5BZGQoaVsxXSxuZXcgcCgwLG4sMCkpLGY9YWUuZ2V0QmV6aWVyUG9pbnRzKDEwLGgsaVsxXSxkKSx3PXAuU3ViKGlbMl0sbmV3IHAoMCxuLDApKSx5PXAuU3ViKGlbMl0sbmV3IHAocywwLDApKSxnPWFlLmdldEJlemllclBvaW50cygxMCx3LGlbMl0seSksUD1wLkFkZChpWzNdLG5ldyBwKHMsMCwwKSksaz1wLlN1YihpWzNdLG5ldyBwKDAsbiwwKSksTz1hZS5nZXRCZXppZXJQb2ludHMoMTAsUCxpWzNdLGspLEk9cyooMS10aGlzLnJhdGlvKSoxMCxiPW4qKDEtdGhpcy5yYXRpbykqMTA7c3dpdGNoKHQpe2Nhc2UiYm90dG9tIjp7Y29uc3QgVD1wLlN1YihpWzJdLG5ldyBwKHMqNS1JLzIsMCwwKSksQT1wLlN1YihpWzJdLG5ldyBwKHMqNSwtYiwwKSksJD1wLlN1YihpWzJdLG5ldyBwKHMqNStJLzIsMCwwKSk7YS5wdXNoKEEsJCwuLi5PLC4uLnUsLi4uZiwuLi5nLFQpO2JyZWFrfWNhc2UiYm90dG9tUmlnaHQiOntjb25zdCBUPXAuU3ViKGlbMl0sbmV3IHAocyoxLjEsMCwwKSksQT1wLlN1YihpWzJdLG5ldyBwKHMqMS4xK0kvMiwtYiwwKSksJD1wLlN1YihpWzJdLG5ldyBwKHMqMS4xK0ksMCwwKSk7YS5wdXNoKEEsJCwuLi5PLC4uLnUsLi4uZiwuLi5nLFQpO2JyZWFrfWNhc2UiYm90dG9tTGVmdCI6e2NvbnN0IFQ9cC5BZGQoaVszXSxuZXcgcChzKjEuMStJLDAsMCkpLEE9cC5BZGQoaVszXSxuZXcgcChzKjEuMStJLzIsYiwwKSksJD1wLkFkZChpWzNdLG5ldyBwKHMqMS4xLDAsMCkpO2EucHVzaChBLCQsLi4uTywuLi51LC4uLmYsLi4uZyxUKTticmVha31jYXNlInRvcCI6e2NvbnN0IFQ9cC5TdWIoaVsxXSxuZXcgcChzKjUtSS8yLDAsMCkpLEE9cC5TdWIoaVsxXSxuZXcgcChzKjUsYiwwKSksJD1wLlN1YihpWzFdLG5ldyBwKHMqNStJLzIsMCwwKSk7YS5wdXNoKEEsVCwuLi5mLC4uLmcsLi4uTywuLi51LCQpO2JyZWFrfWNhc2UidG9wUmlnaHQiOntjb25zdCBUPXAuU3ViKGlbMV0sbmV3IHAocyoxLjEsMCwwKSksQT1wLlN1YihpWzFdLG5ldyBwKHMqMS4xK0kvMixiLDApKSwkPXAuU3ViKGlbMV0sbmV3IHAocyoxLjErSSwwLDApKTthLnB1c2goQSxULC4uLmYsLi4uZywuLi5PLC4uLnUsJCk7YnJlYWt9Y2FzZSJ0b3BMZWZ0Ijp7Y29uc3QgVD1wLkFkZChpWzBdLG5ldyBwKHMqMS4xK0ksMCwwKSksQT1wLkFkZChpWzBdLG5ldyBwKHMqMS4xK0kvMiwtYiwwKSksJD1wLkFkZChpWzBdLG5ldyBwKHMqMS4xLDAsMCkpO2EucHVzaChBLFQsLi4uZiwuLi5nLC4uLk8sLi4udSwkKTticmVha31jYXNlImxlZnQiOntjb25zdCBUPXAuQWRkKGlbMF0sbmV3IHAoMCxuKjUtYi8yLDApKSxBPXAuQWRkKGlbMF0sbmV3IHAoLUksbio1LDApKSwkPXAuQWRkKGlbMF0sbmV3IHAoMCxuKjUrYi8yLDApKTthLnB1c2goQSxULC4uLnUsLi4uZiwuLi5nLC4uLk8sJCk7YnJlYWt9Y2FzZSJsZWZ0VG9wIjp7Y29uc3QgVD1wLkFkZChpWzBdLG5ldyBwKDAsbioxLjEsMCkpLEE9cC5BZGQoaVswXSxuZXcgcCgtSSxuKjEuMStiLzIsMCkpLCQ9cC5BZGQoaVswXSxuZXcgcCgwLG4qMS4xK2IsMCkpO2EucHVzaChBLFQsLi4udSwuLi5mLC4uLmcsLi4uTywkKTticmVha31jYXNlImxlZnRCb3R0b20iOntjb25zdCBUPXAuU3ViKGlbM10sbmV3IHAoMCxuKjEuMStiLDApKSxBPXAuU3ViKGlbM10sbmV3IHAoSSxuKjEuMStiLzIsMCkpLCQ9cC5TdWIoaVszXSxuZXcgcCgwLG4qMS4xLDApKTthLnB1c2goQSxULC4uLnUsLi4uZiwuLi5nLC4uLk8sJCk7YnJlYWt9Y2FzZSJyaWdodCI6e2NvbnN0IFQ9cC5BZGQoaVsxXSxuZXcgcCgwLG4qNS1iLzIsMCkpLEE9cC5BZGQoaVsxXSxuZXcgcChJLG4qNSwwKSksJD1wLkFkZChpWzFdLG5ldyBwKDAsbio1K2IvMiwwKSk7YS5wdXNoKEEsJCwuLi5nLC4uLk8sLi4udSwuLi5mLFQpO2JyZWFrfWNhc2UicmlnaHRUb3AiOntjb25zdCBUPXAuQWRkKGlbMV0sbmV3IHAoMCxuKjEuMSwwKSksQT1wLkFkZChpWzFdLG5ldyBwKEksbioxLjErYi8yLDApKSwkPXAuQWRkKGlbMV0sbmV3IHAoMCxuKjEuMStiLDApKTthLnB1c2goQSwkLC4uLmcsLi4uTywuLi51LC4uLmYsVCk7YnJlYWt9Y2FzZSJyaWdodEJvdHRvbSI6e2NvbnN0IFQ9cC5TdWIoaVsyXSxuZXcgcCgwLG4qMS4xK2IsMCkpLEE9cC5TdWIoaVsyXSxuZXcgcCgtSSxuKjEuMStiLzIsMCkpLCQ9cC5TdWIoaVsyXSxuZXcgcCgwLG4qMS4xLDApKTthLnB1c2goQSwkLC4uLmcsLi4uTywuLi51LC4uLmYsVCk7YnJlYWt9fWNvbnN0IHY9Ryh0aGlzLnRtcFBvaW50cyxlKSxMPVtNYXRoLmZsb29yKHYueCt2LncvMiksTWF0aC5mbG9vcih2Lnkrdi5oLzIpXTtyZXR1cm57cmVjdDp2LHBvczpMLHBvaW50czphfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscyl8fFIuU3ViKGkscikuWFkuaW5jbHVkZXMoMCkpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PW4sdGhpcy52Tm9kZXMuc2V0SW5mbyhpLHtyZWN0Om4sb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLG59Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdG9vbHNUeXBlOmEscGxhY2VtZW50Omx9PXIsYz1pLmdldCh0Lm5hbWUpLHU9Yz09bnVsbD92b2lkIDA6Yy5vcHQ7bGV0IGg9dDtyZXR1cm4gdC50YWdOYW1lPT09IkdST1VQIiYmKGg9dC5jaGlsZHJlblswXSkscyYmKGguc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksdSE9bnVsbCYmdS5zdHJva2VDb2xvciYmKHUuc3Ryb2tlQ29sb3I9cykpLG4mJihuPT09InRyYW5zcGFyZW50Ij9oLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIiwicmdiYSgwLDAsMCwwKSIpOmguc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLG4pLHUhPW51bGwmJnUuZmlsbENvbG9yJiYodS5maWxsQ29sb3I9bikpLGE9PT1TLlNwZWVjaEJhbGxvb24mJmwmJih1LnBsYWNlbWVudD1sKSxjJiZpLnNldEluZm8odC5uYW1lLHsuLi5jLG9wdDp1fSkseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBKciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuSW1hZ2V9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnNjYWxlVHlwZT10aGlzLndvcmtPcHRpb25zLnVuaWZvcm1TY2FsZT9xLnByb3BvcnRpb25hbDpxLmFsbH1jb25zdW1lKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1jb25zdW1lQWxsKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1kcmF3KGUpe3ZhciBrO2NvbnN0e2xheWVyOnQsd29ya0lkOnIscmVwbGFjZUlkOmksaW1hZ2VCaXRtYXA6c309ZSx7Y2VudGVyWDpuLGNlbnRlclk6YSx3aWR0aDpsLGhlaWdodDpjLHNjYWxlOnUscm90YXRlOmgsdHJhbnNsYXRlOmQsekluZGV4OmZ9PXRoaXMud29ya09wdGlvbnM7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoaXx8cikubWFwKE89Pk8ucmVtb3ZlKCkpLChrPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8ay5nZXRFbGVtZW50c0J5TmFtZShpfHxyKS5tYXAoTz0+Ty5yZW1vdmUoKSk7Y29uc3Qgdz17YW5jaG9yOlsuNSwuNV0scG9zOltuLGFdLG5hbWU6cixzaXplOltsLGNdLHpJbmRleDpmfTtpZih1KWlmKHRoaXMuc2NhbGVUeXBlPT09cS5wcm9wb3J0aW9uYWwpe2NvbnN0IE89TWF0aC5taW4odVswXSx1WzFdKTt3LnNjYWxlPVtPLE9dfWVsc2Ugdy5zY2FsZT11O2QmJih3LnRyYW5zbGF0ZT1kKSxoJiYody5yb3RhdGU9aCk7Y29uc3QgeT1uZXcgei5Hcm91cCh3KSxnPW5ldyB6LlNwcml0ZSh7YW5jaG9yOlsuNSwuNV0scG9zOlswLDBdLHNpemU6W2wsY10sdGV4dHVyZTpzLHJvdGF0ZToxODB9KTt5LmFwcGVuZChnKSx0LmFwcGVuZCh5KTtjb25zdCBQPXkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7aWYoUClyZXR1cm57eDpNYXRoLmZsb29yKFAueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoUC55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihQLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKFAuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fWNvbnN1bWVTZXJ2aWNlKCl7fWFzeW5jIGNvbnN1bWVTZXJ2aWNlQXN5bmMoZSl7dmFyIGMsdTtjb25zdHtpc0Z1bGxXb3JrOnQscmVwbGFjZUlkOnIsc2NlbmU6aX09ZSx7c3JjOnMsdXVpZDpufT10aGlzLndvcmtPcHRpb25zLGE9KChjPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6Yy50b1N0cmluZygpKXx8bixsPXQ/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO2lmKHMpe2NvbnN0IGg9YXdhaXQgaS5wcmVsb2FkKHtpZDpuLHNyYzp0aGlzLndvcmtPcHRpb25zLnNyY30pLGQ9dGhpcy5kcmF3KHt3b3JrSWQ6YSxsYXllcjpsLHJlcGxhY2VJZDpyLGltYWdlQml0bWFwOmhbMF19KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWEmJigodT10aGlzLnZOb2Rlcy5nZXQoYSkpPT1udWxsP3ZvaWQgMDp1LnJlY3QpfHx2b2lkIDAsdGhpcy52Tm9kZXMuc2V0SW5mbyhhLHtyZWN0OmQsb3A6W10sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOmQmJnguZ2V0Q2VudGVyUG9zKGQsbCl9KSxkfX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aSx0YXJnZXROb2RlOnN9PWUse3RyYW5zbGF0ZTpuLGJveDphLGJveFNjYWxlOmwsYm94VHJhbnNsYXRlOmMsYW5nbGU6dSxpc0xvY2tlZDpoLHpJbmRleDpkfT1yLGY9cyYmcmUocyl8fGkuZ2V0KHQubmFtZSk7aWYoIWYpcmV0dXJuO2NvbnN0IHc9dC5wYXJlbnQ7aWYodyl7aWYoaGUoZCkmJih0LnNldEF0dHJpYnV0ZSgiekluZGV4IixkKSxmLm9wdC56SW5kZXg9ZCksd2UoaCkmJihmLm9wdC5sb2NrZWQ9aCksYSYmYyYmbCl7Y29uc3R7Y2VudGVyWDp5LGNlbnRlclk6Zyx3aWR0aDpQLGhlaWdodDprLHVuaWZvcm1TY2FsZTpPfT1mLm9wdDtpZihPKXtjb25zdCB2PU1hdGgubWluKGxbMF0sbFsxXSk7Zi5vcHQuc2NhbGU9W3Ysdl19ZWxzZSBmLm9wdC5zY2FsZT1sO2Yub3B0LndpZHRoPU1hdGguZmxvb3IoUCpsWzBdKSxmLm9wdC5oZWlnaHQ9TWF0aC5mbG9vcihrKmxbMV0pO2NvbnN0IEk9W2NbMF0vdy53b3JsZFNjYWxpbmdbMF0sY1sxXS93LndvcmxkU2NhbGluZ1sxXV07Zi5vcHQuY2VudGVyWD15K0lbMF0sZi5vcHQuY2VudGVyWT1nK0lbMV07Y29uc3QgYj1bZi5jZW50ZXJQb3NbMF0rSVswXSxmLmNlbnRlclBvc1sxXStJWzFdXTtpZihmLmNlbnRlclBvcz1iLHMpe2xldCB2PUlyKGYucmVjdCxsKTt2PUNlKHYsSSksZi5yZWN0PXZ9fWVsc2UgaWYobil7Y29uc3QgeT1bblswXS93LndvcmxkU2NhbGluZ1swXSxuWzFdL3cud29ybGRTY2FsaW5nWzFdXTtpZihmLm9wdC5jZW50ZXJYPWYub3B0LmNlbnRlclgreVswXSxmLm9wdC5jZW50ZXJZPWYub3B0LmNlbnRlclkreVsxXSxmLmNlbnRlclBvcz1bZi5jZW50ZXJQb3NbMF0reVswXSxmLmNlbnRlclBvc1sxXSt5WzFdXSxzKXtjb25zdCBnPUNlKGYucmVjdCx5KTtmLnJlY3Q9Z319ZWxzZSBpZihoZSh1KSYmKHQuc2V0QXR0cmlidXRlKCJyb3RhdGUiLHUpLGYub3B0LnJvdGF0ZT11LHMpKXtjb25zdCB5PVRyKGYucmVjdCx1KTtmLnJlY3Q9eX1yZXR1cm4gZiYmaS5zZXRJbmZvKHQubmFtZSxmKSxmPT1udWxsP3ZvaWQgMDpmLnJlY3R9fX1jbGFzcyBLciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYm90aH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlN0cmFpZ2h0fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3RyYWlnaHRUaXBXaWR0aCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3RyYWlnaHRUaXBXaWR0aD10aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcy8yLHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dX0pLGQ9TShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgaztjb25zdHt3b3JrSWQ6dCxsYXllcjpyfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChPPT5PLnJlbW92ZSgpKSwoaz10aGlzLmRyYXdMYXllcik9PW51bGx8fGsuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKE89Pk8ucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmksdGhpY2tuZXNzOnMsekluZGV4Om4sc2NhbGU6YSxyb3RhdGU6bCx0cmFuc2xhdGU6Y309dGhpcy53b3JrT3B0aW9ucyx1PXIud29ybGRQb3NpdGlvbixoPXIud29ybGRTY2FsaW5nLHtkLHJlY3Q6Zn09dGhpcy5jb21wdXREcmF3UG9pbnRzKHMpLHc9W2YueCtmLncvMixmLnkrZi5oLzJdLHk9e3Bvczp3LG5hbWU6dCxpZDp0LGQsZmlsbENvbG9yOmksc3Ryb2tlQ29sb3I6aSxsaW5lV2lkdGg6MCxjbGFzc05hbWU6YCR7d1swXX0sJHt3WzFdfWAsbm9ybWFsaXplOiEwLHpJbmRleDpufTthJiYoeS5zY2FsZT1hKSxsJiYoeS5yb3RhdGU9bCksYyYmKHkudHJhbnNsYXRlPWMpO2NvbnN0IGc9bmV3IHouUGF0aCh5KTtpZihyLmFwcGVuZChnKSxsfHxhfHxjKXtjb25zdCBPPWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcihPLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKE8ueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoTy53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihPLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm57eDpNYXRoLmZsb29yKGYueCpoWzBdK3VbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGYueSpoWzFdK3VbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGYudypoWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKGYuaCpoWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9fWNvbXB1dERyYXdQb2ludHMoZSl7cmV0dXJuIHRoaXMudG1wUG9pbnRzWzFdLmRpc3RhbmNlKHRoaXMudG1wUG9pbnRzWzBdKT50aGlzLnN0cmFpZ2h0VGlwV2lkdGg/dGhpcy5jb21wdXRGdWxsUG9pbnRzKGUpOnRoaXMuY29tcHV0RG90UG9pbnRzKGUpfWNvbXB1dEZ1bGxQb2ludHMoZSl7Y29uc3QgdD1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSx0aGlzLnRtcFBvaW50c1swXSkudW5pKCkscj1wLlBlcih0KS5tdWwoZS8yKSxpPVIuU3ViKHRoaXMudG1wUG9pbnRzWzBdLHIpLHM9Ui5BZGQodGhpcy50bXBQb2ludHNbMF0sciksbj1SLlN1Yih0aGlzLnRtcFBvaW50c1sxXSxyKSxhPVIuQWRkKHRoaXMudG1wUG9pbnRzWzFdLHIpLGw9Ui5HZXRTZW1pY2lyY2xlU3Ryb2tlKHRoaXMudG1wUG9pbnRzWzFdLG4sLTEsOCksYz1SLkdldFNlbWljaXJjbGVTdHJva2UodGhpcy50bXBQb2ludHNbMF0scywtMSw4KSx1PVtpLG4sLi4ubCxhLHMsLi4uY107cmV0dXJue2Q6eGUodSwhMCkscmVjdDpHKHUpLGlzRG90OiExLHBvczp0aGlzLnRtcFBvaW50c1swXS5YWX19Y29tcHV0RG90UG9pbnRzKGUpe2NvbnN0IHQ9Ui5HZXREb3RTdHJva2UodGhpcy50bXBQb2ludHNbMF0sZS8yLDgpO3JldHVybntkOnhlKHQsITApLHJlY3Q6Ryh0KSxpc0RvdDohMCxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYTtjb25zdHtvcDp0LGlzRnVsbFdvcms6cn09ZSxpPShhPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6YS50b1N0cmluZygpO2lmKCFpKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGw9MDtsPHQubGVuZ3RoO2wrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2xdLHRbbCsxXSx0W2wrMl0pKTtjb25zdCBzPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHt3b3JrSWQ6aSxsYXllcjpzfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1uLHRoaXMudk5vZGVzLnNldEluZm8oaSx7cmVjdDpuLG9wOnQsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOm4mJnguZ2V0Q2VudGVyUG9zKG4scyl9KSxufWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7dmFyIGE7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzfT1yLG49aS5nZXQodC5uYW1lKTtyZXR1cm4gcyYmKHQuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksdC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIscyksKGE9bj09bnVsbD92b2lkIDA6bi5vcHQpIT1udWxsJiZhLnN0cm9rZUNvbG9yJiYobi5vcHQuc3Ryb2tlQ29sb3I9cykpLG4mJmkuc2V0SW5mbyh0Lm5hbWUsbikseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBOZSBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuVGV4dH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0fWNvbnN1bWUoKXtyZXR1cm57dHlwZTptLk5vbmV9fWNvbnN1bWVBbGwoKXtyZXR1cm57dHlwZTptLk5vbmV9fWRyYXcoZSl7dmFyIHc7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdMYWJlbDppfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh5PT55LnJlbW92ZSgpKSwodz10aGlzLmRyYXdMYXllcik9PW51bGx8fHcuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKHk9PnkucmVtb3ZlKCkpO2NvbnN0e2JveFNpemU6cyxib3hQb2ludDpuLHpJbmRleDphfT10aGlzLndvcmtPcHRpb25zLGw9ci53b3JsZFBvc2l0aW9uLGM9ci53b3JsZFNjYWxpbmc7aWYoIW58fCFzKXJldHVybjtjb25zdCB1PW5ldyB6Lkdyb3VwKHtuYW1lOnQsaWQ6dCxwb3M6W25bMF0rc1swXS8yLG5bMV0rc1sxXS8yXSxhbmNob3I6Wy41LC41XSxzaXplOnMsekluZGV4OmF9KSxoPXt4Om5bMF0seTpuWzFdLHc6c1swXSxoOnNbMV19LGQ9bmV3IHouUmVjdCh7bm9ybWFsaXplOiEwLHBvczpbMCwwXSxzaXplOnN9KSxmPWkmJk5lLmNyZWF0ZUxhYmVscyh0aGlzLndvcmtPcHRpb25zLHIpfHxbXTtyZXR1cm4gdS5hcHBlbmQoLi4uZixkKSxyLmFwcGVuZCh1KSx7eDpNYXRoLmZsb29yKGgueCpjWzBdK2xbMF0pLHk6TWF0aC5mbG9vcihoLnkqY1sxXStsWzFdKSx3Ok1hdGguZmxvb3IoaC53KmNbMF0pLGg6TWF0aC5mbG9vcihoLmgqY1sxXSl9fWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBsLGM7Y29uc3QgdD0obD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighdClyZXR1cm47Y29uc3R7aXNGdWxsV29yazpyLHJlcGxhY2VJZDppLGlzRHJhd0xhYmVsOnN9PWU7dGhpcy5vbGRSZWN0PWkmJigoYz10aGlzLnZOb2Rlcy5nZXQoaSkpPT1udWxsP3ZvaWQgMDpjLnJlY3QpfHx2b2lkIDA7Y29uc3Qgbj1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixhPXRoaXMuZHJhdyh7d29ya0lkOnQsbGF5ZXI6bixpc0RyYXdMYWJlbDpzfSk7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8odCx7cmVjdDphLG9wOltdLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczphJiZ4LmdldENlbnRlclBvcyhhLG4pfSksYX11cGRhdGFPcHRTZXJ2aWNlKGUpe2lmKCF0aGlzLndvcmtJZClyZXR1cm47Y29uc3QgdD10aGlzLndvcmtJZC50b1N0cmluZygpLHtmb250Q29sb3I6cixmb250QmdDb2xvcjppLGJvbGQ6cyxpdGFsaWM6bixsaW5lVGhyb3VnaDphLHVuZGVybGluZTpsLHpJbmRleDpjfT1lLHU9dGhpcy52Tm9kZXMuZ2V0KHQpO2lmKCF1KXJldHVybjtyJiYodS5vcHQuZm9udENvbG9yPXIpLGkmJih1Lm9wdC5mb250QmdDb2xvcj1pKSxzJiYodS5vcHQuYm9sZD1zKSxuJiYodS5vcHQuaXRhbGljPW4pLHdlKGEpJiYodS5vcHQubGluZVRocm91Z2g9YSksd2UobCkmJih1Lm9wdC51bmRlcmxpbmU9bCksaSYmKHUub3B0LmZvbnRCZ0NvbG9yPWkpLGhlKGMpJiYodS5vcHQuekluZGV4PWMpLHRoaXMub2xkUmVjdD11LnJlY3Q7Y29uc3QgaD10aGlzLmRyYXcoe3dvcmtJZDp0LGxheWVyOnRoaXMuZnVsbExheWVyLGlzRHJhd0xhYmVsOiExfSk7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8odCx7cmVjdDpoLG9wOltdLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpoJiZ4LmdldENlbnRlclBvcyhoLHRoaXMuZnVsbExheWVyKX0pLGh9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgZ2V0Rm9udFdpZHRoKGUpe2NvbnN0e2N0eDp0LG9wdDpyLHRleHQ6aX09ZSx7Ym9sZDpzLGl0YWxpYzpuLGZvbnRTaXplOmEsZm9udEZhbWlseTpsfT1yO3JldHVybiB0LmZvbnQ9YCR7c30gJHtufSAke2F9cHggJHtsfWAsdC5tZWFzdXJlVGV4dChpKS53aWR0aH1zdGF0aWMgY3JlYXRlTGFiZWxzKGUsdCl7Y29uc3Qgcj1bXSxpPWUudGV4dC5zcGxpdCgiLCIpLHM9aS5sZW5ndGg7Zm9yKGxldCBuPTA7bjxzO24rKyl7Y29uc3QgYT1pW25dLHtmb250U2l6ZTpsLGxpbmVIZWlnaHQ6Yyxib2xkOnUsdGV4dEFsaWduOmgsaXRhbGljOmQsYm94U2l6ZTpmLGZvbnRGYW1pbHk6dyx2ZXJ0aWNhbEFsaWduOnksZm9udENvbG9yOmcsdW5kZXJsaW5lOlAsbGluZVRocm91Z2g6a309ZSxPPWN8fGwqMS4yLEk9dCYmdC5wYXJlbnQuY2FudmFzLmdldENvbnRleHQoIjJkIiksYj1JJiZOZS5nZXRGb250V2lkdGgoe3RleHQ6YSxvcHQ6ZSxjdHg6SSx3b3JsZFNjYWxpbmc6dC53b3JsZFNjYWxpbmd9KTtpZihiKXtjb25zdCB2PXthbmNob3I6WzAsLjVdLHRleHQ6YSxmb250U2l6ZTpsLGxpbmVIZWlnaHQ6Tyxmb250RmFtaWx5OncsZm9udFdlaWdodDp1LGZpbGxDb2xvcjpnLHRleHRBbGlnbjpoLGZvbnRTdHlsZTpkLG5hbWU6bi50b1N0cmluZygpLGNsYXNzTmFtZToibGFiZWwifSxMPVswLDBdO2lmKHk9PT0ibWlkZGxlIil7Y29uc3QgQT0ocy0xKS8yO0xbMV09KG4tQSkqT31oPT09ImxlZnQiJiYoTFswXT1mJiYtZlswXS8yKzV8fDApLHYucG9zPUw7Y29uc3QgVD1uZXcgei5MYWJlbCh2KTtpZihyLnB1c2goVCksUCl7Y29uc3QgQT17bm9ybWFsaXplOiExLHBvczpbdi5wb3NbMF0sdi5wb3NbMV0rbC8yXSxsaW5lV2lkdGg6Mip0LndvcmxkU2NhbGluZ1swXSxwb2ludHM6WzAsMCxiLDBdLHN0cm9rZUNvbG9yOmcsbmFtZTpgJHtufV91bmRlcmxpbmVgLGNsYXNzTmFtZToidW5kZXJsaW5lIn0sJD1uZXcgei5Qb2x5bGluZShBKTtyLnB1c2goJCl9aWYoayl7Y29uc3QgQT17bm9ybWFsaXplOiExLHBvczp2LnBvcyxsaW5lV2lkdGg6Mip0LndvcmxkU2NhbGluZ1swXSxwb2ludHM6WzAsMCxiLDBdLHN0cm9rZUNvbG9yOmcsbmFtZTpgJHtufV9saW5lVGhyb3VnaGAsY2xhc3NOYW1lOiJsaW5lVGhyb3VnaCJ9LCQ9bmV3IHouUG9seWxpbmUoQSk7ci5wdXNoKCQpfX19cmV0dXJuIHJ9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppLHRhcmdldE5vZGU6c309ZSx7Zm9udEJnQ29sb3I6bixmb250Q29sb3I6YSx0cmFuc2xhdGU6bCxib3g6Yyxib3hTY2FsZTp1LGJveFRyYW5zbGF0ZTpoLGJvbGQ6ZCxpdGFsaWM6ZixsaW5lVGhyb3VnaDp3LHVuZGVybGluZTp5LGZvbnRTaXplOmcsdGV4dEluZm9zOlB9PXIsaz1zJiZyZShzKXx8aS5nZXQodC5uYW1lKTtpZighaylyZXR1cm47Y29uc3QgTz10LnBhcmVudDtpZighTylyZXR1cm47Y29uc3QgST1rLm9wdDtpZihhJiZJLmZvbnRDb2xvciYmKEkuZm9udENvbG9yPWEpLG4mJkkuZm9udEJnQ29sb3ImJihJLmZvbnRCZ0NvbG9yPW4pLGQmJihJLmJvbGQ9ZCksZiYmKEkuaXRhbGljPWYpLHdlKHcpJiYoSS5saW5lVGhyb3VnaD13KSx3ZSh5KSYmKEkudW5kZXJsaW5lPXkpLGcmJihJLmZvbnRTaXplPWcpLGMmJmgmJnUpe2NvbnN0IGI9UD09bnVsbD92b2lkIDA6UC5nZXQodC5uYW1lKTtpZihiKXtjb25zdHtmb250U2l6ZTpULGJveFNpemU6QX09YjtJLmJveFNpemU9QXx8SS5ib3hTaXplLEkuZm9udFNpemU9VHx8SS5mb250U2l6ZX1jb25zdCB2PWsucmVjdCxMPUNlKElyKHYsdSksaCk7SS5ib3hQb2ludD1MJiZbKEwueC1PLndvcmxkUG9zaXRpb25bMF0pL08ud29ybGRTY2FsaW5nWzBdLChMLnktTy53b3JsZFBvc2l0aW9uWzFdKS9PLndvcmxkU2NhbGluZ1sxXV19ZWxzZSBpZihsJiZJLmJveFBvaW50KXtjb25zdCBiPVtsWzBdL08ud29ybGRTY2FsaW5nWzBdLGxbMV0vTy53b3JsZFNjYWxpbmdbMV1dO0kuYm94UG9pbnQ9W0kuYm94UG9pbnRbMF0rYlswXSxJLmJveFBvaW50WzFdK2JbMV1dLGsuY2VudGVyUG9zPVtrLmNlbnRlclBvc1swXStiWzBdLGsuY2VudGVyUG9zWzFdK2JbMV1dLGsucmVjdD1DZShrLnJlY3QsYil9cmV0dXJuIGsmJmkuc2V0SW5mbyh0Lm5hbWUsayksaz09bnVsbD92b2lkIDA6ay5yZWN0fXN0YXRpYyBnZXRSZWN0RnJvbUxheWVyKGUsdCl7Y29uc3Qgcj1lLmdldEVsZW1lbnRzQnlOYW1lKHQpWzBdO2lmKHIpe2NvbnN0IGk9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGkueCkseTpNYXRoLmZsb29yKGkueSksdzpNYXRoLmZsb29yKGkud2lkdGgpLGg6TWF0aC5mbG9vcihpLmhlaWdodCl9fX19ZnVuY3Rpb24gVnIobyl7c3dpdGNoKG8pe2Nhc2UgUy5BcnJvdzpyZXR1cm4gWHI7Y2FzZSBTLlBlbmNpbDpyZXR1cm4gQ3I7Y2FzZSBTLlN0cmFpZ2h0OnJldHVybiBLcjtjYXNlIFMuRWxsaXBzZTpyZXR1cm4gSHI7Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlRyaWFuZ2xlOnJldHVybiBacjtjYXNlIFMuU3RhcjpjYXNlIFMuUmhvbWJ1czpyZXR1cm4gcXI7Y2FzZSBTLlJlY3RhbmdsZTpyZXR1cm4gWXI7Y2FzZSBTLlNwZWVjaEJhbGxvb246cmV0dXJuIFFyO2Nhc2UgUy5UZXh0OnJldHVybiBOZTtjYXNlIFMuTGFzZXJQZW46cmV0dXJuIE5yO2Nhc2UgUy5FcmFzZXI6cmV0dXJuIG5lO2Nhc2UgUy5TZWxlY3RvcjpyZXR1cm4gRTtjYXNlIFMuSW1hZ2U6cmV0dXJuIEpyfX1mdW5jdGlvbiBidChvLGUpe2NvbnN0e3Rvb2xzVHlwZTp0LC4uLnJ9PW87c3dpdGNoKHQpe2Nhc2UgUy5BcnJvdzpyZXR1cm4gbmV3IFhyKHIpO2Nhc2UgUy5QZW5jaWw6cmV0dXJuIG5ldyBDcihyKTtjYXNlIFMuU3RyYWlnaHQ6cmV0dXJuIG5ldyBLcihyKTtjYXNlIFMuRWxsaXBzZTpyZXR1cm4gbmV3IEhyKHIpO2Nhc2UgUy5Qb2x5Z29uOmNhc2UgUy5UcmlhbmdsZTpyZXR1cm4gbmV3IFpyKHIpO2Nhc2UgUy5TdGFyOmNhc2UgUy5SaG9tYnVzOnJldHVybiBuZXcgcXIocik7Y2FzZSBTLlJlY3RhbmdsZTpyZXR1cm4gbmV3IFlyKHIpO2Nhc2UgUy5TcGVlY2hCYWxsb29uOnJldHVybiBuZXcgUXIocik7Y2FzZSBTLlRleHQ6cmV0dXJuIG5ldyBOZShyKTtjYXNlIFMuTGFzZXJQZW46cmV0dXJuIG5ldyBOcihyKTtjYXNlIFMuRXJhc2VyOnJldHVybiBuZXcgbmUocixlKTtjYXNlIFMuU2VsZWN0b3I6cmV0dXJuIG5ldyBFKHIpO2Nhc2UgUy5JbWFnZTpyZXR1cm4gbmV3IEpyKHIpO2RlZmF1bHQ6cmV0dXJufX1mdW5jdGlvbiBlbyhvKXtjb25zdCBlPVtdLHQ9WyJQQVRIIiwiU1BSSVRFIiwiUE9MWUxJTkUiLCJSRUNUIiwiRUxMSVBTRSJdO2Zvcihjb25zdCByIG9mIG8pe2lmKHIudGFnTmFtZT09PSJHUk9VUCImJnIuY2hpbGRyZW4ubGVuZ3RoKXJldHVybiBlbyhyLmNoaWxkcmVuKTtyLnRhZ05hbWUmJnQuaW5jbHVkZXMoci50YWdOYW1lKSYmZS5wdXNoKHIpfXJldHVybiBlfWNsYXNzIHBmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5aSW5kZXhBY3RpdmV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aX09ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSksITB9Y29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBhLGwsYyx1LGg7Y29uc3R7d29ya0lkOnQsaXNBY3RpdmVaSW5kZXg6cix3aWxsUmVmcmVzaFNlbGVjdG9yOml9PWU7aWYodCE9PUUuc2VsZWN0b3JJZClyZXR1cm47Y29uc3Qgcz0oYT10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmEud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighcylyZXR1cm47Y29uc3Qgbj1zLm9sZFNlbGVjdFJlY3Q7aWYociYmbiYmdGhpcy5sb2NhbFdvcmspe2NvbnN0IGQ9bmV3IFNldDtpZih0aGlzLmxvY2FsV29yay52Tm9kZXMuY3VyTm9kZU1hcC5mb3JFYWNoKChmLHcpPT57UGUobixmLnJlY3QpJiZkLmFkZCh3KX0pLGQuc2l6ZSl7Y29uc3QgZj1bXTtkLmZvckVhY2godz0+e3ZhciB5Oyh5PXRoaXMubG9jYWxXb3JrKT09bnVsbHx8eS5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodykuZm9yRWFjaChnPT57dmFyIGssTztjb25zdCBQPWcuY2xvbmVOb2RlKCEwKTtIZShnKSYmUC5zZWFsKCksKE89KGs9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDprLmRyYXdMYXllcikhPW51bGwmJk8uZ2V0RWxlbWVudHNCeU5hbWUodykubGVuZ3RofHxmLnB1c2goUCl9KX0pLGYubGVuZ3RoJiYoKGw9dGhpcy5sb2NhbFdvcmsuZHJhd0xheWVyKT09bnVsbHx8bC5hcHBlbmQoLi4uZikpfX1lbHNlKHU9KGM9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpjLmRyYXdMYXllcik9PW51bGx8fHUuY2hpbGRyZW4uZmlsdGVyKGQ9Pnt2YXIgZjtyZXR1cm4hKChmPXMuc2VsZWN0SWRzKSE9bnVsbCYmZi5pbmNsdWRlcyhkLm5hbWUpKX0pLmZvckVhY2goZD0+ZC5yZW1vdmUoKSk7aSYmKChoPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8aC5fcG9zdCh7cmVuZGVyOlt7cmVjdDpuLGRyYXdDYW52YXM6Ti5TZWxlY3RvcixjbGVhckNhbnZhczpOLlNlbGVjdG9yLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy5sb2NhbFdvcmsudmlld0lkfV0sc3A6W3t0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxvcHQ6cy5nZXRXb3JrT3B0aW9ucygpLHNlbGVjdFJlY3Q6bixzdHJva2VDb2xvcjpzLnN0cm9rZUNvbG9yLGZpbGxDb2xvcjpzLmZpbGxDb2xvcix3aWxsU3luY1NlcnZpY2U6ITEsaXNTeW5jOiEwfV19KSl9fWNsYXNzIHlmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5Db3B5Tm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLkZ1bGxXb3JrJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgcjtjb25zdHt3b3JrSWQ6dH09ZTt0JiZhd2FpdCgocj10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOnIuY29uc3VtZUZ1bGwoZSx0aGlzLnNjZW5lKSl9fWNsYXNzIHdmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRDb2xvck5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgbDtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sdGV4dFVwZGF0ZUZvcldva2VyOmF9PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGw9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpsLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aX09ZSx7d2lsbFN5bmNTZXJ2aWNlOnMsaXNTeW5jOm4sdGV4dFVwZGF0ZUZvcldva2VyOmF9PXQsbD1yLnJlbmRlcnx8W10sYz1yLnNwfHxbXTtpZihzKWZvcihjb25zdFt1LGhdb2YgaS5lbnRyaWVzKCkpYSYmaC50b29sc1R5cGU9PT1TLlRleHQ/Yy5wdXNoKHsuLi5oLHdvcmtJZDp1LHR5cGU6bS5UZXh0VXBkYXRlLGRhdGFUeXBlOlcuTG9jYWwsd2lsbFN5bmNTZXJ2aWNlOiEwfSk6Yy5wdXNoKHsuLi5oLHdvcmtJZDp1LHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOm59KTtyZXR1cm57cmVuZGVyOmwsc3A6Y319fWNsYXNzIG1mIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5aSW5kZXhOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOml9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm59PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aX09ZSx7d2lsbFN5bmNTZXJ2aWNlOnMsaXNTeW5jOm59PXQsYT1yLnJlbmRlcnx8W10sbD1yLnNwfHxbXTtpZihzJiZsKWZvcihjb25zdFtjLHVdb2YgaS5lbnRyaWVzKCkpbC5wdXNoKHsuLi51LHdvcmtJZDpjLHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOm59KTtyZXR1cm57cmVuZGVyOmEsc3A6bH19fWNsYXNzIGdmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5UcmFuc2xhdGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGMsdTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sdGV4dFVwZGF0ZUZvcldva2VyOmEsZW1pdEV2ZW50VHlwZTpsfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJihyLndvcmtTdGF0ZT09PUYuRG9uZSYmKHIhPW51bGwmJnIudHJhbnNsYXRlKSYmKHIudHJhbnNsYXRlWzBdfHxyLnRyYW5zbGF0ZVsxXSl8fHIud29ya1N0YXRlIT09Ri5Eb25lP2F3YWl0KChjPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6Yy51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixpc1N5bmM6ITAsdGV4dFVwZGF0ZUZvcldva2VyOmEsZW1pdEV2ZW50VHlwZTpsLHNjZW5lOnRoaXMuc2NlbmUsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrfSkpOnIud29ya1N0YXRlPT09Ri5Eb25lJiYoKHU9dGhpcy5sb2NhbFdvcmspPT1udWxsfHx1LnZOb2Rlcy5kZWxldGVMYXN0VGFyZ2V0KCkpKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHVwZGF0ZVNlbGVjdG9yT3B0OmMsd2lsbFNlcmlhbGl6ZURhdGE6dSx0ZXh0VXBkYXRlRm9yV29rZXI6aH09dCxkPWMud29ya1N0YXRlLGY9ci5yZW5kZXJ8fFtdLHc9ci5zcHx8W107aWYoZD09PUYuU3RhcnQpcmV0dXJue3NwOltdLHJlbmRlcjpbXX07Y29uc3QgeT1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSl7aWYodSl7Y29uc3QgZz1zLmdldENoaWxkcmVuUG9pbnRzKCk7ZyYmdy5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxzZWxlY3RSZWN0Onksd2lsbFN5bmNTZXJ2aWNlOiExLGlzU3luYzpsLHBvaW50czpnfSl9Zm9yKGNvbnN0W2csUF1vZiBpLmVudHJpZXMoKSloJiZQLnRvb2xzVHlwZT09PVMuVGV4dD93LnB1c2goey4uLlAsd29ya0lkOmcsdHlwZTptLlRleHRVcGRhdGUsZGF0YVR5cGU6Vy5Mb2NhbCx3aWxsU3luY1NlcnZpY2U6ITB9KTp3LnB1c2goey4uLlAsd29ya0lkOmcsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pfXJldHVybntyZW5kZXI6ZixzcDp3fX19Y2xhc3MgYmYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLkRlbGV0ZU5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aX09ZTtpZih0PT09bS5SZW1vdmVOb2RlKXtpZihyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSksITA7aWYocj09PVcuU2VydmljZSYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yU2VydmljZVdvcmtlcihlKSwhMH19Y29uc3VtZUZvckxvY2FsV29ya2VyKGUpe2lmKCF0aGlzLmxvY2FsV29yaylyZXR1cm47Y29uc3R7cmVtb3ZlSWRzOnQsd2lsbFJlZnJlc2g6cix3aWxsU3luY1NlcnZpY2U6aSx2aWV3SWQ6c309ZTtpZighKHQhPW51bGwmJnQubGVuZ3RoKSlyZXR1cm47bGV0IG47Y29uc3QgYT1bXSxsPVtdLGM9W107Zm9yKGNvbnN0IHUgb2YgdCl7aWYodT09PUUuc2VsZWN0b3JJZCl7Y29uc3QgZD10aGlzLmxvY2FsV29yay53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpO2lmKCFkKXJldHVybjtjb25zdCBmPWQuc2VsZWN0SWRzJiZbLi4uZC5zZWxlY3RJZHNdfHxbXTtmb3IoY29uc3QgeSBvZiBmKXtpZih0aGlzLmxvY2FsV29yay52Tm9kZXMuZ2V0KHkpKXtjb25zdCBQPXRoaXMuY29tbWFuZERlbGV0ZVRleHQoeSk7UCYmYS5wdXNoKFApfW49TShuLHRoaXMubG9jYWxXb3JrLnJlbW92ZU5vZGUoeSkpLGMucHVzaCh5KX1jb25zdCB3PWQ9PW51bGw/dm9pZCAwOmQudXBkYXRlU2VsZWN0SWRzKFtdKTtuPU0obix3LmJnUmVjdCksdGhpcy5sb2NhbFdvcmsuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUoRS5zZWxlY3RvcklkKSx0aGlzLmxvY2FsV29yay53b3JrU2hhcGVzLmRlbGV0ZShFLnNlbGVjdG9ySWQpLGEucHVzaCh7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6W10sd2lsbFN5bmNTZXJ2aWNlOml9KTtjb250aW51ZX1jb25zdCBoPXRoaXMuY29tbWFuZERlbGV0ZVRleHQodSk7aCYmYS5wdXNoKGgpLG49TShuLHRoaXMubG9jYWxXb3JrLnJlbW92ZU5vZGUodSkpLGMucHVzaCh1KX1pJiZhLnB1c2goe3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpjLHVuZG9UaWNrZXJJZDplLnVuZG9UaWNrZXJJZH0pLG4mJnImJmwucHVzaCh7cmVjdDpuLGRyYXdDYW52YXM6Ti5CZyxjbGVhckNhbnZhczpOLkJnLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMCx2aWV3SWQ6c30pLChsLmxlbmd0aHx8YS5sZW5ndGgpJiZ0aGlzLmxvY2FsV29yay5fcG9zdCh7cmVuZGVyOmwsc3A6YX0pfWNvbnN1bWVGb3JTZXJ2aWNlV29ya2VyKGUpe3RoaXMuc2VydmljZVdvcmsmJnRoaXMuc2VydmljZVdvcmsucmVtb3ZlU2VsZWN0V29yayhlKX1jb21tYW5kRGVsZXRlVGV4dChlKXt2YXIgcjtjb25zdCB0PShyPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6ci52Tm9kZXMuZ2V0KGUpO2lmKHQmJnQudG9vbHNUeXBlPT09Uy5UZXh0KXJldHVybnt0eXBlOm0uVGV4dFVwZGF0ZSx0b29sc1R5cGU6Uy5UZXh0LHdvcmtJZDplLGRhdGFUeXBlOlcuTG9jYWx9fX1jbGFzcyB2ZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2NhbGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIG47Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxTeW5jU2VydmljZTppLHdpbGxTZXJpYWxpemVEYXRhOnN9PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKG49dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpuLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxTeW5jU2VydmljZTppLHdpbGxTZXJpYWxpemVEYXRhOnMsaXNTeW5jOiEwLHNjZW5lOnRoaXMuc2NlbmUsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrLmJpbmQodGhpcyl9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsd29ya1NoYXBlTm9kZTppLHJlczpzLG5ld1NlcnZpY2VTdG9yZTpufT1lLHt1cGRhdGVTZWxlY3Rvck9wdDphLHdpbGxTeW5jU2VydmljZTpsLHdpbGxTZXJpYWxpemVEYXRhOmN9PXQsdT1hLndvcmtTdGF0ZSxoPXIucmVuZGVyfHxbXSxkPXIuc3B8fFtdLGY9cz09bnVsbD92b2lkIDA6cy5zZWxlY3RSZWN0LHc9cz09bnVsbD92b2lkIDA6cy5yZW5kZXJSZWN0O2lmKHU9PT1GLlN0YXJ0KXJldHVybntzcDpbXSxyZW5kZXI6W119O2lmKHRoaXMubG9jYWxXb3JrKXtoLnB1c2goe2lzQ2xlYXJBbGw6ITAsaXNGdWxsV29yazohMSxjbGVhckNhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLmxvY2FsV29yay52aWV3SWR9KTtjb25zdCB5PXtyZWN0OncsaXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMubG9jYWxXb3JrLnZpZXdJZH07aC5wdXNoKHkpfWlmKGwpe3U9PT1GLkRvaW5nJiZkLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOmkuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6Zix3aWxsU3luY1NlcnZpY2U6ITAsaXNTeW5jOiEwLHBvaW50czppLmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDppLnRleHRPcHR9KSxjJiZ1PT09Ri5Eb25lJiZkLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOmkuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6Zix3aWxsU3luY1NlcnZpY2U6ITEsaXNTeW5jOiEwLHBvaW50czppLmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDppLnRleHRPcHR9KTtmb3IoY29uc3RbeSxnXW9mIG4uZW50cmllcygpKWcudG9vbHNUeXBlPT09Uy5UZXh0P2QucHVzaCh7Li4uZyx3b3JrSWQ6eSx0eXBlOm0uVGV4dFVwZGF0ZSxkYXRhVHlwZTpXLkxvY2FsLHdpbGxTeW5jU2VydmljZTohMH0pOmQucHVzaCh7Li4uZyx3b3JrSWQ6eSx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzohMH0pfXJldHVybntyZW5kZXI6aCxzcDpkfX19Y2xhc3MgU2YgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlJvdGF0ZU5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgbDtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sZW1pdEV2ZW50VHlwZTphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixlbWl0RXZlbnRUeXBlOmEsaXNTeW5jOiEwLHNjZW5lOnRoaXMuc2NlbmUsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrfSkpfXVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2soZSl7Y29uc3R7cGFyYW06dCxwb3N0RGF0YTpyLHdvcmtTaGFwZU5vZGU6aSxyZXM6cyxuZXdTZXJ2aWNlU3RvcmU6bn09ZSx7dXBkYXRlU2VsZWN0b3JPcHQ6YSx3aWxsU3luY1NlcnZpY2U6bCx3aWxsU2VyaWFsaXplRGF0YTpjLGlzU3luYzp1fT10LGg9YS53b3JrU3RhdGUsZD1yLnJlbmRlcnx8W10sZj1yLnNwfHxbXSx3PXM9PW51bGw/dm9pZCAwOnMuc2VsZWN0UmVjdDtpZihsKXtjJiZoPT09Ri5Eb25lJiZmLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOmkuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6dyx3aWxsU3luY1NlcnZpY2U6ITAsaXNTeW5jOnUscG9pbnRzOmkuZ2V0Q2hpbGRyZW5Qb2ludHMoKX0pO2Zvcihjb25zdFt5LGddb2Ygbi5lbnRyaWVzKCkpZi5wdXNoKHsuLi5nLHdvcmtJZDp5LHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOnV9KX1yZXR1cm57cmVuZGVyOmQsc3A6Zn19fWNsYXNzIGtmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRGb250U3R5bGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgbDtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sdGV4dFVwZGF0ZUZvcldva2VyOmF9PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGw9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpsLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHVwZGF0ZVNlbGVjdG9yT3B0OmMsdGV4dFVwZGF0ZUZvcldva2VyOnV9PXQsaD1yLnJlbmRlcnx8W10sZD1yLnNwfHxbXSxmPW49PW51bGw/dm9pZCAwOm4uc2VsZWN0UmVjdDtpZihhJiZkKXtjLmZvbnRTaXplJiZkLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOnMuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6Zix3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCxwb2ludHM6cy5nZXRDaGlsZHJlblBvaW50cygpfSk7Zm9yKGNvbnN0W3cseV1vZiBpLmVudHJpZXMoKSl1JiZ5LnRvb2xzVHlwZT09PVMuVGV4dD9kLnB1c2goey4uLnksd29ya0lkOncsdHlwZTptLlRleHRVcGRhdGUsZGF0YVR5cGU6Vy5Mb2NhbCx3aWxsU3luY1NlcnZpY2U6ITB9KTpkLnB1c2goey4uLnksd29ya0lkOncsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pfXJldHVybntyZW5kZXI6aCxzcDpkfX19Y2xhc3MgUGYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNldFBvaW50fSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsZW1pdEV2ZW50VHlwZTp0aGlzLmVtaXRFdmVudFR5cGUsd2lsbFNlcmlhbGl6ZURhdGE6bixpc1N5bmM6ITAsdGV4dFVwZGF0ZUZvcldva2VyOmEsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrfSkpfXVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2soZSl7Y29uc3R7cGFyYW06dCxwb3N0RGF0YTpyLG5ld1NlcnZpY2VTdG9yZTppLHdvcmtTaGFwZU5vZGU6cyxyZXM6bn09ZSx7d2lsbFN5bmNTZXJ2aWNlOmEsaXNTeW5jOmx9PXQsYz1yLnJlbmRlcnx8W10sdT1yLnNwfHxbXSxoPW49PW51bGw/dm9pZCAwOm4uc2VsZWN0UmVjdDtpZihhJiZ1KXtmb3IoY29uc3RbZCxmXW9mIGkuZW50cmllcygpKXUucHVzaCh7Li4uZix3b3JrSWQ6ZCx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpsfSk7dS5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxzZWxlY3RSZWN0Omgsd2lsbFN5bmNTZXJ2aWNlOmEsaXNTeW5jOmwscG9pbnRzOnMuZ2V0Q2hpbGRyZW5Qb2ludHMoKX0pfXJldHVybntyZW5kZXI6YyxzcDp1fX19Y2xhc3MgVGYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNldExvY2t9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm59PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHVwZGF0ZVNlbGVjdG9yT3B0OmN9PXQsdT1yLnJlbmRlcnx8W10saD1yLnNwfHxbXSxkPW49PW51bGw/dm9pZCAwOm4uc2VsZWN0UmVjdDtpZihhJiZoKXtmb3IoY29uc3RbZix3XW9mIGkuZW50cmllcygpKWgucHVzaCh7Li4udyx3b3JrSWQ6Zix0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpsfSk7aC5wdXNoKHtpc0xvY2tlZDpjLmlzTG9ja2VkLHNlbGVjdG9yQ29sb3I6cy5zZWxlY3RvckNvbG9yLHNjYWxlVHlwZTpzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6cy5jYW5Sb3RhdGUsdHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsc2VsZWN0UmVjdDpkLHdpbGxTeW5jU2VydmljZTphLGlzU3luYzpsfSl9cmV0dXJue3JlbmRlcjp1LHNwOmh9fX1jbGFzcyBJZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2V0U2hhcGVPcHR9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm59PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aX09ZSx7d2lsbFN5bmNTZXJ2aWNlOnMsaXNTeW5jOm59PXQsYT1yLnJlbmRlcnx8W10sbD1yLnNwfHxbXTtpZihzJiZsKWZvcihjb25zdFtjLHVdb2YgaS5lbnRyaWVzKCkpbC5wdXNoKHsuLi51LHdvcmtJZDpjLHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOm59KTtyZXR1cm57cmVuZGVyOmEsc3A6bH19fWNsYXNzIHhme2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJidWlsZGVycyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSx0aGlzLmJ1aWxkZXJzPW5ldyBNYXAoZS5tYXAodD0+W3QsdGhpcy5idWlsZCh0KV0pKX1idWlsZChlKXtzd2l0Y2goZSl7Y2FzZSBCLlRyYW5zbGF0ZU5vZGU6cmV0dXJuIG5ldyBnZjtjYXNlIEIuWkluZGV4Tm9kZTpyZXR1cm4gbmV3IG1mO2Nhc2UgQi5aSW5kZXhBY3RpdmU6cmV0dXJuIG5ldyBwZjtjYXNlIEIuQ29weU5vZGU6cmV0dXJuIG5ldyB5ZjtjYXNlIEIuU2V0Q29sb3JOb2RlOnJldHVybiBuZXcgd2Y7Y2FzZSBCLkRlbGV0ZU5vZGU6cmV0dXJuIG5ldyBiZjtjYXNlIEIuU2NhbGVOb2RlOnJldHVybiBuZXcgdmY7Y2FzZSBCLlJvdGF0ZU5vZGU6cmV0dXJuIG5ldyBTZjtjYXNlIEIuU2V0Rm9udFN0eWxlOnJldHVybiBuZXcga2Y7Y2FzZSBCLlNldFBvaW50OnJldHVybiBuZXcgUGY7Y2FzZSBCLlNldExvY2s6cmV0dXJuIG5ldyBUZjtjYXNlIEIuU2V0U2hhcGVPcHQ6cmV0dXJuIG5ldyBJZn19cmVnaXN0ZXJGb3JXb3JrZXIoZSx0LHIpe3JldHVybiB0aGlzLmJ1aWxkZXJzLmZvckVhY2goaT0+e2kmJmkucmVnaXN0ZXJGb3JXb3JrZXIoZSx0LHIpfSksdGhpc31jb25zdW1lRm9yV29ya2VyKGUpe2Zvcihjb25zdCB0IG9mIHRoaXMuYnVpbGRlcnMudmFsdWVzKCkpaWYodCE9bnVsbCYmdC5jb25zdW1lKGUpKXJldHVybiEwO3JldHVybiExfX1jb25zdCBLZT0iY3Vyc29yaG92ZXIiO2NsYXNzIE9me2NvbnN0cnVjdG9yKGUsdCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZpZXdJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2VuZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2VuZVBhdGgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjdXJOb2RlTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0YXJnZXROb2RlTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSx0aGlzLnZpZXdJZD1lLHRoaXMuc2NlbmU9dH1pbml0KGUsdCl7dGhpcy5mdWxsTGF5ZXI9ZSx0aGlzLmRyYXdMYXllcj10fWdldChlKXtyZXR1cm4gdGhpcy5jdXJOb2RlTWFwLmdldChlKX1oYXNSZW5kZXJOb2Rlcygpe2xldCBlPSExO2Zvcihjb25zdCB0IG9mIHRoaXMuY3VyTm9kZU1hcC52YWx1ZXMoKSlPcih0LnRvb2xzVHlwZSkmJihlPSEwKTtyZXR1cm4gZX1oYXMoZSl7dGhpcy5jdXJOb2RlTWFwLmhhcyhlKX1zZXRJbmZvKGUsdCl7Y29uc3Qgcj10aGlzLmN1ck5vZGVNYXAuZ2V0KGUpfHx7bmFtZTplLHJlY3Q6dC5yZWN0fTt0LnJlY3QmJihyLnJlY3Q9cmUodC5yZWN0KSksdC5vcCYmKHIub3A9cmUodC5vcCkpLHQuY2FuUm90YXRlJiYoci5jYW5Sb3RhdGU9dC5jYW5Sb3RhdGUpLHQuc2NhbGVUeXBlJiYoci5zY2FsZVR5cGU9dC5zY2FsZVR5cGUpLHQub3B0JiYoci5vcHQ9cmUodC5vcHQpKSx0LnRvb2xzVHlwZSYmKHIudG9vbHNUeXBlPXQudG9vbHNUeXBlKSx0LmNlbnRlclBvcyYmKHIuY2VudGVyUG9zPXJlKHQuY2VudGVyUG9zKSksci5yZWN0P3RoaXMuY3VyTm9kZU1hcC5zZXQoZSxyKTp0aGlzLmN1ck5vZGVNYXAuZGVsZXRlKGUpfWRlbGV0ZShlKXt0aGlzLmN1ck5vZGVNYXAuZGVsZXRlKGUpfWNsZWFyKCl7dGhpcy5jdXJOb2RlTWFwLmNsZWFyKCksdGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aD0wfWhhc1JlY3RJbnRlcnNlY3RSYW5nZShlLHQ9ITApe2Zvcihjb25zdCByIG9mIHRoaXMuY3VyTm9kZU1hcC52YWx1ZXMoKSlpZihQZShlLHIucmVjdCkpe2lmKHQmJnIudG9vbHNUeXBlPT09Uy5JbWFnZSYmci5vcHQubG9ja2VkfHx0JiZyLnRvb2xzVHlwZT09PVMuVGV4dCYmKHIub3B0LndvcmtTdGF0ZT09PUYuRG9pbmd8fHIub3B0LndvcmtTdGF0ZT09PUYuU3RhcnQpKWNvbnRpbnVlO3JldHVybiEwfXJldHVybiExfWdldFJlY3RJbnRlcnNlY3RSYW5nZShlLHQ9ITApe2xldCByO2NvbnN0IGk9bmV3IE1hcDtmb3IoY29uc3RbcyxuXW9mIHRoaXMuY3VyTm9kZU1hcC5lbnRyaWVzKCkpaWYoUGUoZSxuLnJlY3QpKXtpZih0JiZuLnRvb2xzVHlwZT09PVMuSW1hZ2UmJm4ub3B0LmxvY2tlZHx8dCYmbi50b29sc1R5cGU9PT1TLlRleHQmJihuLm9wdC53b3JrU3RhdGU9PT1GLkRvaW5nfHxuLm9wdC53b3JrU3RhdGU9PT1GLlN0YXJ0KSljb250aW51ZTtyPU0ocixuLnJlY3QpLGkuc2V0KHMsbil9cmV0dXJue3JlY3RSYW5nZTpyLG5vZGVSYW5nZTppfX1nZXROb2RlUmVjdEZvcm1TaGFwZShlLHQpe2NvbnN0IHI9VnIodC50b29sc1R5cGUpO2xldCBpPXRoaXMuZnVsbExheWVyJiYocj09bnVsbD92b2lkIDA6ci5nZXRSZWN0RnJvbUxheWVyKHRoaXMuZnVsbExheWVyLGUpKTtyZXR1cm4haSYmdGhpcy5kcmF3TGF5ZXImJihpPXI9PW51bGw/dm9pZCAwOnIuZ2V0UmVjdEZyb21MYXllcih0aGlzLmRyYXdMYXllcixlKSksaX11cGRhdGVOb2Rlc1JlY3QoKXt0aGlzLmN1ck5vZGVNYXAuZm9yRWFjaCgoZSx0KT0+e2NvbnN0IHI9dGhpcy5nZXROb2RlUmVjdEZvcm1TaGFwZSh0LGUpO3I/KGUucmVjdD1yLHRoaXMuY3VyTm9kZU1hcC5zZXQodCxlKSk6dGhpcy5jdXJOb2RlTWFwLmRlbGV0ZSh0KX0pfWNvbWJpbmVJbnRlcnNlY3RSZWN0KGUpe2xldCB0PWU7cmV0dXJuIHRoaXMuY3VyTm9kZU1hcC5mb3JFYWNoKHI9PntQZSh0LHIucmVjdCkmJih0PU0odCxyLnJlY3QpKX0pLHR9c2V0VGFyZ2V0KCl7cmV0dXJuIHRoaXMudGFyZ2V0Tm9kZU1hcC5wdXNoKHJlKHRoaXMuY3VyTm9kZU1hcCkpLHRoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGgtMX1nZXRMYXN0VGFyZ2V0KCl7cmV0dXJuIHRoaXMudGFyZ2V0Tm9kZU1hcFt0aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoLTFdfWRlbGV0ZUxhc3RUYXJnZXQoKXt0aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoPXRoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGgtMX1nZXRUYXJnZXQoZSl7cmV0dXJuIHRoaXMudGFyZ2V0Tm9kZU1hcFtlXX1kZWxldGVUYXJnZXQoZSl7dGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aD1lfX1jbGFzcyB0b3tjb25zdHJ1Y3RvcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZOb2RlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcHIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib3B0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhbWVyYU9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2VuZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJpc1NhZmFyaSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksdGhpcy52aWV3SWQ9ZSx0aGlzLm9wdD10LHRoaXMuZHByPXQuZHByLHRoaXMuc2NlbmU9dGhpcy5jcmVhdGVTY2VuZSh0Lm9mZnNjcmVlbkNhbnZhc09wdCksdGhpcy5mdWxsTGF5ZXI9dGhpcy5jcmVhdGVMYXllcigiZnVsbExheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6dGhpcy52aWV3SWQ9PT0ibWFpblZpZXciPzZlMzozZTN9KSx0aGlzLnZOb2Rlcz1uZXcgT2YoZSx0aGlzLnNjZW5lKX1zZXRJc1NhZmFyaShlKXt0aGlzLmlzU2FmYXJpPWV9b24oZSl7Y29uc3R7bXNnVHlwZTp0LHRvb2xzVHlwZTpyLG9wdDppLHdvcmtJZDpzLHdvcmtTdGF0ZTpuLGRhdGFUeXBlOmF9PWU7c3dpdGNoKHQpe2Nhc2UgbS5EZXN0cm95OnRoaXMuZGVzdHJveSgpO2JyZWFrO2Nhc2UgbS5DbGVhcjp0aGlzLmNsZWFyQWxsKCk7YnJlYWs7Y2FzZSBtLlVwZGF0ZVRvb2xzOmlmKHImJmkpe2NvbnN0IGw9e3Rvb2xzVHlwZTpyLHRvb2xzT3B0Oml9O3RoaXMubG9jYWxXb3JrLnNldFRvb2xzT3B0KGwpfWJyZWFrO2Nhc2UgbS5DcmVhdGVXb3JrOnMmJmkmJighdGhpcy5sb2NhbFdvcmsuZ2V0VG1wV29ya1NoYXBlTm9kZSgpJiZyJiZ0aGlzLnNldFRvb2xzT3B0KHt0b29sc1R5cGU6cix0b29sc09wdDppfSksdGhpcy5zZXRXb3JrT3B0KHt3b3JrSWQ6cyx0b29sc09wdDppfSkpO2JyZWFrO2Nhc2UgbS5EcmF3V29yazpuPT09Ri5Eb25lJiZhPT09Vy5Mb2NhbD90aGlzLmNvbnN1bWVEcmF3QWxsKGEsZSk6dGhpcy5jb25zdW1lRHJhdyhhLGUpO2JyZWFrfX11cGRhdGVTY2VuZShlKXt0aGlzLnNjZW5lLmF0dHIoey4uLmV9KTtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lO3RoaXMuc2NlbmUuY29udGFpbmVyLndpZHRoPXQsdGhpcy5zY2VuZS5jb250YWluZXIuaGVpZ2h0PXIsdGhpcy5zY2VuZS53aWR0aD10LHRoaXMuc2NlbmUuaGVpZ2h0PXIsdGhpcy51cGRhdGVMYXllcih7d2lkdGg6dCxoZWlnaHQ6cn0pfXVwZGF0ZUxheWVyKGUpe2NvbnN0e3dpZHRoOnQsaGVpZ2h0OnJ9PWU7dGhpcy5mdWxsTGF5ZXImJih0aGlzLmZ1bGxMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5mdWxsTGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgiaGVpZ2h0IixyKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInNpemUiLFt0LHJdKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKSx0aGlzLmRyYXdMYXllciYmKHRoaXMuZHJhd0xheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoIndpZHRoIix0KSx0aGlzLmRyYXdMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJoZWlnaHQiLHIpLHRoaXMuZHJhd0xheWVyLnNldEF0dHJpYnV0ZSgic2l6ZSIsW3Qscl0pLHRoaXMuZHJhd0xheWVyLnNldEF0dHJpYnV0ZSgicG9zIixbdCouNSxyKi41XSkpLHRoaXMuc25hcHNob3RGdWxsTGF5ZXImJih0aGlzLnNuYXBzaG90RnVsbExheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoIndpZHRoIix0KSx0aGlzLnNuYXBzaG90RnVsbExheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoImhlaWdodCIsciksdGhpcy5zbmFwc2hvdEZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInNpemUiLFt0LHJdKSx0aGlzLnNuYXBzaG90RnVsbExheWVyLnNldEF0dHJpYnV0ZSgicG9zIixbdCouNSxyKi41XSkpfWNyZWF0ZVNjZW5lKGUpe2NvbnN0e3dpZHRoOnQsaGVpZ2h0OnJ9PWUsaT1uZXcgT2Zmc2NyZWVuQ2FudmFzKHQscik7cmV0dXJuIG5ldyB6LlNjZW5lKHtjb250YWluZXI6aSxkaXNwbGF5UmF0aW86dGhpcy5kcHIsZGVwdGg6ITEsZGVzeW5jaHJvbml6ZWQ6ITAsLi4uZX0pfWNyZWF0ZUxheWVyKGUsdCxyKXtjb25zdHt3aWR0aDppLGhlaWdodDpzfT1yLG49YG9mZnNjcmVlbi0ke2V9YCxhPXQubGF5ZXIobixyKSxsPW5ldyB6Lkdyb3VwKHthbmNob3I6Wy41LC41XSxwb3M6W2kqLjUscyouNV0sc2l6ZTpbaSxzXSxuYW1lOiJ2aWV3cG9ydCIsaWQ6ZX0pO3JldHVybiBhLmFwcGVuZChsKSxsfWNsZWFyQWxsKCl7dmFyIGU7dGhpcy5mdWxsTGF5ZXImJih0aGlzLmZ1bGxMYXllci5wYXJlbnQuY2hpbGRyZW4uZm9yRWFjaCh0PT57dC5uYW1lIT09InZpZXdwb3J0IiYmdC5yZW1vdmUoKX0pLHRoaXMuZnVsbExheWVyLnJlbW92ZUFsbENoaWxkcmVuKCkpLHRoaXMuZHJhd0xheWVyJiYodGhpcy5kcmF3TGF5ZXIucGFyZW50LmNoaWxkcmVuLmZvckVhY2godD0+e3QubmFtZSE9PSJ2aWV3cG9ydCImJnQucmVtb3ZlKCl9KSx0aGlzLmRyYXdMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpKSx0aGlzLmxvY2FsV29yay5jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpLChlPXRoaXMuc2VydmljZVdvcmspPT1udWxsfHxlLmNsZWFyQWxsV29ya1NoYXBlc0NhY2hlKCl9c2V0VG9vbHNPcHQoZSl7dGhpcy5sb2NhbFdvcmsuc2V0VG9vbHNPcHQoZSl9c2V0V29ya09wdChlKXtjb25zdHt3b3JrSWQ6dCx0b29sc09wdDpyfT1lO3QmJnImJnRoaXMubG9jYWxXb3JrLnNldFdvcmtPcHRpb25zKHQscil9ZGVzdHJveSgpe3ZhciBlO3RoaXMudk5vZGVzLmNsZWFyKCksdGhpcy5zY2VuZS5yZW1vdmUoKSx0aGlzLmZ1bGxMYXllci5yZW1vdmUoKSx0aGlzLmxvY2FsV29yay5kZXN0cm95KCksKGU9dGhpcy5zZXJ2aWNlV29yayk9PW51bGx8fGUuZGVzdHJveSgpfX1jbGFzcyByb3tjb25zdHJ1Y3RvcihlKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidmlld0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZOb2RlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0aHJlYWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJfcG9zdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBXb3JrU2hhcGVOb2RlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcE9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrU2hhcGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrU2hhcGVTdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZWZmZWN0V29ya0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdDb3VudCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjB9KSx0aGlzLnRocmVhZD1lLnRocmVhZCx0aGlzLnZpZXdJZD1lLnZpZXdJZCx0aGlzLnZOb2Rlcz1lLnZOb2Rlcyx0aGlzLmZ1bGxMYXllcj1lLmZ1bGxMYXllcix0aGlzLmRyYXdMYXllcj1lLmRyYXdMYXllcix0aGlzLl9wb3N0PWUucG9zdH1kZXN0cm95KCl7dGhpcy53b3JrU2hhcGVTdGF0ZS5jbGVhcigpLHRoaXMud29ya1NoYXBlcy5jbGVhcigpfWdldFdvcmtTaGFwZShlKXtyZXR1cm4gdGhpcy53b3JrU2hhcGVzLmdldChlKX1nZXRUbXBXb3JrU2hhcGVOb2RlKCl7cmV0dXJuIHRoaXMudG1wV29ya1NoYXBlTm9kZX1zZXRUbXBXb3JrSWQoZSl7aWYoZSYmdGhpcy50bXBXb3JrU2hhcGVOb2RlKXt0aGlzLnRtcFdvcmtTaGFwZU5vZGUuc2V0V29ya0lkKGUpLHRoaXMud29ya1NoYXBlcy5zZXQoZSx0aGlzLnRtcFdvcmtTaGFwZU5vZGUpLHRoaXMudG1wT3B0JiZ0aGlzLnNldFRvb2xzT3B0KHRoaXMudG1wT3B0KTtyZXR1cm59fXNldFRtcFdvcmtPcHRpb25zKGUpe3ZhciB0Oyh0PXRoaXMudG1wV29ya1NoYXBlTm9kZSk9PW51bGx8fHQuc2V0V29ya09wdGlvbnMoZSl9c2V0V29ya09wdGlvbnMoZSx0KXt2YXIgaTt0aGlzLndvcmtTaGFwZXMuZ2V0KGUpfHx0aGlzLnNldFRtcFdvcmtJZChlKSwoaT10aGlzLndvcmtTaGFwZXMuZ2V0KGUpKT09bnVsbHx8aS5zZXRXb3JrT3B0aW9ucyh0KX1jcmVhdGVXb3JrU2hhcGVOb2RlKGUpe3ZhciBpO2NvbnN0e3Rvb2xzVHlwZTp0LHdvcmtJZDpyfT1lO3JldHVybiB0PT09Uy5TZWxlY3RvciYmcj09PUtlP2J0KHsuLi5lLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZnVsbExheWVyfSk6YnQoey4uLmUsdk5vZGVzOnRoaXMudk5vZGVzLGZ1bGxMYXllcjp0aGlzLmZ1bGxMYXllcixkcmF3TGF5ZXI6dGhpcy5kcmF3TGF5ZXJ9LChpPXRoaXMudGhyZWFkKT09bnVsbD92b2lkIDA6aS5zZXJ2aWNlV29yayl9c2V0VG9vbHNPcHQoZSl7dmFyIHQscjsoKHQ9dGhpcy50bXBPcHQpPT1udWxsP3ZvaWQgMDp0LnRvb2xzVHlwZSkhPT1lLnRvb2xzVHlwZSYmKHI9dGhpcy50bXBPcHQpIT1udWxsJiZyLnRvb2xzVHlwZSYmdGhpcy5jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpLHRoaXMudG1wT3B0PWUsdGhpcy50bXBXb3JrU2hhcGVOb2RlPXRoaXMuY3JlYXRlV29ya1NoYXBlTm9kZShlKX1jbGVhcldvcmtTaGFwZU5vZGVDYWNoZShlKXt2YXIgdDsodD10aGlzLmdldFdvcmtTaGFwZShlKSk9PW51bGx8fHQuY2xlYXJUbXBQb2ludHMoKSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGUpLHRoaXMud29ya1NoYXBlU3RhdGUuZGVsZXRlKGUpfWNsZWFyQWxsV29ya1NoYXBlc0NhY2hlKCl7dGhpcy53b3JrU2hhcGVzLmZvckVhY2goZT0+ZS5jbGVhclRtcFBvaW50cygpKSx0aGlzLndvcmtTaGFwZXMuY2xlYXIoKSx0aGlzLndvcmtTaGFwZVN0YXRlLmNsZWFyKCl9c2V0RnVsbFdvcmsoZSl7Y29uc3R7d29ya0lkOnQsb3B0OnIsdG9vbHNUeXBlOml9PWU7aWYodCYmciYmaSl7Y29uc3Qgcz10JiZ0aGlzLndvcmtTaGFwZXMuZ2V0KHQpfHx0aGlzLmNyZWF0ZVdvcmtTaGFwZU5vZGUoe3Rvb2xzT3B0OnIsdG9vbHNUeXBlOmksd29ya0lkOnR9KTtyZXR1cm4gcz8ocy5zZXRXb3JrSWQodCksdGhpcy53b3JrU2hhcGVzLnNldCh0LHMpLHMpOnZvaWQgMH19fXZhciBMZj1pZSxDZj1mdW5jdGlvbigpe3JldHVybiBMZi5EYXRlLm5vdygpfSxOZj1DZixXZj0vXHMvO2Z1bmN0aW9uIFJmKG8pe2Zvcih2YXIgZT1vLmxlbmd0aDtlLS0mJldmLnRlc3Qoby5jaGFyQXQoZSkpOyk7cmV0dXJuIGV9dmFyIEFmPVJmLE1mPUFmLCRmPS9eXHMrLztmdW5jdGlvbiBEZihvKXtyZXR1cm4gbyYmby5zbGljZSgwLE1mKG8pKzEpLnJlcGxhY2UoJGYsIiIpfXZhciBqZj1EZixGZj1mZSxCZj1jZSxfZj0iW29iamVjdCBTeW1ib2xdIjtmdW5jdGlvbiBFZihvKXtyZXR1cm4gdHlwZW9mIG89PSJzeW1ib2wifHxCZihvKSYmRmYobyk9PV9mfXZhciB6Zj1FZixVZj1qZixvbz11ZSxHZj16Zixzbz1OYU4sWGY9L15bLStdMHhbMC05YS1mXSskL2ksSGY9L14wYlswMV0rJC9pLFlmPS9eMG9bMC03XSskL2kscWY9cGFyc2VJbnQ7ZnVuY3Rpb24gWmYobyl7aWYodHlwZW9mIG89PSJudW1iZXIiKXJldHVybiBvO2lmKEdmKG8pKXJldHVybiBzbztpZihvbyhvKSl7dmFyIGU9dHlwZW9mIG8udmFsdWVPZj09ImZ1bmN0aW9uIj9vLnZhbHVlT2YoKTpvO289b28oZSk/ZSsiIjplfWlmKHR5cGVvZiBvIT0ic3RyaW5nIilyZXR1cm4gbz09PTA/bzorbztvPVVmKG8pO3ZhciB0PUhmLnRlc3Qobyk7cmV0dXJuIHR8fFlmLnRlc3Qobyk/cWYoby5zbGljZSgyKSx0PzI6OCk6WGYudGVzdChvKT9zbzorb312YXIgUWY9WmYsSmY9dWUsdnQ9TmYsaW89UWYsS2Y9IkV4cGVjdGVkIGEgZnVuY3Rpb24iLFZmPU1hdGgubWF4LGVwPU1hdGgubWluO2Z1bmN0aW9uIHRwKG8sZSx0KXt2YXIgcixpLHMsbixhLGwsYz0wLHU9ITEsaD0hMSxkPSEwO2lmKHR5cGVvZiBvIT0iZnVuY3Rpb24iKXRocm93IG5ldyBUeXBlRXJyb3IoS2YpO2U9aW8oZSl8fDAsSmYodCkmJih1PSEhdC5sZWFkaW5nLGg9Im1heFdhaXQiaW4gdCxzPWg/VmYoaW8odC5tYXhXYWl0KXx8MCxlKTpzLGQ9InRyYWlsaW5nImluIHQ/ISF0LnRyYWlsaW5nOmQpO2Z1bmN0aW9uIGYodil7dmFyIEw9cixUPWk7cmV0dXJuIHI9aT12b2lkIDAsYz12LG49by5hcHBseShULEwpLG59ZnVuY3Rpb24gdyh2KXtyZXR1cm4gYz12LGE9c2V0VGltZW91dChQLGUpLHU/Zih2KTpufWZ1bmN0aW9uIHkodil7dmFyIEw9di1sLFQ9di1jLEE9ZS1MO3JldHVybiBoP2VwKEEscy1UKTpBfWZ1bmN0aW9uIGcodil7dmFyIEw9di1sLFQ9di1jO3JldHVybiBsPT09dm9pZCAwfHxMPj1lfHxMPDB8fGgmJlQ+PXN9ZnVuY3Rpb24gUCgpe3ZhciB2PXZ0KCk7aWYoZyh2KSlyZXR1cm4gayh2KTthPXNldFRpbWVvdXQoUCx5KHYpKX1mdW5jdGlvbiBrKHYpe3JldHVybiBhPXZvaWQgMCxkJiZyP2Yodik6KHI9aT12b2lkIDAsbil9ZnVuY3Rpb24gTygpe2EhPT12b2lkIDAmJmNsZWFyVGltZW91dChhKSxjPTAscj1sPWk9YT12b2lkIDB9ZnVuY3Rpb24gSSgpe3JldHVybiBhPT09dm9pZCAwP246ayh2dCgpKX1mdW5jdGlvbiBiKCl7dmFyIHY9dnQoKSxMPWcodik7aWYocj1hcmd1bWVudHMsaT10aGlzLGw9dixMKXtpZihhPT09dm9pZCAwKXJldHVybiB3KGwpO2lmKGgpcmV0dXJuIGNsZWFyVGltZW91dChhKSxhPXNldFRpbWVvdXQoUCxlKSxmKGwpfXJldHVybiBhPT09dm9pZCAwJiYoYT1zZXRUaW1lb3V0KFAsZSkpLG59cmV0dXJuIGIuY2FuY2VsPU8sYi5mbHVzaD1JLGJ9dmFyIHJwPXRwLG9wPXJwLHNwPXVlLGlwPSJFeHBlY3RlZCBhIGZ1bmN0aW9uIjtmdW5jdGlvbiBucChvLGUsdCl7dmFyIHI9ITAsaT0hMDtpZih0eXBlb2YgbyE9ImZ1bmN0aW9uIil0aHJvdyBuZXcgVHlwZUVycm9yKGlwKTtyZXR1cm4gc3AodCkmJihyPSJsZWFkaW5nImluIHQ/ISF0LmxlYWRpbmc6cixpPSJ0cmFpbGluZyJpbiB0PyEhdC50cmFpbGluZzppKSxvcChvLGUse2xlYWRpbmc6cixtYXhXYWl0OmUsdHJhaWxpbmc6aX0pfXZhciBhcD1ucCxscD1tZShhcCk7Y2xhc3MgY3AgZXh0ZW5kcyByb3tjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY29tYmluZVVuaXRUaW1lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6NjAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNvbWJpbmVUaW1lcklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVmZmVjdFNlbGVjdE5vZGVEYXRhIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IFNldH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJiYXRjaEVyYXNlcldvcmtzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IFNldH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJiYXRjaEVyYXNlclJlbW92ZU5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IFNldH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJiYXRjaEVyYXNlckNvbWJpbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpscCgoKT0+e2NvbnN0IHQ9dGhpcy51cGRhdGVCYXRjaEVyYXNlckNvbWJpbmVOb2RlKHRoaXMuYmF0Y2hFcmFzZXJXb3Jrcyx0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMpO3RoaXMuYmF0Y2hFcmFzZXJXb3Jrcy5jbGVhcigpLHRoaXMuYmF0Y2hFcmFzZXJSZW1vdmVOb2Rlcy5jbGVhcigpLHQubGVuZ3RoJiZ0aGlzLl9wb3N0KHtyZW5kZXI6dH0pfSwxMDAse2xlYWRpbmc6ITF9KX0pfWNvbnN1bWVEcmF3KGUsdCl7Y29uc3R7b3A6cix3b3JrSWQ6aX09ZTtpZihyIT1udWxsJiZyLmxlbmd0aCYmaSl7Y29uc3Qgcz10aGlzLndvcmtTaGFwZXMuZ2V0KGkpO2lmKCFzKXJldHVybjtjb25zdCBuPXMudG9vbHNUeXBlO2lmKG49PT1TLkxhc2VyUGVuKXJldHVybjtjb25zdCBhPXMuY29uc3VtZSh7ZGF0YTplLGlzRnVsbFdvcms6ITB9KTtzd2l0Y2gobil7Y2FzZSBTLlNlbGVjdG9yOmEudHlwZT09PW0uU2VsZWN0JiYoYS5zZWxlY3RJZHMmJnQucnVuUmV2ZXJzZVNlbGVjdFdvcmsoYS5zZWxlY3RJZHMpLHRoaXMuZHJhd1NlbGVjdG9yKGEsITApKTticmVhaztjYXNlIFMuRXJhc2VyOmEhPW51bGwmJmEucmVjdCYmdGhpcy5kcmF3RXJhc2VyKGEpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrO2Nhc2UgUy5QZW5jaWw6dGhpcy5jb21iaW5lVGltZXJJZHx8KHRoaXMuY29tYmluZVRpbWVySWQ9c2V0VGltZW91dCgoKT0+e3RoaXMuY29tYmluZVRpbWVySWQ9dm9pZCAwLHRoaXMuZHJhd1BlbmNpbENvbWJpbmUoaSl9LE1hdGguZmxvb3Iocy5nZXRXb3JrT3B0aW9ucygpLnN5bmNVbml0VGltZXx8dGhpcy5jb21iaW5lVW5pdFRpbWUvMikpKSxhJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrfX19Y29uc3VtZURyYXdBbGwoZSx0KXt2YXIgcyxuLGE7dGhpcy5jb21iaW5lVGltZXJJZCYmKGNsZWFyVGltZW91dCh0aGlzLmNvbWJpbmVUaW1lcklkKSx0aGlzLmNvbWJpbmVUaW1lcklkPXZvaWQgMCk7Y29uc3R7d29ya0lkOnIsdW5kb1RpY2tlcklkOml9PWU7aWYocil7aSYmc2V0VGltZW91dCgoKT0+e3RoaXMuX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOml9XX0pfSwwKTtjb25zdCBsPXRoaXMud29ya1NoYXBlcy5nZXQocik7aWYoIWwpcmV0dXJuO2NvbnN0IGM9bC50b29sc1R5cGU7aWYoYz09PVMuTGFzZXJQZW4pcmV0dXJuO2NvbnN0IHU9dGhpcy53b3JrU2hhcGVzLmdldChLZSksaD0ocz11PT1udWxsP3ZvaWQgMDp1LnNlbGVjdElkcyk9PW51bGw/dm9pZCAwOnNbMF0sZD1sLmNvbnN1bWVBbGwoe2RhdGE6ZSxob3ZlcklkOmh9KSxmPXRoaXMud29ya1NoYXBlU3RhdGUuZ2V0KHIpO3N3aXRjaChjKXtjYXNlIFMuU2VsZWN0b3I6ZC5zZWxlY3RJZHMmJmgmJigobj1kLnNlbGVjdElkcykhPW51bGwmJm4uaW5jbHVkZXMoaCkpJiZ1LmN1cnNvckJsdXIoKSxkLnNlbGVjdElkcyYmdC5ydW5SZXZlcnNlU2VsZWN0V29yayhkLnNlbGVjdElkcyksdGhpcy5kcmF3U2VsZWN0b3IoZCwhMSksKGE9bC5zZWxlY3RJZHMpIT1udWxsJiZhLmxlbmd0aD9sLmNsZWFyVG1wUG9pbnRzKCk6dGhpcy5jbGVhcldvcmtTaGFwZU5vZGVDYWNoZShyKTticmVhaztjYXNlIFMuRXJhc2VyOmQhPW51bGwmJmQucmVjdCYmdGhpcy5kcmF3RXJhc2VyKGQpLGwuY2xlYXJUbXBQb2ludHMoKTticmVhaztjYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5FbGxpcHNlOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246dGhpcy5kcmF3UGVuY2lsRnVsbChkLGwuZ2V0V29ya09wdGlvbnMoKSxmKSx0aGlzLmRyYXdDb3VudD0wLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUocik7YnJlYWs7Y2FzZSBTLlBlbmNpbDpkIT1udWxsJiZkLnJlY3QmJih0aGlzLmRyYXdQZW5jaWxGdWxsKGQsbC5nZXRXb3JrT3B0aW9ucygpLGYpLHRoaXMuZHJhd0NvdW50PTApLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUocik7YnJlYWt9fX1hc3luYyBjb25zdW1lRnVsbChlLHQpe3ZhciBuLGE7Y29uc3Qgcj10aGlzLnNldEZ1bGxXb3JrKGUpLGk9ZS5vcHMmJnFlKGUub3BzKSxzPShuPWUud29ya0lkKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpO2lmKHMmJnIpe2NvbnN0IGw9KGE9dGhpcy52Tm9kZXMuZ2V0KHMpKT09bnVsbD92b2lkIDA6YS5yZWN0O2xldCBjO3IudG9vbHNUeXBlPT09Uy5JbWFnZSYmdD9jPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7c2NlbmU6dCxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDpzfSk6Yz1yLmNvbnN1bWVTZXJ2aWNlKHtvcDppLGlzRnVsbFdvcms6ITAscmVwbGFjZUlkOnN9KTtjb25zdCB1PShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtjPU0oYyx1KTtjb25zdCBoPVtdLGQ9W107aWYoYyYmZS53aWxsUmVmcmVzaCYmKGwmJmgucHVzaCh7cmVjdDpjLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pLGgucHVzaCh7cmVjdDpjLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pKSxlLndpbGxTeW5jU2VydmljZSYmZC5wdXNoKHtvcHQ6ZS5vcHQsdG9vbHNUeXBlOmUudG9vbHNUeXBlLHR5cGU6bS5GdWxsV29yayx3b3JrSWQ6ZS53b3JrSWQsb3BzOmUub3BzLHVwZGF0ZU5vZGVPcHQ6ZS51cGRhdGVOb2RlT3B0LHVuZG9UaWNrZXJJZDplLnVuZG9UaWNrZXJJZCx2aWV3SWQ6dGhpcy52aWV3SWR9KSxoLmxlbmd0aHx8ZC5sZW5ndGgpe2NvbnN0IGY9e3JlbmRlcjpoLHNwOmR9O3RoaXMuX3Bvc3QoZil9ZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpfX1yZW1vdmVXb3JrKGUpe2NvbnN0e3dvcmtJZDp0fT1lLHI9dD09bnVsbD92b2lkIDA6dC50b1N0cmluZygpO2lmKHIpe2NvbnN0IGk9dGhpcy5yZW1vdmVOb2RlKHIpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfV19KX19cmVtb3ZlTm9kZShlKXt2YXIgaTt0aGlzLndvcmtTaGFwZXMuaGFzKGUpJiZ0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKGUpO2xldCB0O2NvbnN0IHI9dGhpcy52Tm9kZXMuZ2V0KGUpO3JldHVybiByJiYodGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoZSkuY29uY2F0KCgoaT10aGlzLmRyYXdMYXllcik9PW51bGw/dm9pZCAwOmkuZ2V0RWxlbWVudHNCeU5hbWUoZSkpfHxbXSkuZm9yRWFjaChzPT57cy5yZW1vdmUoKX0pLHQ9TSh0LHIucmVjdCksdGhpcy52Tm9kZXMuZGVsZXRlKGUpKSx0fWFzeW5jIGNoZWNrVGV4dEFjdGl2ZShlKXtjb25zdHtvcDp0LHZpZXdJZDpyLGRhdGFUeXBlOml9PWU7aWYodCE9bnVsbCYmdC5sZW5ndGgpe2xldCBzO2Zvcihjb25zdCBuIG9mIHRoaXMudk5vZGVzLmN1ck5vZGVNYXAudmFsdWVzKCkpe2NvbnN0e3JlY3Q6YSxuYW1lOmwsdG9vbHNUeXBlOmMsb3B0OnV9PW4saD10WzBdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLGQ9dFsxXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXTtpZihjPT09Uy5UZXh0JiZHaChbaCxkXSxhKSYmdS53b3JrU3RhdGU9PT1GLkRvbmUpe3M9bDticmVha319cyYmKGF3YWl0IHRoaXMuYmx1clNlbGVjdG9yKHt2aWV3SWQ6cixtc2dUeXBlOm0uU2VsZWN0LGRhdGFUeXBlOmksaXNTeW5jOiEwfSksYXdhaXQgdGhpcy5fcG9zdCh7c3A6W3t0eXBlOm0uR2V0VGV4dEFjdGl2ZSx0b29sc1R5cGU6Uy5UZXh0LHdvcmtJZDpzfV19KSl9fWFzeW5jIGNvbGxvY3RFZmZlY3RTZWxlY3RXb3JrKGUpe2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHt3b3JrSWQ6cixtc2dUeXBlOml9PWU7aWYodCYmciYmdC5zZWxlY3RJZHMmJnQuc2VsZWN0SWRzLmluY2x1ZGVzKHIudG9TdHJpbmcoKSkpe2k9PT1tLlJlbW92ZU5vZGU/dC5zZWxlY3RJZHM9dC5zZWxlY3RJZHMuZmlsdGVyKHM9PnMhPT1yLnRvU3RyaW5nKCkpOnRoaXMuZWZmZWN0U2VsZWN0Tm9kZURhdGEuYWRkKGUpLGF3YWl0IG5ldyBQcm9taXNlKHM9PntzZXRUaW1lb3V0KCgpPT57cyghMCl9LDApfSksYXdhaXQgdGhpcy5ydW5FZmZlY3RTZWxlY3RXb3JrKCEwKS50aGVuKCgpPT57dmFyIHM7KHM9dGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YSk9PW51bGx8fHMuY2xlYXIoKX0pO3JldHVybn1yZXR1cm4gZX1hc3luYyB1cGRhdGVTZWxlY3RvcihlKXt2YXIgUDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighKChQPXQ9PW51bGw/dm9pZCAwOnQuc2VsZWN0SWRzKSE9bnVsbCYmUC5sZW5ndGgpKXJldHVybjtjb25zdHtjYWxsYmFjazpyLC4uLml9PWUse3VwZGF0ZVNlbGVjdG9yT3B0OnMsd2lsbFJlZnJlc2hTZWxlY3RvcjpuLHdpbGxTZXJpYWxpemVEYXRhOmEsZW1pdEV2ZW50VHlwZTpsLHNjZW5lOmN9PWksdT1zLndvcmtTdGF0ZSxoPWF3YWl0KHQ9PW51bGw/dm9pZCAwOnQudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnMsc2VsZWN0SWRzOnQuc2VsZWN0SWRzLHZOb2Rlczp0aGlzLnZOb2Rlcyx3aWxsU2VyaWFsaXplRGF0YTphLHdvcmtlcjp0aGlzLHNjZW5lOmN9KSksZD1oPT1udWxsP3ZvaWQgMDpoLnNlbGVjdFJlY3QsZj1uZXcgTWFwO3Quc2VsZWN0SWRzLmZvckVhY2goaz0+e2NvbnN0IE89dGhpcy52Tm9kZXMuZ2V0KGspO2lmKE8pe2NvbnN0e3Rvb2xzVHlwZTpJLG9wOmIsb3B0OnZ9PU87Zi5zZXQoayx7b3B0OnYsdG9vbHNUeXBlOkksb3BzOihiPT1udWxsP3ZvaWQgMDpiLmxlbmd0aCkmJmxlKGIpfHx2b2lkIDB9KX19KTtjb25zdCB3PVtdLHk9W107aWYobil7dy5wdXNoKHtpc0NsZWFyQWxsOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcix2aWV3SWQ6dGhpcy52aWV3SWR9KTtjb25zdCBrPXtyZWN0OmQsaXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfTtzLnRyYW5zbGF0ZSYmbD09PUIuVHJhbnNsYXRlTm9kZSYmdT09PUYuRG9pbmcmJihrLnRyYW5zbGF0ZT1zLnRyYW5zbGF0ZSksdy5wdXNoKGspfWNvbnN0IGc9ciYmcih7cmVzOmgsd29ya1NoYXBlTm9kZTp0LHBhcmFtOmkscG9zdERhdGE6e3JlbmRlcjp3LHNwOnl9LG5ld1NlcnZpY2VTdG9yZTpmfSl8fHtyZW5kZXI6dyxzcDp5fTsoZy5yZW5kZXIubGVuZ3RofHxnLnNwLmxlbmd0aCkmJnRoaXMuX3Bvc3QoZyl9YXN5bmMgYmx1clNlbGVjdG9yKGUpe3ZhciBpO2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHI9dD09bnVsbD92b2lkIDA6dC5ibHVyU2VsZWN0b3IoKTtpZih0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKEUuc2VsZWN0b3JJZCksKChpPXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6aS5wYXJlbnQpLmNoaWxkcmVuLmZvckVhY2gocz0+e3MubmFtZT09PUUuc2VsZWN0b3JJZCYmcy5yZW1vdmUoKX0pLHIpe2NvbnN0IHM9W107cy5wdXNoKHsuLi5yLHVuZG9UaWNrZXJJZDplPT1udWxsP3ZvaWQgMDplLnVuZG9UaWNrZXJJZCxpc1N5bmM6ZT09bnVsbD92b2lkIDA6ZS5pc1N5bmN9KSxhd2FpdCB0aGlzLl9wb3N0KHtyZW5kZXI6KHI9PW51bGw/dm9pZCAwOnIucmVjdCkmJlt7cmVjdDpyLnJlY3QsZHJhd0NhbnZhczpOLkJnLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnN9KX19cmVSZW5kZXJTZWxlY3RvcihlPSExKXt2YXIgcjtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZih0KXtpZih0JiYhKChyPXQuc2VsZWN0SWRzKSE9bnVsbCYmci5sZW5ndGgpKXJldHVybiB0aGlzLmJsdXJTZWxlY3RvcigpO2lmKHRoaXMuZHJhd0xheWVyKXtjb25zdCBpPXQucmVSZW5kZXJTZWxlY3RvcigpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3RvcixkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfV0sc3A6W3t0eXBlOm0uU2VsZWN0LHNlbGVjdElkczp0LnNlbGVjdElkcyxzZWxlY3RSZWN0Omksd2lsbFN5bmNTZXJ2aWNlOmUsdmlld0lkOnRoaXMudmlld0lkLHBvaW50czp0LmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDp0LnRleHRPcHR9XX0pfX19dXBkYXRlRnVsbFNlbGVjdFdvcmsoZSl7dmFyIGkscyxuLGEsbCxjLHUsaDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKSx7c2VsZWN0SWRzOnJ9PWU7aWYoIShyIT1udWxsJiZyLmxlbmd0aCkpe3RoaXMuYmx1clNlbGVjdG9yKGUpO3JldHVybn1pZighdCl7IXRoaXMuc2V0RnVsbFdvcmsoZSkmJmUud29ya0lkJiYoKGk9dGhpcy50bXBXb3JrU2hhcGVOb2RlKT09bnVsbD92b2lkIDA6aS50b29sc1R5cGUpPT09Uy5TZWxlY3RvciYmdGhpcy5zZXRUbXBXb3JrSWQoZS53b3JrSWQpLHRoaXMudXBkYXRlRnVsbFNlbGVjdFdvcmsoZSk7cmV0dXJufWlmKHQmJihyIT1udWxsJiZyLmxlbmd0aCkpe2NvbnN0e2JnUmVjdDpkLHNlbGVjdFJlY3Q6Zn09dC51cGRhdGVTZWxlY3RJZHMociksdz17cmVuZGVyOltdLHNwOltdfTtkJiYoKHM9dy5yZW5kZXIpPT1udWxsfHxzLnB1c2goe3JlY3Q6SyhkKSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSkpLChuPXcucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmYsaXNDbGVhcjohMCxpc0Z1bGxXb3JrOiExLGNsZWFyQ2FudmFzOk4uU2VsZWN0b3IsZHJhd0NhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLnZpZXdJZH0pLChoPXcuc3ApPT1udWxsfHxoLnB1c2goey4uLmUsc2VsZWN0b3JDb2xvcjooKGE9ZS5vcHQpPT1udWxsP3ZvaWQgMDphLnN0cm9rZUNvbG9yKXx8dC5zZWxlY3RvckNvbG9yLHN0cm9rZUNvbG9yOigobD1lLm9wdCk9PW51bGw/dm9pZCAwOmwuc3Ryb2tlQ29sb3IpfHx0LnN0cm9rZUNvbG9yLGZpbGxDb2xvcjooKGM9ZS5vcHQpPT1udWxsP3ZvaWQgMDpjLmZpbGxDb2xvcil8fHQuZmlsbENvbG9yLHRleHRPcHQ6KCh1PWUub3B0KT09bnVsbD92b2lkIDA6dS50ZXh0T3B0KXx8dC50ZXh0T3B0LGNhblRleHRFZGl0OnQuY2FuVGV4dEVkaXQsY2FuUm90YXRlOnQuY2FuUm90YXRlLHNjYWxlVHlwZTp0LnNjYWxlVHlwZSx0eXBlOm0uU2VsZWN0LHNlbGVjdFJlY3Q6Zixwb2ludHM6dC5nZXRDaGlsZHJlblBvaW50cygpLHdpbGxTeW5jU2VydmljZTooZT09bnVsbD92b2lkIDA6ZS53aWxsU3luY1NlcnZpY2UpfHwhMSxvcHQ6KGU9PW51bGw/dm9pZCAwOmUud2lsbFN5bmNTZXJ2aWNlKSYmdC5nZXRXb3JrT3B0aW9ucygpfHx2b2lkIDAsY2FuTG9jazp0LmNhbkxvY2ssaXNMb2NrZWQ6dC5pc0xvY2tlZCx0b29sc1R5cGVzOnQudG9vbHNUeXBlcyxzaGFwZU9wdDp0LnNoYXBlT3B0fSksdGhpcy5fcG9zdCh3KX19ZGVzdHJveSgpe3N1cGVyLmRlc3Ryb3koKSx0aGlzLmVmZmVjdFNlbGVjdE5vZGVEYXRhLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlcldvcmtzLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlclJlbW92ZU5vZGVzLmNsZWFyKCl9ZHJhd1BlbmNpbENvbWJpbmUoZSl7dmFyIHIsaTtjb25zdCB0PShyPXRoaXMud29ya1NoYXBlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpyLmNvbWJpbmVDb25zdW1lKCk7aWYodCl7Y29uc3Qgcz17cmVuZGVyOltdLGRyYXdDb3VudDp0aGlzLmRyYXdDb3VudH07KGk9cy5yZW5kZXIpPT1udWxsfHxpLnB1c2goe3JlY3Q6KHQ9PW51bGw/dm9pZCAwOnQucmVjdCkmJksodC5yZWN0KSxpc0NsZWFyOiEwLGRyYXdDYW52YXM6Ti5GbG9hdCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSksdGhpcy5fcG9zdChzKX19ZHJhd1NlbGVjdG9yKGUsdCl7dmFyIGkscztjb25zdCByPXtyZW5kZXI6W10sc3A6W2VdfTtlLnR5cGU9PT1tLlNlbGVjdCYmIXQmJigoaT1yLnJlbmRlcik9PW51bGx8fGkucHVzaCh7cmVjdDplLnNlbGVjdFJlY3QsZHJhd0NhbnZhczpOLlNlbGVjdG9yLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcixpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0se3JlY3Q6ZS5yZWN0JiZLKGUucmVjdCksaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHQmJigocz1yLnJlbmRlcik9PW51bGx8fHMucHVzaCh7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uRmxvYXQsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHRoaXMuX3Bvc3Qocil9YXN5bmMgZHJhd0VyYXNlcihlKXt2YXIgcixpO2NvbnN0IHQ9W107aWYoKHI9ZS5uZXdXb3JrRGF0YXMpIT1udWxsJiZyLnNpemUpe2Zvcihjb25zdCBzIG9mIGUubmV3V29ya0RhdGFzLnZhbHVlcygpKXtjb25zdCBuPXMud29ya0lkLnRvU3RyaW5nKCk7dGhpcy5iYXRjaEVyYXNlcldvcmtzLmFkZChuKSx0LnB1c2goe3R5cGU6bS5GdWxsV29yayx3b3JrSWQ6bixvcHM6bGUocy5vcCksb3B0OnMub3B0LHRvb2xzVHlwZTpzLnRvb2xzVHlwZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9fSl9ZGVsZXRlIGUubmV3V29ya0RhdGFzfShpPWUucmVtb3ZlSWRzKT09bnVsbHx8aS5mb3JFYWNoKHM9Pnt0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMuYWRkKHMpfSksdC5wdXNoKGUpLHRoaXMuX3Bvc3Qoe3NwOnR9KSx0aGlzLmJhdGNoRXJhc2VyQ29tYmluZSgpfWRyYXdQZW5jaWwoZSl7dGhpcy5fcG9zdCh7ZHJhd0NvdW50OnRoaXMuZHJhd0NvdW50LHNwOihlPT1udWxsP3ZvaWQgMDplLm9wKSYmW2VdfSl9ZHJhd1BlbmNpbEZ1bGwoZSx0LHIpe3ZhciBuO2xldCBpPShyPT1udWxsP3ZvaWQgMDpyLndpbGxDbGVhcil8fCh0PT1udWxsP3ZvaWQgMDp0LmlzT3BhY2l0eSl8fCExOyFpJiZlLnJlY3QmJihpPXRoaXMudk5vZGVzLmhhc1JlY3RJbnRlcnNlY3RSYW5nZShlLnJlY3QpKTtjb25zdCBzPXtkcmF3Q291bnQ6MS8wLHJlbmRlcjpbe3JlY3Q6ZS5yZWN0LGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOmksY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOltlXX07KG49cy5yZW5kZXIpPT1udWxsfHxuLnB1c2goe2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMuX3Bvc3Qocyl9dXBkYXRlQmF0Y2hFcmFzZXJDb21iaW5lTm9kZShlLHQpe2NvbnN0IHI9W107bGV0IGk7Zm9yKGNvbnN0IHMgb2YgdC5rZXlzKCkpdGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUocykuZm9yRWFjaChuPT57Y29uc3QgYT1uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2k9TShpLHt4OmEueC1uZS5TYWZlQm9yZGVyUGFkZGluZyx5OmEueS1uZS5TYWZlQm9yZGVyUGFkZGluZyx3OmEud2lkdGgrbmUuU2FmZUJvcmRlclBhZGRpbmcqMixoOmEuaGVpZ2h0K25lLlNhZmVCb3JkZXJQYWRkaW5nKjJ9KSxuLnJlbW92ZSgpfSk7cmV0dXJuIGUuZm9yRWFjaChzPT57Y29uc3Qgbj10aGlzLnZOb2Rlcy5nZXQocyk7aWYobilpZih0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShzKVswXSlpPU0oaSxuLnJlY3QpO2Vsc2V7Y29uc3QgbD10aGlzLnNldEZ1bGxXb3JrKHsuLi5uLHdvcmtJZDpzfSksYz1sJiZsLmNvbnN1bWVTZXJ2aWNlKHtvcDpuLm9wLGlzRnVsbFdvcms6ITB9KTtjJiYobi5yZWN0PWMsaT1NKGksYykpfX0pLGkmJnIucHVzaCh7cmVjdDppLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMCxjbGVhckNhbnZhczpOLkJnLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSxyfWFzeW5jIHJ1bkVmZmVjdFNlbGVjdFdvcmsoZSl7dmFyIHQscixpLHM7Zm9yKGNvbnN0IG4gb2YgdGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YS52YWx1ZXMoKSl7Y29uc3QgYT10aGlzLnNldEZ1bGxXb3JrKG4pO2lmKGEpe2lmKGEudG9vbHNUeXBlPT09Uy5JbWFnZSlhd2FpdCBhLmNvbnN1bWVTZXJ2aWNlQXN5bmMoe3NjZW5lOihyPSh0PXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6dC5wYXJlbnQpPT1udWxsP3ZvaWQgMDpyLnBhcmVudCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaT1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpfSk7ZWxzZXtjb25zdCBsPW4ub3BzJiZxZShuLm9wcyk7YS5jb25zdW1lU2VydmljZSh7b3A6bCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDoocz1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6cy50b1N0cmluZygpfSl9biE9bnVsbCYmbi51cGRhdGVOb2RlT3B0JiZhLnVwZGF0YU9wdFNlcnZpY2Uobi51cGRhdGVOb2RlT3B0KSxuLndvcmtJZCYmdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShuLndvcmtJZCl9fXRoaXMucmVSZW5kZXJTZWxlY3RvcihlKX1jdXJzb3JIb3ZlcihlKXt2YXIgbjtjb25zdHtvcHQ6dCx0b29sc1R5cGU6cixwb2ludDppfT1lLHM9dGhpcy5zZXRGdWxsV29yayh7d29ya0lkOktlLHRvb2xzVHlwZTpyLG9wdDp0fSk7aWYocyYmaSl7Y29uc3QgYT1zLmN1cnNvckhvdmVyKGkpLGw9e3JlbmRlcjpbXX07YSYmYS50eXBlPT09bS5DdXJzb3JIb3ZlciYmKChuPWwucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmEucmVjdCYmSyhhLnJlY3QpLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLl9wb3N0KGwpKX19fWNsYXNzIHVwe2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidk5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VsZWN0b3JXb3JrU2hhcGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJhbmltYXRpb25JZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgU2V0fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInJ1bkVmZmVjdElkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm5vQW5pbWF0aW9uUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJwb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy52aWV3SWQ9ZS52aWV3SWQsdGhpcy52Tm9kZXM9ZS52Tm9kZXMsdGhpcy5mdWxsTGF5ZXI9ZS5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXI9ZS5zZXJ2aWNlRHJhd0xheWVyLHRoaXMucG9zdD1lLnBvc3R9ZGVzdHJveSgpe3RoaXMud29ya1NoYXBlcy5jbGVhcigpLHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmNsZWFyKCksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuY2xlYXIoKX1jb25zdW1lRHJhdyhlKXt0aGlzLmFjdGl2ZVdvcmtTaGFwZShlKSx0aGlzLnJ1bkFuaW1hdGlvbigpfWNvbnN1bWVGdWxsKGUpe3RoaXMuYWN0aXZlV29ya1NoYXBlKGUpLHRoaXMucnVuQW5pbWF0aW9uKCl9Y2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKXt0aGlzLndvcmtTaGFwZXMuZm9yRWFjaCgoZSx0KT0+e2UudG9vbHNUeXBlPT09Uy5MYXNlclBlbj9zZXRUaW1lb3V0KCgpPT57dGhpcy53b3JrU2hhcGVzLmRlbGV0ZSh0KX0sMmUzKTp0aGlzLndvcmtTaGFwZXMuZGVsZXRlKHQpfSl9cnVuU2VsZWN0V29yayhlKXt0aGlzLmFjdGl2ZVNlbGVjdG9yU2hhcGUoZSk7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKHIpLHRoaXMucnVuRWZmZWN0KCl9c2V0Tm9kZUtleShlLHQscil7cmV0dXJuIGUudG9vbHNUeXBlPXQsZS5ub2RlPWJ0KHt0b29sc1R5cGU6dCx0b29sc09wdDpyLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfSx0aGlzKSxlfXJ1blJldmVyc2VTZWxlY3RXb3JrKGUpe2UuZm9yRWFjaCh0PT57dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZm9yRWFjaCgocixpKT0+e3ZhciBzO2lmKChzPXIuc2VsZWN0SWRzKSE9bnVsbCYmcy5sZW5ndGgpe2NvbnN0IG49ci5zZWxlY3RJZHMuaW5kZXhPZih0KTtuPi0xJiYoci5zZWxlY3RJZHMuc3BsaWNlKG4sMSksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKGkpKX19KX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLnNpemUmJnRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlV29yayhlKXtjb25zdHt3b3JrSWQ6dH09ZSxyPXQ9PW51bGw/dm9pZCAwOnQudG9TdHJpbmcoKTtpZihyKXtjb25zdCBpPXRoaXMud29ya1NoYXBlcy5nZXQocik7aWYoaSl7dGhpcy53b3JrU2hhcGVzLmRlbGV0ZShyKSx0aGlzLnJlbW92ZU5vZGUocixlLGk9PW51bGw/dm9pZCAwOmkudG90YWxSZWN0LCExKTtyZXR1cm59dGhpcy5yZW1vdmVOb2RlKHIsZSl9fXJlbW92ZVNlbGVjdFdvcmsoZSl7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmKHRoaXMuYWN0aXZlU2VsZWN0b3JTaGFwZShlKSx0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQocikpLHRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlTm9kZShlLHQscixpPSEwKXt2YXIgYztjb25zdCBzPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGUpLmNvbmNhdCh0aGlzLmRyYXdMYXllci5nZXRFbGVtZW50c0J5TmFtZShlKSk7ZS5pbmRleE9mKEUuc2VsZWN0b3JJZCk+LTEmJnRoaXMucmVtb3ZlU2VsZWN0V29yayh0KTtjb25zdCBuPVtdO2xldCBhPXI7Y29uc3QgbD0oYz10aGlzLnZOb2Rlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpjLnJlY3Q7bCYmKGE9TShsLGEpKSxzLmZvckVhY2godT0+e24ucHVzaCh1KX0pLG4ubGVuZ3RoJiZuLmZvckVhY2godT0+dS5yZW1vdmUoKSksYSYmKHRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGEpLGlzQ2xlYXI6ITAsaXNGdWxsV29yazppLGNsZWFyQ2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCxkcmF3Q2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCx3b3JrZXJUeXBlOmk/dm9pZCAwOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMudk5vZGVzLmRlbGV0ZShlKSl9YWN0aXZlV29ya1NoYXBlKGUpe3ZhciBkLGYsdyx5O2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsb3A6bCx1c2VBbmltYXRpb246Y309ZTtpZighdClyZXR1cm47Y29uc3QgdT10LnRvU3RyaW5nKCk7aWYoISgoZD10aGlzLndvcmtTaGFwZXMpIT1udWxsJiZkLmhhcyh1KSkpe2xldCBnPXt0b29sc1R5cGU6aSxhbmltYXRpb25Xb3JrRGF0YTpsfHxbXSxhbmltYXRpb25JbmRleDowLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsdXNlQW5pbWF0aW9uOnR5cGVvZiBjPCJ1Ij9jOnR5cGVvZihuPT1udWxsP3ZvaWQgMDpuLnVzZUFuaW1hdGlvbik8InUiP249PW51bGw/dm9pZCAwOm4udXNlQW5pbWF0aW9uOiEwLG9sZFJlY3Q6KGY9dGhpcy52Tm9kZXMuZ2V0KHUpKT09bnVsbD92b2lkIDA6Zi5yZWN0LGlzRGlmZjohMX07aSYmciYmKGc9dGhpcy5zZXROb2RlS2V5KGcsaSxyKSksKHc9dGhpcy53b3JrU2hhcGVzKT09bnVsbHx8dy5zZXQodSxnKX1jb25zdCBoPSh5PXRoaXMud29ya1NoYXBlcyk9PW51bGw/dm9pZCAwOnkuZ2V0KHUpO3MmJihoLnR5cGU9cyksYSYmKGguYW5pbWF0aW9uV29ya0RhdGE9cWUoYSksaC5vcHM9YSksbiYmKGgudXBkYXRlTm9kZU9wdD1uKSxsJiYoaC5pc0RpZmY9dGhpcy5oYXNEaWZmRGF0YShoLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxsLGgudG9vbHNUeXBlKSxoLmFuaW1hdGlvbldvcmtEYXRhPWwpLGgubm9kZSYmaC5ub2RlLmdldFdvcmtJZCgpIT09dSYmaC5ub2RlLnNldFdvcmtJZCh1KSxpJiZyJiYoaC50b29sc1R5cGUhPT1pJiZpJiZyJiZ0aGlzLnNldE5vZGVLZXkoaCxpLHIpLGgubm9kZSYmaC5ub2RlLnNldFdvcmtPcHRpb25zKHIpKX1oYXNEaWZmRGF0YShlLHQscil7Y29uc3QgaT1lLmxlbmd0aDtpZih0Lmxlbmd0aDxpKXJldHVybiEwO3N3aXRjaChyKXtjYXNlIFMuUGVuY2lsOntmb3IobGV0IHM9MDtzPGk7cys9MylpZih0W3NdIT09ZVtzXXx8dFtzKzFdIT09ZVtzKzFdKXJldHVybiEwO2JyZWFrfWNhc2UgUy5MYXNlclBlbjp7Zm9yKGxldCBzPTA7czxpO3MrPTIpaWYodFtzXSE9PWVbc118fHRbcysxXSE9PWVbcysxXSlyZXR1cm4hMDticmVha319cmV0dXJuITF9YXN5bmMgYW5pbWF0aW9uRHJhdygpe3ZhciBsLGMsdSxoLGQsZix3LHksZyxQLGssTyxJLGIsdixMLFQsQSwkLEQsSCxWLGVlLHNlLG5vLGFvLGxvLGNvLHVvLGhvO3RoaXMuYW5pbWF0aW9uSWQ9dm9pZCAwO2xldCBlPSExO2NvbnN0IHQ9bmV3IE1hcCxyPVtdLGk9W10scz1bXSxuPVtdO2Zvcihjb25zdFtqLENdb2YgdGhpcy53b3JrU2hhcGVzLmVudHJpZXMoKSlzd2l0Y2goQy50b29sc1R5cGUpe2Nhc2UgUy5JbWFnZTp7Y29uc3QgXz1DLm9sZFJlY3Q7XyYmcy5wdXNoKHtyZWN0Ol8saXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2NvbnN0IFo9YXdhaXQoKGM9Qy5ub2RlKT09bnVsbD92b2lkIDA6Yy5jb25zdW1lU2VydmljZUFzeW5jKHtpc0Z1bGxXb3JrOiEwLHNjZW5lOihsPXRoaXMuZnVsbExheWVyLnBhcmVudCk9PW51bGw/dm9pZCAwOmwucGFyZW50fSkpO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PU0odGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopLHIucHVzaCh7cmVjdDpaLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2JyZWFrfWNhc2UgUy5UZXh0OntpZihDLm5vZGUpe2NvbnN0IF89Qy5vbGRSZWN0LFo9KHU9Qy5ub2RlKT09bnVsbD92b2lkIDA6dS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMH0pO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PU0odGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSwoaD1DLm5vZGUpPT1udWxsfHxoLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX1icmVha31jYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246e2NvbnN0IF89ISFDLm9wcztpZigoZD1DLmFuaW1hdGlvbldvcmtEYXRhKSE9bnVsbCYmZC5sZW5ndGgpe2NvbnN0IFo9Qy5vbGRSZWN0LHRlPUMubm9kZS5vbGRSZWN0O1omJnMucHVzaCh7cmVjdDpaLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0ZSYmbi5wdXNoKHtyZWN0OnRlLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSk7Y29uc3QgSj0oZj1DLm5vZGUpPT1udWxsP3ZvaWQgMDpmLmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhLGlzRnVsbFdvcms6X30pO3Quc2V0KGose3dvcmtTdGF0ZTpaP0Mub3BzP0YuRG9uZTpGLkRvaW5nOkYuU3RhcnQsb3A6Qy5hbmltYXRpb25Xb3JrRGF0YS5maWx0ZXIoKFksZGUpPT57aWYoZGUlMyE9PTIpcmV0dXJuITB9KS5zbGljZSgtMil9KSxfPyh0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKChZLGRlKT0+e3ZhciBSZTsoUmU9WS5zZWxlY3RJZHMpIT1udWxsJiZSZS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChkZSksdGhpcy5ub0FuaW1hdGlvblJlY3Q9TSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxaKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LHRlKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LEopLHRoaXMucnVuRWZmZWN0KCkpfSksKHc9Qy5ub2RlKT09bnVsbHx8dy5jbGVhclRtcFBvaW50cygpLHRoaXMud29ya1NoYXBlcy5kZWxldGUoaiksci5wdXNoKHtyZWN0OkosZHJhd0NhbnZhczpOLkJnLGlzRnVsbFdvcms6Xyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkMuYW5pbWF0aW9uV29ya0RhdGEuZmlsdGVyKChZLGRlKT0+e2lmKGRlJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpfSkpOmkucHVzaCh7cmVjdDpKLGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsd29ya2VyVHlwZTpfP3ZvaWQgMDpXLlNlcnZpY2UsaXNGdWxsV29yazpfLHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uV29ya0RhdGEubGVuZ3RoPTB9YnJlYWt9Y2FzZSBTLlBlbmNpbDp7aWYoIUMudXNlQW5pbWF0aW9uJiZDLm9wcyl7bGV0IF89KHk9Qy5ub2RlKT09bnVsbD92b2lkIDA6eS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMCxyZXBsYWNlSWQ6an0pO2NvbnN0IFo9KGc9Qy5ub2RlKT09bnVsbD92b2lkIDA6Zy51cGRhdGFPcHRTZXJ2aWNlKEMudXBkYXRlTm9kZU9wdCk7Xz1NKF8sWikscy5wdXNoKHtyZWN0Ok0oQy5vbGRSZWN0LF8pLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0Ok0oQy5vbGRSZWN0LF8pLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKCh0ZSxKKT0+e3ZhciBZOyhZPXRlLnNlbGVjdElkcykhPW51bGwmJlkuaW5jbHVkZXMoaikmJih0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQoSiksdGhpcy5ub0FuaW1hdGlvblJlY3Q9TSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxfKSx0aGlzLnJ1bkVmZmVjdCgpKX0pLChQPUMubm9kZSk9PW51bGx8fFAuY2xlYXJUbXBQb2ludHMoKSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopfWVsc2UgaWYoQy51c2VBbmltYXRpb24pe2NvbnN0IFo9dGhpcy5jb21wdXROZXh0QW5pbWF0aW9uSW5kZXgoQywzKSx0ZT1DLmlzRGlmZj8wOk1hdGgubWF4KDAsKEMuYW5pbWF0aW9uSW5kZXh8fDApLTMpLEo9KEMuYW5pbWF0aW9uV29ya0RhdGF8fFtdKS5zbGljZSh0ZSxaKTtpZihDLmlzRGVsKUMuaXNEZWwmJigoQT1DLm5vZGUpPT1udWxsfHxBLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKSk7ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wnx8Qy5pc0RpZmYpe2NvbnN0IFk9KE89Qy5ub2RlKT09bnVsbD92b2lkIDA6Ty5jb25zdW1lU2VydmljZSh7b3A6Sixpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaz1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDprLnRvU3RyaW5nKCl9KTtpZihpLnB1c2goe3JlY3Q6WSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uSW5kZXg9WixDLmlzRGlmZiYmKEMuaXNEaWZmPSExKSxKLmxlbmd0aCl7Y29uc3QgZGU9Si5maWx0ZXIoKFJlLHdwKT0+e2lmKHdwJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpO3Quc2V0KGose3dvcmtTdGF0ZTp0ZT09PTA/Ri5TdGFydDpaPT09KChJPUMuYW5pbWF0aW9uV29ya0RhdGEpPT1udWxsP3ZvaWQgMDpJLmxlbmd0aCk/Ri5Eb25lOkYuRG9pbmcsb3A6ZGV9KX19ZWxzZSBpZihDLm9wcyl7Y29uc3QgWT0odj1DLm5vZGUpPT1udWxsP3ZvaWQgMDp2LmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDooYj1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDpiLnRvU3RyaW5nKCl9KTtDLmlzRGVsPSEwLG4ucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLChMPUMubm9kZSkhPW51bGwmJkwuZ2V0V29ya09wdGlvbnMoKS5pc09wYWNpdHkmJnMucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0OlksZHJhd0NhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMudk5vZGVzLnNldEluZm8oaix7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YSxvcHQ6KFQ9Qy5ub2RlKT09bnVsbD92b2lkIDA6VC5nZXRXb3JrT3B0aW9ucygpLHRvb2xzVHlwZTpDLnRvb2xzVHlwZSxyZWN0Oll9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkouZmlsdGVyKChkZSxSZSk9PntpZihSZSUzIT09MilyZXR1cm4hMH0pLnNsaWNlKC0yKX0pfWU9ITB9YnJlYWt9YnJlYWt9Y2FzZSBTLkxhc2VyUGVuOntjb25zdCBaPXRoaXMuY29tcHV0TmV4dEFuaW1hdGlvbkluZGV4KEMsMiksdGU9TWF0aC5tYXgoMCwoQy5hbmltYXRpb25JbmRleHx8MCktMiksSj0oQy5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKHRlLFopO2lmKEMuaXNEZWwpe2lmKEMuaXNEZWwpe2NvbnN0IFk9KHNlPUMubm9kZSk9PW51bGw/dm9pZCAwOnNlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9TShDLnRvdGFsUmVjdCxZKSxuLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksKG5vPUMubm9kZSk9PW51bGx8fG5vLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX19ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wil7Y29uc3QgWT0oRD1DLm5vZGUpPT1udWxsP3ZvaWQgMDpELmNvbnN1bWVTZXJ2aWNlKHtvcDpKLGlzRnVsbFdvcms6ITEscmVwbGFjZUlkOigkPUMubm9kZS5nZXRXb3JrSWQoKSk9PW51bGw/dm9pZCAwOiQudG9TdHJpbmcoKX0pO0MudG90YWxSZWN0PU0oQy50b3RhbFJlY3QsWSksQy50aW1lciYmKGNsZWFyVGltZW91dChDLnRpbWVyKSxDLnRpbWVyPXZvaWQgMCksQy5hbmltYXRpb25JbmRleD1aLEoubGVuZ3RoJiZ0LnNldChqLHt3b3JrU3RhdGU6dGU9PT0wP0YuU3RhcnQ6Wj09PSgoSD1DLmFuaW1hdGlvbldvcmtEYXRhKT09bnVsbD92b2lkIDA6SC5sZW5ndGgpP0YuRG9uZTpGLkRvaW5nLG9wOkouc2xpY2UoLTIpfSl9ZWxzZXtDLnRpbWVyfHwoQy50aW1lcj1zZXRUaW1lb3V0KCgpPT57Qy50aW1lcj12b2lkIDAsQy5pc0RlbD0hMCx0aGlzLnJ1bkFuaW1hdGlvbigpfSwoKFY9Qy5ub2RlKT09bnVsbD92b2lkIDA6Vi5nZXRXb3JrT3B0aW9ucygpKS5kdXJhdGlvbioxZTMrMTAwKSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOltdfSkpO2NvbnN0IFk9KGVlPUMubm9kZSk9PW51bGw/dm9pZCAwOmVlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9TShDLnRvdGFsUmVjdCxZKX1uLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksZT0hMH1icmVha319ZSYmdGhpcy5ydW5BbmltYXRpb24oKTtjb25zdCBhPXtyZW5kZXI6W119O2lmKHMubGVuZ3RoKXtjb25zdCBqPXMucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmNsZWFyQ2FudmFzPT09Ti5CZyYmKEMucmVjdD1NKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwoYW89YS5yZW5kZXIpPT1udWxsfHxhby5wdXNoKGopKX1pZihuLmxlbmd0aCl7Y29uc3Qgaj1uLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5jbGVhckNhbnZhcz09PU4uU2VydmljZUZsb2F0JiYoQy5yZWN0PU0oQy5yZWN0LF8ucmVjdCkpLEMpLHtpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwobG89YS5yZW5kZXIpPT1udWxsfHxsby5wdXNoKGopKX1pZihyLmxlbmd0aCl7Y29uc3Qgaj1yLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5kcmF3Q2FudmFzPT09Ti5CZyYmKEMucmVjdD1NKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMCxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSk7ai5yZWN0JiYoai5yZWN0PWoucmVjdCYmSyhqLnJlY3QpLChjbz1hLnJlbmRlcik9PW51bGx8fGNvLnB1c2goaikpfWlmKGkubGVuZ3RoKXtjb25zdCBqPWkucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmRyYXdDYW52YXM9PT1OLlNlcnZpY2VGbG9hdCYmKEMucmVjdD1NKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwodW89YS5yZW5kZXIpPT1udWxsfHx1by5wdXNoKGopKX10LnNpemUmJihhLnNwPVtdLHQuZm9yRWFjaCgoaixDKT0+e3ZhciBfOyhfPWEuc3ApPT1udWxsfHxfLnB1c2goe3R5cGU6bS5DdXJzb3IsdWlkOkMuc3BsaXQoVmgpWzBdLG9wOmoub3Asd29ya1N0YXRlOmoud29ya1N0YXRlLHZpZXdJZDp0aGlzLnZpZXdJZH0pfSkpLChobz1hLnJlbmRlcikhPW51bGwmJmhvLmxlbmd0aCYmdGhpcy5wb3N0KGEpfXJ1bkFuaW1hdGlvbigpe3RoaXMuYW5pbWF0aW9uSWR8fCh0aGlzLmFuaW1hdGlvbklkPXJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkRyYXcuYmluZCh0aGlzKSkpfWNvbXB1dE5leHRBbmltYXRpb25JbmRleChlLHQpe3ZhciBpO2NvbnN0IHI9TWF0aC5mbG9vcigoZS5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKGUuYW5pbWF0aW9uSW5kZXgpLmxlbmd0aCozMi90LygoKGk9ZS5ub2RlKT09bnVsbD92b2lkIDA6aS5zeW5jVW5pdFRpbWUpfHwxZTMpKSp0O3JldHVybiBNYXRoLm1pbigoZS5hbmltYXRpb25JbmRleHx8MCkrKHJ8fHQpLChlLmFuaW1hdGlvbldvcmtEYXRhfHxbXSkubGVuZ3RoKX1ydW5FZmZlY3QoKXt0aGlzLnJ1bkVmZmVjdElkfHwodGhpcy5ydW5FZmZlY3RJZD1zZXRUaW1lb3V0KHRoaXMuZWZmZWN0UnVuU2VsZWN0b3IuYmluZCh0aGlzKSwwKSl9ZWZmZWN0UnVuU2VsZWN0b3IoKXt0aGlzLnJ1bkVmZmVjdElkPXZvaWQgMDtsZXQgZT10aGlzLm5vQW5pbWF0aW9uUmVjdDt0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5mb3JFYWNoKHQ9Pnt2YXIgcyxuO2NvbnN0IHI9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZ2V0KHQpLGk9ciYmci5zZWxlY3RJZHMmJigocz1yLm5vZGUpPT1udWxsP3ZvaWQgMDpzLnNlbGVjdFNlcnZpY2VOb2RlKHQsciwhMCkpO2U9TShlLGkpLChuPXI9PW51bGw/dm9pZCAwOnIuc2VsZWN0SWRzKSE9bnVsbCYmbi5sZW5ndGh8fHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmRlbGV0ZSh0KX0pLGUmJnRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGUpLGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmNsZWFyKCksdGhpcy5ub0FuaW1hdGlvblJlY3Q9dm9pZCAwfWFjdGl2ZVNlbGVjdG9yU2hhcGUoZSl7dmFyIGMsdSxoO2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyxzZWxlY3RJZHM6bn09ZTtpZighdClyZXR1cm47Y29uc3QgYT10LnRvU3RyaW5nKCk7aWYoISgoYz10aGlzLnNlbGVjdG9yV29ya1NoYXBlcykhPW51bGwmJmMuaGFzKGEpKSl7bGV0IGQ9e3Rvb2xzVHlwZTppLHNlbGVjdElkczpuLHR5cGU6cyxvcHQ6cn07aSYmciYmKGQ9dGhpcy5zZXROb2RlS2V5KGQsaSxyKSksKHU9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsfHx1LnNldChhLGQpfWNvbnN0IGw9KGg9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsP3ZvaWQgMDpoLmdldChhKTtzJiYobC50eXBlPXMpLGwubm9kZSYmbC5ub2RlLmdldFdvcmtJZCgpIT09YSYmbC5ub2RlLnNldFdvcmtJZChhKSxsLnNlbGVjdElkcz1ufHxbXX19Y2xhc3MgaHAgZXh0ZW5kcyByb3tjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYW5pbWF0aW9uV29ya1JlY3RzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb21iaW5lRHJhd1RpbWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImFuaW1hdGlvbklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNsb3NlQW5pbWF0aW9uVGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjExMDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywicnVuTGFzZXJQZW5TdGVwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pfWFzeW5jIHJ1bkZ1bGxXb3JrKGUsdCl7dmFyIHMsbjtjb25zdCByPXRoaXMuc2V0RnVsbFdvcmsoZSksaT1lLm9wcyYmcWUoZS5vcHMpO2lmKHIpe2xldCBhO3IudG9vbHNUeXBlPT09Uy5JbWFnZT9hPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7aXNGdWxsV29yazohMCxzY2VuZToocz10aGlzLmZ1bGxMYXllci5wYXJlbnQpPT1udWxsP3ZvaWQgMDpzLnBhcmVudH0pOmE9ci5jb25zdW1lU2VydmljZSh7b3A6aSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDoobj1yLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpLGlzRHJhd0xhYmVsOnR9KTtjb25zdCBsPShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtyZXR1cm4gZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpLGx8fGF9fXJ1blNlbGVjdFdvcmsoZSl7dmFyIHI7Y29uc3QgdD10aGlzLnNldEZ1bGxXb3JrKGUpO3QmJigocj1lLnNlbGVjdElkcykhPW51bGwmJnIubGVuZ3RoKSYmZS53b3JrSWQmJnQuc2VsZWN0U2VydmljZU5vZGUoZS53b3JrSWQudG9TdHJpbmcoKSx7c2VsZWN0SWRzOmUuc2VsZWN0SWRzfSwhMSl9Y29uc3VtZURyYXcoZSl7dmFyIGk7Y29uc3R7b3A6dCx3b3JrSWQ6cn09ZTtpZih0IT1udWxsJiZ0Lmxlbmd0aCYmcil7Y29uc3Qgcz10aGlzLndvcmtTaGFwZXMuZ2V0KHIpO2lmKCFzKXJldHVybjtjb25zdCBuPXMudG9vbHNUeXBlLGE9cy5jb25zdW1lKHtkYXRhOmUsaXNGdWxsV29yazohMSxpc0NsZWFyQWxsOiEwLGlzU3ViV29ya2VyOiEwfSk7c3dpdGNoKG4pe2Nhc2UgUy5MYXNlclBlbjphIT1udWxsJiZhLnJlY3QmJigoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuc2V0KHIse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSksdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbigpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdBcnJvdyhhKSk7YnJlYWs7Y2FzZSBTLlBlbmNpbDphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrfX19Y29uc3VtZURyYXdBbGwoZSl7dmFyIHIsaTtjb25zdHt3b3JrSWQ6dH09ZTtpZih0KXtjb25zdCBzPXRoaXMud29ya1NoYXBlcy5nZXQodCk7aWYoIXMpcmV0dXJuO3N3aXRjaChzLnRvb2xzVHlwZSl7Y2FzZSBTLkxhc2VyUGVuOmlmKHRoaXMuYW5pbWF0aW9uSWQpe2NvbnN0IGE9cy5jb25zdW1lQWxsKHtkYXRhOmV9KTthIT1udWxsJiZhLm9wJiZhIT1udWxsJiZhLnJlY3QmJigocj10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fHIuc2V0KHQse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSx0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKGEpKTtjb25zdCBsPShpPXMuZ2V0V29ya09wdGlvbnMoKSk9PW51bGw/dm9pZCAwOmkuZHVyYXRpb247dGhpcy5jbG9zZUFuaW1hdGlvblRpbWU9bD9sKjFlMysxMDA6dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUsc2V0VGltZW91dCgoKT0+e3ZhciB1O3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQudG9TdHJpbmcoKSkubWFwKGg9PmgucmVtb3ZlKCkpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7Y29uc3QgYz0odT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGw/dm9pZCAwOnUuZ2V0KHQpO2MmJihjLmNhbkRlbD0hMCksc2V0VGltZW91dCgoKT0+e3RoaXMuX3Bvc3Qoe3NwOlt7cmVtb3ZlSWRzOlt0LnRvU3RyaW5nKCldLHR5cGU6bS5SZW1vdmVOb2RlfV19KX0scy5nZXRXb3JrT3B0aW9ucygpLnN5bmNVbml0VGltZXx8dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUpfSx0aGlzLmNsb3NlQW5pbWF0aW9uVGltZSl9YnJlYWs7Y2FzZSBTLkFycm93OmNhc2UgUy5TdHJhaWdodDpjYXNlIFMuRWxsaXBzZTpjYXNlIFMuUGVuY2lsOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246dGhpcy5kcmF3Q291bnQ9MCx0aGlzLmZ1bGxMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7YnJlYWt9fX11cGRhdGVMYWJlbHMoZSx0KXtlLmNoaWxkcmVuLmZvckVhY2gocj0+e2lmKHIudGFnTmFtZT09PSJMQUJFTCIpe2NvbnN0IGk9ci5uYW1lLHt3aWR0aDpzfT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFtuXT1lLndvcmxkU2NhbGluZyx7dW5kZXJsaW5lOmEsbGluZVRocm91Z2g6bH09dC5vcHQ7YSYmZS5nZXRFbGVtZW50c0J5TmFtZShgJHtpfV91bmRlcmxpbmVgKVswXS5hdHRyKHtwb2ludHM6WzAsMCxzL24sMF19KSxsJiZlLmdldEVsZW1lbnRzQnlOYW1lKGAke2l9X2xpbmVUaHJvdWdoYClbMF0uYXR0cih7cG9pbnRzOlswLDAscy9uLDBdfSl9fSl9cnVuTGFzZXJQZW5BbmltYXRpb24oZSl7dGhpcy5hbmltYXRpb25JZHx8KHRoaXMuYW5pbWF0aW9uSWQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57dmFyIGkscztpZih0aGlzLmFuaW1hdGlvbklkPXZvaWQgMCx0aGlzLnJ1bkxhc2VyUGVuU3RlcCsrLHRoaXMucnVuTGFzZXJQZW5TdGVwPjEpe3RoaXMucnVuTGFzZXJQZW5TdGVwPTAsdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbihlKTtyZXR1cm59bGV0IHQ7Y29uc3Qgcj1bXTsoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuZm9yRWFjaCgobixhLGwpPT57bi5pc1JlY3QmJih0PU0odCxuLnJlcy5yZWN0KSksbi5yZXMud29ya0lkJiZyLnB1c2gobi5yZXMpLHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGEudG9TdHJpbmcoKSkubGVuZ3RoP24uaXNSZWN0PSEwOm4uaXNSZWN0PSExLG4uY2FuRGVsJiZsLmRlbGV0ZShhKX0pLChzPXRoaXMuYW5pbWF0aW9uV29ya1JlY3RzKSE9bnVsbCYmcy5zaXplJiZ0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKCksdCYmKGUmJnIucHVzaChlKSx0aGlzLl9wb3N0KHtyZW5kZXI6W3tyZWN0OksodCksZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnJ9KSl9KSl9ZHJhd1BlbmNpbChlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDplPT1udWxsP3ZvaWQgMDplLnJlY3QsZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITEsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XSxzcDooZT09bnVsbD92b2lkIDA6ZS5vcCkmJltlXX0pfWRyYXdBcnJvdyhlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDooZT09bnVsbD92b2lkIDA6ZS5yZWN0KSYmSyhlLnJlY3QpLGRyYXdDYW52YXM6Ti5GbG9hdCxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uRmxvYXQsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pfX12YXIgV2U7KGZ1bmN0aW9uKG8pe28uRnVsbD0iZnVsbCIsby5TdWI9InN1YiJ9KShXZXx8KFdlPXt9KSk7Y2xhc3MgZHB7Y29uc3RydWN0b3IoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3NlbGYiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrVGhyZWFkTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLHRoaXMuX3NlbGY9ZSx0aGlzLnR5cGU9dCx0aGlzLnJlZ2lzdGVyKCl9aW5pdChlKXtjb25zdHt2aWV3SWQ6dCxkcHI6cixvZmZzY3JlZW5DYW52YXNPcHQ6aSxsYXllck9wdDpzLGlzU2FmYXJpOm59PWU7aWYoIXJ8fCFpfHwhcylyZXR1cm47bGV0IGE7dGhpcy50eXBlPT09V2UuRnVsbCYmKGE9bmV3IGZwKHQse2RwcjpyLG9mZnNjcmVlbkNhbnZhc09wdDppLGxheWVyT3B0OnN9LHRoaXMucG9zdC5iaW5kKHRoaXMpKSksdGhpcy50eXBlPT09V2UuU3ViJiYoYT1uZXcgcHAodCx7ZHByOnIsb2Zmc2NyZWVuQ2FudmFzT3B0OmksbGF5ZXJPcHQ6c30sdGhpcy5wb3N0LmJpbmQodGhpcykpKSxhJiZuJiZhLnNldElzU2FmYXJpKG4pLGEmJmUuY2FtZXJhT3B0JiZhLnNldENhbWVyYU9wdChlLmNhbWVyYU9wdCksYSYmdGhpcy53b3JrVGhyZWFkTWFwLnNldCh0LGEpfXJlZ2lzdGVyKCl7b25tZXNzYWdlPWU9Pntjb25zdCB0PWUuZGF0YTtpZih0KWZvcihjb25zdCByIG9mIHQudmFsdWVzKCkpe2NvbnN0e21zZ1R5cGU6aSx2aWV3SWQ6cyx0YXNrc3F1ZXVlOm4sbWFpblRhc2tzcXVldWVDb3VudDphfT1yO2lmKGk9PT1tLkluaXQpe3RoaXMuaW5pdChyKTtjb250aW51ZX1pZihpPT09bS5UYXNrc1F1ZXVlJiYobiE9bnVsbCYmbi5zaXplKSYmYSl7dGhpcy53b3JrVGhyZWFkTWFwLmZvckVhY2goKGMsdSk9Pntjb25zdCBoPW4uZ2V0KHUpO2gmJmMub24oaCksdGhpcy5wb3N0KHt3b3JrZXJUYXNrc3F1ZXVlQ291bnQ6YX0pfSk7Y29udGludWV9aWYocz09PXRkKXt0aGlzLndvcmtUaHJlYWRNYXAuZm9yRWFjaChjPT57Yy5vbihyKSxpPT09bS5EZXN0cm95JiZ0aGlzLndvcmtUaHJlYWRNYXAuZGVsZXRlKHMpfSk7Y29udGludWV9Y29uc3QgbD10aGlzLndvcmtUaHJlYWRNYXAuZ2V0KHMpO2wmJihsLm9uKHIpLGk9PT1tLkRlc3Ryb3kmJnRoaXMud29ya1RocmVhZE1hcC5kZWxldGUocykpfX19cG9zdChlLHQpe3Q/dGhpcy5fc2VsZi5wb3N0TWVzc2FnZShlLHQpOnRoaXMuX3NlbGYucG9zdE1lc3NhZ2UoZSl9fWNsYXNzIGZwIGV4dGVuZHMgdG97Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VEcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNuYXBzaG90RnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm1ldGhvZEJ1aWxkZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywibG9jYWxXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIl9wb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy5fcG9zdD1yLHRoaXMuc2VydmljZURyYXdMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzZXJ2aWNlRHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSksdGhpcy5kcmF3TGF5ZXI9dGhpcy5jcmVhdGVMYXllcigiZHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSk7Y29uc3QgaT17dGhyZWFkOnRoaXMsdmlld0lkOnRoaXMudmlld0lkLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyLHBvc3Q6dGhpcy5wb3N0LmJpbmQodGhpcyl9O3RoaXMubG9jYWxXb3JrPW5ldyBjcChpKSx0aGlzLnNlcnZpY2VXb3JrPW5ldyB1cCh7Li4uaSxzZXJ2aWNlRHJhd0xheWVyOnRoaXMuc2VydmljZURyYXdMYXllcn0pLHRoaXMubWV0aG9kQnVpbGRlcj1uZXcgeGYoW0IuQ29weU5vZGUsQi5TZXRDb2xvck5vZGUsQi5EZWxldGVOb2RlLEIuUm90YXRlTm9kZSxCLlNjYWxlTm9kZSxCLlRyYW5zbGF0ZU5vZGUsQi5aSW5kZXhBY3RpdmUsQi5aSW5kZXhOb2RlLEIuU2V0Rm9udFN0eWxlLEIuU2V0UG9pbnQsQi5TZXRMb2NrLEIuU2V0U2hhcGVPcHRdKS5yZWdpc3RlckZvcldvcmtlcih0aGlzLmxvY2FsV29yayx0aGlzLnNlcnZpY2VXb3JrLHRoaXMuc2NlbmUpLHRoaXMudk5vZGVzLmluaXQodGhpcy5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXIpfWFzeW5jIHBvc3QoZSx0KXt2YXIgYSxsLGM7Y29uc3Qgcj1lLnJlbmRlcixpPVtdO2xldCBzPXQ7aWYociE9bnVsbCYmci5sZW5ndGgpe2Zvcihjb25zdCB1IG9mIHIpe2lmKHUuaXNDbGVhckFsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLHUuaXNDbGVhcj0hMCxkZWxldGUgdS5pc0NsZWFyQWxsKSx1LmlzRHJhd0FsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLGRlbGV0ZSB1LmlzRHJhd0FsbCksdS5kcmF3Q2FudmFzKXtjb25zdCBoPXRoaXMuZ2V0TGF5ZXIodS5pc0Z1bGxXb3JrLHUud29ya2VyVHlwZSk7KGg9PW51bGw/dm9pZCAwOmgucGFyZW50KS5yZW5kZXIoKX1pZih1LnJlY3Qpe3UuY2xlYXJDYW52YXM9PT11LmRyYXdDYW52YXMmJnUuZHJhd0NhbnZhcz09PU4uQmcmJih1LnJlY3Q9dGhpcy5jaGVja1JpZ2h0UmVjdEJvdW5kaW5nQm94KHUucmVjdCkpO2NvbnN0IGg9dS5kcmF3Q2FudmFzPT09Ti5TZWxlY3RvciYmdS5yZWN0O2lmKHUucmVjdD10aGlzLnNhZmFyaUZpeFJlY3QocmUodS5yZWN0KSksIXUucmVjdCljb250aW51ZTtpZih1LmRyYXdDYW52YXM9PT1OLlNlbGVjdG9yKXtjb25zdCBkPShhPWUuc3ApPT1udWxsP3ZvaWQgMDphLmZpbmQoZj0+Zi50eXBlPT09bS5TZWxlY3QpO2QmJihkLnJlY3Q9dS5yZWN0KSxoJiYodS5vZmZzZXQ9e3g6dS5yZWN0LngtaC54LHk6dS5yZWN0LnktaC55fSl9aWYodS5kcmF3Q2FudmFzKXtjb25zdCBkPWF3YWl0IHRoaXMuZ2V0UmVjdEltYWdlQml0bWFwKHUucmVjdCwhIXUuaXNGdWxsV29yayx1LndvcmtlclR5cGUpO3UuaW1hZ2VCaXRtYXA9ZCxzfHwocz1bXSkscy5wdXNoKGQpfWkucHVzaCh1KX19ZS5yZW5kZXI9aX1jb25zdCBuPShsPWUuc3ApPT1udWxsP3ZvaWQgMDpsLmZpbHRlcih1PT51LnR5cGUhPT1tLk5vbmV8fE9iamVjdC5rZXlzKHUpLmZpbHRlcihoPT5oPT09InR5cGUiKS5sZW5ndGgpO2lmKG4hPW51bGwmJm4ubGVuZ3RoJiYoZS5zcD1uLm1hcCh1PT4oey4uLnUsdmlld0lkOnRoaXMudmlld0lkfSkpKSwoZS5kcmF3Q291bnR8fGUud29ya2VyVGFza3NxdWV1ZUNvdW50fHwoYz1lLnNwKSE9bnVsbCYmYy5sZW5ndGh8fGkhPW51bGwmJmkubGVuZ3RoKSYmKGNvbnNvbGUubG9nKCJwb3N0Iix0aGlzLmZ1bGxMYXllci5jaGlsZHJlbi5tYXAodT0+KHtuYW1lOnUubmFtZSx6SW5kZXg6dS5nZXRBdHRyaWJ1dGUoInpJbmRleCIpfSkpKSx0aGlzLl9wb3N0KGUscykscyE9bnVsbCYmcy5sZW5ndGgpKWZvcihjb25zdCB1IG9mIHMpdSBpbnN0YW5jZW9mIEltYWdlQml0bWFwJiZ1LmNsb3NlKCl9b24oZSl7aWYodGhpcy5tZXRob2RCdWlsZGVyLmNvbnN1bWVGb3JXb3JrZXIoZSkpcmV0dXJuO2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLHdvcmtJZDppfT1lO3N3aXRjaCh0KXtjYXNlIG0uVXBkYXRlQ2FtZXJhOnRoaXMudXBkYXRlQ2FtZXJhKGUpO2JyZWFrO2Nhc2UgbS5TZWxlY3Q6cj09PVcuU2VydmljZSYmKGk9PT1FLnNlbGVjdG9ySWQ/dGhpcy5sb2NhbFdvcmsudXBkYXRlRnVsbFNlbGVjdFdvcmsoZSk6dGhpcy5zZXJ2aWNlV29yay5ydW5TZWxlY3RXb3JrKGUpKTticmVhaztjYXNlIG0uVXBkYXRlTm9kZTpjYXNlIG0uRnVsbFdvcms6dGhpcy5jb25zdW1lRnVsbChyLGUpO2JyZWFrO2Nhc2UgbS5SZW1vdmVOb2RlOnRoaXMucmVtb3ZlTm9kZShlKTticmVhaztjYXNlIG0uR2V0VGV4dEFjdGl2ZTp0aGlzLmNoZWNrVGV4dEFjdGl2ZShlKTticmVhaztjYXNlIG0uQ3Vyc29ySG92ZXI6dGhpcy5jdXJzb3JIb3ZlcihlKX1zdXBlci5vbihlKX1hc3luYyByZW1vdmVOb2RlKGUpe2NvbnN0e2RhdGFUeXBlOnQsd29ya0lkOnJ9PWU7aWYocj09PUUuc2VsZWN0b3JJZCl7dGhpcy5sb2NhbFdvcmsuYmx1clNlbGVjdG9yKGUpO3JldHVybn10PT09Vy5Mb2NhbCYmKHRoaXMubG9jYWxXb3JrLnJlbW92ZVdvcmsoZSksdGhpcy5sb2NhbFdvcmsuY29sbG9jdEVmZmVjdFNlbGVjdFdvcmsoZSkpLHQ9PT1XLlNlcnZpY2UmJih0aGlzLnNlcnZpY2VXb3JrLnJlbW92ZVdvcmsoZSksdGhpcy5sb2NhbFdvcmsuY29sbG9jdEVmZmVjdFNlbGVjdFdvcmsoZSkpfWNoZWNrVGV4dEFjdGl2ZShlKXtjb25zdHtkYXRhVHlwZTp0fT1lO3Q9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jaGVja1RleHRBY3RpdmUoZSl9Y2xlYXJBbGwoKXt0aGlzLnZOb2Rlcy5jbGVhcigpLHN1cGVyLmNsZWFyQWxsKCksdGhpcy5zZXJ2aWNlRHJhd0xheWVyJiYodGhpcy5zZXJ2aWNlRHJhd0xheWVyLnBhcmVudC5jaGlsZHJlbi5mb3JFYWNoKGU9PntlLm5hbWUhPT0idmlld3BvcnQiJiZlLnJlbW92ZSgpfSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnJlbW92ZUFsbENoaWxkcmVuKCkpLHRoaXMucG9zdCh7cmVuZGVyOlt7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSx7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLlNlcnZpY2VGbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOlt7dHlwZTptLkNsZWFyfV19KX11cGRhdGVMYXllcihlKXtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lO3N1cGVyLnVwZGF0ZUxheWVyKGUpLHRoaXMuc2VydmljZURyYXdMYXllciYmKHRoaXMuc2VydmljZURyYXdMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoImhlaWdodCIsciksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnNldEF0dHJpYnV0ZSgic2l6ZSIsW3Qscl0pLHRoaXMuc2VydmljZURyYXdMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKX1zZXRDYW1lcmFPcHQoZSl7dGhpcy5jYW1lcmFPcHQ9ZTtjb25zdHtzY2FsZTp0LGNlbnRlclg6cixjZW50ZXJZOmksd2lkdGg6cyxoZWlnaHQ6bn09ZTsocyE9PXRoaXMuc2NlbmUud2lkdGh8fG4hPT10aGlzLnNjZW5lLmhlaWdodCkmJnRoaXMudXBkYXRlU2NlbmUoe3dpZHRoOnMsaGVpZ2h0Om59KSx0aGlzLmZ1bGxMYXllciYmKHRoaXMuZnVsbExheWVyLnNldEF0dHJpYnV0ZSgic2NhbGUiLFt0LHRdKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1yLC1pXSkpLHRoaXMuZHJhd0xheWVyJiYodGhpcy5kcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJzY2FsZSIsW3QsdF0pLHRoaXMuZHJhd0xheWVyLnNldEF0dHJpYnV0ZSgidHJhbnNsYXRlIixbLXIsLWldKSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyJiYodGhpcy5zZXJ2aWNlRHJhd0xheWVyLnNldEF0dHJpYnV0ZSgic2NhbGUiLFt0LHRdKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFstciwtaV0pKX1nZXRMYXllcihlLHQpe3JldHVybiBlP3RoaXMuZnVsbExheWVyOnQmJnQ9PT1XLlNlcnZpY2U/dGhpcy5zZXJ2aWNlRHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfWdldE9mZnNjcmVlbihlLHQpe3JldHVybiB0aGlzLmdldExheWVyKGUsdCkucGFyZW50LmNhbnZhc31hc3luYyBjb25zdW1lRnVsbChlLHQpe2NvbnN0IHI9YXdhaXQgdGhpcy5sb2NhbFdvcmsuY29sbG9jdEVmZmVjdFNlbGVjdFdvcmsodCk7ciYmZT09PVcuTG9jYWwmJmF3YWl0IHRoaXMubG9jYWxXb3JrLmNvbnN1bWVGdWxsKHIsdGhpcy5zY2VuZSksciYmZT09PVcuU2VydmljZSYmdGhpcy5zZXJ2aWNlV29yay5jb25zdW1lRnVsbChyKX1jb25zdW1lRHJhdyhlLHQpe2U9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jb25zdW1lRHJhdyh0LHRoaXMuc2VydmljZVdvcmspLGU9PT1XLlNlcnZpY2UmJnRoaXMuc2VydmljZVdvcmsuY29uc3VtZURyYXcodCl9Y29uc3VtZURyYXdBbGwoZSx0KXtlPT09Vy5Mb2NhbCYmdGhpcy5sb2NhbFdvcmsuY29uc3VtZURyYXdBbGwodCx0aGlzLnNlcnZpY2VXb3JrKX11cGRhdGVDYW1lcmEoZSl7dmFyIGk7Y29uc3QgdD1bXSx7Y2FtZXJhT3B0OnJ9PWU7aWYociYmKHRoaXMuc2V0Q2FtZXJhT3B0KHIpLHRoaXMubG9jYWxXb3JrLndvcmtTaGFwZXMuZm9yRWFjaCgocyxuKT0+eyhzLnRvb2xzVHlwZT09PVMuUGVuY2lsfHxzLnRvb2xzVHlwZT09PVMuQXJyb3d8fHMudG9vbHNUeXBlPT09Uy5TdHJhaWdodHx8cy50b29sc1R5cGU9PT1TLkVsbGlwc2V8fHMudG9vbHNUeXBlPT09Uy5SZWN0YW5nbGV8fHMudG9vbHNUeXBlPT09Uy5TdGFyfHxzLnRvb2xzVHlwZT09PVMuUG9seWdvbnx8cy50b29sc1R5cGU9PT1TLlNwZWVjaEJhbGxvb258fHMudG9vbHNUeXBlPT09Uy5UZXh0KSYmdGhpcy5sb2NhbFdvcmsud29ya1NoYXBlU3RhdGUuc2V0KG4se3dpbGxDbGVhcjohMH0pfSksdGhpcy52Tm9kZXMuY3VyTm9kZU1hcC5zaXplKSl7aWYodGhpcy52Tm9kZXMudXBkYXRlTm9kZXNSZWN0KCksdGhpcy5sb2NhbFdvcmsucmVSZW5kZXJTZWxlY3RvcigpLHRoaXMuc2VydmljZVdvcmsuc2VsZWN0b3JXb3JrU2hhcGVzLnNpemUpZm9yKGNvbnN0W2EsbF1vZiB0aGlzLnNlcnZpY2VXb3JrLnNlbGVjdG9yV29ya1NoYXBlcy5lbnRyaWVzKCkpdGhpcy5zZXJ2aWNlV29yay5ydW5TZWxlY3RXb3JrKHt3b3JrSWQ6YSxzZWxlY3RJZHM6bC5zZWxlY3RJZHMsbXNnVHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLlNlcnZpY2Usdmlld0lkOnRoaXMudmlld0lkfSk7bGV0IHM7Y29uc3Qgbj10aGlzLmxvY2FsV29yay5nZXRXb3JrU2hhcGUoS2UpO2lmKG4mJigoaT1uLnNlbGVjdElkcykhPW51bGwmJmkubGVuZ3RoKSYmKHM9bi5vbGRTZWxlY3RSZWN0LG4uY3Vyc29yQmx1cigpKSx0aGlzLnZOb2Rlcy5oYXNSZW5kZXJOb2RlcygpKXt0LnB1c2goe2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0se2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2Zvcihjb25zdCBhIG9mIHRoaXMudk5vZGVzLmN1ck5vZGVNYXAudmFsdWVzKCkpT3IoYS50b29sc1R5cGUpJiYocz1NKHMsYS5yZWN0KSk7cyYmdC5wdXNoKHtyZWN0OksocywyMCksZHJhd0NhbnZhczpOLkJnLGlzQ2xlYXI6ITEsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9KX10Lmxlbmd0aCYmdGhpcy5wb3N0KHtyZW5kZXI6dH0pfX1nZXRSZWN0SW1hZ2VCaXRtYXAoZSx0LHIpe2NvbnN0IGk9ZS54KnRoaXMuZHByLHM9ZS55KnRoaXMuZHByLG49ZS53KnRoaXMuZHByLGE9ZS5oKnRoaXMuZHByO3JldHVybiBjcmVhdGVJbWFnZUJpdG1hcCh0aGlzLmdldE9mZnNjcmVlbih0LHIpLGkscyxuLGEpfXNhZmFyaUZpeFJlY3QoZSl7aWYoZS53K2UueDw9MHx8ZS5oK2UueTw9MHx8ZS53PD0wfHxlLmg8PTApcmV0dXJuO2NvbnN0IHQ9e3g6MCx5OjAsdzpNYXRoLmZsb29yKHRoaXMuc2NlbmUud2lkdGgpLGg6TWF0aC5mbG9vcih0aGlzLnNjZW5lLmhlaWdodCl9O2lmKGUueDwwP2UudytlLng8dGhpcy5zY2VuZS53aWR0aCYmKHQudz1lLncrZS54KTplLncrZS54PjAmJih0Lng9ZS54LHQudz1NYXRoLmZsb29yKHRoaXMuc2NlbmUud2lkdGgtZS54KSksZS55PDA/ZS5oK2UueTx0aGlzLnNjZW5lLmhlaWdodCYmKHQuaD1lLmgrZS55KTplLmgrZS55PjAmJih0Lnk9ZS55LHQuaD1NYXRoLmZsb29yKHRoaXMuc2NlbmUuaGVpZ2h0LWUueSkpLCEodC53PD0wfHx0Lmg8PTApKXJldHVybiB0fWdldFNjZW5lUmVjdCgpe2NvbnN0e3dpZHRoOmUsaGVpZ2h0OnR9PXRoaXMuc2NlbmU7cmV0dXJue3g6MCx5OjAsdzpNYXRoLmZsb29yKGUpLGg6TWF0aC5mbG9vcih0KX19Y2hlY2tSaWdodFJlY3RCb3VuZGluZ0JveChlKXtyZXR1cm4gdGhpcy52Tm9kZXMuY29tYmluZUludGVyc2VjdFJlY3QoZSl9Y3Vyc29ySG92ZXIoZSl7dGhpcy5sb2NhbFdvcmsuY3Vyc29ySG92ZXIoZSl9fWNsYXNzIHBwIGV4dGVuZHMgdG97Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIl9wb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzbmFwc2hvdEZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZXJ2aWNlV29yayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJsb2NhbFdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLl9wb3N0PXI7Y29uc3QgaT17dGhyZWFkOnRoaXMsdmlld0lkOnRoaXMudmlld0lkLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyLHBvc3Q6dGhpcy5wb3N0LmJpbmQodGhpcyl9O3RoaXMubG9jYWxXb3JrPW5ldyBocChpKSx0aGlzLnZOb2Rlcy5pbml0KHRoaXMuZnVsbExheWVyLHRoaXMuZHJhd0xheWVyKX1hc3luYyBwb3N0KGUsdCl7dmFyIGEsbDtjb25zdCByPWUucmVuZGVyLGk9W107bGV0IHM9dDtpZihyIT1udWxsJiZyLmxlbmd0aCl7Zm9yKGNvbnN0IGMgb2YgcilpZihjLmRyYXdDYW52YXMmJnRoaXMuZnVsbExheWVyLnBhcmVudC5yZW5kZXIoKSxjLnJlY3Qpe2lmKGMucmVjdD10aGlzLnNhZmFyaUZpeFJlY3QocmUoYy5yZWN0KSksIWMucmVjdCljb250aW51ZTtpZihjLmRyYXdDYW52YXMpe2NvbnN0IHU9YXdhaXQgdGhpcy5nZXRSZWN0SW1hZ2VCaXRtYXAoYy5yZWN0LCEhYy5pc0Z1bGxXb3JrKTtjLmltYWdlQml0bWFwPXUsc3x8KHM9W10pLHMucHVzaCh1KX1pLnB1c2goYyl9ZS5yZW5kZXI9aX1jb25zdCBuPShhPWUuc3ApPT1udWxsP3ZvaWQgMDphLmZpbHRlcihjPT5jLnR5cGUhPT1tLk5vbmV8fE9iamVjdC5rZXlzKGMpLmZpbHRlcih1PT51PT09InR5cGUiKS5sZW5ndGgpO2lmKG4hPW51bGwmJm4ubGVuZ3RoJiYoZS5zcD1uLm1hcChjPT4oey4uLmMsdmlld0lkOnRoaXMudmlld0lkfSkpKSwoKGw9ZS5zcCkhPW51bGwmJmwubGVuZ3RofHxlLmRyYXdDb3VudHx8aSE9bnVsbCYmaS5sZW5ndGgpJiYodGhpcy5fcG9zdChlLHMpLHMhPW51bGwmJnMubGVuZ3RoKSlmb3IoY29uc3QgYyBvZiBzKWMgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCYmYy5jbG9zZSgpfW9uKGUpe2NvbnN0e21zZ1R5cGU6dH09ZTtzd2l0Y2godCl7Y2FzZSBtLlVwZGF0ZUNhbWVyYTp0aGlzLnVwZGF0ZUNhbWVyYShlKTticmVhaztjYXNlIG0uU25hcHNob3Q6dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzbmFwc2hvdEZ1bGxMYXllciIsdGhpcy5zY2VuZSx7Li4udGhpcy5vcHQubGF5ZXJPcHQsYnVmZmVyU2l6ZTp0aGlzLnZpZXdJZD09PSJtYWluVmlldyI/NmUzOjNlM30pLHRoaXMuc25hcHNob3RGdWxsTGF5ZXImJnRoaXMuZ2V0U25hcHNob3QoZSkudGhlbigoKT0+e3RoaXMuc25hcHNob3RGdWxsTGF5ZXI9dm9pZCAwfSk7YnJlYWs7Y2FzZSBtLkJvdW5kaW5nQm94OnRoaXMuc25hcHNob3RGdWxsTGF5ZXI9dGhpcy5jcmVhdGVMYXllcigic25hcHNob3RGdWxsTGF5ZXIiLHRoaXMuc2NlbmUsey4uLnRoaXMub3B0LmxheWVyT3B0LGJ1ZmZlclNpemU6dGhpcy52aWV3SWQ9PT0ibWFpblZpZXciPzZlMzozZTN9KSx0aGlzLnNuYXBzaG90RnVsbExheWVyJiZ0aGlzLmdldEJvdW5kaW5nUmVjdChlKS50aGVuKCgpPT57dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj12b2lkIDB9KTticmVha31zdXBlci5vbihlKX1nZXRPZmZzY3JlZW4oZSl7dmFyIHQ7cmV0dXJuKHQ9KGUmJnRoaXMuc25hcHNob3RGdWxsTGF5ZXJ8fHRoaXMuZnVsbExheWVyKS5wYXJlbnQpPT1udWxsP3ZvaWQgMDp0LmNhbnZhc31jb25zdW1lRHJhdyhlLHQpe2U9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jb25zdW1lRHJhdyh0KX1jb25zdW1lRHJhd0FsbChlLHQpe3RoaXMubG9jYWxXb3JrLmNvbnN1bWVEcmF3QWxsKHQpfWdldFJlY3RJbWFnZUJpdG1hcChlLHQ9ITEscil7Y29uc3QgaT1lLngqdGhpcy5kcHIscz1lLnkqdGhpcy5kcHIsbj1lLncqdGhpcy5kcHIsYT1lLmgqdGhpcy5kcHI7cmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKHRoaXMuZ2V0T2Zmc2NyZWVuKHQpLGkscyxuLGEscil9c2FmYXJpRml4UmVjdChlKXtpZihlLncrZS54PD0wfHxlLmgrZS55PD0wfHxlLnc8PTB8fGUuaDw9MClyZXR1cm47Y29uc3QgdD17eDowLHk6MCx3Ok1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aCksaDpNYXRoLmZsb29yKHRoaXMuc2NlbmUuaGVpZ2h0KX07aWYoZS54PDA/ZS53K2UueDx0aGlzLnNjZW5lLndpZHRoJiYodC53PWUudytlLngpOmUudytlLng+MCYmKHQueD1lLngsdC53PU1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aC1lLngpKSxlLnk8MD9lLmgrZS55PHRoaXMuc2NlbmUuaGVpZ2h0JiYodC5oPWUuaCtlLnkpOmUuaCtlLnk+MCYmKHQueT1lLnksdC5oPU1hdGguZmxvb3IodGhpcy5zY2VuZS5oZWlnaHQtZS55KSksISh0Lnc8PTB8fHQuaDw9MCkpcmV0dXJuIHR9dXBkYXRlQ2FtZXJhKGUpe2NvbnN0e2NhbWVyYU9wdDp0fT1lO3QmJnRoaXMuc2V0Q2FtZXJhT3B0KHQpfXNldENhbWVyYU9wdChlLHQpe3RoaXMuY2FtZXJhT3B0PWU7Y29uc3R7c2NhbGU6cixjZW50ZXJYOmksY2VudGVyWTpzLHdpZHRoOm4saGVpZ2h0OmF9PWU7KG4hPT10aGlzLnNjZW5lLndpZHRofHxhIT09dGhpcy5zY2VuZS5oZWlnaHQpJiZ0aGlzLnVwZGF0ZVNjZW5lKHt3aWR0aDpuLGhlaWdodDphfSksdD8odC5zZXRBdHRyaWJ1dGUoInNjYWxlIixbcixyXSksdC5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1pLC1zXSkpOih0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInNjYWxlIixbcixyXSksdGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFstaSwtc10pKX1hc3luYyBnZXRTbmFwc2hvdChlKXtjb25zdHtzY2VuZVBhdGg6dCxzY2VuZXM6cixjYW1lcmFPcHQ6aSx3OnMsaDpuLG1heFpJbmRleDphfT1lO2lmKHQmJnImJmkmJnRoaXMuc25hcHNob3RGdWxsTGF5ZXIpe2NvbnN0IGw9cmUodGhpcy5jYW1lcmFPcHQpO3RoaXMuc2V0Q2FtZXJhT3B0KGksdGhpcy5zbmFwc2hvdEZ1bGxMYXllciksdGhpcy5sb2NhbFdvcmsuZnVsbExheWVyPXRoaXMuc25hcHNob3RGdWxsTGF5ZXIsdGhpcy5sb2NhbFdvcmsuZHJhd0xheWVyPXRoaXMuZnVsbExheWVyO2xldCBjO2NvbnN0IHU9bmV3IE1hcDtmb3IoY29uc3RbZCxmXW9mIE9iamVjdC5lbnRyaWVzKHIpKWlmKGYhPW51bGwmJmYudHlwZSlzd2l0Y2goZj09bnVsbD92b2lkIDA6Zi50eXBlKXtjYXNlIG0uVXBkYXRlTm9kZTpjYXNlIG0uRnVsbFdvcms6e2NvbnN0e3Rvb2xzVHlwZTp3LG9wdDp5fT1mO3c9PT1TLlRleHQmJnkmJih5LnpJbmRleD15LnpJbmRleCsoYXx8MCksKHkubGluZVRocm91Z2h8fHkudW5kZXJsaW5lKSYmdS5zZXQoZCxmKSk7Y29uc3QgZz1hd2FpdCB0aGlzLmxvY2FsV29yay5ydW5GdWxsV29yayh7Li4uZixvcHQ6eSx3b3JrSWQ6ZCxtc2dUeXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0sdz09PVMuVGV4dCk7Yz1NKGMsZyk7YnJlYWt9fXRoaXMubG9jYWxXb3JrLmZ1bGxMYXllcj10aGlzLmZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dm9pZCAwO2xldCBoO3MmJm4mJihoPXtyZXNpemVXaWR0aDpzLHJlc2l6ZUhlaWdodDpufSksdS5zaXplJiYoYXdhaXQgbmV3IFByb21pc2UoZD0+e3NldFRpbWVvdXQoZCw1MDApfSksdGhpcy53aWxsUmVuZGVyU3BlY2lhbExhYmVsKHUpKSxhd2FpdCB0aGlzLmdldFNuYXBzaG90UmVuZGVyKHtzY2VuZVBhdGg6dCxjdXJDYW1lcmFPcHQ6bCxvcHRpb25zOmh9KX19d2lsbFJlbmRlclNwZWNpYWxMYWJlbChlKXt2YXIgdDtmb3IoY29uc3RbcixpXW9mIGUuZW50cmllcygpKXtjb25zdCBzPSh0PXRoaXMuc25hcHNob3RGdWxsTGF5ZXIpPT1udWxsP3ZvaWQgMDp0LmdldEVsZW1lbnRzQnlOYW1lKHIpWzBdO3MmJmkub3B0JiZ0aGlzLmxvY2FsV29yay51cGRhdGVMYWJlbHMocyxpKX19YXN5bmMgZ2V0U25hcHNob3RSZW5kZXIoZSl7dmFyIG4sYTtjb25zdHtzY2VuZVBhdGg6dCxjdXJDYW1lcmFPcHQ6cixvcHRpb25zOml9PWU7KChuPXRoaXMuc25hcHNob3RGdWxsTGF5ZXIpPT1udWxsP3ZvaWQgMDpuLnBhcmVudCkucmVuZGVyKCk7Y29uc3Qgcz1hd2FpdCB0aGlzLmdldFJlY3RJbWFnZUJpdG1hcCh7eDowLHk6MCx3OnRoaXMuc2NlbmUud2lkdGgsaDp0aGlzLnNjZW5lLmhlaWdodH0sITAsaSk7cyYmKGF3YWl0IHRoaXMucG9zdCh7c3A6W3t0eXBlOm0uU25hcHNob3Qsc2NlbmVQYXRoOnQsaW1hZ2VCaXRtYXA6c31dfSxbc10pLHMuY2xvc2UoKSwoYT10aGlzLnNuYXBzaG90RnVsbExheWVyKT09bnVsbHx8YS5yZW1vdmVBbGxDaGlsZHJlbigpLHRoaXMuc2V0Q2FtZXJhT3B0KHIsdGhpcy5mdWxsTGF5ZXIpKX1hc3luYyBnZXRCb3VuZGluZ1JlY3QoZSl7Y29uc3R7c2NlbmVQYXRoOnQsc2NlbmVzOnIsY2FtZXJhT3B0Oml9PWU7aWYodCYmciYmaSYmdGhpcy5zbmFwc2hvdEZ1bGxMYXllcil7Y29uc3Qgcz1yZSh0aGlzLmNhbWVyYU9wdCk7dGhpcy5zZXRDYW1lcmFPcHQoaSx0aGlzLnNuYXBzaG90RnVsbExheWVyKSx0aGlzLmxvY2FsV29yay5mdWxsTGF5ZXI9dGhpcy5zbmFwc2hvdEZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dGhpcy5kcmF3TGF5ZXI7bGV0IG47Zm9yKGNvbnN0W2EsbF1vZiBPYmplY3QuZW50cmllcyhyKSlpZihsIT1udWxsJiZsLnR5cGUpc3dpdGNoKGw9PW51bGw/dm9pZCAwOmwudHlwZSl7Y2FzZSBtLlVwZGF0ZU5vZGU6Y2FzZSBtLkZ1bGxXb3JrOntjb25zdCBjPWF3YWl0IHRoaXMubG9jYWxXb3JrLnJ1bkZ1bGxXb3JrKHsuLi5sLHdvcmtJZDphLG1zZ1R5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLlNlcnZpY2Usdmlld0lkOnRoaXMudmlld0lkfSk7bj1NKG4sYyk7YnJlYWt9fW4mJmF3YWl0IHRoaXMucG9zdCh7c3A6W3t0eXBlOm0uQm91bmRpbmdCb3gsc2NlbmVQYXRoOnQscmVjdDpufV19KSx0aGlzLmxvY2FsV29yay5mdWxsTGF5ZXI9dGhpcy5mdWxsTGF5ZXIsdGhpcy5sb2NhbFdvcmsuZHJhd0xheWVyPXZvaWQgMCx0aGlzLnNuYXBzaG90RnVsbExheWVyLnJlbW92ZUFsbENoaWxkcmVuKCksdGhpcy5zZXRDYW1lcmFPcHQocyx0aGlzLmZ1bGxMYXllcil9fX1jb25zdCB5cD1zZWxmO25ldyBkcCh5cCxXZS5GdWxsKX0pKHNwcml0ZWpzKTsK", PG = (t) => Uint8Array.from(atob(t), (l) => l.charCodeAt(0)), Dc = typeof window < "u" && window.Blob && new Blob([PG(Ut)], { type: "text/javascript;charset=utf-8" });
function QG(t) {
  let l;
  try {
    if (l = Dc && (window.URL || window.webkitURL).createObjectURL(Dc), !l)
      throw "";
    const e = new Worker(l, {
      name: t == null ? void 0 : t.name
    });
    return e.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(l);
    }), e;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + Ut,
      {
        name: t == null ? void 0 : t.name
      }
    );
  } finally {
    l && (window.URL || window.webkitURL).revokeObjectURL(l);
  }
}
const gt = "c2VsZi5pbXBvcnRTY3JpcHRzKCJodHRwczovL3VucGtnLmNvbS9zcHJpdGVqc0AzL2Rpc3Qvc3ByaXRlanMuanMiKTsoZnVuY3Rpb24oeil7InVzZSBzdHJpY3QiO3ZhciBBZT10eXBlb2YgZ2xvYmFsVGhpczwidSI/Z2xvYmFsVGhpczp0eXBlb2Ygd2luZG93PCJ1Ij93aW5kb3c6dHlwZW9mIGdsb2JhbDwidSI/Z2xvYmFsOnR5cGVvZiBzZWxmPCJ1Ij9zZWxmOnt9O2Z1bmN0aW9uIG1lKG8pe3JldHVybiBvJiZvLl9fZXNNb2R1bGUmJk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCJkZWZhdWx0Iik/by5kZWZhdWx0Om99ZnVuY3Rpb24gZm8oKXt0aGlzLl9fZGF0YV9fPVtdLHRoaXMuc2l6ZT0wfXZhciBwbz1mbztmdW5jdGlvbiB5byhvLGUpe3JldHVybiBvPT09ZXx8byE9PW8mJmUhPT1lfXZhciBWZT15byx3bz1WZTtmdW5jdGlvbiBtbyhvLGUpe2Zvcih2YXIgdD1vLmxlbmd0aDt0LS07KWlmKHdvKG9bdF1bMF0sZSkpcmV0dXJuIHQ7cmV0dXJuLTF9dmFyIE1lPW1vLGdvPU1lLGJvPUFycmF5LnByb3RvdHlwZSx2bz1iby5zcGxpY2U7ZnVuY3Rpb24gU28obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PWdvKGUsbyk7aWYodDwwKXJldHVybiExO3ZhciByPWUubGVuZ3RoLTE7cmV0dXJuIHQ9PXI/ZS5wb3AoKTp2by5jYWxsKGUsdCwxKSwtLXRoaXMuc2l6ZSwhMH12YXIga289U28sUG89TWU7ZnVuY3Rpb24gVG8obyl7dmFyIGU9dGhpcy5fX2RhdGFfXyx0PVBvKGUsbyk7cmV0dXJuIHQ8MD92b2lkIDA6ZVt0XVsxXX12YXIgSW89VG8seG89TWU7ZnVuY3Rpb24gT28obyl7cmV0dXJuIHhvKHRoaXMuX19kYXRhX18sbyk+LTF9dmFyIExvPU9vLENvPU1lO2Z1bmN0aW9uIE5vKG8sZSl7dmFyIHQ9dGhpcy5fX2RhdGFfXyxyPUNvKHQsbyk7cmV0dXJuIHI8MD8oKyt0aGlzLnNpemUsdC5wdXNoKFtvLGVdKSk6dFtyXVsxXT1lLHRoaXN9dmFyIFdvPU5vLFJvPXBvLEFvPWtvLE1vPUlvLCRvPUxvLERvPVdvO2Z1bmN0aW9uIGdlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fWdlLnByb3RvdHlwZS5jbGVhcj1SbyxnZS5wcm90b3R5cGUuZGVsZXRlPUFvLGdlLnByb3RvdHlwZS5nZXQ9TW8sZ2UucHJvdG90eXBlLmhhcz0kbyxnZS5wcm90b3R5cGUuc2V0PURvO3ZhciAkZT1nZSxqbz0kZTtmdW5jdGlvbiBGbygpe3RoaXMuX19kYXRhX189bmV3IGpvLHRoaXMuc2l6ZT0wfXZhciBCbz1GbztmdW5jdGlvbiBfbyhvKXt2YXIgZT10aGlzLl9fZGF0YV9fLHQ9ZS5kZWxldGUobyk7cmV0dXJuIHRoaXMuc2l6ZT1lLnNpemUsdH12YXIgRW89X287ZnVuY3Rpb24gem8obyl7cmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KG8pfXZhciBVbz16bztmdW5jdGlvbiBHbyhvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMobyl9dmFyIFhvPUdvLEhvPXR5cGVvZiBBZT09Im9iamVjdCImJkFlJiZBZS5PYmplY3Q9PT1PYmplY3QmJkFlLFN0PUhvLFlvPVN0LHFvPXR5cGVvZiBzZWxmPT0ib2JqZWN0IiYmc2VsZiYmc2VsZi5PYmplY3Q9PT1PYmplY3QmJnNlbGYsWm89WW98fHFvfHxGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpLGllPVpvLFFvPWllLEpvPVFvLlN5bWJvbCxEZT1KbyxrdD1EZSxQdD1PYmplY3QucHJvdG90eXBlLEtvPVB0Lmhhc093blByb3BlcnR5LFZvPVB0LnRvU3RyaW5nLExlPWt0P2t0LnRvU3RyaW5nVGFnOnZvaWQgMDtmdW5jdGlvbiBlcyhvKXt2YXIgZT1Lby5jYWxsKG8sTGUpLHQ9b1tMZV07dHJ5e29bTGVdPXZvaWQgMDt2YXIgcj0hMH1jYXRjaHt9dmFyIGk9Vm8uY2FsbChvKTtyZXR1cm4gciYmKGU/b1tMZV09dDpkZWxldGUgb1tMZV0pLGl9dmFyIHRzPWVzLHJzPU9iamVjdC5wcm90b3R5cGUsb3M9cnMudG9TdHJpbmc7ZnVuY3Rpb24gc3Mobyl7cmV0dXJuIG9zLmNhbGwobyl9dmFyIGlzPXNzLFR0PURlLG5zPXRzLGFzPWlzLGxzPSJbb2JqZWN0IE51bGxdIixjcz0iW29iamVjdCBVbmRlZmluZWRdIixJdD1UdD9UdC50b1N0cmluZ1RhZzp2b2lkIDA7ZnVuY3Rpb24gdXMobyl7cmV0dXJuIG89PW51bGw/bz09PXZvaWQgMD9jczpsczpJdCYmSXQgaW4gT2JqZWN0KG8pP25zKG8pOmFzKG8pfXZhciBmZT11cztmdW5jdGlvbiBocyhvKXt2YXIgZT10eXBlb2YgbztyZXR1cm4gbyE9bnVsbCYmKGU9PSJvYmplY3QifHxlPT0iZnVuY3Rpb24iKX12YXIgdWU9aHMsZHM9ZmUsZnM9dWUscHM9IltvYmplY3QgQXN5bmNGdW5jdGlvbl0iLHlzPSJbb2JqZWN0IEZ1bmN0aW9uXSIsd3M9IltvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dIixtcz0iW29iamVjdCBQcm94eV0iO2Z1bmN0aW9uIGdzKG8pe2lmKCFmcyhvKSlyZXR1cm4hMTt2YXIgZT1kcyhvKTtyZXR1cm4gZT09eXN8fGU9PXdzfHxlPT1wc3x8ZT09bXN9dmFyIHh0PWdzLGJzPWllLHZzPWJzWyJfX2NvcmUtanNfc2hhcmVkX18iXSxTcz12cyxldD1TcyxPdD1mdW5jdGlvbigpe3ZhciBvPS9bXi5dKyQvLmV4ZWMoZXQmJmV0LmtleXMmJmV0LmtleXMuSUVfUFJPVE98fCIiKTtyZXR1cm4gbz8iU3ltYm9sKHNyYylfMS4iK286IiJ9KCk7ZnVuY3Rpb24ga3Mobyl7cmV0dXJuISFPdCYmT3QgaW4gb312YXIgUHM9a3MsVHM9RnVuY3Rpb24ucHJvdG90eXBlLElzPVRzLnRvU3RyaW5nO2Z1bmN0aW9uIHhzKG8pe2lmKG8hPW51bGwpe3RyeXtyZXR1cm4gSXMuY2FsbChvKX1jYXRjaHt9dHJ5e3JldHVybiBvKyIifWNhdGNoe319cmV0dXJuIiJ9dmFyIEx0PXhzLE9zPXh0LExzPVBzLENzPXVlLE5zPUx0LFdzPS9bXFxeJC4qKz8oKVtcXXt9fF0vZyxScz0vXlxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXF0kLyxBcz1GdW5jdGlvbi5wcm90b3R5cGUsTXM9T2JqZWN0LnByb3RvdHlwZSwkcz1Bcy50b1N0cmluZyxEcz1Ncy5oYXNPd25Qcm9wZXJ0eSxqcz1SZWdFeHAoIl4iKyRzLmNhbGwoRHMpLnJlcGxhY2UoV3MsIlxcJCYiKS5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcKCl8IGZvciAuKz8oPz1cXFxdKS9nLCIkMS4qPyIpKyIkIik7ZnVuY3Rpb24gRnMobyl7aWYoIUNzKG8pfHxMcyhvKSlyZXR1cm4hMTt2YXIgZT1PcyhvKT9qczpScztyZXR1cm4gZS50ZXN0KE5zKG8pKX12YXIgQnM9RnM7ZnVuY3Rpb24gX3MobyxlKXtyZXR1cm4gbz09bnVsbD92b2lkIDA6b1tlXX12YXIgRXM9X3MsenM9QnMsVXM9RXM7ZnVuY3Rpb24gR3MobyxlKXt2YXIgdD1VcyhvLGUpO3JldHVybiB6cyh0KT90OnZvaWQgMH12YXIgcGU9R3MsWHM9cGUsSHM9aWUsWXM9WHMoSHMsIk1hcCIpLHR0PVlzLHFzPXBlLFpzPXFzKE9iamVjdCwiY3JlYXRlIiksamU9WnMsQ3Q9amU7ZnVuY3Rpb24gUXMoKXt0aGlzLl9fZGF0YV9fPUN0P0N0KG51bGwpOnt9LHRoaXMuc2l6ZT0wfXZhciBKcz1RcztmdW5jdGlvbiBLcyhvKXt2YXIgZT10aGlzLmhhcyhvKSYmZGVsZXRlIHRoaXMuX19kYXRhX19bb107cmV0dXJuIHRoaXMuc2l6ZS09ZT8xOjAsZX12YXIgVnM9S3MsZWk9amUsdGk9Il9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18iLHJpPU9iamVjdC5wcm90b3R5cGUsb2k9cmkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gc2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztpZihlaSl7dmFyIHQ9ZVtvXTtyZXR1cm4gdD09PXRpP3ZvaWQgMDp0fXJldHVybiBvaS5jYWxsKGUsbyk/ZVtvXTp2b2lkIDB9dmFyIGlpPXNpLG5pPWplLGFpPU9iamVjdC5wcm90b3R5cGUsbGk9YWkuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gY2kobyl7dmFyIGU9dGhpcy5fX2RhdGFfXztyZXR1cm4gbmk/ZVtvXSE9PXZvaWQgMDpsaS5jYWxsKGUsbyl9dmFyIHVpPWNpLGhpPWplLGRpPSJfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fIjtmdW5jdGlvbiBmaShvLGUpe3ZhciB0PXRoaXMuX19kYXRhX187cmV0dXJuIHRoaXMuc2l6ZSs9dGhpcy5oYXMobyk/MDoxLHRbb109aGkmJmU9PT12b2lkIDA/ZGk6ZSx0aGlzfXZhciBwaT1maSx5aT1Kcyx3aT1WcyxtaT1paSxnaT11aSxiaT1waTtmdW5jdGlvbiBiZShvKXt2YXIgZT0tMSx0PW89PW51bGw/MDpvLmxlbmd0aDtmb3IodGhpcy5jbGVhcigpOysrZTx0Oyl7dmFyIHI9b1tlXTt0aGlzLnNldChyWzBdLHJbMV0pfX1iZS5wcm90b3R5cGUuY2xlYXI9eWksYmUucHJvdG90eXBlLmRlbGV0ZT13aSxiZS5wcm90b3R5cGUuZ2V0PW1pLGJlLnByb3RvdHlwZS5oYXM9Z2ksYmUucHJvdG90eXBlLnNldD1iaTt2YXIgdmk9YmUsTnQ9dmksU2k9JGUsa2k9dHQ7ZnVuY3Rpb24gUGkoKXt0aGlzLnNpemU9MCx0aGlzLl9fZGF0YV9fPXtoYXNoOm5ldyBOdCxtYXA6bmV3KGtpfHxTaSksc3RyaW5nOm5ldyBOdH19dmFyIFRpPVBpO2Z1bmN0aW9uIElpKG8pe3ZhciBlPXR5cGVvZiBvO3JldHVybiBlPT0ic3RyaW5nInx8ZT09Im51bWJlciJ8fGU9PSJzeW1ib2wifHxlPT0iYm9vbGVhbiI/byE9PSJfX3Byb3RvX18iOm89PT1udWxsfXZhciB4aT1JaSxPaT14aTtmdW5jdGlvbiBMaShvLGUpe3ZhciB0PW8uX19kYXRhX187cmV0dXJuIE9pKGUpP3RbdHlwZW9mIGU9PSJzdHJpbmciPyJzdHJpbmciOiJoYXNoIl06dC5tYXB9dmFyIEZlPUxpLENpPUZlO2Z1bmN0aW9uIE5pKG8pe3ZhciBlPUNpKHRoaXMsbykuZGVsZXRlKG8pO3JldHVybiB0aGlzLnNpemUtPWU/MTowLGV9dmFyIFdpPU5pLFJpPUZlO2Z1bmN0aW9uIEFpKG8pe3JldHVybiBSaSh0aGlzLG8pLmdldChvKX12YXIgTWk9QWksJGk9RmU7ZnVuY3Rpb24gRGkobyl7cmV0dXJuICRpKHRoaXMsbykuaGFzKG8pfXZhciBqaT1EaSxGaT1GZTtmdW5jdGlvbiBCaShvLGUpe3ZhciB0PUZpKHRoaXMsbykscj10LnNpemU7cmV0dXJuIHQuc2V0KG8sZSksdGhpcy5zaXplKz10LnNpemU9PXI/MDoxLHRoaXN9dmFyIF9pPUJpLEVpPVRpLHppPVdpLFVpPU1pLEdpPWppLFhpPV9pO2Z1bmN0aW9uIHZlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLmNsZWFyKCk7KytlPHQ7KXt2YXIgcj1vW2VdO3RoaXMuc2V0KHJbMF0sclsxXSl9fXZlLnByb3RvdHlwZS5jbGVhcj1FaSx2ZS5wcm90b3R5cGUuZGVsZXRlPXppLHZlLnByb3RvdHlwZS5nZXQ9VWksdmUucHJvdG90eXBlLmhhcz1HaSx2ZS5wcm90b3R5cGUuc2V0PVhpO3ZhciBXdD12ZSxIaT0kZSxZaT10dCxxaT1XdCxaaT0yMDA7ZnVuY3Rpb24gUWkobyxlKXt2YXIgdD10aGlzLl9fZGF0YV9fO2lmKHQgaW5zdGFuY2VvZiBIaSl7dmFyIHI9dC5fX2RhdGFfXztpZighWWl8fHIubGVuZ3RoPFppLTEpcmV0dXJuIHIucHVzaChbbyxlXSksdGhpcy5zaXplPSsrdC5zaXplLHRoaXM7dD10aGlzLl9fZGF0YV9fPW5ldyBxaShyKX1yZXR1cm4gdC5zZXQobyxlKSx0aGlzLnNpemU9dC5zaXplLHRoaXN9dmFyIEppPVFpLEtpPSRlLFZpPUJvLGVuPUVvLHRuPVVvLHJuPVhvLG9uPUppO2Z1bmN0aW9uIFNlKG8pe3ZhciBlPXRoaXMuX19kYXRhX189bmV3IEtpKG8pO3RoaXMuc2l6ZT1lLnNpemV9U2UucHJvdG90eXBlLmNsZWFyPVZpLFNlLnByb3RvdHlwZS5kZWxldGU9ZW4sU2UucHJvdG90eXBlLmdldD10bixTZS5wcm90b3R5cGUuaGFzPXJuLFNlLnByb3RvdHlwZS5zZXQ9b247dmFyIFJ0PVNlO2Z1bmN0aW9uIHNuKG8sZSl7Zm9yKHZhciB0PS0xLHI9bz09bnVsbD8wOm8ubGVuZ3RoOysrdDxyJiZlKG9bdF0sdCxvKSE9PSExOyk7cmV0dXJuIG99dmFyIG5uPXNuLGFuPXBlLGxuPWZ1bmN0aW9uKCl7dHJ5e3ZhciBvPWFuKE9iamVjdCwiZGVmaW5lUHJvcGVydHkiKTtyZXR1cm4gbyh7fSwiIix7fSksb31jYXRjaHt9fSgpLGNuPWxuLEF0PWNuO2Z1bmN0aW9uIHVuKG8sZSx0KXtlPT0iX19wcm90b19fIiYmQXQ/QXQobyxlLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx2YWx1ZTp0LHdyaXRhYmxlOiEwfSk6b1tlXT10fXZhciBNdD11bixobj1NdCxkbj1WZSxmbj1PYmplY3QucHJvdG90eXBlLHBuPWZuLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIHluKG8sZSx0KXt2YXIgcj1vW2VdOyghKHBuLmNhbGwobyxlKSYmZG4ocix0KSl8fHQ9PT12b2lkIDAmJiEoZSBpbiBvKSkmJmhuKG8sZSx0KX12YXIgJHQ9eW4sd249JHQsbW49TXQ7ZnVuY3Rpb24gZ24obyxlLHQscil7dmFyIGk9IXQ7dHx8KHQ9e30pO2Zvcih2YXIgcz0tMSxuPWUubGVuZ3RoOysrczxuOyl7dmFyIGE9ZVtzXSxsPXI/cih0W2FdLG9bYV0sYSx0LG8pOnZvaWQgMDtsPT09dm9pZCAwJiYobD1vW2FdKSxpP21uKHQsYSxsKTp3bih0LGEsbCl9cmV0dXJuIHR9dmFyIEJlPWduO2Z1bmN0aW9uIGJuKG8sZSl7Zm9yKHZhciB0PS0xLHI9QXJyYXkobyk7Kyt0PG87KXJbdF09ZSh0KTtyZXR1cm4gcn12YXIgdm49Ym47ZnVuY3Rpb24gU24obyl7cmV0dXJuIG8hPW51bGwmJnR5cGVvZiBvPT0ib2JqZWN0In12YXIgY2U9U24sa249ZmUsUG49Y2UsVG49IltvYmplY3QgQXJndW1lbnRzXSI7ZnVuY3Rpb24gSW4obyl7cmV0dXJuIFBuKG8pJiZrbihvKT09VG59dmFyIHhuPUluLER0PXhuLE9uPWNlLGp0PU9iamVjdC5wcm90b3R5cGUsTG49anQuaGFzT3duUHJvcGVydHksQ249anQucHJvcGVydHlJc0VudW1lcmFibGUsTm49RHQoZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzfSgpKT9EdDpmdW5jdGlvbihvKXtyZXR1cm4gT24obykmJkxuLmNhbGwobywiY2FsbGVlIikmJiFDbi5jYWxsKG8sImNhbGxlZSIpfSxXbj1ObixSbj1BcnJheS5pc0FycmF5LF9lPVJuLEVlPXtleHBvcnRzOnt9fTtmdW5jdGlvbiBBbigpe3JldHVybiExfXZhciBNbj1BbjtFZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9aWUscj1NbixpPWUmJiFlLm5vZGVUeXBlJiZlLHM9aSYmITAmJm8mJiFvLm5vZGVUeXBlJiZvLG49cyYmcy5leHBvcnRzPT09aSxhPW4/dC5CdWZmZXI6dm9pZCAwLGw9YT9hLmlzQnVmZmVyOnZvaWQgMCxjPWx8fHI7by5leHBvcnRzPWN9KEVlLEVlLmV4cG9ydHMpO3ZhciBydD1FZS5leHBvcnRzLCRuPTkwMDcxOTkyNTQ3NDA5OTEsRG49L14oPzowfFsxLTldXGQqKSQvO2Z1bmN0aW9uIGpuKG8sZSl7dmFyIHQ9dHlwZW9mIG87cmV0dXJuIGU9ZT8/JG4sISFlJiYodD09Im51bWJlciJ8fHQhPSJzeW1ib2wiJiZEbi50ZXN0KG8pKSYmbz4tMSYmbyUxPT0wJiZvPGV9dmFyIEZuPWpuLEJuPTkwMDcxOTkyNTQ3NDA5OTE7ZnVuY3Rpb24gX24obyl7cmV0dXJuIHR5cGVvZiBvPT0ibnVtYmVyIiYmbz4tMSYmbyUxPT0wJiZvPD1Cbn12YXIgRnQ9X24sRW49ZmUsem49RnQsVW49Y2UsR249IltvYmplY3QgQXJndW1lbnRzXSIsWG49IltvYmplY3QgQXJyYXldIixIbj0iW29iamVjdCBCb29sZWFuXSIsWW49IltvYmplY3QgRGF0ZV0iLHFuPSJbb2JqZWN0IEVycm9yXSIsWm49IltvYmplY3QgRnVuY3Rpb25dIixRbj0iW29iamVjdCBNYXBdIixKbj0iW29iamVjdCBOdW1iZXJdIixLbj0iW29iamVjdCBPYmplY3RdIixWbj0iW29iamVjdCBSZWdFeHBdIixlYT0iW29iamVjdCBTZXRdIix0YT0iW29iamVjdCBTdHJpbmddIixyYT0iW29iamVjdCBXZWFrTWFwXSIsb2E9IltvYmplY3QgQXJyYXlCdWZmZXJdIixzYT0iW29iamVjdCBEYXRhVmlld10iLGlhPSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG5hPSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLGFhPSJbb2JqZWN0IEludDhBcnJheV0iLGxhPSJbb2JqZWN0IEludDE2QXJyYXldIixjYT0iW29iamVjdCBJbnQzMkFycmF5XSIsdWE9IltvYmplY3QgVWludDhBcnJheV0iLGhhPSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsZGE9IltvYmplY3QgVWludDE2QXJyYXldIixmYT0iW29iamVjdCBVaW50MzJBcnJheV0iLFg9e307WFtpYV09WFtuYV09WFthYV09WFtsYV09WFtjYV09WFt1YV09WFtoYV09WFtkYV09WFtmYV09ITAsWFtHbl09WFtYbl09WFtvYV09WFtIbl09WFtzYV09WFtZbl09WFtxbl09WFtabl09WFtRbl09WFtKbl09WFtLbl09WFtWbl09WFtlYV09WFt0YV09WFtyYV09ITE7ZnVuY3Rpb24gcGEobyl7cmV0dXJuIFVuKG8pJiZ6bihvLmxlbmd0aCkmJiEhWFtFbihvKV19dmFyIHlhPXBhO2Z1bmN0aW9uIHdhKG8pe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbyhlKX19dmFyIG90PXdhLHplPXtleHBvcnRzOnt9fTt6ZS5leHBvcnRzLGZ1bmN0aW9uKG8sZSl7dmFyIHQ9U3Qscj1lJiYhZS5ub2RlVHlwZSYmZSxpPXImJiEwJiZvJiYhby5ub2RlVHlwZSYmbyxzPWkmJmkuZXhwb3J0cz09PXIsbj1zJiZ0LnByb2Nlc3MsYT1mdW5jdGlvbigpe3RyeXt2YXIgbD1pJiZpLnJlcXVpcmUmJmkucmVxdWlyZSgidXRpbCIpLnR5cGVzO3JldHVybiBsfHxuJiZuLmJpbmRpbmcmJm4uYmluZGluZygidXRpbCIpfWNhdGNoe319KCk7by5leHBvcnRzPWF9KHplLHplLmV4cG9ydHMpO3ZhciBzdD16ZS5leHBvcnRzLG1hPXlhLGdhPW90LEJ0PXN0LF90PUJ0JiZCdC5pc1R5cGVkQXJyYXksYmE9X3Q/Z2EoX3QpOm1hLEV0PWJhLHZhPXZuLFNhPVduLGthPV9lLFBhPXJ0LFRhPUZuLElhPUV0LHhhPU9iamVjdC5wcm90b3R5cGUsT2E9eGEuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gTGEobyxlKXt2YXIgdD1rYShvKSxyPSF0JiZTYShvKSxpPSF0JiYhciYmUGEobykscz0hdCYmIXImJiFpJiZJYShvKSxuPXR8fHJ8fGl8fHMsYT1uP3ZhKG8ubGVuZ3RoLFN0cmluZyk6W10sbD1hLmxlbmd0aDtmb3IodmFyIGMgaW4gbykoZXx8T2EuY2FsbChvLGMpKSYmIShuJiYoYz09Imxlbmd0aCJ8fGkmJihjPT0ib2Zmc2V0Inx8Yz09InBhcmVudCIpfHxzJiYoYz09ImJ1ZmZlciJ8fGM9PSJieXRlTGVuZ3RoInx8Yz09ImJ5dGVPZmZzZXQiKXx8VGEoYyxsKSkpJiZhLnB1c2goYyk7cmV0dXJuIGF9dmFyIHp0PUxhLENhPU9iamVjdC5wcm90b3R5cGU7ZnVuY3Rpb24gTmEobyl7dmFyIGU9byYmby5jb25zdHJ1Y3Rvcix0PXR5cGVvZiBlPT0iZnVuY3Rpb24iJiZlLnByb3RvdHlwZXx8Q2E7cmV0dXJuIG89PT10fXZhciBpdD1OYTtmdW5jdGlvbiBXYShvLGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbyhlKHQpKX19dmFyIFV0PVdhLFJhPVV0LEFhPVJhKE9iamVjdC5rZXlzLE9iamVjdCksTWE9QWEsJGE9aXQsRGE9TWEsamE9T2JqZWN0LnByb3RvdHlwZSxGYT1qYS5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBCYShvKXtpZighJGEobykpcmV0dXJuIERhKG8pO3ZhciBlPVtdO2Zvcih2YXIgdCBpbiBPYmplY3QobykpRmEuY2FsbChvLHQpJiZ0IT0iY29uc3RydWN0b3IiJiZlLnB1c2godCk7cmV0dXJuIGV9dmFyIF9hPUJhLEVhPXh0LHphPUZ0O2Z1bmN0aW9uIFVhKG8pe3JldHVybiBvIT1udWxsJiZ6YShvLmxlbmd0aCkmJiFFYShvKX12YXIgR3Q9VWEsR2E9enQsWGE9X2EsSGE9R3Q7ZnVuY3Rpb24gWWEobyl7cmV0dXJuIEhhKG8pP0dhKG8pOlhhKG8pfXZhciBudD1ZYSxxYT1CZSxaYT1udDtmdW5jdGlvbiBRYShvLGUpe3JldHVybiBvJiZxYShlLFphKGUpLG8pfXZhciBKYT1RYTtmdW5jdGlvbiBLYShvKXt2YXIgZT1bXTtpZihvIT1udWxsKWZvcih2YXIgdCBpbiBPYmplY3QobykpZS5wdXNoKHQpO3JldHVybiBlfXZhciBWYT1LYSxlbD11ZSx0bD1pdCxybD1WYSxvbD1PYmplY3QucHJvdG90eXBlLHNsPW9sLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIGlsKG8pe2lmKCFlbChvKSlyZXR1cm4gcmwobyk7dmFyIGU9dGwobyksdD1bXTtmb3IodmFyIHIgaW4gbylyPT0iY29uc3RydWN0b3IiJiYoZXx8IXNsLmNhbGwobyxyKSl8fHQucHVzaChyKTtyZXR1cm4gdH12YXIgbmw9aWwsYWw9enQsbGw9bmwsY2w9R3Q7ZnVuY3Rpb24gdWwobyl7cmV0dXJuIGNsKG8pP2FsKG8sITApOmxsKG8pfXZhciBhdD11bCxobD1CZSxkbD1hdDtmdW5jdGlvbiBmbChvLGUpe3JldHVybiBvJiZobChlLGRsKGUpLG8pfXZhciBwbD1mbCxVZT17ZXhwb3J0czp7fX07VWUuZXhwb3J0cyxmdW5jdGlvbihvLGUpe3ZhciB0PWllLHI9ZSYmIWUubm9kZVR5cGUmJmUsaT1yJiYhMCYmbyYmIW8ubm9kZVR5cGUmJm8scz1pJiZpLmV4cG9ydHM9PT1yLG49cz90LkJ1ZmZlcjp2b2lkIDAsYT1uP24uYWxsb2NVbnNhZmU6dm9pZCAwO2Z1bmN0aW9uIGwoYyx1KXtpZih1KXJldHVybiBjLnNsaWNlKCk7dmFyIGg9Yy5sZW5ndGgsZD1hP2EoaCk6bmV3IGMuY29uc3RydWN0b3IoaCk7cmV0dXJuIGMuY29weShkKSxkfW8uZXhwb3J0cz1sfShVZSxVZS5leHBvcnRzKTt2YXIgeWw9VWUuZXhwb3J0cztmdW5jdGlvbiB3bChvLGUpe3ZhciB0PS0xLHI9by5sZW5ndGg7Zm9yKGV8fChlPUFycmF5KHIpKTsrK3Q8cjspZVt0XT1vW3RdO3JldHVybiBlfXZhciBtbD13bDtmdW5jdGlvbiBnbChvLGUpe2Zvcih2YXIgdD0tMSxyPW89PW51bGw/MDpvLmxlbmd0aCxpPTAscz1bXTsrK3Q8cjspe3ZhciBuPW9bdF07ZShuLHQsbykmJihzW2krK109bil9cmV0dXJuIHN9dmFyIGJsPWdsO2Z1bmN0aW9uIHZsKCl7cmV0dXJuW119dmFyIFh0PXZsLFNsPWJsLGtsPVh0LFBsPU9iamVjdC5wcm90b3R5cGUsVGw9UGwucHJvcGVydHlJc0VudW1lcmFibGUsSHQ9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxJbD1IdD9mdW5jdGlvbihvKXtyZXR1cm4gbz09bnVsbD9bXToobz1PYmplY3QobyksU2woSHQobyksZnVuY3Rpb24oZSl7cmV0dXJuIFRsLmNhbGwobyxlKX0pKX06a2wsbHQ9SWwseGw9QmUsT2w9bHQ7ZnVuY3Rpb24gTGwobyxlKXtyZXR1cm4geGwobyxPbChvKSxlKX12YXIgQ2w9TGw7ZnVuY3Rpb24gTmwobyxlKXtmb3IodmFyIHQ9LTEscj1lLmxlbmd0aCxpPW8ubGVuZ3RoOysrdDxyOylvW2krdF09ZVt0XTtyZXR1cm4gb312YXIgWXQ9TmwsV2w9VXQsUmw9V2woT2JqZWN0LmdldFByb3RvdHlwZU9mLE9iamVjdCkscXQ9UmwsQWw9WXQsTWw9cXQsJGw9bHQsRGw9WHQsamw9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxGbD1qbD9mdW5jdGlvbihvKXtmb3IodmFyIGU9W107bzspQWwoZSwkbChvKSksbz1NbChvKTtyZXR1cm4gZX06RGwsWnQ9RmwsQmw9QmUsX2w9WnQ7ZnVuY3Rpb24gRWwobyxlKXtyZXR1cm4gQmwobyxfbChvKSxlKX12YXIgemw9RWwsVWw9WXQsR2w9X2U7ZnVuY3Rpb24gWGwobyxlLHQpe3ZhciByPWUobyk7cmV0dXJuIEdsKG8pP3I6VWwocix0KG8pKX12YXIgUXQ9WGwsSGw9UXQsWWw9bHQscWw9bnQ7ZnVuY3Rpb24gWmwobyl7cmV0dXJuIEhsKG8scWwsWWwpfXZhciBKdD1abCxRbD1RdCxKbD1adCxLbD1hdDtmdW5jdGlvbiBWbChvKXtyZXR1cm4gUWwobyxLbCxKbCl9dmFyIGVjPVZsLHRjPXBlLHJjPWllLG9jPXRjKHJjLCJEYXRhVmlldyIpLHNjPW9jLGljPXBlLG5jPWllLGFjPWljKG5jLCJQcm9taXNlIiksbGM9YWMsY2M9cGUsdWM9aWUsaGM9Y2ModWMsIlNldCIpLGRjPWhjLGZjPXBlLHBjPWllLHljPWZjKHBjLCJXZWFrTWFwIiksd2M9eWMsY3Q9c2MsdXQ9dHQsaHQ9bGMsZHQ9ZGMsZnQ9d2MsS3Q9ZmUsa2U9THQsVnQ9IltvYmplY3QgTWFwXSIsbWM9IltvYmplY3QgT2JqZWN0XSIsZXI9IltvYmplY3QgUHJvbWlzZV0iLHRyPSJbb2JqZWN0IFNldF0iLHJyPSJbb2JqZWN0IFdlYWtNYXBdIixvcj0iW29iamVjdCBEYXRhVmlld10iLGdjPWtlKGN0KSxiYz1rZSh1dCksdmM9a2UoaHQpLFNjPWtlKGR0KSxrYz1rZShmdCkseWU9S3Q7KGN0JiZ5ZShuZXcgY3QobmV3IEFycmF5QnVmZmVyKDEpKSkhPW9yfHx1dCYmeWUobmV3IHV0KSE9VnR8fGh0JiZ5ZShodC5yZXNvbHZlKCkpIT1lcnx8ZHQmJnllKG5ldyBkdCkhPXRyfHxmdCYmeWUobmV3IGZ0KSE9cnIpJiYoeWU9ZnVuY3Rpb24obyl7dmFyIGU9S3QobyksdD1lPT1tYz9vLmNvbnN0cnVjdG9yOnZvaWQgMCxyPXQ/a2UodCk6IiI7aWYocilzd2l0Y2gocil7Y2FzZSBnYzpyZXR1cm4gb3I7Y2FzZSBiYzpyZXR1cm4gVnQ7Y2FzZSB2YzpyZXR1cm4gZXI7Y2FzZSBTYzpyZXR1cm4gdHI7Y2FzZSBrYzpyZXR1cm4gcnJ9cmV0dXJuIGV9KTt2YXIgR2U9eWUsUGM9T2JqZWN0LnByb3RvdHlwZSxUYz1QYy5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBJYyhvKXt2YXIgZT1vLmxlbmd0aCx0PW5ldyBvLmNvbnN0cnVjdG9yKGUpO3JldHVybiBlJiZ0eXBlb2Ygb1swXT09InN0cmluZyImJlRjLmNhbGwobywiaW5kZXgiKSYmKHQuaW5kZXg9by5pbmRleCx0LmlucHV0PW8uaW5wdXQpLHR9dmFyIHhjPUljLE9jPWllLExjPU9jLlVpbnQ4QXJyYXksc3I9TGMsaXI9c3I7ZnVuY3Rpb24gQ2Mobyl7dmFyIGU9bmV3IG8uY29uc3RydWN0b3Ioby5ieXRlTGVuZ3RoKTtyZXR1cm4gbmV3IGlyKGUpLnNldChuZXcgaXIobykpLGV9dmFyIHB0PUNjLE5jPXB0O2Z1bmN0aW9uIFdjKG8sZSl7dmFyIHQ9ZT9OYyhvLmJ1ZmZlcik6by5idWZmZXI7cmV0dXJuIG5ldyBvLmNvbnN0cnVjdG9yKHQsby5ieXRlT2Zmc2V0LG8uYnl0ZUxlbmd0aCl9dmFyIFJjPVdjLEFjPS9cdyokLztmdW5jdGlvbiBNYyhvKXt2YXIgZT1uZXcgby5jb25zdHJ1Y3RvcihvLnNvdXJjZSxBYy5leGVjKG8pKTtyZXR1cm4gZS5sYXN0SW5kZXg9by5sYXN0SW5kZXgsZX12YXIgJGM9TWMsbnI9RGUsYXI9bnI/bnIucHJvdG90eXBlOnZvaWQgMCxscj1hcj9hci52YWx1ZU9mOnZvaWQgMDtmdW5jdGlvbiBEYyhvKXtyZXR1cm4gbHI/T2JqZWN0KGxyLmNhbGwobykpOnt9fXZhciBqYz1EYyxGYz1wdDtmdW5jdGlvbiBCYyhvLGUpe3ZhciB0PWU/RmMoby5idWZmZXIpOm8uYnVmZmVyO3JldHVybiBuZXcgby5jb25zdHJ1Y3Rvcih0LG8uYnl0ZU9mZnNldCxvLmxlbmd0aCl9dmFyIF9jPUJjLEVjPXB0LHpjPVJjLFVjPSRjLEdjPWpjLFhjPV9jLEhjPSJbb2JqZWN0IEJvb2xlYW5dIixZYz0iW29iamVjdCBEYXRlXSIscWM9IltvYmplY3QgTWFwXSIsWmM9IltvYmplY3QgTnVtYmVyXSIsUWM9IltvYmplY3QgUmVnRXhwXSIsSmM9IltvYmplY3QgU2V0XSIsS2M9IltvYmplY3QgU3RyaW5nXSIsVmM9IltvYmplY3QgU3ltYm9sXSIsZXU9IltvYmplY3QgQXJyYXlCdWZmZXJdIix0dT0iW29iamVjdCBEYXRhVmlld10iLHJ1PSJbb2JqZWN0IEZsb2F0MzJBcnJheV0iLG91PSJbb2JqZWN0IEZsb2F0NjRBcnJheV0iLHN1PSJbb2JqZWN0IEludDhBcnJheV0iLGl1PSJbb2JqZWN0IEludDE2QXJyYXldIixudT0iW29iamVjdCBJbnQzMkFycmF5XSIsYXU9IltvYmplY3QgVWludDhBcnJheV0iLGx1PSJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSIsY3U9IltvYmplY3QgVWludDE2QXJyYXldIix1dT0iW29iamVjdCBVaW50MzJBcnJheV0iO2Z1bmN0aW9uIGh1KG8sZSx0KXt2YXIgcj1vLmNvbnN0cnVjdG9yO3N3aXRjaChlKXtjYXNlIGV1OnJldHVybiBFYyhvKTtjYXNlIEhjOmNhc2UgWWM6cmV0dXJuIG5ldyByKCtvKTtjYXNlIHR1OnJldHVybiB6YyhvLHQpO2Nhc2UgcnU6Y2FzZSBvdTpjYXNlIHN1OmNhc2UgaXU6Y2FzZSBudTpjYXNlIGF1OmNhc2UgbHU6Y2FzZSBjdTpjYXNlIHV1OnJldHVybiBYYyhvLHQpO2Nhc2UgcWM6cmV0dXJuIG5ldyByO2Nhc2UgWmM6Y2FzZSBLYzpyZXR1cm4gbmV3IHIobyk7Y2FzZSBRYzpyZXR1cm4gVWMobyk7Y2FzZSBKYzpyZXR1cm4gbmV3IHI7Y2FzZSBWYzpyZXR1cm4gR2Mobyl9fXZhciBkdT1odSxmdT11ZSxjcj1PYmplY3QuY3JlYXRlLHB1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbygpe31yZXR1cm4gZnVuY3Rpb24oZSl7aWYoIWZ1KGUpKXJldHVybnt9O2lmKGNyKXJldHVybiBjcihlKTtvLnByb3RvdHlwZT1lO3ZhciB0PW5ldyBvO3JldHVybiBvLnByb3RvdHlwZT12b2lkIDAsdH19KCkseXU9cHUsd3U9eXUsbXU9cXQsZ3U9aXQ7ZnVuY3Rpb24gYnUobyl7cmV0dXJuIHR5cGVvZiBvLmNvbnN0cnVjdG9yPT0iZnVuY3Rpb24iJiYhZ3Uobyk/d3UobXUobykpOnt9fXZhciB2dT1idSxTdT1HZSxrdT1jZSxQdT0iW29iamVjdCBNYXBdIjtmdW5jdGlvbiBUdShvKXtyZXR1cm4ga3UobykmJlN1KG8pPT1QdX12YXIgSXU9VHUseHU9SXUsT3U9b3QsdXI9c3QsaHI9dXImJnVyLmlzTWFwLEx1PWhyP091KGhyKTp4dSxDdT1MdSxOdT1HZSxXdT1jZSxSdT0iW29iamVjdCBTZXRdIjtmdW5jdGlvbiBBdShvKXtyZXR1cm4gV3UobykmJk51KG8pPT1SdX12YXIgTXU9QXUsJHU9TXUsRHU9b3QsZHI9c3QsZnI9ZHImJmRyLmlzU2V0LGp1PWZyP0R1KGZyKTokdSxGdT1qdSxCdT1SdCxfdT1ubixFdT0kdCx6dT1KYSxVdT1wbCxHdT15bCxYdT1tbCxIdT1DbCxZdT16bCxxdT1KdCxadT1lYyxRdT1HZSxKdT14YyxLdT1kdSxWdT12dSxlaD1fZSx0aD1ydCxyaD1DdSxvaD11ZSxzaD1GdSxpaD1udCxuaD1hdCxhaD0xLGxoPTIsY2g9NCxwcj0iW29iamVjdCBBcmd1bWVudHNdIix1aD0iW29iamVjdCBBcnJheV0iLGhoPSJbb2JqZWN0IEJvb2xlYW5dIixkaD0iW29iamVjdCBEYXRlXSIsZmg9IltvYmplY3QgRXJyb3JdIix5cj0iW29iamVjdCBGdW5jdGlvbl0iLHBoPSJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSIseWg9IltvYmplY3QgTWFwXSIsd2g9IltvYmplY3QgTnVtYmVyXSIsd3I9IltvYmplY3QgT2JqZWN0XSIsbWg9IltvYmplY3QgUmVnRXhwXSIsZ2g9IltvYmplY3QgU2V0XSIsYmg9IltvYmplY3QgU3RyaW5nXSIsdmg9IltvYmplY3QgU3ltYm9sXSIsU2g9IltvYmplY3QgV2Vha01hcF0iLGtoPSJbb2JqZWN0IEFycmF5QnVmZmVyXSIsUGg9IltvYmplY3QgRGF0YVZpZXddIixUaD0iW29iamVjdCBGbG9hdDMyQXJyYXldIixJaD0iW29iamVjdCBGbG9hdDY0QXJyYXldIix4aD0iW29iamVjdCBJbnQ4QXJyYXldIixPaD0iW29iamVjdCBJbnQxNkFycmF5XSIsTGg9IltvYmplY3QgSW50MzJBcnJheV0iLENoPSJbb2JqZWN0IFVpbnQ4QXJyYXldIixOaD0iW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0iLFdoPSJbb2JqZWN0IFVpbnQxNkFycmF5XSIsUmg9IltvYmplY3QgVWludDMyQXJyYXldIixVPXt9O1VbcHJdPVVbdWhdPVVba2hdPVVbUGhdPVVbaGhdPVVbZGhdPVVbVGhdPVVbSWhdPVVbeGhdPVVbT2hdPVVbTGhdPVVbeWhdPVVbd2hdPVVbd3JdPVVbbWhdPVVbZ2hdPVVbYmhdPVVbdmhdPVVbQ2hdPVVbTmhdPVVbV2hdPVVbUmhdPSEwLFVbZmhdPVVbeXJdPVVbU2hdPSExO2Z1bmN0aW9uIFhlKG8sZSx0LHIsaSxzKXt2YXIgbixhPWUmYWgsbD1lJmxoLGM9ZSZjaDtpZih0JiYobj1pP3QobyxyLGkscyk6dChvKSksbiE9PXZvaWQgMClyZXR1cm4gbjtpZighb2gobykpcmV0dXJuIG87dmFyIHU9ZWgobyk7aWYodSl7aWYobj1KdShvKSwhYSlyZXR1cm4gWHUobyxuKX1lbHNle3ZhciBoPVF1KG8pLGQ9aD09eXJ8fGg9PXBoO2lmKHRoKG8pKXJldHVybiBHdShvLGEpO2lmKGg9PXdyfHxoPT1wcnx8ZCYmIWkpe2lmKG49bHx8ZD97fTpWdShvKSwhYSlyZXR1cm4gbD9ZdShvLFV1KG4sbykpOkh1KG8senUobixvKSl9ZWxzZXtpZighVVtoXSlyZXR1cm4gaT9vOnt9O249S3UobyxoLGEpfX1zfHwocz1uZXcgQnUpO3ZhciBmPXMuZ2V0KG8pO2lmKGYpcmV0dXJuIGY7cy5zZXQobyxuKSxzaChvKT9vLmZvckVhY2goZnVuY3Rpb24oZyl7bi5hZGQoWGUoZyxlLHQsZyxvLHMpKX0pOnJoKG8pJiZvLmZvckVhY2goZnVuY3Rpb24oZyxQKXtuLnNldChQLFhlKGcsZSx0LFAsbyxzKSl9KTt2YXIgdz1jP2w/WnU6cXU6bD9uaDppaCx5PXU/dm9pZCAwOncobyk7cmV0dXJuIF91KHl8fG8sZnVuY3Rpb24oZyxQKXt5JiYoUD1nLGc9b1tQXSksRXUobixQLFhlKGcsZSx0LFAsbyxzKSl9KSxufXZhciBBaD1YZSxNaD1BaCwkaD0xLERoPTQ7ZnVuY3Rpb24gamgobyl7cmV0dXJuIE1oKG8sJGh8RGgpfXZhciBGaD1qaCxyZT1tZShGaCksbXI7KGZ1bmN0aW9uKG8pe29bby5wZWRkaW5nPTBdPSJwZWRkaW5nIixvW28ubW91bnRlZD0xXT0ibW91bnRlZCIsb1tvLnVwZGF0ZT0yXT0idXBkYXRlIixvW28udW5tb3VudGVkPTNdPSJ1bm1vdW50ZWQifSkobXJ8fChtcj17fSkpO3ZhciBROyhmdW5jdGlvbihvKXtvW28uTm9ybWFsPTBdPSJOb3JtYWwiLG9bby5TdHJva2U9MV09IlN0cm9rZSIsb1tvLkRvdHRlZD0yXT0iRG90dGVkIixvW28uTG9uZ0RvdHRlZD0zXT0iTG9uZ0RvdHRlZCJ9KShRfHwoUT17fSkpO3ZhciBncjsoZnVuY3Rpb24obyl7by5UcmlhbmdsZT0idHJpYW5nbGUiLG8uUmhvbWJ1cz0icmhvbWJ1cyIsby5QZW50YWdyYW09InBlbnRhZ3JhbSIsby5TcGVlY2hCYWxsb29uPSJzcGVlY2hCYWxsb29uIixvLlN0YXI9InN0YXIiLG8uUG9seWdvbj0icG9seWdvbiJ9KShncnx8KGdyPXt9KSk7dmFyIEI7KGZ1bmN0aW9uKG8pe28uTm9uZT0iTm9uZSIsby5TaG93RmxvYXRCYXI9IlNob3dGbG9hdEJhciIsby5aSW5kZXhGbG9hdEJhcj0iWkluZGV4RmxvYXRCYXIiLG8uRGVsZXRlTm9kZT0iRGVsZXRlTm9kZSIsby5Db3B5Tm9kZT0iQ29weU5vZGUiLG8uWkluZGV4QWN0aXZlPSJaSW5kZXhBY3RpdmUiLG8uWkluZGV4Tm9kZT0iWkluZGV4Tm9kZSIsby5Sb3RhdGVOb2RlPSJSb3RhdGVOb2RlIixvLlNldENvbG9yTm9kZT0iU2V0Q29sb3JOb2RlIixvLlRyYW5zbGF0ZU5vZGU9IlRyYW5zbGF0ZU5vZGUiLG8uU2NhbGVOb2RlPSJTY2FsZU5vZGUiLG8uT3JpZ2luYWxFdmVudD0iT3JpZ2luYWxFdmVudCIsby5DcmVhdGVTY2VuZT0iQ3JlYXRlU2NlbmUiLG8uQWN0aXZlQ3Vyc29yPSJBY3RpdmVDdXJzb3IiLG8uTW92ZUN1cnNvcj0iTW92ZUN1cnNvciIsby5Db21tYW5kRWRpdG9yPSJDb21tYW5kRWRpdG9yIixvLlNldEVkaXRvckRhdGE9IlNldEVkaXRvckRhdGEiLG8uU2V0Rm9udFN0eWxlPSJTZXRGb250U3R5bGUiLG8uU2V0UG9pbnQ9IlNldFBvaW50IixvLlNldExvY2s9IlNldExvY2siLG8uU2V0U2hhcGVPcHQ9IlNldFNoYXBlT3B0In0pKEJ8fChCPXt9KSk7dmFyIGJyOyhmdW5jdGlvbihvKXtvLkRpc3BsYXlTdGF0ZT0iRGlzcGxheVN0YXRlIixvLkZsb2F0QmFyPSJGbG9hdEJhciIsby5DYW52YXNTZWxlY3Rvcj0iQ2FudmFzU2VsZWN0b3IiLG8uTWFpbkVuZ2luZT0iTWFpbkVuZ2luZSIsby5EaXNwbGF5Q29udGFpbmVyPSJEaXNwbGF5Q29udGFpbmVyIixvLkN1cnNvcj0iQ3Vyc29yIixvLlRleHRFZGl0b3I9IlRleHRFZGl0b3IiLG8uQmluZE1haW5WaWV3PSJCaW5kTWFpblZpZXciLG8uTW91bnRNYWluVmlldz0iTW91bnRNYWluVmlldyIsby5Nb3VudEFwcFZpZXc9Ik1vdW50QXBwVmlldyJ9KShicnx8KGJyPXt9KSk7dmFyIHZyOyhmdW5jdGlvbihvKXtvW28uTWFpblZpZXc9MF09Ik1haW5WaWV3IixvW28uUGx1Z2luPTFdPSJQbHVnaW4iLG9bby5Cb3RoPTJdPSJCb3RoIn0pKHZyfHwodnI9e30pKTt2YXIgUzsoZnVuY3Rpb24obyl7b1tvLlBlbmNpbD0xXT0iUGVuY2lsIixvW28uRXJhc2VyPTJdPSJFcmFzZXIiLG9bby5TZWxlY3Rvcj0zXT0iU2VsZWN0b3IiLG9bby5DbGlja2VyPTRdPSJDbGlja2VyIixvW28uQXJyb3c9NV09IkFycm93IixvW28uSGFuZD02XT0iSGFuZCIsb1tvLkxhc2VyUGVuPTddPSJMYXNlclBlbiIsb1tvLlRleHQ9OF09IlRleHQiLG9bby5TdHJhaWdodD05XT0iU3RyYWlnaHQiLG9bby5SZWN0YW5nbGU9MTBdPSJSZWN0YW5nbGUiLG9bby5FbGxpcHNlPTExXT0iRWxsaXBzZSIsb1tvLlN0YXI9MTJdPSJTdGFyIixvW28uVHJpYW5nbGU9MTNdPSJUcmlhbmdsZSIsb1tvLlJob21idXM9MTRdPSJSaG9tYnVzIixvW28uUG9seWdvbj0xNV09IlBvbHlnb24iLG9bby5TcGVlY2hCYWxsb29uPTE2XT0iU3BlZWNoQmFsbG9vbiIsb1tvLkltYWdlPTE3XT0iSW1hZ2UifSkoU3x8KFM9e30pKTt2YXIgVzsoZnVuY3Rpb24obyl7b1tvLkxvY2FsPTFdPSJMb2NhbCIsb1tvLlNlcnZpY2U9Ml09IlNlcnZpY2UiLG9bby5Xb3JrZXI9M109IldvcmtlciJ9KShXfHwoVz17fSkpO3ZhciBGOyhmdW5jdGlvbihvKXtvW28uUGVuZGluZz0wXT0iUGVuZGluZyIsb1tvLlN0YXJ0PTFdPSJTdGFydCIsb1tvLkRvaW5nPTJdPSJEb2luZyIsb1tvLkRvbmU9M109IkRvbmUiLG9bby5GcmVlemU9NF09IkZyZWV6ZSIsb1tvLlVud3JpdGFibGU9NV09IlVud3JpdGFibGUifSkoRnx8KEY9e30pKTt2YXIgbTsoZnVuY3Rpb24obyl7b1tvLk5vbmU9MF09Ik5vbmUiLG9bby5Jbml0PTFdPSJJbml0IixvW28uVXBkYXRlQ2FtZXJhPTJdPSJVcGRhdGVDYW1lcmEiLG9bby5VcGRhdGVUb29scz0zXT0iVXBkYXRlVG9vbHMiLG9bby5DcmVhdGVXb3JrPTRdPSJDcmVhdGVXb3JrIixvW28uRHJhd1dvcms9NV09IkRyYXdXb3JrIixvW28uRnVsbFdvcms9Nl09IkZ1bGxXb3JrIixvW28uVXBkYXRlTm9kZT03XT0iVXBkYXRlTm9kZSIsb1tvLlJlbW92ZU5vZGU9OF09IlJlbW92ZU5vZGUiLG9bby5DbGVhcj05XT0iQ2xlYXIiLG9bby5TZWxlY3Q9MTBdPSJTZWxlY3QiLG9bby5EZXN0cm95PTExXT0iRGVzdHJveSIsb1tvLlNuYXBzaG90PTEyXT0iU25hcHNob3QiLG9bby5Cb3VuZGluZ0JveD0xM109IkJvdW5kaW5nQm94IixvW28uQ3Vyc29yPTE0XT0iQ3Vyc29yIixvW28uVGV4dFVwZGF0ZT0xNV09IlRleHRVcGRhdGUiLG9bby5HZXRUZXh0QWN0aXZlPTE2XT0iR2V0VGV4dEFjdGl2ZSIsb1tvLlRhc2tzUXVldWU9MTddPSJUYXNrc1F1ZXVlIixvW28uQ3Vyc29ySG92ZXI9MThdPSJDdXJzb3JIb3ZlciJ9KShtfHwobT17fSkpO3ZhciBTcjsoZnVuY3Rpb24obyl7by5XZWJnbDI9IndlYmdsMiIsby5XZWJnbD0id2ViZ2wiLG8uQ2FudmFzMmQ9IjJkIn0pKFNyfHwoU3I9e30pKTt2YXIgTjsoZnVuY3Rpb24obyl7b1tvLkZsb2F0PTFdPSJGbG9hdCIsb1tvLkJnPTJdPSJCZyIsb1tvLlNlbGVjdG9yPTNdPSJTZWxlY3RvciIsb1tvLlNlcnZpY2VGbG9hdD00XT0iU2VydmljZUZsb2F0IixvW28uTm9uZT01XT0iTm9uZSJ9KShOfHwoTj17fSkpO3ZhciBrcjsoZnVuY3Rpb24obyl7b1tvLkN1cnNvcj0xXT0iQ3Vyc29yIixvW28uVGV4dENyZWF0ZT0yXT0iVGV4dENyZWF0ZSJ9KShrcnx8KGtyPXt9KSk7dmFyIFByOyhmdW5jdGlvbihvKXtvW28uVG9wPTFdPSJUb3AiLG9bby5Cb3R0b209Ml09IkJvdHRvbSJ9KShQcnx8KFByPXt9KSk7dmFyIHE7KGZ1bmN0aW9uKG8pe29bby5ub25lPTFdPSJub25lIixvW28uYWxsPTJdPSJhbGwiLG9bby5ib3RoPTNdPSJib3RoIixvW28ucHJvcG9ydGlvbmFsPTRdPSJwcm9wb3J0aW9uYWwifSkocXx8KHE9e30pKTtjbGFzcyBvZXtjb25zdHJ1Y3Rvcigpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJsb2NhbFdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VydmljZVdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NlbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KX1yZWdpc3RlckZvcldvcmtlcihlLHQscil7cmV0dXJuIHRoaXMubG9jYWxXb3JrPWUsdGhpcy5zZXJ2aWNlV29yaz10LHRoaXMuc2NlbmU9cix0aGlzfX1jb25zdCBCaD17bGluZWFyOm89Pm8sZWFzZUluUXVhZDpvPT5vKm8sZWFzZU91dFF1YWQ6bz0+byooMi1vKSxlYXNlSW5PdXRRdWFkOm89Pm88LjU/MipvKm86LTErKDQtMipvKSpvLGVhc2VJbkN1YmljOm89Pm8qbypvLGVhc2VPdXRDdWJpYzpvPT4tLW8qbypvKzEsZWFzZUluT3V0Q3ViaWM6bz0+bzwuNT80Km8qbypvOihvLTEpKigyKm8tMikqKDIqby0yKSsxLGVhc2VJblF1YXJ0Om89Pm8qbypvKm8sZWFzZU91dFF1YXJ0Om89PjEtIC0tbypvKm8qbyxlYXNlSW5PdXRRdWFydDpvPT5vPC41PzgqbypvKm8qbzoxLTgqLS1vKm8qbypvLGVhc2VJblF1aW50Om89Pm8qbypvKm8qbyxlYXNlT3V0UXVpbnQ6bz0+MSstLW8qbypvKm8qbyxlYXNlSW5PdXRRdWludDpvPT5vPC41PzE2Km8qbypvKm8qbzoxKzE2Ki0tbypvKm8qbypvLGVhc2VJblNpbmU6bz0+MS1NYXRoLmNvcyhvKk1hdGguUEkvMiksZWFzZU91dFNpbmU6bz0+TWF0aC5zaW4obypNYXRoLlBJLzIpLGVhc2VJbk91dFNpbmU6bz0+LShNYXRoLmNvcyhNYXRoLlBJKm8pLTEpLzIsZWFzZUluRXhwbzpvPT5vPD0wPzA6TWF0aC5wb3coMiwxMCpvLTEwKSxlYXNlT3V0RXhwbzpvPT5vPj0xPzE6MS1NYXRoLnBvdygyLC0xMCpvKSxlYXNlSW5PdXRFeHBvOm89Pm88PTA/MDpvPj0xPzE6bzwuNT9NYXRoLnBvdygyLDIwKm8tMTApLzI6KDItTWF0aC5wb3coMiwtMjAqbysxMCkpLzJ9O2NsYXNzIHB7Y29uc3RydWN0b3IoZT0wLHQ9MCxyPTEpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ5Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ6Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cn0pfWdldCBYWSgpe3JldHVyblt0aGlzLngsdGhpcy55XX1zZXR6KGUpe3JldHVybiB0aGlzLno9ZSx0aGlzfXNldFhZKGU9dGhpcy54LHQ9dGhpcy55KXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpc31zZXQoZT10aGlzLngsdD10aGlzLnkscj10aGlzLnope3JldHVybiB0aGlzLng9ZSx0aGlzLnk9dCx0aGlzLno9cix0aGlzfXNldFRvKHt4OmU9MCx5OnQ9MCx6OnI9MX0pe3JldHVybiB0aGlzLng9ZSx0aGlzLnk9dCx0aGlzLno9cix0aGlzfXJvdChlKXtpZihlPT09MClyZXR1cm4gdGhpcztjb25zdHt4OnQseTpyfT10aGlzLGk9TWF0aC5zaW4oZSkscz1NYXRoLmNvcyhlKTtyZXR1cm4gdGhpcy54PXQqcy1yKmksdGhpcy55PXQqaStyKnMsdGhpc31yb3RXaXRoKGUsdCl7aWYodD09PTApcmV0dXJuIHRoaXM7Y29uc3Qgcj10aGlzLngtZS54LGk9dGhpcy55LWUueSxzPU1hdGguc2luKHQpLG49TWF0aC5jb3ModCk7cmV0dXJuIHRoaXMueD1lLngrKHIqbi1pKnMpLHRoaXMueT1lLnkrKHIqcytpKm4pLHRoaXN9Y2xvbmUoKXtjb25zdHt4OmUseTp0LHo6cn09dGhpcztyZXR1cm4gbmV3IHAoZSx0LHIpfXN1YihlKXtyZXR1cm4gdGhpcy54LT1lLngsdGhpcy55LT1lLnksdGhpc31zdWJYWShlLHQpe3JldHVybiB0aGlzLngtPWUsdGhpcy55LT10LHRoaXN9c3ViU2NhbGFyKGUpe3JldHVybiB0aGlzLngtPWUsdGhpcy55LT1lLHRoaXN9YWRkKGUpe3JldHVybiB0aGlzLngrPWUueCx0aGlzLnkrPWUueSx0aGlzfWFkZFhZKGUsdCl7cmV0dXJuIHRoaXMueCs9ZSx0aGlzLnkrPXQsdGhpc31hZGRTY2FsYXIoZSl7cmV0dXJuIHRoaXMueCs9ZSx0aGlzLnkrPWUsdGhpc31jbGFtcChlLHQpe3JldHVybiB0aGlzLng9TWF0aC5tYXgodGhpcy54LGUpLHRoaXMueT1NYXRoLm1heCh0aGlzLnksZSksdCE9PXZvaWQgMCYmKHRoaXMueD1NYXRoLm1pbih0aGlzLngsdCksdGhpcy55PU1hdGgubWluKHRoaXMueSx0KSksdGhpc31kaXYoZSl7cmV0dXJuIHRoaXMueC89ZSx0aGlzLnkvPWUsdGhpc31kaXZWKGUpe3JldHVybiB0aGlzLngvPWUueCx0aGlzLnkvPWUueSx0aGlzfW11bChlKXtyZXR1cm4gdGhpcy54Kj1lLHRoaXMueSo9ZSx0aGlzfW11bFYoZSl7cmV0dXJuIHRoaXMueCo9ZS54LHRoaXMueSo9ZS55LHRoaXN9YWJzKCl7cmV0dXJuIHRoaXMueD1NYXRoLmFicyh0aGlzLngpLHRoaXMueT1NYXRoLmFicyh0aGlzLnkpLHRoaXN9bnVkZ2UoZSx0KXtjb25zdCByPXAuVGFuKGUsdGhpcyk7cmV0dXJuIHRoaXMuYWRkKHIubXVsKHQpKX1uZWcoKXtyZXR1cm4gdGhpcy54Kj0tMSx0aGlzLnkqPS0xLHRoaXN9Y3Jvc3MoZSl7cmV0dXJuIHRoaXMueD10aGlzLnkqZS56LXRoaXMueiplLnksdGhpcy55PXRoaXMueiplLngtdGhpcy54KmUueix0aGlzfWRwcihlKXtyZXR1cm4gcC5EcHIodGhpcyxlKX1jcHIoZSl7cmV0dXJuIHAuQ3ByKHRoaXMsZSl9bGVuMigpe3JldHVybiBwLkxlbjIodGhpcyl9bGVuKCl7cmV0dXJuIHAuTGVuKHRoaXMpfXByeShlKXtyZXR1cm4gcC5QcnkodGhpcyxlKX1wZXIoKXtjb25zdHt4OmUseTp0fT10aGlzO3JldHVybiB0aGlzLng9dCx0aGlzLnk9LWUsdGhpc311bmkoKXtyZXR1cm4gcC5VbmkodGhpcyl9dGFuKGUpe3JldHVybiBwLlRhbih0aGlzLGUpfWRpc3QoZSl7cmV0dXJuIHAuRGlzdCh0aGlzLGUpfWRpc3RhbmNlVG9MaW5lU2VnbWVudChlLHQpe3JldHVybiBwLkRpc3RhbmNlVG9MaW5lU2VnbWVudChlLHQsdGhpcyl9c2xvcGUoZSl7cmV0dXJuIHAuU2xvcGUodGhpcyxlKX1zbmFwVG9HcmlkKGUpe3JldHVybiB0aGlzLng9TWF0aC5yb3VuZCh0aGlzLngvZSkqZSx0aGlzLnk9TWF0aC5yb3VuZCh0aGlzLnkvZSkqZSx0aGlzfWFuZ2xlKGUpe3JldHVybiBwLkFuZ2xlKHRoaXMsZSl9dG9BbmdsZSgpe3JldHVybiBwLlRvQW5nbGUodGhpcyl9bHJwKGUsdCl7cmV0dXJuIHRoaXMueD10aGlzLngrKGUueC10aGlzLngpKnQsdGhpcy55PXRoaXMueSsoZS55LXRoaXMueSkqdCx0aGlzfWVxdWFscyhlLHQpe3JldHVybiBwLkVxdWFscyh0aGlzLGUsdCl9ZXF1YWxzWFkoZSx0KXtyZXR1cm4gcC5FcXVhbHNYWSh0aGlzLGUsdCl9bm9ybSgpe2NvbnN0IGU9dGhpcy5sZW4oKTtyZXR1cm4gdGhpcy54PWU9PT0wPzA6dGhpcy54L2UsdGhpcy55PWU9PT0wPzA6dGhpcy55L2UsdGhpc310b0ZpeGVkKCl7cmV0dXJuIHAuVG9GaXhlZCh0aGlzKX10b1N0cmluZygpe3JldHVybiBwLlRvU3RyaW5nKHAuVG9GaXhlZCh0aGlzKSl9dG9Kc29uKCl7cmV0dXJuIHAuVG9Kc29uKHRoaXMpfXRvQXJyYXkoKXtyZXR1cm4gcC5Ub0FycmF5KHRoaXMpfXN0YXRpYyBBZGQoZSx0KXtyZXR1cm4gbmV3IHAoZS54K3QueCxlLnkrdC55KX1zdGF0aWMgQWRkWFkoZSx0LHIpe3JldHVybiBuZXcgcChlLngrdCxlLnkrcil9c3RhdGljIFN1YihlLHQpe3JldHVybiBuZXcgcChlLngtdC54LGUueS10LnkpfXN0YXRpYyBTdWJYWShlLHQscil7cmV0dXJuIG5ldyBwKGUueC10LGUueS1yKX1zdGF0aWMgQWRkU2NhbGFyKGUsdCl7cmV0dXJuIG5ldyBwKGUueCt0LGUueSt0KX1zdGF0aWMgU3ViU2NhbGFyKGUsdCl7cmV0dXJuIG5ldyBwKGUueC10LGUueS10KX1zdGF0aWMgRGl2KGUsdCl7cmV0dXJuIG5ldyBwKGUueC90LGUueS90KX1zdGF0aWMgTXVsKGUsdCl7cmV0dXJuIG5ldyBwKGUueCp0LGUueSp0KX1zdGF0aWMgRGl2VihlLHQpe3JldHVybiBuZXcgcChlLngvdC54LGUueS90LnkpfXN0YXRpYyBNdWxWKGUsdCl7cmV0dXJuIG5ldyBwKGUueCp0LngsZS55KnQueSl9c3RhdGljIE5lZyhlKXtyZXR1cm4gbmV3IHAoLWUueCwtZS55KX1zdGF0aWMgUGVyKGUpe3JldHVybiBuZXcgcChlLnksLWUueCl9c3RhdGljIERpc3QyKGUsdCl7cmV0dXJuIHAuU3ViKGUsdCkubGVuMigpfXN0YXRpYyBBYnMoZSl7cmV0dXJuIG5ldyBwKE1hdGguYWJzKGUueCksTWF0aC5hYnMoZS55KSl9c3RhdGljIERpc3QoZSx0KXtyZXR1cm4gTWF0aC5oeXBvdChlLnktdC55LGUueC10LngpfXN0YXRpYyBEcHIoZSx0KXtyZXR1cm4gZS54KnQueCtlLnkqdC55fXN0YXRpYyBDcm9zcyhlLHQpe3JldHVybiBuZXcgcChlLnkqdC56LWUueip0LnksZS56KnQueC1lLngqdC56KX1zdGF0aWMgQ3ByKGUsdCl7cmV0dXJuIGUueCp0LnktdC54KmUueX1zdGF0aWMgTGVuMihlKXtyZXR1cm4gZS54KmUueCtlLnkqZS55fXN0YXRpYyBMZW4oZSl7cmV0dXJuIE1hdGguaHlwb3QoZS54LGUueSl9c3RhdGljIFByeShlLHQpe3JldHVybiBwLkRwcihlLHQpL3AuTGVuKHQpfXN0YXRpYyBVbmkoZSl7cmV0dXJuIHAuRGl2KGUscC5MZW4oZSkpfXN0YXRpYyBUYW4oZSx0KXtyZXR1cm4gcC5VbmkocC5TdWIoZSx0KSl9c3RhdGljIE1pbihlLHQpe3JldHVybiBuZXcgcChNYXRoLm1pbihlLngsdC54KSxNYXRoLm1pbihlLnksdC55KSl9c3RhdGljIE1heChlLHQpe3JldHVybiBuZXcgcChNYXRoLm1heChlLngsdC54KSxNYXRoLm1heChlLnksdC55KSl9c3RhdGljIEZyb20oZSl7cmV0dXJuIG5ldyBwKCkuYWRkKGUpfXN0YXRpYyBGcm9tQXJyYXkoZSl7cmV0dXJuIG5ldyBwKGVbMF0sZVsxXSl9c3RhdGljIFJvdChlLHQ9MCl7Y29uc3Qgcj1NYXRoLnNpbih0KSxpPU1hdGguY29zKHQpO3JldHVybiBuZXcgcChlLngqaS1lLnkqcixlLngqcitlLnkqaSl9c3RhdGljIFJvdFdpdGgoZSx0LHIpe2NvbnN0IGk9ZS54LXQueCxzPWUueS10Lnksbj1NYXRoLnNpbihyKSxhPU1hdGguY29zKHIpO3JldHVybiBuZXcgcCh0LngrKGkqYS1zKm4pLHQueSsoaSpuK3MqYSkpfXN0YXRpYyBOZWFyZXN0UG9pbnRPbkxpbmVUaHJvdWdoUG9pbnQoZSx0LHIpe3JldHVybiBwLk11bCh0LHAuU3ViKHIsZSkucHJ5KHQpKS5hZGQoZSl9c3RhdGljIE5lYXJlc3RQb2ludE9uTGluZVNlZ21lbnQoZSx0LHIsaT0hMCl7Y29uc3Qgcz1wLlRhbih0LGUpLG49cC5BZGQoZSxwLk11bChzLHAuU3ViKHIsZSkucHJ5KHMpKSk7aWYoaSl7aWYobi54PE1hdGgubWluKGUueCx0LngpKXJldHVybiBwLkNhc3QoZS54PHQueD9lOnQpO2lmKG4ueD5NYXRoLm1heChlLngsdC54KSlyZXR1cm4gcC5DYXN0KGUueD50Lng/ZTp0KTtpZihuLnk8TWF0aC5taW4oZS55LHQueSkpcmV0dXJuIHAuQ2FzdChlLnk8dC55P2U6dCk7aWYobi55Pk1hdGgubWF4KGUueSx0LnkpKXJldHVybiBwLkNhc3QoZS55PnQueT9lOnQpfXJldHVybiBufXN0YXRpYyBEaXN0YW5jZVRvTGluZVRocm91Z2hQb2ludChlLHQscil7cmV0dXJuIHAuRGlzdChyLHAuTmVhcmVzdFBvaW50T25MaW5lVGhyb3VnaFBvaW50KGUsdCxyKSl9c3RhdGljIERpc3RhbmNlVG9MaW5lU2VnbWVudChlLHQscixpPSEwKXtyZXR1cm4gcC5EaXN0KHIscC5OZWFyZXN0UG9pbnRPbkxpbmVTZWdtZW50KGUsdCxyLGkpKX1zdGF0aWMgU25hcChlLHQ9MSl7cmV0dXJuIG5ldyBwKE1hdGgucm91bmQoZS54L3QpKnQsTWF0aC5yb3VuZChlLnkvdCkqdCl9c3RhdGljIENhc3QoZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBwP2U6cC5Gcm9tKGUpfXN0YXRpYyBTbG9wZShlLHQpe3JldHVybiBlLng9PT10Lnk/TmFOOihlLnktdC55KS8oZS54LXQueCl9c3RhdGljIEFuZ2xlKGUsdCl7cmV0dXJuIE1hdGguYXRhbjIodC55LWUueSx0LngtZS54KX1zdGF0aWMgTHJwKGUsdCxyKXtyZXR1cm4gcC5TdWIodCxlKS5tdWwocikuYWRkKGUpfXN0YXRpYyBNZWQoZSx0KXtyZXR1cm4gbmV3IHAoKGUueCt0LngpLzIsKGUueSt0LnkpLzIpfXN0YXRpYyBFcXVhbHMoZSx0LHI9MWUtNCl7cmV0dXJuIE1hdGguYWJzKGUueC10LngpPHImJk1hdGguYWJzKGUueS10LnkpPHJ9c3RhdGljIEVxdWFsc1hZKGUsdCxyKXtyZXR1cm4gZS54PT09dCYmZS55PT09cn1zdGF0aWMgRXF1YWxzWFlaKGUsdCxyPTFlLTQpe3JldHVybiBwLkVxdWFscyhlLHQscikmJk1hdGguYWJzKChlLnp8fDApLSh0Lnp8fDApKTxyfXN0YXRpYyBDbG9ja3dpc2UoZSx0LHIpe3JldHVybihyLngtZS54KSoodC55LWUueSktKHQueC1lLngpKihyLnktZS55KTwwfXN0YXRpYyBSZXNjYWxlKGUsdCl7Y29uc3Qgcj1wLkxlbihlKTtyZXR1cm4gbmV3IHAodCplLngvcix0KmUueS9yKX1zdGF0aWMgU2NhbGVXaXRoT3JpZ2luKGUsdCxyKXtyZXR1cm4gcC5TdWIoZSxyKS5tdWwodCkuYWRkKHIpfXN0YXRpYyBTY2FsZVdPcmlnaW4oZSx0LHIpe3JldHVybiBwLlN1YihlLHIpLm11bFYodCkuYWRkKHIpfXN0YXRpYyBUb0ZpeGVkKGUsdD0yKXtyZXR1cm4gbmV3IHAoK2UueC50b0ZpeGVkKHQpLCtlLnkudG9GaXhlZCh0KSwrZS56LnRvRml4ZWQodCkpfXN0YXRpYyBOdWRnZShlLHQscil7cmV0dXJuIHAuQWRkKGUscC5UYW4odCxlKS5tdWwocikpfXN0YXRpYyBUb1N0cmluZyhlKXtyZXR1cm5gJHtlLnh9LCAke2UueX1gfXN0YXRpYyBUb0FuZ2xlKGUpe2xldCB0PU1hdGguYXRhbjIoZS55LGUueCk7cmV0dXJuIHQ8MCYmKHQrPU1hdGguUEkqMiksdH1zdGF0aWMgRnJvbUFuZ2xlKGUsdD0xKXtyZXR1cm4gbmV3IHAoTWF0aC5jb3MoZSkqdCxNYXRoLnNpbihlKSp0KX1zdGF0aWMgVG9BcnJheShlKXtyZXR1cm5bZS54LGUueSxlLnpdfXN0YXRpYyBUb0pzb24oZSl7Y29uc3R7eDp0LHk6cix6Oml9PWU7cmV0dXJue3g6dCx5OnIsejppfX1zdGF0aWMgQXZlcmFnZShlKXtjb25zdCB0PWUubGVuZ3RoLHI9bmV3IHAoMCwwKTtmb3IobGV0IGk9MDtpPHQ7aSsrKXIuYWRkKGVbaV0pO3JldHVybiByLmRpdih0KX1zdGF0aWMgQ2xhbXAoZSx0LHIpe3JldHVybiByPT09dm9pZCAwP25ldyBwKE1hdGgubWluKE1hdGgubWF4KGUueCx0KSksTWF0aC5taW4oTWF0aC5tYXgoZS55LHQpKSk6bmV3IHAoTWF0aC5taW4oTWF0aC5tYXgoZS54LHQpLHIpLE1hdGgubWluKE1hdGgubWF4KGUueSx0KSxyKSl9c3RhdGljIFBvaW50c0JldHdlZW4oZSx0LHI9Nil7Y29uc3QgaT1bXTtmb3IobGV0IHM9MDtzPHI7cysrKXtjb25zdCBuPUJoLmVhc2VJblF1YWQocy8oci0xKSksYT1wLkxycChlLHQsbik7YS56PU1hdGgubWluKDEsLjUrTWF0aC5hYnMoLjUtX2gobikpKi42NSksaS5wdXNoKGEpfXJldHVybiBpfXN0YXRpYyBTbmFwVG9HcmlkKGUsdD04KXtyZXR1cm4gbmV3IHAoTWF0aC5yb3VuZChlLngvdCkqdCxNYXRoLnJvdW5kKGUueS90KSp0KX19Y29uc3QgX2g9bz0+bzwuNT8yKm8qbzotMSsoNC0yKm8pKm87Y2xhc3MgUiBleHRlbmRzIHB7Y29uc3RydWN0b3IoZT0wLHQ9MCxyPTAsaT17eDowLHk6MH0scz0wLG49MCl7c3VwZXIoZSx0LHIpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ5Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ6Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6aX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6c30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJhIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bn0pfWdldCB0aW1lc3RhbXAoKXtyZXR1cm4gdGhpcy50fWdldCBwcmVzc3VyZSgpe3JldHVybiB0aGlzLnp9Z2V0IGFuZ2xlTnVtKCl7cmV0dXJuIHRoaXMuYX1nZXQgWFkoKXtyZXR1cm5bdGhpcy54LHRoaXMueV19c2V0QShlKXt0aGlzLmE9ZX1zZXRUKGUpe3RoaXMudD1lfXNldHYoZSl7cmV0dXJuIHRoaXMudj17eDplLngseTplLnl9LHRoaXN9c2V0KGU9dGhpcy54LHQ9dGhpcy55LHI9dGhpcy56LGk9dGhpcy52LHM9dGhpcy50LG49dGhpcy5hKXtyZXR1cm4gdGhpcy54PWUsdGhpcy55PXQsdGhpcy56PXIsdGhpcy52PWksdGhpcy50PXMsdGhpcy5hPW4sdGhpc31jbG9uZSgpe2NvbnN0e3g6ZSx5OnQsejpyLHY6aSx0OnMsYTpufT10aGlzLGE9e3g6aS54LHk6aS55fTtyZXR1cm4gbmV3IFIoZSx0LHIsYSxzLG4pfWRpc3RhbmNlKGUpe3JldHVybiBSLkdldERpc3RhbmNlKHRoaXMsZSl9aXNOZWFyKGUsdCl7cmV0dXJuIFIuSXNOZWFyKHRoaXMsZSx0KX1nZXRBbmdsZUJ5UG9pbnRzKGUsdCl7cmV0dXJuIFIuR2V0QW5nbGVCeVBvaW50cyhlLHRoaXMsdCl9c3RhdGljIFN1YihlLHQpe3JldHVybiBuZXcgUihlLngtdC54LGUueS10LnkpfXN0YXRpYyBBZGQoZSx0KXtyZXR1cm4gbmV3IFIoZS54K3QueCxlLnkrdC55KX1zdGF0aWMgR2V0RGlzdGFuY2UoZSx0KXtyZXR1cm4gUi5MZW4oZS5jbG9uZSgpLnN1Yih0KSl9c3RhdGljIEdldEFuZ2xlQnlQb2ludHMoZSx0LHIpe2NvbnN0IGk9dC54LWUueCxzPXIueC10Lngsbj10LnktZS55LGE9ci55LXQueTtsZXQgbD0wO2NvbnN0IGM9TWF0aC5zcXJ0KGkqaStuKm4pLHU9TWF0aC5zcXJ0KHMqcythKmEpO2lmKGMmJnUpe2NvbnN0IGg9aSpzK24qYTtsPU1hdGguYWNvcyhoLyhjKnUpKSxsPWwvTWF0aC5QSSoxODA7bGV0IGQ9aSphLW4qcztkPWQ+MD8xOi0xLGw9MTgwK2QqbH1yZXR1cm4gbH1zdGF0aWMgSXNOZWFyKGUsdCxyKXtyZXR1cm4gUi5MZW4oZS5jbG9uZSgpLnN1Yih0KSk8cn1zdGF0aWMgUm90V2l0aChlLHQscixpPTIpe2NvbnN0IHM9ZS54LXQueCxuPWUueS10LnksYT1NYXRoLnNpbihyKSxsPU1hdGguY29zKHIpLGM9TWF0aC5wb3coMTAsaSksdT1NYXRoLmZsb29yKCh0LngrKHMqbC1uKmEpKSpjKS9jLGg9TWF0aC5mbG9vcigodC55KyhzKmErbipsKSkqYykvYztyZXR1cm4gbmV3IFIodSxoKX1zdGF0aWMgR2V0RG90U3Ryb2tlKGUsdCxyPTE2KXtjb25zdCBpPW5ldyBwKDEsMSkscz1NYXRoLlBJKy4wMDEsbj1SLkFkZChlLFIuU3ViKGUsaSkudW5pKCkucGVyKCkubXVsKC10KSksYT1bXTtmb3IobGV0IGw9MS9yLGM9bDtjPD0xO2MrPWwpYS5wdXNoKFIuUm90V2l0aChuLGUscyoyKmMpKTtyZXR1cm4gYX1zdGF0aWMgR2V0U2VtaWNpcmNsZVN0cm9rZShlLHQscj0tMSxpPTgpe2NvbnN0IHM9ciooTWF0aC5QSSsuMDAxKSxuPVtdO2ZvcihsZXQgYT0xL2ksbD1hO2w8PTE7bCs9YSluLnB1c2goUi5Sb3RXaXRoKHQsZSxzKmwpKTtyZXR1cm4gbn19ZnVuY3Rpb24gTShvLGUpe2lmKG8mJmUpe2NvbnN0IHQ9TWF0aC5taW4oby54LGUueCkscj1NYXRoLm1pbihvLnksZS55KSxpPU1hdGgubWF4KG8ueCtvLncsZS54K2Uudykscz1NYXRoLm1heChvLnkrby5oLGUueStlLmgpLG49aS10LGE9cy1yO3JldHVybnt4OnQseTpyLHc6bixoOmF9fXJldHVybiBlfHxvfWZ1bmN0aW9uIEcobyxlPTApe2NvbnN0IHQ9e3g6MCx5OjAsdzowLGg6MH07bGV0IHI9MS8wLGk9MS8wLHM9LTEvMCxuPS0xLzA7cmV0dXJuIG8uZm9yRWFjaChhPT57Y29uc3RbbCxjXT1hLlhZO3I9TWF0aC5taW4ocixsLWUpLGk9TWF0aC5taW4oaSxjLWUpLHM9TWF0aC5tYXgocyxsK2UpLG49TWF0aC5tYXgobixjK2UpfSksdC54PXIsdC55PWksdC53PXMtcix0Lmg9bi1pLHR9ZnVuY3Rpb24gUGUobyxlKXtyZXR1cm4hKG8ueCtvLnc8ZS54fHxvLng+ZS54K2Uud3x8by55K28uaDxlLnl8fG8ueT5lLnkrZS5oKX1mdW5jdGlvbiBFaChvLGUpe3JldHVybiBvLmxlbmd0aD09PWUubGVuZ3RoJiZvLnNvcnQoKS50b1N0cmluZygpPT09ZS5zb3J0KCkudG9TdHJpbmcoKX1mdW5jdGlvbiBLKG8sZT0xMCl7cmV0dXJue3g6TWF0aC5mbG9vcihvLngtZSkseTpNYXRoLmZsb29yKG8ueS1lKSx3Ok1hdGguZmxvb3Ioby53K2UqMiksaDpNYXRoLmZsb29yKG8uaCtlKjIpfX1mdW5jdGlvbiBDZShvLGUpe3JldHVybnt4Om8ueCtlWzBdLHk6by55K2VbMV0sdzpvLncsaDpvLmh9fWZ1bmN0aW9uIFRyKG8sZSl7Y29uc3QgdD1uZXcgcChvLngsby55KSxyPW5ldyBwKG8ueCtvLncsby55KSxpPW5ldyBwKG8ueCtvLncsby55K28uaCkscz1uZXcgcChvLngsby55K28uaCksbj1uZXcgcChvLngrby53LzIsby55K28uaC8yKSxhPU1hdGguUEkqZS8xODAsbD1wLlJvdFdpdGgodCxuLGEpLGM9cC5Sb3RXaXRoKHIsbixhKSx1PXAuUm90V2l0aChpLG4sYSksaD1wLlJvdFdpdGgocyxuLGEpO3JldHVybiBHKFtsLGMsdSxoXSl9ZnVuY3Rpb24gSXIobyxlKXtjb25zdCB0PW5ldyBwKG8ueCxvLnkpLHI9bmV3IHAoby54K28udyxvLnkpLGk9bmV3IHAoby54K28udyxvLnkrby5oKSxzPW5ldyBwKG8ueCxvLnkrby5oKSxuPW5ldyBwKG8ueCtvLncvMixvLnkrby5oLzIpLGE9bmV3IHAoZVswXSxlWzFdKSxsPXAuU2NhbGVXT3JpZ2luKHQsYSxuKSxjPXAuU2NhbGVXT3JpZ2luKHIsYSxuKSx1PXAuU2NhbGVXT3JpZ2luKGksYSxuKSxoPXAuU2NhbGVXT3JpZ2luKHMsYSxuKTtyZXR1cm4gRyhbbCxjLHUsaF0pfWZ1bmN0aW9uIHpoKG8sZSx0KXtjb25zdCByPW5ldyBwKGVbMF0sZVsxXSk7Zm9yKGxldCBpPTA7aTxvLmxlbmd0aDtpKz0zKXtjb25zdCBzPW5ldyBwKG9baV0sb1tpKzFdKSxuPU1hdGguUEkqdC8xODAsYT1wLlJvdFdpdGgocyxyLG4pO29baV09YS54LG9baSsxXT1hLnl9fWZ1bmN0aW9uIFVoKG8sZSx0KXtjb25zdCByPW5ldyBwKGVbMF0sZVsxXSk7Zm9yKGxldCBpPTA7aTxvLmxlbmd0aDtpKz0zKXtjb25zdCBzPW5ldyBwKG9baV0sb1tpKzFdKSxuPW5ldyBwKHRbMF0sdFsxXSk7aWYoaTxvLmxlbmd0aC0zKXtjb25zdCBsPW5ldyBwKG9baSszXSxvW2krNF0pLGM9cC5UYW4obCxzKS5wZXIoKS5tdWwob1tpKzJdKS5tdWxWKG4pLmxlbigpO29baSsyXT1jfWVsc2UgaWYoaT09PW8ubGVuZ3RoLTMpe2NvbnN0IGw9bmV3IHAob1tpLTNdLG9baS0yXSksYz1wLlRhbihzLGwpLnBlcigpLm11bChvW2krMl0pLm11bFYobikubGVuKCk7b1tpKzJdPWN9Y29uc3QgYT1wLlNjYWxlV09yaWdpbihzLG4scik7b1tpXT1hLngsb1tpKzFdPWEueX19ZnVuY3Rpb24gR2gobyxlKXtyZXR1cm4gb1swXT49ZS54JiZvWzBdPD1lLngrZS53JiZvWzFdPj1lLnkmJm9bMV08PWUueStlLmh9ZnVuY3Rpb24geHIobyxlKXtjb25zdCB0PW88PWU/MTpvL2Uscj1lPD1vPzE6ZS9vO3JldHVyblt0LHJdfWNvbnN0IEhlPW89PntpZihvLnRhZ05hbWU9PT0iR1JPVVAiKXtjb25zdCBlPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobykuZmluZCh0PT50LnRvU3RyaW5nKCk9PT0iU3ltYm9sKHNlYWxlZCkiKTtpZihlJiZvW2VdKXJldHVybiEwfXJldHVybiExfSxPcj1vPT5vIT09Uy5UZXh0O2Z1bmN0aW9uIFRlKG8pe3JldHVybmAke1llKG8ueCl9LCR7WWUoby55KX0gYH1mdW5jdGlvbiBJZShvLGUpe3JldHVybmAke1llKChvLngrZS54KS8yKX0sJHtZZSgoby55K2UueSkvMil9IGB9ZnVuY3Rpb24gWWUobyl7cmV0dXJuK28udG9GaXhlZCg0KX12YXIgWGg9ZmUsSGg9Y2UsWWg9IltvYmplY3QgTnVtYmVyXSI7ZnVuY3Rpb24gcWgobyl7cmV0dXJuIHR5cGVvZiBvPT0ibnVtYmVyInx8SGgobykmJlhoKG8pPT1ZaH12YXIgWmg9cWgsaGU9bWUoWmgpO2NsYXNzIHh7Y29uc3RydWN0b3IoZSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNVbml0VGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjFlM30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2Tm9kZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrSWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KTtjb25zdHt2Tm9kZXM6dCxmdWxsTGF5ZXI6cixkcmF3TGF5ZXI6aX09ZTt0aGlzLnZOb2Rlcz10LHRoaXMuZnVsbExheWVyPXIsdGhpcy5kcmF3TGF5ZXI9aX1zZXRXb3JrSWQoZSl7dGhpcy53b3JrSWQ9ZX1nZXRXb3JrSWQoKXtyZXR1cm4gdGhpcy53b3JrSWR9Z2V0V29ya09wdGlvbnMoKXtyZXR1cm4gdGhpcy53b3JrT3B0aW9uc31zZXRXb3JrT3B0aW9ucyhlKXt2YXIgaTt0aGlzLndvcmtPcHRpb25zPWUsdGhpcy5zeW5jVW5pdFRpbWU9ZS5zeW5jVW5pdFRpbWV8fHRoaXMuc3luY1VuaXRUaW1lO2NvbnN0IHQ9KGk9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDppLnRvU3RyaW5nKCkscj10JiZ0aGlzLnZOb2Rlcy5nZXQodCl8fHZvaWQgMDt0JiZyJiYoci5vcHQ9ZSx0aGlzLnZOb2Rlcy5zZXRJbmZvKHQscikpfXVwZGF0YU9wdFNlcnZpY2UoZSl7dmFyIGk7bGV0IHQ7Y29uc3Qgcj0oaT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmkudG9TdHJpbmcoKTtpZihyJiZlKXtjb25zdCBzPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHIpfHx0aGlzLmRyYXdMYXllciYmdGhpcy5kcmF3TGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUocil8fFtdO2lmKHMubGVuZ3RoIT09MSlyZXR1cm47Y29uc3Qgbj1zWzBdLHtwb3M6YSx6SW5kZXg6bCxzY2FsZTpjLGFuZ2xlOnUsdHJhbnNsYXRlOmh9PWUsZD17fTtoZShsKSYmKGQuekluZGV4PWwpLGEmJihkLnBvcz1bYVswXSxhWzFdXSksYyYmKGQuc2NhbGU9YyksdSYmKGQucm90YXRlPXUpLGgmJihkLnRyYW5zbGF0ZT1oKSxuLmF0dHIoZCk7Y29uc3QgZj1uPT1udWxsP3ZvaWQgMDpuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybiBmJiYodD1NKHQse3g6TWF0aC5mbG9vcihmLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGYueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoZi53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihmLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfSkpLHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDp0LGNlbnRlclBvczphfSksdH19c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppLHdpbGxTZXJpYWxpemVEYXRhOnMsdGFyZ2V0Tm9kZTpufT1lLHt6SW5kZXg6YSx0cmFuc2xhdGU6bCxhbmdsZTpjLGJveDp1LGJveFNjYWxlOmgsYm94VHJhbnNsYXRlOmQscG9pbnRNYXA6Zn09cjtsZXQgdztjb25zdCB5PW4mJnJlKG4pfHxpLmdldCh0Lm5hbWUpO2lmKCF5KXJldHVybjtoZShhKSYmKHQuc2V0QXR0cmlidXRlKCJ6SW5kZXgiLGEpLHkub3B0LnpJbmRleD1hKTtjb25zdCBnPXQucGFyZW50O2lmKGcpe2lmKHUmJmQmJmgpe2NvbnN0e3JlY3Q6UH09eSxrPVtdO2ZvcihsZXQgRD0wO0Q8eS5vcC5sZW5ndGg7RCs9MylrLnB1c2gobmV3IFIoeS5vcFtEXSx5Lm9wW0QrMV0seS5vcFtEKzJdKSk7Y29uc3QgTz1HKGspLEk9W08udypnLndvcmxkU2NhbGluZ1swXSxPLmgqZy53b3JsZFNjYWxpbmdbMF1dLGI9W1Audy1JWzBdLFAuaC1JWzFdXSx2PVsoUC53KmhbMF0tYlswXSkvSVswXSwoUC5oKmhbMV0tYlsxXSkvSVsxXV0sTD1bZFswXS9nLndvcmxkU2NhbGluZ1swXSxkWzFdL2cud29ybGRTY2FsaW5nWzFdXSxUPXkub3AubWFwKChELEgpPT57Y29uc3QgVj1IJTM7cmV0dXJuIFY9PT0wP0QrTFswXTpWPT09MT9EK0xbMV06RH0pLEE9W3kuY2VudGVyUG9zWzBdK0xbMF0seS5jZW50ZXJQb3NbMV0rTFsxXV07VWgoVCxBLHYpO2NvbnN0ICQ9W107Zm9yKGxldCBEPTA7RDxULmxlbmd0aDtEKz0zKSQucHVzaChuZXcgUihUW0RdLFRbRCsxXSxUW0QrMl0pKTt5Lm9wPVQseS5jZW50ZXJQb3M9QX1lbHNlIGlmKGwpe2NvbnN0IFA9W2xbMF0vZy53b3JsZFNjYWxpbmdbMF0sbFsxXS9nLndvcmxkU2NhbGluZ1sxXV07dC5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsUCkseS5vcHQudHJhbnNsYXRlPVAsbiYmKHc9Q2UoeS5yZWN0LGwpLHkucmVjdD13KX1lbHNlIGhlKGMpJiYodC5zZXRBdHRyaWJ1dGUoInJvdGF0ZSIsYykseS5vcHQucm90YXRlPWMsbiYmKHc9VHIoeS5yZWN0LGMpLHkucmVjdD13KSk7aWYoZil7Y29uc3QgUD1mLmdldCh0Lm5hbWUpO2lmKFApZm9yKGxldCBrPTAsTz0wO2s8eS5vcC5sZW5ndGg7ays9MyxPKyspeS5vcFtrXT1QW09dWzBdLHkub3BbaysxXT1QW09dWzFdfWlmKHMpe2lmKGwpe2NvbnN0IFA9W2xbMF0vZy53b3JsZFNjYWxpbmdbMF0sbFsxXS9nLndvcmxkU2NhbGluZ1sxXV0saz15Lm9wLm1hcCgoTyxJKT0+e2NvbnN0IGI9SSUzO3JldHVybiBiPT09MD9PK1BbMF06Yj09PTE/TytQWzFdOk99KTt5Lm9wPWsseS5jZW50ZXJQb3M9W3kuY2VudGVyUG9zWzBdK1BbMF0seS5jZW50ZXJQb3NbMV0rUFsxXV0seSE9bnVsbCYmeS5vcHQmJih5Lm9wdC50cmFuc2xhdGU9dm9pZCAwKX1lbHNlIGlmKGhlKGMpKXtjb25zdCBQPXkub3A7emgoUCx5LmNlbnRlclBvcyxjKSx5Lm9wPVAseSE9bnVsbCYmeS5vcHQmJih5Lm9wdC5yb3RhdGU9dm9pZCAwKX19eSYmaS5zZXRJbmZvKHQubmFtZSx5KX19c3RhdGljIGdldENlbnRlclBvcyhlLHQpe2NvbnN0e3dvcmxkUG9zaXRpb246cix3b3JsZFNjYWxpbmc6aX09dDtyZXR1cm5bKGUueCtlLncvMi1yWzBdKS9pWzBdLChlLnkrZS5oLzItclsxXSkvaVsxXV19c3RhdGljIGdldFJlY3RGcm9tTGF5ZXIoZSx0KXtjb25zdCByPWUuZ2V0RWxlbWVudHNCeU5hbWUodClbMF07aWYocil7Y29uc3QgaT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoaS54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihpLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGkud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoaS5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19fX1PYmplY3QuZGVmaW5lUHJvcGVydHkoeCwiU2FmZUJvcmRlclBhZGRpbmciLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZToxMH0pO2Z1bmN0aW9uIHhlKG8sZT0hMCl7Y29uc3QgdD1vLmxlbmd0aDtpZih0PDIpcmV0dXJuIiI7bGV0IHI9b1swXSxpPW9bMV07aWYodD09PTIpcmV0dXJuYE0ke1RlKHIpfUwke1RlKGkpfWA7bGV0IHM9IiI7Zm9yKGxldCBuPTIsYT10LTE7bjxhO24rKylyPW9bbl0saT1vW24rMV0scys9SWUocixpKTtyZXR1cm4gZT9gTSR7SWUob1swXSxvWzFdKX1RJHtUZShvWzFdKX0ke0llKG9bMV0sb1syXSl9VCR7c30ke0llKG9bdC0xXSxvWzBdKX0ke0llKG9bMF0sb1sxXSl9WmA6YE0ke1RlKG9bMF0pfVEke1RlKG9bMV0pfSR7SWUob1sxXSxvWzJdKX0ke28ubGVuZ3RoPjM/IlQiOiIifSR7c31MJHtUZShvW3QtMV0pfWB9dmFyIHl0PXtleHBvcnRzOnt9fTt5dC5leHBvcnRzLGZ1bmN0aW9uKG8pe3ZhciBlPWZ1bmN0aW9uKCl7dmFyIHQ9U3RyaW5nLmZyb21DaGFyQ29kZSxyPSJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSIsaT0iQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLSQiLHM9e307ZnVuY3Rpb24gbihsLGMpe2lmKCFzW2xdKXtzW2xdPXt9O2Zvcih2YXIgdT0wO3U8bC5sZW5ndGg7dSsrKXNbbF1bbC5jaGFyQXQodSldPXV9cmV0dXJuIHNbbF1bY119dmFyIGE9e2NvbXByZXNzVG9CYXNlNjQ6ZnVuY3Rpb24obCl7aWYobD09bnVsbClyZXR1cm4iIjt2YXIgYz1hLl9jb21wcmVzcyhsLDYsZnVuY3Rpb24odSl7cmV0dXJuIHIuY2hhckF0KHUpfSk7c3dpdGNoKGMubGVuZ3RoJTQpe2RlZmF1bHQ6Y2FzZSAwOnJldHVybiBjO2Nhc2UgMTpyZXR1cm4gYysiPT09IjtjYXNlIDI6cmV0dXJuIGMrIj09IjtjYXNlIDM6cmV0dXJuIGMrIj0ifX0sZGVjb21wcmVzc0Zyb21CYXNlNjQ6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6bD09IiI/bnVsbDphLl9kZWNvbXByZXNzKGwubGVuZ3RoLDMyLGZ1bmN0aW9uKGMpe3JldHVybiBuKHIsbC5jaGFyQXQoYykpfSl9LGNvbXByZXNzVG9VVEYxNjpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjphLl9jb21wcmVzcyhsLDE1LGZ1bmN0aW9uKGMpe3JldHVybiB0KGMrMzIpfSkrIiAifSxkZWNvbXByZXNzRnJvbVVURjE2OmZ1bmN0aW9uKGwpe3JldHVybiBsPT1udWxsPyIiOmw9PSIiP251bGw6YS5fZGVjb21wcmVzcyhsLmxlbmd0aCwxNjM4NCxmdW5jdGlvbihjKXtyZXR1cm4gbC5jaGFyQ29kZUF0KGMpLTMyfSl9LGNvbXByZXNzVG9VaW50OEFycmF5OmZ1bmN0aW9uKGwpe2Zvcih2YXIgYz1hLmNvbXByZXNzKGwpLHU9bmV3IFVpbnQ4QXJyYXkoYy5sZW5ndGgqMiksaD0wLGQ9Yy5sZW5ndGg7aDxkO2grKyl7dmFyIGY9Yy5jaGFyQ29kZUF0KGgpO3VbaCoyXT1mPj4+OCx1W2gqMisxXT1mJTI1Nn1yZXR1cm4gdX0sZGVjb21wcmVzc0Zyb21VaW50OEFycmF5OmZ1bmN0aW9uKGwpe2lmKGw9PW51bGwpcmV0dXJuIGEuZGVjb21wcmVzcyhsKTtmb3IodmFyIGM9bmV3IEFycmF5KGwubGVuZ3RoLzIpLHU9MCxoPWMubGVuZ3RoO3U8aDt1KyspY1t1XT1sW3UqMl0qMjU2K2xbdSoyKzFdO3ZhciBkPVtdO3JldHVybiBjLmZvckVhY2goZnVuY3Rpb24oZil7ZC5wdXNoKHQoZikpfSksYS5kZWNvbXByZXNzKGQuam9pbigiIikpfSxjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudDpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjphLl9jb21wcmVzcyhsLDYsZnVuY3Rpb24oYyl7cmV0dXJuIGkuY2hhckF0KGMpfSl9LGRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudDpmdW5jdGlvbihsKXtyZXR1cm4gbD09bnVsbD8iIjpsPT0iIj9udWxsOihsPWwucmVwbGFjZSgvIC9nLCIrIiksYS5fZGVjb21wcmVzcyhsLmxlbmd0aCwzMixmdW5jdGlvbihjKXtyZXR1cm4gbihpLGwuY2hhckF0KGMpKX0pKX0sY29tcHJlc3M6ZnVuY3Rpb24obCl7cmV0dXJuIGEuX2NvbXByZXNzKGwsMTYsZnVuY3Rpb24oYyl7cmV0dXJuIHQoYyl9KX0sX2NvbXByZXNzOmZ1bmN0aW9uKGwsYyx1KXtpZihsPT1udWxsKXJldHVybiIiO3ZhciBoLGQsZj17fSx3PXt9LHk9IiIsZz0iIixQPSIiLGs9MixPPTMsST0yLGI9W10sdj0wLEw9MCxUO2ZvcihUPTA7VDxsLmxlbmd0aDtUKz0xKWlmKHk9bC5jaGFyQXQoVCksT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGYseSl8fChmW3ldPU8rKyx3W3ldPSEwKSxnPVAreSxPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZixnKSlQPWc7ZWxzZXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodyxQKSl7aWYoUC5jaGFyQ29kZUF0KDApPDI1Nil7Zm9yKGg9MDtoPEk7aCsrKXY9djw8MSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKys7Zm9yKGQ9UC5jaGFyQ29kZUF0KDApLGg9MDtoPDg7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1lbHNle2ZvcihkPTEsaD0wO2g8STtoKyspdj12PDwxfGQsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9MDtmb3IoZD1QLmNoYXJDb2RlQXQoMCksaD0wO2g8MTY7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MX1rLS0saz09MCYmKGs9TWF0aC5wb3coMixJKSxJKyspLGRlbGV0ZSB3W1BdfWVsc2UgZm9yKGQ9ZltQXSxoPTA7aDxJO2grKyl2PXY8PDF8ZCYxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKyxkPWQ+PjE7ay0tLGs9PTAmJihrPU1hdGgucG93KDIsSSksSSsrKSxmW2ddPU8rKyxQPVN0cmluZyh5KX1pZihQIT09IiIpe2lmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh3LFApKXtpZihQLmNoYXJDb2RlQXQoMCk8MjU2KXtmb3IoaD0wO2g8STtoKyspdj12PDwxLEw9PWMtMT8oTD0wLGIucHVzaCh1KHYpKSx2PTApOkwrKztmb3IoZD1QLmNoYXJDb2RlQXQoMCksaD0wO2g8ODtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xfWVsc2V7Zm9yKGQ9MSxoPTA7aDxJO2grKyl2PXY8PDF8ZCxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD0wO2ZvcihkPVAuY2hhckNvZGVBdCgwKSxoPTA7aDwxNjtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xfWstLSxrPT0wJiYoaz1NYXRoLnBvdygyLEkpLEkrKyksZGVsZXRlIHdbUF19ZWxzZSBmb3IoZD1mW1BdLGg9MDtoPEk7aCsrKXY9djw8MXxkJjEsTD09Yy0xPyhMPTAsYi5wdXNoKHUodikpLHY9MCk6TCsrLGQ9ZD4+MTtrLS0saz09MCYmKGs9TWF0aC5wb3coMixJKSxJKyspfWZvcihkPTIsaD0wO2g8STtoKyspdj12PDwxfGQmMSxMPT1jLTE/KEw9MCxiLnB1c2godSh2KSksdj0wKTpMKyssZD1kPj4xO2Zvcig7OylpZih2PXY8PDEsTD09Yy0xKXtiLnB1c2godSh2KSk7YnJlYWt9ZWxzZSBMKys7cmV0dXJuIGIuam9pbigiIil9LGRlY29tcHJlc3M6ZnVuY3Rpb24obCl7cmV0dXJuIGw9PW51bGw/IiI6bD09IiI/bnVsbDphLl9kZWNvbXByZXNzKGwubGVuZ3RoLDMyNzY4LGZ1bmN0aW9uKGMpe3JldHVybiBsLmNoYXJDb2RlQXQoYyl9KX0sX2RlY29tcHJlc3M6ZnVuY3Rpb24obCxjLHUpe3ZhciBoPVtdLGQ9NCxmPTQsdz0zLHk9IiIsZz1bXSxQLGssTyxJLGIsdixMLFQ9e3ZhbDp1KDApLHBvc2l0aW9uOmMsaW5kZXg6MX07Zm9yKFA9MDtQPDM7UCs9MSloW1BdPVA7Zm9yKE89MCxiPU1hdGgucG93KDIsMiksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7c3dpdGNoKE8pe2Nhc2UgMDpmb3IoTz0wLGI9TWF0aC5wb3coMiw4KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtMPXQoTyk7YnJlYWs7Y2FzZSAxOmZvcihPPTAsYj1NYXRoLnBvdygyLDE2KSx2PTE7diE9YjspST1ULnZhbCZULnBvc2l0aW9uLFQucG9zaXRpb24+Pj0xLFQucG9zaXRpb249PTAmJihULnBvc2l0aW9uPWMsVC52YWw9dShULmluZGV4KyspKSxPfD0oST4wPzE6MCkqdix2PDw9MTtMPXQoTyk7YnJlYWs7Y2FzZSAyOnJldHVybiIifWZvcihoWzNdPUwsaz1MLGcucHVzaChMKTs7KXtpZihULmluZGV4PmwpcmV0dXJuIiI7Zm9yKE89MCxiPU1hdGgucG93KDIsdyksdj0xO3YhPWI7KUk9VC52YWwmVC5wb3NpdGlvbixULnBvc2l0aW9uPj49MSxULnBvc2l0aW9uPT0wJiYoVC5wb3NpdGlvbj1jLFQudmFsPXUoVC5pbmRleCsrKSksT3w9KEk+MD8xOjApKnYsdjw8PTE7c3dpdGNoKEw9Tyl7Y2FzZSAwOmZvcihPPTAsYj1NYXRoLnBvdygyLDgpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO2hbZisrXT10KE8pLEw9Zi0xLGQtLTticmVhaztjYXNlIDE6Zm9yKE89MCxiPU1hdGgucG93KDIsMTYpLHY9MTt2IT1iOylJPVQudmFsJlQucG9zaXRpb24sVC5wb3NpdGlvbj4+PTEsVC5wb3NpdGlvbj09MCYmKFQucG9zaXRpb249YyxULnZhbD11KFQuaW5kZXgrKykpLE98PShJPjA/MTowKSp2LHY8PD0xO2hbZisrXT10KE8pLEw9Zi0xLGQtLTticmVhaztjYXNlIDI6cmV0dXJuIGcuam9pbigiIil9aWYoZD09MCYmKGQ9TWF0aC5wb3coMix3KSx3KyspLGhbTF0peT1oW0xdO2Vsc2UgaWYoTD09PWYpeT1rK2suY2hhckF0KDApO2Vsc2UgcmV0dXJuIG51bGw7Zy5wdXNoKHkpLGhbZisrXT1rK3kuY2hhckF0KDApLGQtLSxrPXksZD09MCYmKGQ9TWF0aC5wb3coMix3KSx3KyspfX19O3JldHVybiBhfSgpO28hPW51bGw/by5leHBvcnRzPWU6dHlwZW9mIGFuZ3VsYXI8InUiJiZhbmd1bGFyIT1udWxsJiZhbmd1bGFyLm1vZHVsZSgiTFpTdHJpbmciLFtdKS5mYWN0b3J5KCJMWlN0cmluZyIsZnVuY3Rpb24oKXtyZXR1cm4gZX0pfSh5dCk7dmFyIExyPXl0LmV4cG9ydHM7ZnVuY3Rpb24gcWUobyl7cmV0dXJuIEpTT04ucGFyc2UoTHIuZGVjb21wcmVzcyhvKSl9ZnVuY3Rpb24gbGUobyl7cmV0dXJuIExyLmNvbXByZXNzKEpTT04uc3RyaW5naWZ5KG8pKX1jbGFzcyBDciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuUGVuY2lsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY0luZGV4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJNQVhfUkVQRUFSIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MTB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidW5pVGhpY2tuZXNzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNlbnRlclBvcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlswLDBdfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMudW5pVGhpY2tuZXNzPXRoaXMuTUFYX1JFUEVBUi90aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcy8xMCx0aGlzLnN5bmNUaW1lc3RhbXA9MH1jb21iaW5lQ29uc3VtZSgpe3ZhciBuO2NvbnN0IGU9KG49dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpuLnRvU3RyaW5nKCksdD10aGlzLnRyYW5zZm9ybURhdGFBbGwoITApLHI9e25hbWU6ZX07bGV0IGk7Y29uc3Qgcz10aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7cmV0dXJuIHQubGVuZ3RoJiYoaT10aGlzLmRyYXcoe2F0dHJzOnIsdGFza3M6dCxyZXBsYWNlSWQ6ZSxsYXllcjpzLGlzQ2xlYXJBbGw6ITB9KSkse3JlY3Q6aSx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbH19c2V0V29ya09wdGlvbnMoZSl7c3VwZXIuc2V0V29ya09wdGlvbnMoZSksdGhpcy5zeW5jVGltZXN0YW1wPURhdGUubm93KCl9Y29uc3VtZShlKXt2YXIgeTtjb25zdHtkYXRhOnQsaXNGdWxsV29yazpyLGlzQ2xlYXJBbGw6aSxpc1N1YldvcmtlcjpzfT1lO2lmKCgoeT10Lm9wKT09bnVsbD92b2lkIDA6eS5sZW5ndGgpPT09MClyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e3dvcmtJZDpufT10LHt0YXNrczphLGVmZmVjdHM6bCxjb25zdW1lSW5kZXg6Y309dGhpcy50cmFuc2Zvcm1EYXRhKHQsITEpO3RoaXMuc3luY0luZGV4PU1hdGgubWluKHRoaXMuc3luY0luZGV4LGMsTWF0aC5tYXgoMCx0aGlzLnRtcFBvaW50cy5sZW5ndGgtMikpO2NvbnN0IHU9e25hbWU6bj09bnVsbD92b2lkIDA6bi50b1N0cmluZygpfTtsZXQgaCxkPSExO2NvbnN0IGY9dGhpcy5zeW5jSW5kZXg7aWYodGhpcy5zeW5jVGltZXN0YW1wPT09MCYmKHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpKSxhLmxlbmd0aCYmKGFbMF0udGFza0lkLXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZSYmKGQ9ITAsdGhpcy5zeW5jVGltZXN0YW1wPWFbMF0udGFza0lkLHRoaXMuc3luY0luZGV4PXRoaXMudG1wUG9pbnRzLmxlbmd0aCkscykpe2NvbnN0IGc9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7aD10aGlzLmRyYXcoe2F0dHJzOnUsdGFza3M6YSxlZmZlY3RzOmwsbGF5ZXI6Zyxpc0NsZWFyQWxsOml9KX1pZihzKXJldHVybiBjPjEwJiZ0aGlzLnRtcFBvaW50cy5zcGxpY2UoMCxjLTEwKSx7cmVjdDpoLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsfTtjb25zdCB3PVtdO3JldHVybiB0aGlzLnRtcFBvaW50cy5zbGljZShmKS5mb3JFYWNoKGc9Pnt3LnB1c2goZy54LGcueSx0aGlzLmNvbXB1dFJhZGl1cyhnLnosdGhpcy53b3JrT3B0aW9ucy50aGlja25lc3MpKX0pLHtyZWN0OmgsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOmQ/bjp2b2lkIDAsb3A6ZD93OnZvaWQgMCxpbmRleDpkP2YqMzp2b2lkIDB9fWNvbnN1bWVBbGwoZSl7dmFyIGMsdTtpZihlLmRhdGEpe2NvbnN0e29wOmgsd29ya1N0YXRlOmR9PWUuZGF0YTtoIT1udWxsJiZoLmxlbmd0aCYmZD09PUYuRG9uZSYmdGhpcy53b3JrT3B0aW9ucy5zdHJva2VUeXBlPT09US5TdHJva2UmJnRoaXMudXBkYXRlVGVtcFBvaW50c1dpdGhQcmVzc3VyZVdoZW5Eb25lKGgpfWNvbnN0IHQ9KGM9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpjLnRvU3RyaW5nKCk7aWYoIXQpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdCByPXRoaXMudHJhbnNmb3JtRGF0YUFsbCghMCksaT17bmFtZTp0fTtsZXQgcztjb25zdCBuPXRoaXMuZnVsbExheWVyO3IubGVuZ3RoJiYocz10aGlzLmRyYXcoe2F0dHJzOmksdGFza3M6cixyZXBsYWNlSWQ6dCxsYXllcjpuLGlzQ2xlYXJBbGw6ITF9KSk7Y29uc3QgYT1bXTt0aGlzLnRtcFBvaW50cy5tYXAoaD0+e2EucHVzaChoLngsaC55LHRoaXMuY29tcHV0UmFkaXVzKGgueix0aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcykpfSksdGhpcy5zeW5jVGltZXN0YW1wPTAsZGVsZXRlIHRoaXMud29ya09wdGlvbnMuc3luY1VuaXRUaW1lO2NvbnN0IGw9bGUoYSk7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8odCx7cmVjdDpzLG9wOmEsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsbil9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDp0LG9wczpsLHVwZGF0ZU5vZGVPcHQ6e3Bvczp0aGlzLmNlbnRlclBvcyx1c2VBbmltYXRpb246ITB9LG9wdDp0aGlzLndvcmtPcHRpb25zLHVuZG9UaWNrZXJJZDoodT1lLmRhdGEpPT1udWxsP3ZvaWQgMDp1LnVuZG9UaWNrZXJJZH19Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNJbmRleD0wfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBoO2NvbnN0e29wOnQsaXNGdWxsV29yazpyLHJlcGxhY2VJZDppLGlzQ2xlYXJBbGw6cyxpc1RlbXA6bn09ZTt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGQ9MDtkPHQubGVuZ3RoO2QrPTMpe2NvbnN0IGY9bmV3IFIodFtkXSx0W2QrMV0sdFtkKzJdKTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg+MCl7Y29uc3Qgdz10aGlzLnRtcFBvaW50c1t0aGlzLnRtcFBvaW50cy5sZW5ndGgtMV0seT1wLlN1YihmLHcpLnVuaSgpO2Yuc2V0dih5KX10aGlzLnRtcFBvaW50cy5wdXNoKGYpfWNvbnN0IGE9dGhpcy50cmFuc2Zvcm1EYXRhQWxsKCExKSxsPShoPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6aC50b1N0cmluZygpLGM9e25hbWU6bH07bGV0IHU7aWYobCYmYS5sZW5ndGgpe2NvbnN0IGQ9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXI7dT10aGlzLmRyYXcoe2F0dHJzOmMsdGFza3M6YSxyZXBsYWNlSWQ6aSxsYXllcjpkLGlzQ2xlYXJBbGw6c30pLHImJiFuJiZ0aGlzLnZOb2Rlcy5zZXRJbmZvKGwse3JlY3Q6dSxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczp1JiZ4LmdldENlbnRlclBvcyh1LGQpfSl9cmV0dXJuIHV9dHJhbnNmb3JtRGF0YUFsbChlPSEwKXtyZXR1cm4gdGhpcy5nZXRUYXNrUG9pbnRzKHRoaXMudG1wUG9pbnRzLGUmJnRoaXMud29ya09wdGlvbnMudGhpY2tuZXNzfHx2b2lkIDApfWRyYXcoZSl7dmFyIEk7Y29uc3R7YXR0cnM6dCx0YXNrczpyLHJlcGxhY2VJZDppLGVmZmVjdHM6cyxsYXllcjpuLGlzQ2xlYXJBbGw6YX09ZSx7c3Ryb2tlQ29sb3I6bCxzdHJva2VUeXBlOmMsdGhpY2tuZXNzOnUsekluZGV4Omgsc2NhbGU6ZCxyb3RhdGU6Zix0cmFuc2xhdGU6d309dGhpcy53b3JrT3B0aW9uczthJiZuLnJlbW92ZUFsbENoaWxkcmVuKCksaSYmKHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGkrIiIpLm1hcChiPT5iLnJlbW92ZSgpKSwoST10aGlzLmRyYXdMYXllcik9PW51bGx8fEkuZ2V0RWxlbWVudHNCeU5hbWUoaSsiIikubWFwKGI9PmIucmVtb3ZlKCkpKSxzIT1udWxsJiZzLnNpemUmJihzLmZvckVhY2goYj0+e3ZhciB2Oyh2PW4uZ2V0RWxlbWVudEJ5SWQoYisiIikpPT1udWxsfHx2LnJlbW92ZSgpfSkscy5jbGVhcigpKTtsZXQgeTtjb25zdCBnPVtdLFA9bi53b3JsZFBvc2l0aW9uLGs9bi53b3JsZFNjYWxpbmc7Zm9yKGxldCBiPTA7YjxyLmxlbmd0aDtiKyspe2NvbnN0e3Bvczp2LHBvaW50czpMLHRhc2tJZDpUfT1yW2JdO3QuaWQ9VC50b1N0cmluZygpO2NvbnN0e3BzOkEscmVjdDokfT10aGlzLmNvbXB1dERyYXdQb2ludHMoTCk7bGV0IEQ7Y29uc3QgSD1MLmxlbmd0aD09PTE7Yz09PVEuU3Ryb2tlfHxIP0Q9eGUoQSwhMCk6RD14ZShBLCExKTtjb25zdCBWPXtwb3M6dixkOkQsZmlsbENvbG9yOmM9PT1RLlN0cm9rZXx8SD9sOnZvaWQgMCxsaW5lRGFzaDpjPT09US5Eb3R0ZWQmJiFIP1sxLHUqMl06Yz09PVEuTG9uZ0RvdHRlZCYmIUg/W3UsdSoyXTp2b2lkIDAsc3Ryb2tlQ29sb3I6bCxsaW5lQ2FwOmM9PT1RLlN0cm9rZXx8SD92b2lkIDA6InJvdW5kIixsaW5lV2lkdGg6Yz09PVEuU3Ryb2tlfHxIPzA6dX07eT1NKHkse3g6TWF0aC5mbG9vcigoJC54K3ZbMF0pKmtbMF0rUFswXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoKCQueSt2WzFdKSprWzFdK1BbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKCQudyprWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKCQuaCprWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9KSxnLnB1c2goVil9ZCYmKHQuc2NhbGU9ZCksZiYmKHQucm90YXRlPWYpLHcmJih0LnRyYW5zbGF0ZT13KTtjb25zdCBPPW5ldyB6Lkdyb3VwO2lmKHkpe3RoaXMuY2VudGVyUG9zPXguZ2V0Q2VudGVyUG9zKHksbiksTy5hdHRyKHsuLi50LG5vcm1hbGl6ZTohMCxpZDp0Lm5hbWUsYW5jaG9yOlsuNSwuNV0sYmdjb2xvcjpjPT09US5TdHJva2U/bDp2b2lkIDAscG9zOnRoaXMuY2VudGVyUG9zLHNpemU6Wyh5LnctMip4LlNhZmVCb3JkZXJQYWRkaW5nKS9rWzBdLCh5LmgtMip4LlNhZmVCb3JkZXJQYWRkaW5nKS9rWzFdXSx6SW5kZXg6aH0pO2NvbnN0IGI9Zy5tYXAodj0+KHYucG9zPVt2LnBvc1swXS10aGlzLmNlbnRlclBvc1swXSx2LnBvc1sxXS10aGlzLmNlbnRlclBvc1sxXV0sbmV3IHouUGF0aCh2KSkpO08uYXBwZW5kKC4uLmIpLGM9PT1RLlN0cm9rZSYmTy5zZWFsKCksbi5hcHBlbmQoTyl9aWYoZHx8Znx8dyl7Y29uc3QgYj1PPT1udWxsP3ZvaWQgMDpPLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2lmKGIpcmV0dXJue3g6TWF0aC5mbG9vcihiLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGIueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoYi53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihiLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm4geX1jb21wdXREcmF3UG9pbnRzKGUpe3JldHVybiB0aGlzLndvcmtPcHRpb25zLnN0cm9rZVR5cGU9PT1RLlN0cm9rZXx8ZS5sZW5ndGg9PT0xP3RoaXMuY29tcHV0U3Ryb2tlKGUpOnRoaXMuY29tcHV0Tm9tYWwoZSl9Y29tcHV0Tm9tYWwoZSl7bGV0IHQ9dGhpcy53b3JrT3B0aW9ucy50aGlja25lc3M7Y29uc3Qgcj1lLm1hcChpPT4odD1NYXRoLm1heCh0LGkucmFkaXVzKSxpLnBvaW50KSk7cmV0dXJue3BzOnIscmVjdDpHKHIsdCl9fWNvbXB1dFN0cm9rZShlKXtyZXR1cm4gZS5sZW5ndGg9PT0xP3RoaXMuY29tcHV0RG90U3Ryb2tlKGVbMF0pOnRoaXMuY29tcHV0TGluZVN0cm9rZShlKX1jb21wdXRMaW5lU3Ryb2tlKGUpe2NvbnN0IHQ9W10scj1bXTtmb3IobGV0IGw9MDtsPGUubGVuZ3RoO2wrKyl7Y29uc3R7cG9pbnQ6YyxyYWRpdXM6dX09ZVtsXTtsZXQgaD1jLnY7bD09PTAmJmUubGVuZ3RoPjEmJihoPWVbbCsxXS5wb2ludC52KTtjb25zdCBkPXAuUGVyKGgpLm11bCh1KTt0LnB1c2goUi5TdWIoYyxkKSksci5wdXNoKFIuQWRkKGMsZCkpfWNvbnN0IGk9ZVtlLmxlbmd0aC0xXSxzPVIuR2V0U2VtaWNpcmNsZVN0cm9rZShpLnBvaW50LHRbdC5sZW5ndGgtMV0sLTEsOCksbj1SLkdldFNlbWljaXJjbGVTdHJva2UoZVswXS5wb2ludCxyWzBdLC0xLDgpLGE9dC5jb25jYXQocyxyLnJldmVyc2UoKSxuKTtyZXR1cm57cHM6YSxyZWN0OkcoYSl9fWNvbXB1dERvdFN0cm9rZShlKXtjb25zdHtwb2ludDp0LHJhZGl1czpyfT1lLGk9e3g6dC54LXIseTp0Lnktcix3OnIqMixoOnIqMn07cmV0dXJue3BzOlIuR2V0RG90U3Ryb2tlKHQsciw4KSxyZWN0Oml9fXRyYW5zZm9ybURhdGEoZSx0KXtjb25zdHtvcDpyLHdvcmtTdGF0ZTppfT1lO2xldCBzPXRoaXMudG1wUG9pbnRzLmxlbmd0aC0xLG49W107aWYociE9bnVsbCYmci5sZW5ndGgmJmkpe2NvbnN0e3N0cm9rZVR5cGU6YSx0aGlja25lc3M6bH09dGhpcy53b3JrT3B0aW9ucyxjPW5ldyBTZXQ7cz1hPT09US5TdHJva2U/dGhpcy51cGRhdGVUZW1wUG9pbnRzV2l0aFByZXNzdXJlKHIsbCxjKTp0aGlzLnVwZGF0ZVRlbXBQb2ludHMocixsLGMpO2NvbnN0IHU9dD90aGlzLnRtcFBvaW50czp0aGlzLnRtcFBvaW50cy5zbGljZShzKTtyZXR1cm4gbj10aGlzLmdldFRhc2tQb2ludHModSxsKSx7dGFza3M6bixlZmZlY3RzOmMsY29uc3VtZUluZGV4OnN9fXJldHVybnt0YXNrczpuLGNvbnN1bWVJbmRleDpzfX1jb21wdXRSYWRpdXMoZSx0KXtyZXR1cm4gZSouMDMqdCt0Ki41fWdldE1pblooZSx0KXtyZXR1cm4oKHR8fE1hdGgubWF4KDEsTWF0aC5mbG9vcihlKi4zKSkpLWUqLjUpKjEwMC9lLzN9Z2V0VGFza1BvaW50cyhlLHQpe3ZhciB1O2NvbnN0IHI9W107aWYoZS5sZW5ndGg9PT0wKXJldHVybltdO2xldCBpPTAscz1lWzBdLngsbj1lWzBdLnksYT1bcyxuXSxsPVtdLGM9ZVswXS50O2Zvcig7aTxlLmxlbmd0aDspe2NvbnN0IGg9ZVtpXSxkPWgueC1zLGY9aC55LW4sdz1oLnoseT10P3RoaXMuY29tcHV0UmFkaXVzKHcsdCk6dztpZihsLnB1c2goe3BvaW50Om5ldyBSKGQsZix3LGVbaV0udikscmFkaXVzOnl9KSxpPjAmJmk8ZS5sZW5ndGgtMSl7Y29uc3QgZz1lW2ldLmdldEFuZ2xlQnlQb2ludHMoZVtpLTFdLGVbaSsxXSk7aWYoZzw5MHx8Zz4yNzApe2NvbnN0IFA9KHU9bC5wb3AoKSk9PW51bGw/dm9pZCAwOnUucG9pbnQuY2xvbmUoKTtQJiZyLnB1c2goe3Rhc2tJZDpjLHBvczphLHBvaW50czpbLi4ubCx7cG9pbnQ6UCxyYWRpdXM6eX1dfSkscz1lW2ldLngsbj1lW2ldLnksYT1bcyxuXTtjb25zdCBrPWgueC1zLE89aC55LW47bD1be3BvaW50Om5ldyBSKGssTyx3KSxyYWRpdXM6eX1dLGM9RGF0ZS5ub3coKX19aSsrfXJldHVybiByLnB1c2goe3Rhc2tJZDpjLHBvczphLHBvaW50czpsfSkscn11cGRhdGVUZW1wUG9pbnRzV2l0aFByZXNzdXJlKGUsdCxyKXtjb25zdCBpPURhdGUubm93KCkscz10aGlzLnRtcFBvaW50cy5sZW5ndGg7bGV0IG49cztmb3IobGV0IGw9MDtsPGUubGVuZ3RoO2wrPTIpe249TWF0aC5taW4obixzKTtjb25zdCBjPXRoaXMudG1wUG9pbnRzLmxlbmd0aCx1PW5ldyBSKGVbbF0sZVtsKzFdKTtpZihjPT09MCl7dGhpcy50bXBQb2ludHMucHVzaCh1KTtjb250aW51ZX1jb25zdCBoPWMtMSxkPXRoaXMudG1wUG9pbnRzW2hdLGY9cC5TdWIodSxkKS51bmkoKTtpZih1LmlzTmVhcihkLHQpKXtpZihkLno8dGhpcy5NQVhfUkVQRUFSKXtpZihkLnNldHooTWF0aC5taW4oZC56KzEsdGhpcy5NQVhfUkVQRUFSKSksbj1NYXRoLm1pbihuLGgpLGM+MSl7bGV0IGc9Yy0xO2Zvcig7Zz4wOyl7Y29uc3QgUD10aGlzLnRtcFBvaW50c1tnXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1tnLTFdKSxrPU1hdGgubWF4KHRoaXMudG1wUG9pbnRzW2ddLnotdGhpcy51bmlUaGlja25lc3MqUCwwKTtpZih0aGlzLnRtcFBvaW50c1tnLTFdLno+PWspYnJlYWs7dGhpcy50bXBQb2ludHNbZy0xXS5zZXR6KGspLG49TWF0aC5taW4obixnLTEpLGctLX19fWVsc2Ugbj0xLzA7Y29udGludWV9dS5zZXR2KGYpO2NvbnN0IHc9dS5kaXN0YW5jZShkKSx5PU1hdGgubWF4KGQuei10aGlzLnVuaVRoaWNrbmVzcyp3LDApO2M+MSYmcC5FcXVhbHMoZixkLnYsLjAyKSYmKHk+MHx8ZC56PD0wKSYmKHImJmQudCYmci5hZGQoZC50KSx0aGlzLnRtcFBvaW50cy5wb3AoKSxuPU1hdGgubWluKGgsbikpLHUuc2V0eih5KSx0aGlzLnRtcFBvaW50cy5wdXNoKHUpfWlmKG49PT0xLzApcmV0dXJuIHRoaXMudG1wUG9pbnRzLmxlbmd0aDtsZXQgYT1zO2lmKG49PT1zKXthPU1hdGgubWF4KGEtMSwwKTtjb25zdCBsPXRoaXMudG1wUG9pbnRzW2FdLnQ7bCYmKHI9PW51bGx8fHIuYWRkKGwpKX1lbHNle2xldCBsPXMtMTtmb3IoYT1uO2w+PTA7KXtjb25zdCBjPXRoaXMudG1wUG9pbnRzW2xdLnQ7aWYoYyYmKHI9PW51bGx8fHIuYWRkKGMpLGw8PW4pKXthPWwsbD0tMTticmVha31sLS19fXJldHVybiB0aGlzLnRtcFBvaW50c1thXS5zZXRUKGkpLGF9dXBkYXRlVGVtcFBvaW50cyhlLHQscil7dmFyIGw7Y29uc3QgaT1EYXRlLm5vdygpLHM9dGhpcy50bXBQb2ludHMubGVuZ3RoO2xldCBuPXM7Zm9yKGxldCBjPTA7YzxlLmxlbmd0aDtjKz0yKXtjb25zdCB1PXRoaXMudG1wUG9pbnRzLmxlbmd0aCxoPW5ldyBSKGVbY10sZVtjKzFdKTtpZih1PT09MCl7dGhpcy50bXBQb2ludHMucHVzaChoKTtjb250aW51ZX1jb25zdCBkPXUtMSxmPXRoaXMudG1wUG9pbnRzW2RdLHc9cC5TdWIoaCxmKS51bmkoKTtpZihoLmlzTmVhcihmLHQvMikpe249TWF0aC5taW4oZCxuKTtjb250aW51ZX1wLkVxdWFscyh3LGYudiwuMDIpJiYociYmZi50JiZyLmFkZChmLnQpLHRoaXMudG1wUG9pbnRzLnBvcCgpLG49TWF0aC5taW4oZCxuKSksaC5zZXR2KHcpLHRoaXMudG1wUG9pbnRzLnB1c2goaCl9bGV0IGE9cztpZihuPT09cyl7YT1NYXRoLm1heChhLTEsMCk7Y29uc3QgYz10aGlzLnRtcFBvaW50c1thXS50O2MmJihyPT1udWxsfHxyLmFkZChjKSl9ZWxzZXtsZXQgYz1NYXRoLm1pbihzLTEsbik7Zm9yKGE9bjtjPj0wOyl7Y29uc3QgdT0obD10aGlzLnRtcFBvaW50c1tjXSk9PW51bGw/dm9pZCAwOmwudDtpZih1JiYocj09bnVsbHx8ci5hZGQodSksYzw9bikpe2E9YyxjPS0xO2JyZWFrfWMtLX19cmV0dXJuIHRoaXMudG1wUG9pbnRzW2FdLnNldFQoaSksYX11cGRhdGVUZW1wUG9pbnRzV2l0aFByZXNzdXJlV2hlbkRvbmUoZSl7Y29uc3R7dGhpY2tuZXNzOnR9PXRoaXMud29ya09wdGlvbnMscj1lLmxlbmd0aCxpPXRoaXMuZ2V0TWluWih0KTtmb3IobGV0IHM9MDtzPHI7cys9Mil7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5sZW5ndGgsYT1uZXcgUihlW3NdLGVbcysxXSk7aWYobj09PTApe3RoaXMudG1wUG9pbnRzLnB1c2goYSk7Y29udGludWV9Y29uc3QgbD1uLTEsYz10aGlzLnRtcFBvaW50c1tsXSx1PXAuU3ViKGEsYykudW5pKCksaD1hLmRpc3RhbmNlKGMpO2lmKG4+MSYmYy56PT09aSlicmVhaztpZihhLmlzTmVhcihjLHQvMikpe2lmKHI8MyYmYy56PHRoaXMuTUFYX1JFUEVBUiYmKGMuc2V0eihNYXRoLm1pbihjLnorMSx0aGlzLk1BWF9SRVBFQVIpKSxuPjEpKXtsZXQgZj1uLTE7Zm9yKDtmPjA7KXtjb25zdCB3PXRoaXMudG1wUG9pbnRzW2ZdLmRpc3RhbmNlKHRoaXMudG1wUG9pbnRzW2YtMV0pLHk9TWF0aC5tYXgodGhpcy50bXBQb2ludHNbZl0uei10aGlzLnVuaVRoaWNrbmVzcyp3LC10LzQpO2lmKHRoaXMudG1wUG9pbnRzW2YtMV0uej49eSlicmVhazt0aGlzLnRtcFBvaW50c1tmLTFdLnNldHooeSksZi0tfX1jb250aW51ZX1hLnNldHYodSk7Y29uc3QgZD1NYXRoLm1heChjLnotdGhpcy51bmlUaGlja25lc3MqaCxpKTtuPjEmJnAuRXF1YWxzKHUsYy52LC4wMikmJmMuejw9MCYmdGhpcy50bXBQb2ludHMucG9wKCksYS5zZXR6KGQpLHRoaXMudG1wUG9pbnRzLnB1c2goYSl9fXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBhO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6c309cixuPWkuZ2V0KHQubmFtZSk7cmV0dXJuIHMmJih0LnRhZ05hbWU9PT0iR1JPVVAiP0hlKHQpP3Quc2V0QXR0cmlidXRlKCJiZ2NvbG9yIixzKTp0LmNoaWxkcmVuLmZvckVhY2gobD0+e2wuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksbC5nZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIpJiZsLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixzKX0pOih0LnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHQuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLHMpKSwoYT1uPT1udWxsP3ZvaWQgMDpuLm9wdCkhPW51bGwmJmEuc3Ryb2tlQ29sb3ImJihuLm9wdC5zdHJva2VDb2xvcj1zKSksbiYmaS5zZXRJbmZvKHQubmFtZSxuKSx4LnVwZGF0ZU5vZGVPcHQoZSl9c3RhdGljIGdldFJlY3RGcm9tTGF5ZXIoZSx0KXtjb25zdCByPWUuZ2V0RWxlbWVudHNCeU5hbWUodClbMF07aWYocil7Y29uc3QgaT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoaS54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihpLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGkud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoaS5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19fX1jbGFzcyBOciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuTGFzZXJQZW59KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5ub25lfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY0luZGV4Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb25zdW1lSW5kZXgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTowfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wfWNvbWJpbmVDb25zdW1lKCl7fXNldFdvcmtPcHRpb25zKGUpe3N1cGVyLnNldFdvcmtPcHRpb25zKGUpLHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpfWNvbnN1bWUoZSl7Y29uc3R7ZGF0YTp0LGlzU3ViV29ya2VyOnJ9PWUse3dvcmtJZDppLG9wOnN9PXQ7aWYoKHM9PW51bGw/dm9pZCAwOnMubGVuZ3RoKT09PTApcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnVwZGF0ZVRlbXBQb2ludHMoc3x8W10pLHRoaXMuY29uc3VtZUluZGV4PnRoaXMudG1wUG9pbnRzLmxlbmd0aC00KXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7c3Ryb2tlQ29sb3I6bix0aGlja25lc3M6YSxzdHJva2VUeXBlOmx9PXRoaXMud29ya09wdGlvbnMsYz1HKHRoaXMudG1wUG9pbnRzLGEpO2xldCB1PSExO2NvbnN0IGg9dGhpcy5zeW5jSW5kZXgsZD10aGlzLnRtcFBvaW50cy5zbGljZSh0aGlzLmNvbnN1bWVJbmRleCk7dGhpcy5jb25zdW1lSW5kZXg9dGhpcy50bXBQb2ludHMubGVuZ3RoLTEsdGhpcy5zeW5jVGltZXN0YW1wPT09MCYmKHRoaXMuc3luY1RpbWVzdGFtcD1EYXRlLm5vdygpKTtjb25zdCBmPXtuYW1lOmk9PW51bGw/dm9pZCAwOmkudG9TdHJpbmcoKSxvcGFjaXR5OjEsbGluZURhc2g6bD09PVEuRG90dGVkP1sxLGEqMl06bD09PVEuTG9uZ0RvdHRlZD9bYSxhKjJdOnZvaWQgMCxzdHJva2VDb2xvcjpuLGxpbmVDYXA6InJvdW5kIixsaW5lV2lkdGg6YSxhbmNob3I6Wy41LC41XX0sdz10aGlzLmdldFRhc2tQb2ludHMoZCk7aWYody5sZW5ndGgpe2NvbnN0IGc9RGF0ZS5ub3coKTtnLXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZSYmKHU9ITAsdGhpcy5zeW5jVGltZXN0YW1wPWcsdGhpcy5zeW5jSW5kZXg9dGhpcy50bXBQb2ludHMubGVuZ3RoKSxyJiZ0aGlzLmRyYXcoe2F0dHJzOmYsdGFza3M6dyxpc0RvdDohMSxsYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXJ9KX1jb25zdCB5PVtdO3JldHVybiB0aGlzLnRtcFBvaW50cy5zbGljZShoKS5mb3JFYWNoKGc9Pnt5LnB1c2goZy54LGcueSl9KSx7cmVjdDp7eDpjLngqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0seTpjLnkqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMV0sdzpjLncqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdLGg6Yy5oKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXX0sdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnU/aTp2b2lkIDAsb3A6dT95OnZvaWQgMCxpbmRleDp1P2gqMjp2b2lkIDB9fWNvbnN1bWVBbGwoKXt2YXIgaTtjb25zdCBlPShpPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpO2xldCB0O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aC0xPnRoaXMuY29uc3VtZUluZGV4KXtsZXQgcz10aGlzLnRtcFBvaW50cy5zbGljZSh0aGlzLmNvbnN1bWVJbmRleCk7Y29uc3Qgbj1zLmxlbmd0aD09PTEse3N0cm9rZUNvbG9yOmEsdGhpY2tuZXNzOmwsc3Ryb2tlVHlwZTpjfT10aGlzLndvcmtPcHRpb25zO2lmKG4pe2NvbnN0IGQ9dGhpcy5jb21wdXREb3RTdHJva2Uoe3BvaW50OnNbMF0scmFkaXVzOmwvMn0pO3M9ZC5wcyx0PWQucmVjdH1lbHNlIHQ9Ryh0aGlzLnRtcFBvaW50cyxsKTtjb25zdCB1PXtuYW1lOmU9PW51bGw/dm9pZCAwOmUudG9TdHJpbmcoKSxmaWxsQ29sb3I6bj9hOnZvaWQgMCxvcGFjaXR5OjEsbGluZURhc2g6Yz09PVEuRG90dGVkJiYhbj9bMSxsKjJdOmM9PT1RLkxvbmdEb3R0ZWQmJiFuP1tsLGwqMl06dm9pZCAwLHN0cm9rZUNvbG9yOmEsbGluZUNhcDpuP3ZvaWQgMDoicm91bmQiLGxpbmVXaWR0aDpuPzA6bCxhbmNob3I6Wy41LC41XX0saD10aGlzLmdldFRhc2tQb2ludHMocyk7aC5sZW5ndGgmJnRoaXMuZHJhdyh7YXR0cnM6dSx0YXNrczpoLGlzRG90Om4sbGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyfSl9Y29uc3Qgcj1bXTtyZXR1cm4gdGhpcy50bXBQb2ludHMuc2xpY2UodGhpcy5zeW5jSW5kZXgpLmZvckVhY2gocz0+e3IucHVzaChzLngscy55KX0pLHtyZWN0OnQmJnt4OnQueCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblswXSx5OnQueSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXSx3OnQudyp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0saDp0LmgqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdfSx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6ZSxvcDpyLGluZGV4OnRoaXMuc3luY0luZGV4KjJ9fWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTAsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jSW5kZXg9MH1jb25zdW1lU2VydmljZShlKXt2YXIgdztjb25zdHtvcDp0LHJlcGxhY2VJZDpyLGlzRnVsbFdvcms6aX09ZSx7c3Ryb2tlQ29sb3I6cyx0aGlja25lc3M6bixzdHJva2VUeXBlOmF9PXRoaXMud29ya09wdGlvbnM7aWYoIXQubGVuZ3RoKXtjb25zdCB5PUcodGhpcy50bXBQb2ludHMsbik7cmV0dXJue3g6eS54KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLHk6eS55KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdLHc6eS53KnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSxoOnkuaCp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV19fWNvbnN0IGw9TWF0aC5tYXgoMCx0aGlzLnRtcFBvaW50cy5sZW5ndGgtMSk7dGhpcy51cGRhdGVUZW1wUG9pbnRzKHR8fFtdKTtsZXQgYyx1PXRoaXMudG1wUG9pbnRzLnNsaWNlKGwpO2NvbnN0IGg9dS5sZW5ndGg9PT0xO2lmKGgpe2NvbnN0IHk9dGhpcy5jb21wdXREb3RTdHJva2Uoe3BvaW50OnVbMF0scmFkaXVzOm4vMn0pO3U9eS5wcyxjPXkucmVjdH1lbHNlIGM9Ryh0aGlzLnRtcFBvaW50cyxuKTtjb25zdCBkPXtuYW1lOih3PXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6dy50b1N0cmluZygpLGZpbGxDb2xvcjpoP3M6dm9pZCAwLG9wYWNpdHk6MSxsaW5lRGFzaDphPT09US5Eb3R0ZWQmJiFoP1sxLG4qMl06YT09PVEuTG9uZ0RvdHRlZCYmIWg/W24sbioyXTp2b2lkIDAsc3Ryb2tlQ29sb3I6cyxsaW5lQ2FwOmg/dm9pZCAwOiJyb3VuZCIsbGluZVdpZHRoOmg/MDpuLGFuY2hvcjpbLjUsLjVdfSxmPXRoaXMuZ2V0VGFza1BvaW50cyh1KTtpZihmLmxlbmd0aCl7Y29uc3QgeT1pP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcjt0aGlzLmRyYXcoe2F0dHJzOmQsdGFza3M6Zixpc0RvdDpoLHJlcGxhY2VJZDpyLGxheWVyOnl9KX1yZXR1cm57eDpjLngqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0seTpjLnkqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzFdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMV0sdzpjLncqdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdLGg6Yy5oKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1sxXX19Y29tcHV0RG90U3Ryb2tlKGUpe2NvbnN0e3BvaW50OnQscmFkaXVzOnJ9PWUsaT17eDp0Lngtcix5OnQueS1yLHc6cioyLGg6cioyfTtyZXR1cm57cHM6Ui5HZXREb3RTdHJva2UodCxyLDgpLHJlY3Q6aX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PXRoaXMudG1wUG9pbnRzLmxlbmd0aDtmb3IobGV0IHI9MDtyPGUubGVuZ3RoO3IrPTIpe2lmKHQpe2NvbnN0IGk9dGhpcy50bXBQb2ludHMuc2xpY2UoLTEpWzBdO2kmJmkueD09PWVbcl0mJmkueT09PWVbcisxXSYmdGhpcy50bXBQb2ludHMucG9wKCl9dGhpcy50bXBQb2ludHMucHVzaChuZXcgUihlW3JdLGVbcisxXSkpfX1hc3luYyBkcmF3KGUpe2NvbnN0e2F0dHJzOnQsdGFza3M6cixpc0RvdDppLGxheWVyOnN9PWUse2R1cmF0aW9uOm59PXRoaXMud29ya09wdGlvbnM7Zm9yKGNvbnN0IGEgb2Ygcil7Y29uc3QgbD1uZXcgei5QYXRoLHtwb3M6Yyxwb2ludHM6dX09YTtsZXQgaDtpP2g9eGUodSwhMCk6aD14ZSh1LCExKSxsLmF0dHIoey4uLnQscG9zOmMsZDpofSk7Y29uc3R7dmVydGV4OmQsZnJhZ21lbnQ6Zn09dGhpcy53b3JrT3B0aW9ucztpZihkJiZmKXtjb25zdCB3PXMucmVuZGVyZXIuY3JlYXRlUHJvZ3JhbSh7dmVydGV4OmQsZnJhZ21lbnQ6Zn0pLHt3aWR0aDp5LGhlaWdodDpnfT1zLmdldFJlc29sdXRpb24oKTtsLnNldFVuaWZvcm1zKHt1X3RpbWU6MCx1X3Jlc29sdXRpb246W3ksZ119KSxsLnNldFByb2dyYW0odyl9cy5hcHBlbmRDaGlsZChsKSxsLnRyYW5zaXRpb24obikuYXR0cih7c2NhbGU6aT9bLjEsLjFdOlsxLDFdLGxpbmVXaWR0aDppPzA6MX0pLnRoZW4oKCk9PntsLnJlbW92ZSgpfSl9fWdldFRhc2tQb2ludHMoZSl7dmFyIGw7Y29uc3QgdD1bXTtpZihlLmxlbmd0aD09PTApcmV0dXJuW107bGV0IHI9MCxpPWVbMF0ueCxzPWVbMF0ueSxuPVtpLHNdLGE9W107Zm9yKDtyPGUubGVuZ3RoOyl7Y29uc3QgYz1lW3JdLHU9Yy54LWksaD1jLnktcztpZihhLnB1c2gobmV3IFIodSxoKSkscj4wJiZyPGUubGVuZ3RoLTEpe2NvbnN0IGQ9ZVtyXS5nZXRBbmdsZUJ5UG9pbnRzKGVbci0xXSxlW3IrMV0pO2lmKGQ8OTB8fGQ+MjcwKXtjb25zdCBmPShsPWEucG9wKCkpPT1udWxsP3ZvaWQgMDpsLmNsb25lKCk7ZiYmdC5wdXNoKHtwb3M6bixwb2ludHM6Wy4uLmEsZl19KSxpPWVbcl0ueCxzPWVbcl0ueSxuPVtpLHNdO2NvbnN0IHc9Yy54LWkseT1jLnktczthPVtuZXcgUih3LHkpXX19cisrfXJldHVybiB0LnB1c2goe3BvczpuLHBvaW50czphfSksdH1yZW1vdmVMb2NhbCgpe31yZW1vdmVTZXJ2aWNlKGUpe2xldCB0O2NvbnN0IHI9W107cmV0dXJuIHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGUpLmZvckVhY2goaT0+e2lmKGkubmFtZT09PWUpe2NvbnN0IHM9aS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTt0PU0odCx7eDpzLngseTpzLnksdzpzLndpZHRoLGg6cy5oZWlnaHR9KSxyLnB1c2goaSl9fSksci5sZW5ndGgmJnIuZm9yRWFjaChpPT5pLnJlbW92ZSgpKSx0fX12YXIgUWg9WmU7WmUucG9seWxpbmU9WmUsWmUucG9seWdvbj1KaDtmdW5jdGlvbiBaZShvLGUsdCl7dmFyIHI9by5sZW5ndGgsaT1PZShvWzBdLGUpLHM9W10sbixhLGwsYyx1O2Zvcih0fHwodD1bXSksbj0xO248cjtuKyspe2ZvcihhPW9bbi0xXSxsPW9bbl0sYz11PU9lKGwsZSk7OylpZihpfGMpe2lmKGkmYylicmVhaztpPyhhPXd0KGEsbCxpLGUpLGk9T2UoYSxlKSk6KGw9d3QoYSxsLGMsZSksYz1PZShsLGUpKX1lbHNle3MucHVzaChhKSxjIT09dT8ocy5wdXNoKGwpLG48ci0xJiYodC5wdXNoKHMpLHM9W10pKTpuPT09ci0xJiZzLnB1c2gobCk7YnJlYWt9aT11fXJldHVybiBzLmxlbmd0aCYmdC5wdXNoKHMpLHR9ZnVuY3Rpb24gSmgobyxlKXt2YXIgdCxyLGkscyxuLGEsbDtmb3Iocj0xO3I8PTg7cio9Mil7Zm9yKHQ9W10saT1vW28ubGVuZ3RoLTFdLHM9IShPZShpLGUpJnIpLG49MDtuPG8ubGVuZ3RoO24rKylhPW9bbl0sbD0hKE9lKGEsZSkmciksbCE9PXMmJnQucHVzaCh3dChpLGEscixlKSksbCYmdC5wdXNoKGEpLGk9YSxzPWw7aWYobz10LCFvLmxlbmd0aClicmVha31yZXR1cm4gdH1mdW5jdGlvbiB3dChvLGUsdCxyKXtyZXR1cm4gdCY4P1tvWzBdKyhlWzBdLW9bMF0pKihyWzNdLW9bMV0pLyhlWzFdLW9bMV0pLHJbM11dOnQmND9bb1swXSsoZVswXS1vWzBdKSooclsxXS1vWzFdKS8oZVsxXS1vWzFdKSxyWzFdXTp0JjI/W3JbMl0sb1sxXSsoZVsxXS1vWzFdKSooclsyXS1vWzBdKS8oZVswXS1vWzBdKV06dCYxP1tyWzBdLG9bMV0rKGVbMV0tb1sxXSkqKHJbMF0tb1swXSkvKGVbMF0tb1swXSldOm51bGx9ZnVuY3Rpb24gT2UobyxlKXt2YXIgdD0wO3JldHVybiBvWzBdPGVbMF0/dHw9MTpvWzBdPmVbMl0mJih0fD0yKSxvWzFdPGVbMV0/dHw9NDpvWzFdPmVbM10mJih0fD04KSx0fXZhciBLaD1tZShRaCk7Y2xhc3MgbmUgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUsdCl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEubm9uZX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkVyYXNlcn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZXJ2aWNlV29yayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JsZFBvc2l0aW9uIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmxkU2NhbGluZyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlcmFzZXJSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVyYXNlclBvbHlsaW5lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy5zZXJ2aWNlV29yaz10LHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLndvcmxkUG9zaXRpb249dGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvbix0aGlzLndvcmxkU2NhbGluZz10aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmd9Y29tYmluZUNvbnN1bWUoKXt9Y29uc3VtZVNlcnZpY2UoKXt9c2V0V29ya09wdGlvbnMoZSl7c3VwZXIuc2V0V29ya09wdGlvbnMoZSl9Y3JlYXRlRXJhc2VyUmVjdChlKXtjb25zdCB0PWVbMF0qdGhpcy53b3JsZFNjYWxpbmdbMF0rdGhpcy53b3JsZFBvc2l0aW9uWzBdLHI9ZVsxXSp0aGlzLndvcmxkU2NhbGluZ1sxXSt0aGlzLndvcmxkUG9zaXRpb25bMV0se3dpZHRoOmksaGVpZ2h0OnN9PW5lLmVyYXNlclNpemVzW3RoaXMud29ya09wdGlvbnMudGhpY2tuZXNzXTt0aGlzLmVyYXNlclJlY3Q9e3g6dC1pKi41LHk6ci1zKi41LHc6aSxoOnN9LHRoaXMuZXJhc2VyUG9seWxpbmU9W3RoaXMuZXJhc2VyUmVjdC54LHRoaXMuZXJhc2VyUmVjdC55LHRoaXMuZXJhc2VyUmVjdC54K3RoaXMuZXJhc2VyUmVjdC53LHRoaXMuZXJhc2VyUmVjdC55K3RoaXMuZXJhc2VyUmVjdC5oXX1jb21wdXRSZWN0Q2VudGVyUG9pbnRzKCl7Y29uc3QgZT10aGlzLnRtcFBvaW50cy5zbGljZSgtMik7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09NCl7Y29uc3QgdD1uZXcgcCh0aGlzLnRtcFBvaW50c1swXSx0aGlzLnRtcFBvaW50c1sxXSkscj1uZXcgcCh0aGlzLnRtcFBvaW50c1syXSx0aGlzLnRtcFBvaW50c1szXSksaT1wLlN1YihyLHQpLnVuaSgpLHM9cC5EaXN0KHQscikse3dpZHRoOm4saGVpZ2h0OmF9PW5lLmVyYXNlclNpemVzW3RoaXMud29ya09wdGlvbnMudGhpY2tuZXNzXSxsPU1hdGgubWluKG4sYSksYz1NYXRoLnJvdW5kKHMvbCk7aWYoYz4xKXtjb25zdCB1PVtdO2ZvcihsZXQgaD0wO2g8YztoKyspe2NvbnN0IGQ9cC5NdWwoaSxoKmwpO3UucHVzaCh0aGlzLnRtcFBvaW50c1swXStkLngsdGhpcy50bXBQb2ludHNbMV0rZC55KX1yZXR1cm4gdS5jb25jYXQoZSl9fXJldHVybiBlfWlzTmVhcihlLHQpe2NvbnN0IHI9bmV3IHAoZVswXSxlWzFdKSxpPW5ldyBwKHRbMF0sdFsxXSkse3dpZHRoOnMsaGVpZ2h0Om59PW5lLmVyYXNlclNpemVzW3RoaXMud29ya09wdGlvbnMudGhpY2tuZXNzXTtyZXR1cm4gcC5EaXN0KHIsaSk8TWF0aC5oeXBvdChzLG4pKi41fWN1dFBvbHlsaW5lKGUsdCl7bGV0IHI9W3RdLGk9MDtmb3IoO2k8ZS5sZW5ndGg7KXtjb25zdCBhPWVbaV07aWYoYS5sZW5ndGg8MilicmVhaztyPXMocixhKSxpKyt9cmV0dXJuIHI7ZnVuY3Rpb24gcyhhLGwpe2NvbnN0IGM9YTtmb3IobGV0IHU9MDt1PGEubGVuZ3RoO3UrKyl7Y29uc3QgaD1hW3VdLGQ9aC5maW5kSW5kZXgoKGYsdyk9Pnc8aC5sZW5ndGgtMT9uKFtmLGhbdysxXV0sW2xbMF0sbFsxXV0pOiExKTtpZihkIT09LTEmJmQ+LTEpe2NvbnN0IGY9W10sdz1oLnNsaWNlKDAsZCsxKTtpZihwLkVxdWFscyhoW2RdLGxbMF0pfHx3LnB1c2gobFswXS5jbG9uZSgpLnNldHooaFtkXS56KSksdy5sZW5ndGg+MSYmZi5wdXNoKHcpLGQrbC5sZW5ndGgtMTxoLmxlbmd0aC0xKXtjb25zdCB5PWQrbC5sZW5ndGgtMSxnPWguc2xpY2UoeSksUD1sW2wubGVuZ3RoLTFdO3AuRXF1YWxzKGhbeV0sUCl8fGcudW5zaGlmdChQLmNsb25lKCkuc2V0eihoW3ldLnopKSxnLmxlbmd0aD4xJiZmLnB1c2goZyl9cmV0dXJuIGMuc3BsaWNlKHUsMSwuLi5mKSxjfX1yZXR1cm4gY31mdW5jdGlvbiBuKGEsbCl7Y29uc3QgYz1wLlN1YihhWzFdLGFbMF0pLHU9cC5TdWIobFsxXSxsWzBdKSxoPXAuU3ViKGxbMF0sYVswXSk7cmV0dXJuIE1hdGguYWJzKHAuQ3ByKGMsdSkpPC4xJiZNYXRoLmFicyhwLkNwcihjLGgpKTwuMX19aXNTYW1lUG9pbnQoZSx0KXtyZXR1cm4gZVswXT09PXRbMF0mJmVbMV09PT10WzFdfXRyYW5zbGF0ZUludGVyc2VjdChlKXtjb25zdCB0PVtdO2ZvcihsZXQgcj0wO3I8ZS5sZW5ndGg7cisrKXtjb25zdCBpPWVbcl0uZmlsdGVyKChhLGwsYyk9PiEobD4wJiZ0aGlzLmlzU2FtZVBvaW50KGEsY1tsLTFdKSkpLHM9W107bGV0IG49MDtmb3IoO248aS5sZW5ndGg7KXtjb25zdCBhPWlbbl0sbD1uZXcgcChhWzBdLGFbMV0pO3MucHVzaChsKSxuKyt9dC5wdXNoKHMpfXJldHVybiB0fWlzTGluZUVyYXNlcihlLHQpe3JldHVybiEoZT09PVMuUGVuY2lsJiYhdCl9cmVtb3ZlKGUpe2NvbnN0e2N1ck5vZGVNYXA6dCxyZW1vdmVJZHM6cixuZXdXb3JrRGF0YXM6aX09ZSx7aXNMaW5lOnN9PXRoaXMud29ya09wdGlvbnM7bGV0IG47Zm9yKGNvbnN0W2EsbF1vZiB0LmVudHJpZXMoKSlpZihsLnJlY3QmJnRoaXMuZXJhc2VyUmVjdCYmdGhpcy5lcmFzZXJQb2x5bGluZSYmUGUodGhpcy5lcmFzZXJSZWN0LGwucmVjdCkpe2NvbnN0e29wOmMsdG9vbHNUeXBlOnV9PWwsaD10aGlzLmlzTGluZUVyYXNlcih1LHMpLGQ9W10sZj1bXTtmb3IobGV0IHk9MDt5PGMubGVuZ3RoO3krPTMpe2NvbnN0IGc9bmV3IHAoY1t5XSp0aGlzLndvcmxkU2NhbGluZ1swXSt0aGlzLndvcmxkUG9zaXRpb25bMF0sY1t5KzFdKnRoaXMud29ybGRTY2FsaW5nWzFdK3RoaXMud29ybGRQb3NpdGlvblsxXSxjW3krMl0pO2YucHVzaChnKSxkLnB1c2gobmV3IFIoZy54LGcueSkpfWNvbnN0IHc9ZC5sZW5ndGgmJkcoZCl8fGwucmVjdDtpZihQZSh3LHRoaXMuZXJhc2VyUmVjdCkpe2lmKGYubGVuZ3RoPjEpe2NvbnN0IHk9S2gucG9seWxpbmUoZi5tYXAoZz0+Zy5YWSksdGhpcy5lcmFzZXJQb2x5bGluZSk7aWYoeS5sZW5ndGgmJihyLmFkZChsLm5hbWUpLCFoKSl7Y29uc3QgZz10aGlzLnRyYW5zbGF0ZUludGVyc2VjdCh5KSxQPXRoaXMuY3V0UG9seWxpbmUoZyxmKTtmb3IobGV0IGs9MDtrPFAubGVuZ3RoO2srKyl7Y29uc3QgTz1gJHthfV9zXyR7a31gLEk9W107UFtrXS5mb3JFYWNoKGI9PntJLnB1c2goKGIueC10aGlzLndvcmxkUG9zaXRpb25bMF0pL3RoaXMud29ybGRTY2FsaW5nWzBdLChiLnktdGhpcy53b3JsZFBvc2l0aW9uWzFdKS90aGlzLndvcmxkU2NhbGluZ1sxXSxiLnopfSksbC5vcHQmJmwudG9vbHNUeXBlJiZ0aGlzLnZOb2RlcyYmKHRoaXMudk5vZGVzLnNldEluZm8oTyx7cmVjdDp3LG9wOkksb3B0Omwub3B0LGNhblJvdGF0ZTpsLmNhblJvdGF0ZSxzY2FsZVR5cGU6bC5zY2FsZVR5cGUsdG9vbHNUeXBlOmwudG9vbHNUeXBlfSksaS5zZXQoTyx7d29ya0lkOk8sb3A6SSxvcHQ6bC5vcHQsdG9vbHNUeXBlOmwudG9vbHNUeXBlfSkpfX19ZWxzZSByLmFkZChsLm5hbWUpO249TShuLHcpfX1yZXR1cm4gci5mb3JFYWNoKGE9Pnt2YXIgbDtyZXR1cm4obD10aGlzLnZOb2Rlcyk9PW51bGw/dm9pZCAwOmwuZGVsZXRlKGEpfSksbiYmKG4ueC09eC5TYWZlQm9yZGVyUGFkZGluZyxuLnktPXguU2FmZUJvcmRlclBhZGRpbmcsbi53Kz14LlNhZmVCb3JkZXJQYWRkaW5nKjIsbi5oKz14LlNhZmVCb3JkZXJQYWRkaW5nKjIpLG59Y29uc3VtZShlKXtjb25zdHtvcDp0fT1lLmRhdGE7aWYoIXR8fHQubGVuZ3RoPT09MClyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0IHI9dGhpcy50bXBQb2ludHMubGVuZ3RoO2lmKHI+MSYmdGhpcy5pc05lYXIoW3RbMF0sdFsxXV0sW3RoaXMudG1wUG9pbnRzW3ItMl0sdGhpcy50bXBQb2ludHNbci0xXV0pKXJldHVybnt0eXBlOm0uTm9uZX07cj09PTQmJih0aGlzLnRtcFBvaW50cy5zaGlmdCgpLHRoaXMudG1wUG9pbnRzLnNoaWZ0KCkpLHRoaXMudG1wUG9pbnRzLnB1c2godFswXSx0WzFdKTtjb25zdCBpPXRoaXMuY29tcHV0UmVjdENlbnRlclBvaW50cygpO2xldCBzO2NvbnN0IG49bmV3IFNldCxhPW5ldyBNYXA7dGhpcy52Tm9kZXMuc2V0VGFyZ2V0KCk7Y29uc3QgbD10aGlzLmdldFVuTG9ja05vZGVNYXAodGhpcy52Tm9kZXMuZ2V0TGFzdFRhcmdldCgpKTtmb3IobGV0IGM9MDtjPGkubGVuZ3RoLTE7Yys9Mil7dGhpcy5jcmVhdGVFcmFzZXJSZWN0KGkuc2xpY2UoYyxjKzIpKTtjb25zdCB1PXRoaXMucmVtb3ZlKHtjdXJOb2RlTWFwOmwscmVtb3ZlSWRzOm4sbmV3V29ya0RhdGFzOmF9KTtzPU0ocyx1KX1pZih0aGlzLnZOb2Rlcy5kZWxldGVMYXN0VGFyZ2V0KCkscyYmbi5zaXplKXtmb3IoY29uc3QgYyBvZiBhLmtleXMoKSluLmhhcyhjKSYmYS5kZWxldGUoYyk7cmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLGRhdGFUeXBlOlcuTG9jYWwscmVjdDpzLHJlbW92ZUlkczpbLi4ubl0sbmV3V29ya0RhdGFzOmF9fXJldHVybnt0eXBlOm0uTm9uZX19Y29uc3VtZUFsbChlKXtyZXR1cm4gdGhpcy5jb25zdW1lKGUpfWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9Z2V0VW5Mb2NrTm9kZU1hcChlKXt2YXIgdDtpZih0aGlzLnNlcnZpY2VXb3JrKXtjb25zdCByPXJlKGUpLGk9dGhpcy5zZXJ2aWNlV29yay5zZWxlY3RvcldvcmtTaGFwZXMscz10aGlzLnNlcnZpY2VXb3JrLndvcmtTaGFwZXM7Zm9yKGNvbnN0IG4gb2YgaS52YWx1ZXMoKSlpZigodD1uLnNlbGVjdElkcykhPW51bGwmJnQubGVuZ3RoKWZvcihjb25zdCBhIG9mIG4uc2VsZWN0SWRzKXIuZGVsZXRlKGEpO2Zvcihjb25zdCBuIG9mIHMua2V5cygpKXIuZGVsZXRlKG4pO3JldHVybiByfXJldHVybiBlfX1PYmplY3QuZGVmaW5lUHJvcGVydHkobmUsImVyYXNlclNpemVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6T2JqZWN0LmZyZWV6ZShbT2JqZWN0LmZyZWV6ZSh7d2lkdGg6MTgsaGVpZ2h0OjI2fSksT2JqZWN0LmZyZWV6ZSh7d2lkdGg6MjYsaGVpZ2h0OjM0fSksT2JqZWN0LmZyZWV6ZSh7d2lkdGg6MzQsaGVpZ2h0OjUwfSldKX0pO2NvbnN0IFZoPSIrKyIsZWQ9InNlbGVjdG9yIix0ZD0iYWxsIjt2YXIgcmQ9Il9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18iO2Z1bmN0aW9uIG9kKG8pe3JldHVybiB0aGlzLl9fZGF0YV9fLnNldChvLHJkKSx0aGlzfXZhciBzZD1vZDtmdW5jdGlvbiBpZChvKXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMobyl9dmFyIG5kPWlkLGFkPVd0LGxkPXNkLGNkPW5kO2Z1bmN0aW9uIFFlKG8pe3ZhciBlPS0xLHQ9bz09bnVsbD8wOm8ubGVuZ3RoO2Zvcih0aGlzLl9fZGF0YV9fPW5ldyBhZDsrK2U8dDspdGhpcy5hZGQob1tlXSl9UWUucHJvdG90eXBlLmFkZD1RZS5wcm90b3R5cGUucHVzaD1sZCxRZS5wcm90b3R5cGUuaGFzPWNkO3ZhciB1ZD1RZTtmdW5jdGlvbiBoZChvLGUpe2Zvcih2YXIgdD0tMSxyPW89PW51bGw/MDpvLmxlbmd0aDsrK3Q8cjspaWYoZShvW3RdLHQsbykpcmV0dXJuITA7cmV0dXJuITF9dmFyIGRkPWhkO2Z1bmN0aW9uIGZkKG8sZSl7cmV0dXJuIG8uaGFzKGUpfXZhciBwZD1mZCx5ZD11ZCx3ZD1kZCxtZD1wZCxnZD0xLGJkPTI7ZnVuY3Rpb24gdmQobyxlLHQscixpLHMpe3ZhciBuPXQmZ2QsYT1vLmxlbmd0aCxsPWUubGVuZ3RoO2lmKGEhPWwmJiEobiYmbD5hKSlyZXR1cm4hMTt2YXIgYz1zLmdldChvKSx1PXMuZ2V0KGUpO2lmKGMmJnUpcmV0dXJuIGM9PWUmJnU9PW87dmFyIGg9LTEsZD0hMCxmPXQmYmQ/bmV3IHlkOnZvaWQgMDtmb3Iocy5zZXQobyxlKSxzLnNldChlLG8pOysraDxhOyl7dmFyIHc9b1toXSx5PWVbaF07aWYocil2YXIgZz1uP3IoeSx3LGgsZSxvLHMpOnIodyx5LGgsbyxlLHMpO2lmKGchPT12b2lkIDApe2lmKGcpY29udGludWU7ZD0hMTticmVha31pZihmKXtpZighd2QoZSxmdW5jdGlvbihQLGspe2lmKCFtZChmLGspJiYodz09PVB8fGkodyxQLHQscixzKSkpcmV0dXJuIGYucHVzaChrKX0pKXtkPSExO2JyZWFrfX1lbHNlIGlmKCEodz09PXl8fGkodyx5LHQscixzKSkpe2Q9ITE7YnJlYWt9fXJldHVybiBzLmRlbGV0ZShvKSxzLmRlbGV0ZShlKSxkfXZhciBXcj12ZDtmdW5jdGlvbiBTZChvKXt2YXIgZT0tMSx0PUFycmF5KG8uc2l6ZSk7cmV0dXJuIG8uZm9yRWFjaChmdW5jdGlvbihyLGkpe3RbKytlXT1baSxyXX0pLHR9dmFyIGtkPVNkO2Z1bmN0aW9uIFBkKG8pe3ZhciBlPS0xLHQ9QXJyYXkoby5zaXplKTtyZXR1cm4gby5mb3JFYWNoKGZ1bmN0aW9uKHIpe3RbKytlXT1yfSksdH12YXIgVGQ9UGQsUnI9RGUsQXI9c3IsSWQ9VmUseGQ9V3IsT2Q9a2QsTGQ9VGQsQ2Q9MSxOZD0yLFdkPSJbb2JqZWN0IEJvb2xlYW5dIixSZD0iW29iamVjdCBEYXRlXSIsQWQ9IltvYmplY3QgRXJyb3JdIixNZD0iW29iamVjdCBNYXBdIiwkZD0iW29iamVjdCBOdW1iZXJdIixEZD0iW29iamVjdCBSZWdFeHBdIixqZD0iW29iamVjdCBTZXRdIixGZD0iW29iamVjdCBTdHJpbmddIixCZD0iW29iamVjdCBTeW1ib2xdIixfZD0iW29iamVjdCBBcnJheUJ1ZmZlcl0iLEVkPSJbb2JqZWN0IERhdGFWaWV3XSIsTXI9UnI/UnIucHJvdG90eXBlOnZvaWQgMCxtdD1Ncj9Nci52YWx1ZU9mOnZvaWQgMDtmdW5jdGlvbiB6ZChvLGUsdCxyLGkscyxuKXtzd2l0Y2godCl7Y2FzZSBFZDppZihvLmJ5dGVMZW5ndGghPWUuYnl0ZUxlbmd0aHx8by5ieXRlT2Zmc2V0IT1lLmJ5dGVPZmZzZXQpcmV0dXJuITE7bz1vLmJ1ZmZlcixlPWUuYnVmZmVyO2Nhc2UgX2Q6cmV0dXJuIShvLmJ5dGVMZW5ndGghPWUuYnl0ZUxlbmd0aHx8IXMobmV3IEFyKG8pLG5ldyBBcihlKSkpO2Nhc2UgV2Q6Y2FzZSBSZDpjYXNlICRkOnJldHVybiBJZCgrbywrZSk7Y2FzZSBBZDpyZXR1cm4gby5uYW1lPT1lLm5hbWUmJm8ubWVzc2FnZT09ZS5tZXNzYWdlO2Nhc2UgRGQ6Y2FzZSBGZDpyZXR1cm4gbz09ZSsiIjtjYXNlIE1kOnZhciBhPU9kO2Nhc2UgamQ6dmFyIGw9ciZDZDtpZihhfHwoYT1MZCksby5zaXplIT1lLnNpemUmJiFsKXJldHVybiExO3ZhciBjPW4uZ2V0KG8pO2lmKGMpcmV0dXJuIGM9PWU7cnw9TmQsbi5zZXQobyxlKTt2YXIgdT14ZChhKG8pLGEoZSkscixpLHMsbik7cmV0dXJuIG4uZGVsZXRlKG8pLHU7Y2FzZSBCZDppZihtdClyZXR1cm4gbXQuY2FsbChvKT09bXQuY2FsbChlKX1yZXR1cm4hMX12YXIgVWQ9emQsJHI9SnQsR2Q9MSxYZD1PYmplY3QucHJvdG90eXBlLEhkPVhkLmhhc093blByb3BlcnR5O2Z1bmN0aW9uIFlkKG8sZSx0LHIsaSxzKXt2YXIgbj10JkdkLGE9JHIobyksbD1hLmxlbmd0aCxjPSRyKGUpLHU9Yy5sZW5ndGg7aWYobCE9dSYmIW4pcmV0dXJuITE7Zm9yKHZhciBoPWw7aC0tOyl7dmFyIGQ9YVtoXTtpZighKG4/ZCBpbiBlOkhkLmNhbGwoZSxkKSkpcmV0dXJuITF9dmFyIGY9cy5nZXQobyksdz1zLmdldChlKTtpZihmJiZ3KXJldHVybiBmPT1lJiZ3PT1vO3ZhciB5PSEwO3Muc2V0KG8sZSkscy5zZXQoZSxvKTtmb3IodmFyIGc9bjsrK2g8bDspe2Q9YVtoXTt2YXIgUD1vW2RdLGs9ZVtkXTtpZihyKXZhciBPPW4/cihrLFAsZCxlLG8scyk6cihQLGssZCxvLGUscyk7aWYoIShPPT09dm9pZCAwP1A9PT1rfHxpKFAsayx0LHIscyk6Tykpe3k9ITE7YnJlYWt9Z3x8KGc9ZD09ImNvbnN0cnVjdG9yIil9aWYoeSYmIWcpe3ZhciBJPW8uY29uc3RydWN0b3IsYj1lLmNvbnN0cnVjdG9yO0khPWImJiJjb25zdHJ1Y3RvciJpbiBvJiYiY29uc3RydWN0b3IiaW4gZSYmISh0eXBlb2YgST09ImZ1bmN0aW9uIiYmSSBpbnN0YW5jZW9mIEkmJnR5cGVvZiBiPT0iZnVuY3Rpb24iJiZiIGluc3RhbmNlb2YgYikmJih5PSExKX1yZXR1cm4gcy5kZWxldGUobykscy5kZWxldGUoZSkseX12YXIgcWQ9WWQsZ3Q9UnQsWmQ9V3IsUWQ9VWQsSmQ9cWQsRHI9R2UsanI9X2UsRnI9cnQsS2Q9RXQsVmQ9MSxCcj0iW29iamVjdCBBcmd1bWVudHNdIixfcj0iW29iamVjdCBBcnJheV0iLEplPSJbb2JqZWN0IE9iamVjdF0iLGVmPU9iamVjdC5wcm90b3R5cGUsRXI9ZWYuaGFzT3duUHJvcGVydHk7ZnVuY3Rpb24gdGYobyxlLHQscixpLHMpe3ZhciBuPWpyKG8pLGE9anIoZSksbD1uP19yOkRyKG8pLGM9YT9fcjpEcihlKTtsPWw9PUJyP0plOmwsYz1jPT1Ccj9KZTpjO3ZhciB1PWw9PUplLGg9Yz09SmUsZD1sPT1jO2lmKGQmJkZyKG8pKXtpZighRnIoZSkpcmV0dXJuITE7bj0hMCx1PSExfWlmKGQmJiF1KXJldHVybiBzfHwocz1uZXcgZ3QpLG58fEtkKG8pP1pkKG8sZSx0LHIsaSxzKTpRZChvLGUsbCx0LHIsaSxzKTtpZighKHQmVmQpKXt2YXIgZj11JiZFci5jYWxsKG8sIl9fd3JhcHBlZF9fIiksdz1oJiZFci5jYWxsKGUsIl9fd3JhcHBlZF9fIik7aWYoZnx8dyl7dmFyIHk9Zj9vLnZhbHVlKCk6byxnPXc/ZS52YWx1ZSgpOmU7cmV0dXJuIHN8fChzPW5ldyBndCksaSh5LGcsdCxyLHMpfX1yZXR1cm4gZD8oc3x8KHM9bmV3IGd0KSxKZChvLGUsdCxyLGkscykpOiExfXZhciByZj10ZixvZj1yZix6cj1jZTtmdW5jdGlvbiBVcihvLGUsdCxyLGkpe3JldHVybiBvPT09ZT8hMDpvPT1udWxsfHxlPT1udWxsfHwhenIobykmJiF6cihlKT9vIT09byYmZSE9PWU6b2YobyxlLHQscixVcixpKX12YXIgc2Y9VXIsbmY9c2Y7ZnVuY3Rpb24gYWYobyxlKXtyZXR1cm4gbmYobyxlKX12YXIgbGY9YWYsR3I9bWUobGYpO2NsYXNzIEUgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlNlbGVjdG9yfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlbGVjdElkcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZWxlY3RvckNvbG9yIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN0cm9rZUNvbG9yIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZpbGxDb2xvciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRTZWxlY3RSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblRleHRFZGl0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuTG9jayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZXMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2hhcGVPcHQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidGV4dE9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJpc0xvY2tlZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdH1jb21wdXRTZWxlY3RvcihlPSEwKXtjb25zdCB0PUcodGhpcy50bXBQb2ludHMpO2lmKHQudz09PTB8fHQuaD09PTApcmV0dXJue3NlbGVjdElkczpbXSxpbnRlcnNlY3RSZWN0OnZvaWQgMCxzdWJOb2RlTWFwOm5ldyBNYXB9O2NvbnN0e3JlY3RSYW5nZTpyLG5vZGVSYW5nZTppfT10aGlzLnZOb2Rlcy5nZXRSZWN0SW50ZXJzZWN0UmFuZ2UodCxlKTtyZXR1cm57c2VsZWN0SWRzOlsuLi5pLmtleXMoKV0saW50ZXJzZWN0UmVjdDpyLHN1Yk5vZGVNYXA6aX19dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PXRoaXMudG1wUG9pbnRzLmxlbmd0aCxyPWUubGVuZ3RoO2lmKHI+MSl7Y29uc3QgaT1uZXcgUihlW3ItMl0qdGhpcy5mdWxsTGF5ZXIud29ybGRTY2FsaW5nWzBdK3RoaXMuZnVsbExheWVyLndvcmxkUG9zaXRpb25bMF0sZVtyLTFdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdKTt0PT09Mj90aGlzLnRtcFBvaW50cy5zcGxpY2UoMSwxLGkpOnRoaXMudG1wUG9pbnRzLnB1c2goaSl9fWRyYXdTZWxlY3RvcihlKXtjb25zdHtkcmF3UmVjdDp0LHN1Yk5vZGVNYXA6cixzZWxlY3RvcklkOmksbGF5ZXI6cyxpc1NlcnZpY2U6bn09ZSxhPW5ldyB6Lkdyb3VwKHtwb3M6W3QueCx0LnldLGFuY2hvcjpbMCwwXSxzaXplOlt0LncsdC5oXSxpZDppLG5hbWU6aSx6SW5kZXg6MWUzfSksbD1bXTtpZihuKXtjb25zdCBjPW5ldyB6LlJlY3Qoe25vcm1hbGl6ZTohMCxwb3M6W3Qudy8yLHQuaC8yXSxsaW5lV2lkdGg6MSxzdHJva2VDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3J8fHRoaXMud29ya09wdGlvbnMuc3Ryb2tlQ29sb3Isd2lkdGg6dC53LGhlaWdodDp0LmgsbmFtZTpFLnNlbGVjdG9yQm9yZGVySWR9KTtsLnB1c2goYyl9ci5mb3JFYWNoKChjLHUpPT57Y29uc3QgaD1bYy5yZWN0LngrYy5yZWN0LncvMi10LngsYy5yZWN0LnkrYy5yZWN0LmgvMi10LnldLGQ9bmV3IHouUmVjdCh7bm9ybWFsaXplOiEwLHBvczpoLGxpbmVXaWR0aDoxLHN0cm9rZUNvbG9yOnIuc2l6ZT4xP3RoaXMuc2VsZWN0b3JDb2xvcnx8dGhpcy53b3JrT3B0aW9ucy5zdHJva2VDb2xvcjp2b2lkIDAsd2lkdGg6Yy5yZWN0LncsaGVpZ2h0OmMucmVjdC5oLGlkOmBzZWxlY3Rvci0ke3V9YCxuYW1lOmBzZWxlY3Rvci0ke3V9YH0pO2wucHVzaChkKX0pLGwmJmEuYXBwZW5kKC4uLmwpLChzPT1udWxsP3ZvaWQgMDpzLnBhcmVudCkuYXBwZW5kQ2hpbGQoYSl9ZHJhdyhlLHQscixpPSExKXt2YXIgYSxsO2NvbnN0e2ludGVyc2VjdFJlY3Q6cyxzdWJOb2RlTWFwOm59PXI7KGw9KGE9dC5wYXJlbnQpPT1udWxsP3ZvaWQgMDphLmdldEVsZW1lbnRCeUlkKGUpKT09bnVsbHx8bC5yZW1vdmUoKSxzJiZ0aGlzLmRyYXdTZWxlY3Rvcih7ZHJhd1JlY3Q6cyxzdWJOb2RlTWFwOm4sc2VsZWN0b3JJZDplLGxheWVyOnQsaXNTZXJ2aWNlOml9KX1nZXRTZWxlY3Rlb3JJbmZvKGUpe3RoaXMuc2NhbGVUeXBlPXEuYWxsLHRoaXMuY2FuUm90YXRlPSExLHRoaXMudGV4dE9wdD12b2lkIDAsdGhpcy5zdHJva2VDb2xvcj12b2lkIDAsdGhpcy5maWxsQ29sb3I9dm9pZCAwLHRoaXMuY2FuVGV4dEVkaXQ9ITEsdGhpcy5jYW5Mb2NrPSExLHRoaXMuaXNMb2NrZWQ9ITEsdGhpcy50b29sc1R5cGVzPXZvaWQgMCx0aGlzLnNoYXBlT3B0PXZvaWQgMDtjb25zdCB0PW5ldyBTZXQ7bGV0IHI7Zm9yKGNvbnN0IGkgb2YgZS52YWx1ZXMoKSl7Y29uc3R7b3B0OnMsY2FuUm90YXRlOm4sc2NhbGVUeXBlOmEsdG9vbHNUeXBlOmx9PWk7dGhpcy5zZWxlY3RvckNvbG9yPXRoaXMud29ya09wdGlvbnMuc3Ryb2tlQ29sb3Iscy5zdHJva2VDb2xvciYmKHRoaXMuc3Ryb2tlQ29sb3I9cy5zdHJva2VDb2xvcikscy5maWxsQ29sb3ImJih0aGlzLmZpbGxDb2xvcj1zLmZpbGxDb2xvcikscy50ZXh0T3B0JiYodGhpcy50ZXh0T3B0PXMudGV4dE9wdCksbD09PVMuU3BlZWNoQmFsbG9vbiYmKHQuYWRkKGwpLHRoaXMuc2hhcGVPcHR8fCh0aGlzLnNoYXBlT3B0PXt9KSx0aGlzLnNoYXBlT3B0LnBsYWNlbWVudD1zLnBsYWNlbWVudCksbD09PVMuUG9seWdvbiYmKHQuYWRkKGwpLHRoaXMuc2hhcGVPcHR8fCh0aGlzLnNoYXBlT3B0PXt9KSx0aGlzLnNoYXBlT3B0LnZlcnRpY2VzPXMudmVydGljZXMpLGw9PT1TLlN0YXImJih0LmFkZChsKSx0aGlzLnNoYXBlT3B0fHwodGhpcy5zaGFwZU9wdD17fSksdGhpcy5zaGFwZU9wdC52ZXJ0aWNlcz1zLnZlcnRpY2VzLHRoaXMuc2hhcGVPcHQuaW5uZXJSYXRpbz1zLmlubmVyUmF0aW8sdGhpcy5zaGFwZU9wdC5pbm5lclZlcnRpY2VTdGVwPXMuaW5uZXJWZXJ0aWNlU3RlcCksbD09PVMuVGV4dCYmKHRoaXMudGV4dE9wdD1zKSxlLnNpemU9PT0xJiYodGhpcy50ZXh0T3B0JiYodGhpcy5jYW5UZXh0RWRpdD0hMCksdGhpcy5jYW5Sb3RhdGU9bix0aGlzLnNjYWxlVHlwZT1hKSxhPT09cS5ub25lJiYodGhpcy5zY2FsZVR5cGU9YSksbD09PVMuSW1hZ2UmJihyPWkpfXQuc2l6ZSYmKHRoaXMudG9vbHNUeXBlcz1bLi4udF0pLHImJihlLnNpemU9PT0xPyh0aGlzLmNhbkxvY2s9ITAsci5vcHQubG9ja2VkJiYodGhpcy5pc0xvY2tlZD0hMCx0aGlzLnNjYWxlVHlwZT1xLm5vbmUsdGhpcy5jYW5Sb3RhdGU9ITEsdGhpcy50ZXh0T3B0PXZvaWQgMCx0aGlzLmZpbGxDb2xvcj12b2lkIDAsdGhpcy5zZWxlY3RvckNvbG9yPSJyZ2IoMTc3LDE3NywxNzcpIix0aGlzLnN0cm9rZUNvbG9yPXZvaWQgMCx0aGlzLmNhblRleHRFZGl0PSExKSk6ZS5zaXplPjEmJiFyLm9wdC5sb2NrZWQmJih0aGlzLmNhbkxvY2s9ITEsdGhpcy5jYW5Sb3RhdGU9ITEpKX1nZXRDaGlsZHJlblBvaW50cygpe3ZhciBlO2lmKHRoaXMuc2NhbGVUeXBlPT09cS5ib3RoJiZ0aGlzLnNlbGVjdElkcyl7Y29uc3QgdD10aGlzLnNlbGVjdElkc1swXSxyPShlPXRoaXMudk5vZGVzLmdldCh0KSk9PW51bGw/dm9pZCAwOmUub3A7aWYocil7Y29uc3QgaT1bXTtmb3IobGV0IHM9MDtzPHIubGVuZ3RoO3MrPTMpaS5wdXNoKFtyW3NdLHJbcysxXV0pO3JldHVybiBpfX19Y29uc3VtZShlKXtjb25zdHtvcDp0LHdvcmtTdGF0ZTpyfT1lLmRhdGE7bGV0IGk9dGhpcy5vbGRTZWxlY3RSZWN0O2lmKHI9PT1GLlN0YXJ0JiYoaT10aGlzLmJhY2tUb0Z1bGxMYXllcigpKSwhKHQhPW51bGwmJnQubGVuZ3RoKXx8IXRoaXMudk5vZGVzLmN1ck5vZGVNYXAuc2l6ZSlyZXR1cm57dHlwZTptLk5vbmV9O3RoaXMudXBkYXRlVGVtcFBvaW50cyh0KTtjb25zdCBzPXRoaXMuY29tcHV0U2VsZWN0b3IoKTtpZih0aGlzLnNlbGVjdElkcyYmRWgodGhpcy5zZWxlY3RJZHMscy5zZWxlY3RJZHMpKXJldHVybnt0eXBlOm0uTm9uZX07dGhpcy5zZWxlY3RJZHM9cy5zZWxlY3RJZHM7Y29uc3Qgbj1zLmludGVyc2VjdFJlY3Q7dGhpcy5nZXRTZWxlY3Rlb3JJbmZvKHMuc3ViTm9kZU1hcCksdGhpcy5kcmF3KEUuc2VsZWN0b3JJZCx0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIscyksdGhpcy5vbGRTZWxlY3RSZWN0PW47Y29uc3QgYT10aGlzLmdldENoaWxkcmVuUG9pbnRzKCk7cmV0dXJue3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxyZWN0Ok0obixpKSxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsb3B0OnRoaXMud29ya09wdGlvbnMsc2VsZWN0UmVjdDpuLHNlbGVjdG9yQ29sb3I6dGhpcy5zZWxlY3RvckNvbG9yLHN0cm9rZUNvbG9yOnRoaXMuc3Ryb2tlQ29sb3IsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLHRleHRPcHQ6dGhpcy50ZXh0T3B0LGNhblRleHRFZGl0OnRoaXMuY2FuVGV4dEVkaXQsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNhbkxvY2s6dGhpcy5jYW5Mb2NrLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSx3aWxsU3luY1NlcnZpY2U6ITAscG9pbnRzOmEsaXNMb2NrZWQ6dGhpcy5pc0xvY2tlZCx0b29sc1R5cGVzOnRoaXMudG9vbHNUeXBlcyxzaGFwZU9wdDp0aGlzLnNoYXBlT3B0fX1jb25zdW1lQWxsKGUpe3ZhciB0LHI7aWYoISgodD10aGlzLnNlbGVjdElkcykhPW51bGwmJnQubGVuZ3RoKSYmdGhpcy50bXBQb2ludHNbMF0mJnRoaXMuc2VsZWN0U2luZ2xlVG9vbCh0aGlzLnRtcFBvaW50c1swXS5YWSxFLnNlbGVjdG9ySWQsITEsZT09bnVsbD92b2lkIDA6ZS5ob3ZlcklkKSwocj10aGlzLnNlbGVjdElkcykhPW51bGwmJnIubGVuZ3RoJiZ0aGlzLnNlYWxUb0RyYXdMYXllcih0aGlzLnNlbGVjdElkcyksdGhpcy5vbGRTZWxlY3RSZWN0KXtjb25zdCBpPXRoaXMuZ2V0Q2hpbGRyZW5Qb2ludHMoKTtyZXR1cm57dHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6dGhpcy5vbGRTZWxlY3RSZWN0LHNlbGVjdElkczp0aGlzLnNlbGVjdElkcyxvcHQ6dGhpcy53b3JrT3B0aW9ucyxzZWxlY3RvckNvbG9yOnRoaXMuc2VsZWN0b3JDb2xvcixzZWxlY3RSZWN0OnRoaXMub2xkU2VsZWN0UmVjdCxzdHJva2VDb2xvcjp0aGlzLnN0cm9rZUNvbG9yLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcix0ZXh0T3B0OnRoaXMudGV4dE9wdCxjYW5UZXh0RWRpdDp0aGlzLmNhblRleHRFZGl0LGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjYW5Mb2NrOnRoaXMuY2FuTG9jayxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsd2lsbFN5bmNTZXJ2aWNlOiEwLHBvaW50czppLGlzTG9ja2VkOnRoaXMuaXNMb2NrZWQsdG9vbHNUeXBlczp0aGlzLnRvb2xzVHlwZXMsc2hhcGVPcHQ6dGhpcy5zaGFwZU9wdH19cmV0dXJue3R5cGU6bS5Ob25lfX1jb25zdW1lU2VydmljZSgpe31jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfWNsZWFyU2VsZWN0RGF0YSgpe3RoaXMuc2VsZWN0SWRzPXZvaWQgMCx0aGlzLm9sZFNlbGVjdFJlY3Q9dm9pZCAwfXNlbGVjdFNpbmdsZVRvb2woZSx0PUUuc2VsZWN0b3JJZCxyPSExLGkpe2lmKGUubGVuZ3RoPT09Mil7Y29uc3Qgcz1lWzBdLG49ZVsxXTtsZXQgYTtmb3IoY29uc3QgbCBvZiB0aGlzLmZ1bGxMYXllci5jaGlsZHJlbil7Y29uc3QgYz1lbyhbbF0pO2xldCB1PSExO2lmKChpJiZpPT09bC5uYW1lfHwhMSkmJmMuZmluZChkPT5kLmlzUG9pbnRDb2xsaXNpb24ocyxuKSkpe2E9bDticmVha31mb3IoY29uc3QgZCBvZiBjKWlmKHU9ZC5pc1BvaW50Q29sbGlzaW9uKHMsbiksdSl7aWYoIWEpYT1sO2Vsc2V7Y29uc3QgZj10aGlzLnZOb2Rlcy5nZXQobC5uYW1lKSx3PXRoaXMudk5vZGVzLmdldChhLm5hbWUpO2lmKChmPT1udWxsP3ZvaWQgMDpmLnRvb2xzVHlwZSkhPT1TLlRleHQmJih3PT1udWxsP3ZvaWQgMDp3LnRvb2xzVHlwZSk9PT1TLlRleHQpYnJlYWs7aWYoKGY9PW51bGw/dm9pZCAwOmYudG9vbHNUeXBlKT09PVMuVGV4dCYmKHc9PW51bGw/dm9pZCAwOncudG9vbHNUeXBlKSE9PVMuVGV4dClhPWw7ZWxzZXtjb25zdCB5PShmPT1udWxsP3ZvaWQgMDpmLm9wdC56SW5kZXgpfHwwLGc9KHc9PW51bGw/dm9pZCAwOncub3B0LnpJbmRleCl8fDA7TnVtYmVyKHkpPj1OdW1iZXIoZykmJihhPWwpfX1icmVha319aWYoYSl7Y29uc3QgbD1hLm5hbWUsYz10aGlzLnZOb2Rlcy5nZXQobCk7aWYoYyl7aWYoIUdyKHRoaXMub2xkU2VsZWN0UmVjdCxjLnJlY3QpKXtjb25zdCB1PW5ldyBNYXAoW1tsLGNdXSk7dGhpcy5nZXRTZWxlY3Rlb3JJbmZvKHUpLHRoaXMuZHJhdyh0LHRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcix7aW50ZXJzZWN0UmVjdDpjLnJlY3Qsc3ViTm9kZU1hcDp1LHNlbGVjdElkczp0aGlzLnNlbGVjdElkc3x8W119LHIpfXRoaXMuc2VsZWN0SWRzPVtsXSx0aGlzLm9sZFNlbGVjdFJlY3Q9Yy5yZWN0fX19fWJhY2tUb0Z1bGxMYXllcihlKXt2YXIgcyxuO2xldCB0O2NvbnN0IHI9W10saT1bXTtmb3IoY29uc3QgYSBvZigocz10aGlzLmRyYXdMYXllcik9PW51bGw/dm9pZCAwOnMuY2hpbGRyZW4pfHxbXSlpZighKGUhPW51bGwmJmUubGVuZ3RoJiYhZS5pbmNsdWRlcyhhLmlkKSkmJmEuaWQhPT1FLnNlbGVjdG9ySWQpe2NvbnN0IGw9YS5jbG9uZU5vZGUoITApO0hlKGEpJiZsLnNlYWwoKSx0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShhLm5hbWUpLmxlbmd0aHx8ci5wdXNoKGwpLGkucHVzaChhKTtjb25zdCBjPShuPXRoaXMudk5vZGVzLmdldChhLm5hbWUpKT09bnVsbD92b2lkIDA6bi5yZWN0O2MmJih0PU0odCxjKSl9cmV0dXJuIGkuZm9yRWFjaChhPT5hLnJlbW92ZSgpKSxyLmxlbmd0aCYmdGhpcy5mdWxsTGF5ZXIuYXBwZW5kKC4uLnIpLHR9c2VhbFRvRHJhd0xheWVyKGUpe3ZhciBpO2NvbnN0IHQ9W10scj1bXTtlLmZvckVhY2gocz0+e3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHMudG9TdHJpbmcoKSkuZm9yRWFjaChuPT57dmFyIGw7Y29uc3QgYT1uLmNsb25lTm9kZSghMCk7SGUobikmJmEuc2VhbCgpLChsPXRoaXMuZHJhd0xheWVyKSE9bnVsbCYmbC5nZXRFbGVtZW50c0J5TmFtZShuLm5hbWUpLmxlbmd0aHx8dC5wdXNoKGEpLHIucHVzaChuKX0pfSksci5mb3JFYWNoKHM9PnMucmVtb3ZlKCkpLHQmJigoaT10aGlzLmRyYXdMYXllcik9PW51bGx8fGkuYXBwZW5kKC4uLnQpKX1nZXRTZWxlY3RvclJlY3QoZSx0KXt2YXIgbjtsZXQgcjtjb25zdCBpPShuPWUucGFyZW50KT09bnVsbD92b2lkIDA6bi5nZXRFbGVtZW50QnlJZCh0KSxzPWk9PW51bGw/dm9pZCAwOmkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuIHMmJihyPU0ocix7eDpNYXRoLmZsb29yKHMueCkseTpNYXRoLmZsb29yKHMueSksdzpNYXRoLnJvdW5kKHMud2lkdGgpLGg6TWF0aC5yb3VuZChzLmhlaWdodCl9KSkscn1pc0NhbkZpbGxDb2xvcihlKXtyZXR1cm4gZT09PVMuRWxsaXBzZXx8ZT09PVMuVHJpYW5nbGV8fGU9PT1TLlJlY3RhbmdsZXx8ZT09PVMuUG9seWdvbnx8ZT09PVMuU3Rhcnx8ZT09PVMuU3BlZWNoQmFsbG9vbn1hc3luYyB1cGRhdGVTZWxlY3RvcihlKXtjb25zdHt1cGRhdGVTZWxlY3Rvck9wdDp0LHNlbGVjdElkczpyLHZOb2RlczppLHdpbGxTZXJpYWxpemVEYXRhOnMsd29ya2VyOm4sb2Zmc2V0OmEsc2NlbmU6bH09ZSxjPXRoaXMuZHJhd0xheWVyO2lmKCFjKXJldHVybjtsZXQgdTtjb25zdCBoPW5ldyBNYXAse2JveDpkLHdvcmtTdGF0ZTpmLGFuZ2xlOncsdHJhbnNsYXRlOnl9PXQ7bGV0IGc9WzAsMF0sUD1bMSwxXSxrPVswLDBdLE8sSTtpZihkfHx5fHxoZSh3KSl7aWYoZj09PUYuU3RhcnQpcmV0dXJuIGkuc2V0VGFyZ2V0KCkse3R5cGU6bS5TZWxlY3QsZGF0YVR5cGU6Vy5Mb2NhbCxzZWxlY3RSZWN0OnRoaXMub2xkU2VsZWN0UmVjdCxyZWN0OnRoaXMub2xkU2VsZWN0UmVjdH07aWYoTz1pLmdldExhc3RUYXJnZXQoKSxPJiZkKXtsZXQgTDtyPT1udWxsfHxyLmZvckVhY2goVD0+e2NvbnN0IEE9Tz09bnVsbD92b2lkIDA6Ty5nZXQoVCk7TD1NKEwsQT09bnVsbD92b2lkIDA6QS5yZWN0KX0pLEwmJihQPVtkLncvTC53LGQuaC9MLmhdLGc9W2QueCtkLncvMi0oTC54K0wudy8yKSxkLnkrZC5oLzItKEwueStMLmgvMildLGs9W0wueCtMLncvMixMLnkrTC5oLzJdKSxJPUx9fWlmKHIpZm9yKGNvbnN0IEwgb2Ygcil7Y29uc3QgVD1pLmdldChMKTtpZihUKXtjb25zdHt0b29sc1R5cGU6QX09VDtsZXQgJD0oYz09bnVsbD92b2lkIDA6Yy5nZXRFbGVtZW50c0J5TmFtZShMKSlbMF07aWYoJCl7Y29uc3QgRD17Li4udH07bGV0IEg7aWYoQSl7aWYoTyYmKEg9Ty5nZXQoTCksSCYmZCkpe0QuYm94U2NhbGU9UDtjb25zdCBlZT1bSC5yZWN0LngrSC5yZWN0LncvMixILnJlY3QueStILnJlY3QuaC8yXSxzZT1bZWVbMF0ta1swXSxlZVsxXS1rWzFdXTtELmJveFRyYW5zbGF0ZT1bc2VbMF0qKFBbMF0tMSkrZ1swXSsoYSYmYVswXXx8MCksc2VbMV0qKFBbMV0tMSkrZ1sxXSsoYSYmYVsxXXx8MCldfWNvbnN0IFY9VnIoQSk7aWYoVj09bnVsbHx8Vi51cGRhdGVOb2RlT3B0KHtub2RlOiQsb3B0OkQsdk5vZGVzOmksd2lsbFNlcmlhbGl6ZURhdGE6cyx0YXJnZXROb2RlOkh9KSxUJiZuJiYocyYmKEQuYW5nbGV8fEQudHJhbnNsYXRlKXx8RC5ib3gmJkQud29ya1N0YXRlIT09Ri5TdGFydHx8RC5wb2ludE1hcCYmRC5wb2ludE1hcC5oYXMoTCl8fEE9PT1TLlRleHQmJihELmZvbnRTaXplfHxELnRyYW5zbGF0ZXx8RC50ZXh0SW5mb3MmJkQudGV4dEluZm9zLmdldChMKSl8fEE9PT1TLkltYWdlJiYoRC5hbmdsZXx8RC50cmFuc2xhdGV8fEQuYm94U2NhbGUpfHxBPT09RC50b29sc1R5cGUmJkQud2lsbFJlZnJlc2gpKXtjb25zdCBlZT1uLmNyZWF0ZVdvcmtTaGFwZU5vZGUoe3Rvb2xzVHlwZTpBLHRvb2xzT3B0OlQub3B0fSk7ZWU9PW51bGx8fGVlLnNldFdvcmtJZChMKTtsZXQgc2U7QT09PVMuSW1hZ2UmJmw/c2U9YXdhaXQgZWUuY29uc3VtZVNlcnZpY2VBc3luYyh7aXNGdWxsV29yazohMSxyZXBsYWNlSWQ6TCxzY2VuZTpsfSk6c2U9ZWU9PW51bGw/dm9pZCAwOmVlLmNvbnN1bWVTZXJ2aWNlKHtvcDpULm9wLGlzRnVsbFdvcms6ITEscmVwbGFjZUlkOkwsaXNDbGVhckFsbDohMX0pLHNlJiYoVC5yZWN0PXNlLGkuc2V0SW5mbyhMLFQpKSwkPShjPT1udWxsP3ZvaWQgMDpjLmdldEVsZW1lbnRzQnlOYW1lKEwpKVswXX1UJiYoaC5zZXQoTCxUKSx1PU0odSxULnJlY3QpKX19fX1PJiZmPT09Ri5Eb25lJiZpLmRlbGV0ZUxhc3RUYXJnZXQoKTtjb25zdCBiPXU7aWYoSSYmdC5kaXImJmIpe2xldCBMPVswLDBdO3N3aXRjaCh0LmRpcil7Y2FzZSJ0b3BMZWZ0IjpjYXNlImxlZnQiOntjb25zdCBUPVtJLngrSS53LEkueStJLmhdO0w9W1RbMF0tKGIueCtiLncpLFRbMV0tKGIueStiLmgpXTticmVha31jYXNlImJvdHRvbUxlZnQiOmNhc2UiYm90dG9tIjp7Y29uc3QgVD1bSS54K0kudyxJLnldO0w9W1RbMF0tKGIueCtiLncpLFRbMV0tYi55XTticmVha31jYXNlInRvcFJpZ2h0IjpjYXNlInRvcCI6e2NvbnN0IFQ9W0kueCxJLnkrSS5oXTtMPVtUWzBdLWIueCxUWzFdLShiLnkrYi5oKV07YnJlYWt9Y2FzZSJyaWdodCI6Y2FzZSJib3R0b21SaWdodCI6e2NvbnN0IFQ9W0kueCxJLnldO0w9W1RbMF0tYi54LFRbMV0tYi55XTticmVha319aWYoTFswXXx8TFsxXSlyZXR1cm4gYi54PWIueCtMWzBdLGIueT1iLnkrTFsxXSxhd2FpdCB0aGlzLnVwZGF0ZVNlbGVjdG9yKHsuLi5lLG9mZnNldDpMfSl9dGhpcy5nZXRTZWxlY3Rlb3JJbmZvKGgpLHRoaXMuZHJhdyhFLnNlbGVjdG9ySWQsYyx7c2VsZWN0SWRzOnJ8fFtdLHN1Yk5vZGVNYXA6aCxpbnRlcnNlY3RSZWN0OmJ9KTtjb25zdCB2PU0odGhpcy5vbGRTZWxlY3RSZWN0LHUpO3JldHVybiB0aGlzLm9sZFNlbGVjdFJlY3Q9dSx7dHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLkxvY2FsLHNlbGVjdFJlY3Q6YixyZW5kZXJSZWN0OnUscmVjdDpNKHYsYil9fWJsdXJTZWxlY3Rvcigpe2NvbnN0IGU9dGhpcy5iYWNrVG9GdWxsTGF5ZXIoKTtyZXR1cm57dHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6ZSxzZWxlY3RJZHM6W10sd2lsbFN5bmNTZXJ2aWNlOiEwfX1nZXRSaWdodFNlcnZpY2VJZChlKXtyZXR1cm4gZS5yZXBsYWNlKCIrKyIsIi0iKX1zZWxlY3RTZXJ2aWNlTm9kZShlLHQscil7Y29uc3R7c2VsZWN0SWRzOml9PXQscz10aGlzLmdldFJpZ2h0U2VydmljZUlkKGUpLG49dGhpcy5nZXRTZWxlY3RvclJlY3QodGhpcy5mdWxsTGF5ZXIscyk7bGV0IGE7Y29uc3QgbD1uZXcgTWFwO3JldHVybiBpPT1udWxsfHxpLmZvckVhY2goYz0+e2NvbnN0IHU9dGhpcy52Tm9kZXMuZ2V0KGMpLGg9dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoYylbMF07dSYmaCYmKGE9TShhLHUucmVjdCksbC5zZXQoYyx1KSl9KSx0aGlzLmdldFNlbGVjdGVvckluZm8obCksdGhpcy5kcmF3KHMsdGhpcy5mdWxsTGF5ZXIse2ludGVyc2VjdFJlY3Q6YSxzZWxlY3RJZHM6aXx8W10sc3ViTm9kZU1hcDpsfSxyKSxNKGEsbil9cmVSZW5kZXJTZWxlY3Rvcigpe3ZhciByO2xldCBlO2NvbnN0IHQ9bmV3IE1hcDtyZXR1cm4ocj10aGlzLnNlbGVjdElkcyk9PW51bGx8fHIuZm9yRWFjaChpPT57Y29uc3Qgcz10aGlzLnZOb2Rlcy5nZXQoaSk7cyYmKGU9TShlLHMucmVjdCksdC5zZXQoaSxzKSl9LHRoaXMpLHRoaXMuZ2V0U2VsZWN0ZW9ySW5mbyh0KSx0aGlzLmRyYXcoRS5zZWxlY3RvcklkLHRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcix7aW50ZXJzZWN0UmVjdDplLHN1Yk5vZGVNYXA6dCxzZWxlY3RJZHM6dGhpcy5zZWxlY3RJZHN8fFtdfSksdGhpcy5vbGRTZWxlY3RSZWN0PWUsZX11cGRhdGVTZWxlY3RJZHMoZSl7dmFyIG4sYTtsZXQgdDtjb25zdCByPShuPXRoaXMuc2VsZWN0SWRzKT09bnVsbD92b2lkIDA6bi5maWx0ZXIobD0+IWUuaW5jbHVkZXMobCkpLGk9ZS5maWx0ZXIobD0+e3ZhciBjO3JldHVybiEoKGM9dGhpcy5zZWxlY3RJZHMpIT1udWxsJiZjLmluY2x1ZGVzKGwpKX0pO2lmKHIhPW51bGwmJnIubGVuZ3RoJiYodD10aGlzLmJhY2tUb0Z1bGxMYXllcihyKSksaS5sZW5ndGgpe3RoaXMuc2VhbFRvRHJhd0xheWVyKGkpO2Zvcihjb25zdCBsIG9mIGkpe2NvbnN0IGM9KGE9dGhpcy52Tm9kZXMuZ2V0KGwpKT09bnVsbD92b2lkIDA6YS5yZWN0O2MmJih0PU0odCxjKSl9fXRoaXMuc2VsZWN0SWRzPWU7Y29uc3Qgcz10aGlzLnJlUmVuZGVyU2VsZWN0b3IoKTtyZXR1cm57YmdSZWN0OnQsc2VsZWN0UmVjdDpzfX1jdXJzb3JIb3ZlcihlKXt2YXIgcyxuO2NvbnN0IHQ9dGhpcy5vbGRTZWxlY3RSZWN0O3RoaXMuc2VsZWN0SWRzPVtdO2NvbnN0IHI9KHM9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpzLnRvU3RyaW5nKCksaT1bZVswXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMF0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblswXSxlWzFdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzFdXTtpZih0aGlzLnNlbGVjdFNpbmdsZVRvb2woaSxyLCEwKSx0aGlzLm9sZFNlbGVjdFJlY3QmJiFHcih0LHRoaXMub2xkU2VsZWN0UmVjdCkpcmV0dXJue3R5cGU6bS5DdXJzb3JIb3ZlcixkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6TSh0LHRoaXMub2xkU2VsZWN0UmVjdCksc2VsZWN0b3JDb2xvcjp0aGlzLnNlbGVjdG9yQ29sb3Isd2lsbFN5bmNTZXJ2aWNlOiExfTtpZigobj10aGlzLnNlbGVjdElkcykhPW51bGwmJm4ubGVuZ3RofHwodGhpcy5vbGRTZWxlY3RSZWN0PXZvaWQgMCksdCYmIXRoaXMub2xkU2VsZWN0UmVjdClyZXR1cm4gdGhpcy5jdXJzb3JCbHVyKCkse3R5cGU6bS5DdXJzb3JIb3ZlcixkYXRhVHlwZTpXLkxvY2FsLHJlY3Q6dCxzZWxlY3RvckNvbG9yOnRoaXMuc2VsZWN0b3JDb2xvcix3aWxsU3luY1NlcnZpY2U6ITF9fWN1cnNvckJsdXIoKXt2YXIgdCxyO3RoaXMuc2VsZWN0SWRzPVtdO2NvbnN0IGU9KHQ9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7KChyPXRoaXMuZnVsbExheWVyKT09bnVsbD92b2lkIDA6ci5wYXJlbnQpLmNoaWxkcmVuLmZvckVhY2goaT0+e2kubmFtZT09PWUmJmkucmVtb3ZlKCl9KX19T2JqZWN0LmRlZmluZVByb3BlcnR5KEUsInNlbGVjdG9ySWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTplZH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFLCJzZWxlY3RvckJvcmRlcklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6InNlbGVjdG9yLWJvcmRlciJ9KTtjbGFzcyBYciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYm90aH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkFycm93fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYXJyb3dUaXBXaWR0aCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuYXJyb3dUaXBXaWR0aD10aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcyo0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dX0pLGQ9TShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2VudGVyUG9zOnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgUDtjb25zdHt3b3JrSWQ6dCxsYXllcjpyfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChrPT5rLnJlbW92ZSgpKSwoUD10aGlzLmRyYXdMYXllcik9PW51bGx8fFAuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGs9PmsucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmksdGhpY2tuZXNzOnMsekluZGV4Om4sc2NhbGU6YSxyb3RhdGU6bCx0cmFuc2xhdGU6Y309dGhpcy53b3JrT3B0aW9ucyx1PXIud29ybGRQb3NpdGlvbixoPXIud29ybGRTY2FsaW5nLHtwb2ludHM6ZCxyZWN0OmZ9PXRoaXMuY29tcHV0RHJhd1BvaW50cyhzKSx5PXtwb3M6W2YueCtmLncvMixmLnkrZi5oLzJdLG5hbWU6dCxpZDp0LGNsb3NlOiEwLHBvaW50czpkLGZpbGxDb2xvcjppLHN0cm9rZUNvbG9yOmksbGluZVdpZHRoOjAsbm9ybWFsaXplOiEwLHpJbmRleDpufTthJiYoeS5zY2FsZT1hKSxsJiYoeS5yb3RhdGU9bCksYyYmKHkudHJhbnNsYXRlPWMpO2NvbnN0IGc9bmV3IHouUG9seWxpbmUoeSk7aWYoci5hcHBlbmQoZyksYXx8bHx8Yyl7Y29uc3Qgaz1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3Ioay54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihrLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGsud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3Ioay5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJue3g6TWF0aC5mbG9vcihmLngqaFswXSt1WzBdLXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihmLnkqaFsxXSt1WzFdLXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihmLncqaFswXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpLGg6TWF0aC5mbG9vcihmLmgqaFsxXSsyKnguU2FmZUJvcmRlclBhZGRpbmcpfX1jb21wdXREcmF3UG9pbnRzKGUpe3JldHVybiB0aGlzLnRtcFBvaW50c1sxXS5kaXN0YW5jZSh0aGlzLnRtcFBvaW50c1swXSk+dGhpcy5hcnJvd1RpcFdpZHRoP3RoaXMuY29tcHV0RnVsbEFycm93UG9pbnRzKGUpOnRoaXMuY29tcHV0VHJpYW5nbGVQb2ludHMoKX1jb21wdXRGdWxsQXJyb3dQb2ludHMoZSl7Y29uc3QgdD1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSx0aGlzLnRtcFBvaW50c1swXSkudW5pKCkscj1wLlBlcih0KS5tdWwoZS8yKSxpPVIuU3ViKHRoaXMudG1wUG9pbnRzWzBdLHIpLHM9Ui5BZGQodGhpcy50bXBQb2ludHNbMF0sciksbj1wLk11bCh0LHRoaXMuYXJyb3dUaXBXaWR0aCksYT1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSxuKSxsPVIuU3ViKGEsciksYz1SLkFkZChhLHIpLHU9cC5QZXIodCkubXVsKGUqMS41KSxoPVIuU3ViKGEsdSksZD1SLkFkZChhLHUpLGY9W2ksbCxoLHRoaXMudG1wUG9pbnRzWzFdLGQsYyxzXTtyZXR1cm57cG9pbnRzOmYubWFwKHc9PlIuU3ViKHcsdGhpcy50bXBQb2ludHNbMF0pLlhZKS5mbGF0KDEpLHJlY3Q6RyhmKSxpc1RyaWFuZ2xlOiExLHBvczp0aGlzLnRtcFBvaW50c1swXS5YWX19Y29tcHV0VHJpYW5nbGVQb2ludHMoKXtjb25zdCBlPXAuU3ViKHRoaXMudG1wUG9pbnRzWzFdLHRoaXMudG1wUG9pbnRzWzBdKS51bmkoKSx0PXRoaXMudG1wUG9pbnRzWzFdLmRpc3RhbmNlKHRoaXMudG1wUG9pbnRzWzBdKSxyPXAuUGVyKGUpLm11bChNYXRoLmZsb29yKHQqMy84KSksaT1SLlN1Yih0aGlzLnRtcFBvaW50c1swXSxyKSxzPVIuQWRkKHRoaXMudG1wUG9pbnRzWzBdLHIpLG49W2ksdGhpcy50bXBQb2ludHNbMV0sc107cmV0dXJue3BvaW50czpuLm1hcChhPT5SLlN1YihhLHRoaXMudG1wUG9pbnRzWzBdKS5YWSkuZmxhdCgxKSxyZWN0OkcobiksaXNUcmlhbmdsZTohMCxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgbDtjb25zdHtvcDp0LGlzRnVsbFdvcms6cixpc1RlbXA6aX09ZSxzPShsPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFzKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGM9MDtjPHQubGVuZ3RoO2MrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2NdLHRbYysxXSx0W2MrMl0pKTtjb25zdCBuPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGE9dGhpcy5kcmF3KHt3b3JrSWQ6cyxsYXllcjpufSk7cmV0dXJuIHRoaXMub2xkUmVjdD1hLHImJiFpJiZ0aGlzLnZOb2Rlcy5zZXRJbmZvKHMse3JlY3Q6YSxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNlbnRlclBvczp4LmdldENlbnRlclBvcyhhLG4pfSksYX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBhO2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6c309cixuPWkuZ2V0KHQubmFtZSk7cmV0dXJuIHMmJih0LnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHQuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLHMpLChhPW49PW51bGw/dm9pZCAwOm4ub3B0KSE9bnVsbCYmYS5zdHJva2VDb2xvciYmKG4ub3B0LnN0cm9rZUNvbG9yPXMpLG4mJmkuc2V0SW5mbyh0Lm5hbWUsbikpLHgudXBkYXRlTm9kZU9wdChlKX19Y2xhc3MgSHIgZXh0ZW5kcyB4e2NvbnN0cnVjdG9yKGUpe3N1cGVyKGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjYW5Sb3RhdGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTohMX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2FsZVR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpxLmFsbH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLkVsbGlwc2V9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dSxpc0RyYXdpbmc6ITB9KSxkPU0oaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOmksaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PXM7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5tYXAoYz0+Wy4uLmMuWFksMF0pLmZsYXQoMSksYT1sZShuKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0OnMsb3A6bixvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjZW50ZXJQb3M6cyYmeC5nZXRDZW50ZXJQb3MocyxpKX0pLHtyZWN0OnMsdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmEsaXNTeW5jOiEwLG9wdDp0aGlzLndvcmtPcHRpb25zfX1kcmF3KGUpe3ZhciBJO2NvbnN0e3dvcmtJZDp0LGxheWVyOnIsaXNEcmF3aW5nOml9PWU7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpLChJPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8SS5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoYj0+Yi5yZW1vdmUoKSk7Y29uc3R7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0aGlja25lc3M6YSx6SW5kZXg6bCxzY2FsZTpjLHJvdGF0ZTp1LHRyYW5zbGF0ZTpofT10aGlzLndvcmtPcHRpb25zLGQ9ci53b3JsZFBvc2l0aW9uLGY9ci53b3JsZFNjYWxpbmcse3JhZGl1czp3LHJlY3Q6eSxwb3M6Z309dGhpcy5jb21wdXREcmF3UG9pbnRzKGEpLFA9e3BvczpnLG5hbWU6dCxpZDp0LHJhZGl1czp3LGxpbmVXaWR0aDphLGZpbGxDb2xvcjpuIT09InRyYW5zcGFyZW50IiYmbnx8dm9pZCAwLHN0cm9rZUNvbG9yOnMsbm9ybWFsaXplOiEwLHpJbmRleDpsfSxrPXt4Ok1hdGguZmxvb3IoeS54KmZbMF0rZFswXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoeS55KmZbMV0rZFsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoeS53KmZbMF0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKSxoOk1hdGguZmxvb3IoeS5oKmZbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKX07aWYoaSl7Y29uc3R7bmFtZTpiLGlkOnYsekluZGV4Okwsc3Ryb2tlQ29sb3I6VH09UCxBPXguZ2V0Q2VudGVyUG9zKGssciksJD1uZXcgei5Hcm91cCh7bmFtZTpiLGlkOnYsekluZGV4OkwscG9zOkEsYW5jaG9yOlsuNSwuNV0sc2l6ZTpbay53LGsuaF19KSxEPW5ldyB6LkVsbGlwc2Uoey4uLlAscG9zOlswLDBdfSksSD1uZXcgei5QYXRoKHtkOiJNLTQsMEg0TTAsLTRWNCIsbm9ybWFsaXplOiEwLHBvczpbMCwwXSxzdHJva2VDb2xvcjpULGxpbmVXaWR0aDoxLHNjYWxlOlsxL2ZbMF0sMS9mWzFdXX0pO3JldHVybiAkLmFwcGVuZChELEgpLHIuYXBwZW5kKCQpLGt9YyYmKFAuc2NhbGU9YyksdSYmKFAucm90YXRlPXUpLGgmJihQLnRyYW5zbGF0ZT1oKTtjb25zdCBPPW5ldyB6LkVsbGlwc2UoUCk7aWYoci5hcHBlbmQoTyksdXx8Y3x8aCl7Y29uc3QgYj1PLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoYi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihiLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGIud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoYi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJuIGt9Y29tcHV0RHJhd1BvaW50cyhlKXtjb25zdCB0PUcodGhpcy50bXBQb2ludHMpLHI9Ryh0aGlzLnRtcFBvaW50cyxlKSxpPVtNYXRoLmZsb29yKHQueCt0LncvMiksTWF0aC5mbG9vcih0LnkrdC5oLzIpXTtyZXR1cm57cmVjdDpyLHBvczppLHJhZGl1czpbTWF0aC5mbG9vcih0LncvMiksTWF0aC5mbG9vcih0LmgvMildfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscykpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGw7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnIsaXNUZW1wOml9PWUscz0obD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcylyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBjPTA7Yzx0Lmxlbmd0aDtjKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtjXSx0W2MrMV0sdFtjKzJdKSk7Y29uc3Qgbj1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixhPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6bixpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWEsciYmIWkmJnRoaXMudk5vZGVzLnNldEluZm8ocyx7cmVjdDphLG9wOnQsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2VudGVyUG9zOnguZ2V0Q2VudGVyUG9zKGEsbil9KSxhfWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7dmFyIGMsdTtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm59PXIsYT1pLmdldCh0Lm5hbWUpO2xldCBsPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihsPXQuY2hpbGRyZW5bMF0pLHMmJihsLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLChjPWE9PW51bGw/dm9pZCAwOmEub3B0KSE9bnVsbCYmYy5zdHJva2VDb2xvciYmKGEub3B0LnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/bC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpsLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSwodT1hPT1udWxsP3ZvaWQgMDphLm9wdCkhPW51bGwmJnUuZmlsbENvbG9yJiYoYS5vcHQuZmlsbENvbG9yPW4pKSxhJiZpLnNldEluZm8odC5uYW1lLGEpLHgudXBkYXRlTm9kZU9wdChlKX19dmFyIGNmPWZlLHVmPWNlLGhmPSJbb2JqZWN0IEJvb2xlYW5dIjtmdW5jdGlvbiBkZihvKXtyZXR1cm4gbz09PSEwfHxvPT09ITF8fHVmKG8pJiZjZihvKT09aGZ9dmFyIGZmPWRmLHdlPW1lKGZmKTtjbGFzcyBZciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuUmVjdGFuZ2xlfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH10cmFuc2Zvcm1EYXRhKCl7Y29uc3QgZT1HKHRoaXMudG1wUG9pbnRzKTtyZXR1cm5bW2UueCxlLnksMF0sW2UueCtlLncsZS55LDBdLFtlLngrZS53LGUueStlLmgsMF0sW2UueCxlLnkrZS5oLDBdXX1jb21wdXREcmF3UG9pbnRzKGUpe2NvbnN0e3RoaWNrbmVzczp0fT10aGlzLndvcmtPcHRpb25zLHI9W107Zm9yKGNvbnN0IG4gb2YgZSlyLnB1c2gobmV3IHAoLi4ubikpO2NvbnN0IGk9RyhyLHQpLHM9W2kueCtpLncvMixpLnkraS5oLzJdO3JldHVybntyZWN0OmkscG9zOnMscG9pbnRzOnIubWFwKG49Pm4uWFkpLmZsYXQoMSl9fWNvbnN1bWUoZSl7dmFyIHc7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KHc9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDp3LnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdCB1PXRoaXMudHJhbnNmb3JtRGF0YSgpO2lmKCFpKXtjb25zdCB5PURhdGUubm93KCk7cmV0dXJuIHktdGhpcy5zeW5jVGltZXN0YW1wPnRoaXMuc3luY1VuaXRUaW1lPyh0aGlzLnN5bmNUaW1lc3RhbXA9eSx7dHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnMsb3A6dS5mbGF0KDEpLGlzU3luYzohMCxpbmRleDowfSk6e3R5cGU6bS5Ob25lfX1jb25zdCBoPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGQ9dGhpcy5kcmF3KHtwczp1LHdvcmtJZDpzLGxheWVyOmgsaXNEcmF3aW5nOiEwfSksZj1NKGQsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWQse3JlY3Q6Zix0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgYztjb25zdHtkYXRhOnR9PWUscj0oYz10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmMudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMudHJhbnNmb3JtRGF0YSgpLHM9dGhpcy5mdWxsTGF5ZXIsbj10aGlzLmRyYXcoe3BzOmksd29ya0lkOnIsbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTt0aGlzLm9sZFJlY3Q9bjtjb25zdCBhPWkuZmxhdCgxKSxsPWxlKGEpO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6bixvcDphLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSkse3JlY3Q6bix0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6bCxvcHQ6dGhpcy53b3JrT3B0aW9ucyxpc1N5bmM6ITB9fWRyYXcoZSl7dmFyIFQ7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdpbmc6aSxwczpzLHJlcGxhY2VJZDpufT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKG58fHQpLm1hcChBPT5BLnJlbW92ZSgpKSwoVD10aGlzLmRyYXdMYXllcik9PW51bGx8fFQuZ2V0RWxlbWVudHNCeU5hbWUobnx8dCkubWFwKEE9PkEucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmEsZmlsbENvbG9yOmwsdGhpY2tuZXNzOmMsekluZGV4OnUsc2NhbGU6aCxyb3RhdGU6ZCx0cmFuc2xhdGU6Zix0ZXh0T3B0Ond9PXRoaXMud29ya09wdGlvbnMseT1yLndvcmxkUG9zaXRpb24sZz1yLndvcmxkU2NhbGluZyx7cG9pbnRzOlAscmVjdDprLHBvczpPfT10aGlzLmNvbXB1dERyYXdQb2ludHMocyksST17Y2xvc2U6ITAsbm9ybWFsaXplOiEwLHBvaW50czpQLGxpbmVXaWR0aDpjLGZpbGxDb2xvcjpsIT09InRyYW5zcGFyZW50IiYmbHx8dm9pZCAwLHN0cm9rZUNvbG9yOmEsbGluZUpvaW46InJvdW5kIn0sYj17eDpNYXRoLmZsb29yKGsueCpnWzBdK3lbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGsueSpnWzFdK3lbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGsudypnWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKGsuaCpnWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9LHY9bmV3IHouR3JvdXAoe25hbWU6dCxpZDp0LHpJbmRleDp1LHBvczpPLGFuY2hvcjpbLjUsLjVdLHNpemU6W2sudyxrLmhdLHNjYWxlOmgscm90YXRlOmQsdHJhbnNsYXRlOmZ9KSxMPW5ldyB6LlBvbHlsaW5lKHsuLi5JLHBvczpbMCwwXX0pO2lmKHYuYXBwZW5kQ2hpbGQoTCksaSl7Y29uc3QgQT1uZXcgei5QYXRoKHtkOiJNLTQsMEg0TTAsLTRWNCIsbm9ybWFsaXplOiEwLHBvczpbMCwwXSxzdHJva2VDb2xvcjphLGxpbmVXaWR0aDoxLHNjYWxlOlsxL2dbMF0sMS9nWzFdXX0pO3YuYXBwZW5kQ2hpbGQoQSl9aWYoci5hcHBlbmQodiksaHx8ZHx8Zil7Y29uc3QgQT12LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoQS54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihBLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKEEud2lkdGgrMip4LlNhZmVCb3JkZXJQYWRkaW5nKSxoOk1hdGguZmxvb3IoQS5oZWlnaHQrMip4LlNhZmVCb3JkZXJQYWRkaW5nKX19cmV0dXJuIGJ9dXBkYXRlVGVtcFBvaW50cyhlKXtjb25zdCB0PWUuc2xpY2UoLTIpLHI9bmV3IFIodFswXSx0WzFdKSxpPXRoaXMudG1wUG9pbnRzWzBdLHt0aGlja25lc3M6c309dGhpcy53b3JrT3B0aW9ucztpZihpLmlzTmVhcihyLHMpKXJldHVybiExO2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aD09PTIpe2lmKHIuaXNOZWFyKHRoaXMudG1wUG9pbnRzWzFdLDEpKXJldHVybiExO3RoaXMudG1wUG9pbnRzWzFdPXJ9ZWxzZSB0aGlzLnRtcFBvaW50cy5wdXNoKHIpO3JldHVybiEwfWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBjO2NvbnN0e29wOnQsaXNGdWxsV29yazpyLHJlcGxhY2VJZDppfT1lLHM9KGM9dGhpcy53b3JrSWQpPT1udWxsP3ZvaWQgMDpjLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJuO2NvbnN0IG49W107Zm9yKGxldCB1PTA7dTx0Lmxlbmd0aDt1Kz0zKW4ucHVzaChbdFt1XSx0W3UrMV0sdFt1KzJdXSk7Y29uc3QgYT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixsPXRoaXMuZHJhdyh7cHM6bix3b3JrSWQ6cyxsYXllcjphLGlzRHJhd2luZzohMSxyZXBsYWNlSWQ6aX0pO3JldHVybiB0aGlzLm9sZFJlY3Q9bCx0aGlzLnZOb2Rlcy5zZXRJbmZvKHMse3JlY3Q6bCxvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpsJiZ4LmdldENlbnRlclBvcyhsLGEpfSksbH1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe3ZhciBnLFA7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLGZvbnRDb2xvcjphLGZvbnRCZ0NvbG9yOmwsYm9sZDpjLGl0YWxpYzp1LGxpbmVUaHJvdWdoOmgsdW5kZXJsaW5lOmQsZm9udFNpemU6Zn09cix3PWkuZ2V0KHQubmFtZSk7bGV0IHk9dDtpZih0LnRhZ05hbWU9PT0iR1JPVVAiJiYoeT10LmNoaWxkcmVuWzBdKSxzJiYoeS5zZXRBdHRyaWJ1dGUoInN0cm9rZUNvbG9yIixzKSwoZz13PT1udWxsP3ZvaWQgMDp3Lm9wdCkhPW51bGwmJmcuc3Ryb2tlQ29sb3ImJih3Lm9wdC5zdHJva2VDb2xvcj1zKSksbiYmKG49PT0idHJhbnNwYXJlbnQiP3kuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLCJyZ2JhKDAsMCwwLDApIik6eS5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsbiksKFA9dz09bnVsbD92b2lkIDA6dy5vcHQpIT1udWxsJiZQLmZpbGxDb2xvciYmKHcub3B0LmZpbGxDb2xvcj1uKSksdyE9bnVsbCYmdy5vcHQudGV4dE9wdCl7Y29uc3Qgaz13Lm9wdC50ZXh0T3B0O2EmJmsuZm9udENvbG9yJiYoay5mb250Q29sb3I9YSksbCYmay5mb250QmdDb2xvciYmKGsuZm9udEJnQ29sb3I9bCksYyYmKGsuYm9sZD1jKSx1JiYoay5pdGFsaWM9dSksd2UoaCkmJihrLmxpbmVUaHJvdWdoPWgpLHdlKGQpJiYoay51bmRlcmxpbmU9ZCksZiYmKGsuZm9udFNpemU9Zil9cmV0dXJuIHcmJmkuc2V0SW5mbyh0Lm5hbWUsdykseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBxciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuU3Rhcn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInN5bmNUaW1lc3RhbXAiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLndvcmtPcHRpb25zPWUudG9vbHNPcHQsdGhpcy5zeW5jVGltZXN0YW1wPTAsdGhpcy5zeW5jVW5pdFRpbWU9NTB9Y29uc3VtZShlKXt2YXIgZjtjb25zdHtkYXRhOnQsaXNGdWxsV29yazpyLGlzU3ViV29ya2VyOml9PWUscz0oZj10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmYudG9TdHJpbmcoKTtpZighcylyZXR1cm57dHlwZTptLk5vbmV9O2NvbnN0e29wOm4sd29ya1N0YXRlOmF9PXQsbD1uPT1udWxsP3ZvaWQgMDpuLmxlbmd0aDtpZighbHx8bDwyKXJldHVybnt0eXBlOm0uTm9uZX07bGV0IGM7aWYoYT09PUYuU3RhcnQ/KHRoaXMudG1wUG9pbnRzPVtuZXcgUihuWzBdLG5bMV0pXSxjPSExKTpjPXRoaXMudXBkYXRlVGVtcFBvaW50cyhuKSwhYylyZXR1cm57dHlwZTptLk5vbmV9O2lmKCFpKXtjb25zdCB3PURhdGUubm93KCk7cmV0dXJuIHctdGhpcy5zeW5jVGltZXN0YW1wPnRoaXMuc3luY1VuaXRUaW1lPyh0aGlzLnN5bmNUaW1lc3RhbXA9dyx7dHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnMsb3A6dGhpcy50bXBQb2ludHMubWFwKHk9PlsuLi55LlhZLDBdKS5mbGF0KDEpLGlzU3luYzohMCxpbmRleDowfSk6e3R5cGU6bS5Ob25lfX1jb25zdCB1PXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLGg9dGhpcy5kcmF3KHt3b3JrSWQ6cyxsYXllcjp1LGlzRHJhd2luZzohMH0pLGQ9TShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aSxpc0RyYXdpbmc6ITF9KTt0aGlzLm9sZFJlY3Q9cztjb25zdCBuPXRoaXMudG1wUG9pbnRzLm1hcChjPT5bLi4uYy5YWSwwXSkuZmxhdCgxKSxhPWxlKG4pO3JldHVybiB0aGlzLnZOb2Rlcy5zZXRJbmZvKHIse3JlY3Q6cyxvcDpuLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpzJiZ4LmdldENlbnRlclBvcyhzLGkpfSkse3JlY3Q6cyx0eXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cixvcHM6YSxpc1N5bmM6ITAsb3B0OnRoaXMud29ya09wdGlvbnN9fWRyYXcoZSl7dmFyIEw7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdpbmc6aX09ZTt0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoVD0+VC5yZW1vdmUoKSksKEw9dGhpcy5kcmF3TGF5ZXIpPT1udWxsfHxMLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChUPT5ULnJlbW92ZSgpKTtjb25zdHtzdHJva2VDb2xvcjpzLGZpbGxDb2xvcjpuLHRoaWNrbmVzczphLHpJbmRleDpsLHZlcnRpY2VzOmMsaW5uZXJWZXJ0aWNlU3RlcDp1LGlubmVyUmF0aW86aCxzY2FsZTpkLHJvdGF0ZTpmLHRyYW5zbGF0ZTp3fT10aGlzLndvcmtPcHRpb25zLHk9ci53b3JsZFBvc2l0aW9uLGc9ci53b3JsZFNjYWxpbmcse3JlY3Q6UCxwb3M6ayxwb2ludHM6T309dGhpcy5jb21wdXREcmF3UG9pbnRzKGEsYyx1LGgpLEk9e3BvczprLGNsb3NlOiEwLG5hbWU6dCxpZDp0LHBvaW50czpPLGxpbmVXaWR0aDphLGZpbGxDb2xvcjpuIT09InRyYW5zcGFyZW50IiYmbnx8dm9pZCAwLHN0cm9rZUNvbG9yOnMsY2xhc3NOYW1lOmAke2tbMF19LCR7a1sxXX1gLG5vcm1hbGl6ZTohMCx6SW5kZXg6bCxsaW5lSm9pbjoicm91bmQifSxiPXt4Ok1hdGguZmxvb3IoUC54KmdbMF0reVswXS14LlNhZmVCb3JkZXJQYWRkaW5nKmdbMF0pLHk6TWF0aC5mbG9vcihQLnkqZ1sxXSt5WzFdLXguU2FmZUJvcmRlclBhZGRpbmcqZ1sxXSksdzpNYXRoLmZsb29yKFAudypnWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypnWzBdKSxoOk1hdGguZmxvb3IoUC5oKmdbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKmdbMV0pfTtpZihpKXtjb25zdHtuYW1lOlQsaWQ6QSx6SW5kZXg6JCxzdHJva2VDb2xvcjpEfT1JLEg9WyhiLngrYi53LzIteVswXSkvZ1swXSwoYi55K2IuaC8yLXlbMV0pL2dbMV1dLFY9bmV3IHouR3JvdXAoe25hbWU6VCxpZDpBLHpJbmRleDokLHBvczpILGFuY2hvcjpbLjUsLjVdLHNpemU6W2IudyxiLmhdfSksZWU9bmV3IHouUG9seWxpbmUoey4uLkkscG9zOlswLDBdfSksc2U9bmV3IHouUGF0aCh7ZDoiTS00LDBINE0wLC00VjQiLG5vcm1hbGl6ZTohMCxwb3M6WzAsMF0sc3Ryb2tlQ29sb3I6RCxsaW5lV2lkdGg6MSxzY2FsZTpbMS9nWzBdLDEvZ1sxXV19KTtyZXR1cm4gVi5hcHBlbmQoZWUsc2UpLHIuYXBwZW5kKFYpLGJ9ZCYmKEkuc2NhbGU9ZCksZiYmKEkucm90YXRlPWYpLHcmJihJLnRyYW5zbGF0ZT13KTtjb25zdCB2PW5ldyB6LlBvbHlsaW5lKEkpO2lmKHIuYXBwZW5kKHYpLGR8fGZ8fHcpe2NvbnN0IFQ9di5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKFQueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoVC55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihULndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKFQuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBifWNvbXB1dERyYXdQb2ludHMoZSx0LHIsaSl7Y29uc3Qgcz1HKHRoaXMudG1wUG9pbnRzKSxuPVtNYXRoLmZsb29yKHMueCtzLncvMiksTWF0aC5mbG9vcihzLnkrcy5oLzIpXSxhPXhyKHMudyxzLmgpLGw9TWF0aC5mbG9vcihNYXRoLm1pbihzLncscy5oKS8yKSxjPWkqbCx1PVtdLGg9MipNYXRoLlBJL3Q7Zm9yKGxldCBmPTA7Zjx0O2YrKyl7Y29uc3Qgdz1mKmgtLjUqTWF0aC5QSTtsZXQgeSxnO2Ylcj09PTE/KHk9YyphWzBdKk1hdGguY29zKHcpLGc9YyphWzFdKk1hdGguc2luKHcpKTooeT1sKmFbMF0qTWF0aC5jb3ModyksZz1sKmFbMV0qTWF0aC5zaW4odyksdS5wdXNoKHksZykpLHUucHVzaCh5LGcpfXJldHVybntyZWN0OkcodGhpcy50bXBQb2ludHMsZSkscG9zOm4scG9pbnRzOnV9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKXx8Ui5TdWIoaSxyKS5YWS5pbmNsdWRlcygwKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYTtjb25zdHtvcDp0LGlzRnVsbFdvcms6cn09ZSxpPShhPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6YS50b1N0cmluZygpO2lmKCFpKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGw9MDtsPHQubGVuZ3RoO2wrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2xdLHRbbCsxXSx0W2wrMl0pKTtjb25zdCBzPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHt3b3JrSWQ6aSxsYXllcjpzLGlzRHJhd2luZzohMX0pO3JldHVybiB0aGlzLm9sZFJlY3Q9bix0aGlzLnZOb2Rlcy5zZXRJbmZvKGkse3JlY3Q6bixvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSksbn1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0b29sc1R5cGU6YSx2ZXJ0aWNlczpsLGlubmVyVmVydGljZVN0ZXA6Yyxpbm5lclJhdGlvOnV9PXIsaD1pLmdldCh0Lm5hbWUpLGQ9aD09bnVsbD92b2lkIDA6aC5vcHQ7bGV0IGY9dDtyZXR1cm4gdC50YWdOYW1lPT09IkdST1VQIiYmKGY9dC5jaGlsZHJlblswXSkscyYmKGYuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksZCE9bnVsbCYmZC5zdHJva2VDb2xvciYmKGQuc3Ryb2tlQ29sb3I9cykpLG4mJihuPT09InRyYW5zcGFyZW50Ij9mLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIiwicmdiYSgwLDAsMCwwKSIpOmYuc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLG4pLGQhPW51bGwmJmQuZmlsbENvbG9yJiYoZC5maWxsQ29sb3I9bikpLGE9PT1TLlN0YXImJihsJiYoZC52ZXJ0aWNlcz1sKSxjJiYoZC5pbm5lclZlcnRpY2VTdGVwPWMpLHUmJihkLmlubmVyUmF0aW89dSkpLGgmJmkuc2V0SW5mbyh0Lm5hbWUsey4uLmgsb3B0OmR9KSx4LnVwZGF0ZU5vZGVPcHQoZSl9fWNsYXNzIFpyIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5hbGx9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5Qb2x5Z29ufSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3luY1RpbWVzdGFtcCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnN5bmNUaW1lc3RhbXA9MCx0aGlzLnN5bmNVbml0VGltZT01MH1jb25zdW1lKGUpe3ZhciBmO2NvbnN0e2RhdGE6dCxpc0Z1bGxXb3JrOnIsaXNTdWJXb3JrZXI6aX09ZSxzPShmPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6Zi50b1N0cmluZygpO2lmKCFzKXJldHVybnt0eXBlOm0uTm9uZX07Y29uc3R7b3A6bix3b3JrU3RhdGU6YX09dCxsPW49PW51bGw/dm9pZCAwOm4ubGVuZ3RoO2lmKCFsfHxsPDIpcmV0dXJue3R5cGU6bS5Ob25lfTtsZXQgYztpZihhPT09Ri5TdGFydD8odGhpcy50bXBQb2ludHM9W25ldyBSKG5bMF0sblsxXSldLGM9ITEpOmM9dGhpcy51cGRhdGVUZW1wUG9pbnRzKG4pLCFjKXJldHVybnt0eXBlOm0uTm9uZX07aWYoIWkpe2NvbnN0IHc9RGF0ZS5ub3coKTtyZXR1cm4gdy10aGlzLnN5bmNUaW1lc3RhbXA+dGhpcy5zeW5jVW5pdFRpbWU/KHRoaXMuc3luY1RpbWVzdGFtcD13LHt0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6cyxvcDp0aGlzLnRtcFBvaW50cy5tYXAoeT0+Wy4uLnkuWFksMF0pLmZsYXQoMSksaXNTeW5jOiEwLGluZGV4OjB9KTp7dHlwZTptLk5vbmV9fWNvbnN0IHU9cj90aGlzLmZ1bGxMYXllcjp0aGlzLmRyYXdMYXllcnx8dGhpcy5mdWxsTGF5ZXIsaD10aGlzLmRyYXcoe3dvcmtJZDpzLGxheWVyOnUsaXNEcmF3aW5nOiEwfSksZD1NKGgsdGhpcy5vbGRSZWN0KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWgse3JlY3Q6ZCx0eXBlOm0uRHJhd1dvcmssZGF0YVR5cGU6Vy5Mb2NhbCx3b3JrSWQ6c319Y29uc3VtZUFsbChlKXt2YXIgbDtjb25zdHtkYXRhOnR9PWUscj0obD10PT1udWxsP3ZvaWQgMDp0LndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighcilyZXR1cm57dHlwZTptLk5vbmV9O2lmKHRoaXMudG1wUG9pbnRzLmxlbmd0aDwyKXJldHVybnt0eXBlOm0uUmVtb3ZlTm9kZSxyZW1vdmVJZHM6W3JdfTtjb25zdCBpPXRoaXMuZnVsbExheWVyLHM9dGhpcy5kcmF3KHt3b3JrSWQ6cixsYXllcjppLGlzRHJhd2luZzohMX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgYjtjb25zdHt3b3JrSWQ6dCxsYXllcjpyLGlzRHJhd2luZzppfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh2PT52LnJlbW92ZSgpKSwoYj10aGlzLmRyYXdMYXllcik9PW51bGx8fGIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKHY9PnYucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdGhpY2tuZXNzOmEsekluZGV4OmwsdmVydGljZXM6YyxzY2FsZTp1LHJvdGF0ZTpoLHRyYW5zbGF0ZTpkfT10aGlzLndvcmtPcHRpb25zLGY9ci53b3JsZFBvc2l0aW9uLHc9ci53b3JsZFNjYWxpbmcse3JlY3Q6eSxwb3M6Zyxwb2ludHM6UH09dGhpcy5jb21wdXREcmF3UG9pbnRzKGEsYyksaz17cG9zOmcsY2xvc2U6ITAsbmFtZTp0LGlkOnQscG9pbnRzOlAsbGluZVdpZHRoOmEsZmlsbENvbG9yOm4hPT0idHJhbnNwYXJlbnQiJiZufHx2b2lkIDAsc3Ryb2tlQ29sb3I6cyxub3JtYWxpemU6ITAsekluZGV4OmwsbGluZUpvaW46InJvdW5kIn0sTz17eDpNYXRoLmZsb29yKHkueCp3WzBdK2ZbMF0teC5TYWZlQm9yZGVyUGFkZGluZyp3WzBdKSx5Ok1hdGguZmxvb3IoeS55KndbMV0rZlsxXS14LlNhZmVCb3JkZXJQYWRkaW5nKndbMV0pLHc6TWF0aC5mbG9vcih5Lncqd1swXSsyKnguU2FmZUJvcmRlclBhZGRpbmcqd1swXSksaDpNYXRoLmZsb29yKHkuaCp3WzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyp3WzFdKX07aWYoaSl7Y29uc3R7bmFtZTp2LGlkOkwsekluZGV4OlQsc3Ryb2tlQ29sb3I6QX09aywkPVsoTy54K08udy8yLWZbMF0pL3dbMF0sKE8ueStPLmgvMi1mWzFdKS93WzFdXSxEPW5ldyB6Lkdyb3VwKHtuYW1lOnYsaWQ6TCx6SW5kZXg6VCxwb3M6JCxhbmNob3I6Wy41LC41XSxzaXplOltPLncsTy5oXX0pLEg9bmV3IHouUG9seWxpbmUoey4uLmsscG9zOlswLDBdfSksVj1uZXcgei5QYXRoKHtkOiJNLTQsMEg0TTAsLTRWNCIsbm9ybWFsaXplOiEwLHBvczpbMCwwXSxzdHJva2VDb2xvcjpBLGxpbmVXaWR0aDoxLHNjYWxlOlsxL3dbMF0sMS93WzFdXX0pO3JldHVybiBELmFwcGVuZChILFYpLHIuYXBwZW5kKEQpLE99dSYmKGsuc2NhbGU9dSksaCYmKGsucm90YXRlPWgpLGQmJihrLnRyYW5zbGF0ZT1kKTtjb25zdCBJPW5ldyB6LlBvbHlsaW5lKGspO2lmKHIuYXBwZW5kKEkpLHV8fGh8fGQpe2NvbnN0IHY9SS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKHYueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3Iodi55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcih2LndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKHYuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fXJldHVybiBPfWNvbXB1dERyYXdQb2ludHMoZSx0KXtjb25zdCByPUcodGhpcy50bXBQb2ludHMpLGk9W01hdGguZmxvb3Ioci54K3Iudy8yKSxNYXRoLmZsb29yKHIueStyLmgvMildLHM9eHIoci53LHIuaCksbj1NYXRoLmZsb29yKE1hdGgubWluKHIudyxyLmgpLzIpLGE9W10sbD0yKk1hdGguUEkvdDtmb3IobGV0IHU9MDt1PHQ7dSsrKXtjb25zdCBoPXUqbC0uNSpNYXRoLlBJLGQ9bipzWzBdKk1hdGguY29zKGgpLGY9bipzWzFdKk1hdGguc2luKGgpO2EucHVzaChkLGYpfXJldHVybntyZWN0OkcodGhpcy50bXBQb2ludHMsZSkscG9zOmkscG9pbnRzOmF9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKXx8Ui5TdWIoaSxyKS5YWS5pbmNsdWRlcygwKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYTtjb25zdHtvcDp0LGlzRnVsbFdvcms6cn09ZSxpPShhPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6YS50b1N0cmluZygpO2lmKCFpKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGw9MDtsPHQubGVuZ3RoO2wrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2xdLHRbbCsxXSx0W2wrMl0pKTtjb25zdCBzPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHt3b3JrSWQ6aSxsYXllcjpzLGlzRHJhd2luZzohMX0pO3JldHVybiB0aGlzLm9sZFJlY3Q9bix0aGlzLnZOb2Rlcy5zZXRJbmZvKGkse3JlY3Q6bixvcDp0LG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpuJiZ4LmdldENlbnRlclBvcyhuLHMpfSksbn1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aX09ZSx7c3Ryb2tlQ29sb3I6cyxmaWxsQ29sb3I6bix0b29sc1R5cGU6YSx2ZXJ0aWNlczpsfT1yLGM9aS5nZXQodC5uYW1lKSx1PWM9PW51bGw/dm9pZCAwOmMub3B0O2xldCBoPXQ7cmV0dXJuIHQudGFnTmFtZT09PSJHUk9VUCImJihoPXQuY2hpbGRyZW5bMF0pLHMmJihoLnNldEF0dHJpYnV0ZSgic3Ryb2tlQ29sb3IiLHMpLHUhPW51bGwmJnUuc3Ryb2tlQ29sb3ImJih1LnN0cm9rZUNvbG9yPXMpKSxuJiYobj09PSJ0cmFuc3BhcmVudCI/aC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIsInJnYmEoMCwwLDAsMCkiKTpoLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIixuKSx1IT1udWxsJiZ1LmZpbGxDb2xvciYmKHUuZmlsbENvbG9yPW4pKSxhPT09Uy5Qb2x5Z29uJiZsJiYodS52ZXJ0aWNlcz1sKSxjJiZpLnNldEluZm8odC5uYW1lLHsuLi5jLG9wdDp1fSkseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBhZXtzdGF0aWMgYmV6aWVyKGUsdCl7Y29uc3Qgcj1bXTtmb3IobGV0IGk9MDtpPHQubGVuZ3RoO2krPTQpe2NvbnN0IHM9dFtpXSxuPXRbaSsxXSxhPXRbaSsyXSxsPXRbaSszXTtzJiZuJiZhJiZsP3IucHVzaCguLi5hZS5nZXRCZXppZXJQb2ludHMoZSxzLG4sYSxsKSk6cyYmbiYmYT9yLnB1c2goLi4uYWUuZ2V0QmV6aWVyUG9pbnRzKGUscyxuLGEpKTpzJiZuP3IucHVzaCguLi5hZS5nZXRCZXppZXJQb2ludHMoZSxzLG4pKTpzJiZyLnB1c2gocyl9cmV0dXJuIHJ9c3RhdGljIGdldEJlemllclBvaW50cyhlPTEwLHQscixpLHMpe2xldCBuPW51bGw7Y29uc3QgYT1bXTshaSYmIXM/bj1hZS5vbmVCZXppZXI6aSYmIXM/bj1hZS50d29CZXppZXI6aSYmcyYmKG49YWUudGhyZWVCZXppZXIpO2ZvcihsZXQgbD0wO2w8ZTtsKyspbiYmYS5wdXNoKG4obC9lLHQscixpLHMpKTtyZXR1cm4gcz9hLnB1c2gocyk6aSYmYS5wdXNoKGkpLGF9c3RhdGljIG9uZUJlemllcihlLHQscil7Y29uc3QgaT10LngrKHIueC10LngpKmUscz10LnkrKHIueS10LnkpKmU7cmV0dXJuIG5ldyBwKGkscyl9c3RhdGljIHR3b0JlemllcihlLHQscixpKXtjb25zdCBzPSgxLWUpKigxLWUpKnQueCsyKmUqKDEtZSkqci54K2UqZSppLngsbj0oMS1lKSooMS1lKSp0LnkrMiplKigxLWUpKnIueStlKmUqaS55O3JldHVybiBuZXcgcChzLG4pfXN0YXRpYyB0aHJlZUJlemllcihlLHQscixpLHMpe2NvbnN0IG49dC54KigxLWUpKigxLWUpKigxLWUpKzMqci54KmUqKDEtZSkqKDEtZSkrMyppLngqZSplKigxLWUpK3MueCplKmUqZSxhPXQueSooMS1lKSooMS1lKSooMS1lKSszKnIueSplKigxLWUpKigxLWUpKzMqaS55KmUqZSooMS1lKStzLnkqZSplKmU7cmV0dXJuIG5ldyBwKG4sYSl9fWNsYXNzIFFyIGV4dGVuZHMgeHtjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY2FuUm90YXRlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6ITF9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2NhbGVUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cS5hbGx9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG9vbHNUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Uy5TcGVlY2hCYWxsb29ufSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInJhdGlvIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Ljh9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dSxpc0RyYXdpbmc6ITB9KSxkPU0oaCx0aGlzLm9sZFJlY3QpO3JldHVybiB0aGlzLm9sZFJlY3Q9aCx7cmVjdDpkLHR5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzfX1jb25zdW1lQWxsKGUpe3ZhciBsO2NvbnN0e2RhdGE6dH09ZSxyPShsPXQ9PW51bGw/dm9pZCAwOnQud29ya0lkKT09bnVsbD92b2lkIDA6bC50b1N0cmluZygpO2lmKCFyKXJldHVybnt0eXBlOm0uTm9uZX07aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPDIpcmV0dXJue3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpbcl19O2NvbnN0IGk9dGhpcy5mdWxsTGF5ZXIscz10aGlzLmRyYXcoe3dvcmtJZDpyLGxheWVyOmksaXNEcmF3aW5nOiExfSk7dGhpcy5vbGRSZWN0PXM7Y29uc3Qgbj10aGlzLnRtcFBvaW50cy5tYXAoYz0+Wy4uLmMuWFksMF0pLmZsYXQoMSksYT1sZShuKTtyZXR1cm4gdGhpcy52Tm9kZXMuc2V0SW5mbyhyLHtyZWN0OnMsb3A6bixvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6cyYmeC5nZXRDZW50ZXJQb3MocyxpKX0pLHtyZWN0OnMsdHlwZTptLkZ1bGxXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnIsb3BzOmEsaXNTeW5jOiEwLG9wdDp0aGlzLndvcmtPcHRpb25zfX1kcmF3KGUpe3ZhciBJO2NvbnN0e3dvcmtJZDp0LGxheWVyOnJ9PWU7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKGI9PmIucmVtb3ZlKCkpLChJPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8SS5nZXRFbGVtZW50c0J5TmFtZSh0KS5tYXAoYj0+Yi5yZW1vdmUoKSk7Y29uc3R7c3Ryb2tlQ29sb3I6aSxmaWxsQ29sb3I6cyx0aGlja25lc3M6bix6SW5kZXg6YSxwbGFjZW1lbnQ6bCxzY2FsZTpjLHJvdGF0ZTp1LHRyYW5zbGF0ZTpofT10aGlzLndvcmtPcHRpb25zLGQ9ci53b3JsZFBvc2l0aW9uLGY9ci53b3JsZFNjYWxpbmcse3JlY3Q6dyxwb3M6eSxwb2ludHM6Z309dGhpcy5jb21wdXREcmF3UG9pbnRzKG4sbCksUD17cG9zOnksbmFtZTp0LGlkOnQscG9pbnRzOmcubWFwKGI9PmIuWFkpLGxpbmVXaWR0aDpuLGZpbGxDb2xvcjpzIT09InRyYW5zcGFyZW50IiYmc3x8dm9pZCAwLHN0cm9rZUNvbG9yOmksbm9ybWFsaXplOiEwLGNsYXNzTmFtZTpgJHt5WzBdfSwke3lbMV19YCx6SW5kZXg6YSxsaW5lSm9pbjoicm91bmQiLGNsb3NlOiEwfSxrPXt4Ok1hdGguZmxvb3Iody54KmZbMF0rZFswXS14LlNhZmVCb3JkZXJQYWRkaW5nKmZbMF0pLHk6TWF0aC5mbG9vcih3LnkqZlsxXStkWzFdLXguU2FmZUJvcmRlclBhZGRpbmcqZlsxXSksdzpNYXRoLmZsb29yKHcudypmWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZypmWzBdKSxoOk1hdGguZmxvb3Iody5oKmZbMV0rMip4LlNhZmVCb3JkZXJQYWRkaW5nKmZbMV0pfTtjJiYoUC5zY2FsZT1jKSx1JiYoUC5yb3RhdGU9dSksaCYmKFAudHJhbnNsYXRlPWgpO2NvbnN0IE89bmV3IHouUG9seWxpbmUoUCk7aWYoci5hcHBlbmQoTyksY3x8dXx8aCl7Y29uc3QgYj1PLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVybnt4Ok1hdGguZmxvb3IoYi54LXguU2FmZUJvcmRlclBhZGRpbmcpLHk6TWF0aC5mbG9vcihiLnkteC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGIud2lkdGgreC5TYWZlQm9yZGVyUGFkZGluZyoyKSxoOk1hdGguZmxvb3IoYi5oZWlnaHQreC5TYWZlQm9yZGVyUGFkZGluZyoyKX19cmV0dXJuIGt9dHJhbnNmb3JtQ29udHJvbFBvaW50cyhlKXtjb25zdCB0PUcodGhpcy50bXBQb2ludHMpO3N3aXRjaChlKXtjYXNlImJvdHRvbSI6Y2FzZSJib3R0b21MZWZ0IjpjYXNlImJvdHRvbVJpZ2h0Ijp7Y29uc3Qgcj10LnkrdC5oKnRoaXMucmF0aW87cmV0dXJuW25ldyBwKHQueCx0LnksMCksbmV3IHAodC54K3Qudyx0LnksMCksbmV3IHAodC54K3QudyxyLDApLG5ldyBwKHQueCxyLDApXX1jYXNlInRvcCI6Y2FzZSJ0b3BMZWZ0IjpjYXNlInRvcFJpZ2h0Ijp7Y29uc3Qgcj10LnkrdC5oKigxLXRoaXMucmF0aW8pO3JldHVybltuZXcgcCh0LngsciwwKSxuZXcgcCh0LngrdC53LHIsMCksbmV3IHAodC54K3Qudyx0LnkrdC5oLDApLG5ldyBwKHQueCx0LnkrdC5oLDApXX1jYXNlImxlZnQiOmNhc2UibGVmdEJvdHRvbSI6Y2FzZSJsZWZ0VG9wIjp7Y29uc3Qgcj10LngrdC53KigxLXRoaXMucmF0aW8pO3JldHVybltuZXcgcChyLHQueSwwKSxuZXcgcCh0LngrdC53LHQueSwwKSxuZXcgcCh0LngrdC53LHQueSt0LmgsMCksbmV3IHAocix0LnkrdC5oLDApXX1jYXNlInJpZ2h0IjpjYXNlInJpZ2h0Qm90dG9tIjpjYXNlInJpZ2h0VG9wIjp7Y29uc3Qgcj10LngrdC53KnRoaXMucmF0aW87cmV0dXJuW25ldyBwKHQueCx0LnksMCksbmV3IHAocix0LnksMCksbmV3IHAocix0LnkrdC5oLDApLG5ldyBwKHQueCx0LnkrdC5oLDApXX19fWNvbXB1dERyYXdQb2ludHMoZSx0KXtjb25zdCByPUcodGhpcy50bXBQb2ludHMpLGk9dGhpcy50cmFuc2Zvcm1Db250cm9sUG9pbnRzKHQpLHM9TWF0aC5mbG9vcihyLncqLjEpLG49TWF0aC5mbG9vcihyLmgqLjEpLGE9W10sbD1wLkFkZChpWzBdLG5ldyBwKDAsbiwwKSksYz1wLkFkZChpWzBdLG5ldyBwKHMsMCwwKSksdT1hZS5nZXRCZXppZXJQb2ludHMoMTAsbCxpWzBdLGMpLGg9cC5TdWIoaVsxXSxuZXcgcChzLDAsMCkpLGQ9cC5BZGQoaVsxXSxuZXcgcCgwLG4sMCkpLGY9YWUuZ2V0QmV6aWVyUG9pbnRzKDEwLGgsaVsxXSxkKSx3PXAuU3ViKGlbMl0sbmV3IHAoMCxuLDApKSx5PXAuU3ViKGlbMl0sbmV3IHAocywwLDApKSxnPWFlLmdldEJlemllclBvaW50cygxMCx3LGlbMl0seSksUD1wLkFkZChpWzNdLG5ldyBwKHMsMCwwKSksaz1wLlN1YihpWzNdLG5ldyBwKDAsbiwwKSksTz1hZS5nZXRCZXppZXJQb2ludHMoMTAsUCxpWzNdLGspLEk9cyooMS10aGlzLnJhdGlvKSoxMCxiPW4qKDEtdGhpcy5yYXRpbykqMTA7c3dpdGNoKHQpe2Nhc2UiYm90dG9tIjp7Y29uc3QgVD1wLlN1YihpWzJdLG5ldyBwKHMqNS1JLzIsMCwwKSksQT1wLlN1YihpWzJdLG5ldyBwKHMqNSwtYiwwKSksJD1wLlN1YihpWzJdLG5ldyBwKHMqNStJLzIsMCwwKSk7YS5wdXNoKEEsJCwuLi5PLC4uLnUsLi4uZiwuLi5nLFQpO2JyZWFrfWNhc2UiYm90dG9tUmlnaHQiOntjb25zdCBUPXAuU3ViKGlbMl0sbmV3IHAocyoxLjEsMCwwKSksQT1wLlN1YihpWzJdLG5ldyBwKHMqMS4xK0kvMiwtYiwwKSksJD1wLlN1YihpWzJdLG5ldyBwKHMqMS4xK0ksMCwwKSk7YS5wdXNoKEEsJCwuLi5PLC4uLnUsLi4uZiwuLi5nLFQpO2JyZWFrfWNhc2UiYm90dG9tTGVmdCI6e2NvbnN0IFQ9cC5BZGQoaVszXSxuZXcgcChzKjEuMStJLDAsMCkpLEE9cC5BZGQoaVszXSxuZXcgcChzKjEuMStJLzIsYiwwKSksJD1wLkFkZChpWzNdLG5ldyBwKHMqMS4xLDAsMCkpO2EucHVzaChBLCQsLi4uTywuLi51LC4uLmYsLi4uZyxUKTticmVha31jYXNlInRvcCI6e2NvbnN0IFQ9cC5TdWIoaVsxXSxuZXcgcChzKjUtSS8yLDAsMCkpLEE9cC5TdWIoaVsxXSxuZXcgcChzKjUsYiwwKSksJD1wLlN1YihpWzFdLG5ldyBwKHMqNStJLzIsMCwwKSk7YS5wdXNoKEEsVCwuLi5mLC4uLmcsLi4uTywuLi51LCQpO2JyZWFrfWNhc2UidG9wUmlnaHQiOntjb25zdCBUPXAuU3ViKGlbMV0sbmV3IHAocyoxLjEsMCwwKSksQT1wLlN1YihpWzFdLG5ldyBwKHMqMS4xK0kvMixiLDApKSwkPXAuU3ViKGlbMV0sbmV3IHAocyoxLjErSSwwLDApKTthLnB1c2goQSxULC4uLmYsLi4uZywuLi5PLC4uLnUsJCk7YnJlYWt9Y2FzZSJ0b3BMZWZ0Ijp7Y29uc3QgVD1wLkFkZChpWzBdLG5ldyBwKHMqMS4xK0ksMCwwKSksQT1wLkFkZChpWzBdLG5ldyBwKHMqMS4xK0kvMiwtYiwwKSksJD1wLkFkZChpWzBdLG5ldyBwKHMqMS4xLDAsMCkpO2EucHVzaChBLFQsLi4uZiwuLi5nLC4uLk8sLi4udSwkKTticmVha31jYXNlImxlZnQiOntjb25zdCBUPXAuQWRkKGlbMF0sbmV3IHAoMCxuKjUtYi8yLDApKSxBPXAuQWRkKGlbMF0sbmV3IHAoLUksbio1LDApKSwkPXAuQWRkKGlbMF0sbmV3IHAoMCxuKjUrYi8yLDApKTthLnB1c2goQSxULC4uLnUsLi4uZiwuLi5nLC4uLk8sJCk7YnJlYWt9Y2FzZSJsZWZ0VG9wIjp7Y29uc3QgVD1wLkFkZChpWzBdLG5ldyBwKDAsbioxLjEsMCkpLEE9cC5BZGQoaVswXSxuZXcgcCgtSSxuKjEuMStiLzIsMCkpLCQ9cC5BZGQoaVswXSxuZXcgcCgwLG4qMS4xK2IsMCkpO2EucHVzaChBLFQsLi4udSwuLi5mLC4uLmcsLi4uTywkKTticmVha31jYXNlImxlZnRCb3R0b20iOntjb25zdCBUPXAuU3ViKGlbM10sbmV3IHAoMCxuKjEuMStiLDApKSxBPXAuU3ViKGlbM10sbmV3IHAoSSxuKjEuMStiLzIsMCkpLCQ9cC5TdWIoaVszXSxuZXcgcCgwLG4qMS4xLDApKTthLnB1c2goQSxULC4uLnUsLi4uZiwuLi5nLC4uLk8sJCk7YnJlYWt9Y2FzZSJyaWdodCI6e2NvbnN0IFQ9cC5BZGQoaVsxXSxuZXcgcCgwLG4qNS1iLzIsMCkpLEE9cC5BZGQoaVsxXSxuZXcgcChJLG4qNSwwKSksJD1wLkFkZChpWzFdLG5ldyBwKDAsbio1K2IvMiwwKSk7YS5wdXNoKEEsJCwuLi5nLC4uLk8sLi4udSwuLi5mLFQpO2JyZWFrfWNhc2UicmlnaHRUb3AiOntjb25zdCBUPXAuQWRkKGlbMV0sbmV3IHAoMCxuKjEuMSwwKSksQT1wLkFkZChpWzFdLG5ldyBwKEksbioxLjErYi8yLDApKSwkPXAuQWRkKGlbMV0sbmV3IHAoMCxuKjEuMStiLDApKTthLnB1c2goQSwkLC4uLmcsLi4uTywuLi51LC4uLmYsVCk7YnJlYWt9Y2FzZSJyaWdodEJvdHRvbSI6e2NvbnN0IFQ9cC5TdWIoaVsyXSxuZXcgcCgwLG4qMS4xK2IsMCkpLEE9cC5TdWIoaVsyXSxuZXcgcCgtSSxuKjEuMStiLzIsMCkpLCQ9cC5TdWIoaVsyXSxuZXcgcCgwLG4qMS4xLDApKTthLnB1c2goQSwkLC4uLmcsLi4uTywuLi51LC4uLmYsVCk7YnJlYWt9fWNvbnN0IHY9Ryh0aGlzLnRtcFBvaW50cyxlKSxMPVtNYXRoLmZsb29yKHYueCt2LncvMiksTWF0aC5mbG9vcih2Lnkrdi5oLzIpXTtyZXR1cm57cmVjdDp2LHBvczpMLHBvaW50czphfX11cGRhdGVUZW1wUG9pbnRzKGUpe2NvbnN0IHQ9ZS5zbGljZSgtMikscj1uZXcgUih0WzBdLHRbMV0pLGk9dGhpcy50bXBQb2ludHNbMF0se3RoaWNrbmVzczpzfT10aGlzLndvcmtPcHRpb25zO2lmKGkuaXNOZWFyKHIscyl8fFIuU3ViKGkscikuWFkuaW5jbHVkZXMoMCkpcmV0dXJuITE7aWYodGhpcy50bXBQb2ludHMubGVuZ3RoPT09Mil7aWYoci5pc05lYXIodGhpcy50bXBQb2ludHNbMV0sMSkpcmV0dXJuITE7dGhpcy50bXBQb2ludHNbMV09cn1lbHNlIHRoaXMudG1wUG9pbnRzLnB1c2gocik7cmV0dXJuITB9Y29uc3VtZVNlcnZpY2UoZSl7dmFyIGE7Y29uc3R7b3A6dCxpc0Z1bGxXb3JrOnJ9PWUsaT0oYT10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmEudG9TdHJpbmcoKTtpZighaSlyZXR1cm47dGhpcy50bXBQb2ludHMubGVuZ3RoPTA7Zm9yKGxldCBsPTA7bDx0Lmxlbmd0aDtsKz0zKXRoaXMudG1wUG9pbnRzLnB1c2gobmV3IFIodFtsXSx0W2wrMV0sdFtsKzJdKSk7Y29uc3Qgcz1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixuPXRoaXMuZHJhdyh7d29ya0lkOmksbGF5ZXI6cyxpc0RyYXdpbmc6ITF9KTtyZXR1cm4gdGhpcy5vbGRSZWN0PW4sdGhpcy52Tm9kZXMuc2V0SW5mbyhpLHtyZWN0Om4sb3A6dCxvcHQ6dGhpcy53b3JrT3B0aW9ucyx0b29sc1R5cGU6dGhpcy50b29sc1R5cGUsc2NhbGVUeXBlOnRoaXMuc2NhbGVUeXBlLGNhblJvdGF0ZTp0aGlzLmNhblJvdGF0ZSxjZW50ZXJQb3M6biYmeC5nZXRDZW50ZXJQb3MobixzKX0pLG59Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgdXBkYXRlTm9kZU9wdChlKXtjb25zdHtub2RlOnQsb3B0OnIsdk5vZGVzOml9PWUse3N0cm9rZUNvbG9yOnMsZmlsbENvbG9yOm4sdG9vbHNUeXBlOmEscGxhY2VtZW50Omx9PXIsYz1pLmdldCh0Lm5hbWUpLHU9Yz09bnVsbD92b2lkIDA6Yy5vcHQ7bGV0IGg9dDtyZXR1cm4gdC50YWdOYW1lPT09IkdST1VQIiYmKGg9dC5jaGlsZHJlblswXSkscyYmKGguc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksdSE9bnVsbCYmdS5zdHJva2VDb2xvciYmKHUuc3Ryb2tlQ29sb3I9cykpLG4mJihuPT09InRyYW5zcGFyZW50Ij9oLnNldEF0dHJpYnV0ZSgiZmlsbENvbG9yIiwicmdiYSgwLDAsMCwwKSIpOmguc2V0QXR0cmlidXRlKCJmaWxsQ29sb3IiLG4pLHUhPW51bGwmJnUuZmlsbENvbG9yJiYodS5maWxsQ29sb3I9bikpLGE9PT1TLlNwZWVjaEJhbGxvb24mJmwmJih1LnBsYWNlbWVudD1sKSxjJiZpLnNldEluZm8odC5uYW1lLHsuLi5jLG9wdDp1fSkseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBKciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuSW1hZ2V9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidG1wUG9pbnRzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya09wdGlvbnMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib2xkUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLHRoaXMud29ya09wdGlvbnM9ZS50b29sc09wdCx0aGlzLnNjYWxlVHlwZT10aGlzLndvcmtPcHRpb25zLnVuaWZvcm1TY2FsZT9xLnByb3BvcnRpb25hbDpxLmFsbH1jb25zdW1lKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1jb25zdW1lQWxsKCl7cmV0dXJue3R5cGU6bS5Ob25lfX1kcmF3KGUpe3ZhciBrO2NvbnN0e2xheWVyOnQsd29ya0lkOnIscmVwbGFjZUlkOmksaW1hZ2VCaXRtYXA6c309ZSx7Y2VudGVyWDpuLGNlbnRlclk6YSx3aWR0aDpsLGhlaWdodDpjLHNjYWxlOnUscm90YXRlOmgsdHJhbnNsYXRlOmQsekluZGV4OmZ9PXRoaXMud29ya09wdGlvbnM7dGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoaXx8cikubWFwKE89Pk8ucmVtb3ZlKCkpLChrPXRoaXMuZHJhd0xheWVyKT09bnVsbHx8ay5nZXRFbGVtZW50c0J5TmFtZShpfHxyKS5tYXAoTz0+Ty5yZW1vdmUoKSk7Y29uc3Qgdz17YW5jaG9yOlsuNSwuNV0scG9zOltuLGFdLG5hbWU6cixzaXplOltsLGNdLHpJbmRleDpmfTtpZih1KWlmKHRoaXMuc2NhbGVUeXBlPT09cS5wcm9wb3J0aW9uYWwpe2NvbnN0IE89TWF0aC5taW4odVswXSx1WzFdKTt3LnNjYWxlPVtPLE9dfWVsc2Ugdy5zY2FsZT11O2QmJih3LnRyYW5zbGF0ZT1kKSxoJiYody5yb3RhdGU9aCk7Y29uc3QgeT1uZXcgei5Hcm91cCh3KSxnPW5ldyB6LlNwcml0ZSh7YW5jaG9yOlsuNSwuNV0scG9zOlswLDBdLHNpemU6W2wsY10sdGV4dHVyZTpzLHJvdGF0ZToxODB9KTt5LmFwcGVuZChnKSx0LmFwcGVuZCh5KTtjb25zdCBQPXkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7aWYoUClyZXR1cm57eDpNYXRoLmZsb29yKFAueC14LlNhZmVCb3JkZXJQYWRkaW5nKSx5Ok1hdGguZmxvb3IoUC55LXguU2FmZUJvcmRlclBhZGRpbmcpLHc6TWF0aC5mbG9vcihQLndpZHRoK3guU2FmZUJvcmRlclBhZGRpbmcqMiksaDpNYXRoLmZsb29yKFAuaGVpZ2h0K3guU2FmZUJvcmRlclBhZGRpbmcqMil9fWNvbnN1bWVTZXJ2aWNlKCl7fWFzeW5jIGNvbnN1bWVTZXJ2aWNlQXN5bmMoZSl7dmFyIGMsdTtjb25zdHtpc0Z1bGxXb3JrOnQscmVwbGFjZUlkOnIsc2NlbmU6aX09ZSx7c3JjOnMsdXVpZDpufT10aGlzLndvcmtPcHRpb25zLGE9KChjPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6Yy50b1N0cmluZygpKXx8bixsPXQ/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyO2lmKHMpe2NvbnN0IGg9YXdhaXQgaS5wcmVsb2FkKHtpZDpuLHNyYzp0aGlzLndvcmtPcHRpb25zLnNyY30pLGQ9dGhpcy5kcmF3KHt3b3JrSWQ6YSxsYXllcjpsLHJlcGxhY2VJZDpyLGltYWdlQml0bWFwOmhbMF19KTtyZXR1cm4gdGhpcy5vbGRSZWN0PWEmJigodT10aGlzLnZOb2Rlcy5nZXQoYSkpPT1udWxsP3ZvaWQgMDp1LnJlY3QpfHx2b2lkIDAsdGhpcy52Tm9kZXMuc2V0SW5mbyhhLHtyZWN0OmQsb3A6W10sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOmQmJnguZ2V0Q2VudGVyUG9zKGQsbCl9KSxkfX1jbGVhclRtcFBvaW50cygpe3RoaXMudG1wUG9pbnRzLmxlbmd0aD0wfXN0YXRpYyB1cGRhdGVOb2RlT3B0KGUpe2NvbnN0e25vZGU6dCxvcHQ6cix2Tm9kZXM6aSx0YXJnZXROb2RlOnN9PWUse3RyYW5zbGF0ZTpuLGJveDphLGJveFNjYWxlOmwsYm94VHJhbnNsYXRlOmMsYW5nbGU6dSxpc0xvY2tlZDpoLHpJbmRleDpkfT1yLGY9cyYmcmUocyl8fGkuZ2V0KHQubmFtZSk7aWYoIWYpcmV0dXJuO2NvbnN0IHc9dC5wYXJlbnQ7aWYodyl7aWYoaGUoZCkmJih0LnNldEF0dHJpYnV0ZSgiekluZGV4IixkKSxmLm9wdC56SW5kZXg9ZCksd2UoaCkmJihmLm9wdC5sb2NrZWQ9aCksYSYmYyYmbCl7Y29uc3R7Y2VudGVyWDp5LGNlbnRlclk6Zyx3aWR0aDpQLGhlaWdodDprLHVuaWZvcm1TY2FsZTpPfT1mLm9wdDtpZihPKXtjb25zdCB2PU1hdGgubWluKGxbMF0sbFsxXSk7Zi5vcHQuc2NhbGU9W3Ysdl19ZWxzZSBmLm9wdC5zY2FsZT1sO2Yub3B0LndpZHRoPU1hdGguZmxvb3IoUCpsWzBdKSxmLm9wdC5oZWlnaHQ9TWF0aC5mbG9vcihrKmxbMV0pO2NvbnN0IEk9W2NbMF0vdy53b3JsZFNjYWxpbmdbMF0sY1sxXS93LndvcmxkU2NhbGluZ1sxXV07Zi5vcHQuY2VudGVyWD15K0lbMF0sZi5vcHQuY2VudGVyWT1nK0lbMV07Y29uc3QgYj1bZi5jZW50ZXJQb3NbMF0rSVswXSxmLmNlbnRlclBvc1sxXStJWzFdXTtpZihmLmNlbnRlclBvcz1iLHMpe2xldCB2PUlyKGYucmVjdCxsKTt2PUNlKHYsSSksZi5yZWN0PXZ9fWVsc2UgaWYobil7Y29uc3QgeT1bblswXS93LndvcmxkU2NhbGluZ1swXSxuWzFdL3cud29ybGRTY2FsaW5nWzFdXTtpZihmLm9wdC5jZW50ZXJYPWYub3B0LmNlbnRlclgreVswXSxmLm9wdC5jZW50ZXJZPWYub3B0LmNlbnRlclkreVsxXSxmLmNlbnRlclBvcz1bZi5jZW50ZXJQb3NbMF0reVswXSxmLmNlbnRlclBvc1sxXSt5WzFdXSxzKXtjb25zdCBnPUNlKGYucmVjdCx5KTtmLnJlY3Q9Z319ZWxzZSBpZihoZSh1KSYmKHQuc2V0QXR0cmlidXRlKCJyb3RhdGUiLHUpLGYub3B0LnJvdGF0ZT11LHMpKXtjb25zdCB5PVRyKGYucmVjdCx1KTtmLnJlY3Q9eX1yZXR1cm4gZiYmaS5zZXRJbmZvKHQubmFtZSxmKSxmPT1udWxsP3ZvaWQgMDpmLnJlY3R9fX1jbGFzcyBLciBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYm90aH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0b29sc1R5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpTLlN0cmFpZ2h0fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcFBvaW50cyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOltdfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIndvcmtPcHRpb25zIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm9sZFJlY3QiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic3RyYWlnaHRUaXBXaWR0aCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzeW5jVGltZXN0YW1wIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0LHRoaXMuc3RyYWlnaHRUaXBXaWR0aD10aGlzLndvcmtPcHRpb25zLnRoaWNrbmVzcy8yLHRoaXMuc3luY1RpbWVzdGFtcD0wLHRoaXMuc3luY1VuaXRUaW1lPTUwfWNvbnN1bWUoZSl7dmFyIGY7Y29uc3R7ZGF0YTp0LGlzRnVsbFdvcms6cixpc1N1YldvcmtlcjppfT1lLHM9KGY9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpmLnRvU3RyaW5nKCk7aWYoIXMpcmV0dXJue3R5cGU6bS5Ob25lfTtjb25zdHtvcDpuLHdvcmtTdGF0ZTphfT10LGw9bj09bnVsbD92b2lkIDA6bi5sZW5ndGg7aWYoIWx8fGw8MilyZXR1cm57dHlwZTptLk5vbmV9O2xldCBjO2lmKGE9PT1GLlN0YXJ0Pyh0aGlzLnRtcFBvaW50cz1bbmV3IFIoblswXSxuWzFdKV0sYz0hMSk6Yz10aGlzLnVwZGF0ZVRlbXBQb2ludHMobiksIWMpcmV0dXJue3R5cGU6bS5Ob25lfTtpZighaSl7Y29uc3Qgdz1EYXRlLm5vdygpO3JldHVybiB3LXRoaXMuc3luY1RpbWVzdGFtcD50aGlzLnN5bmNVbml0VGltZT8odGhpcy5zeW5jVGltZXN0YW1wPXcse3R5cGU6bS5EcmF3V29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpzLG9wOnRoaXMudG1wUG9pbnRzLm1hcCh5PT5bLi4ueS5YWSwwXSkuZmxhdCgxKSxpc1N5bmM6ITAsaW5kZXg6MH0pOnt0eXBlOm0uTm9uZX19Y29uc3QgdT1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixoPXRoaXMuZHJhdyh7d29ya0lkOnMsbGF5ZXI6dX0pLGQ9TShoLHRoaXMub2xkUmVjdCk7cmV0dXJuIHRoaXMub2xkUmVjdD1oLHtyZWN0OmQsdHlwZTptLkRyYXdXb3JrLGRhdGFUeXBlOlcuTG9jYWwsd29ya0lkOnN9fWNvbnN1bWVBbGwoZSl7dmFyIGw7Y29uc3R7ZGF0YTp0fT1lLHI9KGw9dD09bnVsbD92b2lkIDA6dC53b3JrSWQpPT1udWxsP3ZvaWQgMDpsLnRvU3RyaW5nKCk7aWYoIXIpcmV0dXJue3R5cGU6bS5Ob25lfTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg8MilyZXR1cm57dHlwZTptLlJlbW92ZU5vZGUscmVtb3ZlSWRzOltyXX07Y29uc3QgaT10aGlzLmZ1bGxMYXllcixzPXRoaXMuZHJhdyh7d29ya0lkOnIsbGF5ZXI6aX0pO3RoaXMub2xkUmVjdD1zO2NvbnN0IG49dGhpcy50bXBQb2ludHMubWFwKGM9PlsuLi5jLlhZLDBdKS5mbGF0KDEpLGE9bGUobik7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8ocix7cmVjdDpzLG9wOm4sb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOnMmJnguZ2V0Q2VudGVyUG9zKHMsaSl9KSx7cmVjdDpzLHR5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLkxvY2FsLHdvcmtJZDpyLG9wczphLGlzU3luYzohMCxvcHQ6dGhpcy53b3JrT3B0aW9uc319ZHJhdyhlKXt2YXIgaztjb25zdHt3b3JrSWQ6dCxsYXllcjpyfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcChPPT5PLnJlbW92ZSgpKSwoaz10aGlzLmRyYXdMYXllcik9PW51bGx8fGsuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKE89Pk8ucmVtb3ZlKCkpO2NvbnN0e3N0cm9rZUNvbG9yOmksdGhpY2tuZXNzOnMsekluZGV4Om4sc2NhbGU6YSxyb3RhdGU6bCx0cmFuc2xhdGU6Y309dGhpcy53b3JrT3B0aW9ucyx1PXIud29ybGRQb3NpdGlvbixoPXIud29ybGRTY2FsaW5nLHtkLHJlY3Q6Zn09dGhpcy5jb21wdXREcmF3UG9pbnRzKHMpLHc9W2YueCtmLncvMixmLnkrZi5oLzJdLHk9e3Bvczp3LG5hbWU6dCxpZDp0LGQsZmlsbENvbG9yOmksc3Ryb2tlQ29sb3I6aSxsaW5lV2lkdGg6MCxjbGFzc05hbWU6YCR7d1swXX0sJHt3WzFdfWAsbm9ybWFsaXplOiEwLHpJbmRleDpufTthJiYoeS5zY2FsZT1hKSxsJiYoeS5yb3RhdGU9bCksYyYmKHkudHJhbnNsYXRlPWMpO2NvbnN0IGc9bmV3IHouUGF0aCh5KTtpZihyLmFwcGVuZChnKSxsfHxhfHxjKXtjb25zdCBPPWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJue3g6TWF0aC5mbG9vcihPLngteC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKE8ueS14LlNhZmVCb3JkZXJQYWRkaW5nKSx3Ok1hdGguZmxvb3IoTy53aWR0aCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpLGg6TWF0aC5mbG9vcihPLmhlaWdodCt4LlNhZmVCb3JkZXJQYWRkaW5nKjIpfX1yZXR1cm57eDpNYXRoLmZsb29yKGYueCpoWzBdK3VbMF0teC5TYWZlQm9yZGVyUGFkZGluZykseTpNYXRoLmZsb29yKGYueSpoWzFdK3VbMV0teC5TYWZlQm9yZGVyUGFkZGluZyksdzpNYXRoLmZsb29yKGYudypoWzBdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyksaDpNYXRoLmZsb29yKGYuaCpoWzFdKzIqeC5TYWZlQm9yZGVyUGFkZGluZyl9fWNvbXB1dERyYXdQb2ludHMoZSl7cmV0dXJuIHRoaXMudG1wUG9pbnRzWzFdLmRpc3RhbmNlKHRoaXMudG1wUG9pbnRzWzBdKT50aGlzLnN0cmFpZ2h0VGlwV2lkdGg/dGhpcy5jb21wdXRGdWxsUG9pbnRzKGUpOnRoaXMuY29tcHV0RG90UG9pbnRzKGUpfWNvbXB1dEZ1bGxQb2ludHMoZSl7Y29uc3QgdD1wLlN1Yih0aGlzLnRtcFBvaW50c1sxXSx0aGlzLnRtcFBvaW50c1swXSkudW5pKCkscj1wLlBlcih0KS5tdWwoZS8yKSxpPVIuU3ViKHRoaXMudG1wUG9pbnRzWzBdLHIpLHM9Ui5BZGQodGhpcy50bXBQb2ludHNbMF0sciksbj1SLlN1Yih0aGlzLnRtcFBvaW50c1sxXSxyKSxhPVIuQWRkKHRoaXMudG1wUG9pbnRzWzFdLHIpLGw9Ui5HZXRTZW1pY2lyY2xlU3Ryb2tlKHRoaXMudG1wUG9pbnRzWzFdLG4sLTEsOCksYz1SLkdldFNlbWljaXJjbGVTdHJva2UodGhpcy50bXBQb2ludHNbMF0scywtMSw4KSx1PVtpLG4sLi4ubCxhLHMsLi4uY107cmV0dXJue2Q6eGUodSwhMCkscmVjdDpHKHUpLGlzRG90OiExLHBvczp0aGlzLnRtcFBvaW50c1swXS5YWX19Y29tcHV0RG90UG9pbnRzKGUpe2NvbnN0IHQ9Ui5HZXREb3RTdHJva2UodGhpcy50bXBQb2ludHNbMF0sZS8yLDgpO3JldHVybntkOnhlKHQsITApLHJlY3Q6Ryh0KSxpc0RvdDohMCxwb3M6dGhpcy50bXBQb2ludHNbMF0uWFl9fXVwZGF0ZVRlbXBQb2ludHMoZSl7Y29uc3QgdD1lLnNsaWNlKC0yKSxyPW5ldyBSKHRbMF0sdFsxXSksaT10aGlzLnRtcFBvaW50c1swXSx7dGhpY2tuZXNzOnN9PXRoaXMud29ya09wdGlvbnM7aWYoaS5pc05lYXIocixzKSlyZXR1cm4hMTtpZih0aGlzLnRtcFBvaW50cy5sZW5ndGg9PT0yKXtpZihyLmlzTmVhcih0aGlzLnRtcFBvaW50c1sxXSwxKSlyZXR1cm4hMTt0aGlzLnRtcFBvaW50c1sxXT1yfWVsc2UgdGhpcy50bXBQb2ludHMucHVzaChyKTtyZXR1cm4hMH1jb25zdW1lU2VydmljZShlKXt2YXIgYTtjb25zdHtvcDp0LGlzRnVsbFdvcms6cn09ZSxpPShhPXRoaXMud29ya0lkKT09bnVsbD92b2lkIDA6YS50b1N0cmluZygpO2lmKCFpKXJldHVybjt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MDtmb3IobGV0IGw9MDtsPHQubGVuZ3RoO2wrPTMpdGhpcy50bXBQb2ludHMucHVzaChuZXcgUih0W2xdLHRbbCsxXSx0W2wrMl0pKTtjb25zdCBzPXI/dGhpcy5mdWxsTGF5ZXI6dGhpcy5kcmF3TGF5ZXJ8fHRoaXMuZnVsbExheWVyLG49dGhpcy5kcmF3KHt3b3JrSWQ6aSxsYXllcjpzfSk7cmV0dXJuIHRoaXMub2xkUmVjdD1uLHRoaXMudk5vZGVzLnNldEluZm8oaSx7cmVjdDpuLG9wOnQsb3B0OnRoaXMud29ya09wdGlvbnMsdG9vbHNUeXBlOnRoaXMudG9vbHNUeXBlLHNjYWxlVHlwZTp0aGlzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6dGhpcy5jYW5Sb3RhdGUsY2VudGVyUG9zOm4mJnguZ2V0Q2VudGVyUG9zKG4scyl9KSxufWNsZWFyVG1wUG9pbnRzKCl7dGhpcy50bXBQb2ludHMubGVuZ3RoPTB9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7dmFyIGE7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppfT1lLHtzdHJva2VDb2xvcjpzfT1yLG49aS5nZXQodC5uYW1lKTtyZXR1cm4gcyYmKHQuc2V0QXR0cmlidXRlKCJzdHJva2VDb2xvciIscyksdC5zZXRBdHRyaWJ1dGUoImZpbGxDb2xvciIscyksKGE9bj09bnVsbD92b2lkIDA6bi5vcHQpIT1udWxsJiZhLnN0cm9rZUNvbG9yJiYobi5vcHQuc3Ryb2tlQ29sb3I9cykpLG4mJmkuc2V0SW5mbyh0Lm5hbWUsbikseC51cGRhdGVOb2RlT3B0KGUpfX1jbGFzcyBOZSBleHRlbmRzIHh7Y29uc3RydWN0b3IoZSl7c3VwZXIoZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhblJvdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNjYWxlVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnEuYWxsfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRvb2xzVHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlMuVGV4dH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBQb2ludHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpbXX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrT3B0aW9ucyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJvbGRSZWN0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy53b3JrT3B0aW9ucz1lLnRvb2xzT3B0fWNvbnN1bWUoKXtyZXR1cm57dHlwZTptLk5vbmV9fWNvbnN1bWVBbGwoKXtyZXR1cm57dHlwZTptLk5vbmV9fWRyYXcoZSl7dmFyIHc7Y29uc3R7d29ya0lkOnQsbGF5ZXI6cixpc0RyYXdMYWJlbDppfT1lO3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQpLm1hcCh5PT55LnJlbW92ZSgpKSwodz10aGlzLmRyYXdMYXllcik9PW51bGx8fHcuZ2V0RWxlbWVudHNCeU5hbWUodCkubWFwKHk9PnkucmVtb3ZlKCkpO2NvbnN0e2JveFNpemU6cyxib3hQb2ludDpuLHpJbmRleDphfT10aGlzLndvcmtPcHRpb25zLGw9ci53b3JsZFBvc2l0aW9uLGM9ci53b3JsZFNjYWxpbmc7aWYoIW58fCFzKXJldHVybjtjb25zdCB1PW5ldyB6Lkdyb3VwKHtuYW1lOnQsaWQ6dCxwb3M6W25bMF0rc1swXS8yLG5bMV0rc1sxXS8yXSxhbmNob3I6Wy41LC41XSxzaXplOnMsekluZGV4OmF9KSxoPXt4Om5bMF0seTpuWzFdLHc6c1swXSxoOnNbMV19LGQ9bmV3IHouUmVjdCh7bm9ybWFsaXplOiEwLHBvczpbMCwwXSxzaXplOnN9KSxmPWkmJk5lLmNyZWF0ZUxhYmVscyh0aGlzLndvcmtPcHRpb25zLHIpfHxbXTtyZXR1cm4gdS5hcHBlbmQoLi4uZixkKSxyLmFwcGVuZCh1KSx7eDpNYXRoLmZsb29yKGgueCpjWzBdK2xbMF0pLHk6TWF0aC5mbG9vcihoLnkqY1sxXStsWzFdKSx3Ok1hdGguZmxvb3IoaC53KmNbMF0pLGg6TWF0aC5mbG9vcihoLmgqY1sxXSl9fWNvbnN1bWVTZXJ2aWNlKGUpe3ZhciBsLGM7Y29uc3QgdD0obD10aGlzLndvcmtJZCk9PW51bGw/dm9pZCAwOmwudG9TdHJpbmcoKTtpZighdClyZXR1cm47Y29uc3R7aXNGdWxsV29yazpyLHJlcGxhY2VJZDppLGlzRHJhd0xhYmVsOnN9PWU7dGhpcy5vbGRSZWN0PWkmJigoYz10aGlzLnZOb2Rlcy5nZXQoaSkpPT1udWxsP3ZvaWQgMDpjLnJlY3QpfHx2b2lkIDA7Y29uc3Qgbj1yP3RoaXMuZnVsbExheWVyOnRoaXMuZHJhd0xheWVyfHx0aGlzLmZ1bGxMYXllcixhPXRoaXMuZHJhdyh7d29ya0lkOnQsbGF5ZXI6bixpc0RyYXdMYWJlbDpzfSk7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8odCx7cmVjdDphLG9wOltdLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczphJiZ4LmdldENlbnRlclBvcyhhLG4pfSksYX11cGRhdGFPcHRTZXJ2aWNlKGUpe2lmKCF0aGlzLndvcmtJZClyZXR1cm47Y29uc3QgdD10aGlzLndvcmtJZC50b1N0cmluZygpLHtmb250Q29sb3I6cixmb250QmdDb2xvcjppLGJvbGQ6cyxpdGFsaWM6bixsaW5lVGhyb3VnaDphLHVuZGVybGluZTpsLHpJbmRleDpjfT1lLHU9dGhpcy52Tm9kZXMuZ2V0KHQpO2lmKCF1KXJldHVybjtyJiYodS5vcHQuZm9udENvbG9yPXIpLGkmJih1Lm9wdC5mb250QmdDb2xvcj1pKSxzJiYodS5vcHQuYm9sZD1zKSxuJiYodS5vcHQuaXRhbGljPW4pLHdlKGEpJiYodS5vcHQubGluZVRocm91Z2g9YSksd2UobCkmJih1Lm9wdC51bmRlcmxpbmU9bCksaSYmKHUub3B0LmZvbnRCZ0NvbG9yPWkpLGhlKGMpJiYodS5vcHQuekluZGV4PWMpLHRoaXMub2xkUmVjdD11LnJlY3Q7Y29uc3QgaD10aGlzLmRyYXcoe3dvcmtJZDp0LGxheWVyOnRoaXMuZnVsbExheWVyLGlzRHJhd0xhYmVsOiExfSk7cmV0dXJuIHRoaXMudk5vZGVzLnNldEluZm8odCx7cmVjdDpoLG9wOltdLG9wdDp0aGlzLndvcmtPcHRpb25zLHRvb2xzVHlwZTp0aGlzLnRvb2xzVHlwZSxzY2FsZVR5cGU6dGhpcy5zY2FsZVR5cGUsY2FuUm90YXRlOnRoaXMuY2FuUm90YXRlLGNlbnRlclBvczpoJiZ4LmdldENlbnRlclBvcyhoLHRoaXMuZnVsbExheWVyKX0pLGh9Y2xlYXJUbXBQb2ludHMoKXt0aGlzLnRtcFBvaW50cy5sZW5ndGg9MH1zdGF0aWMgZ2V0Rm9udFdpZHRoKGUpe2NvbnN0e2N0eDp0LG9wdDpyLHRleHQ6aX09ZSx7Ym9sZDpzLGl0YWxpYzpuLGZvbnRTaXplOmEsZm9udEZhbWlseTpsfT1yO3JldHVybiB0LmZvbnQ9YCR7c30gJHtufSAke2F9cHggJHtsfWAsdC5tZWFzdXJlVGV4dChpKS53aWR0aH1zdGF0aWMgY3JlYXRlTGFiZWxzKGUsdCl7Y29uc3Qgcj1bXSxpPWUudGV4dC5zcGxpdCgiLCIpLHM9aS5sZW5ndGg7Zm9yKGxldCBuPTA7bjxzO24rKyl7Y29uc3QgYT1pW25dLHtmb250U2l6ZTpsLGxpbmVIZWlnaHQ6Yyxib2xkOnUsdGV4dEFsaWduOmgsaXRhbGljOmQsYm94U2l6ZTpmLGZvbnRGYW1pbHk6dyx2ZXJ0aWNhbEFsaWduOnksZm9udENvbG9yOmcsdW5kZXJsaW5lOlAsbGluZVRocm91Z2g6a309ZSxPPWN8fGwqMS4yLEk9dCYmdC5wYXJlbnQuY2FudmFzLmdldENvbnRleHQoIjJkIiksYj1JJiZOZS5nZXRGb250V2lkdGgoe3RleHQ6YSxvcHQ6ZSxjdHg6SSx3b3JsZFNjYWxpbmc6dC53b3JsZFNjYWxpbmd9KTtpZihiKXtjb25zdCB2PXthbmNob3I6WzAsLjVdLHRleHQ6YSxmb250U2l6ZTpsLGxpbmVIZWlnaHQ6Tyxmb250RmFtaWx5OncsZm9udFdlaWdodDp1LGZpbGxDb2xvcjpnLHRleHRBbGlnbjpoLGZvbnRTdHlsZTpkLG5hbWU6bi50b1N0cmluZygpLGNsYXNzTmFtZToibGFiZWwifSxMPVswLDBdO2lmKHk9PT0ibWlkZGxlIil7Y29uc3QgQT0ocy0xKS8yO0xbMV09KG4tQSkqT31oPT09ImxlZnQiJiYoTFswXT1mJiYtZlswXS8yKzV8fDApLHYucG9zPUw7Y29uc3QgVD1uZXcgei5MYWJlbCh2KTtpZihyLnB1c2goVCksUCl7Y29uc3QgQT17bm9ybWFsaXplOiExLHBvczpbdi5wb3NbMF0sdi5wb3NbMV0rbC8yXSxsaW5lV2lkdGg6Mip0LndvcmxkU2NhbGluZ1swXSxwb2ludHM6WzAsMCxiLDBdLHN0cm9rZUNvbG9yOmcsbmFtZTpgJHtufV91bmRlcmxpbmVgLGNsYXNzTmFtZToidW5kZXJsaW5lIn0sJD1uZXcgei5Qb2x5bGluZShBKTtyLnB1c2goJCl9aWYoayl7Y29uc3QgQT17bm9ybWFsaXplOiExLHBvczp2LnBvcyxsaW5lV2lkdGg6Mip0LndvcmxkU2NhbGluZ1swXSxwb2ludHM6WzAsMCxiLDBdLHN0cm9rZUNvbG9yOmcsbmFtZTpgJHtufV9saW5lVGhyb3VnaGAsY2xhc3NOYW1lOiJsaW5lVGhyb3VnaCJ9LCQ9bmV3IHouUG9seWxpbmUoQSk7ci5wdXNoKCQpfX19cmV0dXJuIHJ9c3RhdGljIHVwZGF0ZU5vZGVPcHQoZSl7Y29uc3R7bm9kZTp0LG9wdDpyLHZOb2RlczppLHRhcmdldE5vZGU6c309ZSx7Zm9udEJnQ29sb3I6bixmb250Q29sb3I6YSx0cmFuc2xhdGU6bCxib3g6Yyxib3hTY2FsZTp1LGJveFRyYW5zbGF0ZTpoLGJvbGQ6ZCxpdGFsaWM6ZixsaW5lVGhyb3VnaDp3LHVuZGVybGluZTp5LGZvbnRTaXplOmcsdGV4dEluZm9zOlB9PXIsaz1zJiZyZShzKXx8aS5nZXQodC5uYW1lKTtpZighaylyZXR1cm47Y29uc3QgTz10LnBhcmVudDtpZighTylyZXR1cm47Y29uc3QgST1rLm9wdDtpZihhJiZJLmZvbnRDb2xvciYmKEkuZm9udENvbG9yPWEpLG4mJkkuZm9udEJnQ29sb3ImJihJLmZvbnRCZ0NvbG9yPW4pLGQmJihJLmJvbGQ9ZCksZiYmKEkuaXRhbGljPWYpLHdlKHcpJiYoSS5saW5lVGhyb3VnaD13KSx3ZSh5KSYmKEkudW5kZXJsaW5lPXkpLGcmJihJLmZvbnRTaXplPWcpLGMmJmgmJnUpe2NvbnN0IGI9UD09bnVsbD92b2lkIDA6UC5nZXQodC5uYW1lKTtpZihiKXtjb25zdHtmb250U2l6ZTpULGJveFNpemU6QX09YjtJLmJveFNpemU9QXx8SS5ib3hTaXplLEkuZm9udFNpemU9VHx8SS5mb250U2l6ZX1jb25zdCB2PWsucmVjdCxMPUNlKElyKHYsdSksaCk7SS5ib3hQb2ludD1MJiZbKEwueC1PLndvcmxkUG9zaXRpb25bMF0pL08ud29ybGRTY2FsaW5nWzBdLChMLnktTy53b3JsZFBvc2l0aW9uWzFdKS9PLndvcmxkU2NhbGluZ1sxXV19ZWxzZSBpZihsJiZJLmJveFBvaW50KXtjb25zdCBiPVtsWzBdL08ud29ybGRTY2FsaW5nWzBdLGxbMV0vTy53b3JsZFNjYWxpbmdbMV1dO0kuYm94UG9pbnQ9W0kuYm94UG9pbnRbMF0rYlswXSxJLmJveFBvaW50WzFdK2JbMV1dLGsuY2VudGVyUG9zPVtrLmNlbnRlclBvc1swXStiWzBdLGsuY2VudGVyUG9zWzFdK2JbMV1dLGsucmVjdD1DZShrLnJlY3QsYil9cmV0dXJuIGsmJmkuc2V0SW5mbyh0Lm5hbWUsayksaz09bnVsbD92b2lkIDA6ay5yZWN0fXN0YXRpYyBnZXRSZWN0RnJvbUxheWVyKGUsdCl7Y29uc3Qgcj1lLmdldEVsZW1lbnRzQnlOYW1lKHQpWzBdO2lmKHIpe2NvbnN0IGk9ci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm57eDpNYXRoLmZsb29yKGkueCkseTpNYXRoLmZsb29yKGkueSksdzpNYXRoLmZsb29yKGkud2lkdGgpLGg6TWF0aC5mbG9vcihpLmhlaWdodCl9fX19ZnVuY3Rpb24gVnIobyl7c3dpdGNoKG8pe2Nhc2UgUy5BcnJvdzpyZXR1cm4gWHI7Y2FzZSBTLlBlbmNpbDpyZXR1cm4gQ3I7Y2FzZSBTLlN0cmFpZ2h0OnJldHVybiBLcjtjYXNlIFMuRWxsaXBzZTpyZXR1cm4gSHI7Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlRyaWFuZ2xlOnJldHVybiBacjtjYXNlIFMuU3RhcjpjYXNlIFMuUmhvbWJ1czpyZXR1cm4gcXI7Y2FzZSBTLlJlY3RhbmdsZTpyZXR1cm4gWXI7Y2FzZSBTLlNwZWVjaEJhbGxvb246cmV0dXJuIFFyO2Nhc2UgUy5UZXh0OnJldHVybiBOZTtjYXNlIFMuTGFzZXJQZW46cmV0dXJuIE5yO2Nhc2UgUy5FcmFzZXI6cmV0dXJuIG5lO2Nhc2UgUy5TZWxlY3RvcjpyZXR1cm4gRTtjYXNlIFMuSW1hZ2U6cmV0dXJuIEpyfX1mdW5jdGlvbiBidChvLGUpe2NvbnN0e3Rvb2xzVHlwZTp0LC4uLnJ9PW87c3dpdGNoKHQpe2Nhc2UgUy5BcnJvdzpyZXR1cm4gbmV3IFhyKHIpO2Nhc2UgUy5QZW5jaWw6cmV0dXJuIG5ldyBDcihyKTtjYXNlIFMuU3RyYWlnaHQ6cmV0dXJuIG5ldyBLcihyKTtjYXNlIFMuRWxsaXBzZTpyZXR1cm4gbmV3IEhyKHIpO2Nhc2UgUy5Qb2x5Z29uOmNhc2UgUy5UcmlhbmdsZTpyZXR1cm4gbmV3IFpyKHIpO2Nhc2UgUy5TdGFyOmNhc2UgUy5SaG9tYnVzOnJldHVybiBuZXcgcXIocik7Y2FzZSBTLlJlY3RhbmdsZTpyZXR1cm4gbmV3IFlyKHIpO2Nhc2UgUy5TcGVlY2hCYWxsb29uOnJldHVybiBuZXcgUXIocik7Y2FzZSBTLlRleHQ6cmV0dXJuIG5ldyBOZShyKTtjYXNlIFMuTGFzZXJQZW46cmV0dXJuIG5ldyBOcihyKTtjYXNlIFMuRXJhc2VyOnJldHVybiBuZXcgbmUocixlKTtjYXNlIFMuU2VsZWN0b3I6cmV0dXJuIG5ldyBFKHIpO2Nhc2UgUy5JbWFnZTpyZXR1cm4gbmV3IEpyKHIpO2RlZmF1bHQ6cmV0dXJufX1mdW5jdGlvbiBlbyhvKXtjb25zdCBlPVtdLHQ9WyJQQVRIIiwiU1BSSVRFIiwiUE9MWUxJTkUiLCJSRUNUIiwiRUxMSVBTRSJdO2Zvcihjb25zdCByIG9mIG8pe2lmKHIudGFnTmFtZT09PSJHUk9VUCImJnIuY2hpbGRyZW4ubGVuZ3RoKXJldHVybiBlbyhyLmNoaWxkcmVuKTtyLnRhZ05hbWUmJnQuaW5jbHVkZXMoci50YWdOYW1lKSYmZS5wdXNoKHIpfXJldHVybiBlfWNsYXNzIHBmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5aSW5kZXhBY3RpdmV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aX09ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSksITB9Y29uc3VtZUZvckxvY2FsV29ya2VyKGUpe3ZhciBhLGwsYyx1LGg7Y29uc3R7d29ya0lkOnQsaXNBY3RpdmVaSW5kZXg6cix3aWxsUmVmcmVzaFNlbGVjdG9yOml9PWU7aWYodCE9PUUuc2VsZWN0b3JJZClyZXR1cm47Y29uc3Qgcz0oYT10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOmEud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighcylyZXR1cm47Y29uc3Qgbj1zLm9sZFNlbGVjdFJlY3Q7aWYociYmbiYmdGhpcy5sb2NhbFdvcmspe2NvbnN0IGQ9bmV3IFNldDtpZih0aGlzLmxvY2FsV29yay52Tm9kZXMuY3VyTm9kZU1hcC5mb3JFYWNoKChmLHcpPT57UGUobixmLnJlY3QpJiZkLmFkZCh3KX0pLGQuc2l6ZSl7Y29uc3QgZj1bXTtkLmZvckVhY2godz0+e3ZhciB5Oyh5PXRoaXMubG9jYWxXb3JrKT09bnVsbHx8eS5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUodykuZm9yRWFjaChnPT57dmFyIGssTztjb25zdCBQPWcuY2xvbmVOb2RlKCEwKTtIZShnKSYmUC5zZWFsKCksKE89KGs9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDprLmRyYXdMYXllcikhPW51bGwmJk8uZ2V0RWxlbWVudHNCeU5hbWUodykubGVuZ3RofHxmLnB1c2goUCl9KX0pLGYubGVuZ3RoJiYoKGw9dGhpcy5sb2NhbFdvcmsuZHJhd0xheWVyKT09bnVsbHx8bC5hcHBlbmQoLi4uZikpfX1lbHNlKHU9KGM9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpjLmRyYXdMYXllcik9PW51bGx8fHUuY2hpbGRyZW4uZmlsdGVyKGQ9Pnt2YXIgZjtyZXR1cm4hKChmPXMuc2VsZWN0SWRzKSE9bnVsbCYmZi5pbmNsdWRlcyhkLm5hbWUpKX0pLmZvckVhY2goZD0+ZC5yZW1vdmUoKSk7aSYmKChoPXRoaXMubG9jYWxXb3JrKT09bnVsbHx8aC5fcG9zdCh7cmVuZGVyOlt7cmVjdDpuLGRyYXdDYW52YXM6Ti5TZWxlY3RvcixjbGVhckNhbnZhczpOLlNlbGVjdG9yLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy5sb2NhbFdvcmsudmlld0lkfV0sc3A6W3t0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxvcHQ6cy5nZXRXb3JrT3B0aW9ucygpLHNlbGVjdFJlY3Q6bixzdHJva2VDb2xvcjpzLnN0cm9rZUNvbG9yLGZpbGxDb2xvcjpzLmZpbGxDb2xvcix3aWxsU3luY1NlcnZpY2U6ITEsaXNTeW5jOiEwfV19KSl9fWNsYXNzIHlmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5Db3B5Tm9kZX0pfWNvbnN1bWUoZSl7Y29uc3R7bXNnVHlwZTp0LGRhdGFUeXBlOnIsZW1pdEV2ZW50VHlwZTppLHVuZG9UaWNrZXJJZDpzfT1lO2lmKHQ9PT1tLkZ1bGxXb3JrJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgcjtjb25zdHt3b3JrSWQ6dH09ZTt0JiZhd2FpdCgocj10aGlzLmxvY2FsV29yayk9PW51bGw/dm9pZCAwOnIuY29uc3VtZUZ1bGwoZSx0aGlzLnNjZW5lKSl9fWNsYXNzIHdmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRDb2xvck5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgbDtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sdGV4dFVwZGF0ZUZvcldva2VyOmF9PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGw9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpsLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aX09ZSx7d2lsbFN5bmNTZXJ2aWNlOnMsaXNTeW5jOm4sdGV4dFVwZGF0ZUZvcldva2VyOmF9PXQsbD1yLnJlbmRlcnx8W10sYz1yLnNwfHxbXTtpZihzKWZvcihjb25zdFt1LGhdb2YgaS5lbnRyaWVzKCkpYSYmaC50b29sc1R5cGU9PT1TLlRleHQ/Yy5wdXNoKHsuLi5oLHdvcmtJZDp1LHR5cGU6bS5UZXh0VXBkYXRlLGRhdGFUeXBlOlcuTG9jYWwsd2lsbFN5bmNTZXJ2aWNlOiEwfSk6Yy5wdXNoKHsuLi5oLHdvcmtJZDp1LHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOm59KTtyZXR1cm57cmVuZGVyOmwsc3A6Y319fWNsYXNzIG1mIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5aSW5kZXhOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOml9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm59PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aX09ZSx7d2lsbFN5bmNTZXJ2aWNlOnMsaXNTeW5jOm59PXQsYT1yLnJlbmRlcnx8W10sbD1yLnNwfHxbXTtpZihzJiZsKWZvcihjb25zdFtjLHVdb2YgaS5lbnRyaWVzKCkpbC5wdXNoKHsuLi51LHdvcmtJZDpjLHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOm59KTtyZXR1cm57cmVuZGVyOmEsc3A6bH19fWNsYXNzIGdmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5UcmFuc2xhdGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGMsdTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sdGV4dFVwZGF0ZUZvcldva2VyOmEsZW1pdEV2ZW50VHlwZTpsfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJihyLndvcmtTdGF0ZT09PUYuRG9uZSYmKHIhPW51bGwmJnIudHJhbnNsYXRlKSYmKHIudHJhbnNsYXRlWzBdfHxyLnRyYW5zbGF0ZVsxXSl8fHIud29ya1N0YXRlIT09Ri5Eb25lP2F3YWl0KChjPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6Yy51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixpc1N5bmM6ITAsdGV4dFVwZGF0ZUZvcldva2VyOmEsZW1pdEV2ZW50VHlwZTpsLHNjZW5lOnRoaXMuc2NlbmUsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrfSkpOnIud29ya1N0YXRlPT09Ri5Eb25lJiYoKHU9dGhpcy5sb2NhbFdvcmspPT1udWxsfHx1LnZOb2Rlcy5kZWxldGVMYXN0VGFyZ2V0KCkpKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHVwZGF0ZVNlbGVjdG9yT3B0OmMsd2lsbFNlcmlhbGl6ZURhdGE6dSx0ZXh0VXBkYXRlRm9yV29rZXI6aH09dCxkPWMud29ya1N0YXRlLGY9ci5yZW5kZXJ8fFtdLHc9ci5zcHx8W107aWYoZD09PUYuU3RhcnQpcmV0dXJue3NwOltdLHJlbmRlcjpbXX07Y29uc3QgeT1uPT1udWxsP3ZvaWQgMDpuLnNlbGVjdFJlY3Q7aWYoYSl7aWYodSl7Y29uc3QgZz1zLmdldENoaWxkcmVuUG9pbnRzKCk7ZyYmdy5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxzZWxlY3RSZWN0Onksd2lsbFN5bmNTZXJ2aWNlOiExLGlzU3luYzpsLHBvaW50czpnfSl9Zm9yKGNvbnN0W2csUF1vZiBpLmVudHJpZXMoKSloJiZQLnRvb2xzVHlwZT09PVMuVGV4dD93LnB1c2goey4uLlAsd29ya0lkOmcsdHlwZTptLlRleHRVcGRhdGUsZGF0YVR5cGU6Vy5Mb2NhbCx3aWxsU3luY1NlcnZpY2U6ITB9KTp3LnB1c2goey4uLlAsd29ya0lkOmcsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pfXJldHVybntyZW5kZXI6ZixzcDp3fX19Y2xhc3MgYmYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLkRlbGV0ZU5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aX09ZTtpZih0PT09bS5SZW1vdmVOb2RlKXtpZihyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSksITA7aWYocj09PVcuU2VydmljZSYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yU2VydmljZVdvcmtlcihlKSwhMH19Y29uc3VtZUZvckxvY2FsV29ya2VyKGUpe2lmKCF0aGlzLmxvY2FsV29yaylyZXR1cm47Y29uc3R7cmVtb3ZlSWRzOnQsd2lsbFJlZnJlc2g6cix3aWxsU3luY1NlcnZpY2U6aSx2aWV3SWQ6c309ZTtpZighKHQhPW51bGwmJnQubGVuZ3RoKSlyZXR1cm47bGV0IG47Y29uc3QgYT1bXSxsPVtdLGM9W107Zm9yKGNvbnN0IHUgb2YgdCl7aWYodT09PUUuc2VsZWN0b3JJZCl7Y29uc3QgZD10aGlzLmxvY2FsV29yay53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpO2lmKCFkKXJldHVybjtjb25zdCBmPWQuc2VsZWN0SWRzJiZbLi4uZC5zZWxlY3RJZHNdfHxbXTtmb3IoY29uc3QgeSBvZiBmKXtpZih0aGlzLmxvY2FsV29yay52Tm9kZXMuZ2V0KHkpKXtjb25zdCBQPXRoaXMuY29tbWFuZERlbGV0ZVRleHQoeSk7UCYmYS5wdXNoKFApfW49TShuLHRoaXMubG9jYWxXb3JrLnJlbW92ZU5vZGUoeSkpLGMucHVzaCh5KX1jb25zdCB3PWQ9PW51bGw/dm9pZCAwOmQudXBkYXRlU2VsZWN0SWRzKFtdKTtuPU0obix3LmJnUmVjdCksdGhpcy5sb2NhbFdvcmsuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUoRS5zZWxlY3RvcklkKSx0aGlzLmxvY2FsV29yay53b3JrU2hhcGVzLmRlbGV0ZShFLnNlbGVjdG9ySWQpLGEucHVzaCh7dHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6W10sd2lsbFN5bmNTZXJ2aWNlOml9KTtjb250aW51ZX1jb25zdCBoPXRoaXMuY29tbWFuZERlbGV0ZVRleHQodSk7aCYmYS5wdXNoKGgpLG49TShuLHRoaXMubG9jYWxXb3JrLnJlbW92ZU5vZGUodSkpLGMucHVzaCh1KX1pJiZhLnB1c2goe3R5cGU6bS5SZW1vdmVOb2RlLHJlbW92ZUlkczpjLHVuZG9UaWNrZXJJZDplLnVuZG9UaWNrZXJJZH0pLG4mJnImJmwucHVzaCh7cmVjdDpuLGRyYXdDYW52YXM6Ti5CZyxjbGVhckNhbnZhczpOLkJnLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMCx2aWV3SWQ6c30pLChsLmxlbmd0aHx8YS5sZW5ndGgpJiZ0aGlzLmxvY2FsV29yay5fcG9zdCh7cmVuZGVyOmwsc3A6YX0pfWNvbnN1bWVGb3JTZXJ2aWNlV29ya2VyKGUpe3RoaXMuc2VydmljZVdvcmsmJnRoaXMuc2VydmljZVdvcmsucmVtb3ZlU2VsZWN0V29yayhlKX1jb21tYW5kRGVsZXRlVGV4dChlKXt2YXIgcjtjb25zdCB0PShyPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6ci52Tm9kZXMuZ2V0KGUpO2lmKHQmJnQudG9vbHNUeXBlPT09Uy5UZXh0KXJldHVybnt0eXBlOm0uVGV4dFVwZGF0ZSx0b29sc1R5cGU6Uy5UZXh0LHdvcmtJZDplLGRhdGFUeXBlOlcuTG9jYWx9fX1jbGFzcyB2ZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2NhbGVOb2RlfSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIG47Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxTeW5jU2VydmljZTppLHdpbGxTZXJpYWxpemVEYXRhOnN9PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKG49dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpuLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxTeW5jU2VydmljZTppLHdpbGxTZXJpYWxpemVEYXRhOnMsaXNTeW5jOiEwLHNjZW5lOnRoaXMuc2NlbmUsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrLmJpbmQodGhpcyl9KSl9dXBkYXRlU2VsZWN0b3JDYWxsYmFjayhlKXtjb25zdHtwYXJhbTp0LHBvc3REYXRhOnIsd29ya1NoYXBlTm9kZTppLHJlczpzLG5ld1NlcnZpY2VTdG9yZTpufT1lLHt1cGRhdGVTZWxlY3Rvck9wdDphLHdpbGxTeW5jU2VydmljZTpsLHdpbGxTZXJpYWxpemVEYXRhOmN9PXQsdT1hLndvcmtTdGF0ZSxoPXIucmVuZGVyfHxbXSxkPXIuc3B8fFtdLGY9cz09bnVsbD92b2lkIDA6cy5zZWxlY3RSZWN0LHc9cz09bnVsbD92b2lkIDA6cy5yZW5kZXJSZWN0O2lmKHU9PT1GLlN0YXJ0KXJldHVybntzcDpbXSxyZW5kZXI6W119O2lmKHRoaXMubG9jYWxXb3JrKXtoLnB1c2goe2lzQ2xlYXJBbGw6ITAsaXNGdWxsV29yazohMSxjbGVhckNhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLmxvY2FsV29yay52aWV3SWR9KTtjb25zdCB5PXtyZWN0OncsaXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMubG9jYWxXb3JrLnZpZXdJZH07aC5wdXNoKHkpfWlmKGwpe3U9PT1GLkRvaW5nJiZkLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOmkuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6Zix3aWxsU3luY1NlcnZpY2U6ITAsaXNTeW5jOiEwLHBvaW50czppLmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDppLnRleHRPcHR9KSxjJiZ1PT09Ri5Eb25lJiZkLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOmkuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6Zix3aWxsU3luY1NlcnZpY2U6ITEsaXNTeW5jOiEwLHBvaW50czppLmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDppLnRleHRPcHR9KTtmb3IoY29uc3RbeSxnXW9mIG4uZW50cmllcygpKWcudG9vbHNUeXBlPT09Uy5UZXh0P2QucHVzaCh7Li4uZyx3b3JrSWQ6eSx0eXBlOm0uVGV4dFVwZGF0ZSxkYXRhVHlwZTpXLkxvY2FsLHdpbGxTeW5jU2VydmljZTohMH0pOmQucHVzaCh7Li4uZyx3b3JrSWQ6eSx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzohMH0pfXJldHVybntyZW5kZXI6aCxzcDpkfX19Y2xhc3MgU2YgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlJvdGF0ZU5vZGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgbDtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sZW1pdEV2ZW50VHlwZTphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsd2lsbFNlcmlhbGl6ZURhdGE6bixlbWl0RXZlbnRUeXBlOmEsaXNTeW5jOiEwLHNjZW5lOnRoaXMuc2NlbmUsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrfSkpfXVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2soZSl7Y29uc3R7cGFyYW06dCxwb3N0RGF0YTpyLHdvcmtTaGFwZU5vZGU6aSxyZXM6cyxuZXdTZXJ2aWNlU3RvcmU6bn09ZSx7dXBkYXRlU2VsZWN0b3JPcHQ6YSx3aWxsU3luY1NlcnZpY2U6bCx3aWxsU2VyaWFsaXplRGF0YTpjLGlzU3luYzp1fT10LGg9YS53b3JrU3RhdGUsZD1yLnJlbmRlcnx8W10sZj1yLnNwfHxbXSx3PXM9PW51bGw/dm9pZCAwOnMuc2VsZWN0UmVjdDtpZihsKXtjJiZoPT09Ri5Eb25lJiZmLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOmkuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6dyx3aWxsU3luY1NlcnZpY2U6ITAsaXNTeW5jOnUscG9pbnRzOmkuZ2V0Q2hpbGRyZW5Qb2ludHMoKX0pO2Zvcihjb25zdFt5LGddb2Ygbi5lbnRyaWVzKCkpZi5wdXNoKHsuLi5nLHdvcmtJZDp5LHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOnV9KX1yZXR1cm57cmVuZGVyOmQsc3A6Zn19fWNsYXNzIGtmIGV4dGVuZHMgb2V7Y29uc3RydWN0b3IoKXtzdXBlciguLi5hcmd1bWVudHMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJlbWl0RXZlbnRUeXBlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Qi5TZXRGb250U3R5bGV9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgbDtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm4sdGV4dFVwZGF0ZUZvcldva2VyOmF9PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGw9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDpsLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHVwZGF0ZVNlbGVjdG9yT3B0OmMsdGV4dFVwZGF0ZUZvcldva2VyOnV9PXQsaD1yLnJlbmRlcnx8W10sZD1yLnNwfHxbXSxmPW49PW51bGw/dm9pZCAwOm4uc2VsZWN0UmVjdDtpZihhJiZkKXtjLmZvbnRTaXplJiZkLnB1c2goe3R5cGU6bS5TZWxlY3Qsc2VsZWN0SWRzOnMuc2VsZWN0SWRzLHNlbGVjdFJlY3Q6Zix3aWxsU3luY1NlcnZpY2U6YSxpc1N5bmM6bCxwb2ludHM6cy5nZXRDaGlsZHJlblBvaW50cygpfSk7Zm9yKGNvbnN0W3cseV1vZiBpLmVudHJpZXMoKSl1JiZ5LnRvb2xzVHlwZT09PVMuVGV4dD9kLnB1c2goey4uLnksd29ya0lkOncsdHlwZTptLlRleHRVcGRhdGUsZGF0YVR5cGU6Vy5Mb2NhbCx3aWxsU3luY1NlcnZpY2U6ITB9KTpkLnB1c2goey4uLnksd29ya0lkOncsdHlwZTptLlVwZGF0ZU5vZGUsdXBkYXRlTm9kZU9wdDp7dXNlQW5pbWF0aW9uOiExfSxpc1N5bmM6bH0pfXJldHVybntyZW5kZXI6aCxzcDpkfX19Y2xhc3MgUGYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNldFBvaW50fSl9Y29uc3VtZShlKXtjb25zdHttc2dUeXBlOnQsZGF0YVR5cGU6cixlbWl0RXZlbnRUeXBlOmksdW5kb1RpY2tlcklkOnN9PWU7aWYodD09PW0uVXBkYXRlTm9kZSYmcj09PVcuTG9jYWwmJmk9PT10aGlzLmVtaXRFdmVudFR5cGUpcmV0dXJuIHRoaXMuY29uc3VtZUZvckxvY2FsV29ya2VyKGUpLmZpbmFsbHkoKCk9PntzJiZzZXRUaW1lb3V0KCgpPT57dmFyIG47KG49dGhpcy5sb2NhbFdvcmspPT1udWxsfHxuLl9wb3N0KHtzcDpbe3R5cGU6bS5Ob25lLHVuZG9UaWNrZXJJZDpzfV19KX0sMCl9KSwhMH1hc3luYyBjb25zdW1lRm9yTG9jYWxXb3JrZXIoZSl7dmFyIGw7Y29uc3R7d29ya0lkOnQsdXBkYXRlTm9kZU9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLHRleHRVcGRhdGVGb3JXb2tlcjphfT1lO3Q9PT1FLnNlbGVjdG9ySWQmJnImJmF3YWl0KChsPXRoaXMubG9jYWxXb3JrKT09bnVsbD92b2lkIDA6bC51cGRhdGVTZWxlY3Rvcih7dXBkYXRlU2VsZWN0b3JPcHQ6cix3aWxsUmVmcmVzaFNlbGVjdG9yOmksd2lsbFN5bmNTZXJ2aWNlOnMsZW1pdEV2ZW50VHlwZTp0aGlzLmVtaXRFdmVudFR5cGUsd2lsbFNlcmlhbGl6ZURhdGE6bixpc1N5bmM6ITAsdGV4dFVwZGF0ZUZvcldva2VyOmEsY2FsbGJhY2s6dGhpcy51cGRhdGVTZWxlY3RvckNhbGxiYWNrfSkpfXVwZGF0ZVNlbGVjdG9yQ2FsbGJhY2soZSl7Y29uc3R7cGFyYW06dCxwb3N0RGF0YTpyLG5ld1NlcnZpY2VTdG9yZTppLHdvcmtTaGFwZU5vZGU6cyxyZXM6bn09ZSx7d2lsbFN5bmNTZXJ2aWNlOmEsaXNTeW5jOmx9PXQsYz1yLnJlbmRlcnx8W10sdT1yLnNwfHxbXSxoPW49PW51bGw/dm9pZCAwOm4uc2VsZWN0UmVjdDtpZihhJiZ1KXtmb3IoY29uc3RbZCxmXW9mIGkuZW50cmllcygpKXUucHVzaCh7Li4uZix3b3JrSWQ6ZCx0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpsfSk7dS5wdXNoKHt0eXBlOm0uU2VsZWN0LHNlbGVjdElkczpzLnNlbGVjdElkcyxzZWxlY3RSZWN0Omgsd2lsbFN5bmNTZXJ2aWNlOmEsaXNTeW5jOmwscG9pbnRzOnMuZ2V0Q2hpbGRyZW5Qb2ludHMoKX0pfXJldHVybntyZW5kZXI6YyxzcDp1fX19Y2xhc3MgVGYgZXh0ZW5kcyBvZXtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVtaXRFdmVudFR5cGUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpCLlNldExvY2t9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm59PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aSx3b3JrU2hhcGVOb2RlOnMscmVzOm59PWUse3dpbGxTeW5jU2VydmljZTphLGlzU3luYzpsLHVwZGF0ZVNlbGVjdG9yT3B0OmN9PXQsdT1yLnJlbmRlcnx8W10saD1yLnNwfHxbXSxkPW49PW51bGw/dm9pZCAwOm4uc2VsZWN0UmVjdDtpZihhJiZoKXtmb3IoY29uc3RbZix3XW9mIGkuZW50cmllcygpKWgucHVzaCh7Li4udyx3b3JrSWQ6Zix0eXBlOm0uVXBkYXRlTm9kZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9LGlzU3luYzpsfSk7aC5wdXNoKHtpc0xvY2tlZDpjLmlzTG9ja2VkLHNlbGVjdG9yQ29sb3I6cy5zZWxlY3RvckNvbG9yLHNjYWxlVHlwZTpzLnNjYWxlVHlwZSxjYW5Sb3RhdGU6cy5jYW5Sb3RhdGUsdHlwZTptLlNlbGVjdCxzZWxlY3RJZHM6cy5zZWxlY3RJZHMsc2VsZWN0UmVjdDpkLHdpbGxTeW5jU2VydmljZTphLGlzU3luYzpsfSl9cmV0dXJue3JlbmRlcjp1LHNwOmh9fX1jbGFzcyBJZiBleHRlbmRzIG9le2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZW1pdEV2ZW50VHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkIuU2V0U2hhcGVPcHR9KX1jb25zdW1lKGUpe2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLGVtaXRFdmVudFR5cGU6aSx1bmRvVGlja2VySWQ6c309ZTtpZih0PT09bS5VcGRhdGVOb2RlJiZyPT09Vy5Mb2NhbCYmaT09PXRoaXMuZW1pdEV2ZW50VHlwZSlyZXR1cm4gdGhpcy5jb25zdW1lRm9yTG9jYWxXb3JrZXIoZSkuZmluYWxseSgoKT0+e3MmJnNldFRpbWVvdXQoKCk9Pnt2YXIgbjsobj10aGlzLmxvY2FsV29yayk9PW51bGx8fG4uX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOnN9XX0pfSwwKX0pLCEwfWFzeW5jIGNvbnN1bWVGb3JMb2NhbFdvcmtlcihlKXt2YXIgYTtjb25zdHt3b3JrSWQ6dCx1cGRhdGVOb2RlT3B0OnIsd2lsbFJlZnJlc2hTZWxlY3RvcjppLHdpbGxTeW5jU2VydmljZTpzLHdpbGxTZXJpYWxpemVEYXRhOm59PWU7dD09PUUuc2VsZWN0b3JJZCYmciYmYXdhaXQoKGE9dGhpcy5sb2NhbFdvcmspPT1udWxsP3ZvaWQgMDphLnVwZGF0ZVNlbGVjdG9yKHt1cGRhdGVTZWxlY3Rvck9wdDpyLHdpbGxSZWZyZXNoU2VsZWN0b3I6aSx3aWxsU3luY1NlcnZpY2U6cyx3aWxsU2VyaWFsaXplRGF0YTpuLGNhbGxiYWNrOnRoaXMudXBkYXRlU2VsZWN0b3JDYWxsYmFja30pKX11cGRhdGVTZWxlY3RvckNhbGxiYWNrKGUpe2NvbnN0e3BhcmFtOnQscG9zdERhdGE6cixuZXdTZXJ2aWNlU3RvcmU6aX09ZSx7d2lsbFN5bmNTZXJ2aWNlOnMsaXNTeW5jOm59PXQsYT1yLnJlbmRlcnx8W10sbD1yLnNwfHxbXTtpZihzJiZsKWZvcihjb25zdFtjLHVdb2YgaS5lbnRyaWVzKCkpbC5wdXNoKHsuLi51LHdvcmtJZDpjLHR5cGU6bS5VcGRhdGVOb2RlLHVwZGF0ZU5vZGVPcHQ6e3VzZUFuaW1hdGlvbjohMX0saXNTeW5jOm59KTtyZXR1cm57cmVuZGVyOmEsc3A6bH19fWNsYXNzIHhme2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJidWlsZGVycyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSx0aGlzLmJ1aWxkZXJzPW5ldyBNYXAoZS5tYXAodD0+W3QsdGhpcy5idWlsZCh0KV0pKX1idWlsZChlKXtzd2l0Y2goZSl7Y2FzZSBCLlRyYW5zbGF0ZU5vZGU6cmV0dXJuIG5ldyBnZjtjYXNlIEIuWkluZGV4Tm9kZTpyZXR1cm4gbmV3IG1mO2Nhc2UgQi5aSW5kZXhBY3RpdmU6cmV0dXJuIG5ldyBwZjtjYXNlIEIuQ29weU5vZGU6cmV0dXJuIG5ldyB5ZjtjYXNlIEIuU2V0Q29sb3JOb2RlOnJldHVybiBuZXcgd2Y7Y2FzZSBCLkRlbGV0ZU5vZGU6cmV0dXJuIG5ldyBiZjtjYXNlIEIuU2NhbGVOb2RlOnJldHVybiBuZXcgdmY7Y2FzZSBCLlJvdGF0ZU5vZGU6cmV0dXJuIG5ldyBTZjtjYXNlIEIuU2V0Rm9udFN0eWxlOnJldHVybiBuZXcga2Y7Y2FzZSBCLlNldFBvaW50OnJldHVybiBuZXcgUGY7Y2FzZSBCLlNldExvY2s6cmV0dXJuIG5ldyBUZjtjYXNlIEIuU2V0U2hhcGVPcHQ6cmV0dXJuIG5ldyBJZn19cmVnaXN0ZXJGb3JXb3JrZXIoZSx0LHIpe3JldHVybiB0aGlzLmJ1aWxkZXJzLmZvckVhY2goaT0+e2kmJmkucmVnaXN0ZXJGb3JXb3JrZXIoZSx0LHIpfSksdGhpc31jb25zdW1lRm9yV29ya2VyKGUpe2Zvcihjb25zdCB0IG9mIHRoaXMuYnVpbGRlcnMudmFsdWVzKCkpaWYodCE9bnVsbCYmdC5jb25zdW1lKGUpKXJldHVybiEwO3JldHVybiExfX1jb25zdCBLZT0iY3Vyc29yaG92ZXIiO2NsYXNzIE9me2NvbnN0cnVjdG9yKGUsdCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZpZXdJZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2VuZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2VuZVBhdGgiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjdXJOb2RlTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0YXJnZXROb2RlTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6W119KSx0aGlzLnZpZXdJZD1lLHRoaXMuc2NlbmU9dH1pbml0KGUsdCl7dGhpcy5mdWxsTGF5ZXI9ZSx0aGlzLmRyYXdMYXllcj10fWdldChlKXtyZXR1cm4gdGhpcy5jdXJOb2RlTWFwLmdldChlKX1oYXNSZW5kZXJOb2Rlcygpe2xldCBlPSExO2Zvcihjb25zdCB0IG9mIHRoaXMuY3VyTm9kZU1hcC52YWx1ZXMoKSlPcih0LnRvb2xzVHlwZSkmJihlPSEwKTtyZXR1cm4gZX1oYXMoZSl7dGhpcy5jdXJOb2RlTWFwLmhhcyhlKX1zZXRJbmZvKGUsdCl7Y29uc3Qgcj10aGlzLmN1ck5vZGVNYXAuZ2V0KGUpfHx7bmFtZTplLHJlY3Q6dC5yZWN0fTt0LnJlY3QmJihyLnJlY3Q9cmUodC5yZWN0KSksdC5vcCYmKHIub3A9cmUodC5vcCkpLHQuY2FuUm90YXRlJiYoci5jYW5Sb3RhdGU9dC5jYW5Sb3RhdGUpLHQuc2NhbGVUeXBlJiYoci5zY2FsZVR5cGU9dC5zY2FsZVR5cGUpLHQub3B0JiYoci5vcHQ9cmUodC5vcHQpKSx0LnRvb2xzVHlwZSYmKHIudG9vbHNUeXBlPXQudG9vbHNUeXBlKSx0LmNlbnRlclBvcyYmKHIuY2VudGVyUG9zPXJlKHQuY2VudGVyUG9zKSksci5yZWN0P3RoaXMuY3VyTm9kZU1hcC5zZXQoZSxyKTp0aGlzLmN1ck5vZGVNYXAuZGVsZXRlKGUpfWRlbGV0ZShlKXt0aGlzLmN1ck5vZGVNYXAuZGVsZXRlKGUpfWNsZWFyKCl7dGhpcy5jdXJOb2RlTWFwLmNsZWFyKCksdGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aD0wfWhhc1JlY3RJbnRlcnNlY3RSYW5nZShlLHQ9ITApe2Zvcihjb25zdCByIG9mIHRoaXMuY3VyTm9kZU1hcC52YWx1ZXMoKSlpZihQZShlLHIucmVjdCkpe2lmKHQmJnIudG9vbHNUeXBlPT09Uy5JbWFnZSYmci5vcHQubG9ja2VkfHx0JiZyLnRvb2xzVHlwZT09PVMuVGV4dCYmKHIub3B0LndvcmtTdGF0ZT09PUYuRG9pbmd8fHIub3B0LndvcmtTdGF0ZT09PUYuU3RhcnQpKWNvbnRpbnVlO3JldHVybiEwfXJldHVybiExfWdldFJlY3RJbnRlcnNlY3RSYW5nZShlLHQ9ITApe2xldCByO2NvbnN0IGk9bmV3IE1hcDtmb3IoY29uc3RbcyxuXW9mIHRoaXMuY3VyTm9kZU1hcC5lbnRyaWVzKCkpaWYoUGUoZSxuLnJlY3QpKXtpZih0JiZuLnRvb2xzVHlwZT09PVMuSW1hZ2UmJm4ub3B0LmxvY2tlZHx8dCYmbi50b29sc1R5cGU9PT1TLlRleHQmJihuLm9wdC53b3JrU3RhdGU9PT1GLkRvaW5nfHxuLm9wdC53b3JrU3RhdGU9PT1GLlN0YXJ0KSljb250aW51ZTtyPU0ocixuLnJlY3QpLGkuc2V0KHMsbil9cmV0dXJue3JlY3RSYW5nZTpyLG5vZGVSYW5nZTppfX1nZXROb2RlUmVjdEZvcm1TaGFwZShlLHQpe2NvbnN0IHI9VnIodC50b29sc1R5cGUpO2xldCBpPXRoaXMuZnVsbExheWVyJiYocj09bnVsbD92b2lkIDA6ci5nZXRSZWN0RnJvbUxheWVyKHRoaXMuZnVsbExheWVyLGUpKTtyZXR1cm4haSYmdGhpcy5kcmF3TGF5ZXImJihpPXI9PW51bGw/dm9pZCAwOnIuZ2V0UmVjdEZyb21MYXllcih0aGlzLmRyYXdMYXllcixlKSksaX11cGRhdGVOb2Rlc1JlY3QoKXt0aGlzLmN1ck5vZGVNYXAuZm9yRWFjaCgoZSx0KT0+e2NvbnN0IHI9dGhpcy5nZXROb2RlUmVjdEZvcm1TaGFwZSh0LGUpO3I/KGUucmVjdD1yLHRoaXMuY3VyTm9kZU1hcC5zZXQodCxlKSk6dGhpcy5jdXJOb2RlTWFwLmRlbGV0ZSh0KX0pfWNvbWJpbmVJbnRlcnNlY3RSZWN0KGUpe2xldCB0PWU7cmV0dXJuIHRoaXMuY3VyTm9kZU1hcC5mb3JFYWNoKHI9PntQZSh0LHIucmVjdCkmJih0PU0odCxyLnJlY3QpKX0pLHR9c2V0VGFyZ2V0KCl7cmV0dXJuIHRoaXMudGFyZ2V0Tm9kZU1hcC5wdXNoKHJlKHRoaXMuY3VyTm9kZU1hcCkpLHRoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGgtMX1nZXRMYXN0VGFyZ2V0KCl7cmV0dXJuIHRoaXMudGFyZ2V0Tm9kZU1hcFt0aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoLTFdfWRlbGV0ZUxhc3RUYXJnZXQoKXt0aGlzLnRhcmdldE5vZGVNYXAubGVuZ3RoPXRoaXMudGFyZ2V0Tm9kZU1hcC5sZW5ndGgtMX1nZXRUYXJnZXQoZSl7cmV0dXJuIHRoaXMudGFyZ2V0Tm9kZU1hcFtlXX1kZWxldGVUYXJnZXQoZSl7dGhpcy50YXJnZXROb2RlTWFwLmxlbmd0aD1lfX1jbGFzcyB0b3tjb25zdHJ1Y3RvcihlLHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZOb2RlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcHIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywib3B0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNhbWVyYU9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzY2VuZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJpc1NhZmFyaSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOiExfSksdGhpcy52aWV3SWQ9ZSx0aGlzLm9wdD10LHRoaXMuZHByPXQuZHByLHRoaXMuc2NlbmU9dGhpcy5jcmVhdGVTY2VuZSh0Lm9mZnNjcmVlbkNhbnZhc09wdCksdGhpcy5mdWxsTGF5ZXI9dGhpcy5jcmVhdGVMYXllcigiZnVsbExheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6dGhpcy52aWV3SWQ9PT0ibWFpblZpZXciPzZlMzozZTN9KSx0aGlzLnZOb2Rlcz1uZXcgT2YoZSx0aGlzLnNjZW5lKX1zZXRJc1NhZmFyaShlKXt0aGlzLmlzU2FmYXJpPWV9b24oZSl7Y29uc3R7bXNnVHlwZTp0LHRvb2xzVHlwZTpyLG9wdDppLHdvcmtJZDpzLHdvcmtTdGF0ZTpuLGRhdGFUeXBlOmF9PWU7c3dpdGNoKHQpe2Nhc2UgbS5EZXN0cm95OnRoaXMuZGVzdHJveSgpO2JyZWFrO2Nhc2UgbS5DbGVhcjp0aGlzLmNsZWFyQWxsKCk7YnJlYWs7Y2FzZSBtLlVwZGF0ZVRvb2xzOmlmKHImJmkpe2NvbnN0IGw9e3Rvb2xzVHlwZTpyLHRvb2xzT3B0Oml9O3RoaXMubG9jYWxXb3JrLnNldFRvb2xzT3B0KGwpfWJyZWFrO2Nhc2UgbS5DcmVhdGVXb3JrOnMmJmkmJighdGhpcy5sb2NhbFdvcmsuZ2V0VG1wV29ya1NoYXBlTm9kZSgpJiZyJiZ0aGlzLnNldFRvb2xzT3B0KHt0b29sc1R5cGU6cix0b29sc09wdDppfSksdGhpcy5zZXRXb3JrT3B0KHt3b3JrSWQ6cyx0b29sc09wdDppfSkpO2JyZWFrO2Nhc2UgbS5EcmF3V29yazpuPT09Ri5Eb25lJiZhPT09Vy5Mb2NhbD90aGlzLmNvbnN1bWVEcmF3QWxsKGEsZSk6dGhpcy5jb25zdW1lRHJhdyhhLGUpO2JyZWFrfX11cGRhdGVTY2VuZShlKXt0aGlzLnNjZW5lLmF0dHIoey4uLmV9KTtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lO3RoaXMuc2NlbmUuY29udGFpbmVyLndpZHRoPXQsdGhpcy5zY2VuZS5jb250YWluZXIuaGVpZ2h0PXIsdGhpcy5zY2VuZS53aWR0aD10LHRoaXMuc2NlbmUuaGVpZ2h0PXIsdGhpcy51cGRhdGVMYXllcih7d2lkdGg6dCxoZWlnaHQ6cn0pfXVwZGF0ZUxheWVyKGUpe2NvbnN0e3dpZHRoOnQsaGVpZ2h0OnJ9PWU7dGhpcy5mdWxsTGF5ZXImJih0aGlzLmZ1bGxMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5mdWxsTGF5ZXIucGFyZW50LnNldEF0dHJpYnV0ZSgiaGVpZ2h0IixyKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInNpemUiLFt0LHJdKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKSx0aGlzLmRyYXdMYXllciYmKHRoaXMuZHJhd0xheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoIndpZHRoIix0KSx0aGlzLmRyYXdMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJoZWlnaHQiLHIpLHRoaXMuZHJhd0xheWVyLnNldEF0dHJpYnV0ZSgic2l6ZSIsW3Qscl0pLHRoaXMuZHJhd0xheWVyLnNldEF0dHJpYnV0ZSgicG9zIixbdCouNSxyKi41XSkpLHRoaXMuc25hcHNob3RGdWxsTGF5ZXImJih0aGlzLnNuYXBzaG90RnVsbExheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoIndpZHRoIix0KSx0aGlzLnNuYXBzaG90RnVsbExheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoImhlaWdodCIsciksdGhpcy5zbmFwc2hvdEZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInNpemUiLFt0LHJdKSx0aGlzLnNuYXBzaG90RnVsbExheWVyLnNldEF0dHJpYnV0ZSgicG9zIixbdCouNSxyKi41XSkpfWNyZWF0ZVNjZW5lKGUpe2NvbnN0e3dpZHRoOnQsaGVpZ2h0OnJ9PWUsaT1uZXcgT2Zmc2NyZWVuQ2FudmFzKHQscik7cmV0dXJuIG5ldyB6LlNjZW5lKHtjb250YWluZXI6aSxkaXNwbGF5UmF0aW86dGhpcy5kcHIsZGVwdGg6ITEsZGVzeW5jaHJvbml6ZWQ6ITAsLi4uZX0pfWNyZWF0ZUxheWVyKGUsdCxyKXtjb25zdHt3aWR0aDppLGhlaWdodDpzfT1yLG49YG9mZnNjcmVlbi0ke2V9YCxhPXQubGF5ZXIobixyKSxsPW5ldyB6Lkdyb3VwKHthbmNob3I6Wy41LC41XSxwb3M6W2kqLjUscyouNV0sc2l6ZTpbaSxzXSxuYW1lOiJ2aWV3cG9ydCIsaWQ6ZX0pO3JldHVybiBhLmFwcGVuZChsKSxsfWNsZWFyQWxsKCl7dmFyIGU7dGhpcy5mdWxsTGF5ZXImJih0aGlzLmZ1bGxMYXllci5wYXJlbnQuY2hpbGRyZW4uZm9yRWFjaCh0PT57dC5uYW1lIT09InZpZXdwb3J0IiYmdC5yZW1vdmUoKX0pLHRoaXMuZnVsbExheWVyLnJlbW92ZUFsbENoaWxkcmVuKCkpLHRoaXMuZHJhd0xheWVyJiYodGhpcy5kcmF3TGF5ZXIucGFyZW50LmNoaWxkcmVuLmZvckVhY2godD0+e3QubmFtZSE9PSJ2aWV3cG9ydCImJnQucmVtb3ZlKCl9KSx0aGlzLmRyYXdMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpKSx0aGlzLmxvY2FsV29yay5jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpLChlPXRoaXMuc2VydmljZVdvcmspPT1udWxsfHxlLmNsZWFyQWxsV29ya1NoYXBlc0NhY2hlKCl9c2V0VG9vbHNPcHQoZSl7dGhpcy5sb2NhbFdvcmsuc2V0VG9vbHNPcHQoZSl9c2V0V29ya09wdChlKXtjb25zdHt3b3JrSWQ6dCx0b29sc09wdDpyfT1lO3QmJnImJnRoaXMubG9jYWxXb3JrLnNldFdvcmtPcHRpb25zKHQscil9ZGVzdHJveSgpe3ZhciBlO3RoaXMudk5vZGVzLmNsZWFyKCksdGhpcy5zY2VuZS5yZW1vdmUoKSx0aGlzLmZ1bGxMYXllci5yZW1vdmUoKSx0aGlzLmxvY2FsV29yay5kZXN0cm95KCksKGU9dGhpcy5zZXJ2aWNlV29yayk9PW51bGx8fGUuZGVzdHJveSgpfX1jbGFzcyByb3tjb25zdHJ1Y3RvcihlKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidmlld0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInZOb2RlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0aHJlYWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJfcG9zdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ0bXBXb3JrU2hhcGVOb2RlIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInRtcE9wdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrU2hhcGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrU2hhcGVTdGF0ZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZWZmZWN0V29ya0lkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdDb3VudCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjB9KSx0aGlzLnRocmVhZD1lLnRocmVhZCx0aGlzLnZpZXdJZD1lLnZpZXdJZCx0aGlzLnZOb2Rlcz1lLnZOb2Rlcyx0aGlzLmZ1bGxMYXllcj1lLmZ1bGxMYXllcix0aGlzLmRyYXdMYXllcj1lLmRyYXdMYXllcix0aGlzLl9wb3N0PWUucG9zdH1kZXN0cm95KCl7dGhpcy53b3JrU2hhcGVTdGF0ZS5jbGVhcigpLHRoaXMud29ya1NoYXBlcy5jbGVhcigpfWdldFdvcmtTaGFwZShlKXtyZXR1cm4gdGhpcy53b3JrU2hhcGVzLmdldChlKX1nZXRUbXBXb3JrU2hhcGVOb2RlKCl7cmV0dXJuIHRoaXMudG1wV29ya1NoYXBlTm9kZX1zZXRUbXBXb3JrSWQoZSl7aWYoZSYmdGhpcy50bXBXb3JrU2hhcGVOb2RlKXt0aGlzLnRtcFdvcmtTaGFwZU5vZGUuc2V0V29ya0lkKGUpLHRoaXMud29ya1NoYXBlcy5zZXQoZSx0aGlzLnRtcFdvcmtTaGFwZU5vZGUpLHRoaXMudG1wT3B0JiZ0aGlzLnNldFRvb2xzT3B0KHRoaXMudG1wT3B0KTtyZXR1cm59fXNldFRtcFdvcmtPcHRpb25zKGUpe3ZhciB0Oyh0PXRoaXMudG1wV29ya1NoYXBlTm9kZSk9PW51bGx8fHQuc2V0V29ya09wdGlvbnMoZSl9c2V0V29ya09wdGlvbnMoZSx0KXt2YXIgaTt0aGlzLndvcmtTaGFwZXMuZ2V0KGUpfHx0aGlzLnNldFRtcFdvcmtJZChlKSwoaT10aGlzLndvcmtTaGFwZXMuZ2V0KGUpKT09bnVsbHx8aS5zZXRXb3JrT3B0aW9ucyh0KX1jcmVhdGVXb3JrU2hhcGVOb2RlKGUpe3ZhciBpO2NvbnN0e3Rvb2xzVHlwZTp0LHdvcmtJZDpyfT1lO3JldHVybiB0PT09Uy5TZWxlY3RvciYmcj09PUtlP2J0KHsuLi5lLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZnVsbExheWVyfSk6YnQoey4uLmUsdk5vZGVzOnRoaXMudk5vZGVzLGZ1bGxMYXllcjp0aGlzLmZ1bGxMYXllcixkcmF3TGF5ZXI6dGhpcy5kcmF3TGF5ZXJ9LChpPXRoaXMudGhyZWFkKT09bnVsbD92b2lkIDA6aS5zZXJ2aWNlV29yayl9c2V0VG9vbHNPcHQoZSl7dmFyIHQscjsoKHQ9dGhpcy50bXBPcHQpPT1udWxsP3ZvaWQgMDp0LnRvb2xzVHlwZSkhPT1lLnRvb2xzVHlwZSYmKHI9dGhpcy50bXBPcHQpIT1udWxsJiZyLnRvb2xzVHlwZSYmdGhpcy5jbGVhckFsbFdvcmtTaGFwZXNDYWNoZSgpLHRoaXMudG1wT3B0PWUsdGhpcy50bXBXb3JrU2hhcGVOb2RlPXRoaXMuY3JlYXRlV29ya1NoYXBlTm9kZShlKX1jbGVhcldvcmtTaGFwZU5vZGVDYWNoZShlKXt2YXIgdDsodD10aGlzLmdldFdvcmtTaGFwZShlKSk9PW51bGx8fHQuY2xlYXJUbXBQb2ludHMoKSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGUpLHRoaXMud29ya1NoYXBlU3RhdGUuZGVsZXRlKGUpfWNsZWFyQWxsV29ya1NoYXBlc0NhY2hlKCl7dGhpcy53b3JrU2hhcGVzLmZvckVhY2goZT0+ZS5jbGVhclRtcFBvaW50cygpKSx0aGlzLndvcmtTaGFwZXMuY2xlYXIoKSx0aGlzLndvcmtTaGFwZVN0YXRlLmNsZWFyKCl9c2V0RnVsbFdvcmsoZSl7Y29uc3R7d29ya0lkOnQsb3B0OnIsdG9vbHNUeXBlOml9PWU7aWYodCYmciYmaSl7Y29uc3Qgcz10JiZ0aGlzLndvcmtTaGFwZXMuZ2V0KHQpfHx0aGlzLmNyZWF0ZVdvcmtTaGFwZU5vZGUoe3Rvb2xzT3B0OnIsdG9vbHNUeXBlOmksd29ya0lkOnR9KTtyZXR1cm4gcz8ocy5zZXRXb3JrSWQodCksdGhpcy53b3JrU2hhcGVzLnNldCh0LHMpLHMpOnZvaWQgMH19fXZhciBMZj1pZSxDZj1mdW5jdGlvbigpe3JldHVybiBMZi5EYXRlLm5vdygpfSxOZj1DZixXZj0vXHMvO2Z1bmN0aW9uIFJmKG8pe2Zvcih2YXIgZT1vLmxlbmd0aDtlLS0mJldmLnRlc3Qoby5jaGFyQXQoZSkpOyk7cmV0dXJuIGV9dmFyIEFmPVJmLE1mPUFmLCRmPS9eXHMrLztmdW5jdGlvbiBEZihvKXtyZXR1cm4gbyYmby5zbGljZSgwLE1mKG8pKzEpLnJlcGxhY2UoJGYsIiIpfXZhciBqZj1EZixGZj1mZSxCZj1jZSxfZj0iW29iamVjdCBTeW1ib2xdIjtmdW5jdGlvbiBFZihvKXtyZXR1cm4gdHlwZW9mIG89PSJzeW1ib2wifHxCZihvKSYmRmYobyk9PV9mfXZhciB6Zj1FZixVZj1qZixvbz11ZSxHZj16Zixzbz1OYU4sWGY9L15bLStdMHhbMC05YS1mXSskL2ksSGY9L14wYlswMV0rJC9pLFlmPS9eMG9bMC03XSskL2kscWY9cGFyc2VJbnQ7ZnVuY3Rpb24gWmYobyl7aWYodHlwZW9mIG89PSJudW1iZXIiKXJldHVybiBvO2lmKEdmKG8pKXJldHVybiBzbztpZihvbyhvKSl7dmFyIGU9dHlwZW9mIG8udmFsdWVPZj09ImZ1bmN0aW9uIj9vLnZhbHVlT2YoKTpvO289b28oZSk/ZSsiIjplfWlmKHR5cGVvZiBvIT0ic3RyaW5nIilyZXR1cm4gbz09PTA/bzorbztvPVVmKG8pO3ZhciB0PUhmLnRlc3Qobyk7cmV0dXJuIHR8fFlmLnRlc3Qobyk/cWYoby5zbGljZSgyKSx0PzI6OCk6WGYudGVzdChvKT9zbzorb312YXIgUWY9WmYsSmY9dWUsdnQ9TmYsaW89UWYsS2Y9IkV4cGVjdGVkIGEgZnVuY3Rpb24iLFZmPU1hdGgubWF4LGVwPU1hdGgubWluO2Z1bmN0aW9uIHRwKG8sZSx0KXt2YXIgcixpLHMsbixhLGwsYz0wLHU9ITEsaD0hMSxkPSEwO2lmKHR5cGVvZiBvIT0iZnVuY3Rpb24iKXRocm93IG5ldyBUeXBlRXJyb3IoS2YpO2U9aW8oZSl8fDAsSmYodCkmJih1PSEhdC5sZWFkaW5nLGg9Im1heFdhaXQiaW4gdCxzPWg/VmYoaW8odC5tYXhXYWl0KXx8MCxlKTpzLGQ9InRyYWlsaW5nImluIHQ/ISF0LnRyYWlsaW5nOmQpO2Z1bmN0aW9uIGYodil7dmFyIEw9cixUPWk7cmV0dXJuIHI9aT12b2lkIDAsYz12LG49by5hcHBseShULEwpLG59ZnVuY3Rpb24gdyh2KXtyZXR1cm4gYz12LGE9c2V0VGltZW91dChQLGUpLHU/Zih2KTpufWZ1bmN0aW9uIHkodil7dmFyIEw9di1sLFQ9di1jLEE9ZS1MO3JldHVybiBoP2VwKEEscy1UKTpBfWZ1bmN0aW9uIGcodil7dmFyIEw9di1sLFQ9di1jO3JldHVybiBsPT09dm9pZCAwfHxMPj1lfHxMPDB8fGgmJlQ+PXN9ZnVuY3Rpb24gUCgpe3ZhciB2PXZ0KCk7aWYoZyh2KSlyZXR1cm4gayh2KTthPXNldFRpbWVvdXQoUCx5KHYpKX1mdW5jdGlvbiBrKHYpe3JldHVybiBhPXZvaWQgMCxkJiZyP2Yodik6KHI9aT12b2lkIDAsbil9ZnVuY3Rpb24gTygpe2EhPT12b2lkIDAmJmNsZWFyVGltZW91dChhKSxjPTAscj1sPWk9YT12b2lkIDB9ZnVuY3Rpb24gSSgpe3JldHVybiBhPT09dm9pZCAwP246ayh2dCgpKX1mdW5jdGlvbiBiKCl7dmFyIHY9dnQoKSxMPWcodik7aWYocj1hcmd1bWVudHMsaT10aGlzLGw9dixMKXtpZihhPT09dm9pZCAwKXJldHVybiB3KGwpO2lmKGgpcmV0dXJuIGNsZWFyVGltZW91dChhKSxhPXNldFRpbWVvdXQoUCxlKSxmKGwpfXJldHVybiBhPT09dm9pZCAwJiYoYT1zZXRUaW1lb3V0KFAsZSkpLG59cmV0dXJuIGIuY2FuY2VsPU8sYi5mbHVzaD1JLGJ9dmFyIHJwPXRwLG9wPXJwLHNwPXVlLGlwPSJFeHBlY3RlZCBhIGZ1bmN0aW9uIjtmdW5jdGlvbiBucChvLGUsdCl7dmFyIHI9ITAsaT0hMDtpZih0eXBlb2YgbyE9ImZ1bmN0aW9uIil0aHJvdyBuZXcgVHlwZUVycm9yKGlwKTtyZXR1cm4gc3AodCkmJihyPSJsZWFkaW5nImluIHQ/ISF0LmxlYWRpbmc6cixpPSJ0cmFpbGluZyJpbiB0PyEhdC50cmFpbGluZzppKSxvcChvLGUse2xlYWRpbmc6cixtYXhXYWl0OmUsdHJhaWxpbmc6aX0pfXZhciBhcD1ucCxscD1tZShhcCk7Y2xhc3MgY3AgZXh0ZW5kcyByb3tjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiY29tYmluZVVuaXRUaW1lIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6NjAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNvbWJpbmVUaW1lcklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImVmZmVjdFNlbGVjdE5vZGVEYXRhIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IFNldH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJiYXRjaEVyYXNlcldvcmtzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IFNldH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJiYXRjaEVyYXNlclJlbW92ZU5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IFNldH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJiYXRjaEVyYXNlckNvbWJpbmUiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpscCgoKT0+e2NvbnN0IHQ9dGhpcy51cGRhdGVCYXRjaEVyYXNlckNvbWJpbmVOb2RlKHRoaXMuYmF0Y2hFcmFzZXJXb3Jrcyx0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMpO3RoaXMuYmF0Y2hFcmFzZXJXb3Jrcy5jbGVhcigpLHRoaXMuYmF0Y2hFcmFzZXJSZW1vdmVOb2Rlcy5jbGVhcigpLHQubGVuZ3RoJiZ0aGlzLl9wb3N0KHtyZW5kZXI6dH0pfSwxMDAse2xlYWRpbmc6ITF9KX0pfWNvbnN1bWVEcmF3KGUsdCl7Y29uc3R7b3A6cix3b3JrSWQ6aX09ZTtpZihyIT1udWxsJiZyLmxlbmd0aCYmaSl7Y29uc3Qgcz10aGlzLndvcmtTaGFwZXMuZ2V0KGkpO2lmKCFzKXJldHVybjtjb25zdCBuPXMudG9vbHNUeXBlO2lmKG49PT1TLkxhc2VyUGVuKXJldHVybjtjb25zdCBhPXMuY29uc3VtZSh7ZGF0YTplLGlzRnVsbFdvcms6ITB9KTtzd2l0Y2gobil7Y2FzZSBTLlNlbGVjdG9yOmEudHlwZT09PW0uU2VsZWN0JiYoYS5zZWxlY3RJZHMmJnQucnVuUmV2ZXJzZVNlbGVjdFdvcmsoYS5zZWxlY3RJZHMpLHRoaXMuZHJhd1NlbGVjdG9yKGEsITApKTticmVhaztjYXNlIFMuRXJhc2VyOmEhPW51bGwmJmEucmVjdCYmdGhpcy5kcmF3RXJhc2VyKGEpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrO2Nhc2UgUy5QZW5jaWw6dGhpcy5jb21iaW5lVGltZXJJZHx8KHRoaXMuY29tYmluZVRpbWVySWQ9c2V0VGltZW91dCgoKT0+e3RoaXMuY29tYmluZVRpbWVySWQ9dm9pZCAwLHRoaXMuZHJhd1BlbmNpbENvbWJpbmUoaSl9LE1hdGguZmxvb3Iocy5nZXRXb3JrT3B0aW9ucygpLnN5bmNVbml0VGltZXx8dGhpcy5jb21iaW5lVW5pdFRpbWUvMikpKSxhJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrfX19Y29uc3VtZURyYXdBbGwoZSx0KXt2YXIgcyxuLGE7dGhpcy5jb21iaW5lVGltZXJJZCYmKGNsZWFyVGltZW91dCh0aGlzLmNvbWJpbmVUaW1lcklkKSx0aGlzLmNvbWJpbmVUaW1lcklkPXZvaWQgMCk7Y29uc3R7d29ya0lkOnIsdW5kb1RpY2tlcklkOml9PWU7aWYocil7aSYmc2V0VGltZW91dCgoKT0+e3RoaXMuX3Bvc3Qoe3NwOlt7dHlwZTptLk5vbmUsdW5kb1RpY2tlcklkOml9XX0pfSwwKTtjb25zdCBsPXRoaXMud29ya1NoYXBlcy5nZXQocik7aWYoIWwpcmV0dXJuO2NvbnN0IGM9bC50b29sc1R5cGU7aWYoYz09PVMuTGFzZXJQZW4pcmV0dXJuO2NvbnN0IHU9dGhpcy53b3JrU2hhcGVzLmdldChLZSksaD0ocz11PT1udWxsP3ZvaWQgMDp1LnNlbGVjdElkcyk9PW51bGw/dm9pZCAwOnNbMF0sZD1sLmNvbnN1bWVBbGwoe2RhdGE6ZSxob3ZlcklkOmh9KSxmPXRoaXMud29ya1NoYXBlU3RhdGUuZ2V0KHIpO3N3aXRjaChjKXtjYXNlIFMuU2VsZWN0b3I6ZC5zZWxlY3RJZHMmJmgmJigobj1kLnNlbGVjdElkcykhPW51bGwmJm4uaW5jbHVkZXMoaCkpJiZ1LmN1cnNvckJsdXIoKSxkLnNlbGVjdElkcyYmdC5ydW5SZXZlcnNlU2VsZWN0V29yayhkLnNlbGVjdElkcyksdGhpcy5kcmF3U2VsZWN0b3IoZCwhMSksKGE9bC5zZWxlY3RJZHMpIT1udWxsJiZhLmxlbmd0aD9sLmNsZWFyVG1wUG9pbnRzKCk6dGhpcy5jbGVhcldvcmtTaGFwZU5vZGVDYWNoZShyKTticmVhaztjYXNlIFMuRXJhc2VyOmQhPW51bGwmJmQucmVjdCYmdGhpcy5kcmF3RXJhc2VyKGQpLGwuY2xlYXJUbXBQb2ludHMoKTticmVhaztjYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5FbGxpcHNlOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246dGhpcy5kcmF3UGVuY2lsRnVsbChkLGwuZ2V0V29ya09wdGlvbnMoKSxmKSx0aGlzLmRyYXdDb3VudD0wLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUocik7YnJlYWs7Y2FzZSBTLlBlbmNpbDpkIT1udWxsJiZkLnJlY3QmJih0aGlzLmRyYXdQZW5jaWxGdWxsKGQsbC5nZXRXb3JrT3B0aW9ucygpLGYpLHRoaXMuZHJhd0NvdW50PTApLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUocik7YnJlYWt9fX1hc3luYyBjb25zdW1lRnVsbChlLHQpe3ZhciBuLGE7Y29uc3Qgcj10aGlzLnNldEZ1bGxXb3JrKGUpLGk9ZS5vcHMmJnFlKGUub3BzKSxzPShuPWUud29ya0lkKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpO2lmKHMmJnIpe2NvbnN0IGw9KGE9dGhpcy52Tm9kZXMuZ2V0KHMpKT09bnVsbD92b2lkIDA6YS5yZWN0O2xldCBjO3IudG9vbHNUeXBlPT09Uy5JbWFnZSYmdD9jPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7c2NlbmU6dCxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDpzfSk6Yz1yLmNvbnN1bWVTZXJ2aWNlKHtvcDppLGlzRnVsbFdvcms6ITAscmVwbGFjZUlkOnN9KTtjb25zdCB1PShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtjPU0oYyx1KTtjb25zdCBoPVtdLGQ9W107aWYoYyYmZS53aWxsUmVmcmVzaCYmKGwmJmgucHVzaCh7cmVjdDpjLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pLGgucHVzaCh7cmVjdDpjLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pKSxlLndpbGxTeW5jU2VydmljZSYmZC5wdXNoKHtvcHQ6ZS5vcHQsdG9vbHNUeXBlOmUudG9vbHNUeXBlLHR5cGU6bS5GdWxsV29yayx3b3JrSWQ6ZS53b3JrSWQsb3BzOmUub3BzLHVwZGF0ZU5vZGVPcHQ6ZS51cGRhdGVOb2RlT3B0LHVuZG9UaWNrZXJJZDplLnVuZG9UaWNrZXJJZCx2aWV3SWQ6dGhpcy52aWV3SWR9KSxoLmxlbmd0aHx8ZC5sZW5ndGgpe2NvbnN0IGY9e3JlbmRlcjpoLHNwOmR9O3RoaXMuX3Bvc3QoZil9ZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpfX1yZW1vdmVXb3JrKGUpe2NvbnN0e3dvcmtJZDp0fT1lLHI9dD09bnVsbD92b2lkIDA6dC50b1N0cmluZygpO2lmKHIpe2NvbnN0IGk9dGhpcy5yZW1vdmVOb2RlKHIpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfV19KX19cmVtb3ZlTm9kZShlKXt2YXIgaTt0aGlzLndvcmtTaGFwZXMuaGFzKGUpJiZ0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKGUpO2xldCB0O2NvbnN0IHI9dGhpcy52Tm9kZXMuZ2V0KGUpO3JldHVybiByJiYodGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUoZSkuY29uY2F0KCgoaT10aGlzLmRyYXdMYXllcik9PW51bGw/dm9pZCAwOmkuZ2V0RWxlbWVudHNCeU5hbWUoZSkpfHxbXSkuZm9yRWFjaChzPT57cy5yZW1vdmUoKX0pLHQ9TSh0LHIucmVjdCksdGhpcy52Tm9kZXMuZGVsZXRlKGUpKSx0fWFzeW5jIGNoZWNrVGV4dEFjdGl2ZShlKXtjb25zdHtvcDp0LHZpZXdJZDpyLGRhdGFUeXBlOml9PWU7aWYodCE9bnVsbCYmdC5sZW5ndGgpe2xldCBzO2Zvcihjb25zdCBuIG9mIHRoaXMudk5vZGVzLmN1ck5vZGVNYXAudmFsdWVzKCkpe2NvbnN0e3JlY3Q6YSxuYW1lOmwsdG9vbHNUeXBlOmMsb3B0OnV9PW4saD10WzBdKnRoaXMuZnVsbExheWVyLndvcmxkU2NhbGluZ1swXSt0aGlzLmZ1bGxMYXllci53b3JsZFBvc2l0aW9uWzBdLGQ9dFsxXSp0aGlzLmZ1bGxMYXllci53b3JsZFNjYWxpbmdbMV0rdGhpcy5mdWxsTGF5ZXIud29ybGRQb3NpdGlvblsxXTtpZihjPT09Uy5UZXh0JiZHaChbaCxkXSxhKSYmdS53b3JrU3RhdGU9PT1GLkRvbmUpe3M9bDticmVha319cyYmKGF3YWl0IHRoaXMuYmx1clNlbGVjdG9yKHt2aWV3SWQ6cixtc2dUeXBlOm0uU2VsZWN0LGRhdGFUeXBlOmksaXNTeW5jOiEwfSksYXdhaXQgdGhpcy5fcG9zdCh7c3A6W3t0eXBlOm0uR2V0VGV4dEFjdGl2ZSx0b29sc1R5cGU6Uy5UZXh0LHdvcmtJZDpzfV19KSl9fWFzeW5jIGNvbGxvY3RFZmZlY3RTZWxlY3RXb3JrKGUpe2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHt3b3JrSWQ6cixtc2dUeXBlOml9PWU7aWYodCYmciYmdC5zZWxlY3RJZHMmJnQuc2VsZWN0SWRzLmluY2x1ZGVzKHIudG9TdHJpbmcoKSkpe2k9PT1tLlJlbW92ZU5vZGU/dC5zZWxlY3RJZHM9dC5zZWxlY3RJZHMuZmlsdGVyKHM9PnMhPT1yLnRvU3RyaW5nKCkpOnRoaXMuZWZmZWN0U2VsZWN0Tm9kZURhdGEuYWRkKGUpLGF3YWl0IG5ldyBQcm9taXNlKHM9PntzZXRUaW1lb3V0KCgpPT57cyghMCl9LDApfSksYXdhaXQgdGhpcy5ydW5FZmZlY3RTZWxlY3RXb3JrKCEwKS50aGVuKCgpPT57dmFyIHM7KHM9dGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YSk9PW51bGx8fHMuY2xlYXIoKX0pO3JldHVybn1yZXR1cm4gZX1hc3luYyB1cGRhdGVTZWxlY3RvcihlKXt2YXIgUDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZighKChQPXQ9PW51bGw/dm9pZCAwOnQuc2VsZWN0SWRzKSE9bnVsbCYmUC5sZW5ndGgpKXJldHVybjtjb25zdHtjYWxsYmFjazpyLC4uLml9PWUse3VwZGF0ZVNlbGVjdG9yT3B0OnMsd2lsbFJlZnJlc2hTZWxlY3RvcjpuLHdpbGxTZXJpYWxpemVEYXRhOmEsZW1pdEV2ZW50VHlwZTpsLHNjZW5lOmN9PWksdT1zLndvcmtTdGF0ZSxoPWF3YWl0KHQ9PW51bGw/dm9pZCAwOnQudXBkYXRlU2VsZWN0b3Ioe3VwZGF0ZVNlbGVjdG9yT3B0OnMsc2VsZWN0SWRzOnQuc2VsZWN0SWRzLHZOb2Rlczp0aGlzLnZOb2Rlcyx3aWxsU2VyaWFsaXplRGF0YTphLHdvcmtlcjp0aGlzLHNjZW5lOmN9KSksZD1oPT1udWxsP3ZvaWQgMDpoLnNlbGVjdFJlY3QsZj1uZXcgTWFwO3Quc2VsZWN0SWRzLmZvckVhY2goaz0+e2NvbnN0IE89dGhpcy52Tm9kZXMuZ2V0KGspO2lmKE8pe2NvbnN0e3Rvb2xzVHlwZTpJLG9wOmIsb3B0OnZ9PU87Zi5zZXQoayx7b3B0OnYsdG9vbHNUeXBlOkksb3BzOihiPT1udWxsP3ZvaWQgMDpiLmxlbmd0aCkmJmxlKGIpfHx2b2lkIDB9KX19KTtjb25zdCB3PVtdLHk9W107aWYobil7dy5wdXNoKHtpc0NsZWFyQWxsOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcix2aWV3SWQ6dGhpcy52aWV3SWR9KTtjb25zdCBrPXtyZWN0OmQsaXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfTtzLnRyYW5zbGF0ZSYmbD09PUIuVHJhbnNsYXRlTm9kZSYmdT09PUYuRG9pbmcmJihrLnRyYW5zbGF0ZT1zLnRyYW5zbGF0ZSksdy5wdXNoKGspfWNvbnN0IGc9ciYmcih7cmVzOmgsd29ya1NoYXBlTm9kZTp0LHBhcmFtOmkscG9zdERhdGE6e3JlbmRlcjp3LHNwOnl9LG5ld1NlcnZpY2VTdG9yZTpmfSl8fHtyZW5kZXI6dyxzcDp5fTsoZy5yZW5kZXIubGVuZ3RofHxnLnNwLmxlbmd0aCkmJnRoaXMuX3Bvc3QoZyl9YXN5bmMgYmx1clNlbGVjdG9yKGUpe3ZhciBpO2NvbnN0IHQ9dGhpcy53b3JrU2hhcGVzLmdldChFLnNlbGVjdG9ySWQpLHI9dD09bnVsbD92b2lkIDA6dC5ibHVyU2VsZWN0b3IoKTtpZih0aGlzLmNsZWFyV29ya1NoYXBlTm9kZUNhY2hlKEUuc2VsZWN0b3JJZCksKChpPXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6aS5wYXJlbnQpLmNoaWxkcmVuLmZvckVhY2gocz0+e3MubmFtZT09PUUuc2VsZWN0b3JJZCYmcy5yZW1vdmUoKX0pLHIpe2NvbnN0IHM9W107cy5wdXNoKHsuLi5yLHVuZG9UaWNrZXJJZDplPT1udWxsP3ZvaWQgMDplLnVuZG9UaWNrZXJJZCxpc1N5bmM6ZT09bnVsbD92b2lkIDA6ZS5pc1N5bmN9KSxhd2FpdCB0aGlzLl9wb3N0KHtyZW5kZXI6KHI9PW51bGw/dm9pZCAwOnIucmVjdCkmJlt7cmVjdDpyLnJlY3QsZHJhd0NhbnZhczpOLkJnLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnN9KX19cmVSZW5kZXJTZWxlY3RvcihlPSExKXt2YXIgcjtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKTtpZih0KXtpZih0JiYhKChyPXQuc2VsZWN0SWRzKSE9bnVsbCYmci5sZW5ndGgpKXJldHVybiB0aGlzLmJsdXJTZWxlY3RvcigpO2lmKHRoaXMuZHJhd0xheWVyKXtjb25zdCBpPXQucmVSZW5kZXJTZWxlY3RvcigpO2kmJnRoaXMuX3Bvc3Qoe3JlbmRlcjpbe3JlY3Q6aSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITEsY2xlYXJDYW52YXM6Ti5TZWxlY3RvcixkcmF3Q2FudmFzOk4uU2VsZWN0b3Isdmlld0lkOnRoaXMudmlld0lkfV0sc3A6W3t0eXBlOm0uU2VsZWN0LHNlbGVjdElkczp0LnNlbGVjdElkcyxzZWxlY3RSZWN0Omksd2lsbFN5bmNTZXJ2aWNlOmUsdmlld0lkOnRoaXMudmlld0lkLHBvaW50czp0LmdldENoaWxkcmVuUG9pbnRzKCksdGV4dE9wdDp0LnRleHRPcHR9XX0pfX19dXBkYXRlRnVsbFNlbGVjdFdvcmsoZSl7dmFyIGkscyxuLGEsbCxjLHUsaDtjb25zdCB0PXRoaXMud29ya1NoYXBlcy5nZXQoRS5zZWxlY3RvcklkKSx7c2VsZWN0SWRzOnJ9PWU7aWYoIShyIT1udWxsJiZyLmxlbmd0aCkpe3RoaXMuYmx1clNlbGVjdG9yKGUpO3JldHVybn1pZighdCl7IXRoaXMuc2V0RnVsbFdvcmsoZSkmJmUud29ya0lkJiYoKGk9dGhpcy50bXBXb3JrU2hhcGVOb2RlKT09bnVsbD92b2lkIDA6aS50b29sc1R5cGUpPT09Uy5TZWxlY3RvciYmdGhpcy5zZXRUbXBXb3JrSWQoZS53b3JrSWQpLHRoaXMudXBkYXRlRnVsbFNlbGVjdFdvcmsoZSk7cmV0dXJufWlmKHQmJihyIT1udWxsJiZyLmxlbmd0aCkpe2NvbnN0e2JnUmVjdDpkLHNlbGVjdFJlY3Q6Zn09dC51cGRhdGVTZWxlY3RJZHMociksdz17cmVuZGVyOltdLHNwOltdfTtkJiYoKHM9dy5yZW5kZXIpPT1udWxsfHxzLnB1c2goe3JlY3Q6SyhkKSxpc0NsZWFyOiEwLGlzRnVsbFdvcms6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSkpLChuPXcucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmYsaXNDbGVhcjohMCxpc0Z1bGxXb3JrOiExLGNsZWFyQ2FudmFzOk4uU2VsZWN0b3IsZHJhd0NhbnZhczpOLlNlbGVjdG9yLHZpZXdJZDp0aGlzLnZpZXdJZH0pLChoPXcuc3ApPT1udWxsfHxoLnB1c2goey4uLmUsc2VsZWN0b3JDb2xvcjooKGE9ZS5vcHQpPT1udWxsP3ZvaWQgMDphLnN0cm9rZUNvbG9yKXx8dC5zZWxlY3RvckNvbG9yLHN0cm9rZUNvbG9yOigobD1lLm9wdCk9PW51bGw/dm9pZCAwOmwuc3Ryb2tlQ29sb3IpfHx0LnN0cm9rZUNvbG9yLGZpbGxDb2xvcjooKGM9ZS5vcHQpPT1udWxsP3ZvaWQgMDpjLmZpbGxDb2xvcil8fHQuZmlsbENvbG9yLHRleHRPcHQ6KCh1PWUub3B0KT09bnVsbD92b2lkIDA6dS50ZXh0T3B0KXx8dC50ZXh0T3B0LGNhblRleHRFZGl0OnQuY2FuVGV4dEVkaXQsY2FuUm90YXRlOnQuY2FuUm90YXRlLHNjYWxlVHlwZTp0LnNjYWxlVHlwZSx0eXBlOm0uU2VsZWN0LHNlbGVjdFJlY3Q6Zixwb2ludHM6dC5nZXRDaGlsZHJlblBvaW50cygpLHdpbGxTeW5jU2VydmljZTooZT09bnVsbD92b2lkIDA6ZS53aWxsU3luY1NlcnZpY2UpfHwhMSxvcHQ6KGU9PW51bGw/dm9pZCAwOmUud2lsbFN5bmNTZXJ2aWNlKSYmdC5nZXRXb3JrT3B0aW9ucygpfHx2b2lkIDAsY2FuTG9jazp0LmNhbkxvY2ssaXNMb2NrZWQ6dC5pc0xvY2tlZCx0b29sc1R5cGVzOnQudG9vbHNUeXBlcyxzaGFwZU9wdDp0LnNoYXBlT3B0fSksdGhpcy5fcG9zdCh3KX19ZGVzdHJveSgpe3N1cGVyLmRlc3Ryb3koKSx0aGlzLmVmZmVjdFNlbGVjdE5vZGVEYXRhLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlcldvcmtzLmNsZWFyKCksdGhpcy5iYXRjaEVyYXNlclJlbW92ZU5vZGVzLmNsZWFyKCl9ZHJhd1BlbmNpbENvbWJpbmUoZSl7dmFyIHIsaTtjb25zdCB0PShyPXRoaXMud29ya1NoYXBlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpyLmNvbWJpbmVDb25zdW1lKCk7aWYodCl7Y29uc3Qgcz17cmVuZGVyOltdLGRyYXdDb3VudDp0aGlzLmRyYXdDb3VudH07KGk9cy5yZW5kZXIpPT1udWxsfHxpLnB1c2goe3JlY3Q6KHQ9PW51bGw/dm9pZCAwOnQucmVjdCkmJksodC5yZWN0KSxpc0NsZWFyOiEwLGRyYXdDYW52YXM6Ti5GbG9hdCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSksdGhpcy5fcG9zdChzKX19ZHJhd1NlbGVjdG9yKGUsdCl7dmFyIGkscztjb25zdCByPXtyZW5kZXI6W10sc3A6W2VdfTtlLnR5cGU9PT1tLlNlbGVjdCYmIXQmJigoaT1yLnJlbmRlcik9PW51bGx8fGkucHVzaCh7cmVjdDplLnNlbGVjdFJlY3QsZHJhd0NhbnZhczpOLlNlbGVjdG9yLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZWxlY3Rvcixpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0se3JlY3Q6ZS5yZWN0JiZLKGUucmVjdCksaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHQmJigocz1yLnJlbmRlcik9PW51bGx8fHMucHVzaCh7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uRmxvYXQsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7cmVjdDplLnJlY3QmJksoZS5yZWN0KSxkcmF3Q2FudmFzOk4uQmcsaXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSkpLHRoaXMuX3Bvc3Qocil9YXN5bmMgZHJhd0VyYXNlcihlKXt2YXIgcixpO2NvbnN0IHQ9W107aWYoKHI9ZS5uZXdXb3JrRGF0YXMpIT1udWxsJiZyLnNpemUpe2Zvcihjb25zdCBzIG9mIGUubmV3V29ya0RhdGFzLnZhbHVlcygpKXtjb25zdCBuPXMud29ya0lkLnRvU3RyaW5nKCk7dGhpcy5iYXRjaEVyYXNlcldvcmtzLmFkZChuKSx0LnB1c2goe3R5cGU6bS5GdWxsV29yayx3b3JrSWQ6bixvcHM6bGUocy5vcCksb3B0OnMub3B0LHRvb2xzVHlwZTpzLnRvb2xzVHlwZSx1cGRhdGVOb2RlT3B0Ont1c2VBbmltYXRpb246ITF9fSl9ZGVsZXRlIGUubmV3V29ya0RhdGFzfShpPWUucmVtb3ZlSWRzKT09bnVsbHx8aS5mb3JFYWNoKHM9Pnt0aGlzLmJhdGNoRXJhc2VyUmVtb3ZlTm9kZXMuYWRkKHMpfSksdC5wdXNoKGUpLHRoaXMuX3Bvc3Qoe3NwOnR9KSx0aGlzLmJhdGNoRXJhc2VyQ29tYmluZSgpfWRyYXdQZW5jaWwoZSl7dGhpcy5fcG9zdCh7ZHJhd0NvdW50OnRoaXMuZHJhd0NvdW50LHNwOihlPT1udWxsP3ZvaWQgMDplLm9wKSYmW2VdfSl9ZHJhd1BlbmNpbEZ1bGwoZSx0LHIpe3ZhciBuO2xldCBpPShyPT1udWxsP3ZvaWQgMDpyLndpbGxDbGVhcil8fCh0PT1udWxsP3ZvaWQgMDp0LmlzT3BhY2l0eSl8fCExOyFpJiZlLnJlY3QmJihpPXRoaXMudk5vZGVzLmhhc1JlY3RJbnRlcnNlY3RSYW5nZShlLnJlY3QpKTtjb25zdCBzPXtkcmF3Q291bnQ6MS8wLHJlbmRlcjpbe3JlY3Q6ZS5yZWN0LGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOmksY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOltlXX07KG49cy5yZW5kZXIpPT1udWxsfHxuLnB1c2goe2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMuX3Bvc3Qocyl9dXBkYXRlQmF0Y2hFcmFzZXJDb21iaW5lTm9kZShlLHQpe2NvbnN0IHI9W107bGV0IGk7Zm9yKGNvbnN0IHMgb2YgdC5rZXlzKCkpdGhpcy5mdWxsTGF5ZXIuZ2V0RWxlbWVudHNCeU5hbWUocykuZm9yRWFjaChuPT57Y29uc3QgYT1uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2k9TShpLHt4OmEueC1uZS5TYWZlQm9yZGVyUGFkZGluZyx5OmEueS1uZS5TYWZlQm9yZGVyUGFkZGluZyx3OmEud2lkdGgrbmUuU2FmZUJvcmRlclBhZGRpbmcqMixoOmEuaGVpZ2h0K25lLlNhZmVCb3JkZXJQYWRkaW5nKjJ9KSxuLnJlbW92ZSgpfSk7cmV0dXJuIGUuZm9yRWFjaChzPT57Y29uc3Qgbj10aGlzLnZOb2Rlcy5nZXQocyk7aWYobilpZih0aGlzLmZ1bGxMYXllci5nZXRFbGVtZW50c0J5TmFtZShzKVswXSlpPU0oaSxuLnJlY3QpO2Vsc2V7Y29uc3QgbD10aGlzLnNldEZ1bGxXb3JrKHsuLi5uLHdvcmtJZDpzfSksYz1sJiZsLmNvbnN1bWVTZXJ2aWNlKHtvcDpuLm9wLGlzRnVsbFdvcms6ITB9KTtjJiYobi5yZWN0PWMsaT1NKGksYykpfX0pLGkmJnIucHVzaCh7cmVjdDppLGlzQ2xlYXI6ITAsaXNGdWxsV29yazohMCxjbGVhckNhbnZhczpOLkJnLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSxyfWFzeW5jIHJ1bkVmZmVjdFNlbGVjdFdvcmsoZSl7dmFyIHQscixpLHM7Zm9yKGNvbnN0IG4gb2YgdGhpcy5lZmZlY3RTZWxlY3ROb2RlRGF0YS52YWx1ZXMoKSl7Y29uc3QgYT10aGlzLnNldEZ1bGxXb3JrKG4pO2lmKGEpe2lmKGEudG9vbHNUeXBlPT09Uy5JbWFnZSlhd2FpdCBhLmNvbnN1bWVTZXJ2aWNlQXN5bmMoe3NjZW5lOihyPSh0PXRoaXMuZHJhd0xheWVyKT09bnVsbD92b2lkIDA6dC5wYXJlbnQpPT1udWxsP3ZvaWQgMDpyLnBhcmVudCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaT1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6aS50b1N0cmluZygpfSk7ZWxzZXtjb25zdCBsPW4ub3BzJiZxZShuLm9wcyk7YS5jb25zdW1lU2VydmljZSh7b3A6bCxpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDoocz1hLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6cy50b1N0cmluZygpfSl9biE9bnVsbCYmbi51cGRhdGVOb2RlT3B0JiZhLnVwZGF0YU9wdFNlcnZpY2Uobi51cGRhdGVOb2RlT3B0KSxuLndvcmtJZCYmdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShuLndvcmtJZCl9fXRoaXMucmVSZW5kZXJTZWxlY3RvcihlKX1jdXJzb3JIb3ZlcihlKXt2YXIgbjtjb25zdHtvcHQ6dCx0b29sc1R5cGU6cixwb2ludDppfT1lLHM9dGhpcy5zZXRGdWxsV29yayh7d29ya0lkOktlLHRvb2xzVHlwZTpyLG9wdDp0fSk7aWYocyYmaSl7Y29uc3QgYT1zLmN1cnNvckhvdmVyKGkpLGw9e3JlbmRlcjpbXX07YSYmYS50eXBlPT09bS5DdXJzb3JIb3ZlciYmKChuPWwucmVuZGVyKT09bnVsbHx8bi5wdXNoKHtyZWN0OmEucmVjdCYmSyhhLnJlY3QpLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyxkcmF3Q2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLl9wb3N0KGwpKX19fWNsYXNzIHVwe2NvbnN0cnVjdG9yKGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ2aWV3SWQiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidk5vZGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJkcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywid29ya1NoYXBlcyIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOm5ldyBNYXB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywic2VsZWN0b3JXb3JrU2hhcGVzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJhbmltYXRpb25JZCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpuZXcgU2V0fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInJ1bkVmZmVjdElkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm5vQW5pbWF0aW9uUmVjdCIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJwb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy52aWV3SWQ9ZS52aWV3SWQsdGhpcy52Tm9kZXM9ZS52Tm9kZXMsdGhpcy5mdWxsTGF5ZXI9ZS5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXI9ZS5zZXJ2aWNlRHJhd0xheWVyLHRoaXMucG9zdD1lLnBvc3R9ZGVzdHJveSgpe3RoaXMud29ya1NoYXBlcy5jbGVhcigpLHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmNsZWFyKCksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuY2xlYXIoKX1jb25zdW1lRHJhdyhlKXt0aGlzLmFjdGl2ZVdvcmtTaGFwZShlKSx0aGlzLnJ1bkFuaW1hdGlvbigpfWNvbnN1bWVGdWxsKGUpe3RoaXMuYWN0aXZlV29ya1NoYXBlKGUpLHRoaXMucnVuQW5pbWF0aW9uKCl9Y2xlYXJBbGxXb3JrU2hhcGVzQ2FjaGUoKXt0aGlzLndvcmtTaGFwZXMuZm9yRWFjaCgoZSx0KT0+e2UudG9vbHNUeXBlPT09Uy5MYXNlclBlbj9zZXRUaW1lb3V0KCgpPT57dGhpcy53b3JrU2hhcGVzLmRlbGV0ZSh0KX0sMmUzKTp0aGlzLndvcmtTaGFwZXMuZGVsZXRlKHQpfSl9cnVuU2VsZWN0V29yayhlKXt0aGlzLmFjdGl2ZVNlbGVjdG9yU2hhcGUoZSk7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKHIpLHRoaXMucnVuRWZmZWN0KCl9c2V0Tm9kZUtleShlLHQscil7cmV0dXJuIGUudG9vbHNUeXBlPXQsZS5ub2RlPWJ0KHt0b29sc1R5cGU6dCx0b29sc09wdDpyLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfSx0aGlzKSxlfXJ1blJldmVyc2VTZWxlY3RXb3JrKGUpe2UuZm9yRWFjaCh0PT57dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZm9yRWFjaCgocixpKT0+e3ZhciBzO2lmKChzPXIuc2VsZWN0SWRzKSE9bnVsbCYmcy5sZW5ndGgpe2NvbnN0IG49ci5zZWxlY3RJZHMuaW5kZXhPZih0KTtuPi0xJiYoci5zZWxlY3RJZHMuc3BsaWNlKG4sMSksdGhpcy53aWxsUnVuRWZmZWN0U2VsZWN0b3JJZHMuYWRkKGkpKX19KX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLnNpemUmJnRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlV29yayhlKXtjb25zdHt3b3JrSWQ6dH09ZSxyPXQ9PW51bGw/dm9pZCAwOnQudG9TdHJpbmcoKTtpZihyKXtjb25zdCBpPXRoaXMud29ya1NoYXBlcy5nZXQocik7aWYoaSl7dGhpcy53b3JrU2hhcGVzLmRlbGV0ZShyKSx0aGlzLnJlbW92ZU5vZGUocixlLGk9PW51bGw/dm9pZCAwOmkudG90YWxSZWN0LCExKTtyZXR1cm59dGhpcy5yZW1vdmVOb2RlKHIsZSl9fXJlbW92ZVNlbGVjdFdvcmsoZSl7Y29uc3R7d29ya0lkOnR9PWUscj10PT1udWxsP3ZvaWQgMDp0LnRvU3RyaW5nKCk7ciYmKHRoaXMuYWN0aXZlU2VsZWN0b3JTaGFwZShlKSx0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQocikpLHRoaXMucnVuRWZmZWN0KCl9cmVtb3ZlTm9kZShlLHQscixpPSEwKXt2YXIgYztjb25zdCBzPXRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGUpLmNvbmNhdCh0aGlzLmRyYXdMYXllci5nZXRFbGVtZW50c0J5TmFtZShlKSk7ZS5pbmRleE9mKEUuc2VsZWN0b3JJZCk+LTEmJnRoaXMucmVtb3ZlU2VsZWN0V29yayh0KTtjb25zdCBuPVtdO2xldCBhPXI7Y29uc3QgbD0oYz10aGlzLnZOb2Rlcy5nZXQoZSkpPT1udWxsP3ZvaWQgMDpjLnJlY3Q7bCYmKGE9TShsLGEpKSxzLmZvckVhY2godT0+e24ucHVzaCh1KX0pLG4ubGVuZ3RoJiZuLmZvckVhY2godT0+dS5yZW1vdmUoKSksYSYmKHRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGEpLGlzQ2xlYXI6ITAsaXNGdWxsV29yazppLGNsZWFyQ2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCxkcmF3Q2FudmFzOmk/Ti5CZzpOLlNlcnZpY2VGbG9hdCx3b3JrZXJUeXBlOmk/dm9pZCAwOlcuU2VydmljZSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMudk5vZGVzLmRlbGV0ZShlKSl9YWN0aXZlV29ya1NoYXBlKGUpe3ZhciBkLGYsdyx5O2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsb3A6bCx1c2VBbmltYXRpb246Y309ZTtpZighdClyZXR1cm47Y29uc3QgdT10LnRvU3RyaW5nKCk7aWYoISgoZD10aGlzLndvcmtTaGFwZXMpIT1udWxsJiZkLmhhcyh1KSkpe2xldCBnPXt0b29sc1R5cGU6aSxhbmltYXRpb25Xb3JrRGF0YTpsfHxbXSxhbmltYXRpb25JbmRleDowLHR5cGU6cyx1cGRhdGVOb2RlT3B0Om4sb3BzOmEsdXNlQW5pbWF0aW9uOnR5cGVvZiBjPCJ1Ij9jOnR5cGVvZihuPT1udWxsP3ZvaWQgMDpuLnVzZUFuaW1hdGlvbik8InUiP249PW51bGw/dm9pZCAwOm4udXNlQW5pbWF0aW9uOiEwLG9sZFJlY3Q6KGY9dGhpcy52Tm9kZXMuZ2V0KHUpKT09bnVsbD92b2lkIDA6Zi5yZWN0LGlzRGlmZjohMX07aSYmciYmKGc9dGhpcy5zZXROb2RlS2V5KGcsaSxyKSksKHc9dGhpcy53b3JrU2hhcGVzKT09bnVsbHx8dy5zZXQodSxnKX1jb25zdCBoPSh5PXRoaXMud29ya1NoYXBlcyk9PW51bGw/dm9pZCAwOnkuZ2V0KHUpO3MmJihoLnR5cGU9cyksYSYmKGguYW5pbWF0aW9uV29ya0RhdGE9cWUoYSksaC5vcHM9YSksbiYmKGgudXBkYXRlTm9kZU9wdD1uKSxsJiYoaC5pc0RpZmY9dGhpcy5oYXNEaWZmRGF0YShoLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxsLGgudG9vbHNUeXBlKSxoLmFuaW1hdGlvbldvcmtEYXRhPWwpLGgubm9kZSYmaC5ub2RlLmdldFdvcmtJZCgpIT09dSYmaC5ub2RlLnNldFdvcmtJZCh1KSxpJiZyJiYoaC50b29sc1R5cGUhPT1pJiZpJiZyJiZ0aGlzLnNldE5vZGVLZXkoaCxpLHIpLGgubm9kZSYmaC5ub2RlLnNldFdvcmtPcHRpb25zKHIpKX1oYXNEaWZmRGF0YShlLHQscil7Y29uc3QgaT1lLmxlbmd0aDtpZih0Lmxlbmd0aDxpKXJldHVybiEwO3N3aXRjaChyKXtjYXNlIFMuUGVuY2lsOntmb3IobGV0IHM9MDtzPGk7cys9MylpZih0W3NdIT09ZVtzXXx8dFtzKzFdIT09ZVtzKzFdKXJldHVybiEwO2JyZWFrfWNhc2UgUy5MYXNlclBlbjp7Zm9yKGxldCBzPTA7czxpO3MrPTIpaWYodFtzXSE9PWVbc118fHRbcysxXSE9PWVbcysxXSlyZXR1cm4hMDticmVha319cmV0dXJuITF9YXN5bmMgYW5pbWF0aW9uRHJhdygpe3ZhciBsLGMsdSxoLGQsZix3LHksZyxQLGssTyxJLGIsdixMLFQsQSwkLEQsSCxWLGVlLHNlLG5vLGFvLGxvLGNvLHVvLGhvO3RoaXMuYW5pbWF0aW9uSWQ9dm9pZCAwO2xldCBlPSExO2NvbnN0IHQ9bmV3IE1hcCxyPVtdLGk9W10scz1bXSxuPVtdO2Zvcihjb25zdFtqLENdb2YgdGhpcy53b3JrU2hhcGVzLmVudHJpZXMoKSlzd2l0Y2goQy50b29sc1R5cGUpe2Nhc2UgUy5JbWFnZTp7Y29uc3QgXz1DLm9sZFJlY3Q7XyYmcy5wdXNoKHtyZWN0Ol8saXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2NvbnN0IFo9YXdhaXQoKGM9Qy5ub2RlKT09bnVsbD92b2lkIDA6Yy5jb25zdW1lU2VydmljZUFzeW5jKHtpc0Z1bGxXb3JrOiEwLHNjZW5lOihsPXRoaXMuZnVsbExheWVyLnBhcmVudCk9PW51bGw/dm9pZCAwOmwucGFyZW50fSkpO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PU0odGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopLHIucHVzaCh7cmVjdDpaLGRyYXdDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2JyZWFrfWNhc2UgUy5UZXh0OntpZihDLm5vZGUpe2NvbnN0IF89Qy5vbGRSZWN0LFo9KHU9Qy5ub2RlKT09bnVsbD92b2lkIDA6dS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMH0pO3RoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmZvckVhY2goKHRlLEopPT57dmFyIFk7KFk9dGUuc2VsZWN0SWRzKSE9bnVsbCYmWS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChKKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LF8pLHRoaXMubm9BbmltYXRpb25SZWN0PU0odGhpcy5ub0FuaW1hdGlvblJlY3QsWiksdGhpcy5ydW5FZmZlY3QoKSl9KSwoaD1DLm5vZGUpPT1udWxsfHxoLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX1icmVha31jYXNlIFMuQXJyb3c6Y2FzZSBTLlN0cmFpZ2h0OmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246e2NvbnN0IF89ISFDLm9wcztpZigoZD1DLmFuaW1hdGlvbldvcmtEYXRhKSE9bnVsbCYmZC5sZW5ndGgpe2NvbnN0IFo9Qy5vbGRSZWN0LHRlPUMubm9kZS5vbGRSZWN0O1omJnMucHVzaCh7cmVjdDpaLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0ZSYmbi5wdXNoKHtyZWN0OnRlLGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSk7Y29uc3QgSj0oZj1DLm5vZGUpPT1udWxsP3ZvaWQgMDpmLmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhLGlzRnVsbFdvcms6X30pO3Quc2V0KGose3dvcmtTdGF0ZTpaP0Mub3BzP0YuRG9uZTpGLkRvaW5nOkYuU3RhcnQsb3A6Qy5hbmltYXRpb25Xb3JrRGF0YS5maWx0ZXIoKFksZGUpPT57aWYoZGUlMyE9PTIpcmV0dXJuITB9KS5zbGljZSgtMil9KSxfPyh0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKChZLGRlKT0+e3ZhciBSZTsoUmU9WS5zZWxlY3RJZHMpIT1udWxsJiZSZS5pbmNsdWRlcyhqKSYmKHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmFkZChkZSksdGhpcy5ub0FuaW1hdGlvblJlY3Q9TSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxaKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LHRlKSx0aGlzLm5vQW5pbWF0aW9uUmVjdD1NKHRoaXMubm9BbmltYXRpb25SZWN0LEopLHRoaXMucnVuRWZmZWN0KCkpfSksKHc9Qy5ub2RlKT09bnVsbHx8dy5jbGVhclRtcFBvaW50cygpLHRoaXMud29ya1NoYXBlcy5kZWxldGUoaiksci5wdXNoKHtyZWN0OkosZHJhd0NhbnZhczpOLkJnLGlzRnVsbFdvcms6Xyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkMuYW5pbWF0aW9uV29ya0RhdGEuZmlsdGVyKChZLGRlKT0+e2lmKGRlJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpfSkpOmkucHVzaCh7cmVjdDpKLGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsd29ya2VyVHlwZTpfP3ZvaWQgMDpXLlNlcnZpY2UsaXNGdWxsV29yazpfLHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uV29ya0RhdGEubGVuZ3RoPTB9YnJlYWt9Y2FzZSBTLlBlbmNpbDp7aWYoIUMudXNlQW5pbWF0aW9uJiZDLm9wcyl7bGV0IF89KHk9Qy5ub2RlKT09bnVsbD92b2lkIDA6eS5jb25zdW1lU2VydmljZSh7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YXx8W10saXNGdWxsV29yazohMCxyZXBsYWNlSWQ6an0pO2NvbnN0IFo9KGc9Qy5ub2RlKT09bnVsbD92b2lkIDA6Zy51cGRhdGFPcHRTZXJ2aWNlKEMudXBkYXRlTm9kZU9wdCk7Xz1NKF8sWikscy5wdXNoKHtyZWN0Ok0oQy5vbGRSZWN0LF8pLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0Ok0oQy5vbGRSZWN0LF8pLGRyYXdDYW52YXM6Ti5CZyx2aWV3SWQ6dGhpcy52aWV3SWR9KSx0aGlzLnNlbGVjdG9yV29ya1NoYXBlcy5mb3JFYWNoKCh0ZSxKKT0+e3ZhciBZOyhZPXRlLnNlbGVjdElkcykhPW51bGwmJlkuaW5jbHVkZXMoaikmJih0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5hZGQoSiksdGhpcy5ub0FuaW1hdGlvblJlY3Q9TSh0aGlzLm5vQW5pbWF0aW9uUmVjdCxfKSx0aGlzLnJ1bkVmZmVjdCgpKX0pLChQPUMubm9kZSk9PW51bGx8fFAuY2xlYXJUbXBQb2ludHMoKSx0aGlzLndvcmtTaGFwZXMuZGVsZXRlKGopfWVsc2UgaWYoQy51c2VBbmltYXRpb24pe2NvbnN0IFo9dGhpcy5jb21wdXROZXh0QW5pbWF0aW9uSW5kZXgoQywzKSx0ZT1DLmlzRGlmZj8wOk1hdGgubWF4KDAsKEMuYW5pbWF0aW9uSW5kZXh8fDApLTMpLEo9KEMuYW5pbWF0aW9uV29ya0RhdGF8fFtdKS5zbGljZSh0ZSxaKTtpZihDLmlzRGVsKUMuaXNEZWwmJigoQT1DLm5vZGUpPT1udWxsfHxBLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKSk7ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wnx8Qy5pc0RpZmYpe2NvbnN0IFk9KE89Qy5ub2RlKT09bnVsbD92b2lkIDA6Ty5jb25zdW1lU2VydmljZSh7b3A6Sixpc0Z1bGxXb3JrOiExLHJlcGxhY2VJZDooaz1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDprLnRvU3RyaW5nKCl9KTtpZihpLnB1c2goe3JlY3Q6WSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLEMuYW5pbWF0aW9uSW5kZXg9WixDLmlzRGlmZiYmKEMuaXNEaWZmPSExKSxKLmxlbmd0aCl7Y29uc3QgZGU9Si5maWx0ZXIoKFJlLHdwKT0+e2lmKHdwJTMhPT0yKXJldHVybiEwfSkuc2xpY2UoLTIpO3Quc2V0KGose3dvcmtTdGF0ZTp0ZT09PTA/Ri5TdGFydDpaPT09KChJPUMuYW5pbWF0aW9uV29ya0RhdGEpPT1udWxsP3ZvaWQgMDpJLmxlbmd0aCk/Ri5Eb25lOkYuRG9pbmcsb3A6ZGV9KX19ZWxzZSBpZihDLm9wcyl7Y29uc3QgWT0odj1DLm5vZGUpPT1udWxsP3ZvaWQgMDp2LmNvbnN1bWVTZXJ2aWNlKHtvcDpDLmFuaW1hdGlvbldvcmtEYXRhfHxbXSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDooYj1DLm5vZGUuZ2V0V29ya0lkKCkpPT1udWxsP3ZvaWQgMDpiLnRvU3RyaW5nKCl9KTtDLmlzRGVsPSEwLG4ucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHZpZXdJZDp0aGlzLnZpZXdJZH0pLChMPUMubm9kZSkhPW51bGwmJkwuZ2V0V29ya09wdGlvbnMoKS5pc09wYWNpdHkmJnMucHVzaCh7cmVjdDpZLGNsZWFyQ2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSksci5wdXNoKHtyZWN0OlksZHJhd0NhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pLHRoaXMudk5vZGVzLnNldEluZm8oaix7b3A6Qy5hbmltYXRpb25Xb3JrRGF0YSxvcHQ6KFQ9Qy5ub2RlKT09bnVsbD92b2lkIDA6VC5nZXRXb3JrT3B0aW9ucygpLHRvb2xzVHlwZTpDLnRvb2xzVHlwZSxyZWN0Oll9KSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOkouZmlsdGVyKChkZSxSZSk9PntpZihSZSUzIT09MilyZXR1cm4hMH0pLnNsaWNlKC0yKX0pfWU9ITB9YnJlYWt9YnJlYWt9Y2FzZSBTLkxhc2VyUGVuOntjb25zdCBaPXRoaXMuY29tcHV0TmV4dEFuaW1hdGlvbkluZGV4KEMsMiksdGU9TWF0aC5tYXgoMCwoQy5hbmltYXRpb25JbmRleHx8MCktMiksSj0oQy5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKHRlLFopO2lmKEMuaXNEZWwpe2lmKEMuaXNEZWwpe2NvbnN0IFk9KHNlPUMubm9kZSk9PW51bGw/dm9pZCAwOnNlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9TShDLnRvdGFsUmVjdCxZKSxuLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksKG5vPUMubm9kZSk9PW51bGx8fG5vLmNsZWFyVG1wUG9pbnRzKCksdGhpcy53b3JrU2hhcGVzLmRlbGV0ZShqKX19ZWxzZXtpZigoQy5hbmltYXRpb25JbmRleHx8MCk8Wil7Y29uc3QgWT0oRD1DLm5vZGUpPT1udWxsP3ZvaWQgMDpELmNvbnN1bWVTZXJ2aWNlKHtvcDpKLGlzRnVsbFdvcms6ITEscmVwbGFjZUlkOigkPUMubm9kZS5nZXRXb3JrSWQoKSk9PW51bGw/dm9pZCAwOiQudG9TdHJpbmcoKX0pO0MudG90YWxSZWN0PU0oQy50b3RhbFJlY3QsWSksQy50aW1lciYmKGNsZWFyVGltZW91dChDLnRpbWVyKSxDLnRpbWVyPXZvaWQgMCksQy5hbmltYXRpb25JbmRleD1aLEoubGVuZ3RoJiZ0LnNldChqLHt3b3JrU3RhdGU6dGU9PT0wP0YuU3RhcnQ6Wj09PSgoSD1DLmFuaW1hdGlvbldvcmtEYXRhKT09bnVsbD92b2lkIDA6SC5sZW5ndGgpP0YuRG9uZTpGLkRvaW5nLG9wOkouc2xpY2UoLTIpfSl9ZWxzZXtDLnRpbWVyfHwoQy50aW1lcj1zZXRUaW1lb3V0KCgpPT57Qy50aW1lcj12b2lkIDAsQy5pc0RlbD0hMCx0aGlzLnJ1bkFuaW1hdGlvbigpfSwoKFY9Qy5ub2RlKT09bnVsbD92b2lkIDA6Vi5nZXRXb3JrT3B0aW9ucygpKS5kdXJhdGlvbioxZTMrMTAwKSx0LnNldChqLHt3b3JrU3RhdGU6Ri5Eb25lLG9wOltdfSkpO2NvbnN0IFk9KGVlPUMubm9kZSk9PW51bGw/dm9pZCAwOmVlLmNvbnN1bWVTZXJ2aWNlKHtvcDpbXSxpc0Z1bGxXb3JrOiExfSk7Qy50b3RhbFJlY3Q9TShDLnRvdGFsUmVjdCxZKX1uLnB1c2goe3JlY3Q6Qy50b3RhbFJlY3QsY2xlYXJDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksaS5wdXNoKHtyZWN0OkMudG90YWxSZWN0LGRyYXdDYW52YXM6Ti5TZXJ2aWNlRmxvYXQsdmlld0lkOnRoaXMudmlld0lkfSksZT0hMH1icmVha319ZSYmdGhpcy5ydW5BbmltYXRpb24oKTtjb25zdCBhPXtyZW5kZXI6W119O2lmKHMubGVuZ3RoKXtjb25zdCBqPXMucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmNsZWFyQ2FudmFzPT09Ti5CZyYmKEMucmVjdD1NKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNDbGVhcjohMCxjbGVhckNhbnZhczpOLkJnLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwoYW89YS5yZW5kZXIpPT1udWxsfHxhby5wdXNoKGopKX1pZihuLmxlbmd0aCl7Y29uc3Qgaj1uLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5jbGVhckNhbnZhcz09PU4uU2VydmljZUZsb2F0JiYoQy5yZWN0PU0oQy5yZWN0LF8ucmVjdCkpLEMpLHtpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwobG89YS5yZW5kZXIpPT1udWxsfHxsby5wdXNoKGopKX1pZihyLmxlbmd0aCl7Y29uc3Qgaj1yLnJlZHVjZSgoQyxfKT0+KF8ucmVjdCYmXy5kcmF3Q2FudmFzPT09Ti5CZyYmKEMucmVjdD1NKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMCxkcmF3Q2FudmFzOk4uQmcsdmlld0lkOnRoaXMudmlld0lkfSk7ai5yZWN0JiYoai5yZWN0PWoucmVjdCYmSyhqLnJlY3QpLChjbz1hLnJlbmRlcik9PW51bGx8fGNvLnB1c2goaikpfWlmKGkubGVuZ3RoKXtjb25zdCBqPWkucmVkdWNlKChDLF8pPT4oXy5yZWN0JiZfLmRyYXdDYW52YXM9PT1OLlNlcnZpY2VGbG9hdCYmKEMucmVjdD1NKEMucmVjdCxfLnJlY3QpKSxDKSx7aXNGdWxsV29yazohMSxkcmF3Q2FudmFzOk4uU2VydmljZUZsb2F0LHdvcmtlclR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2oucmVjdCYmKGoucmVjdD1qLnJlY3QmJksoai5yZWN0KSwodW89YS5yZW5kZXIpPT1udWxsfHx1by5wdXNoKGopKX10LnNpemUmJihhLnNwPVtdLHQuZm9yRWFjaCgoaixDKT0+e3ZhciBfOyhfPWEuc3ApPT1udWxsfHxfLnB1c2goe3R5cGU6bS5DdXJzb3IsdWlkOkMuc3BsaXQoVmgpWzBdLG9wOmoub3Asd29ya1N0YXRlOmoud29ya1N0YXRlLHZpZXdJZDp0aGlzLnZpZXdJZH0pfSkpLChobz1hLnJlbmRlcikhPW51bGwmJmhvLmxlbmd0aCYmdGhpcy5wb3N0KGEpfXJ1bkFuaW1hdGlvbigpe3RoaXMuYW5pbWF0aW9uSWR8fCh0aGlzLmFuaW1hdGlvbklkPXJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkRyYXcuYmluZCh0aGlzKSkpfWNvbXB1dE5leHRBbmltYXRpb25JbmRleChlLHQpe3ZhciBpO2NvbnN0IHI9TWF0aC5mbG9vcigoZS5hbmltYXRpb25Xb3JrRGF0YXx8W10pLnNsaWNlKGUuYW5pbWF0aW9uSW5kZXgpLmxlbmd0aCozMi90LygoKGk9ZS5ub2RlKT09bnVsbD92b2lkIDA6aS5zeW5jVW5pdFRpbWUpfHwxZTMpKSp0O3JldHVybiBNYXRoLm1pbigoZS5hbmltYXRpb25JbmRleHx8MCkrKHJ8fHQpLChlLmFuaW1hdGlvbldvcmtEYXRhfHxbXSkubGVuZ3RoKX1ydW5FZmZlY3QoKXt0aGlzLnJ1bkVmZmVjdElkfHwodGhpcy5ydW5FZmZlY3RJZD1zZXRUaW1lb3V0KHRoaXMuZWZmZWN0UnVuU2VsZWN0b3IuYmluZCh0aGlzKSwwKSl9ZWZmZWN0UnVuU2VsZWN0b3IoKXt0aGlzLnJ1bkVmZmVjdElkPXZvaWQgMDtsZXQgZT10aGlzLm5vQW5pbWF0aW9uUmVjdDt0aGlzLndpbGxSdW5FZmZlY3RTZWxlY3Rvcklkcy5mb3JFYWNoKHQ9Pnt2YXIgcyxuO2NvbnN0IHI9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMuZ2V0KHQpLGk9ciYmci5zZWxlY3RJZHMmJigocz1yLm5vZGUpPT1udWxsP3ZvaWQgMDpzLnNlbGVjdFNlcnZpY2VOb2RlKHQsciwhMCkpO2U9TShlLGkpLChuPXI9PW51bGw/dm9pZCAwOnIuc2VsZWN0SWRzKSE9bnVsbCYmbi5sZW5ndGh8fHRoaXMuc2VsZWN0b3JXb3JrU2hhcGVzLmRlbGV0ZSh0KX0pLGUmJnRoaXMucG9zdCh7cmVuZGVyOlt7cmVjdDpLKGUpLGRyYXdDYW52YXM6Ti5CZyxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uQmcsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pLHRoaXMud2lsbFJ1bkVmZmVjdFNlbGVjdG9ySWRzLmNsZWFyKCksdGhpcy5ub0FuaW1hdGlvblJlY3Q9dm9pZCAwfWFjdGl2ZVNlbGVjdG9yU2hhcGUoZSl7dmFyIGMsdSxoO2NvbnN0e3dvcmtJZDp0LG9wdDpyLHRvb2xzVHlwZTppLHR5cGU6cyxzZWxlY3RJZHM6bn09ZTtpZighdClyZXR1cm47Y29uc3QgYT10LnRvU3RyaW5nKCk7aWYoISgoYz10aGlzLnNlbGVjdG9yV29ya1NoYXBlcykhPW51bGwmJmMuaGFzKGEpKSl7bGV0IGQ9e3Rvb2xzVHlwZTppLHNlbGVjdElkczpuLHR5cGU6cyxvcHQ6cn07aSYmciYmKGQ9dGhpcy5zZXROb2RlS2V5KGQsaSxyKSksKHU9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsfHx1LnNldChhLGQpfWNvbnN0IGw9KGg9dGhpcy5zZWxlY3RvcldvcmtTaGFwZXMpPT1udWxsP3ZvaWQgMDpoLmdldChhKTtzJiYobC50eXBlPXMpLGwubm9kZSYmbC5ub2RlLmdldFdvcmtJZCgpIT09YSYmbC5ub2RlLnNldFdvcmtJZChhKSxsLnNlbGVjdElkcz1ufHxbXX19Y2xhc3MgaHAgZXh0ZW5kcyByb3tjb25zdHJ1Y3RvcihlKXtzdXBlcihlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiYW5pbWF0aW9uV29ya1JlY3RzIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJjb21iaW5lRHJhd1RpbWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImFuaW1hdGlvbklkIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImNsb3NlQW5pbWF0aW9uVGltZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOjExMDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywicnVuTGFzZXJQZW5TdGVwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6MH0pfWFzeW5jIHJ1bkZ1bGxXb3JrKGUsdCl7dmFyIHMsbjtjb25zdCByPXRoaXMuc2V0RnVsbFdvcmsoZSksaT1lLm9wcyYmcWUoZS5vcHMpO2lmKHIpe2xldCBhO3IudG9vbHNUeXBlPT09Uy5JbWFnZT9hPWF3YWl0IHIuY29uc3VtZVNlcnZpY2VBc3luYyh7aXNGdWxsV29yazohMCxzY2VuZToocz10aGlzLmZ1bGxMYXllci5wYXJlbnQpPT1udWxsP3ZvaWQgMDpzLnBhcmVudH0pOmE9ci5jb25zdW1lU2VydmljZSh7b3A6aSxpc0Z1bGxXb3JrOiEwLHJlcGxhY2VJZDoobj1yLmdldFdvcmtJZCgpKT09bnVsbD92b2lkIDA6bi50b1N0cmluZygpLGlzRHJhd0xhYmVsOnR9KTtjb25zdCBsPShlPT1udWxsP3ZvaWQgMDplLnVwZGF0ZU5vZGVPcHQpJiZyLnVwZGF0YU9wdFNlcnZpY2UoZS51cGRhdGVOb2RlT3B0KTtyZXR1cm4gZS53b3JrSWQmJnRoaXMud29ya1NoYXBlcy5kZWxldGUoZS53b3JrSWQpLGx8fGF9fXJ1blNlbGVjdFdvcmsoZSl7dmFyIHI7Y29uc3QgdD10aGlzLnNldEZ1bGxXb3JrKGUpO3QmJigocj1lLnNlbGVjdElkcykhPW51bGwmJnIubGVuZ3RoKSYmZS53b3JrSWQmJnQuc2VsZWN0U2VydmljZU5vZGUoZS53b3JrSWQudG9TdHJpbmcoKSx7c2VsZWN0SWRzOmUuc2VsZWN0SWRzfSwhMSl9Y29uc3VtZURyYXcoZSl7dmFyIGk7Y29uc3R7b3A6dCx3b3JrSWQ6cn09ZTtpZih0IT1udWxsJiZ0Lmxlbmd0aCYmcil7Y29uc3Qgcz10aGlzLndvcmtTaGFwZXMuZ2V0KHIpO2lmKCFzKXJldHVybjtjb25zdCBuPXMudG9vbHNUeXBlLGE9cy5jb25zdW1lKHtkYXRhOmUsaXNGdWxsV29yazohMSxpc0NsZWFyQWxsOiEwLGlzU3ViV29ya2VyOiEwfSk7c3dpdGNoKG4pe2Nhc2UgUy5MYXNlclBlbjphIT1udWxsJiZhLnJlY3QmJigoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuc2V0KHIse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSksdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbigpO2JyZWFrO2Nhc2UgUy5BcnJvdzpjYXNlIFMuU3RyYWlnaHQ6Y2FzZSBTLkVsbGlwc2U6Y2FzZSBTLlJlY3RhbmdsZTpjYXNlIFMuU3RhcjpjYXNlIFMuUG9seWdvbjpjYXNlIFMuU3BlZWNoQmFsbG9vbjphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdBcnJvdyhhKSk7YnJlYWs7Y2FzZSBTLlBlbmNpbDphJiYodGhpcy5kcmF3Q291bnQrKyx0aGlzLmRyYXdQZW5jaWwoYSkpO2JyZWFrfX19Y29uc3VtZURyYXdBbGwoZSl7dmFyIHIsaTtjb25zdHt3b3JrSWQ6dH09ZTtpZih0KXtjb25zdCBzPXRoaXMud29ya1NoYXBlcy5nZXQodCk7aWYoIXMpcmV0dXJuO3N3aXRjaChzLnRvb2xzVHlwZSl7Y2FzZSBTLkxhc2VyUGVuOmlmKHRoaXMuYW5pbWF0aW9uSWQpe2NvbnN0IGE9cy5jb25zdW1lQWxsKHtkYXRhOmV9KTthIT1udWxsJiZhLm9wJiZhIT1udWxsJiZhLnJlY3QmJigocj10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fHIuc2V0KHQse3JlczphLGNhbkRlbDohMSxpc1JlY3Q6ITB9KSx0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKGEpKTtjb25zdCBsPShpPXMuZ2V0V29ya09wdGlvbnMoKSk9PW51bGw/dm9pZCAwOmkuZHVyYXRpb247dGhpcy5jbG9zZUFuaW1hdGlvblRpbWU9bD9sKjFlMysxMDA6dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUsc2V0VGltZW91dCgoKT0+e3ZhciB1O3RoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKHQudG9TdHJpbmcoKSkubWFwKGg9PmgucmVtb3ZlKCkpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7Y29uc3QgYz0odT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGw/dm9pZCAwOnUuZ2V0KHQpO2MmJihjLmNhbkRlbD0hMCksc2V0VGltZW91dCgoKT0+e3RoaXMuX3Bvc3Qoe3NwOlt7cmVtb3ZlSWRzOlt0LnRvU3RyaW5nKCldLHR5cGU6bS5SZW1vdmVOb2RlfV19KX0scy5nZXRXb3JrT3B0aW9ucygpLnN5bmNVbml0VGltZXx8dGhpcy5jbG9zZUFuaW1hdGlvblRpbWUpfSx0aGlzLmNsb3NlQW5pbWF0aW9uVGltZSl9YnJlYWs7Y2FzZSBTLkFycm93OmNhc2UgUy5TdHJhaWdodDpjYXNlIFMuRWxsaXBzZTpjYXNlIFMuUGVuY2lsOmNhc2UgUy5SZWN0YW5nbGU6Y2FzZSBTLlN0YXI6Y2FzZSBTLlBvbHlnb246Y2FzZSBTLlNwZWVjaEJhbGxvb246dGhpcy5kcmF3Q291bnQ9MCx0aGlzLmZ1bGxMYXllci5yZW1vdmVBbGxDaGlsZHJlbigpLHRoaXMuY2xlYXJXb3JrU2hhcGVOb2RlQ2FjaGUodCk7YnJlYWt9fX11cGRhdGVMYWJlbHMoZSx0KXtlLmNoaWxkcmVuLmZvckVhY2gocj0+e2lmKHIudGFnTmFtZT09PSJMQUJFTCIpe2NvbnN0IGk9ci5uYW1lLHt3aWR0aDpzfT1yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFtuXT1lLndvcmxkU2NhbGluZyx7dW5kZXJsaW5lOmEsbGluZVRocm91Z2g6bH09dC5vcHQ7YSYmZS5nZXRFbGVtZW50c0J5TmFtZShgJHtpfV91bmRlcmxpbmVgKVswXS5hdHRyKHtwb2ludHM6WzAsMCxzL24sMF19KSxsJiZlLmdldEVsZW1lbnRzQnlOYW1lKGAke2l9X2xpbmVUaHJvdWdoYClbMF0uYXR0cih7cG9pbnRzOlswLDAscy9uLDBdfSl9fSl9cnVuTGFzZXJQZW5BbmltYXRpb24oZSl7dGhpcy5hbmltYXRpb25JZHx8KHRoaXMuYW5pbWF0aW9uSWQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT57dmFyIGkscztpZih0aGlzLmFuaW1hdGlvbklkPXZvaWQgMCx0aGlzLnJ1bkxhc2VyUGVuU3RlcCsrLHRoaXMucnVuTGFzZXJQZW5TdGVwPjEpe3RoaXMucnVuTGFzZXJQZW5TdGVwPTAsdGhpcy5ydW5MYXNlclBlbkFuaW1hdGlvbihlKTtyZXR1cm59bGV0IHQ7Y29uc3Qgcj1bXTsoaT10aGlzLmFuaW1hdGlvbldvcmtSZWN0cyk9PW51bGx8fGkuZm9yRWFjaCgobixhLGwpPT57bi5pc1JlY3QmJih0PU0odCxuLnJlcy5yZWN0KSksbi5yZXMud29ya0lkJiZyLnB1c2gobi5yZXMpLHRoaXMuZnVsbExheWVyLmdldEVsZW1lbnRzQnlOYW1lKGEudG9TdHJpbmcoKSkubGVuZ3RoP24uaXNSZWN0PSEwOm4uaXNSZWN0PSExLG4uY2FuRGVsJiZsLmRlbGV0ZShhKX0pLChzPXRoaXMuYW5pbWF0aW9uV29ya1JlY3RzKSE9bnVsbCYmcy5zaXplJiZ0aGlzLnJ1bkxhc2VyUGVuQW5pbWF0aW9uKCksdCYmKGUmJnIucHVzaChlKSx0aGlzLl9wb3N0KHtyZW5kZXI6W3tyZWN0OksodCksZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOnJ9KSl9KSl9ZHJhd1BlbmNpbChlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDplPT1udWxsP3ZvaWQgMDplLnJlY3QsZHJhd0NhbnZhczpOLkZsb2F0LGlzQ2xlYXI6ITEsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XSxzcDooZT09bnVsbD92b2lkIDA6ZS5vcCkmJltlXX0pfWRyYXdBcnJvdyhlKXt0aGlzLl9wb3N0KHtkcmF3Q291bnQ6dGhpcy5kcmF3Q291bnQscmVuZGVyOlt7cmVjdDooZT09bnVsbD92b2lkIDA6ZS5yZWN0KSYmSyhlLnJlY3QpLGRyYXdDYW52YXM6Ti5GbG9hdCxpc0NsZWFyOiEwLGNsZWFyQ2FudmFzOk4uRmxvYXQsaXNGdWxsV29yazohMSx2aWV3SWQ6dGhpcy52aWV3SWR9XX0pfX12YXIgV2U7KGZ1bmN0aW9uKG8pe28uRnVsbD0iZnVsbCIsby5TdWI9InN1YiJ9KShXZXx8KFdlPXt9KSk7Y2xhc3MgZHB7Y29uc3RydWN0b3IoZSx0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiX3NlbGYiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywidHlwZSIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJ3b3JrVGhyZWFkTWFwIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6bmV3IE1hcH0pLHRoaXMuX3NlbGY9ZSx0aGlzLnR5cGU9dCx0aGlzLnJlZ2lzdGVyKCl9aW5pdChlKXtjb25zdHt2aWV3SWQ6dCxkcHI6cixvZmZzY3JlZW5DYW52YXNPcHQ6aSxsYXllck9wdDpzLGlzU2FmYXJpOm59PWU7aWYoIXJ8fCFpfHwhcylyZXR1cm47bGV0IGE7dGhpcy50eXBlPT09V2UuRnVsbCYmKGE9bmV3IGZwKHQse2RwcjpyLG9mZnNjcmVlbkNhbnZhc09wdDppLGxheWVyT3B0OnN9LHRoaXMucG9zdC5iaW5kKHRoaXMpKSksdGhpcy50eXBlPT09V2UuU3ViJiYoYT1uZXcgcHAodCx7ZHByOnIsb2Zmc2NyZWVuQ2FudmFzT3B0OmksbGF5ZXJPcHQ6c30sdGhpcy5wb3N0LmJpbmQodGhpcykpKSxhJiZuJiZhLnNldElzU2FmYXJpKG4pLGEmJmUuY2FtZXJhT3B0JiZhLnNldENhbWVyYU9wdChlLmNhbWVyYU9wdCksYSYmdGhpcy53b3JrVGhyZWFkTWFwLnNldCh0LGEpfXJlZ2lzdGVyKCl7b25tZXNzYWdlPWU9Pntjb25zdCB0PWUuZGF0YTtpZih0KWZvcihjb25zdCByIG9mIHQudmFsdWVzKCkpe2NvbnN0e21zZ1R5cGU6aSx2aWV3SWQ6cyx0YXNrc3F1ZXVlOm4sbWFpblRhc2tzcXVldWVDb3VudDphfT1yO2lmKGk9PT1tLkluaXQpe3RoaXMuaW5pdChyKTtjb250aW51ZX1pZihpPT09bS5UYXNrc1F1ZXVlJiYobiE9bnVsbCYmbi5zaXplKSYmYSl7dGhpcy53b3JrVGhyZWFkTWFwLmZvckVhY2goKGMsdSk9Pntjb25zdCBoPW4uZ2V0KHUpO2gmJmMub24oaCksdGhpcy5wb3N0KHt3b3JrZXJUYXNrc3F1ZXVlQ291bnQ6YX0pfSk7Y29udGludWV9aWYocz09PXRkKXt0aGlzLndvcmtUaHJlYWRNYXAuZm9yRWFjaChjPT57Yy5vbihyKSxpPT09bS5EZXN0cm95JiZ0aGlzLndvcmtUaHJlYWRNYXAuZGVsZXRlKHMpfSk7Y29udGludWV9Y29uc3QgbD10aGlzLndvcmtUaHJlYWRNYXAuZ2V0KHMpO2wmJihsLm9uKHIpLGk9PT1tLkRlc3Ryb3kmJnRoaXMud29ya1RocmVhZE1hcC5kZWxldGUocykpfX19cG9zdChlLHQpe3Q/dGhpcy5fc2VsZi5wb3N0TWVzc2FnZShlLHQpOnRoaXMuX3NlbGYucG9zdE1lc3NhZ2UoZSl9fWNsYXNzIGZwIGV4dGVuZHMgdG97Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VEcmF3TGF5ZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywiZHJhd0xheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNuYXBzaG90RnVsbExheWVyIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIm1ldGhvZEJ1aWxkZXIiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywibG9jYWxXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsInNlcnZpY2VXb3JrIix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIl9wb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksdGhpcy5fcG9zdD1yLHRoaXMuc2VydmljZURyYXdMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzZXJ2aWNlRHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSksdGhpcy5kcmF3TGF5ZXI9dGhpcy5jcmVhdGVMYXllcigiZHJhd0xheWVyIix0aGlzLnNjZW5lLHsuLi50LmxheWVyT3B0LGJ1ZmZlclNpemU6MWUzfSk7Y29uc3QgaT17dGhyZWFkOnRoaXMsdmlld0lkOnRoaXMudmlld0lkLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyLHBvc3Q6dGhpcy5wb3N0LmJpbmQodGhpcyl9O3RoaXMubG9jYWxXb3JrPW5ldyBjcChpKSx0aGlzLnNlcnZpY2VXb3JrPW5ldyB1cCh7Li4uaSxzZXJ2aWNlRHJhd0xheWVyOnRoaXMuc2VydmljZURyYXdMYXllcn0pLHRoaXMubWV0aG9kQnVpbGRlcj1uZXcgeGYoW0IuQ29weU5vZGUsQi5TZXRDb2xvck5vZGUsQi5EZWxldGVOb2RlLEIuUm90YXRlTm9kZSxCLlNjYWxlTm9kZSxCLlRyYW5zbGF0ZU5vZGUsQi5aSW5kZXhBY3RpdmUsQi5aSW5kZXhOb2RlLEIuU2V0Rm9udFN0eWxlLEIuU2V0UG9pbnQsQi5TZXRMb2NrLEIuU2V0U2hhcGVPcHRdKS5yZWdpc3RlckZvcldvcmtlcih0aGlzLmxvY2FsV29yayx0aGlzLnNlcnZpY2VXb3JrLHRoaXMuc2NlbmUpLHRoaXMudk5vZGVzLmluaXQodGhpcy5mdWxsTGF5ZXIsdGhpcy5kcmF3TGF5ZXIpfWFzeW5jIHBvc3QoZSx0KXt2YXIgYSxsLGM7Y29uc3Qgcj1lLnJlbmRlcixpPVtdO2xldCBzPXQ7aWYociE9bnVsbCYmci5sZW5ndGgpe2Zvcihjb25zdCB1IG9mIHIpe2lmKHUuaXNDbGVhckFsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLHUuaXNDbGVhcj0hMCxkZWxldGUgdS5pc0NsZWFyQWxsKSx1LmlzRHJhd0FsbCYmKHUucmVjdD10aGlzLmdldFNjZW5lUmVjdCgpLGRlbGV0ZSB1LmlzRHJhd0FsbCksdS5kcmF3Q2FudmFzKXtjb25zdCBoPXRoaXMuZ2V0TGF5ZXIodS5pc0Z1bGxXb3JrLHUud29ya2VyVHlwZSk7KGg9PW51bGw/dm9pZCAwOmgucGFyZW50KS5yZW5kZXIoKX1pZih1LnJlY3Qpe3UuY2xlYXJDYW52YXM9PT11LmRyYXdDYW52YXMmJnUuZHJhd0NhbnZhcz09PU4uQmcmJih1LnJlY3Q9dGhpcy5jaGVja1JpZ2h0UmVjdEJvdW5kaW5nQm94KHUucmVjdCkpO2NvbnN0IGg9dS5kcmF3Q2FudmFzPT09Ti5TZWxlY3RvciYmdS5yZWN0O2lmKHUucmVjdD10aGlzLnNhZmFyaUZpeFJlY3QocmUodS5yZWN0KSksIXUucmVjdCljb250aW51ZTtpZih1LmRyYXdDYW52YXM9PT1OLlNlbGVjdG9yKXtjb25zdCBkPShhPWUuc3ApPT1udWxsP3ZvaWQgMDphLmZpbmQoZj0+Zi50eXBlPT09bS5TZWxlY3QpO2QmJihkLnJlY3Q9dS5yZWN0KSxoJiYodS5vZmZzZXQ9e3g6dS5yZWN0LngtaC54LHk6dS5yZWN0LnktaC55fSl9aWYodS5kcmF3Q2FudmFzKXtjb25zdCBkPWF3YWl0IHRoaXMuZ2V0UmVjdEltYWdlQml0bWFwKHUucmVjdCwhIXUuaXNGdWxsV29yayx1LndvcmtlclR5cGUpO3UuaW1hZ2VCaXRtYXA9ZCxzfHwocz1bXSkscy5wdXNoKGQpfWkucHVzaCh1KX19ZS5yZW5kZXI9aX1jb25zdCBuPShsPWUuc3ApPT1udWxsP3ZvaWQgMDpsLmZpbHRlcih1PT51LnR5cGUhPT1tLk5vbmV8fE9iamVjdC5rZXlzKHUpLmZpbHRlcihoPT5oPT09InR5cGUiKS5sZW5ndGgpO2lmKG4hPW51bGwmJm4ubGVuZ3RoJiYoZS5zcD1uLm1hcCh1PT4oey4uLnUsdmlld0lkOnRoaXMudmlld0lkfSkpKSwoZS5kcmF3Q291bnR8fGUud29ya2VyVGFza3NxdWV1ZUNvdW50fHwoYz1lLnNwKSE9bnVsbCYmYy5sZW5ndGh8fGkhPW51bGwmJmkubGVuZ3RoKSYmKGNvbnNvbGUubG9nKCJwb3N0Iix0aGlzLmZ1bGxMYXllci5jaGlsZHJlbi5tYXAodT0+KHtuYW1lOnUubmFtZSx6SW5kZXg6dS5nZXRBdHRyaWJ1dGUoInpJbmRleCIpfSkpKSx0aGlzLl9wb3N0KGUscykscyE9bnVsbCYmcy5sZW5ndGgpKWZvcihjb25zdCB1IG9mIHMpdSBpbnN0YW5jZW9mIEltYWdlQml0bWFwJiZ1LmNsb3NlKCl9b24oZSl7aWYodGhpcy5tZXRob2RCdWlsZGVyLmNvbnN1bWVGb3JXb3JrZXIoZSkpcmV0dXJuO2NvbnN0e21zZ1R5cGU6dCxkYXRhVHlwZTpyLHdvcmtJZDppfT1lO3N3aXRjaCh0KXtjYXNlIG0uVXBkYXRlQ2FtZXJhOnRoaXMudXBkYXRlQ2FtZXJhKGUpO2JyZWFrO2Nhc2UgbS5TZWxlY3Q6cj09PVcuU2VydmljZSYmKGk9PT1FLnNlbGVjdG9ySWQ/dGhpcy5sb2NhbFdvcmsudXBkYXRlRnVsbFNlbGVjdFdvcmsoZSk6dGhpcy5zZXJ2aWNlV29yay5ydW5TZWxlY3RXb3JrKGUpKTticmVhaztjYXNlIG0uVXBkYXRlTm9kZTpjYXNlIG0uRnVsbFdvcms6dGhpcy5jb25zdW1lRnVsbChyLGUpO2JyZWFrO2Nhc2UgbS5SZW1vdmVOb2RlOnRoaXMucmVtb3ZlTm9kZShlKTticmVhaztjYXNlIG0uR2V0VGV4dEFjdGl2ZTp0aGlzLmNoZWNrVGV4dEFjdGl2ZShlKTticmVhaztjYXNlIG0uQ3Vyc29ySG92ZXI6dGhpcy5jdXJzb3JIb3ZlcihlKX1zdXBlci5vbihlKX1hc3luYyByZW1vdmVOb2RlKGUpe2NvbnN0e2RhdGFUeXBlOnQsd29ya0lkOnJ9PWU7aWYocj09PUUuc2VsZWN0b3JJZCl7dGhpcy5sb2NhbFdvcmsuYmx1clNlbGVjdG9yKGUpO3JldHVybn10PT09Vy5Mb2NhbCYmKHRoaXMubG9jYWxXb3JrLnJlbW92ZVdvcmsoZSksdGhpcy5sb2NhbFdvcmsuY29sbG9jdEVmZmVjdFNlbGVjdFdvcmsoZSkpLHQ9PT1XLlNlcnZpY2UmJih0aGlzLnNlcnZpY2VXb3JrLnJlbW92ZVdvcmsoZSksdGhpcy5sb2NhbFdvcmsuY29sbG9jdEVmZmVjdFNlbGVjdFdvcmsoZSkpfWNoZWNrVGV4dEFjdGl2ZShlKXtjb25zdHtkYXRhVHlwZTp0fT1lO3Q9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jaGVja1RleHRBY3RpdmUoZSl9Y2xlYXJBbGwoKXt0aGlzLnZOb2Rlcy5jbGVhcigpLHN1cGVyLmNsZWFyQWxsKCksdGhpcy5zZXJ2aWNlRHJhd0xheWVyJiYodGhpcy5zZXJ2aWNlRHJhd0xheWVyLnBhcmVudC5jaGlsZHJlbi5mb3JFYWNoKGU9PntlLm5hbWUhPT0idmlld3BvcnQiJiZlLnJlbW92ZSgpfSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnJlbW92ZUFsbENoaWxkcmVuKCkpLHRoaXMucG9zdCh7cmVuZGVyOlt7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkJnLGlzRnVsbFdvcms6ITAsdmlld0lkOnRoaXMudmlld0lkfSx7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLkZsb2F0LGlzRnVsbFdvcms6ITEsdmlld0lkOnRoaXMudmlld0lkfSx7aXNDbGVhckFsbDohMCxjbGVhckNhbnZhczpOLlNlcnZpY2VGbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH1dLHNwOlt7dHlwZTptLkNsZWFyfV19KX11cGRhdGVMYXllcihlKXtjb25zdHt3aWR0aDp0LGhlaWdodDpyfT1lO3N1cGVyLnVwZGF0ZUxheWVyKGUpLHRoaXMuc2VydmljZURyYXdMYXllciYmKHRoaXMuc2VydmljZURyYXdMYXllci5wYXJlbnQuc2V0QXR0cmlidXRlKCJ3aWR0aCIsdCksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnBhcmVudC5zZXRBdHRyaWJ1dGUoImhlaWdodCIsciksdGhpcy5zZXJ2aWNlRHJhd0xheWVyLnNldEF0dHJpYnV0ZSgic2l6ZSIsW3Qscl0pLHRoaXMuc2VydmljZURyYXdMYXllci5zZXRBdHRyaWJ1dGUoInBvcyIsW3QqLjUsciouNV0pKX1zZXRDYW1lcmFPcHQoZSl7dGhpcy5jYW1lcmFPcHQ9ZTtjb25zdHtzY2FsZTp0LGNlbnRlclg6cixjZW50ZXJZOmksd2lkdGg6cyxoZWlnaHQ6bn09ZTsocyE9PXRoaXMuc2NlbmUud2lkdGh8fG4hPT10aGlzLnNjZW5lLmhlaWdodCkmJnRoaXMudXBkYXRlU2NlbmUoe3dpZHRoOnMsaGVpZ2h0Om59KSx0aGlzLmZ1bGxMYXllciYmKHRoaXMuZnVsbExheWVyLnNldEF0dHJpYnV0ZSgic2NhbGUiLFt0LHRdKSx0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1yLC1pXSkpLHRoaXMuZHJhd0xheWVyJiYodGhpcy5kcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJzY2FsZSIsW3QsdF0pLHRoaXMuZHJhd0xheWVyLnNldEF0dHJpYnV0ZSgidHJhbnNsYXRlIixbLXIsLWldKSksdGhpcy5zZXJ2aWNlRHJhd0xheWVyJiYodGhpcy5zZXJ2aWNlRHJhd0xheWVyLnNldEF0dHJpYnV0ZSgic2NhbGUiLFt0LHRdKSx0aGlzLnNlcnZpY2VEcmF3TGF5ZXIuc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFstciwtaV0pKX1nZXRMYXllcihlLHQpe3JldHVybiBlP3RoaXMuZnVsbExheWVyOnQmJnQ9PT1XLlNlcnZpY2U/dGhpcy5zZXJ2aWNlRHJhd0xheWVyOnRoaXMuZHJhd0xheWVyfWdldE9mZnNjcmVlbihlLHQpe3JldHVybiB0aGlzLmdldExheWVyKGUsdCkucGFyZW50LmNhbnZhc31hc3luYyBjb25zdW1lRnVsbChlLHQpe2NvbnN0IHI9YXdhaXQgdGhpcy5sb2NhbFdvcmsuY29sbG9jdEVmZmVjdFNlbGVjdFdvcmsodCk7ciYmZT09PVcuTG9jYWwmJmF3YWl0IHRoaXMubG9jYWxXb3JrLmNvbnN1bWVGdWxsKHIsdGhpcy5zY2VuZSksciYmZT09PVcuU2VydmljZSYmdGhpcy5zZXJ2aWNlV29yay5jb25zdW1lRnVsbChyKX1jb25zdW1lRHJhdyhlLHQpe2U9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jb25zdW1lRHJhdyh0LHRoaXMuc2VydmljZVdvcmspLGU9PT1XLlNlcnZpY2UmJnRoaXMuc2VydmljZVdvcmsuY29uc3VtZURyYXcodCl9Y29uc3VtZURyYXdBbGwoZSx0KXtlPT09Vy5Mb2NhbCYmdGhpcy5sb2NhbFdvcmsuY29uc3VtZURyYXdBbGwodCx0aGlzLnNlcnZpY2VXb3JrKX11cGRhdGVDYW1lcmEoZSl7dmFyIGk7Y29uc3QgdD1bXSx7Y2FtZXJhT3B0OnJ9PWU7aWYociYmKHRoaXMuc2V0Q2FtZXJhT3B0KHIpLHRoaXMubG9jYWxXb3JrLndvcmtTaGFwZXMuZm9yRWFjaCgocyxuKT0+eyhzLnRvb2xzVHlwZT09PVMuUGVuY2lsfHxzLnRvb2xzVHlwZT09PVMuQXJyb3d8fHMudG9vbHNUeXBlPT09Uy5TdHJhaWdodHx8cy50b29sc1R5cGU9PT1TLkVsbGlwc2V8fHMudG9vbHNUeXBlPT09Uy5SZWN0YW5nbGV8fHMudG9vbHNUeXBlPT09Uy5TdGFyfHxzLnRvb2xzVHlwZT09PVMuUG9seWdvbnx8cy50b29sc1R5cGU9PT1TLlNwZWVjaEJhbGxvb258fHMudG9vbHNUeXBlPT09Uy5UZXh0KSYmdGhpcy5sb2NhbFdvcmsud29ya1NoYXBlU3RhdGUuc2V0KG4se3dpbGxDbGVhcjohMH0pfSksdGhpcy52Tm9kZXMuY3VyTm9kZU1hcC5zaXplKSl7aWYodGhpcy52Tm9kZXMudXBkYXRlTm9kZXNSZWN0KCksdGhpcy5sb2NhbFdvcmsucmVSZW5kZXJTZWxlY3RvcigpLHRoaXMuc2VydmljZVdvcmsuc2VsZWN0b3JXb3JrU2hhcGVzLnNpemUpZm9yKGNvbnN0W2EsbF1vZiB0aGlzLnNlcnZpY2VXb3JrLnNlbGVjdG9yV29ya1NoYXBlcy5lbnRyaWVzKCkpdGhpcy5zZXJ2aWNlV29yay5ydW5TZWxlY3RXb3JrKHt3b3JrSWQ6YSxzZWxlY3RJZHM6bC5zZWxlY3RJZHMsbXNnVHlwZTptLlNlbGVjdCxkYXRhVHlwZTpXLlNlcnZpY2Usdmlld0lkOnRoaXMudmlld0lkfSk7bGV0IHM7Y29uc3Qgbj10aGlzLmxvY2FsV29yay5nZXRXb3JrU2hhcGUoS2UpO2lmKG4mJigoaT1uLnNlbGVjdElkcykhPW51bGwmJmkubGVuZ3RoKSYmKHM9bi5vbGRTZWxlY3RSZWN0LG4uY3Vyc29yQmx1cigpKSx0aGlzLnZOb2Rlcy5oYXNSZW5kZXJOb2RlcygpKXt0LnB1c2goe2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5CZyxpc0Z1bGxXb3JrOiEwLHZpZXdJZDp0aGlzLnZpZXdJZH0se2lzQ2xlYXJBbGw6ITAsY2xlYXJDYW52YXM6Ti5GbG9hdCxpc0Z1bGxXb3JrOiExLHZpZXdJZDp0aGlzLnZpZXdJZH0pO2Zvcihjb25zdCBhIG9mIHRoaXMudk5vZGVzLmN1ck5vZGVNYXAudmFsdWVzKCkpT3IoYS50b29sc1R5cGUpJiYocz1NKHMsYS5yZWN0KSk7cyYmdC5wdXNoKHtyZWN0OksocywyMCksZHJhd0NhbnZhczpOLkJnLGlzQ2xlYXI6ITEsaXNGdWxsV29yazohMCx2aWV3SWQ6dGhpcy52aWV3SWR9KX10Lmxlbmd0aCYmdGhpcy5wb3N0KHtyZW5kZXI6dH0pfX1nZXRSZWN0SW1hZ2VCaXRtYXAoZSx0LHIpe2NvbnN0IGk9ZS54KnRoaXMuZHByLHM9ZS55KnRoaXMuZHByLG49ZS53KnRoaXMuZHByLGE9ZS5oKnRoaXMuZHByO3JldHVybiBjcmVhdGVJbWFnZUJpdG1hcCh0aGlzLmdldE9mZnNjcmVlbih0LHIpLGkscyxuLGEpfXNhZmFyaUZpeFJlY3QoZSl7aWYoZS53K2UueDw9MHx8ZS5oK2UueTw9MHx8ZS53PD0wfHxlLmg8PTApcmV0dXJuO2NvbnN0IHQ9e3g6MCx5OjAsdzpNYXRoLmZsb29yKHRoaXMuc2NlbmUud2lkdGgpLGg6TWF0aC5mbG9vcih0aGlzLnNjZW5lLmhlaWdodCl9O2lmKGUueDwwP2UudytlLng8dGhpcy5zY2VuZS53aWR0aCYmKHQudz1lLncrZS54KTplLncrZS54PjAmJih0Lng9ZS54LHQudz1NYXRoLmZsb29yKHRoaXMuc2NlbmUud2lkdGgtZS54KSksZS55PDA/ZS5oK2UueTx0aGlzLnNjZW5lLmhlaWdodCYmKHQuaD1lLmgrZS55KTplLmgrZS55PjAmJih0Lnk9ZS55LHQuaD1NYXRoLmZsb29yKHRoaXMuc2NlbmUuaGVpZ2h0LWUueSkpLCEodC53PD0wfHx0Lmg8PTApKXJldHVybiB0fWdldFNjZW5lUmVjdCgpe2NvbnN0e3dpZHRoOmUsaGVpZ2h0OnR9PXRoaXMuc2NlbmU7cmV0dXJue3g6MCx5OjAsdzpNYXRoLmZsb29yKGUpLGg6TWF0aC5mbG9vcih0KX19Y2hlY2tSaWdodFJlY3RCb3VuZGluZ0JveChlKXtyZXR1cm4gdGhpcy52Tm9kZXMuY29tYmluZUludGVyc2VjdFJlY3QoZSl9Y3Vyc29ySG92ZXIoZSl7dGhpcy5sb2NhbFdvcmsuY3Vyc29ySG92ZXIoZSl9fWNsYXNzIHBwIGV4dGVuZHMgdG97Y29uc3RydWN0b3IoZSx0LHIpe3N1cGVyKGUsdCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIl9wb3N0Iix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6dm9pZCAwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsImRyYXdMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzbmFwc2hvdEZ1bGxMYXllciIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJzZXJ2aWNlV29yayIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOnZvaWQgMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJsb2NhbFdvcmsiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTp2b2lkIDB9KSx0aGlzLl9wb3N0PXI7Y29uc3QgaT17dGhyZWFkOnRoaXMsdmlld0lkOnRoaXMudmlld0lkLHZOb2Rlczp0aGlzLnZOb2RlcyxmdWxsTGF5ZXI6dGhpcy5mdWxsTGF5ZXIsZHJhd0xheWVyOnRoaXMuZHJhd0xheWVyLHBvc3Q6dGhpcy5wb3N0LmJpbmQodGhpcyl9O3RoaXMubG9jYWxXb3JrPW5ldyBocChpKSx0aGlzLnZOb2Rlcy5pbml0KHRoaXMuZnVsbExheWVyLHRoaXMuZHJhd0xheWVyKX1hc3luYyBwb3N0KGUsdCl7dmFyIGEsbDtjb25zdCByPWUucmVuZGVyLGk9W107bGV0IHM9dDtpZihyIT1udWxsJiZyLmxlbmd0aCl7Zm9yKGNvbnN0IGMgb2YgcilpZihjLmRyYXdDYW52YXMmJnRoaXMuZnVsbExheWVyLnBhcmVudC5yZW5kZXIoKSxjLnJlY3Qpe2lmKGMucmVjdD10aGlzLnNhZmFyaUZpeFJlY3QocmUoYy5yZWN0KSksIWMucmVjdCljb250aW51ZTtpZihjLmRyYXdDYW52YXMpe2NvbnN0IHU9YXdhaXQgdGhpcy5nZXRSZWN0SW1hZ2VCaXRtYXAoYy5yZWN0LCEhYy5pc0Z1bGxXb3JrKTtjLmltYWdlQml0bWFwPXUsc3x8KHM9W10pLHMucHVzaCh1KX1pLnB1c2goYyl9ZS5yZW5kZXI9aX1jb25zdCBuPShhPWUuc3ApPT1udWxsP3ZvaWQgMDphLmZpbHRlcihjPT5jLnR5cGUhPT1tLk5vbmV8fE9iamVjdC5rZXlzKGMpLmZpbHRlcih1PT51PT09InR5cGUiKS5sZW5ndGgpO2lmKG4hPW51bGwmJm4ubGVuZ3RoJiYoZS5zcD1uLm1hcChjPT4oey4uLmMsdmlld0lkOnRoaXMudmlld0lkfSkpKSwoKGw9ZS5zcCkhPW51bGwmJmwubGVuZ3RofHxlLmRyYXdDb3VudHx8aSE9bnVsbCYmaS5sZW5ndGgpJiYodGhpcy5fcG9zdChlLHMpLHMhPW51bGwmJnMubGVuZ3RoKSlmb3IoY29uc3QgYyBvZiBzKWMgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCYmYy5jbG9zZSgpfW9uKGUpe2NvbnN0e21zZ1R5cGU6dH09ZTtzd2l0Y2godCl7Y2FzZSBtLlVwZGF0ZUNhbWVyYTp0aGlzLnVwZGF0ZUNhbWVyYShlKTticmVhaztjYXNlIG0uU25hcHNob3Q6dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj10aGlzLmNyZWF0ZUxheWVyKCJzbmFwc2hvdEZ1bGxMYXllciIsdGhpcy5zY2VuZSx7Li4udGhpcy5vcHQubGF5ZXJPcHQsYnVmZmVyU2l6ZTp0aGlzLnZpZXdJZD09PSJtYWluVmlldyI/NmUzOjNlM30pLHRoaXMuc25hcHNob3RGdWxsTGF5ZXImJnRoaXMuZ2V0U25hcHNob3QoZSkudGhlbigoKT0+e3RoaXMuc25hcHNob3RGdWxsTGF5ZXI9dm9pZCAwfSk7YnJlYWs7Y2FzZSBtLkJvdW5kaW5nQm94OnRoaXMuc25hcHNob3RGdWxsTGF5ZXI9dGhpcy5jcmVhdGVMYXllcigic25hcHNob3RGdWxsTGF5ZXIiLHRoaXMuc2NlbmUsey4uLnRoaXMub3B0LmxheWVyT3B0LGJ1ZmZlclNpemU6dGhpcy52aWV3SWQ9PT0ibWFpblZpZXciPzZlMzozZTN9KSx0aGlzLnNuYXBzaG90RnVsbExheWVyJiZ0aGlzLmdldEJvdW5kaW5nUmVjdChlKS50aGVuKCgpPT57dGhpcy5zbmFwc2hvdEZ1bGxMYXllcj12b2lkIDB9KTticmVha31zdXBlci5vbihlKX1nZXRPZmZzY3JlZW4oZSl7dmFyIHQ7cmV0dXJuKHQ9KGUmJnRoaXMuc25hcHNob3RGdWxsTGF5ZXJ8fHRoaXMuZnVsbExheWVyKS5wYXJlbnQpPT1udWxsP3ZvaWQgMDp0LmNhbnZhc31jb25zdW1lRHJhdyhlLHQpe2U9PT1XLkxvY2FsJiZ0aGlzLmxvY2FsV29yay5jb25zdW1lRHJhdyh0KX1jb25zdW1lRHJhd0FsbChlLHQpe3RoaXMubG9jYWxXb3JrLmNvbnN1bWVEcmF3QWxsKHQpfWdldFJlY3RJbWFnZUJpdG1hcChlLHQ9ITEscil7Y29uc3QgaT1lLngqdGhpcy5kcHIscz1lLnkqdGhpcy5kcHIsbj1lLncqdGhpcy5kcHIsYT1lLmgqdGhpcy5kcHI7cmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKHRoaXMuZ2V0T2Zmc2NyZWVuKHQpLGkscyxuLGEscil9c2FmYXJpRml4UmVjdChlKXtpZihlLncrZS54PD0wfHxlLmgrZS55PD0wfHxlLnc8PTB8fGUuaDw9MClyZXR1cm47Y29uc3QgdD17eDowLHk6MCx3Ok1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aCksaDpNYXRoLmZsb29yKHRoaXMuc2NlbmUuaGVpZ2h0KX07aWYoZS54PDA/ZS53K2UueDx0aGlzLnNjZW5lLndpZHRoJiYodC53PWUudytlLngpOmUudytlLng+MCYmKHQueD1lLngsdC53PU1hdGguZmxvb3IodGhpcy5zY2VuZS53aWR0aC1lLngpKSxlLnk8MD9lLmgrZS55PHRoaXMuc2NlbmUuaGVpZ2h0JiYodC5oPWUuaCtlLnkpOmUuaCtlLnk+MCYmKHQueT1lLnksdC5oPU1hdGguZmxvb3IodGhpcy5zY2VuZS5oZWlnaHQtZS55KSksISh0Lnc8PTB8fHQuaDw9MCkpcmV0dXJuIHR9dXBkYXRlQ2FtZXJhKGUpe2NvbnN0e2NhbWVyYU9wdDp0fT1lO3QmJnRoaXMuc2V0Q2FtZXJhT3B0KHQpfXNldENhbWVyYU9wdChlLHQpe3RoaXMuY2FtZXJhT3B0PWU7Y29uc3R7c2NhbGU6cixjZW50ZXJYOmksY2VudGVyWTpzLHdpZHRoOm4saGVpZ2h0OmF9PWU7KG4hPT10aGlzLnNjZW5lLndpZHRofHxhIT09dGhpcy5zY2VuZS5oZWlnaHQpJiZ0aGlzLnVwZGF0ZVNjZW5lKHt3aWR0aDpuLGhlaWdodDphfSksdD8odC5zZXRBdHRyaWJ1dGUoInNjYWxlIixbcixyXSksdC5zZXRBdHRyaWJ1dGUoInRyYW5zbGF0ZSIsWy1pLC1zXSkpOih0aGlzLmZ1bGxMYXllci5zZXRBdHRyaWJ1dGUoInNjYWxlIixbcixyXSksdGhpcy5mdWxsTGF5ZXIuc2V0QXR0cmlidXRlKCJ0cmFuc2xhdGUiLFstaSwtc10pKX1hc3luYyBnZXRTbmFwc2hvdChlKXtjb25zdHtzY2VuZVBhdGg6dCxzY2VuZXM6cixjYW1lcmFPcHQ6aSx3OnMsaDpuLG1heFpJbmRleDphfT1lO2lmKHQmJnImJmkmJnRoaXMuc25hcHNob3RGdWxsTGF5ZXIpe2NvbnN0IGw9cmUodGhpcy5jYW1lcmFPcHQpO3RoaXMuc2V0Q2FtZXJhT3B0KGksdGhpcy5zbmFwc2hvdEZ1bGxMYXllciksdGhpcy5sb2NhbFdvcmsuZnVsbExheWVyPXRoaXMuc25hcHNob3RGdWxsTGF5ZXIsdGhpcy5sb2NhbFdvcmsuZHJhd0xheWVyPXRoaXMuZnVsbExheWVyO2xldCBjO2NvbnN0IHU9bmV3IE1hcDtmb3IoY29uc3RbZCxmXW9mIE9iamVjdC5lbnRyaWVzKHIpKWlmKGYhPW51bGwmJmYudHlwZSlzd2l0Y2goZj09bnVsbD92b2lkIDA6Zi50eXBlKXtjYXNlIG0uVXBkYXRlTm9kZTpjYXNlIG0uRnVsbFdvcms6e2NvbnN0e3Rvb2xzVHlwZTp3LG9wdDp5fT1mO3c9PT1TLlRleHQmJnkmJih5LnpJbmRleD15LnpJbmRleCsoYXx8MCksKHkubGluZVRocm91Z2h8fHkudW5kZXJsaW5lKSYmdS5zZXQoZCxmKSk7Y29uc3QgZz1hd2FpdCB0aGlzLmxvY2FsV29yay5ydW5GdWxsV29yayh7Li4uZixvcHQ6eSx3b3JrSWQ6ZCxtc2dUeXBlOm0uRnVsbFdvcmssZGF0YVR5cGU6Vy5TZXJ2aWNlLHZpZXdJZDp0aGlzLnZpZXdJZH0sdz09PVMuVGV4dCk7Yz1NKGMsZyk7YnJlYWt9fXRoaXMubG9jYWxXb3JrLmZ1bGxMYXllcj10aGlzLmZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dm9pZCAwO2xldCBoO3MmJm4mJihoPXtyZXNpemVXaWR0aDpzLHJlc2l6ZUhlaWdodDpufSksdS5zaXplJiYoYXdhaXQgbmV3IFByb21pc2UoZD0+e3NldFRpbWVvdXQoZCw1MDApfSksdGhpcy53aWxsUmVuZGVyU3BlY2lhbExhYmVsKHUpKSxhd2FpdCB0aGlzLmdldFNuYXBzaG90UmVuZGVyKHtzY2VuZVBhdGg6dCxjdXJDYW1lcmFPcHQ6bCxvcHRpb25zOmh9KX19d2lsbFJlbmRlclNwZWNpYWxMYWJlbChlKXt2YXIgdDtmb3IoY29uc3RbcixpXW9mIGUuZW50cmllcygpKXtjb25zdCBzPSh0PXRoaXMuc25hcHNob3RGdWxsTGF5ZXIpPT1udWxsP3ZvaWQgMDp0LmdldEVsZW1lbnRzQnlOYW1lKHIpWzBdO3MmJmkub3B0JiZ0aGlzLmxvY2FsV29yay51cGRhdGVMYWJlbHMocyxpKX19YXN5bmMgZ2V0U25hcHNob3RSZW5kZXIoZSl7dmFyIG4sYTtjb25zdHtzY2VuZVBhdGg6dCxjdXJDYW1lcmFPcHQ6cixvcHRpb25zOml9PWU7KChuPXRoaXMuc25hcHNob3RGdWxsTGF5ZXIpPT1udWxsP3ZvaWQgMDpuLnBhcmVudCkucmVuZGVyKCk7Y29uc3Qgcz1hd2FpdCB0aGlzLmdldFJlY3RJbWFnZUJpdG1hcCh7eDowLHk6MCx3OnRoaXMuc2NlbmUud2lkdGgsaDp0aGlzLnNjZW5lLmhlaWdodH0sITAsaSk7cyYmKGF3YWl0IHRoaXMucG9zdCh7c3A6W3t0eXBlOm0uU25hcHNob3Qsc2NlbmVQYXRoOnQsaW1hZ2VCaXRtYXA6c31dfSxbc10pLHMuY2xvc2UoKSwoYT10aGlzLnNuYXBzaG90RnVsbExheWVyKT09bnVsbHx8YS5yZW1vdmVBbGxDaGlsZHJlbigpLHRoaXMuc2V0Q2FtZXJhT3B0KHIsdGhpcy5mdWxsTGF5ZXIpKX1hc3luYyBnZXRCb3VuZGluZ1JlY3QoZSl7Y29uc3R7c2NlbmVQYXRoOnQsc2NlbmVzOnIsY2FtZXJhT3B0Oml9PWU7aWYodCYmciYmaSYmdGhpcy5zbmFwc2hvdEZ1bGxMYXllcil7Y29uc3Qgcz1yZSh0aGlzLmNhbWVyYU9wdCk7dGhpcy5zZXRDYW1lcmFPcHQoaSx0aGlzLnNuYXBzaG90RnVsbExheWVyKSx0aGlzLmxvY2FsV29yay5mdWxsTGF5ZXI9dGhpcy5zbmFwc2hvdEZ1bGxMYXllcix0aGlzLmxvY2FsV29yay5kcmF3TGF5ZXI9dGhpcy5kcmF3TGF5ZXI7bGV0IG47Zm9yKGNvbnN0W2EsbF1vZiBPYmplY3QuZW50cmllcyhyKSlpZihsIT1udWxsJiZsLnR5cGUpc3dpdGNoKGw9PW51bGw/dm9pZCAwOmwudHlwZSl7Y2FzZSBtLlVwZGF0ZU5vZGU6Y2FzZSBtLkZ1bGxXb3JrOntjb25zdCBjPWF3YWl0IHRoaXMubG9jYWxXb3JrLnJ1bkZ1bGxXb3JrKHsuLi5sLHdvcmtJZDphLG1zZ1R5cGU6bS5GdWxsV29yayxkYXRhVHlwZTpXLlNlcnZpY2Usdmlld0lkOnRoaXMudmlld0lkfSk7bj1NKG4sYyk7YnJlYWt9fW4mJmF3YWl0IHRoaXMucG9zdCh7c3A6W3t0eXBlOm0uQm91bmRpbmdCb3gsc2NlbmVQYXRoOnQscmVjdDpufV19KSx0aGlzLmxvY2FsV29yay5mdWxsTGF5ZXI9dGhpcy5mdWxsTGF5ZXIsdGhpcy5sb2NhbFdvcmsuZHJhd0xheWVyPXZvaWQgMCx0aGlzLnNuYXBzaG90RnVsbExheWVyLnJlbW92ZUFsbENoaWxkcmVuKCksdGhpcy5zZXRDYW1lcmFPcHQocyx0aGlzLmZ1bGxMYXllcil9fX1jb25zdCB5cD1zZWxmO25ldyBkcCh5cCxXZS5TdWIpfSkoc3ByaXRlanMpOwo=", BG = (t) => Uint8Array.from(atob(t), (l) => l.charCodeAt(0)), Ec = typeof window < "u" && window.Blob && new Blob([BG(gt)], { type: "text/javascript;charset=utf-8" });
function OG(t) {
  let l;
  try {
    if (l = Ec && (window.URL || window.webkitURL).createObjectURL(Ec), !l)
      throw "";
    const e = new Worker(l, {
      name: t == null ? void 0 : t.name
    });
    return e.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(l);
    }), e;
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
  static dispatch(l, e, c) {
    var d;
    (d = yl.InternalMsgEmitter) == null || d.emit([l, e], c);
  }
  get serviceColloctor() {
    return this.control.collector;
  }
  registerForMainEngine(l, e) {
    return this.emtType = l, this.control = e, this.mainEngine = e.worker, this.mainEngine.internalMsgEmitter.on([this.emtType, this.emitEventType], this.collect.bind(this)), this;
  }
  destroy() {
    this.emtType && this.mainEngine && this.mainEngine.internalMsgEmitter.off([this.emtType, this.emitEventType], this.collect.bind(this));
  }
  collectForLocalWorker(l) {
    var e, c, d;
    for (const [b, s] of l)
      (e = this.mainEngine) == null || e.queryTaskBatchData(s).forEach((a) => {
        var i;
        (i = this.mainEngine) == null || i.taskBatchData.delete(a);
      }), (c = this.mainEngine) == null || c.taskBatchData.add(b);
    (d = this.mainEngine) == null || d.runAnimation();
  }
  collectForServiceWorker(l) {
    _l(() => {
      l.forEach((e) => {
        var b, s, a;
        (b = this.serviceColloctor) == null || b.dispatch(e);
        const { viewId: c, undoTickerId: d } = e;
        d && c && ((a = (s = this.mainEngine) == null ? void 0 : s.internalMsgEmitter) == null || a.emit("undoTickerEnd", d, c));
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
    const { workId: e, isActive: c, viewId: d } = l, b = this.control.viewContainerManager.getView(d);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [], i = [];
    e === z && a.push([{
      workId: e,
      msgType: M.UpdateNode,
      dataType: Q.Local,
      isActiveZIndex: c,
      emitEventType: this.emitEventType,
      willRefreshSelector: !0,
      willSyncService: !1,
      viewId: d,
      scenePath: s
    }, {
      workId: e,
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
    const { workIds: e, viewId: c } = l, d = this.control.viewContainerManager.getView(c);
    if (!(d != null && d.displayer))
      return;
    const b = d.focusScenePath;
    for (const a of e) {
      const i = a.toString(), o = this.serviceColloctor.isLocalId(i) ? this.serviceColloctor.transformKey(a) : i, Z = (s = this.serviceColloctor.getStorageData(c, b)) == null ? void 0 : s[o];
      if (Z) {
        if (a === z) {
          const G = Z && this.copySelector({
            viewId: c,
            store: Z
          });
          G && this.pasteSelector({
            ...G,
            viewId: c,
            scenePath: b
          });
          break;
        }
        if (Z.toolsType === y.Text && Z.opt && Z.opt.workState && Z.opt.workState !== L.Done) {
          const G = Z && this.copyText({
            viewId: c,
            store: Z
          });
          G && this.pasteText({
            ...G,
            viewId: c,
            scenePath: b,
            key: o,
            store: Z
          });
          break;
        }
      }
    }
  }
  copyText(l) {
    const { viewId: e, store: c } = l, d = this.control.viewContainerManager.getView(e);
    if (!this.serviceColloctor || !d)
      return;
    const b = d == null ? void 0 : d.cameraOpt, s = b && [b.centerX, b.centerY], a = c.opt, i = a.boxPoint && a.boxSize && [a.boxPoint[0] + a.boxSize[0] / 2, a.boxPoint[1] + a.boxSize[1] / 2];
    return {
      bgCenter: s,
      textCenter: i
    };
  }
  pasteText(l) {
    var X, V;
    const { bgCenter: e, textCenter: c, store: d, key: b, viewId: s, scenePath: a } = l, i = this.control.viewContainerManager.getView(s);
    if (!this.serviceColloctor || !i)
      return;
    const n = Math.floor(Math.random() * 30 + 1), o = Date.now(), Z = ((X = i.cameraOpt) == null ? void 0 : X.scale) || 1, G = e && c && [e[0] - c[0] + n, e[1] - c[1] + n] || [n / Z, n / Z], p = (this.serviceColloctor.isLocalId(b) ? b : this.serviceColloctor.getLocalId(b.toString())) + "-" + o;
    if (this.mainEngine.internalMsgEmitter.emit("undoTickerStart", o, s), d.toolsType === y.Text && d.opt) {
      const u = d.opt;
      if (u && u.boxPoint && u.text) {
        u.workState = L.Done;
        const r = u.boxPoint;
        u.boxPoint = [r[0] + G[0], r[1] + G[1]], u.workState = L.Done;
        const W = this.control.viewContainerManager.transformToOriginPoint(u.boxPoint, s);
        this.control.textEditorManager.createTextForMasterController({
          workId: p,
          x: W[0],
          y: W[1],
          opt: u,
          scale: ((V = i.cameraOpt) == null ? void 0 : V.scale) || 1,
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
          undoTickerId: o
        }]);
      }
    }
  }
  copySelector(l) {
    var p, X, V, u, r, W, x, Y;
    const { viewId: e, store: c } = l, d = this.control.viewContainerManager.getView(e), b = c.selectIds;
    if (!this.serviceColloctor || !(b != null && b.length) || !d)
      return;
    const s = /* @__PURE__ */ new Map(), a = {
      offset: {
        x: 0,
        y: 0
      },
      cameraOpt: {
        centerX: ((p = d.cameraOpt) == null ? void 0 : p.centerX) || 0,
        centerY: ((X = d.cameraOpt) == null ? void 0 : X.centerY) || 0,
        scale: ((V = d.cameraOpt) == null ? void 0 : V.scale) || 1
      }
    }, i = (u = d.displayer.canvasBgRef.current) == null ? void 0 : u.getBoundingClientRect(), n = (W = (r = d.displayer) == null ? void 0 : r.floatBarCanvasRef.current) == null ? void 0 : W.getBoundingClientRect(), o = i && [i.x + i.width / 2, i.y + i.height / 2], Z = n && [n.x + n.width / 2, n.y + n.height / 2], G = o && d.viewData && d.viewData.convertToPointInWorld({ x: o[0], y: o[1] }), m = Z && d.viewData && d.viewData.convertToPointInWorld({ x: Z[0], y: Z[1] });
    G && m && (a.offset = {
      x: G.x - m.x,
      y: G.y - m.y
    });
    for (const N of b) {
      const T = (Y = (x = this.serviceColloctor) == null ? void 0 : x.getStorageData(d.id, d.focusScenePath)) == null ? void 0 : Y[N];
      T && s.set(N, T);
    }
    return {
      copyStores: s,
      copyCoordInfo: a
    };
  }
  pasteSelector(l) {
    var X;
    const { copyStores: e, copyCoordInfo: c, viewId: d, scenePath: b } = l, s = this.control.viewContainerManager.getView(d);
    if (!e.size || !this.serviceColloctor || !s)
      return;
    const { offset: a, cameraOpt: i } = c, { scale: n } = i, o = Math.floor(Math.random() * 30 + 1), Z = [a.x + o, a.y + o], G = Date.now(), m = [], p = [];
    this.mainEngine.internalMsgEmitter.emit("undoTickerStart", G, d);
    for (const [V, u] of e.entries()) {
      const W = (this.serviceColloctor.isLocalId(V) ? V : this.serviceColloctor.getLocalId(V.toString())) + "-" + G, x = { useAnimation: !1 };
      if (u.toolsType === y.Text && u.opt) {
        const Y = u.opt;
        if (Y && Y.boxPoint && Y.text) {
          Y.workState = L.Done;
          const N = Y.boxPoint;
          Y.boxPoint = [N[0] + Z[0], N[1] + Z[1]], Y.workState = L.Done;
          const T = this.control.viewContainerManager.transformToOriginPoint(Y.boxPoint, d);
          this.control.textEditorManager.createTextForMasterController({
            workId: W,
            x: T[0],
            y: T[1],
            opt: Y,
            scale: ((X = s.cameraOpt) == null ? void 0 : X.scale) || 1,
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
          workId: W,
          viewId: d,
          scenePath: b,
          undoTickerId: G
        });
        continue;
      }
      if (u.toolsType === y.Image && (u.opt.uuid = W, u.opt.centerX = u.opt.centerX + Z[0], u.opt.centerY = u.opt.centerY + Z[1]), u.ops) {
        const Y = Mm(u.ops).map((T, I) => {
          const C = I % 3;
          return C === 0 ? T + Z[0] : C === 1 ? T + Z[1] : T;
        }), N = Tm(Y);
        u.ops = N;
      }
      p.push({
        ...u,
        updateNodeOpt: x,
        type: M.FullWork,
        workId: W,
        viewId: d,
        scenePath: b,
        undoTickerId: G
      }), m.push([{
        ...u,
        updateNodeOpt: x,
        workId: W,
        msgType: M.FullWork,
        dataType: Q.Local,
        emitEventType: R.CopyNode,
        willSyncService: !1,
        willRefresh: !0,
        viewId: d,
        undoTickerId: G
      }, { workId: W, msgType: M.FullWork, emitEventType: R.CopyNode }]);
    }
    m.length && this.collectForLocalWorker(m), p.length && this.collectForServiceWorker(p);
  }
}
function ve(t, l, e) {
  return "#" + ((t << 16) + (l << 8) + e).toString(16).padStart(6, "0");
}
function ul(t, l = 1) {
  return "rgba(" + parseInt("0x" + t.slice(1, 3)) + "," + parseInt("0x" + t.slice(3, 5)) + "," + parseInt("0x" + t.slice(5, 7)) + "," + l + ")";
}
function Ge(t, l, e, c = 1) {
  return `rgba(${t},${l},${e},${c})`;
}
function dc(t) {
  const l = t.split(","), e = parseInt(l[0].split("(")[1]), c = parseInt(l[1]), d = parseInt(l[2]), b = Number(l[3].split(")")[0]);
  return [ve(e, c, d), b];
}
function ue(t) {
  const l = t.split(","), e = parseInt(l[0].split("(")[1]), c = parseInt(l[1]), d = parseInt(l[2]), b = Number(l[3].split(")")[0]);
  return [e, c, d, b];
}
function Ac(t) {
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
  setTextColor(l, e, c, d) {
    const { fontColor: b, fontBgColor: s } = c;
    e.opt && (b && (e.opt.fontColor = b), s && (e.opt.fontColor = s), this.control.textEditorManager.updateTextForMasterController({
      workId: l,
      opt: e.opt,
      viewId: d,
      canSync: !0,
      canWorker: !0
    }));
  }
  collect(l) {
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: e, strokeColor: c, fillColor: d, fontColor: b, fontBgColor: s, viewId: a } = l, i = this.control.viewContainerManager.getView(a);
    if (!(i != null && i.displayer))
      return;
    const n = i.focusScenePath, o = [...e], Z = this.serviceColloctor.storage, G = [], m = {};
    for (; o.length; ) {
      const p = o.pop();
      if (!p)
        continue;
      const X = p.toString(), V = this.serviceColloctor.isLocalId(X), u = V ? this.serviceColloctor.transformKey(p) : X;
      let r = X;
      !V && this.serviceColloctor.isOwn(r) && (r = this.serviceColloctor.getLocalId(r));
      const W = Z[a][n][u] || void 0;
      if (W) {
        const x = W.updateNodeOpt || {};
        if (b || s) {
          if (b) {
            x.fontColor = b;
            const [N, T, I, C] = ue(b);
            m.textColor = [N, T, I], m.textOpacity = C;
          }
          if (s) {
            x.fontBgColor = s;
            const [N, T, I, C] = ue(s);
            m.textBgColor = [N, T, I], m.textBgOpacity = C;
          }
          if (W.toolsType === y.Text && W.opt) {
            this.setTextColor(r, sl(W), x, a);
            continue;
          }
        }
        if (c) {
          x.strokeColor = c;
          const [N, T, I, C] = ue(c);
          m.strokeColor = [N, T, I], m.strokeOpacity = C;
        }
        if (d)
          if (x.fillColor = Ac(d) ? "transparent" : d, Ac(d))
            m.fillColor = void 0, m.fillOpacity = void 0;
          else {
            const [N, T, I, C] = ue(d);
            m.fillColor = [N, T, I], m.fillOpacity = C;
          }
        const Y = {
          workId: r,
          msgType: M.UpdateNode,
          dataType: Q.Local,
          updateNodeOpt: x,
          emitEventType: this.emitEventType,
          willRefresh: !0,
          willRefreshSelector: !0,
          willSyncService: !0,
          textUpdateForWoker: !0,
          viewId: a
          // undoTickerId
        };
        G.push([Y, {
          workId: r,
          msgType: M.UpdateNode,
          emitEventType: this.emitEventType
        }]);
      }
    }
    G.length && this.collectForLocalWorker(G), Object.keys(m).length && setTimeout(() => {
      var p;
      (p = this.control.room) == null || p.setMemberState(m);
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
    const { workIds: e, layer: c, viewId: d } = l, b = this.control.viewContainerManager.getView(d);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [...e], i = this.serviceColloctor.storage, n = [], o = [];
    for (; a.length; ) {
      const G = a.pop();
      if (!G)
        continue;
      const m = G.toString(), p = this.serviceColloctor.isLocalId(m), X = p ? this.serviceColloctor.transformKey(G) : m;
      let V = m;
      !p && this.serviceColloctor.isOwn(V) && (V = this.serviceColloctor.getLocalId(V));
      const u = sl(i[d][s][X]);
      let r;
      if (u && V === z) {
        if (u.selectIds) {
          o.push(...u.selectIds), o.sort((N, T) => {
            var w, v, g, j;
            const I = ((v = (w = i[Z(N, this.serviceColloctor)]) == null ? void 0 : w.opt) == null ? void 0 : v.zIndex) || 0, C = ((j = (g = i[Z(N, this.serviceColloctor)]) == null ? void 0 : g.opt) == null ? void 0 : j.zIndex) || 0;
            return I > C ? 1 : N < T ? -1 : 0;
          });
          const W = u.updateNodeOpt || {};
          W.zIndexLayer = c;
          const x = {
            workId: G,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: W,
            emitEventType: this.emitEventType,
            willRefreshSelector: !0,
            willSyncService: !0,
            viewId: d
          }, Y = /* @__PURE__ */ new Map();
          c === Pl.Top ? (this.addMaxLayer(), r = this.max) : (this.addMinLayer(), r = this.min), o.forEach((N) => {
            var w, v, g;
            const T = (w = this.serviceColloctor) == null ? void 0 : w.isLocalId(N);
            let I = T && ((v = this.serviceColloctor) == null ? void 0 : v.transformKey(N)) || N;
            const C = i[d][s][I];
            !T && ((g = this.serviceColloctor) != null && g.isOwn(I)) && (I = this.serviceColloctor.getLocalId(I)), W.zIndex = r, C != null && C.opt && (C.opt.zIndex = r), C != null && C.opt && Y.set(I, {
              updateNodeOpt: C.updateNodeOpt,
              opt: C.opt
            });
          }), x.selectStore = Y, x.willSerializeData = !0, n.push([x, {
            workId: G,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
        continue;
      }
    }
    n.length && this.collectForLocalWorker(n);
    function Z(G, m) {
      return m.isLocalId(G) && m.transformKey(G) || G;
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
    var X, V, u, r;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: e, position: c, workState: d, viewId: b } = l, s = this.control.viewContainerManager.getView(b);
    if (!(s != null && s.displayer))
      return;
    const a = s.focusScenePath, i = [...e], n = (X = this.serviceColloctor) == null ? void 0 : X.storage, o = [], Z = (V = s.displayer.canvasBgRef.current) == null ? void 0 : V.getBoundingClientRect(), G = (r = (u = s.displayer) == null ? void 0 : u.floatBarCanvasRef.current) == null ? void 0 : r.getBoundingClientRect();
    let m = !1;
    const p = d === L.Start && Date.now() || void 0;
    for (p && (this.undoTickerId = p, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", p, b)), Z && G && this.oldRect && (this.oldRect.x < Z.x && G.x > this.oldRect.x || this.oldRect.y < Z.y && G.y > this.oldRect.y || this.oldRect.x + this.oldRect.width > Z.x + Z.width && G.x < this.oldRect.x || this.oldRect.y + this.oldRect.height > Z.y + Z.height && G.y < this.oldRect.y) && (m = !0), G && (this.oldRect = G); i.length; ) {
      const W = i.pop();
      if (!W)
        continue;
      const x = W.toString(), Y = this.serviceColloctor.isLocalId(x), N = Y && this.serviceColloctor.transformKey(W) || x;
      let T = x;
      !Y && this.serviceColloctor.isOwn(T) && (T = this.serviceColloctor.getLocalId(T));
      const I = n[b][a][N];
      if (I && T === z) {
        if (I.selectIds && (d === L.Start && (this.cachePosition = c), this.cachePosition)) {
          const C = I.updateNodeOpt || {};
          C.translate = [c.x - this.cachePosition.x, c.y - this.cachePosition.y], C.workState = d;
          const w = {
            workId: W,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: C,
            emitEventType: this.emitEventType,
            willRefreshSelector: m,
            willSyncService: !0,
            textUpdateForWoker: !1,
            viewId: b
          };
          d === L.Done && (w.willRefreshSelector = !0, w.textUpdateForWoker = !0, w.willSerializeData = !0, w.undoTickerId = this.undoTickerId, this.cachePosition = void 0), o.push([w, {
            workId: W,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
        continue;
      }
    }
    d === L.Start ? this.mainEngine.unWritable() : d === L.Done && this.mainEngine.abled(), o.length && this.collectForLocalWorker(o);
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
    const { workIds: e, viewId: c } = l, d = this.control.viewContainerManager.getView(c);
    if (!(d != null && d.displayer))
      return;
    const b = d.focusScenePath, s = this.serviceColloctor.storage, a = [...e], i = [], n = [], o = Date.now();
    for (; a.length; ) {
      const Z = a.pop();
      if (!Z)
        continue;
      const G = Z.toString(), m = this.serviceColloctor.isLocalId(G), p = m ? this.serviceColloctor.transformKey(Z) : G, X = s[c][b][p];
      if (X) {
        let V = G;
        if (!m && this.serviceColloctor.isOwn(V) && (V = this.serviceColloctor.getLocalId(V)), X.toolsType === y.Text) {
          this.control.textEditorManager.delete(V, !0, !0);
          continue;
        }
        n.push(V);
      }
    }
    n.length && (i.push([{
      msgType: M.RemoveNode,
      emitEventType: R.DeleteNode,
      removeIds: n,
      dataType: Q.Local,
      willSyncService: !0,
      willRefresh: !0,
      undoTickerId: o,
      viewId: c
    }, void 0]), this.mainEngine.internalMsgEmitter.emit("undoTickerStart", o, c), this.collectForLocalWorker(i));
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
    var m, p, X, V, u;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: e, box: c, workState: d, viewId: b, dir: s } = l, a = this.control.viewContainerManager.getView(b);
    if (!(a != null && a.displayer))
      return;
    const i = a.focusScenePath, n = [...e], o = (m = this.serviceColloctor) == null ? void 0 : m.storage, Z = [], G = d === L.Start && Date.now() || void 0;
    for (G && (this.undoTickerId = G, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", G, b)); n.length; ) {
      const r = n.pop();
      if (!r)
        continue;
      const W = r.toString(), x = this.serviceColloctor.isLocalId(W), Y = x && this.serviceColloctor.transformKey(r) || W;
      let N = W;
      !x && this.serviceColloctor.isOwn(N) && (N = this.serviceColloctor.getLocalId(N));
      const T = o[b][i][Y];
      if (T && N === z && T.selectIds) {
        const I = T.updateNodeOpt || {};
        if (I.dir = s, I.box = c, I.workState = d, d === L.Start && c) {
          for (const w of T.selectIds) {
            const v = (p = this.serviceColloctor) == null ? void 0 : p.isLocalId(w), g = v && ((X = this.serviceColloctor) == null ? void 0 : X.transformKey(w)) || w;
            let j = g;
            !v && ((V = this.serviceColloctor) != null && V.isOwn(g)) && (j = this.serviceColloctor.getLocalId(g));
            const ll = this.control.textEditorManager.get(j);
            ll && d === L.Start && this.targetText.set(j, sl(ll));
          }
          this.targetText.size && this.targetBox.set(N, c);
        }
        if (this.targetText.size && d !== L.Start) {
          const w = this.targetBox.get(N);
          if (w) {
            const v = [c.w / w.w, c.h / w.h];
            for (const [g, j] of this.targetText.entries()) {
              const { opt: ll } = j, $ = Math.floor(ll.fontSize * v[0]), q = this.cacheTextInfo.get(g), O = !q && ll.fontSize !== $ || q && q.fontSize !== $ || !1, E = (u = this.control.textEditorManager.get(g)) == null ? void 0 : u.opt;
              if (O && E && ll.boxSize && ll.boxPoint) {
                const J = await this.control.textEditorManager.updateTextControllerWithEffectAsync({
                  workId: g,
                  opt: { ...E, fontSize: $ },
                  viewId: b,
                  canSync: !1,
                  canWorker: !1
                });
                J && this.cacheTextInfo.set(g, {
                  fontSize: J.opt.fontSize,
                  boxSize: J.opt.boxSize,
                  boxPoint: J.opt.boxPoint
                });
              }
            }
            I.textInfos = this.cacheTextInfo;
          }
        }
        const C = {
          workId: r,
          msgType: M.UpdateNode,
          dataType: Q.Local,
          updateNodeOpt: I,
          emitEventType: this.emitEventType,
          willRefreshSelector: !0,
          willSyncService: !0,
          viewId: b
        };
        d === L.Done && (C.willSerializeData = !0, C.undoTickerId = this.undoTickerId, this.targetBox.delete(N), this.targetText.clear()), Z.push([C, {
          workId: r,
          msgType: M.UpdateNode,
          emitEventType: this.emitEventType
        }]);
        continue;
      }
    }
    d === L.Start ? this.mainEngine.unWritable() : d === L.Done && this.mainEngine.abled(), Z.length && this.collectForLocalWorker(Z);
  }
}
class eu extends Ll {
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
    var G, m, p, X, V;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: e, angle: c, workState: d, viewId: b } = l, s = this.control.viewContainerManager.getView(b);
    if (!(s != null && s.displayer))
      return;
    const a = s.focusScenePath, i = [...e], n = (G = this.serviceColloctor) == null ? void 0 : G.storage, o = [], Z = d === L.Start && Date.now() || void 0;
    for (Z && (this.undoTickerId = Z, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", Z, b)); i.length; ) {
      const u = i.pop();
      if (!u)
        continue;
      const r = u.toString(), W = this.serviceColloctor.isLocalId(r), x = W && this.serviceColloctor.transformKey(u) || r;
      let Y = r;
      !W && this.serviceColloctor.isOwn(Y) && (Y = this.serviceColloctor.getLocalId(Y));
      const N = n[b][a][x];
      if (N && Y === z) {
        if (((m = N.selectIds) == null ? void 0 : m.length) === 1) {
          const T = N.selectIds[0];
          if (d === L.Start) {
            const v = ((p = this.serviceColloctor) == null ? void 0 : p.isLocalId(T)) && ((X = this.serviceColloctor) == null ? void 0 : X.transformKey(T)) || T, g = n[b][a][v];
            this.cacheOriginRotate = ((V = g == null ? void 0 : g.opt) == null ? void 0 : V.rotate) || 0;
          }
          const I = N.updateNodeOpt || {};
          I.angle = (c + this.cacheOriginRotate) % 360, I.workState = d;
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
          d === L.Done && (C.willRefreshSelector = !0, C.willSerializeData = !0, C.undoTickerId = this.undoTickerId, this.cacheOriginRotate = 0), o.push([C, {
            workId: u,
            msgType: M.UpdateNode,
            emitEventType: this.emitEventType
          }]);
        }
        continue;
      }
    }
    d === L.Start ? this.mainEngine.unWritable() : d === L.Done && this.mainEngine.abled(), o.length && this.collectForLocalWorker(o);
  }
}
function cu(t) {
  switch (t) {
    case y.Text:
      return Rl.Text;
    case y.SpeechBalloon:
    case y.Star:
    case y.Ellipse:
    case y.Rectangle:
    case y.Triangle:
    case y.Rhombus:
    case y.Polygon:
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
  setTextStyle(l, e, c, d, b) {
    const { bold: s, underline: a, lineThrough: i, italic: n, fontSize: o } = c;
    if (e.toolsType) {
      const Z = cu(e.toolsType);
      Z === Rl.Text && (e.opt && (s && (e.opt.bold = s), Vl(a) && (e.opt.underline = a), Vl(i) && (e.opt.lineThrough = i), n && (e.opt.italic = n), o && (e.opt.fontSize = o)), this.control.textEditorManager.updateTextForMasterController({
        workId: l,
        opt: e.opt,
        viewId: d,
        canSync: !0,
        canWorker: !0
      }, b)), Rl.Shape;
    }
  }
  collect(l) {
    var p, X, V, u;
    if (!this.serviceColloctor || !this.mainEngine)
      return;
    const { workIds: e, bold: c, italic: d, lineThrough: b, underline: s, viewId: a, fontSize: i } = l, n = this.control.viewContainerManager.getView(a);
    if (!(n != null && n.displayer))
      return;
    const o = n.focusScenePath, Z = [...e], G = this.serviceColloctor.storage, m = {};
    for (; Z.length; ) {
      const r = Z.pop();
      if (!r)
        continue;
      const W = r.toString(), x = this.serviceColloctor.isLocalId(W), Y = x ? this.serviceColloctor.transformKey(r) : W;
      let N = W;
      !x && this.serviceColloctor.isOwn(N) && (N = this.serviceColloctor.getLocalId(N));
      const T = G[a][o][Y] || void 0;
      if (T) {
        const I = T.updateNodeOpt || {};
        if (c && (I.bold = c, m.bold = c === "bold"), d && (I.italic = d, m.italic = d === "italic"), Vl(b) && (I.lineThrough = b, m.lineThrough = b), Vl(s) && (I.underline = s, m.underline = s), i && (I.fontSize = i, m.textSize = i), T.toolsType === y.Text && T.opt) {
          this.setTextStyle(N, sl(T), I, a);
          continue;
        }
        if (T && N === z && ((p = T.selectIds) != null && p.length))
          for (const C of T.selectIds) {
            const w = (X = this.serviceColloctor) == null ? void 0 : X.isLocalId(C);
            let v = w && ((V = this.serviceColloctor) == null ? void 0 : V.transformKey(C)) || C;
            const g = G[a][o][v] || void 0;
            if (!w && ((u = this.serviceColloctor) != null && u.isOwn(v)) && (v = this.serviceColloctor.getLocalId(v)), g && g.toolsType === y.Text && T.opt) {
              this.setTextStyle(v, sl(g), I, a);
              continue;
            }
          }
      }
    }
    Object.keys(m).length && setTimeout(() => {
      var r;
      (r = this.control.room) == null || r.setMemberState(m);
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
    const { workId: e, pointMap: c, workState: d, viewId: b } = l, s = this.control.viewContainerManager.getView(b);
    if (!(s != null && s.displayer))
      return;
    const a = s.focusScenePath, i = (u = this.serviceColloctor) == null ? void 0 : u.storage, n = [], o = d === L.Start && Date.now() || void 0;
    o && (this.undoTickerId = o, this.mainEngine.internalMsgEmitter.emit("undoTickerStart", o, b));
    const Z = e;
    if (!Z)
      return;
    const G = Z.toString(), m = this.serviceColloctor.isLocalId(G), p = m && this.serviceColloctor.transformKey(Z) || G;
    let X = G;
    !m && this.serviceColloctor.isOwn(X) && (X = this.serviceColloctor.getLocalId(X));
    const V = i[b][a][p];
    if (V && X === z && V.selectIds) {
      const r = V.updateNodeOpt || {};
      r.pointMap = c, r.workState = d;
      const W = {
        workId: Z,
        msgType: M.UpdateNode,
        dataType: Q.Local,
        updateNodeOpt: r,
        emitEventType: this.emitEventType,
        willRefreshSelector: !0,
        willSyncService: !0,
        viewId: b
      };
      d === L.Done && (W.undoTickerId = this.undoTickerId), n.push([W, {
        workId: Z,
        msgType: M.UpdateNode,
        emitEventType: this.emitEventType
      }]);
    }
    d === L.Start ? this.mainEngine.unWritable() : d === L.Done && this.mainEngine.abled(), n.length && this.collectForLocalWorker(n);
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
    const { workIds: e, isLocked: c, viewId: d } = l, b = this.control.viewContainerManager.getView(d);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [...e], i = this.serviceColloctor.storage, n = [], o = Date.now();
    for (; a.length; ) {
      const Z = a.pop();
      if (!Z)
        continue;
      const G = Z.toString(), m = this.serviceColloctor.isLocalId(G), p = m ? this.serviceColloctor.transformKey(Z) : G;
      let X = G;
      !m && this.serviceColloctor.isOwn(X) && (X = this.serviceColloctor.getLocalId(X));
      const V = i[d][s][p] || void 0;
      if (V) {
        const u = V.updateNodeOpt || {};
        u.isLocked = c;
        const r = {
          workId: X,
          msgType: M.UpdateNode,
          dataType: Q.Local,
          updateNodeOpt: u,
          emitEventType: this.emitEventType,
          willRefresh: !0,
          willRefreshSelector: !0,
          willSyncService: !0,
          viewId: d
        };
        n.push([r, {
          workId: X,
          msgType: M.UpdateNode,
          emitEventType: this.emitEventType
        }]);
      }
    }
    this.mainEngine.internalMsgEmitter.emit("undoTickerStart", o, d), n.length && this.collectForLocalWorker(n);
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
    const { workIds: e, viewId: c, ...d } = l, b = this.control.viewContainerManager.getView(c);
    if (!(b != null && b.displayer))
      return;
    const s = b.focusScenePath, a = [...e], i = this.serviceColloctor.storage, n = [];
    for (; a.length; ) {
      const o = a.pop();
      if (!o)
        continue;
      const Z = o.toString(), G = this.serviceColloctor.isLocalId(Z), m = G ? this.serviceColloctor.transformKey(o) : Z;
      let p = Z;
      !G && this.serviceColloctor.isOwn(p) && (p = this.serviceColloctor.getLocalId(p));
      const X = i[c][s][m] || void 0;
      if (X) {
        const V = {
          ...X.updateNodeOpt,
          ...d,
          willRefresh: !0
        };
        if (X && p === z) {
          const u = {
            workId: p,
            msgType: M.UpdateNode,
            dataType: Q.Local,
            updateNodeOpt: V,
            emitEventType: this.emitEventType,
            willRefresh: !0,
            willRefreshSelector: !0,
            willSyncService: !0,
            viewId: c
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
class f {
  constructor(l) {
    Object.defineProperty(this, "builders", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), this.builders = new Map(l.map((e) => [e, this.build(e)]));
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
        return new eu();
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
  registerForMainEngine(l, e) {
    return this.builders.forEach((c) => {
      c && c.registerForMainEngine(l, e);
    }), this;
  }
  destroy() {
    this.builders.forEach((l) => {
      l && l.destroy();
    });
  }
  static emitMethod(l, e, c) {
    Ll.dispatch(l, e, c);
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
    }), Object.defineProperty(this, "localPointsBatchData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
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
    }), Object.defineProperty(this, "localEventTimerId", {
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
    const { control: e, internalMsgEmitter: c } = l;
    this.control = e, this.maxLastSyncTime = (((b = (d = this.control.pluginOptions) == null ? void 0 : d.syncOpt) == null ? void 0 : b.interval) || this.maxLastSyncTime) * 0.5, this.internalMsgEmitter = c, this.currentLocalWorkData = { workState: L.Pending };
  }
  get viewContainerManager() {
    return this.control.viewContainerManager;
  }
  get collector() {
    return this.control.collector;
  }
  get isRunSubWork() {
    var e;
    const l = (e = this.currentToolsData) == null ? void 0 : e.toolsType;
    return l === y.Pencil || l === y.LaserPen || l === y.Arrow || l === y.Straight || l === y.Ellipse || l === y.Rectangle || l === y.Star || l === y.Polygon || l === y.SpeechBalloon;
  }
  get isCanDrawWork() {
    var e;
    const l = (e = this.currentToolsData) == null ? void 0 : e.toolsType;
    return l === y.Pencil || l === y.LaserPen || l === y.Arrow || l === y.Straight || l === y.Ellipse || l === y.Rectangle || l === y.Star || l === y.Polygon || l === y.SpeechBalloon || l === y.Triangle || l === y.Rhombus;
  }
  get isUseZIndex() {
    var e;
    const l = (e = this.currentToolsData) == null ? void 0 : e.toolsType;
    return l === y.Pencil || l === y.Arrow || l === y.Straight || l === y.Ellipse || l === y.Rectangle || l === y.Star || l === y.Polygon || l === y.SpeechBalloon || l === y.Text || l === y.Image;
  }
  get isCanRecordUndoRedo() {
    var e;
    const l = (e = this.currentToolsData) == null ? void 0 : e.toolsType;
    return l === y.Pencil || l === y.Eraser || l === y.Arrow || l === y.Straight || l === y.Ellipse || l === y.Rectangle || l === y.Star || l === y.Polygon || l === y.SpeechBalloon || l === y.Text || l === y.Image;
  }
  get isCanSentCursor() {
    var e;
    const l = (e = this.currentToolsData) == null ? void 0 : e.toolsType;
    return l === y.Pencil || l === y.Text || l === y.LaserPen || l === y.Arrow || l === y.Straight || l === y.Ellipse || l === y.Rectangle || l === y.Star || l === y.Polygon || l === y.SpeechBalloon || l === y.Triangle || l === y.Rhombus;
  }
  init() {
    this.on(), this.internalMsgEmitterListener(), this.isActive = !0;
  }
  on() {
    this.fullWorker = new QG(), this.subWorker = new OG(), this.fullWorker.onmessage = (l) => {
      if (l.data) {
        const { render: e, sp: c, drawCount: d, workerTasksqueueCount: b } = l.data;
        if (b && (this.workerTasksqueueCount = b), c != null && c.length && this.collectorSyncData(c), !d && (e != null && e.length)) {
          this.viewContainerManager.render(e);
          return;
        }
        d && (this.wokerDrawCount = d, this.wokerDrawCount < 1 / 0 ? this.maxDrawCount = Math.max(this.maxDrawCount, this.wokerDrawCount) : this.maxDrawCount = 0, e != null && e.length && (this.viewContainerManager.render(e), this.wokerDrawCount < this.subWorkerDrawCount && (this.reRenders.forEach((s) => {
          s.isUnClose = !1;
        }), this.viewContainerManager.render(this.reRenders), this.reRenders.length = 0)));
      }
    }, this.subWorker.onmessage = (l) => {
      if (l.data) {
        const { render: e, drawCount: c, sp: d } = l.data;
        if (d != null && d.length && this.collectorSyncData(d), !c && (e != null && e.length)) {
          this.viewContainerManager.render(e);
          return;
        }
        c && (this.subWorkerDrawCount = c, this.wokerDrawCount < 1 / 0 && (this.maxDrawCount = Math.max(this.maxDrawCount, this.subWorkerDrawCount)), e != null && e.length && (this.subWorkerDrawCount > this.wokerDrawCount && (e.forEach((b) => b.isUnClose = !0), this.reRenders.push(...e)), this.wokerDrawCount < 1 / 0 && this.viewContainerManager.render(e)));
      }
    };
  }
  collectorSyncData(l) {
    var c, d;
    let e = !1;
    for (const b of l) {
      const { type: s, selectIds: a, opt: i, selectRect: n, strokeColor: o, fillColor: Z, willSyncService: G, isSync: m, undoTickerId: p, imageBitmap: X, canvasHeight: V, canvasWidth: u, rect: r, op: W, canTextEdit: x, points: Y, selectorColor: N, canRotate: T, scaleType: I, textOpt: C, toolsType: w, workId: v, viewId: g, scenePath: j, dataType: ll, canLock: $, isLocked: q, shapeOpt: O, toolsTypes: E } = b;
      if (!g) {
        console.error("collectorSyncData", b);
        return;
      }
      switch (s) {
        case M.Select: {
          const J = a != null && a.length ? { ...n, selectIds: a, canvasHeight: V, canvasWidth: u, points: Y } : void 0;
          if (J && (i != null && i.strokeColor) && (J.selectorColor = i.strokeColor), J && N && (J.selectorColor = N), J && o && (J.strokeColor = o), J && (i != null && i.fillColor) && (J.fillColor = i.fillColor), J && Z && (J.fillColor = Z), J && Vl(T) && (J.canRotate = T), J && I && (J.scaleType = I), J && x && (J.canTextEdit = x), J && C && (J.textOpt = C), J && Vl($) && (J.canLock = $), J && Vl(q) && (J.isLocked = q), J && O && (J.shapeOpt = O), J && E && (J.toolsTypes = E), g && this.viewContainerManager.showFloatBar(g, !!J, J), G) {
            const K = this.viewContainerManager.getCurScenePath(g);
            (c = this.collector) == null || c.dispatch({ type: s, selectIds: a, opt: i, isSync: m, viewId: g, scenePath: K });
          }
          break;
        }
        case M.Snapshot:
          if (X && j) {
            const J = this.snapshotMap.get(j);
            J && J(X);
          }
          break;
        case M.BoundingBox:
          if (r && j) {
            const J = this.boundingRectMap.get(j);
            J && J(r);
          }
          break;
        case M.Cursor:
          W && this.control.cursor.collectServiceCursor({ ...b });
          break;
        case M.Clear:
          g && this.viewContainerManager.showFloatBar(g, !1), g && this.clearAllResolve && this.clearAllResolve(g);
          break;
        case M.TextUpdate:
          if (w === y.Text && v && g) {
            const J = this.viewContainerManager.transformToOriginPoint((i == null ? void 0 : i.boxPoint) || [0, 0], g), K = (i == null ? void 0 : i.boxSize) || [0, 0], H = (d = this.viewContainerManager.getView(g)) == null ? void 0 : d.cameraOpt;
            i ? this.control.textEditorManager.updateTextForWorker({
              x: J[0],
              y: J[1],
              w: K[0],
              h: K[1],
              scale: (H == null ? void 0 : H.scale) || 1,
              workId: v,
              opt: i,
              dataType: ll,
              viewId: g,
              canSync: G || !1,
              canWorker: !1
            }) : this.control.textEditorManager.delete(v, G || !1, !1);
          }
          break;
        case M.GetTextActive:
          w === y.Text && v && g && this.control.textEditorManager.updateTextForWorker({
            workId: v,
            isActive: !0,
            viewId: g,
            dataType: Q.Local,
            canWorker: !1,
            canSync: !0
          }, Date.now());
          break;
        default:
          e = !0;
          break;
      }
      !e && p && this.internalMsgEmitter.emit("undoTickerEnd", p, g);
    }
    e && _l(() => {
      this.collectorAsyncData(l);
    }, this.maxLastSyncTime);
  }
  collectorAsyncData(l) {
    var e, c, d, b;
    for (const s of l) {
      const { type: a, op: i, workId: n, index: o, removeIds: Z, ops: G, opt: m, updateNodeOpt: p, toolsType: X, isSync: V, undoTickerId: u, viewId: r } = s;
      if (!r) {
        console.error("collectorAsyncData", s);
        return;
      }
      switch (a) {
        case M.DrawWork: {
          const W = this.viewContainerManager.getCurScenePath(r);
          (e = this.collector) == null || e.dispatch({
            type: a,
            op: i,
            workId: n,
            index: o,
            isSync: V,
            viewId: r,
            scenePath: W
          });
          break;
        }
        case M.FullWork: {
          const W = this.viewContainerManager.getCurScenePath(r);
          (c = this.collector) == null || c.dispatch({
            type: a,
            ops: G,
            workId: n,
            updateNodeOpt: p,
            opt: m,
            toolsType: X,
            isSync: V,
            viewId: r,
            scenePath: W
          });
          break;
        }
        case M.UpdateNode: {
          const W = this.viewContainerManager.getCurScenePath(r);
          (d = this.collector) == null || d.dispatch({ type: a, updateNodeOpt: p, workId: n, opt: m, ops: G, op: i, isSync: V, viewId: r, scenePath: W });
          break;
        }
        case M.RemoveNode: {
          const W = this.viewContainerManager.getCurScenePath(r);
          Z && this.control.textEditorManager.deleteBatch(Z, !1, !1), (b = this.collector) == null || b.dispatch({ type: a, removeIds: Z, isSync: V, viewId: r, scenePath: W });
          break;
        }
      }
      u && this.internalMsgEmitter.emit("undoTickerEnd", u, r);
    }
  }
  setCurrentToolsData(l) {
    var b, s, a;
    const e = l.toolsType, c = ((b = this.currentToolsData) == null ? void 0 : b.toolsType) !== l.toolsType;
    super.setCurrentToolsData(l);
    const d = (s = this.viewContainerManager) == null ? void 0 : s.getAllViews();
    if (c) {
      for (const i of d)
        if (i) {
          const { id: n, focusScenePath: o } = i;
          c && n && o && ((a = this.collector) != null && a.hasSelector(n, o) && this.blurSelector(n, o), this.control.textEditorManager.checkEmptyTextBlur());
        }
      this.taskBatchData.add({
        msgType: M.UpdateTools,
        dataType: Q.Local,
        toolsType: e,
        opt: { ...l.toolsOpt, syncUnitTime: this.maxLastSyncTime },
        isRunSubWork: this.isRunSubWork,
        viewId: Sm
      }), this.runAnimation();
    }
  }
  setCurrentLocalWorkData(l, e = M.None) {
    var s, a;
    super.setCurrentLocalWorkData(l);
    const { workState: c, workId: d, toolsOpt: b } = l;
    if (!(c === L.Unwritable || c === L.Freeze) && e !== M.None && this.viewContainerManager.focuedView) {
      const { id: i } = this.viewContainerManager.focuedView;
      if (i) {
        const n = (s = this.currentToolsData) == null ? void 0 : s.toolsType;
        this.taskBatchData.add({
          msgType: e,
          workId: d,
          toolsType: n,
          opt: { ...(a = this.currentToolsData) == null ? void 0 : a.toolsOpt, ...b, syncUnitTime: this.maxLastSyncTime },
          dataType: Q.Local,
          isRunSubWork: this.isRunSubWork,
          viewId: i
        }), this.runAnimation();
      }
    }
  }
  createViewWorker(l, e) {
    const { offscreenCanvasOpt: c, layerOpt: d, dpr: b, cameraOpt: s } = e;
    this.taskBatchData.add({
      msgType: M.Init,
      dataType: Q.Local,
      viewId: l,
      offscreenCanvasOpt: c,
      layerOpt: d,
      dpr: b,
      cameraOpt: s,
      isRunSubWork: !0,
      isSafari: navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1
    }), this.runAnimation();
  }
  destroyViewWorker(l, e = !1) {
    var c;
    this.taskBatchData.add({
      msgType: M.Destroy,
      dataType: Q.Local,
      viewId: l,
      isRunSubWork: !0
    }), this.runAnimation(), e || (c = this.collector) == null || c.dispatch({
      type: M.Clear,
      viewId: l
    });
  }
  onServiceDerive(l, e) {
    var o, Z, G;
    const { newValue: c, oldValue: d, viewId: b, scenePath: s } = e, a = sl(c) || {}, i = l;
    let n = a.type;
    if (!(!c && d && (n = M.RemoveNode, d.toolsType === y.LaserPen))) {
      if (n && i) {
        const m = a;
        if (m.workId = (o = this.collector) != null && o.isOwn(i) ? (Z = this.collector) == null ? void 0 : Z.getLocalId(i) : i, m.msgType = n, m.dataType = Q.Service, m.viewId = b, m.scenePath = s, m.selectIds && (m.selectIds = m.selectIds.map((p) => {
          var X, V;
          return (X = this.collector) != null && X.isOwn(p) ? (V = this.collector) == null ? void 0 : V.getLocalId(p) : p;
        })), m && m.toolsType === y.Text || (d == null ? void 0 : d.toolsType) === y.Text) {
          this.control.textEditorManager.onServiceDerive(m);
          return;
        }
        this.taskBatchData.add(m);
      }
      if (this.runAnimation(), this.zIndexNodeMethod) {
        let m, p;
        e.newValue && ((G = e.newValue.opt) != null && G.zIndex) && (p = Math.max(p || 0, e.newValue.opt.zIndex), m = Math.min(m || 1 / 0, e.newValue.opt.zIndex)), p && (this.zIndexNodeMethod.maxZIndex = p), m && (this.zIndexNodeMethod.minZIndex = m);
      }
    }
  }
  pullServiceData(l, e) {
    var d, b, s, a, i, n;
    const c = ((d = this.collector) == null ? void 0 : d.storage[l]) && ((b = this.collector) == null ? void 0 : b.storage[l][e]) || void 0;
    if (c) {
      let o, Z;
      const G = Object.keys(c);
      for (const m of G) {
        const p = (s = c[m]) == null ? void 0 : s.type;
        if (p && m) {
          const X = sl(c[m]);
          if (X.workId = (a = this.collector) != null && a.isOwn(m) ? (i = this.collector) == null ? void 0 : i.getLocalId(m) : m, X.msgType = p, X.dataType = Q.Service, X.viewId = l, X.scenePath = e, X.useAnimation = !1, X.selectIds && (X.selectIds = X.selectIds.map((V) => {
            var u, r;
            return (u = this.collector) != null && u.isOwn(V) ? (r = this.collector) == null ? void 0 : r.getLocalId(V) : V;
          })), X.toolsType === y.Text) {
            this.control.textEditorManager.onServiceDerive(X);
            continue;
          }
          this.taskBatchData.add(X), (n = X.opt) != null && n.zIndex && (Z = Math.max(Z || 0, X.opt.zIndex), o = Math.min(o || 1 / 0, X.opt.zIndex));
        }
        this.internalMsgEmitter.emit("excludeIds", G, l);
      }
      this.runAnimation(), this.zIndexNodeMethod && (Z && (this.zIndexNodeMethod.maxZIndex = Z), o && (this.zIndexNodeMethod.minZIndex = o));
    }
  }
  runAnimation() {
    this.animationId || (this.animationId = requestAnimationFrame(this.consume.bind(this)));
  }
  consume() {
    this.animationId = void 0;
    const l = this.currentLocalWorkData.workState;
    let e = !1;
    if (!this.localEventTimerId && (l !== L.Pending && this.localPointsBatchData.length && (this.wokerDrawCount !== 1 / 0 && this.wokerDrawCount <= this.subWorkerDrawCount && this.cacheDrawCount < this.maxDrawCount && (e = !0), this.maxDrawCount || (e = !0), e && this.viewContainerManager.focuedViewId && (this.taskBatchData.add({
      op: this.localPointsBatchData.map((c) => c),
      workState: l,
      workId: this.currentLocalWorkData.workId,
      dataType: Q.Local,
      msgType: M.DrawWork,
      isRunSubWork: this.isRunSubWork,
      undoTickerId: l === L.Done && this.undoTickerId || void 0,
      viewId: this.viewContainerManager.focuedViewId,
      scenePath: this.viewContainerManager.focuedViewId && this.viewContainerManager.getCurScenePath(this.viewContainerManager.focuedViewId)
    }), this.clearLocalPointsBatchData(), this.cacheDrawCount = this.maxDrawCount)), this.taskBatchData.size)) {
      this.post(this.taskBatchData);
      for (const c of this.taskBatchData.values())
        if (c.msgType === M.TasksQueue) {
          this.tasksqueue.clear();
          break;
        }
      this.taskBatchData.clear(), this.undoTickerId && l === L.Done && (this.undoTickerId = void 0);
    }
    this.tasksqueue.size && this.consumeQueue(), (this.tasksqueue.size || this.taskBatchData.size || this.localPointsBatchData.length) && (this.animationId = requestAnimationFrame(this.consume.bind(this)));
  }
  unWritable() {
    this.setCurrentLocalWorkData({ workState: L.Unwritable, workId: void 0 });
  }
  unabled() {
    this.setCurrentLocalWorkData({ workState: L.Freeze, workId: void 0 });
  }
  abled() {
    this.setCurrentLocalWorkData({ workState: L.Pending, workId: void 0 });
  }
  post(l) {
    this.fullWorker.postMessage(l);
    const e = /* @__PURE__ */ new Set();
    for (const c of l.values()) {
      const d = c.msgType;
      (d === M.Init || d === M.Clear || d === M.Destroy || d === M.UpdateCamera || c.isRunSubWork) && e.add(c);
    }
    e.size && this.subWorker.postMessage(e);
  }
  destroy() {
    this.unabled(), this.taskBatchData.clear(), this.clearLocalPointsBatchData(), this.fullWorker.terminate(), this.subWorker.terminate(), this.isActive = !1;
  }
  updateNode(l, e, c, d) {
    this.taskBatchData.add({
      msgType: M.UpdateNode,
      workId: l,
      updateNodeOpt: e,
      viewId: c,
      scenePath: d,
      dataType: Q.Local
    }), this.runAnimation();
  }
  updateCamera(l, e) {
    this.useTasksqueue || (this.useTasksqueue = !0, this.mianTasksqueueCount = 1, this.workerTasksqueueCount = 1), this.useTasksqueue && (this.tasksqueue.set(l, {
      msgType: M.UpdateCamera,
      dataType: Q.Local,
      cameraOpt: e,
      isRunSubWork: !0,
      viewId: l
    }), this.control.textEditorManager.onCameraChange(e, l), this.runAnimation(), this.useTasksClockId && clearTimeout(this.useTasksClockId), this.useTasksClockId = setTimeout(() => {
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
  async clearViewScenePath(l, e) {
    var c;
    if (this.control.textEditorManager.clear(l, e), this.taskBatchData.add({
      dataType: Q.Local,
      msgType: M.Clear,
      viewId: l
    }), this.runAnimation(), !e) {
      const d = this.viewContainerManager.getCurScenePath(l);
      (c = this.collector) == null || c.dispatch({
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
    this.methodBuilder = new f([
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
  originalEventLintener(l, e, c) {
    switch (l) {
      case L.Start:
        this.onLocalEventStart(e, c, l);
        break;
      case L.Doing:
        c === this.viewContainerManager.focuedViewId && this.onLocalEventDoing(e);
        break;
      case L.Done:
        c === this.viewContainerManager.focuedViewId && this.onLocalEventEnd(e);
        break;
    }
  }
  setZIndex() {
    const l = this.currentToolsData && sl(this.currentToolsData.toolsOpt);
    return l && this.zIndexNodeMethod && this.isUseZIndex && (this.zIndexNodeMethod.addMaxLayer(), l.zIndex = this.zIndexNodeMethod.maxZIndex), l;
  }
  clearLocalPointsBatchData() {
    this.localPointsBatchData.length = 0;
  }
  onLocalEventEnd(l) {
    var c, d;
    const e = this.currentLocalWorkData.workState;
    if (!(e === L.Freeze || e === L.Unwritable) && this.viewContainerManager.focuedView) {
      const { id: b, focusScenePath: s, cameraOpt: a } = this.viewContainerManager.focuedView;
      if (e === L.Start || e === L.Doing) {
        const i = this.viewContainerManager.transformToScenePoint(l, b);
        this.pushPoint(i), this.localEventTimerId = setTimeout(() => {
          var G;
          this.localEventTimerId = void 0, this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, workState: L.Done }), this.runAnimation();
          const n = (G = this.currentLocalWorkData.workId) == null ? void 0 : G.toString(), o = b, Z = this.viewContainerManager.getCurScenePath(o);
          n && Z && this.control.runEffectWork(() => {
            this.setShapeSelectorByWorkId(n, o);
          });
        }, 0), ((c = this.currentToolsData) == null ? void 0 : c.toolsType) === y.Selector && this.viewContainerManager.activeFloatBar(b);
      } else if (((d = this.currentToolsData) == null ? void 0 : d.toolsType) === y.Text) {
        const i = this.viewContainerManager.transformToScenePoint(l, b);
        if (this.localPointsBatchData[0] === i[0] && this.localPointsBatchData[1] === i[1]) {
          const n = this.currentToolsData.toolsOpt;
          n.workState = L.Doing, n.boxPoint = i, n.boxSize = [n.fontSize, n.fontSize], this.control.textEditorManager.checkEmptyTextBlur(), this.control.textEditorManager.createTextForMasterController({
            workId: Date.now().toString(),
            x: l[0],
            y: l[1],
            scale: (a == null ? void 0 : a.scale) || 1,
            opt: n,
            type: Rl.Text,
            isActive: !0,
            viewId: b,
            scenePath: s
          }, Date.now());
        }
        this.clearLocalPointsBatchData();
      }
    }
  }
  onLocalEventDoing(l) {
    var d;
    let e = this.currentLocalWorkData.workState;
    if (e === L.Freeze || e === L.Unwritable)
      return;
    const c = this.viewContainerManager.focuedViewId;
    if (c) {
      if (e === L.Start && (e = L.Doing, this.setCurrentLocalWorkData({ ...this.currentLocalWorkData, workState: e })), e === L.Doing || this.localEventTimerId) {
        const b = this.viewContainerManager.transformToScenePoint(l, c);
        this.pushPoint(b), this.localEventTimerId || this.runAnimation();
      } else if (((d = this.currentToolsData) == null ? void 0 : d.toolsType) === y.Selector) {
        const b = this.viewContainerManager.transformToScenePoint(l, c), s = {
          msgType: M.CursorHover,
          dataType: Q.Local,
          point: b,
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
        }).forEach((a) => {
          this.taskBatchData.delete(a);
        }), this.taskBatchData.add(s), this.runAnimation();
      }
    }
  }
  onLocalEventStart(l, e, c) {
    var a, i, n, o, Z;
    if (c !== L.Start || !e)
      return;
    this.viewContainerManager.focuedViewId !== e && this.viewContainerManager.setFocuedViewId(e), this.clearLocalPointsBatchData();
    const d = this.viewContainerManager.transformToScenePoint(l, e);
    if (this.pushPoint(d), ((a = this.currentToolsData) == null ? void 0 : a.toolsType) === y.Text)
      return;
    this.control.textEditorManager.checkEmptyTextBlur();
    const b = ((i = this.currentToolsData) == null ? void 0 : i.toolsType) === y.Selector ? z : Date.now(), s = this.setZIndex();
    if (this.setCurrentLocalWorkData({
      workId: b,
      workState: L.Start,
      toolsOpt: s
    }, M.CreateWork), this.maxDrawCount = 0, this.cacheDrawCount = 0, this.wokerDrawCount = 0, this.subWorkerDrawCount = 0, this.reRenders.length = 0, this.isCanRecordUndoRedo && (this.undoTickerId = b, this.internalMsgEmitter.emit("undoTickerStart", this.undoTickerId, e)), this.isCanDrawWork) {
      const G = this.viewContainerManager.getCurScenePath(e);
      (o = this.collector) == null || o.dispatch({
        type: M.CreateWork,
        workId: b,
        toolsType: (n = this.currentToolsData) == null ? void 0 : n.toolsType,
        opt: s,
        viewId: e,
        scenePath: G
      }), G && this.blurSelector(e, G);
    } else
      ((Z = this.currentToolsData) == null ? void 0 : Z.toolsType) === y.Selector && this.viewContainerManager.unActiveFloatBar(e);
    this.consume();
  }
  pushPoint(l) {
    this.localPointsBatchData.push(l[0], l[1]);
  }
  sendCursorEvent(l, e) {
    if (!this.currentLocalWorkData || this.currentLocalWorkData.workState === L.Freeze || this.currentLocalWorkData.workState === L.Unwritable || !this.currentToolsData || !this.isCanSentCursor)
      return;
    let c = [void 0, void 0];
    this.currentToolsData && (this.isCanDrawWork || this.currentToolsData.toolsType === y.Text) && this.currentLocalWorkData.workState !== L.Start && this.currentLocalWorkData.workState !== L.Doing && (c = l, this.control.cursor.sendEvent(c, e));
  }
  getBoundingRect(l) {
    var c, d;
    if (!((c = this.boundingRectMap) == null ? void 0 : c.get(l))) {
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
  getSnapshot(l, e, c, d) {
    var s, a, i, n, o, Z;
    if (!((s = this.snapshotMap) == null ? void 0 : s.get(l))) {
      const G = (a = this.collector) == null ? void 0 : a.getViewIdBySecenPath(l);
      if (!G)
        return;
      const m = (i = this.collector) == null ? void 0 : i.getStorageData(G, l);
      if (!m)
        return;
      if (Object.keys(m).forEach((p) => {
        var X;
        ((X = this.collector) == null ? void 0 : X.getLocalId(p)) === z && delete m[p];
      }), Object.keys(m).length) {
        const p = this.viewContainerManager.getView(G) || this.viewContainerManager.focuedView;
        if (!p)
          return;
        const X = e || ((n = p.cameraOpt) == null ? void 0 : n.width), V = c || ((o = p.cameraOpt) == null ? void 0 : o.height), u = {
          msgType: M.Snapshot,
          dataType: Q.Local,
          scenePath: l,
          scenes: m,
          w: X,
          h: V,
          cameraOpt: d && {
            ...d,
            width: X,
            height: V
          } || p.cameraOpt,
          isRunSubWork: !0,
          viewId: G,
          maxZIndex: (Z = this.zIndexNodeMethod) == null ? void 0 : Z.maxZIndex
        };
        return this.taskBatchData.add(u), this.runAnimation(), new Promise((r) => {
          this.snapshotMap.set(l, r);
        }).then((r) => (this.snapshotMap.delete(l), r));
      }
    }
  }
  queryTaskBatchData(l) {
    const e = [];
    if (l)
      for (const c of this.taskBatchData.values()) {
        let d = !0;
        for (const [b, s] of Object.entries(l))
          if (c[b] !== s) {
            d = !1;
            break;
          }
        d && e.push(c);
      }
    return e;
  }
  insertImage(l) {
    const e = this.viewContainerManager.mainView, c = e == null ? void 0 : e.id, d = e == null ? void 0 : e.focusScenePath;
    if (c && d) {
      this.undoTickerId = Date.now(), yl.InternalMsgEmitter.emit("undoTickerStart", this.undoTickerId, c);
      const b = { ...l };
      this.zIndexNodeMethod && (this.zIndexNodeMethod.addMaxLayer(), b.zIndex = this.zIndexNodeMethod.maxZIndex), this.taskBatchData.add({
        msgType: M.FullWork,
        dataType: Q.Local,
        toolsType: y.Image,
        workId: l.uuid,
        opt: b,
        viewId: c,
        undoTickerId: l.src && this.undoTickerId || void 0,
        willRefresh: !0,
        willSyncService: !0
      }), this.runAnimation();
    }
  }
  lockImage(l, e) {
    var s, a;
    const c = this.viewContainerManager.mainView, d = c == null ? void 0 : c.id, b = c == null ? void 0 : c.focusScenePath;
    if (d && b && this.collector) {
      const i = this.collector.getStorageData(d, b);
      if (!i)
        return;
      for (const [n, o] of Object.entries(i))
        if (o && o.toolsType === y.Image && o.opt.uuid === l) {
          const Z = Date.now();
          yl.InternalMsgEmitter.emit("undoTickerStart", Z, d);
          const G = (s = this.collector) != null && s.isOwn(n) ? (a = this.collector) == null ? void 0 : a.getLocalId(n) : n, m = { ...o.opt, locked: e };
          this.taskBatchData.add({
            msgType: M.FullWork,
            dataType: Q.Local,
            toolsType: y.Image,
            workId: G,
            opt: m,
            viewId: d,
            undoTickerId: Z,
            willRefresh: !0,
            willSyncService: !0
          }), this.runAnimation();
          return;
        }
    }
  }
  completeImageUpload(l, e) {
    var s, a;
    const c = this.viewContainerManager.mainView, d = c == null ? void 0 : c.id, b = c == null ? void 0 : c.focusScenePath;
    if (d && b && this.collector) {
      const i = this.collector.getStorageData(d, b);
      if (!i)
        return;
      for (const [n, o] of Object.entries(i))
        if (o && o.toolsType === y.Image && o.opt.uuid === l) {
          const Z = (s = this.collector) != null && s.isOwn(n) ? (a = this.collector) == null ? void 0 : a.getLocalId(n) : n, G = { ...o.opt, src: e };
          this.taskBatchData.add({
            msgType: M.FullWork,
            dataType: Q.Local,
            toolsType: y.Image,
            workId: Z,
            opt: G,
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
    const e = [];
    if (this.collector) {
      const c = this.collector.getScenePathData(l);
      if (!c)
        return e;
      for (const d of Object.values(c))
        if (d && d.toolsType === y.Image) {
          const b = d.opt;
          e.push({
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
    return e;
  }
  setShapeSelectorByWorkId(l, e, c) {
    this.taskBatchData.add({
      workId: z,
      selectIds: [l],
      msgType: M.Select,
      dataType: Q.Service,
      viewId: e,
      willSyncService: !0,
      undoTickerId: c
    }), this.runAnimation();
  }
  blurSelector(l, e, c) {
    this.taskBatchData.add({
      workId: z,
      selectIds: [],
      msgType: M.Select,
      dataType: Q.Service,
      viewId: l,
      scenePath: e,
      undoTickerId: c
    }), this.runAnimation();
  }
}
var nu = zl, ou = function() {
  return nu.Date.now();
}, Zu = ou, mu = /\s/;
function Gu(t) {
  for (var l = t.length; l-- && mu.test(t.charAt(l)); )
    ;
  return l;
}
var uu = Gu, hu = uu, pu = /^\s+/;
function Wu(t) {
  return t && t.slice(0, hu(t) + 1).replace(pu, "");
}
var yu = Wu, Xu = Dl, ru = gl, Vu = "[object Symbol]";
function Yu(t) {
  return typeof t == "symbol" || ru(t) && Xu(t) == Vu;
}
var Lu = Yu, xu = yu, qc = jl, Ru = Lu, $c = NaN, Nu = /^[-+]0x[0-9a-f]+$/i, Mu = /^0b[01]+$/i, Tu = /^0o[0-7]+$/i, Su = parseInt;
function zu(t) {
  if (typeof t == "number")
    return t;
  if (Ru(t))
    return $c;
  if (qc(t)) {
    var l = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = qc(l) ? l + "" : l;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = xu(t);
  var e = Mu.test(t);
  return e || Tu.test(t) ? Su(t.slice(2), e ? 2 : 8) : Nu.test(t) ? $c : +t;
}
var Iu = zu, vu = jl, Ce = Zu, _c = Iu, Hu = "Expected a function", ku = Math.max, Ju = Math.min;
function Cu(t, l, e) {
  var c, d, b, s, a, i, n = 0, o = !1, Z = !1, G = !0;
  if (typeof t != "function")
    throw new TypeError(Hu);
  l = _c(l) || 0, vu(e) && (o = !!e.leading, Z = "maxWait" in e, b = Z ? ku(_c(e.maxWait) || 0, l) : b, G = "trailing" in e ? !!e.trailing : G);
  function m(N) {
    var T = c, I = d;
    return c = d = void 0, n = N, s = t.apply(I, T), s;
  }
  function p(N) {
    return n = N, a = setTimeout(u, l), o ? m(N) : s;
  }
  function X(N) {
    var T = N - i, I = N - n, C = l - T;
    return Z ? Ju(C, b - I) : C;
  }
  function V(N) {
    var T = N - i, I = N - n;
    return i === void 0 || T >= l || T < 0 || Z && I >= b;
  }
  function u() {
    var N = Ce();
    if (V(N))
      return r(N);
    a = setTimeout(u, X(N));
  }
  function r(N) {
    return a = void 0, G && c ? m(N) : (c = d = void 0, s);
  }
  function W() {
    a !== void 0 && clearTimeout(a), n = 0, c = i = d = a = void 0;
  }
  function x() {
    return a === void 0 ? s : r(Ce());
  }
  function Y() {
    var N = Ce(), T = V(N);
    if (c = arguments, d = this, i = N, T) {
      if (a === void 0)
        return p(i);
      if (Z)
        return clearTimeout(a), a = setTimeout(u, l), m(i);
    }
    return a === void 0 && (a = setTimeout(u, l)), s;
  }
  return Y.cancel = W, Y.flush = x, Y;
}
var Ft = Cu;
const lt = /* @__PURE__ */ Ol(Ft);
var wu = Ft, Uu = jl, gu = "Expected a function";
function Fu(t, l, e) {
  var c = !0, d = !0;
  if (typeof t != "function")
    throw new TypeError(gu);
  return Uu(e) && (c = "leading" in e ? !!e.leading : c, d = "trailing" in e ? !!e.trailing : d), wu(t, l, {
    leading: c,
    maxWait: l,
    trailing: d
  });
}
var Ku = Fu;
const al = /* @__PURE__ */ Ol(Ku);
var Le;
(function(t) {
  t.Mac = "mac", t.Windows = "windows";
})(Le || (Le = {}));
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
    const { control: e, internalMsgEmitter: c } = l;
    this.control = e, this.internalMsgEmitter = c, this.roomHotkeyCheckers = ((d = this.control.room) == null ? void 0 : d.viewsParams.hotKeys.nodes) || [];
  }
  get isUseSelf() {
    var l;
    return ((l = this.control.room) == null ? void 0 : l.disableDeviceInputs) || !1;
  }
  get isSelector() {
    var l;
    return ((l = this.control.worker.currentToolsData) == null ? void 0 : l.toolsType) === y.Selector;
  }
  get collector() {
    return this.control.collector;
  }
  get mainEngine() {
    return this.control.worker;
  }
  get keyboardKind() {
    return /^Mac/i.test(navigator.platform) ? Le.Mac : Le.Windows;
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
    const e = this.control.viewContainerManager.focuedViewId, c = (d = this.control.viewContainerManager.focuedView) == null ? void 0 : d.focusScenePath;
    if (e && c)
      switch (l) {
        case "delete":
          this.isSelector && ((b = this.collector) != null && b.hasSelector(e, c)) && f.emitMethod(F.MainEngine, R.DeleteNode, { workIds: [z], viewId: e });
          break;
        case "copy":
          this.isSelector && ((s = this.collector) != null && s.hasSelector(e, c)) && this.copySelectorToTemp(e, c);
          break;
        case "paste":
          this.tmpCopyStore.size && this.pasteTempToFocusView(e, c);
          break;
      }
    (l === "changeToPencil" || l === "redo" || l === "undo") && this.onSelfActiveHotkey(l);
  }
  colloctHotkey(l) {
    if (this.isUseSelf) {
      const e = this.checkHotkey(l);
      e && this.onSelfActiveHotkey(e);
    }
  }
  onSelfActiveHotkey(l) {
    switch (console.log("onActiveHotkey---self", l), l) {
      case "changeToPencil":
        this.setMemberState({ currentApplianceName: D.pencil, useNewPencil: !0 });
        break;
      case "changeToArrow":
        this.setMemberState({ currentApplianceName: D.arrow });
        break;
      case "changeToClick":
        this.setMemberState({ currentApplianceName: D.clicker });
        break;
      case "changeToEllipse":
        this.setMemberState({ currentApplianceName: D.ellipse });
        break;
      case "changeToEraser":
        this.setMemberState({ currentApplianceName: D.eraser, isLine: !0 });
        break;
      case "changeToHand":
        this.setMemberState({ currentApplianceName: D.hand });
        break;
      case "changeToLaserPointer":
        this.setMemberState({ currentApplianceName: D.laserPointer });
        break;
      case "changeToSelector":
        this.setMemberState({ currentApplianceName: D.selector });
        break;
      case "changeToRectangle":
        this.setMemberState({ currentApplianceName: D.rectangle });
        break;
      case "changeToStraight":
        this.setMemberState({ currentApplianceName: D.straight });
        break;
      case "redo":
        this.control.room && !this.control.room.disableSerialization && this.control.viewContainerManager.redo();
        break;
      case "undo":
        this.control.room && !this.control.room.disableSerialization && this.control.viewContainerManager.undo();
        break;
      case "changeToText":
        this.setMemberState({ currentApplianceName: D.text });
        break;
    }
  }
  checkHotkey(l) {
    for (const e of this.roomHotkeyCheckers) {
      const { kind: c, checker: d } = e;
      if (d({
        nativeEvent: l,
        kind: this.getEventKey(l),
        key: l.key,
        altKey: l.altKey,
        ctrlKey: l.ctrlKey,
        shiftKey: l.shiftKey
      }, this.keyboardKind))
        return c;
    }
  }
  copySelectorToTemp(l, e) {
    var n, o;
    const c = this.control.viewContainerManager.getView(l), d = (o = (n = this.mainEngine) == null ? void 0 : n.methodBuilder) == null ? void 0 : o.getBuilder(R.CopyNode);
    if (!c || !this.collector || !d)
      return;
    const b = this.collector.transformKey(z), s = this.collector.getStorageData(l, e);
    if (!s)
      return;
    const a = s[b], i = a && d.copySelector({
      viewId: l,
      store: a
    });
    i && (this.tmpCopyCoordInfo = i == null ? void 0 : i.copyCoordInfo, this.tmpCopyStore = i == null ? void 0 : i.copyStores);
  }
  pasteTempToFocusView(l, e) {
    var b, s;
    const c = this.control.viewContainerManager.getView(l), d = (s = (b = this.mainEngine) == null ? void 0 : b.methodBuilder) == null ? void 0 : s.getBuilder(R.CopyNode);
    if (!(!c || !this.tmpCopyCoordInfo || !this.tmpCopyStore.size || !this.collector || !d) && c.viewData && this.tmpCopyCoordInfo) {
      const a = nc(this.tmpCopyCoordInfo.offset), i = this.tmpCopyCoordInfo.cameraOpt, n = c.viewData.camera;
      a.x = a.x + n.centerX - i.centerX, a.y = a.y + n.centerY - i.centerY, d.pasteSelector({
        viewId: l,
        scenePath: e,
        copyStores: nc(this.tmpCopyStore),
        copyCoordInfo: {
          offset: a,
          cameraOpt: n
        }
      });
    }
  }
  setMemberState(l) {
    var e;
    (e = this.control.room) == null || e.setMemberState(l);
  }
}
class yl {
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
      value: (s, a) => {
        var Z;
        const i = this.viewContainerManager.getView(a);
        i != null && i.focusScenePath && (Z = this.collector) != null && Z.hasSelector(a, i.focusScenePath) && this.worker.blurSelector(a, i.focusScenePath), this.textEditorManager.checkEmptyTextBlur();
        const n = i == null ? void 0 : i.displayer;
        n && (n.setActive(!1), n.stopEventHandler());
        const o = s;
        o && this.viewContainerManager.setViewScenePath(a, o), n == null || n.setActive(!0);
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
    const { displayer: e, plugin: c, options: d } = l;
    this.plugin = c, this.room = _(e) ? e : void 0, this.play = Qe(e) ? e : void 0, this.pluginOptions = d, this.roomMember = new KG();
    const b = {
      control: this,
      internalMsgEmitter: yl.InternalMsgEmitter
    };
    this.cursor = new fG(b), this.textEditorManager = new jG(b), this.worker = new iu(b), this.hotkeyManager = new ju(b);
  }
  bindPlugin(l) {
    var e, c;
    this.plugin = l, this.collector && this.collector.removeStorageStateListener(), this.collector = new Cl(l, (c = (e = this.pluginOptions) == null ? void 0 : e.syncOpt) == null ? void 0 : c.interval), this.cursor.activeCollector(), this.activePlugin();
  }
  /** 销毁 */
  destroy() {
    var l, e, c, d, b;
    this.roomMember.destroy(), (l = this.collector) == null || l.destroy(), (e = this.worker) == null || e.destroy(), (c = this.viewContainerManager) == null || c.destroy(), (d = this.cursor) == null || d.destroy(), (b = this.textEditorManager) == null || b.destory();
  }
  /** 清空当前获焦路径下的所有内容 */
  cleanCurrentScene() {
    const l = Date.now(), e = this.viewContainerManager.focuedViewId;
    e && (yl.InternalMsgEmitter.emit("undoTickerStart", l, e), this.worker.clearViewScenePath(e).then(() => {
      yl.InternalMsgEmitter.emit("undoTickerEnd", l, e);
    }));
  }
  /** 监听读写状态变更 */
  onWritableChange(l) {
    var e, c;
    l ? (c = this.worker) == null || c.abled() : (e = this.worker) == null || e.unabled();
  }
  /** 获取当前工具key */
  getToolsKey(l) {
    const e = l.currentApplianceName;
    switch (this.hasSwitchToSelectorEffect = !1, e) {
      case D.text:
        return l.textCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), y.Text;
      case D.pencil:
        if (l.useNewPencil)
          return y.Pencil;
        if (l.useLaserPen)
          return y.LaserPen;
        break;
      case D.eraser:
      case D.pencilEraser:
        return y.Eraser;
      case D.selector:
        return y.Selector;
      case D.arrow:
        return l.arrowCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), y.Arrow;
      case D.straight:
        return l.straightCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), y.Straight;
      case D.ellipse:
        return l.ellipseCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), y.Ellipse;
      case D.rectangle:
        return l.rectangleCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), y.Rectangle;
      case D.shape:
        if (l.shapeCompleteToSelector && (this.hasSwitchToSelectorEffect = !0), l.shapeType === Tl.Pentagram || l.shapeType === Tl.Star)
          return y.Star;
        if (l.shapeType === Tl.Polygon || l.shapeType === Tl.Triangle || l.shapeType === Tl.Rhombus)
          return y.Polygon;
        if (l.shapeType === Tl.SpeechBalloon)
          return y.SpeechBalloon;
        break;
    }
    return y.Clicker;
  }
  /** 获取当前工具默认配置 */
  getToolsOpt(l, e) {
    const c = e.currentApplianceName, d = {
      strokeColor: Ge(e.strokeColor[0], e.strokeColor[1], e.strokeColor[2], e.strokeOpacity || 1),
      thickness: e.strokeWidth,
      isOpacity: (e == null ? void 0 : e.strokeOpacity) && e.strokeOpacity < 1 || (e == null ? void 0 : e.fillOpacity) && e.fillOpacity < 1 || (e == null ? void 0 : e.textOpacity) && e.textOpacity < 1 || (e == null ? void 0 : e.textBgOpacity) && e.textBgOpacity < 1 || !1
    };
    switch (l) {
      case y.Text:
        d.fontFamily = window.getComputedStyle(document.documentElement).getPropertyValue("font-family"), d.fontSize = (e == null ? void 0 : e.textSizeOverride) || (e == null ? void 0 : e.textSize) || Number(window.getComputedStyle(document.body).fontSize), d.textAlign = (e == null ? void 0 : e.textAlign) || "left", d.verticalAlign = (e == null ? void 0 : e.verticalAlign) || "middle", d.fontColor = (e == null ? void 0 : e.textColor) && Ge(e.textColor[0], e.textColor[1], e.textColor[2], e.textOpacity || 1) || d.strokeColor || "rgba(0,0,0,1)", d.fontBgColor = Array.isArray(e == null ? void 0 : e.textBgColor) && Ge(e.textBgColor[0], e.textBgColor[1], e.textBgColor[2], e.textBgOpacity || 1) || "transparent", d.bold = (e == null ? void 0 : e.bold) && "bold" || void 0, d.italic = (e == null ? void 0 : e.italic) && "italic" || void 0, d.underline = (e == null ? void 0 : e.underline) || void 0, d.lineThrough = (e == null ? void 0 : e.lineThrough) || void 0, d.text = "", d.strokeColor = void 0;
        break;
      case y.Pencil:
        d.strokeType = (e == null ? void 0 : e.strokeType) || Ve.Normal;
        break;
      case y.Eraser:
        d.thickness = Math.min(3, Math.max(1, Math.floor(e.pencilEraserSize || 1))) - 1, d.isLine = c === D.eraser && !0;
        break;
      case y.LaserPen:
        d.duration = (e == null ? void 0 : e.duration) || 1, d.strokeType = (e == null ? void 0 : e.strokeType) || Ve.Normal;
        break;
      case y.Ellipse:
      case y.Rectangle:
      case y.Star:
      case y.Polygon:
      case y.SpeechBalloon:
        l === y.Star && (e.shapeType === Tl.Pentagram ? (d.vertices = 10, d.innerVerticeStep = 2, d.innerRatio = 0.4) : e != null && e.vertices && (e != null && e.innerVerticeStep) && (e != null && e.innerRatio) && (d.vertices = e.vertices, d.innerVerticeStep = e.innerVerticeStep, d.innerRatio = e.innerRatio)), l === y.Polygon && (e.shapeType === Tl.Triangle ? d.vertices = 3 : e.shapeType === Tl.Rhombus ? d.vertices = 4 : e.vertices && (d.vertices = e.vertices)), d.fillColor = (e == null ? void 0 : e.fillColor) && Ge(e.fillColor[0], e.fillColor[1], e.fillColor[2], e == null ? void 0 : e.fillOpacity) || "transparent", l === y.SpeechBalloon && (d.placement = e.placement || "bottomLeft");
        break;
    }
    return {
      toolsType: l,
      toolsOpt: d
    };
  }
  /** 激活当前view容器*/
  effectViewContainer(l) {
    var e, c, d, b, s;
    switch (l) {
      case y.Text:
      case y.Pencil:
      case y.LaserPen:
      case y.Arrow:
      case y.Straight:
      case y.Rectangle:
      case y.Ellipse:
      case y.Star:
      case y.Polygon:
      case y.SpeechBalloon:
      case y.Triangle:
      case y.Rhombus:
        this.room.disableDeviceInputs = !0, (e = this.worker) == null || e.abled();
        break;
      case y.Eraser:
      case y.Selector:
        this.room.disableDeviceInputs = !1, (c = this.cursor) == null || c.unabled(), (d = this.worker) == null || d.abled();
        break;
      default:
        this.room.disableDeviceInputs = !1, (b = this.worker) == null || b.unabled(), (s = this.cursor) == null || s.unabled();
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
    var c, d, b, s, a;
    const e = await ((c = this.worker) == null ? void 0 : c.getBoundingRect(l));
    if (e) {
      const i = ((b = (d = this.viewContainerManager.mainView) == null ? void 0 : d.viewData) == null ? void 0 : b.convertToPointInWorld({ x: e.x, y: e.y })) || { x: e.x, y: e.y }, n = ((a = (s = this.viewContainerManager.mainView) == null ? void 0 : s.viewData) == null ? void 0 : a.camera.scale) || 1;
      return {
        width: Math.floor(e.w / n) + 1,
        height: Math.floor(e.h / n) + 1,
        originX: i.x,
        originY: i.y
      };
    }
  }
  /** 异步获取指定路径下的的快照并绘制到指定的画布上 */
  async screenshotToCanvas(l, e, c, d, b) {
    const s = await this.worker.getSnapshot(e, c, d, b);
    s && (l.drawImage(s, 0, 0), s.close());
  }
  /** 异步获取指定路径下的缩略图 */
  async scenePreview(l, e) {
    var s, a, i, n;
    const c = (s = this.collector) == null ? void 0 : s.getViewIdBySecenPath(l);
    if (!c)
      return;
    const d = this.viewContainerManager.getView(c);
    if (!d || !((a = d.cameraOpt) != null && a.width) || !((i = d.cameraOpt) != null && i.height))
      return;
    const b = await ((n = this.worker) == null ? void 0 : n.getSnapshot(l));
    if (b && this.worker) {
      const o = document.createElement("canvas"), Z = o.getContext("2d"), { width: G, height: m } = d.cameraOpt;
      o.width = G, o.height = m, Z && (Z.drawImage(b, 0, 0), e.src = o.toDataURL(), e.onload = () => {
        o.remove();
      }, e.onerror = () => {
        o.remove(), e.remove();
      }), b.close();
    }
  }
  /** 切换到选择工具 */
  switchToSelector() {
    var l;
    (l = this.room) == null || l.setMemberState({ currentApplianceName: D.selector });
  }
  /** 开始执行副作用 */
  async runEffectWork(l) {
    if (this.hasSwitchToSelectorEffect) {
      const e = await new Promise((c) => {
        this.switchToSelector(), this.effectResolve = c;
      });
      this.effectResolve = void 0, e && l && l();
    }
  }
}
Object.defineProperty(yl, "InternalMsgEmitter", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new at()
});
var fu = Ht, Pu = 4;
function Qu(t) {
  return fu(t, Pu);
}
var Bu = Qu;
const et = /* @__PURE__ */ Ol(Bu);
var ql;
(function(t) {
  t[t.sdk = 1] = "sdk", t[t.plugin = 2] = "plugin", t[t.both = 3] = "both";
})(ql || (ql = {}));
var Fl;
(function(t) {
  t[t.Draw = 1] = "Draw", t[t.Delete = 2] = "Delete", t[t.Update = 3] = "Update";
})(Fl || (Fl = {}));
class Ul {
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
          const o = ((i = this.collector) == null ? void 0 : i.storage[s]) && ((n = this.collector) == null ? void 0 : n.storage[s][a]) || {}, Z = this.diffFun(this.tickStartStorerCache, new Map(Object.entries(o)));
          Z.size && (this.undoStack.push({
            id: b,
            type: ql.plugin,
            data: sl(Z),
            scenePath: a
          }), this.undoStack.length > Ul.MaxStackLength && this.undoStack.shift(), this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length)), this.redoStack.length && (this.redoStack.length = 0, this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length)), this.isTicking = !1, this.scenePath = void 0, this.tickStartStorerCache = void 0, this.undoTickerId = void 0, this.excludeIds.clear();
        }
      }, Ul.waitTime)
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
      }, Ul.waitTime)
    });
    const { control: e, internalMsgEmitter: c, viewId: d } = l;
    this.control = e, this.emitter = c, this.undoStack = [], this.redoStack = [], this.room = e.room, this.worker = e.worker, this.isTicking = !1, this.viewId = d;
  }
  get collector() {
    return this.control.collector;
  }
  addExcludeIds(l) {
    if (this.isTicking)
      for (const e of l)
        this.excludeIds.add(e);
  }
  undoTickerStart(l, e) {
    var c, d;
    if (this.undoTickerId !== l || this.scenePath !== e) {
      this.isTicking = !0, this.excludeIds.clear(), this.undoTickerId = l, this.scenePath = e;
      const b = ((c = this.collector) == null ? void 0 : c.storage[this.viewId]) && ((d = this.collector) == null ? void 0 : d.storage[this.viewId][e]) || {};
      this.tickStartStorerCache = new Map(Object.entries(sl(b)));
    }
  }
  undoTickerEndSync(l, e, c, d) {
    var b, s;
    if (l === this.undoTickerId && c === this.scenePath && e === this.viewId && this.tickStartStorerCache) {
      const a = ((b = this.collector) == null ? void 0 : b.storage[e]) && ((s = this.collector) == null ? void 0 : s.storage[e][c]) || {}, i = this.diffFun(this.tickStartStorerCache, new Map(Object.entries(a)));
      i.size && (this.undoStack.push({
        id: l,
        type: ql.plugin,
        data: sl(i),
        scenePath: c,
        tickStartStorerCache: d && sl(this.tickStartStorerCache) || void 0
      }), this.undoStack.length > Ul.MaxStackLength && this.undoStack.shift(), this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length)), this.redoStack.length && (this.redoStack.length = 0, this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length)), this.isTicking = !1, this.scenePath = void 0, this.tickStartStorerCache = void 0, this.undoTickerId = void 0, this.excludeIds.clear();
    }
  }
  undo(l) {
    this.undoTickerId && this.tickStartStorerCache && this.scenePath && this.undoTickerEndSync(this.undoTickerId, this.viewId, this.scenePath, !0);
    let e = this.undoStack.length - 1;
    for (; e >= 0; ) {
      if (this.undoStack[e].scenePath === l) {
        const s = this.undoStack[e];
        s && (this.redoStack.push(s), s.type === ql.plugin && s.data && this.refreshPlugin(s)), this.undoStack.splice(e, 1);
        break;
      }
      e--;
    }
    const c = this.undoStack.filter((b) => b.scenePath === l).length, d = this.redoStack.filter((b) => b.scenePath === l).length;
    return this.emitter.emit("onCanUndoStepsUpdate", c), this.emitter.emit("onCanRedoStepsUpdate", d), c;
  }
  redo(l) {
    let e = this.redoStack.length - 1;
    for (; e >= 0; ) {
      if (this.redoStack[e].scenePath === l) {
        const s = this.redoStack[e];
        s && (!this.undoTickerId && s.tickStartStorerCache ? (this.undoTickerId = s.id, this.tickStartStorerCache = s.tickStartStorerCache, this.scenePath = s.scenePath) : this.undoStack.push(s), s.type === ql.plugin && s.data && this.refreshPlugin(s, !0)), this.redoStack.splice(e, 1);
        break;
      }
      e--;
    }
    const c = this.undoStack.filter((b) => b.scenePath === l).length, d = this.redoStack.filter((b) => b.scenePath === l).length;
    return this.emitter.emit("onCanUndoStepsUpdate", c), this.emitter.emit("onCanRedoStepsUpdate", d), d;
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
      const e = this.undoStack.filter((d) => d.scenePath === l).length, c = this.redoStack.filter((d) => d.scenePath === l).length;
      this.emitter.emit("onCanUndoStepsUpdate", e), this.emitter.emit("onCanRedoStepsUpdate", c);
    }
  }
  diffFun(l, e) {
    const c = /* @__PURE__ */ new Set(), d = l.keys(), b = e.keys();
    for (const s of d) {
      if (this.excludeIds.has(s))
        continue;
      const a = l.get(s), i = e.get(s);
      if (a && i) {
        if (Zl(i, a))
          continue;
        c.add({
          dataType: Fl.Update,
          key: s,
          data: [a, i]
        });
        continue;
      }
      a && c.add({
        dataType: Fl.Delete,
        key: s,
        data: a
      });
    }
    for (const s of b) {
      if (this.excludeIds.has(s))
        continue;
      const a = e.get(s);
      a && !l.has(s) && c.add({
        dataType: Fl.Draw,
        key: s,
        data: a
      });
    }
    return c;
  }
  isDrawEffectiveScene(l, e) {
    const { key: c } = l;
    return !e.includes(c);
  }
  isDeleteEffectiveScene(l, e, c) {
    var s;
    const { key: d } = l;
    if (!e.includes(d))
      return !1;
    const b = e.filter((a) => {
      var i, n;
      return ((i = this.collector) == null ? void 0 : i.getLocalId(a)) === z && !((n = this.collector) != null && n.isOwn(a));
    }).map((a) => {
      var i;
      return (i = this.collector) == null ? void 0 : i.storage[this.viewId][c][a];
    });
    for (const a of b)
      if ((s = a == null ? void 0 : a.selectIds) != null && s.includes(d))
        return !1;
    return !0;
  }
  isOldEffectiveScene(l, e, c) {
    var s;
    const { key: d } = l;
    if (!e.includes(d))
      return !1;
    const b = e.filter((a) => {
      var i, n;
      return ((i = this.collector) == null ? void 0 : i.getLocalId(a)) === z && !((n = this.collector) != null && n.isOwn(a));
    }).map((a) => {
      var i;
      return (i = this.collector) == null ? void 0 : i.storage[this.viewId][c][a];
    });
    for (const a of b)
      if ((s = a == null ? void 0 : a.selectIds) != null && s.includes(d))
        return !1;
    return !0;
  }
  isNewEffectiveScene(l, e) {
    const { key: c } = l;
    return !!e.includes(c);
  }
  refreshPlugin(l, e = !1) {
    var s, a, i, n, o, Z, G, m, p, X, V, u, r, W, x, Y, N, T, I, C, w;
    let c;
    const { scenePath: d } = l, b = l.data;
    if (!(!b || !this.collector))
      for (const v of b.values()) {
        const { dataType: g, data: j, key: ll } = v, $ = this.collector.storage[this.viewId] && this.collector.storage[this.viewId][d], q = $ && Object.keys($) || [];
        switch (g) {
          case Fl.Draw:
            if (c = e ? this.isDrawEffectiveScene(v, q) : this.isDeleteEffectiveScene(v, q, d), c)
              if (e && !Array.isArray(j)) {
                if ((s = j.updateNodeOpt) != null && s.useAnimation && (j.updateNodeOpt.useAnimation = !1), ((a = this.collector) == null ? void 0 : a.getLocalId(ll)) === z && ((i = this.collector) != null && i.isOwn(v.key))) {
                  const O = j.selectIds;
                  if (O) {
                    const E = q.filter((K) => {
                      var H, P;
                      return ((H = this.collector) == null ? void 0 : H.getLocalId(K)) === z && !((P = this.collector) != null && P.isOwn(K));
                    }).map((K) => {
                      var H;
                      return (H = this.collector) == null ? void 0 : H.storage[this.viewId][d][K];
                    });
                    let J = !1;
                    for (const K of E)
                      for (let H = 0; H < O.length; H++)
                        (n = K == null ? void 0 : K.selectIds) != null && n.includes(O[H]) && (delete O[H], J = !0);
                    J && (j.selectIds = O.filter((K) => !!K));
                  }
                }
                (o = this.collector) == null || o.updateValue(v.key, j, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              } else
                !e && !Array.isArray(v.data) && ((Z = this.collector) == null || Z.updateValue(v.key, void 0, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 }));
            break;
          case Fl.Delete:
            if (c = e ? this.isDeleteEffectiveScene(v, q, d) : this.isDrawEffectiveScene(v, q), c) {
              if (e && !Array.isArray(j))
                (G = this.collector) == null || G.updateValue(ll, void 0, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              else if (!e && !Array.isArray(j)) {
                if ((m = j.updateNodeOpt) != null && m.useAnimation && (j.updateNodeOpt.useAnimation = !1), ((p = this.collector) == null ? void 0 : p.getLocalId(v.key)) === z && ((X = this.collector) != null && X.isOwn(v.key))) {
                  const O = j.selectIds;
                  if (O) {
                    const E = q.filter((K) => {
                      var H, P;
                      return ((H = this.collector) == null ? void 0 : H.getLocalId(K)) === z && !((P = this.collector) != null && P.isOwn(K));
                    }).map((K) => {
                      var H;
                      return (H = this.collector) == null ? void 0 : H.storage[this.viewId][d][K];
                    });
                    let J = !1;
                    for (const K of E)
                      for (let H = 0; H < O.length; H++)
                        (V = K == null ? void 0 : K.selectIds) != null && V.includes(O[H]) && (delete O[H], J = !0);
                    J && (j.selectIds = O.filter((K) => !!K));
                  }
                }
                (u = this.collector) == null || u.updateValue(v.key, v.data, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              }
            }
            break;
          case Fl.Update:
            if (c = e ? this.isNewEffectiveScene(v, q) : this.isOldEffectiveScene(v, q, d), c) {
              if (e && Array.isArray(j) && j.length === 2) {
                const O = j[1];
                if ((r = O.updateNodeOpt) != null && r.useAnimation && (O.updateNodeOpt.useAnimation = !1), ((W = this.collector) == null ? void 0 : W.getLocalId(v.key)) === z && ((x = this.collector) != null && x.isOwn(v.key))) {
                  const E = O.selectIds;
                  if (E) {
                    const J = q.filter((H) => {
                      var P, il;
                      return ((P = this.collector) == null ? void 0 : P.getLocalId(H)) === z && !((il = this.collector) != null && il.isOwn(H));
                    }).map((H) => {
                      var P;
                      return (P = this.collector) == null ? void 0 : P.storage[this.viewId][d][H];
                    });
                    let K = !1;
                    for (const H of J)
                      for (let P = 0; P < E.length; P++)
                        H != null && H.selectIds && ((Y = H.selectIds) != null && Y.includes(E[P])) && (delete E[P], K = !0);
                    K && (O.selectIds = E.filter((H) => !!H));
                  }
                }
                (N = this.collector) == null || N.updateValue(ll, O, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              } else if (!e && Array.isArray(j) && j.length === 2) {
                const O = j[0];
                if ((T = O.updateNodeOpt) != null && T.useAnimation && (O.updateNodeOpt.useAnimation = !1), ((I = this.collector) == null ? void 0 : I.getLocalId(v.key)) === z && ((C = this.collector) != null && C.isOwn(v.key))) {
                  const E = O.selectIds;
                  if (E) {
                    const J = q.filter((H) => {
                      var P, il;
                      return ((P = this.collector) == null ? void 0 : P.getLocalId(H)) === z && !((il = this.collector) != null && il.isOwn(H));
                    }).map((H) => {
                      var P;
                      return (P = this.collector) == null ? void 0 : P.storage[this.viewId][d][H];
                    });
                    let K = !1;
                    for (const H of J)
                      for (let P = 0; P < E.length; P++)
                        H != null && H.selectIds && H.selectIds.includes(E[P]) && (delete E[P], K = !0);
                    K && (O.selectIds = E.filter((H) => !!H));
                  }
                }
                (w = this.collector) == null || w.updateValue(v.key, O, { isAfterUpdate: !0, viewId: this.viewId, scenePath: d, isSync: !0 });
              }
            }
            break;
        }
      }
  }
}
Object.defineProperty(Ul, "MaxStackLength", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 20
});
Object.defineProperty(Ul, "waitTime", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 100
});
function Ou(t) {
  return t instanceof TouchEvent || t instanceof window.TouchEvent || (t == null ? void 0 : t.touches) && (t == null ? void 0 : t.touches.length) || (t == null ? void 0 : t.changedTouches) && (t == null ? void 0 : t.changedTouches.length);
}
function $l(t) {
  return Ou(t) && (t.touches && t.touches.length === 1 || t.changedTouches && t.changedTouches.length === 1);
}
function Kt(t) {
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
class ne {
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
    const { control: e, internalMsgEmitter: c } = l;
    this.control = e, this.internalMsgEmitter = c, this.internalMsgEmitter.on("undoTickerStart", this.undoTickerStart.bind(this)), this.internalMsgEmitter.on("undoTickerEnd", this.undoTickerEnd.bind(this)), this.internalMsgEmitter.on("excludeIds", this.addExcludeIds.bind(this));
  }
  undoTickerStart(l, e) {
    const c = this.getView(e);
    c && c.displayer && c.focusScenePath && c.displayer.commiter.undoTickerStart(l, c.focusScenePath);
  }
  undoTickerEnd(l, e, c) {
    const d = this.getView(e);
    if (d && d.displayer && d.focusScenePath) {
      if (c) {
        d.displayer.commiter.undoTickerEndSync(l, e, d.focusScenePath);
        return;
      }
      d.displayer.commiter.undoTickerEnd(l, e, d.focusScenePath);
    }
  }
  addExcludeIds(l, e) {
    const c = this.getView(e);
    c && c.displayer && c.focusScenePath && c.displayer.commiter.addExcludeIds(l);
  }
  undo() {
    const l = this.focuedView;
    let e = 0;
    if (l) {
      const c = l.focusScenePath;
      e = l.displayer.commiter.undo(c) || 0;
    }
    return e;
  }
  redo() {
    const l = this.focuedView;
    let e = 0;
    if (l) {
      const c = l.focusScenePath;
      e = l.displayer.commiter.redo(c) || 0;
    }
    return e;
  }
  validator(l, e, c) {
    var s;
    const d = et(l[e]), b = et(c);
    if (e === "focusScenePath" && c && !Zl(d, b) && (this.control.internalSceneChange(l.id, b), (s = this.focuedView) == null || s.displayer.commiter.onChangeScene()), e === "cameraOpt" && !Zl(d, b)) {
      if (b.width !== (d == null ? void 0 : d.width) || b.height !== (d == null ? void 0 : d.height)) {
        const a = this.getView(e);
        a == null || a.displayer.updateSize();
      }
      this.control.internalCameraChange(l.id, b);
    }
  }
  destroyAppView(l, e = !1) {
    const c = this.appViews.get(l);
    c && (this.control.textEditorManager.clear(l, e), c.displayer.destroy(), this.appViews.delete(l));
  }
  createMianView(l) {
    this.mainView = new Proxy(l, {
      set: (e, c, d) => (this.control.worker.isActive && this.validator(e, c, d), e[c] = d, !0)
    });
  }
  createAppView(l) {
    const e = l.id, c = new Proxy(l, {
      set: (d, b, s) => (this.control.worker.isActive && this.validator(d, b, s), d[b] = s, !0)
    });
    this.appViews.set(e, c);
  }
  isAppView(l) {
    return l !== xl.viewId && this.appViews.has(l);
  }
  getView(l) {
    var e;
    return l === xl.viewId ? this.mainView : (e = this.appViews) == null ? void 0 : e.get(l);
  }
  getCurScenePath(l) {
    const e = this.getView(l);
    if (e)
      return e.focusScenePath;
  }
  getAllViews() {
    return [this.mainView, ...this.appViews.values()];
  }
  setViewScenePath(l, e) {
    var c;
    if (l === xl.viewId && this.mainView)
      this.mainView.focusScenePath = e;
    else {
      const d = l && ((c = this.appViews) == null ? void 0 : c.get(l)) || void 0;
      d && (d.focusScenePath = e);
    }
  }
  setViewData(l, e) {
    var c;
    if (l === xl.viewId && this.mainView)
      this.mainView.viewData = e;
    else {
      const d = l && ((c = this.appViews) == null ? void 0 : c.get(l)) || void 0;
      d && (d.viewData = e);
    }
  }
  setFocuedViewId(l) {
    var e;
    this.focuedViewId = l, l === xl.viewId ? this.focuedView = this.mainView : this.focuedView = l && ((e = this.appViews) == null ? void 0 : e.get(l)) || void 0, this.control.cursor.onFocusViewChange(), this.focuedView && this.focuedView.displayer.commiter.onFocusView();
  }
  setViewFocusScenePath(l, e) {
    var d;
    let c;
    l === xl.viewId ? c = this.mainView : c = (d = this.appViews) == null ? void 0 : d.get(l), c && (c.focusScenePath = e);
  }
  /** 销毁 */
  destroy() {
    var l;
    this.internalMsgEmitter.removeAllListeners("undoTickerStart"), this.internalMsgEmitter.removeAllListeners("undoTickerEnd"), this.internalMsgEmitter.removeAllListeners("excludeIds"), (l = this.mainView) == null || l.displayer.destroy(), this.appViews.forEach((e) => {
      this.destroyAppView(e.id, !0);
    });
  }
  setFocuedViewCameraOpt(l) {
    this.focuedView && (this.focuedView.cameraOpt = l);
  }
  /** view中心点坐标转换成页面原始坐标 */
  transformToOriginPoint(l, e) {
    const c = this.getView(e);
    if (c != null && c.viewData) {
      const d = c.viewData.convertToPointOnScreen(l[0], l[1]);
      return [d.x, d.y];
    }
    return l;
  }
  /** 页面坐标转换成view中心点坐标 */
  transformToScenePoint(l, e) {
    const c = this.getView(e);
    if (c != null && c.viewData) {
      const d = c.viewData.convertToPointInWorld({ x: l[0], y: l[1] });
      return [d.x, d.y];
    }
    return l;
  }
  /** 绘制view */
  render(l) {
    var e, c, d, b, s, a, i, n, o, Z, G, m, p, X, V, u, r;
    for (const W of l) {
      const { rect: x, imageBitmap: Y, isClear: N, isUnClose: T, drawCanvas: I, clearCanvas: C, offset: w, viewId: v } = W, g = (e = this.getView(v)) == null ? void 0 : e.displayer;
      if (g && x) {
        const { dpr: j, canvasBgRef: ll, canvasFloatRef: $, floatBarCanvasRef: q, canvasServiceFloatRef: O } = g, E = x.w * j, J = x.h * j, K = x.x * j, H = x.y * j;
        if (N)
          switch (C) {
            case Il.Selector:
              (d = (c = q.current) == null ? void 0 : c.getContext("2d")) == null || d.clearRect(0, 0, E, J);
              break;
            case Il.ServiceFloat:
              (s = (b = O.current) == null ? void 0 : b.getContext("2d")) == null || s.clearRect(K, H, E, J);
              break;
            case Il.Float:
              (i = (a = $.current) == null ? void 0 : a.getContext("2d")) == null || i.clearRect(K, H, E, J);
              break;
            case Il.Bg:
              (o = (n = ll.current) == null ? void 0 : n.getContext("2d")) == null || o.clearRect(K, H, E, J);
              break;
          }
        if (I && Y)
          switch (I) {
            case Il.Selector: {
              const P = ((w == null ? void 0 : w.x) || 0) * j, il = ((w == null ? void 0 : w.y) || 0) * j;
              (G = (Z = q.current) == null ? void 0 : Z.getContext("2d")) == null || G.drawImage(Y, 0, 0, E, J, P, il, E, J);
              break;
            }
            case Il.ServiceFloat: {
              (p = (m = O.current) == null ? void 0 : m.getContext("2d")) == null || p.drawImage(Y, 0, 0, E, J, K, H, E, J);
              break;
            }
            case Il.Float: {
              (V = (X = $.current) == null ? void 0 : X.getContext("2d")) == null || V.drawImage(Y, 0, 0, E, J, K, H, E, J);
              break;
            }
            case Il.Bg: {
              (r = (u = ll.current) == null ? void 0 : u.getContext("2d")) == null || r.drawImage(Y, 0, 0, E, J, K, H, E, J);
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
  showFloatBar(l, e, c) {
    const d = this.getView(l), b = d == null ? void 0 : d.displayer.vDom;
    b && b.showFloatBar(e, c);
  }
  /** 激活浮动选框 */
  activeFloatBar(l) {
    var c;
    const e = (c = this.getView(l)) == null ? void 0 : c.displayer;
    e != null && e.vDom && e.vDom.setFloatZIndex(2);
  }
  /** 销毁浮动选框 */
  unActiveFloatBar(l) {
    const e = this.getView(l), c = e == null ? void 0 : e.displayer.vDom;
    c && c.setFloatZIndex(-1);
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
  setActiveTextEditor(l, e) {
    const c = this.getView(l), d = c == null ? void 0 : c.displayer.vDom;
    d && d.setActiveTextEditor(e);
  }
}
Object.defineProperty(ne, "defaultCameraOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    centerX: 0,
    centerY: 0,
    scale: 1
  }
});
Object.defineProperty(ne, "defaultScreenCanvasOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    autoRender: !1,
    contextType: ae.Canvas2d
  }
});
Object.defineProperty(ne, "defaultLayerOpt", {
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
  constructor(l, e, c) {
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
          const s = this.getPoint(b);
          this.cachePoint = s, s && this.control.worker.originalEventLintener(L.Start, s, this.viewId);
        }
      }
    }), Object.defineProperty(this, "mousemove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && this.viewId) {
          const s = this.getPoint(b);
          this.cachePoint = s, s && this.control.worker.originalEventLintener(L.Doing, s, this.viewId);
        }
      }
    }), Object.defineProperty(this, "mouseup", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && b.button === 0 && this.viewId) {
          const s = this.getPoint(b) || this.cachePoint;
          s && this.control.worker.originalEventLintener(L.Done, s, this.viewId), this.cachePoint = void 0;
        }
      }
    }), Object.defineProperty(this, "touchstart", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active && $l(b) && this.viewId) {
          const s = this.getPoint(b);
          this.cachePoint = s, s && this.control.worker.originalEventLintener(L.Start, s, this.viewId);
        }
      }
    }), Object.defineProperty(this, "touchmove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active) {
          if (!$l(b)) {
            this.control.worker.clearLocalPointsBatchData(), this.control.worker.unWritable();
            return;
          }
          if (this.viewId) {
            const s = this.getPoint(b);
            this.cachePoint = s, s && this.control.worker.originalEventLintener(L.Doing, s, this.viewId);
          }
        }
      }
    }), Object.defineProperty(this, "touchend", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (b) => {
        if (this.active) {
          if (!$l(b) || this.control.worker.getWorkState() === L.Unwritable) {
            this.control.worker.clearLocalPointsBatchData();
            return;
          }
          if (this.viewId) {
            const s = this.getPoint(b) || this.cachePoint;
            s && this.control.worker.originalEventLintener(L.Done, s, this.viewId), this.cachePoint = void 0;
          }
        }
      }
    }), Object.defineProperty(this, "cursorMouseMove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al((b) => {
        const s = this.getPoint(b);
        this.cacheCursorPoint && Zl(s, this.cacheCursorPoint) || !this.viewId || (this.cacheCursorPoint = s, s && this.control.worker.sendCursorEvent(s, this.viewId));
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
    }), this.viewId = l, this.control = e, this.internalMsgEmitter = c;
    const d = {
      control: this.control,
      internalMsgEmitter: this.internalMsgEmitter,
      viewId: this.viewId
    };
    this.commiter = new Ul(d);
  }
  bindToolsClass() {
    var e, c;
    const l = (c = (e = this.control.worker) == null ? void 0 : e.currentToolsData) == null ? void 0 : c.toolsType;
    switch (l) {
      case y.Text:
      case y.Pencil:
      case y.LaserPen:
      case y.Arrow:
      case y.Straight:
      case y.Rectangle:
      case y.Ellipse:
      case y.Star:
      case y.Polygon:
      case y.SpeechBalloon:
        this.eventTragetElement && (this.eventTragetElement.className = `netless-whiteboard ${l === y.Text ? "cursor-text" : l === y.Pencil || l === y.LaserPen ? "cursor-pencil" : "cursor-arrow"}`);
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
    const e = Kt(l);
    if (e && Wl(e.x) && Wl(e.y))
      return [e.x - this.containerOffset.x, e.y - this.containerOffset.y];
  }
  setActive(l) {
    this.active = l;
  }
  stopEventHandler() {
    this.cachePoint && (this.control.worker.originalEventLintener(L.Done, this.cachePoint, this.viewId), this.cachePoint = void 0);
  }
  getTranslate(l) {
    const c = (l.style.WebkitTransform || getComputedStyle(l, "").getPropertyValue("-webkit-transform") || l.style.transform || getComputedStyle(l, "").getPropertyValue("transform")).match(/-?[0-9]+\.?[0-9]*/g), d = c && parseInt(c[0]) || 0, b = c && parseInt(c[1]) || 0;
    return [d, b];
  }
  getContainerOffset(l, e) {
    var b;
    const c = this.getTranslate(l);
    let d = {
      x: e.x + l.offsetLeft + c[0],
      y: e.y + l.offsetTop + c[1]
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
  constructor(l, e) {
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
          this.cachePoint = b, b && this.control.worker.originalEventLintener(L.Start, b, this.viewId);
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
        this.cachePoint = b, b && this.control.worker.originalEventLintener(L.Doing, b, this.viewId);
      }
    }), Object.defineProperty(this, "mouseup", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (this.active && d.button === 0) {
          const b = this.getPoint(d) || this.cachePoint;
          b && this.control.worker.originalEventLintener(L.Done, b, this.viewId), this.cachePoint = void 0;
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
        this.cachePoint = b, b && this.control.worker.originalEventLintener(L.Start, b, this.viewId);
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
        this.cachePoint = b, b && this.control.worker.originalEventLintener(L.Doing, b, this.viewId);
      }
    }), Object.defineProperty(this, "touchend", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (d) => {
        if (!this.active)
          return;
        if (!$l(d) || this.control.worker.getWorkState() === L.Unwritable) {
          this.control.worker.clearLocalPointsBatchData();
          return;
        }
        const b = this.getPoint(d) || this.cachePoint;
        b && this.control.worker.originalEventLintener(L.Done, b, this.viewId), this.cachePoint = void 0;
      }
    }), Object.defineProperty(this, "cursorMouseMove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: al((d) => {
        const b = this.getPoint(d);
        this.cacheCursorPoint && Zl(b, this.cacheCursorPoint) || (this.cacheCursorPoint = b, b && this.control.worker.sendCursorEvent(b, this.viewId));
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
    }), this.control = l, this.internalMsgEmitter = e;
    const c = {
      control: this.control,
      internalMsgEmitter: this.internalMsgEmitter,
      viewId: this.viewId
    };
    this.commiter = new Ul(c);
  }
  bindToolsClass() {
    var e, c;
    const l = (c = (e = this.control.worker) == null ? void 0 : e.currentToolsData) == null ? void 0 : c.toolsType;
    switch (l) {
      case y.Text:
      case y.Pencil:
      case y.LaserPen:
      case y.Arrow:
      case y.Straight:
      case y.Rectangle:
      case y.Ellipse:
      case y.Star:
      case y.Polygon:
      case y.SpeechBalloon:
        this.eventTragetElement && (this.eventTragetElement.className = `netless-whiteboard ${l === y.Text ? "cursor-text" : l === y.Pencil || l === y.LaserPen ? "cursor-pencil" : "cursor-arrow"}`);
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
    const e = Kt(l);
    if (e && Wl(e.x) && Wl(e.y))
      return [e.x - this.containerOffset.x, e.y - this.containerOffset.y];
  }
  setActive(l) {
    this.active = l;
  }
  stopEventHandler() {
    this.cachePoint && (this.control.worker.originalEventLintener(L.Done, this.cachePoint, this.viewId), this.cachePoint = void 0);
  }
  getTranslate(l) {
    const c = (l.style.WebkitTransform || getComputedStyle(l, "").getPropertyValue("-webkit-transform") || l.style.transform || getComputedStyle(l, "").getPropertyValue("transform")).match(/-?[0-9]+\.?[0-9]*/g), d = c && parseInt(c[0]) || 0, b = c && parseInt(c[1]) || 0;
    return [d, b];
  }
  getContainerOffset(l, e) {
    var b;
    const c = this.getTranslate(l);
    let d = {
      x: e.x + l.offsetLeft + c[0],
      y: e.y + l.offsetTop + c[1]
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
const Eu = "index-module__Container__nLsM3", Au = "index-module__CanvasBox__j2Xe-", qu = "index-module__FloatCanvas__d1YR7", $u = "index-module__FloatBar__cm-EL", _u = "index-module__RotateBtn__HSSkf", l0 = "index-module__ResizeBtn__yjvda", e0 = "index-module__CursorBox__2UHvI", c0 = "index-module__TextEditorContainer__Qm8KC", t0 = "index-module__ResizeTowBox__HOllX", d0 = "index-module__FloatBarBtn__FJrOG", Ml = {
  Container: Eu,
  CanvasBox: Au,
  FloatCanvas: qu,
  FloatBar: $u,
  RotateBtn: _u,
  ResizeBtn: l0,
  CursorBox: e0,
  TextEditorContainer: c0,
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
  const { workIds: l, maranger: e } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: (c) => {
      c.preventDefault(), c.stopPropagation(), f.emitMethod(F.MainEngine, R.DeleteNode, { workIds: l || [z], viewId: e.viewId });
    }, onTouchEnd: (c) => {
      c.stopPropagation(), f.emitMethod(F.MainEngine, R.DeleteNode, { workIds: l || [z], viewId: e.viewId });
    } },
    h.createElement("img", { alt: "icon", src: ml("delete") })
  );
}, a0 = (t) => {
  const { workIds: l, viewId: e } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: (c) => {
      c.preventDefault(), c.stopPropagation(), f.emitMethod(F.MainEngine, R.CopyNode, { workIds: l || [z], viewId: e });
    }, onTouchEnd: (c) => {
      c.stopPropagation(), f.emitMethod(F.MainEngine, R.CopyNode, { workIds: l || [z], viewId: e });
    } },
    h.createElement("img", { alt: "icon", src: ml("duplicate") })
  );
}, ct = (t) => {
  const { icon: l, onClickHandler: e, onTouchEndHandler: c } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: e, onTouchEnd: c },
    h.createElement("img", { src: ml(l) })
  );
}, i0 = (t) => {
  const { open: l, setOpen: e, style: c } = t, { floatBarData: d, maranger: b } = Gl(nl), [s, a] = A([]), i = B(() => {
    if (c && c.bottom) {
      const G = {};
      return G.top = "inherit", G.bottom = 50, G;
    }
  }, [c]), n = B(() => l ? h.createElement(
    "div",
    { className: "image-layer-menu", style: i },
    h.createElement(ct, { icon: "to-top", onClickHandler: (G) => {
      G.preventDefault(), G.stopPropagation(), f.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: Pl.Top, viewId: b == null ? void 0 : b.viewId });
    }, onTouchEndHandler: (G) => {
      G.stopPropagation(), f.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: Pl.Top, viewId: b == null ? void 0 : b.viewId });
    } }),
    h.createElement(ct, { icon: "to-bottom", onClickHandler: (G) => {
      G.preventDefault(), G.stopPropagation(), f.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: Pl.Bottom, viewId: b == null ? void 0 : b.viewId });
    }, onTouchEndHandler: (G) => {
      G.stopPropagation(), f.emitMethod(F.MainEngine, R.ZIndexNode, { workIds: [z], layer: Pl.Bottom, viewId: b == null ? void 0 : b.viewId });
    } })
  ) : null, [l, i]), o = (G) => {
    G.preventDefault(), G.stopPropagation(), G.nativeEvent.stopImmediatePropagation();
    const m = !l;
    e(m), m && f.emitMethod(F.MainEngine, R.ZIndexActive, { workId: z, isActive: m, viewId: b == null ? void 0 : b.viewId });
  }, Z = (G) => {
    G.stopPropagation(), G.nativeEvent.stopImmediatePropagation();
    const m = !l;
    e(m), f.emitMethod(F.MainEngine, R.ZIndexActive, { workId: z, isActive: m, viewId: b == null ? void 0 : b.viewId });
  };
  return bl(() => {
    Zl(d == null ? void 0 : d.selectIds, s) || d != null && d.selectIds && !Zl(d == null ? void 0 : d.selectIds, s) && (a(d == null ? void 0 : d.selectIds), e(!1));
  }, [l, d, s, e]), bl(() => () => {
    l && f.emitMethod(F.MainEngine, R.ZIndexActive, { workId: z, isActive: !1, viewId: b == null ? void 0 : b.viewId });
  }, [l]), h.createElement(
    "div",
    { className: `button normal-button ${l && "active"}`, onClick: o, onTouchEnd: Z },
    n,
    h.createElement("img", { alt: "icon", src: ml(l ? "layer-pressed" : "layer") })
  );
}, n0 = (t) => {
  const { activeColor: l, onClickHandler: e, onTouchEndHandler: c } = t;
  return h.createElement(
    "div",
    { className: `font-color-button ${l === "transparent" ? "active" : ""}`, onClick: e, onTouchEnd: c },
    h.createElement("div", { className: "circle none" })
  );
}, bc = (t) => {
  const { color: l, activeColor: e, onClickHandler: c, onTouchEndHandler: d } = t;
  return h.createElement(
    "div",
    { className: `font-color-button ${l === e ? "active" : ""}`, onClick: c, onTouchEnd: d },
    h.createElement("div", { className: "circle", style: { backgroundColor: ul(l, 1) } })
  );
}, sc = (t) => {
  const { opacity: l, activeColor: e, setCurOpacity: c } = t, [d, b] = A({ x: 108, y: 0 });
  if (bl(() => {
    b({ x: l * 100 + 8, y: 0 });
  }, []), !e)
    return null;
  const s = al((n, o) => {
    n.preventDefault(), n.stopPropagation(), o.x !== (d == null ? void 0 : d.x) && b({ x: o.x, y: 0 });
    const Z = Math.min(Math.max(o.x - 8, 0), 100) / 100;
    l !== Z && c(Z, e, L.Doing);
  }, 100, { leading: !1 }), a = (n) => {
    n.preventDefault(), n.stopPropagation(), c(l, e, L.Start);
  }, i = al((n, o) => {
    n.preventDefault(), n.stopPropagation(), o.x !== (d == null ? void 0 : d.x) && b({ x: o.x, y: 0 });
    const Z = Math.min(Math.max(o.x - 8, 0), 100) / 100;
    c(Z, e, L.Done);
  }, 100, { leading: !1 });
  return h.createElement(
    "div",
    { className: "font-color-opacity", style: { marginLeft: "10px" }, onClick: (n) => {
      const o = n.nativeEvent.offsetX, Z = Math.min(Math.max(o - 12, 0), 100) / 100;
      b({ x: Z * 100 + 8, y: 0 }), c(Z, e, L.Done);
    } },
    h.createElement("div", { className: "range-color", style: {
      background: `linear-gradient(to right, ${ul(e, 0)}, ${ul(e, 1)})`
    } }),
    h.createElement(
      "div",
      { className: "range-opacity" },
      h.createElement(
        ie,
        { bounds: "parent", axis: "x", position: d, onDrag: s, onStart: a, onStop: i },
        h.createElement("div", { className: "circle", style: {
          backgroundColor: ul(e, l)
        }, onClick: (n) => {
          n == null || n.preventDefault(), n == null || n.stopPropagation();
        } })
      )
    )
  );
}, o0 = (t) => {
  const { open: l, setOpen: e, floatBarRef: c } = t, { floatBarData: d, floatBarColors: b, maranger: s, position: a, setFloatBarData: i } = Gl(nl), [n, o] = A(), [Z, G] = A(1);
  bl(() => {
    if (d != null && d.strokeColor) {
      const [u, r] = dc(d.strokeColor);
      o(u), G(r);
    }
  }, [d]);
  const m = B(() => {
    if (c != null && c.current && a && (s != null && s.height)) {
      if (c.current.offsetTop && c.current.offsetTop + a.y > 180) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      } else if (!c.current.offsetTop && (s == null ? void 0 : s.height) - c.current.offsetTop - a.y < 120) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      }
    }
  }, [c, a, s]), p = B(() => h.createElement(sc, { key: "strokeColors", opacity: Z, activeColor: n, setCurOpacity: (u, r, W) => {
    W === L.Start && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !0), W === L.Done && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !1), G(u);
    const x = ul(r, u);
    d != null && d.strokeColor && (d.strokeColor = x, i({ strokeColor: x })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], strokeColor: x, workState: W, viewId: s == null ? void 0 : s.viewId });
  } }), [Z, n, s == null ? void 0 : s.control.room, s == null ? void 0 : s.viewId, d]), X = B(() => l ? h.createElement(
    "div",
    { className: "font-colors-menu", style: m, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    } },
    b.concat().map((u, r) => {
      const W = ve(...u);
      return h.createElement(bc, { key: r, color: W, activeColor: n, onTouchEndHandler: (x) => {
        x.stopPropagation(), o(W);
        const Y = ul(W, Z);
        d != null && d.strokeColor && (d.strokeColor = Y, i({ strokeColor: Y })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], strokeColor: Y, viewId: s == null ? void 0 : s.viewId });
      }, onClickHandler: (x) => {
        x.preventDefault(), x.stopPropagation(), o(W);
        const Y = ul(W, Z);
        d != null && d.strokeColor && (d.strokeColor = Y, i({ strokeColor: Y })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], strokeColor: Y, viewId: s == null ? void 0 : s.viewId });
      } });
    }),
    p
  ) : null, [l, b, p, n, Z, d, s == null ? void 0 : s.viewId, m]), V = B(() => n ? h.createElement(
    "div",
    { className: "color-bar-ring", style: { backgroundColor: ul(n, Z) } },
    h.createElement("div", { className: "circle" })
  ) : null, [n, Z]);
  return h.createElement(
    "div",
    { className: `button normal-button font-colors-icon ${l && "active"}`, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
    } },
    V,
    X
  );
}, Z0 = (t) => {
  const { open: l, setOpen: e, floatBarRef: c } = t, { floatBarData: d, floatBarColors: b, maranger: s, position: a, setFloatBarData: i } = Gl(nl), [n, o] = A(), [Z, G] = A(1);
  bl(() => {
    if (d != null && d.fillColor) {
      const [u, r] = (d == null ? void 0 : d.fillColor) === "transparent" && ["transparent", 1] || dc(d.fillColor);
      o(u), G(r);
    }
  }, [d]);
  const m = B(() => {
    if (c != null && c.current && a && (s != null && s.height)) {
      if (c.current.offsetTop && c.current.offsetTop + a.y > 200) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      } else if (!c.current.offsetTop && (s == null ? void 0 : s.height) - c.current.offsetTop - a.y < 140) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      }
    }
  }, [c, a, s]), p = B(() => n && n !== "transparent" ? h.createElement(sc, { key: "fillColors", opacity: Z || 0, activeColor: n, setCurOpacity: (u, r, W) => {
    W === L.Start && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !0), W === L.Done && (s != null && s.control.room) && (s.control.room.disableDeviceInputs = !1), G(u);
    const x = ul(r, u);
    d != null && d.fillColor && (d.fillColor = x, i({ fillColor: x })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: n && ul(r, u), workState: W, viewId: s == null ? void 0 : s.viewId });
  } }) : null, [n, Z, s == null ? void 0 : s.control.room, s == null ? void 0 : s.viewId, d]), X = B(() => l ? h.createElement(
    "div",
    { className: "font-colors-menu", style: m, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement(n0, { activeColor: n, onTouchEndHandler: (u) => {
      u.stopPropagation(), o("transparent");
      const r = "transparent";
      d != null && d.fillColor && (d.fillColor = r, i({ fillColor: r })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: r, viewId: s == null ? void 0 : s.viewId });
    }, onClickHandler: (u) => {
      u.preventDefault(), u.stopPropagation(), o("transparent");
      const r = "transparent";
      d != null && d.fillColor && (d.fillColor = r, i({ fillColor: r })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: r, viewId: s == null ? void 0 : s.viewId });
    } }),
    b.map((u, r) => {
      const W = ve(...u);
      return h.createElement(bc, { key: r, color: W, activeColor: n, onTouchEndHandler: (x) => {
        x.stopPropagation(), o(W);
        const Y = ul(W, Z);
        d != null && d.fillColor && (d.fillColor = Y, i({ fillColor: Y })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: Y, viewId: s == null ? void 0 : s.viewId });
      }, onClickHandler: (x) => {
        x.preventDefault(), x.stopPropagation(), o(W);
        const Y = ul(W, Z);
        d != null && d.fillColor && (d.fillColor = Y, i({ fillColor: Y })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: [z], fillColor: Y, viewId: s == null ? void 0 : s.viewId });
      } });
    }),
    p
  ) : null, [l, n, b, p, d, s == null ? void 0 : s.viewId, Z, m]), V = B(() => {
    const u = n && n !== "transparent" && ul(n, Z) || "transparent";
    return h.createElement(
      "div",
      { className: "color-bar-fill" },
      h.createElement("div", { className: "circle", style: { backgroundColor: u } })
    );
  }, [n, Z]);
  return h.createElement(
    "div",
    { className: `button normal-button font-colors-icon ${l && "active"}`, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
    } },
    V,
    X
  );
}, m0 = (t) => {
  const { open: l, setOpen: e, textOpt: c, workIds: d, floatBarRef: b } = t, { floatBarColors: s, maranger: a, position: i, setFloatBarData: n, floatBarData: o } = Gl(nl), [Z, G] = A(), [m, p] = A(1);
  bl(() => {
    if (c != null && c.fontColor) {
      const [W, x] = (c == null ? void 0 : c.fontColor) === "transparent" && ["transparent", 0] || dc(c.fontColor);
      G(W), p(x);
    }
  }, [c == null ? void 0 : c.fontColor]);
  const X = B(() => {
    if (b != null && b.current && i && (a != null && a.height)) {
      if (b.current.offsetTop && b.current.offsetTop + i.y > 180) {
        const W = {};
        return W.top = "inherit", W.bottom = 50, W;
      } else if (!b.current.offsetTop && (a == null ? void 0 : a.height) - b.current.offsetTop - i.y < 120) {
        const W = {};
        return W.top = "inherit", W.bottom = 50, W;
      }
    }
  }, [b, i, a]), V = B(() => Z && Z !== "transparent" ? h.createElement(sc, { key: "fontColors", opacity: m, activeColor: Z, setCurOpacity: (W, x, Y) => {
    Y === L.Start && (a != null && a.control.room) && (a.control.room.disableDeviceInputs = !0), Y === L.Done && (a != null && a.control.room) && (a.control.room.disableDeviceInputs = !1), p(W);
    const N = ul(x, W);
    o != null && o.textOpt && (o.textOpt.fontColor = N, n({ textOpt: o.textOpt })), f.emitMethod(F.MainEngine, R.SetColorNode, {
      workIds: d || [z],
      fontColor: Z && N,
      workState: Y,
      viewId: a == null ? void 0 : a.viewId
    });
  } }) : null, [Z, m, a == null ? void 0 : a.control.room, a == null ? void 0 : a.viewId, o == null ? void 0 : o.textOpt, d]), u = B(() => l ? h.createElement(
    "div",
    { className: "font-colors-menu", style: X, onTouchEnd: (W) => {
      W.stopPropagation(), W.nativeEvent.stopImmediatePropagation();
    }, onClick: (W) => {
      W.preventDefault(), W.stopPropagation(), W.nativeEvent.stopImmediatePropagation();
    } },
    s.map((W, x) => {
      const Y = ve(...W);
      return h.createElement(bc, { key: x, color: Y, activeColor: Z, onTouchEndHandler: (N) => {
        N.stopPropagation(), G(Y);
        const T = ul(Y, m);
        o != null && o.textOpt && (o.textOpt.fontColor = T, n({ textOpt: o.textOpt })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: d || [z], fontColor: T, viewId: a == null ? void 0 : a.viewId });
      }, onClickHandler: (N) => {
        N.preventDefault(), N.stopPropagation(), G(Y);
        const T = ul(Y, m);
        o != null && o.textOpt && (o.textOpt.fontColor = T, n({ textOpt: o.textOpt })), f.emitMethod(F.MainEngine, R.SetColorNode, { workIds: d || [z], fontColor: T, viewId: a == null ? void 0 : a.viewId });
      } });
    }),
    V
  ) : null, [l, s, V, Z, m, o == null ? void 0 : o.textOpt, d, a == null ? void 0 : a.viewId, X]), r = B(() => {
    const W = Z && Z !== "transparent" && ul(Z, m) || "transparent";
    return h.createElement(
      "div",
      { className: "color-bar" },
      h.createElement("div", { className: "color-bar-color", style: { backgroundColor: W } })
    );
  }, [Z, m]);
  return h.createElement(
    "div",
    { className: `button normal-button font-colors-icon ${l && "active"}`, onTouchEnd: (W) => {
      W.stopPropagation(), W.nativeEvent.stopImmediatePropagation(), e(!l);
    }, onClick: (W) => {
      W.preventDefault(), W.stopPropagation(), W.nativeEvent.stopImmediatePropagation(), e(!l);
    } },
    h.createElement("img", { alt: "icon", src: ml("font-colors") }),
    r,
    u
  );
}, G0 = (t) => {
  const { bold: l, setBold: e, workIds: c, viewId: d } = t, b = (s) => {
    const a = l === "bold" ? "normal" : "bold";
    s == null || s.preventDefault(), s == null || s.stopPropagation(), e(a), f.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: c, viewId: d, bold: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l === "bold" ? "bold-active" : "bold") })
  );
}, u0 = (t) => {
  const { underline: l, setUnderline: e, workIds: c, viewId: d } = t, b = (s) => {
    const a = !l;
    s == null || s.preventDefault(), s == null || s.stopPropagation(), e(a), f.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: c, viewId: d, underline: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l ? "underline-active" : "underline") })
  );
}, h0 = (t) => {
  const { lineThrough: l, setLineThrough: e, workIds: c, viewId: d } = t, b = (s) => {
    const a = !l;
    s == null || s.preventDefault(), s == null || s.stopPropagation(), e(a), f.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: c, viewId: d, lineThrough: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l ? "line-through-active" : "line-through") })
  );
}, p0 = (t) => {
  const { italic: l, setItalic: e, workIds: c, viewId: d } = t, b = (s) => {
    const a = l === "italic" ? "normal" : "italic";
    s == null || s.preventDefault(), s == null || s.stopPropagation(), e(a), f.emitMethod(F.MainEngine, R.SetFontStyle, { workIds: c, viewId: d, italic: a });
  };
  return h.createElement(
    "div",
    { className: "font-style-button", onClick: b, onTouchEnd: b },
    h.createElement("img", { alt: "icon", src: ml(l === "italic" ? "italic-active" : "italic") })
  );
}, W0 = (t) => {
  const { open: l, setOpen: e, textOpt: c, workIds: d, style: b } = t, { maranger: s } = Gl(nl), [a, i] = A("normal"), [n, o] = A("normal"), [Z, G] = A(!1), [m, p] = A(!1);
  bl(() => {
    c != null && c.bold && i(c.bold), Vl(c == null ? void 0 : c.underline) && G(c.underline || !1), Vl(c == null ? void 0 : c.lineThrough) && p(c.lineThrough || !1), c != null && c.italic && o(c.italic);
  }, [c]);
  const X = B(() => {
    if (b && b.bottom) {
      const u = {};
      return u.top = "inherit", u.bottom = 50, u;
    }
  }, [b]), V = B(() => l ? h.createElement(
    "div",
    { className: "font-style-menu", style: X, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement(G0, { workIds: d || [z], bold: a, setBold: i, viewId: s == null ? void 0 : s.viewId }),
    h.createElement(u0, { workIds: d || [z], underline: Z, setUnderline: G, viewId: s == null ? void 0 : s.viewId }),
    h.createElement(h0, { workIds: d || [z], lineThrough: m, setLineThrough: p, viewId: s == null ? void 0 : s.viewId }),
    h.createElement(p0, { workIds: d || [z], italic: n, setItalic: o, viewId: s == null ? void 0 : s.viewId })
  ) : null, [l, d, a, s == null ? void 0 : s.viewId, Z, m, n, X]);
  return h.createElement(
    "div",
    { className: `button normal-button ${l && "active"}`, onTouchEnd: (u) => {
      u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
    }, onClick: (u) => {
      u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
    } },
    h.createElement("img", { alt: "icon", src: ml(l ? "font-style-active" : "font-style") }),
    V
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
], y0 = (t) => {
  const { style: l, onClickHandler: e } = t;
  return h.createElement("div", { className: "font-size-menu", style: l, onTouchEnd: (c) => {
    c.stopPropagation(), c.nativeEvent.stopImmediatePropagation();
  }, onClick: (c) => {
    c.preventDefault(), c.stopPropagation(), c.nativeEvent.stopImmediatePropagation();
  } }, Xl.map((c) => h.createElement("div", { className: "font-size-btn", key: c, onClick: () => {
    e(c);
  }, onTouchEnd: () => {
    e(c);
  } }, c)));
}, X0 = (t) => {
  const l = Bl(null), { open: e, setOpen: c, textOpt: d, workIds: b, floatBarRef: s } = t, { maranger: a, position: i } = Gl(nl), [n, o] = A(0), [Z, G] = A(), m = Xl.length - 1;
  bl(() => {
    d != null && d.fontSize && (o(d.fontSize), l.current && (l.current.value = d.fontSize.toString()));
  }, [d == null ? void 0 : d.fontSize]);
  const p = B(() => {
    if (s != null && s.current && i && (a != null && a.height)) {
      if (s.current.offsetTop && s.current.offsetTop + i.y > 250) {
        const W = {};
        return W.top = "inherit", W.bottom = 35, W;
      } else if (!s.current.offsetTop && (a == null ? void 0 : a.height) - s.current.offsetTop - i.y < 180) {
        const W = {};
        return W.top = "inherit", W.bottom = 35, W;
      }
    }
  }, [s, i, a]);
  function X(W) {
    o(W), W && W >= Xl[0] && W <= Xl[m] && f.emitMethod(F.MainEngine, R.SetFontStyle, {
      workIds: b || [z],
      fontSize: W,
      viewId: a == null ? void 0 : a.viewId
    });
  }
  const V = (W) => {
    var x;
    o(W), c(!1), (x = l.current) == null || x.blur(), W && W >= Xl[0] && W <= Xl[m] && f.emitMethod(F.MainEngine, R.SetFontStyle, {
      workIds: b || [z],
      fontSize: W,
      viewId: a == null ? void 0 : a.viewId
    });
  }, u = B(() => e ? h.createElement(y0, { onClickHandler: V, style: p }) : null, [e, V, p]), r = (W) => {
    W > Xl[m] && (W = Xl[m]), W < Xl[0] && (W = Xl[0]), X(W);
  };
  return bl(() => () => {
    a != null && a.control.room && Vl(Z) && (a.control.room.disableDeviceInputs = Z);
  }, [a, Z]), h.createElement(
    "div",
    { className: "button normal-button font-size-barBtn", style: { width: 50 }, onTouchEnd: (W) => {
      W.stopPropagation(), W.nativeEvent.stopImmediatePropagation();
    }, onClick: (W) => {
      W.preventDefault(), W.stopPropagation(), W.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement("input", { className: "font-size-input", ref: l, onTouchEnd: () => {
      l.current && l.current.focus();
    }, onClick: () => {
      c(!e), l.current && l.current.focus();
    }, onKeyDown: (W) => {
      if (W.key === "Backspace") {
        const x = window.getSelection(), Y = x == null ? void 0 : x.getRangeAt(0);
        if (Y != null && Y.collapsed)
          return W.preventDefault(), document.execCommand("delete", !1), !1;
      }
    }, onKeyUp: () => {
      if (l.current) {
        const W = l.current.value, x = parseInt(W);
        isNaN(x) ? l.current.value = "0" : l.current.value = x.toString();
      }
    }, onChange: (W) => {
      const x = W.target.value, Y = parseInt(x);
      Y && X(Y);
    }, onFocus: () => {
      a != null && a.control.room && !a.control.room.disableDeviceInputs && (G(a.control.room.disableDeviceInputs), a.control.room.disableDeviceInputs = !0);
    }, onBlur: () => {
      a != null && a.control.room && Vl(Z) && (a.control.room.disableDeviceInputs = Z);
    } }),
    h.createElement(
      "div",
      { className: "font-size-btns" },
      h.createElement("div", { className: "font-size-add", onClick: () => {
        r(n + Xl[0]);
      }, onTouchEnd: () => {
        r(n + Xl[0]);
      } }),
      h.createElement("div", { className: "font-size-cut", onClick: () => {
        r(n - Xl[0]);
      }, onTouchEnd: () => {
        r(n - Xl[0]);
      } })
    ),
    u
  );
}, r0 = (t) => {
  const { workIds: l, maranger: e, islocked: c } = t;
  return h.createElement(
    "div",
    { className: "button normal-button", onClick: (d) => {
      d.preventDefault(), d.stopPropagation(), f.emitMethod(F.MainEngine, R.SetLock, { workIds: l || [z], isLocked: !c, viewId: e == null ? void 0 : e.viewId });
    }, onTouchEnd: (d) => {
      d.stopPropagation(), f.emitMethod(F.MainEngine, R.SetLock, { workIds: l || [z], isLocked: !c, viewId: e == null ? void 0 : e.viewId });
    } },
    h.createElement("img", { alt: "icon", src: ml(c ? "unlock-new" : "lock-new") })
  );
}, Pe = (t) => {
  const { icon: l, min: e, max: c, step: d, value: b, onInputHandler: s } = t, [a, i] = A(0), n = Bl(null), o = (Z) => {
    Z > c && (Z = c), Z < e && (Z = e), i(Z), s(Z), n.current && (n.current.value = Z.toString());
  };
  return bl(() => {
    b && (i(b), n.current && (n.current.value = b.toString()));
  }, [b]), h.createElement(
    "div",
    { className: "button input-button", onTouchEnd: (Z) => {
      Z.stopPropagation(), Z.nativeEvent.stopImmediatePropagation();
    }, onClick: (Z) => {
      Z.preventDefault(), Z.stopPropagation(), Z.nativeEvent.stopImmediatePropagation();
    } },
    h.createElement("img", { src: ml(l) }),
    h.createElement("input", { className: "input-number", type: "text", ref: n, onTouchEnd: () => {
      n.current && n.current.focus();
    }, onClick: () => {
      n.current && n.current.focus();
    }, onKeyDown: (Z) => {
      if (Z.key === "Backspace") {
        const G = window.getSelection(), m = G == null ? void 0 : G.getRangeAt(0);
        if (m != null && m.collapsed)
          return Z.preventDefault(), document.execCommand("delete", !1), !1;
      }
    }, onKeyUp: () => {
      if (n.current) {
        const Z = n.current.value, G = parseInt(Z);
        isNaN(G) ? n.current.value = "0" : n.current.value = G.toString();
      }
    }, onChange: (Z) => {
      const G = Z.target.value, m = parseInt(G);
      m && m && m >= e && m <= c && o(m);
    } }),
    h.createElement(
      "div",
      { className: "input-number-btns" },
      h.createElement("div", { className: "input-number-add", onClick: () => {
        o(a + d);
      }, onTouchEnd: () => {
        o(a + d);
      } }),
      h.createElement("div", { className: "input-number-cut", onClick: () => {
        o(a - d);
      }, onTouchEnd: () => {
        o(a - d);
      } })
    )
  );
}, V0 = (t) => {
  const { icon: l, min: e, max: c, step: d, value: b, onInputHandler: s } = t;
  return h.createElement(
    "div",
    { className: "button input-button" },
    h.createElement("img", { src: ml(l) }),
    h.createElement(Y0, { min: e, max: c, step: d, value: b, onInputHandler: s })
  );
}, Y0 = (t) => {
  const { value: l, min: e, max: c, onInputHandler: d } = t, [b, s] = A({ x: 0, y: 0 });
  bl(() => {
    s({ x: l * 100, y: 0 });
  }, []);
  const a = al((o, Z) => {
    o.preventDefault(), o.stopPropagation();
    let G = Math.floor(Math.max(Z.x, e * 100));
    G = Math.floor(Math.min(G, c * 100)), Z.x !== (b == null ? void 0 : b.x) && s({ x: G, y: 0 });
    const m = G / 100;
    console.log("first1--doing", Z, Z.x, G, m), l !== m && d(m);
  }, 100, { leading: !1 }), i = (o) => {
    o.preventDefault(), o.stopPropagation();
  }, n = al((o, Z) => {
    o.preventDefault(), o.stopPropagation();
    let G = Math.floor(Math.max(Z.x, e * 100));
    G = Math.floor(Math.min(G, c * 100)), Z.x !== (b == null ? void 0 : b.x) && s({ x: G, y: 0 });
    const m = G / 100;
    console.log("first1--end", Z, Z.x, G, m), l !== m && d(m);
  }, 100, { leading: !1 });
  return console.log("position", b), h.createElement(
    "div",
    { className: "range-number-container", onClick: (o) => {
      const Z = o.nativeEvent.offsetX - 6;
      let G = Math.floor(Math.max(Z, e * 100));
      G = Math.floor(Math.min(G, c * 100)), s({ x: G, y: 0 });
      const m = G / 100;
      console.log("first1", o.nativeEvent.offsetX, G, m), l !== m && d(m);
    } },
    h.createElement("div", { className: "range-number-color" }),
    h.createElement(
      "div",
      { className: "range-number" },
      h.createElement(
        ie,
        { bounds: "parent", axis: "x", position: b, onDrag: a, onStart: i, onStop: n },
        h.createElement("div", { className: "circle", onClick: i })
      )
    )
  );
}, L0 = (t) => {
  const { icon: l, value: e, onChangeHandler: c, style: d } = t, [b, s] = A(0), [a, i] = A(), n = Bl(null), o = Bt((m) => {
    m >= Al.length && (m = 0), m < 0 && (m = Al.length - 1), s(m), c(Al[m]), i(!1), n.current && (n.current.value = Al[m]);
  }, [c]), Z = B(() => {
    if (d && d.bottom) {
      const m = {};
      return m.top = "inherit", m.bottom = 50, m;
    }
  }, [d]);
  bl(() => {
    e && (s(Al.indexOf(e)), n.current && (n.current.value = e));
  }, [e]);
  const G = B(() => a ? h.createElement(x0, { options: Al, onClickHandler: o, style: Z }) : null, [a, o, Z]);
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
        o(b + 1);
      }, onTouchEnd: () => {
        o(b + 1);
      } }),
      h.createElement("div", { className: "input-number-cut", onClick: () => {
        o(b - 1);
      }, onTouchEnd: () => {
        o(b - 1);
      } })
    ),
    G
  );
}, x0 = (t) => {
  const { options: l, style: e, onClickHandler: c } = t;
  return h.createElement("div", { className: "select-option-menu", style: e, onTouchEnd: (d) => {
    d.stopPropagation(), d.nativeEvent.stopImmediatePropagation();
  }, onClick: (d) => {
    d.preventDefault(), d.stopPropagation(), d.nativeEvent.stopImmediatePropagation();
  } }, l.map((d, b) => h.createElement("div", { className: "select-option-btn", key: d, onClick: () => {
    c(b);
  }, onTouchEnd: () => {
    c(b);
  } }, d)));
}, R0 = (t) => {
  const { maranger: l, innerRatio: e, innerVerticeStep: c, vertices: d } = t, b = (i) => {
    console.log("onInputHandler", i), f.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: y.Star,
      viewId: l.viewId,
      vertices: i
    });
  }, s = (i) => {
    console.log("onInputHandler", i), f.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: y.Star,
      viewId: l.viewId,
      innerVerticeStep: i
    });
  }, a = (i) => {
    console.log("onInputHandler", i), f.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: y.Star,
      viewId: l.viewId,
      innerRatio: i
    });
  };
  return h.createElement(
    h.Fragment,
    null,
    h.createElement(Pe, { value: d, icon: "polygon-vertex", min: 3, max: 100, step: 1, onInputHandler: b }),
    h.createElement(Pe, { value: c, icon: "star-innerVertex", min: 1, max: 100, step: 1, onInputHandler: s }),
    h.createElement(V0, { value: e, icon: "star-innerRatio", min: 0.1, max: 1, step: 0.1, onInputHandler: a })
  );
}, N0 = (t) => {
  const { maranger: l, vertices: e } = t, c = (d) => {
    f.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: y.Polygon,
      viewId: l.viewId,
      vertices: d
    });
  };
  return h.createElement(Pe, { value: e, icon: "polygon-vertex", min: 3, max: 100, step: 1, onInputHandler: c });
}, M0 = (t) => {
  const { maranger: l, placement: e } = t, c = (d) => {
    console.log("onChangeHandler-SpeechBalloonFormView", d), f.emitMethod(F.MainEngine, R.SetShapeOpt, {
      workIds: [z],
      toolsType: y.SpeechBalloon,
      viewId: l.viewId,
      placement: d
    });
  };
  return h.createElement(L0, { value: e, icon: "speechBallon-placement", onChangeHandler: c });
}, we = (t) => {
  const { icon: l, isActive: e, onClickHandler: c, onTouchEndHandler: d } = t;
  return h.createElement(
    "div",
    { className: `button tab-button ${e ? "active" : ""}`, onClick: c, onTouchEnd: d },
    h.createElement("img", { src: ml(l) })
  );
}, T0 = (t) => {
  const { toolsTypes: l, style: e, maranger: c, shapeOpt: d } = t, [b, s] = A();
  bl(() => {
    l.includes(y.Polygon) ? s(y.Polygon) : l.includes(y.Star) ? s(y.Star) : s(y.SpeechBalloon);
  }, [l]);
  const a = (Z, G) => {
    G == null || G.preventDefault(), G == null || G.stopPropagation(), s(Z);
  }, i = B(() => b === y.Polygon && c && d.vertices ? h.createElement(N0, { vertices: d.vertices, maranger: c }) : null, [c, b, d]), n = B(() => b === y.Star && c && d.vertices && d.innerVerticeStep && d.innerRatio ? h.createElement(R0, { maranger: c, vertices: d.vertices, innerVerticeStep: d.innerVerticeStep, innerRatio: d.innerRatio }) : null, [c, b, d]), o = B(() => b === y.SpeechBalloon && c && d.placement ? h.createElement(M0, { maranger: c, placement: d.placement }) : null, [c, b, d]);
  return h.createElement(
    "div",
    { className: "shapeOpt-sub-menu", style: e, onClick: (Z) => {
      Z.stopPropagation(), Z.nativeEvent.stopImmediatePropagation(), Z == null || Z.preventDefault();
    } },
    h.createElement(
      "div",
      { className: "shapeOpt-sub-menu-tabs" },
      l.includes(y.Polygon) && h.createElement(we, { isActive: b === y.Polygon, icon: b === y.Polygon ? "polygon-active" : "polygon", onClickHandler: a.bind(void 0, y.Polygon), onTouchEndHandler: a.bind(void 0, y.Polygon) }) || null,
      l.includes(y.Star) && h.createElement(we, { isActive: b === y.Star, icon: b === y.Star ? "star-active" : "star", onClickHandler: a.bind(void 0, y.Star), onTouchEndHandler: a.bind(void 0, y.Star) }) || null,
      l.includes(y.SpeechBalloon) && h.createElement(we, { isActive: b === y.SpeechBalloon, icon: b === y.SpeechBalloon ? "speechBallon-active" : "speechBallon", onClickHandler: a.bind(void 0, y.SpeechBalloon), onTouchEndHandler: a.bind(void 0, y.SpeechBalloon) }) || null
    ),
    h.createElement(
      "div",
      { className: "shapeOpt-sub-menu-content" },
      i,
      n,
      o
    )
  );
}, S0 = (t) => {
  const { open: l, setOpen: e, floatBarRef: c, toolsTypes: d, shapeOpt: b } = t, { floatBarData: s, maranger: a, position: i } = Gl(nl), [n, o] = A([]), [Z, G] = A(), m = B(() => {
    if (c != null && c.current && i && (a != null && a.height)) {
      if (c.current.offsetTop && c.current.offsetTop + i.y > 200) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      } else if (!c.current.offsetTop && (a == null ? void 0 : a.height) - c.current.offsetTop - i.y < 140) {
        const u = {};
        return u.top = "inherit", u.bottom = 50, u;
      }
    }
  }, [c, i, a]), p = B(() => l && d && a && b ? (a.control.room && !a.control.room.disableDeviceInputs && (G(a.control.room.disableDeviceInputs), a.control.room.disableDeviceInputs = !0), h.createElement(T0, { shapeOpt: b, style: m, toolsTypes: d, maranger: a })) : (a != null && a.control.room && Vl(Z) && (a.control.room.disableDeviceInputs = Z, console.log("showSubBtn---false---001", l)), null), [l, m, d, a, b]), X = (u) => {
    u.preventDefault(), u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
  }, V = (u) => {
    u.stopPropagation(), u.nativeEvent.stopImmediatePropagation(), e(!l);
  };
  return bl(() => {
    Zl(s == null ? void 0 : s.selectIds, n) || s != null && s.selectIds && !Zl(s == null ? void 0 : s.selectIds, n) && (o(s == null ? void 0 : s.selectIds), e(!1));
  }, [l, s, n, e]), bl(() => () => {
    l && a != null && a.control.room && Vl(Z) && (a.control.room.disableDeviceInputs = Z, console.log("showSubBtn---false---002", l));
  }, [l, a, Z]), h.createElement(
    "div",
    { className: `button normal-button ${l && "active"}`, onClick: X, onTouchEnd: V },
    p,
    h.createElement("img", { alt: "icon", src: ml(l ? "shapes-active" : "shapes") })
  );
};
var tl;
(function(t) {
  t[t.none = 0] = "none", t[t.Layer = 1] = "Layer", t[t.StrokeColor = 2] = "StrokeColor", t[t.FillColor = 3] = "FillColor", t[t.TextColor = 4] = "TextColor", t[t.TextBgColor = 5] = "TextBgColor", t[t.FontStyle = 6] = "FontStyle", t[t.FontSize = 7] = "FontSize", t[t.ShapeOpt = 8] = "ShapeOpt";
})(tl || (tl = {}));
const jt = h.memo((t) => {
  const { textOpt: l, workIds: e, noLayer: c, position: d } = t, { floatBarData: b, maranger: s } = Gl(nl), [a, i] = h.useState(tl.none), n = Bl(null), o = B(() => {
    var N, T, I;
    const W = {}, x = (b == null ? void 0 : b.w) || ((N = l == null ? void 0 : l.boxSize) == null ? void 0 : N[0]) || 0, Y = (b == null ? void 0 : b.h) || ((T = l == null ? void 0 : l.boxSize) == null ? void 0 : T[1]) || 0;
    if (d && x && Y && (s != null && s.width) && (s != null && s.height)) {
      if (d.y < 60 && (d.y + x < s.height - 60 ? W.bottom = -120 : d.y + Y < s.height ? W.bottom = -58 : d.y > 0 ? W.top = 62 : W.top = -d.y + 62), d.x < 0)
        W.left = -d.x + 3;
      else if (d.x + (((I = n.current) == null ? void 0 : I.offsetWidth) || x) > s.width) {
        const C = x + d.x - s.width;
        W.left = "initial", W.right = C;
      }
      return W;
    }
  }, [n, d, b == null ? void 0 : b.w, b == null ? void 0 : b.h, s == null ? void 0 : s.width, s == null ? void 0 : s.height, l == null ? void 0 : l.boxSize]), Z = B(() => b != null && b.fillColor ? h.createElement(Z0, { floatBarRef: n, open: a === tl.FillColor, setOpen: (W) => {
    i(W === !0 ? tl.FillColor : tl.none);
  } }) : null, [b == null ? void 0 : b.fillColor, a, n]), G = B(() => b != null && b.strokeColor ? h.createElement(o0, { floatBarRef: n, open: a === tl.StrokeColor, setOpen: (W) => {
    i(W === !0 ? tl.StrokeColor : tl.none);
  } }) : null, [b == null ? void 0 : b.strokeColor, a, n]), m = B(() => l != null && l.fontColor && (s != null && s.viewId) ? h.createElement(m0, { floatBarRef: n, open: a === tl.TextColor, setOpen: (W) => {
    i(W === !0 ? tl.TextColor : tl.none);
  }, textOpt: l, workIds: e }) : null, [l, a, e, s, n]), p = B(() => l && (s != null && s.viewId) ? h.createElement(W0, { open: a === tl.FontStyle, setOpen: (W) => {
    i(W === !0 ? tl.FontStyle : tl.none);
  }, textOpt: l, workIds: e, style: o }) : null, [l, a, e, s, o]), X = B(() => l && (s != null && s.viewId) ? h.createElement(X0, { open: a === tl.FontSize, setOpen: (W) => {
    i(W === !0 ? tl.FontSize : tl.none);
  }, textOpt: l, workIds: e, floatBarRef: n }) : null, [l, a, e, s, n]), V = B(() => c ? null : h.createElement(i0, { open: a === tl.Layer, setOpen: (W) => {
    i(W === !0 ? tl.Layer : tl.none);
  }, floatBarRef: n }), [c, a, n]), u = B(() => b != null && b.canLock && s ? h.createElement(r0, { workIds: e, maranger: s, islocked: b.isLocked }) : null, [b, s, e]), r = B(() => s && (s != null && s.viewId) && o && (b != null && b.shapeOpt) && (b != null && b.toolsTypes) ? h.createElement(S0, { open: a === tl.ShapeOpt, setOpen: (W) => {
    i(W === !0 ? tl.ShapeOpt : tl.none);
  }, floatBarRef: n, workIds: e, toolsTypes: b.toolsTypes, shapeOpt: b.shapeOpt }) : null, [b, s, a, o, e, n]);
  return h.createElement(
    "div",
    { className: "bezier-pencil-plugin-floatbtns", style: o, ref: n },
    s && h.createElement(s0, { workIds: e, maranger: s }),
    V,
    u,
    !!(s != null && s.viewId) && h.createElement(a0, { workIds: e, viewId: s.viewId }),
    r,
    X,
    p,
    m,
    G,
    Z
  );
}), z0 = (t) => {
  const { data: l, isActive: e, manager: c, workId: d } = t, { opt: b, scale: s, translate: a, x: i, y: n } = l, o = `scale(${s || 1}) ${a && "translate(" + a[0] + "px," + a[1] + "px)" || ""}`, { fontSize: Z, fontFamily: G, underline: m, fontColor: p, lineThrough: X, textAlign: V, strokeColor: u, lineHeight: r, bold: W, italic: x, uid: Y } = b, N = Z, T = r || N * 1.2, I = {
    fontSize: `${N}px`,
    lineHeight: `${T}px`,
    color: p,
    borderColor: u,
    minHeight: `${T}px`
  };
  G && (I.fontFamily = `${G}`), (X || m) && (I.textDecoration = `${X && "line-through" || ""}${m && " underline" || ""}`), W && (I.fontWeight = `${W}`), x && (I.fontStyle = `${x}`), V && (I.textAlign = `${V}`);
  let C = "";
  b != null && b.text && (C = b.text.split(",").reduce((g, j, ll) => {
    const $ = j === "" ? "<br/>" : j;
    return ll === 0 ? $ : `${g}<div>${$}</div>`;
  }, ""));
  function w() {
    var v, g;
    console.log("onServiceDerive---handleClick", e, Y, (v = c.control.collector) == null ? void 0 : v.uid), e && (Y && Y === ((g = c.control.collector) == null ? void 0 : g.uid) || !Y) && c.control.textEditorManager.active(d);
  }
  return h.createElement(
    "div",
    { className: "editor-box", style: {
      left: `${i}px`,
      top: `${n}px`,
      transform: o,
      transformOrigin: "left top",
      pointerEvents: "none"
    } },
    h.createElement("div", {
      className: `editor ${e ? "" : "readOnly"}`,
      // className={`editor ${(workState !== EvevtWorkState.Start && workState !== EvevtWorkState.Doing) ? 'readOnly' : ''}`}
      style: I,
      dangerouslySetInnerHTML: { __html: C },
      onClick: w
    })
  );
}, I0 = h.memo((t) => {
  const { data: l, position: e, workId: c, selectIds: d, updateOptInfo: b } = t, [s, a] = A([0, 0]), { opt: i, scale: n, translate: o, x: Z, y: G } = l, m = Bl(null);
  bl(() => {
    Wl(Z) && Wl(G) && a([Z - ((e == null ? void 0 : e.x) || 0), G - ((e == null ? void 0 : e.y) || 0)]);
  }, [Z, G, d, c]), bl(() => {
    var j, ll;
    if ((j = m.current) != null && j.offsetWidth && ((ll = m.current) != null && ll.offsetHeight)) {
      const $ = i.boxSize;
      (($ == null ? void 0 : $[0]) !== m.current.offsetWidth || $[1] !== m.current.offsetHeight || !$) && (console.log("updateForViewEdited---1--0", c, $, [m.current.offsetWidth, m.current.offsetHeight]), b({
        activeTextId: c,
        update: {
          boxSize: [m.current.offsetWidth, m.current.offsetHeight],
          workState: L.Done
        },
        syncData: {
          canSync: !0,
          canWorker: !0
        }
      }));
    }
  }, [i.fontSize]);
  const p = `scale(${n || 1}) ${o && "translate(" + o[0] + "px," + o[1] + "px)" || ""}`, { fontSize: X, fontFamily: V, underline: u, fontColor: r, lineThrough: W, textAlign: x, strokeColor: Y, lineHeight: N, bold: T, italic: I } = i, C = X, w = N || C * 1.2, v = {
    fontSize: `${C}px`,
    lineHeight: `${w}px`,
    color: r,
    borderColor: Y,
    minHeight: `${w}px`,
    pointerEvents: "none"
  };
  V && (v.fontFamily = `${V}`), (W || u) && (v.textDecoration = `${W && "line-through" || ""}${u && " underline" || ""}`), x && (v.textAlign = `${x}`), T && (v.fontWeight = `${T}`), I && (v.fontStyle = `${I}`);
  let g = "";
  return i != null && i.text && (g = i.text.split(",").reduce((ll, $, q) => {
    const O = $ === "" ? "<br/>" : $;
    return q === 0 ? O : `${ll}<div>${O}</div>`;
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
    h.createElement("div", { className: "editor readOnly", ref: m, style: v, dangerouslySetInnerHTML: { __html: g } })
  );
}), v0 = (t) => {
  const { data: l, workId: e, isSelect: c, handleKeyUp: d, handleFocus: b, updateOptInfo: s, showFloatBtns: a, manager: i } = t, [n, o] = A(), { opt: Z, scale: G, translate: m, x: p, y: X } = l, [V, u] = A(""), r = Bl(null);
  bl(() => {
    let K = "";
    Z != null && Z.text && (K = Z.text.split(",").reduce((P, il, hl) => {
      const Nl = il === "" ? "<br/>" : il;
      return hl === 0 ? Nl : `${P}<div>${Nl}</div>`;
    }, "")), u(K), Promise.resolve().then(() => {
      r.current && r.current.click();
    });
  }, []), bl(() => {
    var K, H;
    (K = r.current) != null && K.offsetWidth && ((H = r.current) != null && H.offsetHeight) && s({
      activeTextId: e,
      update: {
        boxSize: [r.current.offsetWidth, r.current.offsetHeight],
        workState: L.Doing
      }
    });
  });
  const W = `scale(${G || 1}) ${m && "translate(" + m[0] + "px," + m[1] + "px)" || ""}`, { fontSize: x, fontFamily: Y, underline: N, fontColor: T, lineThrough: I, textAlign: C, strokeColor: w, lineHeight: v, bold: g, italic: j } = Z, ll = x, $ = v || ll * 1.2, q = {
    transform: W,
    transformOrigin: "left top",
    fontSize: `${ll}px`,
    lineHeight: `${$}px`,
    color: T,
    borderColor: w,
    minHeight: `${$}px`
  };
  Y && (q.fontFamily = `${Y}`), (I || N) && (q.textDecoration = `${I && "line-through" || ""} ${N && " underline" || ""}`), C && (q.textAlign = `${C}`), g && (q.fontWeight = `${g}`), j && (q.fontStyle = `${j}`);
  function O() {
    var K;
    if (r.current) {
      r.current.focus();
      const H = window == null ? void 0 : window.getSelection(), P = r.current.lastChild;
      if (H && P) {
        const il = document.createRange(), hl = ((K = P.textContent) == null ? void 0 : K.length) || 0;
        (P == null ? void 0 : P.nodeName) === "#text" ? il.setStart(P, hl) : il.setStart(P, hl && 1 || 0), il.collapse(!0), H.removeAllRanges(), H.addRange(il);
      }
    }
  }
  function E(K) {
    if (K.key === "Backspace") {
      const H = window.getSelection(), P = H == null ? void 0 : H.getRangeAt(0);
      if (P != null && P.collapsed)
        return K.preventDefault(), document.execCommand("delete", !1), !1;
    }
    return !1;
  }
  function J(K) {
    var H, P;
    if (K.preventDefault(), r.current) {
      let il = (K.clipboardData || window.clipboardData).getData("text");
      il = il.toUpperCase();
      const hl = window == null ? void 0 : window.getSelection();
      if (!(hl != null && hl.rangeCount))
        return;
      const Nl = il.split(/\n/);
      if (hl && Nl.length) {
        hl.deleteFromDocument();
        const kl = document.createRange();
        let pl = r.current.lastChild;
        if (!pl) {
          const Jl = document.createTextNode(Nl[0]);
          if (r.current.appendChild(Jl), Nl.length === 1) {
            const oe = ((H = Jl.textContent) == null ? void 0 : H.length) || 0;
            kl.setStart(Jl, oe), kl.collapse(!0), hl.removeAllRanges(), hl.addRange(kl);
            return;
          }
        }
        if ((pl == null ? void 0 : pl.nodeName) === "#text" && (pl.textContent = pl.textContent + Nl[0], Nl.length === 1)) {
          const Jl = ((P = pl.textContent) == null ? void 0 : P.length) || 0;
          kl.setStart(pl, Jl), kl.collapse(!0), hl.removeAllRanges(), hl.addRange(kl);
          return;
        }
        (pl == null ? void 0 : pl.nodeName) === "DIV" && (pl.innerText = pl.innerText + Nl[0]);
        for (let Jl = 1; Jl < Nl.length; Jl++) {
          const oe = Nl[Jl];
          if (oe) {
            const ic = document.createElement("div");
            ic.innerText = oe, r.current.appendChild(ic);
          }
        }
        pl = r.current.lastChild, pl && kl.setStart(pl, 1), kl.collapse(!0), hl.removeAllRanges(), hl.addRange(kl);
      }
    }
  }
  return h.createElement(
    "div",
    { className: "editor-box", style: {
      left: `${p}px`,
      top: `${X}px`,
      zIndex: 2,
      pointerEvents: "none"
    }, onFocus: () => {
      i.control.room && !i.control.room.disableDeviceInputs && (o(i.control.room.disableDeviceInputs), i.control.room.disableDeviceInputs = !0);
    }, onBlur: () => {
      i != null && i.control.room && Vl(n) && (i.control.room.disableDeviceInputs = n);
    }, onKeyDown: (K) => (K.stopPropagation(), !0), onMouseMove: (K) => (K.stopPropagation(), K.preventDefault(), !0) },
    !c && a && h.createElement(jt, { textOpt: Z, workIds: [e], noLayer: !0, position: { x: p, y: X } }),
    h.createElement("div", { id: e, contentEditable: !0, className: "editor", ref: r, style: q, dangerouslySetInnerHTML: { __html: V }, onKeyDown: E, onKeyUp: d, onClick: O, onTouchEnd: O, onFocus: b, onPaste: J })
  );
};
class ft extends h.Component {
  constructor(l) {
    super(l);
  }
  getInnerText(l) {
    const e = [];
    for (let c = 0; c < l.childNodes.length; c++) {
      const d = l.childNodes[c];
      if (d.nodeName === "#text" && c === 0) {
        const b = d.textContent.split(/\n/), s = b.pop();
        e.push(...b), s && e.push(s);
      } else if (d.nodeName === "DIV") {
        const b = d.innerText.split(/\n/);
        if (b.length === 2 && b[0] === "" && b[1] === "")
          e.push("");
        else {
          const s = b.shift();
          s && e.push(s);
          const a = b.pop();
          e.push(...b), a && e.push(a);
        }
      }
    }
    return e;
  }
  updateOptInfo(l) {
    var s, a;
    const { activeTextId: e, update: c, syncData: d } = l, b = e && sl(((s = this.props.manager.control.textEditorManager) == null ? void 0 : s.get(e)) || ((a = this.props.editors) == null ? void 0 : a.get(e)));
    b && b.opt && (b.opt = {
      ...b.opt,
      ...c
    }, d && (b.canSync = d.canSync, b.canWorker = d.canWorker), this.props.manager.control.textEditorManager.updateForViewEdited(e, b));
  }
  get editorUI() {
    var l;
    if ((l = this.props.editors) != null && l.size) {
      const e = [];
      return this.props.editors.forEach((c, d) => {
        if (this.props.selectIds.includes(d) && !(this.props.activeTextId == d)) {
          const s = h.createElement(I0, { key: d, data: c, workId: d, isSelect: !0, position: this.props.position, selectIds: this.props.selectIds, updateOptInfo: this.updateOptInfo.bind(this), manager: this.props.manager });
          e.push(s);
        }
      }), e;
    }
    return null;
  }
  render() {
    return h.createElement("div", { ref: this.props.textRef }, this.editorUI);
  }
}
class H0 extends ft {
  constructor(l) {
    super(l);
  }
  handleKeyUp(l) {
    const e = this.getInnerText(l.nativeEvent.target), c = this.props.activeTextId;
    c && this.updateOptInfo({
      activeTextId: c,
      update: {
        text: e.toString(),
        boxSize: [l.nativeEvent.target.offsetWidth, l.nativeEvent.target.offsetHeight],
        workState: L.Doing
      },
      syncData: {
        canSync: !0,
        canWorker: !0
      }
    });
  }
  handleFocus(l) {
    const e = this.props.activeTextId;
    e && this.updateOptInfo({
      activeTextId: e,
      update: {
        boxSize: [l.nativeEvent.target.offsetWidth, l.nativeEvent.target.offsetHeight],
        workState: L.Doing
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
      const e = [];
      return this.props.editors.forEach((c, d) => {
        if (!(this.props.selectIds.includes(d) && this.props.activeTextId !== d)) {
          const a = this.props.activeTextId == d ? h.createElement(v0, { key: d, data: c, workId: d, showFloatBtns: this.props.showFloatBtns || !1, handleFocus: this.handleFocus.bind(this), handleKeyUp: this.handleKeyUp.bind(this), updateOptInfo: this.updateOptInfo.bind(this), manager: this.props.manager }) : h.createElement(z0, { manager: this.props.manager, isActive: c.opt.workState === L.Doing || c.opt.workState === L.Start || !1, key: d, data: c, workId: d });
          e.push(a);
        }
      }), e;
    }
    return null;
  }
  render() {
    return h.createElement("div", { className: `${this.props.className}` }, this.editorUI);
  }
}
const k0 = () => {
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
}, J0 = () => {
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
}, w0 = () => {
  const { floatBarData: t } = Gl(nl);
  return h.createElement(
    "div",
    { className: "bezier-pencil-plugin-hightlight-box", style: {
      borderColor: t == null ? void 0 : t.selectorColor
    } },
    h.createElement("img", { className: "lock", alt: "lock", src: "https://sdk.netless.link/resource/icons/lock.svg" })
  );
}, U0 = h.forwardRef((t, l) => {
  const { floatBarData: e, zIndex: c, position: d, angle: b, operationType: s, setPosition: a, setOperationType: i, maranger: n } = Gl(nl), { className: o, editors: Z, activeTextId: G } = t, m = Bl(null), [p, X] = A(L.Pending), [V, u] = A(), r = (w) => {
    w.preventDefault(), w.stopPropagation(), i(R.TranslateNode), X(L.Start), u(d), n != null && n.control.room && (n.control.room.disableDeviceInputs = !0), f.emitMethod(F.MainEngine, R.TranslateNode, { workIds: [z], position: d, workState: L.Start, viewId: n == null ? void 0 : n.viewId });
  }, W = al((w, v) => {
    w.preventDefault(), w.stopPropagation();
    const g = { x: v.x, y: v.y };
    a(g), i(R.None), X(L.Done), n != null && n.control.room && (n.control.room.disableDeviceInputs = !1), console.log("onDragEndHandler"), f.emitMethod(F.MainEngine, R.TranslateNode, { workIds: [z], position: g, workState: L.Done, viewId: n == null ? void 0 : n.viewId });
  }, 100, { leading: !1 }), x = al((w, v) => {
    w.preventDefault(), w.stopPropagation();
    const g = { x: v.x, y: v.y };
    (v.x !== (d == null ? void 0 : d.x) || v.y !== (d == null ? void 0 : d.y)) && (a(g), X(L.Doing), f.emitMethod(F.MainEngine, R.TranslateNode, { workIds: [z], position: g, workState: L.Doing, viewId: n == null ? void 0 : n.viewId }));
  }, 100, { leading: !1 }), Y = B(() => (e == null ? void 0 : e.scaleType) !== rl.all || s === R.RotateNode ? null : h.createElement(k0, null), [e, s]), N = B(() => (e == null ? void 0 : e.scaleType) !== rl.both || s === R.RotateNode ? null : h.createElement(J0, null), [e, s]), T = B(() => (e == null ? void 0 : e.scaleType) !== rl.proportional || s === R.RotateNode ? null : h.createElement(C0, null), [e, s]), I = B(() => (e == null ? void 0 : e.scaleType) === rl.none && (e != null && e.canLock) ? h.createElement(w0, null) : null, [e]), C = B(() => {
    const w = (e == null ? void 0 : e.selectIds) || [];
    return Z && n && w ? h.createElement(ft, { manager: n, textRef: m, selectIds: w, position: d, activeTextId: G, editors: Z }) : null;
  }, [e == null ? void 0 : e.selectIds, Z, n, G]);
  return h.createElement(
    ie,
    { disabled: !!(e != null && e.isLocked), position: d, onStart: r, onDrag: x, onStop: W, handle: "canvas" },
    h.createElement(
      "div",
      {
        className: `${o}`,
        style: e ? {
          width: e.w,
          height: e.h,
          zIndex: c,
          pointerEvents: c < 2 || I ? "none" : "auto"
        } : void 0,
        // onMouseMove={(e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        // }}
        onClick: al((w) => {
          if (w.stopPropagation(), w.preventDefault(), n && (Z != null && Z.size) && m.current && Zl(V, d)) {
            const v = n.getPoint(w.nativeEvent);
            v && n.control.textEditorManager.computeTextActive(v, n.viewId);
          }
          return !1;
        }, 100, { leading: !1 }),
        onTouchEndCapture: al((w) => {
          if (w.stopPropagation(), w.preventDefault(), n && (Z != null && Z.size) && m.current && p !== L.Doing) {
            const v = n.getPoint(w.nativeEvent);
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
}), g0 = h.memo(U0, (t, l) => Zl(t, l) ? !0 : (console.log("FloatBar-----isEqual", !1), !1)), F0 = (t) => {
  const { floatBarData: l, position: e, operationType: c } = Gl(nl), { className: d } = t;
  return c === R.None ? h.createElement(
    "div",
    { className: `${d}`, style: l ? {
      left: e == null ? void 0 : e.x,
      top: e == null ? void 0 : e.y,
      width: l.w,
      height: l.h
    } : void 0 },
    h.createElement(jt, { textOpt: l == null ? void 0 : l.textOpt, position: e, noLayer: l == null ? void 0 : l.isLocked })
  ) : null;
}, K0 = (t) => {
  const { className: l } = t, { floatBarData: e, angle: c, setAngle: d, position: b, setOperationType: s, maranger: a } = Gl(nl), [i, n] = A(!1), [o, Z] = A(new dl()), [G, m] = A(new dl());
  bl(() => {
    if (e) {
      const u = Math.floor(e.w / 2), r = Math.floor(-e.h / 2);
      m(new dl(u, r)), Z(new dl());
    }
  }, [e, b]);
  const p = (u, r) => {
    u.preventDefault(), u.stopPropagation(), n(!0);
    const W = Math.round(dl.GetAngleByPoints(o, G, new dl(r.x, r.y))) || 0;
    d(W), s(R.RotateNode), a != null && a.control.room && (a.control.room.disableDeviceInputs = !0), f.emitMethod(F.MainEngine, R.RotateNode, { workIds: [z], angle: W, workState: L.Start, viewId: a == null ? void 0 : a.viewId });
  }, X = al((u, r) => {
    u.preventDefault(), u.stopPropagation(), n(!1);
    const W = Math.round(dl.GetAngleByPoints(o, G, new dl(r.x, r.y))) || 0;
    d(W), s(R.None), a != null && a.control.room && (a.control.room.disableDeviceInputs = !1), f.emitMethod(F.MainEngine, R.RotateNode, { workIds: [z], angle: W, workState: L.Done, viewId: a == null ? void 0 : a.viewId });
  }, 100, { leading: !1 }), V = al((u, r) => {
    u.preventDefault(), u.stopPropagation(), n(!0);
    const W = Math.round(dl.GetAngleByPoints(o, G, new dl(r.x, r.y))) || 0;
    d(W), s(R.RotateNode), f.emitMethod(F.MainEngine, R.RotateNode, { workIds: [z], angle: W, workState: L.Doing, viewId: a == null ? void 0 : a.viewId });
  }, 100, { leading: !1 });
  return h.createElement(
    ie,
    { handle: ".bezier-pencil-plugin-rotate-mouse-pointer", onStart: p, onDrag: V, onStop: X },
    h.createElement(
      "div",
      { className: `${l}`, style: b && e ? {
        left: b.x - 30,
        top: b.y + e.h + 20
      } : void 0 },
      !i && h.createElement(
        "div",
        { className: "bezier-pencil-plugin-rotate-btn", style: { backgroundColor: e == null ? void 0 : e.selectorColor } },
        h.createElement("img", { alt: "icon", src: ml("rotation-button") })
      ),
      h.createElement(
        "div",
        { className: `bezier-pencil-plugin-rotate-mouse-pointer ${i ? "active" : ""}` },
        h.createElement("img", { alt: "icon", src: ml("rotation") }),
        h.createElement(
          "div",
          { className: "angle-icon" },
          c,
          "°"
        )
      )
    )
  );
}, j0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAYISURBVHgB7ZpNSCtXFIBPEuvz+dMGpYUKD/sWFX+Qti6kK7Hqpm6e9q0rIoIUFUShPLV10VZx4+JZqa9v20LBhdq9fyBUCtKNPH8qYl2IOw3G38Rkek4y15y5uTOZJDOWggcOSSYzN/ebc+45554JwIM8iBCPyTEP+86T4vyMfsRN4b+nQTKIJp0vzuGvlpID7os8EQNEIBD4oKio6Bm9DwaDv/v9/n/076JgbtWUYPchwrW8qD7UnOvr6wFNkpubm+/wu7f0c7y6mrnlvQufxB0Iau7V1dX3BDA/P6/V1dVpzc3N2uLiIofK1c8VYHys/wRKBUN3/hGHqaysNOjc3FwMis6hc0FtLTHuvYLxCCZgci8uLn4wg5Gh6Fy8Jk+/NkcCAlAAuUkoW4g0B+d5tLS05O/r67O8eGxsDNra2uDy8nKsoKCAwCIQDxQa0yTxgrvCYXyTk5Ml+Orf2dlJeeHIyAigFSE/P38ELfUNqNdSkjgF5FF89jL1TU1NlQwODl5gZPujp6cHWltbUw7Koc7Pz8mkZpHPFeFrJuZeqLnoMoPoZqe0JjDP/IZgnyLUG/o8NDRkuo5Ua2pjY6MC4oFCFf1cA0oKzRSOp6enRfTaGh0d/QxBt+1CUVgnOTs7+xrHfQzGyOcKkK3QTJMnQffZ6e/v/xwttmsHqqmpKXbdycnJCxy7ABLh3FEgVZ6hZJhnFZoFFMF0d3c/w7v+dyookXBnZ2c/xvHfhriVcvXfdBRItsxjnOhYqjwjoAimq6vrCysoGofk+Ph4Esd/F/UdiFtJAGUd2DygTpp5dmBUUJ2dnc9VUALm8PDwJY7/BPU9VD8k3M4RC6kskxZMKigKIMLN9vf3p3H8DyWgfEhEOwOQD9IXOTz7EObbwsLC4YWFBRgeHrY9ECXYo6MjaGlpKWlsbPxkYGDgRW1tbSEWquVlZWXBzc3Nl1VVVa8hXiXc6ioqBqGaPDk7AACJTRZ3NS9lcUp86cJwoSQ7Pj4Op6enfxUXF3/V0NCQv7q6GsCvwrqGUG/01xAD4+VQTOxaSF43d5bBOisrGBJRCtXX17+/trb268rKSgASFgmz97KFkmo6OztWuVyPweiWGc4WRkhFRQVEIpHg8vJyQAIQVlLBROVxvBYQHsXnO8tk62ZcyN0wecLBwcEvYHSzEPscBqOLCRhLC4n9uqaA8UAWAcAKhtbQ3t7eTHl5+Y9gtAp3twhT056CDMQ7MRzIFTeTYKb1yYYVQFH9VdzsqNmYKpfTJBDX3Ixgdnd3XyHMT2AMALJlBBSPaMpNngrIsTyTCgaj288YDGakictrxizvKFNOjgSSBLS+vv6UYHDb7DgMVgsChjTEgCIKGG4ZU+EWkgNBzN1qamq+pAMTExPgFMzW1tZrhHkFyWE5KxgSszx0527RaDRmOSpRshEOU11dPQPG8CwHARHJlMnTSrwSRFIlfXt7m3V5ngJGuJtqzaQtZkFBVNJezN5ZAdmwjKo2k9tVtrcI3OXk4tPgcg7ChCDZ1URgMOu72Xa5VFHOkymQhWVU60YVmjN6wiC7k6p+S1syCACOwJBYFaexV+yhBekNPsMBO6KAEeE4BMaCU67RsoYhSbXgaT//ht709vZCaWmp6YkEbLFmVJWzas04+iBL7EKpm0J7duqu0B7+CTUpNJuyvb1NCfMj1CqI9wLKUOlOUMeG+gGFkHii4HizUF4z/KFUrPsJ8WbEIyx7nnZ0dDynME6BAuce09iFHo+GrnmGltltb2//E4wVAN82y7vOjKOZXSBhJdHNiT3TYWD8OY2PTUJkdd7MkJMnT5wZVQF2RFX6yBMUdzPMvvfqxz3sXHF+GNT9ANXit/10O1sgHkZvdQAOKvs9B5L7ARELGAAXLSTvM8QExTE+YbHe+HURhZp1aRyF4CJXClbbWwGketgkW9VsY+YaiBCVhfgE+XvxRwgZSM4jUVCDZFQ9pytmXR8hUTB2gnidx4XffVWydN0yQjwmx/jkAZJBrIBI5J7ZvQGZWUgVSuU/EqmOAzicKNMVu816DdRWUV1/7xAP8n+SfwF3Du3NF2sYhwAAAABJRU5ErkJggg==", f0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='40px'%20height='40px'%20viewBox='0%200%2040%2040'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3c!--%20Generator:%20Sketch%2060.1%20(88133)%20-%20https://sketch.com%20--%3e%3ctitle%3eshape-cursor%3c/title%3e%3cdesc%3eCreated%20with%20Sketch.%3c/desc%3e%3cdefs%3e%3cpath%20d='M20,21.5%20C20.2454599,21.5%2020.4496084,21.6768752%2020.4919443,21.9101244%20L20.5,22%20L20.5,27%20C20.5,27.2761424%2020.2761424,27.5%2020,27.5%20C19.7545401,27.5%2019.5503916,27.3231248%2019.5080557,27.0898756%20L19.5,27%20L19.5,22%20C19.5,21.7238576%2019.7238576,21.5%2020,21.5%20Z%20M27,19.5%20C27.2761424,19.5%2027.5,19.7238576%2027.5,20%20C27.5,20.2454599%2027.3231248,20.4496084%2027.0898756,20.4919443%20L27,20.5%20L22,20.5%20C21.7238576,20.5%2021.5,20.2761424%2021.5,20%20C21.5,19.7545401%2021.6768752,19.5503916%2021.9101244,19.5080557%20L22,19.5%20L27,19.5%20Z%20M18,19.5%20C18.2761424,19.5%2018.5,19.7238576%2018.5,20%20C18.5,20.2454599%2018.3231248,20.4496084%2018.0898756,20.4919443%20L18,20.5%20L13,20.5%20C12.7238576,20.5%2012.5,20.2761424%2012.5,20%20C12.5,19.7545401%2012.6768752,19.5503916%2012.9101244,19.5080557%20L13,19.5%20L18,19.5%20Z%20M20,12.5%20C20.2454599,12.5%2020.4496084,12.6768752%2020.4919443,12.9101244%20L20.5,13%20L20.5,18%20C20.5,18.2761424%2020.2761424,18.5%2020,18.5%20C19.7545401,18.5%2019.5503916,18.3231248%2019.5080557,18.0898756%20L19.5,18%20L19.5,13%20C19.5,12.7238576%2019.7238576,12.5%2020,12.5%20Z'%20id='path-1'%3e%3c/path%3e%3cfilter%20x='-64.6%25'%20y='-59.5%25'%20width='229.3%25'%20height='246.1%25'%20filterUnits='objectBoundingBox'%20id='filter-2'%3e%3cfeMorphology%20radius='1'%20operator='dilate'%20in='SourceAlpha'%20result='shadowSpreadOuter1'%3e%3c/feMorphology%3e%3cfeOffset%20dx='0'%20dy='2'%20in='shadowSpreadOuter1'%20result='shadowOffsetOuter1'%3e%3c/feOffset%3e%3cfeGaussianBlur%20stdDeviation='3'%20in='shadowOffsetOuter1'%20result='shadowBlurOuter1'%3e%3c/feGaussianBlur%3e%3cfeComposite%20in='shadowBlurOuter1'%20in2='SourceAlpha'%20operator='out'%20result='shadowBlurOuter1'%3e%3c/feComposite%3e%3cfeColorMatrix%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.16%200'%20type='matrix'%20in='shadowBlurOuter1'%3e%3c/feColorMatrix%3e%3c/filter%3e%3c/defs%3e%3cg%20id='页面-4'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cg%20id='Whiteboard-Guidelines'%20transform='translate(-344.000000,%20-751.000000)'%3e%3cg%20id='shape-cursor'%20transform='translate(344.000000,%20751.000000)'%3e%3crect%20id='矩形备份-44'%20fill='%23FFFFFF'%20opacity='0.01'%20x='0'%20y='0'%20width='40'%20height='40'%20rx='2'%3e%3c/rect%3e%3cg%20id='形状结合'%20fill-rule='nonzero'%3e%3cuse%20fill='black'%20fill-opacity='1'%20filter='url(%23filter-2)'%20xlink:href='%23path-1'%3e%3c/use%3e%3cpath%20stroke='%23FFFFFF'%20stroke-width='1'%20d='M20,21%20C20.4854103,21%2020.898085,21.3479993%2020.9899479,21.8654877%20L21,22%20L21,27%20C21,27.5522847%2020.5522847,28%2020,28%20C19.5145897,28%2019.101915,27.6520007%2019.0100521,27.1345123%20L19,27%20L19,22%20C19,21.4477153%2019.4477153,21%2020,21%20Z%20M27,19%20C27.5522847,19%2028,19.4477153%2028,20%20C28,20.4854103%2027.6520007,20.898085%2027.1345123,20.9899479%20L27,21%20L22,21%20C21.4477153,21%2021,20.5522847%2021,20%20C21,19.5145897%2021.3479993,19.101915%2021.8654877,19.0100521%20L22,19%20L27,19%20Z%20M18,19%20C18.5522847,19%2019,19.4477153%2019,20%20C19,20.4854103%2018.6520007,20.898085%2018.1345123,20.9899479%20L18,21%20L13,21%20C12.4477153,21%2012,20.5522847%2012,20%20C12,19.5145897%2012.3479993,19.101915%2012.8654877,19.0100521%20L13,19%20L18,19%20Z%20M20,12%20C20.4854103,12%2020.898085,12.3479993%2020.9899479,12.8654877%20L21,13%20L21,18%20C21,18.5522847%2020.5522847,19%2020,19%20C19.5145897,19%2019.101915,18.6520007%2019.0100521,18.1345123%20L19,18%20L19,13%20C19,12.4477153%2019.4477153,12%2020,12%20Z'%20fill='%23212324'%20fill-rule='evenodd'%3e%3c/path%3e%3c/g%3e%3crect%20id='矩形'%20fill='%23FFFFFF'%20x='18.5'%20y='17'%20width='3'%20height='6'%3e%3c/rect%3e%3crect%20id='矩形'%20fill='%23FFFFFF'%20x='17'%20y='18.5'%20width='6'%20height='3'%3e%3c/rect%3e%3cpath%20d='M20,21.5%20C20.2454599,21.5%2020.4496084,21.6768752%2020.4919443,21.9101244%20L20.5,22%20L20.5,27%20C20.5,27.2761424%2020.2761424,27.5%2020,27.5%20C19.7545401,27.5%2019.5503916,27.3231248%2019.5080557,27.0898756%20L19.5,27%20L19.5,22%20C19.5,21.7238576%2019.7238576,21.5%2020,21.5%20Z%20M27,19.5%20C27.2761424,19.5%2027.5,19.7238576%2027.5,20%20C27.5,20.2454599%2027.3231248,20.4496084%2027.0898756,20.4919443%20L27,20.5%20L22,20.5%20C21.7238576,20.5%2021.5,20.2761424%2021.5,20%20C21.5,19.7545401%2021.6768752,19.5503916%2021.9101244,19.5080557%20L22,19.5%20L27,19.5%20Z%20M18,19.5%20C18.2761424,19.5%2018.5,19.7238576%2018.5,20%20C18.5,20.2454599%2018.3231248,20.4496084%2018.0898756,20.4919443%20L18,20.5%20L13,20.5%20C12.7238576,20.5%2012.5,20.2761424%2012.5,20%20C12.5,19.7545401%2012.6768752,19.5503916%2012.9101244,19.5080557%20L13,19.5%20L18,19.5%20Z%20M20,12.5%20C20.2454599,12.5%2020.4496084,12.6768752%2020.4919443,12.9101244%20L20.5,13%20L20.5,18%20C20.5,18.2761424%2020.2761424,18.5%2020,18.5%20C19.7545401,18.5%2019.5503916,18.3231248%2019.5080557,18.0898756%20L19.5,18%20L19.5,13%20C19.5,12.7238576%2019.7238576,12.5%2020,12.5%20Z'%20id='形状结合'%20fill='%23212324'%20fill-rule='nonzero'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e", P0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='47px'%20height='40px'%20viewBox='0%200%2047%2040'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3c!--%20Generator:%20Sketch%2060.1%20(88133)%20-%20https://sketch.com%20--%3e%3ctitle%3etext-cursor%3c/title%3e%3cdesc%3eCreated%20with%20Sketch.%3c/desc%3e%3cdefs%3e%3cpath%20d='M16,26.5%20C15.7238576,26.5%2015.5,26.2761424%2015.5,26%20C15.5,25.7545401%2015.6768752,25.5503916%2015.9101244,25.5080557%20L16,25.5%20L19.5,25.5%20L19.5,14.5%20L16,14.5%20C15.7238576,14.5%2015.5,14.2761424%2015.5,14%20C15.5,13.7545401%2015.6768752,13.5503916%2015.9101244,13.5080557%20L16,13.5%20L24,13.5%20C24.2761424,13.5%2024.5,13.7238576%2024.5,14%20C24.5,14.2454599%2024.3231248,14.4496084%2024.0898756,14.4919443%20L24,14.5%20L20.5,14.5%20L20.5,25.5%20L24,25.5%20C24.2761424,25.5%2024.5,25.7238576%2024.5,26%20C24.5,26.2454599%2024.3231248,26.4496084%2024.0898756,26.4919443%20L24,26.5%20L16,26.5%20Z'%20id='path-1'%3e%3c/path%3e%3cfilter%20x='-284.0%25'%20y='-81.5%25'%20width='668.1%25'%20height='293.9%25'%20filterUnits='objectBoundingBox'%20id='filter-2'%3e%3cfeMorphology%20radius='1'%20operator='dilate'%20in='SourceAlpha'%20result='shadowSpreadOuter1'%3e%3c/feMorphology%3e%3cfeOffset%20dx='0'%20dy='2'%20in='shadowSpreadOuter1'%20result='shadowOffsetOuter1'%3e%3c/feOffset%3e%3cfeGaussianBlur%20stdDeviation='3'%20in='shadowOffsetOuter1'%20result='shadowBlurOuter1'%3e%3c/feGaussianBlur%3e%3cfeComposite%20in='shadowBlurOuter1'%20in2='SourceAlpha'%20operator='out'%20result='shadowBlurOuter1'%3e%3c/feComposite%3e%3cfeColorMatrix%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.16%200'%20type='matrix'%20in='shadowBlurOuter1'%3e%3c/feColorMatrix%3e%3c/filter%3e%3c/defs%3e%3cg%20id='页面-4'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cg%20id='Whiteboard-Guidelines'%20transform='translate(-388.000000,%20-672.000000)'%3e%3cg%20id='text-cursor'%20transform='translate(392.000000,%20672.000000)'%3e%3crect%20id='矩形备份-40'%20fill='%23FFFFFF'%20opacity='0.01'%20x='0'%20y='0'%20width='40'%20height='40'%20rx='2'%3e%3c/rect%3e%3cg%20id='形状结合'%20fill-rule='nonzero'%3e%3cuse%20fill='black'%20fill-opacity='1'%20filter='url(%23filter-2)'%20xlink:href='%23path-1'%3e%3c/use%3e%3cpath%20stroke='%23FFFFFF'%20stroke-width='1'%20d='M19,25%20L19,15%20L16,15%20C15.4477153,15%2015,14.5522847%2015,14%20C15,13.5145897%2015.3479993,13.101915%2015.8654877,13.0100521%20L16,13%20L24,13%20C24.5522847,13%2025,13.4477153%2025,14%20C25,14.4854103%2024.6520007,14.898085%2024.1345123,14.9899479%20L24,15%20L21,15%20L21,25%20L24,25%20C24.5522847,25%2025,25.4477153%2025,26%20C25,26.4854103%2024.6520007,26.898085%2024.1345123,26.9899479%20L24,27%20L16,27%20C15.4477153,27%2015,26.5522847%2015,26%20C15,25.5145897%2015.3479993,25.101915%2015.8654877,25.0100521%20L16,25%20L19,25%20Z'%20fill='%23212324'%20fill-rule='evenodd'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
class Q0 extends h.Component {
  constructor(l) {
    super(l), Object.defineProperty(this, "renderAvatar", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        var d;
        const c = `rgb(${e.memberState.strokeColor[0]}, ${e.memberState.strokeColor[1]}, ${e.memberState.strokeColor[2]})`;
        if (this.detectAvatar(e)) {
          const b = this.detectCursorName(e);
          return h.createElement("img", { className: "cursor-selector-avatar", style: {
            width: b ? 19 : 28,
            height: b ? 19 : 28,
            position: b ? "initial" : "absolute",
            borderColor: b ? "white" : c,
            marginRight: b ? 4 : 0
          }, src: (d = e.payload) == null ? void 0 : d.avatar, alt: "avatar" });
        } else
          return null;
      }
    }), Object.defineProperty(this, "getOpacity", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        const c = this.getCursorName(e), d = this.detectAvatar(e);
        return c === void 0 && d === void 0 ? 0 : 1;
      }
    }), Object.defineProperty(this, "getCursorName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        if (e.payload && e.payload.cursorName)
          return e.payload.cursorName;
      }
    }), Object.defineProperty(this, "getThemeClass", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => e.payload && e.payload.theme ? "cursor-inner-mellow" : "cursor-inner"
    }), Object.defineProperty(this, "getCursorBackgroundColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        const c = this.detectCursorName(e);
        return e.payload && e.payload.cursorBackgroundColor ? e.payload.cursorBackgroundColor : c ? `rgb(${e.memberState.strokeColor[0]}, ${e.memberState.strokeColor[1]}, ${e.memberState.strokeColor[2]})` : void 0;
      }
    }), Object.defineProperty(this, "getCursorTextColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => e.payload && e.payload.cursorTextColor ? e.payload.cursorTextColor : "#FFFFFF"
    }), Object.defineProperty(this, "getCursorTagBackgroundColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => e.payload && e.payload.cursorTagBackgroundColor ? e.payload.cursorTagBackgroundColor : this.getCursorBackgroundColor(e)
    }), Object.defineProperty(this, "detectCursorName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => !!(e.payload && e.payload.cursorName)
    }), Object.defineProperty(this, "detectAvatar", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => !!(e.payload && e.payload.avatar)
    }), Object.defineProperty(this, "renderTag", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        if (e.payload && e.payload.cursorTagName)
          return h.createElement("span", { className: "cursor-tag-name", style: { backgroundColor: this.getCursorTagBackgroundColor(e) } }, e.payload.cursorTagName);
      }
    });
  }
  render() {
    const { roomMember: l } = this.props, e = this.getCursorName(l);
    switch (l.memberState.currentApplianceName) {
      case D.pencil:
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
                e,
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
      case D.text:
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
                e,
                this.renderTag(l)
              )
            ),
            h.createElement(
              "div",
              null,
              h.createElement("img", { className: "cursor-arrow-image", src: P0, alt: "textCursor" })
            )
          )
        );
      case D.rectangle:
      case D.arrow:
      case D.straight:
      case D.shape:
      case D.ellipse:
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
                e,
                this.renderTag(l)
              )
            ),
            h.createElement(
              "div",
              null,
              h.createElement("img", { className: "cursor-arrow-image", src: f0, alt: "shapeCursor" })
            )
          )
        );
      default:
        return null;
    }
  }
}
const B0 = (t) => {
  const { className: l, info: e } = t, { roomMember: c, ...d } = e || {};
  return h.createElement("div", { className: `${l}`, style: d ? {
    transform: `translate(${d.x}px, ${d.y}px)`
  } : { display: "none" } }, c && h.createElement(Q0, { roomMember: c }));
}, O0 = (t) => {
  const { className: l, manager: e } = t, [c, d] = A();
  bl(() => (e.internalMsgEmitter.on([F.Cursor, e.viewId], b), () => {
    e.internalMsgEmitter.off([F.Cursor, e.viewId], b);
  }), [e]);
  function b(a) {
    d(a);
  }
  return B(() => c != null && c.length ? c.map((a) => {
    var i;
    return a.roomMember ? h.createElement(B0, { key: (i = a.roomMember) == null ? void 0 : i.memberId, className: l, info: a }) : null;
  }) : null, [c]);
}, D0 = (t) => {
  const { className: l } = t, [e, c] = A({ x: 0, y: 0, h: 0, w: 0 }), { floatBarData: d, position: b, maranger: s } = Gl(nl);
  bl(() => {
    d && c({ x: d.x, y: d.y, w: d.w, h: d.h });
  }, []);
  const a = (o) => {
    if (o.preventDefault(), o.stopPropagation(), d != null && d.w && (d != null && d.h)) {
      const Z = {
        x: (b == null ? void 0 : b.x) || 0,
        y: (b == null ? void 0 : b.y) || 0,
        w: d.w,
        h: d.h
      };
      c(Z), s != null && s.control.room && (s.control.room.disableDeviceInputs = !0), f.emitMethod(F.MainEngine, R.ScaleNode, { workIds: [z], box: Z, workState: L.Start, viewId: s == null ? void 0 : s.viewId });
    }
  }, i = al((o, Z, G, m) => {
    o.preventDefault(), o.stopPropagation();
    const p = {
      x: e.x,
      y: e.y,
      w: e.w,
      h: e.h
    };
    switch (p.w += m.width, p.h += m.height, Z) {
      case "bottomLeft":
      case "left":
        p.x -= m.width;
        break;
      case "topLeft":
        p.x -= m.width, p.y -= m.height;
        break;
      case "top":
      case "topRight":
        p.y -= m.height;
        break;
    }
    (m.width !== 0 || m.height !== 0) && f.emitMethod(F.MainEngine, R.ScaleNode, { workIds: [z], box: p, dir: Z, workState: L.Doing, viewId: s == null ? void 0 : s.viewId });
  }, 100, { leading: !1 }), n = al((o, Z, G, m) => {
    o.preventDefault(), o.stopPropagation();
    const p = {
      x: e.x,
      y: e.y,
      w: e.w,
      h: e.h
    };
    switch (p.w += m.width, p.h += m.height, Z) {
      case "bottomLeft":
      case "left":
        p.x -= m.width;
        break;
      case "topLeft":
        p.x -= m.width, p.y -= m.height;
        break;
      case "top":
      case "topRight":
        p.y -= m.height;
        break;
    }
    s != null && s.control.room && (s.control.room.disableDeviceInputs = !1), f.emitMethod(F.MainEngine, R.ScaleNode, { workIds: [z], box: p, dir: Z, workState: L.Done, viewId: s == null ? void 0 : s.viewId });
  }, 100, { leading: !1 });
  return h.createElement(Ot, { className: `${l}`, boundsByDirection: !0, size: {
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
  const { id: l, pos: e, pointMap: c, type: d } = t, { setOperationType: b, maranger: s, floatBarData: a } = Gl(nl), [i, n] = A({ x: 0, y: 0 }), [o, Z] = A(L.Pending);
  bl(() => {
    (o === L.Pending || o === L.Done) && n(e);
  }, [e, o]);
  const G = (X) => {
    X.preventDefault(), X.stopPropagation(), b(R.SetPoint), Z(L.Start), s != null && s.control.room && (s.control.room.disableDeviceInputs = !0), f.emitMethod(F.MainEngine, R.SetPoint, { workId: z, pointMap: c, workState: L.Start, viewId: s == null ? void 0 : s.viewId });
  }, m = al((X, V) => {
    if (X.preventDefault(), X.stopPropagation(), b(R.SetPoint), Z(L.Doing), V.x !== (i == null ? void 0 : i.x) || V.y !== (i == null ? void 0 : i.y)) {
      const u = c.get(l);
      u && d === "start" && (s != null && s.control.viewContainerManager) ? u[0] = s.control.viewContainerManager.transformToScenePoint([V.x, V.y], s.viewId) : u && d === "end" && (s != null && s.control.viewContainerManager) && (u[1] = s.control.viewContainerManager.transformToScenePoint([V.x, V.y], s.viewId)), f.emitMethod(F.MainEngine, R.SetPoint, { workId: z, pointMap: c, workState: L.Doing, viewId: s == null ? void 0 : s.viewId });
    }
  }, 50, { leading: !1 }), p = al((X, V) => {
    if (X.preventDefault(), X.stopPropagation(), b(R.None), Z(L.Done), V.x !== (i == null ? void 0 : i.x) || V.y !== (i == null ? void 0 : i.y)) {
      n(V);
      const u = c.get(l);
      u && d === "start" && (s != null && s.control.viewContainerManager) ? u[0] = s.control.viewContainerManager.transformToScenePoint([V.x, V.y], s.viewId) : u && d === "end" && (s != null && s.control.viewContainerManager) && (u[1] = s.control.viewContainerManager.transformToScenePoint([V.x, V.y], s.viewId)), f.emitMethod(F.MainEngine, R.SetPoint, { workId: z, pointMap: c, workState: L.Done, viewId: s == null ? void 0 : s.viewId });
    }
  }, 100, { leading: !1 });
  return h.createElement(
    ie,
    { position: i, onStart: G, onDrag: m, onStop: p },
    h.createElement(
      "div",
      { className: "bezier-pencil-plugin-point-draggable-btn" },
      h.createElement("div", { className: "bezier-pencil-plugin-point-draggable-btn-inner", style: {
        borderColor: a == null ? void 0 : a.selectorColor
      } })
    )
  );
}, E0 = (t) => {
  const { className: l } = t, { floatBarData: e, maranger: c } = Gl(nl), [d, b] = A(), [s, a] = A(), [i, n] = A(/* @__PURE__ */ new Map());
  bl(() => {
    const G = [];
    if (c && (e != null && e.points)) {
      const m = c.viewId;
      if (c.control.viewContainerManager.getView(m))
        for (const X of e.points) {
          const V = c.control.viewContainerManager.transformToOriginPoint(X, m);
          G.push(V);
        }
      e != null && e.selectIds && e.selectIds.length === 1 && (i.set(e.selectIds[0], e.points), n(i));
    }
    G[0] && b({ x: G[0][0], y: G[0][1] }), G[1] && a({ x: G[1][0], y: G[1][1] });
  }, [c, e == null ? void 0 : e.points, e == null ? void 0 : e.selectIds, i]);
  const o = B(() => d && (e != null && e.selectIds) ? h.createElement(tt, { pos: d, type: "start", id: e.selectIds[0], pointMap: i }) : null, [d, e == null ? void 0 : e.selectIds, i]), Z = B(() => s && (e != null && e.selectIds) ? h.createElement(tt, { pos: s, type: "end", id: e.selectIds[0], pointMap: i }) : null, [s, e == null ? void 0 : e.selectIds, i]);
  return h.createElement(
    "div",
    { className: `${l}` },
    o,
    Z
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
class ac extends h.Component {
  constructor(l) {
    var e;
    super(l), Object.defineProperty(this, "setPosition", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        this.setState({ position: c });
      }
    }), Object.defineProperty(this, "setAngle", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        this.setState({ angle: c });
      }
    }), Object.defineProperty(this, "setOperationType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        this.setState({ operationType: c });
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
      activeTextId: (e = this.props.maranger.control.textEditorManager) == null ? void 0 : e.activeId
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
  showFloatBar(l, e) {
    const c = l && e && { ...this.state.floatBarData, ...e } || void 0;
    this.setState({
      showFloatBar: l,
      floatBarData: c,
      position: c && { x: c.x, y: c.y },
      angle: 0
    }), c && this.props.refs.floatBarCanvasRef.current && (c.canvasHeight && c.canvasWidth ? (this.props.refs.floatBarCanvasRef.current.width = c.canvasWidth * this.state.dpr, this.props.refs.floatBarCanvasRef.current.height = c.canvasHeight * this.state.dpr, this.props.refs.floatBarCanvasRef.current.style.width = c.canvasWidth + "px", this.props.refs.floatBarCanvasRef.current.style.height = c.canvasHeight + "px") : (this.props.refs.floatBarCanvasRef.current.width = c.w * this.state.dpr, this.props.refs.floatBarCanvasRef.current.height = c.h * this.state.dpr, this.props.refs.floatBarCanvasRef.current.style.width = "100%", this.props.refs.floatBarCanvasRef.current.style.height = "100%"));
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
    var e, c, d, b, s, a, i, n, o, Z, G, m, p;
    const l = !!((c = (e = this.props.maranger.control) == null ? void 0 : e.room) != null && c.floatBarOptions);
    return h.createElement(
      h.Fragment,
      null,
      h.createElement(
        "div",
        { className: Ml.Container, onMouseDown: (X) => {
          X.preventDefault(), X.stopPropagation();
        }, onTouchStart: (X) => {
          X.stopPropagation();
        }, onMouseMove: (X) => {
          this.props.maranger.cursorMouseMove(X);
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
          ((n = this.state.floatBarData) == null ? void 0 : n.canRotate) && ((Z = (o = this.state.floatBarData) == null ? void 0 : o.selectIds) == null ? void 0 : Z.length) === 1 && (this.state.operationType === R.None || this.state.operationType === R.RotateNode) && h.createElement(K0, { className: Ml.RotateBtn }) || null,
          (((G = this.state.floatBarData) == null ? void 0 : G.scaleType) === rl.all || ((m = this.state.floatBarData) == null ? void 0 : m.scaleType) === rl.proportional) && this.state.showFloatBar && (this.state.operationType === R.None || this.state.operationType === R.ScaleNode) && h.createElement(D0, { className: Ml.ResizeBtn }) || null,
          ((p = this.state.floatBarData) == null ? void 0 : p.scaleType) === rl.both && this.state.showFloatBar && (this.state.operationType === R.None || this.state.operationType === R.SetPoint) && h.createElement(E0, { className: Ml.ResizeTowBox }) || null,
          this.state.showFloatBar && l && h.createElement(F0, { className: Ml.FloatBarBtn }) || null
        ),
        h.createElement(O0, { className: Ml.CursorBox, manager: this.props.maranger })
      )
    );
  }
}
class he extends xl {
  constructor(l, e) {
    super(l, e), Object.defineProperty(this, "width", {
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
      const l = this.eventTragetElement.offsetWidth || this.width, e = this.eventTragetElement.offsetHeight || this.height;
      l && e && this.canvasBgRef.current && (this.dpr = tc(this.canvasBgRef.current.getContext("2d")), this.width = l, this.height = e, this.canvasBgRef.current.style.width = `${l}px`, this.canvasBgRef.current.style.height = `${e}px`, this.canvasBgRef.current.width = l * this.dpr, this.canvasBgRef.current.height = e * this.dpr, this.canvasFloatRef.current && (this.canvasFloatRef.current.style.width = `${l}px`, this.canvasFloatRef.current.style.height = `${e}px`, this.canvasFloatRef.current.width = l * this.dpr, this.canvasFloatRef.current.height = e * this.dpr), this.canvasServiceFloatRef.current && (this.canvasServiceFloatRef.current.style.width = `${l}px`, this.canvasServiceFloatRef.current.style.height = `${e}px`, this.canvasServiceFloatRef.current.width = l * this.dpr, this.canvasServiceFloatRef.current.height = e * this.dpr));
    }
  }
  destroy() {
    if (super.destroy(), this.eventTragetElement) {
      const l = this.eventTragetElement.parentElement;
      if (l) {
        const e = l.querySelectorAll(".teaching-aids-plugin-main-view-displayer");
        for (const c of e)
          c.remove();
      }
    }
  }
  createMainViewDisplayer(l) {
    const e = document.createElement("div");
    return e.className = "teaching-aids-plugin-main-view-displayer", l.appendChild(e), this.eventTragetElement = l.children[0], this.containerOffset = this.getContainerOffset(this.eventTragetElement, this.containerOffset), this.bindToolsClass(), Be.render(h.createElement(ac, { viewId: this.viewId, maranger: this, refs: {
      canvasServiceFloatRef: this.canvasServiceFloatRef,
      canvasFloatRef: this.canvasFloatRef,
      canvasBgRef: this.canvasBgRef,
      floatBarRef: this.floatBarRef,
      floatBarCanvasRef: this.floatBarCanvasRef
    } }), e), this.control.room && this.bindDisplayerEvent(this.eventTragetElement), this;
  }
}
class A0 extends Du {
  constructor(l, e, c) {
    super(l, e, c), Object.defineProperty(this, "dpr", {
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
      this.dpr = tc(this.canvasBgRef.current.getContext("2d"));
      const l = this.eventTragetElement.offsetWidth || this.width, e = this.eventTragetElement.offsetHeight || this.height;
      l && e && (this.width = l, this.height = e, this.canvasBgRef.current.style.width = `${l}px`, this.canvasBgRef.current.style.height = `${e}px`, this.canvasBgRef.current.width = l * this.dpr, this.canvasBgRef.current.height = e * this.dpr, this.canvasFloatRef.current && (this.canvasFloatRef.current.style.width = `${l}px`, this.canvasFloatRef.current.style.height = `${e}px`, this.canvasFloatRef.current.width = l * this.dpr, this.canvasFloatRef.current.height = e * this.dpr), this.canvasServiceFloatRef.current && (this.canvasServiceFloatRef.current.style.width = `${l}px`, this.canvasServiceFloatRef.current.style.height = `${e}px`, this.canvasServiceFloatRef.current.width = l * this.dpr, this.canvasServiceFloatRef.current.height = e * this.dpr));
    }
  }
  createAppViewDisplayer(l, e) {
    const c = document.createElement("div");
    return c.className = "teaching-aids-plugin-app-view-displayer", e.appendChild(c), this.eventTragetElement = e.children[0], this.containerOffset = this.getContainerOffset(this.eventTragetElement, this.containerOffset), this.bindToolsClass(), Be.render(h.createElement(ac, { viewId: l, maranger: this, refs: {
      canvasServiceFloatRef: this.canvasServiceFloatRef,
      canvasFloatRef: this.canvasFloatRef,
      canvasBgRef: this.canvasBgRef,
      floatBarRef: this.floatBarRef,
      floatBarCanvasRef: this.floatBarCanvasRef
    } }), c), this.control.room && this.bindDisplayerEvent(this.eventTragetElement), this;
  }
}
class Sl extends ne {
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
      value: (e) => {
        this.control.textEditorManager.clear(he.viewId, !0), this.onMainViewMounted(e);
      }
    }), Object.defineProperty(this, "onMainViewMounted", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (e) => {
        var G;
        const c = e.divElement;
        if (!c || !e.focusScenePath || !(e.focusScenePath || e.scenePath))
          return;
        if (this.mainView && this.mainView.displayer) {
          this.mainView.displayer.destroy();
          const m = c.getElementsByClassName("teaching-aids-plugin-main-view-displayer");
          for (const p of m)
            p.remove();
          (G = this.control.worker) == null || G.destroyViewWorker(this.mainView.id, !0), this.mainView = void 0;
        }
        const b = new he(this.control, yl.InternalMsgEmitter), s = e.size.width || b.width, a = e.size.height || b.height, n = {
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
        }, { scale: o, ...Z } = e.camera;
        n.cameraOpt = {
          ...n.cameraOpt,
          ...Z,
          scale: o === 1 / 0 ? 1 : o
        }, this.focuedViewId = he.viewId, this.createMianView({
          id: he.viewId,
          container: c,
          displayer: b,
          focusScenePath: e.focusScenePath,
          cameraOpt: n.cameraOpt,
          viewData: e
        }), this.focuedView = this.mainView, b.createMainViewDisplayer(c), e.callbacks.on("onSizeUpdated", this.onMainViewSizeUpdated), e.callbacks.on("onCameraUpdated", this.onMainViewCameraUpdated), e.callbacks.on("onActiveHotkey", this.onActiveHotkeyChange.bind(this));
      }
    }), Object.defineProperty(this, "onMainViewSizeUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async () => {
        Promise.resolve().then(() => {
          if (this.mainView && this.mainView.viewData) {
            const e = this.mainView.viewData.size, c = this.mainView.cameraOpt;
            c && (this.mainView.displayer.updateSize(), this.mainView.cameraOpt = { ...c, ...e });
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
            const e = this.mainView.viewData.camera, c = this.mainView.cameraOpt;
            if (c) {
              const d = e.scale === 1 / 0 ? 1 : e.scale, b = e.centerX || 0, s = e.centerY || 0;
              this.mainView.cameraOpt = { ...c, scale: d, centerX: b, centerY: s }, this.checkScaleTimer && e.scale == 1 / 0 && (clearTimeout(this.checkScaleTimer), this.checkScaleTimer = void 0), !this.checkScaleTimer && e.scale === 1 / 0 && this.mainView.viewData && this.mainView.viewData.camera.scale === 1 / 0 && (this.checkScaleTimer = setTimeout(() => {
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
      value: (e) => {
        var G;
        const { appId: c, view: d } = e, b = d.divElement;
        if (!b || !d.focusScenePath)
          return;
        const s = this.appViews.get(c);
        if (s && s.displayer) {
          const m = b.getElementsByClassName("teaching-aids-plugin-app-view-displayer");
          for (const p of m)
            p.remove();
          this.destroyAppView(e.appId, !0), (G = this.control.worker) == null || G.destroyViewWorker(c, !0);
        }
        const a = new A0(c, this.control, yl.InternalMsgEmitter), i = d.size.width || a.width, n = d.size.height || a.height, Z = {
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
        this.createAppView({
          id: c,
          container: b,
          displayer: a,
          cameraOpt: Z.cameraOpt,
          focusScenePath: d.focusScenePath,
          viewData: d
        }), a.createAppViewDisplayer(c, b), d.callbacks.on("onSizeUpdated", this.onAppViewSizeUpdated.bind(this, c)), d.callbacks.on("onCameraUpdated", this.onAppViewCameraUpdated.bind(this, c)), d.callbacks.on("onActiveHotkey", this.onActiveHotkeyChange.bind(this)), this.tmpFocusedViewId === c && (this.setFocuedViewId(c), this.tmpFocusedViewId = void 0);
      }
    }), Object.defineProperty(this, "onAppViewSizeUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (e) => {
        Promise.resolve().then(() => {
          const c = this.appViews.get(e);
          if (c && c.viewData) {
            const d = c.viewData.size, b = c.cameraOpt;
            b && (c.displayer.updateSize(), c.cameraOpt = { ...b, ...d });
          }
        });
      }
    }), Object.defineProperty(this, "onAppViewCameraUpdated", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (e) => {
        Promise.resolve().then(() => {
          const c = this.appViews.get(e);
          if (c && c.viewData) {
            const d = c.viewData.camera, b = c.cameraOpt;
            if (b) {
              const s = d.scale === 1 / 0 ? 1 : d.scale, a = d.centerX || 0, i = d.centerY || 0;
              c.cameraOpt = { ...b, scale: s, centerX: a, centerY: i };
            }
          }
        });
      }
    }), this.control = l.control;
  }
  mountView(l) {
    var c, d;
    const e = this.getView(l);
    if (e) {
      const { width: b, height: s, dpr: a } = e.displayer, i = {
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
      if (e.viewData) {
        const { scale: n, ...o } = e.viewData.camera;
        i.cameraOpt = {
          ...i.cameraOpt,
          ...o,
          scale: n === 1 / 0 ? 1 : n
        };
      }
      l === ((c = this.mainView) == null ? void 0 : c.id) && this.control.activeWorker(), (d = this.control.worker) == null || d.createViewWorker(l, i), e.focusScenePath && this.control.collector && this.control.worker.pullServiceData(l, e.focusScenePath);
    }
  }
  listenerWindowManager(l) {
    l.emitter.on("boxStateChange", (e) => {
      e !== "minimized" && setTimeout(() => {
        this.appViews.forEach((c) => {
          c.displayer.reflashContainerOffset();
        });
      }, 100);
    }), l.emitter.on("focusedChange", (e) => {
      const c = e || xl.viewId;
      if (this.focuedViewId !== c) {
        const d = this.getView(c);
        d ? (d.displayer.reflashContainerOffset(), this.setFocuedViewId(c)) : this.tmpFocusedViewId = c;
      }
    }), l.emitter.on("mainViewScenePathChange", (e) => {
      console.log("ContainerManager mainViewScenePathChange", e), this.control.onSceneChange(e, "mainView");
    }), l.emitter.on("onMainViewMounted", this.onMainViewMounted), l.emitter.on("onAppViewMounted", this.onAppViewMounted), l.emitter.on("onMainViewRebind", this.onMainViewRelease), l.emitter.on("onBoxMove", (e) => {
      const c = this.getView(e.appId);
      c && c.displayer.reflashContainerOffset();
    }), l.emitter.on("onBoxResize", (e) => {
      const c = this.getView(e.appId);
      c && c.displayer.reflashContainerOffset();
    }), l.emitter.on("onBoxFocus", (e) => {
      const c = this.getView(e.appId);
      c && c.displayer.reflashContainerOffset();
    }), l.emitter.on("onBoxClose", (e) => {
      this.appViews.get(e.appId) && (this.destroyAppView(e.appId), this.control.worker.destroyViewWorker(e.appId));
    }), l.emitter.on("onBoxStateChange", (e) => {
      const c = this.getView(e.appId);
      c && c.displayer.reflashContainerOffset();
    }), l.emitter.on("onAppScenePathChange", (e) => {
      const { appId: c, view: d } = e;
      console.log("ContainerManager - onAppScenePathChange", c, d.focusScenePath, d), this.control.onSceneChange(d.focusScenePath, c);
    });
  }
  onActiveHotkeyChange(l) {
    this.control.hotkeyManager.onActiveHotkey(l);
  }
}
class We extends yl {
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
    const e = {
      control: this,
      internalMsgEmitter: yl.InternalMsgEmitter
    };
    this.viewContainerManager = new Sl(e);
  }
  init() {
  }
  destroy() {
    var l, e, c, d;
    this.roomMember.destroy(), (l = this.collector) == null || l.destroy(), (e = this.worker) == null || e.destroy(), (c = this.viewContainerManager) == null || c.destroy(), (d = this.cursor) == null || d.destroy();
  }
  activePlugin() {
    this.collector && (this.collector.addStorageStateListener((l) => {
      var e, c;
      if ((e = this.collector) != null && e.storage && Object.keys(this.collector.storage).length === 0) {
        (c = this.worker) == null || c.clearViewScenePath("mainView", !0);
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
          yl.InternalMsgEmitter.emit("excludeIds", [...s], b);
      }
    }), this.room && this.roomMember.onUidChangeHook((l) => {
      var e, c, d, b;
      if ((e = this.collector) != null && e.serviceStorage) {
        const s = [];
        this.viewContainerManager.getAllViews().forEach((a) => {
          var i;
          if (a && a.focusScenePath && ((i = this.collector) != null && i.serviceStorage[a.id]) && this.collector.serviceStorage[a.id][a.focusScenePath]) {
            const n = Object.keys(this.collector.serviceStorage[a.id][a.focusScenePath]).filter((o) => {
              var Z;
              return (Z = this.collector) == null ? void 0 : Z.isSelector(o);
            }).map((o) => ({ viewId: a.id, scenePath: a.focusScenePath, key: o }));
            n.length && s.push(...n);
          }
        }), s.forEach(({ key: a, viewId: i, scenePath: n }) => {
          var Z, G;
          const o = (Z = this.collector) == null ? void 0 : Z.getUidFromKey(a);
          o && !l.online.includes(o) && ((G = this.collector) == null || G.updateValue(a, void 0, { isAfterUpdate: !0, viewId: i, scenePath: n }));
        });
      }
      (d = (c = this.cursor) == null ? void 0 : c.eventCollector) != null && d.serviceStorage && Object.keys((b = this.cursor) == null ? void 0 : b.eventCollector.serviceStorage).forEach((a) => {
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
    var e, c, d, b, s;
    this.windowManager = l, (c = (e = this.windowManager) == null ? void 0 : e.mainView) != null && c.divElement && this.viewContainerManager.onMainViewMounted(this.windowManager.mainView), (s = (b = (d = this.windowManager.appManager) == null ? void 0 : d.viewManager) == null ? void 0 : b.views) != null && s.size && this.windowManager.appManager.viewManager.views.forEach((a, i) => {
      this.viewContainerManager.onAppViewMounted({ appId: i, view: a });
    }), this.viewContainerManager.listenerWindowManager(this.windowManager);
  }
}
class U extends st {
  constructor() {
    super(...arguments), Object.defineProperty(this, "updateRoomWritable", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        var l;
        (l = U.currentManager) == null || l.onWritableChange(this.displayer.isWritable);
      }
    }), Object.defineProperty(this, "roomStateChangeListener", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (l) => {
        var e, c;
        _(this.displayer) && !this.displayer.isWritable || (l.memberState && ((e = U.currentManager) == null || e.onMemberChange(l.memberState)), l != null && l.roomMembers && ((c = U.currentManager) == null || c.onRoomMembersChange(l.roomMembers)));
      }
    });
  }
  static async getInstance(l, e) {
    e != null && e.logger && (U.logger = e.logger), e != null && e.options && (U.options = e.options);
    const c = l.displayer;
    let d = c.getInvisiblePlugin(U.kind);
    c && d && U.createCurrentManager(l, U.options, d), !d && _(c) && (d = await U.createTeachingMulitAidsPlugin(c, U.kind)), d && U.currentManager && (U.currentManager.bindPlugin(d), d.init(c));
    const b = c.callbacks.on, s = c.callbacks.off, a = c.callbacks.once, i = l.cleanCurrentScene, n = {
      plugin: U,
      displayer: c,
      windowManager: l,
      getBoundingRectAsync: async function(o) {
        var m;
        U.logger.info("[TeachingMulitAidsPlugin plugin] getBoundingRect");
        const Z = (this.windowManager && this.windowManager.mainView || this.displayer).getBoundingRect(o), G = await ((m = U.currentManager) == null ? void 0 : m.getBoundingRect(o));
        return !Z.width || !Z.height ? G : Ct(Z, G);
      },
      screenshotToCanvasAsync: async function(o, Z, G, m, p, X) {
        var r;
        U.logger.info("[TeachingMulitAidsPlugin plugin] screenshotToCanvasAsync");
        const V = document.createElement("canvas"), u = V.getContext("2d");
        V.width = G * (X || 1), V.height = m * (X || 1), u && ((this.windowManager && this.windowManager.mainView || this.displayer).screenshotToCanvas(u, Z, G, m, p, X), o.drawImage(V, 0, 0, G * (X || 1), m * (X || 1), 0, 0, G, m), V.remove()), U.currentManager && await ((r = U.currentManager) == null ? void 0 : r.screenshotToCanvas(o, Z, G, m, p));
      },
      scenePreviewAsync: async function(o, Z, G, m, p) {
        U.logger.info("[TeachingMulitAidsPlugin plugin] scenePreview"), (this.windowManager && this.windowManager.mainView || this.displayer).scenePreview(o, Z, G, m, p);
        const X = document.createElement("img");
        X.style.position = "absolute", X.style.top = "0px", X.style.left = "0px", X.style.width = "100%", X.style.height = "100%", X.style.pointerEvents = "none", Z.append(X), getComputedStyle(Z).position || (Z.style.position = "relative"), U.currentManager && await U.currentManager.scenePreview(o, X);
      },
      callbacksOn: function(o, Z) {
        U.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${o}`), (o === "onCanUndoStepsUpdate" || o === "onCanRedoStepsUpdate") && _(this.displayer) && this.displayer.isWritable ? We.InternalMsgEmitter.on(o, Z) : b.call(c.callbacks, o, Z);
      },
      callbacksOnce: function(o, Z) {
        U.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${o}`), (o === "onCanUndoStepsUpdate" || o === "onCanRedoStepsUpdate") && _(this.displayer) && this.displayer.isWritable ? We.InternalMsgEmitter.on(o, Z) : a.call(c.callbacks, o, Z);
      },
      callbacksOff: function(o, Z) {
        U.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${o}`), (o === "onCanUndoStepsUpdate" || o === "onCanRedoStepsUpdate") && _(this.displayer) && this.displayer.isWritable ? We.InternalMsgEmitter.off(o, Z) : s.call(c.callbacks, o, Z);
      },
      undo: function() {
        return U.logger.info("[TeachingMulitAidsPlugin plugin] undo"), U.currentManager && _(this.displayer) && !this.displayer.disableSerialization ? U.currentManager.viewContainerManager.undo() : 0;
      },
      redo: function() {
        return U.logger.info("[TeachingMulitAidsPlugin plugin] redo"), U.currentManager && _(this.displayer) && !this.displayer.disableSerialization ? U.currentManager.viewContainerManager.redo() : 0;
      },
      cleanCurrentScene: function(o) {
        U.logger.info("[TeachingMulitAidsPlugin plugin] cleanCurrentScene"), U.currentManager && _(this.displayer) && this.displayer.isWritable && (U.currentManager.cleanCurrentScene(), i.call(l, o));
      },
      insertImage: function(o) {
        U.logger.info("[TeachingMulitAidsPlugin plugin] insertImage"), U.currentManager && _(this.displayer) && this.displayer.isWritable && U.currentManager.worker.insertImage(o);
      },
      lockImage: function(o, Z) {
        U.logger.info("[TeachingMulitAidsPlugin plugin] lockImage"), U.currentManager && _(this.displayer) && this.displayer.isWritable && U.currentManager.worker.lockImage(o, Z);
      },
      completeImageUpload: function(o, Z) {
        U.logger.info("[TeachingMulitAidsPlugin plugin] completeImageUpload"), U.currentManager && _(this.displayer) && this.displayer.isWritable && U.currentManager.worker.completeImageUpload(o, Z);
      },
      getImagesInformation: function(o) {
        return U.logger.info("[TeachingMulitAidsPlugin plugin] completeImageUpload"), U.currentManager && _(this.displayer) && this.displayer.isWritable ? U.currentManager.worker.getImagesInformation(o) : [];
      },
      callbacks: () => ({
        ...c.callbacks,
        on: n.callbacksOn.bind(n),
        once: n.callbacksOnce.bind(n),
        off: n.callbacksOff.bind(n)
      })
    };
    return {
      ...n,
      callbacks: n.callbacks(),
      injectMethodToObject: function(o, Z) {
        if (U.logger.info(`[TeachingMulitAidsPlugin plugin] bindMethodToObject ${Z}`), typeof o[Z] == "function" || typeof o[Z] > "u") {
          o[Z] = n[Z].bind(n);
          return;
        }
        Z === "callbacks" && (o.callbacks.on = n.callbacksOn.bind(n), o.callbacks.off = n.callbacksOff.bind(n), o.callbacks.once = n.callbacksOnce.bind(n));
      }
    };
  }
  static onCreate(l) {
    l && U.currentManager && (U.currentManager.bindPlugin(l), l.init(l.displayer));
  }
  static async createTeachingMulitAidsPlugin(l, e) {
    await l.createInvisiblePlugin(U, {});
    let c = l.getInvisiblePlugin(e);
    return c || (c = await U.createTeachingMulitAidsPlugin(l, e)), c;
  }
  // static onDestroy(plugin: TeachingMulitAidsPlugin) {}
  get isReplay() {
    return Qe(this.displayer);
  }
  get callbackName() {
    return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
  }
  init(l) {
    var e;
    if (_(l)) {
      const c = l.state;
      c != null && c.memberState && ((e = U.currentManager) == null || e.onMemberChange(c.memberState));
    }
    this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener), this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
  }
  destroy() {
    var l;
    (l = U.currentManager) == null || l.destroy(), U.currentManager = void 0;
  }
}
Object.defineProperty(U, "kind", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "teaching-multi-aids-plugin"
});
Object.defineProperty(U, "logger", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    info: console.log,
    warn: console.warn,
    error: console.error
  }
});
Object.defineProperty(U, "options", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    syncOpt: {
      interval: 300
    },
    canvasOpt: {
      contextType: ae.Canvas2d
    }
  }
});
Object.defineProperty(U, "createCurrentManager", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (t, l, e) => {
    if (U.currentManager && U.currentManager.destroy(), l && t) {
      const c = {
        plugin: e,
        displayer: t.displayer,
        options: l
      }, d = new We(c);
      U.logger.info("[TeachingMulitAidsPlugin plugin] refresh TeachingAidsMultiManager object"), d.setWindowManager(t), U.currentManager = d;
    }
  }
});
class q0 extends xl {
  constructor(l, e) {
    super(l, e), Object.defineProperty(this, "width", {
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
      const l = this.eventTragetElement.offsetWidth, e = this.eventTragetElement.offsetHeight;
      l && e && this.canvasBgRef.current && (this.dpr = tc(this.canvasBgRef.current.getContext("2d")), this.width = l, this.height = e, this.canvasBgRef.current.style.width = `${l}px`, this.canvasBgRef.current.style.height = `${e}px`, this.canvasBgRef.current.width = l * this.dpr, this.canvasBgRef.current.height = e * this.dpr, this.canvasFloatRef.current && (this.canvasFloatRef.current.style.width = `${l}px`, this.canvasFloatRef.current.style.height = `${e}px`, this.canvasFloatRef.current.width = l * this.dpr, this.canvasFloatRef.current.height = e * this.dpr), this.canvasServiceFloatRef.current && (this.canvasServiceFloatRef.current.style.width = `${l}px`, this.canvasServiceFloatRef.current.style.height = `${e}px`, this.canvasServiceFloatRef.current.width = l * this.dpr, this.canvasServiceFloatRef.current.height = e * this.dpr));
    }
  }
  createMainViewDisplayer(l) {
    return this.vDom || (this.containerOffset = this.getContainerOffset(l, this.containerOffset), this.eventTragetElement = l.parentElement.children[0], l.innerHTML = "", Be.render(h.createElement(ac, { viewId: this.viewId, maranger: this, refs: {
      canvasServiceFloatRef: this.canvasServiceFloatRef,
      canvasFloatRef: this.canvasFloatRef,
      canvasBgRef: this.canvasBgRef,
      floatBarRef: this.floatBarRef,
      floatBarCanvasRef: this.floatBarCanvasRef
    } }), l), this.control.room && this.bindDisplayerEvent(this.eventTragetElement)), this;
  }
}
class Kl extends ne {
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
    const l = new q0(this.control, yl.InternalMsgEmitter);
    this.focuedViewId = xl.viewId;
    const { width: e, height: c, dpr: d } = l, b = {
      dpr: d,
      originalPoint: [e / 2, c / 2],
      offscreenCanvasOpt: {
        ...Kl.defaultScreenCanvasOpt,
        width: e,
        height: c
      },
      layerOpt: {
        ...Kl.defaultLayerOpt,
        width: e,
        height: c
      },
      cameraOpt: {
        ...Kl.defaultCameraOpt,
        width: e,
        height: c
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
    var c;
    const e = this.getView(l);
    if (e) {
      const { width: d, height: b, dpr: s } = e.displayer, a = {
        dpr: s,
        originalPoint: [d / 2, b / 2],
        offscreenCanvasOpt: {
          ...Kl.defaultScreenCanvasOpt,
          width: d,
          height: b
        },
        layerOpt: {
          ...Kl.defaultLayerOpt,
          width: d,
          height: b
        },
        cameraOpt: {
          ...Kl.defaultCameraOpt,
          width: d,
          height: b
        }
      };
      if (e.viewData) {
        const { scale: i, ...n } = e.viewData.camera;
        a.cameraOpt = {
          ...a.cameraOpt,
          ...n,
          scale: i === 1 / 0 ? 1 : i
        };
      }
      this.control.worker.isActive || this.control.activeWorker(), (c = this.control.worker) == null || c.createViewWorker(l, a), e.focusScenePath && this.control.collector && this.control.worker.pullServiceData(l, e.focusScenePath);
    }
  }
}
class Hl extends yl {
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
      value: al((c) => {
        this.viewContainerManager.setFocuedViewCameraOpt(c);
      }, 20, { leading: !1 })
    });
    const e = {
      control: this,
      internalMsgEmitter: Hl.InternalMsgEmitter
    };
    this.viewContainerManager = new Kl(e);
  }
  init() {
    Hl.InternalMsgEmitter.on(F.BindMainView, (l) => {
      this.divMainView = l, this.plugin && !this.viewContainerManager.mainView && this.viewContainerManager.bindMainView();
    });
  }
  activePlugin() {
    this.plugin && this.divMainView && !this.viewContainerManager.mainView && this.viewContainerManager.bindMainView(), this.collector && (this.collector.addStorageStateListener((l) => {
      var e, c;
      if ((e = this.collector) != null && e.storage && Object.keys(this.collector.storage).length === 0) {
        (c = this.worker) == null || c.clearViewScenePath("mainView", !0);
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
      var e, c, d, b;
      if ((e = this.collector) != null && e.serviceStorage) {
        const s = [];
        this.viewContainerManager.getAllViews().forEach((a) => {
          var i, n, o;
          if (a && a.focusScenePath && ((i = this.collector) != null && i.serviceStorage[a.id]) && ((n = this.collector) != null && n.serviceStorage[a.id][a.focusScenePath])) {
            const Z = Object.keys((o = this.collector) == null ? void 0 : o.serviceStorage[a.id][a.focusScenePath]).filter((G) => {
              var m;
              return (m = this.collector) == null ? void 0 : m.isSelector(G);
            }).map((G) => ({ viewId: a.id, scenePath: a.focusScenePath, key: G }));
            Z.length && s.push(...Z);
          }
        }), s.forEach(({ key: a, viewId: i, scenePath: n }) => {
          var Z, G;
          const o = (Z = this.collector) == null ? void 0 : Z.getUidFromKey(a);
          o && !l.online.includes(o) && ((G = this.collector) == null || G.updateValue(a, void 0, { isAfterUpdate: !0, viewId: i, scenePath: n }));
        });
      }
      (d = (c = this.cursor) == null ? void 0 : c.eventCollector) != null && d.serviceStorage && Object.keys((b = this.cursor) == null ? void 0 : b.eventCollector.serviceStorage).forEach((a) => {
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
class k extends st {
  constructor() {
    super(...arguments), Object.defineProperty(this, "updateRoomWritable", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        var l;
        (l = k.currentManager) == null || l.onWritableChange(this.displayer.isWritable);
      }
    }), Object.defineProperty(this, "roomStateChangeListener", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (l) => {
        var e, c;
        k.currentManager instanceof Hl && (l.cameraState && k.currentManager.onCameraChange(l.cameraState), l.sceneState && k.currentManager.onSceneChange(l.sceneState.scenePath, "mainView")), !(_(this.displayer) && !this.displayer.isWritable) && (l.memberState && ((e = k.currentManager) == null || e.onMemberChange(l.memberState)), l != null && l.roomMembers && ((c = k.currentManager) == null || c.onRoomMembersChange(l.roomMembers)));
      }
    });
  }
  static async getInstance(l, e) {
    e != null && e.logger && (k.logger = e.logger), e != null && e.options && (k.options = e.options), e != null && e.cursorAdapter && (k.cursorAdapter = e.cursorAdapter, k.effectInstance());
    let c = l.getInvisiblePlugin(k.kind);
    l && c && k.createCurrentManager(l, k.options, c), !c && _(l) && (c = await k.createTeachingAidsPlugin(l, k.kind)), c && k.currentManager && (k.currentManager.bindPlugin(c), c.init(l));
    const d = l.callbacks.on, b = l.callbacks.off, s = l.callbacks.once, a = l.cleanCurrentScene, i = {
      plugin: c,
      displayer: l,
      getBoundingRectAsync: async function(n) {
        var G;
        k.logger.info("[TeachingAidsSinglePlugin plugin] getBoundingRect");
        const o = this.displayer.getBoundingRect(n), Z = await ((G = k.currentManager) == null ? void 0 : G.getBoundingRect(n));
        return !o.width || !o.height ? Z : Ct(o, Z);
      },
      screenshotToCanvasAsync: async function(n, o, Z, G, m, p) {
        var u;
        k.logger.info("[TeachingAidsSinglePlugin plugin] screenshotToCanvasAsync");
        const X = document.createElement("canvas"), V = X.getContext("2d");
        X.width = Z * (p || 1), X.height = G * (p || 1), V && (this.displayer.screenshotToCanvas(V, o, Z, G, m, p), n.drawImage(X, 0, 0, Z * (p || 1), G * (p || 1), 0, 0, Z, G), X.remove()), k.currentManager && await ((u = k.currentManager) == null ? void 0 : u.screenshotToCanvas(n, o, Z, G, m));
      },
      scenePreviewAsync: async function(n, o, Z, G, m) {
        k.logger.info("[TeachingAidsSinglePlugin plugin] scenePreview"), this.displayer.scenePreview(n, o, Z, G, m);
        const p = document.createElement("img");
        p.style.position = "absolute", p.style.top = "0px", p.style.left = "0px", p.style.width = "100%", p.style.height = "100%", p.style.pointerEvents = "none", o.append(p), getComputedStyle(o).position || (o.style.position = "relative"), k.currentManager && await k.currentManager.scenePreview(n, p);
      },
      callbacksOn: function(n, o) {
        k.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${n}`), (n === "onCanUndoStepsUpdate" || n === "onCanRedoStepsUpdate") && _(this.displayer) && this.displayer.isWritable ? Hl.InternalMsgEmitter.on(n, o) : d.call(l.callbacks, n, o);
      },
      callbacksOnce: function(n, o) {
        k.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${n}`), (n === "onCanUndoStepsUpdate" || n === "onCanRedoStepsUpdate") && _(this.displayer) && this.displayer.isWritable ? Hl.InternalMsgEmitter.on(n, o) : s.call(l.callbacks, n, o);
      },
      callbacksOff: function(n, o) {
        k.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${n}`), (n === "onCanUndoStepsUpdate" || n === "onCanRedoStepsUpdate") && _(this.displayer) && this.displayer.isWritable ? Hl.InternalMsgEmitter.off(n, o) : b.call(l.callbacks, n, o);
      },
      undo: function() {
        return k.logger.info("[TeachingAidsSinglePlugin plugin] undo"), k.currentManager && _(this.displayer) && !this.displayer.disableSerialization ? k.currentManager.viewContainerManager.undo() : 0;
      },
      redo: function() {
        return k.logger.info("[TeachingAidsSinglePlugin plugin] redo"), k.currentManager && _(this.displayer) && !this.displayer.disableSerialization ? k.currentManager.viewContainerManager.redo() : 0;
      },
      cleanCurrentScene: function(n) {
        k.logger.info("[TeachingAidsSinglePlugin plugin] cleanCurrentScene"), k.currentManager && _(this.displayer) && this.displayer.isWritable && (k.currentManager.cleanCurrentScene(), a.call(l, n));
      },
      insertImage: function(n) {
        k.logger.info("[TeachingAidsSinglePlugin plugin] insertImage"), k.currentManager && _(this.displayer) && this.displayer.isWritable && k.currentManager.worker.insertImage(n);
      },
      lockImage: function(n, o) {
        k.logger.info("[TeachingAidsSinglePlugin plugin] lockImage"), k.currentManager && _(this.displayer) && this.displayer.isWritable && k.currentManager.worker.lockImage(n, o);
      },
      completeImageUpload: function(n, o) {
        k.logger.info("[TeachingAidsSinglePlugin plugin] completeImageUpload"), k.currentManager && _(this.displayer) && this.displayer.isWritable && k.currentManager.worker.completeImageUpload(n, o);
      },
      getImagesInformation: function(n) {
        return k.logger.info("[TeachingAidsSinglePlugin plugin] completeImageUpload"), k.currentManager && _(this.displayer) && this.displayer.isWritable ? k.currentManager.worker.getImagesInformation(n) : [];
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
      injectMethodToObject: function(n, o) {
        if (k.logger.info(`[TeachingAidsSinglePlugin plugin] bindMethodToObject ${o}`), typeof n[o] == "function" || typeof n[o] > "u") {
          n[o] = i[o].bind(i);
          return;
        }
        o === "callbacks" && (n.callbacks.on = i.callbacksOn.bind(i), n.callbacks.off = i.callbacksOff.bind(i), n.callbacks.once = i.callbacksOnce.bind(i));
      }
    };
  }
  static onCreate(l) {
    l && k.currentManager && (k.currentManager.bindPlugin(l), l.init(l.displayer));
  }
  static async createTeachingAidsPlugin(l, e) {
    await l.createInvisiblePlugin(k, {});
    let c = l.getInvisiblePlugin(e);
    return c || (c = await k.createTeachingAidsPlugin(l, e)), c;
  }
  // static onDestroy(plugin: TeachingAidsPlugin) {}
  /**
   * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
   * @param displayer
   */
  static effectInstance() {
    if (k.cursorAdapter) {
      const l = k.cursorAdapter.onAddedCursor;
      k.cursorAdapter.onAddedCursor = function(e) {
        e.onCursorMemberChanged = (c) => {
          try {
            c.appliance === D.pencil || c.appliance === D.shape || c.appliance === D.text || c.appliance === D.arrow || c.appliance === D.straight || c.appliance === D.rectangle || c.appliance === D.ellipse ? e != null && e.divElement && (e.divElement.style.display = "none") : e != null && e.divElement && (e.divElement.style.display = "block");
          } catch {
          }
        }, l.call(k.cursorAdapter, e);
      };
    }
  }
  get isReplay() {
    return Qe(this.displayer);
  }
  get callbackName() {
    return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
  }
  init(l) {
    var e;
    if (_(l)) {
      const c = l.state;
      c != null && c.memberState && ((e = k.currentManager) == null || e.onMemberChange(c.memberState));
    }
    this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener), this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
  }
  destroy() {
    var l;
    (l = k.currentManager) == null || l.destroy(), k.currentManager = void 0, k.cursorAdapter = void 0;
  }
}
Object.defineProperty(k, "kind", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "teaching-single-aids-plugin"
});
Object.defineProperty(k, "logger", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    info: console.log,
    warn: console.warn,
    error: console.error
  }
});
Object.defineProperty(k, "options", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    syncOpt: {
      interval: 300
    },
    canvasOpt: {
      contextType: ae.Canvas2d
    }
  }
});
Object.defineProperty(k, "createCurrentManager", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (t, l, e) => {
    k.currentManager && k.currentManager.destroy();
    const c = {
      plugin: e,
      displayer: t,
      options: l
    }, d = new Hl(c);
    d.init(), k.logger.info("[TeachingAidsPlugin plugin] refresh TeachingAidsSingleManager object"), k.currentManager = d;
  }
});
class se extends h.Component {
  constructor() {
    super(...arguments), Object.defineProperty(this, "mainViewRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    });
  }
  componentDidMount() {
    se.emiter || (se.emiter = Hl.InternalMsgEmitter), se.emiter.emit(F.BindMainView, this.mainViewRef);
  }
  componentWillUnmount() {
    se.emiter.emit(F.DisplayState, fe.unmounted);
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
  ae as ECanvasContextType,
  se as TeachingAidsSigleWrapper,
  U as TeachingMulitAidsPlugin,
  k as TeachingSingleAidsPlugin
};
