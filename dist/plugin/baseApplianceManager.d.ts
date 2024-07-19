/// <reference types="lodash" />
import EventEmitter2 from "eventemitter2";
import { MemberState, AppliancePluginLike, AppliancePluginOptions } from "./types";
import { Collector } from "../collector";
import { RoomMemberManager } from "../members";
import { TextEditorManager } from "../component/textEditor";
import type { Camera, Displayer, DisplayerCallbacks, Player, Rectangle, Room, RoomMember } from "./types";
import { CursorManager } from "../cursors";
import { ViewContainerManager } from "./baseViewContainerManager";
import { MasterControlForWorker } from "../core/mainEngine";
import { EToolsKey } from "../core/enum";
import { BaseShapeOptions } from "../core/tools/base";
import { ICameraOpt } from "../core/types";
import { HotkeyManager } from "../hotkey";
export interface BaseApplianceManagerProps {
    displayer: Displayer<DisplayerCallbacks>;
    plugin?: AppliancePluginLike;
    options: AppliancePluginOptions;
}
/** 插件管理器 */
export declare abstract class BaseApplianceManager {
    static InternalMsgEmitter: EventEmitter2;
    readonly version: string;
    plugin?: AppliancePluginLike;
    room?: Room;
    play?: Player;
    collector?: Collector;
    hasSwitchToSelectorEffect?: boolean;
    snapshootStateMap?: Map<string, unknown>;
    effectResolve?: (value: boolean) => void;
    readonly hotkeyManager: HotkeyManager;
    readonly pluginOptions: AppliancePluginOptions;
    readonly roomMember: RoomMemberManager;
    readonly cursor: CursorManager;
    readonly textEditorManager: TextEditorManager;
    readonly worker: MasterControlForWorker;
    abstract readonly viewContainerManager: ViewContainerManager;
    constructor(params: BaseApplianceManagerProps);
    hasOffscreenCanvas(): boolean;
    bindPlugin(plugin: AppliancePluginLike): void;
    /** 激活 plugin */
    abstract activePlugin(): void;
    /** 初始化 */
    abstract init(): void;
    /** 激活worker */
    abstract activeWorker(): Promise<void>;
    /** 销毁 */
    destroy(): void;
    /** 清空当前获焦路径下的所有内容 */
    cleanCurrentScene(): void;
    /** 监听读写状态变更 */
    onWritableChange(isWritable: boolean): void;
    /** 监听路径变化 */
    onSceneChange: (scenePath: string, viewId: string) => Promise<void>;
    /** 监听房间成员变化 */
    onRoomMembersChange: (roomMembers: readonly RoomMember[]) => void;
    /** 监听房间教具变更 */
    onMemberChange: import("lodash").DebouncedFunc<(memberState: MemberState) => void>;
    /** 获取当前工具key */
    protected getToolsKey(memberState: MemberState): EToolsKey.Pencil | EToolsKey.Eraser | EToolsKey.Selector | EToolsKey.Clicker | EToolsKey.Arrow | EToolsKey.LaserPen | EToolsKey.Text | EToolsKey.Straight | EToolsKey.Rectangle | EToolsKey.Ellipse | EToolsKey.Star | EToolsKey.Polygon | EToolsKey.SpeechBalloon;
    /** 获取当前工具默认配置 */
    protected getToolsOpt(toolsKey: EToolsKey, memberState: MemberState): {
        toolsType: EToolsKey.Clicker;
        toolsOpt: {};
    } | {
        toolsType: EToolsKey.Pencil | EToolsKey.Eraser | EToolsKey.Selector | EToolsKey.Arrow | EToolsKey.Hand | EToolsKey.LaserPen | EToolsKey.Text | EToolsKey.Straight | EToolsKey.Rectangle | EToolsKey.Ellipse | EToolsKey.Star | EToolsKey.Triangle | EToolsKey.Rhombus | EToolsKey.Polygon | EToolsKey.SpeechBalloon | EToolsKey.Image;
        toolsOpt: BaseShapeOptions;
    };
    /** 激活当前view容器*/
    effectViewContainer(toolsKey: EToolsKey): void;
    internalSceneChange: (viewId: string, scenePath: string) => void;
    internalCameraChange: (viewId: string, cameraOpt: ICameraOpt) => void;
    /** 异步获取指定路径下绘制内容的区域大小 */
    getBoundingRect(scenePath: string): Promise<Rectangle | undefined>;
    /** 异步获取指定路径下的的快照并绘制到指定的画布上 */
    screenshotToCanvas(context: CanvasRenderingContext2D, scenePath: string, width?: number, height?: number, camera?: Camera, originX?: number, originY?: number): Promise<void>;
    /** 异步获取指定路径下的缩略图 */
    scenePreview(scenePath: string, img: HTMLImageElement): Promise<void>;
    switchToText(): void;
    /** 切换到选择工具 */
    switchToSelector(): void;
    /** 开始执行副作用 */
    runEffectWork(callback?: () => void): Promise<void>;
    setSnapshootData(): void;
    getSnapshootData(key: string): unknown;
    clearSnapshootData(): void;
    consoleWorkerInfo(): void;
}
