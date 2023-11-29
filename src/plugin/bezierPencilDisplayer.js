import * as React from "react";
import styles from './index.module.less';
import { DisplayStateEnum, EInternalEventType, } from "./types";
import { FloatBar } from "../displayer/floatBar";
import { EventEmitter2 } from "eventemitter2";
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
        this.state = {
            showFloatBar: false,
        };
    }
    showFloatBar(value) {
        this.setState({ showFloatBar: true, floatBarDate: value });
    }
    hidFloatBar() {
        this.setState({ showFloatBar: false });
    }
    componentDidMount() {
        BezierPencilDisplayer.instance = this;
        // BezierPencilDisplayer.displayState$.set(DisplayStateEnum.mounted);
        BezierPencilDisplayer.InternalMsgEmitter.emit('displayState', DisplayStateEnum.mounted);
        BezierPencilDisplayer.InternalMsgEmitter.on(['floatBar', EInternalEventType.ShowFloatBar], this.showFloatBar);
        BezierPencilDisplayer.InternalMsgEmitter.on(['floatBar', EInternalEventType.ShowFloatBar], this.hidFloatBar);
    }
    componentWillUnmount() {
        // BezierPencilDisplayer.displayState$.set(DisplayStateEnum.unmounted);
        BezierPencilDisplayer.InternalMsgEmitter.emit('displayState', DisplayStateEnum.unmounted);
        BezierPencilDisplayer.InternalMsgEmitter.off(['floatBar', EInternalEventType.ShowFloatBar], this.showFloatBar);
        BezierPencilDisplayer.InternalMsgEmitter.off(['floatBar', EInternalEventType.ShowFloatBar], this.hidFloatBar);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.props.children,
            React.createElement("div", { id: "bezier-pencil-plugin", className: styles['Container'], ref: (ref) => this.containerRef = ref },
                React.createElement("canvas", { className: styles['FloatCanvas'], id: "bezier-pencil-float-canvas", ref: (ref) => this.canvasFloatRef = ref }),
                React.createElement("canvas", { className: styles['BgCanvas'], id: "bezier-pencil-bg-canvas", ref: (ref) => this.canvasBgRef = ref }),
                this.state.showFloatBar && React.createElement(FloatBar, { className: styles['FloatBar'], internalMsgEmitter: BezierPencilDisplayer.InternalMsgEmitter, styleData: this.state.floatBarDate }))));
    }
}
Object.defineProperty(BezierPencilDisplayer, "InternalMsgEmitter", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new EventEmitter2()
});
