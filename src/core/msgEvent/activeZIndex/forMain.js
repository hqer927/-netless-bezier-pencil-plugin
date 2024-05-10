import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType } from "../../enum";
import { Storage_Selector_key } from "../../../collector";
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
        const { workId, isActive, viewId } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        const localMsgs = [];
        const serviceMsgs = [];
        if (workId === Storage_Selector_key) {
            localMsgs.push([{
                    workId,
                    msgType: EPostMessageType.UpdateNode,
                    dataType: EDataType.Local,
                    isActiveZIndex: isActive,
                    emitEventType: this.emitEventType,
                    willRefreshSelector: true,
                    willSyncService: false,
                    viewId,
                    scenePath
                }, {
                    workId,
                    msgType: EPostMessageType.UpdateNode,
                    emitEventType: this.emitEventType
                }]);
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}
