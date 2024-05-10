import { Group, Scene } from "spritejs";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IOffscreenCanvasOptionType, IServiceWorkItem, IWorkerMessage, IworkId } from "../types";
import { VNodeManager } from "./vNodeManager";
import { EDataType, EToolsKey } from "../enum";
import { ShapeStateInfo } from "../tools/utils";
import { BaseShapeOptions, BaseShapeTool } from "../tools/base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
import type { WorkThreadEngineForFullWorker, WorkThreadEngineForSubWorker } from "./workerManager";
export interface IWorkerInitOption {
    dpr: number;
    offscreenCanvasOpt: IOffscreenCanvasOptionType;
    layerOpt: ILayerOptionType;
}
export interface ISubWorkerInitOption {
    thread: WorkThreadEngineForFullWorker | WorkThreadEngineForSubWorker;
    viewId: string;
    vNodes: VNodeManager;
    fullLayer: Group;
    drawLayer?: Group;
    post: (msg: IBatchMainMessage) => Promise<void>;
}
export declare abstract class WorkThreadEngineBase {
    readonly viewId: string;
    readonly fullLayer: Group;
    readonly vNodes: VNodeManager;
    readonly dpr: number;
    readonly abstract drawLayer?: Group;
    readonly abstract snapshotFullLayer?: Group;
    protected opt: IWorkerInitOption;
    protected cameraOpt?: ICameraOpt;
    protected scene: Scene;
    abstract localWork: LocalWorkForFullWorker | LocalWorkForSubWorker;
    abstract serviceWork?: ServiceWorkForFullWorker;
    protected isSafari: boolean;
    protected abstract _post: (msg: IBatchMainMessage, transfer?: Transferable[]) => void;
    constructor(viewId: string, opt: IWorkerInitOption);
    setIsSafari(isSafari: boolean): void;
    on(msg: IWorkerMessage): void;
    protected updateScene(offscreenCanvasOpt: IOffscreenCanvasOptionType): void;
    protected updateLayer(layerOpt: ILayerOptionType): void;
    protected createScene(opt: IOffscreenCanvasOptionType): Scene;
    protected createLayer(name: string, scene: Scene, opt: ILayerOptionType): Group;
    protected clearAll(): void;
    protected setToolsOpt(opt: IActiveToolsDataType): void;
    protected setWorkOpt(opt: Partial<IActiveWorkDataType>): void;
    protected destroy(): void;
    abstract setCameraOpt(cameraOpt: ICameraOpt): void;
    abstract getOffscreen(isFullWork: boolean): OffscreenCanvas;
    abstract post(msg: IBatchMainMessage): Promise<void>;
    abstract consumeDraw(type: EDataType, data: IWorkerMessage): void;
    abstract consumeDrawAll(type: EDataType, data: IWorkerMessage): void;
}
export declare abstract class LocalWork {
    readonly viewId: string;
    readonly vNodes: VNodeManager;
    readonly thread: WorkThreadEngineForFullWorker | WorkThreadEngineForSubWorker;
    fullLayer: Group;
    drawLayer?: Group;
    readonly _post: (msg: IBatchMainMessage) => Promise<void>;
    protected tmpWorkShapeNode?: BaseShapeTool;
    protected tmpOpt?: IActiveToolsDataType;
    workShapes: Map<IworkId, BaseShapeTool>;
    workShapeState: Map<IworkId, ShapeStateInfo>;
    protected effectWorkId?: number;
    protected drawCount: number;
    constructor(opt: ISubWorkerInitOption);
    destroy(): void;
    getWorkShape(workId: IworkId): BaseShapeTool | undefined;
    getTmpWorkShapeNode(): BaseShapeTool | undefined;
    setTmpWorkId(workId: IworkId | undefined): void;
    setTmpWorkOptions(opt: BaseShapeOptions): void;
    setWorkOptions(workId: IworkId, opt: BaseShapeOptions): void;
    createWorkShapeNode(opt: IActiveToolsDataType & {
        workId?: IworkId;
    }): import("../tools").SelectorShape | import("../tools").PencilShape | import("../tools").LaserPenShape | import("../tools").ArrowShape | import("../tools/straight").StraightShape | import("../tools").EllipseShape | import("../tools").PolygonShape | import("../tools").StarShape | import("../tools").RectangleShape | import("../tools").SpeechBalloonShape | import("../tools/text").TextShape | import("../tools").EraserShape | import("../tools").ImageShape | undefined;
    setToolsOpt(opt: IActiveToolsDataType): void;
    clearWorkShapeNodeCache(workId: IworkId): void;
    clearAllWorkShapesCache(): void;
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt' | 'toolsType'>): BaseShapeTool | import("../tools").LaserPenShape | import("../tools").SpeechBalloonShape | import("../tools/text").TextShape | import("../tools").EraserShape | undefined;
    abstract consumeDraw(data: IWorkerMessage, serviceWork?: ServiceWork): IMainMessage | undefined;
    abstract consumeDrawAll(data: IWorkerMessage, serviceWork?: ServiceWork): IMainMessage | undefined;
}
export interface ServiceWork {
    readonly viewId: string;
    readonly vNodes: VNodeManager;
    readonly fullLayer: Group;
    readonly drawLayer: Group;
    readonly post: (msg: IBatchMainMessage) => Promise<void>;
    selectorWorkShapes: Map<string, IServiceWorkItem>;
    clearAllWorkShapesCache(): void;
    runSelectWork(data: IWorkerMessage): void;
    consumeDraw(data: IWorkerMessage): void;
    setNodeKey(workShape: IServiceWorkItem, tools: EToolsKey, opt: BaseShapeOptions): IServiceWorkItem;
    runReverseSelectWork(selectIds: string[]): void;
    removeWork(data: IWorkerMessage): void;
    removeSelectWork(data: IWorkerMessage): void;
    runSelectWork(data: IWorkerMessage): void;
    consumeFull(data: IWorkerMessage): void;
    consumeDraw(data: IWorkerMessage): void;
    destroy(): void;
}
