import { SubLocalWork } from "../base";
import { BaseShapeTool } from "../tools";
import { IWorkerMessage, IMainMessage, IworkId, IBatchMainMessage } from "../types";
export declare class SubLocalDrawWorkForWorker extends SubLocalWork {
    protected workShapes: Map<IworkId, BaseShapeTool>;
    protected combineDrawTimer?: number;
    private drawCount;
    private _post;
    private animationWorkRects?;
    private animationId?;
    private closeAnimationTime;
    constructor(layer: spritejs.Layer, postFun: (msg: IBatchMainMessage) => void);
    private runLaserPenAnimation;
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage): undefined;
}
