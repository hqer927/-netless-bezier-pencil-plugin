
import React, { useContext } from "react"
import { DisplayerContext } from "../../plugin/displayerView";

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
    const {floatBarData} = useContext(DisplayerContext);
    return (
        <div className="bezier-pencil-plugin-hightlight-box" 
            style={{borderColor: floatBarData?.selectorColor}}
        >
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