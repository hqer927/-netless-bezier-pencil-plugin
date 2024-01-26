/// <reference types="lodash" />
import { BezierPencilPlugin, BezierPencilPluginOptions } from "./bezierPencilPlugin";
import { MemberState } from "./types";
import { CameraState, SceneState, Camera } from "white-web-sdk";
import { UndoRedoMethod } from "../undo";
export declare class BezierPencilManager {
    private plugin;
    private pluginOptions?;
    private collector?;
    private worker?;
    private room?;
    private player?;
    commiter?: UndoRedoMethod;
    constructor(plugin: BezierPencilPlugin, options?: BezierPencilPluginOptions);
    init(): void;
    screenshotToCanvas(context: CanvasRenderingContext2D, scenePath: string, width?: number, height?: number, camera?: Camera): Promise<void>;
    scenePreview(scenePath: string, img: HTMLImageElement): Promise<void>;
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
