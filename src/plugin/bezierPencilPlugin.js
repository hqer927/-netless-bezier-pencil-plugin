import { InvisiblePlugin, isRoom, isPlayer, RoomPhase } from "white-web-sdk";
import { setValue, val } from "value-enhancer";
import { BezierPencilManager } from "./bezierPencilManager";
import { UndoRedoMethod } from "../undo";
export class BezierPencilPlugin extends InvisiblePlugin {
    static async getInstance(displayer, adaptor) {
        if (adaptor?.logger) {
            BezierPencilPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            BezierPencilPlugin.options = adaptor.options;
        }
        const bezierPencilPlugin = displayer.getInvisiblePlugin(BezierPencilPlugin.kind);
        if (!bezierPencilPlugin && isRoom(displayer)) {
            await displayer.createInvisiblePlugin(BezierPencilPlugin, {});
        }
        const origin = {
            displayer,
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
                if (isRoom(displayer) && displayer.isWritable) {
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
    // static effectInstance(displayer:Room) {
    //     const _cleanCurrentScene = displayer.cleanCurrentScene;
    //     displayer.cleanCurrentScene = function(retainPpt){
    //         BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] cleanCurrentScene`);
    //         BezierPencilPlugin.currentManager.cleanCurrentScene();
    //         _cleanCurrentScene.call(displayer,retainPpt);
    //     }
    // }
    constructor(context) {
        super(context);
        Object.defineProperty(this, "onPhaseChanged", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (phase) => {
                if (phase === RoomPhase.Disconnected) {
                    this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
                    this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
                    this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
                    BezierPencilPlugin.invisiblePlugins.delete(this.displayer);
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
                if (state.memberState) {
                    BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
                }
                if (state.sceneState) {
                    BezierPencilPlugin.currentManager.onSceneChange(state.sceneState);
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
                const bezierManager = new BezierPencilManager(this, BezierPencilPlugin.options);
                bezierManager.init();
                BezierPencilPlugin.currentManager = bezierManager;
                BezierPencilPlugin.logger.info(`[BezierPencilPlugin plugin] refresh currentSlideManager object`);
            }
        });
        const invisiblePlugin$ = BezierPencilPlugin.invisiblePlugins.get(this.displayer);
        invisiblePlugin$ && setValue(invisiblePlugin$, this);
    }
    get isReplay() {
        return isPlayer(this.displayer);
    }
    get callbackName() {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer) {
        const invisiblePlugin$ = val(displayer.getInvisiblePlugin(BezierPencilPlugin.kind));
        BezierPencilPlugin.invisiblePlugins.set(displayer, invisiblePlugin$);
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
        // this.displayer.callbacks.on("willInterceptKeyboardEvent", ()=>{
        //     console.log('willInterceptKeyboardEvent')
        //     return true;
        // });
        this.displayer.callbacks.on("onCanUndoStepsUpdate", (step) => {
            BezierPencilPlugin.currentManager.commiter?.addSdkUndoData(step);
        });
    }
}
// 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
Object.defineProperty(BezierPencilPlugin, "kind", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "bezier-pencil-plugin"
});
Object.defineProperty(BezierPencilPlugin, "invisiblePlugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new WeakMap()
});
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
