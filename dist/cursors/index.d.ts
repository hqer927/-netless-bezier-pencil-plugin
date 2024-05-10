import { RoomMember } from "white-web-sdk";
import { EvevtWorkState, IMainMessage } from "../core";
import { EventCollector } from "../collector/eventCollector";
import { BaseSubWorkModuleProps } from "../plugin/types";
import { RoomMemberManager } from "../members";
import type { BaseTeachingAidsManager } from "../plugin/baseTeachingAidsManager";
import EventEmitter2 from "eventemitter2";
export declare enum CursorColloctSource {
    Event = 0,
    Storage = 1
}
export type IServiceWorkItem = {
    freeze?: boolean;
    willHid?: boolean;
    animationIndex: number;
    animationWorkData: Array<number | undefined>;
    workState?: EvevtWorkState;
};
export type CursorInfo = {
    x?: number;
    y?: number;
    roomMember?: RoomMember;
};
export declare abstract class CursorManager {
    /** 内部消息管理器 */
    abstract readonly internalMsgEmitter: EventEmitter2;
    /** 插件管理器 */
    abstract readonly control: BaseTeachingAidsManager;
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
}
export declare class CursorManagerImpl implements CursorManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    eventCollector?: EventCollector;
    readonly roomMember: RoomMemberManager;
    private animationId?;
    private removeTimerId?;
    private asyncEndInfo?;
    private animationPointWorkers;
    private animationDrawWorkers;
    constructor(props: BaseSubWorkModuleProps);
    activeCollector(): void;
    onFocusViewChange(): void;
    private activePointWorkShape;
    private getKey;
    private getUidAndviewId;
    private animationCursor;
    private activeDrawWorkShape;
    private runAnimation;
    sendEvent(point: [number | undefined, number | undefined], viewId: string): void;
    collectServiceCursor(data: IMainMessage): void;
    unabled(): void;
    destroy(): void;
}
