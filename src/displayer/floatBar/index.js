import React, { useContext, useMemo } from "react";
import { DisplayerContext } from "../../plugin/single/bezierPencilDisplayer";
import throttle from "lodash/throttle";
import { EvevtWorkState } from "../../core";
import Draggable from 'react-draggable';
import { FloatBtns } from "../floatBtns";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { HightLightBox } from "../highlightBox";
import { Storage_Selector_key } from "../../collector";
export const FloatBar = React.forwardRef((props, ref) => {
    const { floatBarData, zIndex, InternalMsgEmitter, position, showFloatBarBtn, angle, isRotating, setShowFloatBarBtn, setPosition } = useContext(DisplayerContext);
    const { className } = props;
    const onDragStartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('onDragStartHandler', position)
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: [Storage_Selector_key], position, workState: EvevtWorkState.Start });
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowFloatBarBtn(true);
        const p = { x: pos.x, y: pos.y };
        setPosition(p);
        // console.log('onDragEndHandler', p)
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: [Storage_Selector_key], position: p, workState: EvevtWorkState.Done });
    }, 100, { 'leading': false });
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowFloatBarBtn(false);
        const p = { x: pos.x, y: pos.y };
        if (pos.x !== position?.x || pos.y !== position?.y) {
            setPosition(p);
            // console.log('onDragHandler', p)
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: [Storage_Selector_key], position: p, workState: EvevtWorkState.Doing });
        }
    }, 100, { 'leading': false });
    const FloatBtnsUI = useMemo(() => {
        if (showFloatBarBtn && !isRotating) {
            return React.createElement(FloatBtns, null);
        }
        return null;
    }, [showFloatBarBtn, isRotating]);
    return (React.createElement(Draggable, { position: position, onStart: onDragStartHandler, onDrag: onDragHandler, onStop: onDragEndHandler, handle: "canvas" },
        React.createElement("div", { className: `${className}`, style: floatBarData ? {
                width: floatBarData.w,
                height: floatBarData.h,
                zIndex,
                pointerEvents: zIndex < 2 ? 'none' : 'auto',
            } : undefined },
            FloatBtnsUI,
            React.createElement("div", { className: "bezier-pencil-plugin-floatCanvas-box", style: {
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${angle}deg)`,
                } },
                React.createElement("canvas", { ref: ref, className: "bezier-pencil-plugin-floatCanvas" })),
            !isRotating && React.createElement(HightLightBox, null))));
});
