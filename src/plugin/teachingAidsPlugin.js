import { WindowManager } from "@netless/window-manager";
import { InvisiblePlugin, isRoom, isPlayer, RoomPhase, ApplianceNames } from "white-web-sdk";
import { computRectangle } from "../core/utils";
import { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
import { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";
async function createTeachingAidsPlugin(d, kind) {
    await d.createInvisiblePlugin(TeachingAidsPlugin, {});
    let teachingAidsPlugin = d.getInvisiblePlugin(kind);
    if (!teachingAidsPlugin) {
        teachingAidsPlugin = await createTeachingAidsPlugin(d, kind);
    }
    return teachingAidsPlugin;
}
function createTeachingAidsPluginManager(plugin, options, remake) {
    if (plugin && options) {
        const displayer = plugin.displayer;
        plugin.init(displayer, options, remake);
    }
}
export class TeachingAidsPlugin extends InvisiblePlugin {
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
                    TeachingAidsPlugin.currentManager?.destroy();
                }
            }
        });
        Object.defineProperty(this, "updateRoomWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                TeachingAidsPlugin.currentManager?.onWritableChange(this.displayer.isWritable);
            }
        });
        Object.defineProperty(this, "roomStateChangeListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (state) => {
                if (TeachingAidsPlugin.currentManager instanceof TeachingAidsSingleManager) {
                    if (state.cameraState) {
                        TeachingAidsPlugin.currentManager.onCameraChange(state.cameraState);
                    }
                    if (state.sceneState) {
                        TeachingAidsPlugin.currentManager.onSceneChange(state.sceneState.scenePath, 'mainView');
                    }
                }
                if (isRoom(this.displayer) && !this.displayer.isWritable) {
                    return;
                }
                if (state.memberState) {
                    TeachingAidsPlugin.currentManager?.onMemberChange(state.memberState);
                }
                if (state?.roomMembers) {
                    TeachingAidsPlugin.currentManager?.onRoomMembersChange(state.roomMembers);
                }
            }
        });
        Object.defineProperty(this, "createCurrentManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (options, remake) => {
                if (TeachingAidsPlugin.currentManager) {
                    TeachingAidsPlugin.currentManager.destroy();
                }
                let bezierManager;
                if (options && options.useMultiViews && remake) {
                    bezierManager = new TeachingAidsMultiManager(this, options);
                    TeachingAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsMultiManager object`);
                    bezierManager.setWindowManager(remake);
                }
                else {
                    bezierManager = new TeachingAidsSingleManager(this, options);
                    bezierManager.init();
                    TeachingAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsSingleManager object`);
                }
                TeachingAidsPlugin.currentManager = bezierManager;
            }
        });
    }
    static async getInstance(remake, adaptor) {
        if (remake instanceof WindowManager) {
            TeachingAidsPlugin.remake = remake;
        }
        if (adaptor?.logger) {
            TeachingAidsPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            TeachingAidsPlugin.options = adaptor.options;
        }
        if (adaptor?.cursorAdapter) {
            TeachingAidsPlugin.cursorAdapter = adaptor.cursorAdapter;
            TeachingAidsPlugin.effectInstance();
        }
        const _d = remake instanceof WindowManager ? remake.displayer : remake;
        let teachingAidsPlugin = _d.getInvisiblePlugin(TeachingAidsPlugin.kind);
        if (!teachingAidsPlugin && isRoom(_d)) {
            teachingAidsPlugin = await createTeachingAidsPlugin(_d, TeachingAidsPlugin.kind);
            if (remake instanceof WindowManager) {
                if (!TeachingAidsPlugin.options?.useMultiViews) {
                    TeachingAidsPlugin.logger.error(`[TeachingAidsPlugin plugin] getInstance has Invalid parameter, please use options.useMultiViews = true`);
                }
            }
        }
        if (teachingAidsPlugin && TeachingAidsPlugin.options && !TeachingAidsPlugin.currentManager) {
            // console.log('getInstance', TeachingAidsPlugin.options);
            createTeachingAidsPluginManager(teachingAidsPlugin, TeachingAidsPlugin.options, TeachingAidsPlugin.remake);
        }
        const origin = {
            plugin: teachingAidsPlugin,
            displayer: _d,
            getBoundingRectAsync: async function (scenePath) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] getBoundingRect`);
                const originRect = this.displayer.getBoundingRect(scenePath);
                const pluginRect = await TeachingAidsPlugin.currentManager?.getBoundingRect(scenePath);
                return computRectangle(originRect, pluginRect);
            },
            screenshotToCanvasAsync: async function (context, scenePath, width, height, camera, ratio) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] screenshotToCanvasAsync`);
                const canvas = document.createElement("canvas");
                const limitContext = canvas.getContext("2d");
                canvas.width = width * (ratio || 1);
                canvas.height = height * (ratio || 1);
                if (limitContext) {
                    this.displayer.screenshotToCanvas(limitContext, scenePath, width, height, camera, ratio);
                    context.drawImage(canvas, 0, 0, width * (ratio || 1), height * (ratio || 1), 0, 0, width, height);
                    canvas.remove();
                }
                if (TeachingAidsPlugin.currentManager) {
                    await TeachingAidsPlugin.currentManager?.screenshotToCanvas(context, scenePath, width, height, camera);
                }
            },
            scenePreviewAsync: async function (scenePath, div, width, height, engine) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] scenePreview`);
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
                if (TeachingAidsPlugin.currentManager) {
                    await TeachingAidsPlugin.currentManager.scenePreview(scenePath, img);
                }
            },
            callbacksOn: function (name, listener) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.on(name, listener);
                }
                else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOnce: function (name, listener) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.on(name, listener);
                }
                else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOff: function (name, listener) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.off(name, listener);
                }
                else {
                    this.displayer.callbacks.off(name, listener);
                }
            },
            undo: function () {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] undo`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    return TeachingAidsPlugin.currentManager.viewContainerManager.undo();
                }
                return 0;
            },
            redo: function () {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] redo`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && !this.displayer.disableSerialization) {
                    return TeachingAidsPlugin.currentManager.viewContainerManager.redo();
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] cleanCurrentScene`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && this.displayer.isWritable) {
                    TeachingAidsPlugin.currentManager.cleanCurrentScene();
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
        if (TeachingAidsPlugin.options && !TeachingAidsPlugin.currentManager) {
            // console.log('onCreate', TeachingAidsPlugin.options);
            createTeachingAidsPluginManager(plugin, TeachingAidsPlugin.options, TeachingAidsPlugin.remake);
        }
    }
    // static onDestroy(plugin: TeachingAidsPlugin) {}
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance() {
        if (TeachingAidsPlugin.cursorAdapter) {
            if (TeachingAidsPlugin.options && TeachingAidsPlugin.options.useMultiViews) {
                TeachingAidsPlugin.logger.warn(`[TeachingAidsPlugin plugin] cursorAdapter is Invalid configuration data in MultiView`);
                return;
            }
            const _onAddedCursor = TeachingAidsPlugin.cursorAdapter.onAddedCursor;
            TeachingAidsPlugin.cursorAdapter.onAddedCursor = function (cursor) {
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
                _onAddedCursor.call(TeachingAidsPlugin.cursorAdapter, cursor);
            };
        }
    }
    get isReplay() {
        return isPlayer(this.displayer);
    }
    get callbackName() {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer, options, remake) {
        this.createCurrentManager(options, remake);
        if (isRoom(displayer)) {
            const state = displayer.state;
            if (state?.memberState) {
                TeachingAidsPlugin.currentManager?.onMemberChange(state.memberState);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
    }
    destroy() {
        super.destroy();
        TeachingAidsPlugin.currentManager?.destroy();
    }
}
// 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
Object.defineProperty(TeachingAidsPlugin, "kind", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "teaching-aids-plugin"
});
Object.defineProperty(TeachingAidsPlugin, "logger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        info: console.log,
        warn: console.warn,
        error: console.error,
    }
});
