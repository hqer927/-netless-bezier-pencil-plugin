import React from "react";
import { type RoomMember, type ApplianceViewManagerLike } from "../../plugin/types";
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
    manager: ApplianceViewManagerLike;
}) => React.JSX.Element | null;
