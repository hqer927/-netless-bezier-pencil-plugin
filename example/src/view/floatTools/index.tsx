/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import {useContext} from 'react';
import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import { AppContext } from "../../App";
import { EToolsKey } from '@hqer/bezier-pencil-plugin/src/core/enum';
import { ArrowIcon, ClickerIcon, ErasersIcon, HandIcon, LaserPenIcon, SelectorIcon } from '../../assets/svg';
import { PencilTools } from '../pencilTools';
export const FloatTools = () => {
    const {toolsKey, setToolsKey} = useContext(AppContext);
    return (
        <div className={styles['FloatTools']}>
            <FloatButton.Group shape="square" style={{ left: 20, bottom: '50%' }}>
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
                <FloatButton 
                    type={toolsKey === EToolsKey.Arrow?'primary':'default'} 
                    icon={<ArrowIcon style={{color:toolsKey === EToolsKey.Arrow?'white':'black' }}  />} 
                    onClick={()=>{
                        setToolsKey(EToolsKey.Arrow)
                    }}
                />
                <FloatButton 
                    type={toolsKey === EToolsKey.Hand?'primary':'default'} 
                    icon={<HandIcon style={{color:toolsKey === EToolsKey.Hand?'white':'black' }}  />} 
                    onClick={()=>{
                        setToolsKey(EToolsKey.Hand)
                    }}
                />
                <FloatButton 
                    type={'default'} 
                    icon={<DeleteOutlined/>} 
                    onClick={()=>{
                        window.room?.cleanCurrentScene();
                    }}
                />
                {
                    (toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen) && <PencilTools/>
                }
            </FloatButton.Group>
        </div>
    )
}