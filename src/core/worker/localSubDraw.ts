import { Group } from "spritejs";
import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey } from "../enum";
import { BaseShapeTool } from "../tools";
import { LaserPenOptions } from "../tools/laserPen";
import { IWorkerMessage, IMainMessage, IworkId, IRectType, IBatchMainMessage } from "../types";
import { computRect } from "../utils";

export class SubLocalDrawWorkForWorker extends SubLocalWork {
    _post: (msg: IBatchMainMessage) => void;
    protected workShapes: Map<IworkId, BaseShapeTool> = new Map();
    protected combineDrawTimer?: number;
    private drawCount: number = 0;
    private animationWorkRects?: Map<IworkId, {
        res: IMainMessage,
        canDel: boolean
    }> = new Map();
    private animationId?: number | undefined;
    private closeAnimationTime: number = 1000;
    constructor(layer: Group, postFun: (msg: IBatchMainMessage)=>void) {
        super(layer);
        this._post = postFun;
    }
    blurSelector(): void {}
    private runLaserPenAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(() => {
                let rect:IRectType | undefined;
                const sp: IMainMessage[] = []; 
                this.animationWorkRects?.forEach((value, key, map)=>{
                    rect = computRect(rect, value.res.rect);
                    if (value.res.workId) {
                        sp.push(value.res);
                    }
                    if (value.canDel) {
                        map.delete(key);
                    }
                })
                this.animationId = undefined;
                if (this.animationWorkRects?.size) {
                    this.runLaserPenAnimation();
                }
                this._post({
                    render: {
                        rect,
                        drawCanvas: ECanvasShowType.Float,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Float,
                        isFullWork: false,
                    },
                    sp: sp.length ? sp : undefined
                });
            });
        }
    }
    private drawPencil(res:IMainMessage) {
        this._post({
            drawCount: this.drawCount,
            render: {
                rect: res?.rect,
                drawCanvas: ECanvasShowType.Float,
                isClear: false,
                isFullWork: false,
            },
            sp: res?.op && [res]
        });
    }
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined {
        const {op, workId} = data;
        if(op?.length && workId){
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            const result = workShapeNode.consume({data,isFullWork: false});
            if (toolsType === EToolsKey.LaserPen) {
                if (result?.rect) {
                    this.animationWorkRects?.set(workId,{
                        res: result,
                        canDel: false
                    });
                }
                this.runLaserPenAnimation();
                return;
            }
            if (result) {
                this.drawCount++;
                this.drawPencil(result);
            }
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
                const result = workShapeNode.consumeAll({data});
                if (result?.op) {
                    this._post({
                        sp: [result]
                    });
                }
                this.closeAnimationTime = (workShapeNode.getWorkOptions() as LaserPenOptions)?.duration || this.closeAnimationTime;
                setTimeout(() => {                   
                    this.fullLayer.getElementsByName(workId.toString()).map(p => p.remove());
                    this.clearWorkShapeNodeCache(workId);
                    const rectData = this.animationWorkRects?.get(workId);
                    if (rectData) {
                        rectData.canDel = true;
                    }
                    this._post({
                        sp: [{
                            removeIds:[workId.toString()],
                            type: EPostMessageType.RemoveNode,
                        }]
                    });
                }, this.closeAnimationTime * 2000 + 500);
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