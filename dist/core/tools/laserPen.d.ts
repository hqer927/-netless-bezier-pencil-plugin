import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import { EStrokeType } from "../../plugin/types";
import { Point2d } from "../utils/primitives/Point2d";
export interface LaserPenOptions extends BaseShapeOptions {
    thickness: number;
    duration: number;
    strokeColor: string;
    strokeType: Omit<EStrokeType, 'Stroke'>;
}
export declare class LaserPenShape extends BaseShapeTool {
    readonly toolsType: EToolsKey;
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    protected syncTimestamp: number;
    private syncIndex;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: LaserPenOptions;
    private consumeIndex;
    constructor(props: BaseShapeToolProps);
    combineConsume(): undefined;
    setWorkOptions(workOptions: LaserPenOptions): void;
    consume(props: {
        data: IWorkerMessage;
        isFullWork: boolean;
        isSubWorker?: boolean;
    }): IMainMessage;
    consumeAll(): IMainMessage;
    clearTmpPoints(): void;
    consumeService(props: {
        op: number[];
        isFullWork?: boolean;
        replaceId?: string;
    }): IRectType | undefined;
    private computDotStroke;
    private updateTempPoints;
    private draw;
    private getTaskPoints;
    removeLocal(): undefined;
    removeService(key: string): IRectType | undefined;
}
