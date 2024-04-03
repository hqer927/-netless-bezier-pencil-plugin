import React, { FocusEventHandler, KeyboardEventHandler } from "react";
import { TextEditorInfo, TextOptions } from "./types";
import { TeachingAidsViewManagerLike } from "../../plugin/types";
export interface TextEditorManagerProps {
    selectIds: string[];
    className?: string;
    editors?: Map<string, TextEditorInfo>;
    activeTextId?: string;
    position?: {
        x: number;
        y: number;
    };
    textRef?: React.RefObject<HTMLDivElement>;
    manager: TeachingAidsViewManagerLike;
}
export interface TextViewProps {
    workId: string;
    data: TextEditorInfo;
    isSelect?: boolean;
}
export interface TextSelectorViewProps extends TextViewProps {
    position?: {
        x: number;
        y: number;
    };
    selectIds?: string[];
}
export interface TextEditorProps extends TextViewProps {
    handleKeyUp: KeyboardEventHandler<HTMLDivElement>;
    handleFocus: FocusEventHandler<HTMLDivElement>;
}
export declare const TextView: (props: TextViewProps) => React.JSX.Element;
export declare const TextSelectorView: React.MemoExoticComponent<(props: TextSelectorViewProps) => React.JSX.Element>;
export declare const TextEditor: (props: TextEditorProps) => React.JSX.Element;
export declare class TextViewInSelector extends React.Component<TextEditorManagerProps> {
    constructor(props: TextEditorManagerProps);
    getInnerText(target: HTMLDivElement): string[];
    updateOptInfo(param: {
        activeTextId: string;
        update: Partial<TextOptions>;
    }): void;
    get editorUI(): JSX.Element[] | null;
    render(): React.JSX.Element;
}
export declare class TextEditorContainer extends TextViewInSelector {
    constructor(props: TextEditorManagerProps);
    handleKeyUp(e: any): void;
    handleFocus(e: any): void;
    get editorUI(): JSX.Element[] | null;
    render(): React.JSX.Element;
}
