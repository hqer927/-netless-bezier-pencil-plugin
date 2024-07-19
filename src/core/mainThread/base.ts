import { Group, Layer, Scene } from "spritejs";
import { IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IOffscreenCanvasOptionType, IRectType, IWorkerMessage } from "../types";
import { VNodeManager } from "../vNodeManager";
import type { MasterControlForWorker } from '../mainEngine';
import type { AppViewDisplayerManager, MainViewDisplayerManager } from "../../plugin/baseViewContainerManager";
import { EDataType, EMatrixrRelationType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import {isNumber, isEqual, cloneDeep} from "lodash";
import { SubTopThread, SubTopThreadImpl } from "./subTopThread";
import { SubLocalThread, SubLocalThreadImpl } from "./subLocalThread";
import { SubServiceThread, SubServiceThreadImpl } from "./subServiceThread";
import { Storage_Selector_key } from "../../collector/const";
import { Cursor_Hover_Id, Main_View_Id, Task_Time_Interval } from "../const";
import { MethodBuilderWorker } from "../msgEvent/forMainThread";
import { EmitEventType } from "../../plugin/types";
import { TextShape } from "../tools/text";
import { TextOptions } from "../../component/textEditor/types";
import { getRectMatrixrRelation } from "../utils";
import { DefaultAppliancePluginOptions } from "../../plugin/const";

export type ICanvasOptionType = IOffscreenCanvasOptionType;
export interface IMainThreadInitOption {
    container: HTMLDivElement;
    canvasOpt: ICanvasOptionType;
    layerOpt: ILayerOptionType;
    master: MasterControlForWorker;
    displayer: MainViewDisplayerManager | AppViewDisplayerManager;
    post(sp: Omit<IBatchMainMessage, 'render'>): void;
}
export interface ISubThreadInitOption {
    thread: MainThreadEngineImpl;
    vNodes: VNodeManager;
}
export interface ISubWorkerInitOption {
    thread: MainThreadEngine;
    viewId: string;
    vNodes: VNodeManager;
    topLayer: Group;
    localLayer: Group;
    serviceLayer: Group;
    fullLayer: Group;
}
export interface MainThreadEngine {
    readonly viewId: string;
    readonly fullLayer: Group;
    readonly topLayer: Group;
    readonly localLayer: Group;
    readonly serviceLayer: Group;
    readonly vNodes: VNodeManager;
    readonly master: MasterControlForWorker;
    setCameraOpt(cameraOpt: ICameraOpt): void;
    on(msg: IWorkerMessage): Promise<void>;
    post(sp: IMainMessage): void;
    destroy(): void;
}
export class MainThreadEngineImpl implements MainThreadEngine {
    viewId: string;
    fullLayer: Group;
    topLayer: Group;
    localLayer: Group;
    serviceLayer: Group;
    snapshotFullLayer?: Group;
    vNodes: VNodeManager;
    master: MasterControlForWorker;
    opt: IMainThreadInitOption
    private cameraOpt?: ICameraOpt;
    private scene: Scene;
    localWork: SubLocalThread;
    serviceWork: SubServiceThread;
    topWork: SubTopThread;
    private taskUpdateCameraId?: number;
    private debounceUpdateCameraId?: number;
    private debounceUpdateCache:Set<string> = new Set();
    private mainThreadPostId?: number | undefined;
    private combinePostMsg: Set<Omit<IBatchMainMessage, 'render'>> = new Set();
    private methodBuilder:MethodBuilderWorker;
    constructor(viewId: string, opt: IMainThreadInitOption) {
        this.viewId = viewId;
        this.opt = opt;
        this.scene = this.createScene({ ...opt.canvasOpt, container: opt.container });
        this.master = opt.master;
        const fullBufferSize = DefaultAppliancePluginOptions.bufferSize.full;
        const subBufferSize = DefaultAppliancePluginOptions.bufferSize.sub;
        this.fullLayer = this.createLayer('fullLayer', this.scene, { ...opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? fullBufferSize : subBufferSize });
        this.topLayer = this.createLayer('topLayer', this.scene, { ...opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? subBufferSize : subBufferSize });
        this.localLayer = this.createLayer('localLayer', this.scene, { ...opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? subBufferSize : subBufferSize });
        this.serviceLayer = this.createLayer('serviceLayer', this.scene, { ...opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? subBufferSize : subBufferSize });
        this.vNodes = new VNodeManager(viewId, this.scene);
        const subThreadOpt = {
            thread: this,
            vNodes: this.vNodes
        }
        this.localWork = new SubLocalThreadImpl(subThreadOpt);
        this.serviceWork = new SubServiceThreadImpl(subThreadOpt);
        this.topWork = new SubTopThreadImpl(subThreadOpt);
        this.vNodes.init(this.fullLayer);
        this.methodBuilder = new MethodBuilderWorker([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode, 
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode, 
            EmitEventType.ZIndexNode, EmitEventType.SetFontStyle,
            EmitEventType.SetPoint, EmitEventType.SetLock, EmitEventType.SetShapeOpt
        ]).registerForMainThread(this.localWork,this.serviceWork, this.scene);
    }
    post(msg: Omit<IBatchMainMessage, 'render'>): void {
        this.combinePostMsg.add(msg)
        this.runBatchPostData()
    }
    async on(msg: IWorkerMessage): Promise<void> {
        // const { undoTickerId } = msg;
        if(!await this.methodBuilder.consumeForMainThread(msg)) {
            const { msgType, toolsType, opt, dataType, workId, workState } = msg;
            const workIdStr = workId?.toString();
            switch (msgType) {
                case EPostMessageType.Destroy:
                    this.destroy();
                    break;
                case EPostMessageType.Clear:
                    this.clearAll();
                    break;
                case EPostMessageType.UpdateCamera:
                    await this.updateCamera(msg);
                    break;
                case EPostMessageType.UpdateTools:
                    if (toolsType && opt) {
                        const param = {
                            toolsType,
                            toolsOpt: opt
                        }
                        if (this.topWork.canUseTopLayer(toolsType)) {
                            this.topWork.setToolsOpt(param);
                        } else {
                            this.localWork.setToolsOpt(param);
                        }
                    }
                    break;
                case EPostMessageType.CreateWork:
                    if (workIdStr && opt && toolsType) {
                        if (this.topWork.canUseTopLayer(toolsType)) {
                            if (!this.topWork.getToolsOpt()) {
                                this.topWork.setToolsOpt({
                                    toolsType,
                                    toolsOpt: opt,
                                })
                            }
                            this.topWork.setWorkOptions(workIdStr, opt)
                            break;
                        }
                        if (!this.localWork.getToolsOpt()) {
                            this.localWork.setToolsOpt({
                                toolsType,
                                toolsOpt: opt,
                            })
                        }
                        this.localWork.setWorkOptions(workIdStr, opt);
                    }
                    break;
                case EPostMessageType.DrawWork:
                    if (workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                        this.consumeDrawAll(dataType, msg);
                    } else {
                        this.consumeDraw(dataType, msg);
                    }
                    break;
                case EPostMessageType.UpdateNode:
                case EPostMessageType.FullWork:
                    if (toolsType && this.topWork.canUseTopLayer(toolsType)) {
                        this.consumeDrawAll(dataType, msg);
                        break;
                    }
                    this.consumeFull(dataType, msg);
                    break;
                case EPostMessageType.RemoveNode:
                    await this.removeNode(msg);
                    return;
                case EPostMessageType.Select:
                    if (dataType === EDataType.Service) {
                        if (workId === Storage_Selector_key) {
                            this.localWork.updateFullSelectWork(msg);
                        } else {
                            this.serviceWork.runSelectWork(msg);
                        }
                    }
                    break;
                case EPostMessageType.CursorHover:
                    this.localWork.cursorHover(msg);
                    break;
                case EPostMessageType.GetTextActive:
                    if (dataType === EDataType.Local) {
                        this.localWork.checkTextActive(msg);
                    }
                    break;
            }
        }
    }
    private async removeNode(data: IWorkerMessage) {
        const {dataType, workId, removeIds} = data;
        const workIds = removeIds || [];
        if (workId) {
            workIds.push(workId.toString());
        }
        if (workIds.length) {
            for (const id of workIds) {
                if (id === Storage_Selector_key) {
                    await this.localWork.removeSelector(data);
                    continue;
                }
                if(dataType === EDataType.Local){
                    this.localWork.removeWork(data)
                } else if(dataType === EDataType.Service){
                    this.serviceWork.removeWork(data)
                }
                await this.localWork.colloctEffectSelectWork(data)
            }
        }
    }
    async consumeFull(type: EDataType, data: IWorkerMessage) {
        const noLocalEffectData = await this.localWork.colloctEffectSelectWork(data);
        if (noLocalEffectData && type === EDataType.Local) {
            await this.localWork.consumeFull(noLocalEffectData, this.scene);
        }
        if (noLocalEffectData && type === EDataType.Service) {
            this.serviceWork.consumeFull(noLocalEffectData);
        }
    }
    setCameraOpt(cameraOpt: ICameraOpt): void {
        this.cameraOpt = cameraOpt;
        const { scale, centerX, centerY, width, height } = cameraOpt;
        if (width !== this.scene.width || height !== this.scene.height) {
            this.updateScene({ width, height });
        }
        this.fullLayer.setAttribute('scale', [scale, scale]);
        this.fullLayer.setAttribute('translate', [-centerX, -centerY]);
        this.topLayer.setAttribute('scale', [scale, scale]);
        this.topLayer.setAttribute('translate', [-centerX, -centerY]);
        this.localLayer.setAttribute('scale', [scale, scale]);
        this.localLayer.setAttribute('translate', [-centerX, -centerY]);
        this.serviceLayer.setAttribute('scale', [scale, scale]);
        this.serviceLayer.setAttribute('translate', [-centerX, -centerY]);
    }
    private runBatchPostData() {
        if (!this.mainThreadPostId) {
            this.mainThreadPostId = requestAnimationFrame(this.combinePost.bind(this));
        }
    }
    private combinePostData(): IBatchMainMessage {
        this.mainThreadPostId = undefined;
        const sp: Array<IMainMessage> = [];
        let drawCount: number | undefined = undefined;
        for (const value of this.combinePostMsg.values()) {
            if (value.sp?.length) {
                for (const newSpData of value.sp) {
                    let isSame = false
                    for (const spData of sp) {
                        if (isEqual(newSpData, spData)) {
                            isSame = true;
                            break;
                        }
                    }
                    if (!isSame) {
                        sp.push(newSpData);
                    }
                }
            }
            if (isNumber(value.drawCount)) {
                drawCount = value.drawCount;
            }
        }
        this.combinePostMsg.clear();
        return {
            sp,
            drawCount
        }
    }
    combinePost() {
        const msg = this.combinePostData();
        const rsp = msg.sp?.filter(s => s.type !== EPostMessageType.None);
        if (rsp?.length) {
            msg.sp = rsp.map(p => {
                if (!p.viewId) {
                    return { ...p, viewId: this.viewId }
                }
                return p;
            });
        } else {
            delete msg.sp;
        }
        if (msg.drawCount === undefined) {
            delete msg.drawCount;
        }
        if (msg?.drawCount || msg.sp?.length) {
            this.opt.post(msg);
        }
    }
    clearAll() {
        if (this.fullLayer.children.length) {
            (this.fullLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.fullLayer.removeAllChildren();
        }
        this.localWork.clearAll();
        this.topWork.clearAll();
        this.serviceWork.clearAll();
        this.vNodes.clear();
        this.post({
            sp:[{
                type: EPostMessageType.Clear
            }]
        })
    }
    private consumeDrawAll(type: EDataType, data: IWorkerMessage): void {
        const { toolsType, workId } = data;
        if (workId) {
            const workIdStr = workId.toString();
            if (toolsType && this.topWork.canUseTopLayer(toolsType)) {
                if (type === EDataType.Local) {
                    const workShapeNode = this.topWork.getLocalWorkShape(workId.toString());
                    if (!workShapeNode) {
                        this.topWork.createLocalWork(data);
                    }
                }
                this.topWork.consumeDrawAll(data);
                return;
            }
            if (type === EDataType.Local) {
                const workShapeNode = this.localWork.getWorkShape(workIdStr);
                if (!workShapeNode) {
                    this.localWork.createLocalWork(data);
                }
                this.localWork.consumeDrawAll(data, this.serviceWork);
            }
        }
        return;
    }
    private consumeDraw(dataType: EDataType, data: IWorkerMessage): void {
        const { opt, workId, toolsType } = data;
        if (workId && toolsType && opt) {
            const workIdStr = workId.toString();
            if (this.topWork.canUseTopLayer(toolsType)) {
                if (dataType === EDataType.Local) {
                    const workShapeNode = this.topWork.getLocalWorkShape(workIdStr);
                    if (!workShapeNode) {
                        this.topWork.createLocalWork(data)
                    }
                }
                this.topWork.consumeDraw(data);
                return;
            }
            if (dataType === EDataType.Local) {
                const workShapeNode = this.localWork.getWorkShape(workIdStr);
                if (!workShapeNode) {
                    this.localWork.createLocalWork(data)
                }
                this.localWork.consumeDraw(data, this.serviceWork);
            } else if (dataType === EDataType.Service) {
                this.serviceWork.consumeDraw(data);
            }
            return;
        }
    }
    private async updateCamera(msg: IWorkerMessage) {
        const { cameraOpt, scenePath } = msg;
        if (cameraOpt && !isEqual(this.cameraOpt, cameraOpt)) {
            if (this.taskUpdateCameraId) {
                clearTimeout(this.taskUpdateCameraId)
                this.taskUpdateCameraId = undefined;
            }
            if (scenePath) {
                let isWaitting:boolean = false;
                for (const [key, value] of this.localWork.getWorkShapes().entries()) {
                    if(value.toolsType !== EToolsKey.Text && value.toolsType !== EToolsKey.Eraser && value.toolsType !== EToolsKey.Selector
                        && value.toolsType !== EToolsKey.LaserPen && key !== Cursor_Hover_Id && key !== Storage_Selector_key) {
                        isWaitting = true;
                        break;
                    }
                } 
                if (isWaitting) {
                    this.taskUpdateCameraId = setTimeout(()=>{
                        this.taskUpdateCameraId = undefined;
                        this.updateCamera(msg);
                    }, Task_Time_Interval ) as unknown as number;
                    return;
                }
            }
            const diffRectMap = new Map<string, IRectType>();
            for (const [name,value] of this.vNodes.getNodesByType(EToolsKey.Text).entries()) {
                const rect = value.rect;
                diffRectMap.set(name, cloneDeep(rect));
            }
            const highLevelIds = new Set(diffRectMap.keys())
            let isHasLocalSelector = false;
            if (this.localWork.hasSelector()) {
                const selectIds = this.localWork.getSelector()?.selectIds;
                if (selectIds) {
                    isHasLocalSelector = true;
                    for (const id of selectIds) {
                        highLevelIds.add(id)
                    }
                }
            }
            let isHasServiceSelector = false;
            if (this.serviceWork.selectorWorkShapes.size) {
                for (const value of this.serviceWork.selectorWorkShapes.values()) {
                    const selectIds = value.selectIds;
                    if (selectIds) {
                        isHasServiceSelector = true;
                        for (const id of selectIds) {
                            highLevelIds.add(id)
                        }
                    }
                }
            }
            this.setCameraOpt(cameraOpt);
            if (this.vNodes.curNodeMap.size) {
                this.vNodes.clearTarget()
                this.vNodes.updateHighLevelNodesRect(highLevelIds);
                if (this.debounceUpdateCameraId) {
                    clearTimeout(this.debounceUpdateCameraId);
                }
                for (const [name,r] of diffRectMap.entries()) {
                    const value = this.vNodes.get(name);
                    if (value) {
                        const oldRect = r;
                        const newRect = value.rect;
                        const boxRect = this.getSceneRect();
                        const oldRelation = getRectMatrixrRelation(oldRect, boxRect);
                        const newRelation = getRectMatrixrRelation(newRect, boxRect);
                        let isForceUpdate = false;
                        if (oldRelation !== newRelation) {
                            isForceUpdate = true;
                        } else if(oldRect.w !== newRect.w || oldRect.h !== newRect.h) {
                            isForceUpdate = true;
                        } else if (newRelation === EMatrixrRelationType.intersect) {
                            isForceUpdate = true;
                        }
                        if (isForceUpdate) {
                            const {toolsType, opt} = value;
                            if (toolsType === EToolsKey.Text && (opt as TextOptions).workState === EvevtWorkState.Done) {
                                this.debounceUpdateCache.add(name);
                            }
                        }
                    }
                }
                if (isHasLocalSelector) {
                    this.localWork.reRenderSelector();
                }
                if (isHasServiceSelector) {
                    for (const [key, value] of this.serviceWork.selectorWorkShapes.entries()) {
                        this.serviceWork.runSelectWork({
                            workId: key,
                            selectIds: value.selectIds,
                            msgType: EPostMessageType.Select,
                            dataType: EDataType.Service,
                            viewId: this.viewId
                        })
                    }
                }
                this.debounceUpdateCameraId = setTimeout(()=>{
                    this.debounceUpdateCameraId = undefined;
                    const promises:Promise<IRectType|undefined>[] = [];
                    for (const name of this.debounceUpdateCache.values()) {
                        const node = this.fullLayer?.getElementsByName(name)[0] as Group;
                        if (node) {
                            const value = this.vNodes.get(name);
                            if (value) {
                                const {toolsType, opt, rect} = value;
                                const workShape = this.localWork.setFullWork({
                                    toolsType,
                                    opt,
                                    workId: name,
                                })
                                if (workShape) {
                                    const boxRect = this.getSceneRect();
                                    const newRelation = getRectMatrixrRelation(rect, boxRect);
                                    promises.push((workShape as TextShape).consumeServiceAsync({
                                        isFullWork: true,
                                        replaceId: name,
                                        isDrawLabel: newRelation !== EMatrixrRelationType.outside
                                    }))
                                }
                            }
                        }
                        this.debounceUpdateCache.delete(name)
                    }
                    this.vNodes.updateLowLevelNodesRect();
                    this.vNodes.clearHighLevelIds();
                }, Task_Time_Interval) as unknown as number;
            }
        }
    }
    private getSceneRect():IRectType {
        const {width, height} = this.scene;
        return {
            x: 0,
            y: 0,
            w: Math.floor(width),
            h: Math.floor(height)
        }
    }
    private createScene(opt: ICanvasOptionType) {
        return new Scene({
            displayRatio: this.opt.displayer.dpr,
            depth: false,
            desynchronized: true,
            ...opt,
            autoRender: true,
            id: this.viewId
        });
    }
    private createLayer(name: string, scene: Scene, opt: ILayerOptionType) {
        const { width, height } = opt;
        const sy = `canvas-${name}`;
        const layer = scene.layer(sy, { ...opt, offscreen: false });
        const group = new Group({
            anchor: [0.5, 0.5],
            pos: [width * 0.5, height * 0.5],
            size: [width, height],
            name: 'viewport',
            id: name,
        })
        layer.append(group);
        return group;
    }
    private updateScene(offscreenCanvasOpt: ICanvasOptionType) {
        this.scene.attr({ ...offscreenCanvasOpt });
        const { width, height } = offscreenCanvasOpt;
        this.scene.width = width;
        this.scene.height = height;
        this.updateLayer({ width, height });
    }
    private updateLayer(layerOpt: ILayerOptionType) {
        const { width, height } = layerOpt;
        (this.fullLayer.parent as Layer).setAttribute('width', width);
        (this.fullLayer.parent as Layer).setAttribute('height', height);
        this.fullLayer.setAttribute('size', [width, height]);
        this.fullLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        (this.topLayer.parent as Layer).setAttribute('width', width);
        (this.topLayer.parent as Layer).setAttribute('height', height);
        this.topLayer.setAttribute('size', [width, height]);
        this.topLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        (this.localLayer.parent as Layer).setAttribute('width', width);
        (this.localLayer.parent as Layer).setAttribute('height', height);
        this.localLayer.setAttribute('size', [width, height]);
        this.localLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
        (this.serviceLayer.parent as Layer).setAttribute('width', width);
        (this.serviceLayer.parent as Layer).setAttribute('height', height);
        this.serviceLayer.setAttribute('size', [width, height]);
        this.serviceLayer.setAttribute('pos', [width * 0.5, height * 0.5]);
    }
    destroy() {
        this.vNodes.clear();
        this.fullLayer.remove();
        this.topLayer.remove();
        this.localLayer.remove();
        this.serviceLayer.remove();
        this.scene.remove();
        this.localWork.destroy();
        this.serviceWork.destroy();
        this.topWork.destroy();
    }
}
