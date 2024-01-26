/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { EPostMessageType, EToolsKey } from "../core/enum";
import type { Room } from "white-web-sdk";
import { autorun, toJS } from "white-web-sdk";
import { BaseCollectorReducerAction, Diff, INormalPushMsg, ISerializableStorageData, IStorageValueItem } from "./types";
import { BaseCollector } from "./base";
import { plainObjectKeys, transformToNormalData, transformToSerializableData } from "./utils";
import { BezierPencilPluginAttributes } from "../plugin/types";
import { BezierPencilPlugin } from "../plugin";
import isEqual from "lodash/isEqual";
import { SelectorShape } from "../core/tools";
import cloneDeep from "lodash/cloneDeep";
import { requestAsyncCallBack } from "../core/utils";
import { Storage_Splitter } from "./const";
/**
 * 服务端事件/状态同步收集器
 */ 
export class Collector extends BaseCollector {
    static syncInterval: number = 500;
    public serviceStorage: ISerializableStorageData = {};
    public storage: ISerializableStorageData = {};
    public uid: string;
    public plugin?: BezierPencilPlugin;
    protected namespace: string = '';
    private stateDisposer: (() => void) | undefined;
    private asyncClockState:boolean=false;
    constructor(plugin: BezierPencilPlugin, syncInterval?: number ){
        super();
        Collector.syncInterval = (syncInterval || Collector.syncInterval) * 0.5;
        this.plugin = plugin;
        this.uid = (plugin.displayer as Room).uid;
        const namespace = (plugin.displayer as Room).state.sceneState.scenePath;
        this.setNamespace(namespace)
    }
    public addStorageStateListener(callBack:(diff:Diff<any>)=>void){
        this.stateDisposer = autorun(async () => {
            const storage = toJS(this.plugin?.attributes[this.namespace]) || {};
            const diff = this.diffFun(this.serviceStorage, storage);
            this.serviceStorage = storage;
            for (const [key,value] of Object.entries(diff)) {
                if (value?.newValue === undefined) {
                    delete this.storage[key];
                } else {
                    this.storage[key] = cloneDeep(value?.newValue);
                }
            }
            callBack(diff);
        })
    }
    public removeStorageStateListener():void {
        if (this.stateDisposer) {
            this.stateDisposer();
        }
    }
    private diffFun(_old:any, _new:any) {
        const oldKeys = plainObjectKeys(_old);
        const newKeys = plainObjectKeys(_new);
        const diff:Diff<any> = {};
        for (const key of oldKeys) {
            if (newKeys.includes(key)) {
                if (isEqual(_old[key],_new[key])) {
                    continue;
                }
                diff[key] = {
                    oldValue: _old[key],
                    newValue: _new[key]
                }
                continue;
            }
            diff[key] = {
                oldValue: _old[key],
                newValue: undefined
            }
        }
        for (const key of newKeys) {
            if (!oldKeys.includes(key)) {
                diff[key] = {
                    oldValue: undefined,
                    newValue: _new[key]
                }
            }  
        }
        return diff;
    }
    transformKey(workId:number|string){
        return this.uid + Storage_Splitter + workId
    }
    isOwn(key:string){
        return key.split(Storage_Splitter)[0] === this.uid;
    }
    dispatch(action: BaseCollectorReducerAction): void {
        //console.log('dispatch', action)
        const {type, workId, ops, index, opt, toolsType, removeIds, updateNodeOpt, op, selectIds, isSync} = action
        switch (type) {
            case EPostMessageType.Clear:
                    const state: ISerializableStorageData = {};
                    Object.keys(this.storage).map(key=>{
                        state[key] = undefined;
                    })
                    this.setState(state, {isSync});
                break;
            case EPostMessageType.CreateWork:
                if (workId && toolsType && opt) {
                    const key =  this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    this.updateValue(key.toString(),{
                        type: EPostMessageType.CreateWork,
                        workId,
                        toolsType,
                        opt
                    }, { isSync });                 
                }
                break;
            case EPostMessageType.DrawWork:
                if (workId && typeof index === 'number' && op?.length) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    const _op = (old?.op || []).slice(0, index).concat(op);
                    if (old && _op) {
                        this.updateValue(key.toString(),{
                           ...old,
                            type: EPostMessageType.DrawWork,
                            op: _op,
                            index
                        }, { isSync });                         
                    }
                }
                break;
            case EPostMessageType.FullWork:
                if (workId) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    const _updateNodeOpt = updateNodeOpt || old?.updateNodeOpt;
                    const _toolsType = toolsType || old?.toolsType;
                    const _opt = opt || old?.opt;
                    const _ops = ops || old?.ops;
                    if (_toolsType && _opt  && _ops) {
                        this.updateValue(key.toString(),{
                            type: EPostMessageType.FullWork,
                            updateNodeOpt: _updateNodeOpt,
                            workId: key,
                            toolsType: _toolsType,
                            opt: _opt,
                            ops: _ops
                        }, { isSync });                       
                    }
                }
                break;
            case EPostMessageType.RemoveNode:
                if (removeIds?.length) {
                    // const state1: ISerializableStorageData = {};
                    const _removeIds = removeIds.map(id => {
                        if (this.isLocalId(id + '')) {
                            return this.transformKey(id);
                        }
                        return id;
                    })
                    Object.keys(this.storage).map(key => {
                        if (_removeIds?.includes(key)) {
                            // state1[key] = undefined;
                            this.updateValue(key,undefined, { isSync });
                        }
                    })                    
                }
                break
            case EPostMessageType.UpdateNode:
                if (workId && (updateNodeOpt || ops || opt)) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    if (old) {
                        old.type = type;
                        old.updateNodeOpt = updateNodeOpt;
                        if (ops) {
                            old.ops = ops;
                        }
                        if (updateNodeOpt) {
                            old.updateNodeOpt = updateNodeOpt;
                        }
                        if (opt) {
                            old.opt = opt;
                        }
                        //console.log('dispatch---111',key, old)
                        this.updateValue(key.toString(),old, { isSync });
                    }
                }
                break;
            case EPostMessageType.Select:
                let _selectIds: string[] | undefined;
                if (selectIds?.length) {
                    _selectIds = selectIds.map(id => {
                        if (this.isLocalId(id + '')) {
                            return this.transformKey(id);
                        }
                        return id;
                    })
                }
                const key = this.transformKey(SelectorShape.selectorId);
                const old = this.storage[key];
                const _opt = opt || old?.opt;
                _selectIds && this.checkOtherSelector(key, _selectIds, { isSync });
                this.updateValue(key, _selectIds && {
                    type: EPostMessageType.Select,
                    toolsType: EToolsKey.Selector,
                    opt: _opt,
                    selectIds: _selectIds
                }, { isSync }); 
                break;
            default:
                break;
        } 
    }
    private checkOtherSelector(key:string, selectIds:string[], options?:{
        isSync?: boolean;
        isAfterUpdate?:boolean;
    }){
        for (const k of Object.keys(this.storage)) {
            if (k !== key && this.getLocalId(k) === 'selector') {
                const value = this.storage[k];
                if (value && value.selectIds) {
                    const ids = value.selectIds.filter(id=>!selectIds.includes(id));
                    if (ids.length > 0) {
                        value.selectIds = ids;
                    }
                    // console.log('checkOtherSelector', k, key,  ids, this.serviceStorage[k]?.selectIds)
                    this.updateValue(k, ids.length && value || undefined, options); 
                }
            }
        }
    }
    private setState(state: ISerializableStorageData, options?:{
        isSync?: boolean;
        isAfterUpdate?:boolean;
    }): void {    
        const keys = plainObjectKeys(state);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = state[key];
          if (typeof value !== 'undefined') {
            this.storage[key] = value;
          } else {
            delete this.storage[key];
          }
        }
        this.runSyncService(options);
    }
    updateValue(key:string, value: any, options?:{
        isSync?: boolean;
        isAfterUpdate?:boolean;
    }){
        if (value === undefined) {
            delete this.storage[key];
        } else {
            this.storage[key] = value;
        }
        this.runSyncService(options);
    }

    private runSyncService(options?:{
        isSync?: boolean;
        isAfterUpdate?:boolean;
    } ) {
        // console.log('this.storage', this.storage)
        if (!this.asyncClockState) {
            this.asyncClockState = true;
            setTimeout(()=>{
                if (options?.isSync) {
                    this.asyncClockState = false;
                    this.syncSerivice(options?.isAfterUpdate);
                } else {
                    requestAsyncCallBack(()=>{
                        this.asyncClockState = false;
                        this.syncSerivice(options?.isAfterUpdate);
                    }, Collector.syncInterval);
                }
            }, options?.isSync ? 0 : Collector.syncInterval)
        }
    }
    private syncSerivice(isAfterUpdate:boolean = false) {
        const oldKeys = plainObjectKeys(this.serviceStorage);
        const newKeys = plainObjectKeys(this.storage);
        const willSyncMap:Map<string, BaseCollectorReducerAction | undefined> = new Map();
        let willSyncCount:number = 0
        for (const key of oldKeys) {
            const _old = this.serviceStorage[key];
            const _new = this.storage[key];
            if (newKeys.includes(key)) {
                if (isEqual(_old,_new)) {
                    continue;
                }
                willSyncMap.set(key,_new);
                willSyncCount++;
                continue;
            }
            willSyncMap.set(key,undefined);
        }
        for (const key of newKeys) {
            const _new = this.storage[key];
            if (!oldKeys.includes(key)) {
                willSyncMap.set(key,_new);
                willSyncCount++;
            }
        }
        // willSyncCount > 5 只是一个预估值
        if (willSyncCount > 5 ) {
            this.syncStorage(this.storage, isAfterUpdate);
        } else if (willSyncMap.size > 0 ) {
            for (const [key,value] of willSyncMap.entries()) {
                this.syncUpdata(key, value, isAfterUpdate);
            }
        }
    }
    private syncUpdata(key:string, value: any, isAfterUpdate:boolean = false){
        const length = Object.keys(this.serviceStorage).length;
        if (!length) {
            this.syncStorage(this.storage, isAfterUpdate);
        } else {
            if(!isAfterUpdate){
                if (value === undefined) {
                    delete this.serviceStorage[key];
                } else {
                    this.serviceStorage[key] = value;
                }
            }
            this.plugin?.updateAttributes([this.namespace,key],value);
        }
    }
    private syncStorage(state: ISerializableStorageData, isAfterUpdate:boolean = false){
        if (!isAfterUpdate) {
            this.serviceStorage = cloneDeep(state);
        }
        const attr:BezierPencilPluginAttributes = {};
        attr[this.namespace] = state;
        this.plugin?.setAttributes(attr);
    }
    transformToSerializableData(data: IStorageValueItem): string {
        return transformToSerializableData(data);
    }
    transformToNormalData(str: string): INormalPushMsg {
        return transformToNormalData(str);  
    }
    keyTransformWorkId(key: string): string {
        const list = key.split(Storage_Splitter);
        return list.length === 2 ? list[1] : key
    }
    destroy(){
        this.removeStorageStateListener();
        this.plugin = undefined;
        this.serviceStorage = {};
        this.storage = {};
        this.namespace = '';
    }
}