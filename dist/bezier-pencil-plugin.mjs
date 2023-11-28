var H0 = Object.defineProperty;
var z0 = (n, l, i) => l in n ? H0(n, l, { enumerable: !0, configurable: !0, writable: !0, value: i }) : n[l] = i;
var dl = (n, l, i) => (z0(n, typeof l != "symbol" ? l + "" : l, i), i), Gd = (n, l, i) => {
  if (!l.has(n))
    throw TypeError("Cannot " + i);
};
var il = (n, l, i) => (Gd(n, l, "read from private field"), i ? i.call(n) : l.get(n)), Xl = (n, l, i) => {
  if (l.has(n))
    throw TypeError("Cannot add the same private member more than once");
  l instanceof WeakSet ? l.add(n) : l.set(n, i);
}, Vl = (n, l, i, c) => (Gd(n, l, "write to private field"), c ? c.call(n, i) : l.set(n, i), i);
var hd = (n, l, i) => (Gd(n, l, "access private method"), i);
import { toJS as gd, autorun as M0, isRoom as Kd, ApplianceNames as Il, InvisiblePlugin as k0, RoomPhase as f0, isPlayer as v0 } from "white-web-sdk";
var el;
(function(n) {
  n[n.pedding = 0] = "pedding", n[n.mounted = 1] = "mounted", n[n.update = 2] = "update", n[n.unmounted = 3] = "unmounted";
})(el || (el = {}));
var Bl;
(function(n) {
  n[n.Normal = 0] = "Normal", n[n.Stroke = 1] = "Stroke", n[n.Dotted = 2] = "Dotted", n[n.LongDotted = 3] = "LongDotted";
})(Bl || (Bl = {}));
var sl;
(function(n) {
  n[n.Pencil = 1] = "Pencil", n[n.Eraser = 2] = "Eraser", n[n.Selector = 3] = "Selector", n[n.Clicker = 4] = "Clicker", n[n.Arrow = 5] = "Arrow", n[n.Hand = 6] = "Hand", n[n.LaserPen = 7] = "LaserPen";
})(sl || (sl = {}));
var ps;
(function(n) {
  n[n.Path = 0] = "Path", n[n.Rect = 1] = "Rect";
})(ps || (ps = {}));
var Ai;
(function(n) {
  n[n.Local = 1] = "Local", n[n.Service = 2] = "Service";
})(Ai || (Ai = {}));
var Bi;
(function(n) {
  n[n.Pending = 0] = "Pending", n[n.Start = 1] = "Start", n[n.Doing = 2] = "Doing", n[n.Done = 3] = "Done", n[n.Freeze = 4] = "Freeze", n[n.Unwritable = 5] = "Unwritable";
})(Bi || (Bi = {}));
var Fi;
(function(n) {
  n[n.Init = 0] = "Init", n[n.Transform = 1] = "Transform", n[n.UpdateTools = 2] = "UpdateTools", n[n.UpdateScene = 3] = "UpdateScene", n[n.CreateWork = 4] = "CreateWork", n[n.DrawWork = 5] = "DrawWork", n[n.FullWork = 6] = "FullWork", n[n.UpdateWork = 7] = "UpdateWork", n[n.UpdateNode = 8] = "UpdateNode", n[n.RemoveNode = 9] = "RemoveNode", n[n.Clear = 10] = "Clear", n[n.Select = 11] = "Select", n[n.Destroy = 12] = "Destroy", n[n.None = 13] = "None", n[n.CombineDraw = 14] = "CombineDraw";
})(Fi || (Fi = {}));
var Ls;
(function(n) {
  n[n.Path = 0] = "Path", n[n.Rect = 1] = "Rect", n[n.Texture = 2] = "Texture";
})(Ls || (Ls = {}));
var Sd;
(function(n) {
  n.Webgl2 = "webgl2", n.Webgl = "webgl", n.Canvas2d = "2d";
})(Sd || (Sd = {}));
var ys;
(function(n) {
  n.immediately = "immediately", n.continuous = "continuous";
})(ys || (ys = {}));
var Ol;
(function(n) {
  n[n.Float = 0] = "Float", n[n.Bg = 1] = "Bg";
})(Ol || (Ol = {}));
var Ti = (
  /******/
  function(n) {
    var l = {};
    function i(c) {
      if (l[c])
        return l[c].exports;
      var m = l[c] = {
        /******/
        i: c,
        /******/
        l: !1,
        /******/
        exports: {}
        /******/
      };
      return n[c].call(m.exports, m, m.exports, i), m.l = !0, m.exports;
    }
    return i.m = n, i.c = l, i.d = function(c, m, L) {
      i.o(c, m) || Object.defineProperty(c, m, { enumerable: !0, get: L });
    }, i.r = function(c) {
      typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(c, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(c, "__esModule", { value: !0 });
    }, i.t = function(c, m) {
      if (m & 1 && (c = i(c)), m & 8 || m & 4 && typeof c == "object" && c && c.__esModule)
        return c;
      var L = /* @__PURE__ */ Object.create(null);
      if (i.r(L), Object.defineProperty(L, "default", { enumerable: !0, value: c }), m & 2 && typeof c != "string")
        for (var K in c)
          i.d(L, K, (function(u) {
            return c[u];
          }).bind(null, K));
      return L;
    }, i.n = function(c) {
      var m = c && c.__esModule ? (
        /******/
        function() {
          return c.default;
        }
      ) : (
        /******/
        function() {
          return c;
        }
      );
      return i.d(m, "a", m), m;
    }, i.o = function(c, m) {
      return Object.prototype.hasOwnProperty.call(c, m);
    }, i.p = "/js/", i(i.s = 0);
  }([
    /* 0 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "version", function() {
        return P;
      }), i.d(l, "helpers", function() {
        return z;
      }), i.d(l, "createElement", function() {
        return N;
      }), i.d(l, "isSpriteNode", function() {
        return x;
      }), i.d(l, "registerNode", function() {
        return R;
      });
      var c = i(12);
      i.d(l, "ENV", function() {
        return c.ENV;
      });
      var m = i(68);
      i.d(l, "requestAnimationFrame", function() {
        return m.requestAnimationFrame;
      }), i.d(l, "cancelAnimationFrame", function() {
        return m.cancelAnimationFrame;
      });
      var L = i(70);
      i.d(l, "Node", function() {
        return L.default;
      });
      var K = i(217);
      i.d(l, "Cloud", function() {
        return K.default;
      });
      var u = i(219);
      i.d(l, "Block", function() {
        return u.default;
      });
      var a = i(224);
      i.d(l, "Sprite", function() {
        return a.default;
      });
      var e = i(226);
      i.d(l, "Path", function() {
        return e.default;
      });
      var r = i(229);
      i.d(l, "Rect", function() {
        return r.default;
      });
      var X = i(231);
      i.d(l, "Triangle", function() {
        return X.default;
      });
      var W = i(236);
      i.d(l, "Parallel", function() {
        return W.default;
      });
      var p = i(238);
      i.d(l, "Regular", function() {
        return p.default;
      });
      var C = i(240);
      i.d(l, "Star", function() {
        return C.default;
      });
      var I = i(242);
      i.d(l, "Ellipse", function() {
        return I.default;
      });
      var o = i(244);
      i.d(l, "Arc", function() {
        return o.default;
      });
      var G = i(246);
      i.d(l, "Ring", function() {
        return G.default;
      });
      var d = i(232);
      i.d(l, "Polyline", function() {
        return d.default;
      });
      var t = i(248);
      i.d(l, "Label", function() {
        return t.default;
      });
      var s = i(250);
      i.d(l, "Group", function() {
        return s.default;
      });
      var b = i(286);
      i.d(l, "Layer", function() {
        return b.default;
      });
      var h = i(287);
      i.d(l, "SpriteSvg", function() {
        return h.default;
      });
      var S = i(289);
      i.d(l, "LayerWorker", function() {
        return S.default;
      });
      var Y = i(290);
      i.d(l, "Scene", function() {
        return Y.default;
      });
      var T = i(213), y = i(221);
      i.d(l, "Color", function() {
        return y.Color;
      }), i.d(l, "Gradient", function() {
        return y.Gradient;
      });
      var J = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const N = T.default.createElement, x = T.default.isSpriteNode, R = T.default.registerNode, z = {
        parseColor: y.parseColor,
        sizeToPixel: J.sizeToPixel,
        toArray: J.toArray,
        toString: J.toString,
        toNumber: J.toNumber
      };
      let Q;
      Q = "3.8.3";
      const P = Q;
    },
    /* 1 */
    /***/
    function(n, l, i) {
      i.r(l);
      var c = i(2);
      i.d(l, "glMatrix", function() {
        return c;
      });
      var m = i(3);
      i.d(l, "mat2", function() {
        return m;
      });
      var L = i(4);
      i.d(l, "mat2d", function() {
        return L;
      });
      var K = i(5);
      i.d(l, "mat3", function() {
        return K;
      });
      var u = i(6);
      i.d(l, "mat4", function() {
        return u;
      });
      var a = i(7);
      i.d(l, "quat", function() {
        return a;
      });
      var e = i(10);
      i.d(l, "quat2", function() {
        return e;
      });
      var r = i(11);
      i.d(l, "vec2", function() {
        return r;
      });
      var X = i(8);
      i.d(l, "vec3", function() {
        return X;
      });
      var W = i(9);
      i.d(l, "vec4", function() {
        return W;
      });
    },
    /* 2 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "EPSILON", function() {
        return c;
      }), i.d(l, "ARRAY_TYPE", function() {
        return m;
      }), i.d(l, "RANDOM", function() {
        return L;
      }), i.d(l, "setMatrixArrayType", function() {
        return K;
      }), i.d(l, "toRadian", function() {
        return a;
      }), i.d(l, "equals", function() {
        return e;
      });
      var c = 1e-6, m = typeof Float32Array < "u" ? Float32Array : Array, L = Math.random;
      function K(r) {
        m = r;
      }
      var u = Math.PI / 180;
      function a(r) {
        return r * u;
      }
      function e(r, X) {
        return Math.abs(r - X) <= c * Math.max(1, Math.abs(r), Math.abs(X));
      }
      Math.hypot || (Math.hypot = function() {
        for (var r = 0, X = arguments.length; X--; )
          r += arguments[X] * arguments[X];
        return Math.sqrt(r);
      });
    },
    /* 3 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "clone", function() {
        return L;
      }), i.d(l, "copy", function() {
        return K;
      }), i.d(l, "identity", function() {
        return u;
      }), i.d(l, "fromValues", function() {
        return a;
      }), i.d(l, "set", function() {
        return e;
      }), i.d(l, "transpose", function() {
        return r;
      }), i.d(l, "invert", function() {
        return X;
      }), i.d(l, "adjoint", function() {
        return W;
      }), i.d(l, "determinant", function() {
        return p;
      }), i.d(l, "multiply", function() {
        return C;
      }), i.d(l, "rotate", function() {
        return I;
      }), i.d(l, "scale", function() {
        return o;
      }), i.d(l, "fromRotation", function() {
        return G;
      }), i.d(l, "fromScaling", function() {
        return d;
      }), i.d(l, "str", function() {
        return t;
      }), i.d(l, "frob", function() {
        return s;
      }), i.d(l, "LDU", function() {
        return b;
      }), i.d(l, "add", function() {
        return h;
      }), i.d(l, "subtract", function() {
        return S;
      }), i.d(l, "exactEquals", function() {
        return Y;
      }), i.d(l, "equals", function() {
        return T;
      }), i.d(l, "multiplyScalar", function() {
        return y;
      }), i.d(l, "multiplyScalarAndAdd", function() {
        return J;
      }), i.d(l, "mul", function() {
        return N;
      }), i.d(l, "sub", function() {
        return x;
      });
      var c = i(2);
      function m() {
        var R = new c.ARRAY_TYPE(4);
        return c.ARRAY_TYPE != Float32Array && (R[1] = 0, R[2] = 0), R[0] = 1, R[3] = 1, R;
      }
      function L(R) {
        var z = new c.ARRAY_TYPE(4);
        return z[0] = R[0], z[1] = R[1], z[2] = R[2], z[3] = R[3], z;
      }
      function K(R, z) {
        return R[0] = z[0], R[1] = z[1], R[2] = z[2], R[3] = z[3], R;
      }
      function u(R) {
        return R[0] = 1, R[1] = 0, R[2] = 0, R[3] = 1, R;
      }
      function a(R, z, Q, P) {
        var D = new c.ARRAY_TYPE(4);
        return D[0] = R, D[1] = z, D[2] = Q, D[3] = P, D;
      }
      function e(R, z, Q, P, D) {
        return R[0] = z, R[1] = Q, R[2] = P, R[3] = D, R;
      }
      function r(R, z) {
        if (R === z) {
          var Q = z[1];
          R[1] = z[2], R[2] = Q;
        } else
          R[0] = z[0], R[1] = z[2], R[2] = z[1], R[3] = z[3];
        return R;
      }
      function X(R, z) {
        var Q = z[0], P = z[1], D = z[2], _ = z[3], F = Q * _ - D * P;
        return F ? (F = 1 / F, R[0] = _ * F, R[1] = -P * F, R[2] = -D * F, R[3] = Q * F, R) : null;
      }
      function W(R, z) {
        var Q = z[0];
        return R[0] = z[3], R[1] = -z[1], R[2] = -z[2], R[3] = Q, R;
      }
      function p(R) {
        return R[0] * R[3] - R[2] * R[1];
      }
      function C(R, z, Q) {
        var P = z[0], D = z[1], _ = z[2], F = z[3], v = Q[0], O = Q[1], li = Q[2], ii = Q[3];
        return R[0] = P * v + _ * O, R[1] = D * v + F * O, R[2] = P * li + _ * ii, R[3] = D * li + F * ii, R;
      }
      function I(R, z, Q) {
        var P = z[0], D = z[1], _ = z[2], F = z[3], v = Math.sin(Q), O = Math.cos(Q);
        return R[0] = P * O + _ * v, R[1] = D * O + F * v, R[2] = P * -v + _ * O, R[3] = D * -v + F * O, R;
      }
      function o(R, z, Q) {
        var P = z[0], D = z[1], _ = z[2], F = z[3], v = Q[0], O = Q[1];
        return R[0] = P * v, R[1] = D * v, R[2] = _ * O, R[3] = F * O, R;
      }
      function G(R, z) {
        var Q = Math.sin(z), P = Math.cos(z);
        return R[0] = P, R[1] = Q, R[2] = -Q, R[3] = P, R;
      }
      function d(R, z) {
        return R[0] = z[0], R[1] = 0, R[2] = 0, R[3] = z[1], R;
      }
      function t(R) {
        return "mat2(" + R[0] + ", " + R[1] + ", " + R[2] + ", " + R[3] + ")";
      }
      function s(R) {
        return Math.hypot(R[0], R[1], R[2], R[3]);
      }
      function b(R, z, Q, P) {
        return R[2] = P[2] / P[0], Q[0] = P[0], Q[1] = P[1], Q[3] = P[3] - R[2] * Q[1], [R, z, Q];
      }
      function h(R, z, Q) {
        return R[0] = z[0] + Q[0], R[1] = z[1] + Q[1], R[2] = z[2] + Q[2], R[3] = z[3] + Q[3], R;
      }
      function S(R, z, Q) {
        return R[0] = z[0] - Q[0], R[1] = z[1] - Q[1], R[2] = z[2] - Q[2], R[3] = z[3] - Q[3], R;
      }
      function Y(R, z) {
        return R[0] === z[0] && R[1] === z[1] && R[2] === z[2] && R[3] === z[3];
      }
      function T(R, z) {
        var Q = R[0], P = R[1], D = R[2], _ = R[3], F = z[0], v = z[1], O = z[2], li = z[3];
        return Math.abs(Q - F) <= c.EPSILON * Math.max(1, Math.abs(Q), Math.abs(F)) && Math.abs(P - v) <= c.EPSILON * Math.max(1, Math.abs(P), Math.abs(v)) && Math.abs(D - O) <= c.EPSILON * Math.max(1, Math.abs(D), Math.abs(O)) && Math.abs(_ - li) <= c.EPSILON * Math.max(1, Math.abs(_), Math.abs(li));
      }
      function y(R, z, Q) {
        return R[0] = z[0] * Q, R[1] = z[1] * Q, R[2] = z[2] * Q, R[3] = z[3] * Q, R;
      }
      function J(R, z, Q, P) {
        return R[0] = z[0] + Q[0] * P, R[1] = z[1] + Q[1] * P, R[2] = z[2] + Q[2] * P, R[3] = z[3] + Q[3] * P, R;
      }
      var N = C, x = S;
    },
    /* 4 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "clone", function() {
        return L;
      }), i.d(l, "copy", function() {
        return K;
      }), i.d(l, "identity", function() {
        return u;
      }), i.d(l, "fromValues", function() {
        return a;
      }), i.d(l, "set", function() {
        return e;
      }), i.d(l, "invert", function() {
        return r;
      }), i.d(l, "determinant", function() {
        return X;
      }), i.d(l, "multiply", function() {
        return W;
      }), i.d(l, "rotate", function() {
        return p;
      }), i.d(l, "scale", function() {
        return C;
      }), i.d(l, "translate", function() {
        return I;
      }), i.d(l, "fromRotation", function() {
        return o;
      }), i.d(l, "fromScaling", function() {
        return G;
      }), i.d(l, "fromTranslation", function() {
        return d;
      }), i.d(l, "str", function() {
        return t;
      }), i.d(l, "frob", function() {
        return s;
      }), i.d(l, "add", function() {
        return b;
      }), i.d(l, "subtract", function() {
        return h;
      }), i.d(l, "multiplyScalar", function() {
        return S;
      }), i.d(l, "multiplyScalarAndAdd", function() {
        return Y;
      }), i.d(l, "exactEquals", function() {
        return T;
      }), i.d(l, "equals", function() {
        return y;
      }), i.d(l, "mul", function() {
        return J;
      }), i.d(l, "sub", function() {
        return N;
      });
      var c = i(2);
      function m() {
        var x = new c.ARRAY_TYPE(6);
        return c.ARRAY_TYPE != Float32Array && (x[1] = 0, x[2] = 0, x[4] = 0, x[5] = 0), x[0] = 1, x[3] = 1, x;
      }
      function L(x) {
        var R = new c.ARRAY_TYPE(6);
        return R[0] = x[0], R[1] = x[1], R[2] = x[2], R[3] = x[3], R[4] = x[4], R[5] = x[5], R;
      }
      function K(x, R) {
        return x[0] = R[0], x[1] = R[1], x[2] = R[2], x[3] = R[3], x[4] = R[4], x[5] = R[5], x;
      }
      function u(x) {
        return x[0] = 1, x[1] = 0, x[2] = 0, x[3] = 1, x[4] = 0, x[5] = 0, x;
      }
      function a(x, R, z, Q, P, D) {
        var _ = new c.ARRAY_TYPE(6);
        return _[0] = x, _[1] = R, _[2] = z, _[3] = Q, _[4] = P, _[5] = D, _;
      }
      function e(x, R, z, Q, P, D, _) {
        return x[0] = R, x[1] = z, x[2] = Q, x[3] = P, x[4] = D, x[5] = _, x;
      }
      function r(x, R) {
        var z = R[0], Q = R[1], P = R[2], D = R[3], _ = R[4], F = R[5], v = z * D - Q * P;
        return v ? (v = 1 / v, x[0] = D * v, x[1] = -Q * v, x[2] = -P * v, x[3] = z * v, x[4] = (P * F - D * _) * v, x[5] = (Q * _ - z * F) * v, x) : null;
      }
      function X(x) {
        return x[0] * x[3] - x[1] * x[2];
      }
      function W(x, R, z) {
        var Q = R[0], P = R[1], D = R[2], _ = R[3], F = R[4], v = R[5], O = z[0], li = z[1], ii = z[2], ti = z[3], $ = z[4], ai = z[5];
        return x[0] = Q * O + D * li, x[1] = P * O + _ * li, x[2] = Q * ii + D * ti, x[3] = P * ii + _ * ti, x[4] = Q * $ + D * ai + F, x[5] = P * $ + _ * ai + v, x;
      }
      function p(x, R, z) {
        var Q = R[0], P = R[1], D = R[2], _ = R[3], F = R[4], v = R[5], O = Math.sin(z), li = Math.cos(z);
        return x[0] = Q * li + D * O, x[1] = P * li + _ * O, x[2] = Q * -O + D * li, x[3] = P * -O + _ * li, x[4] = F, x[5] = v, x;
      }
      function C(x, R, z) {
        var Q = R[0], P = R[1], D = R[2], _ = R[3], F = R[4], v = R[5], O = z[0], li = z[1];
        return x[0] = Q * O, x[1] = P * O, x[2] = D * li, x[3] = _ * li, x[4] = F, x[5] = v, x;
      }
      function I(x, R, z) {
        var Q = R[0], P = R[1], D = R[2], _ = R[3], F = R[4], v = R[5], O = z[0], li = z[1];
        return x[0] = Q, x[1] = P, x[2] = D, x[3] = _, x[4] = Q * O + D * li + F, x[5] = P * O + _ * li + v, x;
      }
      function o(x, R) {
        var z = Math.sin(R), Q = Math.cos(R);
        return x[0] = Q, x[1] = z, x[2] = -z, x[3] = Q, x[4] = 0, x[5] = 0, x;
      }
      function G(x, R) {
        return x[0] = R[0], x[1] = 0, x[2] = 0, x[3] = R[1], x[4] = 0, x[5] = 0, x;
      }
      function d(x, R) {
        return x[0] = 1, x[1] = 0, x[2] = 0, x[3] = 1, x[4] = R[0], x[5] = R[1], x;
      }
      function t(x) {
        return "mat2d(" + x[0] + ", " + x[1] + ", " + x[2] + ", " + x[3] + ", " + x[4] + ", " + x[5] + ")";
      }
      function s(x) {
        return Math.hypot(x[0], x[1], x[2], x[3], x[4], x[5], 1);
      }
      function b(x, R, z) {
        return x[0] = R[0] + z[0], x[1] = R[1] + z[1], x[2] = R[2] + z[2], x[3] = R[3] + z[3], x[4] = R[4] + z[4], x[5] = R[5] + z[5], x;
      }
      function h(x, R, z) {
        return x[0] = R[0] - z[0], x[1] = R[1] - z[1], x[2] = R[2] - z[2], x[3] = R[3] - z[3], x[4] = R[4] - z[4], x[5] = R[5] - z[5], x;
      }
      function S(x, R, z) {
        return x[0] = R[0] * z, x[1] = R[1] * z, x[2] = R[2] * z, x[3] = R[3] * z, x[4] = R[4] * z, x[5] = R[5] * z, x;
      }
      function Y(x, R, z, Q) {
        return x[0] = R[0] + z[0] * Q, x[1] = R[1] + z[1] * Q, x[2] = R[2] + z[2] * Q, x[3] = R[3] + z[3] * Q, x[4] = R[4] + z[4] * Q, x[5] = R[5] + z[5] * Q, x;
      }
      function T(x, R) {
        return x[0] === R[0] && x[1] === R[1] && x[2] === R[2] && x[3] === R[3] && x[4] === R[4] && x[5] === R[5];
      }
      function y(x, R) {
        var z = x[0], Q = x[1], P = x[2], D = x[3], _ = x[4], F = x[5], v = R[0], O = R[1], li = R[2], ii = R[3], ti = R[4], $ = R[5];
        return Math.abs(z - v) <= c.EPSILON * Math.max(1, Math.abs(z), Math.abs(v)) && Math.abs(Q - O) <= c.EPSILON * Math.max(1, Math.abs(Q), Math.abs(O)) && Math.abs(P - li) <= c.EPSILON * Math.max(1, Math.abs(P), Math.abs(li)) && Math.abs(D - ii) <= c.EPSILON * Math.max(1, Math.abs(D), Math.abs(ii)) && Math.abs(_ - ti) <= c.EPSILON * Math.max(1, Math.abs(_), Math.abs(ti)) && Math.abs(F - $) <= c.EPSILON * Math.max(1, Math.abs(F), Math.abs($));
      }
      var J = W, N = h;
    },
    /* 5 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "fromMat4", function() {
        return L;
      }), i.d(l, "clone", function() {
        return K;
      }), i.d(l, "copy", function() {
        return u;
      }), i.d(l, "fromValues", function() {
        return a;
      }), i.d(l, "set", function() {
        return e;
      }), i.d(l, "identity", function() {
        return r;
      }), i.d(l, "transpose", function() {
        return X;
      }), i.d(l, "invert", function() {
        return W;
      }), i.d(l, "adjoint", function() {
        return p;
      }), i.d(l, "determinant", function() {
        return C;
      }), i.d(l, "multiply", function() {
        return I;
      }), i.d(l, "translate", function() {
        return o;
      }), i.d(l, "rotate", function() {
        return G;
      }), i.d(l, "scale", function() {
        return d;
      }), i.d(l, "fromTranslation", function() {
        return t;
      }), i.d(l, "fromRotation", function() {
        return s;
      }), i.d(l, "fromScaling", function() {
        return b;
      }), i.d(l, "fromMat2d", function() {
        return h;
      }), i.d(l, "fromQuat", function() {
        return S;
      }), i.d(l, "normalFromMat4", function() {
        return Y;
      }), i.d(l, "projection", function() {
        return T;
      }), i.d(l, "str", function() {
        return y;
      }), i.d(l, "frob", function() {
        return J;
      }), i.d(l, "add", function() {
        return N;
      }), i.d(l, "subtract", function() {
        return x;
      }), i.d(l, "multiplyScalar", function() {
        return R;
      }), i.d(l, "multiplyScalarAndAdd", function() {
        return z;
      }), i.d(l, "exactEquals", function() {
        return Q;
      }), i.d(l, "equals", function() {
        return P;
      }), i.d(l, "mul", function() {
        return D;
      }), i.d(l, "sub", function() {
        return _;
      });
      var c = i(2);
      function m() {
        var F = new c.ARRAY_TYPE(9);
        return c.ARRAY_TYPE != Float32Array && (F[1] = 0, F[2] = 0, F[3] = 0, F[5] = 0, F[6] = 0, F[7] = 0), F[0] = 1, F[4] = 1, F[8] = 1, F;
      }
      function L(F, v) {
        return F[0] = v[0], F[1] = v[1], F[2] = v[2], F[3] = v[4], F[4] = v[5], F[5] = v[6], F[6] = v[8], F[7] = v[9], F[8] = v[10], F;
      }
      function K(F) {
        var v = new c.ARRAY_TYPE(9);
        return v[0] = F[0], v[1] = F[1], v[2] = F[2], v[3] = F[3], v[4] = F[4], v[5] = F[5], v[6] = F[6], v[7] = F[7], v[8] = F[8], v;
      }
      function u(F, v) {
        return F[0] = v[0], F[1] = v[1], F[2] = v[2], F[3] = v[3], F[4] = v[4], F[5] = v[5], F[6] = v[6], F[7] = v[7], F[8] = v[8], F;
      }
      function a(F, v, O, li, ii, ti, $, ai, Xi) {
        var M = new c.ARRAY_TYPE(9);
        return M[0] = F, M[1] = v, M[2] = O, M[3] = li, M[4] = ii, M[5] = ti, M[6] = $, M[7] = ai, M[8] = Xi, M;
      }
      function e(F, v, O, li, ii, ti, $, ai, Xi, M) {
        return F[0] = v, F[1] = O, F[2] = li, F[3] = ii, F[4] = ti, F[5] = $, F[6] = ai, F[7] = Xi, F[8] = M, F;
      }
      function r(F) {
        return F[0] = 1, F[1] = 0, F[2] = 0, F[3] = 0, F[4] = 1, F[5] = 0, F[6] = 0, F[7] = 0, F[8] = 1, F;
      }
      function X(F, v) {
        if (F === v) {
          var O = v[1], li = v[2], ii = v[5];
          F[1] = v[3], F[2] = v[6], F[3] = O, F[5] = v[7], F[6] = li, F[7] = ii;
        } else
          F[0] = v[0], F[1] = v[3], F[2] = v[6], F[3] = v[1], F[4] = v[4], F[5] = v[7], F[6] = v[2], F[7] = v[5], F[8] = v[8];
        return F;
      }
      function W(F, v) {
        var O = v[0], li = v[1], ii = v[2], ti = v[3], $ = v[4], ai = v[5], Xi = v[6], M = v[7], k = v[8], j = k * $ - ai * M, A = -k * ti + ai * Xi, H = M * ti - $ * Xi, U = O * j + li * A + ii * H;
        return U ? (U = 1 / U, F[0] = j * U, F[1] = (-k * li + ii * M) * U, F[2] = (ai * li - ii * $) * U, F[3] = A * U, F[4] = (k * O - ii * Xi) * U, F[5] = (-ai * O + ii * ti) * U, F[6] = H * U, F[7] = (-M * O + li * Xi) * U, F[8] = ($ * O - li * ti) * U, F) : null;
      }
      function p(F, v) {
        var O = v[0], li = v[1], ii = v[2], ti = v[3], $ = v[4], ai = v[5], Xi = v[6], M = v[7], k = v[8];
        return F[0] = $ * k - ai * M, F[1] = ii * M - li * k, F[2] = li * ai - ii * $, F[3] = ai * Xi - ti * k, F[4] = O * k - ii * Xi, F[5] = ii * ti - O * ai, F[6] = ti * M - $ * Xi, F[7] = li * Xi - O * M, F[8] = O * $ - li * ti, F;
      }
      function C(F) {
        var v = F[0], O = F[1], li = F[2], ii = F[3], ti = F[4], $ = F[5], ai = F[6], Xi = F[7], M = F[8];
        return v * (M * ti - $ * Xi) + O * (-M * ii + $ * ai) + li * (Xi * ii - ti * ai);
      }
      function I(F, v, O) {
        var li = v[0], ii = v[1], ti = v[2], $ = v[3], ai = v[4], Xi = v[5], M = v[6], k = v[7], j = v[8], A = O[0], H = O[1], U = O[2], Z = O[3], V = O[4], g = O[5], f = O[6], w = O[7], B = O[8];
        return F[0] = A * li + H * $ + U * M, F[1] = A * ii + H * ai + U * k, F[2] = A * ti + H * Xi + U * j, F[3] = Z * li + V * $ + g * M, F[4] = Z * ii + V * ai + g * k, F[5] = Z * ti + V * Xi + g * j, F[6] = f * li + w * $ + B * M, F[7] = f * ii + w * ai + B * k, F[8] = f * ti + w * Xi + B * j, F;
      }
      function o(F, v, O) {
        var li = v[0], ii = v[1], ti = v[2], $ = v[3], ai = v[4], Xi = v[5], M = v[6], k = v[7], j = v[8], A = O[0], H = O[1];
        return F[0] = li, F[1] = ii, F[2] = ti, F[3] = $, F[4] = ai, F[5] = Xi, F[6] = A * li + H * $ + M, F[7] = A * ii + H * ai + k, F[8] = A * ti + H * Xi + j, F;
      }
      function G(F, v, O) {
        var li = v[0], ii = v[1], ti = v[2], $ = v[3], ai = v[4], Xi = v[5], M = v[6], k = v[7], j = v[8], A = Math.sin(O), H = Math.cos(O);
        return F[0] = H * li + A * $, F[1] = H * ii + A * ai, F[2] = H * ti + A * Xi, F[3] = H * $ - A * li, F[4] = H * ai - A * ii, F[5] = H * Xi - A * ti, F[6] = M, F[7] = k, F[8] = j, F;
      }
      function d(F, v, O) {
        var li = O[0], ii = O[1];
        return F[0] = li * v[0], F[1] = li * v[1], F[2] = li * v[2], F[3] = ii * v[3], F[4] = ii * v[4], F[5] = ii * v[5], F[6] = v[6], F[7] = v[7], F[8] = v[8], F;
      }
      function t(F, v) {
        return F[0] = 1, F[1] = 0, F[2] = 0, F[3] = 0, F[4] = 1, F[5] = 0, F[6] = v[0], F[7] = v[1], F[8] = 1, F;
      }
      function s(F, v) {
        var O = Math.sin(v), li = Math.cos(v);
        return F[0] = li, F[1] = O, F[2] = 0, F[3] = -O, F[4] = li, F[5] = 0, F[6] = 0, F[7] = 0, F[8] = 1, F;
      }
      function b(F, v) {
        return F[0] = v[0], F[1] = 0, F[2] = 0, F[3] = 0, F[4] = v[1], F[5] = 0, F[6] = 0, F[7] = 0, F[8] = 1, F;
      }
      function h(F, v) {
        return F[0] = v[0], F[1] = v[1], F[2] = 0, F[3] = v[2], F[4] = v[3], F[5] = 0, F[6] = v[4], F[7] = v[5], F[8] = 1, F;
      }
      function S(F, v) {
        var O = v[0], li = v[1], ii = v[2], ti = v[3], $ = O + O, ai = li + li, Xi = ii + ii, M = O * $, k = li * $, j = li * ai, A = ii * $, H = ii * ai, U = ii * Xi, Z = ti * $, V = ti * ai, g = ti * Xi;
        return F[0] = 1 - j - U, F[3] = k - g, F[6] = A + V, F[1] = k + g, F[4] = 1 - M - U, F[7] = H - Z, F[2] = A - V, F[5] = H + Z, F[8] = 1 - M - j, F;
      }
      function Y(F, v) {
        var O = v[0], li = v[1], ii = v[2], ti = v[3], $ = v[4], ai = v[5], Xi = v[6], M = v[7], k = v[8], j = v[9], A = v[10], H = v[11], U = v[12], Z = v[13], V = v[14], g = v[15], f = O * ai - li * $, w = O * Xi - ii * $, B = O * M - ti * $, q = li * Xi - ii * ai, si = li * M - ti * ai, bi = ii * M - ti * Xi, mi = k * Z - j * U, oi = k * V - A * U, Zi = k * g - H * U, ci = j * V - A * Z, ni = j * g - H * Z, Gi = A * g - H * V, hi = f * Gi - w * ni + B * ci + q * Zi - si * oi + bi * mi;
        return hi ? (hi = 1 / hi, F[0] = (ai * Gi - Xi * ni + M * ci) * hi, F[1] = (Xi * Zi - $ * Gi - M * oi) * hi, F[2] = ($ * ni - ai * Zi + M * mi) * hi, F[3] = (ii * ni - li * Gi - ti * ci) * hi, F[4] = (O * Gi - ii * Zi + ti * oi) * hi, F[5] = (li * Zi - O * ni - ti * mi) * hi, F[6] = (Z * bi - V * si + g * q) * hi, F[7] = (V * B - U * bi - g * w) * hi, F[8] = (U * si - Z * B + g * f) * hi, F) : null;
      }
      function T(F, v, O) {
        return F[0] = 2 / v, F[1] = 0, F[2] = 0, F[3] = 0, F[4] = -2 / O, F[5] = 0, F[6] = -1, F[7] = 1, F[8] = 1, F;
      }
      function y(F) {
        return "mat3(" + F[0] + ", " + F[1] + ", " + F[2] + ", " + F[3] + ", " + F[4] + ", " + F[5] + ", " + F[6] + ", " + F[7] + ", " + F[8] + ")";
      }
      function J(F) {
        return Math.hypot(F[0], F[1], F[2], F[3], F[4], F[5], F[6], F[7], F[8]);
      }
      function N(F, v, O) {
        return F[0] = v[0] + O[0], F[1] = v[1] + O[1], F[2] = v[2] + O[2], F[3] = v[3] + O[3], F[4] = v[4] + O[4], F[5] = v[5] + O[5], F[6] = v[6] + O[6], F[7] = v[7] + O[7], F[8] = v[8] + O[8], F;
      }
      function x(F, v, O) {
        return F[0] = v[0] - O[0], F[1] = v[1] - O[1], F[2] = v[2] - O[2], F[3] = v[3] - O[3], F[4] = v[4] - O[4], F[5] = v[5] - O[5], F[6] = v[6] - O[6], F[7] = v[7] - O[7], F[8] = v[8] - O[8], F;
      }
      function R(F, v, O) {
        return F[0] = v[0] * O, F[1] = v[1] * O, F[2] = v[2] * O, F[3] = v[3] * O, F[4] = v[4] * O, F[5] = v[5] * O, F[6] = v[6] * O, F[7] = v[7] * O, F[8] = v[8] * O, F;
      }
      function z(F, v, O, li) {
        return F[0] = v[0] + O[0] * li, F[1] = v[1] + O[1] * li, F[2] = v[2] + O[2] * li, F[3] = v[3] + O[3] * li, F[4] = v[4] + O[4] * li, F[5] = v[5] + O[5] * li, F[6] = v[6] + O[6] * li, F[7] = v[7] + O[7] * li, F[8] = v[8] + O[8] * li, F;
      }
      function Q(F, v) {
        return F[0] === v[0] && F[1] === v[1] && F[2] === v[2] && F[3] === v[3] && F[4] === v[4] && F[5] === v[5] && F[6] === v[6] && F[7] === v[7] && F[8] === v[8];
      }
      function P(F, v) {
        var O = F[0], li = F[1], ii = F[2], ti = F[3], $ = F[4], ai = F[5], Xi = F[6], M = F[7], k = F[8], j = v[0], A = v[1], H = v[2], U = v[3], Z = v[4], V = v[5], g = v[6], f = v[7], w = v[8];
        return Math.abs(O - j) <= c.EPSILON * Math.max(1, Math.abs(O), Math.abs(j)) && Math.abs(li - A) <= c.EPSILON * Math.max(1, Math.abs(li), Math.abs(A)) && Math.abs(ii - H) <= c.EPSILON * Math.max(1, Math.abs(ii), Math.abs(H)) && Math.abs(ti - U) <= c.EPSILON * Math.max(1, Math.abs(ti), Math.abs(U)) && Math.abs($ - Z) <= c.EPSILON * Math.max(1, Math.abs($), Math.abs(Z)) && Math.abs(ai - V) <= c.EPSILON * Math.max(1, Math.abs(ai), Math.abs(V)) && Math.abs(Xi - g) <= c.EPSILON * Math.max(1, Math.abs(Xi), Math.abs(g)) && Math.abs(M - f) <= c.EPSILON * Math.max(1, Math.abs(M), Math.abs(f)) && Math.abs(k - w) <= c.EPSILON * Math.max(1, Math.abs(k), Math.abs(w));
      }
      var D = I, _ = x;
    },
    /* 6 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "clone", function() {
        return L;
      }), i.d(l, "copy", function() {
        return K;
      }), i.d(l, "fromValues", function() {
        return u;
      }), i.d(l, "set", function() {
        return a;
      }), i.d(l, "identity", function() {
        return e;
      }), i.d(l, "transpose", function() {
        return r;
      }), i.d(l, "invert", function() {
        return X;
      }), i.d(l, "adjoint", function() {
        return W;
      }), i.d(l, "determinant", function() {
        return p;
      }), i.d(l, "multiply", function() {
        return C;
      }), i.d(l, "translate", function() {
        return I;
      }), i.d(l, "scale", function() {
        return o;
      }), i.d(l, "rotate", function() {
        return G;
      }), i.d(l, "rotateX", function() {
        return d;
      }), i.d(l, "rotateY", function() {
        return t;
      }), i.d(l, "rotateZ", function() {
        return s;
      }), i.d(l, "fromTranslation", function() {
        return b;
      }), i.d(l, "fromScaling", function() {
        return h;
      }), i.d(l, "fromRotation", function() {
        return S;
      }), i.d(l, "fromXRotation", function() {
        return Y;
      }), i.d(l, "fromYRotation", function() {
        return T;
      }), i.d(l, "fromZRotation", function() {
        return y;
      }), i.d(l, "fromRotationTranslation", function() {
        return J;
      }), i.d(l, "fromQuat2", function() {
        return N;
      }), i.d(l, "getTranslation", function() {
        return x;
      }), i.d(l, "getScaling", function() {
        return R;
      }), i.d(l, "getRotation", function() {
        return z;
      }), i.d(l, "fromRotationTranslationScale", function() {
        return Q;
      }), i.d(l, "fromRotationTranslationScaleOrigin", function() {
        return P;
      }), i.d(l, "fromQuat", function() {
        return D;
      }), i.d(l, "frustum", function() {
        return _;
      }), i.d(l, "perspective", function() {
        return F;
      }), i.d(l, "perspectiveFromFieldOfView", function() {
        return v;
      }), i.d(l, "ortho", function() {
        return O;
      }), i.d(l, "lookAt", function() {
        return li;
      }), i.d(l, "targetTo", function() {
        return ii;
      }), i.d(l, "str", function() {
        return ti;
      }), i.d(l, "frob", function() {
        return $;
      }), i.d(l, "add", function() {
        return ai;
      }), i.d(l, "subtract", function() {
        return Xi;
      }), i.d(l, "multiplyScalar", function() {
        return M;
      }), i.d(l, "multiplyScalarAndAdd", function() {
        return k;
      }), i.d(l, "exactEquals", function() {
        return j;
      }), i.d(l, "equals", function() {
        return A;
      }), i.d(l, "mul", function() {
        return H;
      }), i.d(l, "sub", function() {
        return U;
      });
      var c = i(2);
      function m() {
        var Z = new c.ARRAY_TYPE(16);
        return c.ARRAY_TYPE != Float32Array && (Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0), Z[0] = 1, Z[5] = 1, Z[10] = 1, Z[15] = 1, Z;
      }
      function L(Z) {
        var V = new c.ARRAY_TYPE(16);
        return V[0] = Z[0], V[1] = Z[1], V[2] = Z[2], V[3] = Z[3], V[4] = Z[4], V[5] = Z[5], V[6] = Z[6], V[7] = Z[7], V[8] = Z[8], V[9] = Z[9], V[10] = Z[10], V[11] = Z[11], V[12] = Z[12], V[13] = Z[13], V[14] = Z[14], V[15] = Z[15], V;
      }
      function K(Z, V) {
        return Z[0] = V[0], Z[1] = V[1], Z[2] = V[2], Z[3] = V[3], Z[4] = V[4], Z[5] = V[5], Z[6] = V[6], Z[7] = V[7], Z[8] = V[8], Z[9] = V[9], Z[10] = V[10], Z[11] = V[11], Z[12] = V[12], Z[13] = V[13], Z[14] = V[14], Z[15] = V[15], Z;
      }
      function u(Z, V, g, f, w, B, q, si, bi, mi, oi, Zi, ci, ni, Gi, hi) {
        var Wi = new c.ARRAY_TYPE(16);
        return Wi[0] = Z, Wi[1] = V, Wi[2] = g, Wi[3] = f, Wi[4] = w, Wi[5] = B, Wi[6] = q, Wi[7] = si, Wi[8] = bi, Wi[9] = mi, Wi[10] = oi, Wi[11] = Zi, Wi[12] = ci, Wi[13] = ni, Wi[14] = Gi, Wi[15] = hi, Wi;
      }
      function a(Z, V, g, f, w, B, q, si, bi, mi, oi, Zi, ci, ni, Gi, hi, Wi) {
        return Z[0] = V, Z[1] = g, Z[2] = f, Z[3] = w, Z[4] = B, Z[5] = q, Z[6] = si, Z[7] = bi, Z[8] = mi, Z[9] = oi, Z[10] = Zi, Z[11] = ci, Z[12] = ni, Z[13] = Gi, Z[14] = hi, Z[15] = Wi, Z;
      }
      function e(Z) {
        return Z[0] = 1, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = 1, Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[10] = 1, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z;
      }
      function r(Z, V) {
        if (Z === V) {
          var g = V[1], f = V[2], w = V[3], B = V[6], q = V[7], si = V[11];
          Z[1] = V[4], Z[2] = V[8], Z[3] = V[12], Z[4] = g, Z[6] = V[9], Z[7] = V[13], Z[8] = f, Z[9] = B, Z[11] = V[14], Z[12] = w, Z[13] = q, Z[14] = si;
        } else
          Z[0] = V[0], Z[1] = V[4], Z[2] = V[8], Z[3] = V[12], Z[4] = V[1], Z[5] = V[5], Z[6] = V[9], Z[7] = V[13], Z[8] = V[2], Z[9] = V[6], Z[10] = V[10], Z[11] = V[14], Z[12] = V[3], Z[13] = V[7], Z[14] = V[11], Z[15] = V[15];
        return Z;
      }
      function X(Z, V) {
        var g = V[0], f = V[1], w = V[2], B = V[3], q = V[4], si = V[5], bi = V[6], mi = V[7], oi = V[8], Zi = V[9], ci = V[10], ni = V[11], Gi = V[12], hi = V[13], Wi = V[14], Ii = V[15], xi = g * si - f * q, yi = g * bi - w * q, Li = g * mi - B * q, ri = f * bi - w * si, Si = f * mi - B * si, wi = w * mi - B * bi, Mi = oi * hi - Zi * Gi, Qi = oi * Wi - ci * Gi, ki = oi * Ii - ni * Gi, Pi = Zi * Wi - ci * hi, fi = Zi * Ii - ni * hi, ji = ci * Ii - ni * Wi, Ji = xi * ji - yi * fi + Li * Pi + ri * ki - Si * Qi + wi * Mi;
        return Ji ? (Ji = 1 / Ji, Z[0] = (si * ji - bi * fi + mi * Pi) * Ji, Z[1] = (w * fi - f * ji - B * Pi) * Ji, Z[2] = (hi * wi - Wi * Si + Ii * ri) * Ji, Z[3] = (ci * Si - Zi * wi - ni * ri) * Ji, Z[4] = (bi * ki - q * ji - mi * Qi) * Ji, Z[5] = (g * ji - w * ki + B * Qi) * Ji, Z[6] = (Wi * Li - Gi * wi - Ii * yi) * Ji, Z[7] = (oi * wi - ci * Li + ni * yi) * Ji, Z[8] = (q * fi - si * ki + mi * Mi) * Ji, Z[9] = (f * ki - g * fi - B * Mi) * Ji, Z[10] = (Gi * Si - hi * Li + Ii * xi) * Ji, Z[11] = (Zi * Li - oi * Si - ni * xi) * Ji, Z[12] = (si * Qi - q * Pi - bi * Mi) * Ji, Z[13] = (g * Pi - f * Qi + w * Mi) * Ji, Z[14] = (hi * yi - Gi * ri - Wi * xi) * Ji, Z[15] = (oi * ri - Zi * yi + ci * xi) * Ji, Z) : null;
      }
      function W(Z, V) {
        var g = V[0], f = V[1], w = V[2], B = V[3], q = V[4], si = V[5], bi = V[6], mi = V[7], oi = V[8], Zi = V[9], ci = V[10], ni = V[11], Gi = V[12], hi = V[13], Wi = V[14], Ii = V[15];
        return Z[0] = si * (ci * Ii - ni * Wi) - Zi * (bi * Ii - mi * Wi) + hi * (bi * ni - mi * ci), Z[1] = -(f * (ci * Ii - ni * Wi) - Zi * (w * Ii - B * Wi) + hi * (w * ni - B * ci)), Z[2] = f * (bi * Ii - mi * Wi) - si * (w * Ii - B * Wi) + hi * (w * mi - B * bi), Z[3] = -(f * (bi * ni - mi * ci) - si * (w * ni - B * ci) + Zi * (w * mi - B * bi)), Z[4] = -(q * (ci * Ii - ni * Wi) - oi * (bi * Ii - mi * Wi) + Gi * (bi * ni - mi * ci)), Z[5] = g * (ci * Ii - ni * Wi) - oi * (w * Ii - B * Wi) + Gi * (w * ni - B * ci), Z[6] = -(g * (bi * Ii - mi * Wi) - q * (w * Ii - B * Wi) + Gi * (w * mi - B * bi)), Z[7] = g * (bi * ni - mi * ci) - q * (w * ni - B * ci) + oi * (w * mi - B * bi), Z[8] = q * (Zi * Ii - ni * hi) - oi * (si * Ii - mi * hi) + Gi * (si * ni - mi * Zi), Z[9] = -(g * (Zi * Ii - ni * hi) - oi * (f * Ii - B * hi) + Gi * (f * ni - B * Zi)), Z[10] = g * (si * Ii - mi * hi) - q * (f * Ii - B * hi) + Gi * (f * mi - B * si), Z[11] = -(g * (si * ni - mi * Zi) - q * (f * ni - B * Zi) + oi * (f * mi - B * si)), Z[12] = -(q * (Zi * Wi - ci * hi) - oi * (si * Wi - bi * hi) + Gi * (si * ci - bi * Zi)), Z[13] = g * (Zi * Wi - ci * hi) - oi * (f * Wi - w * hi) + Gi * (f * ci - w * Zi), Z[14] = -(g * (si * Wi - bi * hi) - q * (f * Wi - w * hi) + Gi * (f * bi - w * si)), Z[15] = g * (si * ci - bi * Zi) - q * (f * ci - w * Zi) + oi * (f * bi - w * si), Z;
      }
      function p(Z) {
        var V = Z[0], g = Z[1], f = Z[2], w = Z[3], B = Z[4], q = Z[5], si = Z[6], bi = Z[7], mi = Z[8], oi = Z[9], Zi = Z[10], ci = Z[11], ni = Z[12], Gi = Z[13], hi = Z[14], Wi = Z[15], Ii = V * q - g * B, xi = V * si - f * B, yi = V * bi - w * B, Li = g * si - f * q, ri = g * bi - w * q, Si = f * bi - w * si, wi = mi * Gi - oi * ni, Mi = mi * hi - Zi * ni, Qi = mi * Wi - ci * ni, ki = oi * hi - Zi * Gi, Pi = oi * Wi - ci * Gi, fi = Zi * Wi - ci * hi;
        return Ii * fi - xi * Pi + yi * ki + Li * Qi - ri * Mi + Si * wi;
      }
      function C(Z, V, g) {
        var f = V[0], w = V[1], B = V[2], q = V[3], si = V[4], bi = V[5], mi = V[6], oi = V[7], Zi = V[8], ci = V[9], ni = V[10], Gi = V[11], hi = V[12], Wi = V[13], Ii = V[14], xi = V[15], yi = g[0], Li = g[1], ri = g[2], Si = g[3];
        return Z[0] = yi * f + Li * si + ri * Zi + Si * hi, Z[1] = yi * w + Li * bi + ri * ci + Si * Wi, Z[2] = yi * B + Li * mi + ri * ni + Si * Ii, Z[3] = yi * q + Li * oi + ri * Gi + Si * xi, yi = g[4], Li = g[5], ri = g[6], Si = g[7], Z[4] = yi * f + Li * si + ri * Zi + Si * hi, Z[5] = yi * w + Li * bi + ri * ci + Si * Wi, Z[6] = yi * B + Li * mi + ri * ni + Si * Ii, Z[7] = yi * q + Li * oi + ri * Gi + Si * xi, yi = g[8], Li = g[9], ri = g[10], Si = g[11], Z[8] = yi * f + Li * si + ri * Zi + Si * hi, Z[9] = yi * w + Li * bi + ri * ci + Si * Wi, Z[10] = yi * B + Li * mi + ri * ni + Si * Ii, Z[11] = yi * q + Li * oi + ri * Gi + Si * xi, yi = g[12], Li = g[13], ri = g[14], Si = g[15], Z[12] = yi * f + Li * si + ri * Zi + Si * hi, Z[13] = yi * w + Li * bi + ri * ci + Si * Wi, Z[14] = yi * B + Li * mi + ri * ni + Si * Ii, Z[15] = yi * q + Li * oi + ri * Gi + Si * xi, Z;
      }
      function I(Z, V, g) {
        var f = g[0], w = g[1], B = g[2], q, si, bi, mi, oi, Zi, ci, ni, Gi, hi, Wi, Ii;
        return V === Z ? (Z[12] = V[0] * f + V[4] * w + V[8] * B + V[12], Z[13] = V[1] * f + V[5] * w + V[9] * B + V[13], Z[14] = V[2] * f + V[6] * w + V[10] * B + V[14], Z[15] = V[3] * f + V[7] * w + V[11] * B + V[15]) : (q = V[0], si = V[1], bi = V[2], mi = V[3], oi = V[4], Zi = V[5], ci = V[6], ni = V[7], Gi = V[8], hi = V[9], Wi = V[10], Ii = V[11], Z[0] = q, Z[1] = si, Z[2] = bi, Z[3] = mi, Z[4] = oi, Z[5] = Zi, Z[6] = ci, Z[7] = ni, Z[8] = Gi, Z[9] = hi, Z[10] = Wi, Z[11] = Ii, Z[12] = q * f + oi * w + Gi * B + V[12], Z[13] = si * f + Zi * w + hi * B + V[13], Z[14] = bi * f + ci * w + Wi * B + V[14], Z[15] = mi * f + ni * w + Ii * B + V[15]), Z;
      }
      function o(Z, V, g) {
        var f = g[0], w = g[1], B = g[2];
        return Z[0] = V[0] * f, Z[1] = V[1] * f, Z[2] = V[2] * f, Z[3] = V[3] * f, Z[4] = V[4] * w, Z[5] = V[5] * w, Z[6] = V[6] * w, Z[7] = V[7] * w, Z[8] = V[8] * B, Z[9] = V[9] * B, Z[10] = V[10] * B, Z[11] = V[11] * B, Z[12] = V[12], Z[13] = V[13], Z[14] = V[14], Z[15] = V[15], Z;
      }
      function G(Z, V, g, f) {
        var w = f[0], B = f[1], q = f[2], si = Math.hypot(w, B, q), bi, mi, oi, Zi, ci, ni, Gi, hi, Wi, Ii, xi, yi, Li, ri, Si, wi, Mi, Qi, ki, Pi, fi, ji, Ji, _i;
        return si < c.EPSILON ? null : (si = 1 / si, w *= si, B *= si, q *= si, bi = Math.sin(g), mi = Math.cos(g), oi = 1 - mi, Zi = V[0], ci = V[1], ni = V[2], Gi = V[3], hi = V[4], Wi = V[5], Ii = V[6], xi = V[7], yi = V[8], Li = V[9], ri = V[10], Si = V[11], wi = w * w * oi + mi, Mi = B * w * oi + q * bi, Qi = q * w * oi - B * bi, ki = w * B * oi - q * bi, Pi = B * B * oi + mi, fi = q * B * oi + w * bi, ji = w * q * oi + B * bi, Ji = B * q * oi - w * bi, _i = q * q * oi + mi, Z[0] = Zi * wi + hi * Mi + yi * Qi, Z[1] = ci * wi + Wi * Mi + Li * Qi, Z[2] = ni * wi + Ii * Mi + ri * Qi, Z[3] = Gi * wi + xi * Mi + Si * Qi, Z[4] = Zi * ki + hi * Pi + yi * fi, Z[5] = ci * ki + Wi * Pi + Li * fi, Z[6] = ni * ki + Ii * Pi + ri * fi, Z[7] = Gi * ki + xi * Pi + Si * fi, Z[8] = Zi * ji + hi * Ji + yi * _i, Z[9] = ci * ji + Wi * Ji + Li * _i, Z[10] = ni * ji + Ii * Ji + ri * _i, Z[11] = Gi * ji + xi * Ji + Si * _i, V !== Z && (Z[12] = V[12], Z[13] = V[13], Z[14] = V[14], Z[15] = V[15]), Z);
      }
      function d(Z, V, g) {
        var f = Math.sin(g), w = Math.cos(g), B = V[4], q = V[5], si = V[6], bi = V[7], mi = V[8], oi = V[9], Zi = V[10], ci = V[11];
        return V !== Z && (Z[0] = V[0], Z[1] = V[1], Z[2] = V[2], Z[3] = V[3], Z[12] = V[12], Z[13] = V[13], Z[14] = V[14], Z[15] = V[15]), Z[4] = B * w + mi * f, Z[5] = q * w + oi * f, Z[6] = si * w + Zi * f, Z[7] = bi * w + ci * f, Z[8] = mi * w - B * f, Z[9] = oi * w - q * f, Z[10] = Zi * w - si * f, Z[11] = ci * w - bi * f, Z;
      }
      function t(Z, V, g) {
        var f = Math.sin(g), w = Math.cos(g), B = V[0], q = V[1], si = V[2], bi = V[3], mi = V[8], oi = V[9], Zi = V[10], ci = V[11];
        return V !== Z && (Z[4] = V[4], Z[5] = V[5], Z[6] = V[6], Z[7] = V[7], Z[12] = V[12], Z[13] = V[13], Z[14] = V[14], Z[15] = V[15]), Z[0] = B * w - mi * f, Z[1] = q * w - oi * f, Z[2] = si * w - Zi * f, Z[3] = bi * w - ci * f, Z[8] = B * f + mi * w, Z[9] = q * f + oi * w, Z[10] = si * f + Zi * w, Z[11] = bi * f + ci * w, Z;
      }
      function s(Z, V, g) {
        var f = Math.sin(g), w = Math.cos(g), B = V[0], q = V[1], si = V[2], bi = V[3], mi = V[4], oi = V[5], Zi = V[6], ci = V[7];
        return V !== Z && (Z[8] = V[8], Z[9] = V[9], Z[10] = V[10], Z[11] = V[11], Z[12] = V[12], Z[13] = V[13], Z[14] = V[14], Z[15] = V[15]), Z[0] = B * w + mi * f, Z[1] = q * w + oi * f, Z[2] = si * w + Zi * f, Z[3] = bi * w + ci * f, Z[4] = mi * w - B * f, Z[5] = oi * w - q * f, Z[6] = Zi * w - si * f, Z[7] = ci * w - bi * f, Z;
      }
      function b(Z, V) {
        return Z[0] = 1, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = 1, Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[10] = 1, Z[11] = 0, Z[12] = V[0], Z[13] = V[1], Z[14] = V[2], Z[15] = 1, Z;
      }
      function h(Z, V) {
        return Z[0] = V[0], Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = V[1], Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[10] = V[2], Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z;
      }
      function S(Z, V, g) {
        var f = g[0], w = g[1], B = g[2], q = Math.hypot(f, w, B), si, bi, mi;
        return q < c.EPSILON ? null : (q = 1 / q, f *= q, w *= q, B *= q, si = Math.sin(V), bi = Math.cos(V), mi = 1 - bi, Z[0] = f * f * mi + bi, Z[1] = w * f * mi + B * si, Z[2] = B * f * mi - w * si, Z[3] = 0, Z[4] = f * w * mi - B * si, Z[5] = w * w * mi + bi, Z[6] = B * w * mi + f * si, Z[7] = 0, Z[8] = f * B * mi + w * si, Z[9] = w * B * mi - f * si, Z[10] = B * B * mi + bi, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z);
      }
      function Y(Z, V) {
        var g = Math.sin(V), f = Math.cos(V);
        return Z[0] = 1, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = f, Z[6] = g, Z[7] = 0, Z[8] = 0, Z[9] = -g, Z[10] = f, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z;
      }
      function T(Z, V) {
        var g = Math.sin(V), f = Math.cos(V);
        return Z[0] = f, Z[1] = 0, Z[2] = -g, Z[3] = 0, Z[4] = 0, Z[5] = 1, Z[6] = 0, Z[7] = 0, Z[8] = g, Z[9] = 0, Z[10] = f, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z;
      }
      function y(Z, V) {
        var g = Math.sin(V), f = Math.cos(V);
        return Z[0] = f, Z[1] = g, Z[2] = 0, Z[3] = 0, Z[4] = -g, Z[5] = f, Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[10] = 1, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z;
      }
      function J(Z, V, g) {
        var f = V[0], w = V[1], B = V[2], q = V[3], si = f + f, bi = w + w, mi = B + B, oi = f * si, Zi = f * bi, ci = f * mi, ni = w * bi, Gi = w * mi, hi = B * mi, Wi = q * si, Ii = q * bi, xi = q * mi;
        return Z[0] = 1 - (ni + hi), Z[1] = Zi + xi, Z[2] = ci - Ii, Z[3] = 0, Z[4] = Zi - xi, Z[5] = 1 - (oi + hi), Z[6] = Gi + Wi, Z[7] = 0, Z[8] = ci + Ii, Z[9] = Gi - Wi, Z[10] = 1 - (oi + ni), Z[11] = 0, Z[12] = g[0], Z[13] = g[1], Z[14] = g[2], Z[15] = 1, Z;
      }
      function N(Z, V) {
        var g = new c.ARRAY_TYPE(3), f = -V[0], w = -V[1], B = -V[2], q = V[3], si = V[4], bi = V[5], mi = V[6], oi = V[7], Zi = f * f + w * w + B * B + q * q;
        return Zi > 0 ? (g[0] = (si * q + oi * f + bi * B - mi * w) * 2 / Zi, g[1] = (bi * q + oi * w + mi * f - si * B) * 2 / Zi, g[2] = (mi * q + oi * B + si * w - bi * f) * 2 / Zi) : (g[0] = (si * q + oi * f + bi * B - mi * w) * 2, g[1] = (bi * q + oi * w + mi * f - si * B) * 2, g[2] = (mi * q + oi * B + si * w - bi * f) * 2), J(Z, V, g), Z;
      }
      function x(Z, V) {
        return Z[0] = V[12], Z[1] = V[13], Z[2] = V[14], Z;
      }
      function R(Z, V) {
        var g = V[0], f = V[1], w = V[2], B = V[4], q = V[5], si = V[6], bi = V[8], mi = V[9], oi = V[10];
        return Z[0] = Math.hypot(g, f, w), Z[1] = Math.hypot(B, q, si), Z[2] = Math.hypot(bi, mi, oi), Z;
      }
      function z(Z, V) {
        var g = new c.ARRAY_TYPE(3);
        R(g, V);
        var f = 1 / g[0], w = 1 / g[1], B = 1 / g[2], q = V[0] * f, si = V[1] * w, bi = V[2] * B, mi = V[4] * f, oi = V[5] * w, Zi = V[6] * B, ci = V[8] * f, ni = V[9] * w, Gi = V[10] * B, hi = q + oi + Gi, Wi = 0;
        return hi > 0 ? (Wi = Math.sqrt(hi + 1) * 2, Z[3] = 0.25 * Wi, Z[0] = (Zi - ni) / Wi, Z[1] = (ci - bi) / Wi, Z[2] = (si - mi) / Wi) : q > oi && q > Gi ? (Wi = Math.sqrt(1 + q - oi - Gi) * 2, Z[3] = (Zi - ni) / Wi, Z[0] = 0.25 * Wi, Z[1] = (si + mi) / Wi, Z[2] = (ci + bi) / Wi) : oi > Gi ? (Wi = Math.sqrt(1 + oi - q - Gi) * 2, Z[3] = (ci - bi) / Wi, Z[0] = (si + mi) / Wi, Z[1] = 0.25 * Wi, Z[2] = (Zi + ni) / Wi) : (Wi = Math.sqrt(1 + Gi - q - oi) * 2, Z[3] = (si - mi) / Wi, Z[0] = (ci + bi) / Wi, Z[1] = (Zi + ni) / Wi, Z[2] = 0.25 * Wi), Z;
      }
      function Q(Z, V, g, f) {
        var w = V[0], B = V[1], q = V[2], si = V[3], bi = w + w, mi = B + B, oi = q + q, Zi = w * bi, ci = w * mi, ni = w * oi, Gi = B * mi, hi = B * oi, Wi = q * oi, Ii = si * bi, xi = si * mi, yi = si * oi, Li = f[0], ri = f[1], Si = f[2];
        return Z[0] = (1 - (Gi + Wi)) * Li, Z[1] = (ci + yi) * Li, Z[2] = (ni - xi) * Li, Z[3] = 0, Z[4] = (ci - yi) * ri, Z[5] = (1 - (Zi + Wi)) * ri, Z[6] = (hi + Ii) * ri, Z[7] = 0, Z[8] = (ni + xi) * Si, Z[9] = (hi - Ii) * Si, Z[10] = (1 - (Zi + Gi)) * Si, Z[11] = 0, Z[12] = g[0], Z[13] = g[1], Z[14] = g[2], Z[15] = 1, Z;
      }
      function P(Z, V, g, f, w) {
        var B = V[0], q = V[1], si = V[2], bi = V[3], mi = B + B, oi = q + q, Zi = si + si, ci = B * mi, ni = B * oi, Gi = B * Zi, hi = q * oi, Wi = q * Zi, Ii = si * Zi, xi = bi * mi, yi = bi * oi, Li = bi * Zi, ri = f[0], Si = f[1], wi = f[2], Mi = w[0], Qi = w[1], ki = w[2], Pi = (1 - (hi + Ii)) * ri, fi = (ni + Li) * ri, ji = (Gi - yi) * ri, Ji = (ni - Li) * Si, _i = (1 - (ci + Ii)) * Si, ml = (Wi + xi) * Si, nl = (Gi + yi) * wi, Hl = (Wi - xi) * wi, bl = (1 - (ci + hi)) * wi;
        return Z[0] = Pi, Z[1] = fi, Z[2] = ji, Z[3] = 0, Z[4] = Ji, Z[5] = _i, Z[6] = ml, Z[7] = 0, Z[8] = nl, Z[9] = Hl, Z[10] = bl, Z[11] = 0, Z[12] = g[0] + Mi - (Pi * Mi + Ji * Qi + nl * ki), Z[13] = g[1] + Qi - (fi * Mi + _i * Qi + Hl * ki), Z[14] = g[2] + ki - (ji * Mi + ml * Qi + bl * ki), Z[15] = 1, Z;
      }
      function D(Z, V) {
        var g = V[0], f = V[1], w = V[2], B = V[3], q = g + g, si = f + f, bi = w + w, mi = g * q, oi = f * q, Zi = f * si, ci = w * q, ni = w * si, Gi = w * bi, hi = B * q, Wi = B * si, Ii = B * bi;
        return Z[0] = 1 - Zi - Gi, Z[1] = oi + Ii, Z[2] = ci - Wi, Z[3] = 0, Z[4] = oi - Ii, Z[5] = 1 - mi - Gi, Z[6] = ni + hi, Z[7] = 0, Z[8] = ci + Wi, Z[9] = ni - hi, Z[10] = 1 - mi - Zi, Z[11] = 0, Z[12] = 0, Z[13] = 0, Z[14] = 0, Z[15] = 1, Z;
      }
      function _(Z, V, g, f, w, B, q) {
        var si = 1 / (g - V), bi = 1 / (w - f), mi = 1 / (B - q);
        return Z[0] = B * 2 * si, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = B * 2 * bi, Z[6] = 0, Z[7] = 0, Z[8] = (g + V) * si, Z[9] = (w + f) * bi, Z[10] = (q + B) * mi, Z[11] = -1, Z[12] = 0, Z[13] = 0, Z[14] = q * B * 2 * mi, Z[15] = 0, Z;
      }
      function F(Z, V, g, f, w) {
        var B = 1 / Math.tan(V / 2), q;
        return Z[0] = B / g, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = B, Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[11] = -1, Z[12] = 0, Z[13] = 0, Z[15] = 0, w != null && w !== 1 / 0 ? (q = 1 / (f - w), Z[10] = (w + f) * q, Z[14] = 2 * w * f * q) : (Z[10] = -1, Z[14] = -2 * f), Z;
      }
      function v(Z, V, g, f) {
        var w = Math.tan(V.upDegrees * Math.PI / 180), B = Math.tan(V.downDegrees * Math.PI / 180), q = Math.tan(V.leftDegrees * Math.PI / 180), si = Math.tan(V.rightDegrees * Math.PI / 180), bi = 2 / (q + si), mi = 2 / (w + B);
        return Z[0] = bi, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = mi, Z[6] = 0, Z[7] = 0, Z[8] = -((q - si) * bi * 0.5), Z[9] = (w - B) * mi * 0.5, Z[10] = f / (g - f), Z[11] = -1, Z[12] = 0, Z[13] = 0, Z[14] = f * g / (g - f), Z[15] = 0, Z;
      }
      function O(Z, V, g, f, w, B, q) {
        var si = 1 / (V - g), bi = 1 / (f - w), mi = 1 / (B - q);
        return Z[0] = -2 * si, Z[1] = 0, Z[2] = 0, Z[3] = 0, Z[4] = 0, Z[5] = -2 * bi, Z[6] = 0, Z[7] = 0, Z[8] = 0, Z[9] = 0, Z[10] = 2 * mi, Z[11] = 0, Z[12] = (V + g) * si, Z[13] = (w + f) * bi, Z[14] = (q + B) * mi, Z[15] = 1, Z;
      }
      function li(Z, V, g, f) {
        var w, B, q, si, bi, mi, oi, Zi, ci, ni, Gi = V[0], hi = V[1], Wi = V[2], Ii = f[0], xi = f[1], yi = f[2], Li = g[0], ri = g[1], Si = g[2];
        return Math.abs(Gi - Li) < c.EPSILON && Math.abs(hi - ri) < c.EPSILON && Math.abs(Wi - Si) < c.EPSILON ? e(Z) : (oi = Gi - Li, Zi = hi - ri, ci = Wi - Si, ni = 1 / Math.hypot(oi, Zi, ci), oi *= ni, Zi *= ni, ci *= ni, w = xi * ci - yi * Zi, B = yi * oi - Ii * ci, q = Ii * Zi - xi * oi, ni = Math.hypot(w, B, q), ni ? (ni = 1 / ni, w *= ni, B *= ni, q *= ni) : (w = 0, B = 0, q = 0), si = Zi * q - ci * B, bi = ci * w - oi * q, mi = oi * B - Zi * w, ni = Math.hypot(si, bi, mi), ni ? (ni = 1 / ni, si *= ni, bi *= ni, mi *= ni) : (si = 0, bi = 0, mi = 0), Z[0] = w, Z[1] = si, Z[2] = oi, Z[3] = 0, Z[4] = B, Z[5] = bi, Z[6] = Zi, Z[7] = 0, Z[8] = q, Z[9] = mi, Z[10] = ci, Z[11] = 0, Z[12] = -(w * Gi + B * hi + q * Wi), Z[13] = -(si * Gi + bi * hi + mi * Wi), Z[14] = -(oi * Gi + Zi * hi + ci * Wi), Z[15] = 1, Z);
      }
      function ii(Z, V, g, f) {
        var w = V[0], B = V[1], q = V[2], si = f[0], bi = f[1], mi = f[2], oi = w - g[0], Zi = B - g[1], ci = q - g[2], ni = oi * oi + Zi * Zi + ci * ci;
        ni > 0 && (ni = 1 / Math.sqrt(ni), oi *= ni, Zi *= ni, ci *= ni);
        var Gi = bi * ci - mi * Zi, hi = mi * oi - si * ci, Wi = si * Zi - bi * oi;
        return ni = Gi * Gi + hi * hi + Wi * Wi, ni > 0 && (ni = 1 / Math.sqrt(ni), Gi *= ni, hi *= ni, Wi *= ni), Z[0] = Gi, Z[1] = hi, Z[2] = Wi, Z[3] = 0, Z[4] = Zi * Wi - ci * hi, Z[5] = ci * Gi - oi * Wi, Z[6] = oi * hi - Zi * Gi, Z[7] = 0, Z[8] = oi, Z[9] = Zi, Z[10] = ci, Z[11] = 0, Z[12] = w, Z[13] = B, Z[14] = q, Z[15] = 1, Z;
      }
      function ti(Z) {
        return "mat4(" + Z[0] + ", " + Z[1] + ", " + Z[2] + ", " + Z[3] + ", " + Z[4] + ", " + Z[5] + ", " + Z[6] + ", " + Z[7] + ", " + Z[8] + ", " + Z[9] + ", " + Z[10] + ", " + Z[11] + ", " + Z[12] + ", " + Z[13] + ", " + Z[14] + ", " + Z[15] + ")";
      }
      function $(Z) {
        return Math.hypot(Z[0], Z[1], Z[2], Z[3], Z[4], Z[5], Z[6], Z[7], Z[8], Z[9], Z[10], Z[11], Z[12], Z[13], Z[14], Z[15]);
      }
      function ai(Z, V, g) {
        return Z[0] = V[0] + g[0], Z[1] = V[1] + g[1], Z[2] = V[2] + g[2], Z[3] = V[3] + g[3], Z[4] = V[4] + g[4], Z[5] = V[5] + g[5], Z[6] = V[6] + g[6], Z[7] = V[7] + g[7], Z[8] = V[8] + g[8], Z[9] = V[9] + g[9], Z[10] = V[10] + g[10], Z[11] = V[11] + g[11], Z[12] = V[12] + g[12], Z[13] = V[13] + g[13], Z[14] = V[14] + g[14], Z[15] = V[15] + g[15], Z;
      }
      function Xi(Z, V, g) {
        return Z[0] = V[0] - g[0], Z[1] = V[1] - g[1], Z[2] = V[2] - g[2], Z[3] = V[3] - g[3], Z[4] = V[4] - g[4], Z[5] = V[5] - g[5], Z[6] = V[6] - g[6], Z[7] = V[7] - g[7], Z[8] = V[8] - g[8], Z[9] = V[9] - g[9], Z[10] = V[10] - g[10], Z[11] = V[11] - g[11], Z[12] = V[12] - g[12], Z[13] = V[13] - g[13], Z[14] = V[14] - g[14], Z[15] = V[15] - g[15], Z;
      }
      function M(Z, V, g) {
        return Z[0] = V[0] * g, Z[1] = V[1] * g, Z[2] = V[2] * g, Z[3] = V[3] * g, Z[4] = V[4] * g, Z[5] = V[5] * g, Z[6] = V[6] * g, Z[7] = V[7] * g, Z[8] = V[8] * g, Z[9] = V[9] * g, Z[10] = V[10] * g, Z[11] = V[11] * g, Z[12] = V[12] * g, Z[13] = V[13] * g, Z[14] = V[14] * g, Z[15] = V[15] * g, Z;
      }
      function k(Z, V, g, f) {
        return Z[0] = V[0] + g[0] * f, Z[1] = V[1] + g[1] * f, Z[2] = V[2] + g[2] * f, Z[3] = V[3] + g[3] * f, Z[4] = V[4] + g[4] * f, Z[5] = V[5] + g[5] * f, Z[6] = V[6] + g[6] * f, Z[7] = V[7] + g[7] * f, Z[8] = V[8] + g[8] * f, Z[9] = V[9] + g[9] * f, Z[10] = V[10] + g[10] * f, Z[11] = V[11] + g[11] * f, Z[12] = V[12] + g[12] * f, Z[13] = V[13] + g[13] * f, Z[14] = V[14] + g[14] * f, Z[15] = V[15] + g[15] * f, Z;
      }
      function j(Z, V) {
        return Z[0] === V[0] && Z[1] === V[1] && Z[2] === V[2] && Z[3] === V[3] && Z[4] === V[4] && Z[5] === V[5] && Z[6] === V[6] && Z[7] === V[7] && Z[8] === V[8] && Z[9] === V[9] && Z[10] === V[10] && Z[11] === V[11] && Z[12] === V[12] && Z[13] === V[13] && Z[14] === V[14] && Z[15] === V[15];
      }
      function A(Z, V) {
        var g = Z[0], f = Z[1], w = Z[2], B = Z[3], q = Z[4], si = Z[5], bi = Z[6], mi = Z[7], oi = Z[8], Zi = Z[9], ci = Z[10], ni = Z[11], Gi = Z[12], hi = Z[13], Wi = Z[14], Ii = Z[15], xi = V[0], yi = V[1], Li = V[2], ri = V[3], Si = V[4], wi = V[5], Mi = V[6], Qi = V[7], ki = V[8], Pi = V[9], fi = V[10], ji = V[11], Ji = V[12], _i = V[13], ml = V[14], nl = V[15];
        return Math.abs(g - xi) <= c.EPSILON * Math.max(1, Math.abs(g), Math.abs(xi)) && Math.abs(f - yi) <= c.EPSILON * Math.max(1, Math.abs(f), Math.abs(yi)) && Math.abs(w - Li) <= c.EPSILON * Math.max(1, Math.abs(w), Math.abs(Li)) && Math.abs(B - ri) <= c.EPSILON * Math.max(1, Math.abs(B), Math.abs(ri)) && Math.abs(q - Si) <= c.EPSILON * Math.max(1, Math.abs(q), Math.abs(Si)) && Math.abs(si - wi) <= c.EPSILON * Math.max(1, Math.abs(si), Math.abs(wi)) && Math.abs(bi - Mi) <= c.EPSILON * Math.max(1, Math.abs(bi), Math.abs(Mi)) && Math.abs(mi - Qi) <= c.EPSILON * Math.max(1, Math.abs(mi), Math.abs(Qi)) && Math.abs(oi - ki) <= c.EPSILON * Math.max(1, Math.abs(oi), Math.abs(ki)) && Math.abs(Zi - Pi) <= c.EPSILON * Math.max(1, Math.abs(Zi), Math.abs(Pi)) && Math.abs(ci - fi) <= c.EPSILON * Math.max(1, Math.abs(ci), Math.abs(fi)) && Math.abs(ni - ji) <= c.EPSILON * Math.max(1, Math.abs(ni), Math.abs(ji)) && Math.abs(Gi - Ji) <= c.EPSILON * Math.max(1, Math.abs(Gi), Math.abs(Ji)) && Math.abs(hi - _i) <= c.EPSILON * Math.max(1, Math.abs(hi), Math.abs(_i)) && Math.abs(Wi - ml) <= c.EPSILON * Math.max(1, Math.abs(Wi), Math.abs(ml)) && Math.abs(Ii - nl) <= c.EPSILON * Math.max(1, Math.abs(Ii), Math.abs(nl));
      }
      var H = C, U = Xi;
    },
    /* 7 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return u;
      }), i.d(l, "identity", function() {
        return a;
      }), i.d(l, "setAxisAngle", function() {
        return e;
      }), i.d(l, "getAxisAngle", function() {
        return r;
      }), i.d(l, "getAngle", function() {
        return X;
      }), i.d(l, "multiply", function() {
        return W;
      }), i.d(l, "rotateX", function() {
        return p;
      }), i.d(l, "rotateY", function() {
        return C;
      }), i.d(l, "rotateZ", function() {
        return I;
      }), i.d(l, "calculateW", function() {
        return o;
      }), i.d(l, "exp", function() {
        return G;
      }), i.d(l, "ln", function() {
        return d;
      }), i.d(l, "pow", function() {
        return t;
      }), i.d(l, "slerp", function() {
        return s;
      }), i.d(l, "random", function() {
        return b;
      }), i.d(l, "invert", function() {
        return h;
      }), i.d(l, "conjugate", function() {
        return S;
      }), i.d(l, "fromMat3", function() {
        return Y;
      }), i.d(l, "fromEuler", function() {
        return T;
      }), i.d(l, "str", function() {
        return y;
      }), i.d(l, "clone", function() {
        return J;
      }), i.d(l, "fromValues", function() {
        return N;
      }), i.d(l, "copy", function() {
        return x;
      }), i.d(l, "set", function() {
        return R;
      }), i.d(l, "add", function() {
        return z;
      }), i.d(l, "mul", function() {
        return Q;
      }), i.d(l, "scale", function() {
        return P;
      }), i.d(l, "dot", function() {
        return D;
      }), i.d(l, "lerp", function() {
        return _;
      }), i.d(l, "length", function() {
        return F;
      }), i.d(l, "len", function() {
        return v;
      }), i.d(l, "squaredLength", function() {
        return O;
      }), i.d(l, "sqrLen", function() {
        return li;
      }), i.d(l, "normalize", function() {
        return ii;
      }), i.d(l, "exactEquals", function() {
        return ti;
      }), i.d(l, "equals", function() {
        return $;
      }), i.d(l, "rotationTo", function() {
        return ai;
      }), i.d(l, "sqlerp", function() {
        return Xi;
      }), i.d(l, "setAxes", function() {
        return M;
      });
      var c = i(2), m = i(5), L = i(8), K = i(9);
      function u() {
        var k = new c.ARRAY_TYPE(4);
        return c.ARRAY_TYPE != Float32Array && (k[0] = 0, k[1] = 0, k[2] = 0), k[3] = 1, k;
      }
      function a(k) {
        return k[0] = 0, k[1] = 0, k[2] = 0, k[3] = 1, k;
      }
      function e(k, j, A) {
        A = A * 0.5;
        var H = Math.sin(A);
        return k[0] = H * j[0], k[1] = H * j[1], k[2] = H * j[2], k[3] = Math.cos(A), k;
      }
      function r(k, j) {
        var A = Math.acos(j[3]) * 2, H = Math.sin(A / 2);
        return H > c.EPSILON ? (k[0] = j[0] / H, k[1] = j[1] / H, k[2] = j[2] / H) : (k[0] = 1, k[1] = 0, k[2] = 0), A;
      }
      function X(k, j) {
        var A = D(k, j);
        return Math.acos(2 * A * A - 1);
      }
      function W(k, j, A) {
        var H = j[0], U = j[1], Z = j[2], V = j[3], g = A[0], f = A[1], w = A[2], B = A[3];
        return k[0] = H * B + V * g + U * w - Z * f, k[1] = U * B + V * f + Z * g - H * w, k[2] = Z * B + V * w + H * f - U * g, k[3] = V * B - H * g - U * f - Z * w, k;
      }
      function p(k, j, A) {
        A *= 0.5;
        var H = j[0], U = j[1], Z = j[2], V = j[3], g = Math.sin(A), f = Math.cos(A);
        return k[0] = H * f + V * g, k[1] = U * f + Z * g, k[2] = Z * f - U * g, k[3] = V * f - H * g, k;
      }
      function C(k, j, A) {
        A *= 0.5;
        var H = j[0], U = j[1], Z = j[2], V = j[3], g = Math.sin(A), f = Math.cos(A);
        return k[0] = H * f - Z * g, k[1] = U * f + V * g, k[2] = Z * f + H * g, k[3] = V * f - U * g, k;
      }
      function I(k, j, A) {
        A *= 0.5;
        var H = j[0], U = j[1], Z = j[2], V = j[3], g = Math.sin(A), f = Math.cos(A);
        return k[0] = H * f + U * g, k[1] = U * f - H * g, k[2] = Z * f + V * g, k[3] = V * f - Z * g, k;
      }
      function o(k, j) {
        var A = j[0], H = j[1], U = j[2];
        return k[0] = A, k[1] = H, k[2] = U, k[3] = Math.sqrt(Math.abs(1 - A * A - H * H - U * U)), k;
      }
      function G(k, j) {
        var A = j[0], H = j[1], U = j[2], Z = j[3], V = Math.sqrt(A * A + H * H + U * U), g = Math.exp(Z), f = V > 0 ? g * Math.sin(V) / V : 0;
        return k[0] = A * f, k[1] = H * f, k[2] = U * f, k[3] = g * Math.cos(V), k;
      }
      function d(k, j) {
        var A = j[0], H = j[1], U = j[2], Z = j[3], V = Math.sqrt(A * A + H * H + U * U), g = V > 0 ? Math.atan2(V, Z) / V : 0;
        return k[0] = A * g, k[1] = H * g, k[2] = U * g, k[3] = 0.5 * Math.log(A * A + H * H + U * U + Z * Z), k;
      }
      function t(k, j, A) {
        return d(k, j), P(k, k, A), G(k, k), k;
      }
      function s(k, j, A, H) {
        var U = j[0], Z = j[1], V = j[2], g = j[3], f = A[0], w = A[1], B = A[2], q = A[3], si, bi, mi, oi, Zi;
        return bi = U * f + Z * w + V * B + g * q, bi < 0 && (bi = -bi, f = -f, w = -w, B = -B, q = -q), 1 - bi > c.EPSILON ? (si = Math.acos(bi), mi = Math.sin(si), oi = Math.sin((1 - H) * si) / mi, Zi = Math.sin(H * si) / mi) : (oi = 1 - H, Zi = H), k[0] = oi * U + Zi * f, k[1] = oi * Z + Zi * w, k[2] = oi * V + Zi * B, k[3] = oi * g + Zi * q, k;
      }
      function b(k) {
        var j = c.RANDOM(), A = c.RANDOM(), H = c.RANDOM(), U = Math.sqrt(1 - j), Z = Math.sqrt(j);
        return k[0] = U * Math.sin(2 * Math.PI * A), k[1] = U * Math.cos(2 * Math.PI * A), k[2] = Z * Math.sin(2 * Math.PI * H), k[3] = Z * Math.cos(2 * Math.PI * H), k;
      }
      function h(k, j) {
        var A = j[0], H = j[1], U = j[2], Z = j[3], V = A * A + H * H + U * U + Z * Z, g = V ? 1 / V : 0;
        return k[0] = -A * g, k[1] = -H * g, k[2] = -U * g, k[3] = Z * g, k;
      }
      function S(k, j) {
        return k[0] = -j[0], k[1] = -j[1], k[2] = -j[2], k[3] = j[3], k;
      }
      function Y(k, j) {
        var A = j[0] + j[4] + j[8], H;
        if (A > 0)
          H = Math.sqrt(A + 1), k[3] = 0.5 * H, H = 0.5 / H, k[0] = (j[5] - j[7]) * H, k[1] = (j[6] - j[2]) * H, k[2] = (j[1] - j[3]) * H;
        else {
          var U = 0;
          j[4] > j[0] && (U = 1), j[8] > j[U * 3 + U] && (U = 2);
          var Z = (U + 1) % 3, V = (U + 2) % 3;
          H = Math.sqrt(j[U * 3 + U] - j[Z * 3 + Z] - j[V * 3 + V] + 1), k[U] = 0.5 * H, H = 0.5 / H, k[3] = (j[Z * 3 + V] - j[V * 3 + Z]) * H, k[Z] = (j[Z * 3 + U] + j[U * 3 + Z]) * H, k[V] = (j[V * 3 + U] + j[U * 3 + V]) * H;
        }
        return k;
      }
      function T(k, j, A, H) {
        var U = 0.5 * Math.PI / 180;
        j *= U, A *= U, H *= U;
        var Z = Math.sin(j), V = Math.cos(j), g = Math.sin(A), f = Math.cos(A), w = Math.sin(H), B = Math.cos(H);
        return k[0] = Z * f * B - V * g * w, k[1] = V * g * B + Z * f * w, k[2] = V * f * w - Z * g * B, k[3] = V * f * B + Z * g * w, k;
      }
      function y(k) {
        return "quat(" + k[0] + ", " + k[1] + ", " + k[2] + ", " + k[3] + ")";
      }
      var J = K.clone, N = K.fromValues, x = K.copy, R = K.set, z = K.add, Q = W, P = K.scale, D = K.dot, _ = K.lerp, F = K.length, v = F, O = K.squaredLength, li = O, ii = K.normalize, ti = K.exactEquals, $ = K.equals, ai = function() {
        var k = L.create(), j = L.fromValues(1, 0, 0), A = L.fromValues(0, 1, 0);
        return function(H, U, Z) {
          var V = L.dot(U, Z);
          return V < -0.999999 ? (L.cross(k, j, U), L.len(k) < 1e-6 && L.cross(k, A, U), L.normalize(k, k), e(H, k, Math.PI), H) : V > 0.999999 ? (H[0] = 0, H[1] = 0, H[2] = 0, H[3] = 1, H) : (L.cross(k, U, Z), H[0] = k[0], H[1] = k[1], H[2] = k[2], H[3] = 1 + V, ii(H, H));
        };
      }(), Xi = function() {
        var k = u(), j = u();
        return function(A, H, U, Z, V, g) {
          return s(k, H, V, g), s(j, U, Z, g), s(A, k, j, 2 * g * (1 - g)), A;
        };
      }(), M = function() {
        var k = m.create();
        return function(j, A, H, U) {
          return k[0] = H[0], k[3] = H[1], k[6] = H[2], k[1] = U[0], k[4] = U[1], k[7] = U[2], k[2] = -A[0], k[5] = -A[1], k[8] = -A[2], ii(j, Y(j, k));
        };
      }();
    },
    /* 8 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "clone", function() {
        return L;
      }), i.d(l, "length", function() {
        return K;
      }), i.d(l, "fromValues", function() {
        return u;
      }), i.d(l, "copy", function() {
        return a;
      }), i.d(l, "set", function() {
        return e;
      }), i.d(l, "add", function() {
        return r;
      }), i.d(l, "subtract", function() {
        return X;
      }), i.d(l, "multiply", function() {
        return W;
      }), i.d(l, "divide", function() {
        return p;
      }), i.d(l, "ceil", function() {
        return C;
      }), i.d(l, "floor", function() {
        return I;
      }), i.d(l, "min", function() {
        return o;
      }), i.d(l, "max", function() {
        return G;
      }), i.d(l, "round", function() {
        return d;
      }), i.d(l, "scale", function() {
        return t;
      }), i.d(l, "scaleAndAdd", function() {
        return s;
      }), i.d(l, "distance", function() {
        return b;
      }), i.d(l, "squaredDistance", function() {
        return h;
      }), i.d(l, "squaredLength", function() {
        return S;
      }), i.d(l, "negate", function() {
        return Y;
      }), i.d(l, "inverse", function() {
        return T;
      }), i.d(l, "normalize", function() {
        return y;
      }), i.d(l, "dot", function() {
        return J;
      }), i.d(l, "cross", function() {
        return N;
      }), i.d(l, "lerp", function() {
        return x;
      }), i.d(l, "hermite", function() {
        return R;
      }), i.d(l, "bezier", function() {
        return z;
      }), i.d(l, "random", function() {
        return Q;
      }), i.d(l, "transformMat4", function() {
        return P;
      }), i.d(l, "transformMat3", function() {
        return D;
      }), i.d(l, "transformQuat", function() {
        return _;
      }), i.d(l, "rotateX", function() {
        return F;
      }), i.d(l, "rotateY", function() {
        return v;
      }), i.d(l, "rotateZ", function() {
        return O;
      }), i.d(l, "angle", function() {
        return li;
      }), i.d(l, "zero", function() {
        return ii;
      }), i.d(l, "str", function() {
        return ti;
      }), i.d(l, "exactEquals", function() {
        return $;
      }), i.d(l, "equals", function() {
        return ai;
      }), i.d(l, "sub", function() {
        return Xi;
      }), i.d(l, "mul", function() {
        return M;
      }), i.d(l, "div", function() {
        return k;
      }), i.d(l, "dist", function() {
        return j;
      }), i.d(l, "sqrDist", function() {
        return A;
      }), i.d(l, "len", function() {
        return H;
      }), i.d(l, "sqrLen", function() {
        return U;
      }), i.d(l, "forEach", function() {
        return Z;
      });
      var c = i(2);
      function m() {
        var V = new c.ARRAY_TYPE(3);
        return c.ARRAY_TYPE != Float32Array && (V[0] = 0, V[1] = 0, V[2] = 0), V;
      }
      function L(V) {
        var g = new c.ARRAY_TYPE(3);
        return g[0] = V[0], g[1] = V[1], g[2] = V[2], g;
      }
      function K(V) {
        var g = V[0], f = V[1], w = V[2];
        return Math.hypot(g, f, w);
      }
      function u(V, g, f) {
        var w = new c.ARRAY_TYPE(3);
        return w[0] = V, w[1] = g, w[2] = f, w;
      }
      function a(V, g) {
        return V[0] = g[0], V[1] = g[1], V[2] = g[2], V;
      }
      function e(V, g, f, w) {
        return V[0] = g, V[1] = f, V[2] = w, V;
      }
      function r(V, g, f) {
        return V[0] = g[0] + f[0], V[1] = g[1] + f[1], V[2] = g[2] + f[2], V;
      }
      function X(V, g, f) {
        return V[0] = g[0] - f[0], V[1] = g[1] - f[1], V[2] = g[2] - f[2], V;
      }
      function W(V, g, f) {
        return V[0] = g[0] * f[0], V[1] = g[1] * f[1], V[2] = g[2] * f[2], V;
      }
      function p(V, g, f) {
        return V[0] = g[0] / f[0], V[1] = g[1] / f[1], V[2] = g[2] / f[2], V;
      }
      function C(V, g) {
        return V[0] = Math.ceil(g[0]), V[1] = Math.ceil(g[1]), V[2] = Math.ceil(g[2]), V;
      }
      function I(V, g) {
        return V[0] = Math.floor(g[0]), V[1] = Math.floor(g[1]), V[2] = Math.floor(g[2]), V;
      }
      function o(V, g, f) {
        return V[0] = Math.min(g[0], f[0]), V[1] = Math.min(g[1], f[1]), V[2] = Math.min(g[2], f[2]), V;
      }
      function G(V, g, f) {
        return V[0] = Math.max(g[0], f[0]), V[1] = Math.max(g[1], f[1]), V[2] = Math.max(g[2], f[2]), V;
      }
      function d(V, g) {
        return V[0] = Math.round(g[0]), V[1] = Math.round(g[1]), V[2] = Math.round(g[2]), V;
      }
      function t(V, g, f) {
        return V[0] = g[0] * f, V[1] = g[1] * f, V[2] = g[2] * f, V;
      }
      function s(V, g, f, w) {
        return V[0] = g[0] + f[0] * w, V[1] = g[1] + f[1] * w, V[2] = g[2] + f[2] * w, V;
      }
      function b(V, g) {
        var f = g[0] - V[0], w = g[1] - V[1], B = g[2] - V[2];
        return Math.hypot(f, w, B);
      }
      function h(V, g) {
        var f = g[0] - V[0], w = g[1] - V[1], B = g[2] - V[2];
        return f * f + w * w + B * B;
      }
      function S(V) {
        var g = V[0], f = V[1], w = V[2];
        return g * g + f * f + w * w;
      }
      function Y(V, g) {
        return V[0] = -g[0], V[1] = -g[1], V[2] = -g[2], V;
      }
      function T(V, g) {
        return V[0] = 1 / g[0], V[1] = 1 / g[1], V[2] = 1 / g[2], V;
      }
      function y(V, g) {
        var f = g[0], w = g[1], B = g[2], q = f * f + w * w + B * B;
        return q > 0 && (q = 1 / Math.sqrt(q)), V[0] = g[0] * q, V[1] = g[1] * q, V[2] = g[2] * q, V;
      }
      function J(V, g) {
        return V[0] * g[0] + V[1] * g[1] + V[2] * g[2];
      }
      function N(V, g, f) {
        var w = g[0], B = g[1], q = g[2], si = f[0], bi = f[1], mi = f[2];
        return V[0] = B * mi - q * bi, V[1] = q * si - w * mi, V[2] = w * bi - B * si, V;
      }
      function x(V, g, f, w) {
        var B = g[0], q = g[1], si = g[2];
        return V[0] = B + w * (f[0] - B), V[1] = q + w * (f[1] - q), V[2] = si + w * (f[2] - si), V;
      }
      function R(V, g, f, w, B, q) {
        var si = q * q, bi = si * (2 * q - 3) + 1, mi = si * (q - 2) + q, oi = si * (q - 1), Zi = si * (3 - 2 * q);
        return V[0] = g[0] * bi + f[0] * mi + w[0] * oi + B[0] * Zi, V[1] = g[1] * bi + f[1] * mi + w[1] * oi + B[1] * Zi, V[2] = g[2] * bi + f[2] * mi + w[2] * oi + B[2] * Zi, V;
      }
      function z(V, g, f, w, B, q) {
        var si = 1 - q, bi = si * si, mi = q * q, oi = bi * si, Zi = 3 * q * bi, ci = 3 * mi * si, ni = mi * q;
        return V[0] = g[0] * oi + f[0] * Zi + w[0] * ci + B[0] * ni, V[1] = g[1] * oi + f[1] * Zi + w[1] * ci + B[1] * ni, V[2] = g[2] * oi + f[2] * Zi + w[2] * ci + B[2] * ni, V;
      }
      function Q(V, g) {
        g = g || 1;
        var f = c.RANDOM() * 2 * Math.PI, w = c.RANDOM() * 2 - 1, B = Math.sqrt(1 - w * w) * g;
        return V[0] = Math.cos(f) * B, V[1] = Math.sin(f) * B, V[2] = w * g, V;
      }
      function P(V, g, f) {
        var w = g[0], B = g[1], q = g[2], si = f[3] * w + f[7] * B + f[11] * q + f[15];
        return si = si || 1, V[0] = (f[0] * w + f[4] * B + f[8] * q + f[12]) / si, V[1] = (f[1] * w + f[5] * B + f[9] * q + f[13]) / si, V[2] = (f[2] * w + f[6] * B + f[10] * q + f[14]) / si, V;
      }
      function D(V, g, f) {
        var w = g[0], B = g[1], q = g[2];
        return V[0] = w * f[0] + B * f[3] + q * f[6], V[1] = w * f[1] + B * f[4] + q * f[7], V[2] = w * f[2] + B * f[5] + q * f[8], V;
      }
      function _(V, g, f) {
        var w = f[0], B = f[1], q = f[2], si = f[3], bi = g[0], mi = g[1], oi = g[2], Zi = B * oi - q * mi, ci = q * bi - w * oi, ni = w * mi - B * bi, Gi = B * ni - q * ci, hi = q * Zi - w * ni, Wi = w * ci - B * Zi, Ii = si * 2;
        return Zi *= Ii, ci *= Ii, ni *= Ii, Gi *= 2, hi *= 2, Wi *= 2, V[0] = bi + Zi + Gi, V[1] = mi + ci + hi, V[2] = oi + ni + Wi, V;
      }
      function F(V, g, f, w) {
        var B = [], q = [];
        return B[0] = g[0] - f[0], B[1] = g[1] - f[1], B[2] = g[2] - f[2], q[0] = B[0], q[1] = B[1] * Math.cos(w) - B[2] * Math.sin(w), q[2] = B[1] * Math.sin(w) + B[2] * Math.cos(w), V[0] = q[0] + f[0], V[1] = q[1] + f[1], V[2] = q[2] + f[2], V;
      }
      function v(V, g, f, w) {
        var B = [], q = [];
        return B[0] = g[0] - f[0], B[1] = g[1] - f[1], B[2] = g[2] - f[2], q[0] = B[2] * Math.sin(w) + B[0] * Math.cos(w), q[1] = B[1], q[2] = B[2] * Math.cos(w) - B[0] * Math.sin(w), V[0] = q[0] + f[0], V[1] = q[1] + f[1], V[2] = q[2] + f[2], V;
      }
      function O(V, g, f, w) {
        var B = [], q = [];
        return B[0] = g[0] - f[0], B[1] = g[1] - f[1], B[2] = g[2] - f[2], q[0] = B[0] * Math.cos(w) - B[1] * Math.sin(w), q[1] = B[0] * Math.sin(w) + B[1] * Math.cos(w), q[2] = B[2], V[0] = q[0] + f[0], V[1] = q[1] + f[1], V[2] = q[2] + f[2], V;
      }
      function li(V, g) {
        var f = V[0], w = V[1], B = V[2], q = g[0], si = g[1], bi = g[2], mi = Math.sqrt(f * f + w * w + B * B), oi = Math.sqrt(q * q + si * si + bi * bi), Zi = mi * oi, ci = Zi && J(V, g) / Zi;
        return Math.acos(Math.min(Math.max(ci, -1), 1));
      }
      function ii(V) {
        return V[0] = 0, V[1] = 0, V[2] = 0, V;
      }
      function ti(V) {
        return "vec3(" + V[0] + ", " + V[1] + ", " + V[2] + ")";
      }
      function $(V, g) {
        return V[0] === g[0] && V[1] === g[1] && V[2] === g[2];
      }
      function ai(V, g) {
        var f = V[0], w = V[1], B = V[2], q = g[0], si = g[1], bi = g[2];
        return Math.abs(f - q) <= c.EPSILON * Math.max(1, Math.abs(f), Math.abs(q)) && Math.abs(w - si) <= c.EPSILON * Math.max(1, Math.abs(w), Math.abs(si)) && Math.abs(B - bi) <= c.EPSILON * Math.max(1, Math.abs(B), Math.abs(bi));
      }
      var Xi = X, M = W, k = p, j = b, A = h, H = K, U = S, Z = function() {
        var V = m();
        return function(g, f, w, B, q, si) {
          var bi, mi;
          for (f || (f = 3), w || (w = 0), B ? mi = Math.min(B * f + w, g.length) : mi = g.length, bi = w; bi < mi; bi += f)
            V[0] = g[bi], V[1] = g[bi + 1], V[2] = g[bi + 2], q(V, V, si), g[bi] = V[0], g[bi + 1] = V[1], g[bi + 2] = V[2];
          return g;
        };
      }();
    },
    /* 9 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "clone", function() {
        return L;
      }), i.d(l, "fromValues", function() {
        return K;
      }), i.d(l, "copy", function() {
        return u;
      }), i.d(l, "set", function() {
        return a;
      }), i.d(l, "add", function() {
        return e;
      }), i.d(l, "subtract", function() {
        return r;
      }), i.d(l, "multiply", function() {
        return X;
      }), i.d(l, "divide", function() {
        return W;
      }), i.d(l, "ceil", function() {
        return p;
      }), i.d(l, "floor", function() {
        return C;
      }), i.d(l, "min", function() {
        return I;
      }), i.d(l, "max", function() {
        return o;
      }), i.d(l, "round", function() {
        return G;
      }), i.d(l, "scale", function() {
        return d;
      }), i.d(l, "scaleAndAdd", function() {
        return t;
      }), i.d(l, "distance", function() {
        return s;
      }), i.d(l, "squaredDistance", function() {
        return b;
      }), i.d(l, "length", function() {
        return h;
      }), i.d(l, "squaredLength", function() {
        return S;
      }), i.d(l, "negate", function() {
        return Y;
      }), i.d(l, "inverse", function() {
        return T;
      }), i.d(l, "normalize", function() {
        return y;
      }), i.d(l, "dot", function() {
        return J;
      }), i.d(l, "cross", function() {
        return N;
      }), i.d(l, "lerp", function() {
        return x;
      }), i.d(l, "random", function() {
        return R;
      }), i.d(l, "transformMat4", function() {
        return z;
      }), i.d(l, "transformQuat", function() {
        return Q;
      }), i.d(l, "zero", function() {
        return P;
      }), i.d(l, "str", function() {
        return D;
      }), i.d(l, "exactEquals", function() {
        return _;
      }), i.d(l, "equals", function() {
        return F;
      }), i.d(l, "sub", function() {
        return v;
      }), i.d(l, "mul", function() {
        return O;
      }), i.d(l, "div", function() {
        return li;
      }), i.d(l, "dist", function() {
        return ii;
      }), i.d(l, "sqrDist", function() {
        return ti;
      }), i.d(l, "len", function() {
        return $;
      }), i.d(l, "sqrLen", function() {
        return ai;
      }), i.d(l, "forEach", function() {
        return Xi;
      });
      var c = i(2);
      function m() {
        var M = new c.ARRAY_TYPE(4);
        return c.ARRAY_TYPE != Float32Array && (M[0] = 0, M[1] = 0, M[2] = 0, M[3] = 0), M;
      }
      function L(M) {
        var k = new c.ARRAY_TYPE(4);
        return k[0] = M[0], k[1] = M[1], k[2] = M[2], k[3] = M[3], k;
      }
      function K(M, k, j, A) {
        var H = new c.ARRAY_TYPE(4);
        return H[0] = M, H[1] = k, H[2] = j, H[3] = A, H;
      }
      function u(M, k) {
        return M[0] = k[0], M[1] = k[1], M[2] = k[2], M[3] = k[3], M;
      }
      function a(M, k, j, A, H) {
        return M[0] = k, M[1] = j, M[2] = A, M[3] = H, M;
      }
      function e(M, k, j) {
        return M[0] = k[0] + j[0], M[1] = k[1] + j[1], M[2] = k[2] + j[2], M[3] = k[3] + j[3], M;
      }
      function r(M, k, j) {
        return M[0] = k[0] - j[0], M[1] = k[1] - j[1], M[2] = k[2] - j[2], M[3] = k[3] - j[3], M;
      }
      function X(M, k, j) {
        return M[0] = k[0] * j[0], M[1] = k[1] * j[1], M[2] = k[2] * j[2], M[3] = k[3] * j[3], M;
      }
      function W(M, k, j) {
        return M[0] = k[0] / j[0], M[1] = k[1] / j[1], M[2] = k[2] / j[2], M[3] = k[3] / j[3], M;
      }
      function p(M, k) {
        return M[0] = Math.ceil(k[0]), M[1] = Math.ceil(k[1]), M[2] = Math.ceil(k[2]), M[3] = Math.ceil(k[3]), M;
      }
      function C(M, k) {
        return M[0] = Math.floor(k[0]), M[1] = Math.floor(k[1]), M[2] = Math.floor(k[2]), M[3] = Math.floor(k[3]), M;
      }
      function I(M, k, j) {
        return M[0] = Math.min(k[0], j[0]), M[1] = Math.min(k[1], j[1]), M[2] = Math.min(k[2], j[2]), M[3] = Math.min(k[3], j[3]), M;
      }
      function o(M, k, j) {
        return M[0] = Math.max(k[0], j[0]), M[1] = Math.max(k[1], j[1]), M[2] = Math.max(k[2], j[2]), M[3] = Math.max(k[3], j[3]), M;
      }
      function G(M, k) {
        return M[0] = Math.round(k[0]), M[1] = Math.round(k[1]), M[2] = Math.round(k[2]), M[3] = Math.round(k[3]), M;
      }
      function d(M, k, j) {
        return M[0] = k[0] * j, M[1] = k[1] * j, M[2] = k[2] * j, M[3] = k[3] * j, M;
      }
      function t(M, k, j, A) {
        return M[0] = k[0] + j[0] * A, M[1] = k[1] + j[1] * A, M[2] = k[2] + j[2] * A, M[3] = k[3] + j[3] * A, M;
      }
      function s(M, k) {
        var j = k[0] - M[0], A = k[1] - M[1], H = k[2] - M[2], U = k[3] - M[3];
        return Math.hypot(j, A, H, U);
      }
      function b(M, k) {
        var j = k[0] - M[0], A = k[1] - M[1], H = k[2] - M[2], U = k[3] - M[3];
        return j * j + A * A + H * H + U * U;
      }
      function h(M) {
        var k = M[0], j = M[1], A = M[2], H = M[3];
        return Math.hypot(k, j, A, H);
      }
      function S(M) {
        var k = M[0], j = M[1], A = M[2], H = M[3];
        return k * k + j * j + A * A + H * H;
      }
      function Y(M, k) {
        return M[0] = -k[0], M[1] = -k[1], M[2] = -k[2], M[3] = -k[3], M;
      }
      function T(M, k) {
        return M[0] = 1 / k[0], M[1] = 1 / k[1], M[2] = 1 / k[2], M[3] = 1 / k[3], M;
      }
      function y(M, k) {
        var j = k[0], A = k[1], H = k[2], U = k[3], Z = j * j + A * A + H * H + U * U;
        return Z > 0 && (Z = 1 / Math.sqrt(Z)), M[0] = j * Z, M[1] = A * Z, M[2] = H * Z, M[3] = U * Z, M;
      }
      function J(M, k) {
        return M[0] * k[0] + M[1] * k[1] + M[2] * k[2] + M[3] * k[3];
      }
      function N(M, k, j, A) {
        var H = j[0] * A[1] - j[1] * A[0], U = j[0] * A[2] - j[2] * A[0], Z = j[0] * A[3] - j[3] * A[0], V = j[1] * A[2] - j[2] * A[1], g = j[1] * A[3] - j[3] * A[1], f = j[2] * A[3] - j[3] * A[2], w = k[0], B = k[1], q = k[2], si = k[3];
        return M[0] = B * f - q * g + si * V, M[1] = -(w * f) + q * Z - si * U, M[2] = w * g - B * Z + si * H, M[3] = -(w * V) + B * U - q * H, M;
      }
      function x(M, k, j, A) {
        var H = k[0], U = k[1], Z = k[2], V = k[3];
        return M[0] = H + A * (j[0] - H), M[1] = U + A * (j[1] - U), M[2] = Z + A * (j[2] - Z), M[3] = V + A * (j[3] - V), M;
      }
      function R(M, k) {
        k = k || 1;
        var j, A, H, U, Z, V;
        do
          j = c.RANDOM() * 2 - 1, A = c.RANDOM() * 2 - 1, Z = j * j + A * A;
        while (Z >= 1);
        do
          H = c.RANDOM() * 2 - 1, U = c.RANDOM() * 2 - 1, V = H * H + U * U;
        while (V >= 1);
        var g = Math.sqrt((1 - Z) / V);
        return M[0] = k * j, M[1] = k * A, M[2] = k * H * g, M[3] = k * U * g, M;
      }
      function z(M, k, j) {
        var A = k[0], H = k[1], U = k[2], Z = k[3];
        return M[0] = j[0] * A + j[4] * H + j[8] * U + j[12] * Z, M[1] = j[1] * A + j[5] * H + j[9] * U + j[13] * Z, M[2] = j[2] * A + j[6] * H + j[10] * U + j[14] * Z, M[3] = j[3] * A + j[7] * H + j[11] * U + j[15] * Z, M;
      }
      function Q(M, k, j) {
        var A = k[0], H = k[1], U = k[2], Z = j[0], V = j[1], g = j[2], f = j[3], w = f * A + V * U - g * H, B = f * H + g * A - Z * U, q = f * U + Z * H - V * A, si = -Z * A - V * H - g * U;
        return M[0] = w * f + si * -Z + B * -g - q * -V, M[1] = B * f + si * -V + q * -Z - w * -g, M[2] = q * f + si * -g + w * -V - B * -Z, M[3] = k[3], M;
      }
      function P(M) {
        return M[0] = 0, M[1] = 0, M[2] = 0, M[3] = 0, M;
      }
      function D(M) {
        return "vec4(" + M[0] + ", " + M[1] + ", " + M[2] + ", " + M[3] + ")";
      }
      function _(M, k) {
        return M[0] === k[0] && M[1] === k[1] && M[2] === k[2] && M[3] === k[3];
      }
      function F(M, k) {
        var j = M[0], A = M[1], H = M[2], U = M[3], Z = k[0], V = k[1], g = k[2], f = k[3];
        return Math.abs(j - Z) <= c.EPSILON * Math.max(1, Math.abs(j), Math.abs(Z)) && Math.abs(A - V) <= c.EPSILON * Math.max(1, Math.abs(A), Math.abs(V)) && Math.abs(H - g) <= c.EPSILON * Math.max(1, Math.abs(H), Math.abs(g)) && Math.abs(U - f) <= c.EPSILON * Math.max(1, Math.abs(U), Math.abs(f));
      }
      var v = r, O = X, li = W, ii = s, ti = b, $ = h, ai = S, Xi = function() {
        var M = m();
        return function(k, j, A, H, U, Z) {
          var V, g;
          for (j || (j = 4), A || (A = 0), H ? g = Math.min(H * j + A, k.length) : g = k.length, V = A; V < g; V += j)
            M[0] = k[V], M[1] = k[V + 1], M[2] = k[V + 2], M[3] = k[V + 3], U(M, M, Z), k[V] = M[0], k[V + 1] = M[1], k[V + 2] = M[2], k[V + 3] = M[3];
          return k;
        };
      }();
    },
    /* 10 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return K;
      }), i.d(l, "clone", function() {
        return u;
      }), i.d(l, "fromValues", function() {
        return a;
      }), i.d(l, "fromRotationTranslationValues", function() {
        return e;
      }), i.d(l, "fromRotationTranslation", function() {
        return r;
      }), i.d(l, "fromTranslation", function() {
        return X;
      }), i.d(l, "fromRotation", function() {
        return W;
      }), i.d(l, "fromMat4", function() {
        return p;
      }), i.d(l, "copy", function() {
        return C;
      }), i.d(l, "identity", function() {
        return I;
      }), i.d(l, "set", function() {
        return o;
      }), i.d(l, "getReal", function() {
        return G;
      }), i.d(l, "getDual", function() {
        return d;
      }), i.d(l, "setReal", function() {
        return t;
      }), i.d(l, "setDual", function() {
        return s;
      }), i.d(l, "getTranslation", function() {
        return b;
      }), i.d(l, "translate", function() {
        return h;
      }), i.d(l, "rotateX", function() {
        return S;
      }), i.d(l, "rotateY", function() {
        return Y;
      }), i.d(l, "rotateZ", function() {
        return T;
      }), i.d(l, "rotateByQuatAppend", function() {
        return y;
      }), i.d(l, "rotateByQuatPrepend", function() {
        return J;
      }), i.d(l, "rotateAroundAxis", function() {
        return N;
      }), i.d(l, "add", function() {
        return x;
      }), i.d(l, "multiply", function() {
        return R;
      }), i.d(l, "mul", function() {
        return z;
      }), i.d(l, "scale", function() {
        return Q;
      }), i.d(l, "dot", function() {
        return P;
      }), i.d(l, "lerp", function() {
        return D;
      }), i.d(l, "invert", function() {
        return _;
      }), i.d(l, "conjugate", function() {
        return F;
      }), i.d(l, "length", function() {
        return v;
      }), i.d(l, "len", function() {
        return O;
      }), i.d(l, "squaredLength", function() {
        return li;
      }), i.d(l, "sqrLen", function() {
        return ii;
      }), i.d(l, "normalize", function() {
        return ti;
      }), i.d(l, "str", function() {
        return $;
      }), i.d(l, "exactEquals", function() {
        return ai;
      }), i.d(l, "equals", function() {
        return Xi;
      });
      var c = i(2), m = i(7), L = i(6);
      function K() {
        var M = new c.ARRAY_TYPE(8);
        return c.ARRAY_TYPE != Float32Array && (M[0] = 0, M[1] = 0, M[2] = 0, M[4] = 0, M[5] = 0, M[6] = 0, M[7] = 0), M[3] = 1, M;
      }
      function u(M) {
        var k = new c.ARRAY_TYPE(8);
        return k[0] = M[0], k[1] = M[1], k[2] = M[2], k[3] = M[3], k[4] = M[4], k[5] = M[5], k[6] = M[6], k[7] = M[7], k;
      }
      function a(M, k, j, A, H, U, Z, V) {
        var g = new c.ARRAY_TYPE(8);
        return g[0] = M, g[1] = k, g[2] = j, g[3] = A, g[4] = H, g[5] = U, g[6] = Z, g[7] = V, g;
      }
      function e(M, k, j, A, H, U, Z) {
        var V = new c.ARRAY_TYPE(8);
        V[0] = M, V[1] = k, V[2] = j, V[3] = A;
        var g = H * 0.5, f = U * 0.5, w = Z * 0.5;
        return V[4] = g * A + f * j - w * k, V[5] = f * A + w * M - g * j, V[6] = w * A + g * k - f * M, V[7] = -g * M - f * k - w * j, V;
      }
      function r(M, k, j) {
        var A = j[0] * 0.5, H = j[1] * 0.5, U = j[2] * 0.5, Z = k[0], V = k[1], g = k[2], f = k[3];
        return M[0] = Z, M[1] = V, M[2] = g, M[3] = f, M[4] = A * f + H * g - U * V, M[5] = H * f + U * Z - A * g, M[6] = U * f + A * V - H * Z, M[7] = -A * Z - H * V - U * g, M;
      }
      function X(M, k) {
        return M[0] = 0, M[1] = 0, M[2] = 0, M[3] = 1, M[4] = k[0] * 0.5, M[5] = k[1] * 0.5, M[6] = k[2] * 0.5, M[7] = 0, M;
      }
      function W(M, k) {
        return M[0] = k[0], M[1] = k[1], M[2] = k[2], M[3] = k[3], M[4] = 0, M[5] = 0, M[6] = 0, M[7] = 0, M;
      }
      function p(M, k) {
        var j = m.create();
        L.getRotation(j, k);
        var A = new c.ARRAY_TYPE(3);
        return L.getTranslation(A, k), r(M, j, A), M;
      }
      function C(M, k) {
        return M[0] = k[0], M[1] = k[1], M[2] = k[2], M[3] = k[3], M[4] = k[4], M[5] = k[5], M[6] = k[6], M[7] = k[7], M;
      }
      function I(M) {
        return M[0] = 0, M[1] = 0, M[2] = 0, M[3] = 1, M[4] = 0, M[5] = 0, M[6] = 0, M[7] = 0, M;
      }
      function o(M, k, j, A, H, U, Z, V, g) {
        return M[0] = k, M[1] = j, M[2] = A, M[3] = H, M[4] = U, M[5] = Z, M[6] = V, M[7] = g, M;
      }
      var G = m.copy;
      function d(M, k) {
        return M[0] = k[4], M[1] = k[5], M[2] = k[6], M[3] = k[7], M;
      }
      var t = m.copy;
      function s(M, k) {
        return M[4] = k[0], M[5] = k[1], M[6] = k[2], M[7] = k[3], M;
      }
      function b(M, k) {
        var j = k[4], A = k[5], H = k[6], U = k[7], Z = -k[0], V = -k[1], g = -k[2], f = k[3];
        return M[0] = (j * f + U * Z + A * g - H * V) * 2, M[1] = (A * f + U * V + H * Z - j * g) * 2, M[2] = (H * f + U * g + j * V - A * Z) * 2, M;
      }
      function h(M, k, j) {
        var A = k[0], H = k[1], U = k[2], Z = k[3], V = j[0] * 0.5, g = j[1] * 0.5, f = j[2] * 0.5, w = k[4], B = k[5], q = k[6], si = k[7];
        return M[0] = A, M[1] = H, M[2] = U, M[3] = Z, M[4] = Z * V + H * f - U * g + w, M[5] = Z * g + U * V - A * f + B, M[6] = Z * f + A * g - H * V + q, M[7] = -A * V - H * g - U * f + si, M;
      }
      function S(M, k, j) {
        var A = -k[0], H = -k[1], U = -k[2], Z = k[3], V = k[4], g = k[5], f = k[6], w = k[7], B = V * Z + w * A + g * U - f * H, q = g * Z + w * H + f * A - V * U, si = f * Z + w * U + V * H - g * A, bi = w * Z - V * A - g * H - f * U;
        return m.rotateX(M, k, j), A = M[0], H = M[1], U = M[2], Z = M[3], M[4] = B * Z + bi * A + q * U - si * H, M[5] = q * Z + bi * H + si * A - B * U, M[6] = si * Z + bi * U + B * H - q * A, M[7] = bi * Z - B * A - q * H - si * U, M;
      }
      function Y(M, k, j) {
        var A = -k[0], H = -k[1], U = -k[2], Z = k[3], V = k[4], g = k[5], f = k[6], w = k[7], B = V * Z + w * A + g * U - f * H, q = g * Z + w * H + f * A - V * U, si = f * Z + w * U + V * H - g * A, bi = w * Z - V * A - g * H - f * U;
        return m.rotateY(M, k, j), A = M[0], H = M[1], U = M[2], Z = M[3], M[4] = B * Z + bi * A + q * U - si * H, M[5] = q * Z + bi * H + si * A - B * U, M[6] = si * Z + bi * U + B * H - q * A, M[7] = bi * Z - B * A - q * H - si * U, M;
      }
      function T(M, k, j) {
        var A = -k[0], H = -k[1], U = -k[2], Z = k[3], V = k[4], g = k[5], f = k[6], w = k[7], B = V * Z + w * A + g * U - f * H, q = g * Z + w * H + f * A - V * U, si = f * Z + w * U + V * H - g * A, bi = w * Z - V * A - g * H - f * U;
        return m.rotateZ(M, k, j), A = M[0], H = M[1], U = M[2], Z = M[3], M[4] = B * Z + bi * A + q * U - si * H, M[5] = q * Z + bi * H + si * A - B * U, M[6] = si * Z + bi * U + B * H - q * A, M[7] = bi * Z - B * A - q * H - si * U, M;
      }
      function y(M, k, j) {
        var A = j[0], H = j[1], U = j[2], Z = j[3], V = k[0], g = k[1], f = k[2], w = k[3];
        return M[0] = V * Z + w * A + g * U - f * H, M[1] = g * Z + w * H + f * A - V * U, M[2] = f * Z + w * U + V * H - g * A, M[3] = w * Z - V * A - g * H - f * U, V = k[4], g = k[5], f = k[6], w = k[7], M[4] = V * Z + w * A + g * U - f * H, M[5] = g * Z + w * H + f * A - V * U, M[6] = f * Z + w * U + V * H - g * A, M[7] = w * Z - V * A - g * H - f * U, M;
      }
      function J(M, k, j) {
        var A = k[0], H = k[1], U = k[2], Z = k[3], V = j[0], g = j[1], f = j[2], w = j[3];
        return M[0] = A * w + Z * V + H * f - U * g, M[1] = H * w + Z * g + U * V - A * f, M[2] = U * w + Z * f + A * g - H * V, M[3] = Z * w - A * V - H * g - U * f, V = j[4], g = j[5], f = j[6], w = j[7], M[4] = A * w + Z * V + H * f - U * g, M[5] = H * w + Z * g + U * V - A * f, M[6] = U * w + Z * f + A * g - H * V, M[7] = Z * w - A * V - H * g - U * f, M;
      }
      function N(M, k, j, A) {
        if (Math.abs(A) < c.EPSILON)
          return C(M, k);
        var H = Math.hypot(j[0], j[1], j[2]);
        A = A * 0.5;
        var U = Math.sin(A), Z = U * j[0] / H, V = U * j[1] / H, g = U * j[2] / H, f = Math.cos(A), w = k[0], B = k[1], q = k[2], si = k[3];
        M[0] = w * f + si * Z + B * g - q * V, M[1] = B * f + si * V + q * Z - w * g, M[2] = q * f + si * g + w * V - B * Z, M[3] = si * f - w * Z - B * V - q * g;
        var bi = k[4], mi = k[5], oi = k[6], Zi = k[7];
        return M[4] = bi * f + Zi * Z + mi * g - oi * V, M[5] = mi * f + Zi * V + oi * Z - bi * g, M[6] = oi * f + Zi * g + bi * V - mi * Z, M[7] = Zi * f - bi * Z - mi * V - oi * g, M;
      }
      function x(M, k, j) {
        return M[0] = k[0] + j[0], M[1] = k[1] + j[1], M[2] = k[2] + j[2], M[3] = k[3] + j[3], M[4] = k[4] + j[4], M[5] = k[5] + j[5], M[6] = k[6] + j[6], M[7] = k[7] + j[7], M;
      }
      function R(M, k, j) {
        var A = k[0], H = k[1], U = k[2], Z = k[3], V = j[4], g = j[5], f = j[6], w = j[7], B = k[4], q = k[5], si = k[6], bi = k[7], mi = j[0], oi = j[1], Zi = j[2], ci = j[3];
        return M[0] = A * ci + Z * mi + H * Zi - U * oi, M[1] = H * ci + Z * oi + U * mi - A * Zi, M[2] = U * ci + Z * Zi + A * oi - H * mi, M[3] = Z * ci - A * mi - H * oi - U * Zi, M[4] = A * w + Z * V + H * f - U * g + B * ci + bi * mi + q * Zi - si * oi, M[5] = H * w + Z * g + U * V - A * f + q * ci + bi * oi + si * mi - B * Zi, M[6] = U * w + Z * f + A * g - H * V + si * ci + bi * Zi + B * oi - q * mi, M[7] = Z * w - A * V - H * g - U * f + bi * ci - B * mi - q * oi - si * Zi, M;
      }
      var z = R;
      function Q(M, k, j) {
        return M[0] = k[0] * j, M[1] = k[1] * j, M[2] = k[2] * j, M[3] = k[3] * j, M[4] = k[4] * j, M[5] = k[5] * j, M[6] = k[6] * j, M[7] = k[7] * j, M;
      }
      var P = m.dot;
      function D(M, k, j, A) {
        var H = 1 - A;
        return P(k, j) < 0 && (A = -A), M[0] = k[0] * H + j[0] * A, M[1] = k[1] * H + j[1] * A, M[2] = k[2] * H + j[2] * A, M[3] = k[3] * H + j[3] * A, M[4] = k[4] * H + j[4] * A, M[5] = k[5] * H + j[5] * A, M[6] = k[6] * H + j[6] * A, M[7] = k[7] * H + j[7] * A, M;
      }
      function _(M, k) {
        var j = li(k);
        return M[0] = -k[0] / j, M[1] = -k[1] / j, M[2] = -k[2] / j, M[3] = k[3] / j, M[4] = -k[4] / j, M[5] = -k[5] / j, M[6] = -k[6] / j, M[7] = k[7] / j, M;
      }
      function F(M, k) {
        return M[0] = -k[0], M[1] = -k[1], M[2] = -k[2], M[3] = k[3], M[4] = -k[4], M[5] = -k[5], M[6] = -k[6], M[7] = k[7], M;
      }
      var v = m.length, O = v, li = m.squaredLength, ii = li;
      function ti(M, k) {
        var j = li(k);
        if (j > 0) {
          j = Math.sqrt(j);
          var A = k[0] / j, H = k[1] / j, U = k[2] / j, Z = k[3] / j, V = k[4], g = k[5], f = k[6], w = k[7], B = A * V + H * g + U * f + Z * w;
          M[0] = A, M[1] = H, M[2] = U, M[3] = Z, M[4] = (V - A * B) / j, M[5] = (g - H * B) / j, M[6] = (f - U * B) / j, M[7] = (w - Z * B) / j;
        }
        return M;
      }
      function $(M) {
        return "quat2(" + M[0] + ", " + M[1] + ", " + M[2] + ", " + M[3] + ", " + M[4] + ", " + M[5] + ", " + M[6] + ", " + M[7] + ")";
      }
      function ai(M, k) {
        return M[0] === k[0] && M[1] === k[1] && M[2] === k[2] && M[3] === k[3] && M[4] === k[4] && M[5] === k[5] && M[6] === k[6] && M[7] === k[7];
      }
      function Xi(M, k) {
        var j = M[0], A = M[1], H = M[2], U = M[3], Z = M[4], V = M[5], g = M[6], f = M[7], w = k[0], B = k[1], q = k[2], si = k[3], bi = k[4], mi = k[5], oi = k[6], Zi = k[7];
        return Math.abs(j - w) <= c.EPSILON * Math.max(1, Math.abs(j), Math.abs(w)) && Math.abs(A - B) <= c.EPSILON * Math.max(1, Math.abs(A), Math.abs(B)) && Math.abs(H - q) <= c.EPSILON * Math.max(1, Math.abs(H), Math.abs(q)) && Math.abs(U - si) <= c.EPSILON * Math.max(1, Math.abs(U), Math.abs(si)) && Math.abs(Z - bi) <= c.EPSILON * Math.max(1, Math.abs(Z), Math.abs(bi)) && Math.abs(V - mi) <= c.EPSILON * Math.max(1, Math.abs(V), Math.abs(mi)) && Math.abs(g - oi) <= c.EPSILON * Math.max(1, Math.abs(g), Math.abs(oi)) && Math.abs(f - Zi) <= c.EPSILON * Math.max(1, Math.abs(f), Math.abs(Zi));
      }
    },
    /* 11 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return m;
      }), i.d(l, "clone", function() {
        return L;
      }), i.d(l, "fromValues", function() {
        return K;
      }), i.d(l, "copy", function() {
        return u;
      }), i.d(l, "set", function() {
        return a;
      }), i.d(l, "add", function() {
        return e;
      }), i.d(l, "subtract", function() {
        return r;
      }), i.d(l, "multiply", function() {
        return X;
      }), i.d(l, "divide", function() {
        return W;
      }), i.d(l, "ceil", function() {
        return p;
      }), i.d(l, "floor", function() {
        return C;
      }), i.d(l, "min", function() {
        return I;
      }), i.d(l, "max", function() {
        return o;
      }), i.d(l, "round", function() {
        return G;
      }), i.d(l, "scale", function() {
        return d;
      }), i.d(l, "scaleAndAdd", function() {
        return t;
      }), i.d(l, "distance", function() {
        return s;
      }), i.d(l, "squaredDistance", function() {
        return b;
      }), i.d(l, "length", function() {
        return h;
      }), i.d(l, "squaredLength", function() {
        return S;
      }), i.d(l, "negate", function() {
        return Y;
      }), i.d(l, "inverse", function() {
        return T;
      }), i.d(l, "normalize", function() {
        return y;
      }), i.d(l, "dot", function() {
        return J;
      }), i.d(l, "cross", function() {
        return N;
      }), i.d(l, "lerp", function() {
        return x;
      }), i.d(l, "random", function() {
        return R;
      }), i.d(l, "transformMat2", function() {
        return z;
      }), i.d(l, "transformMat2d", function() {
        return Q;
      }), i.d(l, "transformMat3", function() {
        return P;
      }), i.d(l, "transformMat4", function() {
        return D;
      }), i.d(l, "rotate", function() {
        return _;
      }), i.d(l, "angle", function() {
        return F;
      }), i.d(l, "zero", function() {
        return v;
      }), i.d(l, "str", function() {
        return O;
      }), i.d(l, "exactEquals", function() {
        return li;
      }), i.d(l, "equals", function() {
        return ii;
      }), i.d(l, "len", function() {
        return ti;
      }), i.d(l, "sub", function() {
        return $;
      }), i.d(l, "mul", function() {
        return ai;
      }), i.d(l, "div", function() {
        return Xi;
      }), i.d(l, "dist", function() {
        return M;
      }), i.d(l, "sqrDist", function() {
        return k;
      }), i.d(l, "sqrLen", function() {
        return j;
      }), i.d(l, "forEach", function() {
        return A;
      });
      var c = i(2);
      function m() {
        var H = new c.ARRAY_TYPE(2);
        return c.ARRAY_TYPE != Float32Array && (H[0] = 0, H[1] = 0), H;
      }
      function L(H) {
        var U = new c.ARRAY_TYPE(2);
        return U[0] = H[0], U[1] = H[1], U;
      }
      function K(H, U) {
        var Z = new c.ARRAY_TYPE(2);
        return Z[0] = H, Z[1] = U, Z;
      }
      function u(H, U) {
        return H[0] = U[0], H[1] = U[1], H;
      }
      function a(H, U, Z) {
        return H[0] = U, H[1] = Z, H;
      }
      function e(H, U, Z) {
        return H[0] = U[0] + Z[0], H[1] = U[1] + Z[1], H;
      }
      function r(H, U, Z) {
        return H[0] = U[0] - Z[0], H[1] = U[1] - Z[1], H;
      }
      function X(H, U, Z) {
        return H[0] = U[0] * Z[0], H[1] = U[1] * Z[1], H;
      }
      function W(H, U, Z) {
        return H[0] = U[0] / Z[0], H[1] = U[1] / Z[1], H;
      }
      function p(H, U) {
        return H[0] = Math.ceil(U[0]), H[1] = Math.ceil(U[1]), H;
      }
      function C(H, U) {
        return H[0] = Math.floor(U[0]), H[1] = Math.floor(U[1]), H;
      }
      function I(H, U, Z) {
        return H[0] = Math.min(U[0], Z[0]), H[1] = Math.min(U[1], Z[1]), H;
      }
      function o(H, U, Z) {
        return H[0] = Math.max(U[0], Z[0]), H[1] = Math.max(U[1], Z[1]), H;
      }
      function G(H, U) {
        return H[0] = Math.round(U[0]), H[1] = Math.round(U[1]), H;
      }
      function d(H, U, Z) {
        return H[0] = U[0] * Z, H[1] = U[1] * Z, H;
      }
      function t(H, U, Z, V) {
        return H[0] = U[0] + Z[0] * V, H[1] = U[1] + Z[1] * V, H;
      }
      function s(H, U) {
        var Z = U[0] - H[0], V = U[1] - H[1];
        return Math.hypot(Z, V);
      }
      function b(H, U) {
        var Z = U[0] - H[0], V = U[1] - H[1];
        return Z * Z + V * V;
      }
      function h(H) {
        var U = H[0], Z = H[1];
        return Math.hypot(U, Z);
      }
      function S(H) {
        var U = H[0], Z = H[1];
        return U * U + Z * Z;
      }
      function Y(H, U) {
        return H[0] = -U[0], H[1] = -U[1], H;
      }
      function T(H, U) {
        return H[0] = 1 / U[0], H[1] = 1 / U[1], H;
      }
      function y(H, U) {
        var Z = U[0], V = U[1], g = Z * Z + V * V;
        return g > 0 && (g = 1 / Math.sqrt(g)), H[0] = U[0] * g, H[1] = U[1] * g, H;
      }
      function J(H, U) {
        return H[0] * U[0] + H[1] * U[1];
      }
      function N(H, U, Z) {
        var V = U[0] * Z[1] - U[1] * Z[0];
        return H[0] = H[1] = 0, H[2] = V, H;
      }
      function x(H, U, Z, V) {
        var g = U[0], f = U[1];
        return H[0] = g + V * (Z[0] - g), H[1] = f + V * (Z[1] - f), H;
      }
      function R(H, U) {
        U = U || 1;
        var Z = c.RANDOM() * 2 * Math.PI;
        return H[0] = Math.cos(Z) * U, H[1] = Math.sin(Z) * U, H;
      }
      function z(H, U, Z) {
        var V = U[0], g = U[1];
        return H[0] = Z[0] * V + Z[2] * g, H[1] = Z[1] * V + Z[3] * g, H;
      }
      function Q(H, U, Z) {
        var V = U[0], g = U[1];
        return H[0] = Z[0] * V + Z[2] * g + Z[4], H[1] = Z[1] * V + Z[3] * g + Z[5], H;
      }
      function P(H, U, Z) {
        var V = U[0], g = U[1];
        return H[0] = Z[0] * V + Z[3] * g + Z[6], H[1] = Z[1] * V + Z[4] * g + Z[7], H;
      }
      function D(H, U, Z) {
        var V = U[0], g = U[1];
        return H[0] = Z[0] * V + Z[4] * g + Z[12], H[1] = Z[1] * V + Z[5] * g + Z[13], H;
      }
      function _(H, U, Z, V) {
        var g = U[0] - Z[0], f = U[1] - Z[1], w = Math.sin(V), B = Math.cos(V);
        return H[0] = g * B - f * w + Z[0], H[1] = g * w + f * B + Z[1], H;
      }
      function F(H, U) {
        var Z = H[0], V = H[1], g = U[0], f = U[1], w = Math.sqrt(Z * Z + V * V) * Math.sqrt(g * g + f * f), B = w && (Z * g + V * f) / w;
        return Math.acos(Math.min(Math.max(B, -1), 1));
      }
      function v(H) {
        return H[0] = 0, H[1] = 0, H;
      }
      function O(H) {
        return "vec2(" + H[0] + ", " + H[1] + ")";
      }
      function li(H, U) {
        return H[0] === U[0] && H[1] === U[1];
      }
      function ii(H, U) {
        var Z = H[0], V = H[1], g = U[0], f = U[1];
        return Math.abs(Z - g) <= c.EPSILON * Math.max(1, Math.abs(Z), Math.abs(g)) && Math.abs(V - f) <= c.EPSILON * Math.max(1, Math.abs(V), Math.abs(f));
      }
      var ti = h, $ = r, ai = X, Xi = W, M = s, k = b, j = S, A = function() {
        var H = m();
        return function(U, Z, V, g, f, w) {
          var B, q;
          for (Z || (Z = 2), V || (V = 0), g ? q = Math.min(g * Z + V, U.length) : q = U.length, B = V; B < q; B += Z)
            H[0] = U[B], H[1] = U[B + 1], f(H, H, w), U[B] = H[0], U[B + 1] = H[1];
          return U;
        };
      }();
    },
    /* 12 */
    /***/
    function(n, l, i) {
      i.r(l);
      var c = i(13);
      i.d(l, "Renderer", function() {
        return c.default;
      });
      var m = i(40);
      i.d(l, "Figure2D", function() {
        return m.default;
      });
      var L = i(56);
      i.d(l, "Mesh2D", function() {
        return L.default;
      });
      var K = i(29);
      i.d(l, "MeshCloud", function() {
        return K.default;
      });
      var u = i(23);
      i.d(l, "parseFont", function() {
        return u.default;
      });
      var a = i(31);
      i.d(l, "parseColor", function() {
        return a.default;
      });
      var e = i(21);
      i.d(l, "ENV", function() {
        return e.default;
      }), i(1).glMatrix.setMatrixArrayType(Array);
    },
    /* 13 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return T;
      });
      var c = i(14), m = i(1), L = i(20), K = i(27), u = i(25), a = i(40), e = i(56), r = i(29), X = i(59), W = i(21), p = i(63);
      i(1).glMatrix.setMatrixArrayType(Array);
      const C = {
        autoUpdate: !1,
        // premultipliedAlpha: true,
        preserveDrawingBuffer: !1,
        // depth: false,
        // antialias: false,
        bufferSize: 1500
      }, I = `attribute vec3 a_vertexPosition;
attribute vec3 a_vertexTextureCoord;
varying vec3 vTextureCoord;
uniform mat3 viewMatrix;
uniform mat3 projectionMatrix;

void main() {
  gl_PointSize = 1.0;
  vec3 pos = projectionMatrix * viewMatrix * vec3(a_vertexPosition.xy, 1.0);
  gl_Position = vec4(pos.xy, 1.0, 1.0);    
  vTextureCoord = a_vertexTextureCoord;              
}
`, o = `precision mediump float;
varying vec3 vTextureCoord;
uniform sampler2D u_texSampler;
void main() {
  gl_FragColor = texture2D(u_texSampler, vTextureCoord.xy);
}
`, G = Symbol("glRenderer"), d = Symbol("canvasRenderer"), t = Symbol("options"), s = Symbol("globalTransform"), b = Symbol("applyGlobalTransform"), h = Symbol("canvas");
      function S(y) {
        const J = y.gl, N = y.fbo;
        N && J.bindFramebuffer(J.FRAMEBUFFER, N), y._draw(), N && J.bindFramebuffer(J.FRAMEBUFFER, null);
      }
      function Y(y, J, N, x) {
        const R = y.createTexture(J.canvas), z = [[[0, 0], [N, 0], [N, x], [0, x], [0, 0]]];
        z.closed = !0;
        const Q = new e.default({
          contours: z
        });
        Q.setTexture(R), y.setMeshData([Q.meshData]), S(y), R.delete(), J.clearRect(0, 0, N, x), delete J._filter;
      }
      class T {
        constructor(J, N = {}) {
          let x = N.contextType;
          if (x || (typeof WebGL2RenderingContext == "function" ? x = "webgl2" : typeof WebGLRenderingContext == "function" ? x = "webgl" : x = "2d"), !J.getContext) {
            const R = J;
            J = {
              getContext() {
                return R;
              },
              width: N.width,
              height: N.height
            }, R.canvas = J, x = "2d";
          }
          if (this[h] = J, x !== "webgl" && x !== "webgl2" && x !== "2d")
            throw new Error(`Unknown context type ${x}`);
          if (N.contextType = x, this[t] = Object.assign({}, C, N), x === "webgl" || x === "webgl2") {
            x === "webgl2" && (this[t].webgl2 = !0);
            const R = new c.default(J, this[t]);
            x === "webgl2" && !R.isWebGL2 && (N.contextType = "webgl"), Object(p.createShaders)(R), Object(p.applyShader)(R), Object(p.createCloudShaders)(R);
            const z = R.gl;
            z.clearColor(0, 0, 0, 0), z.blendFuncSeparate(z.SRC_ALPHA, z.ONE_MINUS_SRC_ALPHA, z.ONE, z.ONE_MINUS_SRC_ALPHA), this[G] = R;
          } else
            this[d] = new L.default(J, this[t]);
          this[s] = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.updateResolution();
        }
        get canvas() {
          return this[h];
        }
        get canvasRenderer() {
          return this[d];
        }
        get glRenderer() {
          return this[G];
        }
        get isWebGL2() {
          return this[G] && this[G].isWebGL2;
        }
        get options() {
          return this[t];
        }
        get globalTransformMatrix() {
          const J = this[s];
          return [J[0], J[1], J[3], J[4], J[6], J[7]];
        }
        get viewMatrix() {
          return this[s];
        }
        [b]() {
          const J = this[G] || this[d];
          if (this[G]) {
            const {
              width: N,
              height: x
            } = this.canvas;
            J.uniforms.viewMatrix = this.viewMatrix, J.uniforms.projectionMatrix = this.projectionMatrix, J.uniforms.u_resolution = [N, x];
          }
        }
        updateResolution() {
          const {
            width: J,
            height: N
          } = this.canvas, x = [
            // translation
            1,
            0,
            0,
            0,
            1,
            0,
            -J / 2,
            -N / 2,
            1
          ], R = [
            // scale
            2 / J,
            0,
            0,
            0,
            -2 / N,
            0,
            0,
            0,
            1
          ], z = m.mat3.multiply(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), R, x);
          this.projectionMatrix = z, this[G] && this[G].gl.viewport(0, 0, J, N);
        }
        createTexture(J, N) {
          return (this[G] || this[d]).createTexture(J, N);
        }
        /* async */
        loadTexture(J, {
          useImageBitmap: N = !1
        } = {}) {
          return (this[G] || this[d]).loadTexture(J, {
            useImageBitmap: N
          });
        }
        createText(J, {
          font: N = "16px arial",
          fillColor: x = null,
          strokeColor: R = null,
          strokeWidth: z = 1
        } = {}) {
          if (this[G]) {
            const Q = W.default.createText(J, {
              font: N,
              fillColor: x,
              strokeColor: R,
              strokeWidth: z
            });
            return {
              image: this.createTexture(Q.image),
              rect: Q.rect
            };
          }
          return {
            _img: {
              font: N,
              fillColor: x,
              strokeColor: R,
              strokeWidth: z,
              text: J
            }
          };
        }
        createProgram({
          vertex: J,
          fragment: N,
          options: x
        } = {}) {
          if (this[G]) {
            const R = this[G].compileSync(N, J);
            return R._attribOpts = x, R;
          }
          throw new Error("Context 2D cannot create webgl program.");
        }
        createPassProgram({
          vertex: J = I,
          fragment: N = o,
          options: x
        } = {}) {
          return this.createProgram({
            vertex: J,
            fragment: N,
            options: x
          });
        }
        useProgram(J, N = {}) {
          if (this[G]) {
            const x = Object.assign({}, J._attribOpts, N);
            return this[G].useProgram(J, x);
          }
          throw new Error("Context 2D cannot use webgl program.");
        }
        deleteTexture(J) {
          return (this[G] || this[d]).deleteTexture(J);
        }
        clear(...J) {
          if (this[G]) {
            const N = this[G].gl;
            N.clear(N.COLOR_BUFFER_BIT);
          } else
            this[d].clear(...J);
        }
        drawMeshCloud(J, {
          clear: N = !1,
          program: x = null
        } = {}) {
          const R = this[G] || this[d], z = x || J.program;
          if (this[G]) {
            const Q = R.gl;
            if (N && Q.clear(Q.COLOR_BUFFER_BIT), z)
              R.program !== z && this.useProgram(z, {
                a_color: {
                  type: "UNSIGNED_BYTE",
                  normalize: !0
                },
                a_fillCloudColor: {
                  type: "UNSIGNED_BYTE",
                  normalize: !0
                },
                a_strokeCloudColor: {
                  type: "UNSIGNED_BYTE",
                  normalize: !0
                },
                a_frameIndex: {
                  type: "UNSIGNED_BYTE",
                  normalize: !1
                }
              });
            else {
              const P = J.mesh.meshData, D = !!P.uniforms.u_texSampler, _ = !!P.uniforms.u_filterFlag, F = !!P.uniforms.u_radialGradientVector, v = J.hasCloudColor, O = J.hasCloudFilter, li = !!P.uniforms.u_clipSampler;
              Object(p.applyCloudShader)(R, {
                hasTexture: D,
                hasFilter: _,
                hasGradient: F,
                hasCloudColor: v,
                hasCloudFilter: O,
                hasClipPath: li
              });
            }
            this[b](), R.setMeshData([J.meshData]), J.beforeRender && J.beforeRender(Q, J), S(R), J.afterRender && J.afterRender(Q, J);
          } else
            R.setTransform(this.globalTransformMatrix), R.drawMeshCloud(J, {
              clear: N,
              hook: !1
            });
        }
        drawMeshes(J, {
          clear: N = !1,
          program: x = null
        } = {}) {
          const R = this[G] || this[d];
          if (this[G]) {
            const z = R.fbo, Q = Object(K.default)(this, J, x == null), P = R.gl;
            N && P.clear(P.COLOR_BUFFER_BIT);
            const D = !Object(X.isUnitTransform)(this.globalTransformMatrix);
            this._drawCalls = 0;
            for (const _ of Q) {
              this._drawCalls++;
              const F = x || _.program;
              if (_ instanceof r.default)
                this.drawMeshCloud(_, {
                  clear: N,
                  program: F
                });
              else {
                const {
                  width: v,
                  height: O
                } = this.canvas;
                if (_.beforeRender && _.beforeRender(P, _), _.pass.length && ((!this.fbo || this.fbo.width !== v || this.fbo.height !== O) && (this.fbo = {
                  width: v,
                  height: O,
                  target: R.createFBO(),
                  buffer: R.createFBO(),
                  swap() {
                    [this.target, this.buffer] = [this.buffer, this.target];
                  }
                }), R.bindFBO(this.fbo.target)), !F && _.filterCanvas) {
                  Object(p.applyShader)(R, {
                    hasTexture: !0
                  });
                  let li = this.filterContext;
                  li || (li = W.default.createCanvas(v, O).getContext("2d"), this.filterContext = li);
                  const ii = J[_.packIndex], ti = ii.filter, $ = J[_.packIndex + 1], ai = J[_.packIndex - 1];
                  (!ai || !ai.filterCanvas || ai.filter !== ti) && (!$ || !$.filterCanvas || $.filter !== ti) ? (D ? (li.save(), Object(u.drawMesh2D)(ii, li, !1), li.restore(), Object(u.applyFilter)(li, ti)) : Object(u.drawMesh2D)(ii, li, !0), this[b](), Y(R, li, v, O)) : (D && li.save(), Object(u.drawMesh2D)(ii, li, !1), D && li.restore(), (!$ || !$.filterCanvas || ii.filter !== $.filter) && (Object(u.applyFilter)(li, ti), this[b](), Y(R, li, v, O)));
                } else {
                  if (F)
                    R.program !== F && this.useProgram(F, {
                      a_color: {
                        type: "UNSIGNED_BYTE",
                        normalize: !0
                      }
                    });
                  else {
                    const li = !!_.uniforms.u_texSampler, ii = !!_.uniforms.u_filterFlag, ti = !!_.uniforms.u_radialGradientVector, $ = !!_.uniforms.u_clipSampler;
                    Object(p.applyShader)(R, {
                      hasTexture: li,
                      hasFilter: ii,
                      hasGradient: ti,
                      hasClipPath: $
                    });
                  }
                  _.filterCanvas && console.warn("User program ignored some filter effects."), this[b](), R.setMeshData([_]), S(R);
                }
                if (_.pass.length) {
                  const li = _.pass.length;
                  _.pass.forEach((ii, ti) => {
                    ii.blend = _.enableBlend, ii.setTexture(R.fbo.texture), ti === li - 1 ? R.bindFBO(z) : (this.fbo.swap(), R.bindFBO(this.fbo.target)), ii.program ? R.useProgram(ii.program) : (this.defaultPassProgram = this.defaultPassProgram || this.createPassProgram(), R.useProgram(this.defaultPassProgram)), R.setMeshData([ii.meshData]), P.clear(P.COLOR_BUFFER_BIT), S(R);
                  });
                }
                _.afterRender && _.afterRender(P, _);
              }
            }
          } else
            R.setTransform(this.globalTransformMatrix), R.drawMeshes(J, {
              clear: N
            });
        }
        drawImage(J, ...N) {
          const x = N.length;
          if (x < 2)
            throw new TypeError(`Failed to execute 'drawImage' on 'Renderer': 3 arguments required, but only ${N.length + 1} present.`);
          if (x !== 2 && x !== 4 && x !== 8)
            throw new TypeError(`Failed to execute 'drawImage' on 'Renderer': Valid arities are: [3, 5, 9], but ${N.length + 1} arguments provided.`);
          let R = null, z = null;
          x === 2 ? R = [N[0], N[1], J.width, J.height] : x === 4 ? R = N : x === 8 && (z = N.slice(0, 4), R = N.slice(4));
          const Q = this.createTexture(J), {
            width: P,
            height: D
          } = this.canvas, _ = new a.default();
          _.rect(R[0], R[1], P, D);
          const F = new e.default(_, {
            width: P,
            height: D
          });
          F.setTexture(Q, {
            rect: R,
            srcRect: z
          }), this.drawMeshes([F]), this.deleteTexture(Q);
        }
        setGlobalTransform(...J) {
          return this[s] = [J[0], J[1], 0, J[2], J[3], 0, J[4], J[5], 1], this;
        }
        globalTransform(...J) {
          const N = this[s];
          return this[s] = m.mat3.multiply(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), N, J), this;
        }
        globalTranslate(J, N) {
          let x = m.mat3.create();
          return x = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), x, [J, N]), this.globalTransform(...x);
        }
        globalRotate(J, [N, x] = [0, 0]) {
          let R = m.mat3.create();
          return R = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), R, [N, x]), R = m.mat3.rotate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), R, J), R = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), R, [-N, -x]), this.globalTransform(...R);
        }
        globalScale(J, N = J, [x, R] = [0, 0]) {
          let z = m.mat3.create();
          return z = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), z, [x, R]), z = m.mat3.scale(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), z, [J, N]), z = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), z, [-x, -R]), this.globalTransform(...z);
        }
        globalSkew(J, N = J, [x, R] = [0, 0]) {
          let z = m.mat3.create();
          return z = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), z, [x, R]), z = m.mat3.multiply(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), z, m.mat3.fromValues(1, Math.tan(N), Math.tan(J), 1, 0, 0)), z = m.mat3.translate(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), z, [-x, -R]), this.globalTransform(...z);
        }
        transformPoint(J, N, x) {
          let R = this.globalTransformMatrix;
          x && (R = m.mat3.multiply(Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0), R, x));
          const z = J * R[0] + N * R[2] + R[4], Q = J * R[1] + N * R[3] + R[5];
          return [z, Q];
        }
      }
    },
    /* 14 */
    /***/
    function(n, l, i) {
      i.r(l);
      var c = i(15);
      i(1).glMatrix.setMatrixArrayType(Array), l.default = c.default;
    },
    /* 15 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return p;
      });
      var c = i(16), m = i(17), L = i(18), K = i(19);
      i(1).glMatrix.setMatrixArrayType(Array);
      function u(C, I, o) {
        return I in C ? Object.defineProperty(C, I, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : C[I] = o, C;
      }
      const a = {};
      function e(C, I = 3) {
        const o = [], G = C.length;
        for (let d = 0; d < G; d++)
          d % I < 2 && o.push(0.5 * (C[d] + 1));
        return o;
      }
      function r(C, I) {
        const o = I._buffers;
        Object.values(o).forEach((G) => {
          C.deleteBuffer(G);
        }), I._buffers = {};
      }
      function X(C, I, o) {
        return C.activeTexture(C.TEXTURE0 + o), Array.isArray(I._img) ? C.bindTexture(C.TEXTURE_CUBE_MAP, I) : C.bindTexture(C.TEXTURE_2D, I), I;
      }
      const W = {
        int: "1i",
        ivec2: "2i",
        ivec3: "3i",
        ivec4: "4i",
        float: "1f",
        vec2: "2f",
        vec3: "3f",
        vec4: "4f",
        mat2: "Matrix2fv",
        mat3: "Matrix3fv",
        mat4: "Matrix4fv",
        sampler1D: "sampler1D",
        sampler2D: "sampler2D",
        sampler3D: "sampler3D",
        samplerCube: "samplerCube",
        sampler1DShadow: "sampler1DShadow",
        sampler2DShadow: "sampler2DShadow",
        sampler2DRect: "sampler2DRect",
        sampler2DRectShadow: "sampler2DRectShadow"
      };
      class p {
        static addLibs(I = {}) {
          Object.assign(a, I);
        }
        static FLOAT(I, o) {
          return Object(c.pointsToBuffer)(I, Float32Array, o);
        }
        static UNSIGNED_BYTE(I, o) {
          return Object(c.pointsToBuffer)(I, Uint8Array, o);
        }
        static UNSIGNED_SHORT(I, o) {
          return Object(c.pointsToBuffer)(I, Uint16Array, o);
        }
        static BYTE(I, o) {
          return Object(c.pointsToBuffer)(I, Int8Array, o);
        }
        static SHORT(I, o) {
          return Object(c.pointsToBuffer)(I, Int16Array, o);
        }
        constructor(I, o = {}) {
          this.options = Object.assign({}, p.defaultOptions, o), this.canvas = I;
          let G;
          this.options.webgl2 && (G = I.getContext("webgl2", this.options)), G == null && (G = Object(c.setupWebGL)(I, this.options), this.aia_ext = G.getExtension("ANGLE_instanced_arrays")), this.gl = G, G.viewport(0, 0, I.width, I.height), G.clearColor(0, 0, 0, 0), G.blendFuncSeparate(G.SRC_ALPHA, G.ONE_MINUS_SRC_ALPHA, G.ONE, G.ONE_MINUS_SRC_ALPHA), this.programs = [], this._events = {};
        }
        get program() {
          const I = this.gl;
          return I.getParameter(I.CURRENT_PROGRAM);
        }
        // WebGLRenderingContext.uniform[1234][fi][v]()
        // WebGLRenderingContext.uniformMatrix[234]fv()
        _declareUniform(I, o, G = "1f") {
          const d = this.gl, t = d.getUniformLocation(I, o);
          let s;
          const b = this;
          if (/^sampler/.test(G)) {
            const h = I._samplerMap, S = I._bindTextures;
            Object.defineProperty(I.uniforms, o, {
              get() {
                return s;
              },
              set(Y) {
                s = Y;
                const T = h[o] != null ? h[o] : S.length;
                S[T] = Y, X(d, Y, T), h[o] || (h[o] = T, d.uniform1i(t, T)), b.options.autoUpdate && b.update();
              },
              configurable: !1,
              enumerable: !0
            });
          } else {
            const h = G.indexOf("Matrix") === 0, S = !h && /v$/.test(G), Y = d[`uniform${G}`].bind(d);
            Object.defineProperty(I.uniforms, o, {
              get() {
                return s;
              },
              set(T) {
                s = T, typeof T == "number" && (T = [T]), h ? Y(t, !1, T) : S ? Y(t, T) : Y(t, ...T), b.options.autoUpdate && b.update();
              },
              configurable: !1,
              enumerable: !0
            });
          }
        }
        _draw() {
          const I = this.program;
          I.meshData.forEach((o, G) => {
            const {
              positions: d,
              cells: t,
              instanceCount: s,
              cellsCount: b,
              attributes: h,
              uniforms: S,
              textureCoord: Y,
              enableBlend: T
            } = o, y = this.gl;
            let J = o.mode != null ? o.mode : y.TRIANGLES;
            typeof J == "string" && (J = y[J]), T ? y.enable(y.BLEND) : y.disable(y.BLEND), y.bindBuffer(y.ARRAY_BUFFER, I._buffers.verticesBuffer), y.bufferData(y.ARRAY_BUFFER, d, y.STATIC_DRAW), t && (y.bindBuffer(y.ELEMENT_ARRAY_BUFFER, I._buffers.cellsBuffer), y.bufferData(y.ELEMENT_ARRAY_BUFFER, t, y.STATIC_DRAW));
            const N = [];
            h && Object.values(h).forEach(({
              name: R,
              data: z,
              divisor: Q
            }) => {
              if (y.bindBuffer(y.ARRAY_BUFFER, I._buffers[R]), y.bufferData(y.ARRAY_BUFFER, z, y.STATIC_DRAW), Q != null) {
                const P = y.getAttribLocation(I, R);
                P >= 0 && (y.enableVertexAttribArray(P), N.push(P), y.vertexAttribDivisor ? y.vertexAttribDivisor(P, Q) : this.aia_ext && this.aia_ext.vertexAttribDivisorANGLE(P, Q));
              }
            }), S && Object.entries(S).forEach(([R, z]) => {
              this.uniforms[R] = z;
            });
            let x;
            if (!t) {
              const R = I._dimension;
              x = d.length / R;
            }
            if (I._enableTextures && I._buffers.texCoordBuffer) {
              const R = Y || e(d, I._dimension);
              y.bindBuffer(y.ARRAY_BUFFER, I._buffers.texCoordBuffer), y.bufferData(y.ARRAY_BUFFER, p.FLOAT(R), y.STATIC_DRAW);
            }
            s != null ? (t ? y.drawElementsInstanced ? y.drawElementsInstanced(J, b, y.UNSIGNED_SHORT, 0, s) : this.aia_ext && this.aia_ext.drawElementsInstancedANGLE(J, b, y.UNSIGNED_SHORT, 0, s) : y.drawArraysInstanced ? y.drawArraysInstanced(J, 0, x, s) : this.aia_ext.drawArraysInstancedANGLE(J, 0, x, s), N.forEach((R) => {
              y.vertexAttribDivisor ? y.vertexAttribDivisor(R, null) : this.aia_ext && this.aia_ext.vertexAttribDivisorANGLE(R, null);
            })) : t ? y.drawElements(J, b, y.UNSIGNED_SHORT, 0) : y.drawArrays(J, 0, x);
          });
        }
        get isWebGL2() {
          return typeof WebGL2RenderingContext < "u" && this.gl instanceof WebGL2RenderingContext;
        }
        get enableTextures() {
          return this.program && this.program._enableTextures;
        }
        get uniforms() {
          const I = this.program;
          if (!I || !I.uniforms)
            throw Error("No avaliable program.");
          return I.uniforms;
        }
        deleteProgram(I) {
          const o = this.gl;
          this.program === I && (this.startRender = !1, this._renderFrameID && (cancelAnimationFrame(this._renderFrameID), delete this._renderFrameID), o.useProgram(null));
          const G = this.programs.indexOf(I);
          G >= 0 && this.programs.splice(G, 1), r(o, I), o.deleteProgram(I);
        }
        /**
          [{
            positions: ...
            cells: ...
            textureCoord: ...
            attributes: {name: {data:..., normalize: true}},
            uniforms: ...
          }]
         */
        setMeshData(I) {
          Array.isArray(I) || (I = [I]);
          const o = this.program;
          o.meshData = I.map(({
            mode: G,
            positions: d,
            instanceCount: t,
            cells: s,
            cellsCount: b,
            attributes: h,
            uniforms: S,
            textureCoord: Y,
            enableBlend: T
          }) => {
            const y = {
              positions: p.FLOAT(d),
              uniforms: S,
              enableBlend: !!T,
              textureCoord: p.FLOAT(Y)
            };
            if (s && (y.cells = p.USHORT(s), y.cellsCount = b || y.cells.length), G != null && (y.mode = G), t != null) {
              if (!this.isWebGL2 && !this.aia_ext)
                throw new Error("Cannot use instanceCount in this rendering context, use webgl2 context instead.");
              y.instanceCount = t;
            }
            if (h) {
              const J = {};
              Object.entries(h).forEach(([N, x]) => {
                if (!o._attribute[N])
                  o._attribute[N] = "ignored";
                else if (o._attribute[N] !== "ignored") {
                  const {
                    name: R,
                    type: z
                  } = o._attribute[N];
                  let Q = x.data || x;
                  if (Array.isArray(Q) && (Q = p[z](Q)), J[N] = {
                    name: R,
                    data: Q
                  }, x.divisor != null) {
                    if (!this.isWebGL2 && !this.aia_ext)
                      throw new Error("Cannot use divisor in this rendering context, use webgl2 context instead.");
                    J[N].divisor = x.divisor;
                  }
                }
              }), y.attributes = J;
            }
            return y;
          }), this.options.autoUpdate && this.update();
        }
        createProgram(I, o) {
          const G = /^\s*uniform\s+sampler/mg.test(I);
          I == null && (I = L.default), o == null && (o = G ? K.default : m.default);
          const d = this.gl, t = Object(c.createProgram)(d, o, I);
          t.shaderText = {
            vertexShader: o,
            fragmentShader: I
          }, t._buffers = {}, t._attribute = {}, t.uniforms = {}, t._samplerMap = {}, t._bindTextures = [];
          const s = new RegExp(`(?:attribute|in) vec(\\d) ${this.options.vertexPosition}`, "im");
          let b = o.match(s);
          b && (t._dimension = Number(b[1]));
          const h = new RegExp(`(?:attribute|in) vec(\\d) ${this.options.vertexTextureCoord}`, "im");
          b = o.match(h), b && (t._texCoordSize = Number(b[1]));
          const S = /^\s*(?:attribute|in) (\w+?)(\d*) (\w+)/gim;
          if (b = o.match(S), b)
            for (let y = 0; y < b.length; y++) {
              const J = /^\s*(?:attribute|in) (\w+?)(\d*) (\w+)/im, N = b[y].match(J);
              if (N && N[3] !== this.options.vertexPosition && N[3] !== this.options.vertexTextureCoord) {
                let [, x, R, z] = N;
                x === "mat" && (R **= 2), t._buffers[z] = d.createBuffer(), t._attribute[z] = {
                  name: z,
                  type: x,
                  size: Number(R) || 1
                };
              }
            }
          const Y = /^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/mg;
          b = o.match(Y) || [], b = b.concat(I.match(Y) || []), b.forEach((y) => {
            const J = y.match(/^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/);
            let [N, x, R] = J.slice(1);
            N = W[N], R = !!R, N.indexOf("Matrix") !== 0 && R && (N += "v"), this._declareUniform(t, x, N);
          }), t._buffers.verticesBuffer = d.createBuffer(), t._buffers.cellsBuffer = d.createBuffer();
          const T = d.getAttribLocation(t, this.options.vertexTextureCoord);
          return t._enableTextures = T >= 0, t._enableTextures && (t._buffers.texCoordBuffer = d.createBuffer()), this.programs.push(t), t;
        }
        useProgram(I, o = {}) {
          this.startRender = !1, this._renderFrameID && (cancelAnimationFrame(this._renderFrameID), delete this._renderFrameID);
          const G = this.gl;
          G.useProgram(I);
          const d = I._dimension;
          G.bindBuffer(G.ARRAY_BUFFER, I._buffers.verticesBuffer);
          const t = G.getAttribLocation(I, this.options.vertexPosition);
          if (G.vertexAttribPointer(t, d, G.FLOAT, !1, 0, 0), G.enableVertexAttribArray(t), I._enableTextures) {
            G.bindBuffer(G.ARRAY_BUFFER, I._buffers.texCoordBuffer);
            const s = G.getAttribLocation(I, this.options.vertexTextureCoord);
            G.vertexAttribPointer(s, I._texCoordSize || 2, G.FLOAT, !1, 0, 0), G.enableVertexAttribArray(s);
          }
          if (Object.entries(I._attribute).forEach(([s, b]) => {
            if (b !== "ignored") {
              const h = b.size, S = o[s] || {}, Y = !!S.normalize;
              let T = S.type || "FLOAT";
              const y = S.key || s;
              T === "UBYTE" && (T = "UNSIGNED_BYTE"), T === "USHORT" && (T = "UNSIGNED_SHORT"), b.type = T, y && y !== s && (I._attribute[y] = b), G.bindBuffer(G.ARRAY_BUFFER, I._buffers[s]);
              const J = G.getAttribLocation(I, s);
              J >= 0 && (G.vertexAttribPointer(J, h, G[T], Y, 0, 0), G.enableVertexAttribArray(J));
            }
          }), !I.meshData) {
            const s = [[-1, -1, 0, 1].slice(0, d), [1, -1, 0, 1].slice(0, d), [1, 1, 0, 1].slice(0, d), [-1, 1, 0, 1].slice(0, d)], b = [[0, 1, 3], [3, 1, 2]];
            this.setMeshData({
              positions: s,
              cells: b
            });
          }
          return I;
        }
        compileSync(I, o) {
          I = I || L.default;
          const G = {};
          function d(h) {
            h = h.replace(/^\s*/mg, "");
            const S = [], Y = h.match(/^#pragma\s+include\s+.*/mg);
            if (Y) {
              for (let T = 0; T < Y.length; T++) {
                const J = Y[T].match(/(?:<|")(.*)(?:>|")/);
                if (J) {
                  const N = J[0].indexOf("<") === 0 ? "lib" : "link";
                  let x = J[1];
                  if (x === "graph" && (x = "graphics"), G[x])
                    S.push(`/* included ${x} */`);
                  else if (G[x] = !0, N === "lib") {
                    const R = d(a[x]);
                    S.push(R);
                  } else if (N === "link")
                    throw new Error("Cannot load external links synchronously. Use compile instead of compileSync.");
                }
              }
              S.forEach((T) => {
                h = h.replace(/^#pragma\s+include\s+.*/m, T);
              });
            }
            return h;
          }
          const t = d(I), s = o ? d(o) : null;
          return this.createProgram(t, s);
        }
        async compile(I, o) {
          I = I || L.default;
          const G = {};
          async function d(h) {
            h = h.replace(/^\s*/mg, "");
            const S = [], Y = h.match(/^#pragma\s+include\s+.*/mg);
            if (Y) {
              for (let T = 0; T < Y.length; T++) {
                const J = Y[T].match(/(?:<|")(.*)(?:>|")/);
                if (J) {
                  const N = J[0].indexOf("<") === 0 ? "lib" : "link";
                  let x = J[1];
                  if (x === "graph" && (x = "graphics"), G[x])
                    S.push(`/* included ${x} */`);
                  else if (G[x] = !0, N === "lib") {
                    const R = await d(a[x]);
                    S.push(R);
                  } else if (N === "link") {
                    let R = await p.fetchShader(x);
                    R = await d(R), S.push(R);
                  }
                }
              }
              S.forEach((T) => {
                h = h.replace(/^#pragma\s+include\s+.*/m, T);
              });
            }
            return h;
          }
          const t = await d(I), s = o ? await d(o) : null;
          return this.createProgram(t, s);
        }
        async load(I, o = null) {
          return I = await p.fetchShader(I), o && (o = await p.fetchShader(o)), this.compile(I, o);
        }
        createTexture(I = null, {
          wrapS: o = this.gl.CLAMP_TO_EDGE,
          wrapT: G = this.gl.CLAMP_TO_EDGE,
          minFilter: d = this.gl.LINEAR,
          magFilter: t = this.gl.LINEAR
        } = {}) {
          const s = this.gl, b = Array.isArray(I) ? s.TEXTURE_CUBE_MAP : s.TEXTURE_2D;
          this._max_texture_image_units = this._max_texture_image_units || s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS), s.activeTexture(s.TEXTURE0 + this._max_texture_image_units - 1);
          const h = s.createTexture();
          s.bindTexture(b, h), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !0);
          const {
            width: S,
            height: Y
          } = this.canvas;
          if (I)
            if (b === s.TEXTURE_CUBE_MAP)
              for (let T = 0; T < 6; T++)
                s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + T, 0, s.RGBA, s.RGBA, s.UNSIGNED_BYTE, I[T]);
            else
              s.texImage2D(b, 0, s.RGBA, s.RGBA, s.UNSIGNED_BYTE, I);
          else if (b === s.TEXTURE_CUBE_MAP)
            for (let T = 0; T < 6; T++)
              this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + T, 0, s.RGBA, S, Y, 0, s.RGBA, s.UNSIGNED_BYTE, null);
          else
            s.texImage2D(b, 0, s.RGBA, S, Y, 0, s.RGBA, s.UNSIGNED_BYTE, null);
          return s.texParameteri(b, s.TEXTURE_MIN_FILTER, d), s.texParameteri(b, s.TEXTURE_MAG_FILTER, t), s.texParameteri(b, s.TEXTURE_WRAP_S, o), s.texParameteri(b, s.TEXTURE_WRAP_T, G), b === s.TEXTURE_CUBE_MAP && (I.width = I[0].width, I.height = I[0].height), s.bindTexture(b, null), h._img = I || {
            width: S,
            height: Y
          }, h.delete = () => {
            this.deleteTexture(h);
          }, h;
        }
        deleteTexture(I) {
          const o = I._img;
          this.gl.deleteTexture(I), typeof o.close == "function" && o.close();
        }
        async loadTexture(I, {
          useImageBitmap: o = !0
        } = {}) {
          const G = await p.loadImage(I, {
            useImageBitmap: o
          });
          return this.createTexture(G);
        }
        createFBO({
          color: I = 1,
          blend: o = !1,
          depth: G = this.options.depth !== !1,
          stencil: d = !!this.options.stencil
        } = {}) {
          const t = this.gl, s = t.createFramebuffer();
          t.bindFramebuffer(t.FRAMEBUFFER, s);
          const b = [];
          for (let Y = 0; Y < I; Y++) {
            const T = this.createTexture();
            t.framebufferTexture2D(
              t.FRAMEBUFFER,
              t.COLOR_ATTACHMENT0 + Y,
              t.TEXTURE_2D,
              T,
              0
              /* level */
            ), b.push(T);
          }
          s.textures = b, s.texture = b[0], s.blend = o;
          const {
            width: h,
            height: S
          } = this.canvas;
          return G && !d && (s.depthBuffer = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, s.depthBuffer), t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_COMPONENT16, h, S), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.RENDERBUFFER, s.depthBuffer)), d && !G && (s.stencilBuffer = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, s.stencilBuffer), t.renderbufferStorage(t.RENDERBUFFER, t.STENCIL_INDEX8, h, S), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.STENCIL_ATTACHMENT, t.RENDERBUFFER, s.stencilBuffer)), G && d && (s.depthStencilBuffer = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, s.depthStencilBuffer), t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_STENCIL, h, S), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.RENDERBUFFER, s.depthStencilBuffer)), t.bindFramebuffer(t.FRAMEBUFFER, null), s;
        }
        bindFBO(I = null) {
          this.fbo = I;
        }
        render({
          clearBuffer: I = !0
        } = {}) {
          this.startRender = !0;
          const o = this.gl;
          let G = this.program;
          G || (G = this.createProgram(), this.useProgram(G)), this.fbo && o.bindFramebuffer(o.FRAMEBUFFER, this.fbo);
          const d = this.options.depth;
          d && o.enable(o.DEPTH_TEST), this.gl.clear(this.gl.COLOR_BUFFER_BIT | (d ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.options.stencil ? this.gl.STENCIL_BUFFER_BIT : 0));
          const t = this._renderFrameID;
          this._draw(), this.fbo && o.bindFramebuffer(o.FRAMEBUFFER, null), this._renderFrameID === t && (this._renderFrameID = null);
        }
        update() {
          this.startRender && this._renderFrameID == null && (this._renderFrameID = requestAnimationFrame(this.render.bind(this)));
        }
      }
      u(p, "defaultOptions", {
        preserveDrawingBuffer: !0,
        autoUpdate: !0,
        vertexPosition: "a_vertexPosition",
        vertexTextureCoord: "a_vertexTextureCoord",
        webgl2: !1
      }), u(p, "UBYTE", p.UNSIGNED_BYTE), u(p, "USHORT", p.UNSIGNED_SHORT), u(p, "fetchShader", c.fetchShader), u(p, "loadImage", c.loadImage);
    },
    /* 16 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "setupWebGL", function() {
        return m;
      }), i.d(l, "createProgram", function() {
        return L;
      }), i.d(l, "pointsToBuffer", function() {
        return K;
      }), i.d(l, "loadImage", function() {
        return a;
      }), i.d(l, "fetchShader", function() {
        return r;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(X, W) {
        const p = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        let C = null;
        for (let I = 0; I < p.length; ++I) {
          try {
            C = X.getContext(p[I], W);
          } catch {
          }
          if (C)
            break;
        }
        return C;
      }
      function m(X, W) {
        const p = c(X, W);
        if (!p)
          throw new Error("Sorry, your browser doesn't support WebGL.");
        return p;
      }
      function L(X, W, p) {
        const C = X.createShader(X.VERTEX_SHADER);
        if (X.shaderSource(C, W), X.compileShader(C), !X.getShaderParameter(C, X.COMPILE_STATUS)) {
          const G = `Vertex shader failed to compile.  The error log is:${X.getShaderInfoLog(C)}`;
          throw new Error(G);
        }
        const I = X.createShader(X.FRAGMENT_SHADER);
        if (X.shaderSource(I, p), X.compileShader(I), !X.getShaderParameter(I, X.COMPILE_STATUS)) {
          const G = `Fragment shader failed to compile.  The error log is:${X.getShaderInfoLog(I)}`;
          throw new Error(G);
        }
        const o = X.createProgram();
        if (X.attachShader(o, C), X.attachShader(o, I), X.linkProgram(o), !X.getProgramParameter(o, X.LINK_STATUS)) {
          const G = `Shader program failed to link.  The error log is:${X.getProgramInfoLog(o)}`;
          throw new Error(G);
        }
        return X.deleteShader(C), X.deleteShader(I), o;
      }
      function K(X, W = Float32Array, p = null) {
        if (p && !(p instanceof W))
          throw new TypeError("Wrong buffer type.");
        if (X == null || X instanceof W)
          return X;
        if (X[0] == null || X[0].length == null)
          return p ? (p.set(X, 0), p) : new W(X);
        const C = X[0].length, I = X.length;
        p || (p = new W(C * I));
        let o = 0;
        for (let G = 0; G < I; G++)
          for (let d = 0; d < C; d++)
            p[o++] = X[G][d];
        return p;
      }
      const u = {};
      function a(X, {
        useImageBitmap: W = !0,
        alias: p = null
      } = {}) {
        if (!u[X]) {
          if (typeof Image == "function") {
            const C = new Image();
            typeof X == "string" && !(typeof location == "object" && /^file:/.test(location.href)) && !/^data:/.test(X) && (C.crossOrigin = "anonymous"), u[X] = new Promise((I) => {
              C.onload = function() {
                W && typeof createImageBitmap == "function" ? createImageBitmap(C, {
                  imageOrientation: "flipY"
                }).then((o) => {
                  u[X] = o, p && (u[p] = o), I(o);
                }) : (u[X] = C, p && (u[p] = C), I(C));
              }, C.src = X;
            }), p && (u[p] = u[X]);
          } else if (typeof fetch == "function")
            return fetch(X, {
              method: "GET",
              mode: "cors",
              cache: "default"
            }).then((C) => C.blob()).then((C) => createImageBitmap(C, {
              imageOrientation: "flipY"
            }).then((I) => (u[X] = I, p && (u[p] = I), I)));
        }
        return u[X];
      }
      const e = {};
      async function r(X) {
        if (e[X])
          return e[X];
        const W = await fetch(X);
        if (W.status >= 200 && W.status < 300) {
          const p = await W.text();
          return e[X] = p, p;
        }
        throw new Error("Shader loaded error.");
      }
    },
    /* 17 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `attribute vec3 a_vertexPosition;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(a_vertexPosition, 1);
}`;
    },
    /* 18 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `#ifdef GL_ES
precision mediump float;
#endif

void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
}`;
    },
    /* 19 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `attribute vec4 a_vertexPosition;
attribute vec2 a_vertexTextureCoord;
varying vec2 vTextureCoord;

void main() {
  gl_PointSize = 1.0;
  gl_Position = a_vertexPosition;
  vTextureCoord = a_vertexTextureCoord;
}`;
    },
    /* 20 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return K;
      });
      var c = i(21), m = i(25);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = Symbol("transform");
      class K {
        constructor(a, e) {
          this.context = a.getContext("2d"), this.options = e, this[L] = [1, 0, 0, 1, 0, 0];
        }
        createTexture(a) {
          return {
            _img: a
          };
        }
        async loadTexture(a) {
          const e = await c.default.loadImage(a, {
            useImageBitmap: !1
          });
          return this.createTexture(e);
        }
        deleteTexture(a) {
          return a;
        }
        clear(a, e, r, X) {
          const W = this.context;
          a = a || 0, e = e || 0, r = r || W.canvas.width - a, X = X || W.canvas.height - e, W.clearRect(a, e, r, X);
        }
        drawMeshCloud(a, {
          clear: e = !1
        } = {}) {
          const r = [];
          for (let X = 0; X < a.amount; X++) {
            const W = a.getTransform(X);
            let p = a.getTextureFrame(X);
            p && (p = p._img);
            const C = a.getFilter(X), {
              fill: I,
              stroke: o
            } = a.getCloudRGBA(X);
            r.push({
              mesh: a.mesh,
              _cloudOptions: [I, o, p, W, C]
            });
          }
          a.beforeRender && a.beforeRender(this.context, a), this.drawMeshes(r, {
            clear: e,
            hook: !1
          }), a.afterRender && a.afterRender(this.context, a);
        }
        drawMeshes(a, {
          clear: e = !1,
          hook: r = !0
        } = {}) {
          const X = this.context;
          e && X.clearRect(0, 0, X.canvas.width, X.canvas.height);
          let W = null;
          const {
            width: p,
            height: C
          } = X.canvas, I = a.length;
          a.forEach((o, G) => {
            let d, t, s, b, h;
            r && o.beforeRender && o.beforeRender(X, o), o._cloudOptions && ([d, t, s, b, h] = o._cloudOptions, o = o.mesh);
            let S = o.filter;
            if (h && (S = S ? `${S} ${h}` : h), S && !this.filterBuffer && this.filterBuffer !== !1) {
              const Y = c.default.createCanvas(p, C);
              Y ? this.filterBuffer = Y.getContext("2d") : this.filterBuffer = !1;
            }
            W && W !== S && (Object(m.applyFilter)(this.filterBuffer, W), X.drawImage(this.filterBuffer.canvas, 0, 0, p, C), this.filterBuffer.clearRect(0, 0, p, C), W = null), S && this.filterBuffer ? (this.filterBuffer.save(), this.filterBuffer.transform(...this[L]), Object(m.drawMesh2D)(o, this.filterBuffer, !1, d, t, s, b), this.filterBuffer.restore(), G === I - 1 ? (Object(m.applyFilter)(this.filterBuffer, S), X.drawImage(this.filterBuffer.canvas, 0, 0, p, C), this.filterBuffer.clearRect(0, 0, p, C)) : W = S) : (X.save(), X.transform(...this[L]), Object(m.drawMesh2D)(o, X, !1, d, t, s, b), X.restore()), r && o.afterRender && o.afterRender(X, o);
          });
        }
        setTransform(a) {
          this[L] = a;
        }
      }
    },
    /* 21 */
    /***/
    function(n, l, i) {
      i.r(l), (function(c) {
        var m = i(14), L = i(23), K = i(24);
        i(1).glMatrix.setMatrixArrayType(Array);
        const u = {};
        function a(p, C) {
          const {
            style: I,
            variant: o,
            weight: G,
            stretch: d,
            size: t,
            pxLineHeight: s,
            family: b
          } = p;
          return d === "normal" ? `${I} ${o} ${G} ${t * C}px/${s * C}px ${b}` : `${I} ${o} ${G} ${d} ${t * C}px/${s * C}px ${b}`;
        }
        function e(p, {
          font: C,
          fillColor: I,
          strokeColor: o,
          strokeWidth: G,
          ratio: d = 1,
          textCanvas: t,
          cachable: s = !1
        }) {
          let b;
          if (s) {
            b = [p, C, String(I), String(o), String(G)].join("###");
            const Q = u[b];
            if (Q)
              return Q;
          }
          t || (t = X(1, 1));
          const h = t.getContext("2d");
          h.save(), h.font = C;
          let {
            width: S
          } = h.measureText(p);
          h.restore();
          const Y = Object(L.default)(C), T = Math.max(Y.pxLineHeight, Y.pxHeight * 1.13);
          /italic|oblique/.test(C) && (S += T * Math.tan(15 * Math.PI / 180)), !I && !o && (I = "#000");
          const y = h.canvas, J = Math.ceil(S), N = Math.ceil(T);
          y.width = Math.round(J * d), y.height = Math.round(N * d), h.save(), h.font = a(Y, d), h.textAlign = "center", h.textBaseline = "middle";
          const x = y.height * 0.5 + Y.pxHeight * 0.05 * d, R = y.width * 0.5;
          if (I) {
            if (Array.isArray(I))
              I = Object(K.default)(I);
            else if (I.vector) {
              let Q;
              const {
                vector: P,
                colors: D
              } = I;
              P.length === 6 ? Q = h.createRadialGradient(...P) : Q = h.createLinearGradient(...P), D.forEach(({
                offset: _,
                color: F
              }) => {
                Q.addColorStop(_, F);
              }), I = Q;
            }
            h.fillStyle = I, h.fillText(p, R, x);
          }
          if (o) {
            if (h.lineWidth = G * d, Array.isArray(o))
              o = Object(K.default)(o);
            else if (o.vector) {
              let Q;
              const {
                vector: P,
                colors: D
              } = o;
              P.length === 6 ? Q = h.createRadialGradient(...P) : Q = h.createLinearGradient(...P), D.forEach(({
                offset: _,
                color: F
              }) => {
                Q.addColorStop(_, F);
              }), o = Q;
            }
            h.strokeStyle = o, h.strokeText(p, R, x);
          }
          h.restore();
          const z = {
            image: t,
            rect: [0, 0, J, N]
          };
          return s && (u[b] = z), z;
        }
        let r = !1;
        if (typeof navigator == "object" && typeof navigator.userAgent == "string") {
          const p = navigator.userAgent.toLowerCase().match(/chrome\/(\d+)/);
          p && (r = Number(p[1]) < 70);
        }
        function X(p, C, I = {}) {
          const o = I.offscreen || !r && I.offscreen !== !1;
          let G;
          return typeof c < "u" && typeof c.createCanvas == "function" ? G = c.createCanvas(p, C, I) : o && typeof OffscreenCanvas == "function" ? G = new OffscreenCanvas(p, C) : (G = document.createElement("canvas"), G.width = p, G.height = C), G;
        }
        const W = {
          createCanvas: X,
          createText: e,
          loadImage: m.default.loadImage
        };
        l.default = W;
      }).call(this, i(22));
    },
    /* 22 */
    /***/
    function(n, l) {
      var i;
      i = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        i = i || new Function("return this")();
      } catch {
        typeof window == "object" && (i = window);
      }
      n.exports = i;
    },
    /* 23 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return I;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(o, G) {
        if (typeof o == "string") {
          const s = o.trim().match(/^([\d.]+)(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin|%)$/);
          s ? o = {
            size: parseFloat(s[1]),
            unit: s[2]
          } : o = {
            size: parseInt(o, 10),
            unit: "px"
          };
        }
        let {
          size: d,
          unit: t
        } = o;
        if (t === "pt")
          d /= 0.75;
        else if (t === "pc")
          d *= 16;
        else if (t === "in")
          d *= 96;
        else if (t === "cm")
          d *= 96 / 2.54;
        else if (t === "mm")
          d *= 96 / 25.4;
        else if (t === "em" || t === "rem" || t === "ex") {
          if (!G && typeof getComputedStyle == "function" && typeof document < "u") {
            const s = getComputedStyle(document.documentElement).fontSize;
            G = c(s, 16);
          }
          d *= G, t === "ex" && (d /= 2);
        } else if (t === "q")
          d *= 96 / 25.4 / 4;
        else if (t === "vw" || t === "vh") {
          if (typeof document < "u") {
            const s = t === "vw" ? document.documentElement.clientWidth : document.documentElement.clientHeight;
            d *= s / 100;
          }
        } else if ((t === "vmax" || t === "vmin") && typeof document < "u") {
          const s = document.documentElement.clientWidth, b = document.documentElement.clientHeight;
          t === "vmax" ? d *= Math.max(s, b) / 100 : d *= Math.min(s, b) / 100;
        }
        return d;
      }
      const m = "bold|bolder|lighter|[1-9]00", L = "italic|oblique", K = "small-caps", u = "ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded", a = "px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin|%", e = `'([^']+)'|"([^"]+)"|([\\w-]|[一-龥])+`, r = new RegExp(`(${m}) +`, "i"), X = new RegExp(`(${L}) +`, "i"), W = new RegExp(`(${K}) +`, "i"), p = new RegExp(`(${u}) +`, "i"), C = new RegExp("([\\d\\.]+)(" + a + ")(?:\\/([\\d\\.]+)(" + a + "))? *((?:" + e + ")( *, *(?:" + e + "))*)");
      function I(o, G) {
        const d = C.exec(o);
        if (!d)
          return;
        const t = parseFloat(d[3]), s = {
          weight: "normal",
          style: "normal",
          stretch: "normal",
          variant: "normal",
          size: parseFloat(d[1]),
          unit: d[2],
          lineHeight: Number.isFinite(t) ? t : void 0,
          lineHeightUnit: d[4],
          family: d[5].replace(/ *, */g, ",")
        }, b = o.substring(0, d.index), h = r.exec(b), S = X.exec(b), Y = W.exec(b), T = p.exec(b);
        return h && (s.weight = h[1]), S && (s.style = S[1]), Y && (s.variant = Y[1]), T && (s.stretch = T[1]), s.pxHeight = c({
          size: s.size,
          unit: s.unit
        }, G), s.pxLineHeight = c({
          size: s.lineHeight || s.size,
          unit: s.lineHeightUnit || s.unit
        }, G), s;
      }
    },
    /* 24 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return c;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(m) {
        return `rgba(${m.map((L, K) => K < 3 ? Math.round(L * 255) : L).join()})`;
      }
    },
    /* 25 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "applyFilter", function() {
        return u;
      }), i.d(l, "drawMesh2D", function() {
        return e;
      });
      var c = i(1), m = i(24), L = i(23), K = i(26);
      i(1).glMatrix.setMatrixArrayType(Array);
      function u(r, X) {
        const W = r.canvas;
        r.save(), r.filter = X, r.drawImage(W, 0, 0, W.width, W.height), r.restore();
      }
      function a(r, X) {
        const W = /rgba\((\d+),(\d+),(\d+),(\d+)\)/;
        r = r.match(W).slice(1, 5).map(Number), X = X.match(W).slice(1, 5).map(Number);
        const p = [], C = X[3];
        for (let I = 0; I < 4; I++)
          p[I] = Object(K.mix)(r[I], X[I], C);
        return `rgba(${p.join()})`;
      }
      function e(r, X, W = !0, p = null, C = null, I = null, o = null) {
        X.save();
        let G = !1, d = !1;
        if (X.globalAlpha = r.getOpacity(), r._updateMatrix && r.transformScale / r.contours.scale > 1.5 && r.accurate(r.transformScale), r.lineWidth) {
          let b = r.gradient && r.gradient.stroke;
          if (b) {
            const {
              vector: h,
              colors: S
            } = b;
            if (h.length === 6)
              b = X.createRadialGradient(...h);
            else if (h.length === 4)
              b = X.createLinearGradient(...h);
            else if (h.length === 3)
              b = X.createCircularGradient(...h);
            else
              throw new TypeError("Invalid vector dimension.");
            S.forEach(({
              offset: Y,
              color: T
            }) => {
              let y = Object(m.default)(T);
              C && (y = a(y, C)), b.addColorStop(Y, y);
            }), X.strokeStyle = b, G = !0;
          } else
            r.strokeStyle && (C ? X.strokeStyle = a(r.strokeStyle, C) : X.strokeStyle = r.strokeStyle, G = !0);
        }
        G && (X.lineWidth = r.lineWidth, X.lineJoin = r.lineJoin, X.lineCap = r.lineCap, X.miterLimit = r.miterLimit, r.lineDash && (X.setLineDash(r.lineDash), r.lineDashOffset && (X.lineDashOffset = r.lineDashOffset)));
        let t = r.gradient && r.gradient.fill;
        if (t) {
          const {
            vector: b,
            colors: h
          } = t;
          if (b.length === 6)
            t = X.createRadialGradient(...b);
          else if (b.length === 4)
            t = X.createLinearGradient(...b);
          else if (b.length === 3)
            t = X.createCircularGradient(...b);
          else
            throw new TypeError("Invalid vector dimension.");
          h.forEach(({
            offset: S,
            color: Y
          }) => {
            let T = Object(m.default)(Y);
            C && (T = a(T, C)), t.addColorStop(S, T);
          }), X.fillStyle = t, d = !0;
        } else
          r.fillStyle && (p ? X.fillStyle = a(r.fillStyle, p) : X.fillStyle = r.fillStyle, d = !0);
        if (o && X.transform(...o), X.transform(...r.transformMatrix), r.clipPath) {
          const b = r.clipPath, h = new Path2D(b);
          X.clip(h);
        }
        const s = r.contours.length;
        if (r.contours.forEach((b, h) => {
          const S = b.length, Y = S > 1 && c.vec2.equals(b[0], b[S - 1]), T = h === s - 1 && r.texture;
          if (b && S > 0) {
            if (d || G || T) {
              X.beginPath(), X.moveTo(...b[0]);
              for (let y = 1; y < S; y++)
                y === S - 1 && Y ? X.closePath() : X.lineTo(...b[y]);
            }
            if (d && X.fill(r.fillRule), T) {
              X.save(), X.clip();
              let {
                image: y,
                options: J
              } = r.texture;
              if (I && (y = I), J.repeat && console.warn("Context 2D not supported image repeat yet."), y.font) {
                J.scale && console.warn("Context 2D not supported text scale yet."), J.srcRect && console.warn("Context 2D not supported text srcRect yet.");
                let {
                  font: N,
                  fillColor: x,
                  strokeColor: R,
                  strokeWidth: z,
                  text: Q
                } = y;
                !x && !R && (x = "#000"), Array.isArray(x) && (x = Object(m.default)(x)), Array.isArray(R) && (R = Object(m.default)(R)), X.font = N;
                const {
                  width: P
                } = X.measureText(Q), D = Object(L.default)(N), _ = Math.max(D.pxLineHeight, D.pxHeight * 1.13);
                X.textAlign = "center", X.textBaseline = "middle";
                const F = J.rect, v = F[0] + _ * 0.5 + D.pxHeight * 0.06, O = F[1] + P * 0.5;
                F[2] != null && X.scale(F[2] / P, F[3] / _), x && (X.fillStyle = x, X.fillText(Q, O, v)), R && (X.lineWidth = z, X.strokeStyle = R, X.strokeText(Q, O, v));
              } else {
                let N = J.rect;
                const x = J.srcRect;
                J.scale && (N = [0, 0, X.canvas.width, X.canvas.height]), J.rotated && N && (N = [-N[1], N[0], N[3], N[2]]), x && (N = N || [0, 0, x[2], x[3]]), J.rotated && (X.translate(0, N ? N[2] : y.width), X.rotate(-0.5 * Math.PI)), x ? X.drawImage(y, ...x, ...N) : N ? X.drawImage(y, ...N) : X.drawImage(y, 0, 0);
              }
              X.restore();
            }
            G && X.stroke();
          }
        }), X.restore(), W) {
          const b = r.filter;
          b && u(X, b);
        }
      }
    },
    /* 26 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "clamp", function() {
        return c;
      }), i.d(l, "mix", function() {
        return m;
      }), i.d(l, "transformPoint", function() {
        return L;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(K, u, a) {
        return u > a && ([u, a] = [a, u]), K < u ? u : K > a ? a : K;
      }
      function m(K, u, a) {
        return K * (1 - a) + u * a;
      }
      function L(K, u) {
        const [a, e] = K;
        return [a * u[0] + e * u[2] + u[4], a * u[1] + e * u[3] + u[5]];
      }
    },
    /* 27 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return a;
      });
      var c = i(28), m = i(29);
      i(1).glMatrix.setMatrixArrayType(Array);
      function L(e, r, X) {
        const W = e.uniforms || {}, p = r.uniforms || {};
        if (W.u_texSampler && p.u_texSampler && W.u_texSampler !== p.u_texSampler)
          return !1;
        const C = Object.keys(W), I = Object.keys(p), o = C.indexOf("u_texSampler"), G = I.indexOf("u_texSampler");
        if (o >= 0 && C.splice(o, 1), G >= 0 && I.splice(G, 1), C.length !== I.length)
          return !1;
        const d = C.every((t) => {
          const s = W[t], b = p[t];
          if (s === b)
            return !0;
          if (s.length && b.length && s.length === b.length) {
            for (let h = 0; h < s.length; h++)
              if (s[h] !== b[h])
                return !1;
            return !0;
          }
          return !1;
        });
        if (d) {
          if (W.u_texSampler && !p.u_texSampler)
            r.setTexture(W.u_texSampler, {
              hidden: !0
            });
          else if (!W.u_texSampler && p.u_texSampler)
            for (let t = 0; t < X.length; t++)
              X[t].setTexture(p.u_texSampler, {
                hidden: !0
              });
        }
        return d;
      }
      const K = {};
      function u(e, r) {
        if (e.length) {
          const X = Object(c.default)(e, K);
          return X.enableBlend = r, e[0].filterCanvas && (X.filterCanvas = !0), X.packIndex = e[0].packIndex, X.packLength = e.length, X.beforeRender = e[0].beforeRender, X.pass = e[0].pass, X.afterRender = e[e.length - 1].afterRender, e.length = 0, X;
        }
      }
      function* a(e, r, X = !1) {
        const W = [], p = e.options.bufferSize;
        let C = 0, I = !1;
        for (let o = 0; o < r.length; o++) {
          const G = r[o];
          if (G instanceof m.default)
            W.length && (yield u(W, I)), C = 0, I = !1, yield G;
          else {
            const d = G.meshData;
            if (d.clipPath && !d.uniforms.u_clipSampler) {
              const s = e.createTexture(d.clipPath);
              d.uniforms.u_clipSampler = s;
            }
            let t = 0;
            if ((!X || !G.canIgnore()) && d && d.positions.length) {
              G.packIndex = o;
              const s = G.filterCanvas;
              if (t = d.positions.length, s || C + t > p)
                W.length && (yield u(W, I)), C = 0, I = !1;
              else if (C) {
                const b = W[W.length - 1];
                b && (b.filterCanvas || b.afterRender || G.beforeRender || b.pass.length || G.pass.length || b.program !== G.program || !L(b, G, W)) && (yield u(W, I), C = 0, I = !1);
              }
              W.push(G), I = I || G.enableBlend, C += t;
            }
            o === r.length - 1 && W.length && (yield u(W, I));
          }
        }
      }
    },
    /* 28 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return L;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      const c = {
        UNSIGNED_BYTE: Uint8Array,
        UNSIGNED_SHORT: Uint16Array,
        BYTE: Int8Array,
        SHORT: Int16Array,
        FLOAT: Float32Array
      };
      function m(K, u) {
        let a = 0, e = 0, r = 0, X = 0, W = 0, p = 0, C = 0;
        const I = K[0].program;
        for (let o = 0; o < K.length; o++) {
          const G = K[o].meshData;
          if (G) {
            C += G.positions.length;
            const d = G.positions[0].length;
            a += G.positions.length * d, e += G.cells.length * 3, p += G.attributes.a_color.length * 4;
            const t = G.textureCoord;
            t && (r += t.length * t[0].length);
            const s = G.attributes.a_sourceRect;
            s && (X += s.length * 4);
            const b = G.attributes.a_clipUV;
            b && (W += b.length * 2);
          }
        }
        if ((!u.positions || u.positions.length < a) && (u.positions = new Float32Array(a)), (!u.cells || u.cells.length < e) && (u.cells = new Uint16Array(e)), r && (!u.textureCoord || u.textureCoord.length < r) && (u.textureCoord = new Float32Array(r)), (!u.a_color || u.a_color.length < p) && (u.a_color = new Uint8Array(p)), X && (!u.a_sourceRect || u.a_sourceRect.length < X) && (u.a_sourceRect = new Float32Array(X)), W && (!u.a_clipUV || u.a_clipUV.length < W) && (u.a_clipUV = new Float32Array(W)), I) {
          const o = Object.entries(I._attribute), G = I._attribOpts || {};
          for (let d = 0; d < o.length; d++) {
            const [t, s] = o[d];
            if (t !== "a_color" && t !== "a_sourceRect" && s !== "ignored") {
              const b = G[t] ? G[t].type : "FLOAT", h = c[b], S = s.size * C;
              (!u[t] || u[t].length < S) && (u[t] = new h(S));
            }
          }
        }
        return u;
      }
      function L(K, u) {
        let a = [], e = [], r = [], X = [], W = [], p = [], C = 0, I = 0;
        const o = K[0] ? K[0].uniforms || {} : {}, G = K[0] ? K[0].program : null;
        u && (m(K, u), e = u.cells, a = u.positions, r = u.textureCoord, X = u.a_color, W = u.a_sourceRect, p = u.a_clipUV);
        let d = !1, t = !1;
        const s = {};
        for (let h = 0; h < K.length; h++) {
          let S = K[h];
          if (S) {
            if (S.meshData && (S = S.meshData), u) {
              const T = S.positions;
              for (let y = 0; y < T.length; y++) {
                const J = T[y], N = 3 * (C + y);
                for (let x = 0; x < J.length; x++)
                  a[N + x] = J[x];
              }
            } else
              a.push(...S.positions);
            const Y = S.cells;
            for (let T = 0; T < Y.length; T++) {
              const y = Y[T];
              if (u) {
                const J = 3 * (I + T);
                e[J] = y[0] + C, e[J + 1] = y[1] + C, e[J + 2] = y[2] + C;
              } else
                e.push([y[0] + C, y[1] + C, y[2] + C]);
            }
            if (u) {
              const T = S.attributes.a_color;
              for (let y = 0; y < T.length; y++) {
                const J = T[y], N = 4 * (C + y);
                X[N] = J[0], X[N + 1] = J[1], X[N + 2] = J[2], X[N + 3] = J[3];
              }
            } else
              X.push(...S.attributes.a_color);
            if (S.attributes.a_sourceRect)
              if (d = !0, u) {
                const T = S.attributes.a_sourceRect;
                for (let y = 0; y < T.length; y++) {
                  const J = T[y], N = 4 * (C + y);
                  W[N] = J[0], W[N + 1] = J[1], W[N + 2] = J[2], W[N + 3] = J[3];
                }
              } else
                W.push(...S.attributes.a_sourceRect);
            if (S.attributes.a_clipUV)
              if (t = !0, u) {
                const T = S.attributes.a_clipUV;
                for (let y = 0; y < T.length; y++) {
                  const J = T[y], N = 2 * (C + y);
                  p[N] = J[0], p[N + 1] = J[1];
                }
              } else
                p.push(...S.attributes.a_clipUV);
            if (S.textureCoord)
              if (u) {
                const T = S.textureCoord;
                for (let y = 0; y < T.length; y++) {
                  const J = T[y], N = 3 * (C + y);
                  for (let x = 0; x < J.length; x++)
                    r[N + x] = J[x];
                }
              } else
                r.push(...S.textureCoord);
            if (G) {
              const T = Object.entries(G._attribute);
              for (let y = 0; y < T.length; y++) {
                const [J, N] = T[y];
                if (J !== "a_color" && J !== "a_sourceRect" && N !== "ignored")
                  if (s[J] = [], u) {
                    s[J] = u[J];
                    const x = S.attributes[J], R = x[0].length;
                    for (let z = 0; z < x.length; z++) {
                      const Q = x[z], P = R * (C + z);
                      for (let D = 0; D < Q.length; D++)
                        s[J][P + D] = Q[D];
                    }
                  } else
                    s[J].push(...S.attributes[J]);
              }
            }
            C += S.positions.length, I += S.cells.length;
          }
        }
        s.a_color = X, d && W && W.length > 0 && (s.a_sourceRect = W);
        const b = {
          positions: a,
          cells: e,
          attributes: s,
          uniforms: o,
          cellsCount: I * 3,
          program: G
        };
        return r && r.length && (b.textureCoord = r), t && p.length > 0 && (s.a_clipUV = p), b;
      }
    },
    /* 29 */
    /***/
    function(n, l, i) {
      i.r(l);
      var c = i(1), m = i(30), L = i(26), K = i(31);
      i(1).glMatrix.setMatrixArrayType(Array);
      function u(s, b) {
        var h = Object.keys(s);
        if (Object.getOwnPropertySymbols) {
          var S = Object.getOwnPropertySymbols(s);
          b && (S = S.filter(function(Y) {
            return Object.getOwnPropertyDescriptor(s, Y).enumerable;
          })), h.push.apply(h, S);
        }
        return h;
      }
      function a(s) {
        for (var b = 1; b < arguments.length; b++) {
          var h = arguments[b] != null ? arguments[b] : {};
          b % 2 ? u(Object(h), !0).forEach(function(S) {
            e(s, S, h[S]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(h)) : u(Object(h)).forEach(function(S) {
            Object.defineProperty(s, S, Object.getOwnPropertyDescriptor(h, S));
          });
        }
        return s;
      }
      function e(s, b, h) {
        return b in s ? Object.defineProperty(s, b, { value: h, enumerable: !0, configurable: !0, writable: !0 }) : s[b] = h, s;
      }
      const r = Symbol("mesh"), X = Symbol("count"), W = Symbol("blend"), p = Symbol("filter"), C = Symbol("textures"), I = Symbol("textureOptions"), o = Symbol("cloudColor"), G = Symbol("cloudFilter"), d = Symbol("buffer");
      function t(s, b = null) {
        const h = new Float32Array(3 * s), S = new Float32Array(3 * s), Y = new Float32Array(4 * s), T = new Float32Array(4 * s), y = new Float32Array(4 * s), J = new Float32Array(4 * s), N = new Float32Array(4 * s), x = new Uint8Array(s), R = new Uint8Array(4 * s), z = new Uint8Array(4 * s);
        return b && (h.set(b.transform0, 0), S.set(b.transform1, 0), Y.set(b.color0, 0), T.set(b.color1, 0), y.set(b.color2, 0), J.set(b.color3, 0), N.set(b.color4, 0), x.set(b.frameIndex, 0), R.set(b.fillColor, 0), z.set(b.strokeColor, 0)), {
          bufferSize: s,
          transform0: h,
          transform1: S,
          color0: Y,
          color1: T,
          color2: y,
          color3: J,
          color4: N,
          frameIndex: x,
          fillColor: R,
          strokeColor: z
        };
      }
      l.default = class {
        constructor(s, b = 1, {
          buffer: h = 1e3
        } = {}) {
          h = Math.max(h, b), this[X] = b, this[r] = s, this[d] = t(h), this[C] = [], this[p] = [], this[o] = !1, this[G] = !1, this[W] = !1, this.initBuffer();
        }
        initBuffer(s = 0) {
          const b = this[X];
          for (let h = s; h < b; h++)
            this[d].transform0.set([1, 0, 0], h * 3), this[d].transform1.set([0, 1, 0], h * 3), this[d].frameIndex.set([-1], h), this[d].fillColor.set([0, 0, 0, 0], h * 4), this[d].strokeColor.set([0, 0, 0, 0], h * 4), this.setColorTransform(h, null);
        }
        get bufferSize() {
          return this[d].bufferSize;
        }
        get mesh() {
          return this[r];
        }
        set mesh(s) {
          this[r] = s, this[C] && this.setTextureFrames(this[C], this[I]);
        }
        get hasCloudColor() {
          return this[o];
        }
        get hasCloudFilter() {
          return this[G];
        }
        _getFilter(s) {
          return this[p][s] = this[p][s] || [], this[p][s];
        }
        getFilter(s) {
          return this._getFilter(s).join(" ");
        }
        get enableBlend() {
          return this[r].enableBlend || this[W];
        }
        canIgnore() {
          return this[r].canIgnore();
        }
        delete(s) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          const {
            transform0: b,
            transform1: h,
            color0: S,
            color1: Y,
            color2: T,
            color3: y,
            color4: J,
            frameIndex: N,
            fillColor: x,
            strokeColor: R
          } = this[d];
          b.set(b.subarray(3 * (s + 1)), 3 * s), h.set(h.subarray(3 * (s + 1)), 3 * s), S.set(S.subarray(4 * (s + 1)), 4 * s), Y.set(Y.subarray(4 * (s + 1)), 4 * s), T.set(T.subarray(4 * (s + 1)), 4 * s), y.set(y.subarray(4 * (s + 1)), 4 * s), J.set(J.subarray(4 * (s + 1)), 4 * s), N.set(N.subarray(s + 1), s), x.set(x.subarray(4 * (s + 1)), 4 * s), R.set(R.subarray(4 * (s + 1)), 4 * s);
          for (const z in this[p])
            z === s ? delete this[p][z] : z > s && (this[p][z - 1] = this[p][z], delete this[p][z]);
          this[X]--;
        }
        setColorTransform(s, b) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          s *= 4;
          const {
            color0: h,
            color1: S,
            color2: Y,
            color3: T,
            color4: y
          } = this[d];
          return b != null ? (h.set([b[0], b[5], b[10], b[15]], s), S.set([b[1], b[6], b[11], b[16]], s), Y.set([b[2], b[7], b[12], b[17]], s), T.set([b[3], b[8], b[13], b[18]], s), y.set([b[4], b[9], b[14], b[19]], s), this[W] = this[W] || b[18] < 1, this[G] = !0) : (h.set([1, 0, 0, 0], s), S.set([0, 1, 0, 0], s), Y.set([0, 0, 1, 0], s), T.set([0, 0, 0, 1], s), y.set([0, 0, 0, 0], s)), this;
        }
        getColorTransform(s) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          s *= 4;
          const {
            color0: b,
            color1: h,
            color2: S,
            color3: Y,
            color4: T
          } = this[d];
          return [b[s], h[s], S[s], Y[s], T[s], b[s + 1], h[s + 1], S[s + 1], Y[s + 1], T[s + 1], b[s + 2], h[s + 2], S[s + 2], Y[s + 2], T[s + 2], b[s + 3], h[s + 3], S[s + 3], Y[s + 3], T[s + 3]];
        }
        transformColor(s, b) {
          let h = this.getColorTransform(s);
          return h = Object(m.multiply)(h, b), this.setColorTransform(s, h), this;
        }
        setFillColor(s, b) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          typeof b == "string" && (b = Object(K.default)(b)), b[3] > 0 && (this[o] = !0), this[d].fillColor.set(b.map((h) => Math.round(255 * h)), 4 * s);
        }
        setStrokeColor(s, b) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          typeof b == "string" && (b = Object(K.default)(b)), b[3] > 0 && (this[o] = !0), this[d].strokeColor.set(b.map((h) => Math.round(255 * h)), 4 * s);
        }
        getCloudRGBA(s) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          s *= 4;
          const {
            fillColor: b,
            strokeColor: h
          } = this[d], S = [b[s], b[s + 1], b[s + 2], b[s + 3]], Y = [h[s], h[s + 1], h[s + 2], h[s + 3]];
          return S[3] /= 255, Y[3] /= 255, {
            fill: `rgba(${S.join()})`,
            stroke: `rgba(${Y.join()})`
          };
        }
        grayscale(s, b) {
          this.transformColor(s, Object(m.grayscale)(b)), this._getFilter(s).push(`grayscale(${100 * b}%)`);
        }
        brightness(s, b) {
          this.transformColor(s, Object(m.brightness)(b)), this._getFilter(s).push(`brightness(${100 * b}%)`);
        }
        saturate(s, b) {
          this.transformColor(s, Object(m.saturate)(b)), this._getFilter(s).push(`saturate(${100 * b}%)`);
        }
        contrast(s, b) {
          this.transformColor(s, Object(m.contrast)(b)), this._getFilter(s).push(`contrast(${100 * b}%)`);
        }
        invert(s, b) {
          this.transformColor(s, Object(m.invert)(b)), this._getFilter(s).push(`invert(${100 * b}%)`);
        }
        sepia(s, b) {
          this.transformColor(s, Object(m.sepia)(b)), this._getFilter(s).push(`sepia(${100 * b}%)`);
        }
        opacity(s, b) {
          this.transformColor(s, Object(m.opacity)(b)), this._getFilter(s).push(`opacity(${100 * b}%)`);
        }
        hueRotate(s, b) {
          this.transformColor(s, Object(m.hueRotate)(b)), this._getFilter(s).push(`hue-rotate(${b}deg)`);
        }
        setTransform(s, b) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          s *= 3, b == null && (b = [1, 0, 0, 1, 0, 0]);
          const {
            transform0: h,
            transform1: S
          } = this[d];
          return h.set([b[0], b[2], b[4]], s), S.set([b[1], b[3], b[5]], s), this;
        }
        getTransform(s) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          s *= 3;
          const {
            transform0: b,
            transform1: h
          } = this[d];
          return [b[s], h[s], b[s + 1], h[s + 1], b[s + 2], h[s + 2]];
        }
        getTextureFrame(s) {
          return this[C][this[d].frameIndex[s]];
        }
        setTextureFrames(s = [], b = {}) {
          if (s.length > 12)
            throw new Error("Max frames exceed. Allow 12 frames.");
          s.length && this[r].setTexture(s[0], b), this[C] = s, this[I] = b;
        }
        setFrameIndex(s, b) {
          if (s >= this[X] || s < 0)
            throw new Error("Out of range.");
          const h = this[C].length;
          if (h <= 0)
            throw new Error("No frames");
          this[d].frameIndex[s] = b % h;
        }
        get amount() {
          return this[X];
        }
        set amount(s) {
          const b = this[X];
          s !== b && (s > this[d].bufferSize && (this[d] = t(Math.max(s, this[d].bufferSize + 1e3), this[d])), this[X] = s, s > b && this.initBuffer(b));
        }
        get meshData() {
          const {
            attributes: s,
            cells: b,
            positions: h,
            textureCoord: S,
            uniforms: Y
          } = this[r].meshData, T = this[C], y = {
            attributes: a({}, s),
            cells: b,
            positions: h,
            textureCoord: S,
            uniforms: a({}, Y),
            instanceCount: this[X],
            enableBlend: this.enableBlend
          };
          T.length && T.forEach((v, O) => {
            y.uniforms[`u_texFrame${O}`] = v;
          });
          const {
            transform0: J,
            transform1: N,
            color0: x,
            color1: R,
            color2: z,
            color3: Q,
            color4: P,
            fillColor: D,
            strokeColor: _,
            frameIndex: F
          } = this[d];
          return this[r].uniforms.u_texSampler && (y.attributes.a_frameIndex = {
            data: F,
            divisor: 1
          }), y.attributes.a_transform0 = {
            data: J,
            divisor: 1
          }, y.attributes.a_transform1 = {
            data: N,
            divisor: 1
          }, y.attributes.a_colorCloud0 = {
            data: x,
            divisor: 1
          }, y.attributes.a_colorCloud1 = {
            data: R,
            divisor: 1
          }, y.attributes.a_colorCloud2 = {
            data: z,
            divisor: 1
          }, y.attributes.a_colorCloud3 = {
            data: Q,
            divisor: 1
          }, y.attributes.a_colorCloud4 = {
            data: P,
            divisor: 1
          }, this.hasCloudColor && (y.attributes.a_fillCloudColor = {
            data: D,
            divisor: 1
          }, y.attributes.a_strokeCloudColor = {
            data: _,
            divisor: 1
          }), y;
        }
        setProgram(s) {
          this[r].setProgram(s);
        }
        get program() {
          return this[r].program;
        }
        transform(s, b) {
          const h = this.getTransform(s);
          return b = c.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), h, b), this.setTransform(s, b), this;
        }
        translate(s, [b, h]) {
          let S = c.mat2d.create();
          return S = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), S, [b, h]), this.transform(s, S);
        }
        rotate(s, b, [h, S] = [0, 0]) {
          let Y = c.mat2d.create();
          return Y = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), Y, [h, S]), Y = c.mat2d.rotate(Array.of(0, 0, 0, 0, 0, 0), Y, b), Y = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), Y, [-h, -S]), this.transform(s, Y);
        }
        scale(s, [b, h = b], [S, Y] = [0, 0]) {
          let T = c.mat2d.create();
          return T = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), T, [S, Y]), T = c.mat2d.scale(Array.of(0, 0, 0, 0, 0, 0), T, [b, h]), T = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), T, [-S, -Y]), this.transform(s, T);
        }
        skew(s, [b, h = b], [S, Y] = [0, 0]) {
          let T = c.mat2d.create();
          return T = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), T, [S, Y]), T = c.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), T, c.mat2d.fromValues(1, Math.tan(h), Math.tan(b), 1, 0, 0)), T = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), T, [-S, -Y]), this.transform(s, T);
        }
        isPointCollision(s, [b, h], S = "both") {
          const Y = this.getTransform(s), T = Object(L.transformPoint)([b, h], c.mat2d.invert(Array.of(0, 0, 0, 0, 0, 0), Y));
          return this[r].isPointCollision(...T, S);
        }
        isPointInFill(s, [b, h]) {
          return this.isPointCollision(s, [b, h], "fill");
        }
        isPointInStroke(s, [b, h]) {
          return this.isPointCollision(s, [b, h], "stroke");
        }
      };
    },
    /* 30 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "multiply", function() {
        return m;
      }), i.d(l, "grayscale", function() {
        return L;
      }), i.d(l, "brightness", function() {
        return K;
      }), i.d(l, "saturate", function() {
        return u;
      }), i.d(l, "contrast", function() {
        return a;
      }), i.d(l, "invert", function() {
        return e;
      }), i.d(l, "sepia", function() {
        return r;
      }), i.d(l, "opacity", function() {
        return X;
      }), i.d(l, "hueRotate", function() {
        return W;
      });
      var c = i(26);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(p, C) {
        const I = [], o = p[0], G = p[1], d = p[2], t = p[3], s = p[4], b = p[5], h = p[6], S = p[7], Y = p[8], T = p[9], y = p[10], J = p[11], N = p[12], x = p[13], R = p[14], z = p[15], Q = p[16], P = p[17], D = p[18], _ = p[19];
        let F = C[0], v = C[1], O = C[2], li = C[3], ii = C[4];
        return I[0] = F * o + v * b + O * y + li * z, I[1] = F * G + v * h + O * J + li * Q, I[2] = F * d + v * S + O * N + li * P, I[3] = F * t + v * Y + O * x + li * D, I[4] = F * s + v * T + O * R + li * _ + ii, F = C[5], v = C[6], O = C[7], li = C[8], ii = C[9], I[5] = F * o + v * b + O * y + li * z, I[6] = F * G + v * h + O * J + li * Q, I[7] = F * d + v * S + O * N + li * P, I[8] = F * t + v * Y + O * x + li * D, I[9] = F * s + v * T + O * R + li * _ + ii, F = C[10], v = C[11], O = C[12], li = C[13], ii = C[14], I[10] = F * o + v * b + O * y + li * z, I[11] = F * G + v * h + O * J + li * Q, I[12] = F * d + v * S + O * N + li * P, I[13] = F * t + v * Y + O * x + li * D, I[14] = F * s + v * T + O * R + li * _ + ii, F = C[15], v = C[16], O = C[17], li = C[18], ii = C[19], I[15] = F * o + v * b + O * y + li * z, I[16] = F * G + v * h + O * J + li * Q, I[17] = F * d + v * S + O * N + li * P, I[18] = F * t + v * Y + O * x + li * D, I[19] = F * s + v * T + O * R + li * _ + ii, I;
      }
      function L(p) {
        p = Object(c.clamp)(0, 1, p);
        const C = 0.2126 * p, I = 0.7152 * p, o = 0.0722 * p;
        return [C + 1 - p, I, o, 0, 0, C, I + 1 - p, o, 0, 0, C, I, o + 1 - p, 0, 0, 0, 0, 0, 1, 0];
      }
      function K(p) {
        return [p, 0, 0, 0, 0, 0, p, 0, 0, 0, 0, 0, p, 0, 0, 0, 0, 0, 1, 0];
      }
      function u(p) {
        const C = 0.2126 * (1 - p), I = 0.7152 * (1 - p), o = 0.0722 * (1 - p);
        return [C + p, I, o, 0, 0, C, I + p, o, 0, 0, C, I, o + p, 0, 0, 0, 0, 0, 1, 0];
      }
      function a(p) {
        const C = 0.5 * (1 - p);
        return [p, 0, 0, 0, C, 0, p, 0, 0, C, 0, 0, p, 0, C, 0, 0, 0, 1, 0];
      }
      function e(p) {
        const C = 1 - 2 * p;
        return [C, 0, 0, 0, p, 0, C, 0, 0, p, 0, 0, C, 0, p, 0, 0, 0, 1, 0];
      }
      function r(p) {
        return [1 - 0.607 * p, 0.769 * p, 0.189 * p, 0, 0, 0.349 * p, 1 - 0.314 * p, 0.168 * p, 0, 0, 0.272 * p, 0.534 * p, 1 - 0.869 * p, 0, 0, 0, 0, 0, 1, 0];
      }
      function X(p) {
        return [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, p, 0];
      }
      function W(p) {
        const C = p / 180 * Math.PI, I = Math.cos(C), o = Math.sin(C), G = 0.2126, d = 0.7152, t = 0.0722;
        return [G + I * (1 - G) + o * -G, d + I * -d + o * -d, t + I * -t + o * (1 - t), 0, 0, G + I * -G + o * 0.143, d + I * (1 - d) + o * 0.14, t + I * -t + o * -0.283, 0, 0, G + I * -G + o * -(1 - G), d + I * -d + o * d, t + I * (1 - t) + o * t, 0, 0, 0, 0, 0, 1, 0];
      }
    },
    /* 31 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return L;
      });
      var c = i(32), m = /* @__PURE__ */ i.n(c);
      i(1).glMatrix.setMatrixArrayType(Array);
      function L(K) {
        const u = m()(K);
        if (!u || !u.length)
          throw new TypeError("Invalid color value.");
        return [u[0] / 255, u[1] / 255, u[2] / 255, u[3]];
      }
    },
    /* 32 */
    /***/
    function(n, l, i) {
      var c = i(33), m = i(37), L = i(39);
      n.exports = function(u) {
        var a, e = c(u);
        return e.space ? (a = Array(3), a[0] = L(e.values[0], 0, 255), a[1] = L(e.values[1], 0, 255), a[2] = L(e.values[2], 0, 255), e.space[0] === "h" && (a = m.rgb(a)), a.push(L(e.alpha, 0, 1)), a) : [];
      };
    },
    /* 33 */
    /***/
    function(n, l, i) {
      (function(c) {
        var m = i(34), L = i(35), K = i(36);
        n.exports = a;
        var u = {
          red: 0,
          orange: 60,
          yellow: 120,
          green: 180,
          blue: 240,
          purple: 300
        };
        function a(e) {
          var r, X = [], W = 1, p;
          if (typeof e == "string")
            if (m[e])
              X = m[e].slice(), p = "rgb";
            else if (e === "transparent")
              W = 0, p = "rgb", X = [0, 0, 0];
            else if (/^#[A-Fa-f0-9]+$/.test(e)) {
              var C = e.slice(1), I = C.length, o = I <= 4;
              W = 1, o ? (X = [
                parseInt(C[0] + C[0], 16),
                parseInt(C[1] + C[1], 16),
                parseInt(C[2] + C[2], 16)
              ], I === 4 && (W = parseInt(C[3] + C[3], 16) / 255)) : (X = [
                parseInt(C[0] + C[1], 16),
                parseInt(C[2] + C[3], 16),
                parseInt(C[4] + C[5], 16)
              ], I === 8 && (W = parseInt(C[6] + C[7], 16) / 255)), X[0] || (X[0] = 0), X[1] || (X[1] = 0), X[2] || (X[2] = 0), p = "rgb";
            } else if (r = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(e)) {
              var G = r[1], d = G === "rgb", C = G.replace(/a$/, "");
              p = C;
              var I = C === "cmyk" ? 4 : C === "gray" ? 1 : 3;
              X = r[2].trim().split(/\s*,\s*/).map(function(h, S) {
                if (/%$/.test(h))
                  return S === I ? parseFloat(h) / 100 : C === "rgb" ? parseFloat(h) * 255 / 100 : parseFloat(h);
                if (C[S] === "h") {
                  if (/deg$/.test(h))
                    return parseFloat(h);
                  if (u[h] !== void 0)
                    return u[h];
                }
                return parseFloat(h);
              }), G === C && X.push(1), W = d || X[I] === void 0 ? 1 : X[I], X = X.slice(0, I);
            } else
              e.length > 10 && /[0-9](?:\s|\/)/.test(e) && (X = e.match(/([0-9]+)/g).map(function(s) {
                return parseFloat(s);
              }), p = e.match(/([a-z])/ig).join("").toLowerCase());
          else if (!isNaN(e))
            p = "rgb", X = [e >>> 16, (e & 65280) >>> 8, e & 255];
          else if (L(e)) {
            var t = K(e.r, e.red, e.R, null);
            t !== null ? (p = "rgb", X = [
              t,
              K(e.g, e.green, e.G),
              K(e.b, e.blue, e.B)
            ]) : (p = "hsl", X = [
              K(e.h, e.hue, e.H),
              K(e.s, e.saturation, e.S),
              K(e.l, e.lightness, e.L, e.b, e.brightness)
            ]), W = K(e.a, e.alpha, e.opacity, 1), e.opacity != null && (W /= 100);
          } else
            (Array.isArray(e) || c.ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(e)) && (X = [e[0], e[1], e[2]], p = "rgb", W = e.length === 4 ? e[3] : 1);
          return {
            space: p,
            values: X,
            alpha: W
          };
        }
      }).call(this, i(22));
    },
    /* 34 */
    /***/
    function(n, l, i) {
      n.exports = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50]
      };
    },
    /* 35 */
    /***/
    function(n, l, i) {
      var c = Object.prototype.toString;
      n.exports = function(m) {
        var L;
        return c.call(m) === "[object Object]" && (L = Object.getPrototypeOf(m), L === null || L === Object.getPrototypeOf({}));
      };
    },
    /* 36 */
    /***/
    function(n, l) {
      n.exports = function() {
        for (var i = 0; i < arguments.length; i++)
          if (arguments[i] !== void 0)
            return arguments[i];
      };
    },
    /* 37 */
    /***/
    function(n, l, i) {
      var c = i(38);
      n.exports = {
        name: "hsl",
        min: [0, 0, 0],
        max: [360, 100, 100],
        channel: ["hue", "saturation", "lightness"],
        alias: ["HSL"],
        rgb: function(m) {
          var L = m[0] / 360, K = m[1] / 100, u = m[2] / 100, a, e, r, X, W;
          if (K === 0)
            return W = u * 255, [W, W, W];
          u < 0.5 ? e = u * (1 + K) : e = u + K - u * K, a = 2 * u - e, X = [0, 0, 0];
          for (var p = 0; p < 3; p++)
            r = L + 1 / 3 * -(p - 1), r < 0 ? r++ : r > 1 && r--, 6 * r < 1 ? W = a + (e - a) * 6 * r : 2 * r < 1 ? W = e : 3 * r < 2 ? W = a + (e - a) * (2 / 3 - r) * 6 : W = a, X[p] = W * 255;
          return X;
        }
      }, c.hsl = function(m) {
        var L = m[0] / 255, K = m[1] / 255, u = m[2] / 255, a = Math.min(L, K, u), e = Math.max(L, K, u), r = e - a, X, W, p;
        return e === a ? X = 0 : L === e ? X = (K - u) / r : K === e ? X = 2 + (u - L) / r : u === e && (X = 4 + (L - K) / r), X = Math.min(X * 60, 360), X < 0 && (X += 360), p = (a + e) / 2, e === a ? W = 0 : p <= 0.5 ? W = r / (e + a) : W = r / (2 - e - a), [X, W * 100, p * 100];
      };
    },
    /* 38 */
    /***/
    function(n, l, i) {
      n.exports = {
        name: "rgb",
        min: [0, 0, 0],
        max: [255, 255, 255],
        channel: ["red", "green", "blue"],
        alias: ["RGB"]
      };
    },
    /* 39 */
    /***/
    function(n, l) {
      n.exports = i;
      function i(c, m, L) {
        return m < L ? c < m ? m : c > L ? L : c : c < L ? L : c > m ? m : c;
      }
    },
    /* 40 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return t;
      });
      var c = i(41), m = /* @__PURE__ */ i.n(c), L = i(42), K = /* @__PURE__ */ i.n(L), u = i(43), a = /* @__PURE__ */ i.n(u), e = i(44), r = i(46), X = /* @__PURE__ */ i.n(r), W = i(53), p = i(55);
      i(1).glMatrix.setMatrixArrayType(Array);
      const C = Symbol("contours"), I = Symbol("path"), o = Symbol("simplify"), G = Symbol("scale"), d = 2 * Math.PI;
      class t {
        constructor(b = {}) {
          typeof b == "string" && (b = {
            path: b
          }), b.path ? this[I] = m()(b.path) : this[I] = [], this[C] = null, this[o] = b.simplify != null ? b.simplify : 0, this[G] = b.scale != null ? b.scale : 2;
        }
        get contours() {
          let b = null;
          if (!this[C] && this[I]) {
            const h = Object(e.default)(a()(this[I]));
            this[C] = X()(h, this[G], this[o]), this[C].path = h, this[C].simplify = this[o], this[C].scale = this[G];
          }
          return this[C] && (b = this[C].map((h) => [...h]), b.path = this[C].path, b.simplify = this[C].simplify, b.scale = this[C].scale), b;
        }
        get path() {
          return this[I];
        }
        get simplify() {
          return this[o];
        }
        get boundingBox() {
          const b = this.contours;
          if (b && b.length) {
            const h = b.reduce((S, Y) => [...S, ...Y]);
            return K()(h);
          }
          return [[0, 0], [0, 0]];
        }
        get boundingCenter() {
          const b = this.boundingBox;
          return b ? [0.5 * (b[0][0] + b[1][0]), 0.5 * (b[0][1] + b[1][1])] : [0, 0];
        }
        normalize(b = 0, h = 0) {
          const S = Object(e.default)(a()(this[I])).map(([Y, ...T]) => {
            const y = [Y];
            for (let J = 0; J < T.length; J += 2) {
              const N = T[J] - b, x = T[J + 1] - h;
              y.push(N, x);
            }
            return y;
          });
          return this.beginPath(), this[I].push(...S), this;
        }
        getPointAtLength(b) {
          return this.contours ? Object(W.getPointAtLength)(this[C], b) : null;
        }
        getTotalLength() {
          return this.contours ? Object(W.getTotalLength)(this[C]) : 0;
        }
        addPath(b) {
          this[C] = null, typeof b == "string" && (b = m()(b)), this[I].push(...b);
        }
        beginPath() {
          this[I] = [], this[C] = null;
        }
        clear() {
          this.beginPath();
        }
        ellipse(b, h, S, Y, T, y, J, N = 0) {
          if (y += T, J += T, S <= 0 || Y <= 0 || J === y)
            return;
          J < y && (J = y + d + (J - y) % d), J - y > d && (J = y + d);
          const x = J - y;
          x >= d && (J -= 1e-3);
          let R = this[I].length > 0 && x < d ? "L" : "M";
          const z = Object(p.getPoint)(b, h, S, Y, y), Q = Object(p.getPoint)(b, h, S, Y, J), P = +!N;
          let D = x > Math.PI ? 1 : 0;
          N && (D = 1 - D), R += z.join(" "), R += `A${S} ${Y} 0 ${D} ${P} ${Q.join(" ")}`, x >= d && (R += "Z"), this.addPath(R);
        }
        arc(b, h, S, Y, T, y = 0) {
          return this.ellipse(b, h, S, S, 0, Y, T, y);
        }
        arcTo(b, h, S, Y, T, y, J) {
          this[C] = null, this[I].push(["A", b, h, S, Y, T, y, J]);
        }
        moveTo(b, h) {
          this[C] = null, this[I].push(["M", b, h]);
        }
        lineTo(b, h) {
          this[C] = null, this[I].push(["L", b, h]);
        }
        bezierCurveTo(b, h, S, Y, T, y) {
          this[C] = null, this[I].push(["C", b, h, S, Y, T, y]);
        }
        quadraticCurveTo(b, h, S, Y) {
          this[C] = null, this[I].push(["Q", b, h, S, Y]);
        }
        rect(b, h, S, Y) {
          const T = `M${b} ${h}L${b + S} ${h}L${b + S} ${h + Y}L${b} ${h + Y}Z`;
          this.addPath(T);
        }
        closePath() {
          this[C] = null;
          let b = [];
          const h = this[I].length;
          h > 0 && (b = this[I][h - 1]), b[0] !== "Z" && b[0] !== "z" && this[I].push(["Z"]);
        }
      }
    },
    /* 41 */
    /***/
    function(n, l) {
      n.exports = m;
      var i = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, c = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
      function m(u) {
        var a = [];
        return u.replace(c, function(e, r, X) {
          var W = r.toLowerCase();
          for (X = K(X), W == "m" && X.length > 2 && (a.push([r].concat(X.splice(0, 2))), W = "l", r = r == "m" ? "l" : "L"); ; ) {
            if (X.length == i[W])
              return X.unshift(r), a.push(X);
            if (X.length < i[W])
              throw new Error("malformed path data");
            a.push([r].concat(X.splice(0, i[W])));
          }
        }), a;
      }
      var L = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
      function K(u) {
        var a = u.match(L);
        return a ? a.map(Number) : [];
      }
    },
    /* 42 */
    /***/
    function(n, l, i) {
      n.exports = c;
      function c(m) {
        var L = m.length;
        if (L === 0)
          return [[], []];
        for (var K = m[0].length, u = m[0].slice(), a = m[0].slice(), e = 1; e < L; ++e)
          for (var r = m[e], X = 0; X < K; ++X) {
            var W = r[X];
            u[X] = Math.min(u[X], W), a[X] = Math.max(a[X], W);
          }
        return [u, a];
      }
    },
    /* 43 */
    /***/
    function(n, l) {
      n.exports = i;
      function i(c) {
        var m = 0, L = 0, K = 0, u = 0;
        return c.map(function(a) {
          a = a.slice();
          var e = a[0], r = e.toUpperCase();
          if (e != r)
            switch (a[0] = r, e) {
              case "a":
                a[6] += K, a[7] += u;
                break;
              case "v":
                a[1] += u;
                break;
              case "h":
                a[1] += K;
                break;
              default:
                for (var X = 1; X < a.length; )
                  a[X++] += K, a[X++] += u;
            }
          switch (r) {
            case "Z":
              K = m, u = L;
              break;
            case "H":
              K = a[1];
              break;
            case "V":
              u = a[1];
              break;
            case "M":
              K = m = a[1], u = L = a[2];
              break;
            default:
              K = a[a.length - 2], u = a[a.length - 1];
          }
          return a;
        });
      }
    },
    /* 44 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return m;
      });
      var c = i(45);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(u) {
        for (var a, e = [], r = 0, X = 0, W = 0, p = 0, C = null, I = null, o = 0, G = 0, d = 0, t = u.length; d < t; d++) {
          var s = u[d], b = s[0];
          switch (b) {
            case "M":
              W = s[1], p = s[2];
              break;
            case "A":
              var h = Object(c.default)(o, G, s[6], s[7], s[4], s[5], s[1], s[2], s[3]);
              if (!h.length)
                continue;
              h = h.map((J) => {
                const [N, x, R, z, Q, P, D, _] = J;
                return {
                  x1: R,
                  y1: z,
                  x2: Q,
                  y2: P,
                  x: D,
                  y: _
                };
              });
              for (var S = 0, Y; S < h.length; S++)
                Y = h[S], s = ["C", Y.x1, Y.y1, Y.x2, Y.y2, Y.x, Y.y], S < h.length - 1 && e.push(s);
              break;
            case "S":
              var T = o, y = G;
              (a == "C" || a == "S") && (T += T - r, y += y - X), s = ["C", T, y, s[1], s[2], s[3], s[4]];
              break;
            case "T":
              a == "Q" || a == "T" ? (C = o * 2 - C, I = G * 2 - I) : (C = o, I = G), s = K(o, G, C, I, s[1], s[2]);
              break;
            case "Q":
              C = s[1], I = s[2], s = K(o, G, s[1], s[2], s[3], s[4]);
              break;
            case "L":
              s = L(o, G, s[1], s[2]);
              break;
            case "H":
              s = L(o, G, s[1], G);
              break;
            case "V":
              s = L(o, G, o, s[1]);
              break;
            case "Z":
              s = L(o, G, W, p);
              break;
          }
          a = b, o = s[s.length - 2], G = s[s.length - 1], s.length > 4 ? (r = s[s.length - 4], X = s[s.length - 3]) : (r = o, X = G), e.push(s);
        }
        return e;
      }
      function L(u, a, e, r) {
        return ["C", u, a, e, r, e, r];
      }
      function K(u, a, e, r, X, W) {
        return ["C", u / 3 + 2 / 3 * e, a / 3 + 2 / 3 * r, X / 3 + 2 / 3 * e, W / 3 + 2 / 3 * r, X, W];
      }
    },
    /* 45 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      const c = Math.PI * 2;
      function m(a, e, r, X) {
        const W = a * X - e * r < 0 ? -1 : 1;
        let p = a * r + e * X;
        return p > 1 && (p = 1), p < -1 && (p = -1), W * Math.acos(p);
      }
      function L(a, e, r, X, W, p, C, I, o, G) {
        const d = G * (a - r) / 2 + o * (e - X) / 2, t = -o * (a - r) / 2 + G * (e - X) / 2, s = C * C, b = I * I, h = d * d, S = t * t;
        let Y = s * b - s * S - b * h;
        Y < 0 && (Y = 0), Y /= s * S + b * h, Y = Math.sqrt(Y) * (W === p ? -1 : 1);
        const T = Y * C / I * t, y = Y * -I / C * d, J = G * T - o * y + (a + r) / 2, N = o * T + G * y + (e + X) / 2, x = (d - T) / C, R = (t - y) / I, z = (-d - T) / C, Q = (-t - y) / I, P = m(1, 0, x, R);
        let D = m(x, R, z, Q);
        return p === 0 && D > 0 && (D -= c), p === 1 && D < 0 && (D += c), [J, N, P, D];
      }
      function K(a, e) {
        const r = 1.3333333333333333 * Math.tan(e / 4), X = Math.cos(a), W = Math.sin(a), p = Math.cos(a + e), C = Math.sin(a + e);
        return [X, W, X - W * r, W + X * r, p + C * r, C - p * r, p, C];
      }
      function u(a, e, r, X, W, p, C, I, o) {
        const G = Math.sin(o * c / 360), d = Math.cos(o * c / 360), t = d * (a - r) / 2 + G * (e - X) / 2, s = -G * (a - r) / 2 + d * (e - X) / 2;
        if (t === 0 && s === 0)
          return [];
        if (C === 0 || I === 0)
          return [];
        C = Math.abs(C), I = Math.abs(I);
        const b = t * t / (C * C) + s * s / (I * I);
        b > 1 && (C *= Math.sqrt(b), I *= Math.sqrt(b));
        const h = L(a, e, r, X, W, p, C, I, G, d), S = [];
        let Y = h[2], T = h[3];
        const y = Math.max(Math.ceil(Math.abs(T) / (c / 4)), 1);
        T /= y;
        for (let J = 0; J < y; J++)
          S.push(K(Y, T)), Y += T;
        return S.map((J) => {
          for (let N = 0; N < J.length; N += 2) {
            let x = J[N + 0], R = J[N + 1];
            x *= C, R *= I;
            const z = d * x - G * R, Q = G * x + d * R;
            J[N + 0] = z + h[0], J[N + 1] = Q + h[1];
          }
          return J;
        });
      }
    },
    /* 46 */
    /***/
    function(n, l, i) {
      i(1).glMatrix.setMatrixArrayType(Array);
      var c = i(47), {
        copy: m
      } = i(49), L = i(50);
      function K(X, W, p) {
        return X[0] = W, X[1] = p, X;
      }
      var u = [0, 0], a = [0, 0], e = [0, 0];
      function r(X, W, p, C) {
        c(p, K(u, C[1], C[2]), K(a, C[3], C[4]), K(e, C[5], C[6]), W, X);
      }
      n.exports = function(W, p, C) {
        var I = [], o = [], G = [0, 0];
        return W.forEach(function(d, t, s) {
          if (d[0] === "M")
            m(G, d.slice(1)), o.length > 0 && (I.push(o), o = []);
          else if (d[0] === "C")
            r(o, p, G, d), K(G, d[5], d[6]);
          else
            throw new Error("illegal type in SVG: " + d[0]);
        }), o.length > 0 && I.push(o), I.map(function(d) {
          return L(d, C || 0);
        });
      };
    },
    /* 47 */
    /***/
    function(n, l, i) {
      n.exports = i(48)();
    },
    /* 48 */
    /***/
    function(n, l) {
      function i(m) {
        return [m[0], m[1]];
      }
      function c(m, L) {
        return [m, L];
      }
      n.exports = function(L) {
        L = L || {};
        var K = typeof L.recursion == "number" ? L.recursion : 8, u = typeof L.epsilon == "number" ? L.epsilon : 11920929e-14, a = typeof L.pathEpsilon == "number" ? L.pathEpsilon : 1, e = typeof L.angleEpsilon == "number" ? L.angleEpsilon : 0.01, r = L.angleTolerance || 0, X = L.cuspLimit || 0;
        return function(I, o, G, d, t, s) {
          s || (s = []), t = typeof t == "number" ? t : 1;
          var b = a / t;
          return b *= b, W(I, o, G, d, s, b), s;
        };
        function W(C, I, o, G, d, t) {
          d.push(i(C));
          var s = C[0], b = C[1], h = I[0], S = I[1], Y = o[0], T = o[1], y = G[0], J = G[1];
          p(s, b, h, S, Y, T, y, J, d, t, 0), d.push(i(G));
        }
        function p(C, I, o, G, d, t, s, b, h, S, Y) {
          if (!(Y > K)) {
            var T = Math.PI, y = (C + o) / 2, J = (I + G) / 2, N = (o + d) / 2, x = (G + t) / 2, R = (d + s) / 2, z = (t + b) / 2, Q = (y + N) / 2, P = (J + x) / 2, D = (N + R) / 2, _ = (x + z) / 2, F = (Q + D) / 2, v = (P + _) / 2;
            if (Y > 0) {
              var O = s - C, li = b - I, ii = Math.abs((o - s) * li - (G - b) * O), ti = Math.abs((d - s) * li - (t - b) * O), $, ai;
              if (ii > u && ti > u) {
                if ((ii + ti) * (ii + ti) <= S * (O * O + li * li)) {
                  if (r < e) {
                    h.push(c(F, v));
                    return;
                  }
                  var Xi = Math.atan2(t - G, d - o);
                  if ($ = Math.abs(Xi - Math.atan2(G - I, o - C)), ai = Math.abs(Math.atan2(b - t, s - d) - Xi), $ >= T && ($ = 2 * T - $), ai >= T && (ai = 2 * T - ai), $ + ai < r) {
                    h.push(c(F, v));
                    return;
                  }
                  if (X !== 0) {
                    if ($ > X) {
                      h.push(c(o, G));
                      return;
                    }
                    if (ai > X) {
                      h.push(c(d, t));
                      return;
                    }
                  }
                }
              } else if (ii > u) {
                if (ii * ii <= S * (O * O + li * li)) {
                  if (r < e) {
                    h.push(c(F, v));
                    return;
                  }
                  if ($ = Math.abs(Math.atan2(t - G, d - o) - Math.atan2(G - I, o - C)), $ >= T && ($ = 2 * T - $), $ < r) {
                    h.push(c(o, G)), h.push(c(d, t));
                    return;
                  }
                  if (X !== 0 && $ > X) {
                    h.push(c(o, G));
                    return;
                  }
                }
              } else if (ti > u) {
                if (ti * ti <= S * (O * O + li * li)) {
                  if (r < e) {
                    h.push(c(F, v));
                    return;
                  }
                  if ($ = Math.abs(Math.atan2(b - t, s - d) - Math.atan2(t - G, d - o)), $ >= T && ($ = 2 * T - $), $ < r) {
                    h.push(c(o, G)), h.push(c(d, t));
                    return;
                  }
                  if (X !== 0 && $ > X) {
                    h.push(c(d, t));
                    return;
                  }
                }
              } else if (O = F - (C + s) / 2, li = v - (I + b) / 2, O * O + li * li <= S) {
                h.push(c(F, v));
                return;
              }
            }
            p(C, I, y, J, Q, P, F, v, h, S, Y + 1), p(F, v, D, _, R, z, s, b, h, S, Y + 1);
          }
        }
      };
    },
    /* 49 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "create", function() {
        return L;
      }), i.d(l, "clone", function() {
        return m;
      }), i.d(l, "copy", function() {
        return K;
      }), i.d(l, "scaleAndAdd", function() {
        return u;
      }), i.d(l, "dot", function() {
        return a;
      }), i.d(l, "rotate", function() {
        return e;
      }), i.d(l, "cross", function() {
        return r;
      }), i.d(l, "sub", function() {
        return X;
      }), i.d(l, "add", function() {
        return W;
      }), i.d(l, "computeMiter", function() {
        return o;
      }), i.d(l, "normal", function() {
        return G;
      }), i.d(l, "direction", function() {
        return d;
      });
      var c = i(1);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(t) {
        return [t[0], t[1]];
      }
      function L() {
        return [0, 0];
      }
      const K = c.vec2.copy, u = c.vec2.scaleAndAdd, a = c.vec2.dot, e = c.vec2.rotate, r = c.vec2.cross, X = c.vec2.sub, W = c.vec2.add, p = c.vec2.normalize, C = c.vec2.set, I = L();
      function o(t, s, b, h, S) {
        W(t, b, h), p(t, t), C(s, -t[1], t[0]), C(I, -b[1], b[0]);
        const Y = S / a(s, I);
        return Math.abs(Y);
      }
      function G(t, s) {
        return C(t, -s[1], s[0]), t;
      }
      function d(t, s, b) {
        return X(t, s, b), p(t, t), t;
      }
    },
    /* 50 */
    /***/
    function(n, l, i) {
      var c = i(51), m = i(52);
      n.exports = function(K, u) {
        return K = c(K, u), K = m(K, u), K;
      }, n.exports.radialDistance = c, n.exports.douglasPeucker = m;
    },
    /* 51 */
    /***/
    function(n, l) {
      function i(c, m) {
        var L = c[0] - m[0], K = c[1] - m[1];
        return L * L + K * K;
      }
      n.exports = function(m, L) {
        if (m.length <= 1)
          return m;
        L = typeof L == "number" ? L : 1;
        for (var K = L * L, u = m[0], a = [u], e, r = 1, X = m.length; r < X; r++)
          e = m[r], i(e, u) > K && (a.push(e), u = e);
        return u !== e && a.push(e), a;
      };
    },
    /* 52 */
    /***/
    function(n, l) {
      function i(m, L, K) {
        var u = L[0], a = L[1], e = K[0] - u, r = K[1] - a;
        if (e !== 0 || r !== 0) {
          var X = ((m[0] - u) * e + (m[1] - a) * r) / (e * e + r * r);
          X > 1 ? (u = K[0], a = K[1]) : X > 0 && (u += e * X, a += r * X);
        }
        return e = m[0] - u, r = m[1] - a, e * e + r * r;
      }
      function c(m, L, K, u, a) {
        for (var e = u, r, X = L + 1; X < K; X++) {
          var W = i(m[X], m[L], m[K]);
          W > e && (r = X, e = W);
        }
        e > u && (r - L > 1 && c(m, L, r, u, a), a.push(m[r]), K - r > 1 && c(m, r, K, u, a));
      }
      n.exports = function(L, K) {
        if (L.length <= 1)
          return L;
        K = typeof K == "number" ? K : 1;
        var u = K * K, a = L.length - 1, e = [L[0]];
        return c(L, 0, a, u, e), e.push(L[a]), e;
      };
    },
    /* 53 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "getTotalLength", function() {
        return m;
      }), i.d(l, "getPointAtLength", function() {
        return K;
      }), i.d(l, "getDashContours", function() {
        return u;
      });
      var c = i(54);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(a) {
        if (a.totalLength != null)
          return a.totalLength;
        let e = 0;
        return a.forEach((r) => {
          let X = r[0];
          for (let W = 1; W < r.length; W++) {
            const p = r[W];
            e += Object(c.distance)(X, p), X = p;
          }
        }), a.totalLength = e, e;
      }
      function L(a, e, r = !0) {
        if (e = Number(e), !Number.isFinite(e))
          throw new TypeError("Failed to execute 'getPointAtLength' on figure: The provided float value is non-finite.");
        if (e <= 0)
          throw new TypeError("Length must > 0");
        const X = m(a);
        if (e >= X) {
          const p = a[a.length - 1], C = p[p.length - 2], I = p[p.length - 1], o = Math.atan2(I[1] - C[1], I[0] - C[0]);
          return {
            current: a.map((G) => [...G]),
            point: {
              x: I[0],
              y: I[1],
              angle: o
            }
          };
        }
        const W = [];
        for (let p = 0; p < a.length; p++) {
          W[p] = [];
          const C = a[p];
          let I = C[0];
          for (let o = 1; o < C.length; o++) {
            const G = C[o], d = Object(c.distance)(I, G);
            if (e < d) {
              const t = e / d, s = Math.atan2(G[1] - I[1], G[0] - I[0]), b = {
                x: I[0] * (1 - t) + G[0] * t,
                y: I[1] * (1 - t) + G[1] * t,
                angle: s
              };
              if (W[p].push(I), e > 0 && W[p].push([b.x, b.y]), !r)
                return {
                  current: W,
                  point: b
                };
              const h = [], S = p;
              for (; p < a.length; p++) {
                for (h[p - S] = [], p === S && h[0].push([b.x, b.y]); o < C.length; o++)
                  h[p - S].push(C[o]);
                o = 0;
              }
              return {
                current: W,
                point: b,
                rest: h
              };
            }
            e -= d, W[p].push(I), I = G;
          }
        }
      }
      function K(a, e) {
        if (e = Number(e), !Number.isFinite(e))
          throw new TypeError("Failed to execute 'getPointAtLength' on figure: The provided float value is non-finite.");
        if (a.length <= 0)
          return {
            x: 0,
            y: 0,
            angle: 0
          };
        if (e <= 0) {
          const r = a[0][0], X = a[0][1], W = Math.atan2(X[1] - r[1], X[0] - r[0]);
          return {
            x: r[0],
            y: r[1],
            angle: W
          };
        }
        return L(a, e, !1).point;
      }
      function u(a, e, r) {
        let X = 0, W = e[0], p = a;
        const C = [], I = e.length;
        if (r > 0) {
          do
            r -= e[X % I], X++;
          while (r > 0);
          r < 0 && (W = -r, X--);
        } else if (r < 0) {
          X = -1;
          do
            r += e[X % I + I - 1], X--;
          while (r < 0);
          r >= 0 && (X++, W = e[X % I + I - 1] - r);
        }
        do {
          const o = L(p, W);
          p = o.rest, ++X % 2 && C.push(...o.current);
          let G = X % I;
          G < 0 && (G += I), W = e[G];
        } while (p);
        return C;
      }
    },
    /* 54 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "normalize", function() {
        return c;
      }), i.d(l, "distance", function() {
        return m;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c([L, K, u], a, e, r) {
        return L = L * 2 / a - 1, K = 1 - K * 2 / e, Number.isFinite(r) ? (u = u * 2 / r - 1, [L, K, u]) : [L, K];
      }
      function m([L, K, u = 0], [a, e, r = 0]) {
        return Math.hypot(a - L, e - K, r - u);
      }
    },
    /* 55 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "getPoint", function() {
        return m;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      const c = Math.PI * 2;
      function m(L, K, u, a, e) {
        e %= c, e < 0 && (e += c);
        const r = Math.tan(e);
        if (Math.abs(r) < 1e5) {
          const X = K - r * L, W = 1 / u ** 2 + r ** 2 / a ** 2;
          let p = -1;
          (e <= Math.PI / 2 || e > 3 * Math.PI / 2) && (p = 1);
          const C = p * Math.sqrt(1 / W) + L, I = r * C + X;
          return [C, I];
        }
        return e < Math.PI ? [L, K + a] : [L, K - a];
      }
    },
    /* 56 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return j;
      });
      var c = i(1), m = i(42), L = /* @__PURE__ */ i.n(m), K = i(57), u = i(28), a = i(24), e = i(30), r = i(59), X = i(53), W = i(60), p = /* @__PURE__ */ i.n(W), C = i(46), I = /* @__PURE__ */ i.n(C), o = i(31), G = i(40), d = i(21);
      i(1).glMatrix.setMatrixArrayType(Array);
      function t(A, H) {
        if (A == null)
          return {};
        var U = s(A, H), Z, V;
        if (Object.getOwnPropertySymbols) {
          var g = Object.getOwnPropertySymbols(A);
          for (V = 0; V < g.length; V++)
            Z = g[V], !(H.indexOf(Z) >= 0) && Object.prototype.propertyIsEnumerable.call(A, Z) && (U[Z] = A[Z]);
        }
        return U;
      }
      function s(A, H) {
        if (A == null)
          return {};
        var U = {}, Z = Object.keys(A), V, g;
        for (g = 0; g < Z.length; g++)
          V = Z[g], !(H.indexOf(V) >= 0) && (U[V] = A[V]);
        return U;
      }
      const b = Symbol("mesh"), h = Symbol("contours"), S = Symbol("stroke"), Y = Symbol("fill"), T = Symbol("strokeColor"), y = Symbol("fillColor"), J = Symbol("transform"), N = Symbol("invertTransform"), x = Symbol("uniforms"), R = Symbol("texOptions"), z = Symbol("blend"), Q = Symbol("applyTexture"), P = Symbol("applyTransform"), D = Symbol("applyGradientTransform"), _ = Symbol("applyProgram"), F = Symbol("gradient"), v = Symbol("filter"), O = Symbol("opacity"), li = Symbol("program"), ii = Symbol("attributes"), ti = Symbol("pass"), $ = Symbol("clipContext"), ai = Symbol("applyClipPath");
      function Xi(A, H) {
        const [U, Z] = [A[1][0] - A[0][0], A[1][1] - A[0][1]], V = [];
        for (let g = 0; g < H.length; g++) {
          const f = H[g], w = [(f[0] - A[0][0]) / U, 1 - (f[1] - A[0][1]) / Z];
          V.push(w);
        }
        return V;
      }
      function M([A, H], [U, Z, V, g], {
        scale: f
      }) {
        return f || (A /= V, H = 1 - H / g, A -= U, H += Z), [A, H, 0];
      }
      function k(A, H, U) {
        const Z = I()(A, H, U);
        return Z.path = A, Z.simplify = U, Z.scale = H, Z;
      }
      class j {
        constructor(H) {
          this[S] = null, this[Y] = null, this[J] = [1, 0, 0, 1, 0, 0], this[O] = 1, this[x] = {}, this[v] = [], this[z] = null, this[R] = {}, this.contours = H.contours, this[li] = null, this[ii] = {}, this[ti] = [];
        }
        get contours() {
          return this[h];
        }
        set contours(H) {
          this[b] = null, this[h] = H;
          const U = H.scale;
          this.transformScale / U > 1.5 && this.accurate(this.transformScale);
        }
        setProgram(H) {
          this[li] = H, this[b] && this[_](H);
        }
        get program() {
          return this[li];
        }
        setAttribute(H, U) {
          U == null ? delete this[ii][H] : this[ii][H] = U;
        }
        getOpacity() {
          return this[O];
        }
        setOpacity(H) {
          if (H < 0 || H > 1)
            throw new TypeError("Invalid opacity value.");
          this[b] && this[b].positions.forEach((U) => {
            U[2] = 1 / U[2] > 0 ? H : -H;
          }), this[O] = H;
        }
        setClipPath(H) {
          this.clipPath = H, this[x].u_clipSampler && this[x].u_clipSampler.delete(), this.setUniforms({
            u_clipSampler: null
          }), this[b] && delete this[b].attributes.a_clipUV, H && this[b] && this[ai]();
        }
        [ai]() {
          if (this.clipPath) {
            this[$] || (this[$] = d.default.createCanvas(1, 1));
            const [[H, U], [Z, V]] = this.boundingBox;
            Z && V && (this[$].width = Z - H, this[$].height = V - U);
            const g = this[$].getContext("2d"), f = new Path2D(this.clipPath);
            g.clearRect(0, 0, this[$].width, this[$].height), g.save(), g.translate(-H, -U), g.fillStyle = "white", g.fill(f), g.restore(), this[b].clipPath = this[$];
            const w = Xi(this.boundingBox, this[b].position0);
            this[b].attributes.a_clipUV = w;
          }
        }
        getPointAtLength(H) {
          return Object(X.getPointAtLength)(this[h], H);
        }
        getTotalLength() {
          return Object(X.getTotalLength)(this[h]);
        }
        get blend() {
          return this[z] == null ? "auto" : this[z];
        }
        set blend(H) {
          this[z] = H, this[b] && (this[b].enableBlend = this.enableBlend);
        }
        get boundingBox() {
          if (this[b] && this[b].boundingBox)
            return this[b].boundingBox;
          const H = this.meshData;
          if (H) {
            const U = H.position0;
            if (U.length)
              H.boundingBox = L()(U);
            else
              return [[0, 0], [0, 0]];
            return H.boundingBox;
          }
          return [[0, 0], [0, 0]];
        }
        get boundingCenter() {
          const H = this.boundingBox;
          return H ? [0.5 * (H[0][0] + H[1][0]), 0.5 * (H[0][1] + H[1][1])] : [0, 0];
        }
        get fillRule() {
          return this[Y] ? this[Y].rule : "nonzero";
        }
        get lineWidth() {
          return this[S] ? this[S].lineWidth : 0;
        }
        get lineCap() {
          return this[S] ? this[S].lineCap : "";
        }
        get lineJoin() {
          return this[S] ? this[S].lineJoin : "";
        }
        get miterLimit() {
          return this[S] ? this[S].miterLimit : 0;
        }
        get strokeStyle() {
          return this[T] && this[T][3] !== 0 ? Object(a.default)(this[T]) : "";
        }
        get lineDash() {
          return this[S] ? this[S].lineDash : null;
        }
        get lineDashOffset() {
          return this[S] ? this[S].lineDashOffset : 0;
        }
        get fillStyle() {
          return this[y] && this[y][3] !== 0 ? Object(a.default)(this[y]) : "";
        }
        get gradient() {
          return this[F];
        }
        get texture() {
          return this[x].u_texSampler ? {
            image: this[x].u_texSampler._img,
            options: this[R]
          } : null;
        }
        get enableBlend() {
          return this[z] === !0 || this[z] === !1 ? this[z] : this[O] < 1 || this[T] != null && this[T][3] < 1 || this[y] != null && this[y][3] < 1 || this[x].u_colorMatrix != null && this[x].u_colorMatrix[18] < 1 || this[x].u_radialGradientVector != null || this.beforeRender || this.afterRender;
        }
        get filterCanvas() {
          return /blur|drop-shadow|url/.test(this.filter);
        }
        get filter() {
          return this[v].join(" ");
        }
        get transformMatrix() {
          return this[J];
        }
        get invertMatrix() {
          if (!this[N]) {
            const H = c.mat2d.invert(Array.of(0, 0, 0, 0, 0, 0), this[J]);
            this[N] = H;
          }
          return this[N];
        }
        get transformScale() {
          const H = this[J];
          return Math.max(Math.hypot(H[0], H[1]), Math.hypot(H[2], H[3]));
        }
        get uniforms() {
          return this[x];
        }
        get pass() {
          return this[ti];
        }
        [_](H) {
          const U = this[ii], Z = this[b].position0, V = Object.entries(H._attribute);
          for (let g = 0; g < V.length; g++) {
            const [f, w] = V[g];
            if (f !== "a_color" && f !== "a_sourceRect" && w !== "ignored") {
              const B = U[f];
              if (f === "uv" && !B) {
                const q = this[b].boundingBox || L()(Z);
                this[b].attributes[f] = Xi(q, Z);
              } else {
                this[b].attributes[f] = [];
                for (let q = 0; q < Z.length; q++) {
                  const si = Z[q];
                  this[b].attributes[f].push(B ? B(si, g, Z) : Array(w.size).fill(0));
                }
              }
            }
          }
        }
        // {stroke, fill}
        get meshData() {
          if (this._updateMatrix && this.transformScale / this.contours.scale > 1.5 && this.accurate(this.transformScale), !this[b]) {
            !this[Y] && !this[S] && this.setFill();
            const H = this[h], U = {};
            if (H && H.length) {
              if (this[Y])
                try {
                  const g = p()(H, this[Y]);
                  g.positions = g.positions.map((f) => (f.push(this[O]), f)), g.attributes = {
                    a_color: Array.from({
                      length: g.positions.length
                    }).map(() => this[y].map((f) => Math.round(255 * f)))
                    // a_sourceRect: Array.from({length: mesh.positions.length}).map(() => [0, 0, 0, 0]),
                  }, U.fill = g;
                } catch {
                }
              if (this[S]) {
                const g = this[S].lineDash;
                let f = H;
                if (g) {
                  const B = this[S].lineDashOffset;
                  f = Object(X.getDashContours)(H, g, B);
                }
                const w = f.map((B, q) => {
                  const si = B.length > 1 && c.vec2.equals(B[0], B[B.length - 1]), bi = this[S].build(B, si);
                  return p()([bi]);
                });
                w.forEach((B) => {
                  B.positions = B.positions.map((q) => (q.push(-this[O]), q)), B.attributes = {
                    a_color: Array.from({
                      length: B.positions.length
                    }).map(() => this[T].map((q) => Math.round(255 * q)))
                  };
                }), U.stroke = Object(u.default)(w);
              }
            }
            const Z = Object(u.default)([U.fill, U.stroke]);
            Z.fillPointCount = U.fill ? U.fill.positions.length : 0, Z.enableBlend = this.enableBlend, Z.position0 = Z.positions.map(([g, f, w]) => [g, f, w]), Z.uniforms = this[x], this[b] = Z, this[x].u_texSampler && this[Q](Z, this[R]);
            const V = this[J];
            Object(r.isUnitTransform)(V) || (this[P](Z, V), this[x].u_radialGradientVector && this[D]()), this.clipPath && this[ai](), this[li] && this[_](this[li]);
          }
          return this._updateMatrix && (this[b].matrix = this[J], this[P](this[b], this[J]), this[x].u_radialGradientVector && this[D]()), this[b];
        }
        [P](H, U) {
          const {
            positions: Z,
            position0: V
          } = H;
          for (let g = 0; g < Z.length; g++) {
            const [f, w] = V[g], B = Z[g];
            B[0] = f * U[0] + w * U[2] + U[4], B[1] = f * U[1] + w * U[3] + U[5];
          }
          this._updateMatrix = !1;
        }
        [D]() {
          const H = this[J], U = [...this._radialGradientVector];
          if (U) {
            const [Z, V, , g, f] = U;
            U[0] = Z * H[0] + V * H[2] + H[4], U[1] = Z * H[1] + V * H[3] + H[5], U[3] = g * H[0] + f * H[2] + H[4], U[4] = g * H[1] + f * H[3] + H[5], this[x].u_radialGradientVector = U;
          }
        }
        [Q](H, U) {
          function Z(q, si) {
            return q == null && si == null ? !0 : q == null || si == null ? !1 : q[0] === si[0] && q[1] === si[1] && q[2] === si[2] && q[3] === si[3];
          }
          const V = this[x].u_texSampler;
          if (!V)
            return;
          const {
            width: g,
            height: f
          } = V._img, w = U.srcRect;
          let B = U.rect || [0, 0];
          if (U.rotated && (B = [-B[1], B[0], B[3], B[2]]), B[2] == null && (B[2] = w ? w[2] : g), B[3] == null && (B[3] = w ? w[3] : f), U.hidden)
            H.textureCoord = H.positions.map(() => [-1, -1, -1]);
          else if (!H.textureCoord || !Z(this[R].rect, U.rect) || this[R].hidden !== U.hidden || this[R].rotated !== U.rotated) {
            let q = null;
            U.rotated && (q = c.mat2d.rotate(Array.of(0, 0, 0, 0, 0, 0), c.mat2d.fromValues(1, 0, 0, 1, 0, 0), 0.5 * Math.PI), q = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), q, [0, -B[2]])), H.textureCoord = H.position0.map(([si, bi, mi]) => {
              if (1 / mi > 0) {
                if (U.rotated) {
                  const Zi = si * q[0] + bi * q[2] + q[4], ci = si * q[1] + bi * q[3] + q[5];
                  [si, bi] = [Zi, ci];
                }
                const oi = M([si, bi], [B[0] / B[2], B[1] / B[3], B[2], B[3]], U);
                return U.repeat && (oi[2] = 1), oi;
              }
              return [-1, -1, -1];
            });
          }
          if (w) {
            const q = [w[0] / g, w[1] / f, w[2] / g, w[3] / f];
            H.attributes.a_sourceRect = H.positions.map(() => [...q]);
          } else
            H.attributes.a_sourceRect = H.positions.map(() => [0, 0, 0, 0]);
        }
        accurate(H) {
          if (!this.contours)
            return;
          if (this.contours.path) {
            const Z = this.contours.simplify, V = k(this.contours.path, 2 * H, Z);
            this[b] = null, this[h] = V;
          }
        }
        canIgnore() {
          const H = this[S] == null || this[S].lineWidth === 0 || this[T][3] === 0, U = this[Y] == null || this[y][3] === 0, Z = this[x].u_radialGradientVector == null, V = this[x].u_texSampler == null;
          return this[O] === 0 || this[li] == null && H && U && Z && V && !this.beforeRender && !this.afterRender;
        }
        // join: 'miter' or 'bevel'
        // cap: 'butt' or 'square'
        // lineDash: null
        // lineDashOffset: 0
        setStroke({
          thickness: H = 1,
          cap: U = "butt",
          join: Z = "miter",
          miterLimit: V = 10,
          color: g = [0, 0, 0, 0],
          lineDash: f = null,
          lineDashOffset: w = 0,
          roundSegments: B = 20
        } = {}) {
          return this[b] = null, this[S] = new K.default({
            lineWidth: H,
            lineCap: U,
            lineJoin: Z,
            miterLimit: V,
            roundSegments: B
          }), typeof g == "string" && (g = Object(o.default)(g)), this[T] = g, this[S].lineDash = f, this[S].lineDashOffset = w, this;
        }
        setFill({
          rule: H = this.fillRule,
          color: U = [0, 0, 0, 0]
        } = {}) {
          return this[b] = null, this[Y] = {
            rule: H
          }, typeof U == "string" && (U = Object(o.default)(U)), this[y] = U, this;
        }
        /**
          options: {
            scale: false,
            repeat: false,
            rotated: false,
            rect: [10, 10],
            srcRect: [...],
            hidden: false,
          }
         */
        setTexture(H, U = {}) {
          if (H && H.image) {
            const {
              image: Z,
              rect: V
            } = H;
            if (H = Z, U.rect)
              for (let g = 0; g < U.rect.length; g++)
                V[g] = U.rect[g];
            U.rect = V;
          }
          return this[Y] || this.setFill(), this.setUniforms({
            u_texSampler: H
          }), this[b] && this[Q](this[b], U), this[R] = U, this;
        }
        setCircularGradient({
          vector: H,
          colors: U,
          type: Z = "fill"
        } = {}) {
          if (H.length !== 3)
            throw new TypeError("Invalid linearGradient.");
          this.setGradient({
            vector: H,
            colors: U,
            type: Z
          });
        }
        setLinearGradient({
          vector: H,
          colors: U,
          type: Z = "fill"
        } = {}) {
          if (H.length !== 4)
            throw new TypeError("Invalid linearGradient.");
          this.setGradient({
            vector: H,
            colors: U,
            type: Z
          });
        }
        setRadialGradient({
          vector: H,
          colors: U,
          type: Z = "fill"
        } = {}) {
          if (H.length !== 6)
            throw new TypeError("Invalid radialGradient.");
          this.setGradient({
            vector: H,
            colors: U,
            type: Z
          });
        }
        /**
          vector: [x0, y0, r0, x1, y1, r1],
          colors: [{offset:0, color}, {offset:1, color}, ...],
         */
        setGradient({
          vector: H,
          colors: U,
          type: Z = "fill"
        } = {}) {
          U = U.map(({
            offset: f,
            color: w
          }) => (typeof w == "string" && (w = Object(o.default)(w)), {
            offset: f,
            color: w
          })), this[F] = this[F] || {}, this[F][Z] = {
            vector: H,
            colors: U
          }, U.sort((f, w) => f.offset - w.offset);
          const V = [];
          U.forEach(({
            offset: f,
            color: w
          }) => {
            V.push(f, ...w);
          });
          let g;
          if (H.length === 4 ? g = [H[0], H[1], 0, H[2], H[3], 0] : g = [...H], V.length < 40 && V.push(-1), V.length > 40)
            throw new Error("Too many colors, should be less than 8 colors");
          return this._radialGradientVector = g, this[x].u_colorSteps = V, Z === "fill" ? this[x].u_gradientType = 1 : this[x].u_gradientType = 0, this[D](), this;
        }
        setUniforms(H = {}) {
          return Object.assign(this[x], H), this;
        }
        setTransform(...H) {
          const U = this[J];
          return c.mat2d.equals(H, U) || (this[J] = H, delete this[N], this._updateMatrix = !0), this;
        }
        transform(...H) {
          const U = this[J];
          return this[J] = c.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), U, H), delete this[N], this._updateMatrix = !0, this;
        }
        translate(H, U) {
          let Z = c.mat2d.create();
          return Z = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), Z, [H, U]), this.transform(...Z);
        }
        rotate(H, [U, Z] = [0, 0]) {
          let V = c.mat2d.create();
          return V = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), V, [U, Z]), V = c.mat2d.rotate(Array.of(0, 0, 0, 0, 0, 0), V, H), V = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), V, [-U, -Z]), this.transform(...V);
        }
        scale(H, U = H, [Z, V] = [0, 0]) {
          let g = c.mat2d.create();
          return g = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), g, [Z, V]), g = c.mat2d.scale(Array.of(0, 0, 0, 0, 0, 0), g, [H, U]), g = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), g, [-Z, -V]), this.transform(...g);
        }
        skew(H, U = H, [Z, V] = [0, 0]) {
          let g = c.mat2d.create();
          return g = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), g, [Z, V]), g = c.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), g, c.mat2d.fromValues(1, Math.tan(U), Math.tan(H), 1, 0, 0)), g = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), g, [-Z, -V]), this.transform(...g);
        }
        clearFilter() {
          return this.setColorTransform(null), this[v].length = 0, this;
        }
        setColorTransform(...H) {
          return H[0] === null ? this.setUniforms({
            u_filterFlag: 0,
            u_colorMatrix: 0
          }) : this.setUniforms({
            u_filterFlag: 1,
            u_colorMatrix: H
          }), this;
        }
        // apply linear color transform
        transformColor(...H) {
          let U = this.uniforms.u_colorMatrix;
          return U ? U = Object(e.multiply)(U, H) : U = H, this.setColorTransform(...U), this;
        }
        blur(H) {
          return this[v].push(`blur(${H}px)`), this;
        }
        brightness(H = 1) {
          return this[v].push(`brightness(${100 * H}%)`), this.transformColor(...Object(e.brightness)(H));
        }
        contrast(H = 1) {
          return this[v].push(`contrast(${100 * H}%)`), this.transformColor(...Object(e.contrast)(H));
        }
        dropShadow(H, U, Z = 0, V = [0, 0, 0, 1]) {
          return Array.isArray(V) && (V = Object(a.default)(V)), this[v].push(`drop-shadow(${H}px ${U}px ${Z}px ${V})`), this;
        }
        grayscale(H = 1) {
          return this[v].push(`grayscale(${100 * H}%)`), this.transformColor(...Object(e.grayscale)(H));
        }
        // https://github.com/phoboslab/WebGLImageFilter/blob/master/webgl-image-filter.js#L371
        hueRotate(H = 0) {
          return this[v].push(`hue-rotate(${H}deg)`), this.transformColor(...Object(e.hueRotate)(H));
        }
        invert(H = 1) {
          return this[v].push(`invert(${100 * H}%)`), this.transformColor(...Object(e.invert)(H));
        }
        opacity(H = 1) {
          return this[v].push(`opacity(${100 * H}%)`), this.transformColor(...Object(e.opacity)(H));
        }
        saturate(H = 1) {
          return this[v].push(`saturate(${100 * H}%)`), this.transformColor(...Object(e.saturate)(H));
        }
        sepia(H = 1) {
          return this[v].push(`sepia(${100 * H}%)`), this.transformColor(...Object(e.sepia)(H));
        }
        url(H) {
          return this[v].push(`url(${H})`), this;
        }
        isPointCollision(H, U, Z = "both") {
          const V = this.meshData, {
            positions: g,
            cells: f
          } = V, w = this.invertMatrix, B = w[0] * H + w[2] * U + w[4], q = w[1] * H + w[3] * U + w[5], si = this.boundingBox;
          if (B < si[0][0] || B > si[1][0] || q < si[0][1] || q > si[1][1])
            return !1;
          function bi([mi, oi], [Zi, ci], [ni, Gi]) {
            const hi = ni - Zi, Wi = Gi - ci, Ii = ((mi - Zi) * hi + (oi - ci) * Wi) / (hi ** 2 + Wi ** 2);
            return Ii >= 0 && Ii <= 1;
          }
          for (let mi = 0; mi < f.length; mi++) {
            const oi = f[mi];
            if (Z === "fill" && oi[0] >= V.fillPointCount)
              break;
            if (Z === "stroke" && oi[0] < V.fillPointCount)
              continue;
            const [[Zi, ci], [ni, Gi], [hi, Wi]] = oi.map((Li) => g[Li]), Ii = Math.sign((H - Zi) * (Gi - ci) - (ni - Zi) * (U - ci));
            if (Ii === 0 && bi([H, U], [Zi, ci], [ni, Gi]))
              return !0;
            const xi = Math.sign((H - ni) * (Wi - Gi) - (hi - ni) * (U - Gi));
            if (xi === 0 && bi([H, U], [ni, Gi], [hi, Wi]))
              return !0;
            const yi = Math.sign((H - hi) * (ci - Wi) - (Zi - hi) * (U - Wi));
            if (yi === 0 && bi([H, U], [hi, Wi], [Zi, ci]) || Ii === 1 && xi === 1 && yi === 1 || Ii === -1 && xi === -1 && yi === -1)
              return !0;
          }
          return !1;
        }
        isPointInFill(H, U) {
          return this.isPointCollision(H, U, "fill");
        }
        isPointInStroke(H, U) {
          return this.isPointCollision(H, U, "stroke");
        }
        addPass(H, U = {}) {
          let {
            width: Z,
            height: V
          } = U, g = t(U, ["width", "height"]);
          const f = new G.default();
          f.rect(0, 0, Z, V);
          const w = new j(f, {
            width: Z,
            height: V
          });
          w.setUniforms(g), w.setProgram(H), this[ti].push(w);
        }
      }
    },
    /* 57 */
    /***/
    function(n, l, i) {
      i.r(l);
      var c = i(58);
      i(1).glMatrix.setMatrixArrayType(Array), l.default = c.Stroke;
    },
    /* 58 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "Stroke", function() {
        return r;
      });
      var c = i(49);
      i(1).glMatrix.setMatrixArrayType(Array);
      const m = Object(c.create)(), L = Object(c.create)(), K = Object(c.create)(), u = Object(c.create)(), a = Object(c.create)(), e = 1e20;
      class r {
        constructor({
          lineWidth: I = 1,
          lineJoin: o = "miter",
          miterLimit: G = 10,
          lineCap: d = "butt",
          roundSegments: t = 20
        } = {}) {
          this.lineWidth = I, this.lineJoin = o, this.miterLimit = G, this.lineCap = d, this.roundSegments = t, this._normal = null;
        }
        build(I, o = !1) {
          let G = I.length;
          if (I = [...I], G < 2)
            return I;
          o && ((I[0][0] !== I[G - 1][0] || I[0][1] !== I[G - 1][1]) && I.push([...I[0]]), I.push([...I[1]])), G = I.length, this._normal = null;
          const d = {
            left: [],
            right: []
          }, t = this.lineWidth / 2, s = this.lineCap;
          if (!o && s === "square") {
            Object(c.direction)(L, I[0], I[1]), Object(c.scaleAndAdd)(I[0], I[0], L, t);
            const h = I.length - 1;
            Object(c.direction)(L, I[h], I[h - 1]), Object(c.scaleAndAdd)(I[h], I[h], L, t);
          }
          for (let h = 1; h < G; h++) {
            const S = I[h - 1], Y = I[h], T = I[h + 1];
            this._seg(d, S, Y, T, t, o);
          }
          return !o && s === "round" && p(d, this.roundSegments), [...d.left, ...d.right.reverse()];
        }
        _seg(I, o, G, d, t, s) {
          const b = this.lineJoin === "bevel", h = this.lineJoin === "round";
          if (Object(c.direction)(L, G, o), this._normal || (this._normal = Object(c.create)(), Object(c.normal)(this._normal, L)), I.left.length || W(I, o, this._normal, t), !d)
            Object(c.normal)(this._normal, L), s ? W(I, o, this._normal, t) : W(I, G, this._normal, t);
          else {
            Object(c.direction)(K, d, G);
            let S = Object(c.computeMiter)(u, a, L, K, t);
            S = Math.min(S, e);
            const Y = Object(c.dot)(u, this._normal) < 0 ? -1 : 1;
            let T = b || h;
            if (!T && this.lineJoin === "miter" && S / t > this.miterLimit && (T = !0), T) {
              Object(c.scaleAndAdd)(m, G, this._normal, -t * Y), X(I, m, Y);
              let y = 1 / 0;
              o && (y = Math.min(y, Math.hypot(G[0] - o[0], G[1] - o[1]))), d && (y = Math.min(y, Math.hypot(d[0] - G[0], d[1] - G[1])));
              const J = Math.max(t, Math.min(S, y));
              if (Object(c.scaleAndAdd)(m, G, a, J * Y), X(I, m, -Y), d)
                if (Object(c.normal)(m, K), Object(c.copy)(this._normal, m), Object(c.scaleAndAdd)(m, G, m, -t * Y), h) {
                  const N = Object(c.clone)(m), x = Y > 0 ? I.left[I.left.length - 1] : I.right[I.right.length - 1], R = Object(c.clone)(G), z = Object(c.sub)(Object(c.create)(), x, R), Q = Object(c.sub)(Object(c.create)(), N, R), P = Math.PI / this.roundSegments;
                  for (let D = 0; D < this.roundSegments && (Object(c.rotate)(z, z, [0, 0], Y * P), Math.sign(Object(c.cross)(m, z, Q)[2]) === Y); D++)
                    Object(c.add)(m, z, R), X(I, m, Y);
                  X(I, N, Y);
                } else
                  X(I, m, Y);
            } else
              W(I, G, a, S), Object(c.copy)(this._normal, a);
          }
        }
      }
      function X(C, I, o) {
        o > 0 ? C.left.push(Object(c.clone)(I)) : C.right.push(Object(c.clone)(I));
      }
      function W(C, I, o, G, d = -1) {
        Object(c.scaleAndAdd)(m, I, o, -G), X(C, m, -d), Object(c.scaleAndAdd)(m, I, o, G), X(C, m, d);
      }
      function p({
        left: C,
        right: I
      }, o) {
        const G = Object(c.create)(), d = Object(c.create)();
        let t = C[0], s = I[0], b = [0.5 * (t[0] + s[0]), 0.5 * (t[1] + s[1])];
        Object(c.sub)(d, t, b);
        for (let h = 1; h <= o; h++) {
          const S = -1 * Math.PI * h / o;
          Object(c.rotate)(G, d, [0, 0], S), Object(c.add)(m, b, G), C.unshift(Object(c.clone)(m));
        }
        t = I[I.length - 1], s = C[C.length - 1], b = [0.5 * (t[0] + s[0]), 0.5 * (t[1] + s[1])], Object(c.sub)(d, t, b);
        for (let h = 1; h <= o; h++) {
          const S = -1 * Math.PI * h / o;
          Object(c.rotate)(G, d, [0, 0], S), Object(c.add)(m, b, G), I.push(Object(c.clone)(m));
        }
      }
    },
    /* 59 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "isUnitTransform", function() {
        return c;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(m) {
        return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
      }
    },
    /* 60 */
    /***/
    function(n, l, i) {
      i(1).glMatrix.setMatrixArrayType(Array);
      var c = i(61), m = i(62);
      n.exports = function(L, K) {
        if (K = K || {}, L = L.filter(function(o) {
          return o.length > 2;
        }), L.length === 0)
          return {
            positions: [],
            cells: []
          };
        typeof K.vertexSize != "number" && (K.vertexSize = L[0][0].length), L = L.map(function(o) {
          return o.reduce(function(G, d) {
            return G.concat(d);
          });
        });
        const u = K.rule === "evenodd" ? c.WINDING_ODD : c.WINDING_NONZERO;
        for (var a = c.tesselate(m({
          contours: L,
          windingRule: u,
          elementType: c.POLYGONS,
          polySize: 3,
          vertexSize: 2
        }, K)), e = [], r = 0; r < a.vertices.length; r += K.vertexSize) {
          var X = a.vertices.slice(r, r + K.vertexSize);
          e.push(X);
        }
        var W = [];
        for (r = 0; r < a.elements.length; r += 3) {
          var p = a.elements[r], C = a.elements[r + 1], I = a.elements[r + 2];
          W.push([p, C, I]);
        }
        return {
          positions: e,
          cells: W
        };
      };
    },
    /* 61 */
    /***/
    function(n, l, i) {
      i(1).glMatrix.setMatrixArrayType(Array);
      var c = {}, m = {};
      n.exports = c, c.WINDING_ODD = 0, c.WINDING_NONZERO = 1, c.WINDING_POSITIVE = 2, c.WINDING_NEGATIVE = 3, c.WINDING_ABS_GEQ_TWO = 4, c.POLYGONS = 0, c.CONNECTED_POLYGONS = 1, c.BOUNDARY_CONTOURS = 2, c.tesselate = function(d) {
        for (var t = d.debug || !1, s = new G(), b = 0; b < d.contours.length; b++)
          s.addContour(d.vertexSize || 2, d.contours[b]);
        return s.tesselate(d.windingRule || c.WINDING_ODD, d.elementType || c.POLYGONS, d.polySize || 3, d.vertexSize || 2, d.normal || [0, 0, 1]), {
          vertices: s.vertices,
          vertexIndices: s.vertexIndices,
          vertexCount: s.vertexCount,
          elements: s.elements,
          elementCount: s.elementCount,
          mesh: t ? s.mesh : void 0
        };
      };
      var L = function(d) {
        if (!d)
          throw "Assertion Failed!";
      };
      function K() {
        this.next = null, this.prev = null, this.anEdge = null, this.coords = [0, 0, 0], this.s = 0, this.t = 0, this.pqHandle = 0, this.n = 0, this.idx = 0;
      }
      function u() {
        this.next = null, this.prev = null, this.anEdge = null, this.trail = null, this.n = 0, this.marked = !1, this.inside = !1;
      }
      function a(d) {
        this.next = null, this.Sym = null, this.Onext = null, this.Lnext = null, this.Org = null, this.Lface = null, this.activeRegion = null, this.winding = 0, this.side = d;
      }
      a.prototype = {
        get Rface() {
          return this.Sym.Lface;
        },
        set Rface(d) {
          this.Sym.Lface = d;
        },
        get Dst() {
          return this.Sym.Org;
        },
        set Dst(d) {
          this.Sym.Org = d;
        },
        get Oprev() {
          return this.Sym.Lnext;
        },
        set Oprev(d) {
          this.Sym.Lnext = d;
        },
        get Lprev() {
          return this.Onext.Sym;
        },
        set Lprev(d) {
          this.Onext.Sym = d;
        },
        get Dprev() {
          return this.Lnext.Sym;
        },
        set Dprev(d) {
          this.Lnext.Sym = d;
        },
        get Rprev() {
          return this.Sym.Onext;
        },
        set Rprev(d) {
          this.Sym.Onext = d;
        },
        get Dnext() {
          return (
            /*this.Rprev*/
            this.Sym.Onext.Sym
          );
        },
        /* 3 pointers */
        set Dnext(d) {
          this.Sym.Onext.Sym = d;
        },
        /* 3 pointers */
        get Rnext() {
          return (
            /*this.Oprev*/
            this.Sym.Lnext.Sym
          );
        },
        /* 3 pointers */
        set Rnext(d) {
          this.Sym.Lnext.Sym = d;
        }
        /* 3 pointers */
      };
      function e() {
        var d = new K(), t = new u(), s = new a(0), b = new a(1);
        d.next = d.prev = d, d.anEdge = null, t.next = t.prev = t, t.anEdge = null, t.trail = null, t.marked = !1, t.inside = !1, s.next = s, s.Sym = b, s.Onext = null, s.Lnext = null, s.Org = null, s.Lface = null, s.winding = 0, s.activeRegion = null, b.next = b, b.Sym = s, b.Onext = null, b.Lnext = null, b.Org = null, b.Lface = null, b.winding = 0, b.activeRegion = null, this.vHead = d, this.fHead = t, this.eHead = s, this.eHeadSym = b;
      }
      e.prototype = {
        /* MakeEdge creates a new pair of half-edges which form their own loop.
        * No vertex or face structures are allocated, but these must be assigned
        * before the current edge operation is completed.
        */
        //static TESShalfEdge *MakeEdge( TESSmesh* mesh, TESShalfEdge *eNext )
        makeEdge_: function(d) {
          var t = new a(0), s = new a(1);
          d.Sym.side < d.side && (d = d.Sym);
          var b = d.Sym.next;
          return s.next = b, b.Sym.next = t, t.next = d, d.Sym.next = s, t.Sym = s, t.Onext = t, t.Lnext = s, t.Org = null, t.Lface = null, t.winding = 0, t.activeRegion = null, s.Sym = t, s.Onext = s, s.Lnext = t, s.Org = null, s.Lface = null, s.winding = 0, s.activeRegion = null, t;
        },
        /* Splice( a, b ) is best described by the Guibas/Stolfi paper or the
        * CS348a notes (see mesh.h).  Basically it modifies the mesh so that
        * a->Onext and b->Onext are exchanged.  This can have various effects
        * depending on whether a and b belong to different face or vertex rings.
        * For more explanation see tessMeshSplice() below.
        */
        // static void Splice( TESShalfEdge *a, TESShalfEdge *b )
        splice_: function(d, t) {
          var s = d.Onext, b = t.Onext;
          s.Sym.Lnext = t, b.Sym.Lnext = d, d.Onext = b, t.Onext = s;
        },
        /* MakeVertex( newVertex, eOrig, vNext ) attaches a new vertex and makes it the
        * origin of all edges in the vertex loop to which eOrig belongs. "vNext" gives
        * a place to insert the new vertex in the global vertex list.  We insert
        * the new vertex *before* vNext so that algorithms which walk the vertex
        * list will not see the newly created vertices.
        */
        //static void MakeVertex( TESSvertex *newVertex, TESShalfEdge *eOrig, TESSvertex *vNext )
        makeVertex_: function(d, t, s) {
          var b = d;
          L(b !== null);
          var h = s.prev;
          b.prev = h, h.next = b, b.next = s, s.prev = b, b.anEdge = t;
          var S = t;
          do
            S.Org = b, S = S.Onext;
          while (S !== t);
        },
        /* MakeFace( newFace, eOrig, fNext ) attaches a new face and makes it the left
        * face of all edges in the face loop to which eOrig belongs.  "fNext" gives
        * a place to insert the new face in the global face list.  We insert
        * the new face *before* fNext so that algorithms which walk the face
        * list will not see the newly created faces.
        */
        // static void MakeFace( TESSface *newFace, TESShalfEdge *eOrig, TESSface *fNext )
        makeFace_: function(d, t, s) {
          var b = d;
          L(b !== null);
          var h = s.prev;
          b.prev = h, h.next = b, b.next = s, s.prev = b, b.anEdge = t, b.trail = null, b.marked = !1, b.inside = s.inside;
          var S = t;
          do
            S.Lface = b, S = S.Lnext;
          while (S !== t);
        },
        /* KillEdge( eDel ) destroys an edge (the half-edges eDel and eDel->Sym),
        * and removes from the global edge list.
        */
        //static void KillEdge( TESSmesh *mesh, TESShalfEdge *eDel )
        killEdge_: function(d) {
          d.Sym.side < d.side && (d = d.Sym);
          var t = d.next, s = d.Sym.next;
          t.Sym.next = s, s.Sym.next = t;
        },
        /* KillVertex( vDel ) destroys a vertex and removes it from the global
        * vertex list.  It updates the vertex loop to point to a given new vertex.
        */
        //static void KillVertex( TESSmesh *mesh, TESSvertex *vDel, TESSvertex *newOrg )
        killVertex_: function(d, t) {
          var s = d.anEdge, b = s;
          do
            b.Org = t, b = b.Onext;
          while (b !== s);
          var h = d.prev, S = d.next;
          S.prev = h, h.next = S;
        },
        /* KillFace( fDel ) destroys a face and removes it from the global face
        * list.  It updates the face loop to point to a given new face.
        */
        //static void KillFace( TESSmesh *mesh, TESSface *fDel, TESSface *newLface )
        killFace_: function(d, t) {
          var s = d.anEdge, b = s;
          do
            b.Lface = t, b = b.Lnext;
          while (b !== s);
          var h = d.prev, S = d.next;
          S.prev = h, h.next = S;
        },
        /****************** Basic Edge Operations **********************/
        /* tessMeshMakeEdge creates one edge, two vertices, and a loop (face).
        * The loop consists of the two new half-edges.
        */
        //TESShalfEdge *tessMeshMakeEdge( TESSmesh *mesh )
        makeEdge: function() {
          var d = new K(), t = new K(), s = new u(), b = this.makeEdge_(this.eHead);
          return this.makeVertex_(d, b, this.vHead), this.makeVertex_(t, b.Sym, this.vHead), this.makeFace_(s, b, this.fHead), b;
        },
        /* tessMeshSplice( eOrg, eDst ) is the basic operation for changing the
        * mesh connectivity and topology.  It changes the mesh so that
        *	eOrg->Onext <- OLD( eDst->Onext )
        *	eDst->Onext <- OLD( eOrg->Onext )
        * where OLD(...) means the value before the meshSplice operation.
        *
        * This can have two effects on the vertex structure:
        *  - if eOrg->Org != eDst->Org, the two vertices are merged together
        *  - if eOrg->Org == eDst->Org, the origin is split into two vertices
        * In both cases, eDst->Org is changed and eOrg->Org is untouched.
        *
        * Similarly (and independently) for the face structure,
        *  - if eOrg->Lface == eDst->Lface, one loop is split into two
        *  - if eOrg->Lface != eDst->Lface, two distinct loops are joined into one
        * In both cases, eDst->Lface is changed and eOrg->Lface is unaffected.
        *
        * Some special cases:
        * If eDst == eOrg, the operation has no effect.
        * If eDst == eOrg->Lnext, the new face will have a single edge.
        * If eDst == eOrg->Lprev, the old face will have a single edge.
        * If eDst == eOrg->Onext, the new vertex will have a single edge.
        * If eDst == eOrg->Oprev, the old vertex will have a single edge.
        */
        //int tessMeshSplice( TESSmesh* mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst )
        splice: function(d, t) {
          var s = !1, b = !1;
          if (d !== t) {
            if (t.Org !== d.Org && (b = !0, this.killVertex_(t.Org, d.Org)), t.Lface !== d.Lface && (s = !0, this.killFace_(t.Lface, d.Lface)), this.splice_(t, d), !b) {
              var h = new K();
              this.makeVertex_(h, t, d.Org), d.Org.anEdge = d;
            }
            if (!s) {
              var S = new u();
              this.makeFace_(S, t, d.Lface), d.Lface.anEdge = d;
            }
          }
        },
        /* tessMeshDelete( eDel ) removes the edge eDel.  There are several cases:
        * if (eDel->Lface != eDel->Rface), we join two loops into one; the loop
        * eDel->Lface is deleted.  Otherwise, we are splitting one loop into two;
        * the newly created loop will contain eDel->Dst.  If the deletion of eDel
        * would create isolated vertices, those are deleted as well.
        *
        * This function could be implemented as two calls to tessMeshSplice
        * plus a few calls to memFree, but this would allocate and delete
        * unnecessary vertices and faces.
        */
        //int tessMeshDelete( TESSmesh *mesh, TESShalfEdge *eDel )
        delete: function(d) {
          var t = d.Sym, s = !1;
          if (d.Lface !== d.Rface && (s = !0, this.killFace_(d.Lface, d.Rface)), d.Onext === d)
            this.killVertex_(d.Org, null);
          else if (d.Rface.anEdge = d.Oprev, d.Org.anEdge = d.Onext, this.splice_(d, d.Oprev), !s) {
            var b = new u();
            this.makeFace_(b, d, d.Lface);
          }
          t.Onext === t ? (this.killVertex_(t.Org, null), this.killFace_(t.Lface, null)) : (d.Lface.anEdge = t.Oprev, t.Org.anEdge = t.Onext, this.splice_(t, t.Oprev)), this.killEdge_(d);
        },
        /******************** Other Edge Operations **********************/
        /* All these routines can be implemented with the basic edge
        * operations above.  They are provided for convenience and efficiency.
        */
        /* tessMeshAddEdgeVertex( eOrg ) creates a new edge eNew such that
        * eNew == eOrg->Lnext, and eNew->Dst is a newly created vertex.
        * eOrg and eNew will have the same left face.
        */
        // TESShalfEdge *tessMeshAddEdgeVertex( TESSmesh *mesh, TESShalfEdge *eOrg );
        addEdgeVertex: function(d) {
          var t = this.makeEdge_(d), s = t.Sym;
          this.splice_(t, d.Lnext), t.Org = d.Dst;
          var b = new K();
          return this.makeVertex_(b, s, t.Org), t.Lface = s.Lface = d.Lface, t;
        },
        /* tessMeshSplitEdge( eOrg ) splits eOrg into two edges eOrg and eNew,
        * such that eNew == eOrg->Lnext.  The new vertex is eOrg->Dst == eNew->Org.
        * eOrg and eNew will have the same left face.
        */
        // TESShalfEdge *tessMeshSplitEdge( TESSmesh *mesh, TESShalfEdge *eOrg );
        splitEdge: function(d, t) {
          var s = this.addEdgeVertex(d), b = s.Sym;
          return this.splice_(d.Sym, d.Sym.Oprev), this.splice_(d.Sym, b), d.Dst = b.Org, b.Dst.anEdge = b.Sym, b.Rface = d.Rface, b.winding = d.winding, b.Sym.winding = d.Sym.winding, b;
        },
        /* tessMeshConnect( eOrg, eDst ) creates a new edge from eOrg->Dst
        * to eDst->Org, and returns the corresponding half-edge eNew.
        * If eOrg->Lface == eDst->Lface, this splits one loop into two,
        * and the newly created loop is eNew->Lface.  Otherwise, two disjoint
        * loops are merged into one, and the loop eDst->Lface is destroyed.
        *
        * If (eOrg == eDst), the new face will have only two edges.
        * If (eOrg->Lnext == eDst), the old face is reduced to a single edge.
        * If (eOrg->Lnext->Lnext == eDst), the old face is reduced to two edges.
        */
        // TESShalfEdge *tessMeshConnect( TESSmesh *mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst );
        connect: function(d, t) {
          var s = !1, b = this.makeEdge_(d), h = b.Sym;
          if (t.Lface !== d.Lface && (s = !0, this.killFace_(t.Lface, d.Lface)), this.splice_(b, d.Lnext), this.splice_(h, t), b.Org = d.Dst, h.Org = t.Org, b.Lface = h.Lface = d.Lface, d.Lface.anEdge = h, !s) {
            var S = new u();
            this.makeFace_(S, b, d.Lface);
          }
          return b;
        },
        /* tessMeshZapFace( fZap ) destroys a face and removes it from the
        * global face list.  All edges of fZap will have a NULL pointer as their
        * left face.  Any edges which also have a NULL pointer as their right face
        * are deleted entirely (along with any isolated vertices this produces).
        * An entire mesh can be deleted by zapping its faces, one at a time,
        * in any order.  Zapped faces cannot be used in further mesh operations!
        */
        zapFace: function(d) {
          var t = d.anEdge, s, b, h, S, Y;
          b = t.Lnext;
          do
            s = b, b = s.Lnext, s.Lface = null, s.Rface === null && (s.Onext === s ? this.killVertex_(s.Org, null) : (s.Org.anEdge = s.Onext, this.splice_(s, s.Oprev)), h = s.Sym, h.Onext === h ? this.killVertex_(h.Org, null) : (h.Org.anEdge = h.Onext, this.splice_(h, h.Oprev)), this.killEdge_(s));
          while (s != t);
          S = d.prev, Y = d.next, Y.prev = S, S.next = Y;
        },
        countFaceVerts_: function(d) {
          var t = d.anEdge, s = 0;
          do
            s++, t = t.Lnext;
          while (t !== d.anEdge);
          return s;
        },
        //int tessMeshMergeConvexFaces( TESSmesh *mesh, int maxVertsPerFace )
        mergeConvexFaces: function(d) {
          var t, s, b, h, S, Y, T;
          for (t = this.fHead.next; t !== this.fHead; t = t.next)
            if (t.inside)
              for (s = t.anEdge, S = s.Org; b = s.Lnext, h = s.Sym, h && h.Lface && h.Lface.inside && (Y = this.countFaceVerts_(t), T = this.countFaceVerts_(h.Lface), Y + T - 2 <= d && m.vertCCW(s.Lprev.Org, s.Org, h.Lnext.Lnext.Org) && m.vertCCW(h.Lprev.Org, h.Org, s.Lnext.Lnext.Org) && (b = h.Lnext, this.delete(h), s = null, h = null)), !(s && s.Lnext.Org === S); )
                s = b;
          return !0;
        },
        /* tessMeshCheckMesh( mesh ) checks a mesh for self-consistency.
        */
        check: function() {
          var d = this.fHead, t = this.vHead, s = this.eHead, b, h, S, Y, T, y;
          for (h = d, h = d; (b = h.next) !== d; h = b) {
            L(b.prev === h), T = b.anEdge;
            do
              L(T.Sym !== T), L(T.Sym.Sym === T), L(T.Lnext.Onext.Sym === T), L(T.Onext.Sym.Lnext === T), L(T.Lface === b), T = T.Lnext;
            while (T !== b.anEdge);
          }
          for (L(b.prev === h && b.anEdge === null), Y = t, Y = t; (S = Y.next) !== t; Y = S) {
            L(S.prev === Y), T = S.anEdge;
            do
              L(T.Sym !== T), L(T.Sym.Sym === T), L(T.Lnext.Onext.Sym === T), L(T.Onext.Sym.Lnext === T), L(T.Org === S), T = T.Onext;
            while (T !== S.anEdge);
          }
          for (L(S.prev === Y && S.anEdge === null), y = s, y = s; (T = y.next) !== s; y = T)
            L(T.Sym.next === y.Sym), L(T.Sym !== T), L(T.Sym.Sym === T), L(T.Org !== null), L(T.Dst !== null), L(T.Lnext.Onext.Sym === T), L(T.Onext.Sym.Lnext === T);
          L(T.Sym.next === y.Sym && T.Sym === this.eHeadSym && T.Sym.Sym === T && T.Org === null && T.Dst === null && T.Lface === null && T.Rface === null);
        }
      }, m.vertEq = function(d, t) {
        return d.s === t.s && d.t === t.t;
      }, m.vertLeq = function(d, t) {
        return d.s < t.s || d.s === t.s && d.t <= t.t;
      }, m.transLeq = function(d, t) {
        return d.t < t.t || d.t === t.t && d.s <= t.s;
      }, m.edgeGoesLeft = function(d) {
        return m.vertLeq(d.Dst, d.Org);
      }, m.edgeGoesRight = function(d) {
        return m.vertLeq(d.Org, d.Dst);
      }, m.vertL1dist = function(d, t) {
        return Math.abs(d.s - t.s) + Math.abs(d.t - t.t);
      }, m.edgeEval = function(d, t, s) {
        L(m.vertLeq(d, t) && m.vertLeq(t, s));
        var b = t.s - d.s, h = s.s - t.s;
        return b + h > 0 ? b < h ? t.t - d.t + (d.t - s.t) * (b / (b + h)) : t.t - s.t + (s.t - d.t) * (h / (b + h)) : 0;
      }, m.edgeSign = function(d, t, s) {
        L(m.vertLeq(d, t) && m.vertLeq(t, s));
        var b = t.s - d.s, h = s.s - t.s;
        return b + h > 0 ? (t.t - s.t) * b + (t.t - d.t) * h : 0;
      }, m.transEval = function(d, t, s) {
        L(m.transLeq(d, t) && m.transLeq(t, s));
        var b = t.t - d.t, h = s.t - t.t;
        return b + h > 0 ? b < h ? t.s - d.s + (d.s - s.s) * (b / (b + h)) : t.s - s.s + (s.s - d.s) * (h / (b + h)) : 0;
      }, m.transSign = function(d, t, s) {
        L(m.transLeq(d, t) && m.transLeq(t, s));
        var b = t.t - d.t, h = s.t - t.t;
        return b + h > 0 ? (t.s - s.s) * b + (t.s - d.s) * h : 0;
      }, m.vertCCW = function(d, t, s) {
        return d.s * (t.t - s.t) + t.s * (s.t - d.t) + s.s * (d.t - t.t) >= 0;
      }, m.interpolate = function(d, t, s, b) {
        return d = d < 0 ? 0 : d, s = s < 0 ? 0 : s, d <= s ? s === 0 ? (t + b) / 2 : t + (b - t) * (d / (d + s)) : b + (t - b) * (s / (d + s));
      }, m.intersect = function(d, t, s, b, h) {
        var S, Y, T;
        m.vertLeq(d, t) || (T = d, d = t, t = T), m.vertLeq(s, b) || (T = s, s = b, b = T), m.vertLeq(d, s) || (T = d, d = s, s = T, T = t, t = b, b = T), m.vertLeq(s, t) ? m.vertLeq(t, b) ? (S = m.edgeEval(d, s, t), Y = m.edgeEval(s, t, b), S + Y < 0 && (S = -S, Y = -Y), h.s = m.interpolate(S, s.s, Y, t.s)) : (S = m.edgeSign(d, s, t), Y = -m.edgeSign(d, b, t), S + Y < 0 && (S = -S, Y = -Y), h.s = m.interpolate(S, s.s, Y, b.s)) : h.s = (s.s + t.s) / 2, m.transLeq(d, t) || (T = d, d = t, t = T), m.transLeq(s, b) || (T = s, s = b, b = T), m.transLeq(d, s) || (T = d, d = s, s = T, T = t, t = b, b = T), m.transLeq(s, t) ? m.transLeq(t, b) ? (S = m.transEval(d, s, t), Y = m.transEval(s, t, b), S + Y < 0 && (S = -S, Y = -Y), h.t = m.interpolate(S, s.t, Y, t.t)) : (S = m.transSign(d, s, t), Y = -m.transSign(d, b, t), S + Y < 0 && (S = -S, Y = -Y), h.t = m.interpolate(S, s.t, Y, b.t)) : h.t = (s.t + t.t) / 2;
      };
      function r() {
        this.key = null, this.next = null, this.prev = null;
      }
      function X(d, t) {
        this.head = new r(), this.head.next = this.head, this.head.prev = this.head, this.frame = d, this.leq = t;
      }
      X.prototype = {
        min: function() {
          return this.head.next;
        },
        max: function() {
          return this.head.prev;
        },
        insert: function(d) {
          return this.insertBefore(this.head, d);
        },
        search: function(d) {
          var t = this.head;
          do
            t = t.next;
          while (t.key !== null && !this.leq(this.frame, d, t.key));
          return t;
        },
        insertBefore: function(d, t) {
          do
            d = d.prev;
          while (d.key !== null && !this.leq(this.frame, d.key, t));
          var s = new r();
          return s.key = t, s.next = d.next, d.next.prev = s, s.prev = d, d.next = s, s;
        },
        delete: function(d) {
          d.next.prev = d.prev, d.prev.next = d.next;
        }
      };
      function W() {
        this.handle = null;
      }
      function p() {
        this.key = null, this.node = null;
      }
      function C(d, t) {
        this.size = 0, this.max = d, this.nodes = [], this.nodes.length = d + 1;
        var s;
        for (s = 0; s < this.nodes.length; s++)
          this.nodes[s] = new W();
        for (this.handles = [], this.handles.length = d + 1, s = 0; s < this.handles.length; s++)
          this.handles[s] = new p();
        this.initialized = !1, this.freeList = 0, this.leq = t, this.nodes[1].handle = 1, this.handles[1].key = null;
      }
      C.prototype = {
        floatDown_: function(d) {
          var t = this.nodes, s = this.handles, b, h, S;
          for (b = t[d].handle; ; ) {
            if (S = d << 1, S < this.size && this.leq(s[t[S + 1].handle].key, s[t[S].handle].key) && ++S, L(S <= this.max), h = t[S].handle, S > this.size || this.leq(s[b].key, s[h].key)) {
              t[d].handle = b, s[b].node = d;
              break;
            }
            t[d].handle = h, s[h].node = d, d = S;
          }
        },
        floatUp_: function(d) {
          var t = this.nodes, s = this.handles, b, h, S;
          for (b = t[d].handle; ; ) {
            if (S = d >> 1, h = t[S].handle, S === 0 || this.leq(s[h].key, s[b].key)) {
              t[d].handle = b, s[b].node = d;
              break;
            }
            t[d].handle = h, s[h].node = d, d = S;
          }
        },
        init: function() {
          for (var d = this.size; d >= 1; --d)
            this.floatDown_(d);
          this.initialized = !0;
        },
        min: function() {
          return this.handles[this.nodes[1].handle].key;
        },
        /* really pqHeapInsert */
        /* returns INV_HANDLE iff out of memory */
        //PQhandle pqHeapInsert( TESSalloc* alloc, PriorityQHeap *pq, PQkey keyNew )
        insert: function(d) {
          var t, s;
          if (t = ++this.size, t * 2 > this.max) {
            this.max *= 2;
            var b, h;
            for (h = this.nodes.length, this.nodes.length = this.max + 1, b = h; b < this.nodes.length; b++)
              this.nodes[b] = new W();
            for (h = this.handles.length, this.handles.length = this.max + 1, b = h; b < this.handles.length; b++)
              this.handles[b] = new p();
          }
          return this.freeList === 0 ? s = t : (s = this.freeList, this.freeList = this.handles[s].node), this.nodes[t].handle = s, this.handles[s].node = t, this.handles[s].key = d, this.initialized && this.floatUp_(t), s;
        },
        //PQkey pqHeapExtractMin( PriorityQHeap *pq )
        extractMin: function() {
          var d = this.nodes, t = this.handles, s = d[1].handle, b = t[s].key;
          return this.size > 0 && (d[1].handle = d[this.size].handle, t[d[1].handle].node = 1, t[s].key = null, t[s].node = this.freeList, this.freeList = s, --this.size, this.size > 0 && this.floatDown_(1)), b;
        },
        delete: function(d) {
          var t = this.nodes, s = this.handles, b;
          L(d >= 1 && d <= this.max && s[d].key !== null), b = s[d].node, t[b].handle = t[this.size].handle, s[t[b].handle].node = b, --this.size, b <= this.size && (b <= 1 || this.leq(s[t[b >> 1].handle].key, s[t[b].handle].key) ? this.floatDown_(b) : this.floatUp_(b)), s[d].key = null, s[d].node = this.freeList, this.freeList = d;
        }
      };
      function I() {
        this.eUp = null, this.nodeUp = null, this.windingNumber = 0, this.inside = !1, this.sentinel = !1, this.dirty = !1, this.fixUpperEdge = !1;
      }
      var o = {};
      o.regionBelow = function(d) {
        return d.nodeUp.prev.key;
      }, o.regionAbove = function(d) {
        return d.nodeUp.next.key;
      }, o.debugEvent = function(d) {
      }, o.addWinding = function(d, t) {
        d.winding += t.winding, d.Sym.winding += t.Sym.winding;
      }, o.edgeLeq = function(d, t, s) {
        var b = d.event, Y, T, h = t.eUp, S = s.eUp;
        if (h.Dst === b)
          return S.Dst === b ? m.vertLeq(h.Org, S.Org) ? m.edgeSign(S.Dst, h.Org, S.Org) <= 0 : m.edgeSign(h.Dst, S.Org, h.Org) >= 0 : m.edgeSign(S.Dst, b, S.Org) <= 0;
        if (S.Dst === b)
          return m.edgeSign(h.Dst, b, h.Org) >= 0;
        var Y = m.edgeEval(h.Dst, b, h.Org), T = m.edgeEval(S.Dst, b, S.Org);
        return Y >= T;
      }, o.deleteRegion = function(d, t) {
        t.fixUpperEdge && L(t.eUp.winding === 0), t.eUp.activeRegion = null, d.dict.delete(t.nodeUp);
      }, o.fixUpperEdge = function(d, t, s) {
        L(t.fixUpperEdge), d.mesh.delete(t.eUp), t.fixUpperEdge = !1, t.eUp = s, s.activeRegion = t;
      }, o.topLeftRegion = function(d, t) {
        var s = t.eUp.Org, b;
        do
          t = o.regionAbove(t);
        while (t.eUp.Org === s);
        if (t.fixUpperEdge) {
          if (b = d.mesh.connect(o.regionBelow(t).eUp.Sym, t.eUp.Lnext), b === null)
            return null;
          o.fixUpperEdge(d, t, b), t = o.regionAbove(t);
        }
        return t;
      }, o.topRightRegion = function(d) {
        var t = d.eUp.Dst;
        do
          d = o.regionAbove(d);
        while (d.eUp.Dst === t);
        return d;
      }, o.addRegionBelow = function(d, t, s) {
        var b = new I();
        return b.eUp = s, b.nodeUp = d.dict.insertBefore(t.nodeUp, b), b.fixUpperEdge = !1, b.sentinel = !1, b.dirty = !1, s.activeRegion = b, b;
      }, o.isWindingInside = function(d, t) {
        switch (d.windingRule) {
          case c.WINDING_ODD:
            return (t & 1) !== 0;
          case c.WINDING_NONZERO:
            return t !== 0;
          case c.WINDING_POSITIVE:
            return t > 0;
          case c.WINDING_NEGATIVE:
            return t < 0;
          case c.WINDING_ABS_GEQ_TWO:
            return t >= 2 || t <= -2;
        }
        return L(!1), !1;
      }, o.computeWinding = function(d, t) {
        t.windingNumber = o.regionAbove(t).windingNumber + t.eUp.winding, t.inside = o.isWindingInside(d, t.windingNumber);
      }, o.finishRegion = function(d, t) {
        var s = t.eUp, b = s.Lface;
        b.inside = t.inside, b.anEdge = s, o.deleteRegion(d, t);
      }, o.finishLeftRegions = function(d, t, s) {
        for (var b, Y, h = null, S = t, Y = t.eUp; S !== s; ) {
          if (S.fixUpperEdge = !1, h = o.regionBelow(S), b = h.eUp, b.Org != Y.Org) {
            if (!h.fixUpperEdge) {
              o.finishRegion(d, S);
              break;
            }
            b = d.mesh.connect(Y.Lprev, b.Sym), o.fixUpperEdge(d, h, b);
          }
          Y.Onext !== b && (d.mesh.splice(b.Oprev, b), d.mesh.splice(Y, b)), o.finishRegion(d, S), Y = h.eUp, S = h;
        }
        return Y;
      }, o.addRightEdges = function(d, t, s, b, h, S) {
        var Y, T, y, J, N = !0;
        y = s;
        do
          L(m.vertLeq(y.Org, y.Dst)), o.addRegionBelow(d, t, y.Sym), y = y.Onext;
        while (y !== b);
        for (h === null && (h = o.regionBelow(t).eUp.Rprev), T = t, J = h; Y = o.regionBelow(T), y = Y.eUp.Sym, y.Org === J.Org; )
          y.Onext !== J && (d.mesh.splice(y.Oprev, y), d.mesh.splice(J.Oprev, y)), Y.windingNumber = T.windingNumber - y.winding, Y.inside = o.isWindingInside(d, Y.windingNumber), T.dirty = !0, !N && o.checkForRightSplice(d, T) && (o.addWinding(y, J), o.deleteRegion(d, T), d.mesh.delete(J)), N = !1, T = Y, J = y;
        T.dirty = !0, L(T.windingNumber - y.winding === Y.windingNumber), S && o.walkDirtyRegions(d, T);
      }, o.spliceMergeVertices = function(d, t, s) {
        d.mesh.splice(t, s);
      }, o.vertexWeights = function(d, t, s) {
        var b = m.vertL1dist(t, d), h = m.vertL1dist(s, d), S = 0.5 * h / (b + h), Y = 0.5 * b / (b + h);
        d.coords[0] += S * t.coords[0] + Y * s.coords[0], d.coords[1] += S * t.coords[1] + Y * s.coords[1], d.coords[2] += S * t.coords[2] + Y * s.coords[2];
      }, o.getIntersectData = function(d, t, s, b, h, S) {
        t.coords[0] = t.coords[1] = t.coords[2] = 0, t.idx = -1, o.vertexWeights(t, s, b), o.vertexWeights(t, h, S);
      }, o.checkForRightSplice = function(d, t) {
        var s = o.regionBelow(t), b = t.eUp, h = s.eUp;
        if (m.vertLeq(b.Org, h.Org)) {
          if (m.edgeSign(h.Dst, b.Org, h.Org) > 0)
            return !1;
          m.vertEq(b.Org, h.Org) ? b.Org !== h.Org && (d.pq.delete(b.Org.pqHandle), o.spliceMergeVertices(d, h.Oprev, b)) : (d.mesh.splitEdge(h.Sym), d.mesh.splice(b, h.Oprev), t.dirty = s.dirty = !0);
        } else {
          if (m.edgeSign(b.Dst, h.Org, b.Org) < 0)
            return !1;
          o.regionAbove(t).dirty = t.dirty = !0, d.mesh.splitEdge(b.Sym), d.mesh.splice(h.Oprev, b);
        }
        return !0;
      }, o.checkForLeftSplice = function(d, t) {
        var s = o.regionBelow(t), b = t.eUp, h = s.eUp, S;
        if (L(!m.vertEq(b.Dst, h.Dst)), m.vertLeq(b.Dst, h.Dst)) {
          if (m.edgeSign(b.Dst, h.Dst, b.Org) < 0)
            return !1;
          o.regionAbove(t).dirty = t.dirty = !0, S = d.mesh.splitEdge(b), d.mesh.splice(h.Sym, S), S.Lface.inside = t.inside;
        } else {
          if (m.edgeSign(h.Dst, b.Dst, h.Org) > 0)
            return !1;
          t.dirty = s.dirty = !0, S = d.mesh.splitEdge(h), d.mesh.splice(b.Lnext, h.Sym), S.Rface.inside = t.inside;
        }
        return !0;
      }, o.checkForIntersect = function(d, t) {
        var s = o.regionBelow(t), b = t.eUp, h = s.eUp, S = b.Org, Y = h.Org, T = b.Dst, y = h.Dst, J, N, x = new K(), R, z;
        if (L(!m.vertEq(y, T)), L(m.edgeSign(T, d.event, S) <= 0), L(m.edgeSign(y, d.event, Y) >= 0), L(S !== d.event && Y !== d.event), L(!t.fixUpperEdge && !s.fixUpperEdge), S === Y || (J = Math.min(S.t, T.t), N = Math.max(Y.t, y.t), J > N))
          return !1;
        if (m.vertLeq(S, Y)) {
          if (m.edgeSign(y, S, Y) > 0)
            return !1;
        } else if (m.edgeSign(T, Y, S) < 0)
          return !1;
        return o.debugEvent(d), m.intersect(T, S, y, Y, x), L(Math.min(S.t, T.t) <= x.t), L(x.t <= Math.max(Y.t, y.t)), L(Math.min(y.s, T.s) <= x.s), L(x.s <= Math.max(Y.s, S.s)), m.vertLeq(x, d.event) && (x.s = d.event.s, x.t = d.event.t), R = m.vertLeq(S, Y) ? S : Y, m.vertLeq(R, x) && (x.s = R.s, x.t = R.t), m.vertEq(x, S) || m.vertEq(x, Y) ? (o.checkForRightSplice(d, t), !1) : !m.vertEq(T, d.event) && m.edgeSign(T, d.event, x) >= 0 || !m.vertEq(y, d.event) && m.edgeSign(y, d.event, x) <= 0 ? y === d.event ? (d.mesh.splitEdge(b.Sym), d.mesh.splice(h.Sym, b), t = o.topLeftRegion(d, t), b = o.regionBelow(t).eUp, o.finishLeftRegions(d, o.regionBelow(t), s), o.addRightEdges(d, t, b.Oprev, b, b, !0), !0) : T === d.event ? (d.mesh.splitEdge(h.Sym), d.mesh.splice(b.Lnext, h.Oprev), s = t, t = o.topRightRegion(t), z = o.regionBelow(t).eUp.Rprev, s.eUp = h.Oprev, h = o.finishLeftRegions(d, s, null), o.addRightEdges(d, t, h.Onext, b.Rprev, z, !0), !0) : (m.edgeSign(T, d.event, x) >= 0 && (o.regionAbove(t).dirty = t.dirty = !0, d.mesh.splitEdge(b.Sym), b.Org.s = d.event.s, b.Org.t = d.event.t), m.edgeSign(y, d.event, x) <= 0 && (t.dirty = s.dirty = !0, d.mesh.splitEdge(h.Sym), h.Org.s = d.event.s, h.Org.t = d.event.t), !1) : (d.mesh.splitEdge(b.Sym), d.mesh.splitEdge(h.Sym), d.mesh.splice(h.Oprev, b), b.Org.s = x.s, b.Org.t = x.t, b.Org.pqHandle = d.pq.insert(b.Org), o.getIntersectData(d, b.Org, S, T, Y, y), o.regionAbove(t).dirty = t.dirty = s.dirty = !0, !1);
      }, o.walkDirtyRegions = function(d, t) {
        for (var s = o.regionBelow(t), b, h; ; ) {
          for (; s.dirty; )
            t = s, s = o.regionBelow(s);
          if (!t.dirty && (s = t, t = o.regionAbove(t), t === null || !t.dirty))
            return;
          if (t.dirty = !1, b = t.eUp, h = s.eUp, b.Dst !== h.Dst && o.checkForLeftSplice(d, t) && (s.fixUpperEdge ? (o.deleteRegion(d, s), d.mesh.delete(h), s = o.regionBelow(t), h = s.eUp) : t.fixUpperEdge && (o.deleteRegion(d, t), d.mesh.delete(b), t = o.regionAbove(s), b = t.eUp)), b.Org !== h.Org)
            if (b.Dst !== h.Dst && !t.fixUpperEdge && !s.fixUpperEdge && (b.Dst === d.event || h.Dst === d.event)) {
              if (o.checkForIntersect(d, t))
                return;
            } else
              o.checkForRightSplice(d, t);
          b.Org === h.Org && b.Dst === h.Dst && (o.addWinding(h, b), o.deleteRegion(d, t), d.mesh.delete(b), t = o.regionAbove(s));
        }
      }, o.connectRightVertex = function(d, t, s) {
        var b, h = s.Onext, S = o.regionBelow(t), Y = t.eUp, T = S.eUp, y = !1;
        if (Y.Dst !== T.Dst && o.checkForIntersect(d, t), m.vertEq(Y.Org, d.event) && (d.mesh.splice(h.Oprev, Y), t = o.topLeftRegion(d, t), h = o.regionBelow(t).eUp, o.finishLeftRegions(d, o.regionBelow(t), S), y = !0), m.vertEq(T.Org, d.event) && (d.mesh.splice(s, T.Oprev), s = o.finishLeftRegions(d, S, null), y = !0), y) {
          o.addRightEdges(d, t, s.Onext, h, h, !0);
          return;
        }
        m.vertLeq(T.Org, Y.Org) ? b = T.Oprev : b = Y, b = d.mesh.connect(s.Lprev, b), o.addRightEdges(d, t, b, b.Onext, b.Onext, !1), b.Sym.activeRegion.fixUpperEdge = !0, o.walkDirtyRegions(d, t);
      }, o.connectLeftDegenerate = function(d, t, s) {
        var b, h, S, Y, T;
        if (b = t.eUp, m.vertEq(b.Org, s)) {
          L(
            !1
            /*TOLERANCE_NONZERO*/
          ), o.spliceMergeVertices(d, b, s.anEdge);
          return;
        }
        if (!m.vertEq(b.Dst, s)) {
          d.mesh.splitEdge(b.Sym), t.fixUpperEdge && (d.mesh.delete(b.Onext), t.fixUpperEdge = !1), d.mesh.splice(s.anEdge, b), o.sweepEvent(d, s);
          return;
        }
        L(
          !1
          /*TOLERANCE_NONZERO*/
        ), t = o.topRightRegion(t), T = o.regionBelow(t), S = T.eUp.Sym, h = Y = S.Onext, T.fixUpperEdge && (L(h !== S), o.deleteRegion(d, T), d.mesh.delete(S), S = h.Oprev), d.mesh.splice(s.anEdge, S), m.edgeGoesLeft(h) || (h = null), o.addRightEdges(d, t, S.Onext, Y, h, !0);
      }, o.connectLeftVertex = function(d, t) {
        var s, b, h, S, Y, T, y = new I();
        if (y.eUp = t.anEdge.Sym, s = d.dict.search(y).key, b = o.regionBelow(s), !!b) {
          if (S = s.eUp, Y = b.eUp, m.edgeSign(S.Dst, t, S.Org) === 0) {
            o.connectLeftDegenerate(d, s, t);
            return;
          }
          if (h = m.vertLeq(Y.Dst, S.Dst) ? s : b, s.inside || h.fixUpperEdge) {
            if (h === s)
              T = d.mesh.connect(t.anEdge.Sym, S.Lnext);
            else {
              var J = d.mesh.connect(Y.Dnext, t.anEdge);
              T = J.Sym;
            }
            h.fixUpperEdge ? o.fixUpperEdge(d, h, T) : o.computeWinding(d, o.addRegionBelow(d, s, T)), o.sweepEvent(d, t);
          } else
            o.addRightEdges(d, s, t.anEdge, t.anEdge, null, !0);
        }
      }, o.sweepEvent = function(d, t) {
        d.event = t, o.debugEvent(d);
        for (var s = t.anEdge; s.activeRegion === null; )
          if (s = s.Onext, s === t.anEdge) {
            o.connectLeftVertex(d, t);
            return;
          }
        var b = o.topLeftRegion(d, s.activeRegion);
        L(b !== null);
        var h = o.regionBelow(b), S = h.eUp, Y = o.finishLeftRegions(d, h, null);
        Y.Onext === S ? o.connectRightVertex(d, b, Y) : o.addRightEdges(d, b, Y.Onext, S, S, !0);
      }, o.addSentinel = function(d, t, s, b) {
        var h = new I(), S = d.mesh.makeEdge();
        S.Org.s = s, S.Org.t = b, S.Dst.s = t, S.Dst.t = b, d.event = S.Dst, h.eUp = S, h.windingNumber = 0, h.inside = !1, h.fixUpperEdge = !1, h.sentinel = !0, h.dirty = !1, h.nodeUp = d.dict.insert(h);
      }, o.initEdgeDict = function(d) {
        d.dict = new X(d, o.edgeLeq);
        var t = d.bmax[0] - d.bmin[0], s = d.bmax[1] - d.bmin[1], b = d.bmin[0] - t, h = d.bmax[0] + t, S = d.bmin[1] - s, Y = d.bmax[1] + s;
        o.addSentinel(d, b, h, S), o.addSentinel(d, b, h, Y);
      }, o.doneEdgeDict = function(d) {
        for (var t, s = 0; (t = d.dict.min().key) !== null; )
          t.sentinel || (L(t.fixUpperEdge), L(++s === 1)), L(t.windingNumber === 0), o.deleteRegion(d, t);
      }, o.removeDegenerateEdges = function(d) {
        var t, s, b, h = d.mesh.eHead;
        for (t = h.next; t !== h; t = s)
          s = t.next, b = t.Lnext, m.vertEq(t.Org, t.Dst) && t.Lnext.Lnext !== t && (o.spliceMergeVertices(d, b, t), d.mesh.delete(t), t = b, b = t.Lnext), b.Lnext === t && (b !== t && ((b === s || b === s.Sym) && (s = s.next), d.mesh.delete(b)), (t === s || t === s.Sym) && (s = s.next), d.mesh.delete(t));
      }, o.initPriorityQ = function(d) {
        var t, s, b, h = 0;
        for (b = d.mesh.vHead, s = b.next; s !== b; s = s.next)
          h++;
        for (h += 8, t = d.pq = new C(h, m.vertLeq), b = d.mesh.vHead, s = b.next; s !== b; s = s.next)
          s.pqHandle = t.insert(s);
        return s !== b ? !1 : (t.init(), !0);
      }, o.donePriorityQ = function(d) {
        d.pq = null;
      }, o.removeDegenerateFaces = function(d, t) {
        var s, b, h;
        for (s = t.fHead.next; s !== t.fHead; s = b)
          b = s.next, h = s.anEdge, L(h.Lnext !== h), h.Lnext.Lnext === h && (o.addWinding(h.Onext, h), d.mesh.delete(h));
        return !0;
      }, o.computeInterior = function(d) {
        var t, s;
        if (o.removeDegenerateEdges(d), !o.initPriorityQ(d))
          return !1;
        for (o.initEdgeDict(d); (t = d.pq.extractMin()) !== null; ) {
          for (; s = d.pq.min(), !(s === null || !m.vertEq(s, t)); )
            s = d.pq.extractMin(), o.spliceMergeVertices(d, t.anEdge, s.anEdge);
          o.sweepEvent(d, t);
        }
        return d.event = d.dict.min().key.eUp.Org, o.debugEvent(d), o.doneEdgeDict(d), o.donePriorityQ(d), o.removeDegenerateFaces(d, d.mesh) ? (d.mesh.check(), !0) : !1;
      };
      function G() {
        this.mesh = null, this.normal = [0, 0, 0], this.sUnit = [0, 0, 0], this.tUnit = [0, 0, 0], this.bmin = [0, 0], this.bmax = [0, 0], this.windingRule = c.WINDING_ODD, this.dict = null, this.pq = null, this.event = null, this.vertexIndexCounter = 0, this.vertices = [], this.vertexIndices = [], this.vertexCount = 0, this.elements = [], this.elementCount = 0;
      }
      G.prototype = {
        dot_: function(d, t) {
          return d[0] * t[0] + d[1] * t[1] + d[2] * t[2];
        },
        normalize_: function(d) {
          var t = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
          L(t > 0), t = Math.sqrt(t), d[0] /= t, d[1] /= t, d[2] /= t;
        },
        longAxis_: function(d) {
          var t = 0;
          return Math.abs(d[1]) > Math.abs(d[0]) && (t = 1), Math.abs(d[2]) > Math.abs(d[t]) && (t = 2), t;
        },
        computeNormal_: function(d) {
          var t, s, b, h, S, Y, T = [0, 0, 0], y = [0, 0, 0], J = [0, 0, 0], N = [0, 0, 0], x = [0, 0, 0], R = [null, null, null], z = [null, null, null], Q = this.mesh.vHead, P;
          for (t = Q.next, P = 0; P < 3; ++P)
            h = t.coords[P], y[P] = h, z[P] = t, T[P] = h, R[P] = t;
          for (t = Q.next; t !== Q; t = t.next)
            for (P = 0; P < 3; ++P)
              h = t.coords[P], h < y[P] && (y[P] = h, z[P] = t), h > T[P] && (T[P] = h, R[P] = t);
          if (P = 0, T[1] - y[1] > T[0] - y[0] && (P = 1), T[2] - y[2] > T[P] - y[P] && (P = 2), y[P] >= T[P]) {
            d[0] = 0, d[1] = 0, d[2] = 1;
            return;
          }
          for (Y = 0, s = z[P], b = R[P], J[0] = s.coords[0] - b.coords[0], J[1] = s.coords[1] - b.coords[1], J[2] = s.coords[2] - b.coords[2], t = Q.next; t !== Q; t = t.next)
            N[0] = t.coords[0] - b.coords[0], N[1] = t.coords[1] - b.coords[1], N[2] = t.coords[2] - b.coords[2], x[0] = J[1] * N[2] - J[2] * N[1], x[1] = J[2] * N[0] - J[0] * N[2], x[2] = J[0] * N[1] - J[1] * N[0], S = x[0] * x[0] + x[1] * x[1] + x[2] * x[2], S > Y && (Y = S, d[0] = x[0], d[1] = x[1], d[2] = x[2]);
          Y <= 0 && (d[0] = d[1] = d[2] = 0, d[this.longAxis_(J)] = 1);
        },
        checkOrientation_: function() {
          var d, t, s = this.mesh.fHead, b, h = this.mesh.vHead, S;
          for (d = 0, t = s.next; t !== s; t = t.next)
            if (S = t.anEdge, !(S.winding <= 0))
              do
                d += (S.Org.s - S.Dst.s) * (S.Org.t + S.Dst.t), S = S.Lnext;
              while (S !== t.anEdge);
          if (d < 0) {
            for (b = h.next; b !== h; b = b.next)
              b.t = -b.t;
            this.tUnit[0] = -this.tUnit[0], this.tUnit[1] = -this.tUnit[1], this.tUnit[2] = -this.tUnit[2];
          }
        },
        /*	#ifdef FOR_TRITE_TEST_PROGRAM
          #include <stdlib.h>
          extern int RandomSweep;
          #define S_UNIT_X	(RandomSweep ? (2*drand48()-1) : 1.0)
          #define S_UNIT_Y	(RandomSweep ? (2*drand48()-1) : 0.0)
          #else
          #if defined(SLANTED_SWEEP) */
        /* The "feature merging" is not intended to be complete.  There are
        * special cases where edges are nearly parallel to the sweep line
        * which are not implemented.  The algorithm should still behave
        * robustly (ie. produce a reasonable tesselation) in the presence
        * of such edges, however it may miss features which could have been
        * merged.  We could minimize this effect by choosing the sweep line
        * direction to be something unusual (ie. not parallel to one of the
        * coordinate axes).
        */
        /*	#define S_UNIT_X	(TESSreal)0.50941539564955385	// Pre-normalized
          #define S_UNIT_Y	(TESSreal)0.86052074622010633
          #else
          #define S_UNIT_X	(TESSreal)1.0
          #define S_UNIT_Y	(TESSreal)0.0
          #endif
          #endif*/
        /* Determine the polygon normal and project vertices onto the plane
        * of the polygon.
        */
        projectPolygon_: function() {
          var d, t = this.mesh.vHead, s = [0, 0, 0], b, h, S, Y, T = !1;
          for (s[0] = this.normal[0], s[1] = this.normal[1], s[2] = this.normal[2], s[0] === 0 && s[1] === 0 && s[2] === 0 && (this.computeNormal_(s), T = !0), b = this.sUnit, h = this.tUnit, S = this.longAxis_(s), b[S] = 0, b[(S + 1) % 3] = 1, b[(S + 2) % 3] = 0, h[S] = 0, h[(S + 1) % 3] = 0, h[(S + 2) % 3] = s[S] > 0 ? 1 : -1, d = t.next; d !== t; d = d.next)
            d.s = this.dot_(d.coords, b), d.t = this.dot_(d.coords, h);
          for (T && this.checkOrientation_(), Y = !0, d = t.next; d !== t; d = d.next)
            Y ? (this.bmin[0] = this.bmax[0] = d.s, this.bmin[1] = this.bmax[1] = d.t, Y = !1) : (d.s < this.bmin[0] && (this.bmin[0] = d.s), d.s > this.bmax[0] && (this.bmax[0] = d.s), d.t < this.bmin[1] && (this.bmin[1] = d.t), d.t > this.bmax[1] && (this.bmax[1] = d.t));
        },
        addWinding_: function(d, t) {
          d.winding += t.winding, d.Sym.winding += t.Sym.winding;
        },
        /* tessMeshTessellateMonoRegion( face ) tessellates a monotone region
        * (what else would it do??)  The region must consist of a single
        * loop of half-edges (see mesh.h) oriented CCW.  "Monotone" in this
        * case means that any vertical line intersects the interior of the
        * region in a single interval.  
        *
        * Tessellation consists of adding interior edges (actually pairs of
        * half-edges), to split the region into non-overlapping triangles.
        *
        * The basic idea is explained in Preparata and Shamos (which I don''t
        * have handy right now), although their implementation is more
        * complicated than this one.  The are two edge chains, an upper chain
        * and a lower chain.  We process all vertices from both chains in order,
        * from right to left.
        *
        * The algorithm ensures that the following invariant holds after each
        * vertex is processed: the untessellated region consists of two
        * chains, where one chain (say the upper) is a single edge, and
        * the other chain is concave.  The left vertex of the single edge
        * is always to the left of all vertices in the concave chain.
        *
        * Each step consists of adding the rightmost unprocessed vertex to one
        * of the two chains, and forming a fan of triangles from the rightmost
        * of two chain endpoints.  Determining whether we can add each triangle
        * to the fan is a simple orientation test.  By making the fan as large
        * as possible, we restore the invariant (check it yourself).
        */
        //	int tessMeshTessellateMonoRegion( TESSmesh *mesh, TESSface *face )
        tessellateMonoRegion_: function(d, t) {
          var s, b;
          for (s = t.anEdge, L(s.Lnext !== s && s.Lnext.Lnext !== s); m.vertLeq(s.Dst, s.Org); s = s.Lprev)
            ;
          for (; m.vertLeq(s.Org, s.Dst); s = s.Lnext)
            ;
          for (b = s.Lprev; s.Lnext !== b; )
            if (m.vertLeq(s.Dst, b.Org)) {
              for (; b.Lnext !== s && (m.edgeGoesLeft(b.Lnext) || m.edgeSign(b.Org, b.Dst, b.Lnext.Dst) <= 0); ) {
                var h = d.connect(b.Lnext, b);
                b = h.Sym;
              }
              b = b.Lprev;
            } else {
              for (; b.Lnext !== s && (m.edgeGoesRight(s.Lprev) || m.edgeSign(s.Dst, s.Org, s.Lprev.Org) >= 0); ) {
                var h = d.connect(s, s.Lprev);
                s = h.Sym;
              }
              s = s.Lnext;
            }
          for (L(b.Lnext !== s); b.Lnext.Lnext !== s; ) {
            var h = d.connect(b.Lnext, b);
            b = h.Sym;
          }
          return !0;
        },
        /* tessMeshTessellateInterior( mesh ) tessellates each region of
        * the mesh which is marked "inside" the polygon.  Each such region
        * must be monotone.
        */
        //int tessMeshTessellateInterior( TESSmesh *mesh )
        tessellateInterior_: function(d) {
          var t, s;
          for (t = d.fHead.next; t !== d.fHead; t = s)
            if (s = t.next, t.inside && !this.tessellateMonoRegion_(d, t))
              return !1;
          return !0;
        },
        /* tessMeshDiscardExterior( mesh ) zaps (ie. sets to NULL) all faces
        * which are not marked "inside" the polygon.  Since further mesh operations
        * on NULL faces are not allowed, the main purpose is to clean up the
        * mesh so that exterior loops are not represented in the data structure.
        */
        //void tessMeshDiscardExterior( TESSmesh *mesh )
        discardExterior_: function(d) {
          var t, s;
          for (t = d.fHead.next; t !== d.fHead; t = s)
            s = t.next, t.inside || d.zapFace(t);
        },
        /* tessMeshSetWindingNumber( mesh, value, keepOnlyBoundary ) resets the
        * winding numbers on all edges so that regions marked "inside" the
        * polygon have a winding number of "value", and regions outside
        * have a winding number of 0.
        *
        * If keepOnlyBoundary is TRUE, it also deletes all edges which do not
        * separate an interior region from an exterior one.
        */
        //	int tessMeshSetWindingNumber( TESSmesh *mesh, int value, int keepOnlyBoundary )
        setWindingNumber_: function(d, t, s) {
          var b, h;
          for (b = d.eHead.next; b !== d.eHead; b = h)
            h = b.next, b.Rface.inside !== b.Lface.inside ? b.winding = b.Lface.inside ? t : -t : s ? d.delete(b) : b.winding = 0;
        },
        getNeighbourFace_: function(d) {
          return !d.Rface || !d.Rface.inside ? -1 : d.Rface.n;
        },
        outputPolymesh_: function(d, t, s, b) {
          var h, S, Y, T = 0, y = 0, J, N;
          for (s > 3 && d.mergeConvexFaces(s), h = d.vHead.next; h !== d.vHead; h = h.next)
            h.n = -1;
          for (S = d.fHead.next; S !== d.fHead; S = S.next)
            if (S.n = -1, !!S.inside) {
              Y = S.anEdge, J = 0;
              do
                h = Y.Org, h.n === -1 && (h.n = y, y++), J++, Y = Y.Lnext;
              while (Y !== S.anEdge);
              L(J <= s), S.n = T, ++T;
            }
          for (this.elementCount = T, t === c.CONNECTED_POLYGONS && (T *= 2), this.elements = [], this.elements.length = T * s, this.vertexCount = y, this.vertices = [], this.vertices.length = y * b, this.vertexIndices = [], this.vertexIndices.length = y, h = d.vHead.next; h !== d.vHead; h = h.next)
            if (h.n !== -1) {
              var x = h.n * b;
              this.vertices[x + 0] = h.coords[0], this.vertices[x + 1] = h.coords[1], b > 2 && (this.vertices[x + 2] = h.coords[2]), this.vertexIndices[h.n] = h.idx;
            }
          var R = 0;
          for (S = d.fHead.next; S !== d.fHead; S = S.next)
            if (S.inside) {
              Y = S.anEdge, J = 0;
              do
                h = Y.Org, this.elements[R++] = h.n, J++, Y = Y.Lnext;
              while (Y !== S.anEdge);
              for (N = J; N < s; ++N)
                this.elements[R++] = -1;
              if (t === c.CONNECTED_POLYGONS) {
                Y = S.anEdge;
                do
                  this.elements[R++] = this.getNeighbourFace_(Y), Y = Y.Lnext;
                while (Y !== S.anEdge);
                for (N = J; N < s; ++N)
                  this.elements[R++] = -1;
              }
            }
        },
        //	void OutputContours( TESStesselator *tess, TESSmesh *mesh, int vertexSize )
        outputContours_: function(d, t) {
          var s, b, h, S = 0, Y = 0;
          for (this.vertexCount = 0, this.elementCount = 0, s = d.fHead.next; s !== d.fHead; s = s.next)
            if (s.inside) {
              h = b = s.anEdge;
              do
                this.vertexCount++, b = b.Lnext;
              while (b !== h);
              this.elementCount++;
            }
          this.elements = [], this.elements.length = this.elementCount * 2, this.vertices = [], this.vertices.length = this.vertexCount * t, this.vertexIndices = [], this.vertexIndices.length = this.vertexCount;
          var T = 0, y = 0, J = 0;
          for (S = 0, s = d.fHead.next; s !== d.fHead; s = s.next)
            if (s.inside) {
              Y = 0, h = b = s.anEdge;
              do
                this.vertices[T++] = b.Org.coords[0], this.vertices[T++] = b.Org.coords[1], t > 2 && (this.vertices[T++] = b.Org.coords[2]), this.vertexIndices[y++] = b.Org.idx, Y++, b = b.Lnext;
              while (b !== h);
              this.elements[J++] = S, this.elements[J++] = Y, S += Y;
            }
        },
        addContour: function(d, t) {
          var s, b;
          for (this.mesh === null && (this.mesh = new e()), d < 2 && (d = 2), d > 3 && (d = 3), s = null, b = 0; b < t.length; b += d)
            s === null ? (s = this.mesh.makeEdge(), this.mesh.splice(s, s.Sym)) : (this.mesh.splitEdge(s), s = s.Lnext), s.Org.coords[0] = t[b + 0], s.Org.coords[1] = t[b + 1], d > 2 ? s.Org.coords[2] = t[b + 2] : s.Org.coords[2] = 0, s.Org.idx = this.vertexIndexCounter++, s.winding = 1, s.Sym.winding = -1;
        },
        //	int tessTesselate( TESStesselator *tess, int windingRule, int elementType, int polySize, int vertexSize, const TESSreal* normal )
        tesselate: function(d, t, s, b, h) {
          if (this.vertices = [], this.elements = [], this.vertexIndices = [], this.vertexIndexCounter = 0, h && (this.normal[0] = h[0], this.normal[1] = h[1], this.normal[2] = h[2]), this.windingRule = d, b < 2 && (b = 2), b > 3 && (b = 3), !this.mesh)
            return !1;
          this.projectPolygon_(), o.computeInterior(this);
          var S = this.mesh;
          return t === c.BOUNDARY_CONTOURS ? this.setWindingNumber_(S, 1, !0) : this.tessellateInterior_(S), S.check(), t === c.BOUNDARY_CONTOURS ? this.outputContours_(S, b) : this.outputPolymesh_(S, t, s, b), !0;
        }
      };
    },
    /* 62 */
    /***/
    function(n, l) {
      n.exports = c;
      var i = Object.prototype.hasOwnProperty;
      function c() {
        for (var m = {}, L = 0; L < arguments.length; L++) {
          var K = arguments[L];
          for (var u in K)
            i.call(K, u) && (m[u] = K[u]);
        }
        return m;
      }
    },
    /* 63 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "createShaders", function() {
        return a;
      }), i.d(l, "applyShader", function() {
        return e;
      }), i.d(l, "createCloudShaders", function() {
        return X;
      }), i.d(l, "applyCloudShader", function() {
        return W;
      });
      var c = i(64), m = i(65), L = i(66), K = i(67);
      i(1).glMatrix.setMatrixArrayType(Array);
      const u = Symbol("shaders");
      function a(p) {
        p[u] = [];
        for (let C = 0; C < 16; C++) {
          const I = [], o = !!(C & 1), G = !!(C & 2), d = !!(C & 4), t = !!(C & 8);
          o && I.push("#define TEXTURE 1"), G && I.push("#define FILTER 1"), d && I.push("#define GRADIENT 1"), t && I.push("#define CLIPPATH 1");
          const s = `${I.join(`
`)}
`, b = [];
          o && b.push("uniform sampler2D u_texSampler;"), t && b.push("uniform sampler2D u_clipSampler;"), p[u][C] = [s + b.join(`
`) + m.default, s + c.default];
        }
      }
      function e(p, {
        hasTexture: C = !1,
        hasFilter: I = !1,
        hasGradient: o = !1,
        hasClipPath: G = !1
      } = {}) {
        const d = C | I << 1 | o << 2 | G << 3;
        let t = p[u][d];
        Array.isArray(t) && (t = p.createProgram(...t), p[u][d] = t), p.program !== t && p.useProgram(t, {
          a_color: {
            type: "UNSIGNED_BYTE",
            normalize: !0
          }
        });
      }
      const r = [];
      function X(p) {
        for (let C = 0; C < 64; C++) {
          const I = [], o = !!(C & 1), G = !!(C & 2), d = !!(C & 4), t = !!(C & 8), s = !!(C & 16), b = !!(C & 32);
          o && I.push("#define TEXTURE 1"), G && I.push("#define FILTER 1"), d && I.push("#define GRADIENT 1"), t && I.push("#define CLOUDCOLOR 1"), s && I.push("#define CLOUDFILTER 1"), b && I.push("#define CLIPPATH 1");
          const h = `${I.join(`
`)}
`, S = [];
          if (o) {
            S.push("uniform sampler2D u_texSampler;");
            for (let Y = 0; Y < 12; Y++)
              S.push(`uniform sampler2D u_texFrame${Y};`);
          }
          b && S.push("uniform sampler2D u_clipSampler;"), r[C] = [h + S.join(`
`) + K.default, h + L.default];
        }
      }
      function W(p, {
        hasTexture: C = !1,
        hasFilter: I = !1,
        hasGradient: o = !1,
        hasCloudColor: G = !1,
        hasCloudFilter: d = !1,
        hasClipPath: t = !1
      } = {}) {
        const s = C | I << 1 | o << 2 | G << 3 | d << 4 | t << 5;
        let b = r[s];
        Array.isArray(b) && (b = p.createProgram(...b), r[s] = b), p.program !== b && p.useProgram(b, {
          a_color: {
            type: "UNSIGNED_BYTE",
            normalize: !0
          },
          a_fillCloudColor: {
            type: "UNSIGNED_BYTE",
            normalize: !0
          },
          a_strokeCloudColor: {
            type: "UNSIGNED_BYTE",
            normalize: !0
          },
          a_frameIndex: {
            type: "UNSIGNED_BYTE",
            normalize: !1
          }
        });
      }
    },
    /* 64 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `attribute vec3 a_vertexPosition;
attribute vec4 a_color;
varying vec4 vColor;
varying float flagBackground;
uniform vec2 u_resolution;
uniform mat3 viewMatrix;
uniform mat3 projectionMatrix;

#ifdef TEXTURE
attribute vec3 a_vertexTextureCoord;
varying vec3 vTextureCoord;
attribute vec4 a_sourceRect;
varying vec4 vSourceRect;
#endif

#ifdef CLIPPATH
attribute vec2 a_clipUV;
varying vec2 vClipUV;
#endif

#ifdef GRADIENT
uniform float u_radialGradientVector[6];
varying vec3 vGradientVector1;
varying vec3 vGradientVector2;
#endif

void main() {
  gl_PointSize = 1.0;

  vec3 pos = projectionMatrix * viewMatrix * vec3(a_vertexPosition.xy, 1.0);
  gl_Position = vec4(pos.xy, 1.0, 1.0);

#ifdef GRADIENT
  vec3 vg1 = viewMatrix * vec3(u_radialGradientVector[0], u_radialGradientVector[1], 1.0);
  vec3 vg2 = viewMatrix * vec3(u_radialGradientVector[3], u_radialGradientVector[4], 1.0);
  float h = u_resolution.y;
  vg1.y = h - vg1.y;
  vg2.y = h - vg2.y;
  vGradientVector1 = vec3(vg1.xy, u_radialGradientVector[2]);
  vGradientVector2 = vec3(vg2.xy, u_radialGradientVector[5]);
#endif
  
  flagBackground = a_vertexPosition.z;
  vColor = a_color;

#ifdef TEXTURE
  vTextureCoord = a_vertexTextureCoord;
  vSourceRect = a_sourceRect;
#endif

#ifdef CLIPPATH
  vClipUV = a_clipUV;
#endif
}`;
    },
    /* 65 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `precision mediump float;

varying vec4 vColor;
varying float flagBackground;

#ifdef TEXTURE
varying vec3 vTextureCoord;
varying vec4 vSourceRect;
#endif

#ifdef CLIPPATH
varying vec2 vClipUV;
#endif

#ifdef FILTER
uniform int u_filterFlag;
uniform float u_colorMatrix[20];
#endif

#ifdef GRADIENT
varying vec3 vGradientVector1;
varying vec3 vGradientVector2;
uniform float u_colorSteps[40];
uniform int u_gradientType;
// uniform float u_radialGradientVector[6];

void gradient(inout vec4 color, vec3 gv1, vec3 gv2, float colorSteps[40]) {
  float t;
  // center circle radius
  float cr = gv1.z;
  // focal circle radius
  float fr = gv2.z;

  if(cr > 0.0 || fr > 0.0) {
    // radial gradient
    vec2 center = gv1.xy;
    vec2 focal = gv2.xy;
    float x = focal.x - gl_FragCoord.x;
    float y = focal.y - gl_FragCoord.y;
    float dx = focal.x - center.x;
    float dy = focal.y - center.y;
    float dr = cr - fr;
    float a = dx * dx + dy * dy - dr * dr;
    float b = -2.0 * (y * dy + x * dx + fr * dr);
    float c = x * x + y * y - fr * fr;
    t = 1.0 - 0.5 * (1.0 / a) * (-b + sqrt(b * b - 4.0 * a * c));
  } else {
    // linear gradient
    vec2 v1 = gl_FragCoord.xy - gv1.xy;
    vec2 v2 = gv2.xy - gv1.xy;
    t = (v1.x * v2.x + v1.y * v2.y) / (v2.x * v2.x + v2.y * v2.y);
  }

  vec4 colors[8];
  colors[0] = vec4(colorSteps[1], colorSteps[2], colorSteps[3], colorSteps[4]);
  colors[1] = vec4(colorSteps[6], colorSteps[7], colorSteps[8], colorSteps[9]);
  colors[2] = vec4(colorSteps[11], colorSteps[12], colorSteps[13], colorSteps[14]);
  colors[3] = vec4(colorSteps[16], colorSteps[17], colorSteps[18], colorSteps[19]);
  colors[4] = vec4(colorSteps[21], colorSteps[22], colorSteps[23], colorSteps[24]);
  colors[5] = vec4(colorSteps[26], colorSteps[27], colorSteps[28], colorSteps[29]);
  colors[6] = vec4(colorSteps[31], colorSteps[32], colorSteps[33], colorSteps[34]);
  colors[7] = vec4(colorSteps[36], colorSteps[37], colorSteps[38], colorSteps[39]);
  
  float steps[8];
  steps[0] = colorSteps[0];
  steps[1] = colorSteps[5];
  steps[2] = colorSteps[10];
  steps[3] = colorSteps[15];
  steps[4] = colorSteps[20];
  steps[5] = colorSteps[25];
  steps[6] = colorSteps[30];
  steps[7] = colorSteps[35];

  color = colors[0];
  for (int i = 1; i < 8; i++) {
    if (steps[i] < 0.0 || steps[i] > 1.0) {
      break;
    }
    if(steps[i] == steps[i - 1]) {
      color = colors[i];
    } else {
      color = mix(color, colors[i], clamp((t - steps[i - 1]) / (steps[i] - steps[i - 1]), 0.0, 1.0));
    }
    if (steps[i] >= t) {
      break;
    }
  }
}
#endif

#ifdef FILTER
void transformColor(inout vec4 color, in float colorMatrix[20]) {
  float r = color.r, g = color.g, b = color.b, a = color.a;
  color[0] = colorMatrix[0] * r + colorMatrix[1] * g + colorMatrix[2] * b + colorMatrix[3] * a + colorMatrix[4];
  color[1] = colorMatrix[5] * r + colorMatrix[6] * g + colorMatrix[7] * b + colorMatrix[8] * a + colorMatrix[9];
  color[2] = colorMatrix[10] * r + colorMatrix[11] * g + colorMatrix[12] * b + colorMatrix[13] * a + colorMatrix[14];
  color[3] = colorMatrix[15] * r + colorMatrix[16] * g + colorMatrix[17] * b + colorMatrix[18] * a + colorMatrix[19];
}
#endif

void main() {
  vec4 color = vColor;
  float opacity = abs(flagBackground);

#ifdef GRADIENT
  if(u_gradientType > 0 && flagBackground > 0.0 || u_gradientType == 0 && flagBackground <= 0.0) {
    gradient(color, vGradientVector1, vGradientVector2, u_colorSteps);
  }
#endif

  if(opacity < 1.0) {
    color.a *= opacity;
  }

#ifdef TEXTURE
  if(flagBackground > 0.0) {
    vec3 texCoord = vTextureCoord;

    if(texCoord.z == 1.0) {
      texCoord = fract(texCoord);
    }

    if(texCoord.x <= 1.0 && texCoord.x >= 0.0
      && texCoord.y <= 1.0 && texCoord.y >= 0.0) {
      if(vSourceRect.z > 0.0) {
        texCoord.x = vSourceRect.x + texCoord.x * vSourceRect.z;
        texCoord.y = 1.0 - (vSourceRect.y + (1.0 - texCoord.y) * vSourceRect.w);
      }
      vec4 texColor = texture2D(u_texSampler, texCoord.xy);
      float alpha = texColor.a;
      if(opacity < 1.0) {
        texColor.a *= opacity;
        alpha *= mix(0.465, 1.0, opacity);
      }
      // color = mix(color, texColor, texColor.a);
      color.rgb = mix(color.rgb, texColor.rgb, alpha);
      // color.rgb = mix(texColor.rgb, color.rgb, color.a);
      color.rgb = mix(texColor.rgb, color.rgb, clamp(color.a / max(0.0001, texColor.a), 0.0, 1.0));
      color.a = texColor.a + (1.0 - texColor.a) * color.a;
    }
  }
#endif

#ifdef FILTER
  if(u_filterFlag > 0) {
    transformColor(color, u_colorMatrix);
  }
#endif

#ifdef CLIPPATH
  float clip = texture2D(u_clipSampler, vClipUV).r;
  color *= clip;
#endif

  gl_FragColor = color;
}`;
    },
    /* 66 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `attribute vec3 a_vertexPosition;
attribute vec4 a_color;
varying vec4 vColor;
varying float flagBackground;
attribute vec3 a_transform0;
attribute vec3 a_transform1;
uniform vec2 u_resolution;
uniform mat3 viewMatrix;
uniform mat3 projectionMatrix;

#ifdef TEXTURE
attribute vec3 a_vertexTextureCoord;
varying vec3 vTextureCoord;
attribute float a_frameIndex;
varying float frameIndex;
attribute vec4 a_sourceRect;
varying vec4 vSourceRect;
#endif

#ifdef CLIPPATH
attribute vec2 a_clipUV;
varying vec2 vClipUV;
#endif

#ifdef CLOUDFILTER
attribute vec4 a_colorCloud0;
attribute vec4 a_colorCloud1;
attribute vec4 a_colorCloud2;
attribute vec4 a_colorCloud3;
attribute vec4 a_colorCloud4;
varying vec4 colorCloud0;
varying vec4 colorCloud1;
varying vec4 colorCloud2;
varying vec4 colorCloud3;
varying vec4 colorCloud4;
#endif

#ifdef CLOUDCOLOR
attribute vec4 a_fillCloudColor;
attribute vec4 a_strokeCloudColor;
#endif

#ifdef GRADIENT
uniform float u_radialGradientVector[6];
varying vec3 vGradientVector1;
varying vec3 vGradientVector2;
#endif

void main() {
  gl_PointSize = 1.0;

  mat3 modelMatrix = mat3(
    a_transform0.x, a_transform1.x, 0, 
    a_transform0.y, a_transform1.y, 0,
    a_transform0.z, a_transform1.z, 1
  );

  vec3 pos = projectionMatrix * viewMatrix * modelMatrix * vec3(a_vertexPosition.xy, 1.0);
  gl_Position = vec4(pos.xy, 1.0, 1.0);

#ifdef GRADIENT
  vec3 vg1 = viewMatrix * vec3(u_radialGradientVector[0], u_radialGradientVector[1], 1.0);
  vec3 vg2 = viewMatrix * vec3(u_radialGradientVector[3], u_radialGradientVector[4], 1.0);
  float h = u_resolution.y;
  vg1.y = h - vg1.y;
  vg2.y = h - vg2.y;
  vGradientVector1 = vec3(vg1.xy, u_radialGradientVector[2]);
  vGradientVector2 = vec3(vg2.xy, u_radialGradientVector[5]);
#endif
  
  flagBackground = a_vertexPosition.z;

#ifdef CLOUDCOLOR
  if(flagBackground > 0.0) {
    vColor = mix(a_color, a_fillCloudColor, a_fillCloudColor.a);
  } else {
    vColor = mix(a_color, a_strokeCloudColor, a_strokeCloudColor.a);
  }
#else
  vColor = a_color;
#endif

#ifdef TEXTURE
  vTextureCoord = a_vertexTextureCoord;
  frameIndex = a_frameIndex;
  vSourceRect = a_sourceRect;
#endif

#ifdef CLIPPATH
  vClipUV = a_clipUV;
#endif

#ifdef CLOUDFILTER
  colorCloud0 = a_colorCloud0;
  colorCloud1 = a_colorCloud1;
  colorCloud2 = a_colorCloud2;
  colorCloud3 = a_colorCloud3;
  colorCloud4 = a_colorCloud4;
#endif
}`;
    },
    /* 67 */
    /***/
    function(n, l, i) {
      i.r(l), l.default = `precision mediump float;

varying vec4 vColor;
varying float flagBackground;

#ifdef TEXTURE
varying float frameIndex;
varying vec3 vTextureCoord;
varying vec4 vSourceRect;
#endif

#ifdef CLIPPATH
varying vec2 vClipUV;
#endif

#ifdef FILTER
uniform int u_filterFlag;
uniform float u_colorMatrix[20];
#endif

#ifdef CLOUDFILTER
varying vec4 colorCloud0;
varying vec4 colorCloud1;
varying vec4 colorCloud2;
varying vec4 colorCloud3;
varying vec4 colorCloud4;
#endif

#ifdef GRADIENT
varying vec3 vGradientVector1;
varying vec3 vGradientVector2;
uniform float u_colorSteps[40];
uniform int u_gradientType;

void gradient(inout vec4 color, vec3 gv1, vec3 gv2, float colorSteps[40]) {
  float t;
  // center circle radius
  float cr = gv1.z;
  // focal circle radius
  float fr = gv2.z;

  if(cr > 0.0 || fr > 0.0) {
    // radial gradient
    vec2 center = gv1.xy;
    vec2 focal = gv2.xy;
    float x = focal.x - gl_FragCoord.x;
    float y = focal.y - gl_FragCoord.y;
    float dx = focal.x - center.x;
    float dy = focal.y - center.y;
    float dr = cr - fr;
    float a = dx * dx + dy * dy - dr * dr;
    float b = -2.0 * (y * dy + x * dx + fr * dr);
    float c = x * x + y * y - fr * fr;
    t = 1.0 - 0.5 * (1.0 / a) * (-b + sqrt(b * b - 4.0 * a * c));
  } else {
    // linear gradient
    vec2 v1 = gl_FragCoord.xy - gv1.xy;
    vec2 v2 = gv2.xy - gv1.xy;
    t = (v1.x * v2.x + v1.y * v2.y) / (v2.x * v2.x + v2.y * v2.y);
  }

  vec4 colors[8];
  colors[0] = vec4(colorSteps[1], colorSteps[2], colorSteps[3], colorSteps[4]);
  colors[1] = vec4(colorSteps[6], colorSteps[7], colorSteps[8], colorSteps[9]);
  colors[2] = vec4(colorSteps[11], colorSteps[12], colorSteps[13], colorSteps[14]);
  colors[3] = vec4(colorSteps[16], colorSteps[17], colorSteps[18], colorSteps[19]);
  colors[4] = vec4(colorSteps[21], colorSteps[22], colorSteps[23], colorSteps[24]);
  colors[5] = vec4(colorSteps[26], colorSteps[27], colorSteps[28], colorSteps[29]);
  colors[6] = vec4(colorSteps[31], colorSteps[32], colorSteps[33], colorSteps[34]);
  colors[7] = vec4(colorSteps[36], colorSteps[37], colorSteps[38], colorSteps[39]);
  
  float steps[8];
  steps[0] = colorSteps[0];
  steps[1] = colorSteps[5];
  steps[2] = colorSteps[10];
  steps[3] = colorSteps[15];
  steps[4] = colorSteps[20];
  steps[5] = colorSteps[25];
  steps[6] = colorSteps[30];
  steps[7] = colorSteps[35];

  color = colors[0];
  for (int i = 1; i < 8; i++) {
    if (steps[i] < 0.0 || steps[i] > 1.0) {
      break;
    }
    if(steps[i] == steps[i - 1]) {
      color = colors[i];
    } else {
      color = mix(color, colors[i], clamp((t - steps[i - 1]) / (steps[i] - steps[i - 1]), 0.0, 1.0));
    }
    if (steps[i] >= t) {
      break;
    }
  }
}
#endif

void transformColor(inout vec4 color, in float colorMatrix[20]) {
  float r = color.r, g = color.g, b = color.b, a = color.a;
  color[0] = colorMatrix[0] * r + colorMatrix[1] * g + colorMatrix[2] * b + colorMatrix[3] * a + colorMatrix[4];
  color[1] = colorMatrix[5] * r + colorMatrix[6] * g + colorMatrix[7] * b + colorMatrix[8] * a + colorMatrix[9];
  color[2] = colorMatrix[10] * r + colorMatrix[11] * g + colorMatrix[12] * b + colorMatrix[13] * a + colorMatrix[14];
  color[3] = colorMatrix[15] * r + colorMatrix[16] * g + colorMatrix[17] * b + colorMatrix[18] * a + colorMatrix[19];
}

#ifdef CLOUDFILTER
void buildCloudColor(inout float colorCloudMatrix[20]) {
  colorCloudMatrix[0] = colorCloud0[0];
  colorCloudMatrix[1] = colorCloud1[0];
  colorCloudMatrix[2] = colorCloud2[0];
  colorCloudMatrix[3] = colorCloud3[0];
  colorCloudMatrix[4] = colorCloud4[0];

  colorCloudMatrix[5] = colorCloud0[1];
  colorCloudMatrix[6] = colorCloud1[1];
  colorCloudMatrix[7] = colorCloud2[1];
  colorCloudMatrix[8] = colorCloud3[1];
  colorCloudMatrix[9] = colorCloud4[1];

  colorCloudMatrix[10] = colorCloud0[2];
  colorCloudMatrix[11] = colorCloud1[2];
  colorCloudMatrix[12] = colorCloud2[2];
  colorCloudMatrix[13] = colorCloud3[2];
  colorCloudMatrix[14] = colorCloud4[2];

  colorCloudMatrix[15] = colorCloud0[3];
  colorCloudMatrix[16] = colorCloud1[3];
  colorCloudMatrix[17] = colorCloud2[3];
  colorCloudMatrix[18] = colorCloud3[3];
  colorCloudMatrix[19] = colorCloud4[3];
}
#endif

void main() {
  vec4 color = vColor;
  float opacity = abs(flagBackground);

#ifdef GRADIENT
  if(u_gradientType > 0 && flagBackground > 0.0 || u_gradientType == 0 && flagBackground <= 0.0) {
    gradient(color, vGradientVector1, vGradientVector2, u_colorSteps);
  }
#endif

  if(opacity < 1.0) {
    color.a *= opacity;
  }

#ifdef TEXTURE
  if(flagBackground > 0.0) {
    vec3 texCoord = vTextureCoord;

    if(texCoord.z == 1.0) {
      texCoord = fract(texCoord);
    }

    if(texCoord.x <= 1.0 && texCoord.x >= 0.0
      && texCoord.y <= 1.0 && texCoord.y >= 0.0) {
      if(vSourceRect.z > 0.0) {
        texCoord.x = vSourceRect.x + texCoord.x * vSourceRect.z;
        texCoord.y = 1.0 - (vSourceRect.y + (1.0 - texCoord.y) * vSourceRect.w);
      }
      if(frameIndex < 0.0) {
        vec4 texColor = texture2D(u_texSampler, texCoord.xy);
        color = mix(color, texColor, texColor.a);
      } else {
        int index = int(floor(clamp(0.0, 11.0, frameIndex)));
        vec4 texColor;
        if(index == 0) texColor = texture2D(u_texFrame0, texCoord.xy);
        else if(index == 1) texColor = texture2D(u_texFrame1, texCoord.xy);
        else if(index == 2) texColor = texture2D(u_texFrame2, texCoord.xy);
        else if(index == 3) texColor = texture2D(u_texFrame3, texCoord.xy);
        else if(index == 4) texColor = texture2D(u_texFrame4, texCoord.xy);
        else if(index == 5) texColor = texture2D(u_texFrame5, texCoord.xy);
        else if(index == 6) texColor = texture2D(u_texFrame6, texCoord.xy);
        else if(index == 7) texColor = texture2D(u_texFrame7, texCoord.xy);
        else if(index == 8) texColor = texture2D(u_texFrame8, texCoord.xy);
        else if(index == 9) texColor = texture2D(u_texFrame9, texCoord.xy);
        else if(index == 10) texColor = texture2D(u_texFrame10, texCoord.xy);
        else texColor = texture2D(u_texFrame11, texCoord.xy);
        float alpha = texColor.a;
        if(opacity < 1.0) {
          texColor.a *= opacity;
          alpha *= mix(0.465, 1.0, opacity);
        }
        // color = mix(color, texColor, texColor.a);
        color.rgb = mix(color.rgb, texColor.rgb, alpha);
        // color.rgb = mix(texColor.rgb, color.rgb, color.a);
        color.rgb = mix(texColor.rgb, color.rgb, clamp(color.a / max(0.0001, texColor.a), 0.0, 1.0));
        color.a = texColor.a + (1.0 - texColor.a) * color.a;
      }
    }
  }
#endif

#ifdef FILTER
  if(u_filterFlag > 0) {
    transformColor(color, u_colorMatrix);
  }
#endif

#ifdef CLOUDFILTER
  float colorCloudMatrix[20];
  buildCloudColor(colorCloudMatrix);
  transformColor(color, colorCloudMatrix);
#endif

#ifdef CLIPPATH
  float clip = texture2D(u_clipSampler, vClipUV).r;
  color *= clip;
#endif

  gl_FragColor = color;
}`;
    },
    /* 68 */
    /***/
    function(n, l, i) {
      i.r(l), (function(c, m) {
        i.d(l, "requestAnimationFrame", function() {
          return K;
        }), i.d(l, "cancelAnimationFrame", function() {
          return u;
        }), i(1).glMatrix.setMatrixArrayType(Array);
        function L() {
          if (typeof performance < "u" && performance.now)
            return performance.now();
          if (typeof c < "u" && c.hrtime) {
            const [a, e] = c.hrtime();
            return a * 1e3 + e * 1e-6;
          }
          return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
        }
        let K, u;
        typeof m < "u" && typeof m.requestAnimationFrame == "function" ? (K = m.requestAnimationFrame, u = m.cancelAnimationFrame) : (K = function(a) {
          return setTimeout(() => {
            a(L());
          }, 16);
        }, u = function(a) {
          return clearTimeout(a);
        });
      }).call(this, i(69), i(22));
    },
    /* 69 */
    /***/
    function(n, l) {
      var i = n.exports = {}, c, m;
      function L() {
        throw new Error("setTimeout has not been defined");
      }
      function K() {
        throw new Error("clearTimeout has not been defined");
      }
      (function() {
        try {
          typeof setTimeout == "function" ? c = setTimeout : c = L;
        } catch {
          c = L;
        }
        try {
          typeof clearTimeout == "function" ? m = clearTimeout : m = K;
        } catch {
          m = K;
        }
      })();
      function u(G) {
        if (c === setTimeout)
          return setTimeout(G, 0);
        if ((c === L || !c) && setTimeout)
          return c = setTimeout, setTimeout(G, 0);
        try {
          return c(G, 0);
        } catch {
          try {
            return c.call(null, G, 0);
          } catch {
            return c.call(this, G, 0);
          }
        }
      }
      function a(G) {
        if (m === clearTimeout)
          return clearTimeout(G);
        if ((m === K || !m) && clearTimeout)
          return m = clearTimeout, clearTimeout(G);
        try {
          return m(G);
        } catch {
          try {
            return m.call(null, G);
          } catch {
            return m.call(this, G);
          }
        }
      }
      var e = [], r = !1, X, W = -1;
      function p() {
        !r || !X || (r = !1, X.length ? e = X.concat(e) : W = -1, e.length && C());
      }
      function C() {
        if (!r) {
          var G = u(p);
          r = !0;
          for (var d = e.length; d; ) {
            for (X = e, e = []; ++W < d; )
              X && X[W].run();
            W = -1, d = e.length;
          }
          X = null, r = !1, a(G);
        }
      }
      i.nextTick = function(G) {
        var d = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var t = 1; t < arguments.length; t++)
            d[t - 1] = arguments[t];
        e.push(new I(G, d)), e.length === 1 && !r && u(C);
      };
      function I(G, d) {
        this.fun = G, this.array = d;
      }
      I.prototype.run = function() {
        this.fun.apply(null, this.array);
      }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {};
      function o() {
      }
      i.on = o, i.addListener = o, i.once = o, i.off = o, i.removeListener = o, i.removeAllListeners = o, i.emit = o, i.prependListener = o, i.prependOnceListener = o, i.listeners = function(G) {
        return [];
      }, i.binding = function(G) {
        throw new Error("process.binding is not supported");
      }, i.cwd = function() {
        return "/";
      }, i.chdir = function(G) {
        throw new Error("process.chdir is not supported");
      }, i.umask = function() {
        return 0;
      };
    },
    /* 70 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return Y;
      });
      var c = i(1), m = i(71), L = i(73), K = i(213), u = i(214), a = i(215), e = i(216);
      i(1).glMatrix.setMatrixArrayType(Array);
      function r(T, y) {
        var J = Object.keys(T);
        if (Object.getOwnPropertySymbols) {
          var N = Object.getOwnPropertySymbols(T);
          y && (N = N.filter(function(x) {
            return Object.getOwnPropertyDescriptor(T, x).enumerable;
          })), J.push.apply(J, N);
        }
        return J;
      }
      function X(T) {
        for (var y = 1; y < arguments.length; y++) {
          var J = arguments[y] != null ? arguments[y] : {};
          y % 2 ? r(Object(J), !0).forEach(function(N) {
            W(T, N, J[N]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(T, Object.getOwnPropertyDescriptors(J)) : r(Object(J)).forEach(function(N) {
            Object.defineProperty(T, N, Object.getOwnPropertyDescriptor(J, N));
          });
        }
        return T;
      }
      function W(T, y, J) {
        return y in T ? Object.defineProperty(T, y, { value: J, enumerable: !0, configurable: !0, writable: !0 }) : T[y] = J, T;
      }
      const p = Symbol.for("spritejs_changedAttrs"), C = Symbol.for("spritejs_attributes"), I = Symbol("resolution"), o = Symbol("animations"), G = Symbol("eventListeners"), d = Symbol("captureEventListeners"), t = Symbol("filters"), s = Symbol("display"), b = Symbol("program"), h = Symbol("shaderAttrs"), S = Symbol("uniforms");
      class Y {
        constructor(y = {}) {
          this.attributes = new this.constructor.Attr(this), this[I] = {
            width: 300,
            height: 150
          }, Object.assign(this.attributes, y), this[o] = /* @__PURE__ */ new Set(), this[G] = {}, this[d] = {};
        }
        get ancestors() {
          let y = this.parent;
          const J = [];
          for (; y; )
            J.push(y), y = y.parent;
          return J;
        }
        get animations() {
          return this[o];
        }
        get filters() {
          return this[t] || this.parent && this.parent.filters;
        }
        get isVisible() {
          return !1;
        }
        get layer() {
          return this.parent ? this.parent.layer : null;
        }
        get localMatrix() {
          const y = this.transformMatrix, {
            x: J,
            y: N
          } = this.attributes;
          return y[4] += J, y[5] += N, y;
        }
        get opacity() {
          let y = this.attributes.opacity;
          return this.parent && this.parent.opacity != null && (y *= this.parent.opacity), y;
        }
        get parentNode() {
          return this.parent;
        }
        get nextSibling() {
          return this.getNodeNearBy(1);
        }
        get previousSibling() {
          return this.getNodeNearBy(-1);
        }
        get program() {
          return this[b];
        }
        /* get parent defined by connect method */
        get renderer() {
          return this.parent ? this.parent.renderer : null;
        }
        get renderMatrix() {
          if (this.__cacheRenderMatrix)
            return this.__cacheRenderMatrix;
          let y = this.localMatrix;
          const J = this.parent;
          if (J) {
            const N = J.__cacheRenderMatrix || J.renderMatrix;
            N && (y = c.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), N, y));
          }
          return y;
        }
        get worldScaling() {
          const y = this.renderMatrix;
          return [Math.hypot(y[0], y[1]), Math.hypot(y[2], y[3])];
        }
        get worldRotation() {
          const y = this.renderMatrix;
          return Math.atan2(y[1], y[3]);
        }
        get worldPosition() {
          const y = this.renderMatrix;
          return [y[4], y[5]];
        }
        get uniforms() {
          return this[S];
        }
        /* get zOrder defined by connect method */
        /* attributes */
        get className() {
          return this.attributes.className;
        }
        set className(y) {
          this.attributes.className = y;
        }
        get id() {
          return this.attributes.id;
        }
        set id(y) {
          this.attributes.id = y;
        }
        get name() {
          return this.attributes.name;
        }
        set name(y) {
          this.attributes.name = y;
        }
        get zIndex() {
          return this.attributes.zIndex;
        }
        set zIndex(y) {
          this.attributes.zIndex = y;
        }
        get mesh() {
          return null;
        }
        get shaderAttrs() {
          return this[h] || {};
        }
        activateAnimations() {
          const y = this.layer;
          if (y) {
            const J = this[o];
            J.forEach((x) => {
              x.baseTimeline = y.timeline, x.play(), x.finished.then(() => {
                J.delete(x);
              });
            });
            const N = this.children;
            N && N.forEach((x) => {
              x.activateAnimations && x.activateAnimations();
            });
          }
        }
        addEventListener(y, J, N = {}) {
          y === "mousewheel" && (y = "wheel"), typeof N == "boolean" && (N = {
            capture: N
          });
          const {
            capture: x,
            once: R
          } = N, z = x ? d : G;
          return this[z][y] = this[z][y] || [], this[z][y].push({
            listener: J,
            once: R
          }), this;
        }
        animate(y, J) {
          const N = new L.default(this, y, J);
          return this.effects && N.applyEffects(this.effects), this.layer && (N.baseTimeline = this.layer.timeline, N.play(), N.finished.then(() => {
            this[o].delete(N);
          })), this[o].add(N), N;
        }
        attr(...y) {
          if (y.length === 0)
            return this.attributes[C];
          if (y.length > 1) {
            let [J, N] = y;
            return typeof N == "function" && (N = N(this.attr(J))), this.setAttribute(J, N), this;
          }
          return typeof y[0] == "string" ? this.getAttribute(y[0]) : (Object.assign(this.attributes, y[0]), this);
        }
        cloneNode() {
          const y = new this.constructor(), J = this.attributes[p];
          return y.attr(J), y;
        }
        connect(y, J) {
          Object.defineProperty(this, "parent", {
            value: y,
            writable: !1,
            configurable: !0
          }), Object.defineProperty(this, "zOrder", {
            value: J,
            writable: !1,
            configurable: !0
          }), y.timeline && this.activateAnimations(), this.setResolution(y.getResolution()), this.forceUpdate(), this.dispatchEvent({
            type: "append",
            detail: {
              parent: y,
              zOrder: J
            }
          });
        }
        contains(y) {
          for (; y && this !== y; )
            y = y.parent;
          return !!y;
        }
        deactivateAnimations() {
          this[o].forEach((J) => J.cancel());
          const y = this.children;
          y && y.forEach((J) => {
            J.deactivateAnimations && J.deactivateAnimations();
          });
        }
        disconnect() {
          const {
            parent: y,
            zOrder: J
          } = this;
          delete this.parent, delete this.zOrder, this.deactivateAnimations(), this.dispatchEvent({
            type: "remove",
            detail: {
              parent: y,
              zOrder: J
            }
          }), y && y.forceUpdate();
        }
        dispatchEvent(y) {
          y instanceof u.default || (y = new u.default(y)), y.target = this;
          let J = y.type;
          J === "mousewheel" && (J = "wheel");
          const N = [this];
          let x = this.parent;
          for (; y.bubbles && x; )
            N.push(x), x = x.parent;
          for (let R = N.length - 1; R >= 0; R--) {
            const z = N[R], Q = z[d] && z[d][J];
            if (Q && Q.length && (y.currentTarget = z, Q.forEach(({
              listener: P,
              once: D
            }) => {
              P.call(this, y), D && N.removeEventListener(P);
            }), delete y.currentTarget), !y.bubbles && y.cancelBubble)
              break;
          }
          if (!y.cancelBubble)
            for (let R = 0; R < N.length; R++) {
              const z = N[R], Q = z[G] && z[G][J];
              if (Q && Q.length && (y.currentTarget = z, Q.forEach(({
                listener: P,
                once: D
              }) => {
                P.call(this, y), D && N.removeEventListener(P);
              }), delete y.currentTarget), !y.bubbles || y.cancelBubble)
                break;
            }
        }
        dispatchPointerEvent(y) {
          const {
            layerX: J,
            layerY: N
          } = y;
          return this.isPointCollision(J, N) ? (this.dispatchEvent(y), !0) : !1;
        }
        draw(y = []) {
          const J = this.mesh;
          if (J) {
            if (Object(a.applyFilters)(J, this.filters), y.push(J), this[b]) {
              J.setProgram(this[b]);
              const N = this[h];
              N && Object.entries(N).forEach(([R, z]) => {
                J.setAttribute(R, z);
              });
              const x = this[S];
              if (this[S]) {
                const R = {};
                Object.entries(x).forEach(([z, Q]) => {
                  typeof Q == "function" && (Q = Q(this, z)), R[z] = Q;
                }), J.setUniforms(R);
              }
            }
            Object(e.default)(this, J);
          }
          return y;
        }
        forceUpdate() {
          this.parent && this.parent.forceUpdate();
        }
        getAttribute(y) {
          return this.attributes[y];
        }
        getListeners(y, {
          capture: J = !1
        } = {}) {
          return [...this[J ? d : G][y] || []];
        }
        getNodeNearBy(y = 1) {
          if (!this.parent)
            return null;
          if (y === 0)
            return this;
          const J = this.parent.children, N = J.indexOf(this);
          return J[N + y];
        }
        getWorldPosition(y, J) {
          const N = this.renderMatrix, x = y * N[0] + J * N[2] + N[4], R = y * N[1] + J * N[3] + N[5];
          return [x, R];
        }
        getOffsetPosition(y, J) {
          const N = c.mat2d.invert(Array.of(0, 0, 0, 0, 0, 0), this.renderMatrix), x = y * N[0] + J * N[2] + N[4], R = y * N[1] + J * N[3] + N[5];
          return [x, R];
        }
        getResolution() {
          return X({}, this[I]);
        }
        isPointCollision(y, J) {
          if (!this.mesh)
            return !1;
          const N = this.attributes.pointerEvents;
          if (N === "none" || N !== "all" && !this.isVisible)
            return !1;
          let x = "both";
          return N === "visibleFill" && (x = "fill"), N === "visibleStroke" && (x = "stroke"), this.mesh.isPointCollision(y, J, x);
        }
        onPropertyChange(y, J, N) {
          y !== "id" && y !== "name" && y !== "className" && y !== "pointerEvents" && y !== "passEvents" && this.forceUpdate(), y === "filter" && (this[t] = Object(a.parseFilterString)(J)), y === "zIndex" && this.parent && this.parent.reorder();
        }
        setAttribute(y, J) {
          y === "attrs" && this.attr(J), this.attributes[y] = J;
        }
        setMouseCapture() {
          this.layer && (this.layer.__mouseCapturedTarget = this);
        }
        // layer.renderer.createProgram(fragmentShader, vertexShader, attributeOptions)
        setProgram(y) {
          this[b] = y, this.forceUpdate();
        }
        setShaderAttribute(y, J) {
          this[h] = this[h] || {}, this[h][y] = J, this.forceUpdate();
        }
        setUniforms(y) {
          this[S] = this[S] || {}, Object.assign(this[S], y), this.forceUpdate();
        }
        setResolution({
          width: y,
          height: J
        }) {
          const {
            width: N,
            height: x
          } = this[I];
          (N !== y || x !== J) && (this[I] = {
            width: y,
            height: J
          }, this.forceUpdate(), this.dispatchEvent({
            type: "resolutionchange",
            detail: {
              width: y,
              height: J
            }
          }));
        }
        show() {
          this.attributes.display === "none" && (this.attributes.display = this[s] || "");
        }
        hide() {
          this.attributes.display !== "none" && (this[s] = this.attributes.display, this.attributes.display = "none");
        }
        releaseMouseCapture() {
          this.layer && this.layer.__mouseCapturedTarget === this && (this.layer.__mouseCapturedTarget = null);
        }
        remove() {
          return this.parent && this.parent.removeChild ? (this.parent.removeChild(this), !0) : !1;
        }
        removeAllListeners(y, J = {}) {
          typeof J == "boolean" && (J = {
            capture: J
          });
          const x = J.capture ? d : G;
          return this[x][y] && (this[x][y] = []), this;
        }
        removeAttribute(y) {
          this.setAttribute(y, null);
        }
        removeEventListener(y, J, N = {}) {
          typeof N == "boolean" && (N = {
            capture: N
          });
          const R = N.capture ? d : G;
          if (this[R][y]) {
            const z = this[R][y];
            if (z)
              for (let Q = 0; Q < z.length; Q++) {
                const {
                  listener: P
                } = z[Q];
                if (P === J) {
                  this[R][y].splice(Q, 1);
                  break;
                }
              }
          }
          return this;
        }
        transition(y, J = "linear") {
          const N = this, x = Symbol("animation");
          J = J || "linear";
          let R = 0;
          return typeof y == "object" && (R = y.delay || 0, y = y.duration), {
            [x]: null,
            cancel(z = !1) {
              const Q = this[x];
              Q && Q.cancel(z);
            },
            end() {
              const z = this[x];
              z && (z.playState === "running" || z.playState === "pending") && z.finish();
            },
            reverse() {
              const z = this[x];
              if (z)
                if (z.playState === "running" || z.playState === "pending")
                  z.playbackRate = -z.playbackRate;
                else {
                  const Q = z.timing.direction;
                  z.timing.direction = Q === "reverse" ? "normal" : "reverse", z.play();
                }
              return z.finished;
            },
            attr(z, Q) {
              return this.end(), typeof z == "string" && (z = {
                [z]: Q
              }), Object.entries(z).forEach(([P, D]) => {
                typeof D == "function" && (z[P] = D(N.attr(P)));
              }), this[x] = N.animate([z], {
                duration: y * 1e3,
                delay: R * 1e3,
                fill: "forwards",
                easing: J
              }), this[x].finished;
            }
          };
        }
        updateContours() {
        }
      }
      W(Y, "Attr", m.default), K.default.registerNode(Y, "node");
    },
    /* 71 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return Y;
      });
      var c = i(1), m = i(12), L = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const K = Symbol.for("spritejs_setAttributeDefault"), u = Symbol.for("spritejs_declareAlias"), a = Symbol.for("spritejs_setAttribute"), e = Symbol.for("spritejs_getAttribute"), r = Symbol.for("spritejs_attributes"), X = Symbol.for("spritejs_changedAttrs"), W = Symbol("subject"), p = Symbol("attr"), C = Symbol("default"), I = Symbol("alias");
      function o(T, [y, J]) {
        let N = c.mat2d.fromValues(1, 0, 0, 1, 0, 0);
        return [...T].forEach(([x, R]) => {
          if ((y || J) && (N = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), N, [y, J])), x === "matrix")
            N = c.mat2d.multiply(N, N, R);
          else if (x === "offsetTranslate")
            N[4] += R[0], N[5] += R[1];
          else if (x === "offsetRotate")
            N = c.mat2d.rotate(Array.of(0, 0, 0, 0, 0, 0), N, R);
          else if (x === "skew") {
            const [z, Q] = R;
            N = c.mat2d.multiply(N, N, c.mat2d.fromValues(1, Math.tan(Q), Math.tan(z), 1, 0, 0));
          } else
            c.mat2d[x](N, N, R);
          (y || J) && (N = c.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), N, [-y, -J]));
        }), N;
      }
      const G = Symbol("transformMatrix"), d = Symbol("transforms"), t = Symbol("changedAttrs"), s = Symbol("lastChangedAttr"), b = Symbol("offsetFigure");
      function h(T, y, J) {
        const N = T[p][y];
        if (T[a](y, J, !1) || T[s] !== y) {
          const R = T[d];
          R.has(y) && R.delete(y), J && (y === "rotate" && (J = Math.PI * J / 180), y === "scale" && (J = J.map((z) => Math.abs(z) > 1e-5 ? z : 1 / z > 0 ? 1e-5 : -1e-5)), R.set(y, J)), T[G] = null, T[W].onPropertyChange(y, J, N, T);
        }
      }
      function S(T) {
        const y = T[b], J = T.offsetDistance * y.getTotalLength(), N = y.getPointAtLength(J);
        if (N) {
          const x = T[d];
          let R = T.offsetRotate;
          R === "auto" ? R = N.angle : R === "reverse" ? R = Math.PI + N.angle : R = Math.PI * R / 180, x.set("offsetRotate", R), x.set("offsetTranslate", [N.x, N.y]), T[G] = null;
        }
      }
      class Y {
        static setDefault(y, ...J) {
          return y[K](...J);
        }
        static declareAlias(y, ...J) {
          return y[u](...J);
        }
        static setAttribute(y, ...J) {
          return y[a](...J);
        }
        static getAttribute(y, ...J) {
          return y[e](...J);
        }
        static getAttributes(y) {
          return y[r];
        }
        static getChangedAttributes(y) {
          return y[X];
        }
        constructor(y) {
          this[W] = y, this[p] = {}, this[G] = c.mat2d.fromValues(1, 0, 0, 1, 0, 0), this[d] = /* @__PURE__ */ new Map(), this[C] = {}, this[I] = [], Object.defineProperty(y, "transformMatrix", {
            get: () => (this[G] || (this[G] = o(this[d], this.transformOrigin)), [...this[G]])
          }), this[K]({
            id: "",
            name: "",
            className: "",
            /* class */
            x: 0,
            y: 0,
            /* pos */
            transformOrigin: [0, 0],
            transform: "",
            translate: [0, 0],
            rotate: 0,
            scale: [1, 1],
            skew: [0, 0],
            opacity: 1,
            zIndex: 0,
            offsetPath: void 0,
            offsetDistance: 0,
            offsetRotate: "auto",
            pointerEvents: "visible",
            // none | visible | visibleFill | visibleStroke | all
            filter: "none",
            display: ""
          }), this[u]("class", "pos"), this[t] = /* @__PURE__ */ new Set(), this[b] = new m.Figure2D({
            scale: 5,
            simplify: 0
          });
        }
        get [X]() {
          const y = {};
          return [...this[t]].forEach((J) => {
            y[J] = this[p][J];
          }), y;
        }
        get [r]() {
          const y = Object.assign({}, this[p]);
          for (let J = 0; J < this[I].length; J++) {
            const N = this[I][J];
            y[N] = this[N];
          }
          return y;
        }
        [K](y) {
          Object.assign(this[C], y), Object.assign(this[p], y);
        }
        [u](...y) {
          this[I].push(...y);
        }
        [a](y, J, N = !0) {
          const x = this[p][y], R = this[W];
          return J == null && (J = this[C][y]), Object(L.compareValue)(x, J) ? !1 : (this[p][y] = J, this[t].has(y) && this[t].delete(y), this[t].add(y), this[s] = y, N && R.onPropertyChange(y, J, x, this), !0);
        }
        [e](y) {
          return this[p][y];
        }
        set id(y) {
          this[a]("id", y);
        }
        get id() {
          return this[e]("id");
        }
        set name(y) {
          this[a]("name", y);
        }
        get name() {
          return this[e]("name");
        }
        set className(y) {
          this[a]("className", y);
        }
        get className() {
          return this[e]("className");
        }
        set class(y) {
          this.className = y;
        }
        get class() {
          return this.className;
        }
        get x() {
          return this[e]("x");
        }
        set x(y) {
          this[a]("x", Object(L.toNumber)(y));
        }
        get y() {
          return this[e]("y");
        }
        set y(y) {
          this[a]("y", Object(L.toNumber)(y));
        }
        get pos() {
          return [this.x, this.y];
        }
        set pos(y) {
          y = Object(L.toArray)(y), Array.isArray(y) || (y = [y, y]), this.x = y[0], this.y = y[1];
        }
        get transform() {
          return this[e]("transform");
        }
        set transform(y) {
          let J = null;
          if (Array.isArray(y) && (J = y, y = `matrix(${y.map(L.toNumber).join()})`), typeof y == "string")
            y = y.replace(/\s*,\s*/g, ",");
          else if (y != null)
            throw new TypeError("Invalid transform value.");
          const N = this[p].transform;
          if (this[a]("transform", y, !1)) {
            const x = this[d];
            if (x.has("matrix") && x.delete("matrix"), J)
              x.set("matrix", J);
            else if (y) {
              const R = y.match(/(matrix|translate|rotate|scale|skew)\([^()]+\)/g);
              if (R) {
                let z = c.mat2d.fromValues(1, 0, 0, 1, 0, 0);
                for (let Q = 0; Q < R.length; Q++) {
                  const D = R[Q].match(/^(matrix|translate|rotate|scale|skew)\(([^()]+)\)/);
                  if (D) {
                    let [, _, F] = D;
                    _ === "rotate" ? F = Math.PI * parseFloat(F) / 180 : F = F.trim().split(/[\s,]+/).map((v) => Object(L.toNumber)(v)), _ === "matrix" ? z = c.mat2d.multiply(z, z, F) : _ === "skew" ? z = c.mat2d.multiply(z, z, c.mat2d.fromValues(1, Math.tan(F[1]), Math.tan(F[0]), 1, 0, 0)) : c.mat2d[_](z, z, F), x.set("matrix", z);
                  }
                }
              } else
                throw new TypeError("Invalid transform value.");
            }
            this[G] = null, this[W].onPropertyChange("transform", y, N, this);
          }
        }
        get transformOrigin() {
          return this[e]("transformOrigin");
        }
        set transformOrigin(y) {
          y = Object(L.toArray)(y, !0), y != null && !Array.isArray(y) && (y = [y, y]), this[a]("transformOrigin", y) && (this[G] = null);
        }
        get rotate() {
          return this[e]("rotate");
        }
        set rotate(y) {
          h(this, "rotate", y);
        }
        get translate() {
          return this[e]("translate");
        }
        set translate(y) {
          y = Object(L.toArray)(y, !0), y != null && !Array.isArray(y) && (y = [y, y]), h(this, "translate", y);
        }
        get scale() {
          return this[e]("scale");
        }
        set scale(y) {
          y = Object(L.toArray)(y, !0), y != null && !Array.isArray(y) && (y = [y, y]), h(this, "scale", y);
        }
        get skew() {
          return this[e]("skew");
        }
        set skew(y) {
          y = Object(L.toArray)(y, !0), y != null && !Array.isArray(y) && (y = [y, y]), h(this, "skew", y);
        }
        get opacity() {
          return this[e]("opacity");
        }
        set opacity(y) {
          y != null && (y = Number(y)), this[a]("opacity", y);
        }
        get zIndex() {
          return this[e]("zIndex");
        }
        set zIndex(y) {
          y != null && (y = Number(y)), this[a]("zIndex", y);
        }
        get offsetPath() {
          return this[e]("offsetPath");
        }
        set offsetPath(y) {
          this[a]("offsetPath", y) && (this[b].beginPath(), y != null && this[b].addPath(y), S(this));
        }
        get offsetDistance() {
          return this[e]("offsetDistance");
        }
        set offsetDistance(y) {
          this[a]("offsetDistance", Object(L.toNumber)(y)) && S(this);
        }
        get offsetRotate() {
          return this[e]("offsetRotate");
        }
        set offsetRotate(y) {
          this[a]("offsetRotate", y), S(this);
        }
        get pointerEvents() {
          return this[e]("pointerEvents");
        }
        set pointerEvents(y) {
          if (y != null && y !== "none" && y !== "visible" && y !== "visibleFill" && y !== "visibleStroke" && y !== "all")
            throw new TypeError("Invalid pointerEvents type.");
          this[a]("pointerEvents", y);
        }
        get filter() {
          return this[e]("filter");
        }
        set filter(y) {
          this[a]("filter", y);
        }
        get display() {
          return this[e]("display");
        }
        set display(y) {
          this[a]("display", y);
        }
        /* istanbul ignore next */
        set offset(y) {
        }
      }
    },
    /* 72 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "sizeToPixel", function() {
        return c;
      }), i.d(l, "toString", function() {
        return m;
      }), i.d(l, "toNumber", function() {
        return L;
      }), i.d(l, "toArray", function() {
        return K;
      }), i.d(l, "compareValue", function() {
        return u;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(a, e) {
        const r = a.trim().match(/^([\d.]+)(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin)$/);
        r ? a = {
          size: parseFloat(r[1]),
          unit: r[2]
        } : a = {
          size: parseFloat(a),
          unit: "px"
        };
        let {
          size: X,
          unit: W
        } = a;
        if (W === "pt")
          X /= 0.75;
        else if (W === "pc")
          X *= 16;
        else if (W === "in")
          X *= 96;
        else if (W === "cm")
          X *= 96 / 2.54;
        else if (W === "mm")
          X *= 96 / 25.4;
        else if (W === "em" || W === "rem" || W === "ex") {
          if (!e && typeof getComputedStyle == "function" && typeof document < "u") {
            const p = getComputedStyle(document.documentElement).fontSize;
            p ? e = c(p, 16) : e = 16;
          }
          X *= e, W === "ex" && (X /= 2);
        } else if (W === "q")
          X *= 96 / 25.4 / 4;
        else if (W === "vw" || W === "vh") {
          if (typeof document < "u") {
            const p = W === "vw" ? window.innerWidth || document.documentElement.clientWidth : window.innerHeight || document.documentElement.clientHeight;
            X *= p / 100;
          }
        } else if ((W === "vmax" || W === "vmin") && typeof document < "u") {
          const p = window.innerWidth || document.documentElement.clientWidth, C = window.innerHeight || document.documentElement.clientHeight;
          W === "vmax" ? X *= Math.max(p, C) / 100 : X *= Math.min(p, C) / 100;
        }
        return X;
      }
      function m(a) {
        return a == null ? a : String(a);
      }
      function L(a) {
        if (a == null)
          return a;
        if (typeof a == "string" && (a = c(a)), !Number.isFinite(a))
          throw new TypeError("Invalid value");
        return a;
      }
      function K(a, e = !1) {
        return a === "" ? null : (typeof a == "string" && (a = a.split(/[\s,]+/g)), Array.isArray(a) && (e && (a = a.map(L)), a.length === 1) ? a[0] : a);
      }
      function u(a, e) {
        if (Array.isArray(a) && Array.isArray(e)) {
          if (a.length !== e.length)
            return !1;
          for (let r = 0; r < a.length; r++)
            if (a[r] !== e[r])
              return !1;
          return !0;
        }
        return a == null && e == null || a === e;
      }
    },
    /* 73 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return W;
      });
      var c = i(74), m = i(32), L = /* @__PURE__ */ i.n(m), K = i(68), u = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      function a() {
        return a = Object.assign || function(p) {
          for (var C = 1; C < arguments.length; C++) {
            var I = arguments[C];
            for (var o in I)
              Object.prototype.hasOwnProperty.call(I, o) && (p[o] = I[o]);
          }
          return p;
        }, a.apply(this, arguments);
      }
      function e(p) {
        if (typeof p == "string") {
          if (p = p.trim(), /^[0-9.]+%$/.test(p))
            return parseFloat(p) / 100;
          if (/^([\d.]+)(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin)$/.test(p))
            return Object(u.sizeToPixel)(p);
        }
        return p;
      }
      function r(p, C, I, o, G) {
        return typeof p == "string" && (p = L()(p)), typeof C == "string" && (C = L()(C)), c.Effects.default(p, C, I, o, G);
      }
      function X(p, C, I, o, G) {
        return c.Effects.default(p, C, I, o, G);
      }
      c.Effects.default = function(p, C, I, o, G) {
        return Array.isArray(p) && Array.isArray(C) ? p.map((d, t) => d + (I - o) / (G - o) * (C[t] - d)) : typeof p == "number" && typeof C == "number" ? p + (I - o) / (G - o) * (C - p) : I - o > G - I ? C : p;
      }, c.Effects.fillColor = r, c.Effects.strokeColor = r, c.Effects.bgcolor = r, c.Effects.borderColor = r, c.Effects.text = X;
      class W extends c.Animator {
        constructor(C, I, o) {
          const G = C.attr();
          Object.entries(G).forEach(([d, t]) => {
            G[d] = c.Effects[d] ? t : e(t);
          }), I = I.map((d) => {
            let t = a({}, d);
            const s = {};
            return Object.entries(t).forEach(([b, h]) => {
              s[b] = c.Effects[b] ? h : e(h);
            }), s;
          }), super(G, I, o), this.target = C, this.setter = function(d, t) {
            t.attr(d);
          };
        }
        get playState() {
          return this.target.parent ? super.playState : "idle";
        }
        get finished() {
          return super.finished.then(() => {
            const C = this;
            return new Promise((I) => {
              function o() {
                C.setter(C.frame, C.target);
                const G = C.playState;
                G === "finished" || G === "idle" ? (Object(K.cancelAnimationFrame)(C.requestId), I()) : Object(K.requestAnimationFrame)(o);
              }
              o();
            });
          });
        }
        finish() {
          super.finish(), Object(K.cancelAnimationFrame)(this.requestId), this.setter(this.frame, this.target);
        }
        play() {
          if (!this.target.parent || this.playState === "running")
            return;
          super.play(), this.setter(this.frame, this.target);
          const C = this;
          this.ready.then(() => {
            C.setter(C.frame, C.target), C.requestId = Object(K.requestAnimationFrame)(function I() {
              const o = C.target;
              if (typeof document < "u" && document.documentElement && document.documentElement.contains && o.layer && o.layer.canvas && !document.documentElement.contains(o.layer.canvas)) {
                C.cancel();
                return;
              }
              const G = C.playState;
              C.setter(C.frame, C.target), G !== "idle" && (G === "running" ? C.requestId = Object(K.requestAnimationFrame)(I) : (G === "paused" || G === "pending" && C.timeline.currentTime < 0) && C.ready.then(() => {
                C.setter(C.frame, C.target), C.requestId = Object(K.requestAnimationFrame)(I);
              }));
            });
          });
        }
        cancel(C = !1) {
          Object(K.cancelAnimationFrame)(this.requestId), C ? (this.setter(this.frame, this.target), super.cancel()) : (super.cancel(), this.setter(this.frame, this.target));
        }
      }
    },
    /* 74 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      }), l.Timeline = l.Effects = l.Easings = l.Animator = void 0;
      var c = i(75), m = r(c), L = i(187), K = r(L), u = i(188), a = i(190), e = r(a);
      function r(X) {
        return X && X.__esModule ? X : { default: X };
      }
      l.Animator = e.default, l.Easings = u.Easings, l.Effects = K.default, l.Timeline = m.default;
    },
    /* 75 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      });
      var c = i(76), m = d(c), L = i(133), K = d(L), u = i(141), a = d(u), e = i(164), r = d(e), X = i(170), W = d(X), p = i(171), C = d(p), I = i(175), o = d(I), G = i(186);
      function d(N) {
        return N && N.__esModule ? N : { default: N };
      }
      var t = (0, G.createNowTime)(), s = {
        originTime: 0,
        playbackRate: 1
      }, b = (0, o.default)("timeMark"), h = (0, o.default)("playbackRate"), S = (0, o.default)("timers"), Y = (0, o.default)("originTime"), T = (0, o.default)("setTimer"), y = (0, o.default)("parent"), J = function() {
        function N(x, R) {
          (0, W.default)(this, N), x instanceof N && (R = x, x = {}), x = (0, r.default)({}, s, x), R && (this[y] = R);
          var z = x.nowtime || t;
          if (R)
            Object.defineProperty(this, "globalTime", {
              get: function() {
                return R.currentTime;
              }
            });
          else {
            var Q = z();
            Object.defineProperty(this, "globalTime", {
              get: function() {
                return z() - Q;
              }
            });
          }
          this[b] = [{
            globalTime: this.globalTime,
            localTime: -x.originTime,
            entropy: -x.originTime,
            playbackRate: x.playbackRate,
            globalEntropy: 0
          }], this[y] && (this[b][0].globalEntropy = this[y].entropy), this[Y] = x.originTime, this[h] = x.playbackRate, this[S] = new a.default();
        }
        return (0, C.default)(N, [{
          key: "markTime",
          value: function() {
            var R = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, z = R.time, Q = z === void 0 ? this.currentTime : z, P = R.entropy, D = P === void 0 ? this.entropy : P, _ = R.playbackRate, F = _ === void 0 ? this.playbackRate : _, v = {
              globalTime: this.globalTime,
              localTime: Q,
              entropy: D,
              playbackRate: F,
              globalEntropy: this.globalEntropy
            };
            this[b].push(v);
          }
        }, {
          key: "fork",
          value: function(R) {
            return new N(R, this);
          }
        }, {
          key: "seekGlobalTime",
          value: function(R) {
            var z = this.seekTimeMark(R), Q = this[b][z], P = Q.entropy, D = Q.playbackRate, _ = Q.globalTime;
            return _ + (R - P) / Math.abs(D);
          }
        }, {
          key: "seekLocalTime",
          value: function(R) {
            var z = this.seekTimeMark(R), Q = this[b][z], P = Q.localTime, D = Q.entropy, _ = Q.playbackRate;
            return _ > 0 ? P + (R - D) : P - (R - D);
          }
        }, {
          key: "seekTimeMark",
          value: function(R) {
            var z = this[b], Q = 0, P = z.length - 1;
            if (R <= z[Q].entropy)
              return Q;
            if (R >= z[P].entropy)
              return P;
            for (var D = Math.floor((Q + P) / 2); D > Q && D < P; ) {
              if (R === z[D].entropy)
                return D;
              R < z[D].entropy ? P = D : R > z[D].entropy && (Q = D), D = Math.floor((Q + P) / 2);
            }
            return Q;
          }
        }, {
          key: "updateTimers",
          value: function() {
            var R = this, z = [].concat((0, K.default)(this[S]));
            z.forEach(function(Q) {
              var P = (0, m.default)(Q, 2), D = P[0], _ = P[1];
              R[T](_.handler, _.time, D);
            });
          }
        }, {
          key: "clearTimeout",
          value: function(x) {
            function R(z) {
              return x.apply(this, arguments);
            }
            return R.toString = function() {
              return x.toString();
            }, R;
          }(function(x) {
            var R = this[S].get(x);
            R && R.timerID != null && (this[y] ? this[y].clearTimeout(R.timerID) : clearTimeout(R.timerID)), this[S].delete(x);
          })
        }, {
          key: "clearInterval",
          value: function(R) {
            return this.clearTimeout(R);
          }
        }, {
          key: "clear",
          value: function() {
            var R = this, z = this[S];
            [].concat((0, K.default)(z.keys())).forEach(function(Q) {
              R.clearTimeout(Q);
            });
          }
          /*
            setTimeout(func, {delay: 100, isEntropy: true})
            setTimeout(func, {entropy: 100})
            setTimeout(func, 100})
           */
        }, {
          key: "setTimeout",
          value: function(R) {
            var z = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { delay: 0 };
            return this[T](R, z);
          }
        }, {
          key: "setInterval",
          value: function(R) {
            var z = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { delay: 0 }, Q = this, P = this[T](function D() {
              Q[T](D, z, P), R();
            }, z);
            return P;
          }
        }, {
          key: T,
          value: function(R, z) {
            var Q = this, P = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : (0, o.default)("timerID");
            z = (0, G.formatDelay)(z);
            var D = this[S].get(P), _ = void 0, F = null, v = void 0, O = void 0;
            D ? (this.clearTimeout(P), z.isEntropy ? _ = (z.delay - (this.entropy - D.startEntropy)) / Math.abs(this.playbackRate) : _ = (z.delay - (this.currentTime - D.startTime)) / this.playbackRate, v = D.startTime, O = D.startEntropy) : (_ = z.delay / (z.isEntropy ? Math.abs(this.playbackRate) : this.playbackRate), v = this.currentTime, O = this.entropy);
            var li = this[y], ii = li ? li.setTimeout.bind(li) : setTimeout, ti = z.heading;
            return !li && ti === !1 && _ < 0 && (_ = 1 / 0), (isFinite(_) || li) && (_ = Math.ceil(_), ii !== setTimeout && (_ = { delay: _, heading: ti }), F = ii(function() {
              Q[S].delete(P), R();
            }, _)), this[S].set(P, {
              timerID: F,
              handler: R,
              time: z,
              startTime: v,
              startEntropy: O
            }), P;
          }
        }, {
          key: "parent",
          get: function() {
            return this[y];
          }
        }, {
          key: "lastTimeMark",
          get: function() {
            return this[b][this[b].length - 1];
          }
        }, {
          key: "currentTime",
          get: function() {
            var R = this.lastTimeMark, z = R.localTime, Q = R.globalTime;
            return z + (this.globalTime - Q) * this.playbackRate;
          },
          set: function(R) {
            var z = this, Q = this.currentTime, P = R, D = this[S];
            this.markTime({ time: R }), [].concat((0, K.default)(D)).forEach(function(_) {
              var F = (0, m.default)(_, 2), v = F[0], O = F[1];
              if (D.has(v)) {
                var li = O.time, ii = li.isEntropy, ti = li.delay, $ = li.heading, ai = O.handler, Xi = O.startTime;
                if (ii)
                  ti === 0 && (ai(), z.clearTimeout(v));
                else {
                  var M = Xi + ti;
                  (ti === 0 || $ !== !1 && (P - Q) * ti <= 0 || Q <= M && M <= P || Q >= M && M >= P) && (ai(), z.clearTimeout(v));
                }
              }
            }), this.updateTimers();
          }
          // Both currentTime and entropy should be influenced by playbackRate.
          // If current playbackRate is negative, the currentTime should go backwards
          // while the entropy remain to go forwards.
          // Both of the initial values is set to -originTime
        }, {
          key: "entropy",
          get: function() {
            var R = this.lastTimeMark, z = R.entropy, Q = R.globalEntropy;
            return z + Math.abs((this.globalEntropy - Q) * this.playbackRate);
          },
          // get globalTime() {
          //   if(this[_parent]) {
          //     return this[_parent].currentTime;
          //   }
          //   return nowtime();
          // }
          // change entropy will NOT cause currentTime changing but may influence the pass
          // and the future of the timeline. (It may change the result of seek***Time)
          // While entropy is set, all the marks behind will be droped
          set: function(R) {
            if (this.entropy > R) {
              var z = this.seekTimeMark(R);
              this[b].length = z + 1;
            }
            this.markTime({ entropy: R }), this.updateTimers();
          }
        }, {
          key: "globalEntropy",
          get: function() {
            return this[y] ? this[y].entropy : this.globalTime;
          }
        }, {
          key: "playbackRate",
          get: function() {
            return this[h];
          },
          set: function(R) {
            R !== this.playbackRate && (this.markTime({ playbackRate: R }), this[h] = R, this.updateTimers());
          }
        }, {
          key: "paused",
          get: function() {
            if (this.playbackRate === 0)
              return !0;
            for (var R = this.parent; R; ) {
              if (R.playbackRate === 0)
                return !0;
              R = R.parent;
            }
            return !1;
          }
        }]), N;
      }();
      l.default = J;
    },
    /* 76 */
    /***/
    function(n, l, i) {
      l.__esModule = !0;
      var c = i(77), m = u(c), L = i(129), K = u(L);
      function u(a) {
        return a && a.__esModule ? a : { default: a };
      }
      l.default = /* @__PURE__ */ function() {
        function a(e, r) {
          var X = [], W = !0, p = !1, C = void 0;
          try {
            for (var I = (0, K.default)(e), o; !(W = (o = I.next()).done) && (X.push(o.value), !(r && X.length === r)); W = !0)
              ;
          } catch (G) {
            p = !0, C = G;
          } finally {
            try {
              !W && I.return && I.return();
            } finally {
              if (p)
                throw C;
            }
          }
          return X;
        }
        return function(e, r) {
          if (Array.isArray(e))
            return e;
          if ((0, m.default)(Object(e)))
            return a(e, r);
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
      }();
    },
    /* 77 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(78), __esModule: !0 };
    },
    /* 78 */
    /***/
    function(n, l, i) {
      i(79), i(125), n.exports = i(127);
    },
    /* 79 */
    /***/
    function(n, l, i) {
      i(80);
      for (var c = i(91), m = i(95), L = i(83), K = i(122)("toStringTag"), u = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), a = 0; a < u.length; a++) {
        var e = u[a], r = c[e], X = r && r.prototype;
        X && !X[K] && m(X, K, e), L[e] = L.Array;
      }
    },
    /* 80 */
    /***/
    function(n, l, i) {
      var c = i(81), m = i(82), L = i(83), K = i(84);
      n.exports = i(88)(Array, "Array", function(u, a) {
        this._t = K(u), this._i = 0, this._k = a;
      }, function() {
        var u = this._t, a = this._k, e = this._i++;
        return !u || e >= u.length ? (this._t = void 0, m(1)) : a == "keys" ? m(0, e) : a == "values" ? m(0, u[e]) : m(0, [e, u[e]]);
      }, "values"), L.Arguments = L.Array, c("keys"), c("values"), c("entries");
    },
    /* 81 */
    /***/
    function(n, l) {
      n.exports = function() {
      };
    },
    /* 82 */
    /***/
    function(n, l) {
      n.exports = function(i, c) {
        return { value: c, done: !!i };
      };
    },
    /* 83 */
    /***/
    function(n, l) {
      n.exports = {};
    },
    /* 84 */
    /***/
    function(n, l, i) {
      var c = i(85), m = i(87);
      n.exports = function(L) {
        return c(m(L));
      };
    },
    /* 85 */
    /***/
    function(n, l, i) {
      var c = i(86);
      n.exports = Object("z").propertyIsEnumerable(0) ? Object : function(m) {
        return c(m) == "String" ? m.split("") : Object(m);
      };
    },
    /* 86 */
    /***/
    function(n, l) {
      var i = {}.toString;
      n.exports = function(c) {
        return i.call(c).slice(8, -1);
      };
    },
    /* 87 */
    /***/
    function(n, l) {
      n.exports = function(i) {
        if (i == null)
          throw TypeError("Can't call method on  " + i);
        return i;
      };
    },
    /* 88 */
    /***/
    function(n, l, i) {
      var c = i(89), m = i(90), L = i(106), K = i(95), u = i(83), a = i(107), e = i(121), r = i(123), X = i(122)("iterator"), W = !([].keys && "next" in [].keys()), p = "@@iterator", C = "keys", I = "values", o = function() {
        return this;
      };
      n.exports = function(G, d, t, s, b, h, S) {
        a(t, d, s);
        var Y = function(F) {
          if (!W && F in N)
            return N[F];
          switch (F) {
            case C:
              return function() {
                return new t(this, F);
              };
            case I:
              return function() {
                return new t(this, F);
              };
          }
          return function() {
            return new t(this, F);
          };
        }, T = d + " Iterator", y = b == I, J = !1, N = G.prototype, x = N[X] || N[p] || b && N[b], R = x || Y(b), z = b ? y ? Y("entries") : R : void 0, Q = d == "Array" && N.entries || x, P, D, _;
        if (Q && (_ = r(Q.call(new G())), _ !== Object.prototype && _.next && (e(_, T, !0), !c && typeof _[X] != "function" && K(_, X, o))), y && x && x.name !== I && (J = !0, R = function() {
          return x.call(this);
        }), (!c || S) && (W || J || !N[X]) && K(N, X, R), u[d] = R, u[T] = o, b)
          if (P = {
            values: y ? R : Y(I),
            keys: h ? R : Y(C),
            entries: z
          }, S)
            for (D in P)
              D in N || L(N, D, P[D]);
          else
            m(m.P + m.F * (W || J), d, P);
        return P;
      };
    },
    /* 89 */
    /***/
    function(n, l) {
      n.exports = !0;
    },
    /* 90 */
    /***/
    function(n, l, i) {
      var c = i(91), m = i(92), L = i(93), K = i(95), u = i(105), a = "prototype", e = function(r, X, W) {
        var p = r & e.F, C = r & e.G, I = r & e.S, o = r & e.P, G = r & e.B, d = r & e.W, t = C ? m : m[X] || (m[X] = {}), s = t[a], b = C ? c : I ? c[X] : (c[X] || {})[a], h, S, Y;
        C && (W = X);
        for (h in W)
          S = !p && b && b[h] !== void 0, !(S && u(t, h)) && (Y = S ? b[h] : W[h], t[h] = C && typeof b[h] != "function" ? W[h] : G && S ? L(Y, c) : d && b[h] == Y ? function(T) {
            var y = function(J, N, x) {
              if (this instanceof T) {
                switch (arguments.length) {
                  case 0:
                    return new T();
                  case 1:
                    return new T(J);
                  case 2:
                    return new T(J, N);
                }
                return new T(J, N, x);
              }
              return T.apply(this, arguments);
            };
            return y[a] = T[a], y;
          }(Y) : o && typeof Y == "function" ? L(Function.call, Y) : Y, o && ((t.virtual || (t.virtual = {}))[h] = Y, r & e.R && s && !s[h] && K(s, h, Y)));
      };
      e.F = 1, e.G = 2, e.S = 4, e.P = 8, e.B = 16, e.W = 32, e.U = 64, e.R = 128, n.exports = e;
    },
    /* 91 */
    /***/
    function(n, l) {
      var i = n.exports = typeof window < "u" && window.Math == Math ? window : typeof self < "u" && self.Math == Math ? self : Function("return this")();
      typeof __g == "number" && (__g = i);
    },
    /* 92 */
    /***/
    function(n, l) {
      var i = n.exports = { version: "2.6.11" };
      typeof __e == "number" && (__e = i);
    },
    /* 93 */
    /***/
    function(n, l, i) {
      var c = i(94);
      n.exports = function(m, L, K) {
        if (c(m), L === void 0)
          return m;
        switch (K) {
          case 1:
            return function(u) {
              return m.call(L, u);
            };
          case 2:
            return function(u, a) {
              return m.call(L, u, a);
            };
          case 3:
            return function(u, a, e) {
              return m.call(L, u, a, e);
            };
        }
        return function() {
          return m.apply(L, arguments);
        };
      };
    },
    /* 94 */
    /***/
    function(n, l) {
      n.exports = function(i) {
        if (typeof i != "function")
          throw TypeError(i + " is not a function!");
        return i;
      };
    },
    /* 95 */
    /***/
    function(n, l, i) {
      var c = i(96), m = i(104);
      n.exports = i(100) ? function(L, K, u) {
        return c.f(L, K, m(1, u));
      } : function(L, K, u) {
        return L[K] = u, L;
      };
    },
    /* 96 */
    /***/
    function(n, l, i) {
      var c = i(97), m = i(99), L = i(103), K = Object.defineProperty;
      l.f = i(100) ? Object.defineProperty : function(a, e, r) {
        if (c(a), e = L(e, !0), c(r), m)
          try {
            return K(a, e, r);
          } catch {
          }
        if ("get" in r || "set" in r)
          throw TypeError("Accessors not supported!");
        return "value" in r && (a[e] = r.value), a;
      };
    },
    /* 97 */
    /***/
    function(n, l, i) {
      var c = i(98);
      n.exports = function(m) {
        if (!c(m))
          throw TypeError(m + " is not an object!");
        return m;
      };
    },
    /* 98 */
    /***/
    function(n, l) {
      n.exports = function(i) {
        return typeof i == "object" ? i !== null : typeof i == "function";
      };
    },
    /* 99 */
    /***/
    function(n, l, i) {
      n.exports = !i(100) && !i(101)(function() {
        return Object.defineProperty(i(102)("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    },
    /* 100 */
    /***/
    function(n, l, i) {
      n.exports = !i(101)(function() {
        return Object.defineProperty({}, "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    },
    /* 101 */
    /***/
    function(n, l) {
      n.exports = function(i) {
        try {
          return !!i();
        } catch {
          return !0;
        }
      };
    },
    /* 102 */
    /***/
    function(n, l, i) {
      var c = i(98), m = i(91).document, L = c(m) && c(m.createElement);
      n.exports = function(K) {
        return L ? m.createElement(K) : {};
      };
    },
    /* 103 */
    /***/
    function(n, l, i) {
      var c = i(98);
      n.exports = function(m, L) {
        if (!c(m))
          return m;
        var K, u;
        if (L && typeof (K = m.toString) == "function" && !c(u = K.call(m)) || typeof (K = m.valueOf) == "function" && !c(u = K.call(m)) || !L && typeof (K = m.toString) == "function" && !c(u = K.call(m)))
          return u;
        throw TypeError("Can't convert object to primitive value");
      };
    },
    /* 104 */
    /***/
    function(n, l) {
      n.exports = function(i, c) {
        return {
          enumerable: !(i & 1),
          configurable: !(i & 2),
          writable: !(i & 4),
          value: c
        };
      };
    },
    /* 105 */
    /***/
    function(n, l) {
      var i = {}.hasOwnProperty;
      n.exports = function(c, m) {
        return i.call(c, m);
      };
    },
    /* 106 */
    /***/
    function(n, l, i) {
      n.exports = i(95);
    },
    /* 107 */
    /***/
    function(n, l, i) {
      var c = i(108), m = i(104), L = i(121), K = {};
      i(95)(K, i(122)("iterator"), function() {
        return this;
      }), n.exports = function(u, a, e) {
        u.prototype = c(K, { next: m(1, e) }), L(u, a + " Iterator");
      };
    },
    /* 108 */
    /***/
    function(n, l, i) {
      var c = i(97), m = i(109), L = i(119), K = i(116)("IE_PROTO"), u = function() {
      }, a = "prototype", e = function() {
        var r = i(102)("iframe"), X = L.length, W = "<", p = ">", C;
        for (r.style.display = "none", i(120).appendChild(r), r.src = "javascript:", C = r.contentWindow.document, C.open(), C.write(W + "script" + p + "document.F=Object" + W + "/script" + p), C.close(), e = C.F; X--; )
          delete e[a][L[X]];
        return e();
      };
      n.exports = Object.create || function(X, W) {
        var p;
        return X !== null ? (u[a] = c(X), p = new u(), u[a] = null, p[K] = X) : p = e(), W === void 0 ? p : m(p, W);
      };
    },
    /* 109 */
    /***/
    function(n, l, i) {
      var c = i(96), m = i(97), L = i(110);
      n.exports = i(100) ? Object.defineProperties : function(u, a) {
        m(u);
        for (var e = L(a), r = e.length, X = 0, W; r > X; )
          c.f(u, W = e[X++], a[W]);
        return u;
      };
    },
    /* 110 */
    /***/
    function(n, l, i) {
      var c = i(111), m = i(119);
      n.exports = Object.keys || function(K) {
        return c(K, m);
      };
    },
    /* 111 */
    /***/
    function(n, l, i) {
      var c = i(105), m = i(84), L = i(112)(!1), K = i(116)("IE_PROTO");
      n.exports = function(u, a) {
        var e = m(u), r = 0, X = [], W;
        for (W in e)
          W != K && c(e, W) && X.push(W);
        for (; a.length > r; )
          c(e, W = a[r++]) && (~L(X, W) || X.push(W));
        return X;
      };
    },
    /* 112 */
    /***/
    function(n, l, i) {
      var c = i(84), m = i(113), L = i(115);
      n.exports = function(K) {
        return function(u, a, e) {
          var r = c(u), X = m(r.length), W = L(e, X), p;
          if (K && a != a) {
            for (; X > W; )
              if (p = r[W++], p != p)
                return !0;
          } else
            for (; X > W; W++)
              if ((K || W in r) && r[W] === a)
                return K || W || 0;
          return !K && -1;
        };
      };
    },
    /* 113 */
    /***/
    function(n, l, i) {
      var c = i(114), m = Math.min;
      n.exports = function(L) {
        return L > 0 ? m(c(L), 9007199254740991) : 0;
      };
    },
    /* 114 */
    /***/
    function(n, l) {
      var i = Math.ceil, c = Math.floor;
      n.exports = function(m) {
        return isNaN(m = +m) ? 0 : (m > 0 ? c : i)(m);
      };
    },
    /* 115 */
    /***/
    function(n, l, i) {
      var c = i(114), m = Math.max, L = Math.min;
      n.exports = function(K, u) {
        return K = c(K), K < 0 ? m(K + u, 0) : L(K, u);
      };
    },
    /* 116 */
    /***/
    function(n, l, i) {
      var c = i(117)("keys"), m = i(118);
      n.exports = function(L) {
        return c[L] || (c[L] = m(L));
      };
    },
    /* 117 */
    /***/
    function(n, l, i) {
      var c = i(92), m = i(91), L = "__core-js_shared__", K = m[L] || (m[L] = {});
      (n.exports = function(u, a) {
        return K[u] || (K[u] = a !== void 0 ? a : {});
      })("versions", []).push({
        version: c.version,
        mode: i(89) ? "pure" : "global",
        copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
      });
    },
    /* 118 */
    /***/
    function(n, l) {
      var i = 0, c = Math.random();
      n.exports = function(m) {
        return "Symbol(".concat(m === void 0 ? "" : m, ")_", (++i + c).toString(36));
      };
    },
    /* 119 */
    /***/
    function(n, l) {
      n.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    },
    /* 120 */
    /***/
    function(n, l, i) {
      var c = i(91).document;
      n.exports = c && c.documentElement;
    },
    /* 121 */
    /***/
    function(n, l, i) {
      var c = i(96).f, m = i(105), L = i(122)("toStringTag");
      n.exports = function(K, u, a) {
        K && !m(K = a ? K : K.prototype, L) && c(K, L, { configurable: !0, value: u });
      };
    },
    /* 122 */
    /***/
    function(n, l, i) {
      var c = i(117)("wks"), m = i(118), L = i(91).Symbol, K = typeof L == "function", u = n.exports = function(a) {
        return c[a] || (c[a] = K && L[a] || (K ? L : m)("Symbol." + a));
      };
      u.store = c;
    },
    /* 123 */
    /***/
    function(n, l, i) {
      var c = i(105), m = i(124), L = i(116)("IE_PROTO"), K = Object.prototype;
      n.exports = Object.getPrototypeOf || function(u) {
        return u = m(u), c(u, L) ? u[L] : typeof u.constructor == "function" && u instanceof u.constructor ? u.constructor.prototype : u instanceof Object ? K : null;
      };
    },
    /* 124 */
    /***/
    function(n, l, i) {
      var c = i(87);
      n.exports = function(m) {
        return Object(c(m));
      };
    },
    /* 125 */
    /***/
    function(n, l, i) {
      var c = i(126)(!0);
      i(88)(String, "String", function(m) {
        this._t = String(m), this._i = 0;
      }, function() {
        var m = this._t, L = this._i, K;
        return L >= m.length ? { value: void 0, done: !0 } : (K = c(m, L), this._i += K.length, { value: K, done: !1 });
      });
    },
    /* 126 */
    /***/
    function(n, l, i) {
      var c = i(114), m = i(87);
      n.exports = function(L) {
        return function(K, u) {
          var a = String(m(K)), e = c(u), r = a.length, X, W;
          return e < 0 || e >= r ? L ? "" : void 0 : (X = a.charCodeAt(e), X < 55296 || X > 56319 || e + 1 === r || (W = a.charCodeAt(e + 1)) < 56320 || W > 57343 ? L ? a.charAt(e) : X : L ? a.slice(e, e + 2) : (X - 55296 << 10) + (W - 56320) + 65536);
        };
      };
    },
    /* 127 */
    /***/
    function(n, l, i) {
      var c = i(128), m = i(122)("iterator"), L = i(83);
      n.exports = i(92).isIterable = function(K) {
        var u = Object(K);
        return u[m] !== void 0 || "@@iterator" in u || L.hasOwnProperty(c(u));
      };
    },
    /* 128 */
    /***/
    function(n, l, i) {
      var c = i(86), m = i(122)("toStringTag"), L = c(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", K = function(u, a) {
        try {
          return u[a];
        } catch {
        }
      };
      n.exports = function(u) {
        var a, e, r;
        return u === void 0 ? "Undefined" : u === null ? "Null" : typeof (e = K(a = Object(u), m)) == "string" ? e : L ? c(a) : (r = c(a)) == "Object" && typeof a.callee == "function" ? "Arguments" : r;
      };
    },
    /* 129 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(130), __esModule: !0 };
    },
    /* 130 */
    /***/
    function(n, l, i) {
      i(79), i(125), n.exports = i(131);
    },
    /* 131 */
    /***/
    function(n, l, i) {
      var c = i(97), m = i(132);
      n.exports = i(92).getIterator = function(L) {
        var K = m(L);
        if (typeof K != "function")
          throw TypeError(L + " is not iterable!");
        return c(K.call(L));
      };
    },
    /* 132 */
    /***/
    function(n, l, i) {
      var c = i(128), m = i(122)("iterator"), L = i(83);
      n.exports = i(92).getIteratorMethod = function(K) {
        if (K != null)
          return K[m] || K["@@iterator"] || L[c(K)];
      };
    },
    /* 133 */
    /***/
    function(n, l, i) {
      l.__esModule = !0;
      var c = i(134), m = L(c);
      function L(K) {
        return K && K.__esModule ? K : { default: K };
      }
      l.default = function(K) {
        if (Array.isArray(K)) {
          for (var u = 0, a = Array(K.length); u < K.length; u++)
            a[u] = K[u];
          return a;
        } else
          return (0, m.default)(K);
      };
    },
    /* 134 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(135), __esModule: !0 };
    },
    /* 135 */
    /***/
    function(n, l, i) {
      i(125), i(136), n.exports = i(92).Array.from;
    },
    /* 136 */
    /***/
    function(n, l, i) {
      var c = i(93), m = i(90), L = i(124), K = i(137), u = i(138), a = i(113), e = i(139), r = i(132);
      m(m.S + m.F * !i(140)(function(X) {
        Array.from(X);
      }), "Array", {
        // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
        from: function(W) {
          var p = L(W), C = typeof this == "function" ? this : Array, I = arguments.length, o = I > 1 ? arguments[1] : void 0, G = o !== void 0, d = 0, t = r(p), s, b, h, S;
          if (G && (o = c(o, I > 2 ? arguments[2] : void 0, 2)), t != null && !(C == Array && u(t)))
            for (S = t.call(p), b = new C(); !(h = S.next()).done; d++)
              e(b, d, G ? K(S, o, [h.value, d], !0) : h.value);
          else
            for (s = a(p.length), b = new C(s); s > d; d++)
              e(b, d, G ? o(p[d], d) : p[d]);
          return b.length = d, b;
        }
      });
    },
    /* 137 */
    /***/
    function(n, l, i) {
      var c = i(97);
      n.exports = function(m, L, K, u) {
        try {
          return u ? L(c(K)[0], K[1]) : L(K);
        } catch (e) {
          var a = m.return;
          throw a !== void 0 && c(a.call(m)), e;
        }
      };
    },
    /* 138 */
    /***/
    function(n, l, i) {
      var c = i(83), m = i(122)("iterator"), L = Array.prototype;
      n.exports = function(K) {
        return K !== void 0 && (c.Array === K || L[m] === K);
      };
    },
    /* 139 */
    /***/
    function(n, l, i) {
      var c = i(96), m = i(104);
      n.exports = function(L, K, u) {
        K in L ? c.f(L, K, m(0, u)) : L[K] = u;
      };
    },
    /* 140 */
    /***/
    function(n, l, i) {
      var c = i(122)("iterator"), m = !1;
      try {
        var L = [7][c]();
        L.return = function() {
          m = !0;
        }, Array.from(L, function() {
          throw 2;
        });
      } catch {
      }
      n.exports = function(K, u) {
        if (!u && !m)
          return !1;
        var a = !1;
        try {
          var e = [7], r = e[c]();
          r.next = function() {
            return { done: a = !0 };
          }, e[c] = function() {
            return r;
          }, K(e);
        } catch {
        }
        return a;
      };
    },
    /* 141 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(142), __esModule: !0 };
    },
    /* 142 */
    /***/
    function(n, l, i) {
      i(143), i(125), i(79), i(144), i(157), i(160), i(162), n.exports = i(92).Map;
    },
    /* 143 */
    /***/
    function(n, l) {
    },
    /* 144 */
    /***/
    function(n, l, i) {
      var c = i(145), m = i(151), L = "Map";
      n.exports = i(152)(L, function(K) {
        return function() {
          return K(this, arguments.length > 0 ? arguments[0] : void 0);
        };
      }, {
        // 23.1.3.6 Map.prototype.get(key)
        get: function(u) {
          var a = c.getEntry(m(this, L), u);
          return a && a.v;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function(u, a) {
          return c.def(m(this, L), u === 0 ? 0 : u, a);
        }
      }, c, !0);
    },
    /* 145 */
    /***/
    function(n, l, i) {
      var c = i(96).f, m = i(108), L = i(146), K = i(93), u = i(147), a = i(148), e = i(88), r = i(82), X = i(149), W = i(100), p = i(150).fastKey, C = i(151), I = W ? "_s" : "size", o = function(G, d) {
        var t = p(d), s;
        if (t !== "F")
          return G._i[t];
        for (s = G._f; s; s = s.n)
          if (s.k == d)
            return s;
      };
      n.exports = {
        getConstructor: function(G, d, t, s) {
          var b = G(function(h, S) {
            u(h, b, d, "_i"), h._t = d, h._i = m(null), h._f = void 0, h._l = void 0, h[I] = 0, S != null && a(S, t, h[s], h);
          });
          return L(b.prototype, {
            // 23.1.3.1 Map.prototype.clear()
            // 23.2.3.2 Set.prototype.clear()
            clear: function() {
              for (var S = C(this, d), Y = S._i, T = S._f; T; T = T.n)
                T.r = !0, T.p && (T.p = T.p.n = void 0), delete Y[T.i];
              S._f = S._l = void 0, S[I] = 0;
            },
            // 23.1.3.3 Map.prototype.delete(key)
            // 23.2.3.4 Set.prototype.delete(value)
            delete: function(h) {
              var S = C(this, d), Y = o(S, h);
              if (Y) {
                var T = Y.n, y = Y.p;
                delete S._i[Y.i], Y.r = !0, y && (y.n = T), T && (T.p = y), S._f == Y && (S._f = T), S._l == Y && (S._l = y), S[I]--;
              }
              return !!Y;
            },
            // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
            // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
            forEach: function(S) {
              C(this, d);
              for (var Y = K(S, arguments.length > 1 ? arguments[1] : void 0, 3), T; T = T ? T.n : this._f; )
                for (Y(T.v, T.k, this); T && T.r; )
                  T = T.p;
            },
            // 23.1.3.7 Map.prototype.has(key)
            // 23.2.3.7 Set.prototype.has(value)
            has: function(S) {
              return !!o(C(this, d), S);
            }
          }), W && c(b.prototype, "size", {
            get: function() {
              return C(this, d)[I];
            }
          }), b;
        },
        def: function(G, d, t) {
          var s = o(G, d), b, h;
          return s ? s.v = t : (G._l = s = {
            i: h = p(d, !0),
            // <- index
            k: d,
            // <- key
            v: t,
            // <- value
            p: b = G._l,
            // <- previous entry
            n: void 0,
            // <- next entry
            r: !1
            // <- removed
          }, G._f || (G._f = s), b && (b.n = s), G[I]++, h !== "F" && (G._i[h] = s)), G;
        },
        getEntry: o,
        setStrong: function(G, d, t) {
          e(G, d, function(s, b) {
            this._t = C(s, d), this._k = b, this._l = void 0;
          }, function() {
            for (var s = this, b = s._k, h = s._l; h && h.r; )
              h = h.p;
            return !s._t || !(s._l = h = h ? h.n : s._t._f) ? (s._t = void 0, r(1)) : b == "keys" ? r(0, h.k) : b == "values" ? r(0, h.v) : r(0, [h.k, h.v]);
          }, t ? "entries" : "values", !t, !0), X(d);
        }
      };
    },
    /* 146 */
    /***/
    function(n, l, i) {
      var c = i(95);
      n.exports = function(m, L, K) {
        for (var u in L)
          K && m[u] ? m[u] = L[u] : c(m, u, L[u]);
        return m;
      };
    },
    /* 147 */
    /***/
    function(n, l) {
      n.exports = function(i, c, m, L) {
        if (!(i instanceof c) || L !== void 0 && L in i)
          throw TypeError(m + ": incorrect invocation!");
        return i;
      };
    },
    /* 148 */
    /***/
    function(n, X, i) {
      var c = i(93), m = i(137), L = i(138), K = i(97), u = i(113), a = i(132), e = {}, r = {}, X = n.exports = function(W, p, C, I, o) {
        var G = o ? function() {
          return W;
        } : a(W), d = c(C, I, p ? 2 : 1), t = 0, s, b, h, S;
        if (typeof G != "function")
          throw TypeError(W + " is not iterable!");
        if (L(G)) {
          for (s = u(W.length); s > t; t++)
            if (S = p ? d(K(b = W[t])[0], b[1]) : d(W[t]), S === e || S === r)
              return S;
        } else
          for (h = G.call(W); !(b = h.next()).done; )
            if (S = m(h, d, b.value, p), S === e || S === r)
              return S;
      };
      X.BREAK = e, X.RETURN = r;
    },
    /* 149 */
    /***/
    function(n, l, i) {
      var c = i(91), m = i(92), L = i(96), K = i(100), u = i(122)("species");
      n.exports = function(a) {
        var e = typeof m[a] == "function" ? m[a] : c[a];
        K && e && !e[u] && L.f(e, u, {
          configurable: !0,
          get: function() {
            return this;
          }
        });
      };
    },
    /* 150 */
    /***/
    function(n, l, i) {
      var c = i(118)("meta"), m = i(98), L = i(105), K = i(96).f, u = 0, a = Object.isExtensible || function() {
        return !0;
      }, e = !i(101)(function() {
        return a(Object.preventExtensions({}));
      }), r = function(I) {
        K(I, c, { value: {
          i: "O" + ++u,
          // object ID
          w: {}
          // weak collections IDs
        } });
      }, X = function(I, o) {
        if (!m(I))
          return typeof I == "symbol" ? I : (typeof I == "string" ? "S" : "P") + I;
        if (!L(I, c)) {
          if (!a(I))
            return "F";
          if (!o)
            return "E";
          r(I);
        }
        return I[c].i;
      }, W = function(I, o) {
        if (!L(I, c)) {
          if (!a(I))
            return !0;
          if (!o)
            return !1;
          r(I);
        }
        return I[c].w;
      }, p = function(I) {
        return e && C.NEED && a(I) && !L(I, c) && r(I), I;
      }, C = n.exports = {
        KEY: c,
        NEED: !1,
        fastKey: X,
        getWeak: W,
        onFreeze: p
      };
    },
    /* 151 */
    /***/
    function(n, l, i) {
      var c = i(98);
      n.exports = function(m, L) {
        if (!c(m) || m._t !== L)
          throw TypeError("Incompatible receiver, " + L + " required!");
        return m;
      };
    },
    /* 152 */
    /***/
    function(n, l, i) {
      var c = i(91), m = i(90), L = i(150), K = i(101), u = i(95), a = i(146), e = i(148), r = i(147), X = i(98), W = i(121), p = i(96).f, C = i(153)(0), I = i(100);
      n.exports = function(o, G, d, t, s, b) {
        var h = c[o], S = h, Y = s ? "set" : "add", T = S && S.prototype, y = {};
        return !I || typeof S != "function" || !(b || T.forEach && !K(function() {
          new S().entries().next();
        })) ? (S = t.getConstructor(G, o, s, Y), a(S.prototype, d), L.NEED = !0) : (S = G(function(J, N) {
          r(J, S, o, "_c"), J._c = new h(), N != null && e(N, s, J[Y], J);
        }), C("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","), function(J) {
          var N = J == "add" || J == "set";
          J in T && !(b && J == "clear") && u(S.prototype, J, function(x, R) {
            if (r(this, S, J), !N && b && !X(x))
              return J == "get" ? void 0 : !1;
            var z = this._c[J](x === 0 ? 0 : x, R);
            return N ? this : z;
          });
        }), b || p(S.prototype, "size", {
          get: function() {
            return this._c.size;
          }
        })), W(S, o), y[o] = S, m(m.G + m.W + m.F, y), b || t.setStrong(S, o, s), S;
      };
    },
    /* 153 */
    /***/
    function(n, l, i) {
      var c = i(93), m = i(85), L = i(124), K = i(113), u = i(154);
      n.exports = function(a, e) {
        var r = a == 1, X = a == 2, W = a == 3, p = a == 4, C = a == 6, I = a == 5 || C, o = e || u;
        return function(G, d, t) {
          for (var s = L(G), b = m(s), h = c(d, t, 3), S = K(b.length), Y = 0, T = r ? o(G, S) : X ? o(G, 0) : void 0, y, J; S > Y; Y++)
            if ((I || Y in b) && (y = b[Y], J = h(y, Y, s), a)) {
              if (r)
                T[Y] = J;
              else if (J)
                switch (a) {
                  case 3:
                    return !0;
                  case 5:
                    return y;
                  case 6:
                    return Y;
                  case 2:
                    T.push(y);
                }
              else if (p)
                return !1;
            }
          return C ? -1 : W || p ? p : T;
        };
      };
    },
    /* 154 */
    /***/
    function(n, l, i) {
      var c = i(155);
      n.exports = function(m, L) {
        return new (c(m))(L);
      };
    },
    /* 155 */
    /***/
    function(n, l, i) {
      var c = i(98), m = i(156), L = i(122)("species");
      n.exports = function(K) {
        var u;
        return m(K) && (u = K.constructor, typeof u == "function" && (u === Array || m(u.prototype)) && (u = void 0), c(u) && (u = u[L], u === null && (u = void 0))), u === void 0 ? Array : u;
      };
    },
    /* 156 */
    /***/
    function(n, l, i) {
      var c = i(86);
      n.exports = Array.isArray || function(L) {
        return c(L) == "Array";
      };
    },
    /* 157 */
    /***/
    function(n, l, i) {
      var c = i(90);
      c(c.P + c.R, "Map", { toJSON: i(158)("Map") });
    },
    /* 158 */
    /***/
    function(n, l, i) {
      var c = i(128), m = i(159);
      n.exports = function(L) {
        return function() {
          if (c(this) != L)
            throw TypeError(L + "#toJSON isn't generic");
          return m(this);
        };
      };
    },
    /* 159 */
    /***/
    function(n, l, i) {
      var c = i(148);
      n.exports = function(m, L) {
        var K = [];
        return c(m, !1, K.push, K, L), K;
      };
    },
    /* 160 */
    /***/
    function(n, l, i) {
      i(161)("Map");
    },
    /* 161 */
    /***/
    function(n, l, i) {
      var c = i(90);
      n.exports = function(m) {
        c(c.S, m, { of: function() {
          for (var K = arguments.length, u = new Array(K); K--; )
            u[K] = arguments[K];
          return new this(u);
        } });
      };
    },
    /* 162 */
    /***/
    function(n, l, i) {
      i(163)("Map");
    },
    /* 163 */
    /***/
    function(n, l, i) {
      var c = i(90), m = i(94), L = i(93), K = i(148);
      n.exports = function(u) {
        c(c.S, u, { from: function(e) {
          var r = arguments[1], X, W, p, C;
          return m(this), X = r !== void 0, X && m(r), e == null ? new this() : (W = [], X ? (p = 0, C = L(r, arguments[2], 2), K(e, !1, function(I) {
            W.push(C(I, p++));
          })) : K(e, !1, W.push, W), new this(W));
        } });
      };
    },
    /* 164 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(165), __esModule: !0 };
    },
    /* 165 */
    /***/
    function(n, l, i) {
      i(166), n.exports = i(92).Object.assign;
    },
    /* 166 */
    /***/
    function(n, l, i) {
      var c = i(90);
      c(c.S + c.F, "Object", { assign: i(167) });
    },
    /* 167 */
    /***/
    function(n, l, i) {
      var c = i(100), m = i(110), L = i(168), K = i(169), u = i(124), a = i(85), e = Object.assign;
      n.exports = !e || i(101)(function() {
        var r = {}, X = {}, W = Symbol(), p = "abcdefghijklmnopqrst";
        return r[W] = 7, p.split("").forEach(function(C) {
          X[C] = C;
        }), e({}, r)[W] != 7 || Object.keys(e({}, X)).join("") != p;
      }) ? function(X, W) {
        for (var p = u(X), C = arguments.length, I = 1, o = L.f, G = K.f; C > I; )
          for (var d = a(arguments[I++]), t = o ? m(d).concat(o(d)) : m(d), s = t.length, b = 0, h; s > b; )
            h = t[b++], (!c || G.call(d, h)) && (p[h] = d[h]);
        return p;
      } : e;
    },
    /* 168 */
    /***/
    function(n, l) {
      l.f = Object.getOwnPropertySymbols;
    },
    /* 169 */
    /***/
    function(n, l) {
      l.f = {}.propertyIsEnumerable;
    },
    /* 170 */
    /***/
    function(n, l, i) {
      l.__esModule = !0, l.default = function(c, m) {
        if (!(c instanceof m))
          throw new TypeError("Cannot call a class as a function");
      };
    },
    /* 171 */
    /***/
    function(n, l, i) {
      l.__esModule = !0;
      var c = i(172), m = L(c);
      function L(K) {
        return K && K.__esModule ? K : { default: K };
      }
      l.default = /* @__PURE__ */ function() {
        function K(u, a) {
          for (var e = 0; e < a.length; e++) {
            var r = a[e];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), (0, m.default)(u, r.key, r);
          }
        }
        return function(u, a, e) {
          return a && K(u.prototype, a), e && K(u, e), u;
        };
      }();
    },
    /* 172 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(173), __esModule: !0 };
    },
    /* 173 */
    /***/
    function(n, l, i) {
      i(174);
      var c = i(92).Object;
      n.exports = function(L, K, u) {
        return c.defineProperty(L, K, u);
      };
    },
    /* 174 */
    /***/
    function(n, l, i) {
      var c = i(90);
      c(c.S + c.F * !i(100), "Object", { defineProperty: i(96).f });
    },
    /* 175 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(176), __esModule: !0 };
    },
    /* 176 */
    /***/
    function(n, l, i) {
      i(177), i(143), i(184), i(185), n.exports = i(92).Symbol;
    },
    /* 177 */
    /***/
    function(n, l, i) {
      var c = i(91), m = i(105), L = i(100), K = i(90), u = i(106), a = i(150).KEY, e = i(101), r = i(117), X = i(121), W = i(118), p = i(122), C = i(178), I = i(179), o = i(180), G = i(156), d = i(97), t = i(98), s = i(124), b = i(84), h = i(103), S = i(104), Y = i(108), T = i(181), y = i(183), J = i(168), N = i(96), x = i(110), R = y.f, z = N.f, Q = T.f, P = c.Symbol, D = c.JSON, _ = D && D.stringify, F = "prototype", v = p("_hidden"), O = p("toPrimitive"), li = {}.propertyIsEnumerable, ii = r("symbol-registry"), ti = r("symbols"), $ = r("op-symbols"), ai = Object[F], Xi = typeof P == "function" && !!J.f, M = c.QObject, k = !M || !M[F] || !M[F].findChild, j = L && e(function() {
        return Y(z({}, "a", {
          get: function() {
            return z(this, "a", { value: 7 }).a;
          }
        })).a != 7;
      }) ? function(Zi, ci, ni) {
        var Gi = R(ai, ci);
        Gi && delete ai[ci], z(Zi, ci, ni), Gi && Zi !== ai && z(ai, ci, Gi);
      } : z, A = function(Zi) {
        var ci = ti[Zi] = Y(P[F]);
        return ci._k = Zi, ci;
      }, H = Xi && typeof P.iterator == "symbol" ? function(Zi) {
        return typeof Zi == "symbol";
      } : function(Zi) {
        return Zi instanceof P;
      }, U = function(ci, ni, Gi) {
        return ci === ai && U($, ni, Gi), d(ci), ni = h(ni, !0), d(Gi), m(ti, ni) ? (Gi.enumerable ? (m(ci, v) && ci[v][ni] && (ci[v][ni] = !1), Gi = Y(Gi, { enumerable: S(0, !1) })) : (m(ci, v) || z(ci, v, S(1, {})), ci[v][ni] = !0), j(ci, ni, Gi)) : z(ci, ni, Gi);
      }, Z = function(ci, ni) {
        d(ci);
        for (var Gi = o(ni = b(ni)), hi = 0, Wi = Gi.length, Ii; Wi > hi; )
          U(ci, Ii = Gi[hi++], ni[Ii]);
        return ci;
      }, V = function(ci, ni) {
        return ni === void 0 ? Y(ci) : Z(Y(ci), ni);
      }, g = function(ci) {
        var ni = li.call(this, ci = h(ci, !0));
        return this === ai && m(ti, ci) && !m($, ci) ? !1 : ni || !m(this, ci) || !m(ti, ci) || m(this, v) && this[v][ci] ? ni : !0;
      }, f = function(ci, ni) {
        if (ci = b(ci), ni = h(ni, !0), !(ci === ai && m(ti, ni) && !m($, ni))) {
          var Gi = R(ci, ni);
          return Gi && m(ti, ni) && !(m(ci, v) && ci[v][ni]) && (Gi.enumerable = !0), Gi;
        }
      }, w = function(ci) {
        for (var ni = Q(b(ci)), Gi = [], hi = 0, Wi; ni.length > hi; )
          !m(ti, Wi = ni[hi++]) && Wi != v && Wi != a && Gi.push(Wi);
        return Gi;
      }, B = function(ci) {
        for (var ni = ci === ai, Gi = Q(ni ? $ : b(ci)), hi = [], Wi = 0, Ii; Gi.length > Wi; )
          m(ti, Ii = Gi[Wi++]) && (!ni || m(ai, Ii)) && hi.push(ti[Ii]);
        return hi;
      };
      Xi || (P = function() {
        if (this instanceof P)
          throw TypeError("Symbol is not a constructor!");
        var ci = W(arguments.length > 0 ? arguments[0] : void 0), ni = function(Gi) {
          this === ai && ni.call($, Gi), m(this, v) && m(this[v], ci) && (this[v][ci] = !1), j(this, ci, S(1, Gi));
        };
        return L && k && j(ai, ci, { configurable: !0, set: ni }), A(ci);
      }, u(P[F], "toString", function() {
        return this._k;
      }), y.f = f, N.f = U, i(182).f = T.f = w, i(169).f = g, J.f = B, L && !i(89) && u(ai, "propertyIsEnumerable", g, !0), C.f = function(Zi) {
        return A(p(Zi));
      }), K(K.G + K.W + K.F * !Xi, { Symbol: P });
      for (var q = (
        // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
        "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(",")
      ), si = 0; q.length > si; )
        p(q[si++]);
      for (var bi = x(p.store), mi = 0; bi.length > mi; )
        I(bi[mi++]);
      K(K.S + K.F * !Xi, "Symbol", {
        // 19.4.2.1 Symbol.for(key)
        for: function(Zi) {
          return m(ii, Zi += "") ? ii[Zi] : ii[Zi] = P(Zi);
        },
        // 19.4.2.5 Symbol.keyFor(sym)
        keyFor: function(ci) {
          if (!H(ci))
            throw TypeError(ci + " is not a symbol!");
          for (var ni in ii)
            if (ii[ni] === ci)
              return ni;
        },
        useSetter: function() {
          k = !0;
        },
        useSimple: function() {
          k = !1;
        }
      }), K(K.S + K.F * !Xi, "Object", {
        // 19.1.2.2 Object.create(O [, Properties])
        create: V,
        // 19.1.2.4 Object.defineProperty(O, P, Attributes)
        defineProperty: U,
        // 19.1.2.3 Object.defineProperties(O, Properties)
        defineProperties: Z,
        // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
        getOwnPropertyDescriptor: f,
        // 19.1.2.7 Object.getOwnPropertyNames(O)
        getOwnPropertyNames: w,
        // 19.1.2.8 Object.getOwnPropertySymbols(O)
        getOwnPropertySymbols: B
      });
      var oi = e(function() {
        J.f(1);
      });
      K(K.S + K.F * oi, "Object", {
        getOwnPropertySymbols: function(ci) {
          return J.f(s(ci));
        }
      }), D && K(K.S + K.F * (!Xi || e(function() {
        var Zi = P();
        return _([Zi]) != "[null]" || _({ a: Zi }) != "{}" || _(Object(Zi)) != "{}";
      })), "JSON", {
        stringify: function(ci) {
          for (var ni = [ci], Gi = 1, hi, Wi; arguments.length > Gi; )
            ni.push(arguments[Gi++]);
          if (Wi = hi = ni[1], !(!t(hi) && ci === void 0 || H(ci)))
            return G(hi) || (hi = function(Ii, xi) {
              if (typeof Wi == "function" && (xi = Wi.call(this, Ii, xi)), !H(xi))
                return xi;
            }), ni[1] = hi, _.apply(D, ni);
        }
      }), P[F][O] || i(95)(P[F], O, P[F].valueOf), X(P, "Symbol"), X(Math, "Math", !0), X(c.JSON, "JSON", !0);
    },
    /* 178 */
    /***/
    function(n, l, i) {
      l.f = i(122);
    },
    /* 179 */
    /***/
    function(n, l, i) {
      var c = i(91), m = i(92), L = i(89), K = i(178), u = i(96).f;
      n.exports = function(a) {
        var e = m.Symbol || (m.Symbol = L ? {} : c.Symbol || {});
        a.charAt(0) != "_" && !(a in e) && u(e, a, { value: K.f(a) });
      };
    },
    /* 180 */
    /***/
    function(n, l, i) {
      var c = i(110), m = i(168), L = i(169);
      n.exports = function(K) {
        var u = c(K), a = m.f;
        if (a)
          for (var e = a(K), r = L.f, X = 0, W; e.length > X; )
            r.call(K, W = e[X++]) && u.push(W);
        return u;
      };
    },
    /* 181 */
    /***/
    function(n, l, i) {
      var c = i(84), m = i(182).f, L = {}.toString, K = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], u = function(a) {
        try {
          return m(a);
        } catch {
          return K.slice();
        }
      };
      n.exports.f = function(e) {
        return K && L.call(e) == "[object Window]" ? u(e) : m(c(e));
      };
    },
    /* 182 */
    /***/
    function(n, l, i) {
      var c = i(111), m = i(119).concat("length", "prototype");
      l.f = Object.getOwnPropertyNames || function(K) {
        return c(K, m);
      };
    },
    /* 183 */
    /***/
    function(n, l, i) {
      var c = i(169), m = i(104), L = i(84), K = i(103), u = i(105), a = i(99), e = Object.getOwnPropertyDescriptor;
      l.f = i(100) ? e : function(X, W) {
        if (X = L(X), W = K(W, !0), a)
          try {
            return e(X, W);
          } catch {
          }
        if (u(X, W))
          return m(!c.f.call(X, W), X[W]);
      };
    },
    /* 184 */
    /***/
    function(n, l, i) {
      i(179)("asyncIterator");
    },
    /* 185 */
    /***/
    function(n, l, i) {
      i(179)("observable");
    },
    /* 186 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      }), l.createNowTime = c, l.formatDelay = m;
      function c() {
        var L = null;
        return Date.now ? L = Date.now : L = function() {
          return (/* @__PURE__ */ new Date()).getTime();
        }, L;
      }
      function m(L) {
        return typeof L == "number" ? L = { delay: L } : "entropy" in L && (L = { delay: L.entropy, isEntropy: !0 }), L;
      }
    },
    /* 187 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      }), l.default = {
        // s - startFrame, e - endFrame
        default: function(m, L, K, u, a) {
          return typeof m == "number" && typeof L == "number" ? m + (K - u) / (a - u) * (L - m) : K - u > a - K ? L : m;
        }
      };
    },
    /* 188 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      }), l.parseEasing = l.Easings = void 0;
      var c = i(76), m = e(c), L = i(133), K = e(L), u = i(141), a = e(u);
      function e(G) {
        return G && G.__esModule ? G : { default: G };
      }
      var r = i(189), X = new a.default();
      function W() {
        for (var G = arguments.length, d = Array(G), t = 0; t < G; t++)
          d[t] = arguments[t];
        var s = X.get(d);
        return s || (s = r.apply(void 0, d), X.set(d, s), s);
      }
      function p(G) {
        var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "end";
        return function(t, s) {
          for (var b = 1; b < s.length; b++) {
            var h = s[b].offset;
            if (t <= h) {
              var S = s[b - 1].offset, Y = h, T = (t - S) / (Y - S), y = 1 / G, J = T / y;
              return d === "end" ? J = Math.floor(J) : J = Math.ceil(J), y * J * (Y - S) + S;
            }
          }
          return 0;
        };
      }
      function C(G) {
        var d = /^cubic-bezier\((.*)\)/, t = G.match(d);
        if (t) {
          var s = t[1].trim();
          return s = s.split(",").map(function(y) {
            return parseFloat(y.trim());
          }), W.apply(void 0, (0, K.default)(s));
        }
        if (d = /^steps\((.*)\)/, t = G.match(d), t) {
          var b = t[1].trim();
          b = b.split(",").map(function(y) {
            return y.trim();
          });
          var h = b, S = (0, m.default)(h, 2), Y = S[0], T = S[1];
          return p(parseInt(Y, 10), T);
        }
        return G;
      }
      var I = {
        linear: function(d) {
          return d;
        },
        ease: W(0.25, 0.1, 0.25, 1),
        "ease-in": W(0.42, 0, 1, 1),
        "ease-out": W(0, 0, 0.58, 1),
        "ease-in-out": W(0.42, 0, 0.58, 1),
        // 'step-start': function(p, frames){
        //   let ret = 0
        //   for(let i = 0; i < frames.length; i++){
        //     const {offset} = frames[i]
        //     ret = offset
        //     if(p < offset){
        //       break
        //     }
        //   }
        //   return ret
        // },
        // 'step-end': function(p, frames){
        //   let ret = 0
        //   for(let i = 0; i < frames.length; i++){
        //     const {offset} = frames[i]
        //     if(p < offset){
        //       break
        //     }
        //     ret = offset
        //   }
        //   return ret
        // }
        "step-start": p(1, "start"),
        "step-end": p(1, "end")
      };
      function o(G) {
        return typeof G == "string" ? I[G] ? G = I[G] : G = C(G) : G.type === "cubic-bezier" ? G = W.apply(void 0, (0, K.default)(G.value)) : G.type === "steps" && (G = p(G.step, G.pos)), G;
      }
      l.Easings = I, l.parseEasing = o;
    },
    /* 189 */
    /***/
    function(n, l) {
      var i = 4, c = 1e-3, m = 1e-7, L = 10, K = 11, u = 1 / (K - 1), a = typeof Float32Array == "function";
      function e(G, d) {
        return 1 - 3 * d + 3 * G;
      }
      function r(G, d) {
        return 3 * d - 6 * G;
      }
      function X(G) {
        return 3 * G;
      }
      function W(G, d, t) {
        return ((e(d, t) * G + r(d, t)) * G + X(d)) * G;
      }
      function p(G, d, t) {
        return 3 * e(d, t) * G * G + 2 * r(d, t) * G + X(d);
      }
      function C(G, d, t, s, b) {
        var h, S, Y = 0;
        do
          S = d + (t - d) / 2, h = W(S, s, b) - G, h > 0 ? t = S : d = S;
        while (Math.abs(h) > m && ++Y < L);
        return S;
      }
      function I(G, d, t, s) {
        for (var b = 0; b < i; ++b) {
          var h = p(d, t, s);
          if (h === 0)
            return d;
          var S = W(d, t, s) - G;
          d -= S / h;
        }
        return d;
      }
      function o(G) {
        return G;
      }
      n.exports = function(d, t, s, b) {
        if (!(0 <= d && d <= 1 && 0 <= s && s <= 1))
          throw new Error("bezier x values must be in [0, 1] range");
        if (d === t && s === b)
          return o;
        for (var h = a ? new Float32Array(K) : new Array(K), S = 0; S < K; ++S)
          h[S] = W(S * u, d, s);
        function Y(T) {
          for (var y = 0, J = 1, N = K - 1; J !== N && h[J] <= T; ++J)
            y += u;
          --J;
          var x = (T - h[J]) / (h[J + 1] - h[J]), R = y + x * u, z = p(R, d, s);
          return z >= c ? I(T, R, d, s) : z === 0 ? R : C(T, y, y + u, d, s);
        }
        return function(y) {
          return y === 0 ? 0 : y === 1 ? 1 : W(Y(y), t, b);
        };
      };
    },
    /* 190 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      });
      var c = i(191), m = t(c), L = i(204), K = t(L), u = i(164), a = t(u), e = i(170), r = t(e), X = i(171), W = t(X), p = i(175), C = t(p), I = i(75), o = t(I), G = i(208), d = i(188);
      function t(z) {
        return z && z.__esModule ? z : { default: z };
      }
      var s = (0, C.default)("timing"), b = (0, C.default)("keyframes"), h = (0, C.default)("initState"), S = (0, C.default)("readyDefer"), Y = (0, C.default)("finishedDefer"), T = (0, C.default)("effects"), y = (0, C.default)("activeReadyTimer"), J = (0, C.default)("activeFinishTimer"), N = (0, C.default)("removeDefer"), x = {
        delay: 0,
        endDelay: 0,
        fill: "auto",
        iterations: 1,
        playbackRate: 1,
        direction: "normal",
        easing: "linear",
        effect: null
      }, R = function() {
        function z(Q, P, D) {
          var _ = this;
          if ((0, r.default)(this, z), Array.isArray(Q)) {
            var F = [Q[0], Q, P];
            Q = F[0], P = F[1], D = F[2];
          }
          typeof D == "number" && (D = { duration: D }), this[s] = (0, a.default)({}, x, D), this[s].easing = (0, d.parseEasing)(this[s].easing), this[b] = (0, G.calculateFramesOffset)(P);
          var v = this[b][this[b].length - 1];
          this[h] = {}, (0, K.default)(v).forEach(function(O) {
            Object.prototype.hasOwnProperty.call(Q, O) && O !== "easing" && O !== "offset" && (_[h][O] = Q[O]);
          }), this[b] = this[b].map(function(O) {
            return (0, a.default)({}, _[h], O);
          }), this[b][0].offset !== 0 && this[b].unshift((0, a.default)({}, this[h], { offset: 0 })), v.offset < 1 && this[b].push((0, a.default)({}, v, { offset: 1 })), this[T] = {}, this.timeline = null;
        }
        return (0, W.default)(z, [{
          key: "pause",
          value: function() {
            this.timeline.playbackRate = 0;
          }
        }, {
          key: y,
          value: function() {
            var P = this;
            this[S] && !this[S].timerID && (this.timeline.currentTime < 0 ? this[S].timerID = this.timeline.setTimeout(function() {
              P[S].resolve(), delete P[S];
            }, { delay: -this.timeline.currentTime, heading: !1 }) : this[S].timerID = this.timeline.setTimeout(function() {
              P[S].resolve(), delete P[S];
            }, { delay: 0, isEntropy: !0 }));
          }
        }, {
          key: J,
          value: function() {
            var P = this, D = this[s], _ = D.duration, F = D.iterations, v = D.endDelay, O = Math.ceil(_ * F + v - this.timeline.currentTime) + 1;
            this[Y] && !this[Y].timerID && (this[Y].timerID = this.timeline.setTimeout(function() {
              P[Y].resolve(), P[N](S), P[N](Y);
            }, { delay: O, heading: !1 }), this[Y].reverseTimerID = this.timeline.setTimeout(function() {
              P[Y].resolve(), P[N](S), P[N](Y), P.timeline = null;
            }, { delay: -this[s].delay - 1, heading: !1 }));
          }
        }, {
          key: "play",
          value: function() {
            if (this.playState === "finished" && this.cancel(), this.playState === "idle") {
              if (this.playbackRate <= 0)
                return;
              var P = this[s], D = P.delay, _ = P.playbackRate, F = P.timeline;
              this.timeline = new o.default({
                originTime: D,
                playbackRate: _
              }, F), this[y](), this[J]();
            } else
              this.playState === "paused" && (this.timeline.playbackRate = this.playbackRate, this[y]());
          }
        }, {
          key: N,
          value: function(P) {
            var D = this[P], _ = this.timeline;
            D && _ && (_.clearTimeout(D.timerID), D.reverseTimerID && _.clearTimeout(D.reverseTimerID)), delete this[P];
          }
        }, {
          key: "cancel",
          value: function() {
            this[N](S), this[N](Y), this.timeline = null;
          }
        }, {
          key: "finish",
          value: function() {
            this.timeline && (this.timeline.currentTime = 1 / 0 / this.playbackRate), this[N](S), this[N](Y);
          }
        }, {
          key: "applyEffects",
          value: function(P) {
            return (0, a.default)(this[T], P);
          }
        }, {
          key: "playbackRate",
          get: function() {
            return this[s].playbackRate;
          },
          set: function(P) {
            this.timeline && (this.timeline.playbackRate = P), this[s].playbackRate = P;
          }
        }, {
          key: "playState",
          get: function() {
            var P = this.timeline, D = this[s], _ = D.iterations, F = D.duration, v = D.endDelay, O = "running";
            if (P == null)
              O = "idle";
            else if (P.paused)
              O = "paused";
            else if (P.currentTime < 0)
              O = "pending";
            else {
              var li = P.currentTime - _ * F;
              li > 0 && li < v ? O = "pending" : li >= v && (O = "finished");
            }
            return O;
          }
        }, {
          key: "progress",
          get: function() {
            if (!this.timeline)
              return 0;
            var P = this[s], D = P.duration, _ = P.iterations, F = this.timeline, v = this.playState, O = void 0;
            if (v === "idle")
              O = 0;
            else if (v === "paused" && F.currentTime < 0)
              O = 0;
            else if (v === "pending")
              if (F.currentTime < 0)
                O = 0;
              else {
                var li = F.seekLocalTime(_ * D);
                O = (0, G.periodicity)(li, D)[1] / D;
              }
            else
              (v === "running" || v === "paused") && (O = (0, G.periodicity)(F.currentTime, D)[1] / D);
            return v === "finished" && (O = (0, G.periodicity)(_, 1)[1]), O;
          }
        }, {
          key: "frame",
          get: function() {
            var P = this.playState, D = this[h], _ = this[s].fill;
            if (P === "idle")
              return D;
            var F = this.timeline.currentTime, v = this[b].slice(0), O = (0, G.getProgress)(this.timeline, this[s], this.progress), li = O.p, ii = O.inverted, ti = D;
            return F < 0 && P === "pending" ? (_ === "backwards" || _ === "both") && (ti = ii ? v[v.length - 1] : v[0]) : (P !== "pending" && P !== "finished" || _ === "forwards" || _ === "both") && (ti = (0, G.getCurrentFrame)(this[s], v, this[T], li)), ti;
          }
        }, {
          key: "timing",
          get: function() {
            return this[s];
          }
        }, {
          key: "effects",
          get: function() {
            return this[T];
          }
        }, {
          key: "baseTimeline",
          set: function(P) {
            this[s].timeline = P;
          },
          get: function() {
            return this[s].timeline;
          }
        }, {
          key: "ready",
          get: function() {
            return this[S] ? this[S].promise : this.timeline && this.timeline.currentTime >= 0 && this.playState !== "paused" ? m.default.resolve() : (this[S] = (0, G.defer)(), this.timeline && this[y](), this[S] ? this[S].promise : m.default.resolve());
          }
        }, {
          key: "finished",
          get: function() {
            return this.playState === "finished" ? m.default.resolve() : (this[Y] || (this[Y] = (0, G.defer)(), this.timeline && this[J]()), this[Y].promise);
          }
        }]), z;
      }();
      l.default = R;
    },
    /* 191 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(192), __esModule: !0 };
    },
    /* 192 */
    /***/
    function(n, l, i) {
      i(143), i(125), i(79), i(193), i(202), i(203), n.exports = i(92).Promise;
    },
    /* 193 */
    /***/
    function(n, l, i) {
      var c = i(89), m = i(91), L = i(93), K = i(128), u = i(90), a = i(98), e = i(94), r = i(147), X = i(148), W = i(194), p = i(195).set, C = i(197)(), I = i(198), o = i(199), G = i(200), d = i(201), t = "Promise", s = m.TypeError, b = m.process, h = b && b.versions, S = h && h.v8 || "", Y = m[t], T = K(b) == "process", y = function() {
      }, J, N, x, R, z = N = I.f, Q = !!function() {
        try {
          var ii = Y.resolve(1), ti = (ii.constructor = {})[i(122)("species")] = function($) {
            $(y, y);
          };
          return (T || typeof PromiseRejectionEvent == "function") && ii.then(y) instanceof ti && S.indexOf("6.6") !== 0 && G.indexOf("Chrome/66") === -1;
        } catch {
        }
      }(), P = function(ii) {
        var ti;
        return a(ii) && typeof (ti = ii.then) == "function" ? ti : !1;
      }, D = function(ii, ti) {
        if (!ii._n) {
          ii._n = !0;
          var $ = ii._c;
          C(function() {
            for (var ai = ii._v, Xi = ii._s == 1, M = 0, k = function(j) {
              var A = Xi ? j.ok : j.fail, H = j.resolve, U = j.reject, Z = j.domain, V, g, f;
              try {
                A ? (Xi || (ii._h == 2 && v(ii), ii._h = 1), A === !0 ? V = ai : (Z && Z.enter(), V = A(ai), Z && (Z.exit(), f = !0)), V === j.promise ? U(s("Promise-chain cycle")) : (g = P(V)) ? g.call(V, H, U) : H(V)) : U(ai);
              } catch (w) {
                Z && !f && Z.exit(), U(w);
              }
            }; $.length > M; )
              k($[M++]);
            ii._c = [], ii._n = !1, ti && !ii._h && _(ii);
          });
        }
      }, _ = function(ii) {
        p.call(m, function() {
          var ti = ii._v, $ = F(ii), ai, Xi, M;
          if ($ && (ai = o(function() {
            T ? b.emit("unhandledRejection", ti, ii) : (Xi = m.onunhandledrejection) ? Xi({ promise: ii, reason: ti }) : (M = m.console) && M.error && M.error("Unhandled promise rejection", ti);
          }), ii._h = T || F(ii) ? 2 : 1), ii._a = void 0, $ && ai.e)
            throw ai.v;
        });
      }, F = function(ii) {
        return ii._h !== 1 && (ii._a || ii._c).length === 0;
      }, v = function(ii) {
        p.call(m, function() {
          var ti;
          T ? b.emit("rejectionHandled", ii) : (ti = m.onrejectionhandled) && ti({ promise: ii, reason: ii._v });
        });
      }, O = function(ii) {
        var ti = this;
        ti._d || (ti._d = !0, ti = ti._w || ti, ti._v = ii, ti._s = 2, ti._a || (ti._a = ti._c.slice()), D(ti, !0));
      }, li = function(ii) {
        var ti = this, $;
        if (!ti._d) {
          ti._d = !0, ti = ti._w || ti;
          try {
            if (ti === ii)
              throw s("Promise can't be resolved itself");
            ($ = P(ii)) ? C(function() {
              var ai = { _w: ti, _d: !1 };
              try {
                $.call(ii, L(li, ai, 1), L(O, ai, 1));
              } catch (Xi) {
                O.call(ai, Xi);
              }
            }) : (ti._v = ii, ti._s = 1, D(ti, !1));
          } catch (ai) {
            O.call({ _w: ti, _d: !1 }, ai);
          }
        }
      };
      Q || (Y = function(ti) {
        r(this, Y, t, "_h"), e(ti), J.call(this);
        try {
          ti(L(li, this, 1), L(O, this, 1));
        } catch ($) {
          O.call(this, $);
        }
      }, J = function(ti) {
        this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, this._n = !1;
      }, J.prototype = i(146)(Y.prototype, {
        // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
        then: function(ti, $) {
          var ai = z(W(this, Y));
          return ai.ok = typeof ti == "function" ? ti : !0, ai.fail = typeof $ == "function" && $, ai.domain = T ? b.domain : void 0, this._c.push(ai), this._a && this._a.push(ai), this._s && D(this, !1), ai.promise;
        },
        // 25.4.5.1 Promise.prototype.catch(onRejected)
        catch: function(ii) {
          return this.then(void 0, ii);
        }
      }), x = function() {
        var ii = new J();
        this.promise = ii, this.resolve = L(li, ii, 1), this.reject = L(O, ii, 1);
      }, I.f = z = function(ii) {
        return ii === Y || ii === R ? new x(ii) : N(ii);
      }), u(u.G + u.W + u.F * !Q, { Promise: Y }), i(121)(Y, t), i(149)(t), R = i(92)[t], u(u.S + u.F * !Q, t, {
        // 25.4.4.5 Promise.reject(r)
        reject: function(ti) {
          var $ = z(this), ai = $.reject;
          return ai(ti), $.promise;
        }
      }), u(u.S + u.F * (c || !Q), t, {
        // 25.4.4.6 Promise.resolve(x)
        resolve: function(ti) {
          return d(c && this === R ? Y : this, ti);
        }
      }), u(u.S + u.F * !(Q && i(140)(function(ii) {
        Y.all(ii).catch(y);
      })), t, {
        // 25.4.4.1 Promise.all(iterable)
        all: function(ti) {
          var $ = this, ai = z($), Xi = ai.resolve, M = ai.reject, k = o(function() {
            var j = [], A = 0, H = 1;
            X(ti, !1, function(U) {
              var Z = A++, V = !1;
              j.push(void 0), H++, $.resolve(U).then(function(g) {
                V || (V = !0, j[Z] = g, --H || Xi(j));
              }, M);
            }), --H || Xi(j);
          });
          return k.e && M(k.v), ai.promise;
        },
        // 25.4.4.4 Promise.race(iterable)
        race: function(ti) {
          var $ = this, ai = z($), Xi = ai.reject, M = o(function() {
            X(ti, !1, function(k) {
              $.resolve(k).then(ai.resolve, Xi);
            });
          });
          return M.e && Xi(M.v), ai.promise;
        }
      });
    },
    /* 194 */
    /***/
    function(n, l, i) {
      var c = i(97), m = i(94), L = i(122)("species");
      n.exports = function(K, u) {
        var a = c(K).constructor, e;
        return a === void 0 || (e = c(a)[L]) == null ? u : m(e);
      };
    },
    /* 195 */
    /***/
    function(n, l, i) {
      var c = i(93), m = i(196), L = i(120), K = i(102), u = i(91), a = u.process, e = u.setImmediate, r = u.clearImmediate, X = u.MessageChannel, W = u.Dispatch, p = 0, C = {}, I = "onreadystatechange", o, G, d, t = function() {
        var b = +this;
        if (C.hasOwnProperty(b)) {
          var h = C[b];
          delete C[b], h();
        }
      }, s = function(b) {
        t.call(b.data);
      };
      (!e || !r) && (e = function(h) {
        for (var S = [], Y = 1; arguments.length > Y; )
          S.push(arguments[Y++]);
        return C[++p] = function() {
          m(typeof h == "function" ? h : Function(h), S);
        }, o(p), p;
      }, r = function(h) {
        delete C[h];
      }, i(86)(a) == "process" ? o = function(b) {
        a.nextTick(c(t, b, 1));
      } : W && W.now ? o = function(b) {
        W.now(c(t, b, 1));
      } : X ? (G = new X(), d = G.port2, G.port1.onmessage = s, o = c(d.postMessage, d, 1)) : u.addEventListener && typeof postMessage == "function" && !u.importScripts ? (o = function(b) {
        u.postMessage(b + "", "*");
      }, u.addEventListener("message", s, !1)) : I in K("script") ? o = function(b) {
        L.appendChild(K("script"))[I] = function() {
          L.removeChild(this), t.call(b);
        };
      } : o = function(b) {
        setTimeout(c(t, b, 1), 0);
      }), n.exports = {
        set: e,
        clear: r
      };
    },
    /* 196 */
    /***/
    function(n, l) {
      n.exports = function(i, c, m) {
        var L = m === void 0;
        switch (c.length) {
          case 0:
            return L ? i() : i.call(m);
          case 1:
            return L ? i(c[0]) : i.call(m, c[0]);
          case 2:
            return L ? i(c[0], c[1]) : i.call(m, c[0], c[1]);
          case 3:
            return L ? i(c[0], c[1], c[2]) : i.call(m, c[0], c[1], c[2]);
          case 4:
            return L ? i(c[0], c[1], c[2], c[3]) : i.call(m, c[0], c[1], c[2], c[3]);
        }
        return i.apply(m, c);
      };
    },
    /* 197 */
    /***/
    function(n, l, i) {
      var c = i(91), m = i(195).set, L = c.MutationObserver || c.WebKitMutationObserver, K = c.process, u = c.Promise, a = i(86)(K) == "process";
      n.exports = function() {
        var e, r, X, W = function() {
          var o, G;
          for (a && (o = K.domain) && o.exit(); e; ) {
            G = e.fn, e = e.next;
            try {
              G();
            } catch (d) {
              throw e ? X() : r = void 0, d;
            }
          }
          r = void 0, o && o.enter();
        };
        if (a)
          X = function() {
            K.nextTick(W);
          };
        else if (L && !(c.navigator && c.navigator.standalone)) {
          var p = !0, C = document.createTextNode("");
          new L(W).observe(C, { characterData: !0 }), X = function() {
            C.data = p = !p;
          };
        } else if (u && u.resolve) {
          var I = u.resolve(void 0);
          X = function() {
            I.then(W);
          };
        } else
          X = function() {
            m.call(c, W);
          };
        return function(o) {
          var G = { fn: o, next: void 0 };
          r && (r.next = G), e || (e = G, X()), r = G;
        };
      };
    },
    /* 198 */
    /***/
    function(n, l, i) {
      var c = i(94);
      function m(L) {
        var K, u;
        this.promise = new L(function(a, e) {
          if (K !== void 0 || u !== void 0)
            throw TypeError("Bad Promise constructor");
          K = a, u = e;
        }), this.resolve = c(K), this.reject = c(u);
      }
      n.exports.f = function(L) {
        return new m(L);
      };
    },
    /* 199 */
    /***/
    function(n, l) {
      n.exports = function(i) {
        try {
          return { e: !1, v: i() };
        } catch (c) {
          return { e: !0, v: c };
        }
      };
    },
    /* 200 */
    /***/
    function(n, l, i) {
      var c = i(91), m = c.navigator;
      n.exports = m && m.userAgent || "";
    },
    /* 201 */
    /***/
    function(n, l, i) {
      var c = i(97), m = i(98), L = i(198);
      n.exports = function(K, u) {
        if (c(K), m(u) && u.constructor === K)
          return u;
        var a = L.f(K), e = a.resolve;
        return e(u), a.promise;
      };
    },
    /* 202 */
    /***/
    function(n, l, i) {
      var c = i(90), m = i(92), L = i(91), K = i(194), u = i(201);
      c(c.P + c.R, "Promise", { finally: function(a) {
        var e = K(this, m.Promise || L.Promise), r = typeof a == "function";
        return this.then(
          r ? function(X) {
            return u(e, a()).then(function() {
              return X;
            });
          } : a,
          r ? function(X) {
            return u(e, a()).then(function() {
              throw X;
            });
          } : a
        );
      } });
    },
    /* 203 */
    /***/
    function(n, l, i) {
      var c = i(90), m = i(198), L = i(199);
      c(c.S, "Promise", { try: function(K) {
        var u = m.f(this), a = L(K);
        return (a.e ? u.reject : u.resolve)(a.v), u.promise;
      } });
    },
    /* 204 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(205), __esModule: !0 };
    },
    /* 205 */
    /***/
    function(n, l, i) {
      i(206), n.exports = i(92).Object.keys;
    },
    /* 206 */
    /***/
    function(n, l, i) {
      var c = i(124), m = i(110);
      i(207)("keys", function() {
        return function(K) {
          return m(c(K));
        };
      });
    },
    /* 207 */
    /***/
    function(n, l, i) {
      var c = i(90), m = i(92), L = i(101);
      n.exports = function(K, u) {
        var a = (m.Object || {})[K] || Object[K], e = {};
        e[K] = u(a), c(c.S + c.F * L(function() {
          a(1);
        }), "Object", e);
      };
    },
    /* 208 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", {
        value: !0
      });
      var c = i(76), m = C(c), L = i(209), K = C(L), u = i(164), a = C(u), e = i(191), r = C(e);
      l.defer = I, l.periodicity = o, l.calculateFramesOffset = G, l.getProgress = d, l.getCurrentFrame = s;
      var X = i(188), W = i(187), p = C(W);
      function C(b) {
        return b && b.__esModule ? b : { default: b };
      }
      function I() {
        var b = {};
        return b.promise = new r.default(function(h, S) {
          b.resolve = h, b.reject = S;
        }), b;
      }
      function o(b, h) {
        var S = Math.floor(b / h), Y = b - S * h;
        return Y === 0 && S > 0 && (Y = h, S--), [S, Y];
      }
      function G(b) {
        b = b.slice(0);
        var h = b[0], S = b[b.length - 1];
        S.offset = S.offset || 1, h.offset = h.offset || 0;
        for (var Y = 0, T = -1, y = 0; y < b.length; y++) {
          var J = b[y];
          if (J.offset != null) {
            var N = y - T;
            if (N > 1)
              for (var x = (J.offset - Y) / N, R = 0; R < N - 1; R++)
                b[T + R + 1].offset = Y + x * (R + 1);
            Y = J.offset, T = y;
          }
          if (J.easing != null && (J.easing = (0, X.parseEasing)(J.easing)), y > 0) {
            var z = b[y].easing != null;
            b[y] = (0, a.default)({}, b[y - 1], b[y]), z || delete b[y].easing;
          }
        }
        return b;
      }
      function d(b, h, S) {
        var Y = b.currentTime, T = h.direction, y = h.duration, J = !1;
        if (T === "reverse")
          S = 1 - S, J = !0;
        else if (T === "alternate" || T === "alternate-reverse") {
          var N = Math.floor(Y / y);
          S === 1 && N--, N % 2 ^ T === "alternate-reverse" && (S = 1 - S, J = !0);
        }
        return { p: S, inverted: J };
      }
      function t(b, h, S, Y) {
        var T = {};
        return (0, K.default)(h).forEach(function(y) {
          var J = (0, m.default)(y, 2), N = J[0], x = J[1];
          if (N !== "offset" && N !== "easing") {
            var R = S[N] || S.default, z = R(b[N], x, Y, b.offset, h.offset);
            z != null && (T[N] = z);
          }
        }), T;
      }
      function s(b, h, S, Y) {
        var T = b.easing, y = b.effect;
        y || (S = (0, a.default)({}, p.default, S));
        var J = {};
        Y = T(Y, h);
        for (var N = 1; N < h.length; N++) {
          var x = h[N], R = x.offset;
          if (R >= Y || N === h.length - 1) {
            var z = h[N - 1], Q = z.offset, P = z.easing, D = Y;
            if (P) {
              var _ = R - Q;
              D = P((Y - Q) / _) * _ + Q;
            }
            y ? J = y(z, x, D, Q, R) : J = t(z, x, S, D);
            break;
          }
        }
        return J;
      }
    },
    /* 209 */
    /***/
    function(n, l, i) {
      n.exports = { default: i(210), __esModule: !0 };
    },
    /* 210 */
    /***/
    function(n, l, i) {
      i(211), n.exports = i(92).Object.entries;
    },
    /* 211 */
    /***/
    function(n, l, i) {
      var c = i(90), m = i(212)(!0);
      c(c.S, "Object", {
        entries: function(K) {
          return m(K);
        }
      });
    },
    /* 212 */
    /***/
    function(n, l, i) {
      var c = i(100), m = i(110), L = i(84), K = i(169).f;
      n.exports = function(u) {
        return function(a) {
          for (var e = L(a), r = m(e), X = r.length, W = 0, p = [], C; X > W; )
            C = r[W++], (!c || K.call(e, C)) && p.push(u ? [C, e[C]] : e[C]);
          return p;
        };
      };
    },
    /* 213 */
    /***/
    function(n, l, i) {
      i.r(l), i(1).glMatrix.setMatrixArrayType(Array);
      const c = /* @__PURE__ */ new Map();
      function m(K, u = {}, a = []) {
        K = K.toLowerCase();
        const e = c.get(K);
        if (!e)
          throw new TypeError(`Invalid node: ${K}`);
        const r = new e(u);
        return a.forEach((X) => {
          r.appendChild(X);
        }), r;
      }
      const L = {
        registerNode(K, u, a = 100) {
          if (u = u.toLowerCase(), c.has(u))
            throw new TypeError(`Cannot registerNode, ${u} has been taken.`);
          c.set(u, K), Object.defineProperties(K.prototype, {
            nodeType: {
              value: a
            },
            tagName: {
              value: u.toUpperCase()
            },
            nodeName: {
              value: u
            },
            ownerDocument: {
              value: L
            },
            namespaceURI: {
              value: `http://spritejs.com/${u}`
            }
          });
        },
        createElement: m,
        createElementNS(K, u) {
          return m(u);
        },
        isSpriteNode(K) {
          return c.has(K.toLowerCase());
        }
      };
      l.default = L;
    },
    /* 214 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      const c = Symbol("type"), m = Symbol("bubbles"), L = Symbol("originalEvent"), K = Symbol("detail");
      class u {
        constructor(e, {
          bubbles: r = null
        } = {}) {
          if (typeof e == "string" ? (this[c] = e, this[m] = !!r) : (this[c] = e.type, this[L] = e, this[m] = r != null ? !!r : !!e.bubbles, e.detail && (this[K] = e.detail)), !this[c])
            throw new TypeError("Invalid event type.");
          this.cancelBubble = !1;
        }
        setOriginalEvent(e) {
          this[L] = e;
        }
        get originalEvent() {
          return this[L];
        }
        get type() {
          return this[c];
        }
        get bubbles() {
          return this[m];
        }
        get detail() {
          return this[K];
        }
        stopPropagation() {
          this.cancelBubble = !0;
        }
      }
    },
    /* 215 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "parseFilterString", function() {
        return m;
      }), i.d(l, "applyFilters", function() {
        return L;
      });
      var c = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(K) {
        if (K = K.trim(), !K || K === "none")
          return null;
        const u = /^(?:(url|blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|opacity|saturate|sepia)\(([^()]*(?:\(.*\))*[^()]*)\))+$/i, a = K.match(/(?:(url|blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|opacity|saturate|sepia)\(([^()]*(?:\(.*\))*[^()]*)\))+?/ig), e = [];
        return a && a.forEach((r) => {
          const X = r.match(u);
          if (!X)
            throw new TypeError("Invalid fitler string.");
          let [, W, p] = X;
          W = W.toLowerCase(), p = p.trim().match(/([^( )]+|([^( )]+\(.*\)))(?=\s|$)/g).map((C, I) => {
            let o;
            return W === "url" || W === "drop-shadow" && I === 3 ? o = C : o = Object(c.toNumber)(C), /%$/.test(C) && (o /= 100), o;
          }), e.push({
            type: W,
            args: p
          });
        }), e;
      }
      function L(K, u) {
        K.clearFilter(), u && u.forEach(({
          type: a,
          args: e
        }) => {
          let r = a;
          r === "drop-shadow" ? r = "dropShadow" : r === "hue-rotate" && (r = "hueRotate"), K[r](...e);
        });
      }
    },
    /* 216 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return c;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(m, L) {
        if (!L)
          return;
        const K = m.getListeners("beforerender"), u = m.getListeners("afterrender");
        K.length && !L.beforeRender ? L.beforeRender = (a) => {
          m.dispatchEvent({
            type: "beforerender",
            detail: {
              context: a
            }
          });
        } : K.length || (L.beforeRender = null), u.length && !L.afterRender ? L.afterRender = (a) => {
          m.dispatchEvent({
            type: "afterrender",
            detail: {
              context: a
            }
          });
        } : u.length || (L.afterRender = null);
      }
    },
    /* 217 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(12), m = i(218), L = i(70), K = i(213);
      i(1).glMatrix.setMatrixArrayType(Array);
      const u = Symbol("amount"), a = Symbol("meshCloud");
      class e extends L.default {
        constructor(X, W = 1) {
          super(), this.meshNode = X, X.connect(this), this[u] = W, this[a] = null;
        }
        get meshCloud() {
          const X = this.meshNode, W = this[u];
          return !this[a] && X.mesh && (this[a] = new c.MeshCloud(X.mesh, W)), this[a];
        }
        /* override */
        get isVisible() {
          return !!this.meshNode && this.meshNode.isVisible;
        }
        get amount() {
          return this[u];
        }
        set amount(X) {
          this[u] = X, this[a] && (this[a].amount = X);
        }
        brightness(X, W) {
          this.meshCloud && (this.meshCloud.brightness(X, W), this.forceUpdate());
        }
        contrast(X, W) {
          this.meshCloud && (this.meshCloud.contrast(X, W), this.forceUpdate());
        }
        delete(X) {
          this.meshCloud && (this.meshCloud.delete(X), this[u]--, this.forceUpdate());
        }
        /* override */
        draw(X = []) {
          if (super.draw(X), this.meshCloud) {
            if (this.program) {
              this.meshCloud.setProgram(this.program);
              const W = this.shaderAttrs;
              W && Object.entries(W).forEach(([C, I]) => {
                this.meshCloud.mesh.setAttribute(C, I);
              });
              const p = this.uniforms;
              if (this.uniforms) {
                const C = {};
                Object.entries(p).forEach(([I, o]) => {
                  typeof o == "function" && (o = o(this, I)), C[I] = o;
                }), this.meshCloud.mesh.setUniforms(C);
              }
            }
            this.meshNode.textureImage && Object(m.drawTexture)(this.meshNode, this.meshNode.mesh), X.push(this.meshCloud);
          }
          return X;
        }
        getTransform(X) {
          if (this.meshCloud)
            return this.meshCloud.getTransform(X);
        }
        grayscale(X, W) {
          this.meshCloud && (this.meshCloud.grayscale(X, W), this.forceUpdate());
        }
        hueRotate(X, W) {
          this.meshCloud && (this.meshCloud.hueRotate(X, W), this.forceUpdate());
        }
        invert(X, W) {
          this.meshCloud && (this.meshCloud.invert(X, W), this.forceUpdate());
        }
        /* override */
        isPointCollision(X, W) {
          if (!this.meshCloud)
            return !1;
          const p = this.attributes.pointerEvents;
          if (p === "none" || p !== "all" && !this.isVisible)
            return !1;
          let C = "both";
          p === "visibleFill" && (C = "fill"), p === "visibleStroke" && (C = "stroke");
          for (let I = 0; I < this[u]; I++)
            if (!this.meshCloud.isPointCollision(I, [X, W], C))
              return !1;
          return !0;
        }
        setOpacity(X, W) {
          this.meshCloud && (this.meshCloud.opacity(X, W), this.forceUpdate());
        }
        rotate(X, W, [p, C] = [0, 0]) {
          const I = Math.PI * W / 180;
          if (this.meshCloud) {
            const {
              x: o,
              y: G
            } = this.meshNode.attributes;
            this.meshCloud.rotate(X, I, [p + o, C + G]), this.forceUpdate();
          }
        }
        saturate(X, W) {
          this.meshCloud && (this.meshCloud.saturate(X, W), this.forceUpdate());
        }
        scale(X, [W, p = W], [C, I] = [0, 0]) {
          if (this.meshCloud) {
            const {
              x: o,
              y: G
            } = this.meshNode.attributes, d = 1e-5;
            Math.abs(W) < d && (W = 1 / W > 0 ? d : -d), Math.abs(p) < d && (p = 1 / p > 0 ? d : -d), this.meshCloud.scale(X, [W, p], [C + o, I + G]), this.forceUpdate();
          }
        }
        setColorTransform(X, W) {
          this.meshCloud && (this.meshCloud.setColorTransform(X, W), this.forceUpdate());
        }
        setFillColor(X, W) {
          this.meshCloud && (Array.isArray(W) && (W = [...W], W[0] /= 255, W[1] /= 255, W[2] /= 255), this.meshCloud.setFillColor(X, W), this.forceUpdate());
        }
        sepia(X, W) {
          this.meshCloud && (this.meshCloud.sepia(X, W), this.forceUpdate());
        }
        /* override */
        setResolution({
          width: X,
          height: W
        }) {
          super.setResolution({
            width: X,
            height: W
          }), this.meshNode.setResolution({
            width: X,
            height: W
          });
        }
        setStrokeColor(X, W) {
          this.meshCloud && (Array.isArray(W) && (W = [...W], W[0] /= 255, W[1] /= 255, W[2] /= 255), this.meshCloud.setStrokeColor(X, W), this.forceUpdate());
        }
        setTransform(X, W) {
          this.meshCloud && (this.meshCloud.setTransform(X, W), this.forceUpdate());
        }
        skew(X, [W, p = W], [C, I] = [0, 0]) {
          if (this.meshCloud) {
            const {
              x: o,
              y: G
            } = this.meshNode.attributes;
            this.meshCloud.skew(X, [W, p], [C + o, I + G]), this.forceUpdate();
          }
        }
        transform(X, W) {
          this.meshCloud && (this.meshCloud.transform(X, W), this.forceUpdate());
        }
        transformColor(X, W) {
          this.meshCloud && (this.meshCloud.transformColor(X, W), this.forceUpdate());
        }
        translate(X, [W, p]) {
          this.meshCloud && (this.meshCloud.translate(X, [W, p]), this.forceUpdate());
        }
        updateMesh() {
          this[a] && (this[a].mesh = this.meshNode.mesh, this.forceUpdate());
        }
      }
      K.default.registerNode(e, "cloud");
    },
    /* 218 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "loadTexture", function() {
        return K;
      }), i.d(l, "applyTexture", function() {
        return u;
      }), i.d(l, "createTexture", function() {
        return e;
      }), i.d(l, "deleteTexture", function() {
        return r;
      }), i.d(l, "drawTexture", function() {
        return W;
      }), i.d(l, "loadFrames", function() {
        return p;
      });
      var c = i(12), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = {};
      function K(C, I) {
        if (L[C])
          return L[C];
        const o = c.ENV.loadImage(C, {
          alias: I,
          useImageBitmap: !1
        });
        return o ?? C;
      }
      async function u(C, I, o) {
        let G = I;
        if (typeof I == "string" && (G = K(I)), G && typeof G.then == "function" && (G = await G), I === C.attributes.texture) {
          G && G.image && (G.sourceRect && (C.attributes.sourceRect = G.sourceRect), C.textureImageRotated = !!G.rotated, G = G.image);
          const {
            width: d,
            height: t,
            textureRect: s
          } = C.attributes, b = C.textureImage;
          C.textureImage = G, o && b !== G && !s && (d == null || t == null) && C.updateContours(), C.forceUpdate();
        }
        return G;
      }
      const a = Symbol("textureMap");
      function e(C, I) {
        if (I[a] = I[a] || /* @__PURE__ */ new Map(), I[a].has(C))
          return I[a].get(C);
        const o = I.createTexture(C);
        return !/^blob:/.test(C.src) && typeof C.getContext != "function" && I[a].set(C, o), o;
      }
      function r(C, I) {
        if (I[a] && I[a].has(C)) {
          const o = I[a].get(C);
          return I.deleteTexture(o), I[a].delete(C), !0;
        }
        return !1;
      }
      const X = Symbol("textureContext");
      function W(C, I) {
        const o = C.textureImage instanceof String ? String(C.textureImage) : C.textureImage, G = C.textureImageRotated, d = I.texture, t = C.renderer;
        if (o) {
          const s = C.originalContentRect;
          let b = C.attributes.textureRect;
          const h = C.attributes.textureRepeat, S = C.attributes.sourceRect;
          if (!d || C[X] && C[X] !== t || d.image !== o || d.options.repeat !== h || !Object(m.compareValue)(d.options.rect, b) || !Object(m.compareValue)(d.options.srcRect, S)) {
            const Y = e(o, t);
            b ? (b[0] += s[0], b[1] += s[1]) : b = s;
            let T = null;
            d && !t[a].has(d.image) && (!d.options || !d.options.hidden) && (T = I.uniforms.u_texSampler), I.setTexture(Y, {
              rect: b,
              repeat: h,
              srcRect: S,
              rotated: G
            }), T && T.delete && T.delete(), C[X] = t;
          }
        } else if (d) {
          let s = null;
          !t[a].has(d.image) && (!d.options || !d.options.hidden) && (s = I.uniforms.u_texSampler), I.setTexture(null), s && s.delete && s.delete();
        }
      }
      async function p(C, I) {
        typeof I == "string" && (I = await (await fetch(I, {
          method: "GET",
          mode: "cors",
          cache: "default"
        })).json());
        const o = await K(C), G = I.frames;
        return Object.entries(G).forEach(([d, t]) => {
          const {
            x: s,
            y: b,
            w: h,
            h: S
          } = t.frame;
          let Y = [s, b, h, S];
          const T = t.rotated;
          T && (Y = [Y[0], Y[1], Y[3], Y[2]]), L[d] = {
            image: o,
            sourceRect: Y,
            rotated: T
          };
        }), o;
      }
    },
    /* 219 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return p;
      });
      var c = i(1), m = i(12), L = i(70), K = i(220), u = i(221), a = i(222), e = i(213), r = i(223);
      i(1).glMatrix.setMatrixArrayType(Array);
      function X(C, I, o) {
        return I in C ? Object.defineProperty(C, I, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : C[I] = o, C;
      }
      const W = Symbol("mesh");
      class p extends L.default {
        constructor(I = {}) {
          super(I);
        }
        get borderSize() {
          const {
            paddingTop: I,
            paddingRight: o,
            paddingBottom: G,
            paddingLeft: d,
            borderWidth: t
          } = this.attributes, [s, b] = this.contentSize;
          return [d + s + o + t, I + b + G + t];
        }
        // content + padding
        get clientSize() {
          const {
            paddingTop: I,
            paddingRight: o,
            paddingBottom: G,
            paddingLeft: d
          } = this.attributes, [t, s] = this.contentSize;
          return [d + t + o, I + s + G];
        }
        get contentSize() {
          let {
            width: I,
            height: o,
            boxSizing: G,
            paddingTop: d,
            paddingRight: t,
            paddingBottom: s,
            paddingLeft: b
          } = this.attributes;
          if (I = I || 0, o = o || 0, G === "border-box") {
            const h = 2 * this.attributes.borderWidth;
            I -= h + t + b, o -= h + d + s, I = Math.max(0, I), o = Math.max(0, o);
          }
          return [I, o];
        }
        get hasBorder() {
          return this.attributes.borderWidth > 0;
        }
        /* override */
        get isVisible() {
          const [I, o] = this.borderSize;
          return I > 0 && o > 0;
        }
        get mesh() {
          if (this.attributes.display === "none")
            return null;
          const I = this.clientBox;
          if (I) {
            let o = this[W];
            if (o)
              o.box !== I && (o.contours = I.contours, o.box = I);
            else {
              o = new m.Mesh2D(I), o.box = I;
              const d = this.attributes.bgcolor;
              if (Object(u.setFillColor)(o, {
                color: d
              }), this.hasBorder) {
                const {
                  borderColor: s,
                  borderWidth: b,
                  borderDash: h,
                  borderDashOffset: S
                } = this.attributes;
                Object(u.setStrokeColor)(o, {
                  color: s,
                  lineWidth: b,
                  lineDash: h,
                  lineDashOffset: S
                });
              }
              this[W] = o;
              const t = this.attributes.clipPath;
              t && this[W].setClipPath(t);
            }
            const G = this.opacity;
            return o.getOpacity() !== G && o.setOpacity(G), o.setTransform(...this.renderMatrix), o;
          }
          return null;
        }
        // content + padding + border
        get offsetSize() {
          const {
            paddingTop: I,
            paddingRight: o,
            paddingBottom: G,
            paddingLeft: d,
            borderWidth: t
          } = this.attributes, [s, b] = this.contentSize, h = 2 * t;
          return [d + s + o + h, I + b + G + h];
        }
        get originalClientRect() {
          if (this.mesh) {
            const I = this.mesh.boundingBox;
            return [I[0][0], I[0][1], I[1][0] - I[0][0], I[1][1] - I[0][1]];
          }
          return [0, 0, 0, 0];
        }
        get originalContentRect() {
          const [I, o, G, d] = this.originalClientRect, t = this.attributes.padding;
          return [I + t[0], o + t[1], G - t[0] - t[2], d - t[1] - t[3]];
        }
        getBoundingClientRect() {
          let I = this.renderMatrix;
          this.layer && this.layer.layerTransformInvert && (I = c.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), this.layer.transformMatrix, I));
          let o = null;
          if (this.mesh) {
            o = [...this.mesh.boundingBox];
            const G = this.attributes.borderWidth;
            G && (o[0] = [o[0][0] - G, o[0][1] - G], o[1] = [o[1][0] + G, o[1][1] + G]);
          }
          return Object(r.default)(o, I);
        }
        // transformPoint(x, y) {
        //   const m = mat2d.invert(this.renderMatrix);
        //   const newX = x * m[0] + y * m[2] + m[4];
        //   const newY = x * m[1] + y * m[3] + m[5];
        //   return [newX, newY];
        // }
        /* override */
        onPropertyChange(I, o, G) {
          if (super.onPropertyChange(I, o, G), (I === "anchorX" || I === "anchorY" || I === "boxSizing" || I === "width" || I === "height" || I === "borderWidth" || I === "paddingLeft" || I === "paddingRight" || I === "paddingTop" || I === "paddingBottom" || /^border(TopLeft|TopRight|BottomRight|BottomLeft)Radius$/.test(I)) && this.updateContours(), this[W] && I === "clipPath" && this[W].setClipPath(o), this[W] && I === "bgcolor" && Object(u.setFillColor)(this[W], {
            color: o
          }), this[W] && (I === "borderColor" || I === "borderWidth" || I === "borderDash" || I === "borderDashOffset")) {
            const {
              borderColor: d,
              borderWidth: t,
              borderDash: s,
              borderDashOffset: b
            } = this.attributes;
            Object(u.setStrokeColor)(this[W], {
              color: d,
              lineWidth: t,
              lineDash: t ? s : 0,
              lineDashOffset: b
            });
          }
        }
        /* override */
        updateContours() {
          const {
            anchorX: I,
            anchorY: o,
            borderWidth: G,
            borderRadius: d
          } = this.attributes, [t, s] = this.borderSize, b = this.offsetSize, h = 0.5 * G, S = -I * b[0] + h, Y = -o * b[1] + h;
          this.clientBox = new m.Figure2D(), Object(a.createRadiusBox)(this.clientBox, [S, Y, t, s], d);
        }
      }
      X(p, "Attr", K.default), e.default.registerNode(p, "block");
    },
    /* 220 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return r;
      });
      var c = i(71), m = i(72), L = i(221);
      i(1).glMatrix.setMatrixArrayType(Array);
      const K = Symbol.for("spritejs_setAttribute"), u = Symbol.for("spritejs_getAttribute"), a = Symbol.for("spritejs_setAttributeDefault"), e = Symbol.for("spritejs_declareAlias");
      class r extends c.default {
        constructor(W) {
          super(W), this[a]({
            anchorX: 0,
            anchorY: 0,
            /* anchor */
            width: void 0,
            height: void 0,
            /* size */
            borderWidth: 0,
            borderColor: "rgba(0,0,0,1)",
            /* border */
            borderDash: void 0,
            borderDashOffset: 0,
            borderTopLeftRadius: [0, 0],
            borderTopRightRadius: [0, 0],
            borderBottomRightRadius: [0, 0],
            borderBottomLeftRadius: [0, 0],
            /* borderRadius */
            bgcolor: "rgba(0,0,0,0)",
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            /* padding */
            boxSizing: "content-box",
            clipPath: void 0
          }), this[e]("anchor", "size", "border", "borderRadius", "padding");
        }
        get anchorX() {
          return this[u]("anchorX");
        }
        set anchorX(W) {
          this[K]("anchorX", Object(m.toNumber)(W));
        }
        get anchorY() {
          return this[u]("anchorY");
        }
        set anchorY(W) {
          this[K]("anchorY", Object(m.toNumber)(W));
        }
        get anchor() {
          return [this.anchorX, this.anchorY];
        }
        set anchor(W) {
          W = Object(m.toArray)(W), Array.isArray(W) || (W = [W, W]), this.anchorX = W[0], this.anchorY = W[1];
        }
        get width() {
          return this[u]("width");
        }
        set width(W) {
          this[K]("width", Object(m.toNumber)(W));
        }
        get height() {
          return this[u]("height");
        }
        set height(W) {
          this[K]("height", Object(m.toNumber)(W));
        }
        get size() {
          return [this.width, this.height];
        }
        set size(W) {
          W = Object(m.toArray)(W), Array.isArray(W) || (W = [W, W]), this.width = W[0], this.height = W[1];
        }
        get borderWidth() {
          return this[u]("borderWidth");
        }
        set borderWidth(W) {
          this[K]("borderWidth", Object(m.toNumber)(W));
        }
        get borderColor() {
          return this[u]("borderColor");
        }
        set borderColor(W) {
          this[K]("borderColor", Object(L.parseColor)(W));
        }
        get border() {
          return [this.borderWidth, this.borderColor];
        }
        set border(W) {
          W = Object(m.toArray)(W), Array.isArray(W) || (W = [W]), this.borderWidth = W[0], W[1] != null && (this.borderColor = W[1]);
        }
        get borderDash() {
          return this[u]("borderDash");
        }
        set borderDash(W) {
          W = Object(m.toArray)(W, !0), W != null && !Array.isArray(W) && (W = [W]), this[K]("borderDash", W ? W.map(m.toNumber) : null);
        }
        get borderDashOffset() {
          return this[u]("borderDashOffset");
        }
        set borderDashOffset(W) {
          this[K]("borderDashOffset", Object(m.toNumber)(W));
        }
        get borderTopLeftRadius() {
          return this[u]("borderTopLeftRadius");
        }
        set borderTopLeftRadius(W) {
          W = Object(m.toArray)(W, !0), Array.isArray(W) || (W = [W, W]), this[K]("borderTopLeftRadius", W.map(m.toNumber));
        }
        get borderTopRightRadius() {
          return this[u]("borderTopRightRadius");
        }
        set borderTopRightRadius(W) {
          W = Object(m.toArray)(W, !0), Array.isArray(W) || (W = [W, W]), this[K]("borderTopRightRadius", W.map(m.toNumber));
        }
        get borderBottomRightRadius() {
          return this[u]("borderBottomRightRadius");
        }
        set borderBottomRightRadius(W) {
          W = Object(m.toArray)(W, !0), Array.isArray(W) || (W = [W, W]), this[K]("borderBottomRightRadius", W.map(m.toNumber));
        }
        get borderBottomLeftRadius() {
          return this[u]("borderBottomLeftRadius");
        }
        set borderBottomLeftRadius(W) {
          W = Object(m.toArray)(W, !0), Array.isArray(W) || (W = [W, W]), this[K]("borderBottomLeftRadius", W.map(m.toNumber));
        }
        get borderRadius() {
          return [...this.borderTopLeftRadius, ...this.borderTopRightRadius, ...this.borderBottomRightRadius, ...this.borderBottomLeftRadius];
        }
        set borderRadius(W) {
          if (W = Object(m.toArray)(W), !Array.isArray(W))
            W = Array(8).fill(W);
          else if (W.length === 2)
            W = [W[0], W[1], W[0], W[1], W[0], W[1], W[0], W[1]];
          else if (W.length === 4)
            W = [W[0], W[1], W[2], W[3], W[0], W[1], W[2], W[3]];
          else if (W.length === 6)
            W = [W[0], W[1], W[2], W[3], W[4], W[5], W[2], W[3]];
          else if (W.length !== 8)
            throw new TypeError("Invalid borderRadius value.");
          this.borderTopLeftRadius = [W[0], W[1]], this.borderTopRightRadius = [W[2], W[3]], this.borderBottomRightRadius = [W[4], W[5]], this.borderBottomLeftRadius = [W[6], W[7]];
        }
        get bgcolor() {
          return this[u]("bgcolor");
        }
        set bgcolor(W) {
          this[K]("bgcolor", Object(L.parseColor)(W));
        }
        get paddingTop() {
          return this[u]("paddingTop");
        }
        set paddingTop(W) {
          this[K]("paddingTop", Object(m.toNumber)(W));
        }
        get paddingRight() {
          return this[u]("paddingRight");
        }
        set paddingRight(W) {
          this[K]("paddingRight", Object(m.toNumber)(W));
        }
        get paddingBottom() {
          return this[u]("paddingBottom");
        }
        set paddingBottom(W) {
          this[K]("paddingBottom", Object(m.toNumber)(W));
        }
        get paddingLeft() {
          return this[u]("paddingLeft");
        }
        set paddingLeft(W) {
          this[K]("paddingLeft", Object(m.toNumber)(W));
        }
        get padding() {
          return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
        }
        set padding(W) {
          W = Object(m.toArray)(W), Array.isArray(W) ? W.length === 2 ? W = [W[0], W[1], W[0], W[1]] : W.length === 3 && (W = [W[0], W[1], W[2], W[1]]) : W = [W, W, W, W], this.paddingTop = W[0], this.paddingRight = W[1], this.paddingBottom = W[2], this.paddingLeft = W[3];
        }
        get clipPath() {
          return this[u]("clipPath");
        }
        set clipPath(W) {
          this[K]("clipPath", W);
        }
        get boxSizing() {
          return this[u]("boxSizing");
        }
        set boxSizing(W) {
          if (W != null && W !== "border-box" && W !== "content-box")
            throw new TypeError("Invalid boxSizing type.");
          this[K]("boxSizing", W);
        }
      }
    },
    /* 221 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "Gradient", function() {
        return L;
      }), i.d(l, "isTransparent", function() {
        return K;
      }), i.d(l, "parseColor", function() {
        return u;
      }), i.d(l, "setFillColor", function() {
        return e;
      }), i.d(l, "setStrokeColor", function() {
        return r;
      }), i.d(l, "Color", function() {
        return X;
      });
      var c = i(32), m = /* @__PURE__ */ i.n(c);
      i(1).glMatrix.setMatrixArrayType(Array);
      class L {
        constructor({
          vector: p,
          colors: C
        }) {
          if (!Array.isArray(p) || p.length !== 4 && p.length !== 6 && p.length !== 3)
            throw new TypeError("Invalid gradient");
          this.vector = p, this.colors = C.map(({
            offset: I,
            color: o
          }) => ({
            offset: I,
            color: u(o)
          }));
        }
        toString() {
          return JSON.stringify({
            vector: this.vector,
            colors: this.colors
          });
        }
      }
      function K(W) {
        return W instanceof L ? !1 : W == null ? !0 : m()(W)[3] === 0;
      }
      function u(W) {
        if (W == null || (W || (W = "transparent"), W instanceof L))
          return W;
        const p = m()(W);
        if (!p || !p.length)
          throw new TypeError("Invalid color value.");
        return `rgba(${p.join()})`;
      }
      function a(W, p, C) {
        const I = W.boundingBox[0];
        if (C.vector) {
          let {
            vector: o,
            colors: G
          } = C;
          o.length === 4 ? (o = [o[0] + I[0], o[1] + I[1], o[2] + I[0], o[3] + I[1]], W.setLinearGradient({
            vector: o,
            colors: G,
            type: p
          })) : o.length === 3 ? (o = [o[0] + I[0], o[1] + I[1], o[2]], W.setCircularGradient({
            vector: o,
            colors: G,
            type: p
          })) : (o = [o[0] + I[0], o[1] + I[1], o[2], o[3] + I[0], o[4] + I[1], o[5]], W.setRadialGradient({
            vector: o,
            colors: G,
            type: p
          }));
        } else
          W.gradient && W.gradient[p] && (delete W.gradient[p], delete W.uniforms.u_radialGradientVector);
      }
      function e(W, {
        color: p,
        rule: C = "nonzero"
      }) {
        return a(W, "fill", p), p.vector || W.setFill({
          color: p,
          rule: C
        }), W;
      }
      function r(W, {
        color: p,
        lineWidth: C,
        lineCap: I,
        lineJoin: o,
        lineDash: G,
        lineDashOffset: d,
        miterLimit: t,
        roundSegments: s
      }) {
        a(W, "stroke", p), p.vector && (p = [0, 0, 0, 1]), W.setStroke({
          color: p,
          thickness: C,
          cap: I,
          join: o,
          miterLimit: t,
          lineDash: G,
          lineDashOffset: d,
          roundSegments: s
        });
      }
      class X extends Array {
        constructor(p = 0, C = 0, I = 0, o = 0) {
          return Array.isArray(p) && ([p, C, I, o] = p), typeof p == "string" && ([p, C, I, o] = m()(p), p /= 255, C /= 255, I /= 255), super(p, C, I, o), this;
        }
        get r() {
          return Math.round(this[0] * 255);
        }
        set r(p) {
          this[0] = p / 255;
        }
        get g() {
          return Math.round(this[1] * 255);
        }
        set g(p) {
          this[1] = p / 255;
        }
        get b() {
          return Math.round(this[2] * 255);
        }
        set b(p) {
          this[2] = p / 255;
        }
        get a() {
          return this[3];
        }
        set a(p) {
          this[3] = p;
        }
        get hex() {
          const p = `0${this.r.toString(16)}`.slice(-2), C = `0${this.g.toString(16)}`.slice(-2), I = `0${this.b.toString(16)}`.slice(-2);
          let o;
          return this.a < 1 && (o = Math.round(this[3] * 255), o = `0${o.toString(16)}`.slice(-2)), `#${p}${C}${I}${o || ""}`;
        }
        get rgba() {
          return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        }
        fromColor(p) {
          return typeof p == "string" && (p = m()(p), p[0] /= 255, p[1] /= 255, p[2] /= 255), this[0] = p[0], this[1] = p[1], this[2] = p[2], this[3] = p[3], this;
        }
      }
    },
    /* 222 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "createRadiusBox", function() {
        return m;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(L, K, u, a, e, r = "leftTop") {
        const X = 0.5522848, W = a / 2 * X, p = e / 2 * X, C = K + a, I = u + e, o = K + a / 2, G = u + e / 2;
        r === "leftTop" ? (L.moveTo(K, G), L.bezierCurveTo(K, G - p, o - W, u, o, u)) : r === "rightTop" ? L.bezierCurveTo(o + W, u, C, G - p, C, G) : r === "rightBottom" ? L.bezierCurveTo(C, G + p, o + W, I, o, I) : r === "leftBottom" && L.bezierCurveTo(o - W, I, K, G + p, K, G);
      }
      function m(L, [K, u, a, e], r) {
        if (!r || Array.isArray(r) && r.every((X) => X === 0))
          L.beginPath(), L.rect(K, u, a, e);
        else {
          typeof r == "number" && (r = Array(8).fill(r));
          const [X, W, p, C, I, o, G, d] = r.map((t, s) => s % 2 ? Math.min(t, e / 2) : Math.min(t, a / 2));
          L.beginPath(), L.moveTo(K, u + W), c(L, K, u, X * 2, W * 2, "leftTop"), L.lineTo(K + a - p, u), c(L, K + a - p * 2, u, p * 2, C * 2, "rightTop"), L.lineTo(K + a, u + e - o), c(L, K + a - I * 2, u + e - o * 2, I * 2, o * 2, "rightBottom"), L.lineTo(K + G, u + e), c(L, K, u + e - d * 2, G * 2, d * 2, "leftBottom"), L.closePath();
        }
        return L;
      }
    },
    /* 223 */
    /***/
    function(n, l, i) {
      i.r(l), i(1).glMatrix.setMatrixArrayType(Array), l.default = function(c, m) {
        if (!c)
          return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          };
        const [[L, K], [u, a]] = c, e = L * m[0] + K * m[2] + m[4], r = L * m[1] + K * m[3] + m[5], X = u * m[0] + K * m[2] + m[4], W = u * m[1] + K * m[3] + m[5], p = u * m[0] + a * m[2] + m[4], C = u * m[1] + a * m[3] + m[5], I = L * m[0] + a * m[2] + m[4], o = L * m[1] + a * m[3] + m[5], G = Math.min(e, X, p, I), d = Math.min(r, W, C, o), t = Math.max(e, X, p, I), s = Math.max(r, W, C, o);
        return {
          x: G,
          y: d,
          width: t - G,
          height: s - d,
          left: G,
          top: d,
          right: t,
          bottom: s
        };
      };
    },
    /* 224 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(218), m = i(219), L = i(225), K = i(213);
      i(1).glMatrix.setMatrixArrayType(Array);
      function u(r, X, W) {
        return X in r ? Object.defineProperty(r, X, { value: W, enumerable: !0, configurable: !0, writable: !0 }) : r[X] = W, r;
      }
      const a = Symbol("textureTask");
      class e extends m.default {
        constructor(X = {}) {
          typeof X == "string" && (X = {
            texture: X
          }), super(X);
        }
        /* override */
        get contentSize() {
          let [X, W] = super.contentSize;
          const {
            width: p,
            height: C
          } = this.attributes;
          if (p == null || C == null) {
            const I = this.textureImage, o = this.attributes.textureRect, G = this.attributes.sourceRect;
            if (o)
              p == null && (X = o[0] + o[2]), C == null && (W = o[1] + o[3]);
            else if (G) {
              const d = this.layer ? this.layer.displayRatio : 1;
              p == null && (X = G[2] / d), C == null && (W = G[3] / d);
            } else if (I) {
              const d = this.layer ? this.layer.displayRatio : 1;
              p == null && (X = I.width / d), C == null && (W = I.height / d);
            }
          }
          return [X, W];
        }
        get textureImageReady() {
          return this[a] || Promise.resolve();
        }
        /* override */
        draw(X = []) {
          super.draw(X);
          const W = this.mesh;
          return W && Object(c.drawTexture)(this, W), X;
        }
        /* override */
        onPropertyChange(X, W, p) {
          if (super.onPropertyChange(X, W, p), X === "texture" && (this[a] = Object(c.applyTexture)(this, W, !0)), X === "textureRect") {
            const {
              width: C,
              height: I
            } = this.attributes;
            (C == null || I == null) && this.updateContours();
          }
        }
      }
      u(e, "Attr", L.default), K.default.registerNode(e, "sprite");
    },
    /* 225 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(220);
      i(1).glMatrix.setMatrixArrayType(Array);
      const m = Symbol.for("spritejs_setAttributeDefault"), L = Symbol.for("spritejs_setAttribute"), K = Symbol.for("spritejs_getAttribute");
      class u extends c.default {
        constructor(e) {
          super(e), this[m]({
            texture: void 0,
            textureRect: void 0,
            textureRepeat: !1,
            sourceRect: void 0
          });
        }
        get texture() {
          return this[K]("texture");
        }
        set texture(e) {
          this[L]("texture", e);
        }
        get textureRect() {
          return this[K]("textureRect");
        }
        set textureRect(e) {
          this[L]("textureRect", e);
        }
        get sourceRect() {
          return this[K]("sourceRect");
        }
        set sourceRect(e) {
          this[L]("sourceRect", e);
        }
        get textureRepeat() {
          return this[K]("textureRepeat");
        }
        set textureRepeat(e) {
          this[L]("textureRepeat", !!e);
        }
      }
    },
    /* 226 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return C;
      });
      var c = i(12), m = i(227), L = /* @__PURE__ */ i.n(m), K = i(70), u = i(228), a = i(221), e = i(218), r = i(213), X = i(223);
      i(1).glMatrix.setMatrixArrayType(Array);
      function W(I, o, G) {
        return o in I ? Object.defineProperty(I, o, { value: G, enumerable: !0, configurable: !0, writable: !0 }) : I[o] = G, I;
      }
      const p = Symbol("mesh");
      class C extends K.default {
        constructor(o = {}) {
          typeof o == "string" && (o = {
            d: o
          }), super(o), this.effects = {
            d(G, d, t, s, b) {
              const h = (t - s) / (b - s);
              if (h <= 0)
                return G;
              if (h >= 1)
                return d;
              const S = L.a._preprocessing(L.a.path2shapes(G), L.a.path2shapes(d)), Y = L.a._lerp(...S, h)[0];
              return Y.reduce((y, J) => `${y}${J.slice(2).join(" ")} `, `M${Y[0][0]} ${Y[0][1]}C`).trim();
            }
          };
        }
        /* override */
        get isVisible() {
          return !!this.d;
        }
        get mesh() {
          if (this.attributes.display === "none")
            return null;
          const o = this.path;
          if (o) {
            let G = this[p];
            if (G)
              G.path !== o && (G.contours = o.contours, G.path = o);
            else {
              G = new c.Mesh2D(this.path), G.path = o;
              const t = this.attributes.fillColor, s = this.attributes.fillRule;
              t && Object(a.setFillColor)(G, {
                color: t,
                rule: s
              });
              const b = this.attributes.lineWidth, h = this.attributes.strokeColor;
              if (h && b > 0) {
                const {
                  lineCap: Y,
                  lineJoin: T,
                  miterLimit: y,
                  lineDash: J,
                  lineDashOffset: N,
                  roundSegments: x
                } = this.attributes;
                Object(a.setStrokeColor)(G, {
                  color: h,
                  lineWidth: b,
                  lineCap: Y,
                  lineJoin: T,
                  miterLimit: y,
                  lineDash: J,
                  lineDashOffset: N,
                  roundSegments: x
                });
              }
              this[p] = G;
              const S = this.attributes.clipPath;
              S && this[p].setClipPath(S);
            }
            const d = this.opacity;
            return G.getOpacity() !== d && G.setOpacity(d), G.setTransform(...this.renderMatrix), G;
          }
          return null;
        }
        get originalContentRect() {
          if (this.path) {
            const o = this.path.boundingBox;
            return [o[0][0], o[0][1], o[1][0] - o[0][0], o[1][1] - o[0][1]];
          }
          return [0, 0, 0, 0];
        }
        get originalClientRect() {
          if (this.mesh) {
            const o = this.mesh.boundingBox;
            return [o[0][0], o[0][1], o[1][0] - o[0][0], o[1][1] - o[0][1]];
          }
          return [0, 0, 0, 0];
        }
        get originalClientCenter() {
          return this.mesh ? this.mesh.boundingCenter : [0, 0];
        }
        set d(o) {
          this.attributes.d = o;
        }
        get d() {
          return this.attributes.d;
        }
        /* override */
        draw(o = []) {
          super.draw(o);
          const G = this.mesh;
          return G && Object(e.drawTexture)(this, G), o;
        }
        getBoundingClientRect() {
          let o = null;
          return this.mesh && (o = this.mesh.boundingBox), Object(X.default)(o, this.renderMatrix);
        }
        getPathLength() {
          return this.mesh ? this.mesh.getTotalLength() : 0;
        }
        getPointAtLength(o) {
          if (this.mesh) {
            const G = this.mesh.getPointAtLength(o);
            if (G)
              return [G.x, G.y];
          }
          return [0, 0];
        }
        /* override */
        onPropertyChange(o, G, d) {
          if (super.onPropertyChange(o, G, d), (o === "d" || o === "normalize") && this.updateContours(), this[p] && (o === "fillColor" || o === "fillRule")) {
            const {
              fillColor: t,
              fillRule: s
            } = this.attributes;
            Object(a.setFillColor)(this[p], {
              color: t,
              rule: s
            });
          }
          if (this[p] && (o === "strokeColor" || o === "lineWidth" || o === "lineCap" || o === "lineJoin" || o === "lineDash" || o === "lineDashOffset" || o === "roundSegments")) {
            const {
              strokeColor: t,
              lineWidth: s
            } = this.attributes;
            if (t && s > 0) {
              const {
                lineCap: b,
                lineJoin: h,
                lineDash: S,
                lineDashOffset: Y,
                miterLimit: T,
                roundSegments: y
              } = this.attributes;
              Object(a.setStrokeColor)(this[p], {
                color: t,
                lineCap: b,
                lineJoin: h,
                lineWidth: s,
                lineDash: S,
                lineDashOffset: Y,
                miterLimit: T,
                roundSegments: y
              });
            }
          }
          this[p] && o === "clipPath" && this[p].setClipPath(G), o === "texture" && Object(e.applyTexture)(this, G);
        }
        /* override */
        updateContours() {
          this.path = new c.Figure2D(), this.path.addPath(this.attributes.d), this.attributes.normalize && this.path.normalize(...this.path.boundingCenter);
        }
      }
      W(C, "Attr", u.default), r.default.registerNode(C, "path");
    },
    /* 227 */
    /***/
    function(n, l, i) {
      (function(c, m) {
        n.exports = m();
      })(this, function() {
        var c = /* @__PURE__ */ function() {
          function J(N, x) {
            var R = [], z = !0, Q = !1, P = void 0;
            try {
              for (var D = N[Symbol.iterator](), _; !(z = (_ = D.next()).done) && (R.push(_.value), !(x && R.length === x)); z = !0)
                ;
            } catch (F) {
              Q = !0, P = F;
            } finally {
              try {
                !z && D.return && D.return();
              } finally {
                if (Q)
                  throw P;
              }
            }
            return R;
          }
          return function(N, x) {
            if (Array.isArray(N))
              return N;
            if (Symbol.iterator in Object(N))
              return J(N, x);
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          };
        }(), m = Math.PI * 2, L = function(N, x, R, z, Q, P, D) {
          var _ = N.x, F = N.y;
          _ *= x, F *= R;
          var v = z * _ - Q * F, O = Q * _ + z * F;
          return {
            x: v + P,
            y: O + D
          };
        }, K = function(N, x) {
          var R = 1.3333333333333333 * Math.tan(x / 4), z = Math.cos(N), Q = Math.sin(N), P = Math.cos(N + x), D = Math.sin(N + x);
          return [{
            x: z - Q * R,
            y: Q + z * R
          }, {
            x: P + D * R,
            y: D - P * R
          }, {
            x: P,
            y: D
          }];
        }, u = function(N, x, R, z) {
          var Q = N * z - x * R < 0 ? -1 : 1, P = Math.sqrt(N * N + x * x), D = Math.sqrt(N * N + x * x), _ = N * R + x * z, F = _ / (P * D);
          return F > 1 && (F = 1), F < -1 && (F = -1), Q * Math.acos(F);
        }, a = function(N, x, R, z, Q, P, D, _, F, v, O, li) {
          var ii = Math.pow(Q, 2), ti = Math.pow(P, 2), $ = Math.pow(O, 2), ai = Math.pow(li, 2), Xi = ii * ti - ii * ai - ti * $;
          Xi < 0 && (Xi = 0), Xi /= ii * ai + ti * $, Xi = Math.sqrt(Xi) * (D === _ ? -1 : 1);
          var M = Xi * Q / P * li, k = Xi * -P / Q * O, j = v * M - F * k + (N + R) / 2, A = F * M + v * k + (x + z) / 2, H = (O - M) / Q, U = (li - k) / P, Z = (-O - M) / Q, V = (-li - k) / P, g = u(1, 0, H, U), f = u(H, U, Z, V);
          return _ === 0 && f > 0 && (f -= m), _ === 1 && f < 0 && (f += m), [j, A, g, f];
        }, e = function(N) {
          var x = N.px, R = N.py, z = N.cx, Q = N.cy, P = N.rx, D = N.ry, _ = N.xAxisRotation, F = _ === void 0 ? 0 : _, v = N.largeArcFlag, O = v === void 0 ? 0 : v, li = N.sweepFlag, ii = li === void 0 ? 0 : li, ti = [];
          if (P === 0 || D === 0)
            return [];
          var $ = Math.sin(F * m / 360), ai = Math.cos(F * m / 360), Xi = ai * (x - z) / 2 + $ * (R - Q) / 2, M = -$ * (x - z) / 2 + ai * (R - Q) / 2;
          if (Xi === 0 && M === 0)
            return [];
          P = Math.abs(P), D = Math.abs(D);
          var k = Math.pow(Xi, 2) / Math.pow(P, 2) + Math.pow(M, 2) / Math.pow(D, 2);
          k > 1 && (P *= Math.sqrt(k), D *= Math.sqrt(k));
          var j = a(x, R, z, Q, P, D, O, ii, $, ai, Xi, M), A = c(j, 4), H = A[0], U = A[1], Z = A[2], V = A[3], g = Math.max(Math.ceil(Math.abs(V) / (m / 4)), 1);
          V /= g;
          for (var f = 0; f < g; f++)
            ti.push(K(Z, V)), Z += V;
          return ti.map(function(w) {
            var B = L(w[0], P, D, ai, $, H, U), q = B.x, si = B.y, bi = L(w[1], P, D, ai, $, H, U), mi = bi.x, oi = bi.y, Zi = L(w[2], P, D, ai, $, H, U), ci = Zi.x, ni = Zi.y;
            return { x1: q, y1: si, x2: mi, y2: oi, x: ci, y: ni };
          });
        }, r = {
          a: 7,
          c: 6,
          h: 1,
          l: 2,
          m: 2,
          q: 4,
          s: 4,
          t: 2,
          v: 1,
          z: 0
          /**
           * segment pattern
           * @type {RegExp}
           */
        }, X = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
        function W(J) {
          var N = [];
          return J.replace(X, function(x, R, z) {
            var Q = R.toLowerCase();
            for (z = C(z), Q == "m" && z.length > 2 && (N.push([R].concat(z.splice(0, 2))), Q = "l", R = R == "m" ? "l" : "L"); ; ) {
              if (z.length == r[Q])
                return z.unshift(R), N.push(z);
              if (z.length < r[Q])
                throw new Error("malformed path data");
              N.push([R].concat(z.splice(0, r[Q])));
            }
          }), N;
        }
        var p = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
        function C(J) {
          var N = J.match(p);
          return N ? N.map(Number) : [];
        }
        function I(J) {
          var N = J[0][0], x = J[0][1], R = N, z = x;
          return J.forEach(function(Q) {
            var P = Q[0], D = Q[2], _ = Q[4], F = Q[6], v = Q[1], O = Q[3], li = Q[5], ii = Q[7];
            N = Math.min(N, P, D, _, F), x = Math.min(x, v, O, li, ii), R = Math.max(R, P, D, _, F), z = Math.max(z, v, O, li, ii);
          }), [N, x, R, z];
        }
        function o(J, N) {
          return Math.sqrt(Math.pow(J[0] - N[0], 2) + Math.pow(J[1] - N[1], 2)) + Math.sqrt(Math.pow(J[2] - N[2], 2) + Math.pow(J[3] - N[3], 2));
        }
        function G(J, N) {
          var x = J[0], R = J[2], z = J[4], Q = J[6], P = J[1], D = J[3], _ = J[5], F = J[7], v = N[0], O = N[2], li = N[4], ii = N[6], ti = N[1], $ = N[3], ai = N[5], Xi = N[7];
          return Math.sqrt(Math.pow(v - x, 2) + Math.pow(ti - P, 2)) + Math.sqrt(Math.pow(O - R, 2) + Math.pow($ - D, 2)) + Math.sqrt(Math.pow(li - z, 2) + Math.pow(ai - _, 2)) + Math.sqrt(Math.pow(ii - Q, 2) + Math.pow(Xi - F, 2));
        }
        function d(J, N) {
          var x = s(J.length), R = [];
          x.forEach(function(Q) {
            var P = 0, D = 0;
            Q.forEach(function(_) {
              P += G(J[_], N[D++]);
            }), R.push({ index: Q, distance: P });
          }), R.sort(function(Q, P) {
            return Q.distance - P.distance;
          });
          var z = [];
          return R[0].index.forEach(function(Q) {
            z.push(J[Q]);
          }), z;
        }
        function t(J, N) {
          var x = b(J.length), R = [];
          x.forEach(function(Q) {
            var P = 0;
            Q.forEach(function(D) {
              P += o(I(J[D]), I(N[D]));
            }), R.push({ index: Q, distance: P });
          }), R.sort(function(Q, P) {
            return Q.distance - P.distance;
          });
          var z = [];
          return R[0].index.forEach(function(Q) {
            z.push(J[Q]);
          }), z;
        }
        function s(J) {
          for (var N = [], x = 0; x < J; x++) {
            for (var R = [], z = 0; z < J; z++) {
              var Q = z + x;
              Q > J - 1 && (Q -= J), R[Q] = z;
            }
            N.push(R);
          }
          return N;
        }
        function b(J) {
          for (var N = [], x = 0; x < J; x++)
            N.push(x);
          return h(N);
        }
        function h(J) {
          var N = [], x = [];
          function R(z) {
            var Q, P;
            for (Q = 0; Q < z.length; Q++)
              P = z.splice(Q, 1)[0], x.push(P), z.length == 0 && N.push(x.slice()), R(z), z.splice(Q, 0, P), x.pop();
            return N;
          }
          return R(J);
        }
        var S = {};
        S.parser = W, S.lerpCurve = function(J, N, x) {
          return S.lerpPoints(J[0], J[1], N[0], N[1], x).concat(S.lerpPoints(J[2], J[3], N[2], N[3], x)).concat(S.lerpPoints(J[4], J[5], N[4], N[5], x)).concat(S.lerpPoints(J[6], J[7], N[6], N[7], x));
        }, S.lerpPoints = function(J, N, x, R, z) {
          return [J + (x - J) * z, N + (R - N) * z];
        }, S.q2b = function(J, N, x, R, z, Q) {
          return [J, N, (J + 2 * x) / 3, (N + 2 * R) / 3, (z + 2 * x) / 3, (Q + 2 * R) / 3, z, Q];
        }, S.path2shapes = function(J) {
          for (var N = S.parser(J), x = 0, R = 0, z = 0, Q = N.length, P = [], D = null, _ = void 0, F = void 0, v = void 0, O = void 0, li = void 0, ii = void 0, ti = void 0; z < Q; z++) {
            var $ = N[z], ai = $[0], Xi = N[z - 1];
            switch (ai) {
              case "m":
                li = P.length, P[li] = [], D = P[li], x = x + $[1], R = R + $[2];
                break;
              case "M":
                li = P.length, P[li] = [], D = P[li], x = $[1], R = $[2];
                break;
              case "l":
                D.push([x, R, x, R, x, R, x + $[1], R + $[2]]), x += $[1], R += $[2];
                break;
              case "L":
                D.push([x, R, $[1], $[2], $[1], $[2], $[1], $[2]]), x = $[1], R = $[2];
                break;
              case "h":
                D.push([x, R, x, R, x, R, x + $[1], R]), x += $[1];
                break;
              case "H":
                D.push([x, R, $[1], R, $[1], R, $[1], R]), x = $[1];
                break;
              case "v":
                D.push([x, R, x, R, x, R, x, R + $[1]]), R += $[1];
                break;
              case "V":
                D.push([x, R, x, $[1], x, $[1], x, $[1]]), R = $[1];
                break;
              case "C":
                D.push([x, R, $[1], $[2], $[3], $[4], $[5], $[6]]), x = $[5], R = $[6];
                break;
              case "S":
                Xi[0] === "C" || Xi[0] === "c" ? D.push([x, R, x + Xi[5] - Xi[3], R + Xi[6] - Xi[4], $[1], $[2], $[3], $[4]]) : (Xi[0] === "S" || Xi[0] === "s") && D.push([x, R, x + Xi[3] - Xi[1], R + Xi[4] - Xi[2], $[1], $[2], $[3], $[4]]), x = $[3], R = $[4];
                break;
              case "c":
                D.push([x, R, x + $[1], R + $[2], x + $[3], R + $[4], x + $[5], R + $[6]]), x = x + $[5], R = R + $[6];
                break;
              case "s":
                Xi[0] === "C" || Xi[0] === "c" ? D.push([x, R, x + Xi[5] - Xi[3], R + Xi[6] - Xi[4], x + $[1], R + $[2], x + $[3], R + $[4]]) : (Xi[0] === "S" || Xi[0] === "s") && D.push([x, R, x + Xi[3] - Xi[1], R + Xi[4] - Xi[2], x + $[1], R + $[2], x + $[3], R + $[4]]), x = x + $[3], R = R + $[4];
                break;
              case "a":
                ii = e({
                  rx: $[1],
                  ry: $[2],
                  px: x,
                  py: R,
                  xAxisRotation: $[3],
                  largeArcFlag: $[4],
                  sweepFlag: $[5],
                  cx: x + $[6],
                  cy: R + $[7]
                }), ti = ii[ii.length - 1], ii.forEach(function(M, k) {
                  k === 0 ? D.push([x, R, M.x1, M.y1, M.x2, M.y2, M.x, M.y]) : D.push([ii[k - 1].x, ii[k - 1].y, M.x1, M.y1, M.x2, M.y2, M.x, M.y]);
                }), x = ti.x, R = ti.y;
                break;
              case "A":
                ii = e({
                  rx: $[1],
                  ry: $[2],
                  px: x,
                  py: R,
                  xAxisRotation: $[3],
                  largeArcFlag: $[4],
                  sweepFlag: $[5],
                  cx: $[6],
                  cy: $[7]
                }), ti = ii[ii.length - 1], ii.forEach(function(M, k) {
                  k === 0 ? D.push([x, R, M.x1, M.y1, M.x2, M.y2, M.x, M.y]) : D.push([ii[k - 1].x, ii[k - 1].y, M.x1, M.y1, M.x2, M.y2, M.x, M.y]);
                }), x = ti.x, R = ti.y;
                break;
              case "Q":
                D.push(S.q2b(x, R, $[1], $[2], $[3], $[4])), x = $[3], R = $[4];
                break;
              case "q":
                D.push(S.q2b(x, R, x + $[1], R + $[2], $[3] + x, $[4] + R)), x += $[3], R += $[4];
                break;
              case "T":
                Xi[0] === "Q" || Xi[0] === "q" ? (v = x + Xi[3] - Xi[1], O = R + Xi[4] - Xi[2], D.push(S.q2b(x, R, v, O, $[1], $[2]))) : (Xi[0] === "T" || Xi[0] === "t") && (D.push(S.q2b(x, R, x + x - v, R + R - O, $[1], $[2])), v = x + x - v, O = R + R - O), x = $[1], R = $[2];
                break;
              case "t":
                Xi[0] === "Q" || Xi[0] === "q" ? (v = x + Xi[3] - Xi[1], O = R + Xi[4] - Xi[2], D.push(S.q2b(x, R, v, O, x + $[1], R + $[2]))) : (Xi[0] === "T" || Xi[0] === "t") && (D.push(S.q2b(x, R, x + x - v, R + R - O, x + $[1], R + $[2])), v = x + x - v, O = R + R - O), x += $[1], R += $[2];
                break;
              case "Z":
                _ = D[0][0], F = D[0][1], D.push([x, R, _, F, _, F, _, F]);
                break;
              case "z":
                _ = D[0][0], F = D[0][1], D.push([x, R, _, F, _, F, _, F]);
                break;
            }
          }
          return P;
        }, S._upCurves = function(J, N) {
          for (var x = 0, R = 0, z = J.length; x < N; x++)
            J.push(J[R].slice(0)), R++, R > z - 1 && (R -= z);
        };
        function Y(J, N, x, R, z, Q, P, D, _) {
          return {
            left: T(J, N, x, R, z, Q, P, D, _),
            right: T(P, D, z, Q, x, R, J, N, 1 - _, !0)
          };
        }
        function T(J, N, x, R, z, Q, P, D, _, F) {
          var v = (x - J) * _ + J, O = (R - N) * _ + N, li = (z - x) * _ + x, ii = (Q - R) * _ + R, ti = (P - z) * _ + z, $ = (D - Q) * _ + Q, ai = (li - v) * _ + v, Xi = (ii - O) * _ + O, M = (ti - li) * _ + li, k = ($ - ii) * _ + ii, j = (M - ai) * _ + ai, A = (k - Xi) * _ + Xi;
          return F ? [j, A, ai, Xi, v, O, J, N] : [J, N, v, O, ai, Xi, j, A];
        }
        S._splitCurves = function(J, N) {
          for (var x = 0, R = 0; x < N; x++) {
            var z = J[R], Q = Y(z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7], 0.5);
            J.splice(R, 1), J.splice(R, 0, Q.left, Q.right), R += 2, R >= J.length - 1 && (R = 0);
          }
        };
        function y(J, N) {
          for (var x = function(Q) {
            var P = J[J.length - 1], D = [];
            P.forEach(function(_) {
              D.push(_.slice(0));
            }), J.push(D);
          }, R = 0; R < N; R++)
            x();
        }
        return S.lerp = function(J, N, x) {
          return S._lerp(S.path2shapes(J), S.path2shapes(N), x);
        }, S.MIM_CURVES_COUNT = 100, S._preprocessing = function(J, N) {
          var x = J.length, R = N.length, z = JSON.parse(JSON.stringify(J)), Q = JSON.parse(JSON.stringify(N));
          return x > R ? y(Q, x - R) : x < R && y(z, R - x), z = t(z, Q), z.forEach(function(P, D) {
            var _ = P.length, F = Q[D].length;
            _ > F ? _ < S.MIM_CURVES_COUNT ? (S._splitCurves(P, S.MIM_CURVES_COUNT - _), S._splitCurves(Q[D], S.MIM_CURVES_COUNT - F)) : S._splitCurves(Q[D], _ - F) : _ < F && (F < S.MIM_CURVES_COUNT ? (S._splitCurves(P, S.MIM_CURVES_COUNT - _), S._splitCurves(Q[D], S.MIM_CURVES_COUNT - F)) : S._splitCurves(P, F - _));
          }), z.forEach(function(P, D) {
            z[D] = d(P, Q[D]);
          }), [z, Q];
        }, S._lerp = function(J, N, x) {
          var R = [];
          return J.forEach(function(z, Q) {
            var P = [];
            z.forEach(function(D, _) {
              P.push(S.lerpCurve(D, N[Q][_], x));
            }), R.push(P);
          }), R;
        }, S.animate = function(J) {
          var N = S.path2shapes(J.from), x = S.path2shapes(J.to), R = S._preprocessing(N, x), z = /* @__PURE__ */ new Date(), Q = J.end || function() {
          }, P = J.progress || function() {
          }, D = J.begin || function() {
          }, _ = J.easing || function(ii) {
            return ii;
          }, F = null, v = null, O = J.time;
          D(N);
          var li = function ii() {
            var ti = /* @__PURE__ */ new Date() - z;
            if (ti >= O) {
              v = x, P(v, 1), Q(v), cancelAnimationFrame(F);
              return;
            }
            var $ = _(ti / O);
            v = S._lerp(R[0], R[1], $), P(v, $), F = requestAnimationFrame(ii);
          };
          li();
        }, S;
      });
    },
    /* 228 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(71), m = i(221), L = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const K = Symbol.for("spritejs_setAttributeDefault"), u = Symbol.for("spritejs_setAttribute"), a = Symbol.for("spritejs_getAttribute");
      class e extends c.default {
        constructor(X) {
          super(X), this[K]({
            d: "",
            normalize: !1,
            fillColor: void 0,
            fillRule: "nonzero",
            strokeColor: void 0,
            lineWidth: 1,
            lineJoin: "miter",
            // 'miter' or 'bevel' or 'round'
            lineCap: "butt",
            // 'butt' or 'square' or 'round'
            roundSegments: 20,
            // default roundSegment if lineJoin or lineCap is round
            lineDash: void 0,
            lineDashOffset: 0,
            miterLimit: 10,
            texture: void 0,
            textureRect: void 0,
            textureRepeat: !1,
            sourceRect: void 0,
            clipPath: void 0
          });
        }
        get d() {
          return this[a]("d");
        }
        set d(X) {
          this[u]("d", X);
        }
        get normalize() {
          return this[a]("normalize");
        }
        set normalize(X) {
          this[u]("normalize", !!X);
        }
        get fillColor() {
          return this[a]("fillColor");
        }
        set fillColor(X) {
          this[u]("fillColor", Object(m.parseColor)(X));
        }
        get fillRule() {
          return this[a]("fillRule");
        }
        set fillRule(X) {
          if (X != null && X !== "nonzero" && X !== "evenodd")
            throw new TypeError("Invalid fill rule.");
          this[u]("fillRule", X);
        }
        get strokeColor() {
          return this[a]("strokeColor");
        }
        set strokeColor(X) {
          this[u]("strokeColor", Object(m.parseColor)(X));
        }
        get lineWidth() {
          return this[a]("lineWidth");
        }
        set lineWidth(X) {
          this[u]("lineWidth", Object(L.toNumber)(X));
        }
        get lineJoin() {
          return this[a]("lineJoin");
        }
        set lineJoin(X) {
          if (X != null && X !== "miter" && X !== "bevel" && X !== "round")
            throw new TypeError("Invalid lineJoin type.");
          this[u]("lineJoin", X);
        }
        get lineCap() {
          return this[a]("lineCap");
        }
        set lineCap(X) {
          if (X != null && X !== "butt" && X !== "square" && X !== "round")
            throw new TypeError("Invalid lineCap type.");
          this[u]("lineCap", X);
        }
        get lineDash() {
          return this[a]("lineDash");
        }
        set lineDash(X) {
          X = Object(L.toArray)(X, !0), X != null && !Array.isArray(X) && (X = [X]), this[u]("lineDash", X ? X.map(L.toNumber) : null);
        }
        get lineDashOffset() {
          return this[a]("lineDashOffset");
        }
        set lineDashOffset(X) {
          this[u]("lineDashOffset", Object(L.toNumber)(X));
        }
        get miterLimit() {
          return this[a]("miterLimit");
        }
        set miterLimit(X) {
          this[u]("miterLimit", Object(L.toNumber)(X));
        }
        get roundSegments() {
          return this[a]("roundSegments");
        }
        set roundSegments(X) {
          this[u]("roundSegments", X);
        }
        get texture() {
          return this[a]("texture");
        }
        set texture(X) {
          this[u]("texture", X);
        }
        get textureRect() {
          return this[a]("textureRect");
        }
        set textureRect(X) {
          this[u]("textureRect", X);
        }
        get sourceRect() {
          return this[a]("sourceRect");
        }
        set sourceRect(X) {
          this[u]("sourceRect", X);
        }
        get textureRepeat() {
          return this[a]("textureRepeat");
        }
        set textureRepeat(X) {
          this[u]("textureRepeat", !!X);
        }
        get clipPath() {
          return this[a]("clipPath");
        }
        set clipPath(X) {
          this[u]("clipPath", X);
        }
      }
    },
    /* 229 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(226), m = i(213), L = i(230);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
        /* override */
        get isVisible() {
          const {
            width: e,
            height: r
          } = this.attributes;
          return e > 0 && r > 0 && super.isVisible;
        }
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "rect");
    },
    /* 230 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return r;
      });
      var c = i(228), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = Symbol.for("spritejs_setAttributeDefault"), K = Symbol.for("spritejs_setAttribute"), u = Symbol.for("spritejs_getAttribute"), a = Symbol.for("spritejs_declareAlias");
      function e(X) {
        const {
          width: W,
          height: p
        } = X;
        return `M0 0L${W} 0L${W} ${p}L0 ${p}Z`;
      }
      class r extends c.default {
        constructor(W) {
          super(W), this[L]({
            width: 0,
            height: 0
            /* size */
          }), this[a]("size");
        }
        // readonly
        get d() {
          return this[u]("d");
        }
        set d(W) {
        }
        // eslint-disable-line no-empty-function
        get width() {
          return this[u]("width");
        }
        set width(W) {
          if (W = Object(m.toNumber)(W), this[K]("width", W)) {
            const p = e(this);
            this[K]("d", p);
          }
        }
        get height() {
          return this[u]("height");
        }
        set height(W) {
          if (W = Object(m.toNumber)(W), this[K]("height", W)) {
            const p = e(this);
            this[K]("d", p);
          }
        }
        get size() {
          return [this.width, this.height];
        }
        set size(W) {
          W = Object(m.toArray)(W), Array.isArray(W) || (W = [W, W]), this.width = W[0], this.height = W[1];
        }
      }
    },
    /* 231 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(232), m = i(213), L = i(235);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
        get isVisible() {
          const {
            sides: e
          } = this.attributes;
          return e[0] > 0 && e[1] > 0 && super.isVisible;
        }
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "triangle");
    },
    /* 232 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(226), m = i(213), L = i(233);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
        /* override */
        get isVisible() {
          const {
            points: e
          } = this.attributes;
          return e.length > 0 && super.isVisible;
        }
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "polyline");
    },
    /* 233 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return X;
      });
      var c = i(228), m = i(72), L = i(234);
      i(1).glMatrix.setMatrixArrayType(Array);
      const K = Symbol.for("spritejs_setAttributeDefault"), u = Symbol.for("spritejs_setAttribute"), a = Symbol.for("spritejs_getAttribute"), e = Symbol.for("spritejs_declareAlias");
      function r(W) {
        const {
          points: p,
          smooth: C,
          smoothRange: I,
          close: o
        } = W, G = [];
        for (let t = 0; t < p.length; t += 2)
          G.push([p[t], p[t + 1]]);
        let d = "";
        return C ? d = Object(L.makeSmoothCurveLine)(G, I) : G.length && (d = `M${G.map((t) => t.join(" ")).join("L")}`), d && o && (d += "Z"), d;
      }
      class X extends c.default {
        constructor(p) {
          super(p), this[K]({
            points: [],
            smooth: !1,
            smoothRange: [0],
            closeType: "none"
            // none | normal
            /* close */
          }), this[e]("close");
        }
        // readonly
        get d() {
          return this[a]("d");
        }
        set d(p) {
        }
        // eslint-disable-line no-empty-function
        get close() {
          return this.closeType !== "none";
        }
        set close(p) {
          p = p ? "normal" : "none", this.closeType = p;
        }
        get closeType() {
          return this[a]("closeType");
        }
        set closeType(p) {
          if (p != null && p !== "none" && p !== "normal")
            throw new TypeError("Invalid closeType type.");
          if (this[u]("closeType", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get smooth() {
          return this[a]("smooth");
        }
        set smooth(p) {
          if (this[u]("smooth", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get smoothRange() {
          return this[a]("smoothRange");
        }
        set smoothRange(p) {
          if (p && !Array.isArray(p) && (p = [p]), this[u]("smoothRange", p) && this.smooth) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get points() {
          return this[a]("points");
        }
        set points(p) {
          if (p = Object(m.toArray)(p), Array.isArray(p) && (p = p.reduce((C, I) => Array.isArray(I) ? [...C, ...I.map((o) => Object(m.toNumber)(o))] : [...C, Object(m.toNumber)(I)], [])), this[u]("points", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
      }
    },
    /* 234 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "makeSmoothCurveLine", function() {
        return c;
      }), i(1).glMatrix.setMatrixArrayType(Array);
      function c(m, L = [0]) {
        function K(e, r = 0.168, X = 0.168) {
          let W, p, C, I;
          if ((m[e].x === m[e + 1].x || m[e].y === m[e + 1].y) && (r = 0, X = 0), e < 1 ? (W = m[0].x + (m[1].x - m[0].x) * r, p = m[0].y + (m[1].y - m[0].y) * r) : (W = m[e].x + (m[e + 1].x - m[e - 1].x) * r, p = m[e].y + (m[e + 1].y - m[e - 1].y) * r), e > m.length - 3) {
            const o = m.length - 1;
            C = m[o].x - (m[o].x - m[o - 1].x) * X, I = m[o].y - (m[o].y - m[o - 1].y) * X;
          } else
            C = m[e + 1].x - (m[e + 2].x - m[e].x) * X, I = m[e + 1].y - (m[e + 2].y - m[e].y) * X;
          return [{
            x: W,
            y: p
          }, {
            x: C,
            y: I
          }];
        }
        m = m.map(([e, r]) => ({
          x: e,
          y: r
        }));
        let u = "", a = 0;
        return m.forEach((e, r) => {
          if (r === 0)
            u += `M${e.x} ${e.y}`;
          else {
            for (; r > L[a]; )
              a++;
            if (a % 2) {
              const [X, W] = K(r - 1);
              u += `C${[X.x, X.y, W.x, W.y, e.x, e.y].join(" ")}`;
            } else
              u += `L${e.x} ${e.y}`;
          }
        }), u;
      }
    },
    /* 235 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(233), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = Symbol.for("spritejs_setAttributeDefault"), K = Symbol.for("spritejs_setAttribute"), u = Symbol.for("spritejs_getAttribute");
      function a(r) {
        const [X, W] = r.sides;
        let p = r.angle % 360;
        return p < 0 && (p += 360), p = Math.PI * p / 180, [0, 0, X, 0, W * Math.cos(p), W * Math.sin(p)];
      }
      class e extends c.default {
        constructor(X) {
          super(X), this[L]({
            sides: [0, 0],
            angle: 60,
            closeType: "normal"
          });
        }
        // readonly
        get points() {
          return super.points;
        }
        set points(X) {
        }
        // eslint-disable-line no-empty-function
        get sides() {
          return this[u]("sides");
        }
        set sides(X) {
          if (X = Object(m.toArray)(X, !0), X != null && !Array.isArray(X) && (X = [X, X]), this[K]("sides", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get angle() {
          return this[u]("angle");
        }
        set angle(X) {
          if (X = Object(m.toNumber)(X), this[K]("angle", X)) {
            const W = a(this);
            super.points = W;
          }
        }
      }
    },
    /* 236 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(232), m = i(213), L = i(237);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
        /* override */
        get isVisible() {
          const {
            sides: e
          } = this.attributes;
          return e[0] > 0 && e[1] > 0 && super.isVisible;
        }
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "parallel");
    },
    /* 237 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(233), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = Symbol.for("spritejs_setAttributeDefault"), K = Symbol.for("spritejs_setAttribute"), u = Symbol.for("spritejs_getAttribute");
      function a(r) {
        const [X, W] = r.sides;
        let p = r.angle % 360;
        p < 0 && (p += 360), p = Math.PI * p / 180;
        const C = W * Math.cos(p), I = W * Math.sin(p);
        return [0, 0, X, 0, C + X, I, C, I];
      }
      class e extends c.default {
        constructor(X) {
          super(X), this[L]({
            sides: [0, 0],
            angle: 90,
            closeType: "normal"
          });
        }
        // readonly
        get points() {
          return super.points;
        }
        set points(X) {
        }
        // eslint-disable-line no-empty-function
        get sides() {
          return this[u]("sides");
        }
        set sides(X) {
          if (X = Object(m.toArray)(X, !0), X != null && !Array.isArray(X) && (X = [X, X]), this[K]("sides", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get angle() {
          return this[u]("angle");
        }
        set angle(X) {
          if (X = Object(m.toNumber)(X), this[K]("angle", X)) {
            const W = a(this);
            super.points = W;
          }
        }
      }
    },
    /* 238 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(232), m = i(213), L = i(239);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "regular");
    },
    /* 239 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(233), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = Symbol.for("spritejs_setAttributeDefault"), K = Symbol.for("spritejs_setAttribute"), u = Symbol.for("spritejs_getAttribute");
      function a(r) {
        const {
          edges: X,
          radius: W,
          offsetAngle: p
        } = r, C = Math.PI * p / 180 - 0.5 * Math.PI;
        if (X < 3 || W <= 0)
          return [];
        const I = [];
        for (let o = 0; o < X; o++) {
          const G = o * 2 * Math.PI / X + C, d = W * Math.cos(G), t = W * Math.sin(G);
          I.push(d, t);
        }
        return I;
      }
      class e extends c.default {
        constructor(X) {
          super(X), this[L]({
            edges: 3,
            radius: 0,
            offsetAngle: 0,
            closeType: "normal"
          });
        }
        // readonly
        get points() {
          return super.points;
        }
        set points(X) {
        }
        // eslint-disable-line no-empty-function
        get edges() {
          return this[u]("edges");
        }
        set edges(X) {
          if (X = Object(m.toNumber)(X), this[K]("edges", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get radius() {
          return this[u]("radius");
        }
        set radius(X) {
          if (X = Object(m.toNumber)(X), this[K]("radius", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get offsetAngle() {
          return this[u]("offsetAngle");
        }
        set offsetAngle(X) {
          if (X = Object(m.toNumber)(X), this[K]("offsetAngle", X)) {
            const W = a(this);
            super.points = W;
          }
        }
      }
    },
    /* 240 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(232), m = i(213), L = i(241);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "star");
    },
    /* 241 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return e;
      });
      var c = i(233), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = Symbol.for("spritejs_setAttributeDefault"), K = Symbol.for("spritejs_setAttribute"), u = Symbol.for("spritejs_getAttribute");
      function a(r) {
        const {
          angles: X,
          innerRadius: W,
          outerRadius: p,
          offsetAngle: C
        } = r, I = Math.PI * C / 180 - 0.5 * Math.PI;
        if (X < 3 || W <= 0 || p <= 0)
          return [];
        const o = [];
        for (let G = 0; G < X * 2; G++) {
          const d = G * Math.PI / X + I, t = G % 2 ? W : p, s = t * Math.cos(d), b = t * Math.sin(d);
          o.push(s, b);
        }
        return o;
      }
      class e extends c.default {
        constructor(X) {
          super(X), this[L]({
            angles: 5,
            innerRadius: 0,
            outerRadius: 0,
            /* radius */
            offsetAngle: 0,
            closeType: "normal"
          });
        }
        // readonly
        get points() {
          return super.points;
        }
        set points(X) {
        }
        // eslint-disable-line no-empty-function
        get angles() {
          return this[u]("angles");
        }
        set angles(X) {
          if (X = Object(m.toNumber)(X), this[K]("angles", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get innerRadius() {
          return this[u]("innerRadius");
        }
        set innerRadius(X) {
          if (X = Object(m.toNumber)(X), this[K]("innerRadius", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get outerRadius() {
          return this[u]("outerRadius");
        }
        set outerRadius(X) {
          if (X = Object(m.toNumber)(X), this[K]("outerRadius", X)) {
            const W = a(this);
            super.points = W;
          }
        }
        get radius() {
          return [this.innerRadius, this.outerRadius];
        }
        set radius(X) {
          X = Object(m.toArray)(X, !0), Array.isArray(X) || (X = [X, X]), this.innerRadius = X[0], this.outerRadius = X[1];
        }
        get offsetAngle() {
          return this[u]("offsetAngle");
        }
        set offsetAngle(X) {
          if (X = Object(m.toNumber)(X), this[K]("offsetAngle", X)) {
            const W = a(this);
            super.points = W;
          }
        }
      }
    },
    /* 242 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(226), m = i(213), L = i(243);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
        /* override */
        get isVisible() {
          const {
            radiusX: e,
            radiusY: r,
            startAngle: X,
            endAngle: W
          } = this.attributes;
          return e > 0 && r > 0 && X !== W && super.isVisible;
        }
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "ellipse");
    },
    /* 243 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return X;
      });
      var c = i(12), m = i(228), L = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const K = Symbol.for("spritejs_setAttributeDefault"), u = Symbol.for("spritejs_setAttribute"), a = Symbol.for("spritejs_getAttribute"), e = Symbol.for("spritejs_declareAlias");
      function r(W) {
        const {
          radiusX: p,
          radiusY: C,
          startAngle: I,
          endAngle: o,
          direction: G,
          closeType: d
        } = W, t = G === "anitclockwise", s = new c.Figure2D();
        return d === "sector" && s.moveTo(0, 0), s.ellipse(0, 0, p, C, 0, Math.PI * I / 180, Math.PI * o / 180, t), d !== "none" && s.closePath(), s.path.reduce((S, Y) => S + Y.join(" "), "");
      }
      class X extends m.default {
        constructor(p) {
          super(p), this[K]({
            radiusX: 0,
            radiusY: 0,
            /* radius */
            startAngle: 0,
            endAngle: 360,
            /* angle */
            direction: "clockwise",
            // clockwise | anticlockwise
            closeType: "none"
            // none | sector | normal
          }), this[e]("radius", "angle");
        }
        // readonly
        get d() {
          return this[a]("d");
        }
        set d(p) {
        }
        // eslint-disable-line no-empty-function
        get radiusX() {
          return this[a]("radiusX");
        }
        set radiusX(p) {
          if (p = Object(L.toNumber)(p), this[u]("radiusX", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get radiusY() {
          return this[a]("radiusY");
        }
        set radiusY(p) {
          if (p = Object(L.toNumber)(p), this[u]("radiusY", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get radius() {
          return [this.radiusX, this.radiusY];
        }
        set radius(p) {
          p = Object(L.toArray)(p, !0), Array.isArray(p) || (p = [p, p]), this.radiusX = p[0], this.radiusY = p[1];
        }
        get angle() {
          return [this.startAngle, this.endAngle];
        }
        set angle(p) {
          p = Object(L.toArray)(p), Array.isArray(p) || (p = [p, p]), this.startAngle = p[0], this.endAngle = p[1];
        }
        get direction() {
          return this[a]("direction");
        }
        set direction(p) {
          if (p != null && p !== "clockwise" && p !== "anticlockwise")
            throw new TypeError("Invalid direction type.");
          this[u]("direction", p);
        }
        get startAngle() {
          return this[a]("startAngle");
        }
        set startAngle(p) {
          if (p = Object(L.toNumber)(p), this[u]("startAngle", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get endAngle() {
          return this[a]("endAngle");
        }
        set endAngle(p) {
          if (p = Object(L.toNumber)(p), this[u]("endAngle", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get closeType() {
          return this[a]("closeType");
        }
        set closeType(p) {
          if (p != null && p !== "none" && p !== "sector" && p !== "normal")
            throw new TypeError("Invalid closeType type.");
          if (this[u]("closeType", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
      }
    },
    /* 244 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(242), m = i(213), L = i(245);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "arc");
    },
    /* 245 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return L;
      });
      var c = i(243), m = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      class L extends c.default {
        get radius() {
          return super.radiusX;
        }
        set radius(u) {
          u = Object(m.toNumber)(u), super.radiusX = u, super.radiusY = u;
        }
      }
    },
    /* 246 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(226), m = i(213), L = i(247);
      i(1).glMatrix.setMatrixArrayType(Array);
      function K(a, e, r) {
        return e in a ? Object.defineProperty(a, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : a[e] = r, a;
      }
      class u extends c.default {
        /* override */
        get isVisible() {
          const {
            innerRadius: e,
            outerRadius: r,
            startAngle: X,
            endAngle: W
          } = this.attributes;
          return (e > 0 || r > 0) && X !== W && super.isVisible;
        }
      }
      K(u, "Attr", L.default), m.default.registerNode(u, "ring");
    },
    /* 247 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return X;
      });
      var c = i(12), m = i(228), L = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      const K = Symbol.for("spritejs_setAttributeDefault"), u = Symbol.for("spritejs_setAttribute"), a = Symbol.for("spritejs_getAttribute"), e = Symbol.for("spritejs_declareAlias");
      function r(W) {
        let {
          innerRadius: p,
          outerRadius: C,
          startAngle: I,
          endAngle: o
        } = W;
        const G = new c.Figure2D();
        if (I = Math.PI * I / 180, o = Math.PI * o / 180, p > C && ([p, C] = [C, p]), p <= 0 && G.moveTo(0, 0), G.arc(0, 0, C, I, o, !1), p > 0) {
          const s = Math.PI * 2;
          o < I && (o = I + s + (o - I) % s), o - I >= s && (o = I + s - 1e-6), G.arc(0, 0, p, o, I, !0);
        }
        return G.closePath(), G.path.reduce((s, b) => s + b.join(" "), "");
      }
      class X extends m.default {
        constructor(p) {
          super(p), this[K]({
            innerRadius: 0,
            outerRadius: 0,
            /* radius */
            startAngle: 0,
            endAngle: 360
            /* angle */
          }), this[e]("radius", "angle");
        }
        // readonly
        get d() {
          return this[a]("d");
        }
        set d(p) {
        }
        // eslint-disable-line no-empty-function
        get innerRadius() {
          return this[a]("innerRadius");
        }
        set innerRadius(p) {
          if (p = Object(L.toNumber)(p), this[u]("innerRadius", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get outerRadius() {
          return this[a]("outerRadius");
        }
        set outerRadius(p) {
          if (p = Object(L.toNumber)(p), this[u]("outerRadius", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get radius() {
          return [this.innerRadius, this.outerRadius];
        }
        set radius(p) {
          p = Object(L.toArray)(p, !0), Array.isArray(p) || (p = [p, p]), this.innerRadius = p[0], this.outerRadius = p[1];
        }
        get startAngle() {
          return this[a]("startAngle");
        }
        set startAngle(p) {
          if (p = Object(L.toNumber)(p), this[u]("startAngle", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get endAngle() {
          return this[a]("endAngle");
        }
        set endAngle(p) {
          if (p = Object(L.toNumber)(p), this[u]("endAngle", p)) {
            const C = r(this);
            this[u]("d", C);
          }
        }
        get angle() {
          return [this.startAngle, this.endAngle];
        }
        set angle(p) {
          p = Object(L.toArray)(p), Array.isArray(p) || (p = [p, p]), this.startAngle = p[0], this.endAngle = p[1];
        }
      }
    },
    /* 248 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return C;
      });
      var c = i(12), m = i(218), L = i(219), K = i(249), u = i(213);
      i(1).glMatrix.setMatrixArrayType(Array);
      function a(I, o, G) {
        return o in I ? Object.defineProperty(I, o, { value: G, enumerable: !0, configurable: !0, writable: !0 }) : I[o] = G, I;
      }
      const e = Symbol("textImage"), r = Symbol("textImageTask"), X = Symbol("textureContext"), W = Symbol("updateTextureRect"), p = Symbol("textCanvas");
      class C extends L.default {
        constructor(o = {}) {
          typeof o == "string" && (o = {
            text: o
          }), super(o);
        }
        /* override */
        get contentSize() {
          let [o, G] = super.contentSize;
          const {
            width: d,
            height: t
          } = this.attributes;
          if (d == null || t == null) {
            const s = this[e];
            s && (d == null && (o = s.rect[2]), t == null && (G = s.rect[3]));
          }
          return [o, G];
        }
        get text() {
          return this.attributes.text;
        }
        set text(o) {
          this.attributes.text = o;
        }
        get textContent() {
          return this.attributes.text;
        }
        set textContent(o) {
          this.attributes.text = o;
        }
        get textImage() {
          return this[e] || {};
        }
        get textImageReady() {
          return this[r] || Promise.resolve();
        }
        /* override */
        draw(o) {
          super.draw(o);
          const G = this.mesh;
          if (G) {
            const d = this[e];
            if (d) {
              let t = G.texture;
              if (!t || this[X] && this[X] !== this.renderer || d.needsUpdate ? (d.needsUpdate = !1, Object(m.deleteTexture)(d.image, this.renderer), t = Object(m.createTexture)(d.image, this.renderer), this[W] = !0) : t = G.uniforms.u_texSampler, this[W]) {
                const [s, b] = d.rect.slice(2), [h, S] = this.contentSize, Y = this.attributes.textAlign, T = this.attributes.verticalAlign;
                let y = 0;
                Y === "center" ? y = (h - s) / 2 : (Y === "right" || Y === "end") && (y = h - s);
                const J = this.attributes.fontSize, N = this.attributes.lineHeight;
                let x = 0;
                T === "top" ? x = (J - N) / 2 : T === "bottom" && (x = (N - J) / 2);
                const {
                  paddingLeft: R,
                  paddingTop: z
                } = this.attributes, {
                  borderWidth: Q
                } = this.attributes;
                y += R + Q, x += z + Q;
                const {
                  anchorX: P,
                  anchorY: D
                } = this.attributes;
                y -= this.offsetSize[0] * P, x -= this.offsetSize[1] * D, G.setTexture(t, {
                  rect: [y, x, s, b]
                }), this[W] = !1, this[X] = this.renderer;
              }
            }
          }
          return o;
        }
        /* override */
        onPropertyChange(o, G, d) {
          o === "text" || o === "fontSize" || o === "fontFamily" || o === "fontStyle" || o === "fontVariant" || o === "fontWeight" || o === "fontStretch" || o === "lineHeight" || o === "strokeColor" || o === "fillColor" || o === "strokeWidth" ? this.updateText() : ((o === "textAlign" || o === "verticalAlign") && (this[W] = !0), super.onPropertyChange(o, G, d));
        }
        /* override */
        updateContours() {
          super.updateContours(), this[W] = !0;
        }
        updateText() {
          this[r] || (this[r] = Promise.resolve().then(() => {
            this[r] = null;
            const {
              text: o,
              font: G,
              fillColor: d,
              strokeColor: t,
              strokeWidth: s
            } = this.attributes, b = this.layer ? this.layer.displayRatio : 1;
            return this[p] = this[p] || c.ENV.createCanvas(1, 1), this[e] = c.ENV.createText(o, {
              font: G,
              fillColor: d,
              strokeColor: t,
              strokeWidth: s,
              parseFont: c.parseFont,
              ratio: b,
              textCanvas: this[p]
            }), this[e].needsUpdate = !0, this.updateContours(), this.forceUpdate(), this[e];
          }));
        }
      }
      a(C, "Attr", K.default), u.default.registerNode(C, "label");
    },
    /* 249 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return X;
      });
      var c = i(12), m = i(72), L = i(221), K = i(220);
      i(1).glMatrix.setMatrixArrayType(Array);
      const u = Symbol.for("spritejs_setAttributeDefault"), a = Symbol.for("spritejs_setAttribute"), e = Symbol.for("spritejs_getAttribute"), r = Symbol.for("spritejs_declareAlias");
      class X extends K.default {
        constructor(p) {
          super(p), this[u]({
            text: "",
            fontSize: 16,
            fontFamily: "Helvetica,Arial,sans-serif",
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            fontStretch: "normal",
            lineHeight: "",
            /* font */
            textAlign: "left",
            strokeColor: void 0,
            strokeWidth: 1,
            fillColor: void 0,
            verticalAlign: "middle"
          }), this[r]("font");
        }
        get text() {
          return this[e]("text") || " ";
        }
        set text(p) {
          this[a]("text", p);
        }
        get fontSize() {
          return this[e]("fontSize");
        }
        set fontSize(p) {
          this[a]("fontSize", Object(m.toNumber)(p));
        }
        get fontFamily() {
          return this[e]("fontFamily");
        }
        set fontFamily(p) {
          this[a]("fontFamily", p);
        }
        get fontStyle() {
          return this[e]("fontStyle");
        }
        set fontStyle(p) {
          this[a]("fontStyle", p);
        }
        get fontVariant() {
          return this[e]("fontVariant");
        }
        set fontVariant(p) {
          this[a]("fontVariant", p);
        }
        get fontWeight() {
          return this[e]("fontWeight");
        }
        set fontWeight(p) {
          this[a]("fontWeight", p);
        }
        get fontStretch() {
          return this[e]("fontStretch");
        }
        set fontStretch(p) {
          this[a]("fontStretch", p);
        }
        get lineHeight() {
          return this[e]("lineHeight") || this.fontSize;
        }
        set lineHeight(p) {
          this[a]("lineHeight", Object(m.toNumber)(p));
        }
        get textAlign() {
          return this[e]("textAlign");
        }
        set textAlign(p) {
          this[a]("textAlign", p);
        }
        get strokeColor() {
          return this[e]("strokeColor");
        }
        set strokeColor(p) {
          this[a]("strokeColor", Object(L.parseColor)(p));
        }
        get strokeWidth() {
          return this[e]("strokeWidth");
        }
        set strokeWidth(p) {
          this[a]("strokeWidth", Object(m.toNumber)(p));
        }
        get verticalAlign() {
          return this[e]("verticalAlign");
        }
        set verticalAlign(p) {
          this[a]("verticalAlign", p);
        }
        get fillColor() {
          return this[e]("fillColor");
        }
        set fillColor(p) {
          this[a]("fillColor", Object(L.parseColor)(p));
        }
        get font() {
          const {
            fontStyle: p,
            fontVariant: C,
            fontWeight: I,
            fontStretch: o,
            fontSize: G,
            lineHeight: d,
            fontFamily: t
          } = this;
          return `${p} ${C} ${I} ${o} ${G}px/${d}px ${t}`;
        }
        set font(p) {
          if (p == null)
            this.fontStyle = null, this.fontVariant = null, this.fontWeight = null, this.fontStretch = null, this.fontSize = null, this.lineHeight = null, this.fontFamily = null;
          else {
            const C = Object(c.parseFont)(p);
            this.fontStyle = C.style, this.fontVariant = C.variant, this.fontWeight = C.weight, this.fontStretch = C.stretch, this.fontSize = Object(m.toNumber)(`${C.size}${C.unit}`), C.lineHeight && (this.lineHeight = C.pxLineHeight), this.fontFamily = C.family;
          }
        }
      }
    },
    /* 250 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return p;
      });
      var c = i(12), m = i(219), L = i(251), K = i(213), u = i(252);
      i(1).glMatrix.setMatrixArrayType(Array);
      function a(C, I, o) {
        return I in C ? Object.defineProperty(C, I, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : C[I] = o, C;
      }
      const e = Symbol("zOrder"), r = Symbol("ordered"), X = Symbol("children"), W = Symbol("sealed");
      class p extends m.default {
        constructor(I = {}) {
          super(I), this[X] = [], this[r] = null, this[e] = 0;
        }
        get childNodes() {
          return this[X];
        }
        get children() {
          return this[X];
        }
        get orderedChildren() {
          return this[r] || (this[r] = [...this[X]], this[r].sort((I, o) => I.zIndex - o.zIndex || I.zOrder - o.zOrder)), this[r];
        }
        append(...I) {
          return I.map((o) => this.appendChild(o));
        }
        appendChild(I) {
          return I.remove(), this[X].push(I), I.connect(this, this[e]++), this[r] && (this[r].length && I.zIndex < this[r][this[r].length - 1].zIndex ? this.reorder() : this[r].push(I)), I;
        }
        /* override */
        // get isVisible() {
        //   return this.attributes.opacity > 0 && this[_children].length > 0;
        // }
        /* override */
        cloneNode(I = !1) {
          const o = super.cloneNode();
          return I && this[X].forEach((G) => {
            const d = G.cloneNode(I);
            o.appendChild(d);
          }), o;
        }
        /* override */
        dispatchPointerEvent(I) {
          const o = this.orderedChildren;
          for (let G = o.length - 1; G >= 0; G--)
            if (o[G].dispatchPointerEvent(I))
              return !0;
          return super.dispatchPointerEvent(I);
        }
        /* override */
        draw(I = []) {
          if (this.__cacheRenderMatrix = this.renderMatrix, super.draw(I), !this[W] && this.attributes.display !== "none") {
            const o = this.orderedChildren;
            for (let G = 0; G < o.length; G++)
              o[G].draw(I);
          }
          return this.__cacheRenderMatrix = null, I;
        }
        getElementById(I) {
          return Object(u.querySelector)(`#${I}`, this);
        }
        getElementsByClassName(I) {
          return Object(u.querySelectorAll)(`.${I}`, this);
        }
        getElementsByName(I) {
          return Object(u.querySelectorAll)(`[name="${I}"]`, this);
        }
        getElementsByTagName(I) {
          return Object(u.querySelectorAll)(I, this);
        }
        insertBefore(I, o) {
          if (o == null)
            return this.appendChild(I);
          I.remove();
          const G = this[X].indexOf(o);
          if (G < 0)
            throw new Error("Invalid reference node.");
          const d = o.zOrder;
          for (let t = G; t < this[X].length; t++) {
            const s = this[X][t].zOrder, b = this[X][t];
            delete b.zOrder, Object.defineProperty(b, "zOrder", {
              value: s + 1,
              writable: !1,
              configurable: !0
            });
          }
          if (this[X].splice(G, 0, I), I.connect(this, d), this[r])
            if (I.zIndex !== o.zIndex)
              this.reorder();
            else {
              const t = this[r].indexOf(o);
              this[r].splice(t, 0, I);
            }
          return I;
        }
        querySelector(I) {
          return Object(u.querySelector)(I, this);
        }
        querySelectorAll(I) {
          return Object(u.querySelectorAll)(I, this);
        }
        replaceChild(I, o) {
          I.remove();
          const G = this[X].indexOf(o);
          if (G < 0)
            throw new Error("Invalid reference node.");
          if (this[X][G] = I, I.connect(this, o.zOrder), this[r])
            if (I.zIndex !== o.zIndex)
              this.reorder();
            else {
              const d = this[r].indexOf(o);
              this[r][d] = I;
            }
          return o.disconnect(this), I;
        }
        removeAllChildren() {
          const I = this[X];
          for (let o = I.length - 1; o >= 0; o--)
            I[o].remove();
        }
        removeChild(I) {
          const o = this[X].indexOf(I);
          if (o >= 0) {
            if (this[X].splice(o, 1), this[r]) {
              const G = this[r].indexOf(I);
              this[r].splice(G, 1);
            }
            return I.disconnect(this), I;
          }
          return null;
        }
        reorder() {
          this[r] = null;
        }
        seal() {
          function I(t, s) {
            const b = [];
            for (let h = 0; h < t.length; h++) {
              const S = [...t[h]];
              for (let Y = 1; Y < S.length; Y += 2) {
                const T = S[Y], y = S[Y + 1];
                S[Y] = T * s[0] + y * s[2] + s[4], S[Y + 1] = T * s[1] + y * s[3] + s[5];
              }
              b.push(S);
            }
            return b;
          }
          const o = this.orderedChildren, G = new c.Figure2D(), d = this.localMatrix;
          for (let t = 0; t < o.length; t++) {
            let s = o[t];
            if (s instanceof p && (s = s.seal()), s.clientBox) {
              let b = s.clientBox.contours.path;
              b = I(b, s.localMatrix), G.addPath(b);
            }
            if (s.path) {
              let b = s.path.contours.path;
              b = I(b, s.localMatrix), G.addPath(b);
            }
          }
          return this[W] = !0, this.clientBox = G, {
            clientBox: G,
            localMatrix: d
          };
        }
        /* override */
        setResolution({
          width: I,
          height: o
        }) {
          super.setResolution({
            width: I,
            height: o
          }), this[X].forEach((G) => {
            G.setResolution({
              width: I,
              height: o
            });
          });
        }
        /* override */
        updateContours() {
          this[W] || super.updateContours();
        }
      }
      a(p, "Attr", L.default), K.default.registerNode(p, "group");
    },
    /* 251 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return m;
      });
      var c = i(220);
      i(1).glMatrix.setMatrixArrayType(Array);
      class m extends c.default {
        // constructor(subject) {
        //   super(subject);
        //   this[setDefault]({
        //     pointerEvents: 'all',
        //   });
        // }
      }
    },
    /* 252 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "querySelectorAll", function() {
        return W;
      }), i.d(l, "querySelector", function() {
        return p;
      }), i.d(l, "isMatched", function() {
        return C;
      }), i.d(l, "compile", function() {
        return I;
      });
      var c = i(221), m = i(213);
      i(1).glMatrix.setMatrixArrayType(Array);
      const L = i(253);
      function K(o) {
        return o.nodeType === 1 || m.default.isSpriteNode(o.nodeName);
      }
      function u(o) {
        return Array.from(o.childNodes || []);
      }
      function a(o) {
        return m.default.isSpriteNode(o.nodeName) ? o.parent || o.canvas || o.container : o.parentElement;
      }
      function e(o) {
        let G = o.length, d, t, s;
        for (; --G > -1; ) {
          for (d = t = o[G], o[G] = null, s = !0; t; ) {
            if (o.indexOf(t) > -1) {
              s = !1, o.splice(G, 1);
              break;
            }
            t = a(t);
          }
          s && (o[G] = d);
        }
        return o;
      }
      const r = {
        isTag: K,
        existsOne(o, G) {
          return G.some((d) => K(d) ? o(d) || r.existsOne(o, u(d)) : !1);
        },
        getSiblings(o) {
          const G = a(o);
          return G && u(G);
        },
        getChildren: u,
        getParent: a,
        getAttributeValue(o, G) {
          if (o.nodeType === 1 && G === "class" || G === "id")
            return o[G];
          if (this.hasAttrib(o, G)) {
            let d = o.attributes[G];
            return Array.isArray(d) && (d = `[${d.join()}]`), String(d);
          }
        },
        hasAttrib(o, G) {
          return o.attributes[G] != null;
        },
        removeSubsets: e,
        getName(o) {
          return o.tagName ? o.tagName.toLowerCase() : null;
        },
        findOne: function o(G, d) {
          let t = null;
          for (let s = 0, b = d.length; s < b && !t; s++)
            if (G(d[s]))
              t = d[s];
            else {
              const h = u(d[s]);
              h && h.length > 0 && (t = o(G, h));
            }
          return t;
        },
        findAll: function o(G, d) {
          let t = [];
          for (let s = 0, b = d.length; s < b; s++) {
            if (!K(d[s]))
              continue;
            G(d[s]) && t.push(d[s]);
            const h = u(d[s]);
            h && (t = t.concat(o(G, h)));
          }
          return t;
        },
        getText: function o(G) {
          return Array.isArray(G) ? G.map(o).join("") : K(G) ? o(u(G)) : G.nodeType === 3 ? G.nodeValue : m.default.isSpriteNode(G.nodeName) ? G.text : "";
        }
      };
      function X(o) {
        if (typeof o != "string")
          return o;
        let G = o.match(/\[(bgcolor|fillColor|strokeColor|color)\s*=\s*['"]?\w+['"]?\]/g);
        return G && (G = G.map((d) => {
          const t = d.slice(1, -1).split("="), s = Object(c.parseColor)(t[1].replace(/['"]/g, ""));
          return [d, `[${t[0]}="${s}"]`];
        }), G.forEach(([d, t]) => {
          o = o.replace(d, t);
        })), G = o.match(/\[\w+\s*=\s*['"]\[.+?\]['"]\]/g), G && (G = G.map((d) => {
          const t = d.slice(1, -1).split("="), s = t[1].slice(2, -2).split(/,/g).map((b) => b.trim());
          return [d, `[${t[0]}="[${s}]"]`];
        }), G.forEach(([d, t]) => {
          o = o.replace(d, t);
        })), o;
      }
      function W(o, G) {
        return L.selectAll(X(o), G, {
          adapter: r
        });
      }
      function p(o, G) {
        return L.selectOne(X(o), G, {
          adapter: r
        });
      }
      function C(o, G) {
        return L.is(o, X(G), {
          adapter: r
        });
      }
      function I(o) {
        return L.compile(X(o), {
          adapter: r
        });
      }
    },
    /* 253 */
    /***/
    function(n, l, i) {
      n.exports = I;
      var c = i(254), m = i(273).falseFunc, L = i(274);
      function K(o) {
        return function(d, t, s) {
          return t = t || {}, t.adapter = t.adapter || c, o(d, t, s);
        };
      }
      var u = K(L), a = K(L.compileUnsafe);
      function e(o) {
        return function(d, t, s) {
          return s = s || {}, s.adapter = s.adapter || c, typeof d != "function" && (d = a(d, s, t)), d.shouldTestNextSiblings && (t = X(s && s.context || t, s.adapter)), Array.isArray(t) ? t = s.adapter.removeSubsets(t) : t = s.adapter.getChildren(t), o(d, t, s);
        };
      }
      function r(o, G) {
        var d = G.getSiblings(o);
        if (!Array.isArray(d))
          return [];
        for (d = d.slice(0); d.shift() !== o; )
          ;
        return d;
      }
      function X(o, G) {
        Array.isArray(o) || (o = [o]);
        for (var d = o.slice(0), t = 0, s = o.length; t < s; t++) {
          var b = r(d[t], G);
          d.push.apply(d, b);
        }
        return d;
      }
      var W = e(function(G, d, t) {
        return G === m || !d || d.length === 0 ? [] : t.adapter.findAll(G, d);
      }), p = e(function(G, d, t) {
        return G === m || !d || d.length === 0 ? null : t.adapter.findOne(G, d);
      });
      function C(o, G, d) {
        return d = d || {}, d.adapter = d.adapter || c, (typeof G == "function" ? G : u(G, d))(o);
      }
      function I(o, G, d) {
        return W(o, G, d);
      }
      I.compile = u, I.filters = L.Pseudos.filters, I.pseudos = L.Pseudos.pseudos, I.selectAll = W, I.selectOne = p, I.is = C, I.parse = u, I.iterate = W, I._compileUnsafe = a, I._compileToken = L.compileToken;
    },
    /* 254 */
    /***/
    function(n, l, i) {
      var c = n.exports;
      [
        i(255),
        i(268),
        i(269),
        i(270),
        i(271),
        i(272)
      ].forEach(function(m) {
        Object.keys(m).forEach(function(L) {
          c[L] = m[L].bind(c);
        });
      });
    },
    /* 255 */
    /***/
    function(n, l, i) {
      var c = i(256), m = i(257), L = c.isTag;
      n.exports = {
        getInnerHTML: K,
        getOuterHTML: m,
        getText: u
      };
      function K(a, e) {
        return a.children ? a.children.map(function(r) {
          return m(r, e);
        }).join("") : "";
      }
      function u(a) {
        return Array.isArray(a) ? a.map(u).join("") : L(a) ? a.name === "br" ? `
` : u(a.children) : a.type === c.CDATA ? u(a.children) : a.type === c.Text ? a.data : "";
      }
    },
    /* 256 */
    /***/
    function(n, l) {
      n.exports = {
        Text: "text",
        //Text
        Directive: "directive",
        //<? ... ?>
        Comment: "comment",
        //<!-- ... -->
        Script: "script",
        //<script> tags
        Style: "style",
        //<style> tags
        Tag: "tag",
        //Any tag
        CDATA: "cdata",
        //<![CDATA[ ... ]]>
        Doctype: "doctype",
        isTag: function(i) {
          return i.type === "tag" || i.type === "script" || i.type === "style";
        }
      };
    },
    /* 257 */
    /***/
    function(n, l, i) {
      var c = i(258), m = i(259), L = i(267);
      L.elementNames.__proto__ = null, L.attributeNames.__proto__ = null;
      var K = {
        __proto__: null,
        style: !0,
        script: !0,
        xmp: !0,
        iframe: !0,
        noembed: !0,
        noframes: !0,
        plaintext: !0,
        noscript: !0
      };
      function u(o, G) {
        if (o) {
          var d = "", t;
          for (var s in o)
            t = o[s], d && (d += " "), G.xmlMode === "foreign" && (s = L.attributeNames[s] || s), d += s, (t !== null && t !== "" || G.xmlMode) && (d += '="' + (G.decodeEntities ? m.encodeXML(t) : t.replace(/\"/g, "&quot;")) + '"');
          return d;
        }
      }
      var a = {
        __proto__: null,
        area: !0,
        base: !0,
        basefont: !0,
        br: !0,
        col: !0,
        command: !0,
        embed: !0,
        frame: !0,
        hr: !0,
        img: !0,
        input: !0,
        isindex: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
      }, e = n.exports = function(o, G) {
        !Array.isArray(o) && !o.cheerio && (o = [o]), G = G || {};
        for (var d = "", t = 0; t < o.length; t++) {
          var s = o[t];
          s.type === "root" ? d += e(s.children, G) : c.isTag(s) ? d += X(s, G) : s.type === c.Directive ? d += W(s) : s.type === c.Comment ? d += I(s) : s.type === c.CDATA ? d += C(s) : d += p(s, G);
        }
        return d;
      }, r = [
        "mi",
        "mo",
        "mn",
        "ms",
        "mtext",
        "annotation-xml",
        "foreignObject",
        "desc",
        "title"
      ];
      function X(o, G) {
        G.xmlMode === "foreign" && (o.name = L.elementNames[o.name] || o.name, o.parent && r.indexOf(o.parent.name) >= 0 && (G = Object.assign({}, G, { xmlMode: !1 }))), !G.xmlMode && ["svg", "math"].indexOf(o.name) >= 0 && (G = Object.assign({}, G, { xmlMode: "foreign" }));
        var d = "<" + o.name, t = u(o.attribs, G);
        return t && (d += " " + t), G.xmlMode && (!o.children || o.children.length === 0) ? d += "/>" : (d += ">", o.children && (d += e(o.children, G)), (!a[o.name] || G.xmlMode) && (d += "</" + o.name + ">")), d;
      }
      function W(o) {
        return "<" + o.data + ">";
      }
      function p(o, G) {
        var d = o.data || "";
        return G.decodeEntities && !(o.parent && o.parent.name in K) && (d = m.encodeXML(d)), d;
      }
      function C(o) {
        return "<![CDATA[" + o.children[0].data + "]]>";
      }
      function I(o) {
        return "<!--" + o.data + "-->";
      }
    },
    /* 258 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", { value: !0 });
      function c(m) {
        return m.type === "tag" || m.type === "script" || m.type === "style";
      }
      l.isTag = c, l.Text = "text", l.Directive = "directive", l.Comment = "comment", l.Script = "script", l.Style = "style", l.Tag = "tag", l.CDATA = "cdata", l.Doctype = "doctype";
    },
    /* 259 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", { value: !0 }), l.encode = l.decodeStrict = l.decode = void 0;
      var c = i(260), m = i(266);
      function L(r, X) {
        return (!X || X <= 0 ? c.decodeXML : c.decodeHTML)(r);
      }
      l.decode = L;
      function K(r, X) {
        return (!X || X <= 0 ? c.decodeXML : c.decodeHTMLStrict)(r);
      }
      l.decodeStrict = K;
      function u(r, X) {
        return (!X || X <= 0 ? m.encodeXML : m.encodeHTML)(r);
      }
      l.encode = u;
      var a = i(266);
      Object.defineProperty(l, "encodeXML", { enumerable: !0, get: function() {
        return a.encodeXML;
      } }), Object.defineProperty(l, "encodeHTML", { enumerable: !0, get: function() {
        return a.encodeHTML;
      } }), Object.defineProperty(l, "escape", { enumerable: !0, get: function() {
        return a.escape;
      } }), Object.defineProperty(l, "encodeHTML4", { enumerable: !0, get: function() {
        return a.encodeHTML;
      } }), Object.defineProperty(l, "encodeHTML5", { enumerable: !0, get: function() {
        return a.encodeHTML;
      } });
      var e = i(260);
      Object.defineProperty(l, "decodeXML", { enumerable: !0, get: function() {
        return e.decodeXML;
      } }), Object.defineProperty(l, "decodeHTML", { enumerable: !0, get: function() {
        return e.decodeHTML;
      } }), Object.defineProperty(l, "decodeHTMLStrict", { enumerable: !0, get: function() {
        return e.decodeHTMLStrict;
      } }), Object.defineProperty(l, "decodeHTML4", { enumerable: !0, get: function() {
        return e.decodeHTML;
      } }), Object.defineProperty(l, "decodeHTML5", { enumerable: !0, get: function() {
        return e.decodeHTML;
      } }), Object.defineProperty(l, "decodeHTML4Strict", { enumerable: !0, get: function() {
        return e.decodeHTMLStrict;
      } }), Object.defineProperty(l, "decodeHTML5Strict", { enumerable: !0, get: function() {
        return e.decodeHTMLStrict;
      } }), Object.defineProperty(l, "decodeXMLStrict", { enumerable: !0, get: function() {
        return e.decodeXML;
      } });
    },
    /* 260 */
    /***/
    function(n, l, i) {
      var c = this && this.__importDefault || function(X) {
        return X && X.__esModule ? X : { default: X };
      };
      Object.defineProperty(l, "__esModule", { value: !0 }), l.decodeHTML = l.decodeHTMLStrict = l.decodeXML = void 0;
      var m = c(i(261)), L = c(i(262)), K = c(i(263)), u = c(i(264));
      l.decodeXML = a(K.default), l.decodeHTMLStrict = a(m.default);
      function a(X) {
        var W = Object.keys(X).join("|"), p = r(X);
        W += "|#[xX][\\da-fA-F]+|#\\d+";
        var C = new RegExp("&(?:" + W + ");", "g");
        return function(I) {
          return String(I).replace(C, p);
        };
      }
      var e = function(X, W) {
        return X < W ? 1 : -1;
      };
      l.decodeHTML = function() {
        for (var X = Object.keys(L.default).sort(e), W = Object.keys(m.default).sort(e), p = 0, C = 0; p < W.length; p++)
          X[C] === W[p] ? (W[p] += ";?", C++) : W[p] += ";";
        var I = new RegExp("&(?:" + W.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"), o = r(m.default);
        function G(d) {
          return d.substr(-1) !== ";" && (d += ";"), o(d);
        }
        return function(d) {
          return String(d).replace(I, G);
        };
      }();
      function r(X) {
        return function(p) {
          if (p.charAt(1) === "#") {
            var C = p.charAt(2);
            return C === "X" || C === "x" ? u.default(parseInt(p.substr(3), 16)) : u.default(parseInt(p.substr(2), 10));
          }
          return X[p.slice(1, -1)];
        };
      }
    },
    /* 261 */
    /***/
    function(n) {
      n.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');
    },
    /* 262 */
    /***/
    function(n) {
      n.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}');
    },
    /* 263 */
    /***/
    function(n) {
      n.exports = JSON.parse(`{"amp":"&","apos":"'","gt":">","lt":"<","quot":"\\""}`);
    },
    /* 264 */
    /***/
    function(n, l, i) {
      var c = this && this.__importDefault || function(K) {
        return K && K.__esModule ? K : { default: K };
      };
      Object.defineProperty(l, "__esModule", { value: !0 });
      var m = c(i(265));
      function L(K) {
        if (K >= 55296 && K <= 57343 || K > 1114111)
          return "�";
        K in m.default && (K = m.default[K]);
        var u = "";
        return K > 65535 && (K -= 65536, u += String.fromCharCode(K >>> 10 & 1023 | 55296), K = 56320 | K & 1023), u += String.fromCharCode(K), u;
      }
      l.default = L;
    },
    /* 265 */
    /***/
    function(n) {
      n.exports = JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}');
    },
    /* 266 */
    /***/
    function(n, l, i) {
      var c = this && this.__importDefault || function(G) {
        return G && G.__esModule ? G : { default: G };
      };
      Object.defineProperty(l, "__esModule", { value: !0 }), l.escape = l.encodeHTML = l.encodeXML = void 0;
      var m = c(i(263)), L = r(m.default), K = X(L);
      l.encodeXML = C(L, K);
      var u = c(i(261)), a = r(u.default), e = X(a);
      l.encodeHTML = C(a, e);
      function r(G) {
        return Object.keys(G).sort().reduce(function(d, t) {
          return d[G[t]] = "&" + t + ";", d;
        }, {});
      }
      function X(G) {
        for (var d = [], t = [], s = 0, b = Object.keys(G); s < b.length; s++) {
          var h = b[s];
          h.length === 1 ? d.push("\\" + h) : t.push(h);
        }
        d.sort();
        for (var S = 0; S < d.length - 1; S++) {
          for (var Y = S; Y < d.length - 1 && d[Y].charCodeAt(1) + 1 === d[Y + 1].charCodeAt(1); )
            Y += 1;
          var T = 1 + Y - S;
          T < 3 || d.splice(S, T, d[S] + "-" + d[Y]);
        }
        return t.unshift("[" + d.join("") + "]"), new RegExp(t.join("|"), "g");
      }
      var W = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
      function p(G) {
        return "&#x" + G.codePointAt(0).toString(16).toUpperCase() + ";";
      }
      function C(G, d) {
        return function(t) {
          return t.replace(d, function(s) {
            return G[s];
          }).replace(W, p);
        };
      }
      var I = X(L);
      function o(G) {
        return G.replace(I, p).replace(W, p);
      }
      l.escape = o;
    },
    /* 267 */
    /***/
    function(n) {
      n.exports = JSON.parse('{"elementNames":{"altglyph":"altGlyph","altglyphdef":"altGlyphDef","altglyphitem":"altGlyphItem","animatecolor":"animateColor","animatemotion":"animateMotion","animatetransform":"animateTransform","clippath":"clipPath","feblend":"feBlend","fecolormatrix":"feColorMatrix","fecomponenttransfer":"feComponentTransfer","fecomposite":"feComposite","feconvolvematrix":"feConvolveMatrix","fediffuselighting":"feDiffuseLighting","fedisplacementmap":"feDisplacementMap","fedistantlight":"feDistantLight","fedropshadow":"feDropShadow","feflood":"feFlood","fefunca":"feFuncA","fefuncb":"feFuncB","fefuncg":"feFuncG","fefuncr":"feFuncR","fegaussianblur":"feGaussianBlur","feimage":"feImage","femerge":"feMerge","femergenode":"feMergeNode","femorphology":"feMorphology","feoffset":"feOffset","fepointlight":"fePointLight","fespecularlighting":"feSpecularLighting","fespotlight":"feSpotLight","fetile":"feTile","feturbulence":"feTurbulence","foreignobject":"foreignObject","glyphref":"glyphRef","lineargradient":"linearGradient","radialgradient":"radialGradient","textpath":"textPath"},"attributeNames":{"definitionurl":"definitionURL","attributename":"attributeName","attributetype":"attributeType","basefrequency":"baseFrequency","baseprofile":"baseProfile","calcmode":"calcMode","clippathunits":"clipPathUnits","diffuseconstant":"diffuseConstant","edgemode":"edgeMode","filterunits":"filterUnits","glyphref":"glyphRef","gradienttransform":"gradientTransform","gradientunits":"gradientUnits","kernelmatrix":"kernelMatrix","kernelunitlength":"kernelUnitLength","keypoints":"keyPoints","keysplines":"keySplines","keytimes":"keyTimes","lengthadjust":"lengthAdjust","limitingconeangle":"limitingConeAngle","markerheight":"markerHeight","markerunits":"markerUnits","markerwidth":"markerWidth","maskcontentunits":"maskContentUnits","maskunits":"maskUnits","numoctaves":"numOctaves","pathlength":"pathLength","patterncontentunits":"patternContentUnits","patterntransform":"patternTransform","patternunits":"patternUnits","pointsatx":"pointsAtX","pointsaty":"pointsAtY","pointsatz":"pointsAtZ","preservealpha":"preserveAlpha","preserveaspectratio":"preserveAspectRatio","primitiveunits":"primitiveUnits","refx":"refX","refy":"refY","repeatcount":"repeatCount","repeatdur":"repeatDur","requiredextensions":"requiredExtensions","requiredfeatures":"requiredFeatures","specularconstant":"specularConstant","specularexponent":"specularExponent","spreadmethod":"spreadMethod","startoffset":"startOffset","stddeviation":"stdDeviation","stitchtiles":"stitchTiles","surfacescale":"surfaceScale","systemlanguage":"systemLanguage","tablevalues":"tableValues","targetx":"targetX","targety":"targetY","textlength":"textLength","viewbox":"viewBox","viewtarget":"viewTarget","xchannelselector":"xChannelSelector","ychannelselector":"yChannelSelector","zoomandpan":"zoomAndPan"}}');
    },
    /* 268 */
    /***/
    function(n, l) {
      var i = l.getChildren = function(m) {
        return m.children;
      }, c = l.getParent = function(m) {
        return m.parent;
      };
      l.getSiblings = function(m) {
        var L = c(m);
        return L ? i(L) : [m];
      }, l.getAttributeValue = function(m, L) {
        return m.attribs && m.attribs[L];
      }, l.hasAttrib = function(m, L) {
        return !!m.attribs && hasOwnProperty.call(m.attribs, L);
      }, l.getName = function(m) {
        return m.name;
      };
    },
    /* 269 */
    /***/
    function(n, l) {
      l.removeElement = function(i) {
        if (i.prev && (i.prev.next = i.next), i.next && (i.next.prev = i.prev), i.parent) {
          var c = i.parent.children;
          c.splice(c.lastIndexOf(i), 1);
        }
      }, l.replaceElement = function(i, c) {
        var m = c.prev = i.prev;
        m && (m.next = c);
        var L = c.next = i.next;
        L && (L.prev = c);
        var K = c.parent = i.parent;
        if (K) {
          var u = K.children;
          u[u.lastIndexOf(i)] = c;
        }
      }, l.appendChild = function(i, c) {
        if (c.parent = i, i.children.push(c) !== 1) {
          var m = i.children[i.children.length - 2];
          m.next = c, c.prev = m, c.next = null;
        }
      }, l.append = function(i, c) {
        var m = i.parent, L = i.next;
        if (c.next = L, c.prev = i, i.next = c, c.parent = m, L) {
          if (L.prev = c, m) {
            var K = m.children;
            K.splice(K.lastIndexOf(L), 0, c);
          }
        } else
          m && m.children.push(c);
      }, l.prepend = function(i, c) {
        var m = i.parent;
        if (m) {
          var L = m.children;
          L.splice(L.lastIndexOf(i), 0, c);
        }
        i.prev && (i.prev.next = c), c.parent = m, c.prev = i.prev, c.next = i, i.prev = c;
      };
    },
    /* 270 */
    /***/
    function(n, l, i) {
      var c = i(256).isTag;
      n.exports = {
        filter: m,
        find: L,
        findOneChild: K,
        findOne: u,
        existsOne: a,
        findAll: e
      };
      function m(r, X, W, p) {
        return Array.isArray(X) || (X = [X]), (typeof p != "number" || !isFinite(p)) && (p = 1 / 0), L(r, X, W !== !1, p);
      }
      function L(r, X, W, p) {
        for (var C = [], I, o = 0, G = X.length; o < G && !(r(X[o]) && (C.push(X[o]), --p <= 0) || (I = X[o].children, W && I && I.length > 0 && (I = L(r, I, W, p), C = C.concat(I), p -= I.length, p <= 0))); o++)
          ;
        return C;
      }
      function K(r, X) {
        for (var W = 0, p = X.length; W < p; W++)
          if (r(X[W]))
            return X[W];
        return null;
      }
      function u(r, X) {
        for (var W = null, p = 0, C = X.length; p < C && !W; p++)
          if (c(X[p]))
            r(X[p]) ? W = X[p] : X[p].children.length > 0 && (W = u(r, X[p].children));
          else
            continue;
        return W;
      }
      function a(r, X) {
        for (var W = 0, p = X.length; W < p; W++)
          if (c(X[W]) && (r(X[W]) || X[W].children.length > 0 && a(r, X[W].children)))
            return !0;
        return !1;
      }
      function e(r, X) {
        for (var W = [], p = X.slice(); p.length; ) {
          var C = p.shift();
          c(C) && (C.children && C.children.length > 0 && p.unshift.apply(p, C.children), r(C) && W.push(C));
        }
        return W;
      }
    },
    /* 271 */
    /***/
    function(n, l, i) {
      var c = i(256), m = l.isTag = c.isTag;
      l.testElement = function(a, e) {
        for (var r in a)
          if (a.hasOwnProperty(r)) {
            if (r === "tag_name") {
              if (!m(e) || !a.tag_name(e.name))
                return !1;
            } else if (r === "tag_type") {
              if (!a.tag_type(e.type))
                return !1;
            } else if (r === "tag_contains") {
              if (m(e) || !a.tag_contains(e.data))
                return !1;
            } else if (!e.attribs || !a[r](e.attribs[r]))
              return !1;
          }
        return !0;
      };
      var L = {
        tag_name: function(a) {
          return typeof a == "function" ? function(e) {
            return m(e) && a(e.name);
          } : a === "*" ? m : function(e) {
            return m(e) && e.name === a;
          };
        },
        tag_type: function(a) {
          return typeof a == "function" ? function(e) {
            return a(e.type);
          } : function(e) {
            return e.type === a;
          };
        },
        tag_contains: function(a) {
          return typeof a == "function" ? function(e) {
            return !m(e) && a(e.data);
          } : function(e) {
            return !m(e) && e.data === a;
          };
        }
      };
      function K(a, e) {
        return typeof e == "function" ? function(r) {
          return r.attribs && e(r.attribs[a]);
        } : function(r) {
          return r.attribs && r.attribs[a] === e;
        };
      }
      function u(a, e) {
        return function(r) {
          return a(r) || e(r);
        };
      }
      l.getElements = function(a, e, r, X) {
        var W = Object.keys(a).map(function(p) {
          var C = a[p];
          return p in L ? L[p](C) : K(p, C);
        });
        return W.length === 0 ? [] : this.filter(
          W.reduce(u),
          e,
          r,
          X
        );
      }, l.getElementById = function(a, e, r) {
        return Array.isArray(e) || (e = [e]), this.findOne(K("id", a), e, r !== !1);
      }, l.getElementsByTagName = function(a, e, r, X) {
        return this.filter(L.tag_name(a), e, r, X);
      }, l.getElementsByTagType = function(a, e, r, X) {
        return this.filter(L.tag_type(a), e, r, X);
      };
    },
    /* 272 */
    /***/
    function(n, l) {
      l.removeSubsets = function(m) {
        for (var L = m.length, K, u, a; --L > -1; ) {
          for (K = u = m[L], m[L] = null, a = !0; u; ) {
            if (m.indexOf(u) > -1) {
              a = !1, m.splice(L, 1);
              break;
            }
            u = u.parent;
          }
          a && (m[L] = K);
        }
        return m;
      };
      var i = {
        DISCONNECTED: 1,
        PRECEDING: 2,
        FOLLOWING: 4,
        CONTAINS: 8,
        CONTAINED_BY: 16
      }, c = l.compareDocumentPosition = function(m, L) {
        var K = [], u = [], a, e, r, X, W, p;
        if (m === L)
          return 0;
        for (a = m; a; )
          K.unshift(a), a = a.parent;
        for (a = L; a; )
          u.unshift(a), a = a.parent;
        for (p = 0; K[p] === u[p]; )
          p++;
        return p === 0 ? i.DISCONNECTED : (e = K[p - 1], r = e.children, X = K[p], W = u[p], r.indexOf(X) > r.indexOf(W) ? e === L ? i.FOLLOWING | i.CONTAINED_BY : i.FOLLOWING : e === m ? i.PRECEDING | i.CONTAINS : i.PRECEDING);
      };
      l.uniqueSort = function(m) {
        var L = m.length, K, u;
        for (m = m.slice(); --L > -1; )
          K = m[L], u = m.indexOf(K), u > -1 && u < L && m.splice(L, 1);
        return m.sort(function(a, e) {
          var r = c(a, e);
          return r & i.PRECEDING ? -1 : r & i.FOLLOWING ? 1 : 0;
        }), m;
      };
    },
    /* 273 */
    /***/
    function(n, l) {
      n.exports = {
        trueFunc: function() {
          return !0;
        },
        falseFunc: function() {
          return !1;
        }
      };
    },
    /* 274 */
    /***/
    function(n, l, i) {
      n.exports = W;
      var c = i(275).parse, m = i(273), L = i(278), K = i(279), u = i(280), a = i(282), e = m.trueFunc, r = m.falseFunc, X = a.filters;
      function W(y, J, N) {
        var x = C(y, J, N);
        return p(x, J);
      }
      function p(y, J) {
        var N = J.adapter;
        return function(R) {
          return N.isTag(R) && y(R);
        };
      }
      function C(y, J, N) {
        var x = c(y, J);
        return b(x, J, N);
      }
      function I(y) {
        return y.type === "pseudo" && (y.name === "scope" || Array.isArray(y.data) && y.data.some(function(J) {
          return J.some(I);
        }));
      }
      var o = { type: "descendant" }, G = { type: "_flexibleDescendant" }, d = { type: "pseudo", name: "scope" }, t = {};
      function s(y, J, N) {
        var x = J.adapter, R = !!N && !!N.length && N.every(function(z) {
          return z === t || !!x.getParent(z);
        });
        y.forEach(function(z) {
          if (!(z.length > 0 && h(z[0]) && z[0].type !== "descendant"))
            if (R && !(Array.isArray(z) ? z.some(I) : I(z)))
              z.unshift(o);
            else
              return;
          z.unshift(d);
        });
      }
      function b(y, J, N) {
        y = y.filter(function(Q) {
          return Q.length > 0;
        }), y.forEach(L);
        var x = Array.isArray(N);
        N = J && J.context || N, N && !x && (N = [N]), s(y, J, N);
        var R = !1, z = y.map(function(Q) {
          if (Q[0] && Q[1] && Q[0].name === "scope") {
            var P = Q[1].type;
            x && P === "descendant" ? Q[1] = G : (P === "adjacent" || P === "sibling") && (R = !0);
          }
          return S(Q, J, N);
        }).reduce(Y, r);
        return z.shouldTestNextSiblings = R, z;
      }
      function h(y) {
        return K[y.type] < 0;
      }
      function S(y, J, N) {
        return y.reduce(function(x, R) {
          if (x === r)
            return x;
          if (!(R.type in u))
            throw new Error("Rule type " + R.type + " is not supported by css-select");
          return u[R.type](x, R, J, N);
        }, J && J.rootFunc || e);
      }
      function Y(y, J) {
        return J === r || y === e ? y : y === r || J === e ? J : function(x) {
          return y(x) || J(x);
        };
      }
      function T(y) {
        return y.some(h);
      }
      X.not = function(y, J, N, x) {
        var R = {
          xmlMode: !!(N && N.xmlMode),
          strict: !!(N && N.strict),
          adapter: N.adapter
        };
        if (R.strict && (J.length > 1 || J.some(T)))
          throw new Error("complex selectors in :not aren't allowed in strict mode");
        var z = b(J, R, x);
        return z === r ? y : z === e ? r : function(P) {
          return !z(P) && y(P);
        };
      }, X.has = function(y, J, N) {
        var x = N.adapter, R = {
          xmlMode: !!(N && N.xmlMode),
          strict: !!(N && N.strict),
          adapter: x
        }, z = J.some(T) ? [t] : null, Q = b(J, R, z);
        return Q === r ? r : Q === e ? function(D) {
          return x.getChildren(D).some(x.isTag) && y(D);
        } : (Q = p(Q, N), z ? function(D) {
          return y(D) && (z[0] = D, x.existsOne(Q, x.getChildren(D)));
        } : function(D) {
          return y(D) && x.existsOne(Q, x.getChildren(D));
        });
      }, X.matches = function(y, J, N, x) {
        var R = {
          xmlMode: !!(N && N.xmlMode),
          strict: !!(N && N.strict),
          rootFunc: y,
          adapter: N.adapter
        };
        return b(J, R, x);
      }, W.compileToken = b, W.compileUnsafe = C, W.Pseudos = a;
    },
    /* 275 */
    /***/
    function(n, l, i) {
      var c = this && this.__createBinding || (Object.create ? function(u, a, e, r) {
        r === void 0 && (r = e), Object.defineProperty(u, r, { enumerable: !0, get: function() {
          return a[e];
        } });
      } : function(u, a, e, r) {
        r === void 0 && (r = e), u[r] = a[e];
      }), m = this && this.__exportStar || function(u, a) {
        for (var e in u)
          e !== "default" && !a.hasOwnProperty(e) && c(a, u, e);
      };
      Object.defineProperty(l, "__esModule", { value: !0 }), m(i(276), l);
      var L = i(276);
      Object.defineProperty(l, "parse", { enumerable: !0, get: function() {
        return L.default;
      } });
      var K = i(277);
      Object.defineProperty(l, "stringify", { enumerable: !0, get: function() {
        return K.default;
      } });
    },
    /* 276 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", { value: !0 }), l.default = I;
      var c = /^[^\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/, m = /\\([\da-f]{1,6}\s?|(\s)|.)/gi, L = /^\s*((?:\\.|[\w\u00b0-\uFFFF-])+)\s*(?:(\S?)=\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00b0-\uFFFF-])*)|)|)\s*(i)?\]/, K = {
        undefined: "exists",
        "": "equals",
        "~": "element",
        "^": "start",
        $: "end",
        "*": "any",
        "!": "not",
        "|": "hyphen"
      }, u = {
        ">": "child",
        "<": "parent",
        "~": "sibling",
        "+": "adjacent"
      }, a = {
        "#": ["id", "equals"],
        ".": ["class", "element"]
      }, e = /* @__PURE__ */ new Set(["has", "not", "matches"]), r = /* @__PURE__ */ new Set(["contains", "icontains"]), X = /* @__PURE__ */ new Set(['"', "'"]);
      function W(d, t, s) {
        var b = parseInt(t, 16) - 65536;
        return b !== b || s ? t : b < 0 ? (
          // BMP codepoint
          String.fromCharCode(b + 65536)
        ) : (
          // Supplemental Plane codepoint (surrogate pair)
          String.fromCharCode(b >> 10 | 55296, b & 1023 | 56320)
        );
      }
      function p(d) {
        return d.replace(m, W);
      }
      function C(d) {
        return d === " " || d === `
` || d === "	" || d === "\f" || d === "\r";
      }
      function I(d, t) {
        var s = [];
        if (d = o(s, "" + d, t), d !== "")
          throw new Error("Unmatched selector: " + d);
        return s;
      }
      function o(d, t, s) {
        var b = [], h = !1;
        function S() {
          var O = t.match(c);
          if (!O)
            throw new Error("Expected name, found " + t);
          var li = O[0];
          return t = t.substr(li.length), p(li);
        }
        function Y(O) {
          for (; C(t.charAt(O)); )
            O++;
          t = t.substr(O);
        }
        function T(O) {
          for (var li = 0; t.charAt(--O) === "\\"; )
            li++;
          return (li & 1) === 1;
        }
        for (Y(0); t !== ""; ) {
          var y = t.charAt(0);
          if (C(y))
            h = !0, Y(1);
          else if (y in u)
            b.push({ type: u[y] }), h = !1, Y(1);
          else if (y === ",") {
            if (b.length === 0)
              throw new Error("Empty sub-selector");
            d.push(b), b = [], h = !1, Y(1);
          } else if (h && (b.length > 0 && b.push({ type: "descendant" }), h = !1), y === "*")
            t = t.substr(1), b.push({ type: "universal" });
          else if (y in a) {
            var J = a[y], N = J[0], x = J[1];
            t = t.substr(1), b.push({
              type: "attribute",
              name: N,
              action: x,
              value: S(),
              ignoreCase: !1
            });
          } else if (y === "[") {
            t = t.substr(1);
            var R = t.match(L);
            if (!R)
              throw new Error("Malformed attribute selector: " + t);
            t = t.substr(R[0].length);
            var z = p(R[1]);
            (!s || ("lowerCaseAttributeNames" in s ? s.lowerCaseAttributeNames : !s.xmlMode)) && (z = z.toLowerCase()), b.push({
              type: "attribute",
              name: z,
              action: K[R[2]],
              value: p(R[4] || R[5] || ""),
              ignoreCase: !!R[6]
            });
          } else if (y === ":") {
            if (t.charAt(1) === ":") {
              t = t.substr(2), b.push({
                type: "pseudo-element",
                name: S().toLowerCase()
              });
              continue;
            }
            t = t.substr(1);
            var Q = S().toLowerCase(), R = null;
            if (t.charAt(0) === "(")
              if (e.has(Q)) {
                var P = t.charAt(1), D = X.has(P);
                if (t = t.substr(D ? 2 : 1), R = [], t = o(R, t, s), D) {
                  if (t.charAt(0) !== P)
                    throw new Error("Unmatched quotes in :" + Q);
                  t = t.substr(1);
                }
                if (t.charAt(0) !== ")")
                  throw new Error("Missing closing parenthesis in :" + Q + " (" + t + ")");
                t = t.substr(1);
              } else {
                for (var _ = 1, F = 1; F > 0 && _ < t.length; _++)
                  t.charAt(_) === "(" && !T(_) ? F++ : t.charAt(_) === ")" && !T(_) && F--;
                if (F)
                  throw new Error("Parenthesis not matched");
                if (R = t.substr(1, _ - 2), t = t.substr(_), r.has(Q)) {
                  var P = R.charAt(0);
                  P === R.slice(-1) && X.has(P) && (R = R.slice(1, -1)), R = p(R);
                }
              }
            b.push({ type: "pseudo", name: Q, data: R });
          } else if (c.test(t)) {
            var v = S();
            (!s || ("lowerCaseTags" in s ? s.lowerCaseTags : !s.xmlMode)) && (v = v.toLowerCase()), b.push({ type: "tag", name: v });
          } else
            return b.length && b[b.length - 1].type === "descendant" && b.pop(), G(d, b), t;
        }
        return G(d, b), t;
      }
      function G(d, t) {
        if (d.length > 0 && t.length === 0)
          throw new Error("Empty sub-selector");
        d.push(t);
      }
    },
    /* 277 */
    /***/
    function(n, l, i) {
      Object.defineProperty(l, "__esModule", { value: !0 });
      var c = {
        equals: "",
        element: "~",
        start: "^",
        end: "$",
        any: "*",
        not: "!",
        hyphen: "|"
      };
      function m(a) {
        return a.map(L).join(", ");
      }
      l.default = m;
      function L(a) {
        return a.map(K).join("");
      }
      function K(a) {
        switch (a.type) {
          case "child":
            return " > ";
          case "parent":
            return " < ";
          case "sibling":
            return " ~ ";
          case "adjacent":
            return " + ";
          case "descendant":
            return " ";
          case "universal":
            return "*";
          case "tag":
            return a.name;
          case "pseudo-element":
            return "::" + a.name;
          case "pseudo":
            return a.data === null ? ":" + a.name : typeof a.data == "string" ? ":" + a.name + "(" + a.data + ")" : ":" + a.name + "(" + m(a.data) + ")";
          case "attribute":
            return a.action === "exists" ? "[" + a.name + "]" : a.name === "id" && a.action === "equals" && !a.ignoreCase ? "#" + a.value : a.name === "class" && a.action === "element" && !a.ignoreCase ? "." + a.value : "[" + a.name + c[a.action] + "='" + a.value + "'" + (a.ignoreCase ? "i" : "") + "]";
          default:
            throw new Error("Unknown type");
        }
      }
      function u(a) {
        return a;
      }
    },
    /* 278 */
    /***/
    function(n, l, i) {
      n.exports = L;
      var c = i(279), m = {
        __proto__: null,
        exists: 10,
        equals: 8,
        not: 7,
        start: 6,
        end: 6,
        any: 5,
        hyphen: 4,
        element: 4
      };
      function L(u) {
        for (var a = u.map(K), e = 1; e < u.length; e++) {
          var r = a[e];
          if (!(r < 0))
            for (var X = e - 1; X >= 0 && r < a[X]; X--) {
              var W = u[X + 1];
              u[X + 1] = u[X], u[X] = W, a[X + 1] = a[X], a[X] = r;
            }
        }
      }
      function K(u) {
        var a = c[u.type];
        if (a === c.attribute)
          a = m[u.action], a === m.equals && u.name === "id" && (a = 9), u.ignoreCase && (a >>= 1);
        else if (a === c.pseudo)
          if (!u.data)
            a = 3;
          else if (u.name === "has" || u.name === "contains")
            a = 0;
          else if (u.name === "matches" || u.name === "not") {
            a = 0;
            for (var e = 0; e < u.data.length; e++)
              if (u.data[e].length === 1) {
                var r = K(u.data[e][0]);
                if (r === 0) {
                  a = 0;
                  break;
                }
                r > a && (a = r);
              }
            u.data.length > 1 && a > 0 && (a -= 1);
          } else
            a = 1;
        return a;
      }
    },
    /* 279 */
    /***/
    function(n) {
      n.exports = JSON.parse('{"universal":50,"tag":30,"attribute":1,"pseudo":0,"descendant":-1,"child":-1,"parent":-1,"sibling":-1,"adjacent":-1}');
    },
    /* 280 */
    /***/
    function(n, l, i) {
      var c = i(281), m = i(282);
      n.exports = {
        __proto__: null,
        attribute: c.compile,
        pseudo: m.compile,
        //tags
        tag: function(L, K, u) {
          var a = K.name, e = u.adapter;
          return function(X) {
            return e.getName(X) === a && L(X);
          };
        },
        //traversal
        descendant: function(L, K, u) {
          var a = typeof WeakSet < "u" ? /* @__PURE__ */ new WeakSet() : null, e = u.adapter;
          return function(X) {
            for (var W = !1; !W && (X = e.getParent(X)); )
              (!a || !a.has(X)) && (W = L(X), !W && a && a.add(X));
            return W;
          };
        },
        _flexibleDescendant: function(L, K, u) {
          var a = u.adapter;
          return function(r) {
            for (var X = L(r); !X && (r = a.getParent(r)); )
              X = L(r);
            return X;
          };
        },
        parent: function(L, K, u) {
          if (u && u.strict)
            throw new Error("Parent selector isn't part of CSS3");
          var a = u.adapter;
          return function(X) {
            return a.getChildren(X).some(e);
          };
          function e(r) {
            return a.isTag(r) && L(r);
          }
        },
        child: function(L, K, u) {
          var a = u.adapter;
          return function(r) {
            var X = a.getParent(r);
            return !!X && L(X);
          };
        },
        sibling: function(L, K, u) {
          var a = u.adapter;
          return function(r) {
            for (var X = a.getSiblings(r), W = 0; W < X.length; W++)
              if (a.isTag(X[W])) {
                if (X[W] === r)
                  break;
                if (L(X[W]))
                  return !0;
              }
            return !1;
          };
        },
        adjacent: function(L, K, u) {
          var a = u.adapter;
          return function(r) {
            for (var X = a.getSiblings(r), W, p = 0; p < X.length; p++)
              if (a.isTag(X[p])) {
                if (X[p] === r)
                  break;
                W = X[p];
              }
            return !!W && L(W);
          };
        },
        universal: function(L) {
          return L;
        }
      };
    },
    /* 281 */
    /***/
    function(n, l, i) {
      var c = i(273).falseFunc, m = /[-[\]{}()*+?.,\\^$|#\s]/g, L = {
        __proto__: null,
        equals: function(K, u, a) {
          var e = u.name, r = u.value, X = a.adapter;
          return u.ignoreCase ? (r = r.toLowerCase(), function(p) {
            var C = X.getAttributeValue(p, e);
            return C != null && C.toLowerCase() === r && K(p);
          }) : function(p) {
            return X.getAttributeValue(p, e) === r && K(p);
          };
        },
        hyphen: function(K, u, a) {
          var e = u.name, r = u.value, X = r.length, W = a.adapter;
          return u.ignoreCase ? (r = r.toLowerCase(), function(C) {
            var I = W.getAttributeValue(C, e);
            return I != null && (I.length === X || I.charAt(X) === "-") && I.substr(0, X).toLowerCase() === r && K(C);
          }) : function(C) {
            var I = W.getAttributeValue(C, e);
            return I != null && I.substr(0, X) === r && (I.length === X || I.charAt(X) === "-") && K(C);
          };
        },
        element: function(K, u, a) {
          var e = u.name, r = u.value, X = a.adapter;
          if (/\s/.test(r))
            return c;
          r = r.replace(m, "\\$&");
          var W = "(?:^|\\s)" + r + "(?:$|\\s)", p = u.ignoreCase ? "i" : "", C = new RegExp(W, p);
          return function(o) {
            var G = X.getAttributeValue(o, e);
            return G != null && C.test(G) && K(o);
          };
        },
        exists: function(K, u, a) {
          var e = u.name, r = a.adapter;
          return function(W) {
            return r.hasAttrib(W, e) && K(W);
          };
        },
        start: function(K, u, a) {
          var e = u.name, r = u.value, X = r.length, W = a.adapter;
          return X === 0 ? c : u.ignoreCase ? (r = r.toLowerCase(), function(C) {
            var I = W.getAttributeValue(C, e);
            return I != null && I.substr(0, X).toLowerCase() === r && K(C);
          }) : function(C) {
            var I = W.getAttributeValue(C, e);
            return I != null && I.substr(0, X) === r && K(C);
          };
        },
        end: function(K, u, a) {
          var e = u.name, r = u.value, X = -r.length, W = a.adapter;
          return X === 0 ? c : u.ignoreCase ? (r = r.toLowerCase(), function(C) {
            var I = W.getAttributeValue(C, e);
            return I != null && I.substr(X).toLowerCase() === r && K(C);
          }) : function(C) {
            var I = W.getAttributeValue(C, e);
            return I != null && I.substr(X) === r && K(C);
          };
        },
        any: function(K, u, a) {
          var e = u.name, r = u.value, X = a.adapter;
          if (r === "")
            return c;
          if (u.ignoreCase) {
            var W = new RegExp(r.replace(m, "\\$&"), "i");
            return function(C) {
              var I = X.getAttributeValue(C, e);
              return I != null && W.test(I) && K(C);
            };
          }
          return function(C) {
            var I = X.getAttributeValue(C, e);
            return I != null && I.indexOf(r) >= 0 && K(C);
          };
        },
        not: function(K, u, a) {
          var e = u.name, r = u.value, X = a.adapter;
          return r === "" ? function(p) {
            return !!X.getAttributeValue(p, e) && K(p);
          } : u.ignoreCase ? (r = r.toLowerCase(), function(p) {
            var C = X.getAttributeValue(p, e);
            return C != null && C.toLowerCase() !== r && K(p);
          }) : function(p) {
            return X.getAttributeValue(p, e) !== r && K(p);
          };
        }
      };
      n.exports = {
        compile: function(K, u, a) {
          if (a && a.strict && (u.ignoreCase || u.action === "not"))
            throw new Error("Unsupported attribute selector");
          return L[u.action](K, u, a);
        },
        rules: L
      };
    },
    /* 282 */
    /***/
    function(n, l, i) {
      var c = i(283), m = i(273), L = i(281), K = m.trueFunc, u = m.falseFunc, a = L.rules.equals;
      function e(G, d) {
        var t = { name: G, value: d };
        return function(b, h, S) {
          return a(b, t, S);
        };
      }
      function r(G, d) {
        return function(t) {
          return !!d.getParent(t) && G(t);
        };
      }
      var X = {
        contains: function(G, d, t) {
          var s = t.adapter;
          return function(h) {
            return G(h) && s.getText(h).indexOf(d) >= 0;
          };
        },
        icontains: function(G, d, t) {
          var s = d.toLowerCase(), b = t.adapter;
          return function(S) {
            return G(S) && b.getText(S).toLowerCase().indexOf(s) >= 0;
          };
        },
        //location specific methods
        "nth-child": function(G, d, t) {
          var s = c(d), b = t.adapter;
          return s === u ? s : s === K ? r(G, b) : function(S) {
            for (var Y = b.getSiblings(S), T = 0, y = 0; T < Y.length; T++)
              if (b.isTag(Y[T])) {
                if (Y[T] === S)
                  break;
                y++;
              }
            return s(y) && G(S);
          };
        },
        "nth-last-child": function(G, d, t) {
          var s = c(d), b = t.adapter;
          return s === u ? s : s === K ? r(G, b) : function(S) {
            for (var Y = b.getSiblings(S), T = 0, y = Y.length - 1; y >= 0; y--)
              if (b.isTag(Y[y])) {
                if (Y[y] === S)
                  break;
                T++;
              }
            return s(T) && G(S);
          };
        },
        "nth-of-type": function(G, d, t) {
          var s = c(d), b = t.adapter;
          return s === u ? s : s === K ? r(G, b) : function(S) {
            for (var Y = b.getSiblings(S), T = 0, y = 0; y < Y.length; y++)
              if (b.isTag(Y[y])) {
                if (Y[y] === S)
                  break;
                b.getName(Y[y]) === b.getName(S) && T++;
              }
            return s(T) && G(S);
          };
        },
        "nth-last-of-type": function(G, d, t) {
          var s = c(d), b = t.adapter;
          return s === u ? s : s === K ? r(G, b) : function(S) {
            for (var Y = b.getSiblings(S), T = 0, y = Y.length - 1; y >= 0; y--)
              if (b.isTag(Y[y])) {
                if (Y[y] === S)
                  break;
                b.getName(Y[y]) === b.getName(S) && T++;
              }
            return s(T) && G(S);
          };
        },
        //TODO determine the actual root element
        root: function(G, d, t) {
          var s = t.adapter;
          return function(b) {
            return !s.getParent(b) && G(b);
          };
        },
        scope: function(G, d, t, s) {
          var b = t.adapter;
          if (!s || s.length === 0)
            return X.root(G, d, t);
          function h(S, Y) {
            return typeof b.equals == "function" ? b.equals(S, Y) : S === Y;
          }
          return s.length === 1 ? function(S) {
            return h(s[0], S) && G(S);
          } : function(S) {
            return s.indexOf(S) >= 0 && G(S);
          };
        },
        //jQuery extensions (others follow as pseudos)
        checkbox: e("type", "checkbox"),
        file: e("type", "file"),
        password: e("type", "password"),
        radio: e("type", "radio"),
        reset: e("type", "reset"),
        image: e("type", "image"),
        submit: e("type", "submit"),
        //dynamic state pseudos. These depend on optional Adapter methods.
        hover: function(G, d, t) {
          var s = t.adapter;
          return typeof s.isHovered == "function" ? function(h) {
            return G(h) && s.isHovered(h);
          } : u;
        },
        visited: function(G, d, t) {
          var s = t.adapter;
          return typeof s.isVisited == "function" ? function(h) {
            return G(h) && s.isVisited(h);
          } : u;
        },
        active: function(G, d, t) {
          var s = t.adapter;
          return typeof s.isActive == "function" ? function(h) {
            return G(h) && s.isActive(h);
          } : u;
        }
      };
      function W(G, d) {
        for (var t = 0; G && t < G.length; t++)
          if (d.isTag(G[t]))
            return G[t];
      }
      var p = {
        empty: function(G, d) {
          return !d.getChildren(G).some(function(t) {
            return d.isTag(t) || t.type === "text";
          });
        },
        "first-child": function(G, d) {
          return W(d.getSiblings(G), d) === G;
        },
        "last-child": function(G, d) {
          for (var t = d.getSiblings(G), s = t.length - 1; s >= 0; s--) {
            if (t[s] === G)
              return !0;
            if (d.isTag(t[s]))
              break;
          }
          return !1;
        },
        "first-of-type": function(G, d) {
          for (var t = d.getSiblings(G), s = 0; s < t.length; s++)
            if (d.isTag(t[s])) {
              if (t[s] === G)
                return !0;
              if (d.getName(t[s]) === d.getName(G))
                break;
            }
          return !1;
        },
        "last-of-type": function(G, d) {
          for (var t = d.getSiblings(G), s = t.length - 1; s >= 0; s--)
            if (d.isTag(t[s])) {
              if (t[s] === G)
                return !0;
              if (d.getName(t[s]) === d.getName(G))
                break;
            }
          return !1;
        },
        "only-of-type": function(G, d) {
          for (var t = d.getSiblings(G), s = 0, b = t.length; s < b; s++)
            if (d.isTag(t[s])) {
              if (t[s] === G)
                continue;
              if (d.getName(t[s]) === d.getName(G))
                return !1;
            }
          return !0;
        },
        "only-child": function(G, d) {
          for (var t = d.getSiblings(G), s = 0; s < t.length; s++)
            if (d.isTag(t[s]) && t[s] !== G)
              return !1;
          return !0;
        },
        //:matches(a, area, link)[href]
        link: function(G, d) {
          return d.hasAttrib(G, "href");
        },
        //TODO: :any-link once the name is finalized (as an alias of :link)
        //forms
        //to consider: :target
        //:matches([selected], select:not([multiple]):not(> option[selected]) > option:first-of-type)
        selected: function(G, d) {
          if (d.hasAttrib(G, "selected"))
            return !0;
          if (d.getName(G) !== "option")
            return !1;
          var t = d.getParent(G);
          if (!t || d.getName(t) !== "select" || d.hasAttrib(t, "multiple"))
            return !1;
          for (var s = d.getChildren(t), b = !1, h = 0; h < s.length; h++)
            if (d.isTag(s[h]))
              if (s[h] === G)
                b = !0;
              else if (b) {
                if (d.hasAttrib(s[h], "selected"))
                  return !1;
              } else
                return !1;
          return b;
        },
        //https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
        //:matches(
        //  :matches(button, input, select, textarea, menuitem, optgroup, option)[disabled],
        //  optgroup[disabled] > option),
        // fieldset[disabled] * //TODO not child of first <legend>
        //)
        disabled: function(G, d) {
          return d.hasAttrib(G, "disabled");
        },
        enabled: function(G, d) {
          return !d.hasAttrib(G, "disabled");
        },
        //:matches(:matches(:radio, :checkbox)[checked], :selected) (TODO menuitem)
        checked: function(G, d) {
          return d.hasAttrib(G, "checked") || p.selected(G, d);
        },
        //:matches(input, select, textarea)[required]
        required: function(G, d) {
          return d.hasAttrib(G, "required");
        },
        //:matches(input, select, textarea):not([required])
        optional: function(G, d) {
          return !d.hasAttrib(G, "required");
        },
        //jQuery extensions
        //:not(:empty)
        parent: function(G, d) {
          return !p.empty(G, d);
        },
        //:matches(h1, h2, h3, h4, h5, h6)
        header: C(["h1", "h2", "h3", "h4", "h5", "h6"]),
        //:matches(button, input[type=button])
        button: function(G, d) {
          var t = d.getName(G);
          return t === "button" || t === "input" && d.getAttributeValue(G, "type") === "button";
        },
        //:matches(input, textarea, select, button)
        input: C(["input", "textarea", "select", "button"]),
        //input:matches(:not([type!='']), [type='text' i])
        text: function(G, d) {
          var t;
          return d.getName(G) === "input" && (!(t = d.getAttributeValue(G, "type")) || t.toLowerCase() === "text");
        }
      };
      function C(G) {
        if (typeof Set < "u") {
          var d = new Set(G);
          return function(t, s) {
            return d.has(s.getName(t));
          };
        }
        return function(t, s) {
          return G.indexOf(s.getName(t)) >= 0;
        };
      }
      function I(G, d, t) {
        if (t === null) {
          if (G.length > 2 && d !== "scope")
            throw new Error("pseudo-selector :" + d + " requires an argument");
        } else if (G.length === 2)
          throw new Error("pseudo-selector :" + d + " doesn't have any arguments");
      }
      var o = /^(?:(?:nth|last|first|only)-(?:child|of-type)|root|empty|(?:en|dis)abled|checked|not)$/;
      n.exports = {
        compile: function(G, d, t, s) {
          var b = d.name, h = d.data, S = t.adapter;
          if (t && t.strict && !o.test(b))
            throw new Error(":" + b + " isn't part of CSS3");
          if (typeof X[b] == "function")
            return X[b](G, h, t, s);
          if (typeof p[b] == "function") {
            var Y = p[b];
            return I(Y, b, h), Y === u ? Y : G === K ? function(y) {
              return Y(y, S, h);
            } : function(y) {
              return Y(y, S, h) && G(y);
            };
          } else
            throw new Error("unmatched pseudo-class :" + b);
        },
        filters: X,
        pseudos: p
      };
    },
    /* 283 */
    /***/
    function(n, l, i) {
      var c = i(284), m = i(285);
      n.exports = function(K) {
        return m(c(K));
      }, n.exports.parse = c, n.exports.compile = m;
    },
    /* 284 */
    /***/
    function(n, l) {
      n.exports = c;
      var i = /^([+\-]?\d*n)?\s*(?:([+\-]?)\s*(\d+))?$/;
      function c(m) {
        if (m = m.trim().toLowerCase(), m === "even")
          return [2, 0];
        if (m === "odd")
          return [2, 1];
        var L = m.match(i);
        if (!L)
          throw new SyntaxError("n-th rule couldn't be parsed ('" + m + "')");
        var K;
        return L[1] ? (K = parseInt(L[1], 10), isNaN(K) && (L[1].charAt(0) === "-" ? K = -1 : K = 1)) : K = 0, [
          K,
          L[3] ? parseInt((L[2] || "") + L[3], 10) : 0
        ];
      }
    },
    /* 285 */
    /***/
    function(n, l, i) {
      n.exports = K;
      var c = i(273), m = c.trueFunc, L = c.falseFunc;
      function K(u) {
        var a = u[0], e = u[1] - 1;
        if (e < 0 && a <= 0)
          return L;
        if (a === -1)
          return function(X) {
            return X <= e;
          };
        if (a === 0)
          return function(X) {
            return X === e;
          };
        if (a === 1)
          return e < 0 ? m : function(X) {
            return X >= e;
          };
        var r = e % a;
        return r < 0 && (r += a), a > 1 ? function(X) {
          return X >= e && X % a === r;
        } : (a *= -1, function(X) {
          return X <= e && X % a === r;
        });
      }
    },
    /* 286 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return h;
      });
      var c = i(12), m = i(74), L = i(1), K = i(68), u = i(250), a = i(213), e = i(218);
      i(1).glMatrix.setMatrixArrayType(Array);
      function r(S, Y) {
        if (S == null)
          return {};
        var T = X(S, Y), y, J;
        if (Object.getOwnPropertySymbols) {
          var N = Object.getOwnPropertySymbols(S);
          for (J = 0; J < N.length; J++)
            y = N[J], !(Y.indexOf(y) >= 0) && Object.prototype.propertyIsEnumerable.call(S, y) && (T[y] = S[y]);
        }
        return T;
      }
      function X(S, Y) {
        if (S == null)
          return {};
        var T = {}, y = Object.keys(S), J, N;
        for (N = 0; N < y.length; N++)
          J = y[N], !(Y.indexOf(J) >= 0) && (T[J] = S[J]);
        return T;
      }
      const W = {
        antialias: !0,
        autoRender: !0,
        alpha: !0
        // for wx-miniprogram
      }, p = Symbol("autoRender"), C = Symbol("renderer"), I = Symbol("timeline"), o = Symbol("prepareRender"), G = Symbol("tickRender"), d = Symbol("pass"), t = Symbol("fbo"), s = Symbol("tickers"), b = Symbol("layerTransformInvert");
      class h extends u.default {
        constructor(Y = {}) {
          if (super(), !Y.canvas) {
            const {
              width: N,
              height: x
            } = this.getResolution(), R = c.ENV.createCanvas(N, x, {
              offscreen: !!Y.offscreen,
              id: Y.id,
              extra: Y.extra
            });
            R.style && (R.style.position = "absolute"), R.dataset && (R.dataset.layerId = Y.id), R.contextType && (Y.contextType = R.contextType), Y.canvas = R;
          }
          const T = Y.canvas, y = Object.assign({}, W, Y);
          this[p] = y.autoRender, delete Y.autoRender;
          const J = y.Renderer || c.Renderer;
          this[C] = new J(T, y), this.options = Y, this.id = Y.id, this[d] = [], this.setResolution(T), this.canvas = T, this[I] = new m.Timeline(), this.__mouseCapturedTarget = null, this[b] = null;
        }
        get autoRender() {
          return this[p];
        }
        get displayRatio() {
          return this.parent && this.parent.options ? this.parent.options.displayRatio : 1;
        }
        get height() {
          const {
            height: Y
          } = this.getResolution();
          return Y / this.displayRatio;
        }
        get gl() {
          return this.renderer.glRenderer ? this.renderer.glRenderer.gl : null;
        }
        /* override */
        get layer() {
          return this;
        }
        get offscreen() {
          return !!this.options.offscreen || this.canvas._offscreen;
        }
        get pass() {
          return this[d];
        }
        get prepareRender() {
          return this[o] ? this[o] : Promise.resolve();
        }
        /* override */
        get renderer() {
          return this[C];
        }
        get renderOffset() {
          if (this.parent && this.parent.options) {
            const {
              left: Y,
              top: T
            } = this.parent.options;
            return [Y, T];
          }
          return [this.options.left | 0, this.options.top | 0];
        }
        get timeline() {
          return this[I];
        }
        get width() {
          const {
            width: Y
          } = this.getResolution();
          return Y / this.displayRatio;
        }
        get localMatrix() {
          const {
            x: Y,
            y: T
          } = this.attributes;
          return [1, 0, 0, 1, Y, T];
        }
        get layerTransformInvert() {
          if (this[b])
            return this[b];
          const Y = this.transformMatrix;
          return Y[0] === 1 && Y[1] === 0 && Y[2] === 0 && Y[3] === 1 && Y[4] === 0 && Y[5] === 0 ? null : (this[b] = L.mat2d.invert(Array.of(0, 0, 0, 0, 0, 0), Y), this[b]);
        }
        forceContextLoss() {
          const Y = this.renderer.glRenderer;
          if (Y) {
            const T = Y.getExtension("WEBGL_lose_context");
            if (T)
              return T.loseContext(), !0;
          }
          return !1;
        }
        // isPointCollision(x, y) {
        //   return true;
        // }
        addPass({
          vertex: Y,
          fragment: T,
          options: y,
          uniforms: J
        } = {}) {
          if (this.renderer.glRenderer) {
            const {
              width: N,
              height: x
            } = this.getResolution(), R = this.renderer.createPassProgram({
              vertex: Y,
              fragment: T,
              options: y
            }), z = new c.Figure2D();
            z.rect(0, 0, N / this.displayRatio, x / this.displayRatio);
            const Q = new c.Mesh2D(z);
            return Q.setUniforms(J), Q.setProgram(R), this[d].push(Q), this.forceUpdate(), Q;
          }
          return null;
        }
        // delete unused texture to release memory.
        deleteTexture(Y) {
          return Object(e.deleteTexture)(Y, this.renderer);
        }
        /* override */
        dispatchPointerEvent(Y) {
          const T = Y.type;
          if (T === "mousedown" || T === "mouseup" || T === "mousemove") {
            const R = this.__mouseCapturedTarget;
            if (R) {
              if (R.layer === this)
                return R.dispatchEvent(Y), !0;
              this.__mouseCapturedTarget = null;
            }
          }
          let y, J;
          const N = this.layerTransformInvert;
          if (N) {
            y = Y.x, J = Y.y;
            const R = N, z = R[0] * y + R[2] * J + R[4], Q = R[1] * y + R[3] * J + R[5];
            delete Y.x, delete Y.y, delete Y.layerX, delete Y.layerY, Object.defineProperties(Y, {
              layerX: {
                value: z,
                configurable: !0
              },
              layerY: {
                value: Q,
                configurable: !0
              },
              x: {
                value: z,
                configurable: !0
              },
              y: {
                value: Q,
                configurable: !0
              }
            });
          }
          const x = super.dispatchPointerEvent(Y);
          return N && Object.defineProperties(Y, {
            layerX: {
              value: y,
              configurable: !0
            },
            layerY: {
              value: J,
              configurable: !0
            },
            x: {
              value: y,
              configurable: !0
            },
            y: {
              value: J,
              configurable: !0
            }
          }), x;
        }
        /* override */
        forceUpdate() {
          if (!this[o])
            if (this.parent && this.parent.hasOffscreenCanvas) {
              this.parent.forceUpdate();
              let Y = null;
              const T = new Promise((y) => {
                Y = y;
              });
              T._resolve = Y, this[o] = T;
            } else {
              let Y = null, T = null;
              const y = new Promise((J) => {
                Y = J, this[p] && (T = Object(K.requestAnimationFrame)(() => {
                  delete y._requestID, this.render();
                }));
              });
              y._resolve = Y, y._requestID = T, this[o] = y;
            }
        }
        getFBO() {
          const Y = this.renderer.glRenderer, {
            width: T,
            height: y
          } = this.getResolution();
          return Y && (!this[t] || this[t].width !== T || this[t].height !== y) ? (this[t] = {
            width: T,
            height: y,
            target: Y.createFBO(),
            buffer: Y.createFBO(),
            swap() {
              [this.target, this.buffer] = [this.buffer, this.target];
            }
          }, this[t]) : this[t] ? this[t] : null;
        }
        updateGlobalTransform() {
          if (this.layerTransformInvert) {
            const Y = this.renderer, T = Y.__globalTransformMatrix || Y.globalTransformMatrix;
            Y.__globalTransformMatrix = T;
            const y = L.mat2d.fromValues(1, 0, 0, 1, 0, 0);
            Y.setGlobalTransform(...L.mat2d.multiply(y, T, this.transformMatrix));
          }
        }
        /* override */
        onPropertyChange(Y, T, y) {
          if (super.onPropertyChange(Y, T, y), Y === "zIndex" && (this.canvas.style.zIndex = T), Y === "transform" || Y === "translate" || Y === "rotate" || Y === "scale" || Y === "skew") {
            const J = this[b];
            if (this[b] = null, this.updateGlobalTransform(), J && !this.layerTransformInvert) {
              const N = this.renderer, x = N.__globalTransformMatrix || N.globalTransformMatrix;
              N.setGlobalTransform(...x);
            }
          }
        }
        _prepareRenderFinished() {
          this[o] && (this[o]._requestID && Object(K.cancelAnimationFrame)(this[o]._requestID), this[o]._resolve(), delete this[o]);
        }
        render({
          clear: Y = !0
        } = {}) {
          const T = this[d].length ? this.getFBO() : null;
          T && this.renderer.glRenderer.bindFBO(T.target), Y && this[C].clear();
          const y = this.draw();
          if (y && y.length && (this.renderer.drawMeshes(y), this.canvas.draw && this.canvas.draw()), T) {
            const J = this.renderer.glRenderer, N = this[d].length, {
              width: x,
              height: R
            } = this.getResolution(), z = [0, 0, x / this.displayRatio, R / this.displayRatio];
            this[d].forEach((Q, P) => {
              Q.blend = !0, Q.setTexture(T.target.texture, {
                rect: z
              }), P === N - 1 ? J.bindFBO(null) : (T.swap(), J.bindFBO(T.target)), this[C].clear(), this.renderer.drawMeshes([Q]);
            });
          }
          this._prepareRenderFinished();
        }
        /* override */
        setResolution({
          width: Y,
          height: T
        }) {
          const y = this.renderer, J = y.__globalTransformMatrix || y.globalTransformMatrix, N = J[4], x = J[5], R = J[0], {
            width: z,
            height: Q
          } = this.getResolution();
          (z !== Y || Q !== T) && (super.setResolution({
            width: Y,
            height: T
          }), this.canvas && (this.canvas.width = Y, this.canvas.height = T, y.updateResolution && y.updateResolution()), this.attributes.size = [Y, T], this[d].length && this[d].forEach((F) => {
            const v = new c.Figure2D();
            v.rect(0, 0, Y / this.displayRatio, T / this.displayRatio), F.contours = v.contours;
          }));
          const [P, D] = this.renderOffset, _ = this.displayRatio;
          (N !== P || x !== D || R !== _) && (y.setGlobalTransform(_, 0, 0, _, P, D), y.__globalTransformMatrix = null, this[b] = null, this.updateGlobalTransform(), this.forceUpdate());
        }
        /**
         * tick(handler, {originTime = 0, playbackRate = 1.0, duration = Infinity})
         * @param {*} handler
         * @param {*} options
         */
        tick(Y = null, T = {}) {
          let {
            duration: y = 1 / 0
          } = T, J = r(T, ["duration"]);
          const N = this.timeline.fork(J), x = this;
          this[s] = this[s] || [], this[s].push({
            handler: Y,
            duration: y
          });
          const R = () => {
            let z = null, Q = null;
            const P = () => {
              const D = this[s].map(({
                handler: _,
                duration: F
              }) => {
                const v = Math.min(1, N.currentTime / F);
                return {
                  value: _ ? _(N.currentTime, v) : null,
                  p: v
                };
              });
              x[G] || (x[G] = Promise.resolve().then(() => {
                x[p] && x.render(), delete x[G];
                for (let _ = D.length - 1; _ >= 0; _--) {
                  const {
                    value: F,
                    p: v
                  } = D[_];
                  (F === !1 || v >= 1) && this[s].splice(_, 1);
                }
                this[s].length > 0 && R();
              }));
            };
            if (this[o] && this[o]._type !== "ticker" && (Object(K.cancelAnimationFrame)(this[o]._requestID), delete this[o]), !this[o]) {
              const D = new Promise((_) => {
                z = _, Q = Object(K.requestAnimationFrame)(P);
              });
              D._resolve = z, D._requestID = Q, D._type = "ticker", this[o] = D;
            }
          };
          R();
        }
        toGlobalPos(Y, T) {
          if (this.layerTransformInvert) {
            const z = this.transformMatrix;
            Y = z[0] * Y + z[2] * T + z[4], T = z[1] * Y + z[3] * T + z[5];
          }
          const {
            width: y,
            height: J
          } = this.getResolution(), N = this.renderOffset, x = [this.canvas.clientWidth, this.canvas.clientHeight];
          Y = Y * x[0] / y + N[0], T = T * x[1] / J + N[1];
          const R = this.displayRatio;
          return Y *= R, T *= R, [Y, T];
        }
        toLocalPos(Y, T) {
          const {
            width: y,
            height: J
          } = this.getResolution(), N = this.renderOffset, x = [this.canvas.clientWidth, this.canvas.clientHeight];
          Y = Y * y / x[0] - N[0], T = T * J / x[1] - N[1];
          const R = this.displayRatio;
          Y /= R, T /= R;
          const z = this.layerTransformInvert;
          return z && (Y = z[0] * Y + z[2] * T + z[4], T = z[1] * Y + z[3] * T + z[5]), [Y, T];
        }
      }
      a.default.registerNode(h, "layer");
    },
    /* 287 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return o;
      });
      var c = i(224), m = i(288), L = i(213), K = i(252), u = i(72);
      i(1).glMatrix.setMatrixArrayType(Array);
      function a(G, d) {
        if (G == null)
          return {};
        var t = e(G, d), s, b;
        if (Object.getOwnPropertySymbols) {
          var h = Object.getOwnPropertySymbols(G);
          for (b = 0; b < h.length; b++)
            s = h[b], !(d.indexOf(s) >= 0) && Object.prototype.propertyIsEnumerable.call(G, s) && (t[s] = G[s]);
        }
        return t;
      }
      function e(G, d) {
        if (G == null)
          return {};
        var t = {}, s = Object.keys(G), b, h;
        for (h = 0; h < s.length; h++)
          b = s[h], !(d.indexOf(b) >= 0) && (t[b] = G[b]);
        return t;
      }
      function r(G, d, t) {
        return d in G ? Object.defineProperty(G, d, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : G[d] = t, G;
      }
      const X = "http://www.w3.org/2000/svg", W = Symbol.for("spritejs_setAttribute"), p = Symbol("root"), C = Symbol("task");
      function I(G, d = !0) {
        const t = G[p];
        if (t && t.children[0]) {
          const s = G.svg, b = G.layer ? G.layer.displayRatio : 1;
          if (!s.hasAttribute("data-original-width")) {
            let Y = s.getAttribute("width");
            Y = Y ? Object(u.sizeToPixel)(Y) : 300;
            let T = s.getAttribute("height");
            T = T ? Object(u.sizeToPixel)(T) : 150, s.hasAttribute("viewBox") || s.setAttribute("viewBox", `0 0 ${Math.round(Y)} ${Math.round(T)}`), s.setAttribute("data-original-width", Y), s.setAttribute("data-original-height", T);
          }
          let h = G.attributes.width || Number(s.getAttribute("data-original-width")), S = G.attributes.height || Number(s.getAttribute("data-original-height"));
          if (h *= b, S *= b, d && G.attributes.flexible) {
            const Y = G.attributes.scale[0];
            if (h *= Y, S *= Y, s.setAttribute("width", h), s.setAttribute("height", S), h && S && G.textureImage) {
              const T = G.textureImage.width, y = G.textureImage.height, J = G.clientSize;
              G.attributes.textureRect = [0, 0, Math.round(J[0] * T / h), Math.round(J[1] * y / S)];
            }
          } else
            G[C] || (s.setAttribute("width", h), s.setAttribute("height", S), G[C] = Promise.resolve().then(() => {
              delete G[C];
              const Y = t.innerHTML, T = new Blob([Y], {
                type: "image/svg+xml"
              }), y = URL.createObjectURL(T), J = new Image();
              J.onload = function() {
                J.width && J.height ? (G.attributes[W]("texture", J), G.attributes.flexible && (G.attributes.textureRect = null)) : G.attributes[W]("texture", null);
              }, J.src = y;
            }));
        }
      }
      class o extends c.default {
        constructor(d = {}) {
          typeof d == "string" && (d = {
            svgText: d
          });
          let {
            svgText: t
          } = d, s = a(d, ["svgText"]);
          if (super(s), this[p] = document.createElement("div"), t) {
            this[p].innerHTML = t;
            const b = this[p].children[0];
            b ? b.setAttribute("xmlns", X) : (fetch(t).then((h) => h.text()).then((h) => {
              this[p].innerHTML = h, (!this.observer || this.attributes.flexible) && I(this);
            }), t = null);
          }
          if (!t) {
            const b = document.createElementNS(X, "svg");
            b.setAttribute("xmlns", X), this[p].appendChild(b);
          }
          if (typeof MutationObserver == "function") {
            const b = new MutationObserver((h) => {
              I(this, !1);
            });
            b.observe(this[p], {
              attributes: !0,
              subtree: !0,
              characterData: !0,
              childList: !0
            }), this.observer = b;
          }
        }
        get children() {
          return [this.svg];
        }
        get childNodes() {
          return [this.svg];
        }
        get svg() {
          return this[p] ? this[p].children[0] : null;
        }
        /* override */
        setResolution({
          width: d,
          height: t
        }) {
          super.setResolution({
            width: d,
            height: t
          }), I(this);
        }
        /* override */
        dispatchPointerEvent(d) {
          const t = super.dispatchPointerEvent(d);
          if (t && this.attributes.passEvents && typeof MouseEvent == "function") {
            const {
              x: s,
              y: b
            } = d;
            let [h, S] = this.getOffsetPosition(s, b);
            const Y = d.originalEvent, T = this.attributes.anchor, y = this.clientSize;
            h = (h + T[0] * y[0]) / 2, S = (S + T[1] * y[1]) / 2;
            const J = d.type;
            if (J === Y.type) {
              let N = null;
              if (Y instanceof MouseEvent)
                N = new MouseEvent(J, {
                  screenX: h,
                  screenY: S,
                  clientX: h,
                  clientY: S,
                  bubbles: Y.bubbles,
                  button: Y.button,
                  buttons: Y.buttons,
                  cancelBubble: Y.cancelBubble,
                  cancelable: Y.cancelable,
                  currentTarget: Y.currentTarget,
                  fromElement: Y.fromElement,
                  relatedTarget: Y.relatedTarget,
                  returnValue: Y.returnValue,
                  srcElement: Y.srcElement,
                  target: Y.target,
                  toElement: Y.toElement,
                  // view: originalEvent.view,
                  which: Y.witch
                });
              else if (Y instanceof TouchEvent) {
                let x = null;
                const R = Y.changedTouches || [Y];
                for (let z = 0; z < R.length; z++) {
                  const Q = R[z];
                  if (d.identifier === Q.identifier) {
                    x = Q;
                    break;
                  }
                }
                if (x) {
                  const z = new Touch({
                    identifier: x.identifier,
                    target: x.target,
                    clientX: h,
                    clientY: S,
                    screenX: h,
                    screenY: S,
                    pageX: h,
                    pageY: S,
                    radiusX: x.radiusX,
                    radiusY: x.radiusY,
                    rotationAngle: x.rotationAngle,
                    force: x.force
                  });
                  N = new TouchEvent(J, {
                    cancelable: Y.cancelable,
                    bubbles: Y.bubbles,
                    composed: Y.composed,
                    touches: [z],
                    targetTouches: [z],
                    changedTouches: [z]
                  });
                }
              } else
                N = Y;
              N && this.svg.dispatchEvent(N);
            }
          }
          return t;
        }
        getElementById(d) {
          return Object(K.querySelector)(`#${d}`, this);
        }
        getElementsByClassName(d) {
          return Object(K.querySelectorAll)(`.${d}`, this);
        }
        getElementsByName(d) {
          return Object(K.querySelectorAll)(`[name="${d}"]`, this);
        }
        getElementsByTagName(d) {
          return Object(K.querySelectorAll)(d, this);
        }
        querySelector(d) {
          return Object(K.querySelector)(d, this);
        }
        querySelectorAll(d) {
          return Object(K.querySelectorAll)(d, this);
        }
        /* override */
        onPropertyChange(d, t, s) {
          super.onPropertyChange(d, t, s), d === "flexible" && I(this), this.attributes.flexible && (d === "width" || d === "height" || d === "scale" || d === "transform") && I(this);
        }
      }
      r(o, "Attr", m.default), L.default.registerNode(o, "spritesvg");
    },
    /* 288 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return u;
      });
      var c = i(225);
      i(1).glMatrix.setMatrixArrayType(Array);
      const m = Symbol.for("spritejs_getAttribute"), L = Symbol.for("spritejs_setAttribute"), K = Symbol.for("spritejs_setAttributeDefault");
      class u extends c.default {
        constructor(e) {
          super(e), this[K]({
            passEvents: !1,
            flexible: !1
          });
        }
        // readonly
        get texture() {
          return this[m]("texture");
        }
        set texture(e) {
        }
        // eslint-disable-line no-empty-function
        get passEvents() {
          return this[m]("passEvents");
        }
        set passEvents(e) {
          return this[L]("passEvents", e);
        }
        get flexible() {
          return this[m]("flexible");
        }
        set flexible(e) {
          return this[L]("flexible", e);
        }
      }
    },
    /* 289 */
    /***/
    function(n, l, i) {
      i.r(l);
      var c = i(12);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(e, r) {
        var X = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var W = Object.getOwnPropertySymbols(e);
          r && (W = W.filter(function(p) {
            return Object.getOwnPropertyDescriptor(e, p).enumerable;
          })), X.push.apply(X, W);
        }
        return X;
      }
      function L(e) {
        for (var r = 1; r < arguments.length; r++) {
          var X = arguments[r] != null ? arguments[r] : {};
          r % 2 ? m(Object(X), !0).forEach(function(W) {
            K(e, W, X[W]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(X)) : m(Object(X)).forEach(function(W) {
            Object.defineProperty(e, W, Object.getOwnPropertyDescriptor(X, W));
          });
        }
        return e;
      }
      function K(e, r, X) {
        return r in e ? Object.defineProperty(e, r, { value: X, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = X, e;
      }
      const u = Symbol("inited");
      let a = null;
      typeof Worker == "function" && (a = class extends Worker {
        constructor(e) {
          if (e.worker === !0 && (e.worker = `./${e.id}.worker.js`), super(e.worker), this.options = e, !e.canvas) {
            const {
              width: r,
              height: X
            } = this.getResolution(), W = c.ENV.createCanvas(r, X, {
              offscreen: !1
            });
            W.style && (W.style.position = "absolute"), W.dataset && (W.dataset.layerId = e.id), e.canvas = W;
          }
          this.canvas = e.canvas;
        }
        get id() {
          return this.options.id;
        }
        setResolution({
          width: e,
          height: r
        }) {
          if (this[u])
            this.postMessage({
              type: "resolution_change",
              width: e,
              height: r
            });
          else {
            this.canvas.width = e, this.canvas.height = r;
            const X = this.options, W = X.canvas.transferControlToOffscreen(), p = L({}, X);
            delete p.container, p.canvas = W, this.postMessage({
              type: "create",
              options: p
            }, [W]), this[u] = !0;
          }
        }
        getResolution() {
          if (this.canvas) {
            const {
              width: e,
              height: r
            } = this.canvas;
            return {
              width: e,
              height: r
            };
          }
          return {
            width: 300,
            height: 150
          };
        }
        remove() {
          return this.parent && this.parent.removeChild ? (this.parent.removeChild(this), !0) : !1;
        }
        connect(e, r) {
          Object.defineProperty(this, "parent", {
            value: e,
            writable: !1,
            configurable: !0
          }), Object.defineProperty(this, "zOrder", {
            value: r,
            writable: !1,
            configurable: !0
          });
        }
        disconnect() {
          delete this.parent, delete this.zOrder;
        }
        dispatchPointerEvent(e) {
          this.postMessage({
            type: "event",
            event: {
              cancelBubble: e.cancelBubble,
              bubbles: e.bubbles,
              detail: e.detail,
              identifier: e.identifier,
              layerX: e.layerX,
              layerY: e.layerY,
              originalX: e.originalX,
              originalY: e.originalY,
              type: e.type,
              x: e.x,
              y: e.y
            }
          });
        }
      }), l.default = a;
    },
    /* 290 */
    /***/
    function(n, l, i) {
      i.r(l), (function(c) {
        i.d(l, "default", function() {
          return h;
        });
        var m = i(12), L = i(68), K = i(70), u = i(286), a = i(289), e = i(250), r = i(291), X = i(214), W = i(218), p = i(213);
        i(1).glMatrix.setMatrixArrayType(Array);
        const C = Symbol("enteredTargets");
        function I(S) {
          return S.id = S.id || `_layer${Math.random().toString(36).slice(2, 12)}`, S.dataset || (S.dataset = {}), S.dataset.layerId = S.id, S.connect = (Y, T) => {
            S.parent = Y, Object.defineProperty(S, "zOrder", {
              value: T,
              writable: !1,
              configurable: !0
            });
          }, S.disconnect = (Y) => {
            delete S.zOrder;
          }, S.canvas = S, S.getResolution = () => ({
            width: 0,
            height: 0
          }), S.setResolution = () => !1, S.options = {
            handleEvent: !1
          }, S;
        }
        function o(S, Y) {
          const T = S.children;
          let y = null;
          for (let J = 0; J < T.length; J++) {
            const N = T[J];
            if ((Y === N || y != null) && (y = N), y && y !== Y && !y.offscreen)
              return y.canvas;
          }
          return null;
        }
        function G(S, Y) {
          const [T, y] = S.renderOffset, {
            width: J,
            height: N
          } = S.getResolution(), x = S.displayRatio;
          S.renderer.drawImage(Y.canvas, -T / x, -y / x, J / x, N / x);
        }
        const d = {};
        function t(S) {
          const Y = ["mousedown", "mouseup", "mousemove", "mousewheel", "wheel", "touchstart", "touchend", "touchmove", "touchcancel", "click", "dblclick", "longpress", "tap", "contextmenu"], T = S.container;
          T.addEventListener("mouseleave", (y) => {
            const J = S[C];
            if (J.size) {
              const N = new X.default("mouseleave");
              N.setOriginalEvent(y), [...J].forEach((x) => {
                x.dispatchEvent(N);
              }), S[C].clear();
            }
          }, {
            passive: !0
          }), Y.forEach((y) => {
            T.addEventListener(y, (J) => {
              const {
                left: N,
                top: x,
                displayRatio: R
              } = S.options, z = S.orderedChildren;
              Object(r.default)(J, {
                offsetLeft: N,
                offsetTop: x,
                displayRatio: R
              }).forEach((P) => {
                const D = P.identifier;
                if (P.type === "touchmove" || P.type === "touchend") {
                  const F = d[D];
                  F && F.dispatchEvent(P), P.type === "touchend" && delete d[D];
                } else {
                  for (let F = z.length - 1; F >= 0; F--) {
                    const v = z[F];
                    if (v.options.handleEvent !== !1) {
                      if (v.dispatchPointerEvent(P) && P.target !== v)
                        break;
                      P.cancelBubble = !1;
                    }
                  }
                  if (P.target === z[0])
                    for (let F = z.length - 1; F >= 0; F--) {
                      const v = z[F];
                      if (v.options.handleEvent !== !1) {
                        P.target = v;
                        break;
                      }
                    }
                }
                const _ = P.target;
                if (P.type === "touchstart" && (d[D] = P.target), P.type === "mousemove") {
                  const F = S[C];
                  let v;
                  if (_) {
                    const ii = _.ancestors || [];
                    v = /* @__PURE__ */ new Set([_, ...ii]);
                  } else
                    v = /* @__PURE__ */ new Set();
                  const O = Object.entries(J);
                  if (!F.has(_) && _) {
                    const ii = new X.default("mouseenter");
                    ii.setOriginalEvent(J), O.forEach(([$, ai]) => {
                      ii[$] = ai;
                    }), F.add(_), _.dispatchEvent(ii);
                    const ti = _.ancestors;
                    ti && ti.forEach(($) => {
                      $ instanceof K.default && !F.has($) && (F.add($), $.dispatchEvent(ii));
                    });
                  }
                  const li = new X.default("mouseleave");
                  li.setOriginalEvent(J), O.forEach(([ii, ti]) => {
                    li[ii] = ti;
                  }), [...F].forEach((ii) => {
                    v.has(ii) || (F.delete(ii), ii.dispatchEvent(li));
                  });
                }
              });
            }, {
              passive: y !== "contextmenu"
            });
          });
        }
        function s(S, Y) {
          if (Y && Y.style) {
            let {
              width: T,
              height: y,
              mode: J,
              container: N
            } = S;
            const {
              clientWidth: x,
              clientHeight: R
            } = N;
            T = T || x, y = y || R, J === "static" ? (Y.style.width = `${T}px`, Y.style.height = `${y}px`) : (Y.style.top = "0", Y.style.left = "0", Y.style.width = `${x}px`, Y.style.height = `${R}px`, Y.style.transform = "", Y.style.webkitTransform = "");
          }
        }
        const b = Symbol("offscreenLayerCount");
        class h extends e.default {
          /**
            width
            height
            mode: 'static', 'scale', 'stickyWidth', 'stickyHeight', 'stickyTop', 'stickyBottom', 'stickyLeft', 'stickyRight'
           */
          constructor(Y = {}) {
            if (super(), !Y.container)
              if (typeof m.ENV.Container == "function")
                Y.container = new m.ENV.Container(Y.width || 300, Y.height || 150);
              else
                throw new Error("No container specified.");
            if (this.container = Y.container, this.container.style && (this.container.style.overflow || (this.container.style.overflow = "hidden"), this.container.style.position || (this.container.style.position = "relative")), this.options = Y, Y.displayRatio = Y.displayRatio || 1, Y.mode = Y.mode || "scale", Y.left = 0, Y.top = 0, Y.autoResize = Y.autoResize !== !1, Y.autoResize) {
              let T;
              if (typeof globalThis < "u" ? T = globalThis : T = typeof window < "u" ? window : c, T.addEventListener) {
                const y = this;
                T.addEventListener("resize", function J() {
                  typeof document < "u" && document.contains(y.container) ? y.resize() : T.removeEventListener("resize", J);
                });
              }
            }
            this[C] = /* @__PURE__ */ new Set(), this.setResolution(Y), t(this), this[b] = 0;
          }
          get hasOffscreenCanvas() {
            return this[b] > 0;
          }
          set displayRatio(Y) {
            this.options.displayRatio !== Y && (this.options.displayRatio = Y, this.resize());
          }
          get displayRatio() {
            return this.options.displayRatio;
          }
          set height(Y) {
            this.options.height !== Y && (this.options.height = Y, this.resize());
          }
          get height() {
            return this.options.height;
          }
          set mode(Y) {
            this.options.mode !== Y && (this.options.mode = Y, this.resize());
          }
          get mode() {
            return this.options.mode;
          }
          set width(Y) {
            this.options.width !== Y && (this.options.width = Y, this.resize());
          }
          get width() {
            return this.options.width;
          }
          /* override */
          appendChild(Y) {
            !(Y instanceof u.default) && !(Y instanceof a.default) && I(Y);
            const T = super.appendChild(Y), y = Y.canvas;
            return Y.offscreen ? this[b]++ : this.container.appendChild(y), s(this.options, y), Y.setResolution(this.getResolution()), T;
          }
          /* override */
          forceUpdate() {
            this.hasOffscreenCanvas && !this._requestID && (this._requestID = Object(L.requestAnimationFrame)(() => {
              delete this._requestID, this.render();
            }));
          }
          /* override */
          insertBefore(Y, T) {
            !(Y instanceof u.default) && !(Y instanceof a.default) && I(Y);
            const y = super.insertBefore(Y, T), J = Y.canvas;
            if (!Y.offscreen) {
              const N = o(this, Y);
              this.container.insertBefore(J, N);
            }
            return s(this.options, J), Y.setResolution(this.getResolution()), y;
          }
          layer(Y = "default", T = {}) {
            T = Object.assign({}, this.options, T), T.id = Y;
            const y = this.orderedChildren;
            for (let x = 0; x < y.length; x++)
              if (y[x].id === Y)
                return y[x];
            const J = T.worker;
            let N;
            return J ? N = new a.default(T) : N = new u.default(T), this.appendChild(N), N;
          }
          async preload(...Y) {
            const T = [], y = [], J = [];
            for (let N = 0; N < Y.length; N++) {
              const x = Y[N];
              let R;
              if (typeof x == "string")
                R = Object(W.loadTexture)(x);
              else if (Array.isArray(x))
                R = Object(W.loadFrames)(...x);
              else {
                const {
                  id: z,
                  src: Q
                } = x;
                R = Object(W.loadTexture)(Q, z);
              }
              R instanceof Promise || (R = Promise.resolve(R)), y.push(R.then((z) => {
                T.push(z), J[N] = z;
                const Q = new X.default({
                  type: "preload",
                  detail: {
                    current: z,
                    loaded: T,
                    resources: Y
                  }
                });
                this.dispatchEvent(Q);
              }));
            }
            return await Promise.all(y), J;
          }
          /* override */
          removeChild(Y) {
            const T = super.removeChild(Y);
            if (T) {
              Y._prepareRenderFinished && Y._prepareRenderFinished();
              const y = Y.canvas;
              y && y.remove && y.remove(), Y.offscreen && this[b]--;
            }
            return T;
          }
          // for offscreen mode rendering
          render() {
            const Y = this.orderedChildren;
            let T = null;
            const y = [];
            for (let J = 0; J < Y.length; J++) {
              const N = Y[J], x = y.length > 0;
              if (N instanceof u.default && !N.offscreen)
                if (!N.autoRender)
                  x && (console.warn("Some offscreen canvas will not be rendered."), y.length = 0);
                else if (T = N, x) {
                  N.renderer.clear();
                  for (let R = 0; R < y.length; R++) {
                    const z = y[R];
                    z.render(), G(N, z);
                  }
                  y.length = 0, N.render({
                    clear: !1
                  });
                } else
                  N.prepareRender && N.render();
              else
                N.offscreen ? T ? (N.prepareRender && N.render(), G(T, N)) : y.push(N) : N instanceof a.default && x && (console.warn("Some offscreen canvas will not be rendered."), y.length = 0);
            }
          }
          /* override */
          replaceChild(Y, T) {
            const y = super.replaceChild(Y, T);
            T.canvas.remove && T.canvas.remove(), T.offscreen && this[b]--;
            const J = Y.canvas;
            if (!Y.offscreen) {
              const N = o(this, Y);
              this.container.insertBefore(J, N);
            }
            return s(this.options, J), Y.setResolution(this.getResolution()), y;
          }
          resize() {
            const Y = this.options;
            this.children.forEach((T) => {
              s(Y, T.canvas);
            }), this.setResolution(Y), this.dispatchEvent({
              type: "resize"
            });
          }
          /* override */
          setResolution({
            width: Y,
            height: T
          } = {}) {
            const y = this.container, {
              clientWidth: J,
              clientHeight: N
            } = y;
            (Y == null || T == null) && (Y = Y ?? J, T = T ?? N);
            const {
              mode: x,
              displayRatio: R
            } = this.options;
            if (Y *= R, T *= R, this.options.left = 0, this.options.top = 0, x === "stickyHeight" || x === "stickyLeft" || x === "stickyRight") {
              const z = Y;
              Y = J * T / N, x === "stickyHeight" && (this.options.left = 0.5 * (Y - z)), x === "stickyRight" && (this.options.left = Y - z);
            } else if (x === "stickyWidth" || x === "stickyTop" || x === "stickyBottom") {
              const z = T;
              T = N * Y / J, x === "stickyWidth" && (this.options.top = 0.5 * (T - z)), x === "stickyBottom" && (this.options.top = T - z);
            }
            super.setResolution({
              width: Y,
              height: T
            });
          }
          snapshot({
            offscreen: Y = !1,
            layers: T
          } = {}) {
            const y = Y ? "snapshotOffScreenCanvas" : "snapshotCanvas", {
              width: J,
              height: N
            } = this.getResolution();
            this[y] = this[y] || m.ENV.createCanvas(J, N, {
              offscreen: Y
            });
            const x = this[y].getContext("2d");
            T = T || this.orderedChildren, this[y].width = J, this[y].height = N;
            for (let R = 0; R < T.length; R++) {
              const z = T[R];
              if (!z.options.ignoreSnapshot) {
                z.render && z.render();
                const Q = z.canvas;
                Q && Q !== z && x.drawImage(Q, 0, 0, J, N);
              }
            }
            return this[y];
          }
        }
        typeof document < "u" && (h.prototype.layer3d = function(S, Y = {}) {
          const T = Y.url || "https://unpkg.com/sprite-extend-3d/dist/sprite-extend-3d.min.js";
          return new Promise((y, J) => {
            const N = document.createElement("script");
            N.async = !1, N.src = T, N.onload = () => {
              try {
                y(this.layer3d(S, Y));
              } catch (x) {
                J(x);
              }
            }, document.documentElement.appendChild(N);
          });
        }), p.default.registerNode(h, "scene");
      }).call(this, i(22));
    },
    /* 291 */
    /***/
    function(n, l, i) {
      i.r(l), i.d(l, "default", function() {
        return m;
      });
      var c = i(214);
      i(1).glMatrix.setMatrixArrayType(Array);
      function m(L, {
        offsetTop: K = 0,
        offsetLeft: u = 0,
        displayRatio: a = 1
      } = {}) {
        let e, r;
        const X = [], {
          left: W,
          top: p,
          width: C,
          height: I
        } = L.target.getBoundingClientRect(), o = L.target.width, G = L.target.height, d = L.changedTouches || [L];
        for (let s = 0; s < d.length; s++) {
          const b = d[s], h = b.identifier, {
            clientX: S,
            clientY: Y
          } = b;
          S != null && Y != null && X.push({
            x: Math.round((S | 0) - W),
            y: Math.round((Y | 0) - p),
            identifier: h
          });
        }
        X.length <= 0 && X.push({
          x: e,
          y: r
        });
        const t = [];
        return X.forEach((s) => {
          s.x != null && s.y != null && (e = (s.x * o / C - u) / a, r = (s.y * G / I - K) / a);
          const b = new c.default(L);
          Object.defineProperties(b, {
            layerX: {
              value: e,
              configurable: !0
            },
            layerY: {
              value: r,
              configurable: !0
            },
            originalX: {
              value: s.x
            },
            originalY: {
              value: s.y
            },
            x: {
              value: e,
              configurable: !0
            },
            y: {
              value: r,
              configurable: !0
            },
            identifier: {
              value: s.identifier
            }
          }), t.push(b);
        }), t;
      }
    }
    /******/
  ])
);
Ti.version;
Ti.Arc;
Ti.Block;
Ti.Cloud;
Ti.Color;
Ti.Ellipse;
Ti.Gradient;
Ti.Group;
Ti.Label;
Ti.Layer;
Ti.LayerWorker;
Ti.Node;
Ti.Parallel;
Ti.Path;
Ti.Polyline;
Ti.Rect;
Ti.Regular;
Ti.Ring;
Ti.Scene;
Ti.Sprite;
Ti.SpriteSvg;
Ti.Star;
Ti.Triangle;
Ti.helpers;
Ti.createElement;
Ti.isSpriteNode;
Ti.registerNode;
Ti.requestAnimationFrame;
Ti.cancelAnimationFrame;
Ti.ENV;
var Pl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Hd(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var zd = { exports: {} };
zd.exports;
(function(n) {
  var l = function() {
    var i = String.fromCharCode, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", L = {};
    function K(a, e) {
      if (!L[a]) {
        L[a] = {};
        for (var r = 0; r < a.length; r++)
          L[a][a.charAt(r)] = r;
      }
      return L[a][e];
    }
    var u = {
      compressToBase64: function(a) {
        if (a == null)
          return "";
        var e = u._compress(a, 6, function(r) {
          return c.charAt(r);
        });
        switch (e.length % 4) {
          default:
          case 0:
            return e;
          case 1:
            return e + "===";
          case 2:
            return e + "==";
          case 3:
            return e + "=";
        }
      },
      decompressFromBase64: function(a) {
        return a == null ? "" : a == "" ? null : u._decompress(a.length, 32, function(e) {
          return K(c, a.charAt(e));
        });
      },
      compressToUTF16: function(a) {
        return a == null ? "" : u._compress(a, 15, function(e) {
          return i(e + 32);
        }) + " ";
      },
      decompressFromUTF16: function(a) {
        return a == null ? "" : a == "" ? null : u._decompress(a.length, 16384, function(e) {
          return a.charCodeAt(e) - 32;
        });
      },
      //compress into uint8array (UCS-2 big endian format)
      compressToUint8Array: function(a) {
        for (var e = u.compress(a), r = new Uint8Array(e.length * 2), X = 0, W = e.length; X < W; X++) {
          var p = e.charCodeAt(X);
          r[X * 2] = p >>> 8, r[X * 2 + 1] = p % 256;
        }
        return r;
      },
      //decompress from uint8array (UCS-2 big endian format)
      decompressFromUint8Array: function(a) {
        if (a == null)
          return u.decompress(a);
        for (var e = new Array(a.length / 2), r = 0, X = e.length; r < X; r++)
          e[r] = a[r * 2] * 256 + a[r * 2 + 1];
        var W = [];
        return e.forEach(function(p) {
          W.push(i(p));
        }), u.decompress(W.join(""));
      },
      //compress into a string that is already URI encoded
      compressToEncodedURIComponent: function(a) {
        return a == null ? "" : u._compress(a, 6, function(e) {
          return m.charAt(e);
        });
      },
      //decompress from an output of compressToEncodedURIComponent
      decompressFromEncodedURIComponent: function(a) {
        return a == null ? "" : a == "" ? null : (a = a.replace(/ /g, "+"), u._decompress(a.length, 32, function(e) {
          return K(m, a.charAt(e));
        }));
      },
      compress: function(a) {
        return u._compress(a, 16, function(e) {
          return i(e);
        });
      },
      _compress: function(a, e, r) {
        if (a == null)
          return "";
        var X, W, p = {}, C = {}, I = "", o = "", G = "", d = 2, t = 3, s = 2, b = [], h = 0, S = 0, Y;
        for (Y = 0; Y < a.length; Y += 1)
          if (I = a.charAt(Y), Object.prototype.hasOwnProperty.call(p, I) || (p[I] = t++, C[I] = !0), o = G + I, Object.prototype.hasOwnProperty.call(p, o))
            G = o;
          else {
            if (Object.prototype.hasOwnProperty.call(C, G)) {
              if (G.charCodeAt(0) < 256) {
                for (X = 0; X < s; X++)
                  h = h << 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++;
                for (W = G.charCodeAt(0), X = 0; X < 8; X++)
                  h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
              } else {
                for (W = 1, X = 0; X < s; X++)
                  h = h << 1 | W, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = 0;
                for (W = G.charCodeAt(0), X = 0; X < 16; X++)
                  h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
              }
              d--, d == 0 && (d = Math.pow(2, s), s++), delete C[G];
            } else
              for (W = p[G], X = 0; X < s; X++)
                h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
            d--, d == 0 && (d = Math.pow(2, s), s++), p[o] = t++, G = String(I);
          }
        if (G !== "") {
          if (Object.prototype.hasOwnProperty.call(C, G)) {
            if (G.charCodeAt(0) < 256) {
              for (X = 0; X < s; X++)
                h = h << 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++;
              for (W = G.charCodeAt(0), X = 0; X < 8; X++)
                h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
            } else {
              for (W = 1, X = 0; X < s; X++)
                h = h << 1 | W, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = 0;
              for (W = G.charCodeAt(0), X = 0; X < 16; X++)
                h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
            }
            d--, d == 0 && (d = Math.pow(2, s), s++), delete C[G];
          } else
            for (W = p[G], X = 0; X < s; X++)
              h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
          d--, d == 0 && (d = Math.pow(2, s), s++);
        }
        for (W = 2, X = 0; X < s; X++)
          h = h << 1 | W & 1, S == e - 1 ? (S = 0, b.push(r(h)), h = 0) : S++, W = W >> 1;
        for (; ; )
          if (h = h << 1, S == e - 1) {
            b.push(r(h));
            break;
          } else
            S++;
        return b.join("");
      },
      decompress: function(a) {
        return a == null ? "" : a == "" ? null : u._decompress(a.length, 32768, function(e) {
          return a.charCodeAt(e);
        });
      },
      _decompress: function(a, e, r) {
        var X = [], W = 4, p = 4, C = 3, I = "", o = [], G, d, t, s, b, h, S, Y = { val: r(0), position: e, index: 1 };
        for (G = 0; G < 3; G += 1)
          X[G] = G;
        for (t = 0, b = Math.pow(2, 2), h = 1; h != b; )
          s = Y.val & Y.position, Y.position >>= 1, Y.position == 0 && (Y.position = e, Y.val = r(Y.index++)), t |= (s > 0 ? 1 : 0) * h, h <<= 1;
        switch (t) {
          case 0:
            for (t = 0, b = Math.pow(2, 8), h = 1; h != b; )
              s = Y.val & Y.position, Y.position >>= 1, Y.position == 0 && (Y.position = e, Y.val = r(Y.index++)), t |= (s > 0 ? 1 : 0) * h, h <<= 1;
            S = i(t);
            break;
          case 1:
            for (t = 0, b = Math.pow(2, 16), h = 1; h != b; )
              s = Y.val & Y.position, Y.position >>= 1, Y.position == 0 && (Y.position = e, Y.val = r(Y.index++)), t |= (s > 0 ? 1 : 0) * h, h <<= 1;
            S = i(t);
            break;
          case 2:
            return "";
        }
        for (X[3] = S, d = S, o.push(S); ; ) {
          if (Y.index > a)
            return "";
          for (t = 0, b = Math.pow(2, C), h = 1; h != b; )
            s = Y.val & Y.position, Y.position >>= 1, Y.position == 0 && (Y.position = e, Y.val = r(Y.index++)), t |= (s > 0 ? 1 : 0) * h, h <<= 1;
          switch (S = t) {
            case 0:
              for (t = 0, b = Math.pow(2, 8), h = 1; h != b; )
                s = Y.val & Y.position, Y.position >>= 1, Y.position == 0 && (Y.position = e, Y.val = r(Y.index++)), t |= (s > 0 ? 1 : 0) * h, h <<= 1;
              X[p++] = i(t), S = p - 1, W--;
              break;
            case 1:
              for (t = 0, b = Math.pow(2, 16), h = 1; h != b; )
                s = Y.val & Y.position, Y.position >>= 1, Y.position == 0 && (Y.position = e, Y.val = r(Y.index++)), t |= (s > 0 ? 1 : 0) * h, h <<= 1;
              X[p++] = i(t), S = p - 1, W--;
              break;
            case 2:
              return o.join("");
          }
          if (W == 0 && (W = Math.pow(2, C), C++), X[S])
            I = X[S];
          else if (S === p)
            I = d + d.charAt(0);
          else
            return null;
          o.push(I), X[p++] = d + I.charAt(0), W--, d = I, W == 0 && (W = Math.pow(2, C), C++);
        }
      }
    };
    return u;
  }();
  n != null ? n.exports = l : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
    return l;
  });
})(zd);
var ut = zd.exports;
function U0(n) {
  return JSON.parse(ut.decompress(n));
}
function Q0(n) {
  return ut.compress(JSON.stringify(n));
}
const Vd = Object.keys;
class P0 {
  constructor(l, i, c) {
    Object.defineProperty(this, "dpr", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 1
    }), Object.defineProperty(this, "collector", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "displayCanvas", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "floatCanvas", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "dustbin", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Set()
    }), this.displayCanvas = l, this.floatCanvas = i;
    const m = this.displayCanvas.getContext("2d");
    m && (this.dpr = this.getRatioWithContext(m)), this.collector = c;
  }
  getRatioWithContext(l) {
    const i = l.webkitBackingStorePixelRatio || l.mozBackingStorePixelRatio || l.msBackingStorePixelRatio || l.oBackingStorePixelRatio || l.backingStorePixelRatio || 1;
    return Math.max(1, (window.devicePixelRatio || 1) / i);
  }
  /** 设置当前选中的工具配置数据 */
  setCurrentToolsData(l) {
    this.currentToolsData = l;
  }
  /** 设置当前绘制任务数据 */
  setCurrentLocalWorkData(l) {
    this.currentLocalWorkData = l;
  }
  /** 设置相机参数 */
  setCameraOpt(l) {
    this.cameraOpt = l;
  }
  /** 获取当前绘制任务id */
  getWorkId() {
    return this.currentLocalWorkData.workId;
  }
}
function E0(n) {
  let l;
  try {
    if (l = rs && (window.URL || window.webkitURL).createObjectURL(rs), !l)
      throw "";
    const i = new Worker(l, {
      name: n == null ? void 0 : n.name
    });
    return i.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(l);
    }), i;
  } catch {
    return new Worker(
      "data:application/javascript;base64," + Gt,
      {
        name: n == null ? void 0 : n.name
      }
    );
  } finally {
    l && (window.URL || window.webkitURL).revokeObjectURL(l);
  }
}
function w0(n) {
  let l;
  try {
    if (l = Ks && (window.URL || window.webkitURL).createObjectURL(Ks), !l)
      throw "";
    const i = new Worker(l, {
      name: n == null ? void 0 : n.name
    });
    return i.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(l);
    }), i;
  } catch {
    return new Worker(
      "data:application/javascript;base64," + ht,
      {
        name: n == null ? void 0 : n.name
      }
    );
  } finally {
    l && (window.URL || window.webkitURL).revokeObjectURL(l);
  }
}
class $i extends P0 {
  constructor(l, i, c, m) {
    var K, u;
    super(l, i, c), Object.defineProperty(this, "threadEngine", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pluginOptions", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "layerOpt", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "msgEmitter", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "offscreenCanvasOpt", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cameraOpt", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "translate", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: [0, 0]
    }), Object.defineProperty(this, "localPointsBatchData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
    }), Object.defineProperty(this, "taskBatchData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
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
    }), Object.defineProperty(this, "animationId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "workerLockId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "isRunSubWork", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !0
    }), Object.defineProperty(this, "subWorker", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "maxDrawCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "wokerDrawCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "reRenders", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: []
    }), this.pluginOptions = m, $i.maxLastSyncTime = ((K = m == null ? void 0 : m.syncOpt) == null ? void 0 : K.interval) || $i.maxLastSyncTime, this.msgEmitter = new E0();
    const L = {
      ...$i.defaultScreenCanvasOpt,
      ...(u = this.pluginOptions) == null ? void 0 : u.canvasOpt,
      width: l.offsetWidth,
      height: l.offsetHeight
    };
    this.offscreenCanvasOpt = L, this.layerOpt = $i.defauleLayerOpt, this.setLayerOpt(this.layerOpt), this.setCurrentLocalWorkData({
      workId: void 0,
      workState: Bi.Pending
    }), this.createThreadEngine(), this.on(), this.createOptimizationWorker();
  }
  createOptimizationWorker() {
    this.subWorker = new w0(), this.subWorker.onmessage = (l) => {
      if (l.data) {
        const { render: i, drawCount: c } = l.data;
        if (!c && i) {
          this.render(i);
          return;
        }
        c && (c > this.maxDrawCount && (this.maxDrawCount = c), i && (c > this.wokerDrawCount && (i.isUnClose = !0, this.reRenders.push(i)), this.render(i)));
      }
    };
  }
  subPost(l) {
    var c;
    const i = l.filter((m) => m.msgType === Fi.UpdateScene || m.dataType === Ai.Local);
    i.length && ((c = this.subWorker) == null || c.postMessage(i));
  }
  destroySubWorker() {
    this.subWorker && (this.subWorker.terminate(), this.subWorker = void 0, this.isRunSubWork = !1);
  }
  createThreadEngine() {
    this.taskBatchData.push({
      msgType: Fi.Init,
      dataType: Ai.Local,
      offscreenCanvasOpt: this.offscreenCanvasOpt,
      layerOpt: this.layerOpt,
      dpr: this.dpr
    }), this.runAnimation();
  }
  render(l) {
    var e;
    const { rect: i, imageBitmap: c, isClear: m, isUnClose: L, drawCanvas: K, clearCanvas: u } = l, a = K === Ol.Float ? this.floatCanvas.getContext("2d") : this.displayCanvas.getContext("2d");
    if (i && a && c) {
      const r = ((e = this.cameraOpt) == null ? void 0 : e.scale) || 1, X = r < 1 ? r : 1 + Math.abs(r - 1), W = r < 1 ? i.w / r : i.w * X, p = r < 1 ? i.h / r : i.h * X, C = (i.x + this.translate[0]) * r * this.dpr, I = (i.y + this.translate[1]) * r * this.dpr, o = W * this.dpr, G = p * this.dpr;
      if (m) {
        const d = u === Ol.Float ? this.floatCanvas.getContext("2d") : this.displayCanvas.getContext("2d");
        d == null || d.clearRect(C, I, o, G);
      }
      if (a.drawImage(c, 0, 0, o, G, C, I, o, G), L)
        return;
      c.close();
    }
  }
  runAnimation() {
    this.animationId || (this.animationId = requestAnimationFrame(this.consume.bind(this)));
  }
  setLayerOpt(l) {
    this.layerOpt = l;
  }
  updateCanvas(l, i) {
    var u;
    if (this.currentLocalWorkData.workState === Bi.Unwritable)
      return;
    const { width: m, height: L } = l;
    this.displayCanvas.width = m * this.dpr, this.displayCanvas.height = L * this.dpr, this.floatCanvas.width = m * this.dpr, this.floatCanvas.height = L * this.dpr, this.offscreenCanvasOpt = l;
    const K = {
      msgType: Fi.UpdateScene,
      offscreenCanvasOpt: this.offscreenCanvasOpt,
      workId: "",
      dataType: i
    };
    this.taskBatchData.push(K), i === Ai.Local && ((u = this.collector) == null || u.dispatch({
      type: Fi.UpdateScene,
      w: m,
      h: L
    })), this.runAnimation();
  }
  pushPoint(l) {
    this.localPointsBatchData.push(l[0], l[1]);
  }
  transformToScenePoint(l) {
    var c;
    const i = l;
    return (c = this.cameraOpt) != null && c.scale && this.translate && (i[0] = l[0] / this.cameraOpt.scale - this.translate[0], i[1] = l[1] / this.cameraOpt.scale - this.translate[1]), i;
  }
  initSyncData(l) {
    var c, m;
    const i = (c = this.collector) == null ? void 0 : c.storage;
    if (i) {
      for (const L of Object.keys(i)) {
        if (l(L, i[L]), L === "screen") {
          const { w: u, h: a } = i[L];
          i[L] && u && a && this.updateCanvas({
            ...this.offscreenCanvasOpt,
            width: u,
            height: a
          }, Ai.Service);
          continue;
        }
        const K = (m = i[L]) == null ? void 0 : m.type;
        if (K && L) {
          const u = i[L];
          u.workId = L, u.msgType = K, u.dataType = Ai.Service, this.taskBatchData.push(u);
        }
      }
      this.runAnimation();
    }
  }
  onServiceDerive(l, i) {
    const { newValue: c, oldValue: m } = i, L = c || {}, K = l;
    let u = L.type;
    if (!(!c && m && (u = Fi.RemoveNode, m.toolstype === sl.LaserPen))) {
      if (u && K) {
        const a = L;
        a.workId = this.collector.isOwn(l) ? this.collector.getLocalId(l) : K, a.msgType = u, a.dataType = Ai.Service, this.taskBatchData.push(a);
      }
      this.runAnimation();
    }
  }
  onLocalEventEnd(l) {
    const i = this.currentLocalWorkData.workState;
    if (!(i === Bi.Freeze || i === Bi.Unwritable) && (i === Bi.Start || i === Bi.Doing)) {
      const c = this.transformToScenePoint(l);
      this.pushPoint(c), this.maxDrawCount = 0, this.wokerDrawCount = 0, this.reRenders.length = 0, this.setCurrentLocalWorkData({ workId: this.currentLocalWorkData.workId, workState: Bi.Done });
    }
  }
  onLocalEventDoing(l) {
    let i = this.currentLocalWorkData.workState;
    if (!(i === Bi.Freeze || i === Bi.Unwritable) && (i === Bi.Start && (i = Bi.Doing, this.setCurrentLocalWorkData({ workId: this.currentLocalWorkData.workId, workState: i })), i === Bi.Doing)) {
      const c = this.transformToScenePoint(l);
      this.pushPoint(c);
    }
  }
  onLocalEventStart(l) {
    var L;
    const { workState: i } = this.currentLocalWorkData;
    if (i === Bi.Freeze || i === Bi.Unwritable)
      return;
    const c = Date.now();
    this.setCurrentLocalWorkData({
      workId: c,
      workState: Bi.Start
    }, Fi.CreateWork);
    const m = this.transformToScenePoint(l);
    this.pushPoint(m), this.runAnimation(), (L = this.collector) == null || L.dispatch({
      type: Fi.CreateWork,
      workId: c,
      toolstype: this.currentToolsData.toolsType,
      opt: this.currentToolsData.toolsOpt
    });
  }
  consume() {
    this.animationId = void 0;
    const l = this.currentLocalWorkData.workState;
    this.workerLockId || (this.localPointsBatchData.length && this.taskBatchData.push({
      op: this.localPointsBatchData,
      workState: l,
      workId: this.currentLocalWorkData.workId,
      dataType: Ai.Local,
      msgType: Fi.DrawWork,
      drawCount: this.maxDrawCount
    }), this.taskBatchData.length && (this.post(this.taskBatchData), this.taskBatchData.length = 0, this.localPointsBatchData.length = 0)), (l === Bi.Doing || l === Bi.Start || this.taskBatchData.length || this.localPointsBatchData.length) && (this.animationId = requestAnimationFrame(this.consume.bind(this)));
  }
  clearAll(l = !1) {
    var m;
    this.taskBatchData.push({
      dataType: Ai.Local,
      msgType: Fi.Clear
    });
    const i = this.displayCanvas.getContext("2d");
    i == null || i.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    const c = this.floatCanvas.getContext("2d");
    c == null || c.clearRect(0, 0, this.floatCanvas.width, this.floatCanvas.height), l || (m = this.collector) == null || m.dispatch({
      type: Fi.Clear
    });
  }
  unabled() {
    this.setCurrentLocalWorkData({ workState: Bi.Freeze, workId: void 0 });
  }
  abled() {
    this.setCurrentLocalWorkData({ workState: Bi.Pending, workId: void 0 });
  }
  destroy() {
    this.msgEmitter.terminate(), this.destroySubWorker();
  }
  post(l) {
    this.msgEmitter.postMessage(l), this.isRunSubWork && this.subPost(this.taskBatchData);
  }
  on() {
    this.msgEmitter.onmessage = (l) => {
      if (l.data) {
        const { render: i, sp: c, drawCount: m } = l.data;
        if (c != null && c.length && this.collectorSyncData(c), !m && i) {
          this.render(i);
          return;
        }
        m && (this.wokerDrawCount = m, m > this.maxDrawCount && (this.maxDrawCount = m), i && (this.render(i), m < this.maxDrawCount && (this.reRenders.forEach((L) => {
          L.isUnClose = !1, this.render(L);
        }), this.reRenders.length = 0)));
      }
    };
  }
  collectorSyncData(l) {
    for (const i of l) {
      const { type: c, op: m, workId: L, index: K, removeIds: u, ops: a } = i;
      switch (c) {
        case Fi.DrawWork:
          m != null && m.length && L && typeof K == "number" && requestIdleCallback(() => {
            var e;
            (e = this.collector) == null || e.dispatch({
              type: c,
              op: m,
              workId: L,
              index: K
            });
          }, { timeout: $i.maxLastSyncTime });
          break;
        case Fi.FullWork:
          a && requestIdleCallback(() => {
            var e;
            (e = this.collector) == null || e.dispatch({ type: c, ops: a, workId: L });
          }, { timeout: $i.maxLastSyncTime });
          break;
        case Fi.RemoveNode:
          (m || u != null && u.length) && requestIdleCallback(() => {
            var e;
            (e = this.collector) == null || e.dispatch({ type: c, removeIds: u });
          }, { timeout: $i.maxLastSyncTime });
          break;
      }
    }
  }
  updateNode(l, i) {
    this.taskBatchData.push({
      msgType: Fi.UpdateNode,
      workId: l,
      updateNodeOpt: i,
      dataType: Ai.Local
    }), this.collector.dispatch({
      type: Fi.UpdateNode,
      workId: l,
      updateNodeOpt: i
    }), this.runAnimation();
  }
  setCurrentLocalWorkData(l, i = Fi.None) {
    super.setCurrentLocalWorkData(l);
    const { workState: c, workId: m } = l;
    c !== Bi.Unwritable && i !== Fi.None && (this.taskBatchData.push({
      msgType: i,
      workId: m,
      toolsType: this.currentToolsData.toolsType,
      opt: { ...this.currentToolsData.toolsOpt, syncUnitTime: $i.maxLastSyncTime },
      dataType: Ai.Local
    }), this.runAnimation());
  }
  setCurrentToolsData(l) {
    super.setCurrentToolsData(l), this.taskBatchData.push({
      msgType: Fi.UpdateTools,
      dataType: Ai.Local,
      toolsType: l.toolsType,
      opt: { ...l.toolsOpt, syncUnitTime: $i.maxLastSyncTime }
    }), (l == null ? void 0 : l.toolsType) === sl.Eraser ? this.isRunSubWork = !1 : this.isRunSubWork = !0, this.runAnimation();
  }
  setCameraOpt(l) {
    if (super.setCameraOpt(l), l.scale && this.offscreenCanvasOpt) {
      const i = this.offscreenCanvasOpt.width, c = this.offscreenCanvasOpt.height, m = l.scale < 1 ? l.scale : 1 + Math.abs(l.scale - 1);
      this.translate = [i * (1 - m) * 0.5 / m, c * (1 - m) * 0.5 / m];
      const L = this.cameraOpt.centerX || 0, K = this.cameraOpt.centerY || 0;
      (L || K) && (this.translate = [this.translate[0] - L, this.translate[1] - K]), this.taskBatchData.push({
        msgType: Fi.Transform,
        dataType: Ai.Local,
        scale: m,
        translate: this.translate
      }), this.runAnimation();
    }
  }
}
Object.defineProperty($i, "defaultScreenCanvasOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    autoRender: !1,
    contextType: Sd.Canvas2d
  }
});
Object.defineProperty($i, "defauleLayerOpt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    offscreen: !0,
    handleEvent: !1,
    depth: !1
  }
});
Object.defineProperty($i, "maxLastSyncTime", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 500
});
var j0 = Object.is, Vt = (n, l) => {
  try {
    n(l);
  } catch (i) {
    console.error(i);
  }
}, B0 = /* @__PURE__ */ Promise.resolve(), Md = [/* @__PURE__ */ new Set(), /* @__PURE__ */ new Set()], Fl = 0, Rd, O0 = () => {
  const n = Md[Fl];
  Fl = 1 - Fl, Rd = !1;
  for (const l of n)
    l.exec(
      1
      /* Async */
    );
  n.clear();
}, D0 = (n) => {
  Md[Fl].add(n), Rd = Rd || B0.then(O0);
}, A0 = (n) => Md[Fl].delete(n), Tl, xd, Nl, cl, Ll, al, et, q0 = (et = class {
  constructor(n, l) {
    Xl(this, Tl);
    dl(this, "dirty", !1);
    dl(this, "subs", /* @__PURE__ */ new Map());
    Xl(this, Nl, void 0);
    dl(this, 1, 0);
    dl(this, 2, 0);
    dl(this, 3, 0);
    Xl(this, cl, /* @__PURE__ */ new Set());
    Xl(this, Ll, void 0);
    Xl(this, al, void 0);
    Vl(this, Nl, n), Vl(this, Ll, l);
  }
  notify() {
    il(this, cl).clear(), this.subs.size > 0 ? (this.exec(
      3
      /* Computed */
    ), this.exec(
      2
      /* Eager */
    ), this[
      1
      /* Async */
    ] > 0 && D0(this)) : this.dirty = !1;
  }
  add(n, l) {
    il(this, Ll) && this.subs.size <= 0 && Vl(this, al, il(this, Ll).call(this, this));
    const i = this.subs.get(n);
    return i && this[i]--, il(this, cl).add(n), this.subs.set(n, l), this[l]++, () => this.remove(n);
  }
  remove(n) {
    il(this, cl).delete(n);
    const l = this.subs.get(n);
    l && (this.subs.delete(n), this[l]--, this.subs.size <= 0 && hd(this, Tl, xd).call(this));
  }
  clear() {
    this.subs.clear(), il(this, cl).clear(), this[
      1
      /* Async */
    ] = this[
      2
      /* Eager */
    ] = this[
      3
      /* Computed */
    ] = 0, A0(this), hd(this, Tl, xd).call(this);
  }
  exec(n) {
    if (this[n] > 0) {
      let l;
      if (n === 3)
        this[
          1
          /* Async */
        ] + this[
          2
          /* Eager */
        ] <= 0 && (this.dirty = !1);
      else {
        if (l = il(this, Nl).call(this), !this.dirty)
          return;
        (n === 1 || /* mode === SubscriberMode.Eager && */
        this[
          1
          /* Async */
        ] <= 0) && (this.dirty = !1);
      }
      for (const [i, c] of this.subs)
        c === n && !il(this, cl).has(i) && Vt(i, l);
    }
  }
}, Tl = new WeakSet(), xd = function() {
  il(this, al) && Vl(this, al, il(this, al).call(this));
}, Nl = new WeakMap(), cl = new WeakMap(), Ll = new WeakMap(), al = new WeakMap(), et), yl, Wt, $0 = (Wt = class {
  /**
   * @param get A pure function that returns the current value of the val.
   * @param config Custom config for the val.
   * @param start A function that is called when a val get its first subscriber.
   *        The returned disposer will be called when the last subscriber unsubscribed from the val.
   */
  constructor(n, { equal: l, compare: i, eager: c } = {}, m) {
    /**
     * Manage subscribers for a val.
     */
    dl(this, "_subs");
    Xl(this, yl, void 0);
    dl(this, "get");
    dl(this, "equal");
    /**
     * @ignore
     * @deprecated Use `equal` instead.
     */
    dl(this, "compare");
    this.get = n, this.compare = this.equal = l || i || j0, Vl(this, yl, c), this._subs = new q0(n, m);
  }
  get value() {
    return this.get();
  }
  reaction(n, l = il(this, yl)) {
    return this._subs.add(
      n,
      l ? 2 : 1
      /* Async */
    );
  }
  subscribe(n, l = il(this, yl)) {
    const i = this.reaction(n, l);
    return Vt(n, this.value), this._subs.dirty = !1, i;
  }
  $valCompute(n) {
    return this._subs.add(
      n,
      3
      /* Computed */
    );
  }
  unsubscribe(n) {
    n ? this._subs.remove(n) : this._subs.clear();
  }
  dispose() {
    this._subs.clear();
  }
  /**
   * @returns the string representation of `this.value`.
   *
   * @example
   * ```js
   * const v$ = val(val(val(1)));
   * console.log(`${v$}`); // "1"
   * ```
   */
  toString() {
    return String(this.value);
  }
  /**
   * @returns the JSON representation of `this.value`.
   *
   * @example
   * ```js
   * const v$ = val(val(val({ a: 1 })));
   * JSON.stringify(v$); // '{"a":1}'
   * ```
   */
  toJSON(n) {
    const l = this.value;
    return l && l.toJSON ? l.toJSON(n) : l;
  }
}, yl = new WeakMap(), Wt), _0 = class extends $0 {
  constructor(l, i) {
    super(() => l, i);
    dl(this, "set");
    this.set = (m) => {
      this.equal(m, l) || (this._subs.dirty = !0, l = m, this._subs.notify());
    };
  }
  get value() {
    return this.get();
  }
  set value(l) {
    this.set(l);
  }
};
function It(n, l) {
  return new _0(n, l);
}
var ib = (n, l) => {
  var i;
  return (i = n.set) == null ? void 0 : i.call(n, l);
}, Yd = { exports: {} }, Jl = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Jl.exports;
var Ss;
function lb() {
  return Ss || (Ss = 1, function(n, l) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var i = "18.2.0", c = Symbol.for("react.element"), m = Symbol.for("react.portal"), L = Symbol.for("react.fragment"), K = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), e = Symbol.for("react.context"), r = Symbol.for("react.forward_ref"), X = Symbol.for("react.suspense"), W = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), C = Symbol.for("react.lazy"), I = Symbol.for("react.offscreen"), o = Symbol.iterator, G = "@@iterator";
      function d(E) {
        if (E === null || typeof E != "object")
          return null;
        var di = o && E[o] || E[G];
        return typeof di == "function" ? di : null;
      }
      var t = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, s = {
        transition: null
      }, b = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, h = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, S = {}, Y = null;
      function T(E) {
        Y = E;
      }
      S.setExtraStackFrame = function(E) {
        Y = E;
      }, S.getCurrentStack = null, S.getStackAddendum = function() {
        var E = "";
        Y && (E += Y);
        var di = S.getCurrentStack;
        return di && (E += di() || ""), E;
      };
      var y = !1, J = !1, N = !1, x = !1, R = !1, z = {
        ReactCurrentDispatcher: t,
        ReactCurrentBatchConfig: s,
        ReactCurrentOwner: h
      };
      z.ReactDebugCurrentFrame = S, z.ReactCurrentActQueue = b;
      function Q(E) {
        {
          for (var di = arguments.length, ei = new Array(di > 1 ? di - 1 : 0), ui = 1; ui < di; ui++)
            ei[ui - 1] = arguments[ui];
          D("warn", E, ei);
        }
      }
      function P(E) {
        {
          for (var di = arguments.length, ei = new Array(di > 1 ? di - 1 : 0), ui = 1; ui < di; ui++)
            ei[ui - 1] = arguments[ui];
          D("error", E, ei);
        }
      }
      function D(E, di, ei) {
        {
          var ui = z.ReactDebugCurrentFrame, Vi = ui.getStackAddendum();
          Vi !== "" && (di += "%s", ei = ei.concat([Vi]));
          var Ki = ei.map(function(pi) {
            return String(pi);
          });
          Ki.unshift("Warning: " + di), Function.prototype.apply.call(console[E], console, Ki);
        }
      }
      var _ = {};
      function F(E, di) {
        {
          var ei = E.constructor, ui = ei && (ei.displayName || ei.name) || "ReactClass", Vi = ui + "." + di;
          if (_[Vi])
            return;
          P("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", di, ui), _[Vi] = !0;
        }
      }
      var v = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(E) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(E, di, ei) {
          F(E, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(E, di, ei, ui) {
          F(E, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(E, di, ei, ui) {
          F(E, "setState");
        }
      }, O = Object.assign, li = {};
      Object.freeze(li);
      function ii(E, di, ei) {
        this.props = E, this.context = di, this.refs = li, this.updater = ei || v;
      }
      ii.prototype.isReactComponent = {}, ii.prototype.setState = function(E, di) {
        if (typeof E != "object" && typeof E != "function" && E != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, E, di, "setState");
      }, ii.prototype.forceUpdate = function(E) {
        this.updater.enqueueForceUpdate(this, E, "forceUpdate");
      };
      {
        var ti = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, $ = function(E, di) {
          Object.defineProperty(ii.prototype, E, {
            get: function() {
              Q("%s(...) is deprecated in plain JavaScript React classes. %s", di[0], di[1]);
            }
          });
        };
        for (var ai in ti)
          ti.hasOwnProperty(ai) && $(ai, ti[ai]);
      }
      function Xi() {
      }
      Xi.prototype = ii.prototype;
      function M(E, di, ei) {
        this.props = E, this.context = di, this.refs = li, this.updater = ei || v;
      }
      var k = M.prototype = new Xi();
      k.constructor = M, O(k, ii.prototype), k.isPureReactComponent = !0;
      function j() {
        var E = {
          current: null
        };
        return Object.seal(E), E;
      }
      var A = Array.isArray;
      function H(E) {
        return A(E);
      }
      function U(E) {
        {
          var di = typeof Symbol == "function" && Symbol.toStringTag, ei = di && E[Symbol.toStringTag] || E.constructor.name || "Object";
          return ei;
        }
      }
      function Z(E) {
        try {
          return V(E), !1;
        } catch {
          return !0;
        }
      }
      function V(E) {
        return "" + E;
      }
      function g(E) {
        if (Z(E))
          return P("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", U(E)), V(E);
      }
      function f(E, di, ei) {
        var ui = E.displayName;
        if (ui)
          return ui;
        var Vi = di.displayName || di.name || "";
        return Vi !== "" ? ei + "(" + Vi + ")" : ei;
      }
      function w(E) {
        return E.displayName || "Context";
      }
      function B(E) {
        if (E == null)
          return null;
        if (typeof E.tag == "number" && P("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof E == "function")
          return E.displayName || E.name || null;
        if (typeof E == "string")
          return E;
        switch (E) {
          case L:
            return "Fragment";
          case m:
            return "Portal";
          case u:
            return "Profiler";
          case K:
            return "StrictMode";
          case X:
            return "Suspense";
          case W:
            return "SuspenseList";
        }
        if (typeof E == "object")
          switch (E.$$typeof) {
            case e:
              var di = E;
              return w(di) + ".Consumer";
            case a:
              var ei = E;
              return w(ei._context) + ".Provider";
            case r:
              return f(E, E.render, "ForwardRef");
            case p:
              var ui = E.displayName || null;
              return ui !== null ? ui : B(E.type) || "Memo";
            case C: {
              var Vi = E, Ki = Vi._payload, pi = Vi._init;
              try {
                return B(pi(Ki));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var q = Object.prototype.hasOwnProperty, si = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, bi, mi, oi;
      oi = {};
      function Zi(E) {
        if (q.call(E, "ref")) {
          var di = Object.getOwnPropertyDescriptor(E, "ref").get;
          if (di && di.isReactWarning)
            return !1;
        }
        return E.ref !== void 0;
      }
      function ci(E) {
        if (q.call(E, "key")) {
          var di = Object.getOwnPropertyDescriptor(E, "key").get;
          if (di && di.isReactWarning)
            return !1;
        }
        return E.key !== void 0;
      }
      function ni(E, di) {
        var ei = function() {
          bi || (bi = !0, P("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", di));
        };
        ei.isReactWarning = !0, Object.defineProperty(E, "key", {
          get: ei,
          configurable: !0
        });
      }
      function Gi(E, di) {
        var ei = function() {
          mi || (mi = !0, P("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", di));
        };
        ei.isReactWarning = !0, Object.defineProperty(E, "ref", {
          get: ei,
          configurable: !0
        });
      }
      function hi(E) {
        if (typeof E.ref == "string" && h.current && E.__self && h.current.stateNode !== E.__self) {
          var di = B(h.current.type);
          oi[di] || (P('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', di, E.ref), oi[di] = !0);
        }
      }
      var Wi = function(E, di, ei, ui, Vi, Ki, pi) {
        var Ri = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: c,
          // Built-in properties that belong on the element
          type: E,
          key: di,
          ref: ei,
          props: pi,
          // Record the component responsible for creating this element.
          _owner: Ki
        };
        return Ri._store = {}, Object.defineProperty(Ri._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Ri, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ui
        }), Object.defineProperty(Ri, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: Vi
        }), Object.freeze && (Object.freeze(Ri.props), Object.freeze(Ri)), Ri;
      };
      function Ii(E, di, ei) {
        var ui, Vi = {}, Ki = null, pi = null, Ri = null, Ci = null;
        if (di != null) {
          Zi(di) && (pi = di.ref, hi(di)), ci(di) && (g(di.key), Ki = "" + di.key), Ri = di.__self === void 0 ? null : di.__self, Ci = di.__source === void 0 ? null : di.__source;
          for (ui in di)
            q.call(di, ui) && !si.hasOwnProperty(ui) && (Vi[ui] = di[ui]);
        }
        var Ni = arguments.length - 2;
        if (Ni === 1)
          Vi.children = ei;
        else if (Ni > 1) {
          for (var vi = Array(Ni), Ui = 0; Ui < Ni; Ui++)
            vi[Ui] = arguments[Ui + 2];
          Object.freeze && Object.freeze(vi), Vi.children = vi;
        }
        if (E && E.defaultProps) {
          var Ei = E.defaultProps;
          for (ui in Ei)
            Vi[ui] === void 0 && (Vi[ui] = Ei[ui]);
        }
        if (Ki || pi) {
          var Oi = typeof E == "function" ? E.displayName || E.name || "Unknown" : E;
          Ki && ni(Vi, Oi), pi && Gi(Vi, Oi);
        }
        return Wi(E, Ki, pi, Ri, Ci, h.current, Vi);
      }
      function xi(E, di) {
        var ei = Wi(E.type, di, E.ref, E._self, E._source, E._owner, E.props);
        return ei;
      }
      function yi(E, di, ei) {
        if (E == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + E + ".");
        var ui, Vi = O({}, E.props), Ki = E.key, pi = E.ref, Ri = E._self, Ci = E._source, Ni = E._owner;
        if (di != null) {
          Zi(di) && (pi = di.ref, Ni = h.current), ci(di) && (g(di.key), Ki = "" + di.key);
          var vi;
          E.type && E.type.defaultProps && (vi = E.type.defaultProps);
          for (ui in di)
            q.call(di, ui) && !si.hasOwnProperty(ui) && (di[ui] === void 0 && vi !== void 0 ? Vi[ui] = vi[ui] : Vi[ui] = di[ui]);
        }
        var Ui = arguments.length - 2;
        if (Ui === 1)
          Vi.children = ei;
        else if (Ui > 1) {
          for (var Ei = Array(Ui), Oi = 0; Oi < Ui; Oi++)
            Ei[Oi] = arguments[Oi + 2];
          Vi.children = Ei;
        }
        return Wi(E.type, Ki, pi, Ri, Ci, Ni, Vi);
      }
      function Li(E) {
        return typeof E == "object" && E !== null && E.$$typeof === c;
      }
      var ri = ".", Si = ":";
      function wi(E) {
        var di = /[=:]/g, ei = {
          "=": "=0",
          ":": "=2"
        }, ui = E.replace(di, function(Vi) {
          return ei[Vi];
        });
        return "$" + ui;
      }
      var Mi = !1, Qi = /\/+/g;
      function ki(E) {
        return E.replace(Qi, "$&/");
      }
      function Pi(E, di) {
        return typeof E == "object" && E !== null && E.key != null ? (g(E.key), wi("" + E.key)) : di.toString(36);
      }
      function fi(E, di, ei, ui, Vi) {
        var Ki = typeof E;
        (Ki === "undefined" || Ki === "boolean") && (E = null);
        var pi = !1;
        if (E === null)
          pi = !0;
        else
          switch (Ki) {
            case "string":
            case "number":
              pi = !0;
              break;
            case "object":
              switch (E.$$typeof) {
                case c:
                case m:
                  pi = !0;
              }
          }
        if (pi) {
          var Ri = E, Ci = Vi(Ri), Ni = ui === "" ? ri + Pi(Ri, 0) : ui;
          if (H(Ci)) {
            var vi = "";
            Ni != null && (vi = ki(Ni) + "/"), fi(Ci, di, vi, "", function(g0) {
              return g0;
            });
          } else
            Ci != null && (Li(Ci) && (Ci.key && (!Ri || Ri.key !== Ci.key) && g(Ci.key), Ci = xi(
              Ci,
              // Keep both the (mapped) and old keys if they differ, just as
              // traverseAllChildren used to do for objects as children
              ei + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
              (Ci.key && (!Ri || Ri.key !== Ci.key) ? (
                // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                // eslint-disable-next-line react-internal/safe-string-coercion
                ki("" + Ci.key) + "/"
              ) : "") + Ni
            )), di.push(Ci));
          return 1;
        }
        var Ui, Ei, Oi = 0, Di = ui === "" ? ri : ui + Si;
        if (H(E))
          for (var Ql = 0; Ql < E.length; Ql++)
            Ui = E[Ql], Ei = Di + Pi(Ui, Ql), Oi += fi(Ui, di, ei, Ei, Vi);
        else {
          var ud = d(E);
          if (typeof ud == "function") {
            var hs = E;
            ud === hs.entries && (Mi || Q("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Mi = !0);
            for (var T0 = ud.call(hs), Vs, N0 = 0; !(Vs = T0.next()).done; )
              Ui = Vs.value, Ei = Di + Pi(Ui, N0++), Oi += fi(Ui, di, ei, Ei, Vi);
          } else if (Ki === "object") {
            var Is = String(E);
            throw new Error("Objects are not valid as a React child (found: " + (Is === "[object Object]" ? "object with keys {" + Object.keys(E).join(", ") + "}" : Is) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Oi;
      }
      function ji(E, di, ei) {
        if (E == null)
          return E;
        var ui = [], Vi = 0;
        return fi(E, ui, "", "", function(Ki) {
          return di.call(ei, Ki, Vi++);
        }), ui;
      }
      function Ji(E) {
        var di = 0;
        return ji(E, function() {
          di++;
        }), di;
      }
      function _i(E, di, ei) {
        ji(E, function() {
          di.apply(this, arguments);
        }, ei);
      }
      function ml(E) {
        return ji(E, function(di) {
          return di;
        }) || [];
      }
      function nl(E) {
        if (!Li(E))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return E;
      }
      function Hl(E) {
        var di = {
          $$typeof: e,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: E,
          _currentValue2: E,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        di.Provider = {
          $$typeof: a,
          _context: di
        };
        var ei = !1, ui = !1, Vi = !1;
        {
          var Ki = {
            $$typeof: e,
            _context: di
          };
          Object.defineProperties(Ki, {
            Provider: {
              get: function() {
                return ui || (ui = !0, P("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), di.Provider;
              },
              set: function(pi) {
                di.Provider = pi;
              }
            },
            _currentValue: {
              get: function() {
                return di._currentValue;
              },
              set: function(pi) {
                di._currentValue = pi;
              }
            },
            _currentValue2: {
              get: function() {
                return di._currentValue2;
              },
              set: function(pi) {
                di._currentValue2 = pi;
              }
            },
            _threadCount: {
              get: function() {
                return di._threadCount;
              },
              set: function(pi) {
                di._threadCount = pi;
              }
            },
            Consumer: {
              get: function() {
                return ei || (ei = !0, P("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), di.Consumer;
              }
            },
            displayName: {
              get: function() {
                return di.displayName;
              },
              set: function(pi) {
                Vi || (Q("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", pi), Vi = !0);
              }
            }
          }), di.Consumer = Ki;
        }
        return di._currentRenderer = null, di._currentRenderer2 = null, di;
      }
      var bl = -1, Zd = 0, Od = 1, Bt = 2;
      function Ot(E) {
        if (E._status === bl) {
          var di = E._result, ei = di();
          if (ei.then(function(Ki) {
            if (E._status === Zd || E._status === bl) {
              var pi = E;
              pi._status = Od, pi._result = Ki;
            }
          }, function(Ki) {
            if (E._status === Zd || E._status === bl) {
              var pi = E;
              pi._status = Bt, pi._result = Ki;
            }
          }), E._status === bl) {
            var ui = E;
            ui._status = Zd, ui._result = ei;
          }
        }
        if (E._status === Od) {
          var Vi = E._result;
          return Vi === void 0 && P(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, Vi), "default" in Vi || P(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, Vi), Vi.default;
        } else
          throw E._result;
      }
      function Dt(E) {
        var di = {
          // We use these fields to store the result.
          _status: bl,
          _result: E
        }, ei = {
          $$typeof: C,
          _payload: di,
          _init: Ot
        };
        {
          var ui, Vi;
          Object.defineProperties(ei, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return ui;
              },
              set: function(Ki) {
                P("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ui = Ki, Object.defineProperty(ei, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return Vi;
              },
              set: function(Ki) {
                P("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), Vi = Ki, Object.defineProperty(ei, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return ei;
      }
      function At(E) {
        E != null && E.$$typeof === p ? P("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof E != "function" ? P("forwardRef requires a render function but was given %s.", E === null ? "null" : typeof E) : E.length !== 0 && E.length !== 2 && P("forwardRef render functions accept exactly two parameters: props and ref. %s", E.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), E != null && (E.defaultProps != null || E.propTypes != null) && P("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var di = {
          $$typeof: r,
          render: E
        };
        {
          var ei;
          Object.defineProperty(di, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ei;
            },
            set: function(ui) {
              ei = ui, !E.name && !E.displayName && (E.displayName = ui);
            }
          });
        }
        return di;
      }
      var Dd;
      Dd = Symbol.for("react.module.reference");
      function Ad(E) {
        return !!(typeof E == "string" || typeof E == "function" || E === L || E === u || R || E === K || E === X || E === W || x || E === I || y || J || N || typeof E == "object" && E !== null && (E.$$typeof === C || E.$$typeof === p || E.$$typeof === a || E.$$typeof === e || E.$$typeof === r || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        E.$$typeof === Dd || E.getModuleId !== void 0));
      }
      function qt(E, di) {
        Ad(E) || P("memo: The first argument must be a component. Instead received: %s", E === null ? "null" : typeof E);
        var ei = {
          $$typeof: p,
          type: E,
          compare: di === void 0 ? null : di
        };
        {
          var ui;
          Object.defineProperty(ei, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ui;
            },
            set: function(Vi) {
              ui = Vi, !E.name && !E.displayName && (E.displayName = Vi);
            }
          });
        }
        return ei;
      }
      function qi() {
        var E = t.current;
        return E === null && P(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), E;
      }
      function $t(E) {
        var di = qi();
        if (E._context !== void 0) {
          var ei = E._context;
          ei.Consumer === E ? P("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : ei.Provider === E && P("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return di.useContext(E);
      }
      function _t(E) {
        var di = qi();
        return di.useState(E);
      }
      function i0(E, di, ei) {
        var ui = qi();
        return ui.useReducer(E, di, ei);
      }
      function l0(E) {
        var di = qi();
        return di.useRef(E);
      }
      function d0(E, di) {
        var ei = qi();
        return ei.useEffect(E, di);
      }
      function s0(E, di) {
        var ei = qi();
        return ei.useInsertionEffect(E, di);
      }
      function t0(E, di) {
        var ei = qi();
        return ei.useLayoutEffect(E, di);
      }
      function b0(E, di) {
        var ei = qi();
        return ei.useCallback(E, di);
      }
      function c0(E, di) {
        var ei = qi();
        return ei.useMemo(E, di);
      }
      function Z0(E, di, ei) {
        var ui = qi();
        return ui.useImperativeHandle(E, di, ei);
      }
      function m0(E, di) {
        {
          var ei = qi();
          return ei.useDebugValue(E, di);
        }
      }
      function n0() {
        var E = qi();
        return E.useTransition();
      }
      function X0(E) {
        var di = qi();
        return di.useDeferredValue(E);
      }
      function o0() {
        var E = qi();
        return E.useId();
      }
      function a0(E, di, ei) {
        var ui = qi();
        return ui.useSyncExternalStore(E, di, ei);
      }
      var Yl = 0, qd, $d, _d, is, ls, ds, ss;
      function ts() {
      }
      ts.__reactDisabledLog = !0;
      function e0() {
        {
          if (Yl === 0) {
            qd = console.log, $d = console.info, _d = console.warn, is = console.error, ls = console.group, ds = console.groupCollapsed, ss = console.groupEnd;
            var E = {
              configurable: !0,
              enumerable: !0,
              value: ts,
              writable: !0
            };
            Object.defineProperties(console, {
              info: E,
              log: E,
              warn: E,
              error: E,
              group: E,
              groupCollapsed: E,
              groupEnd: E
            });
          }
          Yl++;
        }
      }
      function W0() {
        {
          if (Yl--, Yl === 0) {
            var E = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: O({}, E, {
                value: qd
              }),
              info: O({}, E, {
                value: $d
              }),
              warn: O({}, E, {
                value: _d
              }),
              error: O({}, E, {
                value: is
              }),
              group: O({}, E, {
                value: ls
              }),
              groupCollapsed: O({}, E, {
                value: ds
              }),
              groupEnd: O({}, E, {
                value: ss
              })
            });
          }
          Yl < 0 && P("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var md = z.ReactCurrentDispatcher, nd;
      function zl(E, di, ei) {
        {
          if (nd === void 0)
            try {
              throw Error();
            } catch (Vi) {
              var ui = Vi.stack.trim().match(/\n( *(at )?)/);
              nd = ui && ui[1] || "";
            }
          return `
` + nd + E;
        }
      }
      var Xd = !1, Ml;
      {
        var u0 = typeof WeakMap == "function" ? WeakMap : Map;
        Ml = new u0();
      }
      function bs(E, di) {
        if (!E || Xd)
          return "";
        {
          var ei = Ml.get(E);
          if (ei !== void 0)
            return ei;
        }
        var ui;
        Xd = !0;
        var Vi = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ki;
        Ki = md.current, md.current = null, e0();
        try {
          if (di) {
            var pi = function() {
              throw Error();
            };
            if (Object.defineProperty(pi.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(pi, []);
              } catch (Di) {
                ui = Di;
              }
              Reflect.construct(E, [], pi);
            } else {
              try {
                pi.call();
              } catch (Di) {
                ui = Di;
              }
              E.call(pi.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Di) {
              ui = Di;
            }
            E();
          }
        } catch (Di) {
          if (Di && ui && typeof Di.stack == "string") {
            for (var Ri = Di.stack.split(`
`), Ci = ui.stack.split(`
`), Ni = Ri.length - 1, vi = Ci.length - 1; Ni >= 1 && vi >= 0 && Ri[Ni] !== Ci[vi]; )
              vi--;
            for (; Ni >= 1 && vi >= 0; Ni--, vi--)
              if (Ri[Ni] !== Ci[vi]) {
                if (Ni !== 1 || vi !== 1)
                  do
                    if (Ni--, vi--, vi < 0 || Ri[Ni] !== Ci[vi]) {
                      var Ui = `
` + Ri[Ni].replace(" at new ", " at ");
                      return E.displayName && Ui.includes("<anonymous>") && (Ui = Ui.replace("<anonymous>", E.displayName)), typeof E == "function" && Ml.set(E, Ui), Ui;
                    }
                  while (Ni >= 1 && vi >= 0);
                break;
              }
          }
        } finally {
          Xd = !1, md.current = Ki, W0(), Error.prepareStackTrace = Vi;
        }
        var Ei = E ? E.displayName || E.name : "", Oi = Ei ? zl(Ei) : "";
        return typeof E == "function" && Ml.set(E, Oi), Oi;
      }
      function G0(E, di, ei) {
        return bs(E, !1);
      }
      function h0(E) {
        var di = E.prototype;
        return !!(di && di.isReactComponent);
      }
      function kl(E, di, ei) {
        if (E == null)
          return "";
        if (typeof E == "function")
          return bs(E, h0(E));
        if (typeof E == "string")
          return zl(E);
        switch (E) {
          case X:
            return zl("Suspense");
          case W:
            return zl("SuspenseList");
        }
        if (typeof E == "object")
          switch (E.$$typeof) {
            case r:
              return G0(E.render);
            case p:
              return kl(E.type, di, ei);
            case C: {
              var ui = E, Vi = ui._payload, Ki = ui._init;
              try {
                return kl(Ki(Vi), di, ei);
              } catch {
              }
            }
          }
        return "";
      }
      var cs = {}, Zs = z.ReactDebugCurrentFrame;
      function fl(E) {
        if (E) {
          var di = E._owner, ei = kl(E.type, E._source, di ? di.type : null);
          Zs.setExtraStackFrame(ei);
        } else
          Zs.setExtraStackFrame(null);
      }
      function V0(E, di, ei, ui, Vi) {
        {
          var Ki = Function.call.bind(q);
          for (var pi in E)
            if (Ki(E, pi)) {
              var Ri = void 0;
              try {
                if (typeof E[pi] != "function") {
                  var Ci = Error((ui || "React class") + ": " + ei + " type `" + pi + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof E[pi] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Ci.name = "Invariant Violation", Ci;
                }
                Ri = E[pi](di, pi, ui, ei, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Ni) {
                Ri = Ni;
              }
              Ri && !(Ri instanceof Error) && (fl(Vi), P("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ui || "React class", ei, pi, typeof Ri), fl(null)), Ri instanceof Error && !(Ri.message in cs) && (cs[Ri.message] = !0, fl(Vi), P("Failed %s type: %s", ei, Ri.message), fl(null));
            }
        }
      }
      function Gl(E) {
        if (E) {
          var di = E._owner, ei = kl(E.type, E._source, di ? di.type : null);
          T(ei);
        } else
          T(null);
      }
      var od;
      od = !1;
      function ms() {
        if (h.current) {
          var E = B(h.current.type);
          if (E)
            return `

Check the render method of \`` + E + "`.";
        }
        return "";
      }
      function I0(E) {
        if (E !== void 0) {
          var di = E.fileName.replace(/^.*[\\\/]/, ""), ei = E.lineNumber;
          return `

Check your code at ` + di + ":" + ei + ".";
        }
        return "";
      }
      function p0(E) {
        return E != null ? I0(E.__source) : "";
      }
      var ns = {};
      function L0(E) {
        var di = ms();
        if (!di) {
          var ei = typeof E == "string" ? E : E.displayName || E.name;
          ei && (di = `

Check the top-level render call using <` + ei + ">.");
        }
        return di;
      }
      function Xs(E, di) {
        if (!(!E._store || E._store.validated || E.key != null)) {
          E._store.validated = !0;
          var ei = L0(di);
          if (!ns[ei]) {
            ns[ei] = !0;
            var ui = "";
            E && E._owner && E._owner !== h.current && (ui = " It was passed a child from " + B(E._owner.type) + "."), Gl(E), P('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ei, ui), Gl(null);
          }
        }
      }
      function os(E, di) {
        if (typeof E == "object") {
          if (H(E))
            for (var ei = 0; ei < E.length; ei++) {
              var ui = E[ei];
              Li(ui) && Xs(ui, di);
            }
          else if (Li(E))
            E._store && (E._store.validated = !0);
          else if (E) {
            var Vi = d(E);
            if (typeof Vi == "function" && Vi !== E.entries)
              for (var Ki = Vi.call(E), pi; !(pi = Ki.next()).done; )
                Li(pi.value) && Xs(pi.value, di);
          }
        }
      }
      function as(E) {
        {
          var di = E.type;
          if (di == null || typeof di == "string")
            return;
          var ei;
          if (typeof di == "function")
            ei = di.propTypes;
          else if (typeof di == "object" && (di.$$typeof === r || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          di.$$typeof === p))
            ei = di.propTypes;
          else
            return;
          if (ei) {
            var ui = B(di);
            V0(ei, E.props, "prop", ui, E);
          } else if (di.PropTypes !== void 0 && !od) {
            od = !0;
            var Vi = B(di);
            P("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Vi || "Unknown");
          }
          typeof di.getDefaultProps == "function" && !di.getDefaultProps.isReactClassApproved && P("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function y0(E) {
        {
          for (var di = Object.keys(E.props), ei = 0; ei < di.length; ei++) {
            var ui = di[ei];
            if (ui !== "children" && ui !== "key") {
              Gl(E), P("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ui), Gl(null);
              break;
            }
          }
          E.ref !== null && (Gl(E), P("Invalid attribute `ref` supplied to `React.Fragment`."), Gl(null));
        }
      }
      function es(E, di, ei) {
        var ui = Ad(E);
        if (!ui) {
          var Vi = "";
          (E === void 0 || typeof E == "object" && E !== null && Object.keys(E).length === 0) && (Vi += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ki = p0(di);
          Ki ? Vi += Ki : Vi += ms();
          var pi;
          E === null ? pi = "null" : H(E) ? pi = "array" : E !== void 0 && E.$$typeof === c ? (pi = "<" + (B(E.type) || "Unknown") + " />", Vi = " Did you accidentally export a JSX literal instead of a component?") : pi = typeof E, P("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", pi, Vi);
        }
        var Ri = Ii.apply(this, arguments);
        if (Ri == null)
          return Ri;
        if (ui)
          for (var Ci = 2; Ci < arguments.length; Ci++)
            os(arguments[Ci], E);
        return E === L ? y0(Ri) : as(Ri), Ri;
      }
      var Ws = !1;
      function r0(E) {
        var di = es.bind(null, E);
        return di.type = E, Ws || (Ws = !0, Q("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(di, "type", {
          enumerable: !1,
          get: function() {
            return Q("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: E
            }), E;
          }
        }), di;
      }
      function K0(E, di, ei) {
        for (var ui = yi.apply(this, arguments), Vi = 2; Vi < arguments.length; Vi++)
          os(arguments[Vi], ui.type);
        return as(ui), ui;
      }
      function S0(E, di) {
        var ei = s.transition;
        s.transition = {};
        var ui = s.transition;
        s.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          E();
        } finally {
          if (s.transition = ei, ei === null && ui._updatedFibers) {
            var Vi = ui._updatedFibers.size;
            Vi > 10 && Q("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), ui._updatedFibers.clear();
          }
        }
      }
      var us = !1, vl = null;
      function R0(E) {
        if (vl === null)
          try {
            var di = ("require" + Math.random()).slice(0, 7), ei = n && n[di];
            vl = ei.call(n, "timers").setImmediate;
          } catch {
            vl = function(Vi) {
              us === !1 && (us = !0, typeof MessageChannel > "u" && P("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ki = new MessageChannel();
              Ki.port1.onmessage = Vi, Ki.port2.postMessage(void 0);
            };
          }
        return vl(E);
      }
      var hl = 0, Gs = !1;
      function x0(E) {
        {
          var di = hl;
          hl++, b.current === null && (b.current = []);
          var ei = b.isBatchingLegacy, ui;
          try {
            if (b.isBatchingLegacy = !0, ui = E(), !ei && b.didScheduleLegacyUpdate) {
              var Vi = b.current;
              Vi !== null && (b.didScheduleLegacyUpdate = !1, Wd(Vi));
            }
          } catch (Ei) {
            throw Ul(di), Ei;
          } finally {
            b.isBatchingLegacy = ei;
          }
          if (ui !== null && typeof ui == "object" && typeof ui.then == "function") {
            var Ki = ui, pi = !1, Ri = {
              then: function(Ei, Oi) {
                pi = !0, Ki.then(function(Di) {
                  Ul(di), hl === 0 ? ad(Di, Ei, Oi) : Ei(Di);
                }, function(Di) {
                  Ul(di), Oi(Di);
                });
              }
            };
            return !Gs && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              pi || (Gs = !0, P("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Ri;
          } else {
            var Ci = ui;
            if (Ul(di), hl === 0) {
              var Ni = b.current;
              Ni !== null && (Wd(Ni), b.current = null);
              var vi = {
                then: function(Ei, Oi) {
                  b.current === null ? (b.current = [], ad(Ci, Ei, Oi)) : Ei(Ci);
                }
              };
              return vi;
            } else {
              var Ui = {
                then: function(Ei, Oi) {
                  Ei(Ci);
                }
              };
              return Ui;
            }
          }
        }
      }
      function Ul(E) {
        E !== hl - 1 && P("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), hl = E;
      }
      function ad(E, di, ei) {
        {
          var ui = b.current;
          if (ui !== null)
            try {
              Wd(ui), R0(function() {
                ui.length === 0 ? (b.current = null, di(E)) : ad(E, di, ei);
              });
            } catch (Vi) {
              ei(Vi);
            }
          else
            di(E);
        }
      }
      var ed = !1;
      function Wd(E) {
        if (!ed) {
          ed = !0;
          var di = 0;
          try {
            for (; di < E.length; di++) {
              var ei = E[di];
              do
                ei = ei(!0);
              while (ei !== null);
            }
            E.length = 0;
          } catch (ui) {
            throw E = E.slice(di + 1), ui;
          } finally {
            ed = !1;
          }
        }
      }
      var Y0 = es, C0 = K0, J0 = r0, F0 = {
        map: ji,
        forEach: _i,
        count: Ji,
        toArray: ml,
        only: nl
      };
      l.Children = F0, l.Component = ii, l.Fragment = L, l.Profiler = u, l.PureComponent = M, l.StrictMode = K, l.Suspense = X, l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = z, l.cloneElement = C0, l.createContext = Hl, l.createElement = Y0, l.createFactory = J0, l.createRef = j, l.forwardRef = At, l.isValidElement = Li, l.lazy = Dt, l.memo = qt, l.startTransition = S0, l.unstable_act = x0, l.useCallback = b0, l.useContext = $t, l.useDebugValue = m0, l.useDeferredValue = X0, l.useEffect = d0, l.useId = o0, l.useImperativeHandle = Z0, l.useInsertionEffect = s0, l.useLayoutEffect = t0, l.useMemo = c0, l.useReducer = i0, l.useRef = l0, l.useState = _t, l.useSyncExternalStore = a0, l.useTransition = n0, l.version = i, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(Jl, Jl.exports)), Jl.exports;
}
var Yi = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rs;
function db() {
  if (Rs)
    return Yi;
  Rs = 1;
  var n = Symbol.for("react.element"), l = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), m = Symbol.for("react.profiler"), L = Symbol.for("react.provider"), K = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), a = Symbol.for("react.suspense"), e = Symbol.for("react.memo"), r = Symbol.for("react.lazy"), X = Symbol.iterator;
  function W(F) {
    return F === null || typeof F != "object" ? null : (F = X && F[X] || F["@@iterator"], typeof F == "function" ? F : null);
  }
  var p = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C = Object.assign, I = {};
  function o(F, v, O) {
    this.props = F, this.context = v, this.refs = I, this.updater = O || p;
  }
  o.prototype.isReactComponent = {}, o.prototype.setState = function(F, v) {
    if (typeof F != "object" && typeof F != "function" && F != null)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, F, v, "setState");
  }, o.prototype.forceUpdate = function(F) {
    this.updater.enqueueForceUpdate(this, F, "forceUpdate");
  };
  function G() {
  }
  G.prototype = o.prototype;
  function d(F, v, O) {
    this.props = F, this.context = v, this.refs = I, this.updater = O || p;
  }
  var t = d.prototype = new G();
  t.constructor = d, C(t, o.prototype), t.isPureReactComponent = !0;
  var s = Array.isArray, b = Object.prototype.hasOwnProperty, h = { current: null }, S = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Y(F, v, O) {
    var li, ii = {}, ti = null, $ = null;
    if (v != null)
      for (li in v.ref !== void 0 && ($ = v.ref), v.key !== void 0 && (ti = "" + v.key), v)
        b.call(v, li) && !S.hasOwnProperty(li) && (ii[li] = v[li]);
    var ai = arguments.length - 2;
    if (ai === 1)
      ii.children = O;
    else if (1 < ai) {
      for (var Xi = Array(ai), M = 0; M < ai; M++)
        Xi[M] = arguments[M + 2];
      ii.children = Xi;
    }
    if (F && F.defaultProps)
      for (li in ai = F.defaultProps, ai)
        ii[li] === void 0 && (ii[li] = ai[li]);
    return { $$typeof: n, type: F, key: ti, ref: $, props: ii, _owner: h.current };
  }
  function T(F, v) {
    return { $$typeof: n, type: F.type, key: v, ref: F.ref, props: F.props, _owner: F._owner };
  }
  function y(F) {
    return typeof F == "object" && F !== null && F.$$typeof === n;
  }
  function J(F) {
    var v = { "=": "=0", ":": "=2" };
    return "$" + F.replace(/[=:]/g, function(O) {
      return v[O];
    });
  }
  var N = /\/+/g;
  function x(F, v) {
    return typeof F == "object" && F !== null && F.key != null ? J("" + F.key) : v.toString(36);
  }
  function R(F, v, O, li, ii) {
    var ti = typeof F;
    (ti === "undefined" || ti === "boolean") && (F = null);
    var $ = !1;
    if (F === null)
      $ = !0;
    else
      switch (ti) {
        case "string":
        case "number":
          $ = !0;
          break;
        case "object":
          switch (F.$$typeof) {
            case n:
            case l:
              $ = !0;
          }
      }
    if ($)
      return $ = F, ii = ii($), F = li === "" ? "." + x($, 0) : li, s(ii) ? (O = "", F != null && (O = F.replace(N, "$&/") + "/"), R(ii, v, O, "", function(M) {
        return M;
      })) : ii != null && (y(ii) && (ii = T(ii, O + (!ii.key || $ && $.key === ii.key ? "" : ("" + ii.key).replace(N, "$&/") + "/") + F)), v.push(ii)), 1;
    if ($ = 0, li = li === "" ? "." : li + ":", s(F))
      for (var ai = 0; ai < F.length; ai++) {
        ti = F[ai];
        var Xi = li + x(ti, ai);
        $ += R(ti, v, O, Xi, ii);
      }
    else if (Xi = W(F), typeof Xi == "function")
      for (F = Xi.call(F), ai = 0; !(ti = F.next()).done; )
        ti = ti.value, Xi = li + x(ti, ai++), $ += R(ti, v, O, Xi, ii);
    else if (ti === "object")
      throw v = String(F), Error("Objects are not valid as a React child (found: " + (v === "[object Object]" ? "object with keys {" + Object.keys(F).join(", ") + "}" : v) + "). If you meant to render a collection of children, use an array instead.");
    return $;
  }
  function z(F, v, O) {
    if (F == null)
      return F;
    var li = [], ii = 0;
    return R(F, li, "", "", function(ti) {
      return v.call(O, ti, ii++);
    }), li;
  }
  function Q(F) {
    if (F._status === -1) {
      var v = F._result;
      v = v(), v.then(function(O) {
        (F._status === 0 || F._status === -1) && (F._status = 1, F._result = O);
      }, function(O) {
        (F._status === 0 || F._status === -1) && (F._status = 2, F._result = O);
      }), F._status === -1 && (F._status = 0, F._result = v);
    }
    if (F._status === 1)
      return F._result.default;
    throw F._result;
  }
  var P = { current: null }, D = { transition: null }, _ = { ReactCurrentDispatcher: P, ReactCurrentBatchConfig: D, ReactCurrentOwner: h };
  return Yi.Children = { map: z, forEach: function(F, v, O) {
    z(F, function() {
      v.apply(this, arguments);
    }, O);
  }, count: function(F) {
    var v = 0;
    return z(F, function() {
      v++;
    }), v;
  }, toArray: function(F) {
    return z(F, function(v) {
      return v;
    }) || [];
  }, only: function(F) {
    if (!y(F))
      throw Error("React.Children.only expected to receive a single React element child.");
    return F;
  } }, Yi.Component = o, Yi.Fragment = i, Yi.Profiler = m, Yi.PureComponent = d, Yi.StrictMode = c, Yi.Suspense = a, Yi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _, Yi.cloneElement = function(F, v, O) {
    if (F == null)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + F + ".");
    var li = C({}, F.props), ii = F.key, ti = F.ref, $ = F._owner;
    if (v != null) {
      if (v.ref !== void 0 && (ti = v.ref, $ = h.current), v.key !== void 0 && (ii = "" + v.key), F.type && F.type.defaultProps)
        var ai = F.type.defaultProps;
      for (Xi in v)
        b.call(v, Xi) && !S.hasOwnProperty(Xi) && (li[Xi] = v[Xi] === void 0 && ai !== void 0 ? ai[Xi] : v[Xi]);
    }
    var Xi = arguments.length - 2;
    if (Xi === 1)
      li.children = O;
    else if (1 < Xi) {
      ai = Array(Xi);
      for (var M = 0; M < Xi; M++)
        ai[M] = arguments[M + 2];
      li.children = ai;
    }
    return { $$typeof: n, type: F.type, key: ii, ref: ti, props: li, _owner: $ };
  }, Yi.createContext = function(F) {
    return F = { $$typeof: K, _currentValue: F, _currentValue2: F, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, F.Provider = { $$typeof: L, _context: F }, F.Consumer = F;
  }, Yi.createElement = Y, Yi.createFactory = function(F) {
    var v = Y.bind(null, F);
    return v.type = F, v;
  }, Yi.createRef = function() {
    return { current: null };
  }, Yi.forwardRef = function(F) {
    return { $$typeof: u, render: F };
  }, Yi.isValidElement = y, Yi.lazy = function(F) {
    return { $$typeof: r, _payload: { _status: -1, _result: F }, _init: Q };
  }, Yi.memo = function(F, v) {
    return { $$typeof: e, type: F, compare: v === void 0 ? null : v };
  }, Yi.startTransition = function(F) {
    var v = D.transition;
    D.transition = {};
    try {
      F();
    } finally {
      D.transition = v;
    }
  }, Yi.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, Yi.useCallback = function(F, v) {
    return P.current.useCallback(F, v);
  }, Yi.useContext = function(F) {
    return P.current.useContext(F);
  }, Yi.useDebugValue = function() {
  }, Yi.useDeferredValue = function(F) {
    return P.current.useDeferredValue(F);
  }, Yi.useEffect = function(F, v) {
    return P.current.useEffect(F, v);
  }, Yi.useId = function() {
    return P.current.useId();
  }, Yi.useImperativeHandle = function(F, v, O) {
    return P.current.useImperativeHandle(F, v, O);
  }, Yi.useInsertionEffect = function(F, v) {
    return P.current.useInsertionEffect(F, v);
  }, Yi.useLayoutEffect = function(F, v) {
    return P.current.useLayoutEffect(F, v);
  }, Yi.useMemo = function(F, v) {
    return P.current.useMemo(F, v);
  }, Yi.useReducer = function(F, v, O) {
    return P.current.useReducer(F, v, O);
  }, Yi.useRef = function(F) {
    return P.current.useRef(F);
  }, Yi.useState = function(F) {
    return P.current.useState(F);
  }, Yi.useSyncExternalStore = function(F, v, O) {
    return P.current.useSyncExternalStore(F, v, O);
  }, Yi.useTransition = function() {
    return P.current.useTransition();
  }, Yi.version = "18.2.0", Yi;
}
process.env.NODE_ENV === "production" ? Yd.exports = db() : Yd.exports = lb();
var pl = Yd.exports;
const sb = "index-module__Container__nLsM3", tb = "index-module__FloatCanvas__d1YR7", Id = {
  Container: sb,
  FloatCanvas: tb
};
class ll extends pl.Component {
  constructor(l) {
    super(l), Object.defineProperty(this, "containerRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    }), Object.defineProperty(this, "canvasFloatRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    }), Object.defineProperty(this, "canvasBgRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: null
    });
  }
  componentDidMount() {
    ll.instance = this, ll.displayState$.set(el.mounted);
  }
  componentWillUnmount() {
    ll.displayState$.set(el.unmounted);
  }
  render() {
    return pl.createElement(
      pl.Fragment,
      null,
      this.props.children,
      pl.createElement(
        "div",
        { id: "bezier-pencil-plugin", className: Id.Container, ref: (l) => this.containerRef = l },
        pl.createElement("canvas", { className: Id.FloatCanvas, id: "bezier-pencil-float-canvas", ref: (l) => this.canvasFloatRef = l }),
        pl.createElement("canvas", { className: Id.BgCanvas, id: "bezier-pencil-bg-canvas", ref: (l) => this.canvasBgRef = l })
      )
    );
  }
}
Object.defineProperty(ll, "displayState$", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: It(el.pedding)
});
class bb {
  setNamespace(l) {
    this.namespace = l, this.storage = gd(this.plugin.attributes[l]) || {};
  }
  isLocalId(l) {
    return l.split("@##@").length === 1;
  }
  getLocalId(l) {
    return l.split("@##@")[1];
  }
}
function cb() {
  this.__data__ = [], this.size = 0;
}
var Zb = cb;
function mb(n, l) {
  return n === l || n !== n && l !== l;
}
var kd = mb, nb = kd;
function Xb(n, l) {
  for (var i = n.length; i--; )
    if (nb(n[i][0], l))
      return i;
  return -1;
}
var _l = Xb, ob = _l, ab = Array.prototype, eb = ab.splice;
function Wb(n) {
  var l = this.__data__, i = ob(l, n);
  if (i < 0)
    return !1;
  var c = l.length - 1;
  return i == c ? l.pop() : eb.call(l, i, 1), --this.size, !0;
}
var ub = Wb, Gb = _l;
function hb(n) {
  var l = this.__data__, i = Gb(l, n);
  return i < 0 ? void 0 : l[i][1];
}
var Vb = hb, Ib = _l;
function pb(n) {
  return Ib(this.__data__, n) > -1;
}
var Lb = pb, yb = _l;
function rb(n, l) {
  var i = this.__data__, c = yb(i, n);
  return c < 0 ? (++this.size, i.push([n, l])) : i[c][1] = l, this;
}
var Kb = rb, Sb = Zb, Rb = ub, xb = Vb, Yb = Lb, Cb = Kb;
function rl(n) {
  var l = -1, i = n == null ? 0 : n.length;
  for (this.clear(); ++l < i; ) {
    var c = n[l];
    this.set(c[0], c[1]);
  }
}
rl.prototype.clear = Sb;
rl.prototype.delete = Rb;
rl.prototype.get = xb;
rl.prototype.has = Yb;
rl.prototype.set = Cb;
var id = rl, Jb = id;
function Fb() {
  this.__data__ = new Jb(), this.size = 0;
}
var Tb = Fb;
function Nb(n) {
  var l = this.__data__, i = l.delete(n);
  return this.size = l.size, i;
}
var gb = Nb;
function Hb(n) {
  return this.__data__.get(n);
}
var zb = Hb;
function Mb(n) {
  return this.__data__.has(n);
}
var kb = Mb, fb = typeof Pl == "object" && Pl && Pl.Object === Object && Pl, pt = fb, vb = pt, Ub = typeof self == "object" && self && self.Object === Object && self, Qb = vb || Ub || Function("return this")(), tl = Qb, Pb = tl, Eb = Pb.Symbol, ld = Eb, xs = ld, Lt = Object.prototype, wb = Lt.hasOwnProperty, jb = Lt.toString, Cl = xs ? xs.toStringTag : void 0;
function Bb(n) {
  var l = wb.call(n, Cl), i = n[Cl];
  try {
    n[Cl] = void 0;
    var c = !0;
  } catch {
  }
  var m = jb.call(n);
  return c && (l ? n[Cl] = i : delete n[Cl]), m;
}
var Ob = Bb, Db = Object.prototype, Ab = Db.toString;
function qb(n) {
  return Ab.call(n);
}
var $b = qb, Ys = ld, _b = Ob, ic = $b, lc = "[object Null]", dc = "[object Undefined]", Cs = Ys ? Ys.toStringTag : void 0;
function sc(n) {
  return n == null ? n === void 0 ? dc : lc : Cs && Cs in Object(n) ? _b(n) : ic(n);
}
var gl = sc;
function tc(n) {
  var l = typeof n;
  return n != null && (l == "object" || l == "function");
}
var Zl = tc, bc = gl, cc = Zl, Zc = "[object AsyncFunction]", mc = "[object Function]", nc = "[object GeneratorFunction]", Xc = "[object Proxy]";
function oc(n) {
  if (!cc(n))
    return !1;
  var l = bc(n);
  return l == mc || l == nc || l == Zc || l == Xc;
}
var yt = oc, ac = tl, ec = ac["__core-js_shared__"], Wc = ec, pd = Wc, Js = function() {
  var n = /[^.]+$/.exec(pd && pd.keys && pd.keys.IE_PROTO || "");
  return n ? "Symbol(src)_1." + n : "";
}();
function uc(n) {
  return !!Js && Js in n;
}
var Gc = uc, hc = Function.prototype, Vc = hc.toString;
function Ic(n) {
  if (n != null) {
    try {
      return Vc.call(n);
    } catch {
    }
    try {
      return n + "";
    } catch {
    }
  }
  return "";
}
var rt = Ic, pc = yt, Lc = Gc, yc = Zl, rc = rt, Kc = /[\\^$.*+?()[\]{}|]/g, Sc = /^\[object .+?Constructor\]$/, Rc = Function.prototype, xc = Object.prototype, Yc = Rc.toString, Cc = xc.hasOwnProperty, Jc = RegExp(
  "^" + Yc.call(Cc).replace(Kc, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Fc(n) {
  if (!yc(n) || Lc(n))
    return !1;
  var l = pc(n) ? Jc : Sc;
  return l.test(rc(n));
}
var Tc = Fc;
function Nc(n, l) {
  return n == null ? void 0 : n[l];
}
var gc = Nc, Hc = Tc, zc = gc;
function Mc(n, l) {
  var i = zc(n, l);
  return Hc(i) ? i : void 0;
}
var Wl = Mc, kc = Wl, fc = tl, vc = kc(fc, "Map"), fd = vc, Uc = Wl, Qc = Uc(Object, "create"), dd = Qc, Fs = dd;
function Pc() {
  this.__data__ = Fs ? Fs(null) : {}, this.size = 0;
}
var Ec = Pc;
function wc(n) {
  var l = this.has(n) && delete this.__data__[n];
  return this.size -= l ? 1 : 0, l;
}
var jc = wc, Bc = dd, Oc = "__lodash_hash_undefined__", Dc = Object.prototype, Ac = Dc.hasOwnProperty;
function qc(n) {
  var l = this.__data__;
  if (Bc) {
    var i = l[n];
    return i === Oc ? void 0 : i;
  }
  return Ac.call(l, n) ? l[n] : void 0;
}
var $c = qc, _c = dd, iZ = Object.prototype, lZ = iZ.hasOwnProperty;
function dZ(n) {
  var l = this.__data__;
  return _c ? l[n] !== void 0 : lZ.call(l, n);
}
var sZ = dZ, tZ = dd, bZ = "__lodash_hash_undefined__";
function cZ(n, l) {
  var i = this.__data__;
  return this.size += this.has(n) ? 0 : 1, i[n] = tZ && l === void 0 ? bZ : l, this;
}
var ZZ = cZ, mZ = Ec, nZ = jc, XZ = $c, oZ = sZ, aZ = ZZ;
function Kl(n) {
  var l = -1, i = n == null ? 0 : n.length;
  for (this.clear(); ++l < i; ) {
    var c = n[l];
    this.set(c[0], c[1]);
  }
}
Kl.prototype.clear = mZ;
Kl.prototype.delete = nZ;
Kl.prototype.get = XZ;
Kl.prototype.has = oZ;
Kl.prototype.set = aZ;
var eZ = Kl, Ts = eZ, WZ = id, uZ = fd;
function GZ() {
  this.size = 0, this.__data__ = {
    hash: new Ts(),
    map: new (uZ || WZ)(),
    string: new Ts()
  };
}
var hZ = GZ;
function VZ(n) {
  var l = typeof n;
  return l == "string" || l == "number" || l == "symbol" || l == "boolean" ? n !== "__proto__" : n === null;
}
var IZ = VZ, pZ = IZ;
function LZ(n, l) {
  var i = n.__data__;
  return pZ(l) ? i[typeof l == "string" ? "string" : "hash"] : i.map;
}
var sd = LZ, yZ = sd;
function rZ(n) {
  var l = yZ(this, n).delete(n);
  return this.size -= l ? 1 : 0, l;
}
var KZ = rZ, SZ = sd;
function RZ(n) {
  return SZ(this, n).get(n);
}
var xZ = RZ, YZ = sd;
function CZ(n) {
  return YZ(this, n).has(n);
}
var JZ = CZ, FZ = sd;
function TZ(n, l) {
  var i = FZ(this, n), c = i.size;
  return i.set(n, l), this.size += i.size == c ? 0 : 1, this;
}
var NZ = TZ, gZ = hZ, HZ = KZ, zZ = xZ, MZ = JZ, kZ = NZ;
function Sl(n) {
  var l = -1, i = n == null ? 0 : n.length;
  for (this.clear(); ++l < i; ) {
    var c = n[l];
    this.set(c[0], c[1]);
  }
}
Sl.prototype.clear = gZ;
Sl.prototype.delete = HZ;
Sl.prototype.get = zZ;
Sl.prototype.has = MZ;
Sl.prototype.set = kZ;
var Kt = Sl, fZ = id, vZ = fd, UZ = Kt, QZ = 200;
function PZ(n, l) {
  var i = this.__data__;
  if (i instanceof fZ) {
    var c = i.__data__;
    if (!vZ || c.length < QZ - 1)
      return c.push([n, l]), this.size = ++i.size, this;
    i = this.__data__ = new UZ(c);
  }
  return i.set(n, l), this.size = i.size, this;
}
var EZ = PZ, wZ = id, jZ = Tb, BZ = gb, OZ = zb, DZ = kb, AZ = EZ;
function Rl(n) {
  var l = this.__data__ = new wZ(n);
  this.size = l.size;
}
Rl.prototype.clear = jZ;
Rl.prototype.delete = BZ;
Rl.prototype.get = OZ;
Rl.prototype.has = DZ;
Rl.prototype.set = AZ;
var St = Rl, qZ = "__lodash_hash_undefined__";
function $Z(n) {
  return this.__data__.set(n, qZ), this;
}
var _Z = $Z;
function im(n) {
  return this.__data__.has(n);
}
var lm = im, dm = Kt, sm = _Z, tm = lm;
function Dl(n) {
  var l = -1, i = n == null ? 0 : n.length;
  for (this.__data__ = new dm(); ++l < i; )
    this.add(n[l]);
}
Dl.prototype.add = Dl.prototype.push = sm;
Dl.prototype.has = tm;
var bm = Dl;
function cm(n, l) {
  for (var i = -1, c = n == null ? 0 : n.length; ++i < c; )
    if (l(n[i], i, n))
      return !0;
  return !1;
}
var Zm = cm;
function mm(n, l) {
  return n.has(l);
}
var nm = mm, Xm = bm, om = Zm, am = nm, em = 1, Wm = 2;
function um(n, l, i, c, m, L) {
  var K = i & em, u = n.length, a = l.length;
  if (u != a && !(K && a > u))
    return !1;
  var e = L.get(n), r = L.get(l);
  if (e && r)
    return e == l && r == n;
  var X = -1, W = !0, p = i & Wm ? new Xm() : void 0;
  for (L.set(n, l), L.set(l, n); ++X < u; ) {
    var C = n[X], I = l[X];
    if (c)
      var o = K ? c(I, C, X, l, n, L) : c(C, I, X, n, l, L);
    if (o !== void 0) {
      if (o)
        continue;
      W = !1;
      break;
    }
    if (p) {
      if (!om(l, function(G, d) {
        if (!am(p, d) && (C === G || m(C, G, i, c, L)))
          return p.push(d);
      })) {
        W = !1;
        break;
      }
    } else if (!(C === I || m(C, I, i, c, L))) {
      W = !1;
      break;
    }
  }
  return L.delete(n), L.delete(l), W;
}
var Rt = um, Gm = tl, hm = Gm.Uint8Array, xt = hm;
function Vm(n) {
  var l = -1, i = Array(n.size);
  return n.forEach(function(c, m) {
    i[++l] = [m, c];
  }), i;
}
var Im = Vm;
function pm(n) {
  var l = -1, i = Array(n.size);
  return n.forEach(function(c) {
    i[++l] = c;
  }), i;
}
var Lm = pm, Ns = ld, gs = xt, ym = kd, rm = Rt, Km = Im, Sm = Lm, Rm = 1, xm = 2, Ym = "[object Boolean]", Cm = "[object Date]", Jm = "[object Error]", Fm = "[object Map]", Tm = "[object Number]", Nm = "[object RegExp]", gm = "[object Set]", Hm = "[object String]", zm = "[object Symbol]", Mm = "[object ArrayBuffer]", km = "[object DataView]", Hs = Ns ? Ns.prototype : void 0, Ld = Hs ? Hs.valueOf : void 0;
function fm(n, l, i, c, m, L, K) {
  switch (i) {
    case km:
      if (n.byteLength != l.byteLength || n.byteOffset != l.byteOffset)
        return !1;
      n = n.buffer, l = l.buffer;
    case Mm:
      return !(n.byteLength != l.byteLength || !L(new gs(n), new gs(l)));
    case Ym:
    case Cm:
    case Tm:
      return ym(+n, +l);
    case Jm:
      return n.name == l.name && n.message == l.message;
    case Nm:
    case Hm:
      return n == l + "";
    case Fm:
      var u = Km;
    case gm:
      var a = c & Rm;
      if (u || (u = Sm), n.size != l.size && !a)
        return !1;
      var e = K.get(n);
      if (e)
        return e == l;
      c |= xm, K.set(n, l);
      var r = rm(u(n), u(l), c, m, L, K);
      return K.delete(n), r;
    case zm:
      if (Ld)
        return Ld.call(n) == Ld.call(l);
  }
  return !1;
}
var vm = fm;
function Um(n, l) {
  for (var i = -1, c = l.length, m = n.length; ++i < c; )
    n[m + i] = l[i];
  return n;
}
var Yt = Um, Qm = Array.isArray, td = Qm, Pm = Yt, Em = td;
function wm(n, l, i) {
  var c = l(n);
  return Em(n) ? c : Pm(c, i(n));
}
var Ct = wm;
function jm(n, l) {
  for (var i = -1, c = n == null ? 0 : n.length, m = 0, L = []; ++i < c; ) {
    var K = n[i];
    l(K, i, n) && (L[m++] = K);
  }
  return L;
}
var Bm = jm;
function Om() {
  return [];
}
var Jt = Om, Dm = Bm, Am = Jt, qm = Object.prototype, $m = qm.propertyIsEnumerable, zs = Object.getOwnPropertySymbols, _m = zs ? function(n) {
  return n == null ? [] : (n = Object(n), Dm(zs(n), function(l) {
    return $m.call(n, l);
  }));
} : Am, vd = _m;
function ln(n, l) {
  for (var i = -1, c = Array(n); ++i < n; )
    c[i] = l(i);
  return c;
}
var dn = ln;
function sn(n) {
  return n != null && typeof n == "object";
}
var ul = sn, tn = gl, bn = ul, cn = "[object Arguments]";
function Zn(n) {
  return bn(n) && tn(n) == cn;
}
var mn = Zn, Ms = mn, nn = ul, Ft = Object.prototype, Xn = Ft.hasOwnProperty, on = Ft.propertyIsEnumerable, an = Ms(/* @__PURE__ */ function() {
  return arguments;
}()) ? Ms : function(n) {
  return nn(n) && Xn.call(n, "callee") && !on.call(n, "callee");
}, en = an, Al = { exports: {} };
function Wn() {
  return !1;
}
var un = Wn;
Al.exports;
(function(n, l) {
  var i = tl, c = un, m = l && !l.nodeType && l, L = m && !0 && n && !n.nodeType && n, K = L && L.exports === m, u = K ? i.Buffer : void 0, a = u ? u.isBuffer : void 0, e = a || c;
  n.exports = e;
})(Al, Al.exports);
var Ud = Al.exports, Gn = 9007199254740991, hn = /^(?:0|[1-9]\d*)$/;
function Vn(n, l) {
  var i = typeof n;
  return l = l ?? Gn, !!l && (i == "number" || i != "symbol" && hn.test(n)) && n > -1 && n % 1 == 0 && n < l;
}
var In = Vn, pn = 9007199254740991;
function Ln(n) {
  return typeof n == "number" && n > -1 && n % 1 == 0 && n <= pn;
}
var Tt = Ln, yn = gl, rn = Tt, Kn = ul, Sn = "[object Arguments]", Rn = "[object Array]", xn = "[object Boolean]", Yn = "[object Date]", Cn = "[object Error]", Jn = "[object Function]", Fn = "[object Map]", Tn = "[object Number]", Nn = "[object Object]", gn = "[object RegExp]", Hn = "[object Set]", zn = "[object String]", Mn = "[object WeakMap]", kn = "[object ArrayBuffer]", fn = "[object DataView]", vn = "[object Float32Array]", Un = "[object Float64Array]", Qn = "[object Int8Array]", Pn = "[object Int16Array]", En = "[object Int32Array]", wn = "[object Uint8Array]", jn = "[object Uint8ClampedArray]", Bn = "[object Uint16Array]", On = "[object Uint32Array]", zi = {};
zi[vn] = zi[Un] = zi[Qn] = zi[Pn] = zi[En] = zi[wn] = zi[jn] = zi[Bn] = zi[On] = !0;
zi[Sn] = zi[Rn] = zi[kn] = zi[xn] = zi[fn] = zi[Yn] = zi[Cn] = zi[Jn] = zi[Fn] = zi[Tn] = zi[Nn] = zi[gn] = zi[Hn] = zi[zn] = zi[Mn] = !1;
function Dn(n) {
  return Kn(n) && rn(n.length) && !!zi[yn(n)];
}
var An = Dn;
function qn(n) {
  return function(l) {
    return n(l);
  };
}
var Qd = qn, ql = { exports: {} };
ql.exports;
(function(n, l) {
  var i = pt, c = l && !l.nodeType && l, m = c && !0 && n && !n.nodeType && n, L = m && m.exports === c, K = L && i.process, u = function() {
    try {
      var a = m && m.require && m.require("util").types;
      return a || K && K.binding && K.binding("util");
    } catch {
    }
  }();
  n.exports = u;
})(ql, ql.exports);
var Pd = ql.exports, $n = An, _n = Qd, ks = Pd, fs = ks && ks.isTypedArray, iX = fs ? _n(fs) : $n, Nt = iX, lX = dn, dX = en, sX = td, tX = Ud, bX = In, cX = Nt, ZX = Object.prototype, mX = ZX.hasOwnProperty;
function nX(n, l) {
  var i = sX(n), c = !i && dX(n), m = !i && !c && tX(n), L = !i && !c && !m && cX(n), K = i || c || m || L, u = K ? lX(n.length, String) : [], a = u.length;
  for (var e in n)
    (l || mX.call(n, e)) && !(K && // Safari 9 has enumerable `arguments.length` in strict mode.
    (e == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    m && (e == "offset" || e == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    L && (e == "buffer" || e == "byteLength" || e == "byteOffset") || // Skip index properties.
    bX(e, a))) && u.push(e);
  return u;
}
var gt = nX, XX = Object.prototype;
function oX(n) {
  var l = n && n.constructor, i = typeof l == "function" && l.prototype || XX;
  return n === i;
}
var Ed = oX;
function aX(n, l) {
  return function(i) {
    return n(l(i));
  };
}
var Ht = aX, eX = Ht, WX = eX(Object.keys, Object), uX = WX, GX = Ed, hX = uX, VX = Object.prototype, IX = VX.hasOwnProperty;
function pX(n) {
  if (!GX(n))
    return hX(n);
  var l = [];
  for (var i in Object(n))
    IX.call(n, i) && i != "constructor" && l.push(i);
  return l;
}
var LX = pX, yX = yt, rX = Tt;
function KX(n) {
  return n != null && rX(n.length) && !yX(n);
}
var zt = KX, SX = gt, RX = LX, xX = zt;
function YX(n) {
  return xX(n) ? SX(n) : RX(n);
}
var wd = YX, CX = Ct, JX = vd, FX = wd;
function TX(n) {
  return CX(n, FX, JX);
}
var Mt = TX, vs = Mt, NX = 1, gX = Object.prototype, HX = gX.hasOwnProperty;
function zX(n, l, i, c, m, L) {
  var K = i & NX, u = vs(n), a = u.length, e = vs(l), r = e.length;
  if (a != r && !K)
    return !1;
  for (var X = a; X--; ) {
    var W = u[X];
    if (!(K ? W in l : HX.call(l, W)))
      return !1;
  }
  var p = L.get(n), C = L.get(l);
  if (p && C)
    return p == l && C == n;
  var I = !0;
  L.set(n, l), L.set(l, n);
  for (var o = K; ++X < a; ) {
    W = u[X];
    var G = n[W], d = l[W];
    if (c)
      var t = K ? c(d, G, W, l, n, L) : c(G, d, W, n, l, L);
    if (!(t === void 0 ? G === d || m(G, d, i, c, L) : t)) {
      I = !1;
      break;
    }
    o || (o = W == "constructor");
  }
  if (I && !o) {
    var s = n.constructor, b = l.constructor;
    s != b && "constructor" in n && "constructor" in l && !(typeof s == "function" && s instanceof s && typeof b == "function" && b instanceof b) && (I = !1);
  }
  return L.delete(n), L.delete(l), I;
}
var MX = zX, kX = Wl, fX = tl, vX = kX(fX, "DataView"), UX = vX, QX = Wl, PX = tl, EX = QX(PX, "Promise"), wX = EX, jX = Wl, BX = tl, OX = jX(BX, "Set"), DX = OX, AX = Wl, qX = tl, $X = AX(qX, "WeakMap"), _X = $X, Cd = UX, Jd = fd, Fd = wX, Td = DX, Nd = _X, kt = gl, xl = rt, Us = "[object Map]", io = "[object Object]", Qs = "[object Promise]", Ps = "[object Set]", Es = "[object WeakMap]", ws = "[object DataView]", lo = xl(Cd), so = xl(Jd), to = xl(Fd), bo = xl(Td), co = xl(Nd), ol = kt;
(Cd && ol(new Cd(new ArrayBuffer(1))) != ws || Jd && ol(new Jd()) != Us || Fd && ol(Fd.resolve()) != Qs || Td && ol(new Td()) != Ps || Nd && ol(new Nd()) != Es) && (ol = function(n) {
  var l = kt(n), i = l == io ? n.constructor : void 0, c = i ? xl(i) : "";
  if (c)
    switch (c) {
      case lo:
        return ws;
      case so:
        return Us;
      case to:
        return Qs;
      case bo:
        return Ps;
      case co:
        return Es;
    }
  return l;
});
var bd = ol, yd = St, Zo = Rt, mo = vm, no = MX, js = bd, Bs = td, Os = Ud, Xo = Nt, oo = 1, Ds = "[object Arguments]", As = "[object Array]", El = "[object Object]", ao = Object.prototype, qs = ao.hasOwnProperty;
function eo(n, l, i, c, m, L) {
  var K = Bs(n), u = Bs(l), a = K ? As : js(n), e = u ? As : js(l);
  a = a == Ds ? El : a, e = e == Ds ? El : e;
  var r = a == El, X = e == El, W = a == e;
  if (W && Os(n)) {
    if (!Os(l))
      return !1;
    K = !0, r = !1;
  }
  if (W && !r)
    return L || (L = new yd()), K || Xo(n) ? Zo(n, l, i, c, m, L) : mo(n, l, a, i, c, m, L);
  if (!(i & oo)) {
    var p = r && qs.call(n, "__wrapped__"), C = X && qs.call(l, "__wrapped__");
    if (p || C) {
      var I = p ? n.value() : n, o = C ? l.value() : l;
      return L || (L = new yd()), m(I, o, i, c, L);
    }
  }
  return W ? (L || (L = new yd()), no(n, l, i, c, m, L)) : !1;
}
var Wo = eo, uo = Wo, $s = ul;
function ft(n, l, i, c, m) {
  return n === l ? !0 : n == null || l == null || !$s(n) && !$s(l) ? n !== n && l !== l : uo(n, l, i, c, ft, m);
}
var Go = ft, ho = Go;
function Vo(n, l) {
  return ho(n, l);
}
var Io = Vo;
const _s = /* @__PURE__ */ Hd(Io);
function po(n, l) {
  for (var i = -1, c = n == null ? 0 : n.length; ++i < c && l(n[i], i, n) !== !1; )
    ;
  return n;
}
var Lo = po, yo = Wl, ro = function() {
  try {
    var n = yo(Object, "defineProperty");
    return n({}, "", {}), n;
  } catch {
  }
}(), Ko = ro, it = Ko;
function So(n, l, i) {
  l == "__proto__" && it ? it(n, l, {
    configurable: !0,
    enumerable: !0,
    value: i,
    writable: !0
  }) : n[l] = i;
}
var vt = So, Ro = vt, xo = kd, Yo = Object.prototype, Co = Yo.hasOwnProperty;
function Jo(n, l, i) {
  var c = n[l];
  (!(Co.call(n, l) && xo(c, i)) || i === void 0 && !(l in n)) && Ro(n, l, i);
}
var Ut = Jo, Fo = Ut, To = vt;
function No(n, l, i, c) {
  var m = !i;
  i || (i = {});
  for (var L = -1, K = l.length; ++L < K; ) {
    var u = l[L], a = c ? c(i[u], n[u], u, i, n) : void 0;
    a === void 0 && (a = n[u]), m ? To(i, u, a) : Fo(i, u, a);
  }
  return i;
}
var cd = No, go = cd, Ho = wd;
function zo(n, l) {
  return n && go(l, Ho(l), n);
}
var Mo = zo;
function ko(n) {
  var l = [];
  if (n != null)
    for (var i in Object(n))
      l.push(i);
  return l;
}
var fo = ko, vo = Zl, Uo = Ed, Qo = fo, Po = Object.prototype, Eo = Po.hasOwnProperty;
function wo(n) {
  if (!vo(n))
    return Qo(n);
  var l = Uo(n), i = [];
  for (var c in n)
    c == "constructor" && (l || !Eo.call(n, c)) || i.push(c);
  return i;
}
var jo = wo, Bo = gt, Oo = jo, Do = zt;
function Ao(n) {
  return Do(n) ? Bo(n, !0) : Oo(n);
}
var jd = Ao, qo = cd, $o = jd;
function _o(n, l) {
  return n && qo(l, $o(l), n);
}
var ia = _o, $l = { exports: {} };
$l.exports;
(function(n, l) {
  var i = tl, c = l && !l.nodeType && l, m = c && !0 && n && !n.nodeType && n, L = m && m.exports === c, K = L ? i.Buffer : void 0, u = K ? K.allocUnsafe : void 0;
  function a(e, r) {
    if (r)
      return e.slice();
    var X = e.length, W = u ? u(X) : new e.constructor(X);
    return e.copy(W), W;
  }
  n.exports = a;
})($l, $l.exports);
var la = $l.exports;
function da(n, l) {
  var i = -1, c = n.length;
  for (l || (l = Array(c)); ++i < c; )
    l[i] = n[i];
  return l;
}
var sa = da, ta = cd, ba = vd;
function ca(n, l) {
  return ta(n, ba(n), l);
}
var Za = ca, ma = Ht, na = ma(Object.getPrototypeOf, Object), Qt = na, Xa = Yt, oa = Qt, aa = vd, ea = Jt, Wa = Object.getOwnPropertySymbols, ua = Wa ? function(n) {
  for (var l = []; n; )
    Xa(l, aa(n)), n = oa(n);
  return l;
} : ea, Pt = ua, Ga = cd, ha = Pt;
function Va(n, l) {
  return Ga(n, ha(n), l);
}
var Ia = Va, pa = Ct, La = Pt, ya = jd;
function ra(n) {
  return pa(n, ya, La);
}
var Ka = ra, Sa = Object.prototype, Ra = Sa.hasOwnProperty;
function xa(n) {
  var l = n.length, i = new n.constructor(l);
  return l && typeof n[0] == "string" && Ra.call(n, "index") && (i.index = n.index, i.input = n.input), i;
}
var Ya = xa, lt = xt;
function Ca(n) {
  var l = new n.constructor(n.byteLength);
  return new lt(l).set(new lt(n)), l;
}
var Bd = Ca, Ja = Bd;
function Fa(n, l) {
  var i = l ? Ja(n.buffer) : n.buffer;
  return new n.constructor(i, n.byteOffset, n.byteLength);
}
var Ta = Fa, Na = /\w*$/;
function ga(n) {
  var l = new n.constructor(n.source, Na.exec(n));
  return l.lastIndex = n.lastIndex, l;
}
var Ha = ga, dt = ld, st = dt ? dt.prototype : void 0, tt = st ? st.valueOf : void 0;
function za(n) {
  return tt ? Object(tt.call(n)) : {};
}
var Ma = za, ka = Bd;
function fa(n, l) {
  var i = l ? ka(n.buffer) : n.buffer;
  return new n.constructor(i, n.byteOffset, n.length);
}
var va = fa, Ua = Bd, Qa = Ta, Pa = Ha, Ea = Ma, wa = va, ja = "[object Boolean]", Ba = "[object Date]", Oa = "[object Map]", Da = "[object Number]", Aa = "[object RegExp]", qa = "[object Set]", $a = "[object String]", _a = "[object Symbol]", ie = "[object ArrayBuffer]", le = "[object DataView]", de = "[object Float32Array]", se = "[object Float64Array]", te = "[object Int8Array]", be = "[object Int16Array]", ce = "[object Int32Array]", Ze = "[object Uint8Array]", me = "[object Uint8ClampedArray]", ne = "[object Uint16Array]", Xe = "[object Uint32Array]";
function oe(n, l, i) {
  var c = n.constructor;
  switch (l) {
    case ie:
      return Ua(n);
    case ja:
    case Ba:
      return new c(+n);
    case le:
      return Qa(n, i);
    case de:
    case se:
    case te:
    case be:
    case ce:
    case Ze:
    case me:
    case ne:
    case Xe:
      return wa(n, i);
    case Oa:
      return new c();
    case Da:
    case $a:
      return new c(n);
    case Aa:
      return Pa(n);
    case qa:
      return new c();
    case _a:
      return Ea(n);
  }
}
var ae = oe, ee = Zl, bt = Object.create, We = /* @__PURE__ */ function() {
  function n() {
  }
  return function(l) {
    if (!ee(l))
      return {};
    if (bt)
      return bt(l);
    n.prototype = l;
    var i = new n();
    return n.prototype = void 0, i;
  };
}(), ue = We, Ge = ue, he = Qt, Ve = Ed;
function Ie(n) {
  return typeof n.constructor == "function" && !Ve(n) ? Ge(he(n)) : {};
}
var pe = Ie, Le = bd, ye = ul, re = "[object Map]";
function Ke(n) {
  return ye(n) && Le(n) == re;
}
var Se = Ke, Re = Se, xe = Qd, ct = Pd, Zt = ct && ct.isMap, Ye = Zt ? xe(Zt) : Re, Ce = Ye, Je = bd, Fe = ul, Te = "[object Set]";
function Ne(n) {
  return Fe(n) && Je(n) == Te;
}
var ge = Ne, He = ge, ze = Qd, mt = Pd, nt = mt && mt.isSet, Me = nt ? ze(nt) : He, ke = Me, fe = St, ve = Lo, Ue = Ut, Qe = Mo, Pe = ia, Ee = la, we = sa, je = Za, Be = Ia, Oe = Mt, De = Ka, Ae = bd, qe = Ya, $e = ae, _e = pe, iW = td, lW = Ud, dW = Ce, sW = Zl, tW = ke, bW = wd, cW = jd, ZW = 1, mW = 2, nW = 4, Et = "[object Arguments]", XW = "[object Array]", oW = "[object Boolean]", aW = "[object Date]", eW = "[object Error]", wt = "[object Function]", WW = "[object GeneratorFunction]", uW = "[object Map]", GW = "[object Number]", jt = "[object Object]", hW = "[object RegExp]", VW = "[object Set]", IW = "[object String]", pW = "[object Symbol]", LW = "[object WeakMap]", yW = "[object ArrayBuffer]", rW = "[object DataView]", KW = "[object Float32Array]", SW = "[object Float64Array]", RW = "[object Int8Array]", xW = "[object Int16Array]", YW = "[object Int32Array]", CW = "[object Uint8Array]", JW = "[object Uint8ClampedArray]", FW = "[object Uint16Array]", TW = "[object Uint32Array]", gi = {};
gi[Et] = gi[XW] = gi[yW] = gi[rW] = gi[oW] = gi[aW] = gi[KW] = gi[SW] = gi[RW] = gi[xW] = gi[YW] = gi[uW] = gi[GW] = gi[jt] = gi[hW] = gi[VW] = gi[IW] = gi[pW] = gi[CW] = gi[JW] = gi[FW] = gi[TW] = !0;
gi[eW] = gi[wt] = gi[LW] = !1;
function jl(n, l, i, c, m, L) {
  var K, u = l & ZW, a = l & mW, e = l & nW;
  if (i && (K = m ? i(n, c, m, L) : i(n)), K !== void 0)
    return K;
  if (!sW(n))
    return n;
  var r = iW(n);
  if (r) {
    if (K = qe(n), !u)
      return we(n, K);
  } else {
    var X = Ae(n), W = X == wt || X == WW;
    if (lW(n))
      return Ee(n, u);
    if (X == jt || X == Et || W && !m) {
      if (K = a || W ? {} : _e(n), !u)
        return a ? Be(n, Pe(K, n)) : je(n, Qe(K, n));
    } else {
      if (!gi[X])
        return m ? n : {};
      K = $e(n, X, u);
    }
  }
  L || (L = new fe());
  var p = L.get(n);
  if (p)
    return p;
  L.set(n, K), tW(n) ? n.forEach(function(o) {
    K.add(jl(o, l, i, o, n, L));
  }) : dW(n) && n.forEach(function(o, G) {
    K.set(G, jl(o, l, i, G, n, L));
  });
  var C = e ? a ? De : Oe : a ? cW : bW, I = r ? void 0 : C(n);
  return ve(I || n, function(o, G) {
    I && (G = o, o = n[G]), Ue(K, G, jl(o, l, i, G, n, L));
  }), K;
}
var NW = jl, gW = NW, HW = 1, zW = 4;
function MW(n) {
  return gW(n, HW | zW);
}
var kW = MW;
const wl = /* @__PURE__ */ Hd(kW);
class fW extends bb {
  // private syncBatchMap: Map<string, BaseCollectorReducerAction> = new Map();
  constructor(l) {
    super(), Object.defineProperty(this, "storage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {}
    }), Object.defineProperty(this, "uid", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "plugin", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "namespace", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: ""
    }), Object.defineProperty(this, "stateDisposer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.plugin = l, this.uid = l.displayer.uid;
    const i = l.displayer.state.sceneState.sceneName;
    this.setNamespace(i);
  }
  addStorageStateListener(l) {
    this.stateDisposer = M0(async () => {
      const i = gd(this.plugin.attributes[this.namespace]), c = this.diffFun(this.storage, i);
      this.storage = i;
      for (const m of Object.keys(c)) {
        const L = c[m];
        L && l(m, L);
      }
    });
  }
  removeStorageStateListener() {
    this.stateDisposer && this.stateDisposer();
  }
  diffFun(l, i) {
    const c = Vd(l), m = Vd(i), L = {};
    for (const K of c) {
      if (m.includes(K)) {
        if (_s(l[K], i[K]))
          continue;
        L[K] = {
          oldValue: wl(l[K]),
          newValue: wl(i[K])
        };
        continue;
      }
      L[K] = {
        oldValue: wl(l[K]),
        newValue: void 0
      };
    }
    for (const K of m) {
      if (c.includes(K)) {
        if (_s(l[K], i[K]))
          continue;
        continue;
      }
      L[K] = {
        oldValue: void 0,
        newValue: wl(i[K])
      };
    }
    return L;
  }
  transformKey(l) {
    return this.uid + "@##@" + l;
  }
  isOwn(l) {
    return l.split("@##@")[0] === this.uid;
  }
  dispatch(l) {
    const { type: i, workId: c, ops: m, index: L, opt: K, toolstype: u, w: a, h: e, removeIds: r, updateNodeOpt: X, op: W } = l;
    switch (i) {
      case Fi.Clear:
        const p = {};
        Object.keys(this.storage).filter((C) => C !== "scene").map((C) => {
          p[C] = void 0;
        }), this.setState(p);
        break;
      case Fi.UpdateScene:
        a && e && this.updateValue("scene", {
          uid: this.uid,
          w: a,
          h: e
        });
        break;
      case Fi.CreateWork:
        if (c && u && K) {
          const C = this.isLocalId(c.toString()) ? this.transformKey(c) : c;
          this.updateValue(C.toString(), {
            type: Fi.CreateWork,
            workId: c,
            toolstype: u,
            opt: K
          });
        }
        break;
      case Fi.UpdateWork:
        if (c && u && K) {
          const C = this.isLocalId(c.toString()) ? this.transformKey(c) : c, I = this.storage[C];
          this.updateValue(C.toString(), {
            ...I,
            type: Fi.UpdateWork,
            workId: c,
            toolstype: u,
            opt: K
          });
        }
        break;
      case Fi.DrawWork:
        if (c && typeof L == "number" && (W != null && W.length)) {
          const C = this.isLocalId(c.toString()) ? this.transformKey(c) : c, I = this.storage[C], o = ((I == null ? void 0 : I.op) || []).slice(0, L).concat(W);
          I && o && this.updateValue(C.toString(), {
            ...I,
            type: Fi.DrawWork,
            op: o,
            index: L
          });
        }
        break;
      case Fi.FullWork:
        if (c) {
          const C = this.isLocalId(c.toString()) ? this.transformKey(c) : c, I = this.storage[C], o = u || (I == null ? void 0 : I.toolstype), G = K || (I == null ? void 0 : I.opt);
          I && o && G && m && this.updateValue(C.toString(), {
            type: Fi.FullWork,
            workId: C,
            toolstype: o,
            opt: G,
            ops: m
          });
        }
        break;
      case Fi.RemoveNode:
        if (r != null && r.length) {
          const C = r.map((I) => this.isLocalId(I + "") ? this.transformKey(I) : I);
          Object.keys(this.storage).filter((I) => I !== "scene").map((I) => {
            C != null && C.includes(I) && this.updateValue(I, void 0);
          });
        }
        break;
      case Fi.UpdateNode:
        if (c && X) {
          const C = this.storage[c];
          C && (C.updateNodeOpt = X, this.updateValue(c.toString(), C));
        }
        break;
    }
  }
  setState(l) {
    const i = Vd(l);
    for (let m = 0; m < i.length; m++) {
      const L = i[m], K = l[L];
      typeof K < "u" ? this.storage[L] = K : delete this.storage[L];
    }
    const c = {};
    c[this.namespace] = this.storage, this.plugin.setAttributes(c);
  }
  updateValue(l, i) {
    this.storage[l] = i, this.plugin.updateAttributes([this.namespace, l], i);
  }
  transformToSerializableData(l) {
    return Q0(l);
  }
  transformToNormalData(l) {
    return U0(l);
  }
  keyTransformWorkId(l) {
    const i = l.split("@##@");
    return i.length === 2 ? i[1] : l;
  }
  destroy() {
  }
}
var vW = tl, UW = function() {
  return vW.Date.now();
}, QW = UW, PW = /\s/;
function EW(n) {
  for (var l = n.length; l-- && PW.test(n.charAt(l)); )
    ;
  return l;
}
var wW = EW, jW = wW, BW = /^\s+/;
function OW(n) {
  return n && n.slice(0, jW(n) + 1).replace(BW, "");
}
var DW = OW, AW = gl, qW = ul, $W = "[object Symbol]";
function _W(n) {
  return typeof n == "symbol" || qW(n) && AW(n) == $W;
}
var iu = _W, lu = DW, Xt = Zl, du = iu, ot = NaN, su = /^[-+]0x[0-9a-f]+$/i, tu = /^0b[01]+$/i, bu = /^0o[0-7]+$/i, cu = parseInt;
function Zu(n) {
  if (typeof n == "number")
    return n;
  if (du(n))
    return ot;
  if (Xt(n)) {
    var l = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = Xt(l) ? l + "" : l;
  }
  if (typeof n != "string")
    return n === 0 ? n : +n;
  n = lu(n);
  var i = tu.test(n);
  return i || bu.test(n) ? cu(n.slice(2), i ? 2 : 8) : su.test(n) ? ot : +n;
}
var mu = Zu, nu = Zl, rd = QW, at = mu, Xu = "Expected a function", ou = Math.max, au = Math.min;
function eu(n, l, i) {
  var c, m, L, K, u, a, e = 0, r = !1, X = !1, W = !0;
  if (typeof n != "function")
    throw new TypeError(Xu);
  l = at(l) || 0, nu(i) && (r = !!i.leading, X = "maxWait" in i, L = X ? ou(at(i.maxWait) || 0, l) : L, W = "trailing" in i ? !!i.trailing : W);
  function p(h) {
    var S = c, Y = m;
    return c = m = void 0, e = h, K = n.apply(Y, S), K;
  }
  function C(h) {
    return e = h, u = setTimeout(G, l), r ? p(h) : K;
  }
  function I(h) {
    var S = h - a, Y = h - e, T = l - S;
    return X ? au(T, L - Y) : T;
  }
  function o(h) {
    var S = h - a, Y = h - e;
    return a === void 0 || S >= l || S < 0 || X && Y >= L;
  }
  function G() {
    var h = rd();
    if (o(h))
      return d(h);
    u = setTimeout(G, I(h));
  }
  function d(h) {
    return u = void 0, W && c ? p(h) : (c = m = void 0, K);
  }
  function t() {
    u !== void 0 && clearTimeout(u), e = 0, c = a = m = u = void 0;
  }
  function s() {
    return u === void 0 ? K : d(rd());
  }
  function b() {
    var h = rd(), S = o(h);
    if (c = arguments, m = this, a = h, S) {
      if (u === void 0)
        return C(a);
      if (X)
        return clearTimeout(u), u = setTimeout(G, l), p(a);
    }
    return u === void 0 && (u = setTimeout(G, l)), K;
  }
  return b.cancel = t, b.flush = s, b;
}
var Wu = eu, uu = Wu, Gu = Zl, hu = "Expected a function";
function Vu(n, l, i) {
  var c = !0, m = !0;
  if (typeof n != "function")
    throw new TypeError(hu);
  return Gu(i) && (c = "leading" in i ? !!i.leading : c, m = "trailing" in i ? !!i.trailing : m), uu(n, l, {
    leading: c,
    maxWait: l,
    trailing: m
  });
}
var Iu = Vu;
const pu = /* @__PURE__ */ Hd(Iu);
function Lu(n, l, i) {
  return "#" + ((n << 16) + (l << 8) + i).toString(16).padStart(6, "0");
}
class yu {
  constructor(l, i) {
    Object.defineProperty(this, "plugin", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pluginOptions", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "collector", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "worker", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "room", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "disposeDisplayerSubscribe", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
      }
    }), Object.defineProperty(this, "resizeChange", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        var m, L, K, u;
        const c = (m = ll.instance) == null ? void 0 : m.containerRef;
        if (c) {
          const a = c.offsetWidth, e = c.offsetHeight;
          (L = this.worker) == null || L.updateCanvas({
            width: a,
            height: e
          }, Ai.Local);
          const r = (K = ll.instance) == null ? void 0 : K.canvasBgRef, X = (u = ll.instance) == null ? void 0 : u.canvasFloatRef;
          r && X && (X.style.width = `${a}px`, X.style.height = `${e}px`, r.style.width = `${a}px`, r.style.height = `${e}px`);
        }
      }
    }), Object.defineProperty(this, "_throttled", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: pu(this.resizeChange, 500, { leading: !1 })
    }), Object.defineProperty(this, "mousedown", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        c.button === 0 && ((m = this.worker) == null || m.onLocalEventStart([c.offsetX, c.offsetY]));
      }
    }), Object.defineProperty(this, "mousemove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        (m = this.worker) == null || m.onLocalEventDoing([c.offsetX, c.offsetY]);
      }
    }), Object.defineProperty(this, "mouseup", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        c.button === 0 && ((m = this.worker) == null || m.onLocalEventEnd([c.offsetX, c.offsetY]));
      }
    }), Object.defineProperty(this, "touchstart", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        (m = this.worker) == null || m.onLocalEventStart([c.targetTouches[0].pageX, c.targetTouches[0].pageY]);
      }
    }), Object.defineProperty(this, "touchmove", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        (m = this.worker) == null || m.onLocalEventDoing([c.targetTouches[0].pageX, c.targetTouches[0].pageY]);
      }
    }), Object.defineProperty(this, "touchend", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        var m;
        (m = this.worker) == null || m.onLocalEventEnd([c.changedTouches[0].pageX, c.changedTouches[0].pageY]);
      }
    }), this.plugin = l, this.room = Kd(l.displayer) ? l.displayer : void 0, this.pluginOptions = i;
  }
  init() {
    this.disposeDisplayerSubscribe = ll.displayState$.subscribe((l) => {
      l === el.mounted && this.onMountDisplayer(), l === el.unmounted && this.onUnMountDisplayer();
    });
  }
  cleanCurrentScene() {
    var l;
    (l = this.worker) == null || l.clearAll();
  }
  destroy() {
    this.disposeDisplayerSubscribe();
  }
  onCameraChange(l) {
    var i;
    (i = this.worker) == null || i.setCameraOpt(gd(l));
  }
  onSceneChange(l) {
    var i, c, m;
    (i = this.collector) == null || i.setNamespace(l.sceneName), (c = this.worker) == null || c.clearAll(!0), (m = this.worker) == null || m.initSyncData(() => {
    });
  }
  onMemberChange(l) {
    var L, K, u;
    if (!this.room)
      return;
    const i = l.currentApplianceName, c = i === Il.pencil && l.useLaserPen ? sl.LaserPen : i === Il.eraser ? sl.Eraser : i === Il.pencil ? sl.Pencil : sl.Clicker, m = {
      color: Lu(l.strokeColor[0], l.strokeColor[1], l.strokeColor[2]),
      opacity: (l == null ? void 0 : l.strokeOpacity) || 1
    };
    c === sl.Pencil ? (m.thickness = l.strokeWidth, m.strokeType = (l == null ? void 0 : l.strokeType) || Bl.Stroke) : c === sl.Eraser ? (m.thickness = l.strokeWidth, m.isLine = (l == null ? void 0 : l.isLine) || !1) : c === sl.LaserPen && (m.thickness = l.strokeWidth, m.duration = (l == null ? void 0 : l.duration) || 1, m.strokeType = (l == null ? void 0 : l.strokeType) || Bl.Normal), (L = this.worker) == null || L.setCurrentToolsData({
      toolsType: c,
      toolsOpt: m
    }), i === Il.eraser || i === Il.pencil ? (i === Il.pencil && (this.room.disableDeviceInputs = !0), (K = this.worker) == null || K.abled()) : (this.room.disableDeviceInputs = !1, (u = this.worker) == null || u.unabled());
  }
  onWritableChange(l) {
    var i, c;
    l ? (c = this.worker) == null || c.abled() : (i = this.worker) == null || i.unabled();
  }
  onMountDisplayer() {
    var m, L, K;
    const l = (m = ll.instance) == null ? void 0 : m.containerRef, i = (L = ll.instance) == null ? void 0 : L.canvasFloatRef, c = (K = ll.instance) == null ? void 0 : K.canvasBgRef;
    i && c && l && (i.width = l.offsetWidth, i.height = l.offsetHeight, c.width = l.offsetWidth, c.height = l.offsetHeight, this.collector = new fW(this.plugin), this.worker = new $i(c, i, this.collector, this.pluginOptions), this.collector.addStorageStateListener((u, a) => {
      var e, r;
      if (u === "screen" && a.newValue) {
        const { w: X, h: W } = a.newValue;
        X && W && (c && i && (c.width = X, c.height = W, i.width = X, i.height = W), (e = this.worker) == null || e.updateCanvas({
          width: X,
          height: W
        }, Ai.Service));
      } else
        (r = this.worker) == null || r.onServiceDerive(u, a);
    }), this.worker.initSyncData((u, a) => {
      if (u === "screen" && a) {
        const { w: e, h: r } = a;
        e && r && c && i && (c.width = e, c.height = r, i.width = e, i.height = r);
      }
    }), this.bindDisplayerEvent(l), this.resizeChange());
  }
  onUnMountDisplayer() {
    var i, c, m;
    const l = (i = ll.instance) == null ? void 0 : i.containerRef;
    l && this.removeDisplayerEvent(l), (c = this.collector) == null || c.destroy(), (m = this.worker) == null || m.destroy(), this.collector = void 0, this.worker = void 0;
  }
  bindDisplayerEvent(l) {
    l.addEventListener("mousedown", this.mousedown, !0), l.addEventListener("mousemove", this.mousemove, !0), l.addEventListener("mouseup", this.mouseup, !0), l.addEventListener("mouseleave", this.mouseup, !0), l.addEventListener("touchstart", this.touchstart, !0), l.addEventListener("touchmove", this.touchmove, !0), l.addEventListener("touchend", this.touchend, !0), window.addEventListener("resize", this._throttled);
  }
  removeDisplayerEvent(l) {
    l.removeEventListener("mousedown", this.mousedown), l.removeEventListener("mousemove", this.mousemove), l.removeEventListener("mouseup", this.mouseup), l.removeEventListener("mouseleave", this.mouseup), l.removeEventListener("touchstart", this.touchstart), l.removeEventListener("touchmove", this.touchmove), l.removeEventListener("touchend", this.touchend), window.removeEventListener("resize", this._throttled);
  }
}
class Hi extends k0 {
  static async getInstance(l, i) {
    i != null && i.logger && (Hi.logger = i.logger), i != null && i.options && (Hi.options = i.options);
    let c = l.getInvisiblePlugin(Hi.kind);
    if (!c)
      if (Kd(l) && l.isWritable) {
        if (!l.isWritable)
          return l;
        c = await l.createInvisiblePlugin(Hi, {});
      } else
        return l;
    return c == null || c.init(l), Hi.effectInstance(l), l;
  }
  /**
   * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
   * @param displayer
   */
  static effectInstance(l) {
    const i = l.cleanCurrentScene;
    return l.cleanCurrentScene = function(c) {
      Hi.currentManager.cleanCurrentScene(), Hi.logger.info("[Projector plugin] cleanCurrentScene"), i.call(l, c);
    }, l;
  }
  constructor(l) {
    super(l), Object.defineProperty(this, "onPhaseChanged", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (c) => {
        c === f0.Disconnected && (this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener), this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable), this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged), Hi.invisiblePlugins.delete(this.displayer), Hi.currentManager.destroy());
      }
    }), Object.defineProperty(this, "updateRoomWritable", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        Hi.currentManager.onWritableChange(this.displayer.isWritable);
      }
    }), Object.defineProperty(this, "roomStateChangeListener", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: async (c) => {
        c.cameraState && Hi.currentManager.onCameraChange(c.cameraState), c.memberState && Hi.currentManager.onMemberChange(c.memberState), c.sceneState && Hi.currentManager.onSceneChange(c.sceneState);
      }
    }), Object.defineProperty(this, "createCurrentManager", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        Hi.currentManager && Hi.currentManager.destroy();
        const c = new yu(this, Hi.options);
        c.init(), Hi.currentManager = c, Hi.logger.info("[Projector plugin] refresh currentSlideManager object");
      }
    });
    const i = Hi.invisiblePlugins.get(this.displayer);
    i && ib(i, this);
  }
  get isReplay() {
    return v0(this.displayer);
  }
  get callbackName() {
    return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
  }
  init(l) {
    const i = It(l.getInvisiblePlugin(Hi.kind));
    Hi.invisiblePlugins.set(l, i), Kd(l) && this.createCurrentManager(), this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener), this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable), this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
  }
}
Object.defineProperty(Hi, "kind", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: "bezier-pencil-plugin"
});
Object.defineProperty(Hi, "invisiblePlugins", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: /* @__PURE__ */ new WeakMap()
});
Object.defineProperty(Hi, "logger", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    info: console.log,
    warn: console.warn,
    error: console.error
  }
});
export {
  ll as BezierPencilDisplayer,
  Hi as BezierPencilPlugin,
  el as DisplayStateEnum,
  Sd as ECanvasContextType,
  Ol as ECanvasShowType,
  Ai as EDataType,
  Fi as EPostMessageType,
  Ls as EShapeDataTypeKey,
  ps as ESpriteNodeKey,
  Bl as EStrokeType,
  sl as EToolsKey,
  ys as EanimationMode,
  Bi as EvevtWorkState,
  $i as MainEngineForWorker
};
//# sourceMappingURL=bezier-pencil-plugin.mjs.map