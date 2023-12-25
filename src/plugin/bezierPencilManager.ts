/* eslint-disable @typescript-eslint/no-explicit-any */
import { BezierPencilPlugin, BezierPencilPluginOptions } from "./bezierPencilPlugin";
import { BezierPencilDisplayer } from "./bezierPencilDisplayer";
import { Collector } from "../collector";
import { DisplayStateEnum, EmitEventType, EStrokeType, InternalMsgEmitterType, MemberState } from "./types";
import { Room, isRoom, CameraState, toJS, SceneState, ApplianceNames } from "white-web-sdk";
import { EToolsKey, EvevtWorkState } from "../core/enum";
import { BaseShapeOptions, EraserOptions, PencilOptions } from "../core/tools";
// import throttle from "lodash/throttle";
import { rgbToHex } from "../collector/utils/color";
import { MainEngineForWorker} from "../core";
import { LaserPenOptions } from "../core/tools/laserPen";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

export class BezierPencilManager {
    private plugin: BezierPencilPlugin;
    private pluginOptions?: BezierPencilPluginOptions;
    private collector?: Collector;
    private worker?: MainEngineForWorker;
    private room?: Room;
    constructor(plugin: BezierPencilPlugin, options?: BezierPencilPluginOptions) {
        this.plugin = plugin;
        this.room = isRoom(plugin.displayer) ? plugin.displayer as Room : undefined;
        this.pluginOptions = options;
        window.onbeforeunload = () => {
            this.onUnMountDisplayer();
        }
    }
    public init() {
        BezierPencilDisplayer.floatBarColors = (this.room as any)?.floatBarOptions?.colors || [];
        BezierPencilDisplayer.InternalMsgEmitter.on(InternalMsgEmitterType.DisplayState, this.displayStateListener.bind(this));
    }
    public cleanCurrentScene() {
        this.worker?.clearAll();
    }
    public destroy() {
        BezierPencilDisplayer.InternalMsgEmitter.off(InternalMsgEmitterType.DisplayState,this.displayStateListener.bind(this));
    }
    private displayStateListener(value: DisplayStateEnum) {
        if (value === DisplayStateEnum.mounted) {
            this.onMountDisplayer();
        }
        if (value === DisplayStateEnum.unmounted) {
            this.onUnMountDisplayer();
        }
    }
    onCameraChange = debounce((cameraState: CameraState) => {
        this.worker?.setCameraOpt(toJS(cameraState))
    }, 100, {'leading':false})
    onSceneChange = throttle((sceneState: SceneState) => {
        this.collector?.setNamespace(sceneState.sceneName);
        this.worker?.clearAll(true);
        this.worker?.initSyncData(()=>{});
    }, 100, {'leading':false})
    onMemberChange = throttle((memberState: MemberState) => {
        if(!this.room){
            return ;
        }
        const currentApplianceName = memberState.currentApplianceName as ApplianceNames;
        const toolsKey = currentApplianceName === ApplianceNames.pencil && memberState.useLaserPen ? EToolsKey.LaserPen : 
            currentApplianceName === ApplianceNames.eraser ? EToolsKey.Eraser : 
            currentApplianceName === ApplianceNames.pencil ? EToolsKey.Pencil : 
            currentApplianceName === ApplianceNames.selector ? EToolsKey.Selector : EToolsKey.Clicker ;
        const opt:BaseShapeOptions = {
            color: rgbToHex(memberState.strokeColor[0], memberState.strokeColor[1], memberState.strokeColor[2]),
            opacity: memberState?.strokeOpacity || 1,
        };
        if (toolsKey === EToolsKey.Pencil) {
            (opt as PencilOptions).thickness = memberState.strokeWidth;
            (opt as PencilOptions).strokeType = memberState?.strokeType || EStrokeType.Stroke;
        } else if(toolsKey === EToolsKey.Eraser) {
            (opt as EraserOptions).thickness = memberState.strokeWidth;
            (opt as EraserOptions).isLine = memberState?.isLine || false;
        } else if(toolsKey === EToolsKey.LaserPen) {
            (opt as LaserPenOptions).thickness = memberState.strokeWidth;
            (opt as LaserPenOptions).duration = memberState?.duration || 1;
            (opt as PencilOptions).strokeType = memberState?.strokeType || EStrokeType.Normal;
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
        } else {
            BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode], this.linstenerSelector.bind(this));
            BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.SetColorNode], this.linstenerSelector.bind(this));
            BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.ScaleNode], this.linstenerSelector.bind(this));
            BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode], this.linstenerSelector.bind(this));
        }
        if ( currentApplianceName === ApplianceNames.eraser || currentApplianceName === ApplianceNames.pencil || 
            currentApplianceName === ApplianceNames.selector ) {
            if (currentApplianceName === ApplianceNames.pencil) {
                this.room.disableDeviceInputs = true;
            } else {
                this.room.disableDeviceInputs = false;
            }
            this.worker?.abled()
            return;
        }
        this.room.disableDeviceInputs = false;
        this.worker?.unabled()
    }, 100, {'leading':false})
    private linstenerSelector(data:{workState: EvevtWorkState}) {
        if (this.room && data.workState === EvevtWorkState.Start) {
            this.room.disableDeviceInputs = true;
        }
        else if (this.room && data.workState === EvevtWorkState.Done) {
            this.room.disableDeviceInputs = false;
        }
    }
    public onWritableChange(isWritable:boolean) {
        if(!isWritable){
            this.worker?.unabled();
        } else {
            this.worker?.abled();
        }
    }
    private onMountDisplayer(){
        const div = BezierPencilDisplayer.instance?.containerRef;
        const floatCanvas = BezierPencilDisplayer.instance?.canvasFloatRef;
        const bgCanvas = BezierPencilDisplayer.instance?.canvasBgRef;
        if (floatCanvas && bgCanvas && div) {
            this.collector = new Collector(this.plugin);
            this.worker = new MainEngineForWorker(BezierPencilDisplayer.instance, this.collector, this.pluginOptions, BezierPencilDisplayer.InternalMsgEmitter);
            this.collector.addStorageStateListener((diff)=>{
                //console.log('STATE',key,diffOne)
                if(diff){
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
            })
            this.worker.initSyncData()
        }
    }
    private onUnMountDisplayer(){
        this.collector?.destroy();
        this.worker?.destroy();
        this.collector = undefined;
        this.worker = undefined;
    }
}