import { EMatrixrRelationType } from '../enum';
import { IRectType } from '../types';
import { Box2d } from './primitives/Box2d';
import { Vec2d, VecLike } from './primitives/Vec2d';
export * from "./math";
export * from "./spriteNode";
/** @public */
export declare function precise(A: VecLike): string;
/** @public */
export declare function average(A: VecLike, B: VecLike): string;
/** @public */
export declare const PI: number;
/** @public */
export declare const TAU: number;
/** @public */
export declare const PI2: number;
/** @public */
export declare const EPSILON: number;
/** @public */
export declare const SIN: (x: number) => number;
/**
 * Clamp a value into a range.
 *
 * @example
 *
 * ```ts
 * const A = clamp(0, 1) // 1
 * ```
 *
 * @param n - The number to clamp.
 * @param min - The minimum value.
 * @public
 */
export declare function clamp(n: number, min: number): number;
/**
 * Clamp a value into a range.
 *
 * @example
 *
 * ```ts
 * const A = clamp(0, 1, 10) // 1
 * const B = clamp(11, 1, 10) // 10
 * const C = clamp(5, 1, 10) // 5
 * ```
 *
 * @param n - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @public
 */
export declare function clamp(n: number, min: number, max: number): number;
/**
 * Get a number to a precision.
 *
 * @param n - The number.
 * @param precision - The precision.
 * @public
 */
export declare function toPrecision(n: number, precision?: number): number;
/**
 * Whether two numbers numbers a and b are approximately equal.
 *
 * @param a - The first point.
 * @param b - The second point.
 * @public
 */
export declare function approximately(a: number, b: number, precision?: number): boolean;
/**
 * Find the approximate perimeter of an ellipse.
 *
 * @param rx - The ellipse's x radius.
 * @param ry - The ellipse's y radius.
 * @public
 */
export declare function perimeterOfEllipse(rx: number, ry: number): number;
/**
 * @param a - Any angle in radians
 * @returns A number between 0 and 2 * PI
 * @public
 */
export declare function canonicalizeRotation(a: number): number;
/**
 * Get the clockwise angle distance between two angles.
 *
 * @param a0 - The first angle.
 * @param a1 - The second angle.
 * @public
 */
export declare function clockwiseAngleDist(a0: number, a1: number): number;
/**
 * Get the counter-clockwise angle distance between two angles.
 *
 * @param a0 - The first angle.
 * @param a1 - The second angle.
 * @public
 */
export declare function counterClockwiseAngleDist(a0: number, a1: number): number;
/**
 * Get the short angle distance between two angles.
 *
 * @param a0 - The first angle.
 * @param a1 - The second angle.
 * @public
 */
export declare function shortAngleDist(a0: number, a1: number): number;
/**
 * Get the long angle distance between two angles.
 *
 * @param a0 - The first angle.
 * @param a1 - The second angle.
 * @public
 */
export declare function longAngleDist(a0: number, a1: number): number;
/**
 * Interpolate an angle between two angles.
 *
 * @param a0 - The first angle.
 * @param a1 - The second angle.
 * @param t - The interpolation value.
 * @public
 */
export declare function lerpAngles(a0: number, a1: number, t: number): number;
/**
 * Get the short distance between two angles.
 *
 * @param a0 - The first angle.
 * @param a1 - The second angle.
 * @public
 */
export declare function angleDelta(a0: number, a1: number): number;
/**
 * Get the "sweep" or short distance between two points on a circle's perimeter.
 *
 * @param C - The center of the circle.
 * @param A - The first point.
 * @param B - The second point.
 * @public
 */
export declare function getSweep(C: VecLike, A: VecLike, B: VecLike): number;
/**
 * Clamp radians within 0 and 2PI
 *
 * @param r - The radian value.
 * @public
 */
export declare function clampRadians(r: number): number;
/**
 * Clamp rotation to even segments.
 *
 * @param r - The rotation in radians.
 * @param segments - The number of segments.
 * @public
 */
export declare function snapAngle(r: number, segments: number): number;
/**
 * Checks whether two angles are approximately at right-angles or parallel to each other
 *
 * @param a - Angle a (radians)
 * @param b - Angle b (radians)
 * @returns True iff the angles are approximately at right-angles or parallel to each other
 * @public
 */
export declare function areAnglesCompatible(a: number, b: number): boolean;
/**
 * Is angle c between angles a and b?
 *
 * @param a - The first angle.
 * @param b - The second angle.
 * @param c - The third angle.
 * @public
 */
export declare function isAngleBetween(a: number, b: number, c: number): boolean;
/**
 * Convert degrees to radians.
 *
 * @param d - The degree in degrees.
 * @public
 */
export declare function degreesToRadians(d: number): number;
/**
 * Convert radians to degrees.
 *
 * @param r - The degree in radians.
 * @public
 */
export declare function radiansToDegrees(r: number): number;
/**
 * Get the length of an arc between two points on a circle's perimeter.
 *
 * @param C - The circle's center as [x, y].
 * @param r - The circle's radius.
 * @param A - The first point.
 * @param B - The second point.
 * @public
 */
export declare function getArcLength(C: VecLike, r: number, A: VecLike, B: VecLike): number;
/**
 * Get a point on the perimeter of a circle.
 *
 * @param cx - The center x of the circle.
 * @param cy - The center y of the circle.
 * @param r - The radius of the circle.
 * @param a - The normalized point on the circle.
 * @public
 */
export declare function getPointOnCircle(cx: number, cy: number, r: number, a: number): Vec2d;
/** @public */
export declare function getPolygonVertices(width: number, height: number, sides: number): Vec2d[];
/**
 * @param a0 - The start point in the A range
 * @param a1 - The end point in the A range
 * @param b0 - The start point in the B range
 * @param b1 - The end point in the B range
 * @returns True if the ranges overlap
 * @public
 */
export declare function rangesOverlap(a0: number, a1: number, b0: number, b1: number): boolean;
/**
 * Finds the intersection of two ranges.
 *
 * @param a0 - The start point in the A range
 * @param a1 - The end point in the A range
 * @param b0 - The start point in the B range
 * @param b1 - The end point in the B range
 * @returns The intersection of the ranges, or null if no intersection
 * @public
 */
export declare function rangeIntersection(a0: number, a1: number, b0: number, b1: number): [number, number] | null;
/**
 * Gets the width/height of a star given its input bounds.
 *
 * @param sides - Number of sides
 * @param w - T target width
 * @param h - Target height
 * @returns Box2d
 * @public
 */
export declare const getStarBounds: (sides: number, w: number, h: number) => Box2d;
/**
 * Utils for working with points.
 *
 * @public
 */
/**
 * Get whether a point is inside of a circle.
 *
 * @param A - The point to check.
 * @param C - The circle's center point as [x, y].
 * @param r - The circle's radius.
 * @returns Boolean
 * @public
 */
export declare function pointInCircle(A: VecLike, C: VecLike, r: number): boolean;
/**
 * Get whether a point is inside of an ellipse.
 *
 * @param point - The point to check.
 * @param center - The ellipse's center point as [x, y].
 * @param rx - The ellipse's x radius.
 * @param ry - The ellipse's y radius.
 * @param rotation - The ellipse's rotation.
 * @returns Boolean
 * @public
 */
export declare function pointInEllipse(A: VecLike, C: VecLike, rx: number, ry: number, rotation?: number): boolean;
/**
 * Get whether a point is inside of a rectangle.
 *
 * @param A - The point to check.
 * @param point - The rectangle's top left point as [x, y].
 * @param size - The rectangle's size as [width, height].
 * @public
 */
export declare function pointInRect(A: VecLike, point: VecLike, size: VecLike): boolean;
/**
 * Get whether a point is inside of a polygon.
 *
 * ```ts
 * const result = pointInPolygon(myPoint, myPoints)
 * ```
 *
 * @public
 */
export declare function pointInPolygon(A: VecLike, points: VecLike[]): boolean;
/**
 * Get whether a point is inside of a bounds.
 *
 * @param A - The point to check.
 * @param b - The bounds to check.
 * @returns Boolean
 * @public
 */
export declare function pointInBounds(A: VecLike, b: Box2d): boolean;
/**
 * Hit test a point and a polyline using a minimum distance.
 *
 * @param A - The point to check.
 * @param points - The points that make up the polyline.
 * @param distance - The mininum distance that qualifies a hit.
 * @returns Boolean
 * @public
 */
export declare function pointInPolyline(A: VecLike, points: VecLike[], distance?: number): boolean;
/**
 * Get whether a point is within a certain distance from a polyline.
 *
 * @param A - The point to check.
 * @param points - The points that make up the polyline.
 * @param distance - The mininum distance that qualifies a hit.
 * @public
 */
export declare function pointNearToPolyline(A: VecLike, points: VecLike[], distance?: number): boolean;
/**
 * Get whether a point is within a certain distance from a line segment.
 *
 * @param A - The point to check.
 * @param p1 - The polyline's first point.
 * @param p2 - The polyline's second point.
 * @param distance - The mininum distance that qualifies a hit.
 * @public
 */
export declare function pointNearToLineSegment(A: VecLike, p1: VecLike, p2: VecLike, distance?: number): boolean;
/**
 * Simplify a line (using Ramer-Douglas-Peucker algorithm).
 *
 * @param points - An array of points as [x, y, ...][]
 * @param tolerance - The minimum line distance (also called epsilon).
 * @returns Simplified array as [x, y, ...][]
 * @public
 */
export declare function simplify(points: VecLike[], tolerance?: number): VecLike[];
/** @public */
export declare function simplify2(points: VecLike[], tolerance?: number): VecLike[];
/** @public */
export declare function getMinX(pts: VecLike[]): number;
/** @public */
export declare function getMinY(pts: VecLike[]): number;
/** @public */
export declare function getMaxX(pts: VecLike[]): number;
/** @public */
export declare function getMaxY(pts: VecLike[]): number;
/** @public */
export declare function getMidX(pts: VecLike[]): number;
/** @public */
export declare function getMidY(pts: VecLike[]): number;
/** @public */
export declare function getWidth(pts: VecLike[]): number;
/** @public */
export declare function getHeight(pts: VecLike[]): number;
/**
 * The DOM likes values to be fixed to 3 decimal places
 *
 * @public
 */
export declare function toDomPrecision(v: number): number;
/**
 * @public
 */
export declare function toFixed(v: number): number;
/**
 * Check if a float is safe to use. ie: Not too big or small.
 * @public
 */
export declare const isSafeFloat: (n: number) => boolean;
export declare const requestAsyncCallBack: (callBack: () => void, timeout: number) => Promise<void>;
export declare const getRatioWithContext: (context?: CanvasRenderingContext2D) => number;
export declare const getRectMatrixrRelation: (rect: IRectType, BoxRect: IRectType) => EMatrixrRelationType;
export declare function strlen(str: string): number;
export declare const getInSertRect: (rect: IRectType, boxRect: IRectType) => {
    x: number;
    y: number;
    w: number;
    h: number;
} | undefined;
