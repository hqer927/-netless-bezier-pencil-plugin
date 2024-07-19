
import React, { useContext, useEffect, useMemo, useState } from "react"
import { DisplayerContext } from "../../../plugin/displayerView";
import { isNumber } from "lodash";

export const HighlightBox = () => {
    const {floatBarData} = useContext(DisplayerContext);
    return (
        <div className="bezier-pencil-plugin-hightlight-box" 
            style={{borderColor: floatBarData?.selectorColor}}
        >
            <div className="point LT nwse-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point LC ew-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point LB nesw-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point TC ns-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point RT nesw-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point RC ew-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point RB nwse-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point BC ns-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
        </div>
    )
}

export const HighlightTwoBox = () => {
    const {floatBarData, maranger} = useContext(DisplayerContext);
    const [startPosition,setStartPosition] = useState<{x:number,y:number}>();
    const [endPosition,setEndPosition] = useState<{x:number,y:number}>();
    useEffect(()=>{
        const ps:[number,number][] = [];
        if (maranger && isNumber(floatBarData?.x) && isNumber(floatBarData?.y) && floatBarData?.points) {
            const viewId = maranger.viewId;
            const view =  maranger.control.viewContainerManager.getView(viewId);
            if (view) {
                for (const point of floatBarData.points) {
                    const p = maranger.control.viewContainerManager.transformToOriginPoint(point,viewId);
                    ps.push(p);
                }
            }
            if(ps[0]){
                setStartPosition({x:ps[0][0] - (floatBarData?.x || 0),y:ps[0][1] - (floatBarData?.y || 0 )})
            }
            if(ps[1]){
                setEndPosition({x:ps[1][0] - (floatBarData?.x || 0),y:ps[1][1] - (floatBarData?.y || 0 )})
            }
        }

    },[maranger, floatBarData?.points, floatBarData?.x, floatBarData?.y])
    const StartPoint = useMemo(()=>{
        if (startPosition) {
            return (
                <div className={"point point-dot"}
                        style={{                    
                            borderColor: floatBarData?.selectorColor,
                            left: startPosition.x,
                            top: startPosition.y
                        }}
                >
                </div>
            )
        }
        return null
    },[floatBarData?.selectorColor, startPosition])
    const EndPoint = useMemo(()=>{
        if (endPosition) {
            return (
                <div className={"point point-dot"}
                        style={{                    
                            borderColor: floatBarData?.selectorColor,
                            left: endPosition.x,
                            top: endPosition.y
                        }}
                >
                </div>
            )
        }
        return null
    },[endPosition, floatBarData?.selectorColor])
    return (
        <div className="bezier-pencil-plugin-hightlight-box" 
            style={{borderColor: floatBarData?.selectorColor}}
        >
            {StartPoint}
            {EndPoint}
        </div>
    )
}
export const HighlightFourBox = () => {
    const {floatBarData} = useContext(DisplayerContext);
    return (
        <div className="bezier-pencil-plugin-hightlight-box" 
            style={{borderColor: floatBarData?.selectorColor}}
        >
            <div className="point LT nwse-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point LB nesw-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point RT nesw-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
            <div className="point RB nwse-resize" style={{backgroundColor: floatBarData?.selectorColor}} ></div>
        </div>
    )
}
export const LockedBox = () => {
    const {floatBarData} = useContext(DisplayerContext);
    return (
        <div className="bezier-pencil-plugin-hightlight-box" 
            style={{
                borderColor: floatBarData?.selectorColor
            }}
        >
            <img className="lock" alt="lock" src="https://sdk.netless.link/resource/icons/lock.svg"/>
        </div>
    )
}