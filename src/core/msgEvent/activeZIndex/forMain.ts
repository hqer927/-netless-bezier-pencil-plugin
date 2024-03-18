import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { SelectorShape } from "../../tools";

export type ZIndexActiveEmtData = {
    workId: IworkId,
    isActive: boolean;
}
export class ZIndexActiveMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexActive;
    collect(data: ZIndexActiveEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workId, isActive} = data;
        // console.log('ZIndexActiveEmtData', isActive)
        const localMsgs: IWorkerMessage[] = [];
        const serviceMsgs: BaseCollectorReducerAction[] = [];
        if (workId === SelectorShape.selectorId) {
            localMsgs.push({
                workId,
                msgType: EPostMessageType.UpdateNode,
                dataType: EDataType.Local,
                isActiveZIndex: isActive,
                emitEventType: this.emitEventType,
                willRefreshSelector: true,
                willSyncService: false
            })
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}