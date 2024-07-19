/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvisiblePlugin, isRoom, isPlayer, RoomPhase} from "./external";
import { Camera, ImageInformation, RenderEngine, Room, RoomState, Displayer, 
    AppliancePluginAttributes, AppliancePluginOptions, AppliancePluginInstance, Logger, MemberState,
    _MemberState, ApplianceAdaptor, canBindMethodType, RoomMember, ApplianceNames } from "./types";
import { computRectangle } from "../core/utils";
import type { WindowManager } from "./multi/applianceMultiManager";
import { ApplianceMultiManager } from "./multi/applianceMultiManager";
import { DefaultAppliancePluginOptions } from "./const";
/**
 * 多窗口教具
 */
export class ApplianceMultiPlugin extends InvisiblePlugin<AppliancePluginAttributes, any> {
    // 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
    static readonly kind: string = "appliance-multi-plugin";
    static currentManager?: ApplianceMultiManager;
    public static logger: Logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
    };
    public static options: AppliancePluginOptions = DefaultAppliancePluginOptions;
    public static async getInstance(remake: WindowManager, adaptor: ApplianceAdaptor): Promise<AppliancePluginInstance> {
        if (!adaptor.options.cdn.fullWorkerUrl && !adaptor.options.cdn.subWorkerUrl) {
            ApplianceMultiPlugin.logger.error(`[ApplianceMultiPlugin] you must adaptor options cdn fullWorkerUrl and subWorkerUrl`);
        }
        const _d = remake.displayer;
        const originCallBacksOn = _d.callbacks.on;
        const originCallBacksOff = _d.callbacks.off;
        const originCallBacksOnce = _d.callbacks.once;
        const originCleanCurrentScene = remake.cleanCurrentScene;
        const originSetMemberState = remake.mainView.setMemberState;
        if (adaptor?.logger) {
            ApplianceMultiPlugin.logger = adaptor.logger;
        }
        if (adaptor.options) {
            ApplianceMultiPlugin.options = {...DefaultAppliancePluginOptions,...adaptor.options};
        }
        let _ApplianceMultiPlugin = _d.getInvisiblePlugin(ApplianceMultiPlugin.kind) as ApplianceMultiPlugin | undefined;
        if (_d && _ApplianceMultiPlugin) {
            ApplianceMultiPlugin.createCurrentManager(remake, ApplianceMultiPlugin.options, 
                _ApplianceMultiPlugin);
        }
        if (!_ApplianceMultiPlugin && isRoom(_d)) {
            _ApplianceMultiPlugin = await ApplianceMultiPlugin.createApplianceMultiPlugin(_d as Room, ApplianceMultiPlugin.kind);
        }
        if (_ApplianceMultiPlugin && ApplianceMultiPlugin.currentManager) {
            ApplianceMultiPlugin.currentManager.bindPlugin(_ApplianceMultiPlugin);
            _ApplianceMultiPlugin.init(_d);
        }
        const origin = {
            displayer: _d,
            windowManager: remake,
            currentManager: ApplianceMultiPlugin.currentManager,
            maxScreenshotWidth: 10 * 1024,
            maxScreenshotHeight: 10 * 1024,
            getBoundingRectAsync: async function (scenePath: string) {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] getBoundingRectAsync`);
                const originRect = (remake.mainView || _d).getBoundingRect(scenePath);
                const pluginRect = await ApplianceMultiPlugin.currentManager?.getBoundingRect(scenePath);
                if (!originRect.width || !originRect.height) {
                    return pluginRect;
                }
                return computRectangle(originRect, pluginRect)
            },
            screenshotToCanvasAsync: async function (context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number) {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] screenshotToCanvasAsync`);
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
                    (remake.mainView || _d).screenshotToCanvas(limitContext, scenePath, _w, _h, camera, ratio);
                    context.drawImage(canvas, Math.floor((width - _w) / 2), Math.floor((height - _h) / 2), _w * (ratio || 1), _h * (ratio || 1), 0, 0, _w, _h);
                    canvas.remove();
                }
                if (ApplianceMultiPlugin.currentManager) {
                    await ApplianceMultiPlugin.currentManager?.screenshotToCanvas(context, scenePath, _w, _h, camera, Math.floor((width - _w) / 2), Math.floor((height - _h) / 2));
                }
            },
            scenePreviewAsync: async function (scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine) {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] scenePreview`);
                (remake.mainView || _d).scenePreview(scenePath, div, width, height, engine);
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
                if (ApplianceMultiPlugin.currentManager) {
                    await ApplianceMultiPlugin.currentManager.scenePreview(scenePath, img);
                }
            },
            _callbacksOn: function (name: string, listener: any) {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiManager.InternalMsgEmitter.on(name, listener);
                } else {
                    originCallBacksOn.call(_d.callbacks, name, listener);
                }
            },
            _callbacksOnce: function (name: string, listener: any) {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiManager.InternalMsgEmitter.on(name, listener);
                } else {
                    originCallBacksOnce.call(_d.callbacks, name, listener);
                }
            },
            _callbacksOff: function (name?: string, listener?: any) {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] callbacks ${name}`);
                if ((name === 'onCanUndoStepsUpdate' || name === 'onCanRedoStepsUpdate') && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiManager.InternalMsgEmitter.off(name, listener);
                } else {
                    originCallBacksOff.call(_d.callbacks, name, listener);
                }
            },
            undo: function () {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] undo`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && !(_d as Room).disableSerialization) {
                    return ApplianceMultiPlugin.currentManager.viewContainerManager.undo();
                }
                return 0;
            },
            redo: function () {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] redo`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && !(_d as Room).disableSerialization) {
                    return ApplianceMultiPlugin.currentManager.viewContainerManager.redo();
                }
                return 0;
            },
            cleanCurrentScene: function () {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] cleanCurrentScene`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiPlugin.currentManager.cleanCurrentScene();
                    originCleanCurrentScene.call(remake);
                }
            },
            insertImage:function(imageInfo: ImageInformation){
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] insertImage`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiPlugin.currentManager.worker.insertImage(imageInfo);
                }
            },
            lockImage:function(uuid: string, locked: boolean){
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] lockImage`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiPlugin.currentManager.worker.lockImage(uuid, locked);
                }
            },
            completeImageUpload:function(uuid: string, src: string){
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] completeImageUpload`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && (_d as Room).isWritable) {
                    ApplianceMultiPlugin.currentManager.worker.completeImageUpload(uuid, src);
                }
            },
            getImagesInformation:function(scenePath: string){
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] completeImageUpload`);
                if (ApplianceMultiPlugin.currentManager && isRoom(_d) && (_d as Room).isWritable) {
                    return ApplianceMultiPlugin.currentManager.worker.getImagesInformation(scenePath);
                }
                return []
            },
            callbacks:() => {
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] callbacks bind`);
                return {
                    ..._d.callbacks,
                    on: origin._callbacksOn.bind(origin),
                    once: origin._callbacksOnce.bind(origin),
                    off: origin._callbacksOff.bind(origin),
                }
            },
            destroy(){
                if (ApplianceMultiPlugin.currentManager) {
                    ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] destroy`);
                    ApplianceMultiPlugin.currentManager.destroy();
                    ApplianceMultiPlugin.currentManager = undefined;
                }
            },
            setMemberState(modifyState: Partial<MemberState>){
                ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] setMemberState`);
                const keys = Object.keys(modifyState);
                if (keys.includes('currentApplianceName')) {
                    if(modifyState['currentApplianceName'] && modifyState['currentApplianceName'] === ApplianceNames.laserPen){
                        modifyState['currentApplianceName'] = ApplianceNames.pencil;
                        modifyState.useLaserPen = true;
                    } else if(modifyState['currentApplianceName'] && modifyState['currentApplianceName'] === ApplianceNames.pencil){
                        modifyState.useLaserPen = false;
                    }
                }
                originSetMemberState.call(remake.mainView, modifyState as _MemberState);
            }
        }
        const injectMethodToObject = (object:any, methodName:canBindMethodType) => {
            ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] injectMethodToObject ${methodName}`);
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
        injectMethodToObject(remake, 'undo');
        injectMethodToObject(remake, 'redo');
        injectMethodToObject(remake,'cleanCurrentScene');
        injectMethodToObject(remake,'insertImage');
        injectMethodToObject(remake,'completeImageUpload');
        injectMethodToObject(remake,'lockImage');
        injectMethodToObject(_d,'getImagesInformation');
        injectMethodToObject(_d,'callbacks');
        injectMethodToObject(_d,'screenshotToCanvasAsync');
        injectMethodToObject(_d,'getBoundingRectAsync');
        injectMethodToObject(_d,'scenePreviewAsync');
        injectMethodToObject(remake.mainView,'setMemberState');
        return {
            ...origin,
            callbacks:origin.callbacks()
        };
    }
    static onCreate(plugin: InvisiblePlugin<AppliancePluginAttributes, any> ) {
        if (plugin && ApplianceMultiPlugin.currentManager) {
            ApplianceMultiPlugin.currentManager.bindPlugin(plugin as ApplianceMultiPlugin);
            (plugin as ApplianceMultiPlugin).init(plugin.displayer);
        }
    }
    static async createApplianceMultiPlugin(d:Room, kind:string):Promise<ApplianceMultiPlugin> {
        await (d as Room).createInvisiblePlugin(
            ApplianceMultiPlugin,
            {}
        );
        let _ApplianceMultiPlugin = d.getInvisiblePlugin(kind) as ApplianceMultiPlugin | undefined;
        if (!_ApplianceMultiPlugin) {
            _ApplianceMultiPlugin = await ApplianceMultiPlugin.createApplianceMultiPlugin(d,kind);
        }
        return _ApplianceMultiPlugin;
    }
    static createCurrentManager = (remake:WindowManager, options:AppliancePluginOptions, plugin:ApplianceMultiPlugin) => {
        if (ApplianceMultiPlugin.currentManager) {
            ApplianceMultiPlugin.currentManager.destroy();
        }
        if (options && remake) {
            const param = {
                plugin,
                displayer: remake.displayer,
                options
            }
            const bezierManager = new ApplianceMultiManager(param);
            ApplianceMultiPlugin.logger.info(`[ApplianceMultiPlugin] refresh ApplianceMultiManager object`);
            bezierManager.setWindowManager(remake);
            ApplianceMultiPlugin.currentManager = bezierManager;
        }
    }
    // static onDestroy(plugin: ApplianceMultiPlugin) {}
    private get isReplay(): boolean {
        return isPlayer(this.displayer);
    }
    private get callbackName(): string {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer: Displayer){
        if (isRoom(displayer)) {
            const state = (displayer as Room).state;
            ApplianceMultiPlugin.currentManager?.onMemberChange(state.memberState as MemberState);
            ApplianceMultiPlugin.currentManager?.onRoomMembersChange(state.roomMembers as RoomMember[]);
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
    }
    private onPhaseChanged = (phase:RoomPhase) => {
        if (phase === RoomPhase.Reconnecting) {
            ApplianceMultiPlugin.currentManager?.setSnapshootData();
        }
    }
    private updateRoomWritable = () => {
        ApplianceMultiPlugin.currentManager?.onWritableChange((this.displayer as Room).isWritable);
    }
    private roomStateChangeListener = async (state: RoomState) => {
        if (isRoom(this.displayer) && !(this.displayer as Room).isWritable) {
            return;
        }
        if (state.memberState) {
            ApplianceMultiPlugin.currentManager?.onMemberChange(state.memberState as MemberState);
        }
        if (state?.roomMembers) {
            ApplianceMultiPlugin.currentManager?.onRoomMembersChange(state.roomMembers);
        }
    }
    override destroy(): void {
        ApplianceMultiPlugin.logger.info('[ApplianceMultiPlugin] passive destroy');
        ApplianceMultiPlugin.currentManager?.destroy();
        ApplianceMultiPlugin.currentManager = undefined;
    }
}