/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, BaseNodeMapItem, IworkId } from "../types";
import { computRect, getRectFromPoints, isIntersect } from "../utils";
import { Vec2d } from "../utils/primitives/Vec2d";
import lineclip from "lineclip";
import type { Size } from "white-web-sdk";
import { Point2d } from "../utils/primitives/Point2d";

export interface EraserOptions extends BaseShapeOptions {
    thickness: number;
    isLine: boolean;
}
export class EraserShape extends BaseShapeTool{
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.none;
    readonly toolsType: EToolsKey = EToolsKey.Eraser;
    private static readonly eraserSizes: readonly Size[] = Object.freeze([
      Object.freeze({ width: 18, height: 26 }),
      Object.freeze({ width: 26, height: 34 }),
      Object.freeze({ width: 34, height: 50 }),
    ]);
    protected tmpPoints: Array<number> = [];
    protected workOptions: EraserOptions;
    worldPosition:[number, number];
    worldScaling:[number, number];
    eraserRect:IRectType | undefined;
    eraserPolyline?:[number,number,number,number];
    constructor(props:BaseShapeToolProps) {
      super(props);
      this.workOptions = props.toolsOpt as EraserOptions;
      this.worldPosition = this.fullLayer.worldPosition as [number, number];
      this.worldScaling = this.fullLayer.worldScaling as [number, number];
    }
    combineConsume() {
      return undefined
    }
    consumeService(): IRectType | undefined {
      return undefined;
    }
    setWorkOptions(setWorkOptions: EraserOptions) {
        super.setWorkOptions(setWorkOptions);
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
    private computRectCenterPoints(){
      const ps = this.tmpPoints.slice(-2);
      if (this.tmpPoints.length === 4) {
        const v1 = new Vec2d(this.tmpPoints[0],this.tmpPoints[1]);
        const v2 = new Vec2d(this.tmpPoints[2],this.tmpPoints[3]);
        const v3 = Vec2d.Sub(v2,v1).uni();
        const distance = Vec2d.Dist(v1,v2);
        const {width, height} = EraserShape.eraserSizes[this.workOptions.thickness];
        const vd = Math.min(width,height);
        const count = Math.round(distance / vd);
        if (count > 1) {
          const points:number[] = [];
          for (let i = 0; i < count; i++) {
            const np = Vec2d.Mul(v3, i * vd);
            points.push(this.tmpPoints[0] + np.x, this.tmpPoints[1] + np.y);
          }
          return points.concat(ps);
        }
      }
      return ps;
    }
    private isNear(p1:[number,number],p2:[number,number]){
      const v1 = new Vec2d(p1[0],p1[1]);
      const v2 = new Vec2d(p2[0],p2[1]);
      const {width, height} = EraserShape.eraserSizes[this.workOptions.thickness];
      return Vec2d.Dist(v1,v2) < Math.hypot(width,height) * 0.5;
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
    private remove(props:{
      curNodeMap: Map<string, BaseNodeMapItem>;
      removeIds:Set<string>;
      newWorkDatas: Map<string,{
        op: number[];
        opt: BaseShapeOptions;
        workId: IworkId;
        toolsType: EToolsKey;
      }>}): IRectType | undefined
       {
        const {curNodeMap,removeIds, newWorkDatas} = props;
        const { isLine } = this.workOptions;
        let rect:IRectType|undefined;
        for (const [key, np] of curNodeMap.entries()) {
          if (np.rect && this.eraserRect && this.eraserPolyline && isIntersect(this.eraserRect, np.rect)) {
            const op = np.op;
            if (!op?.length) {
              continue;
            }
            const ps:Point2d[]= [];
            const polyline:Vec2d[] = [];
            for (let i = 0; i < op.length; i+=3) {
              const p = new Vec2d(op[i] * this.worldScaling[0] + this.worldPosition[0], op[i+1] * this.worldScaling[1] + this.worldPosition[1], op[i+2]);
              polyline.push(p);
              ps.push(new Point2d(p.x,p.y));
            }
            const rect1 = getRectFromPoints(ps);
            if (isIntersect(rect1,this.eraserRect)) {
              if (polyline.length > 1) {
                const intersect = lineclip.polyline(polyline.map(p=>p.XY), this.eraserPolyline);
                if (intersect.length) {
                  removeIds.add(np.name);
                  if (!isLine && np.toolsType === EToolsKey.Pencil) {
                    const intersectArr = this.translateIntersect(intersect);
                    const newLines = this.cutPolyline(intersectArr, polyline);
                    for (let i = 0; i < newLines.length; i++) {
                      const workId = `${key}_s_${i}`;
                      const op:number[] = [];
                      newLines[i].forEach(o => {
                        op.push((o.x - this.worldPosition[0]) / this.worldScaling[0] , (o.y - this.worldPosition[1])/ this.worldScaling[1] , o.z);
                      })
                      if (np.opt && np.toolsType && this.vNodes) {
                        this.vNodes.setInfo(workId, {
                          rect: rect1 || np.rect,
                          op: op,
                          opt: np.opt,
                          canRotate: np.canRotate,
                          scaleType: np.scaleType,
                          toolsType: np.toolsType,
                        })
                        newWorkDatas.set(workId, {
                          workId,
                          op,
                          opt: np.opt,
                          toolsType: np.toolsType
                        })
                      }
  
                    }
                  }
                }
              } else {
                removeIds.add(np.name);
              }
              rect = computRect(rect, rect1);
            }
          }
        }
        removeIds.forEach(r=>this.vNodes?.delete(r));
        if (rect) {
          rect.x -= BaseShapeTool.SafeBorderPadding;
          rect.y -= BaseShapeTool.SafeBorderPadding;
          rect.w += BaseShapeTool.SafeBorderPadding * 2;
          rect.h += BaseShapeTool.SafeBorderPadding * 2;
        }
        return rect;
    }
    consume(props:{data: IWorkerMessage}): IMainMessage {
      const {op} = props.data;
      if(!op || op.length === 0){
        return { 
          type: EPostMessageType.None
        }
      }
      const oldTmpLength = this.tmpPoints.length;
      if (oldTmpLength > 1 && this.isNear([op[0],op[1]], [this.tmpPoints[oldTmpLength-2],this.tmpPoints[oldTmpLength-1]])) {
        return { 
          type: EPostMessageType.None
        }
      }
      if (oldTmpLength === 4) {
        this.tmpPoints.shift();
        this.tmpPoints.shift();
      }
      this.tmpPoints.push(op[0], op[1]);
      const points = this.computRectCenterPoints();
      let totalRect:IRectType|undefined;
      const removeIds:Set<string> = new Set();
      const newWorkDatas: Map<string,{
        op: number[];
        opt: BaseShapeOptions;
        workId: IworkId;
        toolsType: EToolsKey;
      }> = new Map();
      this.vNodes.setTarget();
      for (let i = 0; i < points.length-1; i+=2) {
        this.createEraserRect(points.slice(i,i+2));
        const rect = this.remove({curNodeMap: this.vNodes.getLastTarget(), removeIds, newWorkDatas});
        totalRect = computRect(totalRect, rect);
      }
      this.vNodes.deleteLastTarget();
      if (totalRect && removeIds.size) {
        for (const key of newWorkDatas.keys()) {
          if (removeIds.has(key)) {
            newWorkDatas.delete(key);
          }
        }
        // console.log('totalRemoveIds', totalRemoveIds)
        return {
          type: EPostMessageType.RemoveNode,
          dataType: EDataType.Local,
          rect: totalRect,
          removeIds: [...removeIds],
          newWorkDatas
        }
      }
      return {
        type: EPostMessageType.None
      }
    }
    consumeAll(props: { data: IWorkerMessage}): IMainMessage {
      return this.consume(props);
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
    }
}