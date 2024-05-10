import { RoomMember } from "white-web-sdk";
import { EventMessageType, EvevtWorkState, IMainMessage } from "../core";
import { EventCollector } from "../collector/eventCollector";
import { BaseEventCollectorReducerAction, Storage_Splitter } from "../collector";
import isNumber from "lodash/isNumber";
import { BaseSubWorkModuleProps } from "../plugin/types";
import { RoomMemberManager } from "../members";
import type { BaseTeachingAidsManager } from "../plugin/baseTeachingAidsManager";
import EventEmitter2 from "eventemitter2";
// import { MasterController } from "../core/mainEngine";

export enum CursorColloctSource {
    Event,
    Storage
}

export type IServiceWorkItem = {
    freeze?:boolean;
    willHid?:boolean;
    animationIndex: number;
    animationWorkData: Array<number|undefined>;
    workState?:EvevtWorkState;
}
export type CursorInfo = {x?:number, y?:number, roomMember?: RoomMember}

export abstract class CursorManager {
    /** 内部消息管理器 */
    abstract readonly internalMsgEmitter: EventEmitter2;
    /** 插件管理器 */
    abstract readonly control: BaseTeachingAidsManager;
    /** 事件收集器 */
    abstract eventCollector?: EventCollector;
    /** 房间成员管理器 */
    abstract readonly roomMember: RoomMemberManager;
    /** 激活事件收集器 */
    abstract activeCollector():void;
    /** 同步事件 */
    abstract sendEvent(point:[number|undefined,number|undefined], viewId:string):void;
    /** 收集服务端cursor事件 */
    abstract collectServiceCursor(data:IMainMessage):void;
    /** 同步服务端失效 cursor事件 */
    abstract unabled(): void;
    /** 销毁cursor管理器 */
    abstract destroy(): void;
    /** 激活获焦的focusViewId */
    abstract onFocusViewChange():void;
}
export class CursorManagerImpl implements CursorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    eventCollector?: EventCollector;
    readonly roomMember: RoomMemberManager;
    private animationId?: number | undefined;
    private removeTimerId?: number | undefined;
    private asyncEndInfo?: {
        uid:string;
        viewId:string;
    }
    private animationPointWorkers: Map<string, IServiceWorkItem> = new Map();
    private animationDrawWorkers: Map<string, IServiceWorkItem> = new Map();
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter } = props;
        this.internalMsgEmitter = internalMsgEmitter;
        this.control = control;
        this.roomMember = control.roomMember;
    }
    activeCollector() {
        if (this.control.plugin) {
            this.eventCollector = new EventCollector(this.control.plugin, Math.min(this.control.pluginOptions?.syncOpt?.interval || 100, 100) );
            this.eventCollector.addStorageStateListener((event:Map<string,Array<BaseEventCollectorReducerAction | undefined>>)=>{
                event.forEach((value, uid)=>{
                    if (this.eventCollector?.uid !== uid) {
                        const ops:Map<string,(number|undefined)[]> = new Map();
                        value?.forEach(v=> {
                            if (v && v.type === EventMessageType.Cursor && v.op && v.viewId) {
                                const op = [];
                                for (let i = 0; i < v.op.length; i+=2) {
                                    const op1 = v.op[i];
                                    const op2 = v.op[i+1];
                                    if (isNumber(op1) && isNumber(op2)) {
                                        const _op = this.control.viewContainerManager.transformToOriginPoint([op1,op2], v.viewId);
                                        op.push(_op[0],_op[1]);
                                    } else {
                                        op.push(op1,op2);
                                    }
                                }
                                ops.set(v.viewId, op);
                            }
                        })
                        if(ops.size){
                            this.activePointWorkShape(uid, ops);
                            this.runAnimation();
                        }
                    }  
                })
            })
        }

    }
    onFocusViewChange(){
        const focuedViewId = this.control.viewContainerManager.focuedViewId;
        for (const key of this.animationDrawWorkers.keys()) {
            const u = this.getUidAndviewId(key).uid;
            const v = this.getUidAndviewId(key).viewId;
            if (v !== focuedViewId) {
                this.activeDrawWorkShape(u, [undefined, undefined] , EvevtWorkState.Done, v);
            }
        }
        const opsU:Map<string,Map<string,(number|undefined)[]>> = new Map();
        for (const key of this.animationPointWorkers.keys()) {
            const u = this.getUidAndviewId(key).uid;
            const v = this.getUidAndviewId(key).viewId;
            if (v !== focuedViewId) {
                const ops = opsU.get(u) || new Map();
                ops.set(v,[undefined,undefined]);
                opsU.set(u,ops);
            }
        }
        if (opsU.size) {
            for (const [uid,ops] of opsU.entries()) {
                this.activePointWorkShape(uid,ops);
            }
        }
        this.runAnimation();
    }
    private activePointWorkShape(uid:string, ops:Map<string,(number|undefined)[]>) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        for (const [viewId,op] of ops.entries()) {
            const key = this.getKey(uid,viewId);
            let freeze: boolean = false;
            const allViewIds = this.control.viewContainerManager.getAllViews().map(v=>v?.id);
            for (const v of allViewIds) {
                if (v && v !== viewId) {
                    const curKey = this.getKey(uid,v);
                    const drawWorkShape = this.animationDrawWorkers.get(curKey);
                    const isDrawing = drawWorkShape?.workState === EvevtWorkState.Start || drawWorkShape?.workState === EvevtWorkState.Doing || false;
                    if (isDrawing) {
                        freeze = true;
                        break;
                    } else {
                        if (this.removeTimerId) {
                            clearTimeout(this.removeTimerId);
                            this.removeTimerId = undefined;
                        } 
                        if (drawWorkShape) {
                            this.activeDrawWorkShape(uid,[undefined,undefined], EvevtWorkState.Done, v);
                            this.runAnimation();
                        } else {
                            const workShape = this.animationPointWorkers.get(curKey);
                            if (!workShape) {
                                const workItem = {
                                    animationIndex: 0,
                                    animationWorkData: [undefined,undefined],
                                    freeze:false
                                } as IServiceWorkItem;
                                this.animationPointWorkers.set(curKey, workItem);
                            } else {
                                workShape.animationWorkData = [undefined,undefined];
                                workShape.animationIndex = 0;
                                workShape.freeze = false;
                            }  
                        }
                    }
                }             
            }
            const workShape = this.animationPointWorkers.get(key);
            if (op) {
                if (!workShape) {
                    const workItem = {
                        animationIndex: 0,
                        animationWorkData: op,
                        freeze
                    } as IServiceWorkItem;
                    this.animationPointWorkers?.set(key, workItem);
                    return;
                }
                workShape.animationWorkData = op;
                workShape.animationIndex = 0;
                workShape.freeze = freeze;
            }
        }
    }
    private getKey(uid:string,viewId:string){
        return `${uid}${Storage_Splitter}${viewId}`
    }
    private getUidAndviewId(key:string){
        const [uid,viewId] = key.split(Storage_Splitter);
        return {uid,viewId}
    }
    private animationCursor() {
        this.animationId = undefined;
        const cursorInfos:Map<string, CursorInfo>= new Map();
        this.animationPointWorkers.forEach((workShape, key) => {
            const {uid} = this.getUidAndviewId(key);
            const freeze = workShape.freeze;
            if (freeze) {
                return;
            }
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 2;
                }
                const x = workShape.animationWorkData[curIndex] as number;
                const y = workShape.animationWorkData[curIndex+1] as number;
                cursorInfos.set(key,{
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined
                })
                if(workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationPointWorkers.delete(key);
                }
            }
        })
        this.animationDrawWorkers.forEach((workShape, key)=>{
            const {uid} = this.getUidAndviewId(key);
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 2;
                }
                const x = workShape.animationWorkData[curIndex] as number;
                const y = workShape.animationWorkData[curIndex+1] as number;
                cursorInfos.set(key, {
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined
                })
                if(workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationDrawWorkers.delete(key);
                }
            }
        })
        for (const [key,info] of cursorInfos.entries()) {
            const {viewId}= this.getUidAndviewId(key);
            this.control.viewContainerManager.setActiveCursor(viewId, info)
        }
        if (this.animationPointWorkers.size || this.animationDrawWorkers.size) {
            this.runAnimation();
        }
    }
    private activeDrawWorkShape(uid:string, op:Array<number|undefined>, workState:EvevtWorkState, viewId:string) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        const key = this.getKey(uid,viewId);
        if (workState === EvevtWorkState.Start) {
            const workShape1 = this.animationPointWorkers.get(key);
            if(!workShape1){
                const workItem = {
                    animationIndex: 0,
                    animationWorkData: [],
                    freeze: true,
                } as IServiceWorkItem;
                this.animationDrawWorkers?.set(key, workItem);
            } else {
                workShape1.animationWorkData = [];
                workShape1.animationIndex = 0;
                workShape1.freeze = true;
            }
        } else if (workState === EvevtWorkState.Done) {
            const workShape1 = this.animationPointWorkers.get(key);
            if (workShape1) {
                workShape1.freeze = false;
            }
        }
        const workShape = this.animationDrawWorkers.get(key);
        if (op) {
            if (!workShape) {
                const workItem = {
                    animationIndex: 0,
                    animationWorkData: op,
                    workState
                } as IServiceWorkItem;
                this.animationDrawWorkers?.set(key, workItem);
                return;
            }
            workShape.animationWorkData = op;
            workShape.animationIndex = 0;
            workShape.workState = workState;
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationCursor.bind(this));
        }
    }
    sendEvent(point:[number|undefined,number|undefined], viewId:string){
        this.eventCollector?.dispatch({
            type: EventMessageType.Cursor,
            op: isNumber(point[0]) && isNumber(point[1]) && this.control.viewContainerManager.transformToScenePoint(point as [number,number], viewId) || [undefined, undefined],
            viewId
        })
    }
    collectServiceCursor(data:IMainMessage){
        const {op, uid, workState, viewId}= data;
        if(uid && op && workState && viewId) {
            const focuedViewId = this.control.viewContainerManager.focuedViewId;
            if (workState === EvevtWorkState.Done) {
                if (viewId !== focuedViewId) {
                    this.activeDrawWorkShape(uid, [undefined, undefined] , workState, viewId); 
                    this.runAnimation();
                    return;
                }
                if (this.removeTimerId) {
                    clearTimeout(this.removeTimerId);
                    this.removeTimerId = undefined;
                    if(this.asyncEndInfo && this.asyncEndInfo.viewId !== viewId && this.asyncEndInfo.uid === uid){
                        this.activeDrawWorkShape(uid, [undefined,undefined], EvevtWorkState.Done, this.asyncEndInfo.viewId);
                    }
                }
                this.asyncEndInfo = {uid, viewId};
                this.removeTimerId = setTimeout(()=>{
                    this.removeTimerId = undefined;
                    this.activeDrawWorkShape(uid, [undefined,undefined], EvevtWorkState.Done, viewId);
                    this.runAnimation();
                }, 10000) as unknown as number;
            }          
            if (isNumber(op[0]) && isNumber(op[1])) {
                const _op = this.control.viewContainerManager.transformToOriginPoint(op as [number,number], viewId);
                this.activeDrawWorkShape(uid, _op , workState, viewId);
            }
            this.runAnimation();
        }
    }
    unabled(){
        this.eventCollector?.dispatch({
            type: EventMessageType.Cursor,
            op: [undefined,undefined],
            viewId: this.control.viewContainerManager.focuedViewId
        })
    }
    destroy(){
        this.eventCollector?.destroy();
    }
}