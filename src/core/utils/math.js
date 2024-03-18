import { Vec2d } from "./primitives/Vec2d";
import { EStrokeType } from "../../plugin/types";
export function computRect(rect1, rect2) {
    if (rect1 && rect2) {
        const x = Math.min(rect1.x, rect2.x);
        const y = Math.min(rect1.y, rect2.y);
        const maxX = Math.max(rect1.x + rect1.w, rect2.x + rect2.w);
        const maxY = Math.max(rect1.y + rect1.h, rect2.y + rect2.h);
        const w = maxX - x;
        const h = maxY - y;
        return { x, y, w, h };
    }
    return rect2 || rect1;
}
export function computRectangle(rect1, rect2) {
    if (rect1 && rect2) {
        const originX = Math.min(rect1.originX, rect2.originX);
        const originY = Math.min(rect1.originY, rect2.originY);
        const maxX = Math.max(rect1.originX + rect1.width, rect2.originX + rect2.width);
        const maxY = Math.max(rect1.originY + rect1.height, rect2.originY + rect2.height);
        const width = maxX - originX;
        const height = maxY - originY;
        return { originX, originY, width, height };
    }
    return rect2 || rect1;
}
export function getRectFromPoints(points, offset = 0) {
    const rect = { x: 0, y: 0, w: 0, h: 0 };
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    points.forEach(p => {
        const [x, y] = p.XY;
        minX = Math.min(minX, x - offset);
        minY = Math.min(minY, y - offset);
        maxX = Math.max(maxX, x + offset);
        maxY = Math.max(maxY, y + offset);
    });
    rect.x = minX;
    rect.y = minY;
    rect.w = maxX - minX;
    rect.h = maxY - minY;
    return rect;
}
export function isIntersect(rect1, rect2) {
    return !(rect1.x + rect1.w < rect2.x || rect1.x > rect2.x + rect2.w || rect1.y + rect1.h < rect2.y || rect1.y > rect2.y + rect2.h);
}
export function isSameArray(a, b) {
    return a.length === b.length && a.sort().toString() === b.sort().toString();
}
export function getSafetyRect(oldRect, tolerance = 10) {
    return {
        x: Math.floor(oldRect.x - tolerance),
        y: Math.floor(oldRect.y - tolerance),
        w: Math.floor(oldRect.w + tolerance * 2),
        h: Math.floor(oldRect.h + tolerance * 2)
    };
}
export function getRectRotated(rect, angle) {
    const p1 = new Vec2d(rect.x, rect.y);
    const p2 = new Vec2d(rect.x + rect.w, rect.y);
    const p3 = new Vec2d(rect.x + rect.w, rect.y + rect.h);
    const p4 = new Vec2d(rect.x, rect.y + rect.h);
    const cp = new Vec2d(rect.x + rect.w / 2, rect.y + rect.h / 2);
    const dir = Math.PI * angle / 180;
    const np1 = Vec2d.RotWith(p1, cp, dir);
    const np2 = Vec2d.RotWith(p2, cp, dir);
    const np3 = Vec2d.RotWith(p3, cp, dir);
    const np4 = Vec2d.RotWith(p4, cp, dir);
    return getRectFromPoints([np1, np2, np3, np4]);
}
export function getRectScaleed(rect, scale) {
    const p1 = new Vec2d(rect.x, rect.y);
    const p2 = new Vec2d(rect.x + rect.w, rect.y);
    const p3 = new Vec2d(rect.x + rect.w, rect.y + rect.h);
    const p4 = new Vec2d(rect.x, rect.y + rect.h);
    const cp = new Vec2d(rect.x + rect.w / 2, rect.y + rect.h / 2);
    const sv = new Vec2d(scale[0], scale[1]);
    const np1 = Vec2d.ScaleWOrigin(p1, sv, cp);
    const np2 = Vec2d.ScaleWOrigin(p2, sv, cp);
    const np3 = Vec2d.ScaleWOrigin(p3, sv, cp);
    const np4 = Vec2d.ScaleWOrigin(p4, sv, cp);
    return getRectFromPoints([np1, np2, np3, np4]);
}
export function rotatePoints(points, originPos, angle) {
    const cp = new Vec2d(originPos[0], originPos[1]);
    for (let i = 0; i < points.length; i += 3) {
        const p = new Vec2d(points[i], points[i + 1]);
        const dir = Math.PI * angle / 180;
        const np = Vec2d.RotWith(p, cp, dir);
        points[i] = np.x;
        points[i + 1] = np.y;
    }
}
export function scalePoints(points, originPos, scale) {
    const cp = new Vec2d(originPos[0], originPos[1]);
    for (let i = 0; i < points.length; i += 3) {
        const p = new Vec2d(points[i], points[i + 1]);
        const sv = new Vec2d(scale[0], scale[1]);
        if (i < points.length - 3) {
            const p1 = new Vec2d(points[i + 3], points[i + 4]);
            const r = Vec2d.Tan(p1, p).per().mul(points[i + 2]).mulV(sv).len();
            points[i + 2] = r;
        }
        else if (i === points.length - 3) {
            const p0 = new Vec2d(points[i - 3], points[i - 2]);
            const r = Vec2d.Tan(p, p0).per().mul(points[i + 2]).mulV(sv).len();
            points[i + 2] = r;
        }
        const np = Vec2d.ScaleWOrigin(p, sv, cp);
        points[i] = np.x;
        points[i + 1] = np.y;
    }
}
export function getNodeRect(key, layer) {
    let rect;
    layer?.getElementsByName(key).forEach(f => {
        if (f.tagName === "PATH") {
            const r = f?.getBoundingClientRect();
            if (r) {
                rect = computRect(rect, {
                    x: Math.floor(r.x),
                    y: Math.floor(r.y),
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                });
            }
        }
        else if (f.tagName === 'GROUP') {
            const other = f.className.split(',');
            if (other.length === 3 && Number(other[2]) === EStrokeType.Stroke) {
                const r = f?.getBoundingClientRect();
                if (r) {
                    rect = computRect(rect, {
                        x: Math.floor(r.x),
                        y: Math.floor(r.y),
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                    });
                }
            }
            else {
                f.children.forEach(c => {
                    if (c.tagName === "PATH") {
                        const r = c?.getBoundingClientRect();
                        if (r) {
                            rect = computRect(rect, {
                                x: Math.floor(r.x),
                                y: Math.floor(r.y),
                                w: Math.round(r.width),
                                h: Math.round(r.height),
                            });
                        }
                    }
                });
            }
        }
    });
    return rect;
}
export function isIntersectForPoint(point, rect) {
    if (point[0] >= rect.x && point[0] <= rect.x + rect.w && point[1] >= rect.y && point[1] <= rect.y + rect.h) {
        return true;
    }
    return false;
}
export const getLineSegIntersection = (p1, p2, p3, p4) => {
    const { 0: x1, 1: y1 } = p1;
    const { 0: x2, 1: y2 } = p2;
    const { 0: x3, 1: y3 } = p3;
    const { 0: x4, 1: y4 } = p4;
    const a = y2 - y1;
    const b = x1 - x2;
    const c = x1 * y2 - x2 * y1;
    const d = y4 - y3;
    const e = x3 - x4;
    const f = x3 * y4 - x4 * y3;
    // 计算分母
    const denominator = a * e - b * d;
    // 判断分母是否为 0（代表平行）
    if (Math.abs(denominator) < 0.000000001) {
        // 这里有个特殊的重叠但只有一个交点的情况，可以考虑处理一下
        return null;
    }
    const px = (c * e - f * b) / denominator;
    const py = (a * f - c * d) / denominator;
    // 判断交点是否在两个线段上
    if (px >= Math.min(x1, x2) &&
        px <= Math.max(x1, x2) &&
        py >= Math.min(y1, y2) &&
        py <= Math.max(y1, y2) &&
        px >= Math.min(x3, x4) &&
        px <= Math.max(x3, x4) &&
        py >= Math.min(y3, y4) &&
        py <= Math.max(y3, y4)) {
        return [px, py];
    }
    return null;
};
