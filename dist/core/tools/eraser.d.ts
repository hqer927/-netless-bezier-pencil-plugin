import { Group } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, BaseNodeMapItem } from "../types";
import { Vec2d } from "../utils/primitives/Vec2d";
export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
type CurNodeMapItem = {
    name: string;
    rect: IRectType;
    polyline: Vec2d[];
    opt: BaseShapeOptions;
    toolsType: EToolsKey;
};
export declare class EraserShape extends BaseShapeTool {
    static SafeBorderPadding: number;
    updataOptService(): IRectType | undefined;
    private static readonly eraserSizes;
    protected syncTimestamp: number;
    readonly toolsType: EToolsKey;
    protected tmpPoints: Array<number>;
    protected workOptions: EraserOptions;
    worldPosition: [number, number];
    worldScaling: [number, number];
    eraserRect: IRectType | undefined;
    eraserPolyline?: [number, number, number, number];
    curNodeMap: Map<string, CurNodeMapItem>;
    constructor(workOptions: EraserOptions, fullLayer: Group);
    computNodeMap(nodeMaps: Map<string, BaseNodeMapItem>): void;
    updataNodeMap(key: string, value: {
        name: string;
        toolsType: EToolsKey;
        op: number[];
        rect: IRectType;
        opt: BaseShapeOptions;
    }): void;
    combineConsume(): undefined;
    private createEraserRect;
    consumeService(): IRectType | undefined;
    setWorkOptions(setWorkOptions: EraserOptions): void;
    private computRectCenterPoints;
    private isNear;
    consume(props: {
        data: IWorkerMessage;
        nodeMaps: Map<string, BaseNodeMapItem>;
    }): IMainMessage;
    private cutPolyline;
    private isSamePoint;
    private translateIntersect;
    private remove;
    consumeAll(props: {
        data: IWorkerMessage;
        nodeMaps: Map<string, BaseNodeMapItem>;
    }): IMainMessage;
    clearTmpPoints(): void;
}
export {};
