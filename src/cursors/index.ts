import { RoomMember } from "white-web-sdk";
import { EventMessageType, EvevtWorkState, IMainMessage, MainEngineForWorker } from "../core";
import { BezierPencilManager, BezierPencilPlugin } from "../plugin";
import { EventCollector } from "../collector/eventCollector";
import { BaseEventCollectorReducerAction } from "../collector";
import isNumber from "lodash/isNumber";
import { EmitEventType, InternalMsgEmitterType } from "../plugin/types";
import { RoomMemberManager } from "../members";

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

export class CursorManager {
    eventCollector: EventCollector;
    plugin: BezierPencilPlugin;
    roomMember:RoomMemberManager;
    private animationId?: number | undefined;
    private removeTimerId?: number | undefined;
    private animationPointWorkers: Map<string, IServiceWorkItem> = new Map();
    private animationDrawWorkers: Map<string, IServiceWorkItem> = new Map();
    private worker?: MainEngineForWorker;
    
    constructor(plugin: BezierPencilPlugin, roomMember:RoomMemberManager, syncInterval?: number){
        this.plugin = plugin;
        this.roomMember = roomMember;
        this.eventCollector = new EventCollector(plugin, syncInterval);
        this.eventCollector.addStorageStateListener((event:Map<string,Array<BaseEventCollectorReducerAction | undefined>>)=>{
            event.forEach((value, uid)=>{
                if (this.eventCollector.uid !== uid) {
                    const ops:(number|undefined)[] = [];
                    value?.forEach(v=> {
                        if (v && v.type === EventMessageType.Cursor && v.op) {
                            const op = [];
                            for (let i = 0; i < v.op.length; i+=2) {
                                const op1 = v.op[i];
                                const op2 = v.op[i+1];
                                if (isNumber(op1) && isNumber(op2)) {
                                    const _op = this.worker?.transformToOriginPoint([op1,op2]) || [op1,op2]
                                    op.push(..._op);
                                } else {
                                    op.push(op1,op2);
                                }
                            }
                            ops.push(...op);
                        }
                    })
                    if(ops.length){
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
    injectWorker(worker: MainEngineForWorker){
        this.worker = worker;
    }
    sendEvent(point:[number|undefined,number|undefined]){
        this.eventCollector.dispatch({
            type: EventMessageType.Cursor,
            op: isNumber(point[0]) && isNumber(point[1]) && this.worker?.transformToScenePoint(point as [number,number]) || point
        })
    }
    collectServiceCursor(data:IMainMessage){
        const {op,uid, workState}= data;
        if(uid && op && workState) {
            if (this.removeTimerId) {
                clearTimeout(this.removeTimerId);
                this.removeTimerId = undefined;
            }
            const _op = isNumber(op[0]) && isNumber(op[1]) && this.worker?.transformToOriginPoint(op as [number,number]) || op
            this.activeDrawWorkShape(uid, _op , workState);
            this.runAnimation();
            if (workState === EvevtWorkState.Done && !this.removeTimerId){
                this.removeTimerId = setTimeout(()=>{
                    this.removeTimerId = undefined;
                    this.activeDrawWorkShape(uid, [undefined,undefined], EvevtWorkState.Done);
                    this.runAnimation();
                }, 3000) as unknown as number;
            }
        }
    }
    private activePointWorkShape(uid:string, op:Array<number|undefined>) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        const workShape1 = this.animationDrawWorkers.get(uid);
        const workShape = this.animationPointWorkers.get(uid);
        if (!workShape && op) {
            const workItem = {
                animationIndex: 0,
                animationWorkData: op,
                freeze: workShape1?.workState === EvevtWorkState.Start || workShape1?.workState === EvevtWorkState.Doing
            } as IServiceWorkItem;
            this.animationPointWorkers?.set(uid, workItem);
            return;
        }
        if (workShape && op) {
            workShape.animationWorkData = op;
            workShape.animationIndex = 0
            workShape.freeze = workShape1?.workState === EvevtWorkState.Start || workShape1?.workState === EvevtWorkState.Doing
        }
    }
    private activeDrawWorkShape(uid:string, op:Array<number|undefined>, workState:EvevtWorkState) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        if (workState === EvevtWorkState.Start) {
            const workShape1 = this.animationPointWorkers.get(uid);
            if(!workShape1){
                const workItem = {
                    animationIndex: 0,
                    animationWorkData: [],
                    freeze: true
                } as IServiceWorkItem;
                this.animationDrawWorkers?.set(uid, workItem);
            } else {
                workShape1.animationWorkData = [];
                workShape1.animationIndex = 0;
                workShape1.freeze = true;
            }
        } else if (workState === EvevtWorkState.Done) {
            const workShape1 = this.animationPointWorkers.get(uid);
            if (workShape1) {
                workShape1.freeze = false;
            }
        }
        const workShape = this.animationDrawWorkers.get(uid);
        if (!workShape && op) {
            const workItem = {
                animationIndex: 0,
                animationWorkData: op,
                workState
            } as IServiceWorkItem;
            this.animationDrawWorkers?.set(uid, workItem);
            return;
        }
        if (workShape && op) {
            workShape.animationWorkData = op;
            workShape.animationIndex = 0;
            workShape.workState = workState;
        }
    }
    private animationCursor() {
        this.animationId = undefined;
        const cursorInfos:Map<string, CursorInfo>= new Map();
        this.animationPointWorkers.forEach((workShape, uid) => {
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
                const x = workShape.animationWorkData[curIndex];
                const y = workShape.animationWorkData[curIndex+1];
                cursorInfos.set(uid,{
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined
                })
                if(workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationPointWorkers.delete(uid);
                }
            }
        })
        this.animationDrawWorkers.forEach((workShape, uid)=>{
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 2;
                }
                const x = workShape.animationWorkData[curIndex];
                const y = workShape.animationWorkData[curIndex+1];
                cursorInfos.set(uid, {
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined
                })
                if(workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationDrawWorkers.delete(uid);
                }
            }
        })
        // console.log('animationCursor', this.animationPointWorkers.size, this.animationDrawWorkers.size, [...cursorInfos.values()]);
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.Cursor, EmitEventType.ActiveCursor], [...cursorInfos.values()])
        if (this.animationPointWorkers.size || this.animationDrawWorkers.size) {
            this.runAnimation();
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationCursor.bind(this));
        }
    }
    unable(){
        this.eventCollector.dispatch({
            type: EventMessageType.Cursor,
            op: [undefined,undefined]
        })
    }
    destroy(){
        this.eventCollector.destroy();
    }
}