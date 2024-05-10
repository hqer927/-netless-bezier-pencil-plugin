import React, { useContext } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
export const HighlightBox = () => {
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
export const HighlightTwoBox = () => {
    const { floatBarData } = useContext(DisplayerContext);
    return (React.createElement("div", { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: floatBarData?.selectorColor } }));
};
export const HighlightFourBox = () => {
    const { floatBarData } = useContext(DisplayerContext);
    return (React.createElement("div", { className: "bezier-pencil-plugin-hightlight-box", style: { borderColor: floatBarData?.selectorColor } },
        React.createElement("div", { className: "point LT nwse-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point LB nesw-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point RT nesw-resize", style: { backgroundColor: floatBarData?.selectorColor } }),
        React.createElement("div", { className: "point RB nwse-resize", style: { backgroundColor: floatBarData?.selectorColor } })));
};
export const LockedBox = () => {
    const { floatBarData } = useContext(DisplayerContext);
    return (React.createElement("div", { className: "bezier-pencil-plugin-hightlight-box", style: {
            borderColor: floatBarData?.selectorColor
        } },
        React.createElement("img", { className: "lock", alt: "lock", src: "https://sdk.netless.link/resource/icons/lock.svg" })));
};
