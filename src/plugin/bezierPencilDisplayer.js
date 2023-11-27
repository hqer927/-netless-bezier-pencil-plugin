import * as React from "react";
import styles from './index.module.less';
import { val } from "value-enhancer";
import { DisplayStateEnum, } from "./types";
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
    }
    componentDidMount() {
        BezierPencilDisplayer.instance = this;
        BezierPencilDisplayer.displayState$.set(DisplayStateEnum.mounted);
    }
    componentWillUnmount() {
        BezierPencilDisplayer.displayState$.set(DisplayStateEnum.unmounted);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.props.children,
            React.createElement("div", { id: "bezier-pencil-plugin", className: styles['Container'], ref: (ref) => this.containerRef = ref },
                React.createElement("canvas", { className: styles['FloatCanvas'], id: "bezier-pencil-float-canvas", ref: (ref) => this.canvasFloatRef = ref }),
                React.createElement("canvas", { className: styles['BgCanvas'], id: "bezier-pencil-bg-canvas", ref: (ref) => this.canvasBgRef = ref }))));
    }
}
Object.defineProperty(BezierPencilDisplayer, "displayState$", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: val(DisplayStateEnum.pedding)
});
