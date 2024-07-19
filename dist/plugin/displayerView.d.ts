import React, { ReactNode } from "react";
import { EmitEventType, ApplianceViewManagerLike } from "./types";
import { TextEditorInfo } from "../component/textEditor";
import { ShowFloatBarMsgValue } from "../displayer/types";
export interface BaseDisplayerProps {
    viewId: string;
    maranger: ApplianceViewManagerLike;
    refs: {
        snapshotContainerRef?: React.RefObject<HTMLDivElement>;
        canvasContainerRef: React.RefObject<HTMLDivElement>;
        canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
        canvasFloatRef: React.RefObject<HTMLCanvasElement>;
        canvasBgRef: React.RefObject<HTMLCanvasElement>;
        canvasTopRef: React.RefObject<HTMLCanvasElement>;
        floatBarRef: React.RefObject<HTMLDivElement>;
    };
}
export interface BaseDisplayerState {
    showFloatBar: boolean;
    floatBarData?: ShowFloatBarMsgValue;
    dpr: number;
    operationType: EmitEventType;
    angle: number;
    scale: [number, number];
    editors?: Map<string, TextEditorInfo>;
    activeTextId?: string;
}
export declare const DisplayerContext: React.Context<Pick<BaseDisplayerState, "scale" | "dpr" | "angle" | "floatBarData" | "operationType"> & {
    maranger?: ApplianceViewManagerLike | undefined;
    floatBarColors: [number, number, number][];
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
    setFloatBarData(data: Partial<ShowFloatBarMsgValue>): void;
    private setAngle;
    private setOperationType;
    render(): ReactNode;
}
