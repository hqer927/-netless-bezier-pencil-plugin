import { EmitEventType } from '../../plugin/types';
import { ZIndexActiveMethod } from './activeZIndex/forMain';
import { BaseMsgMethod } from './base';
import { CopyNodeMethod } from './copyNode/forMain';
import { SetColorNodeMethod } from './setColor/forMain';
import { ZIndexNodeMethod } from './setZIndex/forMain';
import { TranslateNodeMethod } from './translateNode/forMain';
import { DeleteNodeMethod } from './deleteNode/forMain';
import { ScaleNodeMethod } from './scaleNode/forMain';
import { RotateNodeMethod } from './rotateNode/forMain';
import { SetFontStyleMethod } from './setFont/forMain';
import { SetPointMethod } from './setPoint/forMain';
export { ZIndexNodeMethod };
export class MethodBuilderMain {
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
            case EmitEventType.SetFontStyle:
                return new SetFontStyleMethod();
            case EmitEventType.SetPoint:
                return new SetPointMethod();
        }
        return undefined;
    }
    getBuilder(type) {
        return this.builders.get(type);
    }
    registerForMainEngine(emtType, control) {
        this.builders.forEach(builder => {
            if (builder) {
                builder.registerForMainEngine(emtType, control);
            }
        });
        return this;
    }
    destroy() {
        this.builders.forEach(builder => {
            if (builder) {
                builder.destroy();
            }
        });
    }
    static emitMethod(emtType, type, data) {
        BaseMsgMethod.dispatch(emtType, type, data);
        return undefined;
    }
}
