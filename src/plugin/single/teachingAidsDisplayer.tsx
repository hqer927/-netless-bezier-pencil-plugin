/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import React from "react";
import type { ReactNode } from "react";
import { TeachingAidsSingleManager } from "./teachingAidsSingleManager";
import { DisplayStateEnum, InternalMsgEmitterType } from "../types";

interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
}
export class TeachingAidsSigleWrapper extends React.Component<DisplayerProps, DisplayerState> {
    static emiter: EventEmitter2;
    mainViewRef:HTMLDivElement|null = null;
    componentDidMount() {
        // console.log('TeachingAidsSigleWrapper')
        if (!TeachingAidsSigleWrapper.emiter) {
            TeachingAidsSigleWrapper.emiter = TeachingAidsSingleManager.InternalMsgEmitter;
        }
        TeachingAidsSigleWrapper.emiter.emit(InternalMsgEmitterType.BindMainView,this.mainViewRef);
    }
    componentWillUnmount() {
        TeachingAidsSigleWrapper.emiter.emit(InternalMsgEmitterType.DisplayState, DisplayStateEnum.unmounted);
    }
    render(): ReactNode {
        return (
            <React.Fragment>
                {this.props.children}
                <div className="teaching-aids-plugin-main-view-displayer" ref={(ref) => this.mainViewRef = ref}></div>
            </React.Fragment>
        );
    }
}