/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Scene } from 'spritejs';
import { BaseCollectorReducerAction, INormalPushMsg, ISerializableStorageData } from '../collector/types';
import { ETextEditorType, FontStyleType, FontWeightType, TextOptions } from '../component/textEditor/types';
import { EmitEventType } from '../plugin/types';
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EScaleType, EToolsKey, ElayerType, EvevtWorkState } from './enum';
import { BaseShapeOptions, BaseShapeTool, ShapeOptions } from './tools';
import type { SelectorShape } from './tools';
import type { Direction } from "re-resizable/lib/resizer";
import { ShapeOptType } from '../displayer/types';
export type IworkId = string | number; 

export type IqueryTask = Partial<IWorkerMessage> | undefined

export type ViewWorkerOptions = {
    offscreenCanvasOpt: IOffscreenCanvasOptionType;
    layerOpt: ILayerOptionType;
    dpr: number;
    originalPoint: [number, number],
    cameraOpt: ICameraOpt;
}

export interface ICanvasSceneType {
    /** canvas 上下文 */
    // ctx: CanvasRenderingContext2D;
    /** canvas 宽度 */
    width: number;
    /** canvas 高度 */
    height: number;
    /** canvas */
    canvas: HTMLCanvasElement; 
}

export interface IOffscreenCanvasOptionType {
    /** offscreenCanvas 宽度 */
    width: number;
    /** offscreenCanvas 高度 */
    height: number;
    /** 上下文类型,默认webgl2 */
    contextType?: ECanvasContextType;
    /** 是否自动渲染,默认自动渲染 */
    autoRender?: boolean;
    /** 缓冲区大小，默认1500 */
    bufferSize?: number;
    [key: string]: any;
}

export interface ILayerOptionType {
    offscreen?:boolean,
    handleEvent?: boolean,
    depth?: boolean,
    width: number;
    height: number;
    bufferSize?: number;
}
export interface IUpdateNodeOpt {
    scale?: [number,number],
    box?: {
        x: number,
        y: number,
        w: number,
        h: number
    },
    dir?:Direction;
    translate?: [number,number],
    selectorColor?: string,
    strokeColor?: string,
    fillColor?: string,
    fontColor?: string,
    fontBgColor?: string,
    isOpacity?: boolean,
    pos?:[number, number];
    workState?: EvevtWorkState;
    useAnimation?: boolean;
    zIndex?:number;
    zIndexLayer?: ElayerType;
    originPos?:[number,number]
    ops?:string;
    angle?:number;
    centralPoint?:[number,number];
    selectScale?: number[];
    boxScale?:[number,number];
    boxTranslate?:[number,number];
    bold?: FontWeightType;
    italic?: FontStyleType;
    underline?:boolean;
    lineThrough?:boolean;
    fontSize?:number;
    pointMap?:Map<string,[number,number][]>;
    textInfos?:Map<string,Partial<TextOptions>>;
    isLocked?:boolean;
    toolsType?:EToolsKey;
    willRefresh?:boolean;
    [key: string]: any;
}

export type IWorkerMessage = Omit<Partial<BaseCollectorReducerAction>,'op'> & {
    viewId:string;
    msgType: EPostMessageType;
    dataType: EDataType;
    scenePath?:string;
    workState?: EvevtWorkState;
    op?: number[];
    offscreenCanvasOpt?: IOffscreenCanvasOptionType;
    dpr?: number;
    vertex?: string;
    fragment?: string;
    workId?: IworkId;
    workOption?: BaseShapeOptions;
    toolsType?: EToolsKey;
    uid?: string;
    cameraOpt?: ICameraOpt;
    translate?:[number,number];
    scale?: number;
    currentToolsData?: IActiveToolsDataType;
    updateNodeOpt?: IUpdateNodeOpt;
    layerOpt?: ILayerOptionType;
    drawCount?: number;
    useAnimation?: boolean;
    willRefreshSelector?: boolean;
    willSyncService?: boolean;
    willRefresh?: boolean;
    isActiveZIndex?: boolean;
    selectStore?:Map<string,{
        ops?:string;
        opt?: BaseShapeOptions;
        updateNodeOpt?:IUpdateNodeOpt;
    }>;
    willSerializeData?:boolean;
    isRunSubWork?:boolean;
    undoTickerId?:number;
    scenes?:ISerializableStorageData;
    textType?:ETextEditorType;
    mainTasksqueueCount?:number;
    textUpdateForWoker?:boolean;
    tasksqueue?:Map<string,IWorkerMessage>;
    point?:[number,number]
    [key: string]: any;
}
export interface IRectType {
    x:number;
    y:number;
    w:number;
    h:number;
}
export interface IMainMessage extends INormalPushMsg {
    type: EPostMessageType;
    dataType?: EDataType;
    imageBitmap?: ImageBitmap | OffscreenCanvas;
    rect?: IRectType;
    dpr?: number;
    translate?: [number,number];
    scale?: number;
    removeIds?: Array<string>;
    /** 是否是完整的一次任务 */
    isFullWork?: boolean;
    drawCount?: number;
    selectIds?: Array<string>;
    padding?: number;
    selectRect?: IRectType;
    selectorColor?: string,
    strokeColor?: string,
    fillColor?: string,
    isOpacity?: boolean,
    updateNodeOpts?: Map<string, IUpdateNodeOpt>;
    willSyncService?:boolean;
    newWorkDatas?: Map<string,{
        op: number[];
        opt: BaseShapeOptions;
        workId: IworkId;
        toolsType: EToolsKey;
    }>;
    undoTickerId?:number;
    scenePath?:string;
    canvasWidth?:number;
    canvasHeight?:number;
    workState?:EvevtWorkState;
    canTextEdit?:boolean;
    canRotate?:boolean;
    canLock?:boolean;
    scaleType?: EScaleType;
    textOpt?:TextOptions;
    viewId?:string;
    points?:[number,number][];
    isRefresh?:boolean;
    renderRect?:IRectType;
    isLocked?:boolean;
    shapeOpt?: ShapeOptType
    toolsTypes?: EToolsKey[];
}
export interface IMainMessageRenderData {
    viewId: string
    rect?: IRectType,
    imageBitmap?: ImageBitmap;
    
    isDrawAll?: boolean;
    drawCanvas?: ECanvasShowType;
    
    isClear?: boolean;
    isClearAll?: boolean;
    clearCanvas?: ECanvasShowType;
    /** 是否需要销毁imageBitmap */
    isUnClose?: boolean;
    isFullWork?: boolean;
    workerType?: EDataType.Local | EDataType.Service;
    offset?: {
        x:number,
        y:number,
    },
    translate?:[number,number];
}
export interface IBatchMainMessage {
    /** 绘制数据 */
    render?: Array<IMainMessageRenderData>;
    /** 同步服务端数据 */
    sp?: Array<IMainMessage>;
    drawCount?: number;
    workerTasksqueueCount?:number;
}

export interface ICameraOpt {
    centerX: number,
    centerY: number,
    scale: number,
    width: number,
    height: number,
    // animationMode?: "continuous",
}

export interface IUpdateSelectorPropsType {
    updateSelectorOpt: IUpdateNodeOpt;
    willRefreshSelector?: boolean;
    willSyncService?: boolean;
    willSerializeData?:boolean;
    emitEventType?: EmitEventType;
    isSync?:boolean;
    textUpdateForWoker?:boolean;
    scene?:Scene;
}

export interface IUpdateSelectorCallbackPropsType {
    res?: IMainMessage,
    param: IUpdateSelectorPropsType, 
    postData: Pick<IBatchMainMessage,'sp'|'render'>,
    workShapeNode: SelectorShape,
    newServiceStore:Map<string,{
        opt: BaseShapeOptions;
        toolsType: EToolsKey;
        ops?: string;
    }>
}
export interface IActiveToolsDataType {
    toolsType: EToolsKey;
    toolsOpt: ShapeOptions;
}

export interface IActiveWorkDataType {
    workId?: IworkId;
    workState: EvevtWorkState;
    toolsOpt?: ShapeOptions;
}
export type IServiceWorkItem = {
    toolsType: EToolsKey;
    animationWorkData?: number[];
    animationIndex?: number;
    type: EPostMessageType;
    node?: BaseShapeTool;
    updateNodeOpt?: IUpdateNodeOpt;
    ops?: string;
    isDel?: boolean;
    timer?:number;
    useAnimation?:boolean;
    bindSelector?: string;
    selectIds?: string[];
    oldRect?:IRectType;
    totalRect?: IRectType;
    isDiff?:boolean;
}
export type BaseNodeMapItem = {
    name: string;
    rect: IRectType;
    op: number[];
    opt: BaseShapeOptions;
    centerPos: [number, number];
    toolsType: EToolsKey;
    canRotate: boolean;
    scaleType: EScaleType;
}
export type Size = {
    /**
     * 宽 
     */
    width: number;
    /**
     * 高 
     */
    height: number;
};
export type Rectangle = Size & {
    /**
     * 矩形的左上角 x 坐标 
     */
    originX: number;
    /**
     * 矩形的左上角 y 坐标 
     */
    originY: number;
};
// export type TextOpt = {
//     fontSize?: number;
//     fontColor?: string;
//     fontBgColor?: string;
//     fontFamily?: string;
//     fontVariant?: string;
//     fontWeight?: string;
//     fontStretch?: string;
//     textAlign?: string;
//     verticalAlign?: string;
// }
// export type TextInfo = {
//     x: number,
//     y: number,
//     text: string[],
//     opt?: TextOpt
// }