/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApplianceManager, BaseApplianceManagerProps } from "../baseApplianceManager";
import { BaseSubWorkModuleProps, InternalMsgEmitterType } from "../types";
import type { CameraState } from "../types";
import throttle from "lodash/throttle";
import { ViewContainerSingleManager } from "./containerManager";
import { MemberDiff } from "../../members";
import { ISerializableStorageData, ISerializableStorageScenePathData } from "../../collector";
import { Main_View_Id } from "../../core/const";

export class ApplianceSingleManager extends BaseApplianceManager {
    viewContainerManager: ViewContainerSingleManager;
    divMainView?:HTMLDivElement;
    constructor(params:BaseApplianceManagerProps) {
        super(params)
        const props:BaseSubWorkModuleProps = {
            control: this,
            internalMsgEmitter: ApplianceSingleManager.InternalMsgEmitter
        }
        this.viewContainerManager = new ViewContainerSingleManager(props);
    }
    init() {
        ApplianceSingleManager.InternalMsgEmitter.on(InternalMsgEmitterType.BindMainView, (mainView: HTMLDivElement) => {
            this.divMainView = mainView;
            if (this.plugin && !this.viewContainerManager.mainView) {
                this.viewContainerManager.bindMainView();
            }
        })
    }
    activePlugin(){
        if (this.plugin && this.divMainView && !this.viewContainerManager.mainView) {
            this.viewContainerManager.bindMainView();
        }
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
                            if (v && v.focusScenePath && this.collector?.serviceStorage[v.id] && this.collector?.serviceStorage[v.id][v.focusScenePath]) {
                                const s = Object.keys(this.collector?.serviceStorage[v.id][v.focusScenePath]).
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
                    if (this.cursor?.eventCollector?.serviceStorage) {
                        const eventKeys = Object.keys(this.cursor?.eventCollector.serviceStorage);
                        eventKeys.forEach(uid=>{
                            if (!diff.online.includes(uid)) {
                                this.cursor?.eventCollector?.clearValue(uid);
                            }
                        })
                    }
                })
                if (this.worker.isActive) {
                    this.viewContainerManager.getAllViews().forEach(v=>{
                        if (v && v.focusScenePath) {
                            this.worker.pullServiceData(v.id,v.focusScenePath, {isAsync: true, useAnimation:false});
                        }
                    })
                }
            }
        }
    }
    async activeWorker(){
        await this.worker.init();
    }
    onCameraChange = throttle((cameraState: CameraState) => {
        const viewInfo = this.viewContainerManager.mainView;
        if (viewInfo && viewInfo.cameraOpt) {
            if (viewInfo.cameraOpt.width !== cameraState.width || viewInfo.cameraOpt.height !== cameraState.height) {
                this.viewContainerManager.mainView?.displayer.updateSize();
            }
        }
        this.viewContainerManager.setFocuedViewCameraOpt(cameraState);
    }, 20, {'leading':false})
}