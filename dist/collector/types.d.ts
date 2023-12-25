import { EPostMessageType, EToolsKey } from "../core/enum";
import { BaseShapeOptions } from "../core/tools";
import { IUpdateNodeOpt, IworkId } from "../core/types";
import { EmitEventType } from "../plugin/types";
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
        workId?: number;
        key: string;
    };
};
export type IStorageValueItem = Partial<INormalPushMsg>;
export interface INormalPushMsg {
    workId?: IworkId;
    toolsType?: EToolsKey;
    opt?: BaseShapeOptions;
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
}
export interface INormalStorageData {
    [key: string]: IStorageValueItem | undefined;
}
export type BaseCollectorReducerAction = INormalPushMsg & Pick<INormalPushMsg, 'type'>;
export interface ISerializableStorageData {
    [key: string]: BaseCollectorReducerAction | undefined;
}
