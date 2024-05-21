/* eslint-disable @typescript-eslint/no-explicit-any */
import { MainViewMultiDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { MainViewDisplayerManager, ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { AppViewDisplayerManagerImpl } from "./displayer/appViewDisplayerManager";
import type {HotKeys, View} from "../types";
import { BaseSubWorkModuleProps, TeleBoxState } from "../types";
import { TeachingAidsMultiManager } from "./teachingAidsMultiManager";
import { ViewWorkerOptions } from "../../core/types";
import type {AnimationMode, WindowManager} from './teachingAidsMultiManager';

export class ViewContainerMultiManager extends ViewContainerManager {
    focuedViewId?: string;
    focuedView?: ViewInfo;
    control: TeachingAidsMultiManager;
    /** 针对windowmanager的focusedChange先于onAppViewMounted*/
    tmpFocusedViewId?: string;
    private checkScaleTimer?:number;
    constructor(props:BaseSubWorkModuleProps) {
        super(props);
        this.control = props.control as TeachingAidsMultiManager;
        // this.listenerExternalManager();
    }
    mountView(viewId:string){
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
            // console.log('mountView', viewId, opt, viewInfo.displayer.containerOffset)
            if (viewId === this.mainView?.id) {
                this.control.activeWorker();
            }
            this.control.worker?.createViewWorker(viewId, opt);
            if(viewInfo.focusScenePath && this.control.collector){
                // console.log('pullServiceData', viewId, viewInfo.focusScenePath)
                this.control.worker.pullServiceData(viewId,viewInfo.focusScenePath);
            }
        }
    }
    listenerWindowManager(windowManager: WindowManager) {
        // console.log('listenerWindowManager')
        windowManager.emitter.on("boxStateChange", (state:TeleBoxState) => {
            if (state !== "minimized") {
                setTimeout(()=>{
                    this.appViews.forEach(view=>{
                        // console.log("ContainerManager - boxStateChange1:", view.displayer.containerOffset );
                        view.displayer.reflashContainerOffset();
                        // console.log("ContainerManager - boxStateChange2:", view.displayer.containerOffset );
                    })
                }, 100)
            }
        });
        windowManager.emitter.on("focusedChange", focus => {
            const focuedViewId = focus || MainViewDisplayerManager.viewId;
            if (this.focuedViewId !== focuedViewId) {
                const view = this.getView(focuedViewId);
                if (view) {
                    view.displayer.reflashContainerOffset();
                    this.setFocuedViewId(focuedViewId)
                    // this.focuedView = view;
                    // this.focuedViewId = focuedViewId;
                } else {
                    this.tmpFocusedViewId = focuedViewId;
                }
            }
        });
        windowManager.emitter.on("mainViewScenePathChange", path => {
            console.log("ContainerManager mainViewScenePathChange", path);
            // if (this.mainView) {
            //     this.mainView.focusScenePath = path;
            // }
            this.control.onSceneChange(path, 'mainView');
        })
        windowManager.emitter.on('onMainViewMounted', this.onMainViewMounted);
        windowManager.emitter.on('onAppViewMounted', this.onAppViewMounted);
        windowManager.emitter.on("onMainViewRebind", this.onMainViewRelease);
        // windowManager.emitter.on('onAppSetup', (appId:string) => {
        //     const view = this.appViews.get(appId);
        //     if (view && view.displayer) {
        //         console.log('ContainerManager - onAppSetup', appId)
        //     }    
        // })
        windowManager.emitter.on('onBoxMove', (payload:any) => {
            // console.log('ContainerManager - onBoxMove', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        })
        windowManager.emitter.on('onBoxResize', (payload:any) => {
            // console.log('ContainerManager - onBoxResize', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        })
        windowManager.emitter.on('onBoxFocus', (payload:any) => {
            // console.log('ContainerManager - onBoxFocus', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        })
        windowManager.emitter.on('onBoxClose', (payload:any) => {
            // console.log('ContainerManager - onBoxClose', payload);
            const view = this.appViews.get(payload.appId);
            if (view) {
                this.destroyAppView(payload.appId);
                this.control.worker.destroyViewWorker(payload.appId);
            }
        })
        windowManager.emitter.on('onBoxStateChange', (payload:any) => {
            // console.log('ContainerManager - onBoxStateChange', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        })
        windowManager.emitter.on('onAppScenePathChange', (payload:any) => {
            const {appId, view} = payload;
            console.log('ContainerManager - onAppScenePathChange', appId, view.focusScenePath, view);
            // const viewInfo = this.getView(appId);
            // if (viewInfo) {
            //     const scenePath = view.focusScenePath;
            //     if (scenePath) {
            //         viewInfo.focusScenePath = scenePath;
            //     }
            //     // console.log('ContainerManager - onScenePathChange', view.focusScenePath)
            // }
            this.control.onSceneChange(view.focusScenePath, appId);
        })
    }
    private onMainViewRelease = (bindMainView: View) => {
        this.control.textEditorManager.clear(MainViewMultiDisplayerManager.viewId, true);
        // console.log('onMainViewRelease', bindMainView)
        this.onMainViewMounted(bindMainView);
    }
    onMainViewMounted = (bindMainView: View) => {
        // console.log('onMainViewMounted', bindMainView)
        const container = bindMainView.divElement;
        if(!container || !bindMainView.focusScenePath){
            return;
        }
        const focusScenePath = bindMainView.focusScenePath || (bindMainView as any).scenePath as string
        if (!focusScenePath) {
            // console.log('onMainViewMounted--0', focusScenePath)
            return;
        }
        if (this.mainView && this.mainView.displayer) {
            this.mainView.displayer.destroy();
            const nodes = container.getElementsByClassName('teaching-aids-plugin-main-view-displayer');
            for (const node of nodes) {
                node.remove();
            }
            this.control.worker?.destroyViewWorker(this.mainView.id,true);
            this.mainView = undefined;
        }
        const displayer = new MainViewMultiDisplayerManager(this.control, BaseTeachingAidsManager.InternalMsgEmitter);
        // const {width, height, dpr} = displayer;
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
        this.focuedViewId = MainViewMultiDisplayerManager.viewId;
        // console.log('ContainerManager - bindMainView', container)
        this.createMianView({
            id: MainViewMultiDisplayerManager.viewId,
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
        Promise.resolve().then(() => {
            if (this.mainView && this.mainView.viewData) {
                const size = this.mainView.viewData.size;
                // console.log('mainview size updated', size)
                const cameraOpt = this.mainView.cameraOpt;
                if (cameraOpt) {
                    this.mainView.displayer.updateSize();
                    this.mainView.cameraOpt = ({...cameraOpt,...size});
                }
            }
        })
    }
    private onMainViewCameraUpdated = async() => {
        Promise.resolve().then(()=>{
            if (this.mainView && this.mainView.viewData) {
                const camera = this.mainView.viewData.camera;
                // console.log('mainview camera updated', camera)
                const cameraOpt = this.mainView.cameraOpt;
                if (cameraOpt) {
                    const scale = camera.scale === Infinity ? 1 : camera.scale;
                    const centerX = camera.centerX || 0;
                    const centerY = camera.centerY || 0;
                    this.mainView.cameraOpt = ({...cameraOpt, scale, centerX, centerY});
                    if (this.checkScaleTimer && camera.scale ! == Infinity) {
                        clearTimeout(this.checkScaleTimer);
                        this.checkScaleTimer = undefined;
                    }
                    if (!this.checkScaleTimer && camera.scale === Infinity && this.mainView.viewData && this.mainView.viewData.camera.scale === Infinity) {
                        this.checkScaleTimer = setTimeout(()=>{
                            this.mainView?.viewData?.moveCamera({scale, centerX, centerY, animationMode: 'immediately' as AnimationMode});
                            // console.log('moveCamera - end', this.mainView?.viewData?.camera)
                            this.checkScaleTimer = undefined;
                        }, 500) as unknown as number;
                    }
                }
            }
        })
    }
    onAppViewMounted = (payload:any) =>{
        const {appId, view} = payload
        const container = view.divElement;
        if (!container || !view.focusScenePath) {
            return;
        }
        const viewInfo = this.appViews.get(appId);
        if (viewInfo && viewInfo.displayer) {
            const nodes = container.getElementsByClassName('teaching-aids-plugin-app-view-displayer');
            for (const node of nodes) {
                node.remove();
            }
            this.destroyAppView(payload.appId, true);
            this.control.worker?.destroyViewWorker(appId,true);
        }
        const displayer = new AppViewDisplayerManagerImpl(appId, this.control, BaseTeachingAidsManager.InternalMsgEmitter);
        // const {width, height, dpr} = displayer;
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
        // console.log('ContainerManager - mountAppView', appId, width, height, view.camera, opt)
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
            this.setFocuedViewId(appId);
            this.tmpFocusedViewId = undefined;
        }
    }
    private onAppViewSizeUpdated = async(appId:string) => {
        Promise.resolve().then(() => {
            const view = this.appViews.get(appId);
            if (view && view.viewData) {
                const size = view.viewData.size;
                const cameraOpt = view.cameraOpt;
                if (cameraOpt) {
                    view.displayer.updateSize();
                    view.cameraOpt = ({...cameraOpt,...size});
                }
            }
        })
    }
    private onAppViewCameraUpdated = async(appId:string) => {
        Promise.resolve().then(() => {
            const view = this.appViews.get(appId);
            if (view && view.viewData) {
                const camera = view.viewData.camera;
                const cameraOpt = view.cameraOpt;
                if (cameraOpt) {
                    const scale = camera.scale === Infinity ? 1 : camera.scale;
                    const centerX = camera.centerX || 0;
                    const centerY = camera.centerY || 0;
                    view.cameraOpt = ({...cameraOpt, scale, centerX, centerY});
                }
            }
        })
    }
    private onActiveHotkeyChange(hotkey: keyof HotKeys) {
        this.control.hotkeyManager.onActiveHotkey(hotkey);
    }
}

