import { TextOptions } from "../component/textEditor";
import { EScaleType } from "../core";

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
};
export type SubButProps = {
    open: boolean;
    setOpen: (bol:boolean)=> void;
  }
  
export type TextButProps = SubButProps & {
    textOpt?:TextOptions;
    workIds?: string[];
}