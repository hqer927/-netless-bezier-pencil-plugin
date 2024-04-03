import { Group } from "spritejs";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EStrokeType } from "../../plugin/types";
import { ShapeNodes } from "./utils";
import { VNodeManager } from "../worker/vNodeManager";
export interface PencilOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor: string;
    strokeType: EStrokeType;
}
export declare class PencilShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    private syncTimestamp;
    private syncIndex;
    protected tmpPoints: Array<Point2d>;
    private MAX_REPEAR;
    /** 合并原始点的灵敏度 */
    private uniThickness;
    protected workOptions: PencilOptions;
    private centerPos;
    constructor(props: BaseShapeToolProps);
    /** 批量合并消费本地数据,返回绘制结果 */
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
    static updateNodeOpt(param: {
        node: ShapeNodes;
        opt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        willSerializeData?: boolean;
    }): IRectType | undefined;
    static getRectFromLayer(layer: Group, name: string): IRectType | undefined;
}
