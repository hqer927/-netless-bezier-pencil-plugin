/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Callbacks, Camera, Player, RenderEngine, Room, RoomState} from "white-web-sdk";
import { InvisiblePlugin, InvisiblePluginContext, isRoom, Displayer, isPlayer, RoomPhase } from "white-web-sdk";
import { BezierPencilPluginAttributes, CanvasOpt, SyncOpt } from "./types";
import type { ReadonlyVal } from "value-enhancer";
import  { setValue, val } from "value-enhancer";
import { BezierPencilManager } from "./bezierPencilManager";
import { UndoRedoMethod } from "../undo";

export interface DisplayerForPlugin {
    readonly displayer: Room | Player,
    screenshotToCanvasAsync(context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number): Promise<void>;
    scenePreviewAsync(scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine): Promise<void>;
    callbacksOn: Callbacks<any>["on"];
    callbacksOnce: Callbacks<any>["once"];
    callbacksOff: Callbacks<any>["off"];
    undo():number;
    redo():number;
    cleanCurrentScene(retainPpt?: boolean):void;
    callbacks: Callbacks<any>;
}

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
    public static async getInstance(displayer: Room | Player, adaptor?: BezierPencilAdaptor): Promise<DisplayerForPlugin> {
        if (adaptor?.logger) {
            BezierPencilPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            BezierPencilPlugin.options = adaptor.options;
        }
        const bezierPencilPlugin = displayer.getInvisiblePlugin(BezierPencilPlugin.kind) as BezierPencilPlugin | undefined;
        if (!bezierPencilPlugin && isRoom(displayer)) {
            await (displayer as Room).createInvisiblePlugin(
                BezierPencilPlugin,
                {}
            );
        }
        const origin = {
            displayer,
            screenshotToCanvasAsync: async function (context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] screenshotToCanvasAsync`);
                const canvas = document.createElement("canvas");
                const limitContext = canvas.getContext("2d");
                canvas.width = width * (ratio || 1);
                canvas.height = height * (ratio || 1);
                if (limitContext) {
                    this.displayer.screenshotToCanvas(limitContext, scenePath, width, height, camera, ratio);
                    context.drawImage(canvas, 0, 0, width * (ratio || 1), height * (ratio || 1), 0, 0, width, height);
                    canvas.remove();
                }
                await BezierPencilPlugin.currentManager.screenshotToCanvas(context, scenePath, width, height, camera);
            },
            scenePreviewAsync: async function (scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] scenePreview`);
                this.displayer.scenePreview(scenePath, div, width, height, engine);
                const img = document.createElement("img");
                img.style.position = "absolute";
                img.style.top = "0px";
                img.style.left = "0px";
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.pointerEvents = "none";
                div.append(img);
                if (!getComputedStyle(div).position) {
                    div.style.position = "relative";
                }
                await BezierPencilPlugin.currentManager.scenePreview(scenePath, img);
            },
            callbacksOn: function (name: string, listener: any) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    UndoRedoMethod.emitter.on(name, listener);
                } else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOnce: function (name: string, listener: any) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    UndoRedoMethod.emitter.on(name, listener);
                } else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOff: function (name?: string, listener?: any) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    UndoRedoMethod.emitter.off(name, listener);
                } else {
                    this.displayer.callbacks.off(name, listener);
                }
            },
            undo: function () {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] undo`);
                if (isRoom(this.displayer) && !(this.displayer as Room).disableSerialization) {
                    const number = BezierPencilPlugin.currentManager.commiter?.undo((this.displayer as Room).undo) || 0;
                    return number;
                }
                return 0;
            },
            redo: function () {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] redo`);
                if (isRoom(this.displayer) && !(this.displayer as Room).disableSerialization) {
                    const number = BezierPencilPlugin.currentManager.commiter?.redo((this.displayer as Room).redo) || 0;
                    return number;
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt?: boolean) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] cleanCurrentScene`);
                if (isRoom(displayer) && (displayer as Room).isWritable) {
                    BezierPencilPlugin.currentManager.cleanCurrentScene();
                    (this.displayer as Room).cleanCurrentScene(retainPpt);
                }
            },
        }
        return {
            ...origin,
            callbacks:{
                on: origin.callbacksOn.bind(origin),
                once: origin.callbacksOnce.bind(origin),
                off: origin.callbacksOff.bind(origin),
                forwardTo: origin.displayer.callbacks.forwardTo
            }
        };
    }
    static onCreate(plugin: InvisiblePlugin<BezierPencilPluginAttributes, any> ) {
        const displayer = plugin.displayer;
        (plugin as BezierPencilPlugin)?.init(displayer);
    }
    // static onDestroy(plugin: BezierPencilPlugin) {}
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    // static effectInstance(displayer:Room) {
    //     const _cleanCurrentScene = displayer.cleanCurrentScene;
    //     displayer.cleanCurrentScene = function(retainPpt){
    //         BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] cleanCurrentScene`);
    //         BezierPencilPlugin.currentManager.cleanCurrentScene();
    //         _cleanCurrentScene.call(displayer,retainPpt);
    //     }
    // }
    constructor(context: InvisiblePluginContext) {
        super(context);
        const invisiblePlugin$ = BezierPencilPlugin.invisiblePlugins.get(this.displayer);
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
        this.createCurrentManager();
        if (isRoom(displayer)) {
            const state = (displayer as Room).state;
            if (state?.memberState) {
                BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
        // this.displayer.callbacks.on("willInterceptKeyboardEvent", ()=>{
        //     console.log('willInterceptKeyboardEvent')
        //     return true;
        // });
        this.displayer.callbacks.on("onCanUndoStepsUpdate", (step: number): void => {
            BezierPencilPlugin.currentManager.commiter?.addSdkUndoData(step);
        });
    }
    private onPhaseChanged = (phase: RoomPhase): void => {
        if (phase === RoomPhase.Disconnected) {
            this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
            this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
            this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
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
        BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] refresh currentSlideManager object`);
    }
}