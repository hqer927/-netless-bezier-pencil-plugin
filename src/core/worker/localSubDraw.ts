import { SubLocalWork } from "../base";
import { ECanvasShowType, EToolsKey } from "../enum";
import { BaseShapeTool } from "../tools";
import { LaserPenOptions } from "../tools/laserPen";
import { IWorkerMessage, IMainMessage, IworkId, IRectType, IBatchMainMessage } from "../types";
import { computRect } from "../utils";

export class SubLocalDrawWorkForWorker extends SubLocalWork {
    protected workShapes: Map<IworkId, BaseShapeTool> = new Map();
    protected combineDrawTimer?: number;
    private drawCount: number = 0;
    private _post:(msg: IBatchMainMessage) => void;
    private animationWorkRects?: Map<IworkId, {
        rect: IRectType,
        canDel: boolean
    }> = new Map();
    private animationId?: number | undefined;
    private closeAnimationTime: number = 1000;
    constructor(layer: spritejs.Layer, postFun: (msg: IBatchMainMessage)=>void) {
        super(layer);
        this._post = postFun;
    }
    private runLaserPenAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(() => {
                let rect:IRectType | undefined;
                this.animationWorkRects?.forEach((value, key, map)=>{
                    rect = computRect(rect, value.rect);
                    if (value.canDel) {
                        map.delete(key);
                    }
                })
                this.animationId = undefined;
                if (this.animationWorkRects?.size) {
                    this.runLaserPenAnimation();
                }
                Promise.resolve(rect).then((rect) => {
                    this._post({
                        render: {
                            rect,
                            drawCanvas: ECanvasShowType.Float,
                            isClear: true,
                            clearCanvas: ECanvasShowType.Float,
                            isFullWork: false,
                        }
                    });
                });
            });
        }
    }
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined {
        const {op, workId} = data;
        if(op?.length && workId){
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            const result = workShapeNode.consume(data,false);
            if (toolsType === EToolsKey.LaserPen) {
                if (result?.rect) {
                    this.animationWorkRects?.set(workId,{
                        rect: result.rect,
                        canDel: false
                    });
                }
                this.runLaserPenAnimation();
                return;
            }
            if (result) {
                this.drawCount++;
                result.drawCount = this.drawCount;
            }
            return result;
        }
    }
    consumeDrawAll(data: IWorkerMessage): undefined {
        const {workId} = data;
        if (workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen && this.animationId) {
                workShapeNode.consumeAll(data);
                this.closeAnimationTime = (workShapeNode.getWorkOptions() as LaserPenOptions)?.duration || this.closeAnimationTime;
                setTimeout(() => {                   
                    this.fullLayer.getElementsByName(workId.toString()).map(p => p.remove());
                    this.clearWorkShapeNodeCache(workId);
                    const rectData = this.animationWorkRects?.get(workId);
                    if (rectData) {
                        rectData.canDel = true;
                    }
                }, this.closeAnimationTime * 1000 + 100);
                return;
            }
            if ( toolsType === EToolsKey.Pencil){
                this.drawCount = 0;
                this.fullLayer.removeAllChildren();
                this.clearWorkShapeNodeCache(workId);
            }
        }
        return ;
    }
}