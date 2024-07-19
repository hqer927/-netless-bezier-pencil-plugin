/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import ReactDOM from "react-dom";
import React from "react";
import { ApplianceMultiManager } from "../applianceMultiManager";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { getRatioWithContext } from "../../../core/utils";
import { BaseViewDisplayer } from "../../displayerView";

export class MainViewMultiDisplayerManager extends MainViewDisplayerManager {
    width: number = 1000;
    height: number = 1000;
    dpr: number = 1;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    snapshotContainerRef?: React.RefObject<HTMLDivElement>;
    canvasContainerRef = React.createRef<HTMLDivElement>();
    canvasTopRef = React.createRef<HTMLCanvasElement>();
    canvasServiceFloatRef = React.createRef<HTMLCanvasElement>();
    canvasFloatRef = React.createRef<HTMLCanvasElement>();
    canvasBgRef = React.createRef<HTMLCanvasElement>();
    floatBarRef = React.createRef<HTMLDivElement>();
    containerOffset: { x: number; y: number } = { x: 0, y: 0 };
    constructor(control: ApplianceMultiManager, internalMsgEmitter:EventEmitter2) {
        super(control,internalMsgEmitter);
        if (!this.control.hasOffscreenCanvas()) {
            this.snapshotContainerRef = React.createRef<HTMLDivElement>();
        }
    }
    setCanvassStyle() {
        if (this.eventTragetElement) {
            const width = this.eventTragetElement.offsetWidth || this.width;
            const height = this.eventTragetElement.offsetHeight || this.height;
            if (width && height && this.canvasContainerRef.current && (width !== this.width || height !== this.height)) {
                this.dpr = getRatioWithContext();
                this.width = width;
                this.height = height;
                this.canvasContainerRef.current.style.width = `${width}px`;
                this.canvasContainerRef.current.style.height = `${height}px`;
            }
            if (width && height && this.snapshotContainerRef && this.snapshotContainerRef.current&& (width !== this.width || height !== this.height)) {
                this.dpr = getRatioWithContext();
                this.width = width;
                this.height = height;
            }
            if (width && height && this.canvasBgRef.current && (width !== this.width || height !== this.height)) {
                this.dpr = getRatioWithContext(this.canvasBgRef.current.getContext('2d') as CanvasRenderingContext2D);
                this.width = width;
                this.height = height;
                this.canvasBgRef.current.width = width * this.dpr;
                this.canvasBgRef.current.height = height * this.dpr;
                if(this.canvasFloatRef.current){
                    this.canvasFloatRef.current.width = width * this.dpr;
                    this.canvasFloatRef.current.height = height * this.dpr;
                }
                if (this.canvasServiceFloatRef.current) {
                    this.canvasServiceFloatRef.current.width = width * this.dpr;
                    this.canvasServiceFloatRef.current.height = height * this.dpr;
                }
                if (this.canvasTopRef.current) {
                    this.canvasTopRef.current.width = width * this.dpr;
                    this.canvasTopRef.current.height = height * this.dpr;
                }
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
        this.containerOffset = this.getContainerOffset(this.eventTragetElement,this.containerOffset);
        this.bindToolsClass();
        ReactDOM.render(<BaseViewDisplayer viewId={this.viewId} maranger={this} refs={{
            canvasServiceFloatRef: this.canvasServiceFloatRef,
            canvasFloatRef: this.canvasFloatRef,
            canvasBgRef: this.canvasBgRef,
            floatBarRef: this.floatBarRef,
            canvasTopRef: this.canvasTopRef,
            canvasContainerRef: this.canvasContainerRef,
            snapshotContainerRef: this.snapshotContainerRef
        }}/>, mainViewDisplayer);
        if (this.control.room) {
            this.bindDisplayerEvent(this.eventTragetElement);
        }
        return this;
    }
}