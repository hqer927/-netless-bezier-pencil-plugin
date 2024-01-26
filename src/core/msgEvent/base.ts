import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MainEngineForWorker } from "../worker/main";
import { BaseCollector } from "../../collector";
import { IWorkerMessage } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
import { requestAsyncCallBack } from "../utils";
import { UndoRedoMethod } from "../../undo";
import { BezierPencilDisplayer } from "../../plugin";

export abstract class BaseMsgMethod {
    static dispatch(emtType: InternalMsgEmitterType, emitEventType:EmitEventType, value: unknown) {
        BezierPencilDisplayer.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    abstract readonly emitEventType: EmitEventType;
    emtType: InternalMsgEmitterType | undefined;
    mainEngine: MainEngineForWorker | undefined;
    serviceColloctor: BaseCollector | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, main: MainEngineForWorker, serviceColloctor: BaseCollector) {
        this.emtType = emtType;
        this.mainEngine = main;
        this.serviceColloctor = serviceColloctor;
        BezierPencilDisplayer.InternalMsgEmitter?.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && BezierPencilDisplayer.InternalMsgEmitter?.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data: IWorkerMessage[] ): void {
        data.forEach(d=>{
            this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}`,d)
        })
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void {
        requestAsyncCallBack(()=>{
            actions.forEach(action=>{
                this.serviceColloctor?.dispatch(action);
                if (action.undoTickerId) {
                    UndoRedoMethod.emitter.emit("undoTickerEnd", action.undoTickerId);
                }
            })
        }, MainEngineForWorker.maxLastSyncTime);
    }
    abstract collect(data: unknown): void;
}