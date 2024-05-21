import EventEmitter2 from "eventemitter2";
import React from "react";
import { TeachingAidsMultiManager } from "../teachingAidsMultiManager";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { BaseViewDisplayer } from "../../displayerView";
export declare class MainViewMultiDisplayerManager extends MainViewDisplayerManager {
    width: number;
    height: number;
    dpr: number;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
    canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    canvasBgRef: React.RefObject<HTMLCanvasElement>;
    floatBarRef: React.RefObject<HTMLDivElement>;
    floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    containerOffset: {
        x: number;
        y: number;
    };
    constructor(control: TeachingAidsMultiManager, internalMsgEmitter: EventEmitter2);
    setCanvassStyle(): void;
    destroy(): void;
    createMainViewDisplayer(mainViewContainer: HTMLDivElement): MainViewDisplayerManager;
}
