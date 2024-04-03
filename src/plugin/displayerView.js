/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import React from "react";
import { EmitEventType, InternalMsgEmitterType } from "./types";
import { EScaleType, EvevtWorkState } from "../core";
import { TextEditorContainer } from "../component/textEditor/view";
import { FloatBar } from "../displayer/floatBar";
import { RotateBtn } from "../displayer/rotate";
import { CursorManager } from '../displayer/cursor';
import { ResizableBox } from '../displayer/resizable';
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
    setSize: () => { },
    setAngle: () => { },
    setOperationType: () => { },
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
            editors: this.props.maranger.control.textEditorManager?.editors,
            activeTextId: this.props.maranger.control.textEditorManager?.activeId
        };
    }
    componentDidMount() {
        this.props.maranger.vDom = this;
        this.props.maranger.mountView();
        this.setState({ dpr: this.props.maranger.dpr });
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], this.setFloatZIndex.bind(this));
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.Cursor, EmitEventType.ActiveCursor], this.setActiveCursor.bind(this));
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor],this.bindTextEditorEvent.bind(this));
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
        this.setState({
            activeTextId,
            editors: this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId)
        });
    }
    setActiveCursor(cursorInfo) {
        this.setState({ cursorInfo });
    }
    setSize(scale) {
        if (scale.workState === EvevtWorkState.Done) {
            this.state.floatBarData && this.setState({
                floatBarData: { ...this.state.floatBarData, w: scale.width, h: scale.height },
                scale: [1, 1],
                operationType: EmitEventType.None,
            });
        }
        else {
            this.state.floatBarData && this.setState({
                floatBarData: { ...this.state.floatBarData, w: scale.width, h: scale.height },
                scale: [1, 1],
                operationType: EmitEventType.ScaleNode,
            });
        }
    }
    setFloatZIndex(zIndex) {
        this.setState({ zIndex });
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: styles['Container'], onMouseDown: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, onTouchStart: (e) => {
                    e.stopPropagation();
                }, onMouseMove: (e) => {
                    this.props.maranger.internalMsgEmitter.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], this.props.maranger.getPoint(e));
                } },
                React.createElement("div", { className: styles['CanvasBox'] },
                    React.createElement("canvas", { className: styles['FloatCanvas'], ref: this.props.refs.canvasFloatRef }),
                    React.createElement("canvas", { ref: this.props.refs.canvasBgRef })),
                React.createElement(DisplayerContext.Provider, { value: {
                        maranger: this.props.maranger,
                        floatBarColors: this.props.maranger.control?.room?.floatBarOptions?.colors || [],
                        floatBarData: this.state.floatBarData,
                        zIndex: this.state.zIndex,
                        dpr: this.state.dpr,
                        position: this.state.position,
                        angle: this.state.angle,
                        operationType: this.state.operationType,
                        scale: this.state.scale,
                        setPosition: this.setPosition.bind(this),
                        setSize: this.setSize.bind(this),
                        setAngle: this.setAngle.bind(this),
                        setOperationType: this.setOperationType.bind(this),
                    } },
                    this.state.showFloatBar &&
                        React.createElement(FloatBar, { className: styles['FloatBar'], ref: this.props.refs.floatBarCanvasRef, editors: this.state.editors, activeTextId: this.state.activeTextId }),
                    this.state.editors?.size &&
                        React.createElement(TextEditorContainer, { className: styles['TextEditorContainer'], manager: this.props.maranger, selectIds: this.state.floatBarData?.selectIds || [], editors: this.state.editors, activeTextId: this.state.activeTextId }),
                    this.state.floatBarData?.canRotate && this.state.floatBarData?.selectIds?.length === 1 &&
                        (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.RotateNode) &&
                        React.createElement(RotateBtn, { className: styles['RotateBtn'] }),
                    this.state.floatBarData?.scaleType === EScaleType.all && this.state.showFloatBar &&
                        (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.ScaleNode) &&
                        React.createElement(ResizableBox, { className: styles['ResizeBtn'] })),
                this.state.cursorInfo?.map((info) => {
                    if (info.roomMember) {
                        return React.createElement(CursorManager, { key: info.roomMember.memberId, className: styles['CursorBox'], info: info });
                    }
                    return null;
                }))));
    }
}
