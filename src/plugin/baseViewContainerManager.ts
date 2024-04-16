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
import isNumber from "lodash/isNumber";

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
            this.control.textEditorManager.clear(viewId);
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
        this.control.cursor.onFocusViewChange();
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
    setActiveCursor(viewId:string, cursorInfo: { x?: number; y?: number, roomMember?: RoomMember}) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.setActiveCursor(cursorInfo);
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
    private cachePoint?:[number,number];
    private cacheCursorPoint?:[number|undefined,number|undefined];
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
    getPoint(e:any):[number,number]|undefined{
        if (e instanceof TouchEvent) {
            const event:Touch = e.targetTouches[0] || e.changedTouches[0];
            if (event) {
                const point:[number,number] = [event.pageX - this.containerOffset.x, event.pageY - this.containerOffset.y];
                return point;
            }
        }
        if(isNumber(e.pageX) && isNumber(e.pageY)) {
            const point:[number,number] = [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y];
            return point;
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
        if (e.button === 0 && this.viewId) {
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
        }
    }
    protected mousemove = (e:MouseEvent) =>{
        if (this.viewId) {
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point,this.viewId)
        }
    }
    protected mouseup = (e:MouseEvent) =>{
        if (e.button === 0 && this.viewId) {
            const point = this.getPoint(e) || this.cachePoint;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point,this.viewId)
            this.cachePoint = undefined;
        }
    }
    protected touchstart = (e:TouchEvent) =>{
        if (this.viewId) {
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
        }
    }
    protected touchmove = throttle((e:TouchEvent) =>{
        if (this.viewId) {
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point, this.viewId)
        }
    }, 20, {'leading':false})
    protected touchend = (e:TouchEvent) =>{
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
    private cachePoint?:[number,number];
    private cacheCursorPoint?:[number|undefined,number|undefined];
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
        // console.log('mountView --- 1')
        this.control.viewContainerManager.mountView(this.viewId);
    }
    updateSize(){
        this.setCanvassStyle();
        // this.reflashContainerOffset();
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
    }
    getPoint(e:any):[number,number]|undefined{
        if (e instanceof TouchEvent) {
            const event:Touch = e.targetTouches[0] || e.changedTouches[0];
            if (event) {
                const point:[number,number] = [event.pageX - this.containerOffset.x, event.pageY - this.containerOffset.y];
                return point;
            }
        }
        if(isNumber(e.pageX) && isNumber(e.pageY)) {
            const point:[number,number] = [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y];
            return point;
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
        if (e.button === 0) {
            this.reflashContainerOffset();
            const point = this.getPoint(e);
            this.cachePoint = point;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
        }
    }
    protected mousemove = (e:MouseEvent) =>{
        const point = this.getPoint(e);
        this.cachePoint = point;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point,this.viewId)
    }
    protected mouseup = (e:MouseEvent) =>{
        if (e.button === 0) {
            const point = this.getPoint(e) || this.cachePoint;
            point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point,this.viewId)
            this.cachePoint = undefined
        }
    }
    protected touchstart = (e:TouchEvent) =>{
        this.reflashContainerOffset();
        const point = this.getPoint(e);
        this.cachePoint = point;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point,this.viewId)
    }
    protected touchmove = throttle((e:TouchEvent) =>{
        const point = this.getPoint(e);
        this.cachePoint = point;
        point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point,this.viewId)
    }, 20, {'leading':false})
    protected touchend = (e:TouchEvent) =>{
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

