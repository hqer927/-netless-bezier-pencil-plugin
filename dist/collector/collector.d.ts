import { BaseCollectorReducerAction, Diff, INormalPushMsg, ISerializableStorageData, IStorageValueItem } from "./types";
import { BaseCollector } from "./base";
import { BezierPencilPlugin } from "../plugin";
/**
 * 服务端事件/状态同步收集器
 */
export declare class Collector extends BaseCollector {
    static syncInterval: number;
    serviceStorage: ISerializableStorageData;
    storage: ISerializableStorageData;
    uid: string;
    plugin?: BezierPencilPlugin;
    protected namespace: string;
    private stateDisposer;
    private asyncClockState;
    constructor(plugin: BezierPencilPlugin, syncInterval?: number);
    addStorageStateListener(callBack: (diff: Diff<any>) => void): void;
    removeStorageStateListener(): void;
    private diffFun;
    transformKey(workId: number | string): string;
    isOwn(key: string): boolean;
    dispatch(action: BaseCollectorReducerAction): void;
    private checkOtherSelector;
    private setState;
    updateValue(key: string, value: any, options?: {
        isSync?: boolean;
        isAfterUpdate?: boolean;
    }): void;
    private runSyncService;
    private syncSerivice;
    private syncUpdata;
    private syncStorage;
    transformToSerializableData(data: IStorageValueItem): string;
    transformToNormalData(str: string): INormalPushMsg;
    keyTransformWorkId(key: string): string;
    destroy(): void;
}
