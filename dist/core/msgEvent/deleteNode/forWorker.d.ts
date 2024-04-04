import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IWorkerMessage, IworkId } from "../../types";
export type DeleteNodeEmtData = {
    workIds: IworkId[];
};
export declare class DeleteNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType;
    consume(data: IWorkerMessage): boolean | undefined;
    consumeForLocalWorker(data: IWorkerMessage): void;
    consumeForServiceWorker(data: IWorkerMessage): void;
    private commandDeleteText;
}
