/* eslint-disable @typescript-eslint/no-explicit-any */
import { MainViewMultiDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { MainViewDisplayerManager, ViewContainerManager } from "../baseViewContainerManager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { AppViewDisplayerManagerImpl } from "./displayer/appViewDisplayerManager";
import { ECanvasShowType } from "../../core/enum";
export class ViewContainerMultiManager extends ViewContainerManager {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "focuedViewId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "focuedView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onMainViewMounted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (bindMainView) => {
                let checkScaleTimer;
                const container = bindMainView.divElement;
                if (!container || !bindMainView.focusScenePath) {
                    return;
                }
                const displayer = new MainViewMultiDisplayerManager(this.control, BaseTeachingAidsManager.InternalMsgEmitter);
                const { width, height, dpr } = displayer;
                const opt = {
                    dpr,
                    originalPoint: [width / 2, height / 2],
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
                };
                const { scale, ...camera } = bindMainView.camera;
                opt.cameraOpt = {
                    ...opt.cameraOpt,
                    ...camera,
                    scale: scale === Infinity ? 1 : scale
                };
                this.focuedViewId = MainViewMultiDisplayerManager.viewId;
                // console.log('ContainerManager - bindMainView', bindMainView, opt, bindMainView.focusScenePath)
                this.createMianView({
                    id: MainViewMultiDisplayerManager.viewId,
                    container,
                    displayer,
                    focusScenePath: bindMainView.focusScenePath,
                    cameraOpt: opt.cameraOpt,
                    viewData: bindMainView
                });
                this.focuedView = this.mainView;
                displayer.createMainViewDisplayer(container);
                // console.log('ContainerManager - bindMainView', bindMainView.size, bindMainView.camera, opt)
                bindMainView.callbacks.on('onSizeUpdated', (size) => {
                    // console.log('bindMainView-size', size)
                    if (this.mainView) {
                        const cameraOpt = this.mainView.cameraOpt;
                        if (cameraOpt) {
                            // console.log('onSizeUpdated', size)
                            this.mainView.displayer.updateSize();
                            this.mainView.cameraOpt = ({ ...cameraOpt, ...size });
                        }
                    }
                });
                bindMainView.callbacks.on('onCameraUpdated', (camera) => {
                    // console.log('bindMainView-onCameraUpdated', camera)
                    if (this.mainView) {
                        const cameraOpt = this.mainView.cameraOpt;
                        if (cameraOpt) {
                            const scale = camera.scale === Infinity ? 1 : camera.scale;
                            const centerX = camera.centerX || 0;
                            const centerY = camera.centerY || 0;
                            this.mainView.cameraOpt = ({ ...cameraOpt, scale, centerX, centerY });
                            if (checkScaleTimer && camera.scale == Infinity) {
                                clearTimeout(checkScaleTimer);
                                checkScaleTimer = undefined;
                            }
                            if (!checkScaleTimer && camera.scale === Infinity && this.mainView.viewData && this.mainView.viewData.camera.scale === Infinity) {
                                checkScaleTimer = setTimeout(() => {
                                    this.mainView?.viewData?.moveCamera({ scale, centerX, centerY, animationMode: 'immediately' });
                                    // console.log('moveCamera - end', this.mainView?.viewData?.camera)
                                    checkScaleTimer = undefined;
                                }, 500);
                            }
                        }
                    }
                });
            }
        });
        Object.defineProperty(this, "onAppViewMounted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (payload) => {
                const { appId, view } = payload;
                const container = view.divElement;
                if (!container || !view.focusScenePath) {
                    return;
                }
                const displayer = new AppViewDisplayerManagerImpl(appId, this.control, BaseTeachingAidsManager.InternalMsgEmitter);
                // const {width, height, dpr} = displayer;
                const width = view.size.width || displayer.width;
                const height = view.size.height || displayer.height;
                const dpr = displayer.dpr;
                const opt = {
                    dpr,
                    originalPoint: [width / 2, height / 2],
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
                };
                // console.log('ContainerManager - mountAppView', appId, width, height, view.camera, opt)
                this.createAppView({
                    id: appId,
                    container,
                    displayer,
                    cameraOpt: opt.cameraOpt,
                    focusScenePath: view.focusScenePath,
                    viewData: view
                });
                displayer.createAppViewDisplayer(appId, container);
                // displayer.reflashContainerOffset();
                view.callbacks.on('onSizeUpdated', (size) => {
                    // console.log('ContainerManager - bindAppView-size',size)
                    const view = this.appViews.get(appId);
                    if (view) {
                        const cameraOpt = view.cameraOpt;
                        if (cameraOpt) {
                            view.displayer.updateSize();
                            view.cameraOpt = ({ ...cameraOpt, ...size });
                        }
                    }
                });
                view.callbacks.on('onCameraUpdated', (camera) => {
                    // console.log('ContainerManager - bindAppView-onCameraUpdated', appId, camera)
                    const view = this.appViews.get(appId);
                    if (view) {
                        const cameraOpt = view.cameraOpt;
                        if (cameraOpt) {
                            const scale = camera.scale === Infinity ? 1 : camera.scale;
                            const centerX = camera.centerX || 0;
                            const centerY = camera.centerY || 0;
                            view.cameraOpt = ({ ...cameraOpt, scale, centerX, centerY });
                        }
                    }
                });
            }
        });
        this.control = props.control;
        // this.listenerExternalManager();
    }
    mountView(viewId) {
        const viewInfo = this.getView(viewId);
        if (viewInfo) {
            const { width, height, dpr } = viewInfo.displayer;
            const opt = {
                dpr,
                originalPoint: [width / 2, height / 2],
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
            };
            if (viewInfo.viewData) {
                const { scale, ...camera } = viewInfo.viewData.camera;
                opt.cameraOpt = {
                    ...opt.cameraOpt,
                    ...camera,
                    scale: scale === Infinity ? 1 : scale
                };
            }
            // console.log('mountView', viewId, opt, viewInfo.displayer.containerOffset)
            if (viewId === this.mainView?.id) {
                this.control.activeWorker();
            }
            this.control.worker?.createViewWorker(viewId, opt);
            if (viewInfo.focusScenePath) {
                // console.log('pullServiceData', viewId, viewInfo.focusScenePath)
                this.control.worker.pullServiceData(viewId, viewInfo.focusScenePath);
            }
        }
    }
    setFocuedViewCameraOpt(cameraState) {
        if (this.focuedView) {
            this.focuedView.cameraOpt = cameraState;
        }
    }
    listenerWindowManager(windowManager) {
        // console.log('listenerWindowManager')
        windowManager.emitter.on("boxStateChange", (state) => {
            if (state !== "minimized") {
                setTimeout(() => {
                    this.appViews.forEach(view => {
                        // console.log("ContainerManager - boxStateChange1:", view.displayer.containerOffset );
                        view.displayer.reflashContainerOffset();
                        // console.log("ContainerManager - boxStateChange2:", view.displayer.containerOffset );
                    });
                }, 100);
            }
        });
        windowManager.emitter.on("focusedChange", focus => {
            // console.log("ContainerManager focusedChange", focus);
            const focuedViewId = focus || MainViewDisplayerManager.viewId;
            if (this.focuedViewId !== focuedViewId) {
                const view = this.getView(focuedViewId);
                if (view) {
                    view.displayer.reflashContainerOffset();
                    this.focuedView = view;
                    this.focuedViewId = focuedViewId;
                }
            }
        });
        windowManager.emitter.on("mainViewScenePathChange", path => {
            // console.log("ContainerManager mainViewScenePathChange", path);
            if (this.mainView) {
                this.mainView.focusScenePath = path;
            }
        });
        windowManager.emitter.on('onMainViewMounted', this.onMainViewMounted);
        windowManager.emitter.on('onAppViewMounted', this.onAppViewMounted);
        windowManager.emitter.on('onAppSetup', (appId) => {
            // console.log('ContainerManager - onAppSetup', appId)
            const view = this.appViews.get(appId);
            if (view && view.displayer) {
                // console.log('ContainerManager - setupApp', appId, view.viewData?.camera, view.viewData?.size)
                view.displayer.reflashContainerOffset();
            }
        });
        windowManager.emitter.on('onBoxMove', (payload) => {
            // console.log('ContainerManager - onBoxMove', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        });
        windowManager.emitter.on('onBoxResize', (payload) => {
            // console.log('ContainerManager - onBoxResize', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        });
        windowManager.emitter.on('onBoxFocus', (payload) => {
            // console.log('ContainerManager - onBoxFocus', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        });
        windowManager.emitter.on('onBoxClose', (payload) => {
            // console.log('ContainerManager - onBoxClose', payload);
            const view = this.appViews.get(payload.appId);
            if (view) {
                this.control.worker.destroyViewWorker(payload.appId);
                view.displayer.destroy();
                this.appViews.delete(payload.appId);
            }
        });
        windowManager.emitter.on('onBoxStateChange', (payload) => {
            // console.log('ContainerManager - onBoxStateChange', payload);
            const view = this.getView(payload.appId);
            if (view) {
                view.displayer.reflashContainerOffset();
            }
        });
        windowManager.emitter.on('onAppScenePathChange', (payload) => {
            const { appId, view } = payload;
            // console.log('ContainerManager - onAppScenePathChange', appId, view.focusScenePath, view);
            const viewInfo = this.getView(appId);
            if (viewInfo) {
                const scenePath = view.focusScenePath;
                if (scenePath) {
                    viewInfo.focusScenePath = scenePath;
                }
                // console.log('ContainerManager - onScenePathChange', view.focusScenePath)
            }
        });
    }
    // private listenerExternalManager(){
    //     this.control.externalManager.on('bindMainView', (bindMainView: View) => {
    // const container = bindMainView.divElement;
    // if(!container || !bindMainView.focusScenePath){
    //     return;
    // }
    // const displayer = new MainViewMultiDisplayerManager(this.control, BaseTeachingAidsManager.InternalMsgEmitter);
    // // console.log('ContainerManager - bindMainView', mainViewContainer)
    // const {width, height, dpr} = displayer;
    // const opt = {
    //     dpr,
    //     originalPoint: [width/2, height/2],
    //     offscreenCanvasOpt: {
    //         ...ViewContainerMultiManager.defaultScreenCanvasOpt,
    //         width,
    //         height,
    //     },
    //     layerOpt: {
    //         ...ViewContainerMultiManager.defaultLayerOpt,
    //         width,
    //         height,
    //     },
    //     cameraOpt: {
    //         ...ViewContainerMultiManager.defaultCameraOpt,
    //         width,
    //         height,
    //     }
    // }  as ViewWorkerOptions;
    // this.focuedViewId = MainViewMultiDisplayerManager.viewId;
    // // console.log('ContainerManager - bindMainView', opt)
    // this.createMianView({
    //     id: MainViewMultiDisplayerManager.viewId,
    //     container,
    //     displayer,
    //     focusScenePath: bindMainView.focusScenePath,
    //     cameraOpt: opt.cameraOpt,
    //     viewData: bindMainView
    // })
    // this.focuedView = this.mainView;
    // displayer.createMainViewDisplayer(container);
    // bindMainView.callbacks.on('onSizeUpdated',(size:Size)=>{
    //     // console.log('bindMainView-size', size)
    //     if (this.mainView) {
    //         const cameraOpt = this.mainView.cameraOpt;
    //         if (cameraOpt) {
    //             // console.log('onSizeUpdated', size)
    //             this.mainView.displayer.updateSize();
    //             this.mainView.cameraOpt = ({...cameraOpt,...size});
    //         }
    //     }
    // })
    // bindMainView.callbacks.on('onCameraUpdated',(camera:Camera)=>{
    //     // console.log('bindMainView-onCameraUpdated', camera)
    //     if (this.mainView) {
    //         const cameraOpt = this.mainView.cameraOpt;
    //         if (cameraOpt) {
    //             const scale = camera.scale === Infinity ? 1 : camera.scale;
    //             const centerX = camera.centerX || 0;
    //             const centerY = camera.centerY || 0;
    //             // console.log('onCameraUpdated', camera.scale === Infinity ? 1 : camera.scale,  {...cameraOpt,...camera, scale: Number.isFinite(camera.scale) && 1 || camera.scale})
    //             this.mainView.cameraOpt = ({...cameraOpt, scale, centerX, centerY});
    //         }
    //     }
    // })
    //     })
    //     this.control.externalManager.on('mountAppView', (viewId:string, bindAppView: View) => {
    //         const container = bindAppView.divElement;
    //         if (!container || !bindAppView.focusScenePath) {
    //             return;
    //         }
    //         const displayer = new AppViewDisplayerManagerImpl(viewId, this.control, BaseTeachingAidsManager.InternalMsgEmitter);
    //         // console.log('ContainerManager - mountAppView', viewId, bindAppView.size, bindAppView.camera)
    //         const {width, height, dpr} = displayer;
    //         const opt = {
    //             dpr,
    //             originalPoint: [width/2, height/2],
    //             offscreenCanvasOpt: {
    //                 ...ViewContainerMultiManager.defaultScreenCanvasOpt,
    //                 width,
    //                 height,
    //             },
    //             layerOpt: {
    //                 ...ViewContainerMultiManager.defaultLayerOpt,
    //                 width,
    //                 height,
    //             },
    //             cameraOpt: {
    //                 ...ViewContainerMultiManager.defaultCameraOpt,
    //                 width,
    //                 height,
    //             }
    //         }  as ViewWorkerOptions;
    //         // console.log('ContainerManager - mountAppView--1', bindAppView)
    //         this.createAppView({
    //             id: viewId,
    //             container,
    //             displayer,
    //             cameraOpt: opt.cameraOpt,
    //             focusScenePath: bindAppView.focusScenePath,
    //             viewData: bindAppView
    //         })
    //         displayer.createAppViewDisplayer(viewId, container);
    //         bindAppView.callbacks.on('onSizeUpdated',(size:Size)=>{
    //             // console.log('ContainerManager - bindAppView-size',viewId,size)
    //             const view = this.appViews.get(viewId);
    //             if (view) {
    //                 const cameraOpt = view.cameraOpt;
    //                 if (cameraOpt) {
    //                     view.displayer.updateSize();
    //                     view.cameraOpt = ({...cameraOpt,...size});
    //                 }
    //             }
    //         })
    //         bindAppView.callbacks.on('onCameraUpdated',(camera:Camera)=>{
    //             // console.log('ContainerManager - bindAppView-onCameraUpdated', viewId, bindAppView.camera, camera)
    //             const view = this.appViews.get(viewId);
    //             if (view) {
    //                 const cameraOpt = view.cameraOpt;
    //                 if (cameraOpt) {
    //                     const scale = camera.scale === Infinity ? 1 : camera.scale;
    //                     const centerX = camera.centerX || 0;
    //                     const centerY = camera.centerY || 0;
    //                     view.cameraOpt = ({...cameraOpt, scale, centerX, centerY});
    //                 }
    //             }
    //         })
    //     })
    //     this.control.externalManager.on('setupApp', (appId:string) => {
    //         // console.log('ContainerManager - setupApp', appId, this.appViews.size)
    //         const view = this.appViews.get(appId);
    //         if (view && view.displayer) {
    //             // console.log('ContainerManager - setupApp', appId, view.viewData?.camera, view.viewData?.size)
    //             view.displayer.reflashContainerOffset();
    //         }    
    //     })
    //     this.control.externalManager.on('onBoxMove', (payload:any) => {
    //         // console.log('ContainerManager - onBoxMove', payload);
    //         const view = this.getView(payload.appId);
    //         if (view) {
    //             view.displayer.reflashContainerOffset();
    //         }
    //     })
    //     this.control.externalManager.on('onBoxResize', (payload:any) => {
    //         // console.log('ContainerManager - onBoxResize', payload);
    //         const view = this.getView(payload.appId);
    //         if (view) {
    //             view.displayer.reflashContainerOffset();
    //         }
    //     })
    //     this.control.externalManager.on('onBoxFocus', (payload:any) => {
    //         // console.log('ContainerManager - onBoxFocus', payload);
    //         const view = this.getView(payload.appId);
    //         if (view) {
    //             view.displayer.reflashContainerOffset();
    //         }
    //     })
    //     this.control.externalManager.on('onBoxClose', (payload:any) => {
    //         // console.log('ContainerManager - onBoxClose', payload);
    //         const view = this.appViews.get(payload.appId);
    //         if (view) {
    //             this.control.worker.destroyViewWorker(payload.appId);
    //             view.displayer.destroy();
    //             this.appViews.delete(payload.appId);
    //         }
    //     })
    //     this.control.externalManager.on('onBoxStateChange', (payload:any) => {
    //         console.log('ContainerManager - onBoxStateChange', payload);
    //         const view = this.getView(payload.appId);
    //         if (view) {
    //             view.displayer.reflashContainerOffset();
    //         }
    //     })
    //     this.control.externalManager.on('onAppScenePathChange', (viewId:string, viewData:View) => {
    //         console.log('ContainerManager - onAppScenePathChange', viewId, viewData.focusScenePath, viewData);
    //         const view = this.getView(viewId);
    //         if (view) {
    //             const scenePath = viewData.focusScenePath;
    //             if (scenePath) {
    //                 view.focusScenePath = scenePath;
    //             }
    //             // console.log('ContainerManager - onScenePathChange', view.focusScenePath)
    //         }
    //     })
    // }
    transformToOriginPoint(p, viewId) {
        // const view = this.getView(viewId);
        // if (view?.viewData) {
        //     const _p = view.viewData.convertToPointOnScreen(p[0],p[1]);
        //     console.log('transformToOriginPoint',_p, p, this.mainView?.displayer.containerOffset)
        //     return [_p.x,_p.y];
        // }
        const view = this.getView(viewId);
        if (view && view.cameraOpt && view?.viewData) {
            const point = [p[0], p[1]];
            const { scale, centerX, centerY, width, height } = view.cameraOpt;
            point[0] = (p[0] - centerX) * scale + width / 2;
            point[1] = (p[1] - centerY) * scale + height / 2;
            const _p = view.viewData.convertToPointOnScreen(p[0], p[1]);
            // console.log('transformToOriginPoint', point, _p, view.cameraOpt)
            return [_p.x, _p.y];
        }
        return p;
    }
    transformToScenePoint(p, viewId) {
        const view = this.getView(viewId);
        // console.log('transformToScenePoint ---1', p, this.mainView?.displayer.containerOffset)
        // if (view?.viewData) {
        //     const _p = view.viewData.convertToPointInWorld({x:p[0],y:p[1]});
        //     // console.log('transformToScenePoint ---2',_p )
        //     // return [_p.x,_p.y];
        // }
        // const view = this.getView(viewId);
        if (view && view?.viewData) {
            // const point:[number,number] = [p[0],p[1]];
            // const {scale, centerX, centerY, width, height} = view.cameraOpt;
            // point[0] = (p[0] - width / 2) / scale + centerX;
            // point[1] = (p[1] - height / 2) / scale + centerY;
            const _p = view.viewData.convertToPointInWorld({ x: p[0], y: p[1] });
            // console.log('transformToScenePoint', point, _p, view.cameraOpt)
            return [_p.x, _p.y];
        }
        return p;
    }
    render(renderData) {
        for (const data of renderData) {
            const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas, offset, viewId } = data;
            const displayer = this.getView(viewId)?.displayer;
            if (displayer && rect) {
                const { dpr, canvasBgRef, canvasFloatRef, floatBarCanvasRef } = displayer;
                const w = rect.w * dpr;
                const h = rect.h * dpr;
                const x = rect.x * dpr;
                const y = rect.y * dpr;
                if (isClear) {
                    if (clearCanvas === ECanvasShowType.Selector) {
                        floatBarCanvasRef.current?.getContext('2d')?.clearRect(0, 0, w, h);
                    }
                    else {
                        const removeCtx = clearCanvas === ECanvasShowType.Float ? canvasFloatRef.current?.getContext('2d') : canvasBgRef.current?.getContext('2d');
                        removeCtx?.clearRect(x, y, w, h);
                    }
                }
                if (drawCanvas && imageBitmap) {
                    if (drawCanvas === ECanvasShowType.Selector) {
                        const cx = (offset?.x || 0) * dpr;
                        const cy = (offset?.y || 0) * dpr;
                        floatBarCanvasRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, cx, cy, w, h);
                    }
                    else {
                        const ctx = drawCanvas === ECanvasShowType.Float ? canvasFloatRef.current?.getContext('2d') : canvasBgRef.current?.getContext('2d');
                        ctx?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                    }
                }
                if (isUnClose) {
                    return;
                }
                imageBitmap?.close();
            }
        }
    }
}
