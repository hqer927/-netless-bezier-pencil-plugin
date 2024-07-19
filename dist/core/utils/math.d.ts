import { Group } from "spritejs";
import { IRectType } from "../types";
import { Point2d } from "./primitives/Point2d";
import { Vec2d } from "./primitives/Vec2d";
import type { Rectangle } from "../types";
export declare function outerRect(rect: IRectType, offset: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function interRect(rect: IRectType, offset: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function computRect(rect1?: IRectType, rect2?: IRectType): IRectType | undefined;
export declare function computRectangle(rect1?: Rectangle, rect2?: Rectangle): Rectangle | undefined;
export declare function getRectFromPoints(points: (Point2d | Vec2d)[], offset?: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function isIntersect(rect1: IRectType, rect2: IRectType): boolean;
export declare function isSameArray(a: Array<string | number>, b: Array<string | number>): boolean;
export declare function getSafetyRect(oldRect: IRectType, tolerance?: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function getRectTranslated(rect: IRectType, translate: [number, number]): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function getRectRotatedPoints(rect: IRectType, angle: number): Vec2d[];
export declare function getRectRotated(rect: IRectType, angle: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function getRectScaleed(rect: IRectType, scale: [number, number]): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function getScalePoints(points: Vec2d[], originPos: Vec2d, scale: [number, number]): Vec2d[];
export declare function getRotatePoints(points: Vec2d[], originPos: Vec2d, angle: number): Vec2d[];
export declare function rotatePoints(points: number[], originPos: [number, number], angle: number): void;
export declare function scalePoints(points: number[], originPos: [number, number], scale: [number, number]): void;
export declare function getNodeRect(key: string, layer?: Group, safeBorderPadding?: number): IRectType | undefined;
export declare function isIntersectForPoint(point: [number, number], rect: IRectType): boolean;
export declare const getLineSegIntersection: (p1: [number, number], p2: [number, number], p3: [number, number], p4: [number, number]) => [number, number] | null;
export declare function getWHRatio(w: number, h: number): [number, number];
export declare function checkOp(op: number[]): boolean;
