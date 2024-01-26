/// <reference types="lodash" />
import EventEmitter2 from "eventemitter2";
import { MainEngineForWorker } from "../core";
import { BaseCollectorReducerAction, Collector } from "../collector";
import type { Room } from "white-web-sdk";
export declare enum EUndoType {
    sdk = 1,
    plugin = 2,
    both = 3
}
export declare enum EUndoDataType {
    Draw = 1,
    Delete = 2,
    Update = 3
}
export interface IUndoStackItem {
    type: EUndoType;
    id?: number;
    sdkStep?: number;
    data?: Set<ILocalStorageDataItem>;
}
export interface ILocalStorageDataItem {
    dataType: EUndoDataType;
    key: string;
    data: BaseCollectorReducerAction | [BaseCollectorReducerAction, BaseCollectorReducerAction];
}
export declare class UndoRedoMethod {
    static sdkCallBack: <NAME extends string>(name: NAME, listener: any) => void;
    static MaxStackLength: number;
    static emitter: EventEmitter2;
    static waitTime: number;
    undoStack: IUndoStackItem[];
    redoStack: IUndoStackItem[];
    worker: MainEngineForWorker;
    colloctor: Collector;
    room: Room;
    private isTicking;
    private undoTickerId?;
    private tickStartStorerCache?;
    private excludeIds;
    constructor(room: Room, worker: MainEngineForWorker, colloctor: Collector);
    private addExcludeIds;
    addSdkUndoData(step: number): void;
    private diffFun;
    undoTickerStart(id: number): void;
    undoTickerEnd: import("lodash").DebouncedFunc<(id: number) => void>;
    private isDrawEffectiveScene;
    private isDeleteEffectiveScene;
    private isOldEffectiveScene;
    private isNewEffectiveScene;
    private refreshPlugin;
    undo(_undo: () => number): number;
    redo(_redo: () => number): number;
    clear(): void;
    clearUndo(): void;
    clearRedo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    destroy(): void;
}
