/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import {useContext, useEffect, useState} from 'react';
import {
    EditOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    FilePptOutlined
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import { AppContext } from "../../App";
import { EToolsKey } from '@hqer/bezier-pencil-plugin/src/core';
import { ClickerIcon, ErasersIcon, LaserPenIcon, SelectorIcon, TextIcon } from '../../assets/svg';
import { PencilTools } from '../pencilTools';
import { WindowManager, BuiltinApps } from '@netless/window-manager';
import SlideApp, { addHooks } from "@netless/app-slide";
import { GeometryButtons } from '../geometryTools';
import { ImageButtons } from '../imageTools';
export const FloatTools = () => {
    const [docsViewerIndex, setDocsViewerIndex] = useState<number>(1);
    const [pptViewerIndex, setPptViewerIndex] = useState<number>(1);
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
            mutualPlugin: window.pluginRoom
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
            mutualPlugin: window.pluginRoom
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
                <FloatButton 
                    type={'default'} 
                    icon={<DeleteOutlined/>} 
                    onClick={()=>{
                        window.pluginRoom.cleanCurrentScene();
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
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        const width =  window.manager && window.manager.mainView.size.width || window.room.state.cameraState.width;
                        const height =  window.manager && window.manager.mainView.size.height || window.room.state.cameraState.height;
                        // const camera = window.manager && window.manager.mainView.camera || window.room.state.cameraState;
                        const scenePath = window.manager && window.manager.mainView.focusScenePath || window.room.state.scenePath;
                        const rect = await window.pluginRoom.getBoundingRectAsync(scenePath);
                        // console.log('rect', rect)
                        const w = Math.max(rect?.width, width);
                        const h = Math.max(rect?.height, height);
                        canvas.width = w;
                        canvas.height = h;
                        const centerCamera = {
                            scale: 1,
                            centerX: rect.originX + rect.width / 2,
                            centerY: rect.originY + rect.height / 2,
                        }
                        // console.log('rect-1', centerCamera, w, h)
                        context && await window.pluginRoom.screenshotToCanvasAsync(context, scenePath, w, h, centerCamera, devicePixelRatio);
                        canvas.toBlob(blobCallback(window.room.uid, canvas), "image/png")
                    }}
                />
                {/* <FloatButton 
                    type={'default'} 
                    icon={<FileImageOutlined />} 
                    onClick={async ()=>{
                        const div = document.createElement("div");
                        div.style.width = "200px";
                        div.style.height = "200px";
                        div.style.position = "absolute";
                        div.style.top = "0px";
                        div.style.right = "0px";
                        document.body.appendChild(div);
                        await window.pluginRoom.scenePreviewAsync(window.room.state.sceneState.scenePath, div, 200, 200);
                    }}
                /> */}
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
                    (toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen) && <PencilTools/>
                }
            </FloatButton.Group>
        </div>
    )
}