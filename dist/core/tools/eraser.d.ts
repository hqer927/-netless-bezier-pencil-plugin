import { Group } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, BaseNodeMapItem } from "../types";
export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export declare class EraserShape extends BaseShapeTool {
    updataOptService(): IRectType | undefined;
    protected syncTimestamp: number;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<number>;
    protected workOptions: EraserOptions;
    private removeIds;
    worldPosition: [number, number];
    worldScaling: [number, number];
    constructor(workOptions: EraserOptions, fullLayer: Group);
    combineConsume(): undefined;
    consumeService(): IRectType | undefined;
    computNodeMap(nodeMaps: Map<string, BaseNodeMapItem>): void;
    setWorkOptions(setWorkOptions: EraserOptions): void;
    consume(props: {
        data: IWorkerMessage;
        nodeMaps: Map<string, BaseNodeMapItem>;
    }): IMainMessage;
    private remove;
    consumeAll(props: {
        data: IWorkerMessage;
        nodeMaps: Map<string, BaseNodeMapItem>;
    }): IMainMessage;
    clearTmpPoints(): void;
}
