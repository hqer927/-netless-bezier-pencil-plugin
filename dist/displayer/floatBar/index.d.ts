import React from "react";
import { TextEditorInfo } from "../../component/textEditor";
export declare const FloatBar: React.ForwardRefExoticComponent<{
    className: string;
    editors?: Map<string, TextEditorInfo> | undefined;
    activeTextId?: string | undefined;
} & React.RefAttributes<HTMLCanvasElement>>;
