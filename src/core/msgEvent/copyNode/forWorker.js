import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { EDataType, EPostMessageType } from "../../enum";
export class CopyNodeMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.CopyNode
        });
    }
    consume(data) {
        const { msgType, dataType, emitEventType } = data;
        if (msgType !== EPostMessageType.FullWork)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }
    }
    consumeForLocalWorker(data) {
        const { workId } = data;
        if (workId) {
            // console.log('consumeForLocalWorker', data)
            this.localWork?.consumeFull(data);
        }
    }
}
