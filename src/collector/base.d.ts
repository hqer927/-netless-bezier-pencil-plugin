import { BaseCollectorReducerAction, DiffOne, INormalPushMsg, ISerializableStorageData } from "./types";
import { BezierPencilPlugin } from "../plugin";
export declare abstract class BaseCollector {
    abstract uid: string;
    abstract plugin: BezierPencilPlugin;
    abstract storage: ISerializableStorageData;
    protected abstract namespace: string;
    setNamespace(namespace: string): void;
    isLocalId(key: string): boolean;
    getLocalId(key: string): string;
    abstract keyTransformWorkId(key: string): string;
    abstract isOwn(key: string | number): boolean;
    abstract dispatch(action: BaseCollectorReducerAction): void;
    abstract transformToSerializableData(data: INormalPushMsg): string;
    abstract transformToNormalData(str: string): INormalPushMsg;
    abstract addStorageStateListener(callBack: (key: string, value: DiffOne<BaseCollectorReducerAction | undefined>) => void): void;
    abstract removeStorageStateListener(): void;
}
