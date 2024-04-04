import { EPostMessageType, EToolsKey, EventMessageType } from "../core/enum";
import { ShapeOptions } from "../core/tools";
import { IUpdateNodeOpt, IworkId } from "../core/types";
import { EmitEventType } from "../plugin/types";
import { EEventDataKey } from "./enum";
export declare type DiffOne<T> = {
    oldValue: T;
    newValue: T;
    viewId: string;
    scenePath: string;
};
export declare type Diff<T> = {
    [K in keyof T]?: DiffOne<T[K]>;
};
export type SyncEventData = {
    [key in EEventDataKey]: {
        workId?: number;
        key: string;
    };
};
export type IStorageValueItem = Partial<INormalPushMsg>;
export interface INormalPushMsg {
    workId?: IworkId;
    toolsType?: EToolsKey;
    opt?: ShapeOptions;
    uid?: string;
    taskId?: number;
    namespace?: string;
    op?: number[];
    ops?: string;
    index?: number;
    w?: number;
    h?: number;
    type?: EPostMessageType;
    removeIds?: Array<string>;
    updateNodeOpt?: IUpdateNodeOpt;
    selectIds?: Array<string>;
    emitEventType?: EmitEventType;
    /** 是否垂直同步 */
    isSync?: boolean;
    undoTickerId?: number;
    viewId?: string;
    scenePath?: string;
}
export interface INormalStorageData {
    [key: string]: IStorageValueItem | undefined;
}
export type BaseCollectorReducerAction = INormalPushMsg & Pick<INormalPushMsg, 'type'>;
export interface ISerializableStorageData {
    [key: string]: BaseCollectorReducerAction | undefined;
}
export interface BaseEventCollectorReducerAction {
    type?: EventMessageType;
    uid?: string;
    memberId?: number;
    op?: Array<number | undefined>;
    isHide?: boolean;
    isSync?: boolean;
    viewId?: string;
}
export interface ISerializableEventData {
    [key: string]: Array<BaseEventCollectorReducerAction | undefined> | undefined;
}
export interface ISerializableStorageViewData {
    [key: string]: ISerializableStoragescenePathData;
}
export interface ISerializableStoragescenePathData {
    [key: string]: ISerializableStorageData;
}
