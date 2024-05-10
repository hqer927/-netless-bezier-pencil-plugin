/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Camera, Cursor, ImageInformation, RenderEngine, Room, RoomState} from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
import { InvisiblePlugin, isRoom, Displayer, isPlayer, ApplianceNames } from "white-web-sdk";
import { TeachingAidsPluginAttributes, TeachingAidsPluginOptions, DisplayerForPlugin, Logger, MemberState, TeachingAidsAdaptor, TeachingAidsManagerLike } from "./types";
import { computRectangle } from "../core/utils";
import { CursorTool } from "@netless/cursor-tool";
import { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
import { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";
import { ECanvasContextType } from "../core/enum";

export class TeachingAidsPlugin extends InvisiblePlugin<TeachingAidsPluginAttributes, any> {
    // 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
    static readonly kind: string = "teaching-aids-plugin";
    static cursorAdapter?: CursorTool;
    static windowManager?: WindowManager;
    static currentManager?: TeachingAidsManagerLike;
    public static logger: Logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
    };
    public static options: TeachingAidsPluginOptions = {
        syncOpt: {
            interval: 300,
        },
        canvasOpt: {
            contextType: ECanvasContextType.Canvas2d
        }
    }
    public static async getInstance(remake: Displayer | WindowManager, adaptor?: TeachingAidsAdaptor): Promise<DisplayerForPlugin> {
        const isMulti = remake instanceof WindowManager;
        TeachingAidsPlugin.windowManager = isMulti && remake || undefined;
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
        const _d = isMulti ? (remake as WindowManager).displayer : remake;
        let teachingAidsPlugin = _d.getInvisiblePlugin(TeachingAidsPlugin.kind) as TeachingAidsPlugin | undefined;
        // console.log('teachingAidsPlugin', teachingAidsPlugin, _d, TeachingAidsPlugin.windowManager)
        if (_d) {
            TeachingAidsPlugin.createCurrentManager(_d, TeachingAidsPlugin.options, 
                teachingAidsPlugin, TeachingAidsPlugin.windowManager);
        }
        if (!teachingAidsPlugin && isRoom(_d)) {
            teachingAidsPlugin = await TeachingAidsPlugin.createTeachingAidsPlugin(_d as Room, TeachingAidsPlugin.kind);
        }
        if (teachingAidsPlugin && TeachingAidsPlugin.currentManager) {
            // console.log('teachingAidsPlugin--1', teachingAidsPlugin, _d, TeachingAidsPlugin.windowManager)
            TeachingAidsPlugin.currentManager.bindPlugin(teachingAidsPlugin);
            teachingAidsPlugin.init(_d);
        }
        const origin = {
            plugin: teachingAidsPlugin,
            displayer: _d,
            windowManager: isMulti && remake || undefined,
            getBoundingRectAsync: async function (scenePath: string) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] getBoundingRect`);
                const originRect = (this.windowManager && this.windowManager.mainView || this.displayer).getBoundingRect(scenePath);
                const pluginRect = await TeachingAidsPlugin.currentManager?.getBoundingRect(scenePath);
                if (!originRect.width || !originRect.height) {
                    return pluginRect;
                }
                return computRectangle(originRect, pluginRect)
            },
            screenshotToCanvasAsync: async function (context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] screenshotToCanvasAsync`);
                const canvas = document.createElement("canvas");
                const limitContext = canvas.getContext("2d");
                canvas.width = width * (ratio || 1);
                canvas.height = height * (ratio || 1);
                if (limitContext) {
                    (this.windowManager && this.windowManager.mainView || this.displayer).screenshotToCanvas(limitContext, scenePath, width, height, camera, ratio);
                    context.drawImage(canvas, 0, 0, width * (ratio || 1), height * (ratio || 1), 0, 0, width, height);
                    canvas.remove();
                }
                if (TeachingAidsPlugin.currentManager) {
                    await TeachingAidsPlugin.currentManager?.screenshotToCanvas(context, scenePath, width, height, camera);
                }
            },
            scenePreviewAsync: async function (scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine) {
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] scenePreview`);
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
            insertImage:function(imageInfo: ImageInformation){
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] insertImage`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsPlugin.currentManager.worker.insertImage(imageInfo);
                }
            },
            lockImage:function(uuid: string, locked: boolean){
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] lockImage`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsPlugin.currentManager.worker.lockImage(uuid, locked);
                }
            },
            completeImageUpload:function(uuid: string, src: string){
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] completeImageUpload`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    TeachingAidsPlugin.currentManager.worker.completeImageUpload(uuid, src);
                }
            },
            getImagesInformation:function(scenePath: string){
                TeachingAidsPlugin.logger.info(`[TeachingAidsSinglePlugin plugin] completeImageUpload`);
                if (TeachingAidsPlugin.currentManager && isRoom(this.displayer) && (this.displayer as Room).isWritable) {
                    return TeachingAidsPlugin.currentManager.worker.getImagesInformation(scenePath);
                }
                return []
            }
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
        // console.log('onCreate', plugin, TeachingAidsPlugin.options, TeachingAidsPlugin.windowManager);
        if (plugin && TeachingAidsPlugin.currentManager) {
            // console.log('teachingAidsPlugin--2', plugin, plugin.displayer, TeachingAidsPlugin.windowManager)
            TeachingAidsPlugin.currentManager.bindPlugin(plugin as TeachingAidsPlugin);
            (plugin as TeachingAidsPlugin).init(plugin.displayer);
        }
    }
    static async createTeachingAidsPlugin(d:Room, kind:string):Promise<TeachingAidsPlugin> {
        await (d as Room).createInvisiblePlugin(
            TeachingAidsPlugin,
            {}
        );
        // console.log('createTeachingAidsPlugin--1')
        let teachingAidsPlugin = d.getInvisiblePlugin(kind) as TeachingAidsPlugin | undefined;
        if (!teachingAidsPlugin) {
            // console.log('createTeachingAidsPlugin')
            teachingAidsPlugin = await TeachingAidsPlugin.createTeachingAidsPlugin(d,kind);
        }
        return teachingAidsPlugin;
    }
    static createCurrentManager = (displayer:Displayer, options:TeachingAidsPluginOptions, plugin?:TeachingAidsPlugin, remake?:WindowManager) => {
        if (TeachingAidsPlugin.currentManager) {
            // console.log('currentManager--destroy')
            TeachingAidsPlugin.currentManager.destroy();
        }
        let bezierManager: TeachingAidsMultiManager | TeachingAidsSingleManager;
        const param = {
            plugin,
            displayer,
            options
        }
        if (options && remake) {
            bezierManager = new TeachingAidsMultiManager(param);
            TeachingAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsMultiManager object`);
            bezierManager.setWindowManager(remake);
        } else {
            bezierManager = new TeachingAidsSingleManager(param);
            bezierManager.init();
            TeachingAidsPlugin.logger.info(`[TeachingAidsPlugin plugin] refresh TeachingAidsSingleManager object`);
        }
        TeachingAidsPlugin.currentManager = bezierManager;
    }
    // static onDestroy(plugin: TeachingAidsPlugin) {}
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance() {
        if (TeachingAidsPlugin.cursorAdapter) {
            if (TeachingAidsPlugin.options && TeachingAidsPlugin.windowManager) {
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
    init(displayer: Displayer){
        if (isRoom(displayer)) {
            const state = (displayer as Room).state;
            if (state?.memberState) {
                TeachingAidsPlugin.currentManager?.onMemberChange(state.memberState as MemberState);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        // this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
    }
    // private onPhaseChanged = (phase: RoomPhase): void => {
    //     if (phase === RoomPhase.Disconnected) {
    //         this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
    //         this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
    //         this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
    //         console.log('[TeachingAidsPlugin plugin] Disconnected');
    //     }
    //     if(phase === RoomPhase.Reconnecting){
    //         console.log('[TeachingAidsPlugin plugin] Reconnecting');
    //     }
    //     if (phase === RoomPhase.Connected) {
    //         console.log('[TeachingAidsPlugin plugin] Connected');
    //     }
    // };
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
    override destroy(): void {
        console.log('currentManager--destroy -- 1')
        TeachingAidsPlugin.currentManager?.destroy();
        TeachingAidsPlugin.currentManager = undefined;
        TeachingAidsPlugin.windowManager = undefined;
        TeachingAidsPlugin.cursorAdapter = undefined;
        // super.destroy();
    }
}