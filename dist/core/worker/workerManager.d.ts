import { Group } from "spritejs";
import { ECanvasShowType, EDataType } from "../enum";
import { IBatchMainMessage, ICameraOpt, ILayerOptionType, IWorkerMessage } from "../types";
import { IWorkerInitOption, WorkThreadEngineBase } from "./base";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
import { TopLayerWorkForSubWorker } from "./subWorkerTopLayer";
export declare enum EWorkThreadType {
    Full = "full",
    Sub = "sub"
}
export declare class WorkerManager<T extends WorkThreadEngineBase> {
    readonly _self: Worker;
    readonly version: string;
    protected type: EWorkThreadType;
    protected workThreadMap: Map<string, T>;
    constructor(worker: Worker, type: EWorkThreadType);
    private init;
    private register;
    post(msg: IBatchMainMessage, transfer?: Transferable[]): void;
}
/** full worker */
export declare class WorkThreadEngineForFullWorker extends WorkThreadEngineBase {
    readonly type: EWorkThreadType;
    serviceDrawLayer: Group;
    localDrawLayer: Group;
    snapshotFullLayer: undefined;
    private methodBuilder;
    localWork: LocalWorkForFullWorker;
    serviceWork: ServiceWorkForFullWorker;
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    private taskUpdateCameraId?;
    private debounceUpdateCameraId?;
    private debounceUpdateCache;
    constructor(viewId: string, opt: IWorkerInitOption, _post: (msg: IBatchMainMessage, transfer?: Transferable[]) => void);
    combinePost(): Promise<void>;
    on(msg: IWorkerMessage): Promise<void>;
    removeNode(data: IWorkerMessage): Promise<void>;
    checkTextActive(data: IWorkerMessage): Promise<void>;
    clearAll(): Promise<void>;
    protected updateLayer(layerOpt: ILayerOptionType): void;
    setCameraOpt(cameraOpt: ICameraOpt): void;
    protected getLayer(drawCanvas: ECanvasShowType): Group | undefined;
    getOffscreen(drawCanvas: ECanvasShowType): OffscreenCanvas;
    consumeFull(type: EDataType, data: IWorkerMessage): Promise<void>;
    consumeDraw(type: EDataType, data: IWorkerMessage): Promise<void>;
    consumeDrawAll(type: EDataType, data: IWorkerMessage): Promise<void>;
    updateCamera(msg: IWorkerMessage): Promise<void>;
    private getRectImageBitmap;
    private cursorHover;
    private cursorBlur;
}
/** sub worker */
export declare class WorkThreadEngineForSubWorker extends WorkThreadEngineBase {
    readonly type: EWorkThreadType;
    protected _post: (msg: IBatchMainMessage, transfer?: Transferable[] | undefined) => void;
    topLayer: Group;
    snapshotFullLayer: Group | undefined;
    serviceWork: undefined;
    localWork: LocalWorkForSubWorker;
    topLayerWork: TopLayerWorkForSubWorker;
    constructor(viewId: string, opt: IWorkerInitOption, _post: (msg: IBatchMainMessage, transfer?: Transferable[]) => void);
    combinePost(): Promise<void>;
    getLayer(drawCanvas: ECanvasShowType, isSnapshot?: boolean): Group;
    on(msg: IWorkerMessage): Promise<void>;
    protected createLocalWork(data: IWorkerMessage): void;
    removeNode(data: IWorkerMessage): Promise<void>;
    getOffscreen(drawCanvas: ECanvasShowType, isSnapshot?: boolean): OffscreenCanvas;
    consumeDraw(dataType: EDataType, data: IWorkerMessage): Promise<void>;
    consumeDrawAll(_type: EDataType, data: IWorkerMessage): Promise<void>;
    clearAll(): Promise<void>;
    private getRectImageBitmap;
    protected updateLayer(layerOpt: ILayerOptionType): void;
    updateCamera(msg: IWorkerMessage): Promise<void>;
    setCameraOpt(cameraOpt: ICameraOpt, layer?: Group): void;
    private getSnapshot;
    private getSnapshotRender;
    private getBoundingRect;
}
