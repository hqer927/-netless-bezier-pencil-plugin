/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { Storage_Selector_key } from "../../collector/const";
import { FontSizeList } from "../const";
const SubBtns = (props) => {
    const { position, onClickHandler } = props;
    return (React.createElement("div", { className: "font-size-menu", style: position && position.y < 80 ? {
            top: 'inherit', bottom: '50px'
        } : undefined, onTouchEnd: (e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        } }, FontSizeList.map(s => (React.createElement("div", { className: "font-size-btn", key: s, onClick: () => { onClickHandler(s); }, onTouchEnd: () => { onClickHandler(s); } }, s)))));
};
export const FontSizeBtn = (props) => {
    const ref = useRef(null);
    const { open: showSubBtn, setOpen: setShowSubBtn, textOpt, workIds } = props;
    const { position, maranger } = useContext(DisplayerContext);
    const [size, setSize] = useState(0);
    const length = FontSizeList.length - 1;
    useEffect(() => {
        if (textOpt?.fontSize) {
            setSize(textOpt.fontSize);
            if (ref.current) {
                ref.current.value = textOpt.fontSize.toString();
            }
        }
    }, [textOpt?.fontSize]);
    useEffect(() => {
        if (size && size !== textOpt?.fontSize && size >= FontSizeList[0] && size <= FontSizeList[length]) {
            // console.log('useEffect---1', size)
            if (ref.current) {
                ref.current.value = size.toString();
            }
            MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetFontStyle, {
                workIds: workIds || [Storage_Selector_key],
                fontSize: size,
                viewId: maranger?.viewId
            });
        }
    }, [maranger?.viewId, size, textOpt?.fontSize, workIds]);
    const onClickHandler = (s) => {
        setSize(s);
        setShowSubBtn(false);
        ref.current?.blur();
    };
    const SubBtnUI = useMemo(() => {
        if (showSubBtn) {
            return React.createElement(SubBtns, { onClickHandler: onClickHandler, position: position });
        }
        return null;
    }, [showSubBtn, onClickHandler, position]);
    const checkSize = (number) => {
        if (number > FontSizeList[length])
            number = FontSizeList[length];
        if (number < FontSizeList[0])
            number = FontSizeList[0];
        setSize(number);
    };
    return (React.createElement("div", { className: 'button normal-button font-size-barBtn', style: { width: 50 }, onTouchEnd: (e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        } },
        React.createElement("input", { className: "font-size-input", ref: ref, onTouchEnd: () => {
                // setShowSubBtn(true);
                if (ref.current) {
                    ref.current.focus();
                }
            }, onClick: () => {
                setShowSubBtn(true);
                if (ref.current) {
                    ref.current.focus();
                }
            }, onKeyDown: (e) => {
                if (e.key === 'Backspace') {
                    // 获取光标位置
                    const selection = window.getSelection();
                    const range = selection?.getRangeAt(0);
                    // 检查是否有选区文本，如果有则正常删除
                    if (range?.collapsed) {
                        e.preventDefault();
                        // 执行删除操作，这里可以根据具体需求调整删除逻辑
                        document.execCommand('delete', false);
                        return false;
                    }
                }
            }, onKeyUp: () => {
                if (ref.current) {
                    const value = ref.current.value;
                    const number = parseInt(value);
                    if (!isNaN(number)) {
                        ref.current.value = number.toString();
                    }
                    else {
                        ref.current.value = '0';
                    }
                }
            }, onChange: (e) => {
                const value = e.target.value;
                const number = parseInt(value);
                if (number) {
                    setSize(number);
                }
            } }),
        React.createElement("div", { className: "font-size-btns" },
            React.createElement("div", { className: "font-size-add", onClick: () => {
                    checkSize(size + FontSizeList[0]);
                }, onTouchEnd: () => {
                    checkSize(size + FontSizeList[0]);
                } }),
            React.createElement("div", { className: "font-size-cut", onClick: () => {
                    checkSize(size - FontSizeList[0]);
                }, onTouchEnd: () => {
                    checkSize(size - FontSizeList[0]);
                } })),
        SubBtnUI));
};
