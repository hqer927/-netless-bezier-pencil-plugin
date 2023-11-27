import type { Room } from "white-web-sdk";
import { InvisiblePlugin, InvisiblePluginContext, Displayer } from "white-web-sdk";
import { BezierPencilPluginAttributes, CanvasOpt, SyncOpt } from "./types";
import type { ReadonlyVal } from "value-enhancer";
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
    static getInstance(displayer: Room, adaptor?: BezierPencilAdaptor): Promise<Room>;
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(displayer: Room): Room;
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
