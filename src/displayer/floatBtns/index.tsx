import type { EventEmitter2 } from "eventemitter2"
import React from "react"

export const FloatBtns = React.memo((props:{
  internalMsgEmitter: EventEmitter2,
}) => {
  const { internalMsgEmitter } = props;
  return (
    <div className="bezier-pencil-plugin-floatbtns">
      <div>FloatBtns</div>
    </div>
  )
},()=>true)