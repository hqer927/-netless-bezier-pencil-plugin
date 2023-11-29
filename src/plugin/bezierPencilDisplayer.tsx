import * as React from "react";
import type { ReactNode } from "react";
import styles from './index.module.less';
import { DisplayStateEnum, EInternalEventType, } from "./types";
import { FloatBar } from "../displayer/floatBar";
import { EventEmitter2 } from "eventemitter2";
import { ShowFloatBarMsgValue } from "../displayer/types";

interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
    showFloatBar: boolean;
    floatBarDate?: ShowFloatBarMsgValue;
}

export class BezierPencilDisplayer extends React.Component<DisplayerProps, DisplayerState> {
    static instance: BezierPencilDisplayer;
    static InternalMsgEmitter: EventEmitter2  = new EventEmitter2();
    public containerRef: HTMLDivElement | null = null;
    public canvasFloatRef: HTMLCanvasElement | null = null;
    public canvasBgRef: HTMLCanvasElement | null = null;
    public floatBarRef: HTMLDivElement | null = null;

    public constructor(props: DisplayerProps) {
        super(props);
        this.state = {
            showFloatBar: false,
        };
    }
    private showFloatBar(value: ShowFloatBarMsgValue) {
        this.setState({showFloatBar: true, floatBarDate:value})
    }
    private hidFloatBar() {
        this.setState({showFloatBar: false})
    }
    componentDidMount(): void {
        BezierPencilDisplayer.instance = this;
        // BezierPencilDisplayer.displayState$.set(DisplayStateEnum.mounted);
        BezierPencilDisplayer.InternalMsgEmitter.emit('displayState', DisplayStateEnum.mounted);
        BezierPencilDisplayer.InternalMsgEmitter.on(['floatBar', EInternalEventType.ShowFloatBar], this.showFloatBar);
        BezierPencilDisplayer.InternalMsgEmitter.on(['floatBar', EInternalEventType.ShowFloatBar], this.hidFloatBar);
    }
    componentWillUnmount(): void {
        // BezierPencilDisplayer.displayState$.set(DisplayStateEnum.unmounted);
        BezierPencilDisplayer.InternalMsgEmitter.emit('displayState', DisplayStateEnum.unmounted);
        BezierPencilDisplayer.InternalMsgEmitter.off(['floatBar', EInternalEventType.ShowFloatBar], this.showFloatBar);
        BezierPencilDisplayer.InternalMsgEmitter.off(['floatBar', EInternalEventType.ShowFloatBar], this.hidFloatBar);
    }

    render(): ReactNode {
        return (
            <React.Fragment>
                {this.props.children}
                <div id="bezier-pencil-plugin" 
                    className={styles['Container']}
                    ref={(ref) => this.containerRef = ref}>
                        <canvas className={styles['FloatCanvas']} id="bezier-pencil-float-canvas" ref={(ref) => this.canvasFloatRef = ref}/>
                        <canvas className={styles['BgCanvas']} id="bezier-pencil-bg-canvas" ref={(ref) => this.canvasBgRef = ref}/>
                        { this.state.showFloatBar && <FloatBar className={styles['FloatBar']}  internalMsgEmitter={BezierPencilDisplayer.InternalMsgEmitter} styleData={this.state.floatBarDate} />}
                </div>
            </React.Fragment>
        );
    }
}