/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import { IconURL } from "../icons";
import Draggable from "react-draggable";
import throttle from "lodash/throttle";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EvevtWorkState } from "../../core";
import { Point2d } from "../../core/utils/primitives/Point2d";
import { Storage_Selector_key } from "../../collector";
export const RotateBtn = (props) => {
    const { className } = props;
    const { floatBarData, angle, setAngle, position, setOperationType, maranger } = useContext(DisplayerContext);
    const [showMousePointer, setShowMousePointer] = useState(false);
    const [originPoint, setOriginPoint] = useState(new Point2d());
    const [centralPoint, setCentralPoint] = useState(new Point2d());
    useEffect(() => {
        if (floatBarData) {
            const ox = Math.floor(floatBarData.w / 2);
            const oy = Math.floor(-floatBarData.h / 2);
            setCentralPoint(new Point2d(ox, oy));
            setOriginPoint(new Point2d());
        }
    }, [floatBarData, position]);
    const onDragStartHandler = (e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint, centralPoint, new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.RotateNode);
        // console.log('onDragStartHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode, { workIds: [Storage_Selector_key], angle: a, workState: EvevtWorkState.Start, viewId: maranger?.viewId });
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(false);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint, centralPoint, new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.None);
        // console.log('onDragEndHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode, { workIds: [Storage_Selector_key], angle: a, workState: EvevtWorkState.Done, viewId: maranger?.viewId });
    }, 100, { 'leading': false });
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint, centralPoint, new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setOperationType(EmitEventType.RotateNode);
        // console.log('onDragHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode, { workIds: [Storage_Selector_key], angle: a, workState: EvevtWorkState.Doing, viewId: maranger?.viewId });
    }, 100, { 'leading': false });
    return (React.createElement(Draggable, { handle: ".bezier-pencil-plugin-rotate-mouse-pointer", onStart: onDragStartHandler, onDrag: onDragHandler, onStop: onDragEndHandler },
        React.createElement("div", { className: `${className}`, style: position && floatBarData ? {
                left: position.x - 30,
                top: position.y + floatBarData.h + 20,
            } : undefined },
            !showMousePointer && (React.createElement("div", { className: "bezier-pencil-plugin-rotate-btn", style: { backgroundColor: floatBarData?.selectorColor } },
                React.createElement("img", { alt: "icon", src: IconURL('rotation-button') }))),
            React.createElement("div", { className: `bezier-pencil-plugin-rotate-mouse-pointer ${showMousePointer ? 'active' : ''}` },
                React.createElement("img", { alt: "icon", src: IconURL('rotation') }),
                React.createElement("div", { className: "angle-icon" },
                    angle,
                    "\u00B0")))));
};
