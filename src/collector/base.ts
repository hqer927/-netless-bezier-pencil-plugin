/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
import { BezierPencilPlugin } from "../plugin";
import { IworkId } from "../core";
import cloneDeep from "lodash/cloneDeep";
import { Storage_Selector_key, Storage_Splitter } from "./const";

export abstract class BaseCollector<T> {
    public abstract uid:string;
    public abstract serviceStorage: T;
    public abstract plugin?: BezierPencilPlugin;
    public abstract storage: T;
    protected abstract namespace: string;
    public setNamespace(namespace: string){
        this.namespace = namespace;
        this.serviceStorage = this.getNamespaceData(namespace);
        this.storage = cloneDeep(this.serviceStorage);
    }
    public getNamespaceData(namespace?: string): T {
        return toJS(this.plugin?.attributes[namespace || this.namespace]) || {};
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
    public hasSelector(){
        return !!(this.storage && Object.keys(this.storage).find(key=>this.isOwn(key) && this.getLocalId(key) === Storage_Selector_key));
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