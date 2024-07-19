import { IWorkerMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";
export interface PolygonOptions extends BaseShapeOptions {
    thickness: number;
    vertices: number;
    strokeColor: string;
    fillColor: string;
}
export declare class PolygonShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: PolygonOptions;
    oldRect?: IRectType;
    private syncTimestamp;
    constructor(props: BaseShapeToolProps);
    consume(props: {
        data: IWorkerMessage;
        isFullWork?: boolean;
        isClearAll?: boolean;
        isSubWorker?: boolean;
        isMainThread?: boolean;
    }): {
        type: EPostMessageType;
    } | {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        type: EPostMessageType;
        dataType: EDataType;
        op: number[];
        isSync: boolean;
        index: number;
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
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: IRectType;
        type: EPostMessageType;
        dataType: EDataType;
        ops: string;
        isSync: boolean;
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
