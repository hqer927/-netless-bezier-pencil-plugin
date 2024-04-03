import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import { EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { VNodeManager } from "../worker/vNodeManager";
import { SpeechBalloonPlacement } from "../../plugin/types";
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
    private computDrawPoints;
    private updateTempPoints;
    consumeService(props: {
        op: number[];
        isFullWork: boolean;
    }): IRectType | undefined;
    clearTmpPoints(): void;
}
