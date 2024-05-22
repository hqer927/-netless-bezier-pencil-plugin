import { InternalMsgEmitterType } from "./types";
import throttle from "lodash/throttle";
import { ECanvasContextType, ECanvasShowType, EToolsKey, EvevtWorkState } from "../core/enum";
import isEqual from "lodash/isEqual";
import clone from "lodash/clone";
import { UndoRedoMethod } from "../undo";
import isNumber from "lodash/isNumber";
import { getPosition, isOnlyOneTouch } from "./utils";
/** view容器管理器抽象 */
export class ViewContainerManager {
    constructor(props) {
        Object.defineProperty(this, "internalMsgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mainView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "appViews", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        const { control, internalMsgEmitter } = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        this.internalMsgEmitter.on('undoTickerStart', this.undoTickerStart.bind(this));
        this.internalMsgEmitter.on('undoTickerEnd', this.undoTickerEnd.bind(this));
        this.internalMsgEmitter.on('excludeIds', this.addExcludeIds.bind(this));
    }
    undoTickerStart(id, viewId) {
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            view.displayer.commiter.undoTickerStart(id, view.focusScenePath);
        }
    }
    undoTickerEnd(id, viewId, isSync) {
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            if (isSync) {
                // console.log('undoTickerEnd---undoTickerEnd', id, viewId)
                view.displayer.commiter.undoTickerEndSync(id, viewId, view.focusScenePath);
                return;
            }
            view.displayer.commiter.undoTickerEnd(id, viewId, view.focusScenePath);
        }
    }
    addExcludeIds(ids, viewId) {
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
            view.displayer.commiter.addExcludeIds(ids);
        }
    }
    undo() {
        const focuedView = this.focuedView;
        let number = 0;
        if (focuedView) {
            const focusScenePath = focuedView.focusScenePath;
            number = focuedView.displayer.commiter.undo(focusScenePath) || 0;
        }
        return number;
    }
    redo() {
        const focuedView = this.focuedView;
        let number = 0;
        if (focuedView) {
            const focusScenePath = focuedView.focusScenePath;
            number = focuedView.displayer.commiter.redo(focusScenePath) || 0;
        }
        return number;
    }
    validator(target, key, value) {
        const oldValue = clone(target[key]);
        const newValue = clone(value);
        if (key === 'focusScenePath' && value && !isEqual(oldValue, newValue)) {
            this.control.internalSceneChange(target.id, newValue);
            this.focuedView?.displayer.commiter.onChangeScene();
        }
        if (key === 'cameraOpt' && !isEqual(oldValue, newValue)) {
            if (newValue.width !== oldValue?.width || newValue.height !== oldValue?.height) {
                const view = this.getView(key);
                view?.displayer.updateSize();
            }
            this.control.internalCameraChange(target.id, newValue);
        }
    }
    destroyAppView(viewId, justLocal = false) {
        const viewInfo = this.appViews.get(viewId);
        if (viewInfo) {
            this.control.textEditorManager.clear(viewId, justLocal);
            viewInfo.displayer.destroy();
            this.appViews.delete(viewId);
        }
    }
    createMianView(originMainView) {
        this.mainView = new Proxy(originMainView, {
            set: (target, key, value) => {
                if (this.control.worker.isActive) {
                    this.validator(target, key, value);
                }
                target[key] = value;
                return true;
            }
        });
    }
    createAppView(originAppView) {
        const viewId = originAppView.id;
        const appView = new Proxy(originAppView, {
            set: (target, key, value) => {
                if (this.control.worker.isActive) {
                    this.validator(target, key, value);
                }
                target[key] = value;
                return true;
            }
        });
        this.appViews.set(viewId, appView);
    }
    isAppView(viewId) {
        return viewId !== MainViewDisplayerManager.viewId && this.appViews.has(viewId);
    }
    getView(viewId) {
        if (viewId === MainViewDisplayerManager.viewId) {
            return this.mainView;
        }
        else {
            return this.appViews?.get(viewId);
        }
    }
    getCurScenePath(viewId) {
        const view = this.getView(viewId);
        if (view) {
            return view.focusScenePath;
        }
    }
    getAllViews() {
        return [this.mainView, ...this.appViews.values()];
    }
    setViewScenePath(viewId, scenePath) {
        if (viewId === MainViewDisplayerManager.viewId && this.mainView) {
            this.mainView.focusScenePath = scenePath;
        }
        else {
            const view = viewId && this.appViews?.get(viewId) || undefined;
            if (view) {
                view.focusScenePath = scenePath;
            }
        }
    }
    setViewData(viewId, viewData) {
        if (viewId === MainViewDisplayerManager.viewId && this.mainView) {
            this.mainView.viewData = viewData;
        }
        else {
            const view = viewId && this.appViews?.get(viewId) || undefined;
            if (view) {
                view.viewData = viewData;
            }
        }
    }
    setFocuedViewId(viewId) {
        this.focuedViewId = viewId;
        if (viewId === MainViewDisplayerManager.viewId) {
            this.focuedView = this.mainView;
        }
        else {
            this.focuedView = viewId && this.appViews?.get(viewId) || undefined;
        }
        this.control.cursor.onFocusViewChange();
        if (this.focuedView) {
            // console.log('commiter---0', this.focuedView.focusScenePath);
            this.focuedView.displayer.commiter.onFocusView();
        }
    }
    setViewFocusScenePath(viewId, scenePath) {
        let info;
        if (viewId === MainViewDisplayerManager.viewId) {
            info = this.mainView;
        }
        else {
            info = this.appViews?.get(viewId);
        }
        if (info) {
            info.focusScenePath = scenePath;
        }
    }
    /** 销毁 */
    destroy() {
        this.internalMsgEmitter.removeAllListeners('undoTickerStart');
        this.internalMsgEmitter.removeAllListeners('undoTickerEnd');
        this.internalMsgEmitter.removeAllListeners('excludeIds');
        this.mainView?.displayer.destroy();
        this.appViews.forEach(view => {
            this.destroyAppView(view.id, true);
        });
    }
    setFocuedViewCameraOpt(cameraState) {
        if (this.focuedView) {
            this.focuedView.cameraOpt = cameraState;
        }
    }
    /** view中心点坐标转换成页面原始坐标 */
    transformToOriginPoint(p, viewId) {
        const view = this.getView(viewId);
        if (view?.viewData) {
            const _p = view.viewData.convertToPointOnScreen(p[0], p[1]);
            // console.log('transformToOriginPoint',_p, p, this.mainView?.displayer.containerOffset)
            return [_p.x, _p.y];
        }
        return p;
    }
    /** 页面坐标转换成view中心点坐标 */
    transformToScenePoint(p, viewId) {
        const view = this.getView(viewId);
        // console.log('transformToScenePoint ---1', p, this.mainView?.displayer.containerOffset)
        if (view?.viewData) {
            const _p = view.viewData.convertToPointInWorld({ x: p[0], y: p[1] });
            // console.log('transformToScenePoint ---2',_p )
            return [_p.x, _p.y];
        }
        return p;
    }
    /** 绘制view */
    render(renderData) {
        for (const data of renderData) {
            const { rect, imageBitmap, isClear, isUnClose, drawCanvas, clearCanvas, offset, viewId } = data;
            const displayer = this.getView(viewId)?.displayer;
            if (displayer && rect) {
                const { dpr, canvasBgRef, canvasFloatRef, floatBarCanvasRef, canvasServiceFloatRef } = displayer;
                const w = rect.w * dpr;
                const h = rect.h * dpr;
                const x = rect.x * dpr;
                const y = rect.y * dpr;
                if (isClear) {
                    switch (clearCanvas) {
                        case ECanvasShowType.Selector:
                            floatBarCanvasRef.current?.getContext('2d')?.clearRect(0, 0, w, h);
                            break;
                        case ECanvasShowType.ServiceFloat:
                            canvasServiceFloatRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;
                        case ECanvasShowType.Float:
                            canvasFloatRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;
                        case ECanvasShowType.Bg:
                            canvasBgRef.current?.getContext('2d')?.clearRect(x, y, w, h);
                            break;
                        default:
                            break;
                    }
                }
                if (drawCanvas && imageBitmap) {
                    switch (drawCanvas) {
                        case ECanvasShowType.Selector: {
                            const cx = (offset?.x || 0) * dpr;
                            const cy = (offset?.y || 0) * dpr;
                            floatBarCanvasRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, cx, cy, w, h);
                            break;
                        }
                        case ECanvasShowType.ServiceFloat: {
                            canvasServiceFloatRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        }
                        case ECanvasShowType.Float: {
                            canvasFloatRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        }
                        case ECanvasShowType.Bg: {
                            canvasBgRef.current?.getContext('2d')?.drawImage(imageBitmap, 0, 0, w, h, x, y, w, h);
                            break;
                        }
                        default:
                            break;
                    }
                }
                if (isUnClose) {
                    return;
                }
                imageBitmap?.close();
            }
        }
    }
    /** 是否绘制浮动选框 */
    showFloatBar(viewId, isShow, opt) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.showFloatBar(isShow, opt);
        }
    }
    /** 激活浮动选框 */
    activeFloatBar(viewId) {
        const displayer = this.getView(viewId)?.displayer;
        if (displayer?.vDom) {
            displayer.vDom.setFloatZIndex(2);
        }
    }
    /** 销毁浮动选框 */
    unActiveFloatBar(viewId) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.setFloatZIndex(-1);
        }
    }
    // /** 激活刷新指针 */
    // setActiveCursor(viewId:string, cursorInfo: { x?: number; y?: number, roomMember?: RoomMember}) {
    //     const view = this.getView(viewId);
    //     const vDom = view?.displayer.vDom;
    //     if (vDom) {
    //         console.log('setActiveCursor', cursorInfo.roomMember?.memberId)
    //         this.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor,viewId], cursorInfo);
    //     }
    // }
    /** 激活刷新文字编辑器 */
    setActiveTextEditor(viewId, activeTextId) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            vDom.setActiveTextEditor(activeTextId);
        }
    }
}
Object.defineProperty(ViewContainerManager, "defaultCameraOpt", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        centerX: 0,
        centerY: 0,
        scale: 1,
    }
});
Object.defineProperty(ViewContainerManager, "defaultScreenCanvasOpt", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        autoRender: false,
        contextType: ECanvasContextType.Canvas2d,
    }
});
Object.defineProperty(ViewContainerManager, "defaultLayerOpt", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        offscreen: true,
        handleEvent: false,
        depth: false,
    }
});
/** appView容器管理器抽象 */
export class AppViewDisplayerManager {
    constructor(viewId, control, internalMsgEmitter) {
        Object.defineProperty(this, "viewId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "internalMsgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "commiter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cachePoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cacheCursorPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (e.button === 0 && this.viewId) {
                    this.reflashContainerOffset();
                    const point = this.getPoint(e);
                    this.cachePoint = point;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point, this.viewId);
                }
            }
        });
        Object.defineProperty(this, "mousemove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (this.viewId) {
                    const point = this.getPoint(e);
                    this.cachePoint = point;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point, this.viewId);
                }
            }
        });
        Object.defineProperty(this, "mouseup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (e.button === 0 && this.viewId) {
                    const point = this.getPoint(e) || this.cachePoint;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point, this.viewId);
                    this.cachePoint = undefined;
                }
            }
        });
        Object.defineProperty(this, "touchstart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (!isOnlyOneTouch(e)) {
                    return;
                }
                if (this.viewId) {
                    this.reflashContainerOffset();
                    const point = this.getPoint(e);
                    this.cachePoint = point;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point, this.viewId);
                }
            }
        });
        Object.defineProperty(this, "touchmove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (!isOnlyOneTouch(e)) {
                    this.control.worker.unWritable();
                    // console.log('clearLocalPointsBatchData---1')
                    this.control.worker.clearLocalPointsBatchData();
                    return;
                }
                if (this.viewId) {
                    const point = this.getPoint(e);
                    this.cachePoint = point;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point, this.viewId);
                }
            }
        });
        Object.defineProperty(this, "touchend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (!isOnlyOneTouch(e) || !this.control.worker.isAbled()) {
                    // console.log('clearLocalPointsBatchData---0')
                    this.control.worker.clearLocalPointsBatchData();
                    return;
                }
                if (this.viewId) {
                    const point = this.getPoint(e) || this.cachePoint;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point, this.viewId);
                    this.cachePoint = undefined;
                }
            }
        });
        Object.defineProperty(this, "cursorMouseMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((e) => {
                const curPoint = this.getPoint(e);
                if (this.cacheCursorPoint && isEqual(curPoint, this.cacheCursorPoint) || !this.viewId) {
                    return;
                }
                this.cacheCursorPoint = curPoint;
                curPoint && this.control.worker.sendCursorEvent(curPoint, this.viewId);
            }, 30, { 'leading': false })
        });
        Object.defineProperty(this, "cursorMouseLeave", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle(() => {
                if (this.viewId) {
                    this.cacheCursorPoint = [undefined, undefined];
                    this.control.worker.sendCursorEvent(this.cacheCursorPoint, this.viewId);
                }
            }, 30, { 'leading': false })
        });
        Object.defineProperty(this, "keydown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.control.hotkeyManager.colloctHotkey(e);
            }
        });
        this.viewId = viewId;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const props = {
            control: this.control,
            internalMsgEmitter: this.internalMsgEmitter,
            viewId: this.viewId
        };
        this.commiter = new UndoRedoMethod(props);
    }
    bindToolsClass() {
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
                    this.eventTragetElement.className = `netless-whiteboard ${toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow'}`;
                }
                break;
        }
    }
    mountView() {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
    }
    reflashContainerOffset() {
        if (this.eventTragetElement) {
            this.containerOffset = this.getContainerOffset(this.eventTragetElement, { x: 0, y: 0 });
        }
    }
    updateSize() {
        this.setCanvassStyle();
        this.reflashContainerOffset();
    }
    setViewId(viewId) {
        this.viewId = viewId;
    }
    destroy() {
        if (this.eventTragetElement) {
            this.removeDisplayerEvent(this.eventTragetElement);
        }
        this.vDom = undefined;
        this.internalMsgEmitter.removeAllListeners([InternalMsgEmitterType.Cursor, this.viewId]);
        // console.log('CursorManager---off', this.viewId, this.internalMsgEmitter)
    }
    getPoint(e) {
        const point = getPosition(e);
        if (point && isNumber(point.x) && isNumber(point.y)) {
            return [point.x - this.containerOffset.x, point.y - this.containerOffset.y];
        }
    }
    setActive(bol) {
        this.active = bol;
    }
    async stopEventHandler() {
        if (this.cachePoint) {
            await this.control.worker.originalEventLintener(EvevtWorkState.Done, this.cachePoint, this.viewId);
            this.cachePoint = undefined;
        }
    }
    getTranslate(element) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] || getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        return [x, y];
    }
    getContainerOffset(eventTraget, offset) {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent, newOffset);
        }
        return newOffset;
    }
    bindDisplayerEvent(div) {
        div.addEventListener('mousedown', this.mousedown, false);
        div.addEventListener('touchstart', this.touchstart, false);
        window.addEventListener('mouseleave', this.mouseup, false);
        window.addEventListener('mousemove', this.mousemove, false);
        window.addEventListener('mouseup', this.mouseup, false);
        window.addEventListener('touchmove', this.touchmove, false);
        window.addEventListener('touchend', this.touchend, false);
        div.addEventListener('mousemove', this.cursorMouseMove, false);
        div.addEventListener('mouseleave', this.cursorMouseLeave, false);
        div.addEventListener('keydown', this.keydown, true);
    }
    removeDisplayerEvent(div) {
        div.removeEventListener('mousedown', this.mousedown);
        div.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('mouseleave', this.mouseup);
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
        window.removeEventListener('touchmove', this.touchmove);
        window.removeEventListener('touchend', this.touchend);
        div.removeEventListener('mousemove', this.cursorMouseMove);
        div.removeEventListener('mouseleave', this.cursorMouseLeave);
        div.removeEventListener('keydown', this.keydown);
    }
}
/** 主容器管理器抽象 */
export class MainViewDisplayerManager {
    constructor(control, internalMsgEmitter) {
        Object.defineProperty(this, "viewId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'mainView'
        });
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "internalMsgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "commiter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cachePoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cacheCursorPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (e.button === 0) {
                    this.reflashContainerOffset();
                    const point = this.getPoint(e);
                    this.cachePoint = point;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point, this.viewId);
                }
            }
        });
        Object.defineProperty(this, "mousemove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                const point = this.getPoint(e);
                this.cachePoint = point;
                point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point, this.viewId);
            }
        });
        Object.defineProperty(this, "mouseup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (e.button === 0) {
                    const point = this.getPoint(e) || this.cachePoint;
                    point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point, this.viewId);
                    this.cachePoint = undefined;
                }
            }
        });
        Object.defineProperty(this, "touchstart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (!isOnlyOneTouch(e)) {
                    return;
                }
                this.reflashContainerOffset();
                const point = this.getPoint(e);
                this.cachePoint = point;
                point && this.control.worker.originalEventLintener(EvevtWorkState.Start, point, this.viewId);
            }
        });
        Object.defineProperty(this, "touchmove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (!isOnlyOneTouch(e)) {
                    // console.log('clearLocalPointsBatchData---2')
                    this.control.worker.clearLocalPointsBatchData();
                    this.control.worker.unWritable();
                    return;
                }
                const point = this.getPoint(e);
                this.cachePoint = point;
                point && this.control.worker.originalEventLintener(EvevtWorkState.Doing, point, this.viewId);
            }
        });
        Object.defineProperty(this, "touchend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (!this.active)
                    return;
                if (!isOnlyOneTouch(e) || !this.control.worker.isAbled()) {
                    // console.log('clearLocalPointsBatchData---3')
                    this.control.worker.clearLocalPointsBatchData();
                    return;
                }
                const point = this.getPoint(e) || this.cachePoint;
                point && this.control.worker.originalEventLintener(EvevtWorkState.Done, point, this.viewId);
                this.cachePoint = undefined;
            }
        });
        Object.defineProperty(this, "cursorMouseMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((e) => {
                const curPoint = this.getPoint(e);
                if (this.cacheCursorPoint && isEqual(curPoint, this.cacheCursorPoint)) {
                    return;
                }
                this.cacheCursorPoint = curPoint;
                curPoint && this.control.worker.sendCursorEvent(curPoint, this.viewId);
            }, 30, { 'leading': false })
        });
        Object.defineProperty(this, "cursorMouseLeave", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle(() => {
                this.cacheCursorPoint = [undefined, undefined];
                this.control.worker.sendCursorEvent(this.cacheCursorPoint, this.viewId);
            }, 30, { 'leading': false })
        });
        Object.defineProperty(this, "keydown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.control.hotkeyManager.colloctHotkey(e);
            }
        });
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        const props = {
            control: this.control,
            internalMsgEmitter: this.internalMsgEmitter,
            viewId: this.viewId
        };
        this.commiter = new UndoRedoMethod(props);
    }
    bindToolsClass() {
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
                    this.eventTragetElement.className = `netless-whiteboard ${toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow'}`;
                }
                break;
        }
    }
    mountView() {
        this.setCanvassStyle();
        // console.log('mountView --- 1')
        this.control.viewContainerManager.mountView(this.viewId);
    }
    updateSize() {
        this.setCanvassStyle();
    }
    reflashContainerOffset() {
        if (this.eventTragetElement) {
            this.containerOffset = this.getContainerOffset(this.eventTragetElement, { x: 0, y: 0 });
        }
    }
    destroy() {
        if (this.eventTragetElement) {
            this.removeDisplayerEvent(this.eventTragetElement);
        }
        this.vDom = undefined;
        this.internalMsgEmitter.removeAllListeners([InternalMsgEmitterType.Cursor, this.viewId]);
        // console.log('CursorManager---off', this.viewId, this.internalMsgEmitter)
    }
    getPoint(e) {
        const point = getPosition(e);
        if (point && isNumber(point.x) && isNumber(point.y)) {
            return [point.x - this.containerOffset.x, point.y - this.containerOffset.y];
        }
    }
    setActive(bol) {
        this.active = bol;
    }
    async stopEventHandler() {
        if (this.cachePoint) {
            await this.control.worker.originalEventLintener(EvevtWorkState.Done, this.cachePoint, this.viewId);
            this.cachePoint = undefined;
        }
    }
    getTranslate(element) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] || getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        return [x, y];
    }
    getContainerOffset(eventTraget, offset) {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent, newOffset);
        }
        return newOffset;
    }
    bindDisplayerEvent(div) {
        div.addEventListener('mousedown', this.mousedown, false);
        div.addEventListener('touchstart', this.touchstart, false);
        window.addEventListener('mouseleave', this.mouseup, false);
        window.addEventListener('mousemove', this.mousemove, false);
        window.addEventListener('mouseup', this.mouseup, false);
        window.addEventListener('touchmove', this.touchmove, false);
        window.addEventListener('touchend', this.touchend, false);
        div.addEventListener('mousemove', this.cursorMouseMove, false);
        div.addEventListener('mouseleave', this.cursorMouseLeave, false);
        div.addEventListener('keydown', this.keydown, true);
    }
    removeDisplayerEvent(div) {
        div.removeEventListener('mousedown', this.mousedown);
        div.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('mouseleave', this.mouseup);
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
        window.removeEventListener('touchmove', this.touchmove);
        window.removeEventListener('touchend', this.touchend);
        div.removeEventListener('mousemove', this.cursorMouseMove);
        div.removeEventListener('mouseleave', this.cursorMouseLeave);
        div.removeEventListener('keydown', this.keydown);
    }
}
Object.defineProperty(MainViewDisplayerManager, "viewId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'mainView'
});
