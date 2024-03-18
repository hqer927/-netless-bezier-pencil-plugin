/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Callbacks, Camera, Cursor, Rectangle, RenderEngine, Room, RoomState} from "white-web-sdk";
import { InvisiblePlugin, isRoom, Displayer, isPlayer, RoomPhase } from "white-web-sdk";
import { BezierPencilPluginAttributes, CanvasOpt, SyncOpt } from "./types";
import { BezierPencilManager } from "./single/bezierPencilManager";
import { UndoRedoMethod } from "../undo";
import { WindowManager } from "@netless/window-manager";
import { BezierPencilManager as BezierPencilMulitManager } from "./multi/bezierPencilMultiManager";
import { computRectangle } from "../core/utils";
import { CursorTool } from "@netless/cursor-tool";

export interface DisplayerForPlugin {
    readonly displayer: Displayer,
    /**
     * 获取某个场景里包含所有元素的矩形 
     */
    getBoundingRectAsync(scenePath: string): Promise<Rectangle|undefined>;
    /**
     * 生成屏幕快照，并写入指定的 CanvasRenderingContext2D 对象中 
     */
    screenshotToCanvasAsync(context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number): Promise<void>;
    /**
     * 生成场景预览
     * @param  scenePath 想要获取预览内容的场景的场景路径
     * @param  div 想要展示预览内容的 div
     * @param  width 白板的缩放宽度：将当前白板内容，缩小到真实像素宽度。2.3.8 后，该参数为可选参数，如果不填，则默认为展示内容 div 的宽度。
     * @param  height 白板的缩放高度：将当前白板的内容，缩小到真实像素高度。2.3.8 后，该参数为可选参数，如果不填，则默认为展示内容 div 的高度。
     */
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
    useMultiViews?: boolean;
    logger?: Logger;
    options?: BezierPencilPluginOptions;
    cursorAdapter?: CursorTool;
}

export class BezierPencilPlugin extends InvisiblePlugin<BezierPencilPluginAttributes, any> {
    // 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
    static readonly kind: string = "bezier-pencil-plugin";
    static useMultiViews: boolean = false;
    static cursorAdapter?: CursorTool;
    private static currentManager: BezierPencilManager | BezierPencilMulitManager;
    // public static readonly invisiblePlugins = new WeakMap<
    //     Displayer,
    //     ReadonlyVal<InvisiblePlugin<any, any> | null>
    // >();
    public static logger: Logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
    };
    public static options?: BezierPencilPluginOptions;
    public static async getInstance(displayer: Displayer | WindowManager, adaptor?: BezierPencilAdaptor): Promise<DisplayerForPlugin> {
        if (adaptor?.logger) {
            BezierPencilPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            BezierPencilPlugin.options = adaptor.options;
        }
        if (adaptor?.cursorAdapter) {
            BezierPencilPlugin.cursorAdapter = adaptor.cursorAdapter;
            BezierPencilPlugin.effectInstance();
        }
        BezierPencilPlugin.useMultiViews = adaptor?.useMultiViews || false;
        const _d = displayer instanceof WindowManager ? displayer.displayer : displayer;
        const bezierPencilPlugin = _d.getInvisiblePlugin(BezierPencilPlugin.kind) as BezierPencilPlugin | undefined;
        if (!bezierPencilPlugin && isRoom(_d)) {
            await (displayer as Room).createInvisiblePlugin(
                BezierPencilPlugin,
                {}
            );
        }
        if (BezierPencilPlugin.useMultiViews) {
            const originMulitiView = {
                displayer: _d,
                getBoundingRectAsync: async function (scenePath: string) {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] getBoundingRect`);
                    const originRect = this.displayer.getBoundingRect(scenePath);
                    const pluginRect = await BezierPencilPlugin.currentManager.getBoundingRect(scenePath);
                    return computRectangle(originRect, pluginRect)
                },
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
                    if (isRoom(this.displayer) && (displayer as Room).isWritable) {
                        BezierPencilPlugin.currentManager.cleanCurrentScene();
                        (this.displayer as Room).cleanCurrentScene(retainPpt);
                    }
                },
            };
            return {
                ...originMulitiView,
                callbacks:{
                    on: originMulitiView.callbacksOn.bind(originMulitiView),
                    once: originMulitiView.callbacksOnce.bind(originMulitiView),
                    off: originMulitiView.callbacksOff.bind(originMulitiView),
                    forwardTo: originMulitiView.displayer.callbacks.forwardTo
                }
            }
        }   
        const origin = {
            displayer: displayer as Displayer,
            getBoundingRectAsync: async function (scenePath: string) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] getBoundingRect`);
                const originRect = this.displayer.getBoundingRect(scenePath);
                const pluginRect = await BezierPencilPlugin.currentManager.getBoundingRect(scenePath);
                return computRectangle(originRect, pluginRect)
            },
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
                if (isRoom(this.displayer) && (this.displayer as Room).isWritable) {
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
    static effectInstance() {
        if (BezierPencilPlugin.cursorAdapter) {
            BezierPencilPlugin.cursorAdapter
            const _onAddedCursor = BezierPencilPlugin.cursorAdapter.onAddedCursor;
            BezierPencilPlugin.cursorAdapter.onAddedCursor = function (cursor: Cursor) {
                cursor.onCursorMemberChanged = (c: any)=>{
                    try {
                        if (c.appliance === 'pencil') {
                            if (cursor?.divElement) {
                                cursor.divElement.style.display='none';
                            }
                        } else if (cursor?.divElement) {
                            cursor.divElement.style.display='block';
                        }
                    } catch (error) { /* empty */ }
                }
                _onAddedCursor.call(BezierPencilPlugin.cursorAdapter,cursor);
            }
        }


    }
    // constructor(context: InvisiblePluginContext) {
    //     super(context);
    //     // const invisiblePlugin$ = BezierPencilPlugin.invisiblePlugins.get(this.displayer);
    //     // invisiblePlugin$ && setValue(invisiblePlugin$, this);
    // }
    private get isReplay(): boolean {
        return isPlayer(this.displayer);
    }
    private get callbackName(): string {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    private init(displayer: Displayer){
        // const invisiblePlugin$ = val<InvisiblePlugin<any, any> | null>(
        //     displayer.getInvisiblePlugin(BezierPencilPlugin.kind)
        // );
        // BezierPencilPlugin.invisiblePlugins.set(displayer, invisiblePlugin$);
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
        this.displayer.callbacks.on("onCanUndoStepsUpdate", (step: number): void => {
            BezierPencilPlugin.currentManager.commiter?.addSdkUndoData(step);
        });
    }
    private onPhaseChanged = (phase: RoomPhase): void => {
        if (phase === RoomPhase.Disconnected) {
            this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
            this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
            this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
            // BezierPencilPlugin.invisiblePlugins.delete(this.displayer);
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
        if (state.sceneState) {
            BezierPencilPlugin.currentManager.onSceneChange(state.sceneState);
        }
        if (isRoom(this.displayer) && !(this.displayer as Room).isWritable) {
            return;
        }
        if (state.memberState) {
            BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
        }
        if (state?.roomMembers) {
            BezierPencilPlugin.currentManager.onRoomMembersChange(state.roomMembers);
        }
    }
    private createCurrentManager = () => {
        if (BezierPencilPlugin.currentManager) {
            BezierPencilPlugin.currentManager.destroy();
        }
        const bezierManager = BezierPencilPlugin.useMultiViews? new BezierPencilMulitManager(this, BezierPencilPlugin.options) : new BezierPencilManager(this, BezierPencilPlugin.options);
        bezierManager.init();
        BezierPencilPlugin.currentManager = bezierManager;
        BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] refresh currentSlideManager object`);
    }
    override destroy(): void {
        BezierPencilPlugin.currentManager.destroy();
    }
}