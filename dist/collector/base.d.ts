import { BaseCollectorReducerAction, Diff, INormalPushMsg, ISerializableStorageData } from "./types";
import { BezierPencilPlugin } from "../plugin";
import { IworkId } from "../core";
export declare const Storage_Splitter = "++";
export declare abstract class BaseCollector {
    abstract uid: string;
    abstract serviceStorage: ISerializableStorageData;
    abstract plugin: BezierPencilPlugin;
    abstract storage: ISerializableStorageData;
    protected abstract namespace: string;
    setNamespace(namespace: string): void;
    isLocalId(key: string): boolean;
    getLocalId(key: string): string;
    abstract transformKey(key: IworkId): string;
    abstract keyTransformWorkId(key: string): string;
    abstract isOwn(key: IworkId): boolean;
    abstract dispatch(action: BaseCollectorReducerAction): void;
    abstract transformToSerializableData(data: INormalPushMsg): string;
    abstract transformToNormalData(str: string): INormalPushMsg;
    abstract addStorageStateListener(callBack: (diff: Diff<any>) => void): void;
    abstract removeStorageStateListener(): void;
}
