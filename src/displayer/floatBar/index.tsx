/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useRef, useState } from "react"
import { DisplayerContext, TeachingAidsDisplayer } from "../../plugin/single/teachingAidsDisplayer"
import throttle from "lodash/throttle";
import { EScaleType, EvevtWorkState } from "../../core";
import Draggable from 'react-draggable'; 
import type { DraggableData, DraggableEvent } from "react-draggable";
import { FloatBtns } from "../floatBtns";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { HightLightBox } from "../highlightBox";
import { Storage_Selector_key } from "../../collector";
import { TextViewInSelector } from "../../component/textEditor/view";
import { TextEditorInfo } from "../../component/textEditor";

// let clickClockTimer:number|undefined;

export const FloatBar = React.forwardRef((props:{
    className: string,
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
}, ref: React.Ref<HTMLCanvasElement>) => {
    const {floatBarData, zIndex, position, angle, operationType, setPosition, setOperationType,
    } = useContext(DisplayerContext);
    const { className, editors, activeTextId} = props;
    const textRef = useRef<HTMLDivElement>(null);
    const [workState,setWorkState] = useState<EvevtWorkState>(EvevtWorkState.Pending);
    const onDragStartHandler = (e: DraggableEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setOperationType(EmitEventType.TranslateNode);
        setWorkState(EvevtWorkState.Start);
        if (TeachingAidsDisplayer.control.room) {
            TeachingAidsDisplayer.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position, workState: EvevtWorkState.Start})
    }
    const onDragEndHandler = throttle((e: DraggableEvent,
        pos: DraggableData) => {
        e.preventDefault();
        e.stopPropagation();
        const p = {x:pos.x, y:pos.y};
        setPosition(p)
        setOperationType(EmitEventType.None);
        setWorkState(EvevtWorkState.Done);
        if (TeachingAidsDisplayer.control.room) {
            TeachingAidsDisplayer.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:p, workState: EvevtWorkState.Done})
    }, 100, {'leading':false})
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        const p = {x:pos.x, y:pos.y};
        if (pos.x !== position?.x || pos.y!== position?.y) {
            setPosition(p);
            setWorkState(EvevtWorkState.Doing);
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:p, workState: EvevtWorkState.Doing})
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
                onClick={(e:any)=>{
                    if (editors?.size && textRef.current && workState !== EvevtWorkState.Doing) {
                        const clickEvent = new PointerEvent('click', e);
                        textRef.current.dispatchEvent(clickEvent);
                    }
                }}
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
                {
                    editors?.size && <TextViewInSelector 
                        textRef={textRef}
                        selectIds={floatBarData?.selectIds || []}
                        position={position}
                        activeTextId={activeTextId}
                        editors={editors}
                    />
                }
            </div>
        </Draggable>
    )
})

