import type { Group } from "spritejs";
import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey } from "../enum";
import { BaseShapeTool, SelectorShape } from "../tools";
import { LaserPenOptions } from "../tools/laserPen";
import { IWorkerMessage, IMainMessage, IworkId, IRectType, IBatchMainMessage, BaseNodeMapItem } from "../types";
import { computRect } from "../utils";
import { transformToNormalData } from "../../collector/utils";

export class SubLocalDrawWorkForWorker extends SubLocalWork {
    _post: (msg: IBatchMainMessage) => Promise<void>;
    protected workShapes: Map<IworkId, BaseShapeTool> = new Map();
    protected combineDrawTimer?: number;
    private drawCount: number = 0;
    private animationWorkRects?: Map<IworkId, {
        res: IMainMessage,
        canDel: boolean,
        isRect: boolean;
    }> = new Map();
    private animationId?: number | undefined;
    private closeAnimationTime: number = 1100;
    private runLaserPenStep:number = 0;
    constructor(curNodeMap: Map<string, BaseNodeMapItem>,layer: Group, postFun: (msg: IBatchMainMessage)=> Promise<void>) {
        super(curNodeMap, layer);
        this._post = postFun;
    }
    blurSelector(): void {}
    private runLaserPenAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(() => {
                this.animationId = undefined;
                this.runLaserPenStep++;
                if (this.runLaserPenStep > 1) {
                    this.runLaserPenStep = 0;
                    this.runLaserPenAnimation();
                    return;
                }
                let rect:IRectType | undefined;
                const sp: IMainMessage[] = [];
                this.animationWorkRects?.forEach((value, key, map)=>{
                    if (value.isRect) {
                        rect = computRect(rect, value.res.rect)
                    }
                    if (value.res.workId) {
                        sp.push(value.res);
                    }
                    const hasRect = this.fullLayer.getElementsByName(key.toString()).length;
                    if (hasRect) {
                        value.isRect = true;
                    } else {
                        value.isRect = false;
                    }
                    if (value.canDel) {
                        map.delete(key);
                    }
                })
                if (this.animationWorkRects?.size) {
                    this.runLaserPenAnimation();
                }
                if (rect) {
                    this._post({
                        render: [{
                            rect,
                            drawCanvas: ECanvasShowType.Float,
                            isClear: true,
                            clearCanvas: ECanvasShowType.Float,
                            isFullWork: false,
                        }],
                        sp
                    });
                }
            });
        }
    }
    private drawPencil(res:IMainMessage) {
        this._post({
            drawCount: this.drawCount,
            render: [{
                rect: res?.rect,
                drawCanvas: ECanvasShowType.Float,
                isClear: false,
                isFullWork: false,
            }],
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
            const result = workShapeNode.consume({data,isFullWork: false, isClearAll:true, isSubWorker:true});
            if (toolsType === EToolsKey.LaserPen) {
                if (result?.rect) {
                    this.animationWorkRects?.set(workId,{
                        res: result,
                        canDel: false,
                        isRect: true,
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
                    if (result?.rect) {
                        this.animationWorkRects?.set(workId,{
                            res: result,
                            canDel: false,
                            isRect: true,
                        });
                        this.runLaserPenAnimation();
                    }
                    this._post({
                        sp: [result]
                    });
                }
                const duration = (workShapeNode.getWorkOptions() as LaserPenOptions)?.duration;
                this.closeAnimationTime = duration ?  duration * 1000 + 100 : this.closeAnimationTime;
                setTimeout(() => {                   
                    this.fullLayer.getElementsByName(workId.toString()).map(p => p.remove());
                    this.clearWorkShapeNodeCache(workId);
                    const rectData = this.animationWorkRects?.get(workId);
                    if (rectData) {
                        rectData.canDel = true;
                    }
                    setTimeout(()=>{
                        this._post({
                            sp: [{
                                removeIds:[workId.toString()],
                                type: EPostMessageType.RemoveNode,
                            }]
                        });
                    }, workShapeNode.getWorkOptions().syncUnitTime || this.closeAnimationTime )
                }, this.closeAnimationTime);
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
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>){
        const {workId, opt, toolsType} = data;
        if (workId && opt && toolsType) {
            const curWorkShapes = (workId && this.workShapes.get(workId)) || this.createWorkShapeNode({
                toolsOpt:opt,
                toolsType
            })
            if (!curWorkShapes) {
                return;
            }
            curWorkShapes.setWorkId(workId);
            this.workShapes.set(workId, curWorkShapes);
            return curWorkShapes
        }
    }
    runFullWork(data: IWorkerMessage): undefined {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            workShape.consumeService({
                op, 
                isFullWork: true,
                replaceId: workShape.getWorkId()?.toString()
            });
            data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt)
            data.workId && this.workShapes.delete(data.workId)
        }
    }
    runSelectWork(data: IWorkerMessage): undefined {
        const workShape = this.setFullWork(data);
        if(workShape && data.selectIds?.length && data.workId){
            (workShape as SelectorShape).selectServiceNode(data.workId.toString(), {selectIds:data.selectIds}, this.curNodeMap);
        }
    }
}