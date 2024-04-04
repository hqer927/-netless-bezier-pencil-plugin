import { WindowManager } from "@netless/window-manager";
import { InvisiblePlugin, Displayer } from "white-web-sdk";
import { TeachingAidsPluginAttributes, TeachingAidsPluginOptions, DisplayerForPlugin, Logger, TeachingAidsAdaptor } from "./types";
import { CursorTool } from "@netless/cursor-tool";
import { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
import { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";
export declare class TeachingAidsPlugin extends InvisiblePlugin<TeachingAidsPluginAttributes, any> {
    static readonly kind: string;
    static cursorAdapter: CursorTool;
    static remake?: WindowManager;
    static currentManager?: TeachingAidsSingleManager | TeachingAidsMultiManager;
    static logger: Logger;
    static options?: TeachingAidsPluginOptions;
    static getInstance(remake: Displayer | WindowManager, adaptor?: TeachingAidsAdaptor): Promise<DisplayerForPlugin>;
    static onCreate(plugin: InvisiblePlugin<TeachingAidsPluginAttributes, any>): void;
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(): void;
    private get isReplay();
    private get callbackName();
    init(displayer: Displayer, options: TeachingAidsPluginOptions, remake?: WindowManager): void;
    private onPhaseChanged;
    private updateRoomWritable;
    private roomStateChangeListener;
    private createCurrentManager;
    destroy(): void;
}
