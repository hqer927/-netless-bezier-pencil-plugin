import * as React from "react";
import type { ReactNode } from "react";
import type { Val } from "value-enhancer";
import { DisplayStateEnum } from "./types";
interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
    style: React.CSSProperties;
}
export declare class BezierPencilDisplayer extends React.Component<DisplayerProps, DisplayerState> {
    static instance: BezierPencilDisplayer;
    static displayState$: Val<DisplayStateEnum>;
    containerRef: HTMLDivElement | null;
    canvasFloatRef: HTMLCanvasElement | null;
    canvasBgRef: HTMLCanvasElement | null;
    constructor(props: DisplayerProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export {};
