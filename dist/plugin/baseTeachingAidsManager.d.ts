/// <reference types="lodash" />
import EventEmitter2 from "eventemitter2";
import { MemberState, TeachingAidsPluginLike, TeachingAidsPluginOptions } from "./types";
import { Collector } from "../collector";
import { RoomMemberManager } from "../members";
import { TextEditorManager } from "../component/textEditor";
import type { Camera, Displayer, DisplayerCallbacks, Player, Rectangle, Room, RoomMember } from "white-web-sdk";
import { CursorManager } from "../cursors";
import { ViewContainerManager } from "./baseViewContainerManager";
import { MasterControlForWorker } from "../core/mainEngine";
import { EToolsKey } from "../core/enum";
import { BaseShapeOptions } from "../core/tools/base";
import { ICameraOpt } from "../core/types";
import { HotkeyManager } from "../hotkey";
export interface BaseTeachingAidsManagerProps {
    displayer: Displayer<DisplayerCallbacks>;
    plugin?: TeachingAidsPluginLike;
    options?: TeachingAidsPluginOptions;
}
/** 插件管理器 */
export declare abstract class BaseTeachingAidsManager {
    static InternalMsgEmitter: EventEmitter2;
    plugin?: TeachingAidsPluginLike;
    room?: Room;
    play?: Player;
    collector?: Collector;
    readonly hotkeyManager: HotkeyManager;
    readonly pluginOptions?: TeachingAidsPluginOptions;
    readonly roomMember: RoomMemberManager;
    readonly cursor: CursorManager;
    readonly textEditorManager: TextEditorManager;
    readonly worker: MasterControlForWorker;
    abstract readonly viewContainerManager: ViewContainerManager;
    constructor(params: BaseTeachingAidsManagerProps);
    bindPlugin(plugin: TeachingAidsPluginLike): void;
    /** 激活 plugin */
    abstract activePlugin(): void;
    /** 初始化 */
    abstract init(): void;
    /** 激活worker */
    abstract activeWorker(): void;
    /** 销毁 */
    destroy(): void;
    /** 清空当前获焦路径下的所有内容 */
    cleanCurrentScene(): void;
    /** 监听读写状态变更 */
    onWritableChange(isWritable: boolean): void;
    /** 监听路径变化 */
    onSceneChange: (scenePath: string, viewId: string) => void;
    /** 监听房间成员变化 */
    onRoomMembersChange: (roomMembers: readonly RoomMember[]) => void;
    /** 监听房间教具变更 */
    onMemberChange: import("lodash").DebouncedFunc<(memberState: MemberState) => void>;
    /** 获取当前工具key */
    protected getToolsKey(memberState: MemberState): EToolsKey.Pencil | EToolsKey.Eraser | EToolsKey.Selector | EToolsKey.Clicker | EToolsKey.Arrow | EToolsKey.LaserPen | EToolsKey.Text | EToolsKey.Straight | EToolsKey.Rectangle | EToolsKey.Ellipse | EToolsKey.Star | EToolsKey.Polygon | EToolsKey.SpeechBalloon;
    /** 获取当前工具默认配置 */
    protected getToolsOpt(toolsKey: EToolsKey, memberState: MemberState): {
        toolsType: EToolsKey;
        toolsOpt: BaseShapeOptions;
    };
    /** 激活当前view容器*/
    protected effectViewContainer(toolsKey: EToolsKey): void;
    internalSceneChange: (viewId: string, scenePath: string) => void;
    internalCameraChange: (viewId: string, cameraOpt: ICameraOpt) => void;
    /** 异步获取指定路径下绘制内容的区域大小 */
    getBoundingRect(scenePath: string): Promise<Rectangle | undefined>;
    /** 异步获取指定路径下的的快照并绘制到指定的画布上 */
    screenshotToCanvas(context: CanvasRenderingContext2D, scenePath: string, width?: number | undefined, height?: number | undefined, camera?: Camera | undefined): Promise<void>;
    /** 异步获取指定路径下的缩略图 */
    scenePreview(scenePath: string, img: HTMLImageElement): Promise<void>;
}
