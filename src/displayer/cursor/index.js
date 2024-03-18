import * as React from "react";
import { ApplianceNames, } from "white-web-sdk";
import pencilCursor from "@netless/cursor-tool/src/image/pencil-cursor.png";
import "@netless/cursor-tool/src/index.less";
class CursorComponent extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "renderAvatar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                const color = `rgb(${roomMember.memberState.strokeColor[0]}, ${roomMember.memberState.strokeColor[1]}, ${roomMember.memberState.strokeColor[2]})`;
                if (this.detectAvatar(roomMember)) {
                    const isHaveName = this.detectCursorName(roomMember);
                    return (React.createElement("img", { className: "cursor-selector-avatar", style: {
                            width: isHaveName ? 19 : 28,
                            height: isHaveName ? 19 : 28,
                            position: isHaveName ? "initial" : "absolute",
                            borderColor: isHaveName ? "white" : color,
                            marginRight: isHaveName ? 4 : 0
                        }, src: roomMember.payload?.avatar, alt: "avatar" }));
                }
                else {
                    return null;
                }
            }
        });
        Object.defineProperty(this, "getOpacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                const cursorName = this.getCursorName(roomMember);
                const avatar = this.detectAvatar(roomMember);
                if (cursorName === undefined && avatar === undefined) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
        });
        Object.defineProperty(this, "getCursorName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                if (roomMember.payload && roomMember.payload.cursorName) {
                    return roomMember.payload.cursorName;
                }
                else {
                    return undefined;
                }
            }
        });
        Object.defineProperty(this, "getThemeClass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                if (roomMember.payload && roomMember.payload.theme) {
                    return "cursor-inner-mellow";
                }
                else {
                    return "cursor-inner";
                }
            }
        });
        Object.defineProperty(this, "getCursorBackgroundColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                const isHaveName = this.detectCursorName(roomMember);
                if (roomMember.payload && roomMember.payload.cursorBackgroundColor) {
                    return roomMember.payload.cursorBackgroundColor;
                }
                else {
                    if (isHaveName) {
                        return `rgb(${roomMember.memberState.strokeColor[0]}, ${roomMember.memberState.strokeColor[1]}, ${roomMember.memberState.strokeColor[2]})`;
                    }
                    else {
                        // 安卓低版本不支持 rgba
                        return undefined;
                    }
                }
            }
        });
        Object.defineProperty(this, "getCursorTextColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                if (roomMember.payload && roomMember.payload.cursorTextColor) {
                    return roomMember.payload.cursorTextColor;
                }
                else {
                    return "#FFFFFF";
                }
            }
        });
        Object.defineProperty(this, "getCursorTagBackgroundColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                if (roomMember.payload && roomMember.payload.cursorTagBackgroundColor) {
                    return roomMember.payload.cursorTagBackgroundColor;
                }
                else {
                    return this.getCursorBackgroundColor(roomMember);
                }
            }
        });
        Object.defineProperty(this, "detectCursorName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                return !!(roomMember.payload && roomMember.payload.cursorName);
            }
        });
        Object.defineProperty(this, "detectAvatar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                return !!(roomMember.payload && roomMember.payload.avatar);
            }
        });
        Object.defineProperty(this, "renderTag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMember) => {
                if (roomMember.payload && roomMember.payload.cursorTagName) {
                    return (React.createElement("span", { className: "cursor-tag-name", style: { backgroundColor: this.getCursorTagBackgroundColor(roomMember) } }, roomMember.payload.cursorTagName));
                }
                else {
                    return undefined;
                }
            }
        });
    }
    render() {
        const { roomMember } = this.props;
        const cursorName = this.getCursorName(roomMember);
        const appliance = roomMember.memberState.currentApplianceName;
        switch (appliance) {
            case ApplianceNames.pencil: {
                return (React.createElement("div", { className: "cursor-box" },
                    React.createElement("div", { className: "cursor-mid cursor-pencil-offset", style: { transform: `translate(-50%, -90%)`, marginLeft: '10px' } },
                        React.createElement("div", { className: "cursor-name" },
                            React.createElement("div", { style: {
                                    opacity: this.getOpacity(roomMember),
                                    backgroundColor: this.getCursorBackgroundColor(roomMember),
                                    color: this.getCursorTextColor(roomMember),
                                }, className: this.getThemeClass(roomMember) },
                                this.renderAvatar(roomMember),
                                cursorName,
                                this.renderTag(roomMember))),
                        React.createElement("div", null,
                            React.createElement("img", { className: "cursor-pencil-image", src: pencilCursor, alt: "pencilCursor" })))));
            }
            default:
                return null;
        }
    }
}
export const CursorManager = (props) => {
    const { className, info } = props;
    const { roomMember, ...position } = info || {};
    // console.log('CursorManager', position, roomMember)
    return (React.createElement("div", { className: `${className}`, style: position ? {
            transform: `translate(${position.x}px, ${position.y}px)`
        } : { display: 'none' } }, roomMember && React.createElement(CursorComponent, { roomMember: roomMember })));
};
