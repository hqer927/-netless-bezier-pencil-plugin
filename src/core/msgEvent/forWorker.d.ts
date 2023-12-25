import { EmitEventType } from '../../plugin/types';
import { BaseMsgMethodForWorker } from './baseForWorker';
import { SubLocalWorkForWorker } from '../worker/local';
import { SubServiceWorkForWorker } from '../worker/service';
import { IWorkerMessage } from '../types';
export type MsgMethodForWorker<T extends BaseMsgMethodForWorker> = T;
export declare class MethodBuilderWorker {
    builders: Map<EmitEventType, MsgMethodForWorker<BaseMsgMethodForWorker> | undefined>;
    constructor(emitTypes: EmitEventType[]);
    build(type: EmitEventType): MsgMethodForWorker<BaseMsgMethodForWorker> | undefined;
    registerForWorker(localWork: SubLocalWorkForWorker, serviceWork?: SubServiceWorkForWorker): this;
    consumeForWorker(data: IWorkerMessage): boolean;
}
