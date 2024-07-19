/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvisiblePlugin, isRoom, isPlayer, RoomPhase } from "./external";
import { Camera, Cursor, CursorAdapter, ImageInformation, RenderEngine, Room, RoomState, 
    AppliancePluginAttributes, AppliancePluginOptions, AppliancePluginInstance, Logger, MemberState, 
    ApplianceAdaptor, canBindMethodType, Displayer, ApplianceNames, _MemberState, 
    RoomMember} from "./types";
import { computRectangle } from "../core/utils";
import { ApplianceSingleManager } from "./single/applianceSingleManager";
import { DefaultAppliancePluginOptions } from "./const";
import { Main_View_Id } from "../core";
/**
 * 单白板教具
 */
export class ApplianceSinglePlugin extends InvisiblePlugin<AppliancePluginAttributes, any> {
    // 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
    static readonly kind: string = "appliance-aids-single-plugin";
    static cursorAdapter?: CursorAdapter;
    static currentManager?: ApplianceSingleManager;
    public static logger: Logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
    };
    public static options: AppliancePluginOptions = DefaultAppliancePluginOptions;
    public static async getInstance(remake: Displayer, adaptor: ApplianceAdaptor): Promise<AppliancePluginInstance> {
        const originCallBacksOn = remake.callbacks.on;
        const originCallBacksOff = remake.callbacks.off;
        const originCallBacksOnce = remake.callbacks.once;
        const originCleanCurrentScene = (remake as Room).cleanCurrentScene.bind(remake);
        const originSetMemberState = (remake as Room).setMemberState.bind(remake);
        if (adaptor?.logger) {
            ApplianceSinglePlugin.logger = adaptor.logger;
        }
        if (adaptor.options) {
            ApplianceSinglePlugin.options = {...DefaultAppliancePluginOptions,...adaptor.options};
        }
        let appliancePlugin = remake.getInvisiblePlugin(ApplianceSinglePlugin.kind) as ApplianceSinglePlugin | undefined;
        if (remake && appliancePlugin) {
            ApplianceSinglePlugin.createCurrentManager(remake, ApplianceSinglePlugin.options, 
                appliancePlugin);
        }
        if (!appliancePlugin && isRoom(remake)) {
            appliancePlugin = await ApplianceSinglePlugin.createAppliancePlugin(remake as Room, ApplianceSinglePlugin.kind);
        }
        if (appliancePlugin && ApplianceSinglePlugin.currentManager) {
            ApplianceSinglePlugin.currentManager.bindPlugin(appliancePlugin);
            appliancePlugin.init(remake);
        }
        if (adaptor?.cursorAdapter) {
            ApplianceSinglePlugin.cursorAdapter = adaptor.cursorAdapter;
        }
        ApplianceSinglePlugin.effectInstance();
        const origin = {
            displayer: remake,
            currentManager: ApplianceSinglePlugin.currentManager,
            maxScreenshotWidth: 10 * 1024,
            maxScreenshotHeight: 10 * 1024,
            _injectTargetObject: undefined,
            getBoundingRectAsync: async function (scenePath: string) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] getBoundingRectAsync`);
                const originRect = remake.getBoundingRect(scenePath);
                const pluginRect = await ApplianceSinglePlugin.currentManager?.getBoundingRect(scenePath);
                if (!originRect.width || !originRect.height) {
                    return pluginRect;
                }
                return computRectangle(originRect, pluginRect)
            },
            screenshotToCanvasAsync: async function (context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] screenshotToCanvasAsync`);
                let _w = width;
                let _h = height;
                let scale:number = camera.scale;
                if (_w > this.maxScreenshotWidth) {
                    scale = this.maxScreenshotWidth / _w * scale;
                    _w = this.maxScreenshotWidth
                }
                if (_h > this.maxScreenshotHeight) {
                    scale = Math.min(this.maxScreenshotHeight / _h * scale, scale);
                    _h = this.maxScreenshotHeight
                }
                camera.scale = scale;
                const canvas = document.createElement("canvas");
                const limitContext = canvas.getContext("2d");
                canvas.width = _w * (ratio || 1);
                canvas.height = _h * (ratio || 1);
                if (limitContext) {
                    remake.screenshotToCanvas(limitContext, scenePath, _w, _h, camera, ratio);
                    context.drawImage(canvas, Math.floor((width - _w) / 2), Math.floor((height - _h) / 2), _w * (ratio || 1), _h * (ratio || 1), 0, 0, _w, _h);
                    canvas.remove();
                }
                if (ApplianceSinglePlugin.currentManager) {
                    await ApplianceSinglePlugin.currentManager?.screenshotToCanvas(context, scenePath, _w, _h, camera, Math.floor((width - _w) / 2), Math.floor((height - _h) / 2));
                }
            },
            scenePreviewAsync: async function (scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] scenePreview`);
                remake.scenePreview(scenePath, div, width, height, engine);
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
                if (ApplianceSinglePlugin.currentManager) {
                    await ApplianceSinglePlugin.currentManager.scenePreview(scenePath, img);
                }
            },
            _callbacksOn: function (name: string, listener: any) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSingleManager.InternalMsgEmitter.on(name, listener);
                } else {
                    originCallBacksOn.call(remake.callbacks, name, listener);
                }
            },
            _callbacksOnce: function (name: string, listener: any) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSingleManager.InternalMsgEmitter.on(name, listener);
                } else {
                    originCallBacksOnce.call(remake.callbacks, name, listener);
                }
            },
            _callbacksOff: function (name?: string, listener?: any) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSingleManager.InternalMsgEmitter.off(name, listener);
                } else {
                    originCallBacksOff.call(remake.callbacks, name, listener);
                }
            },
            undo: function () {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] undo`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && !(remake as Room).disableSerialization) {
                    return ApplianceSinglePlugin.currentManager.viewContainerManager.undo();
                }
                return 0;
            },
            redo: function () {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] redo`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && !(remake as Room).disableSerialization) {
                    return ApplianceSinglePlugin.currentManager.viewContainerManager.redo();
                }
                return 0;
            },
            cleanCurrentScene: function (retainPpt?: boolean) {
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] cleanCurrentScene`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSinglePlugin.currentManager.cleanCurrentScene();
                    originCleanCurrentScene.call(remake, retainPpt);
                }
            },
            insertImage:function(imageInfo: ImageInformation){
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] insertImage`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSinglePlugin.currentManager.worker.insertImage(imageInfo);
                }
            },
            lockImage:function(uuid: string, locked: boolean){
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] lockImage`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSinglePlugin.currentManager.worker.lockImage(uuid, locked);
                }
            },
            completeImageUpload:function(uuid: string, src: string){
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] completeImageUpload`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && (remake as Room).isWritable) {
                    ApplianceSinglePlugin.currentManager.worker.completeImageUpload(uuid, src);
                }
            },
            getImagesInformation:function(scenePath: string){
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] completeImageUpload`);
                if (ApplianceSinglePlugin.currentManager && isRoom(remake) && (remake as Room).isWritable) {
                    return ApplianceSinglePlugin.currentManager.worker.getImagesInformation(scenePath);
                }
                return []
            },
            callbacks:() => {
                return {
                    ...remake.callbacks,
                    on: origin._callbacksOn.bind(origin),
                    once: origin._callbacksOnce.bind(origin),
                    off: origin._callbacksOff.bind(origin),
                }
            },
            destroy(){
                if (ApplianceSinglePlugin.currentManager) {
                    ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] destroy`);
                    ApplianceSinglePlugin.currentManager.destroy();
                    ApplianceSinglePlugin.currentManager = undefined;
                    ApplianceSinglePlugin.cursorAdapter = undefined;
                }
            },
            setMemberState(modifyState: Partial<MemberState>){
                ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] setMemberState`);
                const keys = Object.keys(modifyState);
                if (keys.includes('currentApplianceName')) {
                    if(modifyState['currentApplianceName'] && modifyState['currentApplianceName'] === ApplianceNames.laserPen){
                        modifyState['currentApplianceName'] = ApplianceNames.pencil;
                        modifyState.useLaserPen = true;
                    }else if(modifyState['currentApplianceName'] && modifyState['currentApplianceName'] === ApplianceNames.pencil){
                        modifyState.useLaserPen = false;
                    }
                }
                originSetMemberState(modifyState as _MemberState);
            }
        }
        const injectMethodToObject = (object:any, methodName:canBindMethodType) => {
            ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] injectMethodToObject ${methodName}`);
            if (typeof object[methodName] === 'function' || typeof object[methodName] === 'undefined') {
                object[methodName] = origin[methodName];
                return;
            }
            if (methodName === 'callbacks') {
                object.callbacks.on = origin._callbacksOn.bind(origin);
                object.callbacks.off = origin._callbacksOff.bind(origin);
                object.callbacks.once = origin._callbacksOnce.bind(origin);
            }
        }
        injectMethodToObject(remake,'undo');
        injectMethodToObject(remake,'redo');
        injectMethodToObject(remake,'cleanCurrentScene');
        injectMethodToObject(remake,'insertImage');
        injectMethodToObject(remake,'completeImageUpload');
        injectMethodToObject(remake,'lockImage');
        injectMethodToObject(remake,'getImagesInformation');
        injectMethodToObject(remake,'callbacks');
        injectMethodToObject(remake,'screenshotToCanvasAsync');
        injectMethodToObject(remake,'getBoundingRectAsync');
        injectMethodToObject(remake,'scenePreviewAsync');
        injectMethodToObject(remake,'setMemberState');
        return {
            ...origin,
            callbacks:origin.callbacks()
        };
    }
    static onCreate(plugin: InvisiblePlugin<AppliancePluginAttributes, any> ) {
        if (plugin && ApplianceSinglePlugin.currentManager) {
            ApplianceSinglePlugin.currentManager.bindPlugin(plugin as ApplianceSinglePlugin);
            (plugin as ApplianceSinglePlugin).init(plugin.displayer);
        }
    }
    static async createAppliancePlugin(d:Room, kind:string):Promise<ApplianceSinglePlugin> {
        await (d as Room).createInvisiblePlugin(
            ApplianceSinglePlugin,
            {}
        );
        let appliancePlugin = d.getInvisiblePlugin(kind) as ApplianceSinglePlugin | undefined;
        if (!appliancePlugin) {
            appliancePlugin = await ApplianceSinglePlugin.createAppliancePlugin(d,kind);
        }
        return appliancePlugin;
    }
    static createCurrentManager = (displayer:Displayer, options:AppliancePluginOptions, plugin?:ApplianceSinglePlugin) => {
        if (ApplianceSinglePlugin.currentManager) {
            ApplianceSinglePlugin.currentManager.destroy();
        }
        const param = {
            plugin,
            displayer,
            options
        }
        const bezierManager = new ApplianceSingleManager(param);
        bezierManager.init();
        ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] refresh ApplianceSingleManager object`);
        ApplianceSinglePlugin.currentManager = bezierManager;
    }
    // static onDestroy(plugin: AppliancePlugin) {}
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance() {
        if (ApplianceSinglePlugin.cursorAdapter) {
            const _onAddedCursor = ApplianceSinglePlugin.cursorAdapter.onAddedCursor as any;
            (ApplianceSinglePlugin.cursorAdapter as any).onAddedCursor = function (cursor: Cursor) {
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
                _onAddedCursor.call(ApplianceSinglePlugin.cursorAdapter,cursor);
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
                ApplianceSinglePlugin.currentManager?.onMemberChange(state.memberState as MemberState);
                ApplianceSinglePlugin.currentManager?.onRoomMembersChange(state.roomMembers as RoomMember[]);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
    }
    private onPhaseChanged = (phase:RoomPhase) => {
        if (phase === RoomPhase.Reconnecting) {
            ApplianceSinglePlugin.currentManager?.setSnapshootData();
        }
    }
    private updateRoomWritable = () => {
        ApplianceSinglePlugin.currentManager?.onWritableChange((this.displayer as Room).isWritable);
    }
    private roomStateChangeListener = async (state: RoomState) => {
        if (ApplianceSinglePlugin.currentManager instanceof ApplianceSingleManager) {
            if (state.cameraState) {
                (ApplianceSinglePlugin.currentManager as ApplianceSingleManager).onCameraChange(state.cameraState);
            }
            if (state.sceneState) {
                ApplianceSinglePlugin.currentManager.onSceneChange(state.sceneState.scenePath, Main_View_Id);
            }
        }
        if (isRoom(this.displayer) && !(this.displayer as Room).isWritable) {
            return;
        }
        if (state.memberState) {
            ApplianceSinglePlugin.currentManager?.onMemberChange(state.memberState as MemberState);
        }
        if (state?.roomMembers) {
            ApplianceSinglePlugin.currentManager?.onRoomMembersChange(state.roomMembers);
        }
    }
    override destroy(): void {
        ApplianceSinglePlugin.logger.info(`[ApplianceSinglePlugin] passive destroy`);
        ApplianceSinglePlugin.currentManager?.destroy();
        ApplianceSinglePlugin.currentManager = undefined;
        ApplianceSinglePlugin.cursorAdapter = undefined;
    }
}