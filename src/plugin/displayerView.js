/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import React from "react";
import { EmitEventType } from "./types";
import { EScaleType } from "../core";
import { TextEditorContainer } from "../component/textEditor/view";
import { FloatBar, FloatBarBtn } from "../displayer/floatBar";
import { RotateBtn } from "../displayer/rotate";
import { CursorManager } from '../displayer/cursor';
import { ResizableBox, ResizableTwoBox } from '../displayer/resizable';
import cloneDeep from 'lodash/cloneDeep';
export const DisplayerContext = React.createContext({
    maranger: undefined,
    floatBarColors: [],
    floatBarData: undefined,
    zIndex: -1,
    dpr: 1,
    position: undefined,
    angle: 0,
    operationType: EmitEventType.None,
    scale: [1, 1],
    setPosition: () => { },
    setAngle: () => { },
    setOperationType: () => { },
    setFloatBarData: () => { }
});
export class BaseViewDisplayer extends React.Component {
    constructor(props) {
        super(props);
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
        Object.defineProperty(this, "setOperationType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (type) => {
                this.setState({ operationType: type });
            }
        });
        this.state = {
            floatBarData: undefined,
            showFloatBar: false,
            zIndex: -1,
            dpr: 1,
            position: undefined,
            angle: 0,
            operationType: EmitEventType.None,
            cursorInfo: undefined,
            scale: [1, 1],
            editors: this.editors,
            activeTextId: this.props.maranger.control.textEditorManager?.activeId
        };
    }
    get editors() {
        return cloneDeep(this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId));
    }
    componentDidMount() {
        this.props.maranger.vDom = this;
        this.props.maranger.mountView();
        this.setState({ dpr: this.props.maranger.dpr });
    }
    componentWillUnmount() { }
    showFloatBar(show, value) {
        const floatBarData = (show && value && { ...this.state.floatBarData, ...value }) || undefined;
        this.setState({
            showFloatBar: show,
            floatBarData,
            position: floatBarData && { x: floatBarData.x, y: floatBarData.y },
            angle: 0
        });
        if (floatBarData && this.props.refs.floatBarCanvasRef.current) {
            if (floatBarData.canvasHeight && floatBarData.canvasWidth) {
                this.props.refs.floatBarCanvasRef.current.width = floatBarData.canvasWidth * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.height = floatBarData.canvasHeight * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.style.width = floatBarData.canvasWidth + 'px';
                this.props.refs.floatBarCanvasRef.current.style.height = floatBarData.canvasHeight + 'px';
            }
            else {
                this.props.refs.floatBarCanvasRef.current.width = floatBarData.w * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.height = floatBarData.h * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.style.width = '100%';
                this.props.refs.floatBarCanvasRef.current.style.height = '100%';
            }
        }
    }
    setActiveTextEditor(activeTextId) {
        // const editors = cloneDeep(this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId));
        this.setState({
            activeTextId,
            editors: this.editors
        });
    }
    setActiveCursor(cursorInfo) {
        this.setState({ cursorInfo });
    }
    setFloatZIndex(zIndex) {
        this.setState({ zIndex });
    }
    setFloatBarData(data) {
        this.state.floatBarData && this.setState({
            floatBarData: { ...this.state.floatBarData, ...data }
        });
    }
    render() {
        const showFloatBtns = !!this.props.maranger.control?.room?.floatBarOptions;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: styles['Container'], onMouseDown: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, onTouchStart: (e) => {
                    e.stopPropagation();
                }, onMouseMove: (e) => {
                    this.props.maranger.cursorMouseMove(e);
                } },
                React.createElement("div", { className: styles['CanvasBox'] },
                    React.createElement("canvas", { className: styles['FloatCanvas'], ref: this.props.refs.canvasFloatRef }),
                    React.createElement("canvas", { ref: this.props.refs.canvasBgRef })),
                React.createElement(DisplayerContext.Provider, { value: {
                        maranger: this.props.maranger,
                        floatBarColors: showFloatBtns && this.props.maranger.control?.room?.floatBarOptions?.colors || [],
                        floatBarData: this.state.floatBarData,
                        zIndex: this.state.zIndex,
                        dpr: this.state.dpr,
                        position: this.state.position,
                        angle: this.state.angle,
                        operationType: this.state.operationType,
                        scale: this.state.scale,
                        setPosition: this.setPosition.bind(this),
                        setAngle: this.setAngle.bind(this),
                        setOperationType: this.setOperationType.bind(this),
                        setFloatBarData: this.setFloatBarData.bind(this),
                    } },
                    this.state.showFloatBar &&
                        React.createElement(FloatBar, { className: styles['FloatBar'], ref: this.props.refs.floatBarCanvasRef, editors: this.state.editors, activeTextId: this.state.activeTextId }) || null,
                    this.state.editors?.size &&
                        React.createElement(TextEditorContainer, { className: styles['TextEditorContainer'], showFloatBtns: showFloatBtns, manager: this.props.maranger, selectIds: this.state.floatBarData?.selectIds || [], editors: this.state.editors, activeTextId: this.state.activeTextId }) || null,
                    this.state.floatBarData?.canRotate && this.state.floatBarData?.selectIds?.length === 1 &&
                        (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.RotateNode) &&
                        React.createElement(RotateBtn, { className: styles['RotateBtn'] }) || null,
                    (this.state.floatBarData?.scaleType === EScaleType.all || this.state.floatBarData?.scaleType === EScaleType.proportional) && this.state.showFloatBar &&
                        (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.ScaleNode) &&
                        React.createElement(ResizableBox, { className: styles['ResizeBtn'] }) || null,
                    this.state.floatBarData?.scaleType === EScaleType.both && this.state.showFloatBar &&
                        (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.SetPoint) &&
                        React.createElement(ResizableTwoBox, { className: styles['ResizeTowBox'] }) || null,
                    this.state.showFloatBar && showFloatBtns && React.createElement(FloatBarBtn, { className: styles['FloatBarBtn'] }) || null),
                this.state.cursorInfo && this.state.cursorInfo.roomMember && (React.createElement(CursorManager, { key: this.state.cursorInfo.roomMember.memberId, className: styles['CursorBox'], info: this.state.cursorInfo }) || null))));
    }
}
