import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IWorkerMessage } from "../../types";
import { ECanvasShowType, EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
import { isIntersect, isSealedGroup } from "../../utils";
import { Group, Path } from "spritejs";


export class ZIndexActiveMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.ZIndexActive;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.UpdateNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            return true;
        }        
    }
    consumeForLocalWorker(data: IWorkerMessage): void {
        const {workId, isActiveZIndex, willRefreshSelector} = data;
        if(workId !== SelectorShape.selectorId) {
            return;
        }
        const workShapeNode = this.localWork?.workShapes.get(SelectorShape.selectorId) as SelectorShape;
        if (!workShapeNode) {
            return;
        }
        const rect = workShapeNode.oldSelectRect;
        if (isActiveZIndex && rect && this.localWork) {
            const sealToDrawIds:Set<string> = new Set();
            this.localWork.vNodes.curNodeMap.forEach((value, key)=>{
                if (isIntersect(rect, value.rect)) {
                    sealToDrawIds.add(key)
                }
            })
            if (sealToDrawIds.size) {
                const sealToDrawNodes: (Path | Group)[] = [];
                sealToDrawIds.forEach(name => {
                    this.localWork?.fullLayer.getElementsByName(name).forEach(c=>{
                        const cloneP = c.cloneNode(true) as (Path | Group);
                        if (isSealedGroup(c)) {
                            (cloneP as Group).seal();
                        }
                        if (!this.localWork?.drawLayer?.getElementsByName(name).length) {
                            sealToDrawNodes.push(cloneP);
                        }
                    })
                });
                if (sealToDrawNodes.length) {
                    this.localWork.drawLayer?.append(...sealToDrawNodes);
                }
            }
        } else {
            this.localWork?.drawLayer?.children.filter( c => !workShapeNode.selectIds?.includes(c.name)).forEach(r=>r.remove());
        }
        if (willRefreshSelector) {
            // console.log('render', rect, workShapeNode.selectIds, this.localWork?.fullLayer.children.map(n=>n.name), this.localWork?.drawLayer?.children.map(n=>n.name))
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
                sp:[{
                    type: EPostMessageType.Select,
                    selectIds: workShapeNode.selectIds,
                    opt: workShapeNode.getWorkOptions(),
                    selectRect: rect,
                    strokeColor: workShapeNode.strokeColor,
                    fillColor: workShapeNode.fillColor,
                    willSyncService:false, 
                    isSync:true
                }]
            })
        }
         
    }
}