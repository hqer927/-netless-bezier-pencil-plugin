/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewWorkerOptions } from "../../core/types";
import { MainViewDisplayerManager, ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { TeachingAidsSingleManager } from "./teachingAidsSingleManager";
import { MainViewSingleDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { BaseSubWorkModuleProps } from "../types";

export class ViewContainerSingleManager extends ViewContainerManager {
    focuedViewId?: string;
    control: TeachingAidsSingleManager;
    focuedView?: ViewInfo;
    constructor(props:BaseSubWorkModuleProps) {
        super(props);
        this.control = props.control as TeachingAidsSingleManager;
    }
    bindMainView() {
        if (!this.control.divMainView) {
            return ;
        }
        const displayer = new MainViewSingleDisplayerManager(this.control, BaseTeachingAidsManager.InternalMsgEmitter);
        this.focuedViewId = MainViewDisplayerManager.viewId;
        const {width, height, dpr} = displayer;
        const opt = {
            dpr,
            originalPoint: [width/2, height/2],
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
        }  as ViewWorkerOptions;
        const viewData = this.control.room  && (this.control.room as any).mainView || (this.control.play && (this.control.play as any).mainView);
        // console.log('ContainerManager - bindMainView', viewData)
        if (viewData) {
            const {scale,...camera} = viewData.camera;
            opt.cameraOpt = {
                ...opt.cameraOpt,
                ...camera,
                scale: scale === Infinity ? 1 : scale
            }
            this.createMianView({
                id: MainViewDisplayerManager.viewId,
                displayer: displayer,
                focusScenePath: viewData.focusScenePath || viewData.scenePath,
                cameraOpt: opt.cameraOpt,
                viewData,
            })
            this.focuedView = this.mainView;
            displayer.createMainViewDisplayer(this.control.divMainView);
        }
    }
    mountView(viewId:string){
        // console.log('ContainerManager - mountView-1', viewId);
        const viewInfo = this.getView(viewId);
        if (viewInfo) {
            const {width, height, dpr} = viewInfo.displayer;
            const opt = {
                dpr,
                originalPoint: [width/2, height/2],
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
            }  as ViewWorkerOptions;
            if (viewInfo.viewData){
                const {scale,...camera} = viewInfo.viewData.camera;
                opt.cameraOpt = {
                    ...opt.cameraOpt,
                    ...camera,
                    scale: scale === Infinity ? 1 : scale
                }
            }
            if (!this.control.worker.isActive) {
                this.control.activeWorker();
            }
            this.control.worker?.createViewWorker(viewId, opt);
            if(viewInfo.focusScenePath && this.control.collector){
                // console.log('pullServiceData---1', viewId, viewInfo.focusScenePath)
                this.control.worker.pullServiceData(viewId,viewInfo.focusScenePath);
            }
        }
    }
}

