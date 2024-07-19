/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MainViewMultiDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { BaseApplianceManager } from "../baseApplianceManager";
import { AppViewDisplayerManagerImpl } from "./displayer/appViewDisplayerManager";
import type {HotKeys, MemberState, View} from "../types";
import { BaseSubWorkModuleProps } from "../types";
import { ApplianceMultiManager } from "./applianceMultiManager";
import { ViewWorkerOptions } from "../../core/types";
import type {AnimationMode, WindowManager} from './applianceMultiManager';
import { isEqual } from "lodash";
import { Main_View_Id } from "../../core/const";

export class ViewContainerMultiManager extends ViewContainerManager {
    focuedViewId?: string;
    focuedView?: ViewInfo;
    control: ApplianceMultiManager;
    /** 针对windowmanager的focusedChange先于onAppViewMounted*/
    tmpFocusedViewId?: string;
    private checkScaleTimer?:number;
    constructor(props:BaseSubWorkModuleProps) {
        super(props);
        this.control = props.control as ApplianceMultiManager;
    }
    async mountView(viewId:string){
        const viewInfo = this.getView(viewId);
        if (viewInfo) {
            const {width, height, dpr} = viewInfo.displayer;
            const opt = {
                dpr,
                originalPoint: [width/2, height/2],
                offscreenCanvasOpt: {
                    ...ViewContainerMultiManager.defaultScreenCanvasOpt,
                    width,
                    height,
                },
                layerOpt: {
                    ...ViewContainerMultiManager.defaultLayerOpt,
                    width,
                    height,
                },
                cameraOpt: {
                    ...ViewContainerMultiManager.defaultCameraOpt,
                    width,
                    height,
                }
            }  as ViewWorkerOptions;
            if (viewInfo.viewData) {
                const {scale,...camera} = viewInfo.viewData.camera;
                opt.cameraOpt = {
                    ...opt.cameraOpt,
                    ...camera,
                    scale: scale === Infinity ? 1 : scale
                }
            }
            if (viewId === this.mainView?.id) {
                this.control.cursor.activeCollector();
                await this.control.activeWorker();
            }
            this.control.worker?.createViewWorker(viewId, opt);
            if(viewInfo.focusScenePath && this.control.collector){
                this.control.worker.pullServiceData(viewId,viewInfo.focusScenePath, {isAsync: true, useAnimation:false});
            }
        }
    }
    listenerWindowManager(windowManager: WindowManager) {
        windowManager.emitter.on("focusedChange", focus => {
            const focuedViewId = focus || Main_View_Id;
            if (this.focuedViewId !== focuedViewId) {
                const view = this.getView(focuedViewId);
                if (view) {
                    const curWorkViewId = this.control.worker.getLocalWorkViewId();
                    if (curWorkViewId && curWorkViewId !== focuedViewId) {
                        this.setFocuedViewId(curWorkViewId)
                    } else {
                        this.setFocuedViewId(focuedViewId)
                    }
                } else {
                    this.tmpFocusedViewId = focuedViewId;
                }
            }
        });
        windowManager.emitter.on("mainViewScenePathChange", path => {
            this.control.onSceneChange(path, Main_View_Id);
        })
        windowManager.emitter.on('onMainViewMounted', this.onMainViewMounted);
        windowManager.emitter.on('onAppViewMounted', this.onAppViewMounted);
        windowManager.emitter.on("onMainViewRebind", this.onMainViewRelease);
        windowManager.emitter.on('onBoxClose', (payload:any) => {
            const view = this.appViews.get(payload.appId);
            if (view) {
                this.destroyAppView(payload.appId);
                this.control.worker.destroyViewWorker(payload.appId);
            }
        })
        windowManager.emitter.on('onAppScenePathChange', (payload:any) => {
            const {appId, view} = payload;
            this.control.onSceneChange(view.focusScenePath, appId);
        })
        windowManager.emitter.on('appsChange', (appIds:string[]) => {
            for (const appId of this.appViews.keys()) {
                if (!appIds.includes(appId)) {
                    this.destroyAppView(appId);
                    this.control.worker.destroyViewWorker(appId, true);
                }
            }
        })
    }
    private onMainViewRelease = async (bindMainView: View) => {
        this.control.textEditorManager.clear(Main_View_Id, true);
        this.mainViewDestroy(bindMainView);
        await new Promise((resolve) => {
            setTimeout(()=>{
                resolve(true)
            },0)
        })
        this.onMainViewMounted(bindMainView);
        const memberState = this.control.getSnapshootData('memberState');
        this.control.room && this.control.onMemberChange(memberState as MemberState);
        this.control.clearSnapshootData();
    }
    private mainViewDestroy = (bindMainView:View) => {
        if (this.mainView && this.mainView.displayer) {
            this.mainView.displayer.destroy();
            const container = bindMainView.divElement;
            if (container) {
                const nodes = container.getElementsByClassName('teaching-aids-plugin-main-view-displayer');
                for (const node of nodes) {
                    node.remove();
                }
            }
            if (this.mainView.container && container !== this.mainView.container) {
                const nodes = this.mainView.container.getElementsByClassName('teaching-aids-plugin-main-view-displayer');
                for (const node of nodes) {
                    node.remove();
                }
            }
            this.control.worker?.destroyViewWorker(this.mainView.id, true);
            this.mainView.displayer.destroy();
            this.mainView = undefined;
        }
    }
    onMainViewMounted = (bindMainView: View) => {
        const container = bindMainView.divElement;
        if(!container || !bindMainView.focusScenePath){
            return;
        }
        const focusScenePath = bindMainView.focusScenePath || (bindMainView as any).scenePath as string
        if (!focusScenePath) {
            return;
        }
        const displayer = new MainViewMultiDisplayerManager(this.control, BaseApplianceManager.InternalMsgEmitter);
        const width = bindMainView.size.width || displayer.width;
        const height = bindMainView.size.height || displayer.height;
        const dpr = displayer.dpr;
        const opt = {
            dpr,
            originalPoint: [width/2, height/2],
            offscreenCanvasOpt: {
                ...ViewContainerMultiManager.defaultScreenCanvasOpt,
                width,
                height,
            },
            layerOpt: {
                ...ViewContainerMultiManager.defaultLayerOpt,
                width,
                height,
            },
            cameraOpt: {
                ...ViewContainerMultiManager.defaultCameraOpt,
                width,
                height,
            }
        }  as ViewWorkerOptions;
        const {scale,...camera} = bindMainView.camera;
        opt.cameraOpt = {
            ...opt.cameraOpt,
            ...camera,
            scale: scale === Infinity ? 1 : scale
        }
        this.focuedViewId = Main_View_Id;
        this.createMianView({
            id: Main_View_Id,
            container,
            displayer,
            focusScenePath: bindMainView.focusScenePath,
            cameraOpt: opt.cameraOpt,
            viewData: bindMainView
        })
        this.focuedView = this.mainView;
        displayer.createMainViewDisplayer(container);
        bindMainView.callbacks.on('onSizeUpdated',this.onMainViewSizeUpdated)
        bindMainView.callbacks.on('onCameraUpdated',this.onMainViewCameraUpdated)
        bindMainView.callbacks.on("onActiveHotkey", this.onActiveHotkeyChange.bind(this))
    }
    private onMainViewSizeUpdated = async() => {
        await new Promise((resolve) => {
            setTimeout(()=>{
                resolve(true)
            },0)
        })
        if (this.mainView && this.mainView.viewData) {
            this.updateMainViewCamera();
        }
    }
    private onMainViewCameraUpdated = async() => {
        await new Promise((resolve) => {
            setTimeout(()=>{
                resolve(true)
            },0)
        })
        this.updateMainViewCamera();
    }
    private updateMainViewCamera = () => {
        if (this.mainView && this.mainView.viewData) {
            const camera = this.mainView.viewData.camera;
            const cameraOpt = this.mainView.cameraOpt;
            if (cameraOpt) {
                const oldW = cameraOpt.width;
                const oldH = cameraOpt.height;
                const {width, height} = this.mainView.viewData.size;
                if (width !==  oldW || height !==  oldH) {
                    this.mainView.displayer.updateSize();
                }
                const scale = camera.scale === Infinity ? 1 : camera.scale;
                const centerX = camera.centerX || 0;
                const centerY = camera.centerY || 0;
                const newValues = {...cameraOpt, scale, centerX, centerY, width, height};
                if (!isEqual(cameraOpt, newValues)) {
                    this.mainView.cameraOpt = newValues;
                }
                if (this.checkScaleTimer && camera.scale ! == Infinity) {
                    clearTimeout(this.checkScaleTimer);
                    this.checkScaleTimer = undefined;
                }
                if (!this.checkScaleTimer && camera.scale === Infinity && this.mainView.viewData && this.mainView.viewData.camera.scale === Infinity) {
                    this.checkScaleTimer = setTimeout(()=>{
                        this.mainView?.viewData?.moveCamera({scale, centerX, centerY, animationMode: 'immediately' as AnimationMode});
                        this.checkScaleTimer = undefined;
                    }, 500) as unknown as number;
                }
            }
        }
    }
    onAppViewMounted = async (payload:any) =>{
        const {appId, view} = payload
        const container = view.divElement as HTMLDivElement;
        if (!container || !view.focusScenePath) {
            return;
        }
        const viewInfo = this.appViews.get(appId);
        if (viewInfo && viewInfo.displayer) {
            let nodes = container.getElementsByClassName('teaching-aids-plugin-app-view-displayer');
            for (const node of nodes) {
                node.remove();
            }
            if(viewInfo.container && viewInfo.container !== container){
                nodes = viewInfo.container.getElementsByClassName('teaching-aids-plugin-app-view-displayer');
                for (const node of nodes) {
                    node.remove();
                }
            }
            this.destroyAppView(payload.appId, true);
            this.control.worker?.destroyViewWorker(appId,true);
            // 等待先发送销毁指令
            await new Promise((resolve) => {
                setTimeout(()=>{
                    resolve(true)
                },0)
            })
        }
        const displayer = new AppViewDisplayerManagerImpl(appId, this.control, BaseApplianceManager.InternalMsgEmitter);
        const width = view.size.width || displayer.width;
        const height = view.size.height || displayer.height;
        const dpr = displayer.dpr;
        const opt = {
            dpr,
            originalPoint: [width/2, height/2],
            offscreenCanvasOpt: {
                ...ViewContainerMultiManager.defaultScreenCanvasOpt,
                width,
                height,
            },
            layerOpt: {
                ...ViewContainerMultiManager.defaultLayerOpt,
                width,
                height,
            },
            cameraOpt: {
                ...ViewContainerMultiManager.defaultCameraOpt,
                ...view.camera,
                width,
                height,
            }
        }  as ViewWorkerOptions;
        this.createAppView({
            id: appId,
            container,
            displayer,
            cameraOpt: opt.cameraOpt,
            focusScenePath: view.focusScenePath,
            viewData: view
        })
        displayer.createAppViewDisplayer(appId, container);
        view.callbacks.on('onSizeUpdated', this.onAppViewSizeUpdated.bind(this, appId));
        view.callbacks.on('onCameraUpdated',this.onAppViewCameraUpdated.bind(this, appId));
        view.callbacks.on("onActiveHotkey", this.onActiveHotkeyChange.bind(this));
        if (this.tmpFocusedViewId === appId) {
            const curWorkViewId = this.control.worker.getLocalWorkViewId();
            if (curWorkViewId && curWorkViewId !== appId) {
                this.setFocuedViewId(curWorkViewId)
            } else {
                this.setFocuedViewId(appId)
            }
            this.tmpFocusedViewId = undefined;
        }
        setTimeout(() => {
            this.onAppViewCameraUpdated(appId);
        }, 0);
    }
    private onAppViewSizeUpdated = async(appId:string) => {
        await new Promise((resolve) => {
            setTimeout(()=>{
                resolve(true)
            },0)
        })
        const view = this.appViews.get(appId);
        if (view && view.viewData) {
            this.updateAppCamera(appId);
        }
    }
    private onAppViewCameraUpdated = async(appId:string) => {
        await new Promise((resolve) => {
            setTimeout(()=>{
                resolve(true)
            },0)
        })
        this.updateAppCamera(appId);
    }
    private updateAppCamera = (appId:string) => {
        const view = this.appViews.get(appId);
        if (view && view.viewData) {
            const camera = view.viewData.camera;
            const cameraOpt = view.cameraOpt;
            if (cameraOpt) {
                const {width, height} = view.viewData.size;
                const oldW = cameraOpt.width;
                const oldH = cameraOpt.height;
                if (width !==  oldW || height !==  oldH) {
                    view.displayer.updateSize();
                }
                const scale = camera.scale === Infinity ? 1 : camera.scale;
                const centerX = camera.centerX || 0;
                const centerY = camera.centerY || 0;
                const newValues = {...cameraOpt, scale, centerX, centerY, width, height};
                if (!isEqual(newValues, cameraOpt)) {
                    view.cameraOpt = newValues;
                }
            }
        }
    }
    private onActiveHotkeyChange(hotkey: keyof HotKeys) {
        this.control.hotkeyManager.onActiveHotkey(hotkey);
    }
}

