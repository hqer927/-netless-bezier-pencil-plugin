import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IRectType, IworkId } from "../types";
import type { ServiceThreadSubWork } from "./utils";
export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export declare class EraserShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    readonly serviceWork?: ServiceThreadSubWork;
    private static readonly eraserSizes;
    protected tmpPoints: Array<number>;
    protected workOptions: EraserOptions;
    worldPosition: [number, number];
    worldScaling: [number, number];
    eraserRect: IRectType | undefined;
    eraserPolyline?: [number, number, number, number];
    constructor(props: BaseShapeToolProps, serviceWork?: ServiceThreadSubWork);
    combineConsume(): undefined;
    consumeService(): IRectType | undefined;
    setWorkOptions(setWorkOptions: EraserOptions): void;
    private createEraserRect;
    private computRectCenterPoints;
    private isNear;
    private cutPolyline;
    private isSamePoint;
    private translateIntersect;
    private isLineEraser;
    private remove;
    consume(props: {
        data: IWorkerMessage;
    }): {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        type: EPostMessageType;
        rect?: undefined;
        removeIds?: undefined;
        newWorkDatas?: undefined;
    } | {
        type: EPostMessageType;
        rect: IRectType;
        removeIds: string[];
        newWorkDatas: Map<string, {
            op: number[];
            opt: BaseShapeOptions;
            workId: IworkId;
            toolsType: EToolsKey;
        }>;
    };
    consumeAll(props: {
        data: IWorkerMessage;
    }): {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        type: EPostMessageType;
        rect?: undefined;
        removeIds?: undefined;
        newWorkDatas?: undefined;
    } | {
        type: EPostMessageType;
        rect: IRectType;
        removeIds: string[];
        newWorkDatas: Map<string, {
            op: number[];
            opt: BaseShapeOptions;
            workId: IworkId;
            toolsType: EToolsKey;
        }>;
    };
    clearTmpPoints(): void;
    private getUnLockNodeMap;
}
