/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react"
import { DisplayerContext } from "../../../plugin/displayerView";
import { IconURL } from "../../icons";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import throttle from "lodash/throttle";
import { MethodBuilderMain } from "../../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../../plugin/types";
import { EvevtWorkState } from "../../../core";
import { Point2d } from "../../../core/utils/primitives/Point2d";
import { Storage_Selector_key } from "../../../collector";

export const RotateBtn = (props:{
    className: string,
}) => {
    const { className } = props;
    const {floatBarData, angle, setAngle, setOperationType, maranger} = useContext(DisplayerContext);
    const [showMousePointer, setShowMousePointer] = useState(false);
    const [originPoint,setOriginPoint] = useState<Point2d>(new Point2d());
    const [centralPoint,setCentralPoint] = useState<Point2d>(new Point2d());
    const [disabled, setDisabled] = useState<boolean>(false);
    useEffect(()=>{
        MethodBuilderMain.activeListener(activeListener);
        return ()=>{
            MethodBuilderMain.unmountActiveListener(activeListener);
        }
    },[])
    const activeListener = (isActive:boolean) => {
        if (!isActive) {
            setDisabled(true)
            setShowMousePointer(false);
            setOperationType(EmitEventType.None);
            return;
        }
        setDisabled(false);
        if (maranger?.control.room?.disableDeviceInputs) {
            maranger.control.room.disableDeviceInputs = false;
        }
    }
    useEffect(() => {
        if (floatBarData) {
            const ox = Math.floor(floatBarData.w / 2);
            const oy = Math.floor(- floatBarData.h / 2);
            setCentralPoint(new Point2d(ox, oy));
            setOriginPoint(new Point2d());
        }
    },[floatBarData])

    const onDragStartHandler = (e: DraggableEvent, pos: DraggableData) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            return ;
        }
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint,centralPoint,new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.RotateNode);
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.RotateNode, {workIds: [Storage_Selector_key], angle:a, workState: EvevtWorkState.Start, viewId:maranger?.viewId})
    }
    const onDragEndHandler = throttle((e: DraggableEvent,
        pos: DraggableData ) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            return ;
        }
        setShowMousePointer(false);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint,centralPoint,new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.None);
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.RotateNode, {workIds: [Storage_Selector_key], angle:a, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
    }, 100, {'leading':false})
    const onDragHandler = throttle((e, pos) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            return ;
        }
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint,centralPoint,new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.RotateNode);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.RotateNode, {workIds: [Storage_Selector_key], angle:a, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
    }, 100, {'leading':false})
    return (
        <Draggable
            disabled={disabled}
            handle=".bezier-pencil-plugin-rotate-mouse-pointer"
            onStart={onDragStartHandler}
            onDrag={onDragHandler}
            onStop={onDragEndHandler}
        >
           <div className={`${className}`}
                style= { floatBarData ? {
                        left: floatBarData.x - 30,
                        top: floatBarData.y + floatBarData.h + 20,
                        touchAction:'none'
                    } : undefined
                }
           >
                {
                    !showMousePointer && (
                        <div className="bezier-pencil-plugin-rotate-btn" style={{ backgroundColor: floatBarData?.selectorColor }}>
                            <img alt="icon" src={IconURL('rotation-button')}/>
                        </div>
                    )
                }
                <div className={`bezier-pencil-plugin-rotate-mouse-pointer ${showMousePointer? 'active' : ''}`}>
                    <img alt="icon" src={IconURL('rotation')}/>
                    <div className="angle-icon">{angle}°</div>
                </div>
           </div>
        </Draggable>
    )
}