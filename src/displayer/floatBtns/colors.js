import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconURL } from "../icons";
import { DisplayerContext } from "../../plugin";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { hexToRgba, rgbToHex } from "../../collector/utils/color";
import { MethodBuilderMain } from "../../core/msgEvent";
import Draggable from "react-draggable";
import throttle from "lodash/throttle";
import { EvevtWorkState } from "../../core";
const ColorBtn = (props) => {
    const { color, opacity, activeColor, onClickHandler } = props;
    return (React.createElement("div", { className: `font-color-button ${color === activeColor ? 'active' : ''}`, onClick: onClickHandler },
        React.createElement("div", { className: "circle", style: { backgroundColor: activeColor && hexToRgba(color, opacity) } })));
};
const OpacityBtn = (props) => {
    const { opacity, activeColor, setCurOpacity } = props;
    if (!activeColor) {
        return null;
    }
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        const curOpacity = Math.min(Math.max(opacity * 100 + pos.x, 0.01), 100) / 100;
        if (opacity !== curOpacity) {
            setCurOpacity(curOpacity, EvevtWorkState.Doing);
        }
    }, 100, { 'leading': false });
    const onDragStartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurOpacity(opacity, EvevtWorkState.Start);
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        const curOpacity = Math.min(Math.max(opacity * 100 + pos.x, 0.01), 100) / 100;
        setCurOpacity(curOpacity, EvevtWorkState.Done);
    }, 100, { 'leading': false });
    return (React.createElement("div", { className: 'font-color-opacity' },
        React.createElement("div", { className: "range-color", style: {
                background: `linear-gradient(to right, ${hexToRgba(activeColor, 0)}, ${hexToRgba(activeColor, 1)})`
            } }),
        React.createElement("div", { className: "range-opacity" },
            React.createElement(Draggable, { bounds: "parent", axis: "x", onDrag: onDragHandler, onStart: onDragStartHandler, onStop: onDragEndHandler },
                React.createElement("div", { className: "circle", style: {
                        left: `calc(${opacity * 100}% - 13px)`,
                        backgroundColor: hexToRgba(activeColor, opacity)
                    } })))));
};
export const Colors = () => {
    const { InternalMsgEmitter, floatBarData, floatBarColors } = useContext(DisplayerContext);
    const [showSubBtn, setShowSubBtn] = useState(false);
    const [activeColor, setColor] = useState(floatBarData?.nodeColor);
    const [opacity, setOpacity] = useState(floatBarData?.opacity || 1);
    useEffect(() => {
        if (floatBarData) {
            setColor(floatBarData.nodeColor);
            setOpacity(floatBarData.opacity || 1);
        }
    }, [floatBarData]);
    const SubOpacityBtn = useMemo(() => {
        return React.createElement(OpacityBtn, { opacity: floatBarData?.opacity || 1, activeColor: activeColor, setCurOpacity: (curOpacity, workState) => {
                setOpacity(curOpacity);
                InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, EmitEventType.SetColorNode, { workIds: ['selector'], color: activeColor, opacity: curOpacity, workState });
            } });
    }, [InternalMsgEmitter, activeColor, floatBarData?.opacity]);
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (React.createElement("div", { className: "font-colors-menu", onTouchStart: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }, onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                } },
                floatBarColors.map((c, index) => {
                    const curColor = rgbToHex(...c);
                    return (React.createElement(ColorBtn, { key: index, color: curColor, opacity: opacity, activeColor: activeColor, onClickHandler: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setColor(curColor);
                            InternalMsgEmitter && MethodBuilderMain.emitMethod(InternalMsgEmitter, InternalMsgEmitterType.MainEngine, EmitEventType.SetColorNode, { workIds: ['selector'], color: curColor });
                        } }));
                }),
                SubOpacityBtn));
        }
        return null;
    }, [showSubBtn, floatBarColors, SubOpacityBtn, opacity, activeColor, InternalMsgEmitter]);
    const ColorBar = useMemo(() => {
        if (activeColor && opacity) {
            return (React.createElement("div", { className: "color-bar", style: { backgroundColor: hexToRgba(activeColor, opacity) } }));
        }
        return null;
    }, [activeColor, opacity]);
    return (React.createElement("div", { className: `button normal-button font-colors-icon ${showSubBtn && 'active'}`, onTouchStart: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
        }, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
        } },
        React.createElement("img", { alt: "icon", src: IconURL('font-colors') }),
        ColorBar,
        SubBtns));
};
