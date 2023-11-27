import { Point2d } from "../utils/primitives/Point2d";
import { EPostMessageType, EToolsKey } from "../enum";
import { IMainMessage, IRectType, IWorkerMessage } from "../types";
import { Layer } from "spritejs";
export interface BaseShapeOptions {
    color: string;
    opacity?: number;
    vertex?: string;
    fragment?: string;
}
export interface CombineConsumeResult {
    type: EPostMessageType;
    rect: IRectType | undefined;
    consumeIndex: number;
}
export declare abstract class BaseShapeTool {
    protected abstract tmpPoints: Array<Point2d | number>;
    readonly abstract toolsType: EToolsKey;
    protected abstract workOptions: BaseShapeOptions;
    protected abstract syncTimestamp: number;
    syncUnitTime: number;
    protected drawLayer?: Layer;
    protected fullLayer: Layer;
    protected workId: number | string | undefined;
    constructor(fullLayer: Layer, drawLayer?: Layer);
    setWorkId(id: number | string | undefined): void;
    getWorkId(): string | number | undefined;
    getWorkOptions(): BaseShapeOptions;
    abstract setWorkOptions(workOptions: BaseShapeOptions): void;
    abstract consume(data: IWorkerMessage, isFullWork?: boolean): IMainMessage;
    abstract consumeAll(data?: IWorkerMessage): IMainMessage;
    abstract consumeService(data: number[], isFullWork?: boolean): IRectType | undefined;
    abstract combineConsume(): IMainMessage | undefined;
    abstract clearTmpPoints(): void;
}
