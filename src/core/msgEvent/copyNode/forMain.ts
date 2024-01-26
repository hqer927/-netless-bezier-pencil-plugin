import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IWorkerMessage, IworkId } from "../../types";
import { EDataType, EPostMessageType } from "../../enum";
import { BaseCollectorReducerAction } from "../../../collector/types";
import { SelectorShape } from "../../tools";
import cloneDeep from "lodash/cloneDeep";
import { transformToNormalData, transformToSerializableData } from "../../../collector/utils";
import { UndoRedoMethod } from "../../../undo";

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
        const undoTickerId = Date.now();
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
                // console.log('curStore', pos, curStore.updateNodeOpt?.pos?.map(x=>x), updateNodeOpt)
                const translate = [updateNodeOpt.pos[0] - pos[0], updateNodeOpt.pos[1] - pos[1]];
                if (curStore.ops) {
                    const op = (transformToNormalData(curStore.ops) as number[]).map((n,index)=>{
                        const i = index % 3
                        if ( i === 0) {
                            return n + translate[0];
                        } 
                        if( i === 1) {
                            return n + translate[1];
                        }
                        return n
                    })
                    const newOps = transformToSerializableData(op);
                    curStore.ops = newOps;
                    serviceMsgs.push({
                        ...curStore,
                        updateNodeOpt,
                        type: EPostMessageType.FullWork,
                        workId: copyNodeKey,
                        undoTickerId
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
        }
        UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}