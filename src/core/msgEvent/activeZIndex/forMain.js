import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
export class ZIndexActiveMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.ZIndexActive
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workId, isActive } = data;
        const localMsgs = [];
        const serviceMsgs = [];
        if (workId === SelectorShape.selectorId) {
            localMsgs.push({
                workId,
                msgType: EPostMessageType.UpdateNode,
                dataType: EDataType.Local,
                isActiveZIndex: isActive,
                emitEventType: this.emitEventType,
                willRefreshSelector: true,
                willSyncService: false
            });
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}
