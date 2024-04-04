/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { FloatBtns } from "../../displayer/floatBtns";
import { EvevtWorkState } from "../../core";
import isNumber from "lodash/isNumber";
export const TextView = (props) => {
    const { data } = props;
    const { opt, scale, translate, x, y } = data;
    const transform = `scale(${scale || 1}) ${translate && 'translate(' + translate[0] + 'px,' + translate[1] + 'px)' || ''}`;
    const { fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight, workState } = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
    };
    if (fontFamily) {
        style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through'}${underline && ' underline'}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    let html = '';
    if (opt?.text) {
        const texts = opt.text.split(',');
        html = texts.reduce((total, cur, i) => {
            const c = cur === '' ? '<br/>' : cur;
            if (i === 0) {
                return c;
            }
            return `${total}<div>${c}</div>`;
        }, '');
    }
    return (React.createElement("div", { className: "editor-box", style: {
            left: `${x}px`,
            top: `${y}px`,
            transform,
            transformOrigin: `left top`,
            pointerEvents: 'none'
        } },
        React.createElement("div", { className: `editor ${workState === EvevtWorkState.Done ? 'readOnly' : ''}`, style: style, dangerouslySetInnerHTML: { __html: html } })));
};
export const TextSelectorView = React.memo((props) => {
    const { data, position, workId, selectIds } = props;
    const [point, setPoint] = useState([0, 0]);
    const { opt, scale, translate, x, y } = data;
    useEffect(() => {
        if (isNumber(x) && isNumber(y)) {
            setPoint([x - (position?.x || 0), y - (position?.y || 0)]);
        }
    }, [workId, selectIds]);
    const transform = `scale(${scale || 1}) ${translate && 'translate(' + translate[0] + 'px,' + translate[1] + 'px)' || ''}`;
    const { fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight } = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`
    };
    if (fontFamily) {
        style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through'}${underline && ' underline'}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    let html = '';
    if (opt?.text) {
        const texts = opt.text.split(',');
        html = texts.reduce((total, cur, i) => {
            const c = cur === '' ? '<br/>' : cur;
            if (i === 0) {
                return c;
            }
            return `${total}<div>${c}</div>`;
        }, '');
    }
    return (React.createElement("div", { className: "editor-box", style: {
            left: `${point[0]}px`,
            top: `${point[1]}px`,
            transform,
            transformOrigin: `left top`,
        } },
        React.createElement("div", { className: 'editor readOnly', style: style, dangerouslySetInnerHTML: { __html: html } })));
});
export const TextEditor = (props) => {
    const { data, workId, isSelect, handleKeyUp, handleFocus } = props;
    const { opt, scale, translate, x, y } = data;
    const [html, setHtml] = useState('');
    const ref = useRef(null);
    useEffect(() => {
        let html = '';
        if (opt?.text) {
            const texts = opt.text.split(',');
            html = texts.reduce((total, cur, i) => {
                const c = cur === '' ? '<br/>' : cur;
                if (i === 0) {
                    return c;
                }
                return `${total}<div>${c}</div>`;
            }, '');
        }
        // console.log('useEffect', html)
        setHtml(html);
        Promise.resolve().then(() => {
            // console.log('componentDidUpdate1')
            if (ref.current) {
                ref.current.click();
            }
        });
    }, []);
    const transform = `scale(${scale || 1}) ${translate && 'translate(' + translate[0] + 'px,' + translate[1] + 'px)' || ''}`;
    const { fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight } = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
    };
    if (fontFamily) {
        style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through'}${underline && ' underline'}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    function handleClick() {
        if (ref.current) {
            ref.current.focus();
            const selection = window?.getSelection();
            const lastChildNode = ref.current.lastChild;
            if (selection && lastChildNode) {
                const range = document.createRange();
                const i = lastChildNode.textContent?.length || 0;
                if (lastChildNode?.nodeName === '#text') {
                    range.setStart(lastChildNode, i);
                }
                else {
                    range.setStart(lastChildNode, i && 1 || 0);
                }
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    function handleKeyDown(e) {
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
        return false;
    }
    return (React.createElement("div", { className: "editor-box", style: {
            left: `${x}px`,
            top: `${y}px`,
            transform,
            transformOrigin: `left top`,
            zIndex: 2,
            pointerEvents: 'auto'
        }, onKeyDown: (e) => {
            e.stopPropagation();
            return true;
        }, onMouseMove: (e) => {
            e.stopPropagation();
            e.preventDefault();
            return true;
        } },
        !isSelect && React.createElement(FloatBtns, { textOpt: opt, workIds: [workId], noLayer: true, position: { x, y } }),
        React.createElement("div", { contentEditable: true, className: 'editor', ref: ref, style: style, dangerouslySetInnerHTML: { __html: html }, onKeyDown: handleKeyDown, onKeyUp: handleKeyUp, onClick: handleClick, onFocus: handleFocus })));
};
export class TextViewInSelector extends React.Component {
    constructor(props) {
        super(props);
    }
    getInnerText(target) {
        const texts = [];
        for (const child of target.childNodes) {
            if (child.nodeName === '#text') {
                const _t = child.textContent.replace(/\n/, '');
                texts.push(_t);
            }
            else {
                const _t = child.innerText.replace(/\n/, '');
                texts.push(_t);
            }
        }
        return texts;
    }
    updateOptInfo(param) {
        const { activeTextId, update } = param;
        const _info = activeTextId && cloneDeep(this.props.editors?.get(activeTextId));
        if (_info && _info.opt) {
            _info.opt = {
                ..._info.opt,
                ...update
            };
            // this.props.manage?.set(activeTextId,_info);
            this.props.manager.control.textEditorManager.updateForLocalEditor(activeTextId, _info);
            // this.props.manager.internalMsgEmitter.emit([InternalMsgEmitterType.TextEditor, EmitEventType.SetEditorData],activeTextId);
        }
    }
    get editorUI() {
        if (this.props.editors?.size) {
            const editors = [];
            this.props.editors.forEach((value, key) => {
                if (this.props.selectIds.includes(key)) {
                    const isActive = this.props.activeTextId == key;
                    if (!isActive) {
                        const editor = React.createElement(TextSelectorView, { key: key, data: value, workId: key, isSelect: true, position: this.props.position, selectIds: this.props.selectIds });
                        editors.push(editor);
                    }
                }
            });
            return editors;
        }
        return null;
    }
    render() {
        return React.createElement("div", { ref: this.props.textRef, onClick: (e) => {
                e.stopPropagation();
                e.preventDefault();
                const point = this.props.manager.getPoint(e);
                point && this.props.manager.control.textEditorManager.computeTextActive(point, this.props.manager.viewId);
            } }, this.editorUI);
    }
}
export class TextEditorContainer extends TextViewInSelector {
    constructor(props) {
        super(props);
    }
    handleKeyUp(e) {
        const texts = this.getInnerText(e.nativeEvent.target);
        // console.log('handleKeyUp', texts)
        const activeTextId = this.props.activeTextId;
        if (activeTextId) {
            this.updateOptInfo({
                activeTextId,
                update: {
                    text: texts.toString(),
                    boxSize: [e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight],
                    workState: EvevtWorkState.Doing
                }
            });
        }
    }
    handleFocus(e) {
        const activeTextId = this.props.activeTextId;
        if (activeTextId) {
            // console.log('handleFocus', activeTextId)
            this.updateOptInfo({
                activeTextId,
                update: {
                    boxSize: [e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight],
                    workState: EvevtWorkState.Doing
                }
            });
        }
    }
    get editorUI() {
        if (this.props.editors?.size) {
            const editors = [];
            this.props.editors.forEach((value, key) => {
                const notShow = this.props.selectIds.includes(key) && this.props.activeTextId !== key;
                if (!notShow) {
                    const isActive = this.props.activeTextId == key;
                    const editor = isActive ? React.createElement(TextEditor, { key: key, data: value, workId: key, handleFocus: this.handleFocus.bind(this), handleKeyUp: this.handleKeyUp.bind(this) }) : React.createElement(TextView, { key: key, data: value, workId: key });
                    editors.push(editor);
                }
            });
            return editors;
        }
        return null;
    }
    render() {
        return React.createElement("div", { className: `${this.props.className}` }, this.editorUI);
    }
}
