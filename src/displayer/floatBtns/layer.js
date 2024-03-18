/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconURL } from "../icons";
import { DisplayerContext } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";
import { ElayerType } from "../../core";
import isEqual from "lodash/isEqual";
const SubBtn = (props) => {
    const { icon, onClickHandler, onTouchEndHandler } = props;
    return (React.createElement("div", { className: "button normal-button", onClick: onClickHandler, onTouchEnd: onTouchEndHandler },
        React.createElement("img", { src: IconURL(icon) })));
};
export const Layer = () => {
    const { InternalMsgEmitter, floatBarData } = useContext(DisplayerContext);
    const [showSubBtn, setShowSubBtn] = useState(false);
    const [selectIds, setSelectIds] = useState([]);
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (React.createElement("div", { className: "image-layer-menu" },
                React.createElement(SubBtn, { icon: 'to-top', onClickHandler: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: [Storage_Selector_key], layer: ElayerType.Top });
                    }, onTouchEndHandler: (e) => {
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: [Storage_Selector_key], layer: ElayerType.Top });
                    } }),
                React.createElement(SubBtn, { icon: 'to-bottom', onClickHandler: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: [Storage_Selector_key], layer: ElayerType.Bottom });
                    }, onTouchEndHandler: (e) => {
                        e.stopPropagation();
                        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexNode, { workIds: [Storage_Selector_key], layer: ElayerType.Bottom });
                    } })));
        }
        return null;
    }, [InternalMsgEmitter, showSubBtn]);
    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive);
        if (isActive) {
            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexActive, { workId: Storage_Selector_key, isActive });
        }
    };
    const onTouchEndHandler = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive);
        InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexActive, { workId: Storage_Selector_key, isActive });
    };
    useEffect(() => {
        if (!isEqual(floatBarData?.selectIds, selectIds)) {
            // console.log('first2', floatBarData?.selectIds)
            if (floatBarData?.selectIds && !isEqual(floatBarData?.selectIds, selectIds)) {
                setSelectIds(floatBarData?.selectIds);
                setShowSubBtn(false);
            }
        }
    }, [InternalMsgEmitter, showSubBtn, floatBarData, selectIds]);
    useEffect(() => {
        return () => {
            if (showSubBtn) {
                // console.log('first3')
                InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.ZIndexActive, { workId: Storage_Selector_key, isActive: false });
            }
        };
    }, [InternalMsgEmitter, showSubBtn]);
    return (React.createElement("div", { className: `button normal-button ${showSubBtn && 'active'}`, onClick: onClickHandler, onTouchEnd: onTouchEndHandler },
        SubBtns,
        React.createElement("img", { alt: "icon", src: IconURL(showSubBtn ? 'layer-pressed' : 'layer') })));
};
