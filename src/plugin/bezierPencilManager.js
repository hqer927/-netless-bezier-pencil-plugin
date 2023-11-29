import { BezierPencilDisplayer } from "./bezierPencilDisplayer";
import { Collector } from "../collector";
import { DisplayStateEnum, EStrokeType } from "./types";
import { isRoom, toJS, ApplianceNames } from "white-web-sdk";
import { EDataType, EToolsKey } from "../core/enum";
import throttle from "lodash/throttle";
import { rgbToHex } from "../collector/utils/color";
import { MainEngineForWorker } from "../core";
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
        Object.defineProperty(this, "resizeChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const div = BezierPencilDisplayer.instance?.containerRef;
                if (div) {
                    const width = div.offsetWidth;
                    const height = div.offsetHeight;
                    this.worker?.updateCanvas({
                        width,
                        height
                    }, EDataType.Local);
                    const bgCanvas = BezierPencilDisplayer.instance?.canvasBgRef;
                    const floatCanvas = BezierPencilDisplayer.instance?.canvasFloatRef;
                    if (bgCanvas && floatCanvas) {
                        floatCanvas.style.width = `${width}px`;
                        floatCanvas.style.height = `${height}px`;
                        bgCanvas.style.width = `${width}px`;
                        bgCanvas.style.height = `${height}px`;
                    }
                }
            }
        });
        Object.defineProperty(this, "_throttled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle(this.resizeChange, 500, { 'leading': false })
        });
        Object.defineProperty(this, "mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0) {
                    this.worker?.onLocalEventStart([e.offsetX, e.offsetY]);
                }
            }
        });
        Object.defineProperty(this, "mousemove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.worker?.onLocalEventDoing([e.offsetX, e.offsetY]);
            }
        });
        Object.defineProperty(this, "mouseup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0) {
                    this.worker?.onLocalEventEnd([e.offsetX, e.offsetY]);
                }
            }
        });
        Object.defineProperty(this, "touchstart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.worker?.onLocalEventStart([e.targetTouches[0].pageX, e.targetTouches[0].pageY]);
            }
        });
        Object.defineProperty(this, "touchmove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.worker?.onLocalEventDoing([e.targetTouches[0].pageX, e.targetTouches[0].pageY]);
            }
        });
        Object.defineProperty(this, "touchend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.worker?.onLocalEventEnd([e.changedTouches[0].pageX, e.changedTouches[0].pageY]);
            }
        });
        this.plugin = plugin;
        this.room = isRoom(plugin.displayer) ? plugin.displayer : undefined;
        this.pluginOptions = options;
    }
    init() {
        BezierPencilDisplayer.InternalMsgEmitter.on('displayState', this.displayStateListener);
    }
    cleanCurrentScene() {
        this.worker?.clearAll();
    }
    destroy() {
        BezierPencilDisplayer.InternalMsgEmitter.off('displayState', this.displayStateListener);
    }
    displayStateListener(value) {
        if (value === DisplayStateEnum.mounted) {
            this.onMountDisplayer();
        }
        if (value === DisplayStateEnum.unmounted) {
            this.onUnMountDisplayer();
        }
    }
    onCameraChange(cameraState) {
        this.worker?.setCameraOpt(toJS(cameraState));
    }
    onSceneChange(sceneState) {
        this.collector?.setNamespace(sceneState.sceneName);
        this.worker?.clearAll(true);
        this.worker?.initSyncData(() => { });
    }
    onMemberChange(memberState) {
        if (!this.room) {
            return;
        }
        const currentApplianceName = memberState.currentApplianceName;
        const toolsKey = currentApplianceName === ApplianceNames.pencil && memberState.useLaserPen ? EToolsKey.LaserPen :
            currentApplianceName === ApplianceNames.eraser ? EToolsKey.Eraser :
                currentApplianceName === ApplianceNames.pencil ? EToolsKey.Pencil : EToolsKey.Clicker;
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
        if (currentApplianceName === ApplianceNames.eraser || currentApplianceName === ApplianceNames.pencil) {
            if (currentApplianceName === ApplianceNames.pencil) {
                this.room.disableDeviceInputs = true;
            }
            this.worker?.abled();
        }
        else {
            this.room.disableDeviceInputs = false;
            this.worker?.unabled();
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
            floatCanvas.width = div.offsetWidth;
            floatCanvas.height = div.offsetHeight;
            bgCanvas.width = div.offsetWidth;
            bgCanvas.height = div.offsetHeight;
            this.collector = new Collector(this.plugin);
            this.worker = new MainEngineForWorker(bgCanvas, floatCanvas, this.collector, this.pluginOptions, BezierPencilDisplayer.InternalMsgEmitter);
            this.collector.addStorageStateListener((key, diffOne) => {
                // console.log('STATE',key,diffOne)
                if (key === 'screen' && diffOne.newValue) {
                    const { w, h } = diffOne.newValue;
                    if (w && h) {
                        if (bgCanvas && floatCanvas) {
                            bgCanvas.width = w;
                            bgCanvas.height = h;
                            floatCanvas.width = w;
                            floatCanvas.height = h;
                        }
                        // todo 等比例缩放
                        this.worker?.updateCanvas({
                            width: w,
                            height: h
                        }, EDataType.Service);
                    }
                }
                else {
                    this.worker?.onServiceDerive(key, diffOne);
                }
            });
            this.worker.initSyncData((key, value) => {
                if (key === 'screen' && value) {
                    const { w, h } = value;
                    if (w && h) {
                        if (bgCanvas && floatCanvas) {
                            bgCanvas.width = w;
                            bgCanvas.height = h;
                            floatCanvas.width = w;
                            floatCanvas.height = h;
                        }
                    }
                }
            });
            this.bindDisplayerEvent(div);
            this.resizeChange();
        }
    }
    onUnMountDisplayer() {
        const div = BezierPencilDisplayer.instance?.containerRef;
        if (div) {
            this.removeDisplayerEvent(div);
        }
        this.collector?.destroy();
        this.worker?.destroy();
        this.collector = undefined;
        this.worker = undefined;
    }
    bindDisplayerEvent(div) {
        div.addEventListener('mousedown', this.mousedown, true);
        div.addEventListener('mousemove', this.mousemove, true);
        div.addEventListener('mouseup', this.mouseup, true);
        div.addEventListener('mouseleave', this.mouseup, true);
        div.addEventListener('touchstart', this.touchstart, true);
        div.addEventListener('touchmove', this.touchmove, true);
        div.addEventListener('touchend', this.touchend, true);
        window.addEventListener('resize', this._throttled);
    }
    removeDisplayerEvent(div) {
        div.removeEventListener('mousedown', this.mousedown);
        div.removeEventListener('mousemove', this.mousemove);
        div.removeEventListener('mouseup', this.mouseup);
        div.removeEventListener('mouseleave', this.mouseup);
        div.removeEventListener('touchstart', this.touchstart);
        div.removeEventListener('touchmove', this.touchmove);
        div.removeEventListener('touchend', this.touchend);
        window.removeEventListener('resize', this._throttled);
    }
}
