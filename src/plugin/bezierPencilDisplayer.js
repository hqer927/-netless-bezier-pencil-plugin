/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styles from './index.module.less';
import { DisplayStateEnum, EmitEventType, InternalMsgEmitterType, } from "./types";
import { FloatBar } from "../displayer/floatBar";
import { EventEmitter2 } from "eventemitter2";
import { EvevtWorkState } from "../core";
import { RotateBtn } from "../displayer/rotate";
export const DisplayerContext = React.createContext({
    floatBarColors: [],
    InternalMsgEmitter: undefined,
    floatBarData: undefined,
    zIndex: -1,
    dpr: 1,
    position: undefined,
    angle: 0,
    isRotating: false,
    showFloatBarBtn: false,
    setPosition: () => { },
    setSize: () => { },
    setAngle: () => { },
    setRotateState: () => { },
    setShowRotateBtn: () => { },
    setShowFloatBarBtn: () => { },
});
export class BezierPencilDisplayer extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "containerRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "canvasFloatRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "canvasBgRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "floatBarRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "floatBarCanvasRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        Object.defineProperty(this, "containerOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0) {
                    BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
                }
            }
        });
        Object.defineProperty(this, "mousemove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
            }
        });
        Object.defineProperty(this, "mouseup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                if (e.button === 0) {
                    BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
                }
            }
        });
        Object.defineProperty(this, "touchstart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y]);
            }
        });
        Object.defineProperty(this, "touchmove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y]);
            }
        });
        Object.defineProperty(this, "touchend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, [e.changedTouches[0].pageX - this.containerOffset.x, e.changedTouches[0].pageY - this.containerOffset.y]);
            }
        });
        Object.defineProperty(this, "setPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (point) => {
                this.setState({ position: point });
            }
        });
        Object.defineProperty(this, "setAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (angle) => {
                this.setState({ angle: angle });
            }
        });
        Object.defineProperty(this, "setRotateState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (isRotating) => {
                this.setState({ isRotating });
            }
        });
        Object.defineProperty(this, "setShowRotateBtn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (isShow) => {
                this.setState({ showRotateBtn: isShow });
            }
        });
        Object.defineProperty(this, "setShowFloatBarBtn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (isShow) => {
                this.setState({ showFloatBarBtn: isShow });
            }
        });
        this.state = {
            showRotateBtn: false,
            floatBarData: undefined,
            showFloatBar: false,
            zIndex: -1,
            dpr: 1,
            position: undefined,
            angle: 0,
            isRotating: false,
            showFloatBarBtn: false,
        };
    }
    showFloatBar(show, value) {
        const floatBarData = show && value && { ...this.state.floatBarData, ...value } || undefined;
        this.setState({
            showFloatBar: show,
            floatBarData,
            position: value && { x: value.x, y: value.y },
            angle: 0,
            showRotateBtn: show,
            showFloatBarBtn: true,
        });
        if (value && this.floatBarCanvasRef.current) {
            this.floatBarCanvasRef.current.width = value.w * this.state.dpr;
            this.floatBarCanvasRef.current.height = value.h * this.state.dpr;
        }
    }
    setSize(scale) {
        if (this.floatBarCanvasRef?.current) {
            this.floatBarCanvasRef.current.width = scale.width * this.state.dpr;
            this.floatBarCanvasRef.current.height = scale.height * this.state.dpr;
        }
        this.state.floatBarData && this.setState({ floatBarData: { ...this.state.floatBarData, w: scale.width, h: scale.height } });
    }
    setFloatZIndex(zIndex) {
        this.setState({ zIndex });
    }
    componentDidMount() {
        BezierPencilDisplayer.instance = this;
        BezierPencilDisplayer.InternalMsgEmitter.emit(InternalMsgEmitterType.DisplayState, DisplayStateEnum.mounted);
        BezierPencilDisplayer.InternalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
        BezierPencilDisplayer.InternalMsgEmitter?.on([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], this.setFloatZIndex.bind(this));
        this.init();
    }
    componentWillUnmount() {
        BezierPencilDisplayer.InternalMsgEmitter.emit(InternalMsgEmitterType.DisplayState, DisplayStateEnum.unmounted);
        BezierPencilDisplayer.InternalMsgEmitter.off([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
        BezierPencilDisplayer.InternalMsgEmitter?.off([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], this.setFloatZIndex.bind(this));
        const div = BezierPencilDisplayer.instance?.containerRef;
        if (div) {
            this.removeDisplayerEvent(div);
        }
    }
    getRatioWithContext(context) {
        const backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1.0;
        return Math.max(1.0, (window.devicePixelRatio || 1.0) / backingStoreRatio);
    }
    init() {
        const div = this.containerRef;
        const floatCanvas = this.canvasFloatRef;
        const bgCanvas = this.canvasBgRef;
        if (div && floatCanvas && bgCanvas) {
            const width = div.offsetWidth;
            const height = div.offsetHeight;
            if (width && height) {
                floatCanvas.style.width = `${width}px`;
                floatCanvas.style.height = `${height}px`;
                bgCanvas.style.width = `${width}px`;
                bgCanvas.style.height = `${height}px`;
                const dpr = this.getRatioWithContext(bgCanvas.getContext('2d'));
                floatCanvas.width = width * dpr;
                floatCanvas.height = height * dpr;
                bgCanvas.width = width * dpr;
                bgCanvas.height = height * dpr;
                BezierPencilDisplayer.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], div.offsetWidth, div.offsetHeight, dpr);
                const eventTraget = document.getElementsByClassName('netless-whiteboard');
                if (eventTraget && eventTraget[0]) {
                    this.containerOffset = this.getContainerOffset(eventTraget[0], this.containerOffset);
                    this.bindDisplayerEvent(eventTraget[0]);
                }
                this.setState({ dpr });
            }
        }
    }
    getContainerOffset(eventTraget, offset) {
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft,
            y: offset.y + eventTraget.offsetTop,
        };
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent, newOffset);
        }
        return newOffset;
    }
    bindDisplayerEvent(div) {
        div.addEventListener('mousedown', this.mousedown, false);
        window.addEventListener('mousemove', this.mousemove, false);
        window.addEventListener('mouseup', this.mouseup, false);
        window.addEventListener('mouseleave', this.mouseup, false);
        div.addEventListener('touchstart', this.touchstart, false);
        window.addEventListener('touchmove', this.touchmove, false);
        window.addEventListener('touchend', this.touchend, false);
    }
    removeDisplayerEvent(div) {
        div.removeEventListener('mousedown', this.mousedown);
        div.removeEventListener('mousemove', this.mousemove);
        div.removeEventListener('mouseup', this.mouseup);
        div.removeEventListener('mouseleave', this.mouseup);
        div.removeEventListener('touchstart', this.touchstart);
        div.removeEventListener('touchmove', this.touchmove);
        div.removeEventListener('touchend', this.touchend);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.props.children,
            React.createElement("div", { id: "bezier-pencil-plugin", className: styles['Container'], onMouseDown: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, onTouchStart: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                } },
                React.createElement("div", { className: styles['CanvasBox'], ref: (ref) => this.containerRef = ref },
                    React.createElement("canvas", { id: "bezier-pencil-float-canvas", className: styles['FloatCanvas'], ref: (ref) => this.canvasFloatRef = ref }),
                    React.createElement("canvas", { id: "bezier-pencil-bg-canvas", ref: (ref) => this.canvasBgRef = ref })),
                React.createElement(DisplayerContext.Provider, { value: {
                        InternalMsgEmitter: BezierPencilDisplayer.InternalMsgEmitter,
                        floatBarColors: BezierPencilDisplayer.floatBarColors,
                        floatBarData: this.state.floatBarData,
                        zIndex: this.state.zIndex,
                        dpr: this.state.dpr,
                        position: this.state.position,
                        angle: this.state.angle,
                        isRotating: this.state.isRotating,
                        showFloatBarBtn: this.state.showFloatBarBtn,
                        setPosition: this.setPosition.bind(this),
                        setSize: this.setSize.bind(this),
                        setAngle: this.setAngle.bind(this),
                        setRotateState: this.setRotateState.bind(this),
                        setShowRotateBtn: this.setShowRotateBtn.bind(this),
                        setShowFloatBarBtn: this.setShowFloatBarBtn.bind(this)
                    } },
                    this.state.showFloatBar && React.createElement(FloatBar, { className: styles['FloatBar'], ref: this.floatBarCanvasRef }),
                    this.state.showFloatBarBtn && this.state.showRotateBtn && this.state.floatBarData?.selectIds?.length === 1 && React.createElement(RotateBtn, { className: styles['RotateBtn'] })))));
    }
}
Object.defineProperty(BezierPencilDisplayer, "InternalMsgEmitter", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new EventEmitter2()
});
Object.defineProperty(BezierPencilDisplayer, "floatBarColors", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: []
});
