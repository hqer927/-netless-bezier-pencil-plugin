/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useState, useEffect, createContext} from 'react';
import { FloatTools } from './view/floatTools';
import { EToolsKey } from '@hqer/bezier-pencil-plugin/src/core';
import { ZoomController } from './view/zoomController';
import { EStrokeType, ShapeType } from '@hqer/bezier-pencil-plugin/src/plugin/types';
import { ApplianceNames } from 'white-web-sdk';
export const AppContext = createContext<{
  toolsKey:EToolsKey;
  setToolsKey:(key:EToolsKey)=>void;
} >({
  toolsKey: EToolsKey.Clicker,
  setToolsKey: () => {},
});

export default function App() { 
  const [toolsKey, setToolsKey] = useState<EToolsKey>(EToolsKey.Clicker);
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
            window.room.setMemberState({currentApplianceName: ApplianceNames.pencil, useLaserPen: true, strokeType: EStrokeType.Normal});
            break;
          case EToolsKey.Arrow:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.arrow});
            break;
          case EToolsKey.Straight:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.straight});
            break; 
          case EToolsKey.Ellipse:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.ellipse});
            break;
          case EToolsKey.Rectangle:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.rectangle});
            break;
          case EToolsKey.Star:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Pentagram});
            break;
          case EToolsKey.Triangle:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Triangle});
            break;
          case EToolsKey.Rhombus:
            // window.room.disableDeviceInputs = false;
            window.room.setMemberState({currentApplianceName: ApplianceNames.shape, shapeType:ShapeType.Rhombus});
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
      <AppContext.Provider value={{toolsKey, setToolsKey}}>
        <FloatTools/>
        <ZoomController/>
      </AppContext.Provider>
    </div>
  )
}