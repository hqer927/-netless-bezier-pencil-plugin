/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from '../../plugin/index.module.less';
import React, { FocusEventHandler, KeyboardEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { TextEditorInfo, TextOptions } from "./types";
import { ApplianceViewManagerLike, EmitEventType } from "../../plugin/types";
import { FloatBtns } from "../../displayer/floatBtns";
import { EvevtWorkState } from "../../core";
import {isBoolean, isEqual, isNumber, cloneDeep} from "lodash";
import { transformToNormalData, transformToSerializableData } from '../../collector/utils';

export const Max_Font_Size = 80;

export interface TextSelectorManagerProps {
    selectIds: string[];
    className?: string;
    editors?: Map<string,TextEditorInfo>;
    activeTextId?:string;
    box?: {
        x: number,
        y: number,
        w: number,
        h: number
    },
    manager:ApplianceViewManagerLike;
    showFloatBtns?: boolean;
    operationType?: EmitEventType;
}
export interface TextViewProps{
    workId: string;
    data: TextEditorInfo
    isSelect?: boolean;
    isActive?:boolean;
    manager:ApplianceViewManagerLike;
}
export interface TextSelectorViewProps extends TextViewProps {
    left: string;
    top: string;
    selectIds?:string[];
    updateOptInfo:(param:{
        activeTextId:string,
        update:Partial<TextOptions>,
        syncData?:Pick<TextEditorInfo, 'canSync' | 'canWorker'>
    })=>void;
}
export interface TextEditorProps extends TextViewProps {
    showFloatBtns: boolean;
    handleKeyUp: KeyboardEventHandler<HTMLDivElement>;
    handleFocus: FocusEventHandler<HTMLDivElement>;
    // handleKeyDown: KeyboardEventHandler<HTMLDivElement>;
    runAnimation:()=>void;
    updateOptInfo:(param:{
        activeTextId:string,
        update:Partial<TextOptions>,
        syncData?:Pick<TextEditorInfo, 'canSync' | 'canWorker'>
    })=>void;
}
export const TextView = (props:TextViewProps) =>{
    const {data, isActive, manager, workId} = props;
    const {opt, scale, translate, x, y} = data
    const transform = `scale(${scale || 1}) ${translate && 'translate('+translate[0]+'px,'+translate[1]+'px)' || '' }`;
    const {fontSize, fontFamily, underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight,
         bold, italic, uid, workState} = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style: React.CSSProperties = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
        paddingRight: `${italic === 'italic' ? Math.round(size * 0.3) : 5}px`
    }
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
    function handleClick(){
        if (isActive && (uid && uid === manager.control.collector?.uid || !uid)) {
            manager.control.textEditorManager.active(workId);
        }
    }
    const children = useMemo(()=>{
        const children = [];
        if (opt.text) {
            const texts = transformToNormalData(opt.text);
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];
                if (text === '') {
                    children.push(<div style={{ backgroundColor: opt.fontBgColor}} key={i}><br/></div>)
                } else {
                    children.push(<div style={{ backgroundColor: opt.fontBgColor}} key={i}>{text}</div>)
                }
            }
        }
        if (!children.length) {
            return null;
        } else {
            return children;
        }
    },[opt.fontBgColor, opt.text])
    return (
        <div className="editor-box"
            style={{
                left:`${x}px`,
                top:`${y}px`,
                transform,
                transformOrigin:`left top`,
                pointerEvents:'none',
                opacity: workState === EvevtWorkState.Done ? 0 : 1
            }}
        >
            <div
                className={`editor ${!isActive ? 'readOnly' :''}`}
                style={style}
                onClick={handleClick}
            >
                {children}
            </div>
        </div>
    )
}
export const TextSelectorView = React.memo((props:TextSelectorViewProps) =>{
    const {data, left, top, workId, updateOptInfo} = props;
    const {opt, scale, translate} = data;
    const ref = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
            const oldBoxSize = opt.boxSize;
            if (oldBoxSize?.[0] !== ref.current.offsetWidth || oldBoxSize[1] !== ref.current.offsetHeight || !oldBoxSize) {
                const boxSize:[number,number] = [ref.current.offsetWidth, ref.current.offsetHeight];
                updateOptInfo({
                    activeTextId: workId,
                    update: {
                        boxSize,
                        workState: EvevtWorkState.Done
                    },
                });
            }
        }
    },[opt.fontSize, opt.italic, opt.bold, opt.boxSize, workId]);
    const transform = `scale(${scale || 1}) ${translate && 'translate('+translate[0]+'px,'+translate[1]+'px)' || '' }`;
    const {fontSize, fontFamily,underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight,
        bold, italic} = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style: React.CSSProperties = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
        pointerEvents: 'none',
        paddingRight: `${italic === 'italic' ? Math.round(size * 0.3) : 5}px`
    }
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
    const children = useMemo(()=>{
        const children = [];
        if (opt.text) {
            const texts = transformToNormalData(opt.text);
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];
                if (text === '') {
                    children.push(<div key={i}><br/></div>)
                } else {
                    children.push(<div key={i}>{text}</div>)
                }
            }
        }
        if (!children.length) {
            return null;
        } else {
            return children;
        }
    },[opt.text])
    return (
        <div className="editor-box"
            style={{
                left:`${left}`,
                top:`${top}`,
                transform,
                transformOrigin:`left top`,
                zIndex: 1,
                pointerEvents:'none',
                opacity: 0
            }}
        >
            {/* <div className='editor readOnly'
                ref={ref}
                style={style}
                dangerouslySetInnerHTML={{__html:html}}
            /> */}
            <div className='editor readOnly'
                ref={ref}
                style={style}
            >
                {children}
            </div>
        </div>
    )
}
,(
    prevProps: Readonly<TextSelectorViewProps>,
    nextProps: Readonly<TextSelectorViewProps>,
)=>{
    if (prevProps.workId !== nextProps.workId || prevProps.left !== nextProps.left ||
        prevProps.top !== nextProps.top || !isEqual(prevProps.data, nextProps.data)
    ) {
        return false;
    }
    return true;
}
)
export const TextEditor = (props:TextEditorProps) =>{
    const {data, workId, isSelect, showFloatBtns, handleKeyUp, handleFocus, updateOptInfo, manager, runAnimation} = props;
    const [oldDisableDeviceInputs, setOldDisableDeviceInputs] = useState<boolean>();
    const {opt, scale, translate, x, y} = data;
    const {fontSize, fontFamily,underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight,
        bold, italic, boxSize} = opt;
    const ref = useRef<HTMLDivElement>(null);
    const style = useMemo(()=>{
        const size = fontSize;
        const _lineHeight = lineHeight || size * 1.2;
        const style: React.CSSProperties = {
            fontSize: `${size}px`,
            lineHeight: `${_lineHeight}px`,
            color: fontColor,
            borderColor: strokeColor,
            minHeight: `${_lineHeight}px`,
            paddingRight: `${italic === 'italic' ? Math.round(size * 0.3) : 5 }px`,
            borderWidth: `${Math.max(Math.round(1/(scale || 1)),1)}px`,
        }
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
        return style;
    },[bold, fontColor, fontFamily, fontSize, italic, lineHeight, lineThrough, scale, strokeColor, textAlign, underline]);
    const boxStyle = useMemo(()=>{
        const transform = `scale(${scale || 1}) ${translate && 'translate('+translate[0]+'px,'+translate[1]+'px)' || '' }`;
        const style: React.CSSProperties = {
            left:`${x}px`,
            top:`${y}px`,
            zIndex: 2,
            pointerEvents:'none',
            transform,
            transformOrigin:`left top`,
        }
        return style;
    },[scale, translate, x, y])
    const FloatBarBtnUI = useMemo(()=>{
        if (!isSelect && scale && showFloatBtns && isNumber(x) && isNumber(y) && opt.boxSize && isNumber(opt.boxSize?.[0]) && isNumber(opt.boxSize?.[1])) {
            return (
                <div className={styles['FloatBarBtn']}
                    style= {{
                        left: x,
                        top: y,
                        width: opt.boxSize[0] * scale,
                        height: opt.boxSize[1] * scale,
                    }}
                >
                    <FloatBtns position={{x:x,y:y}} textOpt={opt} workIds={[workId]} noLayer={true}/>
                </div> 
            )
        }
        return null;
    },[isSelect, opt, showFloatBtns, workId, x, y, scale])
    const html = useMemo(()=>{
        let html = '';
        if (opt.text) {
            const texts = transformToNormalData(opt.text);
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];
                if (text === '') {
                    html = html + `<div><br/></div>`;
                } else {
                    html = html + `<div style="background-color:${opt.fontBgColor}">${text}</div>`;
                }
            }
        } else {
            html =  `<div style="background-color:${opt.fontBgColor}"></div>`
        }
        return html;
    },[opt.fontBgColor, opt.text])
    const textEditorUI = useMemo(()=>{
        if (typeof html === 'string') {
            return (
                <div id={workId} 
                    suppressContentEditableWarning
                    contentEditable={true} 
                    className='editor'
                    ref={ref}
                    style={style}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onClick={handleClick}
                    onTouchEnd={handleClick}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                    onInput={handleInput}
                    dangerouslySetInnerHTML={{__html:html}}
                />
            )
        }
        return null;
    },[html, style, workId])

    useEffect(()=>{
        if(textEditorUI &&  ref.current){
            ref.current.click();
            setTimeout(()=>{
                if (ref.current) {
                    const selection = window?.getSelection();
                    const lastChildNode = ref.current.lastChild;
                    if(selection && lastChildNode){
                        const range = document.createRange();
                        const i = lastChildNode.textContent?.length || 0
                        if (lastChildNode?.nodeName === '#text') {
                            range.setStart(lastChildNode, i);
                        } else {
                            range.setStart(lastChildNode, i && 1 || 0);
                        }
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            },20)
        }
    },[textEditorUI, ref.current])

    useEffect(() => {
        if (textEditorUI && (ref.current?.offsetWidth || ref.current?.offsetHeight || ref.current?.offsetLeft || ref.current?.offsetTop)) {
            const _boxSize:[number,number] = [ref.current.offsetWidth, ref.current.offsetHeight]
            if((boxSize && boxSize[0] !== _boxSize[0] && boxSize[1] !== _boxSize[1]) || !boxSize){
                updateOptInfo({
                    activeTextId: workId,
                    update: {
                        boxSize: _boxSize,
                        workState: EvevtWorkState.Doing
                    }
                })
            }
        }
    }, [boxSize, textEditorUI, style, workId]);
    function handleClick(){
        if (ref.current) {
            ref.current.focus();
        }
        runAnimation(); 
    }
    function handleKeyDown(e:any){
        if (e.key === 'Backspace') {
            // 获取光标位置
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            // 检查是否有选区文本，如果有则正常删除
            if (range?.collapsed) {
                if (e.cancelable) {
                    e.preventDefault();
                }
                // 执行删除操作，这里可以根据具体需求调整删除逻辑
                document.execCommand('delete', false);
                return false;
            }
        }
        runAnimation();   
        return false;
    }
    function insertText(insertStr:string, current:HTMLDivElement) {
        const selection = window?.getSelection();
        if (!selection?.rangeCount) return;
        if (insertStr && selection && selection.anchorNode) {
            const anchorOffset = selection.anchorOffset;
            const curStr = selection.anchorNode.textContent || '';
            const before = curStr.slice(0, anchorOffset) || '';
            const endStr = curStr.slice(anchorOffset) || '';
            const str = before.concat(insertStr) || ''; 
            updateText(str, endStr, current);
        }
    }
    function updateText(str:string, endStr:string, current:HTMLDivElement){
        const selection = window?.getSelection();
        if (!selection?.rangeCount) return;
        if (!selection.anchorNode) return;
        const texts = str.split(/\n/);
        let anchorNode = selection.anchorNode.parentNode as (HTMLDivElement | Text);
        if (anchorNode === current) {
            anchorNode = selection.anchorNode as Text;
        }
        const childNodes = [...current.childNodes];
        const afterNodes:HTMLDivElement[] = [];
        let insertTextNode:Text|undefined;
        let anchorOffset = selection.anchorOffset;
        while (childNodes.length) {
            const lastChild = childNodes.pop();
            if (lastChild) {
                if (lastChild === anchorNode) {
                    let text: string = texts[0];
                    if (texts.length === 1) {
                        anchorOffset = texts[0].length;
                        text = texts[0].concat(endStr);
                    }
                    if (anchorNode.nodeName === '#text') {
                        anchorNode.textContent = text;
                        insertTextNode = anchorNode as Text;
                    } else if (anchorNode.nodeName === 'DIV') {
                        (anchorNode as HTMLDivElement).innerText = text;
                        insertTextNode = anchorNode.childNodes[0] as Text;
                    }
                    break;
                }
                afterNodes.push(lastChild as HTMLDivElement);
                current.removeChild(lastChild);
            }
        }
        if (texts.length > 1) {
            for (let i = 1; i < texts.length; i++) {
                let text = texts[i];
                const div = document.createElement('div');
                if (opt.fontBgColor) {
                    div.style.backgroundColor = opt.fontBgColor;
                }
                if (i === texts.length - 1) {
                    anchorOffset = text.length;
                    text = text.concat(endStr);
                }
                if (text === ''){
                    div.innerHTML = '<br/>';
                } else {
                    div.innerText = text;
                }
                current.appendChild(div);
                if (i === texts.length - 1) {
                    insertTextNode = div.childNodes[0] as Text;
                }
            }
        }
        if (afterNodes.length) {
            afterNodes.reverse();
            for (const node of afterNodes) {
                current.appendChild(node);
            }
        }
        if(insertTextNode && insertTextNode.nodeName === '#text') {
            selection.deleteFromDocument();
            const range = document.createRange();
            const i = Math.min(anchorOffset, (insertTextNode as Text)?.length || 0);
            range.setStart(insertTextNode, i);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    function handlePaste(e:any) {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (ref.current) {
            const paste = (e.clipboardData || (window as any).clipboardData).getData("text");
            const selection = window?.getSelection();
            if (!selection?.rangeCount) return;
            if (paste && selection && selection.anchorNode) {
                insertText(paste, ref.current)
            }
            runAnimation();    
        }
    }
    function handleInput(e:any) {
        handleKeyUp(e);
        runAnimation(); 
    }
    return (
        <>
            { FloatBarBtnUI }
            <div className="editor-box"
                style={boxStyle}
                onFocus={()=>{
                    if (manager.control.room && !manager.control.room.disableDeviceInputs) {
                        setOldDisableDeviceInputs(manager.control.room.disableDeviceInputs);
                        manager.control.room.disableDeviceInputs = true;
                    }
                }}
                onBlur={()=>{
                    if( manager?.control.room && isBoolean(oldDisableDeviceInputs)) {
                        manager.control.room.disableDeviceInputs = oldDisableDeviceInputs;
                    }
                }}
            >
                { textEditorUI }
            </div>
        </>
    )
}
export class TextViewInSelector extends React.Component<TextSelectorManagerProps, {hasEditor:boolean}> {
    constructor(props: TextSelectorManagerProps) {
        super(props);
    }
    getInnerText(target:HTMLDivElement){
        const texts:string[] =[];
        for (let i = 0; i < target.childNodes.length; i++) {
            const child = target.childNodes[i];
            if (child.nodeName === '#text' && i === 0 ) {
                const _t = (child.textContent as string).split(/\n/);
                const last = _t.pop();
                texts.push(..._t);
                if(last){
                    texts.push(last)
                }
            } else if(child.nodeName === 'DIV'){
                const _t = ((child as HTMLDivElement).innerText as string).split(/\n/);
                if(_t.length === 2 && _t[0] === '' && _t[1]==='') {
                    texts.push('')
                } else {
                    const s = _t.shift();
                    if (s) {
                        texts.push(s)
                    }
                    const last = _t.pop();
                    texts.push(..._t)
                    if(last){
                        texts.push(last)
                    }
                }
            }
        }
        return texts;
    }
    updateOptInfo(param:{
        activeTextId:string,
        update:Partial<TextOptions>,
        syncData?:Pick<TextEditorInfo, 'canSync' | 'canWorker'>
    }){
        const {activeTextId, update, syncData} = param;
        const _info = activeTextId && cloneDeep(this.props.manager.control.textEditorManager?.get(activeTextId) || this.props.editors?.get(activeTextId));
        if (_info && _info.opt) {
            _info.opt = {
                ..._info.opt,
                ...update
            };
            if (syncData) {
                _info.canSync = Object.keys(syncData).includes('canSync') && syncData.canSync || _info.canSync;
                _info.canWorker = Object.keys(syncData).includes('canWorker') && syncData.canWorker || _info.canWorker;
            }
            this.props.manager.control.textEditorManager.updateForViewEdited(activeTextId, _info);
        }
    }
    get editorUI(){
        if (this.props.editors?.size) {
            const editors:JSX.Element[] = [];
            this.props.editors.forEach((value,key)=>{
                if (this.props.selectIds.includes(key)) {
                    const isActive = this.props.activeTextId == key;
                    if (!isActive && this.props.box) {
                        const {x:boxX,y:boxY}=this.props.box;
                        const {x,y} = value;
                        const left = `${x - boxX}px`;
                        const top = `${y - boxY}px`;
                        const editor = <TextSelectorView left={left} top={top} key={key} data={value} workId={key} isSelect={true}
                            updateOptInfo={this.updateOptInfo.bind(this)} manager={this.props.manager}/>
                        editors.push(editor);
                    }
                }
            })
            return editors;
        }
        return null;
    }
    render() {
        return <>
            {this.editorUI}
        </>
    }
}
export class TextEditorContainer extends TextViewInSelector {
    ref: React.RefObject<HTMLDivElement> | undefined;
    isRunAnimation?: number;
    constructor(props: TextSelectorManagerProps) {
        super(props);
        this.ref = React.createRef();
        this.isRunAnimation = undefined;
    }
    runAnimation(){
        if (!this.isRunAnimation) {
            this.isRunAnimation = requestAnimationFrame(() => {
                if (this.ref?.current) {
                    this.ref?.current.scrollTo({
                        left:0,
                        behavior: 'instant'
                    });
                }
                this.isRunAnimation = undefined;
            })
        }
    }
    handleKeyUp(e:any) {
        const texts:string[] = this.getInnerText(e.nativeEvent.target);
        const activeTextId = this.props.activeTextId;
        if(activeTextId) {
            const oldInfo = this.props.manager.control.textEditorManager.get(activeTextId);
            const text = transformToSerializableData(texts);
            const workState = EvevtWorkState.Doing;
            const boxSize:[number,number] = [e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight];
            if (!oldInfo || ( oldInfo && (oldInfo.opt.text !== text || !isEqual(oldInfo.opt.boxSize, boxSize) || !isEqual(oldInfo.opt.workState, workState)))) {
                this.updateOptInfo({
                    activeTextId,
                    update: {
                        text,
                        boxSize,
                        workState
                    },
                    syncData:{
                        canSync: true,
                        canWorker: true,
                    }
                });
            }
        }
    }
    handleFocus(e:any) {
        const activeTextId = this.props.activeTextId;
        if(activeTextId) {
            const oldInfo = this.props.manager.control.textEditorManager.get(activeTextId);
            const workState = EvevtWorkState.Doing;
            const boxSize:[number,number] = [e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight];
            if (!oldInfo || ( oldInfo && (!isEqual(oldInfo.opt.boxSize, boxSize) || !isEqual(oldInfo.opt.workState, workState)))) {
                this.updateOptInfo({
                    activeTextId,
                    update: {
                        boxSize,
                        workState
                    },
                    syncData:{
                        canSync: true,
                        canWorker: true,
                    }
                });
            }
        }
    }
    get editorUI(){
        if (this.props.editors?.size) {
            const editors:JSX.Element[] = [];
            this.props.editors.forEach((value,key)=>{
                const notShow = this.props.selectIds.includes(key) && this.props.activeTextId !== key;
                if (!notShow) {
                    const isActive = this.props.activeTextId == key;
                    const editor = isActive ? <TextEditor key={key} data={value} workId={key}
                        showFloatBtns={this.props.showFloatBtns || false}
                        handleFocus={this.handleFocus.bind(this)}
                        handleKeyUp={this.handleKeyUp.bind(this)}
                        updateOptInfo={this.updateOptInfo.bind(this)}
                        manager={this.props.manager}
                        runAnimation={this.runAnimation.bind(this)}
                    /> : <TextView manager={this.props.manager} 
                        isActive={value.opt.workState === EvevtWorkState.Doing || value.opt.workState === EvevtWorkState.Start || false} 
                        key={key} data={value} workId={key}/>
                    editors.push(editor);
                }
            })
            return editors;
        }
        return null;
    }
    render(){
        return <div className={`${this.props.className}`} ref={this.ref}>
            {this.editorUI}
        </div>
    }
}