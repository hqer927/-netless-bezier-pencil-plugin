import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { IWorkerMessage, IqueryTask } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
import { requestAsyncCallBack } from "../utils";
import { BaseTeachingAidsManager } from "../../plugin/baseTeachingAidsManager";
import { MasterController } from "../mainEngine";

export abstract class BaseMsgMethod {
    static dispatch(emtType: InternalMsgEmitterType, emitEventType:EmitEventType, value: unknown) {
        BaseTeachingAidsManager.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    abstract readonly emitEventType: EmitEventType;
    emtType!: InternalMsgEmitterType;
    control!: BaseTeachingAidsManager;
    mainEngine!: MasterController;
    get serviceColloctor(){
        return this.control.collector;
    }
    registerForMainEngine(emtType: InternalMsgEmitterType, control: BaseTeachingAidsManager) {
        this.emtType = emtType;
        this.control = control;
        this.mainEngine = control.worker;
        this.mainEngine.internalMsgEmitter.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && this.mainEngine && this.mainEngine.internalMsgEmitter.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data:[IWorkerMessage,IqueryTask][]): void {
        for (const [d, query] of data) {
            this.mainEngine?.queryTaskBatchData(query).forEach(task=>{
                this.mainEngine?.taskBatchData.delete(task);
            })
            this.mainEngine?.taskBatchData.add(d);
        }
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void {
        requestAsyncCallBack(()=>{
            actions.forEach(action=>{
                this.serviceColloctor?.dispatch(action);
                const {viewId, undoTickerId} = action;
                if (undoTickerId && viewId) {
                    this.mainEngine?.internalMsgEmitter?.emit('undoTickerEnd', undoTickerId, viewId);
                }
            })
        }, this.mainEngine.maxLastSyncTime);
    }
    abstract collect(data: unknown): void;
}