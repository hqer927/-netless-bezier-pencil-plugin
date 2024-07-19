/// <reference types="lodash" />
import EventEmitter2 from "eventemitter2";
import { BaseCollectorReducerAction } from "../collector";
import type { Room } from "../plugin/types";
import { BaseSubWorkModuleProps, ApplianceManagerLike } from "../plugin/types";
import { MasterController } from "../core/mainEngine";
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
    scenePath: string;
    tickStartStorerCache?: Map<string, BaseCollectorReducerAction | undefined>;
}
export interface ILocalStorageDataItem {
    dataType: EUndoDataType;
    key: string;
    data: BaseCollectorReducerAction | [BaseCollectorReducerAction, BaseCollectorReducerAction];
}
export interface UndoRedoMethodProps extends BaseSubWorkModuleProps {
    viewId: string;
}
export declare class UndoRedoMethod {
    static sdkCallBack: <NAME extends string>(name: NAME, listener: any) => void;
    static MaxStackLength: number;
    static waitTime: number;
    emitter: EventEmitter2;
    undoStack: IUndoStackItem[];
    redoStack: IUndoStackItem[];
    worker: MasterController;
    control: ApplianceManagerLike;
    room: Room;
    private isTicking;
    private undoTickerId?;
    private viewId;
    private scenePath?;
    private tickStartStorerCache?;
    private excludeIds;
    constructor(props: UndoRedoMethodProps);
    get collector(): import("../collector").Collector | undefined;
    addExcludeIds(ids: string[]): void;
    undoTickerStart(id: number, scenePath: string): void;
    undoTickerEndSync(id: number, viewId: string, scenePath: string): void;
    undo(scenePath: string): number;
    redo(scenePath: string): number;
    clear(): void;
    clearUndo(): void;
    clearRedo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    onChangeScene: import("lodash").DebouncedFunc<() => void>;
    onFocusView(): void;
    private diffFun;
    private isDrawEffectiveScene;
    private isDeleteEffectiveScene;
    private isOldEffectiveScene;
    private isNewEffectiveScene;
    private refreshPlugin;
}
