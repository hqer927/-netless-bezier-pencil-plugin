import { WindowManager } from "@netless/window-manager";
import { BaseTeachingAidsManager, BaseTeachingAidsManagerProps } from "../baseTeachingAidsManager";
import { BaseSubWorkModuleProps } from "../types";
import { ViewContainerMultiManager } from "./containerManager";
import { MemberDiff } from "../../members";
//import { cloneDeep } from "lodash";

export class TeachingAidsMultiManager extends BaseTeachingAidsManager {
    windowManager?: WindowManager;
    viewContainerManager: ViewContainerMultiManager;
    constructor(params:BaseTeachingAidsManagerProps) {
        super(params)
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
    activePlugin(){
        if(this.collector){
            this.collector.addStorageStateListener((diff)=>{
                // console.log('addStorageStateListener', cloneDeep(diff))
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
                    BaseTeachingAidsManager.InternalMsgEmitter.emit("excludeIds", Object.keys(diff));
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
                    if (this.cursor?.eventCollector?.serviceStorage) {
                        const eventKeys = Object.keys(this.cursor?.eventCollector.serviceStorage);
                        eventKeys.forEach(uid=>{
                            if (!diff.online.includes(uid)) {
                                this.cursor?.eventCollector?.clearValue(uid);
                            }
                        })
                    }
                })
            }
            if (this.worker.isActive) {
                this.viewContainerManager.getAllViews().forEach(v=>{
                    if (v && v.focusScenePath) {
                        this.worker.pullServiceData(v.id,v.focusScenePath);
                    }
                })
            }
        }
    }
    activeWorker(){
        this.worker.init();
    }
    setWindowManager(windowManager:WindowManager){
        this.windowManager = windowManager;
        if (this.windowManager?.mainView) {
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