import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import type { View } from "../types";
import { BaseSubWorkModuleProps } from "../types";
import { ApplianceMultiManager } from "./applianceMultiManager";
import type { WindowManager } from './applianceMultiManager';
export declare class ViewContainerMultiManager extends ViewContainerManager {
    focuedViewId?: string;
    focuedView?: ViewInfo;
    control: ApplianceMultiManager;
    /** 针对windowmanager的focusedChange先于onAppViewMounted*/
    tmpFocusedViewId?: string;
    private checkScaleTimer?;
    constructor(props: BaseSubWorkModuleProps);
    mountView(viewId: string): Promise<void>;
    listenerWindowManager(windowManager: WindowManager): void;
    private onMainViewRelease;
    private mainViewDestroy;
    onMainViewMounted: (bindMainView: View) => void;
    private onMainViewSizeUpdated;
    private onMainViewCameraUpdated;
    private updateMainViewCamera;
    onAppViewMounted: (payload: any) => Promise<void>;
    private onAppViewSizeUpdated;
    private onAppViewCameraUpdated;
    private updateAppCamera;
    private onActiveHotkeyChange;
}
