import { WindowManager } from "@netless/window-manager";
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { TeachingAidsPluginOptions } from "../types";
import { ViewContainerMultiManager } from "./containerManager";
import type { TeachingAidsPlugin } from "../teachingAidsPlugin";
export declare class TeachingAidsMultiManager extends BaseTeachingAidsManager {
    windowManager?: WindowManager;
    viewContainerManager: ViewContainerMultiManager;
    constructor(plugin: TeachingAidsPlugin, options?: TeachingAidsPluginOptions);
    init(): void;
    destroy(): void;
    activeWorker(): void;
    setWindowManager(windowManager: WindowManager): void;
}
