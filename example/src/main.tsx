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
  useLoaderData
} from "react-router-dom";
import { createWhiteWebSdk } from './single';
import { createMultiWhiteWebSdk } from './multi';
import { Room } from 'white-react-sdk';
import App from './App';
import IndexPage from '.';

const elm = document.getElementById('whiteboard') as HTMLDivElement;
const appIdentifier = '123456789/987654321';

const Container = () => {
  const data = useLoaderData() as {room: Room };
  window.room = data.room;
  if (data.room) {
    return <App/>
  }
  return null
};
if (elm) {
  const routerData = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path="/" element={<IndexPage/>} />
      <Route path="/single" loader={({request})=>{
          const url = new URL(request.url);
          const uuid = url.searchParams.get("uuid");
          const roomToken = url.searchParams.get("roomToken");
          if (uuid && roomToken) {
            return createWhiteWebSdk({elm,uuid,roomToken,appIdentifier});
          }
          return {}
      }} element={<Container/>}/>
      <Route path="/multi" loader={({request})=>{
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