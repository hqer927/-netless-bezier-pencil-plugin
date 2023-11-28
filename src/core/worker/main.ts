import { BaseCollector } from "../../collector";
import { BaseCollectorReducerAction, DiffOne } from "../../collector/types";
import { MainEngine, WorkThreadEngine } from "../base";
import { IOffscreenCanvasOptionType, ICameraOpt, IActiveToolsDataType, IActiveWorkDataType, IWorkerMessage, ILayerOptionType, IBatchMainMessage, IworkId, IUpdateNodeOpt, IMainMessage, IMainMessageRenderData } from "../types";
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import Worker from './worker.ts?worker&inline';
import SubWorker from './workerSub.ts?worker&inline';
import { BezierPencilPluginOptions } from "../../plugin";

export class MainEngineForWorker extends MainEngine {
    protected threadEngine?: WorkThreadEngine;
    private pluginOptions?: BezierPencilPluginOptions;
    static defaultScreenCanvasOpt = {
        autoRender: false,
        contextType: ECanvasContextType.Canvas2d,
    }
    static defauleLayerOpt = {
        offscreen: true,
        handleEvent: false,
        depth: false,
    }
    static maxLastSyncTime = 500;
    protected layerOpt!: ILayerOptionType;
    protected msgEmitter: Worker;
    protected offscreenCanvasOpt!: IOffscreenCanvasOptionType;
    protected cameraOpt!: ICameraOpt;
    protected translate: [number, number] = [0,0];
    protected localPointsBatchData: number[] = [];
    protected taskBatchData: (IWorkerMessage & Pick<IWorkerMessage, 'workId'>)[] = [];
    protected currentToolsData!: IActiveToolsDataType;
    protected currentLocalWorkData!: IActiveWorkDataType;
    private animationId: number|undefined;
    private workerLockId: IworkId|undefined;
    private isRunSubWork: boolean = true;
    private subWorker: Worker | undefined;
    private maxDrawCount: number = 0;
    // private isUseSubWorker: boolean = false;
    private wokerDrawCount: number = 0;
    private reRenders: Array<IMainMessageRenderData> = [];
    constructor(bgCanvas: HTMLCanvasElement, floatCanvas: HTMLCanvasElement, collector: BaseCollector, options?: BezierPencilPluginOptions){
        super(bgCanvas, floatCanvas, collector);
        this.pluginOptions = options;
        MainEngineForWorker.maxLastSyncTime = options?.syncOpt?.interval || MainEngineForWorker.maxLastSyncTime;
        this.msgEmitter = new Worker();
        const screenCanvasOpt = {
            ...MainEngineForWorker.defaultScreenCanvasOpt,
            ...this.pluginOptions?.canvasOpt,
            width: bgCanvas.offsetWidth, 
            height: bgCanvas.offsetHeight,
        }
        this.offscreenCanvasOpt = screenCanvasOpt;
        this.layerOpt = MainEngineForWorker.defauleLayerOpt;
        this.setLayerOpt(this.layerOpt);
        this.setCurrentLocalWorkData({
            workId:undefined,
            workState: EvevtWorkState.Pending
        })
        this.createThreadEngine();
        this.on();
        this.createOptimizationWorker();
    }
    private createOptimizationWorker () {
        this.subWorker = new SubWorker();
        this.subWorker.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, drawCount} = e.data;
                // console.log('rect111666-s', drawCount)
                if (!drawCount && render) {
                    this.render(render);
                    return;
                }
                if ( drawCount ) {
                    if (drawCount > this.maxDrawCount) {
                        this.maxDrawCount = drawCount;
                    }
                    if (render) {
                        if (drawCount > this.wokerDrawCount) {
                            render.isUnClose = true;
                            this.reRenders.push(render)
                        }
                        this.render(render);
                    }
                }
            }
        }
    }
    private subPost(msg: IWorkerMessage[]){
        // this.subWorkerLockId = Date.now();
        // console.log('subPost', this.subWorkerLockId)
        const filterMsg = msg.filter( m => m.msgType === EPostMessageType.UpdateScene || m.dataType === EDataType.Local);
        if (filterMsg.length) {
            this.subWorker?.postMessage(filterMsg);
        }
    }
    private destroySubWorker() {
        if (this.subWorker) {
            this.subWorker.terminate();
            this.subWorker = undefined;
            this.isRunSubWork = false;
        }
    }
    private createThreadEngine() {
        this.taskBatchData.push({
            msgType: EPostMessageType.Init,
            dataType: EDataType.Local,
            offscreenCanvasOpt: this.offscreenCanvasOpt,
            layerOpt: this.layerOpt,
            dpr: this.dpr,
        })
        this.runAnimation();
    }
    private render(data: IMainMessageRenderData) {
        const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas} = data;
        const ctx = drawCanvas === ECanvasShowType.Float ? this.floatCanvas.getContext('2d') : this.displayCanvas.getContext('2d');
        if (rect && ctx && imageBitmap) {
            const scale = this.cameraOpt?.scale || 1;
            const _scale = scale < 1 ? scale : 1 + Math.abs(scale - 1 );
            const width = scale < 1 ?  rect.w / scale : rect.w * _scale;
            const height = scale < 1 ?  rect.h / scale : rect.h * _scale;
            const x = (rect.x + this.translate[0]) * scale * this.dpr;
            const y = (rect.y + this.translate[1]) * scale * this.dpr;
            const w = width * this.dpr;
            const h = height * this.dpr;
            if (isClear) {
                const removeCtx = clearCanvas === ECanvasShowType.Float ? this.floatCanvas.getContext('2d') : this.displayCanvas.getContext('2d');
                removeCtx?.clearRect(x, y, w, h);
            }
            // ctx.imageSmoothingEnabled = true;
            // ctx.imageSmoothingQuality = "low";
            ctx.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
            if (isUnClose) {
                return;
            }
            imageBitmap.close();
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    private setLayerOpt(layerOpt: ILayerOptionType) {
        this.layerOpt = layerOpt;
    }
    public updateCanvas(opt:IOffscreenCanvasOptionType, dataType:EDataType) {
        const workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Unwritable) {
            return;
        }
        const {width, height} = opt
        this.displayCanvas.width = width * this.dpr;
        this.displayCanvas.height = height * this.dpr;
        this.floatCanvas.width = width * this.dpr;
        this.floatCanvas.height = height * this.dpr;
        this.offscreenCanvasOpt = opt;
        const setOffscreenTaskOpt = {
            msgType: EPostMessageType.UpdateScene,
            offscreenCanvasOpt: this.offscreenCanvasOpt,
            workId:'',
            dataType
        }
        this.taskBatchData.push(setOffscreenTaskOpt);
        if (dataType === EDataType.Local) {
            this.collector?.dispatch({
                type: EPostMessageType.UpdateScene,
                w: width,
                h: height
            })
        }
        this.runAnimation();
    }
    private pushPoint(point: [number, number]): void {
        this.localPointsBatchData.push(point[0],point[1]);
    }
    private transformToScenePoint(p:[number,number]):[number,number] {
        const point:[number,number] = p;
        if (this.cameraOpt?.scale && this.translate) {
            point[0] = p[0] / this.cameraOpt.scale - this.translate[0];
            point[1] = p[1] / this.cameraOpt.scale - this.translate[1];
        }
        return point;
    }
    initSyncData(callBack: (key: string, value: BaseCollectorReducerAction | undefined) => void): void {
        const store = this.collector?.storage;
        if (store) {
            for (const key of Object.keys(store)) {
                callBack(key, store[key]);
                if (key === 'screen') {
                    const {w,h} = store[key] as BaseCollectorReducerAction;
                    if (store[key] && w && h) {
                        this.updateCanvas({
                            ...this.offscreenCanvasOpt,
                            width:w,
                            height:h
                        }, EDataType.Service);
                    }
                    continue;
                }
                const msgType = store[key]?.type
                if (msgType && key) {
                    const data:IWorkerMessage & Pick<IWorkerMessage, 'workId'> = store[key] as IWorkerMessage;
                    data.workId = key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    this.taskBatchData.push(data);
                }
            }
            this.runAnimation();
        }
    }
    onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>): void {
        const {newValue, oldValue} = data;
        const msg:BaseCollectorReducerAction = newValue || {};
        const workId:IworkId = key;
        let msgType = msg.type;
        if (!newValue && oldValue) {
            msgType = EPostMessageType.RemoveNode;
            if (oldValue.toolstype === EToolsKey.LaserPen){
                return;
            }
        }
        if (msgType && workId) {
            const data: IWorkerMessage & Pick<IWorkerMessage, 'workId'> = msg as IWorkerMessage;
            data.workId = this.collector.isOwn(key) ? this.collector.getLocalId(key): workId;
            data.msgType = msgType;
            data.dataType = EDataType.Service;
            // console.log('workShapes2---111',data)
            this.taskBatchData.push(data);
        }
        this.runAnimation();
    }
    onLocalEventEnd(point: [number, number]): void {
        const workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
            const _point:[number,number] = this.transformToScenePoint(point);
            this.pushPoint(_point);
            this.maxDrawCount = 0;
            this.wokerDrawCount = 0;
            this.reRenders.length = 0;
            // console.log('mouseUp')
            this.setCurrentLocalWorkData({workId:this.currentLocalWorkData.workId, workState: EvevtWorkState.Done});
        }
    }
    onLocalEventDoing(point: [number, number]): void {
        let workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        if (workState === EvevtWorkState.Start) {
            workState = EvevtWorkState.Doing;
            this.setCurrentLocalWorkData({workId:this.currentLocalWorkData.workId, workState})
        }
        if (workState === EvevtWorkState.Doing) {
            const _point:[number,number] = this.transformToScenePoint(point);
            this.pushPoint(_point);
        }
    }
    onLocalEventStart(point: [number, number]): void {
        const {workState} = this.currentLocalWorkData;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        const workId = Date.now();
        this.setCurrentLocalWorkData({
            workId,
            workState: EvevtWorkState.Start
        }, EPostMessageType.CreateWork)
        const _point:[number,number] = this.transformToScenePoint(point);
        this.pushPoint(_point);
        // console.log('mousedown')
        this.runAnimation();
        this.collector?.dispatch({
            type: EPostMessageType.CreateWork,
            workId,
            toolstype: this.currentToolsData.toolsType,
            opt: this.currentToolsData.toolsOpt
        })
    }
    consume(): void {
        this.animationId = undefined;
        const workState = this.currentLocalWorkData.workState;
        if (!this.workerLockId) {
            if (this.localPointsBatchData.length) {
                this.taskBatchData.push({
                    op: this.localPointsBatchData,
                    workState,
                    workId: this.currentLocalWorkData.workId,
                    dataType: EDataType.Local,
                    msgType: EPostMessageType.DrawWork,
                    drawCount: this.maxDrawCount
                })
            }
            if (this.taskBatchData.length) {
                this.post(this.taskBatchData);
                this.taskBatchData.length = 0;
                this.localPointsBatchData.length = 0;
            }
        }
        if (workState === EvevtWorkState.Doing || 
            workState === EvevtWorkState.Start || 
            this.taskBatchData.length ||
            this.localPointsBatchData.length ) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    clearAll(justLocal:boolean = false){
        this.taskBatchData.push({
            dataType: EDataType.Local,
            msgType: EPostMessageType.Clear,
        })
        const ctx = this.displayCanvas.getContext('2d');
        ctx?.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        const floatCtx = this.floatCanvas.getContext('2d');
        floatCtx?.clearRect(0, 0, this.floatCanvas.width, this.floatCanvas.height);
        if (!justLocal) {
            this.collector?.dispatch({
                type: EPostMessageType.Clear
            })
        }
    }
    unabled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Freeze, workId:undefined});
    }
    abled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Pending, workId:undefined});
    }
    destroy(): void {
        // TODO
        this.msgEmitter.terminate();
        this.destroySubWorker();
    }
    post(msg: IWorkerMessage[]): void {
        this.msgEmitter.postMessage(msg);
        if (this.isRunSubWork) {
            this.subPost(this.taskBatchData);
        }
    }
    on(): void {
        this.msgEmitter.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, sp, drawCount} = e.data;
                // console.log('rect111222-s', drawCount, render)
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render) {
                    this.render(render);
                    return;
                }
                if ( drawCount ) {
                    this.wokerDrawCount = drawCount;
                    if (drawCount > this.maxDrawCount) {
                        this.maxDrawCount = drawCount;
                    } 
                    if (render) {
                        this.render(render);
                        if (drawCount < this.maxDrawCount) {
                            this.reRenders.forEach(r=>{
                                r.isUnClose = false;
                                this.render(r);
                            })
                            this.reRenders.length = 0;
                        }
                    }
                }
            }
        }
    }
    private collectorSyncData(sp: IMainMessage[]){
        for (const data of sp) {
            const {type, op, workId, index, removeIds, ops} = data;
            switch (type) {
                case EPostMessageType.DrawWork:
                    if (op?.length && workId && typeof index === 'number') {
                        requestIdleCallback(()=>{
                            // console.log('op', op, index)
                            this.collector?.dispatch({
                                type,
                                op,
                                workId,
                                index
                            })
                        },{timeout: MainEngineForWorker.maxLastSyncTime})
                    }
                    
                    break
                case EPostMessageType.FullWork:
                    if (ops) {
                        requestIdleCallback(()=>{
                            this.collector?.dispatch({type, ops, workId})
                        },{timeout: MainEngineForWorker.maxLastSyncTime})
                    }
                    break;
                case EPostMessageType.RemoveNode:
                    if (op || removeIds?.length) {
                        requestIdleCallback(()=>{
                            this.collector?.dispatch({type, removeIds })
                        },{timeout: MainEngineForWorker.maxLastSyncTime})
                    }
                    break;  
                default:
                    break;
            }
        }
    }
    public updateNode(workId:IworkId, updateNodeOpt:IUpdateNodeOpt) {
        this.taskBatchData.push({
            msgType: EPostMessageType.UpdateNode,
            workId,
            updateNodeOpt,
            dataType: EDataType.Local
        })
        this.collector.dispatch({
            type: EPostMessageType.UpdateNode,
            workId,
            updateNodeOpt
        })
        this.runAnimation();
    }
    public setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType, msgType: EPostMessageType = EPostMessageType.None) {
        super.setCurrentLocalWorkData(currentLocalWorkData);
        const {workState, workId} = currentLocalWorkData
        if(workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (msgType !== EPostMessageType.None) {
            this.taskBatchData.push({
                msgType,
                workId,
                toolsType: this.currentToolsData.toolsType,
                opt: {...this.currentToolsData.toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime},
                dataType: EDataType.Local,
            })
            this.runAnimation();
        }
    }
    public setCurrentToolsData(currentToolsData: IActiveToolsDataType) {
        super.setCurrentToolsData(currentToolsData);
        this.taskBatchData.push({
            msgType: EPostMessageType.UpdateTools,
            dataType: EDataType.Local,
            toolsType: currentToolsData.toolsType,
            opt: {...currentToolsData.toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime },
        })
        if (currentToolsData?.toolsType === EToolsKey.Eraser) {
            this.isRunSubWork = false;
        } else {
            this.isRunSubWork = true;
        }
        this.runAnimation();
    }
    public setCameraOpt(cameraOpt: ICameraOpt){
        super.setCameraOpt(cameraOpt);
        if (cameraOpt.scale && this.offscreenCanvasOpt) {
            const w = this.offscreenCanvasOpt.width;
            const h = this.offscreenCanvasOpt.height;
            const scale = cameraOpt.scale < 1 ? cameraOpt.scale : 1 + Math.abs(cameraOpt.scale - 1 );
            this.translate = [w * (1 - scale) * 0.5 / scale, h * (1 - scale) * 0.5 / scale ];
            const centerX = this.cameraOpt.centerX || 0;
            const centerY = this.cameraOpt.centerY || 0;
            if (centerX || centerY) {
                this.translate = [this.translate[0] - centerX, this.translate[1] - centerY ];
            }
            this.taskBatchData.push({
                msgType: EPostMessageType.Transform,
                dataType: EDataType.Local,
                scale,
                translate: this.translate
            })
            this.runAnimation();
        }
    }

}