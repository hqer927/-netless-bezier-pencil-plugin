/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import ReactDOM from "react-dom";
import React from "react";
import { TeachingAidsMultiManager } from "../teachingAidsMultiManager";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { getRatioWithContext } from "../../../core/utils";
import { BaseViewDisplayer } from "../../displayerView";

export class MainViewMultiDisplayerManager extends MainViewDisplayerManager {
    width: number = 1000;
    height: number = 1000;
    dpr: number = 1;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    canvasFloatRef = React.createRef<HTMLCanvasElement>();
    canvasBgRef = React.createRef<HTMLCanvasElement>();
    floatBarRef = React.createRef<HTMLDivElement>();
    floatBarCanvasRef = React.createRef<HTMLCanvasElement>();
    containerOffset: { x: number; y: number } = { x: 0, y: 0 };
    constructor(control: TeachingAidsMultiManager, internalMsgEmitter:EventEmitter2) {
        super(control,internalMsgEmitter);
    }
    setCanvassStyle() {
        if (this.eventTragetElement) {
            const width = this.eventTragetElement.offsetWidth || this.width;
            const height = this.eventTragetElement.offsetHeight || this.height;
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
        super.destroy();
        if(this.eventTragetElement){
            const container = this.eventTragetElement.parentElement;
            if (container) {
                const mainViewNode = container.querySelectorAll('.teaching-aids-plugin-main-view-displayer');
                for (const item of mainViewNode) {
                    item.remove();
                }
            }
        }
    }
    createMainViewDisplayer(mainViewContainer: HTMLDivElement): MainViewDisplayerManager {
        const mainViewDisplayer = document.createElement('div');
        mainViewDisplayer.className = 'teaching-aids-plugin-main-view-displayer';
        mainViewContainer.appendChild(mainViewDisplayer);
        this.eventTragetElement = mainViewContainer.children[0] as HTMLDivElement;
        this.containerOffset = this.getContainerOffset( this.eventTragetElement,this.containerOffset);
        this.bindToolsClass();
        ReactDOM.render(<BaseViewDisplayer viewId={this.viewId} maranger={this} refs={{
            canvasFloatRef: this.canvasFloatRef,
            canvasBgRef: this.canvasBgRef,
            floatBarRef: this.floatBarRef,
            floatBarCanvasRef:this.floatBarCanvasRef
        }}/>, mainViewDisplayer);
        if (this.control.room) {
            this.bindDisplayerEvent(this.eventTragetElement);
        }
        return this;
    }
}