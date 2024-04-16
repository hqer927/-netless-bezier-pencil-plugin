import React from "react";
import { TeachingAidsSingleManager } from "./teachingAidsSingleManager";
import { DisplayStateEnum, InternalMsgEmitterType } from "../types";
export class TeachingAidsSigleWrapper extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "mainViewRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    componentDidMount() {
        // console.log('TeachingAidsSigleWrapper')
        if (!TeachingAidsSigleWrapper.emiter) {
            TeachingAidsSigleWrapper.emiter = TeachingAidsSingleManager.InternalMsgEmitter;
        }
        TeachingAidsSigleWrapper.emiter.emit(InternalMsgEmitterType.BindMainView, this.mainViewRef);
    }
    componentWillUnmount() {
        TeachingAidsSigleWrapper.emiter.emit(InternalMsgEmitterType.DisplayState, DisplayStateEnum.unmounted);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.props.children,
            React.createElement("div", { className: "teaching-aids-plugin-main-view-displayer", ref: (ref) => this.mainViewRef = ref })));
    }
}
