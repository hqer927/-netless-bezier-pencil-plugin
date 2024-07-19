import { Group, Layer, Path } from "spritejs";
import { EmitEventType } from "../../plugin/types";
import { ECanvasShowType, EDataType, EMatrixrRelationType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { MethodBuilderWorker } from "../msgEvent/forWorker";
import { SelectorShape } from "../tools";
import { IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessageRenderData, IRectType, IWorkerMessage } from "../types";
import { computRect, getRectMatrixrRelation, getSafetyRect } from "../utils";
import { ISubWorkerInitOption, IWorkerInitOption, WorkThreadEngineBase } from "./base";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
import { TopLayerWorkForSubWorker } from "./subWorkerTopLayer";
import { Storage_ViewId_ALL } from "../../collector/const";
import { Cursor_Hover_Id, Main_View_Id, Task_Time_Interval } from "../const";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import isNumber from "lodash/isNumber";
import { TextShape } from "../tools/text";
import { TextOptions } from "../../component/textEditor/types";
import { DefaultAppliancePluginOptions, pkg_version } from "../../plugin/const";
export enum EWorkThreadType {
    Full = "full",
    Sub = "sub"
}
export class WorkerManager<T extends WorkThreadEngineBase> {
    readonly _self: Worker;
    readonly version: string = pkg_version;
    protected type: EWorkThreadType;
    protected workThreadMap: Map<string, T> = new Map();
    constructor(worker:Worker, type:EWorkThreadType) {
        this._self = worker;
        this.type = type;
        this.register();
    }
    private init(value:IWorkerMessage){
        const {viewId,dpr,offscreenCanvasOpt,layerOpt, isSafari} = value;
        if (!dpr || !offscreenCanvasOpt || !layerOpt) {
            return;
        }  
        let workThread:T|undefined; 
        if (this.type === EWorkThreadType.Full) {
            workThread = new WorkThreadEngineForFullWorker(viewId, {
                dpr,
                offscreenCanvasOpt,
                layerOpt,
            }, this.post.bind(this)) as unknown as T;
        }
        if (this.type === EWorkThreadType.Sub) {
            workThread = new WorkThreadEngineForSubWorker(viewId, {
                dpr,
                offscreenCanvasOpt,
                layerOpt,
            }, this.post.bind(this))  as unknown as T;
        }
        if(workThread && isSafari){
            workThread.setIsSafari(isSafari);
        }
        if (workThread && value.cameraOpt) {
            workThread.setCameraOpt(value.cameraOpt);
        }
        workThread && this.workThreadMap.set(viewId, workThread);
    }
    private register(){
        onmessage = async (e: MessageEvent<Set<IWorkerMessage>>) => {
            const data = e.data;
            if (data) {
                for await (const value of data.values()) {
                    const {msgType, viewId, tasksqueue, mainTasksqueueCount} = value;
                    if (msgType === EPostMessageType.Console) {
                        console.log(this);
                        continue;
                    }
                    if (msgType === EPostMessageType.Init) {
                        this.init(value);
                        continue;
                    }
                    if (msgType === EPostMessageType.TasksQueue && tasksqueue?.size) {
                        for (const [viewId, workThread] of this.workThreadMap.entries()) {
                            const task = tasksqueue.get(viewId);
                            if (task) {
                                workThread.on(task);
                            }
                        }
                        if (this.type === EWorkThreadType.Full && isNumber(mainTasksqueueCount)) {
                            this.post({workerTasksqueueCount: mainTasksqueueCount});
                        }
                        continue;
                    } 
                    if (viewId === Storage_ViewId_ALL) {
                        for (const workThread of this.workThreadMap.values()) {
                            workThread.on(value);
                            if (msgType === EPostMessageType.Destroy) {
                                this.workThreadMap.delete(viewId);
                            }
                        }
                        continue;
                    }
                    const workThread = this.workThreadMap.get(viewId);
                    if (!workThread) {
                        continue;
                    }
                    await workThread.on(value);
                    if (msgType === EPostMessageType.Destroy) {
                        this.workThreadMap.delete(viewId);
                    }
                }
            }
        }
    }
    post(msg:IBatchMainMessage, transfer?: Transferable[]){
        if (transfer) {
            this._self.postMessage(msg, transfer)
        } else {
            this._self.postMessage(msg)
        } 
    }
}
/** full worker */
export class WorkThreadEngineForFullWorker extends WorkThreadEngineBase{
    readonly type: EWorkThreadType = EWorkThreadType.Full;
    serviceDrawLayer: Group;
    localDrawLayer: Group;
    snapshotFullLayer: undefined = undefined;
    private methodBuilder: MethodBuilderWorker;
    localWork: LocalWorkForFullWorker;
    serviceWork: ServiceWorkForFullWorker;
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    private taskUpdateCameraId?: number;
    private debounceUpdateCameraId?: number;
    private debounceUpdateCache:Set<string> = new Set();
    constructor(viewId:string, opt: IWorkerInitOption, _post:(msg:IBatchMainMessage, transfer?: Transferable[])=>void){
        super(viewId, opt, EWorkThreadType.Full)
        this._post = _post;
        const bufferSize = DefaultAppliancePluginOptions.bufferSize.sub;
        this.serviceDrawLayer = this.createLayer('serviceDrawLayer', this.scene, {...opt.layerOpt, bufferSize}); 
        this.localDrawLayer = this.createLayer('localDrawLayer', this.scene, {...opt.layerOpt, bufferSize}); 
        const subWorkOpt = {
            thread: this,
            viewId: this.viewId,
            vNodes: this.vNodes,
            fullLayer: this.fullLayer,
        } as ISubWorkerInitOption;
        this.localWork = new LocalWorkForFullWorker({
            ...subWorkOpt,
            drawLayer: this.localDrawLayer,
        }); 
        this.serviceWork = new ServiceWorkForFullWorker({
            ...subWorkOpt,
            drawLayer: this.serviceDrawLayer
        });
        this.methodBuilder = new MethodBuilderWorker([
            EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode, 
            EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode, 
            EmitEventType.ZIndexNode, EmitEventType.SetFontStyle,
            EmitEventType.SetPoint, EmitEventType.SetLock, EmitEventType.SetShapeOpt
        ]).registerForWorker(this.localWork,this.serviceWork, this.scene);
        this.vNodes.init(this.fullLayer);
    }
    async combinePost() {
        const {render, ...msg} = this.combinePostData();
        let transfers: Transferable[] |undefined;
        if (render?.length) {
            const newRender:IMainMessageRenderData[] = [];
            for (const renderData of render) {
                if (renderData.rect) {
                    if (renderData.drawCanvas === ECanvasShowType.Bg || renderData.clearCanvas === ECanvasShowType.Bg) {
                        const {rectRange} = this.vNodes.getRectIntersectRange(renderData.rect, false, true);
                        renderData.rect = computRect(renderData.rect, rectRange) || renderData.rect;
                    }
                    renderData.rect = this.safariFixRect(cloneDeep(renderData.rect));
                    if (!renderData.rect) {
                        continue;
                    }
                    if (renderData.drawCanvas && renderData.rect && renderData.rect.w > 0 && renderData.rect.h > 0) {
                        const imageBitmap = await this.getRectImageBitmap(renderData as Required<Pick<IMainMessageRenderData, 'rect' | 'drawCanvas'>>);
                        renderData.imageBitmap = imageBitmap;
                        if (!transfers) {
                            transfers = [];
                        }
                        transfers.push(imageBitmap);
                    }
                    newRender.push(renderData);
                } 
            }
            (msg as IBatchMainMessage).render = newRender;
        }
        const rsp = msg.sp?.filter(s => s.type !== EPostMessageType.None);
        if (rsp?.length) {
            msg.sp = rsp.map(p=>({...p, viewId:this.viewId}));
        } else {
            delete msg.sp;
        }
        if (msg.drawCount === undefined) {
            delete msg.drawCount;
        }
        if (msg?.drawCount || rsp?.length || (msg as IBatchMainMessage).render?.length) {
            // console.log('msg---layer--full', this.viewId, msg);
            this._post(msg, transfers);
        }
        if (this.delayPostDoneResolve) {
            this.delayPostDoneResolve(true);
        }
    }
    async on(msg: IWorkerMessage) {
        if(this.methodBuilder.consumeForWorker(msg)) {
            return;
        }
        const {msgType, dataType, workId, toolsType, workState} = msg;
        switch (msgType) {
            case EPostMessageType.CreateWork:
                if (toolsType !== EToolsKey.LaserPen) {
                    this.createLocalWork(msg);
                }
                break;
            case EPostMessageType.DrawWork:
                if (toolsType !== EToolsKey.LaserPen) {
                    if(workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                        await this.consumeDrawAll(dataType, msg);
                    } else {
                        this.consumeDraw(dataType, msg);
                    }
                }
                break;
            case EPostMessageType.Select:
                if (workId === SelectorShape.selectorId) {
                    await this.localWork.updateFullSelectWork(msg);
                } else {
                    this.serviceWork.runSelectWork(msg);
                }
                return;
            case EPostMessageType.UpdateNode:
            case EPostMessageType.FullWork:
                await this.consumeFull(dataType, msg)
                return;
            case EPostMessageType.RemoveNode:
                await this.removeNode(msg);
                return;
            case EPostMessageType.GetTextActive:
                await this.checkTextActive(msg);
                return;
            case EPostMessageType.CursorHover:
                await this.cursorHover(msg);
                return;
            case EPostMessageType.CursorBlur:
                await this.cursorBlur();
                return;
        }
        await super.on(msg);
    }
    async removeNode(data:IWorkerMessage){
        const {dataType, workId, removeIds} = data;
        const promises:Promise<void>[] = [];
        const workIds = removeIds || [];
        if (workId) {
            workIds.push(workId.toString());
        }
        if (workIds.length) {
            for (const id of workIds) {
                if (id === SelectorShape.selectorId) {
                    promises.push(this.localWork.removeSelector(data)); 
                } else if(dataType === EDataType.Local){
                    promises.push(this.localWork.removeWork(data).then(()=>{
                        this.localWork.colloctEffectSelectWork(data)
                    }));
                } else if(dataType === EDataType.Service){
                    promises.push(this.serviceWork.removeWork(data).then(()=>{
                        this.localWork.colloctEffectSelectWork(data)
                    }));
                }
            }
            await Promise.all(promises);
        }
    }
    async checkTextActive(data:IWorkerMessage){
        const {dataType} = data;
        if (dataType === EDataType.Local) {
            await this.localWork.checkTextActive(data);
        }
        
    }
    async clearAll(): Promise<void> {
        this.vNodes.clear();
        super.clearAll();
        if (this.localDrawLayer) {
            (this.localDrawLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove()
                }
            });
            this.localDrawLayer.removeAllChildren();
        }
        if (this.serviceDrawLayer) {
            (this.serviceDrawLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove()
                }
            });
            this.serviceDrawLayer.removeAllChildren();
        }
        await this.post({
            render:[{
                isClearAll:true,
                clearCanvas: ECanvasShowType.Bg,
                viewId:this.viewId
            },{
                isClearAll: true,
                clearCanvas: ECanvasShowType.ServiceFloat,
                viewId: this.viewId
            },{
                isClearAll: true,
                clearCanvas: ECanvasShowType.Float,
                viewId:this.viewId
            }],
            sp:[{
                type: EPostMessageType.Clear
            }]
        })
    }
    protected updateLayer(layerOpt:ILayerOptionType) {
        const { width, height } = layerOpt;
        super.updateLayer(layerOpt);
        if (this.localDrawLayer) {
            (this.localDrawLayer.parent as Layer).setAttribute('width', width);
            (this.localDrawLayer.parent as Layer).setAttribute('height', height);
            this.localDrawLayer.setAttribute('size',[width, height]);
            this.localDrawLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
        if (this.serviceDrawLayer) {
            (this.serviceDrawLayer.parent as Layer).setAttribute('width', width);
            (this.serviceDrawLayer.parent as Layer).setAttribute('height', height);
            this.serviceDrawLayer.setAttribute('size',[width, height]);
            this.serviceDrawLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
    }
    setCameraOpt(cameraOpt: ICameraOpt): void {
        this.cameraOpt = cameraOpt;
        const {scale, centerX, centerY, width, height} = cameraOpt;
        if (width !== this.scene.width || height!== this.scene.height) {
            this.updateScene({width, height});
        }
        if (this.fullLayer) {
            this.fullLayer.setAttribute('scale', [scale, scale]);
            this.fullLayer.setAttribute('translate', [-centerX,-centerY]);
        }
        if (this.localDrawLayer) {
            this.localDrawLayer.setAttribute('scale', [scale, scale]);
            this.localDrawLayer.setAttribute('translate', [-centerX,-centerY]);
        }
        if (this.serviceDrawLayer) {
            this.serviceDrawLayer.setAttribute('scale', [scale, scale]);
            this.serviceDrawLayer.setAttribute('translate', [-centerX,-centerY]);
        }
    }
    protected getLayer(drawCanvas: ECanvasShowType) {
        switch (drawCanvas) {
            case ECanvasShowType.Bg:
                return this.fullLayer
            case ECanvasShowType.ServiceFloat:
                return this.serviceDrawLayer
            case ECanvasShowType.Float:
                return this.localDrawLayer;           
        }
    }
    getOffscreen(drawCanvas:ECanvasShowType): OffscreenCanvas {
        const layer = this.getLayer(drawCanvas) as Group;
        return (layer.parent as Layer).canvas as OffscreenCanvas;
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
    async consumeDraw(type: EDataType, data: IWorkerMessage) {
        const {workId} = data;
        if (type === EDataType.Local && workId) {
            const workShapeNode = this.localWork.getWorkShape(workId.toString());
            if (!workShapeNode) {
                this.createLocalWork(data);
            }
            await this.localWork.consumeDraw(data, this.serviceWork);
        } 
        if (type === EDataType.Service) {
            this.serviceWork.consumeDraw(data);
        }
    }
    async consumeDrawAll(type: EDataType, data: IWorkerMessage) {
        const {workId} = data;
        if (type === EDataType.Local && workId) {
            const workShapeNode = this.localWork.getWorkShape(workId.toString());
            if (!workShapeNode) {
                this.createLocalWork(data);
            }
            await this.localWork.consumeDrawAll(data, this.serviceWork);
        }
    }
    async updateCamera(msg:IWorkerMessage){
        const render:IMainMessageRenderData[] = [];
        const {cameraOpt, scenePath} = msg;
        if (cameraOpt && !isEqual(this.cameraOpt, cameraOpt)) {
            if (this.taskUpdateCameraId) {
                clearTimeout(this.taskUpdateCameraId)
                this.taskUpdateCameraId = undefined;
            }
            const isClearServiceFloat:boolean = !!this.serviceDrawLayer.children.length;
            if (scenePath) {
                // 等待绘制任务都中断了才开始相机变化
                let isWaitting:boolean = false;
                for (const [key, value] of this.localWork.getWorkShapes().entries()) {
                    if(value.toolsType !== EToolsKey.Text && value.toolsType !== EToolsKey.Eraser && value.toolsType !== EToolsKey.Selector
                        && value.toolsType !== EToolsKey.LaserPen && key !== Cursor_Hover_Id && key !== SelectorShape.selectorId) {
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
                        highLevelIds.add(id);
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
            // 对进行中的任务进行标记处理
            if (this.vNodes.curNodeMap.size) {
                this.vNodes.clearTarget();
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
                    for (const [key,value] of this.serviceWork.selectorWorkShapes.entries()) {
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
                    if (promises.length) {
                        Promise.all(promises).then(()=>{
                            const render:IMainMessageRenderData[] = []; 
                            render.push({
                                isClearAll: true,
                                clearCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            },{
                                isDrawAll:true,
                                drawCanvas: ECanvasShowType.Bg,
                                viewId: this.viewId
                            });
                            if (render.length) {
                                this.post({ render })
                            }
                            this.vNodes.updateLowLevelNodesRect(); 
                            this.vNodes.clearHighLevelIds();
                        })
                    } else {
                        this.vNodes.updateLowLevelNodesRect(); 
                        this.vNodes.clearHighLevelIds();
                    }
                }, Task_Time_Interval) as unknown as number;
            }
            if (isClearServiceFloat) {
                render.push({
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.ServiceFloat,
                    viewId: this.viewId
                });
            }
            if (this.vNodes.hasRenderNodes()) {
                render.push({
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.Bg,
                    viewId: this.viewId
                },{
                    isDrawAll:true,
                    drawCanvas: ECanvasShowType.Bg,
                    viewId: this.viewId
                });
            }
            if (render.length) {
                this.post({ render })
            } 
        }
    }
    private getRectImageBitmap(renderData:Required<Pick<IMainMessageRenderData, 'rect' | 'drawCanvas'>>): Promise<ImageBitmap>  {
        const {rect, drawCanvas} = renderData;
        const x = Math.floor(rect.x * this.dpr);
        const y = Math.floor(rect.y * this.dpr);
        const w = Math.floor(rect.w * this.dpr || 1);
        const h = Math.floor(rect.h * this.dpr || 1);
        return createImageBitmap(this.getOffscreen(drawCanvas), x, y, w, h, { resizeQuality: 'low' })
    }
    private async cursorHover(msg:IWorkerMessage){
        await this.localWork.cursorHover(msg);
    }
    private async cursorBlur(){
        await this.localWork.cursorBlur()
    }
}
/** sub worker */
export class WorkThreadEngineForSubWorker extends WorkThreadEngineBase{
    readonly type: EWorkThreadType = EWorkThreadType.Sub;
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    topLayer: Group;
    snapshotFullLayer: Group | undefined;
    serviceWork: undefined = undefined;
    localWork: LocalWorkForSubWorker;
    topLayerWork: TopLayerWorkForSubWorker;
    constructor(viewId:string, opt: IWorkerInitOption, _post:(msg:IBatchMainMessage, transfer?: Transferable[])=>void){
        super(viewId, opt, EWorkThreadType.Sub)
        this._post = _post;
        const bufferSize = DefaultAppliancePluginOptions.bufferSize.sub;
        this.topLayer = this.createLayer('topLayer',this.scene, {...opt.layerOpt, bufferSize });
        const subWorkOpt = {
            thread: this,
            viewId: this.viewId,
            vNodes: this.vNodes,
            fullLayer: this.fullLayer,
            topLayer: this.topLayer
        } as ISubWorkerInitOption;
        this.localWork = new LocalWorkForSubWorker(subWorkOpt);
        this.topLayerWork = new TopLayerWorkForSubWorker(subWorkOpt);
        this.vNodes.init(this.fullLayer); 
    }
    async combinePost(): Promise<void> {
        const {render, ...msg} = this.combinePostData();
        let transfers: Transferable[] |undefined;
        if (render?.length) {
            const newRender:IMainMessageRenderData[] = [];
            for (const renderData of render) {
                if (renderData.rect) {
                    renderData.rect = this.safariFixRect(cloneDeep(renderData.rect));
                    if (!renderData.rect) {
                        continue;
                    }
                    if (renderData.drawCanvas && renderData.rect && renderData.rect.w > 0 && renderData.rect.h > 0) {
                        const imageBitmap = await this.getRectImageBitmap(renderData as Required<Pick<IMainMessageRenderData, 'rect' | 'drawCanvas'>>);
                        renderData.imageBitmap = imageBitmap;
                        if (!transfers) {
                            transfers = [];
                        }
                        transfers.push(imageBitmap);
                    }
                    newRender.push(renderData);
                } 
            }
            (msg as IBatchMainMessage).render = newRender;
        }
        if(msg.workIds?.size && msg.drawCount) {
            for (const workId of msg.workIds.values()) {
                this.fullLayer.getElementsByName(workId).forEach(c=>{
                    if (c.id && msg.drawCount && (Number(c.id) < msg.drawCount)) {
                        c.remove();
                    }
                })
            }
        }
        const rsp = msg.sp?.filter(s => s.type !== EPostMessageType.None);
        if (rsp?.length) {
            msg.sp = rsp.map(p=>({...p, viewId:this.viewId}));
        } else {
            delete msg.sp;
        }
        if (msg.drawCount === undefined) {
            delete msg.drawCount;
        }
        if (rsp?.length || msg.drawCount || (msg as IBatchMainMessage)?.render?.length) {
            // console.log('msg---layer--sub', this.viewId, cloneDeep(msg), this.fullLayer?.children.length, this.topLayer?.children.length);
            this._post(msg, transfers);
        }
        if (this.delayPostDoneResolve) {
            this.delayPostDoneResolve(true);
        }
    }
    getLayer(drawCanvas:ECanvasShowType, isSnapshot?:boolean): Group {
        if (isSnapshot && this.snapshotFullLayer) {
            return this.snapshotFullLayer;
        }
        switch (drawCanvas) {
            case ECanvasShowType.TopFloat:
                return this.topLayer
            default:
                return this.fullLayer
        }
    }
    async on(msg: IWorkerMessage) {
        const {msgType, toolsType, opt, dataType, workState} = msg;
        switch (msgType) {
            case EPostMessageType.UpdateTools:
                if(toolsType && this.topLayerWork.canUseTopLayer(toolsType) && opt){
                    const param = {
                        toolsType,
                        toolsOpt: opt
                    }
                    this.topLayerWork.setToolsOpt(param);
                    return;
                }
                break;
            case EPostMessageType.CreateWork:
                this.createLocalWork(msg);
                return;
            case EPostMessageType.DrawWork:
                if(workState === EvevtWorkState.Done && dataType === EDataType.Local) {
                    await this.consumeDrawAll(dataType, msg);
                } else {
                    this.consumeDraw(dataType, msg);
                }
                return;
            case EPostMessageType.RemoveNode:
                await this.removeNode(msg);
                return;
            case EPostMessageType.FullWork:
                if (toolsType && this.topLayerWork.canUseTopLayer(toolsType)) {
                    await this.consumeDrawAll(dataType, msg);
                }
                return;
            case EPostMessageType.Snapshot:
                this.snapshotFullLayer = this.createLayer('snapshotFullLayer', this.scene, {...this.opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? 6000 : 3000});
                if (this.snapshotFullLayer) {
                    await this.getSnapshot(msg);
                    this.snapshotFullLayer = undefined;
                }
                return;
            case EPostMessageType.BoundingBox:
                this.snapshotFullLayer = this.createLayer('snapshotFullLayer', this.scene, {...this.opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? 6000 : 3000});
                if (this.snapshotFullLayer) {
                    await this.getBoundingRect(msg);
                    this.snapshotFullLayer = undefined;
                }
                return;
        }
        await super.on(msg);
    }
    protected createLocalWork(data: IWorkerMessage): void {
        const {workId, toolsType, opt} = data;
        if (toolsType && this.topLayerWork.canUseTopLayer(toolsType) && workId && opt) {
            if (!this.topLayerWork.getToolsOpt()) {
                this.topLayerWork.setToolsOpt({
                    toolsType,
                    toolsOpt: opt,
                })
            }
            this.topLayerWork.setWorkOptions(workId.toString(),opt)
            return;
        }
        super.createLocalWork(data);
        return;
    }
    async removeNode(data:IWorkerMessage){
        const {dataType} = data;
        if (dataType === EDataType.Local) {
            await this.localWork.removeWork(data);
        }
    }
    getOffscreen(drawCanvas:ECanvasShowType, isSnapshot?:boolean): OffscreenCanvas {
        const layerParent = this.getLayer(drawCanvas, isSnapshot).parent as Layer;
        return layerParent.canvas as OffscreenCanvas;
    }
    async consumeDraw(dataType: EDataType, data: IWorkerMessage) {
        const {workId, toolsType} = data;
        if(workId){
            if (toolsType && this.topLayerWork.canUseTopLayer(toolsType)) {
                if (dataType === EDataType.Local) {
                    const workShapeNode = this.topLayerWork.getWorkShape(workId.toString());
                    if (!workShapeNode) {
                        this.createLocalWork(data);
                    }
                }
                this.topLayerWork.consumeDraw(data);
                return;
            }
            const workShapeNode = this.localWork.getWorkShape(workId.toString());
            if (!workShapeNode) {
                this.createLocalWork(data);
            }
            await this.localWork.consumeDraw(data);
            return;
        }
    }
    async consumeDrawAll(_type: EDataType, data: IWorkerMessage) {
        const {workId, toolsType, dataType} = data;
        if(workId) {
            const workIdStr = workId.toString();
            if (toolsType && this.topLayerWork.canUseTopLayer(toolsType)) {
                if (dataType === EDataType.Local) {
                    const workShapeNode = this.topLayerWork.getWorkShape(workIdStr);
                    if (!workShapeNode) {
                        this.createLocalWork(data);
                    }
                }
                this.topLayerWork.consumeDrawAll(data);
                return;
            }
            const workShapeNode = this.localWork.getWorkShape(workIdStr);
            if (!workShapeNode) {
                super.createLocalWork(data);
            }
            this.localWork.consumeDrawAll(data);
            return;
        }
        return;
    }
    async clearAll(): Promise<void> {
        this.vNodes.clear();
        super.clearAll();
        if (this.topLayer) {
            (this.topLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.topLayer.removeAllChildren();
        }
        await this.post({
            render:[{
                isClearAll: true,
                clearCanvas: ECanvasShowType.TopFloat,
                viewId: this.viewId
            }],
            sp:[{
                type: EPostMessageType.Clear
            }]
        })
    }
    private getRectImageBitmap(renderData:Required<Pick<IMainMessageRenderData, 'rect' | 'drawCanvas'>>, isSnapshot:boolean = false, options?:ImageBitmapOptions): Promise<ImageBitmap>{
        const {rect, drawCanvas} = renderData;
        const x = Math.floor(rect.x * this.dpr);
        const y = Math.floor(rect.y * this.dpr);
        const w = Math.floor(rect.w * this.dpr || 1);
        const h = Math.floor(rect.h * this.dpr || 1);
        return createImageBitmap(this.getOffscreen(drawCanvas, isSnapshot), x, y, w,  h, options)
    }
    protected updateLayer(layerOpt:ILayerOptionType) {
        const { width, height } = layerOpt;
        super.updateLayer(layerOpt);
        if (this.topLayer) {
            (this.topLayer.parent as Layer).setAttribute('width', width);
            (this.topLayer.parent as Layer).setAttribute('height', height);
            this.topLayer.setAttribute('size',[width, height]);
            this.topLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
        if (this.snapshotFullLayer) {
            (this.snapshotFullLayer.parent as Layer).setAttribute('width', width);
            (this.snapshotFullLayer.parent as Layer).setAttribute('height', height);
            this.snapshotFullLayer.setAttribute('size',[width, height]);
            this.snapshotFullLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
        }
    }
    async updateCamera(msg:IWorkerMessage){
        const render:IMainMessageRenderData[] = [];
        const {cameraOpt} = msg;
        if (cameraOpt && !isEqual(this.cameraOpt, cameraOpt)) {
            const isClearTopFloat:boolean = !!this.topLayerWork.localWorkShapes.size;
            const isClearFloat:boolean = !!this.localWork.getWorkShapes().size;
            if(isClearFloat){
                this.localWork.workShapesDone();
            }
            this.setCameraOpt(cameraOpt);
            if (isClearFloat) {
                render.push({
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.Float,
                    viewId: this.viewId
                });
            }
            if (isClearTopFloat) {
                render.push({
                    isClearAll: true,
                    clearCanvas: ECanvasShowType.TopFloat,
                    viewId: this.viewId
                });
                for (const [key, value] of this.topLayerWork.localWorkShapes.entries()) {
                    if (value.totalRect) {
                        let totalRect:IRectType|undefined;
                        this.topLayer.getElementsByName(key.toString()).forEach(n=>{
                            const r = (n as Path).getBoundingClientRect();
                            const rect = getSafetyRect({x:r.x,y:r.y,w:r.width,h:r.height})
                            totalRect = computRect(totalRect, rect);
                        })
                        value.totalRect = totalRect;
                        this.topLayerWork.localWorkShapes.set(key, value);
                    }
                }
            }
            if (render.length) {
               await this.post({ render })
            } 
        }
    }
    setCameraOpt(cameraOpt:ICameraOpt, layer?:Group){
        this.cameraOpt = cameraOpt;
        const {scale, centerX, centerY, width, height} = cameraOpt;
        if (width !== this.scene.width || height!== this.scene.height) {
            this.updateScene({width, height});
        }
        if (layer) {
            layer.setAttribute('scale', [scale, scale]);
            layer.setAttribute('translate', [-centerX, -centerY]);
        } 
        else {
            this.fullLayer.setAttribute('scale', [scale, scale]);
            this.fullLayer.setAttribute('translate', [-centerX,-centerY]);
            this.topLayer.setAttribute('scale', [scale, scale]);
            this.topLayer.setAttribute('translate', [-centerX,-centerY]);
        }
    }
    private async getSnapshot(data:IWorkerMessage){
        const {scenePath, scenes, cameraOpt, w, h} = data;
        if (scenePath && scenes && cameraOpt && this.snapshotFullLayer) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = undefined;
            let rect:IRectType|undefined;
            for (const [key,value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const {opt} = value;
                            const r = await this.localWork.runFullWork({
                                ...value,
                                opt,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service,
                                viewId:this.viewId
                            });
                            rect = computRect(rect,r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            let options:ImageBitmapOptions|undefined;
            if (w && h) {
                options = {
                    resizeWidth: w,
                    resizeHeight: h,
                }
            }
            await this.getSnapshotRender({scenePath,curCameraOpt,options})
            this.localWork.fullLayer = this.fullLayer;
            this.localWork.drawLayer = undefined;
        }
    }
    private async getSnapshotRender(data:{
        scenePath:string,
        curCameraOpt?:ICameraOpt,
        options?:ImageBitmapOptions,
    }){
        const {scenePath, curCameraOpt, options} = data;
        (this.snapshotFullLayer?.parent as Layer).render();
        const imageBitmap = await this.getRectImageBitmap({ rect: this.getSceneRect(), drawCanvas: ECanvasShowType.None }, true, options)
        if(imageBitmap) {
            this._post({
                sp:[{
                    type: EPostMessageType.Snapshot,
                    scenePath,
                    imageBitmap,
                    viewId: this.viewId
                }]
            },[imageBitmap]);
            imageBitmap.close();
            this.snapshotFullLayer?.removeAllChildren();
            this.setCameraOpt(curCameraOpt as ICameraOpt, this.fullLayer);
        }
    }
    private async getBoundingRect(data:IWorkerMessage){
        const {scenePath, scenes, cameraOpt} = data;
        if (scenePath && scenes && cameraOpt && this.snapshotFullLayer) {
            const curCameraOpt = cloneDeep(this.cameraOpt);
            this.setCameraOpt(cameraOpt, this.snapshotFullLayer);
            this.localWork.fullLayer = this.snapshotFullLayer;
            this.localWork.drawLayer = undefined;
            let rect:IRectType|undefined;
            for (const [key,value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const r = await this.localWork.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service,
                                viewId:this.viewId
                            });
                            rect = computRect(rect,r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            if(rect){
                await this.post({
                    sp:[{
                        type: EPostMessageType.BoundingBox,
                        scenePath,
                        rect
                    }]
                });
            }
            this.localWork.fullLayer = this.fullLayer;
            this.localWork.drawLayer = undefined;
            this.snapshotFullLayer.removeAllChildren();
            this.setCameraOpt(curCameraOpt as ICameraOpt, this.fullLayer);
        }
    }
}