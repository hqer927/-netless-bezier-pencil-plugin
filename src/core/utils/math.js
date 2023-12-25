import { Vec2d } from "./primitives/Vec2d";
export function computRect(rect1, rect2) {
    if (rect1 && rect2) {
        const x = Math.min(rect1?.x, rect2.x);
        const y = Math.min(rect1?.y, rect2.y);
        const maxX = Math.max(rect1.x + rect1.w, rect2.x + rect2.w);
        const maxY = Math.max(rect1.y + rect1.h, rect2.y + rect2.h);
        const w = maxX - x;
        const h = maxY - y;
        return { x, y, w, h };
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
export function getPathRect(node, oldRect, tolerance = 0) {
    const r = node?.getBoundingClientRect();
    if (r) {
        return computRect(oldRect, {
            x: Math.floor(r.x - tolerance),
            y: Math.floor(r.y - tolerance),
            w: Math.floor(r.width + tolerance * 2),
            h: Math.floor(r.height + tolerance * 2)
        });
    }
    return oldRect;
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
