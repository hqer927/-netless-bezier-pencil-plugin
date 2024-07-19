/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkerManager, WorkThreadEngineForFullWorker, EWorkThreadType } from "./workerManager";

const _self: Worker = self as unknown as Worker;
(_self as any).full = new WorkerManager<WorkThreadEngineForFullWorker>(_self, EWorkThreadType.Full);