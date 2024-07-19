/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IconURL } from "../icons";
import { EmitEventType, InternalMsgEmitterType, SpeechBalloonPlacement, ApplianceViewManagerLike } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";
import { EToolsKey } from "../../core";
import { DisplayerContext } from "../../plugin/displayerView";
import { ShapeOptButProps, ShapeOptType } from "../types";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import {throttle, isNumber, isEqual, isBoolean} from "lodash";
import { SpeechBalloonPlacements } from "../const";
const InputNumberBtn = (props: {
    icon:string;
    min:number;
    max:number;
    step:number;
    value:number;
    onInputHandler:(value:number)=>void;
}) => {
    const { icon, min, max, step, value, onInputHandler } = props;
    const [num, setNum] = useState<number>(0);
    const ref = useRef<HTMLInputElement>(null);
    const checkValue = (number:number)=>{
        if(number > max) number = max;
        if(number < min) number = min;
        setNum(number);
        onInputHandler(number);
        if(ref.current){
            ref.current.value = number.toString(); 
        }
    }
    useEffect(()=>{
        if (value) {
            setNum(value);
            if(ref.current){
                ref.current.value = value.toString(); 
            }
        }
    }, [value]);
    return (
        <div className="button input-button"
            onTouchEnd={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
            }}
            onClick={(e)=>{
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
            }}
        >
            <img src={IconURL(icon)}/>
            <input className="input-number" type="text" ref={ref}
                onTouchEnd={()=>{
                    if (ref.current) {
                        ref.current.focus();
                    }
                }}
                onClick={()=>{
                    if (ref.current) {
                        ref.current.focus();
                    }
                }}
                onKeyDown={(e)=>{
                    if (e.key === 'Backspace') {
                        // 获取光标位置
                        const selection = window.getSelection();
                        const range = selection?.getRangeAt(0);
                        // 检查是否有选区文本，如果有则正常删除
                        if (range?.collapsed) {
                            if (e.cancelable) {
                                e.preventDefault();
                            }
                            // 执行删除操作，这里可以根据具体需求调整删除逻辑
                            document.execCommand('delete', false);
                            return false;
                        }
                    }
                }}
                onKeyUp={()=>{
                    if (ref.current) {
                        const value = ref.current.value;
                        const number = parseInt(value);
                        if (!isNaN(number)) {
                            ref.current.value = number.toString()
                        } else {
                            ref.current.value = '0';
                        }
                    }
                }}
                onChange={(e)=>{
                    const value = e.target.value;
                    const number = parseInt(value);
                    if (number && number && number >= min && number<= max) {
                        checkValue(number);
                    }
                }}
            />
            <div className="input-number-btns">
                <div className="input-number-add" 
                    onClick={()=>{
                        checkValue(num+step)
                    }} 
                    onTouchEnd={()=>{
                        checkValue(num+step)
                    }}
                ></div>
                <div className="input-number-cut" 
                    onClick={()=>{
                        checkValue(num-step)
                    }}
                    onTouchEnd={()=>{
                        checkValue(num-step)
                    }}
                ></div>
            </div>
        </div>
    )
}
const InputRangeBtn = (props: {
    icon:string;
    min:number;
    max:number;
    step:number;
    value:number;
    onInputHandler:(value:number)=>void;
}) => {
    const { icon,min,max,step, value, onInputHandler } = props;
    return (
        <div className="button input-button">
            <img src={IconURL(icon)}/>
            <InputRangeUIBtn min={min} max={max} step={step} value={value} onInputHandler={onInputHandler}/>
        </div>
    )
}
const InputRangeUIBtn = (props: {
    min:number;
    max:number;
    step:number;
    value:number;
    onInputHandler:(value:number)=>void;
}) => {
    const { value, min, max, onInputHandler} = props;
    const [position, setPosition] = useState({x: 0, y: 0})
    useEffect(()=>{
        setPosition({x: value * 100, y: 0})
    },[])
    const onDragHandler = throttle((e, pos) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        let isRightX = Math.floor(Math.max(pos.x, min * 100));
        isRightX = Math.floor(Math.min(isRightX, max * 100));
        if (pos.x !== position?.x) {
            setPosition({x: isRightX,y:0})
        }
        const curValue = isRightX / 100;
        if (value!== curValue) {
            onInputHandler(curValue)
        }
    }, 100, {'leading':false})
    const onDragStartHandler = (e: DraggableEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
    }
    const onDragEndHandler = throttle((e: DraggableEvent, pos: DraggableData) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        let isRightX = Math.floor(Math.max(pos.x, min * 100));
        isRightX = Math.floor(Math.min(isRightX, max * 100));
        if (pos.x !== position?.x) {
            setPosition({x: isRightX,y:0})
        }
        const curValue = isRightX / 100;
        if (value!== curValue) {
            onInputHandler(curValue)
        }
    }, 100, {'leading':false})
    return (
        <div className={'range-number-container'}
            onClick={(e)=>{
                const x = e.nativeEvent.offsetX - 6;
                let isRightX = Math.floor(Math.max(x, min * 100));
                isRightX = Math.floor(Math.min(isRightX, max * 100));
                setPosition({x: isRightX, y: 0})
                const curValue = isRightX / 100;
                if (value!== curValue) {
                    onInputHandler(curValue)
                }
            }}
        >
            <div className="range-number-color"></div>
            <div className="range-number">
                <Draggable bounds="parent" axis="x"
                    position={position}
                    onDrag={onDragHandler}
                    onStart={onDragStartHandler}
                    onStop={onDragEndHandler}
                >
                    <div className="circle" onClick={onDragStartHandler}></div>
                </Draggable>
            </div>
        </div>
    )
}
const SelectPlacementBtn = (props: {
    icon:string;
    value:SpeechBalloonPlacement;
    style?: React.CSSProperties;
    onChangeHandler:(value:SpeechBalloonPlacement)=>void;
}) => {
    const { icon, value, onChangeHandler, style} = props;
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [showSubBtn, setShowSubBtn] = useState<boolean>();
    const ref = useRef<HTMLInputElement>(null);
    const checkValue = useCallback((index:number)=>{
        if(index >= SpeechBalloonPlacements.length) index = 0;
        if(index < 0) index = SpeechBalloonPlacements.length - 1;
        setOptionIndex(index);
        onChangeHandler(SpeechBalloonPlacements[index]);
        setShowSubBtn(false)
        if(ref.current){
            ref.current.value = SpeechBalloonPlacements[index]; 
        }
    },[onChangeHandler])
    const subBtnStyle = useMemo(()=>{
        if (style && style.bottom) {
            const value:React.CSSProperties = {};
            value.top = 'inherit';
            value.bottom = 50;
            return value;
        }
        return undefined;
    }, [style])
    useEffect(()=>{
        if (value) {
            setOptionIndex(SpeechBalloonPlacements.indexOf(value));
            if(ref.current){
                ref.current.value = value; 
            }
        }
    }, [value]);
    const SubBtnUI = useMemo(() => {
        if (showSubBtn) {
            return <SelectOptionBtns options={SpeechBalloonPlacements} onClickHandler={checkValue} style={subBtnStyle}/>
        }
        return null
    }, [showSubBtn, checkValue, subBtnStyle])
    return (
        <div className="button input-button">
            <img src={IconURL(icon)}/>
            <input readOnly className="input-number" type="text" ref={ref}
                onTouchEnd={(e)=>{
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    e.stopPropagation();
                    if (ref.current) {
                        ref.current.focus();
                        // setShowSubBtn(!showSubBtn);
                    }
                }}
                onClick={(e)=>{
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    e.stopPropagation();
                    if (ref.current) {
                        ref.current.focus();
                        setShowSubBtn(!showSubBtn);
                    }
                }}
            />
            <div className="input-number-btns">
                <div className="input-number-add" 
                    onClick={(e)=>{
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                        e.stopPropagation();
                        checkValue(optionIndex+1)
                    }} 
                    onTouchEnd={(e)=>{
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                        e.stopPropagation();
                        checkValue(optionIndex+1)
                    }}
                ></div>
                <div className="input-number-cut" 
                    onClick={(e)=>{
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                        e.stopPropagation();
                        checkValue(optionIndex-1)
                    }}
                    onTouchEnd={(e)=>{
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                        e.stopPropagation();
                        checkValue(optionIndex-1)
                    }}
                ></div>
            </div>
            {SubBtnUI}
        </div>
    )
}
const SelectOptionBtns = (props:{
    options: SpeechBalloonPlacement[];
    style?: React.CSSProperties;
    onClickHandler:(number:number)=>void;
}) =>{
    const {options, style, onClickHandler} = props;
    return (
        <div className="select-option-menu" style={ style }
            onTouchEnd={(e)=>{
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
            }}
            onClick={(e)=>{
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
            }}
        >
            {
                options.map((s,index)=>(
                    <div className="select-option-btn" key={s} 
                        onClick={(e)=>{
                            if (e.cancelable) {
                                e.preventDefault();
                            }
                            e.stopPropagation();
                            onClickHandler(index)
                        }}
                        onTouchEnd={(e)=>{
                            if (e.cancelable) {
                                e.preventDefault();
                            }
                            e.stopPropagation();
                            onClickHandler(index)
                        }}
                    >{s}</div>
                ))
            }
        </div>
    )
}
const StarFormView = (props: {
    vertices: number;
    innerVerticeStep: number;
    innerRatio: number;
    maranger: ApplianceViewManagerLike;
}) => {
    const {maranger, innerRatio, innerVerticeStep, vertices} = props;
    const onInputVerticesHandler=(vertices:number)=>{
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetShapeOpt, {workIds:[Storage_Selector_key], toolsType: EToolsKey.Star, 
            viewId:maranger.viewId, vertices})
    }
    const onInputInnerVertexHandler=(innerVerticeStep:number)=>{
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetShapeOpt, {workIds:[Storage_Selector_key], toolsType: EToolsKey.Star, 
            viewId:maranger.viewId, innerVerticeStep})
    }
    const onInputInnerRatioHandler=(innerRatio:number)=>{
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetShapeOpt, {workIds:[Storage_Selector_key], toolsType: EToolsKey.Star, 
            viewId:maranger.viewId, innerRatio})
    }
    return (
        <>
            <InputNumberBtn value={vertices} icon="polygon-vertex" min={3} max={100} step={1} onInputHandler={onInputVerticesHandler}/>
            <InputNumberBtn value={innerVerticeStep} icon="star-innerVertex" min={1} max={100} step={1} onInputHandler={onInputInnerVertexHandler}/>
            <InputRangeBtn value={innerRatio} icon="star-innerRatio" min={0.1} max={1} step={0.1} onInputHandler={onInputInnerRatioHandler}/>
        </>
    )
}
const PolygonFormView = (props: {
    vertices: number;
    maranger: ApplianceViewManagerLike
}) => {
    const {maranger, vertices} = props;
    const onInputHandler=(vertices:number)=>{
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetShapeOpt, {workIds:[Storage_Selector_key], toolsType: EToolsKey.Polygon, 
            viewId:maranger.viewId, vertices})
    }
    return (
        <InputNumberBtn value={vertices} icon="polygon-vertex" min={3} max={100} step={1} onInputHandler={onInputHandler}/>
    )
}
const SpeechBalloonFormView = (props: {
    placement: SpeechBalloonPlacement;
    maranger: ApplianceViewManagerLike;
}) => {
    const {maranger, placement} = props;

    const onChangeHandler=(placement:SpeechBalloonPlacement)=>{
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetShapeOpt, {workIds:[Storage_Selector_key], toolsType: EToolsKey.SpeechBalloon, 
            viewId:maranger.viewId, placement})
    }
    return (
        <SelectPlacementBtn value={placement} icon="speechBallon-placement" onChangeHandler={onChangeHandler}/>
    )
}
const SubTab = (props: {
    isActive:boolean;
    icon:string;
    onClickHandler:(e: any)=>void;
    onTouchEndHandler:(e: any)=>void;
}) => {
    const { icon, isActive, onClickHandler, onTouchEndHandler } = props;
    return (
        <div className={`button tab-button ${isActive? "active" : ""}`} onClick={onClickHandler} onTouchEnd={onTouchEndHandler}>
            <img src={IconURL(icon)}/>
        </div>
    )
}
const SubBtns = (props:{
    shapeOpt: ShapeOptType;
    toolsTypes: EToolsKey[];
    style?: React.CSSProperties;
    maranger: ApplianceViewManagerLike
}) => {
    const {toolsTypes, style, maranger, shapeOpt} = props;
    const [toolsType, setToolsType] = useState<EToolsKey>();
    useEffect(()=>{
        if (toolsTypes.includes(EToolsKey.Polygon)) {
            setToolsType(EToolsKey.Polygon)
        } else 
        if (toolsTypes.includes(EToolsKey.Star)){
            setToolsType(EToolsKey.Star)
        } else {
            setToolsType(EToolsKey.SpeechBalloon)
        }
    },[toolsTypes])
    const onClickTabHandler = (type:EToolsKey, e:any) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e?.stopPropagation();
        setToolsType(type);
    }
    const PolygonForm = useMemo(()=>{
        if(toolsType === EToolsKey.Polygon && maranger && shapeOpt.vertices){
            return <PolygonFormView vertices={shapeOpt.vertices} maranger={maranger}/>
        }
        return null
    },[maranger, toolsType, shapeOpt])
    const StarForm = useMemo(()=>{
        if(toolsType === EToolsKey.Star && maranger && shapeOpt.vertices && shapeOpt.innerVerticeStep && shapeOpt.innerRatio){
            return <StarFormView maranger={maranger} vertices={shapeOpt.vertices} innerVerticeStep={shapeOpt.innerVerticeStep} innerRatio={shapeOpt.innerRatio}/>
        }
        return null
    },[maranger, toolsType, shapeOpt])
    const SpeechBalloonForm = useMemo(()=>{
        if(toolsType === EToolsKey.SpeechBalloon && maranger && shapeOpt.placement){
            return <SpeechBalloonFormView maranger={maranger} placement={shapeOpt.placement}/>
        }
        return null
    },[maranger, toolsType, shapeOpt])
    return (
        <div className="shapeOpt-sub-menu" style={ style }
            onClick={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                if (e.cancelable) {
                    e.preventDefault();
                }
            }}
        >
            <div className="shapeOpt-sub-menu-tabs">
                {
                    toolsTypes.includes(EToolsKey.Polygon) && <SubTab isActive={toolsType === EToolsKey.Polygon} icon={toolsType === EToolsKey.Polygon ? "polygon-active" : "polygon"} onClickHandler={onClickTabHandler.bind(this,EToolsKey.Polygon)} onTouchEndHandler={onClickTabHandler.bind(this,EToolsKey.Polygon)}/> || null
                }
                {
                    toolsTypes.includes(EToolsKey.Star) && <SubTab isActive={toolsType === EToolsKey.Star} icon={toolsType === EToolsKey.Star ? "star-active" : "star"} onClickHandler={onClickTabHandler.bind(this,EToolsKey.Star)} onTouchEndHandler={onClickTabHandler.bind(this,EToolsKey.Star)}/> || null
                }
                {
                    toolsTypes.includes(EToolsKey.SpeechBalloon) && <SubTab isActive={toolsType === EToolsKey.SpeechBalloon} icon={toolsType === EToolsKey.SpeechBalloon ? "speechBallon-active" : "speechBallon"} onClickHandler={onClickTabHandler.bind(this,EToolsKey.SpeechBalloon)} onTouchEndHandler={onClickTabHandler.bind(this,EToolsKey.SpeechBalloon)}/> || null
                }
            </div>
            <div className="shapeOpt-sub-menu-content">
                {PolygonForm}
                {StarForm}
                {SpeechBalloonForm}
            </div>
        </div>
    )
}

export const ShapeOpt = (props:ShapeOptButProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, floatBarRef, toolsTypes, shapeOpt} = props;
    const {floatBarData, maranger} = useContext(DisplayerContext);
    const [selectIds,setSelectIds] = useState<string[]>([]);
    const [oldDisableDeviceInputs, setOldDisableDeviceInputs] = useState<boolean>();
    const subBtnStyle = useMemo(()=>{
        if (floatBarRef?.current && isNumber(floatBarData?.x) && isNumber(floatBarData?.y) && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + floatBarData.y > 200) {
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            } 
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - floatBarData?.y < 140){
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, floatBarData?.x, floatBarData?.y, maranger?.height])
    const SubBtnUI = useMemo(() => {
        if (showSubBtn && toolsTypes && maranger && shapeOpt) {
            if (maranger.control.room && !maranger.control.room.disableDeviceInputs) {
                setOldDisableDeviceInputs(maranger.control.room.disableDeviceInputs);
                maranger.control.room.disableDeviceInputs = true;
            }
            return <SubBtns shapeOpt={shapeOpt} style={subBtnStyle} toolsTypes={toolsTypes} maranger={maranger} />
        }
        if( maranger?.control.room && isBoolean(oldDisableDeviceInputs)) {
            maranger.control.room.disableDeviceInputs = oldDisableDeviceInputs;
        }
        return null
    }, [showSubBtn, subBtnStyle, toolsTypes, maranger, shapeOpt])
    const onClickHandler = (e:any) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive)
    }
    const onTouchEndHandler = (e:any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive)
    }
    useEffect(()=>{
        if (!isEqual(floatBarData?.selectIds, selectIds)) {
            if (floatBarData?.selectIds && !isEqual(floatBarData?.selectIds, selectIds)) {
                setSelectIds(floatBarData?.selectIds);
                setShowSubBtn(false)
            }
        }
    },[showSubBtn, floatBarData, selectIds, setShowSubBtn])
    useEffect(()=>{
        return ()=> {
            if (showSubBtn) {
                if( maranger?.control.room && isBoolean(oldDisableDeviceInputs)) {
                    maranger.control.room.disableDeviceInputs = oldDisableDeviceInputs;
                }
            }
        }
    },[showSubBtn, maranger, oldDisableDeviceInputs])
    return (
        <div className={`button normal-button ${showSubBtn && 'active'}`}
            onClick={onClickHandler}
            onTouchEnd={onTouchEndHandler}
        >
            {SubBtnUI}
            <img alt="icon" src={IconURL(showSubBtn ? 'shapes-active': 'shapes')}/>
        </div>
    )
}