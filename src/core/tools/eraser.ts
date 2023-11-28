/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layer, Path } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import { computRect } from "../utils";

export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export class EraserShape extends BaseShapeTool{
    protected syncTimestamp: number;
    readonly toolsType: EToolsKey = EToolsKey.Eraser;
    protected tmpPoints: Array<number> = [];
    protected workOptions: EraserOptions;
    private removeIds:Array<string>= [];
    constructor(workOptions: EraserOptions, fullLayer: Layer) {
      super(fullLayer);
      this.workOptions = workOptions as EraserOptions;
      this.syncTimestamp = 0;
    }
    combineConsume() {
      return undefined
    }
    public consumeService(): IRectType | undefined {
      return undefined;
    }
    public setWorkOptions(setWorkOptions: EraserOptions) {
        super.setWorkOptions(setWorkOptions);
        this.syncTimestamp = Date.now();
    }
    public consume(data: IWorkerMessage): IMainMessage {
      const {op} = data;
      if(!op || op.length === 0){
        return { type: EPostMessageType.None}
      }
      const {rect, removeIds} = this.remove(op);
      if (rect && removeIds.length) {
        return {
          type: EPostMessageType.RemoveNode,
          dataType: EDataType.Local,
          rect,
          removeIds
        }
      }
      return {
        type: EPostMessageType.None
      }
    }
    private remove(op:number[]): {
      rect:IRectType | undefined,
      removeIds: Array<string>
    } {
        const { isLine } = this.workOptions;
        let rect:IRectType|undefined;
        const removeIds: Array<string> = [];
        for (let i = 0; i < op.length; i+=2) {
          const x = op[i];
          const y = op[i+1];
          this.fullLayer.children.forEach(n => {
            if(n.isPointCollision(x, y)) {
              this.fullLayer.getElementsByName(n.name).forEach(f=>{
                const r = (f as Path)?.getBoundingClientRect();
                if (r) {
                  rect =  computRect(rect, {
                    x:r.x - 10,
                    y:r.y - 10,
                    w:r.width + 20,
                    h:r.height + 20,
                  })
                }
                f.remove();
              })
              if (isLine) {
                removeIds.push(n.name);
                this.removeIds.push(n.name);
              } else {
                // todo 需要切割分段
              }
            }
          });
        }
        return {rect, removeIds};
    }
    public consumeAll(data: IWorkerMessage): IMainMessage {
      return this.consume(data);
    }
    public clearTmpPoints(): void {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
    }
}