import { BaseCollectorReducerAction, Diff, INormalPushMsg, ISerializableStorageData, IStorageValueItem } from "./types";
import { BaseCollector } from "./base";
import { BezierPencilPlugin } from "../plugin";
/**
 * 服务端事件/状态同步收集器
 */
export declare class Collector extends BaseCollector {
    storage: ISerializableStorageData;
    uid: string;
    plugin: BezierPencilPlugin;
    protected namespace: string;
    private stateDisposer;
    constructor(plugin: BezierPencilPlugin);
    addStorageStateListener(callBack: (diff: Diff<any>) => void): void;
    removeStorageStateListener(): void;
    private diffFun;
    transformKey(workId: number | string): string;
    isOwn(key: string): boolean;
    dispatch(action: BaseCollectorReducerAction): void;
    private setState;
    private updateValue;
    transformToSerializableData(data: IStorageValueItem): string;
    transformToNormalData(str: string): INormalPushMsg;
    keyTransformWorkId(key: string): string;
    destroy(): void;
}
