import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { IWorkerMessage, IqueryTask } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
import { BaseApplianceManager } from "../../plugin/baseApplianceManager";
import { MasterController } from "../mainEngine";
export declare abstract class BaseMsgMethod {
    static dispatch(emtType: InternalMsgEmitterType, emitEventType: EmitEventType, value: unknown): void;
    abstract readonly emitEventType: EmitEventType;
    protected abstract lastEmtData?: unknown;
    private useEmtMsg?;
    emtType: InternalMsgEmitterType;
    control: BaseApplianceManager;
    mainEngine: MasterController;
    get serviceColloctor(): import("../../collector").Collector | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, control: BaseApplianceManager): this;
    destroy(): void;
    collectForLocalWorker(data: [IWorkerMessage, IqueryTask][], isSync?: boolean): void;
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void;
    abstract collect(data: unknown, isSync?: boolean): void;
    pause(): void;
    recover(): void;
}
