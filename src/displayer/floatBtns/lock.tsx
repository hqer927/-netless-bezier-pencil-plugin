import React from "react";
import { IconURL } from "../icons"
import { EmitEventType, InternalMsgEmitterType, TeachingAidsViewManagerLike } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";

export const LockBtn = (props:{workIds?:string[],maranger:TeachingAidsViewManagerLike, islocked?:boolean}) => {
    const {workIds, maranger, islocked} = props;
    return (
        <div className="button normal-button"
        onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetLock, {workIds: workIds || [Storage_Selector_key], isLocked: !islocked, viewId: maranger?.viewId})
        }}
        onTouchEnd={(e)=>{
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
                EmitEventType.SetLock, {workIds: workIds || [Storage_Selector_key], isLocked: !islocked, viewId: maranger?.viewId})
        }}
        >
            <img alt="icon" src={IconURL(islocked?'unlock-new':'lock-new')}/>
        </div>
    )
}