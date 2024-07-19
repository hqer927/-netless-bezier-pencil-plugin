import { InvisiblePlugin } from "./external";
import { Room, Displayer, AppliancePluginAttributes, AppliancePluginOptions, AppliancePluginInstance, Logger, ApplianceAdaptor } from "./types";
import type { WindowManager } from "./multi/applianceMultiManager";
import { ApplianceMultiManager } from "./multi/applianceMultiManager";
/**
 * 多窗口教具
 */
export declare class ApplianceMultiPlugin extends InvisiblePlugin<AppliancePluginAttributes, any> {
    static readonly kind: string;
    static currentManager?: ApplianceMultiManager;
    static logger: Logger;
    static options: AppliancePluginOptions;
    static getInstance(remake: WindowManager, adaptor: ApplianceAdaptor): Promise<AppliancePluginInstance>;
    static onCreate(plugin: InvisiblePlugin<AppliancePluginAttributes, any>): void;
    static createApplianceMultiPlugin(d: Room, kind: string): Promise<ApplianceMultiPlugin>;
    static createCurrentManager: (remake: WindowManager, options: AppliancePluginOptions, plugin: ApplianceMultiPlugin) => void;
    private get isReplay();
    private get callbackName();
    init(displayer: Displayer): void;
    private onPhaseChanged;
    private updateRoomWritable;
    private roomStateChangeListener;
    destroy(): void;
}
