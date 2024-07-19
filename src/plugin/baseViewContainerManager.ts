/* eslint-disable @typescript-eslint/no-explicit-any */
import type EventEmitter2 from "eventemitter2";
import { ICameraOpt, ILayerOptionType, IMainMessageRenderData, IOffscreenCanvasOptionType } from "../core/types";
import { BaseSubWorkModuleProps, InternalMsgEmitterType, ApplianceManagerLike } from "./types";
import type { CameraState, View } from "./types";
import {throttle, isEqual, clone, isNumber} from "lodash";
import { ECanvasContextType, ECanvasShowType, EToolsKey, EvevtWorkState } from "../core/enum";
import { ShowFloatBarMsgValue } from "../displayer/types";
import { UndoRedoMethod, UndoRedoMethodProps } from "../undo";
import { BaseViewDisplayer } from "./displayerView";
import { getPosition, isOnlyOneTouch } from "./utils";
import { Main_View_Id } from "../core/const";

export interface ViewInfo {
    id: string;
    focusScenePath: string;
    displayer: MainViewDisplayerManager | AppViewDisplayerManager;
    container?: HTMLDivElement;
    cameraOpt?: ICameraOpt;
    viewData?: View;
    [key:string]:any
}
/** view容器管理器抽象 */
export abstract class ViewContainerManager {
    static defaultCameraOpt:Pick<ICameraOpt,'centerX'|'centerY'|'scale'> = {
        centerX:0,
        centerY:0,
        scale: 1,
    }
    static defaultScreenCanvasOpt:Pick<IOffscreenCanvasOptionType,'autoRender'|'contextType'> = {
        autoRender: false,
        contextType: ECanvasContextType.Canvas2d, 
    }
    static defaultLayerOpt:Pick<ILayerOptionType,'offscreen'|'handleEvent'|'depth'> = {
        offscreen: true,
        handleEvent: false,
        depth: false,
    }
    internalMsgEmitter: EventEmitter2;
    control: ApplianceManagerLike;
    abstract focuedViewId?: string;
    abstract focuedView?: ViewInfo;
    mainView?: ViewInfo;
    appViews: Map<string,ViewInfo> = new Map();
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter} = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        this.internalMsgEmitter.on('addUndoTicker',this.undoTickerStart.bind(this));
        this.internalMsgEmitter.on('excludeIds',this.addExcludeIds.bind(this));
    }
    undoTickerStart(id:number, viewId:string){
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            view.displayer.commiter.undoTickerStart(id, view.focusScenePath);
        }
    }
    addExcludeIds(ids:string[], viewId:string){
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            view.displayer.commiter.addExcludeIds(ids);
        }
    }
    undo(){
        const focuedView = this.focuedView;
        let number = 0;
        if (focuedView) {
            const focusScenePath = focuedView.focusScenePath;
            number = focuedView.displayer.commiter.undo(focusScenePath) || 0;
        }
        return number;
    }
    redo(){
        const focuedView = this.focuedView;
        let number = 0;
        if (focuedView) {
            const focusScenePath = focuedView.focusScenePath;
            number = focuedView.displayer.commiter.redo(focusScenePath) || 0;
        }
        return number;
    }
    protected validator(target:ViewInfo, key:string, value:any) {
        const oldValue = clone(target[key]);
        const newValue = clone(value);
        if (key === 'focusScenePath' && value && !isEqual(oldValue, newValue)) {
            this.control.internalSceneChange(target.id, newValue);
            this.focuedView?.displayer.commiter.onChangeScene();
        }
        if (key === 'cameraOpt' && !isEqual(oldValue, newValue)) {
            this.control.internalCameraChange(target.id, newValue);
        }
    }
    abstract mountView(viewIde:string): Promise<void>;
    destroyAppView(viewId:string, justLocal:boolean = false) {
        const viewInfo = this.appViews.get(viewId);
        if(viewInfo){
            this.control.textEditorManager.clear(viewId, justLocal);
            viewInfo.displayer.destroy();
            this.appViews.delete(viewId);
        }
    }
    createMianView(originMainView:ViewInfo) {
        this.mainView = new Proxy(originMainView, {
            set: (target: ViewInfo, key: string, value) => {  
                if (this.control.worker.isActive) {
                    this.validator(target, key, value)
                }
                target[key] = value;
                return true;
            }
        });
    }
    createAppView(originAppView:ViewInfo) {
        const viewId = originAppView.id;
        const appView = new Proxy(originAppView, {
            set: (target: ViewInfo, key: string, value) => { 
                if (this.control.worker.isActive) {
                    this.validator(target, key, value)
                }
                target[key] = value;
                return true;
            }
        });
        this.appViews.set(viewId, appView)
    }
    isAppView(viewId:string){
        return viewId !== Main_View_Id && this.appViews.has(viewId);
    }
    getView(viewId:string){
        if (viewId === Main_View_Id) {
            return this.mainView;
        } else {
            return this.appViews?.get(viewId);
        }
    }
    getCurScenePath(viewId:string){
        const view = this.getView(viewId);
        if (view) {
            return view.focusScenePath;
        }
    }
    getAllViews(){
        return[ this.mainView, ...this.appViews.values()]
    }
    setViewScenePath(viewId:string, scenePath: string) {
        if (viewId === Main_View_Id && this.mainView) {
            this.mainView.focusScenePath = scenePath;
        } else {
            const view = viewId && this.appViews?.get(viewId) || undefined;
            if (view) {
                view.focusScenePath = scenePath;
            }
        }
    }
    setViewData(viewId:string, viewData: View) {
        if (viewId === Main_View_Id && this.mainView) {
            this.mainView.viewData = viewData;
        } else {
            const view = viewId && this.appViews?.get(viewId) || undefined;
            if (view) {
                view.viewData = viewData;
            }
        }
    }
    setFocuedViewId(viewId:string) {
        this.focuedViewId = viewId;
        if (viewId === Main_View_Id) {
            this.focuedView = this.mainView;
        } else {
            this.focuedView = viewId && this.appViews?.get(viewId) || undefined;
        }
        this.control.cursor.onFocusViewChange();
        if (this.focuedView) {
            this.focuedView.displayer.commiter.onFocusView();
        }
    }
    setViewFocusScenePath(viewId:string, scenePath:string){
        let info:ViewInfo|undefined;
        if (viewId === Main_View_Id) {
            info = this.mainView;
        } else {
            info = this.appViews?.get(viewId);
        }
        if (info) {
            info.focusScenePath = scenePath;
        }
    }
    /** 销毁 */
    destroy(){
        this.internalMsgEmitter.removeAllListeners('addUndoTicker');
        this.internalMsgEmitter.removeAllListeners('excludeIds');
        this.mainView?.displayer.destroy();
        this.appViews.forEach(view => {
            this.destroyAppView(view.id, true);
            this.control.worker.destroyViewWorker(view.id);
        });
    }
    setFocuedViewCameraOpt(cameraState: CameraState): void {
        if (this.focuedView) {
            const oldValue = this.focuedView.cameraOpt;
            if (!isEqual(oldValue, cameraState)) {
                this.focuedView.cameraOpt = cameraState;
            }
        }   
    }
    /** view中心点坐标转换成页面原始坐标 */
    transformToOriginPoint(p: [number, number], viewId: string): [number, number] {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointOnScreen(p[0],p[1]);
            return [_p.x,_p.y];
        }
        return p
    }
    /** 页面坐标转换成view中心点坐标 */
    transformToScenePoint(p: [number, number], viewId: string): [number, number] {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointInWorld({x:p[0],y:p[1]});
            return [_p.x,_p.y];
        }
        return p
    }
    /** 绘制view */
    render(renderData: IMainMessageRenderData[]): void {
        for (const data of renderData) {
            const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas, viewId} = data;
            const displayer = this.getView(viewId)?.displayer;
            if (displayer && rect) {
                const {dpr,canvasBgRef,canvasFloatRef, canvasServiceFloatRef, canvasTopRef} = displayer;
                const w = Math.floor(rect.w * dpr);
                const h = Math.floor(rect.h * dpr);
                const x = Math.ceil(rect.x * dpr);
                const y = Math.ceil(rect.y * dpr);
                if (isClear) {
                    switch (clearCanvas) {
                        case ECanvasShowType.TopFloat:
                            canvasTopRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;
                        case ECanvasShowType.Float:
                            canvasFloatRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;                            
                        case ECanvasShowType.ServiceFloat:
                            canvasServiceFloatRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;
                        case ECanvasShowType.Bg:
                            // console.log('render-clear', x, y, w, h)
                            canvasBgRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;
                    }
                    continue;
                }
                if (drawCanvas && imageBitmap) {
                    switch (drawCanvas) {
                        case ECanvasShowType.TopFloat:
                            canvasTopRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        case ECanvasShowType.Float: {
                            canvasFloatRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        }                            
                        case ECanvasShowType.ServiceFloat: {
                            canvasServiceFloatRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        }
                        case ECanvasShowType.Bg: {
                            // console.log('render-render', x, y, w, h)
                            canvasBgRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        }
                    }
                }
                if (isUnClose) {
                    continue;
                }
                imageBitmap?.close();
            }

        }
    }
    /** 是否绘制浮动选框 */
    showFloatBar(viewId: string, isShow: boolean, opt?: Partial<ShowFloatBarMsgValue>): void {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.showFloatBar(isShow, opt);
        }
    }
    /** 激活浮动选框 */
    // activeFloatBar(viewId:string){
    //     const displayer = this.getView(viewId)?.displayer;
    //     if(displayer?.vDom){
    //         displayer.vDom.setFloatZIndex(2);
    //     }
    // }
    /** 销毁浮动选框 */
    // unActiveFloatBar(viewId:string){
    //     const view = this.getView(viewId);
    //     const vDom = view?.displayer.vDom;
    //     if(vDom){
    //         vDom.setFloatZIndex(-1);
    //     }
    // }
    // /** 激活刷新指针 */
    // setActiveCursor(viewId:string, cursorInfo: { x?: number; y?: number, roomMember?: RoomMember}) {
    //     const view = this.getView(viewId);
    //     const vDom = view?.displayer.vDom;
    //     if (vDom) {
    //         this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], cursorInfo);
    //     }
    // }
    /** 激活刷新文字编辑器 */
    setActiveTextEditor(viewId:string,activeTextId?:string) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.setActiveTextEditor(activeTextId);
        }
    }
}
/** appView容器管理器抽象 */
export abstract class AppViewDisplayerManager {
    viewId:string;
    abstract dpr:number;
    abstract width:number;
    abstract height:number;
    readonly control: ApplianceManagerLike;
    readonly internalMsgEmitter: EventEmitter2;
    readonly commiter: UndoRedoMethod;
    abstract vDom?: BaseViewDisplayer; 
    abstract eventTragetElement?: HTMLDivElement;
    abstract canvasContainerRef: React.RefObject<HTMLDivElement>;
    abstract canvasTopRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasBgRef: React.RefObject<HTMLCanvasElement>;
    abstract floatBarRef: React.RefObject<HTMLDivElement>;
    abstract containerOffset: { x: number; y: number };
    private cachePoint?:[number,number];
    private cacheCursorPoint?:[number|undefined,number|undefined];
    private active:boolean = true;
    constructor(viewId:string, control: ApplianceManagerLike, internalMsgEmitter:EventEmitter2) {
        this.viewId = viewId;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const props:UndoRedoMethodProps = {
            control: this.control,
            internalMsgEmitter: this.internalMsgEmitter,
            viewId: this.viewId
        }
        this.commiter = new UndoRedoMethod(props);
    }
    abstract setCanvassStyle(): void;
    bindToolsClass(){
        const toolsKey = this.control.worker?.currentToolsData?.toolsType;
        switch (toolsKey) {
            case EToolsKey.Text:
            case EToolsKey.Pencil:
            case EToolsKey.LaserPen:
            case EToolsKey.Arrow:
            case EToolsKey.Straight:
            case EToolsKey.Rectangle:
            case EToolsKey.Ellipse:
            case EToolsKey.Star:
            case EToolsKey.Polygon:
            case EToolsKey.SpeechBalloon:
                if (this.eventTragetElement) {
                    this.eventTragetElement.className = `netless-whiteboard ${ toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow' }`;
                }
                break;
        }
    }
    mountView(): void {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
    }
    reflashContainerOffset(){
        if(this.eventTragetElement){
            this.containerOffset = this.getContainerOffset(this.eventTragetElement,{x:0,y:0});
        }
    }
    updateSize(){
        this.setCanvassStyle();
        this.reflashContainerOffset();
    }
    setViewId(viewId:string){
        this.viewId = viewId;
    }
    destroy(){
        if (this.eventTragetElement) {
            this.removeDisplayerEvent(this.eventTragetElement)
        }
        this.vDom = undefined;
        this.control.cursor.clearViewCursor(this.viewId);
        this.internalMsgEmitter.removeAllListeners([InternalMsgEmitterType.Cursor,this.viewId]);
    }
    getPoint(e:any):[number,number]|undefined{
        const point:{x:number,y:number} = getPosition(e);
        if(point && isNumber(point.x) && isNumber(point.y)) {
            return [point.x - this.containerOffset.x, point.y - this.containerOffset.y];
        }
    }
    setActive(bol:boolean){
        this.active = bol;
    }
    async stopEventHandler() {
        if(this.cachePoint){
            await this.control.worker.originalEventLintener(EvevtWorkState.Done, this.cachePoint, this.viewId);
            this.cachePoint = undefined;
        }
    }
    private getTranslate(element:any) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] ||  getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        return [x, y]
    }
    protected getContainerOffset(eventTraget: HTMLDivElement, offset: { x: number; y: number })  {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent as HTMLDivElement, newOffset);
        }
        return newOffset;
    }
    protected mousedown = (e:MouseEvent) =>{
        if(!this.active) return;
        if (e.button === 0 && this.viewId) {
            this.control.worker.checkDrawingWork(this.viewId);
            this.reflashContainerOffset();
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
        }
    }
    protected mousemove = (e:MouseEvent) =>{
        if(!this.active) return;
        if (this.viewId) {
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point,this.viewId)
        }
    }
    protected mouseup = (e:MouseEvent) =>{
        if(!this.active) return;
        if (e.button === 0 && this.viewId) {
            const point = this.getPoint(e) || this.cachePoint;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point,this.viewId)
            this.cachePoint = undefined;
        }
    }
    protected touchstart = (e:TouchEvent) =>{
        if(!this.active) return;
        if(!isOnlyOneTouch(e)){
            this.control.worker.unWritable();
            this.viewId && this.control.worker.removeDrawingWork(this.viewId);
            return;
        }
        if (this.viewId) {
            if(!this.control.worker.isAbled()){
                const toolsType = this.control.worker.getCurrentToolsData()?.toolsType;
                toolsType && this.control.effectViewContainer(toolsType);
            }
            this.control.worker.checkDrawingWork(this.viewId);
            this.reflashContainerOffset();
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
        }
    }
    protected touchmove = (e:TouchEvent) =>{
        if(!this.active) return;
        if(!isOnlyOneTouch(e)){
            this.control.worker.unWritable();
            this.control.worker.removeDrawingWork(this.viewId);
            return;
        }
        if (this.viewId) {
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point, this.viewId)
        }
    }
    protected touchend = (e:TouchEvent) =>{
        if(!this.active) return;
        if(!isOnlyOneTouch(e) || !this.control.worker.isAbled()){
            this.control.worker.unWritable();
            this.control.worker.removeDrawingWork(this.viewId);
            return;
        }
        if (this.viewId) {
            const point = this.getPoint(e) || this.cachePoint;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point,this.viewId)
            this.cachePoint = undefined;
        }
    }
    cursorMouseMove = throttle((e:MouseEvent) => {
        const curPoint = this.getPoint(e);
        if ( this.cacheCursorPoint && isEqual(curPoint, this.cacheCursorPoint) || !this.viewId) {
            return;
        }
        this.cacheCursorPoint = curPoint;
        curPoint && this.control.worker.sendCursorEvent(curPoint,this.viewId);
    }, 30, {'leading':false})
    protected cursorMouseLeave = throttle(() =>{
        if (this.viewId) {
            this.cacheCursorPoint = [undefined,undefined];
            this.control.worker.sendCursorEvent(this.cacheCursorPoint,this.viewId);
        }
    }, 30, {'leading':false})
    protected keydown =(e:KeyboardEvent)=> {
        this.control.hotkeyManager.colloctHotkey(e);
    }
    protected bindDisplayerEvent(div:HTMLDivElement) {
        div.addEventListener('mousedown',this.mousedown, false);
        div.addEventListener('touchstart',this.touchstart, {
            capture: true,
            passive: false
        });

        window.addEventListener('mouseleave',this.mouseup, false);
        window.addEventListener('mousemove',this.mousemove, {
            capture: true,
            passive: false
        });
        window.addEventListener('mouseup',this.mouseup, false);

        window.addEventListener('touchmove',this.touchmove, {
            capture: true,
            passive: false
        });
        window.addEventListener('touchend',this.touchend, {
            capture: true,
            passive: false
        });

        div.addEventListener('mousemove',this.cursorMouseMove, false);
        div.addEventListener('mouseleave',this.cursorMouseLeave, false);

        div.addEventListener('keydown', this.keydown,true);
    }
    protected removeDisplayerEvent(div:HTMLDivElement) {
        div.removeEventListener('mousedown',this.mousedown);
        div.removeEventListener('touchstart',this.touchstart);

        window.removeEventListener('mouseleave',this.mouseup);
        window.removeEventListener('mousemove',this.mousemove);
        window.removeEventListener('mouseup',this.mouseup);
        
        window.removeEventListener('touchmove',this.touchmove);
        window.removeEventListener('touchend',this.touchend);

        div.removeEventListener('mousemove',this.cursorMouseMove);
        div.removeEventListener('mouseleave',this.cursorMouseLeave);

        div.removeEventListener('keydown', this.keydown);
    }
}
/** 主容器管理器抽象 */
export abstract class MainViewDisplayerManager {
    readonly viewId:string = Main_View_Id;
    readonly control: ApplianceManagerLike;
    readonly internalMsgEmitter: EventEmitter2;
    readonly commiter: UndoRedoMethod;
    abstract dpr:number;
    abstract width:number;
    abstract height:number;
    abstract vDom?: BaseViewDisplayer; 
    abstract eventTragetElement?: HTMLDivElement;
    abstract snapshotContainerRef?: React.RefObject<HTMLDivElement>;
    abstract canvasContainerRef: React.RefObject<HTMLDivElement>;
    abstract canvasTopRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasBgRef: React.RefObject<HTMLCanvasElement>;
    abstract floatBarRef: React.RefObject<HTMLDivElement>;
    abstract containerOffset: { x: number; y: number };
    private cachePoint?:[number,number];
    private cacheCursorPoint?:[number|undefined,number|undefined];
    private active:boolean = true;
    constructor(control: ApplianceManagerLike, internalMsgEmitter:EventEmitter2) {
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const props:UndoRedoMethodProps = {
            control: this.control,
            internalMsgEmitter: this.internalMsgEmitter,
            viewId:this.viewId
        }
        this.commiter = new UndoRedoMethod(props);
    }
    abstract setCanvassStyle():void;
    bindToolsClass(){
        const toolsKey = this.control.worker?.currentToolsData?.toolsType;
        switch (toolsKey) {
            case EToolsKey.Text:
            case EToolsKey.Pencil:
            case EToolsKey.LaserPen:
            case EToolsKey.Arrow:
            case EToolsKey.Straight:
            case EToolsKey.Rectangle:
            case EToolsKey.Ellipse:
            case EToolsKey.Star:
            case EToolsKey.Polygon:
            case EToolsKey.SpeechBalloon:
                if (this.eventTragetElement) {
                    this.eventTragetElement.className = `netless-whiteboard ${ toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow' }`;
                }
                break;
        }
    }
    mountView(): void {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
    }
    updateSize(){
        this.setCanvassStyle();
    }
    reflashContainerOffset(){
        if(this.eventTragetElement){
            this.containerOffset = this.getContainerOffset(this.eventTragetElement,{x:0,y:0});
        }
    }
    destroy(){
        if (this.eventTragetElement) {
            this.removeDisplayerEvent(this.eventTragetElement)
        }
        this.vDom = undefined;
        this.control.cursor.destroy();
        this.internalMsgEmitter.removeAllListeners([InternalMsgEmitterType.Cursor,this.viewId]);
    }
    getPoint(e:any):[number,number]|undefined{
        const point:{x:number,y:number} = getPosition(e);
        if(point && isNumber(point.x) && isNumber(point.y)) {
            return [point.x - this.containerOffset.x, point.y - this.containerOffset.y];
        }
    }
    setActive(bol:boolean){
        this.active = bol;
    }
    async stopEventHandler() {
        if(this.cachePoint){
            await this.control.worker.originalEventLintener(EvevtWorkState.Done, this.cachePoint, this.viewId);
            this.cachePoint = undefined;
        }
    }
    private getTranslate(element:any) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] ||  getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        return [x, y]
    }
    protected getContainerOffset(eventTraget: HTMLDivElement, offset: { x: number; y: number })  {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent as HTMLDivElement, newOffset);
        }
        return newOffset;
    }
    protected mousedown = (e:MouseEvent) =>{
        if(!this.active) return;
        if (e.button === 0) {
            this.control.worker.checkDrawingWork(this.viewId);
            this.reflashContainerOffset();
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
        }
    }
    protected mousemove = (e:MouseEvent) =>{
        if(!this.active) return;
        const point = this.getPoint(e);
        this.cachePoint = point;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point,this.viewId)
    }
    protected mouseup = (e:MouseEvent) =>{
        if(!this.active) return;
        if (e.button === 0) {
            const point = this.getPoint(e) || this.cachePoint;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point,this.viewId)
            this.cachePoint = undefined
        }
    }
    protected touchstart = (e:TouchEvent) =>{
        if(!this.active) return;
        if(!isOnlyOneTouch(e)){
            this.control.worker.unWritable();
            this.viewId && this.control.worker.removeDrawingWork(this.viewId);
            return;
        }
        if(!this.control.worker.isAbled()){
            const toolsType = this.control.worker.getCurrentToolsData()?.toolsType;
            toolsType && this.control.effectViewContainer(toolsType);
        }
        this.control.worker.checkDrawingWork(this.viewId);
        this.reflashContainerOffset();
        const point = this.getPoint(e);
        this.cachePoint = point;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
    }
    protected touchmove = (e:TouchEvent) =>{
        if(!this.active) return;
        if(!isOnlyOneTouch(e)){
            this.control.worker.unWritable();
            this.viewId && this.control.worker.removeDrawingWork(this.viewId);
            return;
        }
        const point = this.getPoint(e);
        this.cachePoint = point;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point,this.viewId)
    }
    protected touchend = (e:TouchEvent) =>{
        if(!this.active) return;
        if(!isOnlyOneTouch(e) || !this.control.worker.isAbled()){
            this.control.worker.removeDrawingWork(this.viewId);
            return;
        }
        const point = this.getPoint(e) || this.cachePoint;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point,this.viewId)
        this.cachePoint = undefined;
    }
    cursorMouseMove = throttle((e:MouseEvent) => {
        const curPoint = this.getPoint(e);
        if ( this.cacheCursorPoint && isEqual(curPoint, this.cacheCursorPoint)) {
            return;
        }
        this.cacheCursorPoint = curPoint;
        curPoint && this.control.worker.sendCursorEvent(curPoint,this.viewId);
    }, 30, {'leading':false})
    protected cursorMouseLeave = throttle(() =>{
        this.cacheCursorPoint = [undefined,undefined];
        this.control.worker.sendCursorEvent(this.cacheCursorPoint,this.viewId);
    }, 30, {'leading':false})
    protected keydown =(e:KeyboardEvent)=> {
        this.control.hotkeyManager.colloctHotkey(e);
    }
    protected bindDisplayerEvent(div:HTMLDivElement) {
        div.addEventListener('mousedown',this.mousedown, false);
        window.addEventListener('mouseleave',this.mouseup, false);
        window.addEventListener('mousemove',this.mousemove, {
            capture: false,
            passive: false
        });
        window.addEventListener('mouseup',this.mouseup, false);
        div.addEventListener('touchstart',this.touchstart, {
            capture: true,
            passive: false
        });
        window.addEventListener('touchmove',this.touchmove, {
            capture: true,
            passive: false
        });
        window.addEventListener('touchend',this.touchend, {
            capture: true,
            passive: false
        });

        div.addEventListener('mousemove',this.cursorMouseMove, true);
        div.addEventListener('mouseleave',this.cursorMouseLeave, true);

        div.addEventListener('keydown', this.keydown, true);
    }
    protected removeDisplayerEvent(div:HTMLDivElement) {
        div.removeEventListener('mousedown',this.mousedown);
        div.removeEventListener('touchstart',this.touchstart);

        window.removeEventListener('mouseleave',this.mouseup);
        window.removeEventListener('mousemove',this.mousemove);
        window.removeEventListener('mouseup',this.mouseup);
        
        window.removeEventListener('touchmove',this.touchmove);
        window.removeEventListener('touchend',this.touchend);

        div.removeEventListener('mousemove',this.cursorMouseMove);
        div.removeEventListener('mouseleave',this.cursorMouseLeave);

        div.removeEventListener('keydown', this.keydown);
    }
}

