/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import ReactDOM from "react-dom";
import React from "react";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { TeachingAidsSingleManager } from "../teachingAidsSingleManager";
import { getRatioWithContext } from "../../../core/utils";
import { BaseViewDisplayer } from "../../displayerView";

export class MainViewSingleDisplayerManager extends MainViewDisplayerManager {
    width: number = 1000;
    height: number = 1000;
    dpr: number = 1;
    vDom?: BaseViewDisplayer;
    viewId:string = 'mainView';
    eventTragetElement?: HTMLDivElement;
    canvasFloatRef = React.createRef<HTMLCanvasElement>();
    canvasBgRef = React.createRef<HTMLCanvasElement>();
    floatBarRef = React.createRef<HTMLDivElement>();
    floatBarCanvasRef = React.createRef<HTMLCanvasElement>();
    containerOffset: { x: number; y: number } = { x: 0, y: 0 };
    constructor(control: TeachingAidsSingleManager, internalMsgEmitter:EventEmitter2) {
        super(control, internalMsgEmitter );
    }
    setCanvassStyle() {
        if (this.eventTragetElement) {
            const width = this.eventTragetElement.offsetWidth;
            const height = this.eventTragetElement.offsetHeight;
            if (width && height && this.canvasBgRef.current && this.canvasFloatRef.current) {
                this.dpr = getRatioWithContext(this.canvasBgRef.current.getContext('2d') as CanvasRenderingContext2D);
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
    destroy(){
        if (this.eventTragetElement) {
            this.removeDisplayerEvent(this.eventTragetElement)
        } 
    }
    createMainViewDisplayer(mainView: HTMLDivElement): MainViewDisplayerManager {
        this.containerOffset = this.getContainerOffset(mainView,this.containerOffset);
        this.eventTragetElement = (mainView.parentElement as HTMLDivElement).children[0] as HTMLDivElement;
        ReactDOM.render(<BaseViewDisplayer viewId={this.viewId} maranger={this} refs={{
            canvasFloatRef: this.canvasFloatRef,
            canvasBgRef: this.canvasBgRef,
            floatBarRef: this.floatBarRef,
            floatBarCanvasRef:this.floatBarCanvasRef
        }}/>, mainView);
        this.bindDisplayerEvent(this.eventTragetElement);
        return this;
    }
}