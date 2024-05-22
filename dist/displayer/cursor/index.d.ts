import React from "react";
import { type RoomMember, type TeachingAidsViewManagerLike } from "../../plugin/types";
import "./index.less";
export declare const CursorManagerComponent: (props: {
    className: string;
    info: {
        x?: number;
        y?: number;
        roomMember?: RoomMember;
    };
}) => React.JSX.Element;
export declare const CursorManager: (props: {
    className: string;
    manager: TeachingAidsViewManagerLike;
}) => React.JSX.Element | null;
