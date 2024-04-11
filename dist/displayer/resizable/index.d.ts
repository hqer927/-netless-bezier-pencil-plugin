import React from "react";
export declare const ResizableBox: (props: {
    className: string;
}) => React.JSX.Element;
export declare const ResizableTwoBtn: (props: {
    id: string;
    pos: {
        x: number;
        y: number;
    };
    pointMap: Map<string, [number, number][]>;
    type: 'start' | 'end';
}) => React.JSX.Element;
export declare const ResizableTwoBox: (props: {
    className: string;
}) => React.JSX.Element;
