/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo, useRef } from "react"
import { Del } from "./del"
import { Duplicate } from "./duplicate"
import { Layer } from "./layer"
import { FillColors, StrokeColors, TextColors } from "./colors"
import { DisplayerContext } from "../../plugin/displayerView";
import { TextOptions } from "../../component/textEditor"
import { FontStyleBtn } from "./fontStyle"
import { FontSizeBtn } from "./fontSize"
import { LockBtn } from "./lock"
import { ShapeOpt } from "./shapeOpt"

enum EOpenType {
  none,
  Layer,
  StrokeColor,
  FillColor,
  TextColor,
  TextBgColor,
  FontStyle,
  FontSize,
  ShapeOpt
}

export const FloatBtns = React.memo((props:{
    position?: {
      x: number;
      y: number;
    }
    textOpt?: TextOptions;
    workIds?: string[];
    noLayer?: boolean;
  }) => {
  const {textOpt, workIds, noLayer, position} = props;
  const {floatBarData, maranger} = useContext(DisplayerContext);
  const [openType, setOpenType] = React.useState<EOpenType>(EOpenType.none)
  const ref = useRef<HTMLDivElement>(null);
  const style = useMemo(()=>{
    const value:React.CSSProperties = {};
    const inputW = floatBarData?.w || textOpt?.boxSize?.[0] || 0;
    const inputH = floatBarData?.h || textOpt?.boxSize?.[1] || 0;
    if (position && inputW && inputH && maranger?.width && maranger?.height) {
      if (position.y < 60) {
        if (position.y + inputW < maranger.height - 60) {
          value.bottom = -120;
        } else if ( position.y + inputH < maranger.height) {
          value.bottom = -58;
        } else if ( position.y > 0) {
          value.top = 62
        } else {
          value.top = - position.y + 62;
        }
      }
      if (position.x < 0) {
        value.left = -position.x + 3;
      } else if (position.x + (ref.current?.offsetWidth || inputW) > maranger.width) {
        const right = inputW + position.x - maranger.width;
        value.left = 'initial';
        value.right = right
      }
      return value;
    }
    return undefined
  },[ref, position, floatBarData?.w,floatBarData?.h, maranger?.width, maranger?.height, textOpt?.boxSize])
  const useFillColors = useMemo(()=>{
    if(floatBarData?.fillColor) {
      return <FillColors floatBarRef={ref} open={openType === EOpenType.FillColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.FillColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } }/>
    }
    return null;
  }, [floatBarData?.fillColor, openType, ref])
  const useStrokeColors = useMemo(()=>{
    if(floatBarData?.strokeColor) {
      return <StrokeColors floatBarRef={ref} open={openType === EOpenType.StrokeColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.StrokeColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } }/>
    }
    return null;
  }, [floatBarData?.strokeColor, openType, ref])
  const useTextColors = useMemo(()=>{
    if(textOpt?.fontColor && maranger?.viewId) {
      return <TextColors floatBarRef={ref} open={openType === EOpenType.TextColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.TextColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } } textOpt={textOpt} workIds={workIds}/>
    }
    return null;
  }, [textOpt, openType, workIds, maranger, ref])
  // const useTextBgColors = useMemo(()=>{
  //   if(textOpt?.fontBgColor) {
  //     return <TextBgColors open={openType === EOpenType.TextBgColor} setOpen={(bol: boolean) => {
  //       if (bol === true) {
  //         setOpenType(EOpenType.TextBgColor)
  //       } else {
  //         setOpenType(EOpenType.none)
  //       }
  //     } } floatBarColors={floatBarColors} textOpt={textOpt} workIds={workIds}/>
  //   }
  //   return null;
  // }, [textOpt, openType, floatBarColors, workIds])
  const useFontStyle = useMemo(()=>{
    if(textOpt && maranger?.viewId) {
      return <FontStyleBtn open={openType === EOpenType.FontStyle} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.FontStyle)
        } else {
          setOpenType(EOpenType.none)
        }
      } } textOpt={textOpt} workIds={workIds} style={style}/>
    }
    return null;
  }, [textOpt, openType, workIds, maranger, style])

  const useFontSize = useMemo(()=>{
    if(textOpt && maranger?.viewId) {
      return <FontSizeBtn open={openType === EOpenType.FontSize} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.FontSize)
        } else {
          setOpenType(EOpenType.none)
        }
      } } textOpt={textOpt} workIds={workIds} floatBarRef={ref}/>
    }
    return null;
  }, [textOpt, openType, workIds, maranger, ref])

  const useLayer = useMemo(()=>{
    if(noLayer) {
      return null;
    }
    return <Layer open={openType === EOpenType.Layer} setOpen={(bol: boolean) => {
      if (bol === true) {
        setOpenType(EOpenType.Layer)
      } else {
        setOpenType(EOpenType.none)
      }
    } } floatBarRef={ref}/>;
  }, [noLayer, openType, ref])
  const useLock = useMemo(()=>{
    if(floatBarData?.canLock && maranger) {
      return <LockBtn workIds={workIds} maranger={maranger} islocked={floatBarData.isLocked}/>;
    }
    return null
  }, [floatBarData, maranger, workIds])
  const useShapeOpt = useMemo(()=>{
    if (maranger && maranger?.viewId && style && floatBarData?.shapeOpt && floatBarData?.toolsTypes) {
      return <ShapeOpt open={openType === EOpenType.ShapeOpt} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.ShapeOpt)
        } else {
          setOpenType(EOpenType.none)
        }
      }} floatBarRef={ref} workIds={workIds} toolsTypes={floatBarData.toolsTypes} shapeOpt={floatBarData.shapeOpt}/>;
    }
    return null;
  }, [floatBarData, maranger, openType, style, workIds, ref])
  return (
    <div
      className={'bezier-pencil-plugin-floatbtns'} style={ style }
      ref={ref}
    >
      {maranger && <Del workIds={workIds} maranger={maranger}/>}
      {useLayer}
      {useLock}
      {!!maranger?.viewId && <Duplicate workIds={workIds} viewId={maranger.viewId}/>}
      {useShapeOpt}
      {useFontSize}
      {useFontStyle}
      {useTextColors}
      {/* {useTextBgColors} */}
      {useStrokeColors}
      {useFillColors}
    </div>
  )
})