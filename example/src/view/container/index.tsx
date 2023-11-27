// import { useEffect, useRef, useState } from "react";
// import {
//     Player,
//     PluginProps,
//     Room,
//     ApplianceNames,
//     autorun,
//     toJS
// } from "white-web-sdk";
// // import type { PluginInstance } from "white-web-sdk";
// import { BezierPencilPluginAttributes, PluginContext } from "../../plugin/types";
// export type BezierPencilPluginProps = PluginProps<PluginContext, BezierPencilPluginAttributes>;
// import styles from './index.module.less';
// import throttle from "lodash/throttle";
// import React from "react";
// import { ICanvasSceneType } from "../../core/types";
// import { BaseCollector, Collector } from "../../collector";
// import { SingleWorkerMainEngine } from "../../core";
// import { EToolsKey } from "../../core/enum";
// import { BaseShapeOptions, EraserOptions, PencilOptions } from "../../core/tools";

// export type BezierPencilContainerProps = BezierPencilPluginProps & {
//     room?: Room;
//     player?: Player;
// };
// export type BezierPencilContainerState = {
//     canvasStyle?: React.CSSProperties | undefined;
// };
// export const BezierPencilContainer = React.memo((props:BezierPencilContainerProps) => {
//     const {room, plugin} = props;
//     const [collector, setCollector] = useState<BaseCollector>();
//     const [worker, setWorker] = useState<SingleWorkerMainEngine>();
//     const [canvasSceneOpt,setOpt] = useState<ICanvasSceneType>();
//     const [style, setStyle] = useState<{
//         width:number,
//         height:number
//     }>();
//     const ref = useRef<HTMLCanvasElement>(null);
//     const refDiv = useRef<HTMLDivElement>(null);
//     const resizeChange = () => {
//         const width = (refDiv.current?.offsetWidth || 0) * 1;
//         const height = (refDiv.current?.offsetHeight || 0) * 1;
//         if(width && height){
//             setStyle({width,height})
//         }
//     }
//     useEffect(()=>{
//         if (style && ref.current) {
//             const {width, height} = style;
//             const ctx = ref.current?.getContext('2d');
//             if (ctx) {
//                 setOpt({
//                     canvas: ref.current,
//                     width: width,
//                     height: height
//                 })
//             }
//         }
//     },[style])
//     useEffect(()=>{
//         const _throttled = throttle(resizeChange,500,{'leading':false})
//         resizeChange();
//         window.addEventListener('resize', _throttled);
//         return ()=>{
//             window.removeEventListener('resize', resizeChange);
//         }
//     },[])
//     useEffect(()=>{
//         const uid = room?.uid;
//         const namespace = room?.state.sceneState.sceneName;
//         if (uid && namespace) {
//             const c = new Collector(plugin,uid,namespace);
//             setCollector(c);
//         }
//     },[plugin,room]);
//     useEffect(()=>{
//         if (canvasSceneOpt && collector) {
//             const w = new SingleWorkerMainEngine(canvasSceneOpt, collector);
//             collector.addStorageStateListener((key,diffOne)=>{
//                 console.log('STATE',key,diffOne)
//                 if (key === 'screen' && diffOne.newValue) {
//                     const {w,h} = diffOne.newValue;
//                     if (w && h) {
//                         if (ref.current) {
//                             ref.current.width = w
//                             ref.current.height = w
//                         }
//                         setOpt({width: w,height: h, canvas: canvasSceneOpt.canvas});
//                         // todo 等比例缩放
//                         // w.updateCanvas(w,h,false,false);
//                     } 
//                 } else {
//                     w?.onServiceDerive(key, diffOne);
//                 }
//             })
//             w.initSyncData((key,value)=>{
//                 if (key === 'screen' && value) {
//                     const {w,h} = value;
//                     if (w && h) {
//                         if (ref.current) {
//                             ref.current.width = w
//                             ref.current.height = w
//                         }
//                         setOpt({width: w,height: h, canvas: canvasSceneOpt.canvas});
//                     } 
//                 }
//             })
//             setWorker(w);
//         }
//     },[canvasSceneOpt, collector]);
//     useEffect(()=>{
//         const mousedown = (e:MouseEvent) =>{
//             if (e.button === 0 && !worker?.isFreezed()) {
//                 worker?.onStart([e.offsetX, e.offsetY])
//             }
//         }
//         const mousemove = (e:MouseEvent) =>{
//             if (!worker?.isFreezed()) {
//                 worker?.onDoing([e.offsetX, e.offsetY])
//             }
//         }
//         const mouseup = (e:MouseEvent) =>{
//             if (e.button === 0 && !worker?.isFreezed()) {
//                 worker?.onEnd([e.offsetX, e.offsetY])
//             }
//         }
//         const touchstart = (e:TouchEvent) =>{
//             if (!worker?.isFreezed()) {
//                 worker?.onStart([e.targetTouches[0].pageX, e.targetTouches[0].pageY])
//             }
//         }
//         const touchmove = (e:TouchEvent) =>{
//             if (!worker?.isFreezed()) {
//                 worker?.onDoing([e.targetTouches[0].pageX, e.targetTouches[0].pageY])
//             }
//         }
//         const touchend = (e:TouchEvent) =>{
//             if (!worker?.isFreezed()) {
//                 worker?.onEnd([e.changedTouches[0].pageX, e.changedTouches[0].pageY])
//             }
//         }
//         if (worker) {
//             ref.current?.addEventListener('mousedown',mousedown, true);
//             ref.current?.addEventListener('mousemove',mousemove, true);
//             ref.current?.addEventListener('mouseup',mouseup, true);
//             ref.current?.addEventListener('mouseleave',mouseup, true);
//             ref.current?.addEventListener('touchstart',touchstart, true);
//             ref.current?.addEventListener('touchmove',touchmove, true);
//             ref.current?.addEventListener('touchend',touchend, true);
//         }
//         return ()=>{
//             ref.current?.removeEventListener('mousedown',mousedown);
//             ref.current?.removeEventListener('mousemove',mousemove);
//             ref.current?.removeEventListener('mouseup',mouseup);
//             ref.current?.removeEventListener('mouseleave',mouseup);
//             ref.current?.removeEventListener('touchstart',touchstart);
//             ref.current?.removeEventListener('touchmove',touchmove);
//             ref.current?.removeEventListener('touchend',touchend);
//         }
//     },[worker]);
//     useEffect(()=>{
//         let disposer: () => void;
//         if (room && worker) {
//             // const m = new StateMonitor();
//             // m.createMonitor('memberState',room.state.memberState,(_old,_new)=>{
//             //     if (_new.currentApplianceName === ApplianceNames.eraser || _new.currentApplianceName === ApplianceNames.pencil) {
//             //         room.disableDeviceInputs = true;
//             //         const toolsKey = _new.currentApplianceName === ApplianceNames.eraser ? EToolsKey.Eraser: EToolsKey.Pencil;
//             //         const opt:BaseShapeOptions = {
//             //             color:'red'
//             //         };
//             //         if (toolsKey === EToolsKey.Pencil) {
//             //             (opt as PencilOptions).thickness = 10;
//             //             (opt as PencilOptions).isStroke = true;
//             //         }else if(toolsKey === EToolsKey.Eraser) {
//             //             (opt as EraserOptions).thickness = 10;
//             //             (opt as EraserOptions).isLine = true;
//             //         }
//             //         worker.setLocalToolsType(toolsKey,opt);
//             //     } else {
//             //         room.disableDeviceInputs = false;
//             //         worker.freezed()
//             //     }
//             // })
//             disposer = autorun(async () => {
//                 const _new = toJS(room.state.memberState);
//                 // const v = this.cache.get(key);
//                 if (_new.currentApplianceName === ApplianceNames.eraser || _new.currentApplianceName === ApplianceNames.pencil) {
//                     room.disableDeviceInputs = true;
//                     const toolsKey = _new.currentApplianceName === ApplianceNames.eraser ? EToolsKey.Eraser: EToolsKey.Pencil;
//                     const opt:BaseShapeOptions = {
//                         color:'red'
//                     };
//                     if (toolsKey === EToolsKey.Pencil) {
//                         (opt as PencilOptions).thickness = 10;
//                         (opt as PencilOptions).isStroke = true;
//                     }else if(toolsKey === EToolsKey.Eraser) {
//                         (opt as EraserOptions).thickness = 10;
//                         (opt as EraserOptions).isLine = true;
//                     }
//                     worker.setLocalToolsType(toolsKey,opt);
//                 } else {
//                     room.disableDeviceInputs = false;
//                     worker.freezed()
//                 }

//             })
//         }
//         return ()=>{
//             if(disposer){
//                 disposer();
//             }
//         }
//     },[room,worker])
//     useEffect(()=>{
//         if(canvasSceneOpt && worker){
//             const {width,height} = canvasSceneOpt;
//             worker.updateCanvas(width, height)
//         }
//     },[canvasSceneOpt, worker])
//     return (
//         <div ref={refDiv} className={styles['Container']}>
//             {/* hello */}
//             { style && <canvas id="canvasTest" ref={ref} className={styles['Canvas']} style={style} /> }
//         </div>
//     )
// },()=>{
//     return true
// })