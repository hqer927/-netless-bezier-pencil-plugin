import { IRectType } from "../types";
import { Point2d } from "./primitives/Point2d";
export declare function computRect(rect1?: IRectType, rect2?: IRectType): IRectType | undefined;
export declare function getRectFromPoints(points: Point2d[], offset?: number): {
    x: number;
    y: number;
    w: number;
    h: number;
};
