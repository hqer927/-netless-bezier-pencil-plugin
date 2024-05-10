import React, { FocusEventHandler, KeyboardEventHandler } from "react";
import { TextEditorInfo, TextOptions } from "./types";
import { TeachingAidsViewManagerLike } from "../../plugin/types";
export interface TextSelectorManagerProps {
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
    showFloatBtns?: boolean;
}
export interface TextViewProps {
    workId: string;
    data: TextEditorInfo;
    isSelect?: boolean;
    isActive?: boolean;
    manager: TeachingAidsViewManagerLike;
}
export interface TextSelectorViewProps extends TextViewProps {
    position?: {
        x: number;
        y: number;
    };
    selectIds?: string[];
    updateOptInfo: (param: {
        activeTextId: string;
        update: Partial<TextOptions>;
        syncData?: Pick<TextEditorInfo, 'canSync' | 'canWorker'>;
    }) => void;
}
export interface TextEditorProps extends TextViewProps {
    showFloatBtns: boolean;
    handleKeyUp: KeyboardEventHandler<HTMLDivElement>;
    handleFocus: FocusEventHandler<HTMLDivElement>;
    updateOptInfo: (param: {
        activeTextId: string;
        update: Partial<TextOptions>;
        syncData?: Pick<TextEditorInfo, 'canSync' | 'canWorker'>;
    }) => void;
}
export declare const TextView: (props: TextViewProps) => React.JSX.Element;
export declare const TextSelectorView: React.MemoExoticComponent<(props: TextSelectorViewProps) => React.JSX.Element>;
export declare const TextEditor: (props: TextEditorProps) => React.JSX.Element;
export declare class TextViewInSelector extends React.Component<TextSelectorManagerProps, {
    hasEditor: boolean;
}> {
    constructor(props: TextSelectorManagerProps);
    getInnerText(target: HTMLDivElement): string[];
    updateOptInfo(param: {
        activeTextId: string;
        update: Partial<TextOptions>;
        syncData?: Pick<TextEditorInfo, 'canSync' | 'canWorker'>;
    }): void;
    get editorUI(): JSX.Element[] | null;
    render(): React.JSX.Element;
}
export declare class TextEditorContainer extends TextViewInSelector {
    constructor(props: TextSelectorManagerProps);
    handleKeyUp(e: any): void;
    handleFocus(e: any): void;
    get editorUI(): JSX.Element[] | null;
    render(): React.JSX.Element;
}
