import React from "react";
export const HightLightBox = React.memo((props) => {
    const { internalMsgEmitter } = props;
    return (React.createElement("div", { className: "bezier-pencil-plugin-hightlight-box" },
        React.createElement("div", null, "HightLightBox")));
}, () => true);
