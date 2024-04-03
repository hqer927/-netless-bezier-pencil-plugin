import { WindowManager } from "@netless/window-manager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { BaseSubWorkModuleProps, TeachingAidsPluginOptions } from "../types";
import { ViewContainerMultiManager } from "./containerManager";
// import { TeachingAidsMultiPlugin } from "./teachingAidsPlugin";
import { MemberDiff } from "../../members";
import type { TeachingAidsPlugin } from "../teachingAidsPlugin";

export class TeachingAidsMultiManager extends BaseTeachingAidsManager {
    windowManager?: WindowManager;
    viewContainerManager: ViewContainerMultiManager;
    constructor(plugin: TeachingAidsPlugin, options?: TeachingAidsPluginOptions) {
        super(plugin,options)
        const props:BaseSubWorkModuleProps = {
            control: this,
            internalMsgEmitter: BaseTeachingAidsManager.InternalMsgEmitter
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
    activeWorker(){
        // console.log('activeWorker')
        this.worker.init();
        // this.cursor.injectWorker(this.worker);
        this.collector.addStorageStateListener((diff)=>{
            if (this.collector?.storage) {
                const curKeys = Object.keys(this.collector.storage);
                if (curKeys.length === 0) {
                    this.worker?.clearViewScenePath('mainView',true);
                    return;
                }
            }
            if(diff){
                Object.keys(diff).forEach((key)=>{
                    const item = diff[key];
                    if (item) {
                        this.worker?.onServiceDerive(key, item);
                    }
                })
                TeachingAidsMultiManager.InternalMsgEmitter.emit("excludeIds", Object.keys(diff));
            }
        })
        if (this.room) {
            this.roomMember.onUidChangeHook((diff: MemberDiff)=>{
                if (this.collector?.serviceStorage) {
                    const selectors:{key:string,viewId:string,scenePath:string}[] = [];
                    this.viewContainerManager.getAllViews().forEach(v=>{
                        if (v && v.focusScenePath && this.collector.serviceStorage[v.id] && this.collector.serviceStorage[v.id][v.focusScenePath]) {
                            const s = Object.keys(this.collector.serviceStorage[v.id][v.focusScenePath]).
                            filter(k=>this.collector.isSelector(k)).map(key=>({viewId:v.id, scenePath:v.focusScenePath, key}));
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
                if (this.cursor?.eventCollector.serviceStorage) {
                    const eventKeys = Object.keys(this.cursor?.eventCollector.serviceStorage);
                    eventKeys.forEach(uid=>{
                        if (!diff.online.includes(uid)) {
                            this.cursor?.eventCollector.clearValue(uid);
                        }
                    })
                }
            })
        }
    }
    setWindowManager(windowManager:WindowManager){
        this.windowManager = windowManager;
        this.viewContainerManager.listenerWindowManager(this.windowManager);
    }
    // windowManagerListener = () => {
    //     function clo (){
    //         console.log('windowManagerListener111')
    //     }
    //     function clo1 (){
    //         console.log('windowManagerListener111')
    //     }
    //     function clo2 (){
    //         console.log('windowManagerListener111')
    //     }
    //     if(!this.windowManager){
    //         return;
    //     }
    //     this.windowManager.emitter.on("loadApp", payload => {
    //         console.log("windowManager loadApp", payload);
    //     });
    //     this.windowManager.emitter.on("mainViewModeChange", mode => {
    //         console.log("windowManager mode1", mode, this.windowManager?.focused);
    //     });
    
    //     this.windowManager.emitter.on("boxStateChange", state => {
    //         console.log("windowManager boxStateChange1:", state, this.windowManager?.focused);
    //     });
    
    //     this.windowManager.emitter.on("fullscreenChange", state => {
    //         console.log("windowManager fullscreenChange1:", state, this.windowManager?.focused);
    //     });
    
    //     this.windowManager.emitter.on("appsChange", apps => {
    //         console.log("windowManager appsChange1:", apps, this.windowManager?.focused, this.windowManager?.focusedView);
    //         this.windowManager?.focusedView?.callbacks.off("onCameraUpdatedByDevice",clo)
    //         this.windowManager?.focusedView?.callbacks.on("onCameraUpdatedByDevice",clo)
    //     });

    //     this.windowManager.emitter.on("mainViewScenePathChange", path => {
    //         console.log("windowManager mainViewScenePathChange1", path, this.windowManager?.focused);
    //     });
    //     this.windowManager.emitter.on("mainViewSceneIndexChange", index => {
    //         console.log("windowManager mainViewSceneIndexChange1", index, this.windowManager?.focused);
    //     });
    //     this.windowManager.emitter.on("focusedChange", focus => {
    //         // this.windowManager.focusedView?.callbacks.off("onCameraUpdatedByDevice",clo1)
    //         // this.windowManager.focusedView?.callbacks.on("onCameraUpdatedByDevice",clo1)
    //         console.log("windowManager focusedChange1", focus, this.windowManager?.focusedView);
    //         this.windowManager?.focusedView?.callbacks.off("onCameraUpdatedByDevice",clo2)
    //         this.windowManager?.focusedView?.callbacks.on("onCameraUpdatedByDevice",clo2)
    //     });
    //     this.windowManager.emitter.on("mainViewScenesLengthChange", length => {
    //         console.log("windowManager mainViewScenesLengthChange1", length, this.windowManager?.focused);
    //     });
    //     this.windowManager.emitter.on("canRedoStepsChange", steps => {
    //         console.log("windowManager canRedoStepsChange1", steps, this.windowManager?.focused);
    //     });
    //     this.windowManager.emitter.on("canUndoStepsChange", steps => {
    //         console.log("windowManager canUndoStepsChange1", steps, this.windowManager?.focused);
    //         // this.windowManager.focusedView?.callbacks.off("onCameraUpdatedByDevice",clo)
    //         // this.windowManager.focusedView?.callbacks.on("onCameraUpdatedByDevice",clo)
    //     });
    //     this.windowManager.onAppEvent("DocsViewer", event => {
    //         console.log("windowManager DocsViewer1", event);
    //         if (event.type === "pageStateChange") console.log("windowManager DocsViewer1 pageStateChange1", event.value);
    //     });
    //     this.windowManager.onAppEvent("Slide", event => {
    //         // console.log("windowManager Slide1", event)
    //         if (event.type === "pageStateChange") console.log("windowManager Slide1 pageStateChange1", event.value);
    //     });
    //     this.windowManager.mainView.callbacks.on("onCameraUpdatedByDevice",clo1);
    //     this.windowManager.focusedView?.callbacks.on("onCameraUpdatedByDevice",clo1);

    // }
}