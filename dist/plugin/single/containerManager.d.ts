import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { ApplianceSingleManager } from "./applianceSingleManager";
import { BaseSubWorkModuleProps } from "../types";
export declare class ViewContainerSingleManager extends ViewContainerManager {
    focuedViewId?: string;
    control: ApplianceSingleManager;
    focuedView?: ViewInfo;
    constructor(props: BaseSubWorkModuleProps);
    bindMainView(): void;
    mountView(viewId: string): Promise<void>;
}
