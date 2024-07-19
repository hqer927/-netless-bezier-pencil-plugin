import { EventMessageType, EvevtWorkState, IMainMessage } from "../core";
import { EventCollector } from "../collector/eventCollector";
import { BaseSubWorkModuleProps, Displayer, RoomMember } from "../plugin/types";
import { MemberDiff, RoomMemberManager } from "../members";
import type { BaseApplianceManager } from "../plugin/baseApplianceManager";
import EventEmitter2 from "eventemitter2";
export declare enum CursorColloctSource {
    Event = 0,
    Draw = 1
}
export type IServiceDrawWorkItem = {
    consumPoint: [number | undefined, number | undefined];
    workState: EvevtWorkState;
    viewId: string;
    timestamp: number;
};
export type IServiceEventWorkItem = {
    consumPoint: [number | undefined, number | undefined];
    viewId: string;
    timestamp: number;
};
export type IMagixEventType = {
    type: EventMessageType;
    op: Pick<IServiceEventWorkItem, 'consumPoint' | 'viewId'>[];
    uid: string;
};
export type CursorInfo = {
    x?: number;
    y?: number;
    roomMember?: RoomMember;
};
export type CursorInfoMapItem = CursorInfo & {
    timestamp: number;
    type: CursorColloctSource;
    workState?: EvevtWorkState;
};
export declare abstract class CursorManager {
    /** 内部消息管理器 */
    abstract readonly internalMsgEmitter: EventEmitter2;
    /** 插件管理器 */
    abstract readonly control: BaseApplianceManager;
    /** 事件收集器 */
    abstract eventCollector?: EventCollector;
    /** 房间成员管理器 */
    abstract readonly roomMember: RoomMemberManager;
    /** 激活事件收集器 */
    abstract activeCollector(): void;
    /** 同步事件 */
    abstract sendEvent(point: [number | undefined, number | undefined], viewId: string): void;
    /** 收集服务端cursor事件 */
    abstract collectServiceCursor(data: IMainMessage): void;
    /** 同步服务端失效 cursor事件 */
    abstract unabled(): void;
    /** 销毁cursor管理器 */
    abstract destroy(): void;
    /** 激活获焦的focusViewId */
    abstract onFocusViewChange(): void;
    /** 房间成员列表变更 */
    abstract updateRoomMembers(diff: MemberDiff): void;
    /** 清空指定view下的所有cursor */
    abstract clearViewCursor(viewId: string): void;
    /** 同步cursor */
    abstract dispatchMagixEvent(): void;
}
export declare class CursorManagerImpl implements CursorManager {
    readonly expirationTime: number;
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseApplianceManager;
    readonly eventName: string;
    displayer?: Displayer;
    readonly roomMember: RoomMemberManager;
    private animationId?;
    private maxLastSyncTime;
    private willSendEventWorkers;
    private willConsumeEventWorkers;
    private sendEventTimerId?;
    private animationDrawWorkers;
    private animationEventWorkers;
    private cursorInfoMap;
    private doneRenderCursorInfoMap;
    constructor(props: BaseSubWorkModuleProps);
    eventCollector?: EventCollector | undefined;
    activeCollector(): void;
    private mainMagixEventListener;
    onFocusViewChange(): void;
    updateRoomMembers(diff: MemberDiff): void;
    private getKey;
    private getUidAndviewId;
    private runAnimation;
    private checkDrawWorks;
    private animationCursor;
    sendEvent(point: [number | undefined, number | undefined], viewId: string): void;
    dispatchMagixEvent(): void;
    collectServiceCursor(data: IMainMessage): void;
    unabled(): void;
    clearViewCursor(viewId: string): void;
    stopAnimation(): void;
    destroy(): void;
}
