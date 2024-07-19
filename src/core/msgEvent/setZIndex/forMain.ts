import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IUpdateNodeOpt, IWorkerMessage, IqueryTask, IworkId } from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { EDataType, EPostMessageType, ElayerType } from "../../enum";
// import { BaseCollectorReducerAction } from "../../../collector/types";
import { BaseShapeOptions } from "../../tools";
import { Collector, Storage_Selector_key } from "../../../collector";

export type ZIndexNodeEmtData = {
    workIds: IworkId[],
    layer: ElayerType,
    viewId: string;
}
export class ZIndexNodeMethod extends BaseMsgMethod {
    protected lastEmtData?: unknown;
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexNode;
    private zIndexMap: Map<string, {
        min: number,
        max: number
    }> = new Map();
    clearZIndex(viewId: string) {
        this.zIndexMap.delete(viewId);
    }
    getMinZIndex(viewId: string) : number {
        return this.zIndexMap.get(viewId)?.min || 0;
    }
    getMaxZIndex(viewId: string) : number {
        return this.zIndexMap.get(viewId)?.max|| 0;
    }
    setMaxZIndex(max: number, viewId: string) {
        const min = this.getMinZIndex(viewId)
        this.zIndexMap.set(viewId, {
            min,
            max
        })
    }
    setMinZIndex(min: number, viewId: string) {
        const max = this.getMaxZIndex(viewId)
        this.zIndexMap.set(viewId, {
            min,
            max
        })
    }
    addMaxLayer(viewId: string): void {
        const max = this.getMaxZIndex(viewId) + 1;
        this.setMaxZIndex(max, viewId)
    }
    addMinLayer(viewId: string): void {
        const min = this.getMinZIndex(viewId) - 1;
        this.setMinZIndex(min, viewId)
    }
    correct(data:Array<[string,number]>): Array<[string,number]> {
       const arr = data.sort((a,b)=>{
            return a[1] - b[1];
        });
        for (let i = 1; i < arr.length; i++) {
            const curZIndex = arr[i][1];
            const perZIndex = arr[i-1][1];
            if (curZIndex <= perZIndex) {
                arr[i][1] = perZIndex + 1;
            }
        }
        return arr;
    }
    collect(data: ZIndexNodeEmtData): void {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const {workIds, layer, viewId} = data;
        const view =  this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return ;
        }
        const scenePath = view.focusScenePath;
        const keys = [...workIds];
        const store = this.serviceColloctor.storage;
        const localMsgs: [IWorkerMessage,IqueryTask][] = [];
        // const serviceMsgs: BaseCollectorReducerAction[] = [];
        const selectIds: string[] = [];
        while (keys.length) {
            const curKey = keys.pop();
            if (!curKey) {
                continue;
            }
            const curKeyStr = curKey.toString()
            const isLocalId:boolean = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
            let localWorkId:string | undefined = curKeyStr ;
            if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
                localWorkId = this.serviceColloctor.getLocalId(localWorkId);
            }
            const curStore = cloneDeep(store[viewId][scenePath][key]);
            let zIndex:number|undefined;
            if (curStore && localWorkId === Storage_Selector_key) {
                if (curStore.selectIds) {
                    selectIds.push(...curStore.selectIds);
                    selectIds.sort((a,b)=>{
                        const aZIndex = store[getKey(a, this.serviceColloctor as Collector)]?.opt?.zIndex || 0;
                        const bZIndex = store[getKey(a, this.serviceColloctor as Collector)]?.opt?.zIndex || 0;
                        if (aZIndex > bZIndex) {
                            return 1;
                        } else if (a < b) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    const updateNodeOpt = curStore.updateNodeOpt || {}
                    updateNodeOpt.zIndexLayer = layer;
                    const taskData: IWorkerMessage = {
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        dataType: EDataType.Local,
                        updateNodeOpt,
                        emitEventType: this.emitEventType,
                        willRefreshSelector: true,
                        willSyncService: true,
                        viewId
                    };
                    const subStore: Map<string, {
                        opt: BaseShapeOptions;
                        updateNodeOpt?: IUpdateNodeOpt;
                    }> = new Map();
                    if (layer === ElayerType.Top) {
                        this.addMaxLayer(viewId);
                        zIndex = this.getMaxZIndex(viewId);
                    } else {
                        this.addMinLayer(viewId);
                        zIndex = this.getMinZIndex(viewId);
                    }
                    selectIds.forEach((name)=> {
                        const isLocalId = this.serviceColloctor?.isLocalId(name);
                        let key = isLocalId && this.serviceColloctor?.transformKey(name) || name;
                        const curStore = store[viewId][scenePath][key];
                        if (!isLocalId && this.serviceColloctor?.isOwn(key)) {
                            key = this.serviceColloctor.getLocalId(key);
                        }
                        updateNodeOpt.zIndex = zIndex;
                        if (curStore?.opt) {
                            curStore.opt.zIndex = zIndex;
                        }
                        curStore?.opt && subStore.set(key, {
                            updateNodeOpt: curStore.updateNodeOpt,
                            opt: curStore.opt,
                        })
                    })
                    taskData.selectStore = subStore;
                    taskData.willSerializeData = true;
                    localMsgs.push([taskData,{
                        workId: curKey,
                        msgType: EPostMessageType.UpdateNode,
                        emitEventType: this.emitEventType
                    }])
                }
                continue;
            }
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        function getKey(name:string, serviceColloctor: Collector) {
            const isLocalId = serviceColloctor.isLocalId(name);
            return isLocalId && serviceColloctor.transformKey(name) || name;
        }
    }
}