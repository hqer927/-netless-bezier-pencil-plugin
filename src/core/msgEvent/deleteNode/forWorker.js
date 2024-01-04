import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { ECanvasShowType, EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
import { computRect, getNodeRect, getSafetyRect } from "../../utils";
export class DeleteNodeMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.DeleteNode
        });
    }
    consume(data) {
        const { msgType, dataType, emitEventType } = data;
        if (msgType !== EPostMessageType.RemoveNode)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            // this.localWork?.computNodeMap();
            return true;
        }
        if (dataType === EDataType.Service && emitEventType === this.emitEventType) {
            this.consumeForServiceWorker(data);
            return true;
        }
    }
    consumeForLocalWorker(data) {
        if (!this.localWork) {
            return;
        }
        const { workId, willRefresh } = data;
        if (!workId) {
            return;
        }
        let rect;
        const workShape = this.localWork.workShapes.get(workId);
        if (workShape && workId === SelectorShape.selectorId) {
            const selectIds = workShape.selectIds;
            selectIds?.forEach(name => {
                this.localWork?.drawLayer?.getElementsByName(name).forEach(n => {
                    n.remove();
                });
                this.localWork?.curNodeMap.delete(name);
            });
            rect = workShape.oldRect;
            this.localWork.drawLayer?.parent?.getElementById(SelectorShape.selectorId)?.remove();
            this.localWork.workShapes.delete(SelectorShape.selectorId);
        }
        else if (workId) {
            const key = workId.toString();
            let rect = getNodeRect(key, this.localWork.fullLayer);
            if (rect) {
                this.localWork.fullLayer.getElementsByName(key).forEach(c => c.remove());
            }
            const r = getNodeRect(key, this.localWork.drawLayer);
            if (r) {
                rect = computRect(rect, r);
                this.localWork.drawLayer?.getElementsByName(key).forEach(c => c.remove());
            }
            if (rect) {
                rect = getSafetyRect(rect);
            }
            this.localWork?.curNodeMap.delete(key);
        }
        if (rect && willRefresh) {
            this.localWork._post({
                render: {
                    rect,
                    drawCanvas: ECanvasShowType.Bg,
                    clearCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    isFullWork: true,
                }
            });
        }
    }
    consumeForServiceWorker(data) {
        if (!this.serviceWork) {
            return;
        }
        this.serviceWork.removeSelectWork(data);
    }
}
