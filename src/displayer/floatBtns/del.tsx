import React from "react";
import { IconURL } from "../icons"
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";

export const Del = (props:{workIds?:string[];}) => {
    const {workIds} = props;
    return (
        <div className="button normal-button"
        onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.DeleteNode, {workIds: workIds || [Storage_Selector_key]})
        }}
        onTouchEnd={(e)=>{
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.DeleteNode, {workIds: workIds || [Storage_Selector_key]})
        }}
        >
            <img alt="icon" src={IconURL('delete')}/>
        </div>
    )
}