/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useState, useEffect, createContext} from 'react';
import { FloatTools } from './view/floatTools';
import { EToolsKey } from '@hqer/bezier-pencil-plugin/src/core';
import { ZoomController } from './view/zoomController';
import { EStrokeType, ShapeType, MemberState } from '@hqer/bezier-pencil-plugin/src/plugin/types';
import { ApplianceNames, Room, RoomState, isRoom } from 'white-web-sdk';
import { TopTools } from './view/topTools';
export const AppContext = createContext<{
  toolsKey:EToolsKey;
  setToolsKey:(key:EToolsKey)=>void;
  beginAt:number;
} >({
  toolsKey: EToolsKey.Clicker,
  setToolsKey: () => {},
  beginAt: 0
});

export default function App() { 
  const [toolsKey, setToolsKey] = useState<EToolsKey>(EToolsKey.Clicker);
  const [beginAt, setBeginAt] = useState<number>(0);
  function roomStateChangeListener(state: RoomState){
    if (isRoom(window.room) && !(window.room as Room).isWritable) {
        return;
    }
    if (state.memberState) {
      onMemberChange(state.memberState as MemberState);
    }
  }
  const onMemberChange =(memberState:MemberState)=>{
    const {currentApplianceName, useLaserPen}= memberState;
    switch (currentApplianceName) {
      case ApplianceNames.pencil:
        if (useLaserPen) {
          setToolsKey(EToolsKey.LaserPen);
        }else {
          setToolsKey(EToolsKey.Pencil);
        }
        break;
      case ApplianceNames.arrow:
        setToolsKey(EToolsKey.Arrow);
        break;
      case ApplianceNames.clicker:
        setToolsKey(EToolsKey.Clicker);
        break;
      case ApplianceNames.selector:
        setToolsKey(EToolsKey.Selector);
        break;
      case ApplianceNames.ellipse:
        setToolsKey(EToolsKey.Ellipse);
        break;
      case ApplianceNames.eraser:
        setToolsKey(EToolsKey.Eraser);
        break;
      case ApplianceNames.hand:
        setToolsKey(EToolsKey.Hand);
        break;
      case ApplianceNames.rectangle:
        setToolsKey(EToolsKey.Rectangle);
        break;
      case ApplianceNames.text:
        setToolsKey(EToolsKey.Text);
        break;
      case ApplianceNames.straight:
        setToolsKey(EToolsKey.Straight);
        break;
      default:
        break;
    }
  }
  useEffect(()=>{
    // console.log('setBeginAt', Date.now())
    setBeginAt(Date.now());
    window.room.callbacks.on('onRoomStateChanged', roomStateChangeListener);
    return ()=>{
      window.room.callbacks.off('onRoomStateChanged', roomStateChangeListener);
    }
  },[])
  useEffect(()=>{
      if (window.room) {
        switch (toolsKey) {
          case EToolsKey.Text:
              window.room.setMemberState({currentApplianceName: ApplianceNames.text});
              break;
          case EToolsKey.Pencil:
              // window.room.disableDeviceInputs = true;
              window.room.setMemberState({currentApplianceName: ApplianceNames.pencil, useNewPencil: true, useLaserPen: false, strokeType: EStrokeType.Stroke});
              break;
          case EToolsKey.Selector:
            // window.room.disableDeviceInputs = true;
            window.room.setMemberState({currentApplianceName: ApplianceNames.selector});
            break;
          case EToolsKey.Eraser:
            // window.room.disableDeviceInputs = true;
            window.room.setMemberState({currentApplianceName: ApplianceNames.eraser});
            break;
          case EToolsKey.Clicker:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.clicker});
            break;
          case EToolsKey.LaserPen:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.pencil, useLaserPen: true, useNewPencil: false, strokeType: EStrokeType.Normal});
            break;
          case EToolsKey.Arrow:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.arrow, arrowCompleteToSelector: true});
            break;
          case EToolsKey.Straight:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.straight, straightCompleteToSelector: true});
            break; 
          case EToolsKey.Ellipse:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.ellipse, ellipseCompleteToSelector: true});
            break;
          case EToolsKey.Rectangle:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.rectangle, rectangleCompleteToSelector: true});
            break;
          case EToolsKey.Star:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Pentagram, shapeCompleteToSelector: true});
            break;
          case EToolsKey.Triangle:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Triangle, shapeCompleteToSelector: true});
            break;
          case EToolsKey.Rhombus:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Rhombus, shapeCompleteToSelector: true});
            break;
          case EToolsKey.SpeechBalloon:
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.SpeechBalloon, shapeCompleteToSelector: true});
            break;
          case EToolsKey.Hand:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.hand});
            break;    
          default:
            break;
        }
      }
  },[toolsKey])
  return (
    <div className='App' onMouseDown={(e)=>{
      e.stopPropagation();
    }}>
      <AppContext.Provider value={{toolsKey, setToolsKey, beginAt}}>
        <FloatTools/>
        <ZoomController/>
        <TopTools/>
      </AppContext.Provider>
    </div>
  )
}