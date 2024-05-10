import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethodForWorker } from "../baseForWorker";
import { IMainMessage, IMainMessageRenderData, IRectType, IWorkerMessage, IworkId } from "../../types";
import { ECanvasShowType, EDataType, EPostMessageType, EToolsKey } from "../../enum";
import { SelectorShape } from "../../tools";
import { computRect } from "../../utils";

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
        const {removeIds, willRefresh, willSyncService, viewId} = data;
        if (!removeIds?.length) {
            return;
        }
        let rect:IRectType|undefined;
        const sp:IMainMessage[] = [];
        const render:IMainMessageRenderData[] = [];
        const removes:string[] = [];
        for (const workId of removeIds) {
            if (workId === SelectorShape.selectorId) {
                const workShapeNode = this.localWork.workShapes.get(SelectorShape.selectorId) as SelectorShape;
                if (!workShapeNode) {
                    return;
                }
                const selectIds = workShapeNode.selectIds && [...workShapeNode.selectIds] || [];
                for (const key of selectIds) {
                    const info = this.localWork.vNodes.get(key);
                    if (info) {
                        const ms = this.commandDeleteText(key);
                        ms && sp.push(ms)
                    }
                    rect = computRect(rect, this.localWork.removeNode(key));
                    removes.push(key);
                }
                const r = workShapeNode?.updateSelectIds([]);
                rect = computRect(rect, r.bgRect);
                this.localWork.clearWorkShapeNodeCache(SelectorShape.selectorId);
                this.localWork.workShapes.delete(SelectorShape.selectorId);
                sp.push({
                    type: EPostMessageType.Select,
                    selectIds:[],
                    willSyncService
                });
                continue;
            }
            const ms = this.commandDeleteText(workId);
            ms && sp.push(ms)
            rect = computRect(rect, this.localWork.removeNode(workId));
            removes.push(workId);
        }
        if (willSyncService) {
            sp.push({
                type: EPostMessageType.RemoveNode,
                removeIds:removes,
                undoTickerId: data.undoTickerId
            })
        }

        if(rect && willRefresh) {
            render.push({
                rect,
                drawCanvas: ECanvasShowType.Bg,
                clearCanvas: ECanvasShowType.Bg,
                isClear: true,
                isFullWork: true,
                viewId
            })
        }
        if(render.length || sp.length) {
            this.localWork._post({
                render,
                sp
            })
        }
    }
    consumeForServiceWorker(data: IWorkerMessage){
        if (!this.serviceWork) {
            return;
        }
        this.serviceWork.removeSelectWork(data)
    }
    private commandDeleteText(workId: string){
        const curNode = this.localWork?.vNodes.get(workId);
        if (curNode && curNode.toolsType === EToolsKey.Text) {
            return {
                type: EPostMessageType.TextUpdate,
                toolsType: EToolsKey.Text,
                workId,
                dataType: EDataType.Local
            }    
        }
    }
}