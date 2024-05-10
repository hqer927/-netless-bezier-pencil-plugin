import { TextOptions } from "../component/textEditor";
import { EScaleType, EToolsKey } from "../core";
import { SpeechBalloonPlacement } from "../plugin/types";

export type Color = [number, number, number];

export type ShowFloatBarMsgValue = {
    x: number;
    y: number;
    w: number;
    h: number;
    padding?: number;
    selectorColor?: string;
    translate?: [number, number];
    selectIds?: string[];
    canvasWidth?: number;
    canvasHeight?: number;
    strokeColor?: string;
    fillColor?: string;
    thickness?: number;
    lineDash?: number[];
    canTextEdit?: boolean;
    textOpt?: TextOptions,
    scaleType?: EScaleType;
    canRotate?: boolean;
    canLock?: boolean;
    isLocked?: boolean;
    points?: [number,number][];
    shapeOpt?: ShapeOptType;
    toolsTypes?: Array<EToolsKey>;
};
export type SubButProps = {
    open: boolean;
    floatBarRef?: React.RefObject<HTMLDivElement>;
    style?: React.CSSProperties;
    setOpen: (bol:boolean)=> void;
  }
  
export type TextButProps = SubButProps & {
    textOpt?:TextOptions;
    workIds?: string[];
}
export type ShapeOptType = {
    placement?:SpeechBalloonPlacement;
    vertices?: number;
    innerVerticeStep?: number;
    innerRatio?: number;
}
export type ShapeOptButProps = SubButProps & {
    toolsTypes?: Array<EToolsKey>;
    shapeOpt?: ShapeOptType;
    workIds?: string[];
}