import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
import cloneDeep from "lodash/cloneDeep";
import { transformToNormalData, transformToSerializableData } from "../../../collector/utils";
export class CopyNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.CopyNode
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds } = data;
        const keys = [...workIds];
        const store = this.serviceColloctor?.storage;
        const localMsgs = [];
        const serviceMsgs = [];
        const random = Math.floor(Math.random() * 20 + 10);
        let t;
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            const curStore = cloneDeep(store[key]);
            let localWorkId = curKeyStr;
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
                const pos = updateNodeOpt.pos || [0, 0];
                if (!t) {
                    t = [-pos[0], -pos[1]];
                }
                updateNodeOpt.pos = [pos[0] + t[0] + random, pos[1] + t[1] + random];
                updateNodeOpt.useAnimation = false;
                // console.log('curStore', pos, curStore.updateNodeOpt?.pos?.map(x=>x), updateNodeOpt)
                const translate = [updateNodeOpt.pos[0] - pos[0], updateNodeOpt.pos[1] - pos[1]];
                if (curStore.ops) {
                    const op = transformToNormalData(curStore.ops).map((n, index) => {
                        const i = index % 3;
                        if (i === 0) {
                            return n + translate[0];
                        }
                        if (i === 1) {
                            return n + translate[1];
                        }
                        return n;
                    });
                    const newOps = transformToSerializableData(op);
                    curStore.ops = newOps;
                    serviceMsgs.push({
                        ...curStore,
                        updateNodeOpt,
                        type: EPostMessageType.FullWork,
                        workId: copyNodeKey,
                    });
                    localMsgs.push({
                        ...curStore,
                        workId: copyNodeKey,
                        msgType: EPostMessageType.FullWork,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willSyncService: false,
                        willRefresh: true
                    });
                }
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
