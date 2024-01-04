import { BezierPencilDisplayer } from "./bezierPencilDisplayer";
import { Collector } from "../collector";
import { DisplayStateEnum, EmitEventType, EStrokeType, InternalMsgEmitterType } from "./types";
import { isRoom, toJS, ApplianceNames } from "white-web-sdk";
import { EToolsKey, EvevtWorkState } from "../core/enum";
// import throttle from "lodash/throttle";
import { rgbToHex } from "../collector/utils/color";
import { MainEngineForWorker } from "../core";
import throttle from "lodash/throttle";
// import debounce from "lodash/debounce";
export class BezierPencilManager {
    constructor(plugin, options) {
        Object.defineProperty(this, "plugin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pluginOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "room", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onCameraChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (cameraState) => {
                this.worker?.setCameraOpt(toJS(cameraState));
            }
        });
        Object.defineProperty(this, "onSceneChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((sceneState) => {
                this.collector?.setNamespace(sceneState.sceneName);
                this.worker?.clearAll(true);
                this.worker?.initSyncData(() => { });
            }, 100, { 'leading': false })
        });
        Object.defineProperty(this, "onMemberChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((memberState) => {
                if (!this.room) {
                    return;
                }
                const currentApplianceName = memberState.currentApplianceName;
                const toolsKey = currentApplianceName === ApplianceNames.pencil && memberState.useLaserPen ? EToolsKey.LaserPen :
                    currentApplianceName === ApplianceNames.eraser || currentApplianceName === ApplianceNames.pencilEraser ? EToolsKey.Eraser :
                        currentApplianceName === ApplianceNames.pencil && memberState.useNewPencil ? EToolsKey.Pencil :
                            currentApplianceName === ApplianceNames.selector ? EToolsKey.Selector : EToolsKey.Clicker;
                const opt = {
                    color: rgbToHex(memberState.strokeColor[0], memberState.strokeColor[1], memberState.strokeColor[2]),
                    opacity: memberState?.strokeOpacity || 1,
                };
                if (toolsKey === EToolsKey.Pencil) {
                    opt.thickness = memberState.strokeWidth;
                    opt.strokeType = memberState?.strokeType || EStrokeType.Normal;
                }
                else if (toolsKey === EToolsKey.Eraser) {
                    opt.thickness = Math.min(3, Math.max(1, Math.floor(memberState.pencilEraserSize || 3))) - 1;
                    opt.isLine = currentApplianceName === ApplianceNames.eraser && true;
                }
                else if (toolsKey === EToolsKey.LaserPen) {
                    opt.thickness = memberState.strokeWidth;
                    opt.duration = memberState?.duration || 1;
                    opt.strokeType = memberState?.strokeType || EStrokeType.Normal;
                }
                this.worker?.setCurrentToolsData({
                    toolsType: toolsKey,
                    toolsOpt: opt,
                });
                if (toolsKey === EToolsKey.Selector) {
                    BezierPencilDisplayer.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode], this.linstenerSelector.bind(this));
                    BezierPencilDisplayer.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.SetColorNode], this.linstenerSelector.bind(this));
                    BezierPencilDisplayer.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.ScaleNode], this.linstenerSelector.bind(this));
                    BezierPencilDisplayer.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode], this.linstenerSelector.bind(this));
                }
                else {
                    BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode], this.linstenerSelector.bind(this));
                    BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.SetColorNode], this.linstenerSelector.bind(this));
                    BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.ScaleNode], this.linstenerSelector.bind(this));
                    BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode], this.linstenerSelector.bind(this));
                }
                if (toolsKey === EToolsKey.Eraser || toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ||
                    toolsKey === EToolsKey.Selector) {
                    if (toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen) {
                        this.room.disableDeviceInputs = true;
                        setTimeout(() => {
                            const eventTraget = BezierPencilDisplayer.instance.containerRef?.parentNode?.children[0];
                            if (eventTraget) {
                                eventTraget.className = eventTraget.className + ' cursor-pencil';
                            }
                        }, 0);
                    }
                    else {
                        this.room.disableDeviceInputs = false;
                    }
                    this.worker?.abled();
                    return;
                }
                this.room.disableDeviceInputs = false;
                this.worker?.unabled();
            }, 100, { 'leading': false })
        });
        this.plugin = plugin;
        this.room = isRoom(plugin.displayer) ? plugin.displayer : undefined;
        this.pluginOptions = options;
        window.onbeforeunload = () => {
            this.onUnMountDisplayer();
        };
    }
    init() {
        BezierPencilDisplayer.floatBarColors = this.room?.floatBarOptions?.colors || [];
        BezierPencilDisplayer.InternalMsgEmitter.on(InternalMsgEmitterType.DisplayState, this.displayStateListener.bind(this));
    }
    cleanCurrentScene() {
        this.worker?.clearAll();
    }
    destroy() {
        BezierPencilDisplayer.InternalMsgEmitter.off(InternalMsgEmitterType.DisplayState, this.displayStateListener.bind(this));
    }
    displayStateListener(value) {
        if (value === DisplayStateEnum.mounted) {
            this.onMountDisplayer();
        }
        if (value === DisplayStateEnum.unmounted) {
            this.onUnMountDisplayer();
        }
    }
    linstenerSelector(data) {
        if (this.room && data.workState === EvevtWorkState.Start) {
            this.room.disableDeviceInputs = true;
        }
        else if (this.room && data.workState === EvevtWorkState.Done) {
            this.room.disableDeviceInputs = false;
        }
    }
    onWritableChange(isWritable) {
        if (!isWritable) {
            this.worker?.unabled();
        }
        else {
            this.worker?.abled();
        }
    }
    onMountDisplayer() {
        const div = BezierPencilDisplayer.instance?.containerRef;
        const floatCanvas = BezierPencilDisplayer.instance?.canvasFloatRef;
        const bgCanvas = BezierPencilDisplayer.instance?.canvasBgRef;
        if (floatCanvas && bgCanvas && div) {
            this.collector = new Collector(this.plugin);
            this.worker = new MainEngineForWorker(BezierPencilDisplayer.instance, this.collector, this.pluginOptions, BezierPencilDisplayer.InternalMsgEmitter);
            this.collector.addStorageStateListener((diff) => {
                if (diff) {
                    if (this.collector?.storage) {
                        const curKeys = Object.keys(this.collector.storage);
                        if (curKeys.length === 0) {
                            this.worker?.clearAll(true);
                            return;
                        }
                        if (this.worker) {
                            let maxLayerIndex = 0;
                            for (const key of curKeys) {
                                const item = this.collector.storage[key];
                                if (item) {
                                    maxLayerIndex = Math.max(maxLayerIndex, (item.opt?.zIndex || 0));
                                }
                            }
                            this.worker.maxLayerIndex = maxLayerIndex;
                        }
                    }
                    if (this.worker) {
                        const relevantId = this.worker.getRelevantWork(diff);
                        Object.keys(diff).forEach((key) => {
                            const item = diff[key];
                            if (item) {
                                this.worker?.onServiceDerive(key, item, relevantId);
                            }
                        });
                    }
                }
            });
            setTimeout(() => {
                this.worker?.initSyncData();
            }, 200);
        }
    }
    onUnMountDisplayer() {
        this.collector?.destroy();
        this.worker?.destroy();
        this.collector = undefined;
        this.worker = undefined;
    }
}
