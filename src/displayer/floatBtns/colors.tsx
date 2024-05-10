import React, { MouseEventHandler, TouchEventHandler, useContext, useEffect, useMemo, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { colorRGBA2Hex, hexToRgba, rgbToHex } from "../../collector/utils/color";
import { MethodBuilderMain } from "../../core/msgEvent";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import throttle from "lodash/throttle";
import { EvevtWorkState } from "../../core";
import { Storage_Selector_key } from "../../collector";
import { IconURL } from "../icons";
import { SubButProps, TextButProps } from "../types";

const HighlightSvg = () => (
    <svg style={{marginLeft: '2px'}} viewBox="0 0 1025 1024" width="14" height="14">
        <path d="M1016.5248 493.8752c-9.984-9.984-26.2144-9.984-36.1984 0l-183.6032 183.6032c-29.952 29.952-78.6944 29.952-108.5952 0l-239.2064-239.2064c-14.4384-14.4384-22.3744-33.6896-22.3744-54.3232s7.936-39.8848 22.3744-54.3232l183.6032-183.6032c9.984-9.984 9.984-26.2144 0-36.1984s-26.2144-9.984-36.1984 0l-183.6032 183.6032c-24.1152 24.1152-37.376 56.2176-37.376 90.5216 0 14.592 2.4576 28.8256 7.0656 42.1888l-374.8864 374.8864c-4.8128 4.8128-7.4752 11.3152-7.4752 18.1248l0 76.8c0 14.1312 11.4688 25.6 25.6 25.6l486.4 0c6.8096 0 13.312-2.7136 18.1248-7.4752l170.0864-170.0864c13.3632 4.6592 27.5968 7.0656 42.1888 7.0656 34.2528 0 66.4064-13.2608 90.5216-37.376l183.6032-183.6032c9.984-9.984 9.984-26.2144 0-36.1984zM501.4016 870.4l-450.2016 0 0-40.6016 358.5024-358.5024c1.024 1.0752 1.9968 2.1504 3.0208 3.1744l239.2064 239.2064c1.024 1.024 2.0992 2.048 3.1744 3.0208l-153.7024 153.7024z" fill="#000000"></path>
    </svg>   
)
const NoneColorBtn = (props: {
    activeColor?: string;
    onClickHandler: MouseEventHandler<HTMLDivElement>;
    onTouchEndHandler: TouchEventHandler<HTMLDivElement>;
}) => {
    const { activeColor, onClickHandler, onTouchEndHandler } = props;
    return (
        <div className={`font-color-button ${'transparent' === activeColor ? 'active' : ''}`} 
            onClick={onClickHandler} onTouchEnd={onTouchEndHandler}>
            <div className="circle none" ></div>
        </div>
    )
}
const ColorBtn = (props: {
    color: string;
    activeColor?: string;
    onClickHandler: MouseEventHandler<HTMLDivElement>;
    onTouchEndHandler: TouchEventHandler<HTMLDivElement>;
}) => {
    const { color, activeColor, onClickHandler, onTouchEndHandler } = props;
    return (
        <div className={`font-color-button ${color === activeColor ? 'active' : ''}`} 
            onClick={onClickHandler} onTouchEnd={onTouchEndHandler}>
            <div className="circle" style={{backgroundColor: hexToRgba(color, 1)}} ></div>
        </div>
    )
}
const OpacityBtn = (props: {
    opacity: number;
    activeColor?: string;
    setCurOpacity: (opacity: number, curColor:string, workState: EvevtWorkState) => void;
}) => {
    const { opacity, activeColor, setCurOpacity} = props;
    const [position, setPosition] = useState({x: 108, y: 0})
    useEffect(()=>{
        setPosition({x: opacity * 100 + 8, y: 0})
    },[])
    if (!activeColor) {
        return null;
    }
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        if (pos.x !== position?.x) {
            setPosition({x: pos.x,y:0})
        }
        const curOpacity = Math.min(Math.max(pos.x - 8, 0), 100) / 100;
        if (opacity!== curOpacity) {
            setCurOpacity(curOpacity, activeColor, EvevtWorkState.Doing)
        }
    }, 100, {'leading':false})
    const onDragStartHandler = (e: DraggableEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurOpacity(opacity, activeColor, EvevtWorkState.Start)
    }
    const onDragEndHandler = throttle((e: DraggableEvent,
        pos: DraggableData) => {
        e.preventDefault();
        e.stopPropagation();
        if (pos.x !== position?.x) {
            setPosition({x: pos.x,y:0})
        }
        const curOpacity = Math.min(Math.max(pos.x - 8, 0), 100) / 100;
        setCurOpacity(curOpacity, activeColor, EvevtWorkState.Done)
    }, 100, {'leading':false})
    return (
        <div className={'font-color-opacity'} style={{marginLeft: '10px'}}
            onClick={(e)=>{
                // console.log('first1', e.nativeEvent.offsetX)
                const x = e.nativeEvent.offsetX;
                const curOpacity = Math.min(Math.max(x - 12, 0), 100) / 100;
                setPosition({x: curOpacity * 100 + 8, y: 0})
                setCurOpacity(curOpacity, activeColor, EvevtWorkState.Done)
            }}
        >
            <div className="range-color"
                style={{
                    background: `linear-gradient(to right, ${hexToRgba(activeColor, 0)}, ${hexToRgba(activeColor, 1)})`
                }}
            >
            </div>
            <div className="range-opacity">
                <Draggable bounds="parent" axis="x"
                    position={position}
                    onDrag={onDragHandler}
                    onStart={onDragStartHandler}
                    onStop={onDragEndHandler}
                >
                    <div className="circle"
                        style={{
                            backgroundColor: hexToRgba(activeColor, opacity)
                        }}
                        onClick={(e)=>{
                            e?.preventDefault();
                            e?.stopPropagation();
                        }}
                    ></div>
                </Draggable>
            </div>
        </div>
    )
}
export const StrokeColors = (props:SubButProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, floatBarRef} = props;
    const {floatBarData, floatBarColors, maranger, position, setFloatBarData} = useContext(DisplayerContext);
    // const [showSubBtn, setShowSubBtn] = useState(open);
    const [activeColor,setColor] = useState<string>();
    const [opacity,setOpacity] = useState<number>(1);
    useEffect(()=>{
        if (floatBarData?.strokeColor) {
            const [hex, opacity] = colorRGBA2Hex(floatBarData.strokeColor);
            // console.log('useEffect', floatBarData?.strokeColor, hex, opacity)
            setColor(hex);
            setOpacity(opacity);
        }
    }, [floatBarData])
    const subBtnStyle = useMemo(()=>{
        if (floatBarRef?.current && position && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + position.y > 180) {
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            } 
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - position.y < 120){
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, position, maranger])
    const SubOpacityBtn = useMemo(()=>{
        return <OpacityBtn key={'strokeColors'} opacity={opacity} activeColor={activeColor} setCurOpacity={(curOpacity, curColor, workState)=>{
            if (workState === EvevtWorkState.Start && maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = true;
            }
            if (workState === EvevtWorkState.Done && maranger?.control.room) {
                maranger.control.room.disableDeviceInputs = false;
            }
            setOpacity(curOpacity);
            const strokeColor = hexToRgba(curColor,curOpacity);
            if ( floatBarData?.strokeColor) {
                floatBarData.strokeColor = strokeColor;
                setFloatBarData({strokeColor});
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], strokeColor, workState, viewId:maranger?.viewId})
        }} />
    },[opacity, activeColor, maranger?.control.room, maranger?.viewId, floatBarData])
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="font-colors-menu" style={ subBtnStyle }
                    onTouchEnd={(e)=>{
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                >
                    {
                        floatBarColors.concat().map((c, index)=>{
                            const curColor = rgbToHex(...c);
                            return (
                                <ColorBtn key={index} color={curColor} activeColor={activeColor} 
                                    onTouchEndHandler={(e) => {
                                        e.stopPropagation();
                                        setColor(curColor);
                                        const strokeColor = hexToRgba(curColor,opacity);
                                        if ( floatBarData?.strokeColor) {
                                            floatBarData.strokeColor = strokeColor;
                                            setFloatBarData({strokeColor});
                                        }
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], strokeColor, viewId:maranger?.viewId})
                                    }}
                                    onClickHandler={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setColor(curColor);
                                        const strokeColor = hexToRgba(curColor,opacity);
                                        if ( floatBarData?.strokeColor) {
                                            floatBarData.strokeColor = strokeColor;
                                            setFloatBarData({strokeColor});
                                        }
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], strokeColor, viewId:maranger?.viewId})
                                    }}
                                />
                            )
                        })
                    }
                    {SubOpacityBtn}
                </div>
            )
        }
        return null
    }, [showSubBtn, floatBarColors, SubOpacityBtn, activeColor, opacity, floatBarData, maranger?.viewId, subBtnStyle])
    const RingBar = useMemo(() => {
        if (activeColor) {
            return (
                <div className="color-bar-ring" style={{backgroundColor: hexToRgba(activeColor, opacity)}}>
                    <div className="circle"></div>
                </div>
            )
        }
        return null;
    },[activeColor, opacity])
    return (
        <div className={`button normal-button font-colors-icon ${showSubBtn && 'active'}`}
            onTouchEnd={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
            onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
        >
            {RingBar}
            {SubBtns}
        </div>
    )
}
export const FillColors = (props:SubButProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, floatBarRef} = props;
    const { floatBarData, floatBarColors, maranger, position, setFloatBarData} = useContext(DisplayerContext);
    const [activeColor,setColor] = useState<string>();
    const [opacity,setOpacity] = useState<number>(1);
    useEffect(()=>{
        if (floatBarData?.fillColor) {
            const [hex, opacity] = floatBarData?.fillColor === 'transparent' && ['transparent', 1] || colorRGBA2Hex(floatBarData.fillColor);
            setColor(hex);
            setOpacity(opacity);
        }
    }, [floatBarData])
    const subBtnStyle = useMemo(()=>{
        if (floatBarRef?.current && position && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + position.y > 200) {
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            } 
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - position.y < 140){
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, position, maranger])
    const SubOpacityBtn = useMemo(()=>{
        if( activeColor && activeColor !== 'transparent'){
            return <OpacityBtn key={'fillColors'} opacity={opacity || 0} activeColor={activeColor} setCurOpacity={(curOpacity, curColor, workState)=>{
                if (workState === EvevtWorkState.Start && maranger?.control.room) {
                    maranger.control.room.disableDeviceInputs = true;
                }
                if (workState === EvevtWorkState.Done && maranger?.control.room) {
                    maranger.control.room.disableDeviceInputs = false;
                }
                setOpacity(curOpacity);
                const fillColor = hexToRgba(curColor,curOpacity);
                if ( floatBarData?.fillColor) {
                    floatBarData.fillColor = fillColor;
                    setFloatBarData({fillColor});
                }
                MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                    EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fillColor: activeColor && hexToRgba(curColor, curOpacity), workState, viewId:maranger?.viewId})
            }} />
        }
        return null
    },[activeColor, opacity, maranger?.control.room, maranger?.viewId, floatBarData]);
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="font-colors-menu" style={ subBtnStyle }
                    onTouchEnd={(e)=>{
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                >
                    <NoneColorBtn activeColor={activeColor} 
                        onTouchEndHandler={(e) => {
                            e.stopPropagation();
                            setColor('transparent');
                            const fillColor = 'transparent';
                            if ( floatBarData?.fillColor) {
                                floatBarData.fillColor = fillColor;
                                setFloatBarData({fillColor});
                            }
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fillColor, viewId:maranger?.viewId})
                        }}
                        onClickHandler={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setColor('transparent');
                            const fillColor = 'transparent';
                            if ( floatBarData?.fillColor) {
                                floatBarData.fillColor = fillColor;
                                setFloatBarData({fillColor});
                            }
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fillColor, viewId:maranger?.viewId})
                        }}
                    />
                    {
                        floatBarColors.map((c, index)=>{
                            const curColor = rgbToHex(...c);
                            return (
                                <ColorBtn key={index} color={curColor} activeColor={activeColor} 
                                    onTouchEndHandler={(e) => {
                                        e.stopPropagation();
                                        setColor(curColor);
                                        const fillColor = hexToRgba(curColor,opacity);
                                        if ( floatBarData?.fillColor) {
                                            floatBarData.fillColor = fillColor;
                                            setFloatBarData({fillColor});
                                        }
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fillColor, viewId:maranger?.viewId})
                                    }}
                                    onClickHandler={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setColor(curColor);
                                        const fillColor = hexToRgba(curColor,opacity);
                                        if ( floatBarData?.fillColor) {
                                            floatBarData.fillColor = fillColor;
                                            setFloatBarData({fillColor});
                                        }
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fillColor, viewId:maranger?.viewId})
                                    }}
                                />
                            )
                        })
                    }
                    {SubOpacityBtn}
                </div>
            )
        }
        return null
    }, [showSubBtn, activeColor, floatBarColors, SubOpacityBtn, floatBarData, maranger?.viewId, opacity, subBtnStyle])
    const ColorBar = useMemo(() => {
        const backgroundColor = activeColor && activeColor !== 'transparent' && hexToRgba(activeColor, opacity) || 'transparent';
        return (
            <div className="color-bar-fill">
                <div className="circle" style={{backgroundColor}}></div>
            </div>
        )
    },[activeColor, opacity])
    return (
        <div className={`button normal-button font-colors-icon ${showSubBtn && 'active'}`}
            onTouchEnd={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
            onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
        >
            {ColorBar}
            {SubBtns}
        </div>
    )
}
export const TextColors = (props:TextButProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, textOpt, workIds, floatBarRef} = props;
    const { floatBarColors, maranger, position, setFloatBarData, floatBarData} = useContext(DisplayerContext);
    const [activeColor,setColor] = useState<string>();
    const [opacity,setOpacity] = useState<number>(1);
    useEffect(()=>{
        if (textOpt?.fontColor) {
            const [hex, opacity] = textOpt?.fontColor === 'transparent' && ['transparent', 0] || colorRGBA2Hex(textOpt.fontColor);
            // console.log('useEffect', textOpt?.fontColor, hex, opacity)
            setColor(hex);
            setOpacity(opacity);
        }
    }, [textOpt?.fontColor])
    const subBtnStyle = useMemo(()=>{
        if (floatBarRef?.current && position && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + position.y > 180) {
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            } 
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - position.y < 120){
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, position, maranger])
    const SubOpacityBtn = useMemo(()=>{
        if (activeColor && activeColor !== 'transparent') {
            return <OpacityBtn key={'fontColors'} opacity={opacity} activeColor={activeColor} setCurOpacity={(curOpacity, curColor, workState)=>{
                if (workState === EvevtWorkState.Start && maranger?.control.room) {
                    maranger.control.room.disableDeviceInputs = true;
                }
                if (workState === EvevtWorkState.Done && maranger?.control.room) {
                    maranger.control.room.disableDeviceInputs = false;
                }
                setOpacity(curOpacity);
                const fontColor = hexToRgba(curColor,curOpacity);
                if ( floatBarData?.textOpt) {
                    floatBarData.textOpt.fontColor = fontColor;
                    setFloatBarData({textOpt:floatBarData.textOpt});
                }
                MethodBuilderMain.emitMethod(
                    InternalMsgEmitterType.MainEngine, 
                    EmitEventType.SetColorNode, {
                        workIds: workIds || [Storage_Selector_key], 
                        fontColor: activeColor && fontColor, 
                        workState, 
                        viewId: maranger?.viewId
                    }
                )
            }} />
        }
        return null;
    },[activeColor, opacity, maranger?.control.room, maranger?.viewId, floatBarData?.textOpt, workIds])
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="font-colors-menu"  style={ subBtnStyle }
                    onTouchEnd={(e)=>{
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                >
                    {
                        floatBarColors.map((c, index)=>{
                            const curColor = rgbToHex(...c);
                            return (
                                <ColorBtn key={index} color={curColor} activeColor={activeColor} 
                                    onTouchEndHandler={(e) => {
                                        e.stopPropagation();
                                        setColor(curColor);
                                        const fontColor = hexToRgba(curColor,opacity);
                                        if ( floatBarData?.textOpt) {
                                            floatBarData.textOpt.fontColor = fontColor;
                                            setFloatBarData({textOpt:floatBarData.textOpt});
                                        }
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: workIds || [Storage_Selector_key], fontColor, viewId: maranger?.viewId})
                                    }}
                                    onClickHandler={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setColor(curColor);
                                        const fontColor = hexToRgba(curColor,opacity);
                                        if ( floatBarData?.textOpt) {
                                            floatBarData.textOpt.fontColor = fontColor;
                                            setFloatBarData({textOpt:floatBarData.textOpt});
                                        }
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: workIds || [Storage_Selector_key], fontColor, viewId: maranger?.viewId})
                                    }}
                                />
                            )
                        })
                    }
                    {SubOpacityBtn}
                </div>
            )
        }
        return null
    }, [showSubBtn, floatBarColors, SubOpacityBtn, activeColor, opacity, floatBarData?.textOpt, workIds, maranger?.viewId, subBtnStyle])
    const ColorBar = useMemo(() => {
        const backgroundColor = activeColor && activeColor !== 'transparent' && hexToRgba(activeColor, opacity) || 'transparent';
        return (
            <div className="color-bar">
                <div className="color-bar-color" style={{backgroundColor}}></div>
            </div>
        )
    },[activeColor, opacity])
    return (
        <div className={`button normal-button font-colors-icon ${showSubBtn && 'active'}`}
            onTouchEnd={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
            onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
        >
            <img alt="icon" src={IconURL('font-colors')}/>
            {ColorBar}
            {SubBtns}
        </div>
    )
}
export const TextBgColors = (props:TextButProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, textOpt, floatBarRef} = props;
    const { floatBarColors, maranger, position} = useContext(DisplayerContext);
    const [activeColor,setColor] = useState<string>();
    const [opacity,setOpacity] = useState<number>(1);
    useEffect(()=>{
        if (textOpt?.fontBgColor) {
            const [hex, opacity] = textOpt?.fontBgColor === 'transparent' && ['transparent', 0] || colorRGBA2Hex(textOpt.fontBgColor);
            // console.log('useEffect', floatBarData?.strokeColor, hex, opacity)
            setColor(hex);
            setOpacity(opacity);
        }
    }, [textOpt?.fontBgColor])
    const subBtnStyle = useMemo(()=>{
        if (floatBarRef?.current && position && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + position.y > 150) {
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            } 
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - position.y < 140){
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, position, maranger])
    const SubOpacityBtn = useMemo(()=>{
        if (activeColor && activeColor !== 'transparent') {
            return <OpacityBtn key={'fontColors'} opacity={opacity} activeColor={activeColor} setCurOpacity={(curOpacity, curColor, workState)=>{
                if (workState === EvevtWorkState.Start && maranger?.control.room) {
                    maranger.control.room.disableDeviceInputs = true;
                }
                if (workState === EvevtWorkState.Done && maranger?.control.room) {
                    maranger.control.room.disableDeviceInputs = false;
                }
                setOpacity(curOpacity);
                MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                    EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fontBgColor: activeColor && hexToRgba(curColor,curOpacity), workState, viewId:maranger?.viewId})
            }} />
        }
        return null
    },[activeColor, opacity, maranger])
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="font-colors-menu" style={ subBtnStyle }
                    onTouchEnd={(e)=>{
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                >
                    <NoneColorBtn activeColor={activeColor} 
                        onTouchEndHandler={(e) => {
                            e.stopPropagation();
                            setColor('transparent');
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fontBgColor: 'transparent', viewId: maranger?.viewId})
                        }}
                        onClickHandler={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setColor('transparent');
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fontBgColor: 'transparent', viewId: maranger?.viewId})
                        }}
                    />
                    {
                        floatBarColors.map((c, index)=>{
                            const curColor = rgbToHex(...c);
                            return (
                                <ColorBtn key={index} color={curColor} activeColor={activeColor} 
                                    onTouchEndHandler={(e) => {
                                        e.stopPropagation();
                                        setColor(curColor);
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fontBgColor: hexToRgba(curColor,opacity), viewId: maranger?.viewId})
                                    }}
                                    onClickHandler={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setColor(curColor);
                                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                            EmitEventType.SetColorNode, {workIds: [Storage_Selector_key], fontBgColor: hexToRgba(curColor,opacity), viewId: maranger?.viewId})
                                    }}
                                />
                            )
                        })
                    }
                    {SubOpacityBtn}
                </div>
            )
        }
        return null
    }, [showSubBtn, floatBarColors, SubOpacityBtn, opacity, activeColor, maranger, subBtnStyle])
    const ColorBar = useMemo(() => {
        const backgroundColor = activeColor && activeColor !== 'transparent' && hexToRgba(activeColor, opacity) || 'transparent';
        return (
            <div className="color-bar" style={{marginTop: 0}}>
                <div className="color-bar-color" style={{backgroundColor}}></div>
            </div>
        )
    },[activeColor, opacity])
    return (
        <div className={`button normal-button font-colors-icon ${showSubBtn && 'active'}`}
            onTouchEnd={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
            onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
        >
            <HighlightSvg/>
            {ColorBar}
            {SubBtns}
        </div>
    )
}