/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo, useRef } from "react";
import { Del } from "./del";
import { Duplicate } from "./duplicate";
import { Layer } from "./layer";
import { FillColors, StrokeColors, TextColors } from "./colors";
import { DisplayerContext } from "../../plugin/displayerView";
import { FontStyleBtn } from "./fontStyle";
import { FontSizeBtn } from "./fontSize";
import { LockBtn } from "./lock";
import { ShapeOpt } from "./shapeOpt";
var EOpenType;
(function (EOpenType) {
    EOpenType[EOpenType["none"] = 0] = "none";
    EOpenType[EOpenType["Layer"] = 1] = "Layer";
    EOpenType[EOpenType["StrokeColor"] = 2] = "StrokeColor";
    EOpenType[EOpenType["FillColor"] = 3] = "FillColor";
    EOpenType[EOpenType["TextColor"] = 4] = "TextColor";
    EOpenType[EOpenType["TextBgColor"] = 5] = "TextBgColor";
    EOpenType[EOpenType["FontStyle"] = 6] = "FontStyle";
    EOpenType[EOpenType["FontSize"] = 7] = "FontSize";
    EOpenType[EOpenType["ShapeOpt"] = 8] = "ShapeOpt";
})(EOpenType || (EOpenType = {}));
export const FloatBtns = React.memo((props) => {
    const { textOpt, workIds, noLayer, position } = props;
    const { floatBarData, maranger } = useContext(DisplayerContext);
    const [openType, setOpenType] = React.useState(EOpenType.none);
    const ref = useRef(null);
    const style = useMemo(() => {
        const value = {};
        const inputW = floatBarData?.w || textOpt?.boxSize?.[0] || 0;
        const inputH = floatBarData?.h || textOpt?.boxSize?.[1] || 0;
        if (position && inputW && inputH && maranger?.width && maranger?.height) {
            if (position.y < 60) {
                if (position.y + inputW < maranger.height - 60) {
                    value.bottom = -120;
                }
                else if (position.y + inputH < maranger.height) {
                    value.bottom = -58;
                }
                else if (position.y > 0) {
                    value.top = 62;
                }
                else {
                    value.top = -position.y + 62;
                }
            }
            if (position.x < 0) {
                value.left = -position.x + 3;
            }
            else if (position.x + (ref.current?.offsetWidth || inputW) > maranger.width) {
                const right = inputW + position.x - maranger.width;
                value.left = 'initial';
                value.right = right;
            }
            return value;
        }
        return undefined;
    }, [ref, position, floatBarData?.w, floatBarData?.h, maranger?.width, maranger?.height, textOpt?.boxSize]);
    const useFillColors = useMemo(() => {
        if (floatBarData?.fillColor) {
            return React.createElement(FillColors, { floatBarRef: ref, open: openType === EOpenType.FillColor, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.FillColor);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                } });
        }
        return null;
    }, [floatBarData?.fillColor, openType, ref]);
    const useStrokeColors = useMemo(() => {
        if (floatBarData?.strokeColor) {
            return React.createElement(StrokeColors, { floatBarRef: ref, open: openType === EOpenType.StrokeColor, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.StrokeColor);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                } });
        }
        return null;
    }, [floatBarData?.strokeColor, openType, ref]);
    const useTextColors = useMemo(() => {
        if (textOpt?.fontColor && maranger?.viewId) {
            return React.createElement(TextColors, { floatBarRef: ref, open: openType === EOpenType.TextColor, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.TextColor);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                }, textOpt: textOpt, workIds: workIds });
        }
        return null;
    }, [textOpt, openType, workIds, maranger, ref]);
    // const useTextBgColors = useMemo(()=>{
    //   if(textOpt?.fontBgColor) {
    //     return <TextBgColors open={openType === EOpenType.TextBgColor} setOpen={(bol: boolean) => {
    //       if (bol === true) {
    //         setOpenType(EOpenType.TextBgColor)
    //       } else {
    //         setOpenType(EOpenType.none)
    //       }
    //     } } floatBarColors={floatBarColors} textOpt={textOpt} workIds={workIds}/>
    //   }
    //   return null;
    // }, [textOpt, openType, floatBarColors, workIds])
    const useFontStyle = useMemo(() => {
        if (textOpt && maranger?.viewId) {
            return React.createElement(FontStyleBtn, { open: openType === EOpenType.FontStyle, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.FontStyle);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                }, textOpt: textOpt, workIds: workIds, style: style });
        }
        return null;
    }, [textOpt, openType, workIds, maranger, style]);
    const useFontSize = useMemo(() => {
        if (textOpt && maranger?.viewId) {
            return React.createElement(FontSizeBtn, { open: openType === EOpenType.FontSize, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.FontSize);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                }, textOpt: textOpt, workIds: workIds, floatBarRef: ref });
        }
        return null;
    }, [textOpt, openType, workIds, maranger, ref]);
    const useLayer = useMemo(() => {
        if (noLayer) {
            return null;
        }
        return React.createElement(Layer, { open: openType === EOpenType.Layer, setOpen: (bol) => {
                if (bol === true) {
                    setOpenType(EOpenType.Layer);
                }
                else {
                    setOpenType(EOpenType.none);
                }
            }, floatBarRef: ref });
    }, [noLayer, openType, ref]);
    const useLock = useMemo(() => {
        if (floatBarData?.canLock && maranger) {
            return React.createElement(LockBtn, { workIds: workIds, maranger: maranger, islocked: floatBarData.isLocked });
        }
        return null;
    }, [floatBarData, maranger, workIds]);
    const useShapeOpt = useMemo(() => {
        if (maranger && maranger?.viewId && style && floatBarData?.shapeOpt && floatBarData?.toolsTypes) {
            return React.createElement(ShapeOpt, { open: openType === EOpenType.ShapeOpt, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.ShapeOpt);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                }, floatBarRef: ref, workIds: workIds, toolsTypes: floatBarData.toolsTypes, shapeOpt: floatBarData.shapeOpt });
        }
        return null;
    }, [floatBarData, maranger, openType, style, workIds, ref]);
    return (React.createElement("div", { className: 'bezier-pencil-plugin-floatbtns', style: style, ref: ref },
        maranger && React.createElement(Del, { workIds: workIds, maranger: maranger }),
        useLayer,
        useLock,
        !!maranger?.viewId && React.createElement(Duplicate, { workIds: workIds, viewId: maranger.viewId }),
        useShapeOpt,
        useFontSize,
        useFontStyle,
        useTextColors,
        useStrokeColors,
        useFillColors));
});
