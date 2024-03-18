import React from "react";
import type { ReactNode } from "react";
import { EventEmitter2 } from "eventemitter2";
import { ShowFloatBarMsgValue } from "../../displayer/types";
import { EvevtWorkState } from "../../core";
import { RoomMember } from "white-web-sdk";
interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
    showFloatBar: boolean;
    zIndex: number;
    floatBarData?: ShowFloatBarMsgValue;
    dpr: number;
    position?: {
        x: number;
        y: number;
    };
    angle: number;
    isRotating: boolean;
    showRotateBtn: boolean;
    showFloatBarBtn: boolean;
    cursorInfo?: {
        x?: number;
        y?: number;
        roomMember?: RoomMember;
    }[];
}
export declare const DisplayerContext: React.Context<Pick<DisplayerState, "zIndex" | "angle" | "position" | "floatBarData" | "dpr" | "isRotating" | "showFloatBarBtn"> & {
    floatBarColors: [number, number, number][];
    InternalMsgEmitter: EventEmitter2 | undefined;
    setPosition: (point: {
        x: number;
        y: number;
    }) => void;
    setSize: (size: {
        width: number;
        height: number;
        workState: EvevtWorkState;
    }) => void;
    setAngle: (angle: number) => void;
    setRotateState: (isRotation: boolean) => void;
    setShowRotateBtn: (show: boolean) => void;
    setShowFloatBarBtn: (show: boolean) => void;
}>;
export declare class BezierPencilDisplayer extends React.Component<DisplayerProps, DisplayerState> {
    static isRoom: boolean;
    static instance: BezierPencilDisplayer;
    static floatBarColors: [number, number, number][];
    containerRef: HTMLDivElement | null;
    canvasFloatRef: HTMLCanvasElement | null;
    canvasBgRef: HTMLCanvasElement | null;
    floatBarRef: HTMLDivElement | null;
    floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    containerOffset: {
        x: number;
        y: number;
    };
    constructor(props: DisplayerProps);
    private showFloatBar;
    private setSize;
    private setFloatZIndex;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private setActiveCursor;
    private getRatioWithContext;
    private init;
    private getContainerOffset;
    private mousedown;
    private mousemove;
    private mouseup;
    private touchstart;
    private touchmove;
    private touchend;
    private cursorMouseMove;
    private cursorMouseLeave;
    private bindDisplayerEvent;
    private removeDisplayerEvent;
    private setPosition;
    private setAngle;
    private setRotateState;
    private setShowRotateBtn;
    private setShowFloatBarBtn;
    render(): ReactNode;
}
export {};
