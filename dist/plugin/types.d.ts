import { ISerializableStorageData } from "../collector/types";
import type { MemberState as _MemberState } from "white-web-sdk";
import { ECanvasContextType } from "../core/enum";
/** attributes 会被实时同步 */
export interface BezierPencilPluginAttributes {
    [key: string]: ISerializableStorageData;
}
export declare enum DisplayStateEnum {
    pedding = 0,
    mounted = 1,
    update = 2,
    unmounted = 3
}
export declare enum EStrokeType {
    Normal = 0,
    Stroke = 1,
    Dotted = 2,
    LongDotted = 3
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
    /** 是否使用新铅笔教具 */
    useNewPencil?: boolean;
};
export type SyncOpt = {
    /** 同步间隔 */
    interval?: number;
};
export type CanvasOpt = {
    /** 画布上下文类型 */
    contextType: ECanvasContextType;
};
export declare enum EmitEventType {
    /** 显示悬浮栏 */
    ShowFloatBar = "ShowFloatBar",
    /** 设置悬浮栏层级 */
    ZIndexFloatBar = "ZIndexFloatBar",
    /** 删除节点 */
    DeleteNode = "DeleteNode",
    /** 复制节点 */
    CopyNode = "CopyNode",
    /** 激活层级设置 */
    ZIndexActive = "ZIndexActive",
    /** 设置节点层级 */
    ZIndexNode = "ZIndexNode",
    /** 旋转节点 */
    RotateNode = "RotateNode",
    /** 设置节点颜色 */
    SetColorNode = "SetColorNode",
    /** 移动节点 */
    TranslateNode = "TranslateNode",
    /** 拉伸节点 */
    ScaleNode = "ScaleNode",
    /** 原始事件 */
    OriginalEvent = "OriginalEvent",
    /** 创建canvas */
    CreateScene = "createScene",
    /** 更新canvas */
    UpdateScene = "UpdateScene"
}
export declare enum InternalMsgEmitterType {
    DisplayState = "DisplayState",
    FloatBar = "FloatBar",
    CanvasSelector = "CanvasSelector",
    MainEngine = "MainEngine"
}
export type InternalEventValue = {
    id: string;
    value?: boolean | number[];
};
