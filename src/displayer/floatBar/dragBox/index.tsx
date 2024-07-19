/* eslint-disable @typescript-eslint/no-explicit-any */
import { throttle, isNumber } from "lodash";
import React, { useContext, useState, useEffect, useMemo } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Storage_Selector_key } from "../../../collector";
import { EvevtWorkState, EScaleType } from "../../../core";
import { MethodBuilderMain } from "../../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../../plugin";
import { DisplayerContext } from "../../../plugin/displayerView";

export const DraggableBox = (props:{
    onClickHandle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}) => {
    const {floatBarData, setOperationType, maranger} = useContext(DisplayerContext);
    const {onClickHandle} = props;
    const [workState,setWorkState] = useState<EvevtWorkState>(EvevtWorkState.Pending);
    const [cachePoint, setCachePoint] = useState<{x:number,y:number}>();
    const [curPosition, setCurPosition] = useState<{x:number,y:number}>();
    const [disabled, setDisabled] = useState<boolean>(false);
    useEffect(()=>{
        MethodBuilderMain.activeListener(activeListener);
        return ()=>{
            MethodBuilderMain.unmountActiveListener(activeListener);
        }
    },[])
    const activeListener = (isActive:boolean) => {
        if (!isActive || floatBarData?.isLocked) {
            setDisabled(true)
            setWorkState(EvevtWorkState.Pending)
            setOperationType(EmitEventType.None);
            return;
        }
        setDisabled(false);
        if (maranger?.control.room?.disableDeviceInputs) {
            maranger.control.room.disableDeviceInputs = false;
        }
    }
    useEffect(()=>{
        if (floatBarData?.isLocked || maranger?.control.worker.isBusy) {
            setDisabled(true)
            setWorkState(EvevtWorkState.Pending)
            return;
        }
        setDisabled(false)
    },[floatBarData?.isLocked])
    useEffect(()=>{
        if(isNumber(floatBarData?.x) && isNumber(floatBarData?.y) && (workState === EvevtWorkState.Pending || workState === EvevtWorkState.Done)){
            setCurPosition({x:floatBarData?.x,y:floatBarData?.y});
        }
    },[workState, floatBarData?.x, floatBarData?.y])
    const onDragStartHandler = (e: DraggableEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            setWorkState(EvevtWorkState.Pending);
            return ;
        }
        if (isNumber(floatBarData?.x) && isNumber(floatBarData?.y)) {
            setOperationType(EmitEventType.TranslateNode);
            setWorkState(EvevtWorkState.Start);
            setCachePoint({x:floatBarData?.x,y:floatBarData?.y})
            if (maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = true;
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:{x:floatBarData?.x,y:floatBarData?.y}, workState: EvevtWorkState.Start, viewId:maranger?.viewId})
    
        }
    }
    const onDragEndHandler = throttle((e: DraggableEvent, pos: DraggableData) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            setWorkState(EvevtWorkState.Pending);
            return ;
        }
        e.stopPropagation();
        const p = {x:pos.x, y:pos.y};
        setOperationType(EmitEventType.None);
        setWorkState(EvevtWorkState.Done);
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:p, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
    }, 100, {'leading':false})
    const onDragHandler = throttle((e, pos) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            setWorkState(EvevtWorkState.Pending);
            return ;
        }
        const p = {x:pos.x, y:pos.y};
        if (pos.x !== floatBarData?.x || pos.y!== floatBarData?.y) {
            setWorkState(EvevtWorkState.Doing);
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.TranslateNode, {workIds: [Storage_Selector_key], position:p, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    const isLocked = useMemo(()=>{
        if ( floatBarData?.scaleType === EScaleType.none && floatBarData?.canLock) {
            return true
        }
        return false
    },[floatBarData])
    return (
        <Draggable
            disabled={disabled}
            position={curPosition}
            onStart={onDragStartHandler}
            onDrag={onDragHandler}
            onStop={onDragEndHandler}
        >
            <div style= { floatBarData ? {
                        position:'absolute',
                        left:0,
                        top:0,
                        width: floatBarData.w,
                        height: floatBarData.h,
                        zIndex: 2,
                        pointerEvents: isLocked ? 'none' : 'auto',
                        touchAction:'none'
                    } : undefined
                }
                onClick={throttle((e:any)=>{
                    e.stopPropagation();
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    if (cachePoint?.x === floatBarData?.x && cachePoint?.y === floatBarData?.y) {
                        onClickHandle(e);
                    }
                    return false
                }, 100, {'leading':false})}
                onTouchEndCapture={throttle((e:any)=>{
                    e.stopPropagation();
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    if (maranger && workState !== EvevtWorkState.Doing) {
                        onClickHandle(e);
                    }
                    return false
                }, 100, {'leading':false})}
            >

            </div>
        </Draggable>
    )
}