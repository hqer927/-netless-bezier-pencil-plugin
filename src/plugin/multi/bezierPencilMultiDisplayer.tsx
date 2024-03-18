/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { ReactNode } from "react";
import styles from '../index.module.less';
import { DisplayStateEnum, EmitEventType, InternalMsgEmitterType} from "../types";
import { FloatBar } from "../../displayer/floatBar";
import { EventEmitter2 } from "eventemitter2";
import { ShowFloatBarMsgValue } from "../../displayer/types";
import { EvevtWorkState } from "../../core";
import { RotateBtn } from "../../displayer/rotate";
import { CursorManager } from "../../displayer/cursor";
import { RoomMember } from "white-web-sdk";
import throttle from "lodash/throttle";
import { BezierPencilManager } from "./bezierPencilMultiManager";

interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
    showFloatBar: boolean;
    zIndex: number;
    floatBarData?: ShowFloatBarMsgValue;
    dpr: number;
    position?: {x:number, y:number},
    angle: number;
    isRotating: boolean;
    showRotateBtn: boolean;
    showFloatBarBtn: boolean;
    cursorInfo?: {x?:number, y?:number, roomMember?: RoomMember}[]
}
export const DisplayerContext = React.createContext<Pick<DisplayerState, 'zIndex' | 'floatBarData' | 'dpr' | 'angle' | 'position' | 'isRotating' | 'showFloatBarBtn'> & {
    floatBarColors:[number, number, number][];
    InternalMsgEmitter: EventEmitter2|undefined;
    setPosition: (point:{x:number, y:number}) => void;
    setSize: (size:{ width:number, height:number, workState:EvevtWorkState}) => void;
    setAngle: (angle:number) => void;
    setRotateState: (isRotation:boolean)=>void;
    setShowRotateBtn:(show:boolean)=>void;
    setShowFloatBarBtn:(show:boolean)=>void;
}>({
    floatBarColors:[],
    InternalMsgEmitter: undefined, 
    floatBarData: undefined,
    zIndex: -1,
    dpr: 1,
    position: undefined,
    angle: 0,
    isRotating: false,
    showFloatBarBtn: false,
    setPosition: () => {},
    setSize:()=>{},
    setAngle:()=>{},
    setRotateState:()=>{},
    setShowRotateBtn:()=>{},
    setShowFloatBarBtn:()=>{},
});
export class BezierPencilDisplayer extends React.Component<DisplayerProps, DisplayerState> {
    static isRoom: boolean = true;
    static instance: BezierPencilDisplayer;
    static floatBarColors: [number, number, number][] = [];
    public containerRef: HTMLDivElement | null = null;
    public canvasFloatRef: HTMLCanvasElement | null = null;
    public canvasBgRef: HTMLCanvasElement | null = null;
    public floatBarRef: HTMLDivElement | null = null;
    public floatBarCanvasRef = React.createRef<HTMLCanvasElement>();
    public containerOffset: { x: number; y: number } = { x: 0, y: 0 };
    public constructor(props: DisplayerProps) {
        super(props);
        this.state = {
            showRotateBtn: false,
            floatBarData: undefined,
            showFloatBar: false,
            zIndex: -1,
            dpr: 1,
            position: undefined,
            angle:0,
            isRotating:false,
            showFloatBarBtn: false,
            cursorInfo: undefined
        };
    }
    private showFloatBar(show: boolean, value?: ShowFloatBarMsgValue) {
        const floatBarData = show && value && {...this.state.floatBarData, ...value} || undefined;
        this.setState({
            showFloatBar: show,
            floatBarData, 
            position: value && {x: value.x, y: value.y}, 
            angle: 0, 
            showRotateBtn: show,
            showFloatBarBtn: true,
        })
        if (value && this.floatBarCanvasRef.current) {
            if (value.canvasHeight && value.canvasWidth) {
                this.floatBarCanvasRef.current.width = value.canvasWidth * this.state.dpr;
                this.floatBarCanvasRef.current.height = value.canvasHeight * this.state.dpr;
                this.floatBarCanvasRef.current.style.width = value.canvasWidth+'px';
                this.floatBarCanvasRef.current.style.height = value.canvasHeight+'px';
            } else {
                this.floatBarCanvasRef.current.width = value.w * this.state.dpr;
                this.floatBarCanvasRef.current.height = value.h * this.state.dpr;
                this.floatBarCanvasRef.current.style.width = '100%';
                this.floatBarCanvasRef.current.style.height = '100%';
            }
        }
    }
    private setSize(scale:{ width:number, height:number, workState:EvevtWorkState}) {
        this.state.floatBarData && this.setState({floatBarData:{...this.state.floatBarData, w: scale.width, h: scale.height}})
    }
    private setFloatZIndex(zIndex: number) {
        this.setState({zIndex})
    }
    componentDidMount(): void {
        BezierPencilDisplayer.instance = this;
        BezierPencilManager.InternalMsgEmitter.on(InternalMsgEmitterType.DisplayContainer,this.init.bind(this));
        BezierPencilManager.InternalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
        BezierPencilManager.InternalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], this.setFloatZIndex.bind(this));
        BezierPencilManager.InternalMsgEmitter.on([InternalMsgEmitterType.Cursor, EmitEventType.ActiveCursor], this.setActiveCursor.bind(this));
        BezierPencilManager.InternalMsgEmitter.emit(InternalMsgEmitterType.DisplayState, DisplayStateEnum.mounted);
    }
    componentWillUnmount(): void {
        BezierPencilManager.InternalMsgEmitter.emit(InternalMsgEmitterType.DisplayState, DisplayStateEnum.unmounted);
        const div = BezierPencilDisplayer.instance?.containerRef;
        if (div) {
            const eventTraget = div.parentNode?.children[0] as HTMLDivElement;
            BezierPencilDisplayer.isRoom && this.removeDisplayerEvent(eventTraget);
        }
        BezierPencilManager.InternalMsgEmitter.removeAllListeners();
    }
    private setActiveCursor(cursorInfo?: { x?: number; y?: number, roomMember?: RoomMember }[]) {
        this.setState({cursorInfo});
    }
    private getRatioWithContext(context: CanvasRenderingContext2D): number {
        const backingStoreRatio = (context as any).webkitBackingStorePixelRatio ||
            (context as any).mozBackingStorePixelRatio ||
            (context as any).msBackingStorePixelRatio ||
            (context as any).oBackingStorePixelRatio ||
            (context as any).backingStorePixelRatio || 1.0;
        return Math.max(1.0, (window.devicePixelRatio || 1.0) / backingStoreRatio);
    }
    private init() {
        const div = this.containerRef;
        const floatCanvas = this.canvasFloatRef;
        const bgCanvas = this.canvasBgRef;
        if (div && floatCanvas && bgCanvas) {
            const width = div.offsetWidth;
            const height = div.offsetHeight;
            if (width && height) {
                floatCanvas.style.width = `${width}px`;
                floatCanvas.style.height = `${height}px`;
                bgCanvas.style.width = `${width}px`;
                bgCanvas.style.height = `${height}px`;
                const dpr = this.getRatioWithContext(bgCanvas.getContext('2d') as CanvasRenderingContext2D)
                floatCanvas.width = width * dpr;
                floatCanvas.height = height * dpr;
                bgCanvas.width = width * dpr;
                bgCanvas.height = height * dpr;
                BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.CreateScene], div.offsetWidth, div.offsetHeight, dpr);
                if (BezierPencilDisplayer.isRoom) {
                    const eventTraget = div.parentNode?.children[0] as HTMLDivElement;
                    if (eventTraget) {
                        this.containerOffset = this.getContainerOffset(div,this.containerOffset);
                        this.bindDisplayerEvent(eventTraget);
                    }
                }
                this.setState({dpr});
            }
        }
    }
    private getContainerOffset(eventTraget: HTMLDivElement, offset: { x: number; y: number })  {
        let newOffset = {
            x: offset.x + eventTraget.offsetLeft,
            y: offset.y + eventTraget.offsetTop,
        };
        if (eventTraget.offsetParent?.nodeName && eventTraget.offsetParent.nodeName !== 'BODY') {
            newOffset = this.getContainerOffset(eventTraget.offsetParent as HTMLDivElement, newOffset);
        }
        return newOffset;
    }
    private mousedown = (e:MouseEvent) =>{
        if (e.button === 0) {
            BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
        }
    }
    private mousemove = (e:MouseEvent) =>{
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
    }
    private mouseup = (e:MouseEvent) =>{
        if (e.button === 0) {
            BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
        }
    }

    private touchstart = (e:TouchEvent) =>{
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Start, [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y]);
    }
    private touchmove = throttle((e:TouchEvent) =>{
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Doing, [e.targetTouches[0].pageX - this.containerOffset.x, e.targetTouches[0].pageY - this.containerOffset.y]);
    }, 20, {'leading':false})
    private touchend = (e:TouchEvent) =>{
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.MainEngine, EmitEventType.OriginalEvent], EvevtWorkState.Done, [e.changedTouches[0].pageX - this.containerOffset.x, e.changedTouches[0].pageY - this.containerOffset.y]);
    }

    private cursorMouseMove = throttle((e:MouseEvent) => {
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], [e.pageX - this.containerOffset.x, e.pageY - this.containerOffset.y]);
    }, 20, {'leading':false})
    private cursorMouseLeave = throttle(() =>{
        BezierPencilManager.InternalMsgEmitter.emit([InternalMsgEmitterType.Cursor, EmitEventType.MoveCursor], [undefined,undefined]);
    }, 20, {'leading':false})

    private bindDisplayerEvent(div:HTMLDivElement) {
        div.addEventListener('mousedown',this.mousedown, false);
        div.addEventListener('touchstart',this.touchstart, false);

        window.addEventListener('mouseleave',this.mouseup, false);
        window.addEventListener('mousemove',this.mousemove, false);
        window.addEventListener('mouseup',this.mouseup, false);

        window.addEventListener('touchmove',this.touchmove, false);
        window.addEventListener('touchend',this.touchend, false);

        div.addEventListener('mousemove',this.cursorMouseMove, false);
        div.addEventListener('mouseleave',this.cursorMouseLeave, false);
    }
    private removeDisplayerEvent(div:HTMLDivElement) {
        div.removeEventListener('mousedown',this.mousedown);
        div.removeEventListener('touchstart',this.touchstart);

        window.removeEventListener('mouseleave',this.mouseup);
        window.removeEventListener('mousemove',this.mousemove);
        window.removeEventListener('mouseup',this.mouseup);
        
        window.removeEventListener('touchmove',this.touchmove);
        window.removeEventListener('touchend',this.touchend);

        div.addEventListener('mousemove',this.cursorMouseMove);
        div.addEventListener('mouseleave',this.cursorMouseLeave);

    }
    private setPosition = (point:{x:number,y:number}) => {
        this.setState({position:point});
    }
    private setAngle = (angle:number) => {
        this.setState({angle:angle});
    }
    private setRotateState = (isRotating:boolean) => {
        this.setState({isRotating});
    }
    private setShowRotateBtn = (isShow:boolean) => {
        this.setState({showRotateBtn: isShow})
    }
    private setShowFloatBarBtn = (isShow:boolean) => {
        this.setState({showFloatBarBtn: isShow})
    }
    render(): ReactNode {
        return (
            <React.Fragment>
                {this.props.children}
                <div id="bezier-pencil-plugin" className={styles['Container']} 
                    ref={(ref) => this.containerRef = ref}
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onTouchStart={(e)=>{
                        e.stopPropagation();
                    }}
                >
                    <div className={styles['CanvasBox']}>
                        <canvas id="bezier-pencil-float-canvas" className={styles['FloatCanvas']} ref={(ref) => this.canvasFloatRef = ref}/>
                        <canvas id="bezier-pencil-bg-canvas" ref={(ref) => this.canvasBgRef = ref}/>
                    </div>
                    <DisplayerContext.Provider value={{ 
                            InternalMsgEmitter: BezierPencilManager.InternalMsgEmitter, 
                            floatBarColors: BezierPencilDisplayer.floatBarColors,
                            floatBarData: this.state.floatBarData, 
                            zIndex: this.state.zIndex,
                            dpr: this.state.dpr,
                            position: this.state.position,
                            angle:this.state.angle,
                            isRotating: this.state.isRotating,
                            showFloatBarBtn: this.state.showFloatBarBtn,
                            setPosition: this.setPosition.bind(this),
                            setSize: this.setSize.bind(this),
                            setAngle:this.setAngle.bind(this),
                            setRotateState:this.setRotateState.bind(this),
                            setShowRotateBtn:this.setShowRotateBtn.bind(this),
                            setShowFloatBarBtn:this.setShowFloatBarBtn.bind(this)
                        }}>
                        { this.state.showFloatBar && <FloatBar className={styles['FloatBar']} ref={this.floatBarCanvasRef}/>}
                        { this.state.showFloatBarBtn && this.state.showRotateBtn && this.state.floatBarData?.selectIds?.length === 1 && <RotateBtn className={styles['RotateBtn']}  />}
                    </DisplayerContext.Provider>
                    {
                        this.state.cursorInfo?.map((info)=>{
                            if (info.roomMember) {
                                return <CursorManager key={info.roomMember.memberId} className={styles['CursorBox']} info={info}/>
                            }
                            return null
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}