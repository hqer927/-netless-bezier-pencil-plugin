import type { Callbacks, Camera, Rectangle, RenderEngine } from "white-web-sdk";
import { InvisiblePlugin, Displayer } from "white-web-sdk";
import { BezierPencilPluginAttributes, CanvasOpt, SyncOpt } from "./types";
import { WindowManager } from "@netless/window-manager";
import { CursorTool } from "@netless/cursor-tool";
export interface DisplayerForPlugin {
    readonly displayer: Displayer;
    /**
     * 获取某个场景里包含所有元素的矩形
     */
    getBoundingRectAsync(scenePath: string): Promise<Rectangle | undefined>;
    /**
     * 生成屏幕快照，并写入指定的 CanvasRenderingContext2D 对象中
     */
    screenshotToCanvasAsync(context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number): Promise<void>;
    /**
     * 生成场景预览
     * @param  scenePath 想要获取预览内容的场景的场景路径
     * @param  div 想要展示预览内容的 div
     * @param  width 白板的缩放宽度：将当前白板内容，缩小到真实像素宽度。2.3.8 后，该参数为可选参数，如果不填，则默认为展示内容 div 的宽度。
     * @param  height 白板的缩放高度：将当前白板的内容，缩小到真实像素高度。2.3.8 后，该参数为可选参数，如果不填，则默认为展示内容 div 的高度。
     */
    scenePreviewAsync(scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine): Promise<void>;
    callbacksOn: Callbacks<any>["on"];
    callbacksOnce: Callbacks<any>["once"];
    callbacksOff: Callbacks<any>["off"];
    undo(): number;
    redo(): number;
    cleanCurrentScene(retainPpt?: boolean): void;
    callbacks: Callbacks<any>;
}
export type Logger = {
    readonly info: (...messages: any[]) => void;
    readonly warn: (...messages: any[]) => void;
    readonly error: (...messages: any[]) => void;
};
export type BezierPencilPluginOptions = {
    syncOpt?: SyncOpt;
    canvasOpt?: CanvasOpt;
};
type BezierPencilAdaptor = {
    useMultiViews?: boolean;
    logger?: Logger;
    options?: BezierPencilPluginOptions;
    cursorAdapter?: CursorTool;
};
export declare class BezierPencilPlugin extends InvisiblePlugin<BezierPencilPluginAttributes, any> {
    static readonly kind: string;
    static useMultiViews: boolean;
    static cursorAdapter?: CursorTool;
    private static currentManager;
    static logger: Logger;
    static options?: BezierPencilPluginOptions;
    static getInstance(displayer: Displayer | WindowManager, adaptor?: BezierPencilAdaptor): Promise<DisplayerForPlugin>;
    static onCreate(plugin: InvisiblePlugin<BezierPencilPluginAttributes, any>): void;
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(): void;
    private get isReplay();
    private get callbackName();
    private init;
    private onPhaseChanged;
    private updateRoomWritable;
    private roomStateChangeListener;
    private createCurrentManager;
    destroy(): void;
}
export {};
