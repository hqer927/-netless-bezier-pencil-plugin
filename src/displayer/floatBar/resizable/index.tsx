import { DisplayerContext } from "../../../plugin/displayerView";
import React, { useContext, useEffect, useMemo, useState } from "react"
import { MethodBuilderMain } from "../../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../../plugin/types";
import { EScaleType, EvevtWorkState } from "../../../core";
import { NumberSize, Resizable } from "re-resizable";
import type { Direction } from "re-resizable/lib/resizer";
import { Storage_Selector_key } from "../../../collector";
import Draggable from "react-draggable";
import type { DraggableData, DraggableEvent } from "react-draggable";
import {isNumber, throttle} from "lodash";

export const ResizableBox = (props:{
        className: string;
    }) => {
    const {className}= props;
    const [curSize, setCurSize] =  useState<{x:number,y:number,w:number,h:number}>({x: 0, y: 0, h: 0, w: 0});
    const {floatBarData, maranger} = useContext(DisplayerContext);
    const [cacheInfo, setCacheInfo] = useState<{
        box:{x:number,y:number,w:number,h:number};
        dir?:Direction;
        reverseX?:boolean;
        reverseY?:boolean;
    }>();
    const [disabled, setDisabled] = useState<boolean>(false);
    useEffect(()=>{
        if(floatBarData){
            setCurSize({x: floatBarData.x, y:floatBarData.y, w: floatBarData.w, h: floatBarData.h});
        }
        MethodBuilderMain.activeListener(activeListener);
        return ()=>{
            MethodBuilderMain.unmountActiveListener(activeListener);
        }
    },[])
    const activeListener = (isActive:boolean) => {
        if (!isActive) {
            setDisabled(true)
            return;
        }
        setDisabled(false);
        if (maranger?.control.room?.disableDeviceInputs) {
            maranger.control.room.disableDeviceInputs = false;
        }
    }
    const onResizeStart = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            return ;
        }
        if(floatBarData?.w && floatBarData?.h){
            const box: {x: number, y: number, w: number, h: number} = {
                x: floatBarData?.x || 0,
                y: floatBarData?.y || 0,
                w: floatBarData.w, 
                h: floatBarData.h
            };
            setCurSize(box);
            setCacheInfo({ box })
            if (maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = true;
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, workState: EvevtWorkState.Start, viewId:maranger?.viewId})
        }

    }
    const onResize = throttle((e: MouseEvent | TouchEvent, dir: Direction, _ele: HTMLElement, delta: NumberSize) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            return ;
        }
        const {box, reverseY, reverseX} = computBox(dir, delta);
        if ((box.h !==0  && box.w !==0) 
            && (box.h !== cacheInfo?.box?.h || box.w !== cacheInfo?.box?.w) 
            && (delta.width!== 0 || delta.height!== 0)) {
            setCacheInfo({
                box,
                dir,
                reverseY, 
                reverseX
            })
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, dir, reverseY, reverseX, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    const onResizeStop = throttle((e: MouseEvent | TouchEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            return ;
        }
        if (maranger?.control.room) {
            maranger.control.room.disableDeviceInputs = false;
        }
        if (cacheInfo) {
            const {box, dir, reverseY, reverseX} = cacheInfo;
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ScaleNode, {workIds:[Storage_Selector_key], box, dir, reverseY, reverseX, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
        }

    }, 100, {'leading':false})
    const computBox = (dir:Direction, delta:NumberSize) => {
        let reverseX = false;
        let reverseY = false;
        const box: {x: number, y: number, w: number, h: number} = {
            x: curSize.x,
            y: curSize.y,
            w: curSize.w, 
            h: curSize.h
        };
        switch (dir) {
            case "top":{
                const y = delta.height + curSize.h;
                if ( y < 0 ) {
                    reverseY = true;
                    box.y = curSize.y + curSize.h;
                    box.h = Math.abs(y);
                } else {
                    box.y = curSize.y - delta.height;
                    box.h = curSize.h + delta.height;
                }
                break;
            }
            case "topLeft": {
                const x = delta.width + curSize.w;
                if ( x < 0 ) {
                    reverseX = true;
                    box.x = curSize.x + curSize.w;
                    box.w = Math.abs(x);
                } else {
                    box.x = curSize.x - delta.width;
                    box.w = curSize.w + delta.width;
                }
                const y = delta.height + curSize.h;
                if ( y < 0 ) {
                    reverseY = true;
                    box.y = curSize.y + curSize.h;
                    box.h = Math.abs(y);
                } else {
                    box.y = curSize.y - delta.height;
                    box.h = curSize.h + delta.height;
                }
                break;
            }
            case "topRight":{
                const x = delta.width + curSize.w;
                if ( x < 0 ) {
                    reverseX = true;
                    box.x = curSize.x + x;
                    box.w = Math.abs(x);
                } else {
                    box.w = curSize.w + delta.width;
                }
                const y = delta.height + curSize.h;
                if ( y < 0 ) {
                    reverseY = true;
                    box.y = curSize.y + curSize.h;
                    box.h = Math.abs(y);
                } else {
                    box.y = curSize.y - delta.height;
                    box.h = curSize.h + delta.height;
                }
                break;               
            }
            case "bottom":{
                const y = delta.height + curSize.h;
                if ( y < 0 ) {
                    reverseY = true;
                    box.y = curSize.y + y;
                    box.h = Math.abs(y);
                } else {
                    box.h = curSize.h + delta.height;
                }
                break;               
            }
            case "bottomLeft": {
                const x = delta.width + curSize.w;
                if ( x < 0 ) {
                    reverseX = true;
                    box.x = curSize.x + curSize.w;
                    box.w = Math.abs(x);
                } else {
                    box.x = curSize.x - delta.width;
                    box.w = curSize.w + delta.width;
                }
                const y = delta.height + curSize.h;
                if ( y < 0 ) {
                    reverseY = true;
                    box.y = curSize.y + y;
                    box.h = Math.abs(y);
                } else {
                    box.h = curSize.h + delta.height;
                }
                break;
            }
            case "left":{
                const x = delta.width + curSize.w;
                if ( x < 0 ) {
                    reverseX = true;
                    box.x = curSize.x + curSize.w;
                    box.w = Math.abs(x);
                } else {
                    box.x = curSize.x - delta.width;
                    box.w = curSize.w + delta.width;
                }
                break;
            }
            case "bottomRight":{
                const x = delta.width + curSize.w;
                if ( x < 0 ) {
                    reverseX = true;
                    box.x = curSize.x + x;
                    box.w = Math.abs(x);
                } else {
                    box.w = curSize.w + delta.width;
                }
                const y = delta.height + curSize.h;
                if ( y < 0 ) {
                    reverseY = true;
                    box.y = curSize.y + y;
                    box.h = Math.abs(y);
                } else {
                    box.h = curSize.h + delta.height;
                }
                break;               
            }
            case "right":{
                const x = delta.width + curSize.w;
                if ( x < 0 ) {
                    reverseX = true;
                    box.x = curSize.x + x;
                    box.w = Math.abs(x);
                } else {
                    box.w = curSize.w + delta.width;
                }
                break;
            } 
            default:
                break;
        }
        return {box, reverseX, reverseY}
    }
    return (
        <Resizable className={`${className}`} 
            boundsByDirection={true}
            minWidth={-((floatBarData?.x || 0) + (floatBarData?.w || 0))}
            minHeight={-((floatBarData?.y || 0) + (floatBarData?.h || 0))}
            size={{
                width: floatBarData?.w || 0,
                height: floatBarData?.h || 0,
            }}
            style={{
                position:'absolute',
                pointerEvents:'auto',
                left: floatBarData?.x,
                top: floatBarData?.y,
            }}
            enable={ disabled ? false : {
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
    const [curPosition,setCurPosition]= useState<{x:number,y:number}>({x:0,y:0});
    const [workState, setWorkState]= useState<EvevtWorkState>(EvevtWorkState.Pending);
    const [disabled, setDisabled] = useState<boolean>(false);
    useEffect(()=>{
        MethodBuilderMain.activeListener(activeListener);
        return ()=>{
            MethodBuilderMain.unmountActiveListener(activeListener);
        }
    },[])
    const activeListener = (isActive:boolean) => {
        if (!isActive || floatBarData?.isLocked) {
            setDisabled(true)
            setWorkState(EvevtWorkState.Pending)
            setOperationType(EmitEventType.None);
            return;
        }
        setDisabled(false);
        if (maranger?.control.room?.disableDeviceInputs) {
            maranger.control.room.disableDeviceInputs = false;
        }
    }
    useEffect(()=>{
        if(isNumber(pos.x) && isNumber(pos.y) && (workState === EvevtWorkState.Pending || workState === EvevtWorkState.Done)){
            setCurPosition({x:pos.x,y:pos.y});
        }
    },[pos, workState])
    const onDragStartHandler = (e: DraggableEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            setWorkState(EvevtWorkState.Pending);
            return ;
        }
        if (isNumber(pos.x) && isNumber(pos.y)) {
            setOperationType(EmitEventType.SetPoint);
            setWorkState(EvevtWorkState.Start)
            if (maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = true;
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetPoint, {workId: Storage_Selector_key, pointMap, workState:EvevtWorkState.Start, viewId:maranger?.viewId})
        }
    }
    const onDragHandler = throttle((e: DraggableEvent, _pos: DraggableData) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            setWorkState(EvevtWorkState.Pending);
            return ;
        }
        const p = {x:_pos.x, y:_pos.y};
        if ((p.x !== pos?.x || p.y!== pos?.y) && maranger?.control.viewContainerManager ) {
            const nPoint = maranger.control.viewContainerManager.transformToScenePoint([p.x, p.y], maranger.viewId);
            const point = pointMap.get(id);
            if (point && type === 'start') {
                point[0] = nPoint
            }
            else if (point && type === 'end') {
                point[1] = nPoint
            }
            setWorkState(EvevtWorkState.Doing)
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetPoint, {workId: Storage_Selector_key, pointMap, workState: EvevtWorkState.Doing, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    const onDragEndHandler = throttle((e: DraggableEvent, _pos: DraggableData) =>{
        if (e.cancelable) {
            e.preventDefault();
        }
        if (maranger?.control.worker.isBusy) {
            setDisabled(true);
            setWorkState(EvevtWorkState.Pending);
            return ;
        }
        e.stopPropagation();
        setOperationType(EmitEventType.None);
        setWorkState(EvevtWorkState.Done)
        const p = {x:_pos.x, y:_pos.y};
        if (maranger?.control.viewContainerManager) {
            const nPoint = maranger.control.viewContainerManager.transformToScenePoint([p.x, p.y], maranger.viewId);
            const point = pointMap.get(id);
            if (point && type === 'start') {
                point[0] = nPoint;
            }
            else if (point && type === 'end') {
                point[1] = nPoint;
            }
            if (maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = false;
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetPoint, {workId: Storage_Selector_key, pointMap, workState: EvevtWorkState.Done, viewId:maranger?.viewId})
        }
    }, 100, {'leading':false})
    return (
        <Draggable
            disabled={disabled}
            position={curPosition}
            onStart={onDragStartHandler}
            onDrag={onDragHandler}
            onStop={onDragEndHandler}
        >
            <div className={'bezier-pencil-plugin-point-draggable-btn'}
                style= { floatBarData ? {
                    left: 0,
                    top: 0,
                } : undefined
            }>
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