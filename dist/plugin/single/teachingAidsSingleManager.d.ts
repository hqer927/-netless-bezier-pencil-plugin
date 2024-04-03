/// <reference types="lodash" />
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { ViewContainerManager } from "../baseViewContainerManager";
import { TeachingAidsPluginOptions } from "../types";
import type { CameraState } from "white-web-sdk";
import type { TeachingAidsPlugin } from "../teachingAidsPlugin";
export declare class TeachingAidsSingleManager extends BaseTeachingAidsManager {
    viewContainerManager: ViewContainerManager;
    constructor(plugin: TeachingAidsPlugin, options?: TeachingAidsPluginOptions);
    init(): void;
    private displayStateListener;
    activeWorker(): void;
    onCameraChange: import("lodash").DebouncedFunc<(cameraState: CameraState) => void>;
}
