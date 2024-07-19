import type { AnimationMode, WindowManager } from "@netless/window-manager";
import { BaseApplianceManager, BaseApplianceManagerProps } from "../baseApplianceManager";
import { ViewContainerMultiManager } from "./containerManager";
export type { AnimationMode, WindowManager };
export declare class ApplianceMultiManager extends BaseApplianceManager {
    windowManager?: WindowManager;
    viewContainerManager: ViewContainerMultiManager;
    constructor(params: BaseApplianceManagerProps);
    init(): void;
    destroy(): void;
    activePlugin(): void;
    activeWorker(): Promise<void>;
    setWindowManager(windowManager: WindowManager): void;
}
