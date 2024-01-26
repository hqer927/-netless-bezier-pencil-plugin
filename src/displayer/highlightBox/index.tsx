import { DisplayerContext } from "../../plugin/bezierPencilDisplayer"
import React, { useContext, useEffect, useState } from "react"
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EvevtWorkState } from "../../core";
import { Resizable, NumberSize } from "re-resizable";
import type { Direction } from "re-resizable/lib/resizer";
import throttle from "lodash/throttle";

export const HightLightBox = () => {
    const [curSize, setCurSize] =  useState<NumberSize>({width: 0, height: 0});
    const {floatBarData, InternalMsgEmitter, setSize} = useContext(DisplayerContext);
    useEffect(()=>{
        if(floatBarData){
            setCurSize({width: floatBarData.w, height: floatBarData.h});
        }
    },[floatBarData])
    const onResizeStart = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, _dir: Direction, ele: HTMLElement) => {
        e.preventDefault();
        e.stopPropagation();
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;
        const size = {width, height, workState: EvevtWorkState.Start};
        setSize(size);
        setCurSize(size);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.ScaleNode, {workIds:['selector'], size, workState: EvevtWorkState.Start})
    }
    const onResize = throttle((e: MouseEvent | TouchEvent, _dir: Direction, ele: HTMLElement) => {
        e.preventDefault();
        e.stopPropagation();
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;
        const size = {width, height, workState: EvevtWorkState.Doing};
        if (size.width !== curSize.width || size.height!== curSize.height) {
            setSize(size);
            setCurSize(size);
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:['selector'], size, workState: EvevtWorkState.Doing})
        }
    }, 100, {'leading':false})
    const onResizeStop = (e: MouseEvent | TouchEvent, _dir: Direction, ele: HTMLElement) => {
        e.preventDefault();
        e.stopPropagation();
        const width = ele.offsetWidth;
        const height = ele.offsetHeight;
        const size = {width, height, workState: EvevtWorkState.Done};
        setSize(size);
        setCurSize(size);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.ScaleNode, {workIds:['selector'], size, workState: EvevtWorkState.Done})
    }
    return (
        <Resizable className="bezier-pencil-plugin-hightlight-box" 
            boundsByDirection={true}
            size= {{
                width: curSize.width,
                height: curSize.height,
            }}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
        >
            <div className="point LT nwse-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point LC ew-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point LB nesw-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point TC ns-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point RT nesw-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point RC ew-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point RB nwse-resize" style={{backgroundColor: floatBarData?.color}} ></div>
            <div className="point BC ns-resize" style={{backgroundColor: floatBarData?.color}} ></div>
        </Resizable>
    )
}