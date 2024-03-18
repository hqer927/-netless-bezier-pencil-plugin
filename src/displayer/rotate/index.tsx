/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react"
import { DisplayerContext, TeachingAidsDisplayer } from "../../plugin"
import { IconURL } from "../icons";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import throttle from "lodash/throttle";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EvevtWorkState } from "../../core";
import { Point2d } from "../../core/utils/primitives/Point2d";
import { Storage_Selector_key } from "../../collector";

export const RotateBtn = (props:{
    className: string,
}) => {
    const { className } = props;
    const {floatBarData, angle, setAngle, position, setOperationType} = useContext(DisplayerContext);
    const [showMousePointer, setShowMousePointer] = useState(false);
    const [originPoint,setOriginPoint] = useState<Point2d>(new Point2d());
    const [centralPoint,setCentralPoint] = useState<Point2d>(new Point2d());
    useEffect(() => {
        if (floatBarData) {
            const ox = Math.floor(floatBarData.w / 2);
            const oy = Math.floor(- floatBarData.h / 2);
            setCentralPoint(new Point2d(ox, oy));
            setOriginPoint(new Point2d());
        }
    },[floatBarData, position])

    const onDragStartHandler = (e: DraggableEvent, pos: DraggableData) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint,centralPoint,new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.RotateNode);
        // console.log('onDragStartHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        if (TeachingAidsDisplayer.control.room) {
            TeachingAidsDisplayer.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.RotateNode, {workIds: [Storage_Selector_key], angle:a, workState: EvevtWorkState.Start})
    }
    const onDragEndHandler = throttle((e: DraggableEvent,
        pos: DraggableData ) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(false);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint,centralPoint,new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.RotateNode);
        // console.log('onDragEndHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        if (TeachingAidsDisplayer.control.room) {
            TeachingAidsDisplayer.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.RotateNode, {workIds: [Storage_Selector_key], angle:a, workState: EvevtWorkState.Done})
    }, 100, {'leading':false})
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint,centralPoint,new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        // console.log('onDragHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.RotateNode, {workIds: [Storage_Selector_key], angle:a, workState: EvevtWorkState.Doing})
    }, 100, {'leading':false})
    return (
        <Draggable
            handle=".bezier-pencil-plugin-rotate-mouse-pointer"
            onStart={onDragStartHandler}
            onDrag={onDragHandler}
            onStop={onDragEndHandler}
        >
           <div className={`${className}`}
                style= { position && floatBarData ? {
                        left: position.x - 30,
                        top: position.y + floatBarData.h + 20,
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