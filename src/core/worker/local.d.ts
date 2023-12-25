import { Group } from "spritejs";
import { SubLocalWork } from "../base";
import { EToolsKey } from "../enum";
import { BaseShapeOptions, BaseShapeTool } from "../tools";
import { IWorkerMessage, IMainMessage, IBatchMainMessage, IworkId, IUpdateNodeOpt } from "../types";
import { EmitEventType } from "../../plugin/types";
export declare class SubLocalWorkForWorker extends SubLocalWork {
    _post: (msg: IBatchMainMessage) => void;
    workShapes: Map<IworkId, BaseShapeTool>;
    private combineUnitTime;
    private combineTimerId?;
    private drawCount;
    constructor(layer: Group, drawLayer: Group, postFun: (msg: IBatchMainMessage) => void);
    private drawPencilCombine;
    private drawSelector;
    private drawEraser;
    private drawPencil;
    private drawPencilFull;
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage): IMainMessage | undefined;
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
    }): IMainMessage | undefined;
    blurSelector(): void;
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt' | 'toolsType' | 'updateNodeOpt'>): BaseShapeTool | undefined;
    consumeFull(data: IWorkerMessage): void;
    updateNode(param: {
        workId: IworkId;
        updateNodeOpt: IUpdateNodeOpt;
        willRefresh?: boolean;
        willSyncService?: boolean;
    }): void;
    removeWork(data: IWorkerMessage): void;
}
