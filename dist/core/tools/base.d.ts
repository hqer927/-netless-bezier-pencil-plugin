import { Point2d } from "../utils/primitives/Point2d";
import { EScaleType, EToolsKey } from "../enum";
import { BaseNodeMapItem, IMainMessage, IRectType, IUpdateNodeOpt, IWorkerMessage } from "../types";
import { Group } from "spritejs";
import { VNodeManager } from "../worker/vNodeManager";
import { ShapeNodes, ShapeOptions } from "./utils";
import { TextOptions } from "../../component/textEditor/types";
export interface BaseShapeOptions {
    isOpacity?: boolean;
    fontColor?: string;
    fontBgColor?: string;
    strokeColor?: string;
    fillColor?: string;
    vertex?: string;
    fragment?: string;
    syncUnitTime?: number;
    zIndex?: number;
    scale?: [number, number];
    rotate?: number;
    thickness?: number;
    textOpt?: TextOptions;
    translate?: [number, number];
}
export interface BaseShapeToolProps {
    vNodes: VNodeManager;
    toolsOpt: ShapeOptions;
    fullLayer: Group;
    drawLayer?: Group;
}
export declare abstract class BaseShapeTool {
    static SafeBorderPadding: number;
    protected abstract tmpPoints: Array<Point2d | number>;
    readonly abstract toolsType: EToolsKey;
    readonly abstract canRotate: boolean;
    readonly abstract scaleType: EScaleType;
    syncUnitTime: number;
    vNodes: VNodeManager;
    protected drawLayer?: Group;
    protected fullLayer: Group;
    protected workId: number | string | undefined;
    protected abstract workOptions: ShapeOptions;
    constructor(props: BaseShapeToolProps);
    /** 消费本地数据，返回绘制结果 */
    abstract consume(props: {
        data: IWorkerMessage;
        isFullWork?: boolean;
        isClearAll?: boolean;
        isSubWorker?: boolean;
    }): IMainMessage;
    /** 消费本地完整数据，返回绘制结果 */
    abstract consumeAll(props: {
        data?: IWorkerMessage;
        hoverId?: string;
    }): IMainMessage;
    /** 消费服务端数据，返回绘制结果 */
    abstract consumeService(props: {
        op: number[];
        isFullWork: boolean;
        replaceId?: string;
        isClearAll?: boolean;
        isTemp?: boolean;
    }): IRectType | undefined;
    /** 清除临时数据 */
    abstract clearTmpPoints(): void;
    /** 设置工作id */
    setWorkId(id: number | string | undefined): void;
    getWorkId(): string | number | undefined;
    /** 获取工作选项配置 */
    getWorkOptions(): ShapeOptions;
    /** 设置工作选项配置 */
    setWorkOptions(workOptions: BaseShapeOptions): void;
    /** 更新服务端同步配置,返回绘制结果 */
    updataOptService(opt?: IUpdateNodeOpt): IRectType | undefined;
    static updateNodeOpt(param: {
        node: ShapeNodes;
        opt: IUpdateNodeOpt;
        vNodes: VNodeManager;
        willSerializeData?: boolean;
        targetNode?: BaseNodeMapItem;
    }): IRectType | undefined;
    static getCenterPos(r: IRectType, layer: Group): [number, number];
    static getRectFromLayer(layer: Group, name: string): IRectType | undefined;
}
