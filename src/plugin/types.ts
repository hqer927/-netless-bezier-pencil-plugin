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