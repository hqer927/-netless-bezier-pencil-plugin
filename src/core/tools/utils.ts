import { EPostMessageType, EToolsKey } from "../enum";
import { IRectType } from "../types";
import type { Ellipse, Group, Label, Path, Polyline, Rect, Sprite } from "spritejs";
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
import { VNodeManager } from "../vNodeManager";
import { SpeechBalloonOptions, SpeechBalloonShape } from "./speechBalloon";
import { TextShape } from "./text";
import { TextOptions } from "../../component/textEditor";
import { ImageOptions, ImageShape } from "./image";
import type { ServiceWorkForFullWorker } from "../worker/fullWorkerService";
import type { SubServiceThread } from "../mainThread/subServiceThread";
import { BaseShapeTool } from "./base";

export type ShapeTools = typeof PencilShape | typeof LaserPenShape | typeof EraserShape | typeof StarShape | typeof SelectorShape | typeof ArrowShape | typeof EllipseShape | typeof RectangleShape | typeof StarShape | typeof PolygonShape | typeof TextShape | typeof SpeechBalloonShape | typeof ImageShape;
export type ShapeToolsClass = BaseShapeTool |  PencilShape | LaserPenShape | EraserShape | StarShape | SelectorShape | ArrowShape | EllipseShape | RectangleShape | StarShape | PolygonShape | TextShape | SpeechBalloonShape | ImageShape;
export type ShapeOptions = PencilOptions | LaserPenOptions | EraserOptions | StarOptions | SelectorOptions | ArrowOptions | EllipseOptions | RectangleOptions | StarOptions | PolygonOptions | StraightOptions | TextOptions | SpeechBalloonOptions | ImageOptions;
export type ShapeNodes =  Group | Path | Polyline | Rect | Ellipse | Sprite | Label;
export type ServiceThreadSubWork = SubServiceThread | ServiceWorkForFullWorker;

export interface CombineConsumeResult {
    type: EPostMessageType;
    rect: IRectType | undefined;
    consumeIndex: number;
}
export interface ShapeStateInfo {
    willClear: boolean;
}

export function getShapeTools(toolsType:EToolsKey) {
    switch (toolsType) {
        case EToolsKey.Arrow:
            return ArrowShape
        case EToolsKey.Pencil:
            return PencilShape
        case EToolsKey.Straight:
            return StraightShape
        case EToolsKey.Ellipse:
            return EllipseShape;
        case EToolsKey.Polygon:
        case EToolsKey.Triangle:   
            return PolygonShape;
        case EToolsKey.Star:
        case EToolsKey.Rhombus:
            return StarShape
        case EToolsKey.Rectangle:
            return RectangleShape
        case EToolsKey.SpeechBalloon:
            return SpeechBalloonShape
        case EToolsKey.Text:
            return TextShape
        case EToolsKey.LaserPen:
            return LaserPenShape
        case EToolsKey.Eraser:
            return EraserShape
        case EToolsKey.Selector:
            return SelectorShape
        case EToolsKey.Image:
            return ImageShape
    }
}

export function getShapeInstance(
    param:{
        workId: string,
        toolsType: EToolsKey,
        toolsOpt: ShapeOptions,
        vNodes?: VNodeManager,
        fullLayer: Group,
        drawLayer?: Group
    }, 
    serviceWork?: ServiceThreadSubWork
) {
    const {toolsType, ...props} = param;
    switch (toolsType) {
        case EToolsKey.Arrow:
            return new ArrowShape(props);
        case EToolsKey.Pencil:
            return new PencilShape(props);
        case EToolsKey.Straight:
            return new StraightShape(props);
        case EToolsKey.Ellipse:
            return new EllipseShape(props);
        case EToolsKey.Polygon:
        case EToolsKey.Triangle:   
            return new PolygonShape(props);
        case EToolsKey.Star:
        case EToolsKey.Rhombus:
            return new StarShape(props);
        case EToolsKey.Rectangle:
            return new RectangleShape(props);
        case EToolsKey.SpeechBalloon:
            return new SpeechBalloonShape(props);
        case EToolsKey.Text:
            return new TextShape(props);
        case EToolsKey.LaserPen:
            return new LaserPenShape(props);
        case EToolsKey.Eraser:
            return new EraserShape(props, serviceWork)
        case EToolsKey.Selector:
            if (props.vNodes) {
                return new SelectorShape({...props,vNodes:props.vNodes, drawLayer:props.fullLayer});
            }
            return undefined;
        case EToolsKey.Image:
            return new ImageShape(props);
        default:
            return undefined;
    }
}

export function findShapeBody(nodes:ShapeNodes[]):ShapeNodes[] {
    const bodys:ShapeNodes[] = [];
    const bodyTagNames = ['PATH', 'SPRITE', 'POLYLINE', 'RECT', 'ELLIPSE', 'LABEL']
    for (const node of nodes) {
        if (node.tagName === 'GROUP' && (node as Group).children.length) {
            return findShapeBody((node as Group).children);
        }
        if (node.tagName && bodyTagNames.includes(node.tagName)) {
            bodys.push(node);
        }
    }
    return bodys;
}