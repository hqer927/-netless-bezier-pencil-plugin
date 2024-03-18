/// <reference types="lodash" />
import { BezierPencilPlugin, BezierPencilPluginOptions } from "../bezierPencilPlugin";
import { MemberState } from "../types";
import { CameraState, SceneState, Camera, Rectangle, RoomMember } from "white-web-sdk";
import { UndoRedoMethod } from "../../undo";
import EventEmitter2 from "eventemitter2";
export declare class BezierPencilManager {
    static InternalMsgEmitter: EventEmitter2;
    private plugin;
    private pluginOptions?;
    private collector?;
    private worker?;
    private room?;
    private cursor?;
    private roomMember;
    private isDelayMount;
    commiter?: UndoRedoMethod;
    constructor(plugin: BezierPencilPlugin, options?: BezierPencilPluginOptions);
    init(): void;
    getBoundingRect(scenePath: string): Promise<Rectangle | undefined>;
    screenshotToCanvas(context: CanvasRenderingContext2D, scenePath: string, width?: number, height?: number, camera?: Camera): Promise<void>;
    scenePreview(scenePath: string, img: HTMLImageElement): Promise<void>;
    cleanCurrentScene(): void;
    destroy(): void;
    private displayStateListener;
    onCameraChange: import("lodash").DebouncedFunc<(cameraState: CameraState) => void>;
    onSceneChange: import("lodash").DebouncedFunc<(sceneState: SceneState) => void>;
    onMemberChange: import("lodash").DebouncedFunc<(memberState: MemberState) => void>;
    onRoomMembersChange: (roomMembers: readonly RoomMember[]) => void;
    private linstenerSelector;
    onWritableChange(isWritable: boolean): void;
    private onMountDisplayer;
    private onUnMountDisplayer;
}
