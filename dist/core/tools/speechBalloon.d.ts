import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../worker/vNodeManager";
import type { SpeechBalloonPlacement } from "../../plugin/types";
import { ShapeNodes } from "./utils";
export interface SpeechBalloonOptions extends BaseShapeOptions {
    thickness: number;
    placement: SpeechBalloonPlacement;
    strokeColor: string;
    fillColor: string;
}
export declare class SpeechBalloonShape extends BaseShapeTool {
    readonly canRotate: boolean;
    readonly scaleType: EScaleType;
    readonly toolsType: EToolsKey;
    readonly ratio: number;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: SpeechBalloonOptions;
    oldRect?: IRectType;
    private syncTimestamp;
    constructor(props: BaseShapeToolProps);
    consume(props: {
        data: IWorkerMessage;
        isFullWork?: boolean | undefined;
        isClearAll?: boolean | undefined;
        isSubWorker?: boolean | undefined;
    }): IMainMessage;
    consumeAll(props: {
        data?: IWorkerMessage | undefined;
        vNodes: VNodeManager;
    }): IMainMessage;
    private draw;
    private transformControlPoints;
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
