import { Scene } from "spritejs";
import { IRectType, IUpdateNodeOpt, BaseNodeMapItem } from "../types";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";
export interface ImageOptions extends BaseShapeOptions {
    /** 图片的唯一识别符 */
    uuid: string;
    /** 图片中点在世界坐标系中的 x 坐标 */
    centerX: number;
    /** 图片中点在世界坐标系中的 y 坐标 */
    centerY: number;
    /** 图片中点在世界坐标系中的宽 */
    width: number;
    /** 图片中点在世界坐标系中的高 */
    height: number;
    /** 图片是否被锁定 */
    locked: boolean;
    /** 图片是否禁止非等比放缩 */
    uniformScale?: boolean;
    /** 是否以跨域方式加载图片 */
    crossOrigin?: boolean | string;
    /** 图片地址 */
    src: string;
}
export declare class ImageShape extends BaseShapeTool {
    readonly canRotate: boolean;
    scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: ImageOptions;
    oldRect?: IRectType;
    constructor(props: BaseShapeToolProps);
    consume(): {
        type: EPostMessageType;
    };
    consumeAll(): {
        type: EPostMessageType;
    };
    private draw;
    consumeService(): IRectType | undefined;
    consumeServiceAsync(props: {
        isFullWork: boolean;
        scene: Scene;
        replaceId?: string;
        isMainThread?: boolean;
    }): Promise<IRectType | undefined>;
    clearTmpPoints(): void;
    static getScaleType(opt: ImageOptions): EScaleType.all | EScaleType.proportional;
    static updateNodeOpt(param: {
        node: ShapeNodes;
        opt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        willSerializeData?: boolean;
        targetNode?: BaseNodeMapItem;
    }): IRectType | undefined;
}
