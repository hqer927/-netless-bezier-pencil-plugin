import EventEmitter2 from "eventemitter2";
import React from "react";
import { ApplianceMultiManager } from "../applianceMultiManager";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { BaseViewDisplayer } from "../../displayerView";
export declare class MainViewMultiDisplayerManager extends MainViewDisplayerManager {
    width: number;
    height: number;
    dpr: number;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    snapshotContainerRef?: React.RefObject<HTMLDivElement>;
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
    constructor(control: ApplianceMultiManager, internalMsgEmitter: EventEmitter2);
    setCanvassStyle(): void;
    destroy(): void;
    createMainViewDisplayer(mainViewContainer: HTMLDivElement): MainViewDisplayerManager;
}
