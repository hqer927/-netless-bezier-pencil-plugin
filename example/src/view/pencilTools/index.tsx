/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import {useContext, useMemo, useState, useEffect} from 'react';
// import {
//     EditOutlined,
//     DeleteOutlined
// } from '@ant-design/icons';
import { StrokePencilIcon, NormPencilIcon, DottedPencilIcon, DottedPencilLongIcon } from '../../assets/svg';
import { ColorPicker, Divider, Popover, Button, Slider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { AppContext } from "../../App";
import { EToolsKey } from '@hqer/bezier-pencil-plugin/src/core/enum';
import { EStrokeType } from '@hqer/bezier-pencil-plugin/src/plugin/types';
export const PencilTools = () => {
    const {toolsKey} = useContext(AppContext);
    const [strokeType, setStrokeType] = useState<EStrokeType>(EStrokeType.Stroke);
    useEffect(()=>{
        const _strokeType = window.room.state.memberState.strokeType;
        setStrokeType(_strokeType);
    }, [])
    const _colorPicker = useMemo(() => {
        if(toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen){
            const defaultColor:[number, number, number] = window.room?.state?.memberState?.strokeColor || [0,0,0];
            const opacity: number = window.room?.state?.memberState?.strokeOpacity || 1;
            const defaultValue: any = {a: opacity, b: defaultColor[2], g: defaultColor[1], r: defaultColor[0]};
            const setColorRgb = (color: Color) => {
                const rgba = color.toRgb();
                // console.log('color', rgba)
                window.room.setMemberState({strokeColor:[rgba.r,rgba.g,rgba.b], strokeOpacity:rgba.a});
            }
            return (
                <ColorPicker
                    defaultValue={defaultValue}
                    onChangeComplete={setColorRgb}
                    styles={{
                        popupOverlayInner: {
                            width: 280,
                        }
                    }}
                    presets={[
                        {
                            label:'颜色',
                            colors:[
                                '#000000',
                                '#FF0000',
                                '#00FF00',
                                '#0000FF',
                                '#FFFF00',
                                '#FF00FF',
                                '#00FFFF',
                                '#C0C0C0',
                                '#808080'
                            ]
                        }]}
                    panelRender={(_, { components: { Picker, Presets } }) => (
                        <div
                        className="custom-panel"
                        style={{
                            display: 'flex',
                            width: 280,
                            justifyContent: 'space-between',
                        }}
                        >
                        <div
                            style={{
                                flex: 1,
                            }}
                        >
                            <Presets />
                        </div>
                        <Divider 
                            type="vertical"
                            style={{
                                height: 'auto',
                            }}
                        />
                        <div
                            style={{
                                width: 170,
                            }}
                        >
                            <Picker />
                        </div>
                        </div>
                    )}
                ></ColorPicker>
            )
        }
        return null;
    }, [toolsKey])
    
    const _strokeType = useMemo(() => {
        if(toolsKey === EToolsKey.Pencil || toolsKey === EToolsKey.LaserPen){
            const defaultWidth:number = window.room.state.memberState.strokeWidth;
            const setWidth = (value: number)=>{
                // console.log('value', value)
                window.room.setMemberState({strokeWidth: value});
            }
            return (
                <Popover
                    placement="rightTop"
                    title={()=>{
                        return (
                            <>
                              <Button.Group size="middle">
                                    {toolsKey === EToolsKey.Pencil && <Button icon={<StrokePencilIcon />} onClick={()=>{setStrokeType(EStrokeType.Stroke)}}/>}
                                    <Button icon={<NormPencilIcon />} onClick={()=>{setStrokeType(EStrokeType.Normal)}}/>
                                    <Button icon={<DottedPencilIcon />} onClick={()=>{setStrokeType(EStrokeType.Dotted)}}/>
                                    <Button icon={<DottedPencilLongIcon />} onClick={()=>{setStrokeType(EStrokeType.LongDotted)}}/>
                                </Button.Group>
                                <Slider
                                    defaultValue = {defaultWidth}
                                    min={1}
                                    max={10}
                                    onAfterChange={setWidth}
                                />
                            </>
                        )
                    }}
                >
                    <Button icon={ strokeType === EStrokeType.Stroke ? <StrokePencilIcon /> : 
                        strokeType === EStrokeType.Normal ? <NormPencilIcon /> : 
                        strokeType === EStrokeType.LongDotted ? <DottedPencilLongIcon /> : 
                        <DottedPencilIcon />}/>
                </Popover>
            )
        }
        return null;
    }, [toolsKey, strokeType])

    useEffect(() => {
        window.room.setMemberState({strokeType});
    }, [strokeType])
    

    return (
        <div className={styles['PencilTools']}>
            {_colorPicker}
            {_strokeType}
        </div>
    )
}