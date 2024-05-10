/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISerializableEventData, ISerializableStorageViewData } from "../collector/types";
import type { Callbacks, Camera, Color, Displayer, ImageInformation, Rectangle, RenderEngine, MemberState as _MemberState} from "white-web-sdk";
import { ECanvasContextType } from "../core/enum";
import type EventEmitter2 from "eventemitter2";
import type { TeachingAidsSingleManager } from "./single/teachingAidsSingleManager";
import type { TeachingAidsMultiManager } from "./multi/teachingAidsMultiManager";
import type { BaseTeachingAidsManager } from "./baseTeachingAidsManager";
import type { AppViewDisplayerManager, MainViewDisplayerManager } from "./baseViewContainerManager";
import type { TeachingAidsPlugin } from "./teachingAidsPlugin";
import type { CursorTool } from "@netless/cursor-tool";
import type { WindowManager } from "@netless/window-manager";

export type TeachingAidsPluginLike = TeachingAidsPlugin;
export type TeachingAidsManagerLike = TeachingAidsMultiManager | TeachingAidsSingleManager | BaseTeachingAidsManager;
export type TeachingAidsViewManagerLike = AppViewDisplayerManager | MainViewDisplayerManager;
export interface BaseSubWorkModuleProps {
    control: TeachingAidsManagerLike;
    internalMsgEmitter: EventEmitter2;
}
export type TeachingAidsAdaptor = {
    logger?: Logger;
    options?: TeachingAidsPluginOptions;
    cursorAdapter?: CursorTool;
}
export interface DisplayerForPlugin {
    readonly displayer: Displayer,
    readonly windowManager?: WindowManager,
    /**
     * 获取某个场景里包含所有元素的矩形 
     */
    getBoundingRectAsync(scenePath: string): Promise<Rectangle|undefined>;
    /**
     * 生成屏幕快照，并写入指定的 CanvasRenderingContext2D 对象中 
     */
    screenshotToCanvasAsync(context: CanvasRenderingContext2D, scenePath: string, width: number, height: number, camera: Camera, ratio?: number): Promise<void>;
    /**
     * 生成场景预览
     * @param  scenePath 想要获取预览内容的场景的场景路径
     * @param  div 想要展示预览内容的 div
     * @param  width 白板的缩放宽度：将当前白板内容，缩小到真实像素宽度。2.3.8 后，该参数为可选参数，如果不填，则默认为展示内容 div 的宽度。
     * @param  height 白板的缩放高度：将当前白板的内容，缩小到真实像素高度。2.3.8 后，该参数为可选参数，如果不填，则默认为展示内容 div 的高度。
     */
    scenePreviewAsync(scenePath: string, div: HTMLElement, width?: number, height?: number, engine?: RenderEngine): Promise<void>;
    /**
     * 在当前场景中插入图片
     * 该操作往往需要和 ``room.completeImageUpload`` 配合使用，具体例子可参考[《插入图片｜教具》](/javascript-zh/home/tools#插入图片)。
     */
    insertImage(imageInfo: ImageInformation): void;
    /**
     * 改变图片的锁定状态。若图片被锁定，则无法被框选、无法被拖动、无法被改变大小
     * @param uuid 图片的 UUID
     */
    lockImage(uuid: string, locked: boolean): void;
    /**
     * 设置图片资源。第一参数 ``uuid`` 是图片的唯一标识符，应该与 ``room.insertImage`` 中传入的 ``uuid`` 字段相同。
     * 第二参数 ``src`` 是图片资源的 URL。具体例子可参考[《插入图片｜教具》](/javascript-zh/home/tools#插入图片)。
     */
    completeImageUpload(uuid: string, src: string): void;
    /**
     * 导出特定场景的图片信息，注意这些信息可能与插入时填写的不同。
     * @param scenePath 需要导出图片信息的场景路径，必须是 ``ScenePathType`` 为 ``page`` 的路径。
     */
    getImagesInformation(scenePath: string): ImageInformation[];
    callbacksOn: Callbacks<any>["on"];
    callbacksOnce: Callbacks<any>["once"];
    callbacksOff: Callbacks<any>["off"];
    undo():number;
    redo():number;
    cleanCurrentScene(retainPpt?: boolean):void;
    callbacks: Callbacks<any>;
}
export type Logger = {
    readonly info: (...messages: any[]) => void;
    readonly warn: (...messages: any[]) => void;
    readonly error: (...messages: any[]) => void;
}
export type TeachingAidsPluginOptions = {
    /** 同步数据配置项 */
    syncOpt?: SyncOpt;
    /** 画布配置项 */
    canvasOpt?: CanvasOpt;
}
/** attributes 会被实时同步 */
export interface TeachingAidsPluginAttributes {
    [key: string]: ISerializableStorageViewData | ISerializableEventData;
}
export enum DisplayStateEnum {
    pedding = 0,
    mounted = 1,
    update = 2,
    unmounted = 3,
}
export enum EStrokeType {
    Normal = 0,
    Stroke,
    Dotted,
    LongDotted
}
export enum ShapeType {
    /**
     * 三角形 
     */
    Triangle = "triangle",
    /**
     * 菱形 
     */
    Rhombus = "rhombus",
    /**
     * 五角星 
     */
    Pentagram = "pentagram",
    /**
     * 说话泡泡 
     */
    SpeechBalloon = "speechBalloon",
    /** 星形 */
    Star = "star",
    /** 多边形 */
    Polygon = "polygon"
}
export type MemberState = _MemberState & {
    /** 是否开启笔锋 */
    strokeType?: EStrokeType;
    /** 是否删除整条线段 */
    isLine?: boolean;
    /** 线框透明度 */
    strokeOpacity?: number;
    /** 是否开启激光笔 */
    useLaserPen?: boolean;
    /** 激光笔保持时间, second */
    duration?: number;
    /** 是否使用新铅笔教具 */
    useNewPencil?: boolean;
    /** 填充样式 */
    fillColor?: Color;
    /** 填充透明度 */
    fillOpacity?: number;
    /**
     * 使用 ``shape`` 教具时，绘制图形的具体类型 
     */
    shapeType?: ShapeType;
    /** 多边形顶点数 */
    vertices?:number;
    /** 多边形向内顶点步长 */
    innerVerticeStep?:number;
    /** 多边形向内顶点与外顶点半径比率 */
    innerRatio?: number;
    /** 文字透明度 */
    textOpacity?: number;
    /** 文字背景颜色  */
    textBgColor?: Color;
    /** 文字背景颜色透明度 */
    textBgOpacity?: number;
    /** 水平对齐方式 */
    textAlign?: "left" | "center" | "right";
    /** 垂直对齐方式 */
    verticalAlign?: "top" | "middle" | "bottom";
    /** 位置 */
    placement?: SpeechBalloonPlacement;
}

export type SyncOpt = {
    /** 同步间隔 */
    interval?: number;
}

export type CanvasOpt = {
    /** 画布上下文类型 */
    contextType: ECanvasContextType,
}

export enum EmitEventType {
    /** 无 */
    None = 'None',
    /** 显示悬浮栏 */
    ShowFloatBar = 'ShowFloatBar',
    /** 设置悬浮栏层级 */
    ZIndexFloatBar = 'ZIndexFloatBar',
    /** 删除节点 */
    DeleteNode = 'DeleteNode',
    /** 复制节点 */
    CopyNode = 'CopyNode',
    /** 激活层级设置 */
    ZIndexActive = 'ZIndexActive',
    /** 设置节点层级 */
    ZIndexNode = 'ZIndexNode',
    /** 旋转节点 */
    RotateNode = 'RotateNode',
    /** 设置节点颜色 */
    SetColorNode = 'SetColorNode',
    /** 移动节点 */
    TranslateNode = 'TranslateNode',
    /** 拉伸节点 */
    ScaleNode = 'ScaleNode',
    /** 原始事件 */
    OriginalEvent = 'OriginalEvent',
    /** 创建canvas */
    CreateScene = 'CreateScene',
    /** 激活cursor */
    ActiveCursor = 'ActiveCursor',
    /** 移动cursor */
    MoveCursor = 'MoveCursor',
    /** 控制editor */
    CommandEditor = 'CommandEditor',
    /** 设置editor */
    SetEditorData = 'SetEditorData',
    /** 设置文字样式 */
    SetFontStyle = 'SetFontStyle',
    /** 设置坐标 */
    SetPoint = 'SetPoint',
    /** 设置是否锁定 */
    SetLock = 'SetLock',
    /** 设置shape模型的配置项 */
    SetShapeOpt = 'SetShapeOpt'
}

export enum InternalMsgEmitterType {
    DisplayState = 'DisplayState',
    FloatBar = 'FloatBar',
    CanvasSelector = 'CanvasSelector',
    MainEngine = 'MainEngine',
    DisplayContainer = 'DisplayContainer',
    Cursor = 'Cursor',
    TextEditor = 'TextEditor',
    BindMainView ='BindMainView',
    MountMainView ='MountMainView',
    MountAppView ='MountAppView',
}

export type InternalEventValue = {
    id: string;
    value?: boolean | number[]
}

export enum ActiveContainerType {
    MainView,
    Plugin,
    Both
}
export type SpeechBalloonPlacement = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

export type TeleBoxState = "normal" | "minimized" | "maximized"
