import React, { useContext, useMemo } from "react";
import { DisplayerContext } from "../../plugin/bezierPencilDisplayer";
import throttle from "lodash/throttle";
import { EvevtWorkState } from "../../core";
import Draggable from 'react-draggable';
import { FloatBtns } from "../floatBtns";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { HightLightBox } from "../highlightBox";
export const FloatBar = React.forwardRef((props, ref) => {
    const { floatBarData, zIndex, InternalMsgEmitter, position, showFloatBarBtn, angle, isRotating, setShowFloatBarBtn, setPosition } = useContext(DisplayerContext);
    const { className } = props;
    const onDragStartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('onDragStartHandler', position)
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: ['selector'], position, workState: EvevtWorkState.Start });
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowFloatBarBtn(true);
        const p = { x: pos.x, y: pos.y };
        setPosition(p);
        // console.log('onDragEndHandler', p)
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: ['selector'], position: p, workState: EvevtWorkState.Done });
    }, 100, { 'leading': false });
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        setShowFloatBarBtn(false);
        const p = { x: pos.x, y: pos.y };
        if (pos.x !== position?.x || pos.y !== position?.y) {
            setPosition(p);
            // console.log('onDragHandler', p)
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, EmitEventType.TranslateNode, { workIds: ['selector'], position: p, workState: EvevtWorkState.Doing });
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
            React.createElement("canvas", { ref: ref, className: "bezier-pencil-plugin-floatCanvas", style: {
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${angle}deg)`,
                } }),
            !isRotating && React.createElement(HightLightBox, null))));
});
