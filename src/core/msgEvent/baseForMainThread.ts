import type { Scene } from "spritejs";
import { EmitEventType } from "../../plugin/types";
import { IWorkerMessage } from "../types";
import { SubLocalThread } from "../mainThread/subLocalThread";
import { SubServiceThread } from "../mainThread/subServiceThread";

export abstract class BaseMsgMethodForMainThread {
    abstract readonly emitEventType: EmitEventType;
    localWork?: SubLocalThread;
    serviceWork?: SubServiceThread;
    scene: Scene | undefined;
    registerMainThread(localWork: SubLocalThread, serviceWork?: SubServiceThread, scene?:Scene) {
        this.localWork = localWork;
        this.serviceWork = serviceWork;
        this.scene = scene;
        return this;
    }
    abstract consume(data: IWorkerMessage): Promise<boolean | undefined>;
}