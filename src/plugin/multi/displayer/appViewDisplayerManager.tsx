/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from "react-dom";
import React from "react";
import { BaseViewDisplayer } from "../../displayerView";
import { AppViewDisplayerManager } from "../../baseViewContainerManager";
import { EventEmitter2 } from "eventemitter2";
import { ApplianceMultiManager } from "../applianceMultiManager";
import { getRatioWithContext } from "../../../core/utils";

export class AppViewDisplayerManagerImpl extends AppViewDisplayerManager {
    dpr: number = 1;
    width: number = 1000;
    height: number = 1000;
    vDom?: BaseViewDisplayer;
    eventTragetElement?: HTMLDivElement;
    canvasContainerRef = React.createRef<HTMLDivElement>();
    canvasTopRef = React.createRef<HTMLCanvasElement>();
    canvasServiceFloatRef = React.createRef<HTMLCanvasElement>();
    canvasFloatRef = React.createRef<HTMLCanvasElement>();
    canvasBgRef = React.createRef<HTMLCanvasElement>();
    floatBarRef = React.createRef<HTMLDivElement>();
    containerOffset: { x: number; y: number } = { x: 0, y: 0 };
    constructor(viewId:string, control: ApplianceMultiManager, internalMsgEmitter:EventEmitter2){
        super(viewId, control,internalMsgEmitter);
    }
    setCanvassStyle() {
        if (this.eventTragetElement) {
            if (this.canvasContainerRef.current) {
                const width = this.eventTragetElement.offsetWidth || this.width;
                const height = this.eventTragetElement.offsetHeight || this.height;
                if (width && height && (width !== this.width || height !== this.height)) {
                    this.width = width;
                    this.height = height;
                    this.dpr = getRatioWithContext();
                    this.canvasContainerRef.current.style.width = `${width}px`;
                    this.canvasContainerRef.current.style.height = `${height}px`;
                }
            }
            if (this.canvasBgRef.current) {
                this.dpr = getRatioWithContext(this.canvasBgRef.current.getContext('2d') as CanvasRenderingContext2D);
                const width = this.eventTragetElement.offsetWidth || this.width;
                const height = this.eventTragetElement.offsetHeight || this.height;
                if (width && height && (width !== this.width || height !== this.height)) {
                    this.width = width;
                    this.height = height;
                    // this.canvasBgRef.current.style.width = `${width}px`;
                    // this.canvasBgRef.current.style.height = `${height}px`;
                    this.canvasBgRef.current.width = width * this.dpr;
                    this.canvasBgRef.current.height = height * this.dpr;
                    if (this.canvasFloatRef.current) {
                        // this.canvasFloatRef.current.style.width = `${width}px`;
                        // this.canvasFloatRef.current.style.height = `${height}px`;
                        this.canvasFloatRef.current.width = width * this.dpr;
                        this.canvasFloatRef.current.height = height * this.dpr;
                    }
                    if (this.canvasServiceFloatRef.current) {
                        // this.canvasServiceFloatRef.current.style.width = `${width}px`;
                        // this.canvasServiceFloatRef.current.style.height = `${height}px`;
                        this.canvasServiceFloatRef.current.width = width * this.dpr;
                        this.canvasServiceFloatRef.current.height = height * this.dpr;
                    }
                    if (this.canvasTopRef.current) {
                        // this.canvasTopRef.current.style.width = `${width}px`;
                        // this.canvasTopRef.current.style.height = `${height}px`;
                        this.canvasTopRef.current.width = width * this.dpr;
                        this.canvasTopRef.current.height = height * this.dpr;
                    }
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
            canvasServiceFloatRef: this.canvasServiceFloatRef,
            canvasFloatRef: this.canvasFloatRef,
            canvasBgRef: this.canvasBgRef,
            floatBarRef: this.floatBarRef,
            canvasTopRef: this.canvasTopRef,
            canvasContainerRef: this.canvasContainerRef
        }}/>, appViewDisplayer);
        if (this.control.room) {
            this.bindDisplayerEvent(this.eventTragetElement);
        }
        return this;
    }
}