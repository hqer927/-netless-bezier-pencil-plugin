import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { SelectorShape } from "../../tools";
import cloneDeep from "lodash/cloneDeep";

export type CopyNodeEmtData = {
    workIds: IworkId[]
}
export class CopyNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType = EmitEventType.CopyNode;
    collect(data: CopyNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds } = data;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs: IWorkerMessage[] = [];
        const serviceMsgs: BaseCollectorReducerAction[] = [];
        const random = Math.floor( Math.random() * 20 + 10 );
        let t:[number,number] | undefined;
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString()
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = cloneDeep(store[key]);
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            if (curStore && localWorkId === SelectorShape.selectorId) {
                if (curStore.selectIds) {
                    keys.push(...curStore.selectIds);
                }
                continue;
            }
            if (curStore) {
                const now = Date.now();
                const copyNodeKey = (isLocalId ? curKey : this.serviceColloctor.getLocalId(curKey.toString())) + '-' + now;
                const updateNodeOpt = curStore.updateNodeOpt || {};
                const pos = updateNodeOpt.pos || [0,0];
                if (!t) {
                    t = [ - pos[0], - pos[1]];
                }
                updateNodeOpt.pos = [pos[0] + t[0]+ random, pos[1] + t[1] + random];
                updateNodeOpt.useAnimation = false;
                serviceMsgs.push({
                    ...curStore,
                    updateNodeOpt,
                    type: EPostMessageType.FullWork,
                    workId: copyNodeKey,
                })
                localMsgs.push({
                    ...curStore,
                    workId: copyNodeKey,
                    msgType: EPostMessageType.FullWork,
                    dataType: EDataType.Local,
                    updateNodeOpt,
                    emitEventType: this.emitEventType,
                    willSyncService: false,
                    willRefresh: true
                })
            }
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}