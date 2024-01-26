import React, { useContext } from "react";
import { IconURL } from "../icons";
import { DisplayerContext } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
export const Duplicate = () => {
    const { InternalMsgEmitter } = useContext(DisplayerContext);
    return (React.createElement("div", { className: "button normal-button", onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.CopyNode, { workIds: ['selector'] });
        }, onTouchEnd: (e) => {
            e.stopPropagation();
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.CopyNode, { workIds: ['selector'] });
        } },
        React.createElement("img", { alt: "icon", src: IconURL('duplicate') })));
};
