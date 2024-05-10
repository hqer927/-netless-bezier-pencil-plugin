import { DisplayerContext } from "../../plugin/displayerView";
import React, { useContext, useEffect, useMemo, useState } from "react"
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { EScaleType, EvevtWorkState } from "../../core";
import { NumberSize, Resizable } from "re-resizable";
import type { Direction } from "re-resizable/lib/resizer";
import throttle from "lodash/throttle";
import { Storage_Selector_key } from "../../collector";
import Draggable from "react-draggable";
import type { DraggableData, DraggableEvent } from "react-draggable";

export const ResizableBox = (props:{
        className: string;
    }) => {
    const {className}= props;
    const [curSize, setCurSize] =  useState<{x:number,y:number,w:number,h:number}>({x: 0, y: 0, h: 0, w: 0});
    const {floatBarData, position, maranger} = useContext(DisplayerContext);
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
            setCurSize(box);
            if (maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = true;
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, workState: EvevtWorkState.Start, viewId:maranger?.viewId})
        }

    }
    const onResize = throttle((e: MouseEvent | TouchEvent, dir: Direction, _ele: HTMLElement, delta: NumberSize) => {
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
        switch (dir) {
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
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, dir, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    const onResizeStop = throttle((e: MouseEvent | TouchEvent, dir: Direction, _ele: HTMLElement, delta: NumberSize) => {
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
        switch (dir) {
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
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, dir, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
    }, 100, {'leading':false})
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
            enable={{
                top: floatBarData?.scaleType === EScaleType.all && true || false,
                right: floatBarData?.scaleType === EScaleType.all && true || false,
                bottom: floatBarData?.scaleType === EScaleType.all && true || false,
                left: floatBarData?.scaleType === EScaleType.all && true || false,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true
            }}
            lockAspectRatio={ floatBarData?.scaleType === EScaleType.proportional }
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
        >
        </Resizable>
    )
}

export const ResizableTwoBtn = (props:{
    id:string;
    pos:{x:number,y:number};
    pointMap: Map<string, [number,number][]>;
    type:'start'|'end';
}) => {
    const {id, pos, pointMap, type}= props;
    const {setOperationType, maranger, floatBarData} = useContext(DisplayerContext);
    const [position,setPosition]= useState<{x:number,y:number}>({x:0,y:0});
    const [workState,setWorkState]= useState<EvevtWorkState>(EvevtWorkState.Pending);
    useEffect(()=>{
        if (workState === EvevtWorkState.Pending || workState === EvevtWorkState.Done) {
            setPosition(pos);
        }
    },[pos, workState])
    const onDragStartHandler = (e: DraggableEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOperationType(EmitEventType.SetPoint);
        setWorkState(EvevtWorkState.Start)
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = true;
        }
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetPoint, {workId: Storage_Selector_key, pointMap, workState:EvevtWorkState.Start, viewId:maranger?.viewId})
    }
    const onDragHandler = throttle((e: DraggableEvent, pos: DraggableData) => {
        e.preventDefault();
        e.stopPropagation();
        setOperationType(EmitEventType.SetPoint);
        setWorkState(EvevtWorkState.Doing)
        if (pos.x !== position?.x || pos.y!== position?.y) {
            const point = pointMap.get(id);
            if (point && type === 'start' && maranger?.control.viewContainerManager) {
                point[0] = maranger.control.viewContainerManager.transformToScenePoint([pos.x, pos.y], maranger.viewId);
            }
            else if (point && type === 'end' && maranger?.control.viewContainerManager) {
                point[1] =  maranger.control.viewContainerManager.transformToScenePoint([pos.x, pos.y], maranger.viewId);
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetPoint, {workId: Storage_Selector_key, pointMap, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 50, {'leading':false})
    const onDragEndHandler = throttle((e: DraggableEvent, pos: DraggableData) =>{
        e.preventDefault();
        e.stopPropagation();
        setOperationType(EmitEventType.None);
        setWorkState(EvevtWorkState.Done)
        if (pos.x !== position?.x || pos.y!== position?.y) {
            setPosition(pos);
            const point = pointMap.get(id);
            if (point && type === 'start' && maranger?.control.viewContainerManager) {
                point[0] = maranger.control.viewContainerManager.transformToScenePoint([pos.x, pos.y], maranger.viewId);
            }
            else if (point && type === 'end' && maranger?.control.viewContainerManager) {
                point[1] =  maranger.control.viewContainerManager.transformToScenePoint([pos.x, pos.y], maranger.viewId);
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetPoint, {workId: Storage_Selector_key, pointMap, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    return (
        <Draggable
            position={position}
            onStart={onDragStartHandler}
            onDrag={onDragHandler}
            onStop={onDragEndHandler}
        >
           <div className={'bezier-pencil-plugin-point-draggable-btn'}>
            <div className={'bezier-pencil-plugin-point-draggable-btn-inner'}
                 style={{                    
                    borderColor: floatBarData?.selectorColor,
                 }}
            >
            </div>
           </div>
        </Draggable>
    )
}

export const ResizableTwoBox = (props:{
    className: string,
}) => {
    const {className}= props;
    const {floatBarData, maranger} = useContext(DisplayerContext);
    const [startPosition,setStartPosition] = useState<{x:number,y:number}>();
    const [endPosition,setEndPosition] = useState<{x:number,y:number}>();
    const [pointMap,setPointMap] = useState<Map<string,[number,number][]>>(new Map());
    useEffect(()=>{
        const ps:[number,number][] = [];
        if (maranger && floatBarData?.points) {
            const viewId = maranger.viewId;
            const view =  maranger.control.viewContainerManager.getView(viewId);
            if (view) {
                for (const point of floatBarData.points) {
                    const p = maranger.control.viewContainerManager.transformToOriginPoint(point,viewId);
                    ps.push(p);
                }
            }
            if (floatBarData?.selectIds && floatBarData.selectIds.length === 1) {
                pointMap.set(floatBarData.selectIds[0],floatBarData.points);
                setPointMap(pointMap);
            }
        }
        if(ps[0]){
            setStartPosition({x:ps[0][0],y:ps[0][1]})
        }
        if(ps[1]){
            setEndPosition({x:ps[1][0],y:ps[1][1]})
        }
    },[maranger, floatBarData?.points, floatBarData?.selectIds, pointMap])
    const StartDragPoint = useMemo(()=>{
        if (startPosition && floatBarData?.selectIds) {
            return <ResizableTwoBtn pos={startPosition} type={"start"} id={floatBarData.selectIds[0]} pointMap={pointMap} />
        }
        return null
    },[startPosition, floatBarData?.selectIds, pointMap])
    const EndDragPoint = useMemo(()=>{
        if (endPosition && floatBarData?.selectIds) {
            return <ResizableTwoBtn pos={endPosition} type={"end"} id={floatBarData.selectIds[0]} pointMap={pointMap} />
        }
        return null
    },[endPosition, floatBarData?.selectIds, pointMap])
    return (
        <div className={`${className}`}>
            {StartDragPoint}
            {EndDragPoint}
        </div>
    )
}