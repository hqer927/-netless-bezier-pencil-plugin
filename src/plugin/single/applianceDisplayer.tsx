/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter2 from "eventemitter2";
import React from "react";
import type { ReactNode } from "react";
import { ApplianceSingleManager } from "./applianceSingleManager";
import { InternalMsgEmitterType } from "../types";

interface DisplayerProps {
    children?: ReactNode;
}
interface DisplayerState {
}
export class ApplianceSigleWrapper extends React.Component<DisplayerProps, DisplayerState> {
    static emiter: EventEmitter2;
    mainViewRef:HTMLDivElement|null = null;
    componentDidMount() {
        if (!ApplianceSigleWrapper.emiter) {
            ApplianceSigleWrapper.emiter = ApplianceSingleManager.InternalMsgEmitter;
        }
        ApplianceSigleWrapper.emiter.emit(InternalMsgEmitterType.BindMainView,this.mainViewRef);
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