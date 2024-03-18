import { DisplayerContext } from "../../plugin/single/bezierPencilDisplayer";
import React, { useContext, useEffect, useState } from "react";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EvevtWorkState } from "../../core";
import { Resizable } from "re-resizable";
import throttle from "lodash/throttle";
import { Storage_Selector_key } from "../../collector";
export const HightLightBox = () => {
    const [curSize, setCurSize] = useState({ width: 0, height: 0 });
    const { floatBarData, InternalMsgEmitter, setSize } = useContext(DisplayerContext);
    useEffect(() => {
        if (floatBarData) {
            setCurSize({ width: floatBarData.w, height: floatBarData.h });
        }
    }, [floatBarData]);
    const onResizeStart = (e, _dir, ele) => {
        e.preventDefault();
        e.stopPropagation();
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;
        const size = { width, height, workState: EvevtWorkState.Start };
        setSize(size);
        setCurSize(size);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ScaleNode, { workIds: [Storage_Selector_key], size, workState: EvevtWorkState.Start });
    };
    const onResize = throttle((e, _dir, ele) => {
        e.preventDefault();
        e.stopPropagation();
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;
        const size = { width, height, workState: EvevtWorkState.Doing };
        if (size.width !== curSize.width || size.height !== curSize.height) {
            setSize(size);
            setCurSize(size);
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ScaleNode, { workIds: [Storage_Selector_key], size, workState: EvevtWorkState.Doing });
        }
    }, 100, { 'leading': false });
    const onResizeStop = (e, _dir, ele) => {
        e.preventDefault();
        e.stopPropagation();
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;
        const size = { width, height, workState: EvevtWorkState.Done };
        setSize(size);
        setCurSize(size);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ScaleNode, { workIds: [Storage_Selector_key], size, workState: EvevtWorkState.Done });
    };
    return (React.createElement(Resizable, { className: "bezier-pencil-plugin-hightlight-box", boundsByDirection: true, size: {
            width: curSize.width,
            height: curSize.height,
        }, onResizeStart: onResizeStart, onResize: onResize, onResizeStop: onResizeStop },
        React.createElement("div", { className: "point LT nwse-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point LC ew-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point LB nesw-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point TC ns-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point RT nesw-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point RC ew-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point RB nwse-resize", style: { backgroundColor: floatBarData?.color } }),
        React.createElement("div", { className: "point BC ns-resize", style: { backgroundColor: floatBarData?.color } })));
};
