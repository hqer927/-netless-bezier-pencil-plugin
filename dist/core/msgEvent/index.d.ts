import { EmitEventType, InternalMsgEmitterType } from '../../plugin/types';
import { BaseMsgMethod } from './base';
import { ZIndexNodeMethod } from './setZIndex/forMain';
import { BaseTeachingAidsManager } from '../../plugin/baseTeachingAidsManager';
export { ZIndexNodeMethod };
export type MsgMethod<T extends BaseMsgMethod> = T;
export declare class MethodBuilderMain {
    builders: Map<EmitEventType, MsgMethod<BaseMsgMethod> | undefined>;
    constructor(emitTypes: EmitEventType[]);
    build(type: EmitEventType): MsgMethod<BaseMsgMethod> | undefined;
    getBuilder(type: EmitEventType): BaseMsgMethod | undefined;
    registerForMainEngine(emtType: InternalMsgEmitterType, control: BaseTeachingAidsManager): this;
    destroy(): void;
    static emitMethod(emtType: InternalMsgEmitterType, type: EmitEventType, data: unknown): undefined;
}
