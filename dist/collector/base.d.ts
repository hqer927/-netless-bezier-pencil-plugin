import { BezierPencilPlugin } from "../plugin";
import { IworkId } from "../core";
export declare abstract class BaseCollector<T> {
    abstract uid: string;
    abstract serviceStorage: T;
    abstract plugin?: BezierPencilPlugin;
    abstract storage: T;
    protected abstract namespace: string;
    setNamespace(namespace: string): void;
    getNamespaceData(namespace?: string): T;
    getUidFromKey(key: string): string;
    isLocalId(key: string): boolean;
    getLocalId(key: string): string;
    hasSelector(): boolean;
    isSelector(key: string): boolean;
    abstract transformKey(key: IworkId): string;
    abstract isOwn(key: IworkId): boolean;
    abstract dispatch(action: any): void;
    abstract addStorageStateListener(callBack: (diff: any) => void): void;
    abstract removeStorageStateListener(): void;
}
