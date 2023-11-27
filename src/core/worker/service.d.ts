import { SubServiceWork } from "../base";
import { IServiceWorkItem, IWorkerMessage, IBatchMainMessage } from "../types";
export declare class SubServiceWorkForWorker extends SubServiceWork {
    protected workShapes: Map<string, IServiceWorkItem>;
    protected animationId?: number | undefined;
    private _post;
    constructor(layer: spritejs.Layer, drawLayer: spritejs.Layer, postFun: (msg: IBatchMainMessage) => void);
    private activeWorkShape;
    private setNodeKey;
    private computNextAnimationIndex;
    private animationDraw;
    consumeDraw(data: IWorkerMessage): undefined;
    consumeFull(data: IWorkerMessage): undefined;
    clearAllWorkShapesCache(): void;
}
