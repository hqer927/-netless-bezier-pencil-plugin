import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForMainThread } from "../baseForMainThread";

export class DeleteNodeMethodForMainThread extends BaseMsgMethodForMainThread {
    readonly emitEventType: EmitEventType = EmitEventType.DeleteNode;
    async consume(): Promise<boolean | undefined> {
        return false; 
    }
}