/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Camera, Cursor, RenderEngine, Room, RoomState} from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
import { InvisiblePlugin, isRoom, Displayer, isPlayer, RoomPhase, ApplianceNames } from "white-web-sdk";
import { TeachingAidsPluginAttributes, TeachingAidsPluginOptions, DisplayerForPlugin, Logger, MemberState, TeachingAidsAdaptor } from "./types";
import { computRectangle } from "../core/utils";
import { CursorTool } from "@netless/cursor-tool";
import { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
import { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";

async function createTeachingAidsPlugin(d:Room, kind:string):Promise<TeachingAidsPlugin> {
    await (d as Room).createInvisiblePlugin(
        TeachingAidsPlugin,
        {}
    );
    let teachingAidsPlugin = d.getInvisiblePlugin(kind) as TeachingAidsPlugin | undefined;
    if (!teachingAidsPlugin) {
        teachingAidsPlugin = await createTeachingAidsPlugin(d,kind);
    }
    return teachingAidsPlugin;
}
function createTeachingAidsPluginManager(plugin: TeachingAidsPlugin, options:TeachingAidsPluginOptions, remake?:WindowManager) {
    if (plugin && options) {
        const displayer = plugin.displayer;
        plugin.init(displayer, options, remake);
    }
}
export class TeachingAidsPlugin extends InvisiblePlugin<TeachingAidsPluginAttributes, any> {
    // 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
    static readonly kind: string = "teaching-aids-plugin";
    static cursorAdapter: CursorTool;
    static remake?: WindowManager;
    static currentManager?: TeachingAidsSingleManager | TeachingAidsMultiManager;
    public static logger: Logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
    };
    public static options?: TeachingAidsPluginOptions;
    public static async getInstance(remake: Displayer | WindowManager, adaptor?: TeachingAidsAdaptor): Promise<DisplayerForPlugin> {
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
        const _d = remake instanceof WindowManager ? (remake as WindowManager).displayer : remake;
        let teachingAidsPlugin = _d.getInvisiblePlugin(TeachingAidsPlugin.kind);
        if (!teachingAidsPlugin && isRoom(_d) ) {
            teachingAidsPlugin = await createTeachingAidsPlugin(_d as Room, TeachingAidsPlugin.kind);
            if (remake instanceof WindowManager) {
                if (!TeachingAidsPlugin.options?.useMultiViews) {
                    TeachingAidsPlugin.logger.error(`[TeachingAidsPlugin plugin] getInstance has Invalid parameter, please use options.useMultiViews = true`);
                }
            }
        }
        if (teachingAidsPlugin && TeachingAidsPlugin.options && !TeachingAidsPlugin.currentManager) {
            // console.log('getInstance', TeachingAidsPlugin.options);
            createTeachingAidsPluginManager(teachingAidsPlugin as TeachingAidsPlugin, TeachingAidsPlugin.options, TeachingAidsPlugin.remake);
        }
        const origin = {
            plugin: teachingAidsPlugin,
            displayer: _d,
            getBoundingRectAsync: async function (scenePath: string) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] getBoundingRect`);
                const originRect = this.displayer.getBoundingRect(scenePath);
                const pluginRect = await TeachingAidsPlugin.currentManager?.getBoundingRect(scenePath);
                return computRectangle(originRect, pluginRect)
            },
            screenshotToCanvasAsync: async function (context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number) {
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
            scenePreviewAsync: async function (scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine) {
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
            callbacksOn: function (name: string, listener: any) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.on(name, listener);
                } else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOnce: function (name: string, listener: any) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.on(name, listener);
                } else {
                    this.displayer.callbacks.on(name, listener);
                }
            },
            callbacksOff: function (name?: string, listener?: any) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsSingleManager.InternalMsgEmitter.off(name, listener);
                } else {
                    this.displayer.callbacks.off(name, listener);
                }
            },
            undo: function () {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] undo`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && !(this.displayer as Room).disableSerialization) {
                    return TeachingAidsPlugin.currentManager.viewContainerManager.undo();
                }
                return 0;
            },
            redo: function () {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] redo`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && !(this.displayer as Room).disableSerialization) {
                    return TeachingAidsPlugin.currentManager.viewContainerManager.redo();
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt?: boolean) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] cleanCurrentScene`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsPlugin.currentManager.cleanCurrentScene();
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
    static onCreate(plugin: InvisiblePlugin<TeachingAidsPluginAttributes, any> ) {
        if (TeachingAidsPlugin.options && !TeachingAidsPlugin.currentManager) {
            // console.log('onCreate', TeachingAidsPlugin.options);
            createTeachingAidsPluginManager(plugin as TeachingAidsPlugin, TeachingAidsPlugin.options, TeachingAidsPlugin.remake);
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
            TeachingAidsPlugin.cursorAdapter.onAddedCursor = function (cursor: Cursor) {
                cursor.onCursorMemberChanged = (c: any)=>{
                    try {
                        if (
                            c.appliance === ApplianceNames.pencil ||
                            c.appliance === ApplianceNames.shape ||
                            c.appliance === ApplianceNames.text ||
                            c.appliance === ApplianceNames.arrow ||
                            c.appliance === ApplianceNames.straight ||
                            c.appliance === ApplianceNames.rectangle ||
                            c.appliance === ApplianceNames.ellipse
                        ) {
                            if (cursor?.divElement) {
                                cursor.divElement.style.display='none';
                            }
                        } else if (cursor?.divElement) {
                            cursor.divElement.style.display='block';
                        }
                    } catch (error) { /* empty */ }
                }
                _onAddedCursor.call(TeachingAidsPlugin.cursorAdapter,cursor);
            }
        }
    }
    private get isReplay(): boolean {
        return isPlayer(this.displayer);
    }
    private get callbackName(): string {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer: Displayer, options: TeachingAidsPluginOptions, remake?:WindowManager){
        this.createCurrentManager(options, remake);
        if (isRoom(displayer)) {
            const state = (displayer as Room).state;
            if (state?.memberState) {
                TeachingAidsPlugin.currentManager?.onMemberChange(state.memberState as MemberState);
            }
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
            TeachingAidsPlugin.currentManager?.destroy();
        }
    };
    private updateRoomWritable = () => {
        TeachingAidsPlugin.currentManager?.onWritableChange((this.displayer as Room).isWritable);
    }
    private roomStateChangeListener = async (state: RoomState) => {
        if (TeachingAidsPlugin.currentManager instanceof TeachingAidsSingleManager) {
            if (state.cameraState) {
                (TeachingAidsPlugin.currentManager as TeachingAidsSingleManager).onCameraChange(state.cameraState);
            }
            if (state.sceneState) {
                TeachingAidsPlugin.currentManager.onSceneChange(state.sceneState.scenePath, 'mainView');
            }
        }
        if (isRoom(this.displayer) && !(this.displayer as Room).isWritable) {
            return;
        }
        if (state.memberState) {
            TeachingAidsPlugin.currentManager?.onMemberChange(state.memberState as MemberState);
        }
        if (state?.roomMembers) {
            TeachingAidsPlugin.currentManager?.onRoomMembersChange(state.roomMembers);
        }
    }
    private createCurrentManager = (options:TeachingAidsPluginOptions, remake?:WindowManager) => {
        if (TeachingAidsPlugin.currentManager) {
            TeachingAidsPlugin.currentManager.destroy();
        }
        let bezierManager: TeachingAidsMultiManager | TeachingAidsSingleManager;
        if (options && options.useMultiViews && remake) {
            bezierManager = new TeachingAidsMultiManager(this, options);
            TeachingAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsMultiManager object`);
            bezierManager.setWindowManager(remake);
        } else {
            bezierManager = new TeachingAidsSingleManager(this, options);
            bezierManager.init();
            TeachingAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsSingleManager object`);
        }
        TeachingAidsPlugin.currentManager = bezierManager;
    }
    override destroy(): void {
        super.destroy();
        TeachingAidsPlugin.currentManager?.destroy();
    }
}