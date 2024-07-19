
import { EmitEventType } from '../../plugin/types';
import { BaseMsgMethodForMainThread } from './baseForMainThread';
import { CopyNodeMethodForMainThread } from './copyNode/forMainThread';
import { SetColorNodeMethodForMainThread } from './setColor/forMainThread';
import { ZIndexNodeMethodForMainThread } from './setZIndex/forMainThread';
import { TranslateNodeMethodForMainThread } from './translateNode/forMainThread';
import { DeleteNodeMethodForMainThread } from './deleteNode/forMainThread';
import { IWorkerMessage } from '../types';
import { ScaleNodeMethodForMainThread } from './scaleNode/forMainThread';
import { RotateNodeMethodForMainThread } from './rotateNode/forMainThread';
import { SetFontStyleMethodForMainThread } from './setFont/forMainThread';
import { SetPointMethodForMainThread } from './setPoint/forMainThread';
import type { Scene } from 'spritejs';
import { SetLockMethodForMainThread } from './setLock/forMainThread';
import { SetShapeOptMethodForMainThread } from './setShape/forMainThread';
import type { SubLocalThread } from '../mainThread/subLocalThread';
import type { SubServiceThread } from '../mainThread/subServiceThread';

export type MsgMethodForMainThread<T extends BaseMsgMethodForMainThread> = T;
export class MethodBuilderWorker {
    builders: Map<EmitEventType,MsgMethodForMainThread<BaseMsgMethodForMainThread> | undefined> = new Map();
    constructor(emitTypes: EmitEventType[]) {
        this.builders = new Map(emitTypes.map(type => [type, this.build(type)]));
    }
    build(type: EmitEventType): MsgMethodForMainThread<BaseMsgMethodForMainThread> | undefined {
        switch (type) {
            case EmitEventType.TranslateNode:
                return new TranslateNodeMethodForMainThread();
            case EmitEventType.ZIndexNode:
                return new ZIndexNodeMethodForMainThread();
            case EmitEventType.CopyNode:
                return new CopyNodeMethodForMainThread();
            case EmitEventType.SetColorNode:
                return new SetColorNodeMethodForMainThread();
            case EmitEventType.DeleteNode:
                return new DeleteNodeMethodForMainThread();
            case EmitEventType.ScaleNode:
                return new ScaleNodeMethodForMainThread();
            case EmitEventType.RotateNode:
                return new RotateNodeMethodForMainThread();      
            case EmitEventType.SetFontStyle:
                return new SetFontStyleMethodForMainThread();
            case EmitEventType.SetPoint:
                return new SetPointMethodForMainThread();
            case EmitEventType.SetLock:
                return new SetLockMethodForMainThread();
            case EmitEventType.SetShapeOpt:
                return new SetShapeOptMethodForMainThread();  
       }
       return undefined
    }
    registerForMainThread(localWork: SubLocalThread, serviceWork?: SubServiceThread, scene?:Scene) {
        this.builders.forEach(builder=>{
            if (builder) {
                builder.registerMainThread(localWork, serviceWork, scene)
            }
        })
        return this;
    }
    async consumeForMainThread(data: IWorkerMessage): Promise<boolean> {
        for (const value of this.builders.values()) {
            if (await value?.consume(data)) {
                return true;
            }
        }
        return false
    }
}