import { InvisiblePlugin } from "./external";
import type { CursorAdapter, Room, TeachingAidsPluginAttributes, TeachingAidsPluginOptions, DisplayerForPlugin, Logger, TeachingAidsAdaptor, Displayer } from "./types";
import { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
export declare class TeachingSingleAidsPlugin extends InvisiblePlugin<TeachingAidsPluginAttributes, any> {
    static readonly kind: string;
    static cursorAdapter?: CursorAdapter;
    static currentManager?: TeachingAidsSingleManager;
    static logger: Logger;
    static options: TeachingAidsPluginOptions;
    static getInstance(remake: Displayer, adaptor?: TeachingAidsAdaptor): Promise<DisplayerForPlugin>;
    static onCreate(plugin: InvisiblePlugin<TeachingAidsPluginAttributes, any>): void;
    static createTeachingAidsPlugin(d: Room, kind: string): Promise<TeachingSingleAidsPlugin>;
    static createCurrentManager: (displayer: Displayer, options: TeachingAidsPluginOptions, plugin?: TeachingSingleAidsPlugin) => void;
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
