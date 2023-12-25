/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Path } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, BaseNodeMapItem } from "../types";
import { computRect } from "../utils";

export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export class EraserShape extends BaseShapeTool{
    updataOptService(): IRectType | undefined {
      return ;
    }
    protected syncTimestamp: number;
    readonly toolsType: EToolsKey = EToolsKey.Eraser;
    protected tmpPoints: Array<number> = [];
    protected workOptions: EraserOptions;
    private removeIds:Array<string>= [];
    public worldPosition:[number, number];
    public worldScaling:[number, number];
    constructor(workOptions: EraserOptions, fullLayer: Group) {
      super(fullLayer);
      this.workOptions = workOptions as EraserOptions;
      this.syncTimestamp = 0;
      this.worldPosition = this.fullLayer.worldPosition as [number, number];
      this.worldScaling = this.fullLayer.worldScaling as [number, number];
    }
    combineConsume() {
      return undefined
    }
    public consumeService(): IRectType | undefined {
      return undefined;
    }
    computNodeMap(nodeMaps: Map<string, BaseNodeMapItem>) {
      this.fullLayer.children.forEach(c => {
        const d = nodeMaps.get(c.name);
        if (!d) {
            let rect: IRectType | undefined;
            this.fullLayer.getElementsByName(c.name).forEach(f => {
                const r = (f as Path)?.getBoundingClientRect();
                if (r) {
                  rect = computRect(rect, {
                    x: Math.floor(r.x),
                    y: Math.floor(r.y),
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                  })
                }
            })
            if (rect) {
                nodeMaps.set(c.name,{
                    rect,
                    name: c.name,
                    layer: c.parent
                })
            }
        }
      })
  }
    public setWorkOptions(setWorkOptions: EraserOptions) {
        super.setWorkOptions(setWorkOptions);
        this.syncTimestamp = Date.now();
    }
    public consume(props:{data: IWorkerMessage, nodeMaps: Map<string, BaseNodeMapItem>}): IMainMessage {
      const {op, workState} = props.data;
      if(!op || op.length === 0){
        return { type: EPostMessageType.None}
      }
      if (props.nodeMaps && workState === EvevtWorkState.Start) {
        props.nodeMaps && this.computNodeMap(props.nodeMaps);
      }
      if (props.nodeMaps) {
        const {rect, removeIds} = this.remove(op, props.nodeMaps);
        if (rect && removeIds.length) {
          return {
            type: EPostMessageType.RemoveNode,
            dataType: EDataType.Local,
            rect,
            removeIds
          }
        }
      }
      return {
        type: EPostMessageType.None
      }
    }
    private remove(op:number[], nodeMaps: Map<string, BaseNodeMapItem>): {
      rect:IRectType | undefined,
      removeIds: Array<string>
    } {
        const { isLine } = this.workOptions;
        let rect:IRectType|undefined;
        const removeIds: Array<string> = [];
        for (let i = 0; i < op.length; i+=2) {
          const x = op[i] * this.worldScaling[0] + this.worldPosition[0];
          const y = op[i+1] * this.worldScaling[1] + this.worldPosition[1];
          nodeMaps.forEach((node)=>{
            const n = node.layer.getElementById(node.name);
            if(n?.isPointCollision(x, y)) {
              rect = computRect(rect, node.rect);
              n.remove();
              if (isLine) {
                removeIds.push(n.name);
                this.removeIds.push(n.name);
              } else {
                // todo 需要切割分段
                // (n as Path).getPathLength();
              }
            }
          })
        }
        return {rect, removeIds};
    }
    public consumeAll(props:{data: IWorkerMessage, nodeMaps: Map<string, BaseNodeMapItem>}): IMainMessage {
      return this.consume(props);
    }
    public clearTmpPoints(): void {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
    }
}