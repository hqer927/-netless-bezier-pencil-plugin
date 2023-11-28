import { Layer } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import { EStrokeType } from "../../plugin/types";
import { Point2d } from "../utils/primitives/Point2d";
export interface LaserPenOptions extends BaseShapeOptions {
    thickness: number;
    duration: number;
    strokeType: Omit<EStrokeType, 'Stroke'>;
}
export declare class LaserPenShape extends BaseShapeTool {
    protected syncTimestamp: number;
    private syncIndex;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: LaserPenOptions;
    constructor(workOptions: LaserPenOptions, fullLayer: Layer);
    combineConsume(): undefined;
    setWorkOptions(workOptions: LaserPenOptions): void;
    consume(data: IWorkerMessage, isUnDraw: boolean): IMainMessage;
    consumeAll(): IMainMessage;
    clearTmpPoints(): void;
    consumeService(op: number[]): IRectType | undefined;
    private computDotStroke;
    private updateTempPoints;
    private draw;
    private getTaskPoints;
}
