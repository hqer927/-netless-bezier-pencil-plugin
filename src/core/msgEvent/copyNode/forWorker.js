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
        const { msgType, dataType, emitEventType, undoTickerId } = data;
        if (msgType !== EPostMessageType.FullWork)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data).finally(() => {
                if (undoTickerId) {
                    setTimeout(() => {
                        this.localWork?._post({
                            sp: [{
                                    type: EPostMessageType.None,
                                    undoTickerId,
                                }]
                        });
                    }, 0);
                }
            });
            return true;
        }
    }
    async consumeForLocalWorker(data) {
        const { workId } = data;
        if (workId) {
            // console.log('consumeForLocalWorker', data)
            await this.localWork?.consumeFull(data, this.scene);
        }
    }
}
