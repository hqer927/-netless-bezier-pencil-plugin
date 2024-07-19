import { IWorkerMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";
export interface ArrowOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor: string;
}
export declare class ArrowShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: ArrowOptions;
    oldRect?: IRectType;
    private arrowTipWidth;
    private syncTimestamp;
    constructor(props: BaseShapeToolProps);
    consume(props: {
        data: IWorkerMessage;
        isFullWork?: boolean;
        isSubWorker?: boolean;
        isMainThread?: boolean;
    }): {
        type: EPostMessageType;
    } | {
        type: EPostMessageType;
        dataType: EDataType;
        op: number[];
        isSync: boolean;
        index: number;
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
    } | {
        type: EPostMessageType;
        dataType: EDataType;
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: IRectType | undefined;
    };
    consumeAll(): {
        type: EPostMessageType;
        removeIds: string[];
    } | {
        type: EPostMessageType;
        dataType: EDataType;
        ops: string;
        isSync: boolean;
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: IRectType;
        removeIds?: undefined;
    };
    private draw;
    private computDrawPoints;
    private computFullArrowPoints;
    private computTrianglePoints;
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
