/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
import type { CameraState } from "white-web-sdk";
import { IMainMessageRenderData, ViewWorkerOptions } from "../../core/types";
import { MainViewDisplayerManager, ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { TeachingAidsSingleManager } from "./teachingAidsSingleManager";
import { MainViewSingleDisplayerManager } from "./displayer/mainViewDisplayerManager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { BaseSubWorkModuleProps } from "../types";
import { ECanvasShowType } from "../../core/enum";

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
        console.log('ContainerManager - bindMainView', viewData)
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
    setFocuedViewCameraOpt(cameraState: CameraState){
        if (this.focuedView) {
            this.focuedView.cameraOpt = cameraState;
        }   
    }
    transformToOriginPoint(p: [number, number], viewId: string): [number, number] {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointOnScreen(p[0],p[1]);
            return [_p.x,_p.y];
        }
        return p
    }
    transformToScenePoint(p: [number, number], viewId: string): [number, number] {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointInWorld({x:p[0],y:p[1]});
            return [_p.x,_p.y];
        }
        return p
    }
    render(renderData: IMainMessageRenderData[]): void {
        for (const data of renderData) {
            const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas, offset, viewId} = data;
            const displayer = this.getView(viewId)?.displayer;
            if (displayer && rect) {
                const {dpr,canvasBgRef,canvasFloatRef,floatBarCanvasRef} = displayer;
                const w = rect.w * dpr;
                const h = rect.h * dpr;
                const x = rect.x * dpr;
                const y = rect.y * dpr;
                if (isClear) {
                    if (clearCanvas === ECanvasShowType.Selector) {
                        floatBarCanvasRef.current?.getContext('2d')?.clearRect(0, 0, w, h);
                    } else {
                        const removeCtx = clearCanvas === ECanvasShowType.Float ? canvasFloatRef.current?.getContext('2d') : canvasBgRef.current?.getContext('2d');
                        removeCtx?.clearRect(x, y, w, h);
                    }
                }
                if (drawCanvas && imageBitmap) {
                    if (drawCanvas === ECanvasShowType.Selector) {
                        const cx = (offset?.x || 0) * dpr;
                        const cy = (offset?.y || 0) * dpr;
                        floatBarCanvasRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, cx, cy, w, h);
                    } else {
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

