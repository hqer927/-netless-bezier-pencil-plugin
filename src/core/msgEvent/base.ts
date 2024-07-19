import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { IWorkerMessage, IqueryTask } from "../types";
import { BaseCollectorReducerAction } from "../../collector/types";
import { requestAsyncCallBack } from "../utils";
import { BaseApplianceManager } from "../../plugin/baseApplianceManager";
import { MasterController } from "../mainEngine";
import { EvevtWorkState } from "../enum";

export abstract class BaseMsgMethod {
    static dispatch(emtType: InternalMsgEmitterType, emitEventType:EmitEventType, value: unknown) {
        BaseApplianceManager.InternalMsgEmitter?.emit([emtType, emitEventType], value);
    }
    abstract readonly emitEventType: EmitEventType;
    protected abstract lastEmtData?:unknown;
    private useEmtMsg?:boolean;
    emtType!: InternalMsgEmitterType;
    control!: BaseApplianceManager;
    mainEngine!: MasterController;
    get serviceColloctor(){
        return this.control.collector;
    }
    registerForMainEngine(emtType: InternalMsgEmitterType, control: BaseApplianceManager) {
        this.emtType = emtType;
        this.control = control;
        this.mainEngine = control.worker;
        this.mainEngine.internalMsgEmitter.on([this.emtType, this.emitEventType], this.collect.bind(this));
        return this;
    }
    destroy() {
        this.emtType && this.mainEngine && this.mainEngine.internalMsgEmitter.off([this.emtType, this.emitEventType], this.collect.bind(this));
    }
    collectForLocalWorker(data:[IWorkerMessage,IqueryTask][], isSync?:boolean): void {
        for (const [d, query] of data) {
            this.mainEngine?.queryTaskBatchData(query).forEach(task=>{
                this.mainEngine?.taskBatchData.delete(task);
            })
            this.mainEngine?.taskBatchData.add(d);
        }
        if (isSync) {
            this.mainEngine.consume();
            return;
        }
        this.mainEngine?.runAnimation();
    }
    collectForServiceWorker(actions: BaseCollectorReducerAction[]): void {
        requestAsyncCallBack(()=>{
            actions.forEach(action=>{
                this.serviceColloctor?.dispatch(action);
            })
        }, this.mainEngine.maxLastSyncTime);
    }
    abstract collect(data: unknown, isSync?:boolean): void;
    pause(): void {
        if (this.lastEmtData) {
            this.useEmtMsg = true;
            const data = {...this.lastEmtData, workState: EvevtWorkState.Done};
            this.collect(data, true);
            // console.log('pause', data)
            BaseApplianceManager.InternalMsgEmitter?.emit(EmitEventType.ActiveMethod, false);
        }
    }
    recover():void {
        if (this.useEmtMsg && BaseApplianceManager.InternalMsgEmitter.hasListeners(EmitEventType.ActiveMethod)) {
            BaseApplianceManager.InternalMsgEmitter?.emit(EmitEventType.ActiveMethod, true);
        }
    }
}