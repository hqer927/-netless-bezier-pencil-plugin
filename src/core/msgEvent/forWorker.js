import { EmitEventType } from '../../plugin/types';
import { ZIndexActiveMethodForWorker } from './activeZIndex/forWorker';
import { CopyNodeMethodForWorker } from './copyNode/forWorker';
import { SetColorNodeMethodForWorker } from './setColor/forWorker';
import { ZIndexNodeMethodForWorker } from './setZIndex/forWorker';
import { TranslateNodeMethodForWorker } from './translateNode/forWorker';
import { DeleteNodeMethodForWorker } from './deleteNode/forWorker';
import { ScaleNodeMethodForWorker } from './scaleNode/forWorker';
import { RotateNodeMethodForWorker } from './rotateNode/forWorker';
import { SetFontStyleMethodForWorker } from './setFont/forWorker';
import { SetPointMethodForWorker } from './setPoint/forWorker';
export class MethodBuilderWorker {
    constructor(emitTypes) {
        Object.defineProperty(this, "builders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.builders = new Map(emitTypes.map(type => [type, this.build(type)]));
    }
    build(type) {
        switch (type) {
            case EmitEventType.TranslateNode:
                return new TranslateNodeMethodForWorker();
            case EmitEventType.ZIndexNode:
                return new ZIndexNodeMethodForWorker();
            case EmitEventType.ZIndexActive:
                return new ZIndexActiveMethodForWorker();
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
        }
        return undefined;
    }
    registerForWorker(localWork, serviceWork) {
        this.builders.forEach(builder => {
            if (builder) {
                builder.registerForWorker(localWork, serviceWork);
            }
        });
        return this;
    }
    consumeForWorker(data) {
        for (const value of this.builders.values()) {
            if (value?.consume(data)) {
                return true;
            }
        }
        return false;
    }
}
