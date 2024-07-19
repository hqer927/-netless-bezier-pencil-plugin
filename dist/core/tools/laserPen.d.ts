import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IRectType } from "../types";
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
    }): {
        type: EPostMessageType;
    } | {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        type: EPostMessageType;
        dataType: EDataType;
        op: number[] | undefined;
        index: number | undefined;
    };
    consumeAll(): {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        rect: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | undefined;
        type: EPostMessageType;
        dataType: EDataType;
        ops: string;
        index: number;
    };
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
