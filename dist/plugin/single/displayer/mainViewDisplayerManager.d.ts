import EventEmitter2 from "eventemitter2";
import React from "react";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { TeachingAidsSingleManager } from "../teachingAidsSingleManager";
import { BaseViewDisplayer } from "../../displayerView";
export declare class MainViewSingleDisplayerManager extends MainViewDisplayerManager {
    width: number;
    height: number;
    dpr: number;
    vDom?: BaseViewDisplayer;
    viewId: string;
    eventTragetElement?: HTMLDivElement;
    canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    canvasBgRef: React.RefObject<HTMLCanvasElement>;
    floatBarRef: React.RefObject<HTMLDivElement>;
    floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    containerOffset: {
        x: number;
        y: number;
    };
    constructor(control: TeachingAidsSingleManager, internalMsgEmitter: EventEmitter2);
    setCanvassStyle(): void;
    destroy(): void;
    createMainViewDisplayer(mainView: HTMLDivElement): MainViewDisplayerManager;
}
