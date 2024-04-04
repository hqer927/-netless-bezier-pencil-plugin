/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from "react-dom";
import React from "react";
import { BaseViewDisplayer } from "../../displayerView";
import { AppViewDisplayerManager } from "../../baseViewContainerManager";
import { getRatioWithContext } from "../../../core/utils";
export class AppViewDisplayerManagerImpl extends AppViewDisplayerManager {
    constructor(viewId, control, internalMsgEmitter) {
        super(viewId, control, internalMsgEmitter);
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "vDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventTragetElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canvasFloatRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        Object.defineProperty(this, "canvasBgRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        Object.defineProperty(this, "floatBarRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        Object.defineProperty(this, "floatBarCanvasRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        Object.defineProperty(this, "containerOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
    }
    setCanvassStyle() {
        if (this.eventTragetElement) {
            if (this.canvasBgRef.current) {
                this.dpr = getRatioWithContext(this.canvasBgRef.current.getContext('2d'));
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
    createAppViewDisplayer(viewId, appViewContainer) {
        const appViewDisplayer = document.createElement('div');
        appViewDisplayer.className = 'teaching-aids-plugin-app-view-displayer';
        appViewContainer.appendChild(appViewDisplayer);
        this.eventTragetElement = appViewContainer.children[0];
        this.containerOffset = this.getContainerOffset(this.eventTragetElement, this.containerOffset);
        this.bindToolsClass();
        ReactDOM.render(React.createElement(BaseViewDisplayer, { viewId: viewId, maranger: this, refs: {
                canvasFloatRef: this.canvasFloatRef,
                canvasBgRef: this.canvasBgRef,
                floatBarRef: this.floatBarRef,
                floatBarCanvasRef: this.floatBarCanvasRef
            } }), appViewDisplayer);
        this.bindDisplayerEvent(this.eventTragetElement);
        return this;
    }
}
