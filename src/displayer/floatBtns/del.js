import React from "react";
import { IconURL } from "../icons";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";
export const Del = (props) => {
    const { workIds, maranger } = props;
    return (React.createElement("div", { className: "button normal-button", onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.DeleteNode, { workIds: workIds || [Storage_Selector_key], viewId: maranger.viewId });
        }, onTouchEnd: (e) => {
            e.stopPropagation();
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.DeleteNode, { workIds: workIds || [Storage_Selector_key], viewId: maranger.viewId });
        } },
        React.createElement("img", { alt: "icon", src: IconURL('delete') })));
};
