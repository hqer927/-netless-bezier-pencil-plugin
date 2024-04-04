/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkerManager, EWorkThreadType } from "./workerManager";
const _self = self;
new WorkerManager(_self, EWorkThreadType.Full);
