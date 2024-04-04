/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import '@hqer/bezier-pencil-plugin/dist/style.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  useLoaderData,
} from "react-router-dom";
import { createWhiteWebSdk } from './single';
import { createMultiWhiteWebSdk } from './multi';
import { Room } from 'white-react-sdk';
import App from './App';
import IndexPage from '.';

const elm = document.getElementById('whiteboard') as HTMLDivElement;
// const uuid = 'e31bbe00f18311ee89c7271b9ba43dd2';
// const roomToken = 'NETLESSROOM_YWs9VWtNUk92M1JIN2I2Z284dCZleHBpcmVBdD0xNzEyMjE4MDEyODY5Jm5vbmNlPTIxNzE0ZjUwLWYxOTEtMTFlZS1hYWQ3LTU1ZDZhMzc3NTJiYiZyb2xlPTEmc2lnPTRjNzJjODc0Yjk5MTQ4MmNmNjcxZThkNmNhZmFjNmQ2NzViYjhhM2E1YmQwOTVmMDMwYjEyZjZhMzYyNzA0ZmYmdXVpZD1lMzFiYmUwMGYxODMxMWVlODljNzI3MWI5YmE0M2RkMg';
const appIdentifier = '123456789/987654321';

const Container = () => {
  const data = useLoaderData() as {room: Room };
  window.room = data.room;
  console.log('first-single', data)
  if (data.room) {
    return <App/>
  }
  return null
};
if (elm) {
  const routerData = createBrowserRouter(createRoutesFromElements(
    <Route path="/" >
      <Route path="index" element={<IndexPage/>} />
      <Route path="single" loader={({request})=>{
          const url = new URL(request.url);
          const uuid = url.searchParams.get("uuid");
          const roomToken = url.searchParams.get("roomToken");
          if (uuid && roomToken) {
            return createWhiteWebSdk({elm,uuid,roomToken,appIdentifier});
          }
          return {}
      }} element={<Container/>}/>
      <Route path="multi" loader={({request})=>{
          const url = new URL(request.url);
          const uuid = url.searchParams.get("uuid");
          const roomToken = url.searchParams.get("roomToken");
          if (uuid && roomToken) {
            return createMultiWhiteWebSdk({elm,uuid,roomToken,appIdentifier});
          }
          return {}
      }} element={<Container/>} />
    </Route>
  ))
  ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={routerData} />
  </React.StrictMode>, document.getElementById('root') as HTMLElement
  )
}

// import React from 'react'
// import ReactDOM from 'react-dom'
// import App from './App.tsx'
// import './index.css'
// import '@hqer/bezier-pencil-plugin/dist/style.css';
// import { ApplianceNames } from "white-web-sdk";

// import {createMultiWhiteWebSdk} from './implement/multiwindow';
// import {createWhiteWebSdk} from './implement/whiteboardSdk';
// const elm = document.getElementById('whiteboard') as HTMLDivElement;
// if (elm) {
//   createWhiteWebSdk(elm).then(({room})=>{
//         window.room = room;
//         window.room.setMemberState({currentApplianceName: ApplianceNames.clicker});
//         ReactDOM.render(
//           <React.StrictMode>
//             <App />
//           </React.StrictMode>, document.getElementById('root') as HTMLElement
//         )
//     })
// }