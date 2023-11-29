import React, { useMemo } from "react"
import { FloatBtns } from "../floatBtns"
import { HightLightBox } from "../highlightBox"
import type { EventEmitter2 } from "eventemitter2"
// import { EInternalEventType } from "../.."
import { ShowFloatBarMsgValue } from "../types"

export const FloatBar = React.memo((props:{
    className: string,
    internalMsgEmitter: EventEmitter2,
    styleData?: ShowFloatBarMsgValue
}) => {
    const { className, internalMsgEmitter, styleData} = props;
    const [isShowBtns, SetShowBtns] = React.useState(false);
    
    // useEffect(()=>{
    //     internalMsgEmitter.on(["floatBar", EInternalEventType.HidFloatBtns], SetShowBtns)
    //     internalMsgEmitter.on(["floatBar", EInternalEventType.ShowFloatBtns], SetShowBtns)
    //     return ()=>{
    //         internalMsgEmitter.off(["floatBar", EInternalEventType.HidFloatBtns], SetShowBtns);
    //         internalMsgEmitter.off(["floatBar", EInternalEventType.ShowFloatBtns], SetShowBtns);
    //     }
    // },[])

    const onDragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", "1");
        e.dataTransfer.effectAllowed = "move";
    }

    const onDragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.clearData();
    }

    const onDragHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const onDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const FloatBtnsUI = useMemo(()=>{
        if (isShowBtns) {
            return <FloatBtns internalMsgEmitter={internalMsgEmitter}></FloatBtns>;
        }
        return null;
    },[isShowBtns])

    return (
        <div className={className} draggable={true}
            style={styleData ? {
                    left: styleData.x,
                    top: styleData.y,
                    width: styleData.w,
                    height: styleData.h,
                    borderColor: styleData.color,
                } : undefined
            }
            onDragStart= {onDragStartHandler}
            onDrag={onDragHandler}
            onDragEnd={onDragEndHandler}
            onDrop={onDropHandler}
        >
            { FloatBtnsUI }
            <HightLightBox internalMsgEmitter={internalMsgEmitter}></HightLightBox>
        </div>
    )
}, () => true)