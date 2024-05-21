/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Room, TeachingAidsPluginLike } from "../plugin/types";
import { toJS } from "../plugin/external";
import { IworkId } from "../core";
import { Storage_Selector_key, Storage_Splitter } from "./const";

export abstract class BaseCollector<T> {
    public plugin: TeachingAidsPluginLike;
    public uid:string;
    public abstract serviceStorage: T;
    public abstract storage: T;
    protected abstract namespace: string;
    constructor(plugin: TeachingAidsPluginLike){
        this.plugin = plugin;
        this.uid = (plugin.displayer as Room).uid;
    }
    public getNamespaceData(): T {
         return (toJS(this.plugin?.attributes[this.namespace]) || {}) as T;
    }
    public getUidFromKey(key:string): string {
        return key.split(Storage_Splitter).length === 2 && key.split(Storage_Splitter)[0] || this.uid;
    }
    public isLocalId(key:string): boolean {
        return key.split(Storage_Splitter).length === 1;
    }
    public getLocalId(key:string): string {
        return key.split(Storage_Splitter)[1];
    }
    public isSelector(key:string): boolean {
        return this.getLocalId(key) === Storage_Selector_key;
    }
    abstract transformKey(key: IworkId): string;
    abstract isOwn(key:IworkId):boolean;
    abstract dispatch(action: any): void;
    abstract addStorageStateListener(callBack:(diff:any)=>void):void;
    abstract removeStorageStateListener():void;
}