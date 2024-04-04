import { MainViewDisplayerManager, ViewContainerManager } from "../baseViewContainerManager";
import { MainViewSingleDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { InternalMsgEmitterType } from "../types";
import { ECanvasShowType } from "../../core/enum";
export class ViewContainerSingleManager extends ViewContainerManager {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "focuedViewId", {
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
        Object.defineProperty(this, "focuedView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.control = props.control;
        this.listener();
    }
    listener() {
        this.internalMsgEmitter.on(InternalMsgEmitterType.BindMainView, (mainView) => {
            // console.log('ContainerManager - bindMainView', mainView)
            const displayer = new MainViewSingleDisplayerManager(this.control, BaseTeachingAidsManager.InternalMsgEmitter);
            this.focuedViewId = MainViewDisplayerManager.viewId;
            const { width, height, dpr } = displayer;
            const opt = {
                dpr,
                originalPoint: [width / 2, height / 2],
                offscreenCanvasOpt: {
                    ...ViewContainerSingleManager.defaultScreenCanvasOpt,
                    width,
                    height,
                },
                layerOpt: {
                    ...ViewContainerSingleManager.defaultLayerOpt,
                    width,
                    height,
                },
                cameraOpt: {
                    ...ViewContainerSingleManager.defaultCameraOpt,
                    width,
                    height,
                }
            };
            const viewData = this.control.room.mainView;
            const { scale, ...camera } = viewData.camera;
            opt.cameraOpt = {
                ...opt.cameraOpt,
                ...camera,
                scale: scale === Infinity ? 1 : scale
            };
            this.createMianView({
                id: MainViewDisplayerManager.viewId,
                displayer: displayer,
                focusScenePath: viewData.focusScenePath || viewData.scenePath,
                cameraOpt: opt.cameraOpt,
                viewData,
            });
            this.focuedView = this.mainView;
            displayer.createMainViewDisplayer(mainView);
        });
    }
    mountView(viewId) {
        // console.log('ContainerManager - mountView-1', viewId);
        const viewInfo = this.getView(viewId);
        if (viewInfo) {
            const { width, height, dpr } = viewInfo.displayer;
            const opt = {
                dpr,
                originalPoint: [width / 2, height / 2],
                offscreenCanvasOpt: {
                    ...ViewContainerSingleManager.defaultScreenCanvasOpt,
                    width,
                    height,
                },
                layerOpt: {
                    ...ViewContainerSingleManager.defaultLayerOpt,
                    width,
                    height,
                },
                cameraOpt: {
                    ...ViewContainerSingleManager.defaultCameraOpt,
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
            this.control.worker?.createViewWorker(viewId, opt);
            this.control.activeWorker();
        }
    }
    setFocuedViewCameraOpt(cameraState) {
        if (this.focuedView) {
            this.focuedView.cameraOpt = cameraState;
        }
    }
    transformToOriginPoint(p, viewId) {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointOnScreen(p[0], p[1]);
            return [_p.x, _p.y];
        }
        return p;
    }
    transformToScenePoint(p, viewId) {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointInWorld({ x: p[0], y: p[1] });
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
