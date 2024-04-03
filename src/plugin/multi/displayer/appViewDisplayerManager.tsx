/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from "react-dom";
import React from "react";
import { BaseViewDisplayer } from "../../displayerView";
import { AppViewDisplayerManager } from "../../baseViewContainerManager";
import { EventEmitter2 } from "eventemitter2";
import { TeachingAidsMultiManager } from "../teachingAidsMultiManager";
import { getRatioWithContext } from "../../../core/utils";

export class AppViewDisplayerManagerImpl extends AppViewDisplayerManager {
    dpr: number = 1;
    width: number = 1000;
    height: number = 1000;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    canvasFloatRef = React.createRef<HTMLCanvasElement>();
    canvasBgRef = React.createRef<HTMLCanvasElement>();
    floatBarRef = React.createRef<HTMLDivElement>();
    floatBarCanvasRef = React.createRef<HTMLCanvasElement>();
    containerOffset: { x: number; y: number } = { x: 0, y: 0 };
    constructor(viewId:string, control: TeachingAidsMultiManager, internalMsgEmitter:EventEmitter2){
        super(viewId, control,internalMsgEmitter);
    }
    setCanvassStyle() {
        if (this.eventTragetElement) {
            if (this.canvasBgRef.current) {
                this.dpr = getRatioWithContext(this.canvasBgRef.current.getContext('2d') as CanvasRenderingContext2D);
                const width = this.eventTragetElement.offsetWidth || this.width;
                const height = this.eventTragetElement.offsetHeight || this.height;
                if (width && height && this.canvasFloatRef.current) {
                    this.width = width;
                    this.height = height;
                    this.canvasBgRef.current.style.width = `${width}px`;
                    this.canvasBgRef.current.style.height = `${height}px`;
                    this.canvasFloatRef.current.style.width = `${width}px`;
                    this.canvasFloatRef.current.style.height = `${height}px`;
                    this.canvasFloatRef.current.width = width * this.dpr;
                    this.canvasFloatRef.current.height = height * this.dpr;
                    this.canvasBgRef.current.width = width * this.dpr;
                    this.canvasBgRef.current.height = height * this.dpr;
                }
            }
        }
    }
    createAppViewDisplayer(viewId:string, appViewContainer: HTMLDivElement): AppViewDisplayerManager {
        const appViewDisplayer = document.createElement('div');
        appViewDisplayer.className = 'teaching-aids-plugin-app-view-displayer';
        appViewContainer.appendChild(appViewDisplayer);
        this.eventTragetElement = (appViewContainer as HTMLDivElement).children[0] as HTMLDivElement;
        this.containerOffset = this.getContainerOffset(this.eventTragetElement ,this.containerOffset);
        this.bindToolsClass();
        ReactDOM.render(<BaseViewDisplayer viewId={viewId} maranger={this} refs={{
            canvasFloatRef: this.canvasFloatRef,
            canvasBgRef: this.canvasBgRef,
            floatBarRef: this.floatBarRef,
            floatBarCanvasRef:this.floatBarCanvasRef
        }}/>, appViewDisplayer);
        this.bindDisplayerEvent(this.eventTragetElement);
        return this;
    }
}