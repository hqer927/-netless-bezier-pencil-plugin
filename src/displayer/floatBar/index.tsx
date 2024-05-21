/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useRef, useState } from "react"
import { DisplayerContext } from "../../plugin/displayerView";
import throttle from "lodash/throttle";
import { EScaleType, EvevtWorkState } from "../../core";
import Draggable from 'react-draggable'; 
import type { DraggableData, DraggableEvent } from "react-draggable";
import { FloatBtns } from "../floatBtns";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { HighlightBox, HighlightTwoBox, HighlightFourBox, LockedBox } from "../highlightBox";
import { Storage_Selector_key } from "../../collector";
import { TextViewInSelector } from "../../component/textEditor/view";
import { TextEditorInfo } from "../../component/textEditor";
import isEqual from "lodash/isEqual";

const FloatBarComponent = React.forwardRef((props:{
    className: string,
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
}, ref: React.Ref<HTMLCanvasElement>) => {
    const {floatBarData, zIndex, position, angle, operationType, setPosition, setOperationType, maranger} = useContext(DisplayerContext);
    const {className, editors, activeTextId} = props;
    const textRef = useRef<HTMLDivElement>(null);
    const [workState,setWorkState] = useState<EvevtWorkState>(EvevtWorkState.Pending);
    const [cachePoint, setCachePoint] = useState<{x:number,y:number}>();
    const onDragStartHandler = (e: DraggableEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setOperationType(EmitEventType.TranslateNode);
        setWorkState(EvevtWorkState.Start);
        setCachePoint(position)
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position, workState: EvevtWorkState.Start, viewId:maranger?.viewId})
    }
    const onDragEndHandler = throttle((e: DraggableEvent,
        pos: DraggableData) => {
        e.preventDefault();
        e.stopPropagation();
        const p = {x:pos.x, y:pos.y};
        setPosition(p)
        setOperationType(EmitEventType.None);
        setWorkState(EvevtWorkState.Done);
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        console.log('onDragEndHandler')
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:p, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
    }, 100, {'leading':false})
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        const p = {x:pos.x, y:pos.y};
        if (pos.x !== position?.x || pos.y!== position?.y) {
            setPosition(p);
            setWorkState(EvevtWorkState.Doing);
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:p, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    const HighLightUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.all ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HighlightBox/>
    },[floatBarData, operationType])
    const HighLightTwoUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.both ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HighlightTwoBox/>
    },[floatBarData, operationType])
    const HighLightFourUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.proportional ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HighlightFourBox/>
    },[floatBarData, operationType])
    const LockedUI = useMemo(()=>{
        if ( floatBarData?.scaleType === EScaleType.none && floatBarData?.canLock) {
            return  <LockedBox/>
        }
        return null
    },[floatBarData])
    const TextViewInSelectorUI = useMemo(()=>{
        const selectIds = floatBarData?.selectIds || [];
        if (editors && maranger && selectIds ) {
            // console.log('TextViewInSelectorUI', position, selectIds)
            return <TextViewInSelector
                manager={maranger}
                textRef={textRef}
                selectIds={selectIds}
                position={position}
                activeTextId={activeTextId}
                editors={editors}
            />
        }
        return null
    },[floatBarData?.selectIds, editors, maranger, activeTextId])
    return (
        <Draggable
            disabled={!!floatBarData?.isLocked}
            position={position}
            onStart={onDragStartHandler}
            onDrag={onDragHandler}
            onStop={onDragEndHandler}
            handle="canvas"
        >
            <div className={`${className}`}
                style= { floatBarData ? {
                        width: floatBarData.w,
                        height: floatBarData.h,
                        zIndex,
                        pointerEvents: zIndex < 2 ? 'none' : LockedUI ? 'none' : 'auto',
                    } : undefined
                }
                // onMouseMove={(e)=>{
                //     e.stopPropagation();
                //     e.preventDefault();
                // }}
                onClick={throttle((e:any)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    // console.log('computeTextActive')
                    if (maranger && editors?.size && textRef.current && isEqual(cachePoint,position)) {
                        const point = maranger.getPoint(e.nativeEvent);
                        point && maranger.control.textEditorManager.computeTextActive(point, maranger.viewId)
                    }
                    return false
                }, 100, {'leading':false})}
                onTouchEndCapture={throttle((e:any)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    // console.log('computeTextActive--1')
                    if (maranger && editors?.size && textRef.current && workState !== EvevtWorkState.Doing) {
                        const point = maranger.getPoint(e.nativeEvent);
                        point && maranger.control.textEditorManager.computeTextActive(point, maranger.viewId)
        
                    }
                    return false
                }, 100, {'leading':false})}
            >
                <div className="bezier-pencil-plugin-floatCanvas-box" 
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${angle}deg)`
                    }}
                >
                    <canvas ref={ref} className="bezier-pencil-plugin-floatCanvas"/>
                </div>
                { LockedUI }
                { HighLightUI }
                { HighLightTwoUI }
                { HighLightFourUI }
                { TextViewInSelectorUI }
            </div>
        </Draggable>
    )
});

export const FloatBar = React.memo(FloatBarComponent,(props:{
    className: string,
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
}, nextProps:{
    className: string,
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
})=>{
    if (!isEqual(props,nextProps)) {
        console.log('FloatBar-----isEqual', false)
        return false
    }
    return true;
})

export const FloatBarBtn = (props:{
    className: string
}) => {
    const {floatBarData, position, operationType } = useContext(DisplayerContext);
    const {className} = props;
    if (operationType === EmitEventType.None) {
        return (
            <div className={`${className}`}
                style= { floatBarData ? {
                        left: position?.x,
                        top: position?.y,
                        width: floatBarData.w,
                        height: floatBarData.h,
                    } : undefined
                }
            >
                <FloatBtns textOpt={floatBarData?.textOpt} position={position} noLayer={floatBarData?.isLocked}/>
            </div>
        )
    }
    return null;
}