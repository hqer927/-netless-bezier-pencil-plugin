import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { IWorkerMessage } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
import { BaseTeachingAidsManager } from "../../plugin/baseTeachingAidsManager";
import { MasterController } from "../mainEngine";
export declare abstract class BaseMsgMethod {
    static dispatch(emtType: InternalMsgEmitterType, emitEventType: EmitEventType, value: unknown): void;
    abstract readonly emitEventType: EmitEventType;
    emtType: InternalMsgEmitterType;
    control: BaseTeachingAidsManager;
    mainEngine: MasterController;
    get serviceColloctor(): import("../../collector").Collector | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, control: BaseTeachingAidsManager): this;
    destroy(): void;
    collectForLocalWorker(data: IWorkerMessage[]): void;
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void;
    abstract collect(data: unknown): void;
}
