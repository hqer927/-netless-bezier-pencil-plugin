import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey } from "../enum";
import { BaseShapeTool } from "../tools";
import { IWorkerMessage, IMainMessage, IBatchMainMessage, IworkId } from "../types";

export class SubLocalWorkForWorker extends SubLocalWork {
    protected workShapes: Map<IworkId, BaseShapeTool> = new Map();
    private combineUnitTime: number = 600
    private combineTimerId?: number;
    private _post:(msg: IBatchMainMessage) => void;
    private drawCount:number = 0;
    constructor(layer: spritejs.Layer, drawLayer: spritejs.Layer, postFun: (msg: IBatchMainMessage)=>void) {
        super(layer, drawLayer);
        this._post = postFun;
    }
    private drawPencilCombine(workId:IworkId) {
        const result = this.workShapes.get(workId)?.combineConsume();
        if (result) {
            const combineDrawResult: IBatchMainMessage = {
                render: {
                    rect:result?.rect,
                    isClear: true,
                    drawCanvas: ECanvasShowType.Float,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                }
            };
            Promise.resolve(combineDrawResult).then((msg) => {
                msg.drawCount = this.drawCount;
                this._post(msg)
            });
        }
    }
    private drawEraser(res:IMainMessage) {
        Promise.resolve(res).then((result) => {
            // console.log('Promise', result)
            this._post({
                render: {
                    rect: result.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                },
                sp: [ result ]
            });
        });
    }
    consumeDraw(data: IWorkerMessage): IMainMessage | undefined {
        const {op, workId} = data;
        if (op?.length && workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            const toolsType = workShapeNode.toolsType;
            const result = workShapeNode.consume(data, true);
            if (toolsType === EToolsKey.Eraser) {
                if (result?.rect) {
                    this.drawEraser(result);
                }
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
                if(!this.combineTimerId) {
                    this.combineTimerId = setTimeout(() => {
                        this.combineTimerId = undefined;
                        this.drawPencilCombine(workId);
                    }, this.combineUnitTime) as unknown as number;
                }
                if (result) {
                    this.drawCount++;
                    result.drawCount = this.drawCount;
                }
            }
            return result;
        }
    }
    consumeDrawAll(data: IWorkerMessage): IMainMessage | undefined {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
        }
        const {workId} = data;
        if (workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return
            }
            this.drawCount = 0;
            const toolsType = workShapeNode.toolsType;
            const r = workShapeNode.consumeAll(data);
            if (toolsType === EToolsKey.Eraser) {
                if (r?.rect) {
                    this.drawEraser(r);
                }
                return;
            }
            this.clearWorkShapeNodeCache(workId);
            if (toolsType === EToolsKey.LaserPen) {
               setTimeout(() => {
                    this._post({
                        sp: [{
                            removeIds:[workId.toString()],
                            type: EPostMessageType.RemoveNode,
                        }]
                    });
               }, this.combineUnitTime);
            }
            return r;
        }
        
    }
}