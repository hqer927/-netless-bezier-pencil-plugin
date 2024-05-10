/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { FloatBtns } from "../../displayer/floatBtns";
import { EvevtWorkState } from "../../core";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
export const TextView = (props) => {
    const { data, isActive, manager, workId } = props;
    const { opt, scale, translate, x, y } = data;
    const transform = `scale(${scale || 1}) ${translate && 'translate(' + translate[0] + 'px,' + translate[1] + 'px)' || ''}`;
    const { fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight, bold, italic, uid } = opt;
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
        style.textDecoration = `${lineThrough && 'line-through' || ''}${underline && ' underline' || ''}`;
    }
    if (bold) {
        style.fontWeight = `${bold}`;
    }
    if (italic) {
        style.fontStyle = `${italic}`;
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
    function handleClick() {
        console.log('onServiceDerive---handleClick', isActive, uid, manager.control.collector?.uid);
        if (isActive && (uid && uid === manager.control.collector?.uid || !uid)) {
            manager.control.textEditorManager.active(workId);
        }
    }
    return (React.createElement("div", { className: "editor-box", style: {
            left: `${x}px`,
            top: `${y}px`,
            transform,
            transformOrigin: `left top`,
            pointerEvents: 'none'
        } },
        React.createElement("div", { className: `editor ${!isActive ? 'readOnly' : ''}`, 
            // className={`editor ${(workState !== EvevtWorkState.Start && workState !== EvevtWorkState.Doing) ? 'readOnly' : ''}`}
            style: style, dangerouslySetInnerHTML: { __html: html }, onClick: handleClick })));
};
export const TextSelectorView = React.memo((props) => {
    const { data, position, workId, selectIds, updateOptInfo } = props;
    const [point, setPoint] = useState([0, 0]);
    const { opt, scale, translate, x, y } = data;
    const ref = useRef(null);
    useEffect(() => {
        if (isNumber(x) && isNumber(y)) {
            // console.log('TextViewInSelectorUI---22', workId, x, y, selectIds)
            setPoint([x - (position?.x || 0), y - (position?.y || 0)]);
        }
    }, [x, y, selectIds, workId]);
    useEffect(() => {
        if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
            const oldBoxSize = opt.boxSize;
            if (oldBoxSize?.[0] !== ref.current.offsetWidth || oldBoxSize[1] !== ref.current.offsetHeight || !oldBoxSize) {
                console.log('updateForViewEdited---1--0', workId, oldBoxSize, [ref.current.offsetWidth, ref.current.offsetHeight]);
                updateOptInfo({
                    activeTextId: workId,
                    update: {
                        boxSize: [ref.current.offsetWidth, ref.current.offsetHeight],
                        workState: EvevtWorkState.Done
                    },
                    syncData: {
                        canSync: true,
                        canWorker: true,
                    }
                });
            }
        }
    }, [opt.fontSize]);
    const transform = `scale(${scale || 1}) ${translate && 'translate(' + translate[0] + 'px,' + translate[1] + 'px)' || ''}`;
    const { fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight, bold, italic } = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
        pointerEvents: 'none'
    };
    if (fontFamily) {
        style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through' || ''}${underline && ' underline' || ''}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    if (bold) {
        style.fontWeight = `${bold}`;
    }
    if (italic) {
        style.fontStyle = `${italic}`;
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
            zIndex: 1,
            pointerEvents: 'none'
        } },
        React.createElement("div", { className: 'editor readOnly', ref: ref, style: style, dangerouslySetInnerHTML: { __html: html } })));
});
export const TextEditor = (props) => {
    const { data, workId, isSelect, handleKeyUp, handleFocus, updateOptInfo, showFloatBtns, manager } = props;
    const [oldDisableDeviceInputs, setOldDisableDeviceInputs] = useState();
    const { opt, scale, translate, x, y } = data;
    const [html, setHtml] = useState('');
    const ref = useRef(null);
    // useLayoutEffect(()=>{
    //    console.log('onServiceDerive---TextEditor---3', data.dataType, opt?.text,ref.current?.innerText)
    // },[opt?.text, data.dataType])
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
        // console.log('onServiceDerive---TextEditor---1',opt?.text)
        setHtml(html);
        Promise.resolve().then(() => {
            if (ref.current) {
                ref.current.click();
            }
        });
    }, []);
    useEffect(() => {
        if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
            // console.log('onServiceDerive---TextEditor---2',ref.current?.innerText)
            updateOptInfo({
                activeTextId: workId,
                update: {
                    boxSize: [ref.current.offsetWidth, ref.current.offsetHeight],
                    workState: EvevtWorkState.Doing
                }
            });
        }
    });
    const transform = `scale(${scale || 1}) ${translate && 'translate(' + translate[0] + 'px,' + translate[1] + 'px)' || ''}`;
    const { fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight, bold, italic } = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style = {
        transform,
        transformOrigin: `left top`,
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
        style.textDecoration = `${lineThrough && 'line-through' || ''} ${underline && ' underline' || ''}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    if (bold) {
        style.fontWeight = `${bold}`;
    }
    if (italic) {
        style.fontStyle = `${italic}`;
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
    function handlePaste(e) {
        e.preventDefault();
        if (ref.current) {
            let paste = (e.clipboardData || window.clipboardData).getData("text");
            paste = paste.toUpperCase();
            const selection = window?.getSelection();
            if (!selection?.rangeCount)
                return;
            const texts = paste.split(/\n/);
            if (selection && texts.length) {
                selection.deleteFromDocument();
                const range = document.createRange();
                let lastChildNode = ref.current.lastChild;
                if (!lastChildNode) {
                    const text = document.createTextNode(texts[0]);
                    ref.current.appendChild(text);
                    if (texts.length === 1) {
                        const i = text.textContent?.length || 0;
                        range.setStart(text, i);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        return;
                    }
                }
                if (lastChildNode?.nodeName === '#text') {
                    lastChildNode.textContent = lastChildNode.textContent + texts[0];
                    if (texts.length === 1) {
                        const i = lastChildNode.textContent?.length || 0;
                        range.setStart(lastChildNode, i);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        return;
                    }
                }
                if (lastChildNode?.nodeName === 'DIV') {
                    lastChildNode.innerText = lastChildNode.innerText + texts[0];
                }
                for (let i = 1; i < texts.length; i++) {
                    const text = texts[i];
                    if (text) {
                        const div = document.createElement('div');
                        div.innerText = text;
                        ref.current.appendChild(div);
                    }
                }
                lastChildNode = ref.current.lastChild;
                if (lastChildNode) {
                    range.setStart(lastChildNode, 1);
                }
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    return (React.createElement("div", { className: "editor-box", style: {
            left: `${x}px`,
            top: `${y}px`,
            zIndex: 2,
            pointerEvents: 'none'
        }, onFocus: () => {
            if (manager.control.room && !manager.control.room.disableDeviceInputs) {
                setOldDisableDeviceInputs(manager.control.room.disableDeviceInputs);
                manager.control.room.disableDeviceInputs = true;
            }
        }, onBlur: () => {
            if (manager?.control.room && isBoolean(oldDisableDeviceInputs)) {
                manager.control.room.disableDeviceInputs = oldDisableDeviceInputs;
            }
        }, onKeyDown: (e) => {
            e.stopPropagation();
            return true;
        }, onMouseMove: (e) => {
            e.stopPropagation();
            e.preventDefault();
            return true;
        } },
        !isSelect && showFloatBtns && React.createElement(FloatBtns, { textOpt: opt, workIds: [workId], noLayer: true, position: { x, y } }),
        React.createElement("div", { id: workId, contentEditable: true, className: 'editor', ref: ref, style: style, dangerouslySetInnerHTML: { __html: html }, onKeyDown: handleKeyDown, onKeyUp: handleKeyUp, onClick: handleClick, onTouchEnd: handleClick, onFocus: handleFocus, onPaste: handlePaste })));
};
export class TextViewInSelector extends React.Component {
    constructor(props) {
        super(props);
    }
    getInnerText(target) {
        const texts = [];
        for (let i = 0; i < target.childNodes.length; i++) {
            const child = target.childNodes[i];
            if (child.nodeName === '#text' && i === 0) {
                const _t = child.textContent.split(/\n/);
                const last = _t.pop();
                texts.push(..._t);
                if (last) {
                    texts.push(last);
                }
            }
            else if (child.nodeName === 'DIV') {
                const _t = child.innerText.split(/\n/);
                if (_t.length === 2 && _t[0] === '' && _t[1] === '') {
                    texts.push('');
                }
                else {
                    const s = _t.shift();
                    if (s) {
                        texts.push(s);
                    }
                    const last = _t.pop();
                    texts.push(..._t);
                    if (last) {
                        texts.push(last);
                    }
                }
            }
        }
        return texts;
    }
    updateOptInfo(param) {
        const { activeTextId, update, syncData } = param;
        const _info = activeTextId && cloneDeep(this.props.manager.control.textEditorManager?.get(activeTextId) || this.props.editors?.get(activeTextId));
        if (_info && _info.opt) {
            _info.opt = {
                ..._info.opt,
                ...update
            };
            if (syncData) {
                _info.canSync = syncData.canSync;
                _info.canWorker = syncData.canWorker;
            }
            this.props.manager.control.textEditorManager.updateForViewEdited(activeTextId, _info);
        }
    }
    get editorUI() {
        if (this.props.editors?.size) {
            const editors = [];
            this.props.editors.forEach((value, key) => {
                if (this.props.selectIds.includes(key)) {
                    const isActive = this.props.activeTextId == key;
                    if (!isActive) {
                        const editor = React.createElement(TextSelectorView, { key: key, data: value, workId: key, isSelect: true, position: this.props.position, selectIds: this.props.selectIds, updateOptInfo: this.updateOptInfo.bind(this), manager: this.props.manager });
                        editors.push(editor);
                    }
                }
            });
            return editors;
        }
        return null;
    }
    render() {
        return React.createElement("div", { ref: this.props.textRef }, this.editorUI);
    }
}
export class TextEditorContainer extends TextViewInSelector {
    constructor(props) {
        super(props);
    }
    handleKeyUp(e) {
        const texts = this.getInnerText(e.nativeEvent.target);
        const activeTextId = this.props.activeTextId;
        if (activeTextId) {
            this.updateOptInfo({
                activeTextId,
                update: {
                    text: texts.toString(),
                    boxSize: [e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight],
                    workState: EvevtWorkState.Doing
                },
                syncData: {
                    canSync: true,
                    canWorker: true,
                }
            });
        }
    }
    handleFocus(e) {
        const activeTextId = this.props.activeTextId;
        if (activeTextId) {
            this.updateOptInfo({
                activeTextId,
                update: {
                    boxSize: [e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight],
                    workState: EvevtWorkState.Doing
                },
                syncData: {
                    canSync: true,
                    canWorker: true,
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
                    // console.log('onServiceDerive---2', isActive, key, this.props.activeTextId)
                    const editor = isActive ? React.createElement(TextEditor, { key: key, data: value, workId: key, showFloatBtns: this.props.showFloatBtns || false, handleFocus: this.handleFocus.bind(this), handleKeyUp: this.handleKeyUp.bind(this), updateOptInfo: this.updateOptInfo.bind(this), manager: this.props.manager }) : React.createElement(TextView, { manager: this.props.manager, isActive: value.opt.workState === EvevtWorkState.Doing || value.opt.workState === EvevtWorkState.Start || false, key: key, data: value, workId: key });
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
