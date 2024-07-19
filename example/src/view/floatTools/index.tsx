/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import {useContext, useEffect, useState} from 'react';
import {
    EditOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    FilePptOutlined,
    FileMarkdownOutlined
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import { AppContext } from "../../App";
import { EToolsKey } from '@hqer/bezier-pencil-plugin';
import { ClickerIcon, ErasersIcon, LaserPenIcon, SelectorIcon, TextIcon } from '../../assets/svg';
import { PencilTools } from '../pencilTools';
import { WindowManager, BuiltinApps } from '@netless/window-manager';
import SlideApp, { addHooks } from "@netless/app-slide";
import { GeometryButtons } from '../geometryTools';
import { ImageButtons } from '../imageTools';
import React from 'react';
export const FloatTools = () => {
    const [docsViewerIndex, setDocsViewerIndex] = useState<number>(1);
    const [pptViewerIndex, setPptViewerIndex] = useState<number>(1);
    const [mediaViewerIndex, setMediaViewerIndex] = useState<number>(1);
    const {toolsKey, setToolsKey} = useContext(AppContext);
    useEffect(()=>{
        WindowManager.register({
            kind: "Slide",
            appOptions: { debug: false },
            src: SlideApp,
            addHooks,
        });
    },[])
    function blobCallback(iconName:string, canvas: HTMLCanvasElement) {
        return (b:Blob | null) => {
            if(b){
                const a = document.createElement("a");
                a.textContent = "下载";
                document.body.appendChild(a);
                a.style.display = "block";
                a.download = `${iconName}.png`;
                a.href = window.URL.createObjectURL(b);
                a.click();
                a.remove();
                canvas.remove();
            }
        };
    }
    const insertDocsViewer = async (): Promise<void> => {
        setDocsViewerIndex(docsViewerIndex+1);
        await window.manager.addApp({
            kind: BuiltinApps.DocsViewer,
            options: {
                scenePath: `/${BuiltinApps.DocsViewer}/${docsViewerIndex}`,
                title: "Static PDF",
                scenes: [
                    {
                        name: "1",
                        ppt: {
                            height: 1010,
                            src: "https://convertcdn.netless.link/staticConvert/18140800fe8a11eb8cb787b1c376634e/1.png",
                            width: 714,
                        },
                    },
                    {
                        name: "2",
                        ppt: {
                            height: 1010,
                            src: "https://convertcdn.netless.link/staticConvert/18140800fe8a11eb8cb787b1c376634e/2.png",
                            width: 714,
                        },
                    },
                ],  
            },
            // mutualPlugin: window.appliancePlugin
        });
    };
    const insertPptViewer = async (): Promise<void> => {
        setPptViewerIndex(pptViewerIndex+1);
        await window.manager.addApp({
            kind: "Slide",
            options: {
                scenePath: `/ppt/82d16c40b15745f0b5fad096ac721773`, // [1]
                title: "a.pptx",
            },
            attributes: {
                taskId: "82d16c40b15745f0b5fad096ac721773", // [2]
                url: "https://convertcdn.netless.link/dynamicConvert", // [3]
            },
            // mutualPlugin: window.appliancePlugin
        });
    };
    const insertMediaViewer = async (): Promise<void> => {
        setMediaViewerIndex(mediaViewerIndex + 1);
        await window.manager.addApp({
            kind: BuiltinApps.MediaPlayer,
            attributes: {
                src: "https://developer-assets.netless.link/Zelda.mp4",
            },
        });
    };
    return (
        <div className={styles['FloatTools']}>
            <FloatButton.Group shape="square" style={{ left: 20, bottom: '20%' }}>
                <FloatButton type={toolsKey === EToolsKey.Clicker ?'primary':'default'} icon={<ClickerIcon />} onClick={()=>{
                    setToolsKey(EToolsKey.Clicker)
                }}/>
                <FloatButton type={toolsKey === EToolsKey.Selector ?'primary':'default'} icon={<SelectorIcon />} onClick={()=>{
                    setToolsKey(EToolsKey.Selector)
                }}/>
                <FloatButton type={toolsKey === EToolsKey.Pencil?'primary':'default'} icon={<EditOutlined />} onClick={()=>{
                    setToolsKey(EToolsKey.Pencil)
                }}/>
                <FloatButton type={toolsKey === EToolsKey.LaserPen?'primary':'default'} icon={<LaserPenIcon />} onClick={()=>{
                    setToolsKey(EToolsKey.LaserPen)
                }}/>
                <FloatButton 
                    type={toolsKey === EToolsKey.Eraser?'primary':'default'} 
                    icon={<ErasersIcon style={{color:toolsKey === EToolsKey.Eraser?'white':'black' }}  />} 
                    onClick={()=>{
                        setToolsKey(EToolsKey.Eraser)
                    }}
                />
                <GeometryButtons/>
                {
                    window.manager && <FloatButton 
                        type={'default'} 
                        icon={<FilePdfOutlined />} 
                        onClick={insertDocsViewer}
                    />
                }
                {
                    window.manager && <FloatButton 
                        type={'default'} 
                        icon={<FilePptOutlined />} 
                        onClick={insertPptViewer}
                    />
                }
                {
                    window.manager && <FloatButton 
                        type={'default'} 
                        icon={<FileMarkdownOutlined />} 
                        onClick={insertMediaViewer}
                    />
                }
                <FloatButton 
                    type={'default'} 
                    icon={<DeleteOutlined/>} 
                    onClick={()=>{
                        // window.manager.cleanCurrentScene();
                        // if (window.manager) {
                        //     window.manager.cleanCurrentScene();
                        // } else {
                            window.room.cleanCurrentScene();
                        // }
                    }}
                />
                <ImageButtons/>
                <FloatButton 
                    type={toolsKey === EToolsKey.Text?'primary':'default'} 
                    icon={<TextIcon style={{color:toolsKey === EToolsKey.Text?'white':'black' }}  />} 
                    onClick={()=>{
                        setToolsKey(EToolsKey.Text)
                    }}
                />
                <FloatButton 
                    type={'default'} 
                    icon={<DownloadOutlined />} 
                    onClick={async ()=>{
                        const width =  window.manager && window.manager.mainView.size.width || window.room.state.cameraState.width;
                        const height =  window.manager && window.manager.mainView.size.height || window.room.state.cameraState.height;
                        const scenePath = window.manager && window.manager.mainView.focusScenePath || window.room.state.sceneState.scenePath;
                        const rect = await window.room.getBoundingRectAsync(scenePath);
                        let w = Math.max(rect?.width, width);
                        let h = Math.max(rect?.height, height);
                        let scale:number = 1;
                        const scaleW = w > 5 * 1024 && Math.min(5* 1024 / w, scale) || scale;
                        const scaleH = h > 5 * 1024 && Math.min(5 * 1024 / h, scale) || scale;
                        if (scaleW <= scaleH) {
                            w = scaleW < 1 && 5 * 1024 || w;
                            h = Math.floor(h * scaleW)+1;
                            scale = scaleW;
                        } else if (scaleW > scaleH) {
                            h = scaleH < 1 && 5 * 1024 || h;
                            w = Math.floor(w * scaleH)+1;
                            scale = scaleH;
                        }
                        const centerCamera = {
                            scale,
                            centerX: rect.originX + rect.width / 2,
                            centerY: rect.originY + rect.height / 2,
                        }
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        canvas.width = w;
                        canvas.height = h;
                        context && await window.room.screenshotToCanvasAsync(context, scenePath, w, h, centerCamera, devicePixelRatio);
                        canvas.toBlob(blobCallback(window.room.uid, canvas), "image/png")
                    }}
                />
                {
                    (toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen) && <PencilTools/>
                }
            </FloatButton.Group>
        </div>
    )
}