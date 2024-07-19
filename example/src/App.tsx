/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useState, useEffect, createContext} from 'react';
import { FloatTools } from './view/floatTools';
import { ZoomController } from './view/zoomController';
import { isRoom } from 'white-web-sdk'
import { EStrokeType, MemberState, ShapeType, ApplianceNames, EToolsKey } from '@hqer/bezier-pencil-plugin';
import type { AppliancePluginInstance, Room, RoomState } from '@hqer/bezier-pencil-plugin';
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
  
  // document.addEventListener("visibilitychange", () => {if (document.visibilityState === "visible") {setTimeout(()=>{_wm.queryAll()[0].view.fireReloadLibrary()},1000)}
  // _wm.queryAll()[0].view.pressedHotKeys
  // });
  useEffect(()=>{
      if (window.room) {
        const _object: AppliancePluginInstance = window.room;
        // if ( window.manager ) {
        //   _object = window.manager.mainView;
        // }
        switch (toolsKey) {
          case EToolsKey.Text:
              _object.setMemberState({currentApplianceName: ApplianceNames.text});
              break;
          case EToolsKey.Pencil:
              _object.setMemberState({currentApplianceName: ApplianceNames.pencil, strokeType: EStrokeType.Stroke});
              break;
          case EToolsKey.Selector:
              _object.setMemberState({currentApplianceName: ApplianceNames.selector});
              break;
          case EToolsKey.Eraser:
              _object.setMemberState({currentApplianceName: ApplianceNames.eraser});
              break;
          case EToolsKey.Clicker:
              _object.setMemberState({currentApplianceName: ApplianceNames.clicker});
              break;``
          case EToolsKey.LaserPen:
              _object.setMemberState({currentApplianceName: ApplianceNames.laserPen, strokeType: EStrokeType.Normal});
              break;
          case EToolsKey.Arrow:
              _object.setMemberState({currentApplianceName: ApplianceNames.arrow, arrowCompleteToSelector: true});
              break;
          case EToolsKey.Straight:
              _object.setMemberState({currentApplianceName: ApplianceNames.straight, straightCompleteToSelector: false});
              break; 
          case EToolsKey.Ellipse:
              _object.setMemberState({currentApplianceName: ApplianceNames.ellipse, ellipseCompleteToSelector: false});
              break;
          case EToolsKey.Rectangle:
              _object.setMemberState({currentApplianceName: ApplianceNames.rectangle, rectangleCompleteToSelector: false});
              break;
          case EToolsKey.Star:
              _object.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Pentagram, shapeCompleteToSelector: false});
              break;
          case EToolsKey.Triangle:
              _object.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Triangle, shapeCompleteToSelector: false});
              break;
          case EToolsKey.Rhombus:
              _object.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Rhombus, shapeCompleteToSelector: false});
              break;
          case EToolsKey.SpeechBalloon:
              _object.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.SpeechBalloon, shapeCompleteToSelector: false});
              break;
          case EToolsKey.Hand:
              _object.setMemberState({currentApplianceName: ApplianceNames.hand});
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