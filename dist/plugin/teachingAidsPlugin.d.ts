import type { Room } from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
import { InvisiblePlugin, Displayer } from "white-web-sdk";
import { TeachingAidsPluginAttributes, TeachingAidsPluginOptions, DisplayerForPlugin, Logger, TeachingAidsAdaptor, TeachingAidsManagerLike } from "./types";
import { CursorTool } from "@netless/cursor-tool";
export declare class TeachingAidsPlugin extends InvisiblePlugin<TeachingAidsPluginAttributes, any> {
    static readonly kind: string;
    static cursorAdapter?: CursorTool;
    static windowManager?: WindowManager;
    static currentManager?: TeachingAidsManagerLike;
    static logger: Logger;
    static options: TeachingAidsPluginOptions;
    static getInstance(remake: Displayer | WindowManager, adaptor?: TeachingAidsAdaptor): Promise<DisplayerForPlugin>;
    static onCreate(plugin: InvisiblePlugin<TeachingAidsPluginAttributes, any>): void;
    static createTeachingAidsPlugin(d: Room, kind: string): Promise<TeachingAidsPlugin>;
    static createCurrentManager: (displayer: Displayer, options: TeachingAidsPluginOptions, plugin?: TeachingAidsPlugin, remake?: WindowManager) => void;
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(): void;
    private get isReplay();
    private get callbackName();
    init(displayer: Displayer): void;
    private updateRoomWritable;
    private roomStateChangeListener;
    destroy(): void;
}
