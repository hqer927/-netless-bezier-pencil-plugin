/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkerManager, WorkThreadEngineForSubWorker, EWorkThreadType } from "./workerManager";

const _self: Worker = self as unknown as Worker;
new WorkerManager<WorkThreadEngineForSubWorker>(_self, EWorkThreadType.Sub);

