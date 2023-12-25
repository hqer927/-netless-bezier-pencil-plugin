import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IRectType, IWorkerMessage, IworkId } from "../../types";
import { ECanvasShowType, EDataType, EPostMessageType } from "../../enum";
import { SelectorShape } from "../../tools";
import { Layer, Path } from "spritejs";
import { getPathRect } from "../../utils";

export type DeleteNodeEmtData = {
    workIds: IworkId[]
}
export class DeleteNodeMethodForWorker extends BaseMsgMethodForWorker {
    readonly emitEventType: EmitEventType = EmitEventType.DeleteNode;
    consume(data: IWorkerMessage): boolean | undefined {
        const {msgType, dataType, emitEventType} = data;
        if (msgType !== EPostMessageType.RemoveNode) return;
        if (dataType === EDataType.Local && emitEventType === this.emitEventType) {
            this.consumeForLocalWorker(data);
            this.localWork?.computNodeMap();
            return true;
        }
        if (dataType === EDataType.Service && emitEventType === this.emitEventType) {
            this.consumeForServiceWorker(data);
            return true;
        }    
    }
    consumeForLocalWorker(data: IWorkerMessage): void {
        if (!this.localWork) {
            return;
        }
        const {workId, willRefresh} = data;
        if (!workId) {
            return;
        }
        let rect:IRectType | undefined;
        const workShape = this.localWork.workShapes.get(workId);
        if (workShape && workId === SelectorShape.selectorId) {
            const selectIds = (workShape as SelectorShape).selectIds;
            selectIds?.forEach(name=>{
                this.localWork?.drawLayer?.getElementsByName(name).forEach(n => {
                    n.remove();
                })
            })
            rect = (workShape as SelectorShape).oldRect;
            (this.localWork.drawLayer?.parent as Layer)?.getElementById(SelectorShape.selectorId)?.remove();
            this.localWork.workShapes.delete(SelectorShape.selectorId);
        } else if (workId) {
            this.localWork.fullLayer.getElementsByName(workId.toString()).concat(this.localWork?.drawLayer?.getElementsByName(workId.toString())??[]).forEach(item=>{
                rect = getPathRect((item as Path), rect, 10);
                item.remove();
                console.log('consumeForLocalWorker', item.name)
            })
            if(rect){
                rect = {
                    x: rect.x - this.localWork?.fullLayer.worldPosition[0],
                    y: rect.y - this.localWork?.fullLayer.worldPosition[1],
                    w: rect.w,
                    h: rect.h,
                }
            }
        }
        if(rect && willRefresh) {
            this.localWork._post({
                render: {
                    rect,
                    drawCanvas: ECanvasShowType.Bg,
                    clearCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    isFullWork: true,
                }
            })
        }
    }
    consumeForServiceWorker(data: IWorkerMessage){
        if (!this.serviceWork) {
            return;
        }
        this.serviceWork.removeSelectWork(data)
    }
}