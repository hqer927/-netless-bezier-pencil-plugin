import React from "react";
import { IconURL } from "../icons"
import { EmitEventType, InternalMsgEmitterType, ApplianceViewManagerLike } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";

export const Del = (props:{workIds?:string[],maranger:ApplianceViewManagerLike}) => {
    const {workIds, maranger} = props;
    return (
        <div className="button normal-button" style={{touchAction:'none'}}
            onClick={(e)=>{
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                    EmitEventType.DeleteNode, {workIds: workIds || [Storage_Selector_key], viewId: maranger.viewId})
            }}
            onTouchEnd={(e)=>{
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                    EmitEventType.DeleteNode, {workIds: workIds || [Storage_Selector_key], viewId: maranger.viewId})
            }}
        >
            <img alt="icon" src={IconURL('delete')}/>
        </div>
    )
}