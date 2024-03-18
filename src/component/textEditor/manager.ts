/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ETextEditorType, TextEditorInfo, TextOptions } from "./types";
import { TeachingAidsManager } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { Collector } from "../../collector";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState, ICameraOpt, IWorkerMessage, MainEngineForWorker } from "../../core";
import { requestAsyncCallBack } from "../../core/utils";
import { ProxyMap } from "../../core/utils/proxy";

export interface TextEditorManager {
    control: TeachingAidsManager;
    collector: Collector;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    /** 通过点计算获焦的文本 */
    computeTextActive(point:[number,number]):void;
    /** 校验是否删除空文本或事失焦 */
    checkEmptyTextBlur():void;
    /** 激活文本编辑组件 */
    active(workId:string):void,
    /** 不激活文本编辑组件 */
    unActive():void,
    /** 创建文本来源于main */
    createTextForMain(params: Partial<TextEditorInfo> & {workId:string, x:number, y:number, opt: TextOptions}):void;
    /** 修改文本来源于main */
    updateTextForMain(params: Partial<TextEditorInfo> & {workId:string, isDel?:boolean}):void; 
    /** 修改文本来源于worker */
    updateTextForWorker(params: Partial<TextEditorInfo> & {workId:string, isDel?:boolean}):void; 
    /** 编辑文本 */
    // editText(params:Partial<TextEditorInfo> & { workId:string }):void; 
    /** 获取组建信息 */
    get(workId:string):TextEditorInfo | undefined;
    /** 删除组件 */
    delete(workId:string):void;
    /** 销毁 */
    destory():void;
    /** 监听服务端数据变动 */
    onServiceDerive(data: IWorkerMessage):void;
    /** 监听camera变化 */
    onCameraChange(cameraOpt: ICameraOpt):void;
}

export class TextEditorManagerImpl implements TextEditorManager {
    control: TeachingAidsManager;
    collector: Collector;
    editors: Map<string, TextEditorInfo>;
    activeId?: string;
    private proxyMap:ProxyMap<string,TextEditorInfo>;
    private activeIdCache?:string;
    constructor(control:TeachingAidsManager, collector:Collector){
        this.control = control;
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
        // this.main = main;
        this.collector = collector;
        TeachingAidsManager.InternalMsgEmitter.on([InternalMsgEmitterType.TextEditor, EmitEventType.SetEditorData],this.bindEventEditor.bind(this));
    }
    get interceptors() {
        return {
            set:(workId:string, info:TextEditorInfo)=>{
                const isLocalId = this.collector.isLocalId(workId);
                const key = isLocalId ? this.collector.transformKey(workId) : workId;
                const curStore = this.collector.storage[key];
                if (!curStore) {
                    if (info.type === ETextEditorType.Text) {
                        if (info.canSync) {
                            this.collector?.dispatch({
                                type: info.opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                workId,
                                toolsType: EToolsKey.Text,
                                opt: info.opt,
                                isSync: true,
                            })
                        }
                        if (info.canWorker) {
                            this.control.worker?.taskBatchData.set(`${EToolsKey.Text},${workId}`, {
                                workId,
                                msgType: info.opt.text && EPostMessageType.FullWork || EPostMessageType.CreateWork,
                                dataType: info.dataType || EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt: info?.opt,
                            });
                            this.control.worker?.runAnimation();
                        }
                    } else {
                        // todo shape
                    }
                } else {
                    if(curStore.toolsType === EToolsKey.Text){
                        if (info.canWorker) {
                            this.control.worker?.taskBatchData.set(`${EToolsKey.Text},${workId}`, {
                                workId,
                                msgType: EPostMessageType.UpdateNode,
                                dataType: info.dataType ||  EDataType.Local,
                                toolsType: EToolsKey.Text,
                                opt: info.opt,
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
                                })       
                            }, MainEngineForWorker.maxLastSyncTime)
                        }
                    } else {
                        // todo shape
                    }
                }
            },
            delete:(workId:string) => {
                const isLocalId = this.collector.isLocalId(workId);
                const key = isLocalId ? this.collector.transformKey(workId) : workId;
                const curStore = this.collector.storage[key];
                if (curStore) {
                    if (curStore.toolsType === EToolsKey.Text) {
                        this.control.worker?.taskBatchData.set(`${EToolsKey.Text},${workId}`, {
                            workId,
                            toolsType: EToolsKey.Text,
                            msgType: EPostMessageType.RemoveNode,
                            dataType: EDataType.Local
                        });
                        this.control.worker?.runAnimation();
                        requestAsyncCallBack(()=>{
                            this.collector?.dispatch({
                                type: EPostMessageType.RemoveNode,
                                removeIds:[workId],
                                toolsType: EToolsKey.Text
                            }) 
                        }, MainEngineForWorker.maxLastSyncTime)
                    } else {
                        // todo shape
                    }
    
                }
            },
            clear(){
                // this.main.clear();
                // return ProxyMap.interceptors.clear();
            }
        }
    }
    computeTextActive(point:[number,number]){
        // this.activeId = this.activeIdCache;
        const op = this.control.worker?.transformToScenePoint(point);
        this.control.worker?.taskBatchData.set(`${EToolsKey.Text},getActive`,{
            msgType: EPostMessageType.GetTextActive,
            dataType: EDataType.Local,
            op, 
        })
        this.control.worker?.runAnimation();
        // if (this.activeIdCache && this.collector.hasSelector()) {
        //     // console.log('onClick-handleClick', activeTextId)
        //     const undoTickerId = Date.now();
        //     UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        //     this.control.worker?.taskBatchData.set(Storage_Selector_key,{
        //         workId: Storage_Selector_key,
        //         msgType: EPostMessageType.RemoveNode,
        //         dataType: EDataType.Local,
        //         undoTickerId
        //     })
        //     this.control.worker?.runAnimation();
        //     const _info = this.editors?.get(this.activeIdCache);
        //     if (_info) {
        //         _info.dataType = EDataType.Local;
        //         _info.canWorker = true;
        //         _info.canSync = true;
        //         _info.isActive = true;
        //     }
        //     this.active(this.activeIdCache);
        // }
    }
    checkEmptyTextBlur(){
        if (this.activeId) {
            const info = this.editors.get(this.activeId);
            const text = info?.opt.text && info?.opt.text.replace(/\s*,/g,'');
            if (text) {
                this.unActive();
            } else {
                this.delete(this.activeId);
            }
        }
    }
    onCameraChange(cameraOpt: ICameraOpt){
        for (const [key,value] of this.editors.entries()) {
            const { boxPoint, boxSize } = value.opt;
            const globalPoint = boxPoint && this.control.worker?.transformToOriginPoint(boxPoint);
            const info:TextEditorInfo = {
                x: globalPoint && globalPoint[0] || 0,
                y: globalPoint && globalPoint[1] || 0,
                w: boxSize && boxSize[0] || 0,
                h: boxSize && boxSize[1] || 0,
                opt: value.opt,
                scale: cameraOpt.scale,
                type: ETextEditorType.Text,
            }
            this.editors.set(key,info);
            // console.log('onCameraChange', cameraOpt.scale);
            TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
        }
    }
    onServiceDerive(data: IWorkerMessage){
        const { workId, opt, msgType } = data;
        if (!workId) {
            return;
        }
        const workIdStr = workId.toString();
        if ( msgType === EPostMessageType.RemoveNode) {
            this.delete(workIdStr);
            return;
        }
        const {boxPoint, boxSize} = opt as TextOptions;
        const globalPoint = boxPoint && this.control.worker?.transformToOriginPoint(boxPoint);
        const info:TextEditorInfo = {
            x: globalPoint && globalPoint[0] || 0,
            y: globalPoint && globalPoint[1] || 0,
            w: boxSize && boxSize[0] || 0,
            h: boxSize && boxSize[1] || 0,
            opt: opt as TextOptions,
            type: ETextEditorType.Text,
            canWorker: true,
            canSync: false,
            dataType: EDataType.Service
        }
        this.editors.set(workIdStr,info);
        TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
    }
    bindEventEditor(activeId?:string): void {
        if (activeId) {
            if (activeId !== this.activeId) {
                this.checkEmptyTextBlur();
            }
            this.active(activeId);
            return;
        }
        this.checkEmptyTextBlur();
    }
    active(workId: string): void {
        const info = this.editors.get(workId);
        if (info) {
            info.isActive = true;
            info.opt.workState = EvevtWorkState.Start;
            this.activeId = workId;
            TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
        }
    }
    unActive(): void {
        const info = this.activeId && this.editors.get(this.activeId);
        if (info) {
            info.opt.workState = EvevtWorkState.Done;
            this.activeIdCache = this.activeId;
            this.activeId = undefined;
            TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
        }
    }
    createTextForMain(params: TextEditorInfo & { workId: string }): void {
        const {workId, isActive, ...info} = params;
        if (isActive) {
            this.checkEmptyTextBlur();
            this.activeId = workId;
        }
        info.opt.workState = EvevtWorkState.Start;
        info.dataType = EDataType.Local;
        info.canWorker = true;
        info.canSync = true;
        this.editors.set(workId, info);
        TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
    }
    updateTextForMain(params: TextEditorInfo & { workId: string, isDel?: boolean }): void {
        // console.log('updateTextForMain', params)
        const {workId, isDel, ...info} = params;
        if (isDel) {
            if(this.activeId === workId){
                this.activeId = undefined;
            }
            this.editors.delete(workId);
        } else {
            // info.opt.workState = EvevtWorkState.Doing;
            info.dataType = EDataType.Local;
            info.canWorker = true;
            info.canSync = true;
            this.editors.set(workId, info);
        }
        TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
    }
    updateTextForWorker(params: TextEditorInfo & { workId: string, isDel?: boolean }): void {
        console.log('updateTextForWorker', params)
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
            info.dataType = undefined;
            info.canWorker = false;
            info.canSync = true;
            this.editors.set(workId, info);
        }
        TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
    }
    get(workId: string): TextEditorInfo | undefined {
        return this.editors.get(workId);
    }
    delete(workId: string): void {
        this.editors.delete(workId);
        if(this.activeId === workId){
            this.activeId = undefined;
        }
        TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
    }
    destory(){
        this.editors.clear();
        this.activeId = undefined;
        TeachingAidsManager.InternalMsgEmitter.emit([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor], this.activeId);
    }
}