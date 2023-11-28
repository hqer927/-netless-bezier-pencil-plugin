import { Layer } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import { EStrokeType } from "../../plugin/types";
export interface PencilOptions extends BaseShapeOptions {
    thickness: number;
    strokeType: EStrokeType;
}
export declare class PencilShape extends BaseShapeTool {
    readonly toolsType: EToolsKey;
    protected syncTimestamp: number;
    private syncIndex;
    protected tmpPoints: Array<Point2d>;
    private MAX_REPEAR;
    /** 合并原始点的灵敏度 */
    private uniThickness;
    protected workOptions: PencilOptions;
    constructor(workOptions: PencilOptions, fullLayer: Layer, drawlayer?: Layer);
    combineConsume(): IMainMessage | undefined;
    setWorkOptions(workOptions: PencilOptions): void;
    consume(data: IWorkerMessage, isFullWork?: boolean): IMainMessage;
    consumeAll(data?: IWorkerMessage): IMainMessage;
    clearTmpPoints(): void;
    consumeService(op: number[], isFullWork?: boolean): IRectType | undefined;
    private transformDataAll;
    private draw;
    private computDrawPoints;
    private computNomal;
    private computStroke;
    private computLineStroke;
    private computDotStroke;
    private transformData;
    private computRadius;
    private getTaskPoints;
    private updateTempPointsWithPressure;
    private updateTempPoints;
    private updateTempPointsWithPressureWhenDone;
}
