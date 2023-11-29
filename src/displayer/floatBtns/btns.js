import React from "react";
export const BtnItem = (props) => {
    return (React.createElement("div", { className: "btn-item button normal-button", onClick: props.onClick },
        React.createElement("i", { className: `iconfont ${props.icon}` }),
        React.createElement("span", null, props.title)));
};
