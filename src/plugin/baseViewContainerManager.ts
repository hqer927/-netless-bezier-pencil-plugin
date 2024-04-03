/* eslint-disable @typescript-eslint/no-explicit-any */
import type EventEmitter2 from "eventemitter2";
import { ICameraOpt, ILayerOptionType, IMainMessageRenderData, IOffscreenCanvasOptionType } from "../core/types";
import { BaseSubWorkModuleProps, TeachingAidsManagerLike } from "./types";
import type { CameraState, RoomMember, View } from "white-web-sdk";
import throttle from "lodash/throttle";
import { ECanvasContextType, EToolsKey, EvevtWorkState } from "../core/enum";
import { ShowFloatBarMsgValue } from "../displayer/types";
import isEqual from "lodash/isEqual";
import clone from "lodash/clone";
import { UndoRedoMethod, UndoRedoMethodProps } from "../undo";
import { BaseViewDisplayer } from "./displayerView";

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
    control: TeachingAidsManagerLike;
    abstract focuedViewId?: string;
    abstract focuedView?: ViewInfo;
    mainView?: ViewInfo;
    appViews: Map<string,ViewInfo> = new Map();
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter} = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        this.internalMsgEmitter.on('undoTickerStart',this.undoTickerStart.bind(this));
        this.internalMsgEmitter.on('undoTickerEnd',this.undoTickerEnd.bind(this));
        this.internalMsgEmitter.on('excludeIds',this.addExcludeIds.bind(this));
    }
    undoTickerStart(id:number, viewId:string){
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            view.displayer.commiter.undoTickerStart(id, view.focusScenePath);
        }
    }
    undoTickerEnd(id:number, viewId:string){
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            view.displayer.commiter.undoTickerEnd(id, viewId, view.focusScenePath);
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
        // console.log('validator - cameraOpt', target.id, oldValue, newValue)
        if (key === 'focusScenePath' && value && !isEqual(oldValue, newValue)) {
            this.control.internalSceneChange(target.id, newValue);
        }
        if (key === 'cameraOpt' && !isEqual(oldValue, newValue)) {
            if (newValue.width !==  oldValue?.width || newValue.height !==  oldValue?.height) {
                const view = this.getView(key);
                view?.displayer.updateSize();
            }
            this.control.internalCameraChange(target.id, newValue);
        }
    }
    destroyAppView(viewId:string) {
        const viewInfo = this.appViews.get(viewId);
        if(viewInfo){
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
        return viewId !== MainViewDisplayerManager.viewId && this.appViews.has(viewId);
    }
    getView(viewId:string){
        if (viewId === MainViewDisplayerManager.viewId) {
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
        if (viewId === MainViewDisplayerManager.viewId && this.mainView) {
            this.mainView.focusScenePath = scenePath;
        } else {
            const view = viewId && this.appViews?.get(viewId) || undefined;
            if (view) {
                view.focusScenePath = scenePath;
            }
        }
    }
    setViewData(viewId:string, viewData: View) {
        if (viewId === MainViewDisplayerManager.viewId && this.mainView) {
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
        if (viewId === MainViewDisplayerManager.viewId) {
            this.focuedView = this.mainView;
        } else {
            this.focuedView = viewId && this.appViews?.get(viewId) || undefined;
        }
    }
    setViewFocusScenePath(viewId:string, scenePath:string){
        let info:ViewInfo|undefined;
        if (viewId === MainViewDisplayerManager.viewId) {
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
        this.internalMsgEmitter.removeAllListeners('undoTickerStart');
        this.internalMsgEmitter.removeAllListeners('undoTickerEnd');
        this.internalMsgEmitter.removeAllListeners('excludeIds');
        this.mainView?.displayer.destroy();
        this.appViews.forEach(view => {
            view.displayer.destroy();
        });
    }
    abstract mountView(viewIde:string): void;
    abstract setFocuedViewCameraOpt(cameraState: CameraState): void;
    /** view中心点坐标转换成页面原始坐标 */
    abstract transformToOriginPoint(point:[number,number], viewId:string):[number,number];
    /** 页面坐标转换成view中心点坐标 */
    abstract transformToScenePoint(point:[number,number], viewId:string):[number,number];
    /** 绘制view */
    abstract render(renderData: Array<IMainMessageRenderData> ):void;
    /** 是否绘制浮动选框 */
    showFloatBar(viewId: string, isShow: boolean, opt?: Partial<ShowFloatBarMsgValue>): void {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.showFloatBar(isShow, opt);
        }
    }
    /** 激活浮动选框 */
    activeFloatBar(viewId:string){
        const displayer = this.getView(viewId)?.displayer;
        if(displayer?.vDom){
            displayer.vDom.setFloatZIndex(2);
        }
    }
    /** 销毁浮动选框 */
    unActiveFloatBar(viewId:string){
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if(vDom){
            vDom.setFloatZIndex(-1);
        }
    }
    /** 激活刷新指针 */
    setActiveCursor(cursorInfo: { x?: number; y?: number, roomMember?: RoomMember, viewId:string }[]) {
        for (const item of cursorInfo) {
            const { viewId, ...info } = item;
            const view = this.getView(viewId);
            const vDom = view?.displayer.vDom;
            if (vDom) {
                // console.log('setActiveCursor', viewId, info);
                vDom.setActiveCursor([info]);
            }
        }
    }
    /** 激活刷新文字编辑器 */
    setActiveTextEditor(viewId:string,activeTextId?:string) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            // console.log('setActiveTextEditor', viewId, activeTextId);
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
    readonly control: TeachingAidsManagerLike;
    readonly internalMsgEmitter: EventEmitter2;
    readonly commiter: UndoRedoMethod;
    abstract vDom?: BaseViewDisplayer; 
    abstract eventTragetElement?: HTMLDivElement;
    abstract canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasBgRef: React.RefObject<HTMLCanvasElement>;
    abstract floatBarRef: React.RefObject<HTMLDivElement>;
    abstract floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    abstract containerOffset: { x: number; y: number };
    private cachePoint?:[number|undefined,number|undefined];
    constructor(viewId:string, control: TeachingAidsManagerLike, internalMsgEmitter:EventEmitter2) {
        this.viewId = viewId;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const props:UndoRedoMethodProps = {
            control: this.control,
            internalMsgEmitter: this.internalMsgEmitter,
            viewId:this.viewId
        }
        this.commiter = new UndoRedoMethod(props);
    }
    abstract setCanvassStyle(): void;
    bindToolsClass(){
        const toolsKey = this.control.worker?.currentToolsData?.toolsType;
        if (this.eventTragetElement && toolsKey) {
            this.eventTragetElement.className = `netless-whiteboard ${ toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow' }`;
        }
    }
    mountView(): void {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
        // this.bindToolsClass();
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
    }
    getPoint(e:any):[number,number]{
        
        // if (!(e instanceof MouseEvent || e instanceof TouchEvent)) {
        //     console.log('getPoint', e)
        // }
        if (e instanceof TouchEvent) {
            return [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y];
        } else {
            return [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y];
        }
        // const x = e.pageX || e.targetTouches[0].pageX;
        // const y = e.pageY || e.targetTouches[0].pageY;
        // return [x - this.containerOffset.x,y - this.containerOffset.y];
    }
    private getTranslate(element:any) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] ||  getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        // console.log('getTranslate', matrix, x, y)
        return [x, y]
    }
    protected getContainerOffset(eventTraget: HTMLDivElement, offset: { x: number; y: number })  {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        // console.log('getContainerOffset', eventTraget, translate)
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent as HTMLDivElement, newOffset);
        }
        // console.log('ContainerManager - on - getContainerOffset', translate, newOffset, eventTraget)
        return newOffset;
    }
    protected mousedown = (e:MouseEvent) =>{
        if (e.button === 0 && this.viewId) {
            this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e),this.viewId)
            // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent, ], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
        }
    }
    protected mousemove = (e:MouseEvent) =>{
        if (this.viewId) {
            this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e),this.viewId)
        }
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
    }
    protected mouseup = (e:MouseEvent) =>{
        if (e.button === 0 && this.viewId) {
            this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e),this.viewId)
            // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
        }
    }
    protected touchstart = (e:TouchEvent) =>{
        if (this.viewId) {
            this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e),this.viewId)
        }
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
    }
    protected touchmove = throttle((e:TouchEvent) =>{
        if (this.viewId) {
            this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e), this.viewId)
        }
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
    }, 20, {'leading':false})
    protected touchend = (e:TouchEvent) =>{
        if (this.viewId) {
            this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e),this.viewId)  
        }
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
    }
    protected cursorMouseMove = throttle((e:MouseEvent) => {
        const curPoint = this.getPoint(e);
        if ( this.cachePoint && isEqual(curPoint, this.cachePoint) || !this.viewId) {
            return;
        }
        this.cachePoint = this.getPoint(e);
        this.control.worker.sendCursorEvent(curPoint,this.viewId);
    }, 30, {'leading':false})
    protected cursorMouseLeave = throttle(() =>{
        if (this.viewId) {
            this.cachePoint = [undefined,undefined];
            this.control.worker.sendCursorEvent(this.cachePoint,this.viewId);
        }
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], [undefined,undefined], MainViewDisplayerManager.viewId);
    }, 30, {'leading':false})
    protected bindDisplayerEvent(div:HTMLDivElement) {
        div.addEventListener('mousedown',this.mousedown, false);
        div.addEventListener('touchstart',this.touchstart, false);

        window.addEventListener('mouseleave',this.mouseup, false);
        window.addEventListener('mousemove',this.mousemove, false);
        window.addEventListener('mouseup',this.mouseup, false);

        window.addEventListener('touchmove',this.touchmove, false);
        window.addEventListener('touchend',this.touchend, false);

        div.addEventListener('mousemove',this.cursorMouseMove, false);
        div.addEventListener('mouseleave',this.cursorMouseLeave, false);
    }
    protected removeDisplayerEvent(div:HTMLDivElement) {
        div.removeEventListener('mousedown',this.mousedown);
        div.removeEventListener('touchstart',this.touchstart);

        window.removeEventListener('mouseleave',this.mouseup);
        window.removeEventListener('mousemove',this.mousemove);
        window.removeEventListener('mouseup',this.mouseup);
        
        window.removeEventListener('touchmove',this.touchmove);
        window.removeEventListener('touchend',this.touchend);

        div.addEventListener('mousemove',this.cursorMouseMove);
        div.addEventListener('mouseleave',this.cursorMouseLeave);
    }
}
/** 主容器管理器抽象 */
export abstract class MainViewDisplayerManager {
    static readonly viewId:string = 'mainView';
    readonly viewId:string = 'mainView';
    readonly control: TeachingAidsManagerLike;
    readonly internalMsgEmitter: EventEmitter2;
    readonly commiter: UndoRedoMethod;
    abstract dpr:number;
    abstract width:number;
    abstract height:number;
    abstract vDom?: BaseViewDisplayer; 
    abstract eventTragetElement?: HTMLDivElement;
    abstract canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    abstract canvasBgRef: React.RefObject<HTMLCanvasElement>;
    abstract floatBarRef: React.RefObject<HTMLDivElement>;
    abstract floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    abstract containerOffset: { x: number; y: number };
    private cachePoint?:[number|undefined,number|undefined];
    constructor(control: TeachingAidsManagerLike, internalMsgEmitter:EventEmitter2) {
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
        if (this.eventTragetElement && toolsKey) {
            this.eventTragetElement.className = `netless-whiteboard ${ toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow' }`;
        }
    }
    mountView(): void {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
        // this.bindToolsClass();
    }
    updateSize(){
        this.setCanvassStyle();
        this.reflashContainerOffset();
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
    }
    getPoint(e:any):[number,number]{
        // if (!(e instanceof MouseEvent || e instanceof TouchEvent)) {
        //     console.log('getPoint', e)
        // }
        if (e instanceof TouchEvent) {
            return [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y];
        } else {
            return [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y];
        }
        // const x = e.pageX || e.targetTouches[0].pageX;
        // const y = e.pageY || e.targetTouches[0].pageY;
        // return [x - this.containerOffset.x,y - this.containerOffset.y];
    }
    private getTranslate(element:any) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] ||  getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        // console.log('getTranslate', matrix, x, y)
        return [x, y]
    }
    protected getContainerOffset(eventTraget: HTMLDivElement, offset: { x: number; y: number })  {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        // console.log('getContainerOffset', eventTraget, translate)
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent as HTMLDivElement, newOffset);
        }
        // console.log('ContainerManager - on - getContainerOffset', newOffset)
        return newOffset;
    }
    protected mousedown = (e:MouseEvent) =>{
        if (e.button === 0) {
            this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e),this.viewId)
            // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent, ], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
        }
    }
    protected mousemove = (e:MouseEvent) =>{
        this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e),this.viewId)
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
    }
    protected mouseup = (e:MouseEvent) =>{
        if (e.button === 0) {
            this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e),this.viewId)
            // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
        }
    }
    protected touchstart = (e:TouchEvent) =>{
        this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e),this.viewId)
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
    }
    protected touchmove = throttle((e:TouchEvent) =>{
        this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e),this.viewId)
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
    }, 20, {'leading':false})
    protected touchend = (e:TouchEvent) =>{
        this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e),this.viewId)
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
    }
    protected cursorMouseMove = throttle((e:MouseEvent) => {
        const curPoint = this.getPoint(e);
        if ( this.cachePoint && isEqual(curPoint, this.cachePoint)) {
            return;
        }
        this.cachePoint = this.getPoint(e);
        this.control.worker.sendCursorEvent(curPoint,this.viewId);
    }, 30, {'leading':false})
    protected cursorMouseLeave = throttle(() =>{
        this.cachePoint = [undefined,undefined];
        this.control.worker.sendCursorEvent(this.cachePoint,this.viewId);
        // this.internalMsgEmitter?.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], [undefined,undefined], MainViewDisplayerManager.viewId);
    }, 30, {'leading':false})
    protected bindDisplayerEvent(div:HTMLDivElement) {
        div.addEventListener('mousedown',this.mousedown, false);
        div.addEventListener('touchstart',this.touchstart, false);

        window.addEventListener('mouseleave',this.mouseup, false);
        window.addEventListener('mousemove',this.mousemove, false);
        window.addEventListener('mouseup',this.mouseup, false);

        window.addEventListener('touchmove',this.touchmove, false);
        window.addEventListener('touchend',this.touchend, false);

        div.addEventListener('mousemove',this.cursorMouseMove, false);
        div.addEventListener('mouseleave',this.cursorMouseLeave, false);
    }
    protected removeDisplayerEvent(div:HTMLDivElement) {
        div.removeEventListener('mousedown',this.mousedown);
        div.removeEventListener('touchstart',this.touchstart);

        window.removeEventListener('mouseleave',this.mouseup);
        window.removeEventListener('mousemove',this.mousemove);
        window.removeEventListener('mouseup',this.mouseup);
        
        window.removeEventListener('touchmove',this.touchmove);
        window.removeEventListener('touchend',this.touchend);

        div.addEventListener('mousemove',this.cursorMouseMove);
        div.addEventListener('mouseleave',this.cursorMouseLeave);
    }
}

