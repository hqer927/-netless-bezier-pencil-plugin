/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useState, useEffect, createContext} from 'react';
import { FloatTools } from './view/floatTools';
import { EToolsKey } from './core/enum';
import { ZoomController } from './view/zoomController';
import { EStrokeType, ApplianceNames } from './plugin/types';
// import { PencilTools } from './view/pencilTools';
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
        case EToolsKey.Pencil:
            // window.room.disableDeviceInputs = true;
          window.room.setMemberState({currentApplianceName: ApplianceNames.pencil, useLaserPen: false, strokeType: EStrokeType.Stroke});
          break;
          case EToolsKey.Eraser:
            // window.room.disableDeviceInputs = true;
          window.room.setMemberState({currentApplianceName: ApplianceNames.eraser, isLine:true});
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
    <div className='App'>
      <AppContext.Provider value={{toolsKey, setToolsKey}}>
        <FloatTools/>
        <ZoomController/>
      </AppContext.Provider>
    </div>
  )
}