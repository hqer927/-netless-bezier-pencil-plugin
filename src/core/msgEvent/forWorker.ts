
import { EmitEventType } from '../../plugin/types';
import { BaseMsgMethodForWorker } from './baseForWorker';
import { CopyNodeMethodForWorker } from './copyNode/forWorker';
import { SetColorNodeMethodForWorker } from './setColor/forWorker';
import { ZIndexNodeMethodForWorker } from './setZIndex/forWorker';
import { TranslateNodeMethodForWorker } from './translateNode/forWorker';
import { DeleteNodeMethodForWorker } from './deleteNode/forWorker';
import { IWorkerMessage } from '../types';
import { ScaleNodeMethodForWorker } from './scaleNode/forWorker';
import { RotateNodeMethodForWorker } from './rotateNode/forWorker';
import { LocalWorkForFullWorker } from '../worker/fullWorkerLocal';
import { ServiceWorkForFullWorker } from '../worker/fullWorkerService';
import { SetFontStyleMethodForWorker } from './setFont/forWorker';
import { SetPointMethodForWorker } from './setPoint/forWorker';
import type { Scene } from 'spritejs';
import { SetLockMethodForWorker } from './setLock/forWorker';
import { SetShapeOptMethodForWorker } from './setShape/forWorker';

export type MsgMethodForWorker<T extends BaseMsgMethodForWorker> = T;
export class MethodBuilderWorker {
    builders: Map<EmitEventType,MsgMethodForWorker<BaseMsgMethodForWorker> | undefined> = new Map();
    constructor(emitTypes: EmitEventType[]) {
        this.builders = new Map(emitTypes.map(type => [type, this.build(type)]));
    }
    build(type: EmitEventType): MsgMethodForWorker<BaseMsgMethodForWorker> | undefined {
        switch (type) {
            case EmitEventType.TranslateNode:
                return new TranslateNodeMethodForWorker();
            case EmitEventType.ZIndexNode:
                return new ZIndexNodeMethodForWorker();
            case EmitEventType.CopyNode:
                return new CopyNodeMethodForWorker();
            case EmitEventType.SetColorNode:
                return new SetColorNodeMethodForWorker();
            case EmitEventType.DeleteNode:
                return new DeleteNodeMethodForWorker();
            case EmitEventType.ScaleNode:
                return new ScaleNodeMethodForWorker();
            case EmitEventType.RotateNode:
                return new RotateNodeMethodForWorker();      
            case EmitEventType.SetFontStyle:
                return new SetFontStyleMethodForWorker();
            case EmitEventType.SetPoint:
                return new SetPointMethodForWorker();
            case EmitEventType.SetLock:
                return new SetLockMethodForWorker();
            case EmitEventType.SetShapeOpt:
                return new SetShapeOptMethodForWorker();  
       }
       return undefined
    }
    registerForWorker(localWork: LocalWorkForFullWorker, serviceWork?: ServiceWorkForFullWorker, scene?:Scene) {
        this.builders.forEach(builder=>{
            if (builder) {
                builder.registerForWorker(localWork, serviceWork, scene)
            }
        })
        return this;
    }
    consumeForWorker(data: IWorkerMessage): boolean {
        for (const value of this.builders.values()) {
            if (value?.consume(data)) {
                return true;
            }
        }
        return false
    }
}