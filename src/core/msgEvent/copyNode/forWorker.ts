import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";

export class CopyNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.CopyNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.FullWork) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    consumeForLocalWorker(data: IWorkerMessage): void {
        const { workId } = data;
        if (workId) {
            // console.log('consumeForLocalWorker', data)
            this.localWork?.consumeFull(data)
        }
    }
}