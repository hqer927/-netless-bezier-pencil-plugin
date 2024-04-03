import { EmitEventType } from "../../plugin/types";
import { IWorkerMessage } from "../types";
import { LocalWorkForFullWorker } from "../worker/fullWorkerLocal";
import { ServiceWorkForFullWorker } from "../worker/fullWorkerService";

export abstract class BaseMsgMethodForWorker {
    abstract readonly emitEventType: EmitEventType;
    localWork: LocalWorkForFullWorker | undefined;
    serviceWork: ServiceWorkForFullWorker | undefined;
    registerForWorker(localWork: LocalWorkForFullWorker, serviceWork?: ServiceWorkForFullWorker) {
        this.localWork = localWork;
        this.serviceWork = serviceWork;
        return this;
    }
    abstract consume(data: IWorkerMessage): boolean | undefined;
}