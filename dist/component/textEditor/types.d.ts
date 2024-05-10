import { EDataType, EvevtWorkState } from "../../core";
import { BaseShapeOptions } from "../../core/tools";
export declare enum ETextEditorType {
    Text = 1,
    Shape = 2
}
export type VerticalAlignType = "top" | "middle" | "bottom";
export type TextAlignType = "left" | "center" | "right";
export type FontWeightType = 'bold' | 'normal';
export type FontStyleType = 'italic' | 'normal';
export interface TextOptions extends BaseShapeOptions {
    fontColor: string;
    fontSize: number;
    text: string;
    textAlign: TextAlignType;
    verticalAlign: VerticalAlignType;
    lineHeight?: number;
    fontFamily?: string;
    bold?: FontWeightType;
    italic?: FontStyleType;
    fontBgColor?: string;
    /** 是否显示下划线 */
    underline?: boolean;
    /** 是否显示删除线 */
    lineThrough?: boolean;
    boxPoint?: [number, number];
    boxSize?: [number, number];
    /** 状态 */
    workState?: EvevtWorkState;
    /** 正在编辑的用户 */
    uid?: string;
}
export type TextEditorInfo = {
    x: number;
    y: number;
    opt: TextOptions;
    type: ETextEditorType;
    viewId: string;
    scenePath: string;
    w?: number;
    h?: number;
    scale?: number;
    isSelect?: boolean;
    isActive?: boolean;
    canWorker?: boolean;
    canSync?: boolean;
    dataType?: EDataType;
    translate?: [number, number];
    justLocal?: boolean;
};
