/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo } from "react"
import { Del } from "./del"
import { Duplicate } from "./duplicate"
import { Layer } from "./layer"
import { FillColors, StrokeColors, TextColors } from "./colors"
import { DisplayerContext } from "../../plugin"
import { TextOptions } from "../../component/textEditor"

enum EOpenType {
  none,
  Layer,
  StrokeColor,
  FillColor,
  TextColor,
  TextBgColor
}

export type SubButProps = {
  open: boolean;
  setOpen: (bol:boolean)=> void;
}

export type TextButProps = SubButProps & {
  textOpt?:TextOptions;
  floatBarColors:[number, number, number][];
  workIds?: string[];
}

export const FloatBtns = React.memo((props:{
    position?: {
      x: number;
      y: number;
    }
    textOpt?: TextOptions, 
    workIds?: string[], 
    noLayer?: boolean
  }) => {
  const {textOpt, workIds, noLayer, position} = props;
  const {floatBarData, floatBarColors} = useContext(DisplayerContext);
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
    if(textOpt?.fontColor) {
      return <TextColors open={openType === EOpenType.TextColor} setOpen={(bol: boolean) => {
        if (bol === true) {
          setOpenType(EOpenType.TextColor)
        } else {
          setOpenType(EOpenType.none)
        }
      } } floatBarColors={floatBarColors} textOpt={textOpt} workIds={workIds}/>
    }
    return null;
  }, [textOpt, openType, floatBarColors, workIds])
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
      <Del workIds={workIds}/>
      {useLayer}
      <Duplicate workIds={workIds}/>
      {useTextColors}
      {/* {useTextBgColors} */}
      {useStrokeColors}
      {useFillColors}
    </div>
  )
})