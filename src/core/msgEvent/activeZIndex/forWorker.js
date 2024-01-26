import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { ECanvasShowType, EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
import { isIntersect } from "../../utils";
export class ZIndexActiveMethodForWorker extends BaseMsgMethodForWorker {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.ZIndexActive
        });
    }
    consume(data) {
        const { msgType, dataType, emitEventType } = data;
        if (msgType !== EPostMessageType.UpdateNode)
            return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }
    }
    consumeForLocalWorker(data) {
        const { workId, isActiveZIndex, willRefreshSelector } = data;
        if (workId !== SelectorShape.selectorId) {
            return;
        }
        const workShapeNode = this.localWork?.workShapes.get(SelectorShape.selectorId);
        if (!workShapeNode) {
            return;
        }
        const rect = workShapeNode.oldRect;
        if (isActiveZIndex && rect) {
            const cloneNodes = [];
            const removeNodes = [];
            workShapeNode.curNodeMap.forEach((value, key) => {
                if (isIntersect(rect, value.rect)) {
                    this.localWork?.fullLayer.getElementsByName(key).forEach(cNode => {
                        if (cNode) {
                            const c = cNode.cloneNode(true);
                            cloneNodes.push(cNode);
                            removeNodes.push(c);
                        }
                    });
                }
            });
            if (cloneNodes.length) {
                removeNodes.forEach(r => r.remove());
                this.localWork?.drawLayer?.append(...cloneNodes);
            }
        }
        else {
            const cloneNodes = [];
            const removeNodes = [];
            this.localWork?.drawLayer?.children.filter(c => c.name !== SelectorShape.selectorId && !workShapeNode.selectIds?.includes(c.name)).forEach(c => {
                const cNode = c.cloneNode(true);
                cloneNodes.push(cNode);
                removeNodes.push(c);
            });
            if (cloneNodes.length) {
                removeNodes.forEach(r => r.remove());
                this.localWork?.fullLayer?.append(...cloneNodes);
            }
        }
        if (willRefreshSelector) {
            //console.log('render', this.localWork?.fullLayer.children, this.localWork?.drawLayer?.children)
            this.localWork?._post({
                render: [
                    {
                        rect,
                        drawCanvas: ECanvasShowType.Selector,
                        clearCanvas: ECanvasShowType.Selector,
                        isClear: true,
                        isFullWork: false,
                    }
                ],
                sp: [{
                        type: EPostMessageType.Select,
                        selectIds: workShapeNode.selectIds,
                        opt: workShapeNode.getWorkOptions(),
                        padding: SelectorShape.SelectBorderPadding,
                        selectRect: workShapeNode.oldSelectRect,
                        nodeColor: workShapeNode.nodeColor,
                        willSyncService: false,
                        isSync: true
                    }]
            });
        }
    }
}
