import React, { FocusEventHandler, KeyboardEventHandler } from "react";
import { TextEditorInfo, TextOptions } from "./types";
import { ApplianceViewManagerLike, EmitEventType } from "../../plugin/types";
export declare const Max_Font_Size = 80;
export interface TextSelectorManagerProps {
    selectIds: string[];
    className?: string;
    editors?: Map<string, TextEditorInfo>;
    activeTextId?: string;
    box?: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    manager: ApplianceViewManagerLike;
    showFloatBtns?: boolean;
    operationType?: EmitEventType;
}
export interface TextViewProps {
    workId: string;
    data: TextEditorInfo;
    isSelect?: boolean;
    isActive?: boolean;
    manager: ApplianceViewManagerLike;
}
export interface TextSelectorViewProps extends TextViewProps {
    left: string;
    top: string;
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
    runAnimation: () => void;
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
    ref: React.RefObject<HTMLDivElement> | undefined;
    isRunAnimation?: number;
    constructor(props: TextSelectorManagerProps);
    runAnimation(): void;
    handleKeyUp(e: any): void;
    handleFocus(e: any): void;
    get editorUI(): JSX.Element[] | null;
    render(): React.JSX.Element;
}
