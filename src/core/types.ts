/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCollectorReducerAction, INormalPushMsg } from '../collector/types';
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from './enum';
import { BaseShapeOptions, BaseShapeTool } from './tools';

export type IworkId = string | number; 

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
    width?: number;
    height?: number;
    bufferSize?: number;
}
export interface IUpdateNodeOpt {
    scale?: [number,number],
    size?: {
        width: number,
        height: number
    },
    translate?: [number,number],
    selectorColor?: string,
    color?: string,
    opacity?:number,
    pos?:[number, number];
    workState?: EvevtWorkState;
    useAnimation?: boolean;
    zIndex?:number;
    zIndexDistance?:number;
    originPos?:[number,number]
    ops?:string;
    angle?:number;
    centralPoint?:[number,number]
}

export type IWorkerMessage = Omit<Partial<BaseCollectorReducerAction>,'op'> & {
    msgType: EPostMessageType;
    dataType: EDataType;
    workState?: EvevtWorkState;
    op?: number[];
    // sp?: Array<[string, BaseCollectorReducerAction | undefined]>;
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
    noRender?:boolean;
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
    color?: string;
    padding?: number;
    selectRect?: IRectType;
    updateNodeOpts?: Map<string, IUpdateNodeOpt>;
    nodeColor?:string;
    willSyncService?:boolean;
    newWorkDatas?:Array<{
        op:number[];
        opt: BaseShapeOptions;
        workId: IworkId;
        toolsType: EToolsKey;
    }>
}
export interface IMainMessageRenderData {
    rect?: IRectType,
    imageBitmap?: ImageBitmap;
    drawCanvas?: ECanvasShowType;
    
    isClear?: boolean;
    clearCanvas?: ECanvasShowType;
    /** 是否需要销毁imageBitmap */
    isUnClose?: boolean;
    isFullWork?: boolean;
}

export interface IBatchMainMessage {
    lockId?: number;
    /** 绘制数据 */
    render?: IMainMessageRenderData;
    /** 同步服务端数据 */
    sp?: Array<IMainMessage>;
    drawCount?: number;
}

export interface ICameraOpt {
    centerX: number,
    centerY: number,
    scale: number,
    width: number,
    height: number,
    // animationMode?: "continuous",
}

export interface IActiveToolsDataType {
    toolsType: EToolsKey;
    toolsOpt: BaseShapeOptions;
}

export interface IActiveWorkDataType {
    workId: IworkId | undefined;
    workState: EvevtWorkState;
    toolsOpt?: BaseShapeOptions;
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
    noRender?:boolean;
}
export type BaseNodeMapItem = {
    name: string;
    rect: IRectType;
    ops?: string;
    opt?: BaseShapeOptions;
    toolsType?: EToolsKey;
}