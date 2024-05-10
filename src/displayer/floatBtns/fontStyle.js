import React, { useContext, useEffect, useMemo, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import { IconURL } from "../icons";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { Storage_Selector_key } from "../../collector/const";
import isBoolean from "lodash/isBoolean";
const BoldBtn = (props) => {
    const { bold, setBold, workIds, viewId } = props;
    const onClickHandler = (e) => {
        const _bold = bold === 'bold' ? 'normal' : 'bold';
        e?.preventDefault();
        e?.stopPropagation();
        setBold(_bold);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetFontStyle, { workIds, viewId, bold: _bold });
    };
    return (React.createElement("div", { className: 'font-style-button', onClick: onClickHandler, onTouchEnd: onClickHandler },
        React.createElement("img", { alt: "icon", src: IconURL(bold === 'bold' ? 'bold-active' : 'bold') })));
};
const UnderlineBtn = (props) => {
    const { underline, setUnderline, workIds, viewId } = props;
    const onClickHandler = (e) => {
        const _underline = !underline;
        e?.preventDefault();
        e?.stopPropagation();
        setUnderline(_underline);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetFontStyle, { workIds, viewId, underline: _underline });
    };
    return (React.createElement("div", { className: 'font-style-button', onClick: onClickHandler, onTouchEnd: onClickHandler },
        React.createElement("img", { alt: "icon", src: IconURL(underline ? 'underline-active' : 'underline') })));
};
const LineThrough = (props) => {
    const { lineThrough, setLineThrough, workIds, viewId } = props;
    const onClickHandler = (e) => {
        const _lineThrough = !lineThrough;
        e?.preventDefault();
        e?.stopPropagation();
        setLineThrough(_lineThrough);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetFontStyle, { workIds, viewId, lineThrough: _lineThrough });
    };
    return (React.createElement("div", { className: 'font-style-button', onClick: onClickHandler, onTouchEnd: onClickHandler },
        React.createElement("img", { alt: "icon", src: IconURL(lineThrough ? 'line-through-active' : 'line-through') })));
};
const ItalicBtn = (props) => {
    const { italic, setItalic, workIds, viewId } = props;
    const onClickHandler = (e) => {
        const _italic = italic === 'italic' ? 'normal' : 'italic';
        e?.preventDefault();
        e?.stopPropagation();
        setItalic(_italic);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetFontStyle, { workIds, viewId, italic: _italic });
    };
    return (React.createElement("div", { className: 'font-style-button', onClick: onClickHandler, onTouchEnd: onClickHandler },
        React.createElement("img", { alt: "icon", src: IconURL(italic === 'italic' ? 'italic-active' : 'italic') })));
};
export const FontStyleBtn = (props) => {
    const { open: showSubBtn, setOpen: setShowSubBtn, textOpt, workIds, style } = props;
    const { maranger } = useContext(DisplayerContext);
    const [bold, setBold] = useState('normal');
    const [italic, setItalic] = useState('normal');
    const [underline, setUnderline] = useState(false);
    const [lineThrough, setLineThrough] = useState(false);
    useEffect(() => {
        if (textOpt?.bold) {
            setBold(textOpt.bold);
        }
        if (isBoolean(textOpt?.underline)) {
            setUnderline(textOpt.underline || false);
        }
        if (isBoolean(textOpt?.lineThrough)) {
            setLineThrough(textOpt.lineThrough || false);
        }
        if (textOpt?.italic) {
            setItalic(textOpt.italic);
        }
    }, [textOpt]);
    const subBtnStyle = useMemo(() => {
        if (style && style.bottom) {
            const value = {};
            value.top = 'inherit';
            value.bottom = 50;
            return value;
        }
        return undefined;
    }, [style]);
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (React.createElement("div", { className: "font-style-menu", style: subBtnStyle, onTouchEnd: (e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }, onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                } },
                React.createElement(BoldBtn, { workIds: workIds || [Storage_Selector_key], bold: bold, setBold: setBold, viewId: maranger?.viewId }),
                React.createElement(UnderlineBtn, { workIds: workIds || [Storage_Selector_key], underline: underline, setUnderline: setUnderline, viewId: maranger?.viewId }),
                React.createElement(LineThrough, { workIds: workIds || [Storage_Selector_key], lineThrough: lineThrough, setLineThrough: setLineThrough, viewId: maranger?.viewId }),
                React.createElement(ItalicBtn, { workIds: workIds || [Storage_Selector_key], italic: italic, setItalic: setItalic, viewId: maranger?.viewId })));
        }
        return null;
    }, [showSubBtn, workIds, bold, maranger?.viewId, underline, lineThrough, italic, subBtnStyle]);
    return (React.createElement("div", { className: `button normal-button ${showSubBtn && 'active'}`, onTouchEnd: (e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
        }, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
        } },
        React.createElement("img", { alt: "icon", src: IconURL(showSubBtn ? 'font-style-active' : 'font-style') }),
        SubBtns));
};
