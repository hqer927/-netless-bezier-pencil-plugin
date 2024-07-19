import React from "react";
import { BaseViewDisplayer } from "../../displayerView";
import { AppViewDisplayerManager } from "../../baseViewContainerManager";
import { EventEmitter2 } from "eventemitter2";
import { ApplianceMultiManager } from "../applianceMultiManager";
export declare class AppViewDisplayerManagerImpl extends AppViewDisplayerManager {
    dpr: number;
    width: number;
    height: number;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    canvasTopRef: React.RefObject<HTMLCanvasElement>;
    canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
    canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    canvasBgRef: React.RefObject<HTMLCanvasElement>;
    floatBarRef: React.RefObject<HTMLDivElement>;
    containerOffset: {
        x: number;
        y: number;
    };
    constructor(viewId: string, control: ApplianceMultiManager, internalMsgEmitter: EventEmitter2);
    setCanvassStyle(): void;
    createAppViewDisplayer(viewId: string, appViewContainer: HTMLDivElement): AppViewDisplayerManager;
}
