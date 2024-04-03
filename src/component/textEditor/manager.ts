/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ETextEditorType, TextEditorInfo, TextOptions } from "./types";
import { BaseSubWorkModuleProps} from "../../plugin/types";
import { Collector } from "../../collector";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState, ICameraOpt, IWorkerMessage } from "../../core";
import { requestAsyncCallBack } from "../../core/utils";
import { ProxyMap } from "../../core/utils/proxy";
import EventEmitter2 from "eventemitter2";
import { BaseTeachingAidsManager } from "../../plugin/baseTeachingAidsManager";

export interface TextEditorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    readonly collector: Collector;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    /** 本地更新文本编辑器 */
    updateForLocalEditor(activeId?:string, info?:TextEditorInfo):void;
    /** 过滤文本编辑器 */
    filterEditor(viewId: string): Map<string, TextEditorInfo>;
    /** 通过点计算获焦的文本 */
    computeTextActive(point:[number,number], viewId:string):void;
    /** 校验是否删除空文本或事失焦 */
    checkEmptyTextBlur():void;
    /** 激活文本编辑组件 */
    active(workId:string):void,
    /** 不激活文本编辑组件 */
    unActive():void,
    /** 创建文本来源于main */
    createTextForMasterController(params: Partial<TextEditorInfo> & {workId:string, x:number, y:number, opt: TextOptions, viewId:string}):void;
    /** 修改文本来源于main */
    updateTextForMasterController(params: Partial<TextEditorInfo> & {workId:string, isDel?:boolean, viewId:string}):void; 
    /** 修改文本来源于worker */
    updateTextForWorker(params: Partial<TextEditorInfo> & {workId:string, isDel?:boolean, viewId:string}):void; 
    /** 编辑文本 */
    // editText(params:Partial<TextEditorInfo> & { workId:string }):void; 
    /** 获取组建信息 */
    get(workId:string):TextEditorInfo | undefined;
    /** 删除组件 */
    delete(workId:string, canSync?: boolean, canWorker?: boolean):void;
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
    readonly control: BaseTeachingAidsManager;
    readonly collector: Collector;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    private proxyMap:ProxyMap<string,TextEditorInfo>;
    // private activeIdCache?:string;
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
        this.collector = control.collector;
        // this.internalMsgEmitter.on([InternalMsgEmitterType.TextEditor, EmitEventType.SetEditorData],this.bindEventEditor.bind(this));
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
                const isLocalId = this.collector.isLocalId(workId);
                const key = isLocalId ? this.collector.transformKey(workId) : workId;
                const { viewId, scenePath} = info;
                const curStore = this.collector.storage[viewId] && this.collector.storage[viewId][scenePath] && this.collector.storage[viewId][scenePath][key] || undefined;
                // console.log('interceptors - set', info, workId)
                if (!curStore) {
                    if (info.type === ETextEditorType.Text) {
                        if (info.canSync) {
                            this.collector?.dispatch({
                                type: info.opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                workId,
                                toolsType: EToolsKey.Text,
                                opt: info.opt,
                                isSync: true,
                                viewId,
                                scenePath
                            })
                        }
                        if (info.canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: info.opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                dataType: info.dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt: info?.opt,
                                viewId,
                                scenePath
                            });
                            this.control.worker?.runAnimation();
                        }
                    } else {
                        // todo shape
                    }
                } else {
                    if(curStore.toolsType === EToolsKey.Text){
                        if (info.canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                msgType: EPostMessageType.UpdateNode,
                                dataType: info.dataType ||  EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt: info.opt,
                                viewId,
                                scenePath
                            });
                            this.control.worker?.runAnimation();
                        }
                        if (info.canSync) {
                            requestAsyncCallBack(()=>{
                                this.collector?.dispatch({
                                    type: EPostMessageType.UpdateNode,
                                    workId,
                                    toolsType: EToolsKey.Text,
                                    opt: info.opt,
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
                const isLocalId = this.collector.isLocalId(workId);
                const key = isLocalId ? this.collector.transformKey(workId) : workId;
                const info = this.editors.get(workId) as TextEditorInfo;
                const {viewId, scenePath, canSync, canWorker} = info;
                const curStore = this.collector.storage[viewId][scenePath][key];
                if (curStore) {
                    if (curStore.toolsType === EToolsKey.Text) {
                        if (canWorker) {
                            this.control.worker?.taskBatchData.add({
                                workId,
                                toolsType: EToolsKey.Text,
                                msgType: EPostMessageType.RemoveNode,
                                dataType: EDataType.Local,
                                viewId,
                                scenePath
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
                    } else {
                        // todo shape
                    }
    
                }
            },
            clear(){

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
        if (this.activeId) {
            const info = this.editors.get(this.activeId);
            const text = info?.opt.text && info?.opt.text.replace(/\s*,/g,'');
            if (text) {
                this.unActive();
            } else {
                this.delete(this.activeId, true, true);
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
                    // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, viewId);
                }
            }
        }
    }
    onServiceDerive(data: IWorkerMessage){
        const { workId, opt, msgType, viewId, scenePath } = data;
        if (!workId || !viewId || !scenePath) {
            return;
        }
        const workIdStr = workId.toString();
        if ( msgType === EPostMessageType.RemoveNode) {
            this.delete(workIdStr, false, true);
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
            dataType: EDataType.Service,
            scale: view?.cameraOpt?.scale || 1,
            viewId,
            scenePath
        }
        this.editors.set(workIdStr,info);
        this.control.viewContainerManager.setActiveTextEditor(viewId, this.activeId);
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, viewId);
    }
    updateForLocalEditor(activeId:string, info:TextEditorInfo): void {
        this.editors.set(activeId,info);
        // this.effectUpdate();
    }
    // private effectUpdate(activeId?:string): void {
    //     if (activeId) {
    //         if (activeId !== this.activeId) {
    //             this.checkEmptyTextBlur();
    //         }
    //         this.active(activeId);
    //         return;
    //     }
    //     this.checkEmptyTextBlur();
    // }
    active(workId: string): void {
        const info = this.editors.get(workId);
        if (info && info.viewId) {
            info.isActive = true;
            info.opt.workState = EvevtWorkState.Start;
            this.activeId = workId;
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
            // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
        }
    }
    unActive(): void {
        const info = this.activeId && this.editors.get(this.activeId);
        if (info && info.viewId) {
            info.opt.workState = EvevtWorkState.Done;
            // this.activeIdCache = this.activeId;
            this.activeId = undefined;
            this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId);
            // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
        }
    }
    createTextForMasterController(params: TextEditorInfo & { workId: string, viewId: string, scenePath: string }): void {
        const {workId, isActive, ...info} = params;
        if (isActive) {
            this.checkEmptyTextBlur();
            this.activeId = workId;
        }
        // info.opt.workState = EvevtWorkState.Start;
        info.dataType = EDataType.Local;
        info.canWorker = true;
        info.canSync = true;
        this.editors.set(workId, info);
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId)
    }
    updateTextForMasterController(params: TextEditorInfo & { workId: string, viewId: string, scenePath: string, isDel?: boolean }): void {
        // console.log('updateTextForMasterController', params)
        const {workId, isDel, ...info} = params;
        if (isDel) {
            if(this.activeId === workId){
                this.activeId = undefined;
            }
            this.editors.delete(workId);
        } else {
            const _info = this.editors.get(workId) || {};
            info.dataType = EDataType.Local;
            info.canWorker = true;
            info.canSync = true;
            this.editors.set(workId, {..._info, ...info});
        }
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId)
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
    }
    updateTextForWorker(params: TextEditorInfo & { workId: string, viewId: string, scenePath: string, isDel?: boolean }): void {
        // console.log('updateTextForWorker', params)
        const {workId, isDel, isActive, ...info} = params;
        if (isDel) {
            if(this.activeId === workId){
                this.activeId = undefined;
            }
            this.editors.delete(workId);
        } else if (isActive) {
            const _info = this.editors.get(workId);
            if (_info) {
                info.dataType = undefined;
                info.canWorker = false;
                info.canSync = false;
                this.active(workId);
            }
        } else {
            const _info = this.editors.get(workId) || {}
            info.dataType = undefined;
            info.canWorker = false;
            info.canSync = true;
            this.editors.set(workId, {..._info, ...info});
        }
        this.control.viewContainerManager.setActiveTextEditor(info.viewId, this.activeId)
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, info.viewId);
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
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, viewId);
    }
    clear(viewId: string, justLocal?:boolean): void {
        this.editors.forEach((editor,key) => {
            if(editor.viewId === viewId){
                if (justLocal) {
                    // console.log('clear-justLocal', viewId)
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
        // this.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.CommandEditor], this.activeId, Storage_ViewId_ALL);
    }
}