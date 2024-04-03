import React from "react";
import { BaseViewDisplayer } from "../../displayerView";
import { AppViewDisplayerManager } from "../../baseViewContainerManager";
import { EventEmitter2 } from "eventemitter2";
import { TeachingAidsMultiManager } from "../teachingAidsMultiManager";
export declare class AppViewDisplayerManagerImpl extends AppViewDisplayerManager {
    dpr: number;
    width: number;
    height: number;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    canvasFloatRef: React.RefObject<HTMLCanvasElement>;
    canvasBgRef: React.RefObject<HTMLCanvasElement>;
    floatBarRef: React.RefObject<HTMLDivElement>;
    floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    containerOffset: {
        x: number;
        y: number;
    };
    constructor(viewId: string, control: TeachingAidsMultiManager, internalMsgEmitter: EventEmitter2);
    setCanvassStyle(): void;
    createAppViewDisplayer(viewId: string, appViewContainer: HTMLDivElement): AppViewDisplayerManager;
}
