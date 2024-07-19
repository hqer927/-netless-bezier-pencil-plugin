import { IWorkerMessage, IRectType } from "..";
import { LocalWork, ISubWorkerInitOption } from "./base";
export declare class LocalWorkForSubWorker extends LocalWork {
    private drawWorkActiveId?;
    constructor(opt: ISubWorkerInitOption);
    runFullWork(data: IWorkerMessage): Promise<IRectType | undefined>;
    runSelectWork(data: IWorkerMessage): undefined;
    workShapesDone(): void;
    consumeDraw(data: IWorkerMessage): Promise<void>;
    consumeDrawAll(data: IWorkerMessage): Promise<void>;
    removeWork(data: IWorkerMessage): Promise<void>;
    private removeNode;
    private drawPencil;
    private drawArrow;
}
