/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvisiblePlugin, isRoom, isPlayer, ApplianceNames } from "./external";
import { computRectangle } from "../core/utils";
import { ECanvasContextType } from "../core/enum";
import { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
export class TeachingSingleAidsPlugin extends InvisiblePlugin {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "updateRoomWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                TeachingSingleAidsPlugin.currentManager?.onWritableChange(this.displayer.isWritable);
            }
        });
        Object.defineProperty(this, "roomStateChangeListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (state) => {
                if (TeachingSingleAidsPlugin.currentManager instanceof TeachingAidsSingleManager) {
                    if (state.cameraState) {
                        TeachingSingleAidsPlugin.currentManager.onCameraChange(state.cameraState);
                    }
                    if (state.sceneState) {
                        TeachingSingleAidsPlugin.currentManager.onSceneChange(state.sceneState.scenePath, 'mainView');
                    }
                }
                if (isRoom(this.displayer) && !this.displayer.isWritable) {
                    return;
                }
                if (state.memberState) {
                    TeachingSingleAidsPlugin.currentManager?.onMemberChange(state.memberState);
                }
                if (state?.roomMembers) {
                    TeachingSingleAidsPlugin.currentManager?.onRoomMembersChange(state.roomMembers);
                }
            }
        });
    }
    static async getInstance(remake, adaptor) {
        if (adaptor?.logger) {
            TeachingSingleAidsPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            TeachingSingleAidsPlugin.options = adaptor.options;
        }
        if (adaptor?.cursorAdapter) {
            TeachingSingleAidsPlugin.cursorAdapter = adaptor.cursorAdapter;
            TeachingSingleAidsPlugin.effectInstance();
        }
        let teachingAidsPlugin = remake.getInvisiblePlugin(TeachingSingleAidsPlugin.kind);
        // console.log('teachingAidsPlugin', teachingAidsPlugin, _d, TeachingAidsPlugin.windowManager)
        if (remake && teachingAidsPlugin) {
            TeachingSingleAidsPlugin.createCurrentManager(remake, TeachingSingleAidsPlugin.options, teachingAidsPlugin);
        }
        if (!teachingAidsPlugin && isRoom(remake)) {
            teachingAidsPlugin = await TeachingSingleAidsPlugin.createTeachingAidsPlugin(remake, TeachingSingleAidsPlugin.kind);
        }
        if (teachingAidsPlugin && TeachingSingleAidsPlugin.currentManager) {
            // console.log('teachingAidsPlugin--1', teachingAidsPlugin, _d, TeachingAidsPlugin.windowManager)
            TeachingSingleAidsPlugin.currentManager.bindPlugin(teachingAidsPlugin);
            teachingAidsPlugin.init(remake);
        }
        const originCallBacksOn = remake.callbacks.on;
        const originCallBacksOff = remake.callbacks.off;
        const originCallBacksOnce = remake.callbacks.once;
        const originCleanCurrentScene = remake.cleanCurrentScene;
        const origin = {
            plugin: teachingAidsPlugin,
            displayer: remake,
            getBoundingRectAsync: async function (scenePath) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] getBoundingRect`);
                const originRect = this.displayer.getBoundingRect(scenePath);
                const pluginRect = await TeachingSingleAidsPlugin.currentManager?.getBoundingRect(scenePath);
                if (!originRect.width || !originRect.height) {
                    return pluginRect;
                }
                return computRectangle(originRect, pluginRect);
            },
            screenshotToCanvasAsync: async function (context, scenePath, width, height, camera, ratio) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] screenshotToCanvasAsync`);
                const canvas = document.createElement("canvas");
                const limitContext = canvas.getContext("2d");
                canvas.width = width * (ratio || 1);
                canvas.height = height * (ratio || 1);
                if (limitContext) {
                    this.displayer.screenshotToCanvas(limitContext, scenePath, width, height, camera, ratio);
                    context.drawImage(canvas, 0, 0, width * (ratio || 1), height * (ratio || 1), 0, 0, width, height);
                    canvas.remove();
                }
                if (TeachingSingleAidsPlugin.currentManager) {
                    await TeachingSingleAidsPlugin.currentManager?.screenshotToCanvas(context, scenePath, width, height, camera);
                }
            },
            scenePreviewAsync: async function (scenePath, div, width, height, engine) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] scenePreview`);
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
                if (TeachingSingleAidsPlugin.currentManager) {
                    await TeachingSingleAidsPlugin.currentManager.scenePreview(scenePath, img);
                }
            },
            callbacksOn: function (name, listener) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.on(name, listener);
                }
                else {
                    originCallBacksOn.call(remake.callbacks, name, listener);
                }
            },
            callbacksOnce: function (name, listener) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.on(name, listener);
                }
                else {
                    originCallBacksOnce.call(remake.callbacks, name, listener);
                }
            },
            callbacksOff: function (name, listener) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.off(name, listener);
                }
                else {
                    originCallBacksOff.call(remake.callbacks, name, listener);
                }
            },
            undo: function () {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] undo`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    return TeachingSingleAidsPlugin.currentManager.viewContainerManager.undo();
                }
                return 0;
            },
            redo: function () {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] redo`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    return TeachingSingleAidsPlugin.currentManager.viewContainerManager.redo();
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] cleanCurrentScene`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingSingleAidsPlugin.currentManager.cleanCurrentScene();
                    originCleanCurrentScene.call(remake, retainPpt);
                }
            },
            insertImage: function (imageInfo) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] insertImage`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingSingleAidsPlugin.currentManager.worker.insertImage(imageInfo);
                }
            },
            lockImage: function (uuid, locked) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] lockImage`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingSingleAidsPlugin.currentManager.worker.lockImage(uuid, locked);
                }
            },
            completeImageUpload: function (uuid, src) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] completeImageUpload`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingSingleAidsPlugin.currentManager.worker.completeImageUpload(uuid, src);
                }
            },
            getImagesInformation: function (scenePath) {
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] completeImageUpload`);
                if (TeachingSingleAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    return TeachingSingleAidsPlugin.currentManager.worker.getImagesInformation(scenePath);
                }
                return [];
            },
            callbacks: () => {
                return {
                    ...remake.callbacks,
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
                TeachingSingleAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] bindMethodToObject ${methodName}`);
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
        // console.log('onCreate', plugin, TeachingAidsPlugin.options, TeachingAidsPlugin.windowManager);
        if (plugin && TeachingSingleAidsPlugin.currentManager) {
            // console.log('teachingAidsPlugin--2', plugin, plugin.displayer, TeachingAidsPlugin.windowManager)
            TeachingSingleAidsPlugin.currentManager.bindPlugin(plugin);
            plugin.init(plugin.displayer);
        }
    }
    static async createTeachingAidsPlugin(d, kind) {
        await d.createInvisiblePlugin(TeachingSingleAidsPlugin, {});
        // console.log('createTeachingAidsPlugin--1')
        let teachingAidsPlugin = d.getInvisiblePlugin(kind);
        if (!teachingAidsPlugin) {
            // console.log('createTeachingAidsPlugin')
            teachingAidsPlugin = await TeachingSingleAidsPlugin.createTeachingAidsPlugin(d, kind);
        }
        return teachingAidsPlugin;
    }
    // static onDestroy(plugin: TeachingAidsPlugin) {}
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance() {
        if (TeachingSingleAidsPlugin.cursorAdapter) {
            const _onAddedCursor = TeachingSingleAidsPlugin.cursorAdapter.onAddedCursor;
            TeachingSingleAidsPlugin.cursorAdapter.onAddedCursor = function (cursor) {
                cursor.onCursorMemberChanged = (c) => {
                    try {
                        if (c.appliance === ApplianceNames.pencil ||
                            c.appliance === ApplianceNames.shape ||
                            c.appliance === ApplianceNames.text ||
                            c.appliance === ApplianceNames.arrow ||
                            c.appliance === ApplianceNames.straight ||
                            c.appliance === ApplianceNames.rectangle ||
                            c.appliance === ApplianceNames.ellipse) {
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
                _onAddedCursor.call(TeachingSingleAidsPlugin.cursorAdapter, cursor);
            };
        }
    }
    get isReplay() {
        return isPlayer(this.displayer);
    }
    get callbackName() {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer) {
        if (isRoom(displayer)) {
            const state = displayer.state;
            if (state?.memberState) {
                TeachingSingleAidsPlugin.currentManager?.onMemberChange(state.memberState);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
    }
    destroy() {
        // console.log('currentManager--destroy -- 1')
        TeachingSingleAidsPlugin.currentManager?.destroy();
        TeachingSingleAidsPlugin.currentManager = undefined;
        TeachingSingleAidsPlugin.cursorAdapter = undefined;
    }
}
// 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
Object.defineProperty(TeachingSingleAidsPlugin, "kind", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "teaching-single-aids-plugin"
});
Object.defineProperty(TeachingSingleAidsPlugin, "logger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        info: console.log,
        warn: console.warn,
        error: console.error,
    }
});
Object.defineProperty(TeachingSingleAidsPlugin, "options", {
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
Object.defineProperty(TeachingSingleAidsPlugin, "createCurrentManager", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (displayer, options, plugin) => {
        if (TeachingSingleAidsPlugin.currentManager) {
            TeachingSingleAidsPlugin.currentManager.destroy();
        }
        const param = {
            plugin,
            displayer,
            options
        };
        const bezierManager = new TeachingAidsSingleManager(param);
        bezierManager.init();
        TeachingSingleAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsSingleManager object`);
        TeachingSingleAidsPlugin.currentManager = bezierManager;
    }
});
