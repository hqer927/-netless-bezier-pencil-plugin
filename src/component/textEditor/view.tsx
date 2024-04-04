/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FocusEventHandler, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { TextEditorInfo, TextOptions } from "./types";
import { TeachingAidsViewManagerLike } from "../../plugin/types";
import cloneDeep from "lodash/cloneDeep";
import { FloatBtns } from "../../displayer/floatBtns";
import { EvevtWorkState } from "../../core";
import isNumber from "lodash/isNumber";

export interface TextEditorManagerProps {
    selectIds: string[];
    className?: string;
    editors?: Map<string,TextEditorInfo>;
    activeTextId?:string;
    position?: {
        x: number,
        y: number,
    },
    textRef?:React.RefObject<HTMLDivElement>,
    manager:TeachingAidsViewManagerLike
}
export interface TextViewProps{
    workId: string;
    data: TextEditorInfo
    isSelect?: boolean;
}
export interface TextSelectorViewProps extends TextViewProps {
    position?: {
        x: number,
        y: number,
    }
    selectIds?:string[];
}
export interface TextEditorProps extends TextViewProps {
    handleKeyUp: KeyboardEventHandler<HTMLDivElement>;
    handleFocus: FocusEventHandler<HTMLDivElement>;
}
export const TextView = (props:TextViewProps) =>{
    const {data} = props;
    const {opt, scale, translate, x, y} = data
    const transform = `scale(${scale || 1}) ${translate && 'translate('+translate[0]+'px,'+translate[1]+'px)' || '' }`;
    const {fontSize, fontFamily,underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight, workState} = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style: React.CSSProperties = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
    }
    if (fontFamily) {
       style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through'}${underline && ' underline'}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    let html:string = '';
    if (opt?.text) {
        const texts = opt.text.split(',');
        html = texts.reduce((total,cur,i)=>{
            const c = cur === '' ? '<br/>' : cur;
            if (i === 0) {
                return c;
            }
            return `${total}<div>${c}</div>`
        },'')
    }
    return (
        <div className="editor-box"
            style={{
                left:`${x}px`,
                top:`${y}px`,
                transform,
                transformOrigin:`left top`,
                pointerEvents:'none'
            }}
        >
            <div className={`editor ${workState === EvevtWorkState.Done ? 'readOnly' : ''}`}
                style={style}
                dangerouslySetInnerHTML={{__html:html}}
            />
        </div>
    )
}
export const TextSelectorView = React.memo((props:TextSelectorViewProps) =>{
    const {data, position, workId, selectIds} = props;
    const [point, setPoint] = useState<[number,number]>([0,0]);
    const {opt, scale, translate, x, y } = data
    useEffect(()=>{
        if(isNumber(x) && isNumber(y)) {
            setPoint([x - (position?.x || 0), y - (position?.y || 0)]);
        }
    },[workId, selectIds]);
    const transform = `scale(${scale || 1}) ${translate && 'translate('+translate[0]+'px,'+translate[1]+'px)' || '' }`;
    const {fontSize, fontFamily,underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight} = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style: React.CSSProperties = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`
    }
    if (fontFamily) {
       style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through'}${underline && ' underline'}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    let html:string = '';
    if (opt?.text) {
        const texts = opt.text.split(',');
        html = texts.reduce((total,cur,i)=>{
            const c = cur === '' ? '<br/>' : cur;
            if (i === 0) {
                return c;
            }
            return `${total}<div>${c}</div>`
        },'')
    }
    return (
        <div className="editor-box"
            style={{
                left:`${point[0]}px`,
                top:`${point[1]}px`,
                transform,
                transformOrigin:`left top`,
            }}
        >
            <div className='editor readOnly'
                style={style}
                dangerouslySetInnerHTML={{__html:html}}
            />
        </div>
    )
})
export const TextEditor = (props:TextEditorProps) =>{
    const {data, workId, isSelect, handleKeyUp, handleFocus} = props;
    const {opt, scale, translate, x,y} = data;
    const [html,setHtml] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        let html:string = '';
        if (opt?.text) {
            const texts = opt.text.split(',');
            html = texts.reduce((total,cur,i)=>{
                const c = cur === '' ? '<br/>' : cur;
                if (i === 0) {
                    return c;
                }
                return `${total}<div>${c}</div>`
            },'')
        }
        // console.log('useEffect', html)
        setHtml(html);
        Promise.resolve().then(()=>{
            // console.log('componentDidUpdate1')
            if (ref.current) {
                ref.current.click();
            }
        })
    },[])
    const transform = `scale(${scale || 1}) ${translate && 'translate('+translate[0]+'px,'+translate[1]+'px)' || '' }`;
    const {fontSize, fontFamily,underline, fontColor, lineThrough, textAlign, strokeColor, lineHeight} = opt;
    const size = fontSize;
    const _lineHeight = lineHeight || size * 1.2;
    const style: React.CSSProperties = {
        fontSize: `${size}px`,
        lineHeight: `${_lineHeight}px`,
        color: fontColor,
        borderColor: strokeColor,
        minHeight: `${_lineHeight}px`,
    }
    if (fontFamily) {
       style.fontFamily = `${fontFamily}`;
    }
    if (lineThrough || underline) {
        style.textDecoration = `${lineThrough && 'line-through'}${underline && ' underline'}`;
    }
    if (textAlign) {
        style.textAlign = `${textAlign}`;
    }
    function handleClick(){
        if (ref.current) {
            ref.current.focus();
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
    }
    function handleKeyDown(e:any){
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
    return (
        <div className="editor-box"
            style={{
                left:`${x}px`,
                top:`${y}px`,
                transform,
                transformOrigin:`left top`,
                zIndex:2,
                pointerEvents:'auto'
            }}
            onKeyDown={(e)=>{
                e.stopPropagation();
                return true;
            }}
            onMouseMove={(e)=>{
                e.stopPropagation();
                e.preventDefault();
                return true;
            }}
        >
            {
                !isSelect && <FloatBtns textOpt={opt} workIds={[workId]} noLayer={true} position={{ x, y }} />
            }
            <div contentEditable={true} className='editor'
                ref={ref}
                style={style}
                dangerouslySetInnerHTML={{__html:html}}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onClick={handleClick}
                onFocus={handleFocus}
            />
        </div>
    )
}
export class TextViewInSelector extends React.Component<TextEditorManagerProps> {
    constructor(props: TextEditorManagerProps) {
        super(props);
    }
    getInnerText(target:HTMLDivElement){
        const texts:string[] =[];
        for (const child of target.childNodes) {
            if (child.nodeName === '#text') {
                const _t = (child.textContent as string).replace(/\n/,'');
                texts.push(_t);
            } else {
                const _t = ((child as HTMLDivElement).innerText as string).replace(/\n/,'');
                texts.push(_t)
            }
        }
        return texts;
    }
    updateOptInfo(param:{
        activeTextId:string,
        update:Partial<TextOptions>
    }){
        const {activeTextId, update} = param;
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
    get editorUI(){
        if (this.props.editors?.size) {
            const editors:JSX.Element[] = [];
            this.props.editors.forEach((value,key)=>{
                if (this.props.selectIds.includes(key)) {
                    const isActive = this.props.activeTextId == key;
                    if (!isActive) {
                        const editor = <TextSelectorView key={key} data={value} workId={key} isSelect={true}
                            position={this.props.position} selectIds={this.props.selectIds}
                        />
                        editors.push(editor);
                    }
                }
            })
            return editors;
        }
        return null;
    }
    render() {
        return <div ref={this.props.textRef} onClick={(e)=>{
            e.stopPropagation();
            e.preventDefault();
            const point = this.props.manager.getPoint(e);
            point && this.props.manager.control.textEditorManager.computeTextActive(point, this.props.manager.viewId)
        }}>
            {this.editorUI}
        </div>
    }
}
export class TextEditorContainer extends TextViewInSelector {
    constructor(props: TextEditorManagerProps) {
        super(props);
    }
    handleKeyUp(e:any){
        const texts:string[] = this.getInnerText(e.nativeEvent.target);
        // console.log('handleKeyUp', texts)
        const activeTextId = this.props.activeTextId;
        if(activeTextId) {
            this.updateOptInfo({
                activeTextId,
                update: {
                    text: texts.toString(),
                    boxSize:[e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight],
                    workState: EvevtWorkState.Doing
                }
            });
        }
        
    }
    handleFocus(e:any) {
        const activeTextId = this.props.activeTextId;
        if(activeTextId) {
            // console.log('handleFocus', activeTextId)
            this.updateOptInfo({
                activeTextId,
                update: {
                    boxSize:[e.nativeEvent.target.offsetWidth, e.nativeEvent.target.offsetHeight],
                    workState: EvevtWorkState.Doing
                }
            });
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
                        handleFocus={this.handleFocus.bind(this)}
                        handleKeyUp={this.handleKeyUp.bind(this)}
                    /> : <TextView key={key} data={value} workId={key}/>
                    editors.push(editor);
                }
            })
            return editors;
        }
        return null;
    }
    render(){
        return <div className={`${this.props.className}`}>
            {this.editorUI}
        </div>
    }
}