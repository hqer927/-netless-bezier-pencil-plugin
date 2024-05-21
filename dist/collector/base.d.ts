import type { TeachingAidsPluginLike } from "../plugin/types";
import { IworkId } from "../core";
export declare abstract class BaseCollector<T> {
    plugin: TeachingAidsPluginLike;
    uid: string;
    abstract serviceStorage: T;
    abstract storage: T;
    protected abstract namespace: string;
    constructor(plugin: TeachingAidsPluginLike);
    getNamespaceData(): T;
    getUidFromKey(key: string): string;
    isLocalId(key: string): boolean;
    getLocalId(key: string): string;
    isSelector(key: string): boolean;
    abstract transformKey(key: IworkId): string;
    abstract isOwn(key: IworkId): boolean;
    abstract dispatch(action: any): void;
    abstract addStorageStateListener(callBack: (diff: any) => void): void;
    abstract removeStorageStateListener(): void;
}
