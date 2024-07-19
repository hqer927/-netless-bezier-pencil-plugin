import React from "react";
import { IconURL } from "../icons"
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";

export const Duplicate = (props:{workIds?:string[]; viewId:string;}) => {
    const {workIds, viewId} = props;
    return (<div className="button normal-button"
        onClick={(e)=>{
            if (e.cancelable) {
                e.preventDefault();
            }
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.CopyNode, {workIds: workIds || [Storage_Selector_key], viewId})
        }}
        onTouchEnd={(e)=>{
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.CopyNode, {workIds: workIds || [Storage_Selector_key], viewId})
        }}
    >
        <img alt="icon" src={IconURL('duplicate')}/>
    </div>)
}