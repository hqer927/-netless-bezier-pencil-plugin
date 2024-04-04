import { EmitEventType, InternalMsgEmitterType } from '../../plugin/types';
import { ZIndexActiveMethod } from './activeZIndex/forMain';
import { BaseMsgMethod } from './base';
import { CopyNodeMethod } from './copyNode/forMain';
import { SetColorNodeMethod } from './setColor/forMain';
import { ZIndexNodeMethod } from './setZIndex/forMain';
import { TranslateNodeMethod } from './translateNode/forMain';
import { DeleteNodeMethod } from './deleteNode/forMain';
import { ScaleNodeMethod } from './scaleNode/forMain';
import { RotateNodeMethod } from './rotateNode/forMain';
import { BaseTeachingAidsManager } from '../../plugin/baseTeachingAidsManager';
export { ZIndexNodeMethod };

export type MsgMethod<T extends BaseMsgMethod> = T;
export class MethodBuilderMain {
    builders: Map<EmitEventType,MsgMethod<BaseMsgMethod> | undefined> = new Map();
    constructor(emitTypes: EmitEventType[]) {
        this.builders = new Map(emitTypes.map(type => [type, this.build(type)]));
    }
    build(type: EmitEventType): MsgMethod<BaseMsgMethod> | undefined {
        switch (type) {
            case EmitEventType.TranslateNode:
                return new TranslateNodeMethod();
            case EmitEventType.ZIndexNode:
                return new ZIndexNodeMethod();
            case EmitEventType.ZIndexActive:
                return new ZIndexActiveMethod();
            case EmitEventType.CopyNode:
                return new CopyNodeMethod();
            case EmitEventType.SetColorNode:
                return new SetColorNodeMethod();
            case EmitEventType.DeleteNode:
                return new DeleteNodeMethod();
            case EmitEventType.ScaleNode:
                return new ScaleNodeMethod();
            case EmitEventType.RotateNode:
                return new RotateNodeMethod();        
       }
       return undefined
    }
    getBuilder(type:EmitEventType){
        return this.builders.get(type);
    }
    registerForMainEngine(emtType: InternalMsgEmitterType, control:BaseTeachingAidsManager){
        this.builders.forEach(builder=>{
            if (builder) {
                builder.registerForMainEngine(emtType, control)
            }
        })
        return this;
    }
    destroy() {
        this.builders.forEach(builder=>{
            if (builder) {
                builder.destroy();
            }
        })
    }
    static emitMethod(emtType: InternalMsgEmitterType, type: EmitEventType, data: unknown) {
        BaseMsgMethod.dispatch(emtType, type, data)
        return undefined
    }
}