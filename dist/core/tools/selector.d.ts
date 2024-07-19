import { Scene } from "spritejs";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt, IServiceWorkItem } from "../types";
import { Point2d } from "../utils/primitives/Point2d";
import type { VNodeManager } from "../vNodeManager";
import { TextOptions } from "../../component/textEditor/types";
import { LocalWorkForFullWorker } from "../worker/fullWorkerLocal";
import { ShapeOptType } from "../../displayer/types";
import type { SubLocalThread } from "../mainThread/subLocalThread";
export interface SelectorOptions extends BaseShapeOptions {
}
export declare class SelectorShape extends BaseShapeTool {
    readonly toolsType: EToolsKey;
    static selectorId: string;
    static selectorBorderId: string;
    protected tmpPoints: Array<Point2d>;
    protected workOptions: BaseShapeOptions;
    vNodes: VNodeManager;
    selectIds?: string[];
    selectorColor?: string;
    strokeColor?: string;
    fillColor?: string;
    oldSelectRect?: IRectType;
    canRotate: boolean;
    canTextEdit: boolean;
    canLock: boolean;
    scaleType: EScaleType;
    toolsTypes?: EToolsKey[];
    shapeOpt?: ShapeOptType;
    textOpt?: TextOptions;
    isLocked?: boolean;
    constructor(props: BaseShapeToolProps);
    private computSelector;
    private updateTempPoints;
    private drawSelector;
    private draw;
    private getSelecteorInfo;
    getChildrenPoints(): [number, number][] | undefined;
    consume(props: {
        data: IWorkerMessage;
    }): {
        type: EPostMessageType;
    } | {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        type: EPostMessageType;
        dataType: EDataType;
        rect: IRectType | undefined;
        selectIds: never[] | string[];
        selectRect: IRectType | undefined;
        selectorColor: string | undefined;
        strokeColor: string | undefined;
        fillColor: string | undefined;
        textOpt: TextOptions | undefined;
        canTextEdit: boolean;
        canRotate: boolean;
        canLock: boolean;
        scaleType: EScaleType;
        willSyncService: boolean;
        points: [number, number][] | undefined;
        isLocked: boolean | undefined;
        toolsTypes: EToolsKey[] | undefined;
        shapeOpt: ShapeOptType | undefined;
    };
    consumeAll(): {
        workId: string;
        toolsType: EToolsKey;
        opt: import("./utils").ShapeOptions;
        type: EPostMessageType;
        dataType: EDataType;
        rect: IRectType | undefined;
        selectIds: string[] | undefined;
        selectorColor: string | undefined;
        selectRect: IRectType | undefined;
        strokeColor: string | undefined;
        fillColor: string | undefined;
        textOpt: TextOptions | undefined;
        canTextEdit: boolean;
        canRotate: boolean;
        canLock: boolean;
        scaleType: EScaleType;
        willSyncService: boolean;
        points: [number, number][] | undefined;
        isLocked: boolean | undefined;
        toolsTypes: EToolsKey[] | undefined;
        shapeOpt: ShapeOptType | undefined;
    } | {
        type: EPostMessageType;
    };
    consumeService(): undefined;
    clearTmpPoints(): void;
    clearSelectData(): void;
    private selectSingleTool;
    private unSelectedAllIds;
    private unSelectedByIds;
    private selectedByIds;
    private getSelectorRect;
    isCanFillColor(toolsType?: EToolsKey): boolean;
    updateSelector(param: {
        updateSelectorOpt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        selectIds?: string[];
        willSerializeData?: boolean;
        worker?: LocalWorkForFullWorker | SubLocalThread;
        offset?: [number, number];
        scene?: Scene;
        isMainThread?: boolean;
    }): Promise<IMainMessage | undefined>;
    blurSelector(): {
        type: EPostMessageType;
        dataType: EDataType;
        rect: IRectType | undefined;
        selectIds: never[];
        willSyncService: boolean;
    };
    getRightServiceId(serviceWorkId: string): string;
    selectServiceNode(workId: string, workItem: Pick<IServiceWorkItem, 'selectIds'>, isService: boolean): IRectType | undefined;
    reRenderSelector(): IRectType | undefined;
    updateSelectIds(nextSelectIds: string[]): {
        bgRect: IRectType | undefined;
        selectRect: IRectType | undefined;
    };
    cursorHover(point: [number, number]): {
        type: EPostMessageType;
        dataType: EDataType;
        rect: IRectType | undefined;
        selectorColor: string | undefined;
        willSyncService: boolean;
    } | undefined;
    cursorBlur(): void;
}
