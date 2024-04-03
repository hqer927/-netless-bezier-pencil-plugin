import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../worker/vNodeManager";
import { ShapeNodes } from "./utils";
export interface StraightOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor: string;
}
export declare class StraightShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: StraightOptions;
    oldRect?: IRectType;
    private straightTipWidth;
    private syncTimestamp;
    constructor(props: BaseShapeToolProps);
    consume(props: {
        data: IWorkerMessage;
        isFullWork?: boolean | undefined;
        isClearAll?: boolean | undefined;
        isSubWorker?: boolean | undefined;
    }): IMainMessage;
    consumeAll(props: {
        data?: IWorkerMessage | undefined;
        vNodes: VNodeManager;
    }): IMainMessage;
    private draw;
    private computDrawPoints;
    private computFullPoints;
    private computDotPoints;
    private updateTempPoints;
    consumeService(props: {
        op: number[];
        isFullWork: boolean;
    }): IRectType | undefined;
    clearTmpPoints(): void;
    static updateNodeOpt(param: {
        node: ShapeNodes;
        opt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        willSerializeData?: boolean;
    }): IRectType | undefined;
}
