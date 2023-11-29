import type { EventEmitter2 } from "eventemitter2"
import React from "react"

export const HightLightBox = React.memo((props:{
  internalMsgEmitter: EventEmitter2,
}) => {
  const { internalMsgEmitter } = props;
  return (
    <div className="bezier-pencil-plugin-hightlight-box">
      <div>HightLightBox</div>
    </div>
  )
},()=>true)