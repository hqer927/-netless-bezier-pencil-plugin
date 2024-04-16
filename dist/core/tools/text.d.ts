import { Group, Label, Polyline } from "spritejs";
import { BaseNodeMapItem, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeTool, BaseShapeToolProps } from "./base";
import { TextOptions } from "../../component/textEditor";
import { ShapeNodes } from "./utils";
import { VNodeManager } from "../worker/vNodeManager";
export declare class TextShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: TextOptions;
    oldRect?: IRectType;
    constructor(props: BaseShapeToolProps);
    consume(): IMainMessage;
    consumeAll(): IMainMessage;
    private draw;
    consumeService(props: {
        isFullWork: boolean;
        replaceId?: string;
        isDrawLabel?: boolean;
    }): IRectType | undefined;
    updataOptService(updateNodeOpt: IUpdateNodeOpt): IRectType | undefined;
    clearTmpPoints(): void;
    static getFontWidth(param: {
        text: string;
        ctx: OffscreenCanvasRenderingContext2D;
        opt: TextOptions;
        worldScaling: number[];
    }): number;
    static createLabels(textOpt: TextOptions, layer: Group): (Polyline | Label)[];
    static updateNodeOpt(param: {
        node: ShapeNodes;
        opt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        willSerializeData?: boolean;
        targetNode?: BaseNodeMapItem;
    }): IRectType | undefined;
    static getRectFromLayer(layer: Group, name: string): IRectType | undefined;
}
