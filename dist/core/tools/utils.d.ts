import { EPostMessageType, EToolsKey } from "../enum";
import { IRectType } from "../types";
import { Ellipse, Group, Path, Polyline, Rect } from "spritejs";
import { PencilOptions, PencilShape } from "./pencil";
import { LaserPenOptions, LaserPenShape } from "./laserPen";
import { EraserOptions, EraserShape } from "./eraser";
import { StarOptions, StarShape } from "./star";
import { SelectorOptions, SelectorShape } from "./selector";
import { ArrowOptions, ArrowShape } from "./arrow";
import { StraightOptions, StraightShape } from "./straight";
import { EllipseOptions, EllipseShape } from "./ellipse";
import { PolygonOptions, PolygonShape } from "./polygon";
import { RectangleOptions, RectangleShape } from "./rectangle";
import { VNodeManager } from "../worker/vNodeManager";
import { SpeechBalloonOptions, SpeechBalloonShape } from "./speechBalloon";
import { TextShape } from "./text";
import { TextOptions } from "../../component/textEditor";
export type ShapeTools = typeof PencilShape | typeof LaserPenShape | typeof EraserShape | typeof StarShape | typeof SelectorShape | typeof ArrowShape | typeof EllipseShape | typeof RectangleShape | typeof StarShape | typeof PolygonShape | typeof TextShape | typeof SpeechBalloonShape;
export type ShapeOptions = PencilOptions | LaserPenOptions | EraserOptions | StarOptions | SelectorOptions | ArrowOptions | EllipseOptions | RectangleOptions | StarOptions | PolygonOptions | StraightOptions | TextOptions | SpeechBalloonOptions;
export type ShapeNodes = Group | Path | Polyline | Rect | Ellipse;
export interface CombineConsumeResult {
    type: EPostMessageType;
    rect: IRectType | undefined;
    consumeIndex: number;
}
export interface ShapeStateInfo {
    willClear: boolean;
}
export declare function getShapeTools(toolsType: EToolsKey): typeof PencilShape | typeof LaserPenShape | typeof EraserShape | typeof StarShape | typeof ArrowShape | typeof StraightShape | typeof EllipseShape | typeof PolygonShape | typeof RectangleShape | typeof SpeechBalloonShape | typeof TextShape | typeof SelectorShape | undefined;
export declare function getShapeInstance(param: {
    toolsType: EToolsKey;
    toolsOpt: ShapeOptions;
    vNodes: VNodeManager;
    fullLayer: Group;
    drawLayer?: Group;
}): PencilShape | LaserPenShape | EraserShape | StarShape | ArrowShape | StraightShape | EllipseShape | PolygonShape | RectangleShape | SpeechBalloonShape | TextShape | SelectorShape | undefined;
