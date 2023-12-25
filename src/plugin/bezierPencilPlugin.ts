/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Room, RoomState} from "white-web-sdk";
import { InvisiblePlugin, InvisiblePluginContext, isRoom, Displayer, isPlayer, RoomPhase } from "white-web-sdk";
import { BezierPencilPluginAttributes, CanvasOpt, SyncOpt } from "./types";
import type { ReadonlyVal } from "value-enhancer";
import  { setValue, val } from "value-enhancer";
import { BezierPencilManager } from "./bezierPencilManager";

export type Logger = {
    readonly info: (...messages: any[]) => void;
    readonly warn: (...messages: any[]) => void;
    readonly error: (...messages: any[]) => void;
}

export type BezierPencilPluginOptions = {
    syncOpt?: SyncOpt;
    canvasOpt?: CanvasOpt;
}

type BezierPencilAdaptor = {
    logger?: Logger;
    options?: BezierPencilPluginOptions;
}

export class BezierPencilPlugin extends InvisiblePlugin<BezierPencilPluginAttributes, any> {
    // 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
    static readonly kind: string = "bezier-pencil-plugin";
    private static currentManager: BezierPencilManager;
    public static readonly invisiblePlugins = new WeakMap<
        Displayer,
        ReadonlyVal<InvisiblePlugin<any, any> | null>
    >();
    public static logger: Logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
    };
    public static options?: BezierPencilPluginOptions;
    public static async getInstance(displayer: Room, adaptor?: BezierPencilAdaptor): Promise<Room> {
        if (adaptor?.logger) {
            BezierPencilPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            BezierPencilPlugin.options = adaptor.options;
        }
        let bezierPencilPlugin = displayer.getInvisiblePlugin(BezierPencilPlugin.kind) as
            | BezierPencilPlugin
            | undefined;
        if (!bezierPencilPlugin) {
            if (isRoom(displayer) && (displayer as Room).isWritable) {
                if (!(displayer as Room).isWritable) {
                    return displayer;
                }
                bezierPencilPlugin = (await (displayer as Room).createInvisiblePlugin(
                    BezierPencilPlugin,
                    {}
                )) as BezierPencilPlugin;
            } else {
                return displayer;
            }
        }
        bezierPencilPlugin?.init(displayer);
        BezierPencilPlugin.effectInstance(displayer);
        return displayer;
    }
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(displayer:Room) {
        const _cleanCurrentScene = displayer.cleanCurrentScene;
        displayer.cleanCurrentScene = function(retainPpt){
            BezierPencilPlugin.currentManager.cleanCurrentScene();
            BezierPencilPlugin.logger.info(`[Projector plugin] cleanCurrentScene`);
            _cleanCurrentScene.call(displayer,retainPpt);
        }
        return displayer;
    }
    constructor(context: InvisiblePluginContext) {
        super(context);
        const invisiblePlugin$ = BezierPencilPlugin.invisiblePlugins.get( this.displayer);
        invisiblePlugin$ && setValue(invisiblePlugin$, this);
    }
    private get isReplay(): boolean {
        return isPlayer(this.displayer);
    }
    private get callbackName(): string {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    private init(displayer: Displayer){
        const invisiblePlugin$ = val<InvisiblePlugin<any, any> | null>(
            displayer.getInvisiblePlugin(BezierPencilPlugin.kind)
          );
        BezierPencilPlugin.invisiblePlugins.set(displayer, invisiblePlugin$);
        if (isRoom(displayer)) {
            this.createCurrentManager();
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
    }
    private onPhaseChanged = (phase: RoomPhase): void => {
        if (phase === RoomPhase.Disconnected) {
            this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
            this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
            this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
        //   isRoomWritable$.dispose();
        //   invisiblePlugin$.dispose();
            BezierPencilPlugin.invisiblePlugins.delete(this.displayer);
            BezierPencilPlugin.currentManager.destroy();
        }
    };
    private updateRoomWritable = () => {
        BezierPencilPlugin.currentManager.onWritableChange((this.displayer as Room).isWritable);
    }
    private roomStateChangeListener = async (state: RoomState) => {
        if (state.cameraState) {
            BezierPencilPlugin.currentManager.onCameraChange(state.cameraState);
        }
        if (state.memberState) {
            BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
        }
        if (state.sceneState) {
            BezierPencilPlugin.currentManager.onSceneChange(state.sceneState);
        }
    }
    private createCurrentManager = () => {
        if (BezierPencilPlugin.currentManager) {
            BezierPencilPlugin.currentManager.destroy();
        }
        const bezierManager = new BezierPencilManager(this, BezierPencilPlugin.options);
        bezierManager.init();
        BezierPencilPlugin.currentManager = bezierManager;
        BezierPencilPlugin.logger.info(`[Projector plugin] refresh currentSlideManager object`);
        // return BezierPencilPlugin.currentManager;
    }
}