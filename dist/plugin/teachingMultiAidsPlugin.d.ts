import { InvisiblePlugin } from "./external";
import type { Room, Displayer, TeachingAidsPluginAttributes, TeachingAidsPluginOptions, DisplayerForPlugin, Logger, TeachingAidsAdaptor } from "./types";
import type { WindowManager } from "./multi/teachingAidsMultiManager";
import { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";
export declare class TeachingMulitAidsPlugin extends InvisiblePlugin<TeachingAidsPluginAttributes, any> {
    static readonly kind: string;
    static currentManager?: TeachingAidsMultiManager;
    static logger: Logger;
    static options: TeachingAidsPluginOptions;
    static getInstance(remake: WindowManager, adaptor?: TeachingAidsAdaptor): Promise<DisplayerForPlugin>;
    static onCreate(plugin: InvisiblePlugin<TeachingAidsPluginAttributes, any>): void;
    static createTeachingMulitAidsPlugin(d: Room, kind: string): Promise<TeachingMulitAidsPlugin>;
    static createCurrentManager: (remake: WindowManager, options: TeachingAidsPluginOptions, plugin: TeachingMulitAidsPlugin) => void;
    private get isReplay();
    private get callbackName();
    init(displayer: Displayer): void;
    private updateRoomWritable;
    private roomStateChangeListener;
    destroy(): void;
}
