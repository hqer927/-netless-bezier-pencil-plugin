/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconURL } from "../icons";
import { DisplayerContext } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
const SubBtn = (props: {
    icon:string;
    onClickHandler:(e: any)=>void;
}) => {
    const { icon, onClickHandler } = props;
    return (
        <div className="button normal-button" onClick={onClickHandler} onTouchEnd={onClickHandler}>
            <img src={IconURL(icon)}/>
        </div>
    )
}
export const Layer = () => {
    const {InternalMsgEmitter, floatBarData} = useContext(DisplayerContext);
    const [showSubBtn, setShowSubBtn] = useState(false);
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="image-layer-menu">
                    <SubBtn icon={'to-top'} onClickHandler={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // InternalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode], ['selector'], +11 )
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, 
                            EmitEventType.ZIndexNode, {workIds:['selector'], num: +11})
                    }}/>
                    <SubBtn icon={'to-bottom'} onClickHandler={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // InternalMsgEmitter?.emit([InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode], ['selector'], -11 )
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, 
                            EmitEventType.ZIndexNode, {workIds:['selector'], num: -11})
                    }}/>
                </div>
            )
        }
        return null
    }, [InternalMsgEmitter, showSubBtn])
    const onClickHandler = (e:any) => {
        //console.log('Layer-onClick', e)
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(!showSubBtn)
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, 
            EmitEventType.ZIndexActive, {workId:'selector', isActive})
    }
    useEffect(()=>{
        return ()=> {
            if (showSubBtn) {
                //console.log('isActive111', showSubBtn)
                InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, 
                    EmitEventType.ZIndexActive, {workId:'selector', isActive:false})
            }
        }
    },[InternalMsgEmitter, showSubBtn, floatBarData?.x, floatBarData?.y])
    return (
        <div className={`button normal-button ${showSubBtn && 'active'}`}
            onClick={onClickHandler}
            onTouchEnd={onClickHandler}
        >
            {SubBtns}
            <img alt="icon" src={IconURL(showSubBtn ? 'layer-pressed': 'layer')}/>
        </div>
    )
}