import EventEmitter2 from "eventemitter2";
import React from "react";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { ApplianceSingleManager } from "../applianceSingleManager";
import { BaseViewDisplayer } from "../../displayerView";
export declare class MainViewSingleDisplayerManager extends MainViewDisplayerManager {
    width: number;
    height: number;
    dpr: number;
    vDom?: BaseViewDisplayer;
    viewId: string;
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
    constructor(control: ApplianceSingleManager, internalMsgEmitter: EventEmitter2);
    setCanvassStyle(): void;
    createMainViewDisplayer(mainView: HTMLDivElement): MainViewDisplayerManager;
}
