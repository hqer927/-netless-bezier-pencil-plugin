/// <reference types="lodash" />
import { BezierPencilPlugin, BezierPencilPluginOptions } from "./bezierPencilPlugin";
import { MemberState } from "./types";
import { CameraState, SceneState } from "white-web-sdk";
export declare class BezierPencilManager {
    private plugin;
    private pluginOptions?;
    private collector?;
    private worker?;
    private room?;
    constructor(plugin: BezierPencilPlugin, options?: BezierPencilPluginOptions);
    init(): void;
    cleanCurrentScene(): void;
    destroy(): void;
    private displayStateListener;
    onCameraChange: import("lodash").DebouncedFunc<(cameraState: CameraState) => void>;
    onSceneChange: import("lodash").DebouncedFunc<(sceneState: SceneState) => void>;
    onMemberChange: import("lodash").DebouncedFunc<(memberState: MemberState) => void>;
    private linstenerSelector;
    onWritableChange(isWritable: boolean): void;
    private onMountDisplayer;
    private onUnMountDisplayer;
}
