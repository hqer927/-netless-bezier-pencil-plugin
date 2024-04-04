import { DisplayerContext } from "../../plugin/displayerView";
import React, { useContext, useEffect, useState } from "react"
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EvevtWorkState } from "../../core";
import { NumberSize, Resizable } from "re-resizable";
import type { Direction } from "re-resizable/lib/resizer";
import throttle from "lodash/throttle";
import { Storage_Selector_key } from "../../collector";


export const ResizableBox = (props:{
        className: string,
    }) => {
    const {className}= props;
    const [curSize, setCurSize] =  useState<{x:number,y:number,w:number,h:number}>({x: 0, y: 0, h: 0, w: 0});
    const {floatBarData, setSize, position, setPosition, maranger} = useContext(DisplayerContext);
    useEffect(()=>{
        if(floatBarData){
            setCurSize({x: floatBarData.x, y:floatBarData.y, w: floatBarData.w, h: floatBarData.h});
        }
    },[])
    const onResizeStart = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(floatBarData?.w && floatBarData?.h){
            const box: {x: number, y: number, w: number, h: number} = {
                x: position?.x || 0,
                y: position?.y || 0,
                w: floatBarData.w, 
                h: floatBarData.h
            };
            setSize({width:box.w, height:box.h, workState: EvevtWorkState.Start});
            setCurSize(box);
            // console.log('Start_dir', box)
            if (maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = true;
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, workState: EvevtWorkState.Start, viewId:maranger?.viewId})
        }

    }
    const onResize = throttle((e: MouseEvent | TouchEvent, _dir: Direction, _ele: HTMLElement, delta: NumberSize) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('delta', delta)
        const box: {x: number, y: number, w: number, h: number} = {
            x: curSize.x,
            y: curSize.y,
            w: curSize.w, 
            h: curSize.h
        };
        box.w += delta.width;
        box.h += delta.height;
        switch (_dir) {
            case "bottomLeft":
            case "left":
                box.x -= delta.width;
                break;
            case "topLeft":
                box.x -= delta.width;
                box.y -= delta.height;
                break;
            case "top":
            case 'topRight':
                box.y -= delta.height;
                break;
            default:
                break;
        }
        if (delta.width!== 0 || delta.height!== 0) {
            setSize({width:box.w, height:box.h, workState: EvevtWorkState.Doing});
            setPosition({x:box.x, y:box.y});
            // setCurSize(box);
            // console.log('Doing_dir', box)
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    const onResizeStop = (e: MouseEvent | TouchEvent, _dir: Direction, _ele: HTMLElement, delta: NumberSize) => {
        e.preventDefault();
        e.stopPropagation();
        const box: {x: number, y: number, w: number, h: number} = {
            x: curSize.x,
            y: curSize.y,
            w: curSize.w, 
            h: curSize.h
        };
        box.w += delta.width;
        box.h += delta.height;
        switch (_dir) {
            case "bottomLeft":
            case "left":
                box.x -= delta.width;
                break;
            case "topLeft":
                box.x -= delta.width;
                box.y -= delta.height;
                break;
            case "top":
            case 'topRight':
                box.y -= delta.height;
                break;
            default:
                break;
        }
        setSize({width:box.w, height:box.h, workState: EvevtWorkState.Done});
        setPosition({x:box.x, y:box.y});
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
    }
    return (
        <Resizable className={`${className}`} 
            boundsByDirection={true}
            size={{
                width: floatBarData?.w || 0,
                height: floatBarData?.h || 0,
            }}
            style={{
                position:'absolute',
                pointerEvents:'auto',
                left: position?.x,
                top: position?.y,
            }}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
        >
        </Resizable>
    )
}