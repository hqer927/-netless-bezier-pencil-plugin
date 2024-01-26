import { WorkThreadEngine } from "../base";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, IWorkerMessage } from "../types";
import { EDataType } from "../enum";
import { SubLocalWorkForWorker } from "./local";
import { SubServiceWorkForWorker } from "./service";
import type { Scene, Group } from "spritejs";
export declare class WorkThreadEngineByWorker extends WorkThreadEngine {
    protected cameraOpt?: Required<Pick<ICameraOpt, "scale" | "centerX" | "centerY">> | undefined;
    static _self: Worker;
    protected dpr: number;
    protected scene: Scene;
    protected drawLayer: Group;
    protected fullLayer: Group;
    protected snapshotFullLayer: Group;
    protected localWork: SubLocalWorkForWorker;
    protected serviceWork: SubServiceWorkForWorker;
    private methodBuilder?;
    constructor();
    private init;
    getOffscreen(isFullWork: boolean): OffscreenCanvas;
    private register;
    setToolsOpt(opt: IActiveToolsDataType): void;
    setWorkOpt(opt: Partial<IActiveWorkDataType>): void;
    private clearAll;
    private setCameraOpt;
    private getRectImageBitmap;
    private safariFixRect;
    post(msg: IBatchMainMessage): Promise<void>;
    on(callBack: (msg: IterableIterator<IWorkerMessage>) => void): void;
    consumeDraw(type: EDataType, data: IWorkerMessage): undefined;
    consumeDrawAll(type: EDataType, data: IWorkerMessage): void;
    consumeFull(type: EDataType, data: IWorkerMessage): void;
    removeNode(data: IWorkerMessage): void;
}
export declare const worker: WorkThreadEngineByWorker;
