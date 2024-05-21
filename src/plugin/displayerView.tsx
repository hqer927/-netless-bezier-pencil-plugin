/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import React, { ReactNode } from "react";
// import type { RoomMember } from "./types";
import { EmitEventType, TeachingAidsViewManagerLike } from "./types";
import { TextEditorInfo } from "../component/textEditor";
import { EScaleType } from "../core";
import { ShowFloatBarMsgValue } from "../displayer/types";
import { TextEditorContainer } from "../component/textEditor/view";
import { FloatBar, FloatBarBtn } from "../displayer/floatBar";
import { RotateBtn } from "../displayer/rotate";
import { CursorManager } from '../displayer/cursor';
import { ResizableBox, ResizableTwoBox } from '../displayer/resizable';
import cloneDeep from 'lodash/cloneDeep';

export interface BaseDisplayerProps {
    viewId: string;
    maranger: TeachingAidsViewManagerLike;
    refs: {
        canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
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
    // cursorInfo?: {x?:number, y?:number, roomMember?: RoomMember},
    scale:[number,number];
    editors?: Map<string,TextEditorInfo>;
    activeTextId?:string;
}
export const DisplayerContext = React.createContext<Pick<BaseDisplayerState, 'zIndex' | 'floatBarData' | 'dpr' | 'angle' | 'position' | 'operationType' | 'scale'> & {
    maranger?: TeachingAidsViewManagerLike;
    floatBarColors:[number, number, number][];
    setPosition: (point:{x:number, y:number}) => void;
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
            // cursorInfo: undefined,
            scale:[1,1],
            editors: this.editors,
            activeTextId: this.props.maranger.control.textEditorManager?.activeId
        };
    }
    private get editors(){
        return cloneDeep(this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId))
    }
    componentDidMount(): void {
        this.props.maranger.vDom = this;
        this.props.maranger.mountView();
        this.setState({dpr:this.props.maranger.dpr});
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
        // const editors = cloneDeep(this.props.maranger.control.textEditorManager.filterEditor(this.props.maranger.viewId));
        this.setState({
            activeTextId,
            editors:this.editors
        })
    }
    // setActiveCursor(cursorInfo?: { x?: number; y?: number, roomMember?: RoomMember }) {
    //     // this.setState({cursorInfo});
    // }
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
        const showFloatBtns = !!(this.props.maranger.control?.room as any)?.floatBarOptions;
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
                        <canvas className={styles['FloatCanvas']} ref={this.props.refs.canvasServiceFloatRef}/>
                        <canvas className={styles['FloatCanvas']} ref={this.props.refs.canvasFloatRef}/>
                        <canvas ref={this.props.refs.canvasBgRef}/>
                    </div>
                    <DisplayerContext.Provider value={{
                            maranger: this.props.maranger,
                            floatBarColors: showFloatBtns && (this.props.maranger.control?.room as any)?.floatBarOptions?.colors || [],
                            floatBarData: this.state.floatBarData, 
                            zIndex: this.state.zIndex,
                            dpr: this.state.dpr,
                            position: this.state.position,
                            angle:this.state.angle,
                            operationType: this.state.operationType,
                            scale: this.state.scale,
                            setPosition: this.setPosition.bind(this),
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
                            /> || null
                        }
                        {
                            this.state.editors?.size && 
                                <TextEditorContainer className={styles['TextEditorContainer']} 
                                    showFloatBtns = {showFloatBtns}
                                    manager={this.props.maranger}
                                    selectIds={this.state.floatBarData?.selectIds || []}
                                    editors={this.state.editors}
                                    activeTextId={this.state.activeTextId}
                                /> || null
                        }
                        { 
                            this.state.floatBarData?.canRotate && this.state.floatBarData?.selectIds?.length === 1 && 
                            (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.RotateNode) &&
                            <RotateBtn className={styles['RotateBtn']}  /> || null
                        }
                        { 
                            (this.state.floatBarData?.scaleType === EScaleType.all || this.state.floatBarData?.scaleType === EScaleType.proportional) && this.state.showFloatBar && 
                            (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.ScaleNode) && 
                            <ResizableBox className={styles['ResizeBtn']} /> || null
                        }
                        { 
                            this.state.floatBarData?.scaleType === EScaleType.both && this.state.showFloatBar && 
                            (this.state.operationType === EmitEventType.None || this.state.operationType === EmitEventType.SetPoint) && 
                            <ResizableTwoBox className={styles['ResizeTowBox']} /> || null
                        }
                        {
                            this.state.showFloatBar && showFloatBtns && <FloatBarBtn className={styles['FloatBarBtn']} /> || null
                        }
                    </DisplayerContext.Provider>
                    <CursorManager className={styles['CursorBox']} manager={this.props.maranger}/>

                </div>
            </React.Fragment>
        );
    }
}