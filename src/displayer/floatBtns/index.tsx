/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo } from "react"
import { Del } from "./del"
import { Duplicate } from "./duplicate"
import { Layer } from "./layer"
import { FillColors, StrokeColors, TextColors } from "./colors"
import { DisplayerContext } from "../../plugin/displayerView";
import { TextOptions } from "../../component/textEditor"
import { FontStyleBtn } from "./fontStyle"
import { FontSizeBtn } from "./fontSize"

enum EOpenType {
  none,
  Layer,
  StrokeColor,
  FillColor,
  TextColor,
  TextBgColor,
  FontStyle,
  FontSize
}

export const FloatBtns = React.memo((props:{
    position?: {
      x: number;
      y: number;
    }
    textOpt?: TextOptions, 
    workIds?: string[], 
    noLayer?: boolean,
  }) => {
  const {textOpt, workIds, noLayer, position} = props;
  const {floatBarData, maranger} = useContext(DisplayerContext);
  const [openType, setOpenType] = React.useState<EOpenType>(EOpenType.none)
  const useFillColors = useMemo(()=>{
    if(floatBarData?.fillColor) {
      return <FillColors open={openType === EOpenType.FillColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.FillColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } }/>
    }
    return null;
  }, [floatBarData?.fillColor, openType])
  const useStrokeColors = useMemo(()=>{
    if(floatBarData?.strokeColor) {
      return <StrokeColors open={openType === EOpenType.StrokeColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.StrokeColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } }/>
    }
    return null;
  }, [floatBarData?.strokeColor, openType])
  const useTextColors = useMemo(()=>{
    if(textOpt?.fontColor && maranger?.viewId) {
      return <TextColors open={openType === EOpenType.TextColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.TextColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } } textOpt={textOpt} workIds={workIds}/>
    }
    return null;
  }, [textOpt, openType, workIds, maranger])
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
      } } textOpt={textOpt} workIds={workIds}/>
    }
    return null;
  }, [textOpt, openType, workIds, maranger])

  const useFontSize = useMemo(()=>{
    if(textOpt && maranger?.viewId) {
      return <FontSizeBtn open={openType === EOpenType.FontSize} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.FontSize)
        } else {
          setOpenType(EOpenType.none)
        }
      } } textOpt={textOpt} workIds={workIds}/>
    }
    return null;
  }, [textOpt, openType, workIds, maranger])

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
    } }/>;
  }, [noLayer, openType])
  return (
    <div
      className="bezier-pencil-plugin-floatbtns" style={ position && position.y < 80 ? {
        bottom: '-120px'
      } : undefined }
    >
      {maranger && <Del workIds={workIds} maranger={maranger}/>}
      {useLayer}
      {!!maranger?.viewId && <Duplicate workIds={workIds} viewId={maranger.viewId}/>}
      {useFontSize}
      {useFontStyle}
      {useTextColors}
      {/* {useTextBgColors} */}
      {useStrokeColors}
      {useFillColors}
    </div>
  )
})