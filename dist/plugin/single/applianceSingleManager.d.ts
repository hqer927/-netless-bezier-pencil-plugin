/// <reference types="lodash" />
import { BaseApplianceManager, BaseApplianceManagerProps } from "../baseApplianceManager";
import type { CameraState } from "../types";
import { ViewContainerSingleManager } from "./containerManager";
export declare class ApplianceSingleManager extends BaseApplianceManager {
    viewContainerManager: ViewContainerSingleManager;
    divMainView?: HTMLDivElement;
    constructor(params: BaseApplianceManagerProps);
    init(): void;
    activePlugin(): void;
    activeWorker(): Promise<void>;
    onCameraChange: import("lodash").DebouncedFunc<(cameraState: CameraState) => void>;
}
