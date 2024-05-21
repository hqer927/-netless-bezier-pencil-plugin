import { BaseCollectorReducerAction, Diff, ISerializableStorageData, ISerializableStorageViewData } from "./types";
import { BaseCollector } from "./base";
import type { TeachingAidsPluginLike } from "../plugin/types";
/**
 * 服务端事件/状态同步收集器
 */
export declare class Collector extends BaseCollector<ISerializableStorageViewData> {
    protected namespace: string;
    static namespace: string;
    static syncInterval: number;
    serviceStorage: ISerializableStorageViewData;
    storage: ISerializableStorageViewData;
    private stateDisposer;
    private asyncClockState;
    constructor(plugin: TeachingAidsPluginLike, syncInterval?: number);
    getViewIdBySecenPath(scenePath: string): string | undefined;
    getScenePathData(scenePath: string): ISerializableStorageData | undefined;
    getStorageData(viewId: string, scenePath: string): ISerializableStorageData | undefined;
    hasSelector(viewId: string, scenePath: string): boolean;
    addStorageStateListener(callBack: (diff: Diff<ISerializableStorageData>) => void): void;
    removeStorageStateListener(): void;
    private diffFun;
    private diffFunByscenePath;
    private diffFunByKeys;
    transformKey(workId: number | string): string;
    isOwn(key: string): boolean;
    dispatch(action: BaseCollectorReducerAction): void;
    private checkOtherSelector;
    setState(state: ISerializableStorageData, options: {
        viewId: string;
        scenePath: string;
        isSync?: boolean;
        isAfterUpdate?: boolean;
    }): void;
    updateValue(key: string, value: any, options: {
        viewId: string;
        scenePath: string;
        isSync?: boolean;
        isAfterUpdate?: boolean;
    }): void;
    private runSyncService;
    private syncSerivice;
    private syncViewData;
    private syncScenePathData;
    private syncUpdataView;
    private syncStorageView;
    private syncUpdataScenePath;
    private syncStorageScenePath;
    private syncUpdataKey;
    private syncStorageKey;
    keyTransformWorkId(key: string): string;
    destroy(): void;
}
