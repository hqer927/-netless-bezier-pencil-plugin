import { EmitEventType, InternalMsgEmitterType } from '../../plugin/types';
import { BaseMsgMethod } from './base';
import { MainEngineForWorker } from '../worker/main';
import { BaseCollector } from '../../collector';
export type MsgMethod<T extends BaseMsgMethod> = T;
export declare class MethodBuilderMain {
    builders: Map<EmitEventType, MsgMethod<BaseMsgMethod> | undefined>;
    constructor(emitTypes: EmitEventType[]);
    build(type: EmitEventType): MsgMethod<BaseMsgMethod> | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, main: MainEngineForWorker, serviceColloctor: BaseCollector): this;
    destroy(): void;
    static emitMethod(emtType: InternalMsgEmitterType, type: EmitEventType, data: unknown): undefined;
}
