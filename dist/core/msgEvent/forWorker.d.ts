import { EmitEventType } from '../../plugin/types';
import { BaseMsgMethodForWorker } from './baseForWorker';
import { IWorkerMessage } from '../types';
import { LocalWorkForFullWorker } from '../worker/fullWorkerLocal';
import { ServiceWorkForFullWorker } from '../worker/fullWorkerService';
import type { Scene } from 'spritejs';
export type MsgMethodForWorker<T extends BaseMsgMethodForWorker> = T;
export declare class MethodBuilderWorker {
    builders: Map<EmitEventType, MsgMethodForWorker<BaseMsgMethodForWorker> | undefined>;
    constructor(emitTypes: EmitEventType[]);
    build(type: EmitEventType): MsgMethodForWorker<BaseMsgMethodForWorker> | undefined;
    registerForWorker(localWork: LocalWorkForFullWorker, serviceWork?: ServiceWorkForFullWorker, scene?: Scene): this;
    consumeForWorker(data: IWorkerMessage): boolean;
}
