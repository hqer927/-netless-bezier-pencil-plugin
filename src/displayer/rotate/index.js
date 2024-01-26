/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { DisplayerContext } from "../../plugin";
import { IconURL } from "../icons";
import Draggable from "react-draggable";
import throttle from "lodash/throttle";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EvevtWorkState } from "../../core";
import { Point2d } from "../../core/utils/primitives/Point2d";
export const RotateBtn = (props) => {
    const { className } = props;
    const { floatBarData, InternalMsgEmitter, angle, setAngle, setRotateState, position, setShowRotateBtn } = useContext(DisplayerContext);
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
        setRotateState(true);
        // console.log('onDragStartHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode, { workIds: ['selector'], angle: a, workState: EvevtWorkState.Start });
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(false);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint, centralPoint, new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setRotateState(false);
        setShowRotateBtn(false);
        // console.log('onDragEndHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode, { workIds: ['selector'], angle: a, workState: EvevtWorkState.Done });
    }, 100, { 'leading': false });
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMousePointer(true);
        const a = Math.round(Point2d.GetAngleByPoints(originPoint, centralPoint, new Point2d(pos.x, pos.y))) || 0;
        setAngle(a);
        setRotateState(true);
        // console.log('onDragHandler', a, originPoint.XY, centralPoint.XY, [pos.x, pos.y])
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.RotateNode, { workIds: ['selector'], angle: a, workState: EvevtWorkState.Doing });
    }, 100, { 'leading': false });
    return (React.createElement(Draggable, { handle: ".bezier-pencil-plugin-rotate-mouse-pointer", onStart: onDragStartHandler, onDrag: onDragHandler, onStop: onDragEndHandler },
        React.createElement("div", { className: `${className}`, style: position && floatBarData ? {
                left: position.x - 30,
                top: position.y + floatBarData.h + 20,
            } : undefined },
            !showMousePointer && (React.createElement("div", { className: "bezier-pencil-plugin-rotate-btn", style: { backgroundColor: floatBarData?.color } },
                React.createElement("img", { alt: "icon", src: IconURL('rotation-button') }))),
            React.createElement("div", { className: `bezier-pencil-plugin-rotate-mouse-pointer ${showMousePointer ? 'active' : ''}` },
                React.createElement("img", { alt: "icon", src: IconURL('rotation') }),
                React.createElement("div", { className: "angle-icon" },
                    angle,
                    "\u00B0")))));
};
