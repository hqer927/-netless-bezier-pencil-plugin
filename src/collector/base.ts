import { toJS } from "white-web-sdk";
import { BaseCollectorReducerAction, DiffOne, INormalPushMsg, ISerializableStorageData } from "./types";
import { BezierPencilPlugin } from "../plugin";

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
        return key.split('@##@').length === 1;
    }
    public getLocalId(key:string): string {
        return key.split('@##@')[1];
    }
    abstract keyTransformWorkId(key:string):string;
    abstract isOwn(key:string|number):boolean;
    abstract dispatch(action:BaseCollectorReducerAction): void;
    abstract transformToSerializableData(data:INormalPushMsg): string;
    abstract transformToNormalData(str: string):INormalPushMsg;
    abstract addStorageStateListener(callBack:(key:string, value:DiffOne<BaseCollectorReducerAction | undefined>)=>void):void;
    abstract removeStorageStateListener():void;
    // abstract addStorageEventListener(eventKey:EEventDataKey,callBack:(payload: BaseCollectorReducerAction)=>void):void;
    // abstract removeStorageEventListener(eventKey:EEventDataKey):void;
}