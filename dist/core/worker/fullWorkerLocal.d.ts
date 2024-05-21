import { IWorkerMessage, IMainMessage, IRectType, EToolsKey, IBatchMainMessage, IUpdateSelectorPropsType } from "..";
import { BaseShapeOptions, SelectorShape } from "../tools";
import { ISubWorkerInitOption, LocalWork } from "./base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { Scene } from "spritejs";
export declare class LocalWorkForFullWorker extends LocalWork {
    private combineUnitTime;
    private combineTimerId?;
    private effectSelectNodeData;
    private batchEraserWorks;
    private batchEraserRemoveNodes;
    constructor(opt: ISubWorkerInitOption);
    consumeDraw(data: IWorkerMessage, serviceWork: ServiceWorkForFullWorker): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage, serviceWork: ServiceWorkForFullWorker): IMainMessage | undefined;
    consumeFull(data: IWorkerMessage, scene?: Scene): Promise<void>;
    removeWork(data: IWorkerMessage): void;
    removeNode(key: string): IRectType | undefined;
    checkTextActive(data: IWorkerMessage): Promise<void>;
    colloctEffectSelectWork(data: IWorkerMessage): Promise<IWorkerMessage | undefined>;
    updateSelector(params: IUpdateSelectorPropsType & {
        callback?: (props: {
            res?: IMainMessage;
            param: IUpdateSelectorPropsType;
            postData: Pick<IBatchMainMessage, 'sp' | 'render'>;
            workShapeNode: SelectorShape;
            newServiceStore: Map<string, {
                opt: BaseShapeOptions;
                toolsType: EToolsKey;
                ops?: string;
            }>;
        }) => void;
    }): Promise<IMainMessage | undefined>;
    blurSelector(data?: IWorkerMessage): Promise<void>;
    reRenderSelector(willSyncService?: boolean): Promise<void> | undefined;
    updateFullSelectWork(data: IWorkerMessage): void;
    destroy(): void;
    private drawPencilCombine;
    private drawSelector;
    private drawEraser;
    private batchEraserCombine;
    private drawPencil;
    private drawPencilFull;
    private updateBatchEraserCombineNode;
    private runEffectSelectWork;
    cursorHover(msg: IWorkerMessage): void;
}
