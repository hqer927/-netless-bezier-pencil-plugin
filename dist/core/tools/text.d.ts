import { Group, Label, Polyline, Sprite } from "spritejs";
import { BaseNodeMapItem, IRectType, IUpdateNodeOpt } from "../types";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeTool, BaseShapeToolProps } from "./base";
import { TextOptions } from "../../component/textEditor";
import { ShapeNodes } from "./utils";
import { VNodeManager } from "../vNodeManager";
export declare class TextShape extends BaseShapeTool {
    static textImageSnippetSize: number;
    static SafeBorderPadding: number;
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: TextOptions;
    oldRect?: IRectType;
    constructor(props: BaseShapeToolProps);
    consume(): {
        type: EPostMessageType;
    };
    consumeAll(): {
        type: EPostMessageType;
    };
    consumeService(): IRectType | undefined;
    private draw;
    consumeServiceAsync(props: {
        isFullWork: boolean;
        replaceId?: string;
        isDrawLabel?: boolean;
    }): Promise<IRectType | undefined>;
    updataOptService(): IRectType | undefined;
    updataOptServiceAsync(updateNodeOpt: IUpdateNodeOpt, isDrawLabel?: boolean): Promise<IRectType | undefined>;
    clearTmpPoints(): void;
    static getSafetySnippetRatio(layer: Group): number;
    static getSafetySnippetFontLength(fontSize: number): number;
    static createLabels(textOpt: TextOptions, layer: Group, groupRect: IRectType): Promise<{
        labels: (Group | Polyline | Sprite | Label)[];
        maxWidth: number;
    }>;
    static updateNodeOpt(param: {
        node: ShapeNodes;
        opt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        willSerializeData?: boolean;
        targetNode?: BaseNodeMapItem;
    }): IRectType | undefined;
    static getRectFromLayer(layer: Group, name: string): IRectType | undefined;
}
