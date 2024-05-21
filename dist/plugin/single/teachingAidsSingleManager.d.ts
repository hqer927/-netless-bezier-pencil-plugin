/// <reference types="lodash" />
import { BaseTeachingAidsManager, BaseTeachingAidsManagerProps } from "../baseTeachingAidsManager";
import type { CameraState } from "../types";
import { ViewContainerSingleManager } from "./containerManager";
export declare class TeachingAidsSingleManager extends BaseTeachingAidsManager {
    viewContainerManager: ViewContainerSingleManager;
    divMainView?: HTMLDivElement;
    constructor(params: BaseTeachingAidsManagerProps);
    init(): void;
    activePlugin(): void;
    activeWorker(): void;
    onCameraChange: import("lodash").DebouncedFunc<(cameraState: CameraState) => void>;
}
