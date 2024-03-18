/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { BaseCollectorReducerAction, Collector, Diff, DiffOne, Storage_Selector_key } from "../../collector";
import { MainEngine } from "../mainEngine";
import { IOffscreenCanvasOptionType, ICameraOpt, IActiveToolsDataType, IActiveWorkDataType, IWorkerMessage, ILayerOptionType, IBatchMainMessage, IworkId, IUpdateNodeOpt, IMainMessage, IMainMessageRenderData, IRectType } from "../types";
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { TeachingAidsDisplayer, TeachingAidsManager } from "../../plugin";
import {TeachingAidsPluginOptions, EmitEventType, InternalMsgEmitterType} from "../../plugin/types"
import cloneDeep from "lodash/cloneDeep";
import { BaseShapeOptions } from "../tools";
import { MethodBuilderMain, ZIndexNodeMethod } from "../msgEvent";
import { ShowFloatBarMsgValue } from "../../displayer/types";
import { requestAsyncCallBack } from "../utils";
import { UndoRedoMethod } from "../../undo";
import { CursorManager } from "../../cursors";
import { WorkThreadEngine } from "../threadEngine";

import SWorker from './worker.ts?worker&inline';
import SubWorker from './workerSub.ts?worker&inline';
import { TextEditorManager } from "../../component/textEditor";
import { ETextEditorType, TextOptions } from "../../component/textEditor/types";
import type { Room } from "white-web-sdk";

export class MainEngineForWorker extends MainEngine {
    protected dpr: number = 1;
    // private browserName:string;
    protected threadEngine?: WorkThreadEngine;
    private pluginOptions?: TeachingAidsPluginOptions;
    static defaultScreenCanvasOpt = {
        autoRender: false,
        contextType: ECanvasContextType.Canvas2d, 
        // bufferSize: 5000
    }
    static defauleLayerOpt = {
        offscreen: true,
        handleEvent: false,
        depth: false,
    }
    static maxLastSyncTime = 500;
    protected layerOpt!: ILayerOptionType;
    protected msgEmitter!: Worker;
    room?: Room;
    textEditorManager: TextEditorManager;
    offscreenCanvasOpt!: IOffscreenCanvasOptionType;
    // 坐标系原点
    originalPoint: [number, number] = [0,0];
    protected cameraOpt!: ICameraOpt;
    protected localPointsBatchData: number[] = [];
    taskBatchData: Map<unknown, IWorkerMessage> = new Map();
    currentToolsData!: IActiveToolsDataType;
    protected currentLocalWorkData!: IActiveWorkDataType;
    private animationId: number|undefined;
    private subWorker: Worker | undefined;
    private subWorkerDrawCount: number = 0;
    private wokerDrawCount: number = 0;
    private maxDrawCount: number = 0;
    private cacheDrawCount: number = 0;
    private reRenders: Array<IMainMessageRenderData> = [];
    private bgCanvas: HTMLCanvasElement | null;
    private floatCanvas: HTMLCanvasElement | null;
    private methodBuilder?: MethodBuilderMain;
    private zIndexNodeMethod?:ZIndexNodeMethod;
    private localEventTimerId?: number;
    private undoTickerId?: number;
    private snapshotMap:Map<string, (value: ImageBitmap) => void> = new Map();
    private boundingRectMap:Map<string, (value: IRectType) => void> = new Map();
    private cursor!:CursorManager;
    private cachePoint?:[number|undefined,number|undefined];
    private clearAllResolve?: (bool:boolean) => void;
    private useTasksqueue: boolean = false;
    private useTasksClockId?: number;
    private mianTasksqueueCount?: number;
    private workerTasksqueueCount?: number;
    constructor(props:{
        collector: Collector, 
        cursor:CursorManager, 
        options?: TeachingAidsPluginOptions,
        room?: Room
        textComponent: TextEditorManager
    }){
        const {collector,cursor,options, room, textComponent} = props;
        super(TeachingAidsDisplayer.instance, collector);
        this.cursor = cursor;
        this.room = room;
        this.bgCanvas = TeachingAidsDisplayer.instance.canvasBgRef;
        this.floatCanvas = TeachingAidsDisplayer.instance.canvasFloatRef;
        this.textEditorManager = textComponent;
        if (this.bgCanvas && this.floatCanvas) {
            this.pluginOptions = options;
            MainEngineForWorker.maxLastSyncTime = (options?.syncOpt?.interval || MainEngineForWorker.maxLastSyncTime) * 0.5;
            this.msgEmitter = new SWorker();
            this.cameraOpt = {
                centerX: 0,
                centerY: 0,
                scale: 1,
                width: this.bgCanvas.offsetWidth, 
                height: this.bgCanvas.offsetHeight,
            }
            const screenCanvasOpt = {
                ...MainEngineForWorker.defaultScreenCanvasOpt,
                ...this.pluginOptions?.canvasOpt,
                width: this.bgCanvas.offsetWidth, 
                height: this.bgCanvas.offsetHeight,
            }
            this.offscreenCanvasOpt = screenCanvasOpt;
            this.layerOpt = MainEngineForWorker.defauleLayerOpt;
            this.setLayerOpt(this.layerOpt);
            this.setCurrentLocalWorkData({
                workId:undefined,
                workState: EvevtWorkState.Pending
            })
            this.internalMsgEmitterListener();
            this.on();
        }
        TeachingAidsManager.InternalMsgEmitter.on([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor],this.sendCursorEvent.bind(this))
    }
    private get isRunSubWork(): boolean {
        const {toolsType} = this.currentToolsData;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.LaserPen || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon
        ) {
            return true;
        }
        return false
    }
    private get isCanDrawWork(): boolean {
        const {toolsType} = this.currentToolsData;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.LaserPen || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon
        ) {
            return true;
        }
        return false
    }
    private get isUseZIndex(): boolean {
        const {toolsType} = this.currentToolsData;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon || 
            toolsType === EToolsKey.Text
        ) {
            return true;
        }
        return false
    }
    private get isCanRecordUndoRedo(): boolean {
        const {toolsType} = this.currentToolsData;
        if (
            toolsType === EToolsKey.Pencil || 
            toolsType === EToolsKey.Selector || 
            toolsType === EToolsKey.Eraser || 
            toolsType === EToolsKey.Arrow || 
            toolsType === EToolsKey.Straight || 
            toolsType === EToolsKey.Ellipse || 
            toolsType === EToolsKey.Rectangle || 
            toolsType === EToolsKey.Star || 
            toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.SpeechBalloon
        ) {
            return true;
        }
        return false
    }
    private sendCursorEvent(p:[number|undefined,number|undefined]) {
        if (this.currentLocalWorkData.workState === EvevtWorkState.Freeze || this.currentLocalWorkData.workState === EvevtWorkState.Unwritable ) {
            return;
        }
        let point:[number|undefined,number|undefined] = [undefined,undefined];
        if ( this.currentToolsData && (this.isCanDrawWork || this.currentToolsData.toolsType === EToolsKey.Text)) {
            if (this.currentLocalWorkData.workState !== EvevtWorkState.Start && this.currentLocalWorkData.workState !== EvevtWorkState.Doing ) {
                point = p;
            }
        }
        // console.log('sendCursorEvent', point, this.cachePoint)
        if (!this.cachePoint || this.cachePoint[0] !== point[0] || this.cachePoint[1] !== point[1]) {
            this.cursor.sendEvent(point);
            this.cachePoint = point;
        }
    }
    private internalMsgEmitterListener () {
        if (this.collector) {
            this.methodBuilder = new MethodBuilderMain([
                EmitEventType.CopyNode, EmitEventType.SetColorNode, EmitEventType.DeleteNode, 
                EmitEventType.RotateNode, EmitEventType.ScaleNode, EmitEventType.TranslateNode, 
                EmitEventType.ZIndexActive, EmitEventType.ZIndexNode, EmitEventType.RotateNode
            ]).registerForMainEngine(InternalMsgEmitterType.MainEngine, this, this.collector);
            this.zIndexNodeMethod = this.methodBuilder?.getBuilder(EmitEventType.ZIndexNode) as ZIndexNodeMethod;
        }
        TeachingAidsManager.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        TeachingAidsManager.InternalMsgEmitter?.on([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
        TeachingAidsManager.InternalMsgEmitter?.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
    }
    private showFloatBar(show: boolean){
        if(show){
            window.addEventListener('beforeunload', this.removeSelectorFromStore.bind(this));
        } else {
            window.removeEventListener('beforeunload', this.removeSelectorFromStore.bind(this));
        }
    }
    private removeSelectorFromStore() {
        this.collector.dispatch({
            type:EPostMessageType.Select,
            selectIds: undefined
        })
    }
    private internalMsgEmitterRemoveListener () {
        this.methodBuilder?.destroy();
        TeachingAidsManager.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], this.createSceneLintener.bind(this));
        TeachingAidsManager.InternalMsgEmitter?.off([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], this.originalEventLintener.bind(this));
    }
    private createSceneLintener(width: number, height: number, dpr: number) {
        this.offscreenCanvasOpt = {
           ...this.offscreenCanvasOpt,
            width, 
            height
        }
        this.dpr = dpr;
        this.originalPoint = [width/2, height/2]
        this.cameraOpt = {
            centerX: 0,
            centerY: 0,
            scale: 1,
            width: width,
            height: height,
        }
        this.createThreadEngine();
        this.createOptimizationWorker();
    }
    private originalEventLintener(workState: EvevtWorkState, point:[number,number]) {
        switch (workState) {
            case EvevtWorkState.Start:
                this.onLocalEventStart(point);
                break;
            case EvevtWorkState.Doing:
                this.onLocalEventDoing(point);
                break;
            case EvevtWorkState.Done:
                this.onLocalEventEnd(point);
                break;
            default:
                break;
        }
    }
    private destroySubWorker() {
        if (this.subWorker) {
            this.subWorker.terminate();
            this.subWorker = undefined;
        }
    }
    private createThreadEngine() {
        this.taskBatchData.set('Init', {
            msgType: EPostMessageType.Init,
            dataType: EDataType.Local,
            offscreenCanvasOpt: this.offscreenCanvasOpt,
            layerOpt: this.layerOpt,
            dpr: this.dpr,
            isRunSubWork: true,
        });
        this.runAnimation();
    }
    private render(datas: IMainMessageRenderData[]) {
        for (const data of datas) {
            const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas, offset} = data;
            // console.log('render', data)
            if (rect) {
                const w = rect.w * this.dpr;
                const h = rect.h * this.dpr;
                const x = rect.x * this.dpr;
                const y = rect.y * this.dpr;
                if (isClear) {
                    if (clearCanvas === ECanvasShowType.Selector) {
                        this.displayer.floatBarCanvasRef.current?.getContext('2d')?.clearRect(0, 0, w, h);
                    } else {
                        const removeCtx = clearCanvas === ECanvasShowType.Float ? this.floatCanvas?.getContext('2d') : this.bgCanvas?.getContext('2d');
                        removeCtx?.clearRect(x, y, w, h);
                    }
                }
                if (drawCanvas && imageBitmap) {
                    if (drawCanvas === ECanvasShowType.Selector) {
                        const cx = (offset?.x || 0) * this.dpr;
                        const cy = (offset?.y || 0) * this.dpr;
                        this.displayer.floatBarCanvasRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, cx, cy, w, h);
                    } else {
                        const ctx = drawCanvas === ECanvasShowType.Float ? this.floatCanvas?.getContext('2d') : this.bgCanvas?.getContext('2d');
                        ctx?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                    }
                }
                if (isUnClose) {
                    return;
                }
                imageBitmap?.close();
            }

        }
    }
    runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    private setLayerOpt(layerOpt: ILayerOptionType) {
        this.layerOpt = layerOpt;
    }
    public updateCanvas(opt:IOffscreenCanvasOptionType) {
        const {width, height} = opt
        if (this.bgCanvas && this.floatCanvas) {
            this.bgCanvas.width = width * this.dpr;
            this.bgCanvas.height = height * this.dpr;
            this.floatCanvas.width = width * this.dpr;
            this.floatCanvas.height = height * this.dpr;
        }
        this.originalPoint = [width * 0.5, height * 0.5];
        // console.log('this.originalPoint', this.originalPoint)
        this.offscreenCanvasOpt.width = width;
        this.offscreenCanvasOpt.height = height;
    }
    private pushPoint(point: [number, number]): void {
        this.localPointsBatchData.push(point[0],point[1]);
    }
    transformToScenePoint(p:[number,number]):[number,number] {
        const point:[number,number] = [p[0],p[1]];
        const {scale, centerX, centerY} = this.cameraOpt;
        if (this.originalPoint) {
            point[0] = (p[0] - this.originalPoint[0]) / scale + centerX;
            point[1] = (p[1] - this.originalPoint[1]) /  scale + centerY;
        }
        return point;
    }
    transformToOriginPoint(p:[number,number]):[number,number] {
        const point:[number,number] = [p[0],p[1]];
        const {scale, centerX, centerY} = this.cameraOpt;
        if (this.originalPoint) {
            point[0] = (p[0] - centerX) * scale + this.originalPoint[0];
            point[1] = (p[1] - centerY) * scale + this.originalPoint[1];
        }
        return point;
    }
    getCameraOpt(){
        return this.cameraOpt;
    }
    getDpr(){
        return this.dpr;
    }
    initSyncData(callBack?: (key: string, value: BaseCollectorReducerAction | undefined) => void): void {
        const store = this.collector?.storage;
        if (store) {
            let minZIndex:number|undefined;
            let maxZIndex:number|undefined;
            for (const key of Object.keys(store)) {
                callBack && callBack(key, store[key]);
                const msgType = store[key]?.type
                if (msgType && key) {
                    const data:IWorkerMessage & Pick<IWorkerMessage, 'workId'> = cloneDeep(store[key]) as IWorkerMessage;
                    data.workId = key;
                    data.msgType = msgType;
                    data.dataType = EDataType.Service;
                    data.useAnimation = false;
                    if (data.toolsType === EToolsKey.Text) {
                        this.textEditorManager.onServiceDerive(data)
                        continue;
                    }
                    this.taskBatchData.set(`${data.dataType},${data.msgType},${data.workId}`, data);
                    if (data.opt?.zIndex) {
                        maxZIndex = Math.max(maxZIndex || 0, data.opt.zIndex);
                        minZIndex = Math.min(minZIndex || Infinity, data.opt.zIndex);
                    }
                }
            }
            this.runAnimation();
            if (this.zIndexNodeMethod) {
                if (maxZIndex) this.zIndexNodeMethod.maxZIndex = maxZIndex;
                if (minZIndex) this.zIndexNodeMethod.minZIndex = minZIndex;
            }

        }
    }
    getRelevantWork(diff: Diff<any>){
        let relevantId:string|undefined;
        for (const [key,value] of Object.entries(diff)) {
            if (value) {
                const {newValue, oldValue} = value;
                if (!newValue && oldValue) {
                    const isRelevant = Object.keys(diff).some(k=>{
                        if (k !== key && k.indexOf(`${key}_s_`)>-1) {
                            relevantId = key;
                            return true;
                        }
                        return false;
                    })
                    if (isRelevant) {
                        break;
                    }
                }
            } 
        }
        return relevantId
    }
    onServiceDerive(key: string, data: DiffOne<BaseCollectorReducerAction | undefined>, relevantId?:string): void {
        const {newValue, oldValue} = data;
        const msg:BaseCollectorReducerAction = cloneDeep(newValue) || {};
        const workId:IworkId = key;
        let msgType = msg.type;
        if (!newValue && oldValue) {
            msgType = EPostMessageType.RemoveNode;
            if (oldValue.toolsType === EToolsKey.LaserPen){
                return;
            }
        }
        if (msgType && workId) {
            const d: IWorkerMessage & Pick<IWorkerMessage, 'workId'> = msg as IWorkerMessage;
            d.workId = this.collector.isOwn(workId) ? this.collector.getLocalId(workId) : workId;
            d.msgType = msgType;
            d.dataType = EDataType.Service;
            if ((d && d.toolsType === EToolsKey.Text) || oldValue?.toolsType === EToolsKey.Text) {
                this.textEditorManager.onServiceDerive(d);
                return;
            }
            if (d.selectIds) {
                d.selectIds = d.selectIds.map(id=>{
                    return this.collector.isOwn(id) ? this.collector.getLocalId(id) : id;
                })
            }
            if (relevantId === key) {
                console.log('onServiceDerive1', data)
                setTimeout(()=>{
                    this.taskBatchData.set(`${d.dataType},${d.msgType},${d.workId}`,d);
                    this.runAnimation();
                }, 16);
            } else {
                console.log('onServiceDerive', data)
                this.taskBatchData.set(`${d.dataType},${d.msgType},${d.workId}`,d);
            }
        }
        this.runAnimation();
        if (this.zIndexNodeMethod) {
            let minZIndex:number|undefined;
            let maxZIndex:number|undefined;
            if (data.newValue && data.newValue.opt?.zIndex) {
                maxZIndex =  Math.max(maxZIndex || 0, data.newValue.opt.zIndex);
                minZIndex = Math.min(minZIndex || Infinity, data.newValue.opt.zIndex);
            }
            if (maxZIndex) this.zIndexNodeMethod.maxZIndex = maxZIndex;
            if (minZIndex) this.zIndexNodeMethod.minZIndex = minZIndex;
        }
    }
    private setZIndex(){
        const opt:BaseShapeOptions = cloneDeep(this.currentToolsData.toolsOpt);
        if(this.zIndexNodeMethod && this.isUseZIndex ){
            this.zIndexNodeMethod.addMaxLayer();
            opt.zIndex = this.zIndexNodeMethod.maxZIndex;
        }
        return opt;
    }
    private onLocalEventEnd(point: [number, number]): void {
        const workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        if (workState === EvevtWorkState.Start || workState === EvevtWorkState.Doing) {
            const _point:[number,number] = this.transformToScenePoint(point);
            this.pushPoint(_point);
            this.localEventTimerId = setTimeout(()=>{
                this.localEventTimerId = undefined;
                this.setCurrentLocalWorkData({workId:this.currentLocalWorkData.workId, workState: EvevtWorkState.Done});
                this.runAnimation();
            }, 0) as unknown as number;
            if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                TeachingAidsManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], 2);
            }
        } else if (this.currentToolsData.toolsType === EToolsKey.Text) {
            const _point:[number,number] = this.transformToScenePoint(point);
            if (this.localPointsBatchData[0] === _point[0] && this.localPointsBatchData[1] === _point[1]) {
                const opt = this.currentToolsData.toolsOpt as TextOptions;
                opt.workState = EvevtWorkState.Doing;
                opt.boxPoint = _point;
                opt.boxSize = [opt.fontSize, opt.fontSize];
                this.textEditorManager.createTextForMain({
                    workId: Date.now().toString(),
                    x: point[0],
                    y: point[1],
                    scale: this.cameraOpt.scale,
                    opt,
                    type: ETextEditorType.Text,
                    isActive: true,
                });
            }
            this.localPointsBatchData.length = 0;
        }
    }
    private onLocalEventDoing(point: [number, number]): void {
        let workState = this.currentLocalWorkData.workState;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        if (workState === EvevtWorkState.Start) {
            workState = EvevtWorkState.Doing;
            this.setCurrentLocalWorkData({workId:this.currentLocalWorkData.workId, workState})
        }
        if (workState === EvevtWorkState.Doing || this.localEventTimerId) {
            const _point:[number,number] = this.transformToScenePoint(point);
            this.pushPoint(_point);
            if (!this.localEventTimerId) {
                this.runAnimation();
            }
        }
    }
    private onLocalEventStart(point: [number, number]): void {
        const {workState} = this.currentLocalWorkData;
        if(workState === EvevtWorkState.Freeze || workState === EvevtWorkState.Unwritable){
            return ;
        }
        const _point:[number,number] = this.transformToScenePoint(point);
        this.pushPoint(_point);
        if (this.currentToolsData.toolsType === EToolsKey.Text) {
            return ;
        }
        this.textEditorManager.checkEmptyTextBlur();
        const workId = this.currentToolsData.toolsType === EToolsKey.Selector? Storage_Selector_key : Date.now();
        const opt = this.setZIndex();
        this.setCurrentLocalWorkData({
            workId,
            workState: EvevtWorkState.Start,
            toolsOpt: opt
        }, EPostMessageType.CreateWork)
        this.maxDrawCount = 0;
        this.cacheDrawCount = 0;
        this.wokerDrawCount = 0;
        this.subWorkerDrawCount = 0;
        this.reRenders.length = 0;
        if ( this.isCanRecordUndoRedo ) {
            if (this.currentToolsData.toolsType === EToolsKey.Selector) {
                this.undoTickerId = Date.now();
            } else {
                this.undoTickerId = workId as number;
            }
            UndoRedoMethod.emitter.emit("undoTickerStart", this.undoTickerId);
        }
        if (this.isCanDrawWork) {
            this.collector?.dispatch({
                type: EPostMessageType.CreateWork,
                workId,
                toolsType: this.currentToolsData.toolsType,
                opt: this.currentToolsData.toolsOpt
            })
            if (this.collector.hasSelector()) {
                this.taskBatchData.set(Storage_Selector_key,{
                    workId: Storage_Selector_key,
                    selectIds: [],
                    msgType: EPostMessageType.Select,
                    dataType: EDataType.Service,
                })
            }
        } else if (this.currentToolsData.toolsType === EToolsKey.Selector) {
            TeachingAidsManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], -1);
        }
        this.consume();
    }
    consume(): void {
        this.animationId = undefined;
        const workState = this.currentLocalWorkData.workState;
        let isAble = false;
        if (!this.localEventTimerId) {
            if (workState !== EvevtWorkState.Pending && this.localPointsBatchData.length) {
                if (this.wokerDrawCount !== Infinity && this.wokerDrawCount <= this.subWorkerDrawCount && this.cacheDrawCount < this.maxDrawCount) {
                    isAble = true;
                }
                if (!this.maxDrawCount) {
                    isAble = true;
                }
                if (isAble) {
                    this.taskBatchData.set(this.currentLocalWorkData.workId,{
                        op: this.localPointsBatchData.map(n=>n),
                        workState,
                        workId: this.currentLocalWorkData.workId,
                        dataType: EDataType.Local,
                        msgType: EPostMessageType.DrawWork,
                        isRunSubWork: this.isRunSubWork,
                        undoTickerId: workState === EvevtWorkState.Done && this.undoTickerId || undefined
                    })
                    this.localPointsBatchData.length = 0;
                    this.cacheDrawCount = this.maxDrawCount;
                }
            }
            if (this.taskBatchData.size) {
                // console.log('consume', [...this.taskBatchData.values()])
                this.post(this.taskBatchData);
                this.taskBatchData.clear();
                if (this.undoTickerId && workState === EvevtWorkState.Done) {
                    this.undoTickerId = undefined;
                }
            }
        }
        if (this.taskBatchData.size ||
            this.localPointsBatchData.length ) {
            this.animationId = requestAnimationFrame(this.consume.bind(this));
        }
    }
    post(msg: Map<unknown, IWorkerMessage>): void {
        this.msgEmitter.postMessage(msg);
        const subMsg = new Map<unknown, IWorkerMessage>();
        for (const [key, value] of msg.entries()) {
            if (key === 'Init' || key === 'ClearAll' || key === 'UpdateCamera') {
                subMsg.set(key, value);
            } else if (value.isRunSubWork) {
                subMsg.set(key, value);
            }
        }
        subMsg.size && this.subWorker?.postMessage(subMsg);
    }
    on(): void {
        this.msgEmitter.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, sp, drawCount, workerTasksqueueCount} = e.data;
                if (workerTasksqueueCount) {
                    this.workerTasksqueueCount = workerTasksqueueCount;
                }
                console.log('render', render, sp, workerTasksqueueCount)
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render) {
                    this.render(render);
                    return;
                }
                if ( drawCount ) {
                    this.wokerDrawCount = drawCount;
                    if (this.wokerDrawCount < Infinity) {
                        this.maxDrawCount = Math.max(this.maxDrawCount, this.wokerDrawCount);
                    } else {
                        this.maxDrawCount = 0;
                    }
                    if (render?.length) {
                        this.render(render);
                        if (this.wokerDrawCount < this.subWorkerDrawCount) {
                            this.reRenders.forEach(r=>{
                                r.isUnClose = false;
                            })
                            // console.log('reRenders', this.reRenders.length)
                            this.render(this.reRenders);
                            this.reRenders.length = 0;
                        }
                    }
                }
            }
        }
    }
    private createOptimizationWorker () {
        this.subWorker = new SubWorker();
        this.subWorker.onmessage = (e: MessageEvent<IBatchMainMessage>) => {
            if (e.data) {
                const {render, drawCount, sp} = e.data;
                if (sp?.length) {
                    this.collectorSyncData(sp);
                }
                if (!drawCount && render?.length) {
                    this.render(render);
                    return;
                }
                if ( drawCount ) {
                    this.subWorkerDrawCount = drawCount;
                    if (this.wokerDrawCount < Infinity) {
                        this.maxDrawCount = Math.max(this.maxDrawCount, this.subWorkerDrawCount);
                    }
                    if (render?.length) {
                        if (this.subWorkerDrawCount > this.wokerDrawCount) {
                            render.forEach(r=>r.isUnClose=true)
                            this.reRenders.push(...render)
                        }
                        if (this.wokerDrawCount < Infinity) {
                            this.render(render);
                        }
                    }
                }
            }
        }
    }
    private collectorSyncData(sp: IMainMessage[]){
        let isHasOther = false;
        for (const data of sp) {
            const { type, selectIds, opt, selectRect, strokeColor, fillColor, willSyncService, isSync, 
                undoTickerId, imageBitmap, scenePath, canvasHeight, canvasWidth, rect, op, canTextEdit, 
                selectorColor, canRotate, scaleType, textOpt, toolsType, workId} = data;
            switch (type) {
                case EPostMessageType.Select:
                    const value:Partial<ShowFloatBarMsgValue> | undefined = selectIds?.length ? {...selectRect, selectIds, canvasHeight, canvasWidth} : undefined;
                    if (value && opt?.strokeColor) {
                        value.selectorColor = opt.strokeColor;
                    }
                    if (value && selectorColor) {
                        value.selectorColor = selectorColor;
                    }
                    if(value && strokeColor){
                        value.strokeColor = strokeColor;
                    }
                    if (value && opt?.fillColor) {
                        value.fillColor = opt.fillColor;
                    }
                    if (value && fillColor) {
                        value.fillColor = fillColor;
                    }
                    if (value && canRotate) {
                        value.canRotate = canRotate;
                    }
                    if (value && scaleType) {
                        value.scaleType = scaleType;
                    }
                    if (value && canTextEdit) {
                        value.canTextEdit = canTextEdit;
                    }
                    if (value && textOpt) {
                        value.textOpt = textOpt;
                    }
                    // console.log('collectorSyncData', value)
                    TeachingAidsManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], !!value, value);
                    if (willSyncService) {
                        this.collector?.dispatch({type, selectIds, opt, isSync });
                        if (undoTickerId) {
                            UndoRedoMethod.emitter.emit("undoTickerEnd", undoTickerId);
                        }
                    }
                    break; 
                case EPostMessageType.Snapshot:
                    if (imageBitmap && scenePath) {
                        const resolve = this.snapshotMap.get(scenePath);
                        if (resolve) {
                            resolve(imageBitmap as ImageBitmap);
                        }
                    }
                    break;
                case EPostMessageType.BoundingBox:
                    if (rect && scenePath) {
                        const resolve = this.boundingRectMap.get(scenePath);
                        if (resolve) {
                            resolve(rect as IRectType);
                        }
                    }
                    break;
                case EPostMessageType.Cursor:
                    if (op) {
                        this.cursor.collectServiceCursor({...data});
                    }
                    break;
                case EPostMessageType.Clear:
                    TeachingAidsManager.InternalMsgEmitter?.emit([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], false);
                    this.clearAllResolve && this.clearAllResolve(true);
                    break;
                case EPostMessageType.TextUpdate:
                    if (toolsType === EToolsKey.Text && workId) {
                        const point = this.transformToOriginPoint((opt as TextOptions)?.boxPoint || [0,0])
                        const boxSize =  (opt as TextOptions)?.boxSize || [0,0];
                        this.textEditorManager.updateTextForWorker({
                            x: point[0],
                            y: point[1],
                            w: boxSize[0],
                            h: boxSize[1],
                            scale: this.cameraOpt.scale,
                            workId: workId as string,
                            opt: opt as TextOptions,
                            isDel: !opt
                        })
                    }
                    break;
                case EPostMessageType.GetTextActive:
                    if (toolsType === EToolsKey.Text && workId) {
                        this.textEditorManager.updateTextForWorker({
                            workId: workId as string,
                            isActive: true
                        })
                    }
                    break;
                default:
                    isHasOther = true;
                    break;
            }
        }
        if (isHasOther) {
            requestAsyncCallBack(()=>{
                this.collectorAsyncData(sp);          
            }, MainEngineForWorker.maxLastSyncTime)
        }
    }
    private collectorAsyncData(sp: IMainMessage[]){
        for (const data of sp) {
            const {type, op, workId, index, removeIds, ops, opt, updateNodeOpt, toolsType, isSync, undoTickerId} = data;
            switch (type) {
                case EPostMessageType.DrawWork:
                    if (op?.length && workId && typeof index === 'number') {
                        this.collector?.dispatch({
                            type,
                            op,
                            workId,
                            index,
                            isSync
                        })
                    }
                    break
                case EPostMessageType.FullWork:
                    if (ops) {
                        this.collector?.dispatch({type, ops, workId, updateNodeOpt, opt, toolsType,isSync});
                    }
                    break;
                case EPostMessageType.UpdateNode:
                    if (updateNodeOpt || opt || ops || op) {
                        this.collector?.dispatch({type, updateNodeOpt, workId, opt, ops, op, isSync})
                    }
                    break;
                case EPostMessageType.RemoveNode:
                    if (op || removeIds?.length) {
                        this.collector?.dispatch({type, removeIds, isSync})
                    }
                    break;
                default:
                    break;
            }
            if (undoTickerId) {
                UndoRedoMethod.emitter.emit("undoTickerEnd", undoTickerId);
            }
        }
    }
    async clearAll(justLocal:boolean = false) {
        this.taskBatchData.set('ClearAll', {
            dataType: EDataType.Local,
            msgType: EPostMessageType.Clear,
        });
        this.textEditorManager.destory();
        this.runAnimation();
        if (!justLocal) {
            const undoTickerId = Date.now();
            UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
            this.collector?.dispatch({
                type: EPostMessageType.Clear
            })
            UndoRedoMethod.emitter.emit("undoTickerEnd", undoTickerId);
        }
        if (this.zIndexNodeMethod) {
            this.zIndexNodeMethod.maxZIndex = 0;
            this.zIndexNodeMethod.minZIndex = 0;
        }
        this.localPointsBatchData.length = 0;
        await new Promise((resolve)=>{
            this.clearAllResolve = resolve;
        }).then(()=>{
            this.clearAllResolve = undefined;
        })
    }
    unabled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Freeze, workId:undefined});
    }
    abled(): void {
        this.setCurrentLocalWorkData({workState:EvevtWorkState.Pending, workId:undefined});
    }
    destroy(): void {
        this.msgEmitter?.terminate();
        this.destroySubWorker();
        this.internalMsgEmitterRemoveListener();
    }
    updateNode(workId:IworkId, updateNodeOpt:IUpdateNodeOpt) {
        this.taskBatchData.set(`${EPostMessageType.UpdateNode},${workId}`,{
            msgType: EPostMessageType.UpdateNode,
            workId,
            updateNodeOpt,
            dataType: EDataType.Local
        })
        this.runAnimation();
    }
    setCurrentLocalWorkData(currentLocalWorkData: IActiveWorkDataType, msgType: EPostMessageType = EPostMessageType.None) {
        super.setCurrentLocalWorkData(currentLocalWorkData);
        const {workState, workId, toolsOpt} = currentLocalWorkData
        if(workState === EvevtWorkState.Unwritable) {
            return;
        }
        if (msgType !== EPostMessageType.None) {
            const toolsType = this.currentToolsData.toolsType;
            this.taskBatchData.set(`${msgType},${workId}`,{
                msgType,
                workId,
                toolsType: toolsType,
                opt: {...this.currentToolsData.toolsOpt, ...toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime},
                dataType: EDataType.Local,
                isRunSubWork: this.isRunSubWork
            })
            this.runAnimation();
        }
    }
    setCurrentToolsData(currentToolsData: IActiveToolsDataType) {
        const toolsType = currentToolsData.toolsType;
        const isChangeToolsType = this.currentToolsData?.toolsType !== currentToolsData.toolsType;
        super.setCurrentToolsData(currentToolsData);
        if (isChangeToolsType) {
            if (this.collector.hasSelector()) {
                const undoTickerId = Date.now();
                UndoRedoMethod.emitter.emit("undoTickerStart", undoTickerId);
                this.taskBatchData.set(Storage_Selector_key,{
                    workId: Storage_Selector_key,
                    msgType: EPostMessageType.RemoveNode,
                    dataType: EDataType.Local,
                    undoTickerId
                })
            }
            if (this.textEditorManager.activeId) {
                this.textEditorManager.checkEmptyTextBlur();
            }
        }
        
        this.taskBatchData.set(`UpdateTools`,{
            msgType: EPostMessageType.UpdateTools,
            dataType: EDataType.Local,
            toolsType,
            opt: {...currentToolsData.toolsOpt, syncUnitTime: MainEngineForWorker.maxLastSyncTime },
            isRunSubWork: this.isRunSubWork
        })
        this.runAnimation();
    }
    setCameraOpt(cameraOpt: ICameraOpt){
        super.setCameraOpt(cameraOpt);
        const {width,height} = cameraOpt;
        if (width !== this.offscreenCanvasOpt.width || height !== this.offscreenCanvasOpt.height) {
            if (this.bgCanvas) {
                this.bgCanvas.style.width = `${width}px`;
                this.bgCanvas.style.height = `${height}px`;
            }
            if (this.floatCanvas) {
                this.floatCanvas.style.width = `${width}px`;
                this.floatCanvas.style.height = `${height}px`;
            }
            this.updateCanvas({width, height});
        }
        if (!this.useTasksqueue) {
            this.useTasksqueue = true;
            this.mianTasksqueueCount = 1;
            this.workerTasksqueueCount = 1;
        }
        if (this.useTasksqueue) {
            if (this.mianTasksqueueCount && this.workerTasksqueueCount) {
                if(this.mianTasksqueueCount === this.workerTasksqueueCount){
                    this.mianTasksqueueCount++;
                    this.taskBatchData.set(`UpdateCamera`,{
                        msgType: EPostMessageType.UpdateCamera,
                        dataType: EDataType.Local,
                        cameraOpt,
                        isRunSubWork: true,
                        mainTasksqueueCount: this.mianTasksqueueCount
                    })
                    this.runAnimation();
                    this.textEditorManager.onCameraChange(cameraOpt)
                }   
            }
            if (this.useTasksClockId) {
                clearTimeout(this.useTasksClockId);
            }
            this.useTasksClockId = setTimeout(() => {
                this.useTasksClockId = undefined;
                this.useTasksqueue = false;
                this.mianTasksqueueCount = undefined;
                this.workerTasksqueueCount = undefined;
            }, MainEngineForWorker.maxLastSyncTime) as unknown as number;
        }
    }
    getSnapshot(scenePath: string, width?: number, height?: number, camera?:Pick<ICameraOpt,"centerX" | "centerY" | "scale">):Promise<ImageBitmap> | undefined{
        const cur = this.snapshotMap?.get(scenePath);
        if (!cur) {
            const scenes = this.collector.getNamespaceData(scenePath);
            Object.keys(scenes).forEach(key=>{
                if(this.collector.getLocalId(key) === Storage_Selector_key){
                    delete scenes[key];
                }
            })
            if (Object.keys(scenes).length) {
                const w = width || this.cameraOpt.width;
                const h =  height || this.cameraOpt.height;
                const data:IWorkerMessage = {
                    msgType: EPostMessageType.Snapshot,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    w,
                    h,
                    cameraOpt: camera && {
                        ...camera,
                        width: w,
                        height: h,
                    } || this.cameraOpt,
                    isRunSubWork: true
                }
                this.taskBatchData.set(`${data.scenePath}`,data);
                this.runAnimation();
                return new Promise<ImageBitmap>((resolve)=>{
                    this.snapshotMap.set(scenePath, resolve);
                }).then((imageBitmap)=>{
                    this.snapshotMap.delete(scenePath);
                    return imageBitmap;
                })
            }            
        }
    }
    getBoundingRect(scenePath: string):Promise<IRectType>|undefined{
        const cur = this.boundingRectMap?.get(scenePath);
        if (!cur) {
            const scenes = this.collector.getNamespaceData(scenePath);
            Object.keys(scenes).forEach(key=>{
                if(this.collector.getLocalId(key) === Storage_Selector_key){
                    delete scenes[key];
                }
            })
            if (Object.keys(scenes).length) {
                const data:IWorkerMessage = {
                    msgType: EPostMessageType.BoundingBox,
                    dataType: EDataType.Local,
                    scenePath,
                    scenes,
                    cameraOpt: this.cameraOpt,
                    isRunSubWork: true
                }
                this.taskBatchData.set(`${data.scenePath}`,data);
                this.runAnimation();
                return new Promise<IRectType>((resolve)=>{
                    this.boundingRectMap.set(scenePath, resolve);
                }).then((rect)=>{
                    this.boundingRectMap.delete(scenePath);
                    return rect;
                })
            }            
        }          
    }   
}