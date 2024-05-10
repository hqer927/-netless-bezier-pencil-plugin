import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { Storage_Selector_key } from "../../../collector";

export type ZIndexActiveEmtData = {
    workId: IworkId,
    isActive: boolean;
    viewId: string;
}
export class ZIndexActiveMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexActive;
    collect(data: ZIndexActiveEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workId, isActive, viewId} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const localMsgs: [IWorkerMessage,Partial<IWorkerMessage>][] = [];
        const serviceMsgs: BaseCollectorReducerAction[] = [];
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
            },{
                workId, 
                msgType: EPostMessageType.UpdateNode, 
                emitEventType: this.emitEventType
            }])
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}