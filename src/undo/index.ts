/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import { BaseCollectorReducerAction, Storage_Selector_key } from "../collector";
import {debounce, cloneDeep, isEqual} from "lodash";
import type { Room } from "../plugin/types";
import { BaseSubWorkModuleProps, ApplianceManagerLike } from "../plugin/types";
import { MasterController } from "../core/mainEngine";

export enum EUndoType {
    sdk = 1, 
    plugin = 2,
    both = 3
}
export enum EUndoDataType {
    Draw = 1,
    Delete = 2,
    Update = 3,
}
export interface IUndoStackItem {
    type: EUndoType;
    id?: number;
    sdkStep?: number;
    data?: Set<ILocalStorageDataItem>;
    scenePath:string;
    tickStartStorerCache?:Map<string,BaseCollectorReducerAction|undefined>;
}
export interface ILocalStorageDataItem {
    dataType: EUndoDataType;
    key: string;
    data: BaseCollectorReducerAction | [BaseCollectorReducerAction, BaseCollectorReducerAction];
}
export interface UndoRedoMethodProps extends BaseSubWorkModuleProps {
    viewId:string
}
export class UndoRedoMethod {
    static sdkCallBack: <NAME extends string>(name: NAME, listener: any) => void;
    static MaxStackLength = 20;
    static waitTime = 100;
    emitter: EventEmitter2 = new EventEmitter2();
    undoStack: IUndoStackItem[];
    redoStack: IUndoStackItem[];
    worker: MasterController;
    control:ApplianceManagerLike;
    room: Room;
    private isTicking:boolean;
    private undoTickerId?:number;
    private viewId:string;
    private scenePath?:string;
    private tickStartStorerCache?:Map<string,BaseCollectorReducerAction|undefined>;
    private excludeIds:Set<string> = new Set();
    constructor(props: UndoRedoMethodProps) {
        const {control, internalMsgEmitter, viewId } = props;
        this.control = control;
        this.emitter = internalMsgEmitter;
        this.undoStack = [];
        this.redoStack = [];
        this.room = control.room as Room;
        this.worker = control.worker;
        this.isTicking = false;
        this.viewId = viewId;
    }
    get collector(){
        return this.control.collector;
    }
    addExcludeIds(ids:string[]){
        if (this.isTicking) {
            for (const id of ids) {
                this.excludeIds.add(id);
            }
        }
    }
    undoTickerStart(id:number, scenePath:string) {
        if (this.collector && (this.undoTickerId !== id || this.scenePath !== scenePath)) {
            if (!this.undoTickerId && !this.tickStartStorerCache && !this.scenePath) {
                this.emitter.emit('onCanUndoStepsUpdate', 1);
            }
            if (this.undoTickerId && this.viewId && this.scenePath) {
                this.undoTickerEndSync(this.undoTickerId, this.viewId, this.scenePath);
            }
            this.isTicking = true;
            const localSelectorKey = this.collector.transformKey(Storage_Selector_key)
            this.excludeIds.add(localSelectorKey);
            this.undoTickerId = id;
            this.scenePath = scenePath;
            const storage = this.collector.getStorageData(this.viewId, scenePath) || {};
            this.tickStartStorerCache = new Map(Object.entries(cloneDeep(storage)));
        }
    }
    undoTickerEndSync(id:number, viewId:string, scenePath:string ){
        if (id === this.undoTickerId && scenePath === this.scenePath && viewId === this.viewId && this.tickStartStorerCache) {
            const storage = this.collector?.storage[viewId] && this.collector?.storage[viewId][scenePath] || {};
            const diff = this.diffFun(
                this.tickStartStorerCache, 
                new Map(Object.entries(storage))
            );
            // console.log('undoTickerEndSync', id, viewId, this.viewId, storage, diff)
            if(diff.size) {
                this.undoStack.push({
                    id,
                    type: EUndoType.plugin,
                    data: cloneDeep(diff),
                    scenePath
                });
                if (this.undoStack.length > UndoRedoMethod.MaxStackLength) {
                    this.undoStack.shift();
                }
                this.emitter.emit('onCanUndoStepsUpdate', this.undoStack.length);
            }
            if (this.redoStack.length) {
                this.redoStack.length = 0;
                this.emitter.emit('onCanRedoStepsUpdate', this.redoStack.length);
            }
            this.isTicking = false;
            this.scenePath = undefined;
            this.tickStartStorerCache = undefined;
            this.undoTickerId = undefined;
            this.excludeIds.clear();
        }
    }
    undo(scenePath:string): number {
        if (this.undoTickerId && this.tickStartStorerCache && this.scenePath) {
            this.undoTickerEndSync(this.undoTickerId, this.viewId, this.scenePath);
        }
        let i = this.undoStack.length - 1;
        while (i >= 0) {
            const data = this.undoStack[i];
            if (data.scenePath === scenePath) {
                const data = this.undoStack[i];
                if (data) {
                    this.redoStack.push(data);
                    if (data.type === EUndoType.plugin && data.data) {
                        this.refreshPlugin(data);
                    }
                }
                this.undoStack.splice(i,1);
                break;
            }
            i--;
        }
        // console.log('undoTicker-undo', cloneDeep(this.undoStack), cloneDeep(this.redoStack))
        const undoLength = this.undoStack.filter(s=>s.scenePath === scenePath).length;
        const redoLength = this.redoStack.filter(s=>s.scenePath === scenePath).length;
        this.emitter.emit("onCanUndoStepsUpdate", undoLength);
        this.emitter.emit("onCanRedoStepsUpdate", redoLength);
        return undoLength;
    }
    redo(scenePath:string): number {
        let i = this.redoStack.length - 1;
        while (i >= 0) {
            const data = this.redoStack[i];
            if (data.scenePath === scenePath) {
                const data = this.redoStack[i];
                if (data) {
                    if (!this.undoTickerId && data.tickStartStorerCache) {
                        this.undoTickerId = data.id;
                        this.tickStartStorerCache = data.tickStartStorerCache;
                        this.scenePath = data.scenePath;
                    } else {
                        this.undoStack.push(data);
                    }
                    if (data.type === EUndoType.plugin && data.data) {
                        this.refreshPlugin(data,true);
                    }
                }
                this.redoStack.splice(i,1);
                break;
            }
            i--;
        }
        // console.log('undoTicker-redo', cloneDeep(this.undoStack), cloneDeep(this.redoStack))
        const undoLength = this.undoStack.filter(s=>s.scenePath === scenePath).length;
        const redoLength = this.redoStack.filter(s=>s.scenePath === scenePath).length;
        this.emitter.emit("onCanUndoStepsUpdate", undoLength);
        this.emitter.emit("onCanRedoStepsUpdate", redoLength);
        return redoLength;
    }
    clear(): void {
        this.clearUndo();
        this.clearRedo();
    }
    clearUndo(): void {
        this.undoStack.length = 0;
        this.emitter.emit("onCanUndoStepsUpdate", this.undoStack.length);
    }
    clearRedo(): void {
        this.redoStack.length = 0;
        this.emitter.emit("onCanRedoStepsUpdate", this.redoStack.length);
    }
    canUndo(): boolean {
        if (this.undoStack.length) {
            return true;
        }
        return false;
    }
    canRedo(): boolean {
        if (this.redoStack.length) {
            return true;
        }
        return false;
    }
    onChangeScene = debounce(()=> {
        const scenePath = this.control.viewContainerManager.getCurScenePath(this.viewId)
        if (scenePath) {
            let undoLength = this.undoStack.filter(s=>s.scenePath === scenePath).length;
            const redoLength = this.redoStack.filter(s=>s.scenePath === scenePath).length;
            if (undoLength === 0 && redoLength === 0 && this.tickStartStorerCache && this.scenePath === scenePath) {
                undoLength = 1;
            }
            this.emitter.emit("onCanUndoStepsUpdate", undoLength);
            this.emitter.emit("onCanRedoStepsUpdate", redoLength);
        }
    }, UndoRedoMethod.waitTime)
    onFocusView(): void {
        const scenePath = this.control.viewContainerManager.getCurScenePath(this.viewId);
        if (scenePath) {
            let undoLength = this.undoStack.filter(s=>s.scenePath === scenePath).length;
            const redoLength = this.redoStack.filter(s=>s.scenePath === scenePath).length;
            if ( undoLength === 0 && redoLength === 0 && this.tickStartStorerCache && this.scenePath === scenePath ) {
                undoLength = 1;
            }
            this.emitter.emit("onCanUndoStepsUpdate", undoLength);
            this.emitter.emit("onCanRedoStepsUpdate", redoLength);
        }
    }
    private diffFun(_old:Map<string, BaseCollectorReducerAction|undefined>, _new:Map<string, BaseCollectorReducerAction|undefined>) {
        const diff:Set<ILocalStorageDataItem> = new Set();
        const oldKeys = _old.keys();
        const newKeys = _new.keys();
        for (const key of oldKeys) {
            if (this.excludeIds.has(key)) {
                continue;
            }
            const _oldV = _old.get(key);
            const _newV = _new.get(key);
            if (_oldV && _newV) {
                if (isEqual(_newV,_oldV)) {
                    continue;
                }
                diff.add({
                    dataType: EUndoDataType.Update,
                    key,
                    data: [_oldV, _newV],
                })
                continue;
            }
            _oldV && diff.add({
                dataType: EUndoDataType.Delete,
                key,
                data: _oldV,
            })
        }
        for (const key of newKeys) {
            if (this.excludeIds.has(key)) {
                continue;
            }
            const _newV = _new.get(key);
            if (_newV && !_old.has(key)) {
                diff.add({
                    dataType: EUndoDataType.Draw,
                    key,
                    data: _newV,
                })
            }
        }
        return diff;
    }
    private isDrawEffectiveScene(value:ILocalStorageDataItem, keys:string[]):boolean {
        const {key} = value
        if (keys.includes(key)) {
            return false;
        }
        return true;
    }
    private isDeleteEffectiveScene(value:ILocalStorageDataItem, keys:string[], scenePath:string):boolean {
        const {key} = value
        if (!keys.includes(key)) {
            return false;
        }
        const otherSelectorData = keys
        .filter(k=>this.collector?.getLocalId(k) === Storage_Selector_key && !this.collector?.isOwn(k))
        .map(key=>this.collector?.storage[this.viewId][scenePath][key]);
        for (const data of otherSelectorData) {
            if (data?.selectIds?.includes(key)) {
                return false;
            }
        }
        return true;
    }
    private isOldEffectiveScene(value:ILocalStorageDataItem, keys:string[],scenePath:string):boolean {
        const {key} = value
        if (!keys.includes(key)) {
            return false;
        }
        const otherSelectorData = keys
        .filter(k=>this.collector?.getLocalId(k) === Storage_Selector_key && !this.collector?.isOwn(k))
        .map(key=>this.collector?.storage[this.viewId][scenePath][key]);
        for (const data of otherSelectorData) {
            if (data?.selectIds?.includes(key)) {
                return false;
            }
        }
        return true;
    }
    private isNewEffectiveScene(value:ILocalStorageDataItem, keys:string[]):boolean {
        const {key} = value
        if (!keys.includes(key)) {
            return false;
        }
        return true;
    }
    private refreshPlugin(item: IUndoStackItem, isRedo:boolean = false) {
        let isOk:boolean;
        const {scenePath} = item;
        const targetData = item.data;
        if(!targetData || !this.collector){
            return;
        }
        for (const value of targetData.values()) {
            const {dataType, data, key} = value;
            const _v = this.collector.getStorageData(this.viewId, scenePath);
            const keys = _v && Object.keys(_v) || [];
            switch (dataType) {
                case EUndoDataType.Draw:
                    isOk = isRedo ? this.isDrawEffectiveScene(value, keys) : this.isDeleteEffectiveScene(value, keys, scenePath);
                    if (isOk) {
                        if (isRedo && !Array.isArray(data)) {
                            if (data.updateNodeOpt?.useAnimation) {
                                data.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector?.getLocalId(key) === Storage_Selector_key && this.collector?.isOwn(value.key)) {
                                const selectIds = data.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k=>this.collector?.getLocalId(k) === Storage_Selector_key && !this.collector?.isOwn(k)).map(key=>this.collector?.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (data?.selectIds?.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }  
                                        }
                                    }
                                    if (isfalt) {
                                        data.selectIds = selectIds.filter(id=>!!id);
                                    } 
                                }  
                            }
                            this.collector?.updateValue(value.key, data, {isAfterUpdate: true, viewId:this.viewId, scenePath, isSync:true});
                        } else if(!isRedo && !Array.isArray(value.data)) {
                            this.collector?.updateValue(value.key, undefined, {isAfterUpdate: true, viewId:this.viewId, scenePath, isSync:true});
                        }
                    }   
                    break;
                case EUndoDataType.Delete:
                    isOk = isRedo ? this.isDeleteEffectiveScene(value, keys,scenePath) : this.isDrawEffectiveScene(value, keys);
                    if (isOk) {
                        if (isRedo && !Array.isArray(data)) {
                            this.collector?.updateValue(key, undefined, {isAfterUpdate: true,viewId:this.viewId,scenePath, isSync:true});
                        } else if(!isRedo && !Array.isArray(data)) {
                            if (data.updateNodeOpt?.useAnimation) {
                                data.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector?.getLocalId(value.key) === Storage_Selector_key && this.collector?.isOwn(value.key)) {
                                const selectIds = data.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k=>this.collector?.getLocalId(k) === Storage_Selector_key && !this.collector?.isOwn(k)).map(key=>this.collector?.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (data?.selectIds?.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }  
                                        }
                                    }
                                    if (isfalt) {
                                        data.selectIds = selectIds.filter(id=>!!id);
                                    } 
                                }  
                            }
                            this.collector?.updateValue(value.key, value.data, {isAfterUpdate: true, viewId:this.viewId, scenePath, isSync:true});
                        }
                    }
                    break;
                case EUndoDataType.Update:
                    isOk = isRedo ? this.isNewEffectiveScene(value, keys) : this.isOldEffectiveScene(value, keys, scenePath);
                    if (isOk) {
                        if (isRedo && Array.isArray(data) && data.length === 2) {
                            const newData = data[1];
                            if (newData.updateNodeOpt?.useAnimation) {
                                newData.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector?.getLocalId(value.key) === Storage_Selector_key && this.collector?.isOwn(value.key)) {
                                const selectIds = newData.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k=>this.collector?.getLocalId(k) === Storage_Selector_key && !this.collector?.isOwn(k)).map(key=>this.collector?.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const _data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (_data?.selectIds && _data.selectIds?.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }  
                                        }
                                    }
                                    if (isfalt) {
                                        newData.selectIds = selectIds.filter(id=>!!id);
                                    } 
                                }  
                            }
                            this.collector?.updateValue(key, newData, {isAfterUpdate: true, viewId:this.viewId, scenePath, isSync:true});
                        } else if(!isRedo && Array.isArray(data) && data.length === 2) {
                            const oldData = data[0];
                            if (oldData.updateNodeOpt?.useAnimation) {
                                oldData.updateNodeOpt.useAnimation = false;
                            }
                            if (this.collector?.getLocalId(value.key) === Storage_Selector_key && this.collector?.isOwn(value.key)) {
                                const selectIds = oldData.selectIds;
                                if (selectIds) {
                                    const otherSelectorData = keys.filter(k=>this.collector?.getLocalId(k) === Storage_Selector_key && !this.collector?.isOwn(k)).map(key=>this.collector?.storage[this.viewId][scenePath][key]);
                                    let isfalt = false;
                                    for (const _data of otherSelectorData) {
                                        for (let i = 0; i < selectIds.length; i++) {
                                            if (_data?.selectIds && _data.selectIds.includes(selectIds[i])) {
                                                delete selectIds[i];
                                                isfalt = true;
                                            }  
                                        }
                                    }
                                    if (isfalt) {
                                        oldData.selectIds = selectIds.filter(id=>!!id);
                                    } 
                                }  
                            }   
                            this.collector?.updateValue(value.key, oldData, {isAfterUpdate: true, viewId:this.viewId, scenePath, isSync:true});
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}