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
    abstract readonly eventCollector: EventCollector;
    /** 房间成员管理器 */
    abstract readonly roomMember: RoomMemberManager;
    /** 关联 worker工作引擎 */
    // abstract injectWorker(worker: MasterController):void;
    /** 同步事件 */
    abstract sendEvent(point:[number|undefined,number|undefined], viewId:string):void;
    /** 收集服务端cursor事件 */
    abstract collectServiceCursor(data:IMainMessage):void;
    /** 同步服务端失效 cursor事件 */
    abstract unable(): void;
    /** 销毁cursor管理器 */
    abstract destroy(): void;
}
export class CursorManagerImpl implements CursorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    readonly eventCollector: EventCollector;
    readonly roomMember: RoomMemberManager;
    private animationId?: number | undefined;
    private removeTimerId?: number | undefined;
    private animationPointWorkers: Map<string, IServiceWorkItem> = new Map();
    private animationDrawWorkers: Map<string, IServiceWorkItem> = new Map();
    // private worker?: MasterController;
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter } = props;
        this.internalMsgEmitter = internalMsgEmitter;
        this.control = control;
        this.roomMember = control.roomMember;
        this.eventCollector = new EventCollector(control.plugin, this.control.pluginOptions?.syncOpt?.interval);
        this.eventCollector.addStorageStateListener((event:Map<string,Array<BaseEventCollectorReducerAction | undefined>>)=>{
            // console.log('addStorageStateListener- eventCollector', event)
            event.forEach((value, uid)=>{
                if (this.eventCollector.uid !== uid) {
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
                        // console.log('activePointWorkShape', ops)
                        this.activePointWorkShape(uid, ops);
                        this.runAnimation();
                        if (this.removeTimerId) {
                            clearTimeout(this.removeTimerId);
                            this.removeTimerId = undefined;
                        }
                    }
                }  
            })
        })
    }
    private activePointWorkShape(uid:string, ops:Map<string,(number|undefined)[]>) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        for (const [viewId,op] of ops.entries()) {
            const key = this.getKey(uid,viewId);
            const workShape1 = this.animationDrawWorkers.get(key);
            const workShape = this.animationPointWorkers.get(key);
            if (op) {
                if (!workShape) {
                    const workItem = {
                        animationIndex: 0,
                        animationWorkData: op,
                        freeze: workShape1?.workState === EvevtWorkState.Start || workShape1?.workState === EvevtWorkState.Doing || false,
                    } as IServiceWorkItem;
                    this.animationPointWorkers?.set(key, workItem);
                    return;
                }
                workShape.animationWorkData = op;
                workShape.animationIndex = 0
                workShape.freeze = workShape1?.workState === EvevtWorkState.Start || workShape1?.workState === EvevtWorkState.Doing || false
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
        this.eventCollector.dispatch({
            type: EventMessageType.Cursor,
            op: isNumber(point[0]) && isNumber(point[1]) && this.control.viewContainerManager.transformToScenePoint(point as [number,number], viewId) || [undefined, undefined],
            viewId
        })
    }
    collectServiceCursor(data:IMainMessage){
        const {op,uid, workState, viewId}= data;
        if(uid && op && workState && viewId) {
            if (this.removeTimerId) {
                clearTimeout(this.removeTimerId);
                this.removeTimerId = undefined;
            }
            const _op = isNumber(op[0]) && isNumber(op[1]) && this.control.viewContainerManager.transformToOriginPoint(op as [number,number], viewId) || [undefined,undefined];
            this.activeDrawWorkShape(uid, _op , workState, viewId);
            this.runAnimation();
            if (workState === EvevtWorkState.Done && !this.removeTimerId){
                this.removeTimerId = setTimeout(()=>{
                    this.removeTimerId = undefined;
                    this.activeDrawWorkShape(uid, [undefined,undefined], EvevtWorkState.Done, viewId);
                    this.runAnimation();
                }, 3000) as unknown as number;
            }
        }
    }
    unable(){
        this.eventCollector.dispatch({
            type: EventMessageType.Cursor,
            op: [undefined,undefined],
            viewId: this.control.viewContainerManager.focuedViewId
        })
    }
    destroy(){
        this.eventCollector.destroy();
    }
}