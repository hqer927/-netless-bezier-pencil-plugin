import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
export declare class DeleteNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType;
    consume(): boolean | undefined;
}
