/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react"
import { Del } from "./del"
import { Duplicate } from "./duplicate"
import { Layer } from "./layer"
import { Colors } from "./colors"
import { DisplayerContext } from "../../plugin"

export const FloatBtns = React.memo(() => {
  const {position} = useContext(DisplayerContext);
  return (
    <div
      className="bezier-pencil-plugin-floatbtns" style={ position && position.y < 80 ? {
        bottom: '-120px'
      } : undefined }
    >
      <Del/>
      <Layer/>
      <Duplicate/>
      <Colors/>
    </div>
  )
},()=>true)