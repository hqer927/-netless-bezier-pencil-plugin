import { BaseCollectorReducerAction, INormalPushMsg, ISerializableStorageData } from '../collector/types';
import { ETextEditorType, TextOptions } from '../component/textEditor/types';
import { ECanvasContextType, ECanvasShowType, EDataType, EPostMessageType, EScaleType, EToolsKey, ElayerType, EvevtWorkState } from './enum';
import { BaseShapeOptions, BaseShapeTool, ShapeOptions } from './tools';
export type IworkId = string | number;
export type ViewWorkerOptions = {
    offscreenCanvasOpt: IOffscreenCanvasOptionType;
    layerOpt: ILayerOptionType;
    dpr: number;
    originalPoint: [number, number];
    cameraOpt: ICameraOpt;
};
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
    offscreen?: boolean;
    handleEvent?: boolean;
    depth?: boolean;
    width: number;
    height: number;
    bufferSize?: number;
}
export interface IUpdateNodeOpt {
    scale?: [number, number];
    box?: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    translate?: [number, number];
    selectorColor?: string;
    strokeColor?: string;
    fillColor?: string;
    fontColor?: string;
    fontBgColor?: string;
    isOpacity?: boolean;
    pos?: [number, number];
    workState?: EvevtWorkState;
    useAnimation?: boolean;
    zIndex?: number;
    zIndexLayer?: ElayerType;
    originPos?: [number, number];
    ops?: string;
    angle?: number;
    centralPoint?: [number, number];
    selectScale?: number[];
    boxScale?: [number, number];
    boxTranslate?: [number, number];
}
export type IWorkerMessage = Omit<Partial<BaseCollectorReducerAction>, 'op'> & {
    viewId: string;
    msgType: EPostMessageType;
    dataType: EDataType;
    scenePath?: string;
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
    useAnimation?: boolean;
    willRefreshSelector?: boolean;
    willSyncService?: boolean;
    willRefresh?: boolean;
    isActiveZIndex?: boolean;
    selectStore?: Map<string, {
        ops?: string;
        opt?: BaseShapeOptions;
        updateNodeOpt?: IUpdateNodeOpt;
    }>;
    willSerializeData?: boolean;
    isRunSubWork?: boolean;
    undoTickerId?: number;
    scenes?: ISerializableStorageData;
    textType?: ETextEditorType;
    mainTasksqueueCount?: number;
    textUpdateForWoker?: boolean;
    tasksqueue?: Map<string, IWorkerMessage>;
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
    selectIds?: Array<string>;
    padding?: number;
    selectRect?: IRectType;
    selectorColor?: string;
    strokeColor?: string;
    fillColor?: string;
    isOpacity?: boolean;
    updateNodeOpts?: Map<string, IUpdateNodeOpt>;
    willSyncService?: boolean;
    newWorkDatas?: Map<string, {
        op: number[];
        opt: BaseShapeOptions;
        workId: IworkId;
        toolsType: EToolsKey;
    }>;
    undoTickerId?: number;
    scenePath?: string;
    canvasWidth?: number;
    canvasHeight?: number;
    workState?: EvevtWorkState;
    canTextEdit?: boolean;
    canRotate?: boolean;
    scaleType?: EScaleType;
    textOpt?: TextOptions;
    viewId?: string;
}
export interface IMainMessageRenderData {
    viewId: string;
    rect?: IRectType;
    imageBitmap?: ImageBitmap;
    isDrawAll?: boolean;
    drawCanvas?: ECanvasShowType;
    isClear?: boolean;
    isClearAll?: boolean;
    clearCanvas?: ECanvasShowType;
    /** 是否需要销毁imageBitmap */
    isUnClose?: boolean;
    isFullWork?: boolean;
    offset?: {
        x: number;
        y: number;
    };
    translate?: [number, number];
}
export interface IBatchMainMessage {
    /** 绘制数据 */
    render?: Array<IMainMessageRenderData>;
    /** 同步服务端数据 */
    sp?: Array<IMainMessage>;
    drawCount?: number;
    workerTasksqueueCount?: number;
}
export interface ICameraOpt {
    centerX: number;
    centerY: number;
    scale: number;
    width: number;
    height: number;
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
    timer?: number;
    useAnimation?: boolean;
    bindSelector?: string;
    selectIds?: string[];
    oldRect?: IRectType;
    totalRect?: IRectType;
};
export type BaseNodeMapItem = {
    name: string;
    rect: IRectType;
    op: number[];
    opt: BaseShapeOptions;
    centerPos: [number, number];
    toolsType: EToolsKey;
    canRotate: boolean;
    scaleType: EScaleType;
};
