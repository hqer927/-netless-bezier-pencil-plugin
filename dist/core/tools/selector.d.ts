import { Group } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt, IServiceWorkItem, BaseNodeMapItem } from "../types";
import { Point2d } from "../utils/primitives/Point2d";
export interface SelectorOptions extends BaseShapeOptions {
}
type CurNodeMapItem = {
    name: string;
    rect: IRectType;
    color: string;
    pos: [number, number];
    rotate: number;
    scale: [number, number];
    opactiy: number;
};
export declare class SelectorShape extends BaseShapeTool {
    updataOptService(): IRectType | undefined;
    static selectorId: string;
    static selectorBorderId: string;
    protected tmpPoints: Array<Point2d>;
    toolsType: EToolsKey;
    protected workOptions: BaseShapeOptions;
    protected syncTimestamp: number;
    curNodeMap: Map<string, CurNodeMapItem>;
    selectIds?: string[];
    oldRect?: IRectType;
    static SelectBorderPadding: number;
    nodeColor?: string;
    nodeOpactiy?: number;
    oldSelectRect?: IRectType;
    constructor(workOptions: SelectorOptions, fullLayer: Group, drawLayer?: Group);
    computNodeMap(nodeMaps: Map<string, BaseNodeMapItem>): void;
    private computSelector;
    private updateTempPoints;
    private draw;
    consume(props: {
        data: IWorkerMessage;
        nodeMaps?: Map<string, BaseNodeMapItem>;
    }): IMainMessage;
    consumeAll(): IMainMessage;
    consumeService(): undefined;
    combineConsume(): undefined;
    clearTmpPoints(): void;
    clearSelectData(): void;
    private backToFullLayer;
    private sealToDrawLayer;
    private updateSelectorSize;
    private updateSelectorRect;
    private getSelectorRect;
    updateSelector(param: {
        updateSelectorOpt: IUpdateNodeOpt;
        selectIds?: string[];
    }): IMainMessage | undefined;
    blurSelector(nodeMaps: Map<string, BaseNodeMapItem>): {
        type: EPostMessageType;
        dataType: EDataType;
        rect: IRectType | undefined;
        selectIds: never[];
        willSyncService: boolean;
    };
    private getRightServiceId;
    private drawSelector;
    selectServiceNode(workId: string, workItem: Pick<IServiceWorkItem, 'selectIds'>, curNodeMap: Map<string, BaseNodeMapItem>): IRectType | undefined;
    removeService(): IRectType | undefined;
    getSelector(nodeMaps: Map<string, BaseNodeMapItem>): IRectType | undefined;
    updateSelectIds(nextSelectIds: string[], nodeMaps: Map<string, BaseNodeMapItem>): {
        bgRect: IRectType | undefined;
        selectRect: IRectType | undefined;
    };
}
export {};
