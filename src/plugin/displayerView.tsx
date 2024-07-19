/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import React, { ReactNode } from "react";
import { EmitEventType, ApplianceViewManagerLike } from "./types";
import { TextEditorInfo } from "../component/textEditor";
import { ShowFloatBarMsgValue } from "../displayer/types";
import { TextEditorContainer } from "../component/textEditor/view";
import { FloatBar } from "../displayer/floatBar";
import { CursorManager } from '../displayer/cursor';
import cloneDeep from 'lodash/cloneDeep';

export interface BaseDisplayerProps {
    viewId: string;
    maranger: ApplianceViewManagerLike;
    refs: {
        snapshotContainerRef?: React.RefObject<HTMLDivElement>;
        canvasContainerRef: React.RefObject<HTMLDivElement>;
        canvasServiceFloatRef: React.RefObject<HTMLCanvasElement>;
        canvasFloatRef: React.RefObject<HTMLCanvasElement>;
        canvasBgRef: React.RefObject<HTMLCanvasElement>;
        canvasTopRef: React.RefObject<HTMLCanvasElement>;
        floatBarRef: React.RefObject<HTMLDivElement>;
    }
}
export interface BaseDisplayerState {
    showFloatBar: boolean;
    floatBarData?: ShowFloatBarMsgValue;
    dpr: number;
    operationType: EmitEventType;
    angle: number;
    scale:[number,number];
    editors?: Map<string,TextEditorInfo>;
    activeTextId?:string;
}
export const DisplayerContext = React.createContext<Pick<BaseDisplayerState, 'floatBarData' | 'dpr' | 'angle' | 'operationType' | 'scale'> & {
    maranger?: ApplianceViewManagerLike;
    floatBarColors:[number, number, number][];
    setAngle: (angle:number) => void;
    setOperationType:(type:EmitEventType)=>void;
    setFloatBarData:(data:Partial<ShowFloatBarMsgValue>)=>void;
}>({
    maranger: undefined,
    floatBarColors:[],
    floatBarData: undefined,
    dpr: 1,
    angle: 0,
    operationType: EmitEventType.None,
    scale:[1,1],
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
            dpr: 1,
            angle:0,
            operationType: EmitEventType.None,
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
            angle: 0
        })
    }
    setActiveTextEditor(activeTextId?:string): void {
        this.setState({
            activeTextId,
            editors:this.editors
        })
    }
    setFloatBarData(data:Partial<ShowFloatBarMsgValue>){
        this.state.floatBarData && this.setState({
            floatBarData: {...this.state.floatBarData, ...data}
        })
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
            <div className={styles['Container']}>
                {
                    !this.props.maranger.control.hasOffscreenCanvas() && <div className={styles['CanvasBox']} ref={this.props.refs.canvasContainerRef}></div> || 
                        <div className={styles['CanvasBox']}
                            onMouseDown={(e)=>{
                                if (e.cancelable) {
                                    e.preventDefault();
                                }
                                e.stopPropagation();
                            }}
                            onTouchStart={(e)=>{
                                e.stopPropagation();
                            }}
                            onMouseMove={(e)=>{
                                this.props.maranger.cursorMouseMove(e as unknown as MouseEvent);
                            }}
                        >
                            <canvas id='bgCanvas' ref={this.props.refs.canvasBgRef} style={{width:'100%',height:'100%'}}/>
                            <canvas id='serviceCanvas' className={styles['FloatCanvas']} ref={this.props.refs.canvasServiceFloatRef} style={{width:'100%',height:'100%'}}/>
                            <canvas id='localCanvas' className={styles['FloatCanvas']} ref={this.props.refs.canvasFloatRef} style={{width:'100%',height:'100%'}}/>
                            <canvas id='topCanvas' className={styles['TopFloatCanvas']} ref={this.props.refs.canvasTopRef} style={{width:'100%',height:'100%'}}/>
                        </div> 
                }
                {
                    !this.props.maranger.control.hasOffscreenCanvas() && this.props.refs.snapshotContainerRef && <div className={styles['SnapshotBox']} ref={this.props.refs.snapshotContainerRef}></div>  || null
                }
                <DisplayerContext.Provider value={{
                    maranger: this.props.maranger,
                    floatBarColors: showFloatBtns && (this.props.maranger.control?.room as any)?.floatBarOptions?.colors || [],
                    floatBarData: this.state.floatBarData, 
                    dpr: this.state.dpr,
                    angle:this.state.angle,
                    operationType: this.state.operationType,
                    scale: this.state.scale,
                    setAngle:this.setAngle.bind(this),
                    setOperationType:this.setOperationType.bind(this),
                    setFloatBarData:this.setFloatBarData.bind(this),
                }}>
                    {   
                        this.state.showFloatBar && 
                            <FloatBar 
                                ref={this.props.refs.floatBarRef}
                                editors={this.state.editors}
                                activeTextId={this.state.activeTextId}
                            /> || null
                    }
                    {
                        this.state.editors?.size && 
                            <TextEditorContainer className={styles['TextEditorContainer']} 
                                showFloatBtns= {showFloatBtns}
                                manager={this.props.maranger}
                                selectIds={this.state.floatBarData?.selectIds || []}
                                editors={this.state.editors}
                                activeTextId={this.state.activeTextId}
                            /> || null
                    }
                </DisplayerContext.Provider>
                <CursorManager className={styles['CursorBox']} manager={this.props.maranger}/>
            </div>
        );
    }
}