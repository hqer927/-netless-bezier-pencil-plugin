/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import '@hqer/bezier-pencil-plugin/dist/style.css';
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  useLoaderData
} from "react-router-dom";
import { createWhiteWebSdk } from './single';
import { createMultiWhiteWebSdk } from './multi';
import type { Player, Room } from 'white-web-sdk';
import App from './App';
import IndexPage from '.';
import { createReplayMultiWhiteWebSdk } from './replayMulti';
import { createReplaySingleWhiteWebSdk } from './replaySingle';
import { Replay } from './replay';

const elm = document.getElementById('whiteboard') as HTMLDivElement;
const appIdentifier = '123456789/987654321';

const Container = () => {
  const data = useLoaderData() as {room: Room };
  window.room = data.room;
  useEffect(()=>{
    return ()=>{
      window.appliancePlugin?.destroy()
    }
  })
  if (data.room) {
    return <App/>
  }
  return null
};

export const ReplayContainer = () => {
  const data = useLoaderData() as {player: Player };
  window.player = data.player;
  useEffect(()=>{
      return ()=>{
        window.appliancePlugin?.destroy()
      }
  })
  if (data.player) {
    return <Replay />
  }
  return null
};

if (elm) {
  const routerData = createHashRouter(createRoutesFromElements(
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
      <Route path="/replayMulti" loader={({request})=>{
          const url = new URL(request.url);
          const slice = url.searchParams.get("slice") || undefined;
          const uuid = url.searchParams.get("uuid");
          const roomToken = url.searchParams.get("roomToken") ;
          const beginAt = url.searchParams.get("beginAt") || undefined;
          const duration = url.searchParams.get("duration") || undefined;
          if (uuid && roomToken && appIdentifier && (slice || (duration && beginAt))) {
            return createReplayMultiWhiteWebSdk({elm,uuid,roomToken, appIdentifier, slice, duration, beginAt});
          }
          return {}
      }} element={<ReplayContainer />} />
      <Route path="/replaySingle" loader={({request})=>{
        const url = new URL(request.url);
        const slice = url.searchParams.get("slice") || undefined;
        const uuid = url.searchParams.get("uuid");
        const roomToken = url.searchParams.get("roomToken") ;
        const beginAt = url.searchParams.get("beginAt") || undefined;
        const duration = url.searchParams.get("duration") || undefined;
        if (uuid && roomToken && appIdentifier && (slice || (duration && beginAt))) {
          return createReplaySingleWhiteWebSdk({elm, uuid,roomToken, appIdentifier, slice, duration, beginAt});
        }
        return {}
    }} element={<ReplayContainer />} />
    </Route>
  ))
  ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={routerData} />
  </React.StrictMode>, document.getElementById('root') as HTMLElement
  )
}