import type { AnimationMode, WindowManager } from "@netless/window-manager";
import { BaseApplianceManager, BaseApplianceManagerProps } from "../baseApplianceManager";
import { BaseSubWorkModuleProps } from "../types";
import { ViewContainerMultiManager } from "./containerManager";
import { MemberDiff } from "../../members";
import { ISerializableStorageData, ISerializableStorageScenePathData } from "../../collector";
import { Main_View_Id } from "../../core/const";
export type {AnimationMode, WindowManager};

export class ApplianceMultiManager extends BaseApplianceManager {
    windowManager?: WindowManager;
    viewContainerManager: ViewContainerMultiManager;
    constructor(params:BaseApplianceManagerProps) {
        super(params)
        const props:BaseSubWorkModuleProps = {
            control: this,
            internalMsgEmitter: BaseApplianceManager.InternalMsgEmitter
        }
        this.viewContainerManager = new ViewContainerMultiManager(props);
    }
    init() {}
    destroy() {
        this.roomMember.destroy();
        this.collector?.destroy();
        this.worker?.destroy();
        this.viewContainerManager?.destroy();
        this.cursor?.destroy();
    }
    activePlugin(){
        if(this.collector){
            this.collector.addStorageStateListener((diff)=>{
                if (this.collector?.storage) {
                    const curKeys = Object.keys(this.collector.storage);
                    if (curKeys.length === 0) {
                        this.worker?.clearViewScenePath(Main_View_Id,true);
                        return;
                    }
                }
                const {diffView, diffScenePath, diffData} = diff;
                const excludeIds:Map<string, Set<string>> = new Map();
                if(diffView){
                    let excludeViewData:ISerializableStorageScenePathData|undefined;
                    Object.keys(diffView).forEach((viewId)=>{
                        const viewData = diffView[viewId];
                        if (viewData && !viewData.newValue) {
                            this.worker?.clearViewScenePath(viewId,true);
                            if (viewData.oldValue) {
                                excludeViewData = viewData.oldValue;
                            }
                        } else if (viewData && viewData.newValue) {
                            for (const scenePath of Object.keys(viewData.newValue)) {
                                this.worker.pullServiceData(viewId, scenePath, {isAsync: false, useAnimation:true});
                            }
                            excludeViewData = viewData.newValue;
                        }
                        if (excludeViewData) {
                            for (const scenePathData of Object.values(excludeViewData)) {
                                const ids = new Set<string>();
                                for (const key of Object.keys(scenePathData)) {
                                    if (key) {
                                        ids.add(key);
                                    }
                                }
                                excludeIds.set(viewId, ids);
                            }
                        }
                    })
                }
                if(diffScenePath){
                    let excludeScenePathData:ISerializableStorageData|undefined;
                    Object.keys(diffScenePath).forEach((scenePath)=>{
                        const scenePathData = diffScenePath[scenePath];
                        if (scenePathData && scenePathData.viewId && !scenePathData.newValue) {
                            this.worker?.clearViewScenePath(scenePathData.viewId, true);
                            if (scenePathData.oldValue) {
                                excludeScenePathData = scenePathData.oldValue;
                            }
                        } else if (scenePathData && scenePathData.viewId && scenePathData.newValue) {
                            this.worker.pullServiceData(scenePathData.viewId, scenePath, {isAsync: false, useAnimation:true});
                            excludeScenePathData = scenePathData.newValue;
                        }
                        if (scenePathData?.viewId && excludeScenePathData) {
                            const ids = new Set<string>();
                            for (const key of Object.keys(excludeScenePathData)) {
                                if (key) {
                                    ids.add(key);
                                }
                                excludeIds.set(scenePathData.viewId, ids);
                            }
                        }
                    })
                }
                if(diffData){
                    Object.keys(diffData).forEach((key)=>{
                        const item = diffData[key];
                        if (item) {
                            const {viewId} = item;
                            const ids = excludeIds.get(viewId) || new Set();
                            ids.add(key);
                            excludeIds.set(viewId, ids);
                            this.worker?.onServiceDerive(key, item);
                        }
                    })
                }
                for (const [viewId,keys] of excludeIds.entries()) {
                    BaseApplianceManager.InternalMsgEmitter.emit('excludeIds', [...keys], viewId);
                }
            })
            if (this.room) {
                this.roomMember.onUidChangeHook((diff: MemberDiff)=>{
                    if (this.collector?.serviceStorage) {
                        const selectors:{key:string,viewId:string,scenePath:string}[] = [];
                        this.viewContainerManager.getAllViews().forEach(v=>{
                            if (v && v.focusScenePath && this.collector?.serviceStorage[v.id] && this.collector.serviceStorage[v.id][v.focusScenePath]) {
                                const s = Object.keys(this.collector.serviceStorage[v.id][v.focusScenePath]).
                                filter(k=>this.collector?.isSelector(k)).map(key=>({viewId:v.id, scenePath:v.focusScenePath, key}));
                                s.length && selectors.push(...s);
                            }
                        });
                        selectors.forEach(({key, viewId, scenePath})=>{
                            const uid = this.collector?.getUidFromKey(key);
                            if (uid && !diff.online.includes(uid)) {
                                this.collector?.updateValue(key, undefined, {isAfterUpdate: true, viewId, scenePath});
                            }
                        })
                    }
                    this.cursor?.updateRoomMembers(diff);
                    // if (this.cursor?.eventCollector?.serviceStorage) {
                    //     const eventKeys = Object.keys(this.cursor?.eventCollector.serviceStorage);
                    //     eventKeys.forEach(uid=>{
                    //         if (!diff.online.includes(uid)) {
                    //             this.cursor?.eventCollector?.clearValue(uid);
                    //         }
                    //     })
                    // }
                })
            }
            if (this.worker.isActive) {
                this.viewContainerManager.getAllViews().forEach(v=>{
                    if (v && v.focusScenePath) {
                        this.worker.pullServiceData(v.id,v.focusScenePath, {isAsync: true, useAnimation:false});
                    }
                })
            }
        }
    }
    async activeWorker(){
        await this.worker.init();
    }
    setWindowManager(windowManager:WindowManager){
        this.windowManager = windowManager;
        if (this.windowManager?.mainView?.divElement) {
            this.viewContainerManager.onMainViewMounted(this.windowManager.mainView)
        }
        if(this.windowManager.appManager?.viewManager?.views?.size){
            this.windowManager.appManager.viewManager.views.forEach((view,appId) => {
                this.viewContainerManager.onAppViewMounted({appId, view})
            });
        }
        this.viewContainerManager.listenerWindowManager(this.windowManager);
    }
}