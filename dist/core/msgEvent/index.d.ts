import { EmitEventType, InternalMsgEmitterType } from '../../plugin/types';
import { BaseMsgMethod } from './base';
import { ZIndexNodeMethod } from './setZIndex/forMain';
import { MainEngineForWorker } from '../worker/main';
import { Collector } from '../../collector';
export { ZIndexNodeMethod };
export type MsgMethod<T extends BaseMsgMethod> = T;
export declare class MethodBuilderMain {
    builders: Map<EmitEventType, MsgMethod<BaseMsgMethod> | undefined>;
    constructor(emitTypes: EmitEventType[]);
    build(type: EmitEventType): MsgMethod<BaseMsgMethod> | undefined;
    getBuilder(type: EmitEventType): BaseMsgMethod | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, main: MainEngineForWorker, serviceColloctor: Collector): this;
    destroy(): void;
    static emitMethod(emtType: InternalMsgEmitterType, type: EmitEventType, data: unknown): undefined;
}
