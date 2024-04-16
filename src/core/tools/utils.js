import { EToolsKey } from "../enum";
import { PencilShape } from "./pencil";
import { LaserPenShape } from "./laserPen";
import { EraserShape } from "./eraser";
import { StarShape } from "./star";
import { SelectorShape } from "./selector";
import { ArrowShape } from "./arrow";
import { StraightShape } from "./straight";
import { EllipseShape } from "./ellipse";
import { PolygonShape } from "./polygon";
import { RectangleShape } from "./rectangle";
import { SpeechBalloonShape } from "./speechBalloon";
import { TextShape } from "./text";
export function getShapeTools(toolsType) {
    switch (toolsType) {
        case EToolsKey.Arrow:
            return ArrowShape;
        case EToolsKey.Pencil:
            return PencilShape;
        case EToolsKey.Straight:
            return StraightShape;
        case EToolsKey.Ellipse:
            return EllipseShape;
        case EToolsKey.Polygon:
        case EToolsKey.Triangle:
            return PolygonShape;
        case EToolsKey.Star:
        case EToolsKey.Rhombus:
            return StarShape;
        case EToolsKey.Rectangle:
            return RectangleShape;
        case EToolsKey.SpeechBalloon:
            return SpeechBalloonShape;
        case EToolsKey.Text:
            return TextShape;
        case EToolsKey.LaserPen:
            return LaserPenShape;
        case EToolsKey.Eraser:
            return EraserShape;
        case EToolsKey.Selector:
            return SelectorShape;
    }
}
export function getShapeInstance(param) {
    const { toolsType, ...props } = param;
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
            return new EraserShape(props);
        case EToolsKey.Selector:
            return new SelectorShape(props);
        default:
            return undefined;
    }
}
