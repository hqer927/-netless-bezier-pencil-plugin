import { Group, Label, Polyline, Scene } from "spritejs";
import { IWorkerMessage, IRectType, IMainMessage, EToolsKey, IworkId, ECanvasShowType, EPostMessageType } from "..";
import { BaseCollectorReducerAction } from "../../collector/types";
import { transformToNormalData } from "../../collector/utils";
import { ImageShape, LaserPenOptions, SelectorShape } from "../tools";
import { computRect, getSafetyRect } from "../utils";
import { LocalWork, ISubWorkerInitOption } from "./base";
import { TextOptions } from "../../component/textEditor";

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
    async runFullWork(data: IWorkerMessage, isDrawLabel?:boolean): Promise<IRectType | undefined> {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            let rect:IRectType|undefined;
            if (workShape.toolsType === EToolsKey.Image) {
                rect = await (workShape as ImageShape).consumeServiceAsync({
                    isFullWork: true,
                    scene: this.fullLayer.parent?.parent as Scene,
                });
            } else {
                rect = workShape.consumeService({
                    op, 
                    isFullWork: true,
                    replaceId: workShape.getWorkId()?.toString(),
                    isDrawLabel
                });
            }
            const rect1 = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt)
            data.workId && this.workShapes.delete(data.workId)
            return rect1 || rect;
        }
    }
    runSelectWork(data: IWorkerMessage): undefined {
        const workShape = this.setFullWork(data);
        if(workShape && data.selectIds?.length && data.workId){
            (workShape as SelectorShape).selectServiceNode(data.workId.toString(), {selectIds:data.selectIds},false);
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
                                this.runLaserPenAnimation(result);
                            }
                            // console.log('consumeDrawAll', result)
                            // this._post({
                            //     sp: [result]
                            // });
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
                            // console.log('consumeDrawAll--1', workShapeNode.getWorkOptions().syncUnitTime || this.closeAnimationTime)
                            setTimeout(()=>{
                                // console.log('consumeDrawAll--2')
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
    updateLabels(labelGroup:Group, value:BaseCollectorReducerAction){
        labelGroup.children.forEach((label:Label|Polyline)=>{
            if (label.tagName === 'LABEL') {
                const name = (label as Label).name;
                const {width} = label.getBoundingClientRect();
                const [scaleX] = labelGroup.worldScaling as [number,number];
                // console.log('textOpt.text--3', width);
                const {underline,lineThrough}= value.opt as TextOptions;
                if (underline) {
                    const underlineNode = labelGroup.getElementsByName(`${name}_underline`)[0] as Polyline;
                    underlineNode.attr({
                        points:[0,0,width/scaleX,0],
                    })
                }
                if (lineThrough) {
                    const lineThroughNode = labelGroup.getElementsByName(`${name}_lineThrough`)[0] as Polyline;
                    lineThroughNode.attr({
                        points:[0,0,width/scaleX,0],
                    })
                }
            }
        })
    }
    private runLaserPenAnimation(result?:IMainMessage) {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(() => {
                this.animationId = undefined;
                this.runLaserPenStep++;
                if (this.runLaserPenStep > 1) {
                    this.runLaserPenStep = 0;
                    this.runLaserPenAnimation(result);
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
                    if(result) {
                        sp.push(result);
                    }
                    this._post({
                        render: [{
                            rect: getSafetyRect(rect),
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
                rect: res?.rect && getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Float,
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId:this.viewId
            }]
        });
    }
}