import type { EventEmitter2 } from "eventemitter2";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MainEngineForWorker } from "../worker/main";
import { BaseCollector } from "../../collector";
import { IWorkerMessage } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
export declare abstract class BaseMsgMethod {
    static dispatch(emt: EventEmitter2, emtType: InternalMsgEmitterType, emitEventType: EmitEventType, value: unknown): void;
    abstract readonly emitEventType: EmitEventType;
    emtType: InternalMsgEmitterType | undefined;
    emitter: EventEmitter2 | undefined;
    mainEngine: MainEngineForWorker | undefined;
    serviceColloctor: BaseCollector | undefined;
    registerForMainEngine(emt: EventEmitter2, emtType: InternalMsgEmitterType, main: MainEngineForWorker, serviceColloctor: BaseCollector): this;
    destroy(): void;
    collectForLocalWorker(data: IWorkerMessage[]): void;
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void;
    abstract collect(data: unknown): void;
}
