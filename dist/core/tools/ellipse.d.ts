import { IWorkerMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";
export interface EllipseOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor: string;
    fillColor: string;
}
export declare class EllipseShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: EllipseOptions;
    oldRect?: IRectType;
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
        op: number[];
        isSync: boolean;
        index: number;
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        type: EPostMessageType;
        dataType: EDataType;
    } | {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: IRectType | undefined;
        type: EPostMessageType;
        dataType: EDataType;
    };
    consumeAll(): {
        type: EPostMessageType;
        removeIds: string[];
    } | {
        ops: string;
        isSync: boolean;
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: IRectType;
        type: EPostMessageType;
        dataType: EDataType;
        removeIds?: undefined;
    };
    private draw;
    private computDrawPoints;
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
