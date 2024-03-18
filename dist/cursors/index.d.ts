import { RoomMember } from "white-web-sdk";
import { EvevtWorkState, IMainMessage, MainEngineForWorker } from "../core";
import { BezierPencilPlugin } from "../plugin";
import { EventCollector } from "../collector/eventCollector";
import { RoomMemberManager } from "../members";
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
export declare class CursorManager {
    eventCollector: EventCollector;
    plugin: BezierPencilPlugin;
    roomMember: RoomMemberManager;
    private animationId?;
    private removeTimerId?;
    private animationPointWorkers;
    private animationDrawWorkers;
    private worker?;
    constructor(plugin: BezierPencilPlugin, roomMember: RoomMemberManager, syncInterval?: number);
    injectWorker(worker: MainEngineForWorker): void;
    sendEvent(point: [number | undefined, number | undefined]): void;
    collectServiceCursor(data: IMainMessage): void;
    private activePointWorkShape;
    private activeDrawWorkShape;
    private animationCursor;
    private runAnimation;
    unable(): void;
    destroy(): void;
}
