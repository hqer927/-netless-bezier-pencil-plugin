/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventMessageType, EvevtWorkState, IMainMessage } from "../core";
import { EventCollector } from "../collector/eventCollector";
import { Storage_Splitter } from "../collector";
import { BaseSubWorkModuleProps, Displayer, InternalMsgEmitterType, Room, RoomMember } from "../plugin/types";
import { MemberDiff, RoomMemberManager } from "../members";
import type { BaseApplianceManager } from "../plugin/baseApplianceManager";
import EventEmitter2 from "eventemitter2";
import { isRoom } from "../plugin/external";
import type {Event} from 'white-web-sdk'; 
import { cloneDeep, isEqual, isNumber } from "lodash";
import { DefaultAppliancePluginOptions } from "../plugin/const";

export enum CursorColloctSource {
    Event,
    Draw
}
export type IServiceDrawWorkItem = {
    consumPoint: [number|undefined, number|undefined];
    workState: EvevtWorkState;
    viewId: string;
    timestamp: number;
}
export type IServiceEventWorkItem = {
    consumPoint: [number|undefined, number|undefined];
    viewId: string;
    timestamp: number;
}
export type IMagixEventType = {
    type:EventMessageType;
    op:Pick<IServiceEventWorkItem,'consumPoint'|'viewId'>[];
    uid:string;
}
export type CursorInfo = {x?:number, y?:number, roomMember?: RoomMember}
export type CursorInfoMapItem = CursorInfo & {timestamp:number, type:CursorColloctSource, workState?:EvevtWorkState}

export abstract class CursorManager {
    /** 内部消息管理器 */
    abstract readonly internalMsgEmitter: EventEmitter2;
    /** 插件管理器 */
    abstract readonly control: BaseApplianceManager;
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
    /** 房间成员列表变更 */
    abstract updateRoomMembers(diff: MemberDiff):void;
    /** 清空指定view下的所有cursor */
    abstract clearViewCursor(viewId:string):void;
    /** 同步cursor */
    abstract dispatchMagixEvent():void;
}
export class CursorManagerImpl implements CursorManager {
    readonly expirationTime = DefaultAppliancePluginOptions.cursor.expirationTime;
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseApplianceManager;
    readonly eventName:string = 'applianc-cursor';
    displayer?: Displayer;
    readonly roomMember: RoomMemberManager;
    private animationId?: number | undefined;
    private maxLastSyncTime = DefaultAppliancePluginOptions.syncOpt.interval;
    private willSendEventWorkers: Array<Pick<IServiceEventWorkItem,'consumPoint'|'viewId'>> = [];
    private willConsumeEventWorkers: Map<string, Array<IServiceEventWorkItem>> = new Map();
    private sendEventTimerId?: number | undefined;
    private animationDrawWorkers: Map<string, IServiceDrawWorkItem> = new Map();
    private animationEventWorkers: Map<string, IServiceEventWorkItem> = new Map();
    private cursorInfoMap:Map<string, Map<number, CursorInfoMapItem> | undefined> = new Map();
    private doneRenderCursorInfoMap:Map<string, CursorInfo[]> = new Map();
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter } = props;
        this.internalMsgEmitter = internalMsgEmitter;
        this.control = control;
        this.roomMember = control.roomMember;
        this.maxLastSyncTime = (this.control.pluginOptions?.syncOpt?.interval || this.maxLastSyncTime );
    }
    eventCollector?: EventCollector | undefined;
    activeCollector() {
        if (this.control.plugin) {
            this.displayer = (this.control.room || this.control.play) as Displayer;
            this.displayer.addMagixEventListener(this.eventName, this.mainMagixEventListener.bind(this));
        }

    }
    private mainMagixEventListener(e: Event){
        const {event,payload} = e;
        if (event !== this.eventName) {
            return;
        }
        const {uid, op, type}= payload as IMagixEventType;
        if (this.control.collector?.uid !== uid && type === EventMessageType.Cursor && op?.length) {
            // console.log('collectServiceCursor-mainMagixEventListener', op.map(o=>o.consumPoint))
            const willConsumeData = this.willConsumeEventWorkers.get(uid) || [];
            for (const item of op) {
                const {viewId} = item;
                if (isNumber(item.consumPoint[0]) && isNumber(item.consumPoint[1])) {
                    item.consumPoint = this.control.viewContainerManager.transformToOriginPoint(item.consumPoint as [number,number], viewId);
                }
                willConsumeData.unshift({...item, timestamp: Date.now()});
            }
            this.willConsumeEventWorkers.set(uid, willConsumeData);
            this.runAnimation();
        } 
    }
    onFocusViewChange(){
        this.checkDrawWorks();
        this.runAnimation();
    }
    updateRoomMembers(diff: MemberDiff): void {
        const {offline} = diff;
        for (const uid of this.cursorInfoMap.keys()) {
            if (uid && offline.includes(uid)) {
                this.cursorInfoMap.delete(uid);
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
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationCursor.bind(this));
        }
    }
    private checkDrawWorks(){
        const focuedViewId = this.control.viewContainerManager.focuedViewId;
        for (const [key, value] of this.animationDrawWorkers.entries()) {
            const {viewId,uid} = this.getUidAndviewId(key);
            if (uid !== this.control.collector?.uid) {
                if ( viewId !== focuedViewId && value.workState === EvevtWorkState.Done) {
                    value.consumPoint = [undefined, undefined];
                }
            }
        }
    }

    private animationCursor() {
        this.animationId = undefined;
        const taskNow = Date.now();
        for (const [key, value] of this.animationDrawWorkers.entries()) {
            const {uid, viewId} = this.getUidAndviewId(key);
            const roomMember = this.roomMember.getRoomMember(uid);
            if (!roomMember){
                this.animationDrawWorkers.delete(key);
                continue;
            }
            const {consumPoint, timestamp, workState} = value
            const cursorInfoMap:Map<number, CursorInfoMapItem> = this.cursorInfoMap.get(viewId) || new Map();
            if (consumPoint && isNumber(consumPoint[0]) && isNumber(consumPoint[1]) && timestamp + this.expirationTime > taskNow) {
                cursorInfoMap.set(roomMember.memberId, {
                    x:consumPoint[0],
                    y:consumPoint[1], 
                    roomMember, 
                    timestamp, 
                    type: CursorColloctSource.Draw, 
                    workState
                });
            } else {
                cursorInfoMap.delete(roomMember.memberId);
            }
            if (cursorInfoMap.size) {
                this.cursorInfoMap.set(viewId, cursorInfoMap);
            } else {
                this.cursorInfoMap.delete(viewId);
            }
            this.animationDrawWorkers.delete(key);
        }
        const hasDrawMemberIds:Set<number> = new Set();
        for (const [viewId, map] of this.cursorInfoMap.entries()) {
            if (map) {
                for (const [id, value] of map.entries()) {
                    if (value.type === CursorColloctSource.Draw && value.workState !== EvevtWorkState.Done) {
                        hasDrawMemberIds.add(id);
                    }
                }
            } else {
                this.cursorInfoMap.delete(viewId);
            }
        }
        for (const [uid, value] of this.willConsumeEventWorkers.entries()) {
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember?.memberId && !hasDrawMemberIds.has(roomMember.memberId)) {
                const item = value.pop();
                if (item) {
                    this.animationEventWorkers.set(uid, item);
                } else {
                    this.willConsumeEventWorkers.delete(uid);
                }
            }
        }
        for (const [uid,value] of this.animationEventWorkers.entries()) {
            const roomMember = this.roomMember.getRoomMember(uid);
            if (!roomMember) {
                this.animationEventWorkers.delete(uid);
                continue;
            }
            const {viewId, consumPoint, timestamp} = value;
            const cursorInfoMap = this.cursorInfoMap.get(viewId) || new Map();
            if (consumPoint && isNumber(consumPoint[0]) && isNumber(consumPoint[1]) && timestamp + this.expirationTime > taskNow) {
                cursorInfoMap.set(roomMember.memberId, {x:consumPoint[0],y:consumPoint[1], roomMember, timestamp, type:CursorColloctSource.Event});
            } else {
                cursorInfoMap.delete(roomMember.memberId);
            }
            if (cursorInfoMap.size) {
                this.cursorInfoMap.set(viewId, cursorInfoMap);
            } else {
                this.cursorInfoMap.delete(viewId);
            }
            this.animationEventWorkers.delete(uid);
        }
        for (const viewId of this.doneRenderCursorInfoMap.keys()) {
            if (!this.cursorInfoMap.has(viewId)) {
                this.doneRenderCursorInfoMap.delete(viewId);
                this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], []);
            }
        }
        for (const [viewId, infos] of this.cursorInfoMap.entries()) {
            if (infos?.size) {
                const arr:CursorInfo[] = [];
                for (const [key,info] of infos.entries()) {
                    const {timestamp, ...item} = info;
                    if (timestamp + this.expirationTime > taskNow) {
                        arr.push(item);
                    } else {
                        infos.delete(key);
                        if (infos.size === 0) {
                            this.cursorInfoMap.delete(viewId);
                            this.doneRenderCursorInfoMap.delete(viewId);
                            this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], []);
                        }
                    }
                }
                const renderData = this.doneRenderCursorInfoMap.get(viewId);
                if (!isEqual(renderData, arr)) {
                    this.doneRenderCursorInfoMap.set(viewId, arr);
                    this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], arr);
                }
            } else {
                this.cursorInfoMap.delete(viewId);
                this.doneRenderCursorInfoMap.delete(viewId);
                this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], []);
            }
        }
        if (this.willConsumeEventWorkers.size || this.cursorInfoMap.size) {
            this.runAnimation();
        }
    }
    sendEvent(point:[number|undefined,number|undefined], viewId:string){
        if(this.displayer && isRoom(this.displayer as Room)){
            const consumPoint = isNumber(point[0]) && isNumber(point[1]) && this.control.viewContainerManager.transformToScenePoint(point as [number,number], viewId) || [undefined, undefined];
            this.willSendEventWorkers.push({consumPoint, viewId});
            if (!this.sendEventTimerId) {
                this.sendEventTimerId = setTimeout(()=>{
                    this.dispatchMagixEvent();
                }, this.maxLastSyncTime) as unknown as number;
            }
        }
    }
    dispatchMagixEvent(){
        (this.displayer as Room).dispatchMagixEvent(this.eventName, {
            type: EventMessageType.Cursor,
            op: cloneDeep(this.willSendEventWorkers),
            uid: this.control.collector?.uid,
        })
        this.willSendEventWorkers.length = 0;
        if (this.sendEventTimerId) {
            clearTimeout(this.sendEventTimerId);
            this.sendEventTimerId = undefined;
        }
    }
    collectServiceCursor(data:IMainMessage){
        const {op, uid, workState, viewId}= data;
        if(uid && op && workState && viewId) {
            const roomMember = this.roomMember.getRoomMember(uid);
            if (!roomMember) {
                return;
            }
            if (uid === this.control.collector?.uid) {
                return;
            }
            const key = this.getKey(uid,viewId);
            const focuedViewId = this.control.viewContainerManager.focuedViewId;
            let _op:[number|undefined,number|undefined] = [undefined,undefined];     
            if (isNumber(op[0]) && isNumber(op[1])) {
                const [x,y] = this.control.viewContainerManager.transformToOriginPoint(op as [number,number], viewId);
                _op = [x,y];
            }
            if(workState === EvevtWorkState.Done && focuedViewId !== viewId){
                _op = [undefined,undefined]
            }
            const cursorData = {consumPoint: _op, workState, viewId, timestamp: Date.now()};
            if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Done) {
                const willEventWork = this.willConsumeEventWorkers.get(uid);
                if (workState === EvevtWorkState.Start && willEventWork){
                    this.willConsumeEventWorkers.delete(uid)
                }
                if (willEventWork && workState === EvevtWorkState.Done) {
                    cursorData.timestamp = cursorData.timestamp - this.expirationTime;
                }
            }
            this.animationDrawWorkers.set(key, cursorData); 
            this.runAnimation();
        }
    }
    unabled(){
        if(this.displayer && isRoom(this.displayer as Room)){
            this.willSendEventWorkers.length = 0;
            (this.displayer as Room).dispatchMagixEvent(this.eventName, {
                type: EventMessageType.Cursor,
                op: [{viewId:this.control.viewContainerManager.focuedViewId, consumPoint:[undefined, undefined]}],
                uid: this.control.collector?.uid,
            })
            if (this.sendEventTimerId) {
                clearTimeout(this.sendEventTimerId);
                this.sendEventTimerId = undefined;
            }
        }
    }
    clearViewCursor(viewId:string){
        for (const [key] of this.animationDrawWorkers.entries()) {
            const {uid} = this.getUidAndviewId(key);
            if (uid === this.control.collector?.uid && viewId === viewId) {
                this.animationDrawWorkers.delete(key);
            }
        }
        for (const [uid] of this.willConsumeEventWorkers.entries()) {
            if (uid === this.control.collector?.uid) {
                this.willConsumeEventWorkers.delete(uid);
            }
        }
        for (const [uid] of this.animationEventWorkers.entries()) {
            if (uid === this.control.collector?.uid) {
                this.animationEventWorkers.delete(uid);
            }
        }
        for (const [viewId] of this.cursorInfoMap.entries()) {
            if (viewId === viewId) {
                this.cursorInfoMap.delete(viewId);
                this.doneRenderCursorInfoMap.delete(viewId);
                this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], []);
            }
        }
    }
    stopAnimation(){
        this.animationDrawWorkers.clear();
        this.willConsumeEventWorkers.clear();
        this.cursorInfoMap.clear();
    }
    destroy(){
        this.displayer?.removeMagixEventListener(this.eventName);
        this.stopAnimation();
    }
}