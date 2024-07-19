import { Group, Scene } from "spritejs";
import { IActiveToolsDataType, IActiveWorkDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IOffscreenCanvasOptionType, IRectType, IWorkerMessage } from "../types";
import { VNodeManager } from "../vNodeManager";
import { ECanvasContextType, ECanvasShowType, EDataType, EvevtWorkState } from "../enum";
import { BaseShapeOptions, BaseShapeTool } from "../tools/base";
import { ServiceWorkForFullWorker } from "./fullWorkerService";
import { LocalWorkForFullWorker } from "./fullWorkerLocal";
import { LocalWorkForSubWorker } from "./subWorkerLocal";
import { EWorkThreadType, WorkThreadEngineForFullWorker, WorkThreadEngineForSubWorker } from "./workerManager";
import { EmitEventType } from "../../plugin/types";
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
    topLayer?: Group;
    drawLayer?: Group;
}
export declare abstract class WorkThreadEngineBase {
    readonly viewId: string;
    readonly fullLayer: Group;
    readonly vNodes: VNodeManager;
    readonly dpr: number;
    readonly contextType?: ECanvasContextType;
    abstract readonly type: EWorkThreadType;
    protected opt: IWorkerInitOption;
    protected cameraOpt?: ICameraOpt;
    protected scene: Scene;
    abstract localWork: LocalWorkForFullWorker | LocalWorkForSubWorker;
    abstract serviceWork?: ServiceWorkForFullWorker;
    protected isSafari: boolean;
    protected abstract _post: (msg: IBatchMainMessage) => void;
    combinePostMsg: Set<IBatchMainMessage>;
    protected workerTaskId?: number | undefined;
    protected protectedTask?: {
        isProtected: boolean;
        workName: EmitEventType;
        workState: EvevtWorkState;
    };
    protected delayPostDoneResolve?: (bol: boolean) => void;
    constructor(viewId: string, opt: IWorkerInitOption, workerType: EWorkThreadType);
    setIsSafari(isSafari: boolean): void;
    on(msg: IWorkerMessage): Promise<void>;
    protected createLocalWork(data: IWorkerMessage): void;
    protected updateScene(offscreenCanvasOpt: IOffscreenCanvasOptionType): void;
    protected updateLayer(layerOpt: ILayerOptionType): void;
    private getSupportContextType;
    protected createScene(opt: IOffscreenCanvasOptionType): Scene;
    protected createLayer(name: string, scene: Scene, opt: ILayerOptionType): Group;
    protected clearAll(): Promise<void>;
    protected setToolsOpt(opt: IActiveToolsDataType): void;
    protected setWorkOpt(opt: Partial<IActiveWorkDataType>): void;
    protected destroy(): void;
    post(msg: IBatchMainMessage): Promise<void>;
    private runBatchPostData;
    protected combinePostData(): IBatchMainMessage;
    protected safariFixRect(rect: IRectType): IRectType | undefined;
    protected getSceneRect(): IRectType;
    abstract combinePost(): Promise<void>;
    protected abstract getLayer(workLayer: ECanvasShowType): Group | undefined;
    abstract setCameraOpt(cameraOpt: ICameraOpt): void;
    abstract consumeDraw(type: EDataType, data: IWorkerMessage): Promise<void>;
    abstract consumeDrawAll(type: EDataType, data: IWorkerMessage): Promise<void>;
    abstract updateCamera(msg: IWorkerMessage): Promise<void>;
}
export declare abstract class LocalWork {
    readonly viewId: string;
    readonly vNodes: VNodeManager;
    readonly thread: WorkThreadEngineForFullWorker | WorkThreadEngineForSubWorker;
    fullLayer: Group;
    drawLayer?: Group;
    readonly _post: (msg: IBatchMainMessage) => Promise<void>;
    protected tmpOpt?: IActiveToolsDataType;
    workShapes: Map<string, BaseShapeTool>;
    protected drawCount: number;
    protected syncUnitTime: number;
    constructor(opt: ISubWorkerInitOption);
    destroy(): void;
    getWorkShapes(): Map<string, BaseShapeTool>;
    getWorkShape(workId: string): BaseShapeTool | undefined;
    createWorkShape(workId: string, opt?: BaseShapeOptions): void;
    setWorkOptions(workId: string, opt: BaseShapeOptions): void;
    createWorkShapeNode(opt: IActiveToolsDataType & {
        workId: string;
    }): import("../tools").PencilShape | import("../tools").LaserPenShape | import("../tools").EraserShape | import("../tools").StarShape | import("../tools/text").TextShape | import("../tools").SelectorShape | import("../tools").ImageShape | import("../tools").ArrowShape | import("../tools/straight").StraightShape | import("../tools").EllipseShape | import("../tools").PolygonShape | import("../tools").RectangleShape | import("../tools").SpeechBalloonShape | undefined;
    setToolsOpt(opt: IActiveToolsDataType): void;
    getToolsOpt(): IActiveToolsDataType | undefined;
    clearWorkShapeNodeCache(workId: string): void;
    clearAllWorkShapesCache(): void;
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt' | 'toolsType'>): BaseShapeTool | undefined;
}
