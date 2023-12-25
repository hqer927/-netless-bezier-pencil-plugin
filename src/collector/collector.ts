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
// import cloneDeep from "lodash/cloneDeep";
/**
 * 服务端事件/状态同步收集器
 */
export class Collector extends BaseCollector {
    public storage: ISerializableStorageData = {};
    public uid: string;
    public plugin: BezierPencilPlugin;
    protected namespace: string = '';
    private stateDisposer: (() => void) | undefined;
    // private syncBatchMap: Map<string, BaseCollectorReducerAction> = new Map();
    constructor(plugin: BezierPencilPlugin){
        super();
        this.plugin = plugin;
        this.uid = (plugin.displayer as Room).uid;
        const namespace = (plugin.displayer as Room).state.sceneState.sceneName;
        this.setNamespace(namespace)
    }
    public addStorageStateListener(callBack:(diff:Diff<any>)=>void){
        this.stateDisposer = autorun(async () => {
            const storage = toJS(this.plugin.attributes[this.namespace]) || {};
            const diff = this.diffFun(this.storage, storage);
            this.storage = storage;
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
            if (oldKeys.includes(key)) {
                if (isEqual(_old[key],_new[key])) {
                    continue;
                }
                continue;
            }
            diff[key] = {
                oldValue: undefined,
                newValue: _new[key]
            }
        }
        return diff;
    }
    transformKey(workId:number|string){
        return this.uid + '++++' + workId
    }
    isOwn(key:string){
        return key.split('++++')[0] === this.uid;
    }
    dispatch(action: BaseCollectorReducerAction): void {
        //console.log('dispatch', action)
        const {type, workId, ops, index, opt, toolsType, removeIds, updateNodeOpt, op, selectIds} = action
        switch (type) {
            case EPostMessageType.Clear:
                    const state: ISerializableStorageData = {};
                    Object.keys(this.storage).map(key=>{
                        state[key] = undefined;
                    })
                    this.setState(state);
                break;
            case EPostMessageType.CreateWork:
                if (workId && toolsType && opt) {
                    const key =  this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    this.updateValue(key.toString(),{
                        type: EPostMessageType.CreateWork,
                        workId,
                        toolsType,
                        opt
                    });                 
                }
                break;    
            case EPostMessageType.UpdateWork:
                if (workId && toolsType && opt) {
                    const key =  this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    const _updateNodeOpt = updateNodeOpt || old?.updateNodeOpt;
                    this.updateValue(key.toString(),{
                        ...old,
                        type: EPostMessageType.UpdateWork,
                        workId,
                        toolsType,
                        opt,
                        updateNodeOpt: _updateNodeOpt
                    });               
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
                        });                         
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
                        });                       
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
                            this.updateValue(key,undefined);
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
                        this.updateValue(key.toString(),old);
                    }
                }
                break;
            case EPostMessageType.Select:
                let _selectIds: string[] | undefined;
                if (selectIds?.length && opt) {
                    _selectIds = selectIds.map(id => {
                        if (this.isLocalId(id + '')) {
                            return this.transformKey(id);
                        }
                        return id;
                    })
                }
                const key = this.transformKey(SelectorShape.selectorId);
                this.updateValue(key, _selectIds && {
                    type: EPostMessageType.Select,
                    toolsType: EToolsKey.Selector,
                    selectIds: _selectIds,
                    opt
                }); 
                break;
            default:
                break;
        } 
    }
    private setState(state: ISerializableStorageData): void {    
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
        const attr:BezierPencilPluginAttributes = {};
        attr[this.namespace] = this.storage;
        this.plugin.setAttributes(attr);
    }
    private updateValue(key:string, value: any){
        const length = Object.keys(this.storage).length;
        if (value === undefined) {
            delete this.storage[key];
        } else {
            this.storage[key] = value;
        }
        if (!length) {
            this.setState(this.storage);
        } else {
            this.plugin.updateAttributes([this.namespace,key],value);
        }
    }
    transformToSerializableData(data: IStorageValueItem): string {
        return transformToSerializableData(data);
    }
    transformToNormalData(str: string): INormalPushMsg {
        return transformToNormalData(str);  
    }
    keyTransformWorkId(key: string): string {
        const list = key.split('++++');
        return list.length === 2 ? list[1] : key
    }
    destroy(){
        // TODO
    }
}