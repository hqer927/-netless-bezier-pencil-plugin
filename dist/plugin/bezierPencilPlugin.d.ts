import type { Callbacks, Camera, Player, RenderEngine, Room } from "white-web-sdk";
import { InvisiblePlugin, InvisiblePluginContext, Displayer } from "white-web-sdk";
import { BezierPencilPluginAttributes, CanvasOpt, SyncOpt } from "./types";
import type { ReadonlyVal } from "value-enhancer";
export interface DisplayerForPlugin {
    readonly displayer: Room | Player;
    screenshotToCanvasAsync(context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number): Promise<void>;
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
    logger?: Logger;
    options?: BezierPencilPluginOptions;
};
export declare class BezierPencilPlugin extends InvisiblePlugin<BezierPencilPluginAttributes, any> {
    static readonly kind: string;
    private static currentManager;
    static readonly invisiblePlugins: WeakMap<Displayer<import("white-web-sdk").DisplayerCallbacks>, ReadonlyVal<InvisiblePlugin<any, any> | null>>;
    static logger: Logger;
    static options?: BezierPencilPluginOptions;
    static getInstance(displayer: Room | Player, adaptor?: BezierPencilAdaptor): Promise<DisplayerForPlugin>;
    static onCreate(plugin: InvisiblePlugin<BezierPencilPluginAttributes, any>): void;
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    constructor(context: InvisiblePluginContext);
    private get isReplay();
    private get callbackName();
    private init;
    private onPhaseChanged;
    private updateRoomWritable;
    private roomStateChangeListener;
    private createCurrentManager;
}
export {};
