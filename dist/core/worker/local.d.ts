import { SubLocalWork } from "../base";
import { BaseShapeTool } from "../tools";
import { IWorkerMessage, IMainMessage, IBatchMainMessage, IworkId } from "../types";
export declare class SubLocalWorkForWorker extends SubLocalWork {
    protected workShapes: Map<IworkId, BaseShapeTool>;
    private combineUnitTime;
    private combineTimerId?;
    private _post;
    private drawCount;
    constructor(layer: spritejs.Layer, drawLayer: spritejs.Layer, postFun: (msg: IBatchMainMessage) => void);
    private drawPencilCombine;
    private drawEraser;
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage): IMainMessage | undefined;
}
