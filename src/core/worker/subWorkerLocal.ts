import { IWorkerMessage, IRectType, IMainMessage, EToolsKey, IworkId, ECanvasShowType, EPostMessageType } from "..";
import { transformToNormalData } from "../../collector/utils";
import { LaserPenOptions, SelectorShape } from "../tools";
import { computRect } from "../utils";
import { LocalWork, ISubWorkerInitOption } from "./base";

export class LocalWorkForSubWorker extends LocalWork {
    private animationWorkRects?: Map<IworkId, {
        res: IMainMessage,
        canDel: boolean,
        isRect: boolean;
    }> = new Map();
    protected combineDrawTimer?: number;
    private animationId?: number | undefined;
    private closeAnimationTime: number = 1100;
    private runLaserPenStep:number = 0;
    constructor(opt:ISubWorkerInitOption){
        super(opt);
    }
    runFullWork(data: IWorkerMessage): IRectType | undefined {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            const rect = workShape.consumeService({
                op, 
                isFullWork: true,
                replaceId: workShape.getWorkId()?.toString()
            });
            const rect1 = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt)
            data.workId && this.workShapes.delete(data.workId)
            return rect1 || rect;
        }
    }
    runSelectWork(data: IWorkerMessage): undefined {
        const workShape = this.setFullWork(data);
        if(workShape && data.selectIds?.length && data.workId){
            (workShape as SelectorShape).selectServiceNode(data.workId.toString(), {selectIds:data.selectIds});
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
            const result = workShapeNode.consume({data, isFullWork: false, isClearAll:true, isSubWorker:true});
            switch (toolsType) {
                case EToolsKey.LaserPen:
                    if (result?.rect) {
                        this.animationWorkRects?.set(workId,{
                            res: result,
                            canDel: false,
                            isRect: true,
                        });
                    }
                    this.runLaserPenAnimation();
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:  
                    if (result) {
                        this.drawCount++;
                        this.drawArrow(result)
                    }
                    break;
                case EToolsKey.Pencil:
                    if (result) {
                        this.drawCount++;
                        this.drawPencil(result);
                    }
                    break;
                default:
                    break;
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
            switch (toolsType) {
                case EToolsKey.LaserPen:
                    if (this.animationId) {
                        const result = workShapeNode.consumeAll({ data});
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
                    }
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Pencil:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon: 
                case EToolsKey.SpeechBalloon:   
                    this.drawCount = 0;
                    this.fullLayer.removeAllChildren();
                    this.clearWorkShapeNodeCache(workId);
                    break;           
                default:
                    break;
            }
        }
        return ;
    }
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
                            viewId:this.viewId
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
                viewId:this.viewId
            }],
            sp: res?.op && [res]
        });
    }
    private drawArrow(res:IMainMessage) {
        this._post({
            drawCount: this.drawCount,
            render: [{
                rect: res?.rect,
                drawCanvas: ECanvasShowType.Float,
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId:this.viewId
            }]
        });
    }
}