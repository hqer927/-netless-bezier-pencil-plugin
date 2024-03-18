import { Point2d } from "../utils/primitives/Point2d";
import { EPostMessageType, EToolsKey } from "../enum";
import { BaseNodeMapItem, IMainMessage, IRectType, IUpdateNodeOpt, IWorkerMessage } from "../types";
import { Group } from "spritejs";

export interface BaseShapeOptions {
    color: string;
    opacity?: number;
    vertex?: string;
    fragment?: string;
    syncUnitTime?: number;
    zIndex?: number;
    scale?:[number,number];
    rotate?:number;
}

export interface CombineConsumeResult {
    type: EPostMessageType;
    rect: IRectType | undefined;
    consumeIndex: number;
}

export abstract class BaseShapeTool {
    protected abstract tmpPoints: Array<Point2d | number>;
    readonly abstract toolsType: EToolsKey;
    protected abstract workOptions: BaseShapeOptions;
    protected abstract syncTimestamp: number;
    public syncUnitTime: number = 1000;
    protected drawLayer?: Group;
    protected fullLayer: Group;
    protected workId: number | string | undefined;
    constructor(fullLayer: Group, drawLayer?:Group) {
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    public setWorkId(id: number | string | undefined) {
        this.workId = id;
    }
    public getWorkId(){
        return this.workId;
    }
    public getWorkOptions(){
        return this.workOptions;
    }
    setWorkOptions(workOptions: BaseShapeOptions) {
        this.workOptions = workOptions;
        this.syncUnitTime = workOptions.syncUnitTime || this.syncUnitTime;
    }
    abstract consume(props:{data: IWorkerMessage, 
        isFullWork?:boolean, 
        nodeMaps?: Map<string, BaseNodeMapItem>, 
        isClearAll?:boolean,
        isSubWorker?:boolean,
    }): IMainMessage;
    abstract consumeAll(props:{data?: IWorkerMessage, nodeMaps?: Map<string, BaseNodeMapItem>}): IMainMessage;
    abstract consumeService(props:{
        op: number[];
        isFullWork:boolean;
        replaceId?: string;
        isClearAll?: boolean;
    }): IRectType | undefined;
    abstract updataOptService(opt?: IUpdateNodeOpt): IRectType | undefined;
    abstract combineConsume(): IMainMessage | undefined;
    abstract clearTmpPoints():void;
}

export interface ShapeStateInfo {
    willClear: boolean;
}