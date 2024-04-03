/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo } from "react";
import { Del } from "./del";
import { Duplicate } from "./duplicate";
import { Layer } from "./layer";
import { FillColors, StrokeColors, TextColors } from "./colors";
import { DisplayerContext } from "../../plugin/displayerView";
var EOpenType;
(function (EOpenType) {
    EOpenType[EOpenType["none"] = 0] = "none";
    EOpenType[EOpenType["Layer"] = 1] = "Layer";
    EOpenType[EOpenType["StrokeColor"] = 2] = "StrokeColor";
    EOpenType[EOpenType["FillColor"] = 3] = "FillColor";
    EOpenType[EOpenType["TextColor"] = 4] = "TextColor";
    EOpenType[EOpenType["TextBgColor"] = 5] = "TextBgColor";
})(EOpenType || (EOpenType = {}));
export const FloatBtns = React.memo((props) => {
    const { textOpt, workIds, noLayer, position } = props;
    const { floatBarData, maranger } = useContext(DisplayerContext);
    const [openType, setOpenType] = React.useState(EOpenType.none);
    const useFillColors = useMemo(() => {
        if (floatBarData?.fillColor) {
            return React.createElement(FillColors, { open: openType === EOpenType.FillColor, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.FillColor);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                } });
        }
        return null;
    }, [floatBarData?.fillColor, openType]);
    const useStrokeColors = useMemo(() => {
        if (floatBarData?.strokeColor) {
            return React.createElement(StrokeColors, { open: openType === EOpenType.StrokeColor, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.StrokeColor);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                } });
        }
        return null;
    }, [floatBarData?.strokeColor, openType]);
    const useTextColors = useMemo(() => {
        if (textOpt?.fontColor && maranger?.viewId) {
            return React.createElement(TextColors, { open: openType === EOpenType.TextColor, setOpen: (bol) => {
                    if (bol === true) {
                        setOpenType(EOpenType.TextColor);
                    }
                    else {
                        setOpenType(EOpenType.none);
                    }
                }, textOpt: textOpt, workIds: workIds });
        }
        return null;
    }, [textOpt, openType, workIds, maranger]);
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
            } });
    }, [noLayer, openType]);
    return (React.createElement("div", { className: "bezier-pencil-plugin-floatbtns", style: position && position.y < 80 ? {
            bottom: '-120px'
        } : undefined },
        maranger && React.createElement(Del, { workIds: workIds, maranger: maranger }),
        useLayer,
        !!maranger?.viewId && React.createElement(Duplicate, { workIds: workIds, viewId: maranger.viewId }),
        useTextColors,
        useStrokeColors,
        useFillColors));
});
