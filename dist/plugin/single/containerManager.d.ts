import { ViewContainerManager, ViewInfo } from "../baseViewContainerManager";
import { TeachingAidsSingleManager } from "./teachingAidsSingleManager";
import { BaseSubWorkModuleProps } from "../types";
export declare class ViewContainerSingleManager extends ViewContainerManager {
    focuedViewId?: string;
    control: TeachingAidsSingleManager;
    focuedView?: ViewInfo;
    constructor(props: BaseSubWorkModuleProps);
    bindMainView(): void;
    mountView(viewId: string): void;
}
