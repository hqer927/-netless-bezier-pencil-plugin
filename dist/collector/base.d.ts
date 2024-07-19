import type { AppliancePluginLike } from "../plugin/types";
import { IworkId } from "../core";
import { BaseApplianceManager } from "../plugin/baseApplianceManager";
export declare abstract class BaseCollector<T> {
    plugin: AppliancePluginLike;
    uid: string;
    abstract serviceStorage: T;
    abstract storage: T;
    protected abstract namespace: string;
    readonly control: BaseApplianceManager;
    constructor(control: BaseApplianceManager, plugin: AppliancePluginLike);
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
