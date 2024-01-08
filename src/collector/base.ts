/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from "white-web-sdk";
import { BaseCollectorReducerAction, Diff, INormalPushMsg, ISerializableStorageData } from "./types";
import { BezierPencilPlugin } from "../plugin";
import { IworkId } from "../core";

export const Storage_Splitter = '++';

export abstract class BaseCollector {
    public abstract uid:string;
    public abstract plugin: BezierPencilPlugin;
    public abstract storage: ISerializableStorageData;
    protected abstract namespace: string;
    public setNamespace(namespace: string){
        this.namespace = namespace;
        this.storage = toJS(this.plugin.attributes[namespace]) || {};
    }
    public isLocalId(key:string): boolean {
        return key.split(Storage_Splitter).length === 1;
    }
    public getLocalId(key:string): string {
        return key.split(Storage_Splitter)[1];
    }
    abstract transformKey(key: IworkId): string;
    abstract keyTransformWorkId(key:string):string;
    abstract isOwn(key:IworkId):boolean;
    abstract dispatch(action:BaseCollectorReducerAction): void;
    abstract transformToSerializableData(data:INormalPushMsg): string;
    abstract transformToNormalData(str: string):INormalPushMsg;
    abstract addStorageStateListener(callBack:(diff:Diff<any>)=>void):void;
    abstract removeStorageStateListener():void;
    // abstract addStorageEventListener(eventKey:EEventDataKey,callBack:(payload: BaseCollectorReducerAction)=>void):void;
    // abstract removeStorageEventListener(eventKey:EEventDataKey):void;
}