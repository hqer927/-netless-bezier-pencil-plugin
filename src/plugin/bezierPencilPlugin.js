import { InvisiblePlugin, isRoom, isPlayer, RoomPhase } from "white-web-sdk";
import { BezierPencilManager } from "./single/bezierPencilManager";
import { UndoRedoMethod } from "../undo";
import { WindowManager } from "@netless/window-manager";
import { BezierPencilManager as BezierPencilMulitManager } from "./multi/bezierPencilMultiManager";
import { computRectangle } from "../core/utils";
export class BezierPencilPlugin extends InvisiblePlugin {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "onPhaseChanged", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (phase) => {
                if (phase === RoomPhase.Disconnected) {
                    this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
                    this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
                    this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
                    // BezierPencilPlugin.invisiblePlugins.delete(this.displayer);
                    BezierPencilPlugin.currentManager.destroy();
                }
            }
        });
        Object.defineProperty(this, "updateRoomWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                BezierPencilPlugin.currentManager.onWritableChange(this.displayer.isWritable);
            }
        });
        Object.defineProperty(this, "roomStateChangeListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (state) => {
                if (state.cameraState) {
                    BezierPencilPlugin.currentManager.onCameraChange(state.cameraState);
                }
                if (state.sceneState) {
                    BezierPencilPlugin.currentManager.onSceneChange(state.sceneState);
                }
                if (isRoom(this.displayer) && !this.displayer.isWritable) {
                    return;
                }
                if (state.memberState) {
                    BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
                }
                if (state?.roomMembers) {
                    BezierPencilPlugin.currentManager.onRoomMembersChange(state.roomMembers);
                }
            }
        });
        Object.defineProperty(this, "createCurrentManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (BezierPencilPlugin.currentManager) {
                    BezierPencilPlugin.currentManager.destroy();
                }
                const bezierManager = BezierPencilPlugin.useMultiViews ? new BezierPencilMulitManager(this, BezierPencilPlugin.options) : new BezierPencilManager(this, BezierPencilPlugin.options);
                bezierManager.init();
                BezierPencilPlugin.currentManager = bezierManager;
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] refresh currentSlideManager object`);
            }
        });
    }
    static async getInstance(displayer, adaptor) {
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
        const bezierPencilPlugin = _d.getInvisiblePlugin(BezierPencilPlugin.kind);
        if (!bezierPencilPlugin && isRoom(_d)) {
            await displayer.createInvisiblePlugin(BezierPencilPlugin, {});
        }
        if (BezierPencilPlugin.useMultiViews) {
            const originMulitiView = {
                displayer: _d,
                getBoundingRectAsync: async function (scenePath) {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] getBoundingRect`);
                    const originRect = this.displayer.getBoundingRect(scenePath);
                    const pluginRect = await BezierPencilPlugin.currentManager.getBoundingRect(scenePath);
                    return computRectangle(originRect, pluginRect);
                },
                screenshotToCanvasAsync: async function (context, scenePath, width, height, camera, ratio) {
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
                scenePreviewAsync: async function (scenePath, div, width, height, engine) {
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
                callbacksOn: function (name, listener) {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                    if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                        UndoRedoMethod.emitter.on(name, listener);
                    }
                    else {
                        this.displayer.callbacks.on(name, listener);
                    }
                },
                callbacksOnce: function (name, listener) {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                    if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                        UndoRedoMethod.emitter.on(name, listener);
                    }
                    else {
                        this.displayer.callbacks.on(name, listener);
                    }
                },
                callbacksOff: function (name, listener) {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                    if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                        UndoRedoMethod.emitter.off(name, listener);
                    }
                    else {
                        this.displayer.callbacks.off(name, listener);
                    }
                },
                undo: function () {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] undo`);
                    if (isRoom(this.displayer) && !this.displayer.disableSerialization) {
                        const number = BezierPencilPlugin.currentManager.commiter?.undo(this.displayer.undo) || 0;
                        return number;
                    }
                    return 0;
                },
                redo: function () {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] redo`);
                    if (isRoom(this.displayer) && !this.displayer.disableSerialization) {
                        const number = BezierPencilPlugin.currentManager.commiter?.redo(this.displayer.redo) || 0;
                        return number;
                    }
                    return 0;
                },
                cleanCurrentScene: function (retainPpt) {
                    BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] cleanCurrentScene`);
                    if (isRoom(this.displayer) && displayer.isWritable) {
                        BezierPencilPlugin.currentManager.cleanCurrentScene();
                        this.displayer.cleanCurrentScene(retainPpt);
                    }
                },
            };
            return {
                ...originMulitiView,
                callbacks: {
                    on: originMulitiView.callbacksOn.bind(originMulitiView),
                    once: originMulitiView.callbacksOnce.bind(originMulitiView),
                    off: originMulitiView.callbacksOff.bind(originMulitiView),
                    forwardTo: originMulitiView.displayer.callbacks.forwardTo
                }
            };
        }
        const origin = {
            displayer: displayer,
            getBoundingRectAsync: async function (scenePath) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] getBoundingRect`);
                const originRect = this.displayer.getBoundingRect(scenePath);
                const pluginRect = await BezierPencilPlugin.currentManager.getBoundingRect(scenePath);
                return computRectangle(originRect, pluginRect);
            },
            screenshotToCanvasAsync: async function (context, scenePath, width, height, camera, ratio) {
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
            scenePreviewAsync: async function (scenePath, div, width, height, engine) {
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
            callbacksOn: function (name, listener) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    UndoRedoMethod.emitter.on(name, listener);
                }
                else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOnce: function (name, listener) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    UndoRedoMethod.emitter.on(name, listener);
                }
                else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOff: function (name, listener) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    UndoRedoMethod.emitter.off(name, listener);
                }
                else {
                    this.displayer.callbacks.off(name, listener);
                }
            },
            undo: function () {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] undo`);
                if (isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    const number = BezierPencilPlugin.currentManager.commiter?.undo(this.displayer.undo) || 0;
                    return number;
                }
                return 0;
            },
            redo: function () {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] redo`);
                if (isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    const number = BezierPencilPlugin.currentManager.commiter?.redo(this.displayer.redo) || 0;
                    return number;
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt) {
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] cleanCurrentScene`);
                if (isRoom(this.displayer) && this.displayer.isWritable) {
                    BezierPencilPlugin.currentManager.cleanCurrentScene();
                    this.displayer.cleanCurrentScene(retainPpt);
                }
            },
        };
        return {
            ...origin,
            callbacks: {
                on: origin.callbacksOn.bind(origin),
                once: origin.callbacksOnce.bind(origin),
                off: origin.callbacksOff.bind(origin),
                forwardTo: origin.displayer.callbacks.forwardTo
            }
        };
    }
    static onCreate(plugin) {
        const displayer = plugin.displayer;
        plugin?.init(displayer);
    }
    // static onDestroy(plugin: BezierPencilPlugin) {}
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance() {
        if (BezierPencilPlugin.cursorAdapter) {
            BezierPencilPlugin.cursorAdapter;
            const _onAddedCursor = BezierPencilPlugin.cursorAdapter.onAddedCursor;
            BezierPencilPlugin.cursorAdapter.onAddedCursor = function (cursor) {
                cursor.onCursorMemberChanged = (c) => {
                    try {
                        if (c.appliance === 'pencil') {
                            if (cursor?.divElement) {
                                cursor.divElement.style.display = 'none';
                            }
                        }
                        else if (cursor?.divElement) {
                            cursor.divElement.style.display = 'block';
                        }
                    }
                    catch (error) { /* empty */ }
                };
                _onAddedCursor.call(BezierPencilPlugin.cursorAdapter, cursor);
            };
        }
    }
    // constructor(context: InvisiblePluginContext) {
    //     super(context);
    //     // const invisiblePlugin$ = BezierPencilPlugin.invisiblePlugins.get(this.displayer);
    //     // invisiblePlugin$ && setValue(invisiblePlugin$, this);
    // }
    get isReplay() {
        return isPlayer(this.displayer);
    }
    get callbackName() {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer) {
        // const invisiblePlugin$ = val<InvisiblePlugin<any, any> | null>(
        //     displayer.getInvisiblePlugin(BezierPencilPlugin.kind)
        // );
        // BezierPencilPlugin.invisiblePlugins.set(displayer, invisiblePlugin$);
        this.createCurrentManager();
        if (isRoom(displayer)) {
            const state = displayer.state;
            if (state?.memberState) {
                BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
        this.displayer.callbacks.on("onCanUndoStepsUpdate", (step) => {
            BezierPencilPlugin.currentManager.commiter?.addSdkUndoData(step);
        });
    }
    destroy() {
        BezierPencilPlugin.currentManager.destroy();
    }
}
// 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
Object.defineProperty(BezierPencilPlugin, "kind", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "bezier-pencil-plugin"
});
Object.defineProperty(BezierPencilPlugin, "useMultiViews", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
// public static readonly invisiblePlugins = new WeakMap<
//     Displayer,
//     ReadonlyVal<InvisiblePlugin<any, any> | null>
// >();
Object.defineProperty(BezierPencilPlugin, "logger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        info: console.log,
        warn: console.warn,
        error: console.error,
    }
});
