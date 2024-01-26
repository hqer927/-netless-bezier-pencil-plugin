import { Group } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
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
    static PencilBorderPadding: number;
    private centerPos;
    constructor(workOptions: PencilOptions, fullLayer: Group, drawlayer?: Group);
    combineConsume(): IMainMessage | undefined;
    setWorkOptions(workOptions: PencilOptions): void;
    consume(props: {
        data: IWorkerMessage;
        isFullWork?: boolean;
        isClearAll?: boolean;
        isSubWorker?: boolean;
    }): IMainMessage;
    consumeAll(props: {
        data?: IWorkerMessage;
    }): IMainMessage;
    clearTmpPoints(): void;
    consumeService(params: {
        op: number[];
        isFullWork?: boolean;
        replaceId?: string;
        isClearAll?: boolean;
    }): IRectType | undefined;
    private transformDataAll;
    private draw;
    private computDrawPoints;
    private computNomal;
    private computStroke;
    private computLineStroke;
    private computDotStroke;
    private transformData;
    /** 压力渐变公式 */
    private computRadius;
    private getMinZ;
    private getTaskPoints;
    private updateTempPointsWithPressure;
    private updateTempPoints;
    private updateTempPointsWithPressureWhenDone;
    updataOptService(opt?: IUpdateNodeOpt): IRectType | undefined;
}
