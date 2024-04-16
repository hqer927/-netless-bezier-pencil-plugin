import { Group } from "spritejs";
import { EDataType } from "../enum";
import { IBatchMainMessage, ICameraOpt, IWorkerMessage } from "../types";
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
    drawLayer: Group;
    snapshotFullLayer: undefined;
    private methodBuilder;
    protected localWork: LocalWorkForFullWorker;
    protected serviceWork: ServiceWorkForFullWorker;
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    constructor(viewId: string, opt: IWorkerInitOption, _post: (msg: IBatchMainMessage, transfer?: Transferable[]) => void);
    post(msg: IBatchMainMessage, transfer?: Transferable[]): Promise<void>;
    on(msg: IWorkerMessage): void;
    removeNode(data: IWorkerMessage): void;
    checkTextActive(data: IWorkerMessage): void;
    clearAll(): void;
    setCameraOpt(cameraOpt: ICameraOpt): void;
    getOffscreen(isFullWork: boolean): OffscreenCanvas;
    consumeFull(type: EDataType, data: IWorkerMessage): void;
    consumeDraw(type: EDataType, data: IWorkerMessage): void;
    consumeDrawAll(type: EDataType, data: IWorkerMessage): void;
    private updateCamera;
    private getRectImageBitmap;
    private safariFixRect;
    private getSceneRect;
    private checkRightRectBoundingBox;
}
/** sub worker */
export declare class WorkThreadEngineForSubWorker extends WorkThreadEngineBase {
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    drawLayer: undefined;
    snapshotFullLayer: Group | undefined;
    protected serviceWork: undefined;
    protected localWork: LocalWorkForSubWorker;
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
