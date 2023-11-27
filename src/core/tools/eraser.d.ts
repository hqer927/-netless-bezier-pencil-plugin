import { Layer } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export declare class EraserShape extends BaseShapeTool {
    protected syncTimestamp: number;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<number>;
    protected workOptions: EraserOptions;
    private removeIds;
    constructor(workOptions: EraserOptions, fullLayer: Layer);
    combineConsume(): undefined;
    consumeService(): IRectType | undefined;
    setWorkOptions(setWorkOptions: EraserOptions): void;
    consume(data: IWorkerMessage): IMainMessage;
    private remove;
    consumeAll(data: IWorkerMessage): IMainMessage;
    clearTmpPoints(): void;
}
