/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import React, { ReactNode } from "react";
import type { RoomMember } from "white-web-sdk";
import { EmitEventType, TeachingAidsViewManagerLike } from "./types";
import { TextEditorInfo } from "../component/textEditor";
import { EScaleType, EvevtWorkState } from "../core";
import { ShowFloatBarMsgValue } from "../displayer/types";
import { TextEditorContainer } from "../component/textEditor/view";
import { FloatBar } from "../displayer/floatBar";
import { RotateBtn } from "../displayer/rotate";
import { CursorManager } from '../displayer/cursor';
import { ResizableBox, ResizableTwoBox } from '../displayer/resizable';

export interface BaseDisplayerProps {
    viewId: string;
    maranger: TeachingAidsViewManagerLike;
    refs: {
        canvasFloatRef: React.RefObject<HTMLCanvasElement>;
        canvasBgRef: React.RefObject<HTMLCanvasElement>;
        floatBarRef: React.RefObject<HTMLDivElement>;
        floatBarCanvasRef: React.RefObject<HTMLCanvasElement>;
    }
}
export interface BaseDisplayerState {
    showFloatBar: boolean;
    zIndex: number;
    floatBarData?: ShowFloatBarMsgValue;
    dpr: number;
    position?: {x:number, y:number},
    operationType: EmitEventType;
    angle: number;
    cursorInfo?: {x?:number, y?:number, roomMember?: RoomMember},
    scale:[number,number];
    editors?: Map<string,TextEditorInfo>;
    activeTextId?:string;
}
export const DisplayerContext = React.createContext<Pick<BaseDisplayerState, 'zIndex' | 'floatBarData' | 'dpr' | 'angle' | 'position' | 'operationType' | 'scale'> & {
    maranger?: TeachingAidsViewManagerLike;
    floatBarColors:[number, number, number][];
    setPosition: (point:{x:number, y:number}) => void;
    setSize: (size:{width:number, height:number, workState:EvevtWorkState}) => void;
    setAngle: (angle:number) => void;
    setOperationType:(type:EmitEventType)=>void;
    setFloatBarData:(data:Partial<ShowFloatBarMsgValue>)=>void;
}>({
    maranger: undefined,
    floatBarColors:[],
    floatBarData: undefined,
    zIndex: -1,
    dpr: 1,
    position: undefined,
    angle: 0,
    operationType: EmitEventType.None,
    scale:[1,1],
    setPosition: () => {},
    setSize:()=>{},
    setAngle:()=>{},
    setOperationType:()=>{},
    setFloatBarData:()=>{}
});
export class BaseViewDisplayer extends React.Component<BaseDisplayerProps, BaseDisplayerState>  {
    constructor(props: BaseDisplayerProps) {
        super(props);
        this.state = {
            floatBarData: undefined,
            showFloatBar: false,
            zIndex: -1,
            dpr: 1,
            position: undefined,
            angle:0,
            operationType: EmitEventType.None,
            cursorInfo: undefined,
            scale:[1,1],
            editors: this.props.maranger.control.textEditorManager?.editors,
            activeTextId: this.props.maranger.control.textEditorManager?.activeId
        };
    }
    componentDidMount(): void {
        this.props.maranger.vDom = this;
        this.props.maranger.mountView();
        this.setState({dpr:this.props.maranger.dpr});
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ShowFloatBar], this.showFloatBar.bind(this));
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.FloatBar, EmitEventType.ZIndexFloatBar], this.setFloatZIndex.bind(this));
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.Cursor, EmitEventType.ActiveCursor], this.setActiveCursor.bind(this));
        // this.props.maranger.internalMsgEmitter.on([InternalMsgEmitterType.TextEditor,EmitEventType.CommandEditor],this.bindTextEditorEvent.bind(this));
    }
    componentWillUnmount(): void {}
    showFloatBar(show: boolean, value?: Partial<ShowFloatBarMsgValue>) {
        const floatBarData = (show && value && {...this.state.floatBarData, ...value} as ShowFloatBarMsgValue) || undefined;
        this.setState({
            showFloatBar: show,
            floatBarData, 
            position: floatBarData && {x: floatBarData.x, y: floatBarData.y}, 
            angle: 0
        })
        if (floatBarData && this.props.refs.floatBarCanvasRef.current) {
            if (floatBarData.canvasHeight && floatBarData.canvasWidth) {
                this.props.refs.floatBarCanvasRef.current.width = floatBarData.canvasWidth * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.height = floatBarData.canvasHeight * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.style.width = floatBarData.canvasWidth+'px';
                this.props.refs.floatBarCanvasRef.current.style.height = floatBarData.canvasHeight+'px';
            } else {
                this.props.refs.floatBarCanvasRef.current.width = floatBarData.w * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.height = floatBarData.h * this.state.dpr;
                this.props.refs.floatBarCanvasRef.current.style.width = '100%';
                this.props.refs.floatBarCanvasRef.current.style.height = '100%';
            }
        }
    }
    setActiveTextEditor(activeTextId?:string): void {
        this.setState({
            activeTextId,
            editors: this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId)
        })
    }
    setActiveCursor(cursorInfo?: { x?: number; y?: number, roomMember?: RoomMember }) {
        this.setState({cursorInfo});
    }
    setSize(scale:{width:number, height:number, workState:EvevtWorkState}) {
        if (scale.workState === EvevtWorkState.Done) {
            this.state.floatBarData && this.setState({
                floatBarData:{...this.state.floatBarData, w: scale.width, h: scale.height}, 
                scale:[1,1], 
                operationType: EmitEventType.None,
            })
        } else {
            this.state.floatBarData && this.setState({
                floatBarData:{...this.state.floatBarData, w: scale.width, h: scale.height}, 
                scale:[1,1], 
                operationType: EmitEventType.ScaleNode,
            })
        }
    }
    setFloatZIndex(zIndex: number) {
        this.setState({zIndex})
    }
    setFloatBarData(data:Partial<ShowFloatBarMsgValue>){
        this.state.floatBarData && this.setState({
            floatBarData: {...this.state.floatBarData, ...data}
        })
    }
    private setPosition = (point:{x:number,y:number}) => {
        this.setState({position:point});
    }
    private setAngle = (angle:number) => {
        this.setState({angle:angle});
    }
    private setOperationType = (type:EmitEventType) => {
        this.setState({operationType: type})
    }
    render(): ReactNode {
        return (
            <React.Fragment>
                <div className={styles['Container']} 
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onTouchStart={(e)=>{
                        e.stopPropagation();
                    }}
                    onMouseMove={(e)=>{
                        this.props.maranger.cursorMouseMove(e as unknown as MouseEvent);
                    }}
                >
                    <div className={styles['CanvasBox']}>
                        <canvas className={styles['FloatCanvas']} ref={this.props.refs.canvasFloatRef}/>
                        <canvas ref={this.props.refs.canvasBgRef}/>
                    </div>
                    <DisplayerContext.Provider value={{
                            maranger: this.props.maranger,
                            floatBarColors: (this.props.maranger.control?.room as any)?.floatBarOptions?.colors || [],
                            floatBarData: this.state.floatBarData, 
                            zIndex: this.state.zIndex,
                            dpr: this.state.dpr,
                            position: this.state.position,
                            angle:this.state.angle,
                            operationType: this.state.operationType,
                            scale: this.state.scale,
                            setPosition: this.setPosition.bind(this),
                            setSize: this.setSize.bind(this),
                            setAngle:this.setAngle.bind(this),
                            setOperationType:this.setOperationType.bind(this),
                            setFloatBarData:this.setFloatBarData.bind(this),
                        }}>
                        {   
                            this.state.showFloatBar && 
                            <FloatBar className={styles['FloatBar']} 
                                ref={this.props.refs.floatBarCanvasRef} 
                                editors={this.state.editors}
                                activeTextId={this.state.activeTextId}
                            />
                        }
                        {
                            this.state.editors?.size && 
                                <TextEditorContainer className={styles['TextEditorContainer']} 
                                    manager={this.props.maranger}
                                    selectIds={this.state.floatBarData?.selectIds || []}
                                    editors={this.state.editors}
                                    activeTextId={this.state.activeTextId}
                                />
                        }
                        { 
                            this.state.floatBarData?.canRotate && this.state.floatBarData?.selectIds?.length === 1 && 
                            (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.RotateNode) &&
                            <RotateBtn className={styles['RotateBtn']}  />
                        }
                        { 
                            this.state.floatBarData?.scaleType === EScaleType.all && this.state.showFloatBar && 
                            (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.ScaleNode) && 
                            <ResizableBox className={styles['ResizeBtn']} />
                        }
                        { 
                            this.state.floatBarData?.scaleType === EScaleType.both && this.state.showFloatBar && 
                            (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.SetPoint) && 
                            <ResizableTwoBox className={styles['ResizeTowBox']} />
                        }
                    </DisplayerContext.Provider>
                    {
                        this.state.cursorInfo && this.state.cursorInfo.roomMember && (<CursorManager key={this.state.cursorInfo.roomMember.memberId} className={styles['CursorBox']} info={this.state.cursorInfo}/> || null)
                    }
                </div>
            </React.Fragment>
        );
    }
}