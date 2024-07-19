import { Path, Scene } from "spritejs";
import { IWorkerMessage, IRectType, IMainMessage, EToolsKey, ECanvasShowType, IMainMessageRenderData, EPostMessageType, EDataType } from "..";
import { transformToNormalData } from "../../collector/utils";
import { BaseShapeTool, ImageShape, SelectorShape } from "../tools";
import { computRect, getSafetyRect } from "../utils";
import { LocalWork, ISubWorkerInitOption } from "./base";
import { TextShape } from "../tools/text";
import { Storage_Selector_key } from "../../collector/const";

export class LocalWorkForSubWorker extends LocalWork {
    private drawWorkActiveId?: string;
    constructor(opt:ISubWorkerInitOption){
        super(opt);
    }
    async runFullWork(data: IWorkerMessage): Promise<IRectType | undefined> {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            let rect:IRectType|undefined;
            let updataOptRect:IRectType|undefined;
            const replaceId = workShape.getWorkId()?.toString();
            if (workShape.toolsType === EToolsKey.Image) {
                rect = await (workShape as ImageShape).consumeServiceAsync({
                    isFullWork: true,
                    scene: this.fullLayer.parent?.parent as Scene,
                });
            } else if(workShape.toolsType === EToolsKey.Text) {
                rect = await (workShape as TextShape).consumeServiceAsync({
                    isFullWork: true,
                    replaceId,
                    isDrawLabel: true
                });
            } else  {
                rect = workShape.consumeService({
                    op, 
                    isFullWork: true,
                    replaceId,
                });
                updataOptRect = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt)
            }
            data.workId && this.workShapes.delete(data.workId.toString())
            return computRect(rect, updataOptRect);
        }
    }
    runSelectWork(data: IWorkerMessage): undefined {
        const workShape = this.setFullWork(data);
        if(workShape && data.selectIds?.length && data.workId){
            (workShape as SelectorShape).selectServiceNode(data.workId.toString(), {selectIds:data.selectIds},false);
        }
    }
    workShapesDone(){
        for (const key of this.workShapes.keys()) {
            this.clearWorkShapeNodeCache(key);
        }
        this.fullLayer.removeAllChildren();
    }
    async consumeDraw(data: IWorkerMessage) {
        const {workId} = data;
        const workStr = workId?.toString();
        const workShapeNode = workStr && this.workShapes.get(workStr);
        if (!workShapeNode) {
            return
        }
        // 如果将要绘制的工具已经不是当前工具，先完结当前工具的绘制
        if (this.drawWorkActiveId && this.drawWorkActiveId !== workStr) {
            await this.consumeDrawAll({
                workId: this.drawWorkActiveId,
                viewId: this.viewId,
                msgType: EPostMessageType.DrawWork,
                dataType: EDataType.Local
            })
            this.drawWorkActiveId = undefined;
        }
        if (!this.drawWorkActiveId && workStr !== Storage_Selector_key) {
            this.drawWorkActiveId = workStr;
        }
        const toolsType = workShapeNode.toolsType;
        const result = workShapeNode.consume({data, drawCount:this.drawCount, isFullWork: true, isSubWorker:true});
        switch (toolsType) {
            case EToolsKey.Arrow:
            case EToolsKey.Straight:
            case EToolsKey.Ellipse:
            case EToolsKey.Rectangle:
            case EToolsKey.Star:
            case EToolsKey.Polygon:
            case EToolsKey.SpeechBalloon:{
                if (result) {
                    this.drawCount++;
                    await this.drawArrow(result)
                }
                break;
            }
            case EToolsKey.Pencil:{
                if (result) {
                    this.drawCount++;
                    await this.drawPencil(result, workId?.toString());
                }
                break;
            }
            default:
                break;
        }
    }
    async consumeDrawAll(data: IWorkerMessage) {
        const {workId} = data;
        if (workId) {
            const workIdStr = workId.toString();
            if (this.drawWorkActiveId === workIdStr) {
                this.drawWorkActiveId = undefined;
            }
            const workShapeNode = this.workShapes.get(workIdStr);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            switch (toolsType) {
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
                    this.clearWorkShapeNodeCache(workIdStr);
                    break;           
                default:
                    break;
            }
        }
        return ;
    }
    async removeWork(data:IWorkerMessage) {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            const rect = this.removeNode(key);
            if (rect) {
                const render: IMainMessageRenderData[] = [];
                render.push({
                    rect: getSafetyRect(rect),
                    clearCanvas: ECanvasShowType.Float,
                    isClear: true,
                    viewId: this.viewId
                },
                {
                    rect: getSafetyRect(rect),
                    drawCanvas: ECanvasShowType.Float,
                    viewId: this.viewId
                })
                await this._post({
                    render
                })
            }
        }
    }
    private removeNode(key:string){
        const hasWorkShape = this.workShapes.has(key);
        let rect:IRectType|undefined;
        if (hasWorkShape) {
            this.fullLayer.getElementsByName(key).forEach(node=>{
                const r = (node as Path).getBoundingClientRect();
                rect = computRect(rect, {
                    x: r.x - BaseShapeTool.SafeBorderPadding,
                    y: r.y - BaseShapeTool.SafeBorderPadding,
                    w: r.width + BaseShapeTool.SafeBorderPadding * 2,
                    h: r.height + BaseShapeTool.SafeBorderPadding * 2,
                });
                node.remove();
            });
            if (rect) {
                this.clearWorkShapeNodeCache(key);
            }
        }
        return rect;
    }
    private async drawPencil(res:IMainMessage, workId?:string) {
        await this._post({
            drawCount: this.drawCount,
            render: [{
                rect: res?.rect,
                workId,
                drawCanvas: ECanvasShowType.Float,
                viewId: this.viewId,
            }],
            sp: res?.op && [res]
        });
    }
    private async drawArrow(res:IMainMessage) {
        await this._post({
            drawCount: this.drawCount,
            render: [{
                rect: res?.rect && getSafetyRect(res.rect),
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                viewId:this.viewId
            },{
                rect: res?.rect && getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Float,
                viewId:this.viewId
            }]
        });
    }
}