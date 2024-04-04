import * as React from "react";
import { RoomMember } from "white-web-sdk";
import "@netless/cursor-tool/src/index.less";
export declare const CursorManager: (props: {
    className: string;
    info?: {
        x?: number;
        y?: number;
        roomMember?: RoomMember;
    };
}) => React.JSX.Element;
