import React, { ReactNode } from "react";
import type { RoomMember } from "white-web-sdk";
import { EmitEventType, TeachingAidsViewManagerLike } from "./types";
import { TextEditorInfo } from "../component/textEditor";
import { ShowFloatBarMsgValue } from "../displayer/types";
export interface BaseDisplayerProps {
    viewId: string;
    maranger: TeachingAidsViewManagerLike;
    refs: {
        canvasFloatRef: React.RefObject<HTMLCanvasElement>;
        canvasBgRef: React.RefObject<HTMLCanvasElement>;
        floatBarRef: React.RefObject<HTMLDivElement>;
        floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    };
}
export interface BaseDisplayerState {
    showFloatBar: boolean;
    zIndex: number;
    floatBarData?: ShowFloatBarMsgValue;
    dpr: number;
    position?: {
        x: number;
        y: number;
    };
    operationType: EmitEventType;
    angle: number;
    cursorInfo?: {
        x?: number;
        y?: number;
        roomMember?: RoomMember;
    };
    scale: [number, number];
    editors?: Map<string, TextEditorInfo>;
    activeTextId?: string;
}
export declare const DisplayerContext: React.Context<Pick<BaseDisplayerState, "scale" | "zIndex" | "dpr" | "position" | "angle" | "floatBarData" | "operationType"> & {
    maranger?: TeachingAidsViewManagerLike | undefined;
    floatBarColors: [number, number, number][];
    setPosition: (point: {
        x: number;
        y: number;
    }) => void;
    setAngle: (angle: number) => void;
    setOperationType: (type: EmitEventType) => void;
    setFloatBarData: (data: Partial<ShowFloatBarMsgValue>) => void;
}>;
export declare class BaseViewDisplayer extends React.Component<BaseDisplayerProps, BaseDisplayerState> {
    constructor(props: BaseDisplayerProps);
    private get editors();
    componentDidMount(): void;
    componentWillUnmount(): void;
    showFloatBar(show: boolean, value?: Partial<ShowFloatBarMsgValue>): void;
    setActiveTextEditor(activeTextId?: string): void;
    setActiveCursor(cursorInfo?: {
        x?: number;
        y?: number;
        roomMember?: RoomMember;
    }): void;
    setFloatZIndex(zIndex: number): void;
    setFloatBarData(data: Partial<ShowFloatBarMsgValue>): void;
    private setPosition;
    private setAngle;
    private setOperationType;
    render(): ReactNode;
}
