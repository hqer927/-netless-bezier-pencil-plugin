import React, { useContext } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
export const HightLightBox = () => {
    const { floatBarData } = useContext(DisplayerContext);
    return (React.createElement("div", { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: floatBarData?.selectorColor } },
        React.createElement("div", { className: "point LT nwse-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point LC ew-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point LB nesw-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point TC ns-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point RT nesw-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point RC ew-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point RB nwse-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point BC ns-resize", style: { backgroundColor: floatBarData?.selectorColor } })));
};
export const HightLightTwoBox = () => {
    const { floatBarData } = useContext(DisplayerContext);
    return (React.createElement("div", { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: floatBarData?.selectorColor } }));
};
