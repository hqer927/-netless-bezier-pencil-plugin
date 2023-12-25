import { SubServiceWork } from "../base";
import { IServiceWorkItem, IWorkerMessage, IBatchMainMessage } from "../types";
import { Group } from "spritejs";
export declare class SubServiceWorkForWorker extends SubServiceWork {
    protected workShapes: Map<string, IServiceWorkItem>;
    protected animationId?: number | undefined;
    private selectorWorkShapes;
    _post: (msg: IBatchMainMessage) => void;
    private willRunEffectSelectorIds;
    private runEffectId?;
    private noAnimationRect;
    constructor(layer: Group, drawLayer: Group, postFun: (msg: IBatchMainMessage) => void);
    private activeWorkShape;
    private activeSelectorShape;
    private setNodeKey;
    private computNextAnimationIndex;
    private animationDraw;
    private runEffect;
    private runAnimation;
    consumeDraw(data: IWorkerMessage): undefined;
    consumeFull(data: IWorkerMessage): undefined;
    clearAllWorkShapesCache(): void;
    runSelectWork(data: IWorkerMessage): void;
    removeSelectWork(data: IWorkerMessage): void;
    private effectRunSelector;
    removeWork(data: IWorkerMessage): void;
    private getNodeRect;
}
