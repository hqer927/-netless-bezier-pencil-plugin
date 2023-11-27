import * as React from "react";
import type { ReactNode } from "react";
import styles from './index.module.less';

import type { Val} from "value-enhancer";
import { val } from "value-enhancer";
import { DisplayStateEnum, } from "./types";

interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
    style: React.CSSProperties;
}

export class BezierPencilDisplayer extends React.Component<DisplayerProps, DisplayerState> {
    static instance: BezierPencilDisplayer;
    static displayState$: Val<DisplayStateEnum> = val(DisplayStateEnum.pedding);
    public containerRef: HTMLDivElement | null = null;
    public canvasFloatRef: HTMLCanvasElement | null = null;
    public canvasBgRef: HTMLCanvasElement | null = null;

    public constructor(props: DisplayerProps) {
        super(props);
    }
    componentDidMount(): void {
        BezierPencilDisplayer.instance = this;
        BezierPencilDisplayer.displayState$.set(DisplayStateEnum.mounted);
    }
    componentWillUnmount(): void {
        BezierPencilDisplayer.displayState$.set(DisplayStateEnum.unmounted);
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
                </div>
            </React.Fragment>
        );
    }
}