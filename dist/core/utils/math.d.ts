import { Path } from "spritejs";
import { IRectType } from "../types";
import { Point2d } from "./primitives/Point2d";
import { Vec2d } from "./primitives/Vec2d";
export declare function computRect(rect1?: IRectType, rect2?: IRectType): IRectType | undefined;
export declare function getRectFromPoints(points: (Point2d | Vec2d)[], offset?: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function isIntersect(rect1: IRectType, rect2: IRectType): boolean;
export declare function isSameArray(a: Array<string | number>, b: Array<string | number>): boolean;
export declare function getPathRect(node: Path, oldRect?: IRectType, tolerance?: number): IRectType | undefined;
export declare function getRectRotated(rect: IRectType, angle: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare function rotatePoints(points: number[], originPos: [number, number], angle: number): void;
export declare function scalePoints(points: number[], originPos: [number, number], scale: [number, number]): void;
