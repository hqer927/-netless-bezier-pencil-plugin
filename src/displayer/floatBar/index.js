/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useRef, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import throttle from "lodash/throttle";
import { EScaleType, EvevtWorkState } from "../../core";
import Draggable from 'react-draggable';
import { FloatBtns } from "../floatBtns";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { HightLightBox } from "../highlightBox";
import { Storage_Selector_key } from "../../collector";
import { TextViewInSelector } from "../../component/textEditor/view";
// let clickClockTimer:number|undefined;
export const FloatBar = React.forwardRef((props, ref) => {
    const { floatBarData, zIndex, position, angle, operationType, setPosition, setOperationType, maranger } = useContext(DisplayerContext);
    const { className, editors, activeTextId } = props;
    const textRef = useRef(null);
    const [workState, setWorkState] = useState(EvevtWorkState.Pending);
    const onDragStartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOperationType(EmitEventType.TranslateNode);
        setWorkState(EvevtWorkState.Start);
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: [Storage_Selector_key], position, workState: EvevtWorkState.Start, viewId: maranger?.viewId });
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        const p = { x: pos.x, y: pos.y };
        setPosition(p);
        setOperationType(EmitEventType.None);
        setWorkState(EvevtWorkState.Done);
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: [Storage_Selector_key], position: p, workState: EvevtWorkState.Done, viewId: maranger?.viewId });
    }, 100, { 'leading': false });
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        const p = { x: pos.x, y: pos.y };
        if (pos.x !== position?.x || pos.y !== position?.y) {
            setPosition(p);
            setWorkState(EvevtWorkState.Doing);
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: [Storage_Selector_key], position: p, workState: EvevtWorkState.Doing, viewId: maranger?.viewId });
        }
    }, 100, { 'leading': false });
    const FloatBtnsUI = useMemo(() => {
        if (operationType === EmitEventType.None) {
            return React.createElement(FloatBtns, { textOpt: floatBarData?.textOpt, position: position });
        }
        return null;
    }, [operationType, floatBarData, position]);
    // console.log('editors', editors)
    const HighLightUI = useMemo(() => {
        console.log('HighLightUI', operationType, floatBarData?.scaleType);
        if (floatBarData?.scaleType !== EScaleType.all ||
            operationType === EmitEventType.RotateNode) {
            return null;
        }
        return React.createElement(HightLightBox, null);
    }, [floatBarData, operationType]);
    return (React.createElement(Draggable, { position: position, onStart: onDragStartHandler, onDrag: onDragHandler, onStop: onDragEndHandler, handle: "canvas" },
        React.createElement("div", { className: `${className}`, style: floatBarData ? {
                width: floatBarData.w,
                height: floatBarData.h,
                zIndex,
                pointerEvents: zIndex < 2 ? 'none' : 'auto',
            } : undefined, onClick: (e) => {
                if (editors?.size && textRef.current && workState !== EvevtWorkState.Doing) {
                    const clickEvent = new PointerEvent('click', e);
                    textRef.current.dispatchEvent(clickEvent);
                }
            } },
            FloatBtnsUI,
            React.createElement("div", { className: "bezier-pencil-plugin-floatCanvas-box", style: {
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${angle}deg)`
                } },
                React.createElement("canvas", { ref: ref, className: "bezier-pencil-plugin-floatCanvas" })),
            HighLightUI,
            editors?.size && maranger && React.createElement(TextViewInSelector, { manager: maranger, textRef: textRef, selectIds: floatBarData?.selectIds || [], position: position, activeTextId: activeTextId, editors: editors }) || null)));
});
