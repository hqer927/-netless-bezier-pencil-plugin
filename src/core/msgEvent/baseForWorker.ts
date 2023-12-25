import { EmitEventType } from "../../plugin/types";
import { IWorkerMessage } from "../types";
import type { SubLocalWorkForWorker } from "../worker/local";
import type { SubServiceWorkForWorker } from "../worker/service";

export abstract class BaseMsgMethodForWorker {
    abstract readonly emitEventType: EmitEventType;
    localWork: SubLocalWorkForWorker | undefined;
    serviceWork: SubServiceWorkForWorker | undefined;
    registerForWorker(localWork: SubLocalWorkForWorker, serviceWork?: SubServiceWorkForWorker) {
        this.localWork = localWork;
        this.serviceWork = serviceWork;
        return this;
    }
    abstract consume(data: IWorkerMessage): boolean | undefined;
}