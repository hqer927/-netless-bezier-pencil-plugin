/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layer } from "spritejs";
import { EToolsKey, IWorkerMessage, IMainMessage, IRectType } from "../..";
import { Point2d } from "../../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool } from "../base";

export interface SelectorOptions extends BaseShapeOptions {

}
export class SelectorShape extends BaseShapeTool {
    protected tmpPoints: (number | Point2d)[] = [];
    toolsType: EToolsKey = EToolsKey.Selector;
    protected workOptions: BaseShapeOptions;
    protected syncTimestamp: number;
    constructor(workOptions: SelectorOptions, fullLayer: Layer, drawlayer?: Layer) {
        super(fullLayer, drawlayer);
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
    }
    consume(data: IWorkerMessage, isFullWork?: boolean | undefined): IMainMessage {
        
        throw new Error("Method not implemented.");
    }
    consumeAll(data?: IWorkerMessage | undefined): IMainMessage {
        throw new Error("Method not implemented.");
    }
    consumeService(data: number[], isFullWork?: boolean | undefined): IRectType | undefined {
        throw new Error("Method not implemented.");
    }
    combineConsume(): IMainMessage | undefined {
        throw new Error("Method not implemented.");
    }
    clearTmpPoints(): void {
        throw new Error("Method not implemented.");
    }


}