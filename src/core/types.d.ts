import { BaseCollectorReducerAction, INormalPushMsg } from '../collector/types';
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from './enum';
import { BaseShapeOptions, BaseShapeTool } from './tools';
export type IworkId = string | number;
export interface ICanvasSceneType {
    /** canvas 上下文 */
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
    offscreen: boolean;
    handleEvent: boolean;
    depth: boolean;
}
export interface IUpdateNodeOpt {
    scale?: [number, number];
    skew?: [number, number];
    fillColor?: string;
    strokeColor?: string;
}
export type IWorkerMessage = Omit<Partial<BaseCollectorReducerAction>, 'op'> & {
    msgType: EPostMessageType;
    dataType: EDataType;
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
    translate?: [number, number];
    scale?: number;
    currentToolsData?: IActiveToolsDataType;
    updateNodeOpt?: IUpdateNodeOpt;
    layerOpt?: ILayerOptionType;
    drawCount?: number;
};
export interface IRectType {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface IMainMessage extends INormalPushMsg {
    type: EPostMessageType;
    dataType?: EDataType;
    imageBitmap?: ImageBitmap | OffscreenCanvas;
    rect?: IRectType;
    dpr?: number;
    translate?: [number, number];
    scale?: number;
    removeIds?: Array<string>;
    /** 是否是完整的一次任务 */
    isFullWork?: boolean;
    drawCount?: number;
}
export interface IMainMessageRenderData {
    rect?: IRectType;
    imageBitmap?: ImageBitmap;
    drawCanvas?: ECanvasShowType;
    isClear?: boolean;
    clearCanvas?: ECanvasShowType;
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
    centerX?: number;
    centerY?: number;
    scale?: number;
    animationMode?: "continuous";
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
    toolstype: EToolsKey;
    animationWorkData: number[];
    animationIndex: number;
    type: EPostMessageType;
    node?: BaseShapeTool;
    updateNodeOpt?: IUpdateNodeOpt;
    ops?: string;
    isDel: boolean;
    timer?: number;
};
