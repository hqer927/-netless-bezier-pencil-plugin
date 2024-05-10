import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IWorkerMessage } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";

export class CopyNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.CopyNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType,undoTickerId} = data;
        if (msgType !== EPostMessageType.FullWork) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data).finally(() => {
                if (undoTickerId) {
                    setTimeout(()=>{
                        this.localWork?._post({
                            sp:[{
                                type: EPostMessageType.None,
                                undoTickerId,
                            }]
                        })
                    },0)
                }
            });
            return true;
        }        
    }
    async consumeForLocalWorker(data: IWorkerMessage): Promise<void> {
        const { workId } = data;
        if (workId) {
            // console.log('consumeForLocalWorker', data)
            await this.localWork?.consumeFull(data, this.scene)
        }
    }
}