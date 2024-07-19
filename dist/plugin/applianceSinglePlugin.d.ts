import { InvisiblePlugin } from "./external";
import { CursorAdapter, Room, AppliancePluginAttributes, AppliancePluginOptions, AppliancePluginInstance, Logger, ApplianceAdaptor, Displayer } from "./types";
import { ApplianceSingleManager } from "./single/applianceSingleManager";
/**
 * 单白板教具
 */
export declare class ApplianceSinglePlugin extends InvisiblePlugin<AppliancePluginAttributes, any> {
    static readonly kind: string;
    static cursorAdapter?: CursorAdapter;
    static currentManager?: ApplianceSingleManager;
    static logger: Logger;
    static options: AppliancePluginOptions;
    static getInstance(remake: Displayer, adaptor: ApplianceAdaptor): Promise<AppliancePluginInstance>;
    static onCreate(plugin: InvisiblePlugin<AppliancePluginAttributes, any>): void;
    static createAppliancePlugin(d: Room, kind: string): Promise<ApplianceSinglePlugin>;
    static createCurrentManager: (displayer: Displayer, options: AppliancePluginOptions, plugin?: ApplianceSinglePlugin) => void;
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(): void;
    private get isReplay();
    private get callbackName();
    init(displayer: Displayer): void;
    private onPhaseChanged;
    private updateRoomWritable;
    private roomStateChangeListener;
    destroy(): void;
}
