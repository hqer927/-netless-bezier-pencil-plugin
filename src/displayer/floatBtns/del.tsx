import React, { useContext } from "react";
import { IconURL } from "../icons"
import { DisplayerContext } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";

export const Del = () => {
    const {InternalMsgEmitter} = useContext(DisplayerContext);
    return (
        <div className="button normal-button"
            onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, 
                    EmitEventType.DeleteNode, {workIds: ['selector']})
            }}
	    onTouchEnd={(e)=>{
                e.stopPropagation();
                InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, 
                    EmitEventType.DeleteNode, {workIds: ['selector']})
            }}
        >
            <img alt="icon" src={IconURL('delete')}/>
        </div>
    )
}