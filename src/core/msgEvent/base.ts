import type {EventEmitter2} from "eventemitter2";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MainEngineForWorker } from "../worker/main";
import { BaseCollector } from "../../collector";
import { IWorkerMessage } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";

export abstract class BaseMsgMethod {
    static dispatch(emt: EventEmitter2, emtType: InternalMsgEmitterType, emitEventType:EmitEventType, value: unknown) {
        emt?.emit([emtType, emitEventType], value);
    }
    abstract readonly emitEventType: EmitEventType;
    emtType: InternalMsgEmitterType | undefined;
    emitter: EventEmitter2 | undefined;
    mainEngine: MainEngineForWorker | undefined;
    serviceColloctor: BaseCollector | undefined;
    registerForMainEngine(emt: EventEmitter2, emtType: InternalMsgEmitterType, main: MainEngineForWorker, serviceColloctor: BaseCollector) {
        this.emitter = emt;
        this.emtType = emtType;
        this.mainEngine = main;
        this.serviceColloctor = serviceColloctor;
        this.emtType && this.emitter?.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && this.emitter?.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data: IWorkerMessage[] ): void {
        data.forEach(d=>{
            this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}`,d)
        })
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void {
        requestIdleCallback(()=>{
            actions.forEach(action=>{
                this.serviceColloctor?.dispatch(action)
            })
        }, {timeout: MainEngineForWorker.maxLastSyncTime});
    }
    abstract collect(data: unknown): void;
}