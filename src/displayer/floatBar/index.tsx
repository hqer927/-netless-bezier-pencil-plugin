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
import { HightLightBox, HightLightTwoBox } from "../highlightBox";
import { Storage_Selector_key } from "../../collector";
import { TextViewInSelector } from "../../component/textEditor/view";
import { TextEditorInfo } from "../../component/textEditor";
import isEqual from "lodash/isEqual";

export const FloatBar = React.forwardRef((props:{
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
    const FloatBtnsUI = useMemo(()=>{
        if (operationType === EmitEventType.None) {
            return <FloatBtns textOpt={floatBarData?.textOpt} position={position}/>;
        }
        return null;
    },[operationType, floatBarData, position])
    // console.log('editors', editors)
    const HighLightUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.all ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HightLightBox/>
    },[floatBarData, operationType])
    const HighLightTwoUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.both ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HightLightTwoBox/>
    },[floatBarData, operationType])
    return (
        <Draggable
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
                        pointerEvents: zIndex < 2 ? 'none' : 'auto',
                    } : undefined
                }
                onClick={throttle((e:any)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    if (maranger && editors?.size && textRef.current && isEqual(cachePoint,position)) {
                        const point = maranger.getPoint(e.nativeEvent);
                        point && maranger.control.textEditorManager.computeTextActive(point, maranger.viewId)
                    }
                    return false
                }, 100, {'leading':false})}
                onTouchEndCapture={throttle((e:any)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    if (maranger && editors?.size && textRef.current && workState !== EvevtWorkState.Doing) {
                        const point = maranger.getPoint(e.nativeEvent);
                        point && maranger.control.textEditorManager.computeTextActive(point, maranger.viewId)
        
                    }
                    return false
                }, 100, {'leading':false})}
            >
                { FloatBtnsUI }
                <div className="bezier-pencil-plugin-floatCanvas-box" 
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${angle}deg)`
                    }}
                >
                    <canvas ref={ref} className="bezier-pencil-plugin-floatCanvas"/>
                </div>
                { HighLightUI }
                { HighLightTwoUI }
                {
                    editors?.size && maranger && <TextViewInSelector
                        manager={maranger}
                        textRef={textRef}
                        selectIds={floatBarData?.selectIds || []}
                        position={position}
                        activeTextId={activeTextId}
                        editors={editors}
                    /> || null
                }
            </div>
        </Draggable>
    )
})

