import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MainEngineForWorker } from "../worker/main";
import { Collector } from "../../collector";
import { IWorkerMessage } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
import { requestAsyncCallBack } from "../utils";
import { UndoRedoMethod } from "../../undo";
import { BezierPencilManager } from "../../plugin";

export abstract class BaseMsgMethod {
    static dispatch(emtType: InternalMsgEmitterType, emitEventType:EmitEventType, value: unknown) {
        BezierPencilManager.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    abstract readonly emitEventType: EmitEventType;
    emtType: InternalMsgEmitterType | undefined;
    mainEngine: MainEngineForWorker | undefined;
    serviceColloctor: Collector | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, main: MainEngineForWorker, serviceColloctor: Collector) {
        this.emtType = emtType;
        this.mainEngine = main;
        this.serviceColloctor = serviceColloctor;
        BezierPencilManager.InternalMsgEmitter?.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && BezierPencilManager.InternalMsgEmitter?.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data: IWorkerMessage[] ): void {
        const keys = this.mainEngine?.taskBatchData && [...this.mainEngine.taskBatchData.keys()] || [];
        // console.log('collectForLocalWorker', data.map(d=>d.emitEventType))
        for (const d of data) {
            // 相同worker切换不同method，需要注意时序
            if (keys.findIndex(k=>(k as string).split('##')[0] === `${d.msgType},${d.workId}`)) {
                requestAnimationFrame(()=>{
                    this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}##${d.emitEventType},`,d);
                    this.mainEngine?.runAnimation();
                })
            } else {
                this.mainEngine?.taskBatchData.set(`${d.msgType},${d.workId}##${d.emitEventType},`,d)
            }
        }
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