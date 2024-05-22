/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvisiblePlugin, isRoom, isPlayer } from "./external";
import { computRectangle } from "../core/utils";
import { ECanvasContextType } from "../core/enum";
import { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";
export class TeachingMulitAidsPlugin extends InvisiblePlugin {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "updateRoomWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                TeachingMulitAidsPlugin.currentManager?.onWritableChange(this.displayer.isWritable);
            }
        });
        Object.defineProperty(this, "roomStateChangeListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (state) => {
                if (isRoom(this.displayer) && !this.displayer.isWritable) {
                    return;
                }
                if (state.memberState) {
                    TeachingMulitAidsPlugin.currentManager?.onMemberChange(state.memberState);
                }
                if (state?.roomMembers) {
                    TeachingMulitAidsPlugin.currentManager?.onRoomMembersChange(state.roomMembers);
                }
            }
        });
    }
    static async getInstance(remake, adaptor) {
        if (adaptor?.logger) {
            TeachingMulitAidsPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            TeachingMulitAidsPlugin.options = adaptor.options;
        }
        const _d = remake.displayer;
        let _teachingMulitAidsPlugin = _d.getInvisiblePlugin(TeachingMulitAidsPlugin.kind);
        // console.log('TeachingMulitAidsPlugin', TeachingMulitAidsPlugin, _d, TeachingMulitAidsPlugin.windowManager)
        if (_d && _teachingMulitAidsPlugin) {
            TeachingMulitAidsPlugin.createCurrentManager(remake, TeachingMulitAidsPlugin.options, _teachingMulitAidsPlugin);
        }
        if (!_teachingMulitAidsPlugin && isRoom(_d)) {
            _teachingMulitAidsPlugin = await TeachingMulitAidsPlugin.createTeachingMulitAidsPlugin(_d, TeachingMulitAidsPlugin.kind);
        }
        if (_teachingMulitAidsPlugin && TeachingMulitAidsPlugin.currentManager) {
            // console.log('TeachingMulitAidsPlugin--1', TeachingMulitAidsPlugin, _d, TeachingMulitAidsPlugin.windowManager)
            TeachingMulitAidsPlugin.currentManager.bindPlugin(_teachingMulitAidsPlugin);
            _teachingMulitAidsPlugin.init(_d);
        }
        const originCallBacksOn = _d.callbacks.on;
        const originCallBacksOff = _d.callbacks.off;
        const originCallBacksOnce = _d.callbacks.once;
        const originCleanCurrentScene = remake.cleanCurrentScene;
        const origin = {
            plugin: TeachingMulitAidsPlugin,
            displayer: _d,
            windowManager: remake,
            getBoundingRectAsync: async function (scenePath) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] getBoundingRect`);
                const originRect = (this.windowManager && this.windowManager.mainView || this.displayer).getBoundingRect(scenePath);
                const pluginRect = await TeachingMulitAidsPlugin.currentManager?.getBoundingRect(scenePath);
                if (!originRect.width || !originRect.height) {
                    return pluginRect;
                }
                return computRectangle(originRect, pluginRect);
            },
            screenshotToCanvasAsync: async function (context, scenePath, width, height, camera, ratio) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] screenshotToCanvasAsync`);
                const canvas = document.createElement("canvas");
                const limitContext = canvas.getContext("2d");
                canvas.width = width * (ratio || 1);
                canvas.height = height * (ratio || 1);
                if (limitContext) {
                    (this.windowManager && this.windowManager.mainView || this.displayer).screenshotToCanvas(limitContext, scenePath, width, height, camera, ratio);
                    context.drawImage(canvas, 0, 0, width * (ratio || 1), height * (ratio || 1), 0, 0, width, height);
                    canvas.remove();
                }
                if (TeachingMulitAidsPlugin.currentManager) {
                    await TeachingMulitAidsPlugin.currentManager?.screenshotToCanvas(context, scenePath, width, height, camera);
                }
            },
            scenePreviewAsync: async function (scenePath, div, width, height, engine) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] scenePreview`);
                (this.windowManager && this.windowManager.mainView || this.displayer).scenePreview(scenePath, div, width, height, engine);
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
                if (TeachingMulitAidsPlugin.currentManager) {
                    await TeachingMulitAidsPlugin.currentManager.scenePreview(scenePath, img);
                }
            },
            callbacksOn: function (name, listener) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsMultiManager.InternalMsgEmitter.on(name, listener);
                }
                else {
                    originCallBacksOn.call(_d.callbacks, name, listener);
                }
            },
            callbacksOnce: function (name, listener) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsMultiManager.InternalMsgEmitter.on(name, listener);
                }
                else {
                    originCallBacksOnce.call(_d.callbacks, name, listener);
                }
            },
            callbacksOff: function (name, listener) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsMultiManager.InternalMsgEmitter.off(name, listener);
                }
                else {
                    originCallBacksOff.call(_d.callbacks, name, listener);
                }
            },
            undo: function () {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] undo`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    return TeachingMulitAidsPlugin.currentManager.viewContainerManager.undo();
                }
                return 0;
            },
            redo: function () {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] redo`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    return TeachingMulitAidsPlugin.currentManager.viewContainerManager.redo();
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] cleanCurrentScene`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingMulitAidsPlugin.currentManager.cleanCurrentScene();
                    originCleanCurrentScene.call(remake, retainPpt);
                }
            },
            insertImage: function (imageInfo) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] insertImage`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingMulitAidsPlugin.currentManager.worker.insertImage(imageInfo);
                }
            },
            lockImage: function (uuid, locked) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] lockImage`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingMulitAidsPlugin.currentManager.worker.lockImage(uuid, locked);
                }
            },
            completeImageUpload: function (uuid, src) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] completeImageUpload`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingMulitAidsPlugin.currentManager.worker.completeImageUpload(uuid, src);
                }
            },
            getImagesInformation: function (scenePath) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] completeImageUpload`);
                if (TeachingMulitAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    return TeachingMulitAidsPlugin.currentManager.worker.getImagesInformation(scenePath);
                }
                return [];
            },
            callbacks: () => {
                return {
                    ..._d.callbacks,
                    on: origin.callbacksOn.bind(origin),
                    once: origin.callbacksOnce.bind(origin),
                    off: origin.callbacksOff.bind(origin),
                };
            },
        };
        return {
            ...origin,
            callbacks: origin.callbacks(),
            injectMethodToObject: function (object, methodName) {
                TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] bindMethodToObject ${methodName}`);
                if (typeof object[methodName] === 'function' || typeof object[methodName] === 'undefined') {
                    object[methodName] = origin[methodName].bind(origin);
                    return;
                }
                if (methodName === 'callbacks') {
                    object.callbacks.on = origin.callbacksOn.bind(origin);
                    object.callbacks.off = origin.callbacksOff.bind(origin);
                    object.callbacks.once = origin.callbacksOnce.bind(origin);
                }
            }
        };
    }
    static onCreate(plugin) {
        // console.log('onCreate', plugin, TeachingMulitAidsPlugin.options, TeachingMulitAidsPlugin.windowManager);
        if (plugin && TeachingMulitAidsPlugin.currentManager) {
            // console.log('TeachingMulitAidsPlugin--2', plugin, plugin.displayer, TeachingMulitAidsPlugin.windowManager)
            TeachingMulitAidsPlugin.currentManager.bindPlugin(plugin);
            plugin.init(plugin.displayer);
        }
    }
    static async createTeachingMulitAidsPlugin(d, kind) {
        await d.createInvisiblePlugin(TeachingMulitAidsPlugin, {});
        let _teachingMulitAidsPlugin = d.getInvisiblePlugin(kind);
        if (!_teachingMulitAidsPlugin) {
            _teachingMulitAidsPlugin = await TeachingMulitAidsPlugin.createTeachingMulitAidsPlugin(d, kind);
        }
        return _teachingMulitAidsPlugin;
    }
    // static onDestroy(plugin: TeachingMulitAidsPlugin) {}
    get isReplay() {
        return isPlayer(this.displayer);
    }
    get callbackName() {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer) {
        if (isRoom(displayer)) {
            const state = displayer.state;
            TeachingMulitAidsPlugin.currentManager?.onMemberChange(state.memberState);
            TeachingMulitAidsPlugin.currentManager?.onRoomMembersChange(state.roomMembers);
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
    }
    destroy() {
        // console.log('currentManager--destroy -- 1')
        TeachingMulitAidsPlugin.currentManager?.destroy();
        TeachingMulitAidsPlugin.currentManager = undefined;
    }
}
// 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
Object.defineProperty(TeachingMulitAidsPlugin, "kind", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "teaching-multi-aids-plugin"
});
Object.defineProperty(TeachingMulitAidsPlugin, "logger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        info: console.log,
        warn: console.warn,
        error: console.error,
    }
});
Object.defineProperty(TeachingMulitAidsPlugin, "options", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        syncOpt: {
            interval: 300,
        },
        canvasOpt: {
            contextType: ECanvasContextType.Canvas2d
        }
    }
});
Object.defineProperty(TeachingMulitAidsPlugin, "createCurrentManager", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (remake, options, plugin) => {
        if (TeachingMulitAidsPlugin.currentManager) {
            TeachingMulitAidsPlugin.currentManager.destroy();
        }
        if (options && remake) {
            const param = {
                plugin,
                displayer: remake.displayer,
                options
            };
            const bezierManager = new TeachingAidsMultiManager(param);
            TeachingMulitAidsPlugin.logger.info(`[TeachingMulitAidsPlugin plugin] refresh TeachingAidsMultiManager object`);
            bezierManager.setWindowManager(remake);
            TeachingMulitAidsPlugin.currentManager = bezierManager;
        }
    }
});
