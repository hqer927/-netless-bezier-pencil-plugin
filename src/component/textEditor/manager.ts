/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ETextEditorType, TextEditorInfo, TextOptions } from "./types";
import { BaseSubWorkModuleProps} from "../../plugin/types";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState, ICameraOpt, IWorkerMessage } from "../../core";
import { requestAsyncCallBack } from "../../core/utils";
import { ProxyMap } from "../../core/utils/proxy";
import type EventEmitter2 from "eventemitter2";
import { BaseApplianceManager } from "../../plugin/baseApplianceManager";

export interface TextEditorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseApplianceManager;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    /** 通过view组建中更新文本 */
    updateForViewEdited(activeId?:string, info?:TextEditorInfo):void;
    /** 过滤文本编辑器 */
    filterEditor(viewId: string): Map<string, TextEditorInfo>;
    /** 通过点计算获焦的文本 */
    computeTextActive(point:[number,number], viewId:string):void;
    /** 校验是否删除空文本或事失焦 */
    checkEmptyTextBlur():void;
    /** 激活文本编辑组件 */
    active(workId:string):void,
    /** 不激活文本编辑组件 */
    unActive(blurId:string):void,
    /** 创建文本来源于main */
    createTextForMasterController(params: TextEditorInfo & {workId:string, x:number, y:number, opt: TextOptions, viewId:string}, undoTickerId?:number):void;
    /** 修改文本来源于main */
    updateTextForMasterController(params: Partial<TextEditorInfo> & {workId:string, viewId:string, canWorker: boolean, canSync: boolean}, undoTickerId?:number):void;
    /** 修改文本来并等到新数据 */
    updateTextControllerWithEffectAsync(params: Partial<TextEditorInfo> & {workId:string, viewId:string, canWorker: boolean, canSync: boolean}, undoTickerId?:number):Promise<TextEditorInfo>; 
    /** 修改文本来源于worker */
    updateTextForWorker(params: Partial<TextEditorInfo> & {workId:string, viewId:string, canWorker: boolean, canSync: boolean}, undoTickerId?:number):void; 
    /** 编辑文本 */
    // editText(params:Partial<TextEditorInfo> & { workId:string }):void; 
    /** 获取组建信息 */
    get(workId:string):TextEditorInfo | undefined;
    /** 删除组件 */
    delete(workId:string, canSync?: boolean, canWorker?: boolean):void;
    /** 批量删除组件 */
    deleteBatch(workIds:string[], canSync?: boolean, canWorker?: boolean):void;
    /** 清空指定view下文本 */
    clear(viewId:string, justLocal?:boolean):void;
    /** 销毁 */
    destory():void;
    /** 监听服务端数据变动 */
    onServiceDerive(data: IWorkerMessage):void;
    /** 监听camera变化 */
    onCameraChange(cameraOpt: ICameraOpt, viewId:string):void;
}

export class TextEditorManagerImpl implements TextEditorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseApplianceManager;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    private proxyMap:ProxyMap<string,TextEditorInfo>;
    private taskqueue:Map<string, {
        clocker:number,
        resolve:(value: TextEditorInfo) => void
    }> = new Map();
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter } = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const _editors:Map<string, TextEditorInfo> = new Map();
        this.proxyMap = new ProxyMap<string,TextEditorInfo>();
        const _this:any = this;
        const _set = ProxyMap.interceptors.set;
        ProxyMap.interceptors.set = function(key:string, value:TextEditorInfo){
            _this.interceptors.set(key,value);
            return _set.call(this, key, value, );
        }
        const _delete = ProxyMap.interceptors.delete;
        ProxyMap.interceptors.delete = function(key:string, dataType:EDataType){
            _this.interceptors.delete(key,dataType);
            return _delete.call(this, key);
        }
        this.editors = this.proxyMap.createProxy(_editors);
    }
    get collector(){
        return this.control.collector
    }
    filterEditor(viewId: string): Map<string, TextEditorInfo> {
        const filterMap: Map<string, TextEditorInfo> = new Map();
        this.editors.forEach((editor,key)=>{
            if (editor.viewId === viewId) {
                filterMap.set(key, editor);
            }
        })
        return filterMap;
    }
    get interceptors() {
        return {
            set:(workId:string, info:TextEditorInfo)=>{
                if (!this.collector) {
                    return true;
                }
                const {viewId, scenePath, canSync, canWorker, type, opt, dataType} = info;
                if (!canWorker && !canSync) {
                    return true;
                }
                const isLocalId = this.collector?.isLocalId(workId);
                const key = isLocalId ? this.collector?.transformKey(workId) : workId;
                const curStore = this.collector?.storage[viewId] && this.collector.storage[viewId][scenePath] && this.collector.storage[viewId][scenePath][key] || undefined;
                if (!curStore) {
                    if (type === ETextEditorType.Text) {
                        if (canSync) {
                            this.collector?.dispatch({
                                type: opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                workId,
                                toolsType: EToolsKey.Text,
                                opt,
                                isSync: true,
                                viewId,
                                scenePath
                            })
                        }
                        if (canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                dataType: dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt,
                                viewId,
                                scenePath,
                                willRefresh:true
                            });
                            this.control.worker?.runAnimation();
                        }
                    } else {
                        // todo shape
                    }
                } else {
                    if(curStore.toolsType === EToolsKey.Text){
                        if (canWorker) {
                            this.control.worker.queryTaskBatchData({
                                workId,
                                msgType: EPostMessageType.UpdateNode
                            }).forEach(task=>{
                                this.control.worker?.taskBatchData.delete(task);
                            })
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: EPostMessageType.UpdateNode,
                                dataType: dataType ||  EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt,
                                viewId,
                                scenePath,
                                willRefresh:true
                                // willSyncService: canSync
                            });
                            this.control.worker?.runAnimation();
                        }
                        if (canSync) {
                            requestAsyncCallBack(()=>{
                                this.collector?.dispatch({
                                    type: EPostMessageType.UpdateNode,
                                    workId,
                                    toolsType: EToolsKey.Text,
                                    opt,
                                    viewId,
                                    scenePath
                                })       
                            }, this.control.worker.maxLastSyncTime)
                        }
                    } else {
                        // todo shape
                    }
                }
            },
            delete:(workId:string) => {
                if (!this.collector) {
                    return true;
                }
                const info = this.editors.get(workId) as TextEditorInfo;
                if (!info) {
                    return true;
                }
                const {viewId, scenePath, canSync, canWorker} = info;
                if (!canWorker && !canSync) {
                    return true;
                }
                if (canWorker) {
                    this.control.worker?.taskBatchData.add({
                        workId,
                        toolsType: EToolsKey.Text,
                        msgType: EPostMessageType.RemoveNode,
                        dataType: EDataType.Local,
                        viewId,
                        scenePath,
                        willRefresh:true
                    });
                    this.control.worker?.runAnimation();
                }
                if(canSync){
                    requestAsyncCallBack(()=>{
                        this.collector?.dispatch({
                            type: EPostMessageType.RemoveNode,
                            removeIds:[workId],
                            toolsType: EToolsKey.Text,
                            viewId,
                            scenePath
                        }) 
                    }, this.control.worker.maxLastSyncTime)
                }
            },
            clear(){
                return true;
            }
        }
    }
    computeTextActive(point:[number,number], viewId:string){
        const op = this.control.viewContainerManager?.transformToScenePoint(point, viewId);
        const scenePath = this.control.viewContainerManager?.getCurScenePath(viewId);
        if (viewId && scenePath) {
            this.control.worker?.taskBatchData.add({
                msgType: EPostMessageType.GetTextActive,
                dataType: EDataType.Local,
                op,
                viewId,
                scenePath
            })
            this.control.worker?.runAnimation();
        }
    }
    checkEmptyTextBlur(){
        let blurId = this.activeId;
        for (const [key,value] of this.editors.entries()) {
            if (value.opt.uid && value.opt.uid === this.collector?.uid){
                blurId = key;
                break;
            } 
        }
        if (blurId) {
            const info = this.editors.get(blurId);
            const text = info?.opt.text && info?.opt.text.replace(/\s*,/g,'');
            if (text) {
                this.unActive(blurId);
            } else {
                this.delete(blurId, true, true);
            }
        }
    }
    onCameraChange(cameraOpt: ICameraOpt, viewId: string){
        for (const [key,value] of this.editors.entries()) {
            if (value.viewId === viewId) {
                const { boxPoint, boxSize } = value.opt;
                const globalPoint = boxPoint && this.control.viewContainerManager?.transformToOriginPoint(boxPoint, value.viewId);
                const scenePath = this.control.viewContainerManager?.getCurScenePath(viewId);
                if (scenePath && viewId) {
                    const info:TextEditorInfo = {
                        x: globalPoint && globalPoint[0] || 0,
                        y: globalPoint && globalPoint[1] || 0,
                        w: boxSize && boxSize[0] || 0,
                        h: boxSize && boxSize[1] || 0,
                        opt: value.opt,
                        scale: cameraOpt.scale,
                        type: ETextEditorType.Text,
                        viewId,
                        scenePath,
                        canWorker:false,
                        canSync:false
                    }
                    this.editors.set(key, info);
                    this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
                }
            }
        }
    }
    onServiceDerive(data: IWorkerMessage){
        const { workId, opt, msgType, viewId, scenePath, dataType } = data;
        if (!workId || !viewId || !scenePath) {
            return;
        }
        const workIdStr = workId.toString();
        if ( msgType === EPostMessageType.RemoveNode) {
            this.delete(workIdStr, true, true);
            return;
        }
        const {boxPoint, boxSize} = opt as TextOptions;
        const globalPoint = boxPoint && this.control.viewContainerManager?.transformToOriginPoint(boxPoint,viewId);
        const view = this.control.viewContainerManager.getView(viewId);
        const info:TextEditorInfo = {
            x: globalPoint && globalPoint[0] || 0,
            y: globalPoint && globalPoint[1] || 0,
            w: boxSize && boxSize[0] || 0,
            h: boxSize && boxSize[1] || 0,
            opt: opt as TextOptions,
            type: ETextEditorType.Text,
            canWorker: true,
            canSync: false,
            dataType,
            scale: view?.cameraOpt?.scale || 1,
            viewId,
            scenePath
        }
        this.editors.set(workIdStr,info);
        if (dataType === EDataType.Service && (opt as TextOptions).workState === EvevtWorkState.Done && this.activeId === workIdStr) {
            this.activeId = undefined;
        }
        this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
    }
    updateForViewEdited(activeId:string, info:TextEditorInfo): void {
        this.editors.set(activeId,info);
        const resolve = this.taskqueue.get(activeId)?.resolve;
        if (resolve) {
            resolve(info);
        }
    }
    active(workId: string): void {
        const info = this.editors.get(workId);
        if (info && info.viewId) {
            info.opt.workState = EvevtWorkState.Start;
            info.opt.uid = this.collector?.uid;
            this.activeId = workId;
            info.canWorker = true;
            info.canSync = true;
            this.editors.set(workId, info);
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        }
    }
    unActive(blurId:string): void {
        const info = this.editors.get(blurId);
        if (info && info.viewId) {
            info.opt.workState = EvevtWorkState.Done;
            info.opt.uid = undefined;
            info.canWorker = true;
            info.canSync = true;
            this.editors.set(blurId,info);
            this.activeId = undefined;
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
        }
    }
    createTextForMasterController(params: TextEditorInfo & { workId: string, viewId: string }, undoTickerId?:number): void {
        const {workId, isActive, ...info} = params;
        if (undoTickerId) {
            this.internalMsgEmitter.emit('addUndoTicker', undoTickerId, info.viewId);
        }
        info.opt.uid = this.collector?.uid;
        if (isActive) {
            this.activeId = workId;
        }
        info.dataType = EDataType.Local;
        info.canWorker = true;
        info.canSync = true;
        this.editors.set(workId, info);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId)
    }
    updateTextForMasterController(params: Partial<TextEditorInfo> & { workId: string, viewId: string, canWorker: boolean, canSync: boolean }, undoTickerId?:number): void {
        const {workId, ...info} = params;
        if (undoTickerId) {
            this.internalMsgEmitter.emit('addUndoTicker', undoTickerId, info.viewId);
        }
        const _info = this.editors.get(workId) || {};
        if (info.opt) {
            info.opt.uid = this.collector?.uid;
        }
        info.dataType = EDataType.Local;
        this.editors.set(workId, {..._info, ...info} as TextEditorInfo);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
    }
    async updateTextControllerWithEffectAsync(params: Partial<TextEditorInfo> & { workId: string; viewId: string; canWorker: boolean; canSync: boolean; }, undoTickerId?:number): Promise<TextEditorInfo> {
        const {workId, ...info} = params;
        if (undoTickerId) {
            this.internalMsgEmitter.emit('addUndoTicker', undoTickerId, info.viewId);
        }
        const _info: Partial<TextEditorInfo> = this.editors.get(workId) || {};
        if (info.opt) {
            info.opt.uid = this.collector?.uid;
        }
        info.dataType = EDataType.Local;
        const newInfo = {..._info, ...info} as TextEditorInfo;
        this.editors.set(workId, newInfo);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId)
        if (this.taskqueue.has(workId)) {
            const task = this.taskqueue.get(workId);
            if (task) {
                task.clocker && clearTimeout(task.clocker);
                this.taskqueue.delete(workId);
            }
            return await this.updateTextControllerWithEffectAsync(params);
        }
        // 添加50ms的时钟，如果50ms内没有updateForViewEdited，则返回undefined
        const clocker = setTimeout(()=>{
            const resolve = this.taskqueue.get(workId)?.resolve;
            if (resolve) {
                resolve(newInfo);
            }
        }, 50) as unknown as number;
        const info_1 = await new Promise<TextEditorInfo>((resolve) => {
            this.taskqueue.set(workId, {resolve, clocker});
        });
        const task = this.taskqueue.get(workId);
        if (task) {
            task.clocker && clearTimeout(task.clocker);
            this.taskqueue.delete(workId);
        }
        return info_1;
    }
    updateTextForWorker(params: TextEditorInfo & { workId: string, viewId: string, canWorker: boolean, canSync: boolean }, undoTickerId?:number): void {
        const {workId, isActive, ...info} = params;
        const _info = this.editors.get(workId) || {} as TextEditorInfo;
        const data = {..._info, ...info};
        // if (data.waitWorker) {
        //     delete data.waitWorker;
        // }
        if (isActive) {
            data.canWorker = false;
            data.canSync = false;
            this.editors.set(workId, data);
            this.active(workId);
            return;
        }
        this.editors.set(workId, data);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId)
        if (undoTickerId) {
            this.internalMsgEmitter.emit('addUndoTicker', undoTickerId, info.viewId);
        }
    }
    get(workId: string): TextEditorInfo | undefined {
        return this.editors.get(workId);
    }
    delete(workId: string, canSync?: boolean, canWorker?: boolean): void {
        const info = this.editors.get(workId);
        if(info){
            const viewId = info.viewId;
            info.canSync = canSync;
            info.canWorker = canWorker;
            this.editors.delete(workId);
            if(this.activeId === workId){
                this.activeId = undefined;
            }
            this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId)
        }
    }
    deleteBatch(workIds: string[], canSync?: boolean | undefined, canWorker?: boolean | undefined): void {
        const viewIds:Set<string> = new Set();
        for (const workId of workIds) {
            const info = this.editors.get(workId);
            if(info){
                const viewId = info.viewId;
                info.canSync = canSync;
                info.canWorker = canWorker;
                this.editors.delete(workId);
                if(this.activeId === workId){
                    this.activeId = undefined;
                }
                viewIds.add(viewId);
            }
        }
        for(const viewId of viewIds){
            this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
        }
    }
    clear(viewId: string, justLocal?:boolean): void {
        this.editors.forEach((editor,key) => {
            if(editor.viewId === viewId){
                if (justLocal) {
                    editor.canSync = false;
                }
                editor.canWorker = false;
                this.editors.delete(key);
            }
        })
        this.activeId = undefined;
        this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId)
    }
    destory(){
        this.editors.clear();
        this.activeId = undefined;
    }
}