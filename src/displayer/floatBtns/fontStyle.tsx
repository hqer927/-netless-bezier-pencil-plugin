import React, { useContext, useEffect, useMemo, useState } from "react";
import { DisplayerContext } from "../../plugin/displayerView";
import { IconURL } from "../icons";
import { TextButProps } from "../types";
import { FontStyleType, FontWeightType } from "../../component/textEditor/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { Storage_Selector_key } from "../../collector/const";
import isBoolean from "lodash/isBoolean";

export type FontStyleProps = TextButProps

const BoldBtn = (props: {
    viewId?:string;
    workIds: string[];
    bold: FontWeightType;
    setBold:(bold:FontWeightType)=>void;
}) => {
    const { bold, setBold, workIds, viewId } = props;
    const onClickHandler = (e:React.MouseEvent|React.TouchEvent) =>{
        const _bold = bold === 'bold' ? 'normal' : 'bold'
        e?.preventDefault();
        e?.stopPropagation();
        setBold(_bold);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetFontStyle, {workIds, viewId, bold:_bold})
    }
    return (
        <div className={'font-style-button'} 
            onClick={onClickHandler} onTouchEnd={onClickHandler}>
            <img alt="icon" src={IconURL( bold === 'bold'? 'bold-active' : 'bold')}/>
        </div>
    )
}
const UnderlineBtn = (props: {
    viewId?:string;
    workIds: string[];
    underline: boolean;
    setUnderline:(underline:boolean)=>void;
}) => {
    const { underline, setUnderline, workIds, viewId } = props;
    const onClickHandler = (e:React.MouseEvent|React.TouchEvent) =>{
        const _underline = !underline;
        e?.preventDefault();
        e?.stopPropagation();
        setUnderline(_underline);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetFontStyle, {workIds, viewId, underline: _underline})
    }
    return (
        <div className={'font-style-button'} 
            onClick={onClickHandler} onTouchEnd={onClickHandler}>
            <img alt="icon" src={IconURL( underline ? 'underline-active' : 'underline')}/>
        </div>
    )
}
const LineThrough = (props: {
    viewId?:string;
    workIds: string[];
    lineThrough: boolean;
    setLineThrough:(lineThrough:boolean)=>void;
}) => {
    const { lineThrough, setLineThrough, workIds, viewId } = props;
    const onClickHandler = (e:React.MouseEvent|React.TouchEvent) =>{
        const _lineThrough = !lineThrough;
        e?.preventDefault();
        e?.stopPropagation();
        setLineThrough(_lineThrough);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetFontStyle, {workIds, viewId, lineThrough: _lineThrough})
    }
    return (
        <div className={'font-style-button'} 
            onClick={onClickHandler} onTouchEnd={onClickHandler}>
            <img alt="icon" src={IconURL( lineThrough ? 'line-through-active' : 'line-through')}/>
        </div>
    )
}
const ItalicBtn = (props: {
    viewId?:string;
    workIds: string[];
    italic: FontStyleType;
    setItalic:(italic:FontStyleType)=>void;
}) => {
    const { italic, setItalic, workIds, viewId } = props;
    const onClickHandler = (e:React.MouseEvent|React.TouchEvent) =>{
        const _italic = italic === 'italic' ? 'normal' : 'italic'
        e?.preventDefault();
        e?.stopPropagation();
        setItalic(_italic);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, 
            EmitEventType.SetFontStyle, {workIds, viewId, italic: _italic})
    }
    return (
        <div className={'font-style-button'} 
            onClick={onClickHandler} onTouchEnd={onClickHandler}>
            <img alt="icon" src={IconURL( italic === 'italic' ? 'italic-active' : 'italic')}/>
        </div>
    )
}
export const FontStyleBtn = (props:FontStyleProps) => {
    const {open: showSubBtn, setOpen: setShowSubBtn, textOpt, workIds} = props;
    const { position, maranger } = useContext(DisplayerContext);
    const [bold,setBold] = useState<FontWeightType>('normal');
    const [italic,setItalic] = useState<FontStyleType>('normal');
    const [underline,setUnderline] = useState<boolean>(false);
    const [lineThrough,setLineThrough] = useState<boolean>(false);
    useEffect(()=>{
        if (textOpt?.bold) {
            setBold(textOpt.bold);
        }
        if (isBoolean(textOpt?.underline)) {
            setUnderline(textOpt.underline);
        }
        if (isBoolean(textOpt?.lineThrough)) {
            setLineThrough(textOpt.lineThrough);
        }
        if (textOpt?.italic) {
            setItalic(textOpt.italic);
        }
    }, [textOpt])
    const SubBtns = useMemo(() => {
        if (showSubBtn) {
            return (
                <div className="font-style-menu"  style={ position && position.y < 80 ? {
                    top: 'inherit', bottom: '50px'
                  } : undefined }
                    onTouchEnd={(e)=>{
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                >
                    <BoldBtn workIds={workIds || [Storage_Selector_key]} bold={bold} setBold={setBold} viewId={maranger?.viewId} /> 
                    <UnderlineBtn workIds={workIds || [Storage_Selector_key]} underline={underline} setUnderline={setUnderline} viewId={maranger?.viewId} /> 
                    <LineThrough workIds={workIds || [Storage_Selector_key]} lineThrough={lineThrough} setLineThrough={setLineThrough} viewId={maranger?.viewId} />  
                    <ItalicBtn workIds={workIds || [Storage_Selector_key]} italic={italic} setItalic={setItalic} viewId={maranger?.viewId} /> 
                </div>
            )
        }
        return null
    }, [showSubBtn, position, workIds, bold, maranger?.viewId, underline, lineThrough, italic])
    return (
        <div className={`button normal-button ${showSubBtn && 'active'}`}
            onTouchEnd={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
            onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
                showSubBtn ? setShowSubBtn(false) : setShowSubBtn(true);
            }}
        >
            <img alt="icon" src={IconURL('bold')}/>
            {SubBtns}
        </div>
    )
}