/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconURL } from "../icons";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";
import { ElayerType } from "../../core";
import isEqual from "lodash/isEqual";
import { DisplayerContext } from "../../plugin/displayerView";
import { SubButProps } from "../types";
const SubBtn = (props: {
    icon:string;
    onClickHandler:(e: any)=>void;
    onTouchEndHandler:(e: any)=>void;
}) => {
    const { icon, onClickHandler, onTouchEndHandler } = props;
    return (
        <div className="button normal-button" onClick={onClickHandler} onTouchEnd={onTouchEndHandler}>
            <img src={IconURL(icon)}/>
        </div>
    )
}
export const Layer = (props:SubButProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, style} = props;
    const {floatBarData, maranger} = useContext(DisplayerContext);
    // const [showSubBtn, setShowSubBtn] = useState(false);
    const [selectIds,setSelectIds] = useState<string[]>([]);
    const subBtnStyle = useMemo(()=>{
        if (style && style.bottom) {
            const value:React.CSSProperties = {};
            value.top = 'inherit';
            value.bottom = 50;
            return value;
        }
        return undefined;
    }, [style])
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="image-layer-menu" style={ subBtnStyle }>
                    <SubBtn icon={'to-top'} 
                        onClickHandler={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.ZIndexNode, {workIds:[Storage_Selector_key], layer: ElayerType.Top, viewId:maranger?.viewId})
                        }}
                        onTouchEndHandler={(e) => {
                            e.stopPropagation();
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.ZIndexNode, {workIds:[Storage_Selector_key], layer: ElayerType.Top, viewId:maranger?.viewId})
                        }}
                    />
                    <SubBtn icon={'to-bottom'} 
                        onClickHandler={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.ZIndexNode, {workIds:[Storage_Selector_key], layer: ElayerType.Bottom, viewId:maranger?.viewId})
                        }}
                        onTouchEndHandler={(e) => {
                            e.stopPropagation();
                            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                                EmitEventType.ZIndexNode, {workIds:[Storage_Selector_key], layer: ElayerType.Bottom, viewId:maranger?.viewId})
                        }}
                    />
                </div>
            )
        }
        return null
    }, [showSubBtn, subBtnStyle])
    const onClickHandler = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive)
        if (isActive) {
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.ZIndexActive, {workId:Storage_Selector_key, isActive, viewId:maranger?.viewId })
        }
    }
    const onTouchEndHandler = (e:any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive)
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.ZIndexActive, {workId:Storage_Selector_key, isActive, viewId:maranger?.viewId})
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
                MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                    EmitEventType.ZIndexActive, {workId:Storage_Selector_key, isActive:false, viewId:maranger?.viewId})
            }
        }
    },[showSubBtn])
    return (
        <div className={`button normal-button ${showSubBtn && 'active'}`}
            onClick={onClickHandler}
            onTouchEnd={onTouchEndHandler}
        >
            {SubBtns}
            <img alt="icon" src={IconURL(showSubBtn ? 'layer-pressed': 'layer')}/>
        </div>
    )
}