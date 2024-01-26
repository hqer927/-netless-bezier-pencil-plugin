import type { Group } from "spritejs";
import { SubLocalWork } from "../base";
import { EToolsKey } from "../enum";
import { BaseShapeOptions, BaseShapeTool } from "../tools";
import { IWorkerMessage, IMainMessage, IBatchMainMessage, IworkId, IUpdateNodeOpt, BaseNodeMapItem } from "../types";
import { EmitEventType } from "../../plugin/types";
import { SubServiceWorkForWorker } from "./service";
export declare class SubLocalWorkForWorker extends SubLocalWork {
    _post: (msg: IBatchMainMessage) => Promise<void>;
    workShapes: Map<IworkId, BaseShapeTool>;
    private combineUnitTime;
    private combineTimerId?;
    private drawCount;
    private effectSelectNodeData;
    constructor(curNodeMap: Map<string, BaseNodeMapItem>, layer: Group, drawLayer: Group, postFun: (msg: IBatchMainMessage) => Promise<void>);
    private drawPencilCombine;
    private drawSelector;
    private drawEraser;
    private drawPencil;
    private drawPencilFull;
    consumeDraw(data: IWorkerMessage, serviceWork: SubServiceWorkForWorker): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage, serviceWork: SubServiceWorkForWorker): IMainMessage | undefined;
    updateSelector(param: {
        updateSelectorOpt: IUpdateNodeOpt;
        willRefreshSelector?: boolean;
        willSyncService?: boolean;
        willSerializeData?: boolean;
        selectStore?: Map<string, {
            ops?: string;
            opt?: BaseShapeOptions;
            updateNodeOpt?: IUpdateNodeOpt;
            toolsType?: EToolsKey;
        }>;
        emitEventType?: EmitEventType;
        isSync?: boolean;
    }): Promise<IMainMessage | undefined>;
    blurSelector(): void;
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt' | 'toolsType'>): BaseShapeTool | undefined;
    consumeFull(data: IWorkerMessage): void;
    updateNode(param: {
        workId: IworkId;
        updateNodeOpt: IUpdateNodeOpt;
        willRefresh?: boolean;
        willSyncService?: boolean;
    }): void;
    removeWork(data: IWorkerMessage): void;
    runReverseSelectWork(data: IWorkerMessage): void;
    updateFullSelectWork(data: IWorkerMessage): void;
    colloctEffectSelectWork(data: IWorkerMessage): IWorkerMessage | undefined;
    private runEffectSelectWork;
}
