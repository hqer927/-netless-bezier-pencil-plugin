/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Node } from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, BaseNodeMapItem } from "../types";
import { computRect, isIntersect } from "../utils";
// import { EStrokeType } from "../../plugin/types";
import { transformToNormalData } from "../../collector/utils";
import { Vec2d } from "../utils/primitives/Vec2d";
import lineclip from "lineclip";
import { EStrokeType } from "../../plugin/types";
import type { Size } from "white-web-sdk";


export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
type CurNodeMapItem = {
  name: string;
  rect: IRectType;
  polyline: Vec2d[];
  opt: BaseShapeOptions;
  toolsType: EToolsKey;
}
export class EraserShape extends BaseShapeTool{
    static SafeBorderPadding = 10;
    updataOptService(): IRectType | undefined {
      return ;
    }
    private static readonly eraserSizes: readonly Size[] = Object.freeze([
      Object.freeze({ width: 18, height: 26 }),
      Object.freeze({ width: 26, height: 34 }),
      Object.freeze({ width: 34, height: 50 }),
    ]);
    protected syncTimestamp: number;
    readonly toolsType: EToolsKey = EToolsKey.Eraser;
    protected tmpPoints: Array<number> = [];
    protected workOptions: EraserOptions;
    private removeIds:Array<string>= [];
    public worldPosition:[number, number];
    public worldScaling:[number, number];
    public eraserRect:IRectType | undefined;
    public eraserPolyline?:[number,number,number,number];
    public curNodeMap: Map<string, CurNodeMapItem> = new Map();
    constructor(workOptions: EraserOptions, fullLayer: Group) {
      super(fullLayer);
      this.workOptions = workOptions as EraserOptions;
      this.syncTimestamp = 0;
      this.worldPosition = this.fullLayer.worldPosition as [number, number];
      this.worldScaling = this.fullLayer.worldScaling as [number, number];
    }
    computNodeMap(nodeMaps: Map<string, BaseNodeMapItem>) {
        this.curNodeMap.clear();
        nodeMaps.forEach(v => {
          const c = this.fullLayer.getElementsByName(v.name)[0];
          const op = v.ops && transformToNormalData(v.ops);
          if (c && op.length) {
            const polyline:Vec2d[] = [];
            for (let i = 0; i < op.length; i+=3) {
              const p = new Vec2d(op[i] * this.worldScaling[0] + this.worldPosition[0], op[i+1] * this.worldScaling[1] + this.worldPosition[1], op[i+2]);
              polyline.push(p);
            }
            let opt = v.opt;
            if (!opt) {
              let color:string = c.getAttribute('strokeColor');
              const className = c.className.split(',');
              const strokeType = Number(className[2]);
              if (c.tagName === "GROUP") {
                  if (strokeType === EStrokeType.Stroke) {
                      color = c.getAttribute('bgcolor')
                  } else {
                      color = (c as Group).children[0].getAttribute('strokeColor')
                  }
              }
              const opacity = c.getAttribute('opacity');
              const scale = c.getAttribute('scale');
              const zIndex = c.getAttribute('zIndex');
              const rotate = c.getAttribute('rotate');
              const syncUnitTime = this.workOptions.syncUnitTime;
              opt = {
                color,
                opacity,
                syncUnitTime,
                zIndex,
                scale,
                rotate,
                strokeType,
              } as BaseShapeOptions;
            }
            this.curNodeMap.set(v.name, {
                name: v.name,
                rect: v.rect,
                polyline,
                opt,
                toolsType: v.toolsType || EToolsKey.Pencil
            })
          }
        })
    }
    updataNodeMap(key:string, value: {name:string, toolsType:EToolsKey, op:number[], rect:IRectType, opt: BaseShapeOptions}){
      const op = value.op;
      const polyline:Vec2d[] = [];
      for (let i = 0; i < op.length; i+=3) {
        const p = new Vec2d(op[i] * this.worldScaling[0] + this.worldPosition[0], op[i+1] * this.worldScaling[1] + this.worldPosition[1], op[i+2]);
        polyline.push(p);
      }
      this.curNodeMap.set(key,{
        name: value.name,
        rect: value.rect,
        polyline,
        opt: value.opt,
        toolsType: value.toolsType || EToolsKey.Pencil
      })
    }
    combineConsume() {
      return undefined
    }
    private createEraserRect(point:number[]) {
      const x = point[0] * this.worldScaling[0] + this.worldPosition[0];
      const y = point[1] * this.worldScaling[1] + this.worldPosition[1];
      const {width, height} = EraserShape.eraserSizes[this.workOptions.thickness];
      this.eraserRect = {
        x: x - width * 0.5,
        y: y - height * 0.5,
        w: width,
        h: height,
      }
      this.eraserPolyline = [this.eraserRect.x, this.eraserRect.y, this.eraserRect.x + this.eraserRect.w, this.eraserRect.y + this.eraserRect.h];
    }
    public consumeService(): IRectType | undefined {
      return undefined;
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
      if (workState === EvevtWorkState.Start) {
        props.nodeMaps && this.computNodeMap(props.nodeMaps);
      }
      if (this.isSamePoint([op[0],op[1]], [this.tmpPoints[0],this.tmpPoints[1]])) {
        return { type: EPostMessageType.None}
      }
      if (props.nodeMaps) {
        this.tmpPoints = op;
        this.createEraserRect(op)
        const {rect, removeIds, newWorkDatas} = this.remove();
        if (rect && removeIds.length) {
          return {
            type: EPostMessageType.RemoveNode,
            dataType: EDataType.Local,
            rect,
            removeIds,
            newWorkDatas
          }
        }
      }
      return {
        type: EPostMessageType.None
      }
    }
    private cutPolyline(inters: Vec2d[][], polyline: Vec2d[]) {
      let result:Array<Vec2d[]> = [polyline];
      let i = 0;
      while (i < inters.length) {
          const cur = inters[i];
          if (cur.length<2) {
            break;
          }
          result = cutOneLine(result, cur);
          i++;
      }
      return result;
      
      function cutOneLine(polylines:Array<Vec2d[]>, interOne:Vec2d[]) {
        const result = polylines;
        for (let i = 0; i < polylines.length; i++) {
          const line = polylines[i];
          const index = line.findIndex((l,i)=>{
            if (i < line.length -1) {
              return isSameLine([l, line[i+1]], [interOne[0],interOne[1]])
            }
            return false
          });
          if (index ===-1){
            continue;
          }
          if (index > -1) {
            const r:Vec2d[][] = [];
            const firstLine = line.slice(0,index+1);          
            if (!Vec2d.Equals(line[index],interOne[0])) {
              firstLine.push(interOne[0].clone().setz(line[index].z))
            }
            if (firstLine.length > 1) {
              r.push(firstLine);
            }
            if (index + interOne.length - 1 < line.length -1) {
              const lastIndex= index + interOne.length - 1;
              const endLine = line.slice(lastIndex);
              const lastPoint = interOne[interOne.length - 1];
              if (!Vec2d.Equals(line[lastIndex], lastPoint)) {
                endLine.unshift(lastPoint.clone().setz(line[lastIndex].z))
              }
              if (endLine.length>1) {
                r.push(endLine);
              }
            }
            result.splice(i, 1, ...r);
            return result;
          }
        }
        return result;
      }
      function isSameLine(line1:[Vec2d, Vec2d], line2:[Vec2d, Vec2d]) {
        // console.log('isSameLine1', line1, line2)
        const Vec1 = Vec2d.Sub(line1[1], line1[0]);
        const Vec2 = Vec2d.Sub(line2[1], line2[0]);
        const Vec3 = Vec2d.Sub(line2[0], line1[0]);
        // console.log('isSameLine', Vec1, Vec2, Vec3)
        if (Math.abs(Vec2d.Cpr(Vec1,Vec2)) < 0.1 && Math.abs(Vec2d.Cpr(Vec1,Vec3)) < 0.1) {
          return true;
        }
        return false;
      }
    }
    private isSamePoint(p1:[number,number],p2:[number,number]){
      return p1[0] === p2[0] && p1[1] === p2[1];
    }
    private translateIntersect(intersect:Array<[number,number]>[]) {
      const res:Array<Vec2d[]>=[];
      for (let i = 0; i < intersect.length; i++) {
        const inter = intersect[i].filter((v,i, arr)=>{
          if (i > 0 && this.isSamePoint(v,arr[i-1])) {
            return false;
          }
          return true
        })
        const iArr:Vec2d[] = [];
        let j = 0;
        while (j < inter.length) {
            const cur = inter[j];
            const p = new Vec2d(cur[0],cur[1]);
            // let vec:Vec2d|undefined;
            // if (j === inter.length - 1) {
            //   vec = Vec2d.Sub(new Vec2d(cur[0],cur[1]), new Vec2d(inter[j-1][0],inter[j-1][1])).uni();
            // } else {
            //   vec = Vec2d.Sub(new Vec2d(inter[j+1][0],inter[j+1][1]), new Vec2d(cur[0],cur[1])).uni();
            // }
            // p.setv(vec);
            iArr.push(p);
            j++;
        }
        res.push(iArr);
      }
      return res;
    }
    private remove(): {
      rect:IRectType | undefined,
      removeIds: Array<string>,
      newWorkDatas?:Array<{
        workId: string;
        op: number[];
        opt: BaseShapeOptions;
        toolsType: EToolsKey;
      }>
    } {
        const { isLine } = this.workOptions;
        let rect:IRectType|undefined;
        const removeIds: Array<string> = [];
        const removeNodes: Array<Node> = [];
        const newWorkDatas:Array<{
          opt: BaseShapeOptions;
          op: number[];
          workId: string;
          toolsType: EToolsKey;
        }> = [];
        this.curNodeMap.forEach((np, key)=>{
          const node = this.fullLayer.getElementsByName(np.name)[0];
          if (node && np.rect && this.eraserRect && this.eraserPolyline && isIntersect(this.eraserRect, np.rect)) {
            if (np.polyline.length > 1) {
              const intersect = lineclip.polyline(np.polyline.map(p=>p.XY), this.eraserPolyline);
              if (intersect.length) {
                removeNodes.push(node);
                removeIds.push(np.name);
                this.removeIds.push(np.name);
                if (!isLine) {
                  const intersectArr = this.translateIntersect(intersect);
                  const newLines = this.cutPolyline(intersectArr, np.polyline);
                  for (let i = 0; i < newLines.length; i++) {
                    const workId = `${key}_s_${i}`;
                    const op:number[] = [];
                    newLines[i].forEach(o => {
                      op.push((o.x - this.worldPosition[0]) / this.worldScaling[0] , (o.y - this.worldPosition[1])/ this.worldScaling[1] , o.z);
                    })
                    newWorkDatas.push({
                      workId,
                      op,
                      opt: np.opt,
                      toolsType: np.toolsType
                    })
                  }
                }
              }
            } else {
              removeNodes.push(node);
              removeIds.push(np.name);
              this.removeIds.push(np.name);
            }
            rect = computRect(rect, np.rect);
          }
        })
        removeNodes.forEach(r=>r.remove());
        if (rect) {
          rect.x -= EraserShape.SafeBorderPadding;
          rect.y -= EraserShape.SafeBorderPadding;
          rect.w += EraserShape.SafeBorderPadding * 2;
          rect.h += EraserShape.SafeBorderPadding * 2;
        }
        return {rect, removeIds, newWorkDatas};
    }
    public consumeAll(props:{data: IWorkerMessage, nodeMaps: Map<string, BaseNodeMapItem>}): IMainMessage {
      return this.consume(props);
    }
    public clearTmpPoints(): void {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
    }
}