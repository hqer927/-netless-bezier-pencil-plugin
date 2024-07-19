import { IWorkerMessage, IMainMessage, EToolsKey, IBatchMainMessage, IUpdateSelectorPropsType } from "..";
import { BaseShapeOptions, SelectorShape } from "../tools";
import { ISubWorkerInitOption, LocalWork } from "./base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { Scene } from "spritejs";
export declare class LocalWorkForFullWorker extends LocalWork {
    private combineUnitTime;
    private combineTimerId?;
    private combineDrawResolve?;
    private combineDrawActiveId?;
    protected drawWorkActiveId?: string;
    private effectSelectNodeData;
    private batchEraserWorks;
    private batchEraserRemoveNodes;
    constructor(opt: ISubWorkerInitOption);
    consumeDraw(data: IWorkerMessage, serviceWork: ServiceWorkForFullWorker): Promise<void>;
    consumeDrawAll(data: IWorkerMessage, serviceWork: ServiceWorkForFullWorker): Promise<void>;
    workShapesDone(scenePath: string, serviceWork: ServiceWorkForFullWorker): Promise<void>;
    consumeFull(data: IWorkerMessage, scene?: Scene): Promise<void>;
    private commandDeleteText;
    removeSelector(data: IWorkerMessage): Promise<void>;
    removeWork(data: IWorkerMessage): Promise<void>;
    private removeNode;
    private _removeWork;
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
    hasSelector(): boolean;
    getSelector(): SelectorShape;
    reRenderSelector(willSyncService?: boolean): Promise<void>;
    updateFullSelectWork(data: IWorkerMessage): Promise<void>;
    destroy(): void;
    private drawPencilCombine;
    private drawSelector;
    private drawEraser;
    private batchEraserCombine;
    private drawPencil;
    private drawPencilFull;
    private updateBatchEraserCombineNode;
    private runEffectSelectWork;
    cursorHover(msg: IWorkerMessage): Promise<void>;
    cursorBlur(): Promise<void>;
}
