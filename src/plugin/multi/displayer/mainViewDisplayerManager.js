import ReactDOM from "react-dom";
import React from "react";
import { MainViewDisplayerManager } from "../../baseViewContainerManager";
import { getRatioWithContext } from "../../../core/utils";
import { BaseViewDisplayer } from "../../displayerView";
export class MainViewMultiDisplayerManager extends MainViewDisplayerManager {
    constructor(control, internalMsgEmitter) {
        super(control, internalMsgEmitter);
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
        Object.defineProperty(this, "dpr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
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
        Object.defineProperty(this, "canvasServiceFloatRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
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
            const width = this.eventTragetElement.offsetWidth || this.width;
            const height = this.eventTragetElement.offsetHeight || this.height;
            if (width && height && this.canvasBgRef.current) {
                this.dpr = getRatioWithContext(this.canvasBgRef.current.getContext('2d'));
                this.width = width;
                this.height = height;
                this.canvasBgRef.current.style.width = `${width}px`;
                this.canvasBgRef.current.style.height = `${height}px`;
                this.canvasBgRef.current.width = width * this.dpr;
                this.canvasBgRef.current.height = height * this.dpr;
                if (this.canvasFloatRef.current) {
                    this.canvasFloatRef.current.style.width = `${width}px`;
                    this.canvasFloatRef.current.style.height = `${height}px`;
                    this.canvasFloatRef.current.width = width * this.dpr;
                    this.canvasFloatRef.current.height = height * this.dpr;
                }
                if (this.canvasServiceFloatRef.current) {
                    this.canvasServiceFloatRef.current.style.width = `${width}px`;
                    this.canvasServiceFloatRef.current.style.height = `${height}px`;
                    this.canvasServiceFloatRef.current.width = width * this.dpr;
                    this.canvasServiceFloatRef.current.height = height * this.dpr;
                }
            }
        }
    }
    destroy() {
        super.destroy();
        if (this.eventTragetElement) {
            const container = this.eventTragetElement.parentElement;
            if (container) {
                const mainViewNode = container.querySelectorAll('.teaching-aids-plugin-main-view-displayer');
                for (const item of mainViewNode) {
                    item.remove();
                }
            }
        }
    }
    createMainViewDisplayer(mainViewContainer) {
        const mainViewDisplayer = document.createElement('div');
        mainViewDisplayer.className = 'teaching-aids-plugin-main-view-displayer';
        mainViewContainer.appendChild(mainViewDisplayer);
        this.eventTragetElement = mainViewContainer.children[0];
        this.containerOffset = this.getContainerOffset(this.eventTragetElement, this.containerOffset);
        this.bindToolsClass();
        ReactDOM.render(React.createElement(BaseViewDisplayer, { viewId: this.viewId, maranger: this, refs: {
                canvasServiceFloatRef: this.canvasServiceFloatRef,
                canvasFloatRef: this.canvasFloatRef,
                canvasBgRef: this.canvasBgRef,
                floatBarRef: this.floatBarRef,
                floatBarCanvasRef: this.floatBarCanvasRef
            } }), mainViewDisplayer);
        if (this.control.room) {
            this.bindDisplayerEvent(this.eventTragetElement);
        }
        return this;
    }
}
