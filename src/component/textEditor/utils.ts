import { EToolsKey } from "../../core";
import { ETextEditorType } from "./types";

export function getTextEditorType(toolsKey:EToolsKey) {
    switch (toolsKey) {
        case EToolsKey.Text:
            return ETextEditorType.Text
        case EToolsKey.SpeechBalloon:
        case EToolsKey.Star:
        case EToolsKey.Ellipse:
        case EToolsKey.Rectangle:
        case EToolsKey.Triangle:
        case EToolsKey.Rhombus:
        case EToolsKey.Polygon:
            return ETextEditorType.Shape
    }
}