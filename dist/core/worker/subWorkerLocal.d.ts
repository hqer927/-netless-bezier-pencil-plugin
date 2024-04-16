import { Group } from "spritejs";
import { IWorkerMessage, IRectType, IMainMessage } from "..";
import { BaseCollectorReducerAction } from "../../collector/types";
import { LocalWork, ISubWorkerInitOption } from "./base";
export declare class LocalWorkForSubWorker extends LocalWork {
    private animationWorkRects?;
    protected combineDrawTimer?: number;
    private animationId?;
    private closeAnimationTime;
    private runLaserPenStep;
    constructor(opt: ISubWorkerInitOption);
    runFullWork(data: IWorkerMessage, isDrawLabel?: boolean): IRectType | undefined;
    runSelectWork(data: IWorkerMessage): undefined;
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage): undefined;
    updateLabels(labelGroup: Group, value: BaseCollectorReducerAction): void;
    private runLaserPenAnimation;
    private drawPencil;
    private drawArrow;
}
