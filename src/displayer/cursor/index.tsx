import * as React from "react";
import {
    ApplianceNames,
    RoomMember,
} from "white-web-sdk";
import pencilCursor from "@netless/cursor-tool/src/image/pencil-cursor.png";
import "@netless/cursor-tool/src/index.less";
type CursorComponentProps = {
    roomMember: RoomMember;
};
class CursorComponent extends React.Component<CursorComponentProps> {
    public constructor(props: CursorComponentProps) {
        super(props);
    }
    private renderAvatar = (roomMember: RoomMember): React.ReactNode => {
        const color = `rgb(${roomMember.memberState.strokeColor[0]}, ${roomMember.memberState.strokeColor[1]}, ${roomMember.memberState.strokeColor[2]})`;

        if (this.detectAvatar(roomMember)) {
            const isHaveName = this.detectCursorName(roomMember);
            return (
                <img className="cursor-selector-avatar"
                     style={{
                         width: isHaveName ? 19 : 28,
                         height: isHaveName ? 19 : 28,
                         position: isHaveName ? "initial" : "absolute",
                         borderColor: isHaveName ? "white" : color,
                         marginRight: isHaveName ? 4 : 0
                     }}
                     src={roomMember.payload?.avatar}
                     alt={"avatar"}/>
            );
        } else {
            return null;
        }
    }
    private getOpacity = (roomMember: RoomMember): number => {
        const cursorName = this.getCursorName(roomMember);
        const avatar = this.detectAvatar(roomMember);
        if (cursorName === undefined && avatar === undefined) {
            return 0;
        } else {
            return 1;
        }
    }
    private getCursorName = (roomMember: RoomMember): string | undefined => {
        if (roomMember.payload && roomMember.payload.cursorName) {
            return roomMember.payload.cursorName;
        } else {
            return undefined;
        }
    }
    private getThemeClass = (roomMember: RoomMember): string => {
        if (roomMember.payload && roomMember.payload.theme) {
            return "cursor-inner-mellow";
        } else {
            return "cursor-inner";
        }
    }
    private getCursorBackgroundColor = (roomMember: RoomMember): string | undefined => {
        const isHaveName = this.detectCursorName(roomMember);
        if (roomMember.payload && roomMember.payload.cursorBackgroundColor) {
            return roomMember.payload.cursorBackgroundColor;
        } else {
            if (isHaveName) {
                return `rgb(${roomMember.memberState.strokeColor[0]}, ${roomMember.memberState.strokeColor[1]}, ${roomMember.memberState.strokeColor[2]})`;
            } else {
                // 安卓低版本不支持 rgba
                return undefined;
            }
        }
    }

    private getCursorTextColor = (roomMember: RoomMember): string | undefined => {
        if (roomMember.payload && roomMember.payload.cursorTextColor) {
            return roomMember.payload.cursorTextColor;
        } else {
            return "#FFFFFF";
        }
    }

    private getCursorTagBackgroundColor = (roomMember: RoomMember): string | undefined => {
        if (roomMember.payload && roomMember.payload.cursorTagBackgroundColor) {
            return roomMember.payload.cursorTagBackgroundColor;
        } else {
            return this.getCursorBackgroundColor(roomMember);
        }
    }

    private detectCursorName = (roomMember: RoomMember): boolean => {
        return !!(roomMember.payload && roomMember.payload.cursorName);
    }

    private detectAvatar = (roomMember: RoomMember): boolean => {
        return !!(roomMember.payload && roomMember.payload.avatar);
    }

    private renderTag = (roomMember: RoomMember): React.ReactNode => {
        if (roomMember.payload && roomMember.payload.cursorTagName) {
            return (
                <span className="cursor-tag-name"
                      style={{backgroundColor: this.getCursorTagBackgroundColor(roomMember)}}>
                    {roomMember.payload.cursorTagName}
                </span>
            );
        } else {
            return undefined;
        }
    }

    public render(): React.ReactNode {
        const {roomMember} = this.props;
        const cursorName = this.getCursorName(roomMember);
        const appliance = roomMember.memberState.currentApplianceName;
        switch (appliance) {
            case ApplianceNames.pencil: {
                return (
                    <div className="cursor-box">
                        <div className="cursor-mid cursor-pencil-offset" style={{transform: `translate(-50%, -90%)`, marginLeft:'10px'}}>
                            <div className="cursor-name">
                                <div style={{
                                    opacity: this.getOpacity(roomMember),
                                    backgroundColor: this.getCursorBackgroundColor(roomMember),
                                    color: this.getCursorTextColor(roomMember),
                                }} className={this.getThemeClass(roomMember)}>
                                    {this.renderAvatar(roomMember)}
                                    {cursorName}
                                    {this.renderTag(roomMember)}
                                </div>
                            </div>
                            <div>
                                <img className="cursor-pencil-image" src={pencilCursor} alt={"pencilCursor"}/>
                            </div>
                        </div>
                    </div>
                );
            }
            default:
                return null;
        }
    }
}
export const CursorManager = (props:{
    className: string,
    info?: {x?:number,y?:number, roomMember?:RoomMember}
}) => {
    const { className, info } = props;
    const { roomMember, ...position } = info || {};
    // console.log('CursorManager', position, roomMember)
    return (
        <div className={`${className}`} style={ position ? {
            transform: `translate(${position.x}px, ${position.y}px)`
        } : { display: 'none'}}>
            {
                roomMember && <CursorComponent roomMember={roomMember}/>
            }
        </div>
    )
}