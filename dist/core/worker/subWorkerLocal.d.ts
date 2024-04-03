import { IWorkerMessage, IRectType, IMainMessage } from "..";
import { LocalWork, ISubWorkerInitOption } from "./base";
export declare class LocalWorkForSubWorker extends LocalWork {
    private animationWorkRects?;
    protected combineDrawTimer?: number;
    private animationId?;
    private closeAnimationTime;
    private runLaserPenStep;
    constructor(opt: ISubWorkerInitOption);
    runFullWork(data: IWorkerMessage): IRectType | undefined;
    runSelectWork(data: IWorkerMessage): undefined;
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined;
    consumeDrawAll(data: IWorkerMessage): undefined;
    private runLaserPenAnimation;
    private drawPencil;
    private drawArrow;
}
