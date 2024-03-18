import { DisplayerContext } from "../../plugin/single/teachingAidsDisplayer"
import React, { useContext } from "react"

export const HightLightBox = () => {
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