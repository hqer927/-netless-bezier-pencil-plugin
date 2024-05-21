import { MainViewDisplayerManager, ViewContainerManager } from "../baseViewContainerManager";
import { MainViewSingleDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
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
    }
    bindMainView() {
        if (!this.control.divMainView) {
            return;
        }
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
        const viewData = this.control.room && this.control.room.mainView || (this.control.play && this.control.play.mainView);
        // console.log('ContainerManager - bindMainView', viewData)
        if (viewData) {
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
            displayer.createMainViewDisplayer(this.control.divMainView);
        }
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
            if (!this.control.worker.isActive) {
                this.control.activeWorker();
            }
            this.control.worker?.createViewWorker(viewId, opt);
            if (viewInfo.focusScenePath && this.control.collector) {
                // console.log('pullServiceData---1', viewId, viewInfo.focusScenePath)
                this.control.worker.pullServiceData(viewId, viewInfo.focusScenePath);
            }
        }
    }
}
