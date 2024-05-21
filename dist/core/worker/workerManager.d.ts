import { Group } from "spritejs";
import { EDataType } from "../enum";
import { IBatchMainMessage, ICameraOpt, ILayerOptionType, IWorkerMessage } from "../types";
import { IWorkerInitOption, WorkThreadEngineBase } from "./base";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
export declare enum EWorkThreadType {
    Full = "full",
    Sub = "sub"
}
export declare class WorkerManager<T extends WorkThreadEngineBase> {
    _self: Worker;
    protected type: EWorkThreadType;
    protected workThreadMap: Map<string, T>;
    constructor(worker: Worker, type: EWorkThreadType);
    private init;
    private register;
    post(msg: IBatchMainMessage, transfer?: Transferable[]): void;
}
/** full worker */
export declare class WorkThreadEngineForFullWorker extends WorkThreadEngineBase {
    serviceDrawLayer: Group;
    drawLayer: Group;
    snapshotFullLayer: undefined;
    private methodBuilder;
    localWork: LocalWorkForFullWorker;
    serviceWork: ServiceWorkForFullWorker;
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    constructor(viewId: string, opt: IWorkerInitOption, _post: (msg: IBatchMainMessage, transfer?: Transferable[]) => void);
    post(msg: IBatchMainMessage, transfer?: Transferable[]): Promise<void>;
    on(msg: IWorkerMessage): void;
    removeNode(data: IWorkerMessage): Promise<void>;
    checkTextActive(data: IWorkerMessage): void;
    clearAll(): void;
    protected updateLayer(layerOpt: ILayerOptionType): void;
    setCameraOpt(cameraOpt: ICameraOpt): void;
    getLayer(isFullWork?: boolean, workerType?: EDataType.Local | EDataType.Service): Group;
    getOffscreen(isFullWork: boolean, workerType?: EDataType.Local | EDataType.Service): OffscreenCanvas;
    consumeFull(type: EDataType, data: IWorkerMessage): Promise<void>;
    consumeDraw(type: EDataType, data: IWorkerMessage): void;
    consumeDrawAll(type: EDataType, data: IWorkerMessage): void;
    private updateCamera;
    private getRectImageBitmap;
    private safariFixRect;
    private getSceneRect;
    private checkRightRectBoundingBox;
    private cursorHover;
}
/** sub worker */
export declare class WorkThreadEngineForSubWorker extends WorkThreadEngineBase {
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    drawLayer: undefined;
    snapshotFullLayer: Group | undefined;
    serviceWork: undefined;
    localWork: LocalWorkForSubWorker;
    constructor(viewId: string, opt: IWorkerInitOption, _post: (msg: IBatchMainMessage, transfer?: Transferable[]) => void);
    post(msg: IBatchMainMessage, transfer?: Transferable[]): Promise<void>;
    on(msg: IWorkerMessage): void;
    getOffscreen(isSnapshot: boolean): OffscreenCanvas;
    consumeDraw(type: EDataType, data: IWorkerMessage): void;
    consumeDrawAll(_type: EDataType, data: IWorkerMessage): void;
    private getRectImageBitmap;
    private safariFixRect;
    private updateCamera;
    setCameraOpt(cameraOpt: ICameraOpt, layer?: Group): void;
    private getSnapshot;
    private willRenderSpecialLabel;
    private getSnapshotRender;
    private getBoundingRect;
}
