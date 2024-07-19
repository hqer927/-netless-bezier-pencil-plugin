import { EmitEventType } from "../../../plugin/types";
import { IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseMsgMethodForMainThread } from "../baseForMainThread";

export class CopyNodeMethodForMainThread extends BaseMsgMethodForMainThread {
    readonly emitEventType: EmitEventType = EmitEventType.CopyNode;
    async consume(data: IWorkerMessage): Promise<boolean | undefined> {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.FullWork) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const { workId } = data;
        if (workId) {
            await this.localWork?.consumeFull(data, this.scene)
        }
    }
}