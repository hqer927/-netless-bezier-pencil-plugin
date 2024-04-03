import throttle from "lodash/throttle";
import { ECanvasContextType, EToolsKey, EvevtWorkState } from "../core/enum";
import isEqual from "lodash/isEqual";
import clone from "lodash/clone";
import { UndoRedoMethod } from "../undo";
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
    undoTickerEnd(id, viewId) {
        const view = this.getView(viewId);
        if (view && view.displayer && view.focusScenePath) {
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
        // console.log('validator - cameraOpt', target.id, oldValue, newValue)
        if (key === 'focusScenePath' && value && !isEqual(oldValue, newValue)) {
            this.control.internalSceneChange(target.id, newValue);
        }
        if (key === 'cameraOpt' && !isEqual(oldValue, newValue)) {
            if (newValue.width !== oldValue?.width || newValue.height !== oldValue?.height) {
                const view = this.getView(key);
                view?.displayer.updateSize();
            }
            this.control.internalCameraChange(target.id, newValue);
        }
    }
    destroyAppView(viewId) {
        const viewInfo = this.appViews.get(viewId);
        if (viewInfo) {
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
            view.displayer.destroy();
        });
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
    /** 激活刷新指针 */
    setActiveCursor(cursorInfo) {
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
    setActiveTextEditor(viewId, activeTextId) {
        const view = this.getView(viewId);
        const vDom = view?.displayer.vDom;
        if (vDom) {
            // console.log('setActiveTextEditor', viewId, activeTextId);
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
        Object.defineProperty(this, "mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0 && this.viewId) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e), this.viewId);
                    // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent, ], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
                }
            }
        });
        Object.defineProperty(this, "mousemove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (this.viewId) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e), this.viewId);
                }
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
            }
        });
        Object.defineProperty(this, "mouseup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0 && this.viewId) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e), this.viewId);
                    // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
                }
            }
        });
        Object.defineProperty(this, "touchstart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (this.viewId) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e), this.viewId);
                }
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
            }
        });
        Object.defineProperty(this, "touchmove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((e) => {
                if (this.viewId) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e), this.viewId);
                }
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
            }, 20, { 'leading': false })
        });
        Object.defineProperty(this, "touchend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (this.viewId) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e), this.viewId);
                }
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
            }
        });
        Object.defineProperty(this, "cursorMouseMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((e) => {
                const curPoint = this.getPoint(e);
                if (this.cachePoint && isEqual(curPoint, this.cachePoint) || !this.viewId) {
                    return;
                }
                this.cachePoint = this.getPoint(e);
                this.control.worker.sendCursorEvent(curPoint, this.viewId);
            }, 30, { 'leading': false })
        });
        Object.defineProperty(this, "cursorMouseLeave", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle(() => {
                if (this.viewId) {
                    this.cachePoint = [undefined, undefined];
                    this.control.worker.sendCursorEvent(this.cachePoint, this.viewId);
                }
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], [undefined,undefined], MainViewDisplayerManager.viewId);
            }, 30, { 'leading': false })
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
        if (this.eventTragetElement && toolsKey) {
            this.eventTragetElement.className = `netless-whiteboard ${toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow'}`;
        }
    }
    mountView() {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
        // this.bindToolsClass();
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
    }
    getPoint(e) {
        // if (!(e instanceof MouseEvent || e instanceof TouchEvent)) {
        //     console.log('getPoint', e)
        // }
        if (e instanceof TouchEvent) {
            return [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y];
        }
        else {
            return [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y];
        }
        // const x = e.pageX || e.targetTouches[0].pageX;
        // const y = e.pageY || e.targetTouches[0].pageY;
        // return [x - this.containerOffset.x,y - this.containerOffset.y];
    }
    getTranslate(element) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] || getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        // console.log('getTranslate', matrix, x, y)
        return [x, y];
    }
    getContainerOffset(eventTraget, offset) {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        // console.log('getContainerOffset', eventTraget, translate)
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent, newOffset);
        }
        // console.log('ContainerManager - on - getContainerOffset', translate, newOffset, eventTraget)
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
    }
    removeDisplayerEvent(div) {
        div.removeEventListener('mousedown', this.mousedown);
        div.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('mouseleave', this.mouseup);
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
        window.removeEventListener('touchmove', this.touchmove);
        window.removeEventListener('touchend', this.touchend);
        div.addEventListener('mousemove', this.cursorMouseMove);
        div.addEventListener('mouseleave', this.cursorMouseLeave);
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
        Object.defineProperty(this, "mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e), this.viewId);
                    // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent, ], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
                }
            }
        });
        Object.defineProperty(this, "mousemove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e), this.viewId);
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
            }
        });
        Object.defineProperty(this, "mouseup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0) {
                    this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e), this.viewId);
                    // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
                }
            }
        });
        Object.defineProperty(this, "touchstart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.control.worker.originalEventLintener(EvevtWorkState.Start, this.getPoint(e), this.viewId);
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, this.getPoint(e), MainViewDisplayerManager.viewId);
            }
        });
        Object.defineProperty(this, "touchmove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((e) => {
                this.control.worker.originalEventLintener(EvevtWorkState.Doing, this.getPoint(e), this.viewId);
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, this.getPoint(e), MainViewDisplayerManager.viewId);
            }, 20, { 'leading': false })
        });
        Object.defineProperty(this, "touchend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.control.worker.originalEventLintener(EvevtWorkState.Done, this.getPoint(e), this.viewId);
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, this.getPoint(e), MainViewDisplayerManager.viewId);
            }
        });
        Object.defineProperty(this, "cursorMouseMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((e) => {
                const curPoint = this.getPoint(e);
                if (this.cachePoint && isEqual(curPoint, this.cachePoint)) {
                    return;
                }
                this.cachePoint = this.getPoint(e);
                this.control.worker.sendCursorEvent(curPoint, this.viewId);
            }, 30, { 'leading': false })
        });
        Object.defineProperty(this, "cursorMouseLeave", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle(() => {
                this.cachePoint = [undefined, undefined];
                this.control.worker.sendCursorEvent(this.cachePoint, this.viewId);
                // this.internalMsgEmitter?.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], [undefined,undefined], MainViewDisplayerManager.viewId);
            }, 30, { 'leading': false })
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
        if (this.eventTragetElement && toolsKey) {
            this.eventTragetElement.className = `netless-whiteboard ${toolsKey === EToolsKey.Text ? 'cursor-text' : toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen ? 'cursor-pencil' : 'cursor-arrow'}`;
        }
    }
    mountView() {
        this.setCanvassStyle();
        this.control.viewContainerManager.mountView(this.viewId);
        // this.bindToolsClass();
    }
    updateSize() {
        this.setCanvassStyle();
        this.reflashContainerOffset();
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
    }
    getPoint(e) {
        // if (!(e instanceof MouseEvent || e instanceof TouchEvent)) {
        //     console.log('getPoint', e)
        // }
        if (e instanceof TouchEvent) {
            return [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y];
        }
        else {
            return [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y];
        }
        // const x = e.pageX || e.targetTouches[0].pageX;
        // const y = e.pageY || e.targetTouches[0].pageY;
        // return [x - this.containerOffset.x,y - this.containerOffset.y];
    }
    getTranslate(element) {
        const transformMatrix = element.style["WebkitTransform"] || getComputedStyle(element, '').getPropertyValue("-webkit-transform") || element.style["transform"] || getComputedStyle(element, '').getPropertyValue("transform");
        const matrix = transformMatrix.match(/-?[0-9]+\.?[0-9]*/g);
        const x = matrix && parseInt(matrix[0]) || 0; //translate x
        const y = matrix && parseInt(matrix[1]) || 0; //translate y
        // console.log('getTranslate', matrix, x, y)
        return [x, y];
    }
    getContainerOffset(eventTraget, offset) {
        const translate = this.getTranslate(eventTraget);
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft + translate[0],
            y: offset.y + eventTraget.offsetTop + translate[1]
        };
        // console.log('getContainerOffset', eventTraget, translate)
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent, newOffset);
        }
        // console.log('ContainerManager - on - getContainerOffset', newOffset)
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
    }
    removeDisplayerEvent(div) {
        div.removeEventListener('mousedown', this.mousedown);
        div.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('mouseleave', this.mouseup);
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
        window.removeEventListener('touchmove', this.touchmove);
        window.removeEventListener('touchend', this.touchend);
        div.addEventListener('mousemove', this.cursorMouseMove);
        div.addEventListener('mouseleave', this.cursorMouseLeave);
    }
}
Object.defineProperty(MainViewDisplayerManager, "viewId", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'mainView'
});
