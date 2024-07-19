import styles from '../../plugin/index.module.less';
import React, { useContext, useMemo } from "react"
import { DisplayerContext } from "../../plugin/displayerView";
import { EScaleType } from "../../core";
import { FloatBtns } from "../floatBtns";
import { EmitEventType } from "../../plugin/types";
import { HighlightBox, HighlightTwoBox, HighlightFourBox, LockedBox } from "./highlightBox";
import { TextViewInSelector } from "../../component/textEditor/view";
import { TextEditorInfo } from "../../component/textEditor";
import { RotateBtn } from "./rotate";
import { DraggableBox } from "./dragBox";
import { ResizableBox, ResizableTwoBox } from './resizable';
import { isNumber, isEqual } from 'lodash';

const FloatBarComponent = React.forwardRef((props:{
    children: JSX.Element | null;
}, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {floatBarData, operationType} = useContext(DisplayerContext);
    const HighLightUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.all ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HighlightBox/>
    },[floatBarData, operationType])
    const HighLightTwoUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.both ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HighlightTwoBox/>
    },[floatBarData, operationType])
    const HighLightFourUI = useMemo(()=>{
        if ( 
            floatBarData?.scaleType !== EScaleType.proportional ||
            operationType === EmitEventType.RotateNode
        ) {
            return null
        }
        return <HighlightFourBox/>
    },[floatBarData, operationType])
    const LockedUI = useMemo(()=>{
        if ( floatBarData?.scaleType === EScaleType.none && floatBarData?.canLock) {
            return  <LockedBox/>
        }
        return null
    },[floatBarData])
    return (
        <div ref={ref} 
            style= { floatBarData ? {
                transform: `translate(${floatBarData.x}px,${floatBarData.y}px)`,
                width: floatBarData.w,
                height: floatBarData.h,
                pointerEvents: 'none',
            } : undefined
        }>
            { LockedUI }
            { HighLightUI }
            { HighLightTwoUI }
            { HighLightFourUI }
            { props.children}
        </div>
    )
})
const FloatBarContext = React.forwardRef((props:{
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
},ref: React.ForwardedRef<HTMLDivElement>) => {
    const {floatBarData, operationType, maranger} = useContext(DisplayerContext);
    const {editors, activeTextId} = props;

    const RotateBtnUI = useMemo(()=>{
        if(floatBarData?.canRotate && floatBarData?.selectIds?.length === 1 && 
            (operationType === EmitEventType.None || operationType === EmitEventType.RotateNode)){
                return <RotateBtn className={styles['RotateBtn']}  />
        }
        return null;
    },[floatBarData?.canRotate, floatBarData?.selectIds?.length, operationType])

    const ResizableBoxUI = useMemo(()=>{
        if((floatBarData?.scaleType === EScaleType.all || floatBarData?.scaleType === EScaleType.proportional) && 
            (operationType === EmitEventType.None || operationType === EmitEventType.ScaleNode) && 
            isNumber(floatBarData?.x) && isNumber(floatBarData?.y)){
                return <ResizableBox className={styles['ResizeBtn']} />
        }
        return null;
    },[floatBarData?.scaleType, operationType, floatBarData?.x, floatBarData?.y])

    const ResizableTwoBoxUI = useMemo(()=>{
        if(floatBarData?.scaleType === EScaleType.both && 
            (operationType === EmitEventType.None || operationType === EmitEventType.SetPoint)){
                return <ResizableTwoBox className={styles['ResizeTowBox']} />
        }
        return null;
    },[floatBarData?.scaleType, operationType])

    const TextViewInSelectorUI = useMemo(()=>{
        const selectIds = floatBarData?.selectIds || [];
        if (editors && maranger && selectIds && isNumber(floatBarData?.x) && isNumber(floatBarData?.y) && isNumber(floatBarData?.w) && isNumber(floatBarData?.h)  ) {
                return <TextViewInSelector
                    box={{
                        x:floatBarData?.x,
                        y:floatBarData?.y,
                        w:floatBarData?.w,
                        h:floatBarData?.h
                    }}
                    manager={maranger}
                    selectIds={selectIds}
                    activeTextId={activeTextId}
                    editors={editors}
                />
        }
        return null
    },[floatBarData?.selectIds, floatBarData?.x, floatBarData?.y, floatBarData?.w, floatBarData?.h, editors, maranger, activeTextId])
    const FloatBarBtnUI = useMemo(()=>{
        if (operationType === EmitEventType.None && isNumber(floatBarData?.x) && isNumber(floatBarData?.y) && isNumber(floatBarData?.w) && isNumber(floatBarData?.h)) {
            return (
                <div className={styles['FloatBarBtn']}
                    style= {{
                        left: floatBarData?.x,
                        top: floatBarData?.y,
                        width: floatBarData.w,
                        height: floatBarData.h,
                    }}
                >
                    <FloatBtns position={{x:floatBarData.x,y:floatBarData.y}} textOpt={floatBarData?.textOpt} noLayer={floatBarData?.isLocked}/>
                </div>
            )
        }
        return null;
    },[floatBarData?.x,floatBarData?.y, floatBarData?.w, floatBarData?.h, floatBarData?.textOpt, floatBarData?.isLocked, operationType])
    return (
        <div className={styles['FloatBar']}
            onMouseOver={()=>{
                console.log('onMouseOver')
                maranger?.control.worker.blurCursor(maranger.viewId);
            }}
        >
            <FloatBarComponent ref={ref} >
                <>
                    { TextViewInSelectorUI }
                </>
            </FloatBarComponent>
            <DraggableBox onClickHandle={(e)=>{
                if (maranger && editors?.size) {
                    const point = maranger.getPoint(e.nativeEvent);
                    point && maranger.control.textEditorManager.computeTextActive(point, maranger.viewId)
                }
            }} />
            { RotateBtnUI }
            { ResizableBoxUI }
            { ResizableTwoBoxUI }
            { FloatBarBtnUI }
        </div>
    )
});
export const FloatBar = React.memo(FloatBarContext,(props:{
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
}, nextProps:{
    editors?: Map<string, TextEditorInfo>,
    activeTextId?: string,
})=>{
    if (!isEqual(props,nextProps)) {
        return false
    }
    return true;
})