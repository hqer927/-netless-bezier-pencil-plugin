import type { CameraState } from "white-web-sdk";
import { IMainMessageRenderData } from "../../core/types";
import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { TeachingAidsSingleManager } from "./teachingAidsSingleManager";
import { BaseSubWorkModuleProps } from "../types";
export declare class ViewContainerSingleManager extends ViewContainerManager {
    focuedViewId?: string;
    control: TeachingAidsSingleManager;
    focuedView?: ViewInfo;
    constructor(props: BaseSubWorkModuleProps);
    private listener;
    mountView(viewId: string): void;
    setFocuedViewCameraOpt(cameraState: CameraState): void;
    transformToOriginPoint(p: [number, number], viewId: string): [number, number];
    transformToScenePoint(p: [number, number], viewId: string): [number, number];
    render(renderData: IMainMessageRenderData[]): void;
}
