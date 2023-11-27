import { PointLike } from './primitives/Point2d';
/**
 * Turn an array of points into a path of quadradic curves.
 *
 * @param points - The points returned from perfect-freehand
 * @param closed - Whether the stroke is closed
 *
 * @public
 */
export declare function getSvgPathFromPoints(points: PointLike[], closed?: boolean): string;
