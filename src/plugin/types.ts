import { ISerializableStorageData } from "../collector/types";
import type { MemberState as _MemberState} from "white-web-sdk";
import { ECanvasContextType } from "../core/enum";

/** attributes 会被实时同步 */
export interface BezierPencilPluginAttributes {
    [key: string]: ISerializableStorageData;
}

export enum DisplayStateEnum {
    pedding = 0,
    mounted = 1,
    update = 2,
    unmounted = 3,
}

export enum EStrokeType {
    Normal = 0,
    Stroke,
    Dotted,
    LongDotted
}

export type MemberState = _MemberState & {
    /** 是否开启笔锋 */
    strokeType?: EStrokeType;
    /** 是否删除整条线段 */
    isLine?: boolean;
    /** 透明度 */
    strokeOpacity?: number;
    /** 是否开启激光笔 */
    useLaserPen?: boolean;
    /** 激光笔保持时间, second */
    duration?: number;
}

export type SyncOpt = {
    /** 同步间隔 */
    interval?: number;
}

export type CanvasOpt = {
    /** 画布上下文类型 */
    contextType: ECanvasContextType,
}

export enum EInternalEventType {
    /** 显示悬浮栏 */
    ShowFloatBar = 'ShowFloatBar',
    /** 隐藏悬浮栏 */
    HidFloatBar = 'HidFloatBar',
    /** 显示悬浮栏按钮组 */
    ShowFloatBtns = 'ShowFloatBtns',
    /** 显示悬浮栏按钮组 */
    HidFloatBtns = 'HidFloatBtns',
    /** 删除节点 */
    DeleteNode = 'DeleteNode',
    /** 复制节点 */
    CopyNode = 'CopyNode',
    /** 设置节点层级 */
    ZIndexNode = 'ZIndexNode',
    /** 旋转节点 */
    RotateNode = 'RotateNode',
    /** 设置节点颜色 */
    SetColorNode = 'SetColorNode',
    /** 移动节点 */
    TranslateNode = 'TranslateNode',
    /** 拉伸节点 */
    ScaleNode = 'ScaleNode',
}

export type InternalEventValue = {
    id: string;
    value?: boolean | number[]
}

