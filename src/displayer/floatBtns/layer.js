/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconURL } from "../icons";
import { DisplayerContext } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
const SubBtn = (props) => {
    const { icon, onClickHandler, onTouchEndHandler } = props;
    return (React.createElement("div", { className: "button normal-button", onClick: onClickHandler, onTouchEnd: onTouchEndHandler },
        React.createElement("img", { src: IconURL(icon) })));
};
export const Layer = () => {
    const { InternalMsgEmitter, floatBarData } = useContext(DisplayerContext);
    const [showSubBtn, setShowSubBtn] = useState(false);
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (React.createElement("div", { className: "image-layer-menu" },
                React.createElement(SubBtn, { icon: 'to-top', onClickHandler: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: ['selector'], num: +11 });
                    }, onTouchEndHandler: (e) => {
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: ['selector'], num: +11 });
                    } }),
                React.createElement(SubBtn, { icon: 'to-bottom', onClickHandler: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: ['selector'], num: -11 });
                    }, onTouchEndHandler: (e) => {
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: ['selector'], num: -11 });
                    } })));
        }
        return null;
    }, [InternalMsgEmitter, showSubBtn]);
    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(!showSubBtn);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexActive, { workId: 'selector', isActive });
    };
    const onTouchEndHandler = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(!showSubBtn);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexActive, { workId: 'selector', isActive });
    };
    useEffect(() => {
        return () => {
            if (showSubBtn) {
                //console.log('isActive111', showSubBtn)
                InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexActive, { workId: 'selector', isActive: false });
            }
        };
    }, [InternalMsgEmitter, showSubBtn, floatBarData?.x, floatBarData?.y]);
    return (React.createElement("div", { className: `button normal-button ${showSubBtn && 'active'}`, onClick: onClickHandler, onTouchEnd: onTouchEndHandler },
        SubBtns,
        React.createElement("img", { alt: "icon", src: IconURL(showSubBtn ? 'layer-pressed' : 'layer') })));
};
