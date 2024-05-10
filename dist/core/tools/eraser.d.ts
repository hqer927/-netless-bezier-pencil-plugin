import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import type { ServiceWorkForFullWorker } from "../worker/fullWorkerService";
export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export declare class EraserShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    readonly serviceWork?: ServiceWorkForFullWorker;
    private static readonly eraserSizes;
    protected tmpPoints: Array<number>;
    protected workOptions: EraserOptions;
    worldPosition: [number, number];
    worldScaling: [number, number];
    eraserRect: IRectType | undefined;
    eraserPolyline?: [number, number, number, number];
    constructor(props: BaseShapeToolProps, serviceWork?: ServiceWorkForFullWorker);
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
    }): IMainMessage;
    consumeAll(props: {
        data: IWorkerMessage;
    }): IMainMessage;
    clearTmpPoints(): void;
    private getUnLockNodeMap;
}
