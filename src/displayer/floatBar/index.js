import React, { useMemo } from "react";
import { FloatBtns } from "../floatBtns";
import { HightLightBox } from "../highlightBox";
export const FloatBar = React.memo((props) => {
    const { className, internalMsgEmitter, styleData } = props;
    const [isShowBtns, SetShowBtns] = React.useState(false);
    // useEffect(()=>{
    //     internalMsgEmitter.on(["floatBar", EInternalEventType.HidFloatBtns], SetShowBtns)
    //     internalMsgEmitter.on(["floatBar", EInternalEventType.ShowFloatBtns], SetShowBtns)
    //     return ()=>{
    //         internalMsgEmitter.off(["floatBar", EInternalEventType.HidFloatBtns], SetShowBtns);
    //         internalMsgEmitter.off(["floatBar", EInternalEventType.ShowFloatBtns], SetShowBtns);
    //     }
    // },[])
    const onDragStartHandler = (e) => {
        e.dataTransfer.setData("text/plain", "1");
        e.dataTransfer.effectAllowed = "move";
    };
    const onDragEndHandler = (e) => {
        e.dataTransfer.clearData();
    };
    const onDragHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDropHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const FloatBtnsUI = useMemo(() => {
        if (isShowBtns) {
            return React.createElement(FloatBtns, { internalMsgEmitter: internalMsgEmitter });
        }
        return null;
    }, [isShowBtns]);
    return (React.createElement("div", { className: className, draggable: true, style: styleData ? {
            left: styleData.x,
            top: styleData.y,
            width: styleData.w,
            height: styleData.h,
            borderColor: styleData.color,
        } : undefined, onDragStart: onDragStartHandler, onDrag: onDragHandler, onDragEnd: onDragEndHandler, onDrop: onDropHandler },
        FloatBtnsUI,
        React.createElement(HightLightBox, { internalMsgEmitter: internalMsgEmitter })));
}, () => true);
