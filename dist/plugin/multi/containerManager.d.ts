import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import type { CameraState } from "white-web-sdk";
import { BaseSubWorkModuleProps } from "../types";
import { TeachingAidsMultiManager } from "./teachingAidsMultiManager";
import { IMainMessageRenderData } from "../../core/types";
import { WindowManager } from "@netless/window-manager";
export declare class ViewContainerMultiManager extends ViewContainerManager {
    focuedViewId?: string;
    focuedView?: ViewInfo;
    control: TeachingAidsMultiManager;
    constructor(props: BaseSubWorkModuleProps);
    mountView(viewId: string): void;
    setFocuedViewCameraOpt(cameraState: CameraState): void;
    listenerWindowManager(windowManager: WindowManager): void;
    transformToOriginPoint(p: [number, number], viewId: string): [number, number];
    transformToScenePoint(p: [number, number], viewId: string): [number, number];
    render(renderData: IMainMessageRenderData[]): void;
    private onMainViewMounted;
    private onAppViewMounted;
}