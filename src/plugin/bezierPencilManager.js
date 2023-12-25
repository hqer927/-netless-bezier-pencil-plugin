import { BezierPencilDisplayer } from "./bezierPencilDisplayer";
import { Collector } from "../collector";
import { DisplayStateEnum, EmitEventType, EStrokeType, InternalMsgEmitterType } from "./types";
import { isRoom, toJS, ApplianceNames } from "white-web-sdk";
import { EToolsKey, EvevtWorkState } from "../core/enum";
// import throttle from "lodash/throttle";
import { rgbToHex } from "../collector/utils/color";
import { MainEngineForWorker } from "../core";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
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
            value: debounce((cameraState) => {
                this.worker?.setCameraOpt(toJS(cameraState));
            }, 100, { 'leading': false })
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
                    currentApplianceName === ApplianceNames.eraser ? EToolsKey.Eraser :
                        currentApplianceName === ApplianceNames.pencil ? EToolsKey.Pencil :
                            currentApplianceName === ApplianceNames.selector ? EToolsKey.Selector : EToolsKey.Clicker;
                const opt = {
                    color: rgbToHex(memberState.strokeColor[0], memberState.strokeColor[1], memberState.strokeColor[2]),
                    opacity: memberState?.strokeOpacity || 1,
                };
                if (toolsKey === EToolsKey.Pencil) {
                    opt.thickness = memberState.strokeWidth;
                    opt.strokeType = memberState?.strokeType || EStrokeType.Stroke;
                }
                else if (toolsKey === EToolsKey.Eraser) {
                    opt.thickness = memberState.strokeWidth;
                    opt.isLine = memberState?.isLine || false;
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
                if (currentApplianceName === ApplianceNames.selector) {
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
                if (currentApplianceName === ApplianceNames.eraser || currentApplianceName === ApplianceNames.pencil ||
                    currentApplianceName === ApplianceNames.selector) {
                    if (currentApplianceName === ApplianceNames.pencil) {
                        this.room.disableDeviceInputs = true;
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
                //console.log('STATE',key,diffOne)
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
                    for (const key of Object.keys(diff)) {
                        const item = diff[key];
                        if (item) {
                            this.worker?.onServiceDerive(key, item);
                        }
                    }
                }
            });
            this.worker.initSyncData();
        }
    }
    onUnMountDisplayer() {
        this.collector?.destroy();
        this.worker?.destroy();
        this.collector = undefined;
        this.worker = undefined;
    }
}
