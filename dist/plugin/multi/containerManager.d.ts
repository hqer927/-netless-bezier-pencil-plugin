import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import type { View } from "../types";
import { BaseSubWorkModuleProps } from "../types";
import { TeachingAidsMultiManager } from "./teachingAidsMultiManager";
import type { WindowManager } from './teachingAidsMultiManager';
export declare class ViewContainerMultiManager extends ViewContainerManager {
    focuedViewId?: string;
    focuedView?: ViewInfo;
    control: TeachingAidsMultiManager;
    /** 针对windowmanager的focusedChange先于onAppViewMounted*/
    tmpFocusedViewId?: string;
    private checkScaleTimer?;
    constructor(props: BaseSubWorkModuleProps);
    mountView(viewId: string): void;
    listenerWindowManager(windowManager: WindowManager): void;
    private onMainViewRelease;
    onMainViewMounted: (bindMainView: View) => void;
    private onMainViewSizeUpdated;
    private onMainViewCameraUpdated;
    onAppViewMounted: (payload: any) => void;
    private onAppViewSizeUpdated;
    private onAppViewCameraUpdated;
    private onActiveHotkeyChange;
}
