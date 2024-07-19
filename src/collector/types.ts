/* eslint-disable @typescript-eslint/no-explicit-any */
import { EPostMessageType, EToolsKey, EventMessageType } from "../core/enum";
import { ShapeOptions } from "../core/tools";
import { IUpdateNodeOpt, IworkId } from "../core/types";
import { EmitEventType } from "../plugin/types";
import { EEventDataKey } from "./enum";

export declare type DiffOneView<ISerializableStorageViewData> = {
    oldValue?: ISerializableStorageViewData;
    newValue?: ISerializableStorageViewData;
};
export declare type DiffOneScenePath<ISerializableStorageScenePathData> = {
    oldValue?: ISerializableStorageScenePathData;
    newValue?: ISerializableStorageScenePathData;
    viewId: string;
};
export declare type DiffOneData<ISerializableStorageData> = {
    oldValue: ISerializableStorageData;
    newValue: ISerializableStorageData;
    viewId: string;
    scenePath: string;
};
export declare type DiffView<ISerializableStorageViewData> = {
    [K in keyof ISerializableStorageViewData]?: DiffOneView<ISerializableStorageViewData[K]>;
};
export declare type DiffScenePath<ISerializableStorageScenePathData> = {
    [K in keyof ISerializableStorageScenePathData]?: DiffOneScenePath<ISerializableStorageScenePathData[K]>;
};
export declare type DiffData<ISerializableStorageData> = {
    [K in keyof ISerializableStorageData]?: DiffOneData<ISerializableStorageData[K]>;
};
export declare type Diff = {
    diffData?: DiffData<ISerializableStorageData>;
    diffScenePath?: DiffScenePath<ISerializableStorageScenePathData>;
    diffView?: DiffView<ISerializableStorageViewData>;
}
export type SyncEventData = {
    [key in EEventDataKey]: {
        workId?: number,
        key: string,
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
    op?:number[];
    ops?: string;
    index?: number;
    w?: number;
    h?: number;
    type?: EPostMessageType;
    // syncedType?: SyncedType;
    removeIds?:Array<string>;
    updateNodeOpt?: IUpdateNodeOpt;
    selectIds?:Array<string>;
    emitEventType?:EmitEventType;
    /** 是否垂直同步 */
    isSync?:boolean;
    // undoTickerId?:number;
    viewId?: string;
    scenePath?:string;
    isActive?:string;
}

export interface INormalStorageData {
    [key: string]: IStorageValueItem | undefined
}

export type BaseCollectorReducerAction = INormalPushMsg & Pick<INormalPushMsg,'type'>;

export interface ISerializableStorageData {
    [key: string]: BaseCollectorReducerAction | undefined;
}

export interface BaseEventCollectorReducerAction {
    type?: EventMessageType;
    uid?: string;
    memberId?: number;
    op?: Array<number|undefined>;
    isHide?: boolean;
    isSync?: boolean;
    viewId?: string;
}
export interface ISerializableEventData {
    [key: string]: Array<BaseEventCollectorReducerAction | undefined> | undefined;
}

export interface ISerializableStorageViewData {
    [key: string]: ISerializableStorageScenePathData;
}
export interface ISerializableStorageScenePathData {
    [key: string]: ISerializableStorageData;
}


