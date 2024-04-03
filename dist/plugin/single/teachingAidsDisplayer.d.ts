import EventEmitter2 from "eventemitter2";
import React from "react";
import type { ReactNode } from "react";
interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
}
export declare class TeachingAidsSigleWrapper extends React.Component<DisplayerProps, DisplayerState> {
    static emiter: EventEmitter2;
    mainViewRef: HTMLDivElement | null;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export {};
