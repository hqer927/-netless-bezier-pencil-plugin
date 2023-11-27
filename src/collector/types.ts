/* eslint-disable @typescript-eslint/no-explicit-any */
import { EPostMessageType, EToolsKey } from "../core/enum";
import { BaseShapeOptions } from "../core/tools";
import { IUpdateNodeOpt } from "../core/types";
import { EEventDataKey } from "./enum";

export declare type DiffOne<T> = {
    oldValue: T;
    newValue: T;
};
export declare type Diff<T> = {
    [K in keyof T]?: DiffOne<T[K]>;
};


export type SyncEventData = {
    [key in EEventDataKey]: {
        workId?: number,
        key: string,
    };
};

export type IStorageValueItem = Partial<INormalPushMsg>;

export interface INormalPushMsg {
    workId?: number | string;
    toolstype?: EToolsKey;
    opt?: BaseShapeOptions;
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
    // currentToolsData?: IActiveToolsDataType;
}

export interface INormalStorageData {
    [key: string]: IStorageValueItem | undefined
}

export type BaseCollectorReducerAction = INormalPushMsg & Pick<INormalPushMsg,'type'>;

export interface ISerializableStorageData {
    [key: string]: BaseCollectorReducerAction | undefined;
}




