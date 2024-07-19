/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import { TextButProps } from "../types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { Storage_Selector_key } from "../../collector/const";
import { FontSizeList } from "../const";
import { isNumber, isBoolean } from "lodash";

export type FontSizeProps = TextButProps

const SubBtns = (props:{
    style?: React.CSSProperties;
    onClickHandler:(number:number)=>void;
}) =>{
    const {style, onClickHandler} = props;
    return (
        <div className="font-size-menu" style={ style }
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
            {
                FontSizeList.map(s=>(
                    <div className="font-size-btn" key={s} 
                        onClick={()=>{onClickHandler(s)}}
                        onTouchEnd={()=>{onClickHandler(s)}}
                    >{s}</div>
                ))
            }
        </div>
    )
}


export const FontSizeBtn = (props:FontSizeProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const {open: showSubBtn, setOpen: setShowSubBtn, textOpt, workIds, floatBarRef} = props;
    const { maranger, floatBarData } = useContext(DisplayerContext);
    const [size, setSize] = useState<number>(0);
    const [oldDisableDeviceInputs, setOldDisableDeviceInputs] = useState<boolean>();
    const length = FontSizeList.length-1;
    useEffect(()=>{
        if (textOpt?.fontSize) {
            setSize(textOpt.fontSize);
            if(ref.current){
                ref.current.value = textOpt.fontSize.toString(); 
            }
        }
    }, [textOpt?.fontSize]);
    const subBtnStyle = useMemo(()=>{
        if (floatBarRef?.current && isNumber(floatBarData?.y) && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + floatBarData.y > 250) {
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 35;
                return value;
            } 
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - floatBarData.y < 180){
                const value:React.CSSProperties = {};
                value.top = 'inherit';
                value.bottom = 35;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, floatBarData?.y, maranger])
    function sendFontSize(size:number){
        setSize(size);
        if (size && size >= FontSizeList[0] && size<= FontSizeList[length]) {
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetFontStyle, {
                workIds: workIds || [Storage_Selector_key],
                fontSize: size,
                viewId: maranger?.viewId
            });
        }
    }
    const onClickHandler = (size:number) =>{
        ref.current?.blur();
        setShowSubBtn(false);
        checkSize(size)
    }
    const SubBtnUI = useMemo(() => {
        if (showSubBtn) {
            return <SubBtns onClickHandler={onClickHandler} style={subBtnStyle}/>
        }
        return null
    }, [showSubBtn, onClickHandler, subBtnStyle])
    const checkSize = (number:number)=>{
        if(number > FontSizeList[length]) number = FontSizeList[length];
        if(number < FontSizeList[0]) number = FontSizeList[0];
        sendFontSize(number);
    }
    useEffect(()=>{
        return ()=> {
            if( maranger?.control.room && isBoolean(oldDisableDeviceInputs)) {
                maranger.control.room.disableDeviceInputs = oldDisableDeviceInputs;
            }
        }
    },[maranger, oldDisableDeviceInputs])
    return (
        <div className={'button normal-button font-size-barBtn'} style={{width:50}}
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
            <input className="font-size-input" ref={ref}
                onTouchEnd={()=>{
                    // setShowSubBtn(true);
                    if (ref.current) {
                        ref.current.focus();
                    }
                }}
                onClick={()=>{
                    setShowSubBtn(!showSubBtn);
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
                    return false;
                }}
                onKeyUp={(e)=>{
                    if (ref.current) {
                        const value = ref.current.value;
                        const number = parseInt(value);
                        if (!isNaN(number)) {
                            ref.current.value = number.toString()
                        } else {
                            ref.current.value = '0';
                        }
                        if (number && e.key === 'Enter') {
                            checkSize(number);
                            ref.current?.blur();
                            setShowSubBtn(false);
                        }
                    }
                }}
                onFocus={()=>{
                    if (maranger?.control.room && !maranger.control.room.disableDeviceInputs) {
                        setOldDisableDeviceInputs(maranger.control.room.disableDeviceInputs)
                        maranger.control.room.disableDeviceInputs = true;
                    }
                }}
                onBlur={()=>{
                    if (maranger?.control.room && isBoolean(oldDisableDeviceInputs)) {
                        maranger.control.room.disableDeviceInputs = oldDisableDeviceInputs;
                    }
                }}
            />
            <div className="font-size-btns">
                <div className="font-size-add" 
                    onClick={()=>{
                        checkSize(size+FontSizeList[0])
                    }} 
                    onTouchEnd={()=>{
                        checkSize(size+FontSizeList[0])
                    }}
                ></div>
                <div className="font-size-cut" 
                    onClick={()=>{
                        checkSize(size-FontSizeList[0])
                    }}
                    onTouchEnd={()=>{
                        checkSize(size-FontSizeList[0])
                    }}
                ></div>
            </div>
            {SubBtnUI}
        </div>
    )
}