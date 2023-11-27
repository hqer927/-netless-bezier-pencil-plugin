import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApplianceNames } from "white-react-sdk";

import {createWhiteWebSdk} from './whiteboardSdk';
const elm = document.getElementById('whiteboard') as HTMLDivElement;
if (elm) {
    createWhiteWebSdk(elm).then(({room})=>{
        window.room = room;
        window.room.setMemberState({currentApplianceName: ApplianceNames.clicker});
        ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        )
    })
}
