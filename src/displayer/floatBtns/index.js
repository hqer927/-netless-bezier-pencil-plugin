import React from "react";
export const FloatBtns = React.memo((props) => {
    const { internalMsgEmitter } = props;
    return (React.createElement("div", { className: "bezier-pencil-plugin-floatbtns" },
        React.createElement("div", null, "FloatBtns")));
}, () => true);
